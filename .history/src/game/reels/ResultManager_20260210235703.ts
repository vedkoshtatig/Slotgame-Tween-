
import type { Reel } from "./ReelFactory";

export class ResultManager {
  constructor(
    private textures: PIXI.Texture[],
    private resultMatrix: number[][]
  ) {}

  applyResult(reel: Reel, reelIndex: number, visibleRows: number) {
    const result = this.resultMatrix[reelIndex];

    for (let row = 0; row < visibleRows; row++) {
      const symbol = reel.symbols[row + 1];
      symbol.texture = this.textures[result[row]];
    }
  }
}
