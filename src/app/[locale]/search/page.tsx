import { getTranslations } from 'next-intl/server';
import type { Prisma } from '@prisma/client';
import prisma from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import SearchFilters from '@/components/SearchFilters';
import { Search } from 'lucide-react';
import { serializePrisma } from '@/lib/utils';

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string; minPrice?: string; maxPrice?: string; sort?: string }>
}) {
  const params = await searchParams;
  const t = await getTranslations('Search');
  
  const query = params.q || '';
  const categoryParam = params.category;

  let productsRaw: Prisma.ProductGetPayload<{ include: { category: true } }>[] = [];
  let categoriesRaw: Prisma.CategoryGetPayload<{}>[] = [];
  let resolvedCategoryId = '';

  try {
    const where: Prisma.ProductWhereInput = {};

    if (query) {
      where.OR = [
        { name_en: { contains: query, mode: 'insensitive' } },
        { name_ar: { contains: query, mode: 'insensitive' } },
        { name_fr: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (categoryParam) {
      const category = await prisma.category.findFirst({
        where: {
          OR: [
            { id: categoryParam },
            { slug: categoryParam },
          ],
        },
        select: { id: true },
      });
      if (category) {
        resolvedCategoryId = category.id;
        where.categoryId = category.id;
      } else {
        where.categoryId = '__missing_category__';
      }
    }

    const minPrice = Number(params.minPrice || 0);
    const maxPrice = Number(params.maxPrice || 0);
    if (minPrice || maxPrice) {
      where.basePrice = {
        ...(minPrice ? { gte: minPrice } : {}),
        ...(maxPrice ? { lte: maxPrice } : {}),
      };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      params.sort === 'price-asc'
        ? { basePrice: 'asc' }
        : params.sort === 'price-desc'
          ? { basePrice: 'desc' }
          : { createdAt: 'desc' };

    productsRaw = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
    });

    categoriesRaw = await prisma.category.findMany();
  } catch {
    console.warn('Search database fetch failed; rendering empty results.');
  }

  const products = serializePrisma(productsRaw);
  const categories = serializePrisma(categoriesRaw);
  const filterParams = { ...params, category: resolvedCategoryId || categoryParam || '' };

  return (
    <main style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: 'var(--space-2xl) 0' }}>
      <div className="container">
        {/* Search Header */}
        <div style={{ maxWidth: '800px', margin: '0 auto var(--space-4xl) auto', textAlign: 'center' }}>
            <div style={{ position: 'relative' }}>
                <Search size={22} color="var(--text-hint)" style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                    type="text" 
                    defaultValue={query}
                    placeholder={t('searchPlaceholder')}
                    style={{
                        width: '100%',
                        height: '60px',
                        padding: '0 32px 0 64px',
                        borderRadius: '99px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-main)',
                        fontSize: '18px',
                        outline: 'none',
                        boxShadow: 'var(--shadow-md)',
                        transition: 'all 0.3s ease'
                    }}
                />
            </div>
            <p style={{ marginTop: 'var(--space-md)', color: 'var(--text-muted)', fontSize: '14px' }}>
                {products.length} {t('resultsFound')} {query && `"${query}"`}
            </p>
        </div>

        <div className="search-layout">
          {/* Sidebar */}
          <aside className="sticky-panel" style={{ 
            background: 'var(--bg-surface)', 
            padding: 'var(--space-xl)', 
            borderRadius: '24px', 
            border: '1px solid var(--border)',
            height: 'fit-content',
          }}>
            <SearchFilters categories={categories} initialParams={filterParams} />
          </aside>

          {/* Results */}
          <div>
            {products.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-lg)' }}>
                {products.map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--space-4xl) 0' }}>
                <div style={{ color: 'var(--secondary)', marginBottom: 'var(--space-lg)' }}>
                    <Search size={64} opacity={0.3} />
                </div>
                <h3 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: 'var(--space-sm)' }}>{t('noResults')}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{t('tryDifferentKeywords')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
