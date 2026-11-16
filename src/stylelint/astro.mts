import postcssHtml from "postcss-html";
import type { Config } from "stylelint";

/** Stacked after `@hoshimurayuto/code-rules/stylelint` in a service's `extends`. */
const config: Config = {
  overrides: [{ files: ["**/*.astro"], customSyntax: postcssHtml }],
};

export default config;
