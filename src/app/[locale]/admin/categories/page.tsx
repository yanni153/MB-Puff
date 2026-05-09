import prisma from '@/lib/db';
import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import CategoryListClient from '@/components/admin/CategoryListClient';
import { serializePrisma } from '@/lib/utils';

export default async function AdminCategoriesPage() {
    const locale = await getLocale();
    const categoriesRaw = await prisma.category.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    const categories = serializePrisma(categoriesRaw);

    return (
        <div style={{ padding: 'var(--space-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                <h1>Categories Management</h1>
                <Link href={`/${locale}/admin/categories/new`} style={{
                    background: 'var(--primary)',
                    color: 'white',
                    padding: 'var(--space-sm) var(--space-md)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    fontWeight: 600
                }}>
                    <Plus size={20} /> Add Category
                </Link>
            </div>
            
            <div className="glass mobile-scroll-table" style={{ borderRadius: 'var(--radius-lg)' }}>
                <CategoryListClient categories={categories} />
            </div>
        </div>
    );
}
