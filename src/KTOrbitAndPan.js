var Vector2 = require('./KTVector2');
var Vector3 = require('./KTVector3');
var Input = require('./KTInput');
var KTMath = require('./KTMath');

function OrbitAndPan(target){
	this.__ktCamCtrls = true;
	
	this.camera = null;
	this.last = null;
	this.target = (target)? target : new Vector3(0.0, 0.0, 0.0);
	this.angle = new Vector2(0.0, 0.0);
	this.zoom = 1;
	this.sensitivity = new Vector2(0.5, 0.5);
}

module.exports = OrbitAndPan;

OrbitAndPan.prototype.update = function(){
	if (Input.isWheelMoved(Input.vMouse.WHEELUP)){ this.zoom -= 0.3; this.setCameraPosition(); }
	else if (Input.isWheelMoved(Input.vMouse.WHEELDOWN)){ this.zoom += 0.3; this.setCameraPosition(); }
	
	if (Input.isMouseDown(Input.vMouse.LEFT)){
		if (this.last == null) this.last = Input._mouse.position.clone();
		
		var dx = Input._mouse.position.x - this.last.x;
		var dy = Input._mouse.position.y - this.last.y;
		
		if (dx != 0 || dy != 0){
			this.angle.x -= KTMath.degToRad(dx * this.sensitivity.x);
			this.angle.y -= KTMath.degToRad(dy * this.sensitivity.y);
			
			this.setCameraPosition();
		}
		
		this.last.copy(Input._mouse.position);
	}else{
		this.last = null;
	}
};

OrbitAndPan.prototype.setCameraPosition = function(){
	this.angle.x = (this.angle.x + KTMath.PI2) % KTMath.PI2;
	this.angle.y = (this.angle.y + KTMath.PI2) % KTMath.PI2;
	
	if (this.angle.y < KTMath.PI && this.angle.y >= KTMath.PI_2) this.angle.y = KTMath.degToRad(89.9);
	if (this.angle.y > KTMath.PI && this.angle.y <= KTMath.PI3_2) this.angle.y = KTMath.degToRad(270.9);
	
	var cosT = Math.cos(this.angle.y);
	var sinT = Math.sin(this.angle.y);
	
	var x = this.target.x + Math.cos(this.angle.x) * cosT * this.zoom;
	var y = this.target.y + sinT * this.zoom;
	var z = this.target.x - Math.sin(this.angle.x) * cosT * this.zoom;
	
	this.camera.position.set(x, y, z);
	this.camera.lookAt(this.target);
};
