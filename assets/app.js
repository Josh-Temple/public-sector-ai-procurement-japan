"use strict";

const DATA_FILES = {
  cases: "./data/cases.csv",
  requirements: "./data/requirements.csv",
  structures: "./data/procurement_structure.csv",
  evidence: "./data/case_evidence_summary.csv",
  sources: "./data/source_documents.csv",
  evaluations: "./data/evaluation_criteria.csv",
  effective: "./data/effective_requirements.csv",
};

const state = {
  rows: [],
  filtered: [],
  selected: new Set(),
  sourceById: new Map(),
  evaluationsByCase: new Map(),
  effectiveByCase: new Map(),
  activeCase: null,
};

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
    .filter(r => r.some(v => v !== ""))
    .map(r => Object.fromEntries(header.map((key, idx) => [key, r[idx] ?? ""])));
}

async function loadCSV(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return parseCSV(await response.text());
}

function mapByCase(rows) {
  return new Map(rows.map(row => [row.case_id, row]));
}

function groupByCase(rows) {
  const map = new Map();
  rows.forEach(row => {
    if (!row.case_id) return;
    if (!map.has(row.case_id)) map.set(row.case_id, []);
    map.get(row.case_id).push(row);
  });
  return map;
}

function formatMoney(value) {
  if (!value) return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(n);
}

function yn(value) {
  const v = (value || "").toLowerCase();
  if (v === "true") return "あり";
  if (v === "false") return "なし";
  if (["desirable", "optional", "planned_acceptable", "allowed_alternative"].includes(v)) return "条件付き";
  return "—";
}

function evidenceLabel(row) {
  if (!row || row.public_reconstructability === "not_assessed") return "未監査";
  if (row.public_reconstructability === "publicly_bounded") return "公開範囲に境界";
  if (row.public_reconstructability === "publicly_reconstructable") return "公開資料で再構成可";
  return row.public_reconstructability || "—";
}

function evidenceClass(row) {
  if (!row || row.public_reconstructability === "not_assessed") return "";
  if (row.public_reconstructability === "publicly_bounded") return "boundary";
  return "reviewed";
}

function categoryLabel(value) {
  return (value || "")
    .replaceAll("_", " ")
    .replace("general genai", "汎用生成AI")
    .replace("shared municipal", "共同調達")
    .replace("genai", "生成AI");
}

function safeText(value) {
  return value == null || value === "" ? "—" : value;
}

function reviewStateLabel(value) {
  const labels = {
    reviewed: "確認済み",
    not_public: "非公開",
    source_unavailable: "資料取得不可",
    not_found_in_reviewed_sources: "確認範囲では未発見",
    not_applicable: "対象外",
    not_assessed: "未監査",
    conflicting_sources: "資料間に不整合",
    selected_candidate_confirmed: "受託候補者の選定確認済み",
    contracted_confirmed: "契約確認済み",
    operating_confirmed: "稼働確認済み",
    not_verified: "未確認",
  };
  return labels[value] || safeText(value);
}

function evidenceSummaryText(row) {
  const evidence = row.evidence;
  if (!evidence) return "Evidence監査情報はありません。";
  const parts = [`判定: ${evidenceLabel(evidence)}`];
  if (evidence.last_verified) parts.push(`最終確認: ${evidence.last_verified}`);
  if (evidence.blocking_roles) parts.push(`公開再構成の阻害要素: ${evidence.blocking_roles}`);
  return parts.join(" / ");
}

function appendEvidenceSource(container, sourceId) {
  if (!sourceId) {
    container.textContent = "対応するSource IDなし";
    return;
  }
  const source = state.sourceById.get(sourceId);
  if (!source) {
    container.textContent = sourceId;
    return;
  }
  if (source.url) {
    const link = document.createElement("a");
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = source.title || sourceId;
    container.append(link);
  } else {
    const title = document.createElement("span");
    title.textContent = source.title || sourceId;
    container.append(title);
  }
  const meta = document.createElement("small");
  meta.textContent = [sourceId, source.access_state].filter(Boolean).join(" / ");
  container.append(meta);
}

