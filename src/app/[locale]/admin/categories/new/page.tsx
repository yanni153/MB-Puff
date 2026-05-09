'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createCategory } from '@/lib/actions';

export default function NewCategoryPage() {
    const router = useRouter();
    const { locale } = useParams();
    
    const [formData, setFormData] = useState({
        name_en: '',
        name_ar: '',
        name_fr: '',
        slug: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await createCategory(formData);
        
        if (result.success) {
            router.push(`/${locale}/admin/categories`);
        } else {
            alert('Error creating category');
        }
    };

    return (
        <div style={{ padding: 'var(--space-xl)', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: 'var(--space-xl)' }}>Add New Category</h1>
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

                <button type="submit" style={{ background: 'var(--primary)', color: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', fontWeight: 700, marginTop: 'var(--space-lg)' }}>
                    Save Category
                </button>
            </form>
        </div>
    );
}
