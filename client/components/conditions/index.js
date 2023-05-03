import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { Markdown } from '@ukhomeoffice/asl-components';
import { Button } from '@ukhomeoffice/react-components';
import { updateConditions } from '../../actions/projects';
import Conditions from './conditions';
import AddConditions from './add-conditions';
import RetrospectiveAssessment from '../retrospective-assessment';

function ConditionsPage({
  values,
  type,
  intro,
  emptyIntro,
  emptyIntroReadOnly,
  showConditions,
  editConditions,
  isPreview,
  ...props
}) {
  if (isPreview) {
    editConditions = false;
  }

  if (!showConditions) {
    return null;
  }
  const [adding, setAdding] = useState(false);
  const conditions = (values.conditions || [])
    .filter(condition => condition.type === type)
    // don't show deleted conditions in read-only mode
    .filter(condition => editConditions || !condition.deleted);

  function save(vals) {
    setAdding(false);
    props.saveConditions([ ...conditions, ...vals ]);
  }

  function cancel() {
    setAdding(false);
  }

  return (
    <Fragment>
      {
        editConditions && <Markdown className="grey">{conditions.length ? intro : emptyIntro}</Markdown>
      }
      {
        !editConditions && !conditions.length && <Markdown className="grey">{emptyIntroReadOnly}</Markdown>
      }
      {
        editConditions && <RetrospectiveAssessment />
      }
      <Conditions
        scope="project"
        type={type}
        conditions={conditions}
        {...props}
      />
      {
        editConditions && (
          <Fragment>
            {
              adding
                ? <AddConditions
                  type={type}
                  onCancel={cancel}
                  onSave={save}
                  omit={conditions.map(c => c.key)}
                  {...props}
                />
                : <Button className="button-secondary" onClick={() => setAdding(!adding)}>{`Add more ${props.title.toLowerCase()}`}</Button>
            }
          </Fragment>
        )
      }
    </Fragment>
  );
}

export default connect(({ application: { showConditions, editConditions, isPreview } }) => ({ showConditions, editConditions, isPreview }), (dispatch, { type }) => ({
  saveConditions: conditions => dispatch(updateConditions(type, conditions))
}))(ConditionsPage);
