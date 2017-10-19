/*******************************************************************************
 * Copyright (c) 2017 SAP and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 * Contributors:
 * SAP - initial API and implementation
 *******************************************************************************/

 const OFF = 0;
 exports.OFF = OFF;
 const ERROR = 1;
 exports.ERROR = ERROR;
 const WARN = 2;
 exports.WARN = WARN;
 const INFO = 3;
 exports.INFO = INFO;
 const DEBUG = 4;
 exports.DEBUG = DEBUG;
 const TRACE = 5;
 exports.TRACE = TRACE; 
 const ALL = 100;
 exports.ALL = ALL;  
 
/* eslint-env node, dirigible */
var LEVELS = exports.LEVELS = Object.freeze({
	"OFF"  : OFF,
	"ERROR": ERROR,
	"WARN" : WARN,
	"INFO" : INFO,
	"DEBUG": DEBUG,
	"TRACE": TRACE,
	"ALL"  : ALL
});

LEVELS.valueOf = function(nLevelOrdinallValue){
	if(isFinite(nLevelOrdinallValue))
		throw Error('Illegal argument exception: ' + nLevelOrdinallValue + ' is not a valid level number');
	var levelName;
	Object.keys(LEVELS).forEach(function(k){
		if(LEVELS[k] === nLevelOrdinallValue)
			levelName = k;
	}.bind(this));
	if(levelName === undefined)
		throw Error('Illegal argument exception: ' + nLevelOrdinallValue + ' is not a valid level number');
	return levelName;
};

LEVELS.ordinalValueOf = function(sLevelName){
	if(typeof sLevelName !== 'string')
		throw Error('Illegal argument exception: ' + sLevelName + ' is not a valid level name string');
	var levelValue;
	Object.keys(LEVELS).forEach(function(k){
		if(k === sLevelName)
			levelValue = LEVELS[k];
	}.bind(this));
	if(levelValue === undefined)
		throw Error('Illegal argument exception: ' + sLevelName + ' is not a valid level name string');
	return levelName;
};