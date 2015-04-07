var Matrix4 = require('./KTMatrix4');

function CameraPerspective(position, rotation, fov, ratio, znear, zfar){
	this.__ktcamera = true;
	
	this.position = position;
	this.rotation = rotation;
	
	this.fov = fov;
	this.ratio = ratio;
	this.znear = znear;
	this.zfar = zfar;
	
	this.setPerspective();
}

module.exports = CameraPerspective;

CameraPerspective.prototype.setPerspective = function(){
	var C = 1 / Math.tan(this.fov / 2);
	var R = C * this.ratio;
	var A = (this.znear + this.zfar) / (this.znear - this.zfar);
	var B = (2 * this.znear * this.zfar) / (this.znear - this.zfar);
	
	this.perspectiveMatrix = new Matrix4(
		C, 0, 0,  0,
		0, R, 0,  0,
		0, 0, A,  B,
		0, 0, -1, 0
	);
};
