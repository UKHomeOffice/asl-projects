import { Table } from 'docx';

export function trainingSummaryRenderer(doc, values) {
  const TRAINING_RECORD_HEADERS = ['Category', 'Modules', 'Animal types', 'Details'];

  const training = values.training;
  const rowCount = training.length > 0 && values.training.length;

  if (!rowCount) {
    doc.createParagraph('No training records found');
    return;
  }

  const table = new Table({
    rows: rowCount + 1, // +1 for header row
    columns: TRAINING_RECORD_HEADERS.length,
    margins: {
      top: 100,
      right: 100,
      bottom: 100,
      left: 100
    }
  });

  TRAINING_RECORD_HEADERS.forEach((header, index) => {
    table.getCell(0, index).createParagraph(header).center();
  });

  training.forEach((element, index) => {
    const tableRow = index + 1;

    const category = element.isExemption ? 'Exemption' : 'Certificate';
    table.getCell(tableRow, 0).createParagraph(category);

    createBulletedParagraphOfItems(element.modules, table, tableRow, 1);
    createBulletedParagraphOfItems(element.species, table, tableRow, 2);

    const details = [`Certificate number: ${element.certificateNumber}`, `Awarded on: ${element.passDate}`, `Awarded by: ${element.accreditingBody}`];
    details.forEach(detail => table.getCell(tableRow, 3).createParagraph(detail));
  });

  doc.addTable(table);
}

function createBulletedParagraphOfItems(items, table, tableRow, tableColumn) {
  if (items.length > 0) {
    items.forEach(item => table.getCell(tableRow, tableColumn).createParagraph(item).bullet());
  } else {
    table.getCell(tableRow, 2).createParagraph('-').center();
  }
}
