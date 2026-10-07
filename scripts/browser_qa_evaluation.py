#!/usr/bin/env python3
"""Production Chromium regression for the public evaluation page.

Exit: 0=assertions pass; 1=rendered application assertion failed;
2=production/network/browser environment blocked. Screenshots are
evidence for subsequent human visual review, not automatic visual approval.
"""
import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

from playwright.sync_api import sync_playwright

URL = "https://josh-temple.github.io/public-sector-ai-procurement-japan/evaluation.html"
CASES = [
    ("yaizu-2025-genai-service", "焼津"),
    ("matsue-2026-genai-support", "松江"),
    ("sendai-2025-genai-pilot", "仙台2025"),
    ("sendai-2026-genai-service", "仙台2026"),
    ("oumi-2026-joint-genai", "おうみ"),
    ("gosen-2026-genai-service", "五泉"),
]
VIEWPORTS = [("desktop-1280", 1280, 900, False),
             ("mobile-360", 360, 780, True),
             ("mobile-390", 390, 844, True),
             ("desktop-narrow-640", 640, 450, False)]


def case_block(page, title):
    return page.locator("#evaluation-case-detail .evaluation-case-block").filter(
        has=page.locator("h3", has_text=title)).first


def git_blob_sha(raw):
    return hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default=URL)
    parser.add_argument("--expected-js-blob-sha", required=True)
    parser.add_argument("--output-dir", default="evaluation-browser-qa")
    args = parser.parse_args()
    out = Path(args.output_dir)
    out.mkdir(parents=True, exist_ok=True)
    results = []
    metadata = {"url": args.url, "timestamp_utc": datetime.now(timezone.utc).isoformat(),
                "expected_js_blob_sha": args.expected_js_blob_sha,
                "served_js_blob_sha": None, "browser": None, "environment_blocker": None}
    blocked = False

    def record(view, case, check, passed, detail=""):
        results.append({"viewport": view, "case": case, "check": check,
                        "status": "PASS" if passed else "FAIL", "detail": str(detail)[:800]})

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
            metadata["browser"] = "Chromium " + browser.version
            for view, width, height, mobile in VIEWPORTS:
                context = browser.new_context(
                    viewport={"width": width, "height": height},
                    device_scale_factor=2 if mobile else 1,
                    is_mobile=mobile, has_touch=mobile, locale="ja-JP")
                page = context.new_page()
                exceptions = []
                page.on("pageerror", lambda error: exceptions.append(str(error)))
                try:
                    response = page.goto(args.url, wait_until="domcontentloaded", timeout=30000)
                    if not response or response.status != 200:
                        raise RuntimeError("HTTP navigation response is not 200")
                    page.wait_for_function(
                        "() => document.querySelectorAll('#evaluation-case-select option').length >= 6",
                        timeout=30000)
                except Exception as error:
                    blocked = True
                    metadata["environment_blocker"] = str(error).splitlines()[0]
                    record(view, "ENV", "production_navigable", False, metadata["environment_blocker"])
                    context.close()
                    break
                record(view, "ENV", "production_navigable", True)
                if view == "desktop-1280":
                    try:
                        js_response = page.request.get(
                            args.url.rsplit("/", 1)[0] + "/assets/evaluation.js", timeout=30000)
                        if js_response.status != 200:
                            raise RuntimeError("deployed JS HTTP " + str(js_response.status))
                        metadata["served_js_blob_sha"] = git_blob_sha(js_response.body())
                        record(view, "ENV", "served_js_matches_main", 
                               metadata["served_js_blob_sha"] == args.expected_js_blob_sha,
                               metadata["served_js_blob_sha"])
                    except Exception as error:
                        record(view, "ENV", "served_js_matches_main", False, str(error))
                picker = page.locator("#evaluation-case-select")
                picker_size = picker.bounding_box()
                record(view, "ENV", "picker_accessible",
                       bool(picker_size and picker_size["height"] >= 44), picker_size)
                for case_id, label in CASES:
                    try:
                        picker.select_option(case_id)
                        root = page.locator("#evaluation-case-detail")
                        page.wait_for_function(
                            "(name) => (document.querySelector('#evaluation-case-detail .evaluation-case-header')?.textContent || '').includes(name)",
                            arg=("焼津" if label == "焼津" else "松江" if label == "松江"
                                 else "仙台" if label.startswith("仙台") else label),
                            timeout=10000)
                        record(view, label, "case_selector_and_render", True)
                        rules = case_block(page, "選定・価格ルール").inner_text()
                        price = case_block(page, "価格の扱い").inner_text()
                        relations = root.locator(".evaluation-stage-relations").inner_text() if root.locator(".evaluation-stage-relations").count() else ""
                        if label == "焼津":
                            record(view, label, "price_10_of_100", "10 / 100" in price and "価格評価" in price, price)
                            record(view, label, "case_total_threshold", "案件全体の満点" in rules and "60%" in rules, rules)
                        if label == "松江":
                            record(view, label, "price_10_of_80", "10 / 80" in price and "書類審査" in price, price)
                            record(view, label, "per_evaluator_threshold", "各委員の合計得点" in rules and "60%" in rules, rules)
                            record(view, label, "stage_inclusion", "80" in relations and "200" in relations and "加算しない" in relations, relations)
                        if label.startswith("仙台"):
                            record(view, label, "committee_aggregate_threshold",
                                   "評価委員の合計得点" in rules and "60%" in rules, rules)
                        if label == "おうみ":
                            record(view, label, "420_on_700_subtotal",
                                   "700点" in rules and "420" in rules and "1000点の42%" not in rules, rules)
                            gates = case_block(page, "参加資格").inner_text()
                            record(view, label, "joint_qualification_satisfaction",
                                   "充足方法" in gates and "実績" in gates and "どちらか一方" in gates, gates)
                        if label == "五泉":
                            record(view, label, "price_reuse", "再計算せず" in relations and "200/1000" in relations, relations)
                        if label in ("焼津", "松江", "仙台2025", "仙台2026", "おうみ"):
                            record(view, label, "official_rule_locator",
                                   "該当箇所：" in rules and "https://" not in rules, rules[:350])
                        record(view, label, "official_source_anchor",
                               root.locator('a[target="_blank"][href^="https://"]').count() > 0)
                        stage = root.locator(".evaluation-stage")
                        if stage.count():
                            stage.first.locator("summary").click()
                            record(view, label, "stage_expands", stage.first.get_attribute("open") is not None)
                        dims = page.evaluate(
                            "() => ({viewport: document.documentElement.clientWidth, "
                            "scroll: document.documentElement.scrollWidth})")
                        record(view, label, "no_horizontal_page_overflow",
                               dims["scroll"] <= dims["viewport"] + 2, dims)
                        page.screenshot(path=str(out / (view + "_" + case_id + ".png")),
                                        full_page=True, timeout=20000)
                        record(view, label, "screenshot_saved", True)
                    except Exception as error:
                        record(view, label, "case_interaction", False, str(error))
                if view == "desktop-1280":
                    try:
                        picker.select_option("matsue-2026-genai-support")
                        share = page.locator("#evaluation-share-link")
                        share_url = share.get_attribute("href")
                        record(view, "SHARING", "topic_case_url",
                               "case=matsue-2026-genai-support" in share_url
                               and "topic=rag-grounding" in share_url, share_url)
                        page.goto(share_url, wait_until="domcontentloaded", timeout=30000)
                        page.wait_for_function(
                            "() => document.querySelector('#evaluation-case-select')?.value === 'matsue-2026-genai-support'",
                            timeout=12000)
                        record(view, "SHARING", "deep_link_roundtrip", True)
                        with page.expect_download(timeout=12000) as memo_event:
                            page.locator("#evaluation-memo-download").click()
                        download = memo_event.value
                        memo_path = out / "evaluation-note-matsue-2026-genai-support.md"
                        download.save_as(str(memo_path))
                        memo_text = memo_path.read_text(encoding="utf-8")
                        record(view, "SHARING", "memo_export_has_evidence",
                               download.suggested_filename == memo_path.name
                               and "10 / 80点" in memo_text
                               and "該当箇所：" in memo_text
                               and "資料取得日：" in memo_text
                               and "横断的な配点基準" in memo_text,
                               "markdown bytes " + str(len(memo_text)))
                    except Exception as error:
                        record(view, "SHARING", "share_or_memo_export", False, str(error))
                try:
                    link = page.locator('#evaluation-case-detail .evaluation-case-source-links a[target="_blank"]').first
                    with page.expect_popup(timeout=8000) as popup_event:
                        link.click(timeout=8000)
                    popup = popup_event.value
                    record(view, "ENV", "official_source_popup",
                           popup is not None and link.get_attribute("href").startswith("https://"))
                    popup.close()
                except Exception as error:
                    record(view, "ENV", "official_source_popup", False, str(error))
                record(view, "ENV", "no_client_page_errors", not exceptions, exceptions)
                context.close()
            browser.close()
    except Exception as error:
        blocked = True
        metadata["environment_blocker"] = str(error).splitlines()[0]
        record("ENV", "ENV", "chromium_runner", False, metadata["environment_blocker"])
    report = {"metadata": metadata, "checks": results,
              "passed": sum(row["status"] == "PASS" for row in results),
              "failed": sum(row["status"] == "FAIL" for row in results)}
    (out / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"metadata": metadata, "passed": report["passed"],
                      "failed": report["failed"],
                      "failed_checks": [r for r in results if r["status"] == "FAIL"]}, ensure_ascii=False, indent=2))
    return 2 if blocked else (1 if report["failed"] else 0)


if __name__ == "__main__":
    sys.exit(main())
