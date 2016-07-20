import promiseFromNodeCallback from './promiseFromNodeCallback';

export default (request) => promiseFromNodeCallback(request.end.bind(request));
