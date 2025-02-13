import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import { Markdown } from '@ukhomeoffice/asl-components';

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
  // bugfix ASSB-1292 - for PPL transfers between holders: when the user removes a value from the form the value is set to the string null rather than the value null
  // this is a temporary fix so the user is unblocked whilst I look for the cause
  if (value === 'null') value = null;
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

class TextEditor extends Component {
  constructor(props) {
    super(props);
    const value = normaliseValue(this.props.value);

    this.state = {
      value: Value.fromJSON(value),
      focus: false
    };
  }

  ref = editor => {
    this.editor = editor;
  };

  save = () => {
    const { value } = this.state;
    this.props.onChange && this.props.onChange(serialiseValue(value));
  };

  onChange = ({ value }) => {
    const old = this.state.value;
    const hasChanged = () => !isEqual(old.toJSON(), value.toJSON());

    this.setState({ value }, () => hasChanged() && this.save());
  };

  onFocus = (self, editor, next) => {
    next();
    defer(() => this.setState({ focus: true }));
  };

  onBlur = (self, editor, next) => {
    next();
    defer(() => this.setState({ focus: false }));
  };

  command = (func, ...args) => {
    try {
      this.editor[func] && this.editor[func](...args);
    } catch (err) {
      this.props.throwError(err.message || 'Something went wrong');
    }
  }

  query = (func, ...args) => {
    if (!this.editor) {
      return false;
    }
    if (!this.editor[func]) {
      throw new Error(`Query "${func}" is not defined`);
    }
    return this.editor[func](...args);
  }

  render() {
    const { value } = this.state;
    if (this.props.readOnly && !serialiseValue(value)) {
      return <p><em>No answer provided</em></p>;
    }
    return (
      <div
        className={classnames(
          'govuk-form-group',
          { 'govuk-form-group--error': this.props.error },
          this.props.className
        )}
      >
        {
          !this.props.readOnly && (
            <Fragment>
              <label className='govuk-label' htmlFor={this.props.name}>
                {this.props.label}
              </label>
              {
                this.props.hint && (
                  <span id={`${this.props.name}-hint`} className='govuk-hint'>
                    {
                      typeof this.props.hint === 'string'
                        ? <Markdown links={true}>{ this.props.hint }</Markdown>
                        : this.props.hint
                    }
                  </span>
                )
              }
              {
                this.props.error && (
                  <span id={`${this.props.name}-error`} className='govuk-error-message'>
                    {this.props.error}
                  </span>
                )
              }
            </Fragment>
          )
        }
        <div id={this.props.name} className={classnames('editor', { focus: this.state.focus, readonly: this.props.readOnly })}>
          {
            !this.props.readOnly && (
              <FormatToolbar
                value={this.state.value}
                inTable={tablePlugin.queries.isSelectionInTable(value)}
                query={this.query}
                command={this.command}
              />
            )
          }
          <Editor
            spellCheck
            placeholder=''
            ref={this.ref}
            plugins={plugins}
            value={value}
            onChange={this.onChange}
            name={this.props.name}
            key={this.props.name}
            readOnly={this.props.readOnly}
            decorateNode={this.props.decorateNode}
            renderDecoration={this.props.renderDecoration}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            schema={schema}
          />
        </div>
      </div>
    );
  }
}

export default connect(null, { throwError })(TextEditor);
