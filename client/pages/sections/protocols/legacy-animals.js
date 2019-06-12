import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@ukhomeoffice/react-components';
import Fieldset from '../../../components/fieldset';
import ReviewFields from '../../../components/review-fields';
import LEGACY_SPECIES from '../../../constants/legacy-species';

const getFields = fields => {
  return [{
    name: 'species',
    label: '',
    type: 'checkbox',
    className: 'smaller',
    options: LEGACY_SPECIES.map(({ label, value }) => {
      return {
        label,
        value,
        reveal: fields.map(f => ({ ...f, name: `${value}-${f.name}` }))
      }
    })
  }]
}

class LegacyAnimals extends Component {
  rendee () {
    const { onFieldChange, values, fields, prefix, advance, editable } = this.props;
  }
} () => (
  <Fragment>
    {
      editable
        ? (
          <Fieldset
            prefix={prefix}
            fields={getFields(fields)}
            values={values}
            onFieldChange={onFieldChange}
          />
        )
        : values.species && values.species.length
          ? values.species.map(id => {
            const species = LEGACY_SPECIES.find(s => s.value === id);
            return (
              <Fragment key={id}>
                <h3>{species && species.label}</h3>
                <ReviewFields
                  fields={fields.map(f => ({ ...f, name: `${id}-${f.name}` }))}
                  values={values}
                  editLink={`0#${prefix}`}
                />
              </Fragment>
            )
          })
          : <em>No species selected</em>
    }
    {
      editable && <Button className="button-secondary" onClick={advance}>Next section</Button>
    }
  </Fragment>
);

const mapStateToProps = ({ project }, { index }) => ({ values: project.protocols[index] })

export default connect(mapStateToProps)(LegacyAnimals);
