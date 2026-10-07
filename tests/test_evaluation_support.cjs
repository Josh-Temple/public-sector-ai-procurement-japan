"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  EVALUATION_TOPICS,
  EVALUATION_CASE_IDS,
  PRICE_CRITERION_IDS,
  parseEvaluationCSV,
  roleForEffective,
  effectiveValue,
  effectiveSourceId,
  ruleTypeLabel,
  ruleSummary,
  scoreContext,
  caseBoundaryText,
  awardBasisLabel,
  draftingDecisionForTopic
} = require("../assets/evaluation.js");

const root = path.resolve(__dirname, "..");
const read = function (name) {
  return parseEvaluationCSV(fs.readFileSync(path.join(root, name), "utf8"));
};

const cases = read("data/cases.csv");
const effective = read("data/effective_requirements.csv");
const evaluations = read("data/evaluation_criteria.csv");
const procurement = read("data/procurement_structure.csv");
const vendors = read("data/vendor_scores.csv");
const gates = read("data/qualification_gates.csv");
const rules = read("data/evaluation_rules.csv");
const sources = read("data/source_documents.csv");
const evidence = read("data/case_evidence_summary.csv");

const caseById = new Map(cases.map(function (row) { return [row.case_id, row]; }));
const effectiveById = new Map(effective.map(function (row) { return [row.effective_requirement_id, row]; }));
const evaluationById = new Map(evaluations.map(function (row) { return [row.criterion_id, row]; }));
const gateById = new Map(gates.map(function (row) { return [row.gate_id, row]; }));
const ruleById = new Map(rules.map(function (row) { return [row.rule_id, row]; }));
const procurementByCase = new Map(procurement.map(function (row) { return [row.case_id, row]; }));
const sourceById = new Map(sources.map(function (row) { return [row.source_id, row]; }));
const sourceByUrl = new Map(sources.filter(function (row) { return row.url; }).map(function (row) { return [row.url, row]; }));
const evidenceByCase = new Map(evidence.map(function (row) { return [row.case_id, row]; }));

const forbiddenMappingKeys = new Set([
  "points", "total_points", "criterion_summary", "source_url", "threshold",
  "vendor_score", "recommended_points", "recommended_share", "recommended_weight",
  "default_weight", "proposal_ceiling", "contract_amount"
]);

for (const topic of EVALUATION_TOPICS) {
  assert.ok(topic.id);
  assert.ok(topic.label);
  assert.ok(topic.question);
  for (const key of Object.keys(topic)) {
    assert.equal(forbiddenMappingKeys.has(key), false, topic.id + " duplicates canonical fact in mapping: " + key);
  }
  for (const id of topic.effectiveIds || []) {
    assert.ok(effectiveById.has(id), topic.id + " references missing effective requirement " + id);
  }
  for (const id of topic.criterionIds || []) {
    const row = evaluationById.get(id);
    assert.ok(row, topic.id + " references missing criterion " + id);
    assert.ok(Number.isFinite(Number(row.points)), id + " has invalid points");
    assert.ok(Number.isFinite(Number(row.total_points)) && Number(row.total_points) > 0, id + " has invalid total");
    assert.ok(row.assessment_stage, id + " dropped assessment stage");
    assert.ok(sourceByUrl.has(row.source_url), id + " official Source URL does not resolve in registry");
    assert.ok(scoreContext(row).includes(row.assessment_stage), id + " score context dropped assessment stage");
  }
  for (const id of topic.gateIds || []) {
    const row = gateById.get(id);
    assert.ok(row, topic.id + " references missing qualification gate " + id);
    assert.ok(caseById.has(row.case_id), id + " references missing case");
    assert.ok(sourceById.has(row.base_source_id), id + " references missing base source");
    assert.ok(row.base_locator, id + " lacks base locator");
    assert.equal(Object.prototype.hasOwnProperty.call(row, "criterion_id"), false, "qualification gate must not be coupled to criterion_id");
  }
  for (const id of topic.ruleIds || []) {
    const row = ruleById.get(id);
    assert.ok(row, topic.id + " references missing evaluation rule " + id);
    assert.ok(caseById.has(row.case_id), id + " references missing case");
    assert.ok(sourceById.has(row.source_id), id + " references missing source");
    assert.ok(row.locator, id + " lacks locator");
  }
}

for (const caseId of EVALUATION_CASE_IDS) assert.ok(caseById.has(caseId), "missing evaluation case " + caseId);

const saitamaP01 = evaluationById.get("SAI-P01");
assert.equal(saitamaP01.points, "10");
assert.equal(saitamaP01.total_points, "410");
assert.equal(saitamaP01.assessment_stage, "企画提案評価");

const securityTopic = EVALUATION_TOPICS.find(function (topic) { return topic.id === "security-certification"; });
assert.ok(securityTopic.criterionIds.includes("SAI-P01"));
assert.ok(securityTopic.gateIds.includes("QG-HOK-04"));
assert.ok(securityTopic.gateIds.includes("QG-OUM-07"));

