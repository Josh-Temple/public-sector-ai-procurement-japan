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
             ("mobile-320", 320, 640, True),
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
    parser.add_argument("--expected-home-blob-sha", default=None)
    parser.add_argument("--expected-app-js-blob-sha", default=None)
    parser.add_argument("--expected-drafting-html-blob-sha", default=None)
    parser.add_argument("--expected-evaluation-html-blob-sha", default=None)
    parser.add_argument("--expected-drafting-js-blob-sha", default=None)
    parser.add_argument("--expected-css-blob-sha", default=None)
    parser.add_argument("--output-dir", default="evaluation-browser-qa")
    args = parser.parse_args()
    out = Path(args.output_dir)
    out.mkdir(parents=True, exist_ok=True)
    results = []
    metadata = {"url": args.url, "timestamp_utc": datetime.now(timezone.utc).isoformat(),
                "expected_js_blob_sha": args.expected_js_blob_sha,
                "served_js_blob_sha": None, "served_home_blob_sha": None, "served_app_js_blob_sha": None, "browser": None, "environment_blocker": None}
    metadata["served_extra_blobs"] = {}
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
                # A long evidence article must not be a live region.
                live = page.evaluate("""() => {
                  const ids = ['evaluation-topic-links','evaluation-topic-detail','evaluation-case-detail'];
                  const status = document.getElementById('evaluation-update-status');
                  return {contentLive: ids.map(id => document.getElementById(id)?.hasAttribute('aria-live')),
                          statusRole: status?.getAttribute('role'), statusLive: status?.getAttribute('aria-live'),
                          text: status?.textContent || ''};
                }""")
                record(view, "A11Y", "evaluation_short_live_status",
                       live["contentLive"] == [False, False, False]
                       and live["statusRole"] == "status" and live["statusLive"] == "polite"
                       and 0 < len(live["text"]) <= 90, live)
                if view == "desktop-1280":
                    base = args.url.rsplit("/", 1)[0]
                    for asset, expected in [
                        ("drafting.html", args.expected_drafting_html_blob_sha),
                        ("evaluation.html", args.expected_evaluation_html_blob_sha),
                        ("assets/drafting.js", args.expected_drafting_js_blob_sha),
                        ("assets/site.css", args.expected_css_blob_sha),
                    ]:
                        if not expected:
                            continue
                        try:
                            asset_response = page.request.get(base + "/" + asset, timeout=30000)
                            served = git_blob_sha(asset_response.body()) if asset_response.status == 200 else ""
                            metadata["served_extra_blobs"][asset] = served
                            record(view, "DEPLOY", asset + "_matches_main",
                                   asset_response.status == 200 and served == expected, served)
                        except Exception as error:
                            record(view, "DEPLOY", asset + "_matches_main", False, str(error))
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
                # Validate the public home task flow against actual served HTML and JS.
                home = context.new_page()
                home_errors = []
                home.on("pageerror", lambda error: home_errors.append(str(error)))
                try:
                    home_url = args.url.rsplit("/", 1)[0] + "/index.html"
                    home_response = home.goto(home_url, wait_until="domcontentloaded", timeout=30000)
                    if not home_response or home_response.status != 200:
                        raise RuntimeError("home HTTP status not 200")
                    home.wait_for_function("() => document.querySelectorAll('#case-rows tr').length > 0", timeout=30000)
                    home_text = home.locator(".hero").inner_text()
                    for label in ("調達事例を探す", "仕様の条件を比較する", "評価基準を調べる"):
                        record(view, "HOME", "main_action_" + label, label in home_text)
                    actions = home.locator(".primary-actions a")
                    hrefs = actions.evaluate_all("(nodes) => nodes.map(n => n.getAttribute('href'))")
                    record(view, "HOME", "task_link_destinations",
                           hrefs == ["./index.html#search-heading",
                                     "./index.html#requirement-explorer",
                                     "./evaluation.html#evaluation-topics"], hrefs)
                    if view in ("mobile-320", "mobile-360", "mobile-390"):
                        visibility = home.evaluate("""() => {
                          const link = document.querySelector('.primary-actions a:last-child');
                          const rect = link && link.getBoundingClientRect();
                          return {bottom: rect && rect.bottom, viewport: window.innerHeight};
                        }""")
                        record(view, "HOME", "three_tasks_visible_without_scroll",
                               bool(visibility["bottom"] and visibility["bottom"] <= visibility["viewport"] - 4),
                               visibility)
                    order = home.evaluate("""() => {
                      const hero = document.querySelector('.primary-actions');
                      const search = document.querySelector('.controls');
                      const metrics = document.querySelector('.metrics');
                      return Boolean(hero && search && metrics &&
                        (hero.compareDocumentPosition(search) & Node.DOCUMENT_POSITION_FOLLOWING) &&
                        (search.compareDocumentPosition(metrics) & Node.DOCUMENT_POSITION_FOLLOWING));
                    }""")
                    record(view, "HOME", "tasks_before_management", order)
                    dims = home.evaluate("() => ({width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth})")
                    record(view, "HOME", "no_horizontal_page_overflow",
                           dims["scroll"] <= dims["width"] + 2, dims)
                    home.screenshot(path=str(out / (view + "_home_first_view.png")),
                                    full_page=False, timeout=15000)
                    record(view, "HOME", "first_view_screenshot", True)
                    if view == "desktop-1280":
                        if args.expected_home_blob_sha:
                            metadata["served_home_blob_sha"] = git_blob_sha(home_response.body())
                            record(view, "HOME", "served_home_matches_main",
                                   metadata["served_home_blob_sha"] == args.expected_home_blob_sha,
                                   metadata["served_home_blob_sha"])
                        if args.expected_app_js_blob_sha:
                            app_response = home.request.get(home_url.rsplit("/", 1)[0] + "/assets/app.js", timeout=30000)
                            metadata["served_app_js_blob_sha"] = git_blob_sha(app_response.body())
                            record(view, "HOME", "served_app_js_matches_main",
                                   app_response.status == 200 and metadata["served_app_js_blob_sha"] == args.expected_app_js_blob_sha,
                                   metadata["served_app_js_blob_sha"])
                        home.locator("#search").fill("おうみ")
                        home.wait_for_timeout(350)
                        record(view, "HOME", "search_filters_case_list",
                               "おうみ" in home.locator("#case-rows").inner_text())
                        home.goto(home_url + "?case=oumi-2026-joint-genai", wait_until="domcontentloaded", timeout=30000)
                        home.wait_for_function("() => document.querySelector('#case-dialog')?.open === true", timeout=15000)
                        record(view, "HOME", "case_deeplink_dialog", home.locator("#case-dialog").is_visible())
                    # Include every public page at each configured CSS viewport.
                    for page_name in ["insights.html", "checklist.html", "drafting.html",
                                      "methodology.html", "case-study.html"]:
                        extra = context.new_page()
                        try:
                            extra_url = home_url.rsplit("/", 1)[0] + "/" + page_name
                            extra_response = extra.goto(extra_url, wait_until="domcontentloaded", timeout=30000)
                            record(view, "PAGES", page_name + "_loads",
                                   bool(extra_response and extra_response.status == 200
                                        and extra.locator("h1").count() == 1))
                            if page_name == "drafting.html":
                                extra.wait_for_function(
                                    "() => Boolean(document.querySelector('#drafting-load-status')?.textContent)",
                                    timeout=30000)
                                drafting_live = extra.evaluate("""() => ({
                                  areas: ['drafting-topic-links','citizen-examples','role-examples']
                                    .map(id => document.getElementById(id)?.hasAttribute('aria-live')),
                                  status: document.getElementById('drafting-load-status')?.textContent || '',
                                  role: document.getElementById('drafting-load-status')?.getAttribute('role')
                                })""")
                                record(view, "A11Y", "drafting_short_live_status",
                                       drafting_live["areas"] == [False, False, False]
                                       and drafting_live["role"] == "status"
                                       and drafting_live["status"] == "仕様の検討例を表示しています。",
                                       drafting_live)
                        except Exception as error:
                            record(view, "PAGES", page_name + "_interactive", False, str(error))
                        finally:
                            extra.close()
                    record(view, "HOME", "no_client_page_errors", not home_errors, home_errors)
                except Exception as error:
                    record(view, "HOME", "home_interaction", False, str(error))
                finally:
                    home.close()
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
                        status_text = page.locator("#evaluation-update-status").inner_text()
                        record(view, label, "case_change_short_status",
                               status_text.endswith("の評価基準を表示しています。")
                               and 0 < len(status_text) <= 90, status_text)
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
