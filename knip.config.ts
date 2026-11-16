import type { KnipConfig } from "knip";

export default {
  entry: ["src/*/config.mts", "src/stylelint/astro.mts", ".secretlintrc.cjs"],
} satisfies KnipConfig;
