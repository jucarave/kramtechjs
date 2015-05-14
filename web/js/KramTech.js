(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraFly.js":[function(require,module,exports){
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
	if (this.onlyOnLock && !Input.mouseLocked) return;
	
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
	this.angle.y = (-KTMath.get2DAngle(0, camera.position.y, zoom, this.target.y) + KTMath.PI2) % KTMath.PI2;
	
	this.setCameraPosition();
};

},{"./KTInput":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTInput.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraOrtho.js":[function(require,module,exports){
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

},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraPerspective.js":[function(require,module,exports){
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

},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometrySkybox":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometrySkybox.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js":[function(require,module,exports){
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
},{}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js":[function(require,module,exports){
var KT = require('./KTMain');
var Color = require('./KTColor');
var Matrix4 = require('./KTMatrix4');
var Vector2 = require('./KTVector2');
var Vector3 = require('./KTVector3');
var Vector4 = require('./KTVector4');

function Geometry(){
	this.__ktgeometry = true;
	
	this.vertices = [];
	this.triangles = [];
	this.uvCoords = [];
	this.colors = [];
	this.normals = [];
	this.uvRegion = new Vector4(0.0, 0.0, 1.0, 1.0);
}

module.exports = Geometry;

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

},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js","./KTVector4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry3DModel.js":[function(require,module,exports){
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

},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTUtils":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js","./KTVector4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryBox.js":[function(require,module,exports){
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
	boxGeo.build();
	
	this.vertexBuffer = boxGeo.vertexBuffer;
	this.texBuffer = boxGeo.texBuffer;
	this.facesBuffer = boxGeo.facesBuffer;
	this.colorsBuffer = boxGeo.colorsBuffer;
	this.normalsBuffer = boxGeo.normalsBuffer;
}

module.exports = GeometryBox;
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTVector4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryCylinder.js":[function(require,module,exports){
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
	
	this.vertexBuffer = cylGeo.vertexBuffer;
	this.texBuffer = cylGeo.texBuffer;
	this.facesBuffer = cylGeo.facesBuffer;
	this.colorsBuffer = cylGeo.colorsBuffer;
	this.normalsBuffer = cylGeo.normalsBuffer;
}

