import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import classnames from 'classnames'
import { Button } from '@ukhomeoffice/react-components';

import isBoolean from 'lodash/isBoolean';
import every from 'lodash/every';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';

import Repeater from '../../../components/repeater';
import Fieldset from '../../../components/fieldset';
import Controls from '../../../components/controls';
import ExpandingPanel from '../../../components/expandable';

const Section = ({ children, ...props }) => <section {...props}>{ children }</section>

const fieldIncluded = (field, values) => {
  if (!field.conditional) {
    return true;
  }
  return every(Object.keys(field.conditional), key => field.conditional[key] === values[key])
};

const allFieldsCompleted = (fields, values) => {
  return every(fields, field => !isNull(values[field.name]) && !isUndefined(values[field.name]) && values[field.name] !== '')
};

const filterByFieldIncluded = (fields, values) => {
  return fields.filter(f => fieldIncluded(f, values))
};

class Step extends Component {
  state = {
    editing: !allFieldsCompleted(filterByFieldIncluded(this.props.fields, this.props.project), this.props.values),
    expanded: this.props.expanded || false
  }

  toggleEditing = active => {
    const editing = isBoolean(active) ? active : !this.state.active;
    this.setState({ editing })
  }

  toggleExpanded = active => {
    const expanded = isBoolean(active) ? active : !this.state.expanded;
    this.setState({ expanded })
  }

  removeItem = e => {
    e.preventDefault();
    this.props.removeItem();
  }

  onContinue = () => {
    if (this.state.editing) {
      this.toggleEditing(false);
    }
    this.toggleExpanded(false)
  }

  moveUp = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.moveUp();
  }

  moveDown = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.moveDown();
  }

  render() {
    const { prefix, index, fields, values, exit, additional, updateItem, length } = this.props;
    const { editing, expanded } = this.state;

    const Element = editing ? Section : ExpandingPanel;

    return (
      <Element className="step" expanded={expanded} onHeaderClick={this.toggleExpanded}>
        <Fragment>
          {
            !editing && (
              <div className="float-right">
                {
                  length > 1 && (
                    <span>Reorder: <a href="#" disabled={index === 0} onClick={this.moveUp}>Up</a> <a href="#" disabled={index + 1 >= length} onClick={this.moveDown}>Down</a></span>
                  )
                }
                {
                  length > 1 && <span> <a href="#" onClick={this.removeItem}>Remove</a></span>
                }
              </div>
            )
          }
          <h2>
            {`Step ${index + 1}`}
            {
              !editing && values.optional && <span className="light smaller">{` (${values.optional === true ? 'optional' : 'mandatory'})`}</span>
            }
          </h2>
          {
            !editing && values.title && <h3 className={classnames('title', { 'no-wrap': !expanded })}>{ values.title }</h3>
          }
        </Fragment>
        <Fragment>
          {
            !editing && <h3>{additional.title}</h3>
          }
          <Fieldset
            fields={editing ? fields : additional.fields }
            onFieldChange={(key, value) => updateItem({ [key]: value })}
            prefix={`${prefix}steps-${index}-`}
            values={values}
          />
          <Controls
            onContinue={this.onContinue}
            onExit={() => editing ? exit() : this.toggleEditing(true)}
            exitLabel={editing ? 'Save and exit' : 'Edit'}
            exitClassName="link" />
        </Fragment>
      </Element>
    )
  }
}

const stepIsExpanded = (step, fields) => {
  return every(fields, field => !isUndefined(step[field.name]) && !isNull(step[field.name]) && step[field.name] !== '')
}

const getFields = (fields, values) => fields.filter(f => !f.show || f.show(values))

class Steps extends Component {
  state = {
    expanded: false
  }

  expandAll = () => {
    this.setState({
      expanded: this.state.expanded.map(() => true)
    })
  }

  render() {
    const { values, updateItem, index, name, ...props } = this.props;
    const prefix = `${name}-${index}-`;

    return (
      <Fragment>
        <Repeater
          type="step"
          items={values.steps}
          onSave={steps => updateItem({ steps })}
          {...props}
        >
          <Step
            prefix={prefix}
            values={values.steps}
            { ...props }
            map={{ expanded: this.state.expanded }}
          />
        </Repeater>
        {
          !every(this.state.expanded) && <Button onClick={this.expandAll}>Add additional details</Button>
        }
      </Fragment>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const project = state.projects.find(p => p.id === parseInt(ownProps.match.params.id, 10));
  const values = project.protocols[ownProps.index];
  return {
    project,
    values
  }
}

export default connect(mapStateToProps)(Steps);
