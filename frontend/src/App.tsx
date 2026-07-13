import Layout from './components/Layout'
import Hero from './components/Hero'
import PropertyForm from './components/PropertyForm'
import NextSteps from './components/Sidebar/NextSteps'
import Benefits from './components/Sidebar/Benefits'
import Support from './components/Sidebar/Support'
import TrustBar from './components/TrustBar'

function App() {
  return (
    <Layout>
      <Hero />

      <div className="main-grid">
        <div className="content-column">
          <PropertyForm />

          <div className="stats-grid">
            <div className="metric-card">
              <div className="metric-card__label">Estimated risk score</div>
              <div className="metric-card__value">72</div>
              <p className="metric-card__text">Based on property details and uploaded exterior images.</p>
            </div>
            <div className="metric-card">
              <div className="metric-card__label">Report ready in</div>
              <div className="metric-card__value">2 min</div>
              <p className="metric-card__text">Receive a concise underwriting summary and recommendations.</p>
            </div>
            <div className="metric-card">
              <div className="metric-card__label">Analysis coverage</div>
              <div className="metric-card__value">5 factors</div>
              <p className="metric-card__text">Roof, exterior damage, water, vegetation, parking.</p>
            </div>
          </div>
        </div>

        <aside className="sidebar-column">
          <NextSteps />
          <Benefits />
          <Support />
          <TrustBar />
        </aside>
      </div>
    </Layout>
  )
}

export default App
