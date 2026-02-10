import * as PIXI from "pixi.js";

import {Assets} from "pixi.js"
export class Background extends PIXI.Container {
  app: PIXI.Application;
  // textures: Record<string, PIXI.Texture>;
  constructor(app: PIXI.Application) {
    super();
    // this.textures = AssetLoader.textures;
    // this.textures = AssetLoader.textures;
    this.app = app;
    this.build();
  }
  build() {
    const background = new PIXI.Sprite(Assets.get("bg.png"));
    background.position.set(
      this.app.screen.width / 2,
      this.app.screen.height / 2
    );
    background.anchor.set(0.5);
    background.scale.set(0.6, 0.52);

    const foreground = new PIXI.Sprite(Assets.get("bg.png"));
    foreground.position.set(
      this.app.screen.width / 2,
      this.app.screen.height / 2
    );
    foreground.anchor.set(0.5);
    foreground.scale.set(0.51, 0.5);

    this.addChild(background, foreground);
  }
}
