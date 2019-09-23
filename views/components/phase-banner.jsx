import React from 'react';

class PhaseBanner extends React.Component {

  render() {
    return <div className="govuk-phase-banner">
      <div className="govuk-width-container">
        <h1>This service will be retired on 23/10/2019.</h1>
        <h2>
          If you have applications you wish to continue working on, please back them up using the links provided.
        </h2>
        <h2>
          The .ppl files can be uploaded to the new service
          at <br />
          <a href="http://external.aspel.homeoffice.gov.uk">external.aspel.homeoffice.gov.uk</a> <br />
          where you can resume drafting your project application.
        </h2>
      </div>
    </div>;
  }

}

PhaseBanner.defaultProps = {
  phase: 'prototype'
};

export default PhaseBanner;
