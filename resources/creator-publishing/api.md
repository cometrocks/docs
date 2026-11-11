---
title: 'Creator Publishing API Reference'
description: 'Versioned content, request and response schemas, authorization, and publication lifecycle for the Comet partner REST API.'
---

# Creator Publishing API reference

[Download OpenAPI 3.1](/openapi/creator-publishing.json). Import this document into an OpenAPI-compatible client or viewer. It covers server-to-server page authoring, media and publication events. Replace the OpenAPI server placeholder with the origin Comet provided for your environment. See [Get access](/resources/creator-publishing/overview#get-access) for creator onboarding.

## Authentication and scope

Base path, appended to your approved Comet origin:

```text
/v1/partners/{partnerId}/creators/{externalCreatorId}
```

| Header | When | Value |
| --- | --- | --- |
| `x-api-key` | Every authoring/event request | Server-held IAM `APP_CLIENT` key. |
| `x-grant-generation` | Every authoring/event request | Current operator-provisioned grant generation. |
| `Idempotency-Key` | Every PUT/POST/DELETE | Unique command key, 1–128 ASCII letters, digits, underscores or hyphens. |
| `Content-Type: application/json` | Requests with a JSON body | Normally 256 KiB; POST `/media` alone permits 28 MiB JSON. |

Do not send an `Authorization` header: these routes reject it, including GraphQL JWTs. App authentication alone does not grant access. Comet checks the current grant's principal, environment, partner, creator relationship, generation, expiry and required capability on each request, including retries. Use the origin provisioned for your environment.

Comet provisions grants for verified creator relationships. Use `PUT` on the base path when your onboarding flow requires binding an already verified creator. Capability discovery can run before binding. Page and media operations require an active binding.

## Endpoints

All paths below are relative to the base path. GET, PUT and DELETE return **200** on success; POST returns **201**, including successful idempotent replays. Responses use `Cache-Control: no-store`.

| Method | Path | Capability | Result |
| --- | --- | --- | --- |
| PUT | Base path | `creator:bind` | `{schemaVersion, realm, creatorId, identityId}`; no request body needed. |
| GET | `/capabilities` | `page:read` or an enabled commerce read grant | Current grant and supported content descriptors. |
| GET | `/media?cursor=…&limit=24` | `page:read` | Ready creator assets: `{schemaVersion, items, nextCursor}`. |
| POST | `/media` | `page:edit` | Upload an image or video. |
| DELETE | `/media/{assetId}` | `page:edit` | Delete an uploaded asset. |
| GET | `/pages?after=…&limit=20` | `page:read` | `{schemaVersion, pages, nextCursor}`. |
| POST | `/pages` | `page:edit` | New draft from `{content}` with an optional management name. |
| GET | `/pages/{pageId}` | `page:read` | Current draft, versions, digest and `publicUrl`. |
| PUT | `/pages/{pageId}` | `page:edit` | Updated draft from `{expectedDraftVersion, content}`. |
| PUT | `/pages/{pageId}/name` | `page:edit` and `page:read` | Rename using `{expectedDraftVersion, name}`. |
| POST | `/pages/{pageId}/clone` | `page:edit` and `page:read` | Create an unpublished copy using `{expectedDraftVersion, name}`. |
| DELETE | `/pages/{pageId}` | `page:edit`; also `page:publish` when published | Tombstone the page after checking all expected versions. |
| GET | `/pages/{pageId}/readiness?draftVersion=N` | `page:read` | Readiness of the exact saved draft. |
| GET | `/pages/{pageId}/preview?draftVersion=N` | `page:read` | Exact current saved draft and digest; stale versions conflict. |
| POST | `/pages/{pageId}/publish` | `page:publish` | Publication receipt for the exact reviewed draft. |
| POST | `/pages/{pageId}/unpublish` | `page:publish` | Receipt after clearing the active publication. |
| GET | `/pages/{pageId}/revisions/{revisionId}` | `page:read` | Immutable content only while that revision remains current. |
| GET | `/events?after=0` | `events:read` | Raw array of up to 100 durable realm events. |

Page listing accepts `limit` from 1 to 100. Pass `nextCursor` as the next `after`; null means the end. Page IDs sort lexicographically, not by creation time. Concurrent insertions before an existing cursor require starting a fresh listing. Each summary contains `pageId`, `draftVersion`, `publicationVersion`, `activeRevision` and management fields including `name` and `publicationStatus`.

## Content versions

The outer API response stays `schemaVersion: 1`. The nested **content** has its own `schemaVersion`.

`GET /capabilities` returns:

- `grant`: current generation, expiry and allowed operations.
- `content`: the original v1 Header/Links descriptor for compatibility.
- `contentVersions`: descriptors for v1 and v2. The v2 descriptor includes structural `jsonSchema`.
- `preferredContentVersion` selects the server's preferred version for new content.
- `management` advertises name and clone access plus the name length limit.
- `media`: provider availability, upload permission, accepted MIME types and decoded image/video size limits. This additive descriptor may be absent on older backends; see [Media uploads](/resources/creator-publishing/media).

**Version 1** preserves `{schemaVersion: 1, sections}` with basic Header and Links. It allows up to 30 sections, 50 links per section, 10 locales, 500 UTF-16 code units per text field, and 2,048 per URL. Section and link-row IDs must be unique in their respective lists. Unsupported fields are rejected.

**Version 2** uses `{schemaVersion: 2, settings, sections}`. Use the advertised section types and v2 JSON Schema for the current content palette. Theme and audience settings are part of the saved content. Availability of product placements, posts and signup forms depends on the integration's capabilities and readiness. For forms, check `forms.publicationEnabled` in the v2 descriptor before offering publication of a visible capture form.

Use the [v2 JSON Schema](/openapi/creator-publishing-content-v2.schema.json) and [complete example document](/openapi/creator-publishing-content-v2.example.json), for the v2 content contract. Wrap the example as `{"content": ...}` when creating a page. Structural schemas do not represent every server check: unique IDs, selected-palette consistency, markup safety, public HTTPS media URLs, depth and UTF-16 length limits, and publication readiness are also enforced. Validate against the current server; do not assume that passing a generic JSON Schema validator means content can be published.

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

Request `GET /pages/{pageId}/preview?draftVersion=N` to retrieve the exact saved content and digest. Render that content for the creator's review. Use `GET /pages/{pageId}/readiness?draftVersion=N` to check `state` (`ready`, `blocked` or `unknown`) and any reason codes. If the draft changes, save, preview and check readiness again.

POST `/pages/{pageId}/publish` with all values from the reviewed saved state:

```json
{
  "expectedDraftVersion": 1,
  "expectedActiveRevision": null,
  "expectedPublicationVersion": 0,
  "digest": "<copy the exact 64-character digest from the preview response>"
}
```

The digest text above is a placeholder and must be replaced. Use the digest returned by Comet for the reviewed version.

Publication returns `schemaVersion`, `pageId`, `draftVersion`, the incremented `publicationVersion`, `activeRevision`, `eventId` and realm-local `sequence`. Current responses also include the management name, update time and publication status. This receipt does not contain content, digest or public URL. GET the page again for current state and `publicUrl`.

POST `/pages/{pageId}/unpublish` with `expectedDraftVersion`, `expectedActiveRevision` and `expectedPublicationVersion` from current state; omit `digest`. It clears the active revision and increments the publication version while retaining immutable history. The separate publication version prevents an old command from succeeding after a publish/unpublish cycle.

## Rename or clone a page

When the `management` descriptor allows it, send `name` and the current `expectedDraftVersion` to the name or clone endpoint. Names are trimmed, nonblank and limited to 120 UTF-16 code units. A rename updates the management name and increments the draft version. A clone starts at draft version 1 with no active publication, in the same creator scope.

## Delete a page

DELETE `/pages/{pageId}` with an `Idempotency-Key` and exactly these body fields from the latest reviewed state:

```json
{
  "expectedDraftVersion": 1,
  "expectedPublicationVersion": 0,
  "expectedActiveRevision": null
}
```

Deletion always requires `page:edit`. If the expected active revision is nonnull, it also requires `page:publish`. The server checks all three values against the current page; supplying a false null cannot bypass publication permission. Unlike unpublish, the delete body does not accept `digest`.

The 200 response is `{schemaVersion:1, pageId, deleted:true, publicationVersion}`. Comet increments the publication version, clears the active revision, persists a tombstone and emits `page.deleted`. The page disappears from page lists, authoring reads and public reads; retained revisions are no longer available through the current-revision endpoint. History and uploaded media remain. Deletion does not remove the creator workspace, and there is no restore endpoint.

After an unknown outcome, retry the identical key and body. Current permissions are rechecked even when returning a stored deletion receipt.

## Public URLs

Only the authorized **GET page** response includes `publicUrl`. It is a canonical HTTPS URL or null. Creation, save, preview, publication receipts and page lists do not include it. A URL requires an active host and route and an eligible current publication for the creator. Reread after mutations instead of treating an idempotently replayed receipt as current state.

Use the returned URL for visitors. Keep the authoring key on your server. Comet checks current publication and routing on each public read.

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
| 409 | `VERSION_CONFLICT`, `PREVIEW_CONFLICT`, `IDEMPOTENCY_CONFLICT`, `BINDING_CONFLICT`, `UPLOAD_IN_PROGRESS` | Reconcile current state. For `UPLOAD_IN_PROGRESS` or `DELETE_IN_PROGRESS`, wait and retry the same media command. |
| 413 | `PAYLOAD_TOO_LARGE` | Page commands: 256 KiB. Media: 5 MiB decoded images / 20 MiB videos, with a 28 MiB JSON ceiling. |
| 422 | `CONTENT_NOT_READY` | Correct publication readiness, then save and preview again. |
| 503 | `FEATURE_DISABLED`, `AUTHORITY_UNAVAILABLE`, `MEDIA_UNAVAILABLE` | Confirm activation/provider configuration or wait for recovery; retain the original key for an uncertain write. |

## Publication and lifecycle events

`GET /events?after=N` returns a raw JSON array ordered by realm-local `sequence`. Each event contains `_id`, `schemaVersion`, `bindingId`, `sequence`, `eventType`, `occurredAt`, `realm`, `aggregateId`, `aggregateRevision`, `operationId` and `payload`.

`page.deleted` uses the incremented publication version as `aggregateRevision`; its payload contains `draftVersion` and `previousRevisionId`. Treat it as removal from current page views, not as proof that retained history or media were erased.

Persist processed event IDs and the cursor atomically with the consumer's updates. Continue from the last processed sequence; there is no server acknowledgement route. A separate current `events:read` grant can retrieve terminal lifecycle events for a suspended/deleted creator without granting page access. Revoking the only event credential requires operator recovery.

These events concern publication and lifecycle. Use the publication and lifecycle feed for page state changes. Confirm signup delivery separately with Comet if your integration uses forms.
