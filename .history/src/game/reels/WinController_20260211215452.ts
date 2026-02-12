import * as PIXI from "pixi.js";

interface Reel {
  container: PIXI.Container;
  symbols: PIXI.Sprite[];
  position: number;
  previousPosition: number;
  blur: PIXI.BlurFilter;
}

interface WinLine {
  line: number[];
  count: number;
}

export class WinController {
  private reels: Reel[];
  private reelCount: number;
  private visibleRows: number;
  private paylines: number[][];
  private resultMatrix: number[][];

  private isAnimating = false;

  constructor(
    reels: Reel[],
    resultMatrix: number[][],
    reelCount: number,
    visibleRows: number,
    paylines: number[][]
  ) {
    this.reels = reels;
    this.resultMatrix = resultMatrix;
    this.reelCount = reelCount;
    this.visibleRows = visibleRows;
    this.paylines = paylines;
  }

  
  // PUBLIC ENTRY
  

  public checkWins() {
    if (this.isAnimating) return;

    const winningLines: WinLine[] = [];

    for (const line of this.paylines) {
      let matchCount = 1;

      const firstSymbol = this.resultMatrix[0][line[0]];

      for (let reel = 1; reel < this.reelCount; reel++) {
        const currentSymbol = this.resultMatrix[reel][line[reel]];

        if (currentSymbol === firstSymbol) {
          matchCount++;
        } else {
          break;
        }
      }

      if (matchCount >= 3) {
        winningLines.push({ line, count: matchCount });
      }
    }

    if (winningLines.length > 0) {
      this.isAnimating = true;
      this.playWinningLinesSequentially(winningLines);
    }
  }

  
  // SEQUENTIAL PLAY
  

  private playWinningLinesSequentially(
    wins: WinLine[],
    index = 0
  ) {
    if (index >= wins.length) {
      this.isAnimating = false;
      this.restoreAllVisible();
      return;
    }

    const { line, count } = wins[index];

    this.animateProgressiveWin(line, count, () => {
      this.playWinningLinesSequentially(wins, index + 1);
    });
  }

  
  // PROGRESSIVE ANIMATION (3 → 4 → 5)
  

  private animateProgressiveWin(
    line: number[],
    totalMatches: number,
    onComplete?: () => void
  ) {
    let currentCount = 3;

    const step = () => {
      this.dimAllVisible();

      const winners: { reel: number; row: number }[] = [];

      for (let r = 0; r < currentCount; r++) {
        winners.push({
          reel: r,
          row: line[r],
        });
      }

      this.highlightVisible(winners);

      if (currentCount < totalMatches) {
        currentCount++;
        setTimeout(step, 600);
      } else {
        setTimeout(() => {
          this.restoreAllVisible();
          onComplete?.();
        }, 900);
      }
    };

    step();
  }

  
  // VISUAL HELPERS
  

  private dimAllVisible() {
    for (let reel = 0; reel < this.reelCount; reel++) {
      for (let row = 0; row < this.visibleRows; row++) {
        this.reels[reel].symbols[row + 1].alpha = 0.3;
      }
    }
  }

  private highlightVisible(
    winners: { reel: number; row: number }[]
  ) {
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

  
  // OPTIONAL: Update matrix after spin
  

  public setResultMatrix(matrix: number[][]) {
    this.resultMatrix = matrix;
  }

  public stopAnimation() {
    this.isAnimating = false;
    this.restoreAllVisible();
  }
}
