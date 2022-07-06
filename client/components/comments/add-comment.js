import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { addComment } from '../../actions/comments';
import { keepAlive } from '../../actions/session';
import { Button, TextArea } from '@ukhomeoffice/react-components'

class AddComment extends Component {
  _isMounted = false;

  state = {
    comment: '',
    adding: false,
    saving: false
  };

  onChange = e => {
    this.props.keepAlive();
    this.setState({
      comment: e.target.value
    })
  }

  onSubmit = () => {
    if (!this.state.comment) {
      return;
    }
    this.setState({ saving: true });
    this.props.addComment({
      field: this.props.field,
      comment: this.state.comment
    })
      .then(() => {
        if (this._isMounted) {
          this.setState({ comment: '', adding: false, saving: false });
        }
      });
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  toggleAdding = () => {
    this.props.keepAlive();
    this.setState({ adding: !this.state.adding });
  }

  clear = () => {
    this.setState({ comment: '', adding: false });
  }

  render() {
    const { comment, adding, saving } = this.state;
    return adding
      ? (
        <Fragment>
          <TextArea
            label="Add new comment"
            value={comment}
            onChange={this.onChange}
            autoExpand={true}
            name="add-new-comment"
            autoFocus
          />
          <p className="control-panel">
            <Button onClick={this.onSubmit} disabled={saving}>Save</Button>
            <Button className="link" onClick={this.clear}>Discard</Button>
          </p>
        </Fragment>
      )
      : <Button className="button-secondary" onClick={this.toggleAdding}>Add comment</Button>
  }
}

export default connect(null, { addComment, keepAlive })(AddComment);
