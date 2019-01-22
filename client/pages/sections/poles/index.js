import React, { Fragment } from 'react';

import Repeater from '../../../components/repeater';
import Fieldset from '../../../components/fieldset';
import Controls from '../../../components/controls';

import Protocols from './protocols';

const Pole = ({ index, fields, values, updateItem, removeItem, length }) => (
  <Fragment>
    <div className="panel">
      {
        length > 1 && <a href="#" className="float-right" onClick={removeItem}>Remove</a>
      }
      <h2>POLE {index + 1}</h2>
      <Fieldset
        fields={fields}
        values={values}
        onFieldChange={(key, value) => updateItem({ [key]: value })}
      />
    </div>
    <Protocols index={index} updateItem={updateItem} protocols={values.protocols} />
  </Fragment>
)

const Poles = ({ title, save, advance, exit, ...props }) => {
  return (
    <Fragment>
      <h1>{ title }</h1>
      <h2>Specify the details of each POLE that you will be using.</h2>
      <p className="grey">If you can’t specify a grid reference for a POLE, include details that allows it to be easily identified for inspection. This could be an address of a site or a postcode of a farm.</p>
      <p className="grey">If you can only add generic information at this stage, you must be able to provide specific location details at the request of an inspector.</p>
      <Repeater
        items={props.values.polesList}
        type="POLE"
        onSave={poles => save({ polesList: poles })}
      >
        <Pole {...props} />
      </Repeater>
      <Controls onContinue={advance} onExit={exit} />
    </Fragment>
  )
}

export default Poles;
