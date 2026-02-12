import * as PIXI from "pixi.js";
import { fetchBal } from "./api";
import { Assets } from "pixi.js";

export class StakeControl extends PIXI.Container {
  app: PIXI.Application;
  stakeAmount: number;
  balance: number;
  win: number;
  maxCount: number;
  balanceText!: PIXI.Text;

  incBtn!: PIXI.Sprite;
  decBtn!: PIXI.Sprite;
  constructor(app: PIXI.Application) {
    super();
    this.app = app;
    // this.textures = AssetLoader.textures;
    this.stakeAmount = 100;
    this.balance = 10000;
    this.win = 0;
    this.maxCount = 100;
   
    this.build();
    this.updateStakeUI();
  }
  build() {
    const controls = new PIXI.Container();

    this.incBtn = new PIXI.Sprite(Assets.get("plusIcon_normal.png"));
    this.incBtn.anchor.set(0.5);
    this.incBtn.scale.set(0.5);
    this.incBtn.position.set(
      this.app.screen.width - 165,
      this.app.screen.height - 40
    );

    this.decBtn = new PIXI.Sprite(Assets.get("minusIcon_normal.png"));
    this.decBtn.anchor.set(0.5);
    this.decBtn.scale.set(0.5);
    this.decBtn.position.set(
      this.app.screen.width - 382,
      this.app.screen.height - 40
    );

    const stakeDisp = new PIXI.Sprite(Assets.get("assets/darkBalance_bg.png"));
    stakeDisp.anchor.set(0.5);
    stakeDisp.scale.set(0.5, 0.65);
    stakeDisp.position.set(0, 0);

    const stakeText = new PIXI.Text({
      text: `$${this.stakeAmount}\nSTAKE`,
      style: {
        fill: 0xff000,
        align: "center",
        fontSize: 17,
        fontWeight: "700",
      },
    });
    stakeText.anchor.set(0.5);
    stakeText.position.set(0, 0);

    const StakeDisplay = new PIXI.Container();
    StakeDisplay.position.set(
      this.app.screen.width - 273,
      this.app.screen.height - 40
    );
    const bounds = StakeDisplay.getLocalBounds();
    StakeDisplay.pivot.set(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2
    );

    StakeDisplay.addChild(stakeDisp, stakeText);

    const BalWin = new PIXI.Container();

    this.balanceText = new PIXI.Text({
      text: `$${this.balance}\nBALANCE`,
      style: {
        fill: 0xff000,
        align: "center",
        fontSize: 17,
        fontWeight: "700",
      },
    });
    const winText = new PIXI.Text({
      text: `$${this.win}\nWIN`,
      style: {
        fill: 0xff000,
        align: "center",
        fontSize: 17,
        fontWeight: "700",
      },
    });

    controls.addChild(this.incBtn, this.decBtn, StakeDisplay);

    BalWin.addChild(this.balanceText, winText);
    winText.position.set(150, 0);
    BalWin.position.set(150, this.app.screen.height - 60);

    this.incBtn.eventMode = "static";
    this.incBtn.cursor = "pointer";
    this.decBtn.eventMode = "static";
    this.decBtn.cursor = "pointer";

    this.incBtn.on("pointerdown", () => {
      if (this.stakeAmount < this.maxCount) {
        this.stakeAmount += 20;
        stakeText.text = `$${this.stakeAmount}\nSTAKE`;
      }
      this.updateStakeUI();
    });
    this.decBtn.on("pointerdown", () => {
      if (this.stakeAmount > 0) {
        this.stakeAmount -= 20;
        stakeText.text = `$${this.stakeAmount}\nSTAKE`;
      }
      this.updateStakeUI();
    });

    this.addChild(controls, BalWin);
  }

  updateStakeUI() {
    if (this.stakeAmount === this.maxCount) {
      this.incBtn.texture = Assets.get("plusIcon_disabled.png");
      this.incBtn.eventMode = "none";
      this.incBtn.cursor = "normal";
    } else {
      this.incBtn.texture = Assets.get("plusIcon_normal.png");
      this.incBtn.eventMode = "static";
      this.incBtn.cursor = "pointer";
    }
    if (this.stakeAmount <= 20) {
      this.decBtn.texture = Assets.get("minusIcon_disabled.png");
      this.decBtn.eventMode = "none";
      this.decBtn.cursor = "normal";
    } else {
      this.decBtn.texture = Assets.get("minusIcon_normal.png");
      this.decBtn.eventMode = "static";
      this.decBtn.cursor = "pointer";
    }
  }
  UpdateBalance() {
    const data = fetchBal()
    this.balance -= this.stakeAmount;
    this.balanceText.text = `$${data.balance}\nBALANCE`;
  }
}
