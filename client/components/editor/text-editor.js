import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Editor } from 'slate-react';
import {
  ic_format_bold,
  ic_format_italic,
  ic_format_underlined,
  ic_code,
  ic_looks_one,
  ic_looks_two,
  ic_format_quote,
  ic_format_list_numbered,
  ic_format_list_bulleted,
  ic_image
} from 'react-icons-kit/md/';
import { FormatToolbar } from './index';
import RTEditor from './editor';
import { isKeyHotkey } from 'is-hotkey';
import Icon from 'react-icons-kit';
import defer from 'lodash/defer';
import ReactMarkdown from 'react-markdown'

import { throwError } from '../../actions/messages';

import { Block } from 'slate';

const DEFAULT_NODE = 'paragraph';
const MAX_IMAGE_SIZE = 1024 * 1024; // 1mb

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+`');

function insertImage(editor, src, target) {
  if (target) {
    editor.select(target);
  }

  editor.insertBlock({
    type: 'image',
    data: { src }
  });
}

const schema = {
  document: {
    last: { type: 'paragraph' },
    normalize: (editor, { code, node }) => {
      switch (code) {
        case 'last_child_type_invalid': {
          const paragraph = Block.create('paragraph');
          return editor.insertNodeByKey(node.key, node.nodes.size, paragraph);
        }
      }
    }
  },
  blocks: {
    image: {
      isVoid: true
    }
  }
};

class TextEditor extends RTEditor {
  ref = editor => {
    this.editor = editor;
  };

  onChange = ({ value }) => {
    const jsonVal = JSON.stringify(value.toJSON())
    const notNull = jsonVal !== JSON.stringify(this.getInitialValue().toJSON());
    this.setState({ value });
    this.props.onSave(notNull ? jsonVal : null);
  };

  onFocus = (self, editor, next) => {
    next();
    defer(() => this.setState({ focus: true }));
  };

  onBlur = (self, editor, next) => {
    next();
    defer(() => this.setState({ focus: false }));
  };

  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type == type);
  };

  onClickMark = (event, type) => {
    event.preventDefault();
    this.editor.toggleMark(type);
  };

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);
    return (
      <button
        onMouseDown={event => this.onClickMark(event, type)}
        className={classnames('tooltip-icon-button', { active: isActive })}
      >
        <Icon icon={icon} />
      </button>
    );
  };

  hasBlock = type => {
    const { value } = this.state;
    return value.blocks.some(node => node.type == type);
  };

  onClickBlock = (event, type) => {
    event.preventDefault();

    const { editor } = this;
    const { value } = editor;
    const { document } = value;

    // Handle everything but list buttons.
    if (type != 'bulleted-list' && type != 'numbered-list') {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock('list-item');

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item');
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type == type);
      });

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (isList) {
        editor
          .unwrapBlock(
            type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type);
      } else {
        editor.setBlocks('list-item').wrapBlock(type);
      }
    }
  };

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type);

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const {
        value: { document, blocks }
      } = this.state;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = this.hasBlock('list-item') && parent && parent.type === type;
      }
    }

    if (type === 'input-file') {
      return (
        <label
          className={classnames('fileContainer tooltip-icon-button', {
            active: isActive
          })}
        >
          <input type='file' onChange={this.onClickImage} />
          <Icon icon={icon} />
        </label>
      );
    }

    return (
      <button
        onMouseDown={event => this.onClickBlock(event, type)}
        className={classnames('tooltip-icon-button', { active: isActive })}
      >
        <Icon icon={icon} />
      </button>
    );
  };

  onClickImage = event => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        const actual = Math.round(file.size / 1024);
        return this.props.throwError(`Image too large. Image files must be less than 1024kb. This image: ${actual}kb`);
      }

      const reader = new FileReader();
      reader.addEventListener(
        'load',
        () => {
          const src = reader.result;
          if (!src) return;
          this.editor.command(insertImage, src);
        },
        false
      );
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  onKeyDown = (event, editor, next) => {
    let mark;

    if (isBoldHotkey(event)) {
      mark = 'bold';
    } else if (isItalicHotkey(event)) {
      mark = 'italic';
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined';
    } else if (isCodeHotkey(event)) {
      mark = 'code';
    } else {
      return next();
    }

    event.preventDefault();
    editor.toggleMark(mark);
  };

  render() {
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
        {this.props.hint && (
          <span id={`${this.props.name}-hint`} className='govuk-hint'>
            <ReactMarkdown source={this.props.hint} />
          </span>
        )}
        {this.props.error && (
          <span id={`${this.props.name}-error`} className='govuk-error-message'>
            {this.props.error}
          </span>
        )}
        <div id={this.props.name} className={classnames('editor', { focus: this.state.focus })}>
          <FormatToolbar>
            {this.renderMarkButton('bold', ic_format_bold)}
            {this.renderMarkButton('italic', ic_format_italic)}
            {this.renderMarkButton('underlined', ic_format_underlined)}
            {this.renderMarkButton('code', ic_code)}
            {this.renderBlockButton('heading-one', ic_looks_one)}
            {this.renderBlockButton('heading-two', ic_looks_two)}
            {this.renderBlockButton('block-quote', ic_format_quote)}
            {this.renderBlockButton('numbered-list', ic_format_list_numbered)}
            {this.renderBlockButton('bulleted-list', ic_format_list_bulleted)}
            {this.renderBlockButton('input-file', ic_image)}
          </FormatToolbar>
          <Editor
            spellCheck
            placeholder=''
            ref={this.ref}
            value={this.state.value}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            renderBlock={this.renderNode}
            renderMark={this.renderMark}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            name={this.props.name}
            key={this.props.name}
            schema={schema}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => {
  return {
    throwError: message => dispatch(throwError(message))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
