// class ExcelCanvas {
//   constructor(canvasId) {
//     this.canvas = document.getElementById(canvasId);
//     this.ctx = this.canvas.getContext('2d');
//     this.input = document.getElementById('cellInput');

//     this.cellWidth = 100;
//     this.cellHeight = 24;
//     this.headerWidth = 50;
//     this.headerHeight = 24;
//     this.totalCols = 500;
//     this.totalRows = 50000;

//     this.scrollX = 0;
//     this.scrollY = 0;
//     this.selectedCell = { row: null, col: null };
//     this.data = {};

//     this.generateFlatData(generateData());

//     this.resize();
//     window.addEventListener('resize', () => this.resize());
//     this.attachEvents();
//     this.draw();
//   }

//   generateFlatData(arrayData) {
//     arrayData.forEach((rowObj, rowIndex) => {
//       const values = Object.values(rowObj);
//       for (let colIndex = 0; colIndex < values.length; colIndex++) {
//         const key = `${rowIndex},${colIndex}`;
//         this.data[key] = values[colIndex];
//       }
//     });
//   }

//   resize() {
//     this.canvas.width = window.innerWidth;
//     this.canvas.height = window.innerHeight;
//     this.draw();
//   }

//   attachEvents() {
//     window.addEventListener('wheel', (e) => {
//       this.scrollX += e.deltaX;
//       this.scrollY += e.deltaY;
//       this.scrollX = Math.max(0, Math.min(this.scrollX, this.totalCols * this.cellWidth - this.canvas.width));
//       this.scrollY = Math.max(0, Math.min(this.scrollY, this.totalRows * this.cellHeight - this.canvas.height));
//       this.draw();
//     });

//     this.canvas.addEventListener('click', (e) => this.handleClick(e));
//     this.canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
//     this.input.addEventListener('keydown', (e) => {
//       if (e.key === 'Enter') this.saveInput();
//     });
//     this.input.addEventListener('blur', () => this.saveInput());
//   }

//   getColumnName(index) {
//     let name = '';
//     while (index >= 0) {
//       name = String.fromCharCode((index % 26) + 65) + name;
//       index = Math.floor(index / 26) - 1;
//     }
//     return name;
//   }

//   handleClick(e) {
//     const rect = this.canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     if (x < this.headerWidth || y < this.headerHeight) return;

//     const col = Math.floor((x + this.scrollX - this.headerWidth) / this.cellWidth);
//     const row = Math.floor((y + this.scrollY - this.headerHeight) / this.cellHeight);

//     if (col >= 0 && col < this.totalCols && row >= 0 && row < this.totalRows) {
//       this.selectedCell = { row, col };
//       this.input.style.display = 'none';
//       this.draw();
//     }
//   }

//   handleDoubleClick(e) {
//     const rect = this.canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     if (x < this.headerWidth || y < this.headerHeight) return;

//     const col = Math.floor((x + this.scrollX - this.headerWidth) / this.cellWidth);
//     const row = Math.floor((y + this.scrollY - this.headerHeight) / this.cellHeight);

//     if (col >= 0 && col < this.totalCols && row >= 0 && row < this.totalRows) {
//       this.selectedCell = { row, col };
//       this.showInput(row, col);
//     }
//   }

//   showInput(row, col) {
//     const x = this.headerWidth + col * this.cellWidth - this.scrollX;
//     const y = this.headerHeight + row * this.cellHeight - this.scrollY;
//     const key = `${row},${col}`;

//     this.input.style.left = `${x}px`;
//     this.input.style.top = `${y}px`;
//     this.input.style.width = `${this.cellWidth - 2}px`;
//     this.input.style.height = `${this.cellHeight - 2}px`;
//     this.input.value = this.data[key] || '';
//     this.input.style.display = 'block';
//     this.input.focus();
//   }

