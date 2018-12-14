import React, { cloneElement, Children, Component, Fragment } from 'react';
import mapKeys from 'lodash/mapKeys';
import { Button } from '@ukhomeoffice/react-components';

const Item = ({ children, title, ...props }) => {
  console.log(props)
  return <Fragment>
    <h2>{title}</h2>
    {
      Children.map(children, child => cloneElement(child, { ...props }))
    }
  </Fragment>
};

class Repeater extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items || []
    }
    this.addItem = this.addItem.bind(this);
    if (!this.state.items.length) {
      this.addItem(mapKeys(this.props.fields, () => null))
    }
    // this.removeItem = this.removeItem.bind(this);
  }

  addItem(item) {
    const { items } = this.state;
    this.setState({
      items: [
        ...items,
        item
      ]
    })
  }

  render() {
    return <div className="govuk-inset-text">
      {
        this.state.items.map((item, index) =>
          <Fragment key={index}>
            { index > 0 && <hr /> }
            <Item
              item={index}
              fields={this.props.fields}
              values={item}
              title={`${this.props.title} ${index + 1}`}
              children={this.props.children} />
          </Fragment>
        )
      }
      <Button onClick={this.addItem}>Add another</Button>
    </div>;
  }
}

export default Repeater;
