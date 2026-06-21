import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables (.env.local)
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("❌ DATABASE_URL is not defined in .env.local");
  process.exit(1);
}

// Decode helper (matching src/lib/db.ts)
function decodePrismaPostgresUrl(connectionString: string) {
  if (!connectionString.startsWith('prisma+postgres://')) {
    return connectionString;
  }
  try {
    const url = new URL(connectionString);
    const apiKey = url.searchParams.get('api_key');
    if (!apiKey) return connectionString;
    let normalized = apiKey.replace(/-/g, '+').replace(/_/g, '/');
    const remainder = normalized.length % 4;
    if (remainder) normalized += '='.repeat(4 - remainder);
    const decoded = JSON.parse(Buffer.from(normalized, 'base64').toString('utf8'));
    return decoded.databaseUrl || connectionString;
  } catch {
    return connectionString;
  }
}

// Setup PostgreSQL pool and driver adapter
const pool = new Pool({ 
  connectionString: decodePrismaPostgresUrl(dbUrl),
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 60000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const backupPath = path.join(process.cwd(), 'live_db_backup.json');
  if (!fs.existsSync(backupPath)) {
    console.error(`❌ Backup file not found at: ${backupPath}`);
    process.exit(1);
  }

  console.log("⚡ Reading backup file...");
  const data = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

  console.log("🚀 Starting database restore...");
  try {
    // Disable constraints or clear existing data (caution: clears existing tables to prevent duplicates)
    console.log("🧹 Cleaning existing local database tables...");
    await prisma.$transaction([
      prisma.orderItem.deleteMany(),
      prisma.order.deleteMany(),
      prisma.address.deleteMany(),
      prisma.customer.deleteMany(),
      prisma.wishlist.deleteMany(),
      prisma.review.deleteMany(),
      prisma.variant.deleteMany(),
      prisma.product.deleteMany(),
      prisma.category.deleteMany(),
      prisma.user.deleteMany(),
      prisma.promoCode.deleteMany(),
      prisma.homepageSection.deleteMany(),
    ]);

    // Restore HomepageSections
    if (data.homepageSections?.length) {
      console.log(`🌱 Restoring HomepageSections (${data.homepageSections.length})...`);
      await prisma.homepageSection.createMany({ data: data.homepageSections });
    }

    // Restore PromoCodes
    if (data.promoCodes?.length) {
      console.log(`🌱 Restoring PromoCodes (${data.promoCodes.length})...`);
      await prisma.promoCode.createMany({ data: data.promoCodes });
    }

    // Restore Categories (Need to handle parent-child hierarchy safely)
    if (data.categories?.length) {
      console.log(`🌱 Restoring Categories (${data.categories.length})...`);
      // First insert categories without parentId to avoid foreign key violations
      const categoriesWithoutParent = data.categories.map((c: any) => ({
        id: c.id,
        name_en: c.name_en,
        name_ar: c.name_ar,
        name_fr: c.name_fr,
        slug: c.slug,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      }));
      await prisma.category.createMany({ data: categoriesWithoutParent });

      // Then update parentId for categories that have one
      for (const cat of data.categories) {
        if (cat.parentId) {
          await prisma.category.update({
            where: { id: cat.id },
            data: { parentId: cat.parentId },
          });
        }
      }
    }

    // Restore Products
    if (data.products?.length) {
      console.log(`🌱 Restoring Products (${data.products.length})...`);
      const productsData = data.products.map((p: any) => ({
        ...p,
        basePrice: Number(p.basePrice),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }));
      await prisma.product.createMany({ data: productsData });
    }

    // Restore Variants
    if (data.variants?.length) {
      console.log(`🌱 Restoring Variants (${data.variants.length})...`);
      const variantsData = data.variants.map((v: any) => ({
        ...v,
        price: v.price ? Number(v.price) : null,
      }));
      await prisma.variant.createMany({ data: variantsData });
    }

    // Restore Users
    if (data.users?.length) {
      console.log(`🌱 Restoring Users (${data.users.length})...`);
      const usersData = data.users.map((u: any) => ({
        ...u,
        emailVerified: u.emailVerified ? new Date(u.emailVerified) : null,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt),
      }));
      await prisma.user.createMany({ data: usersData });
    }

    // Restore Customers
    if (data.customers?.length) {
      console.log(`🌱 Restoring Customers (${data.customers.length})...`);
      const customersData = data.customers.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      }));
      await prisma.customer.createMany({ data: customersData });
    }

    // Restore Addresses
    if (data.addresses?.length) {
      console.log(`🌱 Restoring Addresses (${data.addresses.length})...`);
      await prisma.address.createMany({ data: data.addresses });
    }

    // Restore Orders
    if (data.orders?.length) {
      console.log(`🌱 Restoring Orders (${data.orders.length})...`);
      const ordersData = data.orders.map((o: any) => ({
        ...o,
        totalAmount: Number(o.totalAmount),
        shippingCost: Number(o.shippingCost),
        createdAt: new Date(o.createdAt),
        updatedAt: new Date(o.updatedAt),
      }));
      await prisma.order.createMany({ data: ordersData });
    }

    // Restore OrderItems
    if (data.orderItems?.length) {
      console.log(`🌱 Restoring OrderItems (${data.orderItems.length})...`);
      const itemsData = data.orderItems.map((oi: any) => ({
        ...oi,
        price: Number(oi.price),
      }));
      await prisma.orderItem.createMany({ data: itemsData });
    }

    // Restore Wishlists
    if (data.wishlists?.length) {
      console.log(`🌱 Restoring Wishlists (${data.wishlists.length})...`);
      const wishlistsData = data.wishlists.map((w: any) => ({
        ...w,
        createdAt: new Date(w.createdAt),
      }));
      await prisma.wishlist.createMany({ data: wishlistsData });
    }

    // Restore Reviews
    if (data.reviews?.length) {
      console.log(`🌱 Restoring Reviews (${data.reviews.length})...`);
      const reviewsData = data.reviews.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
      }));
      await prisma.review.createMany({ data: reviewsData });
    }

    console.log("\n✅ Database restore completed successfully!");
  } catch (error) {
    console.error("❌ Restore failed:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
