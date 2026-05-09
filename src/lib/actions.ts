'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import prisma from './db';
import { auth } from './auth';

type CartInputItem = {
  productId: string;
  quantity: number;
};

type OrderInput = {
  fullName: string;
  phone: string;
  wilaya: string;
  commune: string;
  addressDetails: string;
  items: CartInputItem[];
};

async function requireAdmin() {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function getSession() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return {
    userId: session.user.id,
    role: (session.user as { role?: string }).role,
    email: session.user.email,
  };
}

export async function registerUser(data: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}) {
  try {
    const email = data.email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: 'Email already exists' };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const [firstName, ...rest] = data.fullName.trim().split(/\s+/);
    const lastName = rest.join(' ') || firstName || 'Customer';

    await prisma.user.create({
      data: {
        name: data.fullName.trim(),
        email,
        passwordHash,
        phone: data.phone?.trim() || null,
        customer: {
          create: {
            firstName: firstName || 'Customer',
            lastName,
          },
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to register user:', error);
    return { success: false, error: 'Failed to create account' };
  }
}

export async function createOrder(data: OrderInput) {
  try {
    if (!data.items?.length) {
      return { success: false, error: 'Cart is empty' };
    }

    const productIds = data.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((product) => [product.id, product]));
    for (const item of data.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return { success: false, error: 'One or more products are unavailable' };
      }
      if (item.quantity < 1 || product.stock < item.quantity) {
        return { success: false, error: `${product.name_en} is out of stock` };
      }
    }

    const shippingCost = data.wilaya.toLowerCase().includes('alger') ? 300 : 600;
    const subtotal = data.items.reduce((sum, item) => {
      const product = productMap.get(item.productId)!;
      const price = Number(product.salePrice ?? product.basePrice);
      return sum + price * item.quantity;
    }, 0);

    const session = await auth();
    const fullName = data.fullName.trim();
    const [firstName, ...rest] = fullName.split(/\s+/);
    const lastName = rest.join(' ') || firstName || 'Customer';

    const order = await prisma.$transaction(async (tx) => {
      let userId = session?.user?.id;
      let customer = userId
        ? await tx.customer.findUnique({ where: { userId } })
        : null;

      if (!customer) {
        const guestUser = userId
          ? await tx.user.update({
              where: { id: userId },
              data: { name: fullName, phone: data.phone.trim() },
            })
          : await tx.user.create({
              data: {
                name: fullName,
                email: `guest-${Date.now()}-${Math.random().toString(36).slice(2)}@checkout.mbpuff.local`,
                phone: data.phone.trim(),
              },
            });

        userId = guestUser.id;
        customer = await tx.customer.create({
          data: {
            userId: guestUser.id,
            firstName: firstName || 'Customer',
            lastName,
          },
        });
      }

      const createdOrder = await tx.order.create({
        data: {
          customerId: customer.id,
          userId,
          totalAmount: subtotal + shippingCost,
          shippingCost,
          wilaya: data.wilaya.trim(),
          commune: data.commune.trim() || '-',
          addressDetails: data.addressDetails.trim(),
          customerPhone: data.phone.trim(),
          paymentMethod: 'COD',
          items: {
            create: data.items.map((item) => {
              const product = productMap.get(item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.salePrice ?? product.basePrice,
              };
            }),
          },
        },
      });

      return createdOrder;
    });

    revalidatePath('/[locale]/admin/orders', 'page');
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Failed to create order:', error);
    return { success: false, error: 'Failed to create order' };
  }
}

export async function updateOrderStatus(orderId: string, nextStatus: string) {
  try {
    await requireAdmin();
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return { success: false, error: 'Order not found' };

    const prevStatus = order.status;
    
    // Logic: Stock is only "taken off" when status becomes CONFIRMED or SHIPPING.
    // Logic: Stock is "returned" if it was already taken off but now cancelled/returned.
    
    const wasDeducted = ['CONFIRMED', 'SHIPPING', 'DELIVERED'].includes(prevStatus);
    const shouldBeDeducted = ['CONFIRMED', 'SHIPPING', 'DELIVERED'].includes(nextStatus);

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: nextStatus as any },
      });

      if (!wasDeducted && shouldBeDeducted) {
        // Take off from items
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      } else if (wasDeducted && !shouldBeDeducted && (nextStatus === 'CANCELLED' || nextStatus === 'RETURNED')) {
        // Back to items
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    });

    revalidatePath('/[locale]/admin/orders', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to update order status:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}

export async function createProduct(data: any) {
  try {
    await requireAdmin();
    if (!data.images?.length || !data.mainImage) {
      return { success: false, error: 'At least one product image is required' };
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        images: data.images?.length ? data.images : [data.mainImage],
      },
    });
    revalidatePath('/[locale]/admin/products', 'page');
    revalidatePath('/[locale]/search', 'page');
    revalidatePath('/[locale]', 'page');
    return { success: true, productId: product.id };
  } catch (error) {
    console.error('Failed to create product:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    await requireAdmin();
    if (!data.images?.length || !data.mainImage) {
      return { success: false, error: 'At least one product image is required' };
    }

    await prisma.product.update({
      where: { id },
      data: {
        ...data,
        images: data.images?.length ? data.images : [data.mainImage],
      },
    });
    revalidatePath('/[locale]/admin/products', 'page');
    revalidatePath('/[locale]/search', 'page');
    revalidatePath('/[locale]', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to update product:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

export async function deleteProduct(id: string) {
  try {
    await requireAdmin();
    await prisma.product.delete({ where: { id } });
    revalidatePath('/[locale]/admin/products', 'page');
    revalidatePath('/[locale]/search', 'page');
    revalidatePath('/[locale]', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}

export async function createCategory(data: any) {
  try {
    await requireAdmin();
    const cat = await prisma.category.create({ data });
    revalidatePath('/[locale]/admin/categories', 'page');
    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/search', 'page');
    return { success: true, categoryId: cat.id };
  } catch (error) {
    console.error('Failed to create category:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateCategory(id: string, data: any) {
  try {
    await requireAdmin();
    await prisma.category.update({ where: { id }, data });
    revalidatePath('/[locale]/admin/categories', 'page');
    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/search', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to update category:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string) {
  try {
    await requireAdmin();
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return { success: false, error: 'Move or delete products in this category first' };
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath('/[locale]/admin/categories', 'page');
    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/search', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete category:', error);
    return { success: false, error: 'Failed to delete category' };
  }
}
