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

Docs are deployed via **Vercel** (same platform as `console.comet.rocks`).

To set up deployment:
1. Connect the `cometrocks/docs` repo on [vercel.com/new](https://vercel.com/new)
2. Set **Framework preset** to `Other`
3. Set **Build command** to `npm run docs:build`
4. Set **Output directory** to `.vitepress/dist`
5. Deploy — Vercel will auto-deploy on every push to `main`

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
