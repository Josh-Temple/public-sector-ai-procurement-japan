# Research pass 4 — 2026-10-01

## Goal

Expand the corpus beyond ordinary single-municipality public proposals and test whether the same knowledge base can represent:
- large prefecture-wide AI services
- joint procurement with separate contracts
- pilot-to-production lifecycle changes
- general competitive bidding

## Added cases

### Kagoshima Prefecture 2026

Official specification confirms:
- 8,000 users
- 300+ concurrent users
- LGWAN
- GPT-5 and Gemini 2.5 Pro or later in domestic regions
- GPT-4.1 mini and Gemini 2.5 Flash or later
- model switching
- continuous model updates
- RAG 100GB+
- PDF/docx/xlsx/csv/txt
- organizational RAG domains / access control
- input data not used for model training
- data processing completed in domestic data centers
- personal/confidential-information and forbidden-word input controls
- usage logs and export
- workload-reduction dashboard
- ISO/IEC 27001 / 27017 requirements

Proposal ceiling: 8,833,000 JPY including tax.

The public proposal guide says the result is communicated to participants, but no official public winner was located in this pass. The case is therefore stored with `result_unverified` and no vendor.

### Gunma Prefecture Information Promotion Council 2026

This procurement uses a joint-selection / separate-contract structure:
- the council selects a common service provider through public proposal
- participating entities have separate price ceilings
- price estimates are prepared by entity
- initial, basic/maintenance, LGWAN and training options depend on each entity
- after selection, each entity receives a fresh estimate and signs its own contract
- a dedicated RAG evaluation sheet is part of the proposal evaluation

This requires a procurement-structure model distinct from the service-feature model.

Secondary sources and a vendor announcement indicate Exa Enterprise AI involvement, but no official public selection-result page was located. To preserve primary-source discipline, the repository does not populate `selected_vendor`.

### Hokkaido 2025 -> 2026

2025:
- RAG pilot
- public proposal
- NTT East selected
- 21.78M JPY contract
- around 12,000 accounts
- >=30 RAG domains / >=100GB
- no LGWAN
- effect analysis and training included

2026:
- RAG service
- restricted general competitive bidding
- lowest valid bid wins
- Hitachi selected
- 3 bidders
- raw tax-exclusive bids stored separately

The exact 2026 detailed feature specification remains ACCESS_UNAVAILABLE because the official ZIP body could not be retrieved in the current runtime.

## New tables

### data/procurement_structure.csv

Separates procurement architecture from product requirements:
- buyer scope
- selection method
- award basis
- contracting model
- pricing basis
- lifecycle stage

### data/bid_results.csv

Stores competitive bid results without mixing them into proposal-evaluation scores.

## Analytical value

The dataset can now distinguish at least three different procurement patterns:

1. Single-entity public proposal
2. Joint vendor selection followed by separate local-government contracts
3. Restricted general competitive bidding based on lowest valid price

These are not interchangeable. The same AI capability can be procured under materially different governance, price, and selection structures.

## Access / verification boundaries

- Kagoshima official public winner: NOT_FOUND in this pass.
- Gunma official public winner/result: NOT_FOUND in this pass.
- Hokkaido 2026 detailed processing specification: ACCESS_UNAVAILABLE because the official ZIP body could not be retrieved.
- No missing result or inaccessible attachment was filled from secondary sources.
