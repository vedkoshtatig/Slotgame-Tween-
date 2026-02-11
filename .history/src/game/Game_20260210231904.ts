// import * as PIXI from "pixi.js"
import * as PIXI from "pixi.js";
import {IntroScreen} from "../game/screens/IntroScreen"
import {GameScreen} from "../game/screens/GameScreen"
import {Background} from "../game/components/Background"



export class Game {
  app: PIXI.Application;
  introScreen:IntroScreen;
  gameScreen :GameScreen;
  background:Background

  constructor(app: PIXI.Application) {
    this.app = app;
    this.gameScreen= new GameScreen(this.app);
    this.introScreen = new IntroScreen(this.app,()=>{
      this.app.stage.removeChild(this.introScreen)
      this.app.stage.addChild(this.gameScreen)
    });
    this.background = new Background(this.app);
   
    this.app.stage.addChild(this.background,this.introScreen);
  }
}
