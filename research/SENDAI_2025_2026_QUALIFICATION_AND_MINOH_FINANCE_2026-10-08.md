# Qualification admission: Sendai 2025/2026 and Minoh finance gate (2026-10-08)

## Source of truth and scope

Source registers and the official PDF files below were independently checked. This admission changes only `data/qualification_gates.csv`, regression tests, and documentation. It does not rewrite Source URLs, snapshots, evaluation scoring rows, or historical awards.

- Sendai 2025 guide §2 and §5(2): https://www.city.sendai.jp/rikatsuyou/propo/documents/01_ai_boshuyoryo.pdf
- Sendai 2025 Q&A No.1, No.2 and No.7: https://www.city.sendai.jp/rikatsuyou/propo/documents/ai_shitsumonkaito.pdf
- Sendai 2026 guide §2 and §5(2): https://www.city.sendai.jp/rikatsuyou/propo/documents/01_generative_ai_boshuyoryo.pdf
- Sendai 2026 Q&A No.1 and No.2: https://www.city.sendai.jp/rikatsuyou/propo/documents/generative_ai_shitsumonkaito.pdf
- Minoh 2026 bid guide §2(16), §9(1): https://www.city.minoh.lg.jp/gyoukaku/keiyaku/documents/nyusatsusetsumeisho.pdf

## Scope of Sendai admission

For *each* year, §2(1)–(7) is retained as seven materially distinct gates. §2(8) is decomposed into the enterprise-union formation requirement plus its seven separately operative conditions. Thus each year has fifteen gates rather than an incomplete selection of individual clauses.

Both years require all participant eligibility conditions; §5(2) states that proposals from applicants who fail qualification review are not accepted. Original qualifiers and separate case/Source IDs remain intact.

| Axis | 2025 | 2026 |
| --- | --- | --- |
| Prior experience years | FY2020–FY2024 (令和2〜6年度) | FY2021–FY2025 (令和3〜7年度) |
| Contracting party | National/local government, private entities etc. | National/local government |
| Experience category | Both AI service introduction and training | AI service introduction |
| Joint proposer | Representative must satisfy §2(7), and every constituent §2(1)–(6) | Same structural division, but year-specific §2(7) is different |
| Restrictions after filing | Representative maintained until work completion; constituents unchanged from filing to contract | Same |

2025 Q&A No.1 clarifies that an applicant cannot substitute the AI service manufacturer's contract record for their own. No.2 disallows informal multi-company co-signing in place of the prescribed enterprise union. Q&A No.7 allows constituent experience to be included in the work-history form, **but the guide's separate representative-satisfies-§2(7) condition must not be erased or interpreted as automatically relaxed**. The canonical rows preserve both statements rather than making up an eligibility outcome.

2026 Q&A No.1 requires certain certificates submitted with the participation statement to have been issued within three months of the submission date. Q&A No.2 offers a special submission process while changes to corporate registration are pending. These are **document-submission procedures**, not independent new qualification attributes; the current `qualification_gates.csv` does not misclassify them as additional statutory eligibility gates. These conditions remain source-linked for a future procedure-data model.

## Minoh finance boundary

The bid guide §2(16) requires the sum of the financial-condition evaluation points to be **zero or higher** as one of the bid participation qualifications. §9(1) states that a bidder below zero is not evaluated in the ordinary combined bid-price and proposal-score process. This was added as `QG-MINOH-01` with both section locators.

This gate is **not** the 100/300 price score, the 200/300 non-price score, a universal financial health metric, or a generic minimum total-score threshold. No financial score is computed or imputed.

## Integrity and remaining review boundaries

- New gates: 15 Sendai 2025, 15 Sendai 2026, 1 Minoh = 31. Total gates: 48.
- No `data/evaluation_criteria.csv` or `data/evaluation_rules.csv` changes.
- Keep exact years, represented bidders, affected stages and consequences. Source retrieval dates are historical metadata, not present-day certification.
- No claims about all other Minoh §2 items being migrated: only its financially exceptional condition is admitted here. The public UI explicitly cautions that non-display does not imply absence.
- Before applying these conditions to actual procurement, follow the official Source links and read amendments; this public comparison remains a research aid.
