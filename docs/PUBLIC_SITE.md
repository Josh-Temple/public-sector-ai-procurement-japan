# Public comparison UI

The repository root `index.html` is a dependency-free public comparison interface for the structured procurement data.

## Data source

The UI does not maintain a second copy of procurement facts. It reads the canonical CSV projections at runtime:

- `data/cases.csv`
- `data/requirements.csv`
- `data/procurement_structure.csv`
- `data/case_evidence_summary.csv`
- `data/source_documents.csv`

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

## Deployment

`.github/workflows/pages.yml` prepares a minimal artifact containing only:

- `index.html`
- `insights.html`
- `checklist.html`
- `robots.txt`
- `sitemap.xml`
- `assets/`
- `data/`

The workflow uses the current GitHub Pages Actions flow documented by GitHub. GitHub Pages must be configured to use GitHub Actions as its publishing source in repository settings before deployment can succeed.


## Content layer

The public page is intentionally more than a search table.

- `insights.html` provides a stable, shareable narrative entry point for five reviewed design issues. It is presentation copy only; the linked reviewed Claims remain authoritative for scope and evidence.
- `checklist.html` translates reviewed case differences into eight specification-design questions. It is a decision prompt, not a legal or technical standard, and every example routes back to cases, Claims, or official sources.
- The public HTML includes basic Open Graph and Twitter summary metadata for cleaner link previews without introducing a separate content source.
- Canonical URLs and `og:url` point to the deployed GitHub Pages URLs, while `robots.txt` and `sitemap.xml` expose the stable public entry pages for discovery.
- Each insight section links back into the canonical case-detail deep link before exposing Claim and primary-source links.
- Summary indicators are calculated in the browser from the current requirement and evidence CSVs.
- Theme links apply filters to the same canonical case list rather than using hand-maintained landing pages.
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
- every CSV path declared in `assets/app.js` exists in the repository.

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


## Public navigation and shareable search state

The three stable public entry points use the same compact navigation:

- 調べる → `index.html`
- 理解する → `insights.html`
- 仕様を考える → `checklist.html`

The database serializes discovery state into query parameters without creating a second data source.

Supported public state includes:

- `?q=<keyword>`
- `?prefecture=<value>`
- `?method=<value>`
- `?rag=true|false|soft|unknown`
- `?evidence=assessed|publicly_bounded|not_assessed`
- `?theme=rag|learning|lgwan|joint|evaluated|bounded`
- `?case=<case_id>`

Theme links write their state into the URL. Manual search/filter changes also update the URL. Case-detail links preserve the current filter state, so a shared case URL can retain the context in which the case was discovered.

The "この条件を共有" button copies an absolute URL for the current list filter. Search-state URLs are a presentation convenience; the canonical CSVs remain authoritative.
