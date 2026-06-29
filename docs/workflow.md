# Application Workflow

## User Flow

```
User
 │
 ▼
Enter Property Details
 │
 ▼
Upload Property Images
 │
 ▼
Frontend sends request to Backend
 │
 ▼
Backend analyzes images using AI
 │
 ▼
Generate Risk Score
 │
 ▼
Generate AI Underwriting Report
 │
 ▼
Return Result
 │
 ▼
Display Dashboard
```

---

## Backend Workflow

```
Receive Request

↓

Validate Input

↓

Store Images (temporary)

↓

Analyze Images

↓

Generate Risk Score

↓

Generate AI Report

↓

Return JSON Response
```

---

## AI Workflow

```
Images

↓

Vision Model

↓

Detected Issues

↓

Risk Score

↓

LLM

↓

Underwriting Report
```