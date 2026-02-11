import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";
import {
  REEL_COUNT,
  SYMBOL_SIZE,
  SYMBOL_GAP_Y,
  REEL_GAP,
  VISIBLE_ROWS,
  TOTAL_ROWS,
} from "./ReelConfig";
import { Reel } from "./Reel";
import { ReelFactory } from "./ReelFactory";
import { TweenManager } from "./TweenManager";
import { SpinController } from "./SpinController";
import { ResultManager } from "./ResultManager";

export class ReelArea extends PIXI.Container {
  private reels: Reel[] = [];
  private textures: PIXI.Texture[];

  private tweenManager: TweenManager;
  private spinController: SpinController;
  private resultManager: ResultManager;

  constructor(private app: PIXI.Application) {
    super();

    this.textures = [
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

    this.tweenManager = new TweenManager();
    this.resultManager = new ResultManager(this.textures);

    this.createReels();

    this.spinController = new SpinController(
      this.reels,
      this.tweenManager,
      this.onSpinComplete.bind(this)
    );

    this.buildMask();

    this.app.ticker.add(this.update, this);
  }

  private createReels() {
    const totalWidth =
      REEL_COUNT * SYMBOL_SIZE + REEL_COUNT * REEL_GAP;

    const startX =
      this.app.screen.width / 2 - totalWidth / 2 + 80;

    const centerY =
      this.app.screen.height / 2 -
      (VISIBLE_ROWS * (SYMBOL_SIZE + SYMBOL_GAP_Y)) / 2 +
      10;

    for (let i = 0; i < REEL_COUNT; i++) {
      const reel = ReelFactory.createReel(
        this.textures,
        startX + i * (SYMBOL_SIZE + REEL_GAP),
        centerY
      );

      this.reels.push(reel);
      this.addChild(reel.container);
    }
  }

  private buildMask() {
    const maskWidth =
      REEL_COUNT * SYMBOL_SIZE + REEL_COUNT * REEL_GAP;

    const maskHeight =
      VISIBLE_ROWS * (SYMBOL_SIZE + SYMBOL_GAP_Y);

    const mask = new PIXI.Graphics()
      .rect(0, 0, maskWidth, maskHeight)
      .fill(0x000000);

    mask.pivot.set(maskWidth / 2, maskHeight / 2);
    mask.x = this.app.screen.width / 2 + 80;
    mask.y = this.app.screen.height / 2;

    this.mask = mask;
    this.addChild(mask);
  }

  public startSpin() {
    this.spinController.startSpin();
  }

  public setTurbo(on: boolean) {
    this.spinController.setTurbo(on);
  }

  private onSpinComplete() {
    for (let i = 0; i < this.reels.length; i++) {
      this.resultManager.applyResultToReel(
        this.reels[i],
        i
      );
    }

    this.emit("spinComplete");
  }

  private update() {
    this.tweenManager.update();

    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];

      r.blur.blurY =
        (r.position - r.previousPosition) * 30;
      r.previousPosition = r.position;

      const symbolHeight =
        SYMBOL_SIZE + SYMBOL_GAP_Y;

      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];

        const virtualIndex =
          (r.position + j) % TOTAL_ROWS;

        const yPosition =
          virtualIndex * symbolHeight;

        s.y = yPosition - symbolHeight;
      }
    }
  }
}
