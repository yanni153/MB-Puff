'use client';

import { useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createOrder } from '@/lib/actions';
import { useCart } from '@/contexts/CartContext';
import { wilayas } from '@/lib/wilayas';
import { getShippingRates } from '@/lib/shipping';

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
    shippingMethod: 'home', // 'home' or 'desk'
  });

  const rates = getShippingRates(form.wilaya);
  const shipping = rates ? (form.shippingMethod === 'desk' ? rates.desk : rates.home) : 0;

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
        shippingCost: shipping,
        shippingMethod: form.shippingMethod === 'desk' ? 'Stop-desk' : 'À domicile',
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
                <Select 
                  label={t('wilaya')} 
                  value={form.wilaya} 
                  onChange={(value) => setForm({ ...form, wilaya: value })} 
                  options={wilayas} 
                  placeholder={locale === 'ar' ? 'اختر الولاية' : locale === 'fr' ? 'Sélectionner la Wilaya' : 'Select Wilaya'}
                />
                <Input label={t('commune')} value={form.commune} onChange={(value) => setForm({ ...form, commune: value })} />
              </div>
              {rates && (
                <div style={{ display: 'grid', gap: 10, marginTop: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 700 }}>
                    {t('deliveryMethod')}
                  </span>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div 
                      onClick={() => setForm({ ...form, shippingMethod: 'home' })}
                      style={{ 
                        flex: 1, 
                        border: form.shippingMethod === 'home' ? '2px solid var(--primary)' : '1px solid var(--border)', 
                        borderRadius: 'var(--radius-md)', 
                        padding: '14px 16px', 
                        cursor: 'pointer',
                        background: form.shippingMethod === 'home' ? 'var(--bg-elevated)' : 'transparent',
                        transition: 'all 0.2s ease',
                        boxShadow: form.shippingMethod === 'home' ? '0 0 10px rgba(0, 240, 255, 0.15)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <strong style={{ color: form.shippingMethod === 'home' ? 'var(--primary)' : 'var(--text-main)', fontSize: 13 }}>
                          {t('homeDelivery')}
                        </strong>
                        <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--accent-silver)' }}>
                          {formatPrice(rates.home)}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-hint)' }}>
                        {locale === 'ar' 
                          ? `التوصيل خلال ${rates.delay} ${rates.delay === 1 ? 'يوم' : 'أيام'}` 
                          : locale === 'fr' 
                          ? `Livraison sous ${rates.delay} jour(s)` 
                          : `Delivery in ${rates.delay} day(s)`}
                      </div>
                    </div>
                    <div 
                      onClick={() => setForm({ ...form, shippingMethod: 'desk' })}
                      style={{ 
                        flex: 1, 
                        border: form.shippingMethod === 'desk' ? '2px solid var(--primary)' : '1px solid var(--border)', 
                        borderRadius: 'var(--radius-md)', 
                        padding: '14px 16px', 
                        cursor: 'pointer',
                        background: form.shippingMethod === 'desk' ? 'var(--bg-elevated)' : 'transparent',
                        transition: 'all 0.2s ease',
                        boxShadow: form.shippingMethod === 'desk' ? '0 0 10px rgba(0, 240, 255, 0.15)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <strong style={{ color: form.shippingMethod === 'desk' ? 'var(--primary)' : 'var(--text-main)', fontSize: 13 }}>
                          {t('deskDelivery')}
                        </strong>
                        <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--accent-silver)' }}>
                          {formatPrice(rates.desk)}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-hint)' }}>
                        {locale === 'ar' 
                          ? `التوصيل خلال ${rates.delay} ${rates.delay === 1 ? 'يوم' : 'أيام'}` 
                          : locale === 'fr' 
                          ? `Livraison sous ${rates.delay} jour(s)` 
                          : `Delivery in ${rates.delay} day(s)`}
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
              <p style={{ color: 'var(--text-muted)' }}>
                {t('deliveryMethod')}: <strong>{form.shippingMethod === 'desk' ? t('deskDelivery') : t('homeDelivery')}</strong>
              </p>
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

function Select({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
  options: string[]; 
  placeholder: string;
}) {
  return (
    <label style={{ display: 'grid', gap: 6, color: 'var(--text-muted)', fontSize: 14, fontWeight: 700 }}>
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        style={{ 
          width: '100%', 
          borderRadius: 'var(--radius-md)', 
          background: 'var(--bg-elevated)', 
          border: '1px solid var(--border)', 
          color: 'var(--text-main)', 
          padding: '12px 14px',
          cursor: 'pointer'
        }}
      >
        <option value="" disabled style={{ background: 'var(--bg-surface)' }}>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} style={{ background: 'var(--bg-surface)' }}>
            {opt}
          </option>
        ))}
      </select>
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
