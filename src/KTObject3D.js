var Matrix4 = require('./KTMatrix4');
var Vector2 = require('./KTVector2');
var Vector3 = require('./KTVector3');
var KTMath = require('./KTMath');

function Object3D(){
	this.__ktmesh = true;
	
	this.children = [];
	this.parent = null;
	
	this.position = new Vector3(0, 0, 0);
	this.rotation = new Vector3(0, 0, 0);
	this.scale = new Vector3(1, 1, 1);
	
	this.previousPosition = this.position.clone();
	this.previousRotation = this.rotation.clone();
	this.previousScale = this.scale.clone();
	
	this.order = 0;
	
	this.transformationMatrix = null;
	this.transformationStack = 'SRxRyRzT';
}

module.exports = Object3D;

Object3D.prototype.positionChanged = function(){
	return (!this.transformationMatrix || !this.position.equals(this.previousPosition) || !this.rotation.equals(this.previousRotation) || !this.scale.equals(this.previousScale));
};

Object3D.prototype.getTransformationMatrix = function(camera){
	var parentPositionChanged = (this.parent && this.parent.positionChanged);
	if (this.positionChanged || parentPositionChanged){
		this.transformationMatrix = Matrix4.getTransformation(this.position, this.rotation, this.scale, this.transformationStack);
		
		this.previousPosition.copy(this.position);
		this.previousRotation.copy(this.rotation);
		this.previousScale.copy(this.scale);
		
		if (this.parent){
			var m = this.parent.getTransformationMatrix(camera);
			this.transformationMatrix.multiply(m);
		}
	}
	
	return this.transformationMatrix.clone();
};

Object3D.prototype.addChild = function(mesh){
	this.children.push(mesh);
	mesh.parent = this;
	
	mesh.position.x -= this.position.x;
	mesh.position.y -= this.position.y;
	mesh.position.z -= this.position.z;
	
	mesh.rotation.x -= this.rotation.x;
	mesh.rotation.y -= this.rotation.y;
	mesh.rotation.z -= this.rotation.z;
};
