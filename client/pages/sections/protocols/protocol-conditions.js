import React, { Component, Fragment } from 'react';
import conditions from '../../../constants/protocol-conditions';
import { Details, Markdown } from '@asl/components';

class Content extends Component {
  render() {
    return (
      <Fragment>
        <div className="purple-inset">
          <Markdown className="condition-text">{conditions.anaesthesia}</Markdown>
        </div>
        <div className="purple-inset">
          <Markdown className="condition-text">{conditions.generalAnaesthesia}</Markdown>
        </div>
        <div className="purple-inset">
          <Markdown className="condition-text">{conditions.surgery}</Markdown>
        </div>
        <div className="purple-inset">
          <Markdown className="condition-text">{conditions.administration}</Markdown>
        </div>
      </Fragment>
    );
  }
}

class ProtocolConditions extends Component {
  render() {
    return (
      <div className="protocol-conditions">
        <h2>General constraints</h2>

        <p>
          Please note, constraints on procedures involving anaesthesia, surgery, substance administration and withdrawal
          of fluids apply to all protocols.
        </p>

        {
          this.props.pdf ? <Content />
          : (
            <Details summary="Show general constraints">
              <Content />
            </Details>
          )
        }
      </div>
    );
  }
}

export default ProtocolConditions;
