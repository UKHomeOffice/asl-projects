import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import some from 'lodash/some';

import Fieldset from '../../../components/fieldset';
import Controls from '../../../components/controls';
import Expandable from '../../../components/expandable';
import Repeater from '../../../components/repeater';

import { connectProject } from '../../../helpers';

import Review from './review';

import SpeciesSelector from '../../../components/species-selector';

const AddSpecies = ({ onContinueClicked, onExitClicked, onFieldChange, ...props }) => (
  <div className="panel light-grey-bg">
    <SpeciesSelector { ...props } onFieldChange={onFieldChange} />
    <Controls onContinue={onContinueClicked} onExit={onExitClicked} advanceLabel="Add species" exitLabel="Back" exitClassName="link" />
  </div>
)

class Animal extends Component {
  state = {
    expanded: false
  }

  toggleExpanded = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { prefix, fields, values, updateItem, index } = this.props;
    const { expanded } = this.state;
    return (
      <Expandable className="no-bg" onHeaderClick={this.toggleExpanded} expanded={expanded}>
        <h3 className="title">{values.name}</h3>
        <Fieldset
          fields={fields}
          values={values}
          prefix={`${prefix}speciesDetails-${index}-`}
          onFieldChange={(key, value) => updateItem({ [key]: value })}
        />
      </Expandable>
    )
  }
}

class Animals extends Component {
  state = {
    adding: false,
    active: false,
    review: false
  }

  toggleReview = () => {
    this.setState({ review: !this.state.review })
  }

  toggleAdding = e => {
    e.preventDefault();
    this.setState({ adding: !this.state.adding });
  }

  toggleActive = () => {
    this.setState({ active: !this.state.active });
  }

  saveAnimals = () => {
    const species = this.props.values.species;
    const speciesDetails = this.props.values.speciesDetails || [];
    species.forEach(item => {
      if (some(speciesDetails, sd => sd.name === item)) {
        return;
      }
      speciesDetails.push({ name: item })
    });

    this.props.onFieldChange('speciesDetails', speciesDetails);
    this.toggleActive()
  }

  getItems = () => {
    const { values: { speciesDetails = [], species = [] }, project } = this.props;
    return speciesDetails.filter(s => species.includes(s.name) && [...project.species, ...([project['species-other']] || [])].includes(s.name))
  }

  render() {
    const { fields, values, onFieldChange, updateItem, exit, advance, name, index } = this.props;
    const { adding, active, review } = this.state;
    const speciesField = fields.filter(f => f.section === 'intro').map(f => ({ ...f, options: [
      ...(this.props.project.species || []),
      ...(this.props.project['species-other'] || [])
    ] }));
    const items = this.getItems();
    if (review) {
      return <Review fields={fields.filter(f => f.section !== 'intro')} values={this.getItems()} advance={advance} onEdit={this.toggleReview} />
    }
    const prefix = `${name}-${index}-`;
    return (
      active
        ? (
          <Fragment>
            <Repeater
              items={items}
              initCollapsed={true}
              onSave={speciesDetails => updateItem({ speciesDetails })}
              addAnother={false}
            >
              <Animal
                {...this.props}
                prefix={prefix}
                fields={fields.filter(f => f.section !== 'intro')}
              />
            </Repeater>
            <Controls
              onContinue={this.toggleReview}
              onExit={this.toggleActive}
              exitClassName="link"
              exitLabel="Back"
            />
          </Fragment>
        )
        : (
          <Fragment>
            <Fieldset
              fields={speciesField}
              values={values}
              onFieldChange={onFieldChange}
              prefix={prefix}
            />
            {
              !adding && <a href="#" onClick={this.toggleAdding}>Add more animal types</a>
            }
            {
              adding && <AddSpecies
                onExitClicked={this.toggleAdding}
                onContinueClicked={this.toggleAdding}
                values={this.props.project}
                onFieldChange={this.props.save}
              />
            }
            <Controls onContinue={this.saveAnimals} onExit={exit} />
          </Fragment>
        )
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const project = state.projects.find(p => p.id === parseInt(ownProps.match.params.id, 10))
  const values = project.protocols[ownProps.index];
  return {
    project,
    values
  }
}

export default connect(mapStateToProps)(Animals);
