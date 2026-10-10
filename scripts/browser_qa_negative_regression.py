#!/usr/bin/env python3
"""PR-only HTTP/DOM fault injection. Never use against the public Pages endpoint."""
import argparse
import csv
import io
import json
from pathlib import Path
from playwright.sync_api import sync_playwright


def read_csv(path):
    with open(path, encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def to_csv(rows):
    out = io.StringIO(newline="")
    writer = csv.DictWriter(out, fieldnames=list(rows[0]))
    writer.writeheader()
    writer.writerows(rows)
    return out.getvalue()


def exercise(page, base_url, name, effective=None, sources=None, cases=None, status=200):
    response_urls = {
        "effective_requirements.csv": (effective, status),
        "source_documents.csv": (sources, 200),
        "cases.csv": (cases, 200),
    }
    for filename, (body, code) in response_urls.items():
        if body is None and code == 200:
            continue

        def responder(route, request=None, *, content=body or "", status_code=code):
            route.fulfill(status=status_code, content_type="text/csv; charset=utf-8", body=content)

        page.route("**/data/" + filename, responder)
    errors = []
    page.on("pageerror", lambda exc: errors.append(str(exc)))
    response = page.goto(base_url, wait_until="domcontentloaded", timeout=45000)
    assert response is not None and response.status == 200, name + " page unavailable"
    return errors


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://127.0.0.1:8765/")
    parser.add_argument("--output-dir", default="negative-requirements-pr-qa")
    args = parser.parse_args()
    assert args.url.startswith(("http://127.0.0.1:", "http://localhost:")), "fault injection is localhost only"
    dest = Path(args.output_dir)
    dest.mkdir(parents=True, exist_ok=True)
    original_effective = read_csv("data/effective_requirements.csv")
    original_sources = read_csv("data/source_documents.csv")
    original_cases = read_csv("data/cases.csv")
    assert len(original_effective) == 135
    findings = []

    def report(name, fn):
        try:
            fn()
            findings.append({"fixture": name, "status": "PASS"})
        except Exception as exc:
            findings.append({"fixture": name, "status": "FAIL", "reason": str(exc).splitlines()[0]})

    with sync_playwright() as engine:
        browser = engine.chromium.launch(headless=True, args=["--no-sandbox"])

        def page_for(name, effective=None, sources=None, cases=None, status=200):
            context = browser.new_context(viewport={"width": 360, "height": 800}, locale="ja-JP")
            page = context.new_page()
            errors = exercise(page, args.url, name, effective=effective, sources=sources, cases=cases, status=status)
            return context, page, errors

        def unsafe_source_enum_and_xss():
            effective = [dict(r) for r in original_effective]
            sources = [dict(r) for r in original_sources]
            cases = [dict(r) for r in original_cases]
            row = next(r for r in effective if r["effective_requirement_id"] == "EFF-oumi-template-count")
            row["change_type"] = "synthetic_change_unknown"
            row["effective_status"] = "synthetic_status_unknown"
            row["effective_value"] = ""
            row["scope"] = '<img src=x onerror=window.__xssTriggered=true>'
            source = next(r for r in sources if r["source_id"] == "SRC-oumi-2026-qa")
            source["url"] = "javascript:alert(1)"
            source["title"] = '<svg onload=window.__xssTriggered=true>'
            case = next(r for r in cases if r["case_id"] == "oumi-2026-joint-genai")
            case["category"] = "synthetic_category_unknown"
            context, page, errors = page_for("unsafe_source_enum_and_xss",
                effective=to_csv(effective), sources=to_csv(sources), cases=to_csv(cases))
            try:
                row_el = page.locator('#requirement-rows tr[data-effective-id="EFF-oumi-template-count"]')
                row_el.wait_for(timeout=20000)
                assert "反映後の記載は未登録" in row_el.locator('[data-field="effective"]').inner_text()
                assert "synthetic_status_unknown" in row_el.locator('[data-field="effective"]').inner_text()
                assert "synthetic_change_unknown" in row_el.locator('[data-field="change"]').inner_text()
                assert "<img src=x" in row_el.inner_text()
                assert row_el.locator("img, svg").count() == 0
                changed = row_el.locator('[data-source-role="changed"]')
                assert changed.count() == 1 and changed.evaluate("(el) => el.tagName") == "SPAN"
                assert changed.get_attribute("href") is None
                assert "公式URL未登録" in row_el.locator('[data-field="sources"]').inner_text()
                assert page.evaluate("() => window.__xssTriggered === undefined")
                assert page.locator("#case-rows").inner_text().find("synthetic_category_unknown") >= 0
                assert "未整理" in page.locator("#case-rows").inner_text()
                assert not errors, str(errors)
            finally:
                context.close()

        def missing_source_id():
            effective = [dict(r) for r in original_effective]
            row = next(r for r in effective if r["effective_requirement_id"] == "EFF-oumi-template-count")
            row["changed_by_source_id"] = "SRC-SYNTHETIC-NOT-FOUND"
            context, page, errors = page_for("missing_source_id", effective=to_csv(effective))
            try:
                entry = page.locator('#requirement-rows tr[data-effective-id="EFF-oumi-template-count"]')
                entry.wait_for(timeout=20000)
                changed = entry.locator('[data-source-role="changed"]')
                assert changed.count() == 1 and changed.get_attribute("href") is None
                assert "資料参照先未登録" in entry.locator('[data-field="sources"]').inner_text()
                assert not errors, str(errors)
            finally:
                context.close()

        def csv_failure(code):
            context, page, errors = page_for("http_" + str(code), effective="", status=code)
            try:
                page.wait_for_function("() => document.querySelector('#requirement-result-count')?.textContent?.includes('要件データの読み込みに失敗しました。')", timeout=20000)
                assert page.locator('#requirement-rows tr[data-effective-id]').count() == 0
                assert not page.locator("#requirement-empty").is_visible()
            finally:
                context.close()

        def malformed_csv():
            context, page, errors = page_for("malformed_csv", effective='case_id,value\n"x,malformed')
            try:
                page.wait_for_function("() => document.querySelector('#requirement-result-count')?.textContent?.includes('要件データの読み込みに失敗しました。')", timeout=20000)
                assert page.locator('#requirement-rows tr[data-effective-id]').count() == 0
                assert not page.locator("#requirement-empty").is_visible()
            finally:
                context.close()

        report("unsafe_source_enum_xss_empty_effective", unsafe_source_enum_and_xss)
        report("unknown_source_id", missing_source_id)
        report("http_404_not_zero_results", lambda: csv_failure(404))
        report("http_500_not_zero_results", lambda: csv_failure(500))
        report("malformed_csv_not_zero_results", malformed_csv)
        browser.close()
    result = {"url": args.url, "browser": "headless Chromium CSS 360px, not Android or AT",
              "summary": {s: sum(x["status"] == s for x in findings) for s in ("PASS", "FAIL")},
              "findings": findings}
    (dest / "negative-regression.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(result["summary"]))
    return 1 if result["summary"]["FAIL"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
