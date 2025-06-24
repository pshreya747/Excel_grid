// Grid.js
import { Selection } from './Selection.js';
import { Command, CommandManager } from './Command.js';

export class Grid {
  constructor(canvas, data) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.data = data;

    this.cellWidth = 100;
    this.cellHeight = 25;
    this.headerSize = 1; 
    this.cols = Object.keys(data[0]).length;
    this.rows = data.length;

    this.selection = new Selection();
    this.commandManager = new CommandManager();

    this.viewportCols = Math.ceil(window.innerWidth / this.cellWidth);
    this.viewportRows = Math.ceil(window.innerHeight / this.cellHeight);

    this.scrollX = 0;
    this.scrollY = 0;

    const container = document.getElementById('container');
    const spacer = document.getElementById('spacer');
    this.input = document.getElementById('cellInput');

    // Set canvas and spacer dimensions
    this.canvas.width = (this.viewportCols + 1) * this.cellWidth;
    this.canvas.height = (this.viewportRows + 1) * this.cellHeight;
    spacer.style.width = `${(this.cols + 1) * this.cellWidth}px`;
    spacer.style.height = `${(this.rows + 1) * this.cellHeight}px`;

    container.scrollTop = 0;
    container.scrollLeft = 0;

    container.addEventListener('scroll', (e) => {
      this.scrollX = e.target.scrollLeft;
      this.scrollY = e.target.scrollTop;
      this.canvas.style.transform = `translate(${this.scrollX}px, ${this.scrollY}px)`;
      this.render();
    });

    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left + this.scrollX;
      const y = e.clientY - rect.top + this.scrollY;
      this.handleMouseDown(x, y);
    });

  canvas.addEventListener('dblclick', (e) => {
  e.preventDefault(); 

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const col = Math.floor((x + this.scrollX) / this.cellWidth) - 1;
  const row = Math.floor((y + this.scrollY) / this.cellHeight) - 1;

  if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
    this.selection.selectCell(row, col);
    this.showInput(row, col);
  }
});


    this.input.addEventListener('blur', () => this.saveInput());

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        this.undo();
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        this.redo();
      }
    });

    this.render();
  }

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

    const startRow = Math.max(0, Math.floor(scrollY / cellHeight) - 1);
    const endRow = Math.min(this.rows, startRow + this.viewportRows + 2);
    const startCol = Math.max(0, Math.floor(scrollX / cellWidth) - 1);
    const endCol = Math.min(this.cols, startCol + this.viewportCols + 2);

    // Draw column headers (A, B, C...)
    for (let c = startCol; c < endCol; c++) {
      const x = (c - startCol + 1) * cellWidth;
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(x, 0, cellWidth, cellHeight);
      ctx.strokeRect(x, 0, cellWidth, cellHeight);
      ctx.fillStyle = '#000';
      ctx.fillText(this.columnLabel(c), x + 5, 15);
    }

    // Draw row headers (1, 2, 3...)
    for (let r = startRow; r < endRow; r++) {
      const y = (r - startRow + 1) * cellHeight;
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, y, cellWidth, cellHeight);
      ctx.strokeRect(0, y, cellWidth, cellHeight);
      ctx.fillStyle = '#000';
      ctx.fillText(r + 1, 5, y + 15);
    }

    // Draw cells
    for (let r = startRow; r < endRow; r++) {
      for (let c = startCol; c < endCol; c++) {
        const x = (c - startCol + 1) * cellWidth;
        const y = (r - startRow + 1) * cellHeight;

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
    if (row >= this.rows || col >= this.cols || row < 0 || col < 0) return '';
    const keys = Object.keys(this.data[row]);
    return this.data[row][keys[col]];
  }

  setValue(row, col, value) {
    if (row >= this.rows || col >= this.cols || row < 0 || col < 0) return;
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
  const col = Math.floor((x + this.scrollX) / this.cellWidth) - 1;
  const row = Math.floor((y + this.scrollY) / this.cellHeight) - 1;

  if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
    this.selection.selectCell(row, col);
    this.input.style.display = 'none';
    this.render();
  }
}

handleDoubleClick(x, y) {
  const col = Math.floor((x + this.scrollX) / this.cellWidth) - 1;
  const row = Math.floor((y + this.scrollY) / this.cellHeight) - 1;

  if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
    this.selection.selectCell(row, col);
    this.showInput(row, col);
  }
}

  showInput(row, col) {
    const x = (col + 1) * this.cellWidth;
    const y = (row + 1) * this.cellHeight;

    const value = this.getValue(row, col);

    this.input.style.left = `${x - this.scrollX}px`;
    this.input.style.top = `${y - this.scrollY}px`;
    this.input.style.width = `${this.cellWidth - 2}px`;
    this.input.style.height = `${this.cellHeight - 2}px`;
    this.input.value = value;
    this.input.style.display = 'block';
    this.input.focus();

    this.inputRow = row;
    this.inputCol = col;
  }

  saveInput() {
    if (this.inputRow !== undefined && this.inputCol !== undefined) {
      const newValue = this.input.value;
      this.setValue(this.inputRow, this.inputCol, newValue);
    }
    this.input.style.display = 'none';
  }

  undo() {
    this.commandManager.undo();
  }

  redo() {
    this.commandManager.redo();
  }
}
