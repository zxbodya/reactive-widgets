import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Test extends Component {
  render() {
    const items = this.props.list.map((item) => (
      <li key={item.name}>{item.name}</li>
    ));
    return (
      <div>
        <h1>Hello {this.props.name}</h1>
        <ul>{items}</ul>
      </div>
    );
  }
}

Test.propTypes = {
  name: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
};

export default Test;
