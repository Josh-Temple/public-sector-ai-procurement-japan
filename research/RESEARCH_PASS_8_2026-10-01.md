# Research pass 8 — 2026-10-01

## Goal

Test whether the evidence-hardening model still works when:

1. a large-city general-purpose generative-AI procurement has a private Q&A channel and an unavailable mandatory-function workbook; and
2. a specialized AI procurement has a materially different vocabulary and contract-document precedence rules.

Targets:
- Kitakyushu 2025 generative-AI service
- Kobe 2026 tax voicebot

No new cases were added.

## Kitakyushu 2025

Official public sources confirm:
- announcement: 2025-04-21
- ceiling: 9,000,000 JPY including tax
- selected: QTnet
- 5 proposers
- service target: ~7,500 users / ~400 concurrent users
- intended service start: 2025-07-01
- existing RAG migration:
  - AI Mayor Secretary: ~200 files
  - AI Accounting Room: >2,000 files / ~5GB
  - 13 additional RAG environments
- proposal evaluation explicitly scores model selection, file/image/Web functions, UX, RAG grounding, RAG scalability, management/logs, security, update cadence, delivery capability and price

### Public reconstruction limit

The specification says all items marked mandatory in the separate function-requirement matrix must be satisfied.

That Excel workbook exists on the official page but remains unavailable through the current retrieval/download path.

More importantly, the procurement guide states that all Q&A responses are sent by email to proposal participants. No public Q&A body was found.

Therefore:
- public specification/evaluation material can establish the procurement baseline;
- the complete final set of proposal-stage effective requirements cannot be reconstructed from public sources alone.

This is stored as `public_reconstructability=publicly_bounded`.

### Useful public baseline facts

The specification itself establishes one meaningful alternative:
- the existing AI Mayor Secretary includes system tuning;
- if that tuning is not reproduced, an equivalent prompt template can be created in consultation with the city.

This is an example of an allowed implementation alternative that can be represented without the missing workbook.

## Kobe 2026 tax voicebot

Official public sources confirm:
- proposal distribution started 2026-02-17 (FY2025)
- planned project start: 2026-04-01 (FY2026)
- selected: NTT Marketing Act ProCX
- 3 proposals
- published scores: 70 / 55 / 54
- contract amount: 12,760,000 JPY including tax
- service specification is explicitly a set of minimum requirements

### Specialized requirement boundary

The procurement requires AI technology for speech/context understanding but explicitly prohibits AI-generated citizen-facing answers.

Answers must come from answer data based on city-provided FAQ content.

This shows that:
- AI capability and generative answer permission are separate procurement dimensions;
- classifying the case as “generative AI” does not imply unconstrained text generation in the answer path.

Other confirmed baseline requirements include:
- ~25,000 automated inquiries/year
- ~2,500 staff transfers/year
- ~5,000 SMS sends/year
- basic 3-second connect/response target
- up to ~5 seconds when a non-disruptive wait message is used
- transfer to section/unit, not an individual staff member
- recorded conversation/response/operation logs
- export in audio and editable formats such as CSV
- security controls for data that can include confidentiality level 2 or higher

### Contract-final reconstruction limit

This case introduces a stronger evidence boundary than the previous cases.

The official procurement guide states that, when contract documents conflict, precedence is:
1. proposal-Q&A answers
2. specification
3. proposal documents

However, if a proposal exceeds the level required by the Q&A/specification, that superior proposal portion can prevail.

Other conflicts are resolved after discussion with the selected contractor.

The Q&A itself was emailed to participants and is not publicly available.

Therefore the public specification is a **procurement minimum baseline**, not a complete contract-final specification.

This is why specialized-requirement rows now include:
- `applicability_stage=procurement_minimum`
- `public_reconstructability=publicly_bounded`

## Evaluation structure

Kobe voicebot evaluation:
- similar experience: 5
- implementation team: 10
- work procedure: 10
- proposal content: 50
- price: 15
- local-company opportunity: 10
- total: 100

A score below 50 cannot be selected.

The published selected score was 70.

## Model change

The repository now separates two questions:

1. What did the publicly available procurement documents require?
2. Can those public documents reproduce the final effective/contract requirement state?

New fields:
- `applicability_stage`
- `public_reconstructability`

New evidence state:
- `not_public`

The important distinction is:
- `source_unavailable`: a public source exists but could not be retrieved;
- `not_public`: official documents establish that a source exists/was used, but its body was not generally published.

These must not be collapsed.

## Structured changes

After this pass:
- cases: 26
- source documents: 31
- effective requirements: 40
- review coverage records: 29
- case timeline records: 8
- evaluation criteria: 112
- published vendor score rows: 22
- procurement structure rows: 10
- specialized AI requirement rows: 21
- reasoning regression questions: 15

## Bounded conclusion

The Source -> Effective Requirement -> Projection pattern still works for both a large general-purpose procurement and a specialized voice-AI procurement, but the audit exposes an important limit:

**the repository must model public reconstructability, not pretend that all official procurement facts are public.**

The next architectural question is no longer whether the model can represent Q&A changes. It is whether the project should define a small, repeatable “evidence completeness” measure for each case without turning it into a misleading overall maturity score.
