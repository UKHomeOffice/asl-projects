import React, { useState, useEffect, Fragment } from 'react';
import { RadioGroup, Warning } from '@ukhomeoffice/react-components';
import { Details, Inset, Markdown, Link } from '@ukhomeoffice/asl-components';
import { useSelector, shallowEqual } from 'react-redux';

const revealContent = `To change the primary establishment you must:

* have the agreement of both establishment licence holders
* take the application through the AWERB review process at the new establishment (and any additional establishments)
* review any related sections of the application that appear as ‘incomplete'`;

export default function EstablishmentSelector({ value, onFieldChange, review, diff, ...props }) {
  const {
    establishments,
    canTransfer,
    canTransferDraft,
    establishment,
    transferInProgress,
    readonly,
    project: {
      establishment: projectEstablishment,
      ...project
    },
    isGranted,
    legacyGranted
  } = useSelector(state => state.application, shallowEqual);

  if (isGranted || legacyGranted) {
    return <p>{projectEstablishment.name}</p>;
  }

  const [localValue, setLocalValue] = useState(value);

  const canUpdateEstablishment = canTransfer && establishments.length > 1 && !transferInProgress;
  const draft = project.status === 'inactive';

  const options = (establishments || []).map(e => ({
    label: e.name,
    value: e.id,
    reveal: e.id !== establishment.id && !draft && (
      <Inset>
        <Markdown>
          {revealContent}
        </Markdown>
        <Warning>Once submitted, you won’t be able withdraw this change without discarding the entire amendment.</Warning>
      </Inset>
    )
  }));

  useEffect(() => {
    if (onFieldChange && localValue !== value) {
      onFieldChange({
        'transfer-of-animals-complete': false,
        'protocols-complete': false,
        'experience-complete': false,
        transferToEstablishment: localValue,
        transferToEstablishmentName: (establishments.find(e => e.id === localValue) || {}).name
      });
    }
  }, [localValue]);

  const displayEstablishment = localValue
    ? establishments.find(e => e.id === localValue) || {}
    : projectEstablishment;

  const establishmentName = displayEstablishment.name || 'Another establishment';

  if (review) {
    return <p>{project.transferToEstablishmentName || establishmentName}</p>;
  }

  if (draft && canTransferDraft) {
    return (
      <div className="govuk-form-group">
        <fieldset className="govuk-fieldset inline smaller">
          <legend className="govuk-fieldset__legend">
            <h2 className="govuk-fieldset__heading govuk-heading-l">Primary establishment</h2>
          </legend>
          <p>{establishmentName}</p>
          <p><Link page="project.transferDraft" label="Change" establishmentId={establishment.id} projectId={project.id} /></p>
        </fieldset>
      </div>
    );
  }

  const hint = <Details summary="Help if your establishment's not listed" className="margin-top">
    <Inset>
      <p>You need to be invited to an establishment before you can make them your primary establishment. Ask the Home Office Liaison Contact (HOLC) at your chosen establishment to send you an invitation.</p>
    </Inset>
  </Details>;

  return (
    <div className="establishment-selector">
      {
        canUpdateEstablishment
          ? (
            <RadioGroup
              {...props}
              type="radio"
              options={options}
              value={localValue || establishment.id}
              onChange={e => setLocalValue(parseInt(e.target.value, 10))}
              hint={hint}
            />
          )
          : (
            <Fragment>
              <h3>{ props.label }</h3>
              <p>{establishmentName}</p>

              {
                readonly
                  ? (
                    <Fragment>
                      {
                        !diff && <Inset><p>The project licence holder has requested an amendment to transfer this licence to another establishment</p></Inset>
                      }
                    </Fragment>
                  )
                  : (
                    <Fragment>
                      {
                        canTransfer && transferInProgress && <Inset><p>To change the primary establishment again, you’ll need to discard this amendment and start a new one.</p></Inset>
                      }
                      {
                        !canTransfer && <Inset><p>Only the project’s licence holder can change the primary establishment.</p></Inset>
                      }
                    </Fragment>
                  )
              }
            </Fragment>
          )
      }
    </div>
  );
}
