import type { DummyRuleMap, OxlintConfig } from "oxlint";
import { defineConfig } from "oxlint";

import { commentRules } from "./comments.mts";
import { consistencyRules } from "./consistency.mts";
import { correctnessRules } from "./correctness.mts";
import { duplicationRules } from "./duplication.mts";
import { escapeHatchRules } from "./escape-hatches.mts";
import { jsPlugins } from "./plugins.mts";
import { defaultExport } from "./presets.mts";
import { redundancyRules } from "./redundancy.mts";
import { sizeRules } from "./size.mts";

export {
  astro,
  browser,
  defaultExport,
  node,
  playwright,
  worker,
} from "./presets.mts";

const plugins: OxlintConfig["plugins"] = [
  "typescript",
  "unicorn",
  "oxc",
  "import",
  "vitest",
  "promise",
];

/** Other categories have false positives, so their rules are picked one by one. */
const categories: OxlintConfig["categories"] = {
  correctness: "error",
  suspicious: "error",
};

const rules: DummyRuleMap = {
  ...escapeHatchRules,
  ...sizeRules,
  ...redundancyRules,
  ...correctnessRules,
  ...consistencyRules,
  ...commentRules,
  ...duplicationRules,
};

export const base: OxlintConfig = defineConfig({
  plugins,
  jsPlugins,
  categories,
  rules,
  overrides: [
    {
      /** Most tools require a default export from their config file. */
      files: ["**/*.config.{ts,mts,cts,js,mjs,cjs}"],
      ...defaultExport,
    },
    {
      files: ["**/*.test.{ts,mts,cts,tsx}", "**/*.spec.{ts,mts,cts,tsx}"],
      rules: {
        "max-lines-per-function": "off",
        "max-statements": "off",
        "max-nested-callbacks": ["error", 5],
        "typescript/explicit-module-boundary-types": "off",
      },
    },
  ],
  options: {
    /** Requires oxlint-tsgolint. */
    typeAware: true,
    denyWarnings: true,
    reportUnusedDisableDirectives: "error",
    /** oxlint honours eslint-* directives by default. */
    respectEslintDisableDirectives: false,
  },
});
