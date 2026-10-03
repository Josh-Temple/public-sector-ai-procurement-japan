#!/usr/bin/env python3
"""Validate cross-file repository integrity without network access.

This validator checks structural invariants that should remain true regardless
of the current number of procurement cases. It does not judge procurement
quality and does not treat not_assessed as absence.
"""
from __future__ import annotations

import csv
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"

TABLES = [
    "cases.csv",
    "case_timeline.csv",
    "source_documents.csv",
    "effective_requirements.csv",
    "review_coverage.csv",
    "evidence_coverage.csv",
    "case_evidence_summary.csv",
    "requirements.csv",
    "requirement_facts.csv",
    "evaluation_criteria.csv",
    "vendor_scores.csv",
    "procurement_structure.csv",
    "bid_results.csv",
    "joint_procurement_entities.csv",
    "specialized_requirements.csv",
    "case_stage.csv",
]

REQUIRED_COLUMNS = {
    "cases.csv": {"case_id", "government_name", "procurement_title", "category"},
    "source_documents.csv": {"source_id", "case_id", "url", "access_state", "snapshot_status"},
    "case_timeline.csv": {"case_id", "source_id", "last_verified"},
    "effective_requirements.csv": {
        "effective_requirement_id", "case_id", "base_source_id",
        "changed_by_source_id", "review_status", "public_reconstructability",
    },
    "review_coverage.csv": {"case_id", "document_role", "source_id", "review_state", "last_verified"},
    "evidence_coverage.csv": {"case_id", "public_reconstructability"},
    "case_evidence_summary.csv": {"case_id", "public_reconstructability"},
    "requirements.csv": {"case_id"},
    "requirement_facts.csv": {"case_id", "requirement_no", "requirement_key"},
    "evaluation_criteria.csv": {"case_id", "criterion_id"},
    "vendor_scores.csv": {"case_id"},
    "procurement_structure.csv": {"case_id"},
    "bid_results.csv": {"case_id"},
    "joint_procurement_entities.csv": {"case_id", "entity_name"},
    "specialized_requirements.csv": {"case_id", "requirement_area", "requirement_key"},
    "case_stage.csv": {
        "case_id", "selection_source_id", "contract_source_id",
        "operation_source_id", "last_verified",
    },
}

UNIQUE_KEYS = {
    "cases.csv": [("case_id",)],
    "source_documents.csv": [("source_id",)],
    "case_timeline.csv": [("case_id",)],
    "effective_requirements.csv": [("effective_requirement_id",)],
    "review_coverage.csv": [("case_id", "document_role")],
    "evidence_coverage.csv": [("case_id",)],
    "case_evidence_summary.csv": [("case_id",)],
    "requirements.csv": [("case_id",)],
    "requirement_facts.csv": [("case_id", "requirement_no", "requirement_key")],
    "evaluation_criteria.csv": [("case_id", "criterion_id")],
    "procurement_structure.csv": [("case_id",)],
    "specialized_requirements.csv": [("case_id", "requirement_area", "requirement_key")],
    "case_stage.csv": [("case_id",)],
}

SOURCE_REF_COLUMNS = {
    "case_timeline.csv": ["source_id"],
    "effective_requirements.csv": ["base_source_id", "changed_by_source_id"],
    "review_coverage.csv": ["source_id"],
    "case_stage.csv": ["selection_source_id", "contract_source_id", "operation_source_id"],
}

REVIEW_STATES = {
    "reviewed",
    "not_reviewed",
    "source_unavailable",
    "not_public",
    "not_assessed",
    "not_applicable",
    "conflicting_sources",
    "not_found_in_reviewed_sources",
}

RECONSTRUCTABILITY = {
    "publicly_reconstructable",
    "publicly_bounded",
    "not_assessed",
}


def read_csv(name: str, errors: list[str]) -> list[dict[str, str]]:
    path = DATA / name
    if not path.is_file():
        errors.append(f"missing table: data/{name}")
        return []
    with path.open(encoding="utf-8-sig", newline="") as fh:
        reader = csv.DictReader(fh)
        columns = set(reader.fieldnames or [])
        missing = REQUIRED_COLUMNS.get(name, set()) - columns
        if missing:
            errors.append(f"data/{name}: missing required columns: {sorted(missing)}")
        return list(reader)


def nonempty_key(row: dict[str, str], columns: tuple[str, ...]) -> tuple[str, ...] | None:
    values = tuple((row.get(column) or "").strip() for column in columns)
    if not all(values):
        return None
    return values


def check_unique(name: str, rows: list[dict[str, str]], errors: list[str]) -> None:
    for columns in UNIQUE_KEYS.get(name, []):
        seen: Counter[tuple[str, ...]] = Counter()
        for row in rows:
            key = nonempty_key(row, columns)
            if key is None:
                errors.append(f"data/{name}: empty unique key field in {columns}")
                continue
            seen[key] += 1
        duplicates = sorted(key for key, count in seen.items() if count > 1)
        if duplicates:
            errors.append(
                f"data/{name}: duplicate key {columns}: "
                + ", ".join(repr(key) for key in duplicates[:10])
            )


def front_matter(text: str) -> str:
    match = re.match(r"^---\n([\s\S]*?)\n---(?:\n|$)", text)
    return match.group(1) if match else ""


def scalar(header: str, key: str) -> str:
    match = re.search(rf"^{re.escape(key)}:\s*(.*?)\s*$", header, flags=re.MULTILINE)
    if not match:
        return ""
    return match.group(1).strip().strip("\"'")


def validate_claims(source_ids: set[str], errors: list[str]) -> None:
    claim_ids: Counter[str] = Counter()
    for path in sorted((ROOT / "claims").glob("*.md")):
        header = front_matter(path.read_text(encoding="utf-8"))
        if not header:
            errors.append(f"{path.relative_to(ROOT)}: missing YAML front matter")
            continue

        claim_id = scalar(header, "id")
        if not claim_id:
            errors.append(f"{path.relative_to(ROOT)}: missing claim id")
            continue
        claim_ids[claim_id] += 1

        if path.stem != claim_id:
            errors.append(
                f"{path.relative_to(ROOT)}: filename/id mismatch "
                f"(filename={path.stem}, id={claim_id})"
            )

        status = scalar(header, "status")
        source_refs = re.findall(r"^\s*-?\s*source:\s*(SRC-[A-Za-z0-9._-]+)\s*$", header, flags=re.MULTILINE)
        locators = [
            value.strip().strip("\"'")
            for value in re.findall(r"^\s*locator:\s*(.*?)\s*$", header, flags=re.MULTILINE)
        ]

        unknown = sorted(set(source_refs) - source_ids)
        if unknown:
            errors.append(
                f"{path.relative_to(ROOT)}: unknown evidence source IDs: {unknown}"
            )

        if status == "reviewed":
            last_verified = scalar(header, "last_verified")
            if not last_verified or last_verified.lower() in {"null", "none", "~"}:
                errors.append(f"{path.relative_to(ROOT)}: reviewed claim lacks last_verified")
            if not source_refs:
                errors.append(f"{path.relative_to(ROOT)}: reviewed claim lacks evidence sources")
            if len(locators) != len(source_refs):
                errors.append(
                    f"{path.relative_to(ROOT)}: evidence source/locator count mismatch "
                    f"({len(source_refs)} sources, {len(locators)} locators)"
                )
            if any(not locator or locator.lower() in {"null", "none", "~"} for locator in locators):
                errors.append(f"{path.relative_to(ROOT)}: reviewed claim contains an empty locator")

    duplicates = sorted(claim_id for claim_id, count in claim_ids.items() if count > 1)
    if duplicates:
        errors.append(f"duplicate claim IDs: {duplicates}")


