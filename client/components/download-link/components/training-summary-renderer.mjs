import { Table } from 'docx';
import _ from 'lodash';

const { sortBy } = _;



export function trainingSummaryRenderer(doc, values) {
  const TRAINING_RECORD_HEADERS = ['Category', 'Modules', 'Animal types', 'Details'];

  doc.createParagraph('Training record').heading4();

  if (!values?.training?.length) {
    doc.createParagraph('No training records found');
    return;
  }

  const training = sortBy(values.training, ['isExemption', 'createdAt']);
  const rowCount = training.length;

  const table = createTable(rowCount + 1, TRAINING_RECORD_HEADERS.length);

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

function createTable(rows, columns) {
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

function createBulletedList(items, container) {
  if (items.length > 0) {
    items.forEach(item => container.createParagraph(item).bullet());
  } else {
    container.createParagraph('-').center();
  }
}
