import Button from '../Button'

export default function Support() {
  return (
    <div className="support-card">
      <div className="support-top">
        <div className="support-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2C7 2 4 6 4 11c0 5 3 9 8 11 5-2 8-6 8-11 0-5-3-9-8-9z" fill="currentColor" />
          </svg>
        </div>

        <div className="support-body">
          <div className="support-title">Need help?</div>
          <div className="support-copy">We’re available to help with uploads, property details, and underwriting questions.</div>
          <div className="support-action">
            <Button variant="outline">Contact support</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
