---
title: Quick Start
description: Connect your Shopify store to Comet Rocks and make your first GraphQL API call in under 5 minutes.
---

# Quick Start

This guide walks you through connecting a Shopify store to Comet Rocks and making your first catalog query. Total time: **~5 minutes**.

## Prerequisites

- A Shopify store (development store is fine)
- A Comet Rocks account — [sign up at console.comet.rocks](https://console.comet.rocks)

---

## Step 1: Create your Comet App

An **App** in Comet is the entity that holds your API credentials and connects to your shop systems.

1. Log in to [console.comet.rocks](https://console.comet.rocks)
2. From the dashboard, click **Apps** in the left sidebar
3. Click **Create New App**
4. Give your app a name (e.g. `my-shopify-store`) and click **Create**
5. Copy your **API Key** — you'll need it in the next step

> **Keep your API key secret.** Never expose it in client-side code or public repositories.

---

## Step 2: Connect your Shopify store

1. In your App settings, click **Add Store**
2. Select **Shopify** as the platform
3. Enter your Shopify store URL (e.g. `your-store.myshopify.com`)
4. You'll be prompted to create a **Custom App** in your Shopify admin:
   - Go to Shopify Admin → **Settings** → **Apps and sales channels** → **Develop apps**
   - Click **Create an app** and name it `Comet Rocks`
   - Under **Configuration**, enable these API scopes:
     - `read_products`
     - `read_inventory`
     - `read_price_rules`
   - Click **Install app** and copy the **Admin API access token**
5. Paste the Admin API access token into the Comet console and click **Connect**

Comet will perform an initial catalog sync. This takes 30–60 seconds for small catalogs.

---

## Step 3: Make your first API call

The Comet GraphQL endpoint is:

```
https://apollo-runtime-router-dmn3-production.up.railway.app/
```

### Test authentication

```bash
curl -X POST https://apollo-runtime-router-dmn3-production.up.railway.app/ \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"query": "{ __typename }"}'
```

Expected response:
```json
{"data": {"__typename": "Query"}}
```

### Query your catalog

Fetch the first 10 products from your connected Shopify store:

```graphql
query GetProducts($organizationId: ID!) {
  productFind(
    organizationId: $organizationId
    pagination: { first: 10 }
  ) {
    edges {
      node {
        id
        name
        sku
        description
        type
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

```bash
curl -X POST https://apollo-runtime-router-dmn3-production.up.railway.app/ \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "query": "query GetProducts($organizationId: ID!) { productFind(organizationId: $organizationId pagination: { first: 10 }) { edges { node { id name sku } } } }",
    "variables": { "organizationId": "YOUR_ORG_ID" }
  }'
```

> Find your `organizationId` in the Comet console under **Settings → Organization**.

---

## Step 4: Create a cart and add a product

```graphql
# 1. Create a cart
mutation CreateCart {
  cartCreate(input: {
    organizationId: "YOUR_ORG_ID"
  }) {
    id
    bags {
      id
    }
  }
}
```

```graphql
# 2. Add a product to the cart
mutation AddProduct($cartId: ID!, $productId: ID!) {
  cartAddProducts(input: {
    cartId: $cartId
    products: [{ productId: $productId, quantity: 1 }]
  }) {
    id
    bags {
      id
      products {
        productId
        quantity
      }
    }
  }
}
```

---

## Next steps

- [Tutorial: Launch your first campaign storefront](/tutorial) — build a full end-to-end flow
- [Catalog API reference](/resources/catalog/prod_search) — full product search, filtering, and pagination
- [Checkout flow](/resources/checkout/carts) — cart → addresses → shipping → payment → submit
- [Apollo Studio schema explorer](https://studio.apollographql.com/public/CometAPI/variant/main) — interactive schema browser
