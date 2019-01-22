import React, { Fragment } from 'react';
import { connectProject } from '../../../helpers';

import findIndex from 'lodash/findIndex';

import Banner from '../../../components/banner';
import Review from '../../../components/review';

const ReviewSection = ({ title, fields, values, goto }) => (
  <Fragment>
    <Banner>
      <h2>Please review your answers for:</h2>
      <h1>{ title }</h1>
    </Banner>
    <Review
      {...fields.find(f => f.name === 'poles')}
      value={values.poles}
    />
    {
      values.poles && (
        <Fragment>
          <Review
            {...fields.find(f => f.name === 'poles').options[0].reveal}
            value={values['poles-justification']}
          />
          {
            values.polesList && values.polesList.map((pole, index) => (
              <Fragment key={index}>
                <div key={index} className="panel">
                  <h2>POLE {index + 1}</h2>
                  <Review
                    {...fields.find(f => f.name === 'pole-info')}
                  />
                </div>
                <br />
                <h3>Protocols and steps that will be carried out at this POLE</h3>
                {
                  pole.protocols && Object.keys(pole.protocols).map((key, index) => {
                    const protocol = values.protocols.find(p => p.id === key)
                    const steps = protocol.steps.filter(s => pole.protocols[key].steps.includes(s.id))
                    return (
                      <div key={key} className="protocol-summary">
                        <div className="header">
                          <h2>Protocol {index + 1}</h2>
                          <h3>{protocol.title}</h3>
                          <p>Severity classification: <strong>{protocol.severity.toUpperCase()}</strong></p>
                          <br />
                          {
                            steps.map((step, index) => (
                              <h3 key={index}>Step {findIndex(protocol.steps, s => s.id === step.id) + 1} <span className="smaller-text">{step.title}</span></h3>
                            ))
                          }
                        </div>
                      </div>
                    )
                  })
                }
                <hr />
                <br />
              </Fragment>
            ))
          }
          <Review
            {...fields.find(f => f.name === 'poles-inspection')}
            value={values['poles-inspection']}
            onEdit={() => goto(2)}
          />
          <Review
            {...fields.find(f => f.name === 'poles-transfer')}
            value={values['poles-transfer']}
            onEdit={() => goto(2)}
          />
          {
            values['poles-transfer'] && fields.find(f => f.name === 'poles-transfer').options[0].reveal.map((field, index) => (
              <Review
                key={index}
                {...field}
                value={values[field.name]}
                onEdit={() => goto(2)}
              />
            ))
          }
        </Fragment>
      )
    }

  </Fragment>
)

export default connectProject(ReviewSection)
