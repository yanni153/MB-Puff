'use client';

import { useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/actions';

export default function RegisterPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('Auth');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t('errorMatch'));
      return;
    }

    startTransition(async () => {
      const result = await registerUser(form);
      if (result.success) {
        router.push(`/${locale}/login?registered=1`);
      } else {
        setError(result.error || t('errorGeneric'));
      }
    });
  };

  return (
    <main className="container" style={{ minHeight: 650, display: 'grid', placeItems: 'center', padding: 'var(--space-2xl) var(--space-md)' }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 480, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>{t('createAccount')}</h1>
        {error && <div style={{ background: 'var(--error-bg)', color: 'var(--error)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>{error}</div>}
        <Input label={t('fullName')} value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} />
        <Input label={t('email')} value={form.email} onChange={(value) => setForm({ ...form, email: value })} type="email" />
        <Input label={t('password')} value={form.password} onChange={(value) => setForm({ ...form, password: value })} type="password" />
        <Input label={t('confirmPassword')} value={form.confirmPassword} onChange={(value) => setForm({ ...form, confirmPassword: value })} type="password" />
        <Input label={t('phone')} value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} required={false} />
        <button disabled={isPending} style={{ width: '100%', marginTop: 'var(--space-md)', background: 'var(--primary)', color: '#080810', borderRadius: 'var(--radius-md)', fontWeight: 900 }}>
          {isPending ? 'Creating...' : t('createAccount')}
        </button>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 'var(--space-md)' }}>
          {t('haveAccount')} <Link href={`/${locale}/login`} style={{ color: 'var(--secondary)', fontWeight: 900 }}>{t('login')}</Link>
        </p>
      </form>
    </main>
  );
}

function Input({ label, value, onChange, type = 'text', required = true }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label style={{ display: 'grid', gap: 6, color: 'var(--text-muted)', fontSize: 14, fontWeight: 700, marginBottom: 'var(--space-md)' }}>
      {label}
      <input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} style={{ width: '100%', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '12px 14px' }} />
    </label>
  );
}
