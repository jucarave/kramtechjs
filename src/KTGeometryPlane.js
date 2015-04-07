var Color = require('./KTColor');
var Geometry = require('./KTGeometry');

function GeometryPlane(width, height){
	this.__ktgeometry = true;
	
	var planeGeo = new Geometry();
	
	var w = width / 2;
	var h = height / 2;
	
	planeGeo.addVertice( w, 0,  l, Color._WHITE, 1.0, 1.0);
	planeGeo.addVertice(-w, 0, -l, Color._WHITE, 0.0, 0.0);
	planeGeo.addVertice(-w, 0,  l, Color._WHITE, 0.0, 1.0);
	planeGeo.addVertice( w, 0, -l, Color._WHITE, 1.0, 0.0);
	
	planeGeo.addFace(0, 1, 2);
	planeGeo.addFace(0, 3, 1);
	
	planeGeo.computeFacesNormals();
	planeGeo.build();
	
	this.vertexBuffer = planeGeo.vertexBuffer;
	this.texBuffer = planeGeo.texBuffer;
	this.facesBuffer = planeGeo.facesBuffer;
	this.colorsBuffer = boxGeo.colorsBuffer;
	this.normalsBuffer = planeGeo.normalsBuffer;
}

module.exports = GeometryPlane;