import React, { Fragment, useState, useEffect } from 'react';
import classnames from 'classnames';
import { useDispatch } from 'react-redux';
import { Button } from '@ukhomeoffice/react-components';
import { v4 as uuid } from 'uuid';
import cloneDeep from 'lodash/cloneDeep';
import { throwError } from '../actions/messages';

/*
class RepeaterOld extends Component {


  UNSAFE_componentWillReceiveProps({ items }) {
    if (items) {
      this.setState({ items })
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
      ? { ...item, ...updated }
      : item
    ))
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
        if (this.props.softDelete) {
          return this.update(this.state.items.map((item, i) => {
            if (index === i) {
              return { ...item, deleted: true };
            }
            return item;
          }))
        }
        this.update(this.state.items.filter((item, i) => index !== i))
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
          }
        }
        return item;
      })))
      .then(this.props.onAfterRestore)
      .catch(err => this.props.throwError(err.message || 'Error restoring item'));
  }

  update(items) {
    return new Promise(resolve => this.setState({ items }, resolve))
      .then(this.save)
      .catch(err => this.props.throwError(err.message || 'Error updating item'))
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
    const addButton = <Button className={classnames('block', 'add-another', this.props.addAnotherClassName || 'button-secondary')} onClick={this.addItem}>{this.props.addAnotherLabel || `Add another ${this.props.singular}`}</Button>
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
              })
            })
          )
        }
        {
          (!this.props.addButtonBefore || this.props.addButtonAfter) && this.props.addAnother && addButton
        }
      </Fragment>
    );
  }
}*/

const Repeater = ({
  items = [],
  children,
  type = 'item',
  singular = 'item',
  prefix,
  onSave,
  expanded,
  addOnInit = true,
  addAnother = true,
  addButtonBefore = false,
  addButtonAfter = true,
  softDelete = false,
  itemProps = {},
  addAnotherLabel,
  addAnotherClassName = 'button-secondary',
  onBeforeAdd = () => Promise.resolve(),
  onAfterAdd = () => Promise.resolve(),
  onBeforeRemove = () => Promise.resolve(),
  onAfterRemove = () => Promise.resolve(),
  onBeforeRestore = () => Promise.resolve(),
  onAfterRestore = () => Promise.resolve(),
  onBeforeDuplicate = items => Promise.resolve(items),
  onAfterDuplicate = item => Promise.resolve(item)
}) => {
  console.log(expanded);
  const [_items, setItems] = useState(items);
  const dispatch = useDispatch();
  useEffect(() => {
    if (addOnInit && items.length === 0) {
      addItem();
    }
  }, []);

  useEffect(() => onSave(_items), [_items]);

  const addItem = () => {
    return Promise.resolve()
      .then(onBeforeAdd)
      .then(() => update([ ..._items, { id: uuid(), ...itemProps } ]))
      .then(onAfterAdd)
      .catch(err => dispatch(throwError(err.message || 'Error adding item')));
  };

  const updateItem = (index, updated) => {
    update(_items.map((item, i) => index === i
      ? { ...item, ...updated }
      : item
    ))
  };

  const duplicateItem = (index, event) => {
    if (event) {
      event.preventDefault();
    }

    const items = cloneDeep(_items);
    const item = cloneDeep(_items[index]);

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
      .then(() => onBeforeDuplicate(items, item.id))
      .then(_items => update(_items))
      .then(() => onAfterDuplicate(item, item.id))
      .catch(err => dispatch(throwError(err.message || 'Error duplicating item')));
  };

  const removeItem = (index, event) => {
    if (event) {
      event.preventDefault();
    }
    return Promise.resolve()
      .then(onBeforeRemove)
      .then(() => {
        if (softDelete) {
          return update(_items.map((item, i) => {
            if (index === i) {
              return { ...item, deleted: true };
            }
            return item;
          }))
        }
        update(_items.filter((item, i) => index !== i))
      })
      .then(onAfterRemove)
      .catch(err => dispatch(throwError(err.message || 'Error removing item')));
  };

  const restoreItem = (index, event) => {
    if (event) {
      event.preventDefault();
    }
    return Promise.resolve()
      .then(onBeforeRestore)
      .then(() => update(_items.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            deleted: false
          }
        }
        return item;
      })))
      .then(onAfterRestore)
      .catch(err => dispatch(throwError(err.message || 'Error restoring item')));
  };

  const update = (items) => {
    return Promise.resolve()
      .then(() => {
        return setItems(items);
      })
      .catch(err => dispatch(throwError(err.message || 'Error updating item')));
  };

  const moveUp = (index) => {
    if (index > 0) {
      const item = _items[index];
      const swap = _items[index - 1];
      _items[index] = swap;
      _items[index - 1] = item;
      update(_items.map(item => ({...item})));
    }
  };

  const moveDown = (index) => {
    if (index + 1 < _items.length) {
      const item = _items[index];
      const swap = _items[index + 1];
      _items[index] = swap;
      _items[index + 1] = item;
      update(_items.map(item => ({...item})));
    }
  };

  addAnotherLabel = addAnotherLabel || `Add another ${singular}`;

  const addButton = <Button className={classnames('block', 'add-another', addAnotherClassName)} onClick={addItem}>{addAnotherLabel}</Button>
  return (
    <Fragment>
      {
        addButtonBefore && addAnother && addButton
      }
      {
        _items.map((item, index) =>
          React.Children.map(children, child => {
            return React.cloneElement(child, {
              ...child.props,
              index,
              key: item.id,
              updateItem: props => (child.updateItem || updateItem)(index, props),
              removeItem: e => removeItem(index, e),
              restoreItem: e => restoreItem(index, e),
              duplicateItem: e => duplicateItem(index, e),
              moveUp: () => moveUp(index),
              moveDown: () => moveDown(index),
              values: item,
              prefix: `${prefix || ''}${type}.${item.id}.`,
              length: _items.length,
              expanded: expanded && expanded[index],
              // get index ignoring previous deleted items
              number: index - (_items.slice(0, index).filter(i => i.deleted) || []).length
            })
          })
        )
      }
      {
        (!addButtonBefore || addButtonAfter) && addAnother && addButton
      }
    </Fragment>
  );
};

export default Repeater;