const oumiCertification = effectiveById.get("EFF-oumi-certification");
assert.ok(oumiCertification.changed_by_source_id, "Oumi certification must preserve Q&A changed-by source");
assert.equal(effectiveValue(oumiCertification), oumiCertification.effective_value);
assert.equal(effectiveSourceId(oumiCertification), oumiCertification.changed_by_source_id);
assert.equal(sourceById.get(effectiveSourceId(oumiCertification)).document_type, "official_qa_amendment");

const priceIds = Array.from(PRICE_CRITERION_IDS);
for (const id of priceIds) assert.ok(evaluationById.has(id), "price criterion missing " + id);
assert.equal(evaluationById.get("KOBE-DIFY-09").points, "20");
assert.equal(evaluationById.get("KVB-05").points, "15");
assert.equal(evaluationById.get("MINOH-GENAI-PRICE").total_points, "300");

const kobeVoice = procurementByCase.get("kobe-2026-tax-voicebot");
assert.equal(kobeVoice.award_basis, "highest_evaluation_score_with_50pct_threshold");
assert.match(awardBasisLabel(kobeVoice.award_basis), /50%/);
assert.match(kobeVoice.pricing_basis, /price 15\/100/);

const gosen = evaluations.filter(function (row) { return row.case_id === "gosen-2026-genai-service"; });
assert.ok(gosen.every(function (row) { return row.assessment_stage === "一次+二次審査"; }));
assert.equal(gosen.reduce(function (sum, row) { return sum + Number(row.points); }, 0), 1000);

const matsue = evaluations.filter(function (row) { return row.case_id === "matsue-2026-genai-support"; });
assert.ok(new Set(matsue.map(function (row) { return row.total_points; })).size > 1, "Matsue must retain multi-stage denominators");

const itoshima = evaluations.filter(function (row) { return row.case_id === "itoshima-2026-ai-chatbot"; });
if (itoshima.length) {
  const sum = itoshima.reduce(function (value, row) { return value + Number(row.points); }, 0);
  assert.ok(sum >= 0, "partial criterion coverage is diagnostic, not a hard sum==total invariant");
}

const bounded = evidence.find(function (row) { return row.public_reconstructability === "publicly_bounded"; });
assert.ok(bounded);
assert.match(caseBoundaryText(bounded), /最終仕様/);
assert.doesNotMatch(caseBoundaryText(bounded), /契約最終要件まで.*再構成可能/);

const selectedVendor = vendors.find(function (row) { return row.selected === "true" && row.total_score; });
assert.ok(selectedVendor);
assert.equal(Object.prototype.hasOwnProperty.call(selectedVendor, "criterion_id"), false, "vendor total must stay separate from criterion score");

assert.equal(roleForEffective({ effective_status: "required" }), "最低条件");
assert.equal(roleForEffective({ effective_status: "desirable" }), "望ましい条件");
assert.equal(roleForEffective({ effective_status: "not_qualification" }), "参加資格ではない");
assert.equal(roleForEffective({ effective_status: "optional_disclosure" }), "任意開示");
assert.equal(roleForEffective({ effective_status: "allowed_alternative" }), "代替可");
assert.equal(roleForEffective({ effective_status: "removed" }), "削除済み");
assert.equal(roleForEffective({ effective_status: "prohibited" }), "禁止条件");
assert.equal(roleForEffective({ effective_status: "context" }), "前提・文脈");
assert.equal(roleForEffective({ effective_status: "evaluation_context" }), "評価上の文脈");
assert.equal(draftingDecisionForTopic("citizen-safety"), "generation-boundary");

// Canonical qualification gates stay separate from scored criteria and service requirements.
for (const row of gates) {
  assert.ok(caseById.has(row.case_id), row.gate_id + " unknown case");
  assert.ok(sourceById.has(row.base_source_id), row.gate_id + " unknown base source");
  if (row.changed_by_source_id) {
    assert.ok(sourceById.has(row.changed_by_source_id), row.gate_id + " unknown changed source");
    assert.ok(row.change_locator, row.gate_id + " changed gate lacks change locator");
  }
}
const hokkaidoIso = gateById.get("QG-HOK-04");
assert.equal(hokkaidoIso.topic, "security_certification");
assert.equal(hokkaidoIso.unmet_effect, "bid_invalid");
assert.equal(hokkaidoIso.base_source_id, "SRC-hokkaido-2026-notice");

const oumiExperienceGate = gateById.get("QG-OUM-08");
assert.equal(oumiExperienceGate.changed_by_source_id, "SRC-oumi-2026-qa");
assert.match(oumiExperienceGate.change_locator, /No\.2/);
assert.ok(evaluationById.has("OUM-04"), "Oumi experience must remain separately represented as a scored criterion");

const saitamaQualificationRows = gates.filter(function (row) { return row.case_id === "saitama-2026-ai-digital-support"; });
assert.equal(saitamaQualificationRows.length, 0, "Saitama scored certification example must not be promoted to qualification");
assert.equal(effectiveById.get("EFF-saitama-ismap_status").effective_status, "not_qualification");

