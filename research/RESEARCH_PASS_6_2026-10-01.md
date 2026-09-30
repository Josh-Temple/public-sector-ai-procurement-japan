# Research pass 6 — 2026-10-01

## Goal

Normalize procurement-specific entity conditions for joint procurements and deepen one previously shallow case.

## Oumi joint procurement entity normalization

The official proposal guide provides procurement-specific values for six current participating municipalities.

Current participants:
- Kusatsu: 1,700 users / 50 concurrent / 5M chars per month / 105,600 JPY monthly ceiling / 110,000 JPY initial / 165,000 JPY LGWAN-ASP setup
- Moriyama: 600 / 50 / 5M / 105,600 / 110,000 / official LGWAN setup cell shown as dash
- Konan: 500 / 50 / 5M / 105,600 / 110,000 / 165,000
- Omihachiman: 1,000 / 30 / 3M / 65,000 / 110,000 / 165,000
- Maibara: 400 / 30 / 5M / 93,500 / 110,000 / 165,000
- Koka: 800 / 30 / 5M / 93,500 / 110,000 / 165,000

All published amounts above are tax-inclusive ceilings.

Ritto and Yasu are council members but the proposal guide states that their participation is planned from FY2027 or later. They are stored as `future_planned`, not as current participants.

## Gunma joint procurement boundary

The official proposal guide confirms that:
- participating entities are defined in a separate "contract-planning entity list";
- ceiling prices are entity-specific;
- estimates must be prepared per entity;
- LGWAN setup and training are entity-specific options;
- after common vendor selection, each entity receives a fresh estimate and contracts separately.

The official appendix body itself was not retrievable in this pass. Entity names and ceilings remain unpopulated rather than reconstructed from secondary sources.

## Kyoto 2026 deepening

The previous Kyoto row was upgraded from search-result-only evidence to official HTML + PDF verification.

Confirmed:
- ceiling: 6,600,000 JPY including tax
- up to 7,000 accounts
- 30,000 document generations/month
- average 1,000-character prompt assumption
- text generation at GPT-5/GPT-5 mini or Gemini 3 Pro/Gemini 3 Flash equivalent or better
- image generation at GPT Image 1 or Gemini 3 Pro Image equivalent or better
- direct reading of document/PDF/audio/video files
- Web information retrieval
- IP-based access control
- HENNGE ONE SSO as an expected authentication option
- prompt/result logs available to administrators
- input opt-out from model/service retraining
- deletion of usage/log/account data three months after contract end
- multiple models and Deep Research are desirable additional requirements
- RAG is explicitly not required in this procurement because the city states that existing services such as NotebookLM already meet that need

Evaluation:
- basic requirements: 10
- UI/UX: 20
- additional requirements: 20
- implementation/support: 15
- cost performance: 35

Published result:
- Satellite Office: 74.1
- A: 68.5
- B: 57.5
- C: 50.3

## Analytical finding

Kyoto is useful because it shows an explicit modular procurement strategy: a city can procure a general-purpose generative AI service while deliberately excluding RAG from that contract because another service already covers the RAG need.

That means `rag=false` can sometimes mean "explicitly out of scope / covered elsewhere", not "the organization does not use RAG". Future analysis should preserve procurement scope separately from organization-wide capability.

## Structured changes

- cases: 26
- requirement profiles: 16 -> 17
- evaluation criteria: 101 -> 106
- vendor score rows: 15 -> 19
- procurement structure rows: 7 -> 8
- joint procurement entity rows: 8 (6 current + 2 future planned)

## Next

1. Obtain Gunma's official contract-planning entity appendix if a supported retrieval path becomes available.
2. Add procurement-specific entity rows only from that primary appendix.
3. Continue deepening the remaining registered cases before expanding the corpus aggressively.
