"use strict";
const assert = require('node:assert/strict');
const fs = require('node:fs');
const copy = require('../assets/procurement-copy.js');
const app = require('../assets/app.js');
const evaluation = require('../assets/evaluation.js');
const rows = evaluation.parseEvaluationCSV(fs.readFileSync('data/procurement_structure.csv','utf8'));
for (const row of rows) {
  for (const [field, fn] of [['contracting_model',copy.contractingModel],['pricing_basis',copy.pricingBasis]]) {
    const text=fn(row[field]);
    assert.ok(!text.includes('未対応'), row.case_id+' '+field);
    assert.notEqual(text,row[field]);
    assert.match(text,/[一-龠ぁ-んァ-ヶ]/);
  }
}
assert.match(copy.contractingModel(rows.find(r=>r.case_id==='oumi-2026-joint-genai').contracting_model),/協議会.*基本契約.*参加自治体ごと.*別途.*想定/);
assert.match(copy.contractingModel('negotiation_with_first_priority_negotiator'),/第1優先交渉権者.*協議.*予定/);
assert.match(copy.contractingModel('single_entity_contract'),/単独団体.*想定/);
assert.match(copy.pricingBasis(rows.find(r=>r.case_id==='minoh-2026-genai-license').pricing_basis),/1,992,000円（税抜）.*定額.*超過課金.*追加料金なし.*制限/);
assert.match(copy.pricingBasis(rows.find(r=>r.case_id==='itoshima-2026-citizen-genai-chatbot').pricing_basis),/5,500,000円.*9月〜3月.*3,075,600円.*従量課金.*上限額内/);
for (const fn of [copy.contractingModel,copy.pricingBasis]) {
  assert.match(fn(''),/未登録.*未確認/);
  assert.match(fn(undefined),/未登録/);
  for (const raw of ['unknown_new_value','toString','__proto__','<img src=x onerror=alert(1)>']) {
    assert.equal(fn(raw),'日本語表示未対応（登録値）：'+raw);
  }
}
assert.equal(app.changeTypeLabel('threshold_defined'),'数値・期限の具体化');
assert.equal(app.changeTypeLabel('quantified'),'数量・応答時間等の具体化');
const effective=evaluation.parseEvaluationCSV(fs.readFileSync('data/effective_requirements.csv','utf8'));
const expected={threshold_defined:['EFF-obu-model-freshness','EFF-saitama-knowledge_volume'],quantified:['EFF-obu-token-volume','EFF-obu-rag-corpus','EFF-fukushima-2025-user-count','EFF-sendai-2026-support-response','EFF-fukushima-2026-minimum-accounts']};
for (const [change,ids] of Object.entries(expected)) {
  assert.deepEqual(effective.filter(r=>app.requirementMatchesExplorerFilters(r,{changeType:change}, {},undefined)).map(r=>r.effective_requirement_id).sort(),ids.sort());
}
const data={caseById:new Map([["oumi-2026-joint-genai",{government_name:"おうみ",procurement_title:"生成AI"}]]),procurementByCase:new Map(rows.map(r=>[r.case_id,r])),evidenceByCase:new Map(),sourceById:new Map(),effective:[],evaluations:[],vendors:[],gates:[],rules:[]};
const topic=evaluation.EVALUATION_TOPICS.find(t=>t.id==='usage-pricing');
const memo=evaluation.buildEvaluationMemo('oumi-2026-joint-genai',topic,data,'http://localhost/');
assert.ok(memo.includes(copy.pricingBasis(rows.find(r=>r.case_id==='oumi-2026-joint-genai').pricing_basis)));
assert.ok(!memo.includes('common plan/pricing'));
console.log('procurement copy: all 16 rows, safe unknowns, exact 2/5 sets, shared Markdown PASS');
