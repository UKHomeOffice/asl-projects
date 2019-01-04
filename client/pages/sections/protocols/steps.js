import React, { Component, Fragment } from 'react';
import classnames from 'classnames'
import isBoolean from 'lodash/isBoolean'

import Repeater from '../../../components/repeater';
import Fieldset from '../../../components/fieldset';
import Controls from '../../../components/controls';
import ExpandingPanel from '../../../components/expandable';

const Section = ({ children, ...props }) => <section {...props}>{ children }</section>

class Step extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editing: true,
      expanded: false
    }
    this.toggleEditing = this.toggleEditing.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.onContinue = this.onContinue.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
  }

  toggleEditing(active) {
    const editing = isBoolean(active) ? active : !this.state.active;
    this.setState({ editing })
  }

  toggleExpanded(active) {
    const expanded = isBoolean(active) ? active : !this.state.expanded;
    this.setState({ expanded })
  }

  removeItem(e) {
    e.preventDefault();
    this.props.removeItem();
  }

  onContinue() {
    if (this.state.editing) {
      this.toggleEditing(false);
    }
    this.toggleExpanded(false)
  }

  moveUp(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.moveUp();
  }

  moveDown(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.moveDown();
  }

  render() {
    const { prefix, index, fields, values, exit, additional, updateItem, length } = this.props
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
              !editing && values.optional && <span className="light smaller">{` (${values.optional === 'Yes' ? 'optional' : 'mandatory'})`}</span>
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

class Steps extends Component {
  render() {
    const { values, updateItem, index, name, ...props } = this.props;
    const prefix = `${name}-${index}-`;
    return (
      <Repeater
        type="step"
        items={values.steps}
        onSave={steps => updateItem({ steps })}
        {...props}
      >
        <Step prefix={prefix} values={values.steps} { ...props } />
      </Repeater>
    )
  }
}

export default Steps;
