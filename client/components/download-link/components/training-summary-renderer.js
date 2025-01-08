import { Table, TableRow, TableCell, Paragraph } from 'docx';

export function trainingSummaryRenderer(doc, values, renderTable) {
  doc.createParagraph('There was a problem rendering this content');
  doc.createParagraph('There was a problem rendering this content new');
  doc.createParagraph(JSON.stringify(values.training, null, 2));
  const table = new Table({
    rows: [
      new TableRow([
        new TableCell({
          children: [new Paragraph('Hello')]
        }),
        new TableCell({
          children: []
        })
      ]),
      new TableRow([
        new TableCell({
          children: []
        }),
        new TableCell({
          children: [new Paragraph('World')]
        })
      ])
    ]
  });

  doc.addTable(table);
}
