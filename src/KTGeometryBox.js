var Color = require('./KTColor');
var Geometry = require('./KTGeometry');

function GeometryBox(width, length, height){
	this.__ktgeometry = true;
	
	var boxGeo = new Geometry();
	
	var w = width / 2;
	var l = length / 2;
	var h = height / 2;
	
	boxGeo.addVertice( w, -h,  l, Color._WHITE, 1.0, 1.0);
	boxGeo.addVertice(-w,  h,  l, Color._WHITE, 0.0, 0.0);
	boxGeo.addVertice(-w, -h,  l, Color._WHITE, 0.0, 1.0);
	boxGeo.addVertice( w,  h,  l, Color._WHITE, 1.0, 0.0);
	
	boxGeo.addVertice(-w, -h, -l, Color._WHITE, 0.0, 1.0);
	boxGeo.addVertice(-w,  h, -l, Color._WHITE, 0.0, 0.0);
	boxGeo.addVertice( w, -h, -l, Color._WHITE, 1.0, 1.0);
	boxGeo.addVertice( w,  h, -l, Color._WHITE, 1.0, 0.0);
	
	boxGeo.addVertice( w, -h, -l, Color._WHITE, 0.0, 1.0);
	boxGeo.addVertice( w,  h,  l, Color._WHITE, 0.0, 0.0);
	boxGeo.addVertice( w, -h,  l, Color._WHITE, 1.0, 1.0);
	boxGeo.addVertice( w,  h, -l, Color._WHITE, 1.0, 0.0);
	
	boxGeo.addVertice(-w, -h,  l, Color._WHITE, 1.0, 1.0);
	boxGeo.addVertice(-w,  h,  l, Color._WHITE, 0.0, 0.0);
	boxGeo.addVertice(-w, -h, -l, Color._WHITE, 0.0, 1.0);
	boxGeo.addVertice(-w,  h, -l, Color._WHITE, 1.0, 0.0);
	
	boxGeo.addVertice( w,  h,  l, Color._WHITE, 1.0, 1.0);
	boxGeo.addVertice(-w,  h, -l, Color._WHITE, 0.0, 0.0);
	boxGeo.addVertice(-w,  h,  l, Color._WHITE, 0.0, 1.0);
	boxGeo.addVertice( w,  h, -l, Color._WHITE, 1.0, 0.0);
	
	boxGeo.addVertice(-w, -h,  l, Color._WHITE, 0.0, 1.0);
	boxGeo.addVertice(-w, -h, -l, Color._WHITE, 0.0, 0.0);
	boxGeo.addVertice( w, -h,  l, Color._WHITE, 1.0, 1.0);
	boxGeo.addVertice( w, -h, -l, Color._WHITE, 1.0, 0.0);
	
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
	
	boxGeo.build();
	
	this.vertexBuffer = boxGeo.vertexBuffer;
	this.texBuffer = boxGeo.texBuffer;
	this.facesBuffer = boxGeo.facesBuffer;
	this.colorsBuffer = boxGeo.colorsBuffer;
}

module.exports = GeometryBox;