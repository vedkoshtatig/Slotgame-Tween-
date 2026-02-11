import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";
import {
  REEL_COUNT,
  SYMBOL_SIZE,
  SYMBOL_GAP_Y,
  REEL_GAP,
  VISIBLE_ROWS,
  TOTAL_ROWS,
} from "./ReelConfig";
import { Reel } from "./Reel";
import { ReelFactory } from "./ReelFactory";
import { TweenManager } from "./TweenManager";
import { SpinController } from "./SpinController";
import { ResultManager } from "./ResultManager";

export class ReelArea extends PIXI.Container {
  private reels: Reel[] = [];
  private textures: PIXI.Texture[];

  private tweenManager: TweenManager;
  private spinController: SpinController;
  private resultManager: ResultManager;

  constructor(private app: PIXI.Application) {
    super();

    this.textures = [
      Assets.get("a.png"),
      Assets.get("b.png"),
      Assets.get("c.png"),
      Assets.get("d.png"),
      Assets.get("e.png"),
      Assets.get("f.png"),
      Assets.get("g.png"),
      Assets.get("h.png"),
      Assets.get("i.png"),
      Assets.get("k.png"),
      Assets.get("s.png"),
      Assets.get("w.png"),
    ];

    this.tweenManager = n
