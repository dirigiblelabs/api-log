# API V3 - Log

[![Eclipse License](http://img.shields.io/badge/license-Eclipse-brightgreen.svg)](LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/dirigiblelabs/api-v3-log.svg)](https://github.com/dirigiblelabs/api-v3-log/graphs/contributors)

## Use

#### Get logger for name
`var logger = require('log/loggers').getLogger('a.b.c');`

#### Log
#####Simple
`logger.info('Sample info message');`
`logger.debug('Sample debug message');`  
`logger.trace('Sample trace message');`  
`logger.warn('Sample warn message');`  
<pre>try {
   throw Error('sample error');
} catch (err){
   logger.error('Sample error message', err);
}</pre>

##### Parameterized
Every logger logging method, except `error`, accepts parameterized messages and parameters as arguments.
For example, `logger.info('Sample {} message{}', 'info', '!');` will produce the `Sample info message!` log message. The parametrization follows the slf4j convention and rules for placeholders. Any arguments following the first one will be treated as message parameters in the order in which they are provided. You can supply as many as you need.

##### Logging errors
Errors are normally logged using the `logger.error` method. Its first argument must be the message that you want logged. If you supply an error as a second argument it will log its message and stack trace (if any) too. If the second argument is not an error, the method will log the supplied message with severity ERROR and if there is more than one argument, treat it as parameterized (much like the rest of the log methods).

**Limitations:**  
Error stacks may vary between scripting runtimes. This framework does its best to harmonize the output, but sometimes some pieces are simply not provided by the underlying runtime and cannot be inferred reliably. We will try to gradually minimize the differences.
Depending on the underlying scripting runtime engine and the scope in which you throw errors you may or you may not get stack traces featuring the object and function names that thre the error. 

##### Logging errors with different severity
Normally you would log error using the `logger.error` method, but not necessarily. Similiar to the coressponding slf4j API feature, you can log an error with any other severity by using the coresponding `<severity>Error` method (e.g. `debugError`, `debugInfo`). Each of these expects an error as second argument. For example, `logger.debugError('an error occured', new Error('I am an error'))` will log the message, the second argument error and its stack trace with severity DEBUG.

## Setup

### Programmatic setup

#### Set logger severity level
To set logger severity level use `logging.getLogger('a.b.c').setLevel('DEBUG');`  

## License

This project is copyrighted by [SAP SE](http://www.sap.com/) and is available under the [Eclipse Public License v 1.0](https://www.eclipse.org/legal/epl-v10.html). See [LICENSE](LICENSE) and [NOTICE.txt](NOTICE.txt) for further details.
