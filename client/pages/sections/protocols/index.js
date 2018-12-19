import React from 'react';
import Wizard from '../../../components/wizard';

import Protocols from './protocols';
import Review from './review';

module.exports = props => (
  <Wizard onProgress={props.onProgress} step={props.step}>
    <Protocols {...props} />
    <Review {...props} />
  </Wizard>
)
