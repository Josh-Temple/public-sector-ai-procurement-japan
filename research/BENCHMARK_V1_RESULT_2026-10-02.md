# BENCHMARK V1 result — 2026-10-02

## Purpose

`evals/benchmark/` で事前固定した20問について、同一モデル設定の Web-only と Repository-first を独立セッションで1回ずつ実行し、独立JudgeでGoldを再確認したうえで回答品質と探索負担を比較した。

この結果は、Repositoryの優位を前提にしたものではない。全国の自治体調達や他モデルへ一般化するものでもない。

## Frozen conditions

- Benchmark design / Gold commit: `ca1e4423290834399ce20db2a574278706b8f155`
- Repository-first knowledge ref: `35d66cf710215f251da9809034249de868f6d24e`
- Questions: 20
- Maximum score: 200
- Model: GPT-5.6 Sol / High reasoning
- Gold independent review: `GOLD_REVIEW_PASS`
- Gold/rubric changes after runner answers: none

## Blind quality result

| Metric | Repository-first | Web-only | Difference |
|---|---:|---:|---:|
| Total | 189/200 | 190/200 | -1 |
| Category A | 40/40 | 40/40 | 0 |
| Category B | 12/20 | 12/20 | 0 |
| Category C | 30/30 | 30/30 | 0 |
| Category D | 39/40 | 38/40 | +1 |
| Category E | 20/20 | 20/20 | 0 |
| Category F | 20/20 | 20/20 | 0 |
| Category G | 10/10 | 10/10 | 0 |
| Category H | 18/20 | 20/20 | -2 |
| Simple facts 001-004 | 40/40 | 40/40 | 0 |
| Remaining 16 | 149/160 | 150/160 | -1 |

Error counts at score freeze:

| Metric | Repository-first | Web-only |
|---|---:|---:|
| factual error | 0 | 0 |
| unsupported assertion | 5 | 1 |
| scope-loss | 0 | 0 |
| amendment-miss | 0 | 0 |
| evidence-boundary error | 0 | 0 |
| primary-source citation rate | 36/40 (90%) | 38/40 (95%) |
| citation rate among answered fact units | 36/38 (94.7%) | 38/38 (100%) |

The run did **not** demonstrate an accuracy advantage for Repository-first. Q&A amendment handling and evidence-boundary handling were perfect in both conditions.

## Evidence sensitivity

The anonymization step removed Repository-internal evidence paths from the Repository-first packet before blind judging. Scores remain frozen; the effect was analyzed separately.

- BENCH-V1-006 / Koshigaya RAG: the original Repository path could be followed to the official specification locator. One evidence unit is recoverable.
- BENCH-V1-006 / Oumi RAG and 100GB: the original answer cited paths that did not directly expose the official specification locator. The evidence unit was not fully recoverable under the strict path rule.
- BENCH-V1-019 / Kobe contract boundary: the factual limitation is supported by the official guide, but the original cited Claim/Source path did not directly expose that guide locator.

Sensitivity-only metrics for Repository-first:
- primary-source citation rate: 37/40 (92.5%)
- citation rate among answered fact units: 37/38 (97.4%)
- unsupported assertion count: 4

These values do not replace the frozen 189/200 score.

## Search / retrieval burden

| Metric | Repository-first | Web-only |
|---|---:|---:|
| Web search queries | 7 | 66 |
| Fresh official documents opened | 4 | 21 |
| Repository files actually referenced | 36 | 0 |
| Repository internal search | 0 | n/a |
| Recorded source-reuse events | 6 | not consistently counted |

Observed reductions:
- Web search queries: 89.4% fewer
- Fresh official-document opens: 81.0% fewer

Repository files and official Web documents are different resource types and are not added into a synthetic total.

The result supports a narrower claim: previously structured evidence can substitute for a large part of repeated Web discovery while preserving roughly the same answer quality in this run.

## Time

Repository-first:
- total measured wall time: 400 s
- initial setup: 74 s
- post-setup: 326 s

Web-only:
- wall time: not measured

Therefore a condition-level speed advantage is **not established**. UI “thinking time” is not used as wall-clock evidence.

## Shared access failure

BENCH-V1-018 required a Hokkaido ZIP-contained processing manual. Both runners failed to retrieve the ZIP body and correctly declined to invent the RAG count/capacity/model conditions. The independent Gold reviewer later retrieved and verified the manual.

This demonstrates that Repository-first does not eliminate a missing-source boundary when the needed body has not been captured in the Repository.

## Interpretation

What this single run supports:
1. Repository-first produced almost the same answer quality as a strong Web-only run.
2. It required far fewer Web searches and fresh official-document opens.
3. Effective-requirement and evidence-boundary modeling successfully prevented amendment and contract-final errors.
4. Reusable knowledge does not help enough if the structured fact cannot be followed directly to the supporting primary-source locator.

What this run does not support:
- higher answer accuracy for Repository-first;
- a measured wall-clock speed advantage;
- generalization to other models, question sets, or Japanese local governments;
- a claim that all needed evidence is already stored in the Repository.

## Repository defects exposed by the benchmark

### Oumi RAG

The Repository knew the correct cross-case fact, but `data/requirements.csv` used a combined projection whose single `source_url` pointed to the Q&A. The RAG requirement itself is in the original specification. This weakened direct evidence traceability.

Repair:
- add `sources/SRC-oumi-2026-spec.md` with the RAG locator;
- add a scoped reusable claim for RAG requiredness/capacity;
- keep amendment-aware Q&A handling separate.

### Kobe voicebot contract boundary

The answer-generation Claim included a scope limit about non-public Q&A and proposal-derived contract terms, but its evidence list pointed only to the specification. The official procurement guide supports the scope limit.

Repair:
- add exact guide locators to `SRC-kobe-2026-voicebot-guide.md`;
- add the guide as evidence for the Claim's scope limit.

## Design lesson

A stored fact is not sufficiently reusable merely because it is correct. For decision-relevant claims, the preferred chain is:

`structured fact / claim -> source ID -> official URL -> precise locator -> amendment / scope rule where applicable`

Scope limits and uncertainty statements need evidence just as positive factual claims do.

## Next experiment

Before a V2 comparison:
1. repair evidence-chain gaps exposed here;
2. keep BENCH-V1 Gold and frozen results unchanged;
3. measure wall-clock time in both conditions;
4. use the same counting rules for source reuse and failed retrieval;
5. run at least three repetitions if the goal is reproducibility rather than a single descriptive observation.
