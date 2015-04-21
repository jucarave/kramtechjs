var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Vector4 = require('./KTVector4');

function GeometryBox(width, length, height, params){
	this.__ktgeometry = true;
	this.ready = true;
	
	var boxGeo = new Geometry();
	
	var w = width / 2;
	var l = length / 2;
	var h = height / 2;
	
	if (!params) params = {};
	this.params = params;
	
	this.uvRegion = (params.uvRegion)? params.uvRegion : new Vector4(0.0, 0.0, 1.0, 1.0);
	
	var xr = this.uvRegion.x;
	var yr = this.uvRegion.y;
	var hr = this.uvRegion.z;
	var vr = this.uvRegion.w;
	
	boxGeo.addVertice( w, -h,  l, Color._WHITE, hr, yr);
	boxGeo.addVertice(-w,  h,  l, Color._WHITE, xr, vr);
	boxGeo.addVertice(-w, -h,  l, Color._WHITE, xr, yr);
	boxGeo.addVertice( w,  h,  l, Color._WHITE, hr, vr);
	
	boxGeo.addVertice(-w, -h, -l, Color._WHITE, xr, yr);
	boxGeo.addVertice(-w,  h, -l, Color._WHITE, xr, vr);
	boxGeo.addVertice( w, -h, -l, Color._WHITE, hr, yr);
	boxGeo.addVertice( w,  h, -l, Color._WHITE, hr, vr);
	
	boxGeo.addVertice( w, -h, -l, Color._WHITE, hr, yr);
	boxGeo.addVertice( w,  h,  l, Color._WHITE, xr, vr);
	boxGeo.addVertice( w, -h,  l, Color._WHITE, xr, yr);
	boxGeo.addVertice( w,  h, -l, Color._WHITE, hr, vr);
	
	boxGeo.addVertice(-w, -h,  l, Color._WHITE, hr, yr);
	boxGeo.addVertice(-w,  h,  l, Color._WHITE, hr, vr);
	boxGeo.addVertice(-w, -h, -l, Color._WHITE, xr, yr);
	boxGeo.addVertice(-w,  h, -l, Color._WHITE, xr, vr);
	
	boxGeo.addVertice( w,  h,  l, Color._WHITE, hr, yr);
	boxGeo.addVertice(-w,  h, -l, Color._WHITE, xr, vr);
	boxGeo.addVertice(-w,  h,  l, Color._WHITE, xr, yr);
	boxGeo.addVertice( w,  h, -l, Color._WHITE, hr, vr);
	
	boxGeo.addVertice(-w, -h,  l, Color._WHITE, xr, vr);
	boxGeo.addVertice(-w, -h, -l, Color._WHITE, xr, yr);
	boxGeo.addVertice( w, -h,  l, Color._WHITE, hr, vr);
	boxGeo.addVertice( w, -h, -l, Color._WHITE, hr, yr);
	
	boxGeo.addFace(0, 1, 2);
	boxGeo.addFace(0, 3, 1);
	
	boxGeo.addFace(4, 5, 6);
	boxGeo.addFace(5, 7, 6);
	
	boxGeo.addFace(8, 9, 10);
	boxGeo.addFace(8, 11, 9);
	
	boxGeo.addFace(12, 13, 14);
	boxGeo.addFace(13, 15, 14);
	
	boxGeo.addFace(16, 17, 18);
	boxGeo.addFace(16, 19, 17);
	
	boxGeo.addFace(20, 21, 22);
	boxGeo.addFace(21, 23, 22);
	
	boxGeo.computeFacesNormals();
	boxGeo.build();
	
	this.vertexBuffer = boxGeo.vertexBuffer;
	this.texBuffer = boxGeo.texBuffer;
	this.facesBuffer = boxGeo.facesBuffer;
	this.colorsBuffer = boxGeo.colorsBuffer;
	this.normalsBuffer = boxGeo.normalsBuffer;
}

module.exports = GeometryBox;