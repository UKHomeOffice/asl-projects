import React, { Fragment } from 'react';
import Review from '../../../components/review';
import ReviewFields from '../../../components/review-fields';
import {getStepTitle, hydrateSteps} from '../../../helpers/steps';

const Step = ({ id, index, fields, prefix, ...props }) => {
  return (
    <div className="granted-step" id={id}>
      <div className="header">
        <h2 className="step-number">Step {index + 1} {props.reference && (<Fragment>: { props.reference }</Fragment>)} <span className="smaller">({ props.optional ? 'Optional' : 'Mandatory'})</span></h2>
        <Review
          {...fields.find(f => f.name === 'title')}
          className=""
          label=""
          prefix={prefix}
          value={props.title}
        />
      </div>
      <div className="body">
        {
          props.adverse === true
            ? (
              <ReviewFields
                fields={fields.find(f => f.name === 'adverse').options.find(o => o.value === true).reveal}
                prefix={prefix}
                values={props}
              />
            )
            : (
              <h3>This step will have no adverse effects that are more than mild and transient.</h3>
            )
        }
      </div>
      {
        !props.pdf && (
          <p className="steps-back-to-top">
            <a href="#step-index">Back to steps index</a>
          </p>
        )
      }
    </div>
  );
};

const Steps = ({ values, fields, pdf, prefix, project }) => {
  let [ steps ] = hydrateSteps(project.protocols, values.steps, project.reusableSteps || {});
  steps = steps.filter(step => !step.deleted);

  return (
    <div className="granted-steps">
      {
        pdf && <h2>Steps</h2>
      }
      {
        !pdf && (
          <Fragment>
            <h3 id="step-index">Index of steps</h3>
            <ol>
              {
                steps.map((step, index) => (
                  <li key={step.id} className="step-index-item">
                    <span>{index + 1}. </span>
                    <a href={`#${step.id}`}>{step.reference || getStepTitle(step.title)}</a><br />
                    <span>{step.optional ? 'Optional' : 'Mandatory'}</span>
                  </li>
                ))
              }
            </ol>
          </Fragment>
        )
      }
      <h3>You may perform these steps in any order</h3>
      {
        steps.map((step, index) => <Step key={step.id} {...step} index={index} fields={fields} pdf={pdf} prefix={`${prefix}steps.${step.id}.`} />)
      }
    </div>
  );
};

export default Steps;
