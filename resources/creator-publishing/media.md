---
title: 'Creator Media Uploads'
description: 'Upload and select creator-scoped images and videos through the Comet partner API.'
---

# Creator media uploads

Creators can upload images and videos and reuse their previous uploads through the same authorized integration server. Comet hosts the uploaded assets. Page publication and media storage are separate operations.

The paths below extend the [Creator Publishing base path and headers](/resources/creator-publishing/api#authentication-and-scope). The [OpenAPI specification](/openapi/creator-publishing.json) contains the complete schemas. These endpoints require an active creator binding and media support in your environment.

## Discover support

Read the optional `media` object from `GET /capabilities`:

```json
{
  "enabled": true,
  "upload": true,
  "maxBytes": 5242880,
  "maxVideoBytes": 20971520,
  "mimeTypes": ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"]
}
```

This is an illustrative descriptor. `enabled` reflects current provider configuration; `upload` additionally requires `page:edit`. `maxBytes` is the decoded image limit. Offer video uploads only when the backend advertises both `maxVideoBytes` and the matching MIME type. Older backends may omit video support or the whole media descriptor. Preserve the supported public-HTTPS-link fallback in those cases.

## Upload

POST `/media` with `page:edit`, the normal service headers and a stable `Idempotency-Key`. The JSON body has exactly four fields:

```json
{
  "schemaVersion": 1,
  "fileName": "portrait.png",
  "mimeType": "image/png",
  "dataBase64": "<canonical base64 of the file bytes>"
}
```

Replace the placeholder with actual file data. Do not include a `data:` prefix or whitespace. The filename must be nonblank, at most 180 Unicode code points, and contain no slash, backslash or control characters.

| Files | MIME types | Maximum decoded size |
| --- | --- | --- |
| Images | JPEG, PNG, WebP | 5 MiB (5,242,880 bytes) |
| Videos | MP4, WebM | 20 MiB (20,971,520 bytes) |

Comet checks canonical base64, decoded size and matching container signatures before asking the media provider to validate the stream. This route alone accepts up to **28 MiB (29,360,128 bytes) of JSON**. All ordinary page commands retain their 256 KiB limit. This is a bounded JSON proxy upload, not a multipart, signed-direct or resumable upload protocol.

Successful uploads return **201** with `{schemaVersion:1, asset}`. Asset fields are `id`, `publicId`, `url`, `thumbnailUrl`, `fileName`, `mimeType`, `width`, `height`, `bytes` and ISO `createdAt`. Use `mimeType` to distinguish video; video thumbnails are JPEG posters. Only finalized assets are returned or listed.

Uploading does not insert an asset into page content or publish a page. Selection and the normal save/preview/publish flow remain explicit. Cancelling insertion can leave the asset available in the creator's library.

## List previous uploads

GET `/media?limit=24` requires `page:read`. It returns **200** with `{schemaVersion:1, items:[asset], nextCursor}`. `limit` ranges from 1 to 100. Pass the exact `nextCursor` as `cursor` on the next request; null means the end. Media pagination uses `cursor`, while page listing uses `after`.

Assets sort by newest ready timestamp, with descending upload ID as the tiebreaker. The library contains only ready uploads belonging to the current creator binding. It does not expose legacy organization-wide assets or another creator's uploads.

## Delete an uploaded asset

Send `DELETE /media/{assetId}` with `page:edit` and an `Idempotency-Key`. Use the asset's `id` from the library. The response is `{schemaVersion:1, assetId, deleted:true}`.

Remove references from drafts and published pages before deleting the asset. Deletion removes the hosted asset and can break pages that still reference its URL. If deletion is in progress, wait and retry with the same key.

## Retry and cancellation

Keep the original filename, MIME type, bytes and idempotency key while an upload outcome is unknown. A duplicate key with another payload returns `409 IDEMPOTENCY_CONFLICT`. `409 UPLOAD_IN_PROGRESS` means an existing attempt owns the lease: retry the same command after the lease can expire, rather than submitting a new key. Image leases last 60 seconds; video leases last 150 seconds.

`503 MEDIA_UNAVAILABLE` covers missing provider configuration, provider failure or an unverifiable response. `413 PAYLOAD_TOO_LARGE` covers encoded/decoded size limits. No provider credentials or diagnostics are returned to the browser.

Aborting a browser request stops waiting; it cannot guarantee that the provider upload was undone. Comet uses a stable provider ID to reconcile lost responses and rechecks current creator authority before finalizing or replaying a ready asset. Do not delete assets to compensate for an uncertain result.
