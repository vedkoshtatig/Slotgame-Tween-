import * as PIXI from "pixi.js"
import {AssetLoader} from "./AssetLoader"
import {Assets} from "pixi.js"

export class IntroScreen extends PIXI.Container{
    // textures: Record<string, PIXI.Texture >
    app:PIXI.Application
    screenState :number
    onPlay:()=>void;
    constructor(app:PIXI.Application , onPlay:()=>void){
        super();
        this.onPlay=onPlay
        this.screenState =0;
        // this.textures = AssetLoader.textures;
        this.app=app;
        this.build();
    }
    build(){
        const gameLogo  = new PIXI.Sprite(Assets.get("7.png"));
        gameLogo.scale.set(0.119)
        gameLogo.anchor.set(0.5,0)
        gameLogo.position.set(this.app.screen.width/2,-3)
     
        const dispScreen = new PIXI.Sprite(Assets.get("frame1.png"));
        dispScreen.anchor.set(0.5)
        dispScreen.position.set(this.app.screen.width/2,this.app.screen.height/2-60)
        dispScreen.scale.set(0.41);
         
        const lBtn = new PIXI.Sprite(Assets.get("btn_arrow1.png"))
        lBtn.anchor.set(0.5);
        lBtn.position.set(this.app.screen.width/2-415 , this.app.screen.height/2-95)
        lBtn.scale.set(0.5)
  
        const rBtn = new PIXI.Sprite(Assets.get("btn_arrow2.png"))
        rBtn.anchor.set(0.5);
        rBtn.position.set(this.app.screen.width/2+415 , this.app.screen.height/2-95)
        rBtn.scale.set(0.5)

        const leftInd = new PIXI.Sprite(Assets.get("pager_marker.png"))
        leftInd.position.set(this.app.screen.width/2-33,this.app.screen.height/2+195)
        leftInd.anchor.set(0.5)
        leftInd.scale.set(0.5)

        const rightInd = new PIXI.Sprite(Assets.get("pager_base.png"))
        rightInd.position.set(this.app.screen.width/2+40,this.app.screen.height/2+195)
        rightInd.anchor.set(0.5)
        rightInd.scale.set(0.5)
        
        const playBtn =  new PIXI.Sprite(Assets.get("prePlayBtn_normal.png"))
        playBtn.anchor.set(0.5)
        playBtn.position.set(this.app.screen.width/2+10,this.app.screen.height/2+290)
        playBtn.scale.set(0.5)

 // Assets.get()
        lBtn.eventMode = "static"
        lBtn.cursor = "pointer"
        lBtn.on("pointerdown" , () =>{
           if(this.screenState===0){
             dispScreen.texture = Assets.get("frame2.png")
             leftInd.texture=Assets.get("pager_base.png")
             rightInd.texture=Assets.get("pager_marker.png")
             this.screenState=1;
           }
           else if(this.screenState===1){
             dispScreen.texture = Assets.get("frame1.png")
             leftInd.texture=Assets.get("pager_marker.png")
             rightInd.texture=Assets.get("pager_base.png")
             this.screenState=0
           }
        });

         rBtn.eventMode = "static"
        rBtn.cursor = "pointer"
        rBtn.on("pointerdown" , () =>{
           if(this.screenState===0){
             dispScreen.texture = Assets.get("frame2.png")
             leftInd.texture=Assets.get("pager_base.png")
             rightInd.texture=Assets.get("pager_marker.png")
             this.screenState=1;
           }
           else if(this.screenState===1){
             dispScreen.texture = Assets.get("frame1.png")
             leftInd.texture=Assets.get("ger_marker.png")
             rightInd.texture=Assets.get()
             this.screenState=0
           }
        })

        playBtn.eventMode="static"
        playBtn.cursor="pointer"
        playBtn.on("pointerdown",()=>{
            this.onPlay();
        })
        playBtn.on("pointerover",()=>{
           playBtn.texture = this.textures.playBtnHover
        })
        playBtn.on("pointerout",()=>{
            playBtn.texture = this.textures.playBtnNormal
        })


        this.addChild(gameLogo,dispScreen , lBtn , rBtn,leftInd,rightInd,playBtn)

    }
}