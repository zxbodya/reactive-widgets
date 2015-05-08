'use strict';

const Rx = require('rx');
const React = require('react');

const di = require('./../di');
const injector = new di.Injector();

const registry = require('../registry');

var bootstrapData = window.bootstrapData || {};

Object.keys(bootstrapData)
  .forEach(elementId=> {
    let {component, params} = bootstrapData[elementId];

    let element = document.getElementById(elementId);
    if (element) {
      injector
        .get(registry[component])(params)
        .distinctUntilChanged()
        .subscribe(reactElement=> {
          React.render(reactElement, element);
        });
    }
  });
