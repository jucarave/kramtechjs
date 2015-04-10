var Matrix4 = require('./KTMatrix4');
var Color = require('./KTColor');
var Vector3 = require('./KTVector3');
var KTMath = require('./KTMath');

function CameraPerspective(position, rotation, fov, ratio, znear, zfar){
	this.__ktcamera = true;
	
	this.position = position;
	this.rotation = rotation;
	
	this.fov = fov;
	this.ratio = ratio;
	this.znear = znear;
	this.zfar = zfar;
	
	this.backgroundColor = new Color(Color._BLACK);
	
	this.getTransformationMatrix();
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

CameraPerspective.prototype.setBackgroundColor = function(color){
	this.backgroundColor = new Color(color);
};

CameraPerspective.prototype.getTransformationMatrix = function(){
	var pos = this.position.clone().multiply(-1);
	var rot = this.rotation.clone().multiply(-1);
	var camMat = Matrix4.getTransformation(pos, rot, null, 'STR');
	
	rot.multiply(-1);
	var camMatL = Matrix4.getTransformation(pos, rot, null, 'STR');
	
	this.transformationMatrix = camMat;
	this.NRTransformationMatrix = camMatL;
	return camMat;
};

CameraPerspective.prototype.lookAt = function(vector3){
	if (!vector3.__ktv3) throw "Can only look at a vector3";
	
	var forward = Vector3.vectorsDifference(this.position, vector3);
	var xzDist = Math.sqrt(forward.x * forward.x + forward.z * forward.z);
	
	var xAng = KTMath.get2DAngle(0, this.position.y, xzDist, vector3.y);
	var yAng = KTMath.get2DAngle(this.position.x, this.position.z, vector3.x, vector3.z) - KTMath.PI_2;
	
	this.rotation.set(
		xAng,
		yAng,
		0
	);
};
