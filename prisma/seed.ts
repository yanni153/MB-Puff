import bcrypt from 'bcryptjs';
import prisma from '../src/lib/db';

const products: Array<{
  name: string;
  slug: string;
  basePrice: number;
  salePrice: number | null;
  categorySlug: string;
  stock: number;
  images: string[];
}> = [
  {
    name: 'JNR 60000',
    slug: 'jnr-60000',
    basePrice: 5500,
    salePrice: null,
    categorySlug: 'disposable-vapes',
    stock: 50,
    images: ['/products/jnr-60000-side.jpeg']
  },
  {
    name: 'JNR Leopard 40000 Blueberry On Ice',
    slug: 'jnr-leopard-40000-blueberry-on-ice',
    basePrice: 4500,
    salePrice: null,
    categorySlug: 'disposable-vapes',
    stock: 50,
    images: ['/products/jnr-leopard-40000-blueberry-on-ice-front.jpeg']
  },
  {
    name: 'JNR Leopard 40000 Mixed Berry',
    slug: 'jnr-leopard-40000-mixed-berry',
    basePrice: 4500,
    salePrice: null,
    categorySlug: 'disposable-vapes',
    stock: 50,
    images: ['/products/jnr-leopard-40000-mixed-berry-front.jpeg']
  },
  {
    name: 'JNR Leopard 40000 Strawberry Kiwi',
    slug: 'jnr-leopard-40000-strawberry-kiwi',
    basePrice: 4500,
    salePrice: null,
    categorySlug: 'disposable-vapes',
    stock: 50,
    images: ['/products/jnr-leopard-40000-strawberry-kiwi-front.jpeg']
  },
  {
    name: 'JNR Lila Kiss Peach Berry',
    slug: 'jnr-lila-kiss-peach-berry',
    basePrice: 3000,
    salePrice: null,
    categorySlug: 'disposable-vapes',
    stock: 50,
    images: ['/products/jnr-lila-kiss-peach-berry-front.jpeg']
  },
  {
    name: 'Lion King JNR 42000 Strawberry Ice',
    slug: 'lion-king-jnr-42000-strawberry-ice',
    basePrice: 4800,
    salePrice: null,
    categorySlug: 'disposable-vapes',
    stock: 50,
    images: ['/products/lion-king-jnr-42000-strawberry-ice-front.jpeg']
  },
  {
    name: 'RandM Tornado 9000 Black Ice',
    slug: 'randm-tornado-9000-black-ice',
    basePrice: 2500,
    salePrice: null,
    categorySlug: 'disposable-vapes',
    stock: 50,
    images: ['/products/randm-tornado-9000-black-ice-front.jpeg']
  },
  {
    name: 'RandM Tornado 9000 Blue Razz Kush',
    slug: 'randm-tornado-9000-blue-razz-kush',
    basePrice: 2500,
    salePrice: null,
    categorySlug: 'disposable-vapes',
    stock: 50,
    images: [
      '/products/randm-tornado-9000-blue-razz-kush-front.jpeg',
      '/products/randm-tornado-9000-blue-razz-kush-side.jpeg'
    ]
  },
  {
    name: 'RandM Tornado 9000 Fizzy Cherry',
    slug: 'randm-tornado-9000-fizzy-cherry',
    basePrice: 2500,
    salePrice: null,
    categorySlug: 'disposable-vapes',
    stock: 50,
    images: [
      '/products/randm-tornado-9000-fizzy-cherry-front.jpeg',
      '/products/randm-tornado-9000-fizzy-cherry-side.jpeg',
      '/products/randm-tornado-9000-fizzy-cherry-side-2.jpeg'
    ]
  },
  {
    name: 'RandM Tornado 9000 Lemon Lime',
    slug: 'randm-tornado-9000-lemon-lime',
    basePrice: 2500,
    salePrice: null,
    categorySlug: 'disposable-vapes',
    stock: 50,
    images: [
      '/products/randm-tornado-9000-lemon-lime-front.jpeg',
      '/products/randm-tornado-9000-lemon-lime-side.jpeg'
    ]
  },
  {
    name: 'RandM Tornado 9000 Pink Lemonade',
    slug: 'randm-tornado-9000-pink-lemonade',
    basePrice: 2500,
    salePrice: null,
    categorySlug: 'disposable-vapes',
    stock: 50,
    images: [
      '/products/randm-tornado-9000-pink-lemonade-front.jpeg',
      '/products/randm-tornado-9000-pink-lemonade-side.jpeg'
    ]
  },
  {
    name: 'RandM Tornado 9000 Watermelon Bubble Gum',
    slug: 'randm-tornado-9000-watermelon-bubble-gum',
    basePrice: 2500,
    salePrice: null,
    categorySlug: 'disposable-vapes',
    stock: 50,
    images: [
      '/products/randm-tornado-9000-watermelon-bubble-gum-front.jpeg',
      '/products/randm-tornado-9000-watermelon-bubble-gum-side.jpeg'
    ]
  },
  {
    name: 'Vozol Star 20000 Mango Ice',
    slug: 'vozol-star-20000-mango-ice',
    basePrice: 3500,
    salePrice: null,
    categorySlug: 'disposable-vapes',
    stock: 50,
    images: [
      '/products/vozol-star-20000-mango-ice-front.jpeg',
      '/products/vozol-star-20000-mango-ice-side.jpeg'
    ]
  }
];

async function main() {
  console.log('Starting seed...');

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Mohamed@147*258*369', 10);
  await prisma.user.create({
    data: {
      email: 'admin@mbpuff.dz',
      name: 'MB Puff Admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const categoryData = [
    { name_en: 'Accessories', name_fr: 'Accessoires', name_ar: 'اكسسوارات', slug: 'accessories' },
    { name_en: 'Box Mods', name_fr: 'Box Mods', name_ar: 'أجهزة بوكس مود', slug: 'box-mods' },
    { name_en: 'Disposable Vapes', name_fr: 'Vapes Jetables', name_ar: 'فيب للاستعمال الواحد', slug: 'disposable-vapes' },
    { name_en: 'E-Liquids', name_fr: 'E-Liquides', name_ar: 'سوائل إلكترونية', slug: 'e-liquids' },
    { name_en: 'Pod Systems', name_fr: 'Systèmes Pod', name_ar: 'أجهزة البود', slug: 'pod-systems' },
  ];

  const categories = new Map<string, string>();
  for (const category of categoryData) {
    const created = await prisma.category.create({ data: category });
    categories.set(category.slug, created.id);
  }

  for (const product of products) {
    await prisma.product.create({
      data: {
        name_en: product.name,
        name_fr: product.name,
        name_ar: product.name,
        desc_en: `${product.name} original vape product available in Algeria.`,
        desc_fr: `${product.name} produit vape original disponible en Algerie.`,
        desc_ar: `${product.name} منتج فيب أصلي متوفر في الجزائر.`,
        slug: product.slug,
        basePrice: product.basePrice,
        salePrice: product.salePrice,
        stock: product.stock,
        mainImage: product.images[0],
        images: product.images,
        isFeatured: product.salePrice !== null,
        categoryId: categories.get(product.categorySlug)!,
      },
    });
  }

  await prisma.promoCode.createMany({
    data: [
      { code: 'MEZZA10', discountPercent: 10, maxUses: 100 },
      { code: 'WELCOME20', discountPercent: 20, maxUses: 50 },
    ],
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
