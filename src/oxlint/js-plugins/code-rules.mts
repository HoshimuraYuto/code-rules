import type { Plugin, Rule } from "@oxlint/plugins";

// Phrases that narrate a past edit rather than the code; that history belongs in git.
const CHANGELOG_PHRASES = [
  /\bchanged (?:from|to)\b/iv,
  /\bwas\b[^.;]*[,;]\s*now\b/iv,
  /\brefactor(?:ed|ing)?\b/iv,
  /\bupdated to\b/iv,
];

const noChangelogComment: Rule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow comments that describe how the code changed",
    },
  },
  create(context) {
    return {
      Program(): void {
        for (const comment of context.sourceCode.getAllComments()) {
          if (CHANGELOG_PHRASES.some((phrase) => phrase.test(comment.value))) {
            context.report({
              node: comment,
              message:
                "Comment describes a change; put history in the commit message",
            });
          }
        }
      },
    };
  },
};

const plugin: Plugin = {
  meta: { name: "code-rules" },
  rules: { "no-changelog-comment": noChangelogComment },
};

export default plugin;
