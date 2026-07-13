export default function TrustBar() {
  const items = [
    { icon: (<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path d="M12 2L3 5v6c0 5 3 9 9 11 6-2 9-6 9-11V5l-9-3z" fill="#4F46E5"/></svg>), title: '256-bit encryption' },
    { icon: (<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path d="M12 2L3 5v6c0 5 3 9 9 11 6-2 9-6 9-11V5l-9-3z" fill="#4F46E5"/></svg>), title: 'SOC 2 ready' },
    { icon: (<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" fill="#4F46E5"/></svg>), title: 'GDPR compliant' },
    { icon: (<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path d="M12 2L3 5v6c0 5 3 9 9 11 6-2 9-6 9-11V5l-9-3z" fill="#4F46E5"/></svg>), title: 'Cloud secure' },
  ]

  return (
    <div className="sidebar-card">
      <div className="trust-grid">
        {items.map((it, i) => (
          <div key={i} className="trust-item">
            <div className="trust-item__icon">{it.icon}</div>
            <div className="trust-item__title">{it.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
