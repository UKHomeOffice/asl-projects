import React from 'react';
import { CheckboxGroup } from '@ukhomeoffice/react-components';

const NtsCheckBoxWithModal = (props) => {
    const {
        className,
        label,
        hint,
        name,
        options,
        value,
        error,
        inline,
        confirmRemove,
        project,
        onFieldChange
    } = props;

    // Function to handle onChange event
    const handleCheckboxChange = (e) => {
        const values = [...(value || [])];
        const itemRemoved = values.includes(e.target.value);

        const newValue = itemRemoved
            ? values.filter((v) => v !== e.target.value)
            : [...values, e.target.value];

        if (confirmRemove && itemRemoved) {
            if (confirmRemove(project, e.target.value)) {
                onFieldChange(newValue);
            } else {
                e.preventDefault();
                return false;
            }
        }

        onFieldChange(newValue);
    };

    return (
        <CheckboxGroup
            className={className}
            label={label}
            hint={hint}
            name={name}
            options={options}
            value={value}
            error={error}
            inline={inline}
            onChange={handleCheckboxChange}
        />
    );
};

export default NtsCheckBoxWithModal;
