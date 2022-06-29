import React from 'react';
import Establishments from './establishments';
import Controls from '../../../components/controls';
import EstablishmentSelector from "../../../components/establishment-selector";

export default function Index({ advance, exit, ...props }) {
  const isAmendment = props.actualProject.status === 'active';
  return (
    <div className="establishments-section">
      <h1>Establishments</h1>
      <p className="larger">Add any additional establishments where work on this project will be carried out beyond just the primary establishment.</p>
      {!isAmendment &&
        <EstablishmentSelector {...props} review={false} larger={true}></EstablishmentSelector>
      }
      <Establishments {...props} editable={true} />
      <Controls onContinue={advance} onExit={exit} />
    </div>
  )
}
