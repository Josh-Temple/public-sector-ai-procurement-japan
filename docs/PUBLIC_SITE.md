# Public comparison UI

## User-facing site structure (2026-10-08)

The public site opens with three tasks: **調達事例を探す** (`index.html#search-heading`), **仕様の条件を比較する** (`index.html#requirement-explorer`), and **評価基準を調べる** (`evaluation.html#evaluation-topics`). The case search and results are placed before the research summaries and internal collection metrics. The seven existing public URLs, case/query deep links, source locators, and comparison/download functions remain part of the compatibility contract.

The primary navigation links to cases, specification topics, evaluation, case commentary, and source-review methodology. The supplementary footer keeps the specification checklist, individual case study, and repository reachable. Introductory text and user actions are Japanese-first; technical Source/Claim and validation details remain in methodology/repository documentation. The site does not infer standard scores or contract-final conditions from publicly bounded examples. Search discovery is not a quality ranking. Human first-time-user and physical Android Chrome usability tests are separate from automated QA and must not be reported as complete without observation.


The repository root `index.html` is a dependency-free public comparison interface for the structured procurement data.

## Data source

The UI does not maintain a second copy of procurement facts. It reads the canonical CSV projections at runtime:

- `data/cases.csv`
- `data/requirements.csv`
- `data/procurement_structure.csv`
- `data/case_evidence_summary.csv`
- `data/source_documents.csv`
- `data/effective_requirements.csv`
- `data/evaluation_criteria.csv`
- `data/specialized_requirements.csv`
- `data/vendor_scores.csv`
- `data/bid_results.csv`
- `data/case_timeline.csv`

This keeps the public interface downstream of the repository data model.

## User-facing rules

- Search and filters are for discovery, not quality ranking.
- `not_assessed` is displayed as unreviewed rather than absent.
- `publicly_bounded` is displayed as a public-evidence boundary, not a procurement-quality judgment.
- Selection, contract, and operation are not inferred from one another.
- The representative-source link for each case points to the official `cases.csv source_url`.
- Each row also exposes an Evidence-chain dialog for specification, Q&A/amendment, requirement matrix, evaluation, result, contract-final, selection, contract, and operation states.
- Evidence-chain source links resolve through `data/source_documents.csv`; missing URLs remain visibly bounded rather than being substituted with secondary sources.
- Comparison is capped at three cases to keep the mobile layout usable.
- The requirement-first explorer reads reviewed effective requirements directly, shows original and effective wording together, and links to the registered official base/change Sources.
- Requirement comparison can be narrowed by presentation-only topic, keyword, change type, and whether the changed-by Source is an official Q&A/amendment or another official document. These filters derive from canonical rows and do not create a second fact table.
- Requirement Source links show the public document role and date alongside the registered official link, while requirement-level procurement-effective reconstructability remains visibly separate from case-level contract-final reconstructability.
- Requirement-level reconstructability and case-level reconstructability are shown separately; a reconstructable procurement-effective requirement does not imply that the contract-final case state is reconstructable.
- Raw internal fields such as blocker enums, Source IDs, and access-state codes are not presented as primary public copy; user-facing text explains the evidence boundary in ordinary language.

## Deployment

`.github/workflows/pages.yml` prepares a minimal artifact containing only:

- `index.html`
- `insights.html`
- `checklist.html`
- `drafting.html`
- `evaluation.html`
- `methodology.html`
- `robots.txt`
- `sitemap.xml`
- `assets/`
- `data/`

After successful deployment, the `evaluation-browser-qa` dependent job runs real Chromium desktop/mobile checks, compares the published `evaluation.js` blob to the deploy commit, and uploads a JSON report and screenshots for review. Workflow success alone is not a claim of Android hardware/200% browser zoom validation.

The workflow uses the current GitHub Pages Actions flow documented by GitHub. GitHub Pages must be configured to use GitHub Actions as its publishing source in repository settings before deployment can succeed.


## Content layer

The public page is intentionally more than a search table.

