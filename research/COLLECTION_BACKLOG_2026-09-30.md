# Collection backlog — 2026-09-30

目的: 次に深掘りする一次資料を、価値と未確認事項が分かる形で管理する。

## Completed in research pass 2

### 焼津市 2025 — evaluation
- 評価基準を `evaluation_criteria.csv` に構造化済み。
- 企画提案65点、要求機能25点、価格10点。
- 利活用支援が20点で、企画提案内では最大の単独配点。

### 北九州市 2025 — evaluation
- 評価方法を `evaluation_criteria.csv` に構造化済み。
- 生成AI環境25点、RAG15点、管理10点、セキュリティ5点等を個別項目へ分解。
- 選定結果はQTnet 381.25/500点、提案者5社を公式ページで確認済み。

### 神戸市 2026 税務部音声応答 — core specification
- 調達仕様書から音声AI固有要件を `data/specialized_requirements.csv` に構造化済み。
- 年25,000件、職員転送2,500件、SMS 5,000件、応答3秒目標等を収録。
- 回答は市提供FAQ由来に限定し、AIによる回答生成は認めないという制御を記録。
- 会話・録音ログ、CSV等エクスポート、部署転送、聞き返し、セキュリティ要件を収録。

### 福島県 2025 / 2026 — specification and evaluation comparison
- 両年度の仕様書を `requirements.csv` に追加済み。
- 両年度の評価基準を `evaluation_criteria.csv` に追加済み。
- `research/FUKUSHIMA_2025_2026_COMPARISON.md` に差分を整理済み。
- 2026年度の履行期限（2027-03-31）を案件台帳へ反映済み。

## Priority A — remaining attachments for existing cases

### 大府市 2026
- 2026-10-01に仕様書・公式質疑・公式結果ページを代表再監査済み。
- `effective_requirements.csv` に11件を追加。国内保存とAPI接続先、認証対象/取得中、論理分離、モデル更新期限、月70Mトークン、RAG範囲、チャンク分割、チューニング、議会専用機能、通知代替を構造化。
- 公告2026-01-28はFY2025のため、案件台帳のfiscal_yearを2025へ修正。仕様上の運用開始は2026-07-01。
- Excel「業務要件一覧（1次審査表）」本文: SOURCE_UNAVAILABLE。公式ページで2026-02-16の数式修正を確認。
- Excel「2次審査表」本文: SOURCE_UNAVAILABLE。
- Excel本体取得後、質疑されていない要件と評価明細を補完する。

### 焼津市 2025
- 2026-10-01に仕様書・公式質疑・評価基準・公式結果ページを代表再監査済み。
- `effective_requirements.csv` に8件を追加。月額固定、トークン追加、GPT-3.5非必須、市全体約900アカウント、履歴検索、Temperature調整、RAG登録データ優先、LLM用語定義を構造化。
- 評価基準上、必須要求機能に対応不可の場合は失格。したがって質疑による必須/任意・許容解釈の確認は選定可否に直結する。
- Excel「要求機能一覧」本文: SOURCE_UNAVAILABLE。
- Excel本体取得後、質問されていない77要求機能を補完する。

### 北九州市 2025
- Excel「機能要件一覧」の存在は公式ページで確認済み。本文は現在の取得経路ではACCESS_UNAVAILABLE。
- PDF仕様書・評価方法から約7,500人・同時400人・既存RAG移行・評価軸は構造化済み。
- 事業者別公開得点5社分をvendor_scoresへ追加済み。
- Excel本体を取得可能な経路ができたら、必須/加点機能の詳細を接続する。

### 神戸市 2026 税務部音声応答
- 公募添付資料・別紙から、評価基準やFAQ件数、既存入電分析等を追加抽出する。
- 音声AI要件が他自治体でも複数確認できた段階で共通schema化を検討する。

### 福島県 2025 / 2026
- 質疑回答に仕様解釈上の重要情報がある場合だけ追加する。
- 現時点では仕様書・評価基準の年度比較を基準データとする。

## Priority B — new cases

### 鹿児島県 2026
- 案件台帳・仕様書要件を登録済み。
- 8,000ユーザ、同時300人、LGWAN、複数LLM、100GB RAG、国内処理等を構造化済み。
- 提案上限8,833,000円（税込）を登録済み。
- 公式の公開選定結果は今回 NOT_FOUND。受託候補者は未記録のまま継続確認する。

### 群馬県情報化推進協議会 2026
- 案件台帳へ登録済み。
- 共同選定後に各参加団体が個別契約する調達構造を `procurement_structure.csv` へ記録済み。
- 団体別上限、LGWAN・研修等のオプション、RAG評価シートを確認済み。
- 二次情報・事業者発表はExa Enterprise AIを示すが、公式公開結果は今回 NOT_FOUND。selected_vendorは未記録。

