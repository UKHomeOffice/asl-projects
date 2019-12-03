import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { deleteProject } from '../actions/projects';
import { throwError } from '../actions/messages';

import DownloadLink from '../components/download-link';

const mapStateToProps = ({ projects, settings: { establishments } }) => ({ projects, establishments });

const mapDispatchToProps = dispatch => {
  return {
    error: message => dispatch(throwError(message)),
    remove: id => dispatch(deleteProject(id))
  };
}

class Index extends React.Component {

  render() {
    if (!this.props.establishments || !this.props.establishments.length) {
      this.props.history.push('/settings');
    }
    return <Fragment>
      <h1>Your projects</h1>
      <Link to="/settings" className="float-right">Settings</Link>
      <table className="govuk-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Updated</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {
          this.props.projects.map(project => {
            return <tr key={ project.id }>
              <td><Link to={`/project/${project.id}`}>{ project.title || 'Untitled project' }</Link></td>
              <td>{ moment(project.updated).format('D MMMM YYYY, HH:mm') }</td>
              <td>
                <DownloadLink project={project.id} label="Word (.docx)" renderer="docx" />
              </td>
              <td>
                <DownloadLink project={project.id} label="Backup (.ppl)" renderer="ppl" />
              </td>
              <td className="controls">
                <button onClick={() => this.props.remove(project.id)} className="govuk-button">Remove</button>
              </td>
            </tr>
          })
        }
        </tbody>
      </table>
    </Fragment>;
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
