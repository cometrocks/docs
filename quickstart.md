---
title: Publisher Quick Start
description: Set up a Comet publisher app and make your first authenticated API request.
---

# Publisher quick start

Use a publisher app to identify your server when it calls Comet. Each API also checks the access granted to that app.

## Set up your app

1. Sign in to the [Comet console](https://console.comet.rocks) for the environment you plan to use. Open your publisher organization from the account menu. If you need a publisher organization or membership, [contact Comet Support](/support).
2. Select an existing app in the sidebar. A publisher administrator can choose **Add new app** to create one.
3. On **Home → App credentials**, choose **Create API key** for a new app or **Reveal key** if the app already has a revealable key. Copy it to your server's secret storage and hide it in the console.
4. Share the **App client ID** with your Comet contact when requesting access. Keep the API key on your server.

See [Publisher apps](/resources/apps) for credential permissions and troubleshooting.

## Choose your API

- **Creator pages.** Ask Comet for the API origin, partner ID, creator onboarding method and grant for your environment. Then follow the [Creator Publishing setup](/resources/creator-publishing/overview) to call `GET /capabilities` for a verified creator.
- **Catalog and checkout.** Confirm which brand catalog your publisher app can use and obtain its organization ID. Then send the GraphQL request below.

## Query an authorized catalog

```bash
curl --fail-with-body 'https://api.comet.rocks/graphql' \
  -H "x-api-key: ${COMET_API_KEY}" \
  -H 'Content-Type: application/json' \
  --data '{"query":"query GetProducts($organizationId: ID!) { productFind(organizationId: $organizationId, pagination: { first: 10 }) { nodes { id name { default { text } } } pageInfo { hasNextPage endCursor } } }","variables":{"organizationId":"YOUR_BRAND_ORGANIZATION_ID"}}'
```

This example uses the production GraphQL endpoint. Use your environment's endpoint with a key from the same environment. Check the response's `errors` field even if the HTTP status is 200.

Continue with [product search](/resources/catalog/prod_search) or the [checkout tutorial](/tutorial). To connect a merchant's shop system, use the [Merchant Guides](/merchant/shopify).
