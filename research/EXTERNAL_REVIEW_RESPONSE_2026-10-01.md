# External review response — 2026-10-01

## Why this pass exists

外部レビューで、件数拡大より先に次を修正すべきと指摘された。

- 仕様書と後続質問回答の変更関係
- 公募年度とサービス年度の混同
- 調達体制とlifecycle stageの混同
- 代表案件の原資料再監査
- 確認範囲と未確認理由
- AIが誤読しやすい問いの評価

このpassでは新規案件を追加しない。

## Confirmed corrections

### Oumi

公式質問回答を再確認し、次を修正:
- LLM列挙要件 → GPT/Gemini/Claudeを含む3種類以上
- Deep Research必須実装 → 利用可能または実装予定
- template 200+ → 50+
- autonomous agent required → optional
- certification acquired → acquired or in progress
- internet requirement → LGWAN-only acceptable
- ISMAP requirement → acquired/planned information disclosure
- payment choices → monthly-only acceptable
- Kusatsu / Koka service start → July 2026 planned
- proposal-related evaluation points memo: 330 → 350

### Fiscal-year semantics

Oumi announcement: 2026-03-02 = FY2025.
Service: 2026-04-01 to 2027-03-31 = FY2026.

Stable case_id remains `oumi-2026-joint-genai`, but IDs are no longer treated as authoritative fiscal-year fields.

### Fukushima

2026 procurement remains an official pilot/verification effort.
It is broader than 2025 and prepares requirements/governance for the next full-introduction stage, but is not itself relabeled as production.

## New model

- `data/source_documents.csv`: document identity and version/access state
- `data/effective_requirements.csv`: original -> changed -> effective requirement
- `data/case_timeline.csv`: announcement fiscal year vs service fiscal year
- `data/review_coverage.csv`: reviewed / not reviewed and unknown reason
- `evals/REQUIREMENT_REASONING_V1.md`: regression questions for amendment/scope reasoning

## Transitional rule

`data/requirements.csv` remains useful for cross-case browsing but becomes a projection, not the final authority where amendments exist.

For amendment-sensitive questions:
1. source documents
2. effective requirements
3. comparison projection

in that order.

## Next audit target

Before broad corpus expansion, repeat the same audit pattern on representative cases with:
- rich Q&A
- year-over-year procurement
- joint procurement
- a small municipality
- specialized AI

The purpose is to learn whether this model generalizes without adding one-off columns.
