import React, { Component } from 'react';
import { connectProject } from '../../../helpers';

import omit from 'lodash/omit';

import Field from '../../../components/field';

class Steps extends Component {
  render() {
    const { steps, value, protocol, index } = this.props;
    return (
      <Field
        label=""
        type="checkbox"
        name={`poles-${index}-protocols-${protocol}-steps`}
        options={steps.map((step, index) => ({ label: `Step ${index + 1}`, value: step.id, hint: step.title }))}
        value={value}
        className="smaller steps"
        onChange={this.props.onStepsChange}
      />
    )
  }
}

class Protocols extends Component {
  state = {
    protocols: this.props.protocols || {},
  }

  onProtocolChange = (value, protocol) => {
    const { protocols } = this.state;
    if (value.length) {
      protocols[protocol] = {};
      return this.setState({ protocols }, this.save)
    }
    if (protocols[protocol]) {
      return this.setState({ protocols: omit(protocols, protocol) }, this.save);
    }
  }

  stepsUpdated = (id, steps) => {
    const { protocols } = this.state;
    if (!protocols[id]) {
      return null;
    }
    protocols[id].steps = steps;
    this.setState({ protocols }, this.save);
  }

  save = () => {
    this.props.updateItem({ protocols: this.state.protocols })
  }

  render() {
    const { project } = this.props;
    if (!project.protocols || !project.protocols.length) {
      return <h3>No protocols have been added. Please revisit this section once you have completed the Protocols section.</h3>;
    }
    return (
      <div className="protocols">
        <h3>Please select all protocols and steps that will be carried out in this POLE</h3>
        {
          project.protocols.map((protocol, index) => (
            <div key={index} className="protocol-summary">
              <div className="header">
                <Field
                  label=""
                  type="checkbox"
                  name={`poles-${this.props.index}-protocols-${index}`}
                  options={[{ label: `Protocol ${index + 1}`, value: protocol.id }]}
                  value={this.state.protocols[protocol.id] ? [protocol.id] : []}
                  className="smaller"
                  onChange={(val) => this.onProtocolChange(val, protocol.id)}
                />
                <div className="header-info">
                  <h3>{ protocol.title }</h3>
                  <p>Severity classification: <strong>{protocol.severity.toUpperCase()}</strong></p>
                </div>
              </div>
              <Steps
                steps={protocol.steps}
                index={this.props.index}
                protocol={index}
                value={this.state.protocols[protocol.id] ? this.state.protocols[protocol.id].steps : []}
                onStepsChange={(steps) => this.stepsUpdated(protocol.id, steps)}
              />
            </div>
          ))
        }
      </div>
    )
  }
}

export default connectProject(Protocols);
