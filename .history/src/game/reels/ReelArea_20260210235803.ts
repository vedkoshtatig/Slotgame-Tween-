import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";
import { ReelConfig } from "./ReelConfigReelConfig";
import { ReelFactory, Reel } from "./ReelFactory";
import { MaskBuilder } from "./MaskBuilder";
import { TweenManager } from "./TweenManager";
import { SpinController } from "./SpinController";
import { ResultManager } from "./systems/ResultManager";

export class ReelArea extends PIXI.Container {
  private config = new ReelConfig();
  private reels: Reel[];
  private tween = new TweenManager();
  private spinController: SpinController;
  private resultManager: ResultManager;

  constructor(private app: PIXI.Application) {
    super();

    const textures = [
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

    this.reels = ReelFactory.createReels(
      app,
      textures,
      this.config
    );

    this.reels.forEach(r => this.addChild(r.container));

    const mask = MaskBuilder.createMask(app, this.config);
    this.mask = mask;
    this.addChild(mask);

    this.resultManager = new ResultManager(textures, [
      [0, 11, 2],
      [3, 11, 5],
      [6, 11, 8],
      [9, 11, 11],
      [1, 11, 5],
    ]);

    this.spinController = new SpinController(
      this.reels,
      this.tween
    );

    app.ticker.add(this.update, this);
  }

  public startSpin() {
    this.spinController.startSpin(() => {
      console.log("Spin Complete");
    });
  }

  private update() {
    this.tween.update();

    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];

      r.blur.blurY =
        (r.position - r.previousPosition) * 30;
      r.previousPosition = r.position;

      const symbolHeight =
        this.config.symbolSize +
        this.config.symbolGapY;

      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const virtualIndex =
          (r.position + j) % this.config.totalRows;

        s.y = virtualIndex * symbolHeight - symbolHeight;
      }
    }
  }
}
