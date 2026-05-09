'use client';

import { Trash2, Edit } from 'lucide-react';
import { deleteCategory } from '@/lib/actions';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function CategoryListClient({ categories }: { categories: any[] }) {
    const locale = useLocale();
    const router = useRouter();
    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            const result = await deleteCategory(id);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error || 'Error deleting category');
            }
        }
    };

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-surface)', textAlign: 'left' }}>
                <tr>
                    <th style={{ padding: 'var(--space-md)' }}>Name (AR)</th>
                    <th style={{ padding: 'var(--space-md)' }}>Name (FR)</th>
                    <th style={{ padding: 'var(--space-md)' }}>Name (EN)</th>
                    <th style={{ padding: 'var(--space-md)' }}>Slug</th>
                    <th style={{ padding: 'var(--space-md)' }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {categories.map((cat) => (
                    <tr key={cat.id} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: 'var(--space-md)' }}>{cat.name_ar}</td>
                        <td style={{ padding: 'var(--space-md)' }}>{cat.name_fr}</td>
                        <td style={{ padding: 'var(--space-md)' }}>{cat.name_en}</td>
                        <td style={{ padding: 'var(--space-md)' }}>{cat.slug}</td>
                        <td style={{ padding: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
                            <Link 
                                href={`/${locale}/admin/categories/${cat.id}/edit`}
                                style={{ color: 'var(--secondary)' }}
                            >
                                <Edit size={18} />
                            </Link>
                            <button 
                                onClick={() => handleDelete(cat.id)}
                                style={{ color: '#E53935' }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
