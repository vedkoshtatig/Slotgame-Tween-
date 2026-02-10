import { Assets } from "pixi.js";

export class AssetLoader {
  static async load() {
    await Assets.init({
      manifest: "/manifest.json",
    });

    await Assets.loadBundle("backgrounds");
    await Assets.loadBundle("gameLogo");
    await Assets.loadBundle("introScreen");
    await Assets.loadBundle("reelFrame");
    await Assets.loadBundle("gamePanel");
  }
}
