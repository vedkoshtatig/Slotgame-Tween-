// systems/SpinController.ts
import { RESULT_MATRICES, PAYLINES } from "../config/ReelConfig";
import { ReelSpawner } from "./ReelSpawner";
import { BlurSpinSystem } from "./BlurSpinSystem";
import { FallSystem } from "./FallSystem";
import { WinChecker } from "./WinChecker";
import { WinHighlighter } from "./WinHighlighter";

export class SpinController {
  private isSpinning = false;
  private resultState = 0;

  constructor(
    private spawner: ReelSpawner,
    private blurSystem: BlurSpinSystem,
    private fallSystem: FallSystem,
    private winChecker: WinChecker,
    private winHighlighter: WinHighlighter,
    private reelsContainer: PIXI.Container
  ) {}

  spin() {
    if (this.isSpinning) return;

    this.isSpinning = true;

    const randomMatrix = this.getRandomMatrix();

    // Decide which spawn logic to use (same behavior as your original)
    if (this.resultState < 2) {
      this.spawner.spawnNormalReels();
      this.resultState++;
    } else {
      this.spawner.spawnResultReels(randomMatrix);
      this.resultState = 0;
    }

    // Reset position for fall
    this.reelsContainer.y =
      -this.spawner.getReelHeight();

    // Start blur animation
    this.blurSystem.start();

    // Stop blur after 1500ms
    setTimeout(() => {
      this.blurSystem.stop();
    }, 1500);

    // Start fall after 1000ms
    setTimeout(() => {
      this.fallSystem.start();
    }, 1000);
  }

  // Called by FallSystem on complete
  handleFallComplete() {
    const matrix = this.spawner.getCurrentMatrix();
    if (!matrix) {
      this.isSpinning = false;
      return;
    }

    const wins = this.winChecker.checkWins(
      matrix,
      PAYLINES
    );

    this.winHighlighter.playWinHighlights(wins);

    this.isSpinning = false;
  }

  private getRandomMatrix(): number[][] {
    const index = Math.floor(
      Math.random() * RESULT_MATRICES.length
    );
    return RESULT_MATRICES[index];
  }
}
