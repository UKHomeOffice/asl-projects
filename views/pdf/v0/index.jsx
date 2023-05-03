import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Markdown } from '@ukhomeoffice/asl-components';
import { getSubsections } from '../../../client/schema';
import StaticSection from '../../../client/components/static-section';
import RA from '../../../client/components/retrospective-assessment';
import StandardConditions from '../components/standard-conditions';
import LEGAL from '../../../client/constants/legal';

const Legacy = ({ project, licenceHolder }) => {
  const sections = getSubsections(0);

  return (
    <div className="legacy-pdf">
      <div className="logo"></div>
      <h3 className="licence">Project licence</h3>
      <h1 className="project-title">{project.title}</h1>
      <div className="granted-section">
        <h2>Project licence holder</h2>
        <p className="licence-holder">{`${licenceHolder.firstName} ${licenceHolder.lastName}`}</p>
        <Markdown className="legal">{LEGAL.licenceHolder}</Markdown>
      </div>
      <div className="granted-section">
        <h2>Granted authority</h2>
        <Markdown className="legal">{LEGAL.grantedAuthority}</Markdown>
      </div>
      <div className="granted-section">
        <h2>Retrospective assessment</h2>
        <RA showTitle={false} />
      </div>
      {
        Object.keys(sections).map((key, index) => {
          const section = sections[key];
          return (
            <section className={classnames('section', key)} key={index}>
              <StaticSection section={section} pdf />
            </section>
          )
        })
      }
      <StandardConditions />
    </div>
  )
}

export default connect(({
  project: values,
  application: { project, establishment, licenceHolder }
}) => ({
  project,
  values,
  establishment,
  licenceHolder
}))(Legacy);
