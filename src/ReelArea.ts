import * as PIXI from "pixi.js";
import { SymbolLoader } from "./SymbolLoader";
import {AssetLoader} from "./AssetLoader"


export class ReelArea extends PIXI.Container {
  normalSymbolTextures: PIXI.Texture[];
  blurSymbolTextures: PIXI.Texture[];
  app: PIXI.Application;
  reelsContainer: PIXI.Container;
  textures : Record<string, PIXI.Texture >

  constructor(app: PIXI.Application) {
    super();
    this.app = app;
    this.normalSymbolTextures = SymbolLoader.symbols.normal;
    this.blurSymbolTextures = SymbolLoader.symbols.blur;
    this.textures = AssetLoader.textures

    this.reelsContainer = new PIXI.Container();
    this.addChild(this.reelsContainer);

    this.buildMask();
  }

  buildMask() {
    const maskRect = new PIXI.Graphics();

    maskRect.rect(0, 0, 845, 460);
    maskRect.fill(0x00ff00);
    maskRect.pivot.set(maskRect.width / 2, maskRect.height / 2);
    maskRect.position.set(
      this.app.screen.width / 2 + 63,
      this.app.screen.height / 2 + 7
    );

    this.reelsContainer.mask = maskRect;
    this.addChild(maskRect);
    const bg = new PIXI.Sprite(this.textures.background)
    bg.position.set(this.app.screen.width/2+63,this.app.screen.height/2)
    bg.anchor.set(0.5)
    bg.scale.set(0.5)
    this.reelsContainer.addChild(bg)
  }
}
