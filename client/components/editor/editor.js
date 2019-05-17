import React, { Component } from 'react';
import { Value } from 'slate';

class Editor extends Component {

  getInitialValue = () => Value.fromJSON({
    document: {
      nodes: [
        {
          object: 'block',
          type: 'paragraph',
          nodes: [
            {
              object: 'text',
              leaves: [
                {
                  text: ''
                }
              ]
            }
          ]
        }
      ]
    }
  })

  state = {
    value: this.props.value
      ? Value.fromJSON(JSON.parse(this.props.value))
      : this.getInitialValue(),
    focus: false
  };

  renderNode = (props, editor, next) => {
    const { attributes, children, node, isFocused } = props;
    switch (node.type) {
      case 'paragraph':
        return <p {...attributes}>{children}</p>;
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>;
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>;
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>;
      case 'image': {
        const src = node.data.get('src');
        return <img src={src} {...attributes} selected={isFocused} />;
      }
      default:
        return next();
    }
  };

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>;
      case 'code':
        return <code {...attributes}>{children}</code>;
      case 'italic':
        return <em {...attributes}>{children}</em>;
      case 'underlined':
        return <u {...attributes}>{children}</u>;
      case 'comment':
        return <span className="comment" {...attributes}>{children}</span>;
      default:
        return next();
    }
  };
}

export default Editor;
