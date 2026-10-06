"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  changeTypeLabel,
  requirementTopicMatches,
  requirementKeywordMatches,
  requirementChangeSourceKind,
  requirementMatchesExplorerFilters,
  sourceDocumentRoleLabel,
} = require("../assets/app.js");

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

const root = path.resolve(__dirname, "..");
const effective = parseCSV(fs.readFileSync(path.join(root, "data/effective_requirements.csv"), "utf8"));
const sources = parseCSV(fs.readFileSync(path.join(root, "data/source_documents.csv"), "utf8"));
const sourceById = new Map(sources.map(source => [source.source_id, source]));
const byId = new Map(effective.map(row => [row.effective_requirement_id, row]));

assert.equal(requirementTopicMatches({ requirement_area: "adoption", requirement_key: "training_delivery" }, "data-handling"), false);
assert.equal(requirementTopicMatches({ requirement_area: "adoption", requirement_key: "elearning_use_scope" }, "data-handling"), false);
assert.equal(requirementTopicMatches({ requirement_area: "data_governance", requirement_key: "input_training_storage" }, "data-handling"), true);
assert.equal(requirementTopicMatches({ requirement_area: "data_location", requirement_key: "llm_server_storage" }, "data-handling"), true);

assert.equal(requirementTopicMatches({ requirement_area: "adoption", requirement_key: "training_delivery" }, "support-training"), true);
assert.equal(requirementTopicMatches({ requirement_area: "data_governance", requirement_key: "input_training_storage" }, "support-training"), false);
assert.equal(requirementTopicMatches({ requirement_area: "specialized", requirement_key: "council_support" }, "support-training"), false);

assert.equal(requirementTopicMatches({ requirement_area: "knowledge", requirement_key: "source_file_link" }, "files-capacity"), false);
assert.equal(requirementTopicMatches({ requirement_area: "knowledge", requirement_key: "document_capacity" }, "files-capacity"), true);

assert.equal(requirementTopicMatches({ requirement_area: "data_location", requirement_key: "llm_server_storage" }, "model"), false);
assert.equal(requirementTopicMatches({ requirement_area: "security", requirement_key: "domestic_llm_region" }, "model"), true);

assert.equal(requirementTopicMatches({ requirement_area: "usage", requirement_key: "usage_volume_accounting" }, "authentication"), false);
assert.equal(requirementTopicMatches({ requirement_area: "identity", requirement_key: "minimum_accounts" }, "authentication"), false);
assert.equal(requirementTopicMatches({ requirement_area: "identity", requirement_key: "account_count" }, "authentication"), false);
assert.equal(requirementTopicMatches({ requirement_area: "identity", requirement_key: "department_account_pattern" }, "authentication"), true);
assert.equal(requirementTopicMatches({ requirement_area: "identity", requirement_key: "end_user_account" }, "authentication"), true);
assert.equal(requirementTopicMatches({ requirement_area: "identity", requirement_key: "user_authentication" }, "authentication"), true);

for (const id of [
  "EFF-oumi-learning-videos",
  "EFF-sendai-training-mode",
  "EFF-sendai-elearning-scope",
  "EFF-fukushima-2025-training",
  "EFF-yamagata-2026-training-scope",
]) {
  const row = byId.get(id);
  assert.ok(row, `missing regression row: ${id}`);
  assert.equal(requirementTopicMatches(row, "data-handling"), false, `${id} must not be data-handling`);
}

for (const id of ["EFF-obu-council-support", "EFF-koshigaya-data-handling", "EFF-sendai-llm-data-use"]) {
  const row = byId.get(id);
  assert.ok(row, `missing regression row: ${id}`);
  assert.equal(requirementTopicMatches(row, "support-training"), false, `${id} must not be support-training`);
}

for (const id of ["EFF-fukushima-2026-minimum-accounts", "EFF-fukushima-2026-usage-accounting"]) {
  const row = byId.get(id);
  assert.ok(row, `missing regression row: ${id}`);
  assert.equal(requirementTopicMatches(row, "authentication"), false, `${id} must not be authentication`);
}

assert.equal(requirementTopicMatches(byId.get("EFF-sendai-source-link"), "files-capacity"), false);
assert.equal(requirementTopicMatches(byId.get("EFF-saitama-llm_storage"), "model"), false);
assert.equal(requirementTopicMatches(byId.get("EFF-sendai-account-model"), "authentication"), true);
assert.equal(requirementTopicMatches(byId.get("EFF-sendai-2026-user-auth"), "authentication"), true);
assert.equal(requirementTopicMatches(byId.get("EFF-gosen-2026-account-count"), "authentication"), false);

