var KT = require('./KTMain');

function Scene(params){
	this.__ktscene = true;
	
	this.meshes = [];
	this.dirLight = null;
	
	if (!params) params = {};
	this.useLighting = (params.useLighting)? true : false;
}

module.exports = Scene;

Scene.prototype.add = function(object){
	if (object.__ktmesh){
		this.meshes.push(object);
	}else if (object.__ktdirLight){
		this.dirLight = object;
	}else{
		throw "Can't add the object to the scene";
	}
	
	return this;
};

Scene.prototype.render = function(camera){
	var gl = KT.gl;
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	for (var i=0,len=this.meshes.length;i<len;i++){
		var mesh = this.meshes[i];
		if (!mesh.visible) continue;
		if (mesh.material.opacity == 0.0) continue;
		
		this.setMaterialAttributes(mesh.material);
		
		this.sendAttribData(mesh, KT.shader.attributes, camera);
		this.sendUniformData(mesh, KT.shader.uniforms, camera);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.facesBuffer);
		gl.drawElements(gl[mesh.material.drawAs], mesh.geometry.facesBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
	
	return this;
};

Scene.prototype.sendAttribData = function(mesh, attributes, camera){
	var gl = KT.gl;
	var geometry = mesh.geometry;
	for (var i=0,len=attributes.length;i<len;i++){
		var att = attributes[i];
		
		if (att.name == "aVertexPosition"){
			gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vertexBuffer);
			gl.vertexAttribPointer(att.location, geometry.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		}else if (att.name == "aVertexColor"){
			gl.bindBuffer(gl.ARRAY_BUFFER, geometry.colorsBuffer);
			gl.vertexAttribPointer(att.location, geometry.colorsBuffer.itemSize, gl.FLOAT, false, 0, 0);
		}else if (att.name == "aTextureCoord"){
			gl.bindBuffer(gl.ARRAY_BUFFER, geometry.texBuffer);
			gl.vertexAttribPointer(att.location, geometry.texBuffer.itemSize, gl.FLOAT, false, 0, 0);
		}else if (att.name == "aVertexNormal"){
			gl.bindBuffer(gl.ARRAY_BUFFER, geometry.normalsBuffer);
			gl.vertexAttribPointer(att.location, geometry.normalsBuffer.itemSize, gl.FLOAT, false, 0, 0);
		}
	}
	
	return this;
};

Scene.prototype.sendUniformData = function(mesh, uniforms, camera){
	var gl = KT.gl;
	var geometry = mesh.geometry;
	var transformationMatrix;
	for (var i=0,len=uniforms.length;i<len;i++){
		var uni = uniforms[i];
		
		if (uni.name == 'uTransformationMatrix'){
			transformationMatrix = mesh.getTransformationMatrix(camera);
			gl.uniformMatrix4fv(uni.location, false, transformationMatrix.toFloat32Array());
		}else if (uni.name == 'uPerspectiveMatrix'){
			gl.uniformMatrix4fv(uni.location, false, camera.perspectiveMatrix);
		}else if (uni.name == 'uMaterialColor'){
			var color = mesh.material.color.getRGBA();
			gl.uniform4fv(uni.location, new Float32Array(color));
		}else if (uni.name == 'uTextureSampler'){
			if (mesh.material.texture){
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, mesh.material.texture.texture);
				gl.uniform1i(uni.location, 0);
			}
		}else if (uni.name == 'uHasTexture'){
			gl.uniform1i(uni.location, (mesh.material.texture)? 1 : 0);
		}else if (uni.name == 'uUseLighting'){
			gl.uniform1i(uni.location, (this.useLighting)? 1 : 0);
		}else if (uni.name == 'uNormalMatrix'){
			var normalMatrix = transformationMatrix.toMatrix3().inverse().toFloat32Array();
			gl.uniformMatrix3fv(uni.location, false, normalMatrix);
		}else if (uni.name == 'uLightDirection' && this.useLighting && this.dirLight){
			var dir = this.dirLight.direction;
			gl.uniform3f(uni.location, dir.x, dir.y, dir.z);
		}else if (uni.name == 'uLightDirectionColor' && this.useLighting && this.dirLight){
			var color = this.dirLight.color.getRGB();
			gl.uniform3f(uni.location, color[0], color[1], color[2]);
		}else if (uni.name == 'uLightDirectionIntensity' && this.useLighting && this.dirLight){
			gl.uniform1f(uni.location, this.dirLight.intensity);
		}
	}
	
	return this;
};

Scene.prototype.setMaterialAttributes = function(material){
	var gl = KT.gl;
	
	var cull = "BACK";
	if (material.drawFaces == 'BACK'){ cull = "FRONT"; }
	else if (material.drawFaces == 'BOTH'){ cull = ""; }
	
	if (cull != ""){
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl[cull]);
	}else{
		gl.disable(gl.CULL_FACE);
	}
};
