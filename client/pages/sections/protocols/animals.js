import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import some from 'lodash/some';
import flatten from 'lodash/flatten';
import values from 'lodash/values';
import pickBy from 'lodash/pickBy';

import { projectSpecies as SPECIES } from '@ukhomeoffice/asl-constants';

import Review from '../../../components/review';
import ReviewFields from '../../../components/review-fields';
import Fieldset from '../../../components/fieldset';
import Expandable from '../../../components/expandable';
import Repeater from '../../../components/repeater';

const allSpecies = flatten(Object.values(SPECIES));

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

function normaliseValues(speciesDetails) {
  return speciesDetails.map(details => {
    if (details.value) {
      return details;
    }
    // if there's a species with a label matching the name use that
    const match = allSpecies.find(sp => sp.label === details.name);
    if (match) {
      return { ...details, value: match.value };
    }
    return details;
  });
}

export function filterSpeciesByActive(protocol, project) {
  const { species = [], speciesDetails = [] } = protocol;
  const projectSpecies = getProjectSpecies(project);

  return normaliseValues(speciesDetails).filter(s => {
    return (species.includes(s.value) || species.includes(s.name)) && (projectSpecies.includes(s.value) || projectSpecies.includes(s.name));
  });
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
    );
  }
}

class Animals extends Component {
  state = {
    adding: false
  }

  getItems = () => {
    const { project } = this.props;
    const speciesDetails = (this.props.values.speciesDetails || []).filter(Boolean);
    let species = this.props.values.species || [];

    species.forEach(item => {
      const precodedSpecies = flatten(values(SPECIES)).find(f => f.value === item);
      let value;

      if (precodedSpecies) {
        value = precodedSpecies.value;
        item = precodedSpecies.label;
        const matchingValue = speciesDetails.find(sd => sd.value === value);
        // item is already in list - make sure it has the right label
        if (matchingValue) {
          matchingValue.name = item;
          return;
        }
      }

      if (some(speciesDetails, sd => sd.name === item)) {
        return;
      }
      speciesDetails.push({ name: item, id: uuid(), value });
    });

    return filterSpeciesByActive({ speciesDetails, species }, project);
  }

  render() {

    const { prefix, editable, fields, onFieldChange, updateItem, values: { deleted } } = this.props;

    const deprecated = SPECIES.deprecated.map(d => d.value);
    const projectSpecies = (this.props.project.species || []).filter(s => !deprecated.includes(s));

    const deprecatedSpecies = (this.props.project.species || [])
      .filter(s => deprecated.includes(s))
      .filter(s => s.indexOf('other') === -1)
      .map(s => (SPECIES.deprecated.find(d => d.value === s) || {}).label);

    const deprecatedOthers = flatten(
      values(
        pickBy(this.props.project, (value, key) => {
          return SPECIES.deprecated.find(d => `species-${d.value}` === key);
        })
      )
    );

    const otherSpecies = [
      ...(this.props.project['species-other'] || []),
      ...deprecatedSpecies,
      ...deprecatedOthers
    ];

    const speciesField = fields.filter(f => f.section === 'intro').map(f => ({ ...f,
      options: flatten([
        ...projectSpecies.map(s => {
          if (s.indexOf('other') > -1) {
            return this.props.project[`species-${s}`];
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
      />;
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
          onSave={speciesDetails => updateItem({ speciesDetails: normaliseValues(speciesDetails) })}
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
          editable && !deleted && <Link to="../introduction">Manage animal types</Link>
        }
      </Fragment>
    );
  }
}

const mapStateToProps = ({ project }) => ({ project });

export default connect(mapStateToProps)(Animals);
