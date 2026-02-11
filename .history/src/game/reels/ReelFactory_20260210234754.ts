// reels/ReelFactory.ts

import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";
import { Reel } from "./Reel";
import { ReelConfig } from "./ReelConfig";

export class ReelFactory {
  static createReels(app: PIXI.Application): {
    reels: Reel[];
    textures: PIXI.Texture[];
  } {
    const reels: Reel[] = [];

    const textures: PIXI.Texture[] = [
      Assets.get("a.png"),
      Assets.get("b.png"),
      Assets.get("c.png"),
      Assets.get("d.png"),
      Assets.get("e.png"),
      Assets.get("f.png"),
      Assets.get("g.png"),
      Assets.get("h.png"),
      Assets.get("i.png"),
      Assets.get("k.png"),
      Assets.get("s.png"),
      Assets.get("w.png"),
    ];

    const totalRows =
      ReelConfig.visibleRows + ReelConfig.bufferRows;

    const totalWidth =
      ReelConfig.reelCount * ReelConfig.symbolSize +
      ReelConfig.reelCount * ReelConfig.reelGap;

    const startX =
      app.screen.width / 2 - totalWidth / 2 + 80;

    const centerY =
      app.screen.height / 2 -
      (ReelConfig.visibleRows *
        (ReelConfig.symbolSize + ReelConfig.symbolGapY)) /
        2 +
      10;

    for (let i = 0; i < ReelConfig.reelCount; i++) {
      const container = new PIXI.Container();
      container.x =
        startX +
        i *
          (ReelConfig.symbolSize +
            ReelConfig.reelGap);
      container.y = centerY;

      const blur = new PIXI.BlurFilter();

      const reel: Reel = {
        container,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur,
      };

      for (let j = 0; j < totalRows; j++) {
        const texture =
          textures[
            Math.floor(
              Math.random() * textures.length
            )
          ];

        const symbol = new PIXI.Sprite(texture);
        symbol.width =
          symbol.height =
            ReelConfig.symbolSize;

        symbol.y =
          j *
          (ReelConfig.symbolSize +
            ReelConfig.symbolGapY);

        reel.symbols.push(symbol);
        container.addChild(symbol);
      }

      reels.push(reel);
    }

    return { reels, textures };
  }
}
