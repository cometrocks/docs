# Comet Rocks Docs

Developer documentation for [comet.rocks](https://comet.rocks) — headless ecommerce infrastructure for brands.

Built with [VitePress](https://vitepress.dev) and deployed to GitHub Pages.

## Local development

```bash
npm install
npm run docs:dev
```

Docs will be available at `http://localhost:5173`.

## Build

```bash
npm run docs:build
```

Output is in `.vitepress/dist/`.

## Deployment

Docs deploy via **Vercel** (same platform as `comet.rocks` and `console.comet.rocks`).
Build settings are committed in [`vercel.json`](./vercel.json) (`framework: vitepress`,
build `npm run docs:build`, output `.vitepress/dist`), so no manual config is needed.

### First-time setup / cutover from Mintlify

`docs.comet.rocks` was previously hosted on **Mintlify**. To finish moving it here:

1. **Import the repo** on [vercel.com/new](https://vercel.com/new) → select `cometrocks/docs`.
   Vercel reads `vercel.json` automatically; just click Deploy. It auto-deploys on every push to `main`.
2. **Disconnect Mintlify**: remove the Mintlify GitHub app from `cometrocks/docs` and cancel the
   Mintlify subscription. (The old "Mintlify Deployment" check fails now that `mint.json` is gone —
   that's expected; the migration removed it.)
3. **Move the domain**: remove `docs.comet.rocks` from Mintlify, add it as a domain on this Vercel
   project, and update the DNS record to point at Vercel.

No GitHub Actions workflow required.

## Structure

```
.
├── index.md                        # Homepage
├── quickstart.md                   # Shopify connector quickstart
├── tutorial.md                     # Campaign storefront tutorial
├── resources/
│   ├── apps.md                     # App model overview
│   ├── authentication/             # Auth & API keys
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
