#!/usr/bin/env python3
"""Build the case-level evidence comparison projection.

Inputs remain authoritative:
- data/cases.csv
- data/review_coverage.csv
- data/evidence_coverage.csv
- data/case_stage.csv

Outputs are generated projections and must not be hand-edited:
- data/case_evidence_summary.csv
- docs/CASE_EVIDENCE_SUMMARY.md
"""
from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
DOCS = ROOT / "docs"
ROLES = [
    "specification",
    "qa_amendment",
    "requirement_matrix",
    "evaluation",
    "result",
    "contract_final",
]
SYMBOL = {
    "reviewed": "R",
    "not_reviewed": "N",
    "source_unavailable": "U",
    "not_public": "P",
    "not_assessed": "·",
    "not_applicable": "—",
    "conflicting_sources": "C",
    "not_found_in_reviewed_sources": "F",
}


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


cases = read_csv(DATA / "cases.csv")
review = read_csv(DATA / "review_coverage.csv")
evidence = read_csv(DATA / "evidence_coverage.csv")
stages = read_csv(DATA / "case_stage.csv")

case_ids = [row["case_id"] for row in cases]
if len(case_ids) != len(set(case_ids)):
    raise ValueError("Duplicate case_id in cases.csv")

evidence_map = {row["case_id"]: row for row in evidence}
if len(evidence_map) != len(evidence):
    raise ValueError("Duplicate case_id in evidence_coverage.csv")
if set(evidence_map) != set(case_ids):
    missing = sorted(set(case_ids) - set(evidence_map))
    extra = sorted(set(evidence_map) - set(case_ids))
    raise ValueError(f"evidence_coverage case mismatch: missing={missing}, extra={extra}")

role_rows = [row for row in review if row["document_role"] in ROLES]
review_map = {(row["case_id"], row["document_role"]): row for row in role_rows}
if len(review_map) != len(role_rows):
    raise ValueError("Duplicate standard role in review_coverage.csv")
unknown_review_cases = sorted({row["case_id"] for row in role_rows} - set(case_ids))
if unknown_review_cases:
    raise ValueError(f"review_coverage contains unknown case_id values: {unknown_review_cases}")

stage_map = {row["case_id"]: row for row in stages}
if len(stage_map) != len(stages):
    raise ValueError("Duplicate case_id in case_stage.csv")
unknown_stage_cases = sorted(set(stage_map) - set(case_ids))
if unknown_stage_cases:
    raise ValueError(f"case_stage contains unknown case_id values: {unknown_stage_cases}")

fieldnames = ["case_id", "government_name", "category"]
for role in ROLES:
    fieldnames += [f"{role}_state", f"{role}_source_id"]
fieldnames += [
    "selection_state",
    "selection_source_id",
    "contract_state",
    "contract_source_id",
    "operation_state",
    "operation_source_id",
    "public_reconstructability",
    "blocking_roles",
    "last_verified",
    "notes",
]

output: list[dict[str, str]] = []
for case in cases:
    case_id = case["case_id"]
    ev = evidence_map[case_id]
    stage = stage_map.get(case_id)
    row: dict[str, str] = {
        "case_id": case_id,
        "government_name": case["government_name"],
        "category": case["category"],
    }
    for role in ROLES:
        review_row = review_map.get((case_id, role))
        row[f"{role}_state"] = ev.get(role) or "not_assessed"
        row[f"{role}_source_id"] = review_row.get("source_id", "") if review_row else ""

    row["selection_state"] = stage.get("selection_state", "") if stage else "not_assessed"
    row["selection_source_id"] = stage.get("selection_source_id", "") if stage else ""
    row["contract_state"] = stage.get("contract_state", "") if stage else "not_assessed"
    row["contract_source_id"] = stage.get("contract_source_id", "") if stage else ""
    row["operation_state"] = stage.get("operation_state", "") if stage else "not_assessed"
    row["operation_source_id"] = stage.get("operation_source_id", "") if stage else ""
    row["public_reconstructability"] = ev.get("public_reconstructability") or "not_assessed"
    row["blocking_roles"] = ev.get("blocking_roles", "")
    dates = [ev.get("last_verified", "")]
    if stage:
        dates.append(stage.get("last_verified", ""))
    row["last_verified"] = max((d for d in dates if d), default="")
    row["notes"] = (
        "Generated comparison projection. Review coverage and procurement stage are separate evidence dimensions; "
        "selection does not imply contract, and contract does not imply operation."
        if stage
        else
        "Generated comparison projection. No case_stage row has been assessed for this case; "
        "this does not mean unselected, uncontracted, or not operating."
    )
    output.append(row)

with (DATA / "case_evidence_summary.csv").open("w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames, lineterminator="\n")
    writer.writeheader()
    writer.writerows(output)

dates = sorted(row["last_verified"] for row in output if row["last_verified"])
as_of = dates[-1] if dates else "not dated"
lines = [
    f"# Case evidence summary — {as_of}",
    "",
    "This is a generated comparison projection for what has actually been reviewed for each case. It is not a procurement, vendor, or government quality score.",
    "",
    "`data/case_evidence_summary.csv` joins document-role review coverage with separately verified selection / contract / operation states. It does not infer later stages from `cases.csv` status or planned dates.",
    "",
    "Role legend: R reviewed; N explicitly not reviewed; U source unavailable; P source known but not public; — not applicable; C conflicting sources; F not found in reviewed sources; · not assessed.",
    "",
    "For source tracing, use the paired `*_source_id` columns in the CSV and resolve them through `data/source_documents.csv`. An empty stage row means that stage has not been assessed in `data/case_stage.csv`; it does not mean the stage did not occur.",
    "",
    "| case | government | spec | Q&A | req matrix | eval | result | contract-final | selection | contract | operation | reconstructability | blockers |",
    "|---|---|:---:|:---:|:---:|:---:|:---:|:---:|---|---|---|---|---|",
]
for row in output:
    role_values = [SYMBOL.get(row[f"{role}_state"], row[f"{role}_state"]) for role in ROLES]
    lines.append(
        f"| {row['case_id']} | {row['government_name']} | "
        + " | ".join(role_values)
        + f" | {row['selection_state']} | {row['contract_state']} | {row['operation_state']} | "
        + f"{row['public_reconstructability']} | {row['blocking_roles']} |"
    )
lines += [
    "",
    "## Reading rules",
    "",
    "- Use this table to compare evidence coverage, not to rank municipalities or procurement quality.",
    "- `not_assessed` is not evidence of absence.",
    "- A reviewed result or selected candidate is not evidence of a signed contract.",
    "- A signed contract is not evidence that the service is operating.",
    "- `publicly_bounded` identifies a public-evidence boundary; it is not a negative judgment about the procurement.",
    "- When a claim matters for a decision, follow the source ID to the official source and precise locator rather than relying on this projection alone.",
]
(DOCS / "CASE_EVIDENCE_SUMMARY.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
