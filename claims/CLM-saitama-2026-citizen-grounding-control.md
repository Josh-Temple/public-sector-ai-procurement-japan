---
id: CLM-saitama-2026-citizen-grounding-control
title: 埼玉県2026県民向けAI相談は根拠表示と根拠なし時の不明回答を要求する
kind: fact
status: reviewed
scope: "埼玉県2026申請・相談デジタルサポートの公募時有効要件と企画提案評価"
last_verified: "2026-10-03"
evidence:
  - source: SRC-saitama-2026-ai-support-spec
    locator: "PDF file p.5（本文 p.3）、2.3(4)-(5); PDF file p.6（本文 p.4）、P-06〜P-07"
  - source: SRC-saitama-2026-ai-support-qa
    locator: "Q&A No.12"
  - source: SRC-saitama-2026-ai-support-evaluation
    locator: "P-06 40点 / P-07 50点"
---

# Claim

埼玉県の2026「生成AI等による申請・相談のデジタルサポート」では、回答生成時に参照した文書を利用者が確認できること、参照ドキュメントに根拠が見つからない場合は回答が不明であると回答できることを公募時要件としている。

公開Q&Aは、根拠表示が県民向けチャットボットにも適用され、元データや参照したページのリンク等を提示する想定であることを明確化している。

企画提案評価では、ナレッジ表示が40点、根拠がない場合の回答制御・ハルシネーション防止が50点で、合計90/410点がこの2項目に割り当てられている。

## Scope limit

これは公募時の有効要件と評価配点を示す。実運用での正答率、ハルシネーション発生率、最終契約仕様、実装方式の性能を評価するものではない。

また、Q&Aで示された「8〜9割程度の正答率」は評価指標として検討する例であり、固定された最低正答率要件として扱わない。
