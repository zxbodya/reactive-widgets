import di from 'di1';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/observable/defer';

import axios from 'axios';

import apiUrlToken from '../../apiUrl';

export default di.annotate(
  apiUrl => {
    const load = () => Observable
      .defer(() => axios
        .get(`${apiUrl}/data`)
        .then(r => r.data)
      );
    return load().publishReplay(1).refCount();
  },
  apiUrlToken
);
