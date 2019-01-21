import React, { Component } from 'react';
import classnames from 'classnames';
import castArray from 'lodash/castArray';

import Repeater from '../../../components/repeater';
import Fieldset from '../../../components/fieldset';
import Controls from '../../../components/controls';

const Establishment = ({ index, fields, updateItem, values, advance, retreat, active, length, goto }) => (
  <div className={classnames({ hidden: index !== active })}>
    <h1>About other establishments - {index + 1} of {length}</h1>
    <div className="playback">
      <dl className="inline">
        <dt>Secondary establishment: </dt>
        <dd>
          <span>{ values.name }</span>
          <a href="#other-establishments-list" onClick={() => goto(0)}>Edit</a>
        </dd>
      </dl>
    </div>
    <Fieldset
      fields={fields}
      values={values}
      onFieldChange={(key, value) => updateItem({ [key]: value })}
    />
    <Controls onContinue={advance} onExit={retreat} exitLabel="Back" />
  </div>
)

class Establishments extends Component {
  state = {
    active: this.props.active || 0,
    items: (this.props.values.establishments || castArray(this.props.values['other-establishments-list']).map(name => ({ name })))
      .filter(item => this.props.values['other-establishments-list'].includes(item.name))
  }

  advance = () => {
    if (this.state.active >= this.state.items.length - 1) {
      return this.props.advance()
    }
    this.setState({
      active: this.state.active + 1
    })
  }

  retreat = () => {
    if (this.state.active === 0) {
      return this.props.retreat();
    }
    return this.setState({
      active: this.state.active - 1
    });
  }

  render() {
    const { save, ...props } = this.props;
    const { items, active } = this.state;
    return (
      <Repeater
        items={items}
        addAnother={false}
        onSave={establishments => save({ establishments })}
      >
        <Establishment
          { ...props }
          active={active}
          advance={this.advance}
          retreat={this.retreat}
        />
      </Repeater>
    )
  }
}

export default Establishments;