function openEvidenceDialog(row) {
  const dialog = document.getElementById("evidence-dialog");
  const evidence = row.evidence || {};
  document.getElementById("evidence-dialog-case").textContent =
    `${row.government_name}｜${row.procurement_title}`;
  document.getElementById("evidence-dialog-summary").textContent = evidenceSummaryText(row);

  const roles = [
    ["仕様書", "specification"],
    ["質問回答・訂正", "qa_amendment"],
    ["要求機能一覧", "requirement_matrix"],
    ["評価基準", "evaluation"],
    ["選定結果", "result"],
    ["契約最終状態", "contract_final"],
    ["選定ステージ", "selection"],
    ["契約ステージ", "contract"],
    ["運用ステージ", "operation"],
  ];
  const list = document.getElementById("evidence-dialog-list");
  list.replaceChildren();

  roles.forEach(([label, key]) => {
    const item = document.createElement("div");
    item.className = "evidence-item";

    const role = document.createElement("div");
    role.className = "evidence-role";
    role.textContent = label;
    const stateText = document.createElement("span");
    stateText.className = "evidence-state";
    stateText.textContent = reviewStateLabel(evidence[`${key}_state`] || "not_assessed");
    role.append(stateText);

    const source = document.createElement("div");
    source.className = "evidence-source";
    appendEvidenceSource(source, evidence[`${key}_source_id`]);

    item.append(role, source);
    list.append(item);
  });

  const notes = [];
  if (evidence.notes) notes.push(evidence.notes);
  notes.push("公開資料の確認状態を示します。未監査・未発見は、不存在を意味しません。");
  document.getElementById("evidence-dialog-note").textContent = notes.join("\n\n");
  dialog.showModal();
}

function truthy(value) {
  return (value || "").toLowerCase() === "true";
}

function renderInsights(requirements, evidence) {
  const total = requirements.length;
  const rag = requirements.filter(row => truthy(row.rag)).length;
  const learning = requirements.filter(row => truthy(row.data_learning_prohibited)).length;
  const lgwan = requirements.filter(row => truthy(row.lgwan_or_lgwan_asp)).length;
  const bounded = evidence.filter(row => row.public_reconstructability === "publicly_bounded").length;

  document.getElementById("insight-rag").textContent = rag;
  document.getElementById("insight-rag-denom").textContent = ` / ${total}`;
  document.getElementById("insight-learning").textContent = learning;
  document.getElementById("insight-learning-denom").textContent = ` / ${total}`;
  document.getElementById("insight-lgwan").textContent = lgwan;
  document.getElementById("insight-lgwan-denom").textContent = ` / ${total}`;
  document.getElementById("insight-bounded").textContent = bounded;
}

function applyThemeFilter(theme) {
  resetFilters(false);
  if (theme === "rag") document.getElementById("rag").value = "true";
  if (theme === "bounded") document.getElementById("evidence").value = "publicly_bounded";
  if (theme === "joint") document.getElementById("search").value = "共同";
  if (theme === "learning") document.getElementById("search").dataset.requirementFilter = "learning";
  if (theme === "lgwan") document.getElementById("search").dataset.requirementFilter = "lgwan";
  if (theme === "evaluated") document.getElementById("search").dataset.requirementFilter = "evaluated";
  applyFilters();
  document.getElementById("search-heading").scrollIntoView({ behavior: "smooth", block: "start" });
}

function detailValue(value) {
  return value == null || value === "" ? "—" : value;
}

function addFact(container, label, value) {
  const wrap = document.createElement("div");
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = label;
  dd.textContent = detailValue(value);
  wrap.append(dt, dd);
  container.append(wrap);
}

function addRequirement(container, label, value) {
  const wrap = document.createElement("dl");
  wrap.className = "requirement-item";
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = label;
  dd.textContent = detailValue(value);
  wrap.append(dt, dd);
  container.append(wrap);
}

