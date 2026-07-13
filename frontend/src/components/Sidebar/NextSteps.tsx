export default function NextSteps() {
  const steps = [
    { icon: (<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path d="M4 12h16" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round"/></svg>), title: 'Submit property', desc: 'Send property details and images to our secure backend.' },
    { icon: (<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path d="M12 2v20" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round"/></svg>), title: 'AI Analysis', desc: 'Our AI model will analyze the property and risk factors.' },
    { icon: (<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path d="M20 6L9 17l-5-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>), title: 'Review Report', desc: 'Review the underwriting analysis and recommendations.' },
  ]

  return (
    <div className="sidebar-card">
      <h4 className="sidebar-card__title">Next steps</h4>
      <ol className="step-list">
        {steps.map((s, i) => (
          <li key={i} className="step-item">
            <div className="step-icon">{s.icon}</div>
            <div>
              <div className="step-item__title">{s.title}</div>
              <div className="step-item__desc">{s.desc}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
