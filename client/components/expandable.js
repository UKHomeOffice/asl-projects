import React, { Component } from 'react';
import classnames from 'classnames';

const hasTwoChildren = children => {
  return children && children.length === 2;
}

const Expandable = ({
  expanded,
  title,
  children,
  content,
  onHeaderClick,
  className
}) => (
  <div className={classnames('expandable', { expanded }, className)}>
    <div className="header" onClick={onHeaderClick}>
      {
        title && <h2>{title}</h2>
      }
      {
        hasTwoChildren(children) && children[0]
      }
    </div>
    <div className={classnames('content', { hidden: !expanded })}>
      {
        content && content
      }
      {
        hasTwoChildren(children) ? children[1] : children
      }
    </div>
  </div>
)

export default Expandable;
