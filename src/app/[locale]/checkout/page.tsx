'use client';

import { useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createOrder } from '@/lib/actions';
import { useCart } from '@/contexts/CartContext';

function formatPrice(value: number) {
  return `${value.toLocaleString('fr-DZ')} DZD`;
}

export default function CheckoutPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('Common');
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    wilaya: '',
    commune: '',
    addressDetails: '',
  });

  const shipping = form.wilaya.toLowerCase().includes('alger') ? 300 : 600;

  if (!items.length) {
    return (
      <main className="container" style={{ minHeight: 520, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div>
          <h1 style={{ marginBottom: 'var(--space-md)' }}>{t('emptyCart')}</h1>
          <Link href={`/${locale}/search`} style={{ color: 'var(--secondary)', fontWeight: 900 }}>{t('shopNow')}</Link>
        </div>
      </main>
    );
  }

  const validateShipping = () => {
    if (!form.fullName || !form.phone || !form.wilaya || !form.addressDetails) {
      setError(t('requiredFields'));
      return false;
    }
    setError('');
    return true;
  };

  const submitOrder = () => {
    startTransition(async () => {
      const result = await createOrder({
        ...form,
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity, flavor: item.flavor || undefined })),
      });

      if (result.success && result.orderId) {
        clearCart();
        router.push(`/${locale}/checkout/success/${result.orderId}`);
      } else {
        setError(result.error || t('createOrderFailed'));
      }
    });
  };

  return (
    <main className="container" style={{ padding: 'var(--space-2xl) var(--space-md)' }}>
      <h1 style={{ fontSize: 34, marginBottom: 'var(--space-xl)' }}>{t('checkout')}</h1>

      <div style={{ display: 'flex', gap: 10, marginBottom: 'var(--space-xl)' }}>
        {[1, 2, 3].map((item) => (
          <div key={item} style={{ flex: 1, height: 5, borderRadius: 99, background: item <= step ? 'var(--primary)' : 'var(--border)' }} />
        ))}
      </div>

      <div className="responsive-two-column" style={{ gridTemplateColumns: 'minmax(0, 1fr) 360px' }}>
        <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)' }}>
          {error && <div style={{ background: 'var(--error-bg)', color: 'var(--error)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>{error}</div>}

          {step === 1 && (
            <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
              <h2 style={{ fontSize: 22 }}>{t('shippingInfo')}</h2>
              <Input label={t('fullName')} value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} />
              <Input label={t('phone')} value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
              <div className="form-two-column">
                <Input label={t('wilaya')} value={form.wilaya} onChange={(value) => setForm({ ...form, wilaya: value })} />
                <Input label={t('commune')} value={form.commune} onChange={(value) => setForm({ ...form, commune: value })} />
              </div>
              <Input label={t('addressDetails')} value={form.addressDetails} onChange={(value) => setForm({ ...form, addressDetails: value })} textarea />
              <button type="button" onClick={() => validateShipping() && setStep(2)} style={{ background: 'var(--primary)', color: '#080810', borderRadius: 'var(--radius-md)', fontWeight: 900 }}>{t('continue')}</button>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
              <h2 style={{ fontSize: 22 }}>{t('paymentMethod')}</h2>
              <div style={{ border: '1px solid var(--border-cyan)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', background: 'var(--bg-elevated)' }}>
                <strong>{t('cod')}</strong>
                <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>{t('paymentDescription')}</p>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)' }}>{t('back')}</button>
                <button type="button" onClick={() => setStep(3)} style={{ flex: 1, background: 'var(--primary)', color: '#080810', borderRadius: 'var(--radius-md)', fontWeight: 900 }}>{t('review')}</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
              <h2 style={{ fontSize: 22 }}>{t('reviewOrder')}</h2>
              <p style={{ color: 'var(--text-muted)' }}>{form.fullName} - {form.phone}</p>
              <p style={{ color: 'var(--text-muted)' }}>{form.wilaya}, {form.commune}, {form.addressDetails}</p>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <button type="button" onClick={() => setStep(2)} style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)' }}>{t('back')}</button>
                <button type="button" disabled={isPending} onClick={submitOrder} style={{ flex: 1, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#080810', borderRadius: 'var(--radius-md)', fontWeight: 900 }}>
                  {isPending ? t('creating') : t('confirmOrder')}
                </button>
              </div>
            </div>
          )}
        </section>

        <aside className="sticky-panel" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: 20, marginBottom: 'var(--space-lg)' }}>{t('summary')}</h2>
          {items.map((item) => (
            <div key={`${item.id}-${item.flavor || ''}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12, color: 'var(--text-muted)' }}>
              <div>
                <span>{item.name_en} x {item.quantity}</span>
                {item.flavor && <div style={{ fontSize: 12, color: 'var(--text-hint)' }}>Flavor: {item.flavor}</div>}
              </div>
              <span>{formatPrice(Number(item.salePrice ?? item.basePrice) * item.quantity)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
            <SummaryRow label={t('subtotal')} value={formatPrice(subtotal)} />
            <SummaryRow label={t('shipping')} value={formatPrice(shipping)} />
            <SummaryRow label={t('total')} value={formatPrice(subtotal + shipping)} strong />
          </div>
        </aside>
      </div>
    </main>
  );
}

function Input({ label, value, onChange, textarea }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean }) {
  const shared = {
    value,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value),
    required: true,
    style: { width: '100%', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '12px 14px' },
  };
  return (
    <label style={{ display: 'grid', gap: 6, color: 'var(--text-muted)', fontSize: 14, fontWeight: 700 }}>
      {label}
      {textarea ? <textarea {...shared} rows={4} /> : <input {...shared} />}
    </label>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, color: strong ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: strong ? 900 : 600, marginBottom: 10 }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
