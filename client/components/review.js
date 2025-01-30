import React, { Fragment } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { connect } from 'react-redux';

import Comments from './comments';
import DiffWindow from './diff-window';
import ReviewField from './review-field';
import ChangedBadge from './changed-badge';
import RAPlaybackHint from './ra-playback-hint';
import { Markdown } from '@ukhomeoffice/asl-components';

import ErrorBoundary from './error-boundary';
import classnames from 'classnames';
import isEqual from 'lodash/isEqual'; // for deep comparison

class Review extends React.Component {


/**
 * Checks whether the database value has changed compared to the current value.
 *
 * This method:
 * - Normalises values for comparison, handling null, undefined, arrays, and objects.
 * - Ensures duration fields have default values when missing.
 * - Determines the actual current value by prioritising `currentValue` over `values[name]`.
 * - Compares stored and current values to detect changes.
 * - Handles dynamic species-based fields, ensuring changes in species-specific data are also detected.
 *
 * The method returns `true` if a change is detected, otherwise `false`.
 *
 * @returns {boolean} - `true` if there is a change in the data, otherwise `false`.
 */
hasDatabaseChange() {
    const normaliseValue = value => {
        if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
            // Normalise `null`, `undefined`, and empty arrays to a consistent empty state
            return null;
        }
        if (Array.isArray(value)) {
            // Sort arrays to ensure order doesn't affect comparison
            return value.sort();
        }
        if (typeof value === 'object' && value !== null) {
            // Ensure consistent ordering of object keys for generic objects
            return JSON.stringify(value, Object.keys(value).sort());
        }
        return value; // Return all other values as-is
    };

    const normaliseDuration = value => {
    if (value && typeof value === 'object' && ('years' in value || 'months' in value)) {
        // Normalise duration objects specifically
        return {
            years: value.years ?? 5, // Default to 5 if undefined or null
            months: value.months ?? 0 // Default to 0 if undefined or null
        };
    }

      // Default for completely missing duration
      return { years: 5, months: 0 };
  };


    const { name, storedValue, currentValue, values } = this.props;

    // Adjust storedValue for duration fields
    const adjustedStoredValue =
        name === 'duration' ? normaliseDuration(storedValue) : storedValue;

    // Determine the actual current value for specific fields
    const actualCurrentValue = currentValue !== undefined && currentValue !== null
        ? currentValue
        : values[name] !== undefined
        ? values[name]
        : null; // Fallback to `null` if no value is provided

    // Normalise stored and current values
    const normalisedStoredValue =
        name === 'duration' ? normaliseDuration(adjustedStoredValue) : normaliseValue(adjustedStoredValue);
    const normalisedCurrentValue =
        name === 'duration' ? normaliseDuration(actualCurrentValue) : normaliseValue(actualCurrentValue);

    // Detect changes by comparing normalized values
    let hasChange = !isEqual(normalisedStoredValue, normalisedCurrentValue);


    // Add logic for species-based dynamic fields
    const species = values?.species || [];
    if (species.length === 0) {
      
    } else {
        species.forEach(speciesName => {
            const fieldName = `reduction-quantities-${speciesName}`;
            const speciesStoredValue = values.storedValue?.[fieldName] || null;
            const speciesCurrentValue = values[fieldName] || null;

            if (!isEqual(normaliseValue(speciesStoredValue), normaliseValue(speciesCurrentValue))) {

              // any change in dynamic fields sets hasChange to true
                hasChange = true; 
            } else {
                
            }
        });
    }

    return hasChange;
}





  replay() {
    return this.props.children || <ReviewField {...this.props} />;
  }

  render() {
    const { label } = this.props.altLabels ? this.props.alt : this.props;
    const {
      isGranted,
      showGrantedLabel = true,
      review,
      changedFromFirst,
      changedFromLatest,
      changedFromGranted,
      hideChanges
    } = this.props;

    let { hint } = this.props;

    if (this.props.raPlayback) {
      hint = <RAPlaybackHint {...this.props.raPlayback} hint={hint} />;
    } else if (hint && !React.isValidElement(hint)) {
      hint = <Markdown links={true} paragraphProps={{ className: 'grey' }}>{hint}</Markdown>;
    } else if (hint) {
      hint = <p className="grey">{hint}</p>;
    } else {
      hint = null;
    }

    const showComments = !this.props.noComments && this.props.type !== 'repeater';
    const changed = changedFromFirst || changedFromLatest || changedFromGranted;
    const showDiffWindow = this.props.readonly && !hideChanges && changed;
    const netChange = this.hasDatabaseChange();
    const showChanges = !hideChanges && netChange;

    if (this.props.type === 'comments-only' && showComments) {
      return <Comments field={`${this.props.prefix || ''}${this.props.name}`} collapsed={!this.props.readonly} />;
    }


    return (
      <div className={classnames('review', this.props.className)}>
        {
          (!isGranted || showGrantedLabel) && <h3>{review || label}</h3>
        }
        {
          showChanges && (
            <ChangedBadge
              changedFromFirst={changedFromFirst}
              changedFromLatest={changedFromLatest}
              changedFromGranted={changedFromGranted}
              protocolId={this.props.protocolId}
            />
          )
        }
        {
          showDiffWindow && (
            <DiffWindow
              {...this.props}
              name={`${this.props.prefix}${this.props.name}`}
            />
          )
        }
        {hint}
        {
          this.replay()
        }
        {
          showComments && <Comments
            field={`${this.props.prefix || ''}${this.props.name}`}
            collapsed={!this.props.readonly}
            additionalCommentFields={this.props.additionalCommentFields ?? []}
          />
        }
        {
          // repeaters have edit links on the individual fields
          !this.props.readonly && this.props.type !== 'repeater' && (
            <Fragment>
              <p>
                <Link
                  to={this.props.editLink || `#${this.props.name}`}
                  className="edit-link"
                  onClick={e => this.props.onEdit && this.props.onEdit(e, this.props.name)}
                >Edit</Link>
              </p>
              <hr />
            </Fragment>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { application: { readonly = false, isGranted = false, previousProtocols = {} } = {}, changes: { first = [], latest = [], granted = [] } = {} } = state;
  
  const key = `${ownProps.prefix || ''}${ownProps.name}`;
  
  const changedFromGranted = granted.includes(key);
  const changedFromLatest = latest.includes(key);
  const changedFromFirst = first.includes(key);
  
  // Safely accessing database values
  const storedValue = (state.databaseValues && state.databaseValues[key]) || null;
  const currentValue = ownProps.value || null; // current value from props, if available

  return {
    readonly: ownProps.readonly || readonly,
    changedFromFirst,
    changedFromLatest,
    changedFromGranted,
    isGranted,
    previousProtocols,
    storedValue, // safely provided stored value
    currentValue
  };
};


const ConnectedReview = connect(mapStateToProps)(Review);

const SafeReview = props => (
  <ErrorBoundary
    details={`Field: ${props.name}`}
  >
    <ConnectedReview {...props} />
  </ErrorBoundary>
);

export default SafeReview;