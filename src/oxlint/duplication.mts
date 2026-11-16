import type { DummyRuleMap } from "oxlint";

// Without it slop inspects only lines changed in recent commits, so results depend on history.
const FULL = { inspection: "full" };

export const duplicationRules: DummyRuleMap = {
  "slop/no-trivial-functions": ["error", FULL],
  "slop/no-trivial-type-aliases": ["error", FULL],
  "sonarjs/no-identical-functions": "error",
  "sonarjs/no-all-duplicated-branches": "error",
  "sonarjs/no-collapsible-if": "error",
  "sonarjs/no-gratuitous-expressions": "error",
  "sonarjs/no-invariant-returns": "error",
  "sonarjs/no-inverted-boolean-check": "error",
  "sonarjs/no-redundant-jump": "error",
  "sonarjs/prefer-single-boolean-return": "error",
  "sonarjs/no-dead-store": "error",
  "sonarjs/no-identical-expressions": "error",
  "sonarjs/no-element-overwrite": "error",
  "sonarjs/no-empty-collection": "error",
  "sonarjs/no-unused-collection": "error",
};
