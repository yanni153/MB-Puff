'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, Heart, ShieldCheck, ShoppingCart, Star, Truck } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductClientProps {
  product: any;
}

function formatPrice(value: number | string | null | undefined) {
  return `${Number(value ?? 0).toLocaleString('fr-DZ')} DZD`;
}

export default function ProductClient({ product }: ProductClientProps) {
  const locale = useLocale();
  const t = useTranslations('Product');
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const gallery = useMemo(() => [product.mainImage, ...(product.images || [])].filter(Boolean).slice(0, 4), [product]);
  const [activeImage, setActiveImage] = useState(gallery[0]);
  const [selectedFlavor, setSelectedFlavor] = useState('');

  const name = product[`name_${locale}`] || product.name_en;
  const desc = product[`desc_${locale}`] || product.desc_en;
  const price = product.salePrice ?? product.basePrice;

  return (
    <div className="container" style={{ padding: 'var(--space-2xl) var(--space-md)' }}>
      <div className="product-detail-grid">
        <div>
          <div style={{
            background: 'var(--bg-elevated)',
            aspectRatio: '1/1',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}>
            <img src={activeImage} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
            {gallery.map((image: string, index: number) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveImage(image)}
                style={{
                  aspectRatio: '1/1',
                  borderRadius: 'var(--radius-md)',
                  border: activeImage === image ? '2px solid var(--primary)' : '1px solid var(--border)',
                  overflow: 'hidden',
                  padding: 0,
                  background: 'var(--bg-surface)',
                }}
              >
                <img src={image} alt={`${name} ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <Link href={`/${locale}/search?category=${product.category?.slug || product.categoryId}`} style={{ color: 'var(--secondary)', fontWeight: 800, fontSize: 13 }}>
            {product.category?.[`name_${locale}`] || product.category?.name_en}
          </Link>

          <h1 style={{ fontSize: 38, color: 'var(--text-main)', lineHeight: 1.15 }}>{name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--warning)' }}>
            {[0, 1, 2, 3, 4].map((star) => <Star key={star} size={18} fill="currentColor" />)}
            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>(24 {t('reviews')})</span>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <strong style={{ color: 'var(--secondary)', fontSize: 30 }}>{formatPrice(price)}</strong>
            {product.salePrice && <span style={{ color: 'var(--text-hint)', textDecoration: 'line-through' }}>{formatPrice(product.basePrice)}</span>}
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{desc}</p>

          {product.flavors && product.flavors.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', alignItems: 'center', gap: 'var(--space-md)' }}>
              <label style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: 16 }}>Flavors</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedFlavor}
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedFlavor ? '1px solid var(--primary)' : '1px solid var(--border)',
                    background: 'var(--bg-elevated)',
                    color: selectedFlavor ? 'var(--text-main)' : 'var(--text-muted)',
                    fontSize: 15,
                    fontWeight: 600,
                    appearance: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedFlavor ? '0 0 10px rgba(191, 95, 255, 0.15)' : 'none',
                  }}
                >
                  <option value="" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>Choose an option</option>
                  {product.flavors.map((flavor: string) => (
                    <option key={flavor} value={flavor} style={{ background: 'var(--bg-elevated)', color: 'var(--text-main)' }}>
                      {flavor}
                    </option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: selectedFlavor ? 'var(--primary)' : 'var(--text-muted)' }}>
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                if (product.flavors?.length > 0 && !selectedFlavor) {
                  alert('Please select a flavor first');
                  return;
                }
                addItem({ ...product, flavor: selectedFlavor || undefined });
              }}
              disabled={product.stock === 0}
              style={{
                flex: '1 1 240px',
                borderRadius: 'var(--radius-md)',
                background: product.stock === 0 ? 'var(--bg-hover)' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                color: product.stock === 0 ? 'var(--text-hint)' : '#080810',
                fontWeight: 900,
                gap: 10,
                minHeight: 54,
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <ShoppingCart size={20} />
              {product.stock === 0 ? t('outOfStock') : t('addToCart')}
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              style={{
                width: 54,
                minHeight: 54,
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                color: isWishlisted(product.id) ? 'var(--accent-pink)' : 'var(--text-main)',
                background: 'var(--bg-surface)',
              }}
              aria-label="Toggle wishlist"
            >
              <Heart fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="trust-grid">
            <TrustBadge icon={<Truck size={20} />} title={t('delivery')} />
            <TrustBadge icon={<ShieldCheck size={20} />} title={t('original')} />
            <TrustBadge icon={<ShieldCheck size={20} />} title={t('cod')} />
            <TrustBadge icon={<ShieldCheck size={20} />} title={t('return')} />
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)' }}>
            <h2 style={{ fontSize: 16, marginBottom: 'var(--space-sm)' }}>{t('specifications')}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{t('specificationsText')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustBadge({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 'var(--space-md)', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: 14 }}>
      <span style={{ color: 'var(--secondary)' }}>{icon}</span>
      {title}
    </div>
  );
}
