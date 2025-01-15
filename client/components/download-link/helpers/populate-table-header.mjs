/**
 * Populates the header row of a table with the provided headers.
 *
 * @param {import('docx').Table} table - The table object to populate.
 * @param {Array<string>} headers - An array of header strings to populate the table header.
 * @returns {import('docx').Table} The updated table object with the populated headers.
 */
export function populateTableHeader(table, headers) {
  headers.forEach((header, index) => {
    table.getCell(0, index).createParagraph(header).center();
  });

  return table;
}
