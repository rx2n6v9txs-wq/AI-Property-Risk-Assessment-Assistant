export default function Benefits() {
  const items = ['Risk assessment summary', 'Property condition insights', 'Roof analysis', 'Underwriting recommendation', 'Downloadable report']

  return (
    <div className="sidebar-card">
      <h4 className="sidebar-card__title">What you'll receive</h4>
      <ul className="benefit-list">
        {items.map((it, idx) => (
          <li key={idx} className="benefit-item">
            <span className="benefit-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                <path d="M20 6L9 17l-5-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
