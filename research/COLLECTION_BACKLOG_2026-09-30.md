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
- 2026-10-01に公式ページ・実施説明書・仕様書・評価方法を代表再監査済み。
- 公告2025-04-21、約7,500人、同時約400人、既存RAG移行、評価軸を確認。
- `effective_requirements.csv` に公開baseline 4件を追加。
- Excel「機能要件一覧」本文: SOURCE_UNAVAILABLE。仕様上、同一覧の「必須」を全て満たす必要がある。
- 質問回答は参加申出書提出者へのメール配布で NOT_PUBLIC。公開資料だけでは応募時の最終有効要件を完全再構成できない。
- 取得可能な一次資料が増えるまで、公開baselineをcontract-finalへ昇格しない。

### 神戸市 2026 税務部音声応答
- 2026-10-01に公式結果・実施要領・仕様書を代表再監査済み。
- 公募開始2026-02-17はFY2025、事業開始予定はFY2026としてtimeline分離。
- 評価基準6項目（100点）・公開得点3社を構造化。
- AIによる回答生成は禁止し、市FAQ由来の回答データを利用する境界をreviewed claim化。
- 質問回答は参加者メール配布で NOT_PUBLIC。
- 契約時の優先順位は質問回答→仕様書→企画提案書。ただし上位提案部分は提案書が優先し得るため、公開仕様だけではcontract-finalを完全再構成できない。
- specialised requirement 21行は `procurement_minimum / publicly_bounded` として段階を明示。
- FAQデータExcel本文は SOURCE_UNAVAILABLE。

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


## Evidence hardening after research pass 8

- 次の焦点は案件数ではなく、case単位の「証拠完全性」を誤解なく要約できるか。
- 候補軸: specification / Q&A / requirement matrix / evaluation / result / contract-final の各確認状態。
- ただし一つの総合「成熟度スコア」にはしない。欠落理由（not_reviewed / source_unavailable / not_public）を保持する。
- 公開資料のみでcontract-finalを再構成できない案件では、AI回答が自動的に範囲限定されるかを回帰評価する。


## Evidence hardening after research pass 10

### 北海道 2026
- 制限付一般競争入札として再監査。
- 公式告示・入札結果はreviewed。
- 詳細仕様の正本である業務処理要領は公式ZIP内だが SOURCE_UNAVAILABLE。
- qualitative proposal evaluation は調達方式上 NOT_APPLICABLE。ISO/IEC 27001は加点ではなく入札参加資格。
- 質問回答・契約最終文書は今回 NOT_ASSESSED。
- 2025実証の仕様を2026本調達へ流用しない。

### 越谷市 2024
- 仕様書・公開Q&A・開催要領・審査結果を代表再監査済み。
- 独立要求機能表はなく、仕様書4章に必須要件・提案事項を内包するため requirement_matrix は NOT_APPLICABLE。
- 月100万文字以上は必須、上限なしは加点提案。
- モデル固定指定なし、問い合わせ時間差異は提案書記載で評価可能、提案事項も契約限度額内。
- KGI 20%削減は業務成否を規定する検収条件ではない。
- 評価5項目（100点）・公開得点2社を構造化。
- 契約最終文書は今回 NOT_ASSESSED。

### Coverage model
- `not_applicable` を追加。
- 未探索をnot_applicableで埋めず、調達方式・文書構造から一次資料で非該当と確認できた場合のみ使用する。


## Evidence hardening after research pass 12 — 2026-10-01

### Completed: Yaizu 2025 contract-draft boundary (pass 11)
- Fresh-read the official project page, procurement guide, and linked contract draft.
- The guide allows partial changes to the draft agreement and specification during negotiation. The public contract file remains an unfilled draft; contract-final requirements were not found in the reviewed scope.
- Recorded contract_final=not_found_in_reviewed_sources; this does not claim that a final contract or specification does not exist elsewhere.
- Kept the requirement-matrix workbook at source_unavailable. Public Q&A clarifications for selected items do not reconstruct the unavailable matrix as a whole.

### Completed: Sendai 2025 public-Q&A and contract-final audit (pass 12)
- Fresh-read the official case page, procurement guide, specification draft, public Q&A, and evaluation criteria.
- Mapped the public Q&A into 15 procurement-effective requirement records. These include optional ordinary chat, approximately two months of actual service use within a longer contract period, accepted account patterns, non-fixed usage estimates, strict training conditions, log alternatives, domestic LLM region, separate-server chat history, and mandatory links to RAG source files.
- Published selection and contract execution are recorded separately from final requirements. The public review scope did not yield a post-contract final specification or signed requirements; contract_final=not_found_in_reviewed_sources.
- Corrected the announcement fiscal year to FY2024 (announcement 2025-03-25); contract/service year is FY2025. Actual two-month service-use dates remain unknown and blank.
- Added 17 evaluation criteria (150 points) and procurement structure. No applicant-level score was inferred.

### Projection and QA
- Updated the evidence coverage generator so case-level publicly_reconstructable requires complete standard-role review plus reviewed public contract-final requirement evidence. Procurement-stage effective rows alone do not imply final-state reconstruction.
- not_assessed remains distinct from absent evidence; prior Pass 9 Oumi/Koshigaya aggregate labels are historical and superseded.
- Current case count remains 26. The next high-value audit is Oumi 2026 joint procurement: locate official council/member-municipality contract or final-service documents; until then keep contract_final=not_assessed.
- No schema columns were added. A nullable source case_id remains reserved for cross-case discovery/context sources; any populated value must resolve to a registered case.


## Completed in research pass 13 — Oumi 2026 contract-final boundary
- Freshly reviewed the official result page, RFP guide, specification, public Q&A, and evaluation sheet.
- The guide says the service specification is prepared after negotiation and each participating city makes its own use contract; the listed package contains no signed basic/city agreement or negotiated final specification.
- Set `contract_final=not_found_in_reviewed_sources` for that bounded search scope; case-level public reconstruction is `publicly_bounded`, not `reviewed`.
- Corrected the timeline: 2026-04-01 through 2027-03-31 is the contract period, not a shared actual service-use period. Q&A's planned April start (July for Kusatsu and Koka) is retained as planned timing, with no inferred end date.
- Remaining high-value work: locate an official signed/basic or city-level service agreement or post-negotiation specification if one is later published. Member-site searches so far are discovery only and were not exhaustive.


## Completed in research pass 14 — Hokkaido 2026 general bid
- Re-read the official bid page, notice and bidder/result PDF.
- Confirmed a restricted general competitive bid, with price award, contract-writing requirement and three bid amounts. Proposal evaluation is `not_applicable`; this does not make contract-final review not_applicable.
- The official page's related-document ZIP could not be retrieved through the current route; the detailed official operating manual remains `source_unavailable`.
- No signed contract or final requirement document was found on the reviewed official public pages. Set contract_final to scoped `not_found_in_reviewed_sources` and preserve case-level `publicly_bounded`.
- Next value: obtain the ZIP through another supported official route or locate a signed final document for one of the remaining cases.
