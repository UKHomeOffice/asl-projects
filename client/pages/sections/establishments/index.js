import React from 'react';
import Establishments from './establishments';
import Controls from '../../../components/controls';
import {Link} from "@asl/components";
import {shallowEqual, useSelector} from "react-redux";

export default function Index({ advance, exit, ...props }) {
  const {
    establishment,
    project: {
      ...project
    }
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
          {
            transferToEstablishmentName ? <p className="larger">{transferToEstablishmentName}</p> : <p className="larger">{establishment.name}</p>
          }
          {
            isActive ? <p className="larger"><Link to="/" label="Change"/></p>
              : <p className="larger"><Link page="project.transferDraft" label="Change" establishmentId={establishment.id} projectId={project.id} /></p>
          }
        </fieldset>
      </div>
      <Establishments {...props} editable={true} />
      <Controls onContinue={advance} onExit={exit} />
    </div>
  )
}
