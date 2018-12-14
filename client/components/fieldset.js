import React, { Fragment } from 'react';

import { Button } from '@ukhomeoffice/react-components';
import Field from './field';

const Fieldset = ({ fields, values = {}, onFieldChange }) => (
  <fieldset>
    {
      fields.map(field => {

        return <Field
          { ...field }
          key={ field.name }
          value={ values[field.name] }
          onChange={ value => onFieldChange(field.name, value) }
        />
      })
    }
  </fieldset>
)

export default Fieldset;
