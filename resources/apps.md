---
title: 'Publisher Apps'
description: 'Create a publisher app, manage its API key, and request access to Comet APIs.'
---

# Publisher apps

A publisher app represents your server integration in Comet. It belongs to one publisher organization and has an app ID. Its API credential has a separate **App client ID**, which Comet uses when granting access.

## Create and select an app

In the [Comet console](https://console.comet.rocks), switch to your publisher organization. Select an app in the sidebar or have a publisher administrator choose **Add new app**. Contact [Comet Support](/support) to request a publisher organization or membership.

## Manage the API key

Open **App credentials** on **Home** or **Publisher integration** for the selected app. With permission to manage credentials, you can:

- Select **Create API key** when the app has no credential.
- Select **Reveal key** to retrieve an existing revealable API key.
- Use **Copy key** to move the key to your server's secret storage, then select **Hide key**.

Creating a credential preserves an existing key. If creation times out, refresh the credential status before trying again. Contact Support for help with incompatible credentials or key rotation. Share the **App client ID** when requesting access and keep the key confidential.

## Request API access

For [GraphQL catalog and checkout](/quickstart#query-an-authorized-catalog), confirm the brands and operations authorized for your app. For [Creator Publishing](/resources/creator-publishing/overview), ask Comet to provision your integration and confirm the creator grant, origin and environment. Keys and access are specific to the environment where they were issued.
