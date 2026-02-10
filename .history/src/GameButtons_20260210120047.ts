import * as PIXI from "pixi.js";
import { AssetLoader } from "./AssetLoader";
import {Assets} from "pixi.js"
export class GameButtons extends PIXI.Container {
  // textures: Record<string, PIXI.Texture>;
  app!: PIXI.Application;
  autoSpinState: number;
  spinBtn!: PIXI.Sprite;
  autoSpinBtn!: PIXI.Sprite;
  turboSpinBtn!: PIXI.Sprite;
  autoSpinInterval?: number;
  int!: number;
  onSpin?: () => void;

  constructor(app: PIXI.Application) {
    super();
    this.app = app;
    // this.textures = AssetLoader.textures;
    this.autoSpinState = 0;

    this.build();
  }
  build() {
    this.spinBtn = new PIXI.Sprite(Assets.get("spineBtn_main_normal.png"));
    this.spinBtn.position.set(
      this.app.screen.width / 2 + 65,
      this.app.screen.height - 75
    );
    this.spinBtn.anchor.set(0.5);
    this.spinBtn.scale.set(0.5);

    this.autoSpinBtn = new PIXI.Sprite(Assets.get("menu_autospin_normal.png"));
    this.autoSpinBtn.position.set(
      this.app.screen.width / 2 + 160,
      this.app.screen.height - 56
    );
    this.autoSpinBtn.anchor.set(0.5);
    this.autoSpinBtn.scale.set(0.6);

    this.turboSpinBtn = new PIXI.Sprite(Assets.get"menu_quickSpinOn_normal.png");
    this.turboSpinBtn.position.set(
      this.app.screen.width / 2 - 40,
      this.app.screen.height - 56
    );
    this.turboSpinBtn.anchor.set(0.5);
    this.turboSpinBtn.scale.set(0.6);

    // States

    this.spinBtn.eventMode = "static";
    this.spinBtn.cursor = "pointer";
    this.autoSpinBtn.eventMode = "static";
    this.autoSpinBtn.cursor = "pointer";
    this.turboSpinBtn.eventMode = "static";
    this.turboSpinBtn.cursor = "pointer";
    //Spintext
    this.spinBtn.on("pointerdown", () => {
      this.onSpin?.();
      this.spinBtn.texture = this.textures.spinBtnDisabled;
      this.spinBtn.eventMode = "none";
      this.spinBtn.cursor = "none";
      setTimeout(() => {
        this.spinBtn.texture = this.textures.spinBtn;
        this.spinBtn.eventMode = "static";
        this.spinBtn.cursor = "pointer";
      }, 1400);
    });

    this.turboSpinBtn.on("pointerover", () => {
      this.turboSpinBtn.texture = this.textures.turboSpinBtnHover;
    });

    //Autospin funct
    this.autoSpinBtn.on("pointerdown", () => {
      if (this.autoSpinState === 0) {
        this.autoSpinBtn.texture = this.textures.autoSpinBtnDown;

        this.autoSpinInterval = window.setInterval(() => {
          this.onSpin?.();
        }, 1200);

        this.autoSpinState = 1;
      } else {
        this.autoSpinBtn.texture = this.textures.autoSpinBtn;

        if (this.autoSpinInterval) {
          clearInterval(this.autoSpinInterval);
          this.autoSpinInterval = undefined;
        }

        this.autoSpinState = 0;
      }
    });

    this.turboSpinBtn.on("pointerout", () => {
      this.turboSpinBtn.texture = this.textures.turboSpinBtn;
    });

    this.addChild(this.spinBtn, this.autoSpinBtn, this.turboSpinBtn);
  }
}
