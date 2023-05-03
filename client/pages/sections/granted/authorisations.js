import React from 'react';
import { Markdown } from '@ukhomeoffice/asl-components';
import Review from '../authorisations';

const Authorisarions = ({ granted, ...props }) => (
  <div className="granted-authorisation">
    {
      props.pdf && <h2>{props.title}</h2>
    }
    <Markdown className="grey">{granted.intro}</Markdown>
    <Review {...props} authorisations={true} />
  </div>
);

export default Authorisarions;
