import React, { useState } from 'react';
import { CheckboxGroup } from '@ukhomeoffice/react-components';
import {useDispatch, useSelector} from 'react-redux';
import Modal from './modal';
import resetFieldsBasedOnCheckbox from '../helpers/reset-fields-based-on-checkbox';
import {updateProject} from '../actions/projects';
import hasExistingDataForCheckbox from '../helpers/has-existing-data-for-checkbox';

const NtsCheckBoxWithModal = (props) => {
  const { className, label, hint, name, options, value, error, inline, onFieldChange } = props;
  const [showModal, setShowModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null); // State to store selected value
  const project = useSelector(state => state.project);
  const dispatch = useDispatch();

  // Function to handle onChange event
  const handleCheckboxChange = (e) => {
    const checkboxValue = e.target.value;
    const values = [...(value || [])];
    const itemRemoved = values.includes(checkboxValue);

    const {hasData} = hasExistingDataForCheckbox(project, checkboxValue);

    if (itemRemoved) {
      if (hasData) {
        // If there's existing data, show the modal
        setShowModal(true);
        setSelectedValue(checkboxValue); // Store selected value to use in modal
      } else {
        // If no existing data, simply remove the checkbox
        const newValue = values.filter((v) => v !== checkboxValue);
        onFieldChange(newValue);
      }
    } else {
      // Add new checkbox value
      const newValue = [...values, checkboxValue];
      onFieldChange(newValue);
    }
  };

  // Function to handle modal confirmation
  const handleConfirmModal = () => {
    const values = [...value];
    const newValue = values.filter((v) => v !== selectedValue);
    onFieldChange(newValue);
    const updatedProject = resetFieldsBasedOnCheckbox(project, selectedValue);
    dispatch(updateProject(updatedProject));
    setShowModal(false);
  };

  // Function to handle modal cancellation
  const handleCancelModal = () => {
    setShowModal(false);
  };
  const customTextMap = {
    'set-free': 'Set free',
    'kept-alive': 'Kept alive',
    'used-in-other-projects': 'Used in other projects'
  };

  // Function to prepare modal content
  const prepareModalContent = () => {
    // Get the formatted selected value or capitalize it if no custom text is found
    const selectedOption = selectedValue
      ? (customTextMap[selectedValue.toString().toLowerCase()] ||
        selectedValue.toString().charAt(0).toUpperCase() + selectedValue.toString().slice(1)) : '';
    const dynamicLine1 = selectedValue === 'kept-alive'
      ? 'The Kept alive at the establishment for non-regulated purposes or possible reuse'
      : `The '${selectedOption}' at the establishment for non-regulated purposes or possible reuse option will be removed from all protocols.`;

    return {
      h3Bold: `Are you sure you want to deselect this fate?`,
      paragraphLine1: dynamicLine1,
      paragraphLine2: 'Also, any additional information you entered about this fate will be removed from your application.'
    };
  };

  return (
    <>
      <CheckboxGroup
        className={className}
        label={label}
        hint={hint}
        name={name}
        options={options}
        value={value}
        error={error}
        inline={inline}
        onChange={handleCheckboxChange}
      />
      {showModal && selectedValue && ( // Show modal only if showModal is true and selectedValue is truthy
        <div className="nts-modal-container">
          <Modal onClose={handleCancelModal} className={'nts-modal-inner'}>
            <h3 className="govuk-heading-s">{prepareModalContent().h3Bold}</h3>
            <p className="govuk-body">{prepareModalContent().paragraphLine1}</p>
            <p className="govuk-body">{prepareModalContent().paragraphLine2}</p>
            <div className="govuk-button-group">
              <button type="submit" className="govuk-button" data-module="govuk-button" onClick={handleConfirmModal}>Yes, deselect</button>
              <a className="govuk-!-margin-left-3" onClick={handleCancelModal}>Cancel</a>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};

export default NtsCheckBoxWithModal;
