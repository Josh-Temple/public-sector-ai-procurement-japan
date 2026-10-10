"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const {changeTypeLabel, requirementSourcePresentation, sourceDateText} = require("../assets/app.js");
function parseCSV(text) {
  const out = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field.replace(/\r$/, ""));
      out.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ""));
    out.push(row);
  }
  const header = out.shift() || [];
  return out
    .filter(values => values.some(value => value !== ""))
    .map(values => Object.fromEntries(header.map((key, index) => [key, values[index] ?? ""])));
}

const rows = parseCSV(fs.readFileSync("data/effective_requirements.csv","utf8"));
const sources = parseCSV(fs.readFileSync("data/source_documents.csv","utf8"));
const cases = parseCSV(fs.readFileSync("data/cases.csv","utf8"));
const idSet = new Set(rows.map(row => row.effective_requirement_id));
const sourceIds = new Set(sources.map(s => s.source_id));
const caseIds = new Set(cases.map(c => c.case_id));
assert.equal(idSet.size,rows.length,"duplicate effective requirement ID");
assert.equal(sourceIds.size,sources.length,"duplicate Source ID");
assert.equal(caseIds.size,cases.length,"duplicate case ID");
assert.equal(rows.length,135,"review expected population on canonical change");
const sourceMap = new Map(sources.map(s=>[s.source_id,s]));
let changed=0, noChanged=0, distinctWithoutChanged=0;
for(const row of rows) {
  const label = row.effective_requirement_id;
  assert.ok(caseIds.has(row.case_id),label+" orphan case");
  assert.ok(row.original_value && row.effective_value,label+" original/effective missing");
  assert.ok(row.original_status && row.effective_status,label+" status missing");
  assert.ok(row.applicability_stage && row.public_reconstructability,label+" scope-stage missing");
  assert.ok(row.base_source_id && sourceIds.has(row.base_source_id),label+" base Source");
  assert.equal(sourceMap.get(row.base_source_id).case_id,row.case_id,label+" base Source case mismatch");
  if(row.changed_by_source_id){
    changed++;
    assert.ok(sourceIds.has(row.changed_by_source_id),label+" changed Source");
    assert.equal(sourceMap.get(row.changed_by_source_id).case_id,row.case_id,label+" changed Source case mismatch");
  }else{
    noChanged++;
    if(row.original_value!==row.effective_value)distinctWithoutChanged++;
  }
  assert.notEqual(changeTypeLabel(row.change_type),"確認済み",label);
}
assert.equal(changed,104);
assert.equal(noChanged,31);
assert.equal(distinctWithoutChanged,16);
const oumi=rows.find(r=>r.effective_requirement_id==="EFF-oumi-template-count");
assert.ok(oumi);
assert.equal(oumi.original_value,">=200");
assert.equal(oumi.effective_value,">=50");
assert.equal(oumi.base_source_id,"SRC-oumi-2026-spec");
assert.equal(oumi.changed_by_source_id,"SRC-oumi-2026-qa");
assert.equal(oumi.change_locator,"Q&A No.8");
const title="公式テスト資料";
const missingUrl=requirementSourcePresentation({title,url:"",published_at:"",retrieved_at:"2026-10-01"}, "節 No.8","変更根拠");
assert.equal(missingUrl.url,"");
assert.match(missingUrl.detail,/公式URL未登録/);
assert.doesNotMatch(sourceDateText({retrieved_at:"2026-10-01"}),/公表日/);
assert.equal(changeTypeLabel("unexpected_enum"),"変更種別は未登録");
assert.equal(changeTypeLabel(""),"変更種別は未登録");
assert.ok(!rows.some(r => !r.base_source_id),"base Source must not be inferred");
console.log("effective requirements canonical/source integrity PASS: "+rows.length+" rows; "+changed+" changed-source, "+noChanged+" without changed-source");
