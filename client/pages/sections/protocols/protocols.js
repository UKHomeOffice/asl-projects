import React, { Component, Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';

import Completable from '../../../components/completable';
import Expandable from '../../../components/expandable';
import Fieldset from '../../../components/fieldset';
import Repeater from '../../../components/repeater';
import Controls from '../../../components/controls';

import Sections from './sections.js';
import Complete from '../../../components/complete';

class Form extends Component {
  render() {
    const { title, index, name, updateItem, removeItem, exit, toggleActive, prefix = '', ...props } = this.props;
    return (
      <div className={classnames('protocol', 'panel')}>
        {
          index !== 0 && (
            <a href="#" className="float-right" onClick={e => {
              e.preventDefault();
              removeItem();
            }}>Remove</a>
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

class ProtocolSections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: !this.props.values.complete
    }
    this.setCompleted = this.setCompleted.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  setCompleted(value) {
    this.props.updateItem({ complete: value });
    this.setState({ expanded: !value })
  }

  toggleExpanded() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  toggleActive(e) {
    this.props.onToggleActive();
  }

  render() {
    const {
      name,
      values,
      sections,
      index,
      steps,
      updateItem
    } = this.props;

    return (
      <section className={classnames('protocol', { complete: values.complete })}>
        <Expandable expanded={this.state.expanded} onHeaderClick={this.toggleExpanded}>
          <Completable status={values.complete ? 'complete' : 'incomplete'}>
            <h2 className="title"><span className="larger">{index + 1}. </span>{values.title}</h2>
            <dl className="inline">
              <dt>Severity category: </dt>
              <dd className="grey">{ values.severity || 'Not set' }</dd>
            </dl>
            <a href="#" onClick={this.toggleActive}>Edit</a>
          </Completable>
          <div>
            <Sections
              name={name}
              index={index}
              sections={sections}
              values={values}
              updateItem={updateItem}
              onFieldChange={(key, value) => updateItem({ [key]: value })}
            />
            <Complete completed={values.complete} onChange={this.setCompleted}/>
          </div>
        </Expandable>
      </section>
    )
  }
}

class Protocol extends Component {
  constructor (props) {
    super(props)
    this.state = {
      active: this.props.active || !this.props.values.title,
      complete: false
    }
    this.toggleActive = this.toggleActive.bind(this);
  }

  toggleActive() {
    this.setState({ active: !this.state.active });
  }

  render () {
    const { steps, species, updateItem, active, ...props } = this.props;

    return this.state.active
      ? <Form {...props} updateItem={updateItem} toggleActive={this.toggleActive} />
      : <ProtocolSections
          {...props}
          onToggleActive={this.toggleActive}
          updateItem={updateItem}
          steps={steps}
        />
  }
}

class Protocols extends Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
  }

  save(protocols) {
    this.props.save({ protocols });
  }

  render() {
    const { values, name } = this.props;
    if (!values) {
      return null;
    }
    return <Fragment>
      <h1>Protocols</h1>
      <p>Please enter the details of the protocols that make up this project</p>
      <Repeater
        type="protocol"
        items={values[name]}
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
      <Controls onContinue={this.props.exit} onExit={this.props.exit} />
    </Fragment>
  }
}

export default Protocols;
