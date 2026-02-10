import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";

interface Reel {
  container: PIXI.Container;
  symbols: PIXI.Sprite[];
  position: number;
  previousPosition: number;
}

export class ReelArea extends PIXI.Container {
  app: PIXI.Application;

  reelCount = 5;
  visibleRows = 3;
  bufferRows = 2; // 1 top + 1 bottom
  totalRows = this.visibleRows + this.bufferRows;
  symbolGapY = 20; // try 15–30 range

  symbolSize = 135;
  reelGap = 40;

  reels: Reel[] = [];

  normalTextures: PIXI.Texture[];

  constructor(app: PIXI.Application) {
    super();
    this.app = app;

    // Load textures (already loaded via AssetPack or preload)
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

  private buildReels() {
    const totalWidth =
      this.reelCount * this.symbolSize +
      (this.reelCount ) * this.reelGap;

    const startX =
      this.app.screen.width / 2 - totalWidth / 2+ this.reelGap*2 ;

    const centerY =
      this.app.screen.height / 2 -
      (this.visibleRows * this.symbolSize + this.visibleRows*this.symbolGapY) / 2;

    for (let i = 0; i < this.reelCount; i++) {
      const container = new PIXI.Container();
      container.x = startX + i * (this.symbolSize + this.reelGap);
      container.y = centerY;

      const reel: Reel = {
        container,
        symbols: [],
        position: 0,
        previousPosition: 0,
      };

      // Create 5 symbols (1 top buffer, 3 visible, 1 bottom buffer)
      for (let j = 0; j < this.totalRows; j++) {
        const texture =
          this.normalTextures[
            Math.floor(Math.random() * this.normalTextures.length)
          ];

        const symbol = new PIXI.Sprite(texture);
        symbol.width = symbol.height = this.symbolSize;

        // IMPORTANT: top buffer offset
        symbol.y = (j - 1) * (this.symbolSize + this.symbolGapY);


        reel.symbols.push(symbol);
        container.addChild(symbol);
      }

      this.reels.push(reel);
      this.addChild(container);
    }
  }

  private buildMask() {
    const maskWidth =
      this.reelCount * this.symbolSize +
      (this.reelCount - 1) * this.reelGap;

    const maskHeight = (this.visibleRows * this.symbolSize)+this.visibleRows*this.symbolGapY;

    const mask = new PIXI.Graphics()
      .rect(0, 0, maskWidth, maskHeight)
      .fill(0x00000);

    mask.pivot.set(maskWidth/2,maskHeight/2)

    mask.x = this.app.screen.width/2;
    mask.y = this.app.screen.height/2;

    // this.mask = mask;
    this.addChild(mask);
  }
}
