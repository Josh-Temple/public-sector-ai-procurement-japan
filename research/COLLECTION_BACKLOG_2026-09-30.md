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
- Excel「業務要件一覧（1次審査表）」を抽出する。
- 現状のPDF仕様書だけでは、RAG、複数LLM、Web検索等の詳細機能を判定しない。
- Excel「2次審査表」から配点を構造化する。

### 焼津市 2025
- Excel「要求機能一覧」を抽出する。
- PDF仕様書で判定できない詳細機能を補完する。
- 質疑回答には要求機能No.25、No.36、No.46等の解釈が含まれるため、Excel本体と結合して扱う。

### 北九州市 2025
- Excel「機能要件一覧」を抽出する。
- 現仕様書・評価表で確認済みの約7,500人・同時400人・既存RAG移行に、機能要件一覧の詳細を接続する。

### 神戸市 2026 税務部音声応答
- 公募添付資料・別紙から、評価基準やFAQ件数、既存入電分析等を追加抽出する。
- 音声AI要件が他自治体でも複数確認できた段階で共通schema化を検討する。

### 福島県 2025 / 2026
- 質疑回答に仕様解釈上の重要情報がある場合だけ追加する。
- 現時点では仕様書・評価基準の年度比較を基準データとする。

## Priority B — new cases

### 鹿児島県 2026
- 公式仕様書を確認済み。
- GPT-5 / Gemini 2.5 Pro以降の国内リージョン、LGWAN、複数モデル切替等を要求。
- 公募結果の公式一次資料を確認して案件台帳へ登録する。

Official source:
https://www.pref.kagoshima.jp/ac03/jyouhou/documents/126554_20260224091211-1.pdf

### 群馬県情報化推進協議会 2026
- 県内市町村等の共同調達。
- 契約予定団体と団体別上限価格を別紙で管理する方式。
- 最優秀提案者・実契約団体・契約額の公式結果を確認してから案件化する。

Official source:
https://www.pref.gunma.jp/uploaded/attachment/686869.pdf

### 北海道 2026
- 「生成AIサービス（RAG）提供業務」を一般競争入札で調達。
- プロポーザル以外の調達方式比較に有用。
- 入札結果PDFから落札者・価格を抽出し、仕様書を取得する。

Official result index:
https://www.pref.hokkaido.lg.jp/sm/jsk/186926.html

### 上毛町 2026 / 五泉市 2026
- 案件台帳への基本登録は完了。
- 仕様書・評価基準を深掘りして小規模自治体の要求水準を比較する。

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
