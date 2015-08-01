(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Input = require('./KTInput');
var KTMath = require('./KTMath');
var Vector2 = require('./KTVector2');
var Vector3 = require('./KTVector3');

function FlyCamera(){
	this.__ktCamCtrls = true;
	
	this.camera = null;
	this.target = new Vector3(0.0, 0.0, 0.0);
	this.angle = new Vector2(0.0, 0.0);
	this.speed = 0.5;
	this.lastDrag = null;
	this.sensitivity = new Vector2(0.5, 0.5);
	this.onlyOnLock = true;
	this.maxAngle = KTMath.degToRad(75);
}

module.exports =  FlyCamera;

FlyCamera.prototype.keyboardControls = function(){
	var cam = this.camera;
	var moved = false;
	
	if (Input.isKeyDown(Input.vKey.W)){
		cam.position.x += Math.cos(this.angle.x) * this.speed;
		cam.position.y += Math.sin(this.angle.y) * this.speed;
		cam.position.z -= Math.sin(this.angle.x) * this.speed;
		
		moved = true;
	}else if (Input.isKeyDown(Input.vKey.S)){
		cam.position.x -= Math.cos(this.angle.x) * this.speed;
		cam.position.y -= Math.sin(this.angle.y) * this.speed;
		cam.position.z += Math.sin(this.angle.x) * this.speed;
		
		moved = true;
	}
	
	if (Input.isKeyDown(Input.vKey.A)){
		cam.position.x += Math.cos(this.angle.x + KTMath.PI_2) * this.speed;
		cam.position.z -= Math.sin(this.angle.x + KTMath.PI_2) * this.speed;
		
		moved = true;
	}else if (Input.isKeyDown(Input.vKey.D)){
		cam.position.x -= Math.cos(this.angle.x + KTMath.PI_2) * this.speed;
		cam.position.z += Math.sin(this.angle.x + KTMath.PI_2) * this.speed;
		
		moved = true;
	}
	
	return moved;
};

FlyCamera.prototype.mouseControls = function(){
	if (this.onlyOnLock && !Input.mouseLocked){ 
		this.lastDrag = null;
		return;
	}
	
	var moved = false;
	
	if (this.lastDrag == null) this.lastDrag = Input._mouse.position.clone();
	
	var dx = Input._mouse.position.x - this.lastDrag.x;
	var dy = Input._mouse.position.y - this.lastDrag.y;
	
	if (dx != 0.0 || dy != 0.0){
		this.angle.x -= KTMath.degToRad(dx * this.sensitivity.x);
		this.angle.y -= KTMath.degToRad(dy * this.sensitivity.y);
		
		if (this.angle.y < -this.maxAngle) this.angle.y = -this.maxAngle;
		if (this.angle.y > this.maxAngle) this.angle.y = this.maxAngle;
		
		moved = true;
	}
	
	this.lastDrag.copy(Input._mouse.position);
	
	return moved;
};

FlyCamera.prototype.update = function(){
	if (this.camera.locked) return;
	
	var mK = this.keyboardControls();
	var mM = this.mouseControls();
	
	if (mK || mM){
		this.setCameraPosition();
	}
};

FlyCamera.prototype.setCameraPosition = function(){
	var cam = this.camera;
	
	var x = cam.position.x + Math.cos(this.angle.x);
	var y = cam.position.y + Math.sin(this.angle.y);
	var z = cam.position.z - Math.sin(this.angle.x);
	
	this.target.set(x, y, z);
	this.camera.lookAt(this.target);
};

FlyCamera.prototype.setCamera = function(camera){
	this.camera = camera;
	
	var zoom = Vector3.vectorsDifference(camera.position, this.target).length();
	
	this.angle.x = (-KTMath.get2DAngle(this.target.x, this.target.z, camera.position.x, camera.position.z) + KTMath.PI2) % KTMath.PI2;
	this.angle.y = (-KTMath.get2DAngle(0, camera.position.y, zoom, this.target.y));
	
	this.setCameraPosition();
};

},{"./KTInput":16,"./KTMath":25,"./KTVector2":39,"./KTVector3":40}],2:[function(require,module,exports){
var Matrix4 = require('./KTMatrix4');
var Color = require('./KTColor');
var Vector3 = require('./KTVector3');
var KTMath = require('./KTMath');

function CameraOrtho(width, height, znear, zfar){
	this.__ktcamera = true;
	
	this.position = new Vector3(0.0, 0.0, 0.0);
	this.upVector = new Vector3(0.0, 1.0, 0.0);
	this.lookAt(new Vector3(0.0, 0.0, -1.0));
	this.locked = false;
	
	this.width = width;
	this.height = height;
	this.znear = znear;
	this.zfar = zfar;
	
	this.controls = null;
	
	this.setOrtho();
}

module.exports = CameraOrtho;

CameraOrtho.prototype.setOrtho = function(){
	var C = 2.0 / this.width;
	var R = 2.0 / this.height;
	var A = -2.0 / (this.zfar - this.znear);
	var B = -(this.zfar + this.znear) / (this.zfar - this.znear);
	
	this.perspectiveMatrix = new Matrix4(
		C, 0, 0, 0,
		0, R, 0, 0,
		0, 0, A, B,
		0, 0, 0, 1
	);
};

CameraOrtho.prototype.lookAt = function(vector3){
	if (!vector3.__ktv3) throw "Can only look to a vector3";
	
	var forward = Vector3.vectorsDifference(this.position, vector3).normalize();
	var left = this.upVector.cross(forward).normalize();
	var up = forward.cross(left).normalize();
	
	var x = -left.dot(this.position);
	var y = -up.dot(this.position);
	var z = -forward.dot(this.position);
	
	this.transformationMatrix = new Matrix4(
		left.x, left.y, left.z, x,
		up.x, up.y, up.z, y,
		forward.x, forward.y, forward.z, z,
		0, 0, 0, 1
	);
	
	return this;
};

CameraOrtho.prototype.setControls = function(cameraControls){
	if (!cameraControls.__ktCamCtrls) throw "Is not a valid camera controls object";
	
	var zoom = Vector3.vectorsDifference(this.position, cameraControls.target).length();
	
	this.controls = cameraControls;
	
	cameraControls.camera = this;
	cameraControls.zoom = zoom;
	cameraControls.angle.x = KTMath.get2DAngle(cameraControls.target.x, cameraControls.target.z,this.position.x, this.position.z);
	cameraControls.angle.y = KTMath.get2DAngle(0, this.position.y, zoom, cameraControls.target.y);
	
	cameraControls.setCameraPosition();
	
	return this;
};

},{"./KTColor":5,"./KTMath":25,"./KTMatrix4":27,"./KTVector3":40}],3:[function(require,module,exports){
var Matrix4 = require('./KTMatrix4');
var Color = require('./KTColor');
var Vector3 = require('./KTVector3');
var KTMath = require('./KTMath');
var GeometrySkybox = require('./KTGeometrySkybox');

function CameraPerspective(fov, ratio, znear, zfar){
	this.__ktcamera = true;
	
	this.position = new Vector3(0.0, 0.0, 0.0);
	this.upVector = new Vector3(0.0, 1.0, 0.0);
	this.lookAt(new Vector3(0.0, 0.0, -1.0));
	this.locked = false;
	
	this.fov = fov;
	this.ratio = ratio;
	this.znear = znear;
	this.zfar = zfar;
	
	this.controls = null;
	
	this.skybox = null;
	
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

CameraPerspective.prototype.setSkybox = function(texture){
	this.skybox = new GeometrySkybox(this.position, texture);
};

CameraPerspective.prototype.lookAt = function(vector3){
	if (!vector3.__ktv3) throw "Can only look to a vector3";
	
	var forward = Vector3.vectorsDifference(this.position, vector3).normalize();
	var left = this.upVector.cross(forward).normalize();
	var up = forward.cross(left).normalize();
	
	var x = -left.dot(this.position);
	var y = -up.dot(this.position);
	var z = -forward.dot(this.position);
	
	this.transformationMatrix = new Matrix4(
		left.x, left.y, left.z, x,
		up.x, up.y, up.z, y,
		forward.x, forward.y, forward.z, z,
		0, 0, 0, 1
	);
	
	return this;
};

CameraPerspective.prototype.setControls = function(cameraControls){
	if (!cameraControls.__ktCamCtrls) throw "Is not a valid camera controls object";
	
	this.controls = cameraControls;
	cameraControls.setCamera(this);
	
	return this;
};

},{"./KTColor":5,"./KTGeometrySkybox":13,"./KTMath":25,"./KTMatrix4":27,"./KTVector3":40}],4:[function(require,module,exports){
var Utils = require('./KTUtils');

function Clock(){
	this.lastF = Date.now();
	this.currentF = this.lastF;
	
	this.startF = this.lastF;
	this.frames = 0;
	
	this.fps = 0;
	this.delta = 0;
	
	var T = this;
	Utils.addEvent(window, "focus", function(){
		T.reset();
	});
}

module.exports = Clock;

Clock.prototype.update = function(fps){
	this.lastF = this.currentF - (this.delta % fps);
	
	this.fps = Math.floor(1000 * (++this.frames / (this.currentF - this.startF)));
};

Clock.prototype.getDelta = function(){
	this.currentF = Date.now();
	this.delta = this.currentF - this.lastF;
	
	return this.delta;
};

Clock.prototype.reset = function(){
	this.startF = Date.now();
	this.frames = 0;
};

},{"./KTUtils":38}],5:[function(require,module,exports){
function Color(hexColor){
	var str = hexColor.substring(1);
	
	if (str.length == 6) str += "FF";
	var r = parseInt(str.substring(0, 2), 16);
	var g = parseInt(str.substring(2, 4), 16);
	var b = parseInt(str.substring(4, 6), 16);
	var a = parseInt(str.substring(6, 8), 16);
	
	this.color = [r / 255, g / 255, b / 255, a / 255];
}

module.exports = Color;

Color.prototype.set = function(hexColor){
	var str = hexColor.substring(1);
	
	if (str.length == 6) str += "FF";
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
},{}],6:[function(require,module,exports){
var KT = require('./KTMain');
var Color = require('./KTColor');
var Matrix4 = require('./KTMatrix4');
var Vector2 = require('./KTVector2');
var Vector3 = require('./KTVector3');
var Vector4 = require('./KTVector4');

function Geometry(){
	this.__ktgeometry = true;
	
	this.clear();
	this.uvRegion = new Vector4(0.0, 0.0, 1.0, 1.0);
	this.boundingBox = null;
	this.boundingSphere = null;
	this.boundingCylinder = null;
}

module.exports = Geometry;

Geometry.prototype.clear = function(){
	this.vertices = [];
	this.triangles = [];
	this.uvCoords = [];
	this.colors = [];
	this.normals = [];
	
	this.vertexBuffer = null;
	this.texBuffer = null;
	this.facesBuffer = null;
	this.colorsBuffer = null;
	this.normalsBuffer = null;
	
	this.boundingBox = null;
	this.boundingSphere = null;
	this.boundingCylinder = null;
	
	this.ready = false;
};

Geometry.prototype.addVertice = function(x, y, z, color, tx, ty){
	if (!color) color = Color._WHITE;
	if (!tx) tx = 0;
	if (!ty) ty = 0;
	
	var ind = this.vertices.length;
	this.vertices.push(new Vector3(x, y, z));
	this.colors.push(new Color(color));
	this.uvCoords.push(new Vector2(tx, ty));
	
	return ind;
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
	this.ready = true;
	
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

Geometry.prototype.computeBoundingBox = function(){
	var x1, x2, y1, y2, z1, z2;
	
	for (var i=0,len=this.vertices.length;i<len;i++){
		var v = this.vertices[i];
		
		if (i == 0){
			x1 = v.x; y1 = v.y; z1 = v.z;
			x2 = v.x; y2 = v.y; z2 = v.z;
		}else{
			x1 = Math.min(x1, v.x);
			y1 = Math.min(y1, v.y);
			z1 = Math.min(z1, v.z);
			x2 = Math.max(x2, v.x);
			y2 = Math.max(y2, v.y);
			z2 = Math.max(z2, v.z);
		}
	}
	
	this.boundingBox = {
		x1: x1,
		y1: y1,
		z1: z1,
		x2: x2,
		y2: y2,
		z2: z2,
	}; 
	
	return this;
};

Geometry.prototype.computeBoundingSphere = function(){
	var max;
	
	for (var i=0,vert;vert=this.vertices[i];i++){
		var length = vert.length();
		
		max = (i==0)? length : Math.max(max, length);
	}
	
	this.boundingSphere = {
		radius: max
	};
	
	return this;
};

Geometry.prototype.computeBoundingCylinder = function(){
	var rad, ymax, ymin;
	
	for (var i=0,vert;vert=this.vertices[i];i++){
		var vert2d = vert.clone();
		vert2d.y = 0;
		
		var length = vert2d.length();
		
		rad = (i==0)? length : Math.max(rad, length);
		ymax = (i==0)? vert.y : Math.max(ymax, vert.y);
		ymin = (i==0)? vert.y : Math.min(ymin, vert.y);
	}
	
	this.boundingCylinder = {
		radius: rad,
		y1: ymin,
		y2: ymax
	};
	
	return this;
};

},{"./KTColor":5,"./KTMain":20,"./KTMatrix4":27,"./KTVector2":39,"./KTVector3":40,"./KTVector4":41}],7:[function(require,module,exports){
var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Utils = require('./KTUtils');
var Vector2 = require('./KTVector2');
var Vector3 = require('./KTVector3');
var Vector4 = require('./KTVector4');

function Geometry3DModel(fileURL){
	this.__ktgeometry = true;
	
	this.fileURL = fileURL;
	this.ready = false;
	this.uvRegion = new Vector4(0.0, 0.0, 1.0, 1.0);
	
	var T = this;
	Utils.getFileContent(fileURL, function(file){
		T.ready = true;
		T.parseFile(file);
	});
}

module.exports = Geometry3DModel;

Geometry3DModel.prototype.parseFile = function(file){
	var lines = file.split('\r\n');
	var vertexMin = [];
	var uvCoordMin = [];
	var normalMin = [];
	var indMin = [];
	var geometry = new Geometry();
	
	for (var i=0,len=lines.length;i<len;i++){
		var l = lines[i].trim();
		l = l.replace('  ', ' ');
		var ind = l.charAt(0);
		
		var p = l.split(' ');
		p.splice(0,1);
		
		if (ind == '#') continue;
		else if (ind == 'g') continue;
		else if (l == '') continue;
		
		if (l.indexOf('v ') == 0){
			vertexMin.push( new Vector3(
				parseFloat(p[0]),
				parseFloat(p[1]),
				parseFloat(p[2])
			));
		}else if (l.indexOf('vn ') == 0){
			normalMin.push( new Vector3(
				parseFloat(p[0]),
				parseFloat(p[1]),
				parseFloat(p[2])
			));
		}else if (l.indexOf('vt ') == 0){
			uvCoordMin.push( new Vector2(
				parseFloat(p[0]),
				parseFloat(p[1])
			));
		}else if (l.indexOf('f ') == 0){
			indMin.push( new Vector3(
				p[0],
				p[1],
				p[2]
			));
		}
	}
	
	for (var i=0,len=indMin.length;i<len;i++){
		var ind = indMin[i];
		var vertexInfo1 = ind.x.split('/');
		var vertexInfo2 = ind.y.split('/');
		var vertexInfo3 = ind.z.split('/');
		
		var v1 = vertexMin[parseInt(vertexInfo1[0]) - 1];
		var t1 = uvCoordMin[parseInt(vertexInfo1[1]) - 1];
		var n1 = normalMin[parseInt(vertexInfo1[2]) - 1];
		
		var v2 = vertexMin[parseInt(vertexInfo2[0]) - 1];
		var t2 = uvCoordMin[parseInt(vertexInfo2[1]) - 1];
		var n2 = normalMin[parseInt(vertexInfo2[2]) - 1];
		
		var v3 = vertexMin[parseInt(vertexInfo3[0]) - 1];
		var t3 = uvCoordMin[parseInt(vertexInfo3[1]) - 1];
		var n3 = normalMin[parseInt(vertexInfo3[2]) - 1];
		
		var i1 = geometry.addVertice(v1.x, v1.y, v1.z, Color._WHITE, t1.x, t1.y);
		var i2 = geometry.addVertice(v2.x, v2.y, v2.z, Color._WHITE, t2.x, t2.y);
		var i3 = geometry.addVertice(v3.x, v3.y, v3.z, Color._WHITE, t3.x, t3.y);
		
		geometry.addNormal(n1.x, n1.y, n1.z);
		geometry.addNormal(n2.x, n2.y, n2.z);
		geometry.addNormal(n3.x, n3.y, n3.z);
		
		geometry.addFace(i1, i2, i3);
	}
	
	geometry.build();
	
	this.vertexBuffer = geometry.vertexBuffer;
	this.texBuffer = geometry.texBuffer;
	this.facesBuffer = geometry.facesBuffer;
	this.colorsBuffer = geometry.colorsBuffer;
	this.normalsBuffer = geometry.normalsBuffer;
};

},{"./KTColor":5,"./KTGeometry":6,"./KTUtils":38,"./KTVector2":39,"./KTVector3":40,"./KTVector4":41}],8:[function(require,module,exports){
var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Vector4 = require('./KTVector4');

function GeometryBillboard(width, height, params){
	this.__ktgeometry = true;
	this.ready = true;
	
	var billGeo = new Geometry();
	
	var w = width / 2;
	var h = height / 2;
	
	if (!params) params = {};
	this.params = params;
	
	this.uvRegion = (params.uvRegion)? params.uvRegion : new Vector4(0.0, 0.0, 1.0, 1.0);
	this.colorTop = (params.colorTop)? params.colorTop : Color._WHITE;
	this.colorBottom = (params.colorBottom)? params.colorBottom : Color._WHITE;
	this.spherical = (params.spherical !== undefined)? params.spherical : true;
	
	var xr = this.uvRegion.x;
	var yr = this.uvRegion.y;
	var hr = this.uvRegion.z;
	var vr = this.uvRegion.w;
	
	billGeo.addVertice( w, -h,  0, this.colorBottom, hr, yr);
	billGeo.addVertice(-w,  h,  0, this.colorTop, xr, vr);
	billGeo.addVertice(-w, -h,  0, this.colorBottom, xr, yr);
	billGeo.addVertice( w,  h,  0, this.colorTop, hr, vr);
	
	billGeo.addFace(0, 1, 2);
	billGeo.addFace(0, 3, 1);
	
	billGeo.computeFacesNormals();
	billGeo.build();
	
	this.vertexBuffer = billGeo.vertexBuffer;
	this.texBuffer = billGeo.texBuffer;
	this.facesBuffer = billGeo.facesBuffer;
	this.colorsBuffer = billGeo.colorsBuffer;
	this.normalsBuffer = billGeo.normalsBuffer;
}

module.exports = GeometryBillboard;
},{"./KTColor":5,"./KTGeometry":6,"./KTVector4":41}],9:[function(require,module,exports){
var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Vector4 = require('./KTVector4');

function GeometryBox(width, length, height, params){
	this.__ktgeometry = true;
	this.ready = true;
	
	var boxGeo = new Geometry();
	
	var w = width / 2;
	var l = length / 2;
	var h = height / 2;
	
	if (!params) params = {};
	this.params = params;
	
	this.uvRegion = (params.uvRegion)? params.uvRegion : new Vector4(0.0, 0.0, 1.0, 1.0);
	this.colorTop = (params.colorTop)? params.colorTop : Color._WHITE;
	this.colorBottom = (params.colorBottom)? params.colorBottom : Color._WHITE;
	
	var xr = this.uvRegion.x;
	var yr = this.uvRegion.y;
	var hr = this.uvRegion.z;
	var vr = this.uvRegion.w;
	
	boxGeo.addVertice( w, -h,  l, this.colorBottom, hr, yr);
	boxGeo.addVertice(-w,  h,  l, this.colorTop, xr, vr);
	boxGeo.addVertice(-w, -h,  l, this.colorBottom, xr, yr);
	boxGeo.addVertice( w,  h,  l, this.colorTop, hr, vr);
	
	boxGeo.addVertice(-w, -h, -l, this.colorBottom, xr, yr);
	boxGeo.addVertice(-w,  h, -l, this.colorTop, xr, vr);
	boxGeo.addVertice( w, -h, -l, this.colorBottom, hr, yr);
	boxGeo.addVertice( w,  h, -l, this.colorTop, hr, vr);
	
	boxGeo.addVertice( w, -h, -l, this.colorBottom, hr, yr);
	boxGeo.addVertice( w,  h,  l, this.colorTop, xr, vr);
	boxGeo.addVertice( w, -h,  l, this.colorBottom, xr, yr);
	boxGeo.addVertice( w,  h, -l, this.colorTop, hr, vr);
	
	boxGeo.addVertice(-w, -h,  l, this.colorBottom, hr, yr);
	boxGeo.addVertice(-w,  h,  l, this.colorTop, hr, vr);
	boxGeo.addVertice(-w, -h, -l, this.colorBottom, xr, yr);
	boxGeo.addVertice(-w,  h, -l, this.colorTop, xr, vr);
	
	boxGeo.addVertice( w,  h,  l, this.colorTop, hr, yr);
	boxGeo.addVertice(-w,  h, -l, this.colorTop, xr, vr);
	boxGeo.addVertice(-w,  h,  l, this.colorTop, xr, yr);
	boxGeo.addVertice( w,  h, -l, this.colorTop, hr, vr);
	
	boxGeo.addVertice(-w, -h,  l, this.colorBottom, xr, vr);
	boxGeo.addVertice(-w, -h, -l, this.colorBottom, xr, yr);
	boxGeo.addVertice( w, -h,  l, this.colorBottom, hr, vr);
	boxGeo.addVertice( w, -h, -l, this.colorBottom, hr, yr);
	
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
	boxGeo.computeBoundingBox();
	boxGeo.build();
	
	this.vertexBuffer = boxGeo.vertexBuffer;
	this.texBuffer = boxGeo.texBuffer;
	this.facesBuffer = boxGeo.facesBuffer;
	this.colorsBuffer = boxGeo.colorsBuffer;
	this.normalsBuffer = boxGeo.normalsBuffer;
	this.boundingBox = boxGeo.boundingBox;
}

module.exports = GeometryBox;
},{"./KTColor":5,"./KTGeometry":6,"./KTVector4":41}],10:[function(require,module,exports){
var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Vector4 = require('./KTVector4');
var KTMath = require('./KTMath');

function GeometryCylinder(radiusTop, radiusBottom, height, widthSegments, heightSegments, openTop, openBottom, params){
	this.__ktgeometry = true;
	this.ready = true;
	
	var cylGeo = new Geometry();
	
	if (!params) params = {};
	this.params = params;
	
	this.uvRegion = (params.uvRegion)? params.uvRegion : new Vector4(0.0, 0.0, 1.0, 1.0);
	
	var xr = this.uvRegion.x;
	var yr = this.uvRegion.y;
	var hr = this.uvRegion.z - xr;
	var vr = this.uvRegion.w - yr;
	
	var h = height / 2;
	
	var bandW = KTMath.PI2 / (widthSegments - 1);
	
	for (var i=0;i<widthSegments;i++){
		var x1 = Math.cos(bandW * i);
		var y1 = -h;
		var z1 = -Math.sin(bandW * i);
		var x2 = Math.cos(bandW * i);
		var y2 = h;
		var z2 = -Math.sin(bandW * i);
		
		var xt = i / (widthSegments - 1);
		
		cylGeo.addNormal(x1, 0, z1);
		cylGeo.addNormal(x2, 0, z2);
		
		x1 *= radiusBottom;
		z1 *= radiusBottom;
		x2 *= radiusTop;
		z2 *= radiusTop;
		
		cylGeo.addVertice( x1, y1, z1, Color._WHITE, xr + (xt * hr), yr);
		cylGeo.addVertice( x2, y2, z2, Color._WHITE, xr + (xt * hr), yr + vr);
	}
	
	for (var i=0;i<widthSegments*2 - 2;i+=2){
		var i1 = i;
		var i2 = i+1;
		var i3 = i+2;
		var i4 = i+3;
		
		cylGeo.addFace(i3, i2, i1);
		cylGeo.addFace(i3, i4, i2);
	}
	
	if (!openTop || !openBottom){
		var i1 = cylGeo.addVertice( 0, h, 0, Color._WHITE, xr + (0.5 * hr), yr + (0.5 * vr));
		var i2 = cylGeo.addVertice( 0, -h, 0, Color._WHITE, xr + (0.5 * hr), yr + (0.5 * vr));
		cylGeo.addNormal(0,  1, 0);
		cylGeo.addNormal(0, -1, 0);
		for (var i=0;i<widthSegments*2 - 2;i+=2){
			var v1 = cylGeo.vertices[i + 1];
			var v2 = cylGeo.vertices[i + 3];
			
			var tx1 = xr + (v1.x / 2 + 0.5) * hr;
			var ty1 = yr + (v1.z / 2 + 0.5) * vr;
			var tx2 = xr + (v2.x / 2 + 0.5) * hr;
			var ty2 = yr + (v2.z / 2 + 0.5) * vr;
			
			if (!openTop){
				var i3 = cylGeo.addVertice( v1.x, h, v1.z, Color._WHITE, tx1, ty1);
				var i4 = cylGeo.addVertice( v2.x, h, v2.z, Color._WHITE, tx2, ty2);
				
				cylGeo.addNormal(0, 1, 0);
				cylGeo.addNormal(0, 1, 0);
				
				cylGeo.addFace(i4, i1, i3);
			}
			
			if (!openBottom){
				var i3 = cylGeo.addVertice( v1.x, -h, v1.z, Color._WHITE, tx1, ty1);
				var i4 = cylGeo.addVertice( v2.x, -h, v2.z, Color._WHITE, tx2, ty2);
				
				cylGeo.addNormal(0, -1, 0);
				cylGeo.addNormal(0, -1, 0);
				
				cylGeo.addFace(i3, i2, i4);
			}
		}
	}
	
	cylGeo.build();
	cylGeo.computeBoundingCylinder();
	
	this.vertexBuffer = cylGeo.vertexBuffer;
	this.texBuffer = cylGeo.texBuffer;
	this.facesBuffer = cylGeo.facesBuffer;
	this.colorsBuffer = cylGeo.colorsBuffer;
	this.normalsBuffer = cylGeo.normalsBuffer;
	this.boundingCylinder = cylGeo.boundingCylinder;
}

module.exports = GeometryCylinder;
},{"./KTColor":5,"./KTGeometry":6,"./KTMath":25,"./KTVector4":41}],11:[function(require,module,exports){
var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Vector4 = require('./KTVector4');

function GeometryGUITexture(width, height, params){
	this.__ktgeometry = true;
	this.ready = true;
	
	var guiTex = new Geometry();
	
	var x1 = 0.0;
	var y1 = 0.0;
	var x2 = width;
	var y2 = height;
	
	if (!params) params = {};
	this.params = params;
	
	this.uvRegion = (params.uvRegion)? params.uvRegion : new Vector4(0.0, 0.0, 1.0, 1.0);
	
	var xr = this.uvRegion.x;
	var yr = this.uvRegion.y;
	var hr = this.uvRegion.z;
	var vr = this.uvRegion.w;
	
	guiTex.addVertice(x2, y1, 0.0, Color._WHITE, hr, yr);
	guiTex.addVertice(x1, y2, 0.0, Color._WHITE, xr, vr);
	guiTex.addVertice(x1, y1, 0.0, Color._WHITE, xr, yr);
	guiTex.addVertice(x2, y2, 0.0, Color._WHITE, hr, vr);
	
	guiTex.addFace(0, 1, 2);
	guiTex.addFace(0, 3, 1);
	
	guiTex.computeFacesNormals();
	guiTex.build();
	
	this.vertexBuffer = guiTex.vertexBuffer;
	this.texBuffer = guiTex.texBuffer;
	this.facesBuffer = guiTex.facesBuffer;
	this.colorsBuffer = guiTex.colorsBuffer;
	this.normalsBuffer = guiTex.normalsBuffer;
}

module.exports = GeometryGUITexture;
},{"./KTColor":5,"./KTGeometry":6,"./KTVector4":41}],12:[function(require,module,exports){
var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Vector4 = require('./KTVector4');

function GeometryPlane(width, height, params){
	this.__ktgeometry = true;
	this.ready = true;
	
	var planeGeo = new Geometry();
	
	var w = width / 2;
	var h = height / 2;
	
	if (!params) params = {};
	this.params = params;
	
	this.uvRegion = (params.uvRegion)? params.uvRegion : new Vector4(0.0, 0.0, 1.0, 1.0);
	
	var xr = this.uvRegion.x;
	var yr = this.uvRegion.y;
	var hr = this.uvRegion.z;
	var vr = this.uvRegion.w;
	
	planeGeo.addVertice( w, 0,  h, Color._WHITE, hr, yr);
	planeGeo.addVertice(-w, 0, -h, Color._WHITE, xr, vr);
	planeGeo.addVertice(-w, 0,  h, Color._WHITE, xr, yr);
	planeGeo.addVertice( w, 0, -h, Color._WHITE, hr, vr);
	
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
},{"./KTColor":5,"./KTGeometry":6,"./KTVector4":41}],13:[function(require,module,exports){
var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Vector4 = require('./KTVector4');
var Material = require('./KTMaterial');
var MaterialBasic = require('./KTMaterialBasic');
var Mesh = require('./KTMesh');
var GeometryPlane = require('./KTGeometryPlane');
var KT = require('./KTMain');

function GeometrySkybox(position, texture){
	this.meshes = [];
	this.texture = texture;
	
	this.boxGeo = new KT.GeometryBox(1.0, 1.0, 1.0);
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
					var mvp = mesh.getTransformationMatrix(camera).multiply(camera.transformationMatrix).multiply(camera.perspectiveMatrix);
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

},{"./KTColor":5,"./KTGeometry":6,"./KTGeometryPlane":12,"./KTMain":20,"./KTMaterial":21,"./KTMaterialBasic":22,"./KTMesh":28,"./KTVector4":41}],14:[function(require,module,exports){
var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Vector4 = require('./KTVector4');

function GeometrySphere(radius, latBands, lonBands, params){
	this.__ktgeometry = true;
	this.ready = true;
	
	var sphGeo = new Geometry();
	
	if (!params) params = {};
	this.params = params;
	
	this.uvRegion = (params.uvRegion)? params.uvRegion : new Vector4(0.0, 0.0, 1.0, 1.0);
	
	var xr = this.uvRegion.x;
	var yr = this.uvRegion.y;
	var hr = this.uvRegion.z - xr;
	var vr = this.uvRegion.w - yr;
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
			sphGeo.addVertice(x * radius, y * radius, z * radius, Color._WHITE, xr + tx * hr, yr + ty * vr);
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
	sphGeo.computeBoundingSphere();
	
	this.vertexBuffer = sphGeo.vertexBuffer;
	this.texBuffer = sphGeo.texBuffer;
	this.facesBuffer = sphGeo.facesBuffer;
	this.colorsBuffer = sphGeo.colorsBuffer;
	this.normalsBuffer = sphGeo.normalsBuffer;
	this.boundingSphere = sphGeo.boundingSphere;
}

module.exports = GeometrySphere;
},{"./KTColor":5,"./KTGeometry":6,"./KTVector4":41}],15:[function(require,module,exports){
var KT = require('./KTMain');
var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Vector4 = require('./KTVector4');

function GeometryText(font, text, size, align, color, maxWidth, wrap){
	this.__ktgeometry = true;
	this.ready = true;
	
	this.textGeometry = new Geometry();
	
	if (!align) align = KT.TEXT_ALIGN_LEFT;
	if (!color) color = Color._WHITE;
	
	this.uvRegion = new Vector4(0.0, 0.0, 1.0, 1.0);
	
	this.size = size;
	this.text = text;
	this.font = font;
	this.align = align;
	this.color = color;
	this.maxWidth = (maxWidth)? maxWidth : -1;
	this.wrap = (wrap)? wrap : 'char';
	
	this._previousHeight = null;
	this._previousText = null;
	this._previousFont = null;
	this._previousAlign = null;
	this._previousColor = null;
	
	this.autoUpdate = true;
	
	this.updateGeometry();
}

module.exports = GeometryText;

GeometryText.prototype.hasChanged = function(){
	return (
		this.size != this._previousSize ||
		this.text != this._previousText ||
		this.font != this._previousFont ||
		this.align != this._previousAlign ||
		this.color != this._previousColor
	);
};

GeometryText.prototype.formatText = function(){
	if (this.wrap != 'word') return [this.text];
	
	var ret = [];
	var line = '';
	var width = 0;
	var words = this.text.split(' ');
	
	var last = true;
	var blank = this.size * this.font.getCharaWidth(' ');
	for (var i=0,len=words.length;i<len;i++){
		var w = words[i];
		var ww = blank;
		
		for (var j=0,jlen=w.length;j<jlen;j++){
			ww += this.size * this.font.getCharaWidth(w.charAt(j));
		}
		
		if (width + ww < this.maxWidth){
			if (line != "") line += ' ';
			line += w;
			width += ww;
			last = false;
		}else{
			ret.push(line);
			line = w;
			width = ww;
			last = true;
		}
	}
	
	if (!last){
		ret.push(line);
	}
	
	return ret;
};

GeometryText.prototype.updateGeometry = function(){
	if (!this.hasChanged()) return;
	
	this._previousSize = this.size;
	this._previousText = this.text;
	this._previousFont = this.font;
	this._previousAlign = this.align;
	this._previousColor = this.color;
	
	this.vertexBuffer = null;
	this.texBuffer = null;
	this.facesBuffer = null;
	this.colorsBuffer = null;
	this.normalsBuffer = null;
	this.textGeometry.clear();
	
	var text = this.formatText();
	var y = 0;
	var w = this.size;
	var h = this.size;
	
	var ind = 0;
	for (var j=0,jlen=text.length;j<jlen;j++){
		var x = 0;
		
		for (var i=0,len=text[j].length;i<len;i++){
			var chara = text[j].charAt(i);
			
			var uvRegion = this.font.getUVCoords(chara);
			var xr = uvRegion.x;
			var yr = uvRegion.y;
			var hr = uvRegion.z;
			var vr = uvRegion.w;
			
			var ww = w * this.font.getCharaWidth(chara);
			var xw = x + ww;
			
			if (this.maxWidth != -1 && this.wrap == 'char' && xw >= this.maxWidth){
				x = 0;
				y -= this.size;
				i--;
				continue;
			}
			
			this.textGeometry.addVertice(xw,    y,  0, this.color, hr, yr);
			this.textGeometry.addVertice( x,  y+h,  0, this.color, xr, vr);
			this.textGeometry.addVertice( x,    y,  0, this.color, xr, yr);
			this.textGeometry.addVertice(xw,  y+h,  0, this.color, hr, vr);
			
			this.textGeometry.addFace(ind, ind + 1, ind + 2);
			this.textGeometry.addFace(ind, ind + 3, ind + 1);
			
			x += ww;
			ind += 4;
		}
		
		y -= this.size;
	}
	
	if (this.align == KT.TEXT_ALIGN_CENTER){
		var w2 = x / 2;
		for (var i=0,len=this.textGeometry.vertices.length;i<len;i++){
			this.textGeometry.vertices[i].x -= w2;
		}
	}else if (this.align == KT.TEXT_ALIGN_RIGHT){
		var w2 = x;
		for (var i=0,len=this.textGeometry.vertices.length;i<len;i++){
			this.textGeometry.vertices[i].x -= w2;
		}
	}
	
	this.textGeometry.computeFacesNormals();
	this.textGeometry.build();
	
	this.vertexBuffer = this.textGeometry.vertexBuffer;
	this.texBuffer = this.textGeometry.texBuffer;
	this.facesBuffer = this.textGeometry.facesBuffer;
	this.colorsBuffer = this.textGeometry.colorsBuffer;
	this.normalsBuffer = this.textGeometry.normalsBuffer;
	
	this.width = x;
};

},{"./KTColor":5,"./KTGeometry":6,"./KTMain":20,"./KTVector4":41}],16:[function(require,module,exports){
var Utils = require('./KTUtils');
var KT = require('./KTMain');
var Vector2 = require('./KTVector2');

var Input = {
	_keys: [],
	_mouse: {
		left: 0,
		right: 0,
		middle: 0,
		wheel: 0,
		position: new Vector2(0.0, 0.0)
	},
	
	vKey: {
		SHIFT: 16,
		TAB: 9,
		CTRL: 17,
		ALT: 18,
		SPACE: 32,
		ENTER: 13,
		BACKSPACE: 8,
		ESC: 27,
		INSERT: 45,
		DEL: 46,
		END: 35,
		START: 36,
		PAGEUP: 33,
		PAGEDOWN: 34
	},
	
	vMouse: {
		LEFT: 'left',
		RIGHT: 'right',
		MIDDLE: 'middle',
		WHEELUP: 1,
		WHEELDOWN: -1,
	},
	
	useLockPointer: false,
	mouseLocked: false,
	
	isKeyDown: function(keyCode){
		return (Input._keys[keyCode] == 1);
	},
	
	isKeyPressed: function(keyCode){
		if (Input._keys[keyCode] == 1){
			Input._keys[keyCode] = 2;
			return true;
		}
		
		return false;
	},
	
	isMouseDown: function(mouseButton){
		return (Input._mouse[mouseButton] == 1);
	},
	
	isMousePressed: function(mouseButton){
		if (Input._mouse[mouseButton] == 1){
			Input._mouse[mouseButton] = 2;
			return true;
		}
		
		return false;
	},
	
	isWheelMoved: function(wheelDir){
		if (Input._mouse.wheel == wheelDir){
			Input._mouse.wheel = 0;
			return true;
		}
		
		return false;
	},
	
	handleKeyDown: function(ev){
		if (window.event) ev = window.event;
		
		if (Input._keys[ev.keyCode] == 2) return;
		Input._keys[ev.keyCode] = 1;
	},
	
	handleKeyUp: function(ev){
		if (window.event) ev = window.event;
		
		Input._keys[ev.keyCode] = 0;
	},
	
	handleMouseDown: function(ev, canvas){
		if (window.event) ev = window.event;
		
		if (Input.useLockPointer)
			canvas.requestPointerLock();
		
		if (ev.which == 1){
			if (Input._mouse.left != 2)
				Input._mouse.left = 1;
		}else if (ev.which == 2){
			if (Input._mouse.middle != 2)
				Input._mouse.middle = 1;
		}else if (ev.which == 3){
			if (Input._mouse.right != 2)
				Input._mouse.right = 1;
		}
		
		Input.handleMouseMove(ev);

		return false;
	},
	
	handleMouseUp: function(ev){
		if (window.event) ev = window.event;
		
		if (ev.which == 1){
			Input._mouse.left = 0;
		}else if (ev.which == 2){
			Input._mouse.middle = 0;
		}else if (ev.which == 3){
			Input._mouse.right = 0;
		}
		
		Input.handleMouseMove(ev);

		return false;
	},
	
	handleMouseWheel: function(ev){
		if (window.event) ev = window.event;
		
		Input._mouse.wheel = 0;
		if (ev.wheelDelta > 0) Input._mouse.wheel = 1;
		else if (ev.wheelDelta < 0) Input._mouse.wheel = -1;
	},
	
	handleMouseMove: function(ev){
		if (Input.mouseLocked) return;
		if (window.event) ev = window.event;
		
		var elX = ev.clientX - ev.target.offsetLeft;
		var elY = ev.clientY - ev.target.offsetTop;
		
		Input._mouse.position.set(elX, elY);
	},
	
	moveCallback: function(e){
		var elX = e.movementX ||
				e.mozMovementX ||
				e.webkitMovementX ||
				0;
						
		var elY = e.movementY ||
				e.mozMovementY ||
				e.webkitMovementY ||
				0;
		
		Input._mouse.position.add(new Vector2(elX, elY));
	},
	
	pointerlockchange: function(e, canvas){
		if (document.pointerLockElement === canvas ||
			document.mozPointerLockElement === canvas ||
			document.webkitPointerLockElement === canvas){
				
			Input.mouseLocked = true;
			Utils.addEvent(document, "mousemove", Input.moveCallback);
		}else{
			Input.mouseLocked = false;
			document.removeEventListener("mousemove", Input.moveCallback);
		}
	},
	
	init: function(canvas){
		canvas.requestPointerLock = canvas.requestPointerLock || canvas.webkitRequestPointerLock || canvas.mozRequestPointerLock;
		
		Utils.addEvent(document, 'keydown', Input.handleKeyDown);
		Utils.addEvent(document, 'keyup', Input.handleKeyUp);
		Utils.addEvent(canvas, 'mousedown', function(e){ Input.handleMouseDown(e, canvas); });
		Utils.addEvent(document, 'mouseup', Input.handleMouseUp);
		Utils.addEvent(canvas, 'mousewheel', Input.handleMouseWheel);
		Utils.addEvent(canvas, 'mousemove', Input.handleMouseMove);
		Utils.addEvent(document, 'contextmenu', function(ev){
			if (window.event) ev = window.event;
			
			if (ev.target === canvas){
				ev.cancelBubble = true;
				ev.returnValue = false;
				if (ev.preventDefault)
					ev.preventDefault();
				if (ev.stopPropagation)
					ev.stopPropagation();
				return false;
			}
			
			return true;
		});
		
		Utils.addEvent(document, "pointerlockchange", function(e){ Input.pointerlockchange(e, canvas); });
		Utils.addEvent(document, "mozpointerlockchange", function(e){ Input.pointerlockchange(e, canvas); });
		Utils.addEvent(document, "webkitpointerlockchange", function(e){ Input.pointerlockchange(e, canvas); });
		
		for (var i=0;i<=9;i++){
			Input.vKey['N' + i] = 48 + i;
			Input.vKey['NK' + i] = 96 + i;
		}
		
		for (var i=65;i<=90;i++){
			Input.vKey[String.fromCharCode(i)] = i;
		}
		
		for (var i=1;i<=12;i++){
			Input.vKey['F' + i] = 111 + i;
		}
	}
};

module.exports = Input;
},{"./KTMain":20,"./KTUtils":38,"./KTVector2":39}],17:[function(require,module,exports){
var Color = require('./KTColor');
var CameraOrtho = require('./KTCameraOrtho');
var Vector2 = require('./KTVector2');
var TextureFramebuffer = require('./KTTextureFramebuffer');

function DirectionalLight(direction, color, intensity){
	this.__ktdirLight = true;
	
	this.direction = direction.normalize();
	this.direction.multiply(-1);
	
	this.color = new Color((color)? color: Color._WHITE);
	this.intensity = (intensity !== undefined)? intensity : 1.0;
	this.castShadow = false;
	this.shadowCam = null;
	this.shadowBuffer = null;
	
	this.shadowCamWidth = 500;
	this.shadowCamHeight = 500;
	this.shadowNear = 0.1;
	this.shadowFar = 500.0;
	this.shadowResolution = new Vector2(512, 512);
	this.shadowStrength = 0.2;
}

module.exports = DirectionalLight;

DirectionalLight.prototype.setCastShadow = function(castShadow){
	this.castShadow = castShadow;
	
	if (castShadow){
		var rel = this.shadowResolution.x / this.shadowResolution.y;
		this.shadowCam = new CameraOrtho(this.shadowCamWidth, this.shadowCamHeight, this.shadowNear, this.shadowFar);
		this.shadowCam.position = this.direction.clone().multiply(10);
		this.shadowCam.lookAt(this.direction.clone().multiply(-1));
		
		this.shadowBuffer = new TextureFramebuffer(this.shadowResolution.x, this.shadowResolution.y);
	}else{
		this.shadowCam = null;
		this.shadowBuffer = null;
	}
};
},{"./KTCameraOrtho":2,"./KTColor":5,"./KTTextureFramebuffer":37,"./KTVector2":39}],18:[function(require,module,exports){
var Color = require('./KTColor');

function LightPoint(position, intensity, distance, color){
	this.__ktpointlight = true;
	
	this.position = position;
	this.intensity = (intensity)? intensity : 1.0;
	this.distance = (distance)? distance : 1.0;
	this.color = new Color((color)? color : Color._WHITE);
}

module.exports = LightPoint;
},{"./KTColor":5}],19:[function(require,module,exports){
var KT = require('./KTMain');
var Color = require('./KTColor');
var Vector3 = require('./KTVector3');
var Vector2 = require('./KTVector2');
var TextureFramebuffer = require('./KTTextureFramebuffer');

function LightSpot(position, target, innerAngle, outerAngle, intensity, distance, color){
	this.__ktspotlight = true;
	
	this.position = position;
	this.target = target;
	this.direction = Vector3.vectorsDifference(position, target).normalize();
	this.outerAngle = Math.cos(outerAngle);
	this.innerAngle = Math.cos(innerAngle);
	this.intensity = (intensity)? intensity : 1.0;
	this.distance = (distance)? distance : 1.0;
	this.color = new Color((color)? color : Color._WHITE);
	this.castShadow = false;
	this.shadowCam = null;
	this.shadowBuffer = null;
	
	this.shadowFov = KT.Math.degToRad(90.0);
	this.shadowNear = 0.1;
	this.shadowFar = 500.0;
	this.shadowResolution = new Vector2(512, 512);
	this.shadowStrength = 0.2;
}

module.exports = LightSpot;

LightSpot.prototype.setCastShadow = function(castShadow){
	this.castShadow = castShadow;
	
	if (castShadow){
		var rel = this.shadowResolution.x / this.shadowResolution.y;
		this.shadowCam = new KT.CameraPerspective(this.shadowFov, rel, this.shadowNear, this.shadowFar);
		this.shadowCam.position = this.position;
		this.shadowCam.lookAt(this.target);
		
		this.shadowBuffer = new TextureFramebuffer(this.shadowResolution.x, this.shadowResolution.y);
	}else{
		this.shadowCam = null;
		this.shadowBuffer = null;
	}
};

LightSpot.prototype.setShadowProperties = function(fov, near, far, resolution){
	this.shadowFov = fov;
	this.shadowNear = near;
	this.shadowFar = far;
	this.shadowResolution = resolution;
};

},{"./KTColor":5,"./KTMain":20,"./KTTextureFramebuffer":37,"./KTVector2":39,"./KTVector3":40}],20:[function(require,module,exports){
var KT = {
	TEXT_ALIGN_LEFT: 0,
	TEXT_ALIGN_CENTER: 1,
	TEXT_ALIGN_RIGHT: 2,
	
	init: function(canvas, params){
		this.canvas = canvas;
		this.gl = null;
		this.shaders = {};
		this.images = [];
		this.maxAttribLocations = 0;
		this.lastProgram = null;
		
		this.__initModules(params);
		this.__initContext(canvas);
		this.__initProperties();
		this.__initShaders();
		this.__initParams();
		this.__createMissingTexture();
		
		this.clock = new Clock();
		this.looping = true;
		
		Input.init(canvas);
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
		gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
	},
	
	__initShaders: function(){
		this.shaders = {};
		
		if (this.modules.basicMaterial) this.shaders.basic = this.processShader(Shaders.basic);
		if (this.modules.lambertMaterial) this.shaders.lambert = this.processShader(Shaders.lambert);
		if (this.modules.phongMaterial) this.shaders.phong = this.processShader(Shaders.phong);
		if (this.modules.skyboxMaterial) this.shaders.skybox = this.processShader(Shaders.skybox);
		
		if (this.modules.shadowMapping)
			this.shaders.depth = this.processShader(Shaders.depthMap);
	},
	
	__initParams: function(){
		this.lightNDCMat = new Matrix4(
			0.5, 0.0, 0.0, 0.5,
			0.0, 0.5, 0.0, 0.5,
			0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 1.0
		);
	},
	
	__initModules: function(params){
		if (!params) params = {};
		
		this.modules = {
			specularLight: (params.specularLight !== undefined)? params.specularLight : true,
			shadowMapping: (params.shadowMapping !== undefined)? params.shadowMapping : true,
			basicMaterial: (params.basicMaterial !== undefined)? params.basicMaterial : true,
			lambertMaterial: (params.lambertMaterial !== undefined)? params.lambertMaterial : true,
			phongMaterial: (params.phongMaterial !== undefined)? params.phongMaterial : true,
			skyboxMaterial: (params.skyboxMaterial !== undefined)? params.skyboxMaterial : true,
		};
		
		this.fps = (params.limitFPS)? params.limitFPS : 1000 / 60;
	},
	
	__createMissingTexture: function(){
		var data = [];
		
		var c1 = [66,66,66];
		var c2 = [122,122,122];
		var c3 = [200,200,200];
		var c4 = [255,255,255];
		
		var yy = 0;
		for (var y=0;y<64;y++){
			var xx = 0;
			for (var x=0;x<256;x+=4){
				var c;
				if ((xx < 32 && yy < 32) || (xx >= 32 && yy >= 32)){
					c = c2;
					if (xx < 32 && yy < 32){
						if ((xx < 16 && yy < 16) || (xx >= 16 && yy >= 16)){
							c = c1;
						}
					}else{
						if ((xx < 48 && yy < 48) || (xx >= 48 && yy >= 48)){
							c = c1;
						}
					}
				}else{
					c = c4;
					if (xx >= 32 && yy < 32){
						if ((xx < 48 && yy < 16) || (xx >= 48 && yy >= 16)){
							c = c3;
						}
					}else if (xx < 32 && yy >= 32){
						if ((xx < 16 && yy < 48) || (xx >= 16 && yy >= 48)){
							c = c3;
						}
					}
				}
				
				data[y * 256 + x + 0] = c[0];
				data[y * 256 + x + 1] = c[1];
				data[y * 256 + x + 2] = c[2];
				data[y * 256 + x + 3] = 255;
				
				xx++;
			}
			
			yy++;
		}
		
		this.missingTexture = new Texture({data: new Uint8Array(data), width: 64, height: 64});
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
	
	getShaderAttributesAndUniforms: function(vertex, fragment){
		var attributes = [];
		var uniforms = [];
		var uniformsNames = [];
		
		var structs = [];
		var uniformsArrays = [];
		var st = null;
		for (var i=0;i<vertex.length;i++){
			var line = vertex[i].trim();
			
			if (line.indexOf("attribute ") == 0){
				st = null;
				var p = line.split(/ /g);
				var name = p[p.length - 1].trim();
				if (attributes.indexOf(name) == -1)
					attributes.push({name: name});
			}else if (line.indexOf("uniform ") == 0){
				st = null;
				if (line.indexOf("[") != -1){
					uniformsArrays.push(line);
					continue;
				}
				
				var p = line.split(/ /g);
				var name = p[p.length - 1].trim();
				if (uniformsNames.indexOf(name) == -1){
					uniforms.push({name: name});
					uniformsNames.push(name);
				}
			}else if (line.indexOf("struct") == 0){
				st = { name: line.replace("struct ", ""), data: [] };
				structs.push(st);
			}else if (st != null){
				if (line.trim() == "") continue;
				var p = line.split(/ /g);
				var name = p[p.length -1].trim();
				st.data.push(name);
			}
		}
		
		for (var i=0;i<fragment.length;i++){
			var line = fragment[i].trim();
			
			if (line.indexOf("attribute ") == 0){
				st = null;
				var p = line.split(/ /g);
				var name = p[p.length - 1].trim();
				if (attributes.indexOf(name) == -1)
					attributes.push({name: name});
			}else if (line.indexOf("uniform ") == 0){
				st = null;
				if (line.indexOf("[") != -1){
					uniformsArrays.push(line);
					continue;
				}
				
				var p = line.split(/ /g);
				var name = p[p.length - 1].trim();
				if (uniformsNames.indexOf(name) == -1){
					uniforms.push({name: name});
					uniformsNames.push(name);
				}
			}else if (line.indexOf("struct") != -1){
				st = { name: line.replace("struct ", ""), data: [] };
				structs.push(st);
			}else if (st != null){
				if (line.trim() == "") continue;
				var p = line.split(/ /g);
				var name = p[p.length -1].trim();
				st.data.push(name);
			}
		}
		
		for (var i=0,len=uniformsArrays.length;i<len;i++){
			var line = uniformsArrays[i];
			var p = line.split(/ /g);
			var type = p[p.length - 2].trim();
			var name = p[p.length - 1].trim();
			var uniLen = parseInt(name.substring(name.indexOf("[") + 1, name.indexOf("]")), 10);
			var name = name.substring(0, name.indexOf("["));
			
			var str = null;
			for (var j=0,jlen=structs.length;j<jlen;j++){
				if (structs[j].name == type){
					str = structs[j];
					j = jlen;
				}
			}
			
			if (str){
				var structUni = [];
				for (var j=0;j<uniLen;j++){
					structUni[j] = ({name: name, len: uniLen, data: []});
					for (var k=0,klen=str.data.length;k<klen;k++){
						var prop = str.data[k];
						
						structUni[j].data.push({
							name: prop,
							locName: name + "[" + j + "]." + prop
						});
					}
				}
				
				if (uniformsNames.indexOf(name) == -1){
					uniforms.push({
						multi: true,
						data: structUni,
						type: type
					});
					uniformsNames.push(name);
				}
			}else{
				for (var j=0;j<uniLen;j++){
					if (uniformsNames.indexOf(name + "[" + j + "]") == -1){
						uniforms.push({name: name + "[" + j + "]", type: name });
						uniformsNames.push(name);
					}
				}
			}
		}
		
		return {
			attributes: attributes,
			uniforms: uniforms
		};
	},
	
	precompileShader: function(shaderCode){
		var modulars = Shaders.modulars;
		
		var ret = shaderCode;
		
		var sl = (this.modules.specularLight);
		ret = ret.replace("#kt_require(specular_in)", (sl)? modulars.specular_in : '');
		ret = ret.replace("#kt_require(specular_main)", (sl)? modulars.specular_main : '');
		
		var sm = (this.modules.shadowMapping);
		ret = ret.replace("#kt_require(shadowmap_vert_in)", (sm)? modulars.shadowmap_vert_in : '');
		ret = ret.replace("#kt_require(shadowmap_vert_main)", (sm)? modulars.shadowmap_vert_main : '');
		ret = ret.replace("#kt_require(shadowmap_frag_in)", (sm)? modulars.shadowmap_frag_in : '');
		ret = ret.replace("#kt_require(shadowmap_frag_main)", (sm)? modulars.shadowmap_frag_main : '');
		
		return ret;
	},
	
	processShader: function(shader){
		var gl = this.gl;
		
		var vCode = this.precompileShader(shader.vertexShader);
		var vShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vShader, vCode);
		gl.compileShader(vShader);
		
		var fCode = this.precompileShader(shader.fragmentShader);
		var fShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fShader, fCode);
		gl.compileShader(fShader);
		
		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vShader);
		gl.attachShader(shaderProgram, fShader);
		gl.linkProgram(shaderProgram);
		
		var params = this.getShaderAttributesAndUniforms(vCode.split(/[;{}]+/), fCode.split(/[;{}]+/));
		
		if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)){
			console.log(gl.getShaderInfoLog(vShader));
			throw "Error compiling vertex shader";
		}
		
		if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)){
			console.log(gl.getShaderInfoLog(fShader));
			throw "Error compiling fragment shader";
		}
		
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
			console.log(gl.getProgramInfoLog(shaderProgram));
			throw "Error initializing the shader program";
		}
		
		var attributes = [];
		this.maxAttribLocations = Math.max(this.maxAttribLocations, params.attributes.length);
		for (var i=0,len=params.attributes.length;i<len;i++){
			var att = params.attributes[i];
			var location = gl.getAttribLocation(shaderProgram, att.name);
			
			gl.enableVertexAttribArray(location);
			
			attributes.push({
				name: att.name,
				location: location
			});
		}
		
		var uniforms = [];
		for (var i=0,len=params.uniforms.length;i<len;i++){
			var uni = params.uniforms[i];
			if (uni.multi){
				for (var j=0,jlen=uni.data.length;j<jlen;j++){
					var uniD = uni.data[j];
					for (var k=0,klen=uniD.data.length;k<klen;k++){
						var dat = uniD.data[k];
						dat.location = gl.getUniformLocation(shaderProgram, dat.locName);
					}
				}
				
				uniforms.push(uni);
			}else{
				var location = gl.getUniformLocation(shaderProgram, uni.name);
			
				uniforms.push({
					name: uni.name,
					location: location,
					type: (uni.type)? uni.type : uni.name
				});
			}
		}
		
		return {
			shaderProgram: shaderProgram,
			attributes: attributes,
			uniforms: uniforms
		};
	},
	
	switchProgram: function(shader){
		if (this.lastProgram === shader) return;
		var gl = this.gl;
		
		this.lastProgram = shader;
		gl.useProgram(shader.shaderProgram);
		
		for (var i=0;i<this.maxAttribLocations;i++){
			if (i < shader.attributes.length){
				gl.enableVertexAttribArray(i);
			}else{
				gl.disableVertexAttribArray(i);
			}
		}
	},
	
	loadImage: function(src, onLoad){
		var img = this.getImage(src);
		if (img){
			if (img.ready){
				onLoad(img);
			}else{
				img.callers.push(onLoad);
			}
			
			return img;
		}
		
		var image = new Image();
		image.src = src;
		image.ready = false;
		image.callers = [onLoad];
		this.images.push({src: src, img: image});
		
		Utils.addEvent(image, "load", function(){
			image.ready = true;
			for (var i=0,len=image.callers.length;i<len;i++){
				image.callers[i](image);
			}
			
			image.callers = null;
		});
		
		return image;
	},
	
	getImage: function(src){
		for (var i=0,len=this.images.length;i<len;i++){
			if (this.images[i].src == src)
				return this.images[i].img;
		}
		
		return null;
	},
	
	setLoopMethod: function(callback){
		var delta = this.clock.getDelta();
		if (delta > this.fps){
			this.clock.update(this.fps);
			callback();
		}
		
		if (!this.looping){
			this.looping = true; 
			return;
		}
		
		var T  = this;
		requestAnimFrame(function(){ T.setLoopMethod(callback); });
	},
	
	stopLoopMethod: function(){
		this.looping = false;
	}
};

