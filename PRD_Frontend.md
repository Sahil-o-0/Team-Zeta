# ZETA — Product Requirements Document (PRD) for Frontend & User Experience

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2026-05-24  
**Owner:** ZETA Product & Frontend Team  

---

## 1. Executive Summary

**ZETA** is an Autonomous Workforce Operating System. The frontend represents the **Control Room** for enterprise HR operations teams to oversee, direct, and intervene in autonomous agent pipelines. 

This frontend-focused PRD details the requirements for the **Dashboard UI, Human-in-the-Loop Escalation Interfaces, Recruiting Pipeline visualizers, and overall UX aesthetics**.

---

## 2. Core Frontend Requirements

The web application must be built as a high-performance, premium Single Page Application (Next.js/React preferred) styled with a dark, modern aesthetic.

### 2.1 Screen requirements

#### FF-101: Live Command Center (Home Dashboard)
- **Grid Layout:** Three-column design showing aggregate operational metrics, live agent status, and recent activity logs.
- **Agent Pulse:** Visual indicator showing which agents are actively running, idle, or escalated (pulsing glows, status badges).
- **Activity Stream:** A real-time scrolling feed of structured actions completed by agents (e.g., "Screened Priya Mehta - Score 94/100").

#### FF-102: Escalation Queue (Human-in-the-Loop Interface)
- **Layout:** High-priority cards detailing issues that require manual human review or confirmation.
- **Card Elements:**
  - Clear hazard tags (Soft vs. Hard Escalations).
  - Highlighting agent's proposed action and confidence score.
  - Interactive "Approve", "Reject", and "Add Note" buttons.
  - Contextual link to candidate resume or historical documents.
- **Controls:** Supports rapid keyboard shortcuts (A for Approve, R for Reject).

#### FF-103: Interactive Recruiting Pipeline (Kanban)
- **Funnel Stages:** Sourced → Screening → Shortlisted → Interviewing → Offer.
- **UI Interaction:** Cards display candidate names, AI scores, and current status. 
- **Agent Tracking:** Hover states showing which background agent processed or moved the candidate.

#### FF-104: Organizational Memory Explorer
- **Search bar:** Semantic query engine allowing HR managers to search institutional knowledge (e.g., "Find hiring patterns in Q3").
- **Insight cards:** Clean summary tiles outlining patterns learned by the agents.

---

## 3. UI Design System & Component Library

All elements must adhere to the design guidelines in `design.md`:

- **Theme:** Default sleek dark mode utilizing custom CSS variables.
- **Colors:**
  - Background: Deep slate/black (`#0A0C10`).
  - Accent Primary: Electric Blue (`#5B8AF0`).
  - Accent Secondary/AI: Violet (`#8B5CF6`).
  - Success/Approved: Emerald Green (`#10D48E`).
  - Warning/Escalated: Amber (`#F59E0B`).
- **Typography:** Display titles in `Space Grotesk`, body text in `Inter`, and code/agent activity logs in `JetBrains Mono`.
- **Transitions:** 200ms ease-out animations on interactive components; pulsing glow effects around active agent avatars.

---

## 4. Accessibility & Responsiveness

- **Mobile View:** Critical focus on the **Escalation Queue**. Managers must be able to review and approve/reject agent decisions on mobile screens instantly.
- **Accessibility:** Focus indicators must be highly visible; color must never be the only indicator of a state (must pair with clear status icons/labels); support `prefers-reduced-motion`.

---

*Document Owner: ZETA Product & Frontend Team*
