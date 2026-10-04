# Repository reliability and Source preservation

## Required GitHub settings

On 2026-10-04, classic branch protection rule `84193797` was created for `main` through GitHub settings after owner reauthentication. The saved rule was reopened and read back:

- Pull request required; approvals disabled (zero required reviewers).
- Required check: `Repository-wide integrity`, accepted only from GitHub Actions.
- Branch must be up to date before merging.
- Do not allow bypassing the above settings: enabled, including administrators.
- Force pushes and branch deletions: disabled.

The public branch API also reports `protected=true`. There is no additional ruleset; classic protection provides the server-side merge boundary. Recheck actual GitHub settings before relying on this dated observation.

The compensating guard checks every first-parent commit added by a main push against merged PR associations and requires the tip to be the actual merged PR result. Squash/merge/rebase and workflow-generated PRs use the same rule. Direct bot pushes are deliberately not exempt. Integrity, Pages, and preservation main dispatches also check provenance; Pages dispatches on other branches fail. This prevents publication through these workflows; it does **not** undo a direct push, prevent deletion/modification of the workflow itself, or substitute for server-side protection.

## Preservation behavior

Only `snapshot_pending` + `accessible` + HTTPS URL rows are eligible. `source_unavailable`, `not_public`, and `external_url_only` are not silently promoted. HTTP failures or empty responses fail the run without changing canonical Source states; a transient download failure is not proof that the original document never existed.

Files are stored under `source-snapshots-private` as draft-release assets, with Source ID and full SHA-256 in each filename. The release must remain draft before and after uploading. An existing filename is verified by downloading and hashing its bytes, never overwritten. A newly uploaded asset is also read back and hashed. Locators are non-secret identifiers, not download URLs. Snapshots are not copied into Git or Pages.

Draft releases are hidden from general visitors but accessible to repository writers. Publishing the draft exposes assets: a separate rights review is required and the workflow refuses a published archive. This is an access boundary, not an immutable/private storage service. A human changing release state concurrently cannot be completely prevented by workflow checks.

Metadata changes go through a PR. Preservation explicitly dispatches integrity CI on its branch rather than relying on token-created PR events. In the observed run, PR-event workflows were also created but required first-time-contributor approval for github-actions[bot]; those individual runs were approved without relaxing repository fork approval policy. Required checks are never bypassed. Runs are serialized; a retry verifies/reuses assets and the existing run-specific PR branch. Merging snapshot metadata leaves no eligible pending rows, so the follow-up main push does not loop.

Current registry has 68 Sources: external_url_only 51, snapshot_unavailable 6, not_public 3, snapshot_pending 0, snapshotted 8. `external_url_only` means no durable snapshot, not necessarily current accessibility. Historical reviewed evidence is retained when originals become inaccessible. Access states: accessible 53, source_unavailable 12, not_public 3. Source status is the last recorded observation, not continuous live monitoring.

The 0-candidate production path and a real two-candidate production path have executed successfully. Run `37185587742` downloaded the Oumi specification and Q&A, uploaded two assets to draft release ID `402896625`, downloaded them back, verified SHA-256, and recorded metadata on its generated branch. An initial draft-list readback failed immediately after creation; retry succeeded without another draft. Creation readback now retries reads for a bounded interval, without repeating the creation write.

On 2026-10-04, the owner approved enabling Settings → Actions → General → Workflow permissions → **Allow GitHub Actions to create and approve pull requests**. The setting was saved and reloaded with the checkbox enabled; default contents/packages read permissions remain selected. The workflow declares its own scoped write permissions and does not approve or merge PRs; main protection remains mandatory. PR #50 used the connector fallback before this setting change.

Run `37199361266` downloaded and archived the Oumi evaluation PDF, read back and verified its SHA-256, and automatically opened PR #52 as github-actions[bot]. Its branch integrity dispatch `37199377658` passed. PR-event integrity/public-site workflows required individual execution approval, which was granted after reviewing the metadata-only diff. No procurement facts or verification dates changed.

An anonymous REST read returned an empty public releases list and HTTP 404 for the draft release ID and requested tag. Authenticated GitHub UI showed the same release as Draft with two assets, and the edit UI explicitly stated that the draft is not visible to the public unless published. Eligible downloads, empty/404/HTML responses, SHA-256, unsafe names, stale manifests, published-release refusal and collisions have local failure-path tests.

## Integrity and publication

`repository-integrity.yml` checks keys, foreign keys, Claim/Source IDs, review enums, dates, evidence locators, snapshot consistency, projection regeneration, public-site validation, JavaScript/Python syntax, and failure-path tests. Canonical fixtures are copied into temporary directories before intentional corruption. Unassessed generated rows can legitimately lack `last_verified`; verified dates are never invented.

Pages copies an explicit set of HTML/assets/data paths, and repeats integrity/projection validation before upload. Snapshot locators are restricted to a non-secret identifier format; credential/bearer URLs are rejected. Adding a Source snapshot does not promote a Claim or establish currentness.

## Benchmark and license

Stale benchmark PR #19 was already closed as superseded by merged #41. Frozen commits, Gold, and scores are unchanged. Retained benchmark branches are provenance references, not active PRs; no benchmark run is started by this hardening work.

**LICENSE_DECISION_REQUIRED:** No license is selected. Code, original prose, structured data, and external official materials need separate consideration. A license for original work would not automatically license third-party documents. No reuse permission is added by this work.

Repository metadata was read back on 2026-10-04: a Japanese description covering official-source comparison and evidence boundaries, the working Pages homepage, and topics including public-sector, procurement, generative-ai, local-government, japan are already set. No metadata mutation was needed.

## Follow-up integrity audit (2026-10-04)

The audit found validator gaps rather than corrupt canonical rows: vendor/bid/entity duplicates were unchecked; empty case IDs could skip foreign-key validation; an existing Source belonging to another case could pass; reviewed amendments could lack a change locator; a snapshot locator could identify a different Source/hash; malformed CSV column widths and duplicate headers were not explicitly rejected. These now fail isolated corruption fixtures. Source registry rows without a case remain allowed for cross-case discovery evidence.

Main provenance tests now exercise an actual temporary Git repository's push range, including an intermediate direct commit before a legitimate tip, a multi-commit rebase, forced pushes and branch creation. API associations remain mocked; production main runs provide the separate GitHub integration evidence.

Preservation checks main provenance before download/upload alongside server-side branch protection. No original binaries are added to Git or Pages. Eight Oumi/Kobe voicebot/Obu Sources are preserved; 51 external-only Sources still lack durable snapshots. This bounded demonstration does not imply full archive coverage or promote Claim verification/currentness. Unavailable Sources retain historical evidence.

## Restoration verification

`python3 scripts/source_snapshot.py verify` restores every registered snapshotted asset into memory from its non-secret locator and checks the recorded SHA-256. It never downloads from official URLs, uploads assets, writes files, changes Source states or promotes Claims. Missing/ambiguous assets, hash mismatches and a published archive fail the run. Preservation runs this check even with zero pending candidates, before opening a metadata PR.

Run `37212162594` preserved five existing PDFs used by Claims or their specification context: Oumi guide, Kobe voicebot guide/specification, and Obu specification/Q&A. All eight registered snapshots were independently downloaded from the draft archive and SHA-256 checked. A rerun reused the same assets and PR #54 without duplication; restoration passed again. Procurement facts, verification dates and Claim status remain unchanged.
