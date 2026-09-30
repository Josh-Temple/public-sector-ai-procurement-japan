# Small-municipality procurement comparison — Koge and Gosen, 2026

## Scope

上毛町（約120名）と五泉市の2026年度生成AI調達を、公式仕様書・評価資料で比較する。

## Koge Town

Official sources:
- procurement page: https://www.town.koge.lg.jp/soshiki/chocho/10/3_1/5603.html
- specification: https://www.town.koge.lg.jp/material/files/group/27/aisiyousyo202606.pdf
- proposal guide / evaluation: https://www.town.koge.lg.jp/material/files/group/27/aizissiyouryou202606.pdf

Key facts:
- all staff: about 120
- proposal ceiling: 1,200,000 JPY including tax
- RAG is mandatory
- RAG source citation / relevant passage display
- department/folder access control
- semantic/high-level search rather than simple keyword search
- domestic storage including AI-model server
- LLM-side data non-retention as the first principle
- inputs/outputs not used for model training
- log export, with non-retention or equivalent stronger control when confidential data is handled
- monthly adoption/support meetings are explicitly contemplated
- 24/365 availability excluding planned/failure outages
- inquiry first response within three business days

Evaluation:
- feature/usability: 25
- data integration/expandability: 25
- security/safety: 25
- adoption/support: 20
- price: 5

This is notable because price is only 5% of the scoring despite the small absolute budget.

## Gosen City

Official sources:
- procurement page: https://www.city.gosen.lg.jp/industry_business/2/2/1/13303.html
- proposal guide: https://www.city.gosen.lg.jp/material/files/group/1/s1_genAI_jisshiyouryou.pdf
- specification: https://www.city.gosen.lg.jp/material/files/group/1/s2_genAI_shiyoushoan.pdf
- evaluation criteria: https://www.city.gosen.lg.jp/material/files/group/1/s3_genAI_hyoukakijunsho.pdf

Key facts:
- unlimited account creation
- 50+ concurrent accounts
- 17 million characters/month
- LGWAN use
- RAG 100GB+
- unlimited file count
- Word/Excel/PDF etc.
- source display
- user/organization-based reference control
- audio/image recognition
- image generation
- usage logs / dashboard or CSV output
- training-data opt-out
- domestic-region model requirement: if single-model, it must be domestic-region; if multi-model, at least one domestic-region model must be offered and administrators can restrict available models
- proposal ceiling: 1,340,000 JPY including tax
- selected vendor: Niigata Nippo Generative AI Laboratory

Evaluation totals 1,000 points across primary and secondary review:
- proposal/business understanding: 100
- staff usability: 200
- service level/operations: 100
- independent proposal/future potential: 400
- price: 200

The unusually large 400-point weight on independent proposals/future potential indicates that the city is not evaluating only current compliance; extensibility and future integration are central.

## Comparison

Both procurements are relatively small in budget compared with prefecture-scale procurements, but neither is a minimal chatbot purchase.

Common features:
- RAG
- source grounding
- administrative controls
- security requirements
- training/support
- continuing operation / updates

Differences:
- Koge puts especially strong relative weight on security/RAG/adoption support and only 5% on price.
- Gosen gives 40% of total points to independent proposals/future potential and 20% to price.
- Koge explicitly requires strong data-non-retention patterns for confidential data.
- Gosen explicitly requires LGWAN and defines a domestic-region model rule.

## Dataset implication

Municipality population or budget size should not be used as a proxy for procurement sophistication.

Future analysis should normalize:
- user count
- concurrent count
- monthly usage allowance
- RAG capacity
- security controls
- support scope
- evaluation weights
- budget / contract duration

before comparing procurement maturity across municipalities.
