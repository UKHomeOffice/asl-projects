import React, { Component, Fragment } from 'react';
import { Button } from '@ukhomeoffice/react-components';

import Fieldset from '../../../components/fieldset';
import Repeater from '../../../components/repeater';

class Item extends Component {
  render() {
    const { title, index, name, updateItem, removeItem, prefix = '', ...props } = this.props;
    return (
      <Fragment>
        <a href="#" className="float-right" onClick={e => {
          e.preventDefault();
          removeItem();
        }}>Remove</a>
        <h3>{`${title} ${index + 1}`}</h3>
        <Fieldset
          { ...props }
          prefix={`${prefix}${name}-${index}-`}
          onFieldChange={(key, value) => updateItem({ [key]: value })}
        />
      </Fragment>
    );
  }
}

class Protocol extends Component {
  render () {
    const { steps, species, values, updateItem, ...props } = this.props;

    const prefix = `${props.name}-${props.index}-`;

    return (
      <div className='panel'>
        <Item {...props} values={values} updateItem={updateItem} />
        <h2>Steps</h2>
        <Repeater items={values.steps} onSave={state => updateItem({ [steps.name]: state })}>
          <Item {...steps} prefix={prefix} />
        </Repeater>
        <h2>Species</h2>
        <Repeater items={values.species} onSave={state => updateItem({ [species.name]: state })}>
          <Item {...species} prefix={prefix} />
        </Repeater>
      </div>
    )
  }
}

class Protocols extends Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.state = {
      protocols: this.props.values && this.props.values.protocols || []
    };
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
      <Repeater items={values[name]} onSave={this.save} addOnInit={true}>
        <Protocol {...this.props} />
      </Repeater>
      <p className="control-panel">
        <Button onClick={this.props.advance}>Save and continue</Button>
        <Button onClick={this.props.exit} className="button-secondary">Save and exit</Button>
      </p>
    </Fragment>
  }
}

export default Protocols;
