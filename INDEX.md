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
| 人間向けの案件検索・比較 | `index.html` | `docs/PUBLIC_SITE.md`, `data/case_evidence_summary.csv` |
| 現在有効な要件・質疑による変更 | `data/effective_requirements.csv` | `data/source_documents.csv` |
| 横断的な機能要件projection | `data/requirements.csv` | `docs/DATA_MODEL.md` |
| 細粒度の要求事項 | `data/requirement_facts.csv` | 該当research memo |
| 公募年度・履行年度 | `data/case_timeline.csv` | `data/cases.csv` |
| 評価基準・配点 | `data/evaluation_criteria.csv` | `data/vendor_scores.csv` |
| 業務特化型AIの要件 | `data/specialized_requirements.csv` | 該当research memo |
| 調達方式・共同調達 | `data/procurement_structure.csv` | `data/joint_procurement_entities.csv` |
| 入札額 | `data/bid_results.csv` | 案件の公式結果資料 |
| 収集済み一次資料の意味・注意 | `sources/` | `data/source_documents.csv` |
| 一次資料の再取得性・snapshot状態 | `data/source_documents.csv` | `docs/KNOWLEDGE_MODEL.md` |
| 選定済み / 契約済み / 稼働中の区別 | `data/case_stage.csv` | `data/case_timeline.csv`, `data/source_documents.csv`（共同調達では団体別状態をcase-levelへ推定集約しない） |
| 案件ごとの確認範囲を横断比較 | `data/case_evidence_summary.csv` / `docs/CASE_EVIDENCE_SUMMARY.md` | `data/review_coverage.csv`, `data/case_stage.csv` |
| 個別roleの未確認理由・根拠Source | `data/review_coverage.csv` | `data/source_documents.csv` |
| Evidence coverage matrix | `data/evidence_coverage.csv` / `docs/EVIDENCE_COVERAGE.md` | `data/review_coverage.csv` |
| 回帰評価・誤読テスト | `evals/` | Effective requirements / claims |
| Web-only / Repository-firstの独立比較設計 | `evals/benchmark/BENCHMARK_V1_METHOD.md` | RunnerにはPublic本文だけを渡し、Gold・evalsを閲覧させない |
| BENCH-V1の独立実行結果 | `research/BENCHMARK_V1_RESULT_2026-10-02.md` | Frozen scoreと探索負担を分けて読む |
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
- おうみ共同調達ではRAG自体は公募時の必須機能で、参加団体ごとに100GB以上の容量要件がある。後続Q&Aで複数機能は緩和されたが、RAG自体の任意化は確認されていない。
  - Source: `sources/SRC-oumi-2026-spec.md`
  - Claim: `claims/CLM-oumi-2026-rag-required.md`
- 福島県2026案件は機能範囲が拡大しているが、公式仕様上は次段階の本格導入に向けた実証である。
  - Source: `sources/SRC-fukushima-2026-spec.md`
  - Claim: `claims/CLM-fukushima-2026-remains-pilot.md`
- 大府市2026では、国内データ保存要件は生成AI API接続先の国内限定を意味しない。
  - Source: `sources/SRC-obu-2026-qa.md`
  - Claim: `claims/CLM-obu-2026-domestic-storage-not-api-endpoint.md`
- 焼津市2025のRAGは登録データ優先を求めるが、一般知識の100%排除までは要求しない。
  - Source: `sources/SRC-yaizu-2025-qa.md`
  - Claim: `claims/CLM-yaizu-2025-rag-grounding-not-absolute.md`
- 京都市では市長部局向けとは別に交通局も生成AIサービスを調達している。
  - Source registry: `data/source_documents.csv`
  - Claim: `claims/CLM-kyoto-2026-multiple-procurement-units.md`
