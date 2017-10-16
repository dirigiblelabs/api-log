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

var Formatter = exports.Formatter = function(){};

Formatter.prototype.format = function(logRecord){
	var ctxSegment = logRecord.loggerName?'['+logRecord.loggerName+'] ':' ';
	var errSegment = logRecord.error ? ' ' + logRecord.error.message : '';
	return ctxSegment + logRecord.message + (errSegment? '\r\n' + errSegment : errSegment);
};

exports.getFormatters = function(){
	return [
		new Formatter()
	];
};
})(exports);
