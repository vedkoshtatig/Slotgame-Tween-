import * as PIXI from "pixi.js";
import { ReelConfig } from "../config/ReelConfig";

export interface Reel {
  container: PIXI.Container;
  symbols: PIXI.Sprite[];
  position: number;
  previousPosition: number;
  blur: PIXI.BlurFilter;
}

export class ReelFactory {
  static createReels(
    app: PIXI.Application,
    textures: PIXI.Texture[],
    config: ReelConfig
  ): Reel[] {
    const reels: Reel[] = [];

    const totalWidth =
      config.reelCount * config.symbolSize +
      config.reelCount * config.reelGap;

    const startX = app.screen.width / 2 - totalWidth / 2 + 80;

    const centerY =
      app.screen.height / 2 -
      (config.visibleRows *
        (config.symbolSize + config.symbolGapY)) /
        2 +
      10;

    for (let i = 0; i < config.reelCount; i++) {
      const container = new PIXI.Container();
      container.x = startX + i * (config.symbolSize + config.reelGap);
      container.y = centerY;

      const blur = new PIXI.BlurFilter();

      const reel: Reel = {
        container,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur,
      };

      for (let j = 0; j < config.totalRows; j++) {
        const texture =
          textures[Math.floor(Math.random() * textures.length)];

        const symbol = new PIXI.Sprite(texture);
        symbol.width = symbol.height = config.symbolSize;
        symbol.y = j * (config.symbolSize + config.symbolGapY);

        reel.symbols.push(symbol);
        container.addChild(symbol);
      }

      reels.push(reel);
    }

    return reels;
  }
}
