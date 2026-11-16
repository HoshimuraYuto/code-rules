# code-rules

English | [日本語](README.ja.md)

Shared configs for oxlint, oxfmt, stylelint and TypeScript. Every rule is an error.

## Install

```sh
pnpm add -D @hoshimurayuto/code-rules oxlint oxfmt knip typescript
pnpm add -D stylelint # only with CSS
```

## Use

`oxlint.config.mts`

```ts
import { base, node } from "@hoshimurayuto/code-rules/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [base],
  overrides: [{ files: ["scripts/**"], ...node }],
});
```

Presets for `overrides`: `node`, `worker` (Cloudflare Workers), `browser`, `astro`
(`.astro` files), `playwright` (e2e tests), `defaultExport` (files a tool requires
to default-export; `*.config.*` already has it).

`oxfmt.config.mts`

```ts
import shared from "@hoshimurayuto/code-rules/oxfmt";
import { defineConfig } from "oxfmt";

export default defineConfig(shared);
```

`stylelint.config.mjs` (add `@hoshimurayuto/code-rules/stylelint/astro` for Astro)

```js
export default { extends: ["@hoshimurayuto/code-rules/stylelint"] };
```

`tsconfig.json` (set `module`, `target`, `lib` and `types` for the runtime)

```json
{
  "extends": "@hoshimurayuto/code-rules/tsconfig",
  "compilerOptions": {
    "module": "nodenext",
    "target": "es2025",
    "lib": ["es2025"],
    "types": ["node"],
    "noEmit": true
  }
}
```

`knip.config.ts`

```ts
import type { KnipConfig } from "knip";

export default { entry: ["src/index.mts"] } satisfies KnipConfig;
```

`package.json`

```json
{ "scripts": { "check": "tsc && oxfmt --check . && oxlint . && knip" } }
```

## Notes

- Comments that switch a check off (`oxlint-disable`, `eslint-disable`,
  `oxfmt-ignore`, `prettier-ignore`, `stylelint-disable`) fail.
- An empty function needs a one-line comment saying why; write an inline no-op as
  `() => undefined`.
- Comment and duplication rules run as oxlint JS plugins, which oxlint marks as
  alpha.

## License

[MIT](LICENSE)
