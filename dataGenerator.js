/**
 * Generate realistic dummy data with exactly 500 columns
 * @param {number} count Number of rows (default: 50000)
 * @param {number} colCount Number of total columns (default: 500)
 * @returns {Array<Object>}
 */
/**
 * Generate 50,000 rows with exactly 500 columns:
 * Columns A-D = actual data (firstName, lastName, Age, Salary)
 * Columns E to column 500 = completely blank
 */
export function generateData(count = 50000, colCount = 500) {
  const firstNames = ["Raj", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Karan", "Neha", "Ravi", "Divya"];
  const lastNames = ["Solanki", "Sharma", "Patel", "Verma", "Yadav", "Singh", "Rana", "Joshi", "Mishra", "Goyal"];

  const data = [];

  for (let i = 0; i < count; i++) {
    const row = {
      firstName: firstNames[i % firstNames.length],
      lastName: lastNames[i % lastNames.length],
      Age: 20 + (i % 30),
      Salary: 25000 + ((i * 37) % 100000),
    };

    // Fill remaining columns with blank entries (Col_1 to Col_496)
    const blankCols = colCount - Object.keys(row).length;
    for (let j = 1; j <= blankCols; j++) {
      row[`Col_${j}`] = ''; // leave empty
    }

    data.push(row);
  }

  return data;
}
