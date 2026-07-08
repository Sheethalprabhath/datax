# DataX – Clinical Context & Agent Workspace


# Installation

Clone the repository

```bash
git clone https://github.com/Sheethalprabhath/datax.git
```

Move into the project

```bash
cd datax
```

Install dependencies

```bash
npm install
```

---

# Running the Project

Start the development server

```bash
npm run dev
```

Open your browser

```
http://localhost:3000
```

---

 

# Environment Variables

The application works in Mock Mode without any API key.

 

---

# API Endpoints

## Patients

```
GET    /api/patients
POST   /api/patients
GET    /api/patients/:id
```

## Clinical Context

```
GET    /api/patients/:id/context
POST   /api/patients/:id/context
```

## Agent Chat

```
GET    /api/patients/:id/chat
POST   /api/patients/:id/chat
```

## Drafts

```
GET    /api/patients/:id/drafts
POST   /api/patients/:id/drafts
```

---


## Overview

DataX is a clinician-focused web application built to demonstrate how synthetic patient records can be transformed into structured clinical context for AI-assisted workflows.

The application separates:

- Raw patient information
- Derived clinical context
- AI-assisted clinician tasks
- Draft outputs for review

All patient information in this project is synthetic and intended only for demonstration purposes.

---

# Features

## Patient Management

- View all patients
- Search patients
- Create new patient records
- View detailed patient profile
- Structured patient information
- Synthetic patient dataset

## Patient Profile

Displays:

- Patient Information
- Problems / Conditions
- Medications
- Allergies
- Vitals
- Laboratory Results
- Clinical Notes
- Insurance Information
- Emergency Contact
- Social History
- Encounters

## Clinical Context

Automatically generates a summarized clinical context including:

- Active problems
- Current medications
- Allergies
- Important observations
- Risk flags
- Missing information
- Evidence references

## Agent Workspace

Provides an AI-assisted workspace for bounded clinician tasks including:

- Handover Summary
- Risk Summary
- Missing Information Review
- New Clinician Takeover Summary

The agent does **not** provide:

- Diagnosis
- Treatment recommendations
- Medication changes

All responses are clearly marked as **Drafts for Clinician Review**.

---

# Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 15 |
| React | 19 |
| TypeScript | Latest |
| Tailwind CSS | Latest |
| Node.js | 20+ |
| JSON Storage | Local |
| OpenAI | Optional |

---

 


# Workflow

1. Create a patient.
2. Browse patients from the dashboard.
3. Open a patient profile.
4. Review raw patient information.
5. View derived clinical context.
6. Use the Agent workspace for supported tasks.
7. Save generated drafts for clinician review.

---

# Design Highlights

- Clean separation between raw data and derived context.
- Traceable evidence references.
- Rule-based clinical risk flags.
- Draft-only AI outputs.
- Mock mode available by default.
- Optional OpenAI integration.
- Modular React components.
- Type-safe TypeScript implementation.

---

# Safety

This project is designed for demonstration purposes only.

- Uses synthetic patient data only.
- No real Electronic Health Record integration.
- AI outputs are drafts.
- Diagnosis and treatment requests are intentionally rejected.
- Human clinician review is always required.

---

# Future Improvements

- Authentication
- Role-based access control
- FHIR integration
- Database support (PostgreSQL)
- Audit logging
- PDF export
- Better search
- Accessibility improvements
- Real-time updates

---

# Requirements

- Node.js 20 or later
- npm

Verify versions

```bash
node -v
npm -v
```

---

# License

MIT License

---

# Author

Developed as a demonstration project for a clinician-facing AI workflow using Next.js, React, TypeScript, and synthetic patient data.