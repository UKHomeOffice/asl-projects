import React, { Component } from 'react';
import { connect } from 'react-redux';

import classnames from 'classnames';

import Expandable from '../../../components/expandable';
import Completable from '../../../components/completable';
import Complete from '../../../components/complete';
import Sections from './sections';

class ProtocolSections extends Component {
  state = {
    expanded: !this.props.values.complete
  }

  setCompleted = value => {
    this.props.updateItem({ complete: value });
    this.setState({ expanded: !value })
  }

  toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  toggleActive = e => {
    e.preventDefault();
    this.props.onToggleActive();
  }

  render() {
    const {
      name,
      values,
      sections,
      index,
      save,
      updateItem,
      exit
    } = this.props;

    const severityField = sections.details.fields.find(field => field.name === 'severity');
    const severityOption = severityField.options.find(option => option.value === values.severity);

    return (
      <section className={classnames('protocol', { complete: values.complete })}>
        <Expandable expanded={this.state.expanded} onHeaderClick={this.toggleExpanded}>
          <Completable status={values.complete ? 'complete' : 'incomplete'}>
            <h2 className="title"><span className="larger">{index + 1}. </span>{values.title}</h2>
            <dl className="inline">
              <dt>Severity category: </dt>
              <dd className="grey">{ severityOption ? severityOption.label : 'Not set' }</dd>
            </dl>
            <a href="#" onClick={this.toggleActive}>Edit title</a>
          </Completable>
          <div>
            <Sections
              name={name}
              index={index}
              sections={sections}
              values={values}
              updateItem={updateItem}
              exit={exit}
              onFieldChange={(key, value) => updateItem({ [key]: value })}
              save={save}
            />
            <Complete type="protocol" complete={values.complete} onChange={this.setCompleted} buttonClassName="button-secondary" />
          </div>
        </Expandable>
      </section>
    )
  }
}

export default ProtocolSections;
