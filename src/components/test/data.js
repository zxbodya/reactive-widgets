import di from 'di1';
import { Observable } from 'rx';

import superagent from 'superagent';

import apiUrlToken from '../../apiUrl';

export default di.annotate(
  apiUrl => {
    const load = () => Observable.defer(() => {
      const req = superagent.get(`${apiUrl}/data`);
      return Observable.fromNodeCallback(req.end, req, res => res.body)();
    });

    return load().shareReplay(1);
  },
  apiUrlToken
);
