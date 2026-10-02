# Research pass 16 — 2026-10-02

## Goal

Test the new case-level evidence comparison projection against three previously unassessed cases with materially different procurement and publication structures.

This pass does not add new procurement cases and does not try to raise BENCH-V1 scores. The purpose is to identify whether the existing evidence model can represent the reviewed scope without unsafe inference.

Selected cases:
- Kyoto 2026 general-purpose GenAI: single-city procurement with the specification bundled into one procurement PDF.
- Kobe 2026 specification-authoring AI: specialized AI procurement with public specification/evaluation/result, participant-only Q&A, and a draft contract.
- Gunma 2026 joint GenAI: common vendor selection followed by entity-specific re-estimation and separate contracts.

## Findings

### Kyoto 2026 general-purpose GenAI

The existing role model is sufficient.

Reviewed:
- specification: reviewed from the bundled procurement document;
- requirement matrix: not applicable because requirements are embedded in the specification rather than a separate matrix;
- evaluation: reviewed from the bundled procurement document;
- result: reviewed from the official result page.

Boundaries:
- the procurement guide says questions/answers are published on the city website, but no Q&A body was found in the reviewed official publication scope; this is recorded as `not_found_in_reviewed_sources`, not as evidence that no questions existed;
- the official result establishes the first negotiation candidate, not a signed contract;
- contract content is to be settled through consultation with the preferred proposer, and no signed final contract / final requirement document was found in the reviewed official scope.

Therefore the case is `publicly_bounded`, not because the procurement is deficient, but because the public evidence chain stops before contract-final requirements.

### Kobe 2026 specification-authoring AI

The existing role model is also sufficient.

Reviewed:
- public procurement page / result;
- procurement guide;
- specification;
- evaluation sheet;
- draft contract.

The specification contains its own function-requirement table, so a separate requirement matrix is `not_applicable`.

Important boundary:
- participant questions are answered by e-mail to all registered participants and have supplementary effect on the procurement documents;
- the public procurement page confirms the contract candidate, score and published contract amount;
- however, a published amount alone does not prove the signed final contract text, contract date, final negotiated specification, or actual operation.

Accordingly:
- selection is recorded in `case_stage.csv`;
- contract and operation remain `not_verified`;
- Q&A is `not_public`;
- contract-final evidence is `not_found_in_reviewed_sources`.

This prevents the legacy `cases.csv status=awarded` or a published amount from being automatically promoted into a verified contract/operation stage.

### Gunma 2026 joint GenAI

This case exposed the most important model boundary.

The public guide establishes:
- common proposal selection by the joint body;
- entity-specific ceilings;
- re-estimation after selection;
- separate contracting by each participating entity;
- the existence of specification, evaluation, RAG-evaluation and requirement-matrix attachments.

In the current official retrieval path, those attachment bodies were not successfully re-obtained, so they are registered as `source_unavailable` rather than reconstructed from prior summaries.

The guide also defines a public Q&A process and states that answers can amend/supplement the guide/specification, but the relevant Q&A body was not found in the reviewed official scope.

The key schema lesson is that a joint procurement can have one common selection state while contract and operation states diverge by participating entity. A single case-level contract state must therefore not be filled from one entity or inferred from the common selection process.

No entity-level stage table is added yet. The current rule is narrower:
- keep case-level contract/operation unverified unless a common state is supported by primary evidence;
- add an entity-level stage model only when actual primary-source evidence is available and shows meaningful per-entity state differences.

This avoids speculative schema expansion.

## Result

After this pass:
- cases remain 26;
- source-document registry: 62 rows;
- review coverage: 72 rows;
- cases with at least one standard hardening role assessed: 12 / 26;
- case-level public reconstructability: 10 publicly_bounded / 16 not_assessed / 0 publicly_reconstructable;
- case-stage rows: 2.

The projection represented both single-entity cases without a new schema. The only generalized rule added is the joint-procurement boundary against collapsing entity-specific contract/operation states into one case-level state.

## What was not done

- no new case collection;
- no BENCH-V1 Gold, rubric or frozen score changes;
- no inference from vendor announcements or other secondary sources;
- no conversion of a selected candidate into a verified contract;
- no conversion of planned service dates into verified operation;
- no entity-level stage schema without supporting primary-source records.

## Next

Further hardening should be evidence-pattern driven rather than coverage-percentage driven.

A new unassessed case is worth auditing when it is likely to introduce a new pattern such as:
- multiple contracts selected in one procedure;
- framework/basic agreement plus call-off/use agreements;
- entity-specific operation dates;
- published signed contract with changed requirements;
- explicit cancellation/re-procurement;
- post-award amendment or renewal.

If future audits only reproduce patterns already represented here, increasing the reviewed-case count alone has diminishing value.