// Typed selection/pricing rules do not duplicate criterion points.
for (const row of rules) {
  assert.ok(caseById.has(row.case_id), row.rule_id + " unknown case");
  assert.ok(sourceById.has(row.source_id), row.rule_id + " unknown source");
  assert.ok(row.locator, row.rule_id + " missing locator");
  assert.equal(Object.prototype.hasOwnProperty.call(row, "points"), false, row.rule_id + " must not duplicate criterion points");
  assert.equal(Object.prototype.hasOwnProperty.call(row, "total_points"), false, row.rule_id + " must not duplicate criterion denominator");
  if (row.criterion_id) {
    const criterion = evaluationById.get(row.criterion_id);
    assert.ok(criterion, row.rule_id + " unknown criterion");
    assert.equal(criterion.case_id, row.case_id, row.rule_id + " criterion cross-case mismatch");
  }
  const source = sourceById.get(row.source_id);
  if (row.verification_state === "fresh_verified") {
    assert.equal(source.access_state, "accessible", row.rule_id + " unavailable source marked fresh_verified");
  }
}

assert.equal(ruleById.get("RULE-KVB-MIN-TOTAL").threshold_value, "50");
assert.equal(ruleById.get("RULE-KVB-MIN-TOTAL").threshold_unit, "percent_of_total");
assert.equal(ruleById.get("RULE-KVB-MIN-TOTAL").effect, "not_selected");
assert.equal(ruleById.get("RULE-KVB-CEILING").amount_jpy, "12760000");
assert.equal(ruleById.get("RULE-KVB-CEILING").tax_basis, "tax_included");
assert.equal(ruleById.get("RULE-KVB-CEILING-DISQ").effect, "disqualified");
assert.equal(ruleById.get("RULE-KVB-PRICE-FORMULA").criterion_id, "KVB-05");
assert.equal(evaluationById.get("KVB-05").points, "15");
assert.notEqual(ruleTypeLabel(ruleById.get("RULE-KVB-MIN-TOTAL").rule_type), ruleTypeLabel(ruleById.get("RULE-KVB-CEILING-DISQ").rule_type));
assert.match(ruleSummary(ruleById.get("RULE-KVB-CEILING")), /12,760,000円/);

assert.equal(ruleById.get("RULE-DIFY-PRICE-FORMULA").criterion_id, "KOBE-DIFY-09");
assert.equal(ruleById.get("RULE-DIFY-TIE-1").rule_order, "1");
assert.equal(ruleById.get("RULE-DIFY-TIE-2").related_rule_id, "RULE-DIFY-TIE-1");

assert.equal(ruleById.get("RULE-MATSUE-MIN-TOTAL").threshold_value, "60");
assert.equal(ruleById.get("RULE-MATSUE-MIN-TOTAL").aggregation_scope, "evaluator_total");
assert.equal(evaluationById.get("MATSUE-FINAL-01").points, "80");
assert.equal(evaluationById.get("MATSUE-FINAL-01").total_points, "200");

assert.equal(ruleById.get("RULE-GOSEN-PRICE-FORMULA").criterion_id, "GOS-05");
assert.match(ruleById.get("RULE-GOSEN-PRICE-FORMULA").notes, /二次審査でも再計算せず同じ得点/);

const hokkaidoProcurement = procurementByCase.get("hokkaido-2026-genai-rag-service");
assert.equal(hokkaidoProcurement.award_basis, "lowest_valid_bid_within_planned_price");
assert.equal(evaluations.some(function (row) { return row.case_id === "hokkaido-2026-genai-rag-service" && PRICE_CRITERION_IDS.has(row.criterion_id); }), false);

assert.equal(rules.some(function (row) {
  return row.case_id === "kyoto-2026-general-genai" && row.verification_state === "fresh_verified";
}), false, "Kyoto unavailable source must not be promoted to fresh verification");

const uiTopic = EVALUATION_TOPICS.find(function (topic) { return topic.id === "ui-usability"; });
assert.deepEqual(uiTopic.criterionIds, ["SEN-04", "SEN-07", "GOS-02", "MATSUE-FINAL-02"]);
const operationsTopic = EVALUATION_TOPICS.find(function (topic) { return topic.id === "operations-maintenance"; });
assert.ok(operationsTopic.effectiveIds.includes("EFF-itoshima-availability"));
assert.ok(operationsTopic.criterionIds.includes("GOS-03"));

const sourceText = fs.readFileSync(path.join(root, "assets/evaluation.js"), "utf8");
for (const unsafe of ["標準配点", "自治体平均では", "推奨配点", "平均配点", "自治体ランキング"]) {
  assert.equal(sourceText.includes(unsafe), false, "unsafe scoring wording embedded: " + unsafe);
}
assert.match(sourceText, /総合点から評価項目別得点を逆算しません/);
assert.match(sourceText, /価格条件と価格点は別表示/);

console.log("evaluation support regression: " + EVALUATION_TOPICS.length + " topics, canonical references and role boundaries resolved");
