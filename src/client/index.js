import { Observable } from 'rxjs';
import ReactDOM from 'react-dom';
import di from 'di1';

import rxComponentErrorHandler from '../utils/rxComponentErrorHandler';
import registry from '../registry';

const injector = new di.Injector();

const bootstrapData = window.bootstrapData || {};

Object.keys(bootstrapData)
  .forEach(elementId => {
    const { component: componentName, params } = bootstrapData[elementId];

    const element = document.getElementById(elementId);
    if (element) {
      if (componentName in registry) {
        Observable
          .of(registry[componentName])
          .map(token => injector.get(token))
          .switchMap(component => component(params))
          .map(renderFn => renderFn())
          .catch(e =>
            rxComponentErrorHandler(e)
              .map(renderFn => renderFn())
          )
          .subscribe(virtualDOM => {
            ReactDOM.render(virtualDOM, element);
          });
      }
    }
  });
