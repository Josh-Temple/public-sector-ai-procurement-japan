# Knowledge index

このファイルは、人間とAIがこのリポジトリを利用するときの入口である。知識本文を集約する場所ではなく、質問に対してどの正本を見るべきかを案内する。

## Scope

対象:
- 日本の地方公共団体等による生成AI・AI関連調達
- 企画、公募、要求仕様、評価、選定、契約、導入、更新
- 汎用生成AI、RAG、業務特化型AI、共同調達等

対象外:
- 公開一次資料で裏付けられないベンダー評価
- 自治体全体のAI能力を、一つの調達案件だけから推定すること
- 非公開情報、credential、個人情報

## Question routing

| 知りたいこと | まず見る場所 | 補助 |
|---|---|---|
| どんな案件があるか | `data/cases.csv` | README |
| 現在有効な要件・質疑による変更 | `data/effective_requirements.csv` | `data/source_documents.csv` |
| 横断的な機能要件projection | `data/requirements.csv` | `docs/DATA_MODEL.md` |
| 細粒度の要求事項 | `data/requirement_facts.csv` | 該当research memo |
| 公募年度・履行年度 | `data/case_timeline.csv` | `data/cases.csv` |
| 評価基準・配点 | `data/evaluation_criteria.csv` | `data/vendor_scores.csv` |
| 業務特化型AIの要件 | `data/specialized_requirements.csv` | 該当research memo |
| 調達方式・共同調達 | `data/procurement_structure.csv` | `data/joint_procurement_entities.csv` |
| 入札額 | `data/bid_results.csv` | 案件の公式結果資料 |
| 収集済み一次資料の意味・注意 | `sources/` | `data/source_documents.csv` |
| 案件ごとの確認範囲・未確認理由 | `data/review_coverage.csv` | `data/source_documents.csv` |
| Evidence coverage matrix | `data/evidence_coverage.csv` / `docs/EVIDENCE_COVERAGE.md` | `data/review_coverage.csv` |
| 回帰評価・誤読テスト | `evals/` | Effective requirements / claims |
| 公開資料での再構成限界 | `data/review_coverage.csv` / `data/effective_requirements.csv` | Source documents |
| 再利用可能な主張 | `claims/` | 根拠sourceとdata |
| 未解決事項・次の調査 | `research/COLLECTION_BACKLOG_2026-09-30.md` | 最新research pass |
| データ項目の意味 | `docs/DATA_MODEL.md` | `docs/KNOWLEDGE_MODEL.md` |
| AIの参照・更新ルール | `AGENTS.md` | このINDEX |

## Knowledge layers

### data/

案件・仕様・評価・価格等を比較可能な形に構造化したデータ。

行ごとの現在の確認状態は `verification_level` 等で管理する。分析文よりも、まずここにある値とsource URLを確認する。ただし仕様書の後に公式質問回答・訂正がある場合は、`effective_requirements.csv` を確認し、元仕様だけで現行要件を確定しない。

### sources/

再利用価値のある一次資料について、URL、発行元、資料種別、対象範囲、取得日等を保持する。

原資料の全文を無条件に複製する場所ではない。大きなPDF等は必要に応じて外部保存し、このrepoには所在・版・checksum等を記録する。

### claims/

何度も使う価値がある主張だけを保存する。

claimはsourceや構造化データへの参照を必須とし、適用範囲と検証状態を持つ。claimが存在していても、現在性が重要な質問では原典を再確認する。

### research/

調査過程、比較、発見、未解決事項を保持する。

research memoの分析結果は有用だが、現在の事実を確認するときは参照元の一次資料・structured dataまで戻る。

## Current knowledge examples

- 京都市2026汎用生成AI調達では、RAGを本調達の要件外とし、既存サービスでニーズを満たすという案件固有の境界が確認されている。
  - Source: `sources/SRC-kyoto-2026-general-genai-spec.md`
  - Claim: `claims/CLM-kyoto-2026-rag-out-of-scope.md`
- おうみ共同調達では、当初仕様の複数要件が公式質疑で変更されている。
  - Source: `sources/SRC-oumi-2026-qa.md`
  - Claim: `claims/CLM-oumi-2026-effective-amendments.md`
- 福島県2026案件は機能範囲が拡大しているが、公式仕様上は次段階の本格導入に向けた実証である。
  - Source: `sources/SRC-fukushima-2026-spec.md`
  - Claim: `claims/CLM-fukushima-2026-remains-pilot.md`
- 大府市2026では、国内データ保存要件は生成AI API接続先の国内限定を意味しない。
  - Source: `sources/SRC-obu-2026-qa.md`
  - Claim: `claims/CLM-obu-2026-domestic-storage-not-api-endpoint.md`
- 焼津市2025のRAGは登録データ優先を求めるが、一般知識の100%排除までは要求しない。
  - Source: `sources/SRC-yaizu-2025-qa.md`
  - Claim: `claims/CLM-yaizu-2025-rag-grounding-not-absolute.md`

この例は、「RAG要件なし」を「組織としてRAGを利用していない」と誤読しないための再利用可能な知識として残している。

## Freshness rule

次の質問では、保存済み知識だけで回答を確定しない。

- 現在募集中か
- 現在の選定事業者・契約状況
- 最新年度の仕様
- 現在の価格・上限額
- 現在の製品・モデル仕様
- 制度やガイドラインの現行内容

これらは、既存知識を調査の起点に使い、必要な公式一次資料をfresh readする。

## Public reconstruction boundaries

- 北九州市2025生成AIサービスでは、質問回答は参加申出者へメール配布され、公開本文を確認できない。別紙2機能要件一覧も現在の取得経路では本文未取得。
  - Source: `sources/SRC-kitakyushu-2025-guide.md`
- 神戸市2026税務ボイスボットでは、質問回答が仕様書より優先し、上位提案も契約条件に入り得るため、公開仕様だけでは契約最終要件を完全再構成できない。
  - Source: `sources/SRC-kobe-2026-voicebot-guide.md`
  - Claim: `claims/CLM-public-docs-may-not-reconstruct-contract-final.md`
- 神戸市税務ボイスボットはAIを利用するが、市民向け回答のAI生成は公募時最低限要件で禁止されている。
  - Source: `sources/SRC-kobe-2026-voicebot-spec.md`
  - Claim: `claims/CLM-kobe-2026-voicebot-no-generated-answer.md`

## Additional evidence-pattern examples

- 北海道2026RAGサービスは制限付一般競争入札で、ISO/IEC 27001は提案加点ではなく参加資格要件。
  - Source: `sources/SRC-hokkaido-2026-bid-notice.md`
  - Claim: `claims/CLM-hokkaido-2026-qualification-not-proposal-score.md`
- 越谷市2024では月100万文字以上が必須だが、「上限なし」は加点対象の提案事項。
  - Source: `sources/SRC-koshigaya-2024-qa.md`
  - Claim: `claims/CLM-koshigaya-2024-minimum-vs-evaluated-usage.md`
