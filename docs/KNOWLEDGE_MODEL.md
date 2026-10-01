# Knowledge model

## Purpose

既存の `data/` と `research/` を置き換えず、再利用価値の高い知識だけに「出典」と「主張」の明示的な関係を追加する。

最初からknowledge graphやvector DBを作ることは目的ではない。Markdownと少量のYAMLで、人間とAIの双方が読めることを優先する。

## 1. Source

Sourceは、主張の根拠として繰り返し参照する価値がある資料のmetadataを表す。

最小項目:

```yaml
---
id: SRC-example
title: 公式資料名
url: https://example.go.jp/...
publisher: 発行主体
source_type: official-specification
accessed_at: "YYYY-MM-DD"
scope: 対象案件や適用範囲
---
```

必要になった場合だけ追加する:
- `published_at`
- `version`
- `valid_from`
- `valid_to`
- `original_filename`
- `snapshot_hash`
- `snapshot_status`
- `snapshot_locator`
- 利用条件

不明な日付や版を推測で埋めない。

Source metadataは「その資料が存在する」ことを記録する。資料のすべての内容を検証済みとするものではない。

### Source preservation

一次資料のURLは、将来も同じ本文を返すとは限らない。再検証価値が高く、後から取得不能になるリスクがある資料は、`data/source_documents.csv` でsnapshot状態を追跡する。

snapshotを保存する場合は、原則として元ファイル名・durableな保存先・SHA-256等の内容hashを記録する。大きな原典や公開repoへ再配布しない方がよい資料は、Object Storage等の適切な保存先を用い、このpublic repoにはsecretを含まないlocatorとhashだけを保持する。

`reviewed` claimであっても、根拠原典を再取得できない場合は「現在freshに再確認した」とは扱わない。保存済みsnapshotに基づく確認と、発行元からのfresh取得を区別する。

## 2. Claim

Claimは、複数の回答・記事・分析で再利用する価値がある主張を表す。

最小項目:

```yaml
---
id: CLM-example
title: 短い説明
kind: fact
status: reviewed
scope: 適用範囲
last_verified: "YYYY-MM-DD"
evidence:
  - source: SRC-example
    locator: 根拠箇所
---
```

### kind

- `fact`: 公式資料に明記された内容
- `interpretation`: 資料間の比較や意味づけ
- `recommendation`: 事実・解釈を踏まえた提案

### status

- `draft`: 未検証。確定事項として再利用しない
- `reviewed`: 根拠・該当箇所・適用範囲を確認した
- `disputed`: 根拠間の不一致や疑義が未解決
- `superseded`: 後継claimに置き換えられた
- `retracted`: 誤り等により使用を取り下げた

`reviewed` は「現在も有効」を意味しない。現在性は利用時に別途判断する。

## 3. Scope is part of the claim

次の情報は、必要な場合にscopeへ含める。

- 自治体・組織
- 年度
- 調達案件
- 対象文書
- 製品版
- 実験条件
- 適用期間

例えば「RAGが要件外」という記述を、「その自治体がRAGを使っていない」という一般論へ拡張しない。

## 4. Amendment-aware facts

仕様書は常に最終状態とは限らない。

公式質問回答、訂正、追補、差替え等が元仕様を変更する場合、次を分離する。

- Source: どの資料に何が書かれているか
- Original requirement: 当初仕様
- Amendment: 後続資料による変更
- Effective requirement: 応募・契約判断に用いる変更後の状態
- Projection: 横断比較用の `requirements.csv`

後続資料が「仕様変更」「緩和」「削除」等を明示した場合、元仕様だけを現行要件として再利用しない。

structured source registryは `data/source_documents.csv`、変更後要件は `data/effective_requirements.csv` で管理する。

## 5. Public reconstructability

「公式一次資料であること」と「最終状態を公開資料だけで再構成できること」は別である。

少なくとも次の状態を区別する。

- `publicly_reconstructable`: 当該要件の根拠となる仕様・質疑・訂正等が公開されており、公開資料から状態を追跡できる。
- `publicly_bounded`: 公開仕様等から公募baselineは確認できるが、非公開質問回答、未取得別紙、企画提案、契約時協議等により最終状態までは確定できない。

Sourceの取得状態:
- `accessible`
- `source_unavailable`
- `not_public`

`not_public` は「見つからない」ではない。公式文書からその資料の存在・利用が確認できるが、一般公開本文を取得できない状態である。

AIは `publicly_bounded` な要件を contract-final と表現してはいけない。

## 6. Relationship with existing structured data

既存のCSVは比較可能な事実の主要な構造化表現として維持する。

- `data/cases.csv`
- `data/requirements.csv` — 横断比較projection
- `data/requirement_facts.csv` — 細粒度fact
- `data/effective_requirements.csv` — 変更後の有効要件
- `data/source_documents.csv` — 文書識別・版/取得状態
- `data/case_timeline.csv` — 公募年度とサービス年度
- `data/review_coverage.csv` — 確認範囲・未確認理由
- `data/evaluation_criteria.csv`
- その他 `docs/DATA_MODEL.md` に定義された表

ClaimはCSVのコピーではない。次の場合だけ作る。

- 複数の回答で再利用する
- 適用範囲や例外が重要
- 誤読しやすい
- 根拠更新によって意味が変わる
- 比較・意思決定への影響が大きい

単純な数値や一覧は、原則としてCSVを直接参照する。

## 7. Freshness

日付の意味を混同しない。

- `published_at`: 資料の公開日
- `accessed_at`: 資料を取得した日
- `last_verified`: claimと根拠・適用範囲の対応を確認した日
- `valid_from` / `valid_to`: 制度・契約等の実際の適用期間

URLが開くことだけを確認して `last_verified` を更新しない。

現在の制度、価格、調達結果、製品仕様等に使う場合は、reviewed claimであっても公式一次資料を再確認する。

## 8. Supersession

主張の意味が変わる場合は、既存claimを静かに書き換えて履歴を消さず、新しいclaimを作ることを検討する。

旧claim側:
```yaml
status: superseded
superseded_by: CLM-new-id
```

誤字修正や説明補足など意味を変えない修正は、同じIDのまま更新できる。

## 9. Promotion rule

調査メモの内容を自動的にclaimへ昇格しない。

claim化する前に:
1. 根拠となる一次資料を確認する。
2. 既存のstructured dataと矛盾しないか確認する。
3. 適用範囲を明示する。
4. fact / interpretation / recommendation を区別する。
5. 現在性が必要ならfresh readする。

この手順を満たさない内容は、research memoまたはdraft claimに留める。
