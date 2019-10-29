import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import ReviewFields from '../../../components/review-fields';
import { getSubsections } from '../../../schema';

const Continued = ({ values, schemaVersion, pdf, title }) => {
  const fields = get(getSubsections(schemaVersion), 'protocols.sections.animals.fields');
  return (
    <Fragment>
      {
        pdf && <h2>{ title }</h2>
      }
      {
        (values.speciesDetails || []).length === 0 && (
          <p>No animal types have been added to this protocol.</p>
        )
      }
      {
        (values.speciesDetails || []).map((s, i) => (
          <Fragment key={i}>
            <h2>{s.name}</h2>
            <h2>Continued use</h2>
            <ReviewFields
              fields={fields.filter(f => f.name === 'continued-use')}
              values={s}
            />
            <h2>Re-use</h2>
            <ReviewFields
              fields={fields.filter(f => f.name === 'reuse')}
              values={s}
            />
          </Fragment>
        ))
      }
    </Fragment>
  )
}

export default connect(({ application: { schemaVersion } }) => ({ schemaVersion }))(Continued);
