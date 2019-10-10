import React, { Component } from 'react';

import map from 'lodash/map';
import intersection from 'lodash/intersection';
import uniq from 'lodash/uniq';

import SPECIES from '../constants/species';
import SPECIES_CATEGORIES from '../constants/species-categories';

import Field from './field';
import OtherSpecies from './other-species-selector';

const getField = (options, name, fieldName) => ({
  name,
  label: '',
  type: 'checkbox',
  className: 'smaller',
  options: options.map(option => {
    if (option.value.indexOf('other') > -1) {
      return {
        ...option,
        reveal: {
          label: `Which ${option.label.charAt(0).toLowerCase()}${option.label.substring(1)} will you be using?`,
          name: `${fieldName}-${option.value}`,
          type: 'other-species-selector'
        }
      }
    }
    return option
  })
})

class SpeciesSelector extends Component {

  isOpen = options => {
    return intersection(
      this.props.value,
      options.map(option => option.value)
    ).length > 0;
  }

  onGroupChange = name => val => {
    const nopes = (SPECIES[name] || []).map(o => o.value);
    const value = uniq((this.props.value || []).filter(item => !nopes.includes(item)).concat(val))
    this.props.onChange(value);
  }

  render() {
    const {
      species = SPECIES,
      values,
      label,
      onFieldChange,
      name,
      hint
    } = this.props;

    const otherValues = values[`${name}-other`] || []

    return (
      <div className="species-selector">
        <label className="govuk-label" htmlFor={name}>{label}</label>
        {
          hint && <span id={`${name}-hint`} className="govuk-hint">{this.props.hint}</span>
        }
        {
          map(species, (options, code) => (
            <details open={this.isOpen(options)} key={code}>
              <summary>{SPECIES_CATEGORIES[code]}</summary>
              <Field
                {...getField(options, code, name)}
                value={values[name]}
                onChange={this.onGroupChange(code)}
                onFieldChange={onFieldChange}
                noComments={true}
              />
            </details>
          ))
        }
        <details open={otherValues.length}>
          <summary>Other</summary>
          <br />
          <OtherSpecies
            name={`${name}-other`}
            values={otherValues}
            onFieldChange={onFieldChange}
          />
        </details>
      </div>
    )
  }
}

export default SpeciesSelector;
