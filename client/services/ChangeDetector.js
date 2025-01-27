export function generateNewObject(projectId, schema, values = {}) {
  // Helper to generate fields for a section or subsection
  function generateFields(fields = [], fieldValues = {}) {
    return fields.map(field => ({
      fieldId: field.name || "unknown-field-id",
      name: field.label || "Unnamed Field",
      type: field.type || "unknown",
      status: fieldValues[field.name]?.status || "draft",
      defaultValue: field.default || null,
      previousValue: fieldValues[field.name]?.previous || null,
      currentValue: fieldValues[field.name]?.current || null,
      currentStateValue: fieldValues[field.name]?.state || null,
      changed: fieldValues[field.name]?.changed || false,
      newlyAdded: fieldValues[field.name]?.newlyAdded || false,
      subFields: field.subFields
        ? generateFields(field.subFields, fieldValues[field.name] || {})
        : []
    }));
  }

  // Helper to generate subsections for a section
  function generateSubSections(subSections = {}, subSectionValues = {}) {
    return Object.entries(subSections).map(([subSectionId, subSectionData]) => ({
      sectionId: subSectionId,
      name: subSectionData.title || "Unnamed Sub-section",
      status: subSectionValues[subSectionId]?.status || "draft",
      changed: subSectionValues[subSectionId]?.changed || false,
      newlyAdded: subSectionValues[subSectionId]?.newlyAdded || false,
      defaultValue: subSectionValues[subSectionId]?.default || null,
      previousValue: subSectionValues[subSectionId]?.previous || null,
      currentValue: subSectionValues[subSectionId]?.current || null,
      currentStateValue: subSectionValues[subSectionId]?.state || null,
      fields: generateFields(subSectionData.fields || [], subSectionValues[subSectionId] || {}),
      subSections: generateSubSections(
        subSectionData.subSections || {},
        subSectionValues[subSectionId] || {}
      )
    }));
  }

  // Generate sections for the project
  const sections = Object.entries(schema.sections || {}).map(([sectionId, sectionData]) => ({
    sectionId,
    name: sectionData.title || "Unnamed Section",
    status: values[sectionId]?.status || "draft",
    changed: values[sectionId]?.changed || false,
    newlyAdded: values[sectionId]?.newlyAdded || false,
    defaultValue: values[sectionId]?.default || null,
    previousValue: values[sectionId]?.previous || null,
    currentValue: values[sectionId]?.current || null,
    currentStateValue: values[sectionId]?.state || null,
    fields: generateFields(sectionData.fields || [], values[sectionId] || {}),
    subSections: generateSubSections(sectionData.subSections || {}, values[sectionId] || {})
  }));

  // Construct the final object
  return {
    projectId,
    status: values.status || "draft",
    lastUpdated: new Date().toISOString(),
    sections
  };
}