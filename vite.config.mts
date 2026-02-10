import { defineConfig, type Plugin, type ResolvedConfig } from "vite";
import { AssetPack, type AssetPackConfig } from "@assetpack/core";
import { pixiPipes } from "@assetpack/core/pixi";

function assetpackPlugin(): Plugin {
  const apConfig: AssetPackConfig = {
    entry: "./raw-assets",
    output: "./public",
   
    pipes: [
      ...pixiPipes({
        manifest: {
          createShortcuts:true,
          bundles: {
            bg: ["backgrounds/**"],
            intro: ["introScreen/**", "preLoader/**"],
            game: [
              "bitmapFonts/**",
              "symbols/**",
              "reelFrame/**",
              "gamePanel/**",
            ],
          },
        },
      }),
    ],
  };

  let mode: ResolvedConfig["command"];
  let ap: AssetPack | undefined;

  return {
    name: "vite-plugin-assetpack",

    configResolved(resolvedConfig) {
      mode = resolvedConfig.command;
      if (!resolvedConfig.publicDir) return;
      if (apConfig.output) return;

      const publicDir = resolvedConfig.publicDir.replace(process.cwd(), "");
      apConfig.output = `.${publicDir}/assets/`;
    },

    async buildStart() {
      if (mode === "serve") {
        if (ap) return;
        ap = new AssetPack(apConfig);
        void ap.watch();
      } else {
        await new AssetPack(apConfig).run();
      }
    },

    async buildEnd() {
      if (ap) {
        await ap.stop();
        ap = undefined;
      }
    },
  };
}

export default defineConfig({
  plugins: [assetpackPlugin()],
});
