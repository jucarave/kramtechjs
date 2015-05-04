var Material = require('./KTMaterial');
var Color = require('./KTColor');

function MaterialPhong(textureMap, color, opacity){
	this.__ktmaterial = true;
	
	var material = new Material({
		textureMap: textureMap,
		color: color,
		opacity: opacity,
		shader: KT.shaders.phong
	});
	
	this.textureMap = material.textureMap;
	this.specularMap = null;
	
	this.color = material.color;
	this.shader = material.shader;
	this.opacity = material.opacity;
	this.drawFaces = material.drawFaces;
	this.drawAs = material.drawAs;
	this.specularColor = new Color(Color._WHITE);
	this.shininess = 0.0;
	this.transparent = material.transparent;
}

module.exports = MaterialPhong;

MaterialPhong.prototype.sendAttribData = function(mesh, camera, scene){
	var gl = KT.gl;
	var geometry = mesh.geometry;
	var attributes = this.shader.attributes;
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

MaterialPhong.prototype.sendLightUniformData = function(light, uniform, modelTransformation){
	var gl = KT.gl;
	for (var i=0,len=uniform.data.length;i<len;i++){
		var dat = uniform.data[i];
		
		if (dat.name == 'position'){
			if (light.__ktpointlight || light.__ktspotlight){
				gl.uniform3f(dat.location, light.position.x, light.position.y, light.position.z);
			}else{
				gl.uniform3f(dat.location, 0.0, 0.0, 0.0);
			}
		}else if (dat.name == 'direction'){
			if (light.__ktdirLight){
				gl.uniform3f(dat.location, light.direction.x, light.direction.y, light.direction.z);
			}else{
				gl.uniform3f(dat.location, 0.0, 0.0, 0.0);
			}
		}else if (dat.name == 'spotDirection'){
			if (light.__ktspotlight){
				gl.uniform3f(dat.location, light.direction.x, light.direction.y, light.direction.z);
			}else{
				gl.uniform3f(dat.location, 0.0, 0.0, 0.0);
			}
		}else if (dat.name == 'color'){
			var color = light.color.getRGB();
			gl.uniform3f(dat.location, color[0], color[1], color[2]);
		}else if (dat.name == 'intensity'){
			gl.uniform1f(dat.location, light.intensity);
		}else if (dat.name == 'outerAngle'){
			if (light.__ktspotlight){
				gl.uniform1f(dat.location, light.outerAngle);
			}else{
				gl.uniform1f(dat.location, 0.0);
			}
		}else if (dat.name == 'innerAngle'){
			if (light.__ktspotlight){
				gl.uniform1f(dat.location, light.innerAngle);
			}else{
				gl.uniform1f(dat.location, 0.0);
			}
		}else if (dat.name == 'mvProjection'){
			if (light.__ktspotlight && light.castShadow){
				var mvp = modelTransformation.clone()
							.multiply(light.shadowCam.transformationMatrix)
							.multiply(light.shadowCam.perspectiveMatrix)
							.multiply(KT.lightNDCMat);
				gl.uniformMatrix4fv(dat.location, false, mvp.toFloat32Array());
			}else{
				gl.uniformMatrix4fv(dat.location, false, Matrix4.getIdentity().toFloat32Array());
			}
		}else if (dat.name == 'castShadow'){
			gl.uniform1i(dat.location, (light.castShadow)? 1 : 0);
		}
	}
};

MaterialPhong.prototype.sendUniformData = function(mesh, camera, scene){
	var gl = KT.gl;
	var geometry = mesh.geometry;
	var transformationMatrix;
	var uniforms = this.shader.uniforms;
	var modelTransformation;
	var lights = scene.lights;
	var lightsCount = 0;
	
	var usedLightUniform = null;
	var shadowMapsUniform = [];
	
	for (var i=0,len=uniforms.length;i<len;i++){
		var uni = uniforms[i];
		
		if (uni.multi && uni.type == 'Light'){
			if (lightsCount == uni.data.length)
				continue;
				
			for (var j=0,jlen=lights.length;j<jlen;j++){
				this.sendLightUniformData(lights[j], uni.data[lightsCount++], modelTransformation);
			}
		}else if (uni.type == 'shadowMaps'){
			shadowMapsUniform.push(uni);
		}else if (uni.name == 'uMVMatrix'){
			modelTransformation = mesh.getTransformationMatrix();
			transformationMatrix = modelTransformation.clone().multiply(camera.transformationMatrix);
			gl.uniformMatrix4fv(uni.location, false, transformationMatrix.toFloat32Array());
		}else if (uni.name == 'uPMatrix'){
			gl.uniformMatrix4fv(uni.location, false, camera.perspectiveMatrix.toFloat32Array());
		}else if (uni.name == 'uMaterialColor'){
			var color = mesh.material.color.getRGBA();
			gl.uniform4fv(uni.location, new Float32Array(color));
		}else if (uni.name == 'uTextureSampler'){
			if (mesh.material.textureMap){
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, mesh.material.textureMap.texture);
				gl.uniform1i(uni.location, 0);
			}
		}else if (uni.name == 'uHasTexture'){
			gl.uniform1i(uni.location, (mesh.material.textureMap)? 1 : 0);
		}else if (uni.name == 'uUseLighting'){
			gl.uniform1i(uni.location, (scene.useLighting)? 1 : 0);
		}else if (uni.name == 'uReceiveShadow'){
			gl.uniform1i(uni.location, (mesh.receiveShadow)? 1 : 0);
		}else if (uni.name == 'uNormalMatrix'){
			var normalMatrix = modelTransformation.toMatrix3().inverse().toFloat32Array();
			gl.uniformMatrix3fv(uni.location, false, normalMatrix);
		}else if (uni.name == 'uModelMatrix'){
			gl.uniformMatrix4fv(uni.location, false, modelTransformation.toFloat32Array());
		}else if (uni.name == 'uCameraPosition'){
			gl.uniform3f(uni.location, camera.position.x, camera.position.y, camera.position.z);
		}else if (uni.name == 'uSpecularColor'){
			var color = this.specularColor.getRGB();
			gl.uniform3f(uni.location, color[0], color[1], color[2]);
		}else if (uni.name == 'uShininess'){
			gl.uniform1f(uni.location, this.shininess);
		}else if (uni.name == 'uAmbientLightColor' && scene.useLighting && scene.ambientLight){
			var color = scene.ambientLight.getRGB();
			gl.uniform3f(uni.location, color[0], color[1], color[2]);
		}else if (uni.name == 'uOpacity'){
			gl.uniform1f(uni.location, mesh.material.opacity);
		}else if (uni.name == 'uTextureRepeat' && mesh.material.textureMap){
			gl.uniform2f(uni.location, mesh.material.textureMap.repeat.x, mesh.material.textureMap.repeat.y);
		}else if (uni.name == 'uGeometryUV' && mesh.material.textureMap){
			gl.uniform4f(uni.location, mesh.geometry.uvRegion.x, mesh.geometry.uvRegion.y, mesh.geometry.uvRegion.z, mesh.geometry.uvRegion.w);
		}else if (uni.name == 'uTextureOffset' && mesh.material.textureMap){
			gl.uniform2f(uni.location, mesh.material.textureMap.offset.x, mesh.material.textureMap.offset.y);
		}else if (uni.name == 'usedLights'){
			usedLightUniform = uni;
		}else if (uni.name == 'uUseSpecularMap'){
			gl.uniform1i(uni.location, (mesh.material.specularMap)? 1 : 0);
		}else if (uni.name == 'uSpecularMapSampler'){
			if (mesh.material.specularMap){
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, mesh.material.specularMap.texture);
				gl.uniform1i(uni.location, 1);
			}
		}
	}
	
	if (usedLightUniform){
		gl.uniform1i(usedLightUniform.location, lightsCount);
	}
	
	if (shadowMapsUniform && shadowMapsUniform.length > 0){
		for (var i=0;i<lightsCount;i++){
			if (!lights[i].castShadow) continue;
			
			gl.activeTexture(gl.TEXTURE10 + i);
			gl.bindTexture(gl.TEXTURE_2D, lights[i].shadowBuffer.texture);
			gl.uniform1i(shadowMapsUniform[i].location, 10 + i);
		}
	}
	
	return this;
};