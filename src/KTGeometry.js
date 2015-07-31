var KT = require('./KTMain');
var Color = require('./KTColor');
var Matrix4 = require('./KTMatrix4');
var Vector2 = require('./KTVector2');
var Vector3 = require('./KTVector3');
var Vector4 = require('./KTVector4');

function Geometry(){
	this.__ktgeometry = true;
	
	this.clear();
	this.uvRegion = new Vector4(0.0, 0.0, 1.0, 1.0);
	this.boundingBox = null;
	this.boundingSphere = null;
	this.boundingCylinder = null;
}

module.exports = Geometry;

Geometry.prototype.clear = function(){
	this.vertices = [];
	this.triangles = [];
	this.uvCoords = [];
	this.colors = [];
	this.normals = [];
	
	this.vertexBuffer = null;
	this.texBuffer = null;
	this.facesBuffer = null;
	this.colorsBuffer = null;
	this.normalsBuffer = null;
	
	this.boundingBox = null;
	this.boundingSphere = null;
	this.boundingCylinder = null;
	
	this.ready = false;
};

Geometry.prototype.addVertice = function(x, y, z, color, tx, ty){
	if (!color) color = Color._WHITE;
	if (!tx) tx = 0;
	if (!ty) ty = 0;
	
	var ind = this.vertices.length;
	this.vertices.push(new Vector3(x, y, z));
	this.colors.push(new Color(color));
	this.uvCoords.push(new Vector2(tx, ty));
	
	return ind;
};

Geometry.prototype.addFace = function(vertice_0, vertice_1, vertice_2){
	if (!this.vertices[vertice_0]) throw "Invalid vertex index: " + vertice_0;
	if (!this.vertices[vertice_1]) throw "Invalid vertex index: " + vertice_1;
	if (!this.vertices[vertice_2]) throw "Invalid vertex index: " + vertice_2;
	
	this.triangles.push(new Vector3(vertice_0, vertice_1, vertice_2));
};

Geometry.prototype.addNormal = function(nx, ny, nz){
	this.normals.push(new Vector3(nx, ny, nz));
};

Geometry.prototype.build = function(){
	var vertices = [];
	var uvCoords = [];
	var triangles = [];
	var colors = [];
	var normals = [];
	
	for (var i=0,len=this.vertices.length;i<len;i++){ 
		var v = this.vertices[i]; 
		vertices.push(v.x, v.y, v.z); 
	}
	
	for (var i=0,len=this.uvCoords.length;i<len;i++){ 
		var v = this.uvCoords[i]; 
		uvCoords.push(v.x, v.y); 
	}
	
	for (var i=0,len=this.triangles.length;i<len;i++){ 
		var t = this.triangles[i]; 
		triangles.push(t.x, t.y, t.z); 
	}
	
	for (var i=0,len=this.colors.length;i<len;i++){ 
		var c = this.colors[i].getRGBA(); 
		
		colors.push(c[0], c[1], c[2], c[3]); 
	}
	
	for (var i=0,len=this.normals.length;i<len;i++){
		var n = this.normals[i];
		normals.push(n.x, n.y, n.z);
	}
	
	this.vertexBuffer = KT.createArrayBuffer("ARRAY_BUFFER", new Float32Array(vertices), 3);
	this.texBuffer = KT.createArrayBuffer("ARRAY_BUFFER", new Float32Array(uvCoords), 2);
	this.facesBuffer = KT.createArrayBuffer("ELEMENT_ARRAY_BUFFER", new Uint16Array(triangles), 1);
	this.colorsBuffer = KT.createArrayBuffer("ARRAY_BUFFER", new Float32Array(colors), 4);
	this.normalsBuffer = KT.createArrayBuffer("ARRAY_BUFFER", new Float32Array(normals), 3);
	this.ready = true;
	
	return this;
};

Geometry.prototype.computeFacesNormals = function(){
	this.normals = [];
	
	var normalizedVertices = [];
	for (var i=0,len=this.triangles.length;i<len;i++){
		var face = this.triangles[i];
		var v0 = this.vertices[face.x];
		var v1 = this.vertices[face.y];
		var v2 = this.vertices[face.z];
		
		var dir1 = Vector3.vectorsDifference(v1, v0);
		var dir2 = Vector3.vectorsDifference(v2, v0);
		
		var normal = dir1.cross(dir2).normalize();
		
		if (normalizedVertices.indexOf(face.x) == -1) this.normals.push(normal);
		if (normalizedVertices.indexOf(face.y) == -1) this.normals.push(normal);
		if (normalizedVertices.indexOf(face.z) == -1) this.normals.push(normal);
		
		normalizedVertices.push(face.x, face.y, face.z);
	}
	
	return this;
};

Geometry.prototype.computeBoundingBox = function(){
	var x1, x2, y1, y2, z1, z2;
	
	for (var i=0,len=this.vertices.length;i<len;i++){
		var v = this.vertices[i];
		
		if (i == 0){
			x1 = v.x; y1 = v.y; z1 = v.z;
			x2 = v.x; y2 = v.y; z2 = v.z;
		}else{
			x1 = Math.min(x1, v.x);
			y1 = Math.min(y1, v.y);
			z1 = Math.min(z1, v.z);
			x2 = Math.max(x2, v.x);
			y2 = Math.max(y2, v.y);
			z2 = Math.max(z2, v.z);
		}
	}
	
	this.boundingBox = {
		x1: x1,
		y1: y1,
		z1: z1,
		x2: x2,
		y2: y2,
		z2: z2,
	}; 
	
	return this;
};

Geometry.prototype.computeBoundingSphere = function(){
	var max;
	
	for (var i=0,vert;vert=this.vertices[i];i++){
		var length = vert.length();
		
		max = (i==0)? length : Math.max(max, length);
	}
	
	this.boundingSphere = {
		radius: max
	};
	
	return this;
};

Geometry.prototype.computeBoundingCylinder = function(){
	var rad, ymax, ymin;
	
	for (var i=0,vert;vert=this.vertices[i];i++){
		var vert2d = vert.clone();
		vert2d.y = 0;
		
		var length = vert2d.length();
		
		rad = (i==0)? length : Math.max(rad, length);
		ymax = (i==0)? vert.y : Math.max(ymax, vert.y);
		ymin = (i==0)? vert.y : Math.min(ymin, vert.y);
	}
	
	this.boundingCylinder = {
		radius: rad,
		y1: ymin,
		y2: ymax
	};
	
	return this;
};
