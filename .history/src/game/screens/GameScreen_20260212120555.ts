import * as PIXI from "pixi.js";
// import {AssetLoader} from "./AssetLoader"
import { StakeControl } from "../ui/StakeControl";
import { GameButtons } from "../ui/GameButtons";
import { ReelArea } from "../reels/ReelArea";
import {fetchBal} from "..//"
import { Assets } from "pixi.js";
export class GameScreen extends PIXI.Container {
  // textures: Record<string, PIXI.Texture >
  stakeControl: StakeControl;
  gameButtons: GameButtons;
  reelArea: ReelArea;
  app: PIXI.Application;
  constructor(app: PIXI.Application) {
    super();
    this.app = app;

    this.stakeControl = new StakeControl(this.app);
    this.reelArea = new ReelArea(this.app);
    this.gameButtons = new GameButtons(this.app);

    
    this.gameButtons.on("spin", () => {
      this.reelArea.startSpin();
      //  this.stakeControl.UpdateBalance();
    });
  
    this.reelArea.on("spinStart", () => {
      this.stakeControl.UpdateBalance();
    });
    this.gameButtons.on("turboSpinOn", () => {
      this.reelArea.setTurbo(true);
    });

    this.gameButtons.on("turboSpinOff", () => {
      this.reelArea.setTurbo(false);
    });

    // When reel starts → disable button
    this.reelArea.on("spinStart", () => {
      this.gameButtons.disableSpin();
    });

    // When reel completes → enable button
    this.reelArea.on("spinComplete", () => {
      this.gameButtons.enableSpin();
    });
    // this.textures = AssetLoader.textures;
    //         this.gameButtons.onSpin = () => {
    //         if (!this.reelArea.isSpinning) {
    //         this.reelArea.spin();
    //         this.stakeControl.UpdateBalance();
    //        }
    // };
    this.build();
  }

  
  
  build() {
    const gameLogo = new PIXI.Sprite(Assets.get("7.png"));
    gameLogo.scale.set(0.123);
    gameLogo.anchor.set(0.5, 0);
    gameLogo.position.set(260, 110);

    const playScreen = new PIXI.Container();

    const playScreenFg = new PIXI.Sprite(Assets.get("reelframe.png"));
    playScreenFg.scale.set(0.48);
    playScreenFg.anchor.set(0.5, 0.5);
    playScreenFg.position.set(
      this.app.screen.width / 2 + 63,
      this.app.screen.height / 2
    );

    const playScreenBg = new PIXI.Sprite(Assets.get("reelFrameBG.png"));
    playScreenBg.scale.set(0.48);
    playScreenBg.anchor.set(0.5, 0.5);
    playScreenBg.position.set(
      this.app.screen.width / 2 + 63,
      this.app.screen.height / 2
    );

    playScreen.addChild(playScreenBg, playScreenFg, this.reelArea);

    this.addChild(gameLogo, playScreen, this.gameButtons, this.stakeControl);
  }
}
