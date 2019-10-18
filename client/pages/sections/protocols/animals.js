import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import v4 from 'uuid/v4';

import { Button } from '@ukhomeoffice/react-components';

import some from 'lodash/some';
import flatten from 'lodash/flatten';
import values from 'lodash/values';

import SPECIES from '../../../constants/species';

import Review from '../../../components/review';
import ReviewFields from '../../../components/review-fields';
import Fieldset from '../../../components/fieldset';
import Expandable from '../../../components/expandable';
import Repeater from '../../../components/repeater';

function getProjectSpecies(project) {
  return flatten([
    ...(project.species || []).map(s => {
      if (s.indexOf('other') > -1) {
        return project[`species-${s}`];
      }
      return s;
    }),
    ...(project['species-other'] || [])
  ]);
}

export function filterSpeciesByActive(protocol, project) {
  const { species = [], speciesDetails = [] } = protocol;
  const projectSpecies = getProjectSpecies(project);

  return speciesDetails.filter(s => {
    return (species.includes(s.value) || species.includes(s.name)) && (projectSpecies.includes(s.value) || projectSpecies.includes(s.name));
  });
}

function AddSpecies({ onContinueClicked, onFieldChange, ...props }) {
  return (
    <div className="panel light-grey-bg">
      <Fieldset
        fields={[
          {
            name: 'species',
            type: 'species-selector'
          }
        ]}
        onFieldChange={onFieldChange}
        {...props}
      />
      <p className="control-panel">
        <Button onClick={onContinueClicked}>Add species</Button>
      </p>
    </div>
  );
}

class Animal extends Component {
  state = {
    expanded: true
  }

  toggleExpanded = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { prefix, fields, values, updateItem, editable, deleted } = this.props;
    const { expanded } = this.state;
    return (
      <Expandable className="no-bg" onHeaderClick={this.toggleExpanded} expanded={expanded}>
        <h3 className="title">{values.name}</h3>
        {
          editable && !deleted
            ? (
              <Fieldset
                fields={fields}
                values={values}
                prefix={prefix}
                onFieldChange={(key, value) => updateItem({ [key]: value })}
              />
            )
            : (
              <ReviewFields
                fields={fields}
                values={values}
                prefix={prefix}
                readonly={deleted}
                editLink={`0#${prefix}`}
              />
            )
        }
      </Expandable>
    )
  }
}

class Animals extends Component {
  state = {
    adding: false
  }

  toggleAdding = e => {
    e.preventDefault();
    this.setState({ adding: !this.state.adding });
  }

  getItems = () => {
    const { project } = this.props;
    const speciesDetails = this.props.values.speciesDetails.filter(Boolean);
    let species = this.props.values.species || [];

    species.forEach(item => {
      const precodedSpecies = flatten(values(SPECIES)).find(f => f.value === item);
      let value;

      if (precodedSpecies) {
        value = precodedSpecies.value;
        item = precodedSpecies.label
      }

      if (some(speciesDetails, sd => sd.name === item)) {
        return;
      }
      speciesDetails.push({ name: item, id: v4(), value })
    });

    return filterSpeciesByActive({ speciesDetails, species }, project);
  }

  render() {

    const { prefix, editable, fields, onFieldChange, updateItem, values: { deleted } } = this.props;

    const { adding } = this.state;

    const deprecated = SPECIES.deprecated.map(d => d.value);
    const projectSpecies = (this.props.project.species || []).filter(s => !deprecated.includes(s));

    const otherSpecies = [
      ...(this.props.project['species-other'] || []),
      ...(this.props.project.species || []).filter(s => deprecated.includes(s)).map(s => (SPECIES.deprecated.find(d => d.value === s) || {}).label)
    ];

    const speciesField = fields.filter(f => f.section === 'intro').map(f => ({ ...f, options: flatten([
      ...projectSpecies.map(s => {
        if (s.indexOf('other') > -1) {
          return this.props.project[`species-${s}`]
        }
        return flatten(values(SPECIES)).find(species => species.value === s);
      }),
      ...otherSpecies
    ]) }));

    const items = this.getItems();

    if (!editable && !items.length) {
      return <Review
        label="Animals used in this protocol"
        value={null}
      />
    }

    const protocolSpecies = [
      ...(this.props.values.species || []).map(s => {
        if (deprecated.includes(s)) {
          return (SPECIES.deprecated.find(d => d.value === s) || {}).label;
        }
        return s;
      })
    ];

    return (
      <Fragment>
        {
          editable && !deleted && (
            <Fieldset
              fields={speciesField}
              values={{
                ...this.props.values,
                species: protocolSpecies
              }}
              onFieldChange={onFieldChange}
              prefix={prefix}
            />
          )
        }
        <Repeater
          items={items}
          type="speciesDetails"
          prefix={prefix}
          onSave={speciesDetails => updateItem({ speciesDetails })}
          addAnother={false}
          addOnInit={false}
        >
          <Animal
            {...this.props}
            deleted={deleted}
            fields={fields.filter(f => f.section !== 'intro')}
          />
        </Repeater>
        {
          editable && !adding && !deleted && <div className="add-more-animals"><a href="#" onClick={this.toggleAdding}>Add more animal types</a></div>
        }
        {
          editable && adding && !deleted && <AddSpecies
            onContinueClicked={this.toggleAdding}
            values={this.props.project}
            onFieldChange={this.props.save}
          />
        }
      </Fragment>
    )
  }
}

const mapStateToProps = ({ project }) => ({ project });

export default connect(mapStateToProps)(Animals);
