# Requirement reasoning evaluation set v1

目的: このRepositoryを参照するAIが、元仕様だけを拾って誤答せず、変更資料・適用範囲・年度を含めて判断できるかを検証する。

この評価は一般知識テストではない。回答はRepositoryのstructured dataと公式一次資料に遡って再現できる必要がある。

## EVAL-001 — Oumi autonomous agent

Question:
おうみ自治体クラウドの2026生成AI調達で、自律的エージェント機能は必須か。

Expected:
必須ではない。元仕様では要件に含まれていたが、公式質問回答No.9で任意機能へ緩和された。

Required evidence:
- SRC-oumi-2026-qa
- data/effective_requirements.csv / EFF-oumi-agent

Failure modes:
- 元仕様だけを見て「必須」と回答
- 「任意」を「未対応」と読み替える

## EVAL-002 — Oumi template count

Question:
おうみ共同調達で要求されるプロンプトテンプレート数はいくつか。

Expected:
有効要件は50種類以上。当初仕様の200種類以上は、公式質問回答No.8で50種類以上へ変更された。

Required evidence:
- SRC-oumi-2026-qa
- EFF-oumi-template-count

Failure modes:
- 200種類以上と回答

## EVAL-003 — Kusatsu planned start

Question:
草津市はこの共同調達の生成AIサービスをいつから利用開始予定か。

Expected:
2026年7月開始予定。日までの精度は確認できないため「2026-07-01」と断定しない。

Required evidence:
- SRC-oumi-2026-qa / Q&A No.3
- data/joint_procurement_entities.csv

Failure modes:
- 2026-04-01
- 2026-07-01と日付を捏造

## EVAL-004 — Oumi procurement fiscal year

Question:
おうみ生成AI共同調達の公募年度とサービス年度は同じか。

Expected:
同じではない。公告は2026-03-02なので日本の会計年度ではFY2025。サービス期間は2026-04-01〜2027-03-31でFY2026。

Required evidence:
- SRC-oumi-2026-result
- data/case_timeline.csv

Failure modes:
- case_idの2026から公募年度も2026と推定

## EVAL-005 — Kyoto RAG scope

Question:
京都市2026汎用生成AI調達でRAGが要件外なら、京都市はRAGを利用していないと言えるか。

Expected:
言えない。当該調達ではRAGは要件外だが、その理由は既存サービスでRAGニーズを充足しているため。調達スコープと組織全体の能力を分ける。

Required evidence:
- CLM-kyoto-2026-rag-out-of-scope
- SRC-kyoto-2026-general-genai-spec

Failure modes:
- 「京都市はRAG未導入」と一般化

## EVAL-006 — Fukushima lifecycle

Question:
福島県2026生成AIサービス導入支援業務は本格導入フェーズか。

Expected:
いいえ。RAG・ガバナンス・定着支援等は拡大しているが、公式仕様では引き続き検証（実証）であり、次段階の本格導入に向けた整理を行う業務。

Required evidence:
- SRC-fukushima-2026-spec
- CLM-fukushima-2026-remains-pilot

Failure modes:
- 機能が高度化したことを本格導入済みと解釈

## EVAL-007 — Joint procurement axis

Question:
おうみや群馬の lifecycle_stage は joint_procurement と表現すべきか。

Expected:
いいえ。共同調達は buyer_scope / contracting_model の軸であり、pilot / production_service の事業段階とは別概念。

Required evidence:
- docs/DATA_MODEL.md
- data/procurement_structure.csv

Failure modes:
- 調達体制と事業段階を同じ分類軸に置く

## EVAL-020 — award is not contract-final

Question:
仙台市2025生成AI導入実証でFIXERとの契約締結日が公表されている。公募仕様・公開Q&Aから契約後の最終要求内容まで確定できるか。

Expected:
できない。公開Q&Aから公募時の有効要件は追えるが、募集要領は提案内容や契約内容が協議変更され得るとする。確認した公式公開ページ・掲載資料に契約後の最終要求文書はなく、contract_finalは範囲を限定してnot_found_in_reviewed_sources。

Required evidence:
- SRC-sendai-2025-guide
- SRC-sendai-2025-page
- EFF-sendai-contract-final-boundary

Failure modes:
- 契約日や受託者の公表を最終要求文書の代用にする
- not_found_in_reviewed_sourcesを全公開先で不存在と断定

## EVAL-021 — LLM training vs chat-history storage

Question:
仙台市2025の「LLMサーバに保存しない」という要件は、チャット履歴をどのサーバにも保存しないという意味か。

Expected:
いいえ。Q&Aは主に入力・出力をモデル学習に使わない趣旨と説明し、チャット履歴を別サーバに保存する構成を許容している。「学習不使用」と「履歴を一切保存しない」を混同しない。

Required evidence:
- SRC-sendai-2025-qa
- EFF-sendai-llm-data-retention

Failure modes:
- LLM学習への不使用を全システムの履歴ゼロ保存と読み替える

## EVAL-022 — announcement fiscal year

Question:
仙台市2025案件の公告日2025-03-25は、どの公募年度に分類するか。

Expected:
FY2024。日本の年度は4月始まりであり、案件IDや契約年度からFY2025と決めない。

Required evidence:
- SRC-sendai-2025-guide
- data/case_timeline.csv
- data/cases.csv

Failure modes:
- case_idの2025をannouncement fiscal yearに流用
- 2025年3月公告をFY2025と誤分類

## EVAL-023 — contract period vs service-use period in joint procurement

Question:
おうみ共同調達の2026-04-01〜2027-03-31を、全6市の実際のサービス利用期間として記録してよいか。

Expected:
よくない。これは資料に記載された契約期間。Q&Aは一般に4月開始、草津市と甲賀市は7月開始予定とし、実施要領は契約期間と実利用期間を区別する。実利用の共通開始日・終了日は確定できない。

Required evidence:
- SRC-oumi-2026-guide
- SRC-oumi-2026-qa
- data/case_timeline.csv

Failure modes:
- 契約期間を全市共通の実利用期間へ転記
- 予定開始月を実績日として扱う


## EVAL-024 — bid result vs contract-final requirements

Question:
北海道2026RAGサービスの制限付一般競争入札で日立製作所の落札と入札額が分かる。そこから契約最終要求内容を再構成できるか。

Expected:
できない。告示は契約書作成を要し、契約条項の提示場所を示す。公開結果PDFは入札者・価格・落札者を示すだけで、締結済み条件や最終要求は含まない。レビューした公開ページ範囲ではその文書を確認できず、業務処理要領を含む公式ZIPもsource_unavailable。proposal evaluationは調達方式上not_applicableだが、contract_finalは適用される。

Required evidence:
- SRC-hokkaido-2026-notice
- SRC-hokkaido-2026-result
- EFF-hokkaido-2026-contract-final-boundary
- data/review_coverage.csv

Failure modes:
- 落札者・落札額を最終仕様の証拠にする
- 評価roleのnot_applicableをcontract_finalにも流用
- ZIPの内容を推測して補完
