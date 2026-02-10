import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";

interface Reel {
  container: PIXI.Container;
  symbols: PIXI.Sprite[];
  position: number;
  previousPosition: number;
}

export class ReelArea extends PIXI.Container {
  private app: PIXI.Application;

  private reels: Reel[] = [];
  private normalTextures: PIXI.Texture[];

  private readonly reelCount = 5;
  private readonly visibleRows = 3;
  private readonly bufferRows = 2;
  private readonly totalRows = this.visibleRows + this.bufferRows;

  private readonly symbolGapY = 20;
  private readonly symbolSize = 130;
  private readonly reelGap = 40;

  private isSpinning = false;
  private spinSpeed = 30;
  private spinDuration = 3000;
  private elapsed = 0;

  constructor(app: PIXI.Application) {
    super();
    this.app = app;

    this.normalTextures = [
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

    this.buildReels();
    this.buildMask();
  }

  // -------------------------
  // BUILD REELS
  // -------------------------

  private buildReels() {
    const totalWidth =
      this.reelCount * this.symbolSize +
      (this.reelCount - 1) * this.reelGap;

    const startX = this.app.screen.width / 2 - totalWidth / 2;

    const visibleHeight =
      this.visibleRows * this.symbolSize +
      (this.visibleRows - 1) * this.symbolGapY;

    const startY = this.app.screen.height / 2 - visibleHeight / 2;

    for (let i = 0; i < this.reelCount; i++) {
      const container = new PIXI.Container();

      container.x = startX + i * (this.symbolSize + this.reelGap);
      container.y = startY;

      const reel: Reel = {
        container,
        symbols: [],
        position: 0,
        previousPosition: 0,
      };

      for (let j = 0; j < this.totalRows; j++) {
        const texture =
          this.normalTextures[
            Math.floor(Math.random() * this.normalTextures.length)
          ];

        const symbol = new PIXI.Sprite(texture);
        symbol.width = symbol.height = this.symbolSize;

        const step = this.symbolSize + this.symbolGapY;
        symbol.y = (j - 1) * step;

        reel.symbols.push(symbol);
        container.addChild(symbol);
      }

      this.reels.push(reel);
      this.addChild(container);
    }
  }

  // -------------------------
  // MASK
  // -------------------------

  private buildMask() {
    const maskWidth =
      this.reelCount * this.symbolSize +
      (this.reelCount - 1) * this.reelGap;

    const maskHeight =
      this.visibleRows * this.symbolSize +
      (this.visibleRows - 1) * this.symbolGapY;

    const mask = new PIXI.Graphics()
      .rect(0, 0, maskWidth, maskHeight)
      .fill(0xffffff);

    mask.pivot.set(maskWidth / 2, maskHeight / 2);

    mask.x = this.app.screen.width / 2;
    mask.y = this.app.screen.height / 2;

    this.mask = mask;
    this.addChild(mask);
  }

  // -------------------------
  // PUBLIC SPIN CONTROL
  // -------------------------

  public startSpin() {
    if (this.isSpinning) return;

    this.isSpinning = true;
    this.elapsed = 0;

    this.app.ticker.add(this.updateSpin, this);
  }

  private stopSpin() {
    this.isSpinning = false;
    this.app.ticker.remove(this.updateSpin, this);

    const step = this.symbolSize + this.symbolGapY;

    for (const reel of this.reels) {
      const remainder = reel.position % step;
      reel.position -= remainder;

      for (let i = 0; i < reel.symbols.length; i++) {
        reel.symbols[i].y = (i - 1) * step;
      }
    }
  }

  // -------------------------
  // SPIN LOOP
  // -------------------------

  private updateSpin(delta: number) {
    if (!this.isSpinning) return;

    const deltaMS = this.app.ticker.deltaMS;
    this.elapsed += deltaMS;

    const step = this.symbolSize + this.symbolGapY;

    for (const reel of this.reels) {
      reel.previousPosition = reel.position;
      reel.position += this.spinSpeed * delta;

      const diff = reel.position - reel.previousPosition;

      for (const symbol of reel.symbols) {
        symbol.y += diff;

        const maxY = (this.visibleRows + 1) * step;

        if (symbol.y > maxY) {
          symbol.y -= this.totalRows * step;

          symbol.texture =
            this.normalTextures[
              Math.floor(Math.random() * this.normalTextures.length)
            ];
        }
      }
    }

    if (this.elapsed >= this.spinDuration) {
      this.stopSpin();
    }
  }
}
