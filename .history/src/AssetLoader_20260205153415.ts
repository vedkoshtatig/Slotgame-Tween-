import * as PIXI from "pixi.js";
export class AssetLoader {
  static textures: Record<string, PIXI.Texture> = {};

  static async load() {
    this.textures = {
      background: await PIXI.Assets.load(
        "/sourceAssets/backgrounds/assets/bg.png"
      ),
      gameLogo: await PIXI.Assets.load("/sourceAssets/gameLogo/assets/7.png"),
      IntroScreen1: await PIXI.Assets.load(
        "/sourceAssets/introScreen/assets/frame1.png"
      ),
      IntroScreen2: await PIXI.Assets.load(
        "/sourceAssets/introScreen/assets/frame2.png"
      ),
      lBtn: await PIXI.Assets.load(
        "/sourceAssets/introScreen/assets/btn_arrow1.png"
      ),
      rBtn: await PIXI.Assets.load(
        "/sourceAssets/introScreen/assets/btn_arrow2.png"
      ),
      idleIndicator: await PIXI.Assets.load(
        "/sourceAssets/introScreen/assets/pager_base.png"
      ),
      activeIndicator: await PIXI.Assets.load(
        "/sourceAssets/introScreen/assets/pager_marker.png"
      ),
      playBtnNormal: await PIXI.Assets.load(
        "/sourceAssets/introScreen/assets/prePlayBtn_normal.png"
      ),
      playBtnHover: await PIXI.Assets.load(
        "/sourceAssets/introScreen/assets/prePlayBtn_hover.png"
      ),
      playScreen: await PIXI.Assets.load(
        "/sourceAssets/reelFrame/assets/reelframe.png"
      ),
      playScreenBg: await PIXI.Assets.load(
        "/sourceAssets/reelFrame/assets/reelFrameBG.png"
      ),
      incBtn: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/plusIcon_normal.png"
      ),
      incBtnHover: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/plusIcon_hover.png"
      ),
      incBtnDisabled: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/plusIcon_disabled.png"
      ),
      decBtn: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/minusIcon_normal.png"
      ),
      decBtnHover: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/minusIcon_hover.png"
      ),
      decBtnDisabled: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/minusIcon_disabled.png"
      ),
      stakeBg: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/darkBalance_bg.png"
      ),
      spinBtn: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/spineBtn_main_normal.png"
      ),
      spinBtnHover: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/spineBtn_main_hover.png"
      ),
      spinBtnDown: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/spineBtn_main_down.png"
      ),
      spinBtnDisabled: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/spineBtn_main_disabled.png"
      ),
      autoSpinBtn: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/menu_autospin_normal.png"
      ),
      autoSpinBtnHover: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/menu_autospin_hover.png"
      ),
      autoSpinBtnDown: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/menu_autospin_down.png"
      ),
      autoSpinBtnDisabled: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/spineBtn_main_disabled.png"
      ),
      turboSpinBtn: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/menu_quickSpinOn_normal.png"
      ),
      turboSpinBtnHover: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/menu_quickSpinOn_hover.png"
      ),
      turboSpinBtnDown: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/menu_quickSpinOn_down.png"
      ),
      turboSpinBtnDisabled: await PIXI.Assets.load(
        "/sourceAssets/gamePanel/newPanel/assets/menu_quickSpinOn_disabled.png"
      ),
    };

    return this.textures;
  }
}
