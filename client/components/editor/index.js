import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import ReactMarkdown from 'react-markdown';

import defer from 'lodash/defer';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

import { throwError } from '../../actions/messages';

import ReadOnlyTextEditor from './readonly';

import { normaliseValue, serialiseValue } from './lib';

import FormatToolbar from './format-toolbar';
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

class TextEditor extends Component {

  constructor(props) {
    super(props);
    const value = normaliseValue(this.props.value);

    this.state = {
      value: Value.fromJSON(value),
      focus: false
    }
  }

  ref = editor => {
    this.editor = editor;
  };

  save = debounce(() => {
    const { value } = this.state;
    this.props.onChange && this.props.onChange(serialiseValue(value));
  }, 500, { maxWait: 5000, leading: true })

  onChange = ({ value }) => {
    const old = this.state.value;
    const hasChanged = !isEqual(old.toJSON(), value.toJSON());

    this.setState({ value }, () => hasChanged && this.save());
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
      throw new Error(`Query "${func}" is not defined`)
    }
    return this.editor[func](...args);
  }

  render() {
    if (this.props.readOnly) {
      return <ReadOnlyTextEditor {...this.props} />
    }

    const { value } = this.state;

    return (
      <div
        className={classnames(
          'govuk-form-group',
          { 'govuk-form-group--error': this.props.error },
          this.props.className
        )}
      >
        <label className='govuk-label' htmlFor={this.props.name}>
          {this.props.label}
        </label>
        {
          this.props.hint && (
            <span id={`${this.props.name}-hint`} className='govuk-hint'>
              <ReactMarkdown source={this.props.hint} />
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
        <div id={this.props.name} className={classnames('editor', { focus: this.state.focus })}>
          <FormatToolbar
            value={this.state.value}
            inTable={tablePlugin.queries.isSelectionInTable(value)}
            query={this.query}
            command={this.command}
          />
          <Editor
            spellCheck
            placeholder=''
            ref={this.ref}
            plugins={plugins}
            value={value}
            onChange={this.onChange}
            name={this.props.name}
            key={this.props.name}
            readOnly={false}
            decorateNode={this.props.decorateNode}
            renderDecoration={this.props.renderDecoration}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
        </div>
      </div>
    );
  }
}

export default connect(null, { throwError })(TextEditor);
