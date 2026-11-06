# Dev Log — Parent Path

> A running record of build sessions and how Bob helped.

---

## 2026-11-06 · Session 1 — Project Planning

**What we did:**
- Defined the MVP scope for the IBM AI for Good Challenge (deadline Dec 2, 2026)
- Chose tech stack: React + Vite + Tailwind CSS, Vercel hosting, IBM Granite via watsonx.ai Lite, Vercel Edge Function as API proxy
- Decided on localStorage for availability updates (serverless, privacy-preserving)
- Selected react-i18next for EN/ES bilingual support
- Decided against a Python backend to ensure reliable free hosting (no Render cold-start during demo)
- Created SPEC.md, NEXT.md, and this devlog
- Created parent-path-plan.md with a 4-week subtask breakdown

**How Bob helped:**
- Explored the repo (clean slate — just README + LICENSE)
- Drafted the full SPEC.md including architecture diagram, responsible AI table, 4-week schedule, and assumptions
- Drafted NEXT.md with the first 3 actionable tasks
- Created the implementation plan file

**Decisions made:**
- Granite Guardian implemented as a system prompt instruction (not a separate endpoint) — assumption documented in SPEC.md
- AI responses English-only for MVP; UI strings bilingual
- Availability updates are localStorage-only (no sync across devices) — known limitation

**Next session:** Scaffold the Vite/React project and deploy to Vercel (NEXT.md Task 1)

---

## 2026-11-06 · Session 2 — Spec Revision

**What we did:**
- Revised SPEC.md, NEXT.md, parent-path-plan.md across 9 changes based on developer feedback
- Replaced localStorage availability with Supabase free tier (shared updates across all browsers)
- Corrected the challenge submission requirements: 3-minute spoken video, presentation slides, project page, team info, IBM SkillsBuild certificate
- Clarified provider data rule: Bob must not invent provider names, phones, or websites — all data is developer-verified
- Removed English-only AI assumption; Granite now responds in the user's selected language (EN/ES) for both chat and letter generator
- Clarified safety filter: use Granite Guardian model if available on Lite tier; otherwise use a prompt-based safety filter, labeled honestly — never call a system prompt "Granite Guardian"
- Added IEP/evaluation request letter generator as a new MVP feature and its own sub-task (Sub-Task 7)
- Moved Granite chat sub-task to Week 2 (right after provider directory); resource pages and polish moved to Week 3–4
- Updated privacy wording: "users are told not to enter names or diagnoses; chats are never stored"
- Added Assumption 8: Granite model ID must be verified at setup; using `ibm/granite-3-8b-instruct` as placeholder only
- Added Sub-Task 10 for all challenge submission materials
- Plan now has 10 sub-tasks across 4 weeks

**How Bob helped:**
- Read both SPEC.md and parent-path-plan.md in full before making changes
- Rewrote SPEC.md in place (all 9 changes applied in a single pass)
- Rewrote parent-path-plan.md with reordered sub-tasks, updated Sub-Tasks 1, 2, 4, 5, 6, and new Sub-Tasks 7 and 10
- Updated NEXT.md to reflect Supabase setup in Task 1 and the provider data verification rule in Task 2

**Decisions changed from Session 1:**
- localStorage → Supabase (shared availability updates)
- English-only AI → bilingual AI responses
- "Granite Guardian system prompt" → honest labeling (Guardian model if available, otherwise prompt filter)
- Letter generator added as a new core AI feature
- Sub-task order revised: AI chat moves earlier (Week 2)

**Next session:** Scaffold the Vite/React project, create Supabase table, deploy to Vercel (NEXT.md Task 1)
