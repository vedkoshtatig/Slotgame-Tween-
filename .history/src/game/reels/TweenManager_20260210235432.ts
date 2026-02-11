export class TweenManager {
  private tweening: any[] = [];

  tweenTo(
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
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      complete: oncomplete,
      start: Date.now(),
    });
  }

  update() {
    const now = Date.now();
    const remove: any[] = [];

    for (const t of this.tweening) {
      const phase = Math.min(1, (now - t.start) / t.time);

      t.object[t.property] =
        t.propertyBeginValue * (1 - t.easing(phase)) +
        t.target * t.easing(phase);

      if (phase === 1) {
        if (t.complete) t.complete();
        remove.push(t);
      }
    }

    remove.forEach(r =>
      this.tweening.splice(this.tweening.indexOf(r), 1)
    );
  }

  backout(amount: number) {
    return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
  }
}
