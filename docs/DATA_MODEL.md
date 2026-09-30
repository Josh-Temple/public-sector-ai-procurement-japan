# Data model

初期段階では、案件を1行で追跡できる最小限のモデルを使う。

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
| budget_ceiling_jpy | 公式HTMLで確認できた上限額。未確認は空欄 |
| contract_amount_jpy | 公式HTMLで確認できた契約額。未確認は空欄 |
| selected_vendor | 公式HTMLで確認できた受託者・優先交渉権者 |
| applicant_count | 公式HTMLで確認できた応募・提案者数 |
| contract_start | YYYY-MM-DD。特定できない場合は空欄 |
| contract_end | YYYY-MM-DD。特定できない場合は空欄 |
| purpose_summary | 公式ページの目的を短く要約 |
| document_bundle | ページ上で存在を確認した添付資料の種類 |
| source_url | 公式一次資料URL |
| source_page_updated | ページ更新日等。確認できない場合は空欄 |
| verification_level | 現時点の確認方法 |
| source_anomaly | 原資料の誤記・不整合等をそのまま記録 |
| collected_at | 収集日 |

## Verification levels

- `official_html_verified`: 公式HTML本文を確認した項目。
- `official_search_result_only`: 公式ページは特定したが本文確認が不十分。
- `attachment_pending`: PDF/Excel/Word等の添付資料の詳細抽出が未実施。

初期コーパスでは、数値や受託者名は原則として `official_html_verified` のものだけを入れる。
