# Documentation agent instructions

Read [Creator platform product boundaries](resources/creator-platform/product-boundaries.md) before planning or changing cross-product creator documentation. Distinguish implemented, default-disabled, proposed, and live behavior; a merged route or a Proposed ADR does not prove activation or approval.

Use the owner of each canonical record as the source of truth. Klyfton owns its creator app, local identity and entitlements, and financial product. Comet owns canonical creator publishing; native creator commerce and booking ownership remain proposals until their contracts and gates are accepted. Keep Klyfton ledger authority for its wallet separate from Comet checkout evidence. Never infer shared asset authority from email or shared code provenance.

When documenting an integration, state the partner/environment scope, current host and adapter, independent authorization checks, and release evidence. Verify accounts and operators from the service runbook before any infrastructure instruction. Klyfton Google Cloud instructions must specify `product@klyfton.io` and `klyfton-docs-prod`.

Andrew requested this future direction on 2026-09-30 as documentation and planning guidance, with no implementation under this request. For a future reusable feature, record owner and data authority, UI delivery mode, current host and adapter, reuse seam and migration trigger, and required evidence and gates. Do not imply a public creator SDK or require broad extraction before a second real program validates it.

Run `npm run docs:check`, `npm test`, and `npm run docs:build` for documentation changes when dependencies are available. Follow existing VitePress navigation and Markdown style. Do not edit another repository as part of a docs-only change.
