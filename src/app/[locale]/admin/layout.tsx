import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import Link from 'next/link';
import MBPuffLogo from "@/components/MBPuffLogo";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const locale = await getLocale();

  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
          <div style={{ padding: '0 var(--space-xl)', marginBottom: 'var(--space-3xl)' }}>
              <MBPuffLogo size={40} showText={true} />
              <div style={{ fontSize: '12px', fontWeight: 900, color: 'white', marginTop: '4px', letterSpacing: '2px' }}>ADMIN</div>
          </div>

          <nav style={{ flex: 1 }}>
              <AdminNavLink href={`/${locale}/admin`} label="Dashboard" active />
              <AdminNavLink href={`/${locale}/admin/products`} label="Products" />
              <AdminNavLink href={`/${locale}/admin/categories`} label="Categories" />
              <AdminNavLink href={`/${locale}/admin/orders`} label="Orders" />
              <AdminNavLink href={`/${locale}/admin/customers`} label="Customers" />
          </nav>

          <div style={{ padding: 'var(--space-xl)', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-hint)', marginBottom: '12px' }}>
                  {session.user?.email}
              </p>
              <form action={async () => {
                  'use server';
                  await signOut({ redirectTo: `/${locale}/login` });
              }}>
                  <button style={{ color: 'var(--error)', fontSize: '14px', fontWeight: 700 }}>Logout</button>
              </form>
          </div>
      </aside>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <header style={{ 
              height: '72px',
              background: 'var(--bg-surface)', 
              padding: '0 var(--space-2xl)', 
              borderBottom: '1px solid var(--border)', 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'flex-end'
          }}>
              <Link href={`/${locale}`} target="_blank" style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: 700 }}>
                  View Live Store
              </Link>
          </header>
          <main style={{ padding: 'var(--space-2xl)', flex: 1 }}>
            {children}
          </main>
      </div>
    </div>
  );
}

function AdminNavLink({ href, label, active }: { href: string, label: string, active?: boolean }) {
    return (
        <Link href={href} style={{ 
            display: 'block',
            padding: '12px 32px',
            color: active ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '14px',
            background: active ? 'rgba(0, 229, 255, 0.05)' : 'transparent',
            borderLeft: active ? '4px solid var(--primary)' : '4px solid transparent',
            transition: 'all 0.2s'
        }}>
            {label}
        </Link>
    );
}
