import React from 'react';
import { Button } from '@ukhomeoffice/react-components';

export default ({
  onContinue,
  continueDisabled = false,
  advanceLabel = 'Save and continue',
}) => (
  <p className="control-panel">
    <Button disabled={continueDisabled} onClick={onContinue}>{advanceLabel}</Button>
  </p>
)
