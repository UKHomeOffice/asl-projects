import { Document, Paragraph, TextRun } from 'docx';

export default (application, sections) => {
  const document = new Document();

  const addStyles = () => {

    document.Styles.createParagraphStyle('Question', 'Question')
      .basedOn('Normal')
      .next('Normal')
      .quickFormat()
      .size(24)
      .indent(800)
      .bold()
      .color('#3B3B3B')
      .font('Helvetica')
      .spacing({ before: 200, after: 50 });

    document.Styles.createParagraphStyle('SectionTitle', 'Section Title')
      .basedOn('Normal')
      .next('Normal')
      .quickFormat()
      .size(44)
      .bold()
      .color('#8F23B3')
      .font('Helvetica')
      .spacing({ before: 500, after: 300 });

    document.Styles.createParagraphStyle('ProtocolSectionTitle', 'Protocol Section Title')
      .basedOn('Normal')
      .next('Normal')
      .quickFormat()
      .size(34)
      .bold()
      .color('#005EA5')
      .font('Helvetica')
      .spacing({ before: 500, after: 300 });

    document.Styles.createParagraphStyle('Heading1', 'Heading 1')
      .basedOn('Normal')
      .next('Normal')
      .quickFormat()
      .size(52)
      .bold()
      .font('Helvetica')
      .spacing({ before: 360, after: 400 });

    document.Styles.createParagraphStyle('Heading2', 'Heading 2')
      .basedOn('Normal')
      .next('Normal')
      .quickFormat()
      .size(44)
      .bold()
      .font('Helvetica')
      .spacing({ before: 400, after: 300 });

    document.Styles.createParagraphStyle('Heading3', 'Heading 3')
      .basedOn('Normal')
      .next('Normal')
      .quickFormat()
      .size(36)
      .bold()
      .font('Helvetica')
      .spacing({ before: 400, after: 200 });

    document.Styles.createParagraphStyle('Heading4', 'Heading 4')
      .basedOn('Normal')
      .next('Normal')
      .quickFormat()
      .size(32)
      .bold()
      .font('Helvetica')
      .spacing({ before: 400, after: 200 });

    document.Styles.createParagraphStyle('Heading5', 'Heading 5')
      .basedOn('Normal')
      .next('Normal')
      .quickFormat()
      .size(24)
      .bold()
      .font('Helvetica')
      .spacing({ before: 200, after: 50 });

    document.Styles.createParagraphStyle('body', 'Body')
      .basedOn('Normal')
      .next('Normal')
      .quickFormat()
      .size(24)
      .font('Helvetica')
      .spacing({ before: 200, after: 200 });

    document.Styles.createParagraphStyle('ListParagraph', 'List Paragraph')
      .basedOn('Normal')
      .next('Normal')
      .quickFormat()
      .size(24)
      .font('Helvetica')
      .spacing({ before: 100, after: 100 });


    document.Styles.createParagraphStyle('aside', 'Aside')
      .basedOn('Body')
      .next('Body')
      .quickFormat()
      .size(24)
      .color('999999')
      .italics();

    document.Styles.createParagraphStyle('footerText', 'Footer Text')
      .basedOn('Normal')
      .next('Normal')
      .quickFormat()
      .font('Helvetica')
      .size(20);

    document.Styles.createParagraphStyle('error', 'Error')
      .basedOn('Body')
      .next('Body')
      .quickFormat()
      .color('FF0000')
      .bold()
      .spacing({ after: 0 });

    document.Styles.createParagraphStyle('code', 'Code')
      .basedOn('Body')
      .next('Body')
      .quickFormat()
      .font('Courier')
      .color('FF6666')
      .indent(500);

    document.Styles.createParagraphStyle('condition', 'Condition')
      .basedOn('Body')
      .next('Body')
      .quickFormat()
      .font('Courier')
      .bold()
      .color('666666');
  };

  const addPageNumbers = () => {
    document.Footer.createParagraph()
      .addRun(new TextRun('Page ').pageNumber())
      .addRun(new TextRun(' of ').numberOfTotalPages())
      .style('footerText')
      .right();
  };

  const renderTextEditor = (doc) => {
    return renderText(doc, '[rich text input]');
  };

  const renderRadio = (doc, field) => {
    if (!field.options) {
      return;
    }
    const reveals = [];
    field.options.forEach(opt => {
      const text = new TextRun(`[ ] ${opt.label}`).size(24);
      const paragraph = new Paragraph();
      paragraph.style('body');
      paragraph.addRun(text);
      doc.addParagraph(paragraph);
      if (opt && opt.reveal) {
        [].concat(opt.reveal).forEach(reveal => {
          reveals.push({ ...reveal, show: `"${field.label}" selected "${opt.label}"` })
        });
      }
    });

    renderHorizontalRule(doc);

    reveals.forEach(reveal => {
      renderField(doc, reveal)
    });
  };

  const renderSpeciesSelector = (doc) => {
    return renderText(doc, '[species selection]');
  };

  const renderAdditionalEstablishment = (doc) => {
    return renderText(doc, '[establishment selection]');
  }

  const renderKeywords = (doc) => {
    return renderText(doc, '[input up to 5 free text values]');
  };

  const renderPermissiblePurpose = (doc, field) => {
    return renderRadio(doc, field);
  }

  const renderText = (doc, value) => {
    if (typeof value === 'boolean') {
      value
        ? doc.createParagraph('Yes').style('body')
        : doc.createParagraph('No').style('body');
    } else {
      doc.createParagraph(value).style('body');
    }

    renderHorizontalRule(doc);
  };

  const renderDeclaration = (/*doc, field, values, value*/) => {
    return;
  };

  const renderDuration = (doc) => {
    return renderText(doc, '[duration selection]', true);
  };

  const renderCondition = (doc, condition) => {
    doc.createParagraph('Show if:').style('condition');
    doc.createParagraph(condition.toString()).style('code');
  }

  const renderHorizontalRule = doc => {
    doc.createParagraph('___________________________________________________________________');
  };

  const renderAnimalQuantities = (doc) => {
    renderText(doc, '[input quantities for each species selected]');
  };

  const renderField = (doc, field) => {

    const nopes = [
      'transferToEstablishment'
    ];

    if (nopes.includes(field.name)) {
      return;
    }

    if (!field.label && field.type === 'checkbox' && field.name.includes('declaration')) {
      return renderDeclaration(doc, field);
    }

    doc.createParagraph(field.review || field.label).style('Question')

    if (field.hint) {
      doc.createParagraph(field.hint).style('aside')
    }

    if (field.show) {
      renderCondition(doc, field.showSummary || field.show);
    }

    switch (field.type) {
      case 'species-selector':
        return renderSpeciesSelector(doc);
      case 'animal-quantities':
        return renderAnimalQuantities(doc);
      case 'keywords':
        return renderKeywords(doc);
      case 'duration':
        return renderDuration(doc);
      case 'licenceNumber': {
        return renderText(doc, '[licence number]');
      }
      case 'establishment-selector': {
        return renderText(doc, '[primary establishment]');
      }
      case 'radio':
      case 'checkbox':
        return renderRadio(doc, field);

      case 'additional-availability':
        return renderAdditionalEstablishment(doc, field);

      case 'repeater':
        return renderFields(doc, field, field.fields)

      case 'date':
        return renderText(doc, '[date input]');

      case 'location-selector':
      case 'objective-selector':
        return renderText(doc, '[select from previously input values]');

      case 'permissible-purpose':
        return renderPermissiblePurpose(doc, field);

      case 'text':
      case 'textarea':
      case 'declaration':
        return renderText(doc, '[text input]');

      case 'texteditor':
        return renderTextEditor(doc);
    }

  };

  const renderFields = (doc, subsection, fields) => {
    if (fields) {
      return fields.forEach(field => renderField(doc, field));
    }

    const steps = (subsection.steps) ? subsection.steps : [{ 'fields': subsection.fields }];

    steps.forEach(step => {
      if (step.show) {
        renderCondition(doc, step.showSummary || step.show);
      }
      if (step.repeats) {
        if (step.singular) {
          doc.createParagraph(`Repeat per ${step.singular}`).heading4();
        }
        (step.fields || []).filter(f => f.repeats).forEach(field => renderField(doc, field));
        (step.fields || []).filter(f => !f.repeats).forEach(field => renderField(doc, field));
      } else {
        (step.fields || []).forEach(field => renderField(doc, field));
      }
    });
  }

  const renderProtocol = (doc, name, section) => {
    if (!section.fields) {
      return;
    }

    doc.createParagraph(`${section.title}`).heading4();

    if (section.label) {
      doc.createParagraph(section.label).style('Question');
    }

    switch (name) {
      case 'steps':
        return renderFields(doc, section);
      case 'animals':
      case 'legacy-animals':
        return renderFields(doc, section, section.fields);
      default:
        return renderFields(doc, section);
    }
  };

  const renderProtocolsSection = (doc, subsection) => {
    doc.createParagraph('Protocols').heading3();

    Object.keys(subsection.sections)
      .map(k => renderProtocol(doc, k, subsection.sections[k]))
  };

  const renderSubsection = (doc, subsection) => {
    subsection.name !== 'protocols' && doc.createParagraph(subsection.title).heading3();
    if (subsection.show) {
      renderCondition(doc, subsection.showSummary || subsection.show);
    }

    if(subsection.name === 'protocol' || subsection.name === 'protocols') {
      renderProtocolsSection(doc, subsection);
    } else {
      renderFields(doc, subsection);
    }
  };

  const renderSection = (doc, section) => {
    if (section.title) {
      const sectionTitle = new Paragraph(section.title).heading2();
      doc.addParagraph(sectionTitle);
    }
    if (section.subtitle) {
      doc.createParagraph(section.subtitle).heading2();
    }
    if (section.show) {
      renderCondition(doc, section.showSummary || section.show);
    }
    Object.values(section.subsections).forEach(
      subsection => renderSubsection(doc, subsection)
    );
  };

  const renderDocument = (sections) => {
    document.createParagraph('Application template').heading1();

    sections.forEach(section => {
      const nopes = ['conditions', 'authorisations'];
      if (nopes.includes(section.name)) {
        return;
      }
      renderSection(document, section);
    });
  };

  return Promise.resolve()
    .then(() => addStyles())
    .then(() => renderDocument(sections))
    .then(() => addPageNumbers())
    .then(() => document);
}
