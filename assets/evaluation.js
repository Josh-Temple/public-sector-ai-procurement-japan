"use strict";

const EVALUATION_DATA_FILES = {
  cases: "./data/cases.csv",
  effective: "./data/effective_requirements.csv",
  evaluations: "./data/evaluation_criteria.csv",
  procurement: "./data/procurement_structure.csv",
  vendors: "./data/vendor_scores.csv",
  gates: "./data/qualification_gates.csv",
  rules: "./data/evaluation_rules.csv",
  sources: "./data/source_documents.csv",
  evidence: "./data/case_evidence_summary.csv"
};

const EVALUATION_TOPICS = [
  {
    id: "rag-grounding",
    label: "RAG・根拠表示・根拠がない場合の応答",
    question: "RAGの有無ではなく、検索品質、根拠表示、根拠がない場合の応答をどこまで最低条件にし、どこを比較するか。",
    caution: "RAG、検索精度、根拠表示、容量、根拠がない場合の応答は別の比較軸です。市民向けの安全設計を職員向けSaaS全般へ一般化しません。",
    effectiveIds: ["EFF-saitama-citizen_grounding", "EFF-matsue-source-display"],
    criterionIds: ["SAI-P06", "SAI-P07", "SEN-06", "MATSUE-DOC-03"]
  },
  {
    id: "security-certification",
    label: "セキュリティ・認証",
    question: "認証を参加資格、最低条件、提案評価のどこに置くか。認証名だけで役割を決めない。",
    caution: "同じ認証でも、応募可否を決める参加資格、仕様上の条件、提案を比較する評価項目では効果が異なります。",
    effectiveIds: ["EFF-oumi-certification", "EFF-oumi-ismap", "EFF-saitama-ismap_status"],
    criterionIds: ["SAI-P01", "KOG-03", "OUM-03"],
    gateIds: ["QG-HOK-04", "QG-OUM-07", "QG-YAI-02"]
  },
  {
    id: "model-policy",
    label: "モデル選択・更新",
    question: "モデル数や名称を最低線にするか、選択肢・更新・用途別の使い分けを提案差として評価するか。",
    caution: "特定年度のモデル名やモデル数を現在の標準条件として再利用しません。",
    effectiveIds: ["EFF-oumi-llm-selection", "EFF-obu-model-freshness"],
    criterionIds: ["SAI-P10", "MATSUE-DOC-02"]
  },
  {
    id: "data-handling",
    label: "保存・学習利用・データ所在",
    question: "越えてはならない情報管理境界と、追加統制・監査成熟度の提案差を分ける。",
    caution: "法的・セキュリティ上の不可譲条件を、加点だけで代替しません。",
    effectiveIds: ["EFF-obu-data-location", "EFF-koshigaya-data-handling"],
    criterionIds: []
  },
  {
    id: "network",
    label: "LGWAN・ネットワーク",
    question: "端末環境、接続経路、LGWAN-ASP等を最低条件にするか、複数方式の運用性を評価するか。",
    caution: "「LGWAN対応」の一語に、endpoint、サービス登録、接続方式、認証をまとめません。",
    effectiveIds: ["EFF-oumi-network", "EFF-matsue-lgwan-browser", "EFF-matsue-lgwan-asp"],
    criterionIds: ["KOBE-DIFY-04"]
  },
  {
    id: "authentication",
    label: "認証・アクセス制御",
    question: "本人性・権限制御の最低線と、運用性・管理負荷の提案差を分ける。",
    caution: "アカウント数と認証方式を同じ論点として扱いません。",
    effectiveIds: ["EFF-sendai-2026-user-auth", "EFF-minoh-employee-auth"],
    criterionIds: ["SEN-02", "KIT-07"]
  },
  {
    id: "usage-pricing",
    label: "利用量・料金・価格評価",
    question: "利用上限や追加課金の契約条件と、価格上限・失格条件・選定下限・価格点算式を分けて読む。",
    caution: "価格上限、価格点、失格条件、入札額、契約金額は別の数値・ルールです。案件固有の配点を推奨比率へ変換しません。",
    effectiveIds: ["EFF-minoh-overage-no-additional-fee", "EFF-yaizu-price-fixed", "EFF-yaizu-token-topup"],
    criterionIds: ["SAI-P12", "SAI-P13", "OUM-14", "GOS-05", "KVB-05", "KOBE-DIFY-09", "MINOH-GENAI-PRICE"],
    ruleIds: ["RULE-KVB-CEILING", "RULE-KVB-CEILING-DISQ", "RULE-KVB-MIN-TOTAL", "RULE-KVB-PRICE-FORMULA", "RULE-DIFY-CEILING", "RULE-DIFY-PRICE-FORMULA", "RULE-MINOH-PLANNED-PRICE", "RULE-MINOH-PRICE-FORMULA", "RULE-YAI-CEILING", "RULE-YAI-MIN-TOTAL", "RULE-YAI-PRICE-FORMULA", "RULE-OUM-MIN-SUBTOTAL", "RULE-MATSUE-MIN-TOTAL", "RULE-GOSEN-PRICE-FORMULA"]
  },
  {
    id: "support-adoption",
    label: "サポート・研修・定着",
    question: "必ず提供させる支援と、内容・継続性・定着方法の差を評価する部分を分ける。",
    caution: "研修回数や教材数だけで支援品質を代表させません。",
    effectiveIds: ["EFF-oumi-learning-videos", "EFF-fukushima-2025-training"],
    criterionIds: ["OUM-11", "YAI-06", "MATSUE-FINAL-04", "SAI-P16"]
  },
  {
    id: "implementation-capability",
    label: "実施方法・体制・実績",
    question: "実現可能性、体制、類似実績を、参加資格と提案比較のどちらで確認するか。",
    caution: "類似実績は案件によって参加資格にも評価項目にもなります。評価点だけから応募条件を推測しません。",
    effectiveIds: [],
    criterionIds: ["KOB-03", "SAI-P15", "SAI-P17", "SEN-11", "OUM-04", "KVB-02"],
    gateIds: ["QG-OUM-08", "QG-YAI-01"]
  },
  {
    id: "ui-usability",
    label: "UI・操作性",
    question: "利用者・管理者が迷わず操作できることを、最低条件ではなく提案比較としてどこまで評価するか。",
    caution: "表示する点数は各案件内の配点です。複合評価項目の全点をUIだけの配点とは解釈せず、横断的な推奨値にも変換しません。",
    effectiveIds: [],
    criterionIds: ["SEN-04", "SEN-07", "GOS-02", "MATSUE-FINAL-02"]
  },
  {
    id: "operations-maintenance",
    label: "可用性・運用・保守",
    question: "稼働条件、障害対応、保守・更新、問い合わせ対応を、最低条件と提案比較のどこに置くか。",
    caution: "SLA・稼働率・サポート時間は案件固有です。研修・定着支援や目的の異なる監査ログをこの論点へ一括しません。",
    effectiveIds: ["EFF-itoshima-availability", "EFF-koshigaya-support-hours"],
    criterionIds: ["GOS-03", "OUM-10"]
  },
  {
    id: "citizen-safety",
    label: "市民向け安全・回答制御",
    question: "根拠がない場合の応答、回答率・解決率、生成を許す範囲を市民向け用途の文脈で確認する。",
    caution: "市民向け案件の設計を、職員向け生成AIの一般ルールへ昇格しません。",
    effectiveIds: ["EFF-saitama-citizen_grounding"],
    criterionIds: ["SAI-P06", "SAI-P07", "KVB-04"],
    audience: "citizen"
  }
];

