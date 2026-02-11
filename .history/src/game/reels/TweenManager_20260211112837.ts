export class TweenManager {
  private tweens: any[] = [];

  update() {
    const now = Date.now();
    const remove: any[] = [];

    for (const t of this.tweens) {
      const phase = Math.min(1, (now - t.start) / t.time);

      t.object[t.property] =
        t.propertyBeginValue +
        (t.target - t.propertyBeginValue) * t.easing(phase);

      if (phase === 1) {
        t.complete?.();
        remove.push(t);
      }
    }

    for (const r of remove) {
      this.tweens.splice(this.tweens.indexOf(r), 1);
    }
  }

  tweenTo(
    object: any,
    property: string,
    target: number,
    time: number,
    easing: (t: number) => number,
    oncomplete?: () => void
  ) {
    this.tweens.push({
      object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      complete: oncomplete,
      start: Date.now(),
    });
  }

  backout(amount: number) {
    return (t: number) =>
      --t * t * ((amount + 1) * t + amount) + 1;
  }
}
