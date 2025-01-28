import DatabaseService from './DatabaseService';

const databaseService = new DatabaseService();

const processFields = async (fields, sectionId) => {
  try {
    const processField = async (field) => {
      const initialValue = field.defaultValue || null;
      const currentValue = await databaseService.getFieldCurrentValue(field.name, sectionId);
      const previousValue = await databaseService.getFieldPreviousValue(field.name, sectionId);

      return {
        section: sectionId,
        name: field.name,
        label: field.label,
        type: field.type,
        initialValue,
        previousValue,
        currentValue,
        changed: currentValue !== initialValue || currentValue !== previousValue,
      };
    };

    const processNestedFields = async (field) => {
      if (field.options && Array.isArray(field.options)) {
        const nestedFields = await Promise.all(
          field.options.flatMap((option) =>
            option.reveal ? processFields(option.reveal, sectionId) : []
          )
        );
        return nestedFields.flat();
      }
      return [];
    };

    const results = await Promise.all(
      fields.map(async (field) => {
        const baseField = await processField(field);
        const nestedFields = await processNestedFields(field);
        return [baseField, ...nestedFields];
      })
    );

    return results.flat();
  } catch (error) {
    console.error("Error processing fields:", error);
    throw error;
  }
};

export default processFields;