export default function getLocations (project, establishment) {
  const establishments = (project.establishments || []).filter(e => e['establishment-name']).map(e => e['establishment-name']);
  const poles = (project.polesList || []).filter(p => p.title).map(p => p.title);
  return [
    establishment.name,
    ...establishments,
    ...poles
  ];
}