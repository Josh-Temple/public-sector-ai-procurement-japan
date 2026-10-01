# Research pass 7 — 2026-10-01

## Goal

外部レビュー後に導入した amendment-aware model が、おうみだけの特殊設計ではなく、別の通常自治体案件にも適用できるか確認する。

対象:
- 大府市 2026生成AIサービス導入
- 焼津市 2025生成AIサービス提供

新規案件は追加しない。

## Result

最小モデルは、少なくともこの2案件にも適用できた。

ただし、Q&Aの役割は案件ごとに異なる。

- おうみ: 明示的な緩和・変更が多い
- 大府: 元要件の対象範囲・許容実装・数値条件を具体化する回答が多い
- 焼津: 必須/任意や実現可能性の境界を修正・明確化する回答が多い

したがって effective requirement は「amendment（変更）」だけでなく「clarification（解釈の確定）」を保持する必要がある。

## Obu findings

Official sources:
- procurement page
- specification
- Q&A
- requirement/evaluation workbook existence on official page

Important effective interpretations:
- domestic storage does not require the generative-AI API endpoint itself to be domestic
- city data must not be stored overseas
- ISMAP/ISO-type checks cover both provider/operator and cloud platform
- certification acquisition in progress is accepted
- logical tenant separation is accepted
- latest model delivery is generally within six months of official release
- monthly estimate assumes 70M tokens across all staff
- department-level RAG uses at least five years of manuals/plans
- chunking itself is required; an alternative technique cannot substitute for requirement No.30
- tuning includes generation controls plus chunk/search/retrieval tuning
- council-support requirement means dedicated filtering/search and member-specific historical-context functions; generic RAG answer drafting alone is insufficient
- threshold alerts may use a correlated cloud-cost threshold instead of token count

### Fiscal-year correction

Announcement: 2026-01-28.
Japanese fiscal year: FY2025.

Operation period in the official specification begins 2026-07-01 and ends 2027-03-31.

The stable ID remains `obu-2026-genai-service`, but `cases.fiscal_year` was corrected to 2025 and the separate timeline records service FY2026.

This is the second case after Oumi where the year in the stable ID must not be used as procurement fiscal-year evidence.

## Yaizu findings

The official specification delegates required/desirable detailed functionality to the Excel requirement matrix.

The official Q&A nevertheless quotes enough requirement numbers and wording to resolve several effective interpretations:

- fixed monthly price is acceptable until planned token volume is reached
- paid monthly token top-up must be supported
- GPT-3.5 was envisaged for initial use but is explicitly not mandatory
- requirement No.12 applies to the city-wide ~900 accounts, not per account
- keyword search across conversation history is acceptable
- staff-adjustable Temperature-like parameters satisfy the generation-control requirement
- RAG should prioritize registered data and suppress general model knowledge as much as possible
- 100% exclusion of general model knowledge is not required
- “generative AI” in requirement No.46/47 means LLM in that local context

The evaluation sheet is important: requirement functions are worth 25/100 points, and failure to meet a mandatory item causes disqualification. Therefore a Q&A answer changing “mandatory” to “not mandatory” is not merely descriptive metadata; it can change vendor eligibility.

## Source availability boundary

For both cases, the official Excel workbook exists but could not be retrieved through the current runtime.

This pass does **not** mark the full workbook as reviewed.

Instead:
- source registry: `source_unavailable`
- Q&A-derived item-level facts: reviewed where the official Q&A quotes enough of the source item
- requirements not discussed in Q&A: remain outside this pass

This preserves the difference between “we know this item because the official Q&A resolves it” and “we reviewed the whole matrix”.

## Model change

`effective_requirements.csv` now supports not only relaxation/removal but also:
- clarified scope
- allowed interpretation
- allowed alternative
- threshold definition
- strict clarification
- feasibility clarification
- terminology definition

This prevents the model from forcing every Q&A answer into a false before/after replacement.

## Structured changes

After this pass:
- cases: 26
- cross-case requirement profiles: 17
- source documents: 20
- effective requirements: 32
- review coverage records: 18
- case timeline records: 6
- reasoning regression questions: 11

## Evaluation additions

New regression questions test:
- Obu domestic storage vs API endpoint location
- Obu mandatory chunking vs alternative technique
- Yaizu GPT-3.5 mandatory status
- Yaizu RAG general-knowledge suppression vs absolute prohibition

## Bounded conclusion

The amendment-aware model has generalized beyond the original Oumi example to two ordinary municipal procurements without requiring case-specific schema columns.

That is evidence in favor of continuing the model, but not yet enough to call it stable.

Next representative audits should include:
1. a large-city case with an unavailable Excel matrix and rich evaluation material (Kitakyushu is a candidate);
2. a specialized-AI case (Kobe voicebot or another non-chat service).

The next question is whether the same Source -> Effective Requirement -> Projection pattern still works when the procurement vocabulary is materially different.
