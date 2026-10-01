---
id: CLM-obu-2026-domestic-storage-not-api-endpoint
title: 大府市2026生成AI調達の国内保存要件はAPI接続先の国内限定を意味しない
kind: fact
status: reviewed
scope: "大府市生成AIサービスの導入業務におけるデータ所在要件"
last_verified: "2026-10-01"
evidence:
  - source: SRC-obu-2026-qa
    locator: "Q&A No.22"
---

# Claim

大府市の2026生成AI調達では、市データを国内データセンターに保存し、日本法・日本の裁判管轄を求めているが、生成AIのAPI接続先そのものを国内に限定してはいない。

APIを利用する場合でも、市のデータが国外に保存されないことが前提である。

## Scope limit

このclaimを「海外リージョンでのデータ処理を無条件に許容する」と拡張しない。

確認できるのは、**API接続先の所在地**と**市データの保存場所**を同一要件として扱わない、という案件固有の解釈である。