module.exports = GeometryCylinder;
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTVector4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryGUITexture.js":[function(require,module,exports){
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
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTVector4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryPlane.js":[function(require,module,exports){
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
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTVector4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometrySkybox.js":[function(require,module,exports){
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

},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTGeometryPlane":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryPlane.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js","./KTMaterialBasic":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialBasic.js","./KTMesh":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMesh.js","./KTVector4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometrySphere.js":[function(require,module,exports){
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
	
	this.vertexBuffer = sphGeo.vertexBuffer;
	this.texBuffer = sphGeo.texBuffer;
	this.facesBuffer = sphGeo.facesBuffer;
	this.colorsBuffer = sphGeo.colorsBuffer;
	this.normalsBuffer = sphGeo.normalsBuffer;
}

module.exports = GeometrySphere;
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTVector4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTInput.js":[function(require,module,exports){
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
},{"./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTUtils":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightDirectional.js":[function(require,module,exports){
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
},{"./KTCameraOrtho":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraOrtho.js","./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTTextureFramebuffer":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTextureFramebuffer.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightPoint.js":[function(require,module,exports){
var Color = require('./KTColor');

function LightPoint(position, intensity, distance, color){
	this.__ktpointlight = true;
	
	this.position = position;
	this.intensity = (intensity)? intensity : 1.0;
	this.distance = (distance)? distance : 1.0;
	this.color = new Color((color)? color : Color._WHITE);
}

module.exports = LightPoint;
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightSpot.js":[function(require,module,exports){
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

},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTTextureFramebuffer":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTextureFramebuffer.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js":[function(require,module,exports){
var Shaders = require('./KTShaders');
var Input = require('./KTInput');
var Matrix4 = require('./KTMatrix4');

module.exports = {
	TEXTURE_FRONT: 0,
	TEXTURE_BACK: 1,
	TEXTURE_RIGHT: 2,
	TEXTURE_LEFT: 3,
	TEXTURE_UP: 4,
	TEXTURE_DOWN: 5,
	
	init: function(canvas, params){
		this.canvas = canvas;
		this.gl = null;
		this.shaders = {};
		this.images = [];
		this.maxAttribLocations = 0;
		this.lastProgram = null;
		
		this.__initContext(canvas);
		this.__initProperties();
		this.__initShaders();
		this.__initParams();
		
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
		this.shaders.basic = this.processShader(Shaders.basic);
		this.shaders.lambert = this.processShader(Shaders.lambert);
		this.shaders.phong = this.processShader(Shaders.phong);
		this.shaders.depth = this.processShader(Shaders.depthMap);
		this.shaders.skybox = this.processShader(Shaders.skybox);
	},
	
	__initParams: function(){
		this.lightNDCMat = new Matrix4(
			0.5, 0.0, 0.0, 0.5,
			0.0, 0.5, 0.0, 0.5,
			0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 1.0
		);
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
	
	getImage: function(src){
		for (var i=0,len=this.images.length;i<len;i++){
			if (this.images[i].src == src)
				return this.images[i].img;
		}
		
		return null;
	}
};



},{"./KTInput":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTInput.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTShaders":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTShaders.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js":[function(require,module,exports){
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
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialBasic.js":[function(require,module,exports){
var Material = require('./KTMaterial');
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
			transformationMatrix = mesh.getTransformationMatrix().multiply(camera.transformationMatrix);
			var mvp = transformationMatrix.clone().multiply(camera.perspectiveMatrix);
			gl.uniformMatrix4fv(uni.location, false, mvp.toFloat32Array());
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
		}else if (uni.name == 'uTextureRepeat' && mesh.material.textureMap){
			gl.uniform2f(uni.location, mesh.material.textureMap.repeat.x, mesh.material.textureMap.repeat.y);
		}else if (uni.name == 'uGeometryUV' && mesh.material.textureMap){
			gl.uniform4f(uni.location, mesh.geometry.uvRegion.x, mesh.geometry.uvRegion.y, mesh.geometry.uvRegion.z, mesh.geometry.uvRegion.w);
		}else if (uni.name == 'uTextureOffset' && mesh.material.textureMap){
			gl.uniform2f(uni.location, mesh.material.textureMap.offset.x, mesh.material.textureMap.offset.y);
		}
	}
};

},{"./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialLambert.js":[function(require,module,exports){
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
				
			var lights = scene.lights;
			for (var j=0,jlen=lights.length;j<jlen;j++){
				this.sendLightUniformData(lights[j], uni.data[lightsCount++], modelTransformation);
			}
		}else if (uni.type == 'uShadowMaps'){
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
			gl.uniform2f(uni.location, mesh.material.textureMap.repeat.x, mesh.material.textureMap.repeat.y);
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
},{"./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialPhong.js":[function(require,module,exports){
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
		}else if (uni.type == 'uShadowMaps'){
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
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js":[function(require,module,exports){
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

},{"./KTMatrix3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMesh.js":[function(require,module,exports){
var Matrix4 = require('./KTMatrix4');
var Vector3 = require('./KTVector3');

function Mesh(geometry, material){
	if (!geometry || !geometry.__ktgeometry) throw "Geometry must be a KTGeometry instance";
	if (!material || !material.__ktmaterial) throw "Material must be a KTMaterial instance";
	
	this.__ktmesh = true;
	
	this.geometry = geometry;
	this.material = material;
	
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
	
	this.transformationMatrix = null;
	this.transformationStack = 'SRxRyRzT';
}

module.exports = Mesh;

Mesh.prototype.getTransformationMatrix = function(){
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

},{"./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMeshSprite.js":[function(require,module,exports){
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
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometryGUITexture":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryGUITexture.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMaterialBasic":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialBasic.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTTexture":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTexture.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTOrbitAndPan.js":[function(require,module,exports){
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

},{"./KTInput":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTInput.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTScene.js":[function(require,module,exports){
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
					var mvp = mesh.getTransformationMatrix().multiply(camera.transformationMatrix).multiply(camera.perspectiveMatrix);
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

Scene.prototype.render = function(camera, scene){
	var gl = KT.gl;
	
	
	if (!this.shadowMapping){
		for (var i=0,len=this.lights.length-1;i<=len;i++){
			if (this.lights[i].castShadow){
				this.shadowMapping = this.lights[i];
				this.renderToFramebuffer(this.lights[i].shadowCam, this.lights[i].shadowBuffer);
			}
			
			if (i == len){
				this.shadowMapping = null;
			}
		}
		
		if (camera.controls) camera.controls.update();
	}
	
	gl.disable( gl.BLEND ); 
	var transparents = [];
	
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
	
	if (!this.shadowMapping && camera.skybox){
		this.drawSkybox(camera.skybox, camera);
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

},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometrySkybox":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometrySkybox.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js","./KTMaterialBasic":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialBasic.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTShaders.js":[function(require,module,exports){
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
				
				"gl_FragColor = color;" + 
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
			"uniform bool uReceiveShadow; " +
			"uniform bool uUseLighting; " +
			
			"varying mediump vec4 vVertexColor; " +
			"varying mediump vec2 vTextureCoord;" +  
			"varying mediump vec3 vLightWeight; " + 
			"varying mediump vec4 vLightPosition[4]; " +
			
			functions.getLightWeight + 
			
			functions.setLightPosition +
			
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
						
						"if (l.castShadow && uReceiveShadow){ " +
							"mediump vec4 lightProj = l.mvProjection * vec4(aVertexPosition, 1.0); " +
							"setLightPosition(shadowIndex++, lightProj); " +
						"} " +
					"} " +
				"} " +
				 
				"vVertexColor = aVertexColor * uMaterialColor; " +
				"vTextureCoord = aTextureCoord; " +  
			"} " ,
			
		fragmentShader:
			structs.Light +
			
			"uniform bool uUseLighting; " +
			"uniform bool uReceiveShadow; " +
			"uniform lowp int uUsedLights; " +
			"uniform Light uLights[8]; " +
		    "uniform sampler2D uShadowMaps[8]; " +
		     
			"uniform sampler2D uTextureSampler; " +
			"uniform bool uHasTexture; " +
			"uniform lowp float uOpacity; " +
			"uniform lowp vec2 uTextureRepeat; " +
			"uniform lowp vec2 uTextureOffset; " +
			"uniform mediump vec4 uGeometryUV; " +
			
			"varying mediump vec2 vTextureCoord; " + 
			"varying mediump vec4 vVertexColor; " + 
			"varying mediump vec3 vLightWeight; " + 
			"varying mediump vec4 vLightPosition[4]; " +
			
			functions.calcShadowFactor + 
			functions.getLightPosition +
			
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
						"if (i >= uUsedLights){" +
							"break; " +
						"}" +
						
						"lowp float shadowWeight = 1.0; " +
			            "if (uLights[i].castShadow)" +
			            	"shadowWeight = calcShadowFactor(uShadowMaps[i], getLightPosition(shadowIndex++), uLights[i].shadowStrength, uLights[i].lightMult); " +
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
			"uniform bool uReceiveShadow; " +
			"uniform lowp int uUsedLights; " +
			"uniform Light uLights[8]; " +
			
			"varying mediump vec4 vVertexColor; " +
			"varying mediump vec2 vTextureCoord;" +  
			"varying mediump vec3 vLightWeight; " +
			"varying mediump vec3 vNormal; " + 
			"varying mediump vec3 vPosition; " +
			"varying mediump vec4 vLightPosition[4]; " +
			
			functions.setLightPosition +
			
			"void main(void){ " + 
				"vec4 modelViewPosition = uMVMatrix * vec4(aVertexPosition, 1.0); " +
				"gl_Position = uPMatrix * modelViewPosition; " +
			
				"if (uUseLighting){ " + 
					"vNormal = uNormalMatrix * aVertexNormal; " +
					"vLightWeight = uAmbientLightColor; " +
					
					"int shadowIndex = 0; " +
					"for (int i=0;i<8;i++){ " +
						"if (i >= uUsedLights) break; " +
						
						"if (uLights[i].castShadow && uReceiveShadow){ " +
							"mediump vec4 lightProj = uLights[i].mvProjection * vec4(aVertexPosition, 1.0); " +
							"setLightPosition(shadowIndex++, lightProj); " +
						"} " +
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
			"uniform bool uReceiveShadow; " +
			"uniform lowp int uUsedLights; " +
			"uniform Light uLights[8]; " +
		    "uniform sampler2D uShadowMaps[8]; " +
			
			"uniform bool uHasTexture; " +
			"uniform sampler2D uTextureSampler; " +
			
			"uniform bool uUseSpecularMap; " +
			"uniform sampler2D uSpecularMapSampler; " +
			
			"uniform lowp float uOpacity; " +
			"uniform lowp vec2 uTextureRepeat; " +
			"uniform lowp vec2 uTextureOffset; " +
			"uniform lowp vec3 uSpecularColor; " +
			"uniform lowp float uShininess; " +
			"uniform mediump vec4 uGeometryUV; " +
			
			"uniform mediump vec3 uCameraPosition; " +
			
			"varying mediump vec2 vTextureCoord; " + 
			"varying mediump vec4 vVertexColor; " + 
			"varying mediump vec3 vLightWeight; " + 
			"varying mediump vec3 vNormal; " + 
			"varying mediump vec3 vPosition; " +
			"varying mediump vec4 vLightPosition[4]; " +
			
			functions.getLightWeight + 
			functions.calcShadowFactor + 
			functions.getLightPosition +
			
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
			            
			            "if (l.castShadow){ " +
			            	"shadowWeight = calcShadowFactor(uShadowMaps[i], getLightPosition(shadowIndex++), l.shadowStrength, l.lightMult); " +
			            "} " + 
			            
						"phongLightWeight += shadowWeight * lWeight * spotWeight / lDistance; " + 
						
						"if (shadowWeight == 1.0){ " +
							"lowp float shininess = uShininess; " + 
							"if (uUseSpecularMap){ " +
								"shininess = texture2D(uSpecularMapSampler, vec2(tx, ty)).r * 255.0; " +
							"} " +
							
							"if (shininess > 0.0 && shininess < 255.0){ " +
								"mediump vec3 halfAngle = normalize(cameraDirection + lightDirection); " +
								"mediump float specDot = max(dot(halfAngle, normal), 0.0); " +
								"color += vec4(uSpecularColor, 1.0) * pow(specDot, shininess); " + 
							"} " +
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
	}
};
},{}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTexture.js":[function(require,module,exports){
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
	
	var img = KT.getImage(src);
	if (img){
		this.image = img;
		this.parseTexture();
	}else{
		this.image = new Image();
		this.image.src = src;
		this.image.ready = false;
		
		var T = this;
		Utils.addEvent(this.image, "load", function(){
			KT.images.push({src: src, img: T.image});
			T.parseTexture();
		});
	}
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

},{"./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTUtils":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTextureCube.js":[function(require,module,exports){
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
	var img = KT.getImage(src);
	var image;
	if (img){
		image = img;
		parseTexture();
	}else{
		image = new Image();
		image.src = src;
		image.ready = false;
		
		var T = this;
		Utils.addEvent(image, "load", function(){
			image.ready = true;
			KT.images.push({src: src, img: image});
			T.parseTexture();
		});
	}
	
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

},{"./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTUtils":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTextureFramebuffer.js":[function(require,module,exports){
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
},{"./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js":[function(require,module,exports){
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

},{}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector4.js":[function(require,module,exports){
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
},{}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KramTech.js":[function(require,module,exports){
var KT = require('./KTMain');
KT.CameraFly = require('./KTCameraFly');
KT.CameraOrtho = require('./KTCameraOrtho');
KT.CameraPerspective = require('./KTCameraPerspective');
KT.Color = require('./KTColor');
KT.Geometry = require('./KTGeometry');
KT.Geometry3DModel = require('./KTGeometry3DModel');
KT.GeometryBox = require('./KTGeometryBox');
KT.GeometryCylinder = require('./KTGeometryCylinder');
KT.GeometryPlane = require('./KTGeometryPlane');
KT.GeometrySkybox = require('./KTGeometrySkybox');
KT.GeometrySphere = require('./KTGeometrySphere');
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
KT.OrbitAndPan = require('./KTOrbitAndPan');
KT.Texture = require('./KTTexture');
KT.TextureCube = require('./KTTextureCube');
KT.TextureFramebuffer = require('./KTTextureFramebuffer');
KT.Utils = require('./KTUtils');
KT.Vector2 = require('./KTVector2');
KT.Vector3 = require('./KTVector3');
KT.Vector4 = require('./KTVector4');
KT.Scene = require('./KTScene');

module.exports = KT;
},{"./KTCameraFly":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraFly.js","./KTCameraOrtho":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraOrtho.js","./KTCameraPerspective":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraPerspective.js","./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTGeometry3DModel":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry3DModel.js","./KTGeometryBox":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryBox.js","./KTGeometryCylinder":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryCylinder.js","./KTGeometryGUITexture":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryGUITexture.js","./KTGeometryPlane":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryPlane.js","./KTGeometrySkybox":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometrySkybox.js","./KTGeometrySphere":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometrySphere.js","./KTInput":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTInput.js","./KTLightDirectional":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightDirectional.js","./KTLightPoint":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightPoint.js","./KTLightSpot":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightSpot.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js","./KTMaterialBasic":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialBasic.js","./KTMaterialLambert":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialLambert.js","./KTMaterialPhong":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialPhong.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTMatrix3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix3.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTMesh":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMesh.js","./KTMeshSprite":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMeshSprite.js","./KTOrbitAndPan":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTOrbitAndPan.js","./KTScene":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTScene.js","./KTTexture":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTexture.js","./KTTextureCube":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTextureCube.js","./KTTextureFramebuffer":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTextureFramebuffer.js","./KTUtils":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js","./KTVector4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js":[function(require,module,exports){
window.KT = require('./KramTech');
},{"./KramTech":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KramTech.js"}]},{},["c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiLi5cXHNyY1xcS1RDYW1lcmFGbHkuanMiLCIuLlxcc3JjXFxLVENhbWVyYU9ydGhvLmpzIiwiLi5cXHNyY1xcS1RDYW1lcmFQZXJzcGVjdGl2ZS5qcyIsIi4uXFxzcmNcXEtUQ29sb3IuanMiLCIuLlxcc3JjXFxLVEdlb21ldHJ5LmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeTNETW9kZWwuanMiLCIuLlxcc3JjXFxLVEdlb21ldHJ5Qm94LmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeUN5bGluZGVyLmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeUdVSVRleHR1cmUuanMiLCIuLlxcc3JjXFxLVEdlb21ldHJ5UGxhbmUuanMiLCIuLlxcc3JjXFxLVEdlb21ldHJ5U2t5Ym94LmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeVNwaGVyZS5qcyIsIi4uXFxzcmNcXEtUSW5wdXQuanMiLCIuLlxcc3JjXFxLVExpZ2h0RGlyZWN0aW9uYWwuanMiLCIuLlxcc3JjXFxLVExpZ2h0UG9pbnQuanMiLCIuLlxcc3JjXFxLVExpZ2h0U3BvdC5qcyIsIi4uXFxzcmNcXEtUTWFpbi5qcyIsIi4uXFxzcmNcXEtUTWF0ZXJpYWwuanMiLCIuLlxcc3JjXFxLVE1hdGVyaWFsQmFzaWMuanMiLCIuLlxcc3JjXFxLVE1hdGVyaWFsTGFtYmVydC5qcyIsIi4uXFxzcmNcXEtUTWF0ZXJpYWxQaG9uZy5qcyIsIi4uXFxzcmNcXEtUTWF0aC5qcyIsIi4uXFxzcmNcXEtUTWF0cml4My5qcyIsIi4uXFxzcmNcXEtUTWF0cml4NC5qcyIsIi4uXFxzcmNcXEtUTWVzaC5qcyIsIi4uXFxzcmNcXEtUTWVzaFNwcml0ZS5qcyIsIi4uXFxzcmNcXEtUT3JiaXRBbmRQYW4uanMiLCIuLlxcc3JjXFxLVFNjZW5lLmpzIiwiLi5cXHNyY1xcS1RTaGFkZXJzLmpzIiwiLi5cXHNyY1xcS1RUZXh0dXJlLmpzIiwiLi5cXHNyY1xcS1RUZXh0dXJlQ3ViZS5qcyIsIi4uXFxzcmNcXEtUVGV4dHVyZUZyYW1lYnVmZmVyLmpzIiwiLi5cXHNyY1xcS1RVdGlscy5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yMi5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yMy5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yNC5qcyIsIi4uXFxzcmNcXEtyYW1UZWNoLmpzIiwiLi5cXHNyY1xcV2luZG93RXhwb3J0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBJbnB1dCA9IHJlcXVpcmUoJy4vS1RJbnB1dCcpO1xyXG52YXIgS1RNYXRoID0gcmVxdWlyZSgnLi9LVE1hdGgnKTtcclxudmFyIFZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG52YXIgVmVjdG9yMyA9IHJlcXVpcmUoJy4vS1RWZWN0b3IzJyk7XHJcblxyXG5mdW5jdGlvbiBGbHlDYW1lcmEoKXtcclxuXHR0aGlzLl9fa3RDYW1DdHJscyA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5jYW1lcmEgPSBudWxsO1xyXG5cdHRoaXMudGFyZ2V0ID0gbmV3IFZlY3RvcjMoMC4wLCAwLjAsIDAuMCk7XHJcblx0dGhpcy5hbmdsZSA9IG5ldyBWZWN0b3IyKDAuMCwgMC4wKTtcclxuXHR0aGlzLnNwZWVkID0gMC41O1xyXG5cdHRoaXMubGFzdERyYWcgPSBudWxsO1xyXG5cdHRoaXMuc2Vuc2l0aXZpdHkgPSBuZXcgVmVjdG9yMigwLjUsIDAuNSk7XHJcblx0dGhpcy5vbmx5T25Mb2NrID0gdHJ1ZTtcclxuXHR0aGlzLm1heEFuZ2xlID0gS1RNYXRoLmRlZ1RvUmFkKDc1KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAgRmx5Q2FtZXJhO1xyXG5cclxuRmx5Q2FtZXJhLnByb3RvdHlwZS5rZXlib2FyZENvbnRyb2xzID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgY2FtID0gdGhpcy5jYW1lcmE7XHJcblx0dmFyIG1vdmVkID0gZmFsc2U7XHJcblx0XHJcblx0aWYgKElucHV0LmlzS2V5RG93bihJbnB1dC52S2V5LlcpKXtcclxuXHRcdGNhbS5wb3NpdGlvbi54ICs9IE1hdGguY29zKHRoaXMuYW5nbGUueCkgKiB0aGlzLnNwZWVkO1xyXG5cdFx0Y2FtLnBvc2l0aW9uLnkgKz0gTWF0aC5zaW4odGhpcy5hbmdsZS55KSAqIHRoaXMuc3BlZWQ7XHJcblx0XHRjYW0ucG9zaXRpb24ueiAtPSBNYXRoLnNpbih0aGlzLmFuZ2xlLngpICogdGhpcy5zcGVlZDtcclxuXHRcdFxyXG5cdFx0bW92ZWQgPSB0cnVlO1xyXG5cdH1lbHNlIGlmIChJbnB1dC5pc0tleURvd24oSW5wdXQudktleS5TKSl7XHJcblx0XHRjYW0ucG9zaXRpb24ueCAtPSBNYXRoLmNvcyh0aGlzLmFuZ2xlLngpICogdGhpcy5zcGVlZDtcclxuXHRcdGNhbS5wb3NpdGlvbi55IC09IE1hdGguc2luKHRoaXMuYW5nbGUueSkgKiB0aGlzLnNwZWVkO1xyXG5cdFx0Y2FtLnBvc2l0aW9uLnogKz0gTWF0aC5zaW4odGhpcy5hbmdsZS54KSAqIHRoaXMuc3BlZWQ7XHJcblx0XHRcclxuXHRcdG1vdmVkID0gdHJ1ZTtcclxuXHR9XHJcblx0XHJcblx0aWYgKElucHV0LmlzS2V5RG93bihJbnB1dC52S2V5LkEpKXtcclxuXHRcdGNhbS5wb3NpdGlvbi54ICs9IE1hdGguY29zKHRoaXMuYW5nbGUueCArIEtUTWF0aC5QSV8yKSAqIHRoaXMuc3BlZWQ7XHJcblx0XHRjYW0ucG9zaXRpb24ueiAtPSBNYXRoLnNpbih0aGlzLmFuZ2xlLnggKyBLVE1hdGguUElfMikgKiB0aGlzLnNwZWVkO1xyXG5cdFx0XHJcblx0XHRtb3ZlZCA9IHRydWU7XHJcblx0fWVsc2UgaWYgKElucHV0LmlzS2V5RG93bihJbnB1dC52S2V5LkQpKXtcclxuXHRcdGNhbS5wb3NpdGlvbi54IC09IE1hdGguY29zKHRoaXMuYW5nbGUueCArIEtUTWF0aC5QSV8yKSAqIHRoaXMuc3BlZWQ7XHJcblx0XHRjYW0ucG9zaXRpb24ueiArPSBNYXRoLnNpbih0aGlzLmFuZ2xlLnggKyBLVE1hdGguUElfMikgKiB0aGlzLnNwZWVkO1xyXG5cdFx0XHJcblx0XHRtb3ZlZCA9IHRydWU7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiBtb3ZlZDtcclxufTtcclxuXHJcbkZseUNhbWVyYS5wcm90b3R5cGUubW91c2VDb250cm9scyA9IGZ1bmN0aW9uKCl7XHJcblx0aWYgKHRoaXMub25seU9uTG9jayAmJiAhSW5wdXQubW91c2VMb2NrZWQpIHJldHVybjtcclxuXHRcclxuXHR2YXIgbW92ZWQgPSBmYWxzZTtcclxuXHRcclxuXHRpZiAodGhpcy5sYXN0RHJhZyA9PSBudWxsKSB0aGlzLmxhc3REcmFnID0gSW5wdXQuX21vdXNlLnBvc2l0aW9uLmNsb25lKCk7XHJcblx0XHJcblx0dmFyIGR4ID0gSW5wdXQuX21vdXNlLnBvc2l0aW9uLnggLSB0aGlzLmxhc3REcmFnLng7XHJcblx0dmFyIGR5ID0gSW5wdXQuX21vdXNlLnBvc2l0aW9uLnkgLSB0aGlzLmxhc3REcmFnLnk7XHJcblx0XHJcblx0aWYgKGR4ICE9IDAuMCB8fCBkeSAhPSAwLjApe1xyXG5cdFx0dGhpcy5hbmdsZS54IC09IEtUTWF0aC5kZWdUb1JhZChkeCAqIHRoaXMuc2Vuc2l0aXZpdHkueCk7XHJcblx0XHR0aGlzLmFuZ2xlLnkgLT0gS1RNYXRoLmRlZ1RvUmFkKGR5ICogdGhpcy5zZW5zaXRpdml0eS55KTtcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMuYW5nbGUueSA8IC10aGlzLm1heEFuZ2xlKSB0aGlzLmFuZ2xlLnkgPSAtdGhpcy5tYXhBbmdsZTtcclxuXHRcdGlmICh0aGlzLmFuZ2xlLnkgPiB0aGlzLm1heEFuZ2xlKSB0aGlzLmFuZ2xlLnkgPSB0aGlzLm1heEFuZ2xlO1xyXG5cdFx0XHJcblx0XHRtb3ZlZCA9IHRydWU7XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMubGFzdERyYWcuY29weShJbnB1dC5fbW91c2UucG9zaXRpb24pO1xyXG5cdFxyXG5cdHJldHVybiBtb3ZlZDtcclxufTtcclxuXHJcbkZseUNhbWVyYS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKXtcclxuXHRpZiAodGhpcy5jYW1lcmEubG9ja2VkKSByZXR1cm47XHJcblx0XHJcblx0dmFyIG1LID0gdGhpcy5rZXlib2FyZENvbnRyb2xzKCk7XHJcblx0dmFyIG1NID0gdGhpcy5tb3VzZUNvbnRyb2xzKCk7XHJcblx0XHJcblx0aWYgKG1LIHx8IG1NKXtcclxuXHRcdHRoaXMuc2V0Q2FtZXJhUG9zaXRpb24oKTtcclxuXHR9XHJcbn07XHJcblxyXG5GbHlDYW1lcmEucHJvdG90eXBlLnNldENhbWVyYVBvc2l0aW9uID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgY2FtID0gdGhpcy5jYW1lcmE7XHJcblx0XHJcblx0dmFyIHggPSBjYW0ucG9zaXRpb24ueCArIE1hdGguY29zKHRoaXMuYW5nbGUueCk7XHJcblx0dmFyIHkgPSBjYW0ucG9zaXRpb24ueSArIE1hdGguc2luKHRoaXMuYW5nbGUueSk7XHJcblx0dmFyIHogPSBjYW0ucG9zaXRpb24ueiAtIE1hdGguc2luKHRoaXMuYW5nbGUueCk7XHJcblx0XHJcblx0dGhpcy50YXJnZXQuc2V0KHgsIHksIHopO1xyXG5cdHRoaXMuY2FtZXJhLmxvb2tBdCh0aGlzLnRhcmdldCk7XHJcbn07XHJcblxyXG5GbHlDYW1lcmEucHJvdG90eXBlLnNldENhbWVyYSA9IGZ1bmN0aW9uKGNhbWVyYSl7XHJcblx0dGhpcy5jYW1lcmEgPSBjYW1lcmE7XHJcblx0XHJcblx0dmFyIHpvb20gPSBWZWN0b3IzLnZlY3RvcnNEaWZmZXJlbmNlKGNhbWVyYS5wb3NpdGlvbiwgdGhpcy50YXJnZXQpLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMuYW5nbGUueCA9ICgtS1RNYXRoLmdldDJEQW5nbGUodGhpcy50YXJnZXQueCwgdGhpcy50YXJnZXQueiwgY2FtZXJhLnBvc2l0aW9uLngsIGNhbWVyYS5wb3NpdGlvbi56KSArIEtUTWF0aC5QSTIpICUgS1RNYXRoLlBJMjtcclxuXHR0aGlzLmFuZ2xlLnkgPSAoLUtUTWF0aC5nZXQyREFuZ2xlKDAsIGNhbWVyYS5wb3NpdGlvbi55LCB6b29tLCB0aGlzLnRhcmdldC55KSArIEtUTWF0aC5QSTIpICUgS1RNYXRoLlBJMjtcclxuXHRcclxuXHR0aGlzLnNldENhbWVyYVBvc2l0aW9uKCk7XHJcbn07XHJcbiIsInZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxudmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBWZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxudmFyIEtUTWF0aCA9IHJlcXVpcmUoJy4vS1RNYXRoJyk7XHJcblxyXG5mdW5jdGlvbiBDYW1lcmFPcnRobyh3aWR0aCwgaGVpZ2h0LCB6bmVhciwgemZhcil7XHJcblx0dGhpcy5fX2t0Y2FtZXJhID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMC4wLCAwLjAsIDAuMCk7XHJcblx0dGhpcy51cFZlY3RvciA9IG5ldyBWZWN0b3IzKDAuMCwgMS4wLCAwLjApO1xyXG5cdHRoaXMubG9va0F0KG5ldyBWZWN0b3IzKDAuMCwgMC4wLCAtMS4wKSk7XHJcblx0dGhpcy5sb2NrZWQgPSBmYWxzZTtcclxuXHRcclxuXHR0aGlzLndpZHRoID0gd2lkdGg7XHJcblx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcblx0dGhpcy56bmVhciA9IHpuZWFyO1xyXG5cdHRoaXMuemZhciA9IHpmYXI7XHJcblx0XHJcblx0dGhpcy5jb250cm9scyA9IG51bGw7XHJcblx0XHJcblx0dGhpcy5zZXRPcnRobygpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhbWVyYU9ydGhvO1xyXG5cclxuQ2FtZXJhT3J0aG8ucHJvdG90eXBlLnNldE9ydGhvID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgQyA9IDIuMCAvIHRoaXMud2lkdGg7XHJcblx0dmFyIFIgPSAyLjAgLyB0aGlzLmhlaWdodDtcclxuXHR2YXIgQSA9IC0yLjAgLyAodGhpcy56ZmFyIC0gdGhpcy56bmVhcik7XHJcblx0dmFyIEIgPSAtKHRoaXMuemZhciArIHRoaXMuem5lYXIpIC8gKHRoaXMuemZhciAtIHRoaXMuem5lYXIpO1xyXG5cdFxyXG5cdHRoaXMucGVyc3BlY3RpdmVNYXRyaXggPSBuZXcgTWF0cml4NChcclxuXHRcdEMsIDAsIDAsIDAsXHJcblx0XHQwLCBSLCAwLCAwLFxyXG5cdFx0MCwgMCwgQSwgQixcclxuXHRcdDAsIDAsIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuQ2FtZXJhT3J0aG8ucHJvdG90eXBlLmxvb2tBdCA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgbG9vayB0byBhIHZlY3RvcjNcIjtcclxuXHRcclxuXHR2YXIgZm9yd2FyZCA9IFZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UodGhpcy5wb3NpdGlvbiwgdmVjdG9yMykubm9ybWFsaXplKCk7XHJcblx0dmFyIGxlZnQgPSB0aGlzLnVwVmVjdG9yLmNyb3NzKGZvcndhcmQpLm5vcm1hbGl6ZSgpO1xyXG5cdHZhciB1cCA9IGZvcndhcmQuY3Jvc3MobGVmdCkubm9ybWFsaXplKCk7XHJcblx0XHJcblx0dmFyIHggPSAtbGVmdC5kb3QodGhpcy5wb3NpdGlvbik7XHJcblx0dmFyIHkgPSAtdXAuZG90KHRoaXMucG9zaXRpb24pO1xyXG5cdHZhciB6ID0gLWZvcndhcmQuZG90KHRoaXMucG9zaXRpb24pO1xyXG5cdFxyXG5cdHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBuZXcgTWF0cml4NChcclxuXHRcdGxlZnQueCwgbGVmdC55LCBsZWZ0LnosIHgsXHJcblx0XHR1cC54LCB1cC55LCB1cC56LCB5LFxyXG5cdFx0Zm9yd2FyZC54LCBmb3J3YXJkLnksIGZvcndhcmQueiwgeixcclxuXHRcdDAsIDAsIDAsIDFcclxuXHQpO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuQ2FtZXJhT3J0aG8ucHJvdG90eXBlLnNldENvbnRyb2xzID0gZnVuY3Rpb24oY2FtZXJhQ29udHJvbHMpe1xyXG5cdGlmICghY2FtZXJhQ29udHJvbHMuX19rdENhbUN0cmxzKSB0aHJvdyBcIklzIG5vdCBhIHZhbGlkIGNhbWVyYSBjb250cm9scyBvYmplY3RcIjtcclxuXHRcclxuXHR2YXIgem9vbSA9IFZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UodGhpcy5wb3NpdGlvbiwgY2FtZXJhQ29udHJvbHMudGFyZ2V0KS5sZW5ndGgoKTtcclxuXHRcclxuXHR0aGlzLmNvbnRyb2xzID0gY2FtZXJhQ29udHJvbHM7XHJcblx0XHJcblx0Y2FtZXJhQ29udHJvbHMuY2FtZXJhID0gdGhpcztcclxuXHRjYW1lcmFDb250cm9scy56b29tID0gem9vbTtcclxuXHRjYW1lcmFDb250cm9scy5hbmdsZS54ID0gS1RNYXRoLmdldDJEQW5nbGUoY2FtZXJhQ29udHJvbHMudGFyZ2V0LngsIGNhbWVyYUNvbnRyb2xzLnRhcmdldC56LHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi56KTtcclxuXHRjYW1lcmFDb250cm9scy5hbmdsZS55ID0gS1RNYXRoLmdldDJEQW5nbGUoMCwgdGhpcy5wb3NpdGlvbi55LCB6b29tLCBjYW1lcmFDb250cm9scy50YXJnZXQueSk7XHJcblx0XHJcblx0Y2FtZXJhQ29udHJvbHMuc2V0Q2FtZXJhUG9zaXRpb24oKTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuIiwidmFyIE1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG52YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG52YXIgS1RNYXRoID0gcmVxdWlyZSgnLi9LVE1hdGgnKTtcclxudmFyIEdlb21ldHJ5U2t5Ym94ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5U2t5Ym94Jyk7XHJcblxyXG5mdW5jdGlvbiBDYW1lcmFQZXJzcGVjdGl2ZShmb3YsIHJhdGlvLCB6bmVhciwgemZhcil7XHJcblx0dGhpcy5fX2t0Y2FtZXJhID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMC4wLCAwLjAsIDAuMCk7XHJcblx0dGhpcy51cFZlY3RvciA9IG5ldyBWZWN0b3IzKDAuMCwgMS4wLCAwLjApO1xyXG5cdHRoaXMubG9va0F0KG5ldyBWZWN0b3IzKDAuMCwgMC4wLCAtMS4wKSk7XHJcblx0dGhpcy5sb2NrZWQgPSBmYWxzZTtcclxuXHRcclxuXHR0aGlzLmZvdiA9IGZvdjtcclxuXHR0aGlzLnJhdGlvID0gcmF0aW87XHJcblx0dGhpcy56bmVhciA9IHpuZWFyO1xyXG5cdHRoaXMuemZhciA9IHpmYXI7XHJcblx0XHJcblx0dGhpcy5jb250cm9scyA9IG51bGw7XHJcblx0XHJcblx0dGhpcy5za3lib3ggPSBudWxsO1xyXG5cdFxyXG5cdHRoaXMuc2V0UGVyc3BlY3RpdmUoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYW1lcmFQZXJzcGVjdGl2ZTtcclxuXHJcbkNhbWVyYVBlcnNwZWN0aXZlLnByb3RvdHlwZS5zZXRQZXJzcGVjdGl2ZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIEMgPSAxIC8gTWF0aC50YW4odGhpcy5mb3YgLyAyKTtcclxuXHR2YXIgUiA9IEMgKiB0aGlzLnJhdGlvO1xyXG5cdHZhciBBID0gKHRoaXMuem5lYXIgKyB0aGlzLnpmYXIpIC8gKHRoaXMuem5lYXIgLSB0aGlzLnpmYXIpO1xyXG5cdHZhciBCID0gKDIgKiB0aGlzLnpuZWFyICogdGhpcy56ZmFyKSAvICh0aGlzLnpuZWFyIC0gdGhpcy56ZmFyKTtcclxuXHRcclxuXHR0aGlzLnBlcnNwZWN0aXZlTWF0cml4ID0gbmV3IE1hdHJpeDQoXHJcblx0XHRDLCAwLCAwLCAgMCxcclxuXHRcdDAsIFIsIDAsICAwLFxyXG5cdFx0MCwgMCwgQSwgIEIsXHJcblx0XHQwLCAwLCAtMSwgMFxyXG5cdCk7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUuc2V0U2t5Ym94ID0gZnVuY3Rpb24odGV4dHVyZSl7XHJcblx0dGhpcy5za3lib3ggPSBuZXcgR2VvbWV0cnlTa3lib3godGhpcy5wb3NpdGlvbiwgdGV4dHVyZSk7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUubG9va0F0ID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBsb29rIHRvIGEgdmVjdG9yM1wiO1xyXG5cdFxyXG5cdHZhciBmb3J3YXJkID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSh0aGlzLnBvc2l0aW9uLCB2ZWN0b3IzKS5ub3JtYWxpemUoKTtcclxuXHR2YXIgbGVmdCA9IHRoaXMudXBWZWN0b3IuY3Jvc3MoZm9yd2FyZCkubm9ybWFsaXplKCk7XHJcblx0dmFyIHVwID0gZm9yd2FyZC5jcm9zcyhsZWZ0KS5ub3JtYWxpemUoKTtcclxuXHRcclxuXHR2YXIgeCA9IC1sZWZ0LmRvdCh0aGlzLnBvc2l0aW9uKTtcclxuXHR2YXIgeSA9IC11cC5kb3QodGhpcy5wb3NpdGlvbik7XHJcblx0dmFyIHogPSAtZm9yd2FyZC5kb3QodGhpcy5wb3NpdGlvbik7XHJcblx0XHJcblx0dGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG5ldyBNYXRyaXg0KFxyXG5cdFx0bGVmdC54LCBsZWZ0LnksIGxlZnQueiwgeCxcclxuXHRcdHVwLngsIHVwLnksIHVwLnosIHksXHJcblx0XHRmb3J3YXJkLngsIGZvcndhcmQueSwgZm9yd2FyZC56LCB6LFxyXG5cdFx0MCwgMCwgMCwgMVxyXG5cdCk7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUuc2V0Q29udHJvbHMgPSBmdW5jdGlvbihjYW1lcmFDb250cm9scyl7XHJcblx0aWYgKCFjYW1lcmFDb250cm9scy5fX2t0Q2FtQ3RybHMpIHRocm93IFwiSXMgbm90IGEgdmFsaWQgY2FtZXJhIGNvbnRyb2xzIG9iamVjdFwiO1xyXG5cdFxyXG5cdHRoaXMuY29udHJvbHMgPSBjYW1lcmFDb250cm9scztcclxuXHRjYW1lcmFDb250cm9scy5zZXRDYW1lcmEodGhpcyk7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbiIsImZ1bmN0aW9uIENvbG9yKGhleENvbG9yKXtcclxuXHR2YXIgc3RyID0gaGV4Q29sb3Iuc3Vic3RyaW5nKDEpO1xyXG5cdFxyXG5cdGlmIChzdHIubGVuZ3RoID09IDYpIHN0ciArPSBcIkZGXCI7XHJcblx0dmFyIHIgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDAsIDIpLCAxNik7XHJcblx0dmFyIGcgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDIsIDQpLCAxNik7XHJcblx0dmFyIGIgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDQsIDYpLCAxNik7XHJcblx0dmFyIGEgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDYsIDgpLCAxNik7XHJcblx0XHJcblx0dGhpcy5jb2xvciA9IFtyIC8gMjU1LCBnIC8gMjU1LCBiIC8gMjU1LCBhIC8gMjU1XTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb2xvcjtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihoZXhDb2xvcil7XHJcblx0dmFyIHN0ciA9IGhleENvbG9yLnN1YnN0cmluZygxKTtcclxuXHRcclxuXHRpZiAoc3RyLmxlbmd0aCA9PSA2KSBzdHIgKz0gXCJGRlwiO1xyXG5cdHZhciByID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygwLCAyKSwgMTYpO1xyXG5cdHZhciBnID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygyLCA0KSwgMTYpO1xyXG5cdHZhciBiID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg0LCA2KSwgMTYpO1xyXG5cdHZhciBhID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg2LCA4KSwgMTYpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBbciAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSwgYSAvIDI1NV07XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuc2V0UkdCID0gZnVuY3Rpb24ocmVkLCBncmVlbiwgYmx1ZSl7XHJcblx0dGhpcy5zZXRSR0JBKHJlZCwgZ3JlZW4sIGJsdWUsIDI1NSk7XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuc2V0UkdCQSA9IGZ1bmN0aW9uKHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhKXtcclxuXHR0aGlzLmNvbG9yID0gW3JlZCAvIDI1NSwgZ3JlZW4gLyAyNTUsIGJsdWUgLyAyNTUsIGFscGhhXTtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5nZXRSR0IgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBjID0gdGhpcy5nZXRSR0JBKCk7XHJcblx0XHJcblx0cmV0dXJuIFtjWzBdLCBjWzFdLCBjWzJdXTtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5nZXRSR0JBID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gdGhpcy5jb2xvcjtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5nZXRIZXggPSBmdW5jdGlvbigpe1xyXG5cdHZhciBjID0gdGhpcy5jb2xvcjtcclxuXHRcclxuXHR2YXIgciA9IChjWzBdICogMjU1KS50b1N0cmluZygxNik7XHJcblx0dmFyIGcgPSAoY1sxXSAqIDI1NSkudG9TdHJpbmcoMTYpO1xyXG5cdHZhciBiID0gKGNbMl0gKiAyNTUpLnRvU3RyaW5nKDE2KTtcclxuXHR2YXIgYSA9IChjWzNdICogMjU1KS50b1N0cmluZygxNik7XHJcblx0XHJcblx0aWYgKHIubGVuZ3RoID09IDEpIHIgPSBcIjBcIiArIHI7XHJcblx0aWYgKGcubGVuZ3RoID09IDEpIGcgPSBcIjBcIiArIGc7XHJcblx0aWYgKGIubGVuZ3RoID09IDEpIGIgPSBcIjBcIiArIGI7XHJcblx0aWYgKGEubGVuZ3RoID09IDEpIGEgPSBcIjBcIiArIGE7XHJcblx0XHJcblx0cmV0dXJuIChcIiNcIiArIHIgKyBnICsgYiArIGEpLnRvVXBwZXJDYXNlKCk7XHJcbn07XHJcblxyXG5Db2xvci5fQkxBQ0tcdFx0PSBcIiMwMDAwMDBGRlwiO1xyXG5Db2xvci5fUkVEIFx0XHRcdD0gXCIjRkYwMDAwRkZcIjtcclxuQ29sb3IuX0dSRUVOIFx0XHQ9IFwiIzAwRkYwMEZGXCI7XHJcbkNvbG9yLl9CTFVFIFx0XHQ9IFwiIzAwMDBGRkZGXCI7XHJcbkNvbG9yLl9XSElURVx0XHQ9IFwiI0ZGRkZGRkZGXCI7XHJcbkNvbG9yLl9ZRUxMT1dcdFx0PSBcIiNGRkZGMDBGRlwiO1xyXG5Db2xvci5fTUFHRU5UQVx0XHQ9IFwiI0ZGMDBGRkZGXCI7XHJcbkNvbG9yLl9BUVVBXHRcdFx0PSBcIiMwMEZGRkZGRlwiO1xyXG5Db2xvci5fR09MRFx0XHRcdD0gXCIjRkZENzAwRkZcIjtcclxuQ29sb3IuX0dSQVlcdFx0XHQ9IFwiIzgwODA4MEZGXCI7XHJcbkNvbG9yLl9QVVJQTEVcdFx0PSBcIiM4MDAwODBGRlwiOyIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcbnZhciBWZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG52YXIgVmVjdG9yNCA9IHJlcXVpcmUoJy4vS1RWZWN0b3I0Jyk7XHJcblxyXG5mdW5jdGlvbiBHZW9tZXRyeSgpe1xyXG5cdHRoaXMuX19rdGdlb21ldHJ5ID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnZlcnRpY2VzID0gW107XHJcblx0dGhpcy50cmlhbmdsZXMgPSBbXTtcclxuXHR0aGlzLnV2Q29vcmRzID0gW107XHJcblx0dGhpcy5jb2xvcnMgPSBbXTtcclxuXHR0aGlzLm5vcm1hbHMgPSBbXTtcclxuXHR0aGlzLnV2UmVnaW9uID0gbmV3IFZlY3RvcjQoMC4wLCAwLjAsIDEuMCwgMS4wKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeTtcclxuXHJcbkdlb21ldHJ5LnByb3RvdHlwZS5hZGRWZXJ0aWNlID0gZnVuY3Rpb24oeCwgeSwgeiwgY29sb3IsIHR4LCB0eSl7XHJcblx0aWYgKCFjb2xvcikgY29sb3IgPSBDb2xvci5fV0hJVEU7XHJcblx0aWYgKCF0eCkgdHggPSAwO1xyXG5cdGlmICghdHkpIHR5ID0gMDtcclxuXHRcclxuXHR2YXIgaW5kID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGg7XHJcblx0dGhpcy52ZXJ0aWNlcy5wdXNoKG5ldyBWZWN0b3IzKHgsIHksIHopKTtcclxuXHR0aGlzLmNvbG9ycy5wdXNoKG5ldyBDb2xvcihjb2xvcikpO1xyXG5cdHRoaXMudXZDb29yZHMucHVzaChuZXcgVmVjdG9yMih0eCwgdHkpKTtcclxuXHRcclxuXHRyZXR1cm4gaW5kO1xyXG59O1xyXG5cclxuR2VvbWV0cnkucHJvdG90eXBlLmFkZEZhY2UgPSBmdW5jdGlvbih2ZXJ0aWNlXzAsIHZlcnRpY2VfMSwgdmVydGljZV8yKXtcclxuXHRpZiAoIXRoaXMudmVydGljZXNbdmVydGljZV8wXSkgdGhyb3cgXCJJbnZhbGlkIHZlcnRleCBpbmRleDogXCIgKyB2ZXJ0aWNlXzA7XHJcblx0aWYgKCF0aGlzLnZlcnRpY2VzW3ZlcnRpY2VfMV0pIHRocm93IFwiSW52YWxpZCB2ZXJ0ZXggaW5kZXg6IFwiICsgdmVydGljZV8xO1xyXG5cdGlmICghdGhpcy52ZXJ0aWNlc1t2ZXJ0aWNlXzJdKSB0aHJvdyBcIkludmFsaWQgdmVydGV4IGluZGV4OiBcIiArIHZlcnRpY2VfMjtcclxuXHRcclxuXHR0aGlzLnRyaWFuZ2xlcy5wdXNoKG5ldyBWZWN0b3IzKHZlcnRpY2VfMCwgdmVydGljZV8xLCB2ZXJ0aWNlXzIpKTtcclxufTtcclxuXHJcbkdlb21ldHJ5LnByb3RvdHlwZS5hZGROb3JtYWwgPSBmdW5jdGlvbihueCwgbnksIG56KXtcclxuXHR0aGlzLm5vcm1hbHMucHVzaChuZXcgVmVjdG9yMyhueCwgbnksIG56KSk7XHJcbn07XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbigpe1xyXG5cdHZhciB2ZXJ0aWNlcyA9IFtdO1xyXG5cdHZhciB1dkNvb3JkcyA9IFtdO1xyXG5cdHZhciB0cmlhbmdsZXMgPSBbXTtcclxuXHR2YXIgY29sb3JzID0gW107XHJcblx0dmFyIG5vcm1hbHMgPSBbXTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMudmVydGljZXMubGVuZ3RoO2k8bGVuO2krKyl7IFxyXG5cdFx0dmFyIHYgPSB0aGlzLnZlcnRpY2VzW2ldOyBcclxuXHRcdHZlcnRpY2VzLnB1c2godi54LCB2LnksIHYueik7IFxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMudXZDb29yZHMubGVuZ3RoO2k8bGVuO2krKyl7IFxyXG5cdFx0dmFyIHYgPSB0aGlzLnV2Q29vcmRzW2ldOyBcclxuXHRcdHV2Q29vcmRzLnB1c2godi54LCB2LnkpOyBcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLnRyaWFuZ2xlcy5sZW5ndGg7aTxsZW47aSsrKXsgXHJcblx0XHR2YXIgdCA9IHRoaXMudHJpYW5nbGVzW2ldOyBcclxuXHRcdHRyaWFuZ2xlcy5wdXNoKHQueCwgdC55LCB0LnopOyBcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLmNvbG9ycy5sZW5ndGg7aTxsZW47aSsrKXsgXHJcblx0XHR2YXIgYyA9IHRoaXMuY29sb3JzW2ldLmdldFJHQkEoKTsgXHJcblx0XHRcclxuXHRcdGNvbG9ycy5wdXNoKGNbMF0sIGNbMV0sIGNbMl0sIGNbM10pOyBcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLm5vcm1hbHMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgbiA9IHRoaXMubm9ybWFsc1tpXTtcclxuXHRcdG5vcm1hbHMucHVzaChuLngsIG4ueSwgbi56KTtcclxuXHR9XHJcblx0XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgPSBLVC5jcmVhdGVBcnJheUJ1ZmZlcihcIkFSUkFZX0JVRkZFUlwiLCBuZXcgRmxvYXQzMkFycmF5KHZlcnRpY2VzKSwgMyk7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBLVC5jcmVhdGVBcnJheUJ1ZmZlcihcIkFSUkFZX0JVRkZFUlwiLCBuZXcgRmxvYXQzMkFycmF5KHV2Q29vcmRzKSwgMik7XHJcblx0dGhpcy5mYWNlc0J1ZmZlciA9IEtULmNyZWF0ZUFycmF5QnVmZmVyKFwiRUxFTUVOVF9BUlJBWV9CVUZGRVJcIiwgbmV3IFVpbnQxNkFycmF5KHRyaWFuZ2xlcyksIDEpO1xyXG5cdHRoaXMuY29sb3JzQnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJBUlJBWV9CVUZGRVJcIiwgbmV3IEZsb2F0MzJBcnJheShjb2xvcnMpLCA0KTtcclxuXHR0aGlzLm5vcm1hbHNCdWZmZXIgPSBLVC5jcmVhdGVBcnJheUJ1ZmZlcihcIkFSUkFZX0JVRkZFUlwiLCBuZXcgRmxvYXQzMkFycmF5KG5vcm1hbHMpLCAzKTtcclxuXHR0aGlzLnJlYWR5ID0gdHJ1ZTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbkdlb21ldHJ5LnByb3RvdHlwZS5jb21wdXRlRmFjZXNOb3JtYWxzID0gZnVuY3Rpb24oKXtcclxuXHR0aGlzLm5vcm1hbHMgPSBbXTtcclxuXHRcclxuXHR2YXIgbm9ybWFsaXplZFZlcnRpY2VzID0gW107XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLnRyaWFuZ2xlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBmYWNlID0gdGhpcy50cmlhbmdsZXNbaV07XHJcblx0XHR2YXIgdjAgPSB0aGlzLnZlcnRpY2VzW2ZhY2UueF07XHJcblx0XHR2YXIgdjEgPSB0aGlzLnZlcnRpY2VzW2ZhY2UueV07XHJcblx0XHR2YXIgdjIgPSB0aGlzLnZlcnRpY2VzW2ZhY2Uuel07XHJcblx0XHRcclxuXHRcdHZhciBkaXIxID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSh2MSwgdjApO1xyXG5cdFx0dmFyIGRpcjIgPSBWZWN0b3IzLnZlY3RvcnNEaWZmZXJlbmNlKHYyLCB2MCk7XHJcblx0XHRcclxuXHRcdHZhciBub3JtYWwgPSBkaXIxLmNyb3NzKGRpcjIpLm5vcm1hbGl6ZSgpO1xyXG5cdFx0XHJcblx0XHRpZiAobm9ybWFsaXplZFZlcnRpY2VzLmluZGV4T2YoZmFjZS54KSA9PSAtMSkgdGhpcy5ub3JtYWxzLnB1c2gobm9ybWFsKTtcclxuXHRcdGlmIChub3JtYWxpemVkVmVydGljZXMuaW5kZXhPZihmYWNlLnkpID09IC0xKSB0aGlzLm5vcm1hbHMucHVzaChub3JtYWwpO1xyXG5cdFx0aWYgKG5vcm1hbGl6ZWRWZXJ0aWNlcy5pbmRleE9mKGZhY2UueikgPT0gLTEpIHRoaXMubm9ybWFscy5wdXNoKG5vcm1hbCk7XHJcblx0XHRcclxuXHRcdG5vcm1hbGl6ZWRWZXJ0aWNlcy5wdXNoKGZhY2UueCwgZmFjZS55LCBmYWNlLnopO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuIiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL0tUVXRpbHMnKTtcclxudmFyIFZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG52YXIgVmVjdG9yMyA9IHJlcXVpcmUoJy4vS1RWZWN0b3IzJyk7XHJcbnZhciBWZWN0b3I0ID0gcmVxdWlyZSgnLi9LVFZlY3RvcjQnKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5M0RNb2RlbChmaWxlVVJMKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5maWxlVVJMID0gZmlsZVVSTDtcclxuXHR0aGlzLnJlYWR5ID0gZmFsc2U7XHJcblx0dGhpcy51dlJlZ2lvbiA9IG5ldyBWZWN0b3I0KDAuMCwgMC4wLCAxLjAsIDEuMCk7XHJcblx0XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdFV0aWxzLmdldEZpbGVDb250ZW50KGZpbGVVUkwsIGZ1bmN0aW9uKGZpbGUpe1xyXG5cdFx0VC5yZWFkeSA9IHRydWU7XHJcblx0XHRULnBhcnNlRmlsZShmaWxlKTtcclxuXHR9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeTNETW9kZWw7XHJcblxyXG5HZW9tZXRyeTNETW9kZWwucHJvdG90eXBlLnBhcnNlRmlsZSA9IGZ1bmN0aW9uKGZpbGUpe1xyXG5cdHZhciBsaW5lcyA9IGZpbGUuc3BsaXQoJ1xcclxcbicpO1xyXG5cdHZhciB2ZXJ0ZXhNaW4gPSBbXTtcclxuXHR2YXIgdXZDb29yZE1pbiA9IFtdO1xyXG5cdHZhciBub3JtYWxNaW4gPSBbXTtcclxuXHR2YXIgaW5kTWluID0gW107XHJcblx0dmFyIGdlb21ldHJ5ID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj1saW5lcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBsID0gbGluZXNbaV0udHJpbSgpO1xyXG5cdFx0bCA9IGwucmVwbGFjZSgnICAnLCAnICcpO1xyXG5cdFx0dmFyIGluZCA9IGwuY2hhckF0KDApO1xyXG5cdFx0XHJcblx0XHR2YXIgcCA9IGwuc3BsaXQoJyAnKTtcclxuXHRcdHAuc3BsaWNlKDAsMSk7XHJcblx0XHRcclxuXHRcdGlmIChpbmQgPT0gJyMnKSBjb250aW51ZTtcclxuXHRcdGVsc2UgaWYgKGluZCA9PSAnZycpIGNvbnRpbnVlO1xyXG5cdFx0ZWxzZSBpZiAobCA9PSAnJykgY29udGludWU7XHJcblx0XHRcclxuXHRcdGlmIChsLmluZGV4T2YoJ3YgJykgPT0gMCl7XHJcblx0XHRcdHZlcnRleE1pbi5wdXNoKCBuZXcgVmVjdG9yMyhcclxuXHRcdFx0XHRwYXJzZUZsb2F0KHBbMF0pLFxyXG5cdFx0XHRcdHBhcnNlRmxvYXQocFsxXSksXHJcblx0XHRcdFx0cGFyc2VGbG9hdChwWzJdKVxyXG5cdFx0XHQpKTtcclxuXHRcdH1lbHNlIGlmIChsLmluZGV4T2YoJ3ZuICcpID09IDApe1xyXG5cdFx0XHRub3JtYWxNaW4ucHVzaCggbmV3IFZlY3RvcjMoXHJcblx0XHRcdFx0cGFyc2VGbG9hdChwWzBdKSxcclxuXHRcdFx0XHRwYXJzZUZsb2F0KHBbMV0pLFxyXG5cdFx0XHRcdHBhcnNlRmxvYXQocFsyXSlcclxuXHRcdFx0KSk7XHJcblx0XHR9ZWxzZSBpZiAobC5pbmRleE9mKCd2dCAnKSA9PSAwKXtcclxuXHRcdFx0dXZDb29yZE1pbi5wdXNoKCBuZXcgVmVjdG9yMihcclxuXHRcdFx0XHRwYXJzZUZsb2F0KHBbMF0pLFxyXG5cdFx0XHRcdHBhcnNlRmxvYXQocFsxXSlcclxuXHRcdFx0KSk7XHJcblx0XHR9ZWxzZSBpZiAobC5pbmRleE9mKCdmICcpID09IDApe1xyXG5cdFx0XHRpbmRNaW4ucHVzaCggbmV3IFZlY3RvcjMoXHJcblx0XHRcdFx0cFswXSxcclxuXHRcdFx0XHRwWzFdLFxyXG5cdFx0XHRcdHBbMl1cclxuXHRcdFx0KSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49aW5kTWluLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIGluZCA9IGluZE1pbltpXTtcclxuXHRcdHZhciB2ZXJ0ZXhJbmZvMSA9IGluZC54LnNwbGl0KCcvJyk7XHJcblx0XHR2YXIgdmVydGV4SW5mbzIgPSBpbmQueS5zcGxpdCgnLycpO1xyXG5cdFx0dmFyIHZlcnRleEluZm8zID0gaW5kLnouc3BsaXQoJy8nKTtcclxuXHRcdFxyXG5cdFx0dmFyIHYxID0gdmVydGV4TWluW3BhcnNlSW50KHZlcnRleEluZm8xWzBdKSAtIDFdO1xyXG5cdFx0dmFyIHQxID0gdXZDb29yZE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvMVsxXSkgLSAxXTtcclxuXHRcdHZhciBuMSA9IG5vcm1hbE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvMVsyXSkgLSAxXTtcclxuXHRcdFxyXG5cdFx0dmFyIHYyID0gdmVydGV4TWluW3BhcnNlSW50KHZlcnRleEluZm8yWzBdKSAtIDFdO1xyXG5cdFx0dmFyIHQyID0gdXZDb29yZE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvMlsxXSkgLSAxXTtcclxuXHRcdHZhciBuMiA9IG5vcm1hbE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvMlsyXSkgLSAxXTtcclxuXHRcdFxyXG5cdFx0dmFyIHYzID0gdmVydGV4TWluW3BhcnNlSW50KHZlcnRleEluZm8zWzBdKSAtIDFdO1xyXG5cdFx0dmFyIHQzID0gdXZDb29yZE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvM1sxXSkgLSAxXTtcclxuXHRcdHZhciBuMyA9IG5vcm1hbE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvM1syXSkgLSAxXTtcclxuXHRcdFxyXG5cdFx0dmFyIGkxID0gZ2VvbWV0cnkuYWRkVmVydGljZSh2MS54LCB2MS55LCB2MS56LCBDb2xvci5fV0hJVEUsIHQxLngsIHQxLnkpO1xyXG5cdFx0dmFyIGkyID0gZ2VvbWV0cnkuYWRkVmVydGljZSh2Mi54LCB2Mi55LCB2Mi56LCBDb2xvci5fV0hJVEUsIHQyLngsIHQyLnkpO1xyXG5cdFx0dmFyIGkzID0gZ2VvbWV0cnkuYWRkVmVydGljZSh2My54LCB2My55LCB2My56LCBDb2xvci5fV0hJVEUsIHQzLngsIHQzLnkpO1xyXG5cdFx0XHJcblx0XHRnZW9tZXRyeS5hZGROb3JtYWwobjEueCwgbjEueSwgbjEueik7XHJcblx0XHRnZW9tZXRyeS5hZGROb3JtYWwobjIueCwgbjIueSwgbjIueik7XHJcblx0XHRnZW9tZXRyeS5hZGROb3JtYWwobjMueCwgbjMueSwgbjMueik7XHJcblx0XHRcclxuXHRcdGdlb21ldHJ5LmFkZEZhY2UoaTEsIGkyLCBpMyk7XHJcblx0fVxyXG5cdFxyXG5cdGdlb21ldHJ5LmJ1aWxkKCk7XHJcblx0XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgPSBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXI7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBnZW9tZXRyeS50ZXhCdWZmZXI7XHJcblx0dGhpcy5mYWNlc0J1ZmZlciA9IGdlb21ldHJ5LmZhY2VzQnVmZmVyO1xyXG5cdHRoaXMuY29sb3JzQnVmZmVyID0gZ2VvbWV0cnkuY29sb3JzQnVmZmVyO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IGdlb21ldHJ5Lm5vcm1hbHNCdWZmZXI7XHJcbn07XHJcbiIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxudmFyIFZlY3RvcjQgPSByZXF1aXJlKCcuL0tUVmVjdG9yNCcpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlCb3god2lkdGgsIGxlbmd0aCwgaGVpZ2h0LCBwYXJhbXMpe1xyXG5cdHRoaXMuX19rdGdlb21ldHJ5ID0gdHJ1ZTtcclxuXHR0aGlzLnJlYWR5ID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgYm94R2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0XHJcblx0dmFyIHcgPSB3aWR0aCAvIDI7XHJcblx0dmFyIGwgPSBsZW5ndGggLyAyO1xyXG5cdHZhciBoID0gaGVpZ2h0IC8gMjtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0XHJcblx0dGhpcy51dlJlZ2lvbiA9IChwYXJhbXMudXZSZWdpb24pPyBwYXJhbXMudXZSZWdpb24gOiBuZXcgVmVjdG9yNCgwLjAsIDAuMCwgMS4wLCAxLjApO1xyXG5cdHRoaXMuY29sb3JUb3AgPSAocGFyYW1zLmNvbG9yVG9wKT8gcGFyYW1zLmNvbG9yVG9wIDogQ29sb3IuX1dISVRFO1xyXG5cdHRoaXMuY29sb3JCb3R0b20gPSAocGFyYW1zLmNvbG9yQm90dG9tKT8gcGFyYW1zLmNvbG9yQm90dG9tIDogQ29sb3IuX1dISVRFO1xyXG5cdFxyXG5cdHZhciB4ciA9IHRoaXMudXZSZWdpb24ueDtcclxuXHR2YXIgeXIgPSB0aGlzLnV2UmVnaW9uLnk7XHJcblx0dmFyIGhyID0gdGhpcy51dlJlZ2lvbi56O1xyXG5cdHZhciB2ciA9IHRoaXMudXZSZWdpb24udztcclxuXHRcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgLWgsICBsLCB0aGlzLmNvbG9yQm90dG9tLCBociwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgIGwsIHRoaXMuY29sb3JUb3AsIHhyLCB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAgbCwgdGhpcy5jb2xvckJvdHRvbSwgeHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgIGgsICBsLCB0aGlzLmNvbG9yVG9wLCBociwgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgLWwsIHRoaXMuY29sb3JCb3R0b20sIHhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAtbCwgdGhpcy5jb2xvclRvcCwgeHIsIHZyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgLWgsIC1sLCB0aGlzLmNvbG9yQm90dG9tLCBociwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgLWwsIHRoaXMuY29sb3JUb3AsIGhyLCB2cik7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAtbCwgdGhpcy5jb2xvckJvdHRvbSwgaHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgIGgsICBsLCB0aGlzLmNvbG9yVG9wLCB4ciwgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgIGwsIHRoaXMuY29sb3JCb3R0b20sIHhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAtbCwgdGhpcy5jb2xvclRvcCwgaHIsIHZyKTtcclxuXHRcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgLWgsICBsLCB0aGlzLmNvbG9yQm90dG9tLCBociwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgIGwsIHRoaXMuY29sb3JUb3AsIGhyLCB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAtbCwgdGhpcy5jb2xvckJvdHRvbSwgeHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgIGgsIC1sLCB0aGlzLmNvbG9yVG9wLCB4ciwgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgIGwsIHRoaXMuY29sb3JUb3AsIGhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAtbCwgdGhpcy5jb2xvclRvcCwgeHIsIHZyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgIGgsICBsLCB0aGlzLmNvbG9yVG9wLCB4ciwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgLWwsIHRoaXMuY29sb3JUb3AsIGhyLCB2cik7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAgbCwgdGhpcy5jb2xvckJvdHRvbSwgeHIsIHZyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgLWgsIC1sLCB0aGlzLmNvbG9yQm90dG9tLCB4ciwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgIGwsIHRoaXMuY29sb3JCb3R0b20sIGhyLCB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAtbCwgdGhpcy5jb2xvckJvdHRvbSwgaHIsIHlyKTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSgwLCAxLCAyKTtcclxuXHRib3hHZW8uYWRkRmFjZSgwLCAzLCAxKTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSg0LCA1LCA2KTtcclxuXHRib3hHZW8uYWRkRmFjZSg1LCA3LCA2KTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSg4LCA5LCAxMCk7XHJcblx0Ym94R2VvLmFkZEZhY2UoOCwgMTEsIDkpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDEyLCAxMywgMTQpO1xyXG5cdGJveEdlby5hZGRGYWNlKDEzLCAxNSwgMTQpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDE2LCAxNywgMTgpO1xyXG5cdGJveEdlby5hZGRGYWNlKDE2LCAxOSwgMTcpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDIwLCAyMSwgMjIpO1xyXG5cdGJveEdlby5hZGRGYWNlKDIxLCAyMywgMjIpO1xyXG5cdFxyXG5cdGJveEdlby5jb21wdXRlRmFjZXNOb3JtYWxzKCk7XHJcblx0Ym94R2VvLmJ1aWxkKCk7XHJcblx0XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgPSBib3hHZW8udmVydGV4QnVmZmVyO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gYm94R2VvLnRleEJ1ZmZlcjtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gYm94R2VvLmZhY2VzQnVmZmVyO1xyXG5cdHRoaXMuY29sb3JzQnVmZmVyID0gYm94R2VvLmNvbG9yc0J1ZmZlcjtcclxuXHR0aGlzLm5vcm1hbHNCdWZmZXIgPSBib3hHZW8ubm9ybWFsc0J1ZmZlcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeUJveDsiLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbnZhciBWZWN0b3I0ID0gcmVxdWlyZSgnLi9LVFZlY3RvcjQnKTtcclxudmFyIEtUTWF0aCA9IHJlcXVpcmUoJy4vS1RNYXRoJyk7XHJcblxyXG5mdW5jdGlvbiBHZW9tZXRyeUN5bGluZGVyKHJhZGl1c1RvcCwgcmFkaXVzQm90dG9tLCBoZWlnaHQsIHdpZHRoU2VnbWVudHMsIGhlaWdodFNlZ21lbnRzLCBvcGVuVG9wLCBvcGVuQm90dG9tLCBwYXJhbXMpe1xyXG5cdHRoaXMuX19rdGdlb21ldHJ5ID0gdHJ1ZTtcclxuXHR0aGlzLnJlYWR5ID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgY3lsR2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cdFxyXG5cdHRoaXMudXZSZWdpb24gPSAocGFyYW1zLnV2UmVnaW9uKT8gcGFyYW1zLnV2UmVnaW9uIDogbmV3IFZlY3RvcjQoMC4wLCAwLjAsIDEuMCwgMS4wKTtcclxuXHRcclxuXHR2YXIgeHIgPSB0aGlzLnV2UmVnaW9uLng7XHJcblx0dmFyIHlyID0gdGhpcy51dlJlZ2lvbi55O1xyXG5cdHZhciBociA9IHRoaXMudXZSZWdpb24ueiAtIHhyO1xyXG5cdHZhciB2ciA9IHRoaXMudXZSZWdpb24udyAtIHlyO1xyXG5cdFxyXG5cdHZhciBoID0gaGVpZ2h0IC8gMjtcclxuXHRcclxuXHR2YXIgYmFuZFcgPSBLVE1hdGguUEkyIC8gKHdpZHRoU2VnbWVudHMgLSAxKTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTx3aWR0aFNlZ21lbnRzO2krKyl7XHJcblx0XHR2YXIgeDEgPSBNYXRoLmNvcyhiYW5kVyAqIGkpO1xyXG5cdFx0dmFyIHkxID0gLWg7XHJcblx0XHR2YXIgejEgPSAtTWF0aC5zaW4oYmFuZFcgKiBpKTtcclxuXHRcdHZhciB4MiA9IE1hdGguY29zKGJhbmRXICogaSk7XHJcblx0XHR2YXIgeTIgPSBoO1xyXG5cdFx0dmFyIHoyID0gLU1hdGguc2luKGJhbmRXICogaSk7XHJcblx0XHRcclxuXHRcdHZhciB4dCA9IGkgLyAod2lkdGhTZWdtZW50cyAtIDEpO1xyXG5cdFx0XHJcblx0XHRjeWxHZW8uYWRkTm9ybWFsKHgxLCAwLCB6MSk7XHJcblx0XHRjeWxHZW8uYWRkTm9ybWFsKHgyLCAwLCB6Mik7XHJcblx0XHRcclxuXHRcdHgxICo9IHJhZGl1c0JvdHRvbTtcclxuXHRcdHoxICo9IHJhZGl1c0JvdHRvbTtcclxuXHRcdHgyICo9IHJhZGl1c1RvcDtcclxuXHRcdHoyICo9IHJhZGl1c1RvcDtcclxuXHRcdFxyXG5cdFx0Y3lsR2VvLmFkZFZlcnRpY2UoIHgxLCB5MSwgejEsIENvbG9yLl9XSElURSwgeHIgKyAoeHQgKiBociksIHlyKTtcclxuXHRcdGN5bEdlby5hZGRWZXJ0aWNlKCB4MiwgeTIsIHoyLCBDb2xvci5fV0hJVEUsIHhyICsgKHh0ICogaHIpLCB5ciArIHZyKTtcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8d2lkdGhTZWdtZW50cyoyIC0gMjtpKz0yKXtcclxuXHRcdHZhciBpMSA9IGk7XHJcblx0XHR2YXIgaTIgPSBpKzE7XHJcblx0XHR2YXIgaTMgPSBpKzI7XHJcblx0XHR2YXIgaTQgPSBpKzM7XHJcblx0XHRcclxuXHRcdGN5bEdlby5hZGRGYWNlKGkzLCBpMiwgaTEpO1xyXG5cdFx0Y3lsR2VvLmFkZEZhY2UoaTMsIGk0LCBpMik7XHJcblx0fVxyXG5cdFxyXG5cdGlmICghb3BlblRvcCB8fCAhb3BlbkJvdHRvbSl7XHJcblx0XHR2YXIgaTEgPSBjeWxHZW8uYWRkVmVydGljZSggMCwgaCwgMCwgQ29sb3IuX1dISVRFLCB4ciArICgwLjUgKiBociksIHlyICsgKDAuNSAqIHZyKSk7XHJcblx0XHR2YXIgaTIgPSBjeWxHZW8uYWRkVmVydGljZSggMCwgLWgsIDAsIENvbG9yLl9XSElURSwgeHIgKyAoMC41ICogaHIpLCB5ciArICgwLjUgKiB2cikpO1xyXG5cdFx0Y3lsR2VvLmFkZE5vcm1hbCgwLCAgMSwgMCk7XHJcblx0XHRjeWxHZW8uYWRkTm9ybWFsKDAsIC0xLCAwKTtcclxuXHRcdGZvciAodmFyIGk9MDtpPHdpZHRoU2VnbWVudHMqMiAtIDI7aSs9Mil7XHJcblx0XHRcdHZhciB2MSA9IGN5bEdlby52ZXJ0aWNlc1tpICsgMV07XHJcblx0XHRcdHZhciB2MiA9IGN5bEdlby52ZXJ0aWNlc1tpICsgM107XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgdHgxID0geHIgKyAodjEueCAvIDIgKyAwLjUpICogaHI7XHJcblx0XHRcdHZhciB0eTEgPSB5ciArICh2MS56IC8gMiArIDAuNSkgKiB2cjtcclxuXHRcdFx0dmFyIHR4MiA9IHhyICsgKHYyLnggLyAyICsgMC41KSAqIGhyO1xyXG5cdFx0XHR2YXIgdHkyID0geXIgKyAodjIueiAvIDIgKyAwLjUpICogdnI7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoIW9wZW5Ub3Ape1xyXG5cdFx0XHRcdHZhciBpMyA9IGN5bEdlby5hZGRWZXJ0aWNlKCB2MS54LCBoLCB2MS56LCBDb2xvci5fV0hJVEUsIHR4MSwgdHkxKTtcclxuXHRcdFx0XHR2YXIgaTQgPSBjeWxHZW8uYWRkVmVydGljZSggdjIueCwgaCwgdjIueiwgQ29sb3IuX1dISVRFLCB0eDIsIHR5Mik7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Y3lsR2VvLmFkZE5vcm1hbCgwLCAxLCAwKTtcclxuXHRcdFx0XHRjeWxHZW8uYWRkTm9ybWFsKDAsIDEsIDApO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGN5bEdlby5hZGRGYWNlKGk0LCBpMSwgaTMpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoIW9wZW5Cb3R0b20pe1xyXG5cdFx0XHRcdHZhciBpMyA9IGN5bEdlby5hZGRWZXJ0aWNlKCB2MS54LCAtaCwgdjEueiwgQ29sb3IuX1dISVRFLCB0eDEsIHR5MSk7XHJcblx0XHRcdFx0dmFyIGk0ID0gY3lsR2VvLmFkZFZlcnRpY2UoIHYyLngsIC1oLCB2Mi56LCBDb2xvci5fV0hJVEUsIHR4MiwgdHkyKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRjeWxHZW8uYWRkTm9ybWFsKDAsIC0xLCAwKTtcclxuXHRcdFx0XHRjeWxHZW8uYWRkTm9ybWFsKDAsIC0xLCAwKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRjeWxHZW8uYWRkRmFjZShpMywgaTIsIGk0KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRjeWxHZW8uYnVpbGQoKTtcclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IGN5bEdlby52ZXJ0ZXhCdWZmZXI7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBjeWxHZW8udGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBjeWxHZW8uZmFjZXNCdWZmZXI7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBjeWxHZW8uY29sb3JzQnVmZmVyO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IGN5bEdlby5ub3JtYWxzQnVmZmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5Q3lsaW5kZXI7IiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG52YXIgVmVjdG9yNCA9IHJlcXVpcmUoJy4vS1RWZWN0b3I0Jyk7XHJcblxyXG5mdW5jdGlvbiBHZW9tZXRyeUdVSVRleHR1cmUod2lkdGgsIGhlaWdodCwgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0dGhpcy5yZWFkeSA9IHRydWU7XHJcblx0XHJcblx0dmFyIGd1aVRleCA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdHZhciB4MSA9IDAuMDtcclxuXHR2YXIgeTEgPSAwLjA7XHJcblx0dmFyIHgyID0gd2lkdGg7XHJcblx0dmFyIHkyID0gaGVpZ2h0O1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHRcclxuXHR0aGlzLnV2UmVnaW9uID0gKHBhcmFtcy51dlJlZ2lvbik/IHBhcmFtcy51dlJlZ2lvbiA6IG5ldyBWZWN0b3I0KDAuMCwgMC4wLCAxLjAsIDEuMCk7XHJcblx0XHJcblx0dmFyIHhyID0gdGhpcy51dlJlZ2lvbi54O1xyXG5cdHZhciB5ciA9IHRoaXMudXZSZWdpb24ueTtcclxuXHR2YXIgaHIgPSB0aGlzLnV2UmVnaW9uLno7XHJcblx0dmFyIHZyID0gdGhpcy51dlJlZ2lvbi53O1xyXG5cdFxyXG5cdGd1aVRleC5hZGRWZXJ0aWNlKHgyLCB5MSwgMC4wLCBDb2xvci5fV0hJVEUsIGhyLCB5cik7XHJcblx0Z3VpVGV4LmFkZFZlcnRpY2UoeDEsIHkyLCAwLjAsIENvbG9yLl9XSElURSwgeHIsIHZyKTtcclxuXHRndWlUZXguYWRkVmVydGljZSh4MSwgeTEsIDAuMCwgQ29sb3IuX1dISVRFLCB4ciwgeXIpO1xyXG5cdGd1aVRleC5hZGRWZXJ0aWNlKHgyLCB5MiwgMC4wLCBDb2xvci5fV0hJVEUsIGhyLCB2cik7XHJcblx0XHJcblx0Z3VpVGV4LmFkZEZhY2UoMCwgMSwgMik7XHJcblx0Z3VpVGV4LmFkZEZhY2UoMCwgMywgMSk7XHJcblx0XHJcblx0Z3VpVGV4LmNvbXB1dGVGYWNlc05vcm1hbHMoKTtcclxuXHRndWlUZXguYnVpbGQoKTtcclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IGd1aVRleC52ZXJ0ZXhCdWZmZXI7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBndWlUZXgudGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBndWlUZXguZmFjZXNCdWZmZXI7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBndWlUZXguY29sb3JzQnVmZmVyO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IGd1aVRleC5ub3JtYWxzQnVmZmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5R1VJVGV4dHVyZTsiLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbnZhciBWZWN0b3I0ID0gcmVxdWlyZSgnLi9LVFZlY3RvcjQnKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5UGxhbmUod2lkdGgsIGhlaWdodCwgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0dGhpcy5yZWFkeSA9IHRydWU7XHJcblx0XHJcblx0dmFyIHBsYW5lR2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0XHJcblx0dmFyIHcgPSB3aWR0aCAvIDI7XHJcblx0dmFyIGggPSBoZWlnaHQgLyAyO1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHRcclxuXHR0aGlzLnV2UmVnaW9uID0gKHBhcmFtcy51dlJlZ2lvbik/IHBhcmFtcy51dlJlZ2lvbiA6IG5ldyBWZWN0b3I0KDAuMCwgMC4wLCAxLjAsIDEuMCk7XHJcblx0XHJcblx0dmFyIHhyID0gdGhpcy51dlJlZ2lvbi54O1xyXG5cdHZhciB5ciA9IHRoaXMudXZSZWdpb24ueTtcclxuXHR2YXIgaHIgPSB0aGlzLnV2UmVnaW9uLno7XHJcblx0dmFyIHZyID0gdGhpcy51dlJlZ2lvbi53O1xyXG5cdFxyXG5cdHBsYW5lR2VvLmFkZFZlcnRpY2UoIHcsIDAsICBoLCBDb2xvci5fV0hJVEUsIGhyLCB5cik7XHJcblx0cGxhbmVHZW8uYWRkVmVydGljZSgtdywgMCwgLWgsIENvbG9yLl9XSElURSwgeHIsIHZyKTtcclxuXHRwbGFuZUdlby5hZGRWZXJ0aWNlKC13LCAwLCAgaCwgQ29sb3IuX1dISVRFLCB4ciwgeXIpO1xyXG5cdHBsYW5lR2VvLmFkZFZlcnRpY2UoIHcsIDAsIC1oLCBDb2xvci5fV0hJVEUsIGhyLCB2cik7XHJcblx0XHJcblx0cGxhbmVHZW8uYWRkRmFjZSgwLCAxLCAyKTtcclxuXHRwbGFuZUdlby5hZGRGYWNlKDAsIDMsIDEpO1xyXG5cdFxyXG5cdHBsYW5lR2VvLmNvbXB1dGVGYWNlc05vcm1hbHMoKTtcclxuXHRwbGFuZUdlby5idWlsZCgpO1xyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gcGxhbmVHZW8udmVydGV4QnVmZmVyO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gcGxhbmVHZW8udGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBwbGFuZUdlby5mYWNlc0J1ZmZlcjtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IHBsYW5lR2VvLmNvbG9yc0J1ZmZlcjtcclxuXHR0aGlzLm5vcm1hbHNCdWZmZXIgPSBwbGFuZUdlby5ub3JtYWxzQnVmZmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5UGxhbmU7IiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG52YXIgVmVjdG9yNCA9IHJlcXVpcmUoJy4vS1RWZWN0b3I0Jyk7XHJcbnZhciBNYXRlcmlhbCA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbCcpO1xyXG52YXIgTWF0ZXJpYWxCYXNpYyA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbEJhc2ljJyk7XHJcbnZhciBNZXNoID0gcmVxdWlyZSgnLi9LVE1lc2gnKTtcclxudmFyIEdlb21ldHJ5UGxhbmUgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnlQbGFuZScpO1xyXG52YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlTa3lib3gocG9zaXRpb24sIHRleHR1cmUpe1xyXG5cdHRoaXMubWVzaGVzID0gW107XHJcblx0dGhpcy50ZXh0dXJlID0gdGV4dHVyZTtcclxuXHRcclxuXHR0aGlzLmJveEdlbyA9IG5ldyBLVC5HZW9tZXRyeUJveCgxLjAsIDEuMCwgMS4wKTtcclxuXHR0aGlzLmJveCA9IG5ldyBLVC5NZXNoKHRoaXMuYm94R2VvLCBuZXcgTWF0ZXJpYWxCYXNpYygpKTtcclxuXHR0aGlzLmJveC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cdFxyXG5cdHRoaXMuc2V0TWF0ZXJpYWwoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeVNreWJveDtcclxuXHJcbkdlb21ldHJ5U2t5Ym94Lm1hdGVyaWFsID0gbnVsbDtcclxuR2VvbWV0cnlTa3lib3gucHJvdG90eXBlLnNldE1hdGVyaWFsID0gZnVuY3Rpb24oKXtcclxuXHRpZiAoR2VvbWV0cnlTa3lib3gubWF0ZXJpYWwpIHJldHVybjtcclxuXHRcclxuXHR2YXIgbWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoe1xyXG5cdFx0c2hhZGVyOiBLVC5zaGFkZXJzLnNreWJveCxcclxuXHRcdHNlbmRBdHRyaWJEYXRhOiBmdW5jdGlvbihtZXNoLCBjYW1lcmEsIHNjZW5lKXtcclxuXHRcdFx0dmFyIGdsID0gS1QuZ2w7XHJcblx0XHRcdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuXHRcdFx0Zm9yICh2YXIgaT0wLGxlbj1hdHRyaWJ1dGVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0XHRcdHZhciBhdHQgPSBhdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhQb3NpdGlvblwiKXtcclxuXHRcdFx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIpO1xyXG5cdFx0XHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LnZlcnRleEJ1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRzZW5kVW5pZm9ybURhdGE6IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUsIHRleHR1cmUpe1xyXG5cdFx0XHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcdFx0dmFyIHVuaWZvcm1zID0gdGhpcy5zaGFkZXIudW5pZm9ybXM7XHJcblx0XHRcdGZvciAodmFyIGk9MCxsZW49dW5pZm9ybXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHRcdFx0dmFyIHVuaSA9IHVuaWZvcm1zW2ldO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmICh1bmkubmFtZSA9PSAndU1WUE1hdHJpeCcpe1xyXG5cdFx0XHRcdFx0dmFyIG12cCA9IG1lc2guZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKS5tdWx0aXBseShjYW1lcmEudHJhbnNmb3JtYXRpb25NYXRyaXgpLm11bHRpcGx5KGNhbWVyYS5wZXJzcGVjdGl2ZU1hdHJpeCk7XHJcblx0XHRcdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG12cC50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdFx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VDdWJlbWFwJyl7XHJcblx0XHRcdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwKTtcclxuXHRcdFx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIHRleHR1cmUudGV4dHVyZSk7XHJcblx0XHRcdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHRcclxuXHRHZW9tZXRyeVNreWJveC5tYXRlcmlhbCA9IG1hdGVyaWFsO1xyXG59O1xyXG5cclxuR2VvbWV0cnlTa3lib3gucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBtYXRlcmlhbCA9IEdlb21ldHJ5U2t5Ym94Lm1hdGVyaWFsO1xyXG5cdFxyXG5cdG1hdGVyaWFsLnNlbmRBdHRyaWJEYXRhKHRoaXMuYm94LCBjYW1lcmEsIHNjZW5lKTtcclxuXHRtYXRlcmlhbC5zZW5kVW5pZm9ybURhdGEodGhpcy5ib3gsIGNhbWVyYSwgc2NlbmUsIHRoaXMudGV4dHVyZSk7XHJcbn07XHJcbiIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxudmFyIFZlY3RvcjQgPSByZXF1aXJlKCcuL0tUVmVjdG9yNCcpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlTcGhlcmUocmFkaXVzLCBsYXRCYW5kcywgbG9uQmFuZHMsIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdHRoaXMucmVhZHkgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBzcGhHZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0XHJcblx0dGhpcy51dlJlZ2lvbiA9IChwYXJhbXMudXZSZWdpb24pPyBwYXJhbXMudXZSZWdpb24gOiBuZXcgVmVjdG9yNCgwLjAsIDAuMCwgMS4wLCAxLjApO1xyXG5cdFxyXG5cdHZhciB4ciA9IHRoaXMudXZSZWdpb24ueDtcclxuXHR2YXIgeXIgPSB0aGlzLnV2UmVnaW9uLnk7XHJcblx0dmFyIGhyID0gdGhpcy51dlJlZ2lvbi56IC0geHI7XHJcblx0dmFyIHZyID0gdGhpcy51dlJlZ2lvbi53IC0geXI7XHJcblx0dmFyIGhzID0gKHBhcmFtcy5oYWxmU3BoZXJlKT8gMS4wIDogMi4wO1xyXG5cdFxyXG5cdGZvciAodmFyIGxhdE49MDtsYXROPD1sYXRCYW5kcztsYXROKyspe1xyXG5cdFx0dmFyIHRoZXRhID0gbGF0TiAqIE1hdGguUEkgLyBsYXRCYW5kcztcclxuXHRcdHZhciBjb3NUID0gTWF0aC5jb3ModGhldGEpO1xyXG5cdFx0dmFyIHNpblQgPSBNYXRoLnNpbih0aGV0YSk7XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGxvbk49MDtsb25OPD1sb25CYW5kcztsb25OKyspe1xyXG5cdFx0XHR2YXIgcGhpID0gbG9uTiAqIGhzICogTWF0aC5QSSAvIGxvbkJhbmRzO1xyXG5cdFx0XHR2YXIgY29zUCA9IE1hdGguY29zKHBoaSk7XHJcblx0XHRcdHZhciBzaW5QID0gTWF0aC5zaW4ocGhpKTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciB4ID0gY29zUCAqIHNpblQ7XHJcblx0XHRcdHZhciB5ID0gY29zVDtcclxuXHRcdFx0dmFyIHogPSBzaW5QICogc2luVDtcclxuXHRcdFx0XHJcblx0XHRcdHZhciB0eCA9IGxvbk4gLyBsb25CYW5kcztcclxuXHRcdFx0dmFyIHR5ID0gMSAtIGxhdE4gLyBsYXRCYW5kcztcclxuXHRcdFx0XHJcblx0XHRcdHNwaEdlby5hZGROb3JtYWwoeCwgeSwgeik7XHJcblx0XHRcdHNwaEdlby5hZGRWZXJ0aWNlKHggKiByYWRpdXMsIHkgKiByYWRpdXMsIHogKiByYWRpdXMsIENvbG9yLl9XSElURSwgeHIgKyB0eCAqIGhyLCB5ciArIHR5ICogdnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBsYXROPTA7bGF0TjxsYXRCYW5kcztsYXROKyspe1xyXG5cdFx0Zm9yICh2YXIgbG9uTj0wO2xvbk48bG9uQmFuZHM7bG9uTisrKXtcclxuXHRcdFx0dmFyIGkxID0gbG9uTiArIChsYXROICogKGxvbkJhbmRzICsgMSkpO1xyXG5cdFx0XHR2YXIgaTIgPSBpMSArIGxvbkJhbmRzICsgMTtcclxuXHRcdFx0dmFyIGkzID0gaTEgKyAxO1xyXG5cdFx0XHR2YXIgaTQgPSBpMiArIDE7XHJcblx0XHRcdFxyXG5cdFx0XHRzcGhHZW8uYWRkRmFjZShpNCwgaTEsIGkzKTtcclxuXHRcdFx0c3BoR2VvLmFkZEZhY2UoaTQsIGkyLCBpMSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHNwaEdlby5idWlsZCgpO1xyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gc3BoR2VvLnZlcnRleEJ1ZmZlcjtcclxuXHR0aGlzLnRleEJ1ZmZlciA9IHNwaEdlby50ZXhCdWZmZXI7XHJcblx0dGhpcy5mYWNlc0J1ZmZlciA9IHNwaEdlby5mYWNlc0J1ZmZlcjtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IHNwaEdlby5jb2xvcnNCdWZmZXI7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gc3BoR2VvLm5vcm1hbHNCdWZmZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnlTcGhlcmU7IiwidmFyIFV0aWxzID0gcmVxdWlyZSgnLi9LVFV0aWxzJyk7XHJcbnZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBWZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxuXHJcbnZhciBJbnB1dCA9IHtcclxuXHRfa2V5czogW10sXHJcblx0X21vdXNlOiB7XHJcblx0XHRsZWZ0OiAwLFxyXG5cdFx0cmlnaHQ6IDAsXHJcblx0XHRtaWRkbGU6IDAsXHJcblx0XHR3aGVlbDogMCxcclxuXHRcdHBvc2l0aW9uOiBuZXcgVmVjdG9yMigwLjAsIDAuMClcclxuXHR9LFxyXG5cdFxyXG5cdHZLZXk6IHtcclxuXHRcdFNISUZUOiAxNixcclxuXHRcdFRBQjogOSxcclxuXHRcdENUUkw6IDE3LFxyXG5cdFx0QUxUOiAxOCxcclxuXHRcdFNQQUNFOiAzMixcclxuXHRcdEVOVEVSOiAxMyxcclxuXHRcdEJBQ0tTUEFDRTogOCxcclxuXHRcdEVTQzogMjcsXHJcblx0XHRJTlNFUlQ6IDQ1LFxyXG5cdFx0REVMOiA0NixcclxuXHRcdEVORDogMzUsXHJcblx0XHRTVEFSVDogMzYsXHJcblx0XHRQQUdFVVA6IDMzLFxyXG5cdFx0UEFHRURPV046IDM0XHJcblx0fSxcclxuXHRcclxuXHR2TW91c2U6IHtcclxuXHRcdExFRlQ6ICdsZWZ0JyxcclxuXHRcdFJJR0hUOiAncmlnaHQnLFxyXG5cdFx0TUlERExFOiAnbWlkZGxlJyxcclxuXHRcdFdIRUVMVVA6IDEsXHJcblx0XHRXSEVFTERPV046IC0xLFxyXG5cdH0sXHJcblx0XHJcblx0dXNlTG9ja1BvaW50ZXI6IGZhbHNlLFxyXG5cdG1vdXNlTG9ja2VkOiBmYWxzZSxcclxuXHRcclxuXHRpc0tleURvd246IGZ1bmN0aW9uKGtleUNvZGUpe1xyXG5cdFx0cmV0dXJuIChJbnB1dC5fa2V5c1trZXlDb2RlXSA9PSAxKTtcclxuXHR9LFxyXG5cdFxyXG5cdGlzS2V5UHJlc3NlZDogZnVuY3Rpb24oa2V5Q29kZSl7XHJcblx0XHRpZiAoSW5wdXQuX2tleXNba2V5Q29kZV0gPT0gMSl7XHJcblx0XHRcdElucHV0Ll9rZXlzW2tleUNvZGVdID0gMjtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGlzTW91c2VEb3duOiBmdW5jdGlvbihtb3VzZUJ1dHRvbil7XHJcblx0XHRyZXR1cm4gKElucHV0Ll9tb3VzZVttb3VzZUJ1dHRvbl0gPT0gMSk7XHJcblx0fSxcclxuXHRcclxuXHRpc01vdXNlUHJlc3NlZDogZnVuY3Rpb24obW91c2VCdXR0b24pe1xyXG5cdFx0aWYgKElucHV0Ll9tb3VzZVttb3VzZUJ1dHRvbl0gPT0gMSl7XHJcblx0XHRcdElucHV0Ll9tb3VzZVttb3VzZUJ1dHRvbl0gPSAyO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0aXNXaGVlbE1vdmVkOiBmdW5jdGlvbih3aGVlbERpcil7XHJcblx0XHRpZiAoSW5wdXQuX21vdXNlLndoZWVsID09IHdoZWVsRGlyKXtcclxuXHRcdFx0SW5wdXQuX21vdXNlLndoZWVsID0gMDtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZUtleURvd246IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHJcblx0XHRpZiAoSW5wdXQuX2tleXNbZXYua2V5Q29kZV0gPT0gMikgcmV0dXJuO1xyXG5cdFx0SW5wdXQuX2tleXNbZXYua2V5Q29kZV0gPSAxO1xyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlS2V5VXA6IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHJcblx0XHRJbnB1dC5fa2V5c1tldi5rZXlDb2RlXSA9IDA7XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVNb3VzZURvd246IGZ1bmN0aW9uKGV2LCBjYW52YXMpe1xyXG5cdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcclxuXHRcdGlmIChJbnB1dC51c2VMb2NrUG9pbnRlcilcclxuXHRcdFx0Y2FudmFzLnJlcXVlc3RQb2ludGVyTG9jaygpO1xyXG5cdFx0XHJcblx0XHRpZiAoZXYud2hpY2ggPT0gMSl7XHJcblx0XHRcdGlmIChJbnB1dC5fbW91c2UubGVmdCAhPSAyKVxyXG5cdFx0XHRcdElucHV0Ll9tb3VzZS5sZWZ0ID0gMTtcclxuXHRcdH1lbHNlIGlmIChldi53aGljaCA9PSAyKXtcclxuXHRcdFx0aWYgKElucHV0Ll9tb3VzZS5taWRkbGUgIT0gMilcclxuXHRcdFx0XHRJbnB1dC5fbW91c2UubWlkZGxlID0gMTtcclxuXHRcdH1lbHNlIGlmIChldi53aGljaCA9PSAzKXtcclxuXHRcdFx0aWYgKElucHV0Ll9tb3VzZS5yaWdodCAhPSAyKVxyXG5cdFx0XHRcdElucHV0Ll9tb3VzZS5yaWdodCA9IDE7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdElucHV0LmhhbmRsZU1vdXNlTW92ZShldik7XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlTW91c2VVcDogZnVuY3Rpb24oZXYpe1xyXG5cdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcclxuXHRcdGlmIChldi53aGljaCA9PSAxKXtcclxuXHRcdFx0SW5wdXQuX21vdXNlLmxlZnQgPSAwO1xyXG5cdFx0fWVsc2UgaWYgKGV2LndoaWNoID09IDIpe1xyXG5cdFx0XHRJbnB1dC5fbW91c2UubWlkZGxlID0gMDtcclxuXHRcdH1lbHNlIGlmIChldi53aGljaCA9PSAzKXtcclxuXHRcdFx0SW5wdXQuX21vdXNlLnJpZ2h0ID0gMDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0SW5wdXQuaGFuZGxlTW91c2VNb3ZlKGV2KTtcclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVNb3VzZVdoZWVsOiBmdW5jdGlvbihldil7XHJcblx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFxyXG5cdFx0SW5wdXQuX21vdXNlLndoZWVsID0gMDtcclxuXHRcdGlmIChldi53aGVlbERlbHRhID4gMCkgSW5wdXQuX21vdXNlLndoZWVsID0gMTtcclxuXHRcdGVsc2UgaWYgKGV2LndoZWVsRGVsdGEgPCAwKSBJbnB1dC5fbW91c2Uud2hlZWwgPSAtMTtcclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZU1vdXNlTW92ZTogZnVuY3Rpb24oZXYpe1xyXG5cdFx0aWYgKElucHV0Lm1vdXNlTG9ja2VkKSByZXR1cm47XHJcblx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFxyXG5cdFx0dmFyIGVsWCA9IGV2LmNsaWVudFggLSBldi50YXJnZXQub2Zmc2V0TGVmdDtcclxuXHRcdHZhciBlbFkgPSBldi5jbGllbnRZIC0gZXYudGFyZ2V0Lm9mZnNldFRvcDtcclxuXHRcdFxyXG5cdFx0SW5wdXQuX21vdXNlLnBvc2l0aW9uLnNldChlbFgsIGVsWSk7XHJcblx0fSxcclxuXHRcclxuXHRtb3ZlQ2FsbGJhY2s6IGZ1bmN0aW9uKGUpe1xyXG5cdFx0dmFyIGVsWCA9IGUubW92ZW1lbnRYIHx8XHJcblx0XHRcdFx0ZS5tb3pNb3ZlbWVudFggfHxcclxuXHRcdFx0XHRlLndlYmtpdE1vdmVtZW50WCB8fFxyXG5cdFx0XHRcdDA7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0dmFyIGVsWSA9IGUubW92ZW1lbnRZIHx8XHJcblx0XHRcdFx0ZS5tb3pNb3ZlbWVudFkgfHxcclxuXHRcdFx0XHRlLndlYmtpdE1vdmVtZW50WSB8fFxyXG5cdFx0XHRcdDA7XHJcblx0XHRcclxuXHRcdElucHV0Ll9tb3VzZS5wb3NpdGlvbi5hZGQobmV3IFZlY3RvcjIoZWxYLCBlbFkpKTtcclxuXHR9LFxyXG5cdFxyXG5cdHBvaW50ZXJsb2NrY2hhbmdlOiBmdW5jdGlvbihlLCBjYW52YXMpe1xyXG5cdFx0aWYgKGRvY3VtZW50LnBvaW50ZXJMb2NrRWxlbWVudCA9PT0gY2FudmFzIHx8XHJcblx0XHRcdGRvY3VtZW50Lm1velBvaW50ZXJMb2NrRWxlbWVudCA9PT0gY2FudmFzIHx8XHJcblx0XHRcdGRvY3VtZW50LndlYmtpdFBvaW50ZXJMb2NrRWxlbWVudCA9PT0gY2FudmFzKXtcclxuXHRcdFx0XHRcclxuXHRcdFx0SW5wdXQubW91c2VMb2NrZWQgPSB0cnVlO1xyXG5cdFx0XHRVdGlscy5hZGRFdmVudChkb2N1bWVudCwgXCJtb3VzZW1vdmVcIiwgSW5wdXQubW92ZUNhbGxiYWNrKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRJbnB1dC5tb3VzZUxvY2tlZCA9IGZhbHNlO1xyXG5cdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIElucHV0Lm1vdmVDYWxsYmFjayk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihjYW52YXMpe1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoZG9jdW1lbnQsICdrZXlkb3duJywgSW5wdXQuaGFuZGxlS2V5RG93bik7XHJcblx0XHRVdGlscy5hZGRFdmVudChkb2N1bWVudCwgJ2tleXVwJywgSW5wdXQuaGFuZGxlS2V5VXApO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoY2FudmFzLCAnbW91c2Vkb3duJywgZnVuY3Rpb24oZSl7IElucHV0LmhhbmRsZU1vdXNlRG93bihlLCBjYW52YXMpOyB9KTtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGRvY3VtZW50LCAnbW91c2V1cCcsIElucHV0LmhhbmRsZU1vdXNlVXApO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoY2FudmFzLCAnbW91c2V3aGVlbCcsIElucHV0LmhhbmRsZU1vdXNlV2hlZWwpO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoY2FudmFzLCAnbW91c2Vtb3ZlJywgSW5wdXQuaGFuZGxlTW91c2VNb3ZlKTtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGRvY3VtZW50LCAnY29udGV4dG1lbnUnLCBmdW5jdGlvbihldil7XHJcblx0XHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGV2LnRhcmdldCA9PT0gY2FudmFzKXtcclxuXHRcdFx0XHRldi5jYW5jZWxCdWJibGUgPSB0cnVlO1xyXG5cdFx0XHRcdGV2LnJldHVyblZhbHVlID0gZmFsc2U7XHJcblx0XHRcdFx0aWYgKGV2LnByZXZlbnREZWZhdWx0KVxyXG5cdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRpZiAoZXYuc3RvcFByb3BhZ2F0aW9uKVxyXG5cdFx0XHRcdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRVdGlscy5hZGRFdmVudChkb2N1bWVudCwgXCJwb2ludGVybG9ja2NoYW5nZVwiLCBmdW5jdGlvbihlKXsgSW5wdXQucG9pbnRlcmxvY2tjaGFuZ2UoZSwgY2FudmFzKTsgfSk7XHJcblx0XHRVdGlscy5hZGRFdmVudChkb2N1bWVudCwgXCJtb3pwb2ludGVybG9ja2NoYW5nZVwiLCBmdW5jdGlvbihlKXsgSW5wdXQucG9pbnRlcmxvY2tjaGFuZ2UoZSwgY2FudmFzKTsgfSk7XHJcblx0XHRVdGlscy5hZGRFdmVudChkb2N1bWVudCwgXCJ3ZWJraXRwb2ludGVybG9ja2NoYW5nZVwiLCBmdW5jdGlvbihlKXsgSW5wdXQucG9pbnRlcmxvY2tjaGFuZ2UoZSwgY2FudmFzKTsgfSk7XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGk9MDtpPD05O2krKyl7XHJcblx0XHRcdElucHV0LnZLZXlbJ04nICsgaV0gPSA0OCArIGk7XHJcblx0XHRcdElucHV0LnZLZXlbJ05LJyArIGldID0gOTYgKyBpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTY1O2k8PTkwO2krKyl7XHJcblx0XHRcdElucHV0LnZLZXlbU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTE7aTw9MTI7aSsrKXtcclxuXHRcdFx0SW5wdXQudktleVsnRicgKyBpXSA9IDExMSArIGk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dDsiLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIENhbWVyYU9ydGhvID0gcmVxdWlyZSgnLi9LVENhbWVyYU9ydGhvJyk7XHJcbnZhciBWZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxudmFyIFRleHR1cmVGcmFtZWJ1ZmZlciA9IHJlcXVpcmUoJy4vS1RUZXh0dXJlRnJhbWVidWZmZXInKTtcclxuXHJcbmZ1bmN0aW9uIERpcmVjdGlvbmFsTGlnaHQoZGlyZWN0aW9uLCBjb2xvciwgaW50ZW5zaXR5KXtcclxuXHR0aGlzLl9fa3RkaXJMaWdodCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb24ubm9ybWFsaXplKCk7XHJcblx0dGhpcy5kaXJlY3Rpb24ubXVsdGlwbHkoLTEpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBuZXcgQ29sb3IoKGNvbG9yKT8gY29sb3I6IENvbG9yLl9XSElURSk7XHJcblx0dGhpcy5pbnRlbnNpdHkgPSAoaW50ZW5zaXR5ICE9PSB1bmRlZmluZWQpPyBpbnRlbnNpdHkgOiAxLjA7XHJcblx0dGhpcy5jYXN0U2hhZG93ID0gZmFsc2U7XHJcblx0dGhpcy5zaGFkb3dDYW0gPSBudWxsO1xyXG5cdHRoaXMuc2hhZG93QnVmZmVyID0gbnVsbDtcclxuXHRcclxuXHR0aGlzLnNoYWRvd0NhbVdpZHRoID0gNTAwO1xyXG5cdHRoaXMuc2hhZG93Q2FtSGVpZ2h0ID0gNTAwO1xyXG5cdHRoaXMuc2hhZG93TmVhciA9IDAuMTtcclxuXHR0aGlzLnNoYWRvd0ZhciA9IDUwMC4wO1xyXG5cdHRoaXMuc2hhZG93UmVzb2x1dGlvbiA9IG5ldyBWZWN0b3IyKDUxMiwgNTEyKTtcclxuXHR0aGlzLnNoYWRvd1N0cmVuZ3RoID0gMC4yO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGlvbmFsTGlnaHQ7XHJcblxyXG5EaXJlY3Rpb25hbExpZ2h0LnByb3RvdHlwZS5zZXRDYXN0U2hhZG93ID0gZnVuY3Rpb24oY2FzdFNoYWRvdyl7XHJcblx0dGhpcy5jYXN0U2hhZG93ID0gY2FzdFNoYWRvdztcclxuXHRcclxuXHRpZiAoY2FzdFNoYWRvdyl7XHJcblx0XHR2YXIgcmVsID0gdGhpcy5zaGFkb3dSZXNvbHV0aW9uLnggLyB0aGlzLnNoYWRvd1Jlc29sdXRpb24ueTtcclxuXHRcdHRoaXMuc2hhZG93Q2FtID0gbmV3IENhbWVyYU9ydGhvKHRoaXMuc2hhZG93Q2FtV2lkdGgsIHRoaXMuc2hhZG93Q2FtSGVpZ2h0LCB0aGlzLnNoYWRvd05lYXIsIHRoaXMuc2hhZG93RmFyKTtcclxuXHRcdHRoaXMuc2hhZG93Q2FtLnBvc2l0aW9uID0gdGhpcy5kaXJlY3Rpb24uY2xvbmUoKS5tdWx0aXBseSgxMCk7XHJcblx0XHR0aGlzLnNoYWRvd0NhbS5sb29rQXQodGhpcy5kaXJlY3Rpb24uY2xvbmUoKS5tdWx0aXBseSgtMSkpO1xyXG5cdFx0XHJcblx0XHR0aGlzLnNoYWRvd0J1ZmZlciA9IG5ldyBUZXh0dXJlRnJhbWVidWZmZXIodGhpcy5zaGFkb3dSZXNvbHV0aW9uLngsIHRoaXMuc2hhZG93UmVzb2x1dGlvbi55KTtcclxuXHR9ZWxzZXtcclxuXHRcdHRoaXMuc2hhZG93Q2FtID0gbnVsbDtcclxuXHRcdHRoaXMuc2hhZG93QnVmZmVyID0gbnVsbDtcclxuXHR9XHJcbn07IiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcblxyXG5mdW5jdGlvbiBMaWdodFBvaW50KHBvc2l0aW9uLCBpbnRlbnNpdHksIGRpc3RhbmNlLCBjb2xvcil7XHJcblx0dGhpcy5fX2t0cG9pbnRsaWdodCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cdHRoaXMuaW50ZW5zaXR5ID0gKGludGVuc2l0eSk/IGludGVuc2l0eSA6IDEuMDtcclxuXHR0aGlzLmRpc3RhbmNlID0gKGRpc3RhbmNlKT8gZGlzdGFuY2UgOiAxLjA7XHJcblx0dGhpcy5jb2xvciA9IG5ldyBDb2xvcigoY29sb3IpPyBjb2xvciA6IENvbG9yLl9XSElURSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGlnaHRQb2ludDsiLCJ2YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcbnZhciBUZXh0dXJlRnJhbWVidWZmZXIgPSByZXF1aXJlKCcuL0tUVGV4dHVyZUZyYW1lYnVmZmVyJyk7XHJcblxyXG5mdW5jdGlvbiBMaWdodFNwb3QocG9zaXRpb24sIHRhcmdldCwgaW5uZXJBbmdsZSwgb3V0ZXJBbmdsZSwgaW50ZW5zaXR5LCBkaXN0YW5jZSwgY29sb3Ipe1xyXG5cdHRoaXMuX19rdHNwb3RsaWdodCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdHRoaXMuZGlyZWN0aW9uID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZShwb3NpdGlvbiwgdGFyZ2V0KS5ub3JtYWxpemUoKTtcclxuXHR0aGlzLm91dGVyQW5nbGUgPSBNYXRoLmNvcyhvdXRlckFuZ2xlKTtcclxuXHR0aGlzLmlubmVyQW5nbGUgPSBNYXRoLmNvcyhpbm5lckFuZ2xlKTtcclxuXHR0aGlzLmludGVuc2l0eSA9IChpbnRlbnNpdHkpPyBpbnRlbnNpdHkgOiAxLjA7XHJcblx0dGhpcy5kaXN0YW5jZSA9IChkaXN0YW5jZSk/IGRpc3RhbmNlIDogMS4wO1xyXG5cdHRoaXMuY29sb3IgPSBuZXcgQ29sb3IoKGNvbG9yKT8gY29sb3IgOiBDb2xvci5fV0hJVEUpO1xyXG5cdHRoaXMuY2FzdFNoYWRvdyA9IGZhbHNlO1xyXG5cdHRoaXMuc2hhZG93Q2FtID0gbnVsbDtcclxuXHR0aGlzLnNoYWRvd0J1ZmZlciA9IG51bGw7XHJcblx0XHJcblx0dGhpcy5zaGFkb3dGb3YgPSBLVC5NYXRoLmRlZ1RvUmFkKDkwLjApO1xyXG5cdHRoaXMuc2hhZG93TmVhciA9IDAuMTtcclxuXHR0aGlzLnNoYWRvd0ZhciA9IDUwMC4wO1xyXG5cdHRoaXMuc2hhZG93UmVzb2x1dGlvbiA9IG5ldyBWZWN0b3IyKDUxMiwgNTEyKTtcclxuXHR0aGlzLnNoYWRvd1N0cmVuZ3RoID0gMC4yO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExpZ2h0U3BvdDtcclxuXHJcbkxpZ2h0U3BvdC5wcm90b3R5cGUuc2V0Q2FzdFNoYWRvdyA9IGZ1bmN0aW9uKGNhc3RTaGFkb3cpe1xyXG5cdHRoaXMuY2FzdFNoYWRvdyA9IGNhc3RTaGFkb3c7XHJcblx0XHJcblx0aWYgKGNhc3RTaGFkb3cpe1xyXG5cdFx0dmFyIHJlbCA9IHRoaXMuc2hhZG93UmVzb2x1dGlvbi54IC8gdGhpcy5zaGFkb3dSZXNvbHV0aW9uLnk7XHJcblx0XHR0aGlzLnNoYWRvd0NhbSA9IG5ldyBLVC5DYW1lcmFQZXJzcGVjdGl2ZSh0aGlzLnNoYWRvd0ZvdiwgcmVsLCB0aGlzLnNoYWRvd05lYXIsIHRoaXMuc2hhZG93RmFyKTtcclxuXHRcdHRoaXMuc2hhZG93Q2FtLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbjtcclxuXHRcdHRoaXMuc2hhZG93Q2FtLmxvb2tBdCh0aGlzLnRhcmdldCk7XHJcblx0XHRcclxuXHRcdHRoaXMuc2hhZG93QnVmZmVyID0gbmV3IFRleHR1cmVGcmFtZWJ1ZmZlcih0aGlzLnNoYWRvd1Jlc29sdXRpb24ueCwgdGhpcy5zaGFkb3dSZXNvbHV0aW9uLnkpO1xyXG5cdH1lbHNle1xyXG5cdFx0dGhpcy5zaGFkb3dDYW0gPSBudWxsO1xyXG5cdFx0dGhpcy5zaGFkb3dCdWZmZXIgPSBudWxsO1xyXG5cdH1cclxufTtcclxuXHJcbkxpZ2h0U3BvdC5wcm90b3R5cGUuc2V0U2hhZG93UHJvcGVydGllcyA9IGZ1bmN0aW9uKGZvdiwgbmVhciwgZmFyLCByZXNvbHV0aW9uKXtcclxuXHR0aGlzLnNoYWRvd0ZvdiA9IGZvdjtcclxuXHR0aGlzLnNoYWRvd05lYXIgPSBuZWFyO1xyXG5cdHRoaXMuc2hhZG93RmFyID0gZmFyO1xyXG5cdHRoaXMuc2hhZG93UmVzb2x1dGlvbiA9IHJlc29sdXRpb247XHJcbn07XHJcbiIsInZhciBTaGFkZXJzID0gcmVxdWlyZSgnLi9LVFNoYWRlcnMnKTtcclxudmFyIElucHV0ID0gcmVxdWlyZSgnLi9LVElucHV0Jyk7XHJcbnZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFRFWFRVUkVfRlJPTlQ6IDAsXHJcblx0VEVYVFVSRV9CQUNLOiAxLFxyXG5cdFRFWFRVUkVfUklHSFQ6IDIsXHJcblx0VEVYVFVSRV9MRUZUOiAzLFxyXG5cdFRFWFRVUkVfVVA6IDQsXHJcblx0VEVYVFVSRV9ET1dOOiA1LFxyXG5cdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKGNhbnZhcywgcGFyYW1zKXtcclxuXHRcdHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG5cdFx0dGhpcy5nbCA9IG51bGw7XHJcblx0XHR0aGlzLnNoYWRlcnMgPSB7fTtcclxuXHRcdHRoaXMuaW1hZ2VzID0gW107XHJcblx0XHR0aGlzLm1heEF0dHJpYkxvY2F0aW9ucyA9IDA7XHJcblx0XHR0aGlzLmxhc3RQcm9ncmFtID0gbnVsbDtcclxuXHRcdFxyXG5cdFx0dGhpcy5fX2luaXRDb250ZXh0KGNhbnZhcyk7XHJcblx0XHR0aGlzLl9faW5pdFByb3BlcnRpZXMoKTtcclxuXHRcdHRoaXMuX19pbml0U2hhZGVycygpO1xyXG5cdFx0dGhpcy5fX2luaXRQYXJhbXMoKTtcclxuXHRcdFxyXG5cdFx0SW5wdXQuaW5pdChjYW52YXMpO1xyXG5cdH0sXHJcblx0XHJcblx0X19pbml0Q29udGV4dDogZnVuY3Rpb24oY2FudmFzKXtcclxuXHRcdHRoaXMuZ2wgPSBjYW52YXMuZ2V0Q29udGV4dCgnZXhwZXJpbWVudGFsLXdlYmdsJyk7XHJcblx0XHRcclxuXHRcdGlmICghdGhpcy5nbCl7XHJcblx0XHRcdGFsZXJ0KFwiWW91ciBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBXZWJHTFwiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLmdsLndpZHRoID0gY2FudmFzLndpZHRoO1xyXG5cdFx0dGhpcy5nbC5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0O1xyXG5cdH0sXHJcblx0XHJcblx0X19pbml0UHJvcGVydGllczogZnVuY3Rpb24oKXtcclxuXHRcdHZhciBnbCA9IHRoaXMuZ2w7XHJcblx0XHRcclxuXHRcdGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcclxuXHRcdGdsLmRlcHRoRnVuYyhnbC5MRVFVQUwpO1xyXG5cdFx0XHJcblx0XHRnbC5lbmFibGUoZ2wuQ1VMTF9GQUNFKTtcclxuXHRcdFxyXG5cdFx0Z2wuZGlzYWJsZSggZ2wuQkxFTkQgKTtcclxuXHRcdGdsLmJsZW5kRXF1YXRpb24oIGdsLkZVTkNfQUREICk7XHJcblx0XHRnbC5ibGVuZEZ1bmMoIGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSApO1xyXG5cdH0sXHJcblx0XHJcblx0X19pbml0U2hhZGVyczogZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuc2hhZGVycyA9IHt9O1xyXG5cdFx0dGhpcy5zaGFkZXJzLmJhc2ljID0gdGhpcy5wcm9jZXNzU2hhZGVyKFNoYWRlcnMuYmFzaWMpO1xyXG5cdFx0dGhpcy5zaGFkZXJzLmxhbWJlcnQgPSB0aGlzLnByb2Nlc3NTaGFkZXIoU2hhZGVycy5sYW1iZXJ0KTtcclxuXHRcdHRoaXMuc2hhZGVycy5waG9uZyA9IHRoaXMucHJvY2Vzc1NoYWRlcihTaGFkZXJzLnBob25nKTtcclxuXHRcdHRoaXMuc2hhZGVycy5kZXB0aCA9IHRoaXMucHJvY2Vzc1NoYWRlcihTaGFkZXJzLmRlcHRoTWFwKTtcclxuXHRcdHRoaXMuc2hhZGVycy5za3lib3ggPSB0aGlzLnByb2Nlc3NTaGFkZXIoU2hhZGVycy5za3lib3gpO1xyXG5cdH0sXHJcblx0XHJcblx0X19pbml0UGFyYW1zOiBmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5saWdodE5EQ01hdCA9IG5ldyBNYXRyaXg0KFxyXG5cdFx0XHQwLjUsIDAuMCwgMC4wLCAwLjUsXHJcblx0XHRcdDAuMCwgMC41LCAwLjAsIDAuNSxcclxuXHRcdFx0MC4wLCAwLjAsIDEuMCwgMC4wLFxyXG5cdFx0XHQwLjAsIDAuMCwgMC4wLCAxLjBcclxuXHRcdCk7XHJcblx0fSxcclxuXHRcclxuXHRjcmVhdGVBcnJheUJ1ZmZlcjogZnVuY3Rpb24odHlwZSwgZGF0YUFycmF5LCBpdGVtU2l6ZSl7XHJcblx0XHR2YXIgZ2wgPSB0aGlzLmdsO1xyXG5cdFx0dmFyIGJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG5cdFx0Z2wuYmluZEJ1ZmZlcihnbFt0eXBlXSwgYnVmZmVyKTtcclxuXHRcdGdsLmJ1ZmZlckRhdGEoZ2xbdHlwZV0sIGRhdGFBcnJheSwgZ2wuU1RBVElDX0RSQVcpO1xyXG5cdFx0YnVmZmVyLm51bUl0ZW1zID0gZGF0YUFycmF5Lmxlbmd0aDtcclxuXHRcdGJ1ZmZlci5pdGVtU2l6ZSA9IGl0ZW1TaXplO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gYnVmZmVyO1xyXG5cdH0sXHJcblx0XHJcblx0Z2V0U2hhZGVyQXR0cmlidXRlc0FuZFVuaWZvcm1zOiBmdW5jdGlvbih2ZXJ0ZXgsIGZyYWdtZW50KXtcclxuXHRcdHZhciBhdHRyaWJ1dGVzID0gW107XHJcblx0XHR2YXIgdW5pZm9ybXMgPSBbXTtcclxuXHRcdHZhciB1bmlmb3Jtc05hbWVzID0gW107XHJcblx0XHRcclxuXHRcdHZhciBzdHJ1Y3RzID0gW107XHJcblx0XHR2YXIgdW5pZm9ybXNBcnJheXMgPSBbXTtcclxuXHRcdHZhciBzdCA9IG51bGw7XHJcblx0XHRmb3IgKHZhciBpPTA7aTx2ZXJ0ZXgubGVuZ3RoO2krKyl7XHJcblx0XHRcdHZhciBsaW5lID0gdmVydGV4W2ldLnRyaW0oKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChsaW5lLmluZGV4T2YoXCJhdHRyaWJ1dGUgXCIpID09IDApe1xyXG5cdFx0XHRcdHN0ID0gbnVsbDtcclxuXHRcdFx0XHR2YXIgcCA9IGxpbmUuc3BsaXQoLyAvZyk7XHJcblx0XHRcdFx0dmFyIG5hbWUgPSBwW3AubGVuZ3RoIC0gMV0udHJpbSgpO1xyXG5cdFx0XHRcdGlmIChhdHRyaWJ1dGVzLmluZGV4T2YobmFtZSkgPT0gLTEpXHJcblx0XHRcdFx0XHRhdHRyaWJ1dGVzLnB1c2goe25hbWU6IG5hbWV9KTtcclxuXHRcdFx0fWVsc2UgaWYgKGxpbmUuaW5kZXhPZihcInVuaWZvcm0gXCIpID09IDApe1xyXG5cdFx0XHRcdHN0ID0gbnVsbDtcclxuXHRcdFx0XHRpZiAobGluZS5pbmRleE9mKFwiW1wiKSAhPSAtMSl7XHJcblx0XHRcdFx0XHR1bmlmb3Jtc0FycmF5cy5wdXNoKGxpbmUpO1xyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBwID0gbGluZS5zcGxpdCgvIC9nKTtcclxuXHRcdFx0XHR2YXIgbmFtZSA9IHBbcC5sZW5ndGggLSAxXS50cmltKCk7XHJcblx0XHRcdFx0aWYgKHVuaWZvcm1zTmFtZXMuaW5kZXhPZihuYW1lKSA9PSAtMSl7XHJcblx0XHRcdFx0XHR1bmlmb3Jtcy5wdXNoKHtuYW1lOiBuYW1lfSk7XHJcblx0XHRcdFx0XHR1bmlmb3Jtc05hbWVzLnB1c2gobmFtZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZSBpZiAobGluZS5pbmRleE9mKFwic3RydWN0XCIpID09IDApe1xyXG5cdFx0XHRcdHN0ID0geyBuYW1lOiBsaW5lLnJlcGxhY2UoXCJzdHJ1Y3QgXCIsIFwiXCIpLCBkYXRhOiBbXSB9O1xyXG5cdFx0XHRcdHN0cnVjdHMucHVzaChzdCk7XHJcblx0XHRcdH1lbHNlIGlmIChzdCAhPSBudWxsKXtcclxuXHRcdFx0XHRpZiAobGluZS50cmltKCkgPT0gXCJcIikgY29udGludWU7XHJcblx0XHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtMV0udHJpbSgpO1xyXG5cdFx0XHRcdHN0LmRhdGEucHVzaChuYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTxmcmFnbWVudC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0dmFyIGxpbmUgPSBmcmFnbWVudFtpXS50cmltKCk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAobGluZS5pbmRleE9mKFwiYXR0cmlidXRlIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtIDFdLnRyaW0oKTtcclxuXHRcdFx0XHRpZiAoYXR0cmlidXRlcy5pbmRleE9mKG5hbWUpID09IC0xKVxyXG5cdFx0XHRcdFx0YXR0cmlidXRlcy5wdXNoKHtuYW1lOiBuYW1lfSk7XHJcblx0XHRcdH1lbHNlIGlmIChsaW5lLmluZGV4T2YoXCJ1bmlmb3JtIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0aWYgKGxpbmUuaW5kZXhPZihcIltcIikgIT0gLTEpe1xyXG5cdFx0XHRcdFx0dW5pZm9ybXNBcnJheXMucHVzaChsaW5lKTtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgcCA9IGxpbmUuc3BsaXQoLyAvZyk7XHJcblx0XHRcdFx0dmFyIG5hbWUgPSBwW3AubGVuZ3RoIC0gMV0udHJpbSgpO1xyXG5cdFx0XHRcdGlmICh1bmlmb3Jtc05hbWVzLmluZGV4T2YobmFtZSkgPT0gLTEpe1xyXG5cdFx0XHRcdFx0dW5pZm9ybXMucHVzaCh7bmFtZTogbmFtZX0pO1xyXG5cdFx0XHRcdFx0dW5pZm9ybXNOYW1lcy5wdXNoKG5hbWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2UgaWYgKGxpbmUuaW5kZXhPZihcInN0cnVjdFwiKSAhPSAtMSl7XHJcblx0XHRcdFx0c3QgPSB7IG5hbWU6IGxpbmUucmVwbGFjZShcInN0cnVjdCBcIiwgXCJcIiksIGRhdGE6IFtdIH07XHJcblx0XHRcdFx0c3RydWN0cy5wdXNoKHN0KTtcclxuXHRcdFx0fWVsc2UgaWYgKHN0ICE9IG51bGwpe1xyXG5cdFx0XHRcdGlmIChsaW5lLnRyaW0oKSA9PSBcIlwiKSBjb250aW51ZTtcclxuXHRcdFx0XHR2YXIgcCA9IGxpbmUuc3BsaXQoLyAvZyk7XHJcblx0XHRcdFx0dmFyIG5hbWUgPSBwW3AubGVuZ3RoIC0xXS50cmltKCk7XHJcblx0XHRcdFx0c3QuZGF0YS5wdXNoKG5hbWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGk9MCxsZW49dW5pZm9ybXNBcnJheXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHRcdHZhciBsaW5lID0gdW5pZm9ybXNBcnJheXNbaV07XHJcblx0XHRcdHZhciBwID0gbGluZS5zcGxpdCgvIC9nKTtcclxuXHRcdFx0dmFyIHR5cGUgPSBwW3AubGVuZ3RoIC0gMl0udHJpbSgpO1xyXG5cdFx0XHR2YXIgbmFtZSA9IHBbcC5sZW5ndGggLSAxXS50cmltKCk7XHJcblx0XHRcdHZhciB1bmlMZW4gPSBwYXJzZUludChuYW1lLnN1YnN0cmluZyhuYW1lLmluZGV4T2YoXCJbXCIpICsgMSwgbmFtZS5pbmRleE9mKFwiXVwiKSksIDEwKTtcclxuXHRcdFx0dmFyIG5hbWUgPSBuYW1lLnN1YnN0cmluZygwLCBuYW1lLmluZGV4T2YoXCJbXCIpKTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBzdHIgPSBudWxsO1xyXG5cdFx0XHRmb3IgKHZhciBqPTAsamxlbj1zdHJ1Y3RzLmxlbmd0aDtqPGpsZW47aisrKXtcclxuXHRcdFx0XHRpZiAoc3RydWN0c1tqXS5uYW1lID09IHR5cGUpe1xyXG5cdFx0XHRcdFx0c3RyID0gc3RydWN0c1tqXTtcclxuXHRcdFx0XHRcdGogPSBqbGVuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHN0cil7XHJcblx0XHRcdFx0dmFyIHN0cnVjdFVuaSA9IFtdO1xyXG5cdFx0XHRcdGZvciAodmFyIGo9MDtqPHVuaUxlbjtqKyspe1xyXG5cdFx0XHRcdFx0c3RydWN0VW5pW2pdID0gKHtuYW1lOiBuYW1lLCBsZW46IHVuaUxlbiwgZGF0YTogW119KTtcclxuXHRcdFx0XHRcdGZvciAodmFyIGs9MCxrbGVuPXN0ci5kYXRhLmxlbmd0aDtrPGtsZW47aysrKXtcclxuXHRcdFx0XHRcdFx0dmFyIHByb3AgPSBzdHIuZGF0YVtrXTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdHN0cnVjdFVuaVtqXS5kYXRhLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdG5hbWU6IHByb3AsXHJcblx0XHRcdFx0XHRcdFx0bG9jTmFtZTogbmFtZSArIFwiW1wiICsgaiArIFwiXS5cIiArIHByb3BcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmICh1bmlmb3Jtc05hbWVzLmluZGV4T2YobmFtZSkgPT0gLTEpe1xyXG5cdFx0XHRcdFx0dW5pZm9ybXMucHVzaCh7XHJcblx0XHRcdFx0XHRcdG11bHRpOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRkYXRhOiBzdHJ1Y3RVbmksXHJcblx0XHRcdFx0XHRcdHR5cGU6IHR5cGVcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0dW5pZm9ybXNOYW1lcy5wdXNoKG5hbWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Zm9yICh2YXIgaj0wO2o8dW5pTGVuO2orKyl7XHJcblx0XHRcdFx0XHRpZiAodW5pZm9ybXNOYW1lcy5pbmRleE9mKG5hbWUgKyBcIltcIiArIGogKyBcIl1cIikgPT0gLTEpe1xyXG5cdFx0XHRcdFx0XHR1bmlmb3Jtcy5wdXNoKHtuYW1lOiBuYW1lICsgXCJbXCIgKyBqICsgXCJdXCIsIHR5cGU6IG5hbWUgfSk7XHJcblx0XHRcdFx0XHRcdHVuaWZvcm1zTmFtZXMucHVzaChuYW1lKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0YXR0cmlidXRlczogYXR0cmlidXRlcyxcclxuXHRcdFx0dW5pZm9ybXM6IHVuaWZvcm1zXHJcblx0XHR9O1xyXG5cdH0sXHJcblx0XHJcblx0cHJvY2Vzc1NoYWRlcjogZnVuY3Rpb24oc2hhZGVyKXtcclxuXHRcdHZhciBnbCA9IHRoaXMuZ2w7XHJcblx0XHRcclxuXHRcdHZhciB2Q29kZSA9IHNoYWRlci52ZXJ0ZXhTaGFkZXI7XHJcblx0XHR2YXIgdlNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5WRVJURVhfU0hBREVSKTtcclxuXHRcdGdsLnNoYWRlclNvdXJjZSh2U2hhZGVyLCB2Q29kZSk7XHJcblx0XHRnbC5jb21waWxlU2hhZGVyKHZTaGFkZXIpO1xyXG5cdFx0XHJcblx0XHR2YXIgZkNvZGUgPSBzaGFkZXIuZnJhZ21lbnRTaGFkZXI7XHJcblx0XHR2YXIgZlNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5GUkFHTUVOVF9TSEFERVIpO1xyXG5cdFx0Z2wuc2hhZGVyU291cmNlKGZTaGFkZXIsIGZDb2RlKTtcclxuXHRcdGdsLmNvbXBpbGVTaGFkZXIoZlNoYWRlcik7XHJcblx0XHRcclxuXHRcdHZhciBzaGFkZXJQcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG5cdFx0Z2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIHZTaGFkZXIpO1xyXG5cdFx0Z2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIGZTaGFkZXIpO1xyXG5cdFx0Z2wubGlua1Byb2dyYW0oc2hhZGVyUHJvZ3JhbSk7XHJcblx0XHRcclxuXHRcdHZhciBwYXJhbXMgPSB0aGlzLmdldFNoYWRlckF0dHJpYnV0ZXNBbmRVbmlmb3Jtcyh2Q29kZS5zcGxpdCgvWzt7fV0rLyksIGZDb2RlLnNwbGl0KC9bO3t9XSsvKSk7XHJcblx0XHRcclxuXHRcdGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHZTaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSl7XHJcblx0XHRcdGNvbnNvbGUubG9nKGdsLmdldFNoYWRlckluZm9Mb2codlNoYWRlcikpO1xyXG5cdFx0XHR0aHJvdyBcIkVycm9yIGNvbXBpbGluZyB2ZXJ0ZXggc2hhZGVyXCI7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKGZTaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSl7XHJcblx0XHRcdGNvbnNvbGUubG9nKGdsLmdldFNoYWRlckluZm9Mb2coZlNoYWRlcikpO1xyXG5cdFx0XHR0aHJvdyBcIkVycm9yIGNvbXBpbGluZyBmcmFnbWVudCBzaGFkZXJcIjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHNoYWRlclByb2dyYW0sIGdsLkxJTktfU1RBVFVTKSl7XHJcblx0XHRcdGNvbnNvbGUubG9nKGdsLmdldFByb2dyYW1JbmZvTG9nKHNoYWRlclByb2dyYW0pKTtcclxuXHRcdFx0dGhyb3cgXCJFcnJvciBpbml0aWFsaXppbmcgdGhlIHNoYWRlciBwcm9ncmFtXCI7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciBhdHRyaWJ1dGVzID0gW107XHJcblx0XHR0aGlzLm1heEF0dHJpYkxvY2F0aW9ucyA9IE1hdGgubWF4KHRoaXMubWF4QXR0cmliTG9jYXRpb25zLCBwYXJhbXMuYXR0cmlidXRlcy5sZW5ndGgpO1xyXG5cdFx0Zm9yICh2YXIgaT0wLGxlbj1wYXJhbXMuYXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdFx0dmFyIGF0dCA9IHBhcmFtcy5hdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHR2YXIgbG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBhdHQubmFtZSk7XHJcblx0XHRcdFxyXG5cdFx0XHRnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShsb2NhdGlvbik7XHJcblx0XHRcdFxyXG5cdFx0XHRhdHRyaWJ1dGVzLnB1c2goe1xyXG5cdFx0XHRcdG5hbWU6IGF0dC5uYW1lLFxyXG5cdFx0XHRcdGxvY2F0aW9uOiBsb2NhdGlvblxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIHVuaWZvcm1zID0gW107XHJcblx0XHRmb3IgKHZhciBpPTAsbGVuPXBhcmFtcy51bmlmb3Jtcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdFx0dmFyIHVuaSA9IHBhcmFtcy51bmlmb3Jtc1tpXTtcclxuXHRcdFx0aWYgKHVuaS5tdWx0aSl7XHJcblx0XHRcdFx0Zm9yICh2YXIgaj0wLGpsZW49dW5pLmRhdGEubGVuZ3RoO2o8amxlbjtqKyspe1xyXG5cdFx0XHRcdFx0dmFyIHVuaUQgPSB1bmkuZGF0YVtqXTtcclxuXHRcdFx0XHRcdGZvciAodmFyIGs9MCxrbGVuPXVuaUQuZGF0YS5sZW5ndGg7azxrbGVuO2srKyl7XHJcblx0XHRcdFx0XHRcdHZhciBkYXQgPSB1bmlELmRhdGFba107XHJcblx0XHRcdFx0XHRcdGRhdC5sb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBkYXQubG9jTmFtZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHVuaWZvcm1zLnB1c2godW5pKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dmFyIGxvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHNoYWRlclByb2dyYW0sIHVuaS5uYW1lKTtcclxuXHRcdFx0XHJcblx0XHRcdFx0dW5pZm9ybXMucHVzaCh7XHJcblx0XHRcdFx0XHRuYW1lOiB1bmkubmFtZSxcclxuXHRcdFx0XHRcdGxvY2F0aW9uOiBsb2NhdGlvbixcclxuXHRcdFx0XHRcdHR5cGU6ICh1bmkudHlwZSk/IHVuaS50eXBlIDogdW5pLm5hbWVcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRzaGFkZXJQcm9ncmFtOiBzaGFkZXJQcm9ncmFtLFxyXG5cdFx0XHRhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxyXG5cdFx0XHR1bmlmb3JtczogdW5pZm9ybXNcclxuXHRcdH07XHJcblx0fSxcclxuXHRcclxuXHRzd2l0Y2hQcm9ncmFtOiBmdW5jdGlvbihzaGFkZXIpe1xyXG5cdFx0aWYgKHRoaXMubGFzdFByb2dyYW0gPT09IHNoYWRlcikgcmV0dXJuO1xyXG5cdFx0dmFyIGdsID0gdGhpcy5nbDtcclxuXHRcdFxyXG5cdFx0dGhpcy5sYXN0UHJvZ3JhbSA9IHNoYWRlcjtcclxuXHRcdGdsLnVzZVByb2dyYW0oc2hhZGVyLnNoYWRlclByb2dyYW0pO1xyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLm1heEF0dHJpYkxvY2F0aW9ucztpKyspe1xyXG5cdFx0XHRpZiAoaSA8IHNoYWRlci5hdHRyaWJ1dGVzLmxlbmd0aCl7XHJcblx0XHRcdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoaSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheShpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Z2V0SW1hZ2U6IGZ1bmN0aW9uKHNyYyl7XHJcblx0XHRmb3IgKHZhciBpPTAsbGVuPXRoaXMuaW1hZ2VzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0XHRpZiAodGhpcy5pbWFnZXNbaV0uc3JjID09IHNyYylcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbWFnZXNbaV0uaW1nO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcbn07XHJcblxyXG5cclxuIiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcblxyXG5mdW5jdGlvbiBNYXRlcmlhbChwYXJhbWV0ZXJzKXtcclxuXHR0aGlzLl9fa3RtYXRlcmlhbCA9IHRydWU7XHJcblx0XHJcblx0aWYgKCFwYXJhbWV0ZXJzKSBwYXJhbWV0ZXJzID0ge307XHJcblx0XHJcblx0dGhpcy50ZXh0dXJlTWFwID0gKHBhcmFtZXRlcnMudGV4dHVyZU1hcCk/IHBhcmFtZXRlcnMudGV4dHVyZU1hcCA6IG51bGw7XHJcblx0dGhpcy5jb2xvciA9IG5ldyBDb2xvcigocGFyYW1ldGVycy5jb2xvcik/IHBhcmFtZXRlcnMuY29sb3IgOiBDb2xvci5fV0hJVEUpO1xyXG5cdHRoaXMub3BhY2l0eSA9IChwYXJhbWV0ZXJzLm9wYWNpdHkpPyBwYXJhbWV0ZXJzLm9wYWNpdHkgOiAxLjA7XHJcblx0dGhpcy50cmFuc3BhcmVudCA9IChwYXJhbWV0ZXJzLnRyYW5zcGFyZW50KT8gcGFyYW1ldGVycy50cmFuc3BhcmVudCA6IGZhbHNlO1xyXG5cdHRoaXMuZHJhd0ZhY2VzID0gKHBhcmFtZXRlcnMuZHJhd0ZhY2VzKT8gcGFyYW1ldGVycy5kcmF3RmFjZXMgOiAnRlJPTlQnO1xyXG5cdHRoaXMuZHJhd0FzID0gKHBhcmFtZXRlcnMuZHJhd0FzKT8gcGFyYW1ldGVycy5kcmF3QXMgOiAnVFJJQU5HTEVTJztcclxuXHR0aGlzLnNoYWRlciA9IChwYXJhbWV0ZXJzLnNoYWRlcik/IHBhcmFtZXRlcnMuc2hhZGVyIDogbnVsbDtcclxuXHR0aGlzLnNlbmRBdHRyaWJEYXRhID0gKHBhcmFtZXRlcnMuc2VuZEF0dHJpYkRhdGEpPyBwYXJhbWV0ZXJzLnNlbmRBdHRyaWJEYXRhIDogbnVsbDtcclxuXHR0aGlzLnNlbmRVbmlmb3JtRGF0YSA9IChwYXJhbWV0ZXJzLnNlbmRVbmlmb3JtRGF0YSk/IHBhcmFtZXRlcnMuc2VuZFVuaWZvcm1EYXRhIDogbnVsbDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRlcmlhbDsiLCJ2YXIgTWF0ZXJpYWwgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWwnKTtcclxudmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxuXHJcbmZ1bmN0aW9uIE1hdGVyaWFsQmFzaWModGV4dHVyZU1hcCwgY29sb3Ipe1xyXG5cdHRoaXMuX19rdG1hdGVyaWFsID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgbWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoe1xyXG5cdFx0dGV4dHVyZU1hcDogdGV4dHVyZU1hcCxcclxuXHRcdGNvbG9yOiBjb2xvcixcclxuXHRcdHNoYWRlcjogS1Quc2hhZGVycy5iYXNpY1xyXG5cdH0pO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZU1hcCA9IG1hdGVyaWFsLnRleHR1cmVNYXA7XHJcblx0dGhpcy5jb2xvciA9IG1hdGVyaWFsLmNvbG9yO1xyXG5cdHRoaXMuc2hhZGVyID0gbWF0ZXJpYWwuc2hhZGVyO1xyXG5cdHRoaXMub3BhY2l0eSA9IG1hdGVyaWFsLm9wYWNpdHk7XHJcblx0dGhpcy5kcmF3RmFjZXMgPSBtYXRlcmlhbC5kcmF3RmFjZXM7XHJcblx0dGhpcy5kcmF3QXMgPSBtYXRlcmlhbC5kcmF3QXM7XHJcblx0dGhpcy50cmFuc3BhcmVudCA9IG1hdGVyaWFsLnRyYW5zcGFyZW50O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGVyaWFsQmFzaWM7XHJcblxyXG5NYXRlcmlhbEJhc2ljLnByb3RvdHlwZS5zZW5kQXR0cmliRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG5cdGZvciAodmFyIGk9MCxsZW49YXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBhdHQgPSBhdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4UG9zaXRpb25cIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleENvbG9yXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LmNvbG9yc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFUZXh0dXJlQ29vcmRcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS50ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbk1hdGVyaWFsQmFzaWMucHJvdG90eXBlLnNlbmRVbmlmb3JtRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIHRyYW5zZm9ybWF0aW9uTWF0cml4O1xyXG5cdHZhciB1bmlmb3JtcyA9IHRoaXMuc2hhZGVyLnVuaWZvcm1zO1xyXG5cdGZvciAodmFyIGk9MCxsZW49dW5pZm9ybXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgdW5pID0gdW5pZm9ybXNbaV07XHJcblx0XHRcclxuXHRcdGlmICh1bmkubmFtZSA9PSAndU1WUE1hdHJpeCcpe1xyXG5cdFx0XHR0cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG1lc2guZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKS5tdWx0aXBseShjYW1lcmEudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG5cdFx0XHR2YXIgbXZwID0gdHJhbnNmb3JtYXRpb25NYXRyaXguY2xvbmUoKS5tdWx0aXBseShjYW1lcmEucGVyc3BlY3RpdmVNYXRyaXgpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG12cC50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1hdGVyaWFsQ29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gbWVzaC5tYXRlcmlhbC5jb2xvci5nZXRSR0JBKCk7XHJcblx0XHRcdGdsLnVuaWZvcm00ZnYodW5pLmxvY2F0aW9uLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9yKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlU2FtcGxlcicpe1xyXG5cdFx0XHRpZiAobWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwKTtcclxuXHRcdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAudGV4dHVyZSk7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUhhc1RleHR1cmUnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVSZXBlYXQnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm0yZih1bmkubG9jYXRpb24sIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5yZXBlYXQueCwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLnJlcGVhdC55KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUdlb21ldHJ5VVYnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm00Zih1bmkubG9jYXRpb24sIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueCwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi55LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLnosIG1lc2guZ2VvbWV0cnkudXZSZWdpb24udyk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlT2Zmc2V0JyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtMmYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAub2Zmc2V0LngsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5vZmZzZXQueSk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG4iLCJ2YXIgTWF0ZXJpYWwgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWwnKTtcclxudmFyIE1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG5cclxuZnVuY3Rpb24gTWF0ZXJpYWxMYW1iZXJ0KHRleHR1cmVNYXAsIGNvbG9yLCBvcGFjaXR5KXtcclxuXHR0aGlzLl9fa3RtYXRlcmlhbCA9IHRydWU7XHJcblx0XHJcblx0dmFyIG1hdGVyaWFsID0gbmV3IE1hdGVyaWFsKHtcclxuXHRcdHRleHR1cmVNYXA6IHRleHR1cmVNYXAsXHJcblx0XHRjb2xvcjogY29sb3IsXHJcblx0XHRvcGFjaXR5OiBvcGFjaXR5LFxyXG5cdFx0c2hhZGVyOiBLVC5zaGFkZXJzLmxhbWJlcnRcclxuXHR9KTtcclxuXHRcclxuXHR0aGlzLnRleHR1cmVNYXAgPSBtYXRlcmlhbC50ZXh0dXJlTWFwO1xyXG5cdHRoaXMuY29sb3IgPSBtYXRlcmlhbC5jb2xvcjtcclxuXHR0aGlzLnNoYWRlciA9IG1hdGVyaWFsLnNoYWRlcjtcclxuXHR0aGlzLm9wYWNpdHkgPSBtYXRlcmlhbC5vcGFjaXR5O1xyXG5cdHRoaXMuZHJhd0ZhY2VzID0gbWF0ZXJpYWwuZHJhd0ZhY2VzO1xyXG5cdHRoaXMuZHJhd0FzID0gbWF0ZXJpYWwuZHJhd0FzO1xyXG5cdHRoaXMudHJhbnNwYXJlbnQgPSBtYXRlcmlhbC50cmFuc3BhcmVudDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRlcmlhbExhbWJlcnQ7XHJcblxyXG5NYXRlcmlhbExhbWJlcnQucHJvdG90eXBlLnNlbmRBdHRyaWJEYXRhID0gZnVuY3Rpb24obWVzaCwgY2FtZXJhLCBzY2VuZSl7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0dmFyIGdlb21ldHJ5ID0gbWVzaC5nZW9tZXRyeTtcclxuXHR2YXIgYXR0cmlidXRlcyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcblx0Zm9yICh2YXIgaT0wLGxlbj1hdHRyaWJ1dGVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIGF0dCA9IGF0dHJpYnV0ZXNbaV07XHJcblx0XHRcclxuXHRcdGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhQb3NpdGlvblwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LnZlcnRleEJ1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9ZWxzZSBpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4Q29sb3JcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS5jb2xvcnNCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVRleHR1cmVDb29yZFwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LnRleEJ1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS50ZXhCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9ZWxzZSBpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4Tm9ybWFsXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkubm9ybWFsc0J1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS5ub3JtYWxzQnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdGVyaWFsTGFtYmVydC5wcm90b3R5cGUuc2VuZExpZ2h0VW5pZm9ybURhdGEgPSBmdW5jdGlvbihsaWdodCwgdW5pZm9ybSwgbW9kZWxUcmFuc2Zvcm1hdGlvbil7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3JtLmRhdGEubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgZGF0ID0gdW5pZm9ybS5kYXRhW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAoZGF0Lm5hbWUgPT0gJ3Bvc2l0aW9uJyl7XHJcblx0XHRcdGlmIChsaWdodC5fX2t0cG9pbnRsaWdodCB8fCBsaWdodC5fX2t0c3BvdGxpZ2h0KXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCBsaWdodC5wb3NpdGlvbi54LCBsaWdodC5wb3NpdGlvbi55LCBsaWdodC5wb3NpdGlvbi56KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgMC4wLCAwLjAsIDAuMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnZGlyZWN0aW9uJyl7XHJcblx0XHRcdGlmIChsaWdodC5fX2t0ZGlyTGlnaHQpe1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIGxpZ2h0LmRpcmVjdGlvbi54LCBsaWdodC5kaXJlY3Rpb24ueSwgbGlnaHQuZGlyZWN0aW9uLnopO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCAwLjAsIDAuMCwgMC4wKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdzcG90RGlyZWN0aW9uJyl7XHJcblx0XHRcdGlmIChsaWdodC5fX2t0c3BvdGxpZ2h0KXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCBsaWdodC5kaXJlY3Rpb24ueCwgbGlnaHQuZGlyZWN0aW9uLnksIGxpZ2h0LmRpcmVjdGlvbi56KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgMC4wLCAwLjAsIDAuMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnY29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gbGlnaHQuY29sb3IuZ2V0UkdCKCk7XHJcblx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0pO1xyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdpbnRlbnNpdHknKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFmKGRhdC5sb2NhdGlvbiwgbGlnaHQuaW50ZW5zaXR5KTtcclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnb3V0ZXJBbmdsZScpe1xyXG5cdFx0XHRpZiAobGlnaHQuX19rdHNwb3RsaWdodCl7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFmKGRhdC5sb2NhdGlvbiwgbGlnaHQub3V0ZXJBbmdsZSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIDAuMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnaW5uZXJBbmdsZScpe1xyXG5cdFx0XHRpZiAobGlnaHQuX19rdHNwb3RsaWdodCl7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFmKGRhdC5sb2NhdGlvbiwgbGlnaHQuaW5uZXJBbmdsZSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIDAuMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnbXZQcm9qZWN0aW9uJyl7XHJcblx0XHRcdGlmIChsaWdodC5jYXN0U2hhZG93KXtcclxuXHRcdFx0XHR2YXIgbXZwID0gbW9kZWxUcmFuc2Zvcm1hdGlvbi5jbG9uZSgpXHJcblx0XHRcdFx0XHRcdFx0Lm11bHRpcGx5KGxpZ2h0LnNoYWRvd0NhbS50cmFuc2Zvcm1hdGlvbk1hdHJpeClcclxuXHRcdFx0XHRcdFx0XHQubXVsdGlwbHkobGlnaHQuc2hhZG93Q2FtLnBlcnNwZWN0aXZlTWF0cml4KVxyXG5cdFx0XHRcdFx0XHRcdC5tdWx0aXBseShLVC5saWdodE5EQ01hdCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdihkYXQubG9jYXRpb24sIGZhbHNlLCBtdnAudG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYoZGF0LmxvY2F0aW9uLCBmYWxzZSwgTWF0cml4NC5nZXRJZGVudGl0eSgpLnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ2Nhc3RTaGFkb3cnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKGRhdC5sb2NhdGlvbiwgKGxpZ2h0LmNhc3RTaGFkb3cpPyAxIDogMCk7XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ3NoYWRvd1N0cmVuZ3RoJyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIGxpZ2h0LnNoYWRvd1N0cmVuZ3RoKTtcclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnbGlnaHRNdWx0Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIChsaWdodC5fX2t0ZGlyTGlnaHQpPyAtMSA6IDEpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbk1hdGVyaWFsTGFtYmVydC5wcm90b3R5cGUuc2VuZFVuaWZvcm1EYXRhID0gZnVuY3Rpb24obWVzaCwgY2FtZXJhLCBzY2VuZSl7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0dmFyIGdlb21ldHJ5ID0gbWVzaC5nZW9tZXRyeTtcclxuXHR2YXIgdHJhbnNmb3JtYXRpb25NYXRyaXg7XHJcblx0dmFyIHVuaWZvcm1zID0gdGhpcy5zaGFkZXIudW5pZm9ybXM7XHJcblx0dmFyIG1vZGVsVHJhbnNmb3JtYXRpb247XHJcblx0dmFyIHVzZWRMaWdodFVuaWZvcm0gPSBudWxsO1xyXG5cdHZhciBsaWdodHNDb3VudCA9IDA7XHJcblx0dmFyIHNoYWRvd01hcHNVbmlmb3JtID0gW107XHJcblx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3Jtcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciB1bmkgPSB1bmlmb3Jtc1tpXTtcclxuXHRcdFxyXG5cdFx0aWYgKHVuaS5tdWx0aSAmJiB1bmkudHlwZSA9PSAnTGlnaHQnKXtcclxuXHRcdFx0aWYgKGxpZ2h0c0NvdW50ID09IHVuaS5kYXRhLmxlbmd0aClcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0dmFyIGxpZ2h0cyA9IHNjZW5lLmxpZ2h0cztcclxuXHRcdFx0Zm9yICh2YXIgaj0wLGpsZW49bGlnaHRzLmxlbmd0aDtqPGpsZW47aisrKXtcclxuXHRcdFx0XHR0aGlzLnNlbmRMaWdodFVuaWZvcm1EYXRhKGxpZ2h0c1tqXSwgdW5pLmRhdGFbbGlnaHRzQ291bnQrK10sIG1vZGVsVHJhbnNmb3JtYXRpb24pO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAodW5pLnR5cGUgPT0gJ3VTaGFkb3dNYXBzJyl7XHJcblx0XHRcdHNoYWRvd01hcHNVbmlmb3JtLnB1c2godW5pKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1WTWF0cml4Jyl7XHJcblx0XHRcdG1vZGVsVHJhbnNmb3JtYXRpb24gPSBtZXNoLmdldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblx0XHRcdHRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbW9kZWxUcmFuc2Zvcm1hdGlvbi5jbG9uZSgpLm11bHRpcGx5KGNhbWVyYS50cmFuc2Zvcm1hdGlvbk1hdHJpeCk7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgdHJhbnNmb3JtYXRpb25NYXRyaXgudG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VQTWF0cml4Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgY2FtZXJhLnBlcnNwZWN0aXZlTWF0cml4LnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TWF0ZXJpYWxDb2xvcicpe1xyXG5cdFx0XHR2YXIgY29sb3IgPSBtZXNoLm1hdGVyaWFsLmNvbG9yLmdldFJHQkEoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTRmdih1bmkubG9jYXRpb24sIG5ldyBGbG9hdDMyQXJyYXkoY29sb3IpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVTYW1wbGVyJyl7XHJcblx0XHRcdGlmIChtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRcdGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTApO1xyXG5cdFx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC50ZXh0dXJlKTtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1SGFzVGV4dHVyZScpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAobWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKT8gMSA6IDApO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VXNlTGlnaHRpbmcnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKHNjZW5lLnVzZUxpZ2h0aW5nKT8gMSA6IDApO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1Tm9ybWFsTWF0cml4Jyl7XHJcblx0XHRcdHZhciBub3JtYWxNYXRyaXggPSBtb2RlbFRyYW5zZm9ybWF0aW9uLnRvTWF0cml4MygpLmludmVyc2UoKS50b0Zsb2F0MzJBcnJheSgpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4M2Z2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG5vcm1hbE1hdHJpeCk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VNb2RlbE1hdHJpeCcpe1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG1vZGVsVHJhbnNmb3JtYXRpb24udG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VBbWJpZW50TGlnaHRDb2xvcicgJiYgc2NlbmUudXNlTGlnaHRpbmcgJiYgc2NlbmUuYW1iaWVudExpZ2h0KXtcclxuXHRcdFx0dmFyIGNvbG9yID0gc2NlbmUuYW1iaWVudExpZ2h0LmdldFJHQigpO1xyXG5cdFx0XHRnbC51bmlmb3JtM2YodW5pLmxvY2F0aW9uLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU9wYWNpdHknKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFmKHVuaS5sb2NhdGlvbiwgbWVzaC5tYXRlcmlhbC5vcGFjaXR5KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVSZXBlYXQnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm0yZih1bmkubG9jYXRpb24sIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5yZXBlYXQueCwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLnJlcGVhdC55KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUdlb21ldHJ5VVYnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm00Zih1bmkubG9jYXRpb24sIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueCwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi55LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLnosIG1lc2guZ2VvbWV0cnkudXZSZWdpb24udyk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlT2Zmc2V0JyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtMmYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAub2Zmc2V0LngsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5vZmZzZXQueSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VVc2VkTGlnaHRzJyl7XHJcblx0XHRcdHVzZWRMaWdodFVuaWZvcm0gPSB1bmk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VSZWNlaXZlU2hhZG93Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIChtZXNoLnJlY2VpdmVTaGFkb3cpPyAxIDogMCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGlmICh1c2VkTGlnaHRVbmlmb3JtKXtcclxuXHRcdGdsLnVuaWZvcm0xaSh1c2VkTGlnaHRVbmlmb3JtLmxvY2F0aW9uLCBsaWdodHNDb3VudCk7XHJcblx0fVxyXG5cdFxyXG5cdGlmIChzaGFkb3dNYXBzVW5pZm9ybSAmJiBzaGFkb3dNYXBzVW5pZm9ybS5sZW5ndGggPiAwKXtcclxuXHRcdGZvciAodmFyIGk9MDtpPGxpZ2h0c0NvdW50O2krKyl7XHJcblx0XHRcdGlmICghbGlnaHRzW2ldLmNhc3RTaGFkb3cpIGNvbnRpbnVlO1xyXG5cdFx0XHRcclxuXHRcdFx0Z2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMTAgKyBpKTtcclxuXHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbGlnaHRzW2ldLnNoYWRvd0J1ZmZlci50ZXh0dXJlKTtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHNoYWRvd01hcHNVbmlmb3JtW2ldLmxvY2F0aW9uLCAxMCArIGkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTsiLCJ2YXIgTWF0ZXJpYWwgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWwnKTtcclxudmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxuXHJcbmZ1bmN0aW9uIE1hdGVyaWFsUGhvbmcodGV4dHVyZU1hcCwgY29sb3IsIG9wYWNpdHkpe1xyXG5cdHRoaXMuX19rdG1hdGVyaWFsID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgbWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoe1xyXG5cdFx0dGV4dHVyZU1hcDogdGV4dHVyZU1hcCxcclxuXHRcdGNvbG9yOiBjb2xvcixcclxuXHRcdG9wYWNpdHk6IG9wYWNpdHksXHJcblx0XHRzaGFkZXI6IEtULnNoYWRlcnMucGhvbmdcclxuXHR9KTtcclxuXHRcclxuXHR0aGlzLnRleHR1cmVNYXAgPSBtYXRlcmlhbC50ZXh0dXJlTWFwO1xyXG5cdHRoaXMuc3BlY3VsYXJNYXAgPSBudWxsO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBtYXRlcmlhbC5jb2xvcjtcclxuXHR0aGlzLnNoYWRlciA9IG1hdGVyaWFsLnNoYWRlcjtcclxuXHR0aGlzLm9wYWNpdHkgPSBtYXRlcmlhbC5vcGFjaXR5O1xyXG5cdHRoaXMuZHJhd0ZhY2VzID0gbWF0ZXJpYWwuZHJhd0ZhY2VzO1xyXG5cdHRoaXMuZHJhd0FzID0gbWF0ZXJpYWwuZHJhd0FzO1xyXG5cdHRoaXMuc3BlY3VsYXJDb2xvciA9IG5ldyBDb2xvcihDb2xvci5fV0hJVEUpO1xyXG5cdHRoaXMuc2hpbmluZXNzID0gMC4wO1xyXG5cdHRoaXMudHJhbnNwYXJlbnQgPSBtYXRlcmlhbC50cmFuc3BhcmVudDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRlcmlhbFBob25nO1xyXG5cclxuTWF0ZXJpYWxQaG9uZy5wcm90b3R5cGUuc2VuZEF0dHJpYkRhdGEgPSBmdW5jdGlvbihtZXNoLCBjYW1lcmEsIHNjZW5lKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHR2YXIgZ2VvbWV0cnkgPSBtZXNoLmdlb21ldHJ5O1xyXG5cdHZhciBhdHRyaWJ1dGVzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuXHRmb3IgKHZhciBpPTAsbGVuPWF0dHJpYnV0ZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgYXR0ID0gYXR0cmlidXRlc1tpXTtcclxuXHRcdFxyXG5cdFx0aWYgKGF0dC5uYW1lID09IFwiYVZlcnRleFBvc2l0aW9uXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LnZlcnRleEJ1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhDb2xvclwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LmNvbG9yc0J1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS5jb2xvcnNCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9ZWxzZSBpZiAoYXR0Lm5hbWUgPT0gXCJhVGV4dHVyZUNvb3JkXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkudGV4QnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LnRleEJ1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhOb3JtYWxcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS5ub3JtYWxzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5Lm5vcm1hbHNCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuTWF0ZXJpYWxQaG9uZy5wcm90b3R5cGUuc2VuZExpZ2h0VW5pZm9ybURhdGEgPSBmdW5jdGlvbihsaWdodCwgdW5pZm9ybSwgbW9kZWxUcmFuc2Zvcm1hdGlvbil7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3JtLmRhdGEubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgZGF0ID0gdW5pZm9ybS5kYXRhW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAoZGF0Lm5hbWUgPT0gJ3Bvc2l0aW9uJyl7XHJcblx0XHRcdGlmIChsaWdodC5fX2t0cG9pbnRsaWdodCB8fCBsaWdodC5fX2t0c3BvdGxpZ2h0KXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCBsaWdodC5wb3NpdGlvbi54LCBsaWdodC5wb3NpdGlvbi55LCBsaWdodC5wb3NpdGlvbi56KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgMC4wLCAwLjAsIDAuMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnZGlyZWN0aW9uJyl7XHJcblx0XHRcdGlmIChsaWdodC5fX2t0ZGlyTGlnaHQpe1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIGxpZ2h0LmRpcmVjdGlvbi54LCBsaWdodC5kaXJlY3Rpb24ueSwgbGlnaHQuZGlyZWN0aW9uLnopO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCAwLjAsIDAuMCwgMC4wKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdzcG90RGlyZWN0aW9uJyl7XHJcblx0XHRcdGlmIChsaWdodC5fX2t0c3BvdGxpZ2h0KXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCBsaWdodC5kaXJlY3Rpb24ueCwgbGlnaHQuZGlyZWN0aW9uLnksIGxpZ2h0LmRpcmVjdGlvbi56KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgMC4wLCAwLjAsIDAuMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnY29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gbGlnaHQuY29sb3IuZ2V0UkdCKCk7XHJcblx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0pO1xyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdpbnRlbnNpdHknKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFmKGRhdC5sb2NhdGlvbiwgbGlnaHQuaW50ZW5zaXR5KTtcclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnb3V0ZXJBbmdsZScpe1xyXG5cdFx0XHRpZiAobGlnaHQuX19rdHNwb3RsaWdodCl7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFmKGRhdC5sb2NhdGlvbiwgbGlnaHQub3V0ZXJBbmdsZSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIDAuMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnaW5uZXJBbmdsZScpe1xyXG5cdFx0XHRpZiAobGlnaHQuX19rdHNwb3RsaWdodCl7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFmKGRhdC5sb2NhdGlvbiwgbGlnaHQuaW5uZXJBbmdsZSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIDAuMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnbXZQcm9qZWN0aW9uJyl7XHJcblx0XHRcdGlmIChsaWdodC5jYXN0U2hhZG93KXtcclxuXHRcdFx0XHR2YXIgbXZwID0gbW9kZWxUcmFuc2Zvcm1hdGlvbi5jbG9uZSgpXHJcblx0XHRcdFx0XHRcdFx0Lm11bHRpcGx5KGxpZ2h0LnNoYWRvd0NhbS50cmFuc2Zvcm1hdGlvbk1hdHJpeClcclxuXHRcdFx0XHRcdFx0XHQubXVsdGlwbHkobGlnaHQuc2hhZG93Q2FtLnBlcnNwZWN0aXZlTWF0cml4KVxyXG5cdFx0XHRcdFx0XHRcdC5tdWx0aXBseShLVC5saWdodE5EQ01hdCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdihkYXQubG9jYXRpb24sIGZhbHNlLCBtdnAudG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYoZGF0LmxvY2F0aW9uLCBmYWxzZSwgTWF0cml4NC5nZXRJZGVudGl0eSgpLnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ2Nhc3RTaGFkb3cnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKGRhdC5sb2NhdGlvbiwgKGxpZ2h0LmNhc3RTaGFkb3cpPyAxIDogMCk7XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ3NoYWRvd1N0cmVuZ3RoJyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIGxpZ2h0LnNoYWRvd1N0cmVuZ3RoKTtcclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnbGlnaHRNdWx0Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIChsaWdodC5fX2t0ZGlyTGlnaHQpPyAtMSA6IDEpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbk1hdGVyaWFsUGhvbmcucHJvdG90eXBlLnNlbmRVbmlmb3JtRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIHRyYW5zZm9ybWF0aW9uTWF0cml4O1xyXG5cdHZhciB1bmlmb3JtcyA9IHRoaXMuc2hhZGVyLnVuaWZvcm1zO1xyXG5cdHZhciBtb2RlbFRyYW5zZm9ybWF0aW9uO1xyXG5cdHZhciBsaWdodHMgPSBzY2VuZS5saWdodHM7XHJcblx0dmFyIGxpZ2h0c0NvdW50ID0gMDtcclxuXHRcclxuXHR2YXIgdXNlZExpZ2h0VW5pZm9ybSA9IG51bGw7XHJcblx0dmFyIHNoYWRvd01hcHNVbmlmb3JtID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3Jtcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciB1bmkgPSB1bmlmb3Jtc1tpXTtcclxuXHRcdFxyXG5cdFx0aWYgKHVuaS5tdWx0aSAmJiB1bmkudHlwZSA9PSAnTGlnaHQnKXtcclxuXHRcdFx0aWYgKGxpZ2h0c0NvdW50ID09IHVuaS5kYXRhLmxlbmd0aClcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0Zm9yICh2YXIgaj0wLGpsZW49bGlnaHRzLmxlbmd0aDtqPGpsZW47aisrKXtcclxuXHRcdFx0XHR0aGlzLnNlbmRMaWdodFVuaWZvcm1EYXRhKGxpZ2h0c1tqXSwgdW5pLmRhdGFbbGlnaHRzQ291bnQrK10sIG1vZGVsVHJhbnNmb3JtYXRpb24pO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAodW5pLnR5cGUgPT0gJ3VTaGFkb3dNYXBzJyl7XHJcblx0XHRcdHNoYWRvd01hcHNVbmlmb3JtLnB1c2godW5pKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1WTWF0cml4Jyl7XHJcblx0XHRcdG1vZGVsVHJhbnNmb3JtYXRpb24gPSBtZXNoLmdldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblx0XHRcdHRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbW9kZWxUcmFuc2Zvcm1hdGlvbi5jbG9uZSgpLm11bHRpcGx5KGNhbWVyYS50cmFuc2Zvcm1hdGlvbk1hdHJpeCk7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgdHJhbnNmb3JtYXRpb25NYXRyaXgudG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VQTWF0cml4Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgY2FtZXJhLnBlcnNwZWN0aXZlTWF0cml4LnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TWF0ZXJpYWxDb2xvcicpe1xyXG5cdFx0XHR2YXIgY29sb3IgPSBtZXNoLm1hdGVyaWFsLmNvbG9yLmdldFJHQkEoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTRmdih1bmkubG9jYXRpb24sIG5ldyBGbG9hdDMyQXJyYXkoY29sb3IpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVTYW1wbGVyJyl7XHJcblx0XHRcdGlmIChtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRcdGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTApO1xyXG5cdFx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC50ZXh0dXJlKTtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1SGFzVGV4dHVyZScpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAobWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKT8gMSA6IDApO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VXNlTGlnaHRpbmcnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKHNjZW5lLnVzZUxpZ2h0aW5nKT8gMSA6IDApO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1UmVjZWl2ZVNoYWRvdycpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAobWVzaC5yZWNlaXZlU2hhZG93KT8gMSA6IDApO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1Tm9ybWFsTWF0cml4Jyl7XHJcblx0XHRcdHZhciBub3JtYWxNYXRyaXggPSBtb2RlbFRyYW5zZm9ybWF0aW9uLnRvTWF0cml4MygpLmludmVyc2UoKS50b0Zsb2F0MzJBcnJheSgpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4M2Z2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG5vcm1hbE1hdHJpeCk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VNb2RlbE1hdHJpeCcpe1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG1vZGVsVHJhbnNmb3JtYXRpb24udG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VDYW1lcmFQb3NpdGlvbicpe1xyXG5cdFx0XHRnbC51bmlmb3JtM2YodW5pLmxvY2F0aW9uLCBjYW1lcmEucG9zaXRpb24ueCwgY2FtZXJhLnBvc2l0aW9uLnksIGNhbWVyYS5wb3NpdGlvbi56KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVNwZWN1bGFyQ29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gdGhpcy5zcGVjdWxhckNvbG9yLmdldFJHQigpO1xyXG5cdFx0XHRnbC51bmlmb3JtM2YodW5pLmxvY2F0aW9uLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVNoaW5pbmVzcycpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWYodW5pLmxvY2F0aW9uLCB0aGlzLnNoaW5pbmVzcyk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VBbWJpZW50TGlnaHRDb2xvcicgJiYgc2NlbmUudXNlTGlnaHRpbmcgJiYgc2NlbmUuYW1iaWVudExpZ2h0KXtcclxuXHRcdFx0dmFyIGNvbG9yID0gc2NlbmUuYW1iaWVudExpZ2h0LmdldFJHQigpO1xyXG5cdFx0XHRnbC51bmlmb3JtM2YodW5pLmxvY2F0aW9uLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU9wYWNpdHknKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFmKHVuaS5sb2NhdGlvbiwgbWVzaC5tYXRlcmlhbC5vcGFjaXR5KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVSZXBlYXQnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm0yZih1bmkubG9jYXRpb24sIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5yZXBlYXQueCwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLnJlcGVhdC55KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUdlb21ldHJ5VVYnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm00Zih1bmkubG9jYXRpb24sIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueCwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi55LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLnosIG1lc2guZ2VvbWV0cnkudXZSZWdpb24udyk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlT2Zmc2V0JyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtMmYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAub2Zmc2V0LngsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5vZmZzZXQueSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VVc2VkTGlnaHRzJyl7XHJcblx0XHRcdHVzZWRMaWdodFVuaWZvcm0gPSB1bmk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VVc2VTcGVjdWxhck1hcCcpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAobWVzaC5tYXRlcmlhbC5zcGVjdWxhck1hcCk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVNwZWN1bGFyTWFwU2FtcGxlcicpe1xyXG5cdFx0XHRpZiAobWVzaC5tYXRlcmlhbC5zcGVjdWxhck1hcCl7XHJcblx0XHRcdFx0Z2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMSk7XHJcblx0XHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbWVzaC5tYXRlcmlhbC5zcGVjdWxhck1hcC50ZXh0dXJlKTtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAxKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRpZiAodXNlZExpZ2h0VW5pZm9ybSl7XHJcblx0XHRnbC51bmlmb3JtMWkodXNlZExpZ2h0VW5pZm9ybS5sb2NhdGlvbiwgbGlnaHRzQ291bnQpO1xyXG5cdH1cclxuXHRcclxuXHRpZiAoc2hhZG93TWFwc1VuaWZvcm0gJiYgc2hhZG93TWFwc1VuaWZvcm0ubGVuZ3RoID4gMCl7XHJcblx0XHRmb3IgKHZhciBpPTA7aTxsaWdodHNDb3VudDtpKyspe1xyXG5cdFx0XHRpZiAoIWxpZ2h0c1tpXS5jYXN0U2hhZG93KSBjb250aW51ZTtcclxuXHRcdFx0XHJcblx0XHRcdGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTEwICsgaSk7XHJcblx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIGxpZ2h0c1tpXS5zaGFkb3dCdWZmZXIudGV4dHVyZSk7XHJcblx0XHRcdGdsLnVuaWZvcm0xaShzaGFkb3dNYXBzVW5pZm9ybVtpXS5sb2NhdGlvbiwgMTAgKyBpKTtcclxuXHRcdH1cclxuXHR9XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0cmFkRGVnUmVsOiBNYXRoLlBJIC8gMTgwLFxyXG5cdFxyXG5cdFBJXzI6IE1hdGguUEkgLyAyLFxyXG5cdFBJOiBNYXRoLlBJLFxyXG5cdFBJM18yOiBNYXRoLlBJICogMyAvIDIsXHJcblx0UEkyOiBNYXRoLlBJICogMixcclxuXHRcclxuXHRkZWdUb1JhZDogZnVuY3Rpb24oZGVncmVlcyl7XHJcblx0XHRyZXR1cm4gZGVncmVlcyAqIHRoaXMucmFkRGVnUmVsO1xyXG5cdH0sXHJcblx0XHJcblx0cmFkVG9EZWc6IGZ1bmN0aW9uKHJhZGlhbnMpe1xyXG5cdFx0cmV0dXJuIHJhZGlhbnMgLyB0aGlzLnJhZERlZ1JlbDtcclxuXHR9LFxyXG5cdFxyXG5cdGdldDJEQW5nbGU6IGZ1bmN0aW9uKHgxLCB5MSwgeDIsIHkyKXtcclxuXHRcdHZhciB4eCA9IE1hdGguYWJzKHgyIC0geDEpO1xyXG5cdFx0dmFyIHl5ID0gTWF0aC5hYnMoeTIgLSB5MSk7XHJcblx0XHRcclxuXHRcdHZhciBhbmcgPSBNYXRoLmF0YW4yKHl5LCB4eCk7XHJcblx0XHRcclxuXHRcdGlmICh4MiA8PSB4MSAmJiB5MiA8PSB5MSl7XHJcblx0XHRcdGFuZyA9IHRoaXMuUEkgLSBhbmc7XHJcblx0XHR9ZWxzZSBpZiAoeDIgPD0geDEgJiYgeTIgPiB5MSl7XHJcblx0XHRcdGFuZyA9IHRoaXMuUEkgKyBhbmc7XHJcblx0XHR9ZWxzZSBpZiAoeDIgPiB4MSAmJiB5MiA+IHkxKXtcclxuXHRcdFx0YW5nID0gdGhpcy5QSTIgLSBhbmc7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGFuZyA9IChhbmcgKyB0aGlzLlBJMikgJSB0aGlzLlBJMjtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIGFuZztcclxuXHR9XHJcbn07XHJcbiIsImZ1bmN0aW9uIE1hdHJpeDMoKXtcclxuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSA5KSB0aHJvdyBcIk1hdHJpeCAzIG11c3QgcmVjZWl2ZSA5IHBhcmFtZXRlcnNcIjtcclxuXHRcclxuXHR2YXIgYyA9IDA7XHJcblx0Zm9yICh2YXIgaT0wO2k8OTtpKz0zKXtcclxuXHRcdHRoaXNbY10gPSBhcmd1bWVudHNbaV07XHJcblx0XHR0aGlzW2MrM10gPSBhcmd1bWVudHNbaSsxXTtcclxuXHRcdHRoaXNbYys2XSA9IGFyZ3VtZW50c1tpKzJdO1xyXG5cdFx0XHJcblx0XHRjICs9IDE7XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMuX19rdG10MyA9IHRydWU7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0cml4MztcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLmdldERldGVybWluYW50ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0dmFyIGRldCA9IChUWzBdICogVFs0XSAqIFRbOF0pICsgKFRbMV0gKiBUWzVdICogVFs2XSkgKyAoVFsyXSAqIFRbM10gKiBUWzddKVxyXG5cdFx0XHQtIChUWzZdICogVFs0XSAqIFRbMl0pIC0gKFRbN10gKiBUWzVdICogVFswXSkgLSAoVFs4XSAqIFRbM10gKiBUWzFdKTtcclxuXHRcclxuXHRyZXR1cm4gZGV0O1xyXG59O1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUuaW52ZXJzZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGRldCA9IHRoaXMuZ2V0RGV0ZXJtaW5hbnQoKTtcclxuXHRpZiAoZGV0ID09IDApIHJldHVybiBudWxsO1xyXG5cdFxyXG5cdHZhciBUID0gdGhpcztcclxuXHR2YXIgaW52ID0gbmV3IE1hdHJpeDMoXHJcblx0XHRUWzRdKlRbOF0tVFs1XSpUWzddLFx0VFs1XSpUWzZdLVRbM10qVFs4XSxcdFRbM10qVFs3XS1UWzRdKlRbNl0sXHJcblx0XHRUWzJdKlRbN10tVFsxXSpUWzhdLFx0VFswXSpUWzhdLVRbMl0qVFs2XSxcdFRbMV0qVFs2XS1UWzBdKlRbN10sXHJcblx0XHRUWzFdKlRbNV0tVFsyXSpUWzRdLFx0VFsyXSpUWzNdLVRbMF0qVFs1XSxcdFRbMF0qVFs0XS1UWzFdKlRbM11cclxuXHQpO1xyXG5cdFxyXG5cdGludi5tdWx0aXBseSgxIC8gZGV0KTtcclxuXHR0aGlzLmNvcHkoaW52KTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24obnVtYmVyKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0Zm9yICh2YXIgaT0wO2k8OTtpKyspe1xyXG5cdFx0VFtpXSAqPSBudW1iZXI7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKG1hdHJpeDMpe1xyXG5cdGlmICghbWF0cml4My5fX2t0bXQzKSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSBtYXRyaXgzIGludG8gYW5vdGhlclwiO1xyXG5cdFxyXG5cdHZhciBUID0gdGhpcztcclxuXHRmb3IgKHZhciBpPTA7aTw5O2krKyl7XHJcblx0XHRUW2ldID0gbWF0cml4M1tpXTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS50cmFuc3Bvc2UgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHR2YXIgdmFsdWVzID0gW1xyXG5cdFx0VFswXSwgVFszXSwgVFs2XSxcclxuXHRcdFRbMV0sIFRbNF0sIFRbN10sXHJcblx0XHRUWzJdLCBUWzVdLCBUWzhdXHJcblx0XTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTw5O2krKyl7XHJcblx0XHRUW2ldID0gdmFsdWVzW2ldO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLnRvRmxvYXQzMkFycmF5ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG5cdFx0VFswXSwgVFsxXSwgVFsyXSxcclxuXHRcdFRbM10sIFRbNF0sIFRbNV0sXHJcblx0XHRUWzZdLCBUWzddLCBUWzhdXHJcblx0XSk7XHJcbn07XHJcbiIsInZhciBNYXRyaXgzID0gcmVxdWlyZSgnLi9LVE1hdHJpeDMnKTtcclxuXHJcbmZ1bmN0aW9uIE1hdHJpeDQoKXtcclxuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAxNikgdGhyb3cgXCJNYXRyaXggNCBtdXN0IHJlY2VpdmUgMTYgcGFyYW1ldGVyc1wiO1xyXG5cdFxyXG5cdHZhciBjID0gMDtcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKz00KXtcclxuXHRcdHRoaXNbY10gPSBhcmd1bWVudHNbaV07XHJcblx0XHR0aGlzW2MrNF0gPSBhcmd1bWVudHNbaSsxXTtcclxuXHRcdHRoaXNbYys4XSA9IGFyZ3VtZW50c1tpKzJdO1xyXG5cdFx0dGhpc1tjKzEyXSA9IGFyZ3VtZW50c1tpKzNdO1xyXG5cdFx0XHJcblx0XHRjICs9IDE7XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMuX19rdG00ID0gdHJ1ZTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRyaXg0O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUuaWRlbnRpdHkgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBwYXJhbXMgPSBbXHJcblx0XHQxLCAwLCAwLCAwLFxyXG5cdFx0MCwgMSwgMCwgMCxcclxuXHRcdDAsIDAsIDEsIDAsXHJcblx0XHQwLCAwLCAwLCAxXHJcblx0XTtcclxuXHRcclxuXHR2YXIgYyA9IDA7XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSs9NCl7XHJcblx0XHR0aGlzW2NdID0gcGFyYW1zW2ldO1xyXG5cdFx0dGhpc1tjKzRdID0gcGFyYW1zW2krMV07XHJcblx0XHR0aGlzW2MrOF0gPSBwYXJhbXNbaSsyXTtcclxuXHRcdHRoaXNbYysxMl0gPSBwYXJhbXNbaSszXTtcclxuXHRcdFxyXG5cdFx0YyArPSAxO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLm11bHRpcGx5U2NhbGFyID0gZnVuY3Rpb24obnVtYmVyKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSsrKXtcclxuXHRcdFRbaV0gKj0gbnVtYmVyO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24obWF0cml4NCl7XHJcblx0aWYgKG1hdHJpeDQuX19rdG00KXtcclxuXHRcdHZhciBBMSA9IFt0aGlzWzBdLCAgdGhpc1sxXSwgIHRoaXNbMl0sICB0aGlzWzNdXTtcclxuXHRcdHZhciBBMiA9IFt0aGlzWzRdLCAgdGhpc1s1XSwgIHRoaXNbNl0sICB0aGlzWzddXTtcclxuXHRcdHZhciBBMyA9IFt0aGlzWzhdLCAgdGhpc1s5XSwgIHRoaXNbMTBdLCB0aGlzWzExXV07XHJcblx0XHR2YXIgQTQgPSBbdGhpc1sxMl0sIHRoaXNbMTNdLCB0aGlzWzE0XSwgdGhpc1sxNV1dO1xyXG5cdFx0XHJcblx0XHR2YXIgQjEgPSBbbWF0cml4NFswXSwgbWF0cml4NFs0XSwgbWF0cml4NFs4XSwgIG1hdHJpeDRbMTJdXTtcclxuXHRcdHZhciBCMiA9IFttYXRyaXg0WzFdLCBtYXRyaXg0WzVdLCBtYXRyaXg0WzldLCAgbWF0cml4NFsxM11dO1xyXG5cdFx0dmFyIEIzID0gW21hdHJpeDRbMl0sIG1hdHJpeDRbNl0sIG1hdHJpeDRbMTBdLCBtYXRyaXg0WzE0XV07XHJcblx0XHR2YXIgQjQgPSBbbWF0cml4NFszXSwgbWF0cml4NFs3XSwgbWF0cml4NFsxMV0sIG1hdHJpeDRbMTVdXTtcclxuXHRcdFxyXG5cdFx0dmFyIGRvdCA9IGZ1bmN0aW9uKGNvbCwgcm93KXtcclxuXHRcdFx0dmFyIHN1bSA9IDA7XHJcblx0XHRcdGZvciAodmFyIGo9MDtqPDQ7aisrKXsgc3VtICs9IHJvd1tqXSAqIGNvbFtqXTsgfVxyXG5cdFx0XHRyZXR1cm4gc3VtO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0dGhpc1swXSA9IGRvdChBMSwgQjEpOyAgIHRoaXNbMV0gPSBkb3QoQTEsIEIyKTsgICB0aGlzWzJdID0gZG90KEExLCBCMyk7ICAgdGhpc1szXSA9IGRvdChBMSwgQjQpO1xyXG5cdFx0dGhpc1s0XSA9IGRvdChBMiwgQjEpOyAgIHRoaXNbNV0gPSBkb3QoQTIsIEIyKTsgICB0aGlzWzZdID0gZG90KEEyLCBCMyk7ICAgdGhpc1s3XSA9IGRvdChBMiwgQjQpO1xyXG5cdFx0dGhpc1s4XSA9IGRvdChBMywgQjEpOyAgIHRoaXNbOV0gPSBkb3QoQTMsIEIyKTsgICB0aGlzWzEwXSA9IGRvdChBMywgQjMpOyAgdGhpc1sxMV0gPSBkb3QoQTMsIEI0KTtcclxuXHRcdHRoaXNbMTJdID0gZG90KEE0LCBCMSk7ICB0aGlzWzEzXSA9IGRvdChBNCwgQjIpOyAgdGhpc1sxNF0gPSBkb3QoQTQsIEIzKTsgIHRoaXNbMTVdID0gZG90KEE0LCBCNCk7XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1lbHNlIGlmIChtYXRyaXg0Lmxlbmd0aCA9PSA0KXtcclxuXHRcdHZhciByZXQgPSBbXTtcclxuXHRcdHZhciBjb2wgPSBtYXRyaXg0O1xyXG5cdFxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8NDtpKz0xKXtcclxuXHRcdFx0dmFyIHJvdyA9IFt0aGlzW2ldLCB0aGlzW2krNF0sIHRoaXNbaSs4XSwgdGhpc1tpKzEyXV07XHJcblx0XHRcdHZhciBzdW0gPSAwO1xyXG5cdFx0XHRcclxuXHRcdFx0Zm9yICh2YXIgaj0wO2o8NDtqKyspe1xyXG5cdFx0XHRcdHN1bSArPSByb3dbal0gKiBjb2xbal07XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHJldC5wdXNoKHN1bSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiByZXQ7XHJcblx0fWVsc2V7XHJcblx0XHR0aHJvdyBcIkludmFsaWQgY29uc3RydWN0b3JcIjtcclxuXHR9XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS50cmFuc3Bvc2UgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHR2YXIgdmFsdWVzID0gW1xyXG5cdFx0VFswXSwgVFs0XSwgVFs4XSwgIFRbMTJdLFxyXG5cdFx0VFsxXSwgVFs1XSwgVFs5XSwgIFRbMTNdLFxyXG5cdFx0VFsyXSwgVFs2XSwgVFsxMF0sIFRbMTRdLFxyXG5cdFx0VFszXSwgVFs3XSwgVFsxMV0sIFRbMTVdLFxyXG5cdF07XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSsrKXtcclxuXHRcdHRoaXNbaV0gPSB2YWx1ZXNbaV07XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKG1hdHJpeDQpe1xyXG5cdGlmICghbWF0cml4NC5fX2t0bTQpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIE1hdHJpeDQgaW50byB0aGlzIG1hdHJpeFwiO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPDE2O2krKyl7XHJcblx0XHR0aGlzW2ldID0gbWF0cml4NFtpXTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdFRbMF0sIFRbNF0sIFRbOF0sICBUWzEyXSxcclxuXHRcdFRbMV0sIFRbNV0sIFRbOV0sICBUWzEzXSxcclxuXHRcdFRbMl0sIFRbNl0sIFRbMTBdLCBUWzE0XSxcclxuXHRcdFRbM10sIFRbN10sIFRbMTFdLCBUWzE1XVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS50b0Zsb2F0MzJBcnJheSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFtcclxuXHRcdFRbMF0sIFRbMV0sIFRbMl0sICBUWzNdLFxyXG5cdFx0VFs0XSwgVFs1XSwgVFs2XSwgIFRbN10sXHJcblx0XHRUWzhdLCBUWzldLCBUWzEwXSwgVFsxMV0sXHJcblx0XHRUWzEyXSwgVFsxM10sIFRbMTRdLCBUWzE1XVxyXG5cdF0pO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUudG9NYXRyaXgzID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0cmV0dXJuIG5ldyBNYXRyaXgzKFxyXG5cdFx0VFswXSwgVFsxXSwgVFsyXSxcclxuXHRcdFRbNF0sIFRbNV0sIFRbNl0sXHJcblx0XHRUWzhdLCBUWzldLCBUWzEwXVxyXG5cdCk7IFxyXG59O1xyXG5cclxuTWF0cml4NC5nZXRJZGVudGl0eSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0MSwgMCwgMCwgMCxcclxuXHRcdDAsIDEsIDAsIDAsXHJcblx0XHQwLCAwLCAxLCAwLFxyXG5cdFx0MCwgMCwgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFhSb3RhdGlvbiA9IGZ1bmN0aW9uKHJhZGlhbnMpe1xyXG5cdHZhciBDID0gTWF0aC5jb3MocmFkaWFucyk7XHJcblx0dmFyIFMgPSBNYXRoLnNpbihyYWRpYW5zKTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQxLCAgMCwgIDAsIDAsXHJcblx0XHQwLCAgQywgIFMsIDAsXHJcblx0XHQwLCAtUywgIEMsIDAsXHJcblx0XHQwLCAgMCwgIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRZUm90YXRpb24gPSBmdW5jdGlvbihyYWRpYW5zKXtcclxuXHR2YXIgQyA9IE1hdGguY29zKHJhZGlhbnMpO1xyXG5cdHZhciBTID0gTWF0aC5zaW4ocmFkaWFucyk7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0IEMsICAwLCAgUywgMCxcclxuXHRcdCAwLCAgMSwgIDAsIDAsXHJcblx0XHQtUywgIDAsICBDLCAwLFxyXG5cdFx0IDAsICAwLCAgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFpSb3RhdGlvbiA9IGZ1bmN0aW9uKHJhZGlhbnMpe1xyXG5cdHZhciBDID0gTWF0aC5jb3MocmFkaWFucyk7XHJcblx0dmFyIFMgPSBNYXRoLnNpbihyYWRpYW5zKTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQgQywgIFMsIDAsIDAsXHJcblx0XHQtUywgIEMsIDAsIDAsXHJcblx0XHQgMCwgIDAsIDEsIDAsXHJcblx0XHQgMCwgIDAsIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRUcmFuc2xhdGlvbiA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgdHJhbnNsYXRlIHRvIGEgdmVjdG9yIDNcIjtcclxuXHRcclxuXHR2YXIgeCA9IHZlY3RvcjMueDtcclxuXHR2YXIgeSA9IHZlY3RvcjMueTtcclxuXHR2YXIgeiA9IHZlY3RvcjMuejtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQxLCAwLCAwLCB4LFxyXG5cdFx0MCwgMSwgMCwgeSxcclxuXHRcdDAsIDAsIDEsIHosXHJcblx0XHQwLCAwLCAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0U2NhbGUgPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IHNjYWxlIHRvIGEgdmVjdG9yIDNcIjtcclxuXHRcclxuXHR2YXIgc3ggPSB2ZWN0b3IzLng7XHJcblx0dmFyIHN5ID0gdmVjdG9yMy55O1xyXG5cdHZhciBzeiA9IHZlY3RvcjMuejtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHRzeCwgIDAsICAwLCAwLFxyXG5cdFx0IDAsIHN5LCAgMCwgMCxcclxuXHRcdCAwLCAgMCwgc3osIDAsXHJcblx0XHQgMCwgIDAsICAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0VHJhbnNmb3JtYXRpb24gPSBmdW5jdGlvbihwb3NpdGlvbiwgcm90YXRpb24sIHNjYWxlLCBzdGFjayl7XHJcblx0aWYgKCFwb3NpdGlvbi5fX2t0djMpIHRocm93IFwiUG9zaXRpb24gbXVzdCBiZSBhIFZlY3RvcjNcIjtcclxuXHRpZiAoIXJvdGF0aW9uLl9fa3R2MykgdGhyb3cgXCJSb3RhdGlvbiBtdXN0IGJlIGEgVmVjdG9yM1wiO1xyXG5cdGlmIChzY2FsZSAmJiAhc2NhbGUuX19rdHYzKSB0aHJvdyBcIlNjYWxlIG11c3QgYmUgYSBWZWN0b3IzXCI7XHJcblx0aWYgKCFzdGFjaykgc3RhY2sgPSAnU1J4UnlSelQnO1xyXG5cdFxyXG5cdHZhciBzcyA9IChzdGFjay5pbmRleE9mKFwiU1wiKSAhPSAtMSk7XHJcblx0dmFyIHJ4ID0gKHN0YWNrLmluZGV4T2YoXCJSeFwiKSAhPSAtMSk7XHJcblx0dmFyIHJ5ID0gKHN0YWNrLmluZGV4T2YoXCJSeVwiKSAhPSAtMSk7XHJcblx0dmFyIHJ6ID0gKHN0YWNrLmluZGV4T2YoXCJSelwiKSAhPSAtMSk7XHJcblx0dmFyIHR0ID0gKHN0YWNrLmluZGV4T2YoXCJUXCIpICE9IC0xKTtcclxuXHRcclxuXHR2YXIgc2NhbGUgPSAoc2NhbGUgJiYgc3MpPyBNYXRyaXg0LmdldFNjYWxlKHNjYWxlKSA6IE1hdHJpeDQuZ2V0SWRlbnRpdHkoKTtcclxuXHRcclxuXHR2YXIgcm90YXRpb25YID0gTWF0cml4NC5nZXRYUm90YXRpb24ocm90YXRpb24ueCk7XHJcblx0dmFyIHJvdGF0aW9uWSA9IE1hdHJpeDQuZ2V0WVJvdGF0aW9uKHJvdGF0aW9uLnkpO1xyXG5cdHZhciByb3RhdGlvblogPSBNYXRyaXg0LmdldFpSb3RhdGlvbihyb3RhdGlvbi56KTtcclxuXHRcclxuXHR2YXIgdHJhbnNsYXRpb24gPSBNYXRyaXg0LmdldFRyYW5zbGF0aW9uKHBvc2l0aW9uKTtcclxuXHRcclxuXHR2YXIgbWF0cml4O1xyXG5cdG1hdHJpeCA9IHNjYWxlO1xyXG5cdGlmIChyeCkgbWF0cml4Lm11bHRpcGx5KHJvdGF0aW9uWCk7XHJcblx0aWYgKHJ5KSBtYXRyaXgubXVsdGlwbHkocm90YXRpb25ZKTtcclxuXHRpZiAocnopIG1hdHJpeC5tdWx0aXBseShyb3RhdGlvblopO1xyXG5cdGlmICh0dCkgbWF0cml4Lm11bHRpcGx5KHRyYW5zbGF0aW9uKTtcclxuXHRcclxuXHRyZXR1cm4gbWF0cml4O1xyXG59O1xyXG4iLCJ2YXIgTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcbnZhciBWZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxuXHJcbmZ1bmN0aW9uIE1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKXtcclxuXHRpZiAoIWdlb21ldHJ5IHx8ICFnZW9tZXRyeS5fX2t0Z2VvbWV0cnkpIHRocm93IFwiR2VvbWV0cnkgbXVzdCBiZSBhIEtUR2VvbWV0cnkgaW5zdGFuY2VcIjtcclxuXHRpZiAoIW1hdGVyaWFsIHx8ICFtYXRlcmlhbC5fX2t0bWF0ZXJpYWwpIHRocm93IFwiTWF0ZXJpYWwgbXVzdCBiZSBhIEtUTWF0ZXJpYWwgaW5zdGFuY2VcIjtcclxuXHRcclxuXHR0aGlzLl9fa3RtZXNoID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLmdlb21ldHJ5ID0gZ2VvbWV0cnk7XHJcblx0dGhpcy5tYXRlcmlhbCA9IG1hdGVyaWFsO1xyXG5cdFxyXG5cdHRoaXMucGFyZW50ID0gbnVsbDtcclxuXHR0aGlzLnZpc2libGUgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMuY2FzdFNoYWRvdyA9IGZhbHNlO1xyXG5cdHRoaXMucmVjZWl2ZVNoYWRvdyA9IGZhbHNlO1xyXG5cdFxyXG5cdHRoaXMucG9zaXRpb24gPSBuZXcgVmVjdG9yMygwLCAwLCAwKTtcclxuXHR0aGlzLnJvdGF0aW9uID0gbmV3IFZlY3RvcjMoMCwgMCwgMCk7XHJcblx0dGhpcy5zY2FsZSA9IG5ldyBWZWN0b3IzKDEsIDEsIDEpO1xyXG5cdFxyXG5cdHRoaXMucHJldmlvdXNQb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uY2xvbmUoKTtcclxuXHR0aGlzLnByZXZpb3VzUm90YXRpb24gPSB0aGlzLnJvdGF0aW9uLmNsb25lKCk7XHJcblx0dGhpcy5wcmV2aW91c1NjYWxlID0gdGhpcy5zY2FsZS5jbG9uZSgpO1xyXG5cdFxyXG5cdHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBudWxsO1xyXG5cdHRoaXMudHJhbnNmb3JtYXRpb25TdGFjayA9ICdTUnhSeVJ6VCc7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVzaDtcclxuXHJcbk1lc2gucHJvdG90eXBlLmdldFRyYW5zZm9ybWF0aW9uTWF0cml4ID0gZnVuY3Rpb24oKXtcclxuXHRpZiAoIXRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggfHwgIXRoaXMucG9zaXRpb24uZXF1YWxzKHRoaXMucHJldmlvdXNQb3NpdGlvbikgfHwgIXRoaXMucm90YXRpb24uZXF1YWxzKHRoaXMucHJldmlvdXNSb3RhdGlvbikgfHwgIXRoaXMuc2NhbGUuZXF1YWxzKHRoaXMucHJldmlvdXNTY2FsZSkpe1xyXG5cdFx0dGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IE1hdHJpeDQuZ2V0VHJhbnNmb3JtYXRpb24odGhpcy5wb3NpdGlvbiwgdGhpcy5yb3RhdGlvbiwgdGhpcy5zY2FsZSwgdGhpcy50cmFuc2Zvcm1hdGlvblN0YWNrKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5wcmV2aW91c1Bvc2l0aW9uLmNvcHkodGhpcy5wb3NpdGlvbik7XHJcblx0XHR0aGlzLnByZXZpb3VzUm90YXRpb24uY29weSh0aGlzLnJvdGF0aW9uKTtcclxuXHRcdHRoaXMucHJldmlvdXNTY2FsZS5jb3B5KHRoaXMuc2NhbGUpO1xyXG5cdFx0XHJcblx0XHRpZiAodGhpcy5wYXJlbnQpe1xyXG5cdFx0XHR2YXIgbSA9IHRoaXMucGFyZW50LmdldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblx0XHRcdHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgubXVsdGlwbHkobSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmNsb25lKCk7XHJcbn07XHJcbiIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgR2VvbWV0cnlHVUlUZXh0dXJlID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5R1VJVGV4dHVyZScpO1xyXG52YXIgVGV4dHVyZSA9IHJlcXVpcmUoJy4vS1RUZXh0dXJlJyk7XHJcbnZhciBNYXRlcmlhbEJhc2ljID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsQmFzaWMnKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG52YXIgTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcblxyXG5mdW5jdGlvbiBNZXNoU3ByaXRlKHdpZHRoLCBoZWlnaHQsIHRleHR1cmVTcmMpe1xyXG5cdHRoaXMuX19rdG1lc2ggPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IG51bGw7XHJcblx0aWYgKHRleHR1cmVTcmMpe1xyXG5cdFx0aWYgKHRleHR1cmVTcmMuX19rdHRleHR1cmUgfHwgdGV4dHVyZVNyYy5fX2t0dGV4dHVyZWZyYW1lYnVmZmVyKVxyXG5cdFx0XHR0aGlzLnRleHR1cmUgPSB0ZXh0dXJlU3JjO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHR0aGlzLnRleHR1cmUgPSBuZXcgVGV4dHVyZSh0ZXh0dXJlU3JjKTtcclxuXHR9XHJcblx0XHJcblx0dGhpcy5nZW9tZXRyeSA9IG5ldyBHZW9tZXRyeUdVSVRleHR1cmUod2lkdGgsIGhlaWdodCk7XHJcblx0dGhpcy5tYXRlcmlhbCA9IG5ldyBNYXRlcmlhbEJhc2ljKHRoaXMudGV4dHVyZSwgXCIjRkZGRkZGXCIpO1xyXG5cdHRoaXMubWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xyXG5cdFx0XHJcblx0dGhpcy5wYXJlbnQgPSBudWxsO1xyXG5cdHRoaXMudmlzaWJsZSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5jYXN0U2hhZG93ID0gZmFsc2U7XHJcblx0dGhpcy5yZWNlaXZlU2hhZG93ID0gZmFsc2U7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IG5ldyBWZWN0b3IzKDAuMCwgMC4wLCAwLjApO1xyXG5cdHRoaXMucm90YXRpb24gPSBuZXcgVmVjdG9yMygwLjAsIDAuMCwgMC4wKTtcclxuXHR0aGlzLnNjYWxlID0gbmV3IFZlY3RvcjMoMS4wLCAxLjAsIDEuMCk7XHJcblx0XHJcblx0dGhpcy5wcmV2aW91c1Bvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5jbG9uZSgpO1xyXG5cdHRoaXMucHJldmlvdXNSb3RhdGlvbiA9IHRoaXMucm90YXRpb24uY2xvbmUoKTtcclxuXHR0aGlzLnByZXZpb3VzU2NhbGUgPSB0aGlzLnNjYWxlLmNsb25lKCk7XHJcblx0XHJcblx0dGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG51bGw7XHJcblx0dGhpcy50cmFuc2Zvcm1hdGlvblN0YWNrID0gJ1NSelQnO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lc2hTcHJpdGU7XHJcblxyXG5NZXNoU3ByaXRlLnByb3RvdHlwZS5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCA9IGZ1bmN0aW9uKCl7XHJcblx0aWYgKCF0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4IHx8ICF0aGlzLnBvc2l0aW9uLmVxdWFscyh0aGlzLnByZXZpb3VzUG9zaXRpb24pIHx8ICF0aGlzLnJvdGF0aW9uLmVxdWFscyh0aGlzLnByZXZpb3VzUm90YXRpb24pIHx8ICF0aGlzLnNjYWxlLmVxdWFscyh0aGlzLnByZXZpb3VzU2NhbGUpKXtcclxuXHRcdHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBNYXRyaXg0LmdldFRyYW5zZm9ybWF0aW9uKHRoaXMucG9zaXRpb24sIHRoaXMucm90YXRpb24sIHRoaXMuc2NhbGUsIHRoaXMudHJhbnNmb3JtYXRpb25TdGFjayk7XHJcblx0XHRcclxuXHRcdHRoaXMucHJldmlvdXNQb3NpdGlvbi5jb3B5KHRoaXMucG9zaXRpb24pO1xyXG5cdFx0dGhpcy5wcmV2aW91c1JvdGF0aW9uLmNvcHkodGhpcy5yb3RhdGlvbik7XHJcblx0XHR0aGlzLnByZXZpb3VzU2NhbGUuY29weSh0aGlzLnNjYWxlKTtcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMucGFyZW50KXtcclxuXHRcdFx0dmFyIG0gPSB0aGlzLnBhcmVudC5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xyXG5cdFx0XHR0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4Lm11bHRpcGx5KG0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5jbG9uZSgpO1xyXG59OyIsInZhciBWZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL0tUSW5wdXQnKTtcclxudmFyIEtUTWF0aCA9IHJlcXVpcmUoJy4vS1RNYXRoJyk7XHJcblxyXG5mdW5jdGlvbiBPcmJpdEFuZFBhbih0YXJnZXQpe1xyXG5cdHRoaXMuX19rdENhbUN0cmxzID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLmNhbWVyYSA9IG51bGw7XHJcblx0dGhpcy5sYXN0RHJhZyA9IG51bGw7XHJcblx0dGhpcy5sYXN0UGFuID0gbnVsbDtcclxuXHR0aGlzLnRhcmdldCA9ICh0YXJnZXQpPyB0YXJnZXQgOiBuZXcgVmVjdG9yMygwLjAsIDAuMCwgMC4wKTtcclxuXHR0aGlzLmFuZ2xlID0gbmV3IFZlY3RvcjIoMC4wLCAwLjApO1xyXG5cdHRoaXMuem9vbSA9IDE7XHJcblx0dGhpcy5zZW5zaXRpdml0eSA9IG5ldyBWZWN0b3IyKDAuNSwgMC41KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPcmJpdEFuZFBhbjtcclxuXHJcbk9yYml0QW5kUGFuLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpe1xyXG5cdGlmICh0aGlzLmNhbWVyYS5sb2NrZWQpIHJldHVybjtcclxuXHRcclxuXHRpZiAoSW5wdXQuaXNXaGVlbE1vdmVkKElucHV0LnZNb3VzZS5XSEVFTFVQKSl7IHRoaXMuem9vbSAtPSAwLjM7IHRoaXMuc2V0Q2FtZXJhUG9zaXRpb24oKTsgfVxyXG5cdGVsc2UgaWYgKElucHV0LmlzV2hlZWxNb3ZlZChJbnB1dC52TW91c2UuV0hFRUxET1dOKSl7IHRoaXMuem9vbSArPSAwLjM7IHRoaXMuc2V0Q2FtZXJhUG9zaXRpb24oKTsgfVxyXG5cdFxyXG5cdGlmIChJbnB1dC5pc01vdXNlRG93bihJbnB1dC52TW91c2UuTEVGVCkpe1xyXG5cdFx0aWYgKHRoaXMubGFzdERyYWcgPT0gbnVsbCkgdGhpcy5sYXN0RHJhZyA9IElucHV0Ll9tb3VzZS5wb3NpdGlvbi5jbG9uZSgpO1xyXG5cdFx0XHJcblx0XHR2YXIgZHggPSBJbnB1dC5fbW91c2UucG9zaXRpb24ueCAtIHRoaXMubGFzdERyYWcueDtcclxuXHRcdHZhciBkeSA9IElucHV0Ll9tb3VzZS5wb3NpdGlvbi55IC0gdGhpcy5sYXN0RHJhZy55O1xyXG5cdFx0XHJcblx0XHRpZiAoZHggIT0gMC4wIHx8IGR5ICE9IDAuMCl7XHJcblx0XHRcdHRoaXMuYW5nbGUueCAtPSBLVE1hdGguZGVnVG9SYWQoZHggKiB0aGlzLnNlbnNpdGl2aXR5LngpO1xyXG5cdFx0XHR0aGlzLmFuZ2xlLnkgLT0gS1RNYXRoLmRlZ1RvUmFkKGR5ICogdGhpcy5zZW5zaXRpdml0eS55KTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuc2V0Q2FtZXJhUG9zaXRpb24oKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5sYXN0RHJhZy5jb3B5KElucHV0Ll9tb3VzZS5wb3NpdGlvbik7XHJcblx0fWVsc2V7XHJcblx0XHR0aGlzLmxhc3REcmFnID0gbnVsbDtcclxuXHR9XHJcblx0XHJcblx0aWYgKElucHV0LmlzTW91c2VEb3duKElucHV0LnZNb3VzZS5SSUdIVCkpe1xyXG5cdFx0aWYgKHRoaXMubGFzdFBhbiA9PSBudWxsKSB0aGlzLmxhc3RQYW4gPSBJbnB1dC5fbW91c2UucG9zaXRpb24uY2xvbmUoKTtcclxuXHRcdFxyXG5cdFx0dmFyIGR4ID0gSW5wdXQuX21vdXNlLnBvc2l0aW9uLnggLSB0aGlzLmxhc3RQYW4ueDtcclxuXHRcdHZhciBkeSA9IElucHV0Ll9tb3VzZS5wb3NpdGlvbi55IC0gdGhpcy5sYXN0UGFuLnk7XHJcblx0XHRcclxuXHRcdGlmIChkeCAhPSAwLjAgfHwgZHkgIT0gMC4wKXtcclxuXHRcdFx0dmFyIHRoZXRhID0gLXRoaXMuYW5nbGUueTtcclxuXHRcdFx0dmFyIGFuZyA9IC10aGlzLmFuZ2xlLnggLSBLVE1hdGguUElfMjtcclxuXHRcdFx0dmFyIGNvcyA9IE1hdGguY29zKGFuZyk7XHJcblx0XHRcdHZhciBzaW4gPSBNYXRoLnNpbihhbmcpO1xyXG5cdFx0XHR2YXIgY29zVCA9IE1hdGguY29zKHRoZXRhKTtcclxuXHRcdFx0dmFyIHNpblQgPSBNYXRoLnNpbih0aGV0YSk7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnRhcmdldC54IC09IGNvcyAqIGR4ICogdGhpcy5zZW5zaXRpdml0eS54IC8gMTA7XHJcblx0XHRcdHRoaXMudGFyZ2V0LnkgKz0gY29zVCAqIGR5ICogdGhpcy5zZW5zaXRpdml0eS55IC8gMTA7XHJcblx0XHRcdHRoaXMudGFyZ2V0LnogLT0gc2luICogZHggKiB0aGlzLnNlbnNpdGl2aXR5LnggLyAxMDtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuc2V0Q2FtZXJhUG9zaXRpb24oKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5sYXN0UGFuLmNvcHkoSW5wdXQuX21vdXNlLnBvc2l0aW9uKTtcclxuXHR9ZWxzZXtcclxuXHRcdHRoaXMubGFzdFBhbiA9IG51bGw7XHJcblx0fVxyXG59O1xyXG5cclxuT3JiaXRBbmRQYW4ucHJvdG90eXBlLnNldENhbWVyYVBvc2l0aW9uID0gZnVuY3Rpb24oKXtcclxuXHR0aGlzLmFuZ2xlLnggPSAodGhpcy5hbmdsZS54ICsgS1RNYXRoLlBJMikgJSBLVE1hdGguUEkyO1xyXG5cdHRoaXMuYW5nbGUueSA9ICh0aGlzLmFuZ2xlLnkgKyBLVE1hdGguUEkyKSAlIEtUTWF0aC5QSTI7XHJcblx0XHJcblx0aWYgKHRoaXMuYW5nbGUueSA8IEtUTWF0aC5QSSAmJiB0aGlzLmFuZ2xlLnkgPj0gS1RNYXRoLlBJXzIpIHRoaXMuYW5nbGUueSA9IEtUTWF0aC5kZWdUb1JhZCg4OS45KTtcclxuXHRpZiAodGhpcy5hbmdsZS55ID4gS1RNYXRoLlBJICYmIHRoaXMuYW5nbGUueSA8PSBLVE1hdGguUEkzXzIpIHRoaXMuYW5nbGUueSA9IEtUTWF0aC5kZWdUb1JhZCgyNzAuOSk7XHJcblx0aWYgKHRoaXMuem9vbSA8PSAwLjMpIHRoaXMuem9vbSA9IDAuMztcclxuXHRcclxuXHR2YXIgY29zVCA9IE1hdGguY29zKHRoaXMuYW5nbGUueSk7XHJcblx0dmFyIHNpblQgPSBNYXRoLnNpbih0aGlzLmFuZ2xlLnkpO1xyXG5cdFxyXG5cdHZhciB4ID0gdGhpcy50YXJnZXQueCArIE1hdGguY29zKHRoaXMuYW5nbGUueCkgKiBjb3NUICogdGhpcy56b29tO1xyXG5cdHZhciB5ID0gdGhpcy50YXJnZXQueSArIHNpblQgKiB0aGlzLnpvb207XHJcblx0dmFyIHogPSB0aGlzLnRhcmdldC56IC0gTWF0aC5zaW4odGhpcy5hbmdsZS54KSAqIGNvc1QgKiB0aGlzLnpvb207XHJcblx0XHJcblx0dGhpcy5jYW1lcmEucG9zaXRpb24uc2V0KHgsIHksIHopO1xyXG5cdHRoaXMuY2FtZXJhLmxvb2tBdCh0aGlzLnRhcmdldCk7XHJcbn07XHJcblxyXG5PcmJpdEFuZFBhbi5wcm90b3R5cGUuc2V0Q2FtZXJhID0gZnVuY3Rpb24oY2FtZXJhKXtcclxuXHR2YXIgem9vbSA9IFZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UoY2FtZXJhLnBvc2l0aW9uLCB0aGlzLnRhcmdldCkubGVuZ3RoKCk7XHJcblx0dGhpcy5jYW1lcmEgPSBjYW1lcmE7XHJcblx0dGhpcy56b29tID0gem9vbTtcclxuXHR0aGlzLmFuZ2xlLnggPSBLVE1hdGguZ2V0MkRBbmdsZSh0aGlzLnRhcmdldC54LCB0aGlzLnRhcmdldC56LCBjYW1lcmEucG9zaXRpb24ueCwgY2FtZXJhLnBvc2l0aW9uLnopO1xyXG5cdHRoaXMuYW5nbGUueSA9IEtUTWF0aC5nZXQyREFuZ2xlKDAsIGNhbWVyYS5wb3NpdGlvbi55LCB6b29tLCB0aGlzLnRhcmdldC55KTtcclxuXHRcclxuXHR0aGlzLnNldENhbWVyYVBvc2l0aW9uKCk7XHJcbn07XHJcbiIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgTWF0ZXJpYWwgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWwnKTtcclxudmFyIE1hdGVyaWFsQmFzaWMgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWxCYXNpYycpO1xyXG52YXIgTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcbnZhciBHZW9tZXRyeVNreWJveCA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeVNreWJveCcpO1xyXG5cclxuZnVuY3Rpb24gU2NlbmUocGFyYW1zKXtcclxuXHR0aGlzLl9fa3RzY2VuZSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5tZXNoZXMgPSBbXTtcclxuXHR0aGlzLmxpZ2h0cyA9IFtdO1xyXG5cdHRoaXMuc2hhZGluZ01vZGUgPSBbJ0JBU0lDJywgJ0xBTUJFUlQnXTtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy51c2VMaWdodGluZyA9IChwYXJhbXMudXNlTGlnaHRpbmcpPyB0cnVlIDogZmFsc2U7XHJcblx0dGhpcy5hbWJpZW50TGlnaHQgPSAocGFyYW1zLmFtYmllbnRMaWdodCk/IG5ldyBDb2xvcihwYXJhbXMuYW1iaWVudExpZ2h0KSA6IG51bGw7XHJcblx0XHJcblx0dGhpcy5zZXRTaGFkb3dNYXRlcmlhbCgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjZW5lO1xyXG5cclxuU2NlbmUucHJvdG90eXBlLnNldFNoYWRvd01hdGVyaWFsID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0XHJcblx0dGhpcy5zaGFkb3dNYXBwaW5nID0gbnVsbDtcclxuXHR0aGlzLnNoYWRvd01hdCA9IG5ldyBNYXRlcmlhbCh7XHJcblx0XHRzaGFkZXI6IEtULnNoYWRlcnMuZGVwdGgsXHJcblx0XHRzZW5kQXR0cmliRGF0YTogZnVuY3Rpb24obWVzaCwgY2FtZXJhLCBzY2VuZSl7XHJcblx0XHRcdHZhciBnbCA9IEtULmdsO1xyXG5cdFx0XHR2YXIgZ2VvbWV0cnkgPSBtZXNoLmdlb21ldHJ5O1xyXG5cdFx0XHR2YXIgYXR0cmlidXRlcyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcblx0XHRcdGZvciAodmFyIGk9MCxsZW49YXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdFx0XHR2YXIgYXR0ID0gYXR0cmlidXRlc1tpXTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4UG9zaXRpb25cIil7XHJcblx0XHRcdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyKTtcclxuXHRcdFx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0c2VuZFVuaWZvcm1EYXRhOiBmdW5jdGlvbihtZXNoLCBjYW1lcmEsIHNjZW5lKXtcclxuXHRcdFx0dmFyIGdsID0gS1QuZ2w7XHJcblx0XHRcdHZhciB1bmlmb3JtcyA9IHRoaXMuc2hhZGVyLnVuaWZvcm1zO1xyXG5cdFx0XHRmb3IgKHZhciBpPTAsbGVuPXVuaWZvcm1zLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0XHRcdHZhciB1bmkgPSB1bmlmb3Jtc1tpXTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAodW5pLm5hbWUgPT0gJ3VNVlBNYXRyaXgnKXtcclxuXHRcdFx0XHRcdHZhciBtdnAgPSBtZXNoLmdldFRyYW5zZm9ybWF0aW9uTWF0cml4KCkubXVsdGlwbHkoY2FtZXJhLnRyYW5zZm9ybWF0aW9uTWF0cml4KS5tdWx0aXBseShjYW1lcmEucGVyc3BlY3RpdmVNYXRyaXgpO1xyXG5cdFx0XHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdih1bmkubG9jYXRpb24sIGZhbHNlLCBtdnAudG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHRcdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1RGVwdGhNdWx0Jyl7XHJcblx0XHRcdFx0XHRnbC51bmlmb3JtMWYodW5pLmxvY2F0aW9uLCAoVC5zaGFkb3dNYXBwaW5nLl9fa3RkaXJMaWdodCk/IC0xIDogMSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcbn07XHJcblxyXG5TY2VuZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24ob2JqZWN0KXtcclxuXHRpZiAob2JqZWN0Ll9fa3RtZXNoKXtcclxuXHRcdHRoaXMubWVzaGVzLnB1c2gob2JqZWN0KTtcclxuXHR9ZWxzZSBpZiAob2JqZWN0Ll9fa3RkaXJMaWdodCB8fCBvYmplY3QuX19rdHBvaW50bGlnaHQgfHwgb2JqZWN0Ll9fa3RzcG90bGlnaHQpe1xyXG5cdFx0dGhpcy5saWdodHMucHVzaChvYmplY3QpO1xyXG5cdH1lbHNle1xyXG5cdFx0dGhyb3cgXCJDYW4ndCBhZGQgdGhlIG9iamVjdCB0byB0aGUgc2NlbmVcIjtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5TY2VuZS5wcm90b3R5cGUuZHJhd01lc2ggPSBmdW5jdGlvbihtZXNoLCBjYW1lcmEpe1xyXG5cdGlmICghbWVzaC5nZW9tZXRyeS5yZWFkeSkgcmV0dXJuO1xyXG5cdGlmICh0aGlzLnNoYWRvd01hcHBpbmcgJiYgIW1lc2guY2FzdFNoYWRvdykgcmV0dXJuO1xyXG5cdFxyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdHZhciBtYXRlcmlhbCA9ICh0aGlzLnNoYWRvd01hcHBpbmcpPyB0aGlzLnNoYWRvd01hdCA6IG1lc2gubWF0ZXJpYWw7XHJcblx0dmFyIHNoYWRlciA9IG1hdGVyaWFsLnNoYWRlcjtcclxuXHRcclxuXHRLVC5zd2l0Y2hQcm9ncmFtKHNoYWRlcik7XHJcblx0dGhpcy5zZXRNYXRlcmlhbEF0dHJpYnV0ZXMobWVzaC5tYXRlcmlhbCk7XHJcblx0XHJcblx0bWF0ZXJpYWwuc2VuZEF0dHJpYkRhdGEobWVzaCwgY2FtZXJhLCB0aGlzKTtcclxuXHRtYXRlcmlhbC5zZW5kVW5pZm9ybURhdGEobWVzaCwgY2FtZXJhLCB0aGlzKTtcclxuXHRcclxuXHRnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBtZXNoLmdlb21ldHJ5LmZhY2VzQnVmZmVyKTtcclxuXHRnbC5kcmF3RWxlbWVudHMoZ2xbbWF0ZXJpYWwuZHJhd0FzXSwgbWVzaC5nZW9tZXRyeS5mYWNlc0J1ZmZlci5udW1JdGVtcywgZ2wuVU5TSUdORURfU0hPUlQsIDApO1xyXG59O1xyXG5cclxuU2NlbmUucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKXtcclxuXHRLVC5nbC5jbGVhcihLVC5nbC5DT0xPUl9CVUZGRVJfQklUIHwgS1QuZ2wuREVQVEhfQlVGRkVSX0JJVCk7XHJcbn07XHJcblxyXG5TY2VuZS5wcm90b3R5cGUucmVuZGVyVG9GcmFtZWJ1ZmZlciA9IGZ1bmN0aW9uKGNhbWVyYSwgZnJhbWVidWZmZXIpe1xyXG5cdGlmICghZnJhbWVidWZmZXIuX19rdHRleHR1cmVmcmFtZWJ1ZmZlcikgdGhyb3cgXCJmcmFtZWJ1ZmZlciBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIFRleHR1cmVGcmFtZWJ1ZmZlclwiO1xyXG5cdFxyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVidWZmZXIuZnJhbWVidWZmZXIpO1xyXG5cdGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcclxuXHRnbC5jbGVhckNvbG9yKDEuMCwgMS4wLCAxLjAsIDEuMCk7XHJcblx0Z2wudmlld3BvcnQoMCwwLGZyYW1lYnVmZmVyLndpZHRoLGZyYW1lYnVmZmVyLmhlaWdodCk7XHJcblx0dGhpcy5yZW5kZXIoY2FtZXJhKTtcclxuXHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xyXG5cdGdsLnZpZXdwb3J0KDAsMCxnbC53aWR0aCxnbC5oZWlnaHQpO1xyXG59O1xyXG5cclxuU2NlbmUucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdFxyXG5cdGlmICghdGhpcy5zaGFkb3dNYXBwaW5nKXtcclxuXHRcdGZvciAodmFyIGk9MCxsZW49dGhpcy5saWdodHMubGVuZ3RoLTE7aTw9bGVuO2krKyl7XHJcblx0XHRcdGlmICh0aGlzLmxpZ2h0c1tpXS5jYXN0U2hhZG93KXtcclxuXHRcdFx0XHR0aGlzLnNoYWRvd01hcHBpbmcgPSB0aGlzLmxpZ2h0c1tpXTtcclxuXHRcdFx0XHR0aGlzLnJlbmRlclRvRnJhbWVidWZmZXIodGhpcy5saWdodHNbaV0uc2hhZG93Q2FtLCB0aGlzLmxpZ2h0c1tpXS5zaGFkb3dCdWZmZXIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoaSA9PSBsZW4pe1xyXG5cdFx0XHRcdHRoaXMuc2hhZG93TWFwcGluZyA9IG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYgKGNhbWVyYS5jb250cm9scykgY2FtZXJhLmNvbnRyb2xzLnVwZGF0ZSgpO1xyXG5cdH1cclxuXHRcclxuXHRnbC5kaXNhYmxlKCBnbC5CTEVORCApOyBcclxuXHR2YXIgdHJhbnNwYXJlbnRzID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLm1lc2hlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBtZXNoID0gdGhpcy5tZXNoZXNbaV07XHJcblx0XHRpZiAoIW1lc2gudmlzaWJsZSkgY29udGludWU7XHJcblx0XHRpZiAobWVzaC5tYXRlcmlhbC5vcGFjaXR5ID09IDAuMCkgY29udGludWU7XHJcblx0XHRcclxuXHRcdGlmIChtZXNoLm1hdGVyaWFsLm9wYWNpdHkgIT0gMS4wIHx8IG1lc2gubWF0ZXJpYWwudHJhbnNwYXJlbnQpe1xyXG5cdFx0XHR0cmFuc3BhcmVudHMucHVzaChtZXNoKTtcclxuXHRcdFx0Y29udGludWU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuZHJhd01lc2gobWVzaCwgY2FtZXJhKTtcclxuXHR9XHJcblx0XHJcblx0Z2wuZW5hYmxlKCBnbC5CTEVORCApOyBcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRyYW5zcGFyZW50cy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBtZXNoID0gdHJhbnNwYXJlbnRzW2ldO1xyXG5cdFx0dGhpcy5kcmF3TWVzaChtZXNoLCBjYW1lcmEpO1xyXG5cdH1cclxuXHRcclxuXHRpZiAoIXRoaXMuc2hhZG93TWFwcGluZyAmJiBjYW1lcmEuc2t5Ym94KXtcclxuXHRcdHRoaXMuZHJhd1NreWJveChjYW1lcmEuc2t5Ym94LCBjYW1lcmEpO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5kcmF3U2t5Ym94ID0gZnVuY3Rpb24oc2t5Ym94LCBjYW1lcmEpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdEtULnN3aXRjaFByb2dyYW0oR2VvbWV0cnlTa3lib3gubWF0ZXJpYWwuc2hhZGVyKTtcclxuXHRcclxuXHRnbC5lbmFibGUoZ2wuQ1VMTF9GQUNFKTtcclxuXHRnbC5jdWxsRmFjZShnbC5GUk9OVCk7XHJcbiAgICBnbC5kZXB0aEZ1bmMoZ2wuTEVRVUFMKTtcclxuXHRcclxuXHRza3lib3gucmVuZGVyKGNhbWVyYSwgdGhpcyk7XHJcblx0XHJcblx0Z2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgc2t5Ym94LmJveEdlby5mYWNlc0J1ZmZlcik7XHJcblx0Z2wuZHJhd0VsZW1lbnRzKGdsLlRSSUFOR0xFUywgc2t5Ym94LmJveEdlby5mYWNlc0J1ZmZlci5udW1JdGVtcywgZ2wuVU5TSUdORURfU0hPUlQsIDApO1xyXG59O1xyXG5cclxuU2NlbmUucHJvdG90eXBlLnNldE1hdGVyaWFsQXR0cmlidXRlcyA9IGZ1bmN0aW9uKG1hdGVyaWFsKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHR2YXIgY3VsbCA9IFwiQkFDS1wiO1xyXG5cdGlmIChtYXRlcmlhbC5kcmF3RmFjZXMgPT0gJ0JBQ0snKXsgY3VsbCA9IFwiRlJPTlRcIjsgfVxyXG5cdGVsc2UgaWYgKG1hdGVyaWFsLmRyYXdGYWNlcyA9PSAnQk9USCcpeyBjdWxsID0gXCJcIjsgfVxyXG5cdFxyXG5cdGlmIChjdWxsICE9IFwiXCIpe1xyXG5cdFx0Z2wuZW5hYmxlKGdsLkNVTExfRkFDRSk7XHJcblx0XHRnbC5jdWxsRmFjZShnbFtjdWxsXSk7XHJcblx0fWVsc2V7XHJcblx0XHRnbC5kaXNhYmxlKGdsLkNVTExfRkFDRSk7XHJcblx0fVxyXG59O1xyXG4iLCJ2YXIgc3RydWN0cyA9IHtcclxuXHRMaWdodDogXCJzdHJ1Y3QgTGlnaHR7IFwiICtcclxuXHQgICAgXCJsb3dwIHZlYzMgcG9zaXRpb247IFwiICtcclxuXHQgICAgXCJsb3dwIHZlYzMgY29sb3I7IFwiICtcclxuXHQgICAgXCJsb3dwIHZlYzMgZGlyZWN0aW9uOyBcIiArXHJcblx0ICAgIFwibG93cCB2ZWMzIHNwb3REaXJlY3Rpb247IFwiICtcclxuXHQgICAgXCJsb3dwIGZsb2F0IGludGVuc2l0eTsgXCIgK1xyXG5cdCAgICBcImxvd3AgZmxvYXQgaW5uZXJBbmdsZTsgXCIgK1xyXG5cdCAgICBcImxvd3AgZmxvYXQgb3V0ZXJBbmdsZTsgXCIgK1xyXG5cdCAgICBcImxvd3AgZmxvYXQgc2hhZG93U3RyZW5ndGg7IFwiICtcclxuXHQgICAgXCJsb3dwIGZsb2F0IGxpZ2h0TXVsdDsgXCIgKyBcclxuXHQgICAgXCJib29sIGNhc3RTaGFkb3c7IFwiICtcclxuXHQgICAgXCJtZWRpdW1wIG1hdDQgbXZQcm9qZWN0aW9uOyBcIiArXHJcblx0XCJ9OyBcIlxyXG59O1xyXG5cclxudmFyIGZ1bmN0aW9ucyA9IHtcclxuXHRjYWxjU2hhZG93RmFjdG9yIDogXCJsb3dwIGZsb2F0IGNhbGNTaGFkb3dGYWN0b3Ioc2FtcGxlcjJEIHNoYWRvd01hcCwgbWVkaXVtcCB2ZWM0IGxpZ2h0U3BhY2VQb3MsIGxvd3AgZmxvYXQgc2hhZG93U3RyZW5ndGgsIGxvd3AgZmxvYXQgbGlnaHRNdWx0KXsgXCIgK1xyXG5cdFx0XCJpZiAoIXVSZWNlaXZlU2hhZG93KSBcIiArXHJcblx0XHRcdFwicmV0dXJuIDEuMDsgXCIgK1xyXG5cdCAgICBcIm1lZGl1bXAgdmVjMyBwcm9qQ29vcmRzID0gbGlnaHRTcGFjZVBvcy54eXogLyBsaWdodFNwYWNlUG9zLnc7IFwiICtcclxuXHQgICAgXCJtZWRpdW1wIHZlYzIgVVZDb29yZHM7IFwiICtcclxuXHQgICAgXCJVVkNvb3Jkcy54ID0gcHJvakNvb3Jkcy54OyBcIiArXHJcblx0ICAgIFwiVVZDb29yZHMueSA9IHByb2pDb29yZHMueTsgXCIgK1xyXG5cdCAgICBcInByb2pDb29yZHMueiAqPSBsaWdodE11bHQ7IFwiICtcclxuXHQgICAgXHJcblx0ICAgIFwiYnZlYzQgaW5UZXh0dXJlID0gYnZlYzQoVVZDb29yZHMueCA+PSAwLjAsIFVWQ29vcmRzLnkgPj0gMC4wLCBVVkNvb3Jkcy54IDwgMS4wLCBVVkNvb3Jkcy55IDwgMS4wKTsgXCIgK1xyXG5cdCAgICBcImlmICghYWxsKGluVGV4dHVyZSkpIFwiICtcclxuXHQgICAgXHRcInJldHVybiAxLjA7IFwiICtcclxuXHQgICAgXHJcblx0ICAgIFwibWVkaXVtcCBmbG9hdCB6ID0gKDEuMCAtIHByb2pDb29yZHMueikgKiAxNS4wOyBcIiArXHJcblx0ICAgIFwiaWYgKGxpZ2h0TXVsdCA9PSAxLjApIHogPSAxLjAgLSB6OyBcIiArXHJcblx0ICAgIFwieiA9IG1pbih6LCAxLjApOyBcIiArXHJcblx0XHRcdCAgICBcdFxyXG5cdCAgICBcIm1lZGl1bXAgdmVjNCB0ZXhDb29yZCA9IHRleHR1cmUyRChzaGFkb3dNYXAsIFVWQ29vcmRzKTtcIiArXHJcblx0ICAgIFwibWVkaXVtcCBmbG9hdCBkZXB0aCA9IHRleENvb3JkLng7IFwiICtcclxuXHQgICAgXHRcclxuXHQgICAgXCJpZiAoZGVwdGggPCAoeiAtIDAuMDA1KSkgXCIgK1xyXG5cdCAgICAgICAgXCJyZXR1cm4gc2hhZG93U3RyZW5ndGg7IFwiICsgXHJcblx0ICAgIFwicmV0dXJuIDEuMDsgXCIgK1xyXG5cdFwifSBcIixcclxuXHRcclxuXHRzZXRMaWdodFBvc2l0aW9uOiBcInZvaWQgc2V0TGlnaHRQb3NpdGlvbihpbnQgaW5kZXgsIG1lZGl1bXAgdmVjNCBwb3NpdGlvbil7IFwiICtcclxuXHRcdFwiaWYgKGluZGV4ID09IDApeyB2TGlnaHRQb3NpdGlvblswXSA9IHBvc2l0aW9uOyByZXR1cm47IH1cIiArXHJcblx0XHRcImlmIChpbmRleCA9PSAxKXsgdkxpZ2h0UG9zaXRpb25bMV0gPSBwb3NpdGlvbjsgcmV0dXJuOyB9XCIgK1xyXG5cdFx0XCJpZiAoaW5kZXggPT0gMil7IHZMaWdodFBvc2l0aW9uWzJdID0gcG9zaXRpb247IHJldHVybjsgfVwiICtcclxuXHRcdFwiaWYgKGluZGV4ID09IDMpeyB2TGlnaHRQb3NpdGlvblszXSA9IHBvc2l0aW9uOyByZXR1cm47IH1cIiArXHJcblx0XCJ9IFwiLFxyXG5cdFxyXG5cdGdldExpZ2h0UG9zaXRpb246IFwibWVkaXVtcCB2ZWM0IGdldExpZ2h0UG9zaXRpb24oaW50IGluZGV4KXsgXCIgK1xyXG5cdFx0XCJpZiAoaW5kZXggPT0gMCl7IHJldHVybiB2TGlnaHRQb3NpdGlvblswXTsgfVwiICtcclxuXHRcdFwiaWYgKGluZGV4ID09IDEpeyByZXR1cm4gdkxpZ2h0UG9zaXRpb25bMV07IH1cIiArXHJcblx0XHRcImlmIChpbmRleCA9PSAyKXsgcmV0dXJuIHZMaWdodFBvc2l0aW9uWzJdOyB9XCIgK1xyXG5cdFx0XCJpZiAoaW5kZXggPT0gMyl7IHJldHVybiB2TGlnaHRQb3NpdGlvblszXTsgfVwiICtcclxuXHRcdFwicmV0dXJuIHZlYzQoMC4wKTsgXCIgK1xyXG5cdFwifSBcIixcclxuXHRcclxuXHRnZXRMaWdodFdlaWdodDogXCJtZWRpdW1wIHZlYzMgZ2V0TGlnaHRXZWlnaHQobWVkaXVtcCB2ZWMzIG5vcm1hbCwgbWVkaXVtcCB2ZWMzIGRpcmVjdGlvbiwgbG93cCB2ZWMzIGNvbG9yLCBsb3dwIGZsb2F0IGludGVuc2l0eSl7IFwiICtcclxuXHRcdFwibWVkaXVtcCBmbG9hdCBsaWdodERvdCA9IG1heChkb3Qobm9ybWFsLCBkaXJlY3Rpb24pLCAwLjApOyBcIiArXHJcblx0XHRcIm1lZGl1bXAgdmVjMyBsaWdodFdlaWdodCA9IChjb2xvciAqIGxpZ2h0RG90ICogaW50ZW5zaXR5KTsgXCIgK1xyXG5cdFx0XCJyZXR1cm4gbGlnaHRXZWlnaHQ7IFwiICtcclxuXHRcIn1cIlxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0YmFzaWM6IHtcclxuXHRcdHZlcnRleFNoYWRlcjogXHJcblx0XHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjMiBhVGV4dHVyZUNvb3JkOyBcIiArXHJcblx0XHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjMyBhVmVydGV4UG9zaXRpb247IFwiICtcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbG93cCB2ZWM0IGFWZXJ0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgbWF0NCB1TVZQTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzQgdU1hdGVyaWFsQ29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdlZlcnRleENvbG9yOyBcIiArXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDtcIiArICBcclxuXHRcdFx0XHJcblx0XHRcdFwidm9pZCBtYWluKHZvaWQpeyBcIiArIFxyXG5cdFx0XHRcdFwiZ2xfUG9zaXRpb24gPSB1TVZQTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFx0XCJ2VmVydGV4Q29sb3IgPSBhVmVydGV4Q29sb3IgKiB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwidlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7IFwiICsgXHJcblx0XHRcdFwifSBcIiAsXHJcblx0XHRcdFxyXG5cdFx0ZnJhZ21lbnRTaGFkZXI6IFxyXG5cdFx0XHRcInVuaWZvcm0gc2FtcGxlcjJEIHVUZXh0dXJlU2FtcGxlcjsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gYm9vbCB1SGFzVGV4dHVyZTsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMyIHVUZXh0dXJlUmVwZWF0OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzIgdVRleHR1cmVPZmZzZXQ7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgdmVjNCB1R2VvbWV0cnlVVjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMiB2VGV4dHVyZUNvb3JkOyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZWZXJ0ZXhDb2xvcjsgXCIgKyBcclxuXHRcdFx0XHJcblx0XHRcdFwidm9pZCBtYWluKHZvaWQpeyBcIiArXHJcblx0XHRcdFx0XCJtZWRpdW1wIHZlYzQgY29sb3IgPSB2VmVydGV4Q29sb3I7IFwiICsgXHJcblx0XHRcdFx0XCJpZiAodUhhc1RleHR1cmUpeyBcIiArIFxyXG5cdFx0XHRcdFx0XCJtZWRpdW1wIGZsb2F0IHR4ID0gdUdlb21ldHJ5VVYueCArIG1vZCh1VGV4dHVyZU9mZnNldC54ICsgdlRleHR1cmVDb29yZC5zICogdVRleHR1cmVSZXBlYXQueCAtIHVHZW9tZXRyeVVWLngsIHVHZW9tZXRyeVVWLnogLSB1R2VvbWV0cnlVVi54KTtcIiArXHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgdHkgPSB1R2VvbWV0cnlVVi55ICsgbW9kKHVUZXh0dXJlT2Zmc2V0LnkgKyB2VGV4dHVyZUNvb3JkLnQgKiB1VGV4dHVyZVJlcGVhdC55IC0gdUdlb21ldHJ5VVYueSwgdUdlb21ldHJ5VVYudyAtIHVHZW9tZXRyeVVWLnkpO1wiICtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzQgdGV4Q29sb3IgPSB0ZXh0dXJlMkQodVRleHR1cmVTYW1wbGVyLCB2ZWMyKHR4LCB0eSkpOyBcIiArXHJcblx0XHRcdFx0XHRcImNvbG9yICo9IHRleENvbG9yOyBcIiArXHJcblx0XHRcdFx0XCJ9IFwiICsgXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XCJnbF9GcmFnQ29sb3IgPSBjb2xvcjtcIiArIFxyXG5cdFx0XHRcIn1cIlxyXG5cdH0sXHJcblx0XHJcblx0XHJcblx0bGFtYmVydDoge1xyXG5cdFx0dmVydGV4U2hhZGVyOiBcclxuXHRcdFx0c3RydWN0cy5MaWdodCArXHJcblx0XHRcdCAgICBcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMyIGFUZXh0dXJlQ29vcmQ7IFwiICtcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBsb3dwIHZlYzQgYVZlcnRleENvbG9yOyBcIiArXHJcblx0XHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjMyBhVmVydGV4Tm9ybWFsOyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgbWF0NCB1TVZNYXRyaXg7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgbWF0NCB1UE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWM0IHVNYXRlcmlhbENvbG9yOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdU1vZGVsTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDMgdU5vcm1hbE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMzIHVBbWJpZW50TGlnaHRDb2xvcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIExpZ2h0IHVMaWdodHNbOF07IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgaW50IHVVc2VkTGlnaHRzOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVSZWNlaXZlU2hhZG93OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVVc2VMaWdodGluZzsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMiB2VGV4dHVyZUNvb3JkO1wiICsgIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMzIHZMaWdodFdlaWdodDsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2TGlnaHRQb3NpdGlvbls0XTsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0ZnVuY3Rpb25zLmdldExpZ2h0V2VpZ2h0ICsgXHJcblx0XHRcdFxyXG5cdFx0XHRmdW5jdGlvbnMuc2V0TGlnaHRQb3NpdGlvbiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgKyBcclxuXHRcdFx0XHRcInZlYzQgbW9kZWxWaWV3UG9zaXRpb24gPSB1TVZNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTsgXCIgK1xyXG5cdFx0XHRcdFwiZ2xfUG9zaXRpb24gPSB1UE1hdHJpeCAqIG1vZGVsVmlld1Bvc2l0aW9uOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcdFwidkxpZ2h0V2VpZ2h0ID0gdUFtYmllbnRMaWdodENvbG9yOyBcIiArXHJcblx0XHRcdFx0XCJpZiAodVVzZUxpZ2h0aW5nKXsgXCIgK1xyXG5cdFx0XHRcdFx0XCJ2ZWMzIHZlcnRleE1vZGVsUG9zaXRpb24gPSAodU1vZGVsTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5ejsgXCIgK1xyXG5cdFx0XHRcdFx0XCJsb3dwIGludCBzaGFkb3dJbmRleCA9IDA7IFwiICtcclxuXHRcdFx0XHRcdFwiZm9yIChpbnQgaT0wO2k8ODtpKyspeyBcIiArXHJcblx0XHRcdFx0XHRcdFwiaWYgKGkgPj0gdVVzZWRMaWdodHMpe1wiICtcclxuXHRcdFx0XHRcdFx0XHRcImJyZWFrOyBcIiArXHJcblx0XHRcdFx0XHRcdFwifVwiICtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFwiTGlnaHQgbCA9IHVMaWdodHNbaV07IFwiICtcclxuXHRcdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgbFBvcyA9IGwucG9zaXRpb24gLSB2ZXJ0ZXhNb2RlbFBvc2l0aW9uO1wiICtcclxuXHRcdFx0XHRcdFx0XCJtZWRpdW1wIGZsb2F0IGxEaXN0YW5jZSA9IGxlbmd0aChsUG9zKSAvIDIuMDsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcImlmIChsZW5ndGgobC5wb3NpdGlvbikgPT0gMC4wKXsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwibERpc3RhbmNlID0gMS4wOyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJsUG9zID0gdmVjMygwLjApOyBcIiArXHJcblx0XHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjMyBsaWdodERpcmVjdGlvbiA9IGwuZGlyZWN0aW9uICsgbm9ybWFsaXplKGxQb3MpOyBcIiArXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcImxvd3AgZmxvYXQgc3BvdFdlaWdodCA9IDEuMDsgXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICBcImlmIChsZW5ndGgobC5zcG90RGlyZWN0aW9uKSAhPSAwLjApeyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgICAgICBcImxvd3AgZmxvYXQgY29zQW5nbGUgPSBkb3QobC5zcG90RGlyZWN0aW9uLCBsaWdodERpcmVjdGlvbik7IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgXHRcInNwb3RXZWlnaHQgPSBjbGFtcCgoY29zQW5nbGUgLSBsLm91dGVyQW5nbGUpIC8gKGwuaW5uZXJBbmdsZSAtIGwub3V0ZXJBbmdsZSksIDAuMCwgMS4wKTsgXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgXCJsRGlzdGFuY2UgPSAxLjA7IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgXCJ9IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgXHJcblx0XHRcdFx0XHRcdFwidkxpZ2h0V2VpZ2h0ICs9IGdldExpZ2h0V2VpZ2h0KGFWZXJ0ZXhOb3JtYWwsIGxpZ2h0RGlyZWN0aW9uLCBsLmNvbG9yLCBsLmludGVuc2l0eSkgKiBzcG90V2VpZ2h0IC8gbERpc3RhbmNlOyBcIiArIFxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XCJpZiAobC5jYXN0U2hhZG93ICYmIHVSZWNlaXZlU2hhZG93KXsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwibWVkaXVtcCB2ZWM0IGxpZ2h0UHJvaiA9IGwubXZQcm9qZWN0aW9uICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcInNldExpZ2h0UG9zaXRpb24oc2hhZG93SW5kZXgrKywgbGlnaHRQcm9qKTsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdCBcclxuXHRcdFx0XHRcInZWZXJ0ZXhDb2xvciA9IGFWZXJ0ZXhDb2xvciAqIHVNYXRlcmlhbENvbG9yOyBcIiArXHJcblx0XHRcdFx0XCJ2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDsgXCIgKyAgXHJcblx0XHRcdFwifSBcIiAsXHJcblx0XHRcdFxyXG5cdFx0ZnJhZ21lbnRTaGFkZXI6XHJcblx0XHRcdHN0cnVjdHMuTGlnaHQgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVVzZUxpZ2h0aW5nOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVSZWNlaXZlU2hhZG93OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIGludCB1VXNlZExpZ2h0czsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gTGlnaHQgdUxpZ2h0c1s4XTsgXCIgK1xyXG5cdFx0ICAgIFwidW5pZm9ybSBzYW1wbGVyMkQgdVNoYWRvd01hcHNbOF07IFwiICtcclxuXHRcdCAgICAgXHJcblx0XHRcdFwidW5pZm9ybSBzYW1wbGVyMkQgdVRleHR1cmVTYW1wbGVyOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVIYXNUZXh0dXJlOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIGZsb2F0IHVPcGFjaXR5OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzIgdVRleHR1cmVSZXBlYXQ7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMiB1VGV4dHVyZU9mZnNldDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCB2ZWM0IHVHZW9tZXRyeVVWOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdlZlcnRleENvbG9yOyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMzIHZMaWdodFdlaWdodDsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2TGlnaHRQb3NpdGlvbls0XTsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0ZnVuY3Rpb25zLmNhbGNTaGFkb3dGYWN0b3IgKyBcclxuXHRcdFx0ZnVuY3Rpb25zLmdldExpZ2h0UG9zaXRpb24gK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjNCBjb2xvciA9IHZWZXJ0ZXhDb2xvcjsgXCIgKyBcclxuXHRcdFx0XHRcImlmICh1SGFzVGV4dHVyZSl7IFwiICsgXHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgdHggPSB1R2VvbWV0cnlVVi54ICsgbW9kKHVUZXh0dXJlT2Zmc2V0LnggKyB2VGV4dHVyZUNvb3JkLnMgKiB1VGV4dHVyZVJlcGVhdC54IC0gdUdlb21ldHJ5VVYueCwgdUdlb21ldHJ5VVYueiAtIHVHZW9tZXRyeVVWLngpO1wiICtcclxuXHRcdFx0XHRcdFwibWVkaXVtcCBmbG9hdCB0eSA9IHVHZW9tZXRyeVVWLnkgKyBtb2QodVRleHR1cmVPZmZzZXQueSArIHZUZXh0dXJlQ29vcmQudCAqIHVUZXh0dXJlUmVwZWF0LnkgLSB1R2VvbWV0cnlVVi55LCB1R2VvbWV0cnlVVi53IC0gdUdlb21ldHJ5VVYueSk7XCIgK1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjNCB0ZXhDb2xvciA9IHRleHR1cmUyRCh1VGV4dHVyZVNhbXBsZXIsIHZlYzIodHgsIHR5KSk7IFwiICtcclxuXHRcdFx0XHRcdFwiY29sb3IgKj0gdGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHRcIn0gXCIgKyBcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjMyBsaWdodFdlaWdodCA9IHZMaWdodFdlaWdodDsgXCIgK1xyXG5cdFx0XHRcdFwiaWYgKHVVc2VMaWdodGluZyl7IFwiICtcclxuXHRcdFx0XHRcdFwibG93cCBpbnQgc2hhZG93SW5kZXggPSAwOyBcIiArXHJcblx0XHRcdFx0XHRcImZvciAoaW50IGk9MDtpPDg7aSsrKXsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcImlmIChpID49IHVVc2VkTGlnaHRzKXtcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJicmVhazsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcIn1cIiArXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcImxvd3AgZmxvYXQgc2hhZG93V2VpZ2h0ID0gMS4wOyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgIFwiaWYgKHVMaWdodHNbaV0uY2FzdFNoYWRvdylcIiArXHJcblx0XHRcdCAgICAgICAgICAgIFx0XCJzaGFkb3dXZWlnaHQgPSBjYWxjU2hhZG93RmFjdG9yKHVTaGFkb3dNYXBzW2ldLCBnZXRMaWdodFBvc2l0aW9uKHNoYWRvd0luZGV4KyspLCB1TGlnaHRzW2ldLnNoYWRvd1N0cmVuZ3RoLCB1TGlnaHRzW2ldLmxpZ2h0TXVsdCk7IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgXCJsaWdodFdlaWdodCAqPSBzaGFkb3dXZWlnaHQ7IFwiICtcclxuXHRcdFx0XHRcdFwifSBcIiArIFxyXG5cdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XCJjb2xvci5yZ2IgKj0gbGlnaHRXZWlnaHQ7IFwiICsgXHJcblx0XHRcdFx0XCJnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLnJnYiwgY29sb3IuYSAqIHVPcGFjaXR5KTsgXCIgKyBcclxuXHRcdFx0XCJ9XCJcclxuXHR9LFxyXG5cdFxyXG5cdFxyXG5cdHBob25nOiB7XHJcblx0XHR2ZXJ0ZXhTaGFkZXI6XHJcblx0XHRcdHN0cnVjdHMuTGlnaHQgKyBcclxuXHRcdFx0IFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzIgYVRleHR1cmVDb29yZDsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleFBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFwiYXR0cmlidXRlIGxvd3AgdmVjNCBhVmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMzIGFWZXJ0ZXhOb3JtYWw7IFwiICsgXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVNVk1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVQTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdU1vZGVsTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDMgdU5vcm1hbE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWM0IHVNYXRlcmlhbENvbG9yOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzMgdUFtYmllbnRMaWdodENvbG9yOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gYm9vbCB1VXNlTGlnaHRpbmc7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVJlY2VpdmVTaGFkb3c7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgaW50IHVVc2VkTGlnaHRzOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBMaWdodCB1TGlnaHRzWzhdOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZWZXJ0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIgKyAgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdkxpZ2h0V2VpZ2h0OyBcIiArXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdk5vcm1hbDsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMyB2UG9zaXRpb247IFwiICtcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2TGlnaHRQb3NpdGlvbls0XTsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0ZnVuY3Rpb25zLnNldExpZ2h0UG9zaXRpb24gK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICsgXHJcblx0XHRcdFx0XCJ2ZWM0IG1vZGVsVmlld1Bvc2l0aW9uID0gdU1WTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7IFwiICtcclxuXHRcdFx0XHRcImdsX1Bvc2l0aW9uID0gdVBNYXRyaXggKiBtb2RlbFZpZXdQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XHRcImlmICh1VXNlTGlnaHRpbmcpeyBcIiArIFxyXG5cdFx0XHRcdFx0XCJ2Tm9ybWFsID0gdU5vcm1hbE1hdHJpeCAqIGFWZXJ0ZXhOb3JtYWw7IFwiICtcclxuXHRcdFx0XHRcdFwidkxpZ2h0V2VpZ2h0ID0gdUFtYmllbnRMaWdodENvbG9yOyBcIiArXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFwiaW50IHNoYWRvd0luZGV4ID0gMDsgXCIgK1xyXG5cdFx0XHRcdFx0XCJmb3IgKGludCBpPTA7aTw4O2krKyl7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJpZiAoaSA+PSB1VXNlZExpZ2h0cykgYnJlYWs7IFwiICtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFwiaWYgKHVMaWdodHNbaV0uY2FzdFNoYWRvdyAmJiB1UmVjZWl2ZVNoYWRvdyl7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjNCBsaWdodFByb2ogPSB1TGlnaHRzW2ldLm12UHJvamVjdGlvbiAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApOyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJzZXRMaWdodFBvc2l0aW9uKHNoYWRvd0luZGV4KyssIGxpZ2h0UHJvaik7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XCJ9ZWxzZXsgXCIgK1xyXG5cdFx0XHRcdFx0XCJ2TGlnaHRXZWlnaHQgPSB2ZWMzKDEuMCk7IFwiICsgXHJcblx0XHRcdFx0XCJ9XCIgKyAgIFxyXG5cdFx0XHRcdCBcclxuXHRcdFx0XHRcInZQb3NpdGlvbiA9ICh1TW9kZWxNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHl6OyBcIiArXHJcblx0XHRcdFx0XCJ2VmVydGV4Q29sb3IgPSBhVmVydGV4Q29sb3IgKiB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwidlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7IFwiICsgIFxyXG5cdFx0XHRcIn0gXCIgLFxyXG5cdFx0XHRcclxuXHRcdGZyYWdtZW50U2hhZGVyOiBcclxuXHRcdFx0c3RydWN0cy5MaWdodCArIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVVzZUxpZ2h0aW5nOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVSZWNlaXZlU2hhZG93OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIGludCB1VXNlZExpZ2h0czsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gTGlnaHQgdUxpZ2h0c1s4XTsgXCIgK1xyXG5cdFx0ICAgIFwidW5pZm9ybSBzYW1wbGVyMkQgdVNoYWRvd01hcHNbOF07IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVIYXNUZXh0dXJlOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBzYW1wbGVyMkQgdVRleHR1cmVTYW1wbGVyOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gYm9vbCB1VXNlU3BlY3VsYXJNYXA7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIHNhbXBsZXIyRCB1U3BlY3VsYXJNYXBTYW1wbGVyOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbG93cCBmbG9hdCB1T3BhY2l0eTsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMyIHVUZXh0dXJlUmVwZWF0OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzIgdVRleHR1cmVPZmZzZXQ7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMyB1U3BlY3VsYXJDb2xvcjsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCBmbG9hdCB1U2hpbmluZXNzOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzQgdUdlb21ldHJ5VVY7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzMgdUNhbWVyYVBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdlZlcnRleENvbG9yOyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMzIHZMaWdodFdlaWdodDsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMyB2Tm9ybWFsOyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMzIHZQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZMaWdodFBvc2l0aW9uWzRdOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRmdW5jdGlvbnMuZ2V0TGlnaHRXZWlnaHQgKyBcclxuXHRcdFx0ZnVuY3Rpb25zLmNhbGNTaGFkb3dGYWN0b3IgKyBcclxuXHRcdFx0ZnVuY3Rpb25zLmdldExpZ2h0UG9zaXRpb24gK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjNCBjb2xvciA9IHZWZXJ0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWMzIG5vcm1hbCA9IG5vcm1hbGl6ZSh2Tm9ybWFsKTsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGNhbWVyYURpcmVjdGlvbiA9IG5vcm1hbGl6ZSh1Q2FtZXJhUG9zaXRpb24pOyBcIiArXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XCJtZWRpdW1wIGZsb2F0IHR4OyBcIiArXHJcblx0XHRcdFx0XCJtZWRpdW1wIGZsb2F0IHR5OyBcIiArXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XCJpZiAodUhhc1RleHR1cmUpeyBcIiArIFxyXG5cdFx0XHRcdFx0XCJ0eCA9IHVHZW9tZXRyeVVWLnggKyBtb2QodVRleHR1cmVPZmZzZXQueCArIHZUZXh0dXJlQ29vcmQucyAqIHVUZXh0dXJlUmVwZWF0LnggLSB1R2VvbWV0cnlVVi54LCB1R2VvbWV0cnlVVi56IC0gdUdlb21ldHJ5VVYueCk7XCIgK1xyXG5cdFx0XHRcdFx0XCJ0eSA9IHVHZW9tZXRyeVVWLnkgKyBtb2QodVRleHR1cmVPZmZzZXQueSArIHZUZXh0dXJlQ29vcmQudCAqIHVUZXh0dXJlUmVwZWF0LnkgLSB1R2VvbWV0cnlVVi55LCB1R2VvbWV0cnlVVi53IC0gdUdlb21ldHJ5VVYueSk7XCIgK1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjNCB0ZXhDb2xvciA9IHRleHR1cmUyRCh1VGV4dHVyZVNhbXBsZXIsIHZlYzIodHgsIHR5KSk7IFwiICtcclxuXHRcdFx0XHRcdFwiY29sb3IgKj0gdGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHRcIn0gXCIgKyBcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjMyBwaG9uZ0xpZ2h0V2VpZ2h0ID0gdmVjMygwLjApOyBcIiArIFxyXG5cdFx0XHRcdFwiaWYgKHVVc2VMaWdodGluZyl7IFwiICtcclxuXHRcdFx0XHRcdFwiaW50IHNoYWRvd0luZGV4ID0gMDsgXCIgK1xyXG5cdFx0XHRcdFx0XCJmb3IgKGludCBpPTA7aTw4O2krKyl7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJpZiAoaSA+PSB1VXNlZExpZ2h0cykgYnJlYWs7IFwiICtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFwiTGlnaHQgbCA9IHVMaWdodHNbaV07IFwiICtcclxuXHRcdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgbFBvcyA9IGwucG9zaXRpb24gLSB2UG9zaXRpb247XCIgK1xyXG5cdFx0XHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgbERpc3RhbmNlID0gbGVuZ3RoKGxQb3MpIC8gMi4wOyBcIiArXHJcblx0XHRcdFx0XHRcdFwiaWYgKGxlbmd0aChsLnBvc2l0aW9uKSA9PSAwLjApeyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJsRGlzdGFuY2UgPSAxLjA7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcImxQb3MgPSB2ZWMzKDAuMCk7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGxpZ2h0RGlyZWN0aW9uID0gbC5kaXJlY3Rpb24gKyBub3JtYWxpemUobFBvcyk7IFwiICtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFwibG93cCBmbG9hdCBzcG90V2VpZ2h0ID0gMS4wOyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgIFwiaWYgKGxlbmd0aChsLnNwb3REaXJlY3Rpb24pICE9IDAuMCl7IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgICAgIFwibG93cCBmbG9hdCBjb3NBbmdsZSA9IGRvdChsLnNwb3REaXJlY3Rpb24sIGxpZ2h0RGlyZWN0aW9uKTsgXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICBcdFwic3BvdFdlaWdodCA9IGNsYW1wKChjb3NBbmdsZSAtIGwub3V0ZXJBbmdsZSkgLyAobC5pbm5lckFuZ2xlIC0gbC5vdXRlckFuZ2xlKSwgMC4wLCAxLjApOyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgICAgICBcImxEaXN0YW5jZSA9IDEuMDsgXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICBcIn0gXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICBcclxuXHRcdFx0ICAgICAgICAgICAgXCJsb3dwIGZsb2F0IHNoYWRvd1dlaWdodCA9IDEuMDsgXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICBcIm1lZGl1bXAgdmVjMyBsV2VpZ2h0ID0gZ2V0TGlnaHRXZWlnaHQobm9ybWFsLCBsaWdodERpcmVjdGlvbiwgbC5jb2xvciwgbC5pbnRlbnNpdHkpOyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgIFxyXG5cdFx0XHQgICAgICAgICAgICBcImlmIChsLmNhc3RTaGFkb3cpeyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgIFx0XCJzaGFkb3dXZWlnaHQgPSBjYWxjU2hhZG93RmFjdG9yKHVTaGFkb3dNYXBzW2ldLCBnZXRMaWdodFBvc2l0aW9uKHNoYWRvd0luZGV4KyspLCBsLnNoYWRvd1N0cmVuZ3RoLCBsLmxpZ2h0TXVsdCk7IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgXCJ9IFwiICsgXHJcblx0XHRcdCAgICAgICAgICAgIFxyXG5cdFx0XHRcdFx0XHRcInBob25nTGlnaHRXZWlnaHQgKz0gc2hhZG93V2VpZ2h0ICogbFdlaWdodCAqIHNwb3RXZWlnaHQgLyBsRGlzdGFuY2U7IFwiICsgXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcImlmIChzaGFkb3dXZWlnaHQgPT0gMS4wKXsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwibG93cCBmbG9hdCBzaGluaW5lc3MgPSB1U2hpbmluZXNzOyBcIiArIFxyXG5cdFx0XHRcdFx0XHRcdFwiaWYgKHVVc2VTcGVjdWxhck1hcCl7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcdFwic2hpbmluZXNzID0gdGV4dHVyZTJEKHVTcGVjdWxhck1hcFNhbXBsZXIsIHZlYzIodHgsIHR5KSkuciAqIDI1NS4wOyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRcImlmIChzaGluaW5lc3MgPiAwLjAgJiYgc2hpbmluZXNzIDwgMjU1LjApeyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjMyBoYWxmQW5nbGUgPSBub3JtYWxpemUoY2FtZXJhRGlyZWN0aW9uICsgbGlnaHREaXJlY3Rpb24pOyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgc3BlY0RvdCA9IG1heChkb3QoaGFsZkFuZ2xlLCBub3JtYWwpLCAwLjApOyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XHRcImNvbG9yICs9IHZlYzQodVNwZWN1bGFyQ29sb3IsIDEuMCkgKiBwb3coc3BlY0RvdCwgc2hpbmluZXNzKTsgXCIgKyBcclxuXHRcdFx0XHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdFx0XHRcIn1cIiArIFxyXG5cdFx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwiY29sb3IucmdiICo9IHZMaWdodFdlaWdodCArIHBob25nTGlnaHRXZWlnaHQ7IFwiICsgXHJcblx0XHRcdFx0XCJnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLnJnYiwgY29sb3IuYSAqIHVPcGFjaXR5KTsgXCIgKyBcclxuXHRcdFx0XCJ9XCJcclxuXHR9LFxyXG5cdFxyXG5cdGRlcHRoTWFwOiB7XHJcblx0XHR2ZXJ0ZXhTaGFkZXI6IFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleFBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVNVlBNYXRyaXg7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdlZlcnRleERlcHRoOyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICsgXHJcblx0XHRcdFx0XCJnbF9Qb3NpdGlvbiA9IHVNVlBNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTsgXCIgK1xyXG5cdFx0XHRcdFwidlZlcnRleERlcHRoID0gZ2xfUG9zaXRpb247IFwiICtcclxuXHRcdFx0XCJ9IFwiLFxyXG5cdFx0XHRcclxuXHRcdGZyYWdtZW50U2hhZGVyOlxyXG5cdFx0XHRcInVuaWZvcm0gbG93cCBmbG9hdCB1RGVwdGhNdWx0OyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZWZXJ0ZXhEZXB0aDsgXCIgKyAgXHJcblx0XHRcdFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgK1xyXG5cdFx0XHRcdFwibG93cCBmbG9hdCBkZXB0aCA9IHVEZXB0aE11bHQgKiB2VmVydGV4RGVwdGgueiAvIHZWZXJ0ZXhEZXB0aC53OyBcIiArXHJcblx0XHRcdCAgICBcImRlcHRoID0gICgxLjAgLSBkZXB0aCkgKiAxNS4wOyBcIiArXHJcblx0XHRcdCAgICBcclxuXHRcdFx0ICAgIFwiaWYgKHVEZXB0aE11bHQgPT0gMS4wKSBcIiArXHJcblx0XHRcdCAgICBcdFwiZGVwdGggPSAxLjAgLSBkZXB0aDsgXCIgK1xyXG5cdFx0XHQgICAgXHJcblx0XHRcdCAgICBcImdsX0ZyYWdDb2xvciA9IHZlYzQoZGVwdGgsIGRlcHRoLCBkZXB0aCwgMS4wKTsgXCIgK1xyXG5cdFx0XHRcIn1cIlxyXG5cdH0sXHJcblx0XHJcblx0c2t5Ym94OiB7XHJcblx0XHR2ZXJ0ZXhTaGFkZXI6IFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleFBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVNVlBNYXRyaXg7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdlRleHR1cmVDb29yZDtcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgKyBcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjNCB2UG9zID0gdU1WUE1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApOyBcIiArXHJcblx0XHRcdFx0XCJnbF9Qb3NpdGlvbiA9IHZQb3MueHl3dzsgXCIgK1xyXG5cdFx0XHRcdFwidlRleHR1cmVDb29yZCA9IGFWZXJ0ZXhQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcIn0gXCIsXHJcblx0XHRcdFxyXG5cdFx0ZnJhZ21lbnRTaGFkZXI6XHJcblx0XHRcdFwidW5pZm9ybSBzYW1wbGVyQ3ViZSB1Q3ViZW1hcDsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMyB2VGV4dHVyZUNvb3JkO1wiICsgIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICtcclxuXHRcdFx0ICAgIFwiZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZUN1YmUodUN1YmVtYXAsIHZUZXh0dXJlQ29vcmQpOyBcIiArXHJcblx0XHRcdFwifVwiXHJcblx0fVxyXG59OyIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vS1RVdGlscycpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcblxyXG5mdW5jdGlvbiBUZXh0dXJlKHNyYywgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3R0ZXh0dXJlID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0dGhpcy5taW5GaWx0ZXIgPSAocGFyYW1zLm1pbkZpbHRlcik/IHBhcmFtcy5taW5GaWx0ZXIgOiBnbC5MSU5FQVI7XHJcblx0dGhpcy5tYWdGaWx0ZXIgPSAocGFyYW1zLm1hZ0ZpbHRlcik/IHBhcmFtcy5tYWdGaWx0ZXIgOiBnbC5MSU5FQVI7XHJcblx0dGhpcy53cmFwUyA9IChwYXJhbXMuU1dyYXBwaW5nKT8gcGFyYW1zLlNXcmFwcGluZyA6IGdsLlJFUEVBVDtcclxuXHR0aGlzLndyYXBUID0gKHBhcmFtcy5UV3JhcHBpbmcpPyBwYXJhbXMuVFdyYXBwaW5nIDogZ2wuUkVQRUFUO1xyXG5cdHRoaXMucmVwZWF0ID0gKHBhcmFtcy5yZXBlYXQpPyBwYXJhbXMucmVwZWF0IDogbmV3IFZlY3RvcjIoMS4wLCAxLjApO1xyXG5cdHRoaXMub2Zmc2V0ID0gKHBhcmFtcy5vZmZzZXQpPyBwYXJhbXMub2Zmc2V0IDogbmV3IFZlY3RvcjIoMC4wLCAwLjApO1xyXG5cdHRoaXMuZ2VuZXJhdGVNaXBtYXAgPSAocGFyYW1zLmdlbmVyYXRlTWlwbWFwKT8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IG51bGw7XHJcblx0XHJcblx0dmFyIGltZyA9IEtULmdldEltYWdlKHNyYyk7XHJcblx0aWYgKGltZyl7XHJcblx0XHR0aGlzLmltYWdlID0gaW1nO1xyXG5cdFx0dGhpcy5wYXJzZVRleHR1cmUoKTtcclxuXHR9ZWxzZXtcclxuXHRcdHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdHRoaXMuaW1hZ2Uuc3JjID0gc3JjO1xyXG5cdFx0dGhpcy5pbWFnZS5yZWFkeSA9IGZhbHNlO1xyXG5cdFx0XHJcblx0XHR2YXIgVCA9IHRoaXM7XHJcblx0XHRVdGlscy5hZGRFdmVudCh0aGlzLmltYWdlLCBcImxvYWRcIiwgZnVuY3Rpb24oKXtcclxuXHRcdFx0S1QuaW1hZ2VzLnB1c2goe3NyYzogc3JjLCBpbWc6IFQuaW1hZ2V9KTtcclxuXHRcdFx0VC5wYXJzZVRleHR1cmUoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlO1xyXG5cclxuVGV4dHVyZS5wcm90b3R5cGUucGFyc2VUZXh0dXJlID0gZnVuY3Rpb24oKXtcclxuXHRpZiAodGhpcy5pbWFnZS5yZWFkeSkgcmV0dXJuO1xyXG5cdFxyXG5cdHRoaXMuaW1hZ2UucmVhZHkgPSB0cnVlO1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuXHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUpO1xyXG5cdFxyXG5cdGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19GTElQX1lfV0VCR0wsIHRydWUpO1xyXG5cdFxyXG5cdGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgdGhpcy5pbWFnZSk7XHJcblx0XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIHRoaXMubWFnRmlsdGVyKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgdGhpcy5taW5GaWx0ZXIpO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIHRoaXMud3JhcFMpO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIHRoaXMud3JhcFQpO1xyXG5cdFxyXG5cdGlmICh0aGlzLmdlbmVyYXRlTWlwbWFwKVxyXG5cdFx0Z2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XHJcblx0XHJcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XHJcbn07XHJcblxyXG5UZXh0dXJlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIG5ldyBUZXh0dXJlKHRoaXMuaW1hZ2Uuc3JjLCB0aGlzLnBhcmFtcyk7XHJcbn07XHJcbiIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vS1RVdGlscycpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcblxyXG5mdW5jdGlvbiBUZXh0dXJlQ3ViZShwb3NYLCBuZWdYLCBwb3NZLCBuZWdZLCBwb3NaLCBuZWdaLCBwYXJhbXMpe1xyXG5cdHRoaXMuX19rdHRleHR1cmUgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHR0aGlzLm1pbkZpbHRlciA9IChwYXJhbXMubWluRmlsdGVyKT8gcGFyYW1zLm1pbkZpbHRlciA6IGdsLkxJTkVBUjtcclxuXHR0aGlzLm1hZ0ZpbHRlciA9IChwYXJhbXMubWFnRmlsdGVyKT8gcGFyYW1zLm1hZ0ZpbHRlciA6IGdsLkxJTkVBUjtcclxuXHR0aGlzLndyYXBTID0gKHBhcmFtcy5TV3JhcHBpbmcpPyBwYXJhbXMuU1dyYXBwaW5nIDogZ2wuQ0xBTVBfVE9fRURHRTtcclxuXHR0aGlzLndyYXBUID0gKHBhcmFtcy5UV3JhcHBpbmcpPyBwYXJhbXMuVFdyYXBwaW5nIDogZ2wuQ0xBTVBfVE9fRURHRTtcdFxyXG5cdHRoaXMuZ2VuZXJhdGVNaXBtYXAgPSAocGFyYW1zLmdlbmVyYXRlTWlwbWFwKT8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFxyXG5cdHRoaXMuaW1hZ2VzID0gW107XHJcblx0dGhpcy50ZXh0dXJlID0gbnVsbDtcclxuXHRcclxuXHR0aGlzLmltYWdlc1swXSA9IHRoaXMubG9hZEltYWdlKHBvc1gpO1xyXG5cdHRoaXMuaW1hZ2VzWzFdID0gdGhpcy5sb2FkSW1hZ2UobmVnWCk7XHJcblx0dGhpcy5pbWFnZXNbMl0gPSB0aGlzLmxvYWRJbWFnZShwb3NZKTtcclxuXHR0aGlzLmltYWdlc1szXSA9IHRoaXMubG9hZEltYWdlKG5lZ1kpO1xyXG5cdHRoaXMuaW1hZ2VzWzRdID0gdGhpcy5sb2FkSW1hZ2UocG9zWik7XHJcblx0dGhpcy5pbWFnZXNbNV0gPSB0aGlzLmxvYWRJbWFnZShuZWdaKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlQ3ViZTtcclxuXHJcblRleHR1cmVDdWJlLnByb3RvdHlwZS5sb2FkSW1hZ2UgPSBmdW5jdGlvbihzcmMpe1xyXG5cdHZhciBpbWcgPSBLVC5nZXRJbWFnZShzcmMpO1xyXG5cdHZhciBpbWFnZTtcclxuXHRpZiAoaW1nKXtcclxuXHRcdGltYWdlID0gaW1nO1xyXG5cdFx0cGFyc2VUZXh0dXJlKCk7XHJcblx0fWVsc2V7XHJcblx0XHRpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0aW1hZ2Uuc3JjID0gc3JjO1xyXG5cdFx0aW1hZ2UucmVhZHkgPSBmYWxzZTtcclxuXHRcdFxyXG5cdFx0dmFyIFQgPSB0aGlzO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoaW1hZ2UsIFwibG9hZFwiLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRpbWFnZS5yZWFkeSA9IHRydWU7XHJcblx0XHRcdEtULmltYWdlcy5wdXNoKHtzcmM6IHNyYywgaW1nOiBpbWFnZX0pO1xyXG5cdFx0XHRULnBhcnNlVGV4dHVyZSgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiBpbWFnZTtcclxufTtcclxuXHJcblRleHR1cmVDdWJlLnByb3RvdHlwZS5wYXJzZVRleHR1cmUgPSBmdW5jdGlvbigpe1xyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy5pbWFnZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHRpZiAoIXRoaXMuaW1hZ2VzW2ldLnJlYWR5KVxyXG5cdFx0XHRyZXR1cm47XHJcblx0fVxyXG5cdFxyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciB0eXBlcyA9IFtnbC5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1gsIGdsLlRFWFRVUkVfQ1VCRV9NQVBfTkVHQVRJVkVfWCxcclxuXHRcdFx0XHQgZ2wuVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9ZLCBnbC5URVhUVVJFX0NVQkVfTUFQX05FR0FUSVZFX1ksXHJcblx0XHRcdFx0IGdsLlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWiwgZ2wuVEVYVFVSRV9DVUJFX01BUF9ORUdBVElWRV9aXTtcclxuXHRcclxuXHRcclxuXHR0aGlzLnRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGhpcy50ZXh0dXJlKTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTw2O2krKyl7XHJcblx0XHRnbC50ZXhJbWFnZTJEKHR5cGVzW2ldLCAwLCBnbC5SR0IsIGdsLlJHQiwgZ2wuVU5TSUdORURfQllURSwgdGhpcy5pbWFnZXNbaV0pO1xyXG5cdH1cclxuXHRcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgdGhpcy5tYWdGaWx0ZXIpO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCB0aGlzLm1pbkZpbHRlcik7XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfUywgdGhpcy53cmFwUyk7XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfVCwgdGhpcy53cmFwVCk7XHJcblx0XHJcblx0aWYgKHRoaXMuZ2VuZXJhdGVNaXBtYXApXHJcblx0XHRnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFX0NVQkVfTUFQKTtcclxuXHRcclxuXHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCBudWxsKTtcclxufTtcclxuIiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxudmFyIFZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG5cclxuZnVuY3Rpb24gVGV4dHVyZUZyYW1lYnVmZmVyKHdpZHRoLCBoZWlnaHQsIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0dGV4dHVyZWZyYW1lYnVmZmVyID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHR0aGlzLndpZHRoID0gd2lkdGg7XHJcblx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cdHRoaXMubWluRmlsdGVyID0gKHBhcmFtcy5taW5GaWx0ZXIpPyBwYXJhbXMubWluRmlsdGVyIDogZ2wuTElORUFSO1xyXG5cdHRoaXMubWFnRmlsdGVyID0gKHBhcmFtcy5tYWdGaWx0ZXIpPyBwYXJhbXMubWFnRmlsdGVyIDogZ2wuTElORUFSO1xyXG5cdHRoaXMud3JhcFMgPSAocGFyYW1zLlNXcmFwcGluZyk/IHBhcmFtcy5TV3JhcHBpbmcgOiBnbC5DTEFNUF9UT19FREdFO1xyXG5cdHRoaXMud3JhcFQgPSAocGFyYW1zLlRXcmFwcGluZyk/IHBhcmFtcy5UV3JhcHBpbmcgOiBnbC5DTEFNUF9UT19FREdFO1xyXG5cdHRoaXMucmVwZWF0ID0gKHBhcmFtcy5yZXBlYXQpPyBwYXJhbXMucmVwZWF0IDogbmV3IFZlY3RvcjIoMS4wLCAxLjApO1xyXG5cdHRoaXMub2Zmc2V0ID0gKHBhcmFtcy5vZmZzZXQpPyBwYXJhbXMub2Zmc2V0IDogbmV3IFZlY3RvcjIoMC4wLCAwLjApO1xyXG5cdHRoaXMuZ2VuZXJhdGVNaXBtYXAgPSAocGFyYW1zLmdlbmVyYXRlTWlwbWFwKT8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFxyXG5cdHRoaXMuZnJhbWVidWZmZXIgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xyXG5cdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgdGhpcy5mcmFtZWJ1ZmZlcik7XHJcblx0dGhpcy5mcmFtZWJ1ZmZlci53aWR0aCA9IHdpZHRoO1xyXG5cdHRoaXMuZnJhbWVidWZmZXIuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuXHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUpO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCB0aGlzLm1hZ0ZpbHRlcik7XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIHRoaXMubWluRmlsdGVyKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCB0aGlzLndyYXBTKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCB0aGlzLndyYXBUKTtcclxuXHRcclxuXHRpZiAodGhpcy5nZW5lcmF0ZU1pcG1hcClcclxuXHRcdGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xyXG5cdFx0XHJcblx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCB3aWR0aCwgaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBudWxsKTtcclxuXHRcclxuXHRcclxuXHR0aGlzLnJlbmRlckJ1ZmZlciA9IGdsLmNyZWF0ZVJlbmRlcmJ1ZmZlcigpO1xyXG5cdGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCB0aGlzLnJlbmRlckJ1ZmZlcik7XHJcblx0Z2wucmVuZGVyYnVmZmVyU3RvcmFnZShnbC5SRU5ERVJCVUZGRVIsIGdsLkRFUFRIX0NPTVBPTkVOVDE2LCB3aWR0aCwgaGVpZ2h0KTtcclxuXHRcclxuXHRnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSwgMCk7XHJcblx0Z2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGdsLkRFUFRIX0FUVEFDSE1FTlQsIGdsLlJFTkRFUkJVRkZFUiwgdGhpcy5yZW5kZXJCdWZmZXIpO1xyXG5cdFxyXG5cdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XHJcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XHJcblx0Z2wuYmluZFJlbmRlcmJ1ZmZlcihnbC5SRU5ERVJCVUZGRVIsIG51bGwpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHR1cmVGcmFtZWJ1ZmZlcjsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRnZXQ6IGZ1bmN0aW9uKGVsZW1lbnQpe1xyXG5cdFx0aWYgKGVsZW1lbnQuY2hhckF0KDApID09IFwiI1wiKXtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQucmVwbGFjZShcIiNcIiwgXCJcIikpO1xyXG5cdFx0fWVsc2UgaWYgKGVsZW1lbnQuY2hhckF0KDApID09IFwiLlwiKXtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoZWxlbWVudC5yZXBsYWNlKFwiLlwiLCBcIlwiKSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKGVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0YWRkRXZlbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIHR5cGUsIGNhbGxiYWNrKXtcclxuXHRcdGlmIChlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIpe1xyXG5cdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIGZhbHNlKTtcclxuXHRcdH1lbHNlIGlmIChlbGVtZW50LmF0dGFjaEV2ZW50KXtcclxuXHRcdFx0ZWxlbWVudC5hdHRhY2hFdmVudChcIm9uXCIgKyB0eXBlLCBjYWxsYmFjayk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRnZXRIdHRwOiBmdW5jdGlvbigpe1xyXG5cdFx0aWYgKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCl7XHJcblx0XHRcdHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdH1lbHNlIGlmICh3aW5kb3cuQWN0aXZlWE9iamVjdCl7XHJcblx0XHRcdGh0dHAgPSBuZXcgd2luZG93LkFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MSFRUUFwiKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fSxcclxuXHRcclxuXHRnZXRGaWxlQ29udGVudDogZnVuY3Rpb24oZmlsZVVSTCwgY2FsbGJhY2spe1xyXG5cdFx0dmFyIGh0dHAgPSB0aGlzLmdldEh0dHAoKTtcclxuXHRcdGh0dHAub3BlbignR0VUJywgZmlsZVVSTCwgdHJ1ZSk7XHJcblx0XHRodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG5cdCAgXHRcdGlmIChodHRwLnJlYWR5U3RhdGUgPT0gNCAmJiBodHRwLnN0YXR1cyA9PSAyMDApIHtcclxuXHRcdFx0XHRpZiAoY2FsbGJhY2spe1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soaHR0cC5yZXNwb25zZVRleHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdGh0dHAuc2VuZCgpO1xyXG5cdH1cclxufTtcclxuIiwiZnVuY3Rpb24gVmVjdG9yMih4LCB5KXtcclxuXHR0aGlzLl9fa3R2MiA9IHRydWU7XHJcblx0XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBWZWN0b3IyO1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XHJcblx0XHJcblx0cmV0dXJuIGxlbmd0aDtcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoKCk7XHJcblx0XHJcblx0dGhpcy54IC89IGxlbmd0aDtcclxuXHR0aGlzLnkgLz0gbGVuZ3RoO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24odmVjdG9yMil7XHJcblx0aWYgKCF2ZWN0b3IyLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBwZXJmb3JtIGEgZG90IHByb2R1Y3Qgd2l0aCBhIHZlY3RvcjJcIjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcy54ICogdmVjdG9yMi54ICsgdGhpcy55ICogdmVjdG9yMi55O1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuaW52ZXJ0ID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gdGhpcy5tdWx0aXBseSgtMSk7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uKG51bWJlcil7XHJcblx0dGhpcy54ICo9IG51bWJlcjtcclxuXHR0aGlzLnkgKj0gbnVtYmVyO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odmVjdG9yMil7XHJcblx0aWYgKCF2ZWN0b3IyLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBhZGQgYSB2ZWN0b3IyIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ICs9IHZlY3RvcjIueDtcclxuXHR0aGlzLnkgKz0gdmVjdG9yMi55O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKHZlY3RvcjIpe1xyXG5cdGlmICghdmVjdG9yMi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIHZlY3RvcjIgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHR0aGlzLnggPSB2ZWN0b3IyLng7XHJcblx0dGhpcy55ID0gdmVjdG9yMi55O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSl7XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiBuZXcgVmVjdG9yMih0aGlzLngsIHRoaXMueSk7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbih2ZWN0b3IyKXtcclxuXHRpZiAoIXZlY3RvcjIuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSB2ZWN0b3IyIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0cmV0dXJuICh0aGlzLnggPT0gdmVjdG9yMi54ICYmIHRoaXMueSA9PSB2ZWN0b3IyLnkpO1xyXG59O1xyXG5cclxuVmVjdG9yMi52ZWN0b3JzRGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHZlY3RvcjJfYSwgdmVjdG9yMl9iKXtcclxuXHRpZiAoIXZlY3RvcjJfYS5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczJcIjtcclxuXHRpZiAoIXZlY3RvcjJfYi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczJcIjtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjIodmVjdG9yMl9hLnggLSB2ZWN0b3IyX2IueCwgdmVjdG9yMl9hLnkgLSB2ZWN0b3IyX2IueSk7XHJcbn07XHJcblxyXG5WZWN0b3IyLmZyb21BbmdsZSA9IGZ1bmN0aW9uKHJhZGlhbil7XHJcblx0dmFyIHggPSBNYXRoLmNvcyhyYWRpYW4pO1xyXG5cdHZhciB5ID0gLU1hdGguc2luKHJhZGlhbik7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IyKHgsIHkpO1xyXG59O1xyXG4iLCJmdW5jdGlvbiBWZWN0b3IzKHgsIHksIHope1xyXG5cdHRoaXMuX19rdHYzID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnggPSB4O1xyXG5cdHRoaXMueSA9IHk7XHJcblx0dGhpcy56ID0gejtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yMztcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkgKyB0aGlzLnogKiB0aGlzLnopO1xyXG5cdFxyXG5cdHJldHVybiBsZW5ndGg7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMueCAvPSBsZW5ndGg7XHJcblx0dGhpcy55IC89IGxlbmd0aDtcclxuXHR0aGlzLnogLz0gbGVuZ3RoO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBwZXJmb3JtIGEgZG90IHByb2R1Y3Qgd2l0aCBhIHZlY3RvcjNcIjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcy54ICogdmVjdG9yMy54ICsgdGhpcy55ICogdmVjdG9yMy55ICsgdGhpcy56ICogdmVjdG9yMy56O1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IHBlcmZvcm0gYSBjcm9zcyBwcm9kdWN0IHdpdGggYSB2ZWN0b3IzXCI7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IzKFxyXG5cdFx0dGhpcy55ICogdmVjdG9yMy56IC0gdGhpcy56ICogdmVjdG9yMy55LFxyXG5cdFx0dGhpcy56ICogdmVjdG9yMy54IC0gdGhpcy54ICogdmVjdG9yMy56LFxyXG5cdFx0dGhpcy54ICogdmVjdG9yMy55IC0gdGhpcy55ICogdmVjdG9yMy54XHJcblx0KTtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihudW1iZXIpe1xyXG5cdHRoaXMueCAqPSBudW1iZXI7XHJcblx0dGhpcy55ICo9IG51bWJlcjtcclxuXHR0aGlzLnogKj0gbnVtYmVyO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBhZGQgYSBWZWN0b3IzIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ICs9IHZlY3RvcjMueDtcclxuXHR0aGlzLnkgKz0gdmVjdG9yMy55O1xyXG5cdHRoaXMueiArPSB2ZWN0b3IzLno7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgVmVjdG9yMyB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCA9IHZlY3RvcjMueDtcclxuXHR0aGlzLnkgPSB2ZWN0b3IzLnk7XHJcblx0dGhpcy56ID0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSwgeil7XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMueCwgdGhpcy55LCB0aGlzLnopO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgVmVjdG9yMyB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHJldHVybiAodGhpcy54ID09IHZlY3RvcjMueCAmJiB0aGlzLnkgPT0gdmVjdG9yMy55ICYmIHRoaXMueiA9PSB2ZWN0b3IzLnopO1xyXG59O1xyXG5cclxuVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHZlY3RvcjNfYSwgdmVjdG9yM19iKXtcclxuXHRpZiAoIXZlY3RvcjNfYS5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczNcIjtcclxuXHRpZiAoIXZlY3RvcjNfYi5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczNcIjtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjModmVjdG9yM19hLnggLSB2ZWN0b3IzX2IueCwgdmVjdG9yM19hLnkgLSB2ZWN0b3IzX2IueSwgdmVjdG9yM19hLnogLSB2ZWN0b3IzX2Iueik7XHJcbn07XHJcblxyXG5WZWN0b3IzLmZyb21BbmdsZSA9IGZ1bmN0aW9uKHJhZGlhbl94eiwgcmFkaWFuX3kpe1xyXG5cdHZhciB4ID0gTWF0aC5jb3MocmFkaWFuX3h6KTtcclxuXHR2YXIgeSA9IE1hdGguc2luKHJhZGlhbl95KTtcclxuXHR2YXIgeiA9IC1NYXRoLnNpbihyYWRpYW5feHopO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMyh4LCB5LCB6KTtcclxufTtcclxuIiwiZnVuY3Rpb24gVmVjdG9yNCh4LCB5LCB6LCB3KXtcclxuXHR0aGlzLl9fa3R2NCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcblx0dGhpcy53ID0gdztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yNDtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkgKyB0aGlzLnogKiB0aGlzLnogKyB0aGlzLncgKiB0aGlzLncpO1xyXG5cdFxyXG5cdHJldHVybiBsZW5ndGg7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMueCAvPSBsZW5ndGg7XHJcblx0dGhpcy55IC89IGxlbmd0aDtcclxuXHR0aGlzLnogLz0gbGVuZ3RoO1xyXG5cdHRoaXMudyAvPSBsZW5ndGg7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbih2ZWN0b3I0KXtcclxuXHRpZiAoIXZlY3RvcjQuX19rdHY0KSB0aHJvdyBcIkNhbiBvbmx5IHBlcmZvcm0gYSBkb3QgcHJvZHVjdCB3aXRoIGEgdmVjdG9yNFwiO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzLnggKiB2ZWN0b3I0LnggKyB0aGlzLnkgKiB2ZWN0b3I0LnkgKyB0aGlzLnogKiB2ZWN0b3I0LnogKyB0aGlzLncgKiB2ZWN0b3I0Lnc7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24obnVtYmVyKXtcclxuXHR0aGlzLnggKj0gbnVtYmVyO1xyXG5cdHRoaXMueSAqPSBudW1iZXI7XHJcblx0dGhpcy56ICo9IG51bWJlcjtcclxuXHR0aGlzLncgKj0gbnVtYmVyO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yNC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odmVjdG9yNCl7XHJcblx0aWYgKCF2ZWN0b3I0Ll9fa3R2NCkgdGhyb3cgXCJDYW4gb25seSBhZGQgYSB2ZWN0b3I0IHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ICs9IHZlY3RvcjQueDtcclxuXHR0aGlzLnkgKz0gdmVjdG9yNC55O1xyXG5cdHRoaXMueiArPSB2ZWN0b3I0Lno7XHJcblx0dGhpcy53ICs9IHZlY3RvcjQudztcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbih2ZWN0b3I0KXtcclxuXHRpZiAoIXZlY3RvcjQuX19rdHY0KSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSB2ZWN0b3I0IHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ID0gdmVjdG9yNC54O1xyXG5cdHRoaXMueSA9IHZlY3RvcjQueTtcclxuXHR0aGlzLnogPSB2ZWN0b3I0Lno7XHJcblx0dGhpcy53ID0gdmVjdG9yNC53O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yNC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSwgeiwgdyl7XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcblx0dGhpcy53ID0gdztcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gbmV3IHZlY3RvcjQodGhpcy54LCB0aGlzLnksIHRoaXMueiwgdGhpcy53KTtcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKHZlY3RvcjQpe1xyXG5cdGlmICghdmVjdG9yNC5fX2t0djQpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIHZlY3RvcjQgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHRyZXR1cm4gKHRoaXMueCA9PSB2ZWN0b3I0LnggJiYgdGhpcy55ID09IHZlY3RvcjQueSAmJiB0aGlzLnogPT0gdmVjdG9yNC56ICYmIHRoaXMudyA9PSB2ZWN0b3I0LncpO1xyXG59O1xyXG5cclxuVmVjdG9yNC52ZWN0b3JzRGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHZlY3RvcjRfYSwgdmVjdG9yNF9iKXtcclxuXHRpZiAoIXZlY3RvcjRfYS5fX2t0djQpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczRcIjtcclxuXHRpZiAoIXZlY3RvcjRfYi5fX2t0djQpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczRcIjtcclxuXHRcclxuXHRyZXR1cm4gbmV3IHZlY3RvcjQodmVjdG9yNF9hLnggLSB2ZWN0b3I0X2IueCwgdmVjdG9yNF9hLnkgLSB2ZWN0b3I0X2IueSwgdmVjdG9yNF9hLnogLSB2ZWN0b3I0X2IueiwgdmVjdHByNF9hLncgLSB2ZWN0b3I0X2Iudyk7XHJcbn07IiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxuS1QuQ2FtZXJhRmx5ID0gcmVxdWlyZSgnLi9LVENhbWVyYUZseScpO1xyXG5LVC5DYW1lcmFPcnRobyA9IHJlcXVpcmUoJy4vS1RDYW1lcmFPcnRobycpO1xyXG5LVC5DYW1lcmFQZXJzcGVjdGl2ZSA9IHJlcXVpcmUoJy4vS1RDYW1lcmFQZXJzcGVjdGl2ZScpO1xyXG5LVC5Db2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG5LVC5HZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG5LVC5HZW9tZXRyeTNETW9kZWwgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnkzRE1vZGVsJyk7XHJcbktULkdlb21ldHJ5Qm94ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Qm94Jyk7XHJcbktULkdlb21ldHJ5Q3lsaW5kZXIgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnlDeWxpbmRlcicpO1xyXG5LVC5HZW9tZXRyeVBsYW5lID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5UGxhbmUnKTtcclxuS1QuR2VvbWV0cnlTa3lib3ggPSByZXF1aXJlKCcuL0tUR2VvbWV0cnlTa3lib3gnKTtcclxuS1QuR2VvbWV0cnlTcGhlcmUgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnlTcGhlcmUnKTtcclxuS1QuR2VvbWV0cnlHVUlUZXh0dXJlID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5R1VJVGV4dHVyZScpO1xyXG5LVC5MaWdodERpcmVjdGlvbmFsID0gcmVxdWlyZSgnLi9LVExpZ2h0RGlyZWN0aW9uYWwnKTtcclxuS1QuTGlnaHRQb2ludCA9IHJlcXVpcmUoJy4vS1RMaWdodFBvaW50Jyk7XHJcbktULkxpZ2h0U3BvdCA9IHJlcXVpcmUoJy4vS1RMaWdodFNwb3QnKTtcclxuS1QuSW5wdXQgPSByZXF1aXJlKCcuL0tUSW5wdXQnKTtcclxuS1QuTWF0ZXJpYWwgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWwnKTtcclxuS1QuTWF0ZXJpYWxCYXNpYyA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbEJhc2ljJyk7XHJcbktULk1hdGVyaWFsTGFtYmVydCA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbExhbWJlcnQnKTtcclxuS1QuTWF0ZXJpYWxQaG9uZyA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbFBob25nJyk7XHJcbktULk1hdGggPSByZXF1aXJlKCcuL0tUTWF0aCcpO1xyXG5LVC5NYXRyaXgzID0gcmVxdWlyZSgnLi9LVE1hdHJpeDMnKTtcclxuS1QuTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcbktULk1lc2ggPSByZXF1aXJlKCcuL0tUTWVzaCcpO1xyXG5LVC5NZXNoU3ByaXRlID0gcmVxdWlyZSgnLi9LVE1lc2hTcHJpdGUnKTtcclxuS1QuT3JiaXRBbmRQYW4gPSByZXF1aXJlKCcuL0tUT3JiaXRBbmRQYW4nKTtcclxuS1QuVGV4dHVyZSA9IHJlcXVpcmUoJy4vS1RUZXh0dXJlJyk7XHJcbktULlRleHR1cmVDdWJlID0gcmVxdWlyZSgnLi9LVFRleHR1cmVDdWJlJyk7XHJcbktULlRleHR1cmVGcmFtZWJ1ZmZlciA9IHJlcXVpcmUoJy4vS1RUZXh0dXJlRnJhbWVidWZmZXInKTtcclxuS1QuVXRpbHMgPSByZXF1aXJlKCcuL0tUVXRpbHMnKTtcclxuS1QuVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcbktULlZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG5LVC5WZWN0b3I0ID0gcmVxdWlyZSgnLi9LVFZlY3RvcjQnKTtcclxuS1QuU2NlbmUgPSByZXF1aXJlKCcuL0tUU2NlbmUnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS1Q7Iiwid2luZG93LktUID0gcmVxdWlyZSgnLi9LcmFtVGVjaCcpOyJdfQ==
