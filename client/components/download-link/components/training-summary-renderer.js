import { Table } from 'docx';
import { sortBy } from 'lodash';

export function trainingSummaryRenderer(doc, values) {
  const TRAINING_RECORD_HEADERS = ['Category', 'Modules', 'Animal types', 'Details'];

  if (!values?.training?.length) {
    doc.createParagraph('No training records found');
    return;
  }

  const training = sortBy(values.training, ['isExemption', 'createdAt']);
  const rowCount = training.length;

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

    createBulletedList(element.modules, table.getCell(tableRow, 1));
    createBulletedList(element.species, table.getCell(tableRow, 2));

    const details = [`Certificate number: ${element.certificateNumber}`, `Awarded on: ${element.passDate}`, `Awarded by: ${element.accreditingBody}`];
    details.forEach(detail => table.getCell(tableRow, 3).createParagraph(detail));
  });

  doc.addTable(table);
}

function createBulletedList(items, container) {
  if (items.length > 0) {
    items.forEach(item => container.createParagraph(item).bullet());
  } else {
    container.createParagraph('-').center();
  }
}
