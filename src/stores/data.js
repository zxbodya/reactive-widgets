import di from 'di1';
import {Observable} from 'rx';

import superagent from 'superagent';
import promiseFromSuperAgent from '../utils/promiseFromSuperAgent';

export default di.annotate(
  (apiUrl)=> {
    const load = ()=> promiseFromSuperAgent(
      superagent
        .get(apiUrl + '/data')
    ).then(res=>res.body);

    return Observable.defer(load).shareReplay();
  },
  require('../apiUrl')
);
