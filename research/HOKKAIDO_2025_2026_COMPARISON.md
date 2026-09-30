# Hokkaido generative AI procurement comparison — 2025 to 2026

## Scope

北海道の2025年度「生成AI活用推進業務」と、2026年度「生成AIサービス（RAG）提供業務」を公式一次資料で比較する。

Sources:
- 2025 procurement page: https://www.pref.hokkaido.lg.jp/sm/jsk/216351.html
- 2025 specification: official PDF linked from the procurement page
- 2025 selection / contract result: official PDFs linked from the procurement page
- 2026 procurement page: https://www.pref.hokkaido.lg.jp/sm/jsk/254586.html
- 2026 bid result index: https://www.pref.hokkaido.lg.jp/sm/jsk/186926.html

## 2025: proposal-based RAG pilot

The 2025 procurement is a public proposal process designed to test whether RAG can improve answer accuracy and generate measurable work-efficiency gains before full-scale introduction.

Confirmed requirements include:
- approximately 12,000 employee accounts
- at least 30 RAG business domains
- at least 100GB total RAG capacity
- source document / relevant passage display
- user-level access control
- feedback on generated answers
- RAG preprocessing / tuning / evaluation
- prompt/input data not used for AI training
- dedicated Hokkaido tenant/area
- IP access restriction
- user/content/token logs and export
- domestic service facility and Japanese governing law / jurisdiction
- 24/365 availability excluding maintenance/failure periods
- support desk
- at least two training sessions
- intermediate and final RAG effectiveness analysis
- approximately 200 million tokens/month assumed under fixed pricing

The official Q&A states that LGWAN was not used in this pilot.

Outcome:
- selected contractor: NTT East
- contract date: 2025-06-11
- contract amount: 21,780,000 JPY
- contract end: 2026-03-31
- 11 proposal labels/participants are shown in the official evaluation result.

## 2026: restricted general competitive bidding

The 2026 procurement is titled "生成AIサービス（RAG）提供業務" and uses restricted general competitive bidding rather than a proposal competition.

Confirmed award rule:
- bids must fall within the planned price
- among valid bids, the lowest price wins
- no minimum-price floor / low-price investigation scheme applies to this procurement

Official bid results:
- Hitachi: 9,587,430 JPY — winner
- Exa Enterprise AI: 12,536,000 JPY
- NTT East: 18,500,000 JPY

The official result document states that the award price is the bid amount plus consumption/local consumption tax. Therefore the repository stores the raw pre-tax bid in `bid_results.csv` and does not infer an inclusive contract amount in `cases.csv`.

Service period:
- 2026-06-01 to 2027-03-31

## What can and cannot be concluded

What is directly supported:
- 2025 was explicitly a RAG pilot intended to inform full introduction.
- 2026 procures a RAG service using a price-competition method.
- the vendor changed from NTT East to Hitachi.
- the selection mechanism changed from qualitative proposal evaluation to lowest valid bid among qualified bidders.

What is not yet supported:
- a precise feature-by-feature reduction or expansion from 2025 to 2026.

The 2026 detailed processing specification is packaged in an official ZIP that was not retrievable through the current runtime. It is therefore marked ACCESS_UNAVAILABLE rather than reconstructed from third-party copies.

## Dataset implication

Procurement lifecycle should not be modeled only as:
`pilot -> production`

It should also preserve:
- selection method
- award basis
- bidder count
- raw bid values
- contract model
- lifecycle stage

This makes it possible to distinguish technical maturity from procurement-method changes.
