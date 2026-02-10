import * as PIXI from "pixi.js";
import { Game } from "./Game";
import {AssetLoader} from "./AssetLoader"
import {SymbolLoader} from "./SymbolLoader"


  const app = new PIXI.Application();
  
  await app.init({
    resizeTo: window,
    backgroundColor: 0x222222, // pure black
  });
  await AssetLoader.load(); 
    await SymbolLoader.load();
  // document.body.style.margin = "0";
  document.body.appendChild(app.canvas);

  new Game(app);

