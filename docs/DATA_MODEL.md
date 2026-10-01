# Data model

本リポジトリは、案件のライフサイクルと、仕様・評価の詳細を分けて記録する。

## 1. Cases

`data/cases.csv`

案件単位の基本情報。

| field | meaning |
|---|---|
| case_id | 安定した案件ID |
| government_name | 発注主体 |
| government_type | prefecture / city / town / joint_municipal |
| prefecture | 都道府県 |
| fiscal_year | 公募年度（日本の年度）。移行中のlegacy summary field。日付精度が必要な分析では `case_timeline.csv` を優先し、case_idの年から推定しない |
| procurement_title | 公式案件名 |
| category | 調達対象の大分類 |
| procurement_method | 公募・選定方式 |
| status | awarded / selected / open / closed など |
| budget_ceiling_jpy | 公式資料で確認できた上限額。未確認は空欄 |
| contract_amount_jpy | 公式資料で確認できた契約額。未確認は空欄 |
| selected_vendor | 公式資料で確認できた受託者・優先交渉権者 |
| applicant_count | 公式資料で確認できた応募・提案者数 |
| contract_start | YYYY-MM-DD。特定できない場合は空欄 |
| contract_end | YYYY-MM-DD。特定できない場合は空欄 |
| purpose_summary | 公式資料の目的を短く要約 |
| document_bundle | 存在を確認した添付資料の種類 |
| source_url | 公式一次資料URL |
| source_page_updated | ページ更新日等。確認できない場合は空欄 |
| verification_level | 現時点の確認方法 |
| source_anomaly | 原資料の誤記・不整合等をそのまま記録 |
| collected_at | 収集日 |

## 2. Requirements

`data/requirements.csv`

横断比較のためのprojectionテーブル。公式仕様書だけでなく、後続の質問回答・訂正等で変更された場合は**有効要件へ更新する**。変更履歴の正本は `data/effective_requirements.csv` と根拠sourceで管理する。長期的には詳細要件から再生成可能なprojectionへ移行する。

原則:
- `true`: 仕様書で要求を確認した。
- `false`: 仕様書で明示的に不要・非対応等を確認した場合だけ使う。
- `unknown`: 今回確認した資料では判定できない。
- `desirable`: 「望ましい」要件であり必須ではない。
- `optional`: 任意機能。
- `planned_acceptable`: 現時点で未実装でも、実装予定を示せば要件上許容される。
- `allowed_alternative`: 原要件以外の代替条件が公式に許容された。

これらは比較projection上の簡略表現であり、詳細な変更内容は `effective_requirements.csv` を確認する。

同じ概念でも、ネットワーク環境にLGWAN回線が存在することと、LGWAN-ASP利用をサービス要件として求めることは分ける。

## 3. Evaluation criteria

`data/evaluation_criteria.csv`

評価項目を1行1基準として保持する。

| field | meaning |
|---|---|
| criterion_id | 案件内で一意の評価項目ID |
| criterion_group | 評価表上の大分類 |
| criterion_summary | 評価内容の要約 |
| points | 配点 |
| total_points | 評価表全体の満点 |
| assessment_stage | 書類・面接・事務局審査など |
| source_url | 公式評価表URL |

## 4. Requirement facts

`data/requirement_facts.csv`

要求機能一覧、質疑回答、補足資料などから確認できた細粒度の要件を1要件1行で保持する。wide tableの `requirements.csv` は横比較用の要約であり、詳細根拠はこのテーブルへ分離する。

| field | meaning |
|---|---|
| requirement_no | 原資料上の項番。複数項目にまたがる場合は 52/56 等 |
| requirement_area | rag / model / security / usage / operations / adoption 等 |
| requirement_key | 比較に使う安定キー |
| value | 公式資料から確認した内容 |
| requiredness | required / optional / context |
| evidence_type | official_qa / official_attachment 等 |
| source_url | 公式一次資料URL |
| notes | 解釈上の留保 |

Excel本文が現在の実行環境で取得できない場合でも、公式質疑回答によって該当項番の内容・解釈が確認できるものは `official_qa` として収録する。Excel未取得をExcel全体の検証済み扱いにはしない。

## 5. Specialized requirements

`data/specialized_requirements.csv`

汎用生成AIのwide tableでは表現しにくい、業務特化型AIの要件をlong-formで保持する。現在は神戸市の税務ボイスボットを収録している。

