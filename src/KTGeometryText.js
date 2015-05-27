var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Vector4 = require('./KTVector4');

function GeometryText(font, text, height){
	this.__ktgeometry = true;
	this.ready = true;
	
	var textGeo = new Geometry();
	
	var x = 0;
	var w = height / 2;
	var h = height / 2;
	
	this.uvRegion = new Vector4(0.0, 0.0, 1.0, 1.0);
	this.colorTop = Color._WHITE;
	this.colorBottom = Color._WHITE;
	
	var ind = 0;
	for (var i=0,len=text.length;i<len;i++){
		var chara = text.charAt(i);
		
		var uvRegion = font.getUVCoords(chara);
		var xr = uvRegion.x;
		var yr = uvRegion.y;
		var hr = uvRegion.z;
		var vr = uvRegion.w;
		
		textGeo.addVertice(x + w, -h,  0, this.colorBottom, hr, yr);
		textGeo.addVertice(x - w,  h,  0, this.colorTop, xr, vr);
		textGeo.addVertice(x - w, -h,  0, this.colorBottom, xr, yr);
		textGeo.addVertice(x + w,  h,  0, this.colorTop, hr, vr);
		
		textGeo.addFace(ind, ind + 1, ind + 2);
		textGeo.addFace(ind, ind + 3, ind + 1);
		
		x += height;
		ind += 4;
	}
	
	textGeo.computeFacesNormals();
	textGeo.build();
	
	this.vertexBuffer = textGeo.vertexBuffer;
	this.texBuffer = textGeo.texBuffer;
	this.facesBuffer = textGeo.facesBuffer;
	this.colorsBuffer = textGeo.colorsBuffer;
	this.normalsBuffer = textGeo.normalsBuffer;
}

module.exports = GeometryText;