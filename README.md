# FeedbackFlow AI (MVP)

Revenue & Feedback Intelligence for the Mid-Market.

## The Problem
Small and mid-market teams struggle to aggregate and extract actionable insights from raw customer feedback across multiple channels (Intercom, Zendesk, Twitter).

## The Solution
**FeedbackFlow AI** uses Google ADK to parse raw text, detect sentiment, categorize issues (e.g., Bug Report, Pricing, UX), and generate clear action items instantly.

## Tech Stack
- **Frontend/Backend:** Next.js (App Router)
- **AI Orchestration:** Google Agent Development Kit (ADK)
- **Database:** PGlite (Embedded Postgres)
- **Design:** Custom CSS Glassmorphism
- **QA:** Playwright (E2E Tests)
- **Deployment:** Vercel

## How to run locally
```bash
npm install
npm run dev
```

## E2E Testing
```bash
npm run test:e2e
```
