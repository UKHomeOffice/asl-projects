import { Input, Select, TextArea, RadioGroup, CheckboxGroup } from '@ukhomeoffice/react-components';
import { TextEditor } from './editor';

import React from 'react';

class Field extends React.Component {

  onChange(value) {
    return this.props.onChange && this.props.onChange(value);
  }

  render() {
    if (this.props.type === 'select') {
      return <Select
        name={ this.props.name }
        label={ this.props.label }
        options={ this.props.options }
        value={ this.props.value }
        error={ this.props.error }
        onChange={ e => this.onChange(e.target.value) }
        />
    }
    if (this.props.type === 'radio') {
      return <RadioGroup
        name={ this.props.name }
        label={ this.props.label }
        options={ this.props.options }
        value={ this.props.value }
        error={ this.props.error }
        onChange={ e => this.onChange(e.target.value) }
        />
    }
    if (this.props.type === 'checkbox') {
      return <CheckboxGroup
        name={ this.props.name }
        label={ this.props.label }
        options={ this.props.options }
        value={ this.props.value }
        error={ this.props.error }
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
        name={ this.props.name }
        label={ this.props.label }
        value={ this.props.value }
        error={ this.props.error }
        onChange={ e => this.onChange(e.target.value) }
        />
    }
    if (this.props.type === 'texteditor') {
      return <TextEditor
        name={ this.props.name }
        label={ this.props.label }
        value={ this.props.value }
        error={ this.props.error }
        // onChange={ e => this.onChange(e.target.value) }
        />
    }
    return <Input
      name={ this.props.name }
      label={ this.props.label }
      value={ this.props.value }
      error={ this.props.error }
      onChange={ e => this.onChange(e.target.value) }
      />
  }

}

export default Field;
