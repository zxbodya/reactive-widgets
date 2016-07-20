## Reactive widgets [![Build Status](https://travis-ci.org/zxbodya/reactive-widgets.svg?branch=master)](https://travis-ci.org/zxbodya/reactive-widgets)

Application starter template, for implementing isomorphic widgets(same code for both server and client side), using RxJS and React

It is build on top of following great projects:
 
 * [React](http://facebook.github.io/react/) for a view layer 
 * [RxJS](https://github.com/Reactive-Extensions/RxJS) for data layer, and composing asynchronous components
 * [Webpack](http://webpack.github.io/) to bundle client and server side scripts
 * [Babel](babeljs.io) to use next generation JavaScript, today.
 * [Express.JS](http://expressjs.com) for serving prerender application
 * [SuperAgent](https://visionmedia.github.io/superagent/) for AJAX requests to API 
 * [Karma](http://karma-runner.github.io/)  with [Jasmine](jasmine.github.io) for tests
 * [ESLint](http://eslint.org/) to watch for coding style issues
 * [Nodemon](http://nodemon.io/) to reload rendering server in dev mode
  
For now, application includes following:
 
 * [rx-react-container](https://github.com/zxbodya/rx-react-container) - Allows to use React as a view layer for RxJS application, and to wait for required data before first rendering.
 * [di1](https://github.com/zxbodya/di1) DI Container, inspired by https://github.com/angular/di.js but a lot simplified
 * Application for server side components rendering
 * Example of PHP application that uses components
 * Simple widget example

### Requirements

* [nodejs](http://nodejs.org) You will need version 6 or above
* PHP v5.4 for server side example and [composer](https://getcomposer.org/) to install dependencies 


### Development environment setup


1. install dependencies using npm
2. start server app, with automatic recompile and reload when something changes
    - `npm run watch-dev`
    - `npm run watch-prod`, if you need server-side rendering
3. open this url in your browser: `http://localhost:8080/`

(there is alternative options, to start everything separately - check `package.json` for more details)

To customize host and ports used by application - use environment variables:
- `HOST` - host where application is running, `localhost` by default 
- `DEV_SERVER_PORT` - port used by dev server, `2992` by default 
- `PORT` - port user by application, `8080` by default 


1. To run unit tests: `npm run test`
2. To check code style  `npm run lint`

### Production setup

1. Install dependencies: `npm i`
2. Build project `npm run build`
3. Start rendering server: `node ./build/server/server.js`

### PHP server demo that will use implemented widgets

example is in php folder, to try it:

1. `composer install` install dependencies, using composer
2. start php built in server `php -S 127.0.0.1:4000`
3. navigate to http://127.0.0.1:4000/ to see results
