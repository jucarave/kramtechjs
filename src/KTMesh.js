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
	
	this.transformationMatrix = null;
	this.transformationStack = 'SRxRyRzT';
}

module.exports = Mesh;

Mesh.prototype.lookToObject = function(camera){
	var angle = KTMath.get2DAngle(this.position.x, this.position.z, camera.position.x, camera.position.z) + KTMath.PI_2;
	this.rotation.y = angle;
	
	if (this.geometry.spherical){
		var dist = new Vector3(camera.position.x - this.position.x, 0, camera.position.z - this.position.z).length();
		var xAng = -KTMath.get2DAngle(0, this.position.y, dist, camera.position.y);
		this.rotation.x = xAng;
	}
};

Mesh.prototype.getTransformationMatrix = function(camera){
	if (this.isBillboard){
		this.lookToObject(camera);
	}
		
	if (!this.transformationMatrix || !this.position.equals(this.previousPosition) || !this.rotation.equals(this.previousRotation) || !this.scale.equals(this.previousScale)){
		this.transformationMatrix = Matrix4.getTransformation(this.position, this.rotation, this.scale, this.transformationStack);
		
		this.previousPosition.copy(this.position);
		this.previousRotation.copy(this.rotation);
		this.previousScale.copy(this.scale);
		
		if (this.parent){
			var m = this.parent.getTransformationMatrix();
			this.transformationMatrix.multiply(m);
		}
	}
	
	return this.transformationMatrix.clone();
};
