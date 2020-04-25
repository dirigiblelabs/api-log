# API V3 - Log

[![Eclipse License](http://img.shields.io/badge/license-Eclipse-brightgreen.svg)](LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/dirigiblelabs/api-v3-log.svg)](https://github.com/dirigiblelabs/api-v3-log/graphs/contributors)

## Example
**Scripting service 'a/b/test.js'**:
<pre>
var logging = require('log/logging');
var LOGGER = logging.getLogger('a.b.test').setLevel('DEBUG');
var testFunc = function(){
	LOGGER.trace('test trace {}', 'a');
	try{
		LOGGER.debug('test debug {}', 'a');
		LOGGER.info('test info {}', 'a');
		LOGGER.warn('test warn {}', 'a');
		throw new Error('I am an error');
	} catch(e){
		LOGGER.error('test error', e);
	}
};

testFunc();
</pre>

**Standard output (console):**  
<pre>
11:56:21,254 |-INFO in ch.qos.logback.classic.jul.LevelChangePropagator@7728c489 - Propagating DEBUG level on Logger[a.b.test] onto the JUL framework
2017-10-25 11:56:21.310 [DEBUG] [http-nio-8080-exec-10] a.b.test - test debug a
2017-10-25 11:56:21.312 [INFO ] [http-nio-8080-exec-10] a.b.test - test info a
2017-10-25 11:56:21.315 [WARN ] [http-nio-8080-exec-10] a.b.test - test warn a
2017-10-25 11:56:21.425 [ERROR] [http-nio-8080-exec-10] a.b.test - test error
org.eclipse.dirigible.api.v3.log.JSServiceException: I am an error
        at ?.anonymous(a/b/test.js:8) ~[na:na]
        at ?.?(a/b/test.js:15) ~[na:na]
</pre>

## Use

#### Get logger for name
`var logger = require('log/logging').getLogger('a.b.c');`

#### Simple logging
`logger.info('Sample info message');`  
`logger.debug('Sample debug message');`    
`logger.trace('Sample trace message');`  
`logger.warn('Sample warn message');`  
<pre>try {
   throw Error('sample error');
} catch (err){
   logger.error('Sample error message', err);
}</pre>

#### Parameterized logging
`logger.info('Sample {} message{}', 'info', '!');` outputs `Sample info message!`  

Every logger logging method, except `error`, accepts parameterized messages and parameters as arguments.
For example, `logger.info('Sample {} message{}', 'info', '!');` will produce the `Sample info message!` log message. The parametrization follows the slf4j convention and rules for placeholders. Any arguments following the first one will be treated as message parameters in the order in which they are provided. You can supply as many as you need.

#### Logging errors
Errors are normally logged using the `logger.error` method. Its first argument must be the message that you want logged. If you supply an error as a second argument it will log its message and stack trace (if any) too. 

`logger.error('Sample error message', err);` outputs
<pre>
2017-10-25 11:56:21.425 [ERROR] [http-nio-8080-exec-10] a.b.test - Sample error message
org.eclipse.dirigible.api.v3.log.JSServiceException: I am an error
        at ?.anonymous(a/b/test.js:8) ~[na:na]
        at ?.?(a/b/test.js:15) ~[na:na]
</pre>

If the second argument is not an error, the method will log the supplied message with severity ERROR and if there is more than one argument, it will treat it as parameterized (much like the rest of the log methods).
`logger.error('Sample error message{}', '!');` outputs `Sample error message!`

##### Logging errors with different severity
`logger.infoError('Sample error message as info', err);` outputs:  
<pre>
2017-10-25 11:56:21.425 [INFO] [http-nio-8080-exec-10] a.b.test - Sample error message as info
org.eclipse.dirigible.api.v3.log.JSServiceException: I am an error
        at ?.anonymous(a/b/test.js:8) ~[na:na]
        at ?.?(a/b/test.js:15) ~[na:na]
</pre>

Normally, you would log error using the `logger.error` method, but not necessarily. Similiar to the coressponding slf4j API feature, you can log an error with any other severity by using the coresponding `<severity>Error` method (e.g. `debugError`, `debugInfo`). Each of these expects an error as second argument. For example, `logger.debugError('an error occured', new Error('I am an error'))` will log the message, the second argument error and its stack trace with severity DEBUG.

**Limitations:**  
Error stacks may vary between scripting runtimes. This framework does its best to harmonize the output, but sometimes some pieces are simply not provided by the underlying runtime and cannot be inferred reliably. We will try to gradually minimize the differences.
Depending on the underlying scripting runtime engine and the scope in which you throw errors you may or you may not get stack traces featuring the object and function names that thre the error. 

## Setup

### Programmatic setup

#### Set logger severity level
To set logger severity level use `logging.getLogger('a.b.c').setLevel('DEBUG');`  

## License

This project is copyrighted by [SAP SE](http://www.sap.com/) and is available under the [Eclipse Public License v 2.0](https://www.eclipse.org/legal/epl-v20.html). See [LICENSE](LICENSE) and [NOTICE.txt](NOTICE.txt) for further details.
