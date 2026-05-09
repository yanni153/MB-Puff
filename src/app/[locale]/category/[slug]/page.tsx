import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import { getLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { serializePrisma } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }): Promise<Metadata> {
    const { slug, locale } = await params;
    const t = await getTranslations('Category');
    const category = await prisma.category.findUnique({ where: { slug } }).catch(() => null);
    if (!category) return { title: t('notFound') };

    const name = (category as any)[`name_${locale}`];
    return {
        title: `${name} | MB Puff`,
        description: `Shop the best ${name} products in Algeria at MB Puff.`,
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const locale = await getLocale();
    const t = await getTranslations('Category');

    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            products: {
                orderBy: { createdAt: 'desc' }
            }
        }
    }).catch(() => null);

    if (!category) {
        notFound();
    }

    const name = (category as any)[`name_${locale}`];

    return (
        <main className="container animate-fade-in" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
            <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 700 }}>{name}</h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    {category.products.length} {t('productsFound')}
                </p>
            </div>

            {category.products.length > 0 ? (
                <ProductGrid products={serializePrisma(category.products)} />
            ) : (
                <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-muted)' }}>
                    {t('empty')}
                </div>
            )}
        </main>
    );
}
