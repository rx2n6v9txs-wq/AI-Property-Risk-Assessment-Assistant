export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header__container">
        <div className="app-brand">
          <div className="app-brand__mark">AI</div>
          <div>
            <div className="app-brand__title">Property Risk AI</div>
            <div className="app-brand__subtitle">Commercial underwriting assistant</div>
          </div>
        </div>

        <div className="app-header__actions">
          <span className="app-pill">Underwriting</span>
          <button className="app-button app-button--secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM11 10h2v5h-2v-5zm0-4h2v2h-2V6z" fill="#0F172A" />
            </svg>
            How it works
          </button>
        </div>
      </div>
    </header>
  )
}
