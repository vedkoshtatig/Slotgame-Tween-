import * as PIXI from "pixi.js";
import { ReelConfig } from "./ReelConfig";

export class MaskBuilder {
  static createMask(
    app: PIXI.Application,
    config: ReelConfig
  ): PIXI.Graphics {
    const maskWidth =
      config.reelCount * config.symbolSize +
      config.reelCount * config.reelGap;

    const maskHeight =
      config.visibleRows *
      (config.symbolSize + config.symbolGapY);

    const mask = new PIXI.Graphics()
      .rect(0, 0, maskWidth, maskHeight)
      .fill(0x000000);

    mask.pivot.set(maskWidth / 2, maskHeight / 2);
    mask.x = app.screen.width / 2 + 80;
    mask.y = app.screen.height / 2;

    return mask;
  }
}
