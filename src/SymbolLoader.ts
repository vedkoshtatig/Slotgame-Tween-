import * as PIXI from "pixi.js";

export type SymbolTextureSet = {
  normal: PIXI.Texture[];
  blur: PIXI.Texture[];
};
export class SymbolLoader {

  static symbols: SymbolTextureSet;

  static async load(): Promise<SymbolTextureSet> {
    this.symbols = {
      normal: [
        await PIXI.Assets.load("/sourceAssets/symbols/assets/a.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/b.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/c.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/d.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/e.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/f.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/g.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/h.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/i.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/k.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/s.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/w.png"),
       
       
      
      ],

      blur: [
        await PIXI.Assets.load("/sourceAssets/symbols/assets/a_blur.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/b_blur.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/c_blur.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/d_blur.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/e_blur.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/f_blur.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/g_blur.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/h_blur.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/i_blur.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/k_trigger.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/s_blur.png"),
        await PIXI.Assets.load("/sourceAssets/symbols/assets/w_blur.png"),
       
      ],
    };

    return this.symbols;
  }
}

