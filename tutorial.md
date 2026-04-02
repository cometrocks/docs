---
title: "Tutorial: Launch your first campaign storefront"
description: Build a complete campaign storefront connected to your Shopify catalog — from API setup to live storefront — in 10 minutes.
---

# Tutorial: Launch your first campaign storefront

In this tutorial you'll build a working campaign storefront backed by your Shopify catalog. We'll use Comet's GraphQL API to:

1. Fetch products for a campaign collection
2. Create a checkout flow
3. Launch it as a satellite storefront via the Comet console

**Prerequisites:** Complete the [Quick Start](/quickstart) first — you need a connected Shopify store and a working API key.

---

## Overview

A **campaign storefront** in Comet is a standalone, URL-addressable store page designed for a specific campaign (product launch, seasonal sale, social commerce drop). It:

- Pulls products from your existing Shopify catalog
- Has its own URL (e.g. `your-brand.satellites.comet.rocks/summer-launch`)
- Handles checkout through Comet's federated cart API
- Can be embedded or shared as a link (e.g. on social media, email, ads)

---

## Part 1: Select your campaign products

First, identify the products you want to feature. Use tags or a collection ID from Shopify.

### Query products by collection

```graphql
query GetCampaignProducts($organizationId: ID!, $collectionId: String!) {
  productFind(
    organizationId: $organizationId
    filter: { externalCollectionId: $collectionId }
    pagination: { first: 20 }
  ) {
    edges {
      node {
        id
        name
        description
        sku
        externalId
        type
        variantOf {
          id
          name
        }
      }
    }
  }
}
```

> **Tip:** `externalId` is the Shopify product GID. Use this to cross-reference with Shopify Admin.

---

## Part 2: Build the checkout flow

A complete checkout in Comet follows this sequence:

```
cartCreate → cartAddProducts → cartApplyShippingAddress
  → cartGetShippingMethods → cartCreatePaymentIntent → orderSubmit
```

### 1. Create a cart

```graphql
mutation CreateCart($orgId: ID!) {
  cartCreate(input: { organizationId: $orgId }) {
    id
    bags {
      id
      merchantId
    }
  }
}
```

### 2. Add campaign products

```graphql
mutation AddProducts($cartId: ID!, $productId: ID!) {
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
        price {
          amount
          currencyCode
        }
      }
      subtotal {
        amount
        currencyCode
      }
    }
  }
}
```

### 3. Apply shipping address

```graphql
mutation SetAddress($cartId: ID!) {
  cartApplyShippingAddress(input: {
    cartId: $cartId
    useSameForBilling: true
    address: {
      firstName: "Jane"
      lastName: "Doe"
      address1: "123 Main St"
      city: "New York"
      province: "NY"
      country: "US"
      zip: "10001"
      phone: "+1 212 555 0100"
    }
  }) {
    id
    bags {
      availableShippingMethods {
        id
        title
        price {
          amount
          currencyCode
        }
      }
    }
  }
}
```

### 4. Select shipping method

Take the `id` of your chosen shipping method from the response above:

```graphql
mutation SetShipping($cartId: ID!, $bagId: ID!, $methodId: ID!) {
  cartApplyShippingMethods(input: {
    cartId: $cartId
    shippingMethods: [{ bagId: $bagId, shippingMethodId: $methodId }]
  }) {
    id
    total {
      amount
      currencyCode
    }
  }
}
```

### 5. Create payment intent

```graphql
mutation CreatePayment($cartId: ID!) {
  cartCreatePaymentIntent(input: { cartId: $cartId }) {
    paymentIntentId
    clientSecret
    amount
    currency
  }
}
```

Use the `clientSecret` with Stripe.js to collect payment on the frontend.

### 6. Submit the order

```graphql
mutation SubmitOrder($cartId: ID!) {
  orderSubmit(input: { cartId: $cartId }) {
    id
    status
    bags {
      id
      externalOrderId
    }
  }
}
```

On success, Comet places the order in Shopify. The `externalOrderId` is the Shopify order GID.

---

## Part 3: Launch on a satellite storefront

Now publish this campaign as a live URL using the Comet console.

1. In [console.comet.rocks](https://console.comet.rocks), navigate to **Storefronts**
2. Click **New Storefront**
3. Set:
   - **Name:** `Summer Launch`
   - **Slug:** `summer-launch` → your URL will be `your-brand.satellites.comet.rocks/summer-launch`
   - **Organization:** select your Shopify org
4. Under **Products**, add the product IDs from Part 1
5. Click **Publish**

Your storefront is now live. Share the URL in ads, email, or social posts.

---

## What's next?

- **Custom domain:** Point a subdomain (e.g. `launch.yourbrand.com`) to `satellites.comet.rocks` via CNAME
- **Styling:** The satellite storefront supports custom CSS and logo upload from the console
- **Discount codes:** Use [cartApplyCoupons](/resources/checkout/cart_disc) to support promo codes
- **Analytics:** Each storefront tracks conversion events — view them in the console under **Analytics**
- **Multi-merchant campaigns:** Add products from multiple connected stores to the same cart

Explore the full [Checkout API reference](/resources/checkout/carts) for advanced options.
