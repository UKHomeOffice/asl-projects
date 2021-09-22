import React from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import classnames from 'classnames';
import Repeater from '../../../components/repeater';
import Fieldset from '../../../components/fieldset';
import ReviewFields from '../../../components/review-fields';

const getItems = (values, editable, previousAA) => {
  let items = values['establishments'];

  if (!items || items.length < 1) {
    // b/c - map previously selected additional establishments.
  const otherEstablishments = values['other-establishments-list'];
  items = (otherEstablishments || []).map(est => ({ 'establishment-name': est, id: uuid() }))
  }

  return items.filter(e => {
    if (editable) {
      return true;
    }
    if (e.deleted === true) {
      if (previousAA.showDeleted.includes(e.id)) {
        return true;
      }
      return false;
    }
    return true;
  });
}

function Establishment({ number, editable, fields, values, updateItem, removeItem, restoreItem, prefix = '', ...props }) {
  return (
    <section>
      {
        values.deleted && <span className="badge deleted">removed</span>
      }
      <div className={classnames('aa-establishment panel gutter', { deleted: values.deleted })}>
        {
          editable && <a href="#" className={classnames('inline-block float-right', { restore: values.deleted })} onClick={values.deleted ? restoreItem : removeItem}>{values.deleted ? 'Restore' : 'Remove'}</a>
        }
        <h2>{`Additional establishment ${number + 1}`}</h2>
        {
          (values.deleted || !editable)
            ? <ReviewFields
            { ...props }
            values={values}
            fields={fields}
            prefix={prefix}
            readonly={true}
            hideChanges={true}
          />
            : <Fieldset
            { ...props }
            values={values}
            fields={fields}
            prefix={prefix}
            onFieldChange={(key, value) => updateItem({ [key]: value })}
          />
        }
      </div>
    </section>
  );
}

export default function Establishments({ values, editable, ...props }) {
  const { application } = useSelector(state => state);
  const { readonly, previousAA } = application;

  const items = getItems(values, editable, previousAA);
  const itemProps = {};

  const save = establishments => {
    if (readonly) {
      return;
    }
    props.save({ establishments });
  }

  return (
    <div className="repeats-establishments">
      <Repeater
        type="establishments"
        singular="establishment"
        items={items}
        onSave={save}
        addAnother={editable}
        addButtonBefore={false}
        addButtonAfter={true}
        softDelete={true}
        itemProps={itemProps}
      >
        <Establishment {...props} editable={editable} />
      </Repeater>
    </div>
  )
}
