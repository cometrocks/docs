---
title: 'Creator Publishing'
description: 'Set up server-to-server access to edit and publish pages for verified creators.'
---

# Creator Publishing

Creator Publishing is a REST API for publishers that let creators manage pages from their own application. Your application signs in the creator and authorizes each action. Comet checks the creator's current grant and manages drafts, published revisions, media and public URLs.

Use the [Publisher GraphQL API](/quickstart#query-an-authorized-catalog) for connected merchant catalogs and cart checkout.

## Get access

1. Set up a [publisher app](/resources/apps) in the intended environment. Send Comet your App client ID to request creator publishing access.
2. Confirm your API origin, partner ID, onboarding method, available capabilities and public hosting setup with Comet. Keep separate credentials and creator mappings for each environment.
3. Use a stable external creator ID from your authenticated workspace. Comet scopes access to the verified creator relationship, partner, environment and current grant.

For a pre-provisioned creator relationship, bind the creator with the [bind endpoint](/resources/creator-publishing/api#endpoints) if your grant includes `creator:bind`. If Comet has enabled enrollment for your integration, follow the onboarding instructions it provides. Enrollment uses a separate server credential. Store the creator mapping and grant generation returned by enrollment and use the authoring key for page requests.

## Discover capabilities

Use the creator-specific path for authoring. From your server:

```bash
curl --fail-with-body \
  "${COMET_PUBLISHING_ORIGIN}/v1/partners/${PARTNER_ID}/creators/${EXTERNAL_CREATOR_ID}/capabilities" \
  -H "x-api-key: ${COMET_PUBLISHING_API_KEY}" \
  -H "x-grant-generation: ${GRANT_GENERATION}"
```

Use the returned capabilities, grant expiry, and content descriptors to decide which controls to show. Version 1 supports Header and Links. For new pages, use the preferred content version advertised by the API. Confirm optional features such as uploads and form submissions in the response for your environment.

## Publish a page

Create or save a draft, preview that exact version, and publish it with the version checks and digest returned by Comet. Include a unique `Idempotency-Key` on each write. When a request times out, retry with the same key and payload.

Read the page after publication to get its `publicUrl`. A public URL requires an active host and route for the creator. A null URL indicates that the page currently has no public URL.

See the [API reference](/resources/creator-publishing/api) for the authoring workflow and [Media uploads](/resources/creator-publishing/media) for the creator asset library.
