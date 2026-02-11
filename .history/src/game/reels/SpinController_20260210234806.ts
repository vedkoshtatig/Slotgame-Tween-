// reels/SpinController.ts

import { Reel } from "./Reel";
import { ReelConfig } from "./ReelConfig";

export class SpinController {
  private tweening: any[] = [];
  public isSpinning = false;
  public isTurbo = false;

  constructor(
    private reels: Reel[],
    private onReelStop: (index: number) => void,
    private onComplete: () => void
  ) {}

  startSpin() {
    if (this.isSpinning) return;

    this.isSpinning = true;

    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];

      r.container.filters = [r.blur];

      const target =
        r.position + ReelConfig.spinSpeed;

      const time = this.isTurbo
        ? ReelConfig.turboSpinTime
        : ReelConfig.normalSpinTime +
          i * 200;

      this.tweenTo(
        r,
        "position",
        target,
        time,
        this.backout(0.6),
        () => {
          r.blur.blurY = 0;
          r.container.filters = null;

          this.onReelStop(i);

          if (
            i === this.reels.length - 1
          ) {
            this.isSpinning = false;
            this.onComplete();
          }
        }
      );
    }
  }

  update() {
    const now = Date.now();
    const remove: any[] = [];

    for (let i = 0; i < this.tweening.length; i++) {
      const t = this.tweening[i];
      const phase = Math.min(
        1,
        (now - t.start) / t.time
      );

      t.object[t.property] =
        this.lerp(
          t.propertyBeginValue,
          t.target,
          t.easing(phase)
        );

      if (phase === 1) {
        if (t.complete) t.complete();
        remove.push(t);
      }
    }

    remove.forEach((t) =>
      this.tweening.splice(
        this.tweening.indexOf(t),
        1
      )
    );
  }

  private tweenTo(
    object: any,
    property: string,
    target: number,
    time: number,
    easing: (t: number) => number,
    oncomplete?: () => void
  ) {
    this.tweening.push({
      object,
      property,
      propertyBeginValue:
        object[property],
      target,
      easing,
      time,
      complete: oncomplete,
      start: Date.now(),
    });
  }

  private lerp(a1: number, a2: number, t: number) {
    return a1 * (1 - t) + a2 * t;
  }

  private backout(amount: number) {
    return (t: number) =>
      --t * t *
        ((amount + 1) * t + amount) +
      1;
  }
}
