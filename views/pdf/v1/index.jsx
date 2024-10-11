import React from 'react';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { getGrantedSubsections, getSubsections } from '../../../client/schema';
import StaticSection from '../../../client/components/static-section';
import StandardConditions from '../components/standard-conditions';

function injectLicenceHolder(subsections) {
  // inject the project licence holder into introductory details
  const field = [
    {
      label: 'Licence holder',
      name: 'licenceHolder',
      type: 'holder-name'
    }
  ];

  subsections['introduction'].fields.splice(1, 0, field);

  return subsections;
}

export default function PDF() {
  const project = useSelector(state => state.project);
  const isFullApplication = useSelector(state => state.application.isFullApplication);

  const sections = isFullApplication
    ? Object.values(injectLicenceHolder(getSubsections(1)))
      .filter(s => !s.show || s.show(project))
    : Object.values(getGrantedSubsections(1))
      .filter(s => !s.granted.show || s.granted.show(project))
      .sort((a, b) => a.granted.order - b.granted.order);
  return (
    <div className={classnames({ 'granted-licence': !isFullApplication })}>
      <div className="logo"></div>
      <h3 className="licence">{`Project licence ${isFullApplication ? 'application' : ''}`}</h3>
      <h1 className="project-title">{project.title}</h1>
      {
        sections.map((section, index) => (
          <section className={classnames('section', section.name)} key={index}>
            <StaticSection section={section} pdf isFullApplication />
          </section>
        ))
      }
      {
        !isFullApplication && <StandardConditions />
      }
    </div>
  );
}
