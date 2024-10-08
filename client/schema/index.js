import pickBy from 'lodash/pickBy';
import isUndefined from 'lodash/isUndefined';

import v0 from './v0';
import v1 from './v1';
import ra from './ra';

const versions = {
  0: v0,
  1: v1,
  'RA': ra
};

export function getGrantedSubsections(schemaVersion) {
  const schema = versions[schemaVersion];
  return Object.values(schema())
    .reduce((sections, section) => {
      return {
        ...sections,
        ...pickBy(section.subsections, subsection => {
          return !isUndefined(subsection.granted);
        })
      };
    }, {});
}

export function getSubsections(schemaVersion) {
  const schema = versions[schemaVersion];
  const subsections = Object.values(schema())
    .reduce((sections, section) => {
      return {
        ...sections,
        ...(section.subsections || {})
      };
    }, {});

  if (schemaVersion === 1) {
    // inject the project licence holder into introductory details
    const field = [
      {
        label: 'Licence holder',
        name: 'licenceHolder',
        type: 'holder-name'
      }
    ];

    subsections['introduction'].fields.splice(1, 0, field);
  }

  return subsections;
}

export default versions;
