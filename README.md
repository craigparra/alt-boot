An Extensible Config & Logging Application Bootstrap Function
=============================================================

[![NPM](https://nodei.co/npm/@alt-javascript/boot.svg?downloads=true&downloadRank=true)](https://nodei.co/npm/@alt-javascript/boot/)
<br/>
![Language Badge](https://img.shields.io/github/languages/top/alt-javascript/boot)
![Package Badge](https://img.shields.io/npm/v/@alt-javascript/boot) <br/>
[release notes](https://github.com/alt-javascript/boot/blob/main/History.md)

<a name="intro">Introduction</a>
--------------------------------
An opinionated application config and logging bootstrap that streamlines the use of the
- [@alt-javascript/config](https://www.npmjs.com/package/@alt-javascript/config),
- [@alt-javascript/logger](https://www.npmjs.com/package/@alt-javascript/logger), and
- [@alt-javascript/cdi](https://www.npmjs.com/package/@alt-javascript/cdi)

The `Application` class implements a familiar application context and dependency injection
(cdi) implementation, supporting simple singleton and prototype component factory definitions, with a choice of
manual or auto wiring (injection) of property references and config placeholders.

The `Application` class extends the standalone `boot` function, which binds a global root context with configured LoggerFactory
to negate the need for requiring  and injecting the application config in every module, and optionally the `node-fetch`
implementation for config pulled from a service url.

The `config`, `loggerFactory`, `LoggerCategoryCache` are registered as injectable singleton components, and the `logger`
is an injectable prototype.  See the [@alt-javascript/cdi](https://www.npmjs.com/package/@alt-javascript/cdi) package for more
detail on how the dependency injection works.

<a name="usage">Usage</a>
-------------------------

The following example bootstraps an Application with an EmphemeraConfig (but could easily be a regular config 
or alt-javascript/config instance), with a basic config context component definition.

```javascript
    const ephemeralConfig = new EphemeralConfig(
    {
        context: {
            SimpleClass: {
                require: './test/service/SimpleClass',
            },
        },
    },
);

const applicationContext = Application.run({ config: ephemeralConfig });

const simpleClass = applicationContext.get('simpleClass');
assert.exists(simpleClass, 'simpleClass exists');

```

To use the module boot function standalone, substitute the named {config} module export, in place of the popular
[config](https://www.npmjs.com/package/config) default, and `boot` it &ndash; note, we use a named export for config, 
because the module exports other useful classes as well.

```javascript
const {config} = require('@alt-javascript/config');
const {LoggerFactory} = require('@alt-javascript/logger');
const {boot} = require('@alt-javascript/boot');

boot({config});

config.get('key');
config.get('nested.key');
config.get('unknown','use this instead'); // this does not throw an error

const logger = LoggerFactory.getLogger('@myorg/mypackage/MyModule');
logger.info('Hello World!')
```

To boot and use [winston](https://www.npmjs.com/package/winston) as the logging transport, 
boot a WinstonLoggerFactory instead.

`MyApp.js`
```javascript
const {config} = require('@alt-javascript/config');
const winston = require('winston');
const {LoggerFactory, WinstonLoggerFactory} = require('@alt-javascript/logger');
const {boot} = require('@alt-javascript/boot');
const winstonLoggerFactory = new WinstonLoggerFactory(config,winston,{/*my winston options*/})
boot({config:config, loggerFactory:winstonLoggerFactory});
```

Then in your application modules, you only need.

`MyModule.js`
```javascript
const {LoggerFactory} = require('@alt-javascript/logger');

// LoggerFactory.getLogger will now bind to the global root context loggerFactory, 
// configured with booted winstonLoggerFactory from MyApp.js.

const logger = LoggerFactory.getLogger('@myorg/mypackage/MyModule');
logger.info('Hello from MyModule!')
```

`MyOtherModule.js`
```javascript
const {LoggerFactory} = require('@alt-javascript/logger');

// Shared logging config, different file.

const logger = LoggerFactory.getLogger('@myorg/mypackage/MyOtherModule');
logger.info('Hello from MyOtherModule!')
```
<a name="license">License</a>
-----------------------------

May be freely distributed under the [MIT license](https://raw.githubusercontent.com/craigparra/alt-logger/master/LICENSE).

Copyright (c) 2021 Craig Parravicini    
