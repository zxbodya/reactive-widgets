import di from 'di1';
import { Observable } from 'rxjs';

import superagent from 'superagent';

import apiUrlToken from '../../apiUrl';

export default di.annotate(
  apiUrl => {
    const load = () => Observable.defer(() => {
      const req = superagent.get(`${apiUrl}/data`);
      return Observable.bindNodeCallback(req.end.bind(req), res => res.body)();
    });

    return load().publishReplay(1).refCount();
  },
  apiUrlToken
);
