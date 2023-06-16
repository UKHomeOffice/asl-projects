const uniq = require('lodash/uniq');

export default function getLocations(project, establishment) {

  const establishments = project['other-establishments']
    ? (project.establishments || [])
      .filter(e => e.name || e['establishment-name'])
      .filter(e => !e.deleted) // AA which is being removed during amendment
      .map(e => e.name || e['establishment-name'])
    : [];

  const poles = (project.polesList || []).filter(p => p.title).map(p => p.title);

  return uniq([
    project.transferToEstablishmentName || establishment.name,
    ...establishments,
    ...poles
  ]);
}
