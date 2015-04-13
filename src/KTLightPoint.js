var Color = require('./KTColor');

function LightPoint(position, intensity, range, color){
	this._ktpointlight = true;
	
	this.position = position;
	this.intensity = (intensity)? intensity : 1.0;
	this.range = (range)? range : 1.0;
	this.color = new Color((color)? color : Color._WHITE);
}

module.exports = LightPoint;