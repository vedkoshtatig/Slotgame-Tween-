import * as PIXI from "pixi.js";
// import { SymbolLoader } from "./SymbolLoader";
import { StakeControl } from "./StakeControl";
import {Assets} from "pixi.js"

export class ReelArea extends PIXI.Container {
  // config
  payLines: number[][];
  resultMatrix: number[][][];
  reelCount = 5;
  rowsCount = 5;
  symbolSize = 130;
  reelGap = 41;
  symbolGapY = 20;
  reels: PIXI.Container[] = [];

  spinSpeed = 45;
  fallSpeed = 45;

  // state
  isSpinning = false;

  isFalling = false;
  isBlurSpinning = false;

  // pixi refs
  app: PIXI.Application;
  reelsContainer: PIXI.Container;
  blurReelsContainer?: PIXI.Container;
  StakeControl: StakeControl;

  // textures
  normalSymbolTextures: PIXI.Texture[];
  blurSymbolTextures: PIXI.Texture[];
  //State
  currentMatrix: number[][] | null = null;

  resState: number;
  constructor(app: PIXI.Application, stakeControl: StakeControl) {
    super();
    this.app = app;
    this.resState = 0;
    this.payLines = [
      [1, 1, 1, 1, 1], 
      [2, 2, 2, 2, 2],
      [3, 3, 3, 3, 3],
      [1, 2, 3, 2, 1], // V shape within visible area
      [3, 2, 1, 2, 3],
    ];

    this.resultMatrix = [
      // Matrix 1
      [
        [0, 3, 11, 5, 1],
        [1, 1, 11, 0, 2],
        [1, 6, 11, 11, 4],
        [3, 0, 11, 5, 5],
        [4, 1, 11, 3, 2],
      ],

      // Matrix 2
      [
        [5, 6, 2, 9, 11],
        [4, 1, 2, 0, 5],
        [1, 1, 2, 1, 1],
        [3, 5, 2, 2, 4],
        [6, 4, 2, 3, 1],
      ],

      // Matrix 3
      [
        [5, 4, 3, 2, 1],
        [0, 1, 3, 3, 4],
        [4, 4, 3, 4, 4],
        [2, 3, 3, 1, 0],
        [1, 0, 3, 3, 5],
      ],
      [
        [5, 4, 6, 2, 1],
        [0, 1, 6, 3, 4],
        [4, 4, 6, 4, 4],
        [2, 3, 6, 1, 0],
        [1, 0, 6, 3, 5],
      ],
    ];

    this.normalSymbolTextures = [SymbolLoader.symbols.normal;]
    this.blurSymbolTextures = SymbolLoader.symbols.blur;
    this.StakeControl = stakeControl;
    this.reelsContainer = new PIXI.Container();
    this.addChild(this.reelsContainer);

    this.buildMask();
    this.initSpawnNormalReels();

    this.reelsContainer.y = -this.reelHeight;

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        if (!this.isBlurSpinning) {
          this.spin();
          this.StakeControl.UpdateBalance();
        }
      }
    });
  }

  get reelHeight() {
    return this.rowsCount * (this.symbolSize + this.symbolGapY);
  }

  getRandomResultMatrix(): number[][] {
    const index = Math.floor(Math.random() * this.resultMatrix.length);
    return this.resultMatrix[index];
  }

  spin() {
    if (this.isSpinning) return;
    this.isSpinning = true;
    const randomMatrix = this.getRandomResultMatrix();
    this.currentMatrix = randomMatrix;

    if (this.resState < 2) {
      // normal random spins
      this.spawnNormalReels();
      this.resState++;
    } else {
      // predefined result spin
      this.spawnResultReels(randomMatrix);
      this.resState = 0;
    }

    // pre difened
    //  this.spawnResultReels(randomMatrix);
    // random
    // this.spawnNormalReels();

    // reset position for fall animation
    this.reelsContainer.y = -this.reelHeight;

    this.startBlurSpin();

    setTimeout(() => {
      this.stopBlurSpin();
    
    }, 1500);

    setTimeout(() => {
      this.startFall();
    }, 1000);
  }

  // MASK

  buildMask() {
    const mask = new PIXI.Graphics();
    mask.rect(0, 0, 845, 460);
    mask.fill(0x00ff00);

    mask.pivot.set(mask.width / 2, mask.height / 2);
    mask.position.set(
      this.app.screen.width / 2 + 63,
      this.app.screen.height / 2 + 7
    );

    this.reelsContainer.mask = mask;
    this.addChild(mask);
  }

  ///Initial Spawn destroyed at first spin
  initSpawnNormalReels() {
    const totalWidth =
      this.reelCount * this.symbolSize + (this.reelCount - 1) * this.reelGap;

    const startX = this.app.screen.width / 2 + 63 - totalWidth / 2;

    for (let i = 0; i < this.reelCount; i++) {
      const reel = new PIXI.Container();
      reel.x = startX + i * (this.symbolSize + this.reelGap);

      for (let j = 0; j < this.rowsCount; j++) {
        const tex =
          this.normalSymbolTextures[
            Math.floor(Math.random() * this.normalSymbolTextures.length)
          ];

        const symbol = new PIXI.Sprite(tex);
        symbol.width = symbol.height = this.symbolSize;
        symbol.y = j * (this.symbolSize + this.symbolGapY) + this.reelHeight;

        reel.addChild(symbol);
      }

      this.reelsContainer.addChild(reel);
    }
  }

  // NORMAL REELS random result

  spawnNormalReels() {
    this.reelsContainer.removeChildren();
    this.reels = [];

    const generatedMatrix: number[][] = [];

    const totalWidth =
      this.reelCount * this.symbolSize + (this.reelCount - 1) * this.reelGap;

    const startX = 765 + 63 - totalWidth / 2;

    for (let i = 0; i < this.reelCount; i++) {
      const reel = new PIXI.Container();
      reel.x = startX + i * (this.symbolSize + this.reelGap);

      (reel as any).symbols = [];
      generatedMatrix[i] = [];

      for (let j = 0; j < this.rowsCount; j++) {
        const symbolIndex = Math.floor(
          Math.random() *this.normalSymbolTextures.length
        );

        generatedMatrix[i][j] = symbolIndex;

        const tex = this.normalSymbolTextures[symbolIndex];
        const symbol = new PIXI.Sprite(tex);

        symbol.width = symbol.height = this.symbolSize;
        symbol.y = j * (this.symbolSize + this.symbolGapY);

        (symbol as any).symbolIndex = symbolIndex;

        reel.addChild(symbol);
        (reel as any).symbols.push(symbol);
      }

      this.reelsContainer.addChild(reel);
      this.reels.push(reel);
    }

    this.currentMatrix = generatedMatrix;
  }

  // NORMAL REELS predifined result

  spawnResultReels(resultMatrix: number[][]) {
    this.reelsContainer.removeChildren();
    this.reels = [];

    const totalWidth =
      this.reelCount * this.symbolSize + (this.reelCount - 1) * this.reelGap;

    const startX = 765 + 63 - totalWidth / 2;

    for (let i = 0; i < this.reelCount; i++) {
      const reel = new PIXI.Container();
      reel.x = startX + i * (this.symbolSize + this.reelGap);

      (reel as any).symbols = [];

      for (let j = 0; j < this.rowsCount; j++) {
        const symbolIndex = resultMatrix[i][j];
        const tex = this.normalSymbolTextures[symbolIndex];

        const symbol = new PIXI.Sprite(tex);
        symbol.width = symbol.height = this.symbolSize;
        symbol.y = j * (this.symbolSize + this.symbolGapY);

        (symbol as any).symbolIndex = symbolIndex;

        reel.addChild(symbol);
        (reel as any).symbols.push(symbol);
      }

      this.reelsContainer.addChild(reel);
      this.reels.push(reel);
    }
  }

  // BLUR REELS

  spawnBlurReels() {
    // destroy previous blur reels
    this.blurReelsContainer?.destroy({ children: true });

    const container = new PIXI.Container();

    for (let i = 0; i < this.reelCount; i++) {
      const reel = new PIXI.Container();
      reel.x = i * (this.symbolSize + this.reelGap);

      for (let j = 0; j < this.rowsCount; j++) {
        // pick random blur texture
        const tex =
          this.blurSymbolTextures[
            Math.floor(Math.random() * this.blurSymbolTextures.length)
          ];

        const symbol = new PIXI.Sprite(tex);
        symbol.width = symbol.height = this.symbolSize;
        symbol.y = j * (this.symbolSize + this.symbolGapY);

        reel.addChild(symbol);
      }

      container.addChild(reel);
    }

    container.x = this.reelsContainer.x + 420;
    container.y = this.reelHeight;

    this.reelsContainer.addChild(container);
    this.blurReelsContainer = container;
  }

 
  startBlurSpin() {
    if (this.isBlurSpinning) return;

    if (!this.blurReelsContainer) {
      this.spawnBlurReels();
    }

    this.isBlurSpinning = true;
    this.app.ticker.add(this.onBlurSpin, this);
  }

  onBlurSpin(ticker: PIXI.Ticker) {
    if (!this.blurReelsContainer) return;

    for (const reel of this.blurReelsContainer.children as PIXI.Container[]) {
      for (const symbol of reel.children as PIXI.Sprite[]) {
        symbol.y += this.spinSpeed * ticker.deltaTime;

        // when symbol goes out of bottom
        if (
          symbol.y >=
          this.rowsCount * (this.symbolSize + this.symbolGapY) - 100
        ) {
          symbol.y = 0;
        }
      }
    }
  }

  stopBlurSpin() {
    if (!this.blurReelsContainer) return;

    this.isBlurSpinning = false;
    this.app.ticker.remove(this.onBlurSpin, this);

    this.blurReelsContainer.removeFromParent();
    this.blurReelsContainer.destroy({ children: true });
    this.blurReelsContainer = undefined;
  }

  checkWins() {
    if (!this.currentMatrix) return [];

    const matrix = this.currentMatrix; 
    const wins: any[] = [];

    this.payLines.forEach((payLine, payLineIndex) => {
      let currentSymbol: number | null = null;
      let count = 0;
      let positions: { reel: number; row: number }[] = [];

      for (let reel = 0; reel < this.reelCount; reel++) {
        const row = payLine[reel];
        const symbol = matrix[reel][row]; // 👈 use matrix instead

        if (symbol === currentSymbol) {
          count++;
          positions.push({ reel, row });
        } else {
          currentSymbol = symbol;
          count = 1;
          positions = [{ reel, row }];
        }

        if (count >= 3) {
          wins.push({
            payLineIndex,
            symbol,
            count,
            positions: [...positions],
          });
        }
      }
    });

    return wins;
  }

  dimAllSymbols(alpha = 0.3) {
    this.reels.forEach((reel: any) => {
      reel.symbols.forEach((symbol: PIXI.Sprite) => {
        symbol.alpha = alpha;
      });
    });
  }

  restoreAllSymbols() {
    this.reels.forEach((reel: any) => {
      reel.symbols.forEach((symbol: PIXI.Sprite) => {
        symbol.alpha = 1;
      });
    });
  }
  highlightWinByAlpha(positions: { reel: number; row: number }[]) {
    this.dimAllSymbols(0.3);

    positions.forEach(({ reel, row }) => {
      const symbol = (this.reels[reel] as any).symbols[row];
      symbol.alpha = 1;
      
    });
  }
  playWinHighlights(wins: any[]) {
    if (!wins.length) return;

    let index = 0;

    const playNext = () => {
      if (index >= wins.length) {
        setTimeout(() => this.restoreAllSymbols(), 400);
        return;
      }

      this.highlightWinByAlpha(wins[index].positions);
      index++;

      setTimeout(playNext, 1000);
    };

    playNext();
  }

  //FALL

  startFall() {
    if (this.isFalling) return;
    this.isFalling = true;
    //Ticker
    this.app.ticker.add(this.onFall, this);
  }

  onFall(ticker: PIXI.Ticker) {
    this.reelsContainer.y += this.fallSpeed * ticker.deltaTime;

    if (this.reelsContainer.y >= 0) {
      this.reelsContainer.y = 0;
      this.isFalling = false;
      this.isSpinning = false;
      this.app.ticker.remove(this.onFall, this);

      const wins = this.checkWins();
      this.playWinHighlights(wins);
    }
  }
}
