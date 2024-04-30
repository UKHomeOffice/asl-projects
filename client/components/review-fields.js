import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import castArray from 'lodash/castArray';
import every from 'lodash/every';

import { flattenReveals } from '../helpers';
import Review from './review';

const fieldIncluded = (field, values, application) => {
  if (!field.conditional && !field.show) {
    return true;
  }
  if (field.show && typeof field.show === 'function') {
    return field.show({ ...values, ...application });
  }
  return every(Object.keys(field.conditional), key => field.conditional[key] === values[key]);
};

const ReviewFields = ({
  fields,
  values = {},
  onEdit,
  editLink,
  project,
  prefix = '',
  noComments,
  altLabels,
  readonly,
  step,
  protocolId,
  application,
  hideChanges,
  showTitle = true,
  showItemHeading = true,
  isFullApplication,
  title,
  additionalCommentFields = []
}) => (
  <Fragment>
    {
      isFullApplication && showTitle && <h2>{ title }</h2>
    }
    {
      castArray(values).map((item, i) => (
        <Fragment key={i}>
          {
            item.name && showItemHeading && <h2 className="group">{item.name}</h2>
          }
          {
            flattenReveals(fields.filter(field => fieldIncluded(field, project, application)), item).map(field => {
              return <Review
                { ...field }
                className=""
                prefix={ prefix }
                label={ field.review || field.label }
                key={ field.name }
                value={ item[field.name] }
                values={ values }
                editLink={ editLink
                  ? `${editLink}${field.name}`
                  : `${step}#${field.name}`
                }
                protocolId={protocolId}
                onEdit={ onEdit }
                noComments={ noComments }
                altLabels={altLabels}
                readonly={readonly}
                hideChanges={hideChanges}
                additionalCommentFields={additionalCommentFields}
              />;
            })
          }
        </Fragment>
      ))
    }
  </Fragment>
);

const mapStateToProps = ({ project, application }) => ({ project, application });

export { ReviewFields };
export default connect(mapStateToProps)(ReviewFields);
