import type { Reel } from "./Reel";
import { TweenManager } from "./TweenManager";

export class SpinController {
  private isTurbo = false;
  public isSpinning = false;

  constructor(
    private reels: Reel[],
    private tween: TweenManager,
    private onComplete: () => void
  ) {}

  setTurbo(on: boolean) {
    this.isTurbo = on;
  }

  startSpin() {
    if (this.isSpinning) return;

    this.isSpinning = true;

    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];

      r.container.filters = [r.blur];

      const target = r.position + 20;
      const time = this.isTurbo ? 1200 : 2000 + i * 200;

      this.tween.tweenTo(
        r,
        "position",
        target,
        time,
        this.tween.backout(0.6),
        () => {
          r.blur.blurY 15;
          r.container.filters = null;

          if (i === this.reels.length - 1) {
            this.isSpinning = false;
            this.onComplete();
          }
        }
      );
    }
  }
}
