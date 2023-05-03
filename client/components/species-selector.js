import React, { Component } from 'react';

import pickBy from 'lodash/pickBy';
import values from 'lodash/values';
import flatten from 'lodash/flatten';
import omit from 'lodash/omit';
import map from 'lodash/map';
import intersection from 'lodash/intersection';
import uniq from 'lodash/uniq';

import { projectSpecies as SPECIES } from '@ukhomeoffice/asl-constants';
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
          label: `Specify type of ${option.label.charAt(0).toLowerCase()}${option.label.substring(1)}`,
          name: `${fieldName}-${option.value}`,
          type: 'other-species-selector'
        }
      };
    }
    return option;
  })
});

class SpeciesSelector extends Component {

  isOpen = options => {
    return intersection(
      this.props.value,
      options.map(option => option.value)
    ).length > 0;
  }

  onGroupChange = name => val => {
    const nopes = (SPECIES[name] || []).map(o => o.value);
    const value = uniq((this.props.value || []).filter(item => !nopes.includes(item)).concat(val));
    this.props.onChange(value);
  }

  onFieldChange = (...args) => {
    this.props.onChange((this.props.value || []).filter(s => !SPECIES.deprecated.find(d => d.value === s)));
    this.props.onFieldChange(...args);
  }

  render() {
    const {
      species = SPECIES,
      values: vals,
      label,
      onFieldChange,
      name,
      hint,
      confirmRemove
    } = this.props;

    const deprecated = (vals[name] || [])
      .filter(val => species.deprecated.map(d => d.value).includes(val))
      .filter(val => val.indexOf('other') === -1)
      .map(val => (species.deprecated.find(d => d.value === val) || {}).label);

    const deprecatedOthers = flatten(
      values(
        pickBy(vals, (value, key) => {
          return species.deprecated.find(d => `${name}-${d.value}` === key);
        })
      )
    );

    const otherValues = [
      ...(vals[`${name}-other`] || []),
      ...deprecated,
      ...deprecatedOthers
    ];

    return (
      <div className="species-selector">
        <label className="govuk-label" htmlFor={name}>{label}</label>
        {
          hint && <span id={`${name}-hint`} className="govuk-hint">{this.props.hint}</span>
        }
        {
          map(omit(species, 'deprecated'), (options, code) => {
            const filtered = options.filter(o => !species.deprecated.includes(o.value));
            return (
              <details open={this.isOpen(filtered)} key={code}>
                <summary>{SPECIES_CATEGORIES[code]}</summary>
                <Field
                  {...getField(filtered, code, name)}
                  value={vals[name]}
                  onChange={this.onGroupChange(code)}
                  onFieldChange={onFieldChange}
                  confirmRemove={confirmRemove}
                  noComments={true}
                />
              </details>
            );
          })
        }
        <details open={otherValues.length}>
          <summary>Other</summary>
          <br />
          <OtherSpecies
            name={`${name}-other`}
            value={otherValues}
            onFieldChange={this.onFieldChange}
          />
        </details>
      </div>
    );
  }
}

export default SpeciesSelector;
