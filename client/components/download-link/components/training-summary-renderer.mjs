import _ from 'lodash';
import { populateTableHeader } from '../helpers/populate-table-header.mjs';
import { initializeTable } from '../helpers/initialize-table.mjs';

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

  const initTable = initializeTable(rowCount + 1, TRAINING_RECORD_HEADERS.length);
  const tableWithHeader = populateTableHeader(initTable, TRAINING_RECORD_HEADERS);
  const tableWithTrainingRecords = populateTableWithTrainingRecords(tableWithHeader, training);

  doc.addTable(tableWithTrainingRecords);
}

export function populateTableWithTrainingRecords(table, training) {
  training.forEach((record, index) => {
    const row = index + 1;

    table.getCell(row, 0).createParagraph(record.isExemption ? 'Exemption' : 'Certificate');
    createBulletedList(record.modules, table.getCell(row, 1));
    createBulletedList(record.species, table.getCell(row, 2));

    const details = [
      `Certificate number: ${record.certificateNumber}`,
      `Awarded on: ${record.passDate}`,
      `Awarded by: ${record.accreditingBody}`
    ];
    details.forEach(detail => table.getCell(row, 3).createParagraph(detail));
  });

  return table;
}

function createBulletedList(items, container) {
  if (items && items.length > 0) {
    items.forEach(item => container.createParagraph(item).bullet());
  } else {
    container.createParagraph('-').center();
  }
}
