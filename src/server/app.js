'use strict';

const Rx = require('rx');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const React = require('react');
const di = require('./../di');

const appInjector = new di.Injector();

appInjector.provide(require('../apiUrl'), ()=> {
  return 'http://127.0.0.1:3000';
});

const observableObject = require('./../utils/observableObject');
const registry = require('../registry');

app.get('/data', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  res.json([
    {name: 'item 1'},
    {name: 'item 2'},
    {name: 'item 3'},
    {name: 'item 4'},
    {name: 'item 5'},
    {name: 'item 6'},
    {name: 'item 7'},
    {name: 'item 8'},
    {name: 'item 9'},
    {name: 'item 10'}
  ]);
});

app.post('/render', function (req, res) {
  const injector = appInjector.createChild();

  const bootstrapData = req.body || {};
  const results = {};

  Object.keys(bootstrapData).forEach(id=> {
    let {component, params} = bootstrapData[id];
    results[id] = injector
      .get(registry[component])(params)
      .first()
      .map(reactElement=>React.renderToString(reactElement));
  });

  observableObject(results)
    .first()
    .subscribe(
      renderedResults=>res.json(renderedResults),

      error=> {
      console.log(error);
      res.status(500).json({
        error: 'Rendering error',
        message: error.message,
        stack: error.stack
      });
    }
  );
});

module.exports = app;
