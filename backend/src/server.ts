import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import { GoogleGenAI } from '@google/genai'

dotenv.config()

const app = express()
const upload = multer({ storage: multer.memoryStorage() })
const port = Number(process.env.PORT || 5000)

const MAX_IMAGE_COUNT = 5
const MAX_FILE_BYTES = 10 * 1024 * 1024 // 10MB
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const geminiApiKey = process.env.GEMINI_API_KEY || ''
const geminiModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash'
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null

type PropertyInput = {
  address?: string
  propertyType?: string
  buildingYear?: number
  occupancy?: string
  roofType?: string
}

type ValidationResult<T> = {
  valid: boolean
  value?: T
  errors: string[]
}

function parsePropertyData(body: any): ValidationResult<PropertyInput> {
  if (!body?.propertyData) {
    return { valid: false, errors: ['propertyData form field is required'] }
  }

  try {
    const parsed = JSON.parse(body.propertyData) as PropertyInput
    return validatePropertyData(parsed)
  } catch {
    return { valid: false, errors: ['propertyData must be valid JSON'] }
  }
}

function validatePropertyData(data: PropertyInput): ValidationResult<PropertyInput> {
  const errors: string[] = []

  if (!data.address || typeof data.address !== 'string' || !data.address.trim()) {
    errors.push('address is required and must be a non-empty string')
  }

  if (!data.propertyType || typeof data.propertyType !== 'string' || !data.propertyType.trim()) {
    errors.push('propertyType is required and must be a non-empty string')
  }

  if (data.buildingYear === undefined || data.buildingYear === null || typeof data.buildingYear !== 'number' || Number.isNaN(data.buildingYear)) {
    errors.push('buildingYear is required and must be a number')
  } else if (data.buildingYear < 1900 || data.buildingYear > new Date().getFullYear() + 1) {
    errors.push('buildingYear must be between 1900 and next year')
  }

  if (!data.occupancy || typeof data.occupancy !== 'string' || !data.occupancy.trim()) {
    errors.push('occupancy is required and must be a non-empty string')
  }

  if (!data.roofType || typeof data.roofType !== 'string' || !data.roofType.trim()) {
    errors.push('roofType is required and must be a non-empty string')
  }

  return {
    valid: errors.length === 0,
    value: errors.length === 0 ? data : undefined,
    errors,
  }
}

function validateFiles(files: Express.Multer.File[]): ValidationResult<Express.Multer.File[]> {
  const errors: string[] = []

  if (!files.length) {
    errors.push('At least one property image is required')
  }

  if (files.length > MAX_IMAGE_COUNT) {
    errors.push(`No more than ${MAX_IMAGE_COUNT} images are allowed`)
  }

  files.forEach((file) => {
    if (!SUPPORTED_IMAGE_TYPES.includes(file.mimetype)) {
      errors.push(`${file.originalname} must be JPG, PNG, or WEBP`) 
    }

    if (file.size > MAX_FILE_BYTES) {
      errors.push(`${file.originalname} exceeds the maximum size of 10MB`) 
    }
  })

  return {
    valid: errors.length === 0,
    value: errors.length === 0 ? files : undefined,
    errors,
  }
}

function buildMockFindings(property: PropertyInput) {
  return {
    roofCondition: property.roofType === 'Flat' ? 'Needs attention' : 'Fair',
    exteriorDamage: property.occupancy === 'Vacant' ? 'Moderate damage' : 'Minor damage',
    cracks: property.buildingYear && property.buildingYear < 2000 ? 'Observed' : 'None',
    waterLeakage: property.propertyType === 'Retail' ? 'Possible leakage' : 'No visible leakage',
    vegetation: property.occupancy === 'Vacant' ? 'Overgrown' : 'Moderate vegetation',
    parkingCondition: property.propertyType === 'Industrial' ? 'Fair' : 'Good',
  }
}

function buildMockRiskScore(findings: ReturnType<typeof buildMockFindings>, property: PropertyInput) {
  let score = 40
  const factors: string[] = []

  if (findings.roofCondition === 'Needs attention') {
    score += 20
    factors.push('Roof condition requires review')
  }

  if (findings.cracks === 'Observed') {
    score += 15
    factors.push('Cracks detected')
  }

  if (findings.waterLeakage !== 'No visible leakage') {
    score += 10
    factors.push('Potential water leakage')
  }

  if (findings.vegetation === 'Overgrown') {
    score += 5
    factors.push('Vegetation is overgrown')
  }

  if (property.buildingYear && property.buildingYear < 1990) {
    score += 10
    factors.push('Older building age')
  }

  const normalized = Math.min(100, Math.max(0, score))
  const level = normalized >= 75 ? 'High' : normalized >= 50 ? 'Medium' : 'Low'

  return {
    level,
    score: normalized,
    factors: factors.length ? factors : ['No major issues identified yet'],
  }
}

function buildMockReport(property: PropertyInput, findings: ReturnType<typeof buildMockFindings>, riskScore: ReturnType<typeof buildMockRiskScore>) {
  const summary = `The property appears to have ${findings.roofCondition.toLowerCase()} roof condition and ${findings.exteriorDamage.toLowerCase()}. The overall risk level is ${riskScore.level}.`
  const underwritingNotes = [
    `Review the roof on ${property.roofType?.toLowerCase() || 'this roof'} type property.`,
    `Confirm age and maintenance records for the building (year ${property.buildingYear || 'unknown'}).`,
  ]

  const recommendations = [
    'Schedule a visual roof inspection.',
    'Review drainage and vegetation near the structure.',
  ]

  if (findings.cracks === 'Observed') {
    underwritingNotes.push('Inspect for structural cracks and repair as needed.')
    recommendations.push('Document crack locations and severity.')
  }

  return {
    summary,
    riskLevel: riskScore.level,
    underwritingNotes,
    recommendations,
  }
}

function normalizeGeminiText(text: string) {
  return text
    .replace(/\u200B|\u200C|\u200D|\uFEFF/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/^```(?:json)?\s*\n?/, '')
    .replace(/\n```$/, '')
    .replace(/^['"]?json['"]?\s*[:\-]\s*/i, '')
    .trim()
}

function extractJsonObject(text: string) {
  const cleaned = normalizeGeminiText(text)
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')

  if (start >= 0 && end > start) {
    return cleaned.slice(start, end + 1)
  }

  return cleaned
}

function tryParseJson(text: string) {
  const jsonText = extractJsonObject(text)
  if (!jsonText) {
    return null
  }

  try {
    return JSON.parse(jsonText)
  } catch {
    const relaxed = jsonText.replace(/,\s*([}\]])/g, '$1')
    try {
      return JSON.parse(relaxed)
    } catch {
      return null
    }
  }
}

async function analyzeWithGemini(property: PropertyInput, files: Express.Multer.File[]) {
  // console.log('Analyzing property with Gemini:', property)
  if (!ai) {
    return null
  }

  const imageParts = files.map((file) => ({
    inlineData: {
      mimeType: file.mimetype,
      data: file.buffer.toString('base64'),
    },
  }))

  const prompt = `You are an expert Commercial Property Underwriter.

Property Information

Address: ${property.address}
Property Type: ${property.propertyType}
Building Year: ${property.buildingYear}
Occupancy: ${property.occupancy}
Roof Type: ${property.roofType}

Analyze the uploaded property images together with the property information.

Identify:
- Roof condition
- Exterior damage
- Cracks
- Water intrusion
- Vegetation
- Fire hazards
- Structural deterioration
- Building maintenance
- Visible safety hazards

Then estimate:
- Risk Score (0-100)

Classify:
- Low
- Medium
- High

Provide concise underwriting recommendations.

Return ONLY valid JSON.

{
  "findings": {
    "roofCondition": "",
    "exteriorDamage": "",
    "cracks": "",
    "waterLeakage": "",
    "vegetation": "",
    "parkingCondition": "",
    "fireHazards": "",
    "overallCondition": ""
  },
  "riskScore": {
    "level": "",
    "score": 0,
    "factors": []
  },
  "report": {
    "summary": "",
    "riskLevel": "",
    "underwritingNotes": [],
    "recommendations": []
  }
}`

// Respond with only the JSON object and no additional explanation.`

  try {
    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: [
        { text: prompt },
        ...imageParts,
      ],
      config: {
        temperature: 0.2,
        maxOutputTokens: 1500,
        responseMimeType: 'application/json',
        thinkingConfig: {
        thinkingBudget: 2,
  },
      },
    })
    // console.log('Gemini raw response:', JSON.stringify(response, null, 2))
    const textOutput = typeof response.text === 'string' ? response.text : ''
    const candidateText = response.candidates?.[0]?.content?.parts?.map((part: any) => part.text).filter(Boolean).join('\n') ?? ''
    const rawText = (textOutput || candidateText).trim()

    const parsed = tryParseJson(rawText)
    if (!parsed) {
      return null
    }

    return parsed
  } catch (error) {
    console.error('Gemini analysis failed:', error)
    return null
  }
}

function formatUploadedImages(files: Express.Multer.File[]) {
  return files.map((file) => ({
    filename: file.originalname,
    contentType: file.mimetype,
    sizeBytes: file.size,
  }))
}

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'AI property underwriting API is running.',
    endpoints: ['/health', '/api/analyze'],
  })
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/analyze', upload.fields([{ name: 'images', maxCount: MAX_IMAGE_COUNT }]), async (req, res) => {
  try {
    const propertyValidation = parsePropertyData(req.body)
    if (!propertyValidation.valid || !propertyValidation.value) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Invalid property data provided.',
          details: propertyValidation.errors,
        },
      })
    }

    const files = Array.isArray(req.files)
      ? req.files
      : (req.files as { [fieldname: string]: Express.Multer.File[] })?.images || []

    const fileValidation = validateFiles(files)
    if (!fileValidation.valid) {
      return res.status(400).json({
        error: {
          code: 'INVALID_IMAGES',
          message: 'One or more uploaded images are invalid.',
          details: fileValidation.errors,
        },
      })
    }

    const property = propertyValidation.value
    const imageList = formatUploadedImages(files)

    let analysisResult = null
    if (ai) {
      analysisResult = await analyzeWithGemini(property, files)
    }
// console.log('Analysis result:', analysisResult)
    const findings = analysisResult?.findings ?? buildMockFindings(property)
    const riskScore = analysisResult?.riskScore ?? buildMockRiskScore(findings, property)
    const report = analysisResult?.report ?? buildMockReport(property, findings, riskScore)
    const responseSource = analysisResult ? 'ai' : 'mock'

    const responseBody = {
      requestId: `req_${Date.now()}`,
      status: 'completed',
      source: responseSource,
      property,
      images: imageList,
      findings,
      riskScore,
      report,
    }

    res.json(responseBody)
  } catch (error) {
    console.error('Analyze request failed:', error)
    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        error: {
          code: 'UPLOAD_ERROR',
          message: error.message,
          details: [],
        },
      })
    }

    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Unable to complete image analysis.',
        details: [],
      },
    })
  }
})

app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found.',
      details: [],
    },
  })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend listening on port ${port}`)
})
