---
layout: home

hero:
  name: "Comet Rocks"
  text: "Headless Ecommerce Infrastructure"
  tagline: Launch Checkout Stores, connect any shop system, and deliver unified checkout — all through a single GraphQL API.
  image:
    src: /logo/dark.svg
    alt: Comet Rocks
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
  - icon: 🛍️
    title: Unified Catalog API
    details: Query products, variants, and inventory across Shopify, Magento, and Salesforce Commerce Cloud through a single GraphQL schema.
  - icon: 🛒
    title: Federated Checkout
    details: Multi-merchant carts, real-time shipping rates, discount codes, Stripe payment intents, and order submission — all in one API.
  - icon: 🚀
    title: Checkout Stores
    details: Launch campaign storefronts for product drops, seasonal moments, and social commerce in minutes. Powered by Comet's satellite storefront infrastructure.
  - icon: 🔌
    title: Any Shop System
    details: Connect Shopify, Magento 2, or SFCC. Comet normalizes catalog, inventory, and checkout into a consistent API contract. (BigCommerce is on the roadmap.)
---

## What is Comet Rocks?

Comet Rocks is headless ecommerce infrastructure. It sits between your brand touchpoints (storefronts, apps, campaigns) and your shop systems (Shopify, Magento, SFCC) — federating catalog, cart, and checkout into a **single GraphQL API**.

### The platform

**[comet.rocks](https://comet.rocks)** — the Checkout Store platform.
Launch campaign-specific storefronts (also called micro-stores) for product launches, seasonal drops, and social and AI-driven commerce. Available as a Shopify app ("Comet: Campaign Funnel Builder") or through direct API integration.

### The API

All of Comet's infrastructure is exposed through an **Apollo Federation** GraphQL API:

```
Brand Touchpoints → Apollo Router → Subgraphs → Shop System Connectors
```

- **Endpoint:** `https://api.comet.rocks/graphql` (also shown in the dashboard under **Apps**)
- **Auth:** API key (`x-api-key` header) or JWT bearer token (`Authorization: Bearer …`)
- **Schema explorer:** the **API Explorer** in the [dashboard](https://console.comet.rocks)

It is GraphQL only — there is no REST API.

### Next steps

- [Quick Start](/quickstart) — Connect your Shopify store and make your first API call in 5 minutes
- [Tutorial](/tutorial) — Launch a full Checkout Store end-to-end
- [Apps](/resources/apps) — Understand the App model before building
- [Authentication](/resources/authentication/authentication) — API keys and JWT tokens

::: tip Looking for the operator help center?
These are the **developer** docs. For the no-code builder, billing, and store-management guides, see the [Comet Help Center](https://comet.rocks/help).
:::
