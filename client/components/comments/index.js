import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import classnames from 'classnames';
import some from 'lodash/some';
import partition from 'lodash/partition';
import { Button } from '@ukhomeoffice/react-components';
import ExpandingPanel from '../expanding-panel';
import AddComment from './add-comment';
import EditComment from './edit-comment';
import Comment from './comment';

const Comments = ({ field, collapsed, additionalCommentFields = [] }) => {

  const name = field.split('.').pop();

  const comments = useSelector(state => {
    let allComments = [
      ...(state.comments[field] ?? []),
      ...additionalCommentFields.flatMap(f => state.comments[f] ?? [])
    ];

    // backwards compatibility fixes for some comments being saved without a prefix
    // merge comments saved with unprefixed name and full name
    if (name !== field) {
      // whitelist the fields in legacy protocol animal questions
      if (field.match(/^protocols\.[a-f0-9-]+\.item\./)) {
        allComments = [].concat(state.comments[name]).concat(state.comments[field]).filter(Boolean);
      }

      // whitelist the fields nested under the fate section of protocols
      if (field.match(/^protocols\.[a-f0-9-]+\.(killed|killing-method|method-and-justification|continued-use-relevant-project)$/)) {
        allComments = [].concat(state.comments[name]).concat(state.comments[field]).filter(Boolean);
      }
    }
    return allComments || [];
  }, shallowEqual);

  const { commentable, showComments } = useSelector(state => state.application);
  const [expanded, setExpanded] = useState(!collapsed);
  const [showPrevious, setShowPrevious] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setExpanded(!collapsed && some(comments, comment => comment.isNew));
  }, [comments]);

  if (!showComments) {
    return null;
  }

  if (!comments.length && commentable && !editing) {
    return <AddComment field={field} />;
  }

  if (!comments.length) {
    return null;
  }

  const [active, previous] = partition(comments, comment => comment.isNew);
  const commentToEdit = editing && active.find(comment => comment.id === editing);

  return (
    <ExpandingPanel
      alwaysUpdate={true}
      className={classnames('comments', { 'has-new': some(comments, comment => comment.isNew) })}
      open={expanded}
      title={`${expanded ? 'Hide comments' : 'Show comments'} (${comments.length})`}
      onToggle={() => setExpanded(!expanded)}
    >
      <Fragment>
        {
          commentable && !editing &&
            <AddComment field={field} />
        }
        {
          commentToEdit &&
            <EditComment field={field} id={commentToEdit.id} key={commentToEdit.id} value={commentToEdit.comment} cancel={() => setEditing(false)} />
        }
        {
          active.map((comment, index) => <Comment index={(comments.length || 0) - index - 1} key={(comments.length || 0) - index - 1} field={field} editComment={id => setEditing(id)} { ...comment } />)
        }
        {
          !!active.length && !!previous.length && (
            <p><Button className="link" onClick={() => setShowPrevious(!showPrevious)}>{ showPrevious ? 'Hide' : 'Show' } {previous.length} previous comments</Button></p>
          )
        }
        {
          (showPrevious || !active.length) && previous.map((comment, index) => <Comment index={previous.length - index - 1} key={previous.length - index - 1} field={field} { ...comment } />)
        }
      </Fragment>
    </ExpandingPanel>
  );
};

export default Comments;
