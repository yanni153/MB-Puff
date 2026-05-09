'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

type HeaderCategory = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  name_fr: string;
};

export default function Header({ categories }: { categories: HeaderCategory[] }) {
  const locale = useLocale();
  const tCommon = useTranslations('Common');
  const tNav = useTranslations('Nav');
  const pathname = usePathname();
  const router = useRouter();
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  const announcements = [
    tNav('freeDelivery'),
    tNav('codAvailable'),
    tNav('authenticProducts'),
  ];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => window.clearInterval(interval);
  }, [announcements.length]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    router.push(`/${locale}/search${params.toString() ? `?${params}` : ''}`);
    setIsMenuOpen(false);
  };

  const switchLocale = (nextLocale: string) => {
    const nextPath = pathname.replace(/^\/(ar|fr|en)/, `/${nextLocale}`);
    router.push(nextPath);
  };

  const categoryName = (category: HeaderCategory) => {
    return category[`name_${locale as 'en' | 'ar' | 'fr'}`] || category.name_en;
  };

  return (
    <>
      <div style={{
        height: 36,
        background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
        color: '#080810',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: 1,
        overflow: 'hidden',
      }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={announcementIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {announcements[announcementIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: isScrolled ? 'var(--glass-bg)' : 'var(--bg-main)',
        backdropFilter: isScrolled ? 'var(--glass-blur)' : 'none',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{ minHeight: 76, display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
          <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 'max-content' }}>
            <span style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              border: '2px solid var(--primary)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--accent-silver)',
              fontFamily: 'Orbitron',
              fontWeight: 900,
              boxShadow: 'var(--shadow-primary)',
            }}>MB</span>
            <span style={{ fontFamily: 'Orbitron', fontWeight: 900, letterSpacing: 1 }}>MB PUFF</span>
          </Link>

          <nav className="desktop-only" style={{ display: 'flex', gap: 'var(--space-md)', flex: 1 }}>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/category/${category.slug}`}
                style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 700 }}
              >
                {categoryName(category)}
              </Link>
            ))}
          </nav>

          <form onSubmit={submitSearch} className="desktop-only" style={{ position: 'relative', width: 260 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-hint)' }} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={tCommon('search')}
              style={{
                width: '100%',
                height: 42,
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                border: '1px solid var(--border)',
                padding: '0 14px 0 38px',
                outline: 'none',
              }}
            />
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconLink href={`/${locale}/wishlist`} icon={<Heart size={20} />} count={wishlistCount} label={tNav('wishlist')} />
            <IconLink href={`/${locale}/cart`} icon={<ShoppingCart size={20} />} count={cartCount} label={tNav('cart')} />
            <IconLink href={`/${locale}/account`} icon={<User size={20} />} label={tNav('account')} />

            <div className="desktop-only" style={{ display: 'flex', gap: 2, marginLeft: 4 }}>
              {['fr', 'en', 'ar'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => switchLocale(item)}
                  style={{
                    color: locale === item ? 'var(--secondary)' : 'var(--text-muted)',
                    minHeight: 34,
                    padding: '0 7px',
                    fontSize: 12,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                  }}
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="mobile-only"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={tNav('toggleMenu')}
              style={{ color: 'var(--text-main)', minHeight: 42, width: 42 }}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
          >
            <div className="container" style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-md)' }}>
              <form onSubmit={submitSearch} style={{ marginBottom: 'var(--space-md)' }}>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={tCommon('search')}
                  style={{ width: '100%', height: 44, borderRadius: 'var(--radius-md)', background: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '0 14px' }}
                />
              </form>
              <nav style={{ display: 'grid', gap: 10 }}>
                {categories.map((category) => (
                  <Link key={category.id} href={`/${locale}/category/${category.slug}`} onClick={() => setIsMenuOpen(false)}>
                    {categoryName(category)}
                  </Link>
                ))}
                <Link href={`/${locale}/track`} onClick={() => setIsMenuOpen(false)}>{tNav('trackOrder')}</Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function IconLink({ href, icon, count, label }: { href: string; icon: React.ReactNode; count?: number; label: string }) {
  return (
    <Link href={href} aria-label={label} style={{ position: 'relative', minHeight: 42, width: 42, display: 'grid', placeItems: 'center', color: 'var(--text-main)' }}>
      {icon}
      {!!count && (
        <span style={{
          position: 'absolute',
          top: 2,
          right: 0,
          minWidth: 18,
          height: 18,
          borderRadius: 999,
          background: 'var(--accent-pink)',
          color: 'white',
          fontSize: 11,
          display: 'grid',
          placeItems: 'center',
          fontWeight: 800,
        }}>
          {count}
        </span>
      )}
    </Link>
  );
}
