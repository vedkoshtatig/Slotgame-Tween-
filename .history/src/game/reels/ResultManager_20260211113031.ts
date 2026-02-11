import type { Reel } from "./Reel";
import { VISIBLE_ROWS } from "./ReelConfig";
import * as PIXI from "pixi.js";

export class ResultManager {
  private resultMatrix: number[][] = [
    [11, 11, 11],
    [11, 11, 5],
    [11, 11, 8],
    [9, 11, 5],
    [1, 2, 11],
  ];

  constructor(private textures: PIXI.Texture[]) {}

  applyResultToReel(reel: Reel, reelIndex: number) {
    const result = this.resultMatrix[reelIndex];

    for (let row = 0; row < VISIBLE_ROWS; row++) {
      const symbol = reel.symbols[row + 1]; // skip buffer
      symbol.texture = this.textures[result[row]];
    }
  }
}
