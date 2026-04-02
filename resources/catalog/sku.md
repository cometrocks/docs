---
title: '👕  Retrieve a Product by SKU'
description: 'Fetch detailed information about a specific product using its SKU in the Comet API.'
---

In the Comet API, the `productBySku` query allows you to retrieve detailed information about a specific product using its Stock Keeping Unit (SKU). SKUs are unique identifiers for products, making them essential for inventory management and product identification.

### Query

To retrieve a product by its SKU, use the `productBySku` query:

```graphql
query GetProductBySKU($shopSystemEnvironmentId: ID!, $sku: String!) {
  productBySku(shopSystemEnvironmentId: $shopSystemEnvironmentId, sku: $sku) {
    id
    sku
    name
    description
    # Other product fields as needed
  }
}
```

Replace `$shopSystemEnvironmentId` and `$sku` with the appropriate values for your search.

### Parameters

- **shopSystemEnvironmentId**: The unique identifier for the shop system environment. This helps in narrowing down the search to products associated with a specific shop system.
- **sku**: The Stock Keeping Unit (SKU) of the product you wish to retrieve.

### Product Details

The `productBySku` query returns detailed information about the product:

- **Basic Information**: This includes the product's ID, SKU, name, and description.
- **Organization and Shop System**: Details about the organization and shop system associated with the product.
- **Variants and Attributes**: Information about the product's variants and their attributes.
- **Pricing**: The prices associated with the product.
- **Images**: Both original and public images of the product.
- **Tags and Metadata**: Any tags associated with the product and additional metadata.

For a more detailed breakdown of the `Product` type and its associated fields, refer to the [Product Schema Documentation](https://studio.apollographql.com/public/CometAPI/variant/main/schema/reference/objects/Product).
