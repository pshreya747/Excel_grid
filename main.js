import { generateData } from './dataGenerator.js';
import { Grid } from './Grid.js';

window.onload = () => {
  const data = generateData(50000, 500); // Generate 50,000 entries
  const canvas = document.getElementById('excelCanvas');
  const grid = new Grid(canvas, data);

  // Handle click for selection
  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    grid.handleMouseDown(x, y);
  });

  // Handle editing
  canvas.addEventListener('dblclick', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    grid.handleDoubleClick(x, y);
  });

  // Handle keyboard for undo/redo
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') {
      grid.undo();
    } else if (e.ctrlKey && e.key === 'y') {
      grid.redo();
    }
  });
};
