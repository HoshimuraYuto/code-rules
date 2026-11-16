import type { DummyRuleMap } from "oxlint";

export const commentRules: DummyRuleMap = {
  "no-comment-slop/no-banner-comment": "error",
  "no-comment-slop/no-trailing-comment": "error",
  "no-comment-slop/no-jargon": "error",
  "no-comment-slop/no-em-dash": "error",
  "no-comment-slop/prefer-jsdoc-for-exports": "error",
  "no-comment-slop/prefer-jsdoc-for-members": "error",
  /** The plugin allows file headers and exported JSDoc longer than the plain limit. */
  "no-comment-slop/max-comment-lines": [
    "error",
    { max: 3, headerMax: 3, jsdocSectionMax: 3, exportDescriptionMax: 3 },
  ],
  "no-comment-slop/no-foreign-syntax": "error",
  "no-comment-slop/multiline-jsdoc-format": "error",
  "deslop/no-obvious-comments": "error",
  "no-commented-code/no-commented-code": "error",
  "code-rules/no-changelog-comment": "error",
};
