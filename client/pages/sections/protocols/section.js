import React, { Component, Fragment } from 'react';
import every from 'lodash/every';

import Fieldset from '../../../components/fieldset'
import Controls from '../../../components/controls'

import Review from './review';

class Section extends Component {
  constructor(props) {
    super(props);
    this.state = {
      review: every(this.props.fields, field => this.props.values[field.name])
    };
    this.toggleReview = this.toggleReview.bind(this);
  }

  toggleReview() {
    this.setState({
      review: !this.state.review
    });
  }

  render() {
    const { index, name, values, fields, onFieldChange, advance, prefix = '' } = this.props;
    const { review } = this.state;
    return review
      ? <Review fields={fields} values={values} advance={advance} onEdit={this.toggleReview} />
      : (
        <Fragment>
          <Fieldset
            fields={fields}
            values={values}
            prefix={`${prefix}${name}-${index}-`}
            onFieldChange={onFieldChange}
          />
          <Controls onContinue={this.toggleReview} exitClassName="link" />
        </Fragment>
      );
  }
}

export default Section;
