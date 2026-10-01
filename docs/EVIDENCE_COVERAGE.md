# Evidence coverage — 2026-10-01

This is a **review-coverage projection**, not a quality score.

Legend:
- **R** reviewed
- **N** explicitly not reviewed
- **U** public source exists but is currently unavailable
- **P** source/use is known but the body is not public
- **—** not applicable to this procurement/document structure
- **C** conflicting sources
- **F** searched in reviewed sources but not found
- **·** not assessed under the current hardening model

| case | government | spec | Q&A | req matrix | eval | result | contract-final | reconstructability |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| sendai-2025-genai-pilot | 仙台市 | · | · | · | · | · | · | not_assessed |
| sendai-2026-genai-service | 仙台市 | · | · | · | · | · | · | not_assessed |
| obu-2026-genai-service | 大府市 | R | R | U | U | R | · | publicly_bounded |
| yaizu-2025-genai-service | 焼津市 | R | R | U | R | R | · | publicly_bounded |
| kyoto-2026-general-genai | 京都市 | · | · | · | · | · | · | not_assessed |
| kobe-2026-spec-authoring-ai | 神戸市 | · | · | · | · | · | · | not_assessed |
| saitama-2026-ai-digital-support | 埼玉県 | · | · | · | · | · | · | not_assessed |
| nishiwaki-2025-genai-service | 西脇市 | · | · | · | · | · | · | not_assessed |
| toyooka-2025-genai-service | 豊岡市 | · | · | · | · | · | · | not_assessed |
| harima-2025-genai-service | 播磨町 | · | · | · | · | · | · | not_assessed |
| oumi-2026-joint-genai | おうみ自治体クラウド協議会 | R | R | · | R | R | · | publicly_reconstructable |
| kobe-2025-dify-platform | 神戸市 | · | · | · | · | · | · | not_assessed |
| kobe-2026-tax-voicebot | 神戸市 | R | P | · | R | R | P | publicly_bounded |
| koshigaya-2024-genai-service-training | 越谷市 | R | R | — | R | R | · | publicly_reconstructable |
| kitakyushu-2025-genai-service | 北九州市 | R | P | U | R | R | · | publicly_bounded |
| hamada-2025-municipal-genai | 浜田市 | · | · | · | · | · | · | not_assessed |
| wakayama-2026-genai-support | 和歌山県 | · | · | · | · | · | · | not_assessed |
| yamagata-gifu-2026-genai-service | 山県市 | · | · | · | · | · | · | not_assessed |
| koge-2026-genai-procurement | 上毛町 | · | · | · | · | · | · | not_assessed |
| gosen-2026-genai-service | 五泉市 | · | · | · | · | · | · | not_assessed |
| fukushima-2025-genai-pilot | 福島県 | · | · | · | · | · | · | not_assessed |
| fukushima-2026-genai-pilot-expansion | 福島県 | R | N | · | R | R | · | not_assessed |
| kagoshima-2026-genai-service | 鹿児島県 | · | · | · | · | · | · | not_assessed |
| gunma-2026-joint-genai | 群馬県情報化推進協議会 | · | · | · | · | · | · | not_assessed |
| hokkaido-2025-genai-rag-pilot | 北海道 | · | · | · | · | · | · | not_assessed |
| hokkaido-2026-genai-rag-service | 北海道 | U | · | · | — | R | · | publicly_bounded |

## Current reading

- Cases in repository: 26
- Cases with at least one role assessed under the current hardening model: 8
- `not_applicable` is evidence-backed non-applicability, not missing work.
- Contract-final remains a separate role from procurement-effective requirements.
