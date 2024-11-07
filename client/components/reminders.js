import React, { useState } from 'react';
import Fieldset from './fieldset';

const getFields = conditionKey => {
  return [
    {
      name: `active`,
      label: '',
      type: 'checkbox',
      className: 'smaller',
      preserveHierarchy: true,
      options: [
        {
          label: 'Set a deadline and automated reminders for this condition',
          value: conditionKey,
          reveal: [
            {
              name: conditionKey,
              type: 'repeater',
              singular: 'Condition deadline',
              hint:
                'Licence holders will receive reminders 1 month before,' +
                ' 1 week before and on the deadline date. ASRU will receive' +
                ' a reminder when the deadline has passed.',
              addAnotherLabel: 'Add another deadline',
              addAnotherClassName: 'link',
              showPanel: false,
              fields: [
                {
                  name: 'deadline',
                  type: 'date',
                  label: ''
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};

function Reminders({ conditionKey, onChange, values }) {
  // a defined value for reminders[conditionKey] needs to be set, otherwise the
  // field component will try and pull the value from version.data[conditionKey]
  const [reminders, setReminders] = useState(values || { active: [], [conditionKey]: null });

  const fields = getFields(conditionKey);

  const onFieldChange = (key, value) => {
    const updated = { ...reminders, [key]: value };
    setReminders(updated);
    onChange(updated);
  };

  return (
    <div className="reminders">
      <Fieldset
        fields={fields}
        values={reminders}
        onFieldChange={onFieldChange}
        noComments={true}
      />
    </div>
  );
}

export default Reminders;
