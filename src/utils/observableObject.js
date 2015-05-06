'use strict';

const {Observable} = require('rx');

function observableObject(observables) {
  const keys = Object.keys(observables);

  if (keys.length === 0) {
    return Observable.return({});
  }

  const valueObservables = new Array(keys.length);
  for (let i = 0, l = keys.length; i < l; i++) {
    valueObservables[i] = observables[keys[i]];
  }

  return Observable.combineLatest(valueObservables, (...values)=> {
    let res = {};
    for (let i = 0, l = keys.length; i < l; i++) {
      res[keys[i]] = values[i];
    }
    return res;
  });
}

module.exports = observableObject;