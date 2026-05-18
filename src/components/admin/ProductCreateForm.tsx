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
    const [flavors, setFlavors] = useState<string[]>([]);
    const [currentFlavor, setCurrentFlavor] = useState('');

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
                    <label style={{ display: 'block', marginBottom: 6 }}>Flavors (Optional)</label>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                        <input 
                            type="text" 
                            value={currentFlavor} 
                            onChange={e => setCurrentFlavor(e.target.value)} 
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (currentFlavor.trim()) {
                                        if (!flavors.includes(currentFlavor.trim())) {
                                            setFlavors([...flavors, currentFlavor.trim()]);
                                        }
                                        setCurrentFlavor('');
                                    }
                                }
                            }}
                            placeholder="Type a flavor and click + or press Enter" 
                            style={{ flex: 1, padding: 'var(--space-sm)' }} 
                        />
                        <button 
                            type="button" 
                            onClick={() => {
                                if (currentFlavor.trim()) {
                                    if (!flavors.includes(currentFlavor.trim())) {
                                        setFlavors([...flavors, currentFlavor.trim()]);
                                    }
                                    setCurrentFlavor('');
                                }
                            }}
                            style={{ 
                                padding: '0 20px', 
                                background: 'var(--primary)', 
                                color: '#080810', 
                                border: 'none', 
                                borderRadius: 'var(--radius-md)', 
                                fontWeight: 800,
                                fontSize: 20,
                                cursor: 'pointer'
                            }}
                        >
                            +
                        </button>
                    </div>

                    {/* Active Flavors Tags */}
                    {flavors.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                            {flavors.map(flavor => (
                                <span 
                                    key={flavor} 
                                    style={{ 
                                        display: 'inline-flex', 
                                        alignItems: 'center', 
                                        gap: 6, 
                                        padding: '5px 12px', 
                                        background: 'rgba(191, 95, 255, 0.15)', 
                                        border: '1px solid var(--primary)', 
                                        borderRadius: '99px', 
                                        color: 'var(--primary)', 
                                        fontSize: 13,
                                        fontWeight: 600
                                    }}
                                >
                                    {flavor}
                                    <button 
                                        type="button" 
                                        onClick={() => setFlavors(flavors.filter(f => f !== flavor))}
                                        style={{ 
                                            background: 'none', 
                                            border: 'none', 
                                            color: 'var(--primary)', 
                                            cursor: 'pointer', 
                                            fontSize: 14,
                                            fontWeight: 800,
                                            padding: '0 2px'
                                        }}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Quick Add Popular Flavors */}
                    <div style={{ fontSize: 12, color: 'var(--text-hint)' }}>
                        <span style={{ marginRight: 6 }}>Quick Add:</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                            {['Lush Ice', 'Blueberry Lemonade', 'Peach Berry', 'Mango Pineapple', 'Strawberry Kiwi', 'Watermelon Lime', 'Mint', 'Pineapple Ice', 'Double Apple'].map(popular => {
                                const isAdded = flavors.includes(popular);
                                return (
                                    <button
                                        key={popular}
                                        type="button"
                                        disabled={isAdded}
                                        onClick={() => setFlavors([...flavors, popular])}
                                        style={{
                                            padding: '4px 10px',
                                            borderRadius: '99px',
                                            border: '1px solid var(--border)',
                                            background: isAdded ? 'var(--bg-hover)' : 'var(--bg-elevated)',
                                            color: isAdded ? 'var(--text-hint)' : 'var(--text-muted)',
                                            fontSize: 11,
                                            cursor: isAdded ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        + {popular}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
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
