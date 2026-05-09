'use client';

import { updateOrderStatus } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function StatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value;
    if (nextStatus === currentStatus) return;

    setLoading(true);
    const res = await updateOrderStatus(orderId, nextStatus);
    setLoading(false);

    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || 'Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_CONFIRMATION': return '#ff9800';
      case 'CONFIRMED': return '#4caf50';
      case 'SHIPPING': return '#2196f3';
      case 'DELIVERED': return '#9c27b0';
      case 'CANCELLED': return '#f44336';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={loading}
      style={{
        padding: '6px 12px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-main)',
        color: getStatusColor(currentStatus),
        border: `1px solid ${getStatusColor(currentStatus)}`,
        fontSize: '12px',
        fontWeight: 800,
        outline: 'none',
        cursor: 'pointer',
        opacity: loading ? 0.5 : 1
      }}
    >
      <option value="PENDING_CONFIRMATION">PENDING</option>
      <option value="CONFIRMED">CONFIRMED (Stock -)</option>
      <option value="SHIPPING">SHIPPING</option>
      <option value="DELIVERED">DELIVERED</option>
      <option value="CANCELLED">CANCELLED (Stock +)</option>
      <option value="RETURNED">RETURNED (Stock +)</option>
    </select>
  );
}
