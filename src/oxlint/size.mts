import type { DummyRuleMap } from "oxlint";

export const sizeRules: DummyRuleMap = {
  /** McCabe's threshold. */
  complexity: ["error", 10],
  "max-depth": ["error", 3],
  "max-params": ["error", 3],
  "max-nested-callbacks": ["error", 3],
  /** Catches long branch-free functions that complexity misses. */
  "max-statements": ["error", 20],
  /** Catches large literals that max-statements misses; deleting comments cannot pass it. */
  "max-lines-per-function": [
    "error",
    { max: 50, skipBlankLines: true, skipComments: true },
  ],
  "max-lines": [
    "error",
    { max: 500, skipBlankLines: true, skipComments: true },
  ],
  "no-param-reassign": "error",
  "unicorn/no-nested-ternary": "error",
  "import/no-cycle": "error",
  /** The default threshold (100 modules) almost never fires. */
  "oxc/no-barrel-file": ["error", { threshold: 0 }],
};
