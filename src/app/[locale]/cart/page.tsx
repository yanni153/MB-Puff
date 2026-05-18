'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

function formatPrice(value: number) {
  return `${value.toLocaleString('fr-DZ')} DZD`;
}

export default function CartPage() {
  const locale = useLocale();
  const t = useTranslations('Cart');
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const shippingEstimate = items.length ? 600 : 0;

  if (!items.length) {
    return (
      <main className="container" style={{ minHeight: 520, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div>
          <h1 style={{ fontSize: 34, marginBottom: 'var(--space-sm)' }}>{t('emptyTitle')}</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>{t('emptyMessage')}</p>
          <Link href={`/${locale}/search`} style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#080810', padding: '14px 22px', borderRadius: 'var(--radius-md)', fontWeight: 900 }}>
            {t('proceedToCheckout') === 'Proceed to Checkout' ? 'Shop Now' : t('proceedToCheckout')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: 'var(--space-2xl) var(--space-md)' }}>
      <h1 style={{ fontSize: 34, marginBottom: 'var(--space-xl)' }}>{t('title')}</h1>

      <div className="responsive-two-column" style={{ gridTemplateColumns: 'minmax(0, 1fr) 360px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {items.map((item) => {
            const name = (item as any)[`name_${locale}`] || item.name_en;
            const price = Number(item.salePrice ?? item.basePrice);
            return (
              <article key={`${item.id}-${item.flavor || ''}`} style={{ display: 'grid', gridTemplateColumns: '96px 1fr auto', gap: 'var(--space-md)', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)' }}>
                <img src={item.mainImage} alt={name} style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                <div>
                  <Link href={`/${locale}/product/${item.slug}`} style={{ fontWeight: 800 }}>{name}</Link>
                  {item.flavor && <div style={{ color: 'var(--text-hint)', fontSize: 13, marginTop: 4 }}>Flavor: {item.flavor}</div>}
                  <div style={{ color: 'var(--secondary)', marginTop: 6 }}>{formatPrice(price)}</div>
                  <button type="button" onClick={() => removeItem(item.id, item.flavor)} style={{ color: 'var(--error)', gap: 6, minHeight: 34, marginTop: 8 }}>
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button type="button" onClick={() => updateQuantity(item.id, item.flavor, item.quantity - 1)} style={{ width: 34, minHeight: 34, borderRadius: '50%', background: 'var(--bg-elevated)', color: 'var(--text-main)' }}>
                    <Minus size={16} />
                  </button>
                  <strong>{item.quantity}</strong>
                  <button type="button" onClick={() => updateQuantity(item.id, item.flavor, item.quantity + 1)} style={{ width: 34, minHeight: 34, borderRadius: '50%', background: 'var(--bg-elevated)', color: 'var(--text-main)' }}>
                    <Plus size={16} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="sticky-panel" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: 20, marginBottom: 'var(--space-lg)' }}>{t('summary')}</h2>
          <SummaryRow label={t('subtotal')} value={formatPrice(subtotal)} />
          <SummaryRow label={t('shipping')} value={t('calculatedAtNextStep')} />
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)' }}>
            <SummaryRow label={t('total')} value={formatPrice(subtotal + shippingEstimate)} strong />
          </div>
          <Link href={`/${locale}/checkout`} style={{ marginTop: 'var(--space-lg)', display: 'flex', justifyContent: 'center', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#080810', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 900 }}>
            {t('proceedToCheckout')}
          </Link>
        </aside>
      </div>
    </main>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-md)', color: strong ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: strong ? 900 : 600, marginBottom: 'var(--space-sm)' }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
