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

## Scoring

各問:
- 2点: expected answer + scope/condition + required evidenceへの到達
- 1点: 結論は正しいが条件・根拠が不足
- 0点: 結論誤り、または根拠なし

Total: 30 points.

初期目標は満点ではなく、**0点回答をなくすこと**。特にEVAL-001〜015で旧仕様・スコープ拡張・質疑解釈・公開資料の限界を無視した0点誤答が発生しないことを優先する。

## EVAL-008 — Obu API endpoint vs data storage

Question:
大府市2026生成AI調達では、国内データセンター保存要件があるため、生成AI API接続先も国内でなければならないか。

Expected:
いいえ。公式質疑ではAPI接続先は国内限定ではない。ただし市データが国外に保存されないことが前提。

Required evidence:
- SRC-obu-2026-qa
- EFF-obu-data-location
- CLM-obu-2026-domestic-storage-not-api-endpoint

Failure modes:
- 国内保存要件からAPI接続先も国内必須と推定
- 海外APIなら国外保存も許容されると推定

## EVAL-009 — Obu chunking substitution

Question:
大府市のRAG要件で、回答精度が同等ならチャンク分割以外の手法で代替できるか。

Expected:
できない。公式質疑No.32では、チャンク分割そのものを評価する項目であり、別手法の提案は受け付けないと回答している。

Required evidence:
- SRC-obu-2026-qa
- EFF-obu-rag-chunking

Failure modes:
- 目的が同じなら代替可能と回答

## EVAL-010 — Yaizu GPT-3.5

Question:
焼津市2025生成AI調達ではGPT-3.5の提供は必須か。

Expected:
必須ではない。利用開始直後に職員が利用する想定はあるが、公式質疑No.3で提供は必須ではないと明示された。

Required evidence:
- SRC-yaizu-2025-qa
- EFF-yaizu-gpt35

Failure modes:
- 要求機能一覧の元記載だけから必須と回答

## EVAL-011 — Yaizu RAG general knowledge

Question:
焼津市のRAG要件は、LLMの一般知識を100%使わないことを要求しているか。

Expected:
いいえ。登録データからの回答を優先し、一般知識からの回答を可能な限り抑制する要件であり、100%排除は要求していない。

Required evidence:
- SRC-yaizu-2025-qa
- EFF-yaizu-rag-grounding
- CLM-yaizu-2025-rag-grounding-not-absolute

Failure modes:
- 一般知識の完全禁止と回答
- 単なる「RAGあり」だけで条件を省略

## EVAL-012 — Kitakyushu public Q&A boundary

Question:
北九州市2025生成AIサービスについて、公開仕様書と評価表を確認すれば応募時の最終有効要件をすべて確定できるか。

Expected:
できない。公式実施説明書では質問回答を参加申出書提出者全員へ電子メールで配布するとしており、公開回答本文を確認できない。また必須機能を定める別紙2機能要件一覧の本文も現在の取得経路ではsource_unavailable。公開資料から確認できるのは公募baselineまで。

Required evidence:
- SRC-kitakyushu-2025-guide
- SRC-kitakyushu-2025-feature-matrix
- EFF-kitakyushu-public-qa-limit

Failure modes:
- 仕様書が公開されているので最終要件まで完全に確定できると回答
- 未取得Excelの中身を推測して補完

## EVAL-013 — Kobe voicebot answer generation

Question:
神戸市税務部の「生成AI自動音声応答サービス」は、市民からの質問に生成AIが自由に回答文を生成する仕組みを要求しているか。

Expected:
いいえ。音声・文脈理解にはAI技術を利用するが、回答は市提供FAQを基にした回答データから行い、AIによる回答生成は認めない。

Required evidence:
- SRC-kobe-2026-voicebot-spec
- EFF-kobe-voice-answer-policy
- CLM-kobe-2026-voicebot-no-generated-answer

Failure modes:
- 案件名に「生成AI」があることだけから生成回答を許可していると推定
- AIを使っていないと逆方向に一般化

## EVAL-014 — Kobe contract-final reconstruction

Question:
神戸市税務ボイスボットの公開調達仕様書を読めば、契約締結後の最終仕様を完全に再現できるか。

Expected:
できない。実施要領では質問回答が仕様書より優先し、その質問回答は参加者へのEメール配布で公開本文を確認できない。さらに企画提案書が質問回答・仕様書の水準を上回る部分は提案書が優先し得る。公開仕様は公募時最低限要件として扱う。

Required evidence:
- SRC-kobe-2026-voicebot-guide
- EFF-kobe-voice-document-priority
- CLM-public-docs-may-not-reconstruct-contract-final

Failure modes:
- 公開仕様書を契約最終仕様と断定
- 非公開Q&Aを「変更なし」と仮定

## EVAL-015 — Kobe transfer granularity

Question:
神戸市税務ボイスボットは、問い合わせを特定の個人職員へ直接転送することを要求しているか。

Expected:
いいえ。仕様書は課または係単位への転送を想定しており、個別職員への転送を前提としていない。

Required evidence:
- SRC-kobe-2026-voicebot-spec
- EFF-kobe-voice-transfer-scope

Failure modes:
- 「職員へ転送」という要約だけから個人転送と回答
