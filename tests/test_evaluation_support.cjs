"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  EVALUATION_TOPICS,
  EVALUATION_CASE_IDS,
  PRICE_CRITERION_IDS,
  isCasePriceCriterion,
  thresholdScopeLabel,
  gateMeaningParts,
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
assert.ok(securityTopic.gateIds.includes("QG-YAI-02"));

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

// Sendai qualification §2 is section-complete for two separate fiscal-year tenders.
for (const [caseId, prefix, guideId] of [
  ["sendai-2025-genai-pilot", "QG-SEN25-", "SRC-sendai-2025-guide"],
  ["sendai-2026-genai-service", "QG-SEN26-", "SRC-sendai-2026-guide"],
]) {
  const rows = gates.filter(function (row) { return row.case_id === caseId; });
  assert.equal(rows.length, 15, caseId + " must keep all seven primary gates and eight consortium clauses");
  assert.deepEqual(
    new Set(rows.map(function (row) { return row.gate_id; })),
    new Set(Array.from({ length: 15 }, function (_, i) { return prefix + String(i + 1).padStart(2, "0"); }))
  );
  assert.ok(rows.every(function (row) {
    return row.base_source_id === guideId && row.base_locator && row.review_status === "reviewed"
      && row.applies_at_stage === "participation" && row.unmet_effect === "not_qualified";
  }), caseId + " must keep source, locator, role, review and effect");
  assert.equal(rows.filter(function (row) { return row.applies_to === "joint_proposal"; }).length, 8);
}
const sendai25Experience = gateById.get("QG-SEN25-07");
const sendai26Experience = gateById.get("QG-SEN26-07");
assert.match(sendai25Experience.condition_summary, /導入と研修の双方/);
assert.match(sendai25Experience.condition_summary, /民間企業等/);
assert.match(sendai26Experience.condition_summary, /国又は地方公共団体/);
assert.doesNotMatch(sendai26Experience.condition_summary, /研修|民間企業/);
assert.equal(sendai25Experience.changed_by_source_id, "SRC-sendai-2025-qa");
assert.match(sendai25Experience.change_locator, /No\.1/);
assert.match(gateById.get("QG-SEN25-10").satisfaction_rule, /No\.7.*代表構成員/);
assert.equal(gateById.get("QG-SEN26-10").changed_by_source_id, "");
assert.match(gateById.get("QG-SEN25-14").condition_summary, /業務完了時/);
assert.match(gateById.get("QG-SEN25-15").condition_summary, /契約締結時/);

const minohFinanceGate = gateById.get("QG-MINOH-01");
assert.equal(minohFinanceGate.applies_at_stage, "participation");
assert.equal(minohFinanceGate.base_source_id, "SRC-minoh-2026-genai-bid-guide");
assert.match(minohFinanceGate.base_locator, /2\(16\).*9\(1\)/);
assert.match(minohFinanceGate.condition_summary, /財務体質.*零点未満/);
assert.match(minohFinanceGate.satisfaction_rule, /総合評価値とは別/);
assert.equal(minohFinanceGate.unmet_effect, "not_qualified");

// Yaizu qualification migration is section-complete for guide §3, including continuing eligibility.
const yaizuGates = gates.filter(function (row) { return row.case_id === "yaizu-2025-genai-service"; });
assert.equal(yaizuGates.length, 4, "Yaizu qualification section must not be partially migrated");
assert.deepEqual(new Set(yaizuGates.map(function (row) { return row.gate_id; })), new Set(["QG-YAI-01", "QG-YAI-02", "QG-YAI-03", "QG-YAI-04"]));
assert.equal(gateById.get("QG-YAI-01").topic, "prior_experience");
assert.equal(gateById.get("QG-YAI-02").topic, "security_certification");
assert.equal(gateById.get("QG-YAI-02").satisfaction_rule, "列挙された認証のいずれかを満たす");
assert.equal(gateById.get("QG-YAI-04").topic, "continued_eligibility");
assert.equal(gateById.get("QG-YAI-04").unmet_effect, "qualification_lost");

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

// Stage semantics stay explicit without flattening raw assessment_stage or denominators.
const matsueRelation = ruleById.get("RULE-MATSUE-STAGE-INCLUSION");
assert.equal(matsueRelation.rule_type, "stage_relation");
assert.equal(matsueRelation.criterion_id, "MATSUE-FINAL-01");
assert.equal(matsueRelation.effect, "included_in_final_total");
assert.match(matsueRelation.notes, /80点.*200点.*加算しない/);
assert.match(ruleSummary(matsueRelation), /審査段階の得点関係/);

const gosenReuse = ruleById.get("RULE-GOSEN-PRICE-REUSE");
assert.equal(gosenReuse.rule_type, "stage_relation");
assert.equal(gosenReuse.criterion_id, "GOS-05");
assert.equal(gosenReuse.effect, "reused_without_recalculation");
assert.match(gosenReuse.notes, /再計算せず同じ得点/);
assert.match(gosenReuse.notes, /200\/1000点/);
assert.equal(evaluationById.get("GOS-05").points, "200", "reused price contribution must not be deduplicated to 100");

// Planned price, proposal ceilings, thresholds and price formulas remain separate rule roles.
const minohPlanned = ruleById.get("RULE-MINOH-PLANNED-PRICE");
assert.equal(minohPlanned.rule_type, "planned_price");
assert.equal(minohPlanned.amount_jpy, "1992000");
assert.equal(minohPlanned.tax_basis, "tax_excluded");
assert.equal(ruleById.get("RULE-MINOH-PLANNED-PRICE-DISQ").related_rule_id, "RULE-MINOH-PLANNED-PRICE");
assert.equal(ruleById.get("RULE-MINOH-PRICE-FORMULA").criterion_id, "MINOH-GENAI-PRICE");
assert.notEqual(ruleTypeLabel("planned_price"), ruleTypeLabel("proposal_ceiling"));

for (const prefix of ["RULE-SEN25", "RULE-SEN26"]) {
  assert.equal(ruleById.get(prefix + "-MIN-TOTAL").threshold_value, "60");
  assert.equal(ruleById.get(prefix + "-MIN-TOTAL").aggregation_scope, "selection_committee_aggregate");
  assert.equal(ruleById.get(prefix + "-CEILING-DISQ").effect, "disqualified");
  assert.equal(ruleById.get(prefix + "-TIE-1").effect, "tie_break");
}
assert.equal(ruleById.get("RULE-SEN25-CEILING").amount_jpy, "2290000");
assert.equal(ruleById.get("RULE-SEN26-CEILING").amount_jpy, "5896000");

assert.equal(ruleById.get("RULE-YAI-CEILING").amount_jpy, "3000000");
assert.equal(ruleById.get("RULE-YAI-CEILING").tax_basis, "tax_included");
assert.equal(ruleById.get("RULE-YAI-MANDATORY-DISQ").criterion_id, "YAI-09");
assert.equal(ruleById.get("RULE-YAI-PRICE-FORMULA").criterion_id, "YAI-10");
assert.equal(ruleById.get("RULE-YAI-MIN-TOTAL").threshold_value, "60");
assert.equal(ruleById.get("RULE-YAI-MIN-TOTAL").effect, "not_selected");

const oumiSubtotal = ruleById.get("RULE-OUM-MIN-SUBTOTAL");
assert.equal(oumiSubtotal.rule_type, "minimum_subtotal_score");
assert.equal(oumiSubtotal.threshold_value, "420");
assert.equal(oumiSubtotal.threshold_unit, "points");
assert.equal(oumiSubtotal.aggregation_scope, "proposal_plus_function_subtotal_700");
assert.match(ruleSummary(oumiSubtotal), /700点/);
assert.equal(ruleById.get("RULE-OUM-TIE-1").effect, "tie_break");
assert.equal(ruleById.get("RULE-OUM-CEILING-DISQ").amount_jpy, "", "Oumi multi-amount ceiling must not be collapsed to one number");

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
assert.match(sourceText, /renderStageRelations\(structure, stageRelations, data\)/, "case view must render canonical stage relations");
assert.match(sourceText, /appendCaseSourceLinks/, "case-local gate and rule rows must link directly to official Sources");
assert.match(sourceText, /原資料に参加資格が存在しないという意味ではありません/);
assert.match(sourceText, /原資料に閾値・失格条件・価格ルールが存在しないという意味ではありません/);
assert.doesNotMatch(sourceText, /80\s*\+\s*200\s*=\s*280/, "public UI must not present a naive Matsue denominator sum");

