---
title: 'Klyfton Integration'
description: 'How Klyfton uses its existing Rust backend as the creator-publishing BFF.'
---

# Klyfton Integration

## Architecture

Klyfton integrates Creator Publishing through its **existing Rust backend**, which has been extended with BFF endpoints and an OpenAPI surface. It is not a separate Klyfton publishing service.

Klyfton authenticates the human creator and checks current workspace membership in its backend. Its server then calls Comet with the service API key and grant generation. The browser uses Klyfton's authenticated workspace routes and never receives Comet credentials, grant values, or a Comet REST bearer token.

```
Klyfton browser → Klyfton Rust BFF → Comet Creator Publishing REST API
```

Both the Klyfton integration and Comet routes default to disabled. The merged work does not mean an environment has been activated or a grant has been provisioned. Public URLs require a separately provisioned Comet host and route, an active published revision, and the current creator activation.

## Responsibilities

| Component | Responsibility |
| --- | --- |
| Klyfton browser | Creator editing experience and Klyfton-authenticated workspace requests. |
| Klyfton Rust backend | Human authentication, membership and capability checks, server-held Comet credentials, command retry handling, and BFF OpenAPI endpoints. |
| Comet | Page persistence, exact version checks, immutable revisions, content validation, idempotency, and publication/lifecycle events. |

Klyfton does not maintain a second authority for Comet page content. A timeout has an unknown outcome; retry the same command and idempotency key after Klyfton rechecks local membership and Comet rechecks its scoped grant.

## Supported authoring

The merged Klyfton integration now mounts Comet's shared Vue section editor inside the existing React dashboard. New pages use v2 when Comet advertises it as the preferred supported version. Existing v1 Header/Links pages stay v1 until the creator explicitly chooses Upgrade; the upgrade preserves stable section IDs, order, locale content and visibility.

Creating a page opens an explicit draft directly in section details. Creators move between the section list, section details and Design settings alongside a persistent preview. Section additions, visibility, reordering, removal and Undo/Redo use the same autosave and recovery flow. Draft/Published comparison and confirmed whole-page deletion are available. Only an acknowledgement of the exact saved version/digest enables publication; a local live preview does not.

The v2 palette includes Creator Hero, Links, Content, Media, Accordions, Testimonials, Banner and legacy Header. Controls are filtered by current capabilities. Campaign variant data is preserved, while its controls remain hidden until public routing supports campaign attribution. This is content editing; it does not introduce digital-product, checkout, fan-authentication or signup-delivery capabilities.

The media picker supports creator-scoped Upload, Library and a hosted-link fallback. JPEG/PNG/WebP images are limited to 5 MiB; MP4/WebM videos to 20 MiB when advertised. See [Media uploads](/resources/creator-publishing/media) for request limits, retries and setup.

Klyfton's browser routes begin at `/v1/creator-publishing/workspaces`. They are Klyfton BFF routes, separate from Comet's partner/creator REST paths. Refer to Klyfton's generated OpenAPI document for its browser-facing request and response details.

- [Comet authoring OpenAPI](/openapi/creator-publishing.json): the contract Klyfton's server calls.
- [Klyfton OpenAPI](https://github.com/SafariShow/Klyfton-Creator-FinOS/blob/main/docs/api/openapi.json): the existing API specification extended by the integration; select the `creator-publishing` tag. Repository access is required.
- [Klyfton setup runbook](https://github.com/SafariShow/Klyfton-Creator-FinOS/blob/main/docs/architecture/creator-publishing.md): workspace mapping, memberships, server configuration and local rehearsal. Repository access is required.
- [Shared editor runbook](https://github.com/SafariShow/Klyfton-Creator-FinOS/blob/0c52fe8b6dffbb03be534433a1e08e5e0e29c781/docs/plan/cp03/CONTENT-EDITOR.md): editor synchronization and rollout. Repository access is required.

On an authorized page read, Klyfton may expose Comet's validated `publicUrl` descriptor. It is null when the page is unpublished or public routing has not been provisioned, and it is not evidence that hosting is generally unavailable.

## Operator setup

An operator must provision the Klyfton workspace mapping and membership, and separately arrange an existing verified Comet creator relationship and scoped Comet grant. Browser input cannot select the Comet environment, partner, external creator, service principal, or grant generation.

The integration is enabled only through reviewed server configuration. Production uses a mounted secret file for the Comet API key; neither the key nor the configuration values are returned to the browser or logged. Do not treat local rehearsal fixtures as production configuration or live IAM proof.

Roll out matching Comet content/capability support and preview/public renderer before enabling the corresponding Klyfton editor controls. Vendored editor artifacts have their own recorded source revision and hashes; retain that provenance rather than relabeling them with a repository's newer integration head. This guide was checked against Klyfton `0c52fe8b6dffbb03be534433a1e08e5e0e29c781` on 2026-09-24; implementation status does not prove live rollout.

## Signups

Klyfton Inner Circle signup delivery is not available. No Comet-to-Klyfton signup webhook, receiver, or retry/dead-letter delivery path is implemented yet.
