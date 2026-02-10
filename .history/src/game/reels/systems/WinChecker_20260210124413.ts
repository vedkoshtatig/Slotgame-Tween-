// systems/WinChecker.ts

export interface WinPosition {
  reel: number;
  row: number;
}

export interface WinResult {
  payLineIndex: number;
  symbol: number;
  count: number;
  positions: WinPosition[];
}

export class WinChecker {
  checkWins(
    matrix: number[][],
    payLines: number[][]
  ): WinResult[] {
    const wins: WinResult[] = [];

    const reelCount = matrix.length;

    payLines.forEach((payLine, payLineIndex) => {
      let currentSymbol: number | null = null;
      let count = 0;
      let positions: WinPosition[] = [];

      for (let reel = 0; reel < reelCount; reel++) {
        const row = payLine[reel];
        const symbol = matrix[reel][row];

        if (symbol === currentSymbol) {
          count++;
          positions.push({ reel, row });
        } else {
          currentSymbol = symbol;
          count = 1;
          positions = [{ reel, row }];
        }

        if (count >= 3) {
          wins.push({
            payLineIndex,
            symbol,
            count,
            positions: [...positions],
          });
        }
      }
    });

    return wins;
  }
}
