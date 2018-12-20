import React from 'react';
import { Button } from '@ukhomeoffice/react-components';

export default ({
  advance,
  exit,
  advanceLabel = 'Save and continue',
  exitLabel = 'Save and exit'
}) => (
  <p className="control-panel">
    <Button onClick={advance}>{advanceLabel}</Button>
    <Button onClick={exit} className="button-secondary">{exitLabel}</Button>
  </p>
)
