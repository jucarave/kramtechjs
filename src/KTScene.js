var KT = require('./KTMain');

function Scene(){
	this.__ktscene = true;
	
	this.meshes = [];
}

module.exports = Scene;

Scene.prototype.add = function(object){
	if (object.__ktmesh){
		this.meshes.push(object);
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
		
		var shader = mesh.material.shader;
		if (!shader){
			console.info("Material doesn't have a shader");
			continue;
		}
		
		this.setMaterialAttributes(mesh.material);
		
		gl.useProgram(shader.shaderProgram);
		
		this.sendAttribData(mesh, shader.attributes, camera);
		this.sendUniformData(mesh, shader.uniforms, camera);
		
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
		}
	}
	
	return this;
};

Scene.prototype.sendUniformData = function(mesh, uniforms, camera){
	var gl = KT.gl;
	var geometry = mesh.geometry;
	for (var i=0,len=uniforms.length;i<len;i++){
		var uni = uniforms[i];
		
		if (uni.name == 'uTransformationMatrix'){
			var transformationMatrix = mesh.getTransformationMatrix(camera);
			gl.uniformMatrix4fv(uni.location, false, transformationMatrix.toFloat32Array());
		}else if (uni.name == 'uPerspectiveMatrix'){
			gl.uniformMatrix4fv(uni.location, false, camera.perspectiveMatrix);
		}else if (uni.name == 'uMaterialColor'){
			var c = mesh.material.color.getRGBA();
			var color = [c[0] / 255, c[1] / 255, c[2] / 255, c[3]];
			gl.uniform4fv(uni.location, new Float32Array(color));
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