const EVALUATION_CASE_IDS = [
  "saitama-2026-ai-digital-support",
  "oumi-2026-joint-genai",
  "gosen-2026-genai-service",
  "kobe-2025-dify-platform",
  "kobe-2026-tax-voicebot",
  "minoh-2026-genai-license",
  "sendai-2025-genai-pilot",
  "sendai-2026-genai-service",
  "yaizu-2025-genai-service",
  "matsue-2026-genai-support",
  "hokkaido-2026-genai-rag-service"
];

// Audited case-local price-related scored items. Topic representatives are NOT an inventory.
// These IDs include pricing-related scoring (not necessarily a mathematical price formula).
const PRICE_CRITERION_IDS = new Set([
  "SAI-P12", "SAI-P13", "OUM-14", "GOS-05", "KVB-05", "KOBE-DIFY-09",
  "MINOH-GENAI-PRICE", "YAI-10", "MATSUE-DOC-04", "ITOSHIMA-CHATBOT-02"
]);

function isCasePriceCriterion(row) {
  return PRICE_CRITERION_IDS.has(row.criterion_id);
}

function parseEvaluationCSV(text) {
  const out = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; } else quoted = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field.replace(/\r$/, "")); out.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (quoted) throw new Error("CSVの引用符が閉じられていません");
  if (field.length || row.length) { row.push(field.replace(/\r$/, "")); out.push(row); }
  const header = out.shift() || [];
  if (!header.length || !header[0] || out.some(values => values.length !== header.length)) throw new Error("CSVの列構造を確認できません");
  return out
    .filter(function (values) { return values.some(function (value) { return value !== ""; }); })
    .map(function (values) {
      return Object.fromEntries(header.map(function (key, index) { return [key, values[index] || ""]; }));
    });
}

async function loadEvaluationCSV(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(url + ": HTTP " + response.status);
  return parseEvaluationCSV(await response.text());
}

function byKey(rows, key) {
  return new Map(rows.map(function (row) { return [row[key], row]; }));
}

function roleForEffective(row) {
  const status = row.effective_status || row.original_status || "";
  if (status === "required" || status === "required_delivery" || status === "required_alternative") return "最低条件";
  if (status === "required_or_planned") return "利用可能または実装予定を許容（条件は本文を確認）";
  if (status === "required_or_in_progress") return "対応済みまたは対応中を許容（条件は本文を確認）";
  const labels = {
    desirable: "望ましい条件",
    optional: "任意条件",
    optional_disclosure: "任意開示",
    allowed_alternative: "代替可",
    prohibited: "禁止条件",
    prohibited_persistent_only: "禁止条件",
    removed: "削除済み",
    not_applicable: "対象外",
    not_qualification: "参加資格ではない",
    context: "前提・文脈",
    defined: "定義済み条件",
    evaluation_context: "評価上の文脈"
  };
  return labels[status] || "状態を確認";
}

function effectiveValue(row) {
  return row.effective_value || "反映後の記載は未登録（当初値と区別してください）";
}
function evaluationOfficialUrl(value) {
  if (!value || typeof value !== "string" || /[\\u0000-\\u001f\\u007f]/.test(value)) return "";
  try {
    const url = new URL(value);
    return (["http:", "https:"].includes(url.protocol) && url.hostname) ? value : "";
  } catch (_) { return ""; }
}
function markdownSourceLink(source) {
  const title = (source.title || sourceLabel(source)).replace(/([\\\\[\\]])/g,"\\\\$1");
  const url = evaluationOfficialUrl(source.url);
  return url ? "[" + title + "](" + url.split("(").join("%28").split(")").join("%29") + ")" :
    title + "（公式URL未登録・または形式不正）";
}

