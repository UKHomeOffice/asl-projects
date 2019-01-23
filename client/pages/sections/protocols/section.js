import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import every from 'lodash/every';
import flatten from 'lodash/flatten';
import map from 'lodash/map';

import Fieldset from '../../../components/fieldset'
import Controls from '../../../components/controls'

import Review from './review';

const RenderSection = ({ title, label, hideTitle = true, fields, values, prefix, onFieldChange }) => {
  return (
    <Fragment>
      {
        title && !hideTitle && <h3>{title}</h3>
      }
      {
        label && <h4>{label}</h4>
      }
      <Fieldset
        fields={fields}
        values={values}
        prefix={prefix}
        onFieldChange={onFieldChange}
      />
    </Fragment>
  )
}

class Section extends Component {
  constructor(props) {
    super(props);

    const fields = this.props.sections
      ? flatten(map(this.props.sections, section => section.fields))
      : this.props.fields

    this.state = {
      fields,
      review: every(fields, field => this.props.values[field.name])
    };
  }

  toggleReview = () => {
    this.setState({
      review: !this.state.review
    });
  }

  render() {
    const { index, name, values, sections, exit, advance, hideTitle, ...props } = this.props;
    const { review, fields } = this.state;

    let { prefix = '' } = this.props;
    prefix = `${prefix}${name}-${index}-`;

    return review
      ? <Review fields={fields} values={values} advance={advance} onEdit={this.toggleReview} exit={exit} />
      : (
        <Fragment>
          {
            sections
              ? Object.keys(sections).map(section => <RenderSection key={section} {...props} {...sections[section]} prefix={prefix} values={values} hideTitle={false} />)
              : <RenderSection {...props} hideTitle={hideTitle} fields={fields} prefix={prefix} values={values} />
          }

          <Controls onContinue={this.toggleReview} onExit={exit} exitClassName="link" />
        </Fragment>
      );
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = parseInt(ownProps.match.params.id, 10);
  const values = state.projects.find(p => p.id === id).protocols[ownProps.index]
  return {
    values
  };
};

export default connect(mapStateToProps)(Section);
