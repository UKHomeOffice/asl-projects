import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import ChangedBadge from './changed-badge';

const changeFields = (step, prefix) => step.reusable ? [ `reusableSteps.${step.reusableStepId}` ] : [ prefix.substr(0, prefix.length - 1) ];

export default function StepBadge(props) {
  const { previous, steps, firstSteps, grantedSteps } = useSelector(state => state.application.previousProtocols);
  if (!previous || !steps || !firstSteps || !grantedSteps) {
    return null;
  }

  let stepIds = [];
  let previousIndex = -1;
  steps.forEach(protocol => {
    protocol.forEach((step, i) => {
      if (step.id === props.fields.id && props.position !== i) {
        previousIndex = i;
      }
      stepIds.push(step.id);
    });
  });

  let grantedIndex = -1;
  let grantedStepIds = [];
  grantedSteps.forEach(protocol => {
    protocol.forEach((step, i) => {
      if (step.id === props.fields.id && props.position !== i) {
        grantedIndex = i;
      }
      grantedStepIds.push(step.id);
    });
  });

  let firstIndex = -1;
  let firstStepIds = [];
  firstSteps.forEach(protocol => {
    protocol.forEach((step, i) => {
      if (step.id === props.fields.id && props.position !== i) {
        firstIndex = i;
      }
      firstStepIds.push(step.id);
    });
  });
  if (stepIds.includes(props.fields.id) || grantedStepIds.includes(props.fields.id) || firstStepIds.includes(props.fields.id)) {
    let move;
    if (previousIndex !== -1) {
      move = <span className="badge reordered">{previousIndex > props.position ? 'Moved up' : 'Moved down'}</span>;
    } else if (grantedIndex !== -1) {
      move = <span className="badge">{grantedIndex > props.position ? 'Moved up' : 'Moved down'}</span>;
    } else if (grantedSteps.length > 0 && firstIndex !== -1) {
      move = <span className="badge">{firstIndex > props.position ? 'Moved up' : 'Moved down'}</span>;
    }
    return (
      <>
        <ChangedBadge fields={changeFields(props.fields, props.changeFieldPrefix)} protocolId={props.protocolId}/>
        {move}
      </>
    );
  } else if (previous.includes(props.protocolId)) {
    return <span className={classnames('badge created')}>new</span>;
  } else {
    return <></>;
  }
}
