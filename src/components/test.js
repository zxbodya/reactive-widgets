import di from 'di1';
import createContainer from 'rx-react-container';

import Test from '../views/Test';

import dataToken from '../stores/data';

export default di.annotate(
  (data)=>
    (params)=> {
      return createContainer(Test, {list: data}, {}, {name: params.name});
    },
  dataToken
);