function effectiveSourceId(row) {
  return row.changed_by_source_id || row.base_source_id || "";
}

function sourceForEvaluation(row, data) {
  return data.sourceByUrl.get(row.source_url || "");
}

function caseBoundaryText(evidence) {
  if (!evidence) return "案件単位の公開Evidence境界は未評価です。";
  if (evidence.public_reconstructability === "publicly_bounded") {
    return "公開資料で確認できる範囲です。選定結果から契約後の最終仕様・実稼働を推測しません。";
  }
  if (evidence.public_reconstructability === "publicly_reconstructable") {
    return "公開資料から契約最終要件まで再構成できると、この調査では評価しています。";
  }
  return "公開資料の確認範囲を案件詳細で確認してください。";
}

function scoreContext(row) {
  const points = Number(row.points);
  const total = Number(row.total_points);
  if (!Number.isFinite(points) || !Number.isFinite(total) || total <= 0) return "配点情報を確認してください";
  return row.points + " / " + row.total_points + "点 ・ " + (row.assessment_stage || "審査段階未登録");
}

function caseLink(caseId) {
  return "./index.html?case=" + encodeURIComponent(caseId);
}

function evaluationStateUrl(baseUrl, topicId, caseId) {
  const url = new URL(baseUrl);
  url.search = "";
  url.hash = "";
  if (topicId) url.searchParams.set("topic", topicId);
  if (caseId) url.searchParams.set("case", caseId);
  return url.toString();
}

function buildEvaluationMemo(caseId, topic, data, baseUrl) {
  const caseRow = data.caseById.get(caseId);
  if (!caseRow) throw new Error("case is not in the displayed comparison subset");
  const link = evaluationStateUrl(baseUrl, topic.id, caseId);
  const rows = data.evaluations.filter(function (row) { return row.case_id === caseId; });
  const rules = data.rules.filter(function (row) { return row.case_id === caseId; });
  const gates = data.gates.filter(function (row) { return row.case_id === caseId; });
  const procurement = data.procurementByCase.get(caseId);
  const evidence = data.evidenceByCase.get(caseId);
  const lines = [
    "# 自治体AI調達：評価・参加資格の検討メモ",
    "",
    "- 案件：" + caseRow.government_name + " / " + caseRow.procurement_title,
    "- 論点：" + topic.label,
    "- 表示状態URL：" + link,
    "",
    "このメモは登録された案件内の一次資料参照を整理したものです。配点の推奨、契約最終仕様、現時点の資料アクセス可否や条件の有効性を保証しません。",
    "未登録の項目は、原資料に存在しないことを意味しません。",
    caseBoundaryText(evidence),
    "",
    "## 評価項目（審査段階・当該段階の満点）",
    ""
  ];
  function evidenceLine(sourceId, locator, label) {
    const source = data.sourceById.get(sourceId);
    const title = source ? source.title || sourceLabel(source) : "資料の参照先が未登録";
    const citation = source ? markdownSourceLink(source) : title + "（公式URL未登録）";
    return "  - " + label + "：" + citation +
      (locator ? " — 該当箇所：" + locator : "") +
      (source && source.published_at ? " ／ 公表日：" + source.published_at : "") +
      (source && source.retrieved_at ? " ／ 資料取得日：" + source.retrieved_at : "");
  }
  if (!rows.length) lines.push("構造化された配点行は未登録です。");
  rows.forEach(function (row) {
    lines.push("- " + row.criterion_summary + "：" + scoreContext(row));
    const source = sourceForEvaluation(row, data);
    if (source) lines.push(evidenceLine(source.source_id, row.locator || "", "根拠"));
    else lines.push("  - 根拠：公式資料への参照先が登録されていません");
  });
  lines.push("", "## 参加資格（評価点とは別）", "");
  if (!gates.length) lines.push("参加資格の構造化行は未登録です。");
  gates.forEach(function (row) {
    lines.push("- " + row.condition_summary);
    gateMeaningParts(row).forEach(function (part) { lines.push("  - " + part); });
    lines.push(evidenceLine(row.base_source_id, row.base_locator, "元の根拠"));
    if (row.changed_by_source_id) lines.push(evidenceLine(row.changed_by_source_id, row.change_locator, "Q&A・訂正"));
  });
  lines.push("", "## 選定・価格・審査段階間のルール", "");
  if (!rules.length) lines.push("ルールの構造化行は未登録です。");
  rules.forEach(function (row) {
    lines.push("- " + ruleSummary(row));
    lines.push(evidenceLine(row.source_id, row.locator, "根拠"));
    if (row.collected_at) lines.push("  - データ収集日：" + row.collected_at);
  });
  lines.push("", "## 価格の扱い", "");
  const prices = rows.filter(isCasePriceCriterion);
  if (!prices.length) lines.push("価格に関連づけた構造化配点行は未登録です。");
  prices.forEach(function (row) { lines.push("- " + row.criterion_summary + "：" + scoreContext(row)); });
  if (procurement && procurement.pricing_basis) lines.push("- 調達構造の価格条件：" + procurement.pricing_basis);
  lines.push("", "## 確認上の制約", "",
    "評価項目・参加資格・選定下限・価格算式は異なる役割です。",
    "他案件の点数との単純比較、横断的な配点基準への変換、未確認の現行性・契約最終条件の断定は行いません。",
    "公式資料の内容は該当箇所と後続Q&Aを個別に再確認してください。", "");
  return lines.join("\n");
}

