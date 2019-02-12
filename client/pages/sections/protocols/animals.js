import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { Button } from '@ukhomeoffice/react-components';

import some from 'lodash/some';
import intersection from 'lodash/intersection';
import flatten from 'lodash/flatten';
import values from 'lodash/values';

import SPECIES from '../../../constants/species';

import Fieldset from '../../../components/fieldset';
import Controls from '../../../components/controls';
import Expandable from '../../../components/expandable';
import Repeater from '../../../components/repeater';

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
    active: false
  }

  toggleAdding = e => {
    e.preventDefault();
    this.setState({ adding: !this.state.adding }, this.props.scrollToTop);
  }

  toggleActive = () => {
    this.setState({ active: !this.state.active }, this.props.scrollToTop);
  }

  saveAnimals = () => {
    const species = this.props.values.species;
    const speciesDetails = this.props.values.speciesDetails || [];
    species.forEach(i => {
      let item = flatten(values(SPECIES)).find(f => f.value === i);
      if (item) {
        item = item.label
      }
      else {
        item = i;
      }
      if (some(speciesDetails, sd => sd.name === item)) {
        return;
      }
      speciesDetails.push({ name: item })
    });

    this.props.onFieldChange('speciesDetails', speciesDetails);
    this.toggleActive()
  }

  getItems = () => {
    const { values: { speciesDetails = [] }, project } = this.props;
    let species = this.props.values.species || [];

    species = species.map(s => {
      const obj = flatten(values(SPECIES)).find(sp => sp.value === s);
      if (obj) {
        return obj.label;
      }
      return s;
    });


    const proj = flatten([
      ...(project.species || []).map(s => {
        if (s.indexOf('other') > -1) {
          return project[`species-${s}`];
        }
        const species = flatten(values(SPECIES)).find(sp => sp.value === s);
        if (species) {
          return species.label;
        }
      }),
      ...([project['species-other']] || [])
    ]);

    return speciesDetails.filter(s => species.includes(s.name) && proj.includes(s.name))
  }

  render() {
    const { fields, onFieldChange, updateItem, exit, advance, name, index } = this.props;
    const { adding, active } = this.state;
    const speciesField = fields.filter(f => f.section === 'intro').map(f => ({ ...f, options: flatten([
      ...(this.props.project.species || []).map(s => {
        if (s.indexOf('other') > -1) {
          return this.props.project[`species-${s}`]
        }
        return flatten(values(SPECIES)).find(species => species.value === s);
      }),
      ...(this.props.project['species-other'] || [])
    ]) }));
    const items = this.getItems();

    const prefix = `${name}-${index}-`;

    const allSpecies = flatten([
      ...(this.props.project.species || []).map(s => {
        if (s.indexOf('other') > -1) {
          return this.props.project[`species-${s}`];
        }
        return s;
      }),
      this.props.project['species-other']
    ]);

    const continueDisabled = !intersection(this.props.values.species, allSpecies).length

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
            <Button onClick={advance} className="button-secondary">Next section</Button>
          </Fragment>
        )
        : (
          <Fragment>
            <Fieldset
              fields={speciesField}
              values={this.props.values}
              onFieldChange={onFieldChange}
              prefix={prefix}
            />
            {
              !this.props.project.species || !this.props.project.species.length && <p><em>No species added to project</em></p>
            }
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
            <Controls
              continueDisabled={continueDisabled}
              onContinue={this.saveAnimals}
              onExit={exit}
            />
          </Fragment>
        )
    )
  }
}

const mapStateToProps = ({ project }, ownProps) => {
  const values = project.protocols[ownProps.index];
  return {
    project,
    values
  }
}

export default connect(mapStateToProps)(Animals);
