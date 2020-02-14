import React, { Fragment } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { formatDate } from '../../helpers';
import ReviewFields from '../../components/review-fields';
import Review from '../../components/review';
import Banner from '../../components/banner';
import { DATE_FORMAT } from '../../constants';

const LegacyIntroduction = ({ fields, project, values, pdf, readonly, title }) => {

  if (readonly && !pdf) {
    const licenceHolder = project ? project.licenceHolder : null;
    const establishment = project ? project.establishment : null;
    const field = {
      label: 'Licence holder',
      name: 'holder',
      type: 'holder'
    };
    const value = {
      licenceHolder,
      establishment
    };

    fields.splice(1, 0, field);
    values.holder = value;
  }

  const continuationField = fields.find(f => f.name === 'continuation');

  return (
    <div className={classnames('introduction-review', { readonly })}>
      {!readonly && (
        <Fragment>
          <Banner>
            <h2>Please review your answers for</h2>
            <h1>{title}</h1>
          </Banner>
          <h1>{title}</h1>
        </Fragment>
      )}
      <ReviewFields
        values={values}
        fields={fields.filter(f => f.name !== 'continuation')}
      />
    {
      values.continuation && (
        <Review
          {...continuationField}
          label={continuationField.grantedLabel}
          value={values.continuation}
          values={values}
        />
      )
    }
      {readonly && !pdf && (
        <Fragment>
          {project.issueDate && (
            <div className='granted-section'>
              <h3>Date granted</h3>
              <p>{formatDate(project.issueDate, DATE_FORMAT.long)}</p>
            </div>
          )}
          {project.expiryDate && (
            <div className='granted-section'>
              <h3>Expiry date</h3>
              <p>{formatDate(project.expiryDate, DATE_FORMAT.long)}</p>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
}

export default connect(({
  project: values,
  application: { project, readonly }
}) => ({
  values,
  project,
  readonly
}))(LegacyIntroduction);
