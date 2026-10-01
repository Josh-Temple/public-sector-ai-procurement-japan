# Research pass 12 — 2026-10-01

## Goal

Audit a public-Q&A proposal case where specification text, questions, selection and contract signing are publicly visible, and correct the contract-final interpretation of the case-level evidence projection.

No case was added.

## Sendai 2025: official source sequence

Freshly reviewed the official project page and its public links to the procurement guide, specification draft, public Q&A and evaluation criteria.

The guide records announcement on 2025-03-25. Under the Japanese fiscal calendar this is FY2024, even though the stable case ID contains 2025. The city page records FIXER as contractor, 12 proposers and contract execution on 2025-06-23. The contract term ends 2025-10-31. Public Q&A Nos. 9 and 13 clarify that the service itself is used only during an approximately two-month verification period; its exact start and end dates are not published. The timeline therefore keeps those service-use dates blank rather than equating them with the contract term.

The guide treats Q&A as additions or corrections to the specification and says the selected proposal need not be implemented unchanged; the scope and amount can change through negotiation within the ceiling. The public page links a specification draft and a contract draft. No post-contract final specification or signed final requirement document was found in the reviewed official package.

## Procurement-effective requirements

Fifteen scoped records were added from the Q&A, not treated as contract-final facts. They preserve these high-impact distinctions:

- ordinary chat is expected but optional;
- about two months of service use is distinct from the longer contract period;
- department-level shared accounts and individual accounts are both allowed;
- about 50 files and up to about 5,000 pages are planning estimates, not fixed caps;
- no fixed character/token estimate or quota unit is specified;
- in-person training using free Microsoft Copilot is required, and the pilot environment cannot replace it;
- chat log fields are unspecified; usage-limit notification and log-delivery methods admit alternatives;
- the LLM-region requirement is domestic, while the Q&A does not justify broader geography claims;
- inputs/outputs are not used for model training; chat history may be stored on a separate server;
- administrators prepare or add RAG files; users are not expected to upload arbitrary files;
- answers must link from the source-file name to the source itself;
- training materials are for city staff, with no maximum use period; roughly 7,200 is e-learning audience scale, not pilot-user count;
- the AI service itself is not a deliverable.

The evaluation sheet has 17 criteria and 150 points: service pilot 90, training 45 and common items 15. The public result does not expose proposer-level individual scores, so none were added.

## Evidence coverage model correction

Previously, a public procurement-effective EFF row plus no unavailable Q&A/matrix role could cause the case-level aggregate to say publicly_reconstructable, even when contract-final evidence had not been assessed. This conflated public procurement-stage requirements with final contractual state.

The generator now:
- requires all six standard evidence roles to be reviewed or evidence-backed not_applicable;
- requires a reviewed contract_final role;
- requires a reviewed public final-requirement record at contracting_rule;
- keeps not_assessed when contract-final assessment itself is missing;
- marks a searched-but-not-found final document or known source limitation as publicly_bounded.

Therefore Sendai is publicly_bounded because its contract-final material was not found in the reviewed package. At the Pass 12 cutoff, Oumi and Koshigaya had not had their contract-final roles assessed. Pass 13 subsequently reviewed Oumi's guide and linked package: Oumi is now publicly_bounded with contract_final=not_found_in_reviewed_sources. Koshigaya remains not_assessed. Neither state should be read as a global claim that final materials do not exist.

## Data changes and QA

- Added 5 Sendai and 2 Yaizu official source records, plus source notes.
- Added 15 Sendai procurement-effective EFF rows, one Sendai and one Yaizu contract-final evidence-boundary row.
- Added Sendai review-coverage rows, contract-final/guide coverage for Yaizu, and a Sendai requirements projection.
- Corrected Sendai announcement FY to 2024; added contract date, actual service-period limits, 17 evaluation criteria and proposal-procurement structure.
- Regenerated evidence coverage from its generator; did not hand-edit the generated CSV or Markdown.
- Regression items EVAL-020–022 cover contract-final vs award, LLM storage/history semantics, and announcement FY.
- Case count stays at 26; no schema columns or quality scores were added.

Pass 13 completed the Oumi joint-procurement search and recorded its bounded contract-final state; see `research/RESEARCH_PASS_13_2026-10-01.md`.
