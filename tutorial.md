---
title: "Tutorial: Launch your first micro-store"
description: Build a complete micro-store connected to your Shopify catalog — from API setup to live storefront — in 10 minutes.
---

# Tutorial: Launch your first micro-store

In this tutorial you'll build a working micro-store backed by your Shopify catalog. We'll use Comet's GraphQL API to:

1. Fetch products for a campaign collection
2. Create a checkout flow
3. Launch it as a micro-store via the Comet console

**Prerequisites:** Complete the [Quick Start](/quickstart) first — you need a connected Shopify store and a working API key.

---

## Overview

A **micro-store** in Comet is a standalone, URL-addressable store page designed for a specific campaign (product launch, seasonal sale, social commerce drop). It:

- Pulls products from your existing Shopify catalog
- Has its own URL (e.g. `your-brand.satellites.comet.rocks/summer-launch`)
- Handles checkout through Comet's federated cart API
- Can be embedded or shared as a link (e.g. on social media, email, ads)

---

## Part 1: Select your campaign products

First, identify the product IDs you want to feature. The Publisher GraphQL API can list and filter products by the fields supported by `ProductFindFilters`; it does not expose a collection-ID filter.

### Query products

```graphql
query GetCampaignProducts($organizationId: ID!) {
  productFind(
    organizationId: $organizationId
    pagination: { first: 20 }
  ) {
    nodes {
      id
      name {
        default { text }
      }
      description {
        default { text }
      }
      sku
      externalId
      type
      variantOf {
        id
        name {
          default { text }
        }
      }
    }
  }
}
```

::: tip
Use the returned `id` values in the cart mutations below.
:::

---

## Part 2: Build the checkout flow

The cart and order API sequence is:

```
cartCreate → cartAddProducts → cartApplyShippingAddress
  → cart → cartApplyShippingMethods → cartCreatePaymentIntent
  → cartPaymentIntentConfirm (when required by the provider) → orderSubmit
```

### 1. Create a cart

```graphql
mutation CreateCart {
  cartCreate {
    id
    bags {
      id
      externalId
    }
  }
}
```

### 2. Add campaign products

```graphql
mutation AddProducts($cartId: ID!, $productId: ID!) {
  cartAddProducts(id: $cartId, input: {
    products: [{ productId: $productId, quantity: 1 }]
  }) {
    id
    bags {
      id
      lines {
        product {
          id
        }
        quantity
      }
      totals {
        subTotal {
          amount
          currency
        }
      }
    }
  }
}
```

### 3. Apply shipping address

```graphql
mutation SetAddress($cartId: ID!) {
  cartApplyShippingAddress(id: $cartId, input: {
    useAsBillingAddress: true
    address: {
      firstName: "Jane"
      lastName: "Doe"
      address1: "123 Main St"
      city: "New York"
      regionCode: "NY"
      countryCode: "US"
      postalCode: "10001"
      phone: "+1 212 555 0100"
    }
  }) {
    id
    bags {
      availableShippingMethods {
        id
        name
        price {
          amount
          currency
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
  cartApplyShippingMethods(id: $cartId, input: {
    bags: [{ bagId: $bagId, shippingMethodId: $methodId }]
  }) {
    id
    totals {
      total {
        amount
        currency
      }
    }
  }
}
```

### 5. Create payment intent

```graphql
mutation CreatePayment($cartId: ID!, $locale: Locale!, $countryCode: CountryCode!) {
  cartCreatePaymentIntent(id: $cartId, locale: $locale, countryCode: $countryCode) {
    id
    paymentIntent {
      id
      externalId
      provider
      additionalDetails
    }
  }
}
```

Creating a payment intent does not confirm payment. For provider flows that use the API confirmation step, call `cartPaymentIntentConfirm` with the payment details and a redirect URL:

```graphql
mutation ConfirmPayment($cartId: ID!, $input: CartPaymentIntentConfirmInput!) {
  cartPaymentIntentConfirm(id: $cartId, input: $input) {
    status
    providerStatus
    externalId
    action
  }
}
```

The confirmation response can include an `action` for the client to complete. `orderSubmit` requires a payment intent or payment session, but the backend's cart-submission check does not inspect a payment status. Handle provider-specific payment completion in the client before submitting the order. A successful `orderSubmit` does not guarantee that the order is paid.

### 6. Submit the order

```graphql
mutation SubmitOrder($cartId: ID!) {
  orderSubmit(id: $cartId) {
    id
    status
    bags {
      id
      shopSystemOrderId
    }
  }
}
```

The response includes an order ID and each bag's shop-system order ID when available. Payment settlement is a separate provider and order-processing concern.

---

## Part 3: Launch your micro-store

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
- **Styling:** The micro-store storefront supports custom CSS and logo upload from the console
- **Discount codes:** Use [`cartApplyCoupons`](/resources/checkout/cart_disc) to support promo codes
- **Analytics:** Each storefront tracks conversion events — view them in the console under **Analytics**
- **Multi-merchant campaigns:** Add products from multiple connected stores to the same cart

Explore the full [Checkout API reference](/resources/checkout/carts) for advanced options.
