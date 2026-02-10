import * as PIXI from "pixi.js";
import { Game } from "./game/Game";
import {AssetLoader} from "./core/AssetLoader"



  const app = new PIXI.Application();
  
  await app.init({
    resizeTo: window,
    backgroundColor: 0x222222, // pure black
  });
  
  await AssetLoader.load();
  document.body.appendChild(app.canvas);

  new Game(app);

