import React from 'react';
import { Markdown } from '@ukhomeoffice/asl-components';
import Review from '../conditions';

const Conditions = ({ granted, ...props }) => (
  <div className="granted-condition">
    {
      !props.pdf && (
        <p>
          All <a href="https://www.gov.uk/government/publications/project-establishment-licence/project-establishment-licence" target="_blank" rel="noopener noreferrer">standard conditions of project licences</a> apply.<br />
          <span className="grey">Opens in a new window.</span>
        </p>
      )
    }
    <h2>{granted.subtitle}</h2>
    <Markdown className="grey">{granted.intro}</Markdown>
    <Review {...props} />
  </div>
);

export default Conditions;
