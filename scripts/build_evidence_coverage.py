#!/usr/bin/env python3
"""Build data/evidence_coverage.csv and docs/EVIDENCE_COVERAGE.md.

No network access. Inputs are repository-local CSV files.
Missing review_coverage rows become not_assessed, never "not found".
"""
from __future__ import annotations
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
DOCS = ROOT / "docs"
ROLES = ["specification","qa_amendment","requirement_matrix","evaluation","result","contract_final"]
BLOCKERS = {"source_unavailable","not_public","conflicting_sources"}
SYMBOL = {"reviewed":"R","not_reviewed":"N","source_unavailable":"U","not_public":"P","not_assessed":"·","not_applicable":"—","conflicting_sources":"C","not_found_in_reviewed_sources":"F"}

def read_csv(path):
    with path.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))

cases = read_csv(DATA / "cases.csv")
coverage = read_csv(DATA / "review_coverage.csv")
effective = read_csv(DATA / "effective_requirements.csv")

role_map = {(r["case_id"], r["document_role"]): r for r in coverage if r["document_role"] in ROLES}
public_effective = {r["case_id"] for r in effective if r.get("public_reconstructability") == "publicly_reconstructable"}

fieldnames = ["case_id","government_name","category",*ROLES,"assessed_roles","reviewed_roles","blocking_roles","public_reconstructability","last_verified","notes"]
output = []
for case in cases:
    states, dates, blockers = {}, [], []
    assessed = reviewed = 0
    for role in ROLES:
        row = role_map.get((case["case_id"], role))
        state = row["review_state"] if row else "not_assessed"
        states[role] = state
        if row:
            assessed += 1
            if row.get("last_verified"):
                dates.append(row["last_verified"])
        if state == "reviewed":
            reviewed += 1
        if state in BLOCKERS:
            blockers.append(f"{role}:{state}")
    reconstructability = "not_assessed"
    if assessed:
        if blockers:
            reconstructability = "publicly_bounded"
        elif case["case_id"] in public_effective:
            reconstructability = "publicly_reconstructable"
    output.append({
        "case_id": case["case_id"], "government_name": case["government_name"], "category": case["category"],
        **states, "assessed_roles": assessed, "reviewed_roles": reviewed, "blocking_roles": ";".join(blockers),
        "public_reconstructability": reconstructability, "last_verified": max(dates) if dates else "",
        "notes": "Current hardening audit has not yet assessed these roles." if assessed == 0 else "Coverage states describe review depth, not case quality.",
    })

with (DATA / "evidence_coverage.csv").open("w", encoding="utf-8", newline="") as f:
    w = csv.DictWriter(f, fieldnames=fieldnames)
    w.writeheader(); w.writerows(output)

lines = [
    "# Evidence coverage",
    "",
    "This is a **review-coverage projection**, not a quality score.",
    "",
    "| case | government | spec | Q&A | req matrix | eval | result | contract-final | reconstructability |",
    "|---|---|:---:|:---:|:---:|:---:|:---:|:---:|---|",
]
for r in output:
    vals = [SYMBOL.get(r[x], r[x]) for x in ROLES]
    lines.append(f"| {r['case_id']} | {r['government_name']} | " + " | ".join(vals) + f" | {r['public_reconstructability']} |")
(DOCS / "EVIDENCE_COVERAGE.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
