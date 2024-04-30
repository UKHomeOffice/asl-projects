import React, { Fragment, useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import some from 'lodash/some';
import mapValues from 'lodash/mapValues';
import minimatch from 'minimatch';

import { INCOMPLETE, PARTIALLY_COMPLETE, COMPLETE } from '../constants/completeness';
import schemaMap from '../schema';
import { flattenReveals, getNewComments, getFields, getScrollPos } from '../helpers';

import NewComments from './new-comments';
import ChangedBadge from './changed-badge';
import NextSteps from './next-steps';
import PreviewLicence from './preview-licence';
import Submit from './submit';
import { selector } from './sync-handler';
import HoldingPage from './holding-page';

const mapStateToProps = ({
  project,
  comments,
  application: {
    schemaVersion,
    readonly,
    showComments,
    showConditions,
    user,
    basename,
    project: actualProject
  }
}) => {
  const schema = schemaMap[schemaVersion];
  const fieldsBySection = Object.values(schema()).map(section => section.subsections).reduce((obj, subsections) => {
    const includeReveals = true;
    return {
      ...obj,
      ...mapValues(subsections, subsection => flattenReveals(getFields(subsection, includeReveals), project).map(field => field.name))
    };
  }, {});
  return {
    readonly,
    showComments,
    showConditions,
    newComments: getNewComments(comments, user, project),
    fieldsBySection,
    legacy: schemaVersion === 0,
    values: project,
    sections: schema(),
    basename,
    project: actualProject
  };
};

const ApplicationSummary = () => {

  const props = useSelector(mapStateToProps);
  const { isSyncing } = useSelector(selector);
  const [submitted, setSubmitted] = useState(false);
  const { legacy, values, readonly, sections, basename, fieldsBySection, newComments, project, showComments } = props;

  const [errors, setErrors] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (submitted && !isSyncing) { submit(); }
  }, [isSyncing, submitted]);

  const getIncompleteSubsections = () => {
    if (legacy) {
      return true;
    }
    const subsections = map(pickBy(sections, section => !section.show || section.show(props)), section => pickBy(section.subsections, subsectionVisible))
      .reduce((obj, values) => ({ ...obj, ...values }), {});

    return Object.keys(subsections)
      .map(key => ({ ...subsections[key], key }))
      .filter(subsection => isComplete(subsection, subsection.key) !== COMPLETE);
  };

  const isComplete = (subsection, key) => {
    if (typeof subsection.complete === 'function') {
      return subsection.complete(values) || INCOMPLETE;
    }

    let completeness = INCOMPLETE;

    if (values[`${key}-complete`]) {
      completeness = COMPLETE;
    } else if (Array.isArray(subsection.fields)) {
      if (some(subsection.fields, field => values[field.name])) {
        completeness = PARTIALLY_COMPLETE;
      }
    }
    return completeness;
  };

  const CompleteBadge = ({ isComplete }) => {
    if (legacy) {
      return null;
    }
    switch (isComplete) {
      case COMPLETE:
        return <span className="badge complete">complete</span>;
      case PARTIALLY_COMPLETE:
        return <span className="badge incomplete">incomplete</span>;
      default:
        return null;
    }
  };

  const ErrorMessage = ({title, isComplete, children}) => {
    if (readonly || legacy || !errors) {
      return children;
    }
    if (isComplete === COMPLETE) {
      return children;
    }
    return (
      <div className="govuk-form-group--error">
        <span className="govuk-error-message">Complete the {title.replace(/^[A-Z]{1}/, str => str.toLowerCase())} section</span>
        { children }
      </div>
    );
  };

  const ErrorSummary = () => {
    if (readonly || !errors) {
      return null;
    }
    const incomplete = getIncompleteSubsections();
    return (
      <div className="govuk-error-summary" role="alert" aria-labelledby="error-summary-title" tabIndex="-1">
        <h2 className="govuk-error-summary__title" id="error-summary-title">
          There is a problem
        </h2>
        <div className="govuk-error-summary__body">
          <p>You must complete the following sections before you can continue:</p>
          <ul className="govuk-list govuk-error-summary__list">
            {
              incomplete.map(({ key, title }) =>
                <li key={key}><Link to={`/${key}`}>{title}</Link></li>
              )
            }
          </ul>
        </div>
      </div>
    );
  };

  const subsectionVisible = subsection => {
    return !subsection.show || subsection.show(values);
  };

  const getCommentCount = (key) => {
    const fields = fieldsBySection[key] || [];
    const getCommentsForKey = key => {
      const match = minimatch.filter(key);
      return Object.keys(newComments)
        .filter(match)
        .reduce((sum, q) => sum + newComments[q].length, 0);
    };
    return fields.reduce((total, field) => total + getCommentsForKey(field), 0);
  };

  const Comments = ({ subsection }) => {
    if (!showComments) {
      return null;
    }
    const count = getCommentCount(subsection);
    return <NewComments comments={count} />;
  };

  const onComplete = () => {
    const incomplete = getIncompleteSubsections();
    if (incomplete.length) {
      setErrors(true);
      const top = getScrollPos(ref.current, -120); // shift 120px for the sticky header
      window.scrollTo({ top, behavior: 'smooth' });
      return;
    }
    submit();
  };

  const submit = () => {
    if (isSyncing) {
      setSubmitted(true);
      return;
    }
    if (project.isLegacyStub) {
      window.location.href = basename.replace(/\/edit\/?$/, '/convert');
      return;
    }
    window.location.href = `${basename}/submit`;
  };

  if (!values) {
    return null;
  }

  if (submitted) {
    return <HoldingPage />;
  }

  return (
    <div className="application-summary" ref={ref}>
      <ErrorSummary />
      {
        Object.keys(sections).filter(section => !sections[section].show || sections[section].show(props)).map(key => {
          const section = sections[key];
          const subsections = Object.keys(section.subsections)
            .filter(subsection => subsectionVisible(section.subsections[subsection]));

          if (!subsections.length) {
            return null;
          }

          return <Fragment key={key}>
            {
              section.title && <h2 className="section-heading">{ section.title }</h2>
            }
            {
              section.subtitle && <h3 className="section-heading">{ section.subtitle }</h3>
            }
            <table className="govuk-table">
              <tbody>
                {
                  subsections.map(key => {
                    const subsection = section.subsections[key];
                    const fields = Object.values(fieldsBySection[key] || []);
                    if (key === 'protocols') {
                      fields.push('reusableSteps');
                    }
                    if (subsection.repeats) {
                      fields.push(subsection.repeats);
                    }
                    return <tr key={key}>
                      <td>
                        <ErrorMessage title={subsection.title} isComplete={isComplete(subsection, key)}>
                          <Link to={`/${key}`}>{ subsection.title }</Link>
                        </ErrorMessage>
                      </td>
                      <td className="controls">
                        <Comments subsection={key} />
                        <ChangedBadge fields={fields} />
                        <CompleteBadge isComplete={isComplete(subsection, key)} />
                      </td>
                    </tr>;
                  })
                }
              </tbody>
            </table>
          </Fragment>;
        })
      }
      {
        !readonly && <Submit onComplete={onComplete} />
      }
      <PreviewLicence />
      <NextSteps />
    </div>
  );

};

export default ApplicationSummary;