| field | meaning |
|---|---|
| case_id | `cases.csv` の案件ID |
| requirement_area | service_scale / answer_policy / speech_nlu / interaction / routing / logging / security / operations など |
| requirement_key | 安定した比較キー |
| value | 公式仕様書から確認した値 |
| unit_or_format | 単位または値形式 |
| requiredness | required / conditional / context |
| source_document | 公式資料名 |
| source_url | 公式一次資料URL |

業務特化型AIのためにwide tableへ多数の固有列を追加せず、複数案件で共通性が確認できた項目だけ将来の共通schemaへ昇格する。

## 6. Vendor scores

`data/vendor_scores.csv`

公式の選定結果で公開されている事業者別得点を保持する。匿名事業者は公表表記（A社等）のまま保存し、推定で実名を補完しない。

| field | meaning |
|---|---|
| vendor_label | 公表資料上の事業者ラベル |
| vendor_name | 実名公表時のみ記録 |
| stage1_score | 一次審査得点。未公表は空欄 |
| stage2_score | 二次審査得点。未公表は空欄 |
| total_score | 公表された総合得点 |
| total_score_max | 当該公表得点の満点 |
| rank | 公表順位 |
| selected | 選定事業者か |

得点方式は自治体ごとに異なる。焼津市は選定委員の平均点、北九州市は審査委員5名の合計500点満点、大府市は一次400点＋二次350点である。異なる方式のraw scoreをそのまま自治体間ランキングには使わない。

## 7. Procurement structure

`data/procurement_structure.csv`

AI機能とは別に、買い方そのものを比較する。共同調達や一般競争入札を通常のプロポーザルと混同しないためのテーブル。

共同調達では、協議会・共同組織の全構成団体と、個別案件に実際に参加する団体を区別する。組織の会員一覧だけから案件参加団体を推定しない。

| field | meaning |
|---|---|
| buyer_scope | single_prefecture / multi_entity_joint など |
| selection_method | public_proposal / restricted_general_competitive_bid など |
| award_basis | 総合評価、最高評価点、最低有効価格等 |
| contracting_model | 単独契約、共同選定後の団体別契約等 |
| pricing_basis | 上限額・団体別上限・税抜入札額等の扱い |
| lifecycle_stage | pilot / production_service / unknown など。共同調達かどうかは buyer_scope / contracting_model で表し、lifecycleと混同しない |

## 8. Bid results

`data/bid_results.csv`

一般競争入札等で公開される入札額を保存する。プロポーザルの評価得点とは別テーブルとする。

| field | meaning |
|---|---|
| bidder_label | 公式結果上の表記 |
| bidder_name | 実名公表時のみ記録 |
| bid_amount_jpy | 公式結果に記載されたraw bid |
| tax_basis | tax_excluded_bid / tax_included_bid / unknown |
| rank | 入札結果上の順位 |
| selected | 落札者か |

税抜入札額から税込契約額を計算して `contract_amount_jpy` に補完しない。公式契約額が別途確認できた場合のみ案件台帳へ記録する。

## 9. Joint procurement entities

`data/joint_procurement_entities.csv`

共同調達における案件固有の参加団体・利用規模・団体別上限を保持する。協議会等の一般的な構成団体一覧とは分離する。

| field | meaning |
|---|---|
| participation_status | current / future_planned |
| expected_users | 当該案件での想定利用者数 |
| concurrent_users | 想定同時利用者数 |
| monthly_characters | 月間想定文字数 |
| monthly_ceiling_jpy | 月額上限 |
| initial_setup_ceiling_jpy | 初期構築費上限 |
| lgwan_setup_ceiling_jpy | LGWAN-ASP等の初期費上限 |
| contract_model | 基本契約＋団体別利用契約等 |

公式資料上の「－」は0円と推定せず空欄＋notesで保持する。将来参加予定団体をcurrent参加団体へ数えない。

## 10. Source documents

`data/source_documents.csv`

比較値が依存する公式文書を文書単位で識別する。

| field | meaning |
|---|---|
| source_id | 安定したsource ID |
| case_id | 対象案件 |
| document_type | official_specification / official_qa_amendment / official_evaluation / official_result 等 |
| published_at | 公開日。確認できない場合は空欄 |
| retrieved_at | 取得・確認日 |
| version_label | original_spec / qa_amendment / result_page 等 |
| access_state | accessible / source_unavailable 等 |
| snapshot_hash | 内容hash。まだ取得していない場合は空欄 |
| snapshot_status | external_url_only / snapshotted 等 |

URLが同じでも内容変更があり得るため、将来は取得本文のhashとsnapshotを追加する。空欄のhashを推測しない。

## 11. Effective requirements

`data/effective_requirements.csv`

当初仕様と、その後の質問回答・訂正・補足による変更を明示的に接続する。

主な項目:
- `original_status` / `original_value`
- `effective_status` / `effective_value`
- `change_type`
- `base_source_id`
- `changed_by_source_id`
- `base_locator` / `change_locator`
- `scope` / `condition`
- `review_status`

有効要件の代表status:
- `required`
- `desirable`
- `optional`
- `required_or_planned`
- `required_or_in_progress`
- `allowed_alternative`
- `optional_disclosure`
- `removed`
- `not_applicable`
- `context`: 値の必須/任意ではなく、用語定義や適用範囲そのものを示す

後続の公式質問回答が「仕様変更」「緩和」「削除」等を明示した場合、元仕様をそのまま現行要件として扱わない。

`change_type` は置換だけでなく、質疑による意味の具体化も表す。例:
- `relaxed`: 必須条件を緩和
- `clarified_scope`: 対象範囲を明確化
- `allowed_interpretation`: 特定の実装・解釈を許容
- `allowed_alternative`: 代替手段を許容
- `threshold_defined`: 数値・期限を具体化
- `clarified_strict`: 同等目的の代替では足りない等、要件を厳密化
- `clarified_feasibility`: 100%等の絶対条件ではなく実現可能な範囲を明確化
- `clarified_definition`: 用語の意味を限定

Q&Aに「変更」という語がなくても、応募可否・評価解釈を変える回答はeffective requirementとして保持できる。

## 12. Case timeline

`data/case_timeline.csv`

公募日・公募年度と、サービス提供年度を分離する。

- `announcement_date`: 公告日
- `announcement_fiscal_year`: 公告日の日本の会計年度
- `service_start` / `service_end`: 履行・サービス期間
- `service_fiscal_year_start` / `service_fiscal_year_end`: サービス年度
- `date_precision`: 日付の確認精度

case_id内の年は安定IDの一部であり、年度分析の根拠にしない。

## Unknown / not applicable states

今後の詳細要件では「unknown」を理由別に扱う。

- `not_reviewed`: まだ対象資料を確認していない
- `not_found_in_reviewed_sources`: 必要範囲を確認したが記載を確認できない
- `source_unavailable`: 資料の存在は確認したが取得できない
- `conflicting_sources`: 根拠資料間に未解決の矛盾がある
- `not_applicable`: 当該案件の適用対象外

「未確認」と「存在しない」を同一視しない。

## 13. Review coverage

`data/review_coverage.csv`

案件ごとに、仕様書・質疑・評価表・結果等のどこまでを確認したかを保持する。

| field | meaning |
|---|---|
| document_role | specification / qa_amendment / evaluation / result 等 |
| source_id | 確認したsource。未確認・未取得なら空欄可 |
| review_state | reviewed / not_reviewed / source_unavailable / not_found_in_reviewed_sources / conflicting_sources |
| unknown_reason | 未確定理由。review_stateと重複しても分析用に明示 |
| last_verified | その確認範囲を最後に検証した日 |

「仕様書を確認済み」を「案件全体を確認済み」と読み替えない。特に有効要件の判定には qa_amendment の確認状態が重要。
## Verification levels

- `official_html_verified`: 公式HTML本文を確認。
- `official_search_result_only`: 公式ページは特定したが本文確認が不十分。
- `verified_from_official_pdf`: 公式PDF本文を確認。
- `verified_from_official_pdf_and_qa`: 公式PDF本文に加え、公式質疑回答で要件解釈を確認。
- `verified_from_official_pdf_and_html`: 公式PDF本文と公式HTML本文を組み合わせて確認。
- `official_pdf_verified_result_pending`: 公募・仕様等は公式PDFで確認したが、選定結果の公式公開を確認できていない。
- `official_html_and_pdf_verified`: 公式HTMLの結果と公式PDFの公募・仕様資料を確認。
- `attachment_pending`: 添付資料の詳細抽出が未実施。

数値・要件・事業者名は、確認した公式資料以上に推測して補完しない。

## Cost comparison caution

`budget_ceiling_jpy` と `contract_amount_jpy` は現時点では公式資料に記載された raw amount を保持する。案件によって税込・税抜、初期費用込み、研修別契約、複数団体別契約など条件が異なるため、税区分と対象範囲を正規化するまでは案件間の単純な価格ランキングに使用しない。
