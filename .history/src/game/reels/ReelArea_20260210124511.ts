// reels/ReelArea.ts
import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";

import { StakeControl } from "../ui/StakeControl";

import { ReelSpawner } from "./systems/ReelSpawner";
import { BlurSpinSystem } from "./systems/BlurSpinSystem";
import { FallSystem } from "./systems/FallSystem";
import { SpinController } from "./systems/SpinController";
import { WinChecker } from "./systems/WinChecker";
import { WinHighlighter } from "./systems/WinHighlighter";

export class ReelArea extends PIXI.Container {
  private reelsContainer: PIXI.Container;

  private spawner: ReelSpawner;
  private blurSystem: BlurSpinSystem;
  private fallSystem: FallSystem;
  private spinController: SpinController;
  private winChecker: WinChecker;
  private winHighlighter: WinHighlighter;

  constructor(
    private app: PIXI.Application,
    private stakeControl: StakeControl
  ) {
    super();

    // Create main reels container
    this.reelsContainer = new PIXI.Container();
    this.addChild(this.reelsContainer);

    // Load textures
    const normalTextures: PIXI.Texture[] = [
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

    const blurTextures: PIXI.Texture[] = [
      Assets.get("a_blur.png"),
      Assets.get("b_blur.png"),
      Assets.get("c_blur.png"),
      Assets.get("d_blur.png"),
      Assets.get("e_blur.png"),
      Assets.get("f_blur.png"),
      Assets.get("g_blur.png"),
      Assets.get("h_blur.png"),
      Assets.get("i_blur.png"),
      Assets.get("k_trigger.png"),
      Assets.get("s_blur.png"),
      Assets.get("w_blur.png"),
    ];

    // Create systems
    this.spawner = new ReelSpawner(
      this.app,
      this.reelsContainer,
      normalTextures
    );

    this.blurSystem = new BlurSpinSystem(
      this.app,
      this.reelsContainer,
      blurTextures
    );

    this.winChecker = new WinChecker();

    this.winHighlighter = new WinHighlighter([]);

    this.fallSystem = new FallSystem(
      this.app,
      this.reelsContainer,
      () => this.spinController.handleFallComplete()
    );

    this.spinController = new SpinController(
      this.spawner,
      this.blurSystem,
      this.fallSystem,
      this.winChecker,
      this.winHighlighter,
      this.reelsContainer
    );

    // Build mask
    this.buildMask();

    // Initial spawn
    this.spawner.initSpawnNormalReels();

    // Keyboard listener
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        this.spin();
        this.stakeControl.UpdateBalance();
      }
    });
  }

  spin() {
    this.spinController.spin();

    // After spawn, update highlighter reels reference
    this.winHighlighter.setReels(
      this.spawner.getReels()
    );
  }

  private buildMask() {
    const mask = new PIXI.Graphics();
    mask.rect(0, 0, 845, 460);
    mask.fill(0x00ff00);

    mask.pivot.set(mask.width / 2, mask.height / 2);
    mask.position.set(
      this.app.screen.width / 2 + 63,
      this.app.screen.height / 2 + 7
    );

    this.reelsContainer.mask = mask;
    this.addChild(mask);
  }
}
