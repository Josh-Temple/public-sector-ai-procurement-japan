"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const {sourceDateText, requirementSourcePresentation, evaluationPointsText, changeTypeLabel} = require("../assets/app.js");
const {ruleSummary, parseEvaluationCSV} = require("../assets/evaluation.js");

const dated = {title:"公表資料", document_type:"official_qa", url:"", published_at:"2026-03-01", retrieved_at:"2026-04-01"};
assert.equal(sourceDateText(dated), "公表日: 2026-03-01 / 資料取得日: 2026-04-01");
assert.equal(sourceDateText({retrieved_at:"2026-04-01"}), "資料取得日: 2026-04-01");
const missingUrl = requirementSourcePresentation(dated, "Q&A No.8", "変更根拠");
assert.equal(missingUrl.url, "");
assert.match(missingUrl.detail, /公表資料.*Q&A No\.8.*公表日.*資料取得日.*公式URL未登録/);
const missingSource = requirementSourcePresentation(null, "仕様書 No.7", "当初根拠");
assert.equal(missingSource.url, "");
assert.match(missingSource.detail, /資料参照先未登録.*仕様書 No\.7.*公式URL未登録/);
const linked = requirementSourcePresentation({...dated, url:"https://example.org/official"}, "Q&A No.8", "変更根拠");
assert.equal(linked.url, "https://example.org/official");
assert.doesNotMatch(linked.detail, /URL未登録/);

const rows = parseEvaluationCSV(fs.readFileSync("data/evaluation_criteria.csv", "utf8"));
function criterion(id) {
  const row = rows.find(r => r.criterion_id === id);
  assert.ok(row, "missing criterion " + id);
  return row;
}
assert.match(evaluationPointsText(criterion("YAI-10")), /^10 \/ 100点・価格評価$/);
assert.match(evaluationPointsText(criterion("MATSUE-DOC-04")), /^10 \/ 80点・書類審査$/);
assert.equal(evaluationPointsText({points:"5", total_points:"", assessment_stage:"書類審査"}), "5点（満点未登録）・書類審査");
assert.match(ruleSummary({rule_type:"proposal_ceiling", amount_jpy:""}), /金額未登録/);
assert.match(ruleSummary({rule_type:"planned_price", amount_jpy:"  "}), /金額未登録/);
assert.doesNotMatch(ruleSummary({rule_type:"planned_price", amount_jpy:null}), /0円|NaN円/);
assert.match(ruleSummary({rule_type:"planned_price", amount_jpy:"1200000"}), /1,200,000円/);

const html = fs.readFileSync("index.html", "utf8");
assert.match(html, /id="search-empty"/);
assert.match(html, /id="requirement-empty"/);
assert.match(html, /id="reset-requirement"/);
for (const code of ["assessed","publicly_bounded","not_assessed"]) {
  assert.ok(html.includes('<option value="' + code + '">'));
}
// Long evidence sections must not be live regions; only concise status is announced.
for (const [pageName, contentIds, statusId, jsName] of [
  ["drafting.html", ["drafting-topic-links", "citizen-examples", "role-examples"], "drafting-load-status", "drafting.js"],
  ["evaluation.html", ["evaluation-topic-links", "evaluation-topic-detail", "evaluation-case-detail"], "evaluation-update-status", "evaluation.js"]
]) {
  const page = fs.readFileSync(pageName, "utf8");
  for (const id of contentIds) {
    const tag = page.match(new RegExp("<[^>]+id=\\\"" + id + "\\\"[^>]*>"));
    assert.ok(tag, "missing evidence area " + id);
    assert.doesNotMatch(tag[0], /aria-live/, "long evidence content is a live region: " + id);
  }
  const status = page.match(new RegExp("<[^>]+id=\\\"" + statusId + "\\\"[^>]*>"));
  assert.ok(status, "missing short status " + statusId);
  assert.match(status[0], /role="status"/);
  assert.match(status[0], /aria-live="polite"/);
  assert.match(status[0], /aria-atomic="true"/);
  const script = fs.readFileSync("assets/" + jsName, "utf8");
  assert.ok(script.includes('getElementById("' + statusId + '")'), "status not populated by JS");
}
const css = fs.readFileSync("assets/site.css", "utf8");
assert.match(css, /input, select\s*\{[^}]*border: 1px solid var\(--muted\)/);
assert.match(css, /\.evaluation-case-picker select\s*\{[^}]*border:\s*1px solid var\(--muted\)/, "evaluation case selector must retain a distinguishable border");


/* Reflow contract: all nine case fields remain in one DOM and keep their original actions. */
const appSource = fs.readFileSync("assets/app.js", "utf8");
assert.match(appSource, /const columns = \[selectTd, titleTd, yearTd, methodTd, ragTd, lgwanTd, vendorTd, evTd, sourceTd\]/);
assert.match(appSource, /columns\.forEach\(\(cell, index\) => \{ cell\.dataset\.label = labels\[index\]; \}\)/);
assert.match(css, /@media \(max-width: 767px\)/);
assert.match(css, /content:\s*attr\(data-label\)/);
assert.match(css, /\.results \.case-table \.badge\s*\{[^}]*white-space:\s*normal/);
assert.match(css, /\.results \.case-table tbody td\[colspan\]/);
assert.equal(changeTypeLabel("relaxed"), "緩和");
assert.match(changeTypeLabel("unknown_value"), /未整理.*unknown_value/);
assert.equal(changeTypeLabel(""), "変更種別は未登録");
for (const page of ["index.html", "insights.html", "checklist.html", "drafting.html", "evaluation.html", "methodology.html"]) {
  assert.doesNotMatch(fs.readFileSync(page, "utf8"), /Source-first public research|Observed procurement choices|Observed scoring choices|Evidence-backed prompts/);
}

console.log("First-time UI evidence, empty state, and scoring contract: PASS");
