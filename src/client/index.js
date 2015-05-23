'use strict';

const Rx = require('rx');
const React = require('react');

const di = require('./../di');
const injector = new di.Injector();

const rxComponentErrorHandler = require('../utils/rxComponentErrorHandler');

const registry = require('../registry');
const bootstrapData = window.bootstrapData || {};

Object.keys(bootstrapData)
  .forEach(elementId=> {
    let {component, params} = bootstrapData[elementId];

    let element = document.getElementById(elementId);
    if (element) {
      if (component in registry) {
        Rx.Observable
          .return(registry[component])
          .map(token=>injector.get(token))
          .switchMap(component=>component(params))
          .distinctUntilChanged()
          .catch(rxComponentErrorHandler)
          .subscribe(ReactComponent=> {
            React.render(<ReactComponent/>, element);
          });
      }
    }
  });
