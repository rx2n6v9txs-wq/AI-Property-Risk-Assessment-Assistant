import type { AnalysisErrorResponse, AnalysisResponse, PropertyFormValues } from '../../shared/types'

const API_URL = import.meta.env.VITE_API_URL ?? ''
const ANALYZE_ENDPOINT = API_URL ? `${API_URL.replace(/\/$/, '')}/api/analyze` : '/api/analyze'

export async function submitAnalysis(formData: PropertyFormValues, files: File[]) {
  const formPayload = new FormData()
  formPayload.append('propertyData', JSON.stringify({ ...formData, buildingYear: Number(formData.buildingYear) }))
  files.forEach((file) => formPayload.append('images', file))

  const response = await fetch(ANALYZE_ENDPOINT, {
    method: 'POST',
    body: formPayload,
  })

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as AnalysisErrorResponse
    throw new Error(errorBody.error?.message || 'Unable to analyze the property right now.')
  }

  return (await response.json()) as AnalysisResponse
}
