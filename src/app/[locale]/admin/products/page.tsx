import prisma from '@/lib/db';
import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import ProductListClient from '@/components/admin/ProductListClient';
import { serializePrisma } from '@/lib/utils';

export default async function AdminProductsPage() {
    const locale = await getLocale();
    const productsRaw = await prisma.product.findMany({
        include: {
            category: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    const products = serializePrisma(productsRaw);

    return (
        <div style={{ padding: 'var(--space-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                <h1>Products Management</h1>
                <Link href={`/${locale}/admin/products/new`} style={{
                    background: 'var(--primary)',
                    color: 'white',
                    padding: 'var(--space-sm) var(--space-md)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    fontWeight: 600
                }}>
                    <Plus size={20} /> Add Product
                </Link>
            </div>
            
            <div className="glass mobile-scroll-table" style={{ borderRadius: 'var(--radius-lg)' }}>
                <ProductListClient products={products} />
            </div>
        </div>
    );
}
