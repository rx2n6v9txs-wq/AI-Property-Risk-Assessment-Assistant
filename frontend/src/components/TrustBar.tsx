import { Cloud, Globe2, LockKeyhole, ShieldCheck } from 'lucide-react'

export default function TrustBar() {
  const items = [
    { icon: <LockKeyhole size={18} strokeWidth={2} aria-hidden="true" />, title: '256-bit encryption' },
    { icon: <ShieldCheck size={18} strokeWidth={2} aria-hidden="true" />, title: 'SOC 2 ready' },
    { icon: <Globe2 size={18} strokeWidth={2} aria-hidden="true" />, title: 'GDPR compliant' },
    { icon: <Cloud size={18} strokeWidth={2} aria-hidden="true" />, title: 'Cloud secure' },
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
