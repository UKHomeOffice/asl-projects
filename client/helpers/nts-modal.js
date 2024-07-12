import React from 'react';
import ReactDOM from 'react-dom';
import Modal from "../components/modal";

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

        const h3bold = `
            Are you sure you want to deselect ${e.target.value}?`
        const h3 = `The ${e.target.value} option will be removed from all protocols.
            Also, any additional information you entered about that fate will be removed from your application.`

        if (itemRemoved && confirmRemove) {
            showModal(h3bold, h3, () => props.onFieldChange(newValue));
        } else {
            props.onFieldChange(newValue);
        }
    };
}

function showModal(h3Bold, h3, onConfirm) {
    const modalContainer = document.createElement('div');
    document.body.appendChild(modalContainer);

    // Append modal content to the .nts container
    const ntsContainer = document.querySelector('.nts');
    ntsContainer.appendChild(modalContainer);

    const handleClose = () => {
        ReactDOM.unmountComponentAtNode(modalContainer);
        document.body.removeChild(modalContainer);
    };

    const handleConfirm = () => {
        onConfirm();
        handleClose();
    };

    ReactDOM.render(
        <Modal onClose={handleClose}>
            <h3>{h3Bold}</h3>
            <h3>{h3}</h3>
            <div>
                <button className="confirm" onClick={handleConfirm}>Yes, deselect</button>
                <button className="cancel" onClick={handleClose}>Cancel</button>
            </div>
        </Modal>,
        modalContainer
    );
}
