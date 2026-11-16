import { fileURLToPath } from "node:url";

import type { Config } from "stylelint";
import orderPlugins from "stylelint-order";

const config: Config = {
  extends: [fileURLToPath(import.meta.resolve("stylelint-config-standard"))],
  plugins: orderPlugins,
  rules: {
    "order/properties-alphabetical-order": true,
    "declaration-no-important": true,
    "selector-max-id": 0,
    "max-nesting-depth": 3,
  },
  /** stylelint-disable comments have no effect, so they cannot hide a finding. */
  ignoreDisables: true,
};

export default config;
