# Joint procurement comparison — Oumi and Gunma, 2026

## Oumi Municipal Cloud Council

Official sources:
- result page: https://www.city.omihachiman.lg.jp/soshiki/joho_seisaku/cloud/nyusatsu/41146.html
- specification: https://www.city.omihachiman.lg.jp/material/files/group/115/AI_Shiyousyo2.pdf
- Q&A: https://www.city.omihachiman.lg.jp/material/files/group/115/AI_kaitou.pdf
- evaluation sheet: https://www.city.omihachiman.lg.jp/material/files/group/115/AI_besshi1.pdf

Participating municipalities shown on the procurement page:
- Kusatsu
- Moriyama
- Konan
- Omihachiman
- Maibara
- Koka

The broader council has eight member cities, but this AI procurement page lists six participating municipalities. The two concepts should not be conflated.

Contract structure:
1. The council chair (Mayor of Omihachiman) enters a basic contract defining matters such as plan pricing.
2. Based on the basic contract, each participating municipality signs its own actual service-use agreement.

Evaluation:
- proposal-related factors: 350 points
- function/demo: 350 points
- price: 300 points
- total: 1,000 points

Effective-requirement caution:
- the original specification is not the final effective requirement set;
- official Q&A relaxes several requirements, including LLM selection, Deep Research, prompt-template count, autonomous agents, security certification, network access and payment cadence;
- effective requirements must therefore be read from the specification together with the later Q&A.

Service-start clarification:
- default planned start: April 2026;
- Kusatsu and Koka: July 2026 planned start.

Published outcome:
- NTT DOCOMO BUSINESS: 733
- B: 708

## Gunma Prefecture Information Promotion Council

Official source:
- public proposal guide: https://www.pref.gunma.jp/uploaded/attachment/686869.pdf

The council conducts a common vendor selection, while each contract-planning entity has its own ceiling price.

After selection:
1. the secretariat adjusts the scope based on the selected proposal;
2. the selected provider submits a new estimate for each entity;
3. each entity then executes its own contract.

The procurement also allows entity-specific options such as LGWAN and training and uses a dedicated RAG evaluation sheet.

The broader council includes the prefecture, all 35 municipalities, and specified inter-municipal bodies, but that membership is not equivalent to the final contracting participants for this procurement. The procurement-specific participant appendix has not yet been normalized in the repository.

## Main difference

Both models centralize vendor selection, but the contractual layer differs.

Oumi:
- common basic contract at council level
- actual service-use agreement at municipality level

Gunma:
- common proposal selection
- scope adjustment / re-estimation for each entity
- individual contracts at entity level

This difference matters for:
- pricing comparability
- change management
- service options
- renewal analysis
- vendor concentration analysis

A single boolean `joint_procurement=true` would lose this distinction.

## Next schema step

If more joint procurements are collected, introduce a member/entity table with:
- joint_case_id
- entity_name
- role
- participation_status
- ceiling_price
- selected_option
- contract_status
- contract_amount

Do not create this table from council membership alone. Procurement-specific participation should be sourced separately.
