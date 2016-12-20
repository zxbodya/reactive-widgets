import React from 'react';
import { Observable } from 'rxjs';

export default (error) =>
  Observable.of(
    () => (
      <div>
        <p>{error.message}</p>
        <pre>{error.stack}</pre>
      </div>
    )
  );
