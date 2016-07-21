const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const nodemon = require('nodemon');

const { Observable, ReplaySubject, Subject } = require('rx');

const net = require('net');

console.log('Starting development server…');

function waitForPort(port, address) {
  return Observable.create(observer => {
    let s;
    console.log(`waiting for "${address}:${port}"`);
    function connect() {
      s = new net.Socket();
      s.connect(port, address, () => {
        s.destroy();
        console.log(`"${address}:${port}" is up`);
        observer.onNext('ok');
        observer.onCompleted();
      });
      s.on('error', () => {
        s.destroy();
        setTimeout(connect, 100);
      });
      s.setTimeout(100, () => {
        s.destroy();
        setTimeout(connect, 1);
      });
    }

    connect();
    return () => {
      s.destroy();
    };
  });
}


const protocol = 'http';
const host = process.env.HOST || 'localhost';
const devPort = process.env.DEV_SERVER_PORT || 2992;
const appPort = process.env.PORT || 3000;


const devServerConfig = require('./webpack-dev-server.config.js');
const backendConfig = require('./webpack-watch-server.config.js');

const devClient = [`${require.resolve('webpack-dev-server/client/')}?${protocol}://${host}:${devPort}`];

if (typeof devServerConfig.entry === 'object' && !Array.isArray(devServerConfig.entry)) {
  Object
    .keys(devServerConfig.entry)
    .forEach((key) => {
      devServerConfig.entry[key] = devClient.concat(devServerConfig.entry[key]);
    });
} else {
  devServerConfig.entry = devClient.concat(devServerConfig.entry);
}

const frontStatus$ = new ReplaySubject();
const frontEndCompiler = webpack(devServerConfig);
frontEndCompiler.plugin('compile', () => frontStatus$.onNext({ status: 'compile' }));
frontEndCompiler.plugin('invalid', () => frontStatus$.onNext({ status: 'invalid' }));
frontEndCompiler.plugin('done', (stats) => frontStatus$.onNext({ status: 'done', stats }));

const devServer = new WebpackDevServer(frontEndCompiler, {
  // --progress
  compress: false,
  watchOptions: {
    aggregateTimeout: 300,
  },
  publicPath: '/_assets/',
  stats: Object.assign({ colors: true }, devServerConfig.devServer.stats),
});

const notifications$ = new Subject();
/*eslint-disable */
const sockWrite = devServer.sockWrite;

devServer.sockWrite = (sockets, type, data) => {
  notifications$.onNext({ sockets, type, data });
};

/*eslint-enable */

devServer.listen(devPort, host, () => {
});


// const withPrerender = process.argv.indexOf('--with-prerender') !== -1;

// delete backendConfig.entry[withPrerender ? 'dev' : 'prod'];

const nodemonStart$ = new Subject();

function startServer() {
  nodemon({
    restartable: false,
    execMap: {
      js: 'node',
    },
    script: path.join(__dirname, 'build/server/server'),
    ignore: ['*'],
    watch: [],
    ext: 'noop',
    stdin: false,
    stdout: true,
  })
    .on('start', () => {
      nodemonStart$.onNext('start');
    });
}

const backendStatus$ = new ReplaySubject();

const backendCompiler = webpack(backendConfig);
backendCompiler
  .watch({
    aggregateTimeout: 300,
  }, (err, stats) => {
    if (err) {
      console.log('Error', err);
    } else {
      console.log(stats.toString(Object.assign({ colors: true }, backendConfig.devServer.stats)));
    }
  });

backendCompiler.plugin('compile', () => backendStatus$.onNext({ status: 'compile' }));
backendCompiler.plugin('invalid', () => backendStatus$.onNext({ status: 'invalid' }));
backendCompiler.plugin('done', (stats) => backendStatus$.onNext({ status: 'done', stats }));

Observable
  .combineLatest(
    frontStatus$.filter(({ status }) => status === 'done').first(),
    backendStatus$.filter(({ status }) => status === 'done').first(),
    startServer
  )
  .forEach(() => {
    console.log('Starting dev server');
    nodemonStart$
      .first()
      .flatMap(() => waitForPort(appPort, host))
      .forEach(() => {
        console.log('Dev server is ready');
      });
  });

const isReady$ = backendStatus$
  .flatMapLatest(({ status }) => {
    if (status === 'done') {
      nodemon.restart();
      return nodemonStart$
        .first()
        .flatMap(() => waitForPort(appPort, host))
        .map(() => true);
    }
    return [false];
  })
  .distinctUntilChanged();


notifications$
  .combineLatest(
    isReady$,
    (notification, isReady) => ({ notification, isReady })
  )
  .scan(({ buffer, prev }, { notification, isReady }) => {
    const nextBuffer = notification !== prev ? [...buffer, notification] : buffer;
    if (isReady) {
      return { emit: nextBuffer, buffer: [], prev: notification };
    }
    return { buffer: nextBuffer, prev: notification };
  }, { buffer: [] })
  .filter(({ emit }) => !!emit)
  .forEach(({ emit }) =>
    emit.forEach(
      v => {
        try {
          const { sockets, type, data } = v;
          sockWrite(sockets, type, data);
          console.log('websocket notification, type:', type);
        } catch (e) {
          console.log('skip, websocket notification');
        }
      }
    )
  );

// workaround for nodemon
process.once('SIGINT', () => {
  process.exit(0);
});
