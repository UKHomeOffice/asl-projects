import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import classnames from 'classnames';

import Expandable from '../../../components/expandable';
import Completable from '../../../components/completable';
import Complete from '../../../components/complete';
import NewComments from '../../../components/new-comments';
import Sections from './sections';
import ChangedBadge from '../../../components/changed-badge';
import NewProtocolBadge from '../../../components/new-protocol-badge';
import ReorderedBadge from '../../../components/reordered-badge';
import { filterSpeciesByActive } from './animals';

import { keepAlive } from '../../../actions/session';
import { reusableStepFieldKeys } from '../../../helpers/steps';

class ProtocolSections extends PureComponent {
  state = {
    expanded: this.props.editable && !this.props.values.deleted && (this.props.protocolState || !this.props.values.complete)
  }

  delete = e => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to remove this protocol?')) {
      this.props.removeItem()
        .then(() => this.setState({ expanded: false }));
    }
  }

  setCompleted = value => {
    this.props.updateItem({ complete: value });
    this.setState({ expanded: !value });
  }

  toggleExpanded = () => {
    this.props.keepAlive();
    this.setState({
      expanded: !this.state.expanded
    });
  }

  toggleActive = e => {
    e.preventDefault();
    this.props.onToggleActive();
  }

  moveUp = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.moveUp();
  }

  moveDown = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.moveDown();
  }

  render() {
    const {
      values,
      number,
      index,
      length,
      sections,
      updateItem,
      editable,
      newComments,
      readonly,
      schemaVersion,
      project
    } = this.props;

    const isLegacy = schemaVersion === 0;

    const severityField = sections.details.fields.find(field => field.name === 'severity');
    const severityOption = ((severityField.options || []).find(option => option.value === values.severity) || {}).label;

    const numberOfNewComments = Object.values(newComments)
      .reduce((total, comments) => total + (comments || []).length, 0);

    const speciesDetails = filterSpeciesByActive(values, project);

    const noAnswer = <em>No answer provided</em>;

    const title = values.title || 'Untitled protocol';

    return (
      <section className={classnames('protocol', { complete: values.complete || readonly, readonly, deleted: values.deleted })}>
        {
          values.deleted && <span className="badge deleted">removed</span>
        }
        <NewComments comments={numberOfNewComments} />
        {
          !values.deleted && (
            <Fragment>
              <NewProtocolBadge id={values.id} />
              <ReorderedBadge id={values.id} />
              <ChangedBadge fields={[`protocols.${values.id}`, ...reusableStepFieldKeys(values)]} protocolId={values.id} />
            </Fragment>
          )
        }
        <Expandable expanded={this.state.expanded} onHeaderClick={this.toggleExpanded}>
          <Completable status={values.deleted ? 'deleted' : values.complete ? 'complete' : 'incomplete'}>
            <h2 className="title inline-block">{values.deleted ? title : `${number + 1}: ${title}`}</h2>
            {
              editable && <a href="#" className={classnames('inline-block', { restore: values.deleted })} onClick={values.deleted ? this.props.restoreItem : this.toggleActive}>{values.deleted ? 'Restore' : 'Edit title'}</a>
            }
            {
              !isLegacy && (
                <dl className="inline">
                  <dt>Severity category: </dt>
                  <dd className="grey">
                    {
                      severityOption
                        ? <strong>{severityOption}</strong>
                        : <em>No answer provided</em>
                    }
                  </dd>
                </dl>
              )
            }
            {
              values.gaas && <p>This protocol uses genetically altered (GA) animals</p>
            }
            {
              speciesDetails && !!speciesDetails.length && (
                <table className="govuk-table">
                  <thead>
                    <tr>
                      <th>Animal types</th>
                      <th>Max. no. of animals</th>
                      <th>Max. no. of uses per animal</th>
                      <th>Life stages</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      speciesDetails.map(species => (
                        <tr key={species.id}>
                          <td>{species.name}</td>
                          <td>{species['maximum-animals'] || noAnswer}</td>
                          <td>{species['maximum-times-used'] || noAnswer}</td>
                          <td>{(species['life-stages'] || []).join(', ') || noAnswer}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              )
            }
          </Completable>
          <div>
            <Sections
              {...this.props}
              onFieldChange={(key, value) => updateItem({ [key]: value })}
            />
            {
              editable && !values.deleted && (
                <Fragment>
                  <Complete
                    type="protocol"
                    complete={values.complete}
                    onChange={this.setCompleted}
                    buttonClassName="button-secondary"
                  />
                  <p>
                    <span>Reorder: <a href="#" disabled={index === 0} onClick={this.moveUp}>Up</a> or <a href="#" disabled={index + 1 >= length} onClick={this.moveDown}>Down</a></span>
                    <span> │ </span>
                    <a href="#" onClick={this.props.duplicateItem}>Duplicate protocol</a>
                    <span> │ </span>
                    <a href="#" onClick={this.delete}>Remove protocol</a>
                  </p>
                </Fragment>
              )
            }
          </div>
        </Expandable>
      </section>
    );
  }
}

const mapStateToProps = ({ application: { schemaVersion }, project }) => ({ schemaVersion, project });

export default withRouter(connect(mapStateToProps, { keepAlive })(ProtocolSections));
