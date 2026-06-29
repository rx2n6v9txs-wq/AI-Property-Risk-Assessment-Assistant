# AI Commercial Property Underwriting POC

A Proof of Concept that demonstrates how AI can assist insurance underwriters by analyzing commercial property images and generating underwriting summaries.

---

## Features

- Property Information Form
- Multiple Image Upload
- AI Image Analysis
- Risk Score
- AI Underwriting Report
- Dashboard

---

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- Carbon Design

### Backend

- Node.js
- Express
- TypeScript

### AI

- OpenAI Vision API
- OpenAI Chat API

---

## Project Structure

```
commercial-property-underwriting-poc/

├── frontend/
├── backend/
├── docs/
├── .github/
└── README.md
```

---

## Workflow

```
Property Details

↓

Upload Images

↓

Backend API

↓

AI Image Analysis

↓

Risk Score

↓

AI Underwriting Report

↓

Dashboard
```

---

## Run the Project

### Install Dependencies

Frontend

```bash
cd frontend
npm install
```

Backend

```bash
cd backend
npm install
```

---

### Start Frontend

```bash
cd frontend
npm run dev
```

---

### Start Backend

```bash
cd backend
npm run dev
```

### Verified Status

- Frontend build: passing
- Backend health endpoint: responding at http://localhost:5000/health

---

## Environment Variables

### frontend/.env

```
VITE_API_URL=http://localhost:5000
```

### backend/.env

```
PORT=5000

OPENAI_API_KEY=your_api_key
```

---

## POC Scope

Included

- Property Form
- Image Upload
- AI Analysis
- Risk Score
- AI Report

Not Included

- Authentication
- Database
- Production deployment
- Real underwriting engine
- Insurance policy management

---

## Future Improvements

- Weather integration
- Flood and wildfire data
- Historical CAT events
- Interactive maps
- PDF report generation
- Configurable underwriting rules
- Property comparison