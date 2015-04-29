var Color = require('./KTColor');
var Vector3 = require('./KTVector3');

function LightSpot(position, target, innerAngle, outerAngle, intensity, distance, color){
	this.__ktspotlight = true;
	
	this.position = position;
	this.direction = Vector3.vectorsDifference(position, target).normalize();
	this.outerAngle = innerAngle;
	this.innerAngle = outerAngle;
	this.intensity = (intensity)? intensity : 1.0;
	this.distance = (distance)? distance : 1.0;
	this.color = new Color((color)? color : Color._WHITE);
}

module.exports = LightSpot;