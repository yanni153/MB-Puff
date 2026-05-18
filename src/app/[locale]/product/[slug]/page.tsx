import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { serializePrisma } from '@/lib/utils';
import ProductClient from '@/components/ProductClient';

export default async function ProductPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  let productRaw = null;
  try {
    productRaw = await prisma.product.findUnique({
      where: { slug: decodedSlug },
      include: { category: true }
    });
  } catch {
    console.warn('Product fetch failed; showing not found page.');
  }

  if (!productRaw) notFound();
  const product = serializePrisma(productRaw);

  return (
    <main style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      <ProductClient product={product} />
    </main>
  );
}
