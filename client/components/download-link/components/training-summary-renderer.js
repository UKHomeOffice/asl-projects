import { Table } from 'docx';

export function trainingSummaryRenderer(doc, values) {
  const TRAINING_RECORD_HEADERS = ['Category', 'Modules', 'Animal types', 'Details'];

  const training = values.training;
  const rowCount = training.length > 0 && values.training.length;
  const table = new Table({
    rows: rowCount + 1, // +1 for header row
    columns: TRAINING_RECORD_HEADERS.length
  });

  TRAINING_RECORD_HEADERS.forEach((header, index) => {
    table.getCell(0, index).createParagraph(header);
  });

  training.forEach((element, index) => {
    const category = element.isExemption ? 'Exemption' : 'Certificate';
    const modules = element.modules.flat().join(', ');
    const animalTypes = element.species.flat().join(', ');
    const details = `Certificate number: ${element.certificateNumber}\nAwarded on: ${element.passDate}\nAwarded by: ${element.accreditingBody}`;
    const tableRow = index + 1;

    table.getCell(tableRow, 0).createParagraph(category);
    table.getCell(tableRow, 1).createParagraph(modules);
    table.getCell(tableRow, 2).createParagraph(animalTypes);
    table.getCell(tableRow, 3).createParagraph(details);
  });

  doc.addTable(table);
}
