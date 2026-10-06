#!/usr/bin/env python3
"""Validate the static public site using repository-local evidence only."""

from __future__ import annotations

import csv
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "https://josh-temple.github.io/public-sector-ai-procurement-japan/"
PUBLIC_PAGES = {
    "index.html": BASE_URL,
    "insights.html": BASE_URL + "insights.html",
    "case-study.html": BASE_URL + "case-study.html",
    "checklist.html": BASE_URL + "checklist.html",
    "drafting.html": BASE_URL + "drafting.html",
    "methodology.html": BASE_URL + "methodology.html",
}
REQUIRED_FILES = {
    "index.html",
    "insights.html",
    "checklist.html",
    "drafting.html",
    "methodology.html",
    "robots.txt",
    "sitemap.xml",
    "assets/app.js",
    "assets/drafting.js",
    "assets/site.css",
    "data/cases.csv",
    "data/effective_requirements.csv",
    "data/evaluation_criteria.csv",
    "data/specialized_requirements.csv",
    "data/source_documents.csv",
    "data/case_evidence_summary.csv",
}


class LocalReferenceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_map = dict(attrs)
        for attr in ("href", "src"):
            value = attrs_map.get(attr)
            if value:
                self.refs.append((attr, value))


def local_path(page: Path, ref: str) -> Path | None:
    if ref.startswith(("#", "http://", "https://", "mailto:", "tel:", "data:", "javascript:")):
        return None
    path = urlsplit(ref).path
    if not path:
        return None
    if path.startswith("/"):
        return ROOT / path.lstrip("/")
    return (page.parent / path).resolve()


