# public-sector-ai-procurement-japan

日本の公共部門におけるAI調達を、公式一次資料から収集・構造化するためのリポジトリです。

## Scope

当面は、日本の地方公共団体（都道府県・市区町村・共同調達組織）による生成AI関連の調達を対象にします。

単なる「導入事例集」ではなく、可能な範囲で次のライフサイクルをつなげます。

```
企画 → 公募 → 要求仕様 → 評価基準 → 質疑 → 選定 → 契約 → 導入 → 効果検証 → 更新
```

## Principles

- 公式一次資料を優先する。
- 確認できない項目は推測で埋めず空欄にする。
- HTMLで確認した事実と、PDF・Excel等から後で抽出する詳細を分ける。
- 同一自治体の年度間変化を追えるよう、案件単位で記録する。
- 出典URLと収集日を必ず保持する。
- 原資料の誤記と考えられる箇所も勝手に修正せず、注記して保持する。

## Current status

2026-09-30 に初期コーパスを作成。まず公式HTMLページで確認できた生成AI調達案件を収集しています。

- Structured cases: `data/cases.csv`
- Requirement matrix: `data/requirements.csv`
- Evaluation criteria: `data/evaluation_criteria.csv`
- Data model: `docs/DATA_MODEL.md`
- Initial source pack: `research/INITIAL_SOURCE_PACK_2026-09-30.md`
- Deep extraction memo: `research/DEEP_REQUIREMENT_EXTRACTION_2026-09-30.md`

## Next

仕様書・評価基準の深掘りを開始し、6案件について比較可能な要件・配点を構造化しました。次はExcelの要求機能一覧や未処理案件へ対象を拡大します。
