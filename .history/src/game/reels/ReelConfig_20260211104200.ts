
    //  WIN CHECKING

  private getSymbolIndex(reelIndex: number, row: number): number {
    const reel = this.reels[reelIndex];
    const symbol = reel.symbols[row + 1];
    return this.normalTextures.indexOf(symbol.texture);
  }

  private checkWins() {
    const winningLines: { line: number[]; count: number }[] = [];

    for (const line of this.paylines) {
      let matchCount = 1;
      const firstIndex = this.getSymbolIndex(0, line[0]);

      for (let reel = 1; reel < this.reelCount; reel++) {
        const currentIndex = this.getSymbolIndex(reel, line[reel]);

        if (currentIndex === firstIndex) matchCount++;
        else break;
      }

      if (matchCount >= 3) {
        winningLines.push({ line, count: matchCount });
      }
    }

    if (winningLines.length > 0) {
      this.playWinningLinesSequentially(winningLines);
    }
  }


    //  PROGRESSIVE WIN ANIMATION

  private playWinningLinesSequentially(
    wins: { line: number[]; count: number }[],
    index = 0
  ) {
    if (index >= wins.length) return;

    const { line, count } = wins[index];

    this.animateProgressiveWin(line, count, () => {
      this.playWinningLinesSequentially(wins, index + 1);
    });
  }

  private animateProgressiveWin(
    line: number[],
    totalMatches: number,
    onComplete?: () => void
  ) {
    let currentCount = 3;

    const step = () => {
      this.dimAllVisible();

      const winners = [];

      for (let r = 0; r < currentCount; r++) {
        winners.push({ reel: r, row: line[r] });
      }

      this.highlightVisible(winners);

      if (currentCount < totalMatches) {
        currentCount++;
        setTimeout(step, 700);
      } else {
        setTimeout(() => {
          this.restoreAllVisible();
          onComplete?.();
        }, 900);
      }
    };

    step();
  }

  private dimAllVisible() {
    for (let reel = 0; reel < this.reelCount; reel++) {
      for (let row = 0; row < this.visibleRows; row++) {
        this.reels[reel].symbols[row + 1].alpha = 0.3;
      }
    }
  }

  private highlightVisible(winners: { reel: number; row: number }[]) {
    winners.forEach((pos) => {
      this.reels[pos.reel].symbols[pos.row + 1].alpha = 1;
    });
  }

  private restoreAllVisible() {
    for (let reel = 0; reel < this.reelCount; reel++) {
      for (let row = 0; row < this.visibleRows; row++) {
        this.reels[reel].symbols[row + 1].alpha = 1;
      }
    }
  }