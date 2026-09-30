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
| 横断的な機能要件 | `data/requirements.csv` | `docs/DATA_MODEL.md` |
| 細粒度の要求事項 | `data/requirement_facts.csv` | 該当research memo |
| 評価基準・配点 | `data/evaluation_criteria.csv` | `data/vendor_scores.csv` |
| 業務特化型AIの要件 | `data/specialized_requirements.csv` | 該当research memo |
| 調達方式・共同調達 | `data/procurement_structure.csv` | `data/joint_procurement_entities.csv` |
| 入札額 | `data/bid_results.csv` | 案件の公式結果資料 |
| 収集済み一次資料の意味・注意 | `sources/` | 元URL・既存data |
| 再利用可能な主張 | `claims/` | 根拠sourceとdata |
| 未解決事項・次の調査 | `research/COLLECTION_BACKLOG_2026-09-30.md` | 最新research pass |
| データ項目の意味 | `docs/DATA_MODEL.md` | `docs/KNOWLEDGE_MODEL.md` |
| AIの参照・更新ルール | `AGENTS.md` | このINDEX |

## Knowledge layers

### data/

案件・仕様・評価・価格等を比較可能な形に構造化したデータ。

行ごとの現在の確認状態は `verification_level` 等で管理する。分析文よりも、まずここにある値とsource URLを確認する。

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
