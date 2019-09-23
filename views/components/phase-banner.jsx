import React from 'react';

class PhaseBanner extends React.Component {

  render() {
    return <div className="govuk-phase-banner">
      <div className="govuk-width-container">
        <h1>This service will be retired on 31st October 2019.</h1>
        <p>
          If you have applications you wish to continue working on, please download them using the &quot;Backup(.ppl)&quot; link.
        </p>
        <p>
          Upload the .ppl files to the new ASPeL at
          <a href="http://external.aspel.homeoffice.gov.uk">external.aspel.homeoffice.gov.uk</a> where you can resume
          drafting your application.
        </p>
      </div>
    </div>;
  }

}

PhaseBanner.defaultProps = {
  phase: 'prototype'
};

export default PhaseBanner;
