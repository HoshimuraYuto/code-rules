import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { beforeAll, describe, expect, test } from "vitest";

const repoRoot = join(import.meta.dirname, "..");
const bin = join(repoRoot, "node_modules", ".bin");

const SLASHES = "//";

const OXLINT_CONFIG = [
  'import { defineConfig } from "oxlint";',
  'import { astro, base, playwright } from "./shared/oxlint/config.mts";',
  "",
  "export default defineConfig({",
  "  extends: [base],",
  "  overrides: [",
  '    { files: ["e2e/**"], ...playwright },',
  '    { files: ["**/*.astro"], ...astro },',
  "  ],",
  "});",
  "",
].join("\n");

const TSCONFIG = JSON.stringify({
  compilerOptions: { strict: true, module: "nodenext" },
});

function lines(...source: readonly string[]): string {
  return `${source.join("\n")}\n`;
}

// oxlint lints only the frontmatter script, so a component without one is never checked.
const ASTRO_COMPONENT = lines(
  "---",
  'const title = "a";',
  "---",
  "<p>{title}</p>",
);

const RETURN_TWICE = [
  "  let s = 0;",
  "  s += n * 2;",
  "  s -= 1;",
  "  return s;",
  "}",
];

// One file per rule; each must trigger only through the rule's own pattern.
const FIXTURES: Readonly<Record<string, string>> = {
  "no-comment-slop/no-banner-comment": lines(
    `${SLASHES} ==========`,
    "export const value = 1;",
  ),
  "no-comment-slop/no-trailing-comment": lines(
    `export const value = 1; ${SLASHES} in seconds`,
  ),
  "no-comment-slop/no-jargon": lines(
    `${SLASHES} Leverage the cache.`,
    "export const value = 1;",
  ),
  "no-comment-slop/no-em-dash": lines(
    `${SLASHES} Cache \u2014 hot path.`,
    "export const a = 1;",
  ),
  "no-comment-slop/prefer-jsdoc-for-exports": lines(
    `${SLASHES} Kept in seconds.`,
    "export const ttl = 1;",
  ),
  "no-comment-slop/prefer-jsdoc-for-members": lines(
    "export interface Entry {",
    `  ${SLASHES} Kept in seconds.`,
    "  ttl: number;",
    "}",
  ),
  "no-comment-slop/max-comment-lines": lines(
    "export const value = 1;",
    "",
    `${SLASHES} One.`,
    `${SLASHES} Two.`,
    `${SLASHES} Three.`,
    `${SLASHES} Four.`,
    "export const other = 2;",
  ),
  "no-comment-slop/no-foreign-syntax": lines(
    `${SLASHES}/ Returns the id.`,
    "export const a = 1;",
  ),
  "no-comment-slop/multiline-jsdoc-format": lines(
    "/** First line.",
    " * Second line. */",
    "export const value = 1;",
  ),
  "deslop/no-obvious-comments": lines(
    "export function read(value: { name: string }): string {",
    "  const { name } = value;",
    `  ${SLASHES} Return the name`,
    "  return name;",
    "}",
  ),
  "no-commented-code/no-commented-code": lines(
    `${SLASHES} const old = compute(value);`,
    "export const value = 1;",
  ),
  "code-rules/no-changelog-comment": lines(
    `${SLASHES} Changed from a loop to a lookup.`,
    "export const value = 1;",
  ),
  "antfu/no-import-dist": lines(
    'import { value } from "../dist/value.mjs";',
    "export const doubled = value * 2;",
  ),
  "antfu/no-import-node-modules-by-path": lines(
    'import { value } from "../node_modules/lib/index.mjs";',
    "export const doubled = value * 2;",
  ),
  "slop/no-trivial-functions": lines(
    "function nameOf(user: { name: string }): string {",
    "  return user.name;",
    "}",
    'export const name = nameOf({ name: "a" });',
  ),
  "slop/no-trivial-type-aliases": lines(
    "type Id = string;",
    'export const id: Id = "a";',
  ),
  "sonarjs/no-identical-functions": lines(
    "export function a(n: number): number {",
    ...RETURN_TWICE,
    "export function b(n: number): number {",
    ...RETURN_TWICE,
  ),
  "sonarjs/no-dead-store": lines(
    "export function f(n: number): number {",
    "  let x = n + 1;",
    "  x = 2;",
    "  return x;",
    "}",
  ),
  "sonarjs/no-all-duplicated-branches": lines(
    "export function f(n: number, out: number[]): void {",
    "  if (n > 0) {",
    "    out.push(n);",
    "  } else {",
    "    out.push(n);",
    "  }",
    "}",
  ),
  "sonarjs/no-collapsible-if": lines(
    "export function f(a: boolean, b: boolean): number {",
    "  if (a) {",
    "    if (b) {",
    "      return 1;",
    "    }",
    "  }",
    "  return 0;",
    "}",
  ),
  "sonarjs/no-gratuitous-expressions": lines(
    "export function f(a: boolean): number {",
    "  if (a) {",
    "    if (a) {",
    "      return 1;",
    "    }",
    "  }",
    "  return 0;",
    "}",
  ),
  "sonarjs/no-identical-expressions": lines(
    "export function f(b: number): boolean {",
    "  return b / b === 1;",
    "}",
  ),
  "sonarjs/no-invariant-returns": lines(
    "export function f(n: number): number {",
    "  if (n > 1) {",
    "    return 5;",
    "  }",
    "  return 5;",
    "}",
  ),
  "sonarjs/no-inverted-boolean-check": lines(
    "export function f(a: number, b: number): boolean {",
    "  return !(a === b);",
    "}",
  ),
  "sonarjs/no-redundant-jump": lines(
    "export function f(values: number[]): number {",
    "  let s = 0;",
    "  for (const v of values) {",
    "    s += v;",
    "    continue;",
    "  }",
    "  return s;",
    "}",
  ),
  "sonarjs/prefer-single-boolean-return": lines(
    "export function f(n: number): boolean {",
    "  if (n > 1) {",
    "    return true;",
    "  }",
    "  return false;",
    "}",
  ),
  "sonarjs/no-element-overwrite": lines(
    "export function f(list: number[]): void {",
    "  list[0] = 1;",
    "  list[0] = 2;",
    "}",
  ),
  "sonarjs/no-empty-collection": lines(
    "export function f(): number[] {",
    "  const list: number[] = [];",
    "  return list.map((v) => v * 2);",
    "}",
  ),
  "sonarjs/no-unused-collection": lines(
    "export function f(n: number): void {",
    "  const list: number[] = [];",
    "  list.push(n);",
    "}",
  ),
};

// Cases the wrappers and rule options exist for; none may trigger the named rule.
const PASSING: readonly {
  name: string;
  rule: string;
  file: string;
  source: string;
}[] = [
  {
    name: "a JSDoc example",
    rule: "no-commented-code/no-commented-code",
    file: "src/jsdoc.mts",
    source: lines("/** Alias domain => inbox */", "export const value = 1;"),
  },
  {
    name: "a triple-slash directive",
    rule: "no-commented-code/no-commented-code",
    file: "src/triple-slash.mts",
    source: lines(
      `${SLASHES}/ <reference types="vitest/config" />`,
      "export const value = 1;",
    ),
  },
  {
    name: "a PascalCase Astro component under the astro preset",
    rule: "unicorn/filename-case",
    file: "src/CardTitle.astro",
    source: ASTRO_COMPONENT,
  },
  {
    name: "a present-tense 'no longer'",
    rule: "code-rules/no-changelog-comment",
    file: "src/no-longer.mts",
    source: lines(
      `${SLASHES} Removed aliases no longer receive mail.`,
      "export const value = 1;",
    ),
  },
  {
    name: "a Playwright test under the playwright preset",
    rule: "vitest/",
    file: "e2e/home.spec.mts",
    source: lines(
      'import { expect, test } from "@playwright/test";',
      "",
      'test("Home Page", async ({ page }) => {',
      '  await page.goto("/");',
      '  await expect(page).toHaveTitle("Home");',
      "});",
    ),
  },
  {
    name: "a comment that names a directive mid-sentence",
    rule: "eslint/no-warning-comments",
    file: "src/directive-prose.mts",
    source: lines(
      `${SLASHES} unicorn/no-abusive-eslint-disable stays on here.`,
      "export const value = 1;",
    ),
  },
];

// Neighbours of the PASSING cases that the same rule must still report.
const FAILING: readonly {
  name: string;
  rule: string;
  file: string;
  source: string;
}[] = [
  {
    name: "commented-out code after a triple-slash directive",
    rule: "no-commented-code/no-commented-code",
    file: "src/after-triple-slash.mts",
    source: lines(
      `${SLASHES}/ <reference types="vitest/config" />`,
      `${SLASHES} const x = 1;`,
      "export const value = 1;",
    ),
  },
  {
    name: "a snake_case Astro component under the astro preset",
    rule: "unicorn/filename-case",
    file: "src/card_title.astro",
    source: ASTRO_COMPONENT,
  },
  {
    name: "a conditional in a Playwright test under the playwright preset",
    rule: "vitest/no-conditional-in-test",
    file: "e2e/conditional.spec.mts",
    source: lines(
      'import { expect, test } from "@playwright/test";',
      "",
      'test("home page", async ({ page }) => {',
      '  if (page.url() === "/") {',
      '    await expect(page).toHaveTitle("Home");',
      "  }",
      "});",
    ),
  },
  ...[
    "oxlint-disable-next-line no-console",
    "eslint-disable",
    "prettier-ignore",
  ].map((directive) => ({
    name: `a ${directive.split(" ")[0] ?? ""} comment`,
    rule: "eslint/no-warning-comments",
    file: `src/directive-${directive.split(" ")[0] ?? ""}.mts`,
    source: lines(`${SLASHES} ${directive}`, "export const value = 1;"),
  })),
  {
    name: "a PascalCase script outside the astro preset",
    rule: "unicorn/filename-case",
    file: "src/CardTitle.mts",
    source: lines("export const value = 1;"),
  },
];

function fileOf(rule: string): string {
  return `src/${rule.replace("/", "--")}.mts`;
}

const GIT = [
  "-c",
  "user.name=test",
  "-c",
  "user.email=test@example.com",
  "-c",
  "commit.gpgsign=false",
];

function git(dir: string, args: readonly string[]): void {
  execFileSync("git", [...GIT, ...args], { cwd: dir });
}

// The fixtures are committed and buried under later commits, so a rule that inspects only
// recent changes would stay silent.
function makeService(): string {
  const dir = mkdtempSync(join(tmpdir(), "code-rules-rules-"));
  git(dir, ["init", "-q"]);
  symlinkSync(join(repoRoot, "node_modules"), join(dir, "node_modules"));
  symlinkSync(join(repoRoot, "src"), join(dir, "shared"));
  mkdirSync(join(dir, "src"));
  mkdirSync(join(dir, "e2e"));
  writeFileSync(join(dir, "oxlint.config.mts"), OXLINT_CONFIG);
  writeFileSync(join(dir, "tsconfig.json"), TSCONFIG);
  for (const [rule, source] of Object.entries(FIXTURES)) {
    writeFileSync(join(dir, fileOf(rule)), source);
  }
  for (const { file, source } of [...PASSING, ...FAILING]) {
    writeFileSync(join(dir, file), source);
  }
  git(dir, ["add", "src", "e2e"]);
  git(dir, ["commit", "-q", "-m", "fixtures"]);
  for (const index of [1, 2, 3, 4, 5, 6]) {
    git(dir, ["commit", "-q", "--allow-empty", "-m", String(index)]);
  }
  return dir;
}

/** Rule ids such as `vitest(prefer-to-be)` reported for one file in oxlint's unix format. */
function reportedIn(output: string, file: string): string[] {
  return output
    .split("\n")
    .filter((line) => line.startsWith(`${file}:`))
    .map((line) => line.slice(line.lastIndexOf("/") + 1, -1));
}

describe("rules", { timeout: 60_000 }, () => {
  let output = "";

  beforeAll(() => {
    const dir = makeService();
    const result = spawnSync(
      join(bin, "oxlint"),
      ["--disable-nested-config", "-f", "unix", "src", "e2e"],
      {
        cwd: dir,
        encoding: "utf8",
      },
    );
    output = `${result.stdout}${result.stderr}`;
  });

  test("loads every plugin", () => {
    expect(output).not.toContain("Failed to load");
    expect(output).not.toContain("Error running JS plugin");
  });

  test.each(Object.keys(FIXTURES))("reports %s", (rule) => {
    const [plugin, name] = rule.split("/");
    expect(reportedIn(output, fileOf(rule))).toContain(
      `${String(plugin)}(${String(name)})`,
    );
  });

  test.each(FAILING)("reports $name", ({ rule, file }) => {
    const [plugin, name] = rule.split("/");
    expect(reportedIn(output, file)).toContain(
      `${String(plugin)}(${String(name)})`,
    );
  });

  test.each(PASSING)("does not report $name", ({ rule, file }) => {
    const [plugin, name] = rule.split("/");
    const unwanted = `${String(plugin)}(${String(name)}`;
    expect(
      reportedIn(output, file).filter((found) => found.startsWith(unwanted)),
    ).toStrictEqual([]);
  });
});
