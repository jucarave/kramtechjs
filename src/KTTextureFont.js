var KT = require('./KTMain');
var Vector2 = require('./KTVector2');
var Vector4 = require('./KTVector4');

function TextureFont(imageSrc, charWidth, charHeight, charList){
	this.__ktfontspr = true;
	
	this.imageSrc = imageSrc;
	this.charWidth = charWidth;
	this.charHeight = charHeight;
	this.charList = charList;
	this.hCharNum = 0;
	
	this.texture = null;
	this.repeat = new Vector2(1.0, 1.0);
	this.offset = new Vector2(0.0, 0.0);
	
	var T = this;
	this.image = KT.loadImage(imageSrc, function(sprite){
		T.hCharNum = sprite.width / T.charWidth;
		T.parseImageData();
		T.parseTexture();
	});
}

module.exports = TextureFont;

TextureFont.prototype.parseImageData = function(){
	var cnv = document.createElement("canvas");
	cnv.width = this.image.width;
	cnv.height = this.image.height;
	
	var ctx = cnv.getContext("2d");
	ctx.drawImage(this.image, 0, 0);
	
	var imageData = ctx.getImageData(0,0,this.image.width,this.image.height);
	var dataArr = [];
	
	var charWidths = [];
	var cW = 0;
	var ci = 0;
	
	for (var i=0,len=imageData.data.length;i<len;i+=4){
		var r = imageData.data[i];
		var g = imageData.data[i+1];
		var b = imageData.data[i+2];
		var a = imageData.data[i+3];
		
		if (r == 255 && g == 0 && b == 255){
			a = 0;
			cW += 1;
			charWidths[ci] = cW;
		}else if (cW > 0){
			ci += 1;
			cW = 0;
		}
		
		dataArr.push(r, g, b, a);
	}
	
	this.charWidths = charWidths;
	this.imageData = new Uint8Array(dataArr);
};

TextureFont.prototype.parseTexture = function(){
	var gl = KT.gl;
	
	this.texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.image.width, this.image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.imageData);
	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	
	gl.bindTexture(gl.TEXTURE_2D, null);
};

TextureFont.prototype.getUVCoords = function(character){
	if (!this.image.ready) throw "Texture Font is not ready!";
	
	var ind = this.charList.indexOf(character);
	if (ind == -1) ind = 0;
	
	var xPos = ((ind * this.charWidth) % this.image.width) / this.image.width;
	var yPos = (Math.floor(ind / this.hCharNum) * this.charHeight) / this.image.height;
	var width = xPos + (this.charWidth / this.image.width) * this.getCharaWidth(character);
	var height = yPos + (this.charHeight / this.image.height);
	
	return new Vector4(xPos, height, width, yPos);
};

TextureFont.prototype.getCharaWidth = function(character){
	if (!this.image.ready) throw "Texture Font is not ready!";
	
	var ind = this.charList.indexOf(character);
	if (ind == -1) return 1.0;
	
	return (this.charWidths[ind] + 1) / this.charWidth;
};
