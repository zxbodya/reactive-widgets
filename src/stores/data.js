'use strict';

const di = require('./../di');
const Rx = require('rx');
const {Observable} = Rx;

const superagent = require('superagent');
const promiseFromSuperAgent = require('../utils/promiseFromSuperAgent');
const apiUrl = require('../apiUrl');

module.exports = di.annotate(()=> {
  const load = ()=> promiseFromSuperAgent(
    superagent
      .get(apiUrl + '/data')
  ).then(res=>res.body);

  return Observable.defer(load).shareReplay();
});
