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
import { hasDatabaseChange } from '../helpers/field-change-detection';
import { hasSpeciesFieldChanges } from '../helpers/species-change-detection';

class Review extends React.Component {

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
      hideChanges,
      latestSubmittedValue, // ✅ Ensure this is included
      firstSubmittedValue, // ✅ Ensure this is included
      grantedValue // ✅ Ensure this is included
    } = this.props;

    let { hint } = this.props;
    const { fieldName, storedValue, currentValue, values } = this.props;

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
    // ✅ Call `hasDatabaseChange` before rendering `ChangedBadge`
    const netChange = hasDatabaseChange(
      fieldName,
      storedValue,
      currentValue,
      latestSubmittedValue, // ✅ Pass it here
      firstSubmittedValue, // ✅ Pass it here
      grantedValue, // ✅ Pass it here
      isGranted,
      values,
      hasSpeciesFieldChanges
    );

    console.log(`Field: ${fieldName} - Changed: ${netChange}`);

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
  const {
    application: { readonly = false, isGranted = false, previousProtocols = {} } = {},
    changes: { first = [], latest = [], granted = [] } = {}
  } = state;

  const key = `${ownProps.prefix || ''}${ownProps.name}`;

  const changedFromGranted = granted.includes(key);
  const changedFromLatest = latest.includes(key);
  const changedFromFirst = first.includes(key);

  // ✅ Ensure these values are retrieved safely
  const storedValue = (state.databaseValues && state.databaseValues[key]) || null;
  const currentValue = ownProps.value || null;
  const latestSubmittedValue = (state.latestSubmittedValues && state.latestSubmittedValues[key]) || null;
  const firstSubmittedValue = (state.firstSubmittedValues && state.firstSubmittedValues[key]) || null;
  const grantedValue = (state.grantedValues && state.grantedValues[key]) || null;

  return {
    readonly: ownProps.readonly || readonly,
    changedFromFirst,
    changedFromLatest,
    changedFromGranted,
    isGranted,
    previousProtocols,
    storedValue,
    currentValue,
    latestSubmittedValue, // ✅ Ensure this is passed
    firstSubmittedValue, // ✅ Ensure this is passed
    grantedValue, // ✅ Ensure this is passed
    fieldName: ownProps.name
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
