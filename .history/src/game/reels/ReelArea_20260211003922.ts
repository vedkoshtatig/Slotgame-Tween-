import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";

/*
   REEL INTERFACE
   Each reel stores:
   - container (visual column)
   - symbols (sprites inside reel)
   - position (virtual scroll position)
   - previousPosition (for blur speed calc)
   - blur filter instance
 */
interface Reel {
  container: PIXI.Container;
  symbols: PIXI.Sprite[];
  position: number;
  previousPosition: number;
  blur: PIXI.BlurFilter;
}

export class ReelArea extends PIXI.Container {
  private app: PIXI.Application;

 
    //  CONFIGURATION

  private reelCount = 5;
  private visibleRows = 3;
  private bufferRows = 2; // 1 top + 1 bottom buffer
  private totalRows = this.visibleRows + this.bufferRows;

  private symbolGapY = 20;
  private symbolSize = 130;
  private reelGap = 40;

  private reels: Reel[] = [];
  private normalTextures: PIXI.Texture[];

  private tweening: any[] = [];
  public isSpinning = false;
  private isTurbo = false;
public setTurbo(on: boolean) {
  this.isTurbo = on;
}

    //  PAYLINES
  
  private paylines: number[][] = [
    [0, 0, 0, 0, 0], // Top
    [1, 1, 1, 1, 1], // Middle
    [2, 2, 2, 2, 2], // Bottom
    [0, 1, 2, 1, 0], // V
    [2, 1, 0, 1, 2], // Inverted V
  ];


    //  PREDEFINED RESULT MATRIX

  private resultMatrix: number[][] = [
    [11, 11, 11],
    [11, 11, 5],
    [11, 11, 8],
    [9, 11, 5],
    [1, 2, 11],
  ];

