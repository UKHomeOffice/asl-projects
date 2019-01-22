import React, { Component } from 'react';
import { connectProject, connectSettings } from '../helpers';

import castArray from 'lodash/castArray';
import every from 'lodash/every';
import without from 'lodash/without';

import { Input, Select, TextArea, RadioGroup, CheckboxGroup } from '@ukhomeoffice/react-components';

import SpeciesSelector from './species-selector';
import AnimalQuantities from './animal-quantities';
import Duration from './duration';
import { TextEditor } from './editor';


import Fieldset from './fieldset';

class Field extends Component {
  constructor(props) {
    super(props);
    this.mapOptions = this.mapOptions.bind(this);
  }

  onChange(value) {
    return this.props.onChange && this.props.onChange(value);
  }

  onSave(value) {
    return this.props.onSave && this.props.onSave(value);
  }

  mapOptions(options = []) {
    return options.map(option => {
      if (!option.reveal) {
        return option;
      }
      return {
        ...option,
        reveal: (
          <div className="govuk-inset-text">
            <Fieldset
              {...this.props}
              fields={castArray(option.reveal)}
            />
          </div>
        )
      }
    })
  }

  showField() {
    const { conditional, project } = this.props;
    if (!conditional) {
      return true;
    }
    return every(Object.keys(conditional), key => conditional[key] === project[key])
  }

  render() {
    if (!this.showField()) {
      return null;
    }
    let options = this.props.optionsFromSettings
      ? this.props.settings[this.props.optionsFromSettings]
      : this.props.options;
    if (this.props.values && this.props.without) {
      options = without(options, this.props.values[this.props.without]);
    }

    if (this.props.type === 'animal-quantities') {
      return <AnimalQuantities
        label={ this.props.label }
        hint={ this.props.hint }
        name={ this.props.name }
        values={ this.props.project }
        onFieldChange={ this.props.onFieldChange }
      />
    }
    if (this.props.type === 'species-selector') {
      return <SpeciesSelector
        label={ this.props.label }
        hint={ this.props.hint }
        name={ this.props.name }
        values={ this.props.project }
        error={ this.props.error }
        onFieldChange={ this.props.onFieldChange }
        summary={ this.props.summary }
      />
    }
    if (this.props.type === 'duration') {
      return <Duration
        name={ this.props.name }
        label={ this.props.label }
        hint={ this.props.hint }
        error={ this.props.error }
        min={ this.props.min }
        max={ this.props.max }
        value={ this.props.value }
        onChange={ val => this.onChange(val) }
      />
    }
    if (this.props.type === 'select') {
      return <Select
        className={ this.props.className }
        hint={ this.props.hint }
        name={ this.props.name }
        label={ this.props.label }
        options={ options }
        value={ this.props.value }
        error={ this.props.error }
        onChange={ e => this.onChange(e.target.value) }
        />
    }
    if (this.props.type === 'radio') {
      return <RadioGroup
        className={ this.props.className }
        hint={ this.props.hint }
        name={ this.props.name }
        label={ this.props.label }
        options={ this.mapOptions(options) }
        value={ this.props.value }
        error={ this.props.error }
        inline={ this.props.inline }
        onChange={ e => {
          let val = e.target.value;
          if (val === 'true') {
            val = true;
          }
          if (val === 'false') {
            val = false;
          }
          this.onChange(val)
        }}
        />
    }
    if (this.props.type === 'checkbox') {
      return <CheckboxGroup
        className={ this.props.className }
        hint={ this.props.hint }
        name={ this.props.name }
        label={ this.props.label }
        options={ this.mapOptions(options) }
        value={ this.props.value }
        error={ this.props.error }
        inline={ this.props.inline }
        onChange={ e => {
          const values = [ ...(this.props.value || []) ];
          if (values.includes(e.target.value)) {
            return this.onChange(values.filter(v => v !== e.target.value));
          }
          this.onChange([ ...values, e.target.value ]);
        }}
        />
    }
    if (this.props.type === 'textarea') {
      return <TextArea
        className={ this.props.className }
        hint={ this.props.hint }
        name={ this.props.name }
        label={ this.props.label }
        value={ this.props.value || '' }
        error={ this.props.error }
        onChange={ e => this.onChange(e.target.value) }
      />;
    }
    if (this.props.type === 'texteditor') {
      return <TextEditor
        name={ this.props.name }
        label={ this.props.label }
        hint={ this.props.hint }
        value={ this.props.value }
        error={ this.props.error }
        onSave={ value => this.onSave(value) }
      />;
    }
    return <Input
      className={ this.props.className }
      type={ this.props.type || 'text' }
      hint={ this.props.hint }
      name={ this.props.name }
      label={ this.props.label }
      value={ this.props.value || '' }
      error={ this.props.error }
      onChange={ e => this.onChange(e.target.value) }
    />;
  }

}

export default connectSettings(connectProject(Field))
