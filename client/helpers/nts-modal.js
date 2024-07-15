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
            Are you sure you want to deselect [${e.target.value}]?`
        const paragraphLine1 = `The [${e.target.value}] option will be removed from all protocols.`
        const paragraphLine2 = 'Also, any additional information you entered about that fate will be removed from your application.'

        if (itemRemoved && confirmRemove) {
            showModal(h3bold, paragraphLine1, paragraphLine2, () => props.onFieldChange(newValue));
        } else {
            props.onFieldChange(newValue);
        }
    };
}

function showModal(h3Bold, paragraphLine1, paragraphLine2, onConfirm) {
    const modalContainer = document.createElement('div');
    modalContainer.style.position = "fixed";
    modalContainer.style.top = "0";
    modalContainer.style.left = "0";
    modalContainer.style.width = "100%";
    modalContainer.style.height = "100%";
    modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
    modalContainer.style.zIndex = "999";
    modalContainer.style.display = "flex";
    modalContainer.style.alignItems = "center";
    modalContainer.style.justifyContent = "center";
    modalContainer.style.backdropFilter = "blur(5px)";

    const modalInner = document.createElement('div');
    modalInner.style.width = "90%";
    modalInner.style.maxWidth = "600px";
    modalInner.style.backgroundColor = "white";
    modalInner.style.padding = "30px";
    modalInner.style.overflow = "auto";
    modalInner.style.margin = "auto";
    modalInner.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";

    modalContainer.appendChild(modalInner);
    document.body.appendChild(modalContainer);

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
            <h3 className="govuk-heading-s">{h3Bold}</h3>
            <p className="govuk-body">{paragraphLine1}</p>
            <p className="govuk-body">{paragraphLine2}</p>
            <div className="govuk-button-group">
                <button type="submit" className="govuk-button" data-module="govuk-button" onClick={handleConfirm}>Yes, deselect</button>
                <button className="govuk-!-margin-left-3 govuk-button" style={{background: 'grey'}} onClick={handleClose}>Cancel</button>
            </div>
        </Modal>,
        modalInner // Render inside modalInner to apply inner styles
    );
}
