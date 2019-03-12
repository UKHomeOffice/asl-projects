import React, { PureComponent, Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import size from 'lodash/size';
import ProtocolSections from './protocol-sections';

import Fieldset from '../../../components/fieldset';
import Repeater from '../../../components/repeater';
import Controls from '../../../components/controls';

class Form extends PureComponent {
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
        <Controls onContinue={toggleActive} onExit={exit} exitDisabled={true} />
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

  shouldComponentUpdate(newProps, newState) {
    return this.state.active !== newState.active || this.state.complete !== newState.complete;
  }

  render() {
    const { values, steps, exit, save, updateItem, sections, fields, index, length, removeItem, name } = this.props;
    return this.state.active
      ? <Form
        values={values}
        updateItem={updateItem}
        removeItem={removeItem}
        fields={fields}
        index={index}
        length={length}
        toggleActive={this.toggleActive}
      />
      : <ProtocolSections
          values={values}
          index={index}
          length={length}
          sections={sections}
          onToggleActive={this.toggleActive}
          updateItem={updateItem}
          save={save}
          exit={exit}
          steps={steps}
          name={name}
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

  edit = e => {
    e.preventDefault();
    this.props.retreat();
  }

  render() {
    const { project } = this.props;
    if (!size(project)) {
      return null;
    }
    return <div className="protocols-section">
      <h1>Protocols</h1>
      <p>Please enter the details of the protocols that make up this project.</p>
      <Repeater
        type="protocol"
        name="protocols"
        items={project.protocols}
        onSave={this.save}
        addButtonBefore={project.protocols && project.protocols.length > 0 && project.protocols[0].title}
        addButtonAfter={true}
        onAfterAdd={() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          })
        }}
      >
        <Protocol {...this.props} />
      </Repeater>
      <a href="#" onClick={this.props.exit}>List of sections</a>
    </div>
  }
}

const mapStateToProps = ({ project }) => ({ project });

export default connect(mapStateToProps)(Protocols);
