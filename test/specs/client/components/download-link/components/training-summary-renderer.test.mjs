import assert from 'assert';
// eslint-disable-next-line implicit-dependencies/no-implicit
import sinon from 'sinon';
import { Document } from 'docx';
import { trainingSummaryRenderer } from '../../../../../../client/components/download-link/components/training-summary-renderer.mjs';

describe('trainingSummaryRenderer', () => {
  let doc;
  let createParagraphStub;
  let addTableStub;
  let table;

  beforeEach(() => {
    doc = new Document();
    createParagraphStub = sinon.stub(doc, 'createParagraph').returns({
      heading4: sinon.stub(),
      center: sinon.stub(),
      bullet: sinon.stub()
    });
    addTableStub = sinon.stub(doc, 'addTable');
    table = {
      getCell: sinon.stub().returns({
        createParagraph: sinon.stub().returns({
          bullet: sinon.stub(),
          center: sinon.stub()
        })
      })
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create a heading for the training record', () => {
    trainingSummaryRenderer(doc, { training: [] });
    assert.equal(createParagraphStub.calledWith('Training record'), true);
    assert.equal(createParagraphStub().heading4.calledOnce, true);
  });

  it('should display a message if no training records are found', () => {
    trainingSummaryRenderer(doc, { training: [] });
    assert.equal(createParagraphStub.calledWith('No training records found'), true);
  });

  it('should create a table with the correct headers', () => {
    const values = {
      training: [
        { isExemption: false, createdAt: '2021-01-01', modules: [], species: [], certificateNumber: '', passDate: '', accreditingBody: '' }
      ]
    };
    trainingSummaryRenderer(doc, values);
    const table = addTableStub.firstCall.args[0];
    assert.equal(table.rows.length, 2); // 1 header row + 1 data row
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
    table = addTableStub.firstCall.args[0];
    assert.equal(table.rows.length, 2); // 1 header row + 1 data row
    // assert.equal(table.getCell(1, 0).createParagraph.calledWith('Certificate'), true);
    // assert.equal(table.getCell(1, 1).createParagraph.calledWith('Module 1').bullet.calledOnce, true);
    // assert.equal(table.getCell(1, 2).createParagraph.calledWith('Species 1').bullet.calledOnce, true);
    // assert.equal(table.getCell(1, 3).createParagraph.calledWith('Certificate number: 12345'), true);
    // assert.equal(table.getCell(1, 3).createParagraph.calledWith('Awarded on: 2021-01-01'), true);
    // assert.equal(table.getCell(1, 3).createParagraph.calledWith('Awarded by: Body 1'), true);
  });

  // it('should handle empty modules and species lists', () => {
  //   const values = {
  //     training: [
  //       {
  //         isExemption: false,
  //         createdAt: '2021-01-01',
  //         modules: [],
  //         species: [],
  //         certificateNumber: '12345',
  //         passDate: '2021-01-01',
  //         accreditingBody: 'Body 1'
  //       }
  //     ]
  //   };
  //   trainingSummaryRenderer(doc, values);
  //   const table = addTableStub.firstCall.args[0];
  //   assert(table.getCell(1, 1).createParagraph.calledWith('-').center.calledOnce).to.be.true;
  //   assert(table.getCell(1, 2).createParagraph.calledWith('-').center.calledOnce).to.be.true;
  // });
});
