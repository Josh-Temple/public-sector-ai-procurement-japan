"use strict";

const DATA_FILES = {
  cases: "./data/cases.csv",
  requirements: "./data/requirements.csv",
  structures: "./data/procurement_structure.csv",
  evidence: "./data/case_evidence_summary.csv",
  sources: "./data/source_documents.csv",
};

const state = {
  rows: [],
  filtered: [],
  selected: new Set(),
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
      && matchesEvidence(row, evidence);
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
    const title = document.createElement("span");
    title.className = "case-title";
    title.textContent = `${row.government_name}｜${row.procurement_title}`;
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
    if (row.source_url) {
      const a = document.createElement("a");
      a.className = "source-link";
      a.href = row.source_url;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = "公式資料 ↗";
      sourceTd.append(a);
    } else {
      sourceTd.textContent = "—";
    }

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

function resetFilters() {
  ["search", "prefecture", "method", "rag", "evidence"].forEach(id => {
    document.getElementById(id).value = "";
  });
  applyFilters();
}

async function init() {
  const tbody = document.getElementById("case-rows");
  const loading = document.createElement("tr");
  loading.innerHTML = '<td colspan="9" class="loading">データを読み込んでいます…</td>';
  tbody.append(loading);

  try {
    const [cases, requirements, structures, evidence, sources] = await Promise.all(
      Object.values(DATA_FILES).map(loadCSV)
    );
    state.rows = buildRows(cases, requirements, structures, evidence, sources);

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
    document.getElementById("clear-compare").addEventListener("click", () => {
      state.selected.clear();
      renderCompare();
      renderRows();
    });

    applyFilters();
  } catch (error) {
    console.error(error);
    tbody.innerHTML = '<tr><td colspan="9" class="error">データを読み込めませんでした。GitHub上のCSVと公開設定を確認してください。</td></tr>';
  }
}

document.addEventListener("DOMContentLoaded", init);
