import React from 'react';
import Wizard from '../../../components/wizard';
import Setup from './setup';
import Protocols from './protocols';

const Section = props => (
  <Wizard onProgress={ step => props.onProgress(step) } step={ props.step }>
    <Setup { ...props } />
    <Protocols { ...props } />
  </Wizard>
)

export default Section;
