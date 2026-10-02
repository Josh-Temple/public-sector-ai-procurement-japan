---
id: SRC-kyoto-2026-general-genai-spec
title: 令和8年度 庁内利活用のための汎用的な生成AIサービス提供事業者に係る募集要項（別紙1仕様書を含む）
url: https://www.city.kyoto.lg.jp/sogo/cmsfiles/contents/0000349/349781/01_guide.pdf
publisher: 京都市
source_type: official-procurement-document
accessed_at: "2026-10-02"
scope: "京都市 2026年度 庁内利活用のための汎用的な生成AIサービス提供業務"
---

# Source notes

京都市の汎用生成AIサービス調達に関する公式一次資料。PDFの先頭は募集要項で、同じPDF内に別紙1「庁内利活用のための汎用的な生成AIサービス提供業務 仕様書」等の関連書類を含む。

このリポジトリでは、同案件を次でも構造化している。

- `data/cases.csv` — case_id: `kyoto-2026-general-genai`
- `data/requirements.csv` — 同case_idの仕様要件
- `data/evaluation_criteria.csv` — 評価基準
- `data/vendor_scores.csv` — 公開得点
- `research/RESEARCH_PASS_6_2026-10-01.md` — 深掘り時の調査記録

## Evidence locators

- PDF p.1、1(1)-(2): 本調達の「汎用的な生成AIサービス」の範囲と、NotebookLM等の既存利用環境。
- PDF p.4、6(3): 質問・回答は原則京都市Webで公表するが、秘匿すべき情報を含む場合は一部又は全部を非公表とし得る。
- PDF p.4、8(2): 受託候補者と協議し、仕様等の契約内容に合意した場合に契約を締結する。
- PDF p.5、9(1)-(2): 契約金額・契約内容は受託候補者と協議のうえ決定し、企画提案書の内容は実現を確約したものとみなす。
- 別紙1 仕様書 2(6)追加要件の注記（PDF p.10-11）: RAGを本調達の要件外とする案件固有の境界。

## Reuse caution

この資料で確認できるのは当該調達案件の要件であり、京都市全体のAI利用状況を網羅するものではない。

特に、RAGが本調達で要件外であることを、「京都市がRAGを利用していない」と読み替えない。
