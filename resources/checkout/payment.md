---
title: 'Create Payment Intent'
description: 'There are currently two methods for applying a guest payment method to a cart...'
---

Before submitting your cart, you can use the [cartCreatePaymentIntent](https://studio.apollographql.com/public/CometAPI/variant/main/schema/reference/objects/Mutation#cartCreatePaymentIntent) mutation. This payment intent tracks the total amount that needs to be paid. It will be updated when the user adds or removes products or when shipping methods are updated. The payment can be completed using Apple Pay, Google Pay, or the Stripe Link UI.

After creating the payment intent, the response provides the updated [Cart](https://studio.apollographql.com/public/CometAPI/variant/main/schema/reference/objects/Cart) with the associated payment intent details.

```graphql
mutation CreatePaymentIntent($id: ID!, $locale: Locale!, $countryCode: CountryCode!) {
  cartCreatePaymentIntent(id: $id, locale: $locale, countryCode: $countryCode) {
    id
    paymentIntent {
      id
      externalId
      provider
      additionalDetails
    }
    # Other fields of the Cart type can be queried here
  }
}
```

#### Input Parameters for `cartCreatePaymentIntent`

- `id`: The ID of the cart for which you want to create a payment intent.
- `locale`: The shopper locale.
- `countryCode`: The shopper country code.

**Example**:

```json
{
  "id": "cart_ZMe6Bb4GqqUe3BWV",
  "locale": "en",
  "countryCode": "US"
}
```

### Types

#### Cart

- Contains details about the cart, including items, addresses, payment intent details, and other relevant information. You can refer to the [Cart](https://studio.apollographql.com/public/CometAPI/variant/main/schema/reference/objects/Cart) type in the schema for a complete list of fields and their descriptions.

#### PaymentIntent

- Contains details about the payment intent:
- `id`: The unique identifier for the payment intent.
- `externalId`: An external identifier for the payment intent, typically provided by the payment gateway.
- `provider`: The configured payment provider.
- `additionalDetails`: Provider-specific data used by the client payment flow. The deprecated `clientSecret` field has moved here.

You can refer to the [PaymentIntent](https://studio.apollographql.com/public/CometAPI/variant/main/schema/reference/objects/PaymentIntent) type in the schema for more details.
