// Cell.js

/**
 * Represents an individual cell in the grid
 */
export class Cell {
  /**
   * @param {number} row
   * @param {number} col
   * @param {string|number} value
   */
  constructor(row, col, value = '') {
    /** @type {number} Row index */
    this.row = row;
    /** @type {number} Column index */
    this.col = col;
    /** @type {string|number} Cell value */
    this.value = value;
  }
}
