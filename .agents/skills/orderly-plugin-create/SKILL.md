---
name: orderly-plugin-create
description: Use when the user wants to scaffold / generate a new Orderly plugin project via the official `@orderly.network/cli` or `orderly-devkit` CLI. Triggers on "create Orderly plugin", "new Orderly plugin", "scaffold plugin", "generate plugin", "orderly-devkit create plugin".
---

# Orderly plugin — create (CLI)

Scaffold a new plugin package using **`@orderly.network/cli`** (the official template).

## When to use

- User wants to **generate a new plugin project** from the CLI template.
- After scaffolding, use **[orderly-plugin-write](../orderly-plugin-write/SKILL.md)** to develop plugin code.

## Prerequisites

- Node.js >= 20.19.0
- CLI: `npx orderly-devkit` (preferred if repo depends on CLI) or `npx @orderly.network/cli`

## Inputs to collect

Ask for these if missing. **For naming validation rules, see [reference.md § Naming conventions](reference.md#naming-conventions)**:

| Input | Flag | Description |
|-------|------|-------------|
| Plugin name | `--name` / `-n` | PascalCase, e.g. `BuySellButtons` |
| Plugin ID | `--id` / `-i` | Optional. Default: kebab-case of name, e.g. `buy-sell-buttons` |
| Interceptor target | `--interceptor` | Where the plugin UI appears (see table below) |
| Target directory | `--target` / `-t` | Where to create plugin folder. Default: `./<PluginName>` |

### Supported `--interceptor` targets

For the canonical target list, see:
- [shared interceptor targets](../_shared/orderly-plugin-reference.md#interceptor-targets)

> **Tip**: Use the Inspector tool in your development environment to discover all available interceptor target paths.

## Step 1 — Check CLI options

```bash
npx orderly-devkit create plugin --help
```

Or:

```bash
npx @orderly.network/cli create plugin --help
```

Show the output to see available flags and current defaults.

## Step 2 — Confirm and run

After collecting inputs, summarize before running:

```
Plugin: <Name>
ID: <plugin-id>
Target: <path>
Interceptor: <interceptor-target>
```

Run from the parent directory (where the plugin folder should be created):

```bash
npx orderly-devkit create plugin \
  --name "<PluginName>" \
  --id "<plugin-id>" \
  --interceptor "<InterceptorTarget>" \
  --target "<path>"
```

Or with pnpm:

```bash
pnpm orderly-devkit create plugin \
  --name "<PluginName>" \
  --id "<plugin-id>" \
  --interceptor "<InterceptorTarget>" \
  --target "<path>"
```

## After creation

```
Plugin created at: <path>/plugins/<plugin-id-kebab>
```

### Generated structure

```
<plugin-id>/
├── index.tsx          # Entry point, exports registration function
├── plugin.tsx        # registerXxxPlugin() with interceptors
├── components/       # UI components
├── types/            # TypeScript definitions
├── .orderly-manifest.json  # Plugin metadata
└── package.json
```

### Next steps

1. **Review manifest**: Open `.orderly-manifest.json` to verify metadata.
2. **Develop plugin**: See **[orderly-plugin-write](../orderly-plugin-write/SKILL.md)** for:
   - Architecture patterns (Widget, Page, Layout)
   - Interceptor strategies (Enhance, Wrap, Replace)
   - Hooks usage and props typing
   - Lifecycle hooks and best practices
3. **Wire into app**: See **[orderly-plugin-add](../orderly-plugin-add/SKILL.md)** to add to `OrderlyAppProvider`.
4. **Publish**: See **[orderly-plugin-submit](../orderly-plugin-submit/SKILL.md)** for Marketplace submission.

## Reference

- [reference.md](reference.md) — create-command specific details (template variables, generated structure)
- [shared reference](../_shared/orderly-plugin-reference.md) — naming rules, interceptor targets, and manifest constraints
