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
var handlers = require('log/handlers').getHandlers();
var LEVELS = exports.LEVELS = require('log/levels').LEVELS;

var Logger = exports.Logger = function(loggerName){
	this.name = this.loggerName = loggerName;
};

var logger_levels = {};

exports.setLevel = function(level, loggerName){
	if(!loggerName)
		globals.set('core.logging.root.level', ''+level);
	else
		logger_levels[loggerName] = level;
	return this;
};

exports.getLevel = function(loggerName){
	return logger_levels[loggerName] || globals.get('core.logging.root.level') || LEVELS.OFF;
};

Logger.prototype.getHandlers = function(){
	return require('log/handlers').getHandlers();
};

Logger.prototype.log = function(message, level, err){
	var loggerLevel = exports.getLevel(this.loggerName); 
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

exports.get = function(loggerName){
	var logger = new Logger(loggerName);
	return logger;
};
