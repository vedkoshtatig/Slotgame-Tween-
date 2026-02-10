// systems/WinHighlighter.ts
import * as PIXI from "pixi.js";

interface WinPosition {
  reel: number;
  row: number;
}

interface WinResult {
  payLineIndex: number;
  symbol: number;
  count: number;
  positions: WinPosition[];
}

export class WinHighlighter {
  constructor(private reels: PIXI.Container[]) {}
setReels(reels: PIXI.Container[]) {
  this.reels = reels;
}

  playWinHighlights(wins: WinResult[]) {
    if (!wins || !wins.length) return;

    let index = 0;

    const playNext = () => {
      if (index >= wins.length) {
        setTimeout(() => this.restoreAllSymbols(), 400);
        return;
      }

      this.highlightWin(wins[index].positions);
      index++;

      setTimeout(playNext, 1000);
    };

    playNext();
  }

  private dimAllSymbols(alpha = 0.3) {
    this.reels.forEach((reel: any) => {
      reel.symbols?.forEach((symbol: PIXI.Sprite) => {
        symbol.alpha = alpha;
      });
    });
  }

  private restoreAllSymbols() {
    this.reels.forEach((reel: any) => {
      reel.symbols?.forEach((symbol: PIXI.Sprite) => {
        symbol.alpha = 1;
      });
    });
  }

  private highlightWin(positions: WinPosition[]) {
    this.dimAllSymbols(0.3);

    positions.forEach(({ reel, row }) => {
      const symbol = (this.reels[reel] as any).symbols[row];
      if (symbol) {
        symbol.alpha = 1;
      }
    });
  }
}
