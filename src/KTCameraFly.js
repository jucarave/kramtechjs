var Input = require('./KTInput');
var KTMath = require('./KTMath');
var Vector2 = require('./KTVector2');
var Vector3 = require('./KTVector3');

function FlyCamera(){
	this.__ktCamCtrls = true;
	
	this.camera = null;
	this.target = new Vector3(0.0, 0.0, 0.0);
	this.angle = new Vector2(0.0, 0.0);
	this.speed = 0.5;
	this.lastDrag = null;
	this.sensitivity = new Vector2(0.5, 0.5);
	this.onlyOnLock = true;
	this.maxAngle = KTMath.degToRad(75);
}

module.exports =  FlyCamera;

FlyCamera.prototype.keyboardControls = function(){
	var cam = this.camera;
	var moved = false;
	
	if (Input.isKeyDown(Input.vKey.W)){
		cam.position.x += Math.cos(this.angle.x) * this.speed;
		cam.position.y += Math.sin(this.angle.y) * this.speed;
		cam.position.z -= Math.sin(this.angle.x) * this.speed;
		
		moved = true;
	}else if (Input.isKeyDown(Input.vKey.S)){
		cam.position.x -= Math.cos(this.angle.x) * this.speed;
		cam.position.y -= Math.sin(this.angle.y) * this.speed;
		cam.position.z += Math.sin(this.angle.x) * this.speed;
		
		moved = true;
	}
	
	if (Input.isKeyDown(Input.vKey.A)){
		cam.position.x += Math.cos(this.angle.x + KTMath.PI_2) * this.speed;
		cam.position.z -= Math.sin(this.angle.x + KTMath.PI_2) * this.speed;
		
		moved = true;
	}else if (Input.isKeyDown(Input.vKey.D)){
		cam.position.x -= Math.cos(this.angle.x + KTMath.PI_2) * this.speed;
		cam.position.z += Math.sin(this.angle.x + KTMath.PI_2) * this.speed;
		
		moved = true;
	}
	
	return moved;
};

FlyCamera.prototype.mouseControls = function(){
	if (this.onlyOnLock && !Input.mouseLocked) return;
	
	var moved = false;
	
	if (this.lastDrag == null) this.lastDrag = Input._mouse.position.clone();
	
	var dx = Input._mouse.position.x - this.lastDrag.x;
	var dy = Input._mouse.position.y - this.lastDrag.y;
	
	if (dx != 0.0 || dy != 0.0){
		this.angle.x -= KTMath.degToRad(dx * this.sensitivity.x);
		this.angle.y -= KTMath.degToRad(dy * this.sensitivity.y);
		
		if (this.angle.y < -this.maxAngle) this.angle.y = -this.maxAngle;
		if (this.angle.y > this.maxAngle) this.angle.y = this.maxAngle;
		
		moved = true;
	}
	
	this.lastDrag.copy(Input._mouse.position);
	
	return moved;
};

FlyCamera.prototype.update = function(){
	if (this.camera.locked) return;
	
	var mK = this.keyboardControls();
	var mM = this.mouseControls();
	
	if (mK || mM){
		this.setCameraPosition();
	}
};

FlyCamera.prototype.setCameraPosition = function(){
	var cam = this.camera;
	
	var x = cam.position.x + Math.cos(this.angle.x);
	var y = cam.position.y + Math.sin(this.angle.y);
	var z = cam.position.z - Math.sin(this.angle.x);
	
	this.target.set(x, y, z);
	this.camera.lookAt(this.target);
};

FlyCamera.prototype.setCamera = function(camera){
	this.camera = camera;
	
	var zoom = Vector3.vectorsDifference(camera.position, this.target).length();
	
	this.angle.x = (-KTMath.get2DAngle(this.target.x, this.target.z, camera.position.x, camera.position.z) + KTMath.PI2) % KTMath.PI2;
	this.angle.y = (-KTMath.get2DAngle(0, camera.position.y, zoom, this.target.y));
	
	this.setCameraPosition();
};
