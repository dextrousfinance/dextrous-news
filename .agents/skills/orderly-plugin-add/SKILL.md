---
name: orderly-plugin-add
description: Add / integrate / register an Orderly plugin into an Orderly SDK DEX host app. Use when the user wants to install an Orderly plugin, wire a plugin into OrderlyAppProvider, or connect a local plugin package. Triggers on "add Orderly plugin", "install Orderly plugin", "integrate Orderly plugin".
---

# Orderly plugin — add to DEX host

Integrate an **existing plugin package** into an Orderly DEX / trading application.

## Key points

> **The most important step**: Find where `OrderlyAppProvider` is used in the project, and add the plugin to its `plugins` array. This is the core of the integration; all other steps revolve around this goal.

## When to use

- User wants to add / register / enable a plugin in their host repo.
- User points to a plugin ID (from Marketplace) or a local path/workspace package that exports `registerXxxPlugin()`.

## Prerequisites

- Host app uses `@orderly.network/app` (or equivalent) with **`OrderlyAppProvider`**.
- Plugin package builds and lists `@orderly.network/plugin-core` (and peers) per its template.

### 0. Verify Environment

- [ ] Project has `@orderly.network/app` installed
- [ ] pnpm workspace configured (if local development)
- [ ] Plugin package is built
- [ ] You have the plugin ID or local plugin path

## Steps

### 1. Find OrderlyAppProvider location in the project (most critical step)

**Before** integrating a plugin, you need to find where `OrderlyAppProvider` is used:

```bash
# Search for OrderlyAppProvider usage
grep -r "OrderlyAppProvider" --include="*.tsx" --include="*.ts" src/
```

Or use the Grep tool:

```
OrderlyAppProvider
```

Once found, open that file and confirm the current state of its `plugins` property.

### 2. Get Plugin Details (Optional - Marketplace plugins only)

To integrate a plugin from the Marketplace (not a local/custom plugin), retrieve its metadata first:

> `orderly-devkit view` does not require authentication and can be run directly.

```bash
npx orderly-devkit view <pluginId>
```

Or with pnpm:

```bash
pnpm orderly-devkit view <pluginId>
```

This returns the plugin's complete metadata, including:
- Package name (`npm_package`)
- Version
- `usagePrompt` — **Important** integration instructions, from the plugin author

> **Priority**: Check `usagePrompt` first — if it exists, read carefully and follow these instructions (includes author's specific guidance for integrating the plugin: dependencies, configuration, interceptor usage, etc.).
>
> If no `usagePrompt`, check the `readme` field as a fallback.

### 3. Add dependency

Choose a pattern (ask the user which fits their repo):

- **pnpm workspace** — If needed, add to `pnpm-workspace.yaml`, then in the host's `package.json` add via `"@scope/plugin-name": "workspace:*"`.
- **Local path** — For development use `"@scope/plugin-name": "file:../path-to-plugin"`.
- **Published npm** — After publishing to npm, use `"@scope/plugin-name": "latest"`.

After editing the manifest, run `pnpm install` from the workspace root.

### 4. Import registration function

```tsx
import registerMyPlugin from "@orderly.network/your-plugin";
```

Prioritize using `usagePrompt` or `readme` to determine import path. If not available, check the plugin's `package.json` or `orderly-devkit view` output (`npm_package` field).

### 5. **Core step**: Add plugin to OrderlyAppProvider's plugins array

Open the `OrderlyAppProvider` file from step 1:

```tsx
import { OrderlyAppProvider } from "@orderly.network/app";

<OrderlyAppProvider
  brokerId="..."
  brokerName="..."
  plugins={[registerMyPlugin(/* optional config */)]}
>
  {children}
</OrderlyAppProvider>
```

If there are other plugins, merge them:

```tsx
plugins={[...existingPlugins, registerMyPlugin()]}
```

### 6. Verify

- Typecheck / build the host.
- Run the app and access the UI surfaces that the plugin's interceptors affect (see reference docs).

```bash
# Verify plugin is registered
grep -r "registerMyPlugin" src/
```

## Troubleshooting

- **OrderlyAppProvider not found** → Check if using correct package version, or project may use custom Provider
- **Type errors** → Ensure plugin package and host use the same version of @orderly.network/plugin-core
- **Plugin not showing** → Verify interceptors are configured correctly

## Optional: Storybook / internal apps

If the host also has `OrderlyAppProvider` in Storybook, add the same `plugins` entry for local testing.
