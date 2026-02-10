// systems/BlurSpinSystem.ts
import * as PIXI from "pixi.js";
import { REEL_CONFIG } from "../config/ReelConfig";

export class BlurSpinSystem {
  private blurReelsContainer?: PIXI.Container;
  private isRunning = false;

  constructor(
    private app: PIXI.Application,
    private reelsContainer: PIXI.Container,
    private blurTextures: PIXI.Texture[]
  ) {}

  start() {
    if (this.isRunning) return;

    this.spawnBlurReels();

    this.isRunning = true;
    this.app.ticker.add(this.update, this);
  }

  stop() {
    if (!this.blurReelsContainer) return;

    this.isRunning = false;
    this.app.ticker.remove(this.update, this);

    this.blurReelsContainer.removeFromParent();
    this.blurReelsContainer.destroy({ children: true });
    this.blurReelsContainer = undefined;
  }

  private spawnBlurReels() {
    // Destroy previous blur reels if any
    this.blurReelsContainer?.destroy({ children: true });

    const container = new PIXI.Container();

    for (let i = 0; i < REEL_CONFIG.reelCount; i++) {
      const reel = new PIXI.Container();
      reel.x =
        i *
        (REEL_CONFIG.symbolSize +
          REEL_CONFIG.reelGap);

      for (let j = 0; j < REEL_CONFIG.rowsCount; j++) {
        const tex =
          this.blurTextures[
            Math.floor(Math.random() * this.blurTextures.length)
          ];

        const symbol = new PIXI.Sprite(tex);
        symbol.width = symbol.height =
          REEL_CONFIG.symbolSize;
        symbol.y =
          j *
          (REEL_CONFIG.symbolSize +
            REEL_CONFIG.symbolGapY);

        reel.addChild(symbol);
      }

      container.addChild(reel);
    }

    container.x = this.reelsContainer.x + 420;
    container.y =
      REEL_CONFIG.rowsCount *
      (REEL_CONFIG.symbolSize +
        REEL_CONFIG.symbolGapY);

    this.reelsContainer.addChild(container);
    this.blurReelsContainer = container;
  }

  private update(ticker: PIXI.Ticker) {
    if (!this.blurReelsContainer) return;

    const maxHeight =
      REEL_CONFIG.rowsCount *
        (REEL_CONFIG.symbolSize +
          REEL_CONFIG.symbolGapY) -
      100;

    for (const reel of this.blurReelsContainer
      .children as PIXI.Container[]) {
      for (const symbol of reel.children as PIXI.Sprite[]) {
        symbol.y +=
          REEL_CONFIG.spinSpeed *
          ticker.deltaTime;

        if (symbol.y >= maxHeight) {
          symbol.y = 0;
        }
      }
    }
  }
}
