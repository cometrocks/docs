---
title: 'Creator Publishing API Reference'
description: 'Versioned content, request and response schemas, authorization, and publication lifecycle for the Comet partner REST API.'
---

# Creator Publishing API reference

[Download OpenAPI 3.1](/openapi/creator-publishing.json). Import this document into an OpenAPI-compatible client or viewer. It describes the **Comet server-to-server authoring API**, including content versions 1 and 2. Klyfton's browser-facing API has its own [integration guide](/resources/creator-publishing/klyfton).

This reference is checked against backend revision `26c866375c33ff496b652fa672cc8eba71360657` on 2026-09-23. The API defaults disabled. Obtain the approved environment origin and scoped access from Comet before making requests; the OpenAPI server is a reserved placeholder, not a live deployment. Public-renderer reader endpoints and operator commands are separate from this authoring specification.

## Authentication and scope

Base path, appended to your approved Comet origin:

```text
/v1/partners/{partnerId}/creators/{externalCreatorId}
```

| Header | When | Value |
| --- | --- | --- |
| `x-api-key` | Every authoring/event request | Server-held IAM `APP_CLIENT` key. |
| `x-grant-generation` | Every authoring/event request | Current operator-provisioned grant generation. |
| `Idempotency-Key` | Every PUT/POST | Unique command key, 1–128 ASCII letters, digits, underscores or hyphens. |
| `Content-Type: application/json` | Requests with a JSON body | Bodies are limited to 256 KiB. |

Do not send an `Authorization` header: these routes reject it, including GraphQL JWTs. App authentication alone does not grant access. Comet checks the current grant's principal, environment, partner, creator relationship, generation, expiry and required capability on each request, including retries. The environment comes from server configuration.

Grant provisioning and creator onboarding are operator prerequisites. `PUT` on the base path materializes an already verified relationship; it does not create an app, grant or global creator identity. Capability discovery can run before binding. Page operations require an active binding.

## Endpoints

All paths below are relative to the base path. GET and PUT return **200** on success; POST returns **201**, including successful idempotent replays. Responses use `Cache-Control: no-store`.

| Method | Path | Capability | Result |
| --- | --- | --- | --- |
| PUT | Base path | `creator:bind` | `{schemaVersion, realm, creatorId, identityId}`; no request body needed. |
| GET | `/capabilities` | `page:read` | Current grant and supported content descriptors. |
| GET | `/pages?after=…&limit=20` | `page:read` | `{schemaVersion, pages, nextCursor}`. |
| POST | `/pages` | `page:edit` | New draft from `{content}`. |
| GET | `/pages/{pageId}` | `page:read` | Current draft, versions, digest and `publicUrl`. |
| PUT | `/pages/{pageId}` | `page:edit` | Updated draft from `{expectedDraftVersion, content}`. |
| GET | `/pages/{pageId}/preview?draftVersion=N` | `page:read` | Exact current saved draft and digest; stale versions conflict. |
| POST | `/pages/{pageId}/publish` | `page:publish` | Publication receipt for the exact reviewed draft. |
| POST | `/pages/{pageId}/unpublish` | `page:publish` | Receipt after clearing the active publication. |
| GET | `/pages/{pageId}/revisions/{revisionId}` | `page:read` | Immutable content only while that revision remains current. |
| GET | `/events?after=0` | `events:read` | Raw array of up to 100 durable realm events. |

Page listing accepts `limit` from 1 to 100. Pass `nextCursor` as the next `after`; null means the end. Page IDs sort lexicographically, not by creation time. Concurrent insertions before an existing cursor require starting a fresh listing. Each summary contains `pageId`, `draftVersion`, `publicationVersion` and `activeRevision`.

## Content versions

The outer API response stays `schemaVersion: 1`. The nested **content** has its own `schemaVersion`.

`GET /capabilities` returns:

- `grant`: current generation, expiry and allowed operations.
- `content`: the original v1 Header/Links descriptor for compatibility.
- `contentVersions`: descriptors for v1 and v2. The v2 descriptor includes structural `jsonSchema`.
- `preferredContentVersion: 2`.

**Version 1** preserves `{schemaVersion: 1, sections}` with basic Header and Links. It allows up to 30 sections, 50 links per section, 10 locales, 500 UTF-16 code units per text field, and 2,048 per URL. Section and link-row IDs must be unique in their respective lists. Unsupported fields are rejected.

**Version 2** uses `{schemaVersion: 2, settings, sections}`. It supports Creator Hero, Links, Content, Media, Accordions, Testimonials, Banner and legacy Header. Theme settings are stored in the same immutable content and digest. Icons, canonical media metadata and bounded rich text use the shared content contract. Commerce, signup capture, merchant references, analytics and arbitrary custom HTML remain outside this contract.

Use the [v2 JSON Schema](/openapi/creator-publishing-content-v2.schema.json) and [complete example document](/openapi/creator-publishing-content-v2.example.json), extracted from the backend's generated shared contract. Wrap the example as `{"content": ...}` when creating a page. Structural schemas do not represent every server check: unique IDs, selected-palette consistency, markup safety, public HTTPS media URLs, depth and UTF-16 length limits, and publication readiness are also enforced. Validate against the current server; do not assume that passing a generic JSON Schema validator means content can be published.

Draft link URLs may be incomplete. Visible links must resolve safely to HTTPS when publishing. V2 also checks visible social links and enabled countdown datetimes at publication; media URL safety is checked when parsing the draft. Authored strings remain unchanged.

## Create, save, preview and publish

For a minimal backward-compatible example, POST `/pages` with:

```json
{
  "content": {
    "schemaVersion": 1,
    "sections": [
      {
        "id": "header-one",
        "type": "header",
        "showSection": true,
        "layout": "center",
        "titleLocales": { "en": "My page" },
        "subtitleLocales": { "en": "Welcome" }
      }
    ]
  }
}
```

The response contains `schemaVersion`, `pageId`, `draftVersion: 1`, `publicationVersion: 0`, `activeRevision: null`, `content` and a 64-character lowercase hexadecimal `digest`. Save with the last observed `expectedDraftVersion` and the complete replacement `content`. A successful save increments `draftVersion` without changing the active publication.

Request `/preview?draftVersion=N` for the exact saved version. The response supplies content and digest; it is not rendered HTML or a public URL. The editor must render that exact content before offering publication. Editing after preview requires saving and previewing again.

POST `/publish` with all values from the reviewed saved state:

```json
{
  "expectedDraftVersion": 1,
  "expectedActiveRevision": null,
  "expectedPublicationVersion": 0,
  "digest": "<copy the exact 64-character digest from the preview response>"
}
```

The digest text above is a placeholder and must be replaced. Use the server-returned digest instead of hashing differently in a client. Its algorithm recursively sorts object keys using JavaScript `localeCompare` with `en-US`, preserves array order and SHA-256 hashes UTF-8 JSON. A generic alphabetical sort may not produce the same digest.

Publication returns `schemaVersion`, `pageId`, `draftVersion`, the incremented `publicationVersion`, `activeRevision`, `eventId` and realm-local `sequence`. This receipt does not contain content, digest or public URL. GET the page again for current state and `publicUrl`.

POST `/unpublish` with `expectedDraftVersion`, `expectedActiveRevision` and `expectedPublicationVersion` from current state; omit `digest`. It clears the active revision and increments the publication version while retaining immutable history. The separate publication version prevents an old command from succeeding after a publish/unpublish cycle.

## Public URLs

Only the authorized **GET page** response includes `publicUrl`. It is a canonical HTTPS URL or null. Creation, save, preview, publication receipts and page lists do not include it. A URL requires an active operator-registered host/route and an eligible current publication under the creator's current activation. Reread after mutations instead of treating an idempotently replayed receipt as current state.

Public visitors use the configured public renderer. Its server uses a separate host-registered reader credential; browsers never receive an authoring key. A successful publish does not register a domain. Previously returned revision IDs and URLs do not bypass current public authorization or unpublication.

## Retries and conflicts

An idempotency key is scoped to the authenticated principal, creator realm, operation and page. Repeating a committed command with the same key and payload returns its saved result after current authorization is checked. Reusing the key with another payload returns `409 IDEMPOTENCY_CONFLICT`.

A timeout means the result is unknown. Retry the original payload and key; do not create a new command until its outcome is resolved. On a version conflict, preserve local edits, read current state and deliberately reconcile before submitting a new command/key. A historical receipt is evidence of that command, not a current page snapshot.

## Errors

Application errors use `{"schemaVersion":1,"code":"VERSION_CONFLICT"}`. Ingress and JSON-body-parser failures may have a different envelope; handle the HTTP status as well.

| Status | Typical codes | Action |
| --- | --- | --- |
| 400 | `INVALID_INPUT`, `UNSUPPORTED_SECTION`, `INVALID_CREATOR_BINDING` | Correct the request or complete verified onboarding. |
| 401 | `UNAUTHENTICATED` | Check the app credential and remove unsupported Authorization headers. |
| 403 | `FORBIDDEN` | Check the current scoped grant and creator authority. |
| 404 | `NOT_FOUND` | Resource is absent or unavailable within this scope. |
| 409 | `VERSION_CONFLICT`, `PREVIEW_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `BINDING_CONFLICT` | Reconcile current state or resolve command identity. |
| 413 | `PAYLOAD_TOO_LARGE` | Reduce the request below 256 KiB. |
| 422 | `CONTENT_NOT_READY` | Correct publication readiness, then save and preview again. |
| 503 | `FEATURE_DISABLED`, `AUTHORITY_UNAVAILABLE` | Confirm activation or wait for authority recovery; retain the original key for an uncertain write. |

## Publication and lifecycle events

`GET /events?after=N` returns a raw JSON array ordered by realm-local `sequence`. Each event contains `_id`, `schemaVersion`, `bindingId`, `sequence`, `eventType`, `occurredAt`, `realm`, `aggregateId`, `aggregateRevision`, `operationId` and `payload`.

Persist processed event IDs and the cursor atomically with the consumer's updates. Continue from the last processed sequence; there is no server acknowledgement route. A separate current `events:read` grant can retrieve terminal lifecycle events for a suspended/deleted creator without granting page access. Revoking the only event credential requires operator recovery.

These events concern publication and lifecycle. Signup webhook delivery is deferred and is not part of this API.