- 埼玉県2026申請・相談デジタルサポートでは、県民向けにも回答根拠の表示を求め、根拠がない場合は不明回答とする制御を要求する。評価表ではナレッジ表示40点、根拠なし回答制御50点。
  - Source: `sources/SRC-saitama-2026-ai-support-spec.md`, `sources/SRC-saitama-2026-ai-support-qa.md`
  - Claim: `claims/CLM-saitama-2026-citizen-grounding-control.md`
- 群馬の共同調達は共通選定後に団体別再見積・個別契約を行う。ただし契約予定団体一覧本文は未取得である。
  - Source: `sources/SRC-gunma-2026-joint-genai-guide.md`
  - Claim: `claims/CLM-gunma-2026-entity-specific-contracting.md`
- 共同調達では、共通選定後の契約・稼働状態を案件全体へ自動集約しない。おうみ・群馬はいずれも団体別契約構造を持つ。
  - Claim: `claims/CLM-joint-procurement-stage-not-casewide.md`

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
- 神戸市2026仕様書作成支援AIでは、LLMが文書間・文書内の不整合を抽出し、RAG等を参照した修正案を生成したうえで、利用者が修正案の採用・不採用を選択する公募時最低限要件がある。
  - Source: `sources/SRC-kobe-2026-spec-authoring-spec.md`
  - Claim: `claims/CLM-kobe-2026-spec-authoring-human-in-loop.md`
  - Source: `sources/SRC-kobe-2026-voicebot-spec.md`
  - Claim: `claims/CLM-kobe-2026-voicebot-no-generated-answer.md`

## Additional public reconstruction examples

- 仙台市2025では、仕様書案と公開Q&Aから公募時の有効要件を追える。FIXERとの契約締結日・応募数も公表されているが、募集要領は提案内容や契約金額の協議変更を認める。公開された案件ページ・公募資料の確認範囲では契約後の最終要求文書は見つからず、contract_final は `not_found_in_reviewed_sources`。
  - Sources: `sources/SRC-sendai-2025-guide.md`, `sources/SRC-sendai-2025-qa.md`
- おうみ共同調達2026では、選定後に共通サービス仕様を協議作成し、各市が個別利用契約を締結する。案件ページ掲載資料では契約最終仕様・市別契約を確認できず、contract_final は確認範囲付きの `not_found_in_reviewed_sources`。
  - Sources: `sources/SRC-oumi-2026-guide.md`, `sources/SRC-oumi-2026-result.md`
- 北海道2026RAGサービスは価格による一般競争入札で、落札結果は公開される。告示は契約書作成を要するとするが、レビューした公開ページに締結済み契約・最終要求文書はなく、詳細仕様のZIPも取得不能である。
  - Sources: `data/source_documents.csv` (`SRC-hokkaido-2026-notice`, `SRC-hokkaido-2026-result`), `data/review_coverage.csv`
- 焼津市2025では、実施要領が契約交渉時の仕様書・契約書案変更を認め、公開契約書は空欄のある案である。要求機能一覧のExcel本文も source_unavailable。契約最終状態は選定結果から推測しない。
  - Sources: `sources/SRC-yaizu-2025-guide.md`, `sources/SRC-yaizu-2025-contract-draft.md`

案件全体の `publicly_reconstructable` は最終要求状態まで確認できることを示す。個別の公募stage有効要件に付いた同じラベルから、契約最終状態を推定しない。

## Additional evidence-pattern examples

- 北海道2026RAGサービスは制限付一般競争入札で、ISO/IEC 27001は提案加点ではなく参加資格要件。
  - Source: `sources/SRC-hokkaido-2026-bid-notice.md`
  - Claim: `claims/CLM-hokkaido-2026-qualification-not-proposal-score.md`
- 越谷市2024では月100万文字以上が必須だが、「上限なし」は加点対象の提案事項。
  - Source: `sources/SRC-koshigaya-2024-qa.md`
  - Claim: `claims/CLM-koshigaya-2024-minimum-vs-evaluated-usage.md`