function renderEffectiveRequirements(caseId) {
  const container = document.getElementById("case-dialog-effective");
  container.replaceChildren();
  const rows = state.effectiveByCase.get(caseId) || [];
  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "empty-detail";
    empty.textContent = "構造化された有効要件は未登録です。";
    container.append(empty);
    return;
  }
  rows.slice(0, 8).forEach(row => {
    const item = document.createElement("div");
    item.className = "detail-row";
    const key = document.createElement("strong");
    key.textContent = row.requirement_key || row.requirement_area || "要件";
    const value = document.createElement("p");
    value.textContent = row.effective_value || row.original_value || "—";
    const stateText = document.createElement("span");
    stateText.className = "points";
    stateText.textContent = reviewStateLabel(row.review_status || "not_assessed");
    item.append(key, value, stateText);
    container.append(item);
  });
  if (rows.length > 8) {
    const more = document.createElement("p");
    more.className = "empty-detail";
    more.textContent = `ほか ${rows.length - 8} 件。全データはRepositoryで確認できます。`;
    container.append(more);
  }
}

function renderEvaluation(caseId) {
  const container = document.getElementById("case-dialog-evaluation");
  container.replaceChildren();
  const rows = state.evaluationsByCase.get(caseId) || [];
  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "empty-detail";
    empty.textContent = "構造化された評価基準は未登録です。";
    container.append(empty);
    return;
  }
  rows.slice(0, 8).forEach(row => {
    const item = document.createElement("div");
    item.className = "detail-row";
    const group = document.createElement("strong");
    group.textContent = row.criterion_group || "評価項目";
    const summary = document.createElement("p");
    summary.textContent = row.criterion_summary || "—";
    const points = document.createElement("span");
    points.className = "points";
    points.textContent = row.points ? `${row.points}点` : "—";
    item.append(group, summary, points);
    container.append(item);
  });
  if (rows.length > 8) {
    const more = document.createElement("p");
    more.className = "empty-detail";
    more.textContent = `ほか ${rows.length - 8} 項目。全評価基準はRepositoryで確認できます。`;
    container.append(more);
  }
}

function openCaseDialog(row) {
  state.activeCase = row;
  const dialog = document.getElementById("case-dialog");
  document.getElementById("case-dialog-title").textContent = row.procurement_title;
  document.getElementById("case-dialog-government").textContent =
    `${row.government_name} / ${row.prefecture} / FY${row.fiscal_year}`;
  document.getElementById("case-dialog-purpose").textContent = row.purpose_summary || "目的概要は未登録です。";

  const facts = document.getElementById("case-dialog-facts");
  facts.replaceChildren();
  addFact(facts, "調達方式", row.procurement_method);
  addFact(facts, "選定事業者", row.selected_vendor);
  addFact(facts, "上限額", formatMoney(row.budget_ceiling_jpy));
  addFact(facts, "契約額", formatMoney(row.contract_amount_jpy));
  addFact(facts, "応募者数", row.applicant_count);
  addFact(facts, "契約期間", [row.contract_start, row.contract_end].filter(Boolean).join(" — "));
  addFact(facts, "Evidence", evidenceLabel(row.evidence));
  addFact(facts, "登録Source", row.sourceCount ? `${row.sourceCount}件` : "—");

  const req = document.getElementById("case-dialog-requirements");
  req.replaceChildren();
  const r = row.req;
  if (r) {
    addRequirement(req, "利用規模", r.user_scale);
    addRequirement(req, "同時利用", r.concurrent_scale);
    addRequirement(req, "LLM", r.llm_requirement);
    addRequirement(req, "複数モデル", yn(r.multi_model));
    addRequirement(req, "RAG", yn(r.rag));
    addRequirement(req, "LGWAN", yn(r.lgwan_or_lgwan_asp));
    addRequirement(req, "学習利用禁止", yn(r.data_learning_prohibited));
    addRequirement(req, "国内リージョン", r.domestic_region_or_dc);
    addRequirement(req, "研修・定着支援", r.training_or_adoption_support);
  } else {
    const empty = document.createElement("p");
    empty.className = "empty-detail";
    empty.textContent = "要件プロファイルは未登録です。";
    req.append(empty);
  }

  renderEffectiveRequirements(row.case_id);
  renderEvaluation(row.case_id);

  const source = document.getElementById("case-dialog-source");
  if (row.source_url) {
    source.href = row.source_url;
    source.hidden = false;
  } else {
    source.hidden = true;
    source.removeAttribute("href");
  }
  dialog.showModal();
}

function fillSelect(id, values) {
  const select = document.getElementById(id);
  [...new Set(values.filter(Boolean))].sort((a,b) => a.localeCompare(b, "ja")).forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function buildRows(cases, requirements, structures, evidence, sources) {
  const reqMap = mapByCase(requirements);
  const structureMap = mapByCase(structures);
  const evidenceMap = mapByCase(evidence);
  const sourceCount = new Map();
  sources.forEach(source => {
    if (!source.case_id) return;
    sourceCount.set(source.case_id, (sourceCount.get(source.case_id) || 0) + 1);
  });
  return cases.map(item => ({
    ...item,
    req: reqMap.get(item.case_id) || null,
    structure: structureMap.get(item.case_id) || null,
    evidence: evidenceMap.get(item.case_id) || null,
    sourceCount: sourceCount.get(item.case_id) || 0,
  }));
}

function matchesRag(row, filter) {
  if (!filter) return true;
  const v = row.req?.rag || "";
  if (filter === "true") return v.toLowerCase() === "true";
  if (filter === "false") return v.toLowerCase() === "false";
  if (filter === "soft") return ["desirable", "optional", "planned_acceptable", "allowed_alternative"].includes(v.toLowerCase());
  if (filter === "unknown") return !v || v.toLowerCase() === "unknown";
  return true;
}

function matchesEvidence(row, filter) {
  if (!filter) return true;
  const v = row.evidence?.public_reconstructability || "not_assessed";
  if (filter === "assessed") return v !== "not_assessed";
  return v === filter;
}

function applyFilters() {
  const q = document.getElementById("search").value.trim().toLowerCase();
  const prefecture = document.getElementById("prefecture").value;
  const method = document.getElementById("method").value;
  const rag = document.getElementById("rag").value;
  const evidence = document.getElementById("evidence").value;
  const requirementFilter = document.getElementById("search").dataset.requirementFilter || "";

  state.filtered = state.rows.filter(row => {
    const haystack = [
      row.government_name,
      row.procurement_title,
      row.selected_vendor,
      row.category,
      row.prefecture,
      row.purpose_summary,
    ].join(" ").toLowerCase();
    return (!q || haystack.includes(q))
      && (!prefecture || row.prefecture === prefecture)
      && (!method || row.procurement_method === method)
      && matchesRag(row, rag)
      && matchesEvidence(row, evidence)
      && (!requirementFilter
        || (requirementFilter === "learning" && truthy(row.req?.data_learning_prohibited))
        || (requirementFilter === "lgwan" && truthy(row.req?.lgwan_or_lgwan_asp))
        || (requirementFilter === "evaluated" && (state.evaluationsByCase.get(row.case_id) || []).length > 0));
  });

  state.filtered.sort((a, b) => {
    const year = Number(b.fiscal_year || 0) - Number(a.fiscal_year || 0);
    return year || a.government_name.localeCompare(b.government_name, "ja");
  });
  renderRows();
}

function renderRows() {
  const tbody = document.getElementById("case-rows");
  tbody.replaceChildren();
  const frag = document.createDocumentFragment();

  state.filtered.forEach(row => {
    const tr = document.createElement("tr");

    const selectTd = document.createElement("td");
    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "compare-check";
    check.setAttribute("aria-label", `${row.government_name} ${row.procurement_title} を比較`);
    check.checked = state.selected.has(row.case_id);
    check.addEventListener("change", () => toggleCompare(row.case_id, check));
    selectTd.append(check);

    const titleTd = document.createElement("td");
    const title = document.createElement("button");
    title.type = "button";
    title.className = "case-title-button";
    title.textContent = `${row.government_name}｜${row.procurement_title}`;
    title.addEventListener("click", () => openCaseDialog(row));
    const sub = document.createElement("span");
    sub.className = "case-sub";
    sub.textContent = `${row.prefecture} / ${categoryLabel(row.category)} / Sources ${row.sourceCount}`;
    titleTd.append(title, sub);

    const yearTd = document.createElement("td");
    yearTd.textContent = safeText(row.fiscal_year);

    const methodTd = document.createElement("td");
    methodTd.textContent = safeText(row.procurement_method);

    const ragTd = document.createElement("td");
    ragTd.textContent = yn(row.req?.rag);

    const lgwanTd = document.createElement("td");
    lgwanTd.textContent = yn(row.req?.lgwan_or_lgwan_asp);

    const vendorTd = document.createElement("td");
    vendorTd.textContent = safeText(row.selected_vendor);

    const evTd = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `badge ${evidenceClass(row.evidence)}`;
    badge.textContent = evidenceLabel(row.evidence);
    evTd.append(badge);

    const sourceTd = document.createElement("td");
    const sourceActions = document.createElement("div");
    sourceActions.className = "source-actions";
    if (row.source_url) {
      const a = document.createElement("a");
      a.className = "source-link";
      a.href = row.source_url;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = "代表資料 ↗";
      sourceActions.append(a);
    }
    const evidenceButton = document.createElement("button");
    evidenceButton.type = "button";
    evidenceButton.className = "evidence-button";
    evidenceButton.textContent = "Evidence chain";
    evidenceButton.addEventListener("click", () => openEvidenceDialog(row));
    sourceActions.append(evidenceButton);
    sourceTd.append(sourceActions);

    tr.append(selectTd, titleTd, yearTd, methodTd, ragTd, lgwanTd, vendorTd, evTd, sourceTd);
    frag.append(tr);
  });

  tbody.append(frag);
  document.getElementById("result-count").textContent = `${state.filtered.length}件を表示 / 全${state.rows.length}件`;
}

function toggleCompare(caseId, checkbox) {
  if (checkbox.checked && state.selected.size >= 3) {
    checkbox.checked = false;
    window.alert("比較できるのは3案件までです。");
    return;
  }
  if (checkbox.checked) state.selected.add(caseId);
  else state.selected.delete(caseId);
  renderCompare();
}

function compareValue(row, key) {
  switch (key) {
    case "government": return row.government_name;
    case "title": return row.procurement_title;
    case "year": return row.fiscal_year;
    case "method": return row.procurement_method;
    case "vendor": return safeText(row.selected_vendor);
    case "budget": return formatMoney(row.budget_ceiling_jpy);
    case "contract": return formatMoney(row.contract_amount_jpy);
    case "users": return safeText(row.req?.user_scale);
    case "rag": return yn(row.req?.rag);
    case "lgwan": return yn(row.req?.lgwan_or_lgwan_asp);
    case "learning": return yn(row.req?.data_learning_prohibited);
    case "structure": return safeText(row.structure?.contracting_model);
    case "evidence": return evidenceLabel(row.evidence);
    default: return "—";
  }
}

function renderCompare() {
  const section = document.getElementById("compare-section");
  const chosen = state.rows.filter(row => state.selected.has(row.case_id));
  section.hidden = chosen.length < 2;
  if (chosen.length < 2) return;

  const table = document.getElementById("compare-table");
  table.replaceChildren();
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  const blank = document.createElement("th");
  blank.scope = "col";
  blank.textContent = "比較項目";
  headRow.append(blank);
  chosen.forEach(row => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = row.government_name;
    headRow.append(th);
  });
  head.append(headRow);
  table.append(head);

  const fields = [
    ["title", "案件名"], ["year", "公募年度"], ["method", "調達方式"], ["structure", "契約構造"],
    ["users", "利用規模"], ["rag", "RAG"], ["lgwan", "LGWAN"], ["learning", "学習利用禁止"],
    ["vendor", "選定事業者"], ["budget", "上限額"], ["contract", "契約額"], ["evidence", "Evidence"],
  ];
  const body = document.createElement("tbody");
  fields.forEach(([key, label]) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = label;
    tr.append(th);
    chosen.forEach(row => {
      const td = document.createElement("td");
      td.textContent = compareValue(row, key);
      tr.append(td);
    });
    body.append(tr);
  });
  table.append(body);
}

