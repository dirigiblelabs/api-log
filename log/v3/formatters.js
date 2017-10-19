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

var Formatter = exports.Formatter = function(sLogRecordTemplate){
	this.logRecordTemplate = sLogRecordTemplate || require('core/v3/globals').get(NS_FORMATTERS_CFG + '/log-record-template');
	//TODO: temporary, until configurable
	if(!this.logRecordTemplate){
		this.logRecordTemplate = "[{}] {} {}";	
	}
}; 

Formatter.prototype.format = function(logRecord){
	var replacementParameters = [];
	replacementParameters.push(logRecord.loggerName || ' ');
	replacementParameters.push(logRecord.message);
	var errSegment = logRecord.error ? logRecord.error.message : '';
	replacementParameters.push(errSegment? '\r\n' + errSegment : errSegment);
	var _logRecordTemplate = ""+this.logRecordTemplate ;//copy of template
	if(arguments.length>1){ //take care for any addiitonal, dynamically supplied arguments
		for(var i=1; i< arguments.length; i++){
			if(arguments[i]!==undefined && arguments[i]!=null){
				//extend the template with placeholders for additional parameters
				_logRecordTemplate+=" {}";
				replacementParameters.push(arguments[i]);
			}
		}		
	}
	
	//replace placeholders with parameters
	var logRecord = _logRecordTemplate;
	for(var idx = 0; idx<replacementParameters.length; idx++){
		logRecord = logRecord.replace(/{}/, replacementParameters[idx]);
	}

	return logRecord;
};

exports.getFormatters = function(){
	return [
		new Formatter()
	];
};
})(exports);
