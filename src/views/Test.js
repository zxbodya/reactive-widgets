'use strict';

const React = require('react');
const {Component, PropTypes} = React;

class Test extends Component {
  render() {
    let items = this.props.list.map((item, i)=>(
      <li key={i}>{item.name}</li>
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
  list: PropTypes.array.isRequired
};

module.exports = Test;
