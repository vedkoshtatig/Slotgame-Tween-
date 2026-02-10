import { Assets } from "pixi.js";

export class AssetLoader {
  static async load() {
    await Assets.init({
      manifest: "/manifest/manifest.json",
    });

    await Assets.loadBundle("backgrounds");
  }
}
