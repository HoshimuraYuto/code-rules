import type { DummyRuleMap } from "oxlint";

export const correctnessRules: DummyRuleMap = {
  eqeqeq: "error",
  "no-console": "error",
  /** Numbers and strings are rejected too, so a condition cannot mistake 0 or "" for absence. */
  "typescript/strict-boolean-expressions": [
    "error",
    { allowNullableObject: true, allowNumber: false, allowString: false },
  ],
  /** A default branch would hide a member added to the union later. */
  "typescript/switch-exhaustiveness-check": [
    "error",
    {
      allowDefaultCaseForExhaustiveSwitch: false,
      requireDefaultForNonUnion: true,
    },
  ],
  "typescript/no-misused-promises": "error",
  "typescript/no-confusing-void-expression": "error",
  "typescript/only-throw-error": "error",
  "typescript/prefer-promise-reject-errors": "error",
  "unicorn/throw-new-error": "error",
  "typescript/use-unknown-in-catch-callback-variable": "error",
  "typescript/restrict-plus-operands": "error",
  "typescript/return-await": "error",
  "typescript/no-deprecated": "error",
  "typescript/no-dynamic-delete": "error",
  "typescript/no-invalid-void-type": "error",
  "typescript/no-require-imports": "error",
  /** Bundlers load stylesheets through side-effect imports. */
  "import/no-unassigned-import": ["error", { allow: ["**/*.css"] }],
  "typescript/related-getter-setter-pairs": "error",
  "typescript/unified-signatures": "error",
  "typescript/adjacent-overload-signatures": "error",
  "typescript/prefer-return-this-type": "error",
  "typescript/prefer-reduce-type-parameter": "error",
  "typescript/explicit-module-boundary-types": "error",
  "typescript/prefer-readonly": "error",
  "no-template-curly-in-string": "error",
  "symbol-description": "error",
  "unicorn/error-message": "error",
  "import/no-mutable-exports": "error",
  "no-sequences": "error",
  "no-new-func": "error",
  "no-proto": "error",
  "vitest/no-identical-title": "error",
  "antfu/no-import-dist": "error",
  "antfu/no-import-node-modules-by-path": "error",
};