const qaRows = effective.filter(row => requirementMatchesExplorerFilters(
  row,
  { amended: "qa" },
  {},
  sourceById.get(row.changed_by_source_id)
));
assert.ok(qaRows.length > 0);
assert.ok(qaRows.every(row => sourceById.get(row.changed_by_source_id)?.document_type === "official_qa_amendment"));

const otherRows = effective.filter(row => requirementMatchesExplorerFilters(
  row,
  { amended: "other" },
  {},
  sourceById.get(row.changed_by_source_id)
));
assert.ok(otherRows.length > 0);
assert.ok(otherRows.every(row => {
  const type = sourceById.get(row.changed_by_source_id)?.document_type;
  return Boolean(type) && type !== "official_qa_amendment";
}));

assert.equal(requirementChangeSourceKind({ changed_by_source_id: "SRC-qa" }, { document_type: "official_qa_amendment" }), "qa");
assert.equal(requirementChangeSourceKind({ changed_by_source_id: "SRC-result" }, { document_type: "official_result" }), "other");
assert.equal(requirementChangeSourceKind({}, null), "");

assert.equal(requirementKeywordMatches(
  { requirement_key: "user_authentication", effective_value: "SSOを利用" },
  "sso",
  { government_name: "テスト市", procurement_title: "生成AI" }
), true);
assert.equal(requirementKeywordMatches(
  { requirement_key: "rag_capacity", effective_value: "100 GB" },
  "100 gb",
  { government_name: "テスト市", procurement_title: "生成AI" }
), true);
assert.equal(requirementKeywordMatches(
  { requirement_key: "rag_capacity", effective_value: "100 GB" },
  "LGWAN",
  { government_name: "テスト市", procurement_title: "生成AI" }
), false);


const matsueLgwan = byId.get("EFF-matsue-lgwan-asp");
assert.ok(matsueLgwan);
assert.equal(requirementTopicMatches(matsueLgwan, "network"), true);

const matsueRagDocs = byId.get("EFF-matsue-rag-documents-per-group");
assert.ok(matsueRagDocs);
assert.equal(requirementTopicMatches(matsueRagDocs, "rag"), true);
assert.equal(requirementTopicMatches(matsueRagDocs, "files-capacity"), true);

const minohAccounts = byId.get("EFF-minoh-minimum-accounts");
assert.ok(minohAccounts);
assert.equal(requirementTopicMatches(minohAccounts, "accounts-usage"), true);
assert.equal(requirementTopicMatches(minohAccounts, "authentication"), false);

const minohAuth = byId.get("EFF-minoh-employee-auth");
assert.ok(minohAuth);
assert.equal(requirementTopicMatches(minohAuth, "authentication"), true);

const minohOverage = byId.get("EFF-minoh-overage-no-additional-fee");
assert.ok(minohOverage);
assert.equal(requirementTopicMatches(minohOverage, "pricing-overage"), true);

const minohRagFile = byId.get("EFF-minoh-rag-file-size");
assert.ok(minohRagFile);
assert.equal(requirementTopicMatches(minohRagFile, "rag"), true);
assert.equal(requirementTopicMatches(minohRagFile, "files-capacity"), true);

const matsueNoTraining = byId.get("EFF-matsue-input-output-training");
assert.ok(matsueNoTraining);
assert.equal(requirementTopicMatches(matsueNoTraining, "data-handling"), true);
assert.equal(requirementTopicMatches(matsueNoTraining, "model"), false);

const itoshimaQa = byId.get("EFF-itoshima-support-audience");
assert.ok(itoshimaQa);
assert.equal(requirementMatchesExplorerFilters(
  itoshimaQa,
  { amended: "qa" },
  {},
  sourceById.get(itoshimaQa.changed_by_source_id)
), true);

assert.equal(requirementKeywordMatches(
  byId.get("EFF-itoshima-citizen-scope"),
  "市民",
  { government_name: "糸島市", procurement_title: "糸島市市民向け生成AIチャットボットサービス構築業務" }
), true);

for (const value of new Set(effective.map(row => row.change_type).filter(Boolean))) {
  assert.notEqual(changeTypeLabel(value), "確認済み", `change type needs a public label: ${value}`);
}

assert.equal(sourceDocumentRoleLabel("official_qa_amendment"), "Q&A・訂正");
assert.equal(sourceDocumentRoleLabel("official_specification"), "仕様書");

console.log(`requirement explorer regression: ${effective.length} effective rows, ${qaRows.length} Q&A-changed rows, ${otherRows.length} other changed-source rows`);
