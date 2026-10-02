# Research pass 15 — 2026-10-02

## Goal

Apply the reusable lessons from BENCH-V1 without optimizing the Repository to the benchmark answers themselves.

No case is added. BENCH-V1 Gold, Public packet, rubric, and frozen scores are not changed.

## Benchmark result

The independent run is recorded in `research/BENCHMARK_V1_RESULT_2026-10-02.md`.

Frozen blind quality:
- Repository-first: 189/200
- Web-only: 190/200

Observed retrieval burden:
- Web search queries: 7 vs 66
- fresh official-document opens: 4 vs 21
- Repository-first measured wall time: 400 s
- Web-only wall time: not measured, so speed is not compared

The result supports reuse-driven reduction of repeated Web discovery, not a claim of higher accuracy.

## Evidence-chain repairs

### Oumi

Added a Source note for the original specification with direct RAG locator and a reusable Claim that distinguishes:
- RAG as a required service function;
- 100GB+ capacity per participating municipality;
- actual use/registration volume, which is not established by the procurement requirement.

This avoids using the Q&A URL as the sole apparent evidence for a requirement originating in the specification.

### Kobe

The existing voicebot guide is strengthened with precise locators for:
- participant-only e-mail Q&A;
- contract specification being decided through consultation;
- document priority at contracting;
- superior proposal portions overriding the lower baseline.

The answer-generation Claim now cites the guide for its contract-final scope limit rather than relying on the specification alone.

## Limited cross-claim audit

Existing claims were checked for their declared evidence Source IDs.

Some claims refer to Source IDs represented in `data/source_documents.csv` without a dedicated `sources/*.md` file. That is not automatically an error under the current model because the structured source registry is also canonical metadata. No mass creation of Source Markdown files was performed.

The benchmark-exposed defects were narrower: a claim or projection could contain a correct statement while its cited path did not expose the source/locator needed to verify that statement. The general rule has therefore been added to the Knowledge Model and AGENTS guidance.

## No benchmark overfitting

Not done:
- no BENCH-specific answer field;
- no score-specific logic;
- no Gold/rubric edits;
- no new case;
- no ranking or maturity score;
- no schema expansion.

The changes are useful for ordinary specification-comparison questions outside the benchmark.
