import * as PIXI from "pixi.js";
import { Reel } from "./Reel";
import { SYMBOL_SIZE, SYMBOL_GAP_Y, TOTAL_ROWS } from "./ReelConfig";

export class ReelFactory {

  static createReel(
    textures: PIXI.Texture[],
    x: number,
    y: number
  ): Reel {

    const container = new PIXI.Container();
    container.x = x;
    container.y = y;

    const blur = new PIXI.BlurFilter();

    const reel: Reel = {
      container,
      symbols: [],
      position: 0,
      previousPosition: 0,
      blur,
    };

    for (let j = 0; j < TOTAL_ROWS; j++) {
      const texture =
        textures[Math.floor(Math.random() * textures.length)];

      const symbol = new PIXI.Sprite(texture);
      symbol.width = symbol.height = SYMBOL_SIZE;
      symbol.y = j * (SYMBOL_SIZE + SYMBOL_GAP_Y);

      reel.symbols.push(symbol);
      container.addChild(symbol);
    }

    return reel;
  }
}
