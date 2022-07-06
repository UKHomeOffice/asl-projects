import React, { Component } from 'react';
import { postError } from '../actions/messaging';
import Banner from './banner';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      info: null
    };
  }

  componentDidCatch(error, info) {
    postError({ error, info });
    this.setState({ error, info });
  }

  render() {
    const {
      message = 'Sorry, there is a problem with this question',
      content = 'Try to refresh the page, if that doesn\'t resolve the problem send the error details below to',
      email = <a href="mailto:aspeltechnicalqueries@homeoffice.gov.uk">aspeltechnicalqueries@homeoffice.gov.uk</a>,
      section = false,
      details
    } = this.props;
    const { error, info } = this.state;
    if (error) {
      return (
        <Banner className="error">
          {
            section
              ? <h1>{ message }</h1>
              : <h3>{ message }</h3>
          }
          <p>{content} {email}</p>
          <details>
            <summary>Error details:</summary>
            <p>{ details }</p>
            <pre>
              { error.stack }
              <br />
              { info.componentStack }
            </pre>
          </details>
        </Banner>
      );
    }
    return this.props.children;
  }
}
