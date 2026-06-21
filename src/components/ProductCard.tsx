'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
  product: {
    id: string;
    name_ar: string;
    name_fr: string;
    name_en: string;
    slug: string;
    mainImage: string;
    basePrice: number | string;
    salePrice?: number | string | null;
    stock?: number;
  };
}

function formatPrice(value: number | string | null | undefined) {
  return `${Number(value ?? 0).toLocaleString('fr-DZ')} DZD`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale();
  const tCommon = useTranslations('Common');
  const tProduct = useTranslations('Product');
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const name = (product as any)[`name_${locale}`] || product.name_en;
  const onSale = product.salePrice != null;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
      }}
    >
      <Link href={`/${locale}/product/${product.slug}`} style={{ display: 'block', position: 'relative', aspectRatio: '1/1', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
        <Image src={product.mainImage} alt={name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        {onSale && (
          <span style={{
            position: 'absolute',
            left: 12,
            top: 12,
            background: 'var(--accent-pink)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: 12,
            fontWeight: 800,
          }}>{tProduct('sale')}</span>
        )}
      </Link>

      <button
        type="button"
        onClick={() => toggleWishlist(product)}
        aria-label="Toggle wishlist"
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 38,
          minHeight: 38,
          borderRadius: '50%',
          background: 'rgba(8, 8, 16, 0.75)',
          color: isWishlisted(product.id) ? 'var(--accent-pink)' : 'var(--text-main)',
          border: '1px solid var(--border)',
        }}
      >
        <Heart size={18} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
      </button>

      <div style={{ padding: 'var(--space-md)' }}>
        <div style={{ display: 'flex', gap: 3, color: 'var(--warning)', marginBottom: 8 }}>
          {[0, 1, 2, 3, 4].map((star) => <Star key={star} size={14} fill="currentColor" />)}
        </div>
        <Link href={`/${locale}/product/${product.slug}`}>
          <h3 style={{ color: 'var(--text-main)', fontSize: 16, lineHeight: 1.35, minHeight: 44, marginBottom: 10 }}>
            {name}
          </h3>
        </Link>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 'var(--space-md)' }}>
          <strong style={{ color: 'var(--secondary)', fontSize: 18 }}>{formatPrice(product.salePrice ?? product.basePrice)}</strong>
          {onSale && <span style={{ color: 'var(--text-hint)', textDecoration: 'line-through', fontSize: 13 }}>{formatPrice(product.basePrice)}</span>}
        </div>

        <button
          type="button"
          onClick={() => addItem(product)}
          disabled={product.stock === 0}
          style={{
            width: '100%',
            borderRadius: 'var(--radius-md)',
            background: product.stock === 0 ? 'var(--bg-hover)' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: product.stock === 0 ? 'var(--text-hint)' : '#080810',
            fontWeight: 900,
            gap: 8,
          }}
        >
          <ShoppingCart size={18} />
          {product.stock === 0 ? tProduct('outOfStock') : tCommon('addToCart')}
        </button>
      </div>
    </motion.article>
  );
}
