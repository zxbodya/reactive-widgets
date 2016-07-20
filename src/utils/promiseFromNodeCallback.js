export default (fn, ...args) =>
  new Promise((resolve, reject) =>
    fn(
      ...args,
      (error, ...results) => (
        error
          ? reject(error)
          : resolve(...results)
      )
    )
  );
