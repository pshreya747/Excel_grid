import { generateData } from './dataGenerator.js';
import { Grid } from './Grid.js';

window.onload = () => {
  const data = generateData(50000, 500); 
  const canvas = document.getElementById('excelCanvas');
  new Grid(canvas, data);
};