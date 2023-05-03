import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Markdown } from '@ukhomeoffice/asl-components';
import Review from '../../../components/review';
import RetrospectiveAssessment from '../../../components/retrospective-assessment';
import { formatDate, isTrainingLicence } from '../../../helpers';
import LEGAL from '../../../constants/legal';

import permissiblePurpose from '../../../schema/v1/permissible-purpose';

import { DATE_FORMAT } from '../../../constants';

const GrantedAuthoritySection = () => (
  <div className="granted-section">
    <h2>Granted authority</h2>
    <Markdown className="legal">{LEGAL.grantedAuthority}</Markdown>
  </div>
);

const PermissiblePurpose = ({ values }) => {
  return isTrainingLicence(values)
    ? <div className="review">
      <h3>Which permissible purposes apply to this project?</h3>
      <ul>
        <li>(f) Higher education and training</li>
      </ul>
    </div>
    : <Review
      {...permissiblePurpose}
      className=""
      value={values['permissible-purpose']}
      noComments
    />;
};

export default function ProjectSummary({ fields = [], pdf }) {
  const { project, establishment, licenceHolder, isPreview } = useSelector(state => state.application);
  const values = useSelector(state => state.project);

  function grantedField(val) {
    return isPreview ? <em>Licence not yet granted</em> : val;
  }

  return (
    <Fragment>
      {
        !pdf && (
          <Fragment>
            <div className="granted-section">
              <RetrospectiveAssessment />
            </div>
            <div className="granted-section">
              <h2>Project licence number</h2>
              <p>{grantedField(project.licenceNumber)}</p>
            </div>
          </Fragment>
        )
      }
      <div className="granted-section">
        <h2>Project licence holder</h2>
        <p className="licence-holder">{`${licenceHolder.firstName} ${licenceHolder.lastName}`}</p>
        <Markdown className="legal">{LEGAL.licenceHolder}</Markdown>
      </div>
      {
        pdf && (
          <Fragment>
            <GrantedAuthoritySection />
            <div className="granted-section">
              <RetrospectiveAssessment />
            </div>
            <div className="granted-section">
              <h2>Permissible purposes</h2>
              <PermissiblePurpose values={values} />
            </div>
            <div className="granted-section">
              <Review
                name="keywords"
                label="Key words that describe this project"
                type="keywords"
                value={values.keywords}
                noComments
              />
            </div>
          </Fragment>
        )
      }
      {
        !pdf && (
          <Fragment>
            <div className="granted-section">
              <PermissiblePurpose values={values} />
            </div>
            <div className="granted-section">
              <Review
                name="keywords"
                label="Key words that describe this project"
                type="keywords"
                value={values.keywords}
                noComments
              />
            </div>
            <div className="granted-section">
              <Review
                {...fields.find(f => f.name === 'duration')}
                className=""
                value={values.duration}
                noComments
              />
            </div>
            <div className="granted-section">
              <h3>Date granted</h3>
              <p>{grantedField(formatDate(project.issueDate, DATE_FORMAT.long))}</p>
            </div>
            <div className="granted-section">
              <h3>Expiry date</h3>
              <p>{grantedField(formatDate(project.expiryDate, DATE_FORMAT.long))}</p>
            </div>
          </Fragment>
        )
      }
      <div className="granted-section">
        <h2>Project location</h2>
        <p className="legal">You are authorised to undertake this programme of scientific procedures at the following places:</p>
        <div className="granted-section">
          <h3>Primary establishment</h3>
          <p>{ establishment.name }</p>
          <dl className="inline">
            <dt>Establishment licence number: </dt>
            <dd>{ establishment.licenceNumber }</dd>
            <dt>Establishment licence holder: </dt>
            <dd>{ establishment.licenceHolder ? `${establishment.licenceHolder.firstName} ${establishment.licenceHolder.lastName}` : '-' }</dd>
            <dt>Address: </dt>
            <dd>{ establishment.address }</dd>
          </dl>
        </div>
        {
          values['other-establishments'] && values.establishments && !!values.establishments.length && (
            <div className="granted-section">
              <h3>Additional establishments</h3>
              <ul>
                {
                  values.establishments.map((e, i) => <li key={i}><strong>{e.name || e['establishment-name']}</strong></li>)
                }
              </ul>
            </div>
          )
        }
        {
          values.poles && values.polesList && !!values.polesList.length && (
            <div className="granted-section">
              <h3>Places other than a licensed establishment (POLEs):</h3>
              <ul>
                {
                  values.polesList.map((p, i) => (
                    <li key={i}>
                      <strong>{p.title}</strong><br />
                      <Review
                        type="texteditor"
                        value={p['pole-info']}
                      />
                    </li>
                  ))
                }
              </ul>
            </div>
          )
        }
      </div>
      {
        !pdf && <GrantedAuthoritySection />
      }
    </Fragment>
  );
}
