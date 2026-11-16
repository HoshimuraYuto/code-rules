import { extname } from "node:path";
import { fileURLToPath } from "node:url";

import type { ExternalPluginEntry } from "oxlint";

// Loading through this package's files keeps a service's knip from flagging the plugins.
const NAMES = [
  "code-rules",
  "antfu",
  "deslop",
  "no-comment-slop",
  "no-commented-code",
  "slop",
  "sonarjs",
];

// The sources run as .mts and the published build as .mjs.
function pluginFile(name: string): string {
  const file = `js-plugins/${name}${extname(import.meta.url)}`;
  return fileURLToPath(new URL(file, import.meta.url));
}

export const jsPlugins: ExternalPluginEntry[] = NAMES.map((name) => ({
  name,
  specifier: pluginFile(name),
}));
