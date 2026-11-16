import { defineConfig } from "oxlint";

import { base, defaultExport, node } from "./src/oxlint/config.mts";

export default defineConfig({
  extends: [base],
  overrides: [
    { files: ["test/**"], ...node },
    {
      files: [
        "src/*/config.mts",
        "src/stylelint/astro.mts",
        "src/oxlint/js-plugins/*",
      ],
      ...defaultExport,
    },
  ],
});
