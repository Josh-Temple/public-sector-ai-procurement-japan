# Benchmark V1 QA — 2026-10-01

設計者による構造・内容QA。独立した第二レビューではない。両条件のRunner回答は未実施。

## 構造QA

`python evals/benchmark/benchmark_v1.py --check`: PASS。

```json
{
  "status": "PASS",
  "questions": 20,
  "maximum_score": 200,
  "cases": 10,
  "category_counts": {
    "A": 4,
    "B": 2,
    "C": 3,
    "D": 4,
    "E": 2,
    "F": 2,
    "G": 1,
    "H": 2
  },
  "difficulty_counts": {
    "easy": 4,
    "medium": 8,
    "hard": 8
  },
  "case_incidence": {
    "fukushima-2026-genai-pilot-expansion": 1,
    "hokkaido-2026-genai-rag-service": 3,
    "kitakyushu-2025-genai-service": 2,
    "kobe-2026-tax-voicebot": 1,
    "koshigaya-2024-genai-service-training": 3,
    "kyoto-2026-general-genai": 1,
    "obu-2026-genai-service": 1,
    "oumi-2026-joint-genai": 4,
    "sendai-2025-genai-pilot": 3,
    "yaizu-2025-genai-service": 3
  },
  "source_documents": 23,
  "public_sha256": "4b6657d3c3b97d4916ca5be0683786f2f0dc922f7fb7b7ab7b0fdd20e06f09d3",
  "gold_sha256": "d720d103e4d90ea881defad42801a7a1501dab852501826e1b7a4bcda02be9b0",
  "regression_questions": 24
}
```

## 内容QA

- 20問、ID重複なし、全問Goldと全指定フィールドあり。
- 全問に公式一次資料の本文確認・URL・locator・取得hashあり。不足した原典だけを根拠にしたGoldは採用していない。
- 既存10案件のみ。最大登場4問、単純4・中8・難8。新規案件収集はしていない。
- Public JSONはID・question・practical_contextの3キーのみ。Markdownも同じ投影。URL、repoパス、error_type、Gold、ページ/質問番号はない。
- Web-onlyプロンプトはPublic本文を内包し、Gold・カテゴリ・採点項目・資料URLを渡さない。質問で対象を識別する自治体名・年度・案件名は保持する。
- 既存EVALの想定回答をそのまま全問流用せず、統合・実務文脈への変換・単純対照・新しい比較問を追加。内部schema問題を除外。
- 1問10点、40の事実採点単位、同じrubricで両条件を採点。別の公式根拠を認める。
- Web-onlyの露出・検索snippet漏洩、Repository-firstのevals閲覧を禁じ、汚染時はバッチを隔離して新規再実行。
- 固定Repository SHAはBenchmark追加前のmain。RunnerにGoldのあるmainを読ませない。
- PDF内項番差（おうみDeep Research: 仕様エ／Q&Aウ）は原文に合わせGoldへ記録。北九州利用規模はPDF p.2第4項を確認。
- 原典の再取得により古いsource_unavailableとの差を記録。Goldの境界を古い取得失敗に依存させない。
- 既存24 regression eval、調達data・sources・claims・research・件数は変更なし。README/INDEXは参照1行ずつのみ。
- 操作数と時間は後続実行時に観測。今回のGold調査時間をRunner速度として流用せず、未測定はnull。

## 問題別原典確認

| ID | 主カテゴリ | 根拠文書数 | 原典本文・箇所 | 独立再レビュー |
|---|---|---:|---|---|
| BENCH-V1-001 | A | 1 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-002 | A | 1 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-003 | A | 1 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-004 | A | 1 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-005 | B | 2 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-006 | H | 3 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-007 | C | 2 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-008 | C | 2 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-009 | C | 1 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-010 | D | 1 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-011 | D | 2 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-012 | D | 1 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-013 | D | 2 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-014 | E | 2 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-015 | E | 1 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-016 | F | 3 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-017 | F | 3 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-018 | B | 2 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-019 | G | 2 | 確認済み（Goldに記載） | 未実施 |
| BENCH-V1-020 | H | 2 | 確認済み（Goldに記載） | 未実施 |

## 既知の限界

実務者の実質問による妥当性確認、独立Gold再レビュー、両Runnerの実行は未実施。目的抽出・既存コーパス・同案件資料の共有による依存がある。Goldがpublic repoにあるため、厳密なアクセス制御を保証しない。原典全ファイルのdurable snapshotは保存していない。取得手段と索引の変化は再現性に影響する。詳細はMETHODを参照。
