// Selection.js

/**
 * Manages selected cells, rows, columns, and cell range
 */
export class Selection {
  constructor() {
    /** @type {Array<{row: number, col: number}>} */
    this.selectedCells = [];
  }

  /**
   * Select a single cell
   * @param {number} row
   * @param {number} col
   */
  selectCell(row, col) {
    this.selectedCells = [{ row, col }];
  }

  /**
   * Select a row
   * @param {number} row
   * @param {number} totalCols
   */
  selectRow(row, totalCols) {
    this.selectedCells = [];
    for (let col = 0; col < totalCols; col++) {
      this.selectedCells.push({ row, col });
    }
  }

  /**
   * Select a column
   * @param {number} col
   * @param {number} totalRows
   */
  selectCol(col, totalRows) {
    this.selectedCells = [];
    for (let row = 0; row < totalRows; row++) {
      this.selectedCells.push({ row, col });
    }
  }

  /**
   * Select a range
   */
  selectRange(startRow, startCol, endRow, endCol) {
    this.selectedCells = [];
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        this.selectedCells.push({ row: r, col: c });
      }
    }
  }

  /**
   * Get statistics from selected cells
   * @param {Function} getValueCallback
   */
  getStats(getValueCallback) {
    const values = this.selectedCells
      .map(cell => getValueCallback(cell.row, cell.col))
      .map(val => parseFloat(val))
      .filter(val => !isNaN(val));

    const count = values.length;
    const sum = values.reduce((a, b) => a + b, 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = count ? sum / count : 0;

    return { count, sum, min, max, avg };
  }
}
