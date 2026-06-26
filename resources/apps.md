---
title: 'Apps'
description: 'Integrate with Comet via Apps'
---

## Overview

Apps in Comet provide a seamless way to access the vast product catalog and utilize the robust checkout process. By integrating with Comet's GraphQL API, you can offer your customers a wide range of products without the overhead of managing inventory or handling the checkout process.

The Comet API is **GraphQL only** (Apollo Federation) — there is no public REST API. Your GraphQL endpoint is `https://api.comet.rocks/graphql` (also shown in the dashboard under Apps).

## Creating an App

1. **Sign Up**: Begin by creating your account on [Comet Console](https://console.comet.rocks/).

2. **Dashboard Navigation**: Once logged in, navigate to the 'Apps' section in the dashboard.

3. **Create New App**: Click on the 'Create App' button. Provide a name for your app and describe its purpose. This will help you identify the app later, especially if you have multiple integrations.

4. **API Key Generation**: After creating the app, Comet generates an API key for you. The key is shown **once** at creation time, so copy it somewhere safe — this API key is essential for integrating your application with Comet's GraphQL API.

5. **Manage App**: You can always return to the dashboard to manage your app or delete it.

::: tip
You can also mint API keys programmatically with the `appClientGenerate(organizationId, input)` GraphQL mutation, which returns the key once at creation time.
:::

## Integration

With the API key in hand, you can now integrate your application with Comet:

1. **Authentication**: Use the API key for authentication when making requests to Comet's GraphQL API. This ensures that your requests are secure and associated with your app.

2. **Fetch Products**: Access Comet’s vast product catalog and display them to your customers.

3. **Checkout Process**: Complete the checkout with multiple brands using single cart and single checkout process.

