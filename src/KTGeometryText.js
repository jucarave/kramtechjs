var Color = require('./KTColor');
var Geometry = require('./KTGeometry');

function GeometryText(font, text, height){
	this.__ktgeometry = true;
	this.ready = true;
	
	var textGeo = new Geometry();
	
	var w = height / 2;
	var h = height / 2;
	
	this.uvRegion = font.getUVCoords(text);
	this.colorTop = Color._WHITE;
	this.colorBottom = Color._WHITE;
	
	var xr = this.uvRegion.x;
	var yr = this.uvRegion.y;
	var hr = this.uvRegion.z;
	var vr = this.uvRegion.w;
	
	textGeo.addVertice( w, -h,  0, this.colorBottom, hr, yr);
	textGeo.addVertice(-w,  h,  0, this.colorTop, xr, vr);
	textGeo.addVertice(-w, -h,  0, this.colorBottom, xr, yr);
	textGeo.addVertice( w,  h,  0, this.colorTop, hr, vr);
	
	textGeo.addFace(0, 1, 2);
	textGeo.addFace(0, 3, 1);
	
	textGeo.computeFacesNormals();
	textGeo.build();
	
	this.vertexBuffer = textGeo.vertexBuffer;
	this.texBuffer = textGeo.texBuffer;
	this.facesBuffer = textGeo.facesBuffer;
	this.colorsBuffer = textGeo.colorsBuffer;
	this.normalsBuffer = textGeo.normalsBuffer;
}

module.exports = GeometryText;