import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ApplicationSummary from '../components/application-summary';
import ExportLink from '../components/export-link';

const mapStateToProps = (state, props) => {
  const project = state.projects.find(project => project.id === parseInt(props.match.params.id, 10));
  if (!project) {
    return {};
  }
  return {
    ...project
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {};
};

class Index extends React.Component {

  render() {
    if (!this.props) {
      return null;
    }
    return <React.Fragment>
      <h1>{ this.props.title }</h1>
      <ApplicationSummary project={ this.props.id } />
      <p className="control-panel">
        <ExportLink project={this.props.id} />
        <Link to="/">Back to project list</Link>
      </p>
    </React.Fragment>
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
