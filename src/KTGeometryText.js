var KT = require('./KTMain');
var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Vector4 = require('./KTVector4');

function GeometryText(font, text, size, align, color){
	this.__ktgeometry = true;
	this.ready = true;
	
	this.textGeometry = new Geometry();
	
	if (!align) align = KT.TEXT_ALIGN_LEFT;
	if (!color) color = Color._WHITE;
	
	this.uvRegion = new Vector4(0.0, 0.0, 1.0, 1.0);
	
	this.size = size;
	this.text = text;
	this.font = font;
	this.align = align;
	this.color = color;
	
	this._previousHeight = null;
	this._previousText = null;
	this._previousFont = null;
	this._previousAlign = null;
	this._previousColor = null;
	
	this.autoUpdate = true;
	
	this.updateGeometry();
}

module.exports = GeometryText;

GeometryText.prototype.hasChanged = function(){
	return (
		this.size != this._previousSize ||
		this.text != this._previousText ||
		this.font != this._previousFont ||
		this.align != this._previousAlign ||
		this.color != this._previousColor
	);
};

GeometryText.prototype.updateGeometry = function(){
	if (!this.hasChanged()) return;
	
	this._previousSize = this.size;
	this._previousText = this.text;
	this._previousFont = this.font;
	this._previousAlign = this.align;
	this._previousColor = this.color;
	
	this.textGeometry.clear();
	
	var x = 0;
	var w = this.size;
	var h = this.size / 2;
	
	var ind = 0;
	for (var i=0,len=this.text.length;i<len;i++){
		var chara = this.text.charAt(i);
		
		var uvRegion = this.font.getUVCoords(chara);
		var xr = uvRegion.x;
		var yr = uvRegion.y;
		var hr = uvRegion.z;
		var vr = uvRegion.w;
		
		var ww = w * this.font.getCharaWidth(chara);
		var xw = x + ww;
		
		this.textGeometry.addVertice(xw, -h,  0, this.color, hr, yr);
		this.textGeometry.addVertice( x,  h,  0, this.color, xr, vr);
		this.textGeometry.addVertice( x, -h,  0, this.color, xr, yr);
		this.textGeometry.addVertice(xw,  h,  0, this.color, hr, vr);
		
		this.textGeometry.addFace(ind, ind + 1, ind + 2);
		this.textGeometry.addFace(ind, ind + 3, ind + 1);
		
		x += ww;
		ind += 4;
	}
	
	if (this.align == KT.TEXT_ALIGN_CENTER){
		var w2 = x / 2;
		for (var i=0,len=this.textGeometry.vertices.length;i<len;i++){
			this.textGeometry.vertices[i].x -= w2;
		}
	}else if (this.align == KT.TEXT_ALIGN_RIGHT){
		var w2 = x;
		for (var i=0,len=this.textGeometry.vertices.length;i<len;i++){
			this.textGeometry.vertices[i].x -= w2;
		}
	}
	
	this.textGeometry.computeFacesNormals();
	this.textGeometry.build();
	
	this.vertexBuffer = this.textGeometry.vertexBuffer;
	this.texBuffer = this.textGeometry.texBuffer;
	this.facesBuffer = this.textGeometry.facesBuffer;
	this.colorsBuffer = this.textGeometry.colorsBuffer;
	this.normalsBuffer = this.textGeometry.normalsBuffer;
	
	this.width = x;
};
