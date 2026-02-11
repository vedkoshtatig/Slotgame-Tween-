import { Reel } from "../factory/ReelFactory";
import { TweenManager } from "./TweenManager";

export class SpinController {
  public isSpinning = false;
  private isTurbo = false;

  constructor(
    private reels: Reel[],
    private tween: TweenManager
  ) {}

  setTurbo(on: boolean) {
    this.isTurbo = on;
  }

  startSpin(onComplete: () => void) {
    if (this.isSpinning) return;

    this.isSpinning = true;

    this.reels.forEach((r, i) => {
      r.container.filters = [r.blur];

      const target = r.position + 20;
      const time = this.isTurbo
        ? 1200
        : 2000 + i * 200;

      this.tween.tweenTo(
        r,
        "position",
        target,
        time,
        this.tween.backout(0.6),
        () => {
          r.container.filters = null;

          if (i === this.reels.length - 1) {
            this.isSpinning = false;
            onComplete();
          }
        }
      );
    });
  }
}
