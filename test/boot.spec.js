const {assert} = require('chai');
const config = require('config');
const {EphemeralConfig,ValueResolvingConfig} = require('@alt-javascript/config');
const {boot} = require('..');
const {CachingLoggerFactory,LoggerFactory,LoggerRegistry,ConfigurableLogger} = require('@alt-javascript/logger');
const logger = LoggerFactory.getLogger('@alt-javascript/boot/test/boot_spec',config);


before(async () => {
  logger.verbose(`before spec setup started`);
  // ..
  logger.verbose(`before spec setup completed`);
});

beforeEach(async () => {
  logger.verbose(`before each setup started`);
  // ..
  logger.verbose(`before each setup completed`);
});

after(async () => {
  logger.verbose(`after teardown started`);
  // ...
  logger.verbose(`after teardown completed`);
});

beforeEach(async () => {
  logger.verbose(`before each setup started`);
  // ..
  logger.verbose(`before each setup completed`);
});

describe('boot function', () => {
  it('boot - config is required', () => {
    assert.throws(()=>{boot()},'Unable to detect config, is \'config\' declared or provided?');
  });
  it('boot - config ', () => {
    const config = new EphemeralConfig({});
    boot(config);
    assert.instanceOf(global.boot.contexts.root.config,ValueResolvingConfig,'global.boot.contexts.root.config instanceof ValueResolvingConfig');
    assert.instanceOf(global.boot.contexts.root.loggerFactory,LoggerFactory,'global.boot.contexts.root.loggerFactory instanceof LoggerFactory');
    assert.instanceOf(global.boot.contexts.root.loggerRegistry,LoggerRegistry,'global.boot.contexts.root.loggerRegistry instanceof loggerRegistry');
    global.boot = undefined;
  });

  it('boot - config detects global config', () => {
    const config = new EphemeralConfig({});
    global.config = config
    boot();
    assert.instanceOf(global.boot.contexts.root.config,ValueResolvingConfig,'global.boot.contexts.root.config instanceof ValueResolvingConfig');
    assert.instanceOf(global.boot.contexts.root.loggerFactory,LoggerFactory,'global.boot.contexts.root.loggerFactory instanceof LoggerFactory');
    assert.instanceOf(global.boot.contexts.root.loggerRegistry,LoggerRegistry,'global.boot.contexts.root.loggerRegistry instanceof loggerRegistry');
    global.boot = undefined;
    global.config = undefined;
  });

  it('boot - config detects global browser config', () => {
    const config = new EphemeralConfig({});
    global.window = {config : config};
    boot();
    assert.instanceOf(global.window.boot.contexts.root.config,ValueResolvingConfig,'global.boot.contexts.root.config instanceof ValueResolvingConfig');
    assert.instanceOf(global.window.boot.contexts.root.loggerFactory,LoggerFactory,'global.boot.contexts.root.loggerFactory instanceof LoggerFactory');
    assert.instanceOf(global.window.boot.contexts.root.loggerRegistry,LoggerRegistry,'global.boot.contexts.root.loggerRegistry instanceof loggerRegistry');
    global.boot = undefined;
    global.window = undefined;
  });

  it('boot - LoggerFactory detects boot root context', () => {
    const config = new EphemeralConfig({logging:{level:{'/': 'info'}}});
    const cachingLoggerFactory = new CachingLoggerFactory(config, new LoggerRegistry());

    boot(config,cachingLoggerFactory);
    const logger = LoggerFactory.getLogger('@alt-javascript/boot/test/boot_spec')

    logger.info('message');
    assert.equal(logger.provider.console.cache.length, 1, 'logger.provider.console.cache.length === 1');
    assert.isTrue(logger.provider.console.cache[0].includes('"level":"info","message":"message"'),'logger.provider.console.cache[0].includes(\'"level":"info","message":"message"\')');
    global.boot = undefined;
  });

  it('boot - uses config local-development', () => {
    const cachingLoggerFactory = new CachingLoggerFactory(config, new LoggerRegistry());
    boot(config,cachingLoggerFactory);
    const logger = LoggerFactory.getLogger('@alt-javascript/boot/test/boot_spec/local-development')

    logger.debug('message');
    assert.equal(logger.provider.console.cache.length, 1, 'logger.provider.console.cache.length === 1');
    assert.isTrue(logger.provider.console.cache[0].includes('"level":"debug","message":"message"'),'logger.provider.console.cache[0].includes(\'"level":"debug","message":"message"\')');
    global.boot = undefined;
  });
});
