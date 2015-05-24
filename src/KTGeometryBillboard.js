var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Vector4 = require('./KTVector4');

function GeometryBillboard(width, height, params){
	this.__ktgeometry = true;
	this.ready = true;
	
	var billGeo = new Geometry();
	
	var w = width / 2;
	var h = height / 2;
	
	if (!params) params = {};
	this.params = params;
	
	this.uvRegion = (params.uvRegion)? params.uvRegion : new Vector4(0.0, 0.0, 1.0, 1.0);
	this.colorTop = (params.colorTop)? params.colorTop : Color._WHITE;
	this.colorBottom = (params.colorBottom)? params.colorBottom : Color._WHITE;
	this.spherical = (params.spherical !== undefined)? params.spherical : true;
	
	var xr = this.uvRegion.x;
	var yr = this.uvRegion.y;
	var hr = this.uvRegion.z;
	var vr = this.uvRegion.w;
	
	billGeo.addVertice( w, -h,  0, this.colorBottom, hr, yr);
	billGeo.addVertice(-w,  h,  0, this.colorTop, xr, vr);
	billGeo.addVertice(-w, -h,  0, this.colorBottom, xr, yr);
	billGeo.addVertice( w,  h,  0, this.colorTop, hr, vr);
	
	billGeo.addFace(0, 1, 2);
	billGeo.addFace(0, 3, 1);
	
	billGeo.computeFacesNormals();
	billGeo.build();
	
	this.vertexBuffer = billGeo.vertexBuffer;
	this.texBuffer = billGeo.texBuffer;
	this.facesBuffer = billGeo.facesBuffer;
	this.colorsBuffer = billGeo.colorsBuffer;
	this.normalsBuffer = billGeo.normalsBuffer;
}

module.exports = GeometryBillboard;