import prisma from '@/lib/db';

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true, _count: { select: { orders: true } } },
  });

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--space-xl)' }}>Customers</h1>
      <div className="mobile-scroll-table" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: 'var(--space-md)' }}>Name</th>
              <th style={{ padding: 'var(--space-md)' }}>Email</th>
              <th style={{ padding: 'var(--space-md)' }}>Phone</th>
              <th style={{ padding: 'var(--space-md)' }}>Orders</th>
              <th style={{ padding: 'var(--space-md)' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--space-md)', fontWeight: 800 }}>{customer.firstName} {customer.lastName}</td>
                <td style={{ padding: 'var(--space-md)' }}>{customer.user.email}</td>
                <td style={{ padding: 'var(--space-md)' }}>{customer.user.phone || '-'}</td>
                <td style={{ padding: 'var(--space-md)' }}>{customer._count.orders}</td>
                <td style={{ padding: 'var(--space-md)' }}>{customer.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!customers.length && <p style={{ color: 'var(--text-muted)', padding: 'var(--space-xl)' }}>No customers yet.</p>}
      </div>
    </div>
  );
}
