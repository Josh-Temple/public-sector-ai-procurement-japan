"use strict";

// Exact presentation mappings; canonical CSV values remain unchanged.
const ProcurementCopy = (() => {
  const contracts = {
    "single_entity_contract": "単独団体による契約を想定",
    "joint vendor selection + separate contract by each participating entity": "共同で事業者を選定し、参加団体ごとに個別契約を想定",
    "council basic contract + separate service agreement with each participating municipality": "協議会が基本契約を締結し、参加自治体ごとに別途サービス利用契約を締結する想定",
    "single entity contract; final terms resolved by Q&A > specification > proposal, except superior proposal portions may prevail": "単独団体による契約。最終条件は質問回答、仕様書、提案書の順に優先。ただし、提案の優れた部分が優先される場合がある",
    "two contracts selected through one proposal: AI service + training": "1件の提案審査でAIサービスと研修の2契約を選定",
    "single_entity_contract_after_negotiation_with_preferred_proposer": "優先候補者との協議後に単独団体との契約を想定",
    "FY2025 design/development contract; FY2026+ operations/maintenance intended as separate negotiated contract with design/development vendor, subject to budget": "2025年度は設計・開発契約。2026年度以降の運用・保守は設計・開発事業者との別途随意契約を予定（予算が条件）",
    "negotiation_with_preferred_proposer": "優先交渉権者との契約協議を予定",
    "negotiation_with_first_priority_negotiator": "第1優先交渉権者との契約協議を予定"
  };
  const prices = {
    "proposal ceiling 8,833,000 JPY including tax": "提案上限額8,833,000円（税込）",
    "entity-specific ceilings; initial/basic/maintenance + LGWAN/training options": "団体ごとの上限額。初期費用・基本費用・保守費用に加え、LGWAN・研修の選択肢",
    "fixed-fee service; approximately 200M tokens/month assumed": "定額サービス。月約2億トークンの利用を想定",
    "price competition; official bid amounts shown tax-exclusive": "価格競争。公式の入札額は税抜表示",
    "common plan/pricing set by basic contract; actual service application per municipality": "基本契約で共通のプラン・料金を定め、実際のサービス利用申込みは自治体ごとに行う想定",
    "proposal ceiling 1,200,000 JPY including tax": "提案上限額1,200,000円（税込）",
    "proposal ceiling 1,340,000 JPY including tax; price contributes 200/1000": "提案上限額1,340,000円（税込）。価格の配点は200/1000",
    "proposal ceiling 6,600,000 JPY including tax; cost performance 35/100": "提案上限額6,600,000円（税込）。費用対効果の配点は35/100",
    "proposal ceiling 9,000,000 JPY including tax": "提案上限額9,000,000円（税込）",
    "proposal ceiling 12,760,000 JPY including tax; price 15/100; local-company factor 10/100": "提案上限額12,760,000円（税込）。価格の配点は15/100、市内企業の配点は10/100",
    "service ceiling 792,000 JPY incl tax; training ceiling 2,700,000 JPY incl tax; price 30/100": "サービス上限額792,000円（税込）、研修上限額2,700,000円（税込）。価格の配点は30/100",
    "proposal ceiling 2,290,000 JPY including tax; economic criterion 5/150": "提案上限額2,290,000円（税込）。経済性の配点は5/150",
    "proposal ceiling 8,000,000 JPY including tax; price 20/100 using (1-bid/ceiling)*20": "提案上限額8,000,000円（税込）。価格点は(1−入札額/上限額)×20（20/100）",
    "FY2026 ceiling components: build 5,500,000 JPY incl tax; operation 3,075,600 JPY incl tax for Sep-Mar; usage-based charges if any must remain within operation ceiling": "2026年度の上限額内訳：構築5,500,000円（税込）、9月〜3月の運用3,075,600円（税込）。従量課金がある場合も運用上限額内に収める",
    "proposal ceiling 1,367,000 JPY incl tax; monthly fixed usage fee; capped models auto-stop at limit": "提案上限額1,367,000円（税込）。月額定額利用料。上限のあるモデルは上限到達時に自動停止",
    "planned price 1,992,000 JPY tax excluded total; fixed-fee service; no automatic usage-based overage; cap reached => restriction without additional charge": "予定価格は合計1,992,000円（税抜）。定額サービスで自動的な従量超過課金は行わず、上限到達時は追加料金なしで利用制限"
  };
  function display(mapping, value) {
    if (!value || !String(value).trim()) return "未登録（条件の有無は未確認）";
    return Object.prototype.hasOwnProperty.call(mapping, value)
      ? mapping[value] : "日本語表示未対応（登録値）：" + String(value);
  }
  return { contractingModel: value => display(contracts, value), pricingBasis: value => display(prices, value) };
})();
if (typeof module !== "undefined") module.exports = ProcurementCopy;
