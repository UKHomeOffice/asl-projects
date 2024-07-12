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

        if (itemRemoved && confirmRemove) {
            showModal('Are you sure you want to remove this item?', () => props.onFieldChange(newValue));
        } else if (!itemRemoved) {
            showModal('Are you sure you want to add this item?', () => props.onFieldChange(newValue));
        } else {
            props.onFieldChange(newValue);
        }
    };
}

function showModal(message, onConfirm) {
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
            <div>{message}</div>
            <button onClick={handleConfirm}>Confirm</button>
            <button onClick={handleClose}>Cancel</button>
        </Modal>,
        modalContainer
    );
}
