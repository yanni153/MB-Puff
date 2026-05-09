'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  name_fr: string;
}

export default function SearchFilters({ categories, initialParams }: { categories: Category[]; initialParams: any }) {
  const locale = useLocale();
  const t = useTranslations('Filters');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(initialParams.category || '');
  const [minPrice, setMinPrice] = useState(initialParams.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialParams.maxPrice || '');
  const [sort, setSort] = useState(initialParams.sort || 'newest');

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const inputStyle: React.CSSProperties = {
    padding: '12px 14px',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    fontSize: 14,
    outline: 'none',
    width: '100%',
    color: 'var(--text-main)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <SlidersHorizontal size={20} color="var(--primary)" />
        <h2 style={{ fontSize: 18 }}>{t('title')}</h2>
      </div>

      <div>
        <h3 style={{ fontSize: 12, fontWeight: 800, marginBottom: 'var(--space-md)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{t('categories')}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
            <input
              type="radio"
              name="category"
              checked={selectedCategory === ''}
              onChange={() => {
                setSelectedCategory('');
                updateParams({ category: '' });
              }}
            />
            {t('allCategories')}
          </label>
          {categories.map((cat) => (
            <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: selectedCategory === cat.id ? 'var(--secondary)' : 'var(--text-main)' }}>
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat.id}
                onChange={() => {
                  setSelectedCategory(cat.id);
                  updateParams({ category: cat.id });
                }}
              />
              {(cat as any)[`name_${locale}`] || cat.name_en}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 12, fontWeight: 800, marginBottom: 'var(--space-md)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{t('price')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
          <input value={minPrice} onChange={(event) => setMinPrice(event.target.value)} onBlur={() => updateParams({ minPrice })} type="number" placeholder={t('min')} style={inputStyle} />
          <input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} onBlur={() => updateParams({ maxPrice })} type="number" placeholder={t('max')} style={inputStyle} />
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 12, fontWeight: 800, marginBottom: 'var(--space-md)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{t('sortBy')}</h3>
        <select
          value={sort}
          onChange={(event) => {
            setSort(event.target.value);
            updateParams({ sort: event.target.value });
          }}
          style={inputStyle}
        >
          <option value="newest">{t('newest')}</option>
          <option value="price-asc">{t('priceAsc')}</option>
          <option value="price-desc">{t('priceDesc')}</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() => {
          setSelectedCategory('');
          setMinPrice('');
          setMaxPrice('');
          setSort('newest');
          router.push(pathname + (searchParams.get('q') ? `?q=${searchParams.get('q')}` : ''));
        }}
        style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontWeight: 800 }}
      >
        {t('reset')}
      </button>
    </div>
  );
}
