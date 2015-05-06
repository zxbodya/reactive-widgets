'use strict';

const React = require('react');

const di = require('./../di');
const injector = new di.Injector();

const registry = require('../registry');

Object.keys(registry).forEach(elementId=> {
  let element = document.getElementById(elementId);
  if (element) {
    injector
      .get(registry[elementId])
      .distinctUntilChanged()
      .subscribe(reactElement=> {
        React.render(reactElement, element);
      });
  }
});
