---
title: 'Authentication & Authorization'
description: 'Authenticate to Comet GraphQL with API keys or JWT tokens, and understand the separate creator-publishing REST credentials.'
---

For catalog, cart, and checkout, Comet's GraphQL API supports API keys and JWT tokens. Send GraphQL requests to `https://api.comet.rocks/graphql` (also shown in the dashboard under Apps).

### GraphQL API keys

API keys are a simple and effective way to authenticate requests. You can pass the API key as a header on each request:

```bash
x-api-key: YOUR_API_KEY
```

You can mint an API key in the dashboard (Apps → Create App → the key is shown once), or programmatically with the `appClientGenerate(organizationId, input)` mutation, which also returns the key once at creation time.

### GraphQL JWT tokens

For longer GraphQL sessions, exchange an API key for a JWT using the GraphQL-only `tokenCreate` mutation:

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

These examples document direct GraphQL access. Agent and application integrations may have their own authorization flow; do not infer their rollout status or credentials from this page.

## Creator-publishing REST authorization

Creator publishing is a separate, default-disabled REST integration for approved server-to-server clients. It requires an existing IAM `APP_CLIENT` API key in `x-api-key` and the operator-provisioned grant generation in `x-grant-generation`. Write requests also require `Idempotency-Key`.

Do not send a GraphQL `Authorization: Bearer` JWT to these REST routes: JWTs are not accepted there. The browser must not receive the service API key or grant generation. The integration server holds those values and obtains a scoped grant for the creator, partner, and environment.

Read the [Creator Publishing overview](/resources/creator-publishing/overview) before integrating.
