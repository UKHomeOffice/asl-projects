import { store } from '../store';

class DatabaseService {
  constructor(apiClient, reduxState) {
    this.apiClient = apiClient;
    this.reduxState = reduxState;
  }

getReduxState() {
    return this.reduxState || store.getState(); // Fallback to store if reduxState is not passed
  }
  /**
   * Fetch the current value of a field.
   * @param {string} fieldName - The name of the field.
   * @param {string} sectionId - The ID of the section.
   * @returns {Promise<any>} - The current value of the field.
   */
  async getFieldCurrentValue(fieldName, sectionId) {
    try {
      const state = store.getState();
      const currentValue = state?.project?.[sectionId]?.fields?.[fieldName];
      if (currentValue !== undefined) {
        return currentValue;
      }

      // Fallback to API if not in Redux store
      const response = await this.apiClient.get(`/data/sections/${sectionId}/fields/${fieldName}/current`);
      return response?.value || null;
    } catch (error) {
      console.error(`Error fetching current value for field '${fieldName}' in section '${sectionId}':`, error);
      return null; // Graceful fallback
    }
  }

  /**
   * Fetch the previous value of a field.
   * @param {string} fieldName - The name of the field.
   * @param {string} sectionId - The ID of the section.
   * @returns {Promise<any>} - The previous value of the field.
   */
  async getFieldPreviousValue(fieldName, sectionId) {
    try {
      const state = store.getState();
      const previousValue = state?.project?.previousValues?.[sectionId]?.fields?.[fieldName];
      if (previousValue !== undefined) {
        return previousValue;
      }

      // Fallback to API if not in Redux store
      const response = await this.apiClient.get(`/data/sections/${sectionId}/fields/${fieldName}/previous`);
      return response?.value || null;
    } catch (error) {
      console.error(`Error fetching previous value for field '${fieldName}' in section '${sectionId}':`, error);
      return null; // Graceful fallback
    }
  }

  /**
   * Fetch the values (initial, current, previous) of all fields in a section.
   * @param {string} sectionId - The ID of the section.
   * @param {Object} initialValues - The initial values for the fields.
   * @returns {Promise<Array<Object>>} - Array of fields with their values and change status.
   */
  async getSectionFieldsWithValues(sectionId, initialValues) {
    try {
      const fieldEntries = Object.entries(initialValues);

      // Parallelize field value fetches
      const fieldsWithValues = await Promise.all(
        fieldEntries.map(async ([fieldName, initialValue]) => {
          const currentValue = await this.getFieldCurrentValue(fieldName, sectionId);
          const previousValue = await this.getFieldPreviousValue(fieldName, sectionId);

          return {
            fieldName,
            initialValue,
            currentValue,
            previousValue,
            changed: currentValue !== initialValue || currentValue !== previousValue,
          };
        })
      );

      return fieldsWithValues;
    } catch (error) {
      console.error(`Error fetching section fields for section '${sectionId}':`, error);
      return []; // Return empty array on error
    }
  }
}

export default DatabaseService;