import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'

dotenv.config()

const app = express()
const upload = multer({ storage: multer.memoryStorage() })
const port = Number(process.env.PORT || 5000)

type PropertyInput = {
  address?: string
  propertyType?: string
  buildingYear?: number
  occupancy?: string
  roofType?: string
}

function parsePropertyData(body: any): PropertyInput {
  if (!body?.propertyData) {
    return {}
  }

  try {
    return JSON.parse(body.propertyData) as PropertyInput
  } catch {
    return {}
  }
}

function buildFindings(property: PropertyInput) {
  return {
    roofCondition: property.roofType === 'Flat' ? 'Needs attention' : 'Fair',
    exteriorDamage: property.occupancy === 'Vacant' ? 'Moderate damage' : 'Minor damage',
    cracks: property.buildingYear && property.buildingYear < 2000 ? 'Observed' : 'None',
    waterLeakage: property.propertyType === 'Retail' ? 'Possible leakage' : 'No visible leakage',
    vegetation: property.occupancy === 'Vacant' ? 'Overgrown' : 'Moderate vegetation',
    parkingCondition: property.propertyType === 'Industrial' ? 'Fair' : 'Good',
  }
}

function buildRiskScore(findings: ReturnType<typeof buildFindings>, property: PropertyInput) {
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

function buildReport(property: PropertyInput, findings: ReturnType<typeof buildFindings>, riskScore: ReturnType<typeof buildRiskScore>) {
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

app.post('/api/analyze', upload.fields([{ name: 'images', maxCount: 5 }]), (req, res) => {
  try {
    const parsedProperty = parsePropertyData(req.body)
    const files = Array.isArray(req.files) ? req.files : (req.files as { [fieldname: string]: Express.Multer.File[] })?.images || []
    const findings = buildFindings(parsedProperty)
    const riskScore = buildRiskScore(findings, parsedProperty)
    const report = buildReport(parsedProperty, findings, riskScore)

    const response = {
      requestId: `req_${Date.now()}`,
      status: 'completed',
      property: parsedProperty,
      images: (files as Express.Multer.File[]).map((file) => ({
        filename: file.originalname,
        contentType: file.mimetype,
        sizeBytes: file.size,
      })),
      findings,
      riskScore,
      report,
    }

    res.json(response)
  } catch (error) {
    console.error('Analyze request failed:', error)
    res.status(400).json({
      error: {
        code: 'INVALID_REQUEST',
        message: 'propertyData is required and must be valid JSON.',
        details: [],
      },
    })
  }
})

app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err)

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: {
        code: 'UPLOAD_ERROR',
        message: err.message,
        details: [],
      },
    })
  }

  res.status(500).json({
    error: {
      code: 'SERVER_ERROR',
      message: 'An unexpected error occurred.',
      details: [],
    },
  })
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