function claimLink(path) {
  return "https://github.com/Josh-Temple/public-sector-ai-procurement-japan/blob/main/" + path;
}

function sourceLabel(source) {
  if (!source) return "公式資料";
  const labels = {
    official_qa_amendment: "Q&A・訂正",
    official_evaluation: "評価資料",
    official_bid_notice: "入札公告",
    official_procurement_guide: "実施要領",
    official_specification: "仕様書",
    official_result: "選定結果"
  };
  return labels[source.document_type] || "公式資料";
}

function appendText(parent, tag, value, className) {
  const node = document.createElement(tag);
  node.textContent = value;
  if (className) node.className = className;
  parent.appendChild(node);
  return node;
}

function appendLink(parent, href, label, external) {
  if (external && !evaluationOfficialUrl(href)) {
    return appendText(parent, "span", label.replace(/ ↗$/, "") + "（公式URLは利用できません）");
  }
  const a = document.createElement("a");
  a.href = href;
  a.textContent = label;
  if (external) { a.target = "_blank"; a.rel = "noreferrer"; }
  parent.appendChild(a);
  return a;
}

function renderLinks(card, caseId, sourceOrSources, claimPath) {
  const links = document.createElement("div");
  links.className = "evaluation-evidence-links";
  appendLink(links, caseLink(caseId), "案件詳細", false);
  const sources = Array.isArray(sourceOrSources) ? sourceOrSources : [sourceOrSources];
  const seen = new Set();
  sources.filter(Boolean).forEach(function (source) {
    if (!source.url || seen.has(source.url)) return;
    seen.add(source.url);
    appendLink(links, source.url, sourceLabel(source) + " ↗", true);
  });
  if (claimPath) appendLink(links, claimLink(claimPath), "照合済みの調査記録 ↗", true);
  card.appendChild(links);
}

function evaluationCard(row, data) {
  const card = document.createElement("article");
  card.className = "evaluation-evidence";
  appendText(card, "p", "評価項目", "evaluation-role");
  appendText(card, "h3", row.criterion_summary);
  appendText(card, "p", data.caseById.get(row.case_id)?.government_name || row.government_name || row.case_id, "evaluation-case");
  appendText(card, "p", scoreContext(row), "evaluation-score");
  appendText(card, "p", "当該案件内の配点。横断的な推奨値ではありません。", "evaluation-boundary");
  renderLinks(card, row.case_id, sourceForEvaluation(row, data));
  return card;
}

function effectiveCard(row, data) {
  const card = document.createElement("article");
  card.className = "evaluation-evidence";
  appendText(card, "p", roleForEffective(row), "evaluation-role");
  appendText(card, "h3", effectiveValue(row));
  appendText(card, "p", data.caseById.get(row.case_id)?.government_name || row.case_id, "evaluation-case");
  appendText(card, "p", row.changed_by_source_id ? "Q&A・訂正反映後の有効要件" : "公募時要件", "evaluation-score");
  if (row.changed_by_source_id) appendText(card, "p", "元仕様ではなく、後続資料を反映した値を表示しています。", "evaluation-change");
  appendText(card, "p", caseBoundaryText(data.evidenceByCase.get(row.case_id)), "evaluation-boundary");
  const evidenceSources = [
    data.sourceById.get(row.base_source_id),
    data.sourceById.get(row.changed_by_source_id)
  ];
  renderLinks(card, row.case_id, evidenceSources);
  return card;
}

function qualificationCard(row, data) {
  const card = document.createElement("article");
  card.className = "evaluation-evidence";
  appendText(card, "p", "参加資格", "evaluation-role");
  appendText(card, "h3", row.condition_summary);
  appendText(card, "p", data.caseById.get(row.case_id)?.government_name || row.case_id, "evaluation-case");
  gateMeaningParts(row).forEach(function (part) { appendText(card, "p", part, "evaluation-score"); });
  if (row.changed_by_source_id) appendText(card, "p", "Q&A・訂正を反映した参加資格です。", "evaluation-change");
  appendText(card, "p", "評価項目や仕様上の最低条件とは別の役割です。", "evaluation-boundary");
  appendGateEvidence(card, row, data);
  renderLinks(card, row.case_id, null);
  return card;
}

function ruleTypeLabel(type) {
  const labels = {
    minimum_total_score: "選定下限",
    minimum_stage_score: "段階別下限",
    minimum_criterion_score: "項目別下限",
    minimum_subtotal_score: "部分合計の選定下限",
    stage_relation: "審査段階の得点関係",
    disqualification_condition: "失格条件",
    proposal_ceiling: "価格上限",
    planned_price: "予定価格",
    price_evaluation_formula: "価格点算式",
    tie_break_rule: "同点時ルール"
  };
  return labels[type] || "選定ルール";
}

function thresholdScopeLabel(scope) {
  const labels = {
    case_total: "案件全体の満点",
    evaluator_total: "各委員の合計得点（満点基準）",
    selection_committee_aggregate: "評価委員の合計得点（委員会集計・満点基準）",
    proposal_plus_function_subtotal_700: "企画提案・機能デモの小計700点"
  };
  return labels[scope] || (scope ? "集計対象：" + scope : "集計対象未登録");
}

