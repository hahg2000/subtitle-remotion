/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig((currentConfiguration) => {
  const withTailwind = enableTailwind(currentConfiguration);

  return {
    ...withTailwind,
    module: {
      ...withTailwind.module,
      rules: [
        ...(withTailwind.module?.rules ?? []),
        {
          test: /\.ass$/i,
          type: "asset/source",
        },
      ],
    },
  };
});
