/* eslint camelcase: ["error", {allow: ["^UNSAFE_"]}] */
import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Button } from '@ukhomeoffice/react-components';
import { v4 as uuid } from 'uuid';
import cloneDeep from 'lodash/cloneDeep';
import omitBy from 'lodash/omitBy';
import isUndefined from 'lodash/isUndefined';
import { throwError } from '../actions/messages';

class Repeater extends Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.restoreItem = this.restoreItem.bind(this);
    this.duplicateItem = this.duplicateItem.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.update = this.update.bind(this);
    this.save = this.save.bind(this);
    this.state = {
      items: this.props.items || []
    };
  }

  UNSAFE_componentWillReceiveProps({ items }) {
    if (items) {
      this.setState({ items });
    }
  }

  componentDidMount() {
    if (this.props.addOnInit && !this.state.items.length) {
      this.addItem();
    }
  }

  addItem() {
    return Promise.resolve()
      .then(this.props.onBeforeAdd)
      .then(() => this.update([ ...this.state.items, { id: uuid(), ...this.props.itemProps } ]))
      .then(this.props.onAfterAdd)
      .catch(err => this.props.throwError(err.message || 'Error adding item'));
  }

  updateItem(index, updated) {
    this.update(this.state.items.map((item, i) => index === i
      ? omitBy({ ...item, ...updated }, isUndefined)
      : item
    ));
  }

  duplicateItem(index, event) {
    if (event) {
      event.preventDefault();
    }
    const items = cloneDeep(this.state.items);
    const item = cloneDeep(items[index]);

    function updateIds(obj) {
      if (obj.id) {
        obj.id = uuid();
      }
      Object.values(obj).forEach(val => {
        if (Array.isArray(val)) {
          val.forEach(updateIds);
        }
      });
    }

    updateIds(item);

    items.splice(index + 1, 0, item);
    return Promise.resolve()
      .then(() => this.props.onBeforeDuplicate(items, item.id))
      .then(items => this.update(items))
      .then(() => this.props.onAfterDuplicate(item, item.id))
      .catch(err => this.props.throwError(err.message || 'Error duplicating item'));
  }

  removeItem(index, event) {
    if (event) {
      event.preventDefault();
    }
    return Promise.resolve()
      .then(this.props.onBeforeRemove)
      .then(() => {
        // mark record deleted, second check is to
        // ensure that reusable step which was used to create reusable step in a protocol is not deleted, when deleting an instance of reusable step.
        if (this.props.softDelete && !this.state.items[index].reusable) {
          return this.update(this.state.items.map((item, i) => {
            if (index === i) {
              return { ...item, deleted: true };
            }
            return item;
          }));
        }
        this.update(this.state.items.filter((item, i) => index !== i));
      })
      .then(this.props.onAfterRemove)
      .catch(err => this.props.throwError(err.message || 'Error removing item'));
  }

  restoreItem(index, event) {
    if (event) {
      event.preventDefault();
    }
    return Promise.resolve()
      .then(this.props.onBeforeRestore)
      .then(() => this.update(this.state.items.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            deleted: false
          };
        }
        return item;
      })))
      .then(this.props.onAfterRestore)
      .catch(err => this.props.throwError(err.message || 'Error restoring item'));
  }

  update(items) {
    return new Promise(resolve => this.setState({ items }, resolve))
      .then(this.save)
      .catch(err => this.props.throwError(err.message || 'Error updating item'));
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
    const addButton = <Button className={classnames('block', 'add-another', this.props.addAnotherClassName || 'button-secondary')} onClick={this.addItem}>{this.props.addAnotherLabel || `Add another ${this.props.singular}`}</Button>;
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
                key: item.id,
                updateItem,
                removeItem: e => this.removeItem(index, e),
                restoreItem: e => this.restoreItem(index, e),
                duplicateItem: e => this.duplicateItem(index, e),
                moveUp: () => this.moveUp(index),
                moveDown: () => this.moveDown(index),
                values: item,
                prefix: `${this.props.prefix || ''}${this.props.type}.${item.id}.`,
                length: this.state.items.length,
                expanded: this.props.expanded && this.props.expanded[index],
                // get index ignoring previous deleted items
                number: index - (this.state.items.slice(0, index).filter(i => i.deleted) || []).length
              });
            })
          )
        }
        {
          (!this.props.addButtonBefore || this.props.addButtonAfter) && this.props.addAnother && addButton
        }
      </Fragment>
    );
  }
}

Repeater.defaultProps = {
  type: 'item',
  singular: 'item',
  addOnInit: true,
  addAnother: true,
  softDelete: false,
  itemProps: {},
  onBeforeAdd: () => Promise.resolve(),
  onAfterAdd: () => Promise.resolve(),
  onBeforeRemove: () => Promise.resolve(),
  onAfterRemove: () => Promise.resolve(),
  onBeforeDuplicate: items => Promise.resolve(items),
  onAfterDuplicate: item => Promise.resolve(item)
};

export default connect(null, { throwError })(Repeater);
