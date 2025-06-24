// dataGenerator.js

/**
 * Generate realistic dummy data
 * @param {number} count
 * @returns {Array<Object>}
 */
export function generateData(count = 50000) {
  const firstNames = ["Raj", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Karan", "Neha", "Ravi", "Divya"];
  const lastNames = ["Solanki", "Sharma", "Patel", "Verma", "Yadav", "Singh", "Rana", "Joshi", "Mishra", "Goyal"];

  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      firstName: firstNames[i % firstNames.length],
      lastName: lastNames[i % lastNames.length],
      Age: 20 + (i % 30),
      Salary: 25000 + ((i * 37) % 100000)
    });
  }
  return data;
}
