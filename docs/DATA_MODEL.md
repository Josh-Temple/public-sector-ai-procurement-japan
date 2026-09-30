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
| fiscal_year | 主たる公募年度 |
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

公式仕様書から確認した要件の比較用テーブル。

原則:
- `true`: 仕様書で要求を確認した。
- `false`: 仕様書で明示的に不要・非対応等を確認した場合だけ使う。
- `unknown`: 今回確認した資料では判定できない。
- `desirable`: 「望ましい」要件であり必須ではない。

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

## Verification levels

- `official_html_verified`: 公式HTML本文を確認。
- `official_search_result_only`: 公式ページは特定したが本文確認が不十分。
- `verified_from_official_pdf`: 公式PDF本文を確認。
- `verified_from_official_pdf_and_qa`: 公式PDF本文に加え、公式質疑回答で要件解釈を確認。
- `attachment_pending`: 添付資料の詳細抽出が未実施。

数値・要件・事業者名は、確認した公式資料以上に推測して補完しない。

## Cost comparison caution

`budget_ceiling_jpy` と `contract_amount_jpy` は現時点では公式資料に記載された raw amount を保持する。案件によって税込・税抜、初期費用込み、研修別契約、複数団体別契約など条件が異なるため、税区分と対象範囲を正規化するまでは案件間の単純な価格ランキングに使用しない。
