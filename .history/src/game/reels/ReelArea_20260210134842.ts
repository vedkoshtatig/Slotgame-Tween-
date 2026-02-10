import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";

interface Reel {
  container: PIXI.Container;
  symbols: PIXI.Sprite[];
  position: number;
  previousPosition: number;
  spinning: boolean;
  blur: PIXI.BlurFilter;
}

export class ReelArea extends PIXI.Container {
  app: PIXI.Application;

  reelCount = 5;
  visibleRows = 3;
  bufferRows = 2; // 1 top + 1 bottom
  totalRows = this.visibleRows + this.bufferRows;

  symbolSize = 130;
  reelGap = 40;

  reels: Reel[] = [];

  spinSpeed = 0.5; // logical speed, not pixels

  normalTextures: PIXI.Texture[];

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
    ];

    this.buildReels();
    this.buildMask();

    this.app.ticker.add(this.update, this);

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        this.startSpin();
      }
    });
  }

  buildReels() {
    const totalWidth =
      this.reelCount * this.symbolSize +
      (this.reelCount - 1) * this.reelGap;

    const startX =
      this.app.screen.width / 2 - totalWidth / 2;

    for (let i = 0; i < this.reelCount; i++) {
      const container = new PIXI.Container();
      container.x = startX + i * (this.symbolSize + this.reelGap);

      const blur = new PIXI.BlurFilter();
      blur.blurY = 0;
      container.filters = [blur];

      const reel: Reel = {
        container,
        symbols: [],
        position: 0,
        previousPosition: 0,
        spinning: false,
        blur,
      };

      // Create symbols (with buffer)
      for (let j = 0; j < this.totalRows; j++) {
        const texture =
          this.normalTextures[
            Math.floor(Math.random() * this.normalTextures.length)
          ];

        const symbol = new PIXI.Sprite(texture);
        symbol.width = symbol.height = this.symbolSize;

        // Important: start with top buffer offset
        symbol.y =
          (j - 1) * this.symbolSize;

        reel.symbols.push(symbol);
        container.addChild(symbol);
      }

      this.reels.push(reel);
      this.addChild(container);
    }
  }

  buildMask() {
    const mask = new PIXI.Graphics()
      .rect(0, 0, this.symbolSize * this.reelCount + this.reelGap * (this.reelCount - 1), this.symbolSize * this.visibleRows)
      .fill(0x000000);

    mask.x = this.reels[0].container.x;
    mask.y = (this.app.screen.height - this.symbolSize * this.visibleRows) / 2;

    this.mask = mask;
    this.addChild(mask);

    this.y = mask.y;
  }

  startSpin() {
    this.reels.forEach((reel, index) => {
      reel.spinning = true;

      // stagger effect
      setTimeout(() => {
        reel.spinning = false;
      }, 2000 + index * 400);
    });
  }

  update(delta: number) {
    for (const reel of this.reels) {
      if (!reel.spinning) continue;

      reel.position += this.spinSpeed * delta;

      // Blur based on speed
      reel.blur.blurY =
        (reel.position - reel.previousPosition) * 8;

      reel.previousPosition = reel.position;

      for (let i = 0; i < reel.symbols.length; i++) {
        const symbol = reel.symbols[i];

        const prevY = symbol.y;

        symbol.y =
          ((reel.position + i) % this.totalRows) *
            this.symbolSize -
          this.symbolSize;

        // Detect wrap (bottom → top)
        if (symbol.y < 0 && prevY > this.symbolSize * (this.visibleRows)) {
          symbol.texture =
            this.normalTextures[
              Math.floor(Math.random() * this.normalTextures.length)
            ];
        }
      }
    }
  }
}
