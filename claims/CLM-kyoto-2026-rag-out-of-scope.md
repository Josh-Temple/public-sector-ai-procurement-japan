---
id: CLM-kyoto-2026-rag-out-of-scope
title: 京都市2026汎用生成AI調達ではRAGを本調達の要件外としている
kind: fact
status: reviewed
scope: "京都市 2026年度 庁内利活用のための汎用的な生成AIサービス提供業務の調達スコープ"
last_verified: "2026-10-01"
evidence:
  - source: SRC-kyoto-2026-general-genai-spec
    locator: "RAGを本調達の要件としない旨と、NotebookLM等の既存サービスでニーズを充足している旨の記載"
---

# Claim

京都市の2026年度「庁内利活用のための汎用的な生成AIサービス提供業務」では、RAGは本調達の要件外とされている。資料上、その理由はNotebookLM等の既存サービスでRAGニーズを充足しているためとされる。

## Scope limit

このclaimが示すのは、**当該調達の契約スコープ**である。

次の意味には拡張しない。

- 京都市がRAGを利用していない
- 京都市にRAG需要がない
- 公共部門の汎用生成AI調達ではRAGが不要である

むしろこの案件は、「調達仕様に含まれない機能」と「組織全体で利用されていない機能」を区別する必要がある例として再利用できる。

## Local corroboration

- `data/cases.csv`: `kyoto-2026-general-genai` の `source_anomaly`
- `data/requirements.csv`: 同case_idの `rag=false` とnotes
- `research/RESEARCH_PASS_6_2026-10-01.md`: Kyoto 2026 deepening

現在の京都市のAI利用状況を問う場合は、このclaimだけで回答を確定せず、最新の公式情報を再確認する。
