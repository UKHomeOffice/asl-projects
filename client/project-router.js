import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import { DocumentHeader, Link } from '@ukhomeoffice/asl-components';

import ScrollToTop from './components/scroll-to-top';
import SyncHandler from './components/sync-handler';
import Section from './pages/section';
import Project from './pages/project';
import ProtocolSummary from './pages/sections/protocols/summary-table';

import { formatDate } from './helpers';
import { DATE_FORMAT } from './constants';

const selector = ({
  project: version,
  application: {
    project,
    basename,
    drafting,
    isGranted,
    legacyGranted,
    establishment,
    schemaVersion,
    licenceHolder,
    isPreview,
    readonly
  }
}) => {
  return {
    project,
    version,
    basename,
    drafting,
    isGranted,
    legacyGranted,
    establishment,
    schemaVersion,
    licenceHolder,
    isPreview,
    readonly
  };
};

const ProjectRouter = () => {
  const [statusShowing, setStatusShowing] = useState(true);
  const {
    project,
    version,
    basename,
    drafting,
    establishment,
    schemaVersion,
    licenceHolder,
    isGranted,
    legacyGranted,
    isPreview,
    readonly
  } = useSelector(selector, shallowEqual);

  function toggleStatusShowing() {
    setStatusShowing(!statusShowing);
  }

  useEffect(() => {
    const licenceStatusBanner = document.querySelector('.licence-status-banner');
    if (!licenceStatusBanner) {
      return;
    }
    const showHide = licenceStatusBanner.querySelector('.toggle-switch a');
    const statusDetails = licenceStatusBanner.querySelector('.status-details');
    if (!statusShowing) {
      statusDetails.classList.add('hidden');
      licenceStatusBanner.classList.remove('open');
      showHide.innerText = 'Show more';
    } else {
      statusDetails.classList.remove('hidden');
      licenceStatusBanner.classList.add('open');
      showHide.innerText = 'Show less';
    }
  }, [statusShowing]);

  useEffect(() => {
    const licenceStatusBanner = document.querySelector('.licence-status-banner');
    if (!licenceStatusBanner) {
      return;
    }
    const showHide = licenceStatusBanner.querySelector('header');
    showHide.onclick = (e) => {
      e.preventDefault();
      toggleStatusShowing();
    };
    return () => {
      showHide.onclick = null;
    };
  });

  useEffect(() => {
    setStatusShowing(false);
  }, []);

  const versionModel = (project.versions || []).find(v => v.id === version.id) || {};

  const isApplication = project.status === 'inactive';
  const isAmendment = project.status === 'active' && versionModel.status !== 'granted';
  const isSuperseded = versionModel.status === 'granted' && project.granted.createdAt > versionModel.createdAt;

  const isRa = schemaVersion === 'RA';

  let title = isApplication
    ? 'Project licence application'
    : (isAmendment ? 'Project licence amendment' : 'Project licence');

  if (isRa) {
    title = 'Retrospective assessment';
  }

  if (isPreview) {
    title = 'Project licence preview';
  }

  const downloadType = isApplication
    ? 'application'
    : (isAmendment ? 'amendment' : 'application');

  const projectTitle = version.title || project.title || 'Untitled project';
  const guidanceText = !readonly && !isRa &&
    <>For help and example answers, <Link target="_blank"
      url="https://www.gov.uk"
      path="/guidance/animal-research-technical-advice#guidance-notes-for-project-licence-applications"
      label="read guidance notes for project licence applications (opens in new tab)"/>.
    </>;

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop>
        <DocumentHeader
          title={title}
          subtitle={projectTitle}
          detailsLabel="details and downloads"
          status={<SyncHandler />}
          backLink={<Link page="project.read" label="Go to project overview" establishmentId={establishment.id} projectId={project.id} />}
          footer={guidanceText}
        >
          <dl>
            <dt>Project title</dt>
            <dd>{version.title || project.title}</dd>

            <dt>Licence holder</dt>
            <dd><Link page="profile.read" establishmentId={project.establishment.id} profileId={licenceHolder.id} label={`${licenceHolder.firstName} ${licenceHolder.lastName}`} /></dd>

            <dt>Licence number</dt>
            <dd>{project.licenceNumber || '-'}</dd>

            <dt>Primary establishment</dt>
            <dd><Link page="establishment.dashboard" establishmentId={project.establishment.id} label={project.establishment.name} /></dd>

            { project.expiryDate &&
              <Fragment>
                <dt>Expiry date</dt>
                <dd>{formatDate(project.expiryDate, DATE_FORMAT.long)}</dd>
              </Fragment>
            }

            { project.raDate && !isRa &&
              <Fragment>
                <dt>Retrospective assessment due</dt>
                <dd>{formatDate(project.raDate, DATE_FORMAT.long)}</dd>
              </Fragment>
            }

            { project.amendedDate &&
              <Fragment>
                <dt>Last amended</dt>
                <dd>{formatDate(project.amendedDate, DATE_FORMAT.long)}</dd>
              </Fragment>
            }

            {
              <Fragment>
                <dt>Downloads</dt>
                <dd>
                  <ul>
                    {
                      isRa
                        ? <li>
                          <Link
                            page="projectVersion.ntsPdf"
                            label="Download non-technical summary and retrospective assessment as a PDF"
                            establishmentId={establishment.id}
                            projectId={project.id}
                            versionId={project.granted.id}
                            query={{ draftRa: !!project.draftRa }}
                          />
                        </li>
                        : <Fragment>
                          {
                            (isGranted || legacyGranted) &&
                              <li><Link page="projectVersion.pdf" label="Download licence (PDF)" establishmentId={establishment.id} projectId={project.id} versionId={version.id} /></li>
                          }
                          {
                            (isApplication || isAmendment || isSuperseded) &&
                                <Fragment>
                                  <li><Link page="projectVersion.docx" label={`Download ${downloadType} (DOCX)`} establishmentId={establishment.id} projectId={project.id} versionId={version.id} /></li>
                                  <li><Link page="projectVersion.pdf" query={{ application: true }} label={`Download ${downloadType} (PDF)`} establishmentId={establishment.id} projectId={project.id} versionId={version.id} /></li>
                                </Fragment>
                          }
                        </Fragment>
                    }
                  </ul>
                </dd>
              </Fragment>
            }
          </dl>
        </DocumentHeader>

        <Switch>
          <Route path="/protocol-summary" component={ProtocolSummary} />
          <Route path="/:section/:step?" render={props => <Section { ...props } drafting={drafting} />} />
          <Route path="/" component={Project} />
        </Switch>

      </ScrollToTop>
    </BrowserRouter>
  );
};

export default ProjectRouter;
