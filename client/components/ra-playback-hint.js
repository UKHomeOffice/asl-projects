import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import Markdown from 'react-markdown';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import omit from 'lodash/omit';
import ReviewFields from './review-fields';
import { Details, Inset } from '@ukhomeoffice/asl-components';
import { getFields, isTrainingLicence } from '../helpers';
import getSchema from '../schema';

export default function RAPlaybackHint({ hint, summary, name }) {
  const { grantedVersion, schemaVersion, project } = useSelector(state => state.application);
  const isLegacy = project.schemaVersion === 0;
  const trainingLicence = isTrainingLicence(grantedVersion.data);

  let type = 'default';

  if (isLegacy) {
    type = 'legacy';
  } else if (trainingLicence) {
    type = 'training';
  }

  if (schemaVersion !== 'RA') {
    return hint;
  }

  let fieldName = get(name, type, name.default);
  if (!Array.isArray(fieldName)) {
    fieldName = [fieldName];
  }

  const schema = getSchema[project.schemaVersion]();

  const allFields = flatten(
    Object.values(schema).map(s => flatten(Object.values(s.subsections).map(getFields)))
  );

  const fields = allFields
    .filter(f => fieldName.includes(f.name))
    .map(f => omit(f, 'show'));

  return (
    <Fragment>
      <p><Markdown links={true}>{ hint }</Markdown></p>
      <Details summary={summary} className="ra-playback">
        <Inset>
          <label className="govuk-hint">Extract from Programme of Work or Non-technical Summary</label>
          <ReviewFields
            fields={fields}
            values={grantedVersion.data}
            readonly={true}
          />
        </Inset>
      </Details>
    </Fragment>
  );
}
