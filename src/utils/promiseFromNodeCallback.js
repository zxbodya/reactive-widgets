export default (fn, ...args)=> {
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

