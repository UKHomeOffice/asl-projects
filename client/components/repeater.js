import React, { Component, Fragment } from 'react';
import { Button } from '@ukhomeoffice/react-components';

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
  }

  componentDidMount() {
    if (this.props.addOnInit && !this.state.items.length) {
      this.addItem();
    }
  }

  addItem() {
    const { items } = this.state;
    this.update([ ...items, {} ]);
  }

  updateItem(index, updated) {
    this.update(this.state.items.map((item, i) => index === i
      ? { ...item, ...updated }
      : item
    ))
  }

  removeItem(index) {
    const { items } = this.state;
    this.update(items.filter((item, i) => index !== i));
  }

  update(items) {
    this.setState({ items }, this.save);
  }

  save() {
    this.props.onSave(this.state.items);
  }

  render() {
    return (
      <Fragment>
        {
          this.state.items.map((item, index) =>
            React.Children.map(this.props.children, child => {
              const updateItem = (child.updateItem || this.updateItem).bind(this, index);
              return React.cloneElement(child, {
                index,
                updateItem,
                removeItem: () => this.removeItem(index),
                values: item
              })
            })
          )
        }
        <Button className="block" onClick={this.addItem}>{`Add ${this.state.items.length ? 'another' : 'item'}`}</Button>
      </Fragment>
    );
  }
}

Repeater.defaultProps = {
  addOnInit: false
};

export default Repeater;
