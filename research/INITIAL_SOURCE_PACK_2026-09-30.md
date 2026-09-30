# Initial source pack — 2026-09-30

## Purpose

日本の地方公共団体による生成AI調達について、まず公式HTMLページで確認できる案件を集めた。現段階では添付PDF・Excel・Wordの詳細要件をまだ横断抽出していない。

## Initial corpus

1. 仙台市 — 2025 生成AI導入実証等業務
   - Source: https://www.city.sendai.jp/rikatsuyou/propo/ai.html
   - 上限 2,290,000円、応募12者、受託者 FIXER。
   - RAG実証＋職員研修。

2. 仙台市 — 2026 生成AIサービス導入業務
   - Source: https://www.city.sendai.jp/rikatsuyou/propo/generative-ai.html
   - 上限 5,896,000円、応募8者、受託候補者 ビースポーク。
   - RAG等を会計事務・人事給与事務などの内部事務へ導入。

3. 大府市 — 2026 生成AIサービス導入業務
   - Source: https://www.city.obu.aichi.jp/jigyo/news_jigyo/1038173.html
   - 優先交渉権者 ソフトバンク。
   - 業務要件一覧、一次審査・二次審査資料、仕様書、質疑回答が公開。

4. 焼津市 — 2025 生成AIサービス提供業務
   - Source: https://www.city.yaizu.lg.jp/business/bid-contract/info/proposal/info-00032.html
   - 上限 3,000,000円、優先交渉権者 NTT西日本 静岡支店。
   - 評価基準、要求機能一覧、質疑回答などが公開。
   - 公式HTMLのスケジュールに2024年表記が混在するため、後続処理では原資料誤記として扱う。

5. 京都市 — 2026 汎用的な生成AIサービス提供業務
   - Source: https://www.city.kyoto.lg.jp/sogo/page/0000351116.html
   - 提案4社、第一交渉権者 サテライトオフィス。
   - 詳細要件・上限額は添付資料の精査対象。

6. 神戸市 — 2026 仕様書作成支援クラウドサービス
   - Source: https://www.city.kobe.lg.jp/a69423/business/202602_siyousyosakuseisiensystembosyu.html
   - 上限 10,000,000円、契約額 9,999,000円、応募2者、契約候補者 富士通Japan。
   - 汎用チャットではなく「契約仕様書の作成・チェック」という業務特化型。

7. 埼玉県 — 2026 申請・相談のデジタルサポート
   - Source: https://www.pref.saitama.lg.jp/a0104/seiseiai2026kikakuteian.html
   - 参加7者、委託先候補者 Allganize Japan。
   - 評価基準・評価項目・情報セキュリティ資料まで公開。

8. 西脇市 — 2025 生成AIサービス提供業務
   - Source: https://www.city.nishiwaki.lg.jp/jigyousyamuke/nyusatsukeiyaku/koubogatapuropo/29543.html
   - 4者の評価点を公開、優先交渉権者 イマクリエ。
   - 利用環境構築、ヘルプデスク、利活用支援を業務範囲に含む。

9. 豊岡市 — 2025 生成AIサービス導入業務
   - Source: https://www.city.toyooka.lg.jp/shisei/nyusatsu/kobo/1006384/1033972.html
   - システム環境構築、運用テスト、操作研修、クラウド型生成AI、保守・運用支援を一体で調達。
   - 受託者等は追加確認が必要。

10. 播磨町 — 2025 生成AIサービス提供業務
    - Source: https://www.town.harima.lg.jp/kikaku/chosejoho/proposal/generativeai.html
    - 上限 1,595,000円、5者、優先交渉権者 シフトプラス。
    - 1位422点、2位421点と僅差。

11. おうみ自治体クラウド協議会 — 2026 生成AIサービス提供事業
    - Source: https://www.city.omihachiman.lg.jp/soshiki/joho_seisaku/cloud/nyusatsu/41146.html
    - 草津・守山・湖南・近江八幡・米原・甲賀の6市を対象とする共同調達。
    - 2者、1位 NTTドコモビジネス。

## Early observations

### 1. 同じ「生成AI調達」でも調達単位が分かれる
- 汎用生成AIサービス
- RAGを含む庁内業務支援
- 業務特化型（例：仕様書作成）
- 住民向け申請・相談支援
- 複数自治体による共同調達

単純な「生成AI導入自治体一覧」ではこの違いが消えるため、categoryを保持する。

### 2. 同一自治体の時系列が有用
仙台市では、2025年の実証から2026年の本導入へ移行している。今後は同一自治体の仕様・予算・評価基準・受託者の変化をリンクして追う。

### 3. 評価資料が公開されている案件が多い
仕様書だけでなく、評価基準、要求機能一覧、質疑回答、結果点数まで公開される案件がある。この部分が比較可能になると、単なる検索結果以上の価値が出る。

## Next extraction priority

次は、添付資料から以下を横断抽出する。

1. セキュリティ
   - 入力データの学習利用
   - 国内/国外データ保管
   - ISMS/Pマーク
   - ログ保存
   - LGWAN・閉域対応

2. モデル・機能
   - 利用可能LLM
   - 複数モデル切替
   - RAG
   - ファイル添付
   - Web検索
   - 画像認識
   - 管理者機能

3. 利活用支援
   - 研修
   - プロンプトテンプレート
   - ヘルプデスク
   - 利用分析
   - 活用事例共有

4. 評価方式
   - 機能
   - セキュリティ
   - UI/UX
   - 実施体制
   - 価格
   - トライアル評価
   - 加点・必須要件

5. 調達結果
   - 応募者数
   - 選定事業者
   - 得点
   - 契約額
   - 翌年度継続・再調達
