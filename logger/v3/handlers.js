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
var LEVELS = require('logger/levels').LEVELS;
var formatters = require('logger/formatters').getFormatters();
var Handler = exports.Handler = function(formatter){
	this.formatter = formatter;
};
Handler.prototype.handle = function(logRecord){};

var ConsoleHandler = function(formatter){
	Handler.call(this, (formatter || (formatters && formatters[0])));
	this.levelToConsoleMethodMap = {};
	this.levelToConsoleMethodMap[LEVELS.ERROR] = 'error';
	this.levelToConsoleMethodMap[LEVELS.WARN] = 'warn';	
	this.levelToConsoleMethodMap[LEVELS.DEBUG] = 'debug';
	this.levelToConsoleMethodMap[LEVELS.TRACE] = this.levelToConsoleMethodMap[LEVELS.INFO] = 'info';
};
ConsoleHandler.prototype = Object.create(Handler.prototype);

ConsoleHandler.prototype.handle = function(logRecord){
	var message = this.formatter.format(logRecord);
	console[this.levelToConsoleMethodMap[logRecord.level]](message);
	if(logRecord.error && logRecord.error.stack)
		console.error(logRecord.error.stack);
};

exports.getHandlers = function(){
	return [
		new ConsoleHandler()
	];
};
})(exports);
