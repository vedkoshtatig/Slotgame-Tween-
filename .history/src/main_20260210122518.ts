import * as PIXI from "pixi.js";
import { Game } from "./Game";
import {AssetLoader} from "./core/AssetLoader"
// import {SymbolLoader} from "./SymbolLoader"


  const app = new PIXI.Application();
  
  await app.init({
    resizeTo: window,
    backgroundColor: 0x222222, // pure black
  });
  // await AssetLoader.load(); 
    // await SymbolLoader.load();
  // document.body.style.margin = "0";
  await AssetLoader.load();
  document.body.appendChild(app.canvas);

  new Game(app);

