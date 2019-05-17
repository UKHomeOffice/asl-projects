import React from 'react';
import { Editor } from 'slate-react';
import RTEditor from './editor';

class ReviewTextEditor extends RTEditor {
  render() {
    return (
      <div className='editor readonly'>
        <Editor
          value={this.state.value}
          renderMark={this.renderMark}
          renderBlock={this.renderNode}
          readOnly
        />
      </div>
    );
  }
}

export default ReviewTextEditor;
