# Case evidence summary — 2026-10-06

This is a generated comparison projection for what has actually been reviewed for each case. It is not a procurement, vendor, or government quality score.

`data/case_evidence_summary.csv` joins document-role review coverage with separately verified selection / contract / operation states. It does not infer later stages from `cases.csv` status or planned dates.

Role legend: R reviewed; N explicitly not reviewed; U source unavailable; P source known but not public; — not applicable; C conflicting sources; F not found in reviewed sources; · not assessed.

For source tracing, use the paired `*_source_id` columns in the CSV and resolve them through `data/source_documents.csv`. An empty stage row means that stage has not been assessed in `data/case_stage.csv`; it does not mean the stage did not occur.

| case | government | spec | Q&A | req matrix | eval | result | contract-final | selection | contract | operation | reconstructability | blockers |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|---|---|---|---|---|
| sendai-2025-genai-pilot | 仙台市 | R | R | — | R | R | F | not_assessed | not_assessed | not_assessed | publicly_bounded | contract_final:not_found_in_reviewed_sources |
| sendai-2026-genai-service | 仙台市 | · | · | · | · | · | · | not_assessed | not_assessed | not_assessed | not_assessed |  |
| obu-2026-genai-service | 大府市 | R | R | U | U | R | · | not_assessed | not_assessed | not_assessed | publicly_bounded | requirement_matrix:source_unavailable;evaluation:source_unavailable |
| yaizu-2025-genai-service | 焼津市 | R | R | U | R | R | F | not_assessed | not_assessed | not_assessed | publicly_bounded | requirement_matrix:source_unavailable;contract_final:not_found_in_reviewed_sources |
| kyoto-2026-general-genai | 京都市 | R | F | — | R | R | F | selected_candidate_confirmed | not_verified | not_verified | publicly_bounded | qa_amendment:not_found_in_reviewed_sources;contract_final:not_found_in_reviewed_sources |
| kobe-2026-spec-authoring-ai | 神戸市 | R | P | — | R | R | F | selected_candidate_confirmed | not_verified | not_verified | publicly_bounded | qa_amendment:not_public;contract_final:not_found_in_reviewed_sources |
| saitama-2026-ai-digital-support | 埼玉県 | R | R | — | R | R | F | selected_candidate_confirmed | not_verified | not_verified | publicly_bounded | contract_final:not_found_in_reviewed_sources |
| nishiwaki-2025-genai-service | 西脇市 | · | · | · | · | · | · | not_assessed | not_assessed | not_assessed | not_assessed |  |
| toyooka-2025-genai-service | 豊岡市 | · | · | · | · | · | · | not_assessed | not_assessed | not_assessed | not_assessed |  |
| harima-2025-genai-service | 播磨町 | · | · | · | · | · | · | not_assessed | not_assessed | not_assessed | not_assessed |  |
| oumi-2026-joint-genai | おうみ自治体クラウド協議会 | R | R | · | R | R | F | not_assessed | not_assessed | not_assessed | publicly_bounded | contract_final:not_found_in_reviewed_sources |
| kobe-2025-dify-platform | 神戸市 | · | · | · | · | · | · | not_assessed | not_assessed | not_assessed | not_assessed |  |
| kobe-2026-tax-voicebot | 神戸市 | R | P | · | R | R | P | not_assessed | not_assessed | not_assessed | publicly_bounded | qa_amendment:not_public;contract_final:not_public |
| koshigaya-2024-genai-service-training | 越谷市 | R | R | — | R | R | · | not_assessed | not_assessed | not_assessed | not_assessed |  |
| kitakyushu-2025-genai-service | 北九州市 | R | P | U | R | R | · | not_assessed | not_assessed | not_assessed | publicly_bounded | qa_amendment:not_public;requirement_matrix:source_unavailable |
| hamada-2025-municipal-genai | 浜田市 | · | · | · | · | · | · | not_assessed | not_assessed | not_assessed | not_assessed |  |
| wakayama-2026-genai-support | 和歌山県 | · | · | · | · | · | · | not_assessed | not_assessed | not_assessed | not_assessed |  |
| yamagata-gifu-2026-genai-service | 山県市 | · | · | · | · | · | · | not_assessed | not_assessed | not_assessed | not_assessed |  |
| koge-2026-genai-procurement | 上毛町 | · | · | · | · | · | · | not_assessed | not_assessed | not_assessed | not_assessed |  |
| gosen-2026-genai-service | 五泉市 | · | · | · | · | · | · | not_assessed | not_assessed | not_assessed | not_assessed |  |
| fukushima-2025-genai-pilot | 福島県 | R | R | — | R | R | F | selected_candidate_confirmed | not_verified | not_verified | publicly_bounded | contract_final:not_found_in_reviewed_sources |
| fukushima-2026-genai-pilot-expansion | 福島県 | R | N | · | R | R | · | not_assessed | not_assessed | not_assessed | not_assessed |  |
| kagoshima-2026-genai-service | 鹿児島県 | · | · | · | · | · | · | not_assessed | not_assessed | not_assessed | not_assessed |  |
| gunma-2026-joint-genai | 群馬県情報化推進協議会 | U | F | U | U | F | F | not_assessed | not_assessed | not_assessed | publicly_bounded | specification:source_unavailable;qa_amendment:not_found_in_reviewed_sources;requirement_matrix:source_unavailable;evaluation:source_unavailable;result:not_found_in_reviewed_sources;contract_final:not_found_in_reviewed_sources |
| hokkaido-2025-genai-rag-pilot | 北海道 | R | R | — | R | C | F | selected_candidate_confirmed | contracted_confirmed | not_verified | publicly_bounded | result:conflicting_sources;contract_final:not_found_in_reviewed_sources |
| hokkaido-2026-genai-rag-service | 北海道 | U | · | · | — | R | F | not_assessed | not_assessed | not_assessed | publicly_bounded | specification:source_unavailable;contract_final:not_found_in_reviewed_sources |

## Reading rules

- Use this table to compare evidence coverage, not to rank municipalities or procurement quality.
- `not_assessed` is not evidence of absence.
- A reviewed result or selected candidate is not evidence of a signed contract.
- A signed contract is not evidence that the service is operating.
- `publicly_bounded` identifies a public-evidence boundary; it is not a negative judgment about the procurement.
- When a claim matters for a decision, follow the source ID to the official source and precise locator rather than relying on this projection alone.
