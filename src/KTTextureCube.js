var KT = require('./KTMain');
var Utils = require('./KTUtils');
var Vector2 = require('./KTVector2');

function TextureCube(posX, negX, posY, negY, posZ, negZ, params){
	this.__kttexture = true;
	
	var gl = KT.gl;
	
	if (!params) params = {};
	this.params = params;
	this.minFilter = (params.minFilter)? params.minFilter : gl.LINEAR;
	this.magFilter = (params.magFilter)? params.magFilter : gl.LINEAR;
	this.wrapS = (params.SWrapping)? params.SWrapping : gl.CLAMP_TO_EDGE;
	this.wrapT = (params.TWrapping)? params.TWrapping : gl.CLAMP_TO_EDGE;	
	this.generateMipmap = (params.generateMipmap)? true : false;
	
	this.images = [];
	this.texture = null;
	
	this.images[0] = this.loadImage(posX);
	this.images[1] = this.loadImage(negX);
	this.images[2] = this.loadImage(posY);
	this.images[3] = this.loadImage(negY);
	this.images[4] = this.loadImage(posZ);
	this.images[5] = this.loadImage(negZ);
}

module.exports = TextureCube;

TextureCube.prototype.loadImage = function(src){
	var img = KT.getImage(src);
	var image;
	if (img){
		image = img;
		parseTexture();
	}else{
		image = new Image();
		image.src = src;
		image.ready = false;
		
		var T = this;
		Utils.addEvent(image, "load", function(){
			image.ready = true;
			KT.images.push({src: src, img: image});
			T.parseTexture();
		});
	}
	
	return image;
};

TextureCube.prototype.parseTexture = function(){
	for (var i=0,len=this.images.length;i<len;i++){
		if (!this.images[i].ready)
			return;
	}
	
	var gl = KT.gl;
	var types = [gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
				 gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
				 gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z];
	
	
	this.texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
	
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	
	var color = [
		new Uint8Array([255, 0, 0]),
		new Uint8Array([0, 255, 0]),
		new Uint8Array([0, 0, 255]),
		new Uint8Array([255, 255, 0]),
		new Uint8Array([255, 0, 255]),
		new Uint8Array([0, 255, 255]),
	];
	for (var i=0;i<6;i++){
		gl.texImage2D(types[i], 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, color[i]);
	}
	
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.magFilter);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.minFilter);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this.wrapS);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this.wrapT);
	
	if (this.generateMipmap)
		gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
	
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
};
