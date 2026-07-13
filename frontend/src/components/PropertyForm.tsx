import { useCallback, useState, type FormEvent } from 'react'
import type { AnalysisResponse } from '../../../shared/types'
import { submitAnalysis } from '../api'
import UploadDropzone from './UploadDropzone'
import Button from './Button'

export default function PropertyForm() {
  const [address, setAddress] = useState('')
  const [propertyType, setPropertyType] = useState('Office')
  const [buildingYear, setBuildingYear] = useState('1998')
  const [occupancy, setOccupancy] = useState('Occupied')
  const [roofType, setRoofType] = useState('Flat')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = useCallback((nextFiles: File[]) => {
    setFiles(nextFiles)
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await submitAnalysis(
        {
          address,
          propertyType,
          buildingYear,
          occupancy,
          roofType,
        },
        files,
      )

      setAnalysis(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to analyze property.')
      setAnalysis(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="form-panel">
        <div className="form-header">
          <div className="form-header__content">
            <div className="form-title">Property profile</div>
            <p className="form-copy">Capture the key building details needed for a consistent underwriting estimate.</p>
          </div>

          <div className="status-pill">
            <span className="status-dot" />
            AI risk preview
          </div>
        </div>

        <div className="form-grid">
          <div className="form-column">
            <div className="form-section-heading">Basic details</div>
            <div className="field-group">
              <label htmlFor="address" className="field-label">Address</label>
              <input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete property address"
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label htmlFor="building-year" className="field-label">Building year</label>
              <input
                id="building-year"
                value={buildingYear}
                onChange={(e) => setBuildingYear(e.target.value)}
                className="field-input"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Upload images</label>
              <div className="upload-section">
                <UploadDropzone onChange={handleFiles} />
              </div>
            </div>
          </div>

          <div className="form-column">
            <div className="form-section-heading">Operational context</div>
            <div className="field-group">
              <label htmlFor="property-type" className="field-label">Property type</label>
              <select
                id="property-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="field-select"
              >
                <option>Office</option>
                <option>Retail</option>
                <option>Industrial</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="occupancy" className="field-label">Occupancy</label>
              <select
                id="occupancy"
                value={occupancy}
                onChange={(e) => setOccupancy(e.target.value)}
                className="field-select"
              >
                <option>Occupied</option>
                <option>Vacant</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="roof-type" className="field-label">Roof type</label>
              <select
                id="roof-type"
                value={roofType}
                onChange={(e) => setRoofType(e.target.value)}
                className="field-select"
              >
                <option>Flat</option>
                <option>Pitched</option>
                <option>Metal</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-note">
          <div className="form-note-title">Secure processing</div>
          <p>Your images and property data are encrypted and analyzed only for underwriting insights.</p>
        </div>

        <div className="form-actions">
          <Button type="submit" loading={loading}>
            {loading ? 'Analyzing…' : 'Analyze property'}
          </Button>
        </div>
        {analysis && (
          <section className="analysis-panel">
            <div className="analysis-grid">
              <div className="analysis-card">
                <div className="analysis-card__label">Analysis result</div>
                <div className="analysis-card__title">{analysis.riskScore.level} risk</div>
                <div className="analysis-card__meta">Score: {analysis.riskScore.score} / 100</div>
                <div className="analysis-card__source">Source: {analysis.source === 'ai' ? 'AI generated' : 'AI generated'}</div>
                <div className="analysis-card__source">Request: {analysis.requestId} • Status: {analysis.status}</div>

                <div className="detail-grid">
                  <div className="detail-card">
                    <div className="analysis-card__label">Roof condition</div>
                    <p>{analysis.findings.roofCondition}</p>
                  </div>
                  <div className="detail-card">
                    <div className="analysis-card__label">Water leakage</div>
                    <p>{analysis.findings.waterLeakage}</p>
                  </div>
                  <div className="detail-card">
                    <div className="analysis-card__label">Vegetation</div>
                    <p>{analysis.findings.vegetation}</p>
                  </div>
                  <div className="detail-card">
                    <div className="analysis-card__label">Parking condition</div>
                    <p>{analysis.findings.parkingCondition}</p>
                  </div>
                </div>
              </div>

              <div className="summary-panel">
                <div className="summary-panel__title">Underwriting summary</div>
                <div className="summary-panel__heading">{analysis.report.summary}</div>
                <div className="summary-panel__list">
                  <div>
                    <div className="summary-panel__label">Notes</div>
                    <ul>
                      {analysis.report.underwritingNotes.map((note: string, index: number) => (
                        <li key={index} className="summary-panel__item">{note}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="summary-panel__label">Recommendations</div>
                    <ul>
                      {analysis.report.recommendations.map((item: string, index: number) => (
                        <li key={index} className="summary-panel__item">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </form>

      {loading && (
        <div className="loading-screen" role="status" aria-live="polite" aria-busy="true">
          <div className="loading-screen__card">
            <div className="loading-screen__icon" aria-hidden="true">
              <span className="loading-screen__spinner" />
            </div>
            <div className="loading-screen__content">
              <div className="loading-screen__eyebrow">Secure underwriting preview</div>
              <div className="loading-screen__title">Analyzing property</div>
              <p>Checking your property profile, uploaded images, and underwriting signals.</p>

              <div className="loading-screen__stages" aria-hidden="true">
                <span className="loading-screen__stage">
                  <span className="loading-screen__stage-dot" /> Vision scan
                </span>
                <span className="loading-screen__stage">
                  <span className="loading-screen__stage-dot" /> Risk scoring
                </span>
                <span className="loading-screen__stage">
                  <span className="loading-screen__stage-dot" /> Report draft
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <div className="alert-banner">{error}</div>}
    </>
  )
}
