// reels/ResultController.ts

import { Reel } from "./Reel";
import { ReelConfig } from "./ReelConfig";
import * as PIXI from "pixi.js";

export class ResultController {
  constructor(
    private reels: Reel[],
    private textures: PIXI.Texture[]
  ) {}

  private resultMatrix: number[][] = [
    [0, 11, 2],
    [3, 11, 5],
    [6, 11, 8],
    [9, 11, 11],
    [1, 11, 5],
  ];

  applyResult(reelIndex: number) {
    const reel = this.reels[reelIndex];
    const result = this.resultMatrix[reelIndex];

    for (
      let row = 0;
      row < ReelConfig.visibleRows;
      row++
    ) {
      const symbol = reel.symbols[row + 1];
      symbol.texture =
        this.textures[result[row]];
    }
  }
}
