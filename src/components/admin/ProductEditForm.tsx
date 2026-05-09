'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { updateProduct } from '@/lib/actions';
import ProductImageUploader from './ProductImageUploader';

export default function ProductEditForm({ product, categories }: { product: any, categories: any[] }) {
    const router = useRouter();
    const { locale } = useParams();
    
    const [formData, setFormData] = useState({
        name_en: product.name_en,
        name_ar: product.name_ar,
        name_fr: product.name_fr,
        desc_en: product.desc_en,
        desc_ar: product.desc_ar,
        desc_fr: product.desc_fr,
        slug: product.slug,
        basePrice: product.basePrice.toString(),
        salePrice: product.salePrice ? product.salePrice.toString() : '',
        images: product.images?.length ? product.images : [product.mainImage].filter(Boolean),
        categoryId: product.categoryId,
        stock: product.stock.toString(),
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.images.length) {
            alert('Please upload at least one product image');
            return;
        }

        setIsSubmitting(true);
        const result = await updateProduct(product.id, {
            ...formData,
            mainImage: formData.images[0],
            basePrice: parseFloat(formData.basePrice),
            salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
            stock: parseInt(formData.stock)
        });
        
        if (result.success) {
            router.push(`/${locale}/admin/products`);
            router.refresh();
        } else {
            alert('Error updating product');
        }
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="glass" style={{ padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="form-three-column">
                <div>
                    <label>Name (EN)</label>
                    <input type="text" value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} required style={{ width: '100%', padding: 'var(--space-sm)' }} />
                </div>
                <div>
                    <label>Name (AR)</label>
                    <input type="text" value={formData.name_ar} onChange={e => setFormData({...formData, name_ar: e.target.value})} required style={{ width: '100%', padding: 'var(--space-sm)' }} />
                </div>
                <div>
                    <label>Name (FR)</label>
                    <input type="text" value={formData.name_fr} onChange={e => setFormData({...formData, name_fr: e.target.value})} required style={{ width: '100%', padding: 'var(--space-sm)' }} />
                </div>
            </div>

            <div>
                <label>Slug</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required style={{ width: '100%', padding: 'var(--space-sm)' }} />
            </div>

            <div>
                <label>Description (EN)</label>
                <textarea value={formData.desc_en} onChange={e => setFormData({...formData, desc_en: e.target.value})} required style={{ width: '100%', padding: 'var(--space-sm)', minHeight: '100px' }} />
            </div>

            <div className="form-three-column">
                <div>
                    <label>Price (DZD)</label>
                    <input type="number" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} required style={{ width: '100%', padding: 'var(--space-sm)' }} />
                </div>
                <div>
                    <label>Sale Price (Optional)</label>
                    <input type="number" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: e.target.value})} style={{ width: '100%', padding: 'var(--space-sm)' }} />
                </div>
                <div>
                    <label>Stock</label>
                    <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required style={{ width: '100%', padding: 'var(--space-sm)' }} />
                </div>
            </div>

            <div>
                <label>Category</label>
                <select 
                    value={formData.categoryId} 
                    onChange={e => setFormData({...formData, categoryId: e.target.value})} 
                    required 
                    style={{ width: '100%', padding: 'var(--space-sm)' }}
                >
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name_en}</option>
                    ))}
                </select>
            </div>

            <ProductImageUploader
                images={formData.images}
                onChange={(images) => setFormData({ ...formData, images })}
            />

            <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ 
                    background: isSubmitting ? 'var(--text-muted)' : 'var(--primary)', 
                    color: 'white', 
                    padding: 'var(--space-md)', 
                    borderRadius: 'var(--radius-md)', 
                    fontWeight: 700, 
                    marginTop: 'var(--space-lg)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
            >
                {isSubmitting ? 'Saving...' : 'Update Product'}
            </button>
        </form>
    );
}
