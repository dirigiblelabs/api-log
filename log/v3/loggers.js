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
var globals = require('core/v3/globals');
var levels = require('log/levels');

const NS = 'core/logging';
exports.NS = NS;
const NS_ROOT = 'core/logging/root';
exports.NS_ROOT = NS_ROOT;

exports.setLevel = function(level, loggerName){
	//if the level argument is level name ('ERROR', 'WARN', etc.) convert it to  its ordinal integer value
	if(typeof level === 'string')
		level = levels.ordinalValueOf(level);
	else { 
		//check if the level argument is a valid ordinal value
		levels.valueOf(level);
	}
	if(!loggerName)
		globals.set(NS_ROOT + '/level', ''+level);
	else {
		globals.set(NS + "/" + loggerName + '/level', ''+level);
	}
	return this;
};

/* TODO: cascade back to more generic loggers(using common character for seprator of levels) before falling back to root 
 * if log level for this particular loggerName is missing.
 */
var getLevel = exports.getLevel = function(loggerName){
	if(!loggerName)
		loggerName = NS_ROOT;
	else
		loggerName = NS+'/'+loggerName;
	var path = loggerName + '/level';
	var level = globals.get(path);
	if(level === null)
		level = globals.get(NS_ROOT + '/level');
	if(level === null)
		level = levels.OFF;
	return level;
};

var Logger = exports.Logger = function(loggerName){
	this.loggerName = loggerName;
};

Logger.prototype.getHandlers = function(){
	return require('log/handlers').getHandlers(this.loggerName);
};

var isLogging = function(sLoggerName, nLevel){
	var _nLoggerLevel = this.getLevel();
	return _nLoggerLevel!==levels.OFF && _nLoggerLevel >= nLevel;
}

Logger.prototype.isLogging = function(nLevel){
	return isLogging(this.loggerName, nLevel);
};

var errHandler = new (require('log/handlers')).Handler();
Logger.prototype.log = function(sMessage, nLevel, err){
	if(this.isLogging(nLevel)){
		var logRecord = {
			loggerName	: this.loggerName,
			message		: sMessage,
			level		: nLevel,
			error		: err
		};
		var _aHandlers = this.getHandlers();
		if(_aHandlers){
			for(var i = 0; i < _aHandlers.length; i++){
				try {
					_aHandlers[i].handle(logRecord);
				} catch(handlingError) {
					try{
						if(_aHandlers[i].fail)
							_aHandlers[i].fail(handlingError);
						else
							errHandler.fail(handlingError);						
					} catch (err){}
				}
			}		
		}
	}
	return this;
};

Logger.prototype.error = function(message, error){
	this.log(message, levels.ERROR, error);
	return this;
};

Logger.prototype.warn = function(message){
	return this.log(message, levels.WARN);
};

Logger.prototype.info = function(message){
	return this.log(message, levels.INFO);
};

Logger.prototype.debug = function(message){
	return this.log(message, levels.DEBUG);
};

Logger.prototype.trace= function(message){
	return this.log(message, levels.TRACE);
};

Logger.prototype.getLevel= function(){
	return getLevel(this.loggerName);
};

Logger.prototype.setLevel= function(level){
	return setLevel(level, this.loggerName);
};

//maintain loggername to logger instance mapping and reuse instances
var loggers = {};

/**
 * Get or create a Logger instance for this loggerName string.
 * For reference, the root's logger name is '__root__'.
 */
exports.get = exports.getLogger = function(loggerName){
	var _loggerName = loggerName || '__root__';
	if(loggers[_loggerName]!== undefined){
		return loggers[_loggerName];
	}
	var logger = new Logger(loggerName);
	loggers[_loggerName] = logger;
	return logger;
};
