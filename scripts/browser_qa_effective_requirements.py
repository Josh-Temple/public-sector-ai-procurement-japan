#!/usr/bin/env python3
"""Source/meaning equivalence for every rendered effective requirement at four CSS widths.
This is automated Chromium QA, not Android hardware, native zoom or AT verification.
"""
import argparse
import csv
import json
from datetime import datetime, timezone
from pathlib import Path
from playwright.sync_api import sync_playwright

def read_rows(file_name):
    with open(file_name, encoding="utf-8-sig", newline="") as stream:
        return list(csv.DictReader(stream))

def check():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="https://josh-temple.github.io/public-sector-ai-procurement-japan/")
    parser.add_argument("--output-dir", default="evaluation-browser-qa")
    args = parser.parse_args()
    dest = Path(args.output_dir)
    dest.mkdir(parents=True, exist_ok=True)
    data = read_rows("data/effective_requirements.csv")
    cases = {r["case_id"]:r for r in read_rows("data/cases.csv")}
    sources = {r["source_id"]:r for r in read_rows("data/source_documents.csv")}
    expected = {r["effective_requirement_id"]:r for r in data}
    if len(expected)!=len(data):
        raise AssertionError("Canonical IDs are not unique")
    findings=[]
    meta={"timestamp_utc":datetime.now(timezone.utc).isoformat(),
          "url":args.url,"canonical_count":len(data),"browser":None}
    views=[("desktop-1280",1280,900),("mobile-320",320,720),
           ("mobile-360",360,800),("mobile-390",390,844)]
    try:
        with sync_playwright() as engine:
            browser=engine.chromium.launch(headless=True,args=["--no-sandbox"])
            meta["browser"]="Chromium "+browser.version
            for name,width,height in views:
                context=browser.new_context(viewport={"width":width,"height":height},locale="ja-JP")
                page=context.new_page()
                exceptions=[]
                page.on("pageerror",lambda error:exceptions.append(str(error)))
                response=page.goto(args.url,wait_until="domcontentloaded",timeout=45000)
                if response is None or response.status != 200:
                    raise RuntimeError(name+" navigation did not return HTTP 200")
                page.wait_for_function(
                    "(total) => document.querySelectorAll('#requirement-rows tr[data-effective-id]').length === total",
                    arg=len(data),timeout=45000)
                dom=page.evaluate("""() => [...document.querySelectorAll('#requirement-rows tr[data-effective-id]')].map(tr => {
                  const fields={};
                  for (const td of tr.querySelectorAll('td[data-field]')) {
                    const rect=td.getBoundingClientRect();
                    fields[td.dataset.field]={
                      text:td.innerText,
                      value:td.querySelector('.requirement-value')?.textContent ?? null,
                      status:td.dataset.status ?? null,
                      visible:rect.width>0 && rect.height>0 && getComputedStyle(td).visibility!=='hidden'
                    };
                  }
                  const evidence=[...tr.querySelectorAll('[data-source-role]')].map(node=>({
                    role:node.dataset.sourceRole,id:node.dataset.sourceId,
                    tag:node.tagName.toLowerCase(),href:node.getAttribute('href'),
                    detail:node.nextElementSibling?.textContent ?? ''
                  }));
                  return {id:tr.dataset.effectiveId,caseId:tr.dataset.caseId,fields,evidence,
                          visible:tr.getBoundingClientRect().height>0};
                })""")
                by_id={r["id"]:r for r in dom}
                if len(dom)!=len(expected) or len(by_id)!=len(expected) or set(by_id)!=set(expected):
                    findings.append({"viewport":name,"row_id":"ALL","status":"FAIL",
                                     "problems":["Missing, duplicate or extra canonical IDs"]})
                for rid,src in expected.items():
                    errors=[]
                    got=by_id.get(rid)
                    if got is None:
                        errors.append("Row not rendered")
                    else:
                        fields=got["fields"]
                        if got["caseId"]!=src["case_id"]: errors.append("Wrong case ID")
                        if len(fields)!=7 or not got["visible"] or not all(x["visible"] for x in fields.values()):
                            errors.append("Missing or inaccessible logical fields")
                        case=cases.get(src["case_id"],{})
                        for name_field in ("government_name","procurement_title"):
                            if case.get(name_field) and case[name_field] not in fields.get("case",{}).get("text",""):
                                errors.append("Missing case "+name_field)
                        if src["requirement_key"] not in fields.get("topic",{}).get("text",""):
                            errors.append("Missing canonical requirement key")
                        for kind in ("original","effective"):
                            observed=fields.get(kind,{})
                            if observed.get("value")!=src[kind+"_value"]:
                                errors.append(kind+" text mismatch")
                            if observed.get("status")!=src[kind+"_status"]:
                                errors.append(kind+" status mismatch")
                            if "区分：" not in observed.get("text",""):
                                errors.append(kind+" human-readable status absent")
                        for field in ("scope","condition"):
                            if src[field] and src[field] not in fields.get("effective",{}).get("text",""):
                                errors.append("Missing "+field)
                        for field in ("change","boundary"):
                            if not fields.get(field,{}).get("text","").strip():
                                errors.append("Empty "+field)
                        for role,sid_key,loc_key in (
                            ("base","base_source_id","base_locator"),
                            ("changed","changed_by_source_id","change_locator")):
                            ref=src[sid_key]
                            members=[s for s in got["evidence"] if s["role"]==role]
                            if not ref:
                                if members: errors.append(role+" source invented")
                                continue
                            if len(members)!=1 or members[0]["id"]!=ref:
                                errors.append(role+" Source association")
                                continue
                            display=members[0]
                            origin=sources.get(ref)
                            if origin is None:
                                errors.append(role+" Source missing in registry")
                                continue
                            for word in (origin["title"],src[loc_key]):
                                if word and word not in display["detail"]:
                                    errors.append(role+" title/locator unavailable")
                            for prop,label in (("published_at","公表日:"),("retrieved_at","資料取得日:")):
                                if origin[prop] and (label+" "+origin[prop]) not in display["detail"]:
                                    errors.append(role+" date missing: "+prop)
                                if not origin[prop] and label in display["detail"]:
                                    errors.append(role+" fabricated date: "+prop)
                            if origin["url"]:
                                if display["tag"]!="a" or display["href"]!=origin["url"]:
                                    errors.append(role+" href mismatch")
                            elif display["tag"]=="a" or display["href"]:
                                errors.append(role+" missing URL converted to link")
                    findings.append({"viewport":name,"row_id":rid,
                                     "status":"FAIL" if errors else "PASS","problems":errors})
                if exceptions:
                    findings.append({"viewport":name,"row_id":"JS","status":"FAIL","problems":exceptions})
                # Search 0 results and the reset action must remain independent from load errors.
                page.locator("#requirement-query").fill("zz_no_such_requirement_9981")
                if page.locator("#requirement-rows tr").count()!=0 or not page.locator("#requirement-empty").is_visible():
                    findings.append({"viewport":name,"row_id":"FILTER","status":"FAIL",
                                     "problems":["Zero results not distinguished"]})
                page.locator("#reset-requirement").click()
                page.wait_for_function(
                    "(total) => document.querySelectorAll('#requirement-rows tr[data-effective-id]').length===total",
                    arg=len(data),timeout=10000)
                findings.append({"viewport":name,"row_id":"FILTER","status":"PASS",
                                 "problems":[]})
                context.close()
            browser.close()
    except Exception as error:
        findings.append({"viewport":"ENV","row_id":"ENV","status":"BLOCKED","problems":[str(error)]})
    summary={k:sum(f["status"]==k for f in findings) for k in ("PASS","FAIL","BLOCKED")}
    report={"metadata":meta,"summary":summary,"findings":findings}
    (dest/"effective-requirements-all-rows.json").write_text(
        json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(summary,ensure_ascii=False))
    return 0 if summary["FAIL"]==0 and summary["BLOCKED"]==0 else (2 if summary["BLOCKED"] else 1)

if __name__=="__main__":
    raise SystemExit(check())
