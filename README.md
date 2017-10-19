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

### Global configuration settings
Te global configuration settings are maintained (currenlty) by the globals module (`core/v3/globals`) and are accessible via its set/get functions.  

#### Severity levels
The values of either of these settings must be a valid number coressponding to a severity level as provided by module `log/levels` `LEVELS`.  
 - `core/logging/root/level`: the root (global) logging severity level. Effective for all loggers unless overriden by concrete logger setitng.  
 - `core/logging/{logger-name}/level`: the logging severity level for a logger (name)  

#### Log Hanlders
 - `core/logging/handlers/handlers-fail-log`: indicates if hanlder intenral exceptions will be logged (`true`) or silently ignored (`false`)  
 - `core/logging/handlers/{module-path:handler-name}`: Path to additional handler in the specified module (module-path) and with name (handler-name). Use it to configure custom handlers.
 - `core/logging/handlers/CONSOLE/formatter/log-record-template`: formatter configuration for a specific log handler (CONSOLE). Log handlers can expose different sets of specific properties. This one will be used to override the default global log message template in the CONSOLE handler. Other handlers will be unaffected. 

#### Log Formatters
 - `core/logging/formatters/log-record-template`: the default log-record template that will be used to format log record objects into log message strings.  
 - `core/logging/formatters/{module-path:formatter-name}`: Path to additional formatter in the specified module (module-path) and with name (formatter-name). Use it to configure custom formatters.   

### Programmatic setup

#### Set logger severity level
To set logger level, use any of the constants supplied by the `log/levels` with the `setLevel` function:  
`require('log/loggers').setLevel(require('log/levels').DEBUG, 'a/b/c');`  
or exposed by the enumeration object `LEVELS` in the same module:  
`require('log/loggers').setLevel(require('log/levels').LEVELS.DEBUG, 'a/b/c');`
In these examples, the logger going by the name `a/b/c` is preset with logging level `DEBUG`. Trying to log with severity level `TRACE` will not have effect, while trying to log with severity level `INFO` will produce result.  

To setup log severity levels globally just omit the second argument to setLevel:  
`require('log/loggers').setLevel(require('log/levels').DEBUG);`  

Concrete logger log severity level settings override the global ones.

#### Setup log message pattern
Log messages are formatted by formatters. The default formatter supplied by `log/formatters` module uses a message template with placeholders, which are filled when format is request with concrete values. The placehoders are wlell-knwon strings surrounded by curly braces: `{}`. They will be replaced with the following log record properties: `loggerName`, `message`, `error` globally (i.e. multiple occurencies of the same pattern will be replaced with the corresponding values wherever found).  
The standard method for application devleopers to update the tempalte would be configuration. Handler provider developers may also use API for that. A custom template can be programmatically injected in the Formatter instance with its `setLogRecordTemplate(sTemplate)` method or provided to its constructor function as argument: `new Formatter(sTemplate)`. Of course, that may or may not be irrelevant for custom formatters.

#### Setup handlers for logger
Log handlers take care for formatting a log message using formatters and serializing it to a specific destination such as console or file. Besides the default global handler, whcih is `ConsoleHandler` supplied by `log/v3/handlers` module, a number of others can be preset, potentially per logger (name).  

Other modules, different than `log/hanlders` can also provide handlers with this mechanism, provided that they expose also a `getHandler(sHandlerName)` function, which will take care to initialize and return a handler requested by its name. The `getHandler(sName)` function in `log/handlers` module will take care to look them up and store for further reference. 

## API 
### Class log/formatters/Formatter
There is an out-of-the-box `Formatter` class supplied by the `log/formatters` module. Upon instantiation it looks up a globally configured log record template in `core/v3/globals` by the name `core/logging/formatters/log-record-template` and falls back to a default one if none is found. As much as this generic formatters is used and the log record template is shared among handlers you can customize this single configuratin setting to affect all if you wanted a different log message layout.  

To inspect the current setting use:  
`require('core/v3/globals').get('core/logging/formatters/log-record-template')`  

The Formatter class formats log record objects into strings using the template in its `format` method. The logRecord parameter has the following properties:  
- loggerName: The name of the logger that requests logging
- message: The message that this logger logs
- error: optional parameter in case the logger logs an error. Nromally, this is the javacriot Error or Exception object and may feature stack and error message, but not necessarily  

Note that this formatter is designed to accept and format also dynamically provided paramters in addition to the standed log record ones. Any additional argument to its format method single required one (logRecord) will be appended with a single space prefix to the tail of the formatted log record string.


## License

This project is copyrighted by [SAP SE](http://www.sap.com/) and is available under the [Eclipse Public License v 1.0](https://www.eclipse.org/legal/epl-v10.html). See [LICENSE](LICENSE) and [NOTICE.txt](NOTICE.txt) for further details.
