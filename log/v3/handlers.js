/*******************************************************************************
 * Copyright (c) 2017 SAP and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 * Contributors:
 * SAP - initial API and implementation
 *******************************************************************************/

/* eslint-env node, dirigible */
(function(){

const NS_HANDLERS_CFG = 'core/logging/handlers';
var globals = require('core/v3/globals');
var Formatter = require('log/formatters').Formatter;

var Handler = exports.Handler = function(oFormatter){
	this.oFormatter = oFormatter;
};

Handler.prototype.handle = function(logRecord){};

Handler.prototype.fail = function(error){
	var handlersFailLog = globals.get(NS_HANDLERS_CFG+"/handlers-fail-log");
	if(handlersFailLog!==null && handlersFailLog){
		if(error){
			console.error(error.message || error);
		if(error.stack)
			console.error(error.stack);
		} else {
			console.error;
		}	
	}
};

var LEVELS = require('log/levels').LEVELS;
var ConsoleHandler = function(oFormatter){
	if(!oFormatter){
		var _sLogRecordTemplate = globals.get(NS_HANDLERS_CFG+'/CONSOLE/formatter/log-record-template'); 	
		oFormatter = new Formatter(_sLogRecordTemplate);
	}
	Handler.call(this, oFormatter);
	this.levelToConsoleMethodMap = {};
	this.levelToConsoleMethodMap[LEVELS.ERROR] = 'error';
	this.levelToConsoleMethodMap[LEVELS.WARN] = 'warn';	
	this.levelToConsoleMethodMap[LEVELS.DEBUG] = 'debug';
	this.levelToConsoleMethodMap[LEVELS.TRACE] = this.levelToConsoleMethodMap[LEVELS.INFO] = 'info';
};
ConsoleHandler.prototype = Object.create(Handler.prototype);

ConsoleHandler.prototype.handle = function(logRecord){
	var message = this.oFormatter.format(logRecord);
	console[this.levelToConsoleMethodMap[logRecord.level]](message);
	if(logRecord.error && logRecord.error.stack)
		console.error(logRecord.error.stack);
};

var handlers = {
	"CONSOLE": 	new ConsoleHandler()
};
var getHandler = exports.getHandler = function(sHandlerName){
	return handlers[sHandlerName];
};

//index resolved logger handlers for faster access.
var loggerHandlers = {}

/*
 * Finds the logging handlers configured or infered for this logger name.
 */
exports.getHandlers = function(sLoggerName){
	if(!sLoggerName){
		//global
		return Object.keys(handlers).map(function(_sHandlerName){
			return handlers[_sHandlerName];
		});
	}
	if(loggerHandlers[sLoggerName])
		return loggerHandlers[sLoggerName];
	//Read or infer configured handlers for this logger
	//TODO: namespace to core.logging prefix;
	//handler info consists of "module-path/handler-name". Multiple can be encoded with ',' for separator
	var _aHandlerNames = globals.get(NS_HANDLERS_CFG + '/' + sLoggerName); 
	//TODO: tmp hardcoded. The above will always be undefined until configurable and injected at start
	if(!_aHandlerNames){
		_aHandlerNames = "log/handlers/CONSOLE";
	}
	var _oHandlerRefs = {};
	if(_aHandlerNames){
		_aHandlerNames.split(',').forEach(function(sHandler){
			var _iSplitIdx = sHandler.lastIndexOf('/');
			var _sModulePath = sHandler.substring(0, _iSplitIdx);
			var _sHandlerName = sHandler.substring(_iSplitIdx+1, sHandler.length);
			_oHandlerRefs[_sHandlerName] = _sModulePath;
		}.bind(this));
	}
	var _aHandlers = [];
	//TODO: check for duplicates and filter
	Object.keys(_oHandlerRefs).forEach(function(_sHandlerName){
		var _oHandlerModule;
		if(_oHandlerRefs[_sHandlerName] === 'log/handlers' || _oHandlerRefs[_sHandlerName] === 'log/v3/handlers'){
			//local stuff
			_oHandlerModule = exports;
		} else {
			_oHandlerModule = require(_oHandlerRefs[_sHandlerName]);
		}
		if(_oHandlerModule){
			if(_oHandlerModule.getHandler && typeof _oHandlerModule.getHandler === 'function'){
				_oHandler = _oHandlerModule.getHandler(_sHandlerName);
				if(_oHandler)
					_aHandlers.push(_oHandler);
			}
		}
	});
	loggerHandlers[sLoggerName] = _aHandlers;
	return _aHandlers;
};

})(exports);