### 北海道 2025 / 2026
- 2025 RAG実証（公募型プロポーザル）と2026 RAGサービス（制限付一般競争入札）を案件化済み。
- 2025: NTT東日本、21,780,000円、約12,000アカウント、30 RAG以上・100GB以上、LGWANなし。
- 2026: 日立製作所が落札、3社の税抜入札額を `bid_results.csv` に保存済み。
- `research/HOKKAIDO_2025_2026_COMPARISON.md` に方式変更を整理済み。
- 2026詳細業務処理要領は公式ZIP内で、現在の取得経路では ACCESS_UNAVAILABLE。

### 上毛町 2026 / 五泉市 2026
- 仕様書レベルの要件比較を完了。
- 上毛町: 約120名、RAG、国内保存、LLM側不保持、伴走支援、価格5/100点。
- 五泉市: 同時50以上、月1,700万文字、100GB RAG、LGWAN、独自提案・将来性400/1000点。
- 評価基準を `evaluation_criteria.csv` へ追加済み。
- `research/SMALL_MUNICIPALITY_COMPARISON_2026-10-01.md` に比較を整理済み。

## Priority C — schema extensions

Evidenceが十分に集まった後に追加を検討する。

- budget tax basis（tax_included / tax_excluded / unknown）
- contract scope（service only / implementation / training / adoption support）
- RAG capacity / file types / source citation
- model selection policy
- prompt/input data retention
- end-of-contract deletion
- quantitative outcome/KPI
- procurement lifecycle link（pilot → production → renewal）
- multi-municipality membership table
- vendor participation / score table

業務特化型AIは `specialized_requirements.csv` のlong-formでまず収集し、複数案件で共通性が確認できた項目だけ共通schemaへ昇格する。


## Next priority after research pass 5

### 共同調達の参加団体・価格正規化
- おうみ: AI案件の参加6市と、協議会全体の構成8市を区別済み。
- 群馬: 協議会全会員と当該AI調達の契約予定団体を区別する。
- 調達固有の参加団体一覧・団体別上限額を公式一次資料から取得できた時点で、joint procurement member tableを新設する。
- 協議会会員であることだけを根拠に参加扱いしない。

### 五泉市
- 優先交渉権者・次点は公式HTMLで確認済み。
- 事業者別得点が公開されていないか継続確認する。

### 上毛町
- 契約候補者は公式HTMLで確認済み。
- 公開得点が存在する場合のみvendor_scoresへ追加する。


## Research pass 6 updates

### おうみ自治体クラウド 2026
- AI案件の現参加6市について、想定利用者数・同時利用者数・月間文字数・月額上限・初期費・LGWAN-ASP初期費を `joint_procurement_entities.csv` に正規化済み。
- 現参加: 草津、守山、湖南、近江八幡、米原、甲賀。
- 栗東・野洲は令和9年度以降の参加予定として `future_planned` で分離。
- 協議会構成8市をそのまま現参加扱いしない。

### 群馬県情報化推進協議会 2026
- 公募要領で、契約予定団体ごとの上限価格、LGWAN設定・研修オプション、団体別再見積・個別契約を再確認。
- 「契約予定団体一覧」は公式添付として存在することを確認したが、今回の検索経路では本文取得に至らず。
- 団体名・上限価格を二次情報から補完しない。公式別紙取得後に `joint_procurement_entities.csv` へ追加する。

### 京都市 2026
- 公式結果HTMLと募集要項・仕様書を再確認し、`official_html_and_pdf_verified` へ昇格。
- 上限6,600,000円、最大7,000アカウント、月30,000回生成を記録。
- GPT-5/GPT-5 mini 又は Gemini 3 Pro/Gemini 3 Flash相当以上、画像生成、Web検索、マルチモーダル、IP制限、オプトアウト等を要件化。
- RAGはNotebookLM等の既存サービスでニーズを充足しているため、この調達では明示的に要件外。
- 評価基準5項目・公開得点4者分を追加済み。

## Evidence hardening next

- 残る案件の `fiscal_year` は一括で正しいと仮定しない。公告日を取得した案件から `case_timeline.csv` で監査する。
- 次の代表再監査候補は、北九州市（Excel機能要件あり）または神戸市の業務特化AI。新規案件数の拡大より、Source→Q&A→Effective Requirementが別案件でも再利用できるかを優先する。
- `source_unavailable` のExcelは、取得可能経路ができた場合のみ本文を追加し、現在の質疑から推測した未質問項目を埋めない。
