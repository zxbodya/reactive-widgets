'use strict';

const React = require('react');
const {Component, PropTypes} = React;

class Test extends Component {
  render() {
    return (
      <span>Hello {this.props.name}</span>
    );
  }
}

Test.propTypes = {
  name: PropTypes.string.isRequired
};

module.exports = Test;
