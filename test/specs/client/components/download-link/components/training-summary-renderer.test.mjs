// eslint-disable-next-line implicit-dependencies/no-implicit
import sinon from 'sinon';
import { trainingSummaryRenderer, populateTableWithTrainingRecords } from '../../../../../../client/components/download-link/components/training-summary-renderer.mjs';
import assert from 'assert';

describe('trainingSummaryRenderer', () => {
  let doc;

  beforeEach(() => {
    doc = {
      createParagraph: sinon.stub().returnsThis(),
      heading4: sinon.stub().returnsThis(),
      addTable: sinon.stub()
    };
  });

  it('should create a heading and a message when no training records are found', () => {
    const values = { training: [] };

    trainingSummaryRenderer(doc, values);

    assert.equal(doc.createParagraph.calledWith('Training record'), true);
    assert.equal(doc.heading4.called, true);
    assert.equal(doc.createParagraph.calledWith('No training records found'), true);
  });

  it('should create a table with training records', () => {
    const values = {
      training: training
    };

    trainingSummaryRenderer(doc, values);

    assert.equal(doc.createParagraph.calledWith('Training record'), true);
    assert.equal(doc.heading4.called, true);
  });
});

describe('populateTableWithTrainingRecords', () => {
  let table;

  beforeEach(() => {
    table = {
      getCell: sinon.stub().returns({
        createParagraph: sinon.stub().returns({
          bullet: sinon.stub(),
          center: sinon.stub()
        })
      })
    };
  });

  it('should populate table with training records', () => {

    populateTableWithTrainingRecords(table, training);

    assert.equal(table.getCell.calledWith(1, 0), true);
    assert.equal(table.getCell.calledWith(2, 0), true);
    assert.equal(table.getCell(1, 0).createParagraph.calledWith('Certificate'), true);
    assert.equal(table.getCell(2, 0).createParagraph.calledWith('Exemption'), true);
    assert.equal(table.getCell(1, 1).createParagraph.calledWith('Module 1'), true);
    assert.equal(table.getCell(1, 1).createParagraph.calledWith('Module 2'), true);
    assert.equal(table.getCell(2, 1).createParagraph.calledWith('Module A'), true);
    assert.equal(table.getCell(1, 2).createParagraph.calledWith('Species 1'), true);
    assert.equal(table.getCell(1, 2).createParagraph.calledWith('Species 2'), true);
    assert.equal(table.getCell(2, 2).createParagraph.calledWith('Species A'), true);
    assert.equal(table.getCell(1, 3).createParagraph.calledWith('Certificate number: 12345'), true);
    assert.equal(table.getCell(1, 3).createParagraph.calledWith('Awarded on: 2021-01-01'), true);
    assert.equal(table.getCell(1, 3).createParagraph.calledWith('Awarded by: Body 1'), true);
    assert.equal(table.getCell(2, 3).createParagraph.calledWith('Certificate number: 67890'), true);
    assert.equal(table.getCell(2, 3).createParagraph.calledWith('Awarded on: 2021-02-01'), true);
    assert.equal(table.getCell(2, 3).createParagraph.calledWith('Awarded by: Body 2'), true);
  });

  it('should handle empty modules and species lists', () => {
    const training = [
      {
        isExemption: false,
        modules: [],
        species: [],
        certificateNumber: '12345',
        passDate: '2021-01-01',
        accreditingBody: 'Body 1'
      }
    ];

    populateTableWithTrainingRecords(table, training);

    assert.equal(table.getCell(1, 1).createParagraph.calledWith('-'), true);
    assert.equal(table.getCell(1, 2).createParagraph.calledWith('-'), true);
  });

  it('should handle undefined modules and species lists', () => {
    const training = [
      {
        isExemption: false,
        modules: undefined,
        species: undefined,
        certificateNumber: '12345',
        passDate: '2021-01-01',
        accreditingBody: 'Body 1'
      }
    ];

    populateTableWithTrainingRecords(table, training);

    assert.equal(table.getCell(1, 1).createParagraph.calledWith('-'), true);
    assert.equal(table.getCell(1, 2).createParagraph.calledWith('-'), true);
  });
});

const training = [
  {
    isExemption: false,
    modules: ['Module 1', 'Module 2'],
    species: ['Species 1', 'Species 2'],
    certificateNumber: '12345',
    passDate: '2021-01-01',
    accreditingBody: 'Body 1'
  },
  {
    isExemption: true,
    modules: ['Module A'],
    species: ['Species A'],
    certificateNumber: '67890',
    passDate: '2021-02-01',
    accreditingBody: 'Body 2'
  }
];
