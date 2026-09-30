# Fukushima generative AI procurement comparison — 2025 to 2026

## Scope

福島県「生成AIサービス導入支援業務」の2025年度・2026年度公式仕様書と評価基準を比較する。

Sources:
- 2025 specification: https://www.pref.fukushima.lg.jp/uploaded/attachment/678532.pdf
- 2025 evaluation: https://www.pref.fukushima.lg.jp/uploaded/attachment/678533.pdf
- 2026 specification: https://www.pref.fukushima.lg.jp/uploaded/attachment/734795.pdf
- 2026 evaluation: https://www.pref.fukushima.lg.jp/uploaded/attachment/734796.pdf
- 2025 procurement page: https://www.pref.fukushima.lg.jp/sec/11045a/ai-proposal-2025.html
- 2026 procurement page: https://www.pref.fukushima.lg.jp/sec/11045a/ai-proposal-2026.html

## What changed

### 1. 2025: safe service trial + basic usage measurement

2025 specification centers on:
- SaaS browser access
- ChatGPT or Gemini, at least one
- ChatGPT-3.5 turbo-equivalent or better
- training-data prohibition
- confidential-information leakage prevention
- prompt templates
- user log export
- organization-wide usage analysis
- 50 concurrent users
- 5 million characters per month
- domestic server or domestic governing law
- basic training/support
- separate procurement of 53 Microsoft 365 Copilot licenses

The stated goal is to observe usage frequency and use-case tendencies and use the results to consider full deployment.

### 2. 2026: expanded RAG/governance/adoption pilot + evidence for the next production-design stage

2026 keeps the basic SaaS layer but adds a substantially wider work package:
- 100+ users and 50+ concurrent users
- 20 million characters/month-equivalent for the overall trial
- explicit model/version and version-upgrade policy
- configurable retention and viewing rights
- RBAC/admin separation and auditable admin logs
- encryption and incident-response requirements
- RAG over internal documents, FAQ, notices, manuals and meeting minutes
- source/grounding display
- document replacement/add/delete/version management
- document-level or departmental access control
- monthly/ad-hoc adoption support
- use-case creation
- usage-rule and risk-classification support
- RAG data preparation/document cleansing
- KPI design, surveys, workload-reduction estimation and improvement proposals
- organization-wide adoption events/training
- one online training session for municipal staff
- intermediate and final reports
- proposed requirements, operating model, cost sense and phased deployment scenario for production

This is not simply an increase in model capability. The procurement remains an official pilot/verification effort, but expands from a tool trial into broader organizational implementation research intended to prepare requirements, governance and operating design for the next full-introduction stage.

## Evaluation shift

### 2025 evaluation
100 points:
- implementation approach: 10
- delivery organization: 10
- past experience: 10
- security: 15
- functional fit / ingenuity: 25
- operations/support fit / ingenuity: 20
- cost: 10

### 2026 evaluation
100 points:
- business understanding / approach: 10
- delivery and management capability: 10
- service functionality/performance: 20
- RAG suitability: 10
- training/adoption: 20
- pilot process / hands-on support: 10
- free proposal: 10
- cost/cost-performance: 10

The largest change is not price weighting: cost remains 10 points. What changes is the explicit separation of RAG and adoption/behavior-change capabilities. In 2026, training/adoption alone receives 20 points.

## Procurement outcome context

2025 procurement page states that the purpose was a pilot leading toward full introduction. The selected contractor was NTT East (Miyagi Business Department, Fukushima Branch).

2026 explicitly continues to describe the work as a trial toward the next stage, but adds RAG, governance, organizational adoption, and future municipal expansion. The selected contractor was Dentsu Soken; 12 firms participated and the selected proposal received 258 points.

Vendor change and specification change are recorded separately. The available public evidence does not establish that the vendor change caused the scope change.

## Implication for the dataset

The project should distinguish at least:
- product/service capability
- RAG capability
- security/governance
- adoption/change support
- evaluation/evidence generation
- future production-design deliverables

A binary “AI introduced: yes/no” field would lose most of the procurement intelligence visible in these two successive tenders.