//   saveInput() {
//     if (this.selectedCell.row !== null && this.selectedCell.col !== null) {
//       const key = `${this.selectedCell.row},${this.selectedCell.col}`;
//       const value = this.input.value.trim();
//       if (value) {
//         this.data[key] = value;
//       } else {
//         delete this.data[key];
//       }
//       this.input.style.display = 'none';
//       this.draw();
//     }
//   }

//   draw() {
//     const { ctx } = this;
//     ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//     ctx.font = "14px monospace";
//     ctx.textBaseline = "middle";

//     const startCol = Math.floor(this.scrollX / this.cellWidth);
//     const endCol = Math.min(this.totalCols, Math.ceil((this.scrollX + this.canvas.width) / this.cellWidth));
//     const startRow = Math.floor(this.scrollY / this.cellHeight);
//     const endRow = Math.min(this.totalRows, Math.ceil((this.scrollY + this.canvas.height) / this.cellHeight));

//     for (let c = startCol; c < endCol; c++) {
//       const x = this.headerWidth + c * this.cellWidth - this.scrollX;
//       ctx.fillStyle = "#f0f0f0";
//       ctx.fillRect(x, 0, this.cellWidth, this.headerHeight);
//       ctx.strokeRect(x, 0, this.cellWidth, this.headerHeight);
//       ctx.fillStyle = "#000";
//       ctx.fillText(this.getColumnName(c), x + 5, this.headerHeight / 2);
//     }

//     for (let r = startRow; r < endRow; r++) {
//       const y = this.headerHeight + r * this.cellHeight - this.scrollY;
//       ctx.fillStyle = "#f0f0f0";
//       ctx.fillRect(0, y, this.headerWidth, this.cellHeight);
//       ctx.strokeRect(0, y, this.headerWidth, this.cellHeight);
//       ctx.fillStyle = "#000";
//       ctx.fillText((r + 1).toString(), 5, y + this.cellHeight / 2);
//     }

//     for (let r = startRow; r < endRow; r++) {
//       const y = this.headerHeight + r * this.cellHeight - this.scrollY;
//       for (let c = startCol; c < endCol; c++) {
//         const x = this.headerWidth + c * this.cellWidth - this.scrollX;
//         const key = `${r},${c}`;
//         ctx.fillStyle = "#fff";
//         ctx.fillRect(x, y, this.cellWidth, this.cellHeight);
//         ctx.strokeStyle = "#ccc";
//         ctx.strokeRect(x, y, this.cellWidth, this.cellHeight);

//         if (this.data[key]) {
//           ctx.fillStyle = "#333";
//           ctx.fillText(this.data[key], x + 5, y + this.cellHeight / 2);
//         }

//         if (this.selectedCell.row === r && this.selectedCell.col === c) {
//           ctx.strokeStyle = "#0078d7";
//           ctx.lineWidth = 2;
//           ctx.strokeRect(x + 1, y + 1, this.cellWidth - 2, this.cellHeight - 2);
//           ctx.lineWidth = 1;
//         }
//       }
//     }
//   }
// }

// function generateData(count = 100, colCount = 20) {
//   const firstNames = ["Raj", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Karan", "Neha", "Ravi", "Divya"];
//   const lastNames = ["Solanki", "Sharma", "Patel", "Verma", "Yadav", "Singh", "Rana", "Joshi", "Mishra", "Goyal"];

//   const data = [];

//   for (let i = 0; i < count; i++) {
//     const row = {
//       firstName: firstNames[i % firstNames.length],
//       lastName: lastNames[i % lastNames.length],
//       Age: 20 + (i % 30),
//       Salary: 25000 + ((i * 37) % 100000),
//     };
//     const blankCols = colCount - Object.keys(row).length;
//     for (let j = 1; j <= blankCols; j++) {
//       row[`Col_${j}`] = '';
//     }
//     data.push(row);
//   }

//   return data;
// }

// window.onload = () => {
//   new ExcelCanvas('excelCanvas');
// };
