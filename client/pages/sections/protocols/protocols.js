import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import pickBy from 'lodash/pickBy';
import _ from 'lodash';
import mapKeys from 'lodash/mapKeys';
import ProtocolSections from './protocol-sections';
import Fieldset from '../../../components/fieldset';
import Repeater from '../../../components/repeater';
import Controls from '../../../components/controls';
import { getNewComments } from '../../../helpers';
import { renderFieldsInProtocol } from '../../../helpers/render-fields-in-protocol';
import NTSFateOfAnimalFields from '../../../helpers/nts-field';

const Form = ({
  number,
  updateItem,
  exit,
  toggleActive,
  prefix = '',
  ...props
}) => (
  <div className={classnames('protocol', 'panel')}>
    <h2>{`Protocol ${number + 1}`}</h2>
    <Fieldset
      { ...props }
      fields={props.fields}
      prefix={prefix}
      onFieldChange={(key, value) => updateItem({ [key]: value })}
    />
    <Controls onContinue={toggleActive} onExit={exit} exitDisabled={true} />
  </div>
);

class Protocol extends PureComponent {

  state = {
    active: !this.props.values.title,
    complete: false
  }

  toggleActive = () => {
    this.setState({ active: !this.state.active });
  }

  getProtocolState = () => {
    if (!this.props.editable || !this.props.location.hash) {
      return null;
    }
    const parts = this.props.location.hash.split('.');

    const protocolState = {
      activeProtocol: parts[1],
      fieldName: parts[parts.length - 1]
    };
    if (parts.length === 5) {
      protocolState.section = parts[2];
      protocolState.sectionItem = parts[3];
    }

    return protocolState;
  }

  isActive = protocolState => {
    if (!protocolState) {
      return false;
    }
    return protocolState.activeProtocol === this.props.values.id;
  }

  render() {
    const { editable } = this.props;

    const newComments = mapKeys(
      pickBy(this.props.newComments, (comments, key) => {
        const re = new RegExp(`^protocols.${this.props.values.id}`);
        return key.match(re);
      }),
      (value, key) => key.replace(`protocols.${this.props.values.id}.`, '')
    );

    const protocolState = this.getProtocolState();
    const isActive = this.isActive(protocolState);

    if (editable) {
      const conditionalFateOfAnimalFields = renderFieldsInProtocol(this.props.project['fate-of-animals']);
      // Ensure options array exists and is initialized properly
      _.set(this.props.sections, 'fate.fields[0].options', _.get(this.props.sections, 'fate.fields[0].options', []));
      // Update the options array with unique fields
      this.props.sections.fate.fields[0].options = conditionalFateOfAnimalFields;
    } else {
      // Ensure options array exists and is initialized properly
      _.set(this.props.sections, 'fate.fields[0].options', _.get(this.props.sections, 'fate.fields[0].options', []));
      this.props.sections.fate.fields[0].options = NTSFateOfAnimalFields();
    }

    return editable && this.state.active
      ? <Form
        {...this.props}
        toggleActive={this.toggleActive}
      />
      : <ProtocolSections
        {...this.props}
        newComments={newComments}
        protocolState={isActive && protocolState}
        onToggleActive={this.toggleActive}
      />;
  }
}

class Protocols extends PureComponent {
  save = protocols => {
    if (this.props.readonly) {
      return;
    }

    this.props.save({ protocols });
  }

  edit = e => {
    e.preventDefault();
    this.props.retreat();
  }

  render() {
    const { protocols, editable, previousProtocols, isLegacy } = this.props;

    const items = (protocols || []).filter(p => {
      if (editable) {
        return true;
      }
      if (p.deleted === true) {
        return !!previousProtocols.showDeleted.includes(p.id);
      }
      return true;
    });

    const itemProps = {
      speciesDetails: [],
      steps: isLegacy ? undefined : []
    };

    return (
      <Repeater
        type="protocols"
        singular="protocol"
        items={items}
        onSave={this.save}
        addAnother={editable}
        addButtonBefore={protocols && protocols.length > 0 && protocols[0].title}
        addButtonAfter={true}
        softDelete={true}
        itemProps={itemProps}
        onAfterAdd={() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }}
        onBeforeDuplicate={(items, id) => {
          return items.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                title: `${item.title} (Copy)`,
                complete: false
              };
            }
            return item;
          });
        }}
        onAfterDuplicate={(item, id) => {
          const index = items.findIndex(i => i.id === id);
          const protocol = document.querySelectorAll('.protocols-section .protocol')[index];
          window.scrollTo({
            top: protocol.offsetTop,
            left: 0
          });
        }}
      >
        <Protocol {...this.props} />
      </Repeater>
    );
  }
}

const mapStateToProps = ({
  comments,
  project,
  application: {
    user,
    readonly,
    previousProtocols,
    schemaVersion
  }
}) => ({
  protocols: project.protocols,
  newComments: getNewComments(comments, user, project),
  readonly,
  previousProtocols,
  isLegacy: schemaVersion === 0
});

export default connect(mapStateToProps)(Protocols);
