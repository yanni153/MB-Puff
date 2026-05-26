import { getTranslations } from 'next-intl/server';
import type { Prisma } from '@prisma/client';
import prisma from '@/lib/db';
import { RefreshCcw, Shield, Truck, Zap } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import CategoryStrip from '@/components/CategoryStrip';
import Hero from '@/components/Hero';
import ProductTicker from '@/components/ProductTicker';
import { serializePrisma } from '@/lib/utils';

export default async function HomePage() {
  const t = await getTranslations('Home');

  let productsRaw: Prisma.ProductGetPayload<{ include: { category: true } }>[] = [];
  let categoriesRaw: Prisma.CategoryGetPayload<{}>[] = [];

  try {
    productsRaw = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    categoriesRaw = await prisma.category.findMany({
      take: 6
    });
  } catch {
    console.warn('HomePage database fetch failed; rendering empty catalog.');
  }

  const products = serializePrisma(productsRaw);
  const categories = serializePrisma(categoriesRaw);

  return (
    <main style={{ background: 'var(--bg-main)', color: 'var(--text-main)', position: 'relative' }}>
      {/* Hero Section */}
      <Hero />

      {/* Category Strip */}
      <section style={{ background: 'var(--bg-surface)', padding: 'var(--space-2xl) 0' }}>
        <div className="container">
          <CategoryStrip categories={categories} />
        </div>
      </section>

      {/* New Arrivals Ticker */}
      <ProductTicker products={products.slice(0, 8)} title={t('recentArrivals')} />

      {/* Trending Products */}
      <section style={{ padding: 'var(--space-4xl) 0' }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-3xl)' }}>
            <h2 style={{ 
              fontFamily: 'Outfit, sans-serif', 
              fontSize: '32px', 
              fontWeight: 600,
              marginBottom: 'var(--space-sm)'
            }}>
              {t('trending')}
            </h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-xl)' }}>
            {products.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section style={{ background: 'var(--bg-surface)', padding: 'var(--space-4xl) 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-xl)' }}>
          <TrustCard 
            icon={<Shield size={32} />} 
            title={t('authenticTitle')}
            desc={t('authenticDesc')}
          />
          <TrustCard 
            icon={<Zap size={32} />} 
            title={t('fastDeliveryTitle')}
            desc={t('fastDeliveryDesc')}
          />
          <TrustCard 
            icon={<Truck size={32} />} 
            title={t('codTitle')}
            desc={t('codDesc')}
          />
          <TrustCard 
            icon={<RefreshCcw size={32} />} 
            title={t('supportTitle')}
            desc={t('supportDesc')}
          />
        </div>
      </section>
    </main>
  );
}

function TrustCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div style={{ 
      background: 'var(--bg-elevated)', 
      padding: 'var(--space-xl)', 
      borderRadius: '16px', 
      border: '1px solid var(--border)',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ color: 'var(--primary)', marginBottom: 'var(--space-md)', display: 'flex', justifyContent: 'center' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: 'var(--space-xs)', color: 'var(--text-main)' }}>{title}</h3>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{desc}</p>
    </div>
  );
}
