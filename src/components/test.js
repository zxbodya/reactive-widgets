'use strict';

const di = require('../di');
const RxComponent = require('../utils/RxComponent');

const Test = require('../views/Test');

module.exports = di.annotate(
  (boostrap)=> {
    var helloWorld = boostrap.pluck('test');
    return new RxComponent(Test, {name: helloWorld.pluck('name')});
  },
  require('../stores/bootstrap')
);
