import * as PIXI from "pixi.js";

import {Assets} from "pixi.js"
export class GameButtons extends PIXI.Container {
  
  app!: PIXI.Application;
  autoSpinState: number;
  turboSpinState: number;
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
    this.turboSpinState = 0;

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

    this.turboSpinBtn = new PIXI.Sprite(Assets.get("menu_quickSpinOn_normal.png"));
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
      this.emit("spin");
    
    });

   

    this.turboSpinBtn.on("pointerover", () => {
      this.turboSpinBtn.texture = Assets.get("menu_quickSpinOn_hover.png")
    });

    //Autospin funct
    this.autoSpinBtn.on("pointerdown", () => {
      if (this.autoSpinState === 0) {
        this.autoSpinBtn.texture = Assets.get("menu_autospin_down.png");

        this.autoSpinInterval = window.setInterval(() => {
          this.emit("spin");
        }, 1200);

        this.autoSpinState = 1;
      } else {
        this.autoSpinBtn.texture = Assets.get("menu_autospin_normal.png")

        if (this.autoSpinInterval) {
          clearInterval(this.autoSpinInterval);
          this.autoSpinInterval = undefined;
        }

        this.autoSpinState = 0;
      }
    });
    this.turboSpinBtn.on("pointerdown", ()=>{
      if(this.turboSpinState===0){
         this.turboSpinBtn.texture = Assets.get("menu_quickSpin_down")
         this.emit("turboSpin")
         this.turboSpinState=1;
      }else
     
    })
    this.turboSpinBtn.on("pointerout", () => {
      this.turboSpinBtn.texture = Assets.get("menu_quickSpinOn_normal.png");
    });

    this.addChild(this.spinBtn, this.autoSpinBtn, this.turboSpinBtn);
  } 
  public disableSpin(){
        this.spinBtn.texture = Assets.get("spineBtn_main_disabled.png");
      this.spinBtn.eventMode = "none";
      this.spinBtn.cursor = "none";
      
    }
    public enableSpin() {
  this.spinBtn.texture = Assets.get("spineBtn_main_normal.png");
  this.spinBtn.eventMode = "static";
  this.spinBtn.cursor = "pointer";
}
}
