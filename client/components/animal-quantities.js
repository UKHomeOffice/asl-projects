import React from 'react';
import { connect } from 'react-redux';
import size from 'lodash/size';
import map from 'lodash/map';
import flatten from 'lodash/flatten';
import Field from './field';
import { projectSpecies as SPECIES } from '@ukhomeoffice/asl-constants';

const AnimalQuantities = ({ label, hint, error, name, species, onFieldChange }) => {
  const definitions = flatten(Object.values(SPECIES));
  return (
    <div className="govuk-form-group">
      <label className="govuk-label" htmlFor={name}>{label}</label>
      { hint && <span id={`${name}-hint`} className="govuk-hint">{hint}</span> }
      { error && <span id={`${name}-error`} className="govuk-error-message">{error}</span> }
      {
        size(species)
          ? map(species, ({ fieldName, value }, key) => {
            const definition = definitions.find(s => s.value === key);
            return <Field
              key={key}
              type="text"
              name={fieldName}
              label={definition ? definition.label : key}
              onChange={val => onFieldChange(fieldName, val)}
              value={value}
            />;
          })
          : <p>No animals have been added</p>
      }
    </div>
  );
};

const mapStateToProps = ({ project }, { name }) => {
  const species = flatten((project.species || []).map(s => {
    if (s.indexOf('other') > -1) {
      return project[`species-${s}`];
    }
    return s;
  }));
  return {
    species: [
      ...species,
      ...(project['species-other'] || [])
    ].reduce((obj, species) => {
      const fieldName = `${name}-${species}`;
      return {
        ...obj,
        [species]: {
          fieldName,
          value: project[fieldName]
        }
      };
    }, {})
  };
};

export default connect(mapStateToProps)(AnimalQuantities);
