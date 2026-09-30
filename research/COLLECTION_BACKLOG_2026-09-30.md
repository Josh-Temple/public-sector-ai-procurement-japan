# Collection backlog — 2026-09-30

目的: 次に深掘りする一次資料を、価値と未確認事項が分かる形で管理する。

## Priority A — 既存案件の添付資料

### 大府市 2026
- Excel「業務要件一覧（1次審査表）」を抽出する。
- 現状のPDF仕様書だけでは、RAG、複数LLM、Web検索等の詳細機能を判定しない。
- 二次審査表から配点を構造化する。

### 焼津市 2025
- Excel「要求機能一覧」を抽出する。
- PDF仕様書で判定できない詳細機能を補完する。
- 評価基準を `evaluation_criteria.csv` に入れる。

### 北九州市 2025
- Excel「機能要件一覧」を抽出する。
- 評価方法を構造化する。
- 現仕様書で確認済みの約7,500人・同時400人・既存RAG移行に、セキュリティ・RAG詳細を接続する。

### 神戸市 2026 税務部音声応答
- 公開仕様書・評価基準を読み、音声AI固有の要件（同時通話、音声認識、回答制御、有人転送、ログ、個人情報）を抽出する。

### 福島県 2025 / 2026
- 2年分の仕様書・評価基準を並べる。
- 2025の実証から2026のRAG・ガバナンス・全庁定着支援への変更点を抽出する。
- 受託者変更（2025 NTT東日本福島支店 → 2026 電通総研）と要件変更を混同せず記録する。

## Priority B — 新規案件候補

### 鹿児島県 2026
- 公式仕様書を確認済み。
- GPT-5 / Gemini 2.5 Pro以降の国内リージョン、LGWAN、複数モデル切替等を要求。
- 公募結果の公式一次資料を未確認のため、案件台帳への確定登録は保留。

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

schemaは先に増やしすぎず、複数案件で繰り返し確認できた項目から追加する。
