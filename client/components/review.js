import React, { Fragment } from 'react';
import { connectProject, connectSettings } from '../helpers';
import { ReviewTextEditor } from './editor';
import speciesOptions from '../constants/species';

import flatten from 'lodash/flatten';
import values from 'lodash/values';

import isUndefined from 'lodash/isUndefined';

class Review extends React.Component {
  replay() {
    let value = this.props.value;
    if (this.props.type === 'radio' && !isUndefined(value)) {
      const options = this.props.optionsFromSettings
        ? this.props.settings[this.props.optionsFromSettings]
        : this.props.options;
      value = options.find(option => option.value ? option.value === value : option === value)
    }

    if (value && this.props.type === 'duration') {
      return (
        <dl className="inline">
          <dt>Years</dt>
          <dd>{value.years || 0}</dd>
          <dt>Months</dt>
          <dd>{value.months || 0}</dd>
        </dl>
      )
    }
    if (this.props.type === 'species-selector') {
      if (this.props.project[`${this.props.name}-other`]) {
        value = [
          ...value,
          this.props.project[`${this.props.name}-other`]
        ]
      }
    }
    if (this.props.type === 'checkbox' || this.props.type === 'species-selector') {
      value = value || [];
      if (!value.length) {
        return (
          <p>
            <em>None selected</em>
          </p>
        );
      }

      const options = this.props.type === 'species-selector'
        ? flatten(values(speciesOptions))
        : this.props.options;

      const getValue = value => {
        const v = options.find(option => option.value === value)
        return v
          ? v.label
          : value
      }

      return (
        <ul>
          {value.map(value => (
            <li key={value}>{getValue(value)}</li>
          ))}
        </ul>
      );
    }
    if (this.props.type === 'animal-quantities') {
      const species = [
        ...(this.props.project.species || []),
        ...(this.props.project['species-other'] || [])
      ].map(s => ({
        key: species && species.value,
        title: flatten(values(speciesOptions)).find(species => species.value === s).label,
        value: this.props.project[`${this.props.name}-${s}`]
      }))

      if (!species.length) {
        return <p>
          <em>No answer provided</em>
        </p>
      }
      return <dl className="inline">
        {
          species.map(s => (
            <Fragment key={s.key}>
              <dt>{s.title}:</dt>
              <dd>{s.value ? s.value : <em>No answer provided</em>}</dd>
            </Fragment>
          ))
        }
      </dl>
    }
    if (this.props.type === 'texteditor' && this.props.value) {
      return <ReviewTextEditor {...this.props} />;
    }
    if (value) {
      return <p>{value.label || value}</p>;
    }
    return (
      <p>
        <em>No answer provided</em>
      </p>
    );
  }

  render() {
    return (
      <div className="review">
        <h3>{this.props.label}</h3>
        {this.replay()}
        <p>
          <a onClick={e => this.props.onEdit(e)} href={`#${this.props.name}`}>
            Edit
          </a>
        </p>
        <hr />
      </div>
    );
  }
}

export default connectSettings(connectProject(Review));
