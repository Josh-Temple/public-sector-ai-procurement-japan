"use strict";

const EVALUATION_DATA_FILES = {
  cases: "./data/cases.csv",
  effective: "./data/effective_requirements.csv",
  evaluations: "./data/evaluation_criteria.csv",
  procurement: "./data/procurement_structure.csv",
  vendors: "./data/vendor_scores.csv",
  sources: "./data/source_documents.csv",
  evidence: "./data/case_evidence_summary.csv"
};

const EVALUATION_TOPICS = [
  {
    id: "rag-grounding",
    label: "RAG・根拠表示・fallback",
    question: "RAGの有無ではなく、検索品質、根拠表示、根拠がない場合の応答をどこまで最低条件にし、どこを比較するか。",
    caution: "RAG、検索精度、根拠表示、容量、fallbackは別の比較軸です。市民向けの安全設計を職員向けSaaS全般へ一般化しません。",
    effectiveIds: ["EFF-saitama-citizen_grounding", "EFF-matsue-source-display"],
    criterionIds: ["SAI-P06", "SAI-P07", "SEN-06", "MATSUE-DOC-03"]
  },
  {
    id: "security-certification",
    label: "セキュリティ・認証",
    question: "認証を参加資格、最低条件、提案評価のどこに置くか。認証名だけで役割を決めない。",
    caution: "同じ認証でも、応募可否を決めるgateと、提案を比較する評価項目では効果が異なります。",
    effectiveIds: ["EFF-oumi-certification", "EFF-oumi-ismap", "EFF-saitama-ismap_status"],
    criterionIds: ["SAI-P01", "KOG-03", "OUM-03"],
    qualificationRefs: [{
      caseId: "hokkaido-2026-genai-rag-service",
      claimPath: "claims/CLM-hokkaido-2026-qualification-not-proposal-score.md",
      sourceId: "SRC-hokkaido-2026-notice"
    }]
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
    question: "利用上限や追加課金の契約条件と、価格点・費用対効果の評価を分ける。",
    caution: "proposal ceiling、price score、入札額、契約金額は別の数値です。案件固有の価格点を推奨比率へ変換しません。",
    effectiveIds: ["EFF-minoh-overage-no-additional-fee", "EFF-yaizu-price-fixed", "EFF-yaizu-token-topup"],
    criterionIds: ["SAI-P12", "SAI-P13", "OUM-14", "GOS-05", "KVB-05", "KOBE-DIFY-09", "MINOH-GENAI-PRICE"]
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
    criterionIds: ["KOB-03", "SAI-P15", "SAI-P17", "SEN-11", "OUM-04", "KVB-02"]
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
  "matsue-2026-genai-support",
  "hokkaido-2026-genai-rag-service"
];

const PRICE_CRITERION_IDS = new Set(
  EVALUATION_TOPICS.find(function (topic) { return topic.id === "usage-pricing"; }).criterionIds
);

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
  if (field.length || row.length) { row.push(field.replace(/\r$/, "")); out.push(row); }
  const header = out.shift() || [];
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
  if (status === "desirable") return "望ましい条件";
  if (status === "optional") return "任意条件";
  if (status === "not_applicable") return "対象外";
  if (status.startsWith("required")) return "最低条件";
  return "要件";
}

function effectiveValue(row) {
  return row.effective_value || row.original_value || "—";
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
    return "Repositoryでは契約最終要件まで公開資料から再構成可能と評価しています。";
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
  const a = document.createElement("a");
  a.href = href;
  a.textContent = label;
  if (external) { a.target = "_blank"; a.rel = "noreferrer"; }
  parent.appendChild(a);
  return a;
}

function renderLinks(card, caseId, source, claimPath) {
  const links = document.createElement("div");
  links.className = "evaluation-evidence-links";
  appendLink(links, caseLink(caseId), "案件詳細", false);
  if (source && source.url) appendLink(links, source.url, sourceLabel(source) + " ↗", true);
  if (claimPath) appendLink(links, claimLink(claimPath), "reviewed Claim ↗", true);
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
  renderLinks(card, row.case_id, data.sourceById.get(effectiveSourceId(row)));
  return card;
}