module.exports = KT;
var requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, KT.fps);
          };
})();

var Clock = require('./KTClock');
var Shaders = require('./KTShaders');
var Input = require('./KTInput');
var Matrix4 = require('./KTMatrix4');
var Utils = require('./KTUtils');
var Texture = require('./KTTexture');
},{"./KTClock":4,"./KTInput":16,"./KTMatrix4":27,"./KTShaders":33,"./KTTexture":34,"./KTUtils":38}],21:[function(require,module,exports){
var Color = require('./KTColor');
var KT = require('./KTMain');

function Material(parameters){
	this.__ktmaterial = true;
	
	if (!parameters) parameters = {};
	
	this.textureMap = (parameters.textureMap)? parameters.textureMap : null;
	this.color = new Color((parameters.color)? parameters.color : Color._WHITE);
	this.opacity = (parameters.opacity)? parameters.opacity : 1.0;
	this.transparent = (parameters.transparent)? parameters.transparent : false;
	this.drawFaces = (parameters.drawFaces)? parameters.drawFaces : 'FRONT';
	this.drawAs = (parameters.drawAs)? parameters.drawAs : 'TRIANGLES';
	this.shader = (parameters.shader)? parameters.shader : null;
	this.sendAttribData = (parameters.sendAttribData)? parameters.sendAttribData : null;
	this.sendUniformData = (parameters.sendUniformData)? parameters.sendUniformData : null;
}

module.exports = Material;
},{"./KTColor":5,"./KTMain":20}],22:[function(require,module,exports){
var Material = require('./KTMaterial');
var Matrix4 = require('./KTMatrix4');
var KT = require('./KTMain');

function MaterialBasic(textureMap, color){
	this.__ktmaterial = true;
	
	var material = new Material({
		textureMap: textureMap,
		color: color,
		shader: KT.shaders.basic
	});
	
	this.textureMap = material.textureMap;
	this.color = material.color;
	this.shader = material.shader;
	this.opacity = material.opacity;
	this.drawFaces = material.drawFaces;
	this.drawAs = material.drawAs;
	this.transparent = material.transparent;
}

module.exports = MaterialBasic;

MaterialBasic.prototype.sendAttribData = function(mesh, camera, scene){
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
		}
	}
};

