// systems/FallSystem.ts
import * as PIXI from "pixi.js";
import { REEL_CONFIG } from "../config/ReelConfig";

export class FallSystem {
  private isRunning = false;

  constructor(
    private app: PIXI.Application,
    private reelsContainer: PIXI.Container,
    private onComplete: () => void
  ) {}

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.app.ticker.add(this.update, this);
  }

  stop() {
    this.isRunning = false;
    this.app.ticker.remove(this.update, this);
  }

  private update(ticker: PIXI.Ticker) {
    this.reelsContainer.y +=
      REEL_CONFIG.fallSpeed * ticker.deltaTime;

    if (this.reelsContainer.y >= 0) {
      this.reelsContainer.y = 0;

      this.stop();

      // Notify whoever owns this system
      this.onComplete();
    }
  }
}
