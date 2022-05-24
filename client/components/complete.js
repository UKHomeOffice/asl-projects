import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { CheckboxGroup, Button } from '@ukhomeoffice/react-components';

class Complete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.complete || false
    }
    this.toggleChecked = this.toggleChecked.bind(this);
    this.emitChange = this.emitChange.bind(this);
  }

  toggleChecked() {
    this.setState({
      checked: !this.state.checked
    });
  }

  emitChange() {
    this.props.onChange(this.state.checked);
  }

  render() {
    if (this.props.legacy) {
      return <Button onClick={() => this.props.history.push('/')}>Continue</Button>;
    }
    const { children, label = 'Mark this protocol as complete', name = 'complete' } = this.props;
    return (
      <div className="panel">
        {
          children
        }
        <CheckboxGroup
          label=""
          name={name}
          className="smaller"
          options={[{
            value: true,
            label
          }]}
          value={this.state.checked}
          onChange={this.toggleChecked}
        />
        <Button disabled={this.props.checkChanged && this.props.complete === this.state.checked} onClick={this.emitChange}>Continue</Button>
      </div>
    )
  }
}

const mapStateToProps = ({ application: { schemaVersion } }) => ({ legacy: schemaVersion === 0 });

export default withRouter(connect(mapStateToProps)(Complete));