def validate_source_notes(source_ids: set[str], errors: list[str]) -> None:
    note_ids: Counter[str] = Counter()
    for path in sorted((ROOT / "sources").glob("*.md")):
        header = front_matter(path.read_text(encoding="utf-8"))
        if not header:
            errors.append(f"{path.relative_to(ROOT)}: missing YAML front matter")
            continue
        source_id = scalar(header, "id")
        if not source_id:
            errors.append(f"{path.relative_to(ROOT)}: missing source id")
            continue
        note_ids[source_id] += 1
        if path.stem != source_id:
            errors.append(
                f"{path.relative_to(ROOT)}: filename/id mismatch "
                f"(filename={path.stem}, id={source_id})"
            )
        if source_id not in source_ids:
            errors.append(f"{path.relative_to(ROOT)}: source note ID is absent from source_documents.csv")

    duplicates = sorted(source_id for source_id, count in note_ids.items() if count > 1)
    if duplicates:
        errors.append(f"duplicate source note IDs: {duplicates}")


def main() -> int:
    errors: list[str] = []
    tables = {name: read_csv(name, errors) for name in TABLES}

    for name, rows in tables.items():
        check_unique(name, rows, errors)

    case_ids = {(row.get("case_id") or "").strip() for row in tables["cases.csv"]}
    case_ids.discard("")
    source_ids = {(row.get("source_id") or "").strip() for row in tables["source_documents.csv"]}
    source_ids.discard("")

    for name, rows in tables.items():
        if name == "cases.csv":
            continue
        if rows and "case_id" in rows[0]:
            unknown_cases = sorted({
                (row.get("case_id") or "").strip()
                for row in rows
                if (row.get("case_id") or "").strip()
                and (row.get("case_id") or "").strip() not in case_ids
            })
            if unknown_cases:
                errors.append(f"data/{name}: unknown case_id values: {unknown_cases}")

    for name, columns in SOURCE_REF_COLUMNS.items():
        for row in tables[name]:
            for column in columns:
                source_id = (row.get(column) or "").strip()
                if source_id and source_id not in source_ids:
                    errors.append(
                        f"data/{name}: {column} references unknown source_id "
                        f"{source_id!r} for case {(row.get('case_id') or '').strip()!r}"
                    )

    for row in tables["review_coverage.csv"]:
        state = (row.get("review_state") or "").strip()
        if state not in REVIEW_STATES:
            errors.append(
                f"data/review_coverage.csv: unsupported review_state {state!r} "
                f"for case {(row.get('case_id') or '').strip()!r}"
            )

    for name in ["effective_requirements.csv", "evidence_coverage.csv", "case_evidence_summary.csv", "specialized_requirements.csv"]:
        for row in tables[name]:
            value = (row.get("public_reconstructability") or "").strip()
            if value and value not in RECONSTRUCTABILITY:
                errors.append(
                    f"data/{name}: unsupported public_reconstructability {value!r} "
                    f"for case {(row.get('case_id') or '').strip()!r}"
                )

    expected_case_set = case_ids
    for name in ["evidence_coverage.csv", "case_evidence_summary.csv"]:
        actual = {(row.get("case_id") or "").strip() for row in tables[name]}
        actual.discard("")
        if actual != expected_case_set:
            errors.append(
                f"data/{name}: case coverage mismatch "
                f"(missing={sorted(expected_case_set - actual)}, extra={sorted(actual - expected_case_set)})"
            )

    validate_claims(source_ids, errors)
    validate_source_notes(source_ids, errors)

    if errors:
        print("REPOSITORY_INTEGRITY_FAILED")
        for error in errors:
            print(f"- {error}")
        return 1

    print(
        "REPOSITORY_INTEGRITY_PASS "
        f"cases={len(case_ids)} sources={len(source_ids)} "
        f"claims={len(list((ROOT / 'claims').glob('*.md')))}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