MaterialBasic.prototype.sendUniformData = function(mesh, camera, scene){
	var gl = KT.gl;
	var geometry = mesh.geometry;
	var transformationMatrix;
	var uniforms = this.shader.uniforms;
	for (var i=0,len=uniforms.length;i<len;i++){
		var uni = uniforms[i];
		
		if (uni.name == 'uMVPMatrix'){
			transformationMatrix = mesh.getTransformationMatrix(camera).multiply(camera.transformationMatrix);
			var mvp = transformationMatrix.clone().multiply(camera.perspectiveMatrix);
			gl.uniformMatrix4fv(uni.location, false, mvp.toFloat32Array());
		}else if (uni.name == 'uMaterialColor'){
			var color = mesh.material.color.getRGBA();
			gl.uniform4fv(uni.location, new Float32Array(color));
		}else if (uni.name == 'uTextureSampler'){
			if (mesh.material.textureMap){
				var tex = mesh.material.textureMap;
				if (tex.image && !tex.image.ready){
					tex = KT.missingTexture;
				}
				
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, tex.texture);
				gl.uniform1i(uni.location, 0);
			}
		}else if (uni.name == 'uHasTexture'){
			gl.uniform1i(uni.location, (mesh.material.textureMap)? 1 : 0);
		}else if (uni.name == 'uTextureRepeat' && mesh.material.textureMap){
			var repeat = (mesh.material.repeat)? mesh.material.repeat : mesh.material.textureMap.repeat;
			gl.uniform2f(uni.location, repeat.x, repeat.y);
		}else if (uni.name == 'uGeometryUV' && mesh.material.textureMap){
			gl.uniform4f(uni.location, mesh.geometry.uvRegion.x, mesh.geometry.uvRegion.y, mesh.geometry.uvRegion.z, mesh.geometry.uvRegion.w);
		}else if (uni.name == 'uTextureOffset' && mesh.material.textureMap){
			gl.uniform2f(uni.location, mesh.material.textureMap.offset.x, mesh.material.textureMap.offset.y);
		}else if (uni.name == 'uOpacity'){
			gl.uniform1f(uni.location, mesh.material.opacity);
		}
	}
};

},{"./KTMain":20,"./KTMaterial":21,"./KTMatrix4":27}],23:[function(require,module,exports){
var Material = require('./KTMaterial');
var Matrix4 = require('./KTMatrix4');

function MaterialLambert(textureMap, color, opacity){
	this.__ktmaterial = true;
	
	var material = new Material({
		textureMap: textureMap,
		color: color,
		opacity: opacity,
		shader: KT.shaders.lambert
	});
	
	this.textureMap = material.textureMap;
	this.color = material.color;
	this.shader = material.shader;
	this.opacity = material.opacity;
	this.drawFaces = material.drawFaces;
	this.drawAs = material.drawAs;
	this.transparent = material.transparent;
}

module.exports = MaterialLambert;

MaterialLambert.prototype.sendAttribData = function(mesh, camera, scene){
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

MaterialLambert.prototype.sendLightUniformData = function(light, uniform, modelTransformation){
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
			if (light.castShadow){
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
		}else if (dat.name == 'shadowStrength'){
			gl.uniform1f(dat.location, light.shadowStrength);
		}else if (dat.name == 'lightMult'){
			gl.uniform1f(dat.location, (light.__ktdirLight)? -1 : 1);
		}
	}
};

MaterialLambert.prototype.sendUniformData = function(mesh, camera, scene){
	var gl = KT.gl;
	var geometry = mesh.geometry;
	var transformationMatrix;
	var uniforms = this.shader.uniforms;
	var modelTransformation;
	var usedLightUniform = null;
	var lightsCount = 0;
	var shadowMapsUniform = [];
	for (var i=0,len=uniforms.length;i<len;i++){
		var uni = uniforms[i];
		
		if (uni.multi && uni.type == 'Light'){
			if (lightsCount == uni.data.length)
				continue;
				
			var lights = scene.getMeshLights(mesh);
			for (var j=0,jlen=lights.length;j<jlen;j++){
				this.sendLightUniformData(lights[j], uni.data[lightsCount++], modelTransformation);
			}
		}else if (uni.type == 'uShadowMaps'){
			shadowMapsUniform.push(uni);
		}else if (uni.name == 'uMVMatrix'){
			modelTransformation = mesh.getTransformationMatrix(camera);
			transformationMatrix = modelTransformation.clone().multiply(camera.transformationMatrix);
			gl.uniformMatrix4fv(uni.location, false, transformationMatrix.toFloat32Array());
		}else if (uni.name == 'uPMatrix'){
			gl.uniformMatrix4fv(uni.location, false, camera.perspectiveMatrix.toFloat32Array());
		}else if (uni.name == 'uMaterialColor'){
			var color = mesh.material.color.getRGBA();
			gl.uniform4fv(uni.location, new Float32Array(color));
		}else if (uni.name == 'uTextureSampler'){
			if (mesh.material.textureMap){
				var tex = mesh.material.textureMap;
				if (tex.image && !tex.image.ready){
					tex = KT.missingTexture;
				}
				
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, tex.texture);
				gl.uniform1i(uni.location, 0);
			}
		}else if (uni.name == 'uHasTexture'){
			gl.uniform1i(uni.location, (mesh.material.textureMap)? 1 : 0);
		}else if (uni.name == 'uUseLighting'){
			gl.uniform1i(uni.location, (scene.useLighting)? 1 : 0);
		}else if (uni.name == 'uNormalMatrix'){
			var normalMatrix = modelTransformation.toMatrix3().inverse().toFloat32Array();
			gl.uniformMatrix3fv(uni.location, false, normalMatrix);
		}else if (uni.name == 'uModelMatrix'){
			gl.uniformMatrix4fv(uni.location, false, modelTransformation.toFloat32Array());
		}else if (uni.name == 'uAmbientLightColor' && scene.useLighting && scene.ambientLight){
			var color = scene.ambientLight.getRGB();
			gl.uniform3f(uni.location, color[0], color[1], color[2]);
		}else if (uni.name == 'uOpacity'){
			gl.uniform1f(uni.location, mesh.material.opacity);
		}else if (uni.name == 'uTextureRepeat' && mesh.material.textureMap){
			var repeat = (mesh.material.repeat)? mesh.material.repeat : mesh.material.textureMap.repeat;
			gl.uniform2f(uni.location, repeat.x, repeat.y);
		}else if (uni.name == 'uGeometryUV' && mesh.material.textureMap){
			gl.uniform4f(uni.location, mesh.geometry.uvRegion.x, mesh.geometry.uvRegion.y, mesh.geometry.uvRegion.z, mesh.geometry.uvRegion.w);
		}else if (uni.name == 'uTextureOffset' && mesh.material.textureMap){
			gl.uniform2f(uni.location, mesh.material.textureMap.offset.x, mesh.material.textureMap.offset.y);
		}else if (uni.name == 'uUsedLights'){
			usedLightUniform = uni;
		}else if (uni.name == 'uReceiveShadow'){
			gl.uniform1i(uni.location, (mesh.receiveShadow)? 1 : 0);
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
},{"./KTMaterial":21,"./KTMatrix4":27}],24:[function(require,module,exports){
var Material = require('./KTMaterial');
var Color = require('./KTColor');
var Matrix4 = require('./KTMatrix4');

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
			if (light.castShadow){
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
		}else if (dat.name == 'shadowStrength'){
			gl.uniform1f(dat.location, light.shadowStrength);
		}else if (dat.name == 'lightMult'){
			gl.uniform1f(dat.location, (light.__ktdirLight)? -1 : 1);
		}
	}
};

MaterialPhong.prototype.sendUniformData = function(mesh, camera, scene){
	var gl = KT.gl;
	var geometry = mesh.geometry;
	var transformationMatrix;
	var uniforms = this.shader.uniforms;
	var modelTransformation;
	var lights = scene.getMeshLights(mesh);
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
		}else if (uni.type == 'uShadowMaps'){
			shadowMapsUniform.push(uni);
		}else if (uni.name == 'uMVMatrix'){
			modelTransformation = mesh.getTransformationMatrix(camera);
			transformationMatrix = modelTransformation.clone().multiply(camera.transformationMatrix);
			gl.uniformMatrix4fv(uni.location, false, transformationMatrix.toFloat32Array());
		}else if (uni.name == 'uPMatrix'){
			gl.uniformMatrix4fv(uni.location, false, camera.perspectiveMatrix.toFloat32Array());
		}else if (uni.name == 'uMaterialColor'){
			var color = mesh.material.color.getRGBA();
			gl.uniform4fv(uni.location, new Float32Array(color));
		}else if (uni.name == 'uTextureSampler'){
			if (mesh.material.textureMap){
				var tex = mesh.material.textureMap;
				if (tex.image && !tex.image.ready){
					tex = KT.missingTexture;
				}
				
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, tex.texture);
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
			var repeat = (mesh.material.repeat)? mesh.material.repeat : mesh.material.textureMap.repeat;
			gl.uniform2f(uni.location, repeat.x, repeat.y);
		}else if (uni.name == 'uGeometryUV' && mesh.material.textureMap){
			gl.uniform4f(uni.location, mesh.geometry.uvRegion.x, mesh.geometry.uvRegion.y, mesh.geometry.uvRegion.z, mesh.geometry.uvRegion.w);
		}else if (uni.name == 'uTextureOffset' && mesh.material.textureMap){
			gl.uniform2f(uni.location, mesh.material.textureMap.offset.x, mesh.material.textureMap.offset.y);
		}else if (uni.name == 'uUsedLights'){
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
};
},{"./KTColor":5,"./KTMaterial":21,"./KTMatrix4":27}],25:[function(require,module,exports){
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
		var xx = (x2 - x1);
		var yy = (y1 - y2);
		
		var ang = (Math.atan2(yy, xx) + this.PI2) % this.PI2;
		
		return ang;
	}
};

},{}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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
	
		for (var i=0;i<4;i+=1){
			var row = [this[i], this[i+4], this[i+8], this[i+12]];
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

Matrix4.getTransformation = function(position, rotation, scale, stack){
	if (!position.__ktv3) throw "Position must be a Vector3";
	if (!rotation.__ktv3) throw "Rotation must be a Vector3";
	if (scale && !scale.__ktv3) throw "Scale must be a Vector3";
	if (!stack) stack = 'SRxRyRzT';
	
	var ss = (stack.indexOf("S") != -1);
	var rx = (stack.indexOf("Rx") != -1);
	var ry = (stack.indexOf("Ry") != -1);
	var rz = (stack.indexOf("Rz") != -1);
	var tt = (stack.indexOf("T") != -1);
	
	var scale = (scale && ss)? Matrix4.getScale(scale) : Matrix4.getIdentity();
	
	var rotationX = Matrix4.getXRotation(rotation.x);
	var rotationY = Matrix4.getYRotation(rotation.y);
	var rotationZ = Matrix4.getZRotation(rotation.z);
	
	var translation = Matrix4.getTranslation(position);
	
	var matrix;
	matrix = scale;
	if (rx) matrix.multiply(rotationX);
	if (ry) matrix.multiply(rotationY);
	if (rz) matrix.multiply(rotationZ);
	if (tt) matrix.multiply(translation);
	
	return matrix;
};

Matrix4.clearToSphericalBillboard = function(matrix4){
	if (!matrix4.__ktm4) throw "Can only transform a matrix 4";
	
	var ret = matrix4.clone();
	for (var i=0;i<3;i++){
		for (var j=0;j<3;j++){
			ret[i * 4 + j] = 0;
		}
	}
	
	ret[0] = 1;
	ret[5] = 1;
	ret[10] = 1;
	
	return ret;
};

},{"./KTMatrix3":26}],28:[function(require,module,exports){
var Matrix4 = require('./KTMatrix4');
var Vector2 = require('./KTVector2');
var Vector3 = require('./KTVector3');
var KTMath = require('./KTMath');
var GeometryBillboard = require('./KTGeometryBillboard');

function Mesh(geometry, material){
	if (!geometry || !geometry.__ktgeometry) throw "Geometry must be a KTGeometry instance";
	if (!material || !material.__ktmaterial) throw "Material must be a KTMaterial instance";
	
	this.__ktmesh = true;
	
	this.geometry = geometry;
	this.material = material;
	this.isBillboard = (geometry instanceof GeometryBillboard);
	
	this.children = [];
	this.parent = null;
	this.visible = true;
	
	this.castShadow = false;
	this.receiveShadow = false;
	
	this.position = new Vector3(0, 0, 0);
	this.rotation = new Vector3(0, 0, 0);
	this.scale = new Vector3(1, 1, 1);
	
	this.previousPosition = this.position.clone();
	this.previousRotation = this.rotation.clone();
	this.previousScale = this.scale.clone();
	
	this.order = 0;
	
	this.transformationMatrix = null;
	this.transformationStack = 'SRxRyRzT';
}

module.exports = Mesh;

Mesh.prototype.lookAtObject = function(camera){
	var angle = KTMath.get2DAngle(this.position.x, this.position.z, camera.position.x, camera.position.z) + KTMath.PI_2;
	this.rotation.y = angle;
	
	if (this.geometry.spherical){
		var dist = new Vector3(camera.position.x - this.position.x, 0, camera.position.z - this.position.z).length();
		var xAng = -KTMath.get2DAngle(0, this.position.y, dist, camera.position.y);
		this.rotation.x = xAng;
	}
};

Mesh.prototype.positionChanged = function(){
	return (!this.transformationMatrix || !this.position.equals(this.previousPosition) || !this.rotation.equals(this.previousRotation) || !this.scale.equals(this.previousScale));
};

Mesh.prototype.getTransformationMatrix = function(camera){
	if (this.isBillboard){ this.lookAtObject(camera); }
		
	var parentPositionChanged = (this.parent && this.parent.positionChanged);
	if (this.positionChanged || parentPositionChanged){
		this.transformationMatrix = Matrix4.getTransformation(this.position, this.rotation, this.scale, this.transformationStack);
		
		this.previousPosition.copy(this.position);
		this.previousRotation.copy(this.rotation);
		this.previousScale.copy(this.scale);
		
		if (this.parent){
			var m = this.parent.getTransformationMatrix(camera);
			this.transformationMatrix.multiply(m);
		}
	}
	
	return this.transformationMatrix.clone();
};

Mesh.prototype.addChild = function(mesh){
	this.children.push(mesh);
	mesh.parent = this;
	
	mesh.position.x -= this.position.x;
	mesh.position.y -= this.position.y;
	mesh.position.z -= this.position.z;
	
	mesh.rotation.x -= this.rotation.x;
	mesh.rotation.y -= this.rotation.y;
	mesh.rotation.z -= this.rotation.z;
};
},{"./KTGeometryBillboard":8,"./KTMath":25,"./KTMatrix4":27,"./KTVector2":39,"./KTVector3":40}],29:[function(require,module,exports){
var Color = require('./KTColor');
var KT = require('./KTMain');
var GeometryGUITexture = require('./KTGeometryGUITexture');
var Texture = require('./KTTexture');
var MaterialBasic = require('./KTMaterialBasic');
var Vector3 = require('./KTVector3');
var Matrix4 = require('./KTMatrix4');

function MeshSprite(width, height, textureSrc){
	this.__ktmesh = true;
	
	this.texture = null;
	if (textureSrc){
		if (textureSrc.__kttexture || textureSrc.__kttextureframebuffer)
			this.texture = textureSrc;
		else
			this.texture = new Texture(textureSrc);
	}
	
	this.geometry = new GeometryGUITexture(width, height);
	this.material = new MaterialBasic(this.texture, "#FFFFFF");
	this.material.transparent = true;
		
	this.parent = null;
	this.visible = true;
	
	this.castShadow = false;
	this.receiveShadow = false;
	
	this.position = new Vector3(0.0, 0.0, 0.0);
	this.rotation = new Vector3(0.0, 0.0, 0.0);
	this.scale = new Vector3(1.0, 1.0, 1.0);
	
	this.previousPosition = this.position.clone();
	this.previousRotation = this.rotation.clone();
	this.previousScale = this.scale.clone();
	
	this.transformationMatrix = null;
	this.transformationStack = 'SRzT';
}

module.exports = MeshSprite;

MeshSprite.prototype.getTransformationMatrix = function(){
	if (!this.transformationMatrix || !this.position.equals(this.previousPosition) || !this.rotation.equals(this.previousRotation) || !this.scale.equals(this.previousScale)){
		this.transformationMatrix = Matrix4.getTransformation(this.position, this.rotation, this.scale, this.transformationStack);
		
		this.previousPosition.copy(this.position);
		this.previousRotation.copy(this.rotation);
		this.previousScale.copy(this.scale);
		
		if (this.parent){
			var m = this.parent.getTransformationMatrix();
			this.transformationMatrix.multiply(m);
		}
	}
	
	return this.transformationMatrix.clone();
};
},{"./KTColor":5,"./KTGeometryGUITexture":11,"./KTMain":20,"./KTMaterialBasic":22,"./KTMatrix4":27,"./KTTexture":34,"./KTVector3":40}],30:[function(require,module,exports){
var Matrix4 = require('./KTMatrix4');
var Vector2 = require('./KTVector2');
var Vector3 = require('./KTVector3');
var KTMath = require('./KTMath');

function Object3D(){
	this.__ktmesh = true;
	
	this.children = [];
	this.parent = null;
	
	this.position = new Vector3(0, 0, 0);
	this.rotation = new Vector3(0, 0, 0);
	this.scale = new Vector3(1, 1, 1);
	
	this.previousPosition = this.position.clone();
	this.previousRotation = this.rotation.clone();
	this.previousScale = this.scale.clone();
	
	this.order = 0;
	
	this.transformationMatrix = null;
	this.transformationStack = 'SRxRyRzT';
}

module.exports = Object3D;

Object3D.prototype.positionChanged = function(){
	return (!this.transformationMatrix || !this.position.equals(this.previousPosition) || !this.rotation.equals(this.previousRotation) || !this.scale.equals(this.previousScale));
};

Object3D.prototype.getTransformationMatrix = function(camera){
	var parentPositionChanged = (this.parent && this.parent.positionChanged);
	if (this.positionChanged || parentPositionChanged){
		this.transformationMatrix = Matrix4.getTransformation(this.position, this.rotation, this.scale, this.transformationStack);
		
		this.previousPosition.copy(this.position);
		this.previousRotation.copy(this.rotation);
		this.previousScale.copy(this.scale);
		
		if (this.parent){
			var m = this.parent.getTransformationMatrix(camera);
			this.transformationMatrix.multiply(m);
		}
	}
	
	return this.transformationMatrix.clone();
};

Object3D.prototype.addChild = function(mesh){
	this.children.push(mesh);
	mesh.parent = this;
	
	mesh.position.x -= this.position.x;
	mesh.position.y -= this.position.y;
	mesh.position.z -= this.position.z;
	
	mesh.rotation.x -= this.rotation.x;
	mesh.rotation.y -= this.rotation.y;
	mesh.rotation.z -= this.rotation.z;
};

},{"./KTMath":25,"./KTMatrix4":27,"./KTVector2":39,"./KTVector3":40}],31:[function(require,module,exports){
var Vector2 = require('./KTVector2');
var Vector3 = require('./KTVector3');
var Input = require('./KTInput');
var KTMath = require('./KTMath');

function OrbitAndPan(target){
	this.__ktCamCtrls = true;
	
	this.camera = null;
	this.lastDrag = null;
	this.lastPan = null;
	this.target = (target)? target : new Vector3(0.0, 0.0, 0.0);
	this.angle = new Vector2(0.0, 0.0);
	this.zoom = 1;
	this.sensitivity = new Vector2(0.5, 0.5);
}

module.exports = OrbitAndPan;

OrbitAndPan.prototype.update = function(){
	if (this.camera.locked) return;
	
	if (Input.isWheelMoved(Input.vMouse.WHEELUP)){ this.zoom -= 0.3; this.setCameraPosition(); }
	else if (Input.isWheelMoved(Input.vMouse.WHEELDOWN)){ this.zoom += 0.3; this.setCameraPosition(); }
	
	if (Input.isMouseDown(Input.vMouse.LEFT)){
		if (this.lastDrag == null) this.lastDrag = Input._mouse.position.clone();
		
		var dx = Input._mouse.position.x - this.lastDrag.x;
		var dy = Input._mouse.position.y - this.lastDrag.y;
		
		if (dx != 0.0 || dy != 0.0){
			this.angle.x -= KTMath.degToRad(dx * this.sensitivity.x);
			this.angle.y -= KTMath.degToRad(dy * this.sensitivity.y);
			
			this.setCameraPosition();
		}
		
		this.lastDrag.copy(Input._mouse.position);
	}else{
		this.lastDrag = null;
	}
	
	if (Input.isMouseDown(Input.vMouse.RIGHT)){
		if (this.lastPan == null) this.lastPan = Input._mouse.position.clone();
		
		var dx = Input._mouse.position.x - this.lastPan.x;
		var dy = Input._mouse.position.y - this.lastPan.y;
		
		if (dx != 0.0 || dy != 0.0){
			var theta = -this.angle.y;
			var ang = -this.angle.x - KTMath.PI_2;
			var cos = Math.cos(ang);
			var sin = Math.sin(ang);
			var cosT = Math.cos(theta);
			var sinT = Math.sin(theta);
			
			this.target.x -= cos * dx * this.sensitivity.x / 10;
			this.target.y += cosT * dy * this.sensitivity.y / 10;
			this.target.z -= sin * dx * this.sensitivity.x / 10;
			
			this.setCameraPosition();
		}
		
		this.lastPan.copy(Input._mouse.position);
	}else{
		this.lastPan = null;
	}
};

OrbitAndPan.prototype.setCameraPosition = function(){
	this.angle.x = (this.angle.x + KTMath.PI2) % KTMath.PI2;
	this.angle.y = (this.angle.y + KTMath.PI2) % KTMath.PI2;
	
	if (this.angle.y < KTMath.PI && this.angle.y >= KTMath.PI_2) this.angle.y = KTMath.degToRad(89.9);
	if (this.angle.y > KTMath.PI && this.angle.y <= KTMath.PI3_2) this.angle.y = KTMath.degToRad(270.9);
	if (this.zoom <= 0.3) this.zoom = 0.3;
	
	var cosT = Math.cos(this.angle.y);
	var sinT = Math.sin(this.angle.y);
	
	var x = this.target.x + Math.cos(this.angle.x) * cosT * this.zoom;
	var y = this.target.y + sinT * this.zoom;
	var z = this.target.z - Math.sin(this.angle.x) * cosT * this.zoom;
	
	this.camera.position.set(x, y, z);
	this.camera.lookAt(this.target);
};

OrbitAndPan.prototype.setCamera = function(camera){
	var zoom = Vector3.vectorsDifference(camera.position, this.target).length();
	this.camera = camera;
	this.zoom = zoom;
	this.angle.x = KTMath.get2DAngle(this.target.x, this.target.z, camera.position.x, camera.position.z);
	this.angle.y = KTMath.get2DAngle(0, camera.position.y, zoom, this.target.y);
	
	this.setCameraPosition();
};

},{"./KTInput":16,"./KTMath":25,"./KTVector2":39,"./KTVector3":40}],32:[function(require,module,exports){
var KT = require('./KTMain');
var Color = require('./KTColor');
var Material = require('./KTMaterial');
var MaterialBasic = require('./KTMaterialBasic');
var Matrix4 = require('./KTMatrix4');
var GeometrySkybox = require('./KTGeometrySkybox');

function Scene(params){
	this.__ktscene = true;
	
	this.meshes = [];
	this.lights = [];
	this.shadingMode = ['BASIC', 'LAMBERT'];
	
	if (!params) params = {};
	this.useLighting = (params.useLighting)? true : false;
	this.ambientLight = (params.ambientLight)? new Color(params.ambientLight) : null;
	
	this.setShadowMaterial();
}

module.exports = Scene;

Scene.prototype.setShadowMaterial = function(){
	var T = this;
	
	this.shadowMapping = null;
	this.shadowMat = new Material({
		shader: KT.shaders.depth,
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
		sendUniformData: function(mesh, camera, scene){
			var gl = KT.gl;
			var uniforms = this.shader.uniforms;
			for (var i=0,len=uniforms.length;i<len;i++){
				var uni = uniforms[i];
				
				if (uni.name == 'uMVPMatrix'){
					var mvp = mesh.getTransformationMatrix(camera).multiply(camera.transformationMatrix).multiply(camera.perspectiveMatrix);
					gl.uniformMatrix4fv(uni.location, false, mvp.toFloat32Array());
				}else if (uni.name == 'uDepthMult'){
					gl.uniform1f(uni.location, (T.shadowMapping.__ktdirLight)? -1 : 1);
				}
			}
		}
	});
};

Scene.prototype.add = function(object){
	if (object.__ktmesh){
		this.meshes.push(object);
	}else if (object.__ktdirLight || object.__ktpointlight || object.__ktspotlight){
		this.lights.push(object);
	}else{
		throw "Can't add the object to the scene";
	}
	
	return this;
};

Scene.prototype.drawMesh = function(mesh, camera){
	if (!mesh.geometry.ready) return;
	if (this.shadowMapping && !mesh.castShadow) return;
	
	var gl = KT.gl;
	
	var material = (this.shadowMapping)? this.shadowMat : mesh.material;
	var shader = material.shader;
	
	KT.switchProgram(shader);
	this.setMaterialAttributes(mesh.material);
	
	if (mesh.geometry.autoUpdate) mesh.geometry.updateGeometry();
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
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.viewport(0,0,framebuffer.width,framebuffer.height);
	this.render(camera);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.viewport(0,0,gl.width,gl.height);
};

Scene.prototype.render = function(camera){
	var gl = KT.gl;
	
	
	if (!this.shadowMapping){
		if (KT.modules.shadowMapping){
			for (var i=0,len=this.lights.length-1;i<=len;i++){
				if (this.lights[i].castShadow){
					this.shadowMapping = this.lights[i];
					this.renderToFramebuffer(this.lights[i].shadowCam, this.lights[i].shadowBuffer);
				}
				
				if (i == len){
					this.shadowMapping = null;
				}
			}
		}
		
		if (camera.controls) camera.controls.update();
	}
	
	gl.disable( gl.BLEND ); 
	var transparents = [];
	
	for (var i=0,mesh;mesh=this.meshes[i];i++){
		if (mesh.remove){
			this.meshes.splice(i, 1);
			i--;
			continue;
		}
		
		if (!mesh.visible) continue;
		if (mesh.material.opacity == 0.0) continue;
		
		if (mesh.material.opacity != 1.0 || mesh.material.transparent){
			if (!transparents[mesh.order]){
				transparents[mesh.order] = mesh;
			}else{
				transparents.splice(mesh.order, 0, mesh);
			}
			
			continue;
		}
		
		this.drawMesh(mesh, camera);
	}
	
	if (!this.shadowMapping && camera.skybox){
		this.drawSkybox(camera.skybox, camera);
	}
	
	gl.enable( gl.BLEND ); 
	for (var i in transparents){
		if (transparents[i])
			this.drawMesh(transparents[i], camera);
	}
	
	return this;
};

Scene.prototype.drawSkybox = function(skybox, camera){
	var gl = KT.gl;
	
	KT.switchProgram(GeometrySkybox.material.shader);
	
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.FRONT);
    gl.depthFunc(gl.LEQUAL);
	
	skybox.render(camera, this);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skybox.boxGeo.facesBuffer);
	gl.drawElements(gl.TRIANGLES, skybox.boxGeo.facesBuffer.numItems, gl.UNSIGNED_SHORT, 0);
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

Scene.prototype.getMeshLights = function(mesh){
	var geometry = mesh.geometry;
	
	return this.lights;
};

},{"./KTColor":5,"./KTGeometrySkybox":13,"./KTMain":20,"./KTMaterial":21,"./KTMaterialBasic":22,"./KTMatrix4":27}],33:[function(require,module,exports){
var structs = {
	Light: "struct Light{ " +
	    "lowp vec3 position; " +
	    "lowp vec3 color; " +
	    "lowp vec3 direction; " +
	    "lowp vec3 spotDirection; " +
	    "lowp float intensity; " +
	    "lowp float innerAngle; " +
	    "lowp float outerAngle; " +
	    "lowp float shadowStrength; " +
	    "lowp float lightMult; " + 
	    "bool castShadow; " +
	    "mediump mat4 mvProjection; " +
	"}; "
};

var functions = {
	calcShadowFactor : "lowp float calcShadowFactor(sampler2D shadowMap, mediump vec4 lightSpacePos, lowp float shadowStrength, lowp float lightMult){ " +
		"if (!uReceiveShadow) " +
			"return 1.0; " +
	    "mediump vec3 projCoords = lightSpacePos.xyz / lightSpacePos.w; " +
	    "mediump vec2 UVCoords; " +
	    "UVCoords.x = projCoords.x; " +
	    "UVCoords.y = projCoords.y; " +
	    "projCoords.z *= lightMult; " +
	    
	    "bvec4 inTexture = bvec4(UVCoords.x >= 0.0, UVCoords.y >= 0.0, UVCoords.x < 1.0, UVCoords.y < 1.0); " +
	    "if (!all(inTexture)) " +
	    	"return 1.0; " +
	    
	    "mediump float z = (1.0 - projCoords.z) * 15.0; " +
	    "if (lightMult == 1.0) z = 1.0 - z; " +
	    "z = min(z, 1.0); " +
			    	
	    "mediump vec4 texCoord = texture2D(shadowMap, UVCoords);" +
	    "mediump float depth = texCoord.x; " +
	    	
	    "if (depth < (z - 0.005)) " +
	        "return shadowStrength; " + 
	    "return 1.0; " +
	"} ",
	
	setLightPosition: "void setLightPosition(int index, mediump vec4 position){ " +
		"if (index == 0){ vLightPosition[0] = position; return; }" +
		"if (index == 1){ vLightPosition[1] = position; return; }" +
		"if (index == 2){ vLightPosition[2] = position; return; }" +
		"if (index == 3){ vLightPosition[3] = position; return; }" +
	"} ",
	
	getLightPosition: "mediump vec4 getLightPosition(int index){ " +
		"if (index == 0){ return vLightPosition[0]; }" +
		"if (index == 1){ return vLightPosition[1]; }" +
		"if (index == 2){ return vLightPosition[2]; }" +
		"if (index == 3){ return vLightPosition[3]; }" +
		"return vec4(0.0); " +
	"} ",
	
	getLightWeight: "mediump vec3 getLightWeight(mediump vec3 normal, mediump vec3 direction, lowp vec3 color, lowp float intensity){ " +
		"mediump float lightDot = max(dot(normal, direction), 0.0); " +
		"mediump vec3 lightWeight = (color * lightDot * intensity); " +
		"return lightWeight; " +
	"}"
};

module.exports = {
	basic: {
		vertexShader: 
			"attribute mediump vec2 aTextureCoord; " +
			"attribute mediump vec3 aVertexPosition; " +
			"attribute lowp vec4 aVertexColor; " +
			
			"uniform mediump mat4 uMVPMatrix; " +
			"uniform lowp vec4 uMaterialColor; " +
			
			"varying mediump vec4 vVertexColor; " +
			"varying mediump vec2 vTextureCoord;" +  
			
			"void main(void){ " + 
				"gl_Position = uMVPMatrix * vec4(aVertexPosition, 1.0); " +
			
				"vVertexColor = aVertexColor * uMaterialColor; " +
				"vTextureCoord = aTextureCoord; " + 
			"} " ,
			
		fragmentShader: 
			"uniform sampler2D uTextureSampler; " +
			"uniform bool uHasTexture; " +
			"uniform lowp vec2 uTextureRepeat; " +
			"uniform lowp vec2 uTextureOffset; " +
			"uniform mediump vec4 uGeometryUV; " +
			"uniform lowp float uOpacity; " +
			
			"varying mediump vec2 vTextureCoord; " + 
			"varying mediump vec4 vVertexColor; " + 
			
			"void main(void){ " +
				"mediump vec4 color = vVertexColor; " + 
				"if (uHasTexture){ " + 
					"mediump float tx = uGeometryUV.x + mod(uTextureOffset.x + vTextureCoord.s * uTextureRepeat.x - uGeometryUV.x, uGeometryUV.z - uGeometryUV.x);" +
					"mediump float ty = uGeometryUV.y + mod(uTextureOffset.y + vTextureCoord.t * uTextureRepeat.y - uGeometryUV.y, uGeometryUV.w - uGeometryUV.y);" +
					
					"mediump vec4 texColor = texture2D(uTextureSampler, vec2(tx, ty)); " +
					"color *= texColor; " +
				"} " + 
				
				"gl_FragColor = vec4(color.rgb, color.a * uOpacity);" + 
			"}"
	},
	
	
	lambert: {
		vertexShader: 
			structs.Light +
			    
			"attribute mediump vec2 aTextureCoord; " +
			"attribute mediump vec3 aVertexPosition; " +
			"attribute lowp vec4 aVertexColor; " +
			"attribute mediump vec3 aVertexNormal; " + 
			
			"uniform mediump mat4 uMVMatrix; " +
			"uniform mediump mat4 uPMatrix; " +
			"uniform lowp vec4 uMaterialColor; " +
			"uniform mediump mat4 uModelMatrix; " +
			"uniform mediump mat3 uNormalMatrix; " +
			"uniform lowp vec3 uAmbientLightColor; " +
			
			"uniform Light uLights[8]; " +
			"uniform lowp int uUsedLights; " +
			"uniform bool uUseLighting; " +
			
			"varying mediump vec4 vVertexColor; " +
			"varying mediump vec2 vTextureCoord;" +  
			"varying mediump vec3 vLightWeight; " + 
			
			"#kt_require(shadowmap_vert_in) " +
			functions.getLightWeight + 
			
			"void main(void){ " + 
				"vec4 modelViewPosition = uMVMatrix * vec4(aVertexPosition, 1.0); " +
				"gl_Position = uPMatrix * modelViewPosition; " +
			
				"vLightWeight = uAmbientLightColor; " +
				"if (uUseLighting){ " +
					"vec3 vertexModelPosition = (uModelMatrix * vec4(aVertexPosition, 1.0)).xyz; " +
					"lowp int shadowIndex = 0; " +
					"for (int i=0;i<8;i++){ " +
						"if (i >= uUsedLights){" +
							"break; " +
						"}" +
						
						"Light l = uLights[i]; " +
						"mediump vec3 lPos = l.position - vertexModelPosition;" +
						"mediump float lDistance = length(lPos) / 2.0; " +
						"if (length(l.position) == 0.0){ " +
							"lDistance = 1.0; " +
							"lPos = vec3(0.0); " +
						"} " +
						
						"mediump vec3 lightDirection = l.direction + normalize(lPos); " +
						
						"lowp float spotWeight = 1.0; " +
			            "if (length(l.spotDirection) != 0.0){ " +
			                "lowp float cosAngle = dot(l.spotDirection, lightDirection); " +
			            	"spotWeight = clamp((cosAngle - l.outerAngle) / (l.innerAngle - l.outerAngle), 0.0, 1.0); " +
			                "lDistance = 1.0; " +
			            "} " +
			            
						"vLightWeight += getLightWeight(aVertexNormal, lightDirection, l.color, l.intensity) * spotWeight / lDistance; " + 
						
						"#kt_require(shadowmap_vert_main) " +
					"} " +
				"} " +
				 
				"vVertexColor = aVertexColor * uMaterialColor; " +
				"vTextureCoord = aTextureCoord; " +  
			"} " ,
			
		fragmentShader:
			structs.Light +
			
			"uniform bool uUseLighting; " +
			"uniform lowp int uUsedLights; " +
			"uniform Light uLights[8]; " +
		     
			"uniform sampler2D uTextureSampler; " +
			"uniform bool uHasTexture; " +
			"uniform lowp float uOpacity; " +
			"uniform lowp vec2 uTextureRepeat; " +
			"uniform lowp vec2 uTextureOffset; " +
			"uniform mediump vec4 uGeometryUV; " +
			
			"varying mediump vec2 vTextureCoord; " + 
			"varying mediump vec4 vVertexColor; " + 
			"varying mediump vec3 vLightWeight; " + 
			
			"#kt_require(shadowmap_frag_in) " +
			
			"void main(void){ " +
				"mediump vec4 color = vVertexColor; " + 
				"if (uHasTexture){ " + 
					"mediump float tx = uGeometryUV.x + mod(uTextureOffset.x + vTextureCoord.s * uTextureRepeat.x - uGeometryUV.x, uGeometryUV.z - uGeometryUV.x);" +
					"mediump float ty = uGeometryUV.y + mod(uTextureOffset.y + vTextureCoord.t * uTextureRepeat.y - uGeometryUV.y, uGeometryUV.w - uGeometryUV.y);" +
					
					"mediump vec4 texColor = texture2D(uTextureSampler, vec2(tx, ty)); " +
					"color *= texColor; " +
				"} " + 
				
				"mediump vec3 lightWeight = vLightWeight; " +
				"if (uUseLighting){ " +
					"lowp int shadowIndex = 0; " +
					"for (int i=0;i<8;i++){ " +
						"Light l = uLights[i]; " +
						"if (i >= uUsedLights){" +
							"break; " +
						"}" +
						
						"lowp float shadowWeight = 1.0; " +
			            "#kt_require(shadowmap_frag_main) " +
			            
			            "lightWeight *= shadowWeight; " +
					"} " + 
				"} " +
				
				"color.rgb *= lightWeight; " + 
				"gl_FragColor = vec4(color.rgb, color.a * uOpacity); " + 
			"}"
	},
	
	
	phong: {
		vertexShader:
			structs.Light + 
			 
			"attribute mediump vec2 aTextureCoord; " +
			"attribute mediump vec3 aVertexPosition; " +
			"attribute lowp vec4 aVertexColor; " +
			"attribute mediump vec3 aVertexNormal; " + 
			
			"uniform mediump mat4 uMVMatrix; " +
			"uniform mediump mat4 uPMatrix; " +
			"uniform mediump mat4 uModelMatrix; " +
			"uniform mediump mat3 uNormalMatrix; " +
			"uniform lowp vec4 uMaterialColor; " +
			"uniform lowp vec3 uAmbientLightColor; " +
			
			"uniform bool uUseLighting; " +
			"uniform lowp int uUsedLights; " +
			"uniform Light uLights[8]; " +
			
			"varying mediump vec4 vVertexColor; " +
			"varying mediump vec2 vTextureCoord;" +  
			"varying mediump vec3 vLightWeight; " +
			"varying mediump vec3 vNormal; " + 
			"varying mediump vec3 vPosition; " +
			
			"#kt_require(shadowmap_vert_in) " +
			
			"void main(void){ " + 
				"vec4 modelViewPosition = uMVMatrix * vec4(aVertexPosition, 1.0); " +
				"gl_Position = uPMatrix * modelViewPosition; " +
			
				"if (uUseLighting){ " + 
					"vNormal = uNormalMatrix * aVertexNormal; " +
					"vLightWeight = uAmbientLightColor; " +
					
					"int shadowIndex = 0; " +
					"for (int i=0;i<8;i++){ " +
						"if (i >= uUsedLights) break; " +
						
						"#kt_require(shadowmap_vert_main) " +
					"} " +
				"}else{ " +
					"vLightWeight = vec3(1.0); " + 
				"}" +   
				 
				"vPosition = (uModelMatrix * vec4(aVertexPosition, 1.0)).xyz; " +
				"vVertexColor = aVertexColor * uMaterialColor; " +
				"vTextureCoord = aTextureCoord; " +  
			"} " ,
			
		fragmentShader: 
			structs.Light + 
			
			"uniform bool uUseLighting; " +
			"uniform lowp int uUsedLights; " +
			"uniform Light uLights[8]; " +
			
			"uniform bool uHasTexture; " +
			"uniform sampler2D uTextureSampler; " +
			
			"uniform lowp float uOpacity; " +
			"uniform lowp vec2 uTextureRepeat; " +
			"uniform lowp vec2 uTextureOffset; " +
			"uniform lowp float uShininess; " +
			"uniform mediump vec4 uGeometryUV; " +
			
			"uniform mediump vec3 uCameraPosition; " +
			
			"varying mediump vec2 vTextureCoord; " + 
			"varying mediump vec4 vVertexColor; " + 
			"varying mediump vec3 vLightWeight; " + 
			"varying mediump vec3 vNormal; " + 
			"varying mediump vec3 vPosition; " +

			"#kt_require(specular_in) " +
			"#kt_require(shadowmap_frag_in) " +			
			functions.getLightWeight + 
			
			"void main(void){ " +
				"mediump vec4 color = vVertexColor; " +
				"mediump vec3 normal = normalize(vNormal); " +
				"mediump vec3 cameraDirection = normalize(uCameraPosition); " +
				
				"mediump float tx; " +
				"mediump float ty; " +
				
				"if (uHasTexture){ " + 
					"tx = uGeometryUV.x + mod(uTextureOffset.x + vTextureCoord.s * uTextureRepeat.x - uGeometryUV.x, uGeometryUV.z - uGeometryUV.x);" +
					"ty = uGeometryUV.y + mod(uTextureOffset.y + vTextureCoord.t * uTextureRepeat.y - uGeometryUV.y, uGeometryUV.w - uGeometryUV.y);" +
					
					"mediump vec4 texColor = texture2D(uTextureSampler, vec2(tx, ty)); " +
					"color *= texColor; " +
				"} " + 
				
				"mediump vec3 phongLightWeight = vec3(0.0); " + 
				"if (uUseLighting){ " +
					"int shadowIndex = 0; " +
					"for (int i=0;i<8;i++){ " +
						"if (i >= uUsedLights) break; " +
						
						"Light l = uLights[i]; " +
						"mediump vec3 lPos = l.position - vPosition;" +
						"mediump float lDistance = length(lPos) / 2.0; " +
						"if (length(l.position) == 0.0){ " +
							"lDistance = 1.0; " +
							"lPos = vec3(0.0); " +
						"} " +
						
						"mediump vec3 lightDirection = l.direction + normalize(lPos); " +
						
						"lowp float spotWeight = 1.0; " +
			            "if (length(l.spotDirection) != 0.0){ " +
			                "lowp float cosAngle = dot(l.spotDirection, lightDirection); " +
			            	"spotWeight = clamp((cosAngle - l.outerAngle) / (l.innerAngle - l.outerAngle), 0.0, 1.0); " +
			                "lDistance = 1.0; " +
			            "} " +
			            
			            "lowp float shadowWeight = 1.0; " +
			            "mediump vec3 lWeight = getLightWeight(normal, lightDirection, l.color, l.intensity); " +
			            
			            "#kt_require(shadowmap_frag_main) " +
			            
						"phongLightWeight += shadowWeight * lWeight * spotWeight / lDistance; " + 
						
						"if (shadowWeight == 1.0){ " +
							"#kt_require(specular_main) " +
						"}" + 
					"} " +
				"} " +
				
				"color.rgb *= vLightWeight + phongLightWeight; " + 
				"gl_FragColor = vec4(color.rgb, color.a * uOpacity); " + 
			"}"
	},
	
	depthMap: {
		vertexShader: 
			"attribute mediump vec3 aVertexPosition; " +
			
			"uniform mediump mat4 uMVPMatrix; " +
			
			"varying mediump vec4 vVertexDepth; " + 
			
			"void main(void){ " + 
				"gl_Position = uMVPMatrix * vec4(aVertexPosition, 1.0); " +
				"vVertexDepth = gl_Position; " +
			"} ",
			
		fragmentShader:
			"uniform lowp float uDepthMult; " +
			
			"varying mediump vec4 vVertexDepth; " +  
			
			"void main(void){ " +
				"lowp float depth = uDepthMult * vVertexDepth.z / vVertexDepth.w; " +
			    "depth =  (1.0 - depth) * 15.0; " +
			    
			    "if (uDepthMult == 1.0) " +
			    	"depth = 1.0 - depth; " +
			    
			    "gl_FragColor = vec4(depth, depth, depth, 1.0); " +
			"}"
	},
	
	skybox: {
		vertexShader: 
			"attribute mediump vec3 aVertexPosition; " +
			
			"uniform mediump mat4 uMVPMatrix; " +
			
			"varying mediump vec3 vTextureCoord;" +
			
			"void main(void){ " + 
				"mediump vec4 vPos = uMVPMatrix * vec4(aVertexPosition, 1.0); " +
				"gl_Position = vPos.xyww; " +
				"vTextureCoord = aVertexPosition; " +
			"} ",
			
		fragmentShader:
			"uniform samplerCube uCubemap; " +
			
			"varying mediump vec3 vTextureCoord;" +  
			
			"void main(void){ " +
			    "gl_FragColor = textureCube(uCubemap, vTextureCoord); " +
			"}"
	},
	
	modulars: {
		specular_in: 
			"uniform bool uUseSpecularMap; " +
			"uniform sampler2D uSpecularMapSampler; " +
			"uniform lowp vec3 uSpecularColor; ",
			
		specular_main: 
			"lowp float shininess = uShininess; " + 
			"if (uUseSpecularMap){ " +
				"shininess = texture2D(uSpecularMapSampler, vec2(tx, ty)).r * 255.0; " +
			"} " +
			
			"if (shininess > 0.0 && shininess < 255.0){ " +
				"mediump vec3 halfAngle = normalize(cameraDirection + lightDirection); " +
				"mediump float specDot = max(dot(halfAngle, normal), 0.0); " +
				"color += vec4(uSpecularColor, 1.0) * pow(specDot, shininess); " + 
			"} ",
		
		
			
		shadowmap_vert_in:
			"uniform bool uReceiveShadow; " +
			"varying mediump vec4 vLightPosition[4]; " +
			functions.setLightPosition,
		
		shadowmap_vert_main:
			"if (uLights[i].castShadow && uReceiveShadow){ " +
				"mediump vec4 lightProj = uLights[i].mvProjection * vec4(aVertexPosition, 1.0); " +
				"setLightPosition(shadowIndex++, lightProj); " +
			"} ",
		
			
		shadowmap_frag_in:
			"uniform bool uReceiveShadow; " +
			"uniform sampler2D uShadowMaps[8]; " +
			"varying mediump vec4 vLightPosition[4]; " +
			functions.calcShadowFactor +
			functions.getLightPosition,
		
		shadowmap_frag_main:
			"if (l.castShadow){ " +
            	"shadowWeight = calcShadowFactor(uShadowMaps[i], getLightPosition(shadowIndex++), l.shadowStrength, l.lightMult); " +
            "} " 
	}
};
},{}],34:[function(require,module,exports){
var KT = require('./KTMain');
var Utils = require('./KTUtils');
var Vector2 = require('./KTVector2');

function Texture(src, params){
	this.__kttexture = true;
	
	var gl = KT.gl;
	
	if (!params) params = {};
	this.params = params;
	this.minFilter = (params.minFilter)? params.minFilter : gl.LINEAR;
	this.magFilter = (params.magFilter)? params.magFilter : gl.LINEAR;
	this.wrapS = (params.SWrapping)? params.SWrapping : gl.REPEAT;
	this.wrapT = (params.TWrapping)? params.TWrapping : gl.REPEAT;
	this.repeat = (params.repeat)? params.repeat : new Vector2(1.0, 1.0);
	this.offset = (params.offset)? params.offset : new Vector2(0.0, 0.0);
	this.generateMipmap = (params.generateMipmap)? true : false;
	
	this.texture = null;
	
	if (src.data && src.data instanceof Uint8Array){
		this.image = src;
		this.image.ready = true;
		this.parseTexture();
	}else{
		var T = this;
		this.image = KT.loadImage(src, function(image){
			T.parseTexture();
		});
	}
}

module.exports = Texture;

Texture.prototype.parseTexture = function(){
	var gl = KT.gl;
	
	this.texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	
	if (this.image instanceof Image){
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
	}else if (this.image.data && this.image.data instanceof Uint8Array){
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.image.width, this.image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.image.data);
	}
	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
	
	if (this.generateMipmap)
		gl.generateMipmap(gl.TEXTURE_2D);
	
	gl.bindTexture(gl.TEXTURE_2D, null);
};

Texture.prototype.clone = function(){
	return new Texture(this.image.src, this.params);
};

},{"./KTMain":20,"./KTUtils":38,"./KTVector2":39}],35:[function(require,module,exports){
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
	var T = this;
	var image = KT.loadImage(src, function(image){
		T.parseTexture();
	});
	
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
	
	for (var i=0;i<6;i++){
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
		gl.texImage2D(types[i], 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.images[i]);
	}
	
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.magFilter);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.minFilter);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this.wrapS);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this.wrapT);
	
	if (this.generateMipmap)
		gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
	
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
};

},{"./KTMain":20,"./KTUtils":38,"./KTVector2":39}],36:[function(require,module,exports){
var KT = require('./KTMain');
var Vector2 = require('./KTVector2');
var Vector4 = require('./KTVector4');

function TextureFont(imageSrc, charWidth, charHeight, charList){
	this.__ktfontspr = true;
	
	this.imageSrc = imageSrc;
	this.charWidth = charWidth;
	this.charHeight = charHeight;
	this.charList = charList;
	this.hCharNum = 0;
	
	this.texture = null;
	this.repeat = new Vector2(1.0, 1.0);
	this.offset = new Vector2(0.0, 0.0);
	
	var T = this;
	this.image = KT.loadImage(imageSrc, function(sprite){
		T.hCharNum = sprite.width / T.charWidth;
		T.parseImageData();
		T.parseTexture();
	});
}

module.exports = TextureFont;

TextureFont.prototype.parseImageData = function(){
	var cnv = document.createElement("canvas");
	cnv.width = this.image.width;
	cnv.height = this.image.height;
	
	var ctx = cnv.getContext("2d");
	ctx.drawImage(this.image, 0, 0);
	
	var imageData = ctx.getImageData(0,0,this.image.width,this.image.height);
	var dataArr = [];
	
	var charWidths = [];
	var cW = 0;
	var ci = 0;
	
	for (var i=0,len=imageData.data.length;i<len;i+=4){
		var r = imageData.data[i];
		var g = imageData.data[i+1];
		var b = imageData.data[i+2];
		var a = imageData.data[i+3];
		
		if (r == 255 && g == 0 && b == 255){
			a = 0;
			cW += 1;
			charWidths[ci] = cW;
		}else if (cW > 0){
			ci += 1;
			cW = 0;
		}
		
		dataArr.push(r, g, b, a);
	}
	
	this.charWidths = charWidths;
	this.imageData = new Uint8Array(dataArr);
};

TextureFont.prototype.parseTexture = function(){
	var gl = KT.gl;
	
	this.texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.image.width, this.image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.imageData);
	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	
	gl.bindTexture(gl.TEXTURE_2D, null);
};

TextureFont.prototype.getUVCoords = function(character){
	if (!this.image.ready) throw "Texture Font is not ready!";
	
	var ind = this.charList.indexOf(character);
	if (ind == -1) ind = 0;
	
	var xPos = ((ind * this.charWidth) % this.image.width) / this.image.width;
	var yPos = (Math.floor(ind / this.hCharNum) * this.charHeight) / this.image.height;
	var width = xPos + (this.charWidth / this.image.width) * this.getCharaWidth(character);
	var height = yPos + (this.charHeight / this.image.height);
	
	return new Vector4(xPos, height, width, yPos);
};

TextureFont.prototype.getCharaWidth = function(character){
	if (!this.image.ready) throw "Texture Font is not ready!";
	
	var ind = this.charList.indexOf(character);
	if (ind == -1) return 1.0;
	
	return (this.charWidths[ind] + 1) / this.charWidth;
};

},{"./KTMain":20,"./KTVector2":39,"./KTVector4":41}],37:[function(require,module,exports){
var KT = require('./KTMain');
var Vector2 = require('./KTVector2');

function TextureFramebuffer(width, height, params){
	this.__kttextureframebuffer = true;
	
	var gl = KT.gl;
	
	this.width = width;
	this.height = height;
	
	if (!params) params = {};
	this.params = params;
	this.minFilter = (params.minFilter)? params.minFilter : gl.LINEAR;
	this.magFilter = (params.magFilter)? params.magFilter : gl.LINEAR;
	this.wrapS = (params.SWrapping)? params.SWrapping : gl.CLAMP_TO_EDGE;
	this.wrapT = (params.TWrapping)? params.TWrapping : gl.CLAMP_TO_EDGE;
	this.repeat = (params.repeat)? params.repeat : new Vector2(1.0, 1.0);
	this.offset = (params.offset)? params.offset : new Vector2(0.0, 0.0);
	this.generateMipmap = (params.generateMipmap)? true : false;
	
	this.framebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
	this.framebuffer.width = width;
	this.framebuffer.height = height;
	
	this.texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
	
	if (this.generateMipmap)
		gl.generateMipmap(gl.TEXTURE_2D);
		
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	
	
	this.renderBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
	
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
}

module.exports = TextureFramebuffer;
},{"./KTMain":20,"./KTVector2":39}],38:[function(require,module,exports){
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
	},
	
	getHttp: function(){
		if (window.XMLHttpRequest){
			return new XMLHttpRequest();
		}else if (window.ActiveXObject){
			http = new window.ActiveXObject("Microsoft.XMLHTTP");
		}
		
		return null;
	},
	
	getFileContent: function(fileURL, callback){
		var http = this.getHttp();
		http.open('GET', fileURL, true);
		http.onreadystatechange = function() {
	  		if (http.readyState == 4 && http.status == 200) {
				if (callback){
					callback(http.responseText);
				}
			}
		};
		http.send();
	}
};

},{}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
function Vector4(x, y, z, w){
	this.__ktv4 = true;
	
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
};

