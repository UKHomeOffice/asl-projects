/**
 * Creates a new table with the specified number of rows and columns.
 *
 * @param {number} rows - The number of rows in the table.
 * @param {number} columns - The number of columns in the table.
 * @returns {Table} A new Table instance with the specified rows and columns and default margins.
 */
import { Table } from 'docx';

export function createTable(rows, columns) {
  return new Table({
    rows,
    columns,
    margins: {
      top: 100,
      right: 100,
      bottom: 100,
      left: 100
    }
  });
}
