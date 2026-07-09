# Orderly Plugin Submit — Reference

Reference for preparing and submitting an Orderly plugin to the Marketplace. Use with **orderly-plugin-submit** skill.

## `.orderly-manifest.json` Fields

Use the canonical manifest constraints from:
- [shared manifest constraints](../_shared/orderly-plugin-reference.md#manifest-constraints)

Submission-specific additions:
- `storybookUrl` (optional)
- `storybookTooltip` (optional)

## Valid Tags

Comma-separated list, max **5** tags:

| Tag | Use for |
|:----|:--------|
| `UI` | Visual components, UI overlays |
| `Indicator` | Chart indicators, price markers |
| `Order Entry` | Order forms, order management |
| `Trading` | Trading panels, position management |
| `Chart` | Chart modifications, drawing tools |
| `Portfolio` | Portfolio views, asset breakdown |
| `Analytics` | Data analysis, statistics |
| `Tool` | Utilities, helpers |
| `Widget` | Standalone widgets |

## `usagePrompt` Guidelines (Recommended)

`usagePrompt` is shown to AI assistants and developers integrating your plugin. It should explain **how to add the plugin to a host app**, not what the plugin does.

### Structure (recommended)

```
1. Install: <npm command or package info>
2. Register: <code snippet for OrderlyAppProvider plugins array>
3. Config: <env vars, options, prerequisites>
4. Build: <any build/setup steps>
5. Pitfalls: <common mistakes or注意点>
```

### Example

```markdown
Install: npm install @orderly.network/plugin-sample
Register:
  import registerSample from "@orderly.network/plugin-sample";
  <OrderlyAppProvider plugins={[registerSample()]} ...>
Config: Set RECOMMEND_API_URL env var to your endpoint.
Build: Run `pnpm build` before use.
Pitfalls: Do not mix with other order-type plugins.
```

### Rules

- Max **8192 characters** (CLI validates this)
- Be concise — AI will summarize
- Focus on **integration steps**, not features
- Use code snippets for `plugins` array

## Marketplace README Template

The README is for the GitHub repo, not uploaded to the API. Structure:

```markdown
# <Plugin Name>

<One-line description>

## Overview

<What it does, who it's for>

## Install

<npm install command>

## Usage

<Basic usage example with code>

## Configuration

<Options / env vars>

## Interceptors

| Target | Description |
|:-------|:------------|
| `Trading.Layout.Desktop` | <description> |

## Development

<Build/test commands>

## License
```

## Submit Command

```bash
# Dry run (validate only)
orderly-devkit submit --path . --dry-run

# Actual submit
orderly-devkit submit --path . [--tags "UI,Trading"] [--storybook-url "https://..."]
```

Notes from current CLI:
- `--tags` invalid values are warned and dropped (valid values only are kept).
- `.orderly-manifest.json` is optional for submit; CLI can resolve from `package.json` + git remote, then prompt for missing `pluginId`.
- Validation checks include npm name format, GitHub repo URL format, `pluginId` (**Marketplace API**: `/^[a-zA-Z][a-zA-Z0-9-]*$/`, same as `.orderly-manifest.json` and `registerPlugin({ id })`), max tags, coverImages constraints, and usagePrompt max length.

## Submit API Response

| Status | Meaning |
|:-------|:--------|
| `201` | Success — plugin submitted for review |
| `400` | Validation error — fix fields and retry |
| `401` | Not authenticated — run `orderly-devkit login` |
| `404` | Resource not found — verify `npmName`/`repoUrl`/`pluginId` |
| `409` | Plugin registration conflict — usually duplicate `pluginId` |

On success, API response includes plugin data like `id`, `npmName`, and `status` (often `under_review`).
