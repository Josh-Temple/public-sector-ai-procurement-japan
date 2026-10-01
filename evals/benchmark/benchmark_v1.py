#!/usr/bin/env python3
"""Architect/Judge-only offline rendering and consistency checks; never run in a Runner."""
import argparse, collections, csv, hashlib, json, pathlib, re
HERE=pathlib.Path(__file__).resolve().parent
ROOT=HERE.parents[1]
GOLD=HERE/'BENCHMARK_V1_GOLD.json'

def render(d):
    qs=d['questions']
    public='# AI調達仕様検討の質問 V1\n\n'
    for q in qs:
        public+=f"## {q['benchmark_id']}\n\nquestion: {q['question']}\n\npractical_context: {q['practical_context']}\n\n"
    packet=[{k:q[k] for k in ['benchmark_id','question','practical_context']} for q in qs]
    gold='# AI調達仕様検討ベンチマーク V1 — Gold（Judge用）\n\n'
    gold+=f"知識基準commit: `{d['frozen_repository_sha']}`。原典確認日: {d['verified_at']}。独立二重レビューは未実施。両Runnerの回答は未実行。\n\n"
    gold+='本ファイルはGold JSONの生成版。Runnerに渡さない。公募stageの条件と契約最終状態を区別する。別の公式根拠や更新を正当なものとして認める。採点詳細はMETHODを参照。\n\n'
    for q in qs:
        gold+=f"## {q['benchmark_id']}\n\n"
        for k in ['question','practical_context','expected_answer','primary_category','difficulty','candidate_origin','why_repository_may_help','gold_verification_status']:
            gold+=f"**{k}**: {q[k]}\n\n"
        gold+='**required_facts（計4点）**\n\n'
        for f in q['required_facts']:gold+=f"- {f['fact_id']} ({f['points']}点): {f['text']}\n"
        gold+='\n'
        for k in ['acceptable_variants','prohibited_inferences','error_type','repository_evidence']:
            gold+=f'**{k}**\n\n'+''.join(f'- {x}\n' for x in q[k])+'\n'
        gold+='**primary_sources**\n\n'
        for s in q['primary_sources']:
            gold+=f"- `{s['source_id']}`: [{s['title']}]({s['url']}) — {s['locator']}。本文確認 {s['verified_at']}。SHA-256 `{s['sha256']}`。\n"
            if 'archive_member' in s:gold+=f"  - ZIP member: `{s['archive_member']}`; member SHA-256 `{s['member_sha256']}`。\n"
        gold+='\n**scoring_rubric（計10点）**\n\n'
        for k,rule in q['scoring_rubric'].items():
            detail=rule.get('criterion',rule.get('atoms'))
            if isinstance(detail,list):detail=' / '.join(f"{a['text']}（{a['points']}点）" for a in detail)
            gold+=f"- {k} ({rule['max_points']}点): {detail}\n"
        gold+='\n**repository_evidence_state（基準commit時点。Goldのfresh取得状態と別）**\n\n'
        for c,r in q['repository_evidence_state'].items():
            gold+=f"- `{c}`: case-level `{r['case_public_reconstructability']}`; stage: "
            st=r['stage_projection']
            gold+=('projection行なし＝未確認' if isinstance(st,str) else '; '.join(f"selection={v['selection_state']}, contract={v['contract_state']}, operation={v['operation_state']}" for v in st))+'。\n'
            gold+='  - roles: '+(', '.join(f"{v['document_role']}={v['review_state']} ({v['last_verified']})" for v in r['review_coverage']) or '標準role未評価')+'。\n'
        gold+='\n**effective_requirement_state**\n\n'
        if q['effective_requirement_state']:
            for r in q['effective_requirement_state']:gold+=f"- `{r['effective_requirement_id']}`: {r['review_status']}; {r['applicability_stage']}; {r['public_reconstructability']}; {r['last_verified']}。\n"
        else:gold+='- この問のGoldは要件行を必須とせず、記載した原典・structured rowに基づく。\n'
        gold+='\n**claim_state**\n\n'
        if isinstance(q['claim_state'],str):gold+='- 独立claimは使用せず、structured rowと原典を用いる。\n'
        else:
            for r in q['claim_state']:gold+=f"- `{r['path']}`: {r['status']}; last_verified={r['last_verified']}。\n"
        gold+='\n'
    prompt='''# Web-only調査の実行依頼

以下の20問について、自治体のAI調達仕様を検討する担当者への短い実質的回答を作成してください。

この依頼文だけを受け取った新規セッションで実行してください。通常のWeb検索から始め、公式一次資料を優先してください。GitHub・Repository、その内容の転載、過去チャット、Memoryからこのプロジェクトの知識を利用しないでください。ベンチマークの解答集・採点用資料・他の調査条件の回答を検索・閲覧しないでください。検索ではGitHubとraw/CDNを除外し、答えを含むプロジェクト資料がスニペット等で露出したら、その内容を利用せず露出を記録して管理者へ返してください。そのセッションを公平な比較として続行しないでください。

質問で指定された案件・年度・資料段階を対象としてください。分からない情報を推測せず、確認できた事実と確認限界を分けてください。PDF・Excel・ZIPを取得できるなら利用して構いません。取得失敗と資料が存在しないことを混同しないでください。

各IDごとに、回答、回答に対応する公式根拠URLと確認箇所、確認範囲・未確認事項を返してください。必要な内容を含む短い日本語で回答してください。文書を同一セッション内で再利用して構いません。

観測ログを別に残してください。run_id、modelと設定、ツール・検索エンジン、実行順、各操作のevent_id・問題ID・実測時刻・種類・検索query又はURL・成功/失敗・文書の再利用元を記録します。検索query数、本文を開いたユニーク公式文書数、問題別の開始/回答確定時刻、全体の開始/終了時刻も記録してください。ZIP容器と内部の文書、文書の再openと初回openを分けてください。時刻・操作数を測れない場合はnull／not_measuredとし、推測値や0を作らないでください。監督可能な時計がある場合は1問12分を上限とし、その時点の回答を残してください。未完了問も省略しないでください。

実行管理者が事前指定した順序があればその順で行ってください。なければ次の事前固定順で実行し、順序をログに記録してください（Python random.Random(20261001).shuffleで作成）：020, 006, 007, 005, 018, 009, 001, 019, 014, 004, 003, 010, 002, 016, 015, 013, 017, 012, 011, 008。番号はBENCH-V1の末尾です。こちらでは採点や他条件との比較は行わず、回答・引用・観測ログだけを作成してください。

以下が全問題です。

'''+public
    return {'BENCHMARK_V1_PUBLIC.md':public.rstrip()+'\n','BENCHMARK_V1_PUBLIC.json':json.dumps(packet,ensure_ascii=False,indent=2)+'\n','BENCHMARK_V1_GOLD.md':gold.rstrip()+'\n','BENCHMARK_V1_WEB_ONLY_RUNNER_PROMPT.md':prompt.rstrip()+'\n'}

