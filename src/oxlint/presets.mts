import type { OxlintOverride } from "oxlint";

export type Preset = Omit<OxlintOverride, "files">;

export const node: Preset = {
  env: { node: true },
  rules: {
    "no-console": "off",
    "unicorn/no-process-exit": "off",
  },
};

export const worker: Preset = {
  env: { worker: true },
  /** console output is what Workers Logs records. */
  rules: {
    "no-console": "off",
  },
};

export const browser: Preset = {
  env: { browser: true },
  rules: {
    "import/no-nodejs-modules": "error",
  },
};

/** Astro's docs and starters name components in PascalCase. */
export const astro: Preset = {
  rules: {
    "unicorn/filename-case": [
      "error",
      { cases: { kebabCase: true, pascalCase: true } },
    ],
  },
};

export const defaultExport: Preset = {
  rules: {
    "import/no-default-export": "off",
  },
};

/** Playwright's `test` and `expect` come from `@playwright/test`, not from vitest. */
export const playwright: Preset = {
  rules: {
    "vitest/prefer-importing-vitest-globals": "off",
  },
};
