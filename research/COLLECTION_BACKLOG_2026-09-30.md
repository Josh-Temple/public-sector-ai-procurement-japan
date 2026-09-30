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
- Excel「業務要件一覧（1次審査表）」本文: ACCESS_UNAVAILABLE（現在の実行環境）。
- Excel「2次審査表」本文: ACCESS_UNAVAILABLE（現在の実行環境）。
- 公式実施要領・質疑回答から項番付き要件を22件の細粒度データの一部として回収済み。
- RAG、月70,000,000トークン、モデル更新、議会対応、閾値通知等は質疑回答で確認済み。
- Excel本体を取得可能な経路ができたら、未質問項目と配点明細を補完する。

### 焼津市 2025
- Excel「要求機能一覧」本文: ACCESS_UNAVAILABLE（現在の実行環境）。
- 公式質疑回答からNo.7、10、11、23、25、36、46/47等の意味を回収済み。
- RAGの登録データ優先、Temperature等の調整、履歴検索、トークン追加等を細粒度データへ反映済み。
- Excel本体を取得可能な経路ができたら、質問されていない要求機能を補完する。

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
