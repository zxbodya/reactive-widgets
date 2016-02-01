import Rx from 'rx';
import ReactDOM from 'react-dom';

import di from 'di1';
const injector = new di.Injector();

import rxComponentErrorHandler from '../utils/rxComponentErrorHandler';

import registry from '../registry';

const bootstrapData = window.bootstrapData || {};

Object.keys(bootstrapData)
  .forEach(elementId=> {
    const {component: componentName, params} = bootstrapData[elementId];

    const element = document.getElementById(elementId);
    if (element) {
      if (componentName in registry) {
        Rx.Observable
          .return(registry[componentName])
          .map(token=>injector.get(token))
          .flatMapLatest(component=>component(params))
          .catch(rxComponentErrorHandler)
          .subscribe(renderFn=> {
            ReactDOM.render(renderFn(), element);
          });
      }
    }
  });
