'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createProduct } from '@/lib/actions';
import ProductImageUploader from './ProductImageUploader';

type CategoryOption = {
    id: string;
    name_en: string;
};

export default function ProductCreateForm({ categories }: { categories: CategoryOption[] }) {
    const router = useRouter();
    const { locale } = useParams();

    const [formData, setFormData] = useState({
        name_en: '',
        name_ar: '',
        name_fr: '',
        desc_en: '',
        desc_ar: '',
        desc_fr: '',
        slug: '',
        basePrice: '',
        images: [] as string[],
        categoryId: categories[0]?.id || '',
        stock: '0',
    });
    const [flavorsInput, setFlavorsInput] = useState('');

    const slugify = (text: string) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.images.length) {
            alert('Please upload at least one product image');
            return;
        }

        const flavors = flavorsInput.split(',').map(f => f.trim()).filter(f => f.length > 0);

        const result = await createProduct({
            ...formData,
            mainImage: formData.images[0],
            basePrice: parseFloat(formData.basePrice),
            stock: parseInt(formData.stock, 10),
            flavors
        });

        if (result.success) {
            router.push(`/${locale}/admin/products`);
            router.refresh();
        } else {
            alert(result.error || 'Error creating product');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass" style={{ padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="form-three-column">
                <div>
                    <label>Name (EN)</label>
                    <input type="text" value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value, slug: formData.slug ? formData.slug : slugify(e.target.value)})} required style={{ width: '100%', padding: 'var(--space-sm)' }} />
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

            <div className="form-three-column">
                <div>
                    <label>Slug</label>
                    <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: slugify(e.target.value)})} required style={{ width: '100%', padding: 'var(--space-sm)' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <label>Flavors (Comma Separated)</label>
                    <input type="text" value={flavorsInput} onChange={e => setFlavorsInput(e.target.value)} placeholder="e.g. Peach Berry, Mint, Double Apple" style={{ width: '100%', padding: 'var(--space-sm)' }} />
                </div>
            </div>

            <div className="form-three-column">
                <div>
                    <label>Description (EN)</label>
                    <textarea value={formData.desc_en} onChange={e => setFormData({...formData, desc_en: e.target.value})} required style={{ width: '100%', padding: 'var(--space-sm)', minHeight: '100px' }} />
                </div>
                <div>
                    <label>Description (AR)</label>
                    <textarea value={formData.desc_ar} onChange={e => setFormData({...formData, desc_ar: e.target.value})} required style={{ width: '100%', padding: 'var(--space-sm)', minHeight: '100px' }} />
                </div>
                <div>
                    <label>Description (FR)</label>
                    <textarea value={formData.desc_fr} onChange={e => setFormData({...formData, desc_fr: e.target.value})} required style={{ width: '100%', padding: 'var(--space-sm)', minHeight: '100px' }} />
                </div>
            </div>

            <div className="form-three-column">
                <div>
                    <label>Price (DZD)</label>
                    <input type="number" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} required style={{ width: '100%', padding: 'var(--space-sm)' }} />
                </div>
                <div>
                    <label>Stock</label>
                    <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required style={{ width: '100%', padding: 'var(--space-sm)' }} />
                </div>
                <div>
                    <label>Category</label>
                    <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} required style={{ width: '100%', padding: 'var(--space-sm)' }}>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name_en}</option>
                        ))}
                    </select>
                </div>
            </div>

            <ProductImageUploader
                images={formData.images}
                onChange={(images) => setFormData({ ...formData, images })}
            />

            <button type="submit" style={{ background: 'var(--primary)', color: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', fontWeight: 700, marginTop: 'var(--space-lg)' }}>
                Save Product
            </button>
        </form>
    );
}
