import React, { Component } from 'react';
import classnames from 'classnames';

class ExpandingPanel extends Component {

  componentDidMount() {
    this.setState({ open: false });
  }

  controlled() {
    return typeof this.props.open === 'boolean';
  }

  toggle () {
    if (this.controlled()) {
      return this.props.onToggle();
    }
    return this.setState({ open: !this.state.open });
  }

  isOpen() {
    if (this.controlled()) {
      return this.props.open;
    }
    return !this.state || this.state.open;
  }

  render() {
    return (
      <section className={classnames('expanding-panel', { open: this.isOpen() }, this.props.className)}>
        <header onClick={() => this.toggle()}>
          <h3>{ this.props.title }</h3>
        </header>
        <div className={classnames('content', { hidden: !this.isOpen() })}>
          {
            React.Children.map(this.props.children, child => React.cloneElement(child, this.props))
          }
        </div>
      </section>
    );
  }
}

export default ExpandingPanel;
