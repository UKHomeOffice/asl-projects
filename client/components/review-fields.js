import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import castArray from 'lodash/castArray';
import every from 'lodash/every';

import { flattenReveals } from '../helpers';
import Review from './review';

const fieldIncluded = (field, values, isGranted) => {
  if (!field.conditional && !field.show) {
    return true;
  }
  if (field.show && typeof field.show === 'function') {
    return field.show({ ...values, isGranted });
  }
  return every(Object.keys(field.conditional), key => field.conditional[key] === values[key])
}

const ReviewFields = ({ fields, values = {}, onEdit, editLink, project, prefix = '', noComments, altLabels, readonly, step, isGranted }) => (
  <Fragment>
    {
      castArray(values).map((item, i) => (
        <Fragment key={i}>
          {
            item.name && <h2 className="group">{item.name}</h2>
          }
          {
            flattenReveals(fields.filter(field => fieldIncluded(field, project, isGranted)), item).map(field => {
              return <Review
                { ...field }
                prefix={ prefix }
                label={ field.review || field.label }
                key={ field.name }
                value={ item[field.name] }
                values={ values }
                editLink={ editLink
                  ? `${editLink}${field.name}`
                  : `${step}#${field.name}`
                }
                onEdit={ onEdit }
                noComments={ noComments }
                altLabels={altLabels}
                readonly={readonly}
              />
            })
          }
        </Fragment>
      ))
    }
  </Fragment>
);

const mapStateToProps = ({ project, application: { isGranted } }) => ({ project, isGranted })

export default connect(mapStateToProps)(ReviewFields);
