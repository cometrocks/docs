---
title: 'Creator Publishing MCP Pilot'
description: 'Set up the invite-only Creator Publishing MCP with your publisher app and verify a creator storefront from draft to public URL.'
---

# Creator Publishing MCP pilot

The Creator Publishing MCP lets an invited publisher draft, preview and publish pages for one verified creator. It runs locally over standard input and output (stdio) in a compatible MCP client. The [Creator Publishing REST API](/resources/creator-publishing/api) checks the publisher app, environment, creator binding and current grant on each request.

This pilot covers creator storefront pages. For connected merchant catalogs and checkout, use the [Publisher GraphQL API](/quickstart#query-an-authorized-catalog). For merchant Checkout Store setup, see the [Checkout Store tutorial](/tutorial).

## Request access

1. Ask your publisher administrator to create a dedicated [publisher app](/resources/apps) in the pilot environment. Create its API key under **App credentials** and store it in your secret manager.
2. Contact [Comet Support](/support) to request an invitation. Share your App client ID, intended environment and test use case. Keep the API key in your secret manager.
3. Complete creator verification and binding with Comet. Confirm the API origin, partner ID, external creator ID and current grant generation for the pilot. Your app's grant needs **page:read**, **page:edit** and **page:publish**.
4. Agree on a disposable test page, public host and route, and cleanup before publishing.

## Install and configure

Use Node.js 22 or newer and a trusted MCP client that supports local stdio servers and form elicitation. Run it on a machine your organization controls. The approval form identifies the page ID, draft version and digest. Review the content from the preview tool before confirming.

Comet supplies a versioned archive privately to invited publishers. Verify it against the checksum provided with your invitation. In a dedicated directory, install the archive Comet supplied. The following command uses version 0.1.0 as an example.

```bash
npm install --ignore-scripts --no-audit --no-fund --offline --no-save ./comet-rocks-creator-publishing-mcp-0.1.0.tgz
```

Add a local stdio server in your MCP client. Use the absolute path to your Node executable as the command and the absolute path to `node_modules/@comet-rocks/creator-publishing-mcp/src/index.mjs` as its argument. Pass these settings to the server process.

| Setting | Value |
| --- | --- |
| `COMET_PUBLISHING_ORIGIN` | The bare HTTPS origin supplied by Comet, without a trailing slash or path. |
| `COMET_PUBLISHING_PARTNER_ID` | Your registered partner ID. |
| `COMET_PUBLISHING_EXTERNAL_CREATOR_ID` | The external ID of the bound test creator. |
| `COMET_PUBLISHING_GRANT_GENERATION` | The current grant generation supplied by Comet. |
| `COMET_PUBLISHING_API_KEY` | Your publisher app's API key, injected from your local secret manager. |

Inject the API key into the local process from your secret manager. Share test content only with an MCP client your organization trusts. Keep credentials out of tool arguments, chat and shared configuration. Restart the MCP server after changing its creator, credential or grant generation.

## Draft, preview and publish

1. Run `get_capabilities` and verify the grant and its expiry. Choose a supported content version. The [API example](/resources/creator-publishing/api#create-save-preview-and-publish) includes a minimal Header. Use a test marker and omit personal data.
2. Run `create_draft` with the content and a unique `idempotencyKey`. Keep the returned page ID and draft version. If you need to edit it, use `save_draft` with the current version and the complete replacement content.
3. Run `preview_draft` with the page ID and saved draft version. Review the saved content and readiness result. This tool returns content JSON. Use your publisher preview if you need to review the rendered layout. If the draft changes, preview the new version.
4. For a ready draft, run `publish_page` with the review ID and confirm the client form after reviewing the draft. Record the publication version and active revision.
5. Run `get_page` and verify that its current publication version and active revision match the receipt. Open its `publicUrl` in a signed-out browser and verify the test marker. If the URL is null, ask Comet to verify the public hosting and route before calling the rehearsal complete.

## Recover from an interrupted call

For an uncertain create or save, retry the same input with the same idempotency key. For an uncertain publish, read the page to check whether it went live. If you need to retry while the review is active, use the same review ID and confirm again. A review expires after 30 minutes or when the local server restarts. After expiry, reconcile the current publication state before previewing again.

Share the result with Comet using the page ID, draft and publication versions, active revision and verified test URL. Keep keys and creator data out of the report. Follow the cleanup agreed for the rehearsal.
