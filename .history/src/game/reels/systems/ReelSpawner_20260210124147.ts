// systems/ReelSpawner.ts
import * as PIXI from "pixi.js";
import { REEL_CONFIG } from "../config/ReelConfig";

export class ReelSpawner {
  private reels: PIXI.Container[] = [];
  private currentMatrix: number[][] | null = null;

  constructor(
    private app: PIXI.Application,
    private reelsContainer: PIXI.Container,
    private normalTextures: PIXI.Texture[]
  ) {}

  getReels() {
    return this.reels;
  }

  getCurrentMatrix() {
    return this.currentMatrix;
  }

  getReelHeight() {
    return (
      REEL_CONFIG.rowsCount *
      (REEL_CONFIG.symbolSize + REEL_CONFIG.symbolGapY)
    );
  }

  initSpawnNormalReels() {
    const totalWidth =
      REEL_CONFIG.reelCount * REEL_CONFIG.symbolSize +
      (REEL_CONFIG.reelCount - 1) * REEL_CONFIG.reelGap;

    const startX =
      this.app.screen.width / 2 + 63 - totalWidth / 2;

    for (let i = 0; i < REEL_CONFIG.reelCount; i++) {
      const reel = new PIXI.Container();
      reel.x =
        startX +
        i * (REEL_CONFIG.symbolSize + REEL_CONFIG.reelGap);

      for (let j = 0; j < REEL_CONFIG.rowsCount; j++) {
        const tex =
          this.normalTextures[
            Math.floor(Math.random() * this.normalTextures.length)
          ];

        const symbol = new PIXI.Sprite(tex);
        symbol.width = symbol.height = REEL_CONFIG.symbolSize;
        symbol.y =
          j *
            (REEL_CONFIG.symbolSize +
              REEL_CONFIG.symbolGapY) +
          this.getReelHeight();

        reel.addChild(symbol);
      }

      this.reelsContainer.addChild(reel);
    }
  }

  spawnNormalReels() {
    this.reelsContainer.removeChildren();
    this.reels = [];

    const generatedMatrix: number[][] = [];

    const totalWidth =
      REEL_CONFIG.reelCount * REEL_CONFIG.symbolSize +
      (REEL_CONFIG.reelCount - 1) * REEL_CONFIG.reelGap;

    const startX = 765 + 63 - totalWidth / 2;

    for (let i = 0; i < REEL_CONFIG.reelCount; i++) {
      const reel = new PIXI.Container();
      reel.x =
        startX +
        i * (REEL_CONFIG.symbolSize + REEL_CONFIG.reelGap);

      (reel as any).symbols = [];
      generatedMatrix[i] = [];

      for (let j = 0; j < REEL_CONFIG.rowsCount; j++) {
        const symbolIndex = Math.floor(
          Math.random() * this.normalTextures.length
        );

        generatedMatrix[i][j] = symbolIndex;

        const tex = this.normalTextures[symbolIndex];
        const symbol = new PIXI.Sprite(tex);

        symbol.width = symbol.height =
          REEL_CONFIG.symbolSize;
        symbol.y =
          j *
          (REEL_CONFIG.symbolSize +
            REEL_CONFIG.symbolGapY);

        (symbol as any).symbolIndex = symbolIndex;

        reel.addChild(symbol);
        (reel as any).symbols.push(symbol);
      }

      this.reelsContainer.addChild(reel);
      this.reels.push(reel);
    }

    this.currentMatrix = generatedMatrix;
  }

  spawnResultReels(resultMatrix: number[][]) {
    this.reelsContainer.removeChildren();
    this.reels = [];

    const totalWidth =
      REEL_CONFIG.reelCount * REEL_CONFIG.symbolSize +
      (REEL_CONFIG.reelCount - 1) * REEL_CONFIG.reelGap;

    const startX = 765 + 63 - totalWidth / 2;

    for (let i = 0; i < REEL_CONFIG.reelCount; i++) {
      const reel = new PIXI.Container();
      reel.x =
        startX +
        i * (REEL_CONFIG.symbolSize + REEL_CONFIG.reelGap);

      (reel as any).symbols = [];

      for (let j = 0; j < REEL_CONFIG.rowsCount; j++) {
        const symbolIndex = resultMatrix[i][j];
        const tex = this.normalTextures[symbolIndex];

        const symbol = new PIXI.Sprite(tex);
        symbol.width = symbol.height =
          REEL_CONFIG.symbolSize;
        symbol.y =
          j *
          (REEL_CONFIG.symbolSize +
            REEL_CONFIG.symbolGapY);

        (symbol as any).symbolIndex = symbolIndex;

        reel.addChild(symbol);
        (reel as any).symbols.push(symbol);
      }

      this.reelsContainer.addChild(reel);
      this.reels.push(reel);
    }

    this.currentMatrix = resultMatrix;
  }
}
