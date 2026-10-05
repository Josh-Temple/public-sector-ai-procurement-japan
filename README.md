# public-sector-ai-procurement-japan

## はじめて見る方へ

[ケーススタディ：仕様書と質疑をつなぎ、有効要件を整理する](https://josh-temple.github.io/public-sector-ai-procurement-japan/case-study.html) — 問題設定・一次資料・設計・検証・限界を具体例で紹介。

まず[5つの設計論点](https://josh-temple.github.io/public-sector-ai-procurement-japan/insights.html)を読み、[比較サイト](https://josh-temple.github.io/public-sector-ai-procurement-japan/)で案件を選び、公式資料へ戻る順で確認できます。

自治体のAI調達を、仕様書だけでなく質疑・訂正・評価・公開結果と接続して構造化する個人研究です。一次情報調査、要件比較、出典設計、CIによる整合性確認のEvidenceとして、`docs/DATA_MODEL.md`、`data/source_documents.csv`、`data/effective_requirements.csv`、`scripts/validate_repository.py`を確認できます。

**確認上の限界:** 公開仕様は契約最終要件と同一とは限りません。比較実験は正答率・速度の優位を証明していません。調達支援の受託実績や所属組織の公式事業を示すものではありません。

[全プロジェクトの案内](https://github.com/Josh-Temple)

日本の公共部門におけるAI調達を、公式一次資料から収集・構造化するためのリポジトリです。

**公開サイト:** https://josh-temple.github.io/public-sector-ai-procurement-japan/

**5つの設計論点:** https://josh-temple.github.io/public-sector-ai-procurement-japan/insights.html

**仕様検討チェックリスト:** https://josh-temple.github.io/public-sector-ai-procurement-japan/checklist.html

**データの見方・方法:** https://josh-temple.github.io/public-sector-ai-procurement-japan/methodology.html

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
- Public comparison UI: `index.html` / `docs/PUBLIC_SITE.md`
- Shareable search state: `?theme=rag`, `?evidence=publicly_bounded`, `?q=...`, `?case=<case_id>`
- 回答品質の独立比較: [Benchmark V1](evals/benchmark/BENCHMARK_V1_METHOD.md) / `research/BENCHMARK_V1_RESULT_2026-10-02.md`
- AI / agent guidance: `AGENTS.md`
- Structured data model: `docs/DATA_MODEL.md`
- Source / claim model: `docs/KNOWLEDGE_MODEL.md`
- Reusable source metadata: `sources/`
- Reusable scoped claims: `claims/`

`sources/` と `claims/` は既存の `data/` や `research/` を置き換えません。再利用価値が高く、適用範囲や根拠を明示する必要がある知識だけを追加します。

「検証済み」と「現在の質問にそのまま使える」は別として扱います。現在の制度、調達状況、価格、製品仕様等については、保存済み知識を調査の起点にしつつ、必要な公式一次資料を再確認します。

## Current status

2026-09-30 に初期コーパスを作成し、以降は既存案件の証拠品質・比較可能性を優先して監査しています。案件台帳は26案件のままです。仕様書水準の要件比較は18案件、評価基準は134項目、汎用調達の細粒度要件は22件、業務特化型AIの要件は89件、公開得点は26行を保持しています。調達方式は12件、一般競争入札結果は3行、共同調達団体レコードは8行（現参加6・将来予定2）です。source documentsは74行、有効要件は81行、review coverageは84行、timelineは14行で、標準roleを1つ以上評価した案件は14件です。

公開された仕様や選定結果があっても契約最終状態を確認できるとは限りません。case-level の公開再構成可能性は契約最終要件の根拠も確認できた場合に限り publicly_reconstructable とし、not_assessed は資料がないことを意味しません。

- Structured cases: `data/cases.csv`
- Procurement/service timeline: `data/case_timeline.csv`
- Source document registry: `data/source_documents.csv`
- Effective requirements and amendments: `data/effective_requirements.csv`
- Review coverage: `data/review_coverage.csv`
- Evidence coverage projection: `data/evidence_coverage.csv`
- Human-readable coverage matrix: `docs/EVIDENCE_COVERAGE.md`
- Coverage generator: `scripts/build_evidence_coverage.py`
- Case evidence comparison: `data/case_evidence_summary.csv`
- Human-readable case evidence summary: `docs/CASE_EVIDENCE_SUMMARY.md`
- Case evidence summary generator: `scripts/build_case_evidence_summary.py`
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
- Contract-final audit pass: `research/RESEARCH_PASS_11_2026-10-01.md`
- Contract-final projection audit pass: `research/RESEARCH_PASS_12_2026-10-01.md`
- Joint-procurement contract-final audit pass: `research/RESEARCH_PASS_13_2026-10-01.md`
- General-bid contract-final evidence pass: `research/RESEARCH_PASS_14_2026-10-01.md`
- Benchmark evidence-chain hardening pass: `research/RESEARCH_PASS_15_2026-10-02.md`
- Representative case-evidence audit: `research/RESEARCH_PASS_16_2026-10-02.md`
- Specialized-AI case deepening: `research/RESEARCH_PASS_17_2026-10-03.md`
- Saitama evidence-chain deepening: `research/RESEARCH_PASS_18_2026-10-03.md`

## Repository integrity

`scripts/validate_repository.py` checks cross-file structural invariants without network access: primary-key uniqueness, case/source references, reviewed Claim evidence, snapshot-state consistency, and generated-projection case coverage.

CI also regenerates the Evidence projections and fails if committed generated outputs differ, runs the public-site validator, and syntax-checks `assets/app.js`.

GitHub protects `main` with required pull requests and the `Repository-wide integrity` check, including administrators, without requiring a reviewer. Force pushes and branch deletion are disabled. Integrity, Pages, and Source preservation also verify merged-PR provenance as defense in depth; this guard blocks their workflows but does not undo a commit already present in Git history.

For Source preservation, `.github/workflows/source-preservation.yml` archives only Sources explicitly marked `snapshot_pending`, `accessible`, and carrying an HTTPS URL. Eligible binary assets are stored only after verifying draft state in the access-restricted draft release `source-snapshots-private`; the repository records only SHA-256 and a non-secret locator through a follow-up PR. HTTP and network failures now defer only the affected Source; valid candidates in the same run continue, and deferred rows remain `snapshot_pending`. Empty or invalid PDF payloads still fail closed. Sources whose bodies cannot currently be acquired are `snapshot_unavailable`, not falsely marked as preserved.

Operational limits and settings: `docs/RELIABILITY.md`. A draft release is hidden from general visitors but is accessible to repository writers; it is not a separate private repository. Fifty-eight Sources have verified draft snapshots (44 PDFs and 14 raw HTML page responses); all are restored from their locators and SHA-256 checked on every preservation run, including zero-candidate runs. HTML snapshots contain only raw response bodies, not linked files or rendering assets. Automatic follow-up PR creation and branch integrity dispatch have been verified in production; bot-created PR checks may require maintainer workflow approval under the current GitHub Actions policy, which remains unchanged.

Local check:

```bash
python3 scripts/validate_repository.py
python3 scripts/build_evidence_coverage.py
python3 scripts/build_case_evidence_summary.py
git diff --exit-code -- data/evidence_coverage.csv docs/EVIDENCE_COVERAGE.md data/case_evidence_summary.csv docs/CASE_EVIDENCE_SUMMARY.md
python3 scripts/validate_public_site.py
node --check assets/app.js
python3 -m compileall -q scripts
python3 -m unittest discover -s tests -v
node tests/test_main_guard.cjs
```

## Benchmark V1 result

2026-10-02、20問の独立ベンチマークを1回実行した。Blind qualityはRepository-first 189/200、Web-only 190/200で、Repository-firstの正答率優位は確認されなかった。一方、Web検索queryは7対66、freshな公式文書openは4対21で、Repository-firstはWeb探索量を大きく減らした。

Web-onlyの壁時計時間は計測できなかったため、速度優位は主張しない。1回・20問の記述的結果であり、他モデル・他質問・全国自治体へ一般化しない。

結果と限界: `research/BENCHMARK_V1_RESULT_2026-10-02.md`

この実験で見つかった主な改善点は、構造化された正しい値から一次資料の該当locatorまで直接追えるEvidence chainを強くすることである。

## Next

案件ごとの文書review状態と、一次資料で個別確認した選定・契約・稼働状態を `data/case_evidence_summary.csv` に統合し、京都市2026汎用生成AI、神戸市2026仕様書作成支援AI、群馬共同調達の3パターンで代表監査しました。単独案件では既存projectionで表現できる一方、共同調達では団体ごとに契約・稼働状態が分岐し得るため、案件全体のstageへ安易に集約しない境界を追加しました。次は未監査案件を件数目的で埋めず、新しい証拠パターンが見込まれる場合にだけ追加監査し、共同調達のentity-level stageは一次資料を取得できた時点で必要性を再評価します。

## Current hardening phase

2026-10-01以降は、新規案件数の拡大より、代表案件の再監査と有効要件の再現性を優先する。

特に、仕様書の後に公式質問回答・訂正がある場合は、元仕様の記載をそのまま比較値に使わず、変更後の有効要件を `data/effective_requirements.csv` に記録する。

また、公募年度と履行・サービス年度を分離し、case_idの年を年度分析に流用しない。

### Hardening status

- Source documents: 74
- Effective requirements: 81
- Review coverage records: 84
- Case timeline records: 14
- Reasoning regression questions: 24
- Cases with hardening roles assessed: 14 / 26
- Case-level public reconstructability: publicly_bounded 12 / not_assessed 14 / publicly_reconstructable 0

代表再監査済み: 仙台市2025、大府市2026、焼津市2025、おうみ共同調達、神戸市2026税務ボイスボット、越谷市2024、北九州市2025、福島県2026、北海道2025、北海道2026、京都市2026汎用生成AI、神戸市2026仕様書作成支援AI、群馬共同調達、埼玉県2026申請・相談デジタルサポート。案件総数26件すべてが同じ深度で再監査済みという意味ではない。


### Public reconstructability

公開仕様書が存在しても、非公開の質問回答、未取得の必須機能一覧、契約時協議等により契約最終要件を公開資料だけで再構成できない場合がある。

その場合は、公開範囲で確認できる要件を `procurement_baseline` として保持し、`public_reconstructability=publicly_bounded` を付与する。公開仕様を契約最終仕様として断定しない。
