const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ select: { name_en: true, slug: true } });
  console.log(products);
}

main().finally(() => prisma.$disconnect());
