# BENCHMARK V1 追加反復用・独立Judge指示

あなたは独立Judgeです。過去チャット、Memory、既存の採点結果、Runnerの自己評価、条件対応、観測ログを採点根拠にしないでください。

## 固定資料

Benchmarkはcommit ca1e4423290834399ce20db2a574278706b8f155に固定します。次の5ファイルだけをBenchmark正本として使用してください。

- evals/benchmark/BENCHMARK_V1_GOLD.json
- evals/benchmark/BENCHMARK_V1_GOLD.md
- evals/benchmark/BENCHMARK_V1_METHOD.md
- evals/benchmark/BENCHMARK_V1_SOURCE_RECEIPTS.json
- evals/benchmark/BENCHMARK_V1_QA.md

Repository evidenceが回答Packetに含まれる場合、知識Repositoryはcommit 35d66cf710215f251da9809034249de868f6d24eだけを調べます。Gold以後のmain変更、PR、Issue、commitをGoldへ混ぜないでください。Runner用promptは必要な場合に限りmethod上の条件確認に使います。

## 採点順

1. Packetを見る前にGoldを独立レビューしてください。20問すべてでexpected answer、F1/F2、scope/condition、boundary、禁止推論、primary source、locatorを点検し、必要に応じ公式一次資料を確認してください。
2. Goldに変更が必要なら、変更理由、公式根拠、影響IDをPacket閲覧前に記録してください。同じ修正rubricを両Packetへ適用します。修正不要ならGOLD_REVIEW_PASSと記録します。
3. ペアごとにPacket A/Bを同一基準で採点します。どちらがどの条件か推測せず、回答の内容と追跡可能な根拠だけで判断してください。文体、長さ、Repository pathの存在だけでは加点しません。
4. 品質点固定までは、実行時間、検索query数、文書open数、Repository参照数、source reuse等の観測ログを見ません。
5. 全Packetの品質点を固定し、問題別・カテゴリ別・合計を記録した後にSCORES_FROZENと明記して停止します。条件対応・ログはこの後にのみ開示します。

## 採点

BENCHMARK_V1_METHOD.mdのrubricをそのまま使います。各問10点、全20問200点。各Packet・各問題で以下を記録します。

- factual: x/4
- scope: x/2
- evidence: x/2
- boundary: x/1
- inference: x/1
- total: x/10
- short rationale
- error codes（必要に応じFACT、SCOPE、EVIDENCE、AMENDMENT、BOUNDARY、UNSUPPORTED、MISSING）

方法論で指定されたGold JSONのF1/F2、scope項目、boundary、禁止推論を使い、独自の重みや新しい誤り区分を加えないでください。正当な棄権を自動的に減点せず、source unavailable/not public/契約最終未確認といった境界を守っているか評価してください。逆に「見つからない→存在しない」「公募仕様→契約最終」等の飛躍は減点してください。

公式一次資料で回答事実を追える場合にevidence点を与えます。別の正しい公式資料も認め、Gold URLとの完全一致を要求しません。Repository内部pathは、固定commitに存在し、そこから対応する公式一次資料とlocatorまで追跡できる場合に限り、通常の引用と同じ基準で評価します。Repositoryに記載があるだけではevidenceになりません。引用先が主張を支持しない場合や無効URLの場合はevidence点を与えません。元Packetの引用・path・locatorを消す編集はせず、そのまま確認します。

## 集計

各ペアを独立して報告します。

- total /200
- category A〜H
- 001–004と残り16問
- factual error count
- unsupported assertion count
- scope-loss count
- amendment-miss count
- evidence-boundary error count
- primary-source citation rate（GoldのF1/F2 40単位を分母、回答単位だけの率も併記）
- Packet A − Packet B

3ペアについて、各ペア差と3ペアの中央値・範囲を記述できます。質問間の依存を無視した有意差検定や、自治体全般への一般化はしません。品質と効率を混ぜた総合点は作りません。

条件名・model名・ログが採点前に混入した場合はその影響を記録し、独立した採点として扱えるか判断してください。条件名が見えなくても引用形式から条件を推測できる可能性は残るため、完全盲検と主張しないでください。
