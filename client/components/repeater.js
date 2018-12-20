import React, { Component, Fragment } from 'react';
import { Button } from '@ukhomeoffice/react-components';
import noop from 'lodash/noop';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Repeater extends Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.update = this.update.bind(this);
    this.save = this.save.bind(this);
    this.state = {
      items: this.props.items || []
    }
    console.log('items', this.state.items)
  }

  componentDidMount() {
    if (this.props.addOnInit && !this.state.items.length) {
      this.addItem();
    }
  }

  addItem() {
    return Promise.resolve()
      .then(this.props.onBeforeAdd)
      .then(() => this.update([ ...this.state.items, {} ]))
      .then(this.props.onAfterAdd)
      .catch(err => console.log(err));
  }

  updateItem(index, updated) {
    this.update(this.state.items.map((item, i) => index === i
      ? { ...item, ...updated }
      : item
    ))
  }

  removeItem(index) {
    return Promise.resolve()
      .then(this.props.onBeforeRemove)
      .then(() => this.update(this.state.items.filter((item, i) => index !== i)))
      .then(this.props.onAfterRemove)
      .catch(err => console.log(err));
  }

  update(items) {
    return new Promise(resolve => {
      this.setState({ items }, resolve)
    })
      .then(this.save);
  }

  save() {
    this.props.onSave(this.state.items);
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="added"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
        >
        {
          this.state.items.map((item, index) =>
            React.Children.map(this.props.children, child => {
              const updateItem = (child.updateItem || this.updateItem).bind(this, index);
              return React.cloneElement(child, {
                ...child.props,
                index,
                updateItem,
                active: this.state.items.length === index + 1,
                removeItem: () => this.removeItem(index),
                values: item
              })
            })
          )
        }
        <Button className="block" onClick={this.addItem}>{`Add ${this.state.items.length ? 'another' : 'item'}`}</Button>
      </ReactCSSTransitionGroup>
    );
  }
}

Repeater.defaultProps = {
  addOnInit: false,
  onBeforeAdd: () => Promise.resolve(),
  onAfterAdd: () => Promise.resolve(),
  onBeforeRemove: () => Promise.resolve(),
  onAfterRemove: () => Promise.resolve()
};

export default Repeater;
