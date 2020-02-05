import React from 'react';

class PhaseBanner extends React.Component {

  render() {
    return (
      <div className="govuk-phase-banner">
        <div className="govuk-width-container">
          <h1>This service is no longer available.</h1>
          <p>
            To apply for a project licence, speak to the Home Office liaison contact at your establishment.
          </p>
        </div>
      </div>
    );
  }

}

PhaseBanner.defaultProps = {
  phase: 'prototype'
};

export default PhaseBanner;
