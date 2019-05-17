import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Value, Mark } from 'slate';
import { Editor } from 'slate-react';

import { diffChars } from 'diff';

import { TextEditor, ReviewTextEditor } from '../components/editor';


const initialValue = JSON.stringify({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim placerat posuere. Proin volutpat et leo ut condimentum. Maecenas blandit in eros quis congue. Maecenas pretium erat ipsum, eget egestas arcu efficitur id. Donec rhoncus pulvinar ipsum sit amet rhoncus. Cras dui massa, bibendum sed vulputate eu, malesuada ac neque. Quisque quis leo lectus. Quisque ac lectus fringilla, facilisis sapien nec, lacinia sapien. Aliquam cursus est ac posuere tempus. Sed dictum leo vitae consequat commodo. Morbi nec augue at tellus pharetra vulputate. Aenean convallis tristique metus ut porta. Vivamus eu faucibus sapien, vitae dignissim tellus. Pellentesque ipsum enim, mattis id tempor sed, luctus vitae lacus.'
          }
        ]
      },
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            text: 'Duis semper pellentesque quam id molestie. Suspendisse interdum tellus sed ante vulputate, sit amet tincidunt elit gravida. Nullam leo orci, molestie vitae accumsan nec, maximus non massa. Vestibulum maximus faucibus nisi eget tincidunt. Nunc lacus lacus, fermentum sed scelerisque in, vestibulum id tellus. Aenean commodo nisi quis pulvinar faucibus. Nunc a ultricies nibh. Etiam dapibus, orci quis mattis convallis, felis dolor egestas nulla, at ornare leo neque non ex. Donec tellus dolor, accumsan sed ligula id, commodo placerat nunc. Integer cursus faucibus justo, vitae dapibus mi sollicitudin eu. Morbi pellentesque auctor felis et sollicitudin. Etiam libero ex, feugiat vel nisi sed, finibus auctor leo.'
          }
        ]
      }
    ]
  }
})

class Diff extends ReviewTextEditor {

  isEqual(a, b) {
    return a.type === b.type && a.text.text === b.text.text;
  }

  getTextNodes(node) {
    const texts = [];
    for (const txt of node.texts()) {
      const [text, path] = txt;
      texts.push({ text, path, type: text.type });
    }
    return texts;
  }

  diff(node) {
    const before = Value.fromJSON(JSON.parse(this.props.before || initialValue));

    return diffChars(before.document.text, node.text)
      .filter(d => !d.removed)
      .reduce((arr, d, i) => {
        if (i > 0) {
          const start = arr[i - 1].start + arr[i - 1].count;
          return [...arr, { ...d, start }];
        }
        return [{ ...d, start: 0 }];
      }, [])
      .filter(d => d.added);
  }

  decorateNode(node, editor, next) {

    if (!node.type) {
      const diff = this.diff(node);
      let start = 0;

      const getDiffs = text => {
        const length = text.text.length;
        return diff.filter(d => {
          const end = d.start + d.count;
          return (d.start >= start && d.start < start + length) || (end > start && end <= start + length);
        });
      };

      const decorations = [];

      for (const txt of node.texts()) {
        const [text, path] = txt;
        const localDiffs = getDiffs(text);
        localDiffs.forEach(d => {
          decorations.push({
            type: 'diff',
            anchor: {
              path,
              key: text.key,
              offset: d.start - start
            },
            focus: {
              path,
              key: text.key,
              offset: d.start - start + d.count
            }
          });
        });

        start += text.text.length;
      }

      return decorations;

    }



  }

  renderDecoration(props, editor, next) {
    const { children, decoration, attributes } = props;
    if (decoration.type === 'diff') {
      return <span className="diff" {...attributes}>{ children }</span>;
    }
    return next();
  }

  render() {
    const value = Value.fromJSON(JSON.parse(this.props.after || initialValue));
    return (
      <div className='editor readonly'>
        <Editor
          value={value}
          renderMark={this.renderMark}
          renderBlock={this.renderNode}
          renderDecoration={this.renderDecoration}
          decorateNode={this.decorateNode.bind(this)}
          readOnly
        />
      </div>
    );
  }

}

class Index extends React.Component {

  render () {
    return <Fragment>
      <h1>Diff spike</h1>
      <TextEditor value={initialValue} onSave={value => this.setState({ before: value })}/>
      <TextEditor value={initialValue} onSave={value => this.setState({ after: value })}/>
      <Diff before={this.state && this.state.before} after={this.state && this.state.after} />
    </Fragment>
  }

}

export default Index;
