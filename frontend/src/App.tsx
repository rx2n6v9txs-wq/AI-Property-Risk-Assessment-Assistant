import { useEffect, useState, type FormEvent } from 'react'
import { submitAnalysis } from './api'
import type { AnalysisResponse, PropertyFormValues } from '../../shared/types'

const initialState: PropertyFormValues = {
  address: '',
  propertyType: 'Office',
  buildingYear: '1998',
  occupancy: 'Occupied',
  roofType: 'Flat',
}

function App() {
  const [formData, setFormData] = useState<PropertyFormValues>(initialState)
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [status, setStatus] = useState<{ kind: 'idle' | 'success' | 'error'; message: string }>({
    kind: 'idle',
    message: '',
  })
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file))
    setPreviews(urls)

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [files])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!formData.address.trim()) {
      setStatus({ kind: 'error', message: 'Please enter the property address.' })
      return
    }

    if (!files.length) {
      setStatus({ kind: 'error', message: 'Please upload at least one image.' })
      return
    }

    setStatus({ kind: 'idle', message: '' })
    setIsSubmitting(true)

    try {
      const data = await submitAnalysis(formData, files)
      setAnalysis(data)
      setStatus({ kind: 'success', message: 'The analysis request was submitted successfully.' })
    } catch (error) {
      setStatus({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="rounded-2xl bg-slate-900 p-8 text-white shadow-lg">
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-slate-300">POC</p>
          <h1 className="text-3xl font-semibold">AI Commercial Property Underwriting Assistant</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Start with property details and images to prepare an underwriting analysis request.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Property details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-slate-700">
                  Address
                </label>
                <input
                  id="address"
                  value={formData.address}
                  onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="propertyType" className="block text-sm font-medium text-slate-700">
                  Property type
                </label>
                <select
                  id="propertyType"
                  value={formData.propertyType}
                  onChange={(event) => setFormData({ ...formData, propertyType: event.target.value })}
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                >
                  <option value="Office">Office</option>
                  <option value="Retail">Retail</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="buildingYear" className="block text-sm font-medium text-slate-700">
                  Building year
                </label>
                <input
                  id="buildingYear"
                  value={formData.buildingYear}
                  onChange={(event) => setFormData({ ...formData, buildingYear: event.target.value })}
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="occupancy" className="block text-sm font-medium text-slate-700">
                  Occupancy
                </label>
                <select
                  id="occupancy"
                  value={formData.occupancy}
                  onChange={(event) => setFormData({ ...formData, occupancy: event.target.value })}
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                >
                  <option value="Occupied">Occupied</option>
                  <option value="Vacant">Vacant</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="roofType" className="block text-sm font-medium text-slate-700">
                  Roof type
                </label>
                <select
                  id="roofType"
                  value={formData.roofType}
                  onChange={(event) => setFormData({ ...formData, roofType: event.target.value })}
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                >
                  <option value="Flat">Flat</option>
                  <option value="Pitched">Pitched</option>
                  <option value="Metal">Metal</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700" htmlFor="images">
                  Upload images
                </label>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/png,image/jpeg"
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                  onChange={(event) => setFiles(Array.from(event.target.files || []))}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : 'Analyze property'}
              </button>
            </form>
          </section>

          <div className="space-y-4">
            {status.kind !== 'idle' && (
              <div
                className={`rounded-2xl border p-4 text-sm shadow-sm ${
                  status.kind === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-rose-200 bg-rose-50 text-rose-800'
                }`}
              >
                <p className="font-semibold">
                  {status.kind === 'success' ? 'Request sent' : 'Request failed'}
                </p>
                <p className="mt-1">{status.message}</p>
              </div>
            )}

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold">Next steps</h2>
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
                <li>Submit the form to send data to the backend.</li>
                <li>Inspect the response payload returned by the API.</li>
                <li>Use this screen as the starting point for the full UI flow.</li>
              </ul>
            </section>

            {analysis && (
              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-2 text-xl font-semibold">Analysis result</h2>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Property</h3>
                      <div className="text-sm text-slate-700">
                        <p>{analysis.property.address}</p>
                        <p>{analysis.property.propertyType} • {analysis.property.occupancy}</p>
                        <p>{analysis.property.buildingYear} • {analysis.property.roofType} roof</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Risk</h3>
                      <div className="rounded-2xl bg-white p-4 text-sm text-slate-700 shadow-sm">
                        <p className="font-semibold text-slate-900">{analysis.riskScore.level}</p>
                        <p className="text-xs text-slate-500">Score: {analysis.riskScore.score}</p>
                        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
                          {analysis.riskScore.factors.map((factor, index) => (
                            <li key={index}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Image previews</h3>
                      <div className="flex flex-wrap gap-3">
                        {previews.map((preview, index) => (
                          <div key={`${preview}-${index}`} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <img src={preview} alt={`Preview ${index + 1}`} className="h-20 w-24 object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Image details</h3>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                        {analysis.images.map((image, index) => (
                          <li key={index}>
                            {image.filename} — {(image.sizeBytes / 1024).toFixed(1)} KB
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-slate-600">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">AI findings</h3>
                    <div className="space-y-2 text-slate-700">
                      <p>Roof: {analysis.findings.roofCondition}</p>
                      <p>Exterior: {analysis.findings.exteriorDamage}</p>
                      <p>Cracks: {analysis.findings.cracks}</p>
                      <p>Water leakage: {analysis.findings.waterLeakage}</p>
                      <p>Vegetation: {analysis.findings.vegetation}</p>
                      <p>Parking: {analysis.findings.parkingCondition}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Underwriting report</h3>
                    <p className="mb-3 text-slate-700">{analysis.report.summary}</p>
                    <div className="text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">Report level</p>
                      <p>{analysis.report.riskLevel}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Notes & recommendations</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-slate-900">Underwriting notes</p>
                        <ul className="list-disc space-y-1 pl-5 text-slate-700">
                          {analysis.report.underwritingNotes.map((note, index) => (
                            <li key={`note-${index}`}>{note}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Recommendations</p>
                        <ul className="list-disc space-y-1 pl-5 text-slate-700">
                          {analysis.report.recommendations.map((recommendation, index) => (
                            <li key={`recommendation-${index}`}>{recommendation}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
