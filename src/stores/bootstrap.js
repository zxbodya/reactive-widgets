'use strict';

const di = require('./../di');
const Rx = require('rx');

module.exports = di.annotate(()=> {
  return Rx.Observable.return(window.bootstrapData || {});
});
