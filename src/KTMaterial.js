var Color = require('./KTColor');

function Material(parameters){
	this.__ktmaterial = true;
	
	if (!parameters) parameters = {};
	
	this.color = (parameters.color)? parameters.color : Color._WHITE;
	this.shader = (parameters.shader)? parameters.shader : null;
	this.opacity = (parameters.opacity)? parameters.opacity : 1.0;
	this.drawFaces = (parameters.drawFaces)? parameters.drawFaces : 'FRONT';
}

module.exports = Material;