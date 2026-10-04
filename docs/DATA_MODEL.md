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

汎用生成AIのwide tableでは表現しにくい、業務特化型AIの要件をlong-formで保持する。収録件数・対象案件は `data/specialized_requirements.csv` を正とする。

| field | meaning |
|---|---|
| case_id | `cases.csv` の案件ID |
| requirement_area | service_scale / answer_policy / speech_nlu / interaction / routing / logging / security / operations など |
| requirement_key | 安定した比較キー |
| value | 公式仕様書から確認した値 |
| unit_or_format | 単位または値形式 |
| requiredness | required / conditional / context |
| applicability_stage | procurement_minimum 等。どの段階の要求事実か |
| public_reconstructability | publicly_bounded 等。公開資料だけで最終状態まで追えるか |
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
| case_id | 対象案件。横断的な発見・探索経路の記録など、特定案件に属さない一次資料は空欄可。値がある場合は `cases.csv` の case_id を参照する |
| document_type | official_specification / official_qa_amendment / official_evaluation / official_result 等 |
| published_at | 公開日。確認できない場合は空欄 |
| retrieved_at | 取得・確認日 |
| version_label | original_spec / qa_amendment / result_page 等 |
| access_state | accessible / source_unavailable 等 |
| original_filename | 取得元のファイル名。HTML等で該当しない場合は空欄 |
| snapshot_hash | 保存したsnapshotの内容hash。原則 `sha256:<hex>`。未保存なら空欄 |
| snapshot_status | external_url_only / snapshot_pending / snapshotted / snapshot_unavailable / not_public |
| snapshot_locator | durable snapshotの所在。公開repoにはsecretやbearer URLを書かない |

URLが同じでも内容変更・削除があり得るため、再取得が重要な一次資料はsnapshot候補として扱う。

- `external_url_only`: 現時点では外部公式URLのみを保持
- `snapshot_pending`: accessibleかつHTTPSの公式URLを持ち、durable snapshotの保存待ち。取得失敗だけで自動的に恒久状態へ変更しない
- `snapshotted`: snapshotを保存し、locatorとhashで同一性を追跡できる
- `snapshot_unavailable`: 権利・技術・取得制約等によりsnapshotを保存できない
- `not_public`: 資料の存在は確認できるが本文が一般公開されておらず、公開取得物のsnapshotを作れない

snapshotは内容の正しさを証明するものではない。将来同じ取得物を再検証できるようにするための保存である。空欄のhashや取得不能なsnapshotを推測して埋めない。

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

`public_reconstructability` は、公開資料だけでその要件状態をどこまで再構成できるかを示す。
- `publicly_reconstructable`: 根拠となる仕様・質疑等が公開され、当該行の状態を公開資料で追跡できる
- `publicly_bounded`: 公開仕様等で最低限の状態は確認できるが、非公開質疑・最終協議・未取得添付等があり契約最終状態までは公開資料だけで確定できない

`applicability_stage` は、どの段階の要件かを分ける。
- `procurement_baseline`: 公募時仕様・最低限要件
- `procurement_effective`: 公開質疑・訂正を反映した応募時の有効要件
- `contracting_rule`: 契約締結時の文書優先順位・決定ルール
- `contract_final`: 契約最終状態を一次資料で確認できた場合のみ

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
- `service_start` / `service_end`: 公開資料で確認したサービス利用の開始・終了日
- `service_fiscal_year_start` / `service_fiscal_year_end`: サービス利用年度
- `date_precision`: 日付の確認精度・予定情報かどうか
- `cases.csv` の `contract_start` / `contract_end` は契約期間を示す。実利用期間と異なる場合があるため、契約期間をサービス列へ転記しない。
- 開始予定が自治体ごとに異なる、または終了日が未確定の場合は、共通の日付を推定せず空欄にし、根拠と予定範囲を `notes` に記録する。

case_id内の年は安定IDの一部であり、年度分析の根拠にしない。

## Unknown / not applicable states

今後の詳細要件では「unknown」を理由別に扱う。

- `not_reviewed`: まだ対象資料を確認していない
- `not_found_in_reviewed_sources`: 必要範囲を確認したが記載を確認できない
- `source_unavailable`: 資料の存在は確認したが取得できない
- `not_public`: 資料の存在・利用は公式資料で確認できるが、本文が一般公開されていない
- `conflicting_sources`: 根拠資料間に未解決の矛盾がある
- `not_applicable`: 当該案件の適用対象外

「未確認」と「存在しない」を同一視しない。

## 13. Procurement stage projection

`data/case_stage.csv`

選定・契約・稼働を別段階として保持する、現在状態確認用のbounded projection。

このテーブルは全案件を自動的に埋めるものではない。各段階を一次資料で個別確認できた案件だけを追加し、未確認段階は `not_verified` のまま保持する。

主な項目:
- `selection_state`: selected_candidate_confirmed / awarded_confirmed / not_verified 等
- `selection_date`
- `selection_source_id`
- `contract_state`: contracted_confirmed / not_verified
- `contract_date`
- `contract_source_id`
- `operation_state`: operating_confirmed / not_verified
- `operation_start`
- `operation_source_id`
- `last_verified`
- `notes`

重要:
- 受託候補者・第一交渉権者の選定を、契約締結済みと読み替えない。
- 契約締結を、サービス稼働中と読み替えない。
- 仕様書上の予定開始日を、実稼働確認日へ変換しない。
- `cases.csv` の `status` は案件の要約であり、current-state質問では本projectionと根拠sourceを優先する。
- rowが存在しない案件は「未確認」であり、「未契約」「未稼働」を意味しない。
- 共同調達で各参加団体が個別契約する場合、case-level の `contract_state` / `operation_state` を団体別状態の単純な代表値として使わない。全団体に共通する状態を一次資料で確認できない限り、case-level は未確認のまま保持する。
- 団体別の契約・稼働証拠が実際に取得され、複数団体で状態差が生じる場合に限って entity-level stage の追加schemaを検討する。未取得の将来要件だけで先にschemaを増やさない。

## 14. Review coverage

`data/review_coverage.csv`

案件ごとに、仕様書・質疑・評価表・結果等のどこまでを確認したかを保持する。

| field | meaning |
|---|---|
| document_role | specification / qa_amendment / evaluation / result 等 |
| source_id | 確認したsource。未確認・未取得なら空欄可 |
| review_state | reviewed / not_reviewed / source_unavailable / not_public / not_applicable / not_found_in_reviewed_sources / conflicting_sources |
| unknown_reason | 未確定理由。review_stateと重複しても分析用に明示 |
| last_verified | その確認範囲を最後に検証した日 |

「仕様書を確認済み」を「案件全体を確認済み」と読み替えない。特に有効要件の判定には qa_amendment の確認状態が重要。
## 15. Evidence coverage projection

`data/evidence_coverage.csv`

`data/review_coverage.csv` を案件単位の横持ち一覧へ変換した**生成projection**。手編集しない。

標準role:
- specification
- qa_amendment
- requirement_matrix
- evaluation
- result
- contract_final

projection固有の状態:
- `not_assessed`: 現行hardeningモデルでそのroleをまだ評価していない。資料が存在しないという意味ではない。
- `not_applicable`: 調達方式や文書構造上、そのrole自体が非該当。例: 価格競争型一般入札の提案評価表、仕様書内に要件を内包し独立要求表がない場合。一次資料で非該当と判断できる場合だけ使う。

`public_reconstructability`:
- `publicly_reconstructable`: 契約最終roleと最終要求の決定ルールまで公開証拠で確認済み（詳しい昇格条件は17節）
- `publicly_bounded`: 監査済みcore roleに not_public / source_unavailable / conflicting_sources がある
- `not_assessed`: 案件単位の再構成可否をまだ判定していない

`assessed_roles` や `reviewed_roles` は進捗管理用の件数であり、自治体・調達の品質点ではない。総合スコアやランキングに変換しない。

生成:
`python scripts/build_evidence_coverage.py`

人間向け一覧:
`docs/EVIDENCE_COVERAGE.md`

## 16. Case evidence summary projection

`data/case_evidence_summary.csv`

案件ごとの確認範囲を、文書roleと選定・契約・稼働の段階を混同せず1行で比較する**生成projection**。手編集しない。

入力:
- `data/cases.csv`
- `data/review_coverage.csv`
- `data/evidence_coverage.csv`
- `data/case_stage.csv`

文書roleについては `*_state` と `*_source_id` を対にし、仕様・質疑・評価・結果・契約最終状態の確認状況から根拠Sourceへ直接辿れるようにする。

選定・契約・稼働については `case_stage.csv` の確認済み状態だけを投影する。case_stageのrowが存在しない案件は `not_assessed` とし、「未選定」「未契約」「未稼働」とは解釈しない。

このprojectionでは次を推論しない:
- `cases.csv` の selected / awarded から契約締結済みを推論しない。
- 契約期間・予定開始日から実稼働を推論しない。
- review role数やblocker数を品質スコアへ変換しない。
- `publicly_bounded` を調達品質の否定として扱わない。

生成順序:
`python scripts/build_evidence_coverage.py && python scripts/build_case_evidence_summary.py`

人間向け一覧:
`docs/CASE_EVIDENCE_SUMMARY.md`

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


## 17. Evidence coverage and public reconstructability

`data/evidence_coverage.csv` と `docs/EVIDENCE_COVERAGE.md` は `scripts/build_evidence_coverage.py` による生成物で、直接編集しない。

個々の `effective_requirements.csv` 行にある `public_reconstructability` は、その行の適用段階に限る。公募仕様と公開Q&Aから公募時の有効要件を再構成できる行は `publicly_reconstructable` でも、契約最終状態まで追えたことを意味しない。

case-level の `public_reconstructability` は契約最終状態までの再構成可能性を示す。6つの標準roleが確認済み (`reviewed`) または根拠ある非該当 (`not_applicable`) で、`contract_final` が `reviewed`、かつ `effective_requirements.csv` に公開最終要求を示すレビュー済み `contracting_rule` 行がある場合のみ `publicly_reconstructable` とする。公開された公募stage要件のみでは十分でない。

既知の欠落・アクセス制約・公開されていない資料・未解決矛盾がある場合は `publicly_bounded` とする。契約最終roleが `not_assessed` の場合は `not_assessed` のままとし、資料がないと解釈しない。role別状態の詳しい意味は `docs/EVIDENCE_COVERAGE.md` と `AGENTS.md` を参照。

## Structural integrity checks

`python3 scripts/validate_repository.py` rejects duplicate keys (including case/vendor, case/bidder and case/entity), malformed CSV rows/headers, missing case IDs outside the Source registry, unknown or cross-case Source references, reviewed amendments without change locators, and snapshot locators inconsistent with the Source ID/hash. Projection regeneration and publication checks are separate CI steps; structural PASS does not establish semantic correctness or currentness.
