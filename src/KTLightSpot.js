var KT = require('./KTMain');
var Color = require('./KTColor');
var Vector3 = require('./KTVector3');
var TextureFramebuffer = require('./KTTextureFramebuffer');

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
	this.castShadow = false;
	this.shadowCam = null;
	this.shadowBuffer = null;
}

module.exports = LightSpot;

LightSpot.prototype.setCastShadow = function(castShadow){
	this.castShadow = castShadow;
	
	if (castShadow){
		var rel = KT.canvas.width / KT.canvas.height;
		this.shadowCam = new KT.CameraPerspective(KT.Math.degToRad(90.0), rel, 0.1, this.distance);
		this.shadowCam.position = this.position;
		this.shadowCam.lookAt(this.target);
		
		this.shadowBuffer = new TextureFramebuffer(512.0, 512.0);
	}else{
		this.shadowCam = null;
		this.shadowBuffer = null;
	}
};
