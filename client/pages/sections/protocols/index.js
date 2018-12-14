import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import Wizard from '../../../components/wizard';
import Fieldset from '../../../components/fieldset';
import Repeater from '../../../components/repeater';

class Protocols extends Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
  }

  save(key, field, val) {
    console.log(key, field, val)
    // this.props.save(key, val)
  }

  render() {
    const { fields, values, title } = this.props;
    return <Fragment>
      <h1>{title}</h1>
      <Repeater
        title="Rabbits"
        name="rabbits"
        items={[
          {
            name: 'Rabbit 1',
            colour: 'White'
          }
        ]}

        fields={fields.filter(f => f.step === 0)}
      >
        <Fieldset
          // onFieldChange={(key, val) => this.save('rabbits', key, val)}
        />
        <Repeater
          title="Attributes"
          name="attributes"
          fields={fields.filter(f => f.step === 1)}
        >
          <Fieldset />
        </Repeater>
      </Repeater>
    </Fragment>;
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state, ownProps);
}

export default connect(mapStateToProps)(Protocols);
