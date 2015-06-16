var KT = require('./KTMain');
var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Vector4 = require('./KTVector4');

function GeometryText(font, text, size, align, color, maxWidth, wrap){
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
	this.maxWidth = (maxWidth)? maxWidth : -1;
	this.wrap = (wrap)? wrap : 'char';
	
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

GeometryText.prototype.formatText = function(){
	if (this.wrap != 'word') return [this.text];
	
	var ret = [];
	var line = '';
	var width = 0;
	var words = this.text.split(' ');
	
	var last = true;
	var blank = this.size * this.font.getCharaWidth(' ');
	for (var i=0,len=words.length;i<len;i++){
		var w = words[i];
		var ww = blank;
		
		for (var j=0,jlen=w.length;j<jlen;j++){
			ww += this.size * this.font.getCharaWidth(w.charAt(j));
		}
		
		if (width + ww < this.maxWidth){
			if (line != "") line += ' ';
			line += w;
			width += ww;
			last = false;
		}else{
			ret.push(line);
			line = w;
			width = ww;
			last = true;
		}
	}
	
	if (!last){
		ret.push(line);
	}
	
	return ret;
};

GeometryText.prototype.updateGeometry = function(){
	if (!this.hasChanged()) return;
	
	this._previousSize = this.size;
	this._previousText = this.text;
	this._previousFont = this.font;
	this._previousAlign = this.align;
	this._previousColor = this.color;
	
	this.vertexBuffer = null;
	this.texBuffer = null;
	this.facesBuffer = null;
	this.colorsBuffer = null;
	this.normalsBuffer = null;
	this.textGeometry.clear();
	
	var text = this.formatText();
	var y = 0;
	var w = this.size;
	var h = this.size;
	
	var ind = 0;
	for (var j=0,jlen=text.length;j<jlen;j++){
		var x = 0;
		
		for (var i=0,len=text[j].length;i<len;i++){
			var chara = text[j].charAt(i);
			
			var uvRegion = this.font.getUVCoords(chara);
			var xr = uvRegion.x;
			var yr = uvRegion.y;
			var hr = uvRegion.z;
			var vr = uvRegion.w;
			
			var ww = w * this.font.getCharaWidth(chara);
			var xw = x + ww;
			
			if (this.maxWidth != -1 && this.wrap == 'char' && xw >= this.maxWidth){
				x = 0;
				y -= this.size;
				i--;
				continue;
			}
			
			this.textGeometry.addVertice(xw,    y,  0, this.color, hr, yr);
			this.textGeometry.addVertice( x,  y+h,  0, this.color, xr, vr);
			this.textGeometry.addVertice( x,    y,  0, this.color, xr, yr);
			this.textGeometry.addVertice(xw,  y+h,  0, this.color, hr, vr);
			
			this.textGeometry.addFace(ind, ind + 1, ind + 2);
			this.textGeometry.addFace(ind, ind + 3, ind + 1);
			
			x += ww;
			ind += 4;
		}
		
		y -= this.size;
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
