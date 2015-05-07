var Color = require('./KTColor');
var CameraOrtho = require('./KTCameraOrtho');
var Vector2 = require('./KTVector2');
var TextureFramebuffer = require('./KTTextureFramebuffer');

function DirectionalLight(direction, color, intensity){
	this.__ktdirLight = true;
	
	this.direction = direction.normalize();
	this.direction.multiply(-1);
	
	this.color = new Color((color)? color: Color._WHITE);
	this.intensity = (intensity !== undefined)? intensity : 1.0;
	this.castShadow = false;
	this.shadowCam = null;
	this.shadowBuffer = null;
	
	this.shadowCamWidth = 500;
	this.shadowCamHeight = 500;
	this.shadowNear = 0.1;
	this.shadowFar = 500.0;
	this.shadowResolution = new Vector2(512, 512);
}

module.exports = DirectionalLight;

DirectionalLight.prototype.setCastShadow = function(castShadow){
	this.castShadow = castShadow;
	
	if (castShadow){
		var rel = this.shadowResolution.x / this.shadowResolution.y;
		this.shadowCam = new CameraOrtho(this.shadowCamWidth, this.shadowCamHeight, this.shadowNear, this.shadowFar);
		this.shadowCam.position = this.direction.clone().multiply(100);
		this.shadowCam.lookAt(this.direction.clone().multiply(-1));
		
		this.shadowBuffer = new TextureFramebuffer(this.shadowResolution.x, this.shadowResolution.y);
	}else{
		this.shadowCam = null;
		this.shadowBuffer = null;
	}
};