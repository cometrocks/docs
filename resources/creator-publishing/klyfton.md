---
title: 'Klyfton Integration'
description: 'How Klyfton uses its existing Rust backend as the creator-publishing BFF.'
---

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

The implemented Klyfton editor supports basic Header and Links content: create, save, reload, preview an exact saved version, publish, edit, and unpublish. Comet's API capability discovery can advertise newer content contracts, but Klyfton must not silently discard or insert controls its editor does not support.

Klyfton's browser routes begin at `/v1/creator-publishing/workspaces`. They are Klyfton BFF routes, separate from Comet's partner/creator REST paths. Refer to Klyfton's generated OpenAPI document for its browser-facing request and response details.

- [Comet authoring OpenAPI](/openapi/creator-publishing.json): the contract Klyfton's server calls.
- [Klyfton OpenAPI](https://github.com/SafariShow/Klyfton-Creator-FinOS/blob/main/docs/api/openapi.json): the existing API specification extended by the integration; select the `creator-publishing` tag. Repository access is required.
- [Klyfton setup runbook](https://github.com/SafariShow/Klyfton-Creator-FinOS/blob/main/docs/architecture/creator-publishing.md): workspace mapping, memberships, server configuration and local rehearsal. Repository access is required.

On an authorized page read, Klyfton may expose Comet's validated `publicUrl` descriptor. It is null when the page is unpublished or public routing has not been provisioned, and it is not evidence that hosting is generally unavailable.

## Operator setup

An operator must provision the Klyfton workspace mapping and membership, and separately arrange an existing verified Comet creator relationship and scoped Comet grant. Browser input cannot select the Comet environment, partner, external creator, service principal, or grant generation.

The integration is enabled only through reviewed server configuration. Production uses a mounted secret file for the Comet API key; neither the key nor the configuration values are returned to the browser or logged. Do not treat local rehearsal fixtures as production configuration or live IAM proof.

## Signups

Klyfton Inner Circle signup delivery is not available. No Comet-to-Klyfton signup webhook, receiver, or retry/dead-letter delivery path is implemented yet.
