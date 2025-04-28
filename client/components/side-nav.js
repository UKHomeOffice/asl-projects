import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import ChangedBadge from './changed-badge';
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import reduce from 'lodash/reduce';
import SectionLink from './sections-link';
import ExpandingPanel from './expanding-panel';
import schemaMap, { getGrantedSubsections } from '../schema';
import { flattenReveals, getFields } from '../helpers';
import { hasSectionChanged } from '../helpers/section-change-detection';

const sectionVisible = (section, values) => {
  return !section.show || section.show(values);
};

function getFieldsForSection(section, project) {
  if (section.subsections) {
    return reduce(section.subsections, (arr, subsection) => {
      return [
        ...arr,
        ...getFieldsForSection(subsection, project)
      ];
    }, []);
  }
  const fields = flattenReveals(getFields(section), project).map(field => field.name);
  if (section.repeats) {
    fields.push(section.repeats);
  }
  if (section.name === 'protocols') {
    fields.push('reusableSteps');
    return fields.filter(f => f !== 'title');
  }
  return fields;
}

export default function SideNav(props) {
  const { schemaVersion, project, isGranted, activeSection } = props;
  const { project: reduxProject, ...application } = useSelector(state => state.application);
  const {
    initialValues = {},
    latestSubmittedValues = {},
    firstSubmittedValues = {},
    grantedValues = {},
    isGranted: projectIsGranted
  } = reduxProject;
  const schema = schemaMap[schemaVersion];
  const sections = isGranted
    ? getGrantedSubsections(schemaVersion)
    : schema();
  return (
    <nav className="sidebar-nav section-nav sticky">
      {
        !isGranted && <SectionLink />
      }
      {
        Object.keys(sections)
          .filter(key => !sections[key].show || sections[key].show(props))
          .filter(key => !isGranted || !sections[key].granted.show || sections[key].granted.show({ ...project, ...application }))
          .sort((a, b) => !isGranted ? true : sections[a].granted.order - sections[b].granted.order)
          .map(key => {
            const section = sections[key];
            const fieldsForSection = getFieldsForSection(section, project);
            if (section.subsections) {
              const open = !!(activeSection && section.subsections[activeSection]);
              const title = <Fragment>
                <ChangedBadge fields={fieldsForSection} noLabel />
                <span className="indent">{section.subtitle || section.title}</span>
              </Fragment>;
              return (
                <ExpandingPanel key={key} title={title} open={open}>
                  {
                    map(pickBy(section.subsections, s => sectionVisible(s, project)), (subsection, key) => {
                      return <p key={key}>
                        {
                          (() => {
                            const fields = getFieldsForSection(subsection, project);
                            const sectionHasChanges = hasSectionChanged(fields, project, initialValues, latestSubmittedValues, firstSubmittedValues, grantedValues, projectIsGranted
                            );
                            return sectionHasChanges ? <ChangedBadge fields={fields} noLabel /> : null;
                          })()
                        }
                        <NavLink className="indent" to={`/${key}`}>{subsection.title}</NavLink>
                      </p>;
                    })
                  }
                </ExpandingPanel>
              );
            }
            return (
              <NavLink key={key} to={`/${key}`}>
                <ChangedBadge fields={fieldsForSection} notLabel />
                <h3>
                  {
                    isGranted
                      ? (section.granted && section.granted.title) || section.title
                      : section.title
                  }
                </h3>
              </NavLink>
            );
          })
      }
    </nav>
  );
}