  constructor(app: PIXI.Application) {
    super();
    this.app = app;

    // Load all symbol textures
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

 
    //  BUILD INITIAL REELS WITH RANDOM SYMBOLS

  private spawnRandomReels() {
    const totalWidth =
      this.reelCount * this.symbolSize + this.reelCount * this.reelGap;

    const startX = this.app.screen.width / 2 - totalWidth / 2 + 80;

    const centerY =
      this.app.screen.height / 2 -
      (this.visibleRows * (this.symbolSize + this.symbolGapY)) / 2 +
      10;

    for (let i = 0; i < this.reelCount; i++) {
      const container = new PIXI.Container();
      container.x = startX + i * (this.symbolSize + this.reelGap);
      container.y = centerY;

      const blur = new PIXI.BlurFilter();
      blur.blurX = 0;
      blur.blurY = 0;

      const reel: Reel = {
        container,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur,
      };

      // Create symbols (visible + buffer)
      for (let j = 0; j < this.totalRows; j++) {
        const texture =
          this.normalTextures[
            Math.floor(Math.random() * this.normalTextures.length)
          ];

        const symbol = new PIXI.Sprite(texture);
        symbol.width = symbol.height = this.symbolSize;

        // Stack vertically
        symbol.y = j * (this.symbolSize + this.symbolGapY);

        reel.symbols.push(symbol);
        container.addChild(symbol);
      }

      this.reels.push(reel);
      this.addChild(container);
    }
  }

    //  MASK 

  private buildMask() {
    const maskWidth =
      this.reelCount * this.symbolSize + this.reelCount * this.reelGap;

    const maskHeight =
      this.visibleRows * (this.symbolSize + this.symbolGapY);

    const mask = new PIXI.Graphics()
      .rect(0, 0, maskWidth, maskHeight)
      .fill(0x000000);

    mask.pivot.set(maskWidth / 2, maskHeight / 2);
    mask.x = this.app.screen.width / 2 + 80;
    mask.y = this.app.screen.height / 2;

    this.mask = mask;
    this.addChild(mask);
  }


    //  APPLY PREDEFINED RESULT TO VISIBLE ROWS
    //  (Row+1 because row 0 is buffer)

  private applyResult(reelIndex: number) {
    const reel = this.reels[reelIndex];
    const result = this.resultMatrix[reelIndex];

    for (let row = 0; row < this.visibleRows; row++) {
      const symbol = reel.symbols[row + 1];
      symbol.texture = this.normalTextures[result[row]];
    }
  }


    //  START SPIN

  public startSpin() {
    if (this.isSpinning) return;

    this.isSpinning = true;
    this.emit("spinStart");

    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];

      // Enable blur while spinning
      r.container.filters = [r.blur];

      const target = r.position + 20;

      const time = this.isTurbo ? 1200 : 2000 + i * 200;

      this.tweenTo(r, "position", target, time, this.backout(0.6), () => {
        r.blur.blurY = 0;
        r.container.filters = null;

        // When last reel stops
        if (i === this.reels.length - 1) {
          this.isSpinning = false;
          this.emit("spinComplete");
          this.checkWins();
        }
      });
    }
  }


    //  MAIN UPDATE LOOP

  private update() {
    const now = Date.now();
    const remove: any[] = [];

    /* ---------- TWEEN UPDATE ---------- */
    for (let i = 0; i < this.tweening.length; i++) {
      const t = this.tweening[i];
      const phase = Math.min(1, (now - t.start) / t.time);

      t.object[t.property] = this.lerp(
        t.propertyBeginValue,
        t.target,
        t.easing(phase)
      );

      if (phase === 1) {
        t.complete?.();
        remove.push(t);
      }
    }

    for (const r of remove) {
      this.tweening.splice(this.tweening.indexOf(r), 1);
    }

    /* ---------- REEL VISUAL UPDATE ---------- */
    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];

      // Blur intensity based on speed
      r.blur.blurY = (r.position - r.previousPosition) * 30;
      r.previousPosition = r.position;

      const symbolHeight = this.symbolSize + this.symbolGapY;

      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const prevY = s.y;

        // Virtual row calculation
        const virtualIndex = (r.position + j) % this.totalRows;

        // Convert to pixel position
        const yPosition = virtualIndex * symbolHeight;

        // Shift up by one buffer row
        s.y = yPosition - symbolHeight;

        // When symbol respawns at top → apply result
        if (s.y < 0 && prevY > this.symbolSize) {
          this.applyResult(i);
        }
      }
    }
  }


    //  WIN CHECKING

  private getSymbolIndex(reelIndex: number, row: number): number {
    const reel = this.reels[reelIndex];
    const symbol = reel.symbols[row + 1];
    return this.normalTextures.indexOf(symbol.texture);
  }

  private checkWins() {
    const winningLines: { line: number[]; count: number }[] = [];

    for (const line of this.paylines) {
      let matchCount = 1;
      const firstIndex = this.getSymbolIndex(0, line[0]);

      for (let reel = 1; reel < this.reelCount; reel++) {
        const currentIndex = this.getSymbolIndex(reel, line[reel]);

        if (currentIndex === firstIndex) matchCount++;
        else break;
      }

      if (matchCount >= 3) {
        winningLines.push({ line, count: matchCount });
      }
    }

    if (winningLines.length > 0) {
      this.playWinningLinesSequentially(winningLines);
    }
  }

  /* =====================================================
     PROGRESSIVE WIN ANIMATION

  private playWinningLinesSequentially(
    wins: { line: number[]; count: number }[],
    index = 0
  ) {
    if (index >= wins.length) return;

    const { line, count } = wins[index];

    this.animateProgressiveWin(line, count, () => {
      this.playWinningLinesSequentially(wins, index + 1);
    });
  }

  private animateProgressiveWin(
    line: number[],
    totalMatches: number,
    onComplete?: () => void
  ) {
    let currentCount = 3;

    const step = () => {
      this.dimAllVisible();

      const winners = [];

      for (let r = 0; r < currentCount; r++) {
        winners.push({ reel: r, row: line[r] });
      }

      this.highlightVisible(winners);

      if (currentCount < totalMatches) {
        currentCount++;
        setTimeout(step, 700);
      } else {
        setTimeout(() => {
          this.restoreAllVisible();
          onComplete?.();
        }, 900);
      }
    };

    step();
  }

  private dimAllVisible() {
    for (let reel = 0; reel < this.reelCount; reel++) {
      for (let row = 0; row < this.visibleRows; row++) {
        this.reels[reel].symbols[row + 1].alpha = 0.3;
      }
    }
  }

  private highlightVisible(winners: { reel: number; row: number }[]) {
    winners.forEach((pos) => {
      this.reels[pos.reel].symbols[pos.row + 1].alpha = 1;
    });
  }

  private restoreAllVisible() {
    for (let reel = 0; reel < this.reelCount; reel++) {
      for (let row = 0; row < this.visibleRows; row++) {
        this.reels[reel].symbols[row + 1].alpha = 1;
      }
    }
  }

  /* =====================================================
     TWEEN SYSTEM
  ===================================================== */
  private tweenTo(
    object: any,
    property: string,
    target: number,
    time: number,
    easing: (t: number) => number,
    oncomplete?: () => void
  ) {
    this.tweening.push({
      object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      complete: oncomplete,
      start: Date.now(),
    });
  }

  private lerp(a1: number, a2: number, t: number) {
    return a1 * (1 - t) + a2 * t;
  }

  private backout(amount: number) {
    return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
  }
}
