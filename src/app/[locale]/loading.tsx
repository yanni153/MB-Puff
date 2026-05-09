export default function Loading() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 'var(--space-md)'
        }}>
            <div className="spinner"></div>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading MB Puff...</p>
        </div>
    );
}
