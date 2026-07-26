export default function ComingSoon({ title }: { title: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '16px',
      color: 'var(--dash-text-muted)',
      textAlign: 'center',
      padding: '24px',
    }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
        <path d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="10" />
      </svg>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dash-text-primary)', margin: 0 }}>{title}</h1>
      <p style={{ fontSize: '1rem', margin: 0, maxWidth: '360px', lineHeight: 1.6 }}>
        Tính năng này đang được phát triển. Vui lòng quay lại sau!
      </p>
    </div>
  );
}
