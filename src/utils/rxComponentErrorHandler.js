import React from 'react';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export default (error) =>
  Observable.of(
    () => (
      <div>
        <p>{error.message}</p>
        <pre>{error.stack}</pre>
      </div>
    )
  );
