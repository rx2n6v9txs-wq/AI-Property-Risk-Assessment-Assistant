import type { AnalysisErrorResponse, AnalysisResponse, PropertyFormValues } from '../../shared/types'

const API_URL = ''

export async function submitAnalysis(formData: PropertyFormValues, files: File[]) {
  const formPayload = new FormData()
  formPayload.append('propertyData', JSON.stringify({ ...formData, buildingYear: Number(formData.buildingYear) }))
  files.forEach((file) => formPayload.append('images', file))

  const response = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    body: formPayload,
  })

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as AnalysisErrorResponse
    throw new Error(errorBody.error?.message || 'Unable to analyze the property right now.')
  }

  return (await response.json()) as AnalysisResponse
}
