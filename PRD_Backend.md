# ZETA — Product Requirements Document (PRD) for Backend & Agent System

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2026-05-24  
**Owner:** ZETA Product & Backend Team  

---

## 1. Executive Summary

**ZETA** is an Autonomous Workforce Operating System — a network of specialized AI agents that collectively manage recruiting, onboarding, HR operations, and workforce intelligence for enterprises. Unlike traditional HR SaaS, ZETA acts as a **digital HR operations team** that owns outcomes, makes decisions, and operates backend workflows independently.

This backend-focused PRD details the requirements for the **Multi-Agent Operating Layer, Persistent Memory, Decision Engine, and computer-use integration systems**.

---

## 2. Target Agent Scope & Capabilities

The backend operates a multi-agent network coordinated by a Manager Agent:

| Agent | Core Backend / Agent System Responsibility |
|---|---|
| **Manager Agent** | Orchestrates tasks, monitors agent execution, manages retries, routes escalations |
| **Talent Scout Agent** | Autonomously searches external APIs/job boards; generates personalized outreach |
| **Screening Agent** | Parses/evaluates candidate profiles against dynamic rubrics and historical pool data |
| **Interview Agent** | Orchestrates structured audio/video/text interview flows; extracts key skills and transcripts |
| **Scheduling Agent** | Coordinates multi-party calendar availability; handles timezones and no-show recovery |
| **Verification Agent** | Executes background/fraud checks via third-party secure APIs |
| **Onboarding Agent** | Triggers IT provisioning ticket flows, document signing, and payroll initializations |
| **Employee Support Agent** | Classifies incoming requests; resolves Tier-1 queries autonomously |
| **Policy Agent** | Parses policy documents; validates compliance of agent actions |
| **Workforce Analytics Agent** | Analyzes employee behavioral signals, communication frequency, and retention risks |

---

## 3. Core Backend Feature Requirements

### 3.1 Phase 1 — Autonomous Recruiting Copilot Engine

#### BF-101: Autonomous Candidate Sourcing Engine
- **Requirement:** Talent Scout Agent connects to LinkedIn, GitHub, and job board APIs.
- **Logic:** Performs semantic queries based on Job Descriptions (JD). Extracts contact info, resume/profile links, and work history.
- **Outreach Generation:** Generates hyper-personalized outreach emails matching candidate projects and JD requirements.
- **Metric:** Source ≥ 50 qualified candidates per active role within 24 hours.

#### BF-102: Smart Resume Screening & Ranking
- **Requirement:** Screening Agent parses PDFs, Word docs, and markdown resumes.
- **Logic:** Evaluates candidate qualifications against JD and team-specific historical hiring data in organizational memory.
- **Bias Mitigation:** Masks demographic indicators (name, gender, age) during initial evaluation run.
- **Output:** Numerical rating (0-100) and structured pros/cons list explaining the score.

#### BF-103: Dynamic Scheduling Engine
- **Requirement:** Scheduling Agent interacts with Google Calendar and Outlook Calendar APIs.
- **Logic:** Identifies candidate and interviewer availability, matches across timezone variations, handles instant rescheduling triggers, and coordinates Zoom/Teams link generation.

#### BF-104: Interview Transcription & Analytics
- **Requirement:** Interview Agent ingests audio/video streams, triggers real-time transcription APIs, and extracts structured feedback.
- **Logic:** Identifies skills gaps, discrepancies with the resume, and computes a hiring recommendation score.

---

### 3.2 Phase 2 — Autonomous Outreach & Questions

#### BF-201: Multi-touch Outreach & Engagement
- **Requirement:** Automate multi-step follow-ups on candidate engagement.
- **Logic:** Analyzes candidate email response sentiment to adjust tone or trigger next-step booking flows.

#### BF-202: Adaptive Async Interview Questioning
- **Requirement:** Dynamically adjust interview questions based on candidate's previous answers in real time.

---

### 3.3 Phase 3 — HR Operator Integrations

#### BF-301: Onboarding & Provisioning Engine
- **Requirement:** Integrate with IT ticketing systems (Jira/ServiceNow), payroll engines, and document platforms (DocuSign).
- **Logic:** Automate ticket generation, track document signing status, and write new employee records to HRIS.

#### BF-302: Automated PTO & Policy Auditing
- **Requirement:** Employee Support Agent evaluates simple leave requests against policy limits and team calendar blocks autonomously.

#### BF-303: Live Payroll Verification
- **Requirement:** Cross-reference scheduled timecards/contracts with payroll records. Flag discrepancies > $0.00 immediately.

---

### 3.4 Phase 4 — Workforce Intelligence Engine

#### BF-401: Predictive Attrition Models
- **Requirement:** Workforce Analytics Agent runs continuous analysis on anonymous communication metrics, tenure, and compensation bands.
- **Logic:** Predicts departure risk with actionable mitigation steps.

---

## 4. System & Integration Requirements

- **API Integrations:** Standardized connector layer for ATS (Greenhouse, Lever), HRIS (BambooHR, Workday), and Calendars.
- **Browser Use Execution:** Playwright-based fallback execution for legacy HR portals without modern APIs.
- **Security & Privacy:** End-to-end encryption, multi-tenant database isolation, SOC 2 compliance readiness, and data retention policies for candidate files.

---

*Document Owner: ZETA Product & Backend Team*
