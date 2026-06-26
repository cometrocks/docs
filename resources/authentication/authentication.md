---
title: 'Authentication & Authorization'
description: 'Securely access Comet API resources using API keys or JWT tokens, ensuring both authentication and authorization.'
---

In the Comet API, ensuring secure access to resources is of utmost importance. The API provides mechanisms for both authentication and authorization using API keys and JWT tokens. All requests go to your GraphQL endpoint, `https://api.comet.rocks/graphql` (also shown in the dashboard under Apps).

### Using API Keys

API keys are a simple and effective way to authenticate requests. You can pass the API key as a header on each request:

```bash
x-api-key: YOUR_API_KEY
```

You can mint an API key in the dashboard (Apps → Create App → the key is shown once), or programmatically with the `appClientGenerate(organizationId, input)` mutation, which also returns the key once at creation time.

### JWT Tokens

For more extended sessions or scenarios where you don't want to send the API key with every request, you can opt for JWT tokens. First, request a token using the `tokenCreate` mutation:

```graphql
mutation {
	tokenCreate(input: { authType: API_KEY, auth: { apiKey: "YOUR_API_KEY" } }) {
		accessToken
		expiresIn
	}
}
```

The returned `accessToken` is an RSA-signed JWT and expires in 12 hours (`expiresIn` is the lifetime in seconds). Include it in subsequent requests in the `Authorization` header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

::: info
A device-code / MCP "agent" authorization flow is **Coming soon** — it is not shipped yet. For now, use API keys or `tokenCreate` JWTs.
:::

