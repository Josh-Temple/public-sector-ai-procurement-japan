# Research pass 18 — 2026-10-03

## Goal

Deepen the existing Saitama Prefecture citizen/staff AI support case and close its public Evidence chain through the published procurement Q&A, evaluation and selection result.

Target:
- `saitama-2026-ai-digital-support`

No new procurement case is added.

## Fresh official-source recheck

On 2026-10-03 the official procurement page, specification, public Q&A, evaluation list, selection result and draft contract were re-read.

The specification requires both citizen-facing and staff-facing chatbots. It includes AI agent/RAG use, source display, an unknown-answer fallback when no grounding exists, broad Web search, specified Web sources, Box integration, multiple LLMs, non-training of input/output data, no persistent LLM-server storage after processing, domestic data storage and a 99.5% uptime target.

The public Q&A materially clarifies the procurement-effective state, including the three initial domains, citizen-facing grounding display, managed Web sources, Box automatic synchronization, mandatory staff authentication, temporary inference-time storage, and the distinction between current per-use-case entry URLs and a future single-chatbot architecture.

## Evaluation signal

The public evaluation list allocates 40 / 410 points to how referenced knowledge is shown to users and 50 / 410 points to control when no answer basis exists / hallucination prevention. This is a procurement-evaluation fact, not evidence of deployed accuracy.

## Evidence boundary

The procurement Q&A is public, so the reviewed procurement-effective requirements can be reconstructed from public sources.

However, the specification states that after selecting the candidate the Prefecture creates the final procurement specification based on the candidate proposal, and the procurement specification plus proposal become the contract specification. The proposal is not part of the reviewed public evidence. The published contract is a draft with unset fields.

Therefore procurement-effective requirement rows can be `publicly_reconstructable`, while case-level contract-final state remains `not_found_in_reviewed_sources` and case-level public reconstructability is `publicly_bounded`. Selection is confirmed, but contract and operation remain unverified.

## Structured changes

- +38 specialized-AI requirement rows;
- +12 effective-requirement rows;
- +6 Source registry rows;
- +6 standard review-coverage rows;
- +1 case-stage row;
- +1 announcement-only timeline row;
- update the general requirement projection to `verified_from_official_pdf_and_qa`;
- regenerate both Evidence projections;
- add locator-level Source notes for specification and Q&A;
- add a reviewed citizen-grounding Claim;
- extend the cross-case contract-final boundary Claim;
- expose the reviewed finding on the public home page and the five-design-points page.

## Result

After this pass:
- cases remain 26;
- specialized AI requirements: 89 rows across 3 specialized cases;
- source documents: 68;
- effective requirements: 81;
- review coverage: 78;
- timeline rows: 13;
- cases with at least one standard hardening role assessed: 13 / 26;
- case-level public reconstructability: 11 publicly_bounded / 15 not_assessed / 0 publicly_reconstructable.

No selected → contracted or planned → operating inference is introduced.
