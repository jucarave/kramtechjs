var KT = require('./KTMain');
var Color = require('./KTColor');

function Scene(params){
	this.__ktscene = true;
	
	this.meshes = [];
	this.lights = [];
	this.shadingMode = ['BASIC', 'LAMBERT'];
	
	if (!params) params = {};
	this.useLighting = (params.useLighting)? true : false;
	this.ambientLight = (params.ambientLight)? new Color(params.ambientLight) : null;
}

module.exports = Scene;

Scene.prototype.add = function(object){
	if (object.__ktmesh){
		this.meshes.push(object);
	}else if (object.__ktdirLight || object.__ktpointlight){
		this.lights.push(object);
	}else{
		throw "Can't add the object to the scene";
	}
	
	return this;
};

Scene.prototype.drawMesh = function(mesh, camera){
	if (!mesh.geometry.ready) return;
	
	var gl = KT.gl;
	
	var material = mesh.material;
	var shader = material.shader;
	
	KT.switchProgram(shader);
	this.setMaterialAttributes(mesh.material);
	
	material.sendAttribData(mesh, camera, this);
	material.sendUniformData(mesh, camera, this);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.facesBuffer);
	gl.drawElements(gl[material.drawAs], mesh.geometry.facesBuffer.numItems, gl.UNSIGNED_SHORT, 0);
};

Scene.prototype.clear = function(){
	KT.gl.clear(KT.gl.COLOR_BUFFER_BIT | KT.gl.DEPTH_BUFFER_BIT);
};

Scene.prototype.renderToFramebuffer = function(camera, framebuffer){
	if (!framebuffer.__kttextureframebuffer) throw "framebuffer must be an instance of TextureFramebuffer";
	
	var gl = KT.gl;
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);
	this.render(camera);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

Scene.prototype.render = function(camera){
	var gl = KT.gl;
	
	gl.disable( gl.BLEND ); 
	var transparents = [];
	
	if (camera.controls) camera.controls.update();
	
	if (camera.skybox){
		var sky = camera.skybox.meshes;
		for (var i=0,len=sky.length;i<len;i++){
			this.drawMesh(sky[i], camera);
		}
	}
	
	for (var i=0,len=this.meshes.length;i<len;i++){
		var mesh = this.meshes[i];
		if (!mesh.visible) continue;
		if (mesh.material.opacity == 0.0) continue;
		
		if (mesh.material.opacity != 1.0 || mesh.material.transparent){
			transparents.push(mesh);
			continue;
		}
		
		this.drawMesh(mesh, camera);
	}
	
	gl.enable( gl.BLEND ); 
	for (var i=0,len=transparents.length;i<len;i++){
		var mesh = transparents[i];
		this.drawMesh(mesh, camera);
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
