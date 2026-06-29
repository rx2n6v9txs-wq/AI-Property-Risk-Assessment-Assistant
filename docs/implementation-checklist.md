# Implementation Checklist

This checklist turns the POC plan into a step-by-step execution plan for both frontend and backend development.

## Phase 1 - Project Setup

### Frontend Starter Tasks
- [x] Create a Vite React + TypeScript app in the frontend folder
- [x] Install Tailwind CSS and Carbon Design components
- [x] Create a basic app shell with a header and page layout
- [x] Configure the API base URL from environment variables

### Backend Starter Tasks
- [x] Create an Express + TypeScript app in the backend folder
- [x] Configure TypeScript build and development scripts
- [x] Add middleware for JSON parsing and file upload support
- [x] Create a basic health check endpoint

---

## Phase 2 - Define Shared Data Types

- [x] Create shared TypeScript types for:
  - [x] property input data
  - [x] uploaded image metadata
  - [x] analysis findings
  - [x] risk score
  - [x] underwriting report
- [x] Align the frontend and backend with the API contract in docs/api-contract.md

---

## Phase 3 - Build the Property Form

### Frontend Tasks
- [x] Build a form with fields for address, property type, building year, occupancy, and roof type
- [x] Add basic validation for required fields
- [x] Add a submit button that sends the form to the backend

### Backend Tasks
- [x] Accept property form data from the frontend
- [ ] Validate the incoming request body or multipart payload
- [ ] Return a clear validation error for missing or invalid fields

---

## Phase 4 - Implement Image Upload

### Frontend Tasks
- [x] Add file input support for multiple image uploads
- [x] Allow JPG and PNG uploads only
- [x] Show image previews before submission
- [x] Send the selected files with the form submission

### Backend Tasks
- [x] Accept multipart/form-data requests
- [x] Parse propertyData and uploaded image files
- [x] Save or temporarily store uploads for processing

---

## Phase 5 - Connect the Analysis API

### Frontend Tasks
- [x] Create a service function to call POST /api/analyze
- [x] Send property data and images as a multipart request
- [x] Handle loading, success, and error states

### Backend Tasks
- [x] Create POST /api/analyze endpoint
- [x] Validate the request and image files
- [x] Return a mock analysis result if AI services are not yet configured

---

## Phase 6 - Implement AI Analysis Logic

### Backend Tasks
- [ ] Connect to the OpenAI Vision API to inspect uploaded images
- [ ] Extract findings such as roof condition, cracks, water leakage, vegetation, and parking condition
- [x] Create a simple rule-based risk score based on detected issues
- [ ] Generate a summary, underwriting notes, and recommendations with the LLM

### Frontend Tasks
- [x] Display the returned analysis findings clearly
- [x] Show the risk score and level in a readable format

---

## Phase 7 - Build the Results Dashboard

### Frontend Tasks
- [x] Show property details
- [x] Show uploaded images
- [x] Show AI findings
- [x] Show risk score
- [x] Show the underwriting report

### Backend Tasks
- [x] Ensure the response payload includes all required fields for the UI
- [x] Keep the response structure consistent with docs/api-contract.md

---

## Phase 8 - Polish and Validation

- [x] Add loading indicators during analysis
- [x] Add basic error handling for failed uploads or API errors
- [ ] Test the flow end to end from form submission to report display
- [ ] Review the POC against the scope defined in the project README

---

## Suggested Order of Execution

1. Setup frontend and backend
2. Define shared types and API contract
3. Build property form
4. Add image upload
5. Implement the analysis endpoint
6. Connect frontend to backend
7. Add AI findings and risk scoring
8. Display the final report
9. Polish and test
