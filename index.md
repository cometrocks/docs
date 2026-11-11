---
layout: home

hero:
  name: "Comet Rocks"
  text: "Headless Ecommerce Infrastructure"
  tagline: Integrate merchant catalogs and checkout, or publish creator pages from your application.
  actions:
    - theme: brand
      text: Quick Start
      link: /quickstart
    - theme: alt
      text: API Reference
      link: /resources/apps
    - theme: alt
      text: Dashboard →
      link: https://console.comet.rocks

features:
  - icon: { src: /icons/catalog.svg, width: 28, height: 28 }
    title: Unified Catalog API
    details: Query products, variants, and inventory across Shopify, Magento, and Salesforce Commerce Cloud through a single GraphQL schema.
  - icon: { src: /icons/checkout.svg, width: 28, height: 28 }
    title: Federated Checkout
    details: Multi-merchant carts, real-time shipping rates, discount codes, Stripe payment intents, and order submission — all in one API.
  - icon: { src: /icons/storefront.svg, width: 28, height: 28 }
    title: Checkout Stores
    details: Launch campaign storefronts for product drops, seasonal moments, and social commerce in minutes.
  - icon: { src: /icons/connect.svg, width: 28, height: 28 }
    title: Shop System Integrations
    details: Connect Shopify, Magento 2, or SFCC. Comet normalizes catalog, inventory, and checkout into a consistent API contract.
---

## What is Comet Rocks?

Comet Rocks is headless ecommerce infrastructure. It sits between your brand touchpoints (storefronts, apps, campaigns) and your shop systems (Shopify, Magento, SFCC) — federating catalog, cart, and checkout into a **single GraphQL API**.

### The platform

**[comet.rocks](https://comet.rocks)** — the Checkout Store platform.
Launch campaign-specific storefronts (also called micro-stores) for product launches, seasonal drops, and social and AI-driven commerce. Available as a Shopify app ("Comet: Campaign Funnel Builder") or through direct API integration.

### The API

Comet's catalog, cart, and checkout interface is an **Apollo Federation** GraphQL API:

```
Brand Touchpoints → Apollo Router → Subgraphs → Shop System Connectors
```

- **Endpoint:** `https://api.comet.rocks/graphql` (also shown in the dashboard under **Apps**)
- **Auth:** API key (`x-api-key` header) or JWT bearer token (`Authorization: Bearer …`)
- **Schema explorer:** the **API Explorer** in the [dashboard](https://console.comet.rocks)

Use the [Creator Publishing REST API](/resources/creator-publishing/overview) to manage drafts, media and published pages for verified creators. Contact Comet to set up creator access and public hosting.

### Next steps

- [Quick Start](/quickstart) — Set up a publisher app and make your first API call
- [Tutorial](/tutorial) — Launch a full Checkout Store end-to-end
- [Apps](/resources/apps) — Manage app credentials and request access
- [Authentication](/resources/authentication/authentication) — API keys and JWT tokens
- [Creator Publishing](/resources/creator-publishing/overview) — Server-to-server page editing and publishing

::: tip Looking for the operator help center?
These are the **developer** docs. For the no-code builder, billing, and store-management guides, see the [Comet Help Center](https://comet.rocks/help).
:::
