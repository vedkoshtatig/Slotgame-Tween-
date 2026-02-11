export class ReelConfig {
  reelCount = 5;
  visibleRows = 3;
  bufferRows = 2;

  symbolSize = 130;
  symbolGapY = 20;
  reelGap = 40;

  get totalRows() {
    return this.visibleRows + this.bufferRows;
  }
}