def main() -> int:
    errors: list[str] = []

    for rel in sorted(REQUIRED_FILES):
        if not (ROOT / rel).is_file():
            errors.append(f"missing required file: {rel}")

    cases_path = ROOT / "data/cases.csv"
    case_ids: set[str] = set()
    if cases_path.is_file():
        with cases_path.open(encoding="utf-8-sig", newline="") as fh:
            for row in csv.DictReader(fh):
                case_id = (row.get("case_id") or "").strip()
                if not case_id:
                    errors.append("data/cases.csv contains an empty case_id")
                elif case_id in case_ids:
                    errors.append(f"duplicate case_id in data/cases.csv: {case_id}")
                else:
                    case_ids.add(case_id)

    source_ids: set[str] = set()
    sources_path = ROOT / "data/source_documents.csv"
    if sources_path.is_file():
        with sources_path.open(encoding="utf-8-sig", newline="") as fh:
            reader = csv.DictReader(fh)
            source_fields = set(reader.fieldnames or [])
            for required in {"source_id", "document_type", "title", "url", "published_at", "retrieved_at"}:
                if required not in source_fields:
                    errors.append(f"data/source_documents.csv missing public-site field: {required}")
            for row in reader:
                source_id = (row.get("source_id") or "").strip()
                if source_id:
                    source_ids.add(source_id)

    effective_path = ROOT / "data/effective_requirements.csv"
    if effective_path.is_file():
        required_fields = {
            "effective_requirement_id", "case_id", "requirement_area", "requirement_key",
            "original_value", "effective_value", "change_type", "base_source_id",
            "changed_by_source_id", "scope", "condition", "applicability_stage",
            "public_reconstructability",
        }
        with effective_path.open(encoding="utf-8-sig", newline="") as fh:
            reader = csv.DictReader(fh)
            effective_fields = set(reader.fieldnames or [])
            for required in sorted(required_fields - effective_fields):
                errors.append(f"data/effective_requirements.csv missing public-site field: {required}")
            for row in reader:
                requirement_id = (row.get("effective_requirement_id") or "").strip() or "<unknown>"
                case_id = (row.get("case_id") or "").strip()
                if case_id not in case_ids:
                    errors.append(f"{requirement_id}: unknown case_id for requirement explorer: {case_id}")
                base_source_id = (row.get("base_source_id") or "").strip()
                if not base_source_id:
                    errors.append(f"{requirement_id}: requirement explorer requires base_source_id")
                elif base_source_id not in source_ids:
                    errors.append(f"{requirement_id}: unknown base_source_id: {base_source_id}")
                changed_source_id = (row.get("changed_by_source_id") or "").strip()
                if changed_source_id and changed_source_id not in source_ids:
                    errors.append(f"{requirement_id}: unknown changed_by_source_id: {changed_source_id}")

    for rel, expected_url in PUBLIC_PAGES.items():
        page = ROOT / rel
        if not page.is_file():
            continue
        text = page.read_text(encoding="utf-8")
        canonical = f'<link rel="canonical" href="{expected_url}">'
        og_url = f'<meta property="og:url" content="{expected_url}">'
        if canonical not in text:
            errors.append(f"{rel}: canonical URL is missing or unexpected")
        if og_url not in text:
            errors.append(f"{rel}: og:url is missing or unexpected")

        parser = LocalReferenceParser()
        parser.feed(text)
        for attr, ref in parser.refs:
            target = local_path(page, ref)
            if target is not None and not target.exists():
                errors.append(f"{rel}: broken local {attr} reference: {ref}")

        for case_id in re.findall(r"[?&]case=([A-Za-z0-9._-]+)", text):
            if case_id not in case_ids:
                errors.append(f"{rel}: deep link references unknown case_id: {case_id}")

    app_path = ROOT / "assets/app.js"
    if app_path.is_file():
        app_text = app_path.read_text(encoding="utf-8")
        data_refs = sorted(set(re.findall(r'["\'](\\?\./data/[^"\']+\.csv)["\']', app_text)))
        if not data_refs:
            errors.append("assets/app.js: no data CSV references found")
        for ref in data_refs:
            normalized = ref.replace("\\", "")
            target = ROOT / normalized.removeprefix("./")
            if not target.is_file():
                errors.append(f"assets/app.js: missing declared data file: {normalized}")

    index_path = ROOT / "index.html"
    if index_path.is_file():
        index_text = index_path.read_text(encoding="utf-8")
        for marker in (
            'id="requirement-explorer"',
            'id="requirement-query"',
            'id="requirement-topic"',
            'id="requirement-amended"',
            'id="requirement-change"',
            'id="requirement-rows"',
            'id="requirement-result-count"',
            "横断要件プロファイル",
            "当初記載と有効要件",
        ):
            if marker not in index_text:
                errors.append(f"index.html: requirement explorer marker missing: {marker}")

    if app_path.is_file():
        for marker in (
            "const REQUIREMENT_TOPICS",
            "function renderRequirementExplorer",
            "function requirementTopicMatches",
            'params.set("topic", topic)',
            'params.set("rq", requirementQuery)',
            'params.set("amended", amended)',
            'params.set("change", changeType)',
            "requirementKeywordMatches",
            "requirementChangeSourceKind",
            "requirementMatchesExplorerFilters",
            "sourceDocumentRoleLabel",
            "requirementBoundaryText",
            "caseBoundaryText",
            "appendRequirementSourceLink",
        ):
            if marker not in app_text:
                errors.append(f"assets/app.js: requirement explorer behavior missing: {marker}")
        for forbidden in ("evidence.blocking_roles", "source.access_state"):
            if forbidden in app_text:
                errors.append(f"assets/app.js: raw internal evidence state exposed in public UI: {forbidden}")

    drafting_path = ROOT / "drafting.html"
    drafting_js_path = ROOT / "assets/drafting.js"
    if drafting_path.is_file():
        drafting_text = drafting_path.read_text(encoding="utf-8")
        for marker in (
            'id="drafting-topic-links"',
            'id="drafting-sections"',
            'id="citizen-examples"',
            'id="role-examples"',
            "仕様へ落とす",
            "自団体で埋める変数",
        ):
            if marker not in drafting_text:
                errors.append(f"drafting.html: required marker missing: {marker}")

    if drafting_js_path.is_file():
        drafting_js = drafting_js_path.read_text(encoding="utf-8")
        for marker in (
            "const DRAFTING_DECISIONS",
            "const CITIZEN_SPECIALIZED",
            "const ROLE_EXAMPLES",
            "data/effective_requirements.csv",
            "data/evaluation_criteria.csv",
            "data/specialized_requirements.csv",
            "caseBoundaryText",
            "effectiveSourceId",
        ):
            if marker not in drafting_js:
                errors.append(f"assets/drafting.js: drafting support behavior missing: {marker}")

        data_refs = sorted(set(re.findall(r'["\'](\\?\./data/[^"\']+\.csv)["\']', drafting_js)))
        if not data_refs:
            errors.append("assets/drafting.js: no data CSV references found")
        for ref in data_refs:
            normalized = ref.replace("\\", "")
            target = ROOT / normalized.removeprefix("./")
            if not target.is_file():
                errors.append(f"assets/drafting.js: missing declared data file: {normalized}")

        for forbidden in ("snapshot_locator", "blocking_roles", "source.access_state"):
            if forbidden in drafting_js:
                errors.append(f"assets/drafting.js: internal-only evidence state exposed in drafting UI: {forbidden}")

    robots_path = ROOT / "robots.txt"
    if robots_path.is_file():
        robots = robots_path.read_text(encoding="utf-8")
        expected = f"Sitemap: {BASE_URL}sitemap.xml"
        if expected not in robots:
            errors.append("robots.txt: sitemap URL is missing or unexpected")

    sitemap_path = ROOT / "sitemap.xml"
    if sitemap_path.is_file():
        try:
            tree = ET.parse(sitemap_path)
            ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
            urls = {node.text.strip() for node in tree.findall(".//sm:loc", ns) if node.text}
            expected_urls = set(PUBLIC_PAGES.values())
            if urls != expected_urls:
                errors.append(
                    "sitemap.xml: URL set differs from stable public pages "
                    f"(expected={sorted(expected_urls)}, actual={sorted(urls)})"
                )
        except ET.ParseError as exc:
            errors.append(f"sitemap.xml: invalid XML: {exc}")

    if errors:
        print("PUBLIC_SITE_VALIDATION_FAILED")
        for error in errors:
            print(f"- {error}")
        return 1

    print(
        "PUBLIC_SITE_VALIDATION_PASS "
        f"pages={len(PUBLIC_PAGES)} cases={len(case_ids)}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
