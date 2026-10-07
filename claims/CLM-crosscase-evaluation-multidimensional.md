---
id: CLM-crosscase-evaluation-multidimensional
title: 現在の収集案件では生成AI調達の評価軸は機能以外にも広がっている
kind: interpretation
status: draft
scope: "2026-10-07時点の data/evaluation_criteria.csv に収録された18案件・14発注主体・156評価項目"
last_verified: 2026-10-07
evidence:
  - source: data/evaluation_criteria.csv
    locator: "全156行。18案件・14発注主体の評価項目と配点"
---

# Candidate claim

現在の収集コーパスでは、自治体等の生成AI調達における評価はAI機能だけではなく、回答品質・RAG、UI/UX、セキュリティ、導入・運用・定着支援、事業者の実施能力、価格、追加提案・将来性など複数の軸で構成されている。

また、同じ軸でも配点の重点は案件ごとに大きく異なるため、raw scoreや個別配点を自治体間で単純比較することは適切ではない。

## Why draft

この解釈は `data/evaluation_criteria.csv` の横断集計から得られるが、代表例として埼玉県・おうみ・神戸市（voicebot / Dify）・松江市・五泉市・北海道の公式一次資料を2026-10-07に再照合したが、18案件すべての分類を同じWaveで再監査したわけではないため、statusはdraftのままとする。

reviewedへ昇格する前に、少なくとも複数の代表案件について、元の公式評価基準、CSVへの転記、評価軸の分類、配点の解釈を再確認する。

## Scope limit

このclaimは現在の収集コーパスに関する記述であり、日本の全自治体調達の母集団を代表するとは限らない。
