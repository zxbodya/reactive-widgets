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
  
For now, application includes following:
 
 * [rx-react-container](https://github.com/zxbodya/rx-react-container) - Allows to use React as a view layer for RxJS application, and to wait for required data before first rendering.
 * [di1](https://github.com/zxbodya/di1) DI Container, inspired by https://github.com/angular/di.js but a lot simplified
 * Application for server side components rendering
 * Example of PHP application that uses components
 * Simple widget example

### Requirements

* [nodejs](http://nodejs.org)
* for dev environment, [pm2](https://github.com/Unitech/pm2) (`npm i -g pm2` to install it)
* PHP v5.4 for server side example and [composer](https://getcomposer.org/) to install dependencies 

### Setup

1. Install dependencies: `npm i`
2. Build project `npm run build`
3. Start prerender server: `node ./build/server/server.js`
  
### Dev environment

1. start webpack dev server for client-side bundle `npm run dev-server`(it will watch for changes and automatically recompile scripts and reload page)
2. start webpack watcher for server bundle `npm run watch-prerender`
3. preprender server, using pm2:
  `pm2-dev ./build/server/server.js` (it will automatically watch for changes in compiled scrip and reload)
4. test it `npm run test`
5. lint it `npm run lint`

### PHP server demo that will use implemented widgets

example is in php folder, to try it:

1. `composer install` install dependencies, using composer
2. start php built in server `php -S 127.0.0.1:4000`
3. navigate to http://127.0.0.1:4000/ to see results
