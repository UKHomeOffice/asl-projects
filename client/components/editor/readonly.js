import React, { Component } from 'react';
import classnames from 'classnames';
import { Editor } from 'slate-react';

import { normaliseValue, serialiseValue } from './lib';

class ReadOnlyTextEditor extends Component {

  ref = editor => {
    this.editor = editor;
  };

  render() {
    const value = normaliseValue(this.props.value);

    if (!serialiseValue(value)) {
      return <p><em>No answer provided</em></p>;
    }

    return (
      <div
        className={classnames(
          'govuk-form-group',
          this.props.className
        )}
      >
        <div id={this.props.name} className="editor readonly">
          <Editor
            spellCheck
            placeholder=''
            ref={this.ref}
            value={value}
            name={this.props.name}
            key={this.props.name}
            readOnly={true}
            decorateNode={this.props.decorateNode}
            renderDecoration={this.props.renderDecoration}
          />
        </div>
      </div>
    );
  }
}

export default ReadOnlyTextEditor;
