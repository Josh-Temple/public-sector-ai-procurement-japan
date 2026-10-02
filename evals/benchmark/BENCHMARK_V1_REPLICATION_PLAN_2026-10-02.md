# BENCHMARK V1 追加反復計画

作成日: 2026-10-02  
状態: 実行前登録。追加runはまだ開始していない。

## 目的

2026-10-01の初回比較は、品質点は固定された一方、Web-onlyの壁時計時間が未計測で、匿名化時にRepository根拠pathの一部が削除されていた。初回結果は変更せず、V1の問題・Gold・rubricをそのまま使って、根拠を保持した追加反復を行う。

この計画はBENCHMARK V1のGold、方法論、問題順生成規則を変更しない。初回結果はpilotとして別掲し、追加runの集計へ混ぜない。

## 固定する基準

- Benchmark commit: ca1e4423290834399ce20db2a574278706b8f155
- Repository-firstの知識commit: 35d66cf710215f251da9809034249de868f6d24e
- Public JSON SHA-256: 4a1d275fff0a2136d4d9c74ccf71fa135fe1102ddbf98bba1f6a289375541868
- Gold JSON SHA-256（Judge用。Runnerへ渡さない）: d720d103e4d90ea881defad42801a7a1501dab852501826e1b7a4bcda02be9b0
- Method SHA-256（Judge/管理者用。Runnerへ渡さない）: b7da2b940825644a0eac7da6f005dd815749eeb36d82583495342db83edf3635
- Web-only用Runner prompt SHA-256: b68e5c5cc3685bf7cc7b85b5ebebd24da8c4d65a00bf013e9a13715df54420e3
- Model/setting: GPT-5.6 Sol / High reasoning。利用できない場合は別モデルに置換せず、その反復を保留して管理者へ報告する。
- 既存runを含めず、完全な追加ペアを3組（R2–R4）実施する。各ペアは20問×2条件。各バッチは独立した新規セッションで実行する。

## 反復順・質問順

同じペア内では、両条件に同じ質問順を使う。質問順は昇順のBENCH IDをPython標準ライブラリrandom.Random(seed).shuffleで並べ替えたもの。

| ペア | seed | 実行順 | 両条件共通の質問順 |
|---|---:|---|---|
| R2 | 20261002 | Web-only → Repository-first | 004, 016, 001, 003, 007, 010, 009, 015, 019, 014, 008, 011, 002, 020, 017, 013, 012, 018, 005, 006 |
| R3 | 20261003 | Repository-first → Web-only | 013, 003, 018, 012, 004, 006, 008, 019, 015, 014, 007, 010, 002, 009, 017, 016, 005, 011, 020, 001 |
| R4 | 20261004 | Web-only → Repository-first | 007, 020, 001, 019, 015, 005, 014, 018, 008, 003, 011, 017, 012, 004, 016, 009, 013, 010, 002, 006 |

条件実行順と質問順は結果を見て変えない。どちらかの条件で汚染・誤閲覧が確認された場合はペア全体を無効として記録し、同じ条件設定で置換ペアを実行する。

## Runnerへの投入

- 各バッチは独立した新規セッションで実行し、過去チャット、Memory、他条件の出力・ログを渡さない。
- Web-onlyには固定commit上のWeb-only Runner prompt本文だけを渡す。GitHub/Repositoryとプロジェクト資料を検索・閲覧しない。
- Repository-firstにはBENCHMARK_V1_PUBLICの問題本文と、方法論にあるRepository-first実行指示だけを渡す。知識Repositoryは上記35d66cfに固定し、evals、後続commit、PR、Issue、他条件の出力へ進まない。
- BenchmarkのGold、QA、Source receipts、Judge用rubricはRunnerに渡さない。
- 取得条件・PDF/Excel/ZIPの手段は両条件で同じにする。取得失敗は試行ごとに記録し、存在しないことと混同しない。
- Runnerは回答、根拠URL・locator、確認限界を返し、操作ログを別に記録する。

## 回答の匿名化と採点順

1. Runner出力を受領時のまま保存する。公式URL、PDFページ・節・質問番号、Repository内部path、source ID、locator、確認限界を削除・要約しない。
2. Judge用コピーでは条件名とmodel名だけを取り除き、各ペア内でランダムにPacket A/Bを割り当てる。対応表は採点終了まで別の非公開管理記録に保持する。
3. 新しい独立Judgeセッションに同一のGold・rubric・公式一次資料・匿名Packetを渡す。観測ログと条件対応は採点が固定されるまで渡さない。
4. Judgeは最初にGoldを確認し、変更が必要な場合はPacketを見る前に理由と影響IDを記録する。Goldを変える場合は両条件に同じ修正rubricを適用する。
5. 問題別・カテゴリ別・全体点とエラー指標を固定し、SCORES_FROZENを記録した後にだけ対応表と観測ログを開示する。

内部pathが条件を示唆する可能性は残る。path自体を消して証拠を失わせるより、同じ基準で公式一次資料・locatorまで追跡して評価し、完全盲検ではない限界を報告する。

## 共通の実測方法

- 同じ監督者の外部時計を使う。UIの「考えた時間」や事後推定は使わない。
- バッチ全体は最初のRunner依頼を送信した時点から最終回答を受領した時点までを計測する。
- Repository-firstはRepository確認・読み込みのsetup秒を別に記録し、setup込み総時間とsetup後時間をともに報告する。setupは総時間から除かない。
- Web-onlyも同じ方法で総時間を計る。監督者が時刻を観測できなかった項目はnot_measuredとする。
- 問題別の開始・確定時刻は、信頼できる共通時計で直接観測できた場合だけ記録する。推定で埋めない。
- query数、fresh openしたユニーク公式文書数、Repository参照ファイル数・内部検索回数、再利用、ダウンロード試行・失敗を別々に記録する。
- 公式文書openとRepositoryファイル参照を単純合算しない。reuseは再利用元event IDを記録する。
- event logの列定義は同梱のBENCHMARK_V1_EVENT_LOG_TEMPLATE.csvを使う。

## 集計と限界

- R2–R4それぞれでblind quality、40単位の一次引用率、エラー件数、検索・取得操作、時間を別々に報告する。
- 各ペアの品質差（Repository-first − Web-only）を示し、3ペアの中央値・範囲も記述する。カテゴリ差と問題差を残す。
- 質問間の依存があるため、20問を独立標本とする有意差検定は行わない。普遍的な性能向上や自治体全体への一般化を主張しない。
- 品質と効率を混ぜた総合点を作らない。
- 2026-10-01の初回blind score 189/200・190/200は履歴として保持する。今回の追加反復はraw citationを保持する別の一連として報告し、初回点と合算しない。
