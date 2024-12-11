export function trainingSummaryRenderer(doc, values, renderTable) {
  doc.createParagraph('There was a problem rendering this content');
  doc.createParagraph('There was a problem rendering this content new');
  doc.createParagraph(JSON.stringify(values.training, null, 2));
  // const table = new Table({
  //   rows: [
  //     new TableRow({
  //       children: [
  //         new TableCell({
  //           children: [new Paragraph('Hello')]
  //         }),
  //         new TableCell({
  //           children: []
  //         })
  //       ]
  //     }),
  //     new TableRow({
  //       children: [
  //         new TableCell({
  //           children: []
  //         }),
  //         new TableCell({
  //           children: [new Paragraph('World')]
  //         })
  //       ]
  //     })
  //   ]
  // });

  // return table;

  return renderTable(doc, values);
}
