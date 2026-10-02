# Research pass 17 — 2026-10-03

## Goal

Deepen one existing specialized-AI case that already had a strong official evidence chain, so the public case detail becomes substantively comparable rather than merely populated.

Target:
- `kobe-2026-spec-authoring-ai`

No new procurement case is added.

## Why this case

Before this pass, `data/specialized_requirements.csv` contained 21 rows for one specialized case, the Kobe tax voicebot. The specification-authoring AI already had a reviewed public specification, evaluation sheet, result page, participant-only Q&A boundary, and contract-final boundary, but its domain-specific functions were only summarized in the general requirement projection.

That made the public specialized-AI detail structurally uneven.

## Fresh primary-source check

On 2026-10-03, the official Kobe specification and result page were re-read.

The specification confirms, among other items:
- cross-document and intra-document consistency review;
- AI-generated correction proposals using input/RAG data;
- user choice to accept or reject corrections;
- findings output including quoted source, correction proposal and correction confidence;
- RAG-based base-document selection and specification generation;
- natural-language revision and iterative review/revision;
- Word output;
- workflow creation/edit/delete and per-flow edit permission;
- at least 1,000 accounts and at least 100 concurrent users;
- Word/Excel/PDF RAG and at least 1TB capacity;
- LGWAN connectivity as desirable rather than mandatory;
- Azure OpenAI Service when the city AI ordinance Article 7 applies, with other LLM selection desirable;
- a low non-functional availability grade appropriate to a limited-scope internal service.

The official result page confirms two applicants and published scores of 73/100 and 65/100, with Fujitsu Japan as the contract candidate. It also publishes a 9,999,000 yen contract amount, but does not by itself establish a signed final contract text, actual signing date, final negotiated requirements, or actual operation.

## Structured changes

- add 30 rows to `data/specialized_requirements.csv`;
- add 2 rows to `data/vendor_scores.csv`;
- add 1 bounded timeline row to `data/case_timeline.csv`;
- add a reusable Source note for the specification;
- add a reviewed Claim for the human-in-the-loop correction-selection pattern.

All specialized-requirement rows remain `publicly_bounded` because participant-only Q&A can supplement the public specification.

## Result

After this pass:
- cases remain 26;
- specialized AI requirement rows: 51;
- specialized AI cases with structured domain requirements: 2;
- published vendor-score rows: 26;
- case timeline rows: 12.

No selection → contract or planned date → operation inference is introduced.
