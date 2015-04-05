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
	
	this.color = [r / 255, g / 255, b / 255, a];
}

module.exports = Color;

Color.prototype.set = function(hexColor){
	var str = hexColor.substring(1);
	var r = parseInt(str.substring(0, 2), 16);
	var g = parseInt(str.substring(2, 4), 16);
	var b = parseInt(str.substring(4, 6), 16);
	var a = parseInt(str.substring(6, 8), 16);
	
	this.color = [r / 255, g / 255, b / 255, a];
};

Color.prototype.setRGB = function(red, green, blue){
	this.setRGBA(red, green, blue, 1);
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
	var a = (c[3]).toString(16);
	
	if (r.length == 1) r = "0" + r;
	if (g.length == 1) g = "0" + g;
	if (b.length == 1) b = "0" + b;
	if (a.length == 1) a = "0" + a;
	
	return ("#" + r + g + b + a).toUpperCase();
};

Color._BLACK		= "#00000001";
Color._RED 			= "#FF000001";
Color._GREEN 		= "#00FF0001";
Color._BLUE 		= "#0000FF01";
Color._WHITE		= "#FFFFFF01";
Color._YELLOW		= "#FFFF0001";
Color._MAGENTA		= "#FF00FF01";
Color._AQUA			= "#00FFFF01";
Color._GOLD			= "#FFD70001";
Color._GRAY			= "#80808001";
Color._PURPLE		= "#80008001";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiLi5cXHNyY1xcS1RDYW1lcmFQZXJzcGVjdGl2ZS5qcyIsIi4uXFxzcmNcXEtUQ29sb3IuanMiLCIuLlxcc3JjXFxLVEdlb21ldHJ5LmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeUJveC5qcyIsIi4uXFxzcmNcXEtUTWFpbi5qcyIsIi4uXFxzcmNcXEtUTWF0ZXJpYWwuanMiLCIuLlxcc3JjXFxLVE1hdGVyaWFsQmFzaWMuanMiLCIuLlxcc3JjXFxLVE1hdGguanMiLCIuLlxcc3JjXFxLVE1hdHJpeDQuanMiLCIuLlxcc3JjXFxLVE1lc2guanMiLCIuLlxcc3JjXFxLVFNjZW5lLmpzIiwiLi5cXHNyY1xcS1RTaGFkZXJzLmpzIiwiLi5cXHNyY1xcS1RUZXh0dXJlLmpzIiwiLi5cXHNyY1xcS1RVdGlscy5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yMi5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yMy5qcyIsIi4uXFxzcmNcXEtyYW1UZWNoLmpzIiwiLi5cXHNyY1xcV2luZG93RXhwb3J0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIE1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG5cclxuZnVuY3Rpb24gQ2FtZXJhUGVyc3BlY3RpdmUocG9zaXRpb24sIHJvdGF0aW9uLCBmb3YsIHJhdGlvLCB6bmVhciwgemZhcil7XHJcblx0dGhpcy5fX2t0Y2FtZXJhID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcblx0dGhpcy5yb3RhdGlvbiA9IHJvdGF0aW9uO1xyXG5cdFxyXG5cdHRoaXMuZm92ID0gZm92O1xyXG5cdHRoaXMucmF0aW8gPSByYXRpbztcclxuXHR0aGlzLnpuZWFyID0gem5lYXI7XHJcblx0dGhpcy56ZmFyID0gemZhcjtcclxuXHRcclxuXHR0aGlzLnNldFBlcnNwZWN0aXZlKCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FtZXJhUGVyc3BlY3RpdmU7XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUuc2V0UGVyc3BlY3RpdmUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBDID0gMSAvIE1hdGgudGFuKHRoaXMuZm92IC8gMik7XHJcblx0dmFyIFIgPSBDICogdGhpcy5yYXRpbztcclxuXHR2YXIgQSA9ICh0aGlzLnpuZWFyICsgdGhpcy56ZmFyKSAvICh0aGlzLnpuZWFyIC0gdGhpcy56ZmFyKTtcclxuXHR2YXIgQiA9ICgyICogdGhpcy56bmVhciAqIHRoaXMuemZhcikgLyAodGhpcy56bmVhciAtIHRoaXMuemZhcik7XHJcblx0XHJcblx0dGhpcy5wZXJzcGVjdGl2ZU1hdHJpeCA9IG5ldyBNYXRyaXg0KFxyXG5cdFx0QywgMCwgMCwgIDAsXHJcblx0XHQwLCBSLCAwLCAgMCxcclxuXHRcdDAsIDAsIEEsICBCLFxyXG5cdFx0MCwgMCwgLTEsIDBcclxuXHQpLnRvRmxvYXQzMkFycmF5KCk7XHJcbn07XHJcbiIsImZ1bmN0aW9uIENvbG9yKGhleENvbG9yKXtcclxuXHR2YXIgc3RyID0gaGV4Q29sb3Iuc3Vic3RyaW5nKDEpO1xyXG5cdHZhciByID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygwLCAyKSwgMTYpO1xyXG5cdHZhciBnID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygyLCA0KSwgMTYpO1xyXG5cdHZhciBiID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg0LCA2KSwgMTYpO1xyXG5cdHZhciBhID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg2LCA4KSwgMTYpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBbciAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSwgYV07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29sb3I7XHJcblxyXG5Db2xvci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaGV4Q29sb3Ipe1xyXG5cdHZhciBzdHIgPSBoZXhDb2xvci5zdWJzdHJpbmcoMSk7XHJcblx0dmFyIHIgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDAsIDIpLCAxNik7XHJcblx0dmFyIGcgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDIsIDQpLCAxNik7XHJcblx0dmFyIGIgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDQsIDYpLCAxNik7XHJcblx0dmFyIGEgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDYsIDgpLCAxNik7XHJcblx0XHJcblx0dGhpcy5jb2xvciA9IFtyIC8gMjU1LCBnIC8gMjU1LCBiIC8gMjU1LCBhXTtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5zZXRSR0IgPSBmdW5jdGlvbihyZWQsIGdyZWVuLCBibHVlKXtcclxuXHR0aGlzLnNldFJHQkEocmVkLCBncmVlbiwgYmx1ZSwgMSk7XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuc2V0UkdCQSA9IGZ1bmN0aW9uKHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhKXtcclxuXHR0aGlzLmNvbG9yID0gW3JlZCAvIDI1NSwgZ3JlZW4gLyAyNTUsIGJsdWUgLyAyNTUsIGFscGhhXTtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5nZXRSR0IgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBjID0gdGhpcy5nZXRSR0JBKCk7XHJcblx0XHJcblx0cmV0dXJuIFtjWzBdLCBjWzFdLCBjWzJdXTtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5nZXRSR0JBID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gdGhpcy5jb2xvcjtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5nZXRIZXggPSBmdW5jdGlvbigpe1xyXG5cdHZhciBjID0gdGhpcy5jb2xvcjtcclxuXHRcclxuXHR2YXIgciA9IChjWzBdICogMjU1KS50b1N0cmluZygxNik7XHJcblx0dmFyIGcgPSAoY1sxXSAqIDI1NSkudG9TdHJpbmcoMTYpO1xyXG5cdHZhciBiID0gKGNbMl0gKiAyNTUpLnRvU3RyaW5nKDE2KTtcclxuXHR2YXIgYSA9IChjWzNdKS50b1N0cmluZygxNik7XHJcblx0XHJcblx0aWYgKHIubGVuZ3RoID09IDEpIHIgPSBcIjBcIiArIHI7XHJcblx0aWYgKGcubGVuZ3RoID09IDEpIGcgPSBcIjBcIiArIGc7XHJcblx0aWYgKGIubGVuZ3RoID09IDEpIGIgPSBcIjBcIiArIGI7XHJcblx0aWYgKGEubGVuZ3RoID09IDEpIGEgPSBcIjBcIiArIGE7XHJcblx0XHJcblx0cmV0dXJuIChcIiNcIiArIHIgKyBnICsgYiArIGEpLnRvVXBwZXJDYXNlKCk7XHJcbn07XHJcblxyXG5Db2xvci5fQkxBQ0tcdFx0PSBcIiMwMDAwMDAwMVwiO1xyXG5Db2xvci5fUkVEIFx0XHRcdD0gXCIjRkYwMDAwMDFcIjtcclxuQ29sb3IuX0dSRUVOIFx0XHQ9IFwiIzAwRkYwMDAxXCI7XHJcbkNvbG9yLl9CTFVFIFx0XHQ9IFwiIzAwMDBGRjAxXCI7XHJcbkNvbG9yLl9XSElURVx0XHQ9IFwiI0ZGRkZGRjAxXCI7XHJcbkNvbG9yLl9ZRUxMT1dcdFx0PSBcIiNGRkZGMDAwMVwiO1xyXG5Db2xvci5fTUFHRU5UQVx0XHQ9IFwiI0ZGMDBGRjAxXCI7XHJcbkNvbG9yLl9BUVVBXHRcdFx0PSBcIiMwMEZGRkYwMVwiO1xyXG5Db2xvci5fR09MRFx0XHRcdD0gXCIjRkZENzAwMDFcIjtcclxuQ29sb3IuX0dSQVlcdFx0XHQ9IFwiIzgwODA4MDAxXCI7XHJcbkNvbG9yLl9QVVJQTEVcdFx0PSBcIiM4MDAwODAwMVwiOyIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcbnZhciBWZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnkoKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy52ZXJ0aWNlcyA9IFtdO1xyXG5cdHRoaXMudHJpYW5nbGVzID0gW107XHJcblx0dGhpcy51dkNvb3JkcyA9IFtdO1xyXG5cdHRoaXMuY29sb3JzID0gW107XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnk7XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuYWRkVmVydGljZSA9IGZ1bmN0aW9uKHgsIHksIHosIGNvbG9yLCB0eCwgdHkpe1xyXG5cdGlmICghY29sb3IpIGNvbG9yID0gQ29sb3IuX1dISVRFO1xyXG5cdGlmICghdHgpIHR4ID0gMDtcclxuXHRpZiAoIXR5KSB0eSA9IDA7XHJcblx0XHJcblx0dGhpcy52ZXJ0aWNlcy5wdXNoKG5ldyBWZWN0b3IzKHgsIHksIHopKTtcclxuXHR0aGlzLmNvbG9ycy5wdXNoKG5ldyBDb2xvcihjb2xvcikpO1xyXG5cdHRoaXMudXZDb29yZHMucHVzaChuZXcgVmVjdG9yMih0eCwgdHkpKTtcclxufTtcclxuXHJcbkdlb21ldHJ5LnByb3RvdHlwZS5hZGRGYWNlID0gZnVuY3Rpb24odmVydGljZV8wLCB2ZXJ0aWNlXzEsIHZlcnRpY2VfMil7XHJcblx0aWYgKCF0aGlzLnZlcnRpY2VzW3ZlcnRpY2VfMF0pIHRocm93IFwiSW52YWxpZCB2ZXJ0ZXggaW5kZXg6IFwiICsgdmVydGljZV8wO1xyXG5cdGlmICghdGhpcy52ZXJ0aWNlc1t2ZXJ0aWNlXzFdKSB0aHJvdyBcIkludmFsaWQgdmVydGV4IGluZGV4OiBcIiArIHZlcnRpY2VfMTtcclxuXHRpZiAoIXRoaXMudmVydGljZXNbdmVydGljZV8yXSkgdGhyb3cgXCJJbnZhbGlkIHZlcnRleCBpbmRleDogXCIgKyB2ZXJ0aWNlXzI7XHJcblx0XHJcblx0dGhpcy50cmlhbmdsZXMucHVzaChuZXcgVmVjdG9yMyh2ZXJ0aWNlXzAsIHZlcnRpY2VfMSwgdmVydGljZV8yKSk7XHJcbn07XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbigpe1xyXG5cdHZhciB2ZXJ0aWNlcyA9IFtdO1xyXG5cdHZhciB1dkNvb3JkcyA9IFtdO1xyXG5cdHZhciB0cmlhbmdsZXMgPSBbXTtcclxuXHR2YXIgY29sb3JzID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLnZlcnRpY2VzLmxlbmd0aDtpPGxlbjtpKyspeyBcclxuXHRcdHZhciB2ID0gdGhpcy52ZXJ0aWNlc1tpXTsgXHJcblx0XHR2ZXJ0aWNlcy5wdXNoKHYueCwgdi55LCB2LnopOyBcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLnV2Q29vcmRzLmxlbmd0aDtpPGxlbjtpKyspeyBcclxuXHRcdHZhciB2ID0gdGhpcy51dkNvb3Jkc1tpXTsgXHJcblx0XHR1dkNvb3Jkcy5wdXNoKHYueCwgdi55KTsgXHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy50cmlhbmdsZXMubGVuZ3RoO2k8bGVuO2krKyl7IFxyXG5cdFx0dmFyIHQgPSB0aGlzLnRyaWFuZ2xlc1tpXTsgXHJcblx0XHR0cmlhbmdsZXMucHVzaCh0LngsIHQueSwgdC56KTsgXHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy5jb2xvcnMubGVuZ3RoO2k8bGVuO2krKyl7IFxyXG5cdFx0dmFyIGMgPSB0aGlzLmNvbG9yc1tpXS5nZXRSR0JBKCk7IFxyXG5cdFx0XHJcblx0XHRjb2xvcnMucHVzaChjWzBdLCBjWzFdLCBjWzJdLCBjWzNdKTsgXHJcblx0fVxyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJBUlJBWV9CVUZGRVJcIiwgbmV3IEZsb2F0MzJBcnJheSh2ZXJ0aWNlcyksIDMpO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJBUlJBWV9CVUZGRVJcIiwgbmV3IEZsb2F0MzJBcnJheSh1dkNvb3JkcyksIDIpO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBLVC5jcmVhdGVBcnJheUJ1ZmZlcihcIkVMRU1FTlRfQVJSQVlfQlVGRkVSXCIsIG5ldyBVaW50MTZBcnJheSh0cmlhbmdsZXMpLCAxKTtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IEtULmNyZWF0ZUFycmF5QnVmZmVyKFwiQVJSQVlfQlVGRkVSXCIsIG5ldyBGbG9hdDMyQXJyYXkoY29sb3JzKSwgNCk7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbiIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5Qm94KHdpZHRoLCBsZW5ndGgsIGhlaWdodCl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBib3hHZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHRcclxuXHR2YXIgdyA9IHdpZHRoIC8gMjtcclxuXHR2YXIgbCA9IGxlbmd0aCAvIDI7XHJcblx0dmFyIGggPSBoZWlnaHQgLyAyO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgIGwsIENvbG9yLl9XSElURSwgMS4wLCAxLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAxLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgIGwsIENvbG9yLl9XSElURSwgMS4wLCAwLjApO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAxLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgLWwsIENvbG9yLl9XSElURSwgMS4wLCAxLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgLWwsIENvbG9yLl9XSElURSwgMS4wLCAwLjApO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgLWwsIENvbG9yLl9XSElURSwgMS4wLCAxLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAxLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgLWwsIENvbG9yLl9XSElURSwgMS4wLCAwLjApO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgIGwsIENvbG9yLl9XSElURSwgMS4wLCAxLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgIGwsIENvbG9yLl9XSElURSwgMS4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAxLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgIGwsIENvbG9yLl9XSElURSwgMS4wLCAxLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAxLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgLWwsIENvbG9yLl9XSElURSwgMS4wLCAwLjApO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAxLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgIGwsIENvbG9yLl9XSElURSwgMS4wLCAxLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgLWwsIENvbG9yLl9XSElURSwgMS4wLCAwLjApO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDAsIDEsIDIpO1xyXG5cdGJveEdlby5hZGRGYWNlKDAsIDMsIDEpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDQsIDUsIDYpO1xyXG5cdGJveEdlby5hZGRGYWNlKDUsIDcsIDYpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDgsIDksIDEwKTtcclxuXHRib3hHZW8uYWRkRmFjZSg4LCAxMSwgOSk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMTIsIDEzLCAxNCk7XHJcblx0Ym94R2VvLmFkZEZhY2UoMTMsIDE1LCAxNCk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMTYsIDE3LCAxOCk7XHJcblx0Ym94R2VvLmFkZEZhY2UoMTYsIDE5LCAxNyk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMjAsIDIxLCAyMik7XHJcblx0Ym94R2VvLmFkZEZhY2UoMjEsIDIzLCAyMik7XHJcblx0XHJcblx0Ym94R2VvLmJ1aWxkKCk7XHJcblx0XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgPSBib3hHZW8udmVydGV4QnVmZmVyO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gYm94R2VvLnRleEJ1ZmZlcjtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gYm94R2VvLmZhY2VzQnVmZmVyO1xyXG5cdHRoaXMuY29sb3JzQnVmZmVyID0gYm94R2VvLmNvbG9yc0J1ZmZlcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeUJveDsiLCJ2YXIgU2hhZGVycyA9IHJlcXVpcmUoJy4vS1RTaGFkZXJzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRpbml0OiBmdW5jdGlvbihjYW52YXMpe1xyXG5cdFx0dGhpcy5jYW52YXMgPSBjYW52YXM7XHJcblx0XHR0aGlzLmdsID0gbnVsbDtcclxuXHRcdHRoaXMuc2hhZGVycyA9IHt9O1xyXG5cdFx0XHJcblx0XHR0aGlzLl9faW5pdENvbnRleHQoY2FudmFzKTtcclxuXHRcdHRoaXMuX19pbml0UHJvcGVydGllcygpO1xyXG5cdFx0dGhpcy5fX2luaXRTaGFkZXJzKCk7XHJcblx0fSxcclxuXHRcclxuXHRfX2luaXRDb250ZXh0OiBmdW5jdGlvbihjYW52YXMpe1xyXG5cdFx0dGhpcy5nbCA9IGNhbnZhcy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnKTtcclxuXHRcdFxyXG5cdFx0aWYgKCF0aGlzLmdsKXtcclxuXHRcdFx0YWxlcnQoXCJZb3VyIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IFdlYkdMXCIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuZ2wud2lkdGggPSBjYW52YXMud2lkdGg7XHJcblx0XHR0aGlzLmdsLmhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XHJcblx0fSxcclxuXHRcclxuXHRfX2luaXRQcm9wZXJ0aWVzOiBmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGdsID0gdGhpcy5nbDtcclxuXHRcdFxyXG5cdFx0Z2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xyXG5cdFx0Z2wuZGVwdGhGdW5jKGdsLkxFUVVBTCk7XHJcblx0XHRcclxuXHRcdGdsLmVuYWJsZShnbC5DVUxMX0ZBQ0UpO1xyXG5cdFx0XHJcblx0XHRnbC5lbmFibGUoIGdsLkJMRU5EICk7XHJcblx0XHRnbC5ibGVuZEVxdWF0aW9uKCBnbC5GVU5DX0FERCApO1xyXG5cdFx0Z2wuYmxlbmRGdW5jKCBnbC5TUkNfQUxQSEEsIGdsLk9ORV9NSU5VU19TUkNfQUxQSEEgKTtcclxuXHR9LFxyXG5cdFxyXG5cdF9faW5pdFNoYWRlcnM6IGZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLnNoYWRlcnMuYmFzaWMgPSB0aGlzLnByb2Nlc3NTaGFkZXIoU2hhZGVycy5iYXNpYyk7XHJcblx0fSxcclxuXHRcclxuXHRjcmVhdGVBcnJheUJ1ZmZlcjogZnVuY3Rpb24odHlwZSwgZGF0YUFycmF5LCBpdGVtU2l6ZSl7XHJcblx0XHR2YXIgZ2wgPSB0aGlzLmdsO1xyXG5cdFx0dmFyIGJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG5cdFx0Z2wuYmluZEJ1ZmZlcihnbFt0eXBlXSwgYnVmZmVyKTtcclxuXHRcdGdsLmJ1ZmZlckRhdGEoZ2xbdHlwZV0sIGRhdGFBcnJheSwgZ2wuU1RBVElDX0RSQVcpO1xyXG5cdFx0YnVmZmVyLm51bUl0ZW1zID0gZGF0YUFycmF5Lmxlbmd0aDtcclxuXHRcdGJ1ZmZlci5pdGVtU2l6ZSA9IGl0ZW1TaXplO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gYnVmZmVyO1xyXG5cdH0sXHJcblx0XHJcblx0cHJvY2Vzc1NoYWRlcjogZnVuY3Rpb24oc2hhZGVyKXtcclxuXHRcdHZhciBnbCA9IHRoaXMuZ2w7XHJcblx0XHRcclxuXHRcdHZhciB2Q29kZSA9IHNoYWRlci52ZXJ0ZXhTaGFkZXI7XHJcblx0XHR2YXIgdlNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5WRVJURVhfU0hBREVSKTtcclxuXHRcdGdsLnNoYWRlclNvdXJjZSh2U2hhZGVyLCB2Q29kZSk7XHJcblx0XHRnbC5jb21waWxlU2hhZGVyKHZTaGFkZXIpO1xyXG5cdFx0XHJcblx0XHR2YXIgZkNvZGUgPSBzaGFkZXIuZnJhZ21lbnRTaGFkZXI7XHJcblx0XHR2YXIgZlNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5GUkFHTUVOVF9TSEFERVIpO1xyXG5cdFx0Z2wuc2hhZGVyU291cmNlKGZTaGFkZXIsIGZDb2RlKTtcclxuXHRcdGdsLmNvbXBpbGVTaGFkZXIoZlNoYWRlcik7XHJcblx0XHRcclxuXHRcdHZhciBzaGFkZXJQcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG5cdFx0Z2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIHZTaGFkZXIpO1xyXG5cdFx0Z2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIGZTaGFkZXIpO1xyXG5cdFx0Z2wubGlua1Byb2dyYW0oc2hhZGVyUHJvZ3JhbSk7XHJcblx0XHRcclxuXHRcdGlmICghZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihzaGFkZXJQcm9ncmFtLCBnbC5MSU5LX1NUQVRVUykpe1xyXG5cdFx0XHR0aHJvdyBcIkVycm9yIGluaXRpYWxpemluZyB0aGUgc2hhZGVyIHByb2dyYW1cIjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIGF0dHJpYnV0ZXMgPSBbXTtcclxuXHRcdGZvciAodmFyIGk9MCxsZW49c2hhZGVyLmF0dHJpYnV0ZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHRcdHZhciBhdHQgPSBzaGFkZXIuYXR0cmlidXRlc1tpXTtcclxuXHRcdFx0dmFyIGxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgYXR0Lm5hbWUpO1xyXG5cdFx0XHRcclxuXHRcdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkobG9jYXRpb24pO1xyXG5cdFx0XHRcclxuXHRcdFx0YXR0cmlidXRlcy5wdXNoKHtcclxuXHRcdFx0XHRuYW1lOiBhdHQubmFtZSxcclxuXHRcdFx0XHR0eXBlOiBhdHQudHlwZSxcclxuXHRcdFx0XHRsb2NhdGlvbjogbG9jYXRpb25cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciB1bmlmb3JtcyA9IFtdO1xyXG5cdFx0Zm9yICh2YXIgaT0wLGxlbj1zaGFkZXIudW5pZm9ybXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHRcdHZhciB1bmkgPSBzaGFkZXIudW5pZm9ybXNbaV07XHJcblx0XHRcdHZhciBsb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCB1bmkubmFtZSk7XHJcblx0XHRcdFxyXG5cdFx0XHR1bmlmb3Jtcy5wdXNoKHtcclxuXHRcdFx0XHRuYW1lOiB1bmkubmFtZSxcclxuXHRcdFx0XHR0eXBlOiB1bmkudHlwZSxcclxuXHRcdFx0XHRsb2NhdGlvbjogbG9jYXRpb25cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHNoYWRlclByb2dyYW06IHNoYWRlclByb2dyYW0sXHJcblx0XHRcdGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXHJcblx0XHRcdHVuaWZvcm1zOiB1bmlmb3Jtc1xyXG5cdFx0fTtcclxuXHR9XHJcbn07XHJcblxyXG5cclxuIiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcblxyXG5mdW5jdGlvbiBNYXRlcmlhbChwYXJhbWV0ZXJzKXtcclxuXHR0aGlzLl9fa3RtYXRlcmlhbCA9IHRydWU7XHJcblx0XHJcblx0aWYgKCFwYXJhbWV0ZXJzKSBwYXJhbWV0ZXJzID0ge307XHJcblx0XHJcblx0dGhpcy50ZXh0dXJlID0gKHBhcmFtZXRlcnMudGV4dHVyZSk/IHBhcmFtZXRlcnMudGV4dHVyZSA6IG51bGw7XHJcblx0dGhpcy5jb2xvciA9IG5ldyBDb2xvcigocGFyYW1ldGVycy5jb2xvcik/IHBhcmFtZXRlcnMuY29sb3IgOiBDb2xvci5fV0hJVEUpO1xyXG5cdHRoaXMuc2hhZGVyID0gKHBhcmFtZXRlcnMuc2hhZGVyKT8gcGFyYW1ldGVycy5zaGFkZXIgOiBudWxsO1xyXG5cdHRoaXMub3BhY2l0eSA9IChwYXJhbWV0ZXJzLm9wYWNpdHkpPyBwYXJhbWV0ZXJzLm9wYWNpdHkgOiAxLjA7XHJcblx0dGhpcy5kcmF3RmFjZXMgPSAocGFyYW1ldGVycy5kcmF3RmFjZXMpPyBwYXJhbWV0ZXJzLmRyYXdGYWNlcyA6ICdGUk9OVCc7XHJcblx0dGhpcy5kcmF3QXMgPSAocGFyYW1ldGVycy5kcmF3QXMpPyBwYXJhbWV0ZXJzLmRyYXdBcyA6ICdUUklBTkdMRVMnO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGVyaWFsOyIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBNYXRlcmlhbCA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbCcpO1xyXG5cclxuZnVuY3Rpb24gTWF0ZXJpYWxCYXNpYyh0ZXh0dXJlLCBjb2xvciwgb3BhY2l0eSl7XHJcblx0dGhpcy5fX2t0bWF0ZXJpYWwgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBtYXRlcmlhbCA9IG5ldyBNYXRlcmlhbCh7XHJcblx0XHR0ZXh0dXJlOiB0ZXh0dXJlLFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdFx0b3BhY2l0eTogb3BhY2l0eSxcclxuXHRcdHNoYWRlcjogS1Quc2hhZGVycy5iYXNpY1xyXG5cdH0pO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IG1hdGVyaWFsLnRleHR1cmU7XHJcblx0dGhpcy5jb2xvciA9IG1hdGVyaWFsLmNvbG9yO1xyXG5cdHRoaXMuc2hhZGVyID0gbWF0ZXJpYWwuc2hhZGVyO1xyXG5cdHRoaXMub3BhY2l0eSA9IG1hdGVyaWFsLm9wYWNpdHk7XHJcblx0dGhpcy5kcmF3RmFjZXMgPSBtYXRlcmlhbC5kcmF3RmFjZXM7XHJcblx0dGhpcy5kcmF3QXMgPSBtYXRlcmlhbC5kcmF3QXM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0ZXJpYWxCYXNpYztcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0cmFkRGVnUmVsOiBNYXRoLlBJIC8gMTgwLFxyXG5cdFxyXG5cdFBJXzI6IE1hdGguUEkgLyAyLFxyXG5cdFBJOiBNYXRoLlBJLFxyXG5cdFBJM18yOiBNYXRoLlBJICogMyAvIDIsXHJcblx0UEkyOiBNYXRoLlBJICogMixcclxuXHRcclxuXHRkZWdUb1JhZDogZnVuY3Rpb24oZGVncmVlcyl7XHJcblx0XHRyZXR1cm4gZGVncmVlcyAqIHRoaXMucmFkRGVnUmVsO1xyXG5cdH0sXHJcblx0XHJcblx0cmFkVG9EZWc6IGZ1bmN0aW9uKHJhZGlhbnMpe1xyXG5cdFx0cmV0dXJuIHJhZGlhbnMgLyB0aGlzLnJhZERlZ1JlbDtcclxuXHR9XHJcbn07XHJcbiIsImZ1bmN0aW9uIE1hdHJpeDQoKXtcclxuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAxNikgdGhyb3cgXCJNYXRyaXggNCBtdXN0IHJlY2VpdmUgMTYgcGFyYW1ldGVyc1wiO1xyXG5cdFxyXG5cdHZhciBjID0gMDtcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKz00KXtcclxuXHRcdHRoaXNbY10gPSBhcmd1bWVudHNbaV07XHJcblx0XHR0aGlzW2MrNF0gPSBhcmd1bWVudHNbaSsxXTtcclxuXHRcdHRoaXNbYys4XSA9IGFyZ3VtZW50c1tpKzJdO1xyXG5cdFx0dGhpc1tjKzEyXSA9IGFyZ3VtZW50c1tpKzNdO1xyXG5cdFx0XHJcblx0XHRjICs9IDE7XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMuX19rdG00ID0gdHJ1ZTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRyaXg0O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUuaWRlbnRpdHkgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBwYXJhbXMgPSBbXHJcblx0XHQxLCAwLCAwLCAwLFxyXG5cdFx0MCwgMSwgMCwgMCxcclxuXHRcdDAsIDAsIDEsIDAsXHJcblx0XHQwLCAwLCAwLCAxXHJcblx0XTtcclxuXHRcclxuXHR2YXIgYyA9IDA7XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSs9NCl7XHJcblx0XHR0aGlzW2NdID0gcGFyYW1zW2ldO1xyXG5cdFx0dGhpc1tjKzRdID0gcGFyYW1zW2krMV07XHJcblx0XHR0aGlzW2MrOF0gPSBwYXJhbXNbaSsyXTtcclxuXHRcdHRoaXNbYysxMl0gPSBwYXJhbXNbaSszXTtcclxuXHRcdFxyXG5cdFx0YyArPSAxO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24obWF0cml4NCl7XHJcblx0aWYgKG1hdHJpeDQuX19rdG00KXtcclxuXHRcdHZhciBBMSA9IFt0aGlzWzBdLCAgdGhpc1sxXSwgIHRoaXNbMl0sICB0aGlzWzNdXTtcclxuXHRcdHZhciBBMiA9IFt0aGlzWzRdLCAgdGhpc1s1XSwgIHRoaXNbNl0sICB0aGlzWzddXTtcclxuXHRcdHZhciBBMyA9IFt0aGlzWzhdLCAgdGhpc1s5XSwgIHRoaXNbMTBdLCB0aGlzWzExXV07XHJcblx0XHR2YXIgQTQgPSBbdGhpc1sxMl0sIHRoaXNbMTNdLCB0aGlzWzE0XSwgdGhpc1sxNV1dO1xyXG5cdFx0XHJcblx0XHR2YXIgQjEgPSBbbWF0cml4NFswXSwgbWF0cml4NFs0XSwgbWF0cml4NFs4XSwgIG1hdHJpeDRbMTJdXTtcclxuXHRcdHZhciBCMiA9IFttYXRyaXg0WzFdLCBtYXRyaXg0WzVdLCBtYXRyaXg0WzldLCAgbWF0cml4NFsxM11dO1xyXG5cdFx0dmFyIEIzID0gW21hdHJpeDRbMl0sIG1hdHJpeDRbNl0sIG1hdHJpeDRbMTBdLCBtYXRyaXg0WzE0XV07XHJcblx0XHR2YXIgQjQgPSBbbWF0cml4NFszXSwgbWF0cml4NFs3XSwgbWF0cml4NFsxMV0sIG1hdHJpeDRbMTVdXTtcclxuXHRcdFxyXG5cdFx0dmFyIGRvdCA9IGZ1bmN0aW9uKGNvbCwgcm93KXtcclxuXHRcdFx0dmFyIHN1bSA9IDA7XHJcblx0XHRcdGZvciAodmFyIGo9MDtqPDQ7aisrKXsgc3VtICs9IHJvd1tqXSAqIGNvbFtqXTsgfVxyXG5cdFx0XHRyZXR1cm4gc3VtO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0dGhpc1swXSA9IGRvdChBMSwgQjEpOyAgIHRoaXNbMV0gPSBkb3QoQTEsIEIyKTsgICB0aGlzWzJdID0gZG90KEExLCBCMyk7ICAgdGhpc1szXSA9IGRvdChBMSwgQjQpO1xyXG5cdFx0dGhpc1s0XSA9IGRvdChBMiwgQjEpOyAgIHRoaXNbNV0gPSBkb3QoQTIsIEIyKTsgICB0aGlzWzZdID0gZG90KEEyLCBCMyk7ICAgdGhpc1s3XSA9IGRvdChBMiwgQjQpO1xyXG5cdFx0dGhpc1s4XSA9IGRvdChBMywgQjEpOyAgIHRoaXNbOV0gPSBkb3QoQTMsIEIyKTsgICB0aGlzWzEwXSA9IGRvdChBMywgQjMpOyAgdGhpc1sxMV0gPSBkb3QoQTMsIEI0KTtcclxuXHRcdHRoaXNbMTJdID0gZG90KEE0LCBCMSk7ICB0aGlzWzEzXSA9IGRvdChBNCwgQjIpOyAgdGhpc1sxNF0gPSBkb3QoQTQsIEIzKTsgIHRoaXNbMTVdID0gZG90KEE0LCBCNCk7XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1lbHNlIGlmIChtYXRyaXg0Lmxlbmd0aCA9PSA0KXtcclxuXHRcdHZhciByZXQgPSBbXTtcclxuXHRcdHZhciBjb2wgPSBtYXRyaXg0O1xyXG5cdFxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MTY7aSs9NCl7XHJcblx0XHRcdHZhciByb3cgPSBbdGhpc1tpXSwgdGhpc1tpKzFdLCB0aGlzW2krMl0sIHRoaXNbaSszXV07XHJcblx0XHRcdHZhciBzdW0gPSAwO1xyXG5cdFx0XHRcclxuXHRcdFx0Zm9yICh2YXIgaj0wO2o8NDtqKyspe1xyXG5cdFx0XHRcdHN1bSArPSByb3dbal0gKiBjb2xbal07XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHJldC5wdXNoKHN1bSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiByZXQ7XHJcblx0fWVsc2V7XHJcblx0XHR0aHJvdyBcIkludmFsaWQgY29uc3RydWN0b3JcIjtcclxuXHR9XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS50cmFuc3Bvc2UgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHR2YXIgdmFsdWVzID0gW1xyXG5cdFx0VFswXSwgVFs0XSwgVFs4XSwgIFRbMTJdLFxyXG5cdFx0VFsxXSwgVFs1XSwgVFs5XSwgIFRbMTNdLFxyXG5cdFx0VFsyXSwgVFs2XSwgVFsxMF0sIFRbMTRdLFxyXG5cdFx0VFszXSwgVFs3XSwgVFsxMV0sIFRbMTVdLFxyXG5cdF07XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSsrKXtcclxuXHRcdHRoaXNbaV0gPSB2YWx1ZXNbaV07XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKG1hdHJpeDQpe1xyXG5cdGlmICghbWF0cml4NC5fX2t0bTQpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIE1hdHJpeDQgaW50byB0aGlzIG1hdHJpeFwiO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPDE2O2krKyl7XHJcblx0XHR0aGlzW2ldID0gbWF0cml4NFtpXTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdFRbMF0sIFRbNF0sIFRbOF0sICBUWzEyXSxcclxuXHRcdFRbMV0sIFRbNV0sIFRbOV0sICBUWzEzXSxcclxuXHRcdFRbMl0sIFRbNl0sIFRbMTBdLCBUWzE0XSxcclxuXHRcdFRbM10sIFRbN10sIFRbMTFdLCBUWzE1XVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS50b0Zsb2F0MzJBcnJheSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFtcclxuXHRcdFRbMF0sIFRbMV0sIFRbMl0sICBUWzNdLFxyXG5cdFx0VFs0XSwgVFs1XSwgVFs2XSwgIFRbN10sXHJcblx0XHRUWzhdLCBUWzldLCBUWzEwXSwgVFsxMV0sXHJcblx0XHRUWzEyXSwgVFsxM10sIFRbMTRdLCBUWzE1XVxyXG5cdF0pO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRJZGVudGl0eSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0MSwgMCwgMCwgMCxcclxuXHRcdDAsIDEsIDAsIDAsXHJcblx0XHQwLCAwLCAxLCAwLFxyXG5cdFx0MCwgMCwgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFhSb3RhdGlvbiA9IGZ1bmN0aW9uKHJhZGlhbnMpe1xyXG5cdHZhciBDID0gTWF0aC5jb3MocmFkaWFucyk7XHJcblx0dmFyIFMgPSBNYXRoLnNpbihyYWRpYW5zKTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQxLCAgMCwgIDAsIDAsXHJcblx0XHQwLCAgQywgLVMsIDAsXHJcblx0XHQwLCAgUywgIEMsIDAsXHJcblx0XHQwLCAgMCwgIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRZUm90YXRpb24gPSBmdW5jdGlvbihyYWRpYW5zKXtcclxuXHR2YXIgQyA9IE1hdGguY29zKHJhZGlhbnMpO1xyXG5cdHZhciBTID0gTWF0aC5zaW4ocmFkaWFucyk7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0IEMsICAwLCAtUywgMCxcclxuXHRcdCAwLCAgMSwgIDAsIDAsXHJcblx0XHQgUywgIDAsICBDLCAwLFxyXG5cdFx0IDAsICAwLCAgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFpSb3RhdGlvbiA9IGZ1bmN0aW9uKHJhZGlhbnMpe1xyXG5cdHZhciBDID0gTWF0aC5jb3MocmFkaWFucyk7XHJcblx0dmFyIFMgPSBNYXRoLnNpbihyYWRpYW5zKTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQgQywgLVMsIDAsIDAsXHJcblx0XHQgUywgIEMsIDAsIDAsXHJcblx0XHQgMCwgIDAsIDEsIDAsXHJcblx0XHQgMCwgIDAsIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRUcmFuc2xhdGlvbiA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgdHJhbnNsYXRlIHRvIGEgdmVjdG9yIDNcIjtcclxuXHRcclxuXHR2YXIgeCA9IHZlY3RvcjMueDtcclxuXHR2YXIgeSA9IHZlY3RvcjMueTtcclxuXHR2YXIgeiA9IHZlY3RvcjMuejtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQxLCAwLCAwLCB4LFxyXG5cdFx0MCwgMSwgMCwgeSxcclxuXHRcdDAsIDAsIDEsIHosXHJcblx0XHQwLCAwLCAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0U2NhbGUgPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IHNjYWxlIHRvIGEgdmVjdG9yIDNcIjtcclxuXHRcclxuXHR2YXIgc3ggPSB2ZWN0b3IzLng7XHJcblx0dmFyIHN5ID0gdmVjdG9yMy55O1xyXG5cdHZhciBzeiA9IHZlY3RvcjMuejtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHRzeCwgIDAsICAwLCAwLFxyXG5cdFx0IDAsIHN5LCAgMCwgMCxcclxuXHRcdCAwLCAgMCwgc3osIDAsXHJcblx0XHQgMCwgIDAsICAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0VHJhbnNmb3JtYXRpb24gPSBmdW5jdGlvbihwb3NpdGlvbiwgcm90YXRpb24sIHNjYWxlKXtcclxuXHRpZiAoIXBvc2l0aW9uLl9fa3R2MykgdGhyb3cgXCJQb3NpdGlvbiBtdXN0IGJlIGEgVmVjdG9yM1wiO1xyXG5cdGlmICghcm90YXRpb24uX19rdHYzKSB0aHJvdyBcIlJvdGF0aW9uIG11c3QgYmUgYSBWZWN0b3IzXCI7XHJcblx0aWYgKHNjYWxlICYmICFzY2FsZS5fX2t0djMpIHRocm93IFwiU2NhbGUgbXVzdCBiZSBhIFZlY3RvcjNcIjtcclxuXHRcclxuXHR2YXIgc2NhbGUgPSAoc2NhbGUpPyBNYXRyaXg0LmdldFNjYWxlKHNjYWxlKSA6IE1hdHJpeDQuZ2V0SWRlbnRpdHkoKTtcclxuXHRcclxuXHR2YXIgcm90YXRpb25YID0gTWF0cml4NC5nZXRYUm90YXRpb24ocm90YXRpb24ueCk7XHJcblx0dmFyIHJvdGF0aW9uWSA9IE1hdHJpeDQuZ2V0WVJvdGF0aW9uKHJvdGF0aW9uLnkpO1xyXG5cdHZhciByb3RhdGlvblogPSBNYXRyaXg0LmdldFpSb3RhdGlvbihyb3RhdGlvbi56KTtcclxuXHRcclxuXHR2YXIgdHJhbnNsYXRpb24gPSBNYXRyaXg0LmdldFRyYW5zbGF0aW9uKHBvc2l0aW9uKTtcclxuXHRcclxuXHRcclxuXHR2YXIgbWF0cml4ID0gc2NhbGU7XHJcblx0bWF0cml4Lm11bHRpcGx5KHJvdGF0aW9uWCk7XHJcblx0bWF0cml4Lm11bHRpcGx5KHJvdGF0aW9uWSk7XHJcblx0bWF0cml4Lm11bHRpcGx5KHJvdGF0aW9uWik7XHJcblx0bWF0cml4Lm11bHRpcGx5KHRyYW5zbGF0aW9uKTtcclxuXHRcclxuXHRyZXR1cm4gbWF0cml4O1xyXG59O1xyXG4iLCJ2YXIgTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcbnZhciBWZWMzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxuXHJcbmZ1bmN0aW9uIE1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKXtcclxuXHRpZiAoIWdlb21ldHJ5Ll9fa3RnZW9tZXRyeSkgdGhyb3cgXCJHZW9tZXRyeSBtdXN0IGJlIGEgS1RHZW9tZXRyeSBpbnN0YW5jZVwiO1xyXG5cdGlmICghbWF0ZXJpYWwuX19rdG1hdGVyaWFsKSB0aHJvdyBcIk1hdGVyaWFsIG11c3QgYmUgYSBLVE1hdGVyaWFsIGluc3RhbmNlXCI7XHJcblx0XHJcblx0dGhpcy5fX2t0bWVzaCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5nZW9tZXRyeSA9IGdlb21ldHJ5O1xyXG5cdHRoaXMubWF0ZXJpYWwgPSBtYXRlcmlhbDtcclxuXHRcclxuXHR0aGlzLnBhcmVudCA9IG51bGw7XHJcblx0dGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnBvc2l0aW9uID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcblx0dGhpcy5yb3RhdGlvbiA9IG5ldyBWZWMzKDAsIDAsIDApO1xyXG5cdHRoaXMuc2NhbGUgPSBuZXcgVmVjMygxLCAxLCAxKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXNoO1xyXG5cclxuTWVzaC5wcm90b3R5cGUuZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXggPSBmdW5jdGlvbihjYW1lcmEpe1xyXG5cdHZhciBtYXRyaXggPSBNYXRyaXg0LmdldFRyYW5zZm9ybWF0aW9uKHRoaXMucG9zaXRpb24sIHRoaXMucm90YXRpb24sIHRoaXMuc2NhbGUpO1xyXG5cdFxyXG5cdHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudDtcclxuXHR3aGlsZSAocGFyZW50KXtcclxuXHRcdHZhciBtID0gTWF0cml4NC5nZXRUcmFuc2Zvcm1hdGlvbihwYXJlbnQucG9zaXRpb24sIHBhcmVudC5yb3RhdGlvbiwgcGFyZW50LnNjYWxlKTtcclxuXHRcdG1hdHJpeC5tdWx0aXBseShtKTtcclxuXHRcdHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XHJcblx0fVxyXG5cdFxyXG5cdHZhciBjYW1NYXQgPSBNYXRyaXg0LmdldFRyYW5zZm9ybWF0aW9uKGNhbWVyYS5wb3NpdGlvbiwgY2FtZXJhLnJvdGF0aW9uKTtcclxuXHRtYXRyaXgubXVsdGlwbHkoY2FtTWF0KTtcclxuXHRcclxuXHRyZXR1cm4gbWF0cml4O1xyXG59O1xyXG4iLCJ2YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG5cclxuZnVuY3Rpb24gU2NlbmUoKXtcclxuXHR0aGlzLl9fa3RzY2VuZSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5tZXNoZXMgPSBbXTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY2VuZTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihvYmplY3Qpe1xyXG5cdGlmIChvYmplY3QuX19rdG1lc2gpe1xyXG5cdFx0dGhpcy5tZXNoZXMucHVzaChvYmplY3QpO1xyXG5cdH1lbHNle1xyXG5cdFx0dGhyb3cgXCJDYW4ndCBhZGQgdGhlIG9iamVjdCB0byB0aGUgc2NlbmVcIjtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5TY2VuZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oY2FtZXJhKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHRnbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDEuMCk7XHJcblx0Z2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy5tZXNoZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgbWVzaCA9IHRoaXMubWVzaGVzW2ldO1xyXG5cdFx0aWYgKCFtZXNoLnZpc2libGUpIGNvbnRpbnVlO1xyXG5cdFx0aWYgKG1lc2gubWF0ZXJpYWwub3BhY2l0eSA9PSAwLjApIGNvbnRpbnVlO1xyXG5cdFx0XHJcblx0XHR2YXIgc2hhZGVyID0gbWVzaC5tYXRlcmlhbC5zaGFkZXI7XHJcblx0XHRpZiAoIXNoYWRlcil7XHJcblx0XHRcdGNvbnNvbGUuaW5mbyhcIk1hdGVyaWFsIGRvZXNuJ3QgaGF2ZSBhIHNoYWRlclwiKTtcclxuXHRcdFx0Y29udGludWU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuc2V0TWF0ZXJpYWxBdHRyaWJ1dGVzKG1lc2gubWF0ZXJpYWwpO1xyXG5cdFx0XHJcblx0XHRnbC51c2VQcm9ncmFtKHNoYWRlci5zaGFkZXJQcm9ncmFtKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5zZW5kQXR0cmliRGF0YShtZXNoLCBzaGFkZXIuYXR0cmlidXRlcywgY2FtZXJhKTtcclxuXHRcdHRoaXMuc2VuZFVuaWZvcm1EYXRhKG1lc2gsIHNoYWRlci51bmlmb3JtcywgY2FtZXJhKTtcclxuXHRcdFxyXG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbWVzaC5nZW9tZXRyeS5mYWNlc0J1ZmZlcik7XHJcblx0XHRnbC5kcmF3RWxlbWVudHMoZ2xbbWVzaC5tYXRlcmlhbC5kcmF3QXNdLCBtZXNoLmdlb21ldHJ5LmZhY2VzQnVmZmVyLm51bUl0ZW1zLCBnbC5VTlNJR05FRF9TSE9SVCwgMCk7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuU2NlbmUucHJvdG90eXBlLnNlbmRBdHRyaWJEYXRhID0gZnVuY3Rpb24obWVzaCwgYXR0cmlidXRlcywgY2FtZXJhKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHR2YXIgZ2VvbWV0cnkgPSBtZXNoLmdlb21ldHJ5O1xyXG5cdGZvciAodmFyIGk9MCxsZW49YXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBhdHQgPSBhdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4UG9zaXRpb25cIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleENvbG9yXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LmNvbG9yc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFUZXh0dXJlQ29vcmRcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS50ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5zZW5kVW5pZm9ybURhdGEgPSBmdW5jdGlvbihtZXNoLCB1bmlmb3JtcywgY2FtZXJhKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHR2YXIgZ2VvbWV0cnkgPSBtZXNoLmdlb21ldHJ5O1xyXG5cdGZvciAodmFyIGk9MCxsZW49dW5pZm9ybXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgdW5pID0gdW5pZm9ybXNbaV07XHJcblx0XHRcclxuXHRcdGlmICh1bmkubmFtZSA9PSAndVRyYW5zZm9ybWF0aW9uTWF0cml4Jyl7XHJcblx0XHRcdHZhciB0cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG1lc2guZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoY2FtZXJhKTtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdih1bmkubG9jYXRpb24sIGZhbHNlLCB0cmFuc2Zvcm1hdGlvbk1hdHJpeC50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVBlcnNwZWN0aXZlTWF0cml4Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgY2FtZXJhLnBlcnNwZWN0aXZlTWF0cml4KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1hdGVyaWFsQ29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gbWVzaC5tYXRlcmlhbC5jb2xvci5nZXRSR0JBKCk7XHJcblx0XHRcdGdsLnVuaWZvcm00ZnYodW5pLmxvY2F0aW9uLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9yKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlU2FtcGxlcicpe1xyXG5cdFx0XHRpZiAobWVzaC5tYXRlcmlhbC50ZXh0dXJlKXtcclxuXHRcdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwKTtcclxuXHRcdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBtZXNoLm1hdGVyaWFsLnRleHR1cmUudGV4dHVyZSk7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUhhc1RleHR1cmUnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKG1lc2gubWF0ZXJpYWwudGV4dHVyZSk/IDEgOiAwKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5TY2VuZS5wcm90b3R5cGUuc2V0TWF0ZXJpYWxBdHRyaWJ1dGVzID0gZnVuY3Rpb24obWF0ZXJpYWwpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdHZhciBjdWxsID0gXCJCQUNLXCI7XHJcblx0aWYgKG1hdGVyaWFsLmRyYXdGYWNlcyA9PSAnQkFDSycpeyBjdWxsID0gXCJGUk9OVFwiOyB9XHJcblx0ZWxzZSBpZiAobWF0ZXJpYWwuZHJhd0ZhY2VzID09ICdCT1RIJyl7IGN1bGwgPSBcIlwiOyB9XHJcblx0XHJcblx0aWYgKGN1bGwgIT0gXCJcIil7XHJcblx0XHRnbC5lbmFibGUoZ2wuQ1VMTF9GQUNFKTtcclxuXHRcdGdsLmN1bGxGYWNlKGdsW2N1bGxdKTtcclxuXHR9ZWxzZXtcclxuXHRcdGdsLmRpc2FibGUoZ2wuQ1VMTF9GQUNFKTtcclxuXHR9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGJhc2ljOiB7XHJcblx0XHRhdHRyaWJ1dGVzOiBbXHJcblx0XHRcdHtuYW1lOiAnYVZlcnRleFBvc2l0aW9uJywgdHlwZTogJ3YzJ30sXHJcblx0XHRcdHtuYW1lOiAnYVZlcnRleENvbG9yJywgdHlwZTogJ3Y0J30sXHJcblx0XHRcdHtuYW1lOiAnYVRleHR1cmVDb29yZCcsIHR5cGU6ICd2Mid9XHJcblx0XHRdLFxyXG5cdFx0dW5pZm9ybXM6IFtcclxuXHRcdFx0e25hbWU6ICd1VHJhbnNmb3JtYXRpb25NYXRyaXgnLCB0eXBlOiAnbTQnfSxcclxuXHRcdFx0e25hbWU6ICd1UGVyc3BlY3RpdmVNYXRyaXgnLCB0eXBlOiAnbTQnfSxcclxuXHRcdFx0e25hbWU6ICd1TWF0ZXJpYWxDb2xvcicsIHR5cGU6ICd2NCd9LFxyXG5cdFx0XHR7bmFtZTogJ3VUZXh0dXJlU2FtcGxlcicsIHR5cGU6ICd0ZXgnfSxcclxuXHRcdFx0e25hbWU6ICd1SGFzVGV4dHVyZScsIHR5cGU6ICdib29sJ31cclxuXHRcdF0sXHJcblx0XHR2ZXJ0ZXhTaGFkZXI6IFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleFBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjMiBhVGV4dHVyZUNvb3JkOyBcIiArICBcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWM0IGFWZXJ0ZXhDb2xvcjsgXCIgKyBcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdVRyYW5zZm9ybWF0aW9uTWF0cml4OyBcIiArIFxyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVQZXJzcGVjdGl2ZU1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCB2ZWM0IHVNYXRlcmlhbENvbG9yOyBcIiArICBcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdlZlcnRleENvbG9yOyBcIiArXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDtcIiArICBcclxuXHRcdFx0XHJcblx0XHRcdFwidm9pZCBtYWluKHZvaWQpeyBcIiArIFxyXG5cdFx0XHRcdFwiZ2xfUG9zaXRpb24gPSB1UGVyc3BlY3RpdmVNYXRyaXggKiB1VHJhbnNmb3JtYXRpb25NYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTsgXCIgK1xyXG5cdFx0XHRcdFwidlZlcnRleENvbG9yID0gYVZlcnRleENvbG9yICogdU1hdGVyaWFsQ29sb3I7IFwiICtcclxuXHRcdFx0XHRcInZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkOyBcIiArICBcclxuXHRcdFx0XCJ9IFwiICxcclxuXHRcdGZyYWdtZW50U2hhZGVyOiBcclxuXHRcdFx0XCJ1bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZVNhbXBsZXI7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGludCB1SGFzVGV4dHVyZTsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMiB2VGV4dHVyZUNvb3JkOyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZWZXJ0ZXhDb2xvcjsgXCIgKyBcclxuXHRcdFx0XHJcblx0XHRcdFwidm9pZCBtYWluKHZvaWQpeyBcIiArXHJcblx0XHRcdFx0XCJtZWRpdW1wIHZlYzQgY29sb3IgPSB2VmVydGV4Q29sb3I7IFwiICsgXHJcblx0XHRcdFx0XCJpZiAodUhhc1RleHR1cmUgPT0gMSl7IFwiICsgXHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjNCB0ZXhDb2xvciA9IHRleHR1cmUyRCh1VGV4dHVyZVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC5zLCB2VGV4dHVyZUNvb3JkLnQpKTsgXCIgK1xyXG5cdFx0XHRcdFx0XCJjb2xvciAqPSB0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwifSBcIiArIFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwiZ2xfRnJhZ0NvbG9yID0gY29sb3I7XCIgKyBcclxuXHRcdFx0XCJ9XCJcclxuXHR9XHJcbn07XHJcbiIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vS1RVdGlscycpO1xyXG5cclxuZnVuY3Rpb24gVGV4dHVyZShzcmMsIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0dGV4dHVyZSA9IHRydWU7XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMubWluRmlsdGVyID0gKHBhcmFtcy5taW5GaWx0ZXIpPyBwYXJhbXMubWluRmlsdGVyIDogJ0xJTkVBUic7XHJcblx0dGhpcy5tYWdGaWx0ZXIgPSAocGFyYW1zLm1hZ0ZpbHRlcik/IHBhcmFtcy5tYWdGaWx0ZXIgOiAnTElORUFSJztcclxuXHR0aGlzLndyYXBTID0gKHBhcmFtcy5TV3JhcHBpbmcpPyBwYXJhbXMuU1dyYXBwaW5nIDogJ1JFUEVBVCc7XHJcblx0dGhpcy53cmFwVCA9IChwYXJhbXMuVFdyYXBwaW5nKT8gcGFyYW1zLlRXcmFwcGluZyA6ICdSRVBFQVQnO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVlID0gbnVsbDtcclxuXHRcclxuXHR0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XHJcblx0dGhpcy5pbWFnZS5zcmMgPSBzcmM7XHJcblx0dGhpcy5pbWFnZS5yZWFkeSA9IGZhbHNlO1xyXG5cdFxyXG5cdHZhciBUID0gdGhpcztcclxuXHRVdGlscy5hZGRFdmVudCh0aGlzLmltYWdlLCBcImxvYWRcIiwgZnVuY3Rpb24oKXtcclxuXHRcdFQucGFyc2VUZXh0dXJlKCk7IFxyXG5cdH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHR1cmU7XHJcblxyXG5UZXh0dXJlLnByb3RvdHlwZS5wYXJzZVRleHR1cmUgPSBmdW5jdGlvbigpe1xyXG5cdGlmICh0aGlzLmltYWdlLnJlYWR5KSByZXR1cm47XHJcblx0XHJcblx0dGhpcy5pbWFnZS5yZWFkeSA9IHRydWU7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0XHJcblx0dGhpcy50ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG5cdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSk7XHJcblx0XHJcblx0Z2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX0ZMSVBfWV9XRUJHTCwgdHJ1ZSk7XHJcblx0XHJcblx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCB0aGlzLmltYWdlKTtcclxuXHRcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2xbdGhpcy5tYWdGaWx0ZXJdKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2xbdGhpcy5taW5GaWx0ZXJdKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbFt0aGlzLndyYXBTXSk7XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2xbdGhpcy53cmFwVF0pO1xyXG5cdFxyXG5cdGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xyXG5cdFxyXG5cdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRnZXQ6IGZ1bmN0aW9uKGVsZW1lbnQpe1xyXG5cdFx0aWYgKGVsZW1lbnQuY2hhckF0KDApID09IFwiI1wiKXtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQucmVwbGFjZShcIiNcIiwgXCJcIikpO1xyXG5cdFx0fWVsc2UgaWYgKGVsZW1lbnQuY2hhckF0KDApID09IFwiLlwiKXtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoZWxlbWVudC5yZXBsYWNlKFwiLlwiLCBcIlwiKSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKGVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0YWRkRXZlbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIHR5cGUsIGNhbGxiYWNrKXtcclxuXHRcdGlmIChlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIpe1xyXG5cdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIGZhbHNlKTtcclxuXHRcdH1lbHNlIGlmIChlbGVtZW50LmF0dGFjaEV2ZW50KXtcclxuXHRcdFx0ZWxlbWVudC5hdHRhY2hFdmVudChcIm9uXCIgKyB0eXBlLCBjYWxsYmFjayk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG4iLCJmdW5jdGlvbiBWZWN0b3IyKHgsIHkpe1xyXG5cdHRoaXMuX19rdHYyID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnggPSB4O1xyXG5cdHRoaXMueSA9IHk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZlY3RvcjI7XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55KTtcclxuXHRcclxuXHRyZXR1cm4gbGVuZ3RoO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGgoKTtcclxuXHRcclxuXHR0aGlzLnggLz0gbGVuZ3RoO1xyXG5cdHRoaXMueSAvPSBsZW5ndGg7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbih2ZWN0b3IyKXtcclxuXHRpZiAoIXZlY3RvcjIuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IHBlcmZvcm0gYSBkb3QgcHJvZHVjdCB3aXRoIGEgdmVjdG9yMlwiO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzLnggKiB2ZWN0b3IyLnggKyB0aGlzLnkgKiB2ZWN0b3IyLnk7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24obnVtYmVyKXtcclxuXHR0aGlzLnggKj0gbnVtYmVyO1xyXG5cdHRoaXMueSAqPSBudW1iZXI7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbih2ZWN0b3IyKXtcclxuXHRpZiAoIXZlY3RvcjIuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGFkZCBhIHZlY3RvcjIgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHR0aGlzLnggKz0gdmVjdG9yMi54O1xyXG5cdHRoaXMueSArPSB2ZWN0b3IyLnk7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24odmVjdG9yMil7XHJcblx0aWYgKCF2ZWN0b3IyLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgdmVjdG9yMiB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCA9IHZlY3RvcjIueDtcclxuXHR0aGlzLnkgPSB2ZWN0b3IyLnk7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbih4LCB5KXtcclxuXHR0aGlzLnggPSB4O1xyXG5cdHRoaXMueSA9IHk7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCwgdGhpcy55KTtcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKHZlY3RvcjIpe1xyXG5cdGlmICghdmVjdG9yMi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIHZlY3RvcjIgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHRyZXR1cm4gKHRoaXMueCA9PSB2ZWN0b3IyLnggJiYgdGhpcy55ID09IHZlY3RvcjIueSk7XHJcbn07XHJcblxyXG5WZWN0b3IyLnZlY3RvcnNEaWZmZXJlbmNlID0gZnVuY3Rpb24odmVjdG9yMl9hLCB2ZWN0b3IyX2Ipe1xyXG5cdGlmICghdmVjdG9yMl9hLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBjcmVhdGUgdGhpcyB2ZWN0b3IgdXNpbmcgMiB2ZWN0b3JzMlwiO1xyXG5cdGlmICghdmVjdG9yMl9iLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBjcmVhdGUgdGhpcyB2ZWN0b3IgdXNpbmcgMiB2ZWN0b3JzMlwiO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMih2ZWN0b3IyX2EueCAtIHZlY3RvcjJfYi54LCB2ZWN0b3IyX2EueSAtIHZlY3RvcjJfYi55KTtcclxufTtcclxuXHJcblZlY3RvcjIuZnJvbUFuZ2xlID0gZnVuY3Rpb24ocmFkaWFuKXtcclxuXHR2YXIgeCA9IE1hdGguY29zKHJhZGlhbik7XHJcblx0dmFyIHkgPSAtTWF0aC5zaW4ocmFkaWFuKTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjIoeCwgeSk7XHJcbn07XHJcbiIsImZ1bmN0aW9uIFZlY3RvcjMoeCwgeSwgeil7XHJcblx0dGhpcy5fX2t0djMgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxuXHR0aGlzLnogPSB6O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBWZWN0b3IzO1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSArIHRoaXMueiAqIHRoaXMueik7XHJcblx0XHJcblx0cmV0dXJuIGxlbmd0aDtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoKCk7XHJcblx0XHJcblx0dGhpcy54IC89IGxlbmd0aDtcclxuXHR0aGlzLnkgLz0gbGVuZ3RoO1xyXG5cdHRoaXMueiAvPSBsZW5ndGg7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IHBlcmZvcm0gYSBkb3QgcHJvZHVjdCB3aXRoIGEgdmVjdG9yM1wiO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzLnggKiB2ZWN0b3IzLnggKyB0aGlzLnkgKiB2ZWN0b3IzLnkgKyB0aGlzLnogKiB2ZWN0b3IzLno7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5jcm9zcyA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgcGVyZm9ybSBhIGNyb3NzIHByb2R1Y3Qgd2l0aCBhIHZlY3RvcjNcIjtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjMoXHJcblx0XHR0aGlzLnkgKiB2ZWN0b3IzLnogLSB0aGlzLnogKiB2ZWN0b3IzLnksXHJcblx0XHR0aGlzLnogKiB2ZWN0b3IzLnggLSB0aGlzLnggKiB2ZWN0b3IzLnosXHJcblx0XHR0aGlzLnggKiB2ZWN0b3IzLnkgLSB0aGlzLnkgKiB2ZWN0b3IzLnhcclxuXHQpO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuaW52ZXJ0ID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gdGhpcy5tdWx0aXBseSgtMSk7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uKG51bWJlcil7XHJcblx0dGhpcy54ICo9IG51bWJlcjtcclxuXHR0aGlzLnkgKj0gbnVtYmVyO1xyXG5cdHRoaXMueiAqPSBudW1iZXI7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IGFkZCBhIFZlY3RvcjMgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHR0aGlzLnggKz0gdmVjdG9yMy54O1xyXG5cdHRoaXMueSArPSB2ZWN0b3IzLnk7XHJcblx0dGhpcy56ICs9IHZlY3RvcjMuejtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSBWZWN0b3IzIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ID0gdmVjdG9yMy54O1xyXG5cdHRoaXMueSA9IHZlY3RvcjMueTtcclxuXHR0aGlzLnogPSB2ZWN0b3IzLno7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbih4LCB5LCB6KXtcclxuXHR0aGlzLnggPSB4O1xyXG5cdHRoaXMueSA9IHk7XHJcblx0dGhpcy56ID0gejtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjModGhpcy54LCB0aGlzLnksIHRoaXMueik7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSBWZWN0b3IzIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0cmV0dXJuICh0aGlzLnggPT0gdmVjdG9yMy54ICYmIHRoaXMueSA9PSB2ZWN0b3IzLnkgJiYgdGhpcy56ID09IHZlY3RvcjMueik7XHJcbn07XHJcblxyXG5WZWN0b3IzLnZlY3RvcnNEaWZmZXJlbmNlID0gZnVuY3Rpb24odmVjdG9yM19hLCB2ZWN0b3IzX2Ipe1xyXG5cdGlmICghdmVjdG9yM19hLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBjcmVhdGUgdGhpcyB2ZWN0b3IgdXNpbmcgMiB2ZWN0b3JzM1wiO1xyXG5cdGlmICghdmVjdG9yM19iLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBjcmVhdGUgdGhpcyB2ZWN0b3IgdXNpbmcgMiB2ZWN0b3JzM1wiO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMyh2ZWN0b3IzX2EueCAtIHZlY3RvcjNfYi54LCB2ZWN0b3IzX2EueSAtIHZlY3RvcjNfYi55LCB2ZWN0b3IzX2EueiAtIHZlY3RvcjNfYi56KTtcclxufTtcclxuXHJcblZlY3RvcjMuZnJvbUFuZ2xlID0gZnVuY3Rpb24ocmFkaWFuX3h6LCByYWRpYW5feSl7XHJcblx0dmFyIHggPSBNYXRoLmNvcyhyYWRpYW5feHopO1xyXG5cdHZhciB5ID0gTWF0aC5zaW4ocmFkaWFuX3kpO1xyXG5cdHZhciB6ID0gLU1hdGguc2luKHJhZGlhbl94eik7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IzKHgsIHksIHopO1xyXG59O1xyXG4iLCJ2YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG5LVC5DYW1lcmFQZXJzcGVjdGl2ZSA9IHJlcXVpcmUoJy4vS1RDYW1lcmFQZXJzcGVjdGl2ZScpO1xyXG5LVC5Db2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG5LVC5HZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG5LVC5HZW9tZXRyeUJveCA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeUJveCcpO1xyXG5LVC5NYXRlcmlhbCA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbCcpO1xyXG5LVC5NYXRlcmlhbEJhc2ljID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsQmFzaWMnKTtcclxuS1QuTWF0aCA9IHJlcXVpcmUoJy4vS1RNYXRoJyk7XHJcbktULk1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG5LVC5NZXNoID0gcmVxdWlyZSgnLi9LVE1lc2gnKTtcclxuS1QuVGV4dHVyZSA9IHJlcXVpcmUoJy4vS1RUZXh0dXJlJyk7XHJcbktULlV0aWxzID0gcmVxdWlyZSgnLi9LVFV0aWxzJyk7XHJcbktULlZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG5LVC5WZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxuS1QuU2NlbmUgPSByZXF1aXJlKCcuL0tUU2NlbmUnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS1Q7Iiwid2luZG93LktUID0gcmVxdWlyZSgnLi9LcmFtVGVjaCcpOyJdfQ==
