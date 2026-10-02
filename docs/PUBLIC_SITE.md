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
- The main evidence link for each case points to the official `cases.csv source_url`.
- Comparison is capped at three cases to keep the mobile layout usable.

## Deployment

`.github/workflows/pages.yml` prepares a minimal artifact containing only:

- `index.html`
- `assets/`
- `data/`

The workflow uses the current GitHub Pages Actions flow documented by GitHub. GitHub Pages must be configured to use GitHub Actions as its publishing source in repository settings before deployment can succeed.
