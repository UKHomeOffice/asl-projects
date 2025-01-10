import { Table } from 'docx';

export function trainingSummaryRenderer(doc, values) {
  const TRAINING_RECORD_HEADERS = ['Category', 'Modules', 'Animal types', 'Details'];

  const training = values.training;
  const rowCount = training.length > 0 && values.training.length;
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
    table.getCell(0, index).createParagraph(header);
  });

  training.forEach((element, index) => {
    const category = element.isExemption ? 'Exemption' : 'Certificate';
    const modules = element.modules;
    const animalTypes = element.species;
    const details = [`Certificate number: ${element.certificateNumber}`, `Awarded on: ${element.passDate}`, `Awarded by: ${element.accreditingBody}`];
    const tableRow = index + 1;

    table.getCell(tableRow, 0).createParagraph(category);
    modules.forEach(module => table.getCell(tableRow, 1).createParagraph(module).bullet());
    animalTypes.forEach(animalType => table.getCell(tableRow, 2).createParagraph(animalType).bullet());
    details.forEach(detail => table.getCell(tableRow, 3).createParagraph(detail));
  });

  doc.addTable(table);
}
