export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__grid">
        <div className="hero__panel card">
          <div className="hero__badge">Underwriting automation</div>

          <h1 className="hero__title">
            AI Commercial Property Underwriting Assistant
          </h1>

          <p className="hero__subtitle">
            Upload property details and exterior imagery to generate fast risk insights, condition analysis, and a clean underwriting summary.
          </p>

          <div className="stats-grid">
            <div className="stats-card stats-card--sky">
              <div className="stats-card__value">13s</div>
              <p className="stats-card__label">average analysis time</p>
            </div>
            <div className="stats-card stats-card--green">
              <div className="stats-card__value">98%</div>
              <p className="stats-card__label">image risk factor coverage</p>
            </div>
            <div className="stats-card stats-card--violet">
              <div className="stats-card__value">Trusted</div>
              <p className="stats-card__label">by underwriting teams</p>
            </div>
          </div>
        </div>

        <div className="hero__sidebar">
          <div className="card hero__summary">
            <div className="hero__section-label">Property condition</div>
            <div className="summary-card">
              <div className="summary-card__label">Underwriting snapshot</div>
              <div className="summary-card__value">Excellent</div>
              <p className="summary-card__text">Exterior damage score: 8/100</p>
            </div>
          </div>

          <div className="card hero__summary">
            <div className="hero__section-title">Condition summary</div>
            <div className="summary-list">
              <div className="summary-item">Roof condition: Minimal wear detected</div>
              <div className="summary-item">Water risk: Low</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
