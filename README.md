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

## Knowledge reuse

このリポジトリは、人間だけでなく複数のAIから再利用できる知識基盤として段階的に整備しています。

- Entry point: `INDEX.md`
- AI / agent guidance: `AGENTS.md`
- Structured data model: `docs/DATA_MODEL.md`
- Source / claim model: `docs/KNOWLEDGE_MODEL.md`
- Reusable source metadata: `sources/`
- Reusable scoped claims: `claims/`

`sources/` と `claims/` は既存の `data/` や `research/` を置き換えません。再利用価値が高く、適用範囲や根拠を明示する必要がある知識だけを追加します。

「検証済み」と「現在の質問にそのまま使える」は別として扱います。現在の制度、調達状況、価格、製品仕様等については、保存済み知識を調査の起点にしつつ、必要な公式一次資料を再確認します。

## Current status

2026-09-30 に初期コーパスを作成し、公式一次資料から対象を拡張しています。現在は26案件を案件台帳に収録し、そのうち17案件は仕様書レベルの要件比較まで進めています。評価基準は117項目、汎用調達の細粒度要件は22件、業務特化型AIの要件は21件、公開得点は24行を構造化しています。さらに調達方式11件、一般競争入札結果3行、共同調達団体レコード8行（現参加6・将来予定2）を分離して保持しています。

- Structured cases: `data/cases.csv`
- Procurement/service timeline: `data/case_timeline.csv`
- Source document registry: `data/source_documents.csv`
- Effective requirements and amendments: `data/effective_requirements.csv`
- Review coverage: `data/review_coverage.csv`
- Evidence coverage projection: `data/evidence_coverage.csv`
- Human-readable coverage matrix: `docs/EVIDENCE_COVERAGE.md`
- Coverage generator: `scripts/build_evidence_coverage.py`
- Reasoning regression tests: `evals/REQUIREMENT_REASONING_V1.md`
- Requirement matrix: `data/requirements.csv`
- Granular requirement facts: `data/requirement_facts.csv`
- Evaluation criteria: `data/evaluation_criteria.csv`
- Published vendor scores: `data/vendor_scores.csv`
- Procurement structure: `data/procurement_structure.csv`
- Competitive bid results: `data/bid_results.csv`
- Joint procurement entities: `data/joint_procurement_entities.csv`
- Specialized AI requirements: `data/specialized_requirements.csv`
- Data model: `docs/DATA_MODEL.md`
- Initial source pack: `research/INITIAL_SOURCE_PACK_2026-09-30.md`
- Deep extraction memo: `research/DEEP_REQUIREMENT_EXTRACTION_2026-09-30.md`
- Collection backlog: `research/COLLECTION_BACKLOG_2026-09-30.md`
- Fukushima 2025→2026 comparison: `research/FUKUSHIMA_2025_2026_COMPARISON.md`
- Second extraction pass: `research/RESEARCH_PASS_2_2026-09-30.md`
- Third extraction pass: `research/RESEARCH_PASS_3_2026-09-30.md`
- Hokkaido 2025→2026 comparison: `research/HOKKAIDO_2025_2026_COMPARISON.md`
- Fourth extraction pass: `research/RESEARCH_PASS_4_2026-10-01.md`
- Small-municipality comparison: `research/SMALL_MUNICIPALITY_COMPARISON_2026-10-01.md`
- Joint-procurement comparison: `research/JOINT_PROCUREMENT_COMPARISON_2026-10-01.md`
- Fifth extraction pass: `research/RESEARCH_PASS_5_2026-10-01.md`
- Sixth extraction pass: `research/RESEARCH_PASS_6_2026-10-01.md`
- Effective-requirement audit pass: `research/RESEARCH_PASS_7_2026-10-01.md`
- Public-reconstructability audit pass: `research/RESEARCH_PASS_8_2026-10-01.md`
- Evidence coverage projection pass: `research/RESEARCH_PASS_9_2026-10-01.md`
- Evidence-pattern audit pass: `research/RESEARCH_PASS_10_2026-10-01.md`

## Next

仕様書・評価基準の深掘りを進め、17案件について比較可能な要件を構造化しました。共同調達では案件固有の参加団体・団体別上限を別テーブル化し始めています。新規案件数の拡大より、代表案件の証拠完全性・公開再構成可能性・質疑反映を優先します。次は案件ごとの確認範囲を比較可能な形で要約できるかを検証します。

## Current hardening phase

2026-10-01以降は、新規案件数の拡大より、代表案件の再監査と有効要件の再現性を優先する。

特に、仕様書の後に公式質問回答・訂正がある場合は、元仕様の記載をそのまま比較値に使わず、変更後の有効要件を `data/effective_requirements.csv` に記録する。

また、公募年度と履行・サービス年度を分離し、case_idの年を年度分析に流用しない。

### Hardening status

- Source documents: 40
- Effective requirements: 50
- Review coverage records: 43
- Case timeline records: 10
- Reasoning regression questions: 19
- Cases with hardening roles assessed: 8 / 26

代表再監査済み: おうみ共同調達、福島県2026、大府市2026、焼津市2025、北九州市2025、神戸市2026税務ボイスボット、北海道2026、越谷市2024。案件総数26件すべてが同じ深度で再監査済みという意味ではない。


### Public reconstructability

公開仕様書が存在しても、非公開の質問回答、未取得の必須機能一覧、契約時協議等により契約最終要件を公開資料だけで再構成できない場合がある。

その場合は、公開範囲で確認できる要件を `procurement_baseline` として保持し、`public_reconstructability=publicly_bounded` を付与する。公開仕様を契約最終仕様として断定しない。
