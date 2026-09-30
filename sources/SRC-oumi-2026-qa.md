---
id: SRC-oumi-2026-qa
title: おうみ自治体クラウド・生成AIサービス提供事業 質問回答
url: https://www.city.omihachiman.lg.jp/material/files/group/115/AI_kaitou.pdf
publisher: おうみ自治体クラウド協議会
source_type: official-qa-amendment
published_at: "2026-03-10"
accessed_at: "2026-10-01"
scope: "おうみ自治体クラウド・生成AIサービス提供事業の仕様変更・解釈"
---

# Source notes

当初仕様書に対する公式質問回答。複数項目で「仕様を緩和」「任意機能」「削除」等が明示されているため、当初仕様単独では有効要件を確定できない。

主な変更:
- LLM: GPT・Gemini・Claudeを含む3種類以上、バージョン不問
- Deep Research: 利用可能または実装予定
- テンプレート: 200種類以上 → 50種類以上
- 自律的エージェント: 必須 → 任意
- セキュリティ認証: 取得済み → 取得済みまたは取得中
- ネットワーク: LGWAN環境のみでも可
- ISMAP: 取得済み/予定の場合に情報提示
- 支払: 月払いのみでも可

利用開始について、原則4月だが草津市・甲賀市は7月開始予定と回答されている。

## Reuse caution

この資料は元仕様を置き換える箇所がある。比較時は data/effective_requirements.csv と合わせて利用し、元仕様の記載だけを「必須」と再利用しない。
