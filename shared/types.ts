export interface PropertyFormValues {
  address: string
  propertyType: string
  buildingYear: string
  occupancy: string
  roofType: string
}

export interface PropertyPayload {
  address: string
  propertyType: string
  buildingYear: number
  occupancy: string
  roofType: string
}

export interface ImageMetadata {
  filename: string
  contentType: string
  sizeBytes: number
}

export interface AnalysisFindings {
  roofCondition: string
  exteriorDamage: string
  cracks: string
  waterLeakage: string
  vegetation: string
  parkingCondition: string
}

export interface RiskScore {
  level: string
  score: number
  factors: string[]
}

export interface Report {
  summary: string
  riskLevel: string
  underwritingNotes: string[]
  recommendations: string[]
}

export interface AnalysisResponse {
  requestId: string
  status: string
  property: PropertyPayload
  images: ImageMetadata[]
  findings: AnalysisFindings
  riskScore: RiskScore
  report: Report
}

export interface AnalysisErrorResponse {
  error: {
    code: string
    message: string
    details: string[]
  }
}
