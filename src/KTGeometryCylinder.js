var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Vector4 = require('./KTVector4');
var KTMath = require('./KTMath');

function GeometryCylinder(radiusTop, radiusBottom, height, widthSegments, heightSegments, params){
	this.__ktgeometry = true;
	
	var cylGeo = new Geometry();
	
	if (!params) params = {};
	this.params = params;
	
	this.uvRegion = (params.uvRegion)? params.uvRegion : new Vector4(0.0, 0.0, 1.0, 1.0);
	
	var xr = this.uvRegion.x;
	var yr = this.uvRegion.y;
	var hr = this.uvRegion.z - xr;
	var vr = this.uvRegion.w;
	
	var h = height / 2;
	
	var bandW = KTMath.PI2 / (widthSegments - 1);
	
	for (var i=0;i<widthSegments;i++){
		var x1 = Math.cos(bandW * i) * radiusBottom;
		var y1 = -h;
		var z1 = -Math.sin(bandW * i) * radiusBottom;
		var x2 = Math.cos(bandW * i) * radiusTop;
		var y2 = h;
		var z2 = -Math.sin(bandW * i) * radiusTop;
		
		var xt = i / widthSegments;
		
		cylGeo.addVertice( x1, y1, z1, Color._WHITE, xr + (xt * hr), yr);
		cylGeo.addVertice( x2, y2, z2, Color._WHITE, xr + (xt * hr), vr);
	}
	
	cylGeo.addVertice( radiusBottom, -h, 0, Color._WHITE, xr, yr);
	cylGeo.addVertice( radiusTop, h, 0, Color._WHITE, xr, vr);
	
	for (var i=0;i<widthSegments*2;i+=2){
		var i1 = i;
		var i2 = i+1;
		var i3 = i+2;
		var i4 = i+3;
		
		cylGeo.addFace(i4, i1, i3);
		cylGeo.addFace(i4, i2, i1);
	}
	
	cylGeo.computeFacesNormals();
	cylGeo.build();
	
	this.vertexBuffer = cylGeo.vertexBuffer;
	this.texBuffer = cylGeo.texBuffer;
	this.facesBuffer = cylGeo.facesBuffer;
	this.colorsBuffer = cylGeo.colorsBuffer;
	this.normalsBuffer = cylGeo.normalsBuffer;
}

module.exports = GeometryCylinder;