# Research pass 3 — 2026-09-30

## Goal

Priority Aの要求機能一覧を深掘りする。Excel本体が現在の実行環境から直接取得できない場合でも、同一案件の公式実施要領・質疑回答・選定結果から、項番付きで確認できる要件を回収する。

## Access result

### 大府市
Official Excel URLs:
- 業務要件一覧（1次審査表）: https://www.city.obu.aichi.jp/_res/projects/default_project/_page_/001/038/173/04_ai_shiryou2.xlsx
- 2次審査表: https://www.city.obu.aichi.jp/_res/projects/default_project/_page_/001/038/173/05_yoshiki11.xlsx

Status in this runtime: `ACCESS_UNAVAILABLE` for binary workbook body.

The official HTML page, implementation guideline PDF and Q&A PDF are readable, so item-numbered requirement interpretations from those documents were extracted without treating the entire Excel workbook as verified.

### 焼津市
Official Excel URL:
- 要求機能一覧: https://www.city.yaizu.lg.jp/documents/19797/06_youkyuukinouhyo.xlsx

Status in this runtime: `ACCESS_UNAVAILABLE` for binary workbook body.

The official Q&A identifies and explains requirement No.7, 10, 11, 12, 23, 25, 36, 46 and 47. Only items whose meaning is sufficiently clear from the Q&A were added to the granular facts table.

### 北九州市
The official procurement page confirms that the Excel「機能要件一覧」exists, but the binary workbook body remains unavailable in the current retrieval path.

The PDF specification and evaluation method remain the verified basis for the current wide profile and evaluation table.

## New structured data

### data/requirement_facts.csv

22 granular requirement facts were added for Obu and Yaizu.

Obu highlights:
- 70,000,000 tokens/month across all staff
- domestic storage of city data even when API endpoint may be overseas
- ISMAP/ISO-type checks covering both provider and cloud platform
- logical tenant isolation accepted
- latest model generally within six months of official release
- department-level RAG using at least five years of manuals/plans
- simultaneous reference to multiple RAG domains
- mandatory chunking capability rather than an unspecified alternative
- generation tuning plus retrieval/chunk/search tuning
- grounding/source-content display
- dedicated council-minutes search and council-answer drafting functions
- usage threshold alerts
- annual organization/user/permission maintenance
- city-specific manuals and staff training

Yaizu highlights:
- fixed monthly price until planned token quantity
- paid token top-up when planned quantity is exhausted
- GPT-3.5 initially envisioned but not mandatory
- keyword search across conversation history
- user-adjustable Temperature-like parameters
- RAG answers should rely on registered data as much as possible and suppress general model knowledge
- “generative AI” in model-related requirement fields means LLM

### data/vendor_scores.csv

Published score rows were added for:
- Obu: 4 proposals
- Yaizu: 4 proposals
- Kitakyushu: 5 proposals

Scores remain raw because the scoring systems differ.

## Important correction from deeper reading

The initial Obu case row had budget and period fields blank. The official implementation guideline confirms:
- ceiling: 29,700,000 JPY including tax
- initial cost ceiling: 13,200,000 JPY
- running cost ceiling: 16,500,000 JPY
- contract end: 2027-03-31

These were added to the case record.

## What this changes analytically

### 1. RAG maturity can be measured beyond a boolean

Obu requires:
- data partitioned by department
- 5+ years of source documents
- cross-RAG reference
- chunking
- retrieval tuning
- source display
- use-case-specific council functionality

Yaizu explicitly asks the RAG path to suppress general model knowledge and prefer registered data.

A future RAG maturity model can therefore be evidence-based, but should not be created until more cases provide comparable detail.

### 2. Model currency is becoming a procurement requirement

Obu does not simply name one model. It expects newly released models to be made available within roughly six months, subject to the specification. That creates a distinct procurement dimension: update cadence / model freshness.

### 3. Procurement outcomes are also useful data

The gap between first and second place can be preserved without identifying anonymized vendors:
- Obu: selected 621 vs second 616 / 750
- Yaizu: selected 84 vs second 83 / 100
- Kitakyushu: selected 381.25 vs second 355 / 500

The narrow margins in Obu and Yaizu show why storing only the winner loses useful information. This does not establish that either selection was arbitrary; it only records the published score distance.

## Next

1. Retry binary Excel extraction through a supported file-download path when available.
2. Expand new-case coverage: Kagoshima, Gunma joint procurement, Hokkaido general competitive bidding.
3. Add lifecycle links for municipalities with consecutive-year procurements.
4. Continue keeping raw score and raw price incomparable across different scoring/tax/scope bases until normalized.
