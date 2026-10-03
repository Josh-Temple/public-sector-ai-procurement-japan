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
