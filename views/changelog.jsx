import React from 'react';
import Layout from './layout';

class Index extends React.Component {

  render() {
    return <Layout {...this.props}>
      <main className="main govuk-main-wrapper" id="content">
        <div className="govuk-width-container">
          <h1>Changelog</h1>

          <h2>Version [next] - XXth March 2019</h2>
          <ul>
            <li>Fix issue with other species not showing in Word export</li>
            <li>Fix issue with protocol species questions not appearing in Word export</li>
            <li>Fix issue with &quot;minimise the suffering&quot; text-editor disappearing when given focus</li>
          </ul>

          <h2>Version 1.6.0 - 26th February 2019</h2>
          <ul>
            <li>Fix issue with certain questions not being included in Word export</li>
            <li>Add call to action on non-technical summary review page</li>
          </ul>
          <p><a href="/">Return to project list</a></p>
        </div>
      </main>
    </Layout>
  }

}

export default Index;
