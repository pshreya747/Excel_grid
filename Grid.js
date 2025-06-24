import { Selection } from './Selection.js';
import { Command, CommandManager } from './Command.js';

export class Grid {
  constructor(canvas, data) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.data = data;

    this.cellWidth = 100;
    this.cellHeight = 25;

    this.headerSize = 1; // Reserve 1 row and 1 column for headers

    this.cols = Object.keys(data[0]).length;
    this.rows = data.length;

    this.selection = new Selection();
    this.commandManager = new CommandManager();

    this.viewportCols = Math.ceil(window.innerWidth / this.cellWidth);
    this.viewportRows = 500; // Fixed to show up to 500 rows

    this.scrollX = 0;
    this.scrollY = 0;

    const container = document.getElementById('container');
    const spacer = document.getElementById('spacer');

    this.canvas.width = (this.viewportCols + this.headerSize) * this.cellWidth;
    this.canvas.height = (this.viewportRows + this.headerSize) * this.cellHeight;

    spacer.style.width = `${(this.cols + this.headerSize) * this.cellWidth}px`;
    spacer.style.height = `${(this.rows + this.headerSize) * this.cellHeight}px`;

    container.scrollLeft = 0;
    container.scrollTop = 0;

    container.addEventListener('scroll', (e) => {
      this.scrollX = e.target.scrollLeft;
      this.scrollY = e.target.scrollTop;
      this.canvas.style.transform = `translate(${this.scrollX}px, ${this.scrollY}px)`;
      this.render();
    });

    this.render();
  }

  // Convert col index to Excel-like label (A, B, ..., Z, AA, AB, etc.)
  columnLabel(colIndex) {
    let label = '';
    while (colIndex >= 0) {
      label = String.fromCharCode((colIndex % 26) + 65) + label;
      colIndex = Math.floor(colIndex / 26) - 1;
    }
    return label;
  }

  render() {
    const { ctx, cellWidth, cellHeight, scrollX, scrollY } = this;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';

    const startRow = Math.floor(scrollY / cellHeight);
    const endRow = startRow + this.viewportRows;
    const startCol = Math.floor(scrollX / cellWidth);
    const endCol = startCol + this.viewportCols;

    // Column headers
    for (let c = startCol; c < endCol && c < this.cols; c++) {
      const x = (c - startCol + this.headerSize) * cellWidth;
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(x, 0, cellWidth, cellHeight);
      ctx.strokeRect(x, 0, cellWidth, cellHeight);
      ctx.fillStyle = '#000';
      ctx.fillText(this.columnLabel(c), x + 5, 15);
    }

    // Row headers
    for (let r = startRow; r < endRow && r < this.rows; r++) {
      const y = (r - startRow + this.headerSize) * cellHeight;
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, y, cellWidth, cellHeight);
      ctx.strokeRect(0, y, cellWidth, cellHeight);
      ctx.fillStyle = '#000';
      ctx.fillText(r + 1, 5, y + 15);
    }

    // Data cells
    for (let r = startRow; r < endRow && r < this.rows; r++) {
      for (let c = startCol; c < endCol && c < this.cols; c++) {
        const x = (c - startCol + this.headerSize) * cellWidth;
        const y = (r - startRow + this.headerSize) * cellHeight;

        ctx.strokeRect(x, y, cellWidth, cellHeight);
        const val = this.getValue(r, c);
        ctx.fillStyle = '#000';
        ctx.fillText(String(val), x + 5, y + 15);

        if (this.isSelected(r, c)) {
          ctx.fillStyle = 'rgba(0, 128, 255, 0.2)';
          ctx.fillRect(x, y, cellWidth, cellHeight);
          ctx.fillStyle = '#000';
        }
      }
    }
  }

  getValue(row, col) {
    const keys = Object.keys(this.data[row]);
    return this.data[row][keys[col]];
  }

  setValue(row, col, value) {
    const key = Object.keys(this.data[row])[col];
    const oldValue = this.data[row][key];

    const command = new Command(
      () => {
        this.data[row][key] = value;
        this.render();
      },
      () => {
        this.data[row][key] = oldValue;
        this.render();
      }
    );

    this.commandManager.executeCommand(command);
  }

  isSelected(row, col) {
    return this.selection.selectedCells.some(cell => cell.row === row && cell.col === col);
  }

  handleMouseDown(x, y) {
    // Adjust for header row/col
    const col = Math.floor((x - this.cellWidth) / this.cellWidth) + Math.floor(this.scrollX / this.cellWidth);
    const row = Math.floor((y - this.cellHeight) / this.cellHeight) + Math.floor(this.scrollY / this.cellHeight);

    if (row >= 0 && col >= 0) {
      this.selection.selectCell(row, col);
      this.render();
      const stats = this.selection.getStats((r, c) => this.getValue(r, c));
      console.log('Stats:', stats);
    }
  }

  handleDoubleClick(x, y) {
    const col = Math.floor((x - this.cellWidth) / this.cellWidth) + Math.floor(this.scrollX / this.cellWidth);
    const row = Math.floor((y - this.cellHeight) / this.cellHeight) + Math.floor(this.scrollY / this.cellHeight);

    if (row >= 0 && col >= 0) {
      const newValue = prompt('Enter new value:', this.getValue(row, col));
      if (newValue !== null) {
        this.setValue(row, col, isNaN(newValue) ? newValue : parseFloat(newValue));
      }
    }
  }

  undo() {
    this.commandManager.undo();
  }

  redo() {
    this.commandManager.redo();
  }
}
