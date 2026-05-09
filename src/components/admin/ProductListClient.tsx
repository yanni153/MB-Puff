'use client';

import { Trash2, Edit } from 'lucide-react';
import { deleteProduct } from '@/lib/actions';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function ProductListClient({ products }: { products: any[] }) {
    const locale = useLocale();
    const router = useRouter();
    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            const result = await deleteProduct(id);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error);
            }
        }
    };

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-surface)', textAlign: 'left' }}>
                <tr>
                    <th style={{ padding: 'var(--space-md)' }}>Image</th>
                    <th style={{ padding: 'var(--space-md)' }}>Name (EN)</th>
                    <th style={{ padding: 'var(--space-md)' }}>Category</th>
                    <th style={{ padding: 'var(--space-md)' }}>Price</th>
                    <th style={{ padding: 'var(--space-md)' }}>Stock</th>
                    <th style={{ padding: 'var(--space-md)' }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <tr key={product.id} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: 'var(--space-md)' }}>
                            <img src={product.mainImage} alt={product.name_en} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        </td>
                        <td style={{ padding: 'var(--space-md)' }}>{product.name_en}</td>
                        <td style={{ padding: 'var(--space-md)' }}>{product.category.name_en}</td>
                        <td style={{ padding: 'var(--space-md)', fontWeight: 600 }}>{Number(product.salePrice || product.basePrice)} DZD</td>
                        <td style={{ padding: 'var(--space-md)' }}>{product.stock}</td>
                        <td style={{ padding: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
                            <Link 
                                href={`/${locale}/admin/products/${product.id}/edit`}
                                style={{ color: 'var(--secondary)' }}
                            >
                                <Edit size={18} />
                            </Link>
                            <button 
                                onClick={() => handleDelete(product.id)}
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