function gateMeaningParts(row) {
  const targets = {bidder: "入札者", proposer: "提案者", offered_service: "提供予定サービス", joint_proposal: "共同提案"};
  const effects = {bid_invalid: "入札無効", not_qualified: "参加資格を満たさない", qualification_lost: "参加資格喪失"};
  const parts = [];
  if (row.applies_to) parts.push("対象：" + (targets[row.applies_to] || row.applies_to));
  if (row.satisfaction_rule) parts.push("充足方法：" + row.satisfaction_rule);
  if (row.unmet_effect) parts.push("不充足時：" + (effects[row.unmet_effect] || row.unmet_effect));
  return parts;
}

function ruleSummary(row) {
  if (row.rule_type === "proposal_ceiling" || row.rule_type === "planned_price") {
    const rawAmount = String(row.amount_jpy ?? "").trim();
    const amount = rawAmount ? Number(rawAmount) : NaN;
    const tax = row.tax_basis === "tax_included" ? "（税込）" : row.tax_basis === "tax_excluded" ? "（税抜）" : "";
    return ruleTypeLabel(row.rule_type) + "：" + (Number.isFinite(amount) ? amount.toLocaleString("ja-JP") + "円" : "金額未登録") + tax;
  }
  if (row.rule_type.startsWith("minimum_")) {
    const threshold = row.threshold_unit === "percent_of_total"
      ? thresholdScopeLabel(row.aggregation_scope) + "の" + row.threshold_value + "%"
      : thresholdScopeLabel(row.aggregation_scope) + "で" + row.threshold_value + "点";
    const consequence = row.effect === "not_selected" ? "下限未満の場合は選定対象としません。" : "";
    return ruleTypeLabel(row.rule_type) + "：" + threshold + "。" + consequence +
      (row.notes ? " " + row.notes : "");
  }
  if (row.rule_type === "stage_relation") return ruleTypeLabel(row.rule_type) + "：" + (row.notes || row.effect || "公式資料を確認");
  if (row.rule_type === "price_evaluation_formula") return ruleTypeLabel(row.rule_type) + "：" + row.formula_text;
  if (row.rule_type === "tie_break_rule") return ruleTypeLabel(row.rule_type) + (row.rule_order ? " " + row.rule_order : "") + "：" + (row.notes || "公式資料を確認");
  return ruleTypeLabel(row.rule_type) + "：" + (row.notes || row.effect || "公式資料を確認");
}

function ruleCard(row, data) {
  const card = document.createElement("article");
  card.className = "evaluation-evidence";
  appendText(card, "p", ruleTypeLabel(row.rule_type), "evaluation-role");
  appendText(card, "h3", ruleSummary(row));
  appendText(card, "p", data.caseById.get(row.case_id)?.government_name || row.case_id, "evaluation-case");
  const context = [row.scope_stage, row.criterion_id].filter(Boolean).join(" ・ ");
  appendText(card, "p", context || "案件全体のルール", "evaluation-score");
  appendText(card, "p", "資料の取得記録は、現在のアクセス可否や条件の有効性を保証しません。", "evaluation-boundary");
  appendRuleEvidence(card, row, data);
  renderLinks(card, row.case_id, null);
  return card;
}

function appendCaseSourceLinks(parent, sources) {
  const links = document.createElement("p");
  links.className = "case-dialog-actions evaluation-case-source-links";
  const seen = new Set();
  (Array.isArray(sources) ? sources : [sources]).filter(Boolean).forEach(function (source) {
    if (!source.url || seen.has(source.url)) return;
    seen.add(source.url);
    appendLink(links, source.url, sourceLabel(source) + " ↗", true);
  });
  if (links.children.length) parent.appendChild(links);
}

function appendSourceEvidence(parent, source, locator, prefix) {
  const line = document.createElement("p");
  line.className = "evaluation-case-source-links";
  line.appendChild(document.createTextNode(prefix + "："));
  if (source && source.url) appendLink(line, source.url, source.title || sourceLabel(source), true);
  else line.appendChild(document.createTextNode(source ? (source.title || "公式資料・URL未登録") : "資料未登録"));
  if (locator) line.appendChild(document.createTextNode(" ／ 該当箇所：" + locator));
  parent.appendChild(line);
  if (source && source.retrieved_at) appendText(parent, "p", "資料取得日：" + source.retrieved_at, "evaluation-boundary");
}

function appendRuleEvidence(parent, row, data) {
  appendSourceEvidence(parent, data.sourceById.get(row.source_id), row.locator, "根拠");
  if (row.collected_at) appendText(parent, "p", "データ収集日：" + row.collected_at, "evaluation-boundary");
}

function appendGateEvidence(parent, row, data) {
  appendSourceEvidence(parent, data.sourceById.get(row.base_source_id), row.base_locator, "元の根拠");
  if (row.changed_by_source_id) {
    appendSourceEvidence(parent, data.sourceById.get(row.changed_by_source_id), row.change_locator, "Q&A・訂正");
  }
}

function renderStageRelations(root, rows, data) {
  if (!rows.length) return;
  const relations = document.createElement("div");
  relations.className = "evaluation-stage-relations";
  appendText(relations, "p", "段階間の得点関係", "evaluation-role");
  rows.forEach(function (row) {
    appendText(relations, "p", row.notes || ruleSummary(row), "scope-note");
    appendRuleEvidence(relations, row, data);
  });
  root.appendChild(relations);
}

