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

Only `snapshot_pending` + `accessible` + HTTPS URL rows are eligible. `source_unavailable`, `not_public`, and `external_url_only` are not silently promoted. HTTP/network failures defer only that Source and leave it `snapshot_pending`; other valid candidates continue. Empty responses and invalid PDF payloads fail before metadata is applied. HTML/HTM snapshots require `text/html` or `application/xhtml+xml`, an HTML document marker in the first 8 KiB, and an HTTPS redirect that stays on the same host or a subdomain. They preserve the raw response body only; linked files and render assets remain separate Sources. A transient download failure is not proof that the original document never existed.

Files are stored under `source-snapshots-private` as draft-release assets, with Source ID and full SHA-256 in each filename. The release must remain draft before and after uploading. An existing filename is verified by downloading and hashing its bytes, never overwritten. A newly uploaded asset is also read back and hashed. Locators are non-secret identifiers, not download URLs. Snapshots are not copied into Git or Pages.

Draft releases are hidden from general visitors but accessible to repository writers. Publishing the draft exposes assets: a separate rights review is required and the workflow refuses a published archive. This is an access boundary, not an immutable/private storage service. A human changing release state concurrently cannot be completely prevented by workflow checks.

Metadata changes go through a PR. Preservation explicitly dispatches integrity CI on its branch rather than relying on token-created PR events. In the observed run, PR-event workflows were also created but required first-time-contributor approval for github-actions[bot]; those individual runs were approved without relaxing repository fork approval policy. Required checks are never bypassed. Runs are serialized; a retry verifies/reuses assets and the existing run-specific PR branch. Merging snapshot metadata leaves no eligible pending rows, so the follow-up main push does not loop.

Current registry has 86 Sources: snapshotted 66 (51 PDFs and 15 raw HTML page responses), snapshot_unavailable 13, not_public 5, snapshot_pending 2, external_url_only 0. The two pending Sources are the newly registered Kobe 2025 Dify result page and public procurement guide; the detailed specification and participant Q&A are recorded as not_public. The 15 HTML snapshots contain only raw response bodies; linked files and rendering assets are not included. `external_url_only` means no durable snapshot, not necessarily current accessibility. Historical reviewed evidence is retained when originals become inaccessible. Access states: accessible 68, source_unavailable 13, not_public 5. Source status is the last recorded observation, not continuous live monitoring.

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

Preservation checks main provenance before download/upload alongside server-side branch protection. No original binaries are added to Git or Pages. All 66 currently snapshotted Sources (51 PDFs and 15 raw official HTML pages) are stored in the draft release; two newly registered Kobe 2025 Dify Sources are `snapshot_pending`, while 13 `snapshot_unavailable` and five `not_public` Sources remain without snapshots. `external_url_only` remains zero. These states preserve the difference between an available archived body, a body that cannot currently be retrieved, and a source that is not public. HTML response snapshots exclude linked assets. Snapshot coverage does not promote Claim verification/currentness. Unavailable Sources retain historical evidence.

## Restoration verification

`python3 scripts/source_snapshot.py verify` restores every registered snapshotted asset into memory from its non-secret locator and checks the recorded SHA-256. It never downloads from official URLs, uploads assets, writes files, changes Source states or promotes Claims. Missing/ambiguous assets, hash mismatches and a published archive fail the run. Preservation runs this check even with zero pending candidates, before opening a metadata PR.

Run `37212162594` preserved five existing PDFs used by Claims or their specification context: Oumi guide, Kobe voicebot guide/specification, and Obu specification/Q&A. All eight registered snapshots were independently downloaded from the draft archive and SHA-256 checked. A rerun reused the same assets and PR #54 without duplication; restoration passed again. Procurement facts, verification dates and Claim status remain unchanged.

Run `37243080670` downloaded and preserved 22 existing official PDFs with no source-specific download failures. The draft archive now contains 39 assets; the workflow restored and SHA-256 checked all 39 before opening PR #60. The metadata PR changed only the 22 selected Sources' snapshot fields. Main run `37243309275` then found zero pending candidates and again verified all 39 assets without creating another PR. Six workbook/archive attachments recorded as inaccessible had retained `external_url_only`; PR #59 aligned their snapshot state to `snapshot_unavailable` while retaining historical evidence. The Kyoto bundle returned HTTP 404 in run `37216329462` and its retry; the official URL also returned 404. Its current access/snapshot states record unavailability, while historical Evidence and verification dates are retained. HTTP/network failures now defer only the affected pending Source and do not change its registry state automatically.

Run `37327569617` preserved the six newly registered Hokkaido 2025 Sources (one official HTML page and five PDFs), restored all 58 registered snapshots, and verified every SHA-256 before producing metadata PR #69. Because bot-created PR checks required maintainer execution approval, the verified metadata was copied without alteration to a maintainer-authored replacement PR; procurement facts and review dates were unchanged.

Run `37347581696` preserved the eight newly registered Fukushima 2025 Sources (one official HTML page and seven PDFs), restored all 66 registered snapshots, and verified every SHA-256 before producing metadata PR #72. Because bot-created PR checks required maintainer execution approval, the verified metadata was copied without alteration to a maintainer-authored replacement PR; procurement facts and review dates were unchanged.
