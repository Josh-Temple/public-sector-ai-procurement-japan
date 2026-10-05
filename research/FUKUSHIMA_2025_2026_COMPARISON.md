# Fukushima generative AI procurement comparison — 2025 to 2026

## Scope

福島県「生成AIサービス導入支援業務」の2025案件と2026案件を比較する。2025案件の公告は2025-03-17で公募年度はFY2024、履行期間は2025-06-12〜2026-03-31でFY2025である。case_idの年を公募年度として扱わない。

Sources:
- 2025 procurement page: `SRC-fukushima-2025-page`
- 2025 announcement: `SRC-fukushima-2025-notice`
- 2025 procurement guide: `SRC-fukushima-2025-guide`
- 2025 specification: `SRC-fukushima-2025-spec`
- 2025 Q&A: `SRC-fukushima-2025-qa`, `SRC-fukushima-2025-qa2`
- 2025 evaluation: `SRC-fukushima-2025-evaluation`
- 2025 contract draft: `SRC-fukushima-2025-contract-draft`
- 2025 selection result: `SRC-fukushima-2025-result`
- 2026 specification: `SRC-fukushima-2026-spec`
- 2026 evaluation: `SRC-fukushima-2026-evaluation`
- 2026 result page: `SRC-fukushima-2026-result`

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

The public Q&A materially sharpens the effective 2025 requirements:
- a service built with the ChatGPT or Gemini language model can satisfy the named-model requirement;
- at least 50 users must be able to use the service, separately from the 50-concurrent-user specification;
- the server running the system that uses generative AI is expected to be located in Japan, while the underlying LLM server location itself is not fixed;
- LGWAN-ASP is acceptable and the general generative-AI service is not restricted to LGWAN or Internet;
- the training wording means actual training must be delivered within the engagement, not merely that the vendor has training capability.

These effective interpretations belong in `data/effective_requirements.csv`; the original specification remains the procurement baseline.

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

2025 procurement materials state that the purpose was a pilot leading toward full introduction. The official result identifies NTT East (Miyagi Business Department, Fukushima Branch) as the contract candidate and gives 317/400 points. It also states a performance period of 2025-06-12 through 2026-03-31. The reviewed public materials do not establish the signed contract or contract-final specification: the procurement guide says the final specifications are determined after reflecting the selected proposal and after subsequent negotiation/estimate review.

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

## Evidence boundary

For the 2025 case, candidate selection, signed contract, and actual operation are separate states. The public result confirms candidate selection and the stated performance period; it does not by itself prove a signed contract or actual service operation. The public contract document is a pre-award draft. Accordingly the case remains `publicly_bounded` at contract-final.
