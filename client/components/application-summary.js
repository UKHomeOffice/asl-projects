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

/**
 * Normalise a given value into a consistent string format.
 *
 * - If the value is `null` or `undefined`, it returns an empty string.
 * - If the value is an object, it converts it into a JSON string.
 * - For all other types, it converts the value into a string and trims any extra whitespace.
 *
 * @param {any} value - The input value to normalise.
 * @returns {string} - A normalised string representation of the input value.
 */
function normalizeValue(value) {
  if (value === null || value === undefined) {
    return ""; // Return an empty string for null or undefined values.
  }
  if (typeof value === "object") {
    return JSON.stringify(value); // Convert objects to their JSON string representation.
  }
  return String(value).trim(); // Convert other types to string and trim whitespace.
}

/**
 * Sanitise a given value by normalising it and removing double quotes.
 *
 * - First, the value is normalised using `normalizeValue`, ensuring it is a consistent string.
 * - Then, any double quotes (`"`) in the string are removed using a regular expression.
 *
 * @param {any} value - The input value to sanitise.
 * @returns {string} - A sanitised string with double quotes removed.
 */
function sanitizeValue(value) {
  return normalizeValue(value).replace(/["]+/g, ""); // Remove all double quotes from the normalised value.
}



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


/**
 * Recursively traverse and compare all fields in a section.
 * @param {object} props - The props containing all saved, initial, and current data.
 * @param {string} sectionName - The name of the section to check (e.g., "experience-projects").
 * @param {string} type - The type of comparison (e.g., "field").
 * @returns {boolean} - True if any field differs, false otherwise.
 */
/**
 * Recursively find all fields within a section and compare their values.
 * @param {object} props - Contains all saved and current data (savedValues, currentValues, initialValues).
 * @param {object} sectionData - The section object containing fields and nested subsections.
 * @returns {boolean} - True if any field in the section differs, false otherwise.
 */
const hasSectionChangedDeep = (props, sectionData) => {
  const { savedValues, currentValues, initialValues } = props;

  if (!savedValues || !currentValues || !initialValues) {
    console.error("Missing savedValues, currentValues, or initialValues in props.");
    return false;
  }

  /**
   * Recursive helper function to compare values.
   * @param {object} data - The section or field data to process.
   * @returns {boolean} - True if any field differs, false otherwise.
   */
  const compareFields = (data) => {
    let changed = false;

    Object.entries(data).forEach(([key, value]) => {
      // Handle nested objects (e.g., subsections)
      if (value && typeof value === "object" && !Array.isArray(value)) {
        if (compareFields(value)) {
          changed = true;
        }
      } else {
        // Compare leaf fields
        const savedValue = savedValues[key];
        const currentValue = currentValues[key];
        const initialValue = initialValues[key];

        const sanitizedSaved = sanitizeValue(savedValue);
        const sanitizedCurrent = sanitizeValue(currentValue);
        const sanitizedInitial = sanitizeValue(initialValue);

        // Compare values and log debugging information
        console.log(`Field: ${key}`);
        console.log(`  Saved: ${sanitizedSaved}`);
        console.log(`  Current: ${sanitizedCurrent}`);
        console.log(`  Initial: ${sanitizedInitial}`);

        if (
          sanitizedSaved !== sanitizedCurrent ||
          sanitizedSaved !== sanitizedInitial
        ) {
          console.log(`  Field "${key}" has changed.`);
          changed = true;
        }
      }
    });

    return changed;
  };

  return compareFields(sectionData);
};





const hasChangedFields = (fields, currentValues, initialValues) => {
  return fields.some(field => {
    // Normalize and sanitize current and initial values
    const currentValue = sanitizeValue(currentValues[field]);
    const initialValue = sanitizeValue(initialValues[field]);

    // Special handling for array-based fields (e.g., checkboxes, multi-selects)
    if (Array.isArray(currentValue) || Array.isArray(initialValue)) {
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      const initialArray = Array.isArray(initialValue) ? initialValue : [];
      const changed = JSON.stringify(currentArray.sort()) !== JSON.stringify(initialArray.sort());

      console.log(`Field: ${field}`);
      console.log(`Current (Array):`, currentArray);
      console.log(`Initial (Array):`, initialArray);
      console.log(`Changed (Array):`, changed);

      return changed;
    }

    // Special handling for boolean fields (e.g., checkboxes, radios)
    if (typeof currentValue === "boolean" || typeof initialValue === "boolean") {
      const changed = currentValue !== initialValue;

      console.log(`Field: ${field}`);
      console.log(`Current (Boolean):`, currentValue);
      console.log(`Initial (Boolean):`, initialValue);
      console.log(`Changed (Boolean):`, changed);

      return changed;
    }

    // General scalar value comparison (e.g., text, textarea)
    const changed = currentValue !== initialValue;

    console.log(`Field: ${field}`);
    console.log(`Current (Sanitized): "${currentValue}"`);
    console.log(`Initial (Sanitized): "${initialValue}"`);
    console.log(`Changed:`, changed);

    return changed;
  });
};



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
                        {

  hasChangedFields(fields, values, project.initialValues || {}) && <ChangedBadge fields={fields} />
}
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