import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";

interface Reel {
  container: PIXI.Container;
  symbols: PIXI.Sprite[];
  position: number;
  previousPosition: number;
  blur: PIXI.BlurFilter;
}

export class ReelArea extends PIXI.Container {
  private app: PIXI.Application;
  private reels: Reel[] = [];
  private normalTextures: PIXI.Texture[];
private isTurbo = false;

  private reelCount = 5;
  private visibleRows = 3;
  private bufferRows = 2;
  private totalRows = this.visibleRows + this.bufferRows;

  private symbolGapY = 20;
  private symbolSize = 130;
  private reelGap = 40;

  private tweening: any[] = [];
  private isSpinning = false;

  private resultMatrix: number[][] = [
    [0, 11, 2], // Reel 0
    [3, 11, 5], // Reel 1
    [6, 11, 8], // Reel 2
    [9, 11, 11], // Reel 3
    [1, 11, 5], // Reel 4
  ];

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

    this.spawnRandomReels();
    this.buildMask();

    this.app.ticker.add(this.update, this);

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        this.startSpin();
      }
    });
  }

  // BUILD REELS
  public setTurbo(on: boolean) {
  this.isTurbo = on;
}

  private spawnRandomReels() {
    const totalWidth =
      this.reelCount * this.symbolSize + this.reelCount * this.reelGap;

    const startX = this.app.screen.width / 2 - totalWidth / 2 + 80;

    const centerY =
      this.app.screen.height / 2 -
      (this.visibleRows * (this.symbolSize + this.symbolGapY)) / 2+500;

    for (let i = 0; i < this.reelCount; i++) {
      const container = new PIXI.Container();
      container.x = startX + i * (this.symbolSize + this.reelGap);
      container.y = centerY;

      const blur = new PIXI.BlurFilter();
      blur.blurX = 0;
      blur.blurY = 0;

      container.filters = null;

      const reel: Reel = {
        container,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur,
      };

      for (let j = 0; j < this.totalRows; j++) {
        const texture =
          this.normalTextures[
            Math.floor(Math.random() * this.normalTextures.length)
          ];

        const symbol = new PIXI.Sprite(texture);
        symbol.width = symbol.height = this.symbolSize;

        symbol.y = j * (this.symbolSize + this.symbolGapY);

        reel.symbols.push(symbol);
        container.addChild(symbol);
      }

      this.reels.push(reel);
      console.log(this.reels);
      this.addChild(container);
    }
  }

  // MASK

  private buildMask() {
    const maskWidth =
      this.reelCount * this.symbolSize + this.reelCount * this.reelGap;

    const maskHeight = this.visibleRows * (this.symbolSize + this.symbolGapY);

    const mask = new PIXI.Graphics()
      .rect(0, 0, maskWidth, maskHeight)
      .fill(0x000000);

    mask.pivot.set(maskWidth / 2, maskHeight / 2);
    mask.x = this.app.screen.width / 2 + 80;
    mask.y = this.app.screen.height / 2;

    this.mask = mask;
    this.addChild(mask);
  }

  //Predefined result
  private applyResult(reelIndex: number) {
    const reel = this.reels[reelIndex];
    const result = this.resultMatrix[reelIndex];

    for (let row = 0; row < this.visibleRows; row++) {
      const symbol = reel.symbols[row + 1];

      symbol.texture = this.normalTextures[result[row]];
    }
  }

  // START SPIN

  public startSpin() {
    if (this.isSpinning) return;
    this.isSpinning = true;
      this.emit("spinStart");
    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];

      // ENABLE blur
      r.container.filters = [r.blur];

      const target = r.position + 20;
      let time ;
      if(this.isTurbo){
      time=1200
      }else{
        time=2000+i*200
      }

      this.tweenTo(r, "position", target, time, this.backout(0.6), () => {
        // DISABLE blur when reel stops
        r.blur.blurY = 0;
        r.container.filters = null;

        if (i === this.reels.length - 1) {
          this.isSpinning = false;
             this.emit("spinComplete");
          console.log("Spin Complete");
        }
      });
    }
  }

  // UPDATE LOOP

  private update() {
    const now = Date.now();
    const remove: any[] = [];

    // Tween update
    for (let i = 0; i < this.tweening.length; i++) {
      const t = this.tweening[i];
      const phase = Math.min(1, (now - t.start) / t.time);

      t.object[t.property] = this.lerp(
        t.propertyBeginValue,
        t.target,
        t.easing(phase)
      );

      if (phase === 1) {
        if (t.complete) t.complete();
        remove.push(t);
      }
    }

    for (let i = 0; i < remove.length; i++) {
      this.tweening.splice(this.tweening.indexOf(remove[i]), 1);
    }

    // Reel movement update
    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];

      // Dynamic blur based on speed
      r.blur.blurY = (r.position - r.previousPosition) * 30;
      r.previousPosition = r.position;

      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const prevY = s.y;

        //Respawn at top

        const symbolHeight = this.symbolSize + this.symbolGapY;

        // 1. Calculate virtual row index
        const virtualIndex = (r.position + j) % this.totalRows;

        // 2. Convert row index to pixel position
        const yPosition = virtualIndex * symbolHeight;

        // 3. Shift up by one row (because of buffer)
        s.y = yPosition - symbolHeight;

        if (s.y < 0 && prevY > this.symbolSize) {
          this.applyResult(i);
        }
      }
    }
  }

  // TWEEN SYSTEM

  private tweenTo(
    object: any,
    property: string,
    target: number,
    time: number,
    easing: (t: number) => number,
    oncomplete?: () => void
  ) {
    const tween = {
      object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      complete: oncomplete,
      start: Date.now(),
    };

    this.tweening.push(tween);
  }

  private lerp(a1: number, a2: number, t: number) {
    return a1 * (1 - t) + a2 * t;
  }

  private backout(amount: number) {
    return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
  }
}
