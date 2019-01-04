import React from 'react';

class Review extends React.Component {

  replay() {
    if (this.props.type === 'checkbox') {
      const value = this.props.value || [];
      if (!value.length) {
        return <p><em>None selected</em></p>;
      }
      return <ul>
        {
          value.map(value => <li key={ value }>{ value }</li>)
        }
      </ul>;
    }
    if (this.props.value) {
      return <p>{ this.props.value }</p>;
    }
    return <p><em>No answer provided</em></p>;
  }

  render() {
    return <div className="review">
      <h3>{ this.props.label }</h3>
      { this.replay() }
      <p><a onClick={ e => this.props.onEdit(e) } href={`#${this.props.name}`} >Edit</a></p>
      <hr />
    </div>;
  }

}

export default Review;
