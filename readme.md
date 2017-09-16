## Reactive widgets [![Build Status](https://travis-ci.org/zxbodya/reactive-widgets.svg?branch=master)](https://travis-ci.org/zxbodya/reactive-widgets)

Application starter template, for implementing isomorphic widgets(same code for both server and client side), using RxJS and React

It is build on top of following great projects:
 
 * [React](http://facebook.github.io/react/) for a view layer 
 * [RxJS](https://github.com/ReactiveX/RxJS) for data layer, and composing asynchronous components
 * [Webpack](http://webpack.js.org/) to bundle client and server side scripts
 * [Babel](babeljs.io) to use next generation JavaScript, today.
 * [Express.JS](http://expressjs.com) for serving prerender application
 * [Axios](https://github.com/mzabriskie/axios) for AJAX requests to API 
 * [Jest](http://facebook.github.io/jest/) for tests
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
* PHP above v5.4 for server side example and [composer](https://getcomposer.org/) to install dependencies 


### Development environment setup

0. Check your Node.js version - it should be version 6 or later
1. Install dependencies using npm (or yarn)
2. start server app, with automatic recompile and reload when something changes
    - `npm run dev`
3. open this url in your browser: `http://localhost:4000/` (php server should be started at port 4000 to make this working, see instructions below) 

To customize host and ports used by application - use environment variables:

- `DEV_SERVER_PORT` - port used by dev server, `2992` by default
- `DEV_SERVER_HOST` - host where dev server is running, `localhost` by default

Same thing about app itself:

- `APP_SERVER_HOST` - host where application is running, `localhost` by default (address where app is accessible) 
- `APP_SERVER_PORT` - port user by application, `8080` by default

**if you have different application host and port different than above - be sure to specify them in environment**

Also you can enable some other things for dev-server by environment variables
 
- `HOT=1` to enable hot reload for client side  

For setting those variables - you can create `.env` file at project root.


1. To run unit tests: `npm run test`
2. To check code style  `npm run lint`

### Production setup

1. Install dependencies: `npm i`
2. Build project `npm run build`
3. Start rendering server: `node ./build/server/server.js`

### PHP server demo that will use implemented widgets

example is in public folder, to try it:

1. `composer install` install dependencies, using composer
2. start php built in server `php -S 127.0.0.1:4000`
3. navigate to http://127.0.0.1:4000/ to see results
