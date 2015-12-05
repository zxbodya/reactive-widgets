import di from 'di1';
import createContainer from 'rx-react-container';

import Test from '../views/Test';

export default di.annotate(
  (data)=>
    (params)=> {
      return createContainer(Test, {list: data}, {}, {name: params.name});
    },
  require('../stores/data')
);
