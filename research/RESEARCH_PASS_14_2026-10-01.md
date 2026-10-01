# Research pass 14 — 2026-10-01

## Goal

Test a distinct contract-final pattern: a price-based restricted general competitive bid with no proposal-scoring stage, an official bidder/result publication, and procurement specifications supplied in a ZIP archive.

No case was added.

## Fresh official-source review

Reviewed the official Hokkaido procurement page, bid notice, and result PDF:

- Procurement page: `SRC-hokkaido-2026-page`
- Bid notice: `SRC-hokkaido-2026-notice`
- Bid result: `SRC-hokkaido-2026-result`

The notice calls this a restricted general competitive bid, makes ISO/IEC 27001 a qualification condition, specifies minimum-price award, requires a written or electronic contract, and lists the information-policy office as the place where contract terms are shown. The linked public result PDF identifies three bidders and Hitachi as the winning bidder at a tax-excluded bid of 9,587,430 JPY. It contains the award result, not the negotiated or executed service requirements.

The procurement page lists a 1.66 MB ZIP of related documents. A web retrieval attempt returned an unsupported ZIP content type, so the archive's contents remain unavailable through this route. The repository already tracks the detailed operating manual as `source_unavailable`; it was not guessed or reconstructed from other years.

## Contract-final assessment

The reviewed public page, notice, and bidder/result PDF did not expose a signed contract, post-award final specification, or change document. The notice's location for viewing contract terms establishes where terms are shown in the procurement process; it does not establish that a signed final copy is publicly accessible. Therefore `contract_final=not_found_in_reviewed_sources`, scoped to those reviewed public sources. This does not mean no such document exists in another public archive or through another access path.

The case remains `publicly_bounded` due to the unavailable detailed specification and the unverified final state. Proposal evaluation remains `not_applicable` because the primary notice establishes a price-based general bid. That state does not transfer to contract-final evidence.

## Timeline check

The notice separates contract period, preparation period, and service-provision period. It specifies service provision from 2026-06-01 to 2027-03-31, both in FY2026; the timeline retains those dates as the period specified in the notice, not as independently verified operational start evidence. The case registry does not infer a contract-signing date from the service dates.

## Data changes

- Changed the contract-final review state from `not_assessed` to scoped `not_found_in_reviewed_sources`.
- Added an evidence-boundary row at `contracting_rule`; no requirement value was inferred.
- Added evaluation item EVAL-024 for the distinction between result data, proposal-evaluation applicability, and final contractual requirements.
- The case count and schema remain unchanged.
- Evidence coverage was regenerated from its script after input updates.

## Limits and next step

This pass adds a price-based procurement pattern to the evidence audit. Further general-bid cases are not useful merely to increase volume. The next valuable work is to obtain the linked Hokkaido ZIP through a supported official route, or to locate an independently published signed contract/final specification for a case in the existing 26. Until then no case qualifies as publicly reconstructable through contract final.
