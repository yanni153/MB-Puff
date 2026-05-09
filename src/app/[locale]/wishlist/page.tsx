'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

function formatPrice(value: number | string | null | undefined) {
  return `${Number(value ?? 0).toLocaleString('fr-DZ')} DZD`;
}

export default function WishlistPage() {
  const locale = useLocale();
  const { addItem } = useCart();
  const { items, removeWishlist } = useWishlist();

  if (!items.length) {
    return (
      <main className="container" style={{ minHeight: 520, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div>
          <Heart size={58} color="var(--primary)" />
          <h1 style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>Your wishlist is empty</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>Save products you want to revisit later.</p>
          <Link href={`/${locale}/search`} style={{ color: 'var(--secondary)', fontWeight: 900 }}>Browse Products</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: 'var(--space-2xl) var(--space-md)' }}>
      <h1 style={{ fontSize: 34, marginBottom: 'var(--space-xl)' }}>Wishlist</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-lg)' }}>
        {items.map((item) => {
          const name = (item as any)[`name_${locale}`] || item.name_en;
          return (
            <article key={item.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <Link href={`/${locale}/product/${item.slug}`}><img src={item.mainImage} alt={name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} /></Link>
              <div style={{ padding: 'var(--space-md)' }}>
                <h2 style={{ fontSize: 16, minHeight: 44 }}>{name}</h2>
                <p style={{ color: 'var(--secondary)', fontWeight: 900 }}>{formatPrice(item.salePrice ?? item.basePrice)}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 'var(--space-md)' }}>
                  <button type="button" onClick={() => addItem(item)} style={{ flex: 1, background: 'var(--primary)', color: '#080810', borderRadius: 'var(--radius-md)', fontWeight: 900, gap: 6 }}>
                    <ShoppingCart size={16} /> Cart
                  </button>
                  <button type="button" onClick={() => removeWishlist(item.id)} style={{ width: 44, color: 'var(--error)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
