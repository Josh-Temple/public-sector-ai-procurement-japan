# Research pass 9 — 2026-10-01

## Later correction — case-level contract-final semantics (passes 11–13)

Pass 9's initial case-level publicly_reconstructable label described public procurement-stage specification/Q&A coverage. That label did not establish contract-final reconstruction. The case-level aggregate has since been tightened: all standard roles must be reviewed or evidence-backed not_applicable, contract_final must be reviewed, and a reviewed public final requirement must be recorded at contracting_rule.

At the Pass 12 correction point, Oumi's contract_final role had not yet been assessed, and both Oumi and Koshigaya were not_assessed for case-level contract-final reconstruction. Pass 13 subsequently reviewed Oumi's proposal guide and official linked package. Oumi is now publicly_bounded with contract_final=not_found_in_reviewed_sources because the guide places final specification and city-level use contracts after negotiation and those documents were not found in the reviewed package. Koshigaya remains not_assessed. Neither state is a global claim that a final document does or does not exist. Older counts below are historical for the Pass 9 projection and must not be read as contract-final coverage.


## Goal

Make evidence coverage visible across all 26 registered cases without creating a misleading overall quality/maturity score.

## New projection

Added:

- `data/evidence_coverage.csv`
- `docs/EVIDENCE_COVERAGE.md`
- `scripts/build_evidence_coverage.py`

The projection is generated from:
- `data/cases.csv`
- `data/review_coverage.csv`
- `data/effective_requirements.csv`

It must not be hand-edited.

## Standard evidence roles

Each case is shown across six roles:

1. specification
2. qa_amendment
3. requirement_matrix
4. evaluation
5. result
6. contract_final

## Status semantics

- reviewed: explicitly re-audited under the current hardening model
- not_reviewed: explicitly known but not yet reviewed
- source_unavailable: public source exists but its body cannot currently be retrieved
- not_public: the source/use is officially known but the body is not generally public
- conflicting_sources: unresolved evidence conflict
- not_found_in_reviewed_sources: reviewed search scope did not find the target material
- not_assessed: no current-hardening assessment has been made for that role

The last state is intentionally different from “not found” or “does not exist”.

## Public reconstructability

The case-level projection uses:

- publicly_reconstructable
- publicly_bounded
- not_assessed

This is not a quality score.

A case becomes publicly_bounded when an assessed core role is blocked by:
- source_unavailable
- not_public
- conflicting_sources

A case is not marked publicly_reconstructable merely because a specification or result is public.

## Current coverage

Repository cases: 26.

Cases with at least one hardening role assessed: 6:
- Oumi joint procurement
- Fukushima 2026
- Obu
- Yaizu
- Kitakyushu
- Kobe tax voicebot

Current case-level projection:
- publicly_reconstructable: Oumi
- publicly_bounded: Obu, Yaizu, Kitakyushu, Kobe voicebot
- not_assessed: 21 cases

Fukushima 2026 has several reviewed roles but no case-level reconstructability conclusion yet.

The counts intentionally do not sum as a ranking or maturity scale.

## Why this matters

Before this projection, “deeply researched”, “source unavailable”, “Q&A private”, and “not yet audited” could all look like missing data.

They now have different meanings.

This helps both humans and AI distinguish:
- evidence absence
- access limitations
- review backlog
- genuine public reconstruction boundaries

## Reproducibility

`scripts/build_evidence_coverage.py` uses only repository-local CSV files and Python standard library.

No network calls are needed.

Future edits to `review_coverage.csv` should be followed by regeneration rather than direct edits to the projection.

## QA

- 26 cases -> 26 projection rows
- duplicate case rows: 0
- missing cases: 0
- extra cases: 0
- invalid role states: 0
- current review coverage rows: 31
- effective requirement rows: 40
- generator reads source tables and writes the projection
- generator contains no network dependency

## Next

Do not immediately turn this into a score.

The next useful test is to use the matrix to select the next audits deliberately.

Priority should favor cases that add a new evidence pattern, for example:
- public Q&A with many explicit amendments
- contract-final documents that are actually public
- general competitive bidding with no proposal/Q&A path
- another specialized-AI procurement

The purpose is to learn which evidence states recur before freezing a completeness schema.