module.exports = Vector4;

Vector4.prototype.length = function(){
	var length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	
	return length;
};

Vector4.prototype.normalize = function(){
	var length = this.length();
	
	this.x /= length;
	this.y /= length;
	this.z /= length;
	this.w /= length;
	
	return this;
};

Vector4.prototype.dot = function(vector4){
	if (!vector4.__ktv4) throw "Can only perform a dot product with a vector4";
	
	return this.x * vector4.x + this.y * vector4.y + this.z * vector4.z + this.w * vector4.w;
};

Vector4.prototype.invert = function(){
	return this.multiply(-1);
};

Vector4.prototype.multiply = function(number){
	this.x *= number;
	this.y *= number;
	this.z *= number;
	this.w *= number;
	
	return this;
};

Vector4.prototype.add = function(vector4){
	if (!vector4.__ktv4) throw "Can only add a vector4 to this vector";
	
	this.x += vector4.x;
	this.y += vector4.y;
	this.z += vector4.z;
	this.w += vector4.w;
	
	return this;
};

Vector4.prototype.copy = function(vector4){
	if (!vector4.__ktv4) throw "Can only copy a vector4 to this vector";
	
	this.x = vector4.x;
	this.y = vector4.y;
	this.z = vector4.z;
	this.w = vector4.w;
	
	return this;
};

