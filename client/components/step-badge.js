import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import ChangedBadge from "./changed-badge";

const changeFields = (step, prefix) => step.reusable ? [ `reusableSteps.${step.reusableStepId}` ] : [ prefix.substr(0, prefix.length - 1) ];

export default function StepBadge(props) {
  const { granted, previous, steps } = useSelector(state => state.application.previousProtocols);
  let stepIds = [];
  let previousIndex = -1;
  steps.forEach(protocol => {
    protocol.forEach(((step, i) => {
      if ( step.id === props.fields.id && props.position !== i) {
        previousIndex = i;
      }
      stepIds.push(step.id)
    }));
  });
  if (stepIds.includes(props.fields.id)) {
    return (
      <>
        {
          previousIndex !== -1 && <span className="badge reordered">{previousIndex > props.position ? 'Moved up' : 'Moved down'}</span>
        }
        <ChangedBadge fields={changeFields(props.fields, props.changeFieldPrefix)} protocolId={props.protocolId}/>
      </>
    );
  } else if (previous.includes(props.protocolId)) {
    return <span className={classnames('badge created')}>new</span>;
  } else {
    return <></>;
  }
}
