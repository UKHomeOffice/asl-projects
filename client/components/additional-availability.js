import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { RadioGroup, CheckboxGroup } from '@ukhomeoffice/react-components';
import { Details, Inset } from '@ukhomeoffice/asl-components';
import Review from './review';

function ReadOnly(props) {
  return (
    <Fragment>
      <Review
        {...props}
        className=""
        value={props.values.name || props.values['establishment-name']}
        readonly={true}
      />
      <p><em>{props.readOnlyWarning}</em></p>
    </Fragment>
  );
}

export default function AdditionalAvailability(props) {
  const { canTransfer, establishments, newApplication } = useSelector(state => state.application);
  const { establishments: additionalEstablishments } = useSelector(state => state.project);

  if (!canTransfer) {
    return <ReadOnly {...props} />;
  }

  const name = props.name.replace(props.prefix, '');
  const value = props.values[name];

  const availableEstablishments = establishments.filter(e => {
    return e.id === value || !(additionalEstablishments || []).map(e => e['establishment-id']).includes(e.id);
  });

  const estName = props.values['establishment-name'];

  const freeTextSet = !!estName && !value;

  function deselect(e) {
    e.preventDefault();
    props.updateItem({ [name]: null, 'name': null });
  }

  const label = freeTextSet
    ? 'Confirm this establishment by selecting it from the list below'
    : props.label;

  const oversightWarning = newApplication
    ? 'This draft will become instantly visible to staff with oversight of projects at this establishment. Be careful of sharing sensitive information.'
    : 'Staff with oversight of projects at this establishment will be able to see the amended project licence once it’s been approved.';

  const hint = (
    <Fragment>
      <p>{oversightWarning}</p>
      <Details summary="Help if your establishment’s not listed">
        <Inset>
          <p>You need to be invited to join an establishment before you can request to do work there. Contact your chosen establishment for an invite.</p>
        </Inset>
      </Details>
    </Fragment>
  );

  return (
    <Fragment>
      {
        freeTextSet && (
          <Review
            label="Additional establishment name"
            hint="Answer provided:"
            value={estName}
            readonly={true}
          />
        )
      }
      {
        availableEstablishments.length === 0 && (
          <Review
            {...props}
            className=""
            nullValue="No establishments available"
            value={null}
            readonly={true}
          />
        )
      }
      {
        availableEstablishments.length === 1 && (
          <CheckboxGroup
            {...props}
            label={label}
            value={value}
            hint={hint}
            options={[
              {
                label: availableEstablishments[0].name,
                value: availableEstablishments[0].id
              }
            ]}
            onChange={e => {
              const val = e.target.checked ? parseInt(e.target.value, 10) : null;
              const updates = {
                [name]: val,
                name: val
                  ? (availableEstablishments.find(e => e.id === val) || {}).name
                  : null
              };
              props.updateItem(updates);
            }}
          />
        )
      }
      {
        availableEstablishments.length > 1 && (
          <div className="additional-establishments-radios">
            <RadioGroup
              {...props}
              label={label}
              value={value}
              hint={hint}
              options={availableEstablishments.map(est => {
                return {
                  label: est.name,
                  value: est.id
                };
              })}
              onChange={e => {
                const val = parseInt(e.target.value, 10);
                const item = availableEstablishments.find(e => e.id === val);
                props.updateItem({ [name]: val, 'name': item.name });
              }}
            />
            <a href="#" onClick={deselect}>Clear selection</a>
          </div>
        )
      }
    </Fragment>
  );
}