function renderTopicLinks(activeId, caseId) {
  const root = document.getElementById("evaluation-topic-links");
  if (!root) return;
  root.replaceChildren();
  EVALUATION_TOPICS.forEach(function (topic, index) {
    const a = document.createElement("a");
    a.className = "theme-link" + (topic.id === activeId ? " is-active" : "");
    a.href = typeof window !== "undefined"
      ? evaluationStateUrl(window.location.href, topic.id, caseId)
      : "./evaluation.html?topic=" + encodeURIComponent(topic.id);
    if (topic.id === activeId) a.setAttribute("aria-current", "page");
    appendText(a, "span", String(index + 1).padStart(2, "0"));
    appendText(a, "strong", topic.label);
    appendText(a, "small", topic.question);
    root.appendChild(a);
  });
}

function renderTopic(topic, data) {
  const root = document.getElementById("evaluation-topic-detail");
  root.replaceChildren();

  const heading = document.createElement("div");
  heading.className = "section-heading split-heading";
  const left = document.createElement("div");
  appendText(left, "p", topic.audience === "citizen" ? "CITIZEN-FACING TOPIC" : "PROCUREMENT ROLE", "eyebrow");
  const h2 = appendText(left, "h2", topic.label);
  h2.id = "evaluation-topic-heading";
  heading.appendChild(left);
  appendText(heading, "p", topic.question, "section-lead");
  root.appendChild(heading);
  appendText(root, "p", topic.caution, "scope-note");

  const list = document.createElement("div");
  list.className = "evaluation-evidence-list";
  (topic.effectiveIds || []).forEach(function (id) {
    const row = data.effectiveById.get(id);
    if (row) list.appendChild(effectiveCard(row, data));
  });
  (topic.criterionIds || []).forEach(function (id) {
    const row = data.evaluationById.get(id);
    if (row) list.appendChild(evaluationCard(row, data));
  });
  (topic.gateIds || []).forEach(function (id) {
    const row = data.gateById.get(id);
    if (row) list.appendChild(qualificationCard(row, data));
  });
  (topic.ruleIds || []).forEach(function (id) {
    const row = data.ruleById.get(id);
    if (row) list.appendChild(ruleCard(row, data));
  });
  if (!list.children.length) appendText(list, "p", "現在の構造化コーパスでは、この論点の表示対象を登録していません。", "scope-note");
  root.appendChild(list);

  const back = document.createElement("p");
  back.className = "case-dialog-actions";
  appendLink(back, "./drafting.html#" + draftingDecisionForTopic(topic.id), "仕様側の論点へ戻る →", false);
  root.appendChild(back);
}

function draftingDecisionForTopic(topicId) {
  const map = {
    "rag-grounding": "grounding-fallback",
    "security-certification": "data-handling",
    "model-policy": "model-policy",
    "data-handling": "data-handling",
    "network": "network",
    "authentication": "authentication",
    "usage-pricing": "usage-pricing",
    "support-adoption": "support-adoption",
    "implementation-capability": "support-adoption",
    "ui-usability": "drafting-index",
    "operations-maintenance": "support-adoption",
    "citizen-safety": "generation-boundary"
  };
  return map[topicId] || "drafting-index";
}

function awardBasisLabel(value) {
  const labels = {
    highest_combined_primary_secondary_score: "一次・二次の合計得点で選定",
    highest_evaluation_score_with_50pct_threshold: "最高評価点。50%未満は選定しない",
    highest_evaluation_score_with_60pct_threshold: "最高評価点。60%未満は選定しない",
    highest_total_score: "総合得点で選定",
    "highest_total_score; tie broken by content score then lottery": "総合得点。同点時は内容点、その後抽選",
    highest_total_evaluation_score: "総合評価点で落札者を決定",
    best_overall_proposal: "総合的に最も優れた提案を選定",
    lowest_valid_bid_within_planned_price: "予定価格内の最低有効価格で落札"
  };
  return Object.prototype.hasOwnProperty.call(labels,value) ? labels[value] :
    (value ? `選定方法の表示名は未整理（登録値：${value}）` : "選定方法の登録値なし");
}

function renderStageGroups(root, rows) {
  if (!rows.length) {
    appendText(root, "p", "この案件には、提案評価の配点として整理したデータが登録されていません。価格競争や参加資格が中心の案件では、評価点が存在しない場合があります。", "scope-note");
    return;
  }
  const groups = new Map();
  rows.forEach(function (row) {
    const key = (row.assessment_stage || "審査段階未登録") + "::" + row.total_points;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  });
  groups.forEach(function (items) {
    const details = document.createElement("details");
    details.className = "evaluation-stage";
    const summary = document.createElement("summary");
    summary.textContent = (items[0].assessment_stage || "審査段階未登録") + " ・ " + items[0].total_points + "点満点 ・ " + items.length + "項目";
    details.appendChild(summary);
    const body = document.createElement("div");
    body.className = "evaluation-stage-rows";
    items.forEach(function (row) {
      const line = document.createElement("p");
      appendText(line, "strong", row.criterion_summary + " ");
      line.appendChild(document.createTextNode(row.points + " / " + row.total_points + "点"));
      body.appendChild(line);
    });
    details.appendChild(body);
    root.appendChild(details);
  });
}

