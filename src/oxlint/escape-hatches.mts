import type { DummyRuleMap } from "oxlint";

export const escapeHatchRules: DummyRuleMap = {
  "typescript/no-explicit-any": "error",
  "typescript/no-unsafe-argument": "error",
  "typescript/no-unsafe-assignment": "error",
  "typescript/no-unsafe-call": "error",
  "typescript/no-unsafe-member-access": "error",
  "typescript/no-unsafe-return": "error",
  "typescript/no-unsafe-function-type": "error",
  "typescript/no-empty-object-type": "error",
  /** `as const` and `satisfies` stay allowed. */
  "typescript/consistent-type-assertions": [
    "error",
    { assertionStyle: "never" },
  ],
  /** Enabled by the suspicious category; reports the same `as` a second time. */
  "typescript/no-unsafe-type-assertion": "off",
  "typescript/no-non-null-assertion": "error",
  /** A description does not make `@ts-expect-error` acceptable. */
  "typescript/ban-ts-comment": [
    "error",
    {
      "ts-check": false,
      "ts-expect-error": true,
      "ts-ignore": true,
      "ts-nocheck": true,
    },
  ],
  "no-empty": "error",
  "no-empty-function": "error",
  /** The default terms (todo, fixme, xxx) plus every directive that switches a check off. */
  "no-warning-comments": [
    "error",
    {
      terms: [
        "todo",
        "fixme",
        "xxx",
        "oxlint-disable",
        "oxlint-enable",
        "eslint-disable",
        "eslint-enable",
        "oxfmt-ignore",
        "prettier-ignore",
      ],
    },
  ],
  "unicorn/no-abusive-eslint-disable": "error",
  "vitest/no-conditional-in-test": "error",
};
