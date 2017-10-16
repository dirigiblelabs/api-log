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
//var globals = require('core/globals');
var handlers = require('logger/handlers').getHandlers();
var LEVELS = exports.LEVELS = require('logger/levels').LEVELS;

var Logger = exports.Logger = function(loggerName){
	this.name = this.loggerName = loggerName;
};

var _level;
exports.setLevel = function(level){
	_level = level;
	return this;
	//globals.set('core.logging.root.level', level);
};

exports.getLevel = function(){
	return _level || LEVELS.OFF;
	//return globals.get('core.logging.root.level') || LEVELS.OFF;
};

Logger.prototype.getHandlers = function(){
	return require('logger/handlers').getHandlers();
};

Logger.prototype.log = function(message, level, err){
	var loggerLevel = exports.getLevel(); 
	if(loggerLevel!==LEVELS.OFF && loggerLevel >= level){
		var logRecord = {
			loggerName	: this.loggerName || this.name || this.ctx,
			message		: message,
			level		: level,
			error		: err
		};
		if(handlers){
			for(var i=0; i<handlers.length; i++){
				try {
					handlers[i].handle(logRecord);
				} catch(handlingError) {
					//TODO: report to a specific handler error manager instead
					console.error(handlingError);
					console.trace(handlingError.stack);
				}
			}		
		}
	}
	return this;
};

Logger.prototype.error = function(message, error){
	this.log(message, LEVELS.ERROR, error);
	return this;
};

Logger.prototype.warn = function(message){
	return this.log(message, LEVELS.WARN);
};

Logger.prototype.info = function(message){
	return this.log(message, LEVELS.INFO);
};

Logger.prototype.debug = function(message){
	return this.log(message, LEVELS.DEBUG);
};

Logger.prototype.trace= function(message){
	return this.log(message, LEVELS.TRACE);
};

exports.get = function(loggerName, level){
/*	var logger = globals.get(loggerName);
	if(!logger){
		logger = new Logger(loggerName, level);
		globals.set(loggerName, logger);
	}*/
	var logger = new Logger(loggerName, level);
	return logger;
};
