// reels/ReelArea.ts

import * as PIXI from "pixi.js";
import as type Reel  from "./Reel";
import { ReelFactory } from "./ReelFactory";
import { ReelConfig } from "./ReelConfig";
import { SpinController } from "./SpinController";
import { ResultController } from "./ResultController";

export class ReelArea extends PIXI.Container {
  private reels: Reel[];
  private spinController: SpinController;
  private resultController: ResultController;

  constructor(private app: PIXI.Application) {
    super();

    const { reels, textures } =
      ReelFactory.createReels(app);

    this.reels = reels;

    this.reels.forEach((r) =>
      this.addChild(r.container)
    );

    this.resultController =
      new ResultController(
        this.reels,
        textures
      );

    this.spinController =
      new SpinController(
        this.reels,
        (index) =>
          this.resultController.applyResult(
            index
          ),
        () => {
          this.emit("spinComplete");
        }
      );

    this.buildMask();

    this.app.ticker.add(
      this.update,
      this
    );

    window.addEventListener(
      "keydown",
      (e) => {
        if (e.code === "Space") {
          this.spinController.startSpin();
        }
      }
    );
  }

  private buildMask() {
    const maskWidth =
      ReelConfig.reelCount *
        ReelConfig.symbolSize +
      ReelConfig.reelCount *
        ReelConfig.reelGap;

    const maskHeight =
      ReelConfig.visibleRows *
      (ReelConfig.symbolSize +
        ReelConfig.symbolGapY);

    const mask = new PIXI.Graphics()
      .rect(0, 0, maskWidth, maskHeight)
      .fill(0x000000);

    mask.pivot.set(
      maskWidth / 2,
      maskHeight / 2
    );

    mask.x =
      this.app.screen.width / 2 + 80;

    mask.y =
      this.app.screen.height / 2;

    this.mask = mask;
    this.addChild(mask);
  }

  private update() {
    this.spinController.update();

    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];

      r.blur.blurY =
        (r.position -
          r.previousPosition) *
        30;

      r.previousPosition =
        r.position;

      const symbolHeight =
        ReelConfig.symbolSize +
        ReelConfig.symbolGapY;

      const totalRows =
        ReelConfig.visibleRows +
        ReelConfig.bufferRows;

      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];

        const virtualIndex =
          (r.position + j) %
          totalRows;

        const yPosition =
          virtualIndex *
          symbolHeight;

        s.y = yPosition - symbolHeight;
      }
    }
  }
}
