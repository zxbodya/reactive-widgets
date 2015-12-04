import di from 'di1';
import RxComponent from '../utils/RxComponent';

import Test from '../views/Test';

export default di.annotate(
  (data)=>
    (params)=> {
      return new RxComponent(Test, {list: data}, {}, {name: params.name});
    },
  require('../stores/data')
);
