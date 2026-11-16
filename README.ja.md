# code-rules

[English](README.md) | 日本語

oxlint、oxfmt、stylelint、TypeScriptの共通設定です。ルールはすべてエラーです。

## インストール

```sh
pnpm add -D @hoshimurayuto/code-rules oxlint oxfmt knip typescript
pnpm add -D stylelint # CSSを使う場合のみ
```

## 使い方

`oxlint.config.mts`

```ts
import { base, node } from "@hoshimurayuto/code-rules/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [base],
  overrides: [{ files: ["scripts/**"], ...node }],
});
```

`overrides`で使えるpreset: `node`、`worker`(Cloudflare Workers)、`browser`、`astro`(`.astro`のファイル)、`playwright`(e2eのテスト)、`defaultExport`(default exportが必要なファイル。`*.config.*`には最初から当たっています)。

`oxfmt.config.mts`

```ts
import shared from "@hoshimurayuto/code-rules/oxfmt";
import { defineConfig } from "oxfmt";

export default defineConfig(shared);
```

`stylelint.config.mjs`(Astroでは`@hoshimurayuto/code-rules/stylelint/astro`も足します)

```js
export default { extends: ["@hoshimurayuto/code-rules/stylelint"] };
```

`tsconfig.json`(`module`、`target`、`lib`、`types`は実行環境に合わせます)

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

## 注意

- 検査を外すコメント(`oxlint-disable`、`eslint-disable`、`oxfmt-ignore`、`prettier-ignore`、`stylelint-disable`)は失敗になります。
- 空の関数には、空である理由を1行のコメントで書きます。何もしないインラインの関数は`() => undefined`と書きます。
- コメントと重複の検査は、oxlintのJSプラグイン(oxlintではalpha)で動いています。

## ライセンス

[MIT](LICENSE)
