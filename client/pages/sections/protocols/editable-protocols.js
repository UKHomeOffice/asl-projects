import React, { Fragment } from 'react';
import Protocols from './protocols';
import Controls from '../../../components/controls';

const EditableProtocols = ({ advance, exit, ...props }) => (
  <Fragment>
    <p>Please enter the details of the protocols that make up this project.</p>
    <Protocols {...props} />
    <Controls onContinue={advance} onExit={exit} />
  </Fragment>
)

export default EditableProtocols;
