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
- `assets/`
- `data/`

The workflow uses the current GitHub Pages Actions flow documented by GitHub. GitHub Pages must be configured to use GitHub Actions as its publishing source in repository settings before deployment can succeed.


## Content layer

The public page is intentionally more than a search table.

- Summary indicators are calculated in the browser from the current requirement and evidence CSVs.
- Theme links apply filters to the same canonical case list rather than using hand-maintained landing pages.
- Clicking a case opens a detail view with procurement facts, major requirements, effective requirements, evaluation criteria, and links into the evidence chain.
- The detail view reads `data/evaluation_criteria.csv` and `data/effective_requirements.csv` directly, so new structured research appears without duplicating facts in HTML.
- Counts are descriptive of the current structured corpus and are not presented as representative estimates of all Japanese local governments.
