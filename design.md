# ZETA — Design Document

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2026-05-24  
**Owner:** ZETA Design Team  

---

## 1. Design Philosophy

ZETA is not a dashboard. It is not a chatbot interface. It is a **control room for an autonomous workforce operations team**.

The design must communicate:
- **Trust** — Enterprises are delegating real HR decisions. The UI must feel authoritative, precise, and transparent.
- **Control** — Users must feel in command, not overwhelmed. Every agent action is visible, explainable, and overridable.
- **Intelligence** — The product must visually feel more advanced than a "workflow tool." It should feel like operating a sophisticated system.
- **Calm** — Enterprises are anxious about AI. The design must project calm, confidence, and reliability — not chaos.

> Design principle: **"A Bloomberg Terminal for your HR operations team."**

---

## 2. Brand Identity

### 2.1 Name & Meaning

**ZETA** — The final frontier of workforce intelligence. The last letter before the next era.

**Tagline:** *"The Autonomous Workforce OS"*  
**Sub-tagline:** *"AI employees for HR operations."*

### 2.2 Logo Concept

- Minimal wordmark: `ZETA` in a clean, geometric sans-serif (Geist or Space Grotesk)
- A subtle accent: a small circuit/node mark connecting the `Z` and `A`, suggesting a networked intelligence
- Monochromatic by default; glows on dark backgrounds

### 2.3 Color System

| Token | Hex | Usage |
|---|---|---|
| `--color-bg-primary` | `#0A0C10` | Main app background (near-black deep space) |
| `--color-bg-surface` | `#111318` | Card/panel surfaces |
| `--color-bg-elevated` | `#1A1D24` | Modal, dropdown, elevated surfaces |
| `--color-bg-subtle` | `#1F2330` | Hover states, subtle dividers |
| `--color-border` | `#2A2E3D` | Default borders |
| `--color-border-active` | `#3D4560` | Active/focused borders |
| `--color-accent-primary` | `#5B8AF0` | Primary actions, links, active states (electric blue) |
| `--color-accent-secondary` | `#8B5CF6` | Secondary highlights, AI-specific elements (violet) |
| `--color-accent-success` | `#10D48E` | Success states, approved, completed |
| `--color-accent-warning` | `#F59E0B` | Warnings, soft escalations |
| `--color-accent-danger` | `#EF4444` | Errors, critical escalations |
| `--color-text-primary` | `#E8EAF0` | Primary body text |
| `--color-text-secondary` | `#9499B0` | Secondary/muted text |
| `--color-text-tertiary` | `#545870` | Placeholders, hints |
| `--color-ai-glow` | `#5B8AF0` at 20% opacity | AI activity glow effects |

### 2.4 Typography

| Token | Font | Weight | Size | Usage |
|---|---|---|---|---|
| `--type-display` | Space Grotesk | 700 | 32–48px | Page headings, hero text |
| `--type-heading` | Space Grotesk | 600 | 20–28px | Section headings |
| `--type-subheading` | Inter | 500 | 14–16px | Card titles, labels |
| `--type-body` | Inter | 400 | 14px | Main body content |
| `--type-caption` | Inter | 400 | 12px | Timestamps, metadata |
| `--type-mono` | JetBrains Mono | 400 | 13px | Agent logs, code, IDs |
| `--type-badge` | Inter | 600 | 11px | Status badges, tags |

### 2.5 Motion Design

ZETA's interface is **alive but not distracting**. Animations signal intelligence without overwhelming.

| Pattern | Behavior |
|---|---|
| **Agent thinking** | Pulsing glow ring (blue → violet, 1.5s loop) around active agent avatar |
| **Task completion** | Brief shimmer sweep across completed task row |
| **Escalation arrival** | Card slides in from right with a subtle amber border pulse |
| **Data loading** | Skeleton shimmer (dark shimmer on `--color-bg-surface`) |
| **Transitions** | 200ms ease-out for all UI state changes |
| **Agent status change** | Dot indicator cross-fades between colors |

---

## 3. Information Architecture

### 3.1 Primary Navigation

```
ZETA
├── Command Center          (Default home — live operations view)
├── Agent Network           (View and manage all agents)
│   ├── Talent Scout
│   ├── Screening
│   ├── Interview
│   ├── Scheduling
│   ├── Onboarding
│   ├── Employee Support
│   ├── Policy
│   └── Workforce Analytics
├── Recruiting Pipeline     (End-to-end hiring view)
│   ├── Active Roles
│   ├── Candidate Pool
│   └── Interview Queue
├── Escalation Queue        (Human review required)
├── Workforce Intelligence  (Analytics and predictions)
│   ├── Attrition Risk
│   ├── Hiring Analytics
│   └── Org Health
├── Organizational Memory   (Search ZETA's institutional knowledge)
├── Integrations            (Connected systems status)
└── Settings
    ├── Agent Configuration
    ├── Escalation Rules
    ├── Team & Permissions
    └── Audit Logs
```

### 3.2 Key User Flows

#### Flow 1: Opening a New Role
1. Recruiter creates a new role (JD + requirements)
2. ZETA auto-activates Talent Scout → Screening → Scheduling pipeline
3. Recruiter sees live progress in Recruiting Pipeline view

#### Flow 2: Escalation Review
1. Agent flags a decision → Escalation Queue updates
2. Reviewer sees: task context, agent recommendation, confidence score, action buttons
3. Reviewer approves/rejects → agent continues/stops

#### Flow 3: Employee Support Request
1. Employee submits request via embedded widget or chat
2. Employee Support Agent classifies and handles autonomously or escalates
3. Employee receives real-time status updates

---

## 4. Screen Designs

### 4.1 Command Center (Home)

**Purpose:** Real-time operational overview — what are the agents doing right now?

**Layout:** 3-column grid with persistent left sidebar

```
┌──────────────────────────────────────────────────────────────────────┐
│ ZETA                    Command Center         [Escalations: 3 ●]    │
├────────┬─────────────────────────────────────────────────────────────┤
│        │  TODAY'S OPERATIONS                              May 24      │
│  NAV   │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐   │
│        │  │ Candidates   │ │ Tasks        │ │ Escalations      │   │
│ ○ Cmd  │  │ Sourced      │ │ Completed    │ │ Pending          │   │
│ ○ Agnt │  │    47        │ │    312       │ │     3            │   │
│ ○ Rcrt │  │ ▲ 23% today  │ │ ✓ 98.7% auto │ │ ⚠ 2 need review  │   │
│ ○ Esc  │  └──────────────┘ └──────────────┘ └──────────────────┘   │
│ ○ Intel│                                                             │
│ ○ Mem  │  AGENT NETWORK STATUS                                       │
│ ○ Int  │  ┌─────────────────────────────────────────────────────┐   │
│        │  │ ● Talent Scout    Running  │ 12 candidates sourced   │   │
│        │  │ ● Screening       Running  │ 8 resumes in queue      │   │
│        │  │ ● Scheduling      Idle     │ Next: 2:30pm interview  │   │
│        │  │ ● Interview       Running  │ Live interview — Sarah  │   │
│        │  │ ● Onboarding      Running  │ 2 new hire flows active │   │
│        │  │ ● Emp. Support    Running  │ 4 tickets in progress   │   │
│        │  │ ● Policy          Idle     │ All systems nominal      │   │
│        │  │ ◐ Analytics       Learning │ Weekly report: 2h away  │   │
│        │  └─────────────────────────────────────────────────────┘   │
│        │                                                             │
│        │  LIVE AGENT ACTIVITY                         [View All →]   │
│        │  ┌─────────────────────────────────────────────────────┐   │
│        │  │ 2m ago  Talent Scout sourced 3 candidates for SWE-2  │   │
│        │  │ 5m ago  Screening Agent shortlisted: Priya M. (94)   │   │
│        │  │ 8m ago  Scheduling confirmed: Sarah K. interview      │   │
│        │  │ 12m ago Onboarding: IT provisioned for Jake L.       │   │
│        │  │ 15m ago ⚠ Escalation: Payroll mismatch — John D.    │   │
│        │  └─────────────────────────────────────────────────────┘   │
└────────┴─────────────────────────────────────────────────────────────┘
```

**Design Notes:**
- Agent status dots use animated pulse for "Running" state (blue glow)
- "Learning" state uses a spinning arc indicator (violet)
- Activity feed uses monospace timestamps; important events use amber/red accent text
- Stats cards use counter-up animation on load

---

### 4.2 Agent Network View

**Purpose:** Deep dive into each agent — tasks, history, performance, and configuration.

**Layout:** Agent card grid on load → expands to full agent detail panel

```
AGENT NETWORK
─────────────
┌────────────────────────┐  ┌────────────────────────┐
│ ● TALENT SCOUT AGENT   │  │ ● SCREENING AGENT      │
│ Running                │  │ Running                │
│ ─────────────────────  │  │ ─────────────────────  │
│ Tasks today:    147    │  │ Screened today:  63    │
│ Success rate: 99.1%    │  │ Shortlist rate: 31%    │
│ Avg task time:  4.2m   │  │ Avg score:      72.4   │
│              [View →]  │  │              [View →]  │
└────────────────────────┘  └────────────────────────┘
```

**Agent Detail Panel (expanded):**
- **Header:** Agent name, current status, uptime, health score
- **Live task feed:** What the agent is doing right now (with expandable trace)
- **Performance metrics:** Charts for task volume, success rate, escalation rate over time
- **Configuration:** Adjustable parameters (confidence threshold, escalation rules, memory scope)
- **Memory access log:** What memory entries this agent recently read/wrote

---

### 4.3 Escalation Queue

**Purpose:** The most critical human-facing view. Must be fast and decisive.

```
ESCALATION QUEUE                               3 Pending  |  Filter ▼
─────────────────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────┐
│ ⚠ PAYROLL MISMATCH — John Davidson               HARD ESCALATION │
│ ─────────────────────────────────────────────────────────────── │
│ Agent: Employee Support Agent                     15 mins ago    │
│ Detected payroll discrepancy: $420 difference in March payslip   │
│                                                                   │
│ Agent Recommendation:                                             │
│ "Escalate to payroll team for manual review. Confidence: 0.91"   │
│                                                                   │
│ Context:  [View payslip →]  [Employee history →]                 │
│                                                                   │
│ [  ✓ Approve & Route to Payroll  ]  [  ✗ Dismiss  ]  [Note →]   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ○ UNUSUAL CANDIDATE — Maya Patel (SWE-2)         SOFT ESCALATION │
│ ─────────────────────────────────────────────────────────────── │
│ Agent: Screening Agent                            32 mins ago    │
│ Score: 67/100 — Below threshold but strong system design signals │
│                                                                   │
│ Agent Recommendation:                                             │
│ "Consider for interview. Confidence: 0.63 (below auto threshold)"│
│                                                                   │
│ Auto-proceeds in: 3h 28m  (unless you act)                       │
│                                                                   │
│ [  ✓ Approve Shortlist  ]  [  ✗ Reject  ]  [  ✎ Review Resume ]  │
└─────────────────────────────────────────────────────────────────┘
```

**Design Notes:**
- Hard escalations use amber left border with pulsing glow; Emergency uses red
- Confidence score displayed as a visual bar (not just number)
- Auto-proceed countdown creates gentle urgency without alarm
- Every escalation card is keyboard-navigable (a/r/n hotkeys for approve/reject/note)

---

### 4.4 Recruiting Pipeline View

**Purpose:** Kanban-style view of all candidates across the hiring funnel.

```
RECRUITING PIPELINE                    SWE-2 — Senior Software Engineer ▼

Sourced (24)    Screening (8)    Shortlisted (5)    Interview (3)    Offer (1)
─────────────   ─────────────   ────────────────   ─────────────    ─────────

┌───────────┐   ┌───────────┐   ┌───────────────┐   ┌──────────┐   ┌───────┐
│ Priya M.  │   │ Alex K.   │   │ ✦ Sarah Chen  │   │ Jordan   │   │ Maya  │
│ GitHub:★  │   │ Score: 81 │   │ Score: 94     │   │ Live now │   │ Offer │
│ 2d exp    │   │ Pending   │   │ Strong signal │   │ 1:30pm   │   │ Sent  │
└───────────┘   └───────────┘   └───────────────┘   └──────────┘   └───────┘
```

**Design Notes:**
- Cards use minimal design: name, key signal, AI-assigned score badge
- ✦ marks AI-flagged "high potential" candidates
- Columns have count badges; overflow collapses with "+N more"
- Drag is disabled (agents move candidates autonomously); human actions via card actions

---

### 4.5 Organizational Memory Explorer

**Purpose:** Let HR teams search ZETA's institutional knowledge.

```
ORGANIZATIONAL MEMORY
─────────────────────
Search memory...  [  🔍 Ask ZETA: "Why do we reject candidates without system design?"  ]

RECENT INSIGHTS
────────────────────────────────────────────────────────────────────────
│ 📋 Engineering Hiring Pattern                          6 months of data │
│ Engineering has rejected 23 of 24 candidates without distributed       │
│ systems experience since Q3 2024. This is now a hard filter signal.    │
│ Sources: 47 screening decisions, 12 hiring manager comments            │
│                                              [Explore →]  [Export →]   │
────────────────────────────────────────────────────────────────────────
│ 🔁 Attrition Pattern — Sales Team                      Q1 2026 data    │
│ Sales hires from Agency A have 2.1x higher 6-month attrition rate     │
│ vs. direct sourced. Talent Scout now de-prioritizes Agency A.          │
│                                              [Explore →]  [Export →]   │
────────────────────────────────────────────────────────────────────────
```

---

### 4.6 Workforce Intelligence Dashboard

**Purpose:** Predictive analytics for HR leadership.

**Key Components:**
- **Attrition Risk Heatmap:** Org chart overlaid with attrition risk scores (red/yellow/green)
- **Hiring Velocity Chart:** Time-to-fill trend by department over rolling 90 days
- **Agent ROI Calculator:** Hours saved, cost saved, tasks automated vs. human baseline
- **Candidate Pipeline Health:** Drop-off rates by stage; interview completion rate trend

---

## 5. Component Library

### 5.1 Agent Status Badge

```
● Running    (animated blue dot, pulsing glow)
◐ Learning   (spinning half-arc, violet)
○ Idle       (static dim dot)
✓ Completed  (green checkmark, shimmer once)
⚠ Escalated  (amber warning icon, soft pulse)
✗ Failed     (red X, static)
```

### 5.2 Confidence Score Indicator

Displayed as a horizontal bar with numeric value:

```
Confidence: ████████░░  0.81  (Autonomous threshold)
             [========----]
              Blue fill | Gray empty
```
- `< 0.60` → Red bar (always escalate)
- `0.60–0.79` → Amber bar (soft escalation)
- `≥ 0.80` → Blue bar (autonomous action)

### 5.3 Agent Activity Card

Used in feeds and agent detail views:

```
┌────────────────────────────────────────────────────────┐
│ ● Screening Agent                        2 minutes ago  │
│ Evaluated: Priya Mehta for SWE-2                        │
│ Result: Shortlisted — Score 94/100                      │
│ Reasoning: Strong distributed systems, 5 YoE, GitHub ★ │
│                              [View Full Trace →]        │
└────────────────────────────────────────────────────────┘
```

### 5.4 Escalation Card

See Section 4.3 for full spec. Key elements:
- Left border color indicates severity (amber = soft, red = hard, crimson = emergency)
- Agent reasoning in quotation style
- Time-sensitive countdowns for soft escalations
- Primary action button always on the left (approve), secondary (reject) on the right

### 5.5 Metric Card

```
┌──────────────────────┐
│ Candidates Sourced   │
│ ─────────────────── │
│        47            │
│                      │
│  ▲ 23% vs yesterday  │
└──────────────────────┘
```

- Number uses counter-up animation on load
- Trend arrow color-coded: green up, red down (context-dependent)
- Subtle top border in accent color

---

## 6. Responsive Design

| Breakpoint | Layout |
|---|---|
| Desktop (≥ 1280px) | Full 3-column layout with persistent sidebar |
| Laptop (≥ 1024px) | 2-column with collapsible sidebar |
| Tablet (≥ 768px) | Single column, bottom navigation |
| Mobile (< 768px) | Escalation queue + notifications only (operational minimum) |

**Priority for mobile:** Escalation review must work perfectly on mobile — approval workflows are time-sensitive.

---

## 7. Accessibility Requirements

- WCAG 2.1 AA compliance minimum.
- All interactive elements must have keyboard navigation support.
- Color is never the sole conveyor of meaning (always paired with icon or label).
- Screen reader support for agent activity feeds and escalation cards.
- Focus indicators must be clearly visible (2px solid `--color-accent-primary`).
- Animation must respect `prefers-reduced-motion`.

---

## 8. Empty States & Onboarding

### 8.1 Empty State Design

Each section should have a purposeful empty state:
- **No active agents:** "Connect your first integration to activate the agent network." + [Connect →]
- **No escalations:** "✓ All clear. Your agents are operating autonomously." (green success tone)
- **No candidates:** "Talent Scout hasn't sourced candidates yet. Open a role to begin." + [New Role →]

### 8.2 First-Time Onboarding Flow

1. **Welcome screen:** ZETA branding + 3-step preview of what the system does
2. **Connect calendar:** OAuth flow (Google or Microsoft)
3. **Connect ATS:** Select from supported ATS list
4. **First role setup:** Create a role → watch Talent Scout activate in real time (wow moment)
5. **Escalation preferences:** Set thresholds and notification preferences

---

## 9. Error States

| Error Type | Design Treatment |
|---|---|
| Agent failure | Red status badge + inline error card in agent feed with retry button |
| Integration disconnected | Warning banner at top of relevant view + [Reconnect →] |
| Memory retrieval failure | Inline warning in UI + cached data served where possible |
| API rate limit hit | Amber notice: "External system rate limited — tasks queued" |
| Authentication expired | Full-screen overlay: "Session expired — reconnect to [System]" |

---

## 10. Voice & Tone

| Situation | Tone | Example |
|---|---|---|
| Agent completing tasks | Confident, factual | "Screened 8 candidates. 3 shortlisted." |
| Escalation required | Clear, non-alarmist | "A payroll discrepancy requires your review." |
| Success state | Warm, brief | "All clear. ZETA is handling operations." |
| Error state | Direct, actionable | "Interview scheduling failed. Retry or assign manually." |
| Agent reasoning | Precise, evidence-based | "Shortlisted based on distributed systems experience and 94th percentile GitHub activity." |

**Never use:**
- Excessive exclamation marks
- "AI magic" language
- Vague phrases like "something went wrong"
- Over-anthropomorphizing agents ("ZETA is thinking really hard...")

---

*Document Owner: ZETA Design Team*  
*Next Review: Design Review — Sprint 1*
