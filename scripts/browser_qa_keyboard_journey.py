#!/usr/bin/env python3
"""PR localhost Chromium acceptance: journeys, focus, and real UTF-8 Markdown files.

This is not a device, native zoom, screen reader, or first-time human acceptance test.
"""
import argparse
import csv
import json
from pathlib import Path
from urllib.parse import quote
from playwright.sync_api import sync_playwright


def rows(path):
    with open(path, encoding="utf-8-sig", newline="") as stream:
        return list(csv.DictReader(stream))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://127.0.0.1:8765/")
    parser.add_argument("--output-dir", default="keyboard-journey-pr-qa")
    args = parser.parse_args()
    assert args.url.startswith(("http://127.0.0.1:", "http://localhost:")), "PR-only localhost suite"
    base = args.url.rstrip("/") + "/"
    dest = Path(args.output_dir)
    dest.mkdir(parents=True, exist_ok=True)
    cases = {row["case_id"]: row for row in rows("data/cases.csv")}
    criteria = rows("data/evaluation_criteria.csv")
    source_rows = rows("data/source_documents.csv")
    findings = []

    def report(fixture, fn):
        try:
            detail = fn()
            findings.append({"fixture": fixture, "status": "PASS", "detail": detail})
        except Exception as exc:
            findings.append({"fixture": fixture, "status": "FAIL", "reason": str(exc)[:600]})

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, args=["--no-sandbox"])

        def compare_at_width(width):
            context = browser.new_context(viewport={"width": width, "height": 820}, locale="ja-JP", accept_downloads=True)
            page = context.new_page()
            try:
                page.goto(base, wait_until="domcontentloaded")
                page.locator("#case-rows input.compare-check").nth(3).wait_for(timeout=30000)
                boxes = page.locator("#case-rows input.compare-check")
                boxes.nth(0).check()
                boxes.nth(1).check()
                assert page.locator("#compare-section").is_visible(), "2-case comparison not visible"
                assert page.locator("#compare-table tbody tr").count() == 12, "12 axes missing"
                assert page.locator("#compare-table thead th").count() == 3, "2-case headers wrong"
                boxes.nth(2).check()
                assert page.locator("#compare-table thead th").count() == 4, "3-case headers wrong"
                page.once("dialog", lambda dialog: dialog.accept())
                boxes.nth(3).click()
                assert page.locator("#compare-table thead th").count() == 4, "4th case changed compare matrix"
                assert not boxes.nth(3).is_checked(), "4th case remained selected"
                wrap = page.locator("#compare-table").locator("xpath=..")
                assert wrap.get_attribute("role") == "region", "comparison scroll region missing"
                assert wrap.get_attribute("tabindex") == "0", "comparison not keyboard focusable"
                page.locator("#clear-compare").click()
                assert not page.locator("#compare-section").is_visible(), "clear compare did not hide"
                assert page.evaluate("() => document.activeElement?.matches('#case-rows input.compare-check')") is True, "focus not restored after clear"
                return {"width": width, "axes": 12, "max_cases": 3, "focus_restored": True}
            finally:
                context.close()

        for width in (320, 360, 390, 1280):
            report("compare_2_3_4_focus_%d" % width, lambda width=width: compare_at_width(width))

        def dialog_focus():
            case_id = "oumi-2026-joint-genai"
            context = browser.new_context(viewport={"width": 390, "height": 820}, locale="ja-JP")
            page = context.new_page()
            try:
                page.goto(base + "?case=" + quote(case_id), wait_until="domcontentloaded")
                page.locator("#case-dialog").wait_for(state="visible", timeout=30000)
                assert page.locator("#case-dialog").get_attribute("aria-labelledby") == "case-dialog-title"
                page.locator("#case-dialog-evidence").click()
                page.locator("#evidence-dialog").wait_for(state="visible", timeout=10000)
                page.locator("#close-evidence").click()
                page.locator("#case-dialog").wait_for(state="visible", timeout=10000)
                assert page.evaluate("() => document.activeElement?.id") == "case-dialog-evidence", "nested dialog focus lost"
                page.keyboard.press("Escape")
                assert not page.locator("#case-dialog").is_visible(), "Escape did not close case dialog"
                return {"case_id": case_id, "nested_dialog_focus": "case-dialog-evidence", "escape": "closed"}
            finally:
                context.close()
        report("dialog_nested_focus_return_escape", dialog_focus)

        def evaluation_history():
            context = browser.new_context(viewport={"width": 390, "height": 820}, locale="ja-JP")
            page = context.new_page()
            try:
                page.goto(base + "evaluation.html", wait_until="domcontentloaded")
                selector = page.locator("#evaluation-case-select")
                selector.locator("option").nth(5).wait_for(timeout=30000)
                selector.select_option("matsue-2026-genai-support")
                link = page.locator("#evaluation-share-link")
                href = link.get_attribute("href")
                assert "case=matsue-2026-genai-support" in href
                assert "リンクを開く" in link.inner_text()
                assert page.locator(".evaluation-selection-raw summary").count() == 1, "unknown selection code is not in accessible details"
                assert "highest_combined_evaluation_to_first_priority_negotiator" not in page.locator(".evaluation-score").inner_text()
                raw = page.locator(".evaluation-selection-raw")
                raw.locator("summary").click()
                assert "highest_combined_evaluation_to_first_priority_negotiator" in raw.inner_text()
                second = context.new_page()
                second.goto(href, wait_until="domcontentloaded")
                second.locator("#evaluation-case-select option").nth(5).wait_for(timeout=30000)
                assert second.locator("#evaluation-case-select").input_value() == "matsue-2026-genai-support"
                second.reload(wait_until="domcontentloaded")
                second.locator("#evaluation-case-select option").nth(5).wait_for(timeout=30000)
                assert second.locator("#evaluation-case-select").input_value() == "matsue-2026-genai-support"
                second.goto(base + "methodology.html")
                second.go_back(wait_until="domcontentloaded")
                second.locator("#evaluation-case-select option").nth(5).wait_for(timeout=30000)
                assert second.locator("#evaluation-case-select").input_value() == "matsue-2026-genai-support"
                second.go_forward(wait_until="domcontentloaded")
                assert "methodology.html" in second.url
                return {"case_id": "matsue-2026-genai-support", "share": "new tab + reload + back + forward", "unknown_award": "raw value preserved"}
            finally:
                context.close()
        report("evaluation_share_reload_back_forward_unknown_award", evaluation_history)

        def real_markdown(case_id):
            context = browser.new_context(viewport={"width": 390, "height": 820}, locale="ja-JP", accept_downloads=True)
            page = context.new_page()
            try:
                page.goto(base + "evaluation.html?topic=usage-pricing&case=" + quote(case_id), wait_until="domcontentloaded")
                select = page.locator("#evaluation-case-select")
                select.locator("option").nth(5).wait_for(timeout=30000)
                assert select.input_value() == case_id
                with page.expect_download(timeout=20000) as info:
                    page.locator("#evaluation-memo-download").click()
                download = info.value
                assert download.suggested_filename == "evaluation-note-" + case_id + ".md"
                target = dest / download.suggested_filename
                download.save_as(str(target))
                content = target.read_text(encoding="utf-8")
                assert content.startswith("# 自治体AI調達"), "invalid markdown header"
                record = cases[case_id]
                assert record["government_name"] in content and record["procurement_title"] in content, "case metadata mismatch"
                assert "推奨" in content and "保証しません" in content, "scope boundary missing"
                expected_criteria = [row for row in criteria if row["case_id"] == case_id]
                for criterion in expected_criteria:
                    assert criterion["criterion_summary"] in content, "criterion missing: " + criterion["criterion_id"]
                    if criterion["points"] and criterion["total_points"]:
                        assert (criterion["points"] + " / " + criterion["total_points"] + "点") in content, "score denominator missing"
                registered_urls = {row["source_url"] for row in expected_criteria if row["source_url"]}
                listed = [row for row in source_rows if row["url"] in registered_urls and row["url"]]
                if listed:
                    assert any(row["title"] in content for row in listed), "registered source title missing"
                assert "undefined" not in content and "javascript:alert" not in content
                return {"case_id": case_id, "file": str(target), "bytes": target.stat().st_size,
                        "criteria_checked": len(expected_criteria), "registered_sources": len(listed)}
            finally:
                context.close()

        for case_id in ("matsue-2026-genai-support", "oumi-2026-joint-genai", "sendai-2026-genai-service"):
            report("real_markdown_" + case_id, lambda case_id=case_id: real_markdown(case_id))

        browser.close()

    summary = {"PASS": sum(x["status"] == "PASS" for x in findings),
               "FAIL": sum(x["status"] == "FAIL" for x in findings)}
    (dest / "acceptance.json").write_text(json.dumps(
        {"target": base, "scope": "PR localhost Chromium only; not Android, native zoom, AT or human",
         "summary": summary, "findings": findings}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary))
    return int(summary["FAIL"] > 0)


if __name__ == "__main__":
    raise SystemExit(main())
