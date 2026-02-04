import * as PIXI from "pixi.js";
import { SymbolLoader } from "./SymbolLoader";
import { StakeControl } from "./StakeControl";

export class ReelArea extends PIXI.Container {
  // config
  resultMatrix: number[][];
  reelCount = 5;
  rowsCount = 6;
  symbolSize = 130;
  reelGap = 41;
  symbolGapY = 20;

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

  resState:number
  constructor(app: PIXI.Application, stakeControl: StakeControl) {
    super();
    this.app = app;
    this.resState=0;
    this.resultMatrix = [
      [0, 3, 4, 5, 1, 4], // reel 0
      [1, 1, 4, 0, 2, 3], // reel 1
      [1, 6, 4, 11, 4, 0], // reel 2
      [3, 0, 4, 5, 5, 2], // reel 3
      [4, 1, 4, 3, 2, 5], // reel 4
    ];

    this.normalSymbolTextures = SymbolLoader.symbols.normal;
    this.blurSymbolTextures = SymbolLoader.symbols.blur;
    this.StakeControl = stakeControl;
    this.reelsContainer = new PIXI.Container();
    this.addChild(this.reelsContainer);

    this.buildMask();
    this.initSpawnNormalReels();

    this.reelsContainer.y = -this.reelHeight;

    //     window.addEventListener("keydown", (e) => {
    //   if (e.code === "Space") {
    //     if(!this.isBlurSpinning){
    //         this.spin();
    //     this.StakeControl.UpdateBalance()}

    //   }
    // });
  }
  get reelHeight() {
    return this.rowsCount * (this.symbolSize + this.symbolGapY);
  }

  spin() {
    if (this.isSpinning) return; 
    this.isSpinning = true;
    if(this.resState<3){ 
      this.spawnNormalReels(); 
      this.resState+=1;
    }else if(this.resState===3){
      this.spawnResultReels(this.resultMatrix);
       this.resState=0
    }
    // this.spawnNormalReels(); 
    // this.spawnResultReels(this.resultMatrix);

    // reset position for next spin
    this.reelsContainer.y = -this.reelHeight;

    this.startBlurSpin();

    setTimeout(() => {
      this.stopBlurSpin();
    }, 1500);

    setTimeout(() => {
      this.startFall();
    }, 1200);
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

  // NORMAL REELS random result

  spawnNormalReels() {
    this.reelsContainer.removeChildren();

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
        symbol.y = j * (this.symbolSize + this.symbolGapY);

        reel.addChild(symbol);
      }

      this.reelsContainer.addChild(reel);
    }
  }
  // NORMAL REELS predifined result
  spawnResultReels(resultMatrix: number[][]) {
    this.reelsContainer.removeChildren();

    const totalWidth =
      this.reelCount * this.symbolSize + (this.reelCount - 1) * this.reelGap;

    const startX = this.app.screen.width / 2 + 63 - totalWidth / 2;

    for (let i = 0; i < this.reelCount; i++) {
      const reel = new PIXI.Container();
      reel.x = startX + i * (this.symbolSize + this.reelGap);

      for (let j = 0; j < this.rowsCount; j++) {
        const symbolIndex = resultMatrix[i][j];
        const tex = this.normalSymbolTextures[symbolIndex];

        const symbol = new PIXI.Sprite(tex);
        symbol.width = symbol.height = this.symbolSize;
        symbol.y = j * (this.symbolSize + this.symbolGapY) + 15; // spawn above

        reel.addChild(symbol);
      }

      this.reelsContainer.addChild(reel);
    }
  }

  ///Initial Spawn destroyed at first spin
  initSpawnNormalReels() {
    this.reelsContainer.removeChildren();

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
        symbol.y = j * (this.symbolSize + this.symbolGapY) + 750;

        reel.addChild(symbol);
      }

      this.reelsContainer.addChild(reel);
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
        symbol.y = j * this.symbolSize;

        reel.addChild(symbol);
      }

      container.addChild(reel);
    }

    container.x = this.reelsContainer.x + 420;
    container.y = this.reelHeight;

    this.reelsContainer.addChild(container);
    this.blurReelsContainer = container;
  }

  //Ticker
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
        if (symbol.y >=this.rowsCount * (this.symbolSize + this.symbolGapY) - 100) {
          symbol.y = 0;

          // change texture for illusion
          // const index = Math.floor(
          //   Math.random() * this.blurSymbolTextures.length
          // );
          // symbol.texture = this.blurSymbolTextures[index];
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
      this.isSpinning = false; // ✅ unlock next spin
      this.app.ticker.remove(this.onFall, this);
    }
  }
}
