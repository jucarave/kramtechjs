var KT = require('./KTMain');
var Material = require('./KTMaterial');

function MaterialBasic(color, opacity){
	this.__ktmaterial = true;
	
	var material = new Material({
		color: color,
		opacity: opacity,
		shader: KT.shaders.basic
	});
	
	this.color = material.color;
	this.shader = material.shader;
	this.opacity = material.opacity;
	this.drawFaces = material.drawFaces;
	this.drawAs = material.drawAs;
}

module.exports = MaterialBasic;
