# API Contract

This document defines the shared request and response formats for the AI Commercial Property Underwriting POC so the frontend and backend can be developed independently.

## Base URL

- Development: http://localhost:5000
- API prefix: /api

## Endpoints

### 1) Analyze Property

POST /api/analyze

#### Request

Content-Type: multipart/form-data

Form fields:

- propertyData (string, required): JSON-encoded property metadata
- images (file[], required): One or more image files in JPG or PNG format

#### propertyData schema

```json
{
  "address": "123 Main Street, New York, NY",
  "propertyType": "Office",
  "buildingYear": 1998,
  "occupancy": "Occupied",
  "roofType": "Flat"
}
```

#### Field rules

- address: non-empty string
- propertyType: string
- buildingYear: integer (four-digit year recommended)
- occupancy: string
- roofType: string
- images: at least 1 file, max 5 files recommended

#### Example request

```http
POST /api/analyze
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="propertyData"
Content-Type: application/json

{"address":"123 Main Street, New York, NY","propertyType":"Office","buildingYear":1998,"occupancy":"Occupied","roofType":"Flat"}
--boundary
Content-Disposition: form-data; name="images"; filename="front.jpg"
Content-Type: image/jpeg

<binary data>
--boundary--
```

#### Success response

Status: 200 OK

```json
{
  "requestId": "req_123456",
  "status": "completed",
  "property": {
    "address": "123 Main Street, New York, NY",
    "propertyType": "Office",
    "buildingYear": 1998,
    "occupancy": "Occupied",
    "roofType": "Flat"
  },
  "images": [
    {
      "filename": "front.jpg",
      "contentType": "image/jpeg",
      "sizeBytes": 245760
    }
  ],
  "findings": {
    "roofCondition": "Needs attention",
    "exteriorDamage": "Minor damage",
    "cracks": "Observed",
    "waterLeakage": "No visible leakage",
    "vegetation": "Moderate vegetation",
    "parkingCondition": "Fair"
  },
  "riskScore": {
    "level": "Medium",
    "score": 65,
    "factors": [
      "Roof condition concerns",
      "Observed cracks"
    ]
  },
  "report": {
    "summary": "The property shows moderate signs of wear and should be reviewed in more detail.",
    "riskLevel": "Medium",
    "underwritingNotes": [
      "Exterior appears aged.",
      "Roof inspection recommended."
    ],
    "recommendations": [
      "Schedule roof inspection.",
      "Review drainage and vegetation near the structure."
    ]
  }
}
```

#### Error response

Status: 400 Bad Request

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "propertyData is required and must be valid JSON.",
    "details": []
  }
}
```

Status: 500 Internal Server Error

```json
{
  "error": {
    "code": "ANALYSIS_FAILED",
    "message": "Unable to complete image analysis.",
    "details": []
  }
}
```

## Notes

- The backend may return a simplified mock response during development if the OpenAI API is unavailable.
- The frontend should treat the response as a single analysis result object and render its sections directly.
- Additional endpoints may be added later, but this contract should remain the primary integration point for the POC.
