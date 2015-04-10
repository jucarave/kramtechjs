(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraPerspective.js":[function(require,module,exports){
var Matrix4 = require('./KTMatrix4');
var Color = require('./KTColor');
var Vector3 = require('./KTVector3');
var KTMath = require('./KTMath');

function CameraPerspective(position, rotation, fov, ratio, znear, zfar){
	this.__ktcamera = true;
	
	this.position = position;
	this.rotation = rotation;
	
	this.fov = fov;
	this.ratio = ratio;
	this.znear = znear;
	this.zfar = zfar;
	
	this.backgroundColor = new Color(Color._BLACK);
	
	this.getTransformationMatrix();
	this.setPerspective();
}

module.exports = CameraPerspective;

CameraPerspective.prototype.setPerspective = function(){
	var C = 1 / Math.tan(this.fov / 2);
	var R = C * this.ratio;
	var A = (this.znear + this.zfar) / (this.znear - this.zfar);
	var B = (2 * this.znear * this.zfar) / (this.znear - this.zfar);
	
	this.perspectiveMatrix = new Matrix4(
		C, 0, 0,  0,
		0, R, 0,  0,
		0, 0, A,  B,
		0, 0, -1, 0
	);
};

CameraPerspective.prototype.setBackgroundColor = function(color){
	this.backgroundColor = new Color(color);
};

CameraPerspective.prototype.getTransformationMatrix = function(){
	var pos = this.position.clone().multiply(-1);
	var rot = this.rotation.clone().multiply(-1);
	var camMat = Matrix4.getTransformation(pos, rot, null, 'STR');
	
	rot.multiply(-1);
	var camMatL = Matrix4.getTransformation(pos, rot, null, 'STR');
	
	this.transformationMatrix = camMat;
	this.NRTransformationMatrix = camMatL;
	return camMat;
};

CameraPerspective.prototype.lookAt = function(vector3){
	if (!vector3.__ktv3) throw "Can only look at a vector3";
	
	var forward = Vector3.vectorsDifference(this.position, vector3);
	var xzDist = Math.sqrt(forward.x * forward.x + forward.z * forward.z);
	
	var xAng = KTMath.get2DAngle(0, this.position.y, xzDist, vector3.y);
	var yAng = KTMath.get2DAngle(this.position.x, this.position.z, vector3.x, vector3.z) - KTMath.PI_2;
	
	this.rotation.set(
		xAng,
		yAng,
		0
	);
};

},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js":[function(require,module,exports){
function Color(hexColor){
	var str = hexColor.substring(1);
	var r = parseInt(str.substring(0, 2), 16);
	var g = parseInt(str.substring(2, 4), 16);
	var b = parseInt(str.substring(4, 6), 16);
	var a = parseInt(str.substring(6, 8), 16);
	
	this.color = [r / 255, g / 255, b / 255, a / 255];
}

module.exports = Color;

Color.prototype.set = function(hexColor){
	var str = hexColor.substring(1);
	var r = parseInt(str.substring(0, 2), 16);
	var g = parseInt(str.substring(2, 4), 16);
	var b = parseInt(str.substring(4, 6), 16);
	var a = parseInt(str.substring(6, 8), 16);
	
	this.color = [r / 255, g / 255, b / 255, a / 255];
};

Color.prototype.setRGB = function(red, green, blue){
	this.setRGBA(red, green, blue, 255);
};

Color.prototype.setRGBA = function(red, green, blue, alpha){
	this.color = [red / 255, green / 255, blue / 255, alpha];
};

Color.prototype.getRGB = function(){
	var c = this.getRGBA();
	
	return [c[0], c[1], c[2]];
};

Color.prototype.getRGBA = function(){
	return this.color;
};

Color.prototype.getHex = function(){
	var c = this.color;
	
	var r = (c[0] * 255).toString(16);
	var g = (c[1] * 255).toString(16);
	var b = (c[2] * 255).toString(16);
	var a = (c[3] * 255).toString(16);
	
	if (r.length == 1) r = "0" + r;
	if (g.length == 1) g = "0" + g;
	if (b.length == 1) b = "0" + b;
	if (a.length == 1) a = "0" + a;
	
	return ("#" + r + g + b + a).toUpperCase();
};

Color._BLACK		= "#000000FF";
Color._RED 			= "#FF0000FF";
Color._GREEN 		= "#00FF00FF";
Color._BLUE 		= "#0000FFFF";
Color._WHITE		= "#FFFFFFFF";
Color._YELLOW		= "#FFFF00FF";
Color._MAGENTA		= "#FF00FFFF";
Color._AQUA			= "#00FFFFFF";
Color._GOLD			= "#FFD700FF";
Color._GRAY			= "#808080FF";
Color._PURPLE		= "#800080FF";
},{}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js":[function(require,module,exports){
var KT = require('./KTMain');
var Color = require('./KTColor');
var Matrix4 = require('./KTMatrix4');
var Vector2 = require('./KTVector2');
var Vector3 = require('./KTVector3');

function Geometry(){
	this.__ktgeometry = true;
	
	this.vertices = [];
	this.triangles = [];
	this.uvCoords = [];
	this.colors = [];
	this.normals = [];
}

module.exports = Geometry;

Geometry.prototype.addVertice = function(x, y, z, color, tx, ty){
	if (!color) color = Color._WHITE;
	if (!tx) tx = 0;
	if (!ty) ty = 0;
	
	this.vertices.push(new Vector3(x, y, z));
	this.colors.push(new Color(color));
	this.uvCoords.push(new Vector2(tx, ty));
};

Geometry.prototype.addFace = function(vertice_0, vertice_1, vertice_2){
	if (!this.vertices[vertice_0]) throw "Invalid vertex index: " + vertice_0;
	if (!this.vertices[vertice_1]) throw "Invalid vertex index: " + vertice_1;
	if (!this.vertices[vertice_2]) throw "Invalid vertex index: " + vertice_2;
	
	this.triangles.push(new Vector3(vertice_0, vertice_1, vertice_2));
};

Geometry.prototype.addNormal = function(nx, ny, nz){
	this.normals.push(new Vector3(nx, ny, nz));
};

Geometry.prototype.build = function(){
	var vertices = [];
	var uvCoords = [];
	var triangles = [];
	var colors = [];
	var normals = [];
	
	for (var i=0,len=this.vertices.length;i<len;i++){ 
		var v = this.vertices[i]; 
		vertices.push(v.x, v.y, v.z); 
	}
	
	for (var i=0,len=this.uvCoords.length;i<len;i++){ 
		var v = this.uvCoords[i]; 
		uvCoords.push(v.x, v.y); 
	}
	
	for (var i=0,len=this.triangles.length;i<len;i++){ 
		var t = this.triangles[i]; 
		triangles.push(t.x, t.y, t.z); 
	}
	
	for (var i=0,len=this.colors.length;i<len;i++){ 
		var c = this.colors[i].getRGBA(); 
		
		colors.push(c[0], c[1], c[2], c[3]); 
	}
	
	for (var i=0,len=this.normals.length;i<len;i++){
		var n = this.normals[i];
		normals.push(n.x, n.y, n.z);
	}
	
	this.vertexBuffer = KT.createArrayBuffer("ARRAY_BUFFER", new Float32Array(vertices), 3);
	this.texBuffer = KT.createArrayBuffer("ARRAY_BUFFER", new Float32Array(uvCoords), 2);
	this.facesBuffer = KT.createArrayBuffer("ELEMENT_ARRAY_BUFFER", new Uint16Array(triangles), 1);
	this.colorsBuffer = KT.createArrayBuffer("ARRAY_BUFFER", new Float32Array(colors), 4);
	this.normalsBuffer = KT.createArrayBuffer("ARRAY_BUFFER", new Float32Array(normals), 3);
	
	return this;
};

Geometry.prototype.computeFacesNormals = function(){
	this.normals = [];
	
	var normalizedVertices = [];
	for (var i=0,len=this.triangles.length;i<len;i++){
		var face = this.triangles[i];
		var v0 = this.vertices[face.x];
		var v1 = this.vertices[face.y];
		var v2 = this.vertices[face.z];
		
		var dir1 = Vector3.vectorsDifference(v1, v0);
		var dir2 = Vector3.vectorsDifference(v2, v0);
		
		var normal = dir1.cross(dir2).normalize();
		
		if (normalizedVertices.indexOf(face.x) == -1) this.normals.push(normal);
		if (normalizedVertices.indexOf(face.y) == -1) this.normals.push(normal);
		if (normalizedVertices.indexOf(face.z) == -1) this.normals.push(normal);
		
		normalizedVertices.push(face.x, face.y, face.z);
	}
	
	return this;
};

},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryBox.js":[function(require,module,exports){
var Color = require('./KTColor');
var Geometry = require('./KTGeometry');

function GeometryBox(width, length, height, params){
	this.__ktgeometry = true;
	
	var boxGeo = new Geometry();
	
	var w = width / 2;
	var l = length / 2;
	var h = height / 2;
	
	if (!params) params = {};
	this.params = params;
	
	var hr = (params.horizontalRepeats)? params.horizontalRepeats : 1.0;
	var vr = (params.verticalRepeats)? params.verticalRepeats : 1.0;
	
	boxGeo.addVertice( w, -h,  l, Color._WHITE,  hr, 0.0);
	boxGeo.addVertice(-w,  h,  l, Color._WHITE, 0.0,  vr);
	boxGeo.addVertice(-w, -h,  l, Color._WHITE, 0.0, 0.0);
	boxGeo.addVertice( w,  h,  l, Color._WHITE,  hr,  vr);
	
	boxGeo.addVertice(-w, -h, -l, Color._WHITE, 0.0, 0.0);
	boxGeo.addVertice(-w,  h, -l, Color._WHITE, 0.0,  vr);
	boxGeo.addVertice( w, -h, -l, Color._WHITE,  hr, 0.0);
	boxGeo.addVertice( w,  h, -l, Color._WHITE,  hr,  vr);
	
	boxGeo.addVertice( w, -h, -l, Color._WHITE,  hr, 0.0);
	boxGeo.addVertice( w,  h,  l, Color._WHITE, 0.0,  vr);
	boxGeo.addVertice( w, -h,  l, Color._WHITE, 0.0, 0.0);
	boxGeo.addVertice( w,  h, -l, Color._WHITE,  hr,  vr);
	
	boxGeo.addVertice(-w, -h,  l, Color._WHITE,  hr, 0.0);
	boxGeo.addVertice(-w,  h,  l, Color._WHITE,  hr,  vr);
	boxGeo.addVertice(-w, -h, -l, Color._WHITE, 0.0, 0.0);
	boxGeo.addVertice(-w,  h, -l, Color._WHITE, 0.0,  vr);
	
	boxGeo.addVertice( w,  h,  l, Color._WHITE,  hr, 0.0);
	boxGeo.addVertice(-w,  h, -l, Color._WHITE, 0.0,  vr);
	boxGeo.addVertice(-w,  h,  l, Color._WHITE, 0.0, 0.0);
	boxGeo.addVertice( w,  h, -l, Color._WHITE,  hr,  vr);
	
	boxGeo.addVertice(-w, -h,  l, Color._WHITE, 0.0,  vr);
	boxGeo.addVertice(-w, -h, -l, Color._WHITE, 0.0, 0.0);
	boxGeo.addVertice( w, -h,  l, Color._WHITE,  hr,  vr);
	boxGeo.addVertice( w, -h, -l, Color._WHITE,  hr, 0.0);
	
	boxGeo.addFace(0, 1, 2);
	boxGeo.addFace(0, 3, 1);
	
	boxGeo.addFace(4, 5, 6);
	boxGeo.addFace(5, 7, 6);
	
	boxGeo.addFace(8, 9, 10);
	boxGeo.addFace(8, 11, 9);
	
	boxGeo.addFace(12, 13, 14);
	boxGeo.addFace(13, 15, 14);
	
	boxGeo.addFace(16, 17, 18);
	boxGeo.addFace(16, 19, 17);
	
	boxGeo.addFace(20, 21, 22);
	boxGeo.addFace(21, 23, 22);
	
	boxGeo.computeFacesNormals();
	boxGeo.build();
	
	this.vertexBuffer = boxGeo.vertexBuffer;
	this.texBuffer = boxGeo.texBuffer;
	this.facesBuffer = boxGeo.facesBuffer;
	this.colorsBuffer = boxGeo.colorsBuffer;
	this.normalsBuffer = boxGeo.normalsBuffer;
}

module.exports = GeometryBox;
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryPlane.js":[function(require,module,exports){
var Color = require('./KTColor');
var Geometry = require('./KTGeometry');

function GeometryPlane(width, height, params){
	this.__ktgeometry = true;
	
	var planeGeo = new Geometry();
	
	var w = width / 2;
	var h = height / 2;
	
	if (!params) params = {};
	this.params = params;
	
	var hr = (params.horizontalRepeats)? params.horizontalRepeats : 1.0;
	var vr = (params.verticalRepeats)? params.verticalRepeats : 1.0;
	
	planeGeo.addVertice( w, 0,  h, Color._WHITE,  hr,  vr);
	planeGeo.addVertice(-w, 0, -h, Color._WHITE, 0.0, 0.0);
	planeGeo.addVertice(-w, 0,  h, Color._WHITE, 0.0,  vr);
	planeGeo.addVertice( w, 0, -h, Color._WHITE,  hr, 0.0);
	
	planeGeo.addFace(0, 1, 2);
	planeGeo.addFace(0, 3, 1);
	
	planeGeo.computeFacesNormals();
	planeGeo.build();
	
	this.vertexBuffer = planeGeo.vertexBuffer;
	this.texBuffer = planeGeo.texBuffer;
	this.facesBuffer = planeGeo.facesBuffer;
	this.colorsBuffer = planeGeo.colorsBuffer;
	this.normalsBuffer = planeGeo.normalsBuffer;
}

module.exports = GeometryPlane;
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometrySphere.js":[function(require,module,exports){
var Color = require('./KTColor');
var Geometry = require('./KTGeometry');

function GeometrySphere(radius, latBands, lonBands, params){
	this.__ktgeometry = true;
	
	var sphGeo = new Geometry();
	
	if (!params) params = {};
	this.params = params;
	
	var hr = (params.horizontalRepeats)? params.horizontalRepeats : 1.0;
	var vr = (params.verticalRepeats)? params.verticalRepeats : 1.0;
	var hs = (params.halfSphere)? 1.0 : 2.0;
	
	for (var latN=0;latN<=latBands;latN++){
		var theta = latN * Math.PI / latBands;
		var cosT = Math.cos(theta);
		var sinT = Math.sin(theta);
		
		for (var lonN=0;lonN<=lonBands;lonN++){
			var phi = lonN * hs * Math.PI / lonBands;
			var cosP = Math.cos(phi);
			var sinP = Math.sin(phi);
			
			var x = cosP * sinT;
			var y = cosT;
			var z = sinP * sinT;
			
			var tx = lonN / lonBands;
			var ty = 1 - latN / latBands;
			
			sphGeo.addNormal(x, y, z);
			sphGeo.addVertice(x * radius, y * radius, z * radius, Color._WHITE, tx * hr, ty * vr);
		}
	}
	
	for (var latN=0;latN<latBands;latN++){
		for (var lonN=0;lonN<lonBands;lonN++){
			var i1 = lonN + (latN * (lonBands + 1));
			var i2 = i1 + lonBands + 1;
			var i3 = i1 + 1;
			var i4 = i2 + 1;
			
			sphGeo.addFace(i4, i1, i3);
			sphGeo.addFace(i4, i2, i1);
		}
	}
	
	sphGeo.build();
	
	this.vertexBuffer = sphGeo.vertexBuffer;
	this.texBuffer = sphGeo.texBuffer;
	this.facesBuffer = sphGeo.facesBuffer;
	this.colorsBuffer = sphGeo.colorsBuffer;
	this.normalsBuffer = sphGeo.normalsBuffer;
}

module.exports = GeometrySphere;
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightDirectional.js":[function(require,module,exports){
var Color = require('./KTColor');

function DirectionalLight(direction, color, intensity){
	this.__ktdirLight = true;
	
	this.direction = direction.normalize();
	this.direction.multiply(-1);
	
	this.color = new Color((color)? color: Color._WHITE);
	this.intensity = (intensity !== undefined)? intensity : 1.0;
}

module.exports = DirectionalLight;


},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js":[function(require,module,exports){
var Shaders = require('./KTShaders');

module.exports = {
	init: function(canvas){
		this.canvas = canvas;
		this.gl = null;
		this.shaders = {};
		
		this.__initContext(canvas);
		this.__initProperties();
		this.__initShaders();
	},
	
	__initContext: function(canvas){
		this.gl = canvas.getContext('experimental-webgl');
		
		if (!this.gl){
			alert("Your browser doesn't support WebGL");
			return false;
		}
		
		this.gl.width = canvas.width;
		this.gl.height = canvas.height;
	},
	
	__initProperties: function(){
		var gl = this.gl;
		
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		
		gl.enable(gl.CULL_FACE);
		
		gl.disable( gl.BLEND );
		gl.blendEquation( gl.FUNC_ADD );
		gl.blendFunc( gl.SRC_ALPHA, gl.ONE );
	},
	
	__initShaders: function(){
		this.shader = this.processShader(Shaders);
		this.gl.useProgram(this.shader.shaderProgram);
	},
	
	createArrayBuffer: function(type, dataArray, itemSize){
		var gl = this.gl;
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl[type], buffer);
		gl.bufferData(gl[type], dataArray, gl.STATIC_DRAW);
		buffer.numItems = dataArray.length;
		buffer.itemSize = itemSize;
		
		return buffer;
	},
	
	processShader: function(shader){
		var gl = this.gl;
		
		var vCode = shader.vertexShader;
		var vShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vShader, vCode);
		gl.compileShader(vShader);
		
		var fCode = shader.fragmentShader;
		var fShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fShader, fCode);
		gl.compileShader(fShader);
		
		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vShader);
		gl.attachShader(shaderProgram, fShader);
		gl.linkProgram(shaderProgram);
		
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
			console.error("Error initializing the shader program");
			throw gl.getShaderInfoLog(shaderProgram);
		}
		
		var attributes = [];
		for (var i=0,len=shader.attributes.length;i<len;i++){
			var att = shader.attributes[i];
			var location = gl.getAttribLocation(shaderProgram, att.name);
			
			gl.enableVertexAttribArray(location);
			
			attributes.push({
				name: att.name,
				type: att.type,
				location: location
			});
		}
		
		var uniforms = [];
		for (var i=0,len=shader.uniforms.length;i<len;i++){
			var uni = shader.uniforms[i];
			var location = gl.getUniformLocation(shaderProgram, uni.name);
			
			uniforms.push({
				name: uni.name,
				type: uni.type,
				location: location
			});
		}
		
		return {
			shaderProgram: shaderProgram,
			attributes: attributes,
			uniforms: uniforms
		};
	}
};



},{"./KTShaders":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTShaders.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js":[function(require,module,exports){
var Color = require('./KTColor');

function Material(parameters){
	this.__ktmaterial = true;
	
	if (!parameters) parameters = {};
	
	this.texture = (parameters.texture)? parameters.texture : null;
	this.color = new Color((parameters.color)? parameters.color : Color._WHITE);
	this.opacity = (parameters.opacity)? parameters.opacity : 1.0;
	this.drawFaces = (parameters.drawFaces)? parameters.drawFaces : 'FRONT';
	this.drawAs = (parameters.drawAs)? parameters.drawAs : 'TRIANGLES';
	this.shading = (parameters.shading)? parameters.shading : 'BASIC';
}

module.exports = Material;
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialBasic.js":[function(require,module,exports){
var Material = require('./KTMaterial');

function MaterialBasic(texture, color){
	this.__ktmaterial = true;
	
	var material = new Material({
		texture: texture,
		color: color
	});
	
	this.texture = material.texture;
	this.color = material.color;
	this.shader = material.shader;
	this.opacity = material.opacity;
	this.drawFaces = material.drawFaces;
	this.drawAs = material.drawAs;
	this.shading = material.shading;
}

module.exports = MaterialBasic;

},{"./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialLambert.js":[function(require,module,exports){
var Material = require('./KTMaterial');

function MaterialLambert(texture, color, opacity){
	this.__ktmaterial = true;
	
	var material = new Material({
		texture: texture,
		color: color,
		opacity: opacity,
		shading: 'LAMBERT'
	});
	
	this.texture = material.texture;
	this.color = material.color;
	this.shader = material.shader;
	this.opacity = material.opacity;
	this.drawFaces = material.drawFaces;
	this.drawAs = material.drawAs;
	this.shading = material.shading;
}

module.exports = MaterialLambert;

},{"./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js":[function(require,module,exports){
module.exports = {
	radDegRel: Math.PI / 180,
	
	PI_2: Math.PI / 2,
	PI: Math.PI,
	PI3_2: Math.PI * 3 / 2,
	PI2: Math.PI * 2,
	
	degToRad: function(degrees){
		return degrees * this.radDegRel;
	},
	
	radToDeg: function(radians){
		return radians / this.radDegRel;
	},
	
	get2DAngle: function(x1, y1, x2, y2){
		var xx = Math.abs(x2 - x1);
		var yy = Math.abs(y2 - y1);
		
		var ang = Math.atan2(yy, xx);
		
		if (x2 <= x1 && y2 <= y1){
			ang = this.PI - ang;
		}else if (x2 <= x1 && y2 > y1){
			ang = this.PI + ang;
		}else if (x2 > x1 && y2 > y1){
			ang = this.PI2 - ang;
		}
		
		ang = (ang + this.PI2) % this.PI2;
		
		return ang;
	}
};

},{}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix3.js":[function(require,module,exports){
function Matrix3(){
	if (arguments.length != 9) throw "Matrix 3 must receive 9 parameters";
	
	var c = 0;
	for (var i=0;i<9;i+=3){
		this[c] = arguments[i];
		this[c+3] = arguments[i+1];
		this[c+6] = arguments[i+2];
		
		c += 1;
	}
	
	this.__ktmt3 = true;
	
	return this;
}

module.exports = Matrix3;

Matrix3.prototype.getDeterminant = function(){
	var T = this;
	var det = (T[0] * T[4] * T[8]) + (T[1] * T[5] * T[6]) + (T[2] * T[3] * T[7])
			- (T[6] * T[4] * T[2]) - (T[7] * T[5] * T[0]) - (T[8] * T[3] * T[1]);
	
	return det;
};

Matrix3.prototype.inverse = function(){
	var det = this.getDeterminant();
	if (det == 0) return null;
	
	var T = this;
	var inv = new Matrix3(
		T[4]*T[8]-T[5]*T[7],	T[5]*T[6]-T[3]*T[8],	T[3]*T[7]-T[4]*T[6],
		T[2]*T[7]-T[1]*T[8],	T[0]*T[8]-T[2]*T[6],	T[1]*T[6]-T[0]*T[7],
		T[1]*T[5]-T[2]*T[4],	T[2]*T[3]-T[0]*T[5],	T[0]*T[4]-T[1]*T[3]
	);
	
	inv.multiply(1 / det);
	this.copy(inv);
	
	return this;
};

Matrix3.prototype.multiply = function(number){
	var T = this;
	for (var i=0;i<9;i++){
		T[i] *= number;
	}
	
	return this;
};

Matrix3.prototype.copy = function(matrix3){
	if (!matrix3.__ktmt3) throw "Can only copy a matrix3 into another";
	
	var T = this;
	for (var i=0;i<9;i++){
		T[i] = matrix3[i];
	}
	
	return this;
};

Matrix3.prototype.transpose = function(){
	var T = this;
	var values = [
		T[0], T[3], T[6],
		T[1], T[4], T[7],
		T[2], T[5], T[8]
	];
	
	for (var i=0;i<9;i++){
		T[i] = values[i];
	}
	
	return this;
};

Matrix3.prototype.toFloat32Array = function(){
	var T = this;
	return new Float32Array([
		T[0], T[1], T[2],
		T[3], T[4], T[5],
		T[6], T[7], T[8]
	]);
};

},{}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js":[function(require,module,exports){
var Matrix3 = require('./KTMatrix3');

function Matrix4(){
	if (arguments.length != 16) throw "Matrix 4 must receive 16 parameters";
	
	var c = 0;
	for (var i=0;i<16;i+=4){
		this[c] = arguments[i];
		this[c+4] = arguments[i+1];
		this[c+8] = arguments[i+2];
		this[c+12] = arguments[i+3];
		
		c += 1;
	}
	
	this.__ktm4 = true;
	
	return this;
}

module.exports = Matrix4;

Matrix4.prototype.identity = function(){
	var params = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
	
	var c = 0;
	for (var i=0;i<16;i+=4){
		this[c] = params[i];
		this[c+4] = params[i+1];
		this[c+8] = params[i+2];
		this[c+12] = params[i+3];
		
		c += 1;
	}
	
	return this;
};

Matrix4.prototype.multiplyScalar = function(number){
	var T = this;
	for (var i=0;i<16;i++){
		T[i] *= number;
	}
	
	return this;
};

Matrix4.prototype.multiply = function(matrix4){
	if (matrix4.__ktm4){
		var A1 = [this[0],  this[1],  this[2],  this[3]];
		var A2 = [this[4],  this[5],  this[6],  this[7]];
		var A3 = [this[8],  this[9],  this[10], this[11]];
		var A4 = [this[12], this[13], this[14], this[15]];
		
		var B1 = [matrix4[0], matrix4[4], matrix4[8],  matrix4[12]];
		var B2 = [matrix4[1], matrix4[5], matrix4[9],  matrix4[13]];
		var B3 = [matrix4[2], matrix4[6], matrix4[10], matrix4[14]];
		var B4 = [matrix4[3], matrix4[7], matrix4[11], matrix4[15]];
		
		var dot = function(col, row){
			var sum = 0;
			for (var j=0;j<4;j++){ sum += row[j] * col[j]; }
			return sum;
		};
		
		this[0] = dot(A1, B1);   this[1] = dot(A1, B2);   this[2] = dot(A1, B3);   this[3] = dot(A1, B4);
		this[4] = dot(A2, B1);   this[5] = dot(A2, B2);   this[6] = dot(A2, B3);   this[7] = dot(A2, B4);
		this[8] = dot(A3, B1);   this[9] = dot(A3, B2);   this[10] = dot(A3, B3);  this[11] = dot(A3, B4);
		this[12] = dot(A4, B1);  this[13] = dot(A4, B2);  this[14] = dot(A4, B3);  this[15] = dot(A4, B4);
		
		return this;
	}else if (matrix4.length == 4){
		var ret = [];
		var col = matrix4;
	
		for (var i=0;i<16;i+=4){
			var row = [this[i], this[i+1], this[i+2], this[i+3]];
			var sum = 0;
			
			for (var j=0;j<4;j++){
				sum += row[j] * col[j];
			}
			
			ret.push(sum);
		}
		
		return ret;
	}else{
		throw "Invalid constructor";
	}
};

Matrix4.prototype.transpose = function(){
	var T = this;
	var values = [
		T[0], T[4], T[8],  T[12],
		T[1], T[5], T[9],  T[13],
		T[2], T[6], T[10], T[14],
		T[3], T[7], T[11], T[15],
	];
	
	for (var i=0;i<16;i++){
		this[i] = values[i];
	}
	
	return this;
};

Matrix4.prototype.copy = function(matrix4){
	if (!matrix4.__ktm4) throw "Can only copy a Matrix4 into this matrix";
	
	for (var i=0;i<16;i++){
		this[i] = matrix4[i];
	}
	
	return this;
};

Matrix4.prototype.clone = function(){
	var T = this;
	return new Matrix4(
		T[0], T[4], T[8],  T[12],
		T[1], T[5], T[9],  T[13],
		T[2], T[6], T[10], T[14],
		T[3], T[7], T[11], T[15]
	);
};

Matrix4.prototype.toFloat32Array = function(){
	var T = this;
	return new Float32Array([
		T[0], T[1], T[2],  T[3],
		T[4], T[5], T[6],  T[7],
		T[8], T[9], T[10], T[11],
		T[12], T[13], T[14], T[15]
	]);
};

Matrix4.prototype.toMatrix3 = function(){
	var T = this;
	return new Matrix3(
		T[0], T[1], T[2],
		T[4], T[5], T[6],
		T[8], T[9], T[10]
	); 
};

Matrix4.getIdentity = function(){
	return new Matrix4(
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	);
};

Matrix4.getXRotation = function(radians){
	var C = Math.cos(radians);
	var S = Math.sin(radians);
	
	return new Matrix4(
		1,  0,  0, 0,
		0,  C,  S, 0,
		0, -S,  C, 0,
		0,  0,  0, 1
	);
};

Matrix4.getYRotation = function(radians){
	var C = Math.cos(radians);
	var S = Math.sin(radians);
	
	return new Matrix4(
		 C,  0,  S, 0,
		 0,  1,  0, 0,
		-S,  0,  C, 0,
		 0,  0,  0, 1
	);
};

Matrix4.getZRotation = function(radians){
	var C = Math.cos(radians);
	var S = Math.sin(radians);
	
	return new Matrix4(
		 C,  S, 0, 0,
		-S,  C, 0, 0,
		 0,  0, 1, 0,
		 0,  0, 0, 1
	);
};

Matrix4.getTranslation = function(vector3){
	if (!vector3.__ktv3) throw "Can only translate to a vector 3";
	
	var x = vector3.x;
	var y = vector3.y;
	var z = vector3.z;
	
	return new Matrix4(
		1, 0, 0, x,
		0, 1, 0, y,
		0, 0, 1, z,
		0, 0, 0, 1
	);
};

Matrix4.getScale = function(vector3){
	if (!vector3.__ktv3) throw "Can only scale to a vector 3";
	
	var sx = vector3.x;
	var sy = vector3.y;
	var sz = vector3.z;
	
	return new Matrix4(
		sx,  0,  0, 0,
		 0, sy,  0, 0,
		 0,  0, sz, 0,
		 0,  0,  0, 1
	);
};

Matrix4.getTransformation = function(position, rotation, scale, order){
	if (!position.__ktv3) throw "Position must be a Vector3";
	if (!rotation.__ktv3) throw "Rotation must be a Vector3";
	if (scale && !scale.__ktv3) throw "Scale must be a Vector3";
	
	var scale = (scale)? Matrix4.getScale(scale) : Matrix4.getIdentity();
	
	var rotationX = Matrix4.getXRotation(rotation.x);
	var rotationY = Matrix4.getYRotation(rotation.y);
	var rotationZ = Matrix4.getZRotation(rotation.z);
	
	var translation = Matrix4.getTranslation(position);
	
	if (!order) order = 'SRT';
	
	var matrix;
	if (order == 'SRT'){
		matrix = scale;
		matrix.multiply(rotationX);
		matrix.multiply(rotationY);
		matrix.multiply(rotationZ);
		matrix.multiply(translation);
	}else if (order == 'STR'){
		matrix = scale;
		matrix.multiply(translation);
		matrix.multiply(rotationY);
		matrix.multiply(rotationX);
		matrix.multiply(rotationZ);
	}
	
	return matrix;
};

},{"./KTMatrix3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMesh.js":[function(require,module,exports){
var Matrix4 = require('./KTMatrix4');
var Vec3 = require('./KTVector3');

function Mesh(geometry, material){
	if (!geometry.__ktgeometry) throw "Geometry must be a KTGeometry instance";
	if (!material.__ktmaterial) throw "Material must be a KTMaterial instance";
	
	this.__ktmesh = true;
	
	this.geometry = geometry;
	this.material = material;
	
	this.parent = null;
	this.visible = true;
	
	this.position = new Vec3(0, 0, 0);
	this.rotation = new Vec3(0, 0, 0);
	this.scale = new Vec3(1, 1, 1);
}

module.exports = Mesh;

Mesh.prototype.getTransformationMatrix = function(){
	var matrix = Matrix4.getTransformation(this.position, this.rotation, this.scale);
	
	if (this.parent){
		var m = this.parent.getTransformationMatrix();
		matrix.multiply(m);
	}
	
	return matrix;
};

},{"./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTScene.js":[function(require,module,exports){
var KT = require('./KTMain');
var Color = require('./KTColor');

function Scene(params){
	this.__ktscene = true;
	
	this.meshes = [];
	this.dirLight = null;
	this.shadingMode = ['BASIC', 'LAMBERT'];
	
	if (!params) params = {};
	this.useLighting = (params.useLighting)? true : false;
	this.ambientLight = (params.ambientLight)? new Color(params.ambientLight) : null;
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

Scene.prototype.drawMesh = function(mesh, camera){
	var gl = KT.gl;
	
	this.setMaterialAttributes(mesh.material);
	
	this.sendAttribData(mesh, KT.shader.attributes, camera);
	this.sendUniformData(mesh, KT.shader.uniforms, camera);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.facesBuffer);
	gl.drawElements(gl[mesh.material.drawAs], mesh.geometry.facesBuffer.numItems, gl.UNSIGNED_SHORT, 0);
};

Scene.prototype.render = function(camera){
	var gl = KT.gl;
	
	var bc = camera.backgroundColor.getRGBA();
	gl.clearColor(bc[0], bc[1], bc[2], bc[3]);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	gl.disable( gl.BLEND ); 
	gl.enable(gl.DEPTH_TEST);
	var transparents = [];
	
	camera.getTransformationMatrix();
	
	for (var i=0,len=this.meshes.length;i<len;i++){
		var mesh = this.meshes[i];
		if (!mesh.visible) continue;
		if (mesh.material.opacity == 0.0) continue;
		
		var shading = this.shadingMode.indexOf(mesh.material.shading);
		if (shading == 1){
			if (mesh.material.opacity != 1.0){
				transparents.push(mesh);
				continue;
			}
		}
		
		this.drawMesh(mesh, camera);
	}
	
	gl.enable( gl.BLEND ); 
	gl.disable(gl.DEPTH_TEST);
	for (var i=0,len=transparents.length;i<len;i++){
		var mesh = transparents[i];
		this.drawMesh(mesh, camera);
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
		
		if (uni.name == 'uShadingMode'){
			gl.uniform1i(uni.location, this.shadingMode.indexOf(mesh.material.shading));
		}else if (uni.name == 'uMVPMatrix'){
			transformationMatrix = mesh.getTransformationMatrix().multiply(camera.transformationMatrix);
			var mvp = transformationMatrix.clone().multiply(camera.perspectiveMatrix);
			gl.uniformMatrix4fv(uni.location, false, mvp.toFloat32Array());
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
			var d = camera.NRTransformationMatrix.multiply([this.dirLight.direction.x, this.dirLight.direction.y, this.dirLight.direction.z, 1]);
			var dir = new KT.Vector3(d[0], d[1], d[2]).normalize();
			gl.uniform3f(uni.location, dir.x, dir.y, dir.z);
		}else if (uni.name == 'uLightDirectionColor' && this.useLighting && this.dirLight){
			var color = this.dirLight.color.getRGB();
			gl.uniform3f(uni.location, color[0], color[1], color[2]);
		}else if (uni.name == 'uLightDirectionIntensity' && this.useLighting && this.dirLight){
			gl.uniform1f(uni.location, this.dirLight.intensity);
		}else if (uni.name == 'uAmbientLightColor' && this.useLighting && this.ambientLight){
			var color = this.ambientLight.getRGB();
			gl.uniform3f(uni.location, color[0], color[1], color[2]);
		}else if (uni.name == 'uOpacity'){
			gl.uniform1f(uni.location, mesh.material.opacity);
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

},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTShaders.js":[function(require,module,exports){
module.exports = {
	attributes: [
		{name: 'aVertexPosition', type: 'v3'},
		{name: 'aVertexColor', type: 'v4'},
		{name: 'aTextureCoord', type: 'v2'},
		
		{name: 'aVertexNormal', type: 'v3'}
	],
	uniforms: [
		{name: 'uShadingMode', type: 'int'},
		{name: 'uMVPMatrix', type: 'm4'},
		{name: 'uMaterialColor', type: 'v4'},
		{name: 'uTextureSampler', type: 'tex'},
		{name: 'uHasTexture', type: 'bool'},
		
		{name: 'uUseLighting', type: 'bool'},
		{name: 'uNormalMatrix', type: 'm3'},
		
		{name: 'uAmbientLightColor', type: 'v3'},
		
		{name: 'uLightDirection', type: 'v3'},
		{name: 'uLightDirectionColor', type: 'v3'},
		{name: 'uLightDirectionIntensity', type: 'f'},
		
		{name: 'uOpacity', type: 'f'}
	],
	vertexShader: 
		"attribute mediump vec2 aTextureCoord; " +
		"attribute mediump vec3 aVertexPosition; " +
		"attribute mediump vec4 aVertexColor; " +
		
		"attribute mediump vec3 aVertexNormal; " + 
		
		
		"uniform int uShadingMode; " +
		
		"uniform mediump mat4 uMVPMatrix; " +
		"uniform mediump vec4 uMaterialColor; " +
		
		"uniform bool uUseLighting; " +
		"uniform mediump mat3 uNormalMatrix; " +
		
		"uniform mediump vec3 uAmbientLightColor; " +
		
		"uniform mediump vec3 uLightDirection; " +
		"uniform mediump vec3 uLightDirectionColor; " +
		"uniform mediump float uLightDirectionIntensity; " +  
		
		
		"varying mediump float vShadingMode; " +
		"varying mediump vec4 vVertexColor; " +
		"varying mediump vec2 vTextureCoord;" +  
		"varying mediump vec3 vLightWeight; " + 
		
		"void basic(void){" +
			"vVertexColor = aVertexColor * uMaterialColor; " +
			"vTextureCoord = aTextureCoord; " +  
		"} "  + 
		
		"void lambert(void){ " +
			"if (uUseLighting){ " + 
				"vec3 transformedNormal = uNormalMatrix * aVertexNormal; " +
				"float dirLightWeight = max(dot(transformedNormal, uLightDirection), 0.0); " +
				"vLightWeight = uAmbientLightColor + (uLightDirectionColor * dirLightWeight * uLightDirectionIntensity); " +
			"}else{ " +
				"vLightWeight = vec3(1.0); " + 
			"}" +   
			 
			"vVertexColor = aVertexColor * uMaterialColor; " +
			"vTextureCoord = aTextureCoord; " +  
		"} " +  
		
		"void main(void){ " + 
			"gl_Position = uMVPMatrix * vec4(aVertexPosition, 1.0); " +
		
			"vShadingMode = float(uShadingMode); " +
			"if (uShadingMode == 0){ " +
				"basic(); " +
			"}else if (uShadingMode == 1){ " +
				"lambert(); " +
			"} " +
		"} " ,
	fragmentShader: 
		"uniform sampler2D uTextureSampler; " +
		"uniform bool uHasTexture; " +
		"uniform mediump float uOpacity; " +
		
		"varying mediump float vShadingMode; " +
		"varying mediump vec2 vTextureCoord; " + 
		"varying mediump vec4 vVertexColor; " + 
		"varying mediump vec3 vLightWeight; " + 
		
		"void basic(mediump vec4 color){" +
			"gl_FragColor = color;" + 
		"} "  + 
		
		"void lambert(mediump vec4 color){ " +
			"color.rgb *= vLightWeight; " + 
			"gl_FragColor = vec4(color.rgb, color.a * uOpacity); " + 
		"} " +  
		
		"void main(void){ " +
			"mediump vec4 color = vVertexColor; " + 
			"if (uHasTexture){ " + 
				"mediump vec4 texColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t)); " +
				"color *= texColor; " +
			"} " + 
			
			"if (vShadingMode == 0.0){ " +
				"basic(color); " +
			"}else if (vShadingMode == 1.0){ " +
				"lambert(color); " +
			"} " +
		"}"
};

},{}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTexture.js":[function(require,module,exports){
var KT = require('./KTMain');
var Utils = require('./KTUtils');

function Texture(src, params){
	this.__kttexture = true;
	
	if (!params) params = {};
	this.minFilter = (params.minFilter)? params.minFilter : 'LINEAR';
	this.magFilter = (params.magFilter)? params.magFilter : 'LINEAR';
	this.wrapS = (params.SWrapping)? params.SWrapping : 'REPEAT';
	this.wrapT = (params.TWrapping)? params.TWrapping : 'REPEAT';
	
	this.textue = null;
	
	this.image = new Image();
	this.image.src = src;
	this.image.ready = false;
	
	var T = this;
	Utils.addEvent(this.image, "load", function(){
		T.parseTexture(); 
	});
}

module.exports = Texture;

Texture.prototype.parseTexture = function(){
	if (this.image.ready) return;
	
	this.image.ready = true;
	var gl = KT.gl;
	
	this.texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[this.magFilter]);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[this.minFilter]);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[this.wrapS]);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[this.wrapT]);
	
	gl.generateMipmap(gl.TEXTURE_2D);
	
	gl.bindTexture(gl.TEXTURE_2D, null);
};

},{"./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTUtils":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js":[function(require,module,exports){
module.exports = {
	get: function(element){
		if (element.charAt(0) == "#"){
			return document.getElementById(element.replace("#", ""));
		}else if (element.charAt(0) == "."){
			return document.getElementsByClassName(element.replace(".", ""));
		}else{
			return document.getElementsByTagName(element);
		}
	},
	
	addEvent: function(element, type, callback){
		if (element.addEventListener){
			element.addEventListener(type, callback, false);
		}else if (element.attachEvent){
			element.attachEvent("on" + type, callback);
		}
	}
};

},{}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js":[function(require,module,exports){
function Vector2(x, y){
	this.__ktv2 = true;
	
	this.x = x;
	this.y = y;
};

module.exports = Vector2;

Vector2.prototype.length = function(){
	var length = Math.sqrt(this.x * this.x + this.y * this.y);
	
	return length;
};

Vector2.prototype.normalize = function(){
	var length = this.length();
	
	this.x /= length;
	this.y /= length;
	
	return this;
};

Vector2.prototype.dot = function(vector2){
	if (!vector2.__ktv2) throw "Can only perform a dot product with a vector2";
	
	return this.x * vector2.x + this.y * vector2.y;
};

Vector2.prototype.invert = function(){
	return this.multiply(-1);
};

Vector2.prototype.multiply = function(number){
	this.x *= number;
	this.y *= number;
	
	return this;
};

Vector2.prototype.add = function(vector2){
	if (!vector2.__ktv2) throw "Can only add a vector2 to this vector";
	
	this.x += vector2.x;
	this.y += vector2.y;
	
	return this;
};

Vector2.prototype.copy = function(vector2){
	if (!vector2.__ktv2) throw "Can only copy a vector2 to this vector";
	
	this.x = vector2.x;
	this.y = vector2.y;
	
	return this;
};

Vector2.prototype.set = function(x, y){
	this.x = x;
	this.y = y;
	
	return this;
};

Vector2.prototype.clone = function(){
	return new Vector2(this.x, this.y);
};

Vector2.prototype.equals = function(vector2){
	if (!vector2.__ktv2) throw "Can only copy a vector2 to this vector";
	
	return (this.x == vector2.x && this.y == vector2.y);
};

Vector2.vectorsDifference = function(vector2_a, vector2_b){
	if (!vector2_a.__ktv2) throw "Can only create this vector using 2 vectors2";
	if (!vector2_b.__ktv2) throw "Can only create this vector using 2 vectors2";
	
	return new Vector2(vector2_a.x - vector2_b.x, vector2_a.y - vector2_b.y);
};

Vector2.fromAngle = function(radian){
	var x = Math.cos(radian);
	var y = -Math.sin(radian);
	
	return new Vector2(x, y);
};

},{}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js":[function(require,module,exports){
function Vector3(x, y, z){
	this.__ktv3 = true;
	
	this.x = x;
	this.y = y;
	this.z = z;
};

module.exports = Vector3;

Vector3.prototype.length = function(){
	var length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	
	return length;
};

Vector3.prototype.normalize = function(){
	var length = this.length();
	
	this.x /= length;
	this.y /= length;
	this.z /= length;
	
	return this;
};

Vector3.prototype.dot = function(vector3){
	if (!vector3.__ktv3) throw "Can only perform a dot product with a vector3";
	
	return this.x * vector3.x + this.y * vector3.y + this.z * vector3.z;
};

Vector3.prototype.cross = function(vector3){
	if (!vector3.__ktv3) throw "Can only perform a cross product with a vector3";
	
	return new Vector3(
		this.y * vector3.z - this.z * vector3.y,
		this.z * vector3.x - this.x * vector3.z,
		this.x * vector3.y - this.y * vector3.x
	);
};

Vector3.prototype.invert = function(){
	return this.multiply(-1);
};

Vector3.prototype.multiply = function(number){
	this.x *= number;
	this.y *= number;
	this.z *= number;
	
	return this;
};

Vector3.prototype.add = function(vector3){
	if (!vector3.__ktv3) throw "Can only add a Vector3 to this vector";
	
	this.x += vector3.x;
	this.y += vector3.y;
	this.z += vector3.z;
	
	return this;
};

Vector3.prototype.copy = function(vector3){
	if (!vector3.__ktv3) throw "Can only copy a Vector3 to this vector";
	
	this.x = vector3.x;
	this.y = vector3.y;
	this.z = vector3.z;
	
	return this;
};

Vector3.prototype.set = function(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
	
	return this;
};

Vector3.prototype.clone = function(){
	return new Vector3(this.x, this.y, this.z);
};

Vector3.prototype.equals = function(vector3){
	if (!vector3.__ktv3) throw "Can only copy a Vector3 to this vector";
	
	return (this.x == vector3.x && this.y == vector3.y && this.z == vector3.z);
};

Vector3.vectorsDifference = function(vector3_a, vector3_b){
	if (!vector3_a.__ktv3) throw "Can only create this vector using 2 vectors3";
	if (!vector3_b.__ktv3) throw "Can only create this vector using 2 vectors3";
	
	return new Vector3(vector3_a.x - vector3_b.x, vector3_a.y - vector3_b.y, vector3_a.z - vector3_b.z);
};

Vector3.fromAngle = function(radian_xz, radian_y){
	var x = Math.cos(radian_xz);
	var y = Math.sin(radian_y);
	var z = -Math.sin(radian_xz);
	
	return new Vector3(x, y, z);
};

},{}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KramTech.js":[function(require,module,exports){
var KT = require('./KTMain');
KT.CameraPerspective = require('./KTCameraPerspective');
KT.Color = require('./KTColor');
KT.Geometry = require('./KTGeometry');
KT.GeometryBox = require('./KTGeometryBox');
KT.GeometryPlane = require('./KTGeometryPlane');
KT.GeometrySphere = require('./KTGeometrySphere');
KT.LightDirectional = require('./KTLightDirectional');
KT.Material = require('./KTMaterial');
KT.MaterialBasic = require('./KTMaterialBasic');
KT.MaterialLambert = require('./KTMaterialLambert');
KT.Math = require('./KTMath');
KT.Matrix3 = require('./KTMatrix3');
KT.Matrix4 = require('./KTMatrix4');
KT.Mesh = require('./KTMesh');
KT.Texture = require('./KTTexture');
KT.Utils = require('./KTUtils');
KT.Vector2 = require('./KTVector2');
KT.Vector3 = require('./KTVector3');
KT.Scene = require('./KTScene');

module.exports = KT;
},{"./KTCameraPerspective":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraPerspective.js","./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTGeometryBox":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryBox.js","./KTGeometryPlane":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryPlane.js","./KTGeometrySphere":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometrySphere.js","./KTLightDirectional":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightDirectional.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js","./KTMaterialBasic":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialBasic.js","./KTMaterialLambert":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialLambert.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTMatrix3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix3.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTMesh":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMesh.js","./KTScene":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTScene.js","./KTTexture":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTexture.js","./KTUtils":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js":[function(require,module,exports){
window.KT = require('./KramTech');
},{"./KramTech":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KramTech.js"}]},{},["c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiLi5cXHNyY1xcS1RDYW1lcmFQZXJzcGVjdGl2ZS5qcyIsIi4uXFxzcmNcXEtUQ29sb3IuanMiLCIuLlxcc3JjXFxLVEdlb21ldHJ5LmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeUJveC5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlQbGFuZS5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlTcGhlcmUuanMiLCIuLlxcc3JjXFxLVExpZ2h0RGlyZWN0aW9uYWwuanMiLCIuLlxcc3JjXFxLVE1haW4uanMiLCIuLlxcc3JjXFxLVE1hdGVyaWFsLmpzIiwiLi5cXHNyY1xcS1RNYXRlcmlhbEJhc2ljLmpzIiwiLi5cXHNyY1xcS1RNYXRlcmlhbExhbWJlcnQuanMiLCIuLlxcc3JjXFxLVE1hdGguanMiLCIuLlxcc3JjXFxLVE1hdHJpeDMuanMiLCIuLlxcc3JjXFxLVE1hdHJpeDQuanMiLCIuLlxcc3JjXFxLVE1lc2guanMiLCIuLlxcc3JjXFxLVFNjZW5lLmpzIiwiLi5cXHNyY1xcS1RTaGFkZXJzLmpzIiwiLi5cXHNyY1xcS1RUZXh0dXJlLmpzIiwiLi5cXHNyY1xcS1RVdGlscy5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yMi5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yMy5qcyIsIi4uXFxzcmNcXEtyYW1UZWNoLmpzIiwiLi5cXHNyY1xcV2luZG93RXhwb3J0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxudmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBWZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxudmFyIEtUTWF0aCA9IHJlcXVpcmUoJy4vS1RNYXRoJyk7XHJcblxyXG5mdW5jdGlvbiBDYW1lcmFQZXJzcGVjdGl2ZShwb3NpdGlvbiwgcm90YXRpb24sIGZvdiwgcmF0aW8sIHpuZWFyLCB6ZmFyKXtcclxuXHR0aGlzLl9fa3RjYW1lcmEgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuXHR0aGlzLnJvdGF0aW9uID0gcm90YXRpb247XHJcblx0XHJcblx0dGhpcy5mb3YgPSBmb3Y7XHJcblx0dGhpcy5yYXRpbyA9IHJhdGlvO1xyXG5cdHRoaXMuem5lYXIgPSB6bmVhcjtcclxuXHR0aGlzLnpmYXIgPSB6ZmFyO1xyXG5cdFxyXG5cdHRoaXMuYmFja2dyb3VuZENvbG9yID0gbmV3IENvbG9yKENvbG9yLl9CTEFDSyk7XHJcblx0XHJcblx0dGhpcy5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xyXG5cdHRoaXMuc2V0UGVyc3BlY3RpdmUoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYW1lcmFQZXJzcGVjdGl2ZTtcclxuXHJcbkNhbWVyYVBlcnNwZWN0aXZlLnByb3RvdHlwZS5zZXRQZXJzcGVjdGl2ZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIEMgPSAxIC8gTWF0aC50YW4odGhpcy5mb3YgLyAyKTtcclxuXHR2YXIgUiA9IEMgKiB0aGlzLnJhdGlvO1xyXG5cdHZhciBBID0gKHRoaXMuem5lYXIgKyB0aGlzLnpmYXIpIC8gKHRoaXMuem5lYXIgLSB0aGlzLnpmYXIpO1xyXG5cdHZhciBCID0gKDIgKiB0aGlzLnpuZWFyICogdGhpcy56ZmFyKSAvICh0aGlzLnpuZWFyIC0gdGhpcy56ZmFyKTtcclxuXHRcclxuXHR0aGlzLnBlcnNwZWN0aXZlTWF0cml4ID0gbmV3IE1hdHJpeDQoXHJcblx0XHRDLCAwLCAwLCAgMCxcclxuXHRcdDAsIFIsIDAsICAwLFxyXG5cdFx0MCwgMCwgQSwgIEIsXHJcblx0XHQwLCAwLCAtMSwgMFxyXG5cdCk7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUuc2V0QmFja2dyb3VuZENvbG9yID0gZnVuY3Rpb24oY29sb3Ipe1xyXG5cdHRoaXMuYmFja2dyb3VuZENvbG9yID0gbmV3IENvbG9yKGNvbG9yKTtcclxufTtcclxuXHJcbkNhbWVyYVBlcnNwZWN0aXZlLnByb3RvdHlwZS5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIHBvcyA9IHRoaXMucG9zaXRpb24uY2xvbmUoKS5tdWx0aXBseSgtMSk7XHJcblx0dmFyIHJvdCA9IHRoaXMucm90YXRpb24uY2xvbmUoKS5tdWx0aXBseSgtMSk7XHJcblx0dmFyIGNhbU1hdCA9IE1hdHJpeDQuZ2V0VHJhbnNmb3JtYXRpb24ocG9zLCByb3QsIG51bGwsICdTVFInKTtcclxuXHRcclxuXHRyb3QubXVsdGlwbHkoLTEpO1xyXG5cdHZhciBjYW1NYXRMID0gTWF0cml4NC5nZXRUcmFuc2Zvcm1hdGlvbihwb3MsIHJvdCwgbnVsbCwgJ1NUUicpO1xyXG5cdFxyXG5cdHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBjYW1NYXQ7XHJcblx0dGhpcy5OUlRyYW5zZm9ybWF0aW9uTWF0cml4ID0gY2FtTWF0TDtcclxuXHRyZXR1cm4gY2FtTWF0O1xyXG59O1xyXG5cclxuQ2FtZXJhUGVyc3BlY3RpdmUucHJvdG90eXBlLmxvb2tBdCA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgbG9vayBhdCBhIHZlY3RvcjNcIjtcclxuXHRcclxuXHR2YXIgZm9yd2FyZCA9IFZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UodGhpcy5wb3NpdGlvbiwgdmVjdG9yMyk7XHJcblx0dmFyIHh6RGlzdCA9IE1hdGguc3FydChmb3J3YXJkLnggKiBmb3J3YXJkLnggKyBmb3J3YXJkLnogKiBmb3J3YXJkLnopO1xyXG5cdFxyXG5cdHZhciB4QW5nID0gS1RNYXRoLmdldDJEQW5nbGUoMCwgdGhpcy5wb3NpdGlvbi55LCB4ekRpc3QsIHZlY3RvcjMueSk7XHJcblx0dmFyIHlBbmcgPSBLVE1hdGguZ2V0MkRBbmdsZSh0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueiwgdmVjdG9yMy54LCB2ZWN0b3IzLnopIC0gS1RNYXRoLlBJXzI7XHJcblx0XHJcblx0dGhpcy5yb3RhdGlvbi5zZXQoXHJcblx0XHR4QW5nLFxyXG5cdFx0eUFuZyxcclxuXHRcdDBcclxuXHQpO1xyXG59O1xyXG4iLCJmdW5jdGlvbiBDb2xvcihoZXhDb2xvcil7XHJcblx0dmFyIHN0ciA9IGhleENvbG9yLnN1YnN0cmluZygxKTtcclxuXHR2YXIgciA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMCwgMiksIDE2KTtcclxuXHR2YXIgZyA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMiwgNCksIDE2KTtcclxuXHR2YXIgYiA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoNCwgNiksIDE2KTtcclxuXHR2YXIgYSA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoNiwgOCksIDE2KTtcclxuXHRcclxuXHR0aGlzLmNvbG9yID0gW3IgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUsIGEgLyAyNTVdO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbG9yO1xyXG5cclxuQ29sb3IucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGhleENvbG9yKXtcclxuXHR2YXIgc3RyID0gaGV4Q29sb3Iuc3Vic3RyaW5nKDEpO1xyXG5cdHZhciByID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygwLCAyKSwgMTYpO1xyXG5cdHZhciBnID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygyLCA0KSwgMTYpO1xyXG5cdHZhciBiID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg0LCA2KSwgMTYpO1xyXG5cdHZhciBhID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg2LCA4KSwgMTYpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBbciAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSwgYSAvIDI1NV07XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuc2V0UkdCID0gZnVuY3Rpb24ocmVkLCBncmVlbiwgYmx1ZSl7XHJcblx0dGhpcy5zZXRSR0JBKHJlZCwgZ3JlZW4sIGJsdWUsIDI1NSk7XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuc2V0UkdCQSA9IGZ1bmN0aW9uKHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhKXtcclxuXHR0aGlzLmNvbG9yID0gW3JlZCAvIDI1NSwgZ3JlZW4gLyAyNTUsIGJsdWUgLyAyNTUsIGFscGhhXTtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5nZXRSR0IgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBjID0gdGhpcy5nZXRSR0JBKCk7XHJcblx0XHJcblx0cmV0dXJuIFtjWzBdLCBjWzFdLCBjWzJdXTtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5nZXRSR0JBID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gdGhpcy5jb2xvcjtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5nZXRIZXggPSBmdW5jdGlvbigpe1xyXG5cdHZhciBjID0gdGhpcy5jb2xvcjtcclxuXHRcclxuXHR2YXIgciA9IChjWzBdICogMjU1KS50b1N0cmluZygxNik7XHJcblx0dmFyIGcgPSAoY1sxXSAqIDI1NSkudG9TdHJpbmcoMTYpO1xyXG5cdHZhciBiID0gKGNbMl0gKiAyNTUpLnRvU3RyaW5nKDE2KTtcclxuXHR2YXIgYSA9IChjWzNdICogMjU1KS50b1N0cmluZygxNik7XHJcblx0XHJcblx0aWYgKHIubGVuZ3RoID09IDEpIHIgPSBcIjBcIiArIHI7XHJcblx0aWYgKGcubGVuZ3RoID09IDEpIGcgPSBcIjBcIiArIGc7XHJcblx0aWYgKGIubGVuZ3RoID09IDEpIGIgPSBcIjBcIiArIGI7XHJcblx0aWYgKGEubGVuZ3RoID09IDEpIGEgPSBcIjBcIiArIGE7XHJcblx0XHJcblx0cmV0dXJuIChcIiNcIiArIHIgKyBnICsgYiArIGEpLnRvVXBwZXJDYXNlKCk7XHJcbn07XHJcblxyXG5Db2xvci5fQkxBQ0tcdFx0PSBcIiMwMDAwMDBGRlwiO1xyXG5Db2xvci5fUkVEIFx0XHRcdD0gXCIjRkYwMDAwRkZcIjtcclxuQ29sb3IuX0dSRUVOIFx0XHQ9IFwiIzAwRkYwMEZGXCI7XHJcbkNvbG9yLl9CTFVFIFx0XHQ9IFwiIzAwMDBGRkZGXCI7XHJcbkNvbG9yLl9XSElURVx0XHQ9IFwiI0ZGRkZGRkZGXCI7XHJcbkNvbG9yLl9ZRUxMT1dcdFx0PSBcIiNGRkZGMDBGRlwiO1xyXG5Db2xvci5fTUFHRU5UQVx0XHQ9IFwiI0ZGMDBGRkZGXCI7XHJcbkNvbG9yLl9BUVVBXHRcdFx0PSBcIiMwMEZGRkZGRlwiO1xyXG5Db2xvci5fR09MRFx0XHRcdD0gXCIjRkZENzAwRkZcIjtcclxuQ29sb3IuX0dSQVlcdFx0XHQ9IFwiIzgwODA4MEZGXCI7XHJcbkNvbG9yLl9QVVJQTEVcdFx0PSBcIiM4MDAwODBGRlwiOyIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcbnZhciBWZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnkoKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy52ZXJ0aWNlcyA9IFtdO1xyXG5cdHRoaXMudHJpYW5nbGVzID0gW107XHJcblx0dGhpcy51dkNvb3JkcyA9IFtdO1xyXG5cdHRoaXMuY29sb3JzID0gW107XHJcblx0dGhpcy5ub3JtYWxzID0gW107XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnk7XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuYWRkVmVydGljZSA9IGZ1bmN0aW9uKHgsIHksIHosIGNvbG9yLCB0eCwgdHkpe1xyXG5cdGlmICghY29sb3IpIGNvbG9yID0gQ29sb3IuX1dISVRFO1xyXG5cdGlmICghdHgpIHR4ID0gMDtcclxuXHRpZiAoIXR5KSB0eSA9IDA7XHJcblx0XHJcblx0dGhpcy52ZXJ0aWNlcy5wdXNoKG5ldyBWZWN0b3IzKHgsIHksIHopKTtcclxuXHR0aGlzLmNvbG9ycy5wdXNoKG5ldyBDb2xvcihjb2xvcikpO1xyXG5cdHRoaXMudXZDb29yZHMucHVzaChuZXcgVmVjdG9yMih0eCwgdHkpKTtcclxufTtcclxuXHJcbkdlb21ldHJ5LnByb3RvdHlwZS5hZGRGYWNlID0gZnVuY3Rpb24odmVydGljZV8wLCB2ZXJ0aWNlXzEsIHZlcnRpY2VfMil7XHJcblx0aWYgKCF0aGlzLnZlcnRpY2VzW3ZlcnRpY2VfMF0pIHRocm93IFwiSW52YWxpZCB2ZXJ0ZXggaW5kZXg6IFwiICsgdmVydGljZV8wO1xyXG5cdGlmICghdGhpcy52ZXJ0aWNlc1t2ZXJ0aWNlXzFdKSB0aHJvdyBcIkludmFsaWQgdmVydGV4IGluZGV4OiBcIiArIHZlcnRpY2VfMTtcclxuXHRpZiAoIXRoaXMudmVydGljZXNbdmVydGljZV8yXSkgdGhyb3cgXCJJbnZhbGlkIHZlcnRleCBpbmRleDogXCIgKyB2ZXJ0aWNlXzI7XHJcblx0XHJcblx0dGhpcy50cmlhbmdsZXMucHVzaChuZXcgVmVjdG9yMyh2ZXJ0aWNlXzAsIHZlcnRpY2VfMSwgdmVydGljZV8yKSk7XHJcbn07XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuYWRkTm9ybWFsID0gZnVuY3Rpb24obngsIG55LCBueil7XHJcblx0dGhpcy5ub3JtYWxzLnB1c2gobmV3IFZlY3RvcjMobngsIG55LCBueikpO1xyXG59O1xyXG5cclxuR2VvbWV0cnkucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgdmVydGljZXMgPSBbXTtcclxuXHR2YXIgdXZDb29yZHMgPSBbXTtcclxuXHR2YXIgdHJpYW5nbGVzID0gW107XHJcblx0dmFyIGNvbG9ycyA9IFtdO1xyXG5cdHZhciBub3JtYWxzID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLnZlcnRpY2VzLmxlbmd0aDtpPGxlbjtpKyspeyBcclxuXHRcdHZhciB2ID0gdGhpcy52ZXJ0aWNlc1tpXTsgXHJcblx0XHR2ZXJ0aWNlcy5wdXNoKHYueCwgdi55LCB2LnopOyBcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLnV2Q29vcmRzLmxlbmd0aDtpPGxlbjtpKyspeyBcclxuXHRcdHZhciB2ID0gdGhpcy51dkNvb3Jkc1tpXTsgXHJcblx0XHR1dkNvb3Jkcy5wdXNoKHYueCwgdi55KTsgXHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy50cmlhbmdsZXMubGVuZ3RoO2k8bGVuO2krKyl7IFxyXG5cdFx0dmFyIHQgPSB0aGlzLnRyaWFuZ2xlc1tpXTsgXHJcblx0XHR0cmlhbmdsZXMucHVzaCh0LngsIHQueSwgdC56KTsgXHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy5jb2xvcnMubGVuZ3RoO2k8bGVuO2krKyl7IFxyXG5cdFx0dmFyIGMgPSB0aGlzLmNvbG9yc1tpXS5nZXRSR0JBKCk7IFxyXG5cdFx0XHJcblx0XHRjb2xvcnMucHVzaChjWzBdLCBjWzFdLCBjWzJdLCBjWzNdKTsgXHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy5ub3JtYWxzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIG4gPSB0aGlzLm5vcm1hbHNbaV07XHJcblx0XHRub3JtYWxzLnB1c2gobi54LCBuLnksIG4ueik7XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJBUlJBWV9CVUZGRVJcIiwgbmV3IEZsb2F0MzJBcnJheSh2ZXJ0aWNlcyksIDMpO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJBUlJBWV9CVUZGRVJcIiwgbmV3IEZsb2F0MzJBcnJheSh1dkNvb3JkcyksIDIpO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBLVC5jcmVhdGVBcnJheUJ1ZmZlcihcIkVMRU1FTlRfQVJSQVlfQlVGRkVSXCIsIG5ldyBVaW50MTZBcnJheSh0cmlhbmdsZXMpLCAxKTtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IEtULmNyZWF0ZUFycmF5QnVmZmVyKFwiQVJSQVlfQlVGRkVSXCIsIG5ldyBGbG9hdDMyQXJyYXkoY29sb3JzKSwgNCk7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJBUlJBWV9CVUZGRVJcIiwgbmV3IEZsb2F0MzJBcnJheShub3JtYWxzKSwgMyk7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuY29tcHV0ZUZhY2VzTm9ybWFscyA9IGZ1bmN0aW9uKCl7XHJcblx0dGhpcy5ub3JtYWxzID0gW107XHJcblx0XHJcblx0dmFyIG5vcm1hbGl6ZWRWZXJ0aWNlcyA9IFtdO1xyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy50cmlhbmdsZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgZmFjZSA9IHRoaXMudHJpYW5nbGVzW2ldO1xyXG5cdFx0dmFyIHYwID0gdGhpcy52ZXJ0aWNlc1tmYWNlLnhdO1xyXG5cdFx0dmFyIHYxID0gdGhpcy52ZXJ0aWNlc1tmYWNlLnldO1xyXG5cdFx0dmFyIHYyID0gdGhpcy52ZXJ0aWNlc1tmYWNlLnpdO1xyXG5cdFx0XHJcblx0XHR2YXIgZGlyMSA9IFZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UodjEsIHYwKTtcclxuXHRcdHZhciBkaXIyID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSh2MiwgdjApO1xyXG5cdFx0XHJcblx0XHR2YXIgbm9ybWFsID0gZGlyMS5jcm9zcyhkaXIyKS5ub3JtYWxpemUoKTtcclxuXHRcdFxyXG5cdFx0aWYgKG5vcm1hbGl6ZWRWZXJ0aWNlcy5pbmRleE9mKGZhY2UueCkgPT0gLTEpIHRoaXMubm9ybWFscy5wdXNoKG5vcm1hbCk7XHJcblx0XHRpZiAobm9ybWFsaXplZFZlcnRpY2VzLmluZGV4T2YoZmFjZS55KSA9PSAtMSkgdGhpcy5ub3JtYWxzLnB1c2gobm9ybWFsKTtcclxuXHRcdGlmIChub3JtYWxpemVkVmVydGljZXMuaW5kZXhPZihmYWNlLnopID09IC0xKSB0aGlzLm5vcm1hbHMucHVzaChub3JtYWwpO1xyXG5cdFx0XHJcblx0XHRub3JtYWxpemVkVmVydGljZXMucHVzaChmYWNlLngsIGZhY2UueSwgZmFjZS56KTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbiIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5Qm94KHdpZHRoLCBsZW5ndGgsIGhlaWdodCwgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0XHJcblx0dmFyIGJveEdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdHZhciB3ID0gd2lkdGggLyAyO1xyXG5cdHZhciBsID0gbGVuZ3RoIC8gMjtcclxuXHR2YXIgaCA9IGhlaWdodCAvIDI7XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cdFxyXG5cdHZhciBociA9IChwYXJhbXMuaG9yaXpvbnRhbFJlcGVhdHMpPyBwYXJhbXMuaG9yaXpvbnRhbFJlcGVhdHMgOiAxLjA7XHJcblx0dmFyIHZyID0gKHBhcmFtcy52ZXJ0aWNhbFJlcGVhdHMpPyBwYXJhbXMudmVydGljYWxSZXBlYXRzIDogMS4wO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgIGwsIENvbG9yLl9XSElURSwgIGhyLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgIGwsIENvbG9yLl9XSElURSwgIGhyLCAgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgLWwsIENvbG9yLl9XSElURSwgIGhyLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgLWwsIENvbG9yLl9XSElURSwgIGhyLCAgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgLWwsIENvbG9yLl9XSElURSwgIGhyLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgLWwsIENvbG9yLl9XSElURSwgIGhyLCAgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgIGwsIENvbG9yLl9XSElURSwgIGhyLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgIGwsIENvbG9yLl9XSElURSwgIGhyLCAgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgIGwsIENvbG9yLl9XSElURSwgIGhyLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgLWwsIENvbG9yLl9XSElURSwgIGhyLCAgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgIGwsIENvbG9yLl9XSElURSwgIGhyLCAgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgLWwsIENvbG9yLl9XSElURSwgIGhyLCAwLjApO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDAsIDEsIDIpO1xyXG5cdGJveEdlby5hZGRGYWNlKDAsIDMsIDEpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDQsIDUsIDYpO1xyXG5cdGJveEdlby5hZGRGYWNlKDUsIDcsIDYpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDgsIDksIDEwKTtcclxuXHRib3hHZW8uYWRkRmFjZSg4LCAxMSwgOSk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMTIsIDEzLCAxNCk7XHJcblx0Ym94R2VvLmFkZEZhY2UoMTMsIDE1LCAxNCk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMTYsIDE3LCAxOCk7XHJcblx0Ym94R2VvLmFkZEZhY2UoMTYsIDE5LCAxNyk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMjAsIDIxLCAyMik7XHJcblx0Ym94R2VvLmFkZEZhY2UoMjEsIDIzLCAyMik7XHJcblx0XHJcblx0Ym94R2VvLmNvbXB1dGVGYWNlc05vcm1hbHMoKTtcclxuXHRib3hHZW8uYnVpbGQoKTtcclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IGJveEdlby52ZXJ0ZXhCdWZmZXI7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBib3hHZW8udGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBib3hHZW8uZmFjZXNCdWZmZXI7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBib3hHZW8uY29sb3JzQnVmZmVyO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IGJveEdlby5ub3JtYWxzQnVmZmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5Qm94OyIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5UGxhbmUod2lkdGgsIGhlaWdodCwgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0XHJcblx0dmFyIHBsYW5lR2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0XHJcblx0dmFyIHcgPSB3aWR0aCAvIDI7XHJcblx0dmFyIGggPSBoZWlnaHQgLyAyO1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHRcclxuXHR2YXIgaHIgPSAocGFyYW1zLmhvcml6b250YWxSZXBlYXRzKT8gcGFyYW1zLmhvcml6b250YWxSZXBlYXRzIDogMS4wO1xyXG5cdHZhciB2ciA9IChwYXJhbXMudmVydGljYWxSZXBlYXRzKT8gcGFyYW1zLnZlcnRpY2FsUmVwZWF0cyA6IDEuMDtcclxuXHRcclxuXHRwbGFuZUdlby5hZGRWZXJ0aWNlKCB3LCAwLCAgaCwgQ29sb3IuX1dISVRFLCAgaHIsICB2cik7XHJcblx0cGxhbmVHZW8uYWRkVmVydGljZSgtdywgMCwgLWgsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdHBsYW5lR2VvLmFkZFZlcnRpY2UoLXcsIDAsICBoLCBDb2xvci5fV0hJVEUsIDAuMCwgIHZyKTtcclxuXHRwbGFuZUdlby5hZGRWZXJ0aWNlKCB3LCAwLCAtaCwgQ29sb3IuX1dISVRFLCAgaHIsIDAuMCk7XHJcblx0XHJcblx0cGxhbmVHZW8uYWRkRmFjZSgwLCAxLCAyKTtcclxuXHRwbGFuZUdlby5hZGRGYWNlKDAsIDMsIDEpO1xyXG5cdFxyXG5cdHBsYW5lR2VvLmNvbXB1dGVGYWNlc05vcm1hbHMoKTtcclxuXHRwbGFuZUdlby5idWlsZCgpO1xyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gcGxhbmVHZW8udmVydGV4QnVmZmVyO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gcGxhbmVHZW8udGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBwbGFuZUdlby5mYWNlc0J1ZmZlcjtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IHBsYW5lR2VvLmNvbG9yc0J1ZmZlcjtcclxuXHR0aGlzLm5vcm1hbHNCdWZmZXIgPSBwbGFuZUdlby5ub3JtYWxzQnVmZmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5UGxhbmU7IiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlTcGhlcmUocmFkaXVzLCBsYXRCYW5kcywgbG9uQmFuZHMsIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBzcGhHZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0XHJcblx0dmFyIGhyID0gKHBhcmFtcy5ob3Jpem9udGFsUmVwZWF0cyk/IHBhcmFtcy5ob3Jpem9udGFsUmVwZWF0cyA6IDEuMDtcclxuXHR2YXIgdnIgPSAocGFyYW1zLnZlcnRpY2FsUmVwZWF0cyk/IHBhcmFtcy52ZXJ0aWNhbFJlcGVhdHMgOiAxLjA7XHJcblx0dmFyIGhzID0gKHBhcmFtcy5oYWxmU3BoZXJlKT8gMS4wIDogMi4wO1xyXG5cdFxyXG5cdGZvciAodmFyIGxhdE49MDtsYXROPD1sYXRCYW5kcztsYXROKyspe1xyXG5cdFx0dmFyIHRoZXRhID0gbGF0TiAqIE1hdGguUEkgLyBsYXRCYW5kcztcclxuXHRcdHZhciBjb3NUID0gTWF0aC5jb3ModGhldGEpO1xyXG5cdFx0dmFyIHNpblQgPSBNYXRoLnNpbih0aGV0YSk7XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGxvbk49MDtsb25OPD1sb25CYW5kcztsb25OKyspe1xyXG5cdFx0XHR2YXIgcGhpID0gbG9uTiAqIGhzICogTWF0aC5QSSAvIGxvbkJhbmRzO1xyXG5cdFx0XHR2YXIgY29zUCA9IE1hdGguY29zKHBoaSk7XHJcblx0XHRcdHZhciBzaW5QID0gTWF0aC5zaW4ocGhpKTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciB4ID0gY29zUCAqIHNpblQ7XHJcblx0XHRcdHZhciB5ID0gY29zVDtcclxuXHRcdFx0dmFyIHogPSBzaW5QICogc2luVDtcclxuXHRcdFx0XHJcblx0XHRcdHZhciB0eCA9IGxvbk4gLyBsb25CYW5kcztcclxuXHRcdFx0dmFyIHR5ID0gMSAtIGxhdE4gLyBsYXRCYW5kcztcclxuXHRcdFx0XHJcblx0XHRcdHNwaEdlby5hZGROb3JtYWwoeCwgeSwgeik7XHJcblx0XHRcdHNwaEdlby5hZGRWZXJ0aWNlKHggKiByYWRpdXMsIHkgKiByYWRpdXMsIHogKiByYWRpdXMsIENvbG9yLl9XSElURSwgdHggKiBociwgdHkgKiB2cik7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGxhdE49MDtsYXROPGxhdEJhbmRzO2xhdE4rKyl7XHJcblx0XHRmb3IgKHZhciBsb25OPTA7bG9uTjxsb25CYW5kcztsb25OKyspe1xyXG5cdFx0XHR2YXIgaTEgPSBsb25OICsgKGxhdE4gKiAobG9uQmFuZHMgKyAxKSk7XHJcblx0XHRcdHZhciBpMiA9IGkxICsgbG9uQmFuZHMgKyAxO1xyXG5cdFx0XHR2YXIgaTMgPSBpMSArIDE7XHJcblx0XHRcdHZhciBpNCA9IGkyICsgMTtcclxuXHRcdFx0XHJcblx0XHRcdHNwaEdlby5hZGRGYWNlKGk0LCBpMSwgaTMpO1xyXG5cdFx0XHRzcGhHZW8uYWRkRmFjZShpNCwgaTIsIGkxKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0c3BoR2VvLmJ1aWxkKCk7XHJcblx0XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgPSBzcGhHZW8udmVydGV4QnVmZmVyO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gc3BoR2VvLnRleEJ1ZmZlcjtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gc3BoR2VvLmZhY2VzQnVmZmVyO1xyXG5cdHRoaXMuY29sb3JzQnVmZmVyID0gc3BoR2VvLmNvbG9yc0J1ZmZlcjtcclxuXHR0aGlzLm5vcm1hbHNCdWZmZXIgPSBzcGhHZW8ubm9ybWFsc0J1ZmZlcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeVNwaGVyZTsiLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxuXHJcbmZ1bmN0aW9uIERpcmVjdGlvbmFsTGlnaHQoZGlyZWN0aW9uLCBjb2xvciwgaW50ZW5zaXR5KXtcclxuXHR0aGlzLl9fa3RkaXJMaWdodCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb24ubm9ybWFsaXplKCk7XHJcblx0dGhpcy5kaXJlY3Rpb24ubXVsdGlwbHkoLTEpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBuZXcgQ29sb3IoKGNvbG9yKT8gY29sb3I6IENvbG9yLl9XSElURSk7XHJcblx0dGhpcy5pbnRlbnNpdHkgPSAoaW50ZW5zaXR5ICE9PSB1bmRlZmluZWQpPyBpbnRlbnNpdHkgOiAxLjA7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aW9uYWxMaWdodDtcclxuXHJcbiIsInZhciBTaGFkZXJzID0gcmVxdWlyZSgnLi9LVFNoYWRlcnMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGluaXQ6IGZ1bmN0aW9uKGNhbnZhcyl7XHJcblx0XHR0aGlzLmNhbnZhcyA9IGNhbnZhcztcclxuXHRcdHRoaXMuZ2wgPSBudWxsO1xyXG5cdFx0dGhpcy5zaGFkZXJzID0ge307XHJcblx0XHRcclxuXHRcdHRoaXMuX19pbml0Q29udGV4dChjYW52YXMpO1xyXG5cdFx0dGhpcy5fX2luaXRQcm9wZXJ0aWVzKCk7XHJcblx0XHR0aGlzLl9faW5pdFNoYWRlcnMoKTtcclxuXHR9LFxyXG5cdFxyXG5cdF9faW5pdENvbnRleHQ6IGZ1bmN0aW9uKGNhbnZhcyl7XHJcblx0XHR0aGlzLmdsID0gY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xyXG5cdFx0XHJcblx0XHRpZiAoIXRoaXMuZ2wpe1xyXG5cdFx0XHRhbGVydChcIllvdXIgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgV2ViR0xcIik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5nbC53aWR0aCA9IGNhbnZhcy53aWR0aDtcclxuXHRcdHRoaXMuZ2wuaGVpZ2h0ID0gY2FudmFzLmhlaWdodDtcclxuXHR9LFxyXG5cdFxyXG5cdF9faW5pdFByb3BlcnRpZXM6IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZ2wgPSB0aGlzLmdsO1xyXG5cdFx0XHJcblx0XHRnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7XHJcblx0XHRnbC5kZXB0aEZ1bmMoZ2wuTEVRVUFMKTtcclxuXHRcdFxyXG5cdFx0Z2wuZW5hYmxlKGdsLkNVTExfRkFDRSk7XHJcblx0XHRcclxuXHRcdGdsLmRpc2FibGUoIGdsLkJMRU5EICk7XHJcblx0XHRnbC5ibGVuZEVxdWF0aW9uKCBnbC5GVU5DX0FERCApO1xyXG5cdFx0Z2wuYmxlbmRGdW5jKCBnbC5TUkNfQUxQSEEsIGdsLk9ORSApO1xyXG5cdH0sXHJcblx0XHJcblx0X19pbml0U2hhZGVyczogZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuc2hhZGVyID0gdGhpcy5wcm9jZXNzU2hhZGVyKFNoYWRlcnMpO1xyXG5cdFx0dGhpcy5nbC51c2VQcm9ncmFtKHRoaXMuc2hhZGVyLnNoYWRlclByb2dyYW0pO1xyXG5cdH0sXHJcblx0XHJcblx0Y3JlYXRlQXJyYXlCdWZmZXI6IGZ1bmN0aW9uKHR5cGUsIGRhdGFBcnJheSwgaXRlbVNpemUpe1xyXG5cdFx0dmFyIGdsID0gdGhpcy5nbDtcclxuXHRcdHZhciBidWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuXHRcdGdsLmJpbmRCdWZmZXIoZ2xbdHlwZV0sIGJ1ZmZlcik7XHJcblx0XHRnbC5idWZmZXJEYXRhKGdsW3R5cGVdLCBkYXRhQXJyYXksIGdsLlNUQVRJQ19EUkFXKTtcclxuXHRcdGJ1ZmZlci5udW1JdGVtcyA9IGRhdGFBcnJheS5sZW5ndGg7XHJcblx0XHRidWZmZXIuaXRlbVNpemUgPSBpdGVtU2l6ZTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIGJ1ZmZlcjtcclxuXHR9LFxyXG5cdFxyXG5cdHByb2Nlc3NTaGFkZXI6IGZ1bmN0aW9uKHNoYWRlcil7XHJcblx0XHR2YXIgZ2wgPSB0aGlzLmdsO1xyXG5cdFx0XHJcblx0XHR2YXIgdkNvZGUgPSBzaGFkZXIudmVydGV4U2hhZGVyO1xyXG5cdFx0dmFyIHZTaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuVkVSVEVYX1NIQURFUik7XHJcblx0XHRnbC5zaGFkZXJTb3VyY2UodlNoYWRlciwgdkNvZGUpO1xyXG5cdFx0Z2wuY29tcGlsZVNoYWRlcih2U2hhZGVyKTtcclxuXHRcdFxyXG5cdFx0dmFyIGZDb2RlID0gc2hhZGVyLmZyYWdtZW50U2hhZGVyO1xyXG5cdFx0dmFyIGZTaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuRlJBR01FTlRfU0hBREVSKTtcclxuXHRcdGdsLnNoYWRlclNvdXJjZShmU2hhZGVyLCBmQ29kZSk7XHJcblx0XHRnbC5jb21waWxlU2hhZGVyKGZTaGFkZXIpO1xyXG5cdFx0XHJcblx0XHR2YXIgc2hhZGVyUHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcclxuXHRcdGdsLmF0dGFjaFNoYWRlcihzaGFkZXJQcm9ncmFtLCB2U2hhZGVyKTtcclxuXHRcdGdsLmF0dGFjaFNoYWRlcihzaGFkZXJQcm9ncmFtLCBmU2hhZGVyKTtcclxuXHRcdGdsLmxpbmtQcm9ncmFtKHNoYWRlclByb2dyYW0pO1xyXG5cdFx0XHJcblx0XHRpZiAoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIoc2hhZGVyUHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpKXtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihcIkVycm9yIGluaXRpYWxpemluZyB0aGUgc2hhZGVyIHByb2dyYW1cIik7XHJcblx0XHRcdHRocm93IGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyUHJvZ3JhbSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciBhdHRyaWJ1dGVzID0gW107XHJcblx0XHRmb3IgKHZhciBpPTAsbGVuPXNoYWRlci5hdHRyaWJ1dGVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0XHR2YXIgYXR0ID0gc2hhZGVyLmF0dHJpYnV0ZXNbaV07XHJcblx0XHRcdHZhciBsb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHNoYWRlclByb2dyYW0sIGF0dC5uYW1lKTtcclxuXHRcdFx0XHJcblx0XHRcdGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGxvY2F0aW9uKTtcclxuXHRcdFx0XHJcblx0XHRcdGF0dHJpYnV0ZXMucHVzaCh7XHJcblx0XHRcdFx0bmFtZTogYXR0Lm5hbWUsXHJcblx0XHRcdFx0dHlwZTogYXR0LnR5cGUsXHJcblx0XHRcdFx0bG9jYXRpb246IGxvY2F0aW9uXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgdW5pZm9ybXMgPSBbXTtcclxuXHRcdGZvciAodmFyIGk9MCxsZW49c2hhZGVyLnVuaWZvcm1zLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0XHR2YXIgdW5pID0gc2hhZGVyLnVuaWZvcm1zW2ldO1xyXG5cdFx0XHR2YXIgbG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgdW5pLm5hbWUpO1xyXG5cdFx0XHRcclxuXHRcdFx0dW5pZm9ybXMucHVzaCh7XHJcblx0XHRcdFx0bmFtZTogdW5pLm5hbWUsXHJcblx0XHRcdFx0dHlwZTogdW5pLnR5cGUsXHJcblx0XHRcdFx0bG9jYXRpb246IGxvY2F0aW9uXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRzaGFkZXJQcm9ncmFtOiBzaGFkZXJQcm9ncmFtLFxyXG5cdFx0XHRhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxyXG5cdFx0XHR1bmlmb3JtczogdW5pZm9ybXNcclxuXHRcdH07XHJcblx0fVxyXG59O1xyXG5cclxuXHJcbiIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG5cclxuZnVuY3Rpb24gTWF0ZXJpYWwocGFyYW1ldGVycyl7XHJcblx0dGhpcy5fX2t0bWF0ZXJpYWwgPSB0cnVlO1xyXG5cdFxyXG5cdGlmICghcGFyYW1ldGVycykgcGFyYW1ldGVycyA9IHt9O1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IChwYXJhbWV0ZXJzLnRleHR1cmUpPyBwYXJhbWV0ZXJzLnRleHR1cmUgOiBudWxsO1xyXG5cdHRoaXMuY29sb3IgPSBuZXcgQ29sb3IoKHBhcmFtZXRlcnMuY29sb3IpPyBwYXJhbWV0ZXJzLmNvbG9yIDogQ29sb3IuX1dISVRFKTtcclxuXHR0aGlzLm9wYWNpdHkgPSAocGFyYW1ldGVycy5vcGFjaXR5KT8gcGFyYW1ldGVycy5vcGFjaXR5IDogMS4wO1xyXG5cdHRoaXMuZHJhd0ZhY2VzID0gKHBhcmFtZXRlcnMuZHJhd0ZhY2VzKT8gcGFyYW1ldGVycy5kcmF3RmFjZXMgOiAnRlJPTlQnO1xyXG5cdHRoaXMuZHJhd0FzID0gKHBhcmFtZXRlcnMuZHJhd0FzKT8gcGFyYW1ldGVycy5kcmF3QXMgOiAnVFJJQU5HTEVTJztcclxuXHR0aGlzLnNoYWRpbmcgPSAocGFyYW1ldGVycy5zaGFkaW5nKT8gcGFyYW1ldGVycy5zaGFkaW5nIDogJ0JBU0lDJztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRlcmlhbDsiLCJ2YXIgTWF0ZXJpYWwgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWwnKTtcclxuXHJcbmZ1bmN0aW9uIE1hdGVyaWFsQmFzaWModGV4dHVyZSwgY29sb3Ipe1xyXG5cdHRoaXMuX19rdG1hdGVyaWFsID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgbWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoe1xyXG5cdFx0dGV4dHVyZTogdGV4dHVyZSxcclxuXHRcdGNvbG9yOiBjb2xvclxyXG5cdH0pO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IG1hdGVyaWFsLnRleHR1cmU7XHJcblx0dGhpcy5jb2xvciA9IG1hdGVyaWFsLmNvbG9yO1xyXG5cdHRoaXMuc2hhZGVyID0gbWF0ZXJpYWwuc2hhZGVyO1xyXG5cdHRoaXMub3BhY2l0eSA9IG1hdGVyaWFsLm9wYWNpdHk7XHJcblx0dGhpcy5kcmF3RmFjZXMgPSBtYXRlcmlhbC5kcmF3RmFjZXM7XHJcblx0dGhpcy5kcmF3QXMgPSBtYXRlcmlhbC5kcmF3QXM7XHJcblx0dGhpcy5zaGFkaW5nID0gbWF0ZXJpYWwuc2hhZGluZztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRlcmlhbEJhc2ljO1xyXG4iLCJ2YXIgTWF0ZXJpYWwgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWwnKTtcclxuXHJcbmZ1bmN0aW9uIE1hdGVyaWFsTGFtYmVydCh0ZXh0dXJlLCBjb2xvciwgb3BhY2l0eSl7XHJcblx0dGhpcy5fX2t0bWF0ZXJpYWwgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBtYXRlcmlhbCA9IG5ldyBNYXRlcmlhbCh7XHJcblx0XHR0ZXh0dXJlOiB0ZXh0dXJlLFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdFx0b3BhY2l0eTogb3BhY2l0eSxcclxuXHRcdHNoYWRpbmc6ICdMQU1CRVJUJ1xyXG5cdH0pO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IG1hdGVyaWFsLnRleHR1cmU7XHJcblx0dGhpcy5jb2xvciA9IG1hdGVyaWFsLmNvbG9yO1xyXG5cdHRoaXMuc2hhZGVyID0gbWF0ZXJpYWwuc2hhZGVyO1xyXG5cdHRoaXMub3BhY2l0eSA9IG1hdGVyaWFsLm9wYWNpdHk7XHJcblx0dGhpcy5kcmF3RmFjZXMgPSBtYXRlcmlhbC5kcmF3RmFjZXM7XHJcblx0dGhpcy5kcmF3QXMgPSBtYXRlcmlhbC5kcmF3QXM7XHJcblx0dGhpcy5zaGFkaW5nID0gbWF0ZXJpYWwuc2hhZGluZztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRlcmlhbExhbWJlcnQ7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdHJhZERlZ1JlbDogTWF0aC5QSSAvIDE4MCxcclxuXHRcclxuXHRQSV8yOiBNYXRoLlBJIC8gMixcclxuXHRQSTogTWF0aC5QSSxcclxuXHRQSTNfMjogTWF0aC5QSSAqIDMgLyAyLFxyXG5cdFBJMjogTWF0aC5QSSAqIDIsXHJcblx0XHJcblx0ZGVnVG9SYWQ6IGZ1bmN0aW9uKGRlZ3JlZXMpe1xyXG5cdFx0cmV0dXJuIGRlZ3JlZXMgKiB0aGlzLnJhZERlZ1JlbDtcclxuXHR9LFxyXG5cdFxyXG5cdHJhZFRvRGVnOiBmdW5jdGlvbihyYWRpYW5zKXtcclxuXHRcdHJldHVybiByYWRpYW5zIC8gdGhpcy5yYWREZWdSZWw7XHJcblx0fSxcclxuXHRcclxuXHRnZXQyREFuZ2xlOiBmdW5jdGlvbih4MSwgeTEsIHgyLCB5Mil7XHJcblx0XHR2YXIgeHggPSBNYXRoLmFicyh4MiAtIHgxKTtcclxuXHRcdHZhciB5eSA9IE1hdGguYWJzKHkyIC0geTEpO1xyXG5cdFx0XHJcblx0XHR2YXIgYW5nID0gTWF0aC5hdGFuMih5eSwgeHgpO1xyXG5cdFx0XHJcblx0XHRpZiAoeDIgPD0geDEgJiYgeTIgPD0geTEpe1xyXG5cdFx0XHRhbmcgPSB0aGlzLlBJIC0gYW5nO1xyXG5cdFx0fWVsc2UgaWYgKHgyIDw9IHgxICYmIHkyID4geTEpe1xyXG5cdFx0XHRhbmcgPSB0aGlzLlBJICsgYW5nO1xyXG5cdFx0fWVsc2UgaWYgKHgyID4geDEgJiYgeTIgPiB5MSl7XHJcblx0XHRcdGFuZyA9IHRoaXMuUEkyIC0gYW5nO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRhbmcgPSAoYW5nICsgdGhpcy5QSTIpICUgdGhpcy5QSTI7XHJcblx0XHRcclxuXHRcdHJldHVybiBhbmc7XHJcblx0fVxyXG59O1xyXG4iLCJmdW5jdGlvbiBNYXRyaXgzKCl7XHJcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gOSkgdGhyb3cgXCJNYXRyaXggMyBtdXN0IHJlY2VpdmUgOSBwYXJhbWV0ZXJzXCI7XHJcblx0XHJcblx0dmFyIGMgPSAwO1xyXG5cdGZvciAodmFyIGk9MDtpPDk7aSs9Myl7XHJcblx0XHR0aGlzW2NdID0gYXJndW1lbnRzW2ldO1xyXG5cdFx0dGhpc1tjKzNdID0gYXJndW1lbnRzW2krMV07XHJcblx0XHR0aGlzW2MrNl0gPSBhcmd1bWVudHNbaSsyXTtcclxuXHRcdFxyXG5cdFx0YyArPSAxO1xyXG5cdH1cclxuXHRcclxuXHR0aGlzLl9fa3RtdDMgPSB0cnVlO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdHJpeDM7XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS5nZXREZXRlcm1pbmFudCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHZhciBkZXQgPSAoVFswXSAqIFRbNF0gKiBUWzhdKSArIChUWzFdICogVFs1XSAqIFRbNl0pICsgKFRbMl0gKiBUWzNdICogVFs3XSlcclxuXHRcdFx0LSAoVFs2XSAqIFRbNF0gKiBUWzJdKSAtIChUWzddICogVFs1XSAqIFRbMF0pIC0gKFRbOF0gKiBUWzNdICogVFsxXSk7XHJcblx0XHJcblx0cmV0dXJuIGRldDtcclxufTtcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLmludmVyc2UgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBkZXQgPSB0aGlzLmdldERldGVybWluYW50KCk7XHJcblx0aWYgKGRldCA9PSAwKSByZXR1cm4gbnVsbDtcclxuXHRcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0dmFyIGludiA9IG5ldyBNYXRyaXgzKFxyXG5cdFx0VFs0XSpUWzhdLVRbNV0qVFs3XSxcdFRbNV0qVFs2XS1UWzNdKlRbOF0sXHRUWzNdKlRbN10tVFs0XSpUWzZdLFxyXG5cdFx0VFsyXSpUWzddLVRbMV0qVFs4XSxcdFRbMF0qVFs4XS1UWzJdKlRbNl0sXHRUWzFdKlRbNl0tVFswXSpUWzddLFxyXG5cdFx0VFsxXSpUWzVdLVRbMl0qVFs0XSxcdFRbMl0qVFszXS1UWzBdKlRbNV0sXHRUWzBdKlRbNF0tVFsxXSpUWzNdXHJcblx0KTtcclxuXHRcclxuXHRpbnYubXVsdGlwbHkoMSAvIGRldCk7XHJcblx0dGhpcy5jb3B5KGludik7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uKG51bWJlcil7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdGZvciAodmFyIGk9MDtpPDk7aSsrKXtcclxuXHRcdFRbaV0gKj0gbnVtYmVyO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbihtYXRyaXgzKXtcclxuXHRpZiAoIW1hdHJpeDMuX19rdG10MykgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgbWF0cml4MyBpbnRvIGFub3RoZXJcIjtcclxuXHRcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0Zm9yICh2YXIgaT0wO2k8OTtpKyspe1xyXG5cdFx0VFtpXSA9IG1hdHJpeDNbaV07XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUudHJhbnNwb3NlID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0dmFyIHZhbHVlcyA9IFtcclxuXHRcdFRbMF0sIFRbM10sIFRbNl0sXHJcblx0XHRUWzFdLCBUWzRdLCBUWzddLFxyXG5cdFx0VFsyXSwgVFs1XSwgVFs4XVxyXG5cdF07XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8OTtpKyspe1xyXG5cdFx0VFtpXSA9IHZhbHVlc1tpXTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS50b0Zsb2F0MzJBcnJheSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFtcclxuXHRcdFRbMF0sIFRbMV0sIFRbMl0sXHJcblx0XHRUWzNdLCBUWzRdLCBUWzVdLFxyXG5cdFx0VFs2XSwgVFs3XSwgVFs4XVxyXG5cdF0pO1xyXG59O1xyXG4iLCJ2YXIgTWF0cml4MyA9IHJlcXVpcmUoJy4vS1RNYXRyaXgzJyk7XHJcblxyXG5mdW5jdGlvbiBNYXRyaXg0KCl7XHJcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMTYpIHRocm93IFwiTWF0cml4IDQgbXVzdCByZWNlaXZlIDE2IHBhcmFtZXRlcnNcIjtcclxuXHRcclxuXHR2YXIgYyA9IDA7XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSs9NCl7XHJcblx0XHR0aGlzW2NdID0gYXJndW1lbnRzW2ldO1xyXG5cdFx0dGhpc1tjKzRdID0gYXJndW1lbnRzW2krMV07XHJcblx0XHR0aGlzW2MrOF0gPSBhcmd1bWVudHNbaSsyXTtcclxuXHRcdHRoaXNbYysxMl0gPSBhcmd1bWVudHNbaSszXTtcclxuXHRcdFxyXG5cdFx0YyArPSAxO1xyXG5cdH1cclxuXHRcclxuXHR0aGlzLl9fa3RtNCA9IHRydWU7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0cml4NDtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLmlkZW50aXR5ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgcGFyYW1zID0gW1xyXG5cdFx0MSwgMCwgMCwgMCxcclxuXHRcdDAsIDEsIDAsIDAsXHJcblx0XHQwLCAwLCAxLCAwLFxyXG5cdFx0MCwgMCwgMCwgMVxyXG5cdF07XHJcblx0XHJcblx0dmFyIGMgPSAwO1xyXG5cdGZvciAodmFyIGk9MDtpPDE2O2krPTQpe1xyXG5cdFx0dGhpc1tjXSA9IHBhcmFtc1tpXTtcclxuXHRcdHRoaXNbYys0XSA9IHBhcmFtc1tpKzFdO1xyXG5cdFx0dGhpc1tjKzhdID0gcGFyYW1zW2krMl07XHJcblx0XHR0aGlzW2MrMTJdID0gcGFyYW1zW2krM107XHJcblx0XHRcclxuXHRcdGMgKz0gMTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5tdWx0aXBseVNjYWxhciA9IGZ1bmN0aW9uKG51bWJlcil7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdGZvciAodmFyIGk9MDtpPDE2O2krKyl7XHJcblx0XHRUW2ldICo9IG51bWJlcjtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uKG1hdHJpeDQpe1xyXG5cdGlmIChtYXRyaXg0Ll9fa3RtNCl7XHJcblx0XHR2YXIgQTEgPSBbdGhpc1swXSwgIHRoaXNbMV0sICB0aGlzWzJdLCAgdGhpc1szXV07XHJcblx0XHR2YXIgQTIgPSBbdGhpc1s0XSwgIHRoaXNbNV0sICB0aGlzWzZdLCAgdGhpc1s3XV07XHJcblx0XHR2YXIgQTMgPSBbdGhpc1s4XSwgIHRoaXNbOV0sICB0aGlzWzEwXSwgdGhpc1sxMV1dO1xyXG5cdFx0dmFyIEE0ID0gW3RoaXNbMTJdLCB0aGlzWzEzXSwgdGhpc1sxNF0sIHRoaXNbMTVdXTtcclxuXHRcdFxyXG5cdFx0dmFyIEIxID0gW21hdHJpeDRbMF0sIG1hdHJpeDRbNF0sIG1hdHJpeDRbOF0sICBtYXRyaXg0WzEyXV07XHJcblx0XHR2YXIgQjIgPSBbbWF0cml4NFsxXSwgbWF0cml4NFs1XSwgbWF0cml4NFs5XSwgIG1hdHJpeDRbMTNdXTtcclxuXHRcdHZhciBCMyA9IFttYXRyaXg0WzJdLCBtYXRyaXg0WzZdLCBtYXRyaXg0WzEwXSwgbWF0cml4NFsxNF1dO1xyXG5cdFx0dmFyIEI0ID0gW21hdHJpeDRbM10sIG1hdHJpeDRbN10sIG1hdHJpeDRbMTFdLCBtYXRyaXg0WzE1XV07XHJcblx0XHRcclxuXHRcdHZhciBkb3QgPSBmdW5jdGlvbihjb2wsIHJvdyl7XHJcblx0XHRcdHZhciBzdW0gPSAwO1xyXG5cdFx0XHRmb3IgKHZhciBqPTA7ajw0O2orKyl7IHN1bSArPSByb3dbal0gKiBjb2xbal07IH1cclxuXHRcdFx0cmV0dXJuIHN1bTtcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdHRoaXNbMF0gPSBkb3QoQTEsIEIxKTsgICB0aGlzWzFdID0gZG90KEExLCBCMik7ICAgdGhpc1syXSA9IGRvdChBMSwgQjMpOyAgIHRoaXNbM10gPSBkb3QoQTEsIEI0KTtcclxuXHRcdHRoaXNbNF0gPSBkb3QoQTIsIEIxKTsgICB0aGlzWzVdID0gZG90KEEyLCBCMik7ICAgdGhpc1s2XSA9IGRvdChBMiwgQjMpOyAgIHRoaXNbN10gPSBkb3QoQTIsIEI0KTtcclxuXHRcdHRoaXNbOF0gPSBkb3QoQTMsIEIxKTsgICB0aGlzWzldID0gZG90KEEzLCBCMik7ICAgdGhpc1sxMF0gPSBkb3QoQTMsIEIzKTsgIHRoaXNbMTFdID0gZG90KEEzLCBCNCk7XHJcblx0XHR0aGlzWzEyXSA9IGRvdChBNCwgQjEpOyAgdGhpc1sxM10gPSBkb3QoQTQsIEIyKTsgIHRoaXNbMTRdID0gZG90KEE0LCBCMyk7ICB0aGlzWzE1XSA9IGRvdChBNCwgQjQpO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9ZWxzZSBpZiAobWF0cml4NC5sZW5ndGggPT0gNCl7XHJcblx0XHR2YXIgcmV0ID0gW107XHJcblx0XHR2YXIgY29sID0gbWF0cml4NDtcclxuXHRcclxuXHRcdGZvciAodmFyIGk9MDtpPDE2O2krPTQpe1xyXG5cdFx0XHR2YXIgcm93ID0gW3RoaXNbaV0sIHRoaXNbaSsxXSwgdGhpc1tpKzJdLCB0aGlzW2krM11dO1xyXG5cdFx0XHR2YXIgc3VtID0gMDtcclxuXHRcdFx0XHJcblx0XHRcdGZvciAodmFyIGo9MDtqPDQ7aisrKXtcclxuXHRcdFx0XHRzdW0gKz0gcm93W2pdICogY29sW2pdO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXQucHVzaChzdW0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gcmV0O1xyXG5cdH1lbHNle1xyXG5cdFx0dGhyb3cgXCJJbnZhbGlkIGNvbnN0cnVjdG9yXCI7XHJcblx0fVxyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUudHJhbnNwb3NlID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0dmFyIHZhbHVlcyA9IFtcclxuXHRcdFRbMF0sIFRbNF0sIFRbOF0sICBUWzEyXSxcclxuXHRcdFRbMV0sIFRbNV0sIFRbOV0sICBUWzEzXSxcclxuXHRcdFRbMl0sIFRbNl0sIFRbMTBdLCBUWzE0XSxcclxuXHRcdFRbM10sIFRbN10sIFRbMTFdLCBUWzE1XSxcclxuXHRdO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPDE2O2krKyl7XHJcblx0XHR0aGlzW2ldID0gdmFsdWVzW2ldO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbihtYXRyaXg0KXtcclxuXHRpZiAoIW1hdHJpeDQuX19rdG00KSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSBNYXRyaXg0IGludG8gdGhpcyBtYXRyaXhcIjtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKyspe1xyXG5cdFx0dGhpc1tpXSA9IG1hdHJpeDRbaV07XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHRUWzBdLCBUWzRdLCBUWzhdLCAgVFsxMl0sXHJcblx0XHRUWzFdLCBUWzVdLCBUWzldLCAgVFsxM10sXHJcblx0XHRUWzJdLCBUWzZdLCBUWzEwXSwgVFsxNF0sXHJcblx0XHRUWzNdLCBUWzddLCBUWzExXSwgVFsxNV1cclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUudG9GbG9hdDMyQXJyYXkgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbXHJcblx0XHRUWzBdLCBUWzFdLCBUWzJdLCAgVFszXSxcclxuXHRcdFRbNF0sIFRbNV0sIFRbNl0sICBUWzddLFxyXG5cdFx0VFs4XSwgVFs5XSwgVFsxMF0sIFRbMTFdLFxyXG5cdFx0VFsxMl0sIFRbMTNdLCBUWzE0XSwgVFsxNV1cclxuXHRdKTtcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLnRvTWF0cml4MyA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHJldHVybiBuZXcgTWF0cml4MyhcclxuXHRcdFRbMF0sIFRbMV0sIFRbMl0sXHJcblx0XHRUWzRdLCBUWzVdLCBUWzZdLFxyXG5cdFx0VFs4XSwgVFs5XSwgVFsxMF1cclxuXHQpOyBcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0SWRlbnRpdHkgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdDEsIDAsIDAsIDAsXHJcblx0XHQwLCAxLCAwLCAwLFxyXG5cdFx0MCwgMCwgMSwgMCxcclxuXHRcdDAsIDAsIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRYUm90YXRpb24gPSBmdW5jdGlvbihyYWRpYW5zKXtcclxuXHR2YXIgQyA9IE1hdGguY29zKHJhZGlhbnMpO1xyXG5cdHZhciBTID0gTWF0aC5zaW4ocmFkaWFucyk7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0MSwgIDAsICAwLCAwLFxyXG5cdFx0MCwgIEMsICBTLCAwLFxyXG5cdFx0MCwgLVMsICBDLCAwLFxyXG5cdFx0MCwgIDAsICAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0WVJvdGF0aW9uID0gZnVuY3Rpb24ocmFkaWFucyl7XHJcblx0dmFyIEMgPSBNYXRoLmNvcyhyYWRpYW5zKTtcclxuXHR2YXIgUyA9IE1hdGguc2luKHJhZGlhbnMpO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdCBDLCAgMCwgIFMsIDAsXHJcblx0XHQgMCwgIDEsICAwLCAwLFxyXG5cdFx0LVMsICAwLCAgQywgMCxcclxuXHRcdCAwLCAgMCwgIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRaUm90YXRpb24gPSBmdW5jdGlvbihyYWRpYW5zKXtcclxuXHR2YXIgQyA9IE1hdGguY29zKHJhZGlhbnMpO1xyXG5cdHZhciBTID0gTWF0aC5zaW4ocmFkaWFucyk7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0IEMsICBTLCAwLCAwLFxyXG5cdFx0LVMsICBDLCAwLCAwLFxyXG5cdFx0IDAsICAwLCAxLCAwLFxyXG5cdFx0IDAsICAwLCAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0VHJhbnNsYXRpb24gPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IHRyYW5zbGF0ZSB0byBhIHZlY3RvciAzXCI7XHJcblx0XHJcblx0dmFyIHggPSB2ZWN0b3IzLng7XHJcblx0dmFyIHkgPSB2ZWN0b3IzLnk7XHJcblx0dmFyIHogPSB2ZWN0b3IzLno7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0MSwgMCwgMCwgeCxcclxuXHRcdDAsIDEsIDAsIHksXHJcblx0XHQwLCAwLCAxLCB6LFxyXG5cdFx0MCwgMCwgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFNjYWxlID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBzY2FsZSB0byBhIHZlY3RvciAzXCI7XHJcblx0XHJcblx0dmFyIHN4ID0gdmVjdG9yMy54O1xyXG5cdHZhciBzeSA9IHZlY3RvcjMueTtcclxuXHR2YXIgc3ogPSB2ZWN0b3IzLno7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0c3gsICAwLCAgMCwgMCxcclxuXHRcdCAwLCBzeSwgIDAsIDAsXHJcblx0XHQgMCwgIDAsIHN6LCAwLFxyXG5cdFx0IDAsICAwLCAgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFRyYW5zZm9ybWF0aW9uID0gZnVuY3Rpb24ocG9zaXRpb24sIHJvdGF0aW9uLCBzY2FsZSwgb3JkZXIpe1xyXG5cdGlmICghcG9zaXRpb24uX19rdHYzKSB0aHJvdyBcIlBvc2l0aW9uIG11c3QgYmUgYSBWZWN0b3IzXCI7XHJcblx0aWYgKCFyb3RhdGlvbi5fX2t0djMpIHRocm93IFwiUm90YXRpb24gbXVzdCBiZSBhIFZlY3RvcjNcIjtcclxuXHRpZiAoc2NhbGUgJiYgIXNjYWxlLl9fa3R2MykgdGhyb3cgXCJTY2FsZSBtdXN0IGJlIGEgVmVjdG9yM1wiO1xyXG5cdFxyXG5cdHZhciBzY2FsZSA9IChzY2FsZSk/IE1hdHJpeDQuZ2V0U2NhbGUoc2NhbGUpIDogTWF0cml4NC5nZXRJZGVudGl0eSgpO1xyXG5cdFxyXG5cdHZhciByb3RhdGlvblggPSBNYXRyaXg0LmdldFhSb3RhdGlvbihyb3RhdGlvbi54KTtcclxuXHR2YXIgcm90YXRpb25ZID0gTWF0cml4NC5nZXRZUm90YXRpb24ocm90YXRpb24ueSk7XHJcblx0dmFyIHJvdGF0aW9uWiA9IE1hdHJpeDQuZ2V0WlJvdGF0aW9uKHJvdGF0aW9uLnopO1xyXG5cdFxyXG5cdHZhciB0cmFuc2xhdGlvbiA9IE1hdHJpeDQuZ2V0VHJhbnNsYXRpb24ocG9zaXRpb24pO1xyXG5cdFxyXG5cdGlmICghb3JkZXIpIG9yZGVyID0gJ1NSVCc7XHJcblx0XHJcblx0dmFyIG1hdHJpeDtcclxuXHRpZiAob3JkZXIgPT0gJ1NSVCcpe1xyXG5cdFx0bWF0cml4ID0gc2NhbGU7XHJcblx0XHRtYXRyaXgubXVsdGlwbHkocm90YXRpb25YKTtcclxuXHRcdG1hdHJpeC5tdWx0aXBseShyb3RhdGlvblkpO1xyXG5cdFx0bWF0cml4Lm11bHRpcGx5KHJvdGF0aW9uWik7XHJcblx0XHRtYXRyaXgubXVsdGlwbHkodHJhbnNsYXRpb24pO1xyXG5cdH1lbHNlIGlmIChvcmRlciA9PSAnU1RSJyl7XHJcblx0XHRtYXRyaXggPSBzY2FsZTtcclxuXHRcdG1hdHJpeC5tdWx0aXBseSh0cmFuc2xhdGlvbik7XHJcblx0XHRtYXRyaXgubXVsdGlwbHkocm90YXRpb25ZKTtcclxuXHRcdG1hdHJpeC5tdWx0aXBseShyb3RhdGlvblgpO1xyXG5cdFx0bWF0cml4Lm11bHRpcGx5KHJvdGF0aW9uWik7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiBtYXRyaXg7XHJcbn07XHJcbiIsInZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxudmFyIFZlYzMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG5cclxuZnVuY3Rpb24gTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpe1xyXG5cdGlmICghZ2VvbWV0cnkuX19rdGdlb21ldHJ5KSB0aHJvdyBcIkdlb21ldHJ5IG11c3QgYmUgYSBLVEdlb21ldHJ5IGluc3RhbmNlXCI7XHJcblx0aWYgKCFtYXRlcmlhbC5fX2t0bWF0ZXJpYWwpIHRocm93IFwiTWF0ZXJpYWwgbXVzdCBiZSBhIEtUTWF0ZXJpYWwgaW5zdGFuY2VcIjtcclxuXHRcclxuXHR0aGlzLl9fa3RtZXNoID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLmdlb21ldHJ5ID0gZ2VvbWV0cnk7XHJcblx0dGhpcy5tYXRlcmlhbCA9IG1hdGVyaWFsO1xyXG5cdFxyXG5cdHRoaXMucGFyZW50ID0gbnVsbDtcclxuXHR0aGlzLnZpc2libGUgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMucG9zaXRpb24gPSBuZXcgVmVjMygwLCAwLCAwKTtcclxuXHR0aGlzLnJvdGF0aW9uID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcblx0dGhpcy5zY2FsZSA9IG5ldyBWZWMzKDEsIDEsIDEpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lc2g7XHJcblxyXG5NZXNoLnByb3RvdHlwZS5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIG1hdHJpeCA9IE1hdHJpeDQuZ2V0VHJhbnNmb3JtYXRpb24odGhpcy5wb3NpdGlvbiwgdGhpcy5yb3RhdGlvbiwgdGhpcy5zY2FsZSk7XHJcblx0XHJcblx0aWYgKHRoaXMucGFyZW50KXtcclxuXHRcdHZhciBtID0gdGhpcy5wYXJlbnQuZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuXHRcdG1hdHJpeC5tdWx0aXBseShtKTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIG1hdHJpeDtcclxufTtcclxuIiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxudmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcblxyXG5mdW5jdGlvbiBTY2VuZShwYXJhbXMpe1xyXG5cdHRoaXMuX19rdHNjZW5lID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLm1lc2hlcyA9IFtdO1xyXG5cdHRoaXMuZGlyTGlnaHQgPSBudWxsO1xyXG5cdHRoaXMuc2hhZGluZ01vZGUgPSBbJ0JBU0lDJywgJ0xBTUJFUlQnXTtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy51c2VMaWdodGluZyA9IChwYXJhbXMudXNlTGlnaHRpbmcpPyB0cnVlIDogZmFsc2U7XHJcblx0dGhpcy5hbWJpZW50TGlnaHQgPSAocGFyYW1zLmFtYmllbnRMaWdodCk/IG5ldyBDb2xvcihwYXJhbXMuYW1iaWVudExpZ2h0KSA6IG51bGw7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NlbmU7XHJcblxyXG5TY2VuZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24ob2JqZWN0KXtcclxuXHRpZiAob2JqZWN0Ll9fa3RtZXNoKXtcclxuXHRcdHRoaXMubWVzaGVzLnB1c2gob2JqZWN0KTtcclxuXHR9ZWxzZSBpZiAob2JqZWN0Ll9fa3RkaXJMaWdodCl7XHJcblx0XHR0aGlzLmRpckxpZ2h0ID0gb2JqZWN0O1xyXG5cdH1lbHNle1xyXG5cdFx0dGhyb3cgXCJDYW4ndCBhZGQgdGhlIG9iamVjdCB0byB0aGUgc2NlbmVcIjtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5TY2VuZS5wcm90b3R5cGUuZHJhd01lc2ggPSBmdW5jdGlvbihtZXNoLCBjYW1lcmEpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdHRoaXMuc2V0TWF0ZXJpYWxBdHRyaWJ1dGVzKG1lc2gubWF0ZXJpYWwpO1xyXG5cdFxyXG5cdHRoaXMuc2VuZEF0dHJpYkRhdGEobWVzaCwgS1Quc2hhZGVyLmF0dHJpYnV0ZXMsIGNhbWVyYSk7XHJcblx0dGhpcy5zZW5kVW5pZm9ybURhdGEobWVzaCwgS1Quc2hhZGVyLnVuaWZvcm1zLCBjYW1lcmEpO1xyXG5cdFxyXG5cdGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG1lc2guZ2VvbWV0cnkuZmFjZXNCdWZmZXIpO1xyXG5cdGdsLmRyYXdFbGVtZW50cyhnbFttZXNoLm1hdGVyaWFsLmRyYXdBc10sIG1lc2guZ2VvbWV0cnkuZmFjZXNCdWZmZXIubnVtSXRlbXMsIGdsLlVOU0lHTkVEX1NIT1JULCAwKTtcclxufTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihjYW1lcmEpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdHZhciBiYyA9IGNhbWVyYS5iYWNrZ3JvdW5kQ29sb3IuZ2V0UkdCQSgpO1xyXG5cdGdsLmNsZWFyQ29sb3IoYmNbMF0sIGJjWzFdLCBiY1syXSwgYmNbM10pO1xyXG5cdGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcclxuXHRcclxuXHRnbC5kaXNhYmxlKCBnbC5CTEVORCApOyBcclxuXHRnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7XHJcblx0dmFyIHRyYW5zcGFyZW50cyA9IFtdO1xyXG5cdFxyXG5cdGNhbWVyYS5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy5tZXNoZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgbWVzaCA9IHRoaXMubWVzaGVzW2ldO1xyXG5cdFx0aWYgKCFtZXNoLnZpc2libGUpIGNvbnRpbnVlO1xyXG5cdFx0aWYgKG1lc2gubWF0ZXJpYWwub3BhY2l0eSA9PSAwLjApIGNvbnRpbnVlO1xyXG5cdFx0XHJcblx0XHR2YXIgc2hhZGluZyA9IHRoaXMuc2hhZGluZ01vZGUuaW5kZXhPZihtZXNoLm1hdGVyaWFsLnNoYWRpbmcpO1xyXG5cdFx0aWYgKHNoYWRpbmcgPT0gMSl7XHJcblx0XHRcdGlmIChtZXNoLm1hdGVyaWFsLm9wYWNpdHkgIT0gMS4wKXtcclxuXHRcdFx0XHR0cmFuc3BhcmVudHMucHVzaChtZXNoKTtcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLmRyYXdNZXNoKG1lc2gsIGNhbWVyYSk7XHJcblx0fVxyXG5cdFxyXG5cdGdsLmVuYWJsZSggZ2wuQkxFTkQgKTsgXHJcblx0Z2wuZGlzYWJsZShnbC5ERVBUSF9URVNUKTtcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRyYW5zcGFyZW50cy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBtZXNoID0gdHJhbnNwYXJlbnRzW2ldO1xyXG5cdFx0dGhpcy5kcmF3TWVzaChtZXNoLCBjYW1lcmEpO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5zZW5kQXR0cmliRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGF0dHJpYnV0ZXMsIGNhbWVyYSl7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0dmFyIGdlb21ldHJ5ID0gbWVzaC5nZW9tZXRyeTtcclxuXHRmb3IgKHZhciBpPTAsbGVuPWF0dHJpYnV0ZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgYXR0ID0gYXR0cmlidXRlc1tpXTtcclxuXHRcdFxyXG5cdFx0aWYgKGF0dC5uYW1lID09IFwiYVZlcnRleFBvc2l0aW9uXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LnZlcnRleEJ1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhDb2xvclwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LmNvbG9yc0J1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS5jb2xvcnNCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9ZWxzZSBpZiAoYXR0Lm5hbWUgPT0gXCJhVGV4dHVyZUNvb3JkXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkudGV4QnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LnRleEJ1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhOb3JtYWxcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS5ub3JtYWxzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5Lm5vcm1hbHNCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuU2NlbmUucHJvdG90eXBlLnNlbmRVbmlmb3JtRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIHVuaWZvcm1zLCBjYW1lcmEpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIHRyYW5zZm9ybWF0aW9uTWF0cml4O1xyXG5cdGZvciAodmFyIGk9MCxsZW49dW5pZm9ybXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgdW5pID0gdW5pZm9ybXNbaV07XHJcblx0XHRcclxuXHRcdGlmICh1bmkubmFtZSA9PSAndVNoYWRpbmdNb2RlJyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIHRoaXMuc2hhZGluZ01vZGUuaW5kZXhPZihtZXNoLm1hdGVyaWFsLnNoYWRpbmcpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1WUE1hdHJpeCcpe1xyXG5cdFx0XHR0cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG1lc2guZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKS5tdWx0aXBseShjYW1lcmEudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG5cdFx0XHR2YXIgbXZwID0gdHJhbnNmb3JtYXRpb25NYXRyaXguY2xvbmUoKS5tdWx0aXBseShjYW1lcmEucGVyc3BlY3RpdmVNYXRyaXgpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG12cC50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1hdGVyaWFsQ29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gbWVzaC5tYXRlcmlhbC5jb2xvci5nZXRSR0JBKCk7XHJcblx0XHRcdGdsLnVuaWZvcm00ZnYodW5pLmxvY2F0aW9uLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9yKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlU2FtcGxlcicpe1xyXG5cdFx0XHRpZiAobWVzaC5tYXRlcmlhbC50ZXh0dXJlKXtcclxuXHRcdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwKTtcclxuXHRcdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBtZXNoLm1hdGVyaWFsLnRleHR1cmUudGV4dHVyZSk7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUhhc1RleHR1cmUnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKG1lc2gubWF0ZXJpYWwudGV4dHVyZSk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVVzZUxpZ2h0aW5nJyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sICh0aGlzLnVzZUxpZ2h0aW5nKT8gMSA6IDApO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1Tm9ybWFsTWF0cml4Jyl7XHJcblx0XHRcdHZhciBub3JtYWxNYXRyaXggPSB0cmFuc2Zvcm1hdGlvbk1hdHJpeC50b01hdHJpeDMoKS5pbnZlcnNlKCkudG9GbG9hdDMyQXJyYXkoKTtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDNmdih1bmkubG9jYXRpb24sIGZhbHNlLCBub3JtYWxNYXRyaXgpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TGlnaHREaXJlY3Rpb24nICYmIHRoaXMudXNlTGlnaHRpbmcgJiYgdGhpcy5kaXJMaWdodCl7XHJcblx0XHRcdHZhciBkID0gY2FtZXJhLk5SVHJhbnNmb3JtYXRpb25NYXRyaXgubXVsdGlwbHkoW3RoaXMuZGlyTGlnaHQuZGlyZWN0aW9uLngsIHRoaXMuZGlyTGlnaHQuZGlyZWN0aW9uLnksIHRoaXMuZGlyTGlnaHQuZGlyZWN0aW9uLnosIDFdKTtcclxuXHRcdFx0dmFyIGRpciA9IG5ldyBLVC5WZWN0b3IzKGRbMF0sIGRbMV0sIGRbMl0pLm5vcm1hbGl6ZSgpO1xyXG5cdFx0XHRnbC51bmlmb3JtM2YodW5pLmxvY2F0aW9uLCBkaXIueCwgZGlyLnksIGRpci56KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUxpZ2h0RGlyZWN0aW9uQ29sb3InICYmIHRoaXMudXNlTGlnaHRpbmcgJiYgdGhpcy5kaXJMaWdodCl7XHJcblx0XHRcdHZhciBjb2xvciA9IHRoaXMuZGlyTGlnaHQuY29sb3IuZ2V0UkdCKCk7XHJcblx0XHRcdGdsLnVuaWZvcm0zZih1bmkubG9jYXRpb24sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0pO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TGlnaHREaXJlY3Rpb25JbnRlbnNpdHknICYmIHRoaXMudXNlTGlnaHRpbmcgJiYgdGhpcy5kaXJMaWdodCl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZih1bmkubG9jYXRpb24sIHRoaXMuZGlyTGlnaHQuaW50ZW5zaXR5KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUFtYmllbnRMaWdodENvbG9yJyAmJiB0aGlzLnVzZUxpZ2h0aW5nICYmIHRoaXMuYW1iaWVudExpZ2h0KXtcclxuXHRcdFx0dmFyIGNvbG9yID0gdGhpcy5hbWJpZW50TGlnaHQuZ2V0UkdCKCk7XHJcblx0XHRcdGdsLnVuaWZvcm0zZih1bmkubG9jYXRpb24sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0pO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1T3BhY2l0eScpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLm9wYWNpdHkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5zZXRNYXRlcmlhbEF0dHJpYnV0ZXMgPSBmdW5jdGlvbihtYXRlcmlhbCl7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0XHJcblx0dmFyIGN1bGwgPSBcIkJBQ0tcIjtcclxuXHRpZiAobWF0ZXJpYWwuZHJhd0ZhY2VzID09ICdCQUNLJyl7IGN1bGwgPSBcIkZST05UXCI7IH1cclxuXHRlbHNlIGlmIChtYXRlcmlhbC5kcmF3RmFjZXMgPT0gJ0JPVEgnKXsgY3VsbCA9IFwiXCI7IH1cclxuXHRcclxuXHRpZiAoY3VsbCAhPSBcIlwiKXtcclxuXHRcdGdsLmVuYWJsZShnbC5DVUxMX0ZBQ0UpO1xyXG5cdFx0Z2wuY3VsbEZhY2UoZ2xbY3VsbF0pO1xyXG5cdH1lbHNle1xyXG5cdFx0Z2wuZGlzYWJsZShnbC5DVUxMX0ZBQ0UpO1xyXG5cdH1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0YXR0cmlidXRlczogW1xyXG5cdFx0e25hbWU6ICdhVmVydGV4UG9zaXRpb24nLCB0eXBlOiAndjMnfSxcclxuXHRcdHtuYW1lOiAnYVZlcnRleENvbG9yJywgdHlwZTogJ3Y0J30sXHJcblx0XHR7bmFtZTogJ2FUZXh0dXJlQ29vcmQnLCB0eXBlOiAndjInfSxcclxuXHRcdFxyXG5cdFx0e25hbWU6ICdhVmVydGV4Tm9ybWFsJywgdHlwZTogJ3YzJ31cclxuXHRdLFxyXG5cdHVuaWZvcm1zOiBbXHJcblx0XHR7bmFtZTogJ3VTaGFkaW5nTW9kZScsIHR5cGU6ICdpbnQnfSxcclxuXHRcdHtuYW1lOiAndU1WUE1hdHJpeCcsIHR5cGU6ICdtNCd9LFxyXG5cdFx0e25hbWU6ICd1TWF0ZXJpYWxDb2xvcicsIHR5cGU6ICd2NCd9LFxyXG5cdFx0e25hbWU6ICd1VGV4dHVyZVNhbXBsZXInLCB0eXBlOiAndGV4J30sXHJcblx0XHR7bmFtZTogJ3VIYXNUZXh0dXJlJywgdHlwZTogJ2Jvb2wnfSxcclxuXHRcdFxyXG5cdFx0e25hbWU6ICd1VXNlTGlnaHRpbmcnLCB0eXBlOiAnYm9vbCd9LFxyXG5cdFx0e25hbWU6ICd1Tm9ybWFsTWF0cml4JywgdHlwZTogJ20zJ30sXHJcblx0XHRcclxuXHRcdHtuYW1lOiAndUFtYmllbnRMaWdodENvbG9yJywgdHlwZTogJ3YzJ30sXHJcblx0XHRcclxuXHRcdHtuYW1lOiAndUxpZ2h0RGlyZWN0aW9uJywgdHlwZTogJ3YzJ30sXHJcblx0XHR7bmFtZTogJ3VMaWdodERpcmVjdGlvbkNvbG9yJywgdHlwZTogJ3YzJ30sXHJcblx0XHR7bmFtZTogJ3VMaWdodERpcmVjdGlvbkludGVuc2l0eScsIHR5cGU6ICdmJ30sXHJcblx0XHRcclxuXHRcdHtuYW1lOiAndU9wYWNpdHknLCB0eXBlOiAnZid9XHJcblx0XSxcclxuXHR2ZXJ0ZXhTaGFkZXI6IFxyXG5cdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMyIGFUZXh0dXJlQ29vcmQ7IFwiICtcclxuXHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjMyBhVmVydGV4UG9zaXRpb247IFwiICtcclxuXHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjNCBhVmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFxyXG5cdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMzIGFWZXJ0ZXhOb3JtYWw7IFwiICsgXHJcblx0XHRcclxuXHRcdFxyXG5cdFx0XCJ1bmlmb3JtIGludCB1U2hhZGluZ01vZGU7IFwiICtcclxuXHRcdFxyXG5cdFx0XCJ1bmlmb3JtIG1lZGl1bXAgbWF0NCB1TVZQTWF0cml4OyBcIiArXHJcblx0XHRcInVuaWZvcm0gbWVkaXVtcCB2ZWM0IHVNYXRlcmlhbENvbG9yOyBcIiArXHJcblx0XHRcclxuXHRcdFwidW5pZm9ybSBib29sIHVVc2VMaWdodGluZzsgXCIgK1xyXG5cdFx0XCJ1bmlmb3JtIG1lZGl1bXAgbWF0MyB1Tm9ybWFsTWF0cml4OyBcIiArXHJcblx0XHRcclxuXHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzMgdUFtYmllbnRMaWdodENvbG9yOyBcIiArXHJcblx0XHRcclxuXHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzMgdUxpZ2h0RGlyZWN0aW9uOyBcIiArXHJcblx0XHRcInVuaWZvcm0gbWVkaXVtcCB2ZWMzIHVMaWdodERpcmVjdGlvbkNvbG9yOyBcIiArXHJcblx0XHRcInVuaWZvcm0gbWVkaXVtcCBmbG9hdCB1TGlnaHREaXJlY3Rpb25JbnRlbnNpdHk7IFwiICsgIFxyXG5cdFx0XHJcblx0XHRcclxuXHRcdFwidmFyeWluZyBtZWRpdW1wIGZsb2F0IHZTaGFkaW5nTW9kZTsgXCIgK1xyXG5cdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDtcIiArICBcclxuXHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdkxpZ2h0V2VpZ2h0OyBcIiArIFxyXG5cdFx0XHJcblx0XHRcInZvaWQgYmFzaWModm9pZCl7XCIgK1xyXG5cdFx0XHRcInZWZXJ0ZXhDb2xvciA9IGFWZXJ0ZXhDb2xvciAqIHVNYXRlcmlhbENvbG9yOyBcIiArXHJcblx0XHRcdFwidlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7IFwiICsgIFxyXG5cdFx0XCJ9IFwiICArIFxyXG5cdFx0XHJcblx0XHRcInZvaWQgbGFtYmVydCh2b2lkKXsgXCIgK1xyXG5cdFx0XHRcImlmICh1VXNlTGlnaHRpbmcpeyBcIiArIFxyXG5cdFx0XHRcdFwidmVjMyB0cmFuc2Zvcm1lZE5vcm1hbCA9IHVOb3JtYWxNYXRyaXggKiBhVmVydGV4Tm9ybWFsOyBcIiArXHJcblx0XHRcdFx0XCJmbG9hdCBkaXJMaWdodFdlaWdodCA9IG1heChkb3QodHJhbnNmb3JtZWROb3JtYWwsIHVMaWdodERpcmVjdGlvbiksIDAuMCk7IFwiICtcclxuXHRcdFx0XHRcInZMaWdodFdlaWdodCA9IHVBbWJpZW50TGlnaHRDb2xvciArICh1TGlnaHREaXJlY3Rpb25Db2xvciAqIGRpckxpZ2h0V2VpZ2h0ICogdUxpZ2h0RGlyZWN0aW9uSW50ZW5zaXR5KTsgXCIgK1xyXG5cdFx0XHRcIn1lbHNleyBcIiArXHJcblx0XHRcdFx0XCJ2TGlnaHRXZWlnaHQgPSB2ZWMzKDEuMCk7IFwiICsgXHJcblx0XHRcdFwifVwiICsgICBcclxuXHRcdFx0IFxyXG5cdFx0XHRcInZWZXJ0ZXhDb2xvciA9IGFWZXJ0ZXhDb2xvciAqIHVNYXRlcmlhbENvbG9yOyBcIiArXHJcblx0XHRcdFwidlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7IFwiICsgIFxyXG5cdFx0XCJ9IFwiICsgIFxyXG5cdFx0XHJcblx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgKyBcclxuXHRcdFx0XCJnbF9Qb3NpdGlvbiA9IHVNVlBNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTsgXCIgK1xyXG5cdFx0XHJcblx0XHRcdFwidlNoYWRpbmdNb2RlID0gZmxvYXQodVNoYWRpbmdNb2RlKTsgXCIgK1xyXG5cdFx0XHRcImlmICh1U2hhZGluZ01vZGUgPT0gMCl7IFwiICtcclxuXHRcdFx0XHRcImJhc2ljKCk7IFwiICtcclxuXHRcdFx0XCJ9ZWxzZSBpZiAodVNoYWRpbmdNb2RlID09IDEpeyBcIiArXHJcblx0XHRcdFx0XCJsYW1iZXJ0KCk7IFwiICtcclxuXHRcdFx0XCJ9IFwiICtcclxuXHRcdFwifSBcIiAsXHJcblx0ZnJhZ21lbnRTaGFkZXI6IFxyXG5cdFx0XCJ1bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZVNhbXBsZXI7IFwiICtcclxuXHRcdFwidW5pZm9ybSBib29sIHVIYXNUZXh0dXJlOyBcIiArXHJcblx0XHRcInVuaWZvcm0gbWVkaXVtcCBmbG9hdCB1T3BhY2l0eTsgXCIgK1xyXG5cdFx0XHJcblx0XHRcInZhcnlpbmcgbWVkaXVtcCBmbG9hdCB2U2hhZGluZ01vZGU7IFwiICtcclxuXHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDsgXCIgKyBcclxuXHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdlZlcnRleENvbG9yOyBcIiArIFxyXG5cdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMyB2TGlnaHRXZWlnaHQ7IFwiICsgXHJcblx0XHRcclxuXHRcdFwidm9pZCBiYXNpYyhtZWRpdW1wIHZlYzQgY29sb3Ipe1wiICtcclxuXHRcdFx0XCJnbF9GcmFnQ29sb3IgPSBjb2xvcjtcIiArIFxyXG5cdFx0XCJ9IFwiICArIFxyXG5cdFx0XHJcblx0XHRcInZvaWQgbGFtYmVydChtZWRpdW1wIHZlYzQgY29sb3IpeyBcIiArXHJcblx0XHRcdFwiY29sb3IucmdiICo9IHZMaWdodFdlaWdodDsgXCIgKyBcclxuXHRcdFx0XCJnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLnJnYiwgY29sb3IuYSAqIHVPcGFjaXR5KTsgXCIgKyBcclxuXHRcdFwifSBcIiArICBcclxuXHRcdFxyXG5cdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICtcclxuXHRcdFx0XCJtZWRpdW1wIHZlYzQgY29sb3IgPSB2VmVydGV4Q29sb3I7IFwiICsgXHJcblx0XHRcdFwiaWYgKHVIYXNUZXh0dXJlKXsgXCIgKyBcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjNCB0ZXhDb2xvciA9IHRleHR1cmUyRCh1VGV4dHVyZVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC5zLCB2VGV4dHVyZUNvb3JkLnQpKTsgXCIgK1xyXG5cdFx0XHRcdFwiY29sb3IgKj0gdGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XCJ9IFwiICsgXHJcblx0XHRcdFxyXG5cdFx0XHRcImlmICh2U2hhZGluZ01vZGUgPT0gMC4wKXsgXCIgK1xyXG5cdFx0XHRcdFwiYmFzaWMoY29sb3IpOyBcIiArXHJcblx0XHRcdFwifWVsc2UgaWYgKHZTaGFkaW5nTW9kZSA9PSAxLjApeyBcIiArXHJcblx0XHRcdFx0XCJsYW1iZXJ0KGNvbG9yKTsgXCIgK1xyXG5cdFx0XHRcIn0gXCIgK1xyXG5cdFx0XCJ9XCJcclxufTtcclxuIiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxudmFyIFV0aWxzID0gcmVxdWlyZSgnLi9LVFV0aWxzJyk7XHJcblxyXG5mdW5jdGlvbiBUZXh0dXJlKHNyYywgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3R0ZXh0dXJlID0gdHJ1ZTtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5taW5GaWx0ZXIgPSAocGFyYW1zLm1pbkZpbHRlcik/IHBhcmFtcy5taW5GaWx0ZXIgOiAnTElORUFSJztcclxuXHR0aGlzLm1hZ0ZpbHRlciA9IChwYXJhbXMubWFnRmlsdGVyKT8gcGFyYW1zLm1hZ0ZpbHRlciA6ICdMSU5FQVInO1xyXG5cdHRoaXMud3JhcFMgPSAocGFyYW1zLlNXcmFwcGluZyk/IHBhcmFtcy5TV3JhcHBpbmcgOiAnUkVQRUFUJztcclxuXHR0aGlzLndyYXBUID0gKHBhcmFtcy5UV3JhcHBpbmcpPyBwYXJhbXMuVFdyYXBwaW5nIDogJ1JFUEVBVCc7XHJcblx0XHJcblx0dGhpcy50ZXh0dWUgPSBudWxsO1xyXG5cdFxyXG5cdHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHR0aGlzLmltYWdlLnNyYyA9IHNyYztcclxuXHR0aGlzLmltYWdlLnJlYWR5ID0gZmFsc2U7XHJcblx0XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdFV0aWxzLmFkZEV2ZW50KHRoaXMuaW1hZ2UsIFwibG9hZFwiLCBmdW5jdGlvbigpe1xyXG5cdFx0VC5wYXJzZVRleHR1cmUoKTsgXHJcblx0fSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dHVyZTtcclxuXHJcblRleHR1cmUucHJvdG90eXBlLnBhcnNlVGV4dHVyZSA9IGZ1bmN0aW9uKCl7XHJcblx0aWYgKHRoaXMuaW1hZ2UucmVhZHkpIHJldHVybjtcclxuXHRcclxuXHR0aGlzLmltYWdlLnJlYWR5ID0gdHJ1ZTtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHR0aGlzLnRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcclxuXHRcclxuXHRnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCB0cnVlKTtcclxuXHRcclxuXHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIHRoaXMuaW1hZ2UpO1xyXG5cdFxyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbFt0aGlzLm1hZ0ZpbHRlcl0pO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbFt0aGlzLm1pbkZpbHRlcl0pO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsW3RoaXMud3JhcFNdKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbFt0aGlzLndyYXBUXSk7XHJcblx0XHJcblx0Z2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XHJcblx0XHJcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGdldDogZnVuY3Rpb24oZWxlbWVudCl7XHJcblx0XHRpZiAoZWxlbWVudC5jaGFyQXQoMCkgPT0gXCIjXCIpe1xyXG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudC5yZXBsYWNlKFwiI1wiLCBcIlwiKSk7XHJcblx0XHR9ZWxzZSBpZiAoZWxlbWVudC5jaGFyQXQoMCkgPT0gXCIuXCIpe1xyXG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShlbGVtZW50LnJlcGxhY2UoXCIuXCIsIFwiXCIpKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoZWxlbWVudCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRhZGRFdmVudDogZnVuY3Rpb24oZWxlbWVudCwgdHlwZSwgY2FsbGJhY2spe1xyXG5cdFx0aWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcil7XHJcblx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgZmFsc2UpO1xyXG5cdFx0fWVsc2UgaWYgKGVsZW1lbnQuYXR0YWNoRXZlbnQpe1xyXG5cdFx0XHRlbGVtZW50LmF0dGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGNhbGxiYWNrKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcbiIsImZ1bmN0aW9uIFZlY3RvcjIoeCwgeSl7XHJcblx0dGhpcy5fX2t0djIgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yMjtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkpO1xyXG5cdFxyXG5cdHJldHVybiBsZW5ndGg7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMueCAvPSBsZW5ndGg7XHJcblx0dGhpcy55IC89IGxlbmd0aDtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKHZlY3RvcjIpe1xyXG5cdGlmICghdmVjdG9yMi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgcGVyZm9ybSBhIGRvdCBwcm9kdWN0IHdpdGggYSB2ZWN0b3IyXCI7XHJcblx0XHJcblx0cmV0dXJuIHRoaXMueCAqIHZlY3RvcjIueCArIHRoaXMueSAqIHZlY3RvcjIueTtcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihudW1iZXIpe1xyXG5cdHRoaXMueCAqPSBudW1iZXI7XHJcblx0dGhpcy55ICo9IG51bWJlcjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHZlY3RvcjIpe1xyXG5cdGlmICghdmVjdG9yMi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgYWRkIGEgdmVjdG9yMiB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCArPSB2ZWN0b3IyLng7XHJcblx0dGhpcy55ICs9IHZlY3RvcjIueTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbih2ZWN0b3IyKXtcclxuXHRpZiAoIXZlY3RvcjIuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSB2ZWN0b3IyIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ID0gdmVjdG9yMi54O1xyXG5cdHRoaXMueSA9IHZlY3RvcjIueTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHkpe1xyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54LCB0aGlzLnkpO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24odmVjdG9yMil7XHJcblx0aWYgKCF2ZWN0b3IyLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgdmVjdG9yMiB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHJldHVybiAodGhpcy54ID09IHZlY3RvcjIueCAmJiB0aGlzLnkgPT0gdmVjdG9yMi55KTtcclxufTtcclxuXHJcblZlY3RvcjIudmVjdG9yc0RpZmZlcmVuY2UgPSBmdW5jdGlvbih2ZWN0b3IyX2EsIHZlY3RvcjJfYil7XHJcblx0aWYgKCF2ZWN0b3IyX2EuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMyXCI7XHJcblx0aWYgKCF2ZWN0b3IyX2IuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMyXCI7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IyKHZlY3RvcjJfYS54IC0gdmVjdG9yMl9iLngsIHZlY3RvcjJfYS55IC0gdmVjdG9yMl9iLnkpO1xyXG59O1xyXG5cclxuVmVjdG9yMi5mcm9tQW5nbGUgPSBmdW5jdGlvbihyYWRpYW4pe1xyXG5cdHZhciB4ID0gTWF0aC5jb3MocmFkaWFuKTtcclxuXHR2YXIgeSA9IC1NYXRoLnNpbihyYWRpYW4pO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMih4LCB5KTtcclxufTtcclxuIiwiZnVuY3Rpb24gVmVjdG9yMyh4LCB5LCB6KXtcclxuXHR0aGlzLl9fa3R2MyA9IHRydWU7XHJcblx0XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZlY3RvcjM7XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55ICsgdGhpcy56ICogdGhpcy56KTtcclxuXHRcclxuXHRyZXR1cm4gbGVuZ3RoO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGgoKTtcclxuXHRcclxuXHR0aGlzLnggLz0gbGVuZ3RoO1xyXG5cdHRoaXMueSAvPSBsZW5ndGg7XHJcblx0dGhpcy56IC89IGxlbmd0aDtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgcGVyZm9ybSBhIGRvdCBwcm9kdWN0IHdpdGggYSB2ZWN0b3IzXCI7XHJcblx0XHJcblx0cmV0dXJuIHRoaXMueCAqIHZlY3RvcjMueCArIHRoaXMueSAqIHZlY3RvcjMueSArIHRoaXMueiAqIHZlY3RvcjMuejtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBwZXJmb3JtIGEgY3Jvc3MgcHJvZHVjdCB3aXRoIGEgdmVjdG9yM1wiO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMyhcclxuXHRcdHRoaXMueSAqIHZlY3RvcjMueiAtIHRoaXMueiAqIHZlY3RvcjMueSxcclxuXHRcdHRoaXMueiAqIHZlY3RvcjMueCAtIHRoaXMueCAqIHZlY3RvcjMueixcclxuXHRcdHRoaXMueCAqIHZlY3RvcjMueSAtIHRoaXMueSAqIHZlY3RvcjMueFxyXG5cdCk7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24obnVtYmVyKXtcclxuXHR0aGlzLnggKj0gbnVtYmVyO1xyXG5cdHRoaXMueSAqPSBudW1iZXI7XHJcblx0dGhpcy56ICo9IG51bWJlcjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgYWRkIGEgVmVjdG9yMyB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCArPSB2ZWN0b3IzLng7XHJcblx0dGhpcy55ICs9IHZlY3RvcjMueTtcclxuXHR0aGlzLnogKz0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIFZlY3RvcjMgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHR0aGlzLnggPSB2ZWN0b3IzLng7XHJcblx0dGhpcy55ID0gdmVjdG9yMy55O1xyXG5cdHRoaXMueiA9IHZlY3RvcjMuejtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHksIHope1xyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxuXHR0aGlzLnogPSB6O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLngsIHRoaXMueSwgdGhpcy56KTtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIFZlY3RvcjMgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHRyZXR1cm4gKHRoaXMueCA9PSB2ZWN0b3IzLnggJiYgdGhpcy55ID09IHZlY3RvcjMueSAmJiB0aGlzLnogPT0gdmVjdG9yMy56KTtcclxufTtcclxuXHJcblZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UgPSBmdW5jdGlvbih2ZWN0b3IzX2EsIHZlY3RvcjNfYil7XHJcblx0aWYgKCF2ZWN0b3IzX2EuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMzXCI7XHJcblx0aWYgKCF2ZWN0b3IzX2IuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMzXCI7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IzKHZlY3RvcjNfYS54IC0gdmVjdG9yM19iLngsIHZlY3RvcjNfYS55IC0gdmVjdG9yM19iLnksIHZlY3RvcjNfYS56IC0gdmVjdG9yM19iLnopO1xyXG59O1xyXG5cclxuVmVjdG9yMy5mcm9tQW5nbGUgPSBmdW5jdGlvbihyYWRpYW5feHosIHJhZGlhbl95KXtcclxuXHR2YXIgeCA9IE1hdGguY29zKHJhZGlhbl94eik7XHJcblx0dmFyIHkgPSBNYXRoLnNpbihyYWRpYW5feSk7XHJcblx0dmFyIHogPSAtTWF0aC5zaW4ocmFkaWFuX3h6KTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjMoeCwgeSwgeik7XHJcbn07XHJcbiIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbktULkNhbWVyYVBlcnNwZWN0aXZlID0gcmVxdWlyZSgnLi9LVENhbWVyYVBlcnNwZWN0aXZlJyk7XHJcbktULkNvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbktULkdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbktULkdlb21ldHJ5Qm94ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Qm94Jyk7XHJcbktULkdlb21ldHJ5UGxhbmUgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnlQbGFuZScpO1xyXG5LVC5HZW9tZXRyeVNwaGVyZSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeVNwaGVyZScpO1xyXG5LVC5MaWdodERpcmVjdGlvbmFsID0gcmVxdWlyZSgnLi9LVExpZ2h0RGlyZWN0aW9uYWwnKTtcclxuS1QuTWF0ZXJpYWwgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWwnKTtcclxuS1QuTWF0ZXJpYWxCYXNpYyA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbEJhc2ljJyk7XHJcbktULk1hdGVyaWFsTGFtYmVydCA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbExhbWJlcnQnKTtcclxuS1QuTWF0aCA9IHJlcXVpcmUoJy4vS1RNYXRoJyk7XHJcbktULk1hdHJpeDMgPSByZXF1aXJlKCcuL0tUTWF0cml4MycpO1xyXG5LVC5NYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxuS1QuTWVzaCA9IHJlcXVpcmUoJy4vS1RNZXNoJyk7XHJcbktULlRleHR1cmUgPSByZXF1aXJlKCcuL0tUVGV4dHVyZScpO1xyXG5LVC5VdGlscyA9IHJlcXVpcmUoJy4vS1RVdGlscycpO1xyXG5LVC5WZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxuS1QuVmVjdG9yMyA9IHJlcXVpcmUoJy4vS1RWZWN0b3IzJyk7XHJcbktULlNjZW5lID0gcmVxdWlyZSgnLi9LVFNjZW5lJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtUOyIsIndpbmRvdy5LVCA9IHJlcXVpcmUoJy4vS3JhbVRlY2gnKTsiXX0=
