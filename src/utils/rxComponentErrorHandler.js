import React from 'react';
import {Observable} from 'rx';

export default (error)=>
  Observable.return(
    function() {
      return (
        <div>
          <p>{error.message}</p>
          <pre>{error.stack}</pre>
        </div>
      );
    }
  );
