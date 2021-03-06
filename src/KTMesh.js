var Matrix4 = require('./KTMatrix4');
var Vector2 = require('./KTVector2');
var Vector3 = require('./KTVector3');
var KTMath = require('./KTMath');
var GeometryBillboard = require('./KTGeometryBillboard');

function Mesh(geometry, material){
	if (!geometry || !geometry.__ktgeometry) throw "Geometry must be a KTGeometry instance";
	if (!material || !material.__ktmaterial) throw "Material must be a KTMaterial instance";
	
	this.__ktmesh = true;
	
	this.geometry = geometry;
	this.material = material;
	this.isBillboard = (geometry instanceof GeometryBillboard);
	
	this.children = [];
	this.parent = null;
	this.visible = true;
	
	this.castShadow = false;
	this.receiveShadow = false;
	
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

module.exports = Mesh;

Mesh.prototype.lookAtObject = function(camera){
	var angle = KTMath.get2DAngle(this.position.x, this.position.z, camera.position.x, camera.position.z) + KTMath.PI_2;
	this.rotation.y = angle;
	
	if (this.geometry.spherical){
		var dist = new Vector3(camera.position.x - this.position.x, 0, camera.position.z - this.position.z).length();
		var xAng = -KTMath.get2DAngle(0, this.position.y, dist, camera.position.y);
		this.rotation.x = xAng;
	}
};

Mesh.prototype.positionChanged = function(){
	return (!this.transformationMatrix || !this.position.equals(this.previousPosition) || !this.rotation.equals(this.previousRotation) || !this.scale.equals(this.previousScale));
};

Mesh.prototype.getTransformationMatrix = function(camera){
	if (this.isBillboard){ this.lookAtObject(camera); }
		
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

Mesh.prototype.addChild = function(mesh){
	this.children.push(mesh);
	mesh.parent = this;
	
	mesh.position.x -= this.position.x;
	mesh.position.y -= this.position.y;
	mesh.position.z -= this.position.z;
	
	mesh.rotation.x -= this.rotation.x;
	mesh.rotation.y -= this.rotation.y;
	mesh.rotation.z -= this.rotation.z;
};