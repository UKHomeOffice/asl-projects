import React, { Component, Fragment } from 'react';
import { Button } from '@ukhomeoffice/react-components';
import { v4 } from 'uuid';

class Repeater extends Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.update = this.update.bind(this);
    this.save = this.save.bind(this);
    this.state = {
      items: this.props.items || []
    }
  }

  componentWillReceiveProps({ items }) {
    if (items) {
      this.setState({ items })
    }
  }

  componentDidMount() {
    if (!this.props.initCollapsed && !this.state.items.length) {
      this.setState({ items: [{ id: v4() }] });
    }
  }

  addItem() {
    return Promise.resolve()
      .then(this.props.onBeforeAdd)
      .then(() => this.update([ ...this.state.items, { id: v4() } ]))
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

  moveUp(index) {
    if (index > 0) {
      const items = this.state.items;
      const item = items[index];
      const swap = items[index - 1];
      items[index] = swap;
      items[index - 1] = item;
      this.update(items);
    }
  }

  moveDown(index) {
    if (index + 1 < this.state.items.length) {
      const items = this.state.items;
      const item = items[index];
      const swap = items[index + 1];
      items[index] = swap;
      items[index + 1] = item;
      this.update(items);
    }
  }

  render() {
    const addButton = <Button className="block button-secondary" onClick={this.addItem}>{`Add another ${this.props.type}`}</Button>
    return (
      <Fragment>
        {
          this.props.addButtonBefore && this.props.addAnother && addButton
        }
        {
          this.state.items.map((item, index) =>
            React.Children.map(this.props.children, child => {
              const updateItem = (child.updateItem || this.updateItem).bind(this, index);
              return React.cloneElement(child, {
                ...child.props,
                index,
                updateItem,
                removeItem: () => this.removeItem(index),
                moveUp: () => this.moveUp(index),
                moveDown: () => this.moveDown(index),
                values: item,
                length: this.state.items.length,
                expanded: this.props.expanded && this.props.expanded[index]
              })
            })
          )
        }
        {
          !this.props.addButtonBefore && this.props.addAnother && addButton
        }
      </Fragment>
    );
  }
}

Repeater.defaultProps = {
  type: 'item',
  initCollapsed: false,
  addAnother: true,
  onBeforeAdd: () => Promise.resolve(),
  onAfterAdd: () => Promise.resolve(),
  onBeforeRemove: () => Promise.resolve(),
  onAfterRemove: () => Promise.resolve()
};

export default Repeater;
