const assert = require('node:assert/strict');
const verify = require('../scripts/verify_main_update.cjs');
(async () => {
  for (const method of ['squash', 'merge', 'rebase', 'workflow PR']) {
    let failed = false;
    await verify({ context: { ref: 'refs/heads/main', sha: 'tip', eventName: 'workflow_dispatch', repo: { owner: 'o', repo: 'r' } },
      github: { rest: { repos: {} }, paginate: async () => [{ merged_at: 'date', base: { ref: 'main' }, merge_commit_sha: 'tip' }] },
      core: { setFailed: () => { failed = true; } } });
    assert.equal(failed, false, method);
  }
  for (const prs of [[], [{merged_at: 'date', base: {ref: 'main'}, merge_commit_sha: 'different'}]]) {
    let failed = false;
    await verify({ context: { ref: 'refs/heads/main', sha: 'direct', eventName: 'workflow_dispatch', repo: {} },
      github: { rest: {repos: {}}, paginate: async () => prs }, core: {setFailed: () => {failed = true;}} });
    assert.equal(failed, true);
  }
  console.log('MAIN_GUARD_TEST_PASS');
})().catch(error => { console.error(error); process.exitCode = 1; });

// Exercise the actual git push range, including a rebase batch and a direct
// commit hidden immediately before a legitimate merged-PR tip.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
(async () => {
  const original = process.cwd();
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'main-guard-'));
  try {
    process.chdir(temp);
    const git = (...args) => execFileSync('git', args, {encoding:'utf8'}).trim();
    git('init', '-q'); git('config','user.name','Fixture'); git('config','user.email','fixture@example.invalid');
    const commit = () => { git('commit','--allow-empty','-qm','fixture'); return git('rev-parse','HEAD'); };
    const before = commit(), intermediate = commit(), tip = commit();
    const run = async (associations, payload = {before}) => {
      let failed = false;
      await verify({context:{ref:'refs/heads/main',sha:tip,eventName:'push',repo:{owner:'o',repo:'r'},payload},
        github:{rest:{repos:{}},paginate:async (_, args) => associations[args.commit_sha] || []},
        core:{setFailed:() => {failed=true;}}});
      return failed;
    };
    const merged = [{merged_at:'date',base:{ref:'main'},merge_commit_sha:tip}];
    assert.equal(await run({[intermediate]:merged,[tip]:merged}), false, 'rebase multi-commit push');
    assert.equal(await run({[tip]:merged}), true, 'direct commit before accepted tip');
    assert.equal(await run({}), true, 'direct/bot push');
    await assert.rejects(run({}, {before,forced:true}), /force push/);
    await assert.rejects(run({}, {before:'0'.repeat(40)}), /creation/);
    console.log('MAIN_PUSH_RANGE_TEST_PASS');
  } finally { process.chdir(original); fs.rmSync(temp,{recursive:true,force:true}); }
})().catch(error => {console.error(error);process.exitCode=1;});
