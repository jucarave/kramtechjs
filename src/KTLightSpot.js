var Color = require('./KTColor');
var Vector3 = require('./KTVector3');

function LightSpot(position, target, innerAngle, outerAngle, intensity, distance, color){
	this.__ktspotlight = true;
	
	this.position = position;
	this.target = target;
	this.direction = Vector3.vectorsDifference(position, target).normalize();
	this.outerAngle = Math.cos(outerAngle);
	this.innerAngle = Math.cos(innerAngle);
	this.intensity = (intensity)? intensity : 1.0;
	this.distance = (distance)? distance : 1.0;
	this.color = new Color((color)? color : Color._WHITE);
	
	this.shadowCam = new KT.CameraPerspective(KT.Math.degToRad(90.0), 1.0, 0.1, distance);
	this.shadowCam.position = this.position;
	this.shadowCam.lookAt(target);
}

module.exports = LightSpot;