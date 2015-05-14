var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Vector4 = require('./KTVector4');
var Material = require('./KTMaterial');
var MaterialBasic = require('./KTMaterialBasic');
var Mesh = require('./KTMesh');
var GeometryPlane = require('./KTGeometryPlane');
var KT = require('./KTMain');

function GeometrySkybox(width, height, length, position, texture){
	this.meshes = [];
	this.texture = texture;
	
	this.boxGeo = new KT.GeometryBox(width, height, length);
	this.box = new KT.Mesh(this.boxGeo, new MaterialBasic());
	this.box.position = position;
	
	this.setMaterial();
}

module.exports = GeometrySkybox;

GeometrySkybox.material = null;
GeometrySkybox.prototype.setMaterial = function(){
	if (GeometrySkybox.material) return;
	
	var material = new Material({
		shader: KT.shaders.skybox,
		sendAttribData: function(mesh, camera, scene){
			var gl = KT.gl;
			var geometry = mesh.geometry;
			var attributes = this.shader.attributes;
			for (var i=0,len=attributes.length;i<len;i++){
				var att = attributes[i];
				
				if (att.name == "aVertexPosition"){
					gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vertexBuffer);
					gl.vertexAttribPointer(att.location, geometry.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
				}
			}
		},
		sendUniformData: function(mesh, camera, scene, texture){
			var gl = KT.gl;
			var uniforms = this.shader.uniforms;
			for (var i=0,len=uniforms.length;i<len;i++){
				var uni = uniforms[i];
				
				if (uni.name == 'uMVPMatrix'){
					var mvp = mesh.getTransformationMatrix().multiply(camera.transformationMatrix).multiply(camera.perspectiveMatrix);
					gl.uniformMatrix4fv(uni.location, false, mvp.toFloat32Array());
				}else if (uni.name == 'uCubemap'){
					gl.activeTexture(gl.TEXTURE0);
					gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture.texture);
					gl.uniform1i(uni.location, 0);
				}
			}
		}
	});
	
	GeometrySkybox.material = material;
};

GeometrySkybox.prototype.render = function(camera, scene){
	var material = GeometrySkybox.material;
	
	material.sendAttribData(this.box, camera, scene);
	material.sendUniformData(this.box, camera, scene, this.texture);
};
