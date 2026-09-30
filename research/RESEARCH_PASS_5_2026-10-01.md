# Research pass 5 — 2026-10-01

## Goal

Deepen two already-registered small-municipality procurements and normalize an existing joint procurement against the Gunma model.

## Structured changes

- requirement profiles: 14 -> 16
- evaluation criteria: 77 -> 101
- procurement structure rows: 4 -> 7
- published vendor score rows: 13 -> 15
- cases remain 26

## Koge Town

The official specification shows a high requirement density despite an approximately 120-person user base.

Key requirements:
- RAG over internal ordinances/manuals
- source file / relevant passage grounding
- department/folder access control
- semantic search
- domestic storage
- LLM-side non-retention
- no training use of input/output
- log controls and stronger non-retention for confidential data
- 24/365 service
- monthly adoption support
- utilization/efficiency analytics

Evaluation weights:
- feature/usability 25
- data/RAG/expandability 25
- security 25
- adoption/support 20
- price 5

## Gosen City

Official documents confirm:
- proposal ceiling 1,340,000 JPY including tax
- unlimited accounts
- 50+ concurrent connections
- 17M characters/month
- LGWAN
- 100GB+ RAG
- unlimited RAG file count
- source display
- access control
- audio/image recognition and image generation
- model-region control
- training-data opt-out

Evaluation is 1,000 total points over primary and secondary review. Independent proposal/future potential is 400 points and price is 200.

## Oumi joint procurement

The existing Oumi case was normalized into procurement structure.

Official Q&A clarifies:
- the council chair signs a basic contract defining matters such as plan pricing;
- each participating municipality signs the actual service-use agreement based on that contract.

This differs from Gunma, where the joint body selects a provider, then scope/re-estimation occurs for each entity before individual contracts.

Oumi published score:
- NTT DOCOMO BUSINESS: 733/1000
- B: 708/1000

The Oumi AI procurement page lists six participating municipalities, while the broader council page lists eight member municipalities. Dataset rules now explicitly prohibit treating organization membership as procurement participation.

## Analytical finding

Small budget does not imply simple requirements.

Koge's 1.2M JPY ceiling and Gosen's 1.34M JPY ceiling coexist with RAG, source grounding, access control, security constraints, training/support, and—in Gosen's case—LGWAN and 100GB+ RAG.

The correct comparison unit is therefore not budget alone. At minimum, future normalized analysis should consider:
- user scale
- concurrency
- usage allowance
- RAG capacity
- security/data controls
- adoption/support scope
- evaluation weights
- contract duration

## Next

1. Normalize procurement-specific participants and entity-level ceilings for joint procurements when official appendices can be obtained.
2. Continue searching for public scoring/outcome details for small-municipality cases.
3. Expand requirement profiles for remaining registered cases before adding large numbers of shallow cases.
