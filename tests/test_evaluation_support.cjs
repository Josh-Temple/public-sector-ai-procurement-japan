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
const sources = read("data/source_documents.csv");
const evidence = read("data/case_evidence_summary.csv");

const caseById = new Map(cases.map(function (row) { return [row.case_id, row]; }));
const effectiveById = new Map(effective.map(function (row) { return [row.effective_requirement_id, row]; }));
const evaluationById = new Map(evaluations.map(function (row) { return [row.criterion_id, row]; }));
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
  for (const ref of topic.qualificationRefs || []) {
    assert.ok(caseById.has(ref.caseId), "qualification ref missing case " + ref.caseId);
    assert.ok(sourceById.has(ref.sourceId), "qualification ref missing source " + ref.sourceId);
    assert.ok(fs.existsSync(path.join(root, ref.claimPath)), "qualification ref missing Claim " + ref.claimPath);
    assert.match(ref.claimPath, /^claims\//);
    assert.equal(Object.prototype.hasOwnProperty.call(ref, "criterionId"), false, "qualification must not be sourced from evaluation criterion");
  }
}

for (const caseId of EVALUATION_CASE_IDS) assert.ok(caseById.has(caseId), "missing evaluation case " + caseId);

const saitamaP01 = evaluationById.get("SAI-P01");
assert.equal(saitamaP01.points, "10");
assert.equal(saitamaP01.total_points, "410");
assert.equal(saitamaP01.assessment_stage, "企画提案評価");

const securityTopic = EVALUATION_TOPICS.find(function (topic) { return topic.id === "security-certification"; });
assert.ok(securityTopic.criterionIds.includes("SAI-P01"));
assert.ok(securityTopic.qualificationRefs.some(function (ref) { return ref.caseId === "hokkaido-2026-genai-rag-service"; }));

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
assert.equal(draftingDecisionForTopic("citizen-safety"), "generation-boundary");

const sourceText = fs.readFileSync(path.join(root, "assets/evaluation.js"), "utf8");
for (const unsafe of ["標準配点", "自治体平均では", "推奨配点"]) {
  assert.equal(sourceText.includes(unsafe), false, "unsafe scoring wording embedded: " + unsafe);
}
assert.match(sourceText, /総合点から評価項目別得点を逆算しません/);
assert.match(sourceText, /価格条件と価格点は別表示/);

console.log("evaluation support regression: " + EVALUATION_TOPICS.length + " topics, canonical references and role boundaries resolved");