function renderVendorResults(root, rows) {
  const section = document.createElement("div");
  section.className = "evaluation-case-block";
  appendText(section, "h3", "公開された結果");
  if (!rows.length) {
    appendText(section, "p", "この案件について、公開得点として整理したデータは登録されていません。選定結果から評価項目別の得点は推測しません。", "scope-note");
    root.appendChild(section);
    return;
  }
  appendText(section, "p", "公開された総合点・段階点・順位の範囲だけを表示します。総合点から評価項目別得点を逆算しません。", "scope-note");
  const list = document.createElement("div");
  list.className = "evaluation-result-list";
  rows.forEach(function (row) {
    const p = document.createElement("p");
    const total = row.total_score ? row.total_score + (row.total_score_max ? " / " + row.total_score_max : "") : "総合点未登録";
    const rank = row.rank ? "・" + row.rank + "位" : "";
    const selected = row.selected === "true" ? "・選定" : "";
    p.textContent = (row.vendor_name || row.vendor_label || "提案者") + "： " + total + rank + selected;
    list.appendChild(p);
  });
  section.appendChild(list);
  root.appendChild(section);
}

function renderCase(caseId, data) {
  const root = document.getElementById("evaluation-case-detail");
  root.replaceChildren();
  const caseRow = data.caseById.get(caseId);
  if (!caseRow) return;
  const procurement = data.procurementByCase.get(caseId);
  const evidence = data.evidenceByCase.get(caseId);
  const evaluations = data.evaluations.filter(function (row) { return row.case_id === caseId; });
  const vendorRows = data.vendors.filter(function (row) { return row.case_id === caseId; });
  const caseRules = data.rules.filter(function (row) { return row.case_id === caseId; });
  const stageRelations = caseRules.filter(function (row) { return row.rule_type === "stage_relation"; });
  const selectionRules = caseRules.filter(function (row) { return row.rule_type !== "stage_relation"; });
  const caseGates = data.gates.filter(function (row) { return row.case_id === caseId; });

  const header = document.createElement("div");
  header.className = "evaluation-case-header";
  appendText(header, "h3", caseRow.government_name + " / " + (caseRow.procurement_title || caseId));
  appendText(header, "p", procurement ? awardBasisLabel(procurement.award_basis) : "この案件の調達方式・選定方法について、表示できる収録データがありません。公式資料に記載がないことを意味しません。", "evaluation-score");
  appendText(header, "p", caseBoundaryText(evidence), "scope-note");
  const links = document.createElement("p");
  links.className = "case-dialog-actions";
  appendLink(links, caseLink(caseId), "案件詳細 →", false);
  if (procurement && procurement.source_url) appendLink(links, procurement.source_url, "調達構造の公式資料 ↗", true);
  header.appendChild(links);
  root.appendChild(header);

  const structure = document.createElement("div");
  structure.className = "evaluation-case-block";
  appendText(structure, "h3", "評価構造");
  renderStageGroups(structure, evaluations);
  renderStageRelations(structure, stageRelations, data);
  const evaluationSources = [];
  const seenEvaluationSources = new Set();
  evaluations.forEach(function (row) {
    const source = sourceForEvaluation(row, data);
    if (!source || !source.url || seenEvaluationSources.has(source.url)) return;
    seenEvaluationSources.add(source.url);
    evaluationSources.push(source);
  });
  if (evaluationSources.length) {
    const sourceLinks = document.createElement("p");
    sourceLinks.className = "case-dialog-actions evaluation-case-source-links";
    evaluationSources.forEach(function (source) {
      appendLink(sourceLinks, source.url, sourceLabel(source) + " ↗", true);
    });
    structure.appendChild(sourceLinks);
  }
  root.appendChild(structure);

  const gates = document.createElement("div");
  gates.className = "evaluation-case-block";
  appendText(gates, "h3", "参加資格");
  appendText(gates, "p", "評価点とは別の応募・入札条件です。未掲載の条件がないことを意味しません。", "scope-note");
  if (!caseGates.length) {
    appendText(gates, "p", "この案件について、収録データには表示できる参加資格の記録がありません。原資料に参加資格が存在しないという意味ではありません。", "scope-note");
  } else {
    caseGates.forEach(function (row) {
      const entry = document.createElement("div");
      entry.className = "evaluation-case-entry";
      appendText(entry, "p", row.condition_summary);
      gateMeaningParts(row).forEach(function (part) { appendText(entry, "p", part, "evaluation-score"); });
      appendGateEvidence(entry, row, data);
      gates.appendChild(entry);
    });
  }
  root.appendChild(gates);

  const rules = document.createElement("div");
  rules.className = "evaluation-case-block";
  appendText(rules, "h3", "選定・価格ルール");
  appendText(rules, "p", "選定下限、失格条件、価格上限、予定価格、価格点算式、同点時ルールを別々のルールとして表示します。未掲載のルールがないことを意味しません。", "scope-note");
  if (!selectionRules.length) {
    appendText(rules, "p", "この案件について、収録データには表示できる選定・価格ルールの記録がありません。原資料に閾値・失格条件・価格ルールが存在しないという意味ではありません。", "scope-note");
  } else {
    selectionRules.forEach(function (row) {
      const entry = document.createElement("div");
      entry.className = "evaluation-case-entry";
      appendText(entry, "p", ruleSummary(row));
      appendRuleEvidence(entry, row, data);
      rules.appendChild(entry);
    });
  }
  root.appendChild(rules);

  const price = document.createElement("div");
  price.className = "evaluation-case-block";
  appendText(price, "h3", "価格の扱い");
  const priceRows = evaluations.filter(isCasePriceCriterion);
  if (priceRows.length) {
    priceRows.forEach(function (row) {
      const p = document.createElement("p");
      p.textContent = row.criterion_summary + "： " + scoreContext(row);
      price.appendChild(p);
    });
  } else {
    appendText(price, "p", "価格に関連づけて表示できる構造化評価項目は未登録です。原資料に価格条件がないという意味ではありません。", "scope-note");
  }
  if (procurement && procurement.pricing_basis) {
    appendText(price, "p", "価格条件：" + procurement.pricing_basis, "evaluation-boundary");
  }
  appendText(price, "p", "価格条件と価格点は別表示です。契約金額はここから推定しません。", "scope-note");
  root.appendChild(price);

  renderVendorResults(root, vendorRows);
}

