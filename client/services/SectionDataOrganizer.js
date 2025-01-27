class SectionDataOrganizer {
  constructor(schemaService, databaseService) {
    this.schemaService = schemaService;
    this.databaseService = databaseService;
  }

  async getSectionData(sectionId, fieldId = null) {
    try {
      // Fetch section schema and database values
      const sectionSchema = await this.schemaService.getSectionSchema(sectionId);
      const savedValues = await this.databaseService.list(sectionId);

      // Organize fields
      const fieldsData = [];
      for (const [subsectionKey, fields] of Object.entries(sectionSchema.subsections)) {
        for (const field of fields) {
          if (fieldId && field.name !== fieldId) continue;

          const initialValue = field.defaultValue || null;
          const previousValue = savedValues[field.name] || null;
          const currentValue = savedValues[field.name]?.updatedValue || previousValue;

          fieldsData.push({
            parentSectionID: sectionId,
            section: subsectionKey,
            name: field.name,
            label: field.label,
            type: field.type,
            initialValue,
            previousValue,
            currentValue,
            changed: previousValue !== currentValue,
          });
        }
      }

      return fieldsData;
    } catch (error) {
      console.error("Error fetching section data:", error);
      throw new Error("Failed to fetch section data.");
    }
  }
}

export default SectionDataOrganizer;