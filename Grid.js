import { Selection } from './Selection.js';
import { Command, CommandManager } from './Command.js';

export class Grid {
  constructor(canvas, data) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.data = data;

    this.cellWidth = 100;
    this.cellHeight = 25;

    this.cols = Object.keys(data[0]).length;
    this.rows = data.length;

    this.selection = new Selection();
    this.commandManager = new CommandManager();

    this.viewportCols = Math.ceil(window.innerWidth / this.cellWidth);
    this.viewportRows = Math.ceil(window.innerHeight / this.cellHeight);

    // scroll offset
    this.scrollX = 0;
    this.scrollY = 0;

   const container = document.getElementById('container');
    const spacer = document.getElementById('spacer');

    // Set canvas size to viewport only
    this.canvas.width = this.viewportCols * this.cellWidth;
    this.canvas.height = this.viewportRows * this.cellHeight;

    // Set spacer height and width to full virtual grid size
    spacer.style.height = `${this.rows * this.cellHeight}px`;
    spacer.style.width = `${this.cols * this.cellWidth}px`;

    container.scrollLeft = 0;
    container.scrollTop = 0;

    // Scroll listener to update render based on scroll offset
    container.addEventListener('scroll', (e) => {
      this.scrollX = e.target.scrollLeft;
      this.scrollY = e.target.scrollTop;
        this.canvas.style.transform = `translate(${this.scrollX}px, ${this.scrollY}px)`;
      this.render();
    });

    this.render();
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

    for (let r = startRow; r < endRow && r < this.rows; r++) {
      for (let c = startCol; c < endCol && c < this.cols; c++) {
        const x = (c - startCol) * cellWidth;
        const y = (r - startRow) * cellHeight;

        ctx.strokeRect(x, y, cellWidth, cellHeight);
        const val = this.getValue(r, c);
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
    const col = Math.floor(x / this.cellWidth) + Math.floor(this.scrollX / this.cellWidth);
    const row = Math.floor(y / this.cellHeight) + Math.floor(this.scrollY / this.cellHeight);
    this.selection.selectCell(row, col);
    this.render();

    const stats = this.selection.getStats((r, c) => this.getValue(r, c));
    console.log('Stats:', stats);
  }

  handleDoubleClick(x, y) {
    const col = Math.floor(x / this.cellWidth) + Math.floor(this.scrollX / this.cellWidth);
    const row = Math.floor(y / this.cellHeight) + Math.floor(this.scrollY / this.cellHeight);

    const newValue = prompt('Enter new value:', this.getValue(row, col));
    if (newValue !== null) {
      this.setValue(row, col, isNaN(newValue) ? newValue : parseFloat(newValue));
    }
  }

  undo() {
    this.commandManager.undo();
  }

  redo() {
    this.commandManager.redo();
  }
}
