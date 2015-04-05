var Color = require('./KTColor');

function Material(parameters){
	if (!parameters) parameters = {};
	
	this.color = (parameters.color)? parameters.color : Color._WHITE;
}

module.exports = Material;