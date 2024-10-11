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
  return Object.values(schema())
    .reduce((sections, section) => {
      return {
        ...sections,
        ...(section.subsections || {})
      };
    }, {});
}

export default versions;
