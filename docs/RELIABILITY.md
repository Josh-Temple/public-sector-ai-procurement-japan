# Repository reliability and Source preservation

## Required GitHub settings

As observed on 2026-10-03, main has no protection and there are no rulesets. The connected GitHub App cannot administer branch protection. A UI save was attempted but GitHub required sudo reauthentication; it did not complete.

**HUMAN_ACTION_REQUIRED:** Settings → Branches → Add classic branch protection rule:

- Branch name pattern: `main`
- Require a pull request before merging: enabled
- Require approvals: disabled (no reviewer requirement)
- Require status checks: `Repository-wide integrity` from GitHub Actions
- Require branches to be up to date: enabled
- Do not allow bypassing the above settings: enabled
- Allow force pushes / Allow deletions: disabled

Use the uniquely named Repository integrity job, not the separate public-site job named `validate`. After saving, reopen the rule and confirm all values. The `protected` flag on the branch API must also become true.

The compensating guard checks every first-parent commit added by a main push against merged PR associations and requires the tip to be the actual merged PR result. Squash/merge/rebase and workflow-generated PRs use the same rule. Direct bot pushes are deliberately not exempt. Main dispatches also check provenance; Pages dispatches on other branches fail. This prevents publication through these workflows; it does **not** undo a direct push, prevent deletion/modification of the workflow itself, or substitute for server-side protection.

## Preservation behavior

Only `snapshot_pending` + `accessible` + HTTPS URL rows are eligible. `source_unavailable`, `not_public`, and `external_url_only` are not silently promoted. HTTP failures or empty responses fail the run without changing canonical Source states; a transient download failure is not proof that the original document never existed.

Files are stored under `source-snapshots-private` as draft-release assets, with Source ID and full SHA-256 in each filename. The release must remain draft before and after uploading. An existing filename is verified by downloading and hashing its bytes, never overwritten. A newly uploaded asset is also read back and hashed. Locators are non-secret identifiers, not download URLs. Snapshots are not copied into Git or Pages.

Draft releases are hidden from general visitors but accessible to repository writers. Publishing the draft exposes assets: a separate rights review is required and the workflow refuses a published archive. This is an access boundary, not an immutable/private storage service. A human changing release state concurrently cannot be completely prevented by workflow checks.

Metadata changes go through a PR. `GITHUB_TOKEN`-created PRs do not trigger normal PR CI; preservation explicitly dispatches integrity CI on its branch. Required checks are never bypassed. Runs are serialized; a retry verifies/reuses assets and the existing run-specific PR branch. Merging snapshot metadata leaves no eligible pending rows, so the follow-up main push does not loop.

Current registry has 68 Sources: external_url_only 59, snapshot_unavailable 6, not_public 3, snapshot_pending 0, snapshotted 0. `external_url_only` means no durable snapshot, not necessarily current accessibility. Historical reviewed evidence is retained when originals become inaccessible. Access states: accessible 53, source_unavailable 12, not_public 3. Source status is the last recorded observation, not continuous live monitoring.

The 0-candidate production path has executed successfully. Eligible downloads, empty/404 responses, SHA-256, unsafe names, stale manifests, retries, published-release refusal, and collisions have local failure-path tests. A real nonempty draft upload and generated PR have **not** yet been demonstrated; do not report them as production verified. Test mocks validate behavior, not GitHub permissions or draft privacy. There is currently no archived asset to anonymously probe.

## Integrity and publication

`repository-integrity.yml` checks keys, foreign keys, Claim/Source IDs, review enums, dates, evidence locators, snapshot consistency, projection regeneration, public-site validation, JavaScript/Python syntax, and failure-path tests. Canonical fixtures are copied into temporary directories before intentional corruption. Unassessed generated rows can legitimately lack `last_verified`; verified dates are never invented.

Pages copies an explicit set of HTML/assets/data paths, and repeats integrity/projection validation before upload. Snapshot locators are restricted to a non-secret identifier format; credential/bearer URLs are rejected. Adding a Source snapshot does not promote a Claim or establish currentness.

## Benchmark and license

Stale benchmark PR #19 was already closed as superseded by merged #41. Frozen commits, Gold, and scores are unchanged. Retained benchmark branches are provenance references, not active PRs; no benchmark run is started by this hardening work.

**LICENSE_DECISION_REQUIRED:** No license is selected. Code, original prose, structured data, and external official materials need separate consideration. A license for original work would not automatically license third-party documents. No reuse permission is added by this work.

Repository description/homepage/topics were empty at audit start. Suggested metadata: description “Official-source knowledge base for Japanese local-government AI procurement”; homepage is the working Pages URL; topics public-sector, procurement, generative-ai, local-government, japan. These settings require UI/admin access, not a normal content commit.
