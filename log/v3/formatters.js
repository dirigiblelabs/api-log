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

const NS_FORMATTERS_CFG = 'core/logging/formatters';
exports.NS_FORMATTERS_CFG = NS_FORMATTERS_CFG;

/**
 * Formatter constructor function. If the optional sLogRecordTemplate parameter is provided, it will be used to format log records to strings.
 * Otherwise, a fallback attempt will be performed to lookup a global template setting under the key NS_FORMATTERS_CFG + '/log-record-template'
 * in the core/v3/globals module. If nothing is found a final fallback to the "[{loggerName}] {message} {error}"" string will be made.
 * The replacement placeholders thatcna be used are: 
 * - {loggerName}: The name of the logger logging a message/error
 * - {message}: the log message
 * - {error}:  error message or JS Exception/Error
 */
var Formatter = exports.Formatter = function(sLogRecordTemplate){
	//TODO: temporary hardcoded, until this can be configurable and injected at start
	this.logRecordTemplate = sLogRecordTemplate || require('core/v3/globals').get(NS_FORMATTERS_CFG + '/log-record-template') || "[{loggerName}] {message} {error}";
}; 

Formatter.prototype.setLogRecordTemplate = function(sLogRecordTemplate){
	this.logRecordTemplate = sLogRecordTemplate;
}

Formatter.prototype.format = function(logRecord){
	var _logRecordTemplate = ""+this.logRecordTemplate ;//copy of template
	var _sLogString = _logRecordTemplate;
	_sLogString = _sLogString.replace(/{loggerName}/g, logRecord.loggerName || ' ');
	_sLogString = _sLogString.replace(/{message}/g, logRecord.message || '');
	var errSegment = logRecord.error ? logRecord.error.message : '';
	_sLogString = _sLogString.replace(/{error}/g, (errSegment? '\r\n' + errSegment : errSegment));
	if(arguments.length>1){ //take care for any addiitonal, dynamically supplied arguments
		for(var i=1; i< arguments.length; i++){
			if(arguments[i]!==undefined && arguments[i]!=null){
				//extend the template with placeholders for additional parameters
				_sLogString+=" "+ arguments[i];
			}
		}		
	}
	
	return _sLogString;
};

/**
 * Returns a Formatter instance associated with the supplied name with defualt settings. 
 * If sName is not supplied the defualt Formatter will be instantiated.
 * Otherwise, the function will look up configured formatters in globals module ('core/v3/globals') by the name:
 * NS_FORMATTERS_CFG + '/' + formatterLookupString, where formatterLookupString is in the format path-to-module/formatter-name.
 */
exports.getFormatter = function(sName){
	if(!sName)
		return new Formatter();
	var _sFormatter = require('core/v3/globals').get(NS_FORMATTERS_CFG + '/' + sName);
	var _oFormatter;
	if(_sFormatter){
		var _iSplitIdx = _sFormatter.lastIndexOf('/');
		var _sModulePath = _sFormatter.substring(0, _iSplitIdx);
		var _sFormatterName = _sFormatter.substring(_iSplitIdx+1, _sFormatter.length);
		
		if(!_sModulePath || _sModulePath === 'log/formatters')
			return new Formatter();
		
		var _oFormatterModule = require(_sModulePath);
		if(_oFormatterModule){
			if(_oFormatterModule.getFormatter && typeof _oFormatterModule.getFormatter === 'function'){
				_oFormatter = _oFormatterModule.getFormatter(_sFormatterName);
			}
		}
	}
	return _oFormatter;
};

})(exports);
