# Research pass 2 — 2026-09-30

## Added to structured data

- Fukushima 2025 requirement profile
- Fukushima 2026 requirement profile
- Yaizu 2025 evaluation criteria
- Kitakyushu 2025 evaluation criteria
- Fukushima 2025 evaluation criteria
- Fukushima 2026 evaluation criteria
- Kobe 2026 tax voicebot specialized requirements

After this pass:
- cases: 22
- general requirement profiles: 12
- evaluation criteria rows: 77
- specialized requirement facts: 21

## High-value findings

### A. Evaluation sheets reveal procurement priorities better than specifications alone

Yaizu allocates 65/100 to the proposal, 25/100 to supported requested functions, and 10/100 to price. Within the proposal, adoption support alone is 20 points.

Kitakyushu explicitly scores model choice, file/image/Web functions, UX, RAG grounding control, RAG scalability, administration, logs, security, update cadence, delivery capability, independent proposals, and price. The evaluation therefore captures not just compliance but product quality and vendor ability to keep pace with a rapidly changing AI market.

### B. Fukushima changes the unit of procurement from “AI service” to “organizational adoption experiment”

2025 procurement mainly tests a safe SaaS service:
- ChatGPT or Gemini
- training-data prohibition
- templates and logs
- 50 concurrent users
- 5 million characters/month
- training and support
- separate 53 Microsoft 365 Copilot licenses

2026 adds:
- RAG and grounding
- document-level access control
- RBAC/admin separation
- configurable data/log retention
- encryption and incident response
- 100+ users / 20 million characters per month
- use-case creation
- internal rules and risk classification
- RAG data cleansing
- KPI and workload-reduction estimates
- organization-wide adoption activity
- municipal-staff training
- production requirements and phased deployment proposal

Price stays 10/100 points in both years. The evaluation shift is toward RAG, adoption, and hands-on implementation rather than a higher price weighting.

### C. “Generative AI procurement” can intentionally prohibit generative answers

Kobe's tax voicebot uses AI for speech/language understanding and routing, but the specification requires answers to come from city-provided FAQ-derived answer data and explicitly does not permit AI-generated answers.

This is important for classification. A procurement can use generative-AI-related technology while deliberately constraining generation in the citizen-facing answer path.

### D. Voice AI has a different procurement vocabulary

The Kobe voicebot specification includes:
- calls/year
- transfers/year
- SMS/year
- operating hours
- response latency
- clarification questions
- department transfer
- recording/log export
- FAQ maintenance cadence
- confidentiality and personal-data controls

These do not fit cleanly into the general-purpose chatbot wide table. The new long-form specialized table preserves them without forcing premature common columns.

## Remaining high-priority gaps

The highest-value missing sources are still the Excel requirement matrices for Obu, Yaizu and Kitakyushu. They are likely to contain product-level requirements that are more granular than the PDF specifications.

The next expansion should also test whether the same comparison model works for:
- joint municipal procurement
- general competitive bidding rather than proposal selection
- small municipalities
- additional specialized AI such as voice, document generation, workflow/agent platforms
