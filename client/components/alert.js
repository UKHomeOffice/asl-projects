import React from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { hideMessage } from '../actions/messages';

const mapStateToProps = state => {
  return { ...state.message };
}

class Create extends React.Component {

  onClick = () => {
    this.props.hideMessage();
  }

  alert() {
    if (!this.props.message) {
      return;
    }
    return <div className={`alert alert-${this.props.type}`} key="alert" onClick={this.onClick}>
      <div className="govuk-width-container">
        <p>{ this.props.message }</p>
      </div>
    </div>;
  }

  render() {
    return <CSSTransitionGroup
      transitionName="alert"
      transitionEnterTimeout={100}
      transitionLeaveTimeout={500}
      >
      { this.alert() }
    </CSSTransitionGroup>;
  }

}

export default connect(mapStateToProps, { hideMessage })(Create);