// Public case-local consumption must not depend on curated topic representative IDs.
for (const [criterionId, caseId, points, denominator, stage] of [
  ["YAI-10", "yaizu-2025-genai-service", "10", "100", "価格評価"],
  ["MATSUE-DOC-04", "matsue-2026-genai-support", "10", "80", "書類審査"]
]) {
  const row = evaluationById.get(criterionId);
  assert.equal(row.case_id, caseId);
  assert.ok(isCasePriceCriterion(row), criterionId + " hidden from case-local pricing");
  assert.equal(row.points, points);
  assert.equal(row.total_points, denominator);
  assert.equal(row.assessment_stage, stage);
  assert.match(scoreContext(row), new RegExp(points + " / " + denominator + "点.*" + stage));
}
const pricingTopic = EVALUATION_TOPICS.find((topic) => topic.id === "usage-pricing");
assert.ok(!pricingTopic.criterionIds.includes("YAI-10"));
assert.ok(!pricingTopic.criterionIds.includes("MATSUE-DOC-04"));
assert.ok(isCasePriceCriterion(evaluationById.get("YAI-10")));
assert.ok(isCasePriceCriterion(evaluationById.get("MATSUE-DOC-04")));
assert.ok(isCasePriceCriterion(evaluationById.get("ITOSHIMA-CHATBOT-02")), "latent Itoshima price row");
assert.equal(PRICE_CRITERION_IDS.has("SEN-13"), false, "qualitative cost is not a price formula");

// Keep different aggregation scopes distinct even when the numerical cutoffs coincide.
const matsueThreshold = ruleSummary(ruleById.get("RULE-MATSUE-MIN-TOTAL"));
const sendai25Threshold = ruleSummary(ruleById.get("RULE-SEN25-MIN-TOTAL"));
const sendai26Threshold = ruleSummary(ruleById.get("RULE-SEN26-MIN-TOTAL"));
const yaizuThreshold = ruleSummary(ruleById.get("RULE-YAI-MIN-TOTAL"));
assert.match(matsueThreshold, /各委員.*60%.*選定/);
assert.match(sendai25Threshold, /評価委員.*委員会集計.*60%.*選定/);
assert.match(sendai26Threshold, /評価委員.*委員会集計.*60%.*選定/);
assert.match(yaizuThreshold, /案件全体.*60%.*選定/);
assert.notEqual(matsueThreshold, sendai25Threshold);
assert.notEqual(yaizuThreshold, sendai25Threshold);
assert.equal(thresholdScopeLabel("proposal_plus_function_subtotal_700").includes("700点"), true);
assert.match(ruleSummary(oumiSubtotal), /420点.*700点/);
assert.doesNotMatch(ruleSummary(oumiSubtotal), /1000点の42%/);

// The source and gate relationships must remain visible in the public rendering path.
for (const id of ["RULE-MATSUE-MIN-TOTAL", "RULE-SEN25-MIN-TOTAL",
                   "RULE-OUM-MIN-SUBTOTAL", "RULE-MATSUE-STAGE-INCLUSION",
                   "RULE-GOSEN-PRICE-REUSE"]) {
  const row = ruleById.get(id);
  assert.ok(row.locator, id + " missing exact Source location");
  assert.ok(sourceById.get(row.source_id).url, id + " missing official Source URL");
}
const changedGate = gateById.get("QG-OUM-08");
assert.ok(changedGate.base_locator);
assert.ok(changedGate.change_locator);
assert.notEqual(changedGate.base_source_id, changedGate.changed_by_source_id);
assert.ok(sourceById.get(changedGate.base_source_id).url);
assert.ok(sourceById.get(changedGate.changed_by_source_id).url);
assert.match(gateMeaningParts(changedGate).join(" "), /どちらか一方/);
assert.match(gateMeaningParts(gateById.get("QG-YAI-02")).join(" "), /いずれか/);
assert.match(gateMeaningParts(gateById.get("QG-YAI-04")).join(" "), /参加資格喪失/);
assert.match(gateMeaningParts(gateById.get("QG-HOK-04")).join(" "), /提供予定サービス.*入札無効/);
assert.match(sourceText, /appendGateEvidence\(entry, row, data\)/);
assert.match(sourceText, /appendRuleEvidence\(entry, row, data\)/);
assert.match(sourceText, /appendRuleEvidence\(relations, row, data\)/);
assert.match(sourceText, /source.title \|\| sourceLabel\(source\)/);
assert.match(sourceText, /資料取得日：/);
assert.match(sourceText, /データ収集日：/);
assert.doesNotMatch(sourceText, /一次資料をfresh確認済み/);

console.log("evaluation support regression: " + EVALUATION_TOPICS.length + " topics, canonical references and role boundaries resolved");
