# Comet Rocks Docs

Developer documentation for [comet.rocks](https://comet.rocks) — headless ecommerce infrastructure for brands.

Built with [VitePress](https://vitepress.dev). Deployment configuration targets Vercel.

## Local development

```bash
npm ci
npm run docs:dev
```

Docs will be available at `http://localhost:5173`.

## Build

```bash
npm run docs:build
```

Output is in `.vitepress/dist/`.

## Validation

```bash
npm run docs:check
npm test
npm run docs:build
```

Use Node.js 22. `docs:check` validates the OpenAPI 3.1 document, request/response fixtures, media and deletion error cases, and identity of the embedded/downloadable v2 content schema. It is an offline documentation check, not proof of live API availability. The documentation validation workflow runs these commands on pull requests and `main`; secret scanning runs separately.

When updating Creator Publishing, verify the exact backend revision recorded in the OpenAPI `x-source`. Inspect its controller, store, content contract and media parser. The current spec includes 14 operations. Preserve generated v2 schema provenance; an integration head is not necessarily the artifact's original source revision.

For an additional source comparison, download that revision's `creatorPublishing.http.ts` as `http.ts` and `generated/creator-publishing-v2.ts` as `generated-v2.ts` into a temporary source directory. Obtain GitHub contents via base64 decoding to preserve source escapes. Then run:

```bash
node --experimental-strip-types scripts/check-creator-publishing.mjs --source-dir /absolute/path/to/source
```

This additionally checks controller route coverage, exact generated schema identity, and the example against the real v2 parser/publication validator. When a contract changes, update both the prose and OpenAPI and rerun validation. Structural schema checks cannot reproduce every server semantic refinement.

## Deployment

Docs deploy via **Vercel** (same platform as `comet.rocks` and `console.comet.rocks`).
Build settings are committed in [`vercel.json`](https://github.com/cometrocks/docs/blob/main/vercel.json) (`framework: vitepress`,
build `npm run docs:build`, output `.vitepress/dist`), so no manual config is needed.

### Deployment setup

For a new deployment, import `cometrocks/docs` into Vercel and use the committed build settings. Attach `docs.comet.rocks` only after verifying current domain ownership and provider routing. Historical migration instructions are not evidence that a cutover is still pending.

The configured Git integration can produce preview deployments for PRs and production deployments from `main`. Verify deployment checks and the target domain before claiming a change is live.

## Structure

```
.
├── index.md                        # Homepage
├── quickstart.md                   # Shopify connector quickstart
├── tutorial.md                     # Campaign storefront tutorial
├── resources/
│   ├── apps.md                     # App model overview
│   ├── authentication/             # Auth & API keys
│   ├── creator-publishing/         # Scoped creator-publishing REST integration
│   ├── catalog/                    # Product catalog queries
│   ├── checkout/                   # Cart & checkout flow
│   └── pagination.md               # Pagination
├── merchant/
│   ├── shopify.md                  # Shopify setup guide
│   ├── magento.md                  # Magento 2 setup guide
│   ├── bigcommerce.md              # BigCommerce setup guide
│   └── salesforce.md               # SFCC setup guide
└── .vitepress/
    └── config.mts                  # Site config & navigation
```
