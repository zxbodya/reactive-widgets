'use strict';

const di = require('../di');
const RxComponent = require('../utils/RxComponent');

const Test = require('../views/Test');

module.exports = di.annotate(
  (data)=>
    (params)=> {
      return new RxComponent(Test, {list: data}, {}, {name: params.name});
    },
  require('../stores/data')
);
