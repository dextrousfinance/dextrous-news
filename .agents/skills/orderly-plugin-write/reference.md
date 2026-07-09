# Orderly plugin — develop reference

## Orderly docs MCP server (required)

Use the **Orderly docs MCP server** as the source of truth for SDK APIs when writing plugins:
- Discover relevant docs with `orderly_docs_search`.
- Resolve exact APIs with `orderly_docs_get_hook`, `orderly_docs_get_component`, and `orderly_docs_get_type`.
- Pull narrative/examples with `orderly_docs_get_component_doc`, `orderly_docs_get_workflow`, and `orderly_docs_get_recipe`.

## Interceptor Targets

Use the canonical list:
- [shared interceptor targets](../_shared/orderly-plugin-reference.md#interceptor-targets)

Use the Inspector tool in dev mode to discover all available target paths.

## Plugin ID string

Use the same `pluginId` rule as the Marketplace API for `registerPlugin({ id })` and `.orderly-manifest.json` — see [shared naming conventions](../_shared/orderly-plugin-reference.md#naming-conventions).
