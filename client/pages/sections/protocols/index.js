import React, { Component, Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Fieldset from '../../../components/fieldset';
import Repeater from '../../../components/repeater';
import Controls from '../../../components/controls';

const InactiveStep = ({ index, values }) => (
  <div className="panel light-grey">
    <h3>{`Step ${index + 1}${values.optional === 'Yes' ? ' (optional)' : ''}`}</h3>
  </div>
)

const Step = ({ fields, active, index, values, updateItem }) => {
  return active
    ? <Fragment>
        <h3>{`Step ${index + 1}`}</h3>
        <Fieldset
          fields={fields}
          values={values}
          onFieldChange={(key, value) => updateItem({ [key]: value })}
        />
      </Fragment>
    : <InactiveStep index={index} values={values} />
}

const Steps = ({ steps, updateItem, values }) => {
  return (
    <div className="panel white">
      <h2>Add steps</h2>
      <Repeater
        addOnInit={true}
        onSave={steps => updateItem({ steps })}
        items={values.steps}
      >
        <Step
          {...steps}
        />
      </Repeater>
    </div>
  )
}

class Form extends Component {
  render() {
    const { title, index, name, updateItem, removeItem, prefix = '', ...props } = this.props;
    return (
      <Fragment>
        <div className="panel">
          <a href="#" className="float-right" onClick={e => {
            e.preventDefault();
            removeItem();
          }}>Remove</a>
          <h2>{`Protocol ${index + 1}`}</h2>
          <Fieldset
            { ...props }
            prefix={`${prefix}${name}-${index}-`}
            onFieldChange={(key, value) => updateItem({ [key]: value })}
          />
        </div>
      </Fragment>
    );
  }
}

const Inactive = ({
  values,
  fields,
  index,
  onToggleActive,
  steps,
  updateItem
}) => (
  <section>
    <div className="panel added">
      <a href="#" className="float-right" onClick={e => {
        e.preventDefault();
        onToggleActive();
      }}>Edit</a>
      <h2>{`Protocol ${index + 1}`}</h2>

      <h3>{values.title}</h3>
      <p>{fields.find(f => f.name === 'severity').summary}: <strong>{values.severity && values.severity.toUpperCase()}</strong></p>
      <details>
        <summary>{fields.find(f => f.name === 'description').summary}</summary>
        <p>{values.description}</p>
      </details>
    </div>
    <Steps steps={steps} updateItem={updateItem} values={values}  />
  </section>
)

class Protocol extends Component {
  constructor (props) {
    super(props)
    this.state = {
      active: this.props.active === true
    }
    this.toggleActive = this.toggleActive.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({ active: newProps.active })
  }

  toggleActive() {
    this.setState({ active: !this.state.active });
  }

  render () {
    const { steps, species, updateItem, active, ...props } = this.props;

    return this.state.active
      ? <Form {...props} updateItem={updateItem} />
      : <Inactive
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
        items={values[name]}
        onSave={this.save}
        addOnInit={true}
        onBeforeAdd={() => {
          console.log('added')}
        }
      >
        <Protocol {...this.props} />
      </Repeater>
      <Controls {...this.props} />
    </Fragment>
  }
}

export default Protocols;
