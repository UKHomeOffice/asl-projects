import React, { useState, useEffect, Fragment } from 'react';
import classnames from 'classnames';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import { Markdown } from '@asl/components';

import get from 'lodash/get';
import defer from 'lodash/defer';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';

import { throwError } from '../../actions/messages';

import FormatToolbar from './format-toolbar';
import initialValue from './initial-value';
import Blocks from './blocks';
import Marks from './marks';
import Image from './image';
import Table from './table';
import List from './list';

const tablePlugin = Table();
const listPlugin = List();

const plugins = [
  Blocks(),
  Marks(),
  Image(),
  listPlugin,
  tablePlugin
];

// bugfix - this used to work as part of plugins, but alas no more.
const schema = merge({}, listPlugin.schema, tablePlugin.schema);

const hasNonParagraphNode = (nodes) => {
  return nodes.some(node => {
    if (node.type !== 'paragraph') {
      return true;
    } else if (node.nodes.size > 0) {
      hasNonParagraphNode(node.nodes);
    } else {
      return false;
    }
  });
};

const serialiseValue = value => {
  if (!value.document.text && !hasNonParagraphNode(value.document.nodes)) {
    return null;
  }
  return value.toJSON();
};

const normaliseValue = value => {
  // if value is falsy, init with empty value
  if (!value) {
    return initialValue('');
  }
  if (typeof value === 'string') {
    try {
      // try and parse value
      value = JSON.parse(value);
    } catch (e) {
      // if value is unable to be JSON parsed, set it as a single text node
      value = initialValue(value);
    }
  }
  // if structure is empty and incomplete, init with empty value
  if (get(value, 'document.nodes.length') === 0) {
    value = initialValue('');
  }
  return value;
};

export default function TextEditor({ value, onChange, readOnly, name, className, label, hint, decorateNode, renderDecoration, error }) {
  const [content, setContent] = useState(Value.fromJSON(normaliseValue(value)));
  const [editor, setEditor] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [focus, setFocus] = useState(false);

  const ref = editor => {
    setEditor(editor);
  };

  const save = () => {
    if (typeof onChange === 'function') {
      onChange(serialiseValue(content));
    }
  };

  const localOnChange = ({ value }) => {
    const old = content;
    if (!isEqual(old.toJSON(), value.toJSON())) {
      setUnsavedChanges(true);
    }
    setContent(value);
  };

  useEffect(() => {
    if (unsavedChanges) {
      save();
    }
  }, [content]);

  const onFocus = (self, editor, next) => {
    next();
    defer(() => setFocus(true));
  };

  const onBlur = (self, editor, next) => {
    next();
    defer(() => setFocus(false));
  };

  const command = (func, ...args) => {
    try {
      editor[func] && editor[func](...args);
    } catch (err) {
      throwError(err.message || 'Something went wrong');
    }
  };

  const query = (func, ...args) => {
    if (!editor) {
      return false;
    }
    if (!editor[func]) {
      throw new Error(`Query "${func}" is not defined`);
    }
    return editor[func](...args);
  };

  if (readOnly && !serialiseValue(content)) {
    return <p><em>No answer provided</em></p>;
  }

  return (
    <div className={classnames('govuk-form-group', { 'govuk-form-group--error': error }, className)}>
      {
        !readOnly &&
          <Fragment>
            <label className='govuk-label' htmlFor={name}>{label}</label>
            {
              hint &&
                <span id={`${name}-hint`} className='govuk-hint'>
                  {
                    typeof hint === 'string'
                      ? <Markdown links={true}>{ hint }</Markdown>
                      : hint
                  }
                </span>
            }
            {
              error &&
                <span id={`${name}-error`} className='govuk-error-message'>
                  {error}
                </span>
            }
          </Fragment>
      }
      <div id={name} className={classnames('editor', { focus, readonly: readOnly })}>
        {
          !readOnly &&
            <FormatToolbar
              value={content}
              inTable={tablePlugin.queries.isSelectionInTable(content)}
              query={query}
              command={command}
            />
        }
        <Editor
          spellCheck
          placeholder=''
          ref={ref}
          plugins={plugins}
          value={content}
          onChange={localOnChange}
          name={name}
          key={name}
          readOnly={readOnly}
          decorateNode={decorateNode}
          renderDecoration={renderDecoration}
          onFocus={onFocus}
          onBlur={onBlur}
          schema={schema}
        />
      </div>
    </div>
  );
}
