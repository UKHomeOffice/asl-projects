import React, { Component, Fragment } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';

import Icon from 'react-icons-kit';
import { bold } from 'react-icons-kit/feather/bold';
import { italic } from 'react-icons-kit/feather/italic';
import { code } from 'react-icons-kit/feather/code';
import { list } from 'react-icons-kit/feather/list';
import { underline } from 'react-icons-kit/feather/underline';
// import { link2 } from 'react-icons-kit/feather/link2';

import { ic_title } from 'react-icons-kit/md/ic_title';
import { ic_format_quote } from 'react-icons-kit/md/ic_format_quote';
import { BoldMark, ItalicMark, FormatToolbar } from './index';

const initialValue = Value.fromJSON({
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
                text: 'My first paragraph'
              }
            ]
          }
        ]
      }
    ]
  }
});


export default class TextEditor extends Component {

  onKeyDown(e, change ) {
    console.log(e.key);
  };

  constructor() {
    super();
    this.state = { value: initialValue }
  }

  onChange({ value }) {
    this.setState({ value });
  };

  renderNode(props) {
		console.log('render node ', props.node);
		switch (props.node.type) {
			// case 'link': {
			// 	console.log(props.node.data.get('href'));
			// 	return (
			// 		<a href={props.node.data.get('href')} {...props.attributes}>
			// 			{props.children}
			// 		</a>
			// 	);
			// }

			default: {
				return;
			}
		}
	};

	renderMark(props){
		switch (props.mark.type) {
			case 'bold':
				return <BoldMark {...props} />;

			case 'italic':
				return <ItalicMark {...props} />;

			case 'code':
				return <code {...props.attributes}>{props.children}</code>;

			case 'list':
				return (
					<ul {...props.attributes}>
						<li>{props.children}</li>
					</ul>
				);

			case 'underline':
				return <u {...props.attributes}>{props.children}</u>;

			case 'quote':
				return <blockquote {...props.attributes}>{props.children}</blockquote>;

			case 'title':
				return <h1 {...props.attributes}>{props.children}</h1>;

			default: {
				return;
			}
		}
  };

  onMarkClick(e, type){
		/* disabling browser default behavior like page refresh, etc */
		e.preventDefault();

		/* grabbing the this.state.value */
		const { value } = this.state;

		/*
			applying the formatting on the selected text
			which the desired formatting
		*/
		const change = value.change().toggleMark(type);

		/* calling the  onChange method we declared */
		this.onChange(change);
	};

	renderMarkIcon(type, icon){
		return (<button
			onPointerDown={(e) => this.onMarkClick(e, type)}
			className="tooltip-icon-button"
		>
			<Icon icon={icon} />
		</button>);
	};

  // render() {
  //   return <Editor value={this.state.value} onChange={this.onChange.bind(this)} onKeyDown={this.onKeyDown.bind(this)} />;
  //   // return <Editor value={this.state.value} />;
  // }

  render() {
		return (
			<Fragment>
				<FormatToolbar>
					{this.renderMarkIcon('title', ic_title)}
					{this.renderMarkIcon('bold', bold)}
					{this.renderMarkIcon('italic', italic)}
					{this.renderMarkIcon('code', code)}
					{this.renderMarkIcon('list', list)}
					{this.renderMarkIcon('underline', underline)}
					{this.renderMarkIcon('quote', ic_format_quote)}
				</FormatToolbar>
				<Editor
					value={this.state.value}
					onChange={this.onChange.bind(this)}
					renderMark={this.renderMark.bind(this)}
					// renderNode={this.renderNode}
				/>
			</Fragment>
		);
	}
}
