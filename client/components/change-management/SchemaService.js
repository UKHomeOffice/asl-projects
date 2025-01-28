import { flattenReveals } from '../helpers';
class SchemaService {
 constructor(reduxState) {
    this.reduxState = reduxState; // Accept Redux state or props.sections
  }

  /**
   * Fetch schema for a specific section by its ID.
   * @param {string} sectionId - The ID of the section.
   * @returns {Promise<Object>} - The schema for the section.
   */
async getSectionSchema(sectionId) {
    try {
      const response = await fetch(`/schema/sections/${sectionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch schema for section ${sectionId}: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch schema for section ${sectionId}:`, error);
      throw error;
    }
  }


  /**
   * Get all fields for a section from Redux state.
   * @param {string} sectionId - The ID of the section.
   * @returns {Array<Object>} - An array of all fields, including nested fields.
   */
  getAllFields(sectionId) {
  const section = this.reduxState?.sections?.[sectionId];
  if (!section || !section.fields) {
    console.warn(`Section not found or missing fields for ID: ${sectionId}`);
    return [];
  }

  const flattenFields = (fields) => {
    return fields.reduce((allFields, field) => {
      const reveals = field.options?.map((opt) => opt.reveal).filter(Boolean) || [];
      return [...allFields, field, ...flattenFields(reveals.flat())];
    }, []);
  };

  return flattenFields(section.fields || []);
}

  /**
   * Fetch initial values for all fields in a section schema.
   * @param {Object} sectionSchema - The schema object for the section.
   * @returns {Object} - A map of field names to their initial values.
   */
  getInitialValues(sectionSchema) {
    const allFields = this.getAllFields(sectionSchema);
    return allFields.reduce((values, field) => {
      values[field.name] = field.defaultValue || null;
      return values;
    }, {});
  }
}

export default SchemaService;