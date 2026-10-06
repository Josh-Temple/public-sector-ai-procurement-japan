"use strict";

const DRAFTING_DATA_FILES = {
  cases: "./data/cases.csv",
  effective: "./data/effective_requirements.csv",
  evaluations: "./data/evaluation_criteria.csv",
  specialized: "./data/specialized_requirements.csv",
  sources: "./data/source_documents.csv",
  evidence: "./data/case_evidence_summary.csv"
};

const DRAFTING_DECISIONS = [
  {
    id: "generation-boundary",
    label: "回答・文章を生成させる範囲",
    question: "AIが生成してよい対象と、人が判断する工程をどこで分けるか。",
    variables: ["利用者（職員 / 市民 / 双方）", "生成対象（回答 / 文書案 / 修正案 / 最終回答）", "人手確認の要否と承認主体", "回答不能時の動作"],
    placement: "安全上受け入れられない生成範囲は最低条件候補。実装方法や使いやすさに提案差を残すなら評価候補。",
    boundary: "市民向けの生成禁止や人手採否を、別用途へそのまま移植しない。",
    specialized: [
      ["kobe-2026-tax-voicebot", "answer_policy", "generative_answer_allowed"],
      ["kobe-2026-spec-authoring-ai", "document_review", "user_accept_reject_correction"]
    ]
  },
  {
    id: "rag-scope",
    label: "RAGを含める範囲",
    question: "RAGを必須、提案事項、今回の調達対象外のどこに置くか。",
    variables: ["RAGで解く業務", "既存検索・RAG基盤との役割分担", "更新主体と更新頻度", "組織・業務ごとの分離単位"],
    placement: "業務成立に不可欠なら最低条件候補。複数の実現方法を比較したいなら評価候補。既存基盤で満たすなら対象外を明示。",
    boundary: "RAGが今回の調達対象外でも、その自治体全体がRAGを使っていないとは限らない。",
    effective: ["EFF-fukushima-2026-rag-data-volume", "EFF-koshigaya-rag", "EFF-kyoto-rag-scope"]
  },
  {
    id: "rag-files",
    label: "RAG容量・ファイル条件",
    question: "容量、文書数、ファイルサイズ、形式をどのscopeで保証させるか。",
    variables: ["tenant / group / file の単位", "対象文書数と更新量", "1ファイル上限", "対応形式", "権限分離"],
    placement: "必要最小容量は最低条件候補。余裕度・検索性能・運用性を比較したい場合は評価候補。",
    boundary: "他団体のGB・文書数・MBを推奨値としてコピーしない。単位とscopeを必ず保持する。",
    effective: ["EFF-fukushima-2026-rag-data-volume", "EFF-matsue-rag-documents-per-group", "EFF-minoh-rag-file-size"],
    evaluations: ["MATSUE-DOC-03"]
  },
  {
    id: "grounding-fallback",
    label: "根拠表示・fallback・Web参照",
    question: "回答根拠を何で示し、根拠がないときにどう振る舞わせるか。",
    variables: ["根拠表示対象（RAG / Web）", "表示粒度（文書 / URL / 該当箇所）", "根拠なし時の動作", "一般知識を許す条件", "Web検索範囲と管理者制御"],
    placement: "根拠・fallbackが安全上不可欠なら最低条件候補。表示方法や運用品質の差は評価候補になり得る。",
    boundary: "RAG導入だけで正確性やハルシネーション防止を保証したと扱わない。",
    effective: ["EFF-sendai-source-link", "EFF-saitama-citizen_grounding", "EFF-yaizu-rag-grounding"]
  },
  {
    id: "model-policy",
    label: "モデル選択・更新",
    question: "モデルを名称で固定するか、性能条件・複数モデル・更新条件で定義するか。",
    variables: ["単一 / 複数モデル", "名称固定 / 同等性能 / 提案者選択", "更新時期", "利用者・管理者の選択可否", "モデル別料金・利用上限"],
    placement: "不可欠な性能は最低条件候補。モデルの幅・更新・用途別選択などの差は評価候補。",
    boundary: "当該年度のモデル名を現在の推奨モデルとして再利用しない。",
    effective: ["EFF-oumi-llm-selection", "EFF-obu-model-freshness", "EFF-koshigaya-model-choice"],
    evaluations: ["SAI-P10"]
  },
  {
    id: "data-handling",
    label: "保存・学習利用・データ所在",
    question: "入出力、RAG、履歴、ログごとに、保存・学習利用・所在をどう定義するか。",
    variables: ["対象データ種別", "推論中の一時保持と永続保存", "学習・品質改善への利用", "サービス層と基盤LLM層", "保存・バックアップ場所", "契約終了時の削除"],
    placement: "越えてはならない情報管理境界は最低条件・契約条件候補。追加統制や監査成熟度は評価候補になり得る。",
    boundary: "国内保存、API接続先、推論リージョン、ログ保存先を同じ条件として扱わない。",
    effective: ["EFF-obu-data-location", "EFF-koshigaya-data-handling"]
  },
  {
    id: "network",
    label: "LGWAN・ネットワーク",
    question: "利用端末、接続経路、LGWAN-ASP登録など、どのレイヤーを必須にするか。",
    variables: ["利用端末環境", "Internet / LGWAN", "LGWAN-ASP登録の要否", "SSO・認証との関係", "代替接続方式の許容"],
    placement: "利用不能になる環境条件は最低条件候補。複数の準拠方式があるなら運用負荷や利便性を評価候補にできる。",
    boundary: "「LGWAN対応」という一語で端末環境・サービス登録・接続方式をまとめない。",
    effective: ["EFF-oumi-network", "EFF-matsue-lgwan-browser", "EFF-matsue-lgwan-asp"]
  },
  {
    id: "authentication",
    label: "認証・アカウント設計",
    question: "本人認証と、発行するアカウント数・共有単位を別々にどう決めるか。",
    variables: ["本人識別の要否", "SSO等の方式", "個人 / 部署アカウント", "異動・退職時の管理", "管理者アカウント", "必要アカウント数"],
    placement: "本人性・アクセス制御の不可欠条件は最低条件候補。管理負荷や運用性は評価候補になり得る。",
    boundary: "利用者数・アカウント数を認証方式と同一視しない。",
    effective: ["EFF-sendai-account-model", "EFF-sendai-2026-user-auth", "EFF-minoh-minimum-accounts", "EFF-minoh-employee-auth"]
  },
  {
    id: "usage-pricing",
    label: "利用量・料金・超過",
    question: "利用量の想定と、上限到達・追加利用・請求の挙動をどう分けるか。",
    variables: ["利用者数と同時利用", "月間利用量の単位", "固定 / 従量部分", "上限到達時の通知・制限", "追加利用の単価・承認", "価格評価の方法"],
    placement: "予算・運用上許容できない課金挙動は契約・最低条件候補。追加単価や費用対効果の差は評価候補。",
    boundary: "案件固有のトークン数・価格を相場や推奨値として扱わない。",
    effective: ["EFF-obu-token-volume", "EFF-minoh-overage-no-additional-fee", "EFF-yaizu-price-fixed", "EFF-yaizu-token-topup"],
    evaluations: ["SAI-P12", "SAI-P13", "OUM-14", "GOS-05"]
  },
  {
    id: "support-adoption",
    label: "サポート・研修・定着",
    question: "最低限提供させる支援と、提案差を評価したい定着支援をどう分けるか。",
    variables: ["対象者", "実施時期", "提供必須の支援", "教材・問い合わせ対応", "利用定着の確認方法", "改善サイクル"],
    placement: "必ず提供されるべき支援は最低条件候補。内容・講師・継続支援・定着方法の差は評価候補。",
    boundary: "回数や動画本数だけで支援品質を代表させない。",
    effective: ["EFF-oumi-learning-videos", "EFF-fukushima-2025-training", "EFF-yamagata-2026-training-scope"],
    evaluations: ["OUM-11", "SEN25-10", "SEN25-11", "SEN25-12", "SAI-P16"]
  }
];

const CITIZEN_SPECIALIZED = [
  ["kobe-2026-tax-voicebot", "answer_policy", "generative_answer_allowed"],
  ["kobe-2026-tax-voicebot", "routing", "department_transfer"],
  ["saitama-2026-ai-digital-support", "grounding", "citizen_source_evidence_display"],
  ["saitama-2026-ai-digital-support", "grounding", "unknown_when_no_evidence"],
  ["saitama-2026-ai-digital-support", "availability", "service_hours"]
];

const ROLE_EXAMPLES = {
  effective: ["EFF-oumi-ismap", "EFF-koshigaya-rag"],
  evaluations: ["SAI-P01", "MATSUE-DOC-03"],
  qualificationClaim: "claims/CLM-hokkaido-2026-qualification-not-proposal-score.md"
};

function parseDraftingCSV(text) {
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
    .filter(function (values) { return values.some(function (value) { return value !== ""; }); })
    .map(function (values) {
      return Object.fromEntries(header.map(function (key, index) { return [key, values[index] || ""]; }));
    });
}

async function loadDraftingCSV(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(url + ": HTTP " + response.status);
  return parseDraftingCSV(await response.text());
}

function byKey(rows, key) {
  return new Map(rows.map(function (row) { return [row[key], row]; }));
}

function caseLink(caseId) {
  return "./index.html?case=" + encodeURIComponent(caseId);
}

function effectiveSourceId(row) {
  return row.changed_by_source_id || row.base_source_id || "";
}

function sourceLabel(source) {
  if (!source) return "公式資料";
  const labels = {
    official_qa_amendment: "Q&A・訂正",
    official_specification: "仕様書",
    official_requirement_matrix: "要件表",
    official_evaluation: "評価資料",
    official_result: "選定結果",
    official_procurement_page: "公募ページ"
  };
  return labels[source.document_type] || "公式資料";
}

function caseBoundaryText(evidence) {
  if (!evidence) return "案件単位の契約最終状態は未評価です。";
  if (evidence.public_reconstructability === "publicly_bounded") {
    return "公開資料で確認できる範囲の例です。契約後の最終仕様までは公開資料だけで確認できません。";
  }
  if (evidence.public_reconstructability === "publicly_reconstructable") {
    return "Repositoryでは契約最終要件まで公開資料から再構成可能と評価しています。";
  }
  return "公開資料の確認範囲を案件詳細で確認してください。";
}

function valueForEffective(row) {
  return row.effective_value || row.original_value || "—";
}

function appendText(parent, tag, text, className) {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  parent.appendChild(node);
  return node;
}

function appendEvidenceLinks(parent, row, data, sourceId) {
  const links = document.createElement("div");
  links.className = "drafting-evidence-links";

  const caseAnchor = document.createElement("a");
  caseAnchor.href = caseLink(row.case_id);
  caseAnchor.textContent = "案件詳細";
  links.appendChild(caseAnchor);

  const source = data.sourceById.get(sourceId);
  if (source && source.url) {
    const sourceAnchor = document.createElement("a");
    sourceAnchor.href = source.url;
    sourceAnchor.target = "_blank";
    sourceAnchor.rel = "noreferrer";
    sourceAnchor.textContent = sourceLabel(source) + " ↗";
    links.appendChild(sourceAnchor);
  }
  parent.appendChild(links);
}

function evidenceCardForEffective(row, data) {
  const card = document.createElement("article");
  card.className = "drafting-evidence";
  const itemCase = data.caseById.get(row.case_id) || {};
  appendText(card, "p", itemCase.government_name || row.case_id, "drafting-evidence-case");
  appendText(card, "h3", valueForEffective(row));
  appendText(card, "p", "位置づけ: " + (row.effective_status || row.original_status || "—") + " / 適用段階: " + (row.applicability_stage || "—"), "drafting-evidence-meta");
  if (row.changed_by_source_id) {
    appendText(card, "p", "後続資料反映: " + (row.change_type || "変更あり") + " / " + (row.change_locator || "locator未登録"), "drafting-evidence-change");
  }
  if (row.scope) appendText(card, "p", "scope: " + row.scope, "drafting-evidence-meta");
  if (row.condition) appendText(card, "p", "条件: " + row.condition, "drafting-evidence-meta");
  appendText(card, "p", caseBoundaryText(data.evidenceByCase.get(row.case_id)), "drafting-evidence-boundary");
  appendEvidenceLinks(card, row, data, effectiveSourceId(row));
  return card;
}

function evidenceCardForEvaluation(row, data) {
  const card = document.createElement("article");
  card.className = "drafting-evidence";
  appendText(card, "p", row.government_name || row.case_id, "drafting-evidence-case");
  appendText(card, "h3", row.criterion_summary || row.criterion_id);
  appendText(card, "p", "評価: " + (row.points || "—") + " / " + (row.total_points || "—") + "点・" + (row.assessment_stage || "評価"), "drafting-evidence-meta");
  appendText(card, "p", caseBoundaryText(data.evidenceByCase.get(row.case_id)), "drafting-evidence-boundary");
  const links = document.createElement("div");
  links.className = "drafting-evidence-links";
  const caseAnchor = document.createElement("a");
  caseAnchor.href = caseLink(row.case_id);
  caseAnchor.textContent = "案件詳細";
  links.appendChild(caseAnchor);
  if (row.source_url) {
    const sourceAnchor = document.createElement("a");
    sourceAnchor.href = row.source_url;
    sourceAnchor.target = "_blank";
    sourceAnchor.rel = "noreferrer";
    sourceAnchor.textContent = "評価資料 ↗";
    links.appendChild(sourceAnchor);
  }
  card.appendChild(links);
  return card;
}

function specializedMatch(data, selector) {
  return data.specialized.find(function (row) {
    return row.case_id === selector[0] && row.requirement_area === selector[1] && row.requirement_key === selector[2];
  });
}

function evidenceCardForSpecialized(row, data) {
  const card = document.createElement("article");
  card.className = "drafting-evidence";
  const itemCase = data.caseById.get(row.case_id) || {};
  appendText(card, "p", itemCase.government_name || row.case_id, "drafting-evidence-case");
  appendText(card, "h3", row.requirement_area + " / " + row.requirement_key + ": " + (row.value || "—"));
  appendText(card, "p", "位置づけ: " + (row.requiredness || "—") + " / 適用段階: " + (row.applicability_stage || "—"), "drafting-evidence-meta");
  appendText(card, "p", caseBoundaryText(data.evidenceByCase.get(row.case_id)), "drafting-evidence-boundary");
  const links = document.createElement("div");
  links.className = "drafting-evidence-links";
  const caseAnchor = document.createElement("a");
  caseAnchor.href = caseLink(row.case_id);
  caseAnchor.textContent = "案件詳細";
  links.appendChild(caseAnchor);
  if (row.source_url) {
    const sourceAnchor = document.createElement("a");
    sourceAnchor.href = row.source_url;
    sourceAnchor.target = "_blank";
    sourceAnchor.rel = "noreferrer";
    sourceAnchor.textContent = "公式資料 ↗";
    links.appendChild(sourceAnchor);
  }
  card.appendChild(links);
  return card;
}

function renderTopicLinks() {
  const root = document.getElementById("drafting-topic-links");
  if (!root) return;
  DRAFTING_DECISIONS.forEach(function (decision, index) {
    const a = document.createElement("a");
    a.className = "theme-link";
    a.href = "#" + decision.id;
    appendText(a, "span", String(index + 1).padStart(2, "0"));
    appendText(a, "strong", decision.label);
    appendText(a, "small", decision.question);
    root.appendChild(a);
  });
}

function renderDecision(decision, data, index) {
  const section = document.createElement("section");
  section.className = "reading shell drafting-topic";
  section.setAttribute("aria-labelledby", decision.id + "-heading");
  section.id = decision.id;

  const heading = document.createElement("div");
  heading.className = "section-heading split-heading";
  const left = document.createElement("div");
  appendText(left, "p", String(index + 1).padStart(2, "0") + " / DECISION", "eyebrow");
  const h2 = appendText(left, "h2", decision.label);
  h2.id = decision.id + "-heading";
  heading.appendChild(left);
  appendText(heading, "p", decision.question, "section-lead");
  section.appendChild(heading);

  const grid = document.createElement("div");
  grid.className = "drafting-decision-grid";
  const variableBox = document.createElement("div");
  appendText(variableBox, "h3", "自団体で埋める変数");
  const ul = document.createElement("ul");
  decision.variables.forEach(function (variable) { appendText(ul, "li", variable); });
  variableBox.appendChild(ul);
  grid.appendChild(variableBox);

  const roleBox = document.createElement("div");
  appendText(roleBox, "h3", "調達上の置き場所");
  appendText(roleBox, "p", decision.placement);
  grid.appendChild(roleBox);

  const boundaryBox = document.createElement("div");
  appendText(boundaryBox, "h3", "注意");
  appendText(boundaryBox, "p", decision.boundary);
  grid.appendChild(boundaryBox);
  section.appendChild(grid);

  appendText(section, "h3", "実案件で確認できる選択肢", "drafting-subheading");
  const evidenceList = document.createElement("div");
  evidenceList.className = "drafting-evidence-list";

  (decision.effective || []).forEach(function (id) {
    const row = data.effectiveById.get(id);
    if (row) evidenceList.appendChild(evidenceCardForEffective(row, data));
  });
  (decision.evaluations || []).forEach(function (id) {
    const row = data.evaluationById.get(id);
    if (row) evidenceList.appendChild(evidenceCardForEvaluation(row, data));
  });
  (decision.specialized || []).forEach(function (selector) {
    const row = specializedMatch(data, selector);
    if (row) evidenceList.appendChild(evidenceCardForSpecialized(row, data));
  });

  if (!evidenceList.children.length) appendText(evidenceList, "p", "現在の構造化データから表示できる例がありません。", "scope-note");
  section.appendChild(evidenceList);
  return section;
}

function renderCitizenExamples(data) {
  const root = document.getElementById("citizen-examples");
  if (!root) return;
  CITIZEN_SPECIALIZED.forEach(function (selector) {
    const row = specializedMatch(data, selector);
    if (row) root.appendChild(evidenceCardForSpecialized(row, data));
  });
  const grounding = data.effectiveById.get("EFF-saitama-citizen_grounding");
  if (grounding) root.appendChild(evidenceCardForEffective(grounding, data));
}

function renderRoleExamples(data) {
  const root = document.getElementById("role-examples");
  if (!root) return;

  ROLE_EXAMPLES.effective.forEach(function (id) {
    const row = data.effectiveById.get(id);
    if (row) root.appendChild(evidenceCardForEffective(row, data));
  });
  ROLE_EXAMPLES.evaluations.forEach(function (id) {
    const row = data.evaluationById.get(id);
    if (row) root.appendChild(evidenceCardForEvaluation(row, data));
  });

  const claim = document.createElement("article");
  claim.className = "drafting-evidence";
  appendText(claim, "p", "北海道 2026 RAG調達", "drafting-evidence-case");
  appendText(claim, "h3", "参加資格と提案評価を同一視しない例");
  appendText(claim, "p", "参加資格のEvidenceはreviewed Claimから確認してください。機能要件・評価項目の自動分類には使いません。", "drafting-evidence-meta");
  const links = document.createElement("div");
  links.className = "drafting-evidence-links";
  const a = document.createElement("a");
  a.href = "https://github.com/Josh-Temple/public-sector-ai-procurement-japan/blob/main/" + ROLE_EXAMPLES.qualificationClaim;
  a.textContent = "参加資格のClaim ↗";
  links.appendChild(a);
  claim.appendChild(links);
  root.appendChild(claim);
}

async function initDraftingSupport() {
  renderTopicLinks();
  try {
    const loaded = await Promise.all([
      loadDraftingCSV(DRAFTING_DATA_FILES.cases),
      loadDraftingCSV(DRAFTING_DATA_FILES.effective),
      loadDraftingCSV(DRAFTING_DATA_FILES.evaluations),
      loadDraftingCSV(DRAFTING_DATA_FILES.specialized),
      loadDraftingCSV(DRAFTING_DATA_FILES.sources),
      loadDraftingCSV(DRAFTING_DATA_FILES.evidence)
    ]);
    const data = {
      cases: loaded[0],
      effective: loaded[1],
      evaluations: loaded[2],
      specialized: loaded[3],
      sources: loaded[4],
      evidence: loaded[5]
    };
    data.caseById = byKey(data.cases, "case_id");
    data.effectiveById = byKey(data.effective, "effective_requirement_id");
    data.evaluationById = byKey(data.evaluations, "criterion_id");
    data.sourceById = byKey(data.sources, "source_id");
    data.evidenceByCase = byKey(data.evidence, "case_id");

    const sections = document.getElementById("drafting-sections");
    DRAFTING_DECISIONS.forEach(function (decision, index) {
      sections.appendChild(renderDecision(decision, data, index));
    });
    renderCitizenExamples(data);
    renderRoleExamples(data);
  } catch (error) {
    const root = document.getElementById("drafting-sections");
    if (root) appendText(root, "p", "構造化データの読み込みに失敗しました。RepositoryのCSVを確認してください。", "shell scope-note");
    console.error(error);
  }
}

if (typeof module !== "undefined") {
  module.exports = {
    DRAFTING_DATA_FILES,
    DRAFTING_DECISIONS,
    CITIZEN_SPECIALIZED,
    ROLE_EXAMPLES,
    parseDraftingCSV,
    effectiveSourceId,
    valueForEffective,
    caseBoundaryText
  };
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initDraftingSupport);
}
