import React from 'react';
import ReactDOM from 'react-dom';
import Modal from "../components/modal";
import {useSelector} from "react-redux";

export default function NtsModal(props) {
    return function(e) {
        const values = [ ...(props.value || []) ];
        const itemRemoved = values.includes(e.target.value);

        const newValue = itemRemoved
            ? values.filter(v => v !== e.target.value)
            : [ ...values, e.target.value ];

        const confirmRemove = props.confirmRemove && itemRemoved
            ? props.confirmRemove(props.project, e.target.value)
            : true;

        const selectedOption = e.target.value.toString().charAt(0).toUpperCase() + e.target.value.toString().slice(1)
        const h3bold = `
            Are you sure you want to deselect this fate?`
        const paragraphLine1 = `The ${selectedOption} at the establishment for non-regulated purposes or possible reuse’ option will be removed from all protocols.`
        const paragraphLine2 = 'Also, any additional information you entered about this fate will be removed from your application.'

        if (itemRemoved && confirmRemove) {
            showModal(h3bold, paragraphLine1, paragraphLine2, () => props.onFieldChange(newValue));
        } else {
            props.onFieldChange(newValue);
        }
    };
}

function ntsModal(h3Bold, paragraphLine1, paragraphLine2, onConfirm) {
    const modalContainer = document.createElement('div');
    const modalInner = document.createElement('div');

    modalInner.classList.add("nts-modal-inner");
    modalContainer.classList.add("nts-modal-container");

    modalContainer.appendChild(modalInner);
    document.body.appendChild(modalContainer);


    const handleClose = () => {
        ReactDOM.unmountComponentAtNode(modalContainer);
        document.body.removeChild(modalContainer);
        document.getElementsByTagName('html')[0].classList.remove('modal-open');
    };

    const handleConfirm = () => {
        onConfirm();
        handleClose();
    };

    ReactDOM.render(
        <Modal onClose={handleClose}>
            <h3 className="govuk-heading-s">{h3Bold}</h3>
            <p className="govuk-body">{paragraphLine1}</p>
            <p className="govuk-body">{paragraphLine2}</p>
            <div className="govuk-button-group">
                <button type="submit" className="govuk-button" data-module="govuk-button" onClick={handleConfirm}>Yes, deselect</button>
                <button className="govuk-!-margin-left-3 govuk-button" style={{background: 'grey'}} onClick={handleClose}>Cancel</button>
            </div>
        </Modal>,
        modalInner
    );
}
