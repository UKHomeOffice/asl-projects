import React, { Fragment } from 'react';
import Fieldset from '../../../components/fieldset';
import { Button } from '@ukhomeoffice/react-components';

const Questions = ({
  title,
  fields,
  values,
  step,
  save,
  advance
}) => (
  <Fragment>
    <h1>{ title }</h1>
    <Fieldset
      fields={fields.filter(f => f.step === step)}
      values={values}
      onFieldChange={(key, val) => save(key, val)}
    />
    <p className="control-panel">
      <Button onClick={advance}>Save and continue</Button>
    </p>
  </Fragment>
);

export default Questions;
