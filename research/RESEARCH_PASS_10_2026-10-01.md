# Research pass 10 — 2026-10-01

## Goal

Test the evidence model against two contrasting procurement patterns:

1. Hokkaido 2026 — restricted general competitive bidding for a RAG service
2. Koshigaya 2024 — public proposal with public Q&A and requirements embedded in the specification

No new cases were added.

## Hokkaido 2026

Official public evidence confirms:
- restricted general competitive bidding
- announcement: 2026-04-03
- service period: 2026-06-01 to 2027-03-31
- ISO/IEC 27001 certification for the proposed cloud service is a bid-participation qualification
- three bidders
- Hitachi: 9,587,430 JPY tax-exclusive bid, selected
- Exa Enterprise AI: 12,536,000
- NTT East: 18,500,000

The detailed specification is the official business processing manual contained in the official ZIP.

That ZIP remains unavailable through the current retrieval path.

Therefore detailed RAG/model/capacity requirements are not reconstructed from the 2025 pilot or inferred from the title.

### Evidence-role result

- specification: source_unavailable
- qa_amendment: not_assessed
- requirement_matrix: not_assessed
- evaluation: not_applicable
- result: reviewed
- contract_final: not_assessed

The important new state is `not_applicable`.

A proposal-scoring evaluation table is not “missing” in a lowest-price competitive-bid structure. Procurement qualification and bid price are represented in their own tables.

## Koshigaya 2024

Official public materials include:
- procurement page
- proposal guide
- service specification
- public Q&A
- published selection result

The service specification contains the requirements directly; there is no separate requirement-matrix document in the published package.

### Effective interpretations

- no fixed generative-AI model is specified; proposer selects a model satisfying requirements
- at least 1,000,000 characters/month is mandatory
- unlimited usage is not mandatory; it is an evaluated proposal item
- RAG / organization-information grounding is a proposal item rather than a mandatory requirement
- input/output must not be used for model training and must not be stored on the LLM server
- support hours differing from the city’s expected hours can be proposed if disclosed and are evaluated
- service scope includes usable accounts plus service/support, not account issuance alone
- proposal items must remain within the contract ceiling
- 20% document-creation-time reduction is a KGI/guideline, not a success/failure acceptance condition

### Evaluation

100 points:
- functional requirements: 30
- non-functional requirements: 15
- training: 15
- implementation / track record: 10
- price: 30

Proposals below 60% of the total are not selected.

Published result:
- Imacrea: 428.97 / 600
- Shiftplus: 421.13 / 600

### Evidence-role result

- specification: reviewed
- qa_amendment: reviewed
- requirement_matrix: not_applicable
- evaluation: reviewed
- result: reviewed
- contract_final: not_assessed

## Model change

Added `not_applicable` as a review-coverage state.

Use it only when primary evidence shows that the role does not apply because of procurement/document structure.

Do not use it as a substitute for:
- not reviewed
- not found
- source unavailable

## Current hardening state

- cases: 26
- source documents: 40
- effective requirements: 50
- review coverage rows: 43
- timeline rows: 10
- evaluation criteria: 117
- vendor score rows: 24
- procurement structure rows: 11
- reasoning regression questions: 19
- cases with hardening roles assessed: 8 / 26

## Bounded conclusion

The six-role evidence matrix can represent both:
- a price-competition procurement where qualitative evaluation is non-applicable; and
- a proposal procurement where requirements are embedded in the specification and a separate matrix is non-applicable.

This is better than treating every blank as missing evidence.

The next audit should focus on contract-final evidence or another case where a role is explicitly absent, before adding more coverage dimensions.
