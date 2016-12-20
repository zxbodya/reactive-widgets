import { Observable } from 'rxjs';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';

import ReactDOMServer from 'react-dom/server';
import di from 'di1';

import { combineLatestObj } from 'rx-react-container/lib/combineLatestObj';
import registry from '../registry';
import rxComponentErrorHandler from '../utils/rxComponentErrorHandler';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const appInjector = new di.Injector();
appInjector.provide(require('../apiUrl'), () => 'http://127.0.0.1:3000');


app.get('/data', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  res.json([
    { name: 'item 1' },
    { name: 'item 2' },
    { name: 'item 3' },
    { name: 'item 4' },
    { name: 'item 5' },
  ]);
});

app.post('/render', (req, res) => {
  const injector = appInjector.createChild();

  const bootstrapData = req.body || {};
  const results = {};

  Object.keys(bootstrapData).forEach(id => {
    const { component: componentName, params } = bootstrapData[id];
    if (componentName in registry) {
      results[id] = Observable
        .of(registry[componentName])
        .map(token => injector.get(token))
        .switchMap(component => component(params))
        .first()
        .map(renderFn => renderFn())
        .catch(e =>
          rxComponentErrorHandler(e)
            .map(renderFn => renderFn())
        )
        .map(virtualDOM => ReactDOMServer.renderToString(virtualDOM));
    } else {
      results[id] = Observable.of('Error: Component not found in registry');
    }
  });

  combineLatestObj(results)
    .first()
    .subscribe(
      renderedResults => res.json(renderedResults),

      error => {
        console.log(error);
        res.status(500).json({
          error: 'Rendering error',
          message: error.message,
          stack: error.stack,
        });
      }
    );
});

export default app;
