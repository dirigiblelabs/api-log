# API V3 - Logging

[![Eclipse License](http://img.shields.io/badge/license-Eclipse-brightgreen.svg)](LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/dirigiblelabs/api-v3-log.svg)](https://github.com/dirigiblelabs/api-v3-log/graphs/contributors)

## Use

#### Get logger for name
`var logger = require('log/loggers').getLogger('a/b/c');`  
If you do not supply a name, the global (root) logger will be returned:  
`var rootLogger = require('log/loggers').getLogger();`

#### Log
`logger.info('Sample info message');`  
`logger.debug('Sample debug message');`  
`logger.trace('Sample trace message');`  
`logger.warn('Sample warn message');`  
<pre>try {
   throw Error('sample error');
} catch (err){
   logger.error('Sample error message', err);
}</pre>

## Setup
### Set logger severity level
To set logger level, use any of the constants supplied by the `log/levels` with the `setLevel` function:  
`require('log/loggers').setLevel(require('log/levels').DEBUG, 'a/b/c');`  
or exposed by the enumeration object `LEVELS` in the same module:  
`require('log/loggers').setLevel(require('log/levels').LEVELS.DEBUG, 'a/b/c');`  
In these examples, the logger going by the name `a/b/c` is preset with logging level `DEBUG`. Trying to log with severity level `TRACE` will not have effect, while trying to log with severity level `INFO` will produce result.  
To setup log severity levels globally just omit the second argument to setLevel:  
`require('log/loggers').setLevel(require('log/levels').DEBUG);`  
Concrete logger log severity level settings ovverride the global ones.
Logger levels are accessible via `core/v3/globals` by the key pattern `'core/logging/your-logger-name-here/level'` and `'core/logging/root/level'` for the global level respectively.

### Setup log message pattern
Log messages are formatted by formatters. The default formatter uses `core/logging/formatters/log-record-template` setting available via the `core/v3/globals` module or falls back to default pattern `[{}] {} {}` if nothing found. The `{}` constructs are placeholders and their order is significant (currently). They will be replaced with the following log record properties in that order: `loggerName`, `message`, `error`. To change the template, update it:  
`require("core/v3/globals").set("core/logging/formatters/log-record-template", "{}: {} {}");`  
Currently, the template is global, i.e. the change will affect all loggers unless the formatter has been initialized explicitly wth a template string by some handler, which will effectively override the global setting.

### Setup handlers for logger
Log handlers take care for formatting a log message using formatters and serializing it to a specific destination such as console or file. Besides the default global handler, whcih is `ConsoleHandler` supplied by `log/v3/handlers` module, a number of others can be preset, potentially per logger (name).  
The mapping between logger names and coresponding handlers is maintained by the `core/v3/globals` module in namespace with the following pattern: `core/logging/handlers/your-logger-name-here`. The values stored in this path (if any) are in the form `path-to-module/handler-name`. For example, `log/handlers/CONSOLE`.  
Other modules, different than `log/hanlders` can also provide handlers with this mechanism, provided that they expose also a `getHandler(sHandlerName)` function, which will take care to initialize and return a handler requested by its name.  
Handlers are usually initialized with some formatter that they will delegate to for the formatting phase. It's quite possible that formatters are also shared and reused. They may override the global settings of the instances they use. For example the Console log handler uses its own specific global property (`core/logging/handlers/CONSOLE/formatter/log-record-template`) to configure template and only if it has not been preset, it falls back to the global one for setting up its formatter.

### Setup log handlers silent failure
By default handlers will fail silently. Should you want to inspect errors in handlers enable the following setting `core/logging/handlers/handlers-fail-log`:  
`require('core/v3/globals').set("core/logging/handlers/handlers-fail-log", "true");`

## Customizations

#### Log message formatters
Log message formatters transform the log message object into a specific serializable form, usable by handlers.  
There is an out-of-the-box `Formatter` class supplied by the `log/formatters` module. Upon instantiation it looks up a globally configured log record template in `core/v3/globals` by the name `core/logging/formatters/log-record-template` and falls back to a default one if none is found. As much as this generic formatters is used and the log record template is shared among handlers you can customize this single configuratin setting to affect all if you wanted a different log message layout.  
To inspect the current setting use:  
`require('core/v3/globals').get('core/logging/formatters/log-record-template')`  
The Formatter class formats log record objects into strings using the template in its `format` method. The logRecord parameter has the following properties:  
- loggerName: The name of the logger that requests logging
- message: The message that this logger logs
- error: optional parameter in case the logger logs an error. Nromally, this is the javacriot Error or Exception object and may feature stack and error message, but not necessarily  
Note that this formatter is designed to accept and format also dynamically provided paramters in addition to the standed log record ones. Any additional argument to its format method single required one (logRecord) will be appended with a single space prefix to the tail of the formatted log record string.
To  customize further the formatting behavior, you can extend the Formatter class or create your own and ake sure it is used by the hanlders it is intended for.

#### Log handlers
Log handlers take care for formatting a log message using formatters and serializing it to a specific destination such as console or file.
A console log handler comes out-of-the-box with the `log/handlers` module, logging messages in the server console.

## License

This project is copyrighted by [SAP SE](http://www.sap.com/) and is available under the [Eclipse Public License v 1.0](https://www.eclipse.org/legal/epl-v10.html). See [LICENSE](LICENSE) and [NOTICE.txt](NOTICE.txt) for further details.
