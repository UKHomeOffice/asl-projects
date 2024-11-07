import React, { Fragment, useState, useEffect } from 'react';
import { TextArea, Button } from '@ukhomeoffice/react-components';
import Reminders from './reminders';

function Editable({ edited,
  updating,
  showRevert,
  conditionKey,
  reminders,
  content,
  hint,
  onChange = () => {},
  allowEmpty,
  onSave = () => {},
  onCancel = () => {},
  onRevert = () => {} }) {

  const [ state, setState ] = useState({content, reminders});
  const [ changed, setChanged ] = useState(false);

  useEffect(() => {
    onChange(state);
  }, [state]);

  const onContentChange = e => {
    setChanged(true);
    const content = e.target.value;
    setState({ ...state, content });
  };

  const onRemindersChange = reminders => {
    setState({ ...state, reminders });
  };

  const save = e => {
    e.preventDefault();
    if ((!!state.content && state.content !== '') || allowEmpty) {
      Promise.resolve()
        .then(() => onSave(state))
        .then(() => setChanged(false));
    } else {
      window.alert('Condition/authorisation cannot be empty');
    }
  };

  const cancel = e => {
    e.preventDefault();
    if (changed) {
      if (window.confirm('Are you sure')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const revert = e => {
    e.preventDefault();
    if (window.confirm('Are you sure?')) {
      onRevert();
    }
  };

  return (
    <Fragment>
      {hint && <span className="govuk-hint">{hint}</span>}
      <TextArea
        name="content"
        label=""
        value={state.content}
        onChange={onContentChange}
        autoExpand={true}
        // do not add autofocus to the custom condition as it is loaded before you enable it
        autoFocus={state.content !== ''}
      />

      {
        conditionKey &&
        <Reminders values={reminders} conditionKey={conditionKey} onChange={onRemindersChange} />
      }

      <p className="control-panel">
        <Button disabled={updating} onClick={save} className="button-secondary">Save</Button>
        <Button disabled={updating} onClick={cancel} className="link">Cancel</Button>
        {
          edited && showRevert && <Button disabled={updating} onClick={revert} className="link">Revert to default</Button>
        }
      </p>
    </Fragment>
  );
}

export default Editable;
