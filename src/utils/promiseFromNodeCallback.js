'use strict';
module.exports = (fn, ...args)=> {
  return new Promise((resolve, reject)=>
      fn(
        ...args,
        (error, ...results)=>
          error
            ? reject(error)
            : resolve(...results)
      )
  );
};

