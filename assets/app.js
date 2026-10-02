"use strict";

const DATA_FILES = {
  cases: "./data/cases.csv",
  requirements: "./data/requirements.csv",
  structures: "./data/procurement_structure.csv",
  evidence: "./data/case_evidence_summary.csv",
  sources: "./data/source_documents.csv",
  evaluations: "./data/evaluation_criteria.csv",
  effective: "./data/effective_requirements.csv",
  specialized: "./data/specialized_requirements.csv",
  vendorScores: "./data/vendor_scores.csv",
  bids: "./data/bid_results.csv",
  timelines: "./data/case_timeline.csv",
};

const state = {
  rows: [],
  filtered: [],
  selected: new Set(),
  sourceById: new Map(),
  evaluationsByCase: new Map(),
  effectiveByCase: new Map(),
  specializedByCase: new Map(),
  vendorScoresByCase: new Map(),
  bidsByCase: new Map(),
  timelineByCase: new Map(),
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
    not_reviewed: "未レビュー",
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

const RESEARCH_HIGHLIGHTS = [
  {
    caseId: "kyoto-2026-general-genai",
    claimId: "CLM-kyoto-2026-rag-out-of-scope",
    sourceId: "SRC-kyoto-2026-general-genai-spec",
    title: "京都市はRAGを「不要」としたのではなく、この調達の対象外とした",
    summary: "既存サービスでRAGニーズを充足しているため、当該汎用生成AI調達では要件外。調達スコープと組織全体の利用状況は分けて読む必要があります。"
  },
  {
    caseId: "kobe-2026-tax-voicebot",
    claimId: "CLM-kobe-2026-voicebot-no-generated-answer",
    sourceId: "SRC-kobe-2026-voicebot-spec",
    title: "AIを使うボイスボットでも、市民向け回答の生成AI利用を禁止する設計がある",
    summary: "神戸市税務ボイスボットは音声・文脈理解にAIを使う一方、回答は市提供FAQ由来の回答データに限定しています。"
  },
  {
    caseId: "oumi-2026-joint-genai",
    claimId: "CLM-oumi-2026-effective-amendments",
    sourceId: "SRC-oumi-2026-qa",
    title: "仕様書だけでは現行要件を読み違える案件がある",
    summary: "おうみ共同調達では公式Q&Aにより、LLM数、Deep Research、テンプレート数、AIエージェント、認証、接続条件など複数要件が変更されました。"
  },
  {
    caseId: "hokkaido-2026-genai-rag-service",
    claimId: "CLM-hokkaido-2026-qualification-not-proposal-score",
    sourceId: "SRC-hokkaido-2026-notice",
    title: "同じセキュリティ条件でも「加点項目」と「参加資格」は別物",
    summary: "北海道2026 RAG調達ではISO/IEC 27001は提案評価の加点ではなく、制限付一般競争入札の参加資格です。"
  },
  {
    caseId: "obu-2026-genai-service",
    claimId: "CLM-obu-2026-domestic-storage-not-api-endpoint",
    sourceId: "SRC-obu-2026-qa",
    title: "国内保存要件は、API接続先まで国内限定する意味とは限らない",
    summary: "大府市は市データの国内保存を要求しつつ、生成AI APIの接続先所在地そのものを国内に限定していません。"
  },
  {
    caseId: "saitama-2026-ai-digital-support",
    claimId: "CLM-saitama-2026-citizen-grounding-control",
    sourceId: "SRC-saitama-2026-ai-support-qa",
    title: "県民向け生成AIでも「根拠を見せる」「根拠がなければ不明と答える」を仕様化できる",
    summary: "埼玉県は県民向けにも参照元の提示を求め、根拠がない場合の回答制御を必須化。企画提案評価でもこの2項目に計90/410点を配点しています。"
  },
  {
    caseId: "gunma-2026-joint-genai",
    claimId: "CLM-joint-procurement-stage-not-casewide",
    sourceId: "SRC-gunma-2026-joint-genai-guide",
    title: "共同調達では「選定済み」から案件全体の「契約済み」を推定できない",
    summary: "群馬・おうみでは共通選定後に参加団体ごとの契約が分かれるため、選定・契約・稼働を案件単位で一律に昇格させません。"
  }
];

function renderResearchHighlights() {
  const container = document.getElementById("research-highlights");
  container.replaceChildren();
  RESEARCH_HIGHLIGHTS.forEach((item, index) => {
    const row = state.rows.find(candidate => candidate.case_id === item.caseId);
    const source = state.sourceById.get(item.sourceId);

    const article = document.createElement("article");
    article.className = "highlight-item";

    const n = document.createElement("span");
    n.className = "highlight-index";
    n.textContent = String(index + 1).padStart(2, "0");

    const copy = document.createElement("div");
    copy.className = "highlight-copy";
    const title = document.createElement("h3");
    title.textContent = item.title;
    const summary = document.createElement("p");
    summary.textContent = item.summary;
    copy.append(title, summary);

    const links = document.createElement("div");
    links.className = "highlight-links";
    if (row) {
      const caseLink = document.createElement("a");
      caseLink.href = `?case=${encodeURIComponent(row.case_id)}`;
      caseLink.textContent = `${row.government_name}の案件を見る →`;
      links.append(caseLink);
    }
    if (source?.url) {
      const official = document.createElement("a");
      official.href = source.url;
      official.target = "_blank";
      official.rel = "noreferrer";
      official.textContent = "公式一次資料 ↗";
      links.append(official);
    }
    const claim = document.createElement("a");
    claim.href = `https://github.com/Josh-Temple/public-sector-ai-procurement-japan/blob/main/claims/${item.claimId}.md`;
    claim.target = "_blank";
    claim.rel = "noreferrer";
    claim.textContent = "Claimと適用範囲 ↗";
    links.append(claim);

    article.append(n, copy, links);
    container.append(article);
  });
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

function publicLabel(value) {
  const labels = {
    required: "必須",
    optional: "任意",
    desirable: "望ましい",
    context: "参考",
    conditional: "条件付き",
    tax_excluded_bid: "税抜入札額",
    tax_included: "税込",
    tax_excluded: "税抜",
  };
  return labels[value] || detailValue(value);
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

function changeTypeLabel(value) {
  const labels = {
    relaxed: "緩和",
    clarified_scope: "範囲明確化",
    allowed_interpretation: "解釈明確化",
    allowed_alternative: "代替許容",
    threshold_defined: "数値具体化",
    clarified_strict: "厳格化",
    clarified_feasibility: "実現可能範囲",
    clarified_definition: "定義明確化",
    broadened_alternative: "選択肢拡大",
    threshold_relaxed: "閾値緩和",
    threshold_removed: "閾値削除",
    removed: "削除",
    context: "前提情報",
    evaluation_context: "評価上の補足",
  };
  return labels[value] || value || "確認済み";
}

function specializedValue(row) {
  let value = row.value;
  if (String(value).toLowerCase() === "true") value = "あり";
  if (String(value).toLowerCase() === "false") value = "なし";
  return [value, row.unit_or_format].filter(Boolean).join(" / ") || "—";
}

function specializedAreaLabel(value) {
  const labels = {
    service_scope: "対象範囲",
    service_scale: "利用規模",
    citizen_access: "県民利用",
    staff_access: "職員利用",
    answer_policy: "回答方針",
    speech_nlu: "音声・言語理解",
    interaction: "対話",
    routing: "振り分け",
    logging: "ログ",
    security: "セキュリティ",
    operations: "運用",
    document_review: "文書レビュー",
    document_authoring: "文書作成",
    workflow: "ワークフロー",
    network: "ネットワーク",
    rag: "RAG",
    ui: "UI",
    llm: "LLM",
    nonfunctional: "非機能",
    agent: "AIエージェント",
    knowledge: "ナレッジ",
    grounding: "回答根拠",
    web: "Web参照",
    integration: "外部連携",
    admin: "管理",
    availability: "可用性",
    future_scale: "将来拡張",
  };
  return labels[value] || value || "要件";
}

function appendInlineSource(element, sourceId, fallbackUrl, label = "根拠") {
  const source = sourceId ? state.sourceById.get(sourceId) : null;
  const url = source?.url || fallbackUrl;
  if (!url) return;
  element.append(document.createTextNode(" "));
  const link = document.createElement("a");
  link.className = "inline-source";
  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = `${label} ↗`;
  element.append(link);
}

function renderExpandableRows(container, rows, renderRow, noun = "件", initialLimit = 8) {
  container.replaceChildren();
  if (!rows.length) return false;

  let expanded = false;
  const draw = () => {
    container.replaceChildren();
    const visible = expanded ? rows : rows.slice(0, initialLimit);
    visible.forEach(row => container.append(renderRow(row)));

    if (rows.length > initialLimit) {
      const controls = document.createElement("div");
      controls.className = "detail-list-controls";

      const count = document.createElement("span");
      count.className = "detail-count";
      count.textContent = `${rows.length}${noun}中 ${visible.length}${noun}を表示`;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "detail-toggle";
      button.textContent = expanded
        ? `先頭${initialLimit}${noun}に戻す`
        : `残り${rows.length - initialLimit}${noun}を表示`;
      button.addEventListener("click", () => {
        expanded = !expanded;
        draw();
      });

      controls.append(count, button);
      container.append(controls);
    }
  };
  draw();
  return true;
}

function renderEffectiveRequirements(caseId) {
  const container = document.getElementById("case-dialog-effective");
  const rows = state.effectiveByCase.get(caseId) || [];
  if (!rows.length) {
    container.replaceChildren();
    const empty = document.createElement("p");
    empty.className = "empty-detail";
    empty.textContent = "構造化された有効要件は未登録です。";
    container.append(empty);
    return;
  }

  renderExpandableRows(container, rows, row => {
    const item = document.createElement("div");
    item.className = "detail-row";
    const key = document.createElement("strong");
    key.textContent = row.requirement_key || row.requirement_area || "要件";

    const value = document.createElement("p");
    value.textContent = row.effective_value || row.original_value || "—";
    appendInlineSource(
      value,
      row.changed_by_source_id || row.base_source_id,
      "",
      row.changed_by_source_id ? "変更根拠" : "根拠"
    );

    const stateText = document.createElement("span");
    stateText.className = "points";
    stateText.textContent = changeTypeLabel(row.change_type);

    item.append(key, value, stateText);
    return item;
  });
}

function renderSpecialized(caseId) {
  const container = document.getElementById("case-dialog-specialized");
  const rows = state.specializedByCase.get(caseId) || [];
  if (!rows.length) {
    container.replaceChildren();
    const empty = document.createElement("p");
    empty.className = "empty-detail";
    empty.textContent = "業務特化型AIの構造化要件は未登録です。";
    container.append(empty);
    return;
  }

  renderExpandableRows(container, rows, row => {
    const item = document.createElement("div");
    item.className = "detail-row";

    const area = document.createElement("strong");
    area.textContent = specializedAreaLabel(row.requirement_area);

    const value = document.createElement("p");
    const key = row.requirement_key ? `${row.requirement_key}：` : "";
    value.textContent = `${key}${specializedValue(row)}`;
    appendInlineSource(value, "", row.source_url, "仕様");

    const requiredness = document.createElement("span");
    requiredness.className = "points";
    requiredness.textContent = publicLabel(row.requiredness);

    item.append(area, value, requiredness);
    return item;
  });
}

function renderPublicResults(caseId) {
  const container = document.getElementById("case-dialog-results");
  const scores = state.vendorScoresByCase.get(caseId) || [];
  const bids = state.bidsByCase.get(caseId) || [];
  const rows = [
    ...scores.map(row => ({ ...row, _resultKind: "score" })),
    ...bids.map(row => ({ ...row, _resultKind: "bid" })),
  ];

  if (!rows.length) {
    container.replaceChildren();
    const empty = document.createElement("p");
    empty.className = "empty-detail";
    empty.textContent = "構造化された公開得点・入札結果は未登録です。";
    container.append(empty);
    return;
  }

  renderExpandableRows(container, rows, row => {
    const item = document.createElement("div");
    item.className = "detail-row";

    const vendor = document.createElement("strong");
    const summary = document.createElement("p");
    const metric = document.createElement("span");
    metric.className = "points";

    if (row._resultKind === "score") {
      vendor.textContent = row.vendor_name || row.vendor_label || "事業者";
      summary.textContent = row.selected === "true" ? "選定" : (row.rank ? `${row.rank}位` : "公開得点");
      appendInlineSource(summary, "", row.source_url, "結果");
      if (row.total_score) {
        metric.textContent = `${row.total_score}${row.total_score_max ? " / " + row.total_score_max : ""}点`;
      } else if (row.stage1_score || row.stage2_score) {
        metric.textContent = [
          row.stage1_score && `1次 ${row.stage1_score}`,
          row.stage2_score && `2次 ${row.stage2_score}`,
        ].filter(Boolean).join(" / ");
      } else {
        metric.textContent = "—";
      }
    } else {
      vendor.textContent = row.bidder_name || row.bidder_label || "入札者";
      summary.textContent = [row.selected === "true" ? "落札" : "", publicLabel(row.tax_basis)].filter(Boolean).join(" / ") || "入札結果";
      appendInlineSource(summary, "", row.source_url, "結果");
      metric.textContent = formatMoney(row.bid_amount_jpy);
    }

    item.append(vendor, summary, metric);
    return item;
  }, "件");
}

function renderTimeline(caseId) {
  const container = document.getElementById("case-dialog-timeline");
  container.replaceChildren();
  const rows = state.timelineByCase.get(caseId) || [];
  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "empty-detail";
    empty.textContent = "構造化された時系列は未登録です。";
    container.append(empty);
    return;
  }
  rows.forEach(row => {
    const facts = [
      ["公告", row.announcement_date],
      ["サービス開始", row.service_start],
      ["サービス終了", row.service_end],
    ].filter(([, value]) => value);
    facts.forEach(([label, value]) => {
      const item = document.createElement("div");
      item.className = "detail-row";
      const key = document.createElement("strong");
      key.textContent = label;
      const description = document.createElement("p");
      description.textContent = row.notes || "";
      appendInlineSource(description, row.source_id, "", "根拠");
      const date = document.createElement("span");
      date.className = "points";
      date.textContent = value;
      item.append(key, description, date);
      container.append(item);
    });
  });
}

function renderEvaluation(caseId) {
  const container = document.getElementById("case-dialog-evaluation");
  const rows = state.evaluationsByCase.get(caseId) || [];
  if (!rows.length) {
    container.replaceChildren();
    const empty = document.createElement("p");
    empty.className = "empty-detail";
    empty.textContent = "構造化された評価基準は未登録です。";
    container.append(empty);
    return;
  }

  renderExpandableRows(container, rows, row => {
    const item = document.createElement("div");
    item.className = "detail-row";

    const group = document.createElement("strong");
    group.textContent = row.criterion_group || "評価項目";

    const summary = document.createElement("p");
    summary.textContent = row.criterion_summary || "—";
    appendInlineSource(summary, "", row.source_url, "評価表");

    const points = document.createElement("span");
    points.className = "points";
    points.textContent = row.points ? `${row.points}点` : "—";

    item.append(group, summary, points);
    return item;
  }, "項目");
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
  renderSpecialized(row.case_id);
  renderPublicResults(row.case_id);
  renderTimeline(row.case_id);

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
    const title = document.createElement("a");
    title.href = `?case=${encodeURIComponent(row.case_id)}`;
    title.className = "case-title-button";
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
    const [cases, requirements, structures, evidence, sources, evaluations, effective, specialized, vendorScores, bids, timelines] = await Promise.all(
      Object.values(DATA_FILES).map(loadCSV)
    );
    state.sourceById = new Map(sources.map(source => [source.source_id, source]));
    state.evaluationsByCase = groupByCase(evaluations);
    state.effectiveByCase = groupByCase(effective);
    state.specializedByCase = groupByCase(specialized);
    state.vendorScoresByCase = groupByCase(vendorScores);
    state.bidsByCase = groupByCase(bids);
    state.timelineByCase = groupByCase(timelines);
    state.rows = buildRows(cases, requirements, structures, evidence, sources);
    renderInsights(requirements, evidence);
    renderResearchHighlights();

    document.getElementById("metric-cases").textContent = cases.length;
    document.getElementById("metric-requirements").textContent = requirements.length;
    document.getElementById("metric-audited").textContent = evidence.filter(row =>
      ["publicly_bounded", "publicly_reconstructable"].includes(row.public_reconstructability)
      || row.specification_state !== "not_assessed"
    ).length;
    document.getElementById("metric-sources").textContent = sources.length;

    fillSelect("prefecture", cases.map(row => row.prefecture));
    fillSelect("method", cases.map(row => row.procurement_method));

    document.getElementById("search").addEventListener("input", () => {
      delete document.getElementById("search").dataset.requirementFilter;
      applyFilters();
    });
    ["prefecture", "method", "rag", "evidence"].forEach(id => {
      document.getElementById(id).addEventListener("change", applyFilters);
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

    const requestedCaseId = new URLSearchParams(window.location.search).get("case");
    if (requestedCaseId) {
      const requestedCase = state.rows.find(row => row.case_id === requestedCaseId);
      if (requestedCase) openCaseDialog(requestedCase);
    }
  } catch (error) {
    console.error(error);
    tbody.innerHTML = '<tr><td colspan="9" class="error">データを読み込めませんでした。GitHub上のCSVと公開設定を確認してください。</td></tr>';
  }
}

document.addEventListener("DOMContentLoaded", init);
