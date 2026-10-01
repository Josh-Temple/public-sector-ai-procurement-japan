# Research pass 13 — 2026-10-01

## Goal

Audit Oumi 2026 as a joint-procurement pattern where public Q&A modifies requirements, a preferred provider is announced, and the governing guide says the final service specification and city-level use agreements follow negotiation.

No case was added.

## Official source review

Reviewed the current Oumi case page, linked procurement materials, and the full proposal guide and public Q&A:

- Project/result page: `SRC-oumi-2026-result`
- Original specification: `SRC-oumi-2026-spec`
- Public Q&A: `SRC-oumi-2026-qa`
- Evaluation sheet: `SRC-oumi-2026-evaluation`
- Proposal guide: `SRC-oumi-2026-guide`

The official project page, updated 2026-03-23, lists six participating municipalities and identifies NTT Docomo Business as selected. It reports a service contract period from 2026-04-01 through 2027-03-31. The result establishes the selection and published period; it does not itself disclose negotiated final requirements.

The guide is decisive on the document sequence. It says the selected proposal is followed by negotiation and preparation of a service specification, a quotation based on that specification, and discretionary service contracts by each municipality. It also describes a council-level basic agreement and individual city use agreements, with annual terms/pricing agreed for each city. The guide explicitly distinguishes the contract period from the actual service-use period.

The public Q&A says service use was planned from April 2026 generally, with Kusatsu and Koka expected to begin in July. Those are heterogeneous planned start months, not evidence of actual start dates. No common service end date is established. The timeline now leaves exact service dates and end fiscal year blank; it retains FY2026 as the planned start fiscal year and records the schedule limits in notes. The case registry's 2026-04-01 to 2027-03-31 dates remain the documented contract period.

## Contract-final evidence state

The official case page lists the reviewed public procurement package but does not link a signed council basic agreement, individual city service-use agreements, or a post-negotiation final specification. We checked official-site discovery results for the current member municipalities as an additional discovery route; those searches did not locate a relevant final agreement. This search was not exhaustive across every municipal archive.

Accordingly, `contract_final` is `not_found_in_reviewed_sources`, scoped to the official case page and its linked procurement package. It does not assert that the documents are unpublished everywhere. The case is `publicly_bounded`: procurement-effective requirements are traceable from the specification and Q&A, but final requirements after negotiation and city-level agreements are not reconstructed. No `contract_final=reviewed` or final requirement was inferred from the award, selected vendor, or contract period.

## Joint procurement pattern and schema learning

This case adds an evidence pattern: a shared selection is followed by a negotiated common service specification and separate city-level use agreements, with possible annual agreement on terms. A single award record cannot stand in for the final requirements of all participating cities.

The current schema can represent this without new columns:
- procurement-stage requirements remain in `effective_requirements.csv`;
- the contract-final evidence boundary is represented by a reviewed `contracting_rule` row and the scoped review state;
- announcement and planned service-use timing are separate from the contract dates in `cases.csv`.

This is one audited instance of city-specific service schedules and agreements. A per-municipality service timeline or contract table could become useful if the same decision-relevant pattern recurs across multiple cases, but one case is not enough to justify a schema extension.

## Data changes

- Registered the official proposal guide and its document sequence.
- Added scoped `procurement_guide=reviewed` and `contract_final=not_found_in_reviewed_sources` rows.
- Added an evidence-boundary EFF record at `contracting_rule`; it is not a contractual requirement.
- Corrected the timeline so contract dates are not copied into service-use dates. Q&A's planned April/July starts are retained as fiscal-year and note-level evidence.
- Added regression coverage for award vs contract-final and contract-period vs service-use period.
- No new case and no schema columns were added.

## Search and limits

The official result page and its linked public package were the primary audit scope. Member-site searches were only a secondary discovery route. The lack of a found final document in those reviewed places is not evidence of nonexistence elsewhere.