def check(d,rendered):
    qs=d['questions'];assert 18<=len(qs)<=24
    ids=[q['benchmark_id'] for q in qs];assert len(set(ids))==len(qs)
    assert ids==[f'BENCH-V1-{i:03}' for i in range(1,len(qs)+1)]
    required={'benchmark_id','question','practical_context','expected_answer','required_facts','acceptable_variants','prohibited_inferences','primary_sources','repository_evidence','difficulty','error_type','why_repository_may_help'}
    refs=collections.defaultdict(set)
    for p in (ROOT/'data').glob('*.csv'):
        rows=list(csv.DictReader(p.open()));refs[str(p.relative_to(ROOT))]={v for r in rows for k,v in r.items() if k.endswith('_id')}
    registry={r['source_id']:r for r in csv.DictReader((ROOT/'data/source_documents.csv').open())}
    receipts={r['source_id']:r for r in json.loads((HERE/'BENCHMARK_V1_SOURCE_RECEIPTS.json').read_text())}
    cases=set();counts=collections.Counter()
    for q in qs:
        assert required<=set(q);assert q['expected_answer'] and q['primary_sources']
        assert sum(f['points'] for f in q['required_facts'])==4
        assert sum(r['max_points'] for r in q['scoring_rubric'].values())==10
        assert len(q['scoring_rubric']['scope_condition']['atoms'])==2
        for s in q['primary_sources']:
            assert s['verification']=='official_body_retrieved_and_checked'
            reg=registry.get(s['source_id'],receipts[s['source_id']])
            assert s['url']==reg['url'];assert reg['document_type'].startswith('official_');assert s['locator']
            if s['source_id'] not in registry:assert receipts[s['source_id']]['official_referring_source'] in registry
            assert re.fullmatch('[0-9a-f]{64}',s['sha256'])
            assert receipts[s['source_id']]['sha256']==s['sha256']
        for ref in q['repository_evidence']:
            path,sep,key=ref.partition('#');assert (ROOT/path).is_file(),ref
            if sep:assert key in refs[path],ref
        for c in q['case_ids']: cases.add(c);counts[c]+=1
        for k in ['question','practical_context']:
            assert not re.search(r'https?://|SRC-|EFF-|CLM-|\.csv|claims/|sources/|Q&A\s*No|EVAL-|source_unavailable|not_assessed',q[k]),(q['benchmark_id'],k)
    assert set(q['primary_category'] for q in qs)==set('ABCDEFGH')
    assert max(counts.values())<=4
    assert len(cases)>=8
    assert sum(q['difficulty']=='easy' for q in qs)>=4
    for name,text in rendered.items():assert (HERE/name).read_text()==text,('generated_file_drift',name)
    public=json.loads((HERE/'BENCHMARK_V1_PUBLIC.json').read_text())
    assert all(set(q)=={'benchmark_id','question','practical_context'} for q in public)
    assert (HERE/'BENCHMARK_V1_WEB_ONLY_RUNNER_PROMPT.md').read_text().count(rendered['BENCHMARK_V1_PUBLIC.md'])==1
    regression=(ROOT/'evals/REQUIREMENT_REASONING_V1.md').read_text()
    assert len(re.findall(r'^## EVAL-',regression,re.M))==24
    print(json.dumps(dict(status='PASS',questions=len(qs),maximum_score=10*len(qs),cases=len(cases),category_counts=dict(sorted(collections.Counter(q['primary_category'] for q in qs).items())),difficulty_counts=dict(collections.Counter(q['difficulty'] for q in qs)),case_incidence=dict(sorted(counts.items())),source_documents=len(receipts),public_sha256=hashlib.sha256(rendered['BENCHMARK_V1_PUBLIC.md'].encode()).hexdigest(),gold_sha256=hashlib.sha256(GOLD.read_bytes()).hexdigest(),regression_questions=24),ensure_ascii=False,indent=2))

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--write',action='store_true');ap.add_argument('--check',action='store_true');args=ap.parse_args()
    d=json.loads(GOLD.read_text());rendered=render(d)
    if args.write:
        for name,text in rendered.items():(HERE/name).write_text(text)
    if args.check:check(d,rendered)
