import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/db';
import { serializePrisma } from '@/lib/utils';

function formatPrice(value: number | string) {
  return `${Number(value).toLocaleString('fr-DZ')} DZD`;
}

export default async function CheckoutSuccessPage({ params }: { params: Promise<{ locale: string; orderId: string }> }) {
  const { locale, orderId } = await params;
  const t = await getTranslations('CheckoutSuccess');
  const tCommon = await getTranslations('Common');
  const orderRaw = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } }, customer: true },
  });

  if (!orderRaw) notFound();
  const order = serializePrisma(orderRaw);

  return (
    <main className="container" style={{ padding: 'var(--space-2xl) var(--space-md)', maxWidth: 920 }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
        <CheckCircle2 size={72} color="var(--success)" />
        <h1 style={{ marginTop: 'var(--space-md)', fontSize: 36 }}>{t('title')}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{t('description')}</p>
      </div>

      <div className="responsive-two-column">
        <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: 20, marginBottom: 'var(--space-md)' }}>{t('order')} #{order.id}</h2>
          {order.items.map((item: any) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 10 }}>
              <div>
                <span>{item.product[`name_${locale}`] || item.product.name_en} x {item.quantity}</span>
                {item.flavor && <div style={{ fontSize: 12, color: 'var(--text-hint)', marginTop: 2 }}>Flavor: {item.flavor}</div>}
              </div>
              <span>{formatPrice(Number(item.price) * item.quantity)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-md)', marginTop: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', fontWeight: 900 }}>
            <span>{tCommon('total')}</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </section>

        <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: 20, marginBottom: 'var(--space-md)' }}>{t('shipping')}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{order.wilaya}, {order.commune}</p>
          <p style={{ color: 'var(--text-muted)' }}>{order.addressDetails}</p>
          <p style={{ color: 'var(--text-muted)' }}>{t('phone')}: {order.customerPhone}</p>
          <p style={{ color: 'var(--secondary)', marginTop: 'var(--space-md)' }}>{t('estimatedDelivery')}: 1-2 {tCommon('days')}</p>
        </section>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)', flexWrap: 'wrap', marginTop: 'var(--space-2xl)' }}>
        <Link href={`/${locale}/track?orderId=${order.id}&phone=${encodeURIComponent(order.customerPhone)}`} style={{ background: 'var(--primary)', color: '#080810', padding: '13px 20px', borderRadius: 'var(--radius-md)', fontWeight: 900 }}>{t('trackOrder')}</Link>
        <Link href={`/${locale}/search`} style={{ border: '1px solid var(--border)', padding: '13px 20px', borderRadius: 'var(--radius-md)', fontWeight: 800 }}>{t('continueShopping')}</Link>
      </div>
    </main>
  );
}
