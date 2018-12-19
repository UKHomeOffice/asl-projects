import React, { Fragment, Component } from 'react';
import { Button } from '@ukhomeoffice/react-components';

import Banner from '../../../components/banner';
import Review from '../../../components/review';

const review = item => {
  console.log(item)
  return Object.keys(item).map(key => {
    if (typeof item[key] === 'object') {
      return review(item[key]);
    }
    return <Review
      key={ key }
      value={ item[key] }
      onEdit={ () => this.edit(field.step) }
    />
  })
}

class ReviewStep extends Component {

  edit(step) {
    if (step !== undefined) {
      return this.props.goto(step);
    }
    this.props.retreat();
  }

  render() {
    if (!this.props.values) {
      return null;
    }
    return <Fragment>
      <Banner>
        <h2>Please review your answers for:</h2>
        <h1>{ this.props.title }</h1>
      </Banner>
      {
        this.props.values.protocols.map((protocol, index) =>
          <Fragment key={index}>
            <h2>{`Protocol ${index + 1}`}</h2>
            {
              review(protocol)
            }
          </Fragment>
        )
      }
      <p className="control-panel">
        <Button onClick={ () => this.props.exit() }>Save and continue</Button>
      </p>
    </Fragment>;
  }

}

export default ReviewStep;
