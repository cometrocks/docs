---
title: 'Creator Publishing'
description: 'A scoped, server-to-server REST API for creator page editing and publishing.'
---

## Availability and scope

Creator Publishing is a separate REST interface for approved integrations that edit and publish creator pages. It is **default-disabled**; these docs do not establish live environment activation. Activation requires reviewed operator provisioning, verified IAM app ownership, a replica-set data environment, and the required server configuration. Public hosting additionally requires verified host ownership and registered routes.

The content contract has two versions. Version 1 supports the original canonical **Header** and **Links** sections and remains backward compatible. Version 2 is the preferred contract and adds a canonical palette of Creator Hero, Links, Content, Media, Accordions, Testimonials, Banner, and legacy Header sections, plus snapshotted theme settings. Read `GET /capabilities` and use its content-version descriptors rather than assuming editor support.

Creator Publishing includes an independently authorized public reader and route model, but this does not by itself activate a domain or make pages live. A public URL is available only after a host and route are operator-provisioned and the page is published under the creator's current activation.

Comet's established GraphQL API remains the interface for catalog, cart, and checkout. Creator Publishing adds REST page authoring; it does not replace those GraphQL operations.

## Integration boundary

An integration server calls Comet at:

```
/v1/partners/{partnerId}/creators/{externalCreatorId}
```

Comet owns page drafts, draft and publication version checks, immutable published revisions, idempotency records, and durable publication/lifecycle events. The authoring revision endpoint is authenticated origin access; public reads use the separately authorized public-reader boundary.

Every authoring/event request requires these headers:

- `x-api-key`: an existing IAM `APP_CLIENT` API key held by the integration server.
- `x-grant-generation`: the generation for the operator-provisioned, scoped grant.
- `Idempotency-Key`: required for write requests. Retry an ambiguous write with its original key and payload.

GraphQL JWT bearer tokens are not accepted by the Creator Publishing REST API. Do not expose the service API key or grant generation in a browser application. A verified creator binding and a current grant scoped to the partner, creator, and environment are also required.

## Read the API contract

See the [API reference](/resources/creator-publishing/api) for routes, payloads, version checks, errors, and the supported content descriptor. You can also [download the OpenAPI document](/openapi/creator-publishing.json).

For the Klyfton server integration, workspace authorization, and browser boundary, see [Klyfton Integration](/resources/creator-publishing/klyfton).

## Signup delivery

Creator signup delivery to Klyfton Inner Circle is unavailable. The current publication/lifecycle event polling does not provide signup webhooks or a delivery receiver. That work is deferred pending a versioned delivery contract and implementation on both sides.
