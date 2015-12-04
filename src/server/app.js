import Rx from 'rx';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import di from 'di1';

const appInjector = new di.Injector();

appInjector.provide(require('../apiUrl'), ()=> {
  return 'http://127.0.0.1:3000';
});

import observableObject from './../utils/observableObject';
import registry from '../registry';
import rxComponentErrorHandler from '../utils/rxComponentErrorHandler';

app.get('/data', function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  res.json([
    {name: 'item 1'},
    {name: 'item 2'},
    {name: 'item 3'},
    {name: 'item 4'},
    {name: 'item 5'}
  ]);
});

app.post('/render', function (req, res) {
  const injector = appInjector.createChild();

  const bootstrapData = req.body || {};
  const results = {};

  Object.keys(bootstrapData).forEach(id=> {
    let {component, params} = bootstrapData[id];
    if (component in registry) {
      results[id] = Rx.Observable
        .return(registry[component])
        .map(token=>injector.get(token))
        .flatMapLatest(component=>component(params))
        .first()
        .catch(rxComponentErrorHandler)
        .map(ReactComponent=>ReactDOMServer.renderToString(<ReactComponent/>))
        .catch((e)=>rxComponentErrorHandler(e)
          .map(ReactComponent=>ReactDOMServer.renderToString(<ReactComponent/>)));
    } else {
      results[id] = Rx.Observable.return('Error: Component not found in registry');
    }
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

export default app;
