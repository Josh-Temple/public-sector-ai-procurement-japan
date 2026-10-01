#!/usr/bin/env python3
"""Build data/evidence_coverage.csv and docs/EVIDENCE_COVERAGE.md.

This is an evidence-review projection, not a quality score. Case-level public
reconstructability through contract final requires all standard roles reviewed
or evidence-backed not_applicable, contract_final reviewed, and a reviewed
public final requirement at contracting_rule. not_assessed never means absent.
"""
from __future__ import annotations
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
DOCS = ROOT / "docs"
ROLES = ["specification", "qa_amendment", "requirement_matrix", "evaluation", "result", "contract_final"]
HARD_BLOCKERS = {"source_unavailable", "not_public", "conflicting_sources"}
NOT_FOUND = "not_found_in_reviewed_sources"
ASSESSABLE = {"reviewed", "not_reviewed", "source_unavailable", "not_public", "not_applicable", "conflicting_sources", NOT_FOUND}
SYMBOL = {"reviewed": "R", "not_reviewed": "N", "source_unavailable": "U", "not_public": "P", "not_assessed": "·", "not_applicable": "—", "conflicting_sources": "C", NOT_FOUND: "F"}

def read_csv(path):
    with path.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))

cases = read_csv(DATA / "cases.csv")
coverage = read_csv(DATA / "review_coverage.csv")
effective = read_csv(DATA / "effective_requirements.csv")
case_ids = [r["case_id"] for r in cases]
if len(case_ids) != len(set(case_ids)):
    raise ValueError("Duplicate case_id in cases.csv")

role_rows = [r for r in coverage if r["document_role"] in ROLES]
role_map = {(r["case_id"], r["document_role"]): r for r in role_rows}
if len(role_map) != len(role_rows):
    raise ValueError("Duplicate standard role in review_coverage.csv")
orphan_roles = sorted({r["case_id"] for r in role_rows} - set(case_ids))
if orphan_roles:
    raise ValueError(f"review_coverage contains unknown case_id values: {orphan_roles}")

contract_final_evidence = {
    r["case_id"] for r in effective
    if r.get("applicability_stage") == "contracting_rule"
    and r.get("review_status") == "reviewed"
    and r.get("public_reconstructability") == "publicly_reconstructable"
}
fieldnames = ["case_id", "government_name", "category", *ROLES, "assessed_roles", "reviewed_roles", "blocking_roles", "public_reconstructability", "last_verified", "notes"]
output = []
for case in cases:
    case_id = case["case_id"]
    states, dates, blockers = {}, [], []
    assessed = reviewed = 0
    for role in ROLES:
        row = role_map.get((case_id, role))
        state = row["review_state"] if row else "not_assessed"
        states[role] = state
        if state in ASSESSABLE:
            assessed += 1
            if row.get("last_verified"):
                dates.append(row["last_verified"])
        if state == "reviewed":
            reviewed += 1
        if state in HARD_BLOCKERS or state == NOT_FOUND:
            blockers.append(f"{role}:{state}")

    reconstructability = "not_assessed"
    if assessed:
        if blockers:
            reconstructability = "publicly_bounded"
        elif states["contract_final"] in {"not_assessed", "not_reviewed", "not_applicable"}:
            reconstructability = "not_assessed"
        elif states["contract_final"] == "reviewed":
            if case_id not in contract_final_evidence:
                reconstructability = "publicly_bounded"
                blockers.append("contract_final:final_requirement_evidence_missing")
            elif all(states[r] in {"reviewed", "not_applicable"} for r in ROLES):
                reconstructability = "publicly_reconstructable"
            else:
                reconstructability = "not_assessed"

    output.append({
        "case_id": case_id, "government_name": case["government_name"], "category": case["category"],
        **states, "assessed_roles": assessed, "reviewed_roles": reviewed, "blocking_roles": ";".join(blockers),
        "public_reconstructability": reconstructability,
        "last_verified": max(dates) if dates else "",
        "notes": "Coverage describes the reviewed evidence scope, not procurement or government quality. not_assessed is not evidence absence." if assessed else "No standard role has been assessed; this does not mean that sources are absent.",
    })

with (DATA / "evidence_coverage.csv").open("w", encoding="utf-8", newline="") as f:
    w = csv.DictWriter(f, fieldnames=fieldnames)
    w.writeheader()
    w.writerows(output)

assessed_cases = sum(r["assessed_roles"] > 0 for r in output)
contract_reviewed_cases = sum(r["contract_final"] == "reviewed" for r in output)
reconstructable_cases = sum(r["public_reconstructability"] == "publicly_reconstructable" for r in output)
run_dates = [r["last_verified"] for r in output if r["last_verified"]]
as_of = max(run_dates) if run_dates else "not dated"
lines = [
    f"# Evidence coverage — {as_of}",
    "",
    "This is an evidence-review projection, not a procurement, vendor, or government quality score.",
    "",
    "Case-level publicly_reconstructable means all six standard roles were reviewed or evidence-backed not_applicable, contract_final was reviewed, and a reviewed public effective requirement at contracting_rule records the final state. Public procurement-stage requirements alone do not satisfy this condition.",
    "",
    "Case-level publicly_bounded means a reviewed search found a required item missing, an evidence blocker exists, or contract-final evidence does not establish final requirements. not_assessed means the relevant role has not been assessed; it does not mean that a document is absent.",
    "",
    "Legend: R reviewed; N explicitly not reviewed; U source unavailable; P source known but not public; — not applicable; C conflicting sources; F not found in reviewed sources; · not assessed.",
    "",
    "| case | government | spec | Q&A | req matrix | eval | result | contract-final | reconstructability |",
    "|---|---|:---:|:---:|:---:|:---:|:---:|:---:|---|",
]
for r in output:
    vals = [SYMBOL.get(r[x], r[x]) for x in ROLES]
    lines.append(f"| {r['case_id']} | {r['government_name']} | " + " | ".join(vals) + f" | {r['public_reconstructability']} |")
lines.extend(["", "## Current reading", "", f"- Cases in repository: {len(output)}", f"- Cases with at least one role assessed: {assessed_cases}", f"- Cases with contract_final reviewed: {contract_reviewed_cases}", f"- Cases publicly reconstructable through contract final: {reconstructable_cases}", "- assessed_roles and reviewed_roles count review states only; they are not quality scores.", "- not_applicable requires primary-source evidence that a role does not apply."])
(DOCS / "EVIDENCE_COVERAGE.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
