# Orderly plugin — create (CLI) reference

CLI scaffolding reference. For plugin development patterns, see **[orderly-plugin-write](../orderly-plugin-write/SKILL.md)**.

## Naming Conventions

Use the canonical naming rules in:
- [shared naming conventions](../_shared/orderly-plugin-reference.md#naming-conventions)

### NPM Package Name Derivation

CLI auto-generates npm-compliant package name:

- If `pluginId` matches npm naming rules, use it as npmName
- Otherwise, fallback to `toKebabCase(pluginName)`
- NPM rules:
  - Scoped: `@[a-z0-9][a-z0-9-._]*/[a-z0-9][a-z0-9-._]*`
  - Unscoped: `[a-z0-9][a-z0-9-._]*`

### Template Variables

These are derived internally by the CLI — not passed as flags:

| Variable | Format | Example |
|----------|--------|---------|
| `pluginName` | PascalCase | `BuySellButtons` |
| `pluginId` | same as Marketplace API & `registerPlugin({ id })` (`/^[a-zA-Z][a-zA-Z0-9-]*$/`) | `buy-sell-buttons` |
| `npmName` | kebab-case | `buy-sell-buttons` |
| `pluginIdCamel` | camelCase identifier **only for generated JS symbols** (vars/exports), not the plugin id string | `buySellButtons` |
| `version` | Semver | `1.0.0` |

## Generated Plugin Structure

```
<plugin-id>/
├── index.tsx          # Entry point, exports registration function
├── plugin.tsx        # registerXxxPlugin() with interceptors and setup
├── components/        # UI components for interceptors
├── types/             # Plugin options and prop types
├── .orderly-manifest.json  # Plugin metadata
└── package.json
```

## Interceptor Targets (`--interceptor`)

Use:
- [shared interceptor targets](../_shared/orderly-plugin-reference.md#interceptor-targets)