function resetFilters(run = true) {
  ["search", "prefecture", "method", "rag", "evidence"].forEach(id => {
    document.getElementById(id).value = "";
  });
  delete document.getElementById("search").dataset.requirementFilter;
  if (run) applyFilters();
}

async function init() {
  const tbody = document.getElementById("case-rows");
  const loading = document.createElement("tr");
  loading.innerHTML = '<td colspan="9" class="loading">データを読み込んでいます…</td>';
  tbody.append(loading);

  try {
    const [cases, requirements, structures, evidence, sources, evaluations, effective] = await Promise.all(
      Object.values(DATA_FILES).map(loadCSV)
    );
    state.sourceById = new Map(sources.map(source => [source.source_id, source]));
    state.evaluationsByCase = groupByCase(evaluations);
    state.effectiveByCase = groupByCase(effective);
    state.rows = buildRows(cases, requirements, structures, evidence, sources);
    renderInsights(requirements, evidence);

    document.getElementById("metric-cases").textContent = cases.length;
    document.getElementById("metric-requirements").textContent = requirements.length;
    document.getElementById("metric-audited").textContent = evidence.filter(row =>
      ["publicly_bounded", "publicly_reconstructable"].includes(row.public_reconstructability)
      || row.specification_state !== "not_assessed"
    ).length;
    document.getElementById("metric-sources").textContent = sources.length;

    fillSelect("prefecture", cases.map(row => row.prefecture));
    fillSelect("method", cases.map(row => row.procurement_method));

    ["search", "prefecture", "method", "rag", "evidence"].forEach(id => {
      document.getElementById(id).addEventListener(id === "search" ? "input" : "change", applyFilters);
    });
    document.getElementById("reset").addEventListener("click", resetFilters);
    document.querySelectorAll("[data-theme-filter]").forEach(button => {
      button.addEventListener("click", () => applyThemeFilter(button.dataset.themeFilter));
    });
    document.getElementById("clear-compare").addEventListener("click", () => {
      state.selected.clear();
      renderCompare();
      renderRows();
    });
    document.getElementById("close-case").addEventListener("click", () => {
      document.getElementById("case-dialog").close();
    });
    document.getElementById("case-dialog").addEventListener("click", event => {
      if (event.target === event.currentTarget) event.currentTarget.close();
    });
    document.getElementById("case-dialog-evidence").addEventListener("click", () => {
      if (!state.activeCase) return;
      document.getElementById("case-dialog").close();
      openEvidenceDialog(state.activeCase);
    });
    document.getElementById("close-evidence").addEventListener("click", () => {
      document.getElementById("evidence-dialog").close();
    });
    document.getElementById("evidence-dialog").addEventListener("click", event => {
      if (event.target === event.currentTarget) event.currentTarget.close();
    });

    applyFilters();
  } catch (error) {
    console.error(error);
    tbody.innerHTML = '<tr><td colspan="9" class="error">データを読み込めませんでした。GitHub上のCSVと公開設定を確認してください。</td></tr>';
  }
}

document.addEventListener("DOMContentLoaded", init);
