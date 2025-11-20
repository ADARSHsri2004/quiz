# Quiz Management System

## Features
- Faculty & Student roles
- JWT authentication
- Quiz creation, MCQ taking, timer, auto-scoring, analytics
- Faculty analytics views
- Clean UI (Tailwind CSS)

## Getting Started

### 1. Backend
- Copy `.env.example` to `.env` and set MongoDB/JWT vars
- Run:
  ```
  cd backend
  npm install
  npm run dev
  ```
- Runs on http://localhost:5000

### 2. Frontend
- Configure proxy in `frontend/package.json` if backend PORT changes
- Run:
  ```
  cd frontend
  npm install
  npm start
  ```
- Runs on http://localhost:3000 (default)

## Dummy Login for Testing
- Use the Signup form to register as either faculty or student!

## Project Structure
- `backend/` Node.js Express (API, MongoDB via Mongoose)
- `frontend/` React + Tailwind CSS (UI)

---
For any questions or issues, check server/database logs or Tailwind docs.
