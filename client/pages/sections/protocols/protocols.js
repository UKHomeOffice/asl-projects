import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import size from 'lodash/size';

import { connectProject } from '../../../helpers';

import ProtocolSections from './protocol-sections';

import Fieldset from '../../../components/fieldset';
import Repeater from '../../../components/repeater';
import Controls from '../../../components/controls';
import Complete from '../../../components/complete';

class Form extends Component {
  removeItem = e => {
    e.preventDefault();
    this.props.removeItem();
  }

  render() {
    const { index, name, updateItem, exit, toggleActive, prefix = '', ...props } = this.props;
    return (
      <div className={classnames('protocol', 'panel')}>
        {
          index !== 0 && (
            <a href="#" className="float-right" onClick={this.removeItem}>Remove</a>
          )
        }

        <h2>{`Protocol ${index + 1}`}</h2>
        <Fieldset
          { ...props }
          fields={props.fields}
          prefix={`${prefix}${name}-${index}-`}
          onFieldChange={(key, value) => updateItem({ [key]: value })}
        />
        <Controls onContinue={toggleActive} onExit={exit} />
      </div>
    );
  }
}

class Protocol extends Component {
  state = {
    active: !this.props.values.title,
    complete: false
  }

  toggleActive = () => {
    this.setState({ active: !this.state.active });
  }

  render() {
    const { steps, exit, save, updateItem, sections, values, fields, index, length } = this.props;

    return this.state.active
      ? <Form
        values={values}
        updateItem={updateItem}
        fields={fields}
        index={index}
        length={length}
        toggleActive={this.toggleActive}
      />
      : <ProtocolSections
          index={index}
          length={length}
          sections={sections}
          values={values}
          onToggleActive={this.toggleActive}
          updateItem={updateItem}
          save={save}
          exit={exit}
          steps={steps}
        />
  }
}

class Protocols extends Component {
  save = protocols => {
    this.props.save({ protocols });
  }

  shouldComponentUpdate(nextProps) {
    const { project: { protocols: { length = 0 } = {} } } = this.props
    const { project: { protocols: { length: nextLength = 0 } = {} } } = nextProps;
    return length !== nextLength;
  }

  render() {
    const { project } = this.props;
    if (!size(project)) {
      return null;
    }
    return <Fragment>
      <h1>Protocols</h1>
      <p>Please enter the details of the protocols that make up this project.</p>
      <Repeater
        type="protocol"
        name="protocols"
        items={project.protocols}
        onSave={this.save}
        addButtonBefore={true}
        onAfterAdd={() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          })
        }}
      >
        <Protocol {...this.props} />
      </Repeater>
    </Fragment>
  }
}

export default connectProject(Protocols);
