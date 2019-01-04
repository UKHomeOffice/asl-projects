import React, { Fragment } from 'react';

import Review from '../../../components/review';
import Controls from '../../../components/controls';
import Banner from '../../../components/banner';

const ReviewSection = ({ fields, values, advance, onEdit }) => (
  <Fragment>
    <Banner>
      <h2>Please review your answers</h2>
    </Banner>
    {
      fields.map(field => {
        return <Review
          { ...field }
          key={ field.name }
          value={ values[field.name] }
          onEdit={ () => onEdit() }
        />
      })
    }
    <Controls
      onContinue={advance}
      exitClassName="link"
      exitLabel="Back"
      onExit={onEdit}
    />
  </Fragment>
)

export default ReviewSection;
