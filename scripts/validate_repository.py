#!/usr/bin/env python3
"""Validate cross-file repository integrity without network access.

This validator checks structural invariants that should remain true regardless
of the current number of procurement cases. It does not judge procurement
quality and does not treat not_assessed as absence.
"""
from __future__ import annotations

import csv
import datetime
import re
from decimal import Decimal, InvalidOperation
import sys
from collections import Counter
from pathlib import Path

SUPPORTED_EVALUATION_RULE_TYPES = frozenset({
    "minimum_total_score", "minimum_subtotal_score", "disqualification_condition",
    "proposal_ceiling", "planned_price", "price_evaluation_formula",
    "tie_break_rule", "stage_relation",
})


def finite_decimal(value):
    """Return a finite Decimal, or None for malformed/non-finite input."""
    try:
        number = Decimal((value or "").strip())
    except (InvalidOperation, ValueError, AttributeError):
        return None
    return number if number.is_finite() else None


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
    "qualification_gates.csv",
    "evaluation_rules.csv",
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
    "qualification_gates.csv": {
        "gate_id", "case_id", "topic", "applies_to", "condition_summary",
        "applies_at_stage", "base_source_id", "base_locator", "review_status",
    },
    "evaluation_rules.csv": {
        "rule_id", "case_id", "rule_type", "source_id", "locator",
        "verification_state", "collected_at",
    },
    "vendor_scores.csv": {"case_id", "vendor_label"},
    "procurement_structure.csv": {"case_id"},
    "bid_results.csv": {"case_id", "bidder_label"},
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
    "qualification_gates.csv": [("gate_id",)],
    "evaluation_rules.csv": [("rule_id",)],
    "vendor_scores.csv": [("case_id", "vendor_label")],
    "bid_results.csv": [("case_id", "bidder_label")],
    "joint_procurement_entities.csv": [("case_id", "entity_name")],
    "procurement_structure.csv": [("case_id",)],
    "specialized_requirements.csv": [("case_id", "requirement_area", "requirement_key")],
    "case_stage.csv": [("case_id",)],
}

