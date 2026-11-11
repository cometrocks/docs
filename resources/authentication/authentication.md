---
title: 'Authentication & Authorization'
description: 'Authenticate GraphQL and Creator Publishing requests from your server.'
---

# Authentication and authorization

## GraphQL API key

Send the key for your [publisher app](/resources/apps) in the `x-api-key` header. The production GraphQL endpoint is `https://api.comet.rocks/graphql`. Keep your key in server-side secret storage and use the endpoint for the environment that issued it.

```http
x-api-key: YOUR_API_KEY
```

Authentication identifies the app. Confirm that it has access to the catalog and operations you intend to call.

## GraphQL bearer token

Your server can use the GraphQL `tokenCreate` mutation to exchange an API key for a bearer token. Use the returned `expiresIn` value in seconds to track expiration.

```graphql
mutation CreateAccessToken($apiKey: String!) {
  tokenCreate(input: { authType: API_KEY, auth: { apiKey: $apiKey } }) {
    accessToken
    expiresIn
  }
}
```

Send the token on subsequent GraphQL requests as `Authorization: Bearer YOUR_ACCESS_TOKEN`. Treat it as a credential carrying the app's authority.

## Creator Publishing REST

The [Creator Publishing API](/resources/creator-publishing/overview) requires the server-held `x-api-key` and the current creator grant generation in `x-grant-generation`. Send `Idempotency-Key` on writes. Omit the `Authorization` header on these requests.

Use the origin, partner ID, creator identifier and grant provisioned for your integration. Keep credentials and grant values on your server and authorize each creator action in your application before calling Comet.