async function initEvaluationSupport() {
  renderTopicLinks();
  try {
    const loaded = await Promise.all([
      loadEvaluationCSV(EVALUATION_DATA_FILES.cases),
      loadEvaluationCSV(EVALUATION_DATA_FILES.effective),
      loadEvaluationCSV(EVALUATION_DATA_FILES.evaluations),
      loadEvaluationCSV(EVALUATION_DATA_FILES.procurement),
      loadEvaluationCSV(EVALUATION_DATA_FILES.vendors),
      loadEvaluationCSV(EVALUATION_DATA_FILES.gates),
      loadEvaluationCSV(EVALUATION_DATA_FILES.rules),
      loadEvaluationCSV(EVALUATION_DATA_FILES.sources),
      loadEvaluationCSV(EVALUATION_DATA_FILES.evidence)
    ]);
    const data = {
      cases: loaded[0],
      effective: loaded[1],
      evaluations: loaded[2],
      procurement: loaded[3],
      vendors: loaded[4],
      gates: loaded[5],
      rules: loaded[6],
      sources: loaded[7],
      evidence: loaded[8]
    };
    data.caseById = byKey(data.cases, "case_id");
    data.effectiveById = byKey(data.effective, "effective_requirement_id");
    data.evaluationById = byKey(data.evaluations, "criterion_id");
    data.gateById = byKey(data.gates, "gate_id");
    data.ruleById = byKey(data.rules, "rule_id");
    data.procurementByCase = byKey(data.procurement, "case_id");
    data.sourceById = byKey(data.sources, "source_id");
    data.sourceByUrl = new Map(data.sources.filter(function (row) { return row.url; }).map(function (row) { return [row.url, row]; }));
    data.evidenceByCase = byKey(data.evidence, "case_id");

    const requested = new URLSearchParams(window.location.search).get("topic");
    const topic = EVALUATION_TOPICS.find(function (item) { return item.id === requested; }) || EVALUATION_TOPICS[0];
    renderTopic(topic, data);

    const select = document.getElementById("evaluation-case-select");
    EVALUATION_CASE_IDS.forEach(function (caseId) {
      const row = data.caseById.get(caseId);
      if (!row) return;
      const option = document.createElement("option");
      option.value = caseId;
      option.textContent = row.government_name + " / " + (row.procurement_title || caseId);
      select.appendChild(option);
    });
    if (select.options.length) {
      const requestedCase = new URLSearchParams(window.location.search).get("case");
      if (requestedCase && EVALUATION_CASE_IDS.includes(requestedCase)
          && data.caseById.has(requestedCase)) select.value = requestedCase;
      const link = document.getElementById("evaluation-share-link");
      const memoButton = document.getElementById("evaluation-memo-download");
      function updateSelection() {
        renderCase(select.value, data);
        renderTopicLinks(topic.id, select.value);
        if (link) link.href = evaluationStateUrl(window.location.href, topic.id, select.value);
        const status = document.getElementById("evaluation-update-status");
        const selectedCase = data.caseById.get(select.value);
        if (status && selectedCase) status.textContent = selectedCase.government_name + "の評価基準を表示しています。";
      }
      updateSelection();
      select.addEventListener("change", function () {
        window.history.replaceState(null, "", evaluationStateUrl(window.location.href, topic.id, select.value));
        updateSelection();
      });
      if (memoButton) {
        memoButton.addEventListener("click", function () {
          const markdown = buildEvaluationMemo(select.value, topic, data, window.location.href);
          const blobUrl = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" }));
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = "evaluation-note-" + select.value + ".md";
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.setTimeout(function () { URL.revokeObjectURL(blobUrl); }, 1000);
        });
      }
    }
  } catch (error) {
    const root = document.getElementById("evaluation-topic-detail");
    if (root) {
      root.replaceChildren();
      appendText(root, "p", "データを読み込めませんでした。ページを再読み込みしてお試しください。", "error");
    }
    const status = document.getElementById("evaluation-update-status");
    if (status) status.textContent = "評価データを読み込めませんでした。";
    console.error(error);
  }
}

if (typeof module !== "undefined") {
  module.exports = {
    EVALUATION_DATA_FILES,
    EVALUATION_TOPICS,
    EVALUATION_CASE_IDS,
    evaluationStateUrl,
    buildEvaluationMemo,
    PRICE_CRITERION_IDS,
    isCasePriceCriterion,
    thresholdScopeLabel,
    gateMeaningParts,
    parseEvaluationCSV,
    roleForEffective,
    effectiveValue,
    evaluationOfficialUrl,
    markdownSourceLink,
    effectiveSourceId,
    ruleTypeLabel,
    ruleSummary,
    scoreContext,
    caseBoundaryText,
    awardBasisLabel,
    draftingDecisionForTopic
  };
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initEvaluationSupport);
}