SOURCE_REF_COLUMNS = {
    "case_timeline.csv": ["source_id"],
    "effective_requirements.csv": ["base_source_id", "changed_by_source_id"],
    "qualification_gates.csv": ["base_source_id", "changed_by_source_id"],
    "evaluation_rules.csv": ["source_id"],
    "review_coverage.csv": ["source_id"],
    "case_stage.csv": ["selection_source_id", "contract_source_id", "operation_source_id"],
    "case_evidence_summary.csv": [f"{role}_source_id" for role in
                                  ["specification", "qa_amendment", "requirement_matrix",
                                   "evaluation", "result", "contract_final",
                                   "selection", "contract", "operation"]],
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

SNAPSHOT_STATUSES = {
    "external_url_only",
    "snapshot_pending",
    "snapshotted",
    "snapshot_unavailable",
    "not_public",
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
        rows = list(reader)
        if len(reader.fieldnames or []) != len(columns):
            errors.append(f"data/{name}: duplicate column names")
        for line, row in enumerate(rows, 2):
            if None in row or any(value is None for value in row.values()):
                errors.append(f"data/{name}:{line}: CSV row width mismatch")
        return [{key: value or "" for key, value in row.items() if key is not None} for row in rows]


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
        if status not in {"draft", "reviewed", "disputed", "superseded", "retracted"}:
            errors.append(f"{path.relative_to(ROOT)}: unsupported claim status {status!r}")
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
            elif not valid_date(last_verified):
                errors.append(f"{path.relative_to(ROOT)}: invalid last_verified")
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


def valid_date(value: str) -> bool:
    try:
        return bool(re.fullmatch(r"\d{4}-\d{2}-\d{2}", value)) and datetime.date.fromisoformat(value) <= datetime.date.today()
    except ValueError:
        return False


def main() -> int:
    errors: list[str] = []
    tables = {name: read_csv(name, errors) for name in TABLES}

    for name, rows in tables.items():
        check_unique(name, rows, errors)
        for row in rows:
            if "last_verified" in row and ((row.get("last_verified") and not valid_date(row["last_verified"])) or (name not in {"evidence_coverage.csv", "case_evidence_summary.csv"} and not row.get("last_verified"))):
                errors.append(f"data/{name}: missing or invalid last_verified")

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
            if name != "source_documents.csv" and any(not (row.get("case_id") or "").strip() for row in rows):
                errors.append(f"data/{name}: empty case_id")
            if unknown_cases:
                errors.append(f"data/{name}: unknown case_id values: {unknown_cases}")

    sources_by_id = {row.get("source_id"): row for row in tables["source_documents.csv"]}
    for name, columns in SOURCE_REF_COLUMNS.items():
        for row in tables[name]:
            for column in columns:
                source_id = (row.get(column) or "").strip()
                if source_id and source_id not in source_ids:
                    errors.append(
                        f"data/{name}: {column} references unknown source_id "
                        f"{source_id!r} for case {(row.get('case_id') or '').strip()!r}"
                    )

                source = sources_by_id.get(source_id)
                if source and source.get("case_id") and source["case_id"] != row.get("case_id"):
                    errors.append(f"data/{name}: {column} belongs to a different case")

    for row in tables["review_coverage.csv"]:
        state = (row.get("review_state") or "").strip()
        if state not in REVIEW_STATES:
            errors.append(
                f"data/review_coverage.csv: unsupported review_state {state!r} "
                f"for case {(row.get('case_id') or '').strip()!r}"
            )
        if state == "reviewed" and not row.get("source_id"):
            errors.append("data/review_coverage.csv: reviewed row lacks source_id")

    for row in tables["effective_requirements.csv"]:
        if row.get("review_status") not in {"draft", "reviewed", "disputed", "superseded", "retracted"}:
            errors.append("data/effective_requirements.csv: unsupported review_status")
        if row.get("review_status") == "reviewed" and (not row.get("base_source_id") or not row.get("base_locator")):
            errors.append("data/effective_requirements.csv: reviewed row lacks base evidence")

        if row.get("review_status") == "reviewed" and row.get("changed_by_source_id") and not row.get("change_locator"):
            errors.append("data/effective_requirements.csv: reviewed amendment lacks change_locator")

    for row in tables["qualification_gates.csv"]:
        if row.get("review_status") not in {"draft", "reviewed", "disputed", "superseded", "retracted"}:
            errors.append("data/qualification_gates.csv: unsupported review_status")
        if row.get("review_status") == "reviewed" and (not row.get("base_source_id") or not row.get("base_locator")):
            errors.append("data/qualification_gates.csv: reviewed gate lacks base evidence")
        if row.get("review_status") == "reviewed" and row.get("changed_by_source_id") and not row.get("change_locator"):
            errors.append("data/qualification_gates.csv: reviewed amendment lacks change_locator")
        if row.get("applies_at_stage") not in {"participation", "bid_validity"}:
            errors.append("data/qualification_gates.csv: unsupported applies_at_stage")

    evaluation_by_id = {
        row.get("criterion_id"): row for row in tables["evaluation_criteria.csv"] if row.get("criterion_id")
    }
    rules_by_id = {
        row.get("rule_id"): row for row in tables["evaluation_rules.csv"] if row.get("rule_id")
    }
    for row in tables["evaluation_rules.csv"]:
        rule_id = row.get("rule_id") or "<unknown>"
        rule_type = (row.get("rule_type") or "").strip()
        if rule_type not in SUPPORTED_EVALUATION_RULE_TYPES:
            errors.append(f"data/evaluation_rules.csv: {rule_id} unsupported rule_type {rule_type!r}")
        if not (row.get("source_id") or "").strip():
            errors.append(f"data/evaluation_rules.csv: {rule_id} missing source_id")
        if not row.get("locator"):
            errors.append(f"data/evaluation_rules.csv: {rule_id} lacks locator")
        if row.get("verification_state") not in {"fresh_verified", "previously_verified_source_unavailable"}:
            errors.append(f"data/evaluation_rules.csv: {rule_id} has unsupported verification_state")
        if not valid_date(row.get("collected_at") or ""):
            errors.append(f"data/evaluation_rules.csv: {rule_id} has invalid collected_at")
        criterion_id = (row.get("criterion_id") or "").strip()
        if criterion_id:
            criterion = evaluation_by_id.get(criterion_id)
            if not criterion:
                errors.append(f"data/evaluation_rules.csv: {rule_id} references unknown criterion_id {criterion_id!r}")
            elif criterion.get("case_id") != row.get("case_id"):
                errors.append(f"data/evaluation_rules.csv: {rule_id} criterion belongs to a different case")
        related = (row.get("related_rule_id") or "").strip()
        if related:
            related_row = rules_by_id.get(related)
            if not related_row:
                errors.append(f"data/evaluation_rules.csv: {rule_id} references unknown related_rule_id {related!r}")
            elif related_row.get("case_id") != row.get("case_id"):
                errors.append(f"data/evaluation_rules.csv: {rule_id} related rule belongs to a different case")
        if rule_type in {"minimum_total_score", "minimum_subtotal_score"}:
            if row.get("threshold_unit") not in {"points", "percent_of_total"}:
                errors.append(f"data/evaluation_rules.csv: {rule_id} threshold lacks supported unit")
            threshold = finite_decimal(row.get("threshold_value"))
            if threshold is None or threshold < 0:
                errors.append(f"data/evaluation_rules.csv: {rule_id} invalid numeric threshold_value")
            if not (row.get("aggregation_scope") or "").strip():
                errors.append(f"data/evaluation_rules.csv: {rule_id} missing aggregation_scope")
        if row.get("rule_type") == "stage_relation":
            if not criterion_id or row.get("effect") not in {"included_in_final_total", "reused_without_recalculation"} or not row.get("notes"):
                errors.append(f"data/evaluation_rules.csv: {rule_id} stage relation lacks criterion/effect/notes")
        if rule_type in {"proposal_ceiling", "planned_price"}:
            if not row.get("amount_jpy") or row.get("tax_basis") not in {"tax_included", "tax_excluded", "unknown"}:
                errors.append(f"data/evaluation_rules.csv: {rule_id} monetary boundary lacks amount/tax basis")
        if (row.get("amount_jpy") or "").strip():
            amount = finite_decimal(row.get("amount_jpy"))
            if amount is None or amount <= 0 or amount != amount.to_integral_value():
                errors.append(f"data/evaluation_rules.csv: {rule_id} invalid positive integer amount_jpy")
        if rule_type == "tie_break_rule":
            order = (row.get("rule_order") or "").strip()
            if not order.isascii() or not order.isdecimal() or int(order or "0") <= 0:
                errors.append(f"data/evaluation_rules.csv: {rule_id} invalid positive integer rule_order")
        source = sources_by_id.get(row.get("source_id"))
        if source and source.get("case_id") != row.get("case_id"):
            errors.append(f"data/evaluation_rules.csv: {rule_id} source belongs to a different case")
        if source and source.get("access_state") != "accessible" and row.get("verification_state") == "fresh_verified":
            errors.append(f"data/evaluation_rules.csv: {rule_id} marks unavailable source as fresh_verified")

    for name in ["effective_requirements.csv", "evidence_coverage.csv", "case_evidence_summary.csv", "specialized_requirements.csv"]:
        for row in tables[name]:
            value = (row.get("public_reconstructability") or "").strip()
            if value and value not in RECONSTRUCTABILITY:
                errors.append(
                    f"data/{name}: unsupported public_reconstructability {value!r} "
                    f"for case {(row.get('case_id') or '').strip()!r}"
                )

    for row in tables["source_documents.csv"]:
        source_id = (row.get("source_id") or "").strip()
        access_state = (row.get("access_state") or "").strip()
        snapshot_status = (row.get("snapshot_status") or "").strip()
        snapshot_hash = (row.get("snapshot_hash") or "").strip()
        snapshot_locator = (row.get("snapshot_locator") or "").strip()
        url = (row.get("url") or "").strip()

        if access_state not in {"accessible", "source_unavailable", "not_public"}:
            errors.append(f"data/source_documents.csv: invalid access_state for {source_id}")
        if snapshot_hash and not re.fullmatch(r"sha256:[a-f0-9]{64}", snapshot_hash):
            errors.append(f"data/source_documents.csv: invalid SHA-256 for {source_id}")
        if snapshot_locator and not re.fullmatch(r"github-draft-release:source-snapshots-private/SRC-[A-Za-z0-9._-]+", snapshot_locator):
            errors.append(f"data/source_documents.csv: unsafe or unsupported snapshot locator for {source_id}")
        if snapshot_status != "snapshotted" and (snapshot_hash or snapshot_locator):
            errors.append(f"data/source_documents.csv: unpreserved state has snapshot metadata for {source_id}")
        if snapshot_status == "snapshot_pending" and (access_state != "accessible" or not url.startswith("https://")):
            errors.append(f"data/source_documents.csv: ineligible pending source {source_id}")

        if snapshot_status not in SNAPSHOT_STATUSES:
            errors.append(
                f"data/source_documents.csv: unsupported snapshot_status "
                f"{snapshot_status!r} for source {source_id!r}"
            )
        if snapshot_status == "snapshotted" and (not snapshot_hash or not snapshot_locator):
            errors.append(
                f"data/source_documents.csv: snapshotted source {source_id!r} "
                "must have both snapshot_hash and snapshot_locator"
            )
        if snapshot_status == "snapshotted" and snapshot_hash and snapshot_locator:
            asset = snapshot_locator.rsplit("/", 1)[-1]
            if not asset.startswith(source_id + "-") or snapshot_hash.removeprefix("sha256:") not in asset:
                errors.append(f"data/source_documents.csv: snapshot locator identity/hash mismatch for {source_id}")
        if access_state == "not_public" and snapshot_status != "not_public":
            errors.append(f"data/source_documents.csv: not_public source has incompatible snapshot state for {source_id}")
        if snapshot_status == "external_url_only" and not url:
            errors.append(
                f"data/source_documents.csv: external_url_only source {source_id!r} "
                "must have a URL"
            )
        if snapshot_status == "not_public" and access_state != "not_public":
            errors.append(
                f"data/source_documents.csv: snapshot_status=not_public for source "
                f"{source_id!r} requires access_state=not_public"
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
