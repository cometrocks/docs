---
layout: home

hero:
  name: "Comet Rocks"
  text: "Headless Ecommerce Infrastructure"
  tagline: Launch campaign storefronts, connect any shop system, and deliver unified checkout — all through a single GraphQL API.
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
    details: Query products, variants, and inventory across Shopify, Magento, Salesforce Commerce Cloud, and BigCommerce through a single GraphQL schema.
  - icon: 🛒
    title: Federated Checkout
    details: Multi-merchant carts, real-time shipping rates, coupon codes, Stripe payment intents, and order submission — all in one API.
  - icon: 🚀
    title: Campaign Storefronts
    details: Launch product launches, seasonal campaigns, and social commerce experiences in minutes. Powered by Comet's satellite storefront infrastructure.
  - icon: 🔌
    title: Any Shop System
    details: Connect Shopify, Magento 2, BigCommerce, or SFCC. Comet normalizes catalog, inventory, and checkout data into a consistent API contract.
---

## What is Comet Rocks?

Comet Rocks is a headless ecommerce infrastructure platform. It sits between your brand touchpoints (storefronts, apps, campaigns) and your shop systems (Shopify, Magento, SFCC) — federating catalog, cart, and checkout into a **single GraphQL API**.

### Two core products

**[comet.rocks](https://comet.rocks)** — Campaign Storefront Platform  
Launch campaign-specific storefronts for product launches, seasonal drops, and social commerce. Available as a Shopify app ("Comet: Campaign Funnel Builder") or via direct API integration.

**[chatcast.io](https://chatcast.io)** — Conversational Storefront  
A conversational and agentic UI layer on top of the Comet catalog platform. Let customers discover and buy through natural conversation.

### The API

All of Comet's infrastructure is exposed through an **Apollo Federation** GraphQL API:

```
Brand Touchpoints → Apollo Router → Subgraphs → Shop System Connectors
```

- **Endpoint:** `https://apollo-runtime-router-dmn3-production.up.railway.app/`
- **Auth:** API key (`x-api-key` header) or JWT bearer token
- **Schema explorer:** [Apollo Studio](https://studio.apollographql.com/public/CometAPI/variant/main)

### Next steps

- [Quick Start](/quickstart) — Connect your Shopify store and make your first API call in 5 minutes
- [Tutorial](/tutorial) — Launch a full campaign storefront end-to-end
- [Apps](/resources/apps) — Understand the App model before building
- [Authentication](/resources/authentication/authentication) — API keys and JWT tokens
