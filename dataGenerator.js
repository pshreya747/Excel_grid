/**
 * Generate realistic dummy data with exactly 500 columns
 * @param {number} count Number of rows (default: 50000)
 * @param {number} colCount Number of total columns (default: 500)
 * @returns {Array<Object>}
 */
export function generateData(count = 50000, colCount = 500) {
  const firstNames = ["Raj", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Karan", "Neha", "Ravi", "Divya"];
  const lastNames = ["Solanki", "Sharma", "Patel", "Verma", "Yadav", "Singh", "Rana", "Joshi", "Mishra", "Goyal"];

  const baseFields = ["firstName", "lastName", "Age", "Salary"]; // these will be columns A–D
  const additionalCols = colCount - baseFields.length; // remaining columns

  const data = [];

  for (let i = 0; i < count; i++) {
    const row = {
      firstName: firstNames[i % firstNames.length],
      lastName: lastNames[i % lastNames.length],
      Age: 20 + (i % 30),
      Salary: 25000 + ((i * 37) % 100000),
    };

    for (let j = 1; j <= additionalCols; j++) {
      row[`Col_${j}`] = Math.floor(Math.random() * 1000);
    }

    data.push(row);
  }

  return data;
}
