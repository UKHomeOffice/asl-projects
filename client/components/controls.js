import React from 'react';
import { Button } from '@ukhomeoffice/react-components';

export default ({
  onContinue,
  onExit,
  advanceLabel = 'Save and continue',
  exitLabel = 'Save and exit',
  exitClassName = 'button-secondary'
}) => (
  <p className="control-panel">
    <Button onClick={onContinue}>{advanceLabel}</Button>
    <Button onClick={onExit} className={exitClassName}>{exitLabel}</Button>
  </p>
)
