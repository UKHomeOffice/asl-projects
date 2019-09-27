import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { updateRetrospectiveAssessment } from '../actions/projects';
import intersection from 'lodash/intersection';
import some from 'lodash/some';
import isUndefined from 'lodash/isUndefined';
import isPlainObject from 'lodash/isPlainObject';
import { Button } from '@ukhomeoffice/react-components';
import Field from './field';
import RetrospectiveAssessment from '../constants/retrospective-assessment';

const nopes = [
  'prosimians',
  'marmosets',
  'cynomolgus',
  'rhesus',
  'vervets',
  'baboons',
  'squirrel-monkeys',
  'other-old-world',
  'other-new-world',
  'apes',
  'beagles',
  'other-dogs',
  'cats',
  'horses'
];

function raApplies(project) {
  return !!intersection(project.species, nopes).length ||
    project['endangered-animals'] ||
    some(project.protocols, p => (p.severity || '').match(/severe/ig));
}

function getInitialState(project) {
  if (!isUndefined(project.retrospectiveAssessment)) {
    // legacy licences may have an object containing a boolean/
    if (isPlainObject(project.retrospectiveAssessment)) {
      return project.retrospectiveAssessment['retrospective-assessment-required'];
    }
    // now saved as a boolean
    return !!project.retrospectiveAssessment;
  }
  // previous new licences contained a 'retrospective-assessment' condition.
  if (project.conditions && project.conditions.find(c => c.key.match(/^retrospective-assessment$/))) {
    return true;
  }
  return false;
}

const selector = ({ project, application: { editConditions } }) => ({ project, editConditions });

const RetrospectiveAssessmentRequired = ({ showTitle = true }) => {
  return <div className="conditions retrospective-assessment">
    <div className="condition">
      {
        showTitle && <h3>Retrospective assessment</h3>
      }
      <p className="condition-text">{RetrospectiveAssessment.required}</p>
    </div>
  </div>;
};

export default function RetrospectiveAssessment({ showTitle = true }) {
  const required = raApplies(project);

  if (required) {
    return <RetrospectiveAssessmentRequired showTitle={ showTitle } />;
  }

  const { project, editConditions } = useSelector(selector, shallowEqual);
  const [isChanging, setIsChanging] = useState(false);
  const [raRequired, setRaRequired] = useState(getInitialState(project));
  const dispatch = useDispatch();

  function cancel() {
    setRaRequired(!!project.retrospectiveAssessment);
    setIsChanging(false);
  }

  function onFieldChange(value) {
    setRaRequired(value);
  }

  function save() {
    dispatch(updateRetrospectiveAssessment(raRequired))
      .then(setIsChanging(false));
  }

  return (
    <div className="conditions retrospective-assessment">
      <div className="condition">
        {
          showTitle && <h3>Retrospective assessment</h3>
        }
        {
          isChanging
            ? (
              <Field
                type="radio"
                className="smaller"
                options={[
                  {
                    label: (
                      <Fragment>
                        <h3>This project licence requires a retrospective assessment</h3>
                        <p className="light">{RetrospectiveAssessment.required}</p>
                      </Fragment>
                    ),
                    value: true
                  },
                  {
                    label: (
                      <Fragment>
                        <h3>This project licence does not require a retrospective assessment</h3>
                        <p className="light">{RetrospectiveAssessment.notRequired}</p>
                      </Fragment>
                    ),
                    value: false
                  }
                ]}
                value={raRequired}
                onChange={onFieldChange}
                noComments
              />
            )
            : (
              <p className="condition-text">
                {
                  raRequired
                    ? RetrospectiveAssessment.required
                    : RetrospectiveAssessment.notRequired
                }
              </p>
            )
        }
      </div>
      {
        editConditions && (
          <p className="control-panel">
            {
              isChanging
                ? (
                  <Fragment>
                    <Button onClick={save} className="button-secondary">Save</Button>
                    <Button onClick={cancel} className="link">Cancel</Button>
                  </Fragment>
                )
                : <Button onClick={() => setIsChanging(true)} className="link">Change</Button>
              }

          </p>
        )
      }
    </div>
  )
}
