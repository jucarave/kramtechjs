var Matrix4 = require('./KTMatrix4');
var Vector3 = require('./KTVector3');

function Mesh(geometry, material){
	if (!geometry.__ktgeometry) throw "Geometry must be a KTGeometry instance";
	if (!material.__ktmaterial) throw "Material must be a KTMaterial instance";
	
	this.__ktmesh = true;
	
	this.geometry = geometry;
	this.material = material;
	
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

Mesh.prototype.getTransformationMatrix = function(){
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
