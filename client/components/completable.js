import React, { Fragment } from 'react';
import classnames from 'classnames';

const Completable = ({ status = 'incomplete', children }) => (
  <Fragment>
    <label className={classnames('status-label', status)}>
      {
        status === 'incomplete' ? 'In progress' : 'Completed'
      }
    </label>
    { children }
  </Fragment>
)

export default Completable;
