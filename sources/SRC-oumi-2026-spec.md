---
id: SRC-oumi-2026-spec
title: おうみ自治体クラウド・生成AIサービス提供事業 仕様書
url: https://www.city.omihachiman.lg.jp/material/files/group/115/AI_Shiyousyo2.pdf
publisher: おうみ自治体クラウド協議会（近江八幡市公開）
source_type: official-specification
accessed_at: "2026-10-01"
scope: "おうみ自治体クラウド・生成AIサービス提供事業の公募時仕様・最低限機能"
---

# Source notes

公募時の当初仕様書。後続の公式質問回答で複数要件が変更されているため、変更対象はこのSource単独で有効要件を確定しない。

## Evidence locators

- PDF p.3、7(4)ユーザー機能 イ・ウ: RAGを本サービスの機能として要求。庁内データの登録・参照・共有と、参加団体ごとの容量要件を確認する箇所。
- 同箇所: 参加団体ごとに全利用者合計100GB以上のRAG容量を要求。
- Deep Research等、後続Q&Aで変更された項目は `SRC-oumi-2026-qa` と合わせて確認する。

## Reuse caution

RAGの必須性・容量は元仕様のbaselineである。2026-03-10の公開Q&A全体を確認した範囲ではRAG自体を任意化・削除する変更は確認されていない。一方、LLM、Deep Research、テンプレート、自律的エージェント等には明示的な変更があるため、それらを元仕様だけから再利用しない。
