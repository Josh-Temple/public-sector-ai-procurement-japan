const { execFileSync } = require('node:child_process');

async function verifyMainUpdate({ github, context, core }) {
  if (context.ref !== 'refs/heads/main') return;
  const { owner, repo } = context.repo;
  let commits = [context.sha];
  if (context.eventName === 'push') {
    const before = context.payload.before;
    if (!before || /^0+$/.test(before) || context.payload.forced) {
      throw new Error('Main creation/force push requires human investigation.');
    }
    commits = execFileSync('git', ['rev-list', '--first-parent', `${before}..${context.sha}`],
                           { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
    if (!commits.length) throw new Error('No main update commits found.');
  }
  for (const sha of commits) {
    const prs = await github.paginate(github.rest.repos.listPullRequestsAssociatedWithCommit,
                                      { owner, repo, commit_sha: sha, per_page: 100 });
    const merged = prs.filter(pr => pr.merged_at && pr.base?.ref === 'main');
    // The tip must be the actual merge result. Intermediate rebase commits may
    // share the merged PR association without being its final merge_commit_sha.
    if (!merged.length || (sha === context.sha && !merged.some(pr => pr.merge_commit_sha === sha))) {
      core.setFailed(`Main commit ${sha} is not an accepted merged-PR update. History is not reverted; publication is blocked.`);
      return;
    }
  }
}
module.exports = verifyMainUpdate;
