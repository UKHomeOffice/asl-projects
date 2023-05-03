import React from 'react';
import Establishments from './establishments';
import Controls from '../../../components/controls';
import {shallowEqual, useSelector} from 'react-redux';
import {Inset, Link} from '@ukhomeoffice/asl-components';

export default function Index({ advance, exit, ...props }) {
  const {
    establishment,
    project: {
      ...project
    },
    canTransfer
  } = useSelector(state => state.application, shallowEqual);

  const transferToEstablishmentName = useSelector(state => state.project.transferToEstablishmentName, shallowEqual);

  const isActive = project.status === 'active';

  return (
    <div className="establishments-section">
      <h1>Establishments</h1>
      <p className="larger">Add any additional establishments where work on this project will be carried out beyond just the primary establishment.</p>
      <div className="govuk-form-group">
        <fieldset className="govuk-fieldset inline smaller">
          <legend className="govuk-fieldset__legend">
            <h2 className="govuk-fieldset__heading govuk-heading-l larger">Primary establishment</h2>
          </legend>
          <p className="larger">{transferToEstablishmentName || establishment.name}</p>
          <p className="larger">
            {
              canTransfer
                ? isActive
                  ? <Link to="/" label="Change"/>
                  : <Link page="project.transferDraft" label="Change" establishmentId={establishment.id} projectId={project.id} />
                : null
            }
            {
              !canTransfer && <Inset><p>Only the project’s licence holder can change the primary establishment.</p></Inset>
            }
          </p>
        </fieldset>
      </div>
      <Establishments {...props} editable={true} />
      <Controls onContinue={advance} onExit={exit} />
    </div>
  );
}
