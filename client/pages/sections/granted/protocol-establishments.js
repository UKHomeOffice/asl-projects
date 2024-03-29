import React from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import ReviewFields from '../../../components/review-fields';
import { getSubsections } from '../../../schema';

const Locations = ({ values }) => {
  const { schemaVersion } = useSelector(state => state.application);
  const fields = get(getSubsections(schemaVersion), 'protocols.sections.details.fields');

  return (
    <div className="locations">
      <ReviewFields
        fields={fields.filter(f => f.name === 'locations')}
        values={values}
      />
    </div>
  );
};

export default Locations;
