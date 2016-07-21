import di from 'di1';
import createContainer from 'rx-react-container';

import Test from './TestView';

import dataToken from './data';

export default di.annotate(
  data =>
    params => createContainer(Test, { list: data }, {}, { name: params.name }),
  dataToken
);
