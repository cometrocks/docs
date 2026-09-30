---
title: 'Creator Platform Product Boundaries'
description: 'Current Comet and Klyfton authority, proposed product ownership, and planning rules for reusable creator features.'
---

# Creator platform product boundaries

Comet Rocks and Klyfton serve different product roles. Comet supplies creator publishing infrastructure and, in the proposed commerce direction, reusable creator selling and buyer fulfillment. Klyfton owns its creator application and financial product. A shared screen or source file does not transfer authority over data, accounts, payments, or customers.

This page is a planning boundary, **not an announcement that every listed feature is live**. The current Creator Publishing integration is described in the [Klyfton integration guide](/resources/creator-publishing/klyfton). Native digital commerce, purchase email, automated store enrollment, and booking inventory are described in Klyfton ADRs that are still **Proposed**; each needs its own implementation and release review. This page does not accept those ADRs or expand Klyfton's frozen v1 scope.

## Current integration

Klyfton's React dashboard hosts a vendored Comet Vue editor with recorded source provenance. Its authenticated Rust backend checks local workspace membership and sends fixed, scoped server requests to Comet. Comet is the canonical authority for creator page content, revisions, publication, media and public routes. Both sides' publishing paths default to disabled until their own provisioning and activation steps are complete. The browser does not receive Comet service credentials or choose the partner, environment, creator binding, or grant.

The existing `@comet-rocks/sdk` is a **microstore client**. Its existence does not establish a public creator-platform SDK, an embedded commerce API, or general availability of creator modules. The copied editor also does not by itself establish a reusable package or a new product contract.

## Product ownership direction

| Area | Klyfton authority | Comet authority or proposed authority |
| --- | --- | --- |
| Creator application | React shell, sign-in, local membership, creator plans and feature entitlements | Scoped partner/creator binding and its own service grants; no Klyfton account authority |
| Financial product | Financial onboarding, ledger, wallet and balances, banking, invoices and financial reporting | No Klyfton balance writes |
| External connections | Social and calendar connector consent, token custody, refresh and revocation | Only bounded adapter operations when explicitly authorized; no raw Klyfton tokens |
| Publishing | Workspace access and user actions through the Klyfton gateway | Shared editor/preview, canonical content and revisions, publication, media, handles and public pages |
| Native creator commerce (proposed) | Creator-facing composition and eligible workspace actions | Products, offers, private files, seller Connect setup, checkout, verified orders, buyer access and purchase email |
| Booking (proposed) | Creator-facing composition and calendar/meeting consent | Booking inventory, holds, allocations and fulfillment decisions |

The proposed commerce boundary keeps buyer access and purchase email independent of Klyfton uptime. Stripe commerce events are external evidence; they do not create Klyfton wallet cash. **The Klyfton ledger is the sole authority for Klyfton wallet balances and money postings.** That rule does not require an unrelated Comet checkout to post through Klyfton's ledger. Seller, payment, tax, support, and legal operator duties require their own reviewed evidence before live commerce.

Code provenance alone does not settle legal intellectual-property ownership, service operator responsibility, or billing ownership. Record those separately for each product and environment.

## Reuse across programs

The target is a generic Comet creator platform that can serve distinct programs through partner theming, domains, and module capabilities. Server authority remains scoped to the actual partner, creator, environment, grant and operation. Klyfton composes those modules with its own financial product; it does not become the authority for Comet's canonical publishing or buyer assets.

Three **possible future delivery forms** are a hosted configurable experience, embedded UI modules, and a headless client API. Choose a form only for a separately scoped feature and a real customer need. Do not promise a public creator SDK or assume that an entire Klyfton screen will become a portable module. An approved scoped API can be reused without pooling accounts, databases, credentials, billing, or legal operators.

The same email address in two programs never proves common asset ownership. Use stable scoped IDs and explicit migration evidence. Klyfton must check local membership and entitlement; Comet must independently check its current binding and grant. Send only the data needed for the operation. Keep buyer order access and fulfillment independent of a Klyfton login or service outage.

Before changing infrastructure, verify the account, project, environment and operator in the relevant service runbook. In particular, Klyfton Google Cloud work uses `product@klyfton.io` and `klyfton-docs-prod`, even when an integration calls a service hosted by Comet; it must not use a Comet account or project by inference.

## Planning rule

For each new cross-product feature, write down:

1. **Owner and data authority:** who owns the user action, canonical record, permissions, payment state and support duty?
2. **UI delivery mode:** Klyfton-local screen, embedded Comet module, hosted experience or client API, and why?
3. **Current host and adapter:** where does the behavior run today, and what fixed, scoped interface connects it?
4. **Future reuse seam and migration trigger:** which boundary could be packaged later, and what real second program or maintenance cost would justify it?
5. **Required evidence and gates:** contracts, isolation, operator and account verification, tests, review, and activation decisions.

For now, this page changes documentation and planning only. Package a bounded module when its feature is separately scoped. Validate tenant isolation and version compatibility with a **second real program** before extracting broad screens. Offer hosted or SDK alternatives when a customer justifies them. These steps set no deadline, mandate no framework change or wholesale rewrite, and remove no existing launch gate.

## Decision and implementation references

- [Klyfton Creator Publishing architecture](https://github.com/SafariShow/Klyfton-Creator-FinOS/blob/main/docs/architecture/creator-publishing.md) and [Comet Creator Publishing overview](/resources/creator-publishing/overview) describe the current scoped publishing boundary.
- [ADR 0090: purchase-access email](https://github.com/SafariShow/Klyfton-Creator-FinOS/blob/main/docs/decisions/0090-oomf-order-email-comet-owned.md) and [ADR 0091: native digital commerce](https://github.com/SafariShow/Klyfton-Creator-FinOS/blob/main/docs/decisions/0091-comet-native-digital-commerce.md) record proposed commerce ownership and activation limits.
- [ADR 0094: storefront enrollment and plans](https://github.com/SafariShow/Klyfton-Creator-FinOS/blob/main/docs/decisions/0094-klyfton-owned-storefront-enrollment-and-plan-entitlements.md) and [ADR 0096: booking inventory](https://github.com/SafariShow/Klyfton-Creator-FinOS/blob/main/docs/decisions/0096-oomf-native-booking-authority.md) record proposed identity, entitlement and booking boundaries.
- [Klyfton ownership map](https://github.com/SafariShow/Klyfton-Creator-FinOS/blob/main/docs/architecture/product-boundaries.md), [gradual transition plan](https://github.com/SafariShow/Klyfton-Creator-FinOS/blob/main/docs/plan/embedded-creator-platform-transition.md), and [ADR 0098: partner-composed UI](https://github.com/SafariShow/Klyfton-Creator-FinOS/blob/main/docs/decisions/0098-comet-creator-platform-and-partner-composed-ui.md) are companion documentation changes pending merge. ADR 0098 remains Proposed.
