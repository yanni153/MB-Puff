'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState, Suspense } from 'react';

function TrackContent() {
  const searchParams = useSearchParams();
  const t = useTranslations('Track');
  const tCommon = useTranslations('Common');
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const response = await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`);
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        setError(data.error || t('notFound'));
        return;
      }
      setOrder(data.order);
    } catch (err) {
      setLoading(false);
      setError(t('notFound'));
    }
  };

  useEffect(() => {
    if (orderId && phone) lookup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="container" style={{ padding: 'var(--space-2xl) var(--space-md)', maxWidth: 760 }}>
      <h1 style={{ textAlign: 'center', fontSize: 34, marginBottom: 'var(--space-xl)' }}>{t('title')}</h1>
      <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)' }}>
        <div className="form-two-column">
          <Input label={t('orderId')} value={orderId} onChange={setOrderId} />
          <Input label={t('phone')} value={phone} onChange={setPhone} />
        </div>
        <button type="button" onClick={lookup} disabled={loading || !orderId || !phone} style={{ marginTop: 'var(--space-md)', width: '100%', background: 'var(--primary)', color: '#080810', borderRadius: 'var(--radius-md)', fontWeight: 900 }}>
          {loading ? t('checking') : t('button')}
        </button>
        {error && <p style={{ color: 'var(--error)', marginTop: 'var(--space-md)' }}>{error}</p>}
      </section>

      {order && (
        <section style={{ marginTop: 'var(--space-xl)', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: 22, marginBottom: 'var(--space-md)' }}>{t('status')}: {order.status.replaceAll('_', ' ')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 'var(--space-lg)' }}>
            {['PENDING_CONFIRMATION', 'CONFIRMED', 'SHIPPING', 'DELIVERED'].map((status) => (
              <div key={status} style={{ height: 8, borderRadius: 99, background: progressIndex(order.status) >= progressIndex(status) ? 'var(--success)' : 'var(--border)' }} />
            ))}
          </div>
          <p style={{ color: 'var(--text-muted)' }}>{tCommon('total')}: {Number(order.totalAmount).toLocaleString('fr-DZ')} DZD</p>
          <p style={{ color: 'var(--text-muted)' }}>{t('shippingTo')}: {order.wilaya}, {order.commune}</p>
        </section>
      )}
    </main>
  );
}

export default function Page(props: { params: Promise<{ locale: string }> }) {
  return (
    <Suspense fallback={null}>
      <TrackContent />
    </Suspense>
  );
}

function progressIndex(status: string) {
  return ['PENDING_CONFIRMATION', 'CONFIRMED', 'SHIPPING', 'DELIVERED'].indexOf(status);
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label style={{ display: 'grid', gap: 6, color: 'var(--text-muted)', fontSize: 14, fontWeight: 700 }}>
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} style={{ width: '100%', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '12px 14px' }} />
    </label>
  );
}
