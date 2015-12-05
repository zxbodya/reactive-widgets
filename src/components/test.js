import di from 'di1';
import RxContainer from 'rx-react-container';

import Test from '../views/Test';

export default di.annotate(
  (data)=>
    (params)=> {
      return new RxContainer(Test, {list: data}, {}, {name: params.name});
    },
  require('../stores/data')
);
