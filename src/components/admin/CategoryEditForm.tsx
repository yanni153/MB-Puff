'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { updateCategory } from '@/lib/actions';

export default function CategoryEditForm({ category }: { category: any }) {
    const router = useRouter();
    const { locale } = useParams();
    
    const [formData, setFormData] = useState({
        name_en: category.name_en,
        name_ar: category.name_ar,
        name_fr: category.name_fr,
        slug: category.slug,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const result = await updateCategory(category.id, formData);
        
        if (result.success) {
            router.push(`/${locale}/admin/categories`);
            router.refresh();
        } else {
            alert('Error updating category');
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
                {isSubmitting ? 'Saving...' : 'Update Category'}
            </button>
        </form>
    );
}
