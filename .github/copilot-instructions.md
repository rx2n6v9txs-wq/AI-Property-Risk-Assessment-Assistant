# AI Commercial Property Underwriting POC

## Objective

Build a Proof of Concept that helps insurance underwriters evaluate commercial properties using AI.

The application should allow users to:

- Enter property information
- Upload property images
- Analyze images using an AI Vision model
- Generate a simple risk score
- Generate an AI underwriting report

This project is only a POC.

Focus on simplicity, readability, and working functionality.

---

## Project Structure

```
frontend/
backend/
docs/
```

Keep frontend and backend completely separated.

---

## Frontend

Use

- React
- Vite
- TypeScript
- Tailwind CSS
- Carbon Design

Frontend responsibilities

- Property form
- Image upload
- Display AI findings
- Display risk score
- Display underwriting report
- Call backend APIs

Keep components reusable.

---

## Backend

Use

- Node.js
- Express
- TypeScript

Backend responsibilities

- Receive property data
- Receive uploaded images
- Call OpenAI Vision
- Generate risk score
- Generate underwriting report
- Return JSON response

Keep business logic inside services.

---

## AI

Use OpenAI APIs.

Vision Model

Detect

- Roof condition
- Exterior damage
- Cracks
- Water leakage
- Vegetation
- Parking condition

LLM

Generate

- Property Summary
- Risk Level
- Underwriting Notes
- Recommendations

---

## Coding Guidelines

- Use TypeScript everywhere.
- Prefer small reusable functions.
- Keep components simple.
- Avoid unnecessary abstractions.
- Do not over-engineer.
- Mock external insurance APIs when needed.

---

## POC Scope

Include

- Property Details
- Image Upload
- AI Analysis
- Risk Score
- AI Report

Do not include

- Authentication
- Database
- User Management
- Notifications
- Complex business rules