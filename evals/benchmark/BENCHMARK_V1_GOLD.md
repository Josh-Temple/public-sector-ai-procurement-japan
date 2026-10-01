# AI調達仕様検討ベンチマーク V1 — Gold（Judge用）

知識基準commit: `35d66cf710215f251da9809034249de868f6d24e`。原典確認日: 2026-10-01。独立二重レビューは未実施。両Runnerの回答は未実行。

本ファイルはGold JSONの生成版。Runnerに渡さない。公募stageの条件と契約最終状態を区別する。別の公式根拠や更新を正当なものとして認める。採点詳細はMETHODを参照。

## BENCH-V1-001

**question**: 北九州市の令和7年度「生成AIサービス提供業務」の公開仕様では、システム利用者数と生成AIの同時接続数をどの程度想定していますか。

**practical_context**: 自庁の利用規模を設定するため、先行調達の規模を確認したい。

**expected_answer**: システム利用者は約7,500人、生成AI同時接続は約400人を想定。公募仕様の想定値である。

**primary_category**: A

**difficulty**: easy

**candidate_origin**: new

**why_repository_may_help**: INDEXから規模の行と原典へ直接到達できるが、Webの仕様書1件でも回答可能。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): 利用者数は約7,500人。
- F2 (2点): 生成AI同時接続数は約400人。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- 7,500人が実利用している。
- 400アカウントしか発行できない。

**error_type**

- factual_error
- scope_loss

**repository_evidence**

- data/requirements.csv#kitakyushu-2025-genai-service
- data/cases.csv#kitakyushu-2025-genai-service

**primary_sources**

- `SRC-kitakyushu-2025-spec`: [令和7年度生成AIサービス提供業務 公募型プロポーザル方式仕様書](https://www.city.kitakyushu.lg.jp/files/001140148.pdf) — PDF p.2、4 サービス利用規模。本文確認 2026-10-01。SHA-256 `94a19d5999c68885fbd3a015c575e8ad06dde9ce3f33b195a33407fe161b0a48`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): 概数として示す。（1点） / 公募仕様の想定値として示す。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 利用実績として断定しない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `kitakyushu-2025-genai-service`: case-level `publicly_bounded`; stage: projection行なし＝未確認。
  - roles: result=reviewed (2026-10-01), procurement_guide=reviewed (2026-10-01), specification=reviewed (2026-10-01), requirement_matrix=source_unavailable (2026-10-01), evaluation=reviewed (2026-10-01), qa_amendment=not_public (2026-10-01)。

**effective_requirement_state**

- この問のGoldは要件行を必須とせず、記載した原典・structured rowに基づく。

**claim_state**

- 独立claimは使用せず、structured rowと原典を用いる。

## BENCH-V1-002

**question**: 焼津市の令和7年度「生成AIサービス提供業務」の公募上限額はいくらですか。消費税の扱いも教えてください。

**practical_context**: 見積依頼の予算枠を設定する際の参考額を調べている。

**expected_answer**: 上限額は3,000,000円。消費税及び地方消費税を含む。

**primary_category**: A

**difficulty**: easy

**candidate_origin**: new

**why_repository_may_help**: 案件台帳の上限額を再利用できる。公式ページ単独でも容易な対照問。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): 上限額3,000,000円。
- F2 (2点): 消費税及び地方消費税を含む。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- 3,000,000円が締結済み契約額。
- 税別3,000,000円。

**error_type**

- factual_error
- scope_loss

**repository_evidence**

- data/cases.csv#yaizu-2025-genai-service

**primary_sources**

- `SRC-yaizu-2025-page`: [令和7年度焼津市生成AIサービス提供業務に関する公募型プロポーザル](https://www.city.yaizu.lg.jp/business/bid-contract/info/proposal/info-00032.html) — HTML「業務概要 > 上限額」。本文確認 2026-10-01。SHA-256 `d302e64c98c1b95ecb197ec81d05ee1738d64978255935fa272513a15d554fd5`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): 令和7年度の当該業務を対象とする。（1点） / 公募上限であり契約額とは区別する。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 実契約額と断定しない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `yaizu-2025-genai-service`: case-level `publicly_bounded`; stage: projection行なし＝未確認。
  - roles: specification=reviewed (2026-10-01), qa_amendment=reviewed (2026-10-01), requirement_matrix=source_unavailable (2026-10-01), evaluation=reviewed (2026-10-01), result=reviewed (2026-10-01), contract_final=not_found_in_reviewed_sources (2026-10-01), procurement_guide=reviewed (2026-10-01)。

**effective_requirement_state**

- この問のGoldは要件行を必須とせず、記載した原典・structured rowに基づく。

**claim_state**

- 独立claimは使用せず、structured rowと原典を用いる。

## BENCH-V1-003

**question**: 京都市の令和8年度「庁内利活用のための汎用的な生成AIサービス提供業務」で、2026年3月12日の公表結果における第一交渉権者はどの事業者ですか。

**practical_context**: 導入相談の参考に、公表された事業者選定結果を確認したい。

**expected_answer**: 第一交渉権者は株式会社サテライトオフィス。公表されたのは受託候補者の選定である。

**primary_category**: A

**difficulty**: easy

**candidate_origin**: new

**why_repository_may_help**: stageと選定者を分けた行がある。公式結果ページ1件でも回答可能。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): 株式会社サテライトオフィス。
- F2 (2点): 第一交渉権者として選定。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- 同公表だけから契約済み・稼働中とする。
- 交通局の別案件と同一案件扱いする。

**error_type**

- factual_error
- stage_error

**repository_evidence**

- data/case_stage.csv#kyoto-2026-general-genai
- data/vendor_scores.csv#kyoto-2026-general-genai

**primary_sources**

- `SRC-kyoto-2026-general-genai-result`: [令和8年度 庁内利活用のための汎用的な生成AIサービス提供事業者に係る公募型プロポーザル 選定結果](https://www.city.kyoto.lg.jp/sogo/page/0000351116.html) — HTML「受託候補者」、2026年3月12日。本文確認 2026-10-01。SHA-256 `37b080036f0fd9046e78dc760ffb67568ca3b41e5346bad32ca4a5421566c41d`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): 市長部局向けの汎用サービス案件を対象とする。（1点） / 2026年3月12日の選定公表を対象とする。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): この結果だけで契約締結や稼働を断定しない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `kyoto-2026-general-genai`: case-level `not_assessed`; stage: selection=selected_candidate_confirmed, contract=not_verified, operation=not_verified。
  - roles: 標準role未評価。

**effective_requirement_state**

- この問のGoldは要件行を必須とせず、記載した原典・structured rowに基づく。

**claim_state**

- 独立claimは使用せず、structured rowと原典を用いる。

## BENCH-V1-004

**question**: 北海道の令和8年度「生成AIサービス（RAG）提供業務」は、どの調達方式で事業者を選ぶ案件ですか。

**practical_context**: 調達方式を検討するため、先行案件の方式名を確認したい。

**expected_answer**: 制限付一般競争入札。

**primary_category**: A

**difficulty**: easy

**candidate_origin**: new

**why_repository_may_help**: 方式の表で即確認できるが、Webで告示を読むだけでも回答できる。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): 一般競争入札である。
- F2 (2点): 制限付である。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- 公募型プロポーザル。
- 前年の方式をそのまま流用する。

**error_type**

- factual_error
- stage_error

**repository_evidence**

- data/procurement_structure.csv#hokkaido-2026-genai-rag-service

**primary_sources**

- `SRC-hokkaido-2026-notice`: [北海道告示第10635号](https://www.pref.hokkaido.lg.jp/fs/1/3/1/1/6/4/7/9/_/%E5%8C%97%E6%B5%B7%E9%81%93%E5%91%8A%E7%A4%BA%E7%AC%AC10635%E5%8F%B7.pdf) — PDF p.1、4(1) 制限付一般競争入札参加資格の審査。本文確認 2026-10-01。SHA-256 `33f29d810127c303e6eed144c7cd471ea863db86dc98b90d89e67c3370545432`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): 令和8年度の当該業務を対象とする。（1点） / 前年度の実証案件と分ける。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 実稼働の証拠として扱わない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `hokkaido-2026-genai-rag-service`: case-level `publicly_bounded`; stage: projection行なし＝未確認。
  - roles: specification=source_unavailable (2026-10-01), qa_amendment=not_assessed (2026-10-01), requirement_matrix=not_assessed (2026-10-01), evaluation=not_applicable (2026-10-01), result=reviewed (2026-10-01), contract_final=not_found_in_reviewed_sources (2026-10-01)。

**effective_requirement_state**

- この問のGoldは要件行を必須とせず、記載した原典・structured rowに基づく。

**claim_state**

- 独立claimは使用せず、structured rowと原典を用いる。

## BENCH-V1-005

**question**: 越谷市の令和6年度「生成AIサービス提供等業務」を参考に利用量を設定したいです。最低限確保する月間文字数と、文字数上限に関する提案の扱いを教えてください。

**practical_context**: 利用量の最低条件と、評価で差を付ける条件を分けて書きたい。

**expected_answer**: 月100万文字以上が必須。上限なしは提案事項で、上限量に応じた加点評価の対象である。

**primary_category**: B

**difficulty**: medium

**candidate_origin**: EVAL-018を予算・評価設計の問いへ変換

**why_repository_may_help**: 必須と評価対象を分けた有効要件がある。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): 月100万文字以上は必須。
- F2 (2点): 上限なしは提案事項で上限量により加点。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- 上限なしが必須。
- 100万トークン/月。

**error_type**

- factual_error
- amendment_miss
- scope_loss

**repository_evidence**

- data/effective_requirements.csv#EFF-koshigaya-minimum-characters
- data/effective_requirements.csv#EFF-koshigaya-unlimited-characters
- claims/CLM-koshigaya-2024-minimum-vs-evaluated-usage.md

**primary_sources**

- `SRC-koshigaya-2024-spec`: [越谷市生成AIサービス提供業務仕様書](https://www.city.koshigaya.saitama.jp/kurashi_shisei/jigyosha/dejitaru/files/02_1_generation-ai-service-shiyosho.pdf) — PDF p.9、4.1.1/4.1.2；p.10 提案事項。本文確認 2026-10-01。SHA-256 `48b9f0f6c44c8a5c21ae063f2b29c30b10a6fb43d0c44543f37806c47b1e8f23`。
- `SRC-koshigaya-2024-qa`: [越谷市生成AIサービス提供等業務 質問回答書](https://www.city.koshigaya.saitama.jp/kurashi_shisei/jigyosha/dejitaru/files/generation-ai-answer.pdf) — PDF p.1、No.5。本文確認 2026-10-01。SHA-256 `de8ab19df28c1a9ecad9c1389cea1f997689b8a345e0a3bd91f629d28bb39c56`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): 最低量と追加提案を分ける。（1点） / 文字/月として示しトークンと同一視しない。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 公募・質疑後の条件として示し実績量や契約最終値を推定しない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `koshigaya-2024-genai-service-training`: case-level `not_assessed`; stage: projection行なし＝未確認。
  - roles: specification=reviewed (2026-10-01), qa_amendment=reviewed (2026-10-01), requirement_matrix=not_applicable (2026-10-01), evaluation=reviewed (2026-10-01), result=reviewed (2026-10-01), contract_final=not_assessed (2026-10-01)。

**effective_requirement_state**

- `EFF-koshigaya-minimum-characters`: reviewed; procurement_effective; publicly_reconstructable; 2026-10-01。
- `EFF-koshigaya-unlimited-characters`: reviewed; procurement_effective; publicly_reconstructable; 2026-10-01。

**claim_state**

- `claims/CLM-koshigaya-2024-minimum-vs-evaluated-usage.md`: reviewed; last_verified="2026-10-01"。

## BENCH-V1-006

**question**: 越谷市の令和6年度「生成AIサービス提供等業務」と、おうみ自治体クラウドの2026年公募「生成AIサービス提供事業」では、庁内文書を使うRAGを調達条件としてどう位置付けていますか。必須か提案事項かを比較してください。

**practical_context**: 自庁のRAGを基本条件に含めるか、追加提案として募るか検討している。

**expected_answer**: 越谷市はRAG等による組織内情報からの回答を提案事項とする。おうみはRAG機能を必須とし、登録・団体内共有等を求める。

**primary_category**: H

**difficulty**: hard

**candidate_origin**: new

**why_repository_may_help**: 横断表から比較先を発見し、requirednessと原典を接続できる。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): 越谷市ではRAG等は提案事項。
- F2 (2点): おうみではRAG機能が必須。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- 越谷市はRAGを利用していない。
- 両方でRAGは任意。

**error_type**

- scope_loss
- unsupported_assertion

**repository_evidence**

- data/effective_requirements.csv#EFF-koshigaya-rag
- data/requirements.csv#oumi-2026-joint-genai

**primary_sources**

- `SRC-koshigaya-2024-spec`: [越谷市生成AIサービス提供業務仕様書](https://www.city.koshigaya.saitama.jp/kurashi_shisei/jigyosha/dejitaru/files/02_1_generation-ai-service-shiyosho.pdf) — PDF p.9、4.1.2(1)。本文確認 2026-10-01。SHA-256 `48b9f0f6c44c8a5c21ae063f2b29c30b10a6fb43d0c44543f37806c47b1e8f23`。
- `SRC-oumi-2026-spec`: [おうみ自治体クラウド・生成AIサービス提供事業 仕様書](https://www.city.omihachiman.lg.jp/material/files/group/115/AI_Shiyousyo2.pdf) — PDF p.3、7(4)イ・ウ。本文確認 2026-10-01。SHA-256 `e43f08d2cacd06eec84c4c2420fb2790a9198b521019591a115edab248801c5d`。
- `SRC-oumi-2026-qa`: [おうみ自治体クラウド・生成AIサービス提供事業 質問回答](https://www.city.omihachiman.lg.jp/material/files/group/115/AI_kaitou.pdf) — PDF p.1、No.1-18を確認。RAG必須の削除・任意化は掲載回答にない。本文確認 2026-10-01。SHA-256 `4eedfb48b1d56e9396f4fbdb7422bde79d648d184654c11f2a135a79402090e0`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): 各公募案件の条件を比較する。（1点） / 要件の位置付けと実装・導入実績を分ける。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): この比較から自治体全体のRAG有無を断定しない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `koshigaya-2024-genai-service-training`: case-level `not_assessed`; stage: projection行なし＝未確認。
  - roles: specification=reviewed (2026-10-01), qa_amendment=reviewed (2026-10-01), requirement_matrix=not_applicable (2026-10-01), evaluation=reviewed (2026-10-01), result=reviewed (2026-10-01), contract_final=not_assessed (2026-10-01)。
- `oumi-2026-joint-genai`: case-level `publicly_bounded`; stage: projection行なし＝未確認。
  - roles: specification=reviewed (2026-10-01), qa_amendment=reviewed (2026-10-01), evaluation=reviewed (2026-10-01), result=reviewed (2026-10-01), procurement_guide=reviewed (2026-10-01), contract_final=not_found_in_reviewed_sources (2026-10-01)。

**effective_requirement_state**

- `EFF-koshigaya-rag`: reviewed; procurement_baseline; publicly_reconstructable; 2026-10-01。

**claim_state**

- 独立claimは使用せず、structured rowと原典を用いる。

## BENCH-V1-007

**question**: おうみ自治体クラウドの2026年公募「生成AIサービス提供事業」で、プロンプトテンプレートの必要数と自律的エージェント機能の扱いはどうなっていますか。提案条件として整理してください。

**practical_context**: ベンダーへの事前照会で、標準搭載が必要な機能を整理したい。

**expected_answer**: 質疑後はテンプレート50種類以上、自律的エージェントは任意。元仕様は200種類以上・エージェントを要求していたが緩和された。

**primary_category**: C

**difficulty**: hard

**candidate_origin**: EVAL-001/002を1問へ統合し提案条件の問いへ変換

**why_repository_may_help**: 変更前後と変更根拠をまとめて取得できる。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): テンプレートは50種類以上へ緩和。元仕様200種類以上。
- F2 (2点): 自律的エージェントは要求から任意へ緩和。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- テンプレート200種類以上が引き続き必須。
- エージェントが必須。
- 任意なので評価しない。

**error_type**

- amendment_miss
- factual_error

**repository_evidence**

- data/effective_requirements.csv#EFF-oumi-template-count
- data/effective_requirements.csv#EFF-oumi-agent
- claims/CLM-oumi-2026-effective-amendments.md

**primary_sources**

- `SRC-oumi-2026-spec`: [おうみ自治体クラウド・生成AIサービス提供事業 仕様書](https://www.city.omihachiman.lg.jp/material/files/group/115/AI_Shiyousyo2.pdf) — PDF p.4、7(4)コ・サ～ス。本文確認 2026-10-01。SHA-256 `e43f08d2cacd06eec84c4c2420fb2790a9198b521019591a115edab248801c5d`。
- `SRC-oumi-2026-qa`: [おうみ自治体クラウド・生成AIサービス提供事業 質問回答](https://www.city.omihachiman.lg.jp/material/files/group/115/AI_kaitou.pdf) — PDF p.1、No.8-9。本文確認 2026-10-01。SHA-256 `4eedfb48b1d56e9396f4fbdb7422bde79d648d184654c11f2a135a79402090e0`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): 質疑後の応募条件として示す。（1点） / 任意でも有無・実装予定がある場合のスケジュールは提案書に記載し評価される。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 任意を非提供・禁止や契約最終状態と断定しない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `oumi-2026-joint-genai`: case-level `publicly_bounded`; stage: projection行なし＝未確認。
  - roles: specification=reviewed (2026-10-01), qa_amendment=reviewed (2026-10-01), evaluation=reviewed (2026-10-01), result=reviewed (2026-10-01), procurement_guide=reviewed (2026-10-01), contract_final=not_found_in_reviewed_sources (2026-10-01)。

**effective_requirement_state**

- `EFF-oumi-template-count`: reviewed; procurement_effective; publicly_reconstructable; 2026-10-01。
- `EFF-oumi-agent`: reviewed; procurement_effective; publicly_reconstructable; 2026-10-01。

**claim_state**

- `claims/CLM-oumi-2026-effective-amendments.md`: reviewed; last_verified="2026-10-01"。

## BENCH-V1-008

**question**: おうみ自治体クラウドの2026年公募「生成AIサービス提供事業」を参考にDeep Researchの条件を検討しています。提案時点で未実装のサービスは受け付けられますか。受け付けられるなら何を示す必要がありますか。

**practical_context**: 開発予定のある製品も候補に含めるべきかを検討している。

**expected_answer**: 未実装でも実装予定があれば許容。機能の有無と予定スケジュールを企画提案書へ記載し、内容が評価される。

**primary_category**: C

**difficulty**: medium

**candidate_origin**: new

**why_repository_may_help**: planned acceptableと予定の開示条件を一緒に再利用できる。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): 利用可能または実装予定でよい。
- F2 (2点): 有無と未実装の場合の予定スケジュールを提案書に記載し評価される。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- 単に不要・完全任意。
- 予定の記載なしでよい。
- すでに全機能が稼働している。

**error_type**

- amendment_miss
- scope_loss

**repository_evidence**

- data/effective_requirements.csv#EFF-oumi-deep-research
- claims/CLM-oumi-2026-effective-amendments.md

**primary_sources**

- `SRC-oumi-2026-spec`: [おうみ自治体クラウド・生成AIサービス提供事業 仕様書](https://www.city.omihachiman.lg.jp/material/files/group/115/AI_Shiyousyo2.pdf) — PDF p.3、7(4)エ。Q&Aの項目欄はウと記すため項番差は原文のまま扱う。本文確認 2026-10-01。SHA-256 `e43f08d2cacd06eec84c4c2420fb2790a9198b521019591a115edab248801c5d`。
- `SRC-oumi-2026-qa`: [おうみ自治体クラウド・生成AIサービス提供事業 質問回答](https://www.city.omihachiman.lg.jp/material/files/group/115/AI_kaitou.pdf) — PDF p.1、No.5。本文確認 2026-10-01。SHA-256 `4eedfb48b1d56e9396f4fbdb7422bde79d648d184654c11f2a135a79402090e0`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): 提案時点の許容条件を述べる。（1点） / 元仕様の実装要求から質疑で緩和されたことを示す。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 予定を実装済み・納期保証と読み替えない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `oumi-2026-joint-genai`: case-level `publicly_bounded`; stage: projection行なし＝未確認。
  - roles: specification=reviewed (2026-10-01), qa_amendment=reviewed (2026-10-01), evaluation=reviewed (2026-10-01), result=reviewed (2026-10-01), procurement_guide=reviewed (2026-10-01), contract_final=not_found_in_reviewed_sources (2026-10-01)。

**effective_requirement_state**

- `EFF-oumi-deep-research`: reviewed; procurement_effective; publicly_reconstructable; 2026-10-01。

**claim_state**

- `claims/CLM-oumi-2026-effective-amendments.md`: reviewed; last_verified="2026-10-01"。

## BENCH-V1-009

**question**: 焼津市の令和7年度「生成AIサービス提供業務」では、GPT-3.5をサービス開始時に提供することは提案の必須条件ですか。

**practical_context**: モデルの提供終了や更新がある場合、古いモデルの指定をどう扱うか参考にしたい。

**expected_answer**: 必須ではない。開始直後の利用を想定していたが、質疑回答は提供を必須としない。

**primary_category**: C

**difficulty**: medium

**candidate_origin**: EVAL-010をベンダー照会の問いへ変換

**why_repository_may_help**: モデル更新事情と必須性を区別した有効要件がある。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): GPT-3.5提供は必須ではない。
- F2 (2点): 開始直後の利用は想定されていた。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- GPT-3.5が必須。
- GPT-3.5は禁止。
- 現在のモデル可用性をこの資料から断定。

**error_type**

- amendment_miss
- unsupported_assertion

**repository_evidence**

- data/effective_requirements.csv#EFF-yaizu-gpt35
- sources/SRC-yaizu-2025-qa.md

**primary_sources**

- `SRC-yaizu-2025-qa`: [令和7年度焼津市生成AIサービス提供業務 質疑回答書](https://www.city.yaizu.lg.jp/documents/19797/kaitou.pdf) — PDF p.1、No.3（要求機能一覧No.11を引用）。本文確認 2026-10-01。SHA-256 `91187838db80ee819eaed3d51fe5b435e295687920380a859fe08d0f566ccc34`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): 当該公募のモデル提供条件に限る。（1点） / 質疑回答後の条件を用いる。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 想定を実提供の確認へ変えない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `yaizu-2025-genai-service`: case-level `publicly_bounded`; stage: projection行なし＝未確認。
  - roles: specification=reviewed (2026-10-01), qa_amendment=reviewed (2026-10-01), requirement_matrix=source_unavailable (2026-10-01), evaluation=reviewed (2026-10-01), result=reviewed (2026-10-01), contract_final=not_found_in_reviewed_sources (2026-10-01), procurement_guide=reviewed (2026-10-01)。

**effective_requirement_state**

- `EFF-yaizu-gpt35`: reviewed; procurement_effective; publicly_reconstructable; 2026-10-01。

**claim_state**

- 独立claimは使用せず、structured rowと原典を用いる。

## BENCH-V1-010

**question**: 大府市の令和8年度「生成AIサービスの導入業務」のデータ保存条件を参考にしたいです。生成AIのAPI接続先が海外にある構成は許容されますか。条件も示してください。

**practical_context**: 国内保存条件と外部API利用条件を仕様書に分けて書きたい。

**expected_answer**: API接続先は国内限定ではない。ただしAPI利用時も市のデータが国外に保存されないことが前提。

**primary_category**: D

**difficulty**: medium

**candidate_origin**: EVAL-008を構成の許容性の問いへ変換

**why_repository_may_help**: 保存と接続の異なる範囲を要件行が保持する。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): API接続先は国内に限定しない。
- F2 (2点): 市のデータが国外に保存されないことが前提。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- 国外保存も許容。
- APIは国内必須。
- あらゆる海外処理を無条件許容。

**error_type**

- scope_loss
- factual_error

**repository_evidence**

- data/effective_requirements.csv#EFF-obu-data-location
- claims/CLM-obu-2026-domestic-storage-not-api-endpoint.md

**primary_sources**

- `SRC-obu-2026-qa`: [提出書類に関する質疑書_回答](https://www.city.obu.aichi.jp/_res/projects/default_project/_page_/001/038/173/kaitou.pdf) — PDF p.2、No.22（業務要件一覧No.7を引用）。本文確認 2026-10-01。SHA-256 `3943f9ae50ee0206a007354998318b45a37a51abfe84ccb22ded83cb3d122410`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): API接続先と保存先を区別する。（1点） / 当該市データに適用する条件として述べる。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 海外処理を無条件で許可する一般論へ拡張しない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `obu-2026-genai-service`: case-level `publicly_bounded`; stage: projection行なし＝未確認。
  - roles: specification=reviewed (2026-10-01), qa_amendment=reviewed (2026-10-01), requirement_matrix=source_unavailable (2026-10-01), evaluation=source_unavailable (2026-10-01), result=reviewed (2026-10-01)。

**effective_requirement_state**

- `EFF-obu-data-location`: reviewed; procurement_effective; publicly_reconstructable; 2026-10-01。

**claim_state**

- `claims/CLM-obu-2026-domestic-storage-not-api-endpoint.md`: reviewed; last_verified="2026-10-01"。

## BENCH-V1-011

**question**: 仙台市の令和7年度「生成AI導入実証等業務」で、チャット履歴を蓄積する構成は認められますか。入出力の学習利用・保存に関する条件との関係を整理してください。

**practical_context**: 監査用ログを残しながら、学習利用を防ぐ構成を検討している。

**expected_answer**: 入出力はAIの学習に利用しない。チャット履歴をLLMとは別のサーバーに保存する構成は許容される。

**primary_category**: D

**difficulty**: medium

**candidate_origin**: EVAL-021を構成検討の問いへ変換

**why_repository_may_help**: 非学習と保存の制限を分けた公式解釈を再利用できる。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): 入出力をAIモデル学習に利用しない。
- F2 (2点): LLMとは別のサーバーでチャット履歴を保存する構成が許容。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- どのサーバにも保存不可。
- 学習に使ってよい。
- LLMサーバに無条件で履歴を保存可。

**error_type**

- scope_loss
- amendment_miss

**repository_evidence**

- data/effective_requirements.csv#EFF-sendai-llm-data-use
- sources/SRC-sendai-2025-qa.md

**primary_sources**

- `SRC-sendai-2025-spec`: [仙台市生成AI導入実証等業務委託仕様書（案）](https://www.city.sendai.jp/rikatsuyou/propo/documents/02_ai_shiyosyoan.pdf) — PDF p.4、7(1)②管理機能・③セキュリティ。本文確認 2026-10-01。SHA-256 `4ab4c585b7065ea72f3df50f95b60c4ed723dd99cd87c5d253093abc5db1914c`。
- `SRC-sendai-2025-qa`: [仙台市生成AI導入実証等業務委託に関する質問及び回答](https://www.city.sendai.jp/rikatsuyou/propo/documents/ai_shitsumonkaito.pdf) — PDF p.10、No.29-30。本文確認 2026-10-01。SHA-256 `f5603950703186cfadc11933a11ed85a887d80309211de8abc6276078780d841`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): LLMサーバと別サーバの保存を区別する。（1点） / 公募仕様と質疑の解釈として示す。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 全システムで履歴保存禁止としない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `sendai-2025-genai-pilot`: case-level `publicly_bounded`; stage: projection行なし＝未確認。
  - roles: specification=reviewed (2026-10-01), qa_amendment=reviewed (2026-10-01), requirement_matrix=not_applicable (2026-10-01), evaluation=reviewed (2026-10-01), result=reviewed (2026-10-01), contract_final=not_found_in_reviewed_sources (2026-10-01), procurement_guide=reviewed (2026-10-01)。

**effective_requirement_state**

- `EFF-sendai-llm-data-use`: reviewed; procurement_effective; publicly_reconstructable; 2026-10-01。

**claim_state**

- 独立claimは使用せず、structured rowと原典を用いる。

## BENCH-V1-012

**question**: 焼津市の令和7年度「生成AIサービス提供業務」を参考にRAGの回答ルールを書きたいです。登録した文書の情報と、LLMが学習した一般知識を、回答でどのように扱うよう求めていますか。

**practical_context**: 回答根拠の優先順位と、要求できる抑制の程度を決めたい。

**expected_answer**: 登録データに基づく回答をできる限り優先し、一般知識からの回答を可能な限り抑制する。100%排除は要求していない。

**primary_category**: D

**difficulty**: medium

**candidate_origin**: EVAL-011を回答ルール作成の問いへ変換

**why_repository_may_help**: 絶対条件でないことまで保持したclaimがある。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): 登録データからの回答をできる限り優先。
- F2 (2点): 一般知識の利用は可能な限り抑制し、100%排除ではない。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- 一般知識100%禁止。
- ハルシネーションゼロ保証。
- 登録文書を優先しなくてよい。

**error_type**

- scope_loss
- unsupported_assertion

**repository_evidence**

- data/effective_requirements.csv#EFF-yaizu-rag-grounding
- claims/CLM-yaizu-2025-rag-grounding-not-absolute.md

**primary_sources**

- `SRC-yaizu-2025-qa`: [令和7年度焼津市生成AIサービス提供業務 質疑回答書](https://www.city.yaizu.lg.jp/documents/19797/kaitou.pdf) — PDF p.2、No.7-8（要求機能一覧No.36）。本文確認 2026-10-01。SHA-256 `91187838db80ee819eaed3d51fe5b435e295687920380a859fe08d0f566ccc34`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): RAG環境の回答制御に限る。（1点） / 完全な無誤答保証と区別する。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 抑制の程度を過度に強めたり、無制限に一般知識可としない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `yaizu-2025-genai-service`: case-level `publicly_bounded`; stage: projection行なし＝未確認。
  - roles: specification=reviewed (2026-10-01), qa_amendment=reviewed (2026-10-01), requirement_matrix=source_unavailable (2026-10-01), evaluation=reviewed (2026-10-01), result=reviewed (2026-10-01), contract_final=not_found_in_reviewed_sources (2026-10-01), procurement_guide=reviewed (2026-10-01)。

**effective_requirement_state**

- `EFF-yaizu-rag-grounding`: reviewed; procurement_effective; publicly_reconstructable; 2026-10-01。

**claim_state**

- `claims/CLM-yaizu-2025-rag-grounding-not-absolute.md`: reviewed; last_verified="2026-10-01"。

## BENCH-V1-013

**question**: 仙台市の令和7年度「生成AI導入実証等業務」で、職員向け実証サービスとe-learning教材の対象規模をそれぞれ教えてください。教材の利用期間・利用範囲も確認したいです。

**practical_context**: サービスのアカウント数と研修教材の閲覧人数を別々に積算したい。

**expected_answer**: 実証サービスは約300部署・1部署1アカウントを想定し、共用も職員別発行も許容。教材は庁内LANを使う約7,200職員を想定し、市職員に限定、履行終了後も無償で期間上限を設定しない。

**primary_category**: D

**difficulty**: hard

**candidate_origin**: new

**why_repository_may_help**: 異なるサービス対象をscope付きで分けて参照できる。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): 実証は約300部署、1部署1アカウント想定（個別発行も許容）。
- F2 (2点): 教材想定約7,200名。市職員限定で履行終了後も無償・期間上限なし。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- 実証サービス7,200アカウント必須。
- 300人限定。
- 教材は市民へ無制限に公開。

**error_type**

- scope_loss
- factual_error

**repository_evidence**

- data/effective_requirements.csv#EFF-sendai-account-model
- data/effective_requirements.csv#EFF-sendai-elearning-scope

**primary_sources**

- `SRC-sendai-2025-spec`: [仙台市生成AI導入実証等業務委託仕様書（案）](https://www.city.sendai.jp/rikatsuyou/propo/documents/02_ai_shiyosyoan.pdf) — PDF p.2、6(1)④；p.3、6(2)⑧。本文確認 2026-10-01。SHA-256 `4ab4c585b7065ea72f3df50f95b60c4ed723dd99cd87c5d253093abc5db1914c`。
- `SRC-sendai-2025-qa`: [仙台市生成AI導入実証等業務委託に関する質問及び回答](https://www.city.sendai.jp/rikatsuyou/propo/documents/ai_shitsumonkaito.pdf) — PDF p.4、No.10-11；p.8、No.22；p.15、No.43/45。本文確認 2026-10-01。SHA-256 `f5603950703186cfadc11933a11ed85a887d80309211de8abc6276078780d841`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): 部署・アカウント・教材閲覧人数を区別する。（1点） / 複数職員の共用と職員別発行の双方を許容する。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 想定規模を実利用者数や固定ライセンス数へ変えない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `sendai-2025-genai-pilot`: case-level `publicly_bounded`; stage: projection行なし＝未確認。
  - roles: specification=reviewed (2026-10-01), qa_amendment=reviewed (2026-10-01), requirement_matrix=not_applicable (2026-10-01), evaluation=reviewed (2026-10-01), result=reviewed (2026-10-01), contract_final=not_found_in_reviewed_sources (2026-10-01), procurement_guide=reviewed (2026-10-01)。

**effective_requirement_state**

- `EFF-sendai-account-model`: reviewed; procurement_effective; publicly_reconstructable; 2026-10-01。
- `EFF-sendai-elearning-scope`: reviewed; procurement_effective; publicly_reconstructable; 2026-10-01。

**claim_state**

- 独立claimは使用せず、structured rowと原典を用いる。

## BENCH-V1-014

**question**: おうみ自治体クラウドの2026年公募「生成AIサービス提供事業」を比較表へ載せます。公募年度、契約予定期間、参加市のサービス利用開始予定を、どのように記録すればよいですか。

**practical_context**: 年度別集計と利用開始予定表を作成している。

**expected_answer**: 公示2026年3月2日は2025年度。契約予定期間は2026年4月1日～2027年3月31日。利用開始は原則4月予定、草津市・甲賀市は7月予定で、契約期間と実利用期間は別。

**primary_category**: E

**difficulty**: hard

**candidate_origin**: EVAL-004/023を比較表作成の問いへ統合

**why_repository_may_help**: 公募年度・契約期間・団体別予定を分けた表を再利用できる。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): 公示2026年3月2日、公募年度は2025年度。
- F2 (2点): 契約予定期間2026年4月1日～2027年3月31日。開始は原則4月、草津市・甲賀市は7月予定。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- 公募2026年度。
- 全市4月1日実稼働。
- 草津市は7月1日確定。

**error_type**

- stage_error
- scope_loss
- amendment_miss

**repository_evidence**

- data/case_timeline.csv#oumi-2026-joint-genai
- data/joint_procurement_entities.csv#oumi-2026-joint-genai

**primary_sources**

- `SRC-oumi-2026-guide`: [おうみ自治体クラウド・生成AIサービス提供事業に係る公募型プロポーザル実施要領](https://www.city.omihachiman.lg.jp/material/files/group/115/AI_jisshiyoryo.pdf) — PDF p.3、1.8/2.1(1)；p.9、第5章(5)。本文確認 2026-10-01。SHA-256 `bbbfa5bc3327fa6780ef416ba90f7fc7fb09d2a3f6dc019e282b643893a64852`。
- `SRC-oumi-2026-qa`: [おうみ自治体クラウド・生成AIサービス提供事業 質問回答](https://www.city.omihachiman.lg.jp/material/files/group/115/AI_kaitou.pdf) — PDF p.1、No.3。本文確認 2026-10-01。SHA-256 `4eedfb48b1d56e9396f4fbdb7422bde79d648d184654c11f2a135a79402090e0`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): 契約期間と実利用期間を区別する。（1点） / 予定月を確定日・実績日へ変換しない。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 全市の実利用開始・終了日をこの情報から断定しない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `oumi-2026-joint-genai`: case-level `publicly_bounded`; stage: projection行なし＝未確認。
  - roles: specification=reviewed (2026-10-01), qa_amendment=reviewed (2026-10-01), evaluation=reviewed (2026-10-01), result=reviewed (2026-10-01), procurement_guide=reviewed (2026-10-01), contract_final=not_found_in_reviewed_sources (2026-10-01)。

**effective_requirement_state**

- この問のGoldは要件行を必須とせず、記載した原典・structured rowに基づく。

**claim_state**

- 独立claimは使用せず、structured rowと原典を用いる。

## BENCH-V1-015

**question**: 福島県の令和8年度「生成AIサービス導入支援業務」は、仕様上どの導入段階を目的とする案件ですか。RAGや伴走支援を含むことと、次の導入判断との関係も教えてください。

**practical_context**: 実証向け業務と本格導入向け業務の範囲を分ける参考にしたい。

**expected_answer**: RAG等の有効性・リスク・運用方法を検証する実証。結果を分析して次段階の本格導入の要件・体制・運用ルール等を整理する業務である。

**primary_category**: E

**difficulty**: medium

**candidate_origin**: EVAL-006を導入段階の業務範囲確認へ変換

**why_repository_may_help**: lifecycle解釈を根拠付きで保存している。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): 仕様上は検証（実証）。
- F2 (2点): 実証結果を基に次段階の本格導入に向けた要件等を整理する。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- RAGがあるため本格導入済み。
- 実証効果が実証済み。

**error_type**

- stage_error
- unsupported_assertion

**repository_evidence**

- claims/CLM-fukushima-2026-remains-pilot.md
- data/case_timeline.csv#fukushima-2026-genai-pilot-expansion

**primary_sources**

- `SRC-fukushima-2026-spec`: [生成AIサービス導入支援業務仕様書（案）](https://www.pref.fukushima.lg.jp/uploaded/attachment/734795.pdf) — PDF p.1、3事業の目的；p.3、7(1)；p.4、10(4)。本文確認 2026-10-01。SHA-256 `19e18288a7e340bf27858448bcdaa74becae9b07f1ba67bda9b961837cf8cb42`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): 令和8年度当該仕様の目的として述べる。（1点） / 機能や伴走支援の充実を本格導入完了と同一視しない。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 仕様上の目的と実施結果・現在稼働を分ける。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `fukushima-2026-genai-pilot-expansion`: case-level `not_assessed`; stage: projection行なし＝未確認。
  - roles: specification=reviewed (2026-10-01), evaluation=reviewed (2026-10-01), result=reviewed (2026-10-01), qa_amendment=not_reviewed (2026-10-01)。

**effective_requirement_state**

- この問のGoldは要件行を必須とせず、記載した原典・structured rowに基づく。

**claim_state**

- `claims/CLM-fukushima-2026-remains-pilot.md`: reviewed; last_verified="2026-10-01"。

## BENCH-V1-016

**question**: 北九州市の令和7年度「生成AIサービス提供業務」を参考に応募条件のチェックリストを作りたいです。一般公開の調達資料だけで、応募時に適用された条件を漏れなく確定できますか。確認できる範囲と追加で必要な資料を説明してください。

**practical_context**: 参考仕様を取り込む前に、条件の確認漏れがないか点検している。

**expected_answer**: 完全確定はできない。参加申出者へのメール質問回答を公開資料だけでは追えず、質疑反映後の条件に限界がある。仕様・機能一覧は公募baselineとして参照でき、完全性には質問回答等の確認が必要。

**primary_category**: F

**difficulty**: hard

**candidate_origin**: EVAL-012を自然なチェックリスト作成へ変換し取得状態を再検証

**why_repository_may_help**: 非公開Q&Aの境界を見落とさない。ただし過去のExcel取得不能は再確認が必要。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): 質問回答は参加申出者全員への電子メール回答と定める。
- F2 (2点): 公開baselineだけで質疑反映後の全条件を確定できず、回答本文の確認が必要。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- Q&Aは存在しない。
- 公開仕様が最終有効要件全体。
- Excelが取得不能という古い状態を確認せず現在事実として断定。

**error_type**

- evidence_boundary_error
- unsupported_assertion

**repository_evidence**

- data/review_coverage.csv#kitakyushu-2025-genai-service
- data/effective_requirements.csv#EFF-kitakyushu-public-qa-limit
- sources/SRC-kitakyushu-2025-guide.md

**primary_sources**

- `SRC-kitakyushu-2025-guide`: [令和7年度生成AIサービス提供業務 公募型プロポーザル方式実施説明書](https://www.city.kitakyushu.lg.jp/files/001140147.pdf) — PDF p.3、6(5) 回答方法。本文確認 2026-10-01。SHA-256 `42888975f7d89d107ae4d0a97054e4734d0d8d29f93ccb15199f340adb16efb2`。
- `SRC-kitakyushu-2025-spec`: [令和7年度生成AIサービス提供業務 公募型プロポーザル方式仕様書](https://www.city.kitakyushu.lg.jp/files/001140148.pdf) — PDF p.1、3(1) 別紙2の必須機能。本文確認 2026-10-01。SHA-256 `94a19d5999c68885fbd3a015c575e8ad06dde9ce3f33b195a33407fe161b0a48`。
- `SRC-kitakyushu-2025-page`: [令和7年度生成AIサービス提供業務（公募型プロポーザル）](https://ssl.city.kitakyushu.lg.jp/contents/337_00019.html) — HTML「ダウンロード」資料一覧。今回Excelの取得自体は成功。本文確認 2026-10-01。SHA-256 `64a656d96f8bb5da11aa6c42eabfbaaee9153b38671450f39c1cf2977b6774ff`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): 公開資料からの確認範囲を示す。（1点） / 公開仕様・取得済み機能一覧の個別内容は利用できるが全件の最終性を保証しない。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 公開Q&Aの未確認と変更なし・不存在を区別する。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `kitakyushu-2025-genai-service`: case-level `publicly_bounded`; stage: projection行なし＝未確認。
  - roles: result=reviewed (2026-10-01), procurement_guide=reviewed (2026-10-01), specification=reviewed (2026-10-01), requirement_matrix=source_unavailable (2026-10-01), evaluation=reviewed (2026-10-01), qa_amendment=not_public (2026-10-01)。

**effective_requirement_state**

- `EFF-kitakyushu-public-qa-limit`: reviewed; procurement_baseline; publicly_bounded; 2026-10-01。

**claim_state**

- 独立claimは使用せず、structured rowと原典を用いる。

## BENCH-V1-017

**question**: 仙台市の令和7年度「生成AI導入実証等業務」について、公表された受託者・契約締結日と、契約締結後に確定した要求仕様を分けて教えてください。公開資料でどこまで確認できますか。

**practical_context**: 契約済み案件の要求を参考仕様へ取り込む前に、公募時との違いを確認したい。

**expected_answer**: 受託者はFIXER、契約締結日は2025年6月23日。公募仕様案と公開Q&Aから公募時の条件は追えるが、募集要領は協議変更を認める。確認した案件ページと掲載資料では契約後の最終要求文書は確認できず、最終仕様とは断定しない。

**primary_category**: F

**difficulty**: hard

**candidate_origin**: EVAL-020を契約後の要求調査の問いへ変換

**why_repository_may_help**: 契約日と最終要求の確認範囲を分けて保持している。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): FIXER、契約締結2025年6月23日。
- F2 (2点): 募集要領は委託内容・金額の協議変更を認め、公募資料だけで契約後の最終要求は確定できない。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- 公募仕様案が契約最終仕様。
- 契約後最終文書はどこにも存在しない。
- 契約日だけから実稼働を確認済みとする。

**error_type**

- stage_error
- evidence_boundary_error

**repository_evidence**

- data/effective_requirements.csv#EFF-sendai-contract-final-boundary
- data/review_coverage.csv#sendai-2025-genai-pilot
- sources/SRC-sendai-2025-page.md

**primary_sources**

- `SRC-sendai-2025-page`: [仙台市生成AI導入実証等業務委託に係る公募型プロポーザルの実施について（終了）](https://www.city.sendai.jp/rikatsuyou/propo/ai.html) — HTML「受託者」「募集要領・仕様書等」。本文確認 2026-10-01。SHA-256 `5083c209e9de23850826879dff4e794c011e1bbfd0ab7a45b64c6b938265d5d4`。
- `SRC-sendai-2025-guide`: [仙台市生成AI導入実証等業務委託 公募型提案審査随意契約（プロポーザル）募集要領](https://www.city.sendai.jp/rikatsuyou/propo/documents/01_ai_boshuyoryo.pdf) — PDF p.6、8(1) 契約方法。本文確認 2026-10-01。SHA-256 `1b29600552b3671ed45e80061c75d09261becba073a54f45c6f0d1989e4a6533`。
- `BENCH-SRC-sendai-2025-contract-draft`: [仙台市生成AI導入実証等業務 契約書（案）](https://www.city.sendai.jp/rikatsuyou/propo/documents/03_ai_keiyakushoan.pdf) — PDF p.1、契約番号・業務名・期間・金額・当事者欄が未記入；p.2、第1条。案件ページで契約書（案）としてリンク。本文確認 2026-10-01。SHA-256 `47943035f88f8cf482d33666647c6de275ac22fffbf92fc12c82fd79b7df24c0`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): 公募段階と契約締結の事実を分ける。（1点） / 未発見は確認した公開案件ページ・掲載資料の範囲に限る。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 他の公開先での不存在や現在の実稼働を断定しない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `sendai-2025-genai-pilot`: case-level `publicly_bounded`; stage: projection行なし＝未確認。
  - roles: specification=reviewed (2026-10-01), qa_amendment=reviewed (2026-10-01), requirement_matrix=not_applicable (2026-10-01), evaluation=reviewed (2026-10-01), result=reviewed (2026-10-01), contract_final=not_found_in_reviewed_sources (2026-10-01), procurement_guide=reviewed (2026-10-01)。

**effective_requirement_state**

- `EFF-sendai-contract-final-boundary`: reviewed; contracting_rule; publicly_bounded; 2026-10-01。

**claim_state**

- 独立claimは使用せず、structured rowと原典を用いる。

## BENCH-V1-018

**question**: 北海道の令和8年度「生成AIサービス（RAG）提供業務」のRAG登録数、登録ファイル数・保存容量、使用モデルの条件を教えてください。自庁の仕様の参考にしたいです。

**practical_context**: 容量を積算し、特定モデル名を固定すべきか判断したい。

**expected_answer**: RAG数は上限なし。1つのRAGに700以上の業務ファイルを登録でき、保存容量は全体100GB以上、協議の上必要に応じ増設。LLMは一般的な商用LLMで例示モデルと同等以上の性能・機能、特定製品・モデルには限定しない。

**primary_category**: B

**difficulty**: hard

**candidate_origin**: new

**why_repository_may_help**: 保存済み未取得状態を発見し公式ZIPへ戻る足場になる。古い状態を盲信すると不利になり得る。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): RAG数上限なし、1 RAGに700以上のファイル、全体100GB以上。
- F2 (2点): 一般商用LLMで例示モデルと同等以上、特定製品・モデルに限定しない。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- RAGは30件限定。
- 100GB/職員。
- 例示モデルすべてが必須。
- 原典未取得なのに具体値を補完。

**error_type**

- factual_error
- scope_loss
- evidence_boundary_error

**repository_evidence**

- data/source_documents.csv#SRC-hokkaido-2026-processing-manual
- data/review_coverage.csv#hokkaido-2026-genai-rag-service

**primary_sources**

- `SRC-hokkaido-2026-notice`: [北海道告示第10635号](https://www.pref.hokkaido.lg.jp/fs/1/3/1/1/6/4/7/9/_/%E5%8C%97%E6%B5%B7%E9%81%93%E5%91%8A%E7%A4%BA%E7%AC%AC10635%E5%8F%B7.pdf) — PDF p.1、1(2) 詳細仕様は業務処理要領による。本文確認 2026-10-01。SHA-256 `33f29d810127c303e6eed144c7cd471ea863db86dc98b90d89e67c3370545432`。
- `SRC-hokkaido-2026-processing-manual`: [生成AIサービス（RAG）提供業務 業務処理要領](https://www.pref.hokkaido.lg.jp/fs/1/3/1/1/6/4/7/3/_/%E9%96%A2%E4%BF%82%E6%9B%B8%E9%A1%9E%28%E7%94%9F%E6%88%90AI%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%28RAG%29%E6%8F%90%E4%BE%9B%E6%A5%AD%E5%8B%99%29.zip) — ZIP内「04_業務処理要領（生成AIサービス（RAG））.pdf」PDF p.1-2、4(1)ア；p.3、4(5)エ。本文確認 2026-10-01。SHA-256 `efc4d197e284b993c8ef84a477a74683449894860c08d2d6f0005847129a6959`。
  - ZIP member: `関係書類（生成AIサービス（RAG）提供業務）/04_業務処理要領（生成AIサービス（RAG））.pdf`; member SHA-256 `241f87d885d1e15210af18bc4b6be69ffd142b141eba38e7b9a1dc13edebe38d`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): ファイル数はRAG単位、容量は全体として述べる。（1点） / 容量の増設は協議の上必要に応じて行う。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 公募業務処理要領の値として示し、契約後の実装量・実績を推定しない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `hokkaido-2026-genai-rag-service`: case-level `publicly_bounded`; stage: projection行なし＝未確認。
  - roles: specification=source_unavailable (2026-10-01), qa_amendment=not_assessed (2026-10-01), requirement_matrix=not_assessed (2026-10-01), evaluation=not_applicable (2026-10-01), result=reviewed (2026-10-01), contract_final=not_found_in_reviewed_sources (2026-10-01)。

**effective_requirement_state**

- この問のGoldは要件行を必須とせず、記載した原典・structured rowに基づく。

**claim_state**

- 独立claimは使用せず、structured rowと原典を用いる。

## BENCH-V1-019

**question**: 神戸市の令和8年度「生成AI自動音声応答サービスを活用した税務部電話問合せ改善業務」の公開仕様では、AIが市民への回答をどう作り、回答できない用件をどの単位へ転送する設計ですか。

**practical_context**: 税務の電話対応へAIを入れる際、回答生成と職員転送の条件を参考にしたい。

**expected_answer**: AIは音声・文脈理解に利用するが、回答は市提供FAQを基にした回答データから行い、AIによる回答生成は認めない。転送は個別職員ではなく課・係単位を想定。

**primary_category**: G

**difficulty**: medium

**candidate_origin**: EVAL-013/015を電話導線設計の問いへ統合

**why_repository_may_help**: 業務特化要件を汎用チャットから分けた表がある。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): FAQに基づく回答データを使い、AI回答生成を認めない（理解にはAI）。
- F2 (2点): 個別職員でなく課・係単位への転送を想定。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- AIを使わない。
- 生成AIが自由に回答生成する。
- 担当個人への直接転送が必須。

**error_type**

- scope_loss
- unsupported_assertion

**repository_evidence**

- data/effective_requirements.csv#EFF-kobe-voice-answer-policy
- data/effective_requirements.csv#EFF-kobe-voice-transfer-scope
- claims/CLM-kobe-2026-voicebot-no-generated-answer.md

**primary_sources**

- `SRC-kobe-2026-voicebot-spec`: [生成AI自動音声応答サービスを活用した税務部電話問合せ改善業務 調達仕様書](https://www.city.kobe.lg.jp/documents/83354/shiyosyo.pdf) — PDF p.2、7(2)-(3)；p.3、7(6)。本文確認 2026-10-01。SHA-256 `ff40b66e49ed642d776a4abae1de9ab2cc8a5e59a211cc80d37e2f7283d3548b`。
- `SRC-kobe-2026-voicebot-guide`: [生成AI自動音声応答サービスを活用した税務部電話問合せ改善業務 公募型プロポーザル実施要領](https://www.city.kobe.lg.jp/documents/83354/jisshiyoryo.pdf) — PDF p.3、7(2)オ；p.7、9 文書優先順位。本文確認 2026-10-01。SHA-256 `1c46bba79e1fc2ab4c22664ea8228a545b5d669266d3cc3bd7b8918cf1919bdb`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): AIの理解処理と回答生成を区別する。（1点） / 公開仕様の公募時最低限要件に限る。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 非公開Q&A等があるため契約最終仕様・運用実績としない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `kobe-2026-tax-voicebot`: case-level `publicly_bounded`; stage: projection行なし＝未確認。
  - roles: result=reviewed (2026-10-01), procurement_guide=reviewed (2026-10-01), specification=reviewed (2026-10-01), qa_amendment=not_public (2026-10-01), faq_attachment=source_unavailable (2026-10-01), evaluation=reviewed (2026-10-01), contract_final=not_public (2026-10-01)。

**effective_requirement_state**

- `EFF-kobe-voice-answer-policy`: reviewed; procurement_baseline; publicly_bounded; 2026-10-01。
- `EFF-kobe-voice-transfer-scope`: reviewed; procurement_baseline; publicly_bounded; 2026-10-01。

**claim_state**

- `claims/CLM-kobe-2026-voicebot-no-generated-answer.md`: reviewed; last_verified="2026-10-01"。

## BENCH-V1-020

**question**: 越谷市の令和6年度「生成AIサービス提供等業務」と北海道の令和8年度「生成AIサービス（RAG）提供業務」では、価格は事業者選定にどう使われますか。また、北海道のISO/IEC 27001認証条件は提案への加点ですか。

**practical_context**: 選定基準の案を作るため、価格と認証条件の取り扱いを比較したい。

**expected_answer**: 越谷市はプロポーザルで見積金額30/100点を含む総合評価。北海道は制限付一般競争入札で予定価格以内の最低有効価格による落札。提供予定クラウドのISO/IEC 27001は参加資格であり加点ではない。

**primary_category**: H

**difficulty**: hard

**candidate_origin**: new

**why_repository_may_help**: 異なる選定方式を別テーブルに分けて比較できる。

**gold_verification_status**: primary_sources_checked; independent_second_review_pending

**required_facts（計4点）**

- F1 (2点): 越谷市は価格30/100点を含むプロポーザル評価。
- F2 (2点): 北海道は予定価格内の最低有効価格で落札し、ISO/IEC 27001は提供予定クラウドの参加資格。

**acceptable_variants**

- 意味が同じ自然な日本語・箇条書き・表を認める。文言一致や内部IDの使用は不要。
- 同じ事実と段階を裏付ける別の公式一次資料も認める。

**prohibited_inferences**

- 北海道にも同様の提案配点がある。
- ISO/IEC 27001は加点。
- 方式だけから機能や調達品質の優劣を断定。

**error_type**

- factual_error
- scope_loss

**repository_evidence**

- data/evaluation_criteria.csv#koshigaya-2024-genai-service-training
- data/procurement_structure.csv#hokkaido-2026-genai-rag-service
- data/effective_requirements.csv#EFF-hokkaido-2026-iso27001
- claims/CLM-hokkaido-2026-qualification-not-proposal-score.md

**primary_sources**

- `SRC-koshigaya-2024-guide`: [越谷市生成AIサービス提供等業務公募型プロポーザル開催要領](https://www.city.koshigaya.saitama.jp/kurashi_shisei/jigyosha/dejitaru/files/01_generation-ai-kaisaiyoryo.pdf) — PDF p.3-4、6 選考方法（表：見積金額30点/合計100点）。本文確認 2026-10-01。SHA-256 `10ee9a72f496d37eb5bd8f2e42b8e3ddf4d7c67306708ac06c679d31b9bf36fc`。
- `SRC-hokkaido-2026-notice`: [北海道告示第10635号](https://www.pref.hokkaido.lg.jp/fs/1/3/1/1/6/4/7/9/_/%E5%8C%97%E6%B5%B7%E9%81%93%E5%91%8A%E7%A4%BA%E7%AC%AC10635%E5%8F%B7.pdf) — PDF p.1、2(4)；p.2、10 落札者の決定。本文確認 2026-10-01。SHA-256 `33f29d810127c303e6eed144c7cd471ea863db86dc98b90d89e67c3370545432`。

**scoring_rubric（計10点）**

- factual_correctness (4点): required_facts のF1・F2。各2点。正確2、不完全だが核心正しい1、誤り/欠落0。
- scope_condition (2点): 価格点と最低価格落札を区別する。（1点） / 認証条件をクラウドの資格条件として述べる。（1点）
- evidence_quality (2点): 各F1/F2につき、回答に対応する公式原典への引用・箇所があり支持関係を確認できれば1点。比較問は双方の資料が必要。
- uncertainty_boundary (1点): 配点と価格を自治体・サービスの優劣ランキングへ変換しない。
- no_prohibited_inference (1点): prohibited_inferences を一つも断定しない。

**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**

- `koshigaya-2024-genai-service-training`: case-level `not_assessed`; stage: projection行なし＝未確認。
  - roles: specification=reviewed (2026-10-01), qa_amendment=reviewed (2026-10-01), requirement_matrix=not_applicable (2026-10-01), evaluation=reviewed (2026-10-01), result=reviewed (2026-10-01), contract_final=not_assessed (2026-10-01)。
- `hokkaido-2026-genai-rag-service`: case-level `publicly_bounded`; stage: projection行なし＝未確認。
  - roles: specification=source_unavailable (2026-10-01), qa_amendment=not_assessed (2026-10-01), requirement_matrix=not_assessed (2026-10-01), evaluation=not_applicable (2026-10-01), result=reviewed (2026-10-01), contract_final=not_found_in_reviewed_sources (2026-10-01)。

**effective_requirement_state**

- `EFF-hokkaido-2026-iso27001`: reviewed; procurement_baseline; publicly_bounded; 2026-10-01。

**claim_state**

- `claims/CLM-hokkaido-2026-qualification-not-proposal-score.md`: reviewed; last_verified="2026-10-01"。
