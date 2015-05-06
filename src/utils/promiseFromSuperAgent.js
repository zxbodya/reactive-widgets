'use strict';
const promiseFromNodeCallback = require('./promiseFromNodeCallback');
module.exports = (request)=>
  promiseFromNodeCallback(request.end.bind(request));

