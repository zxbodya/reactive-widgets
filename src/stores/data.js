'use strict';

const di = require('./../di');
const Rx = require('rx');
const {Observable} = Rx;

const superagent = require('superagent');
const promiseFromSuperAgent = require('../utils/promiseFromSuperAgent');

module.exports = di.annotate(
  (apiUrl)=> {
    const load = ()=> promiseFromSuperAgent(
      superagent
        .get(apiUrl + '/data')
    ).then(res=>res.body);

    return Observable.defer(load).shareReplay();
  },
  require('../apiUrl')
);
