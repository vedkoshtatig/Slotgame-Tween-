import * as PIXI from "pixi.js";

import { StakeControl } from "../ui/StakeControl";
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

    this.normalSymbolTextures = [
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
     
    ]
    this.blurSymbolTextures = [
      Assets.get("a_blur.png"),
      Assets.get("b_blur.png"),
      Assets.get("c_blur.png"),
      Assets.get("d_blur.png"),
      Assets.get("e_blur.png"),
      Assets.get("f_blur.png"),
      Assets.get("g_blur.png"),
      Assets.get("h_blur.png"),
      Assets.get("i_blur.png"),
      Assets.get("k_trigger.png"),
      Assets.get("s_blur.png"),
      Assets.get("w_blur.png"),
    ];
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