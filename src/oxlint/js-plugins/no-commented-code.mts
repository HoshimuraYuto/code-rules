import type { Comment, Context, Plugin, Rule } from "@oxlint/plugins";
import upstream from "eslint-plugin-no-commented-code";

// The upstream patterns read arrows and braces in JSDoc prose as code.
function isJsDoc(comment: Comment): boolean {
  return comment.type === "Block" && comment.value.startsWith("*");
}

// Triple-slash directives are compiler instructions, so they read as code but must stay.
const TRIPLE_SLASH = /^\/\s*<(?:reference|amd-module|amd-dependency)\b/v;

function isTripleSlash(comment: Comment): boolean {
  return comment.type === "Line" && TRIPLE_SLASH.test(comment.value);
}

function isExempt(comment: Comment): boolean {
  return isJsDoc(comment) || isTripleSlash(comment);
}

// oxlint freezes its objects, so the proxy wraps a copy and reads everything else from `real`.
function delegate<T extends object>(
  real: T,
  overrides: Readonly<Record<string, unknown>>,
): T {
  return new Proxy(
    { ...real },
    {
      get(_copy, key): unknown {
        if (Object.hasOwn(overrides, key)) {
          return Reflect.get(overrides, key);
        }
        const value: unknown = Reflect.get(real, key, real);
        return typeof value === "function" ? value.bind(real) : value;
      },
    },
  );
}

function withoutExempt(context: Context): Context {
  const { sourceCode } = context;
  const filtered = delegate(sourceCode, {
    getAllComments: () =>
      sourceCode.getAllComments().filter((comment) => !isExempt(comment)),
  });
  return delegate(context, {
    sourceCode: filtered,
    getSourceCode: () => filtered,
  });
}

const inner = upstream.rules["no-commented-code"];

const noCommentedCode: Rule = {
  create: (context) => inner?.create?.(withoutExempt(context)) ?? {},
};

const plugin: Plugin = {
  meta: { name: "no-commented-code" },
  rules: { "no-commented-code": noCommentedCode },
};

export default plugin;