function qualificationCard(ref, data) {
  const card = document.createElement("article");
  card.className = "evaluation-evidence";
  appendText(card, "p", "参加資格", "evaluation-role");
  appendText(card, "h3", "応募前に満たすgateとして確認した例");
  appendText(card, "p", data.caseById.get(ref.caseId)?.government_name || ref.caseId, "evaluation-case");
  appendText(card, "p", "評価点とは分けて読みます。具体的条件はreviewed Claimと公式資料で確認してください。", "evaluation-score");
  appendText(card, "p", caseBoundaryText(data.evidenceByCase.get(ref.caseId)), "evaluation-boundary");
  renderLinks(card, ref.caseId, data.sourceById.get(ref.sourceId), ref.claimPath);
  return card;
}

function renderTopicLinks(activeId) {
  const root = document.getElementById("evaluation-topic-links");
  if (!root) return;
  root.replaceChildren();
  EVALUATION_TOPICS.forEach(function (topic, index) {
    const a = document.createElement("a");
    a.className = "theme-link" + (topic.id === activeId ? " is-active" : "");
    a.href = "./evaluation.html?topic=" + encodeURIComponent(topic.id);
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
  (topic.qualificationRefs || []).forEach(function (ref) {
    list.appendChild(qualificationCard(ref, data));
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
  return labels[value] || value || "未登録";
}

function renderStageGroups(root, rows) {
  if (!rows.length) {
    appendText(root, "p", "この案件にはproposal scoreの構造化行がありません。価格競争や参加資格が中心の案件では、評価点が存在しない場合があります。", "scope-note");
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
    appendText(section, "p", "現在のvendor_scores.csvには公開得点行がありません。選定済みという事実から項目別得点を推測しません。", "scope-note");
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

  const header = document.createElement("div");
  header.className = "evaluation-case-header";
  appendText(header, "h3", caseRow.government_name + " / " + (caseRow.procurement_title || caseId));
  appendText(header, "p", procurement ? awardBasisLabel(procurement.award_basis) : "調達構造は現在のprocurement_structure.csvでは未登録です。", "evaluation-score");
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
  root.appendChild(structure);

  const price = document.createElement("div");
  price.className = "evaluation-case-block";
  appendText(price, "h3", "価格の扱い");
  const priceRows = evaluations.filter(function (row) { return PRICE_CRITERION_IDS.has(row.criterion_id); });
  if (priceRows.length) {
    priceRows.forEach(function (row) {
      const p = document.createElement("p");
      p.textContent = row.criterion_summary + "： " + scoreContext(row);
      price.appendChild(p);
    });
  } else {
    appendText(price, "p", "評価項目としての価格点は、この案件の構造化評価行にはありません。", "scope-note");
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
      loadEvaluationCSV(EVALUATION_DATA_FILES.sources),
      loadEvaluationCSV(EVALUATION_DATA_FILES.evidence)
    ]);
    const data = {
      cases: loaded[0],
      effective: loaded[1],
      evaluations: loaded[2],
      procurement: loaded[3],
      vendors: loaded[4],
      sources: loaded[5],
      evidence: loaded[6]
    };
    data.caseById = byKey(data.cases, "case_id");
    data.effectiveById = byKey(data.effective, "effective_requirement_id");
    data.evaluationById = byKey(data.evaluations, "criterion_id");
    data.procurementByCase = byKey(data.procurement, "case_id");
    data.sourceById = byKey(data.sources, "source_id");
    data.sourceByUrl = new Map(data.sources.filter(function (row) { return row.url; }).map(function (row) { return [row.url, row]; }));
    data.evidenceByCase = byKey(data.evidence, "case_id");

    const requested = new URLSearchParams(window.location.search).get("topic");
    const topic = EVALUATION_TOPICS.find(function (item) { return item.id === requested; }) || EVALUATION_TOPICS[0];
    renderTopicLinks(topic.id);
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
      renderCase(select.value, data);
      select.addEventListener("change", function () { renderCase(select.value, data); });
    }
  } catch (error) {
    const root = document.getElementById("evaluation-topic-detail");
    if (root) {
      root.replaceChildren();
      appendText(root, "p", "構造化データの読み込みに失敗しました。RepositoryのCSVを確認してください。", "error");
    }
    console.error(error);
  }
}

if (typeof module !== "undefined") {
  module.exports = {
    EVALUATION_DATA_FILES,
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
  };
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initEvaluationSupport);
}
