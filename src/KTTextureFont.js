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
		T.parseTexture();
	});
}

module.exports = TextureFont;

TextureFont.prototype.parseTexture = function(){
	var gl = KT.gl;
	
	this.texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
	
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
	var width = xPos + (this.charWidth / this.image.width);
	var height = yPos - (this.charHeight / this.image.height);
	
	return new Vector4(xPos, height, width, yPos);
};