- `insights.html` provides a stable, shareable narrative entry point for five reviewed design issues. It is presentation copy only; the linked reviewed Claims remain authoritative for scope and evidence.
- `checklist.html` translates reviewed case differences into eight specification-design questions. It is a decision prompt, not a legal or technical standard, and every example routes back to cases, Claims, or official sources.
- `evaluation.html` reads case-local evaluation, qualification, selection and price rules from canonical CSVs. A `?topic=<topic_id>&case=<case_id>` URL reproduces the selected representative topic and case; the share link follows selector changes. The Markdown export reads those same registered rows and their official Source titles/URLs/locators at click time without inventing a recommendation or a new canonical copy. An unknown case parameter is ignored; the export does not make an absent condition proof of nonexistence.
- `drafting.html` is the second-stage specification drafting support page. It keeps only stable decision/navigation metadata in `assets/drafting.js`; observed requirements, scoring examples, Source links, and case evidence boundaries are read from the canonical CSVs at runtime. It does not set numeric defaults or infer mandatory/evaluation/qualification roles automatically.
- `methodology.html` exposes the public data layers, evidence-state semantics, freshness rules, and direct CSV entry points without creating a second canonical data source.
- The public HTML includes basic Open Graph and Twitter summary metadata for cleaner link previews without introducing a separate content source.
- Canonical URLs and `og:url` point to the deployed GitHub Pages URLs, while `robots.txt` and `sitemap.xml` expose the stable public entry pages for discovery.
- Each insight section links back into the canonical case-detail deep link before exposing Claim and primary-source links.
- Summary indicators are calculated in the browser from the current requirement and evidence CSVs.
- Theme links apply filters to the same canonical case list rather than using hand-maintained landing pages.
- The home page also provides a requirement-first table over `data/effective_requirements.csv`, with fixed presentation-only topic groupings for RAG, data handling, network, security, model conditions, usage/accounts, file capacity, support/training, authentication, and pricing/overage.
- Clicking a case opens a detail view with procurement facts, major requirements, effective requirements, evaluation criteria, and links into the evidence chain.
- Individual cases have stable query-string entry points such as `?case=<case_id>`; these URLs open the corresponding detail view after canonical CSV data loads, so external writing can link directly to a case without maintaining separate case pages.
- The detail view reads `data/evaluation_criteria.csv` and `data/effective_requirements.csv` directly, so new structured research appears without duplicating facts in HTML.
- Counts are descriptive of the current structured corpus and are not presented as representative estimates of all Japanese local governments.


## Research highlights and richer case detail

The home page includes a small editorial selection of reviewed Claims to demonstrate why source chaining matters. Each highlight routes to:

- the relevant case detail,
- an official primary Source when the Source registry has a URL,
- the canonical reviewed Claim with its scope limit.

The highlight text is presentation copy, not a new canonical fact layer. The Claim remains authoritative for scope and evidence.

Case detail also reads these canonical datasets when available:

- `data/specialized_requirements.csv`
- `data/vendor_scores.csv`
- `data/bid_results.csv`
- `data/case_timeline.csv`

Missing structured detail is shown as unregistered rather than inferred from other fields.


## Complete case-detail expansion

Dense case detail is previewed with the first eight structured rows, but it is no longer truncated.

For effective requirements, evaluation criteria, specialized-AI requirements, and published result rows:

- the first eight rows are shown immediately;
- a count states how many structured rows exist;
- users can expand the remaining rows in place and collapse back to the first eight;
- effective-requirement rows link to the changed-by Source when available, otherwise the base Source;
- evaluation, specialized-requirement, result, and timeline rows link to their official source URL when available.

This keeps the initial dialog scannable on mobile while allowing the existing dense Sendai, Oumi, Yaizu, Kitakyushu, Saitama, and Kobe cases to be read through without leaving the case detail merely because of the former eight-row presentation cap.


## Automated validation

`scripts/validate_public_site.py` performs deterministic local checks without fetching external sites. It verifies:

- required public entry files and local assets exist;
- canonical and Open Graph URLs match the deployed GitHub Pages URLs;
- `robots.txt` points to the public sitemap and the sitemap contains the stable entry pages;
- every explicit `?case=<case_id>` deep link in public HTML resolves to a case in `data/cases.csv`;
- every CSV path declared in `assets/app.js` exists in the repository;
- effective-requirement case/source references used by the requirement explorer resolve to canonical rows;
- the requirement explorer's required DOM/JavaScript behavior is present, including keyword/change/Q&A filter state;
- raw internal evidence blocker/access-state fields are not exposed by the public JavaScript.

`tests/test_requirement_explorer.cjs` additionally exercises topic-classification regressions, Q&A-vs-other changed-source filtering, keyword matching, public change labels, and Source-role labels against the current canonical CSVs.

`tests/test_drafting_support.cjs` resolves every drafting-support reference against the current canonical CSVs and guards the key boundaries: RAG required vs out-of-scope, account quantity vs authentication, pricing/overage placement, citizen-facing generation control, Q&A-effective values, Source resolution, and the distinction between `publicly_bounded` cases and contract-final reconstructability.

The Pages workflow runs this validation before building the deployment artifact. `.github/workflows/public-site-check.yml` runs the same validator on pull requests that touch the public UI, its data inputs, or the validator itself.


## Case highlights

Each case detail begins with up to five navigation-oriented highlights.

The highlight layer is deliberately downstream of canonical knowledge:

1. reviewed reusable Claims mapped to that case are shown first;
2. remaining slots are filled from current structured data such as requirement-profile features, effective-requirement counts, specialized-AI counts, evaluation counts, published result counts, and case-level public-evidence boundaries;
3. Claim highlights link to both the canonical Claim and its registered official Source;
4. computed highlights navigate to the relevant detail section or Evidence-chain dialog.

The home-page Research Highlights remain intentionally curated. Additional reviewed Claims can appear in a case detail with `featured: false` without expanding the home-page list.

This layer does not create a new fact source or infer missing procurement states. It is a reading aid over Claims and existing structured data.




## Evaluation and scoring support

`evaluation.html` is a decision-support view over canonical evaluation and requirement data. It does not publish a recommended scoring model.

The page keeps five boundaries explicit:

- minimum / desirable requirements come from `data/effective_requirements.csv`, including later Q&A changes;
- scored criteria, points, denominators and assessment stages come from `data/evaluation_criteria.csv`;
- participation / eligibility conditions come from `data/qualification_gates.csv` and remain separate from scored criteria;
- selection thresholds, subtotal thresholds, disqualification conditions, proposal ceilings, planned prices, price formulas, tie-break rules and explicitly evidenced stage-score relations come from `data/evaluation_rules.csv` without duplicating criterion points;
- procurement structure and published vendor totals remain separate from criterion-level scores, so totals are never decomposed into invented item scores.

Topic mappings in `assets/evaluation.js` contain stable topic IDs and canonical row references. They do not copy points, total points, criterion wording, source URLs, thresholds, proposal ceilings, contract amounts or recommended weights.

The case view is deliberately case-local. It can show different stage denominators, price criteria, structured award basis, typed selection/pricing rules, and publicly disclosed vendor totals, but it does not calculate cross-case rankings, averages or recommended price shares. `publicly_bounded` cases remain bounded: selection evidence does not become contract-final or operation evidence.

Stage relationships are displayed only from canonical typed rows backed by a Source and locator. The UI does not infer carry-over from stage labels or add denominators across stages. In particular, Matsue's document-review 80 points are shown as included in the final 200-point structure rather than as an 80+200 total, and Gosen's first-stage price score is shown as reused without recalculation while retaining its explicit 200/1000 final contribution.

Case-local qualification and rule rows link directly to their registered official Sources. When a case currently has no structured gate or rule rows, the page renders an explicit bounded empty state rather than claiming that the original procurement had no such condition.

`tests/test_evaluation_support.cjs` guards canonical IDs/FKs, qualification-vs-score separation, threshold/disqualification/ceiling/planned-price/formula role separation, subtotal scope, stage inclusion/reuse semantics, points / total / raw assessment-stage preservation, Q&A chains, Source availability boundaries, vendor-total separation and the absence of recommended/default scoring fields. The public page labels its topic and case selectors as representative subsets and links case-local evaluation rows and rules back to official Sources.

## Public navigation and shareable search state

The six stable public entry points use the same compact navigation:

- 調べる → `index.html`
- 理解する → `insights.html`
- 仕様を考える → `checklist.html`
- 仕様へ落とす → `drafting.html`
- 評価へ分ける → `evaluation.html`
- データの見方 → `methodology.html`

The database serializes discovery state into query parameters without creating a second data source.

Supported public state includes:

- `?q=<keyword>`
- `?prefecture=<value>`
- `?method=<value>`
- `?rag=true|false|soft|unknown`
- `?evidence=assessed|publicly_bounded|not_assessed`
- `?theme=rag|learning|lgwan|joint|evaluated|bounded`
- `?topic=rag|data-handling|network|security|model|accounts-usage|files-capacity|support-training|authentication|pricing-overage`
- `?rq=<requirement keyword>`
- `?amended=qa|other`
- `?change=<change_type>`
- `?case=<case_id>`

Theme links write their state into the URL. Manual search/filter changes also update the URL. Case-detail links preserve the current filter state, so a shared case URL can retain the context in which the case was discovered.

The "この条件を共有" button copies an absolute URL for the current list filter. Search-state URLs are a presentation convenience; the canonical CSVs remain authoritative.
