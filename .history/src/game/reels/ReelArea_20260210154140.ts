import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";

interface Reel {
  container: PIXI.Container;
  symbols: PIXI.Sprite[];
  position: number;
  previousPosition: number;
  // blur: PIXI.BlurFilter;
}

export class ReelArea extends PIXI.Container {
  private app: PIXI.Application;
  private reels: Reel[] = [];
  private normalTextures: PIXI.Texture[];

  private reelCount = 5;
  private visibleRows = 3;
  private bufferRows = 2;
  private totalRows = this.visibleRows + this.bufferRows;

  private symbolGapY = 20;
  private symbolSize = 130;
  private reelGap = 40;

  private tweening: any[] = [];

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

    this.app.ticker.add(this.update, this);
     window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      this.startSpin();
    }
  });
  }

  // =========================
  // BUILD REELS
  // =========================
  private buildReels() {
    const totalWidth =
      this.reelCount * this.symbolSize +
      this.reelCount * this.reelGap;

    const startX =
      this.app.screen.width / 2 - totalWidth / 2;

    const centerY =
      this.app.screen.height / 2 -
      (this.visibleRows * (this.symbolSize + this.symbolGapY)) / 2;

    for (let i = 0; i < this.reelCount; i++) {
      const container = new PIXI.Container();
      container.x = startX + i * (this.symbolSize + this.reelGap);
      container.y = centerY;

      // const blur = new PIXI.BlurFilter();
      // container.filters = [blur];

      const reel: Reel = {
        container,
        symbols: [],
        position: 0,
        previousPosition: 0,
        // blur,
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
      this.addChild(container);
    }
  }

  // =========================
  // MASK
  // =========================
  private buildMask() {
    const maskWidth =
      this.reelCount * this.symbolSize +
      this.reelCount * this.reelGap;

    const maskHeight =
      this.visibleRows * (this.symbolSize + this.symbolGapY);

    const mask = new PIXI.Graphics()
      .rect(0, 0, maskWidth, maskHeight)
      .fill(0x000000);

    mask.pivot.set(maskWidth / 2, maskHeight / 2);
    mask.x = this.app.screen.width / 2;
    mask.y = this.app.screen.height / 2;

    this.mask = mask;
    this.addChild(mask);
  }

  // =========================
  // START SPIN
  // =========================
  public startSpin() {
    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];

      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 20 + i * 5 + extra;
      const time = 2000 + i * 500;

      this.tweenTo(
        r,
        "position",
        target,
        time,
        this.backout(0.6),
        i === this.reels.length - 1
          ? () => console.log("Spin Complete")
          : undefined
      );
    }
  }

  // =========================
  // UPDATE LOOP
  // =========================
  private update() {
    const now = Date.now();
    const remove: any[] = [];

    // ---- Tween update ----
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

    // ---- Reel movement update ----
    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];

      r.blur.blurY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;

      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const prevY = s.y;

        s.y =
          ((r.position + j) % this.totalRows) *
            (this.symbolSize + this.symbolGapY) -
          (this.symbolSize + this.symbolGapY);

        if (s.y < 0 && prevY > this.symbolSize) {
          s.texture =
            this.normalTextures[
              Math.floor(Math.random() * this.normalTextures.length)
            ];
        }
      }
    }
  }

  // =========================
  // TWEEN SYSTEM
  // =========================
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
