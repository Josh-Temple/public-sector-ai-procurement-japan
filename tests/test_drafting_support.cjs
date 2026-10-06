"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  DRAFTING_DECISIONS,
  CITIZEN_SPECIALIZED,
  ROLE_EXAMPLES,
  parseDraftingCSV,
  effectiveSourceId,
  valueForEffective,
  caseBoundaryText
} = require("../assets/drafting.js");

const root = path.resolve(__dirname, "..");
const effective = parseDraftingCSV(fs.readFileSync(path.join(root, "data/effective_requirements.csv"), "utf8"));
const evaluations = parseDraftingCSV(fs.readFileSync(path.join(root, "data/evaluation_criteria.csv"), "utf8"));
const specialized = parseDraftingCSV(fs.readFileSync(path.join(root, "data/specialized_requirements.csv"), "utf8"));
const sources = parseDraftingCSV(fs.readFileSync(path.join(root, "data/source_documents.csv"), "utf8"));
const evidence = parseDraftingCSV(fs.readFileSync(path.join(root, "data/case_evidence_summary.csv"), "utf8"));

const effectiveById = new Map(effective.map(function (row) { return [row.effective_requirement_id, row]; }));
const evaluationById = new Map(evaluations.map(function (row) { return [row.criterion_id, row]; }));
const sourceById = new Map(sources.map(function (row) { return [row.source_id, row]; }));
const evidenceByCase = new Map(evidence.map(function (row) { return [row.case_id, row]; }));

for (const decision of DRAFTING_DECISIONS) {
  assert.ok(decision.id);
  assert.ok(decision.label);
  assert.ok(decision.question);
  assert.ok(Array.isArray(decision.variables) && decision.variables.length > 0);
  assert.equal(Object.prototype.hasOwnProperty.call(decision, "default"), false, decision.id + " must not define a recommended default");

  for (const id of decision.effective || []) {
    assert.ok(effectiveById.has(id), decision.id + " references missing effective requirement " + id);
  }
  for (const id of decision.evaluations || []) {
    assert.ok(evaluationById.has(id), decision.id + " references missing evaluation criterion " + id);
  }
  for (const selector of decision.specialized || []) {
    assert.ok(specialized.some(function (row) {
      return row.case_id === selector[0] && row.requirement_area === selector[1] && row.requirement_key === selector[2];
    }), decision.id + " references missing specialized requirement " + selector.join("::"));
  }
}

for (const selector of CITIZEN_SPECIALIZED) {
  assert.ok(specialized.some(function (row) {
    return row.case_id === selector[0] && row.requirement_area === selector[1] && row.requirement_key === selector[2];
  }), "missing citizen-facing selector " + selector.join("::"));
}

const ragDecision = DRAFTING_DECISIONS.find(function (decision) { return decision.id === "rag-scope"; });
assert.ok(ragDecision.effective.includes("EFF-fukushima-2026-rag-data-volume"));
assert.ok(ragDecision.effective.includes("EFF-kyoto-rag-scope"));
assert.equal(effectiveById.get("EFF-fukushima-2026-rag-data-volume").effective_status, "required");
assert.equal(effectiveById.get("EFF-kyoto-rag-scope").effective_status, "not_applicable");

const pricingDecision = DRAFTING_DECISIONS.find(function (decision) { return decision.id === "usage-pricing"; });
assert.ok(pricingDecision.effective.includes("EFF-minoh-overage-no-additional-fee"));

const authDecision = DRAFTING_DECISIONS.find(function (decision) { return decision.id === "authentication"; });
assert.ok(authDecision.effective.includes("EFF-minoh-minimum-accounts"));
assert.ok(authDecision.effective.includes("EFF-minoh-employee-auth"));
assert.notEqual(
  effectiveById.get("EFF-minoh-minimum-accounts").requirement_key,
  effectiveById.get("EFF-minoh-employee-auth").requirement_key
);

const citizenGeneration = specialized.find(function (row) {
  return row.case_id === "kobe-2026-tax-voicebot"
    && row.requirement_area === "answer_policy"
    && row.requirement_key === "generative_answer_allowed";
});
assert.ok(citizenGeneration);
assert.equal(citizenGeneration.value, "false");

const amended = effectiveById.get("EFF-oumi-llm-selection");
assert.ok(amended.changed_by_source_id);
assert.equal(valueForEffective(amended), amended.effective_value);
assert.notEqual(valueForEffective(amended), amended.original_value);
assert.ok(sourceById.has(effectiveSourceId(amended)));
assert.equal(sourceById.get(effectiveSourceId(amended)).document_type, "official_qa_amendment");

for (const id of ROLE_EXAMPLES.evaluations) assert.ok(evaluationById.has(id));
for (const id of ROLE_EXAMPLES.effective) assert.ok(effectiveById.has(id));
assert.match(ROLE_EXAMPLES.qualificationClaim, /^claims\//);

const bounded = Array.from(evidenceByCase.values()).find(function (row) {
  return row.public_reconstructability === "publicly_bounded";
});
assert.ok(bounded);
assert.match(caseBoundaryText(bounded), /契約後の最終仕様/);
assert.doesNotMatch(caseBoundaryText(bounded), /契約最終要件まで.*再構成可能/);

console.log("drafting support regression: " + DRAFTING_DECISIONS.length + " decisions, canonical references resolved");
