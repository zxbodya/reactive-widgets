'use strict';

const React = require('react');
const Rx = require('rx');
const {Observable} = Rx;

module.exports = (error)=>
  Observable.return(
    <div>
      <p>{error.message}</p>
      <pre>{error.stack}</pre>
    </div>
  );