Vector4.prototype.set = function(x, y, z, w){
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
	
	return this;
};

Vector4.prototype.clone = function(){
	return new vector4(this.x, this.y, this.z, this.w);
};

Vector4.prototype.equals = function(vector4){
	if (!vector4.__ktv4) throw "Can only copy a vector4 to this vector";
	
	return (this.x == vector4.x && this.y == vector4.y && this.z == vector4.z && this.w == vector4.w);
};

Vector4.vectorsDifference = function(vector4_a, vector4_b){
	if (!vector4_a.__ktv4) throw "Can only create this vector using 2 vectors4";
	if (!vector4_b.__ktv4) throw "Can only create this vector using 2 vectors4";
	
	return new vector4(vector4_a.x - vector4_b.x, vector4_a.y - vector4_b.y, vector4_a.z - vector4_b.z, vectpr4_a.w - vector4_b.w);
};
},{}],42:[function(require,module,exports){
var KT = require('./KTMain');
KT.CameraFly = require('./KTCameraFly');
KT.CameraOrtho = require('./KTCameraOrtho');
KT.CameraPerspective = require('./KTCameraPerspective');
KT.Color = require('./KTColor');
KT.Geometry = require('./KTGeometry');
KT.Geometry3DModel = require('./KTGeometry3DModel');
KT.GeometryBillboard = require('./KTGeometryBillboard');
KT.GeometryBox = require('./KTGeometryBox');
KT.GeometryCylinder = require('./KTGeometryCylinder');
KT.GeometryPlane = require('./KTGeometryPlane');
KT.GeometrySkybox = require('./KTGeometrySkybox');
KT.GeometrySphere = require('./KTGeometrySphere');
KT.GeometryText = require('./KTGeometryText');
KT.GeometryGUITexture = require('./KTGeometryGUITexture');
KT.LightDirectional = require('./KTLightDirectional');
KT.LightPoint = require('./KTLightPoint');
KT.LightSpot = require('./KTLightSpot');
KT.Input = require('./KTInput');
KT.Material = require('./KTMaterial');
KT.MaterialBasic = require('./KTMaterialBasic');
KT.MaterialLambert = require('./KTMaterialLambert');
KT.MaterialPhong = require('./KTMaterialPhong');
KT.Math = require('./KTMath');
KT.Matrix3 = require('./KTMatrix3');
KT.Matrix4 = require('./KTMatrix4');
KT.Mesh = require('./KTMesh');
KT.MeshSprite = require('./KTMeshSprite');
KT.Object3D = require('./KTObject3D');
KT.OrbitAndPan = require('./KTOrbitAndPan');
KT.Texture = require('./KTTexture');
KT.TextureCube = require('./KTTextureCube');
KT.TextureFont = require('./KTTextureFont');
KT.TextureFramebuffer = require('./KTTextureFramebuffer');
KT.Utils = require('./KTUtils');
KT.Vector2 = require('./KTVector2');
KT.Vector3 = require('./KTVector3');
KT.Vector4 = require('./KTVector4');
KT.Scene = require('./KTScene');

module.exports = KT;
},{"./KTCameraFly":1,"./KTCameraOrtho":2,"./KTCameraPerspective":3,"./KTColor":5,"./KTGeometry":6,"./KTGeometry3DModel":7,"./KTGeometryBillboard":8,"./KTGeometryBox":9,"./KTGeometryCylinder":10,"./KTGeometryGUITexture":11,"./KTGeometryPlane":12,"./KTGeometrySkybox":13,"./KTGeometrySphere":14,"./KTGeometryText":15,"./KTInput":16,"./KTLightDirectional":17,"./KTLightPoint":18,"./KTLightSpot":19,"./KTMain":20,"./KTMaterial":21,"./KTMaterialBasic":22,"./KTMaterialLambert":23,"./KTMaterialPhong":24,"./KTMath":25,"./KTMatrix3":26,"./KTMatrix4":27,"./KTMesh":28,"./KTMeshSprite":29,"./KTObject3D":30,"./KTOrbitAndPan":31,"./KTScene":32,"./KTTexture":34,"./KTTextureCube":35,"./KTTextureFont":36,"./KTTextureFramebuffer":37,"./KTUtils":38,"./KTVector2":39,"./KTVector3":40,"./KTVector4":41}],43:[function(require,module,exports){
window.KT = require('./KramTech');
},{"./KramTech":42}]},{},[43]);
