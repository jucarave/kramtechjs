(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraPerspective.js":[function(require,module,exports){
var Matrix4 = require('./KTMatrix4');

function CameraPerspective(position, rotation, fov, ratio, znear, zfar){
	this.__ktcamera = true;
	
	this.position = position;
	this.rotation = rotation;
	
	this.fov = fov;
	this.ratio = ratio;
	this.znear = znear;
	this.zfar = zfar;
	
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
	).toFloat32Array();
};

},{"./KTMatrix4":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js"}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js":[function(require,module,exports){
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
},{}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js":[function(require,module,exports){
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

Geometry.prototype.build = function(){
	var vertices = [];
	var uvCoords = [];
	var triangles = [];
	var colors = [];
	
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
	
	this.vertexBuffer = KT.createArrayBuffer("ARRAY_BUFFER", new Float32Array(vertices), 3);
	this.texBuffer = KT.createArrayBuffer("ARRAY_BUFFER", new Float32Array(uvCoords), 2);
	this.facesBuffer = KT.createArrayBuffer("ELEMENT_ARRAY_BUFFER", new Uint16Array(triangles), 1);
	this.colorsBuffer = KT.createArrayBuffer("ARRAY_BUFFER", new Float32Array(colors), 4);
	
	return this;
};

},{"./KTColor":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTMain":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMatrix4":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTVector2":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryBox.js":[function(require,module,exports){
var Color = require('./KTColor');
var Geometry = require('./KTGeometry');

function GeometryBox(width, length, height){
	this.__ktgeometry = true;
	
	var boxGeo = new Geometry();
	
	var w = width / 2;
	var l = length / 2;
	var h = height / 2;
	
	boxGeo.addVertice( w, -h,  l, Color._WHITE, 1.0, 1.0);
	boxGeo.addVertice(-w,  h,  l, Color._WHITE, 0.0, 0.0);
	boxGeo.addVertice(-w, -h,  l, Color._WHITE, 0.0, 1.0);
	boxGeo.addVertice( w,  h,  l, Color._WHITE, 1.0, 0.0);
	
	boxGeo.addVertice(-w, -h, -l, Color._WHITE, 0.0, 1.0);
	boxGeo.addVertice(-w,  h, -l, Color._WHITE, 0.0, 0.0);
	boxGeo.addVertice( w, -h, -l, Color._WHITE, 1.0, 1.0);
	boxGeo.addVertice( w,  h, -l, Color._WHITE, 1.0, 0.0);
	
	boxGeo.addVertice( w, -h, -l, Color._WHITE, 1.0, 1.0);
	boxGeo.addVertice( w,  h,  l, Color._WHITE, 0.0, 0.0);
	boxGeo.addVertice( w, -h,  l, Color._WHITE, 0.0, 1.0);
	boxGeo.addVertice( w,  h, -l, Color._WHITE, 1.0, 0.0);
	
	boxGeo.addVertice(-w, -h,  l, Color._WHITE, 1.0, 1.0);
	boxGeo.addVertice(-w,  h,  l, Color._WHITE, 1.0, 0.0);
	boxGeo.addVertice(-w, -h, -l, Color._WHITE, 0.0, 1.0);
	boxGeo.addVertice(-w,  h, -l, Color._WHITE, 0.0, 0.0);
	
	boxGeo.addVertice( w,  h,  l, Color._WHITE, 1.0, 1.0);
	boxGeo.addVertice(-w,  h, -l, Color._WHITE, 0.0, 0.0);
	boxGeo.addVertice(-w,  h,  l, Color._WHITE, 0.0, 1.0);
	boxGeo.addVertice( w,  h, -l, Color._WHITE, 1.0, 0.0);
	
	boxGeo.addVertice(-w, -h,  l, Color._WHITE, 0.0, 1.0);
	boxGeo.addVertice(-w, -h, -l, Color._WHITE, 0.0, 0.0);
	boxGeo.addVertice( w, -h,  l, Color._WHITE, 1.0, 1.0);
	boxGeo.addVertice( w, -h, -l, Color._WHITE, 1.0, 0.0);
	
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
	
	boxGeo.build();
	
	this.vertexBuffer = boxGeo.vertexBuffer;
	this.texBuffer = boxGeo.texBuffer;
	this.facesBuffer = boxGeo.facesBuffer;
	this.colorsBuffer = boxGeo.colorsBuffer;
}

module.exports = GeometryBox;
},{"./KTColor":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js"}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js":[function(require,module,exports){
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
		
		gl.enable( gl.BLEND );
		gl.blendEquation( gl.FUNC_ADD );
		gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
	},
	
	__initShaders: function(){
		this.shaders.basic = this.processShader(Shaders.basic);
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
			throw "Error initializing the shader program";
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



},{"./KTShaders":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTShaders.js"}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js":[function(require,module,exports){
var Color = require('./KTColor');

function Material(parameters){
	this.__ktmaterial = true;
	
	if (!parameters) parameters = {};
	
	this.texture = (parameters.texture)? parameters.texture : null;
	this.color = new Color((parameters.color)? parameters.color : Color._WHITE);
	this.shader = (parameters.shader)? parameters.shader : null;
	this.opacity = (parameters.opacity)? parameters.opacity : 1.0;
	this.drawFaces = (parameters.drawFaces)? parameters.drawFaces : 'FRONT';
	this.drawAs = (parameters.drawAs)? parameters.drawAs : 'TRIANGLES';
}

module.exports = Material;
},{"./KTColor":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js"}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialBasic.js":[function(require,module,exports){
var KT = require('./KTMain');
var Material = require('./KTMaterial');

function MaterialBasic(texture, color, opacity){
	this.__ktmaterial = true;
	
	var material = new Material({
		texture: texture,
		color: color,
		opacity: opacity,
		shader: KT.shaders.basic
	});
	
	this.texture = material.texture;
	this.color = material.color;
	this.shader = material.shader;
	this.opacity = material.opacity;
	this.drawFaces = material.drawFaces;
	this.drawAs = material.drawAs;
}

module.exports = MaterialBasic;

},{"./KTMain":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMaterial":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js"}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js":[function(require,module,exports){
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
	}
};

},{}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js":[function(require,module,exports){
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
		0,  C, -S, 0,
		0,  S,  C, 0,
		0,  0,  0, 1
	);
};

Matrix4.getYRotation = function(radians){
	var C = Math.cos(radians);
	var S = Math.sin(radians);
	
	return new Matrix4(
		 C,  0, -S, 0,
		 0,  1,  0, 0,
		 S,  0,  C, 0,
		 0,  0,  0, 1
	);
};

Matrix4.getZRotation = function(radians){
	var C = Math.cos(radians);
	var S = Math.sin(radians);
	
	return new Matrix4(
		 C, -S, 0, 0,
		 S,  C, 0, 0,
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

Matrix4.getTransformation = function(position, rotation, scale){
	if (!position.__ktv3) throw "Position must be a Vector3";
	if (!rotation.__ktv3) throw "Rotation must be a Vector3";
	if (scale && !scale.__ktv3) throw "Scale must be a Vector3";
	
	var scale = (scale)? Matrix4.getScale(scale) : Matrix4.getIdentity();
	
	var rotationX = Matrix4.getXRotation(rotation.x);
	var rotationY = Matrix4.getYRotation(rotation.y);
	var rotationZ = Matrix4.getZRotation(rotation.z);
	
	var translation = Matrix4.getTranslation(position);
	
	
	var matrix = scale;
	matrix.multiply(rotationX);
	matrix.multiply(rotationY);
	matrix.multiply(rotationZ);
	matrix.multiply(translation);
	
	return matrix;
};

},{}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMesh.js":[function(require,module,exports){
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

Mesh.prototype.getTransformationMatrix = function(camera){
	var matrix = Matrix4.getTransformation(this.position, this.rotation, this.scale);
	
	var parent = this.parent;
	while (parent){
		var m = Matrix4.getTransformation(parent.position, parent.rotation, parent.scale);
		matrix.multiply(m);
		parent = parent.parent;
	}
	
	var camMat = Matrix4.getTransformation(camera.position, camera.rotation);
	matrix.multiply(camMat);
	
	return matrix;
};

},{"./KTMatrix4":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTVector3":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTScene.js":[function(require,module,exports){
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
		}else if (att.name == "aTextureCoord"){
			gl.bindBuffer(gl.ARRAY_BUFFER, geometry.texBuffer);
			gl.vertexAttribPointer(att.location, geometry.texBuffer.itemSize, gl.FLOAT, false, 0, 0);
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

},{"./KTMain":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js"}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTShaders.js":[function(require,module,exports){
module.exports = {
	basic: {
		attributes: [
			{name: 'aVertexPosition', type: 'v3'},
			{name: 'aVertexColor', type: 'v4'},
			{name: 'aTextureCoord', type: 'v2'}
		],
		uniforms: [
			{name: 'uTransformationMatrix', type: 'm4'},
			{name: 'uPerspectiveMatrix', type: 'm4'},
			{name: 'uMaterialColor', type: 'v4'},
			{name: 'uTextureSampler', type: 'tex'},
			{name: 'uHasTexture', type: 'bool'}
		],
		vertexShader: 
			"attribute mediump vec3 aVertexPosition; " +
			"attribute mediump vec2 aTextureCoord; " +  
			"attribute mediump vec4 aVertexColor; " + 
			
			"uniform mediump mat4 uTransformationMatrix; " + 
			"uniform mediump mat4 uPerspectiveMatrix; " +
			"uniform mediump vec4 uMaterialColor; " +  
			
			"varying mediump vec4 vVertexColor; " +
			"varying mediump vec2 vTextureCoord;" +  
			
			"void main(void){ " + 
				"gl_Position = uPerspectiveMatrix * uTransformationMatrix * vec4(aVertexPosition, 1.0); " +
				"vVertexColor = aVertexColor * uMaterialColor; " +
				"vTextureCoord = aTextureCoord; " +  
			"} " ,
		fragmentShader: 
			"uniform sampler2D uTextureSampler; " +
			"uniform int uHasTexture; " +
			
			"varying mediump vec2 vTextureCoord; " + 
			"varying mediump vec4 vVertexColor; " + 
			
			"void main(void){ " +
				"mediump vec4 color = vVertexColor; " + 
				"if (uHasTexture == 1){ " + 
					"mediump vec4 texColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t)); " +
					"color *= texColor; " +
				"} " + 
				
				"gl_FragColor = color;" + 
			"}"
	}
};

},{}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTexture.js":[function(require,module,exports){
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

},{"./KTMain":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTUtils":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js"}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js":[function(require,module,exports){
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

},{}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js":[function(require,module,exports){
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

},{}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js":[function(require,module,exports){
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

},{}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KramTech.js":[function(require,module,exports){
var KT = require('./KTMain');
KT.CameraPerspective = require('./KTCameraPerspective');
KT.Color = require('./KTColor');
KT.Geometry = require('./KTGeometry');
KT.GeometryBox = require('./KTGeometryBox');
KT.Material = require('./KTMaterial');
KT.MaterialBasic = require('./KTMaterialBasic');
KT.Math = require('./KTMath');
KT.Matrix4 = require('./KTMatrix4');
KT.Mesh = require('./KTMesh');
KT.Texture = require('./KTTexture');
KT.Utils = require('./KTUtils');
KT.Vector2 = require('./KTVector2');
KT.Vector3 = require('./KTVector3');
KT.Scene = require('./KTScene');

module.exports = KT;
},{"./KTCameraPerspective":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraPerspective.js","./KTColor":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTGeometryBox":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryBox.js","./KTMain":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMaterial":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js","./KTMaterialBasic":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialBasic.js","./KTMath":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTMatrix4":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTMesh":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMesh.js","./KTScene":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTScene.js","./KTTexture":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTexture.js","./KTUtils":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js","./KTVector2":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js":[function(require,module,exports){
window.KT = require('./KramTech');
},{"./KramTech":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KramTech.js"}]},{},["C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiLi5cXHNyY1xcS1RDYW1lcmFQZXJzcGVjdGl2ZS5qcyIsIi4uXFxzcmNcXEtUQ29sb3IuanMiLCIuLlxcc3JjXFxLVEdlb21ldHJ5LmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeUJveC5qcyIsIi4uXFxzcmNcXEtUTWFpbi5qcyIsIi4uXFxzcmNcXEtUTWF0ZXJpYWwuanMiLCIuLlxcc3JjXFxLVE1hdGVyaWFsQmFzaWMuanMiLCIuLlxcc3JjXFxLVE1hdGguanMiLCIuLlxcc3JjXFxLVE1hdHJpeDQuanMiLCIuLlxcc3JjXFxLVE1lc2guanMiLCIuLlxcc3JjXFxLVFNjZW5lLmpzIiwiLi5cXHNyY1xcS1RTaGFkZXJzLmpzIiwiLi5cXHNyY1xcS1RUZXh0dXJlLmpzIiwiLi5cXHNyY1xcS1RVdGlscy5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yMi5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yMy5qcyIsIi4uXFxzcmNcXEtyYW1UZWNoLmpzIiwiLi5cXHNyY1xcV2luZG93RXhwb3J0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIE1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG5cclxuZnVuY3Rpb24gQ2FtZXJhUGVyc3BlY3RpdmUocG9zaXRpb24sIHJvdGF0aW9uLCBmb3YsIHJhdGlvLCB6bmVhciwgemZhcil7XHJcblx0dGhpcy5fX2t0Y2FtZXJhID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcblx0dGhpcy5yb3RhdGlvbiA9IHJvdGF0aW9uO1xyXG5cdFxyXG5cdHRoaXMuZm92ID0gZm92O1xyXG5cdHRoaXMucmF0aW8gPSByYXRpbztcclxuXHR0aGlzLnpuZWFyID0gem5lYXI7XHJcblx0dGhpcy56ZmFyID0gemZhcjtcclxuXHRcclxuXHR0aGlzLnNldFBlcnNwZWN0aXZlKCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FtZXJhUGVyc3BlY3RpdmU7XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUuc2V0UGVyc3BlY3RpdmUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBDID0gMSAvIE1hdGgudGFuKHRoaXMuZm92IC8gMik7XHJcblx0dmFyIFIgPSBDICogdGhpcy5yYXRpbztcclxuXHR2YXIgQSA9ICh0aGlzLnpuZWFyICsgdGhpcy56ZmFyKSAvICh0aGlzLnpuZWFyIC0gdGhpcy56ZmFyKTtcclxuXHR2YXIgQiA9ICgyICogdGhpcy56bmVhciAqIHRoaXMuemZhcikgLyAodGhpcy56bmVhciAtIHRoaXMuemZhcik7XHJcblx0XHJcblx0dGhpcy5wZXJzcGVjdGl2ZU1hdHJpeCA9IG5ldyBNYXRyaXg0KFxyXG5cdFx0QywgMCwgMCwgIDAsXHJcblx0XHQwLCBSLCAwLCAgMCxcclxuXHRcdDAsIDAsIEEsICBCLFxyXG5cdFx0MCwgMCwgLTEsIDBcclxuXHQpLnRvRmxvYXQzMkFycmF5KCk7XHJcbn07XHJcbiIsImZ1bmN0aW9uIENvbG9yKGhleENvbG9yKXtcclxuXHR2YXIgc3RyID0gaGV4Q29sb3Iuc3Vic3RyaW5nKDEpO1xyXG5cdHZhciByID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygwLCAyKSwgMTYpO1xyXG5cdHZhciBnID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygyLCA0KSwgMTYpO1xyXG5cdHZhciBiID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg0LCA2KSwgMTYpO1xyXG5cdHZhciBhID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg2LCA4KSwgMTYpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBbciAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSwgYSAvIDI1NV07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29sb3I7XHJcblxyXG5Db2xvci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaGV4Q29sb3Ipe1xyXG5cdHZhciBzdHIgPSBoZXhDb2xvci5zdWJzdHJpbmcoMSk7XHJcblx0dmFyIHIgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDAsIDIpLCAxNik7XHJcblx0dmFyIGcgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDIsIDQpLCAxNik7XHJcblx0dmFyIGIgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDQsIDYpLCAxNik7XHJcblx0dmFyIGEgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDYsIDgpLCAxNik7XHJcblx0XHJcblx0dGhpcy5jb2xvciA9IFtyIC8gMjU1LCBnIC8gMjU1LCBiIC8gMjU1LCBhIC8gMjU1XTtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5zZXRSR0IgPSBmdW5jdGlvbihyZWQsIGdyZWVuLCBibHVlKXtcclxuXHR0aGlzLnNldFJHQkEocmVkLCBncmVlbiwgYmx1ZSwgMjU1KTtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5zZXRSR0JBID0gZnVuY3Rpb24ocmVkLCBncmVlbiwgYmx1ZSwgYWxwaGEpe1xyXG5cdHRoaXMuY29sb3IgPSBbcmVkIC8gMjU1LCBncmVlbiAvIDI1NSwgYmx1ZSAvIDI1NSwgYWxwaGFdO1xyXG59O1xyXG5cclxuQ29sb3IucHJvdG90eXBlLmdldFJHQiA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGMgPSB0aGlzLmdldFJHQkEoKTtcclxuXHRcclxuXHRyZXR1cm4gW2NbMF0sIGNbMV0sIGNbMl1dO1xyXG59O1xyXG5cclxuQ29sb3IucHJvdG90eXBlLmdldFJHQkEgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiB0aGlzLmNvbG9yO1xyXG59O1xyXG5cclxuQ29sb3IucHJvdG90eXBlLmdldEhleCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGMgPSB0aGlzLmNvbG9yO1xyXG5cdFxyXG5cdHZhciByID0gKGNbMF0gKiAyNTUpLnRvU3RyaW5nKDE2KTtcclxuXHR2YXIgZyA9IChjWzFdICogMjU1KS50b1N0cmluZygxNik7XHJcblx0dmFyIGIgPSAoY1syXSAqIDI1NSkudG9TdHJpbmcoMTYpO1xyXG5cdHZhciBhID0gKGNbM10gKiAyNTUpLnRvU3RyaW5nKDE2KTtcclxuXHRcclxuXHRpZiAoci5sZW5ndGggPT0gMSkgciA9IFwiMFwiICsgcjtcclxuXHRpZiAoZy5sZW5ndGggPT0gMSkgZyA9IFwiMFwiICsgZztcclxuXHRpZiAoYi5sZW5ndGggPT0gMSkgYiA9IFwiMFwiICsgYjtcclxuXHRpZiAoYS5sZW5ndGggPT0gMSkgYSA9IFwiMFwiICsgYTtcclxuXHRcclxuXHRyZXR1cm4gKFwiI1wiICsgciArIGcgKyBiICsgYSkudG9VcHBlckNhc2UoKTtcclxufTtcclxuXHJcbkNvbG9yLl9CTEFDS1x0XHQ9IFwiIzAwMDAwMEZGXCI7XHJcbkNvbG9yLl9SRUQgXHRcdFx0PSBcIiNGRjAwMDBGRlwiO1xyXG5Db2xvci5fR1JFRU4gXHRcdD0gXCIjMDBGRjAwRkZcIjtcclxuQ29sb3IuX0JMVUUgXHRcdD0gXCIjMDAwMEZGRkZcIjtcclxuQ29sb3IuX1dISVRFXHRcdD0gXCIjRkZGRkZGRkZcIjtcclxuQ29sb3IuX1lFTExPV1x0XHQ9IFwiI0ZGRkYwMEZGXCI7XHJcbkNvbG9yLl9NQUdFTlRBXHRcdD0gXCIjRkYwMEZGRkZcIjtcclxuQ29sb3IuX0FRVUFcdFx0XHQ9IFwiIzAwRkZGRkZGXCI7XHJcbkNvbG9yLl9HT0xEXHRcdFx0PSBcIiNGRkQ3MDBGRlwiO1xyXG5Db2xvci5fR1JBWVx0XHRcdD0gXCIjODA4MDgwRkZcIjtcclxuQ29sb3IuX1BVUlBMRVx0XHQ9IFwiIzgwMDA4MEZGXCI7IiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxudmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxudmFyIFZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG52YXIgVmVjdG9yMyA9IHJlcXVpcmUoJy4vS1RWZWN0b3IzJyk7XHJcblxyXG5mdW5jdGlvbiBHZW9tZXRyeSgpe1xyXG5cdHRoaXMuX19rdGdlb21ldHJ5ID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnZlcnRpY2VzID0gW107XHJcblx0dGhpcy50cmlhbmdsZXMgPSBbXTtcclxuXHR0aGlzLnV2Q29vcmRzID0gW107XHJcblx0dGhpcy5jb2xvcnMgPSBbXTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeTtcclxuXHJcbkdlb21ldHJ5LnByb3RvdHlwZS5hZGRWZXJ0aWNlID0gZnVuY3Rpb24oeCwgeSwgeiwgY29sb3IsIHR4LCB0eSl7XHJcblx0aWYgKCFjb2xvcikgY29sb3IgPSBDb2xvci5fV0hJVEU7XHJcblx0aWYgKCF0eCkgdHggPSAwO1xyXG5cdGlmICghdHkpIHR5ID0gMDtcclxuXHRcclxuXHR0aGlzLnZlcnRpY2VzLnB1c2gobmV3IFZlY3RvcjMoeCwgeSwgeikpO1xyXG5cdHRoaXMuY29sb3JzLnB1c2gobmV3IENvbG9yKGNvbG9yKSk7XHJcblx0dGhpcy51dkNvb3Jkcy5wdXNoKG5ldyBWZWN0b3IyKHR4LCB0eSkpO1xyXG59O1xyXG5cclxuR2VvbWV0cnkucHJvdG90eXBlLmFkZEZhY2UgPSBmdW5jdGlvbih2ZXJ0aWNlXzAsIHZlcnRpY2VfMSwgdmVydGljZV8yKXtcclxuXHRpZiAoIXRoaXMudmVydGljZXNbdmVydGljZV8wXSkgdGhyb3cgXCJJbnZhbGlkIHZlcnRleCBpbmRleDogXCIgKyB2ZXJ0aWNlXzA7XHJcblx0aWYgKCF0aGlzLnZlcnRpY2VzW3ZlcnRpY2VfMV0pIHRocm93IFwiSW52YWxpZCB2ZXJ0ZXggaW5kZXg6IFwiICsgdmVydGljZV8xO1xyXG5cdGlmICghdGhpcy52ZXJ0aWNlc1t2ZXJ0aWNlXzJdKSB0aHJvdyBcIkludmFsaWQgdmVydGV4IGluZGV4OiBcIiArIHZlcnRpY2VfMjtcclxuXHRcclxuXHR0aGlzLnRyaWFuZ2xlcy5wdXNoKG5ldyBWZWN0b3IzKHZlcnRpY2VfMCwgdmVydGljZV8xLCB2ZXJ0aWNlXzIpKTtcclxufTtcclxuXHJcbkdlb21ldHJ5LnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIHZlcnRpY2VzID0gW107XHJcblx0dmFyIHV2Q29vcmRzID0gW107XHJcblx0dmFyIHRyaWFuZ2xlcyA9IFtdO1xyXG5cdHZhciBjb2xvcnMgPSBbXTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMudmVydGljZXMubGVuZ3RoO2k8bGVuO2krKyl7IFxyXG5cdFx0dmFyIHYgPSB0aGlzLnZlcnRpY2VzW2ldOyBcclxuXHRcdHZlcnRpY2VzLnB1c2godi54LCB2LnksIHYueik7IFxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMudXZDb29yZHMubGVuZ3RoO2k8bGVuO2krKyl7IFxyXG5cdFx0dmFyIHYgPSB0aGlzLnV2Q29vcmRzW2ldOyBcclxuXHRcdHV2Q29vcmRzLnB1c2godi54LCB2LnkpOyBcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLnRyaWFuZ2xlcy5sZW5ndGg7aTxsZW47aSsrKXsgXHJcblx0XHR2YXIgdCA9IHRoaXMudHJpYW5nbGVzW2ldOyBcclxuXHRcdHRyaWFuZ2xlcy5wdXNoKHQueCwgdC55LCB0LnopOyBcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLmNvbG9ycy5sZW5ndGg7aTxsZW47aSsrKXsgXHJcblx0XHR2YXIgYyA9IHRoaXMuY29sb3JzW2ldLmdldFJHQkEoKTsgXHJcblx0XHRcclxuXHRcdGNvbG9ycy5wdXNoKGNbMF0sIGNbMV0sIGNbMl0sIGNbM10pOyBcclxuXHR9XHJcblx0XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgPSBLVC5jcmVhdGVBcnJheUJ1ZmZlcihcIkFSUkFZX0JVRkZFUlwiLCBuZXcgRmxvYXQzMkFycmF5KHZlcnRpY2VzKSwgMyk7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBLVC5jcmVhdGVBcnJheUJ1ZmZlcihcIkFSUkFZX0JVRkZFUlwiLCBuZXcgRmxvYXQzMkFycmF5KHV2Q29vcmRzKSwgMik7XHJcblx0dGhpcy5mYWNlc0J1ZmZlciA9IEtULmNyZWF0ZUFycmF5QnVmZmVyKFwiRUxFTUVOVF9BUlJBWV9CVUZGRVJcIiwgbmV3IFVpbnQxNkFycmF5KHRyaWFuZ2xlcyksIDEpO1xyXG5cdHRoaXMuY29sb3JzQnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJBUlJBWV9CVUZGRVJcIiwgbmV3IEZsb2F0MzJBcnJheShjb2xvcnMpLCA0KTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuIiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlCb3god2lkdGgsIGxlbmd0aCwgaGVpZ2h0KXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0XHJcblx0dmFyIGJveEdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdHZhciB3ID0gd2lkdGggLyAyO1xyXG5cdHZhciBsID0gbGVuZ3RoIC8gMjtcclxuXHR2YXIgaCA9IGhlaWdodCAvIDI7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAgbCwgQ29sb3IuX1dISVRFLCAxLjAsIDEuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAgbCwgQ29sb3IuX1dISVRFLCAwLjAsIDAuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAgbCwgQ29sb3IuX1dISVRFLCAwLjAsIDEuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAgbCwgQ29sb3IuX1dISVRFLCAxLjAsIDAuMCk7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAtbCwgQ29sb3IuX1dISVRFLCAwLjAsIDEuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAtbCwgQ29sb3IuX1dISVRFLCAwLjAsIDAuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAtbCwgQ29sb3IuX1dISVRFLCAxLjAsIDEuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAtbCwgQ29sb3IuX1dISVRFLCAxLjAsIDAuMCk7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAtbCwgQ29sb3IuX1dISVRFLCAxLjAsIDEuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAgbCwgQ29sb3IuX1dISVRFLCAwLjAsIDAuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAgbCwgQ29sb3IuX1dISVRFLCAwLjAsIDEuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAtbCwgQ29sb3IuX1dISVRFLCAxLjAsIDAuMCk7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAgbCwgQ29sb3IuX1dISVRFLCAxLjAsIDEuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAgbCwgQ29sb3IuX1dISVRFLCAxLjAsIDAuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAtbCwgQ29sb3IuX1dISVRFLCAwLjAsIDEuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAtbCwgQ29sb3IuX1dISVRFLCAwLjAsIDAuMCk7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAgbCwgQ29sb3IuX1dISVRFLCAxLjAsIDEuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAtbCwgQ29sb3IuX1dISVRFLCAwLjAsIDAuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAgbCwgQ29sb3IuX1dISVRFLCAwLjAsIDEuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAtbCwgQ29sb3IuX1dISVRFLCAxLjAsIDAuMCk7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAgbCwgQ29sb3IuX1dISVRFLCAwLjAsIDEuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAtbCwgQ29sb3IuX1dISVRFLCAwLjAsIDAuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAgbCwgQ29sb3IuX1dISVRFLCAxLjAsIDEuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAtbCwgQ29sb3IuX1dISVRFLCAxLjAsIDAuMCk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMCwgMSwgMik7XHJcblx0Ym94R2VvLmFkZEZhY2UoMCwgMywgMSk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoNCwgNSwgNik7XHJcblx0Ym94R2VvLmFkZEZhY2UoNSwgNywgNik7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoOCwgOSwgMTApO1xyXG5cdGJveEdlby5hZGRGYWNlKDgsIDExLCA5KTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSgxMiwgMTMsIDE0KTtcclxuXHRib3hHZW8uYWRkRmFjZSgxMywgMTUsIDE0KTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSgxNiwgMTcsIDE4KTtcclxuXHRib3hHZW8uYWRkRmFjZSgxNiwgMTksIDE3KTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSgyMCwgMjEsIDIyKTtcclxuXHRib3hHZW8uYWRkRmFjZSgyMSwgMjMsIDIyKTtcclxuXHRcclxuXHRib3hHZW8uYnVpbGQoKTtcclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IGJveEdlby52ZXJ0ZXhCdWZmZXI7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBib3hHZW8udGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBib3hHZW8uZmFjZXNCdWZmZXI7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBib3hHZW8uY29sb3JzQnVmZmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5Qm94OyIsInZhciBTaGFkZXJzID0gcmVxdWlyZSgnLi9LVFNoYWRlcnMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGluaXQ6IGZ1bmN0aW9uKGNhbnZhcyl7XHJcblx0XHR0aGlzLmNhbnZhcyA9IGNhbnZhcztcclxuXHRcdHRoaXMuZ2wgPSBudWxsO1xyXG5cdFx0dGhpcy5zaGFkZXJzID0ge307XHJcblx0XHRcclxuXHRcdHRoaXMuX19pbml0Q29udGV4dChjYW52YXMpO1xyXG5cdFx0dGhpcy5fX2luaXRQcm9wZXJ0aWVzKCk7XHJcblx0XHR0aGlzLl9faW5pdFNoYWRlcnMoKTtcclxuXHR9LFxyXG5cdFxyXG5cdF9faW5pdENvbnRleHQ6IGZ1bmN0aW9uKGNhbnZhcyl7XHJcblx0XHR0aGlzLmdsID0gY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xyXG5cdFx0XHJcblx0XHRpZiAoIXRoaXMuZ2wpe1xyXG5cdFx0XHRhbGVydChcIllvdXIgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgV2ViR0xcIik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5nbC53aWR0aCA9IGNhbnZhcy53aWR0aDtcclxuXHRcdHRoaXMuZ2wuaGVpZ2h0ID0gY2FudmFzLmhlaWdodDtcclxuXHR9LFxyXG5cdFxyXG5cdF9faW5pdFByb3BlcnRpZXM6IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZ2wgPSB0aGlzLmdsO1xyXG5cdFx0XHJcblx0XHRnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7XHJcblx0XHRnbC5kZXB0aEZ1bmMoZ2wuTEVRVUFMKTtcclxuXHRcdFxyXG5cdFx0Z2wuZW5hYmxlKGdsLkNVTExfRkFDRSk7XHJcblx0XHRcclxuXHRcdGdsLmVuYWJsZSggZ2wuQkxFTkQgKTtcclxuXHRcdGdsLmJsZW5kRXF1YXRpb24oIGdsLkZVTkNfQUREICk7XHJcblx0XHRnbC5ibGVuZEZ1bmMoIGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSApO1xyXG5cdH0sXHJcblx0XHJcblx0X19pbml0U2hhZGVyczogZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuc2hhZGVycy5iYXNpYyA9IHRoaXMucHJvY2Vzc1NoYWRlcihTaGFkZXJzLmJhc2ljKTtcclxuXHR9LFxyXG5cdFxyXG5cdGNyZWF0ZUFycmF5QnVmZmVyOiBmdW5jdGlvbih0eXBlLCBkYXRhQXJyYXksIGl0ZW1TaXplKXtcclxuXHRcdHZhciBnbCA9IHRoaXMuZ2w7XHJcblx0XHR2YXIgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcblx0XHRnbC5iaW5kQnVmZmVyKGdsW3R5cGVdLCBidWZmZXIpO1xyXG5cdFx0Z2wuYnVmZmVyRGF0YShnbFt0eXBlXSwgZGF0YUFycmF5LCBnbC5TVEFUSUNfRFJBVyk7XHJcblx0XHRidWZmZXIubnVtSXRlbXMgPSBkYXRhQXJyYXkubGVuZ3RoO1xyXG5cdFx0YnVmZmVyLml0ZW1TaXplID0gaXRlbVNpemU7XHJcblx0XHRcclxuXHRcdHJldHVybiBidWZmZXI7XHJcblx0fSxcclxuXHRcclxuXHRwcm9jZXNzU2hhZGVyOiBmdW5jdGlvbihzaGFkZXIpe1xyXG5cdFx0dmFyIGdsID0gdGhpcy5nbDtcclxuXHRcdFxyXG5cdFx0dmFyIHZDb2RlID0gc2hhZGVyLnZlcnRleFNoYWRlcjtcclxuXHRcdHZhciB2U2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLlZFUlRFWF9TSEFERVIpO1xyXG5cdFx0Z2wuc2hhZGVyU291cmNlKHZTaGFkZXIsIHZDb2RlKTtcclxuXHRcdGdsLmNvbXBpbGVTaGFkZXIodlNoYWRlcik7XHJcblx0XHRcclxuXHRcdHZhciBmQ29kZSA9IHNoYWRlci5mcmFnbWVudFNoYWRlcjtcclxuXHRcdHZhciBmU2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLkZSQUdNRU5UX1NIQURFUik7XHJcblx0XHRnbC5zaGFkZXJTb3VyY2UoZlNoYWRlciwgZkNvZGUpO1xyXG5cdFx0Z2wuY29tcGlsZVNoYWRlcihmU2hhZGVyKTtcclxuXHRcdFxyXG5cdFx0dmFyIHNoYWRlclByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XHJcblx0XHRnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgdlNoYWRlcik7XHJcblx0XHRnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgZlNoYWRlcik7XHJcblx0XHRnbC5saW5rUHJvZ3JhbShzaGFkZXJQcm9ncmFtKTtcclxuXHRcdFxyXG5cdFx0aWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHNoYWRlclByb2dyYW0sIGdsLkxJTktfU1RBVFVTKSl7XHJcblx0XHRcdHRocm93IFwiRXJyb3IgaW5pdGlhbGl6aW5nIHRoZSBzaGFkZXIgcHJvZ3JhbVwiO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgYXR0cmlidXRlcyA9IFtdO1xyXG5cdFx0Zm9yICh2YXIgaT0wLGxlbj1zaGFkZXIuYXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdFx0dmFyIGF0dCA9IHNoYWRlci5hdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHR2YXIgbG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBhdHQubmFtZSk7XHJcblx0XHRcdFxyXG5cdFx0XHRnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShsb2NhdGlvbik7XHJcblx0XHRcdFxyXG5cdFx0XHRhdHRyaWJ1dGVzLnB1c2goe1xyXG5cdFx0XHRcdG5hbWU6IGF0dC5uYW1lLFxyXG5cdFx0XHRcdHR5cGU6IGF0dC50eXBlLFxyXG5cdFx0XHRcdGxvY2F0aW9uOiBsb2NhdGlvblxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIHVuaWZvcm1zID0gW107XHJcblx0XHRmb3IgKHZhciBpPTAsbGVuPXNoYWRlci51bmlmb3Jtcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdFx0dmFyIHVuaSA9IHNoYWRlci51bmlmb3Jtc1tpXTtcclxuXHRcdFx0dmFyIGxvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHNoYWRlclByb2dyYW0sIHVuaS5uYW1lKTtcclxuXHRcdFx0XHJcblx0XHRcdHVuaWZvcm1zLnB1c2goe1xyXG5cdFx0XHRcdG5hbWU6IHVuaS5uYW1lLFxyXG5cdFx0XHRcdHR5cGU6IHVuaS50eXBlLFxyXG5cdFx0XHRcdGxvY2F0aW9uOiBsb2NhdGlvblxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0c2hhZGVyUHJvZ3JhbTogc2hhZGVyUHJvZ3JhbSxcclxuXHRcdFx0YXR0cmlidXRlczogYXR0cmlidXRlcyxcclxuXHRcdFx0dW5pZm9ybXM6IHVuaWZvcm1zXHJcblx0XHR9O1xyXG5cdH1cclxufTtcclxuXHJcblxyXG4iLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxuXHJcbmZ1bmN0aW9uIE1hdGVyaWFsKHBhcmFtZXRlcnMpe1xyXG5cdHRoaXMuX19rdG1hdGVyaWFsID0gdHJ1ZTtcclxuXHRcclxuXHRpZiAoIXBhcmFtZXRlcnMpIHBhcmFtZXRlcnMgPSB7fTtcclxuXHRcclxuXHR0aGlzLnRleHR1cmUgPSAocGFyYW1ldGVycy50ZXh0dXJlKT8gcGFyYW1ldGVycy50ZXh0dXJlIDogbnVsbDtcclxuXHR0aGlzLmNvbG9yID0gbmV3IENvbG9yKChwYXJhbWV0ZXJzLmNvbG9yKT8gcGFyYW1ldGVycy5jb2xvciA6IENvbG9yLl9XSElURSk7XHJcblx0dGhpcy5zaGFkZXIgPSAocGFyYW1ldGVycy5zaGFkZXIpPyBwYXJhbWV0ZXJzLnNoYWRlciA6IG51bGw7XHJcblx0dGhpcy5vcGFjaXR5ID0gKHBhcmFtZXRlcnMub3BhY2l0eSk/IHBhcmFtZXRlcnMub3BhY2l0eSA6IDEuMDtcclxuXHR0aGlzLmRyYXdGYWNlcyA9IChwYXJhbWV0ZXJzLmRyYXdGYWNlcyk/IHBhcmFtZXRlcnMuZHJhd0ZhY2VzIDogJ0ZST05UJztcclxuXHR0aGlzLmRyYXdBcyA9IChwYXJhbWV0ZXJzLmRyYXdBcyk/IHBhcmFtZXRlcnMuZHJhd0FzIDogJ1RSSUFOR0xFUyc7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0ZXJpYWw7IiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxudmFyIE1hdGVyaWFsID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsJyk7XHJcblxyXG5mdW5jdGlvbiBNYXRlcmlhbEJhc2ljKHRleHR1cmUsIGNvbG9yLCBvcGFjaXR5KXtcclxuXHR0aGlzLl9fa3RtYXRlcmlhbCA9IHRydWU7XHJcblx0XHJcblx0dmFyIG1hdGVyaWFsID0gbmV3IE1hdGVyaWFsKHtcclxuXHRcdHRleHR1cmU6IHRleHR1cmUsXHJcblx0XHRjb2xvcjogY29sb3IsXHJcblx0XHRvcGFjaXR5OiBvcGFjaXR5LFxyXG5cdFx0c2hhZGVyOiBLVC5zaGFkZXJzLmJhc2ljXHJcblx0fSk7XHJcblx0XHJcblx0dGhpcy50ZXh0dXJlID0gbWF0ZXJpYWwudGV4dHVyZTtcclxuXHR0aGlzLmNvbG9yID0gbWF0ZXJpYWwuY29sb3I7XHJcblx0dGhpcy5zaGFkZXIgPSBtYXRlcmlhbC5zaGFkZXI7XHJcblx0dGhpcy5vcGFjaXR5ID0gbWF0ZXJpYWwub3BhY2l0eTtcclxuXHR0aGlzLmRyYXdGYWNlcyA9IG1hdGVyaWFsLmRyYXdGYWNlcztcclxuXHR0aGlzLmRyYXdBcyA9IG1hdGVyaWFsLmRyYXdBcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRlcmlhbEJhc2ljO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRyYWREZWdSZWw6IE1hdGguUEkgLyAxODAsXHJcblx0XHJcblx0UElfMjogTWF0aC5QSSAvIDIsXHJcblx0UEk6IE1hdGguUEksXHJcblx0UEkzXzI6IE1hdGguUEkgKiAzIC8gMixcclxuXHRQSTI6IE1hdGguUEkgKiAyLFxyXG5cdFxyXG5cdGRlZ1RvUmFkOiBmdW5jdGlvbihkZWdyZWVzKXtcclxuXHRcdHJldHVybiBkZWdyZWVzICogdGhpcy5yYWREZWdSZWw7XHJcblx0fSxcclxuXHRcclxuXHRyYWRUb0RlZzogZnVuY3Rpb24ocmFkaWFucyl7XHJcblx0XHRyZXR1cm4gcmFkaWFucyAvIHRoaXMucmFkRGVnUmVsO1xyXG5cdH1cclxufTtcclxuIiwiZnVuY3Rpb24gTWF0cml4NCgpe1xyXG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDE2KSB0aHJvdyBcIk1hdHJpeCA0IG11c3QgcmVjZWl2ZSAxNiBwYXJhbWV0ZXJzXCI7XHJcblx0XHJcblx0dmFyIGMgPSAwO1xyXG5cdGZvciAodmFyIGk9MDtpPDE2O2krPTQpe1xyXG5cdFx0dGhpc1tjXSA9IGFyZ3VtZW50c1tpXTtcclxuXHRcdHRoaXNbYys0XSA9IGFyZ3VtZW50c1tpKzFdO1xyXG5cdFx0dGhpc1tjKzhdID0gYXJndW1lbnRzW2krMl07XHJcblx0XHR0aGlzW2MrMTJdID0gYXJndW1lbnRzW2krM107XHJcblx0XHRcclxuXHRcdGMgKz0gMTtcclxuXHR9XHJcblx0XHJcblx0dGhpcy5fX2t0bTQgPSB0cnVlO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdHJpeDQ7XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5pZGVudGl0eSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIHBhcmFtcyA9IFtcclxuXHRcdDEsIDAsIDAsIDAsXHJcblx0XHQwLCAxLCAwLCAwLFxyXG5cdFx0MCwgMCwgMSwgMCxcclxuXHRcdDAsIDAsIDAsIDFcclxuXHRdO1xyXG5cdFxyXG5cdHZhciBjID0gMDtcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKz00KXtcclxuXHRcdHRoaXNbY10gPSBwYXJhbXNbaV07XHJcblx0XHR0aGlzW2MrNF0gPSBwYXJhbXNbaSsxXTtcclxuXHRcdHRoaXNbYys4XSA9IHBhcmFtc1tpKzJdO1xyXG5cdFx0dGhpc1tjKzEyXSA9IHBhcmFtc1tpKzNdO1xyXG5cdFx0XHJcblx0XHRjICs9IDE7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihtYXRyaXg0KXtcclxuXHRpZiAobWF0cml4NC5fX2t0bTQpe1xyXG5cdFx0dmFyIEExID0gW3RoaXNbMF0sICB0aGlzWzFdLCAgdGhpc1syXSwgIHRoaXNbM11dO1xyXG5cdFx0dmFyIEEyID0gW3RoaXNbNF0sICB0aGlzWzVdLCAgdGhpc1s2XSwgIHRoaXNbN11dO1xyXG5cdFx0dmFyIEEzID0gW3RoaXNbOF0sICB0aGlzWzldLCAgdGhpc1sxMF0sIHRoaXNbMTFdXTtcclxuXHRcdHZhciBBNCA9IFt0aGlzWzEyXSwgdGhpc1sxM10sIHRoaXNbMTRdLCB0aGlzWzE1XV07XHJcblx0XHRcclxuXHRcdHZhciBCMSA9IFttYXRyaXg0WzBdLCBtYXRyaXg0WzRdLCBtYXRyaXg0WzhdLCAgbWF0cml4NFsxMl1dO1xyXG5cdFx0dmFyIEIyID0gW21hdHJpeDRbMV0sIG1hdHJpeDRbNV0sIG1hdHJpeDRbOV0sICBtYXRyaXg0WzEzXV07XHJcblx0XHR2YXIgQjMgPSBbbWF0cml4NFsyXSwgbWF0cml4NFs2XSwgbWF0cml4NFsxMF0sIG1hdHJpeDRbMTRdXTtcclxuXHRcdHZhciBCNCA9IFttYXRyaXg0WzNdLCBtYXRyaXg0WzddLCBtYXRyaXg0WzExXSwgbWF0cml4NFsxNV1dO1xyXG5cdFx0XHJcblx0XHR2YXIgZG90ID0gZnVuY3Rpb24oY29sLCByb3cpe1xyXG5cdFx0XHR2YXIgc3VtID0gMDtcclxuXHRcdFx0Zm9yICh2YXIgaj0wO2o8NDtqKyspeyBzdW0gKz0gcm93W2pdICogY29sW2pdOyB9XHJcblx0XHRcdHJldHVybiBzdW07XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHR0aGlzWzBdID0gZG90KEExLCBCMSk7ICAgdGhpc1sxXSA9IGRvdChBMSwgQjIpOyAgIHRoaXNbMl0gPSBkb3QoQTEsIEIzKTsgICB0aGlzWzNdID0gZG90KEExLCBCNCk7XHJcblx0XHR0aGlzWzRdID0gZG90KEEyLCBCMSk7ICAgdGhpc1s1XSA9IGRvdChBMiwgQjIpOyAgIHRoaXNbNl0gPSBkb3QoQTIsIEIzKTsgICB0aGlzWzddID0gZG90KEEyLCBCNCk7XHJcblx0XHR0aGlzWzhdID0gZG90KEEzLCBCMSk7ICAgdGhpc1s5XSA9IGRvdChBMywgQjIpOyAgIHRoaXNbMTBdID0gZG90KEEzLCBCMyk7ICB0aGlzWzExXSA9IGRvdChBMywgQjQpO1xyXG5cdFx0dGhpc1sxMl0gPSBkb3QoQTQsIEIxKTsgIHRoaXNbMTNdID0gZG90KEE0LCBCMik7ICB0aGlzWzE0XSA9IGRvdChBNCwgQjMpOyAgdGhpc1sxNV0gPSBkb3QoQTQsIEI0KTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fWVsc2UgaWYgKG1hdHJpeDQubGVuZ3RoID09IDQpe1xyXG5cdFx0dmFyIHJldCA9IFtdO1xyXG5cdFx0dmFyIGNvbCA9IG1hdHJpeDQ7XHJcblx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTwxNjtpKz00KXtcclxuXHRcdFx0dmFyIHJvdyA9IFt0aGlzW2ldLCB0aGlzW2krMV0sIHRoaXNbaSsyXSwgdGhpc1tpKzNdXTtcclxuXHRcdFx0dmFyIHN1bSA9IDA7XHJcblx0XHRcdFxyXG5cdFx0XHRmb3IgKHZhciBqPTA7ajw0O2orKyl7XHJcblx0XHRcdFx0c3VtICs9IHJvd1tqXSAqIGNvbFtqXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0LnB1c2goc3VtKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHJldDtcclxuXHR9ZWxzZXtcclxuXHRcdHRocm93IFwiSW52YWxpZCBjb25zdHJ1Y3RvclwiO1xyXG5cdH1cclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLnRyYW5zcG9zZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHZhciB2YWx1ZXMgPSBbXHJcblx0XHRUWzBdLCBUWzRdLCBUWzhdLCAgVFsxMl0sXHJcblx0XHRUWzFdLCBUWzVdLCBUWzldLCAgVFsxM10sXHJcblx0XHRUWzJdLCBUWzZdLCBUWzEwXSwgVFsxNF0sXHJcblx0XHRUWzNdLCBUWzddLCBUWzExXSwgVFsxNV0sXHJcblx0XTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKyspe1xyXG5cdFx0dGhpc1tpXSA9IHZhbHVlc1tpXTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24obWF0cml4NCl7XHJcblx0aWYgKCFtYXRyaXg0Ll9fa3RtNCkgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgTWF0cml4NCBpbnRvIHRoaXMgbWF0cml4XCI7XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSsrKXtcclxuXHRcdHRoaXNbaV0gPSBtYXRyaXg0W2ldO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0VFswXSwgVFs0XSwgVFs4XSwgIFRbMTJdLFxyXG5cdFx0VFsxXSwgVFs1XSwgVFs5XSwgIFRbMTNdLFxyXG5cdFx0VFsyXSwgVFs2XSwgVFsxMF0sIFRbMTRdLFxyXG5cdFx0VFszXSwgVFs3XSwgVFsxMV0sIFRbMTVdXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLnRvRmxvYXQzMkFycmF5ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG5cdFx0VFswXSwgVFsxXSwgVFsyXSwgIFRbM10sXHJcblx0XHRUWzRdLCBUWzVdLCBUWzZdLCAgVFs3XSxcclxuXHRcdFRbOF0sIFRbOV0sIFRbMTBdLCBUWzExXSxcclxuXHRcdFRbMTJdLCBUWzEzXSwgVFsxNF0sIFRbMTVdXHJcblx0XSk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldElkZW50aXR5ID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQxLCAwLCAwLCAwLFxyXG5cdFx0MCwgMSwgMCwgMCxcclxuXHRcdDAsIDAsIDEsIDAsXHJcblx0XHQwLCAwLCAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0WFJvdGF0aW9uID0gZnVuY3Rpb24ocmFkaWFucyl7XHJcblx0dmFyIEMgPSBNYXRoLmNvcyhyYWRpYW5zKTtcclxuXHR2YXIgUyA9IE1hdGguc2luKHJhZGlhbnMpO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdDEsICAwLCAgMCwgMCxcclxuXHRcdDAsICBDLCAtUywgMCxcclxuXHRcdDAsICBTLCAgQywgMCxcclxuXHRcdDAsICAwLCAgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFlSb3RhdGlvbiA9IGZ1bmN0aW9uKHJhZGlhbnMpe1xyXG5cdHZhciBDID0gTWF0aC5jb3MocmFkaWFucyk7XHJcblx0dmFyIFMgPSBNYXRoLnNpbihyYWRpYW5zKTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQgQywgIDAsIC1TLCAwLFxyXG5cdFx0IDAsICAxLCAgMCwgMCxcclxuXHRcdCBTLCAgMCwgIEMsIDAsXHJcblx0XHQgMCwgIDAsICAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0WlJvdGF0aW9uID0gZnVuY3Rpb24ocmFkaWFucyl7XHJcblx0dmFyIEMgPSBNYXRoLmNvcyhyYWRpYW5zKTtcclxuXHR2YXIgUyA9IE1hdGguc2luKHJhZGlhbnMpO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdCBDLCAtUywgMCwgMCxcclxuXHRcdCBTLCAgQywgMCwgMCxcclxuXHRcdCAwLCAgMCwgMSwgMCxcclxuXHRcdCAwLCAgMCwgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFRyYW5zbGF0aW9uID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSB0cmFuc2xhdGUgdG8gYSB2ZWN0b3IgM1wiO1xyXG5cdFxyXG5cdHZhciB4ID0gdmVjdG9yMy54O1xyXG5cdHZhciB5ID0gdmVjdG9yMy55O1xyXG5cdHZhciB6ID0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdDEsIDAsIDAsIHgsXHJcblx0XHQwLCAxLCAwLCB5LFxyXG5cdFx0MCwgMCwgMSwgeixcclxuXHRcdDAsIDAsIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRTY2FsZSA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgc2NhbGUgdG8gYSB2ZWN0b3IgM1wiO1xyXG5cdFxyXG5cdHZhciBzeCA9IHZlY3RvcjMueDtcclxuXHR2YXIgc3kgPSB2ZWN0b3IzLnk7XHJcblx0dmFyIHN6ID0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdHN4LCAgMCwgIDAsIDAsXHJcblx0XHQgMCwgc3ksICAwLCAwLFxyXG5cdFx0IDAsICAwLCBzeiwgMCxcclxuXHRcdCAwLCAgMCwgIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRUcmFuc2Zvcm1hdGlvbiA9IGZ1bmN0aW9uKHBvc2l0aW9uLCByb3RhdGlvbiwgc2NhbGUpe1xyXG5cdGlmICghcG9zaXRpb24uX19rdHYzKSB0aHJvdyBcIlBvc2l0aW9uIG11c3QgYmUgYSBWZWN0b3IzXCI7XHJcblx0aWYgKCFyb3RhdGlvbi5fX2t0djMpIHRocm93IFwiUm90YXRpb24gbXVzdCBiZSBhIFZlY3RvcjNcIjtcclxuXHRpZiAoc2NhbGUgJiYgIXNjYWxlLl9fa3R2MykgdGhyb3cgXCJTY2FsZSBtdXN0IGJlIGEgVmVjdG9yM1wiO1xyXG5cdFxyXG5cdHZhciBzY2FsZSA9IChzY2FsZSk/IE1hdHJpeDQuZ2V0U2NhbGUoc2NhbGUpIDogTWF0cml4NC5nZXRJZGVudGl0eSgpO1xyXG5cdFxyXG5cdHZhciByb3RhdGlvblggPSBNYXRyaXg0LmdldFhSb3RhdGlvbihyb3RhdGlvbi54KTtcclxuXHR2YXIgcm90YXRpb25ZID0gTWF0cml4NC5nZXRZUm90YXRpb24ocm90YXRpb24ueSk7XHJcblx0dmFyIHJvdGF0aW9uWiA9IE1hdHJpeDQuZ2V0WlJvdGF0aW9uKHJvdGF0aW9uLnopO1xyXG5cdFxyXG5cdHZhciB0cmFuc2xhdGlvbiA9IE1hdHJpeDQuZ2V0VHJhbnNsYXRpb24ocG9zaXRpb24pO1xyXG5cdFxyXG5cdFxyXG5cdHZhciBtYXRyaXggPSBzY2FsZTtcclxuXHRtYXRyaXgubXVsdGlwbHkocm90YXRpb25YKTtcclxuXHRtYXRyaXgubXVsdGlwbHkocm90YXRpb25ZKTtcclxuXHRtYXRyaXgubXVsdGlwbHkocm90YXRpb25aKTtcclxuXHRtYXRyaXgubXVsdGlwbHkodHJhbnNsYXRpb24pO1xyXG5cdFxyXG5cdHJldHVybiBtYXRyaXg7XHJcbn07XHJcbiIsInZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxudmFyIFZlYzMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG5cclxuZnVuY3Rpb24gTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpe1xyXG5cdGlmICghZ2VvbWV0cnkuX19rdGdlb21ldHJ5KSB0aHJvdyBcIkdlb21ldHJ5IG11c3QgYmUgYSBLVEdlb21ldHJ5IGluc3RhbmNlXCI7XHJcblx0aWYgKCFtYXRlcmlhbC5fX2t0bWF0ZXJpYWwpIHRocm93IFwiTWF0ZXJpYWwgbXVzdCBiZSBhIEtUTWF0ZXJpYWwgaW5zdGFuY2VcIjtcclxuXHRcclxuXHR0aGlzLl9fa3RtZXNoID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLmdlb21ldHJ5ID0gZ2VvbWV0cnk7XHJcblx0dGhpcy5tYXRlcmlhbCA9IG1hdGVyaWFsO1xyXG5cdFxyXG5cdHRoaXMucGFyZW50ID0gbnVsbDtcclxuXHR0aGlzLnZpc2libGUgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMucG9zaXRpb24gPSBuZXcgVmVjMygwLCAwLCAwKTtcclxuXHR0aGlzLnJvdGF0aW9uID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcblx0dGhpcy5zY2FsZSA9IG5ldyBWZWMzKDEsIDEsIDEpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lc2g7XHJcblxyXG5NZXNoLnByb3RvdHlwZS5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCA9IGZ1bmN0aW9uKGNhbWVyYSl7XHJcblx0dmFyIG1hdHJpeCA9IE1hdHJpeDQuZ2V0VHJhbnNmb3JtYXRpb24odGhpcy5wb3NpdGlvbiwgdGhpcy5yb3RhdGlvbiwgdGhpcy5zY2FsZSk7XHJcblx0XHJcblx0dmFyIHBhcmVudCA9IHRoaXMucGFyZW50O1xyXG5cdHdoaWxlIChwYXJlbnQpe1xyXG5cdFx0dmFyIG0gPSBNYXRyaXg0LmdldFRyYW5zZm9ybWF0aW9uKHBhcmVudC5wb3NpdGlvbiwgcGFyZW50LnJvdGF0aW9uLCBwYXJlbnQuc2NhbGUpO1xyXG5cdFx0bWF0cml4Lm11bHRpcGx5KG0pO1xyXG5cdFx0cGFyZW50ID0gcGFyZW50LnBhcmVudDtcclxuXHR9XHJcblx0XHJcblx0dmFyIGNhbU1hdCA9IE1hdHJpeDQuZ2V0VHJhbnNmb3JtYXRpb24oY2FtZXJhLnBvc2l0aW9uLCBjYW1lcmEucm90YXRpb24pO1xyXG5cdG1hdHJpeC5tdWx0aXBseShjYW1NYXQpO1xyXG5cdFxyXG5cdHJldHVybiBtYXRyaXg7XHJcbn07XHJcbiIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcblxyXG5mdW5jdGlvbiBTY2VuZSgpe1xyXG5cdHRoaXMuX19rdHNjZW5lID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLm1lc2hlcyA9IFtdO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjZW5lO1xyXG5cclxuU2NlbmUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG9iamVjdCl7XHJcblx0aWYgKG9iamVjdC5fX2t0bWVzaCl7XHJcblx0XHR0aGlzLm1lc2hlcy5wdXNoKG9iamVjdCk7XHJcblx0fWVsc2V7XHJcblx0XHR0aHJvdyBcIkNhbid0IGFkZCB0aGUgb2JqZWN0IHRvIHRoZSBzY2VuZVwiO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihjYW1lcmEpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdGdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKTtcclxuXHRnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLm1lc2hlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBtZXNoID0gdGhpcy5tZXNoZXNbaV07XHJcblx0XHRpZiAoIW1lc2gudmlzaWJsZSkgY29udGludWU7XHJcblx0XHRpZiAobWVzaC5tYXRlcmlhbC5vcGFjaXR5ID09IDAuMCkgY29udGludWU7XHJcblx0XHRcclxuXHRcdHZhciBzaGFkZXIgPSBtZXNoLm1hdGVyaWFsLnNoYWRlcjtcclxuXHRcdGlmICghc2hhZGVyKXtcclxuXHRcdFx0Y29uc29sZS5pbmZvKFwiTWF0ZXJpYWwgZG9lc24ndCBoYXZlIGEgc2hhZGVyXCIpO1xyXG5cdFx0XHRjb250aW51ZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5zZXRNYXRlcmlhbEF0dHJpYnV0ZXMobWVzaC5tYXRlcmlhbCk7XHJcblx0XHRcclxuXHRcdGdsLnVzZVByb2dyYW0oc2hhZGVyLnNoYWRlclByb2dyYW0pO1xyXG5cdFx0XHJcblx0XHR0aGlzLnNlbmRBdHRyaWJEYXRhKG1lc2gsIHNoYWRlci5hdHRyaWJ1dGVzLCBjYW1lcmEpO1xyXG5cdFx0dGhpcy5zZW5kVW5pZm9ybURhdGEobWVzaCwgc2hhZGVyLnVuaWZvcm1zLCBjYW1lcmEpO1xyXG5cdFx0XHJcblx0XHRnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBtZXNoLmdlb21ldHJ5LmZhY2VzQnVmZmVyKTtcclxuXHRcdGdsLmRyYXdFbGVtZW50cyhnbFttZXNoLm1hdGVyaWFsLmRyYXdBc10sIG1lc2guZ2VvbWV0cnkuZmFjZXNCdWZmZXIubnVtSXRlbXMsIGdsLlVOU0lHTkVEX1NIT1JULCAwKTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5TY2VuZS5wcm90b3R5cGUuc2VuZEF0dHJpYkRhdGEgPSBmdW5jdGlvbihtZXNoLCBhdHRyaWJ1dGVzLCBjYW1lcmEpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0Zm9yICh2YXIgaT0wLGxlbj1hdHRyaWJ1dGVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIGF0dCA9IGF0dHJpYnV0ZXNbaV07XHJcblx0XHRcclxuXHRcdGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhQb3NpdGlvblwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LnZlcnRleEJ1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9ZWxzZSBpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4Q29sb3JcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS5jb2xvcnNCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVRleHR1cmVDb29yZFwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LnRleEJ1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS50ZXhCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuU2NlbmUucHJvdG90eXBlLnNlbmRVbmlmb3JtRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIHVuaWZvcm1zLCBjYW1lcmEpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3Jtcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciB1bmkgPSB1bmlmb3Jtc1tpXTtcclxuXHRcdFxyXG5cdFx0aWYgKHVuaS5uYW1lID09ICd1VHJhbnNmb3JtYXRpb25NYXRyaXgnKXtcclxuXHRcdFx0dmFyIHRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbWVzaC5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeChjYW1lcmEpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIHRyYW5zZm9ybWF0aW9uTWF0cml4LnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1UGVyc3BlY3RpdmVNYXRyaXgnKXtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdih1bmkubG9jYXRpb24sIGZhbHNlLCBjYW1lcmEucGVyc3BlY3RpdmVNYXRyaXgpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TWF0ZXJpYWxDb2xvcicpe1xyXG5cdFx0XHR2YXIgY29sb3IgPSBtZXNoLm1hdGVyaWFsLmNvbG9yLmdldFJHQkEoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTRmdih1bmkubG9jYXRpb24sIG5ldyBGbG9hdDMyQXJyYXkoY29sb3IpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVTYW1wbGVyJyl7XHJcblx0XHRcdGlmIChtZXNoLm1hdGVyaWFsLnRleHR1cmUpe1xyXG5cdFx0XHRcdGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTApO1xyXG5cdFx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG1lc2gubWF0ZXJpYWwudGV4dHVyZS50ZXh0dXJlKTtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1SGFzVGV4dHVyZScpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAobWVzaC5tYXRlcmlhbC50ZXh0dXJlKT8gMSA6IDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5zZXRNYXRlcmlhbEF0dHJpYnV0ZXMgPSBmdW5jdGlvbihtYXRlcmlhbCl7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0XHJcblx0dmFyIGN1bGwgPSBcIkJBQ0tcIjtcclxuXHRpZiAobWF0ZXJpYWwuZHJhd0ZhY2VzID09ICdCQUNLJyl7IGN1bGwgPSBcIkZST05UXCI7IH1cclxuXHRlbHNlIGlmIChtYXRlcmlhbC5kcmF3RmFjZXMgPT0gJ0JPVEgnKXsgY3VsbCA9IFwiXCI7IH1cclxuXHRcclxuXHRpZiAoY3VsbCAhPSBcIlwiKXtcclxuXHRcdGdsLmVuYWJsZShnbC5DVUxMX0ZBQ0UpO1xyXG5cdFx0Z2wuY3VsbEZhY2UoZ2xbY3VsbF0pO1xyXG5cdH1lbHNle1xyXG5cdFx0Z2wuZGlzYWJsZShnbC5DVUxMX0ZBQ0UpO1xyXG5cdH1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0YmFzaWM6IHtcclxuXHRcdGF0dHJpYnV0ZXM6IFtcclxuXHRcdFx0e25hbWU6ICdhVmVydGV4UG9zaXRpb24nLCB0eXBlOiAndjMnfSxcclxuXHRcdFx0e25hbWU6ICdhVmVydGV4Q29sb3InLCB0eXBlOiAndjQnfSxcclxuXHRcdFx0e25hbWU6ICdhVGV4dHVyZUNvb3JkJywgdHlwZTogJ3YyJ31cclxuXHRcdF0sXHJcblx0XHR1bmlmb3JtczogW1xyXG5cdFx0XHR7bmFtZTogJ3VUcmFuc2Zvcm1hdGlvbk1hdHJpeCcsIHR5cGU6ICdtNCd9LFxyXG5cdFx0XHR7bmFtZTogJ3VQZXJzcGVjdGl2ZU1hdHJpeCcsIHR5cGU6ICdtNCd9LFxyXG5cdFx0XHR7bmFtZTogJ3VNYXRlcmlhbENvbG9yJywgdHlwZTogJ3Y0J30sXHJcblx0XHRcdHtuYW1lOiAndVRleHR1cmVTYW1wbGVyJywgdHlwZTogJ3RleCd9LFxyXG5cdFx0XHR7bmFtZTogJ3VIYXNUZXh0dXJlJywgdHlwZTogJ2Jvb2wnfVxyXG5cdFx0XSxcclxuXHRcdHZlcnRleFNoYWRlcjogXHJcblx0XHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjMyBhVmVydGV4UG9zaXRpb247IFwiICtcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMyIGFUZXh0dXJlQ29vcmQ7IFwiICsgIFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzQgYVZlcnRleENvbG9yOyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgbWF0NCB1VHJhbnNmb3JtYXRpb25NYXRyaXg7IFwiICsgXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdVBlcnNwZWN0aXZlTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzQgdU1hdGVyaWFsQ29sb3I7IFwiICsgIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMiB2VGV4dHVyZUNvb3JkO1wiICsgIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICsgXHJcblx0XHRcdFx0XCJnbF9Qb3NpdGlvbiA9IHVQZXJzcGVjdGl2ZU1hdHJpeCAqIHVUcmFuc2Zvcm1hdGlvbk1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApOyBcIiArXHJcblx0XHRcdFx0XCJ2VmVydGV4Q29sb3IgPSBhVmVydGV4Q29sb3IgKiB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwidlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7IFwiICsgIFxyXG5cdFx0XHRcIn0gXCIgLFxyXG5cdFx0ZnJhZ21lbnRTaGFkZXI6IFxyXG5cdFx0XHRcInVuaWZvcm0gc2FtcGxlcjJEIHVUZXh0dXJlU2FtcGxlcjsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gaW50IHVIYXNUZXh0dXJlOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdlZlcnRleENvbG9yOyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjNCBjb2xvciA9IHZWZXJ0ZXhDb2xvcjsgXCIgKyBcclxuXHRcdFx0XHRcImlmICh1SGFzVGV4dHVyZSA9PSAxKXsgXCIgKyBcclxuXHRcdFx0XHRcdFwibWVkaXVtcCB2ZWM0IHRleENvbG9yID0gdGV4dHVyZTJEKHVUZXh0dXJlU2FtcGxlciwgdmVjMih2VGV4dHVyZUNvb3JkLnMsIHZUZXh0dXJlQ29vcmQudCkpOyBcIiArXHJcblx0XHRcdFx0XHRcImNvbG9yICo9IHRleENvbG9yOyBcIiArXHJcblx0XHRcdFx0XCJ9IFwiICsgXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XCJnbF9GcmFnQ29sb3IgPSBjb2xvcjtcIiArIFxyXG5cdFx0XHRcIn1cIlxyXG5cdH1cclxufTtcclxuIiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxudmFyIFV0aWxzID0gcmVxdWlyZSgnLi9LVFV0aWxzJyk7XHJcblxyXG5mdW5jdGlvbiBUZXh0dXJlKHNyYywgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3R0ZXh0dXJlID0gdHJ1ZTtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5taW5GaWx0ZXIgPSAocGFyYW1zLm1pbkZpbHRlcik/IHBhcmFtcy5taW5GaWx0ZXIgOiAnTElORUFSJztcclxuXHR0aGlzLm1hZ0ZpbHRlciA9IChwYXJhbXMubWFnRmlsdGVyKT8gcGFyYW1zLm1hZ0ZpbHRlciA6ICdMSU5FQVInO1xyXG5cdHRoaXMud3JhcFMgPSAocGFyYW1zLlNXcmFwcGluZyk/IHBhcmFtcy5TV3JhcHBpbmcgOiAnUkVQRUFUJztcclxuXHR0aGlzLndyYXBUID0gKHBhcmFtcy5UV3JhcHBpbmcpPyBwYXJhbXMuVFdyYXBwaW5nIDogJ1JFUEVBVCc7XHJcblx0XHJcblx0dGhpcy50ZXh0dWUgPSBudWxsO1xyXG5cdFxyXG5cdHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHR0aGlzLmltYWdlLnNyYyA9IHNyYztcclxuXHR0aGlzLmltYWdlLnJlYWR5ID0gZmFsc2U7XHJcblx0XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdFV0aWxzLmFkZEV2ZW50KHRoaXMuaW1hZ2UsIFwibG9hZFwiLCBmdW5jdGlvbigpe1xyXG5cdFx0VC5wYXJzZVRleHR1cmUoKTsgXHJcblx0fSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dHVyZTtcclxuXHJcblRleHR1cmUucHJvdG90eXBlLnBhcnNlVGV4dHVyZSA9IGZ1bmN0aW9uKCl7XHJcblx0aWYgKHRoaXMuaW1hZ2UucmVhZHkpIHJldHVybjtcclxuXHRcclxuXHR0aGlzLmltYWdlLnJlYWR5ID0gdHJ1ZTtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHR0aGlzLnRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcclxuXHRcclxuXHRnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCB0cnVlKTtcclxuXHRcclxuXHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIHRoaXMuaW1hZ2UpO1xyXG5cdFxyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbFt0aGlzLm1hZ0ZpbHRlcl0pO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbFt0aGlzLm1pbkZpbHRlcl0pO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsW3RoaXMud3JhcFNdKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbFt0aGlzLndyYXBUXSk7XHJcblx0XHJcblx0Z2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XHJcblx0XHJcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGdldDogZnVuY3Rpb24oZWxlbWVudCl7XHJcblx0XHRpZiAoZWxlbWVudC5jaGFyQXQoMCkgPT0gXCIjXCIpe1xyXG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudC5yZXBsYWNlKFwiI1wiLCBcIlwiKSk7XHJcblx0XHR9ZWxzZSBpZiAoZWxlbWVudC5jaGFyQXQoMCkgPT0gXCIuXCIpe1xyXG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShlbGVtZW50LnJlcGxhY2UoXCIuXCIsIFwiXCIpKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoZWxlbWVudCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRhZGRFdmVudDogZnVuY3Rpb24oZWxlbWVudCwgdHlwZSwgY2FsbGJhY2spe1xyXG5cdFx0aWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcil7XHJcblx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgZmFsc2UpO1xyXG5cdFx0fWVsc2UgaWYgKGVsZW1lbnQuYXR0YWNoRXZlbnQpe1xyXG5cdFx0XHRlbGVtZW50LmF0dGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGNhbGxiYWNrKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcbiIsImZ1bmN0aW9uIFZlY3RvcjIoeCwgeSl7XHJcblx0dGhpcy5fX2t0djIgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yMjtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkpO1xyXG5cdFxyXG5cdHJldHVybiBsZW5ndGg7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMueCAvPSBsZW5ndGg7XHJcblx0dGhpcy55IC89IGxlbmd0aDtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKHZlY3RvcjIpe1xyXG5cdGlmICghdmVjdG9yMi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgcGVyZm9ybSBhIGRvdCBwcm9kdWN0IHdpdGggYSB2ZWN0b3IyXCI7XHJcblx0XHJcblx0cmV0dXJuIHRoaXMueCAqIHZlY3RvcjIueCArIHRoaXMueSAqIHZlY3RvcjIueTtcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihudW1iZXIpe1xyXG5cdHRoaXMueCAqPSBudW1iZXI7XHJcblx0dGhpcy55ICo9IG51bWJlcjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHZlY3RvcjIpe1xyXG5cdGlmICghdmVjdG9yMi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgYWRkIGEgdmVjdG9yMiB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCArPSB2ZWN0b3IyLng7XHJcblx0dGhpcy55ICs9IHZlY3RvcjIueTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbih2ZWN0b3IyKXtcclxuXHRpZiAoIXZlY3RvcjIuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSB2ZWN0b3IyIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ID0gdmVjdG9yMi54O1xyXG5cdHRoaXMueSA9IHZlY3RvcjIueTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHkpe1xyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54LCB0aGlzLnkpO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24odmVjdG9yMil7XHJcblx0aWYgKCF2ZWN0b3IyLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgdmVjdG9yMiB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHJldHVybiAodGhpcy54ID09IHZlY3RvcjIueCAmJiB0aGlzLnkgPT0gdmVjdG9yMi55KTtcclxufTtcclxuXHJcblZlY3RvcjIudmVjdG9yc0RpZmZlcmVuY2UgPSBmdW5jdGlvbih2ZWN0b3IyX2EsIHZlY3RvcjJfYil7XHJcblx0aWYgKCF2ZWN0b3IyX2EuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMyXCI7XHJcblx0aWYgKCF2ZWN0b3IyX2IuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMyXCI7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IyKHZlY3RvcjJfYS54IC0gdmVjdG9yMl9iLngsIHZlY3RvcjJfYS55IC0gdmVjdG9yMl9iLnkpO1xyXG59O1xyXG5cclxuVmVjdG9yMi5mcm9tQW5nbGUgPSBmdW5jdGlvbihyYWRpYW4pe1xyXG5cdHZhciB4ID0gTWF0aC5jb3MocmFkaWFuKTtcclxuXHR2YXIgeSA9IC1NYXRoLnNpbihyYWRpYW4pO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMih4LCB5KTtcclxufTtcclxuIiwiZnVuY3Rpb24gVmVjdG9yMyh4LCB5LCB6KXtcclxuXHR0aGlzLl9fa3R2MyA9IHRydWU7XHJcblx0XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZlY3RvcjM7XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55ICsgdGhpcy56ICogdGhpcy56KTtcclxuXHRcclxuXHRyZXR1cm4gbGVuZ3RoO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGgoKTtcclxuXHRcclxuXHR0aGlzLnggLz0gbGVuZ3RoO1xyXG5cdHRoaXMueSAvPSBsZW5ndGg7XHJcblx0dGhpcy56IC89IGxlbmd0aDtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgcGVyZm9ybSBhIGRvdCBwcm9kdWN0IHdpdGggYSB2ZWN0b3IzXCI7XHJcblx0XHJcblx0cmV0dXJuIHRoaXMueCAqIHZlY3RvcjMueCArIHRoaXMueSAqIHZlY3RvcjMueSArIHRoaXMueiAqIHZlY3RvcjMuejtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBwZXJmb3JtIGEgY3Jvc3MgcHJvZHVjdCB3aXRoIGEgdmVjdG9yM1wiO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMyhcclxuXHRcdHRoaXMueSAqIHZlY3RvcjMueiAtIHRoaXMueiAqIHZlY3RvcjMueSxcclxuXHRcdHRoaXMueiAqIHZlY3RvcjMueCAtIHRoaXMueCAqIHZlY3RvcjMueixcclxuXHRcdHRoaXMueCAqIHZlY3RvcjMueSAtIHRoaXMueSAqIHZlY3RvcjMueFxyXG5cdCk7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24obnVtYmVyKXtcclxuXHR0aGlzLnggKj0gbnVtYmVyO1xyXG5cdHRoaXMueSAqPSBudW1iZXI7XHJcblx0dGhpcy56ICo9IG51bWJlcjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgYWRkIGEgVmVjdG9yMyB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCArPSB2ZWN0b3IzLng7XHJcblx0dGhpcy55ICs9IHZlY3RvcjMueTtcclxuXHR0aGlzLnogKz0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIFZlY3RvcjMgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHR0aGlzLnggPSB2ZWN0b3IzLng7XHJcblx0dGhpcy55ID0gdmVjdG9yMy55O1xyXG5cdHRoaXMueiA9IHZlY3RvcjMuejtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHksIHope1xyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxuXHR0aGlzLnogPSB6O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLngsIHRoaXMueSwgdGhpcy56KTtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIFZlY3RvcjMgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHRyZXR1cm4gKHRoaXMueCA9PSB2ZWN0b3IzLnggJiYgdGhpcy55ID09IHZlY3RvcjMueSAmJiB0aGlzLnogPT0gdmVjdG9yMy56KTtcclxufTtcclxuXHJcblZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UgPSBmdW5jdGlvbih2ZWN0b3IzX2EsIHZlY3RvcjNfYil7XHJcblx0aWYgKCF2ZWN0b3IzX2EuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMzXCI7XHJcblx0aWYgKCF2ZWN0b3IzX2IuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMzXCI7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IzKHZlY3RvcjNfYS54IC0gdmVjdG9yM19iLngsIHZlY3RvcjNfYS55IC0gdmVjdG9yM19iLnksIHZlY3RvcjNfYS56IC0gdmVjdG9yM19iLnopO1xyXG59O1xyXG5cclxuVmVjdG9yMy5mcm9tQW5nbGUgPSBmdW5jdGlvbihyYWRpYW5feHosIHJhZGlhbl95KXtcclxuXHR2YXIgeCA9IE1hdGguY29zKHJhZGlhbl94eik7XHJcblx0dmFyIHkgPSBNYXRoLnNpbihyYWRpYW5feSk7XHJcblx0dmFyIHogPSAtTWF0aC5zaW4ocmFkaWFuX3h6KTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjMoeCwgeSwgeik7XHJcbn07XHJcbiIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbktULkNhbWVyYVBlcnNwZWN0aXZlID0gcmVxdWlyZSgnLi9LVENhbWVyYVBlcnNwZWN0aXZlJyk7XHJcbktULkNvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbktULkdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbktULkdlb21ldHJ5Qm94ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Qm94Jyk7XHJcbktULk1hdGVyaWFsID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsJyk7XHJcbktULk1hdGVyaWFsQmFzaWMgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWxCYXNpYycpO1xyXG5LVC5NYXRoID0gcmVxdWlyZSgnLi9LVE1hdGgnKTtcclxuS1QuTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcbktULk1lc2ggPSByZXF1aXJlKCcuL0tUTWVzaCcpO1xyXG5LVC5UZXh0dXJlID0gcmVxdWlyZSgnLi9LVFRleHR1cmUnKTtcclxuS1QuVXRpbHMgPSByZXF1aXJlKCcuL0tUVXRpbHMnKTtcclxuS1QuVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcbktULlZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG5LVC5TY2VuZSA9IHJlcXVpcmUoJy4vS1RTY2VuZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLVDsiLCJ3aW5kb3cuS1QgPSByZXF1aXJlKCcuL0tyYW1UZWNoJyk7Il19
