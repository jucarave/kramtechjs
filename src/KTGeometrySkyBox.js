var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Vector4 = require('./KTVector4');
var MaterialBasic = require('./KTMaterialBasic');
var Mesh = require('./KTMesh');
var GeometryBox = require('./KTGeometryBox');

function GeometrySkybox(width, length, height, position, textures){
	this.meshes = [];
	if (!textures) textures = [];
	
	var w = width / 2;
	var l = length / 2;
	var h = height / 2;
	
	var xr = 0.0;
	var yr = 0.0;
	var hr = 1.0;
	var vr = 1.0;
	
	var ct = Color._WHITE;
	var cb = Color._GREEN;
	
	var geo = new Geometry();
	var mat = new MaterialBasic(textures[0], Color._WHITE);
	geo.addVertice( w, -h,  l, cb, hr, yr);
	geo.addVertice(-w,  h,  l, ct, xr, vr);
	geo.addVertice(-w, -h,  l, cb, xr, yr);
	geo.addVertice( w,  h,  l, ct, hr, vr);
	geo.addFace(0, 2, 1);
	geo.addFace(0, 1, 3);
	geo.build();
	this.meshes.push(new Mesh(geo, mat));
	
	var geo = new Geometry();
	var mat = new MaterialBasic(textures[1], Color._WHITE);
	geo.addVertice(-w, -h, -l, cb, xr, yr);
	geo.addVertice(-w,  h, -l, ct, xr, vr);
	geo.addVertice( w, -h, -l, cb, hr, yr);
	geo.addVertice( w,  h, -l, ct, hr, vr);
	geo.addFace(0, 2, 1);
	geo.addFace(2, 3, 1);
	geo.build();
	this.meshes.push(new Mesh(geo, mat));
	
	var geo = new Geometry();
	var mat = new MaterialBasic(textures[2], Color._WHITE);
	geo.addVertice( w, -h, -l, cb, hr, yr);
	geo.addVertice( w,  h,  l, ct, xr, vr);
	geo.addVertice( w, -h,  l, cb, xr, yr);
	geo.addVertice( w,  h, -l, ct, hr, vr);
	geo.addFace(0, 2, 1);
	geo.addFace(0, 1, 3);
	geo.build();
	this.meshes.push(new Mesh(geo, mat));
	
	var geo = new Geometry();
	var mat = new MaterialBasic(textures[3], Color._WHITE);
	geo.addVertice(-w, -h,  l, cb, hr, yr);
	geo.addVertice(-w,  h,  l, ct, hr, vr);
	geo.addVertice(-w, -h, -l, cb, xr, yr);
	geo.addVertice(-w,  h, -l, ct, xr, vr);
	geo.addFace(0, 1, 2);
	geo.addFace(1, 3, 2);
	geo.build();
	this.meshes.push(new Mesh(geo, mat));
	
	var geo = new Geometry();
	var mat = new MaterialBasic(textures[4], Color._WHITE);
	geo.addVertice( w,  h,  l, ct, hr, yr);
	geo.addVertice(-w,  h, -l, ct, xr, vr);
	geo.addVertice(-w,  h,  l, ct, xr, yr);
	geo.addVertice( w,  h, -l, ct, hr, vr);
	geo.addFace(0, 2, 1);
	geo.addFace(0, 1, 3);
	geo.build();
	this.meshes.push(new Mesh(geo, mat));
	
	var geo = new Geometry();
	var mat = new MaterialBasic(textures[5], Color._WHITE);
	geo.addVertice(-w, -h,  l, cb, xr, vr);
	geo.addVertice(-w, -h, -l, cb, xr, yr);
	geo.addVertice( w, -h,  l, cb, hr, vr);
	geo.addVertice( w, -h, -l, cb, hr, yr);
	geo.addFace(0, 1, 2);
	geo.addFace(1, 3, 2);
	geo.build();
	this.meshes.push(new Mesh(geo, mat));
	
	
	for (var i=0;i<6;i++){
		this.meshes[i].position = position;
	}
}

module.exports = GeometrySkybox;