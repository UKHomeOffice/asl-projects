import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import format from 'date-fns/format';
import { Button } from '@ukhomeoffice/react-components';
import { Markdown } from '@ukhomeoffice/asl-components';
import { deleteComment } from '../../actions/comments';

import { DATE_FORMAT } from '../../constants';

const Comment = ({
  field,
  author,
  createdAt,
  comment,
  id,
  index,
  isNew,
  isMine,
  deleted,
  deleteComment,
  editComment
}) => (
  <div className={classnames('comment', { isNew, mine: isMine, deleted })}>
    <div className="header">
      <strong>{`${index + 1}. ${author}`}</strong>
      {
        !deleted && <span className="date">{ createdAt ? format(createdAt, DATE_FORMAT.short) : 'New' }</span>
      }
    </div>
    <div className="content">
      {
        deleted
          ? <em>This comment has been deleted</em>
          : <Markdown>{comment}</Markdown>
      }

      {
        isMine && isNew && !deleted && (
          <Fragment>
            <Button className="link" onClick={() => editComment(id)}>Edit</Button>
            <Button className="link" onClick={() => deleteComment({ field, id })}>Delete</Button>
          </Fragment>
        )
      }
    </div>
  </div>
);

export default connect(null, { deleteComment })(Comment);
