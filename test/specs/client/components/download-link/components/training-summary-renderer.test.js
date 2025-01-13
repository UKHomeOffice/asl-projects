import { expect } from 'chai';
import sinon from 'sinon';
import { Document } from 'docx';
import { trainingSummaryRenderer } from '../../../../../../client/components/download-link/components/training-summary-renderer.js';

describe('trainingSummaryRenderer', () => {
  let doc;
  let createParagraphStub;
  let addTableStub;

  beforeEach(() => {
    doc = new Document();
    createParagraphStub = sinon.stub(doc, 'createParagraph').returns({
      heading4: sinon.stub(),
      center: sinon.stub(),
      bullet: sinon.stub()
    });
    addTableStub = sinon.stub(doc, 'addTable');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create a heading for the training record', () => {
    trainingSummaryRenderer(doc, { training: [] });
    expect(createParagraphStub.calledWith('Training record')).to.be.true();
    expect(createParagraphStub().heading4.calledOnce).to.be.true();
  });

  it('should display a message if no training records are found', () => {
    trainingSummaryRenderer(doc, { training: [] });
    expect(createParagraphStub.calledWith('No training records found')).to.be.true;
  });

  it('should create a table with the correct headers', () => {
    const values = {
      training: [
        { isExemption: false, createdAt: '2021-01-01', modules: [], species: [], certificateNumber: '', passDate: '', accreditingBody: '' }
      ]
    };
    trainingSummaryRenderer(doc, values);
    const table = addTableStub.firstCall.args[0];
    expect(table.rows).to.equal(2); // 1 header row + 1 data row
    expect(table.columns).to.equal(4); // 4 headers
  });

  it('should populate the table with training data', () => {
    const values = {
      training: [
        {
          isExemption: false,
          createdAt: '2021-01-01',
          modules: ['Module 1'],
          species: ['Species 1'],
          certificateNumber: '12345',
          passDate: '2021-01-01',
          accreditingBody: 'Body 1'
        }
      ]
    };
    trainingSummaryRenderer(doc, values);
    const table = addTableStub.firstCall.args[0];
    expect(table.getCell(1, 0).createParagraph.calledWith('Certificate')).to.be.true;
    expect(table.getCell(1, 1).createParagraph.calledWith('Module 1').bullet.calledOnce).to.be.true;
    expect(table.getCell(1, 2).createParagraph.calledWith('Species 1').bullet.calledOnce).to.be.true;
    expect(table.getCell(1, 3).createParagraph.calledWith('Certificate number: 12345')).to.be.true;
    expect(table.getCell(1, 3).createParagraph.calledWith('Awarded on: 2021-01-01')).to.be.true;
    expect(table.getCell(1, 3).createParagraph.calledWith('Awarded by: Body 1')).to.be.true;
  });

  it('should handle empty modules and species lists', () => {
    const values = {
      training: [
        {
          isExemption: false,
          createdAt: '2021-01-01',
          modules: [],
          species: [],
          certificateNumber: '12345',
          passDate: '2021-01-01',
          accreditingBody: 'Body 1'
        }
      ]
    };
    trainingSummaryRenderer(doc, values);
    const table = addTableStub.firstCall.args[0];
    expect(table.getCell(1, 1).createParagraph.calledWith('-').center.calledOnce).to.be.true;
    expect(table.getCell(1, 2).createParagraph.calledWith('-').center.calledOnce).to.be.true;
  });
});