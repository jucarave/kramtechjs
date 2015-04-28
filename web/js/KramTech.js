(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraOrtho.js":[function(require,module,exports){
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
	
	this.skybox = new GeometrySkybox(100, 100, 100, this.position);
	
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

CameraPerspective.prototype.setSkybox = function(width, height, length, textures){
	this.skybox = new GeometrySkybox(width, height, length, this.position, textures);
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
	
	var zoom = Vector3.vectorsDifference(this.position, cameraControls.target).length();
	
	this.controls = cameraControls;
	
	cameraControls.camera = this;
	cameraControls.zoom = zoom;
	cameraControls.angle.x = KTMath.get2DAngle(cameraControls.target.x, cameraControls.target.z,this.position.x, this.position.z);
	cameraControls.angle.y = KTMath.get2DAngle(0, this.position.y, zoom, cameraControls.target.y);
	
	cameraControls.setCameraPosition();
	
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
},{}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGUITexture.js":[function(require,module,exports){
var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Vector4 = require('./KTVector4');

function GUITexture(width, height, params){
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

module.exports = GUITexture;
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTVector4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js":[function(require,module,exports){
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
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTVector4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryPlane.js":[function(require,module,exports){
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
var MaterialBasic = require('./KTMaterialBasic');
var Mesh = require('./KTMesh');
var GeometryPlane = require('./KTGeometryPlane');
var KT = require('./KTMain');

function GeometrySkybox(width, height, length, position, textures){
	this.meshes = [];
	if (!textures) textures = [];
	
	var w = width / 2;
	var l = length / 2;
	var h = height / 2;
	var v = 1.0;
	
	var xr = 0.0;
	var yr = 0.0;
	var hr = 1.0;
	var vr = 1.0;
	
	var ct = Color._WHITE;
	var cb = Color._WHITE;
	
	var geo = new Geometry();
	var mat = new MaterialBasic(textures[KT.TEXTURE_FRONT], Color._WHITE);
	geo.addVertice(-w -v, -h -v,  l, cb, hr, yr);
	geo.addVertice( w +v,  h +v,  l, ct, xr, vr);
	geo.addVertice( w +v, -h -v,  l, cb, xr, yr);
	geo.addVertice(-w -v,  h +v,  l, ct, hr, vr);
	geo.addFace(0, 1, 2);
	geo.addFace(0, 3, 1);
	geo.build();
	this.meshes.push(new Mesh(geo, mat));
	
	var geo = new Geometry();
	var mat = new MaterialBasic(textures[KT.TEXTURE_BACK], Color._WHITE);
	geo.addVertice(-w -v, -h -v, -l, cb, xr, yr);
	geo.addVertice(-w -v,  h +v, -l, ct, xr, vr);
	geo.addVertice( w +v, -h -v, -l, cb, hr, yr);
	geo.addVertice( w +v,  h +v, -l, ct, hr, vr);
	geo.addFace(0, 2, 1);
	geo.addFace(2, 3, 1);
	geo.build();
	this.meshes.push(new Mesh(geo, mat));
	
	var geo = new Geometry();
	var mat = new MaterialBasic(textures[KT.TEXTURE_RIGHT], Color._WHITE);
	geo.addVertice( w, -h -v,  l +v, cb, hr, yr);
	geo.addVertice( w,  h +v, -l -v, ct, xr, vr);
	geo.addVertice( w, -h -v, -l -v, cb, xr, yr);
	geo.addVertice( w,  h +v,  l +v, ct, hr, vr);
	geo.addFace(0, 1, 2);
	geo.addFace(0, 3, 1);
	geo.build();
	this.meshes.push(new Mesh(geo, mat));
	
	var geo = new Geometry();
	var mat = new MaterialBasic(textures[KT.TEXTURE_LEFT], Color._WHITE);
	geo.addVertice(-w, -h -v, -l -v, cb, hr, yr);
	geo.addVertice(-w,  h +v, -l -v, ct, hr, vr);
	geo.addVertice(-w, -h -v,  l +v, cb, xr, yr);
	geo.addVertice(-w,  h +v,  l +v, ct, xr, vr);
	geo.addFace(0, 1, 2);
	geo.addFace(1, 3, 2);
	geo.build();
	this.meshes.push(new Mesh(geo, mat));
	
	var geo = new Geometry();
	var mat = new MaterialBasic(textures[KT.TEXTURE_UP], Color._WHITE);
	geo.addVertice( w +v,  h, -l -v, ct, hr, yr);
	geo.addVertice(-w -v,  h,  l +v, ct, xr, vr);
	geo.addVertice(-w -v,  h, -l -v, ct, xr, yr);
	geo.addVertice( w +v,  h,  l +v, ct, hr, vr);
	geo.addFace(0, 1, 2);
	geo.addFace(0, 3, 1);
	geo.build();
	this.meshes.push(new Mesh(geo, mat));
	
	var geo = new Geometry();
	var mat = new MaterialBasic(textures[KT.TEXTURE_DOWN], Color._WHITE);
	mat.drawFaces = 'BOTH';
	geo.addVertice( w +v, -h, -l -v, cb, hr, vr);
	geo.addVertice(-w -v, -h,  l +v, cb, xr, yr);
	geo.addVertice(-w -v, -h, -l -v, cb, xr, vr);
	geo.addVertice( w +v, -h,  l +v, cb, hr, yr);
	geo.addFace(0, 2, 1);
	geo.addFace(0, 1, 3);
	geo.computeFacesNormals();
	geo.build();
	this.meshes.push(new Mesh(geo, mat));
	
	
	for (var i=0;i<6;i++){
		this.meshes[i].position = position;
	}
}

module.exports = GeometrySkybox;
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTGeometryPlane":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryPlane.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMaterialBasic":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialBasic.js","./KTMesh":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMesh.js","./KTVector4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometrySphere.js":[function(require,module,exports){
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
	
	handleMouseDown: function(ev){
		if (window.event) ev = window.event;
		
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
		if (window.event) ev = window.event;
		
		var elX = ev.clientX - ev.target.offsetLeft;
		var elY = ev.clientY - ev.target.offsetTop;
		
		Input._mouse.position.set(elX, elY);
	},
	
	init: function(canvas){
		Utils.addEvent(document, 'keydown', Input.handleKeyDown);
		Utils.addEvent(document, 'keyup', Input.handleKeyUp);
		Utils.addEvent(canvas, 'mousedown', Input.handleMouseDown);
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

function DirectionalLight(direction, color, intensity){
	this.__ktdirLight = true;
	
	this.direction = direction.normalize();
	this.direction.multiply(-1);
	
	this.color = new Color((color)? color: Color._WHITE);
	this.intensity = (intensity !== undefined)? intensity : 1.0;
}

module.exports = DirectionalLight;


},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightPoint.js":[function(require,module,exports){
var Color = require('./KTColor');

function LightPoint(position, intensity, distance, color){
	this.__ktpointlight = true;
	
	this.position = position;
	this.intensity = (intensity)? intensity : 1.0;
	this.distance = (distance)? distance : 1.0;
	this.color = new Color((color)? color : Color._WHITE);
}

module.exports = LightPoint;
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js":[function(require,module,exports){
var Shaders = require('./KTShaders');
var Input = require('./KTInput');

module.exports = {
	TEXTURE_FRONT: 0,
	TEXTURE_BACK: 1,
	TEXTURE_RIGHT: 2,
	TEXTURE_LEFT: 3,
	TEXTURE_UP: 4,
	TEXTURE_DOWN: 5,
	
	init: function(canvas){
		this.canvas = canvas;
		this.gl = null;
		this.shaders = {};
		this.images = [];
		this.maxAttribLocations = 0;
		this.lastProgram = null;
		
		this.__initContext(canvas);
		this.__initProperties();
		this.__initShaders();
		
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
				if (uniforms.indexOf(name) == -1)
					uniforms.push({name: name});
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
				if (uniforms.indexOf(name) == -1)
					uniforms.push({name: name});
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
				
				uniforms.push({
					multi: true,
					data: structUni,
					type: type
				});
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
		
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
			console.error("Error initializing the shader program");
			throw gl.getShaderInfoLog(shaderProgram);
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
					location: location
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



},{"./KTInput":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTInput.js","./KTShaders":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTShaders.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js":[function(require,module,exports){
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
	
	return this;
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
	
	return this;
};

},{"./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialLambert.js":[function(require,module,exports){
var Material = require('./KTMaterial');

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

MaterialLambert.prototype.sendLightUniformData = function(light, uniform){
	var gl = KT.gl;
	for (var i=0,len=uniform.data.length;i<len;i++){
		var dat = uniform.data[i];
		
		if (dat.name == 'position' && light.__ktpointlight){
			gl.uniform3f(dat.location, light.position.x, light.position.y, light.position.z);
		}else if (dat.name == 'direction' && light.__ktdirLight){
			gl.uniform3f(dat.location, light.direction.x, light.direction.y, light.direction.z);
		}else if (dat.name == 'color'){
			var color = light.color.getRGB();
			gl.uniform3f(dat.location, color[0], color[1], color[2]);
		}else if (dat.name == 'intensity'){
			gl.uniform1f(dat.location, light.intensity);
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
	for (var i=0,len=uniforms.length;i<len;i++){
		var uni = uniforms[i];
		
		if (uni.multi && uni.type == 'Light'){
			if (lightsCount == uni.data.length)
				continue;
				
			var lights = scene.lights;
			for (var j=0,jlen=lights.length;j<jlen;j++){
				this.sendLightUniformData(lights[j], uni.data[lightsCount++]);
			}
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
		}else if (uni.name == 'usedLights'){
			usedLightUniform = uni;
		}
	}
	
	if (usedLightUniform){
		gl.uniform1i(usedLightUniform.location, lightsCount);
	}
	
	return this;
};
},{"./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialPhong.js":[function(require,module,exports){
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

MaterialPhong.prototype.sendLightUniformData = function(light, uniform){
	var gl = KT.gl;
	for (var i=0,len=uniform.data.length;i<len;i++){
		var dat = uniform.data[i];
		
		if (dat.name == 'position'){
			if (light.__ktpointlight){
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
		}else if (dat.name == 'color'){
			var color = light.color.getRGB();
			gl.uniform3f(dat.location, color[0], color[1], color[2]);
		}else if (dat.name == 'intensity'){
			gl.uniform1f(dat.location, light.intensity);
		}
	}
};

MaterialPhong.prototype.sendUniformData = function(mesh, camera, scene){
	var gl = KT.gl;
	var geometry = mesh.geometry;
	var transformationMatrix;
	var uniforms = this.shader.uniforms;
	var modelTransformation;
	var lightsCount = 0;
	
	var usedLightUniform = null;
	for (var i=0,len=uniforms.length;i<len;i++){
		var uni = uniforms[i];
		
		if (uni.multi && uni.type == 'Light'){
			if (lightsCount == uni.data.length)
				continue;
				
			var lights = scene.lights;
			for (var j=0,jlen=lights.length;j<jlen;j++){
				this.sendLightUniformData(lights[j], uni.data[lightsCount++]);
			}
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
	
	return this;
};
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js":[function(require,module,exports){
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

Matrix4.getTransformation = function(position, rotation, scale){
	if (!position.__ktv3) throw "Position must be a Vector3";
	if (!rotation.__ktv3) throw "Rotation must be a Vector3";
	if (scale && !scale.__ktv3) throw "Scale must be a Vector3";
	
	var scale = (scale)? Matrix4.getScale(scale) : Matrix4.getIdentity();
	
	var rotationX = Matrix4.getXRotation(rotation.x);
	var rotationY = Matrix4.getYRotation(rotation.y);
	var rotationZ = Matrix4.getZRotation(rotation.z);
	
	var translation = Matrix4.getTranslation(position);
	
	var matrix;
	matrix = Matrix4.getIdentity();
	matrix.multiply(scale);
	matrix.multiply(rotationX);
	matrix.multiply(rotationY);
	matrix.multiply(rotationZ);
	matrix.multiply(translation);
	
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

},{"./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTOrbitAndPan.js":[function(require,module,exports){
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

},{"./KTInput":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTInput.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTScene.js":[function(require,module,exports){
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

},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTShaders.js":[function(require,module,exports){
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
			"struct Light{ " +
			    "lowp vec3 position; " +
			    "lowp vec3 color; " +
			    "lowp vec3 direction; " +
			    "lowp float intensity; " +
			"}; " +
			    
			"uniform Light lights[8]; " +
			"uniform int usedLights; " +
			
			"attribute mediump vec2 aTextureCoord; " +
			"attribute mediump vec3 aVertexPosition; " +
			"attribute lowp vec4 aVertexColor; " +
			
			"attribute mediump vec3 aVertexNormal; " + 
			
			
			"uniform mediump mat4 uMVMatrix; " +
			"uniform mediump mat4 uPMatrix; " +
			"uniform lowp vec4 uMaterialColor; " +
			
			"uniform bool uUseLighting; " +
			"uniform mediump mat4 uModelMatrix; " +
			"uniform mediump mat3 uNormalMatrix; " +
			
			"uniform lowp vec3 uAmbientLightColor; " +
			
			"varying mediump vec4 vVertexColor; " +
			"varying mediump vec2 vTextureCoord;" +  
			"varying mediump vec3 vLightWeight; " + 
			
			"mediump vec3 getLightWeight(mediump vec3 normal, mediump vec3 direction, lowp vec3 color, lowp float intensity){ " +
				"mediump float lightDot = max(dot(normal, direction), 0.0); " +
				"mediump vec3 lightWeight = (color * lightDot * intensity); " +
				"return lightWeight; " +
			"}" +
			
			"void main(void){ " + 
				"vec4 modelViewPosition = uMVMatrix * vec4(aVertexPosition, 1.0); " +
				"gl_Position = uPMatrix * modelViewPosition; " +
			
				"vLightWeight = uAmbientLightColor; " +
				"if (uUseLighting){ " +
					"vec3 vertexModelPosition = (uModelMatrix * vec4(aVertexPosition, 1.0)).xyz; " +
					"for (int i=0;i<8;i++){ " +
						"if (i >= usedLights){" +
							"break; " +
						"}" +
						
						"Light l = lights[i]; " +
						"mediump vec3 lPos = l.position - vertexModelPosition;" +
						"mediump float lDistance = length(lPos) / 2.0; " +
						"if (length(l.position) == 0.0){ " +
							"lDistance = 1.0; " +
							"lPos = vec3(0.0); " +
						"} " +
						"mediump vec3 lightDirection = l.direction + normalize(lPos); " +
						"vLightWeight += getLightWeight(aVertexNormal, lightDirection, l.color, l.intensity) / lDistance; " +
					"} " +
				"} " +
				 
				"vVertexColor = aVertexColor * uMaterialColor; " +
				"vTextureCoord = aTextureCoord; " +  
			"} " ,
			
		fragmentShader: 
			"uniform sampler2D uTextureSampler; " +
			"uniform bool uHasTexture; " +
			"uniform lowp float uOpacity; " +
			"uniform lowp vec2 uTextureRepeat; " +
			"uniform lowp vec2 uTextureOffset; " +
			"uniform mediump vec4 uGeometryUV; " +
			
			"varying mediump vec2 vTextureCoord; " + 
			"varying mediump vec4 vVertexColor; " + 
			"varying mediump vec3 vLightWeight; " + 
			
			"void main(void){ " +
				"mediump vec4 color = vVertexColor; " + 
				"if (uHasTexture){ " + 
					"mediump float tx = uGeometryUV.x + mod(uTextureOffset.x + vTextureCoord.s * uTextureRepeat.x - uGeometryUV.x, uGeometryUV.z - uGeometryUV.x);" +
					"mediump float ty = uGeometryUV.y + mod(uTextureOffset.y + vTextureCoord.t * uTextureRepeat.y - uGeometryUV.y, uGeometryUV.w - uGeometryUV.y);" +
					
					"mediump vec4 texColor = texture2D(uTextureSampler, vec2(tx, ty)); " +
					"color *= texColor; " +
				"} " + 
				
				"color.rgb *= vLightWeight; " + 
				"gl_FragColor = vec4(color.rgb, color.a * uOpacity); " + 
			"}"
	},
	
	
	phong: {
		vertexShader: 
			"attribute mediump vec2 aTextureCoord; " +
			"attribute mediump vec3 aVertexPosition; " +
			"attribute lowp vec4 aVertexColor; " +
			
			"attribute mediump vec3 aVertexNormal; " + 
			
			
			"uniform mediump mat4 uMVMatrix; " +
			"uniform mediump mat4 uPMatrix; " +
			"uniform lowp vec4 uMaterialColor; " +
			
			"uniform bool uUseLighting; " +
			"uniform mediump mat4 uModelMatrix; " +
			"uniform mediump mat3 uNormalMatrix; " +
			
			"uniform lowp vec3 uAmbientLightColor; " +
			
			"varying mediump vec4 vVertexColor; " +
			"varying mediump vec2 vTextureCoord;" +  
			"varying mediump vec3 vLightWeight; " +
			"varying mediump vec3 vNormal; " + 
			"varying mediump vec3 vPosition; " +
			
			"void main(void){ " + 
				"vec4 modelViewPosition = uMVMatrix * vec4(aVertexPosition, 1.0); " +
				"gl_Position = uPMatrix * modelViewPosition; " +
			
				"if (uUseLighting){ " + 
					"vNormal = uNormalMatrix * aVertexNormal; " +
					"vLightWeight = uAmbientLightColor; " +
				"}else{ " +
					"vLightWeight = vec3(1.0); " + 
				"}" +   
				 
				"vPosition = (uModelMatrix * vec4(aVertexPosition, 1.0)).xyz; " +
				"vVertexColor = aVertexColor * uMaterialColor; " +
				"vTextureCoord = aTextureCoord; " +  
			"} " ,
			
		fragmentShader: 
			"struct Light{ " +
			    "lowp vec3 position; " +
			    "lowp vec3 color; " +
			    "lowp vec3 direction; " +
			    "lowp float intensity; " +
			"}; " +
			    
			"uniform Light lights[8]; " +
			"uniform int usedLights; " +
			
			"uniform bool uHasTexture; " +
			"uniform sampler2D uTextureSampler; " +
			
			"uniform bool uUseSpecularMap; " +
			"uniform sampler2D uSpecularMapSampler; " +
			
			"uniform bool uUseLighting; " +
			"uniform lowp float uOpacity; " +
			"uniform lowp vec2 uTextureRepeat; " +
			"uniform lowp vec2 uTextureOffset; " +
			"uniform mediump vec4 uGeometryUV; " +
			"uniform mediump vec3 uCameraPosition; " +
			
			"uniform lowp vec3 uSpecularColor; " +
			"uniform lowp float uShininess; " +
			
			"varying mediump vec2 vTextureCoord; " + 
			"varying mediump vec4 vVertexColor; " + 
			"varying mediump vec3 vLightWeight; " + 
			"varying mediump vec3 vNormal; " + 
			"varying mediump vec3 vPosition; " +
			
			"mediump vec3 getLightWeight(mediump vec3 normal, mediump vec3 direction, lowp vec3 color, lowp float intensity){ " +
				"mediump float lightDot = max(dot(normal, direction), 0.0); " +
				"mediump vec3 lightWeight = (color * lightDot * intensity); " +
				"return lightWeight; " +
			"}" +
			
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
					"for (int i=0;i<8;i++){ " +
						"if (i >= usedLights){" +
							"break; " +
						"}" +
						
						"Light l = lights[i]; " +
						"mediump vec3 lPos = l.position - vPosition;" +
						"mediump float lDistance = length(lPos) / 2.0; " +
						"if (length(l.position) == 0.0){ " +
							"lDistance = 1.0; " +
							"lPos = vec3(0.0); " +
						"} " +
						"mediump vec3 lightDirection = l.direction + normalize(lPos); " +
						"phongLightWeight += getLightWeight(normal, lightDirection, l.color, l.intensity) / lDistance; " +
						
						
						"lowp float shininess = uShininess; " + 
						"if (uUseSpecularMap){ " +
							"shininess = texture2D(uSpecularMapSampler, vec2(tx, ty)).r * 255.0; " +
						"} " +
						
						"if (shininess > 0.0 && shininess < 255.0){ " +
							"mediump vec3 halfAngle = normalize(cameraDirection + lightDirection); " +
							"mediump float specDot = max(dot(halfAngle, normal), 0.0); " +
							"color += vec4(uSpecularColor, 1.0) * pow(specDot, shininess); " + 
						"} " +
					"} " +
				"} " +
				
				"color.rgb *= vLightWeight + phongLightWeight; " + 
				"gl_FragColor = vec4(color.rgb, color.a * uOpacity); " + 
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

},{"./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTUtils":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTextureFramebuffer.js":[function(require,module,exports){
var KT = require('./KTMain');
var Vector2 = require('./KTVector2');

function TextureFramebuffer(width, height, params){
	this.__kttextureframebuffer = true;
	
	var gl = KT.gl;
	
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
KT.GUITexture = require('./KTGUITexture');
KT.LightDirectional = require('./KTLightDirectional');
KT.LightPoint = require('./KTLightPoint');
KT.Input = require('./KTInput');
KT.Material = require('./KTMaterial');
KT.MaterialBasic = require('./KTMaterialBasic');
KT.MaterialLambert = require('./KTMaterialLambert');
KT.MaterialPhong = require('./KTMaterialPhong');
KT.Math = require('./KTMath');
KT.Matrix3 = require('./KTMatrix3');
KT.Matrix4 = require('./KTMatrix4');
KT.Mesh = require('./KTMesh');
KT.OrbitAndPan = require('./KTOrbitAndPan');
KT.Texture = require('./KTTexture');
KT.TextureFramebuffer = require('./KTTextureFramebuffer');
KT.Utils = require('./KTUtils');
KT.Vector2 = require('./KTVector2');
KT.Vector3 = require('./KTVector3');
KT.Vector4 = require('./KTVector4');
KT.Scene = require('./KTScene');

module.exports = KT;
},{"./KTCameraOrtho":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraOrtho.js","./KTCameraPerspective":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraPerspective.js","./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGUITexture":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGUITexture.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTGeometry3DModel":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry3DModel.js","./KTGeometryBox":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryBox.js","./KTGeometryCylinder":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryCylinder.js","./KTGeometryPlane":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryPlane.js","./KTGeometrySkybox":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometrySkybox.js","./KTGeometrySphere":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometrySphere.js","./KTInput":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTInput.js","./KTLightDirectional":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightDirectional.js","./KTLightPoint":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightPoint.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js","./KTMaterialBasic":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialBasic.js","./KTMaterialLambert":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialLambert.js","./KTMaterialPhong":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialPhong.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTMatrix3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix3.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTMesh":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMesh.js","./KTOrbitAndPan":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTOrbitAndPan.js","./KTScene":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTScene.js","./KTTexture":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTexture.js","./KTTextureFramebuffer":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTextureFramebuffer.js","./KTUtils":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js","./KTVector4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js":[function(require,module,exports){
window.KT = require('./KramTech');
},{"./KramTech":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KramTech.js"}]},{},["c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiLi5cXHNyY1xcS1RDYW1lcmFPcnRoby5qcyIsIi4uXFxzcmNcXEtUQ2FtZXJhUGVyc3BlY3RpdmUuanMiLCIuLlxcc3JjXFxLVENvbG9yLmpzIiwiLi5cXHNyY1xcS1RHVUlUZXh0dXJlLmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeS5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnkzRE1vZGVsLmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeUJveC5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlDeWxpbmRlci5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlQbGFuZS5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlTa3lib3guanMiLCIuLlxcc3JjXFxLVEdlb21ldHJ5U3BoZXJlLmpzIiwiLi5cXHNyY1xcS1RJbnB1dC5qcyIsIi4uXFxzcmNcXEtUTGlnaHREaXJlY3Rpb25hbC5qcyIsIi4uXFxzcmNcXEtUTGlnaHRQb2ludC5qcyIsIi4uXFxzcmNcXEtUTWFpbi5qcyIsIi4uXFxzcmNcXEtUTWF0ZXJpYWwuanMiLCIuLlxcc3JjXFxLVE1hdGVyaWFsQmFzaWMuanMiLCIuLlxcc3JjXFxLVE1hdGVyaWFsTGFtYmVydC5qcyIsIi4uXFxzcmNcXEtUTWF0ZXJpYWxQaG9uZy5qcyIsIi4uXFxzcmNcXEtUTWF0aC5qcyIsIi4uXFxzcmNcXEtUTWF0cml4My5qcyIsIi4uXFxzcmNcXEtUTWF0cml4NC5qcyIsIi4uXFxzcmNcXEtUTWVzaC5qcyIsIi4uXFxzcmNcXEtUT3JiaXRBbmRQYW4uanMiLCIuLlxcc3JjXFxLVFNjZW5lLmpzIiwiLi5cXHNyY1xcS1RTaGFkZXJzLmpzIiwiLi5cXHNyY1xcS1RUZXh0dXJlLmpzIiwiLi5cXHNyY1xcS1RUZXh0dXJlRnJhbWVidWZmZXIuanMiLCIuLlxcc3JjXFxLVFV0aWxzLmpzIiwiLi5cXHNyY1xcS1RWZWN0b3IyLmpzIiwiLi5cXHNyY1xcS1RWZWN0b3IzLmpzIiwiLi5cXHNyY1xcS1RWZWN0b3I0LmpzIiwiLi5cXHNyY1xcS3JhbVRlY2guanMiLCIuLlxcc3JjXFxXaW5kb3dFeHBvcnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcbnZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgVmVjdG9yMyA9IHJlcXVpcmUoJy4vS1RWZWN0b3IzJyk7XHJcbnZhciBLVE1hdGggPSByZXF1aXJlKCcuL0tUTWF0aCcpO1xyXG5cclxuZnVuY3Rpb24gQ2FtZXJhT3J0aG8od2lkdGgsIGhlaWdodCwgem5lYXIsIHpmYXIpe1xyXG5cdHRoaXMuX19rdGNhbWVyYSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IG5ldyBWZWN0b3IzKDAuMCwgMC4wLCAwLjApO1xyXG5cdHRoaXMudXBWZWN0b3IgPSBuZXcgVmVjdG9yMygwLjAsIDEuMCwgMC4wKTtcclxuXHR0aGlzLmxvb2tBdChuZXcgVmVjdG9yMygwLjAsIDAuMCwgLTEuMCkpO1xyXG5cdHRoaXMubG9ja2VkID0gZmFsc2U7XHJcblx0XHJcblx0dGhpcy53aWR0aCA9IHdpZHRoO1xyXG5cdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdHRoaXMuem5lYXIgPSB6bmVhcjtcclxuXHR0aGlzLnpmYXIgPSB6ZmFyO1xyXG5cdFxyXG5cdHRoaXMuY29udHJvbHMgPSBudWxsO1xyXG5cdFxyXG5cdHRoaXMuc2V0T3J0aG8oKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYW1lcmFPcnRobztcclxuXHJcbkNhbWVyYU9ydGhvLnByb3RvdHlwZS5zZXRPcnRobyA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIEMgPSAyLjAgLyB0aGlzLndpZHRoO1xyXG5cdHZhciBSID0gMi4wIC8gdGhpcy5oZWlnaHQ7XHJcblx0dmFyIEEgPSAtMi4wIC8gKHRoaXMuemZhciAtIHRoaXMuem5lYXIpO1xyXG5cdHZhciBCID0gLSh0aGlzLnpmYXIgKyB0aGlzLnpuZWFyKSAvICh0aGlzLnpmYXIgLSB0aGlzLnpuZWFyKTtcclxuXHRcclxuXHR0aGlzLnBlcnNwZWN0aXZlTWF0cml4ID0gbmV3IE1hdHJpeDQoXHJcblx0XHRDLCAwLCAwLCAwLFxyXG5cdFx0MCwgUiwgMCwgMCxcclxuXHRcdDAsIDAsIEEsIEIsXHJcblx0XHQwLCAwLCAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbkNhbWVyYU9ydGhvLnByb3RvdHlwZS5sb29rQXQgPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IGxvb2sgdG8gYSB2ZWN0b3IzXCI7XHJcblx0XHJcblx0dmFyIGZvcndhcmQgPSBWZWN0b3IzLnZlY3RvcnNEaWZmZXJlbmNlKHRoaXMucG9zaXRpb24sIHZlY3RvcjMpLm5vcm1hbGl6ZSgpO1xyXG5cdHZhciBsZWZ0ID0gdGhpcy51cFZlY3Rvci5jcm9zcyhmb3J3YXJkKS5ub3JtYWxpemUoKTtcclxuXHR2YXIgdXAgPSBmb3J3YXJkLmNyb3NzKGxlZnQpLm5vcm1hbGl6ZSgpO1xyXG5cdFxyXG5cdHZhciB4ID0gLWxlZnQuZG90KHRoaXMucG9zaXRpb24pO1xyXG5cdHZhciB5ID0gLXVwLmRvdCh0aGlzLnBvc2l0aW9uKTtcclxuXHR2YXIgeiA9IC1mb3J3YXJkLmRvdCh0aGlzLnBvc2l0aW9uKTtcclxuXHRcclxuXHR0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbmV3IE1hdHJpeDQoXHJcblx0XHRsZWZ0LngsIGxlZnQueSwgbGVmdC56LCB4LFxyXG5cdFx0dXAueCwgdXAueSwgdXAueiwgeSxcclxuXHRcdGZvcndhcmQueCwgZm9yd2FyZC55LCBmb3J3YXJkLnosIHosXHJcblx0XHQwLCAwLCAwLCAxXHJcblx0KTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbkNhbWVyYU9ydGhvLnByb3RvdHlwZS5zZXRDb250cm9scyA9IGZ1bmN0aW9uKGNhbWVyYUNvbnRyb2xzKXtcclxuXHRpZiAoIWNhbWVyYUNvbnRyb2xzLl9fa3RDYW1DdHJscykgdGhyb3cgXCJJcyBub3QgYSB2YWxpZCBjYW1lcmEgY29udHJvbHMgb2JqZWN0XCI7XHJcblx0XHJcblx0dmFyIHpvb20gPSBWZWN0b3IzLnZlY3RvcnNEaWZmZXJlbmNlKHRoaXMucG9zaXRpb24sIGNhbWVyYUNvbnRyb2xzLnRhcmdldCkubGVuZ3RoKCk7XHJcblx0XHJcblx0dGhpcy5jb250cm9scyA9IGNhbWVyYUNvbnRyb2xzO1xyXG5cdFxyXG5cdGNhbWVyYUNvbnRyb2xzLmNhbWVyYSA9IHRoaXM7XHJcblx0Y2FtZXJhQ29udHJvbHMuem9vbSA9IHpvb207XHJcblx0Y2FtZXJhQ29udHJvbHMuYW5nbGUueCA9IEtUTWF0aC5nZXQyREFuZ2xlKGNhbWVyYUNvbnRyb2xzLnRhcmdldC54LCBjYW1lcmFDb250cm9scy50YXJnZXQueix0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueik7XHJcblx0Y2FtZXJhQ29udHJvbHMuYW5nbGUueSA9IEtUTWF0aC5nZXQyREFuZ2xlKDAsIHRoaXMucG9zaXRpb24ueSwgem9vbSwgY2FtZXJhQ29udHJvbHMudGFyZ2V0LnkpO1xyXG5cdFxyXG5cdGNhbWVyYUNvbnRyb2xzLnNldENhbWVyYVBvc2l0aW9uKCk7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbiIsInZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxudmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBWZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxudmFyIEtUTWF0aCA9IHJlcXVpcmUoJy4vS1RNYXRoJyk7XHJcbnZhciBHZW9tZXRyeVNreWJveCA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeVNreWJveCcpO1xyXG5cclxuZnVuY3Rpb24gQ2FtZXJhUGVyc3BlY3RpdmUoZm92LCByYXRpbywgem5lYXIsIHpmYXIpe1xyXG5cdHRoaXMuX19rdGNhbWVyYSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IG5ldyBWZWN0b3IzKDAuMCwgMC4wLCAwLjApO1xyXG5cdHRoaXMudXBWZWN0b3IgPSBuZXcgVmVjdG9yMygwLjAsIDEuMCwgMC4wKTtcclxuXHR0aGlzLmxvb2tBdChuZXcgVmVjdG9yMygwLjAsIDAuMCwgLTEuMCkpO1xyXG5cdHRoaXMubG9ja2VkID0gZmFsc2U7XHJcblx0XHJcblx0dGhpcy5mb3YgPSBmb3Y7XHJcblx0dGhpcy5yYXRpbyA9IHJhdGlvO1xyXG5cdHRoaXMuem5lYXIgPSB6bmVhcjtcclxuXHR0aGlzLnpmYXIgPSB6ZmFyO1xyXG5cdFxyXG5cdHRoaXMuY29udHJvbHMgPSBudWxsO1xyXG5cdFxyXG5cdHRoaXMuc2t5Ym94ID0gbmV3IEdlb21ldHJ5U2t5Ym94KDEwMCwgMTAwLCAxMDAsIHRoaXMucG9zaXRpb24pO1xyXG5cdFxyXG5cdHRoaXMuc2V0UGVyc3BlY3RpdmUoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYW1lcmFQZXJzcGVjdGl2ZTtcclxuXHJcbkNhbWVyYVBlcnNwZWN0aXZlLnByb3RvdHlwZS5zZXRQZXJzcGVjdGl2ZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIEMgPSAxIC8gTWF0aC50YW4odGhpcy5mb3YgLyAyKTtcclxuXHR2YXIgUiA9IEMgKiB0aGlzLnJhdGlvO1xyXG5cdHZhciBBID0gKHRoaXMuem5lYXIgKyB0aGlzLnpmYXIpIC8gKHRoaXMuem5lYXIgLSB0aGlzLnpmYXIpO1xyXG5cdHZhciBCID0gKDIgKiB0aGlzLnpuZWFyICogdGhpcy56ZmFyKSAvICh0aGlzLnpuZWFyIC0gdGhpcy56ZmFyKTtcclxuXHRcclxuXHR0aGlzLnBlcnNwZWN0aXZlTWF0cml4ID0gbmV3IE1hdHJpeDQoXHJcblx0XHRDLCAwLCAwLCAgMCxcclxuXHRcdDAsIFIsIDAsICAwLFxyXG5cdFx0MCwgMCwgQSwgIEIsXHJcblx0XHQwLCAwLCAtMSwgMFxyXG5cdCk7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUuc2V0U2t5Ym94ID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgbGVuZ3RoLCB0ZXh0dXJlcyl7XHJcblx0dGhpcy5za3lib3ggPSBuZXcgR2VvbWV0cnlTa3lib3god2lkdGgsIGhlaWdodCwgbGVuZ3RoLCB0aGlzLnBvc2l0aW9uLCB0ZXh0dXJlcyk7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUubG9va0F0ID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBsb29rIHRvIGEgdmVjdG9yM1wiO1xyXG5cdFxyXG5cdHZhciBmb3J3YXJkID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSh0aGlzLnBvc2l0aW9uLCB2ZWN0b3IzKS5ub3JtYWxpemUoKTtcclxuXHR2YXIgbGVmdCA9IHRoaXMudXBWZWN0b3IuY3Jvc3MoZm9yd2FyZCkubm9ybWFsaXplKCk7XHJcblx0dmFyIHVwID0gZm9yd2FyZC5jcm9zcyhsZWZ0KS5ub3JtYWxpemUoKTtcclxuXHRcclxuXHR2YXIgeCA9IC1sZWZ0LmRvdCh0aGlzLnBvc2l0aW9uKTtcclxuXHR2YXIgeSA9IC11cC5kb3QodGhpcy5wb3NpdGlvbik7XHJcblx0dmFyIHogPSAtZm9yd2FyZC5kb3QodGhpcy5wb3NpdGlvbik7XHJcblx0XHJcblx0dGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG5ldyBNYXRyaXg0KFxyXG5cdFx0bGVmdC54LCBsZWZ0LnksIGxlZnQueiwgeCxcclxuXHRcdHVwLngsIHVwLnksIHVwLnosIHksXHJcblx0XHRmb3J3YXJkLngsIGZvcndhcmQueSwgZm9yd2FyZC56LCB6LFxyXG5cdFx0MCwgMCwgMCwgMVxyXG5cdCk7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUuc2V0Q29udHJvbHMgPSBmdW5jdGlvbihjYW1lcmFDb250cm9scyl7XHJcblx0aWYgKCFjYW1lcmFDb250cm9scy5fX2t0Q2FtQ3RybHMpIHRocm93IFwiSXMgbm90IGEgdmFsaWQgY2FtZXJhIGNvbnRyb2xzIG9iamVjdFwiO1xyXG5cdFxyXG5cdHZhciB6b29tID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSh0aGlzLnBvc2l0aW9uLCBjYW1lcmFDb250cm9scy50YXJnZXQpLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMuY29udHJvbHMgPSBjYW1lcmFDb250cm9scztcclxuXHRcclxuXHRjYW1lcmFDb250cm9scy5jYW1lcmEgPSB0aGlzO1xyXG5cdGNhbWVyYUNvbnRyb2xzLnpvb20gPSB6b29tO1xyXG5cdGNhbWVyYUNvbnRyb2xzLmFuZ2xlLnggPSBLVE1hdGguZ2V0MkRBbmdsZShjYW1lcmFDb250cm9scy50YXJnZXQueCwgY2FtZXJhQ29udHJvbHMudGFyZ2V0LnosdGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnopO1xyXG5cdGNhbWVyYUNvbnRyb2xzLmFuZ2xlLnkgPSBLVE1hdGguZ2V0MkRBbmdsZSgwLCB0aGlzLnBvc2l0aW9uLnksIHpvb20sIGNhbWVyYUNvbnRyb2xzLnRhcmdldC55KTtcclxuXHRcclxuXHRjYW1lcmFDb250cm9scy5zZXRDYW1lcmFQb3NpdGlvbigpO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4iLCJmdW5jdGlvbiBDb2xvcihoZXhDb2xvcil7XHJcblx0dmFyIHN0ciA9IGhleENvbG9yLnN1YnN0cmluZygxKTtcclxuXHRcclxuXHRpZiAoc3RyLmxlbmd0aCA9PSA2KSBzdHIgKz0gXCJGRlwiO1xyXG5cdHZhciByID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygwLCAyKSwgMTYpO1xyXG5cdHZhciBnID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygyLCA0KSwgMTYpO1xyXG5cdHZhciBiID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg0LCA2KSwgMTYpO1xyXG5cdHZhciBhID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg2LCA4KSwgMTYpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBbciAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSwgYSAvIDI1NV07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29sb3I7XHJcblxyXG5Db2xvci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaGV4Q29sb3Ipe1xyXG5cdHZhciBzdHIgPSBoZXhDb2xvci5zdWJzdHJpbmcoMSk7XHJcblx0XHJcblx0aWYgKHN0ci5sZW5ndGggPT0gNikgc3RyICs9IFwiRkZcIjtcclxuXHR2YXIgciA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMCwgMiksIDE2KTtcclxuXHR2YXIgZyA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMiwgNCksIDE2KTtcclxuXHR2YXIgYiA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoNCwgNiksIDE2KTtcclxuXHR2YXIgYSA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoNiwgOCksIDE2KTtcclxuXHRcclxuXHR0aGlzLmNvbG9yID0gW3IgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUsIGEgLyAyNTVdO1xyXG59O1xyXG5cclxuQ29sb3IucHJvdG90eXBlLnNldFJHQiA9IGZ1bmN0aW9uKHJlZCwgZ3JlZW4sIGJsdWUpe1xyXG5cdHRoaXMuc2V0UkdCQShyZWQsIGdyZWVuLCBibHVlLCAyNTUpO1xyXG59O1xyXG5cclxuQ29sb3IucHJvdG90eXBlLnNldFJHQkEgPSBmdW5jdGlvbihyZWQsIGdyZWVuLCBibHVlLCBhbHBoYSl7XHJcblx0dGhpcy5jb2xvciA9IFtyZWQgLyAyNTUsIGdyZWVuIC8gMjU1LCBibHVlIC8gMjU1LCBhbHBoYV07XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuZ2V0UkdCID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgYyA9IHRoaXMuZ2V0UkdCQSgpO1xyXG5cdFxyXG5cdHJldHVybiBbY1swXSwgY1sxXSwgY1syXV07XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuZ2V0UkdCQSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMuY29sb3I7XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuZ2V0SGV4ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgYyA9IHRoaXMuY29sb3I7XHJcblx0XHJcblx0dmFyIHIgPSAoY1swXSAqIDI1NSkudG9TdHJpbmcoMTYpO1xyXG5cdHZhciBnID0gKGNbMV0gKiAyNTUpLnRvU3RyaW5nKDE2KTtcclxuXHR2YXIgYiA9IChjWzJdICogMjU1KS50b1N0cmluZygxNik7XHJcblx0dmFyIGEgPSAoY1szXSAqIDI1NSkudG9TdHJpbmcoMTYpO1xyXG5cdFxyXG5cdGlmIChyLmxlbmd0aCA9PSAxKSByID0gXCIwXCIgKyByO1xyXG5cdGlmIChnLmxlbmd0aCA9PSAxKSBnID0gXCIwXCIgKyBnO1xyXG5cdGlmIChiLmxlbmd0aCA9PSAxKSBiID0gXCIwXCIgKyBiO1xyXG5cdGlmIChhLmxlbmd0aCA9PSAxKSBhID0gXCIwXCIgKyBhO1xyXG5cdFxyXG5cdHJldHVybiAoXCIjXCIgKyByICsgZyArIGIgKyBhKS50b1VwcGVyQ2FzZSgpO1xyXG59O1xyXG5cclxuQ29sb3IuX0JMQUNLXHRcdD0gXCIjMDAwMDAwRkZcIjtcclxuQ29sb3IuX1JFRCBcdFx0XHQ9IFwiI0ZGMDAwMEZGXCI7XHJcbkNvbG9yLl9HUkVFTiBcdFx0PSBcIiMwMEZGMDBGRlwiO1xyXG5Db2xvci5fQkxVRSBcdFx0PSBcIiMwMDAwRkZGRlwiO1xyXG5Db2xvci5fV0hJVEVcdFx0PSBcIiNGRkZGRkZGRlwiO1xyXG5Db2xvci5fWUVMTE9XXHRcdD0gXCIjRkZGRjAwRkZcIjtcclxuQ29sb3IuX01BR0VOVEFcdFx0PSBcIiNGRjAwRkZGRlwiO1xyXG5Db2xvci5fQVFVQVx0XHRcdD0gXCIjMDBGRkZGRkZcIjtcclxuQ29sb3IuX0dPTERcdFx0XHQ9IFwiI0ZGRDcwMEZGXCI7XHJcbkNvbG9yLl9HUkFZXHRcdFx0PSBcIiM4MDgwODBGRlwiO1xyXG5Db2xvci5fUFVSUExFXHRcdD0gXCIjODAwMDgwRkZcIjsiLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbnZhciBWZWN0b3I0ID0gcmVxdWlyZSgnLi9LVFZlY3RvcjQnKTtcclxuXHJcbmZ1bmN0aW9uIEdVSVRleHR1cmUod2lkdGgsIGhlaWdodCwgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0dGhpcy5yZWFkeSA9IHRydWU7XHJcblx0XHJcblx0dmFyIGd1aVRleCA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdHZhciB4MSA9IDAuMDtcclxuXHR2YXIgeTEgPSAwLjA7XHJcblx0dmFyIHgyID0gd2lkdGg7XHJcblx0dmFyIHkyID0gaGVpZ2h0O1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHRcclxuXHR0aGlzLnV2UmVnaW9uID0gKHBhcmFtcy51dlJlZ2lvbik/IHBhcmFtcy51dlJlZ2lvbiA6IG5ldyBWZWN0b3I0KDAuMCwgMC4wLCAxLjAsIDEuMCk7XHJcblx0XHJcblx0dmFyIHhyID0gdGhpcy51dlJlZ2lvbi54O1xyXG5cdHZhciB5ciA9IHRoaXMudXZSZWdpb24ueTtcclxuXHR2YXIgaHIgPSB0aGlzLnV2UmVnaW9uLno7XHJcblx0dmFyIHZyID0gdGhpcy51dlJlZ2lvbi53O1xyXG5cdFxyXG5cdGd1aVRleC5hZGRWZXJ0aWNlKHgyLCB5MSwgMC4wLCBDb2xvci5fV0hJVEUsIGhyLCB5cik7XHJcblx0Z3VpVGV4LmFkZFZlcnRpY2UoeDEsIHkyLCAwLjAsIENvbG9yLl9XSElURSwgeHIsIHZyKTtcclxuXHRndWlUZXguYWRkVmVydGljZSh4MSwgeTEsIDAuMCwgQ29sb3IuX1dISVRFLCB4ciwgeXIpO1xyXG5cdGd1aVRleC5hZGRWZXJ0aWNlKHgyLCB5MiwgMC4wLCBDb2xvci5fV0hJVEUsIGhyLCB2cik7XHJcblx0XHJcblx0Z3VpVGV4LmFkZEZhY2UoMCwgMSwgMik7XHJcblx0Z3VpVGV4LmFkZEZhY2UoMCwgMywgMSk7XHJcblx0XHJcblx0Z3VpVGV4LmNvbXB1dGVGYWNlc05vcm1hbHMoKTtcclxuXHRndWlUZXguYnVpbGQoKTtcclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IGd1aVRleC52ZXJ0ZXhCdWZmZXI7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBndWlUZXgudGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBndWlUZXguZmFjZXNCdWZmZXI7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBndWlUZXguY29sb3JzQnVmZmVyO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IGd1aVRleC5ub3JtYWxzQnVmZmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdVSVRleHR1cmU7IiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxudmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxudmFyIFZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG52YXIgVmVjdG9yMyA9IHJlcXVpcmUoJy4vS1RWZWN0b3IzJyk7XHJcbnZhciBWZWN0b3I0ID0gcmVxdWlyZSgnLi9LVFZlY3RvcjQnKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5KCl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMudmVydGljZXMgPSBbXTtcclxuXHR0aGlzLnRyaWFuZ2xlcyA9IFtdO1xyXG5cdHRoaXMudXZDb29yZHMgPSBbXTtcclxuXHR0aGlzLmNvbG9ycyA9IFtdO1xyXG5cdHRoaXMubm9ybWFscyA9IFtdO1xyXG5cdHRoaXMudXZSZWdpb24gPSBuZXcgVmVjdG9yNCgwLjAsIDAuMCwgMS4wLCAxLjApO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5O1xyXG5cclxuR2VvbWV0cnkucHJvdG90eXBlLmFkZFZlcnRpY2UgPSBmdW5jdGlvbih4LCB5LCB6LCBjb2xvciwgdHgsIHR5KXtcclxuXHRpZiAoIWNvbG9yKSBjb2xvciA9IENvbG9yLl9XSElURTtcclxuXHRpZiAoIXR4KSB0eCA9IDA7XHJcblx0aWYgKCF0eSkgdHkgPSAwO1xyXG5cdFxyXG5cdHZhciBpbmQgPSB0aGlzLnZlcnRpY2VzLmxlbmd0aDtcclxuXHR0aGlzLnZlcnRpY2VzLnB1c2gobmV3IFZlY3RvcjMoeCwgeSwgeikpO1xyXG5cdHRoaXMuY29sb3JzLnB1c2gobmV3IENvbG9yKGNvbG9yKSk7XHJcblx0dGhpcy51dkNvb3Jkcy5wdXNoKG5ldyBWZWN0b3IyKHR4LCB0eSkpO1xyXG5cdFxyXG5cdHJldHVybiBpbmQ7XHJcbn07XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuYWRkRmFjZSA9IGZ1bmN0aW9uKHZlcnRpY2VfMCwgdmVydGljZV8xLCB2ZXJ0aWNlXzIpe1xyXG5cdGlmICghdGhpcy52ZXJ0aWNlc1t2ZXJ0aWNlXzBdKSB0aHJvdyBcIkludmFsaWQgdmVydGV4IGluZGV4OiBcIiArIHZlcnRpY2VfMDtcclxuXHRpZiAoIXRoaXMudmVydGljZXNbdmVydGljZV8xXSkgdGhyb3cgXCJJbnZhbGlkIHZlcnRleCBpbmRleDogXCIgKyB2ZXJ0aWNlXzE7XHJcblx0aWYgKCF0aGlzLnZlcnRpY2VzW3ZlcnRpY2VfMl0pIHRocm93IFwiSW52YWxpZCB2ZXJ0ZXggaW5kZXg6IFwiICsgdmVydGljZV8yO1xyXG5cdFxyXG5cdHRoaXMudHJpYW5nbGVzLnB1c2gobmV3IFZlY3RvcjModmVydGljZV8wLCB2ZXJ0aWNlXzEsIHZlcnRpY2VfMikpO1xyXG59O1xyXG5cclxuR2VvbWV0cnkucHJvdG90eXBlLmFkZE5vcm1hbCA9IGZ1bmN0aW9uKG54LCBueSwgbnope1xyXG5cdHRoaXMubm9ybWFscy5wdXNoKG5ldyBWZWN0b3IzKG54LCBueSwgbnopKTtcclxufTtcclxuXHJcbkdlb21ldHJ5LnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIHZlcnRpY2VzID0gW107XHJcblx0dmFyIHV2Q29vcmRzID0gW107XHJcblx0dmFyIHRyaWFuZ2xlcyA9IFtdO1xyXG5cdHZhciBjb2xvcnMgPSBbXTtcclxuXHR2YXIgbm9ybWFscyA9IFtdO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy52ZXJ0aWNlcy5sZW5ndGg7aTxsZW47aSsrKXsgXHJcblx0XHR2YXIgdiA9IHRoaXMudmVydGljZXNbaV07IFxyXG5cdFx0dmVydGljZXMucHVzaCh2LngsIHYueSwgdi56KTsgXHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy51dkNvb3Jkcy5sZW5ndGg7aTxsZW47aSsrKXsgXHJcblx0XHR2YXIgdiA9IHRoaXMudXZDb29yZHNbaV07IFxyXG5cdFx0dXZDb29yZHMucHVzaCh2LngsIHYueSk7IFxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMudHJpYW5nbGVzLmxlbmd0aDtpPGxlbjtpKyspeyBcclxuXHRcdHZhciB0ID0gdGhpcy50cmlhbmdsZXNbaV07IFxyXG5cdFx0dHJpYW5nbGVzLnB1c2godC54LCB0LnksIHQueik7IFxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMuY29sb3JzLmxlbmd0aDtpPGxlbjtpKyspeyBcclxuXHRcdHZhciBjID0gdGhpcy5jb2xvcnNbaV0uZ2V0UkdCQSgpOyBcclxuXHRcdFxyXG5cdFx0Y29sb3JzLnB1c2goY1swXSwgY1sxXSwgY1syXSwgY1szXSk7IFxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMubm9ybWFscy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBuID0gdGhpcy5ub3JtYWxzW2ldO1xyXG5cdFx0bm9ybWFscy5wdXNoKG4ueCwgbi55LCBuLnopO1xyXG5cdH1cclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IEtULmNyZWF0ZUFycmF5QnVmZmVyKFwiQVJSQVlfQlVGRkVSXCIsIG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpLCAzKTtcclxuXHR0aGlzLnRleEJ1ZmZlciA9IEtULmNyZWF0ZUFycmF5QnVmZmVyKFwiQVJSQVlfQlVGRkVSXCIsIG5ldyBGbG9hdDMyQXJyYXkodXZDb29yZHMpLCAyKTtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJFTEVNRU5UX0FSUkFZX0JVRkZFUlwiLCBuZXcgVWludDE2QXJyYXkodHJpYW5nbGVzKSwgMSk7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBLVC5jcmVhdGVBcnJheUJ1ZmZlcihcIkFSUkFZX0JVRkZFUlwiLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9ycyksIDQpO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IEtULmNyZWF0ZUFycmF5QnVmZmVyKFwiQVJSQVlfQlVGRkVSXCIsIG5ldyBGbG9hdDMyQXJyYXkobm9ybWFscyksIDMpO1xyXG5cdHRoaXMucmVhZHkgPSB0cnVlO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuR2VvbWV0cnkucHJvdG90eXBlLmNvbXB1dGVGYWNlc05vcm1hbHMgPSBmdW5jdGlvbigpe1xyXG5cdHRoaXMubm9ybWFscyA9IFtdO1xyXG5cdFxyXG5cdHZhciBub3JtYWxpemVkVmVydGljZXMgPSBbXTtcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMudHJpYW5nbGVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIGZhY2UgPSB0aGlzLnRyaWFuZ2xlc1tpXTtcclxuXHRcdHZhciB2MCA9IHRoaXMudmVydGljZXNbZmFjZS54XTtcclxuXHRcdHZhciB2MSA9IHRoaXMudmVydGljZXNbZmFjZS55XTtcclxuXHRcdHZhciB2MiA9IHRoaXMudmVydGljZXNbZmFjZS56XTtcclxuXHRcdFxyXG5cdFx0dmFyIGRpcjEgPSBWZWN0b3IzLnZlY3RvcnNEaWZmZXJlbmNlKHYxLCB2MCk7XHJcblx0XHR2YXIgZGlyMiA9IFZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UodjIsIHYwKTtcclxuXHRcdFxyXG5cdFx0dmFyIG5vcm1hbCA9IGRpcjEuY3Jvc3MoZGlyMikubm9ybWFsaXplKCk7XHJcblx0XHRcclxuXHRcdGlmIChub3JtYWxpemVkVmVydGljZXMuaW5kZXhPZihmYWNlLngpID09IC0xKSB0aGlzLm5vcm1hbHMucHVzaChub3JtYWwpO1xyXG5cdFx0aWYgKG5vcm1hbGl6ZWRWZXJ0aWNlcy5pbmRleE9mKGZhY2UueSkgPT0gLTEpIHRoaXMubm9ybWFscy5wdXNoKG5vcm1hbCk7XHJcblx0XHRpZiAobm9ybWFsaXplZFZlcnRpY2VzLmluZGV4T2YoZmFjZS56KSA9PSAtMSkgdGhpcy5ub3JtYWxzLnB1c2gobm9ybWFsKTtcclxuXHRcdFxyXG5cdFx0bm9ybWFsaXplZFZlcnRpY2VzLnB1c2goZmFjZS54LCBmYWNlLnksIGZhY2Uueik7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4iLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vS1RVdGlscycpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcbnZhciBWZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxudmFyIFZlY3RvcjQgPSByZXF1aXJlKCcuL0tUVmVjdG9yNCcpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnkzRE1vZGVsKGZpbGVVUkwpe1xyXG5cdHRoaXMuX19rdGdlb21ldHJ5ID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLmZpbGVVUkwgPSBmaWxlVVJMO1xyXG5cdHRoaXMucmVhZHkgPSBmYWxzZTtcclxuXHR0aGlzLnV2UmVnaW9uID0gbmV3IFZlY3RvcjQoMC4wLCAwLjAsIDEuMCwgMS4wKTtcclxuXHRcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0VXRpbHMuZ2V0RmlsZUNvbnRlbnQoZmlsZVVSTCwgZnVuY3Rpb24oZmlsZSl7XHJcblx0XHRULnJlYWR5ID0gdHJ1ZTtcclxuXHRcdFQucGFyc2VGaWxlKGZpbGUpO1xyXG5cdH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5M0RNb2RlbDtcclxuXHJcbkdlb21ldHJ5M0RNb2RlbC5wcm90b3R5cGUucGFyc2VGaWxlID0gZnVuY3Rpb24oZmlsZSl7XHJcblx0dmFyIGxpbmVzID0gZmlsZS5zcGxpdCgnXFxyXFxuJyk7XHJcblx0dmFyIHZlcnRleE1pbiA9IFtdO1xyXG5cdHZhciB1dkNvb3JkTWluID0gW107XHJcblx0dmFyIG5vcm1hbE1pbiA9IFtdO1xyXG5cdHZhciBpbmRNaW4gPSBbXTtcclxuXHR2YXIgZ2VvbWV0cnkgPSBuZXcgR2VvbWV0cnkoKTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPWxpbmVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIGwgPSBsaW5lc1tpXS50cmltKCk7XHJcblx0XHRsID0gbC5yZXBsYWNlKCcgICcsICcgJyk7XHJcblx0XHR2YXIgaW5kID0gbC5jaGFyQXQoMCk7XHJcblx0XHRcclxuXHRcdHZhciBwID0gbC5zcGxpdCgnICcpO1xyXG5cdFx0cC5zcGxpY2UoMCwxKTtcclxuXHRcdFxyXG5cdFx0aWYgKGluZCA9PSAnIycpIGNvbnRpbnVlO1xyXG5cdFx0ZWxzZSBpZiAoaW5kID09ICdnJykgY29udGludWU7XHJcblx0XHRlbHNlIGlmIChsID09ICcnKSBjb250aW51ZTtcclxuXHRcdFxyXG5cdFx0aWYgKGwuaW5kZXhPZigndiAnKSA9PSAwKXtcclxuXHRcdFx0dmVydGV4TWluLnB1c2goIG5ldyBWZWN0b3IzKFxyXG5cdFx0XHRcdHBhcnNlRmxvYXQocFswXSksXHJcblx0XHRcdFx0cGFyc2VGbG9hdChwWzFdKSxcclxuXHRcdFx0XHRwYXJzZUZsb2F0KHBbMl0pXHJcblx0XHRcdCkpO1xyXG5cdFx0fWVsc2UgaWYgKGwuaW5kZXhPZigndm4gJykgPT0gMCl7XHJcblx0XHRcdG5vcm1hbE1pbi5wdXNoKCBuZXcgVmVjdG9yMyhcclxuXHRcdFx0XHRwYXJzZUZsb2F0KHBbMF0pLFxyXG5cdFx0XHRcdHBhcnNlRmxvYXQocFsxXSksXHJcblx0XHRcdFx0cGFyc2VGbG9hdChwWzJdKVxyXG5cdFx0XHQpKTtcclxuXHRcdH1lbHNlIGlmIChsLmluZGV4T2YoJ3Z0ICcpID09IDApe1xyXG5cdFx0XHR1dkNvb3JkTWluLnB1c2goIG5ldyBWZWN0b3IyKFxyXG5cdFx0XHRcdHBhcnNlRmxvYXQocFswXSksXHJcblx0XHRcdFx0cGFyc2VGbG9hdChwWzFdKVxyXG5cdFx0XHQpKTtcclxuXHRcdH1lbHNlIGlmIChsLmluZGV4T2YoJ2YgJykgPT0gMCl7XHJcblx0XHRcdGluZE1pbi5wdXNoKCBuZXcgVmVjdG9yMyhcclxuXHRcdFx0XHRwWzBdLFxyXG5cdFx0XHRcdHBbMV0sXHJcblx0XHRcdFx0cFsyXVxyXG5cdFx0XHQpKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj1pbmRNaW4ubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgaW5kID0gaW5kTWluW2ldO1xyXG5cdFx0dmFyIHZlcnRleEluZm8xID0gaW5kLnguc3BsaXQoJy8nKTtcclxuXHRcdHZhciB2ZXJ0ZXhJbmZvMiA9IGluZC55LnNwbGl0KCcvJyk7XHJcblx0XHR2YXIgdmVydGV4SW5mbzMgPSBpbmQuei5zcGxpdCgnLycpO1xyXG5cdFx0XHJcblx0XHR2YXIgdjEgPSB2ZXJ0ZXhNaW5bcGFyc2VJbnQodmVydGV4SW5mbzFbMF0pIC0gMV07XHJcblx0XHR2YXIgdDEgPSB1dkNvb3JkTWluW3BhcnNlSW50KHZlcnRleEluZm8xWzFdKSAtIDFdO1xyXG5cdFx0dmFyIG4xID0gbm9ybWFsTWluW3BhcnNlSW50KHZlcnRleEluZm8xWzJdKSAtIDFdO1xyXG5cdFx0XHJcblx0XHR2YXIgdjIgPSB2ZXJ0ZXhNaW5bcGFyc2VJbnQodmVydGV4SW5mbzJbMF0pIC0gMV07XHJcblx0XHR2YXIgdDIgPSB1dkNvb3JkTWluW3BhcnNlSW50KHZlcnRleEluZm8yWzFdKSAtIDFdO1xyXG5cdFx0dmFyIG4yID0gbm9ybWFsTWluW3BhcnNlSW50KHZlcnRleEluZm8yWzJdKSAtIDFdO1xyXG5cdFx0XHJcblx0XHR2YXIgdjMgPSB2ZXJ0ZXhNaW5bcGFyc2VJbnQodmVydGV4SW5mbzNbMF0pIC0gMV07XHJcblx0XHR2YXIgdDMgPSB1dkNvb3JkTWluW3BhcnNlSW50KHZlcnRleEluZm8zWzFdKSAtIDFdO1xyXG5cdFx0dmFyIG4zID0gbm9ybWFsTWluW3BhcnNlSW50KHZlcnRleEluZm8zWzJdKSAtIDFdO1xyXG5cdFx0XHJcblx0XHR2YXIgaTEgPSBnZW9tZXRyeS5hZGRWZXJ0aWNlKHYxLngsIHYxLnksIHYxLnosIENvbG9yLl9XSElURSwgdDEueCwgdDEueSk7XHJcblx0XHR2YXIgaTIgPSBnZW9tZXRyeS5hZGRWZXJ0aWNlKHYyLngsIHYyLnksIHYyLnosIENvbG9yLl9XSElURSwgdDIueCwgdDIueSk7XHJcblx0XHR2YXIgaTMgPSBnZW9tZXRyeS5hZGRWZXJ0aWNlKHYzLngsIHYzLnksIHYzLnosIENvbG9yLl9XSElURSwgdDMueCwgdDMueSk7XHJcblx0XHRcclxuXHRcdGdlb21ldHJ5LmFkZE5vcm1hbChuMS54LCBuMS55LCBuMS56KTtcclxuXHRcdGdlb21ldHJ5LmFkZE5vcm1hbChuMi54LCBuMi55LCBuMi56KTtcclxuXHRcdGdlb21ldHJ5LmFkZE5vcm1hbChuMy54LCBuMy55LCBuMy56KTtcclxuXHRcdFxyXG5cdFx0Z2VvbWV0cnkuYWRkRmFjZShpMSwgaTIsIGkzKTtcclxuXHR9XHJcblx0XHJcblx0Z2VvbWV0cnkuYnVpbGQoKTtcclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IGdlb21ldHJ5LnZlcnRleEJ1ZmZlcjtcclxuXHR0aGlzLnRleEJ1ZmZlciA9IGdlb21ldHJ5LnRleEJ1ZmZlcjtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gZ2VvbWV0cnkuZmFjZXNCdWZmZXI7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBnZW9tZXRyeS5jb2xvcnNCdWZmZXI7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gZ2VvbWV0cnkubm9ybWFsc0J1ZmZlcjtcclxufTtcclxuIiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG52YXIgVmVjdG9yNCA9IHJlcXVpcmUoJy4vS1RWZWN0b3I0Jyk7XHJcblxyXG5mdW5jdGlvbiBHZW9tZXRyeUJveCh3aWR0aCwgbGVuZ3RoLCBoZWlnaHQsIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdHRoaXMucmVhZHkgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBib3hHZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHRcclxuXHR2YXIgdyA9IHdpZHRoIC8gMjtcclxuXHR2YXIgbCA9IGxlbmd0aCAvIDI7XHJcblx0dmFyIGggPSBoZWlnaHQgLyAyO1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHRcclxuXHR0aGlzLnV2UmVnaW9uID0gKHBhcmFtcy51dlJlZ2lvbik/IHBhcmFtcy51dlJlZ2lvbiA6IG5ldyBWZWN0b3I0KDAuMCwgMC4wLCAxLjAsIDEuMCk7XHJcblx0dGhpcy5jb2xvclRvcCA9IChwYXJhbXMuY29sb3JUb3ApPyBwYXJhbXMuY29sb3JUb3AgOiBDb2xvci5fV0hJVEU7XHJcblx0dGhpcy5jb2xvckJvdHRvbSA9IChwYXJhbXMuY29sb3JCb3R0b20pPyBwYXJhbXMuY29sb3JCb3R0b20gOiBDb2xvci5fV0hJVEU7XHJcblx0XHJcblx0dmFyIHhyID0gdGhpcy51dlJlZ2lvbi54O1xyXG5cdHZhciB5ciA9IHRoaXMudXZSZWdpb24ueTtcclxuXHR2YXIgaHIgPSB0aGlzLnV2UmVnaW9uLno7XHJcblx0dmFyIHZyID0gdGhpcy51dlJlZ2lvbi53O1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgIGwsIHRoaXMuY29sb3JCb3R0b20sIGhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAgbCwgdGhpcy5jb2xvclRvcCwgeHIsIHZyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgLWgsICBsLCB0aGlzLmNvbG9yQm90dG9tLCB4ciwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgIGwsIHRoaXMuY29sb3JUb3AsIGhyLCB2cik7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAtbCwgdGhpcy5jb2xvckJvdHRvbSwgeHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgIGgsIC1sLCB0aGlzLmNvbG9yVG9wLCB4ciwgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgLWwsIHRoaXMuY29sb3JCb3R0b20sIGhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAtbCwgdGhpcy5jb2xvclRvcCwgaHIsIHZyKTtcclxuXHRcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgLWgsIC1sLCB0aGlzLmNvbG9yQm90dG9tLCBociwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgIGwsIHRoaXMuY29sb3JUb3AsIHhyLCB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAgbCwgdGhpcy5jb2xvckJvdHRvbSwgeHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgIGgsIC1sLCB0aGlzLmNvbG9yVG9wLCBociwgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgIGwsIHRoaXMuY29sb3JCb3R0b20sIGhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAgbCwgdGhpcy5jb2xvclRvcCwgaHIsIHZyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgLWgsIC1sLCB0aGlzLmNvbG9yQm90dG9tLCB4ciwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgLWwsIHRoaXMuY29sb3JUb3AsIHhyLCB2cik7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAgbCwgdGhpcy5jb2xvclRvcCwgaHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgIGgsIC1sLCB0aGlzLmNvbG9yVG9wLCB4ciwgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgIGwsIHRoaXMuY29sb3JUb3AsIHhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAtbCwgdGhpcy5jb2xvclRvcCwgaHIsIHZyKTtcclxuXHRcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgLWgsICBsLCB0aGlzLmNvbG9yQm90dG9tLCB4ciwgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgLWwsIHRoaXMuY29sb3JCb3R0b20sIHhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAgbCwgdGhpcy5jb2xvckJvdHRvbSwgaHIsIHZyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgLWgsIC1sLCB0aGlzLmNvbG9yQm90dG9tLCBociwgeXIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDAsIDEsIDIpO1xyXG5cdGJveEdlby5hZGRGYWNlKDAsIDMsIDEpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDQsIDUsIDYpO1xyXG5cdGJveEdlby5hZGRGYWNlKDUsIDcsIDYpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDgsIDksIDEwKTtcclxuXHRib3hHZW8uYWRkRmFjZSg4LCAxMSwgOSk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMTIsIDEzLCAxNCk7XHJcblx0Ym94R2VvLmFkZEZhY2UoMTMsIDE1LCAxNCk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMTYsIDE3LCAxOCk7XHJcblx0Ym94R2VvLmFkZEZhY2UoMTYsIDE5LCAxNyk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMjAsIDIxLCAyMik7XHJcblx0Ym94R2VvLmFkZEZhY2UoMjEsIDIzLCAyMik7XHJcblx0XHJcblx0Ym94R2VvLmNvbXB1dGVGYWNlc05vcm1hbHMoKTtcclxuXHRib3hHZW8uYnVpbGQoKTtcclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IGJveEdlby52ZXJ0ZXhCdWZmZXI7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBib3hHZW8udGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBib3hHZW8uZmFjZXNCdWZmZXI7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBib3hHZW8uY29sb3JzQnVmZmVyO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IGJveEdlby5ub3JtYWxzQnVmZmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5Qm94OyIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxudmFyIFZlY3RvcjQgPSByZXF1aXJlKCcuL0tUVmVjdG9yNCcpO1xyXG52YXIgS1RNYXRoID0gcmVxdWlyZSgnLi9LVE1hdGgnKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5Q3lsaW5kZXIocmFkaXVzVG9wLCByYWRpdXNCb3R0b20sIGhlaWdodCwgd2lkdGhTZWdtZW50cywgaGVpZ2h0U2VnbWVudHMsIG9wZW5Ub3AsIG9wZW5Cb3R0b20sIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdHRoaXMucmVhZHkgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBjeWxHZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0XHJcblx0dGhpcy51dlJlZ2lvbiA9IChwYXJhbXMudXZSZWdpb24pPyBwYXJhbXMudXZSZWdpb24gOiBuZXcgVmVjdG9yNCgwLjAsIDAuMCwgMS4wLCAxLjApO1xyXG5cdFxyXG5cdHZhciB4ciA9IHRoaXMudXZSZWdpb24ueDtcclxuXHR2YXIgeXIgPSB0aGlzLnV2UmVnaW9uLnk7XHJcblx0dmFyIGhyID0gdGhpcy51dlJlZ2lvbi56IC0geHI7XHJcblx0dmFyIHZyID0gdGhpcy51dlJlZ2lvbi53IC0geXI7XHJcblx0XHJcblx0dmFyIGggPSBoZWlnaHQgLyAyO1xyXG5cdFxyXG5cdHZhciBiYW5kVyA9IEtUTWF0aC5QSTIgLyAod2lkdGhTZWdtZW50cyAtIDEpO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPHdpZHRoU2VnbWVudHM7aSsrKXtcclxuXHRcdHZhciB4MSA9IE1hdGguY29zKGJhbmRXICogaSk7XHJcblx0XHR2YXIgeTEgPSAtaDtcclxuXHRcdHZhciB6MSA9IC1NYXRoLnNpbihiYW5kVyAqIGkpO1xyXG5cdFx0dmFyIHgyID0gTWF0aC5jb3MoYmFuZFcgKiBpKTtcclxuXHRcdHZhciB5MiA9IGg7XHJcblx0XHR2YXIgejIgPSAtTWF0aC5zaW4oYmFuZFcgKiBpKTtcclxuXHRcdFxyXG5cdFx0dmFyIHh0ID0gaSAvICh3aWR0aFNlZ21lbnRzIC0gMSk7XHJcblx0XHRcclxuXHRcdGN5bEdlby5hZGROb3JtYWwoeDEsIDAsIHoxKTtcclxuXHRcdGN5bEdlby5hZGROb3JtYWwoeDIsIDAsIHoyKTtcclxuXHRcdFxyXG5cdFx0eDEgKj0gcmFkaXVzQm90dG9tO1xyXG5cdFx0ejEgKj0gcmFkaXVzQm90dG9tO1xyXG5cdFx0eDIgKj0gcmFkaXVzVG9wO1xyXG5cdFx0ejIgKj0gcmFkaXVzVG9wO1xyXG5cdFx0XHJcblx0XHRjeWxHZW8uYWRkVmVydGljZSggeDEsIHkxLCB6MSwgQ29sb3IuX1dISVRFLCB4ciArICh4dCAqIGhyKSwgeXIpO1xyXG5cdFx0Y3lsR2VvLmFkZFZlcnRpY2UoIHgyLCB5MiwgejIsIENvbG9yLl9XSElURSwgeHIgKyAoeHQgKiBociksIHlyICsgdnIpO1xyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTx3aWR0aFNlZ21lbnRzKjIgLSAyO2krPTIpe1xyXG5cdFx0dmFyIGkxID0gaTtcclxuXHRcdHZhciBpMiA9IGkrMTtcclxuXHRcdHZhciBpMyA9IGkrMjtcclxuXHRcdHZhciBpNCA9IGkrMztcclxuXHRcdFxyXG5cdFx0Y3lsR2VvLmFkZEZhY2UoaTMsIGkyLCBpMSk7XHJcblx0XHRjeWxHZW8uYWRkRmFjZShpMywgaTQsIGkyKTtcclxuXHR9XHJcblx0XHJcblx0aWYgKCFvcGVuVG9wIHx8ICFvcGVuQm90dG9tKXtcclxuXHRcdHZhciBpMSA9IGN5bEdlby5hZGRWZXJ0aWNlKCAwLCBoLCAwLCBDb2xvci5fV0hJVEUsIHhyICsgKDAuNSAqIGhyKSwgeXIgKyAoMC41ICogdnIpKTtcclxuXHRcdHZhciBpMiA9IGN5bEdlby5hZGRWZXJ0aWNlKCAwLCAtaCwgMCwgQ29sb3IuX1dISVRFLCB4ciArICgwLjUgKiBociksIHlyICsgKDAuNSAqIHZyKSk7XHJcblx0XHRjeWxHZW8uYWRkTm9ybWFsKDAsICAxLCAwKTtcclxuXHRcdGN5bEdlby5hZGROb3JtYWwoMCwgLTEsIDApO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8d2lkdGhTZWdtZW50cyoyIC0gMjtpKz0yKXtcclxuXHRcdFx0dmFyIHYxID0gY3lsR2VvLnZlcnRpY2VzW2kgKyAxXTtcclxuXHRcdFx0dmFyIHYyID0gY3lsR2VvLnZlcnRpY2VzW2kgKyAzXTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciB0eDEgPSB4ciArICh2MS54IC8gMiArIDAuNSkgKiBocjtcclxuXHRcdFx0dmFyIHR5MSA9IHlyICsgKHYxLnogLyAyICsgMC41KSAqIHZyO1xyXG5cdFx0XHR2YXIgdHgyID0geHIgKyAodjIueCAvIDIgKyAwLjUpICogaHI7XHJcblx0XHRcdHZhciB0eTIgPSB5ciArICh2Mi56IC8gMiArIDAuNSkgKiB2cjtcclxuXHRcdFx0XHJcblx0XHRcdGlmICghb3BlblRvcCl7XHJcblx0XHRcdFx0dmFyIGkzID0gY3lsR2VvLmFkZFZlcnRpY2UoIHYxLngsIGgsIHYxLnosIENvbG9yLl9XSElURSwgdHgxLCB0eTEpO1xyXG5cdFx0XHRcdHZhciBpNCA9IGN5bEdlby5hZGRWZXJ0aWNlKCB2Mi54LCBoLCB2Mi56LCBDb2xvci5fV0hJVEUsIHR4MiwgdHkyKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRjeWxHZW8uYWRkTm9ybWFsKDAsIDEsIDApO1xyXG5cdFx0XHRcdGN5bEdlby5hZGROb3JtYWwoMCwgMSwgMCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Y3lsR2VvLmFkZEZhY2UoaTQsIGkxLCBpMyk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGlmICghb3BlbkJvdHRvbSl7XHJcblx0XHRcdFx0dmFyIGkzID0gY3lsR2VvLmFkZFZlcnRpY2UoIHYxLngsIC1oLCB2MS56LCBDb2xvci5fV0hJVEUsIHR4MSwgdHkxKTtcclxuXHRcdFx0XHR2YXIgaTQgPSBjeWxHZW8uYWRkVmVydGljZSggdjIueCwgLWgsIHYyLnosIENvbG9yLl9XSElURSwgdHgyLCB0eTIpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGN5bEdlby5hZGROb3JtYWwoMCwgLTEsIDApO1xyXG5cdFx0XHRcdGN5bEdlby5hZGROb3JtYWwoMCwgLTEsIDApO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGN5bEdlby5hZGRGYWNlKGkzLCBpMiwgaTQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGN5bEdlby5idWlsZCgpO1xyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gY3lsR2VvLnZlcnRleEJ1ZmZlcjtcclxuXHR0aGlzLnRleEJ1ZmZlciA9IGN5bEdlby50ZXhCdWZmZXI7XHJcblx0dGhpcy5mYWNlc0J1ZmZlciA9IGN5bEdlby5mYWNlc0J1ZmZlcjtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IGN5bEdlby5jb2xvcnNCdWZmZXI7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gY3lsR2VvLm5vcm1hbHNCdWZmZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnlDeWxpbmRlcjsiLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbnZhciBWZWN0b3I0ID0gcmVxdWlyZSgnLi9LVFZlY3RvcjQnKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5UGxhbmUod2lkdGgsIGhlaWdodCwgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0dGhpcy5yZWFkeSA9IHRydWU7XHJcblx0XHJcblx0dmFyIHBsYW5lR2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0XHJcblx0dmFyIHcgPSB3aWR0aCAvIDI7XHJcblx0dmFyIGggPSBoZWlnaHQgLyAyO1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHRcclxuXHR0aGlzLnV2UmVnaW9uID0gKHBhcmFtcy51dlJlZ2lvbik/IHBhcmFtcy51dlJlZ2lvbiA6IG5ldyBWZWN0b3I0KDAuMCwgMC4wLCAxLjAsIDEuMCk7XHJcblx0XHJcblx0dmFyIHhyID0gdGhpcy51dlJlZ2lvbi54O1xyXG5cdHZhciB5ciA9IHRoaXMudXZSZWdpb24ueTtcclxuXHR2YXIgaHIgPSB0aGlzLnV2UmVnaW9uLno7XHJcblx0dmFyIHZyID0gdGhpcy51dlJlZ2lvbi53O1xyXG5cdFxyXG5cdHBsYW5lR2VvLmFkZFZlcnRpY2UoIHcsIDAsICBoLCBDb2xvci5fV0hJVEUsIGhyLCB5cik7XHJcblx0cGxhbmVHZW8uYWRkVmVydGljZSgtdywgMCwgLWgsIENvbG9yLl9XSElURSwgeHIsIHZyKTtcclxuXHRwbGFuZUdlby5hZGRWZXJ0aWNlKC13LCAwLCAgaCwgQ29sb3IuX1dISVRFLCB4ciwgeXIpO1xyXG5cdHBsYW5lR2VvLmFkZFZlcnRpY2UoIHcsIDAsIC1oLCBDb2xvci5fV0hJVEUsIGhyLCB2cik7XHJcblx0XHJcblx0cGxhbmVHZW8uYWRkRmFjZSgwLCAxLCAyKTtcclxuXHRwbGFuZUdlby5hZGRGYWNlKDAsIDMsIDEpO1xyXG5cdFxyXG5cdHBsYW5lR2VvLmNvbXB1dGVGYWNlc05vcm1hbHMoKTtcclxuXHRwbGFuZUdlby5idWlsZCgpO1xyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gcGxhbmVHZW8udmVydGV4QnVmZmVyO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gcGxhbmVHZW8udGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBwbGFuZUdlby5mYWNlc0J1ZmZlcjtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IHBsYW5lR2VvLmNvbG9yc0J1ZmZlcjtcclxuXHR0aGlzLm5vcm1hbHNCdWZmZXIgPSBwbGFuZUdlby5ub3JtYWxzQnVmZmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5UGxhbmU7IiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG52YXIgVmVjdG9yNCA9IHJlcXVpcmUoJy4vS1RWZWN0b3I0Jyk7XHJcbnZhciBNYXRlcmlhbEJhc2ljID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsQmFzaWMnKTtcclxudmFyIE1lc2ggPSByZXF1aXJlKCcuL0tUTWVzaCcpO1xyXG52YXIgR2VvbWV0cnlQbGFuZSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeVBsYW5lJyk7XHJcbnZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcblxyXG5mdW5jdGlvbiBHZW9tZXRyeVNreWJveCh3aWR0aCwgaGVpZ2h0LCBsZW5ndGgsIHBvc2l0aW9uLCB0ZXh0dXJlcyl7XHJcblx0dGhpcy5tZXNoZXMgPSBbXTtcclxuXHRpZiAoIXRleHR1cmVzKSB0ZXh0dXJlcyA9IFtdO1xyXG5cdFxyXG5cdHZhciB3ID0gd2lkdGggLyAyO1xyXG5cdHZhciBsID0gbGVuZ3RoIC8gMjtcclxuXHR2YXIgaCA9IGhlaWdodCAvIDI7XHJcblx0dmFyIHYgPSAxLjA7XHJcblx0XHJcblx0dmFyIHhyID0gMC4wO1xyXG5cdHZhciB5ciA9IDAuMDtcclxuXHR2YXIgaHIgPSAxLjA7XHJcblx0dmFyIHZyID0gMS4wO1xyXG5cdFxyXG5cdHZhciBjdCA9IENvbG9yLl9XSElURTtcclxuXHR2YXIgY2IgPSBDb2xvci5fV0hJVEU7XHJcblx0XHJcblx0dmFyIGdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdHZhciBtYXQgPSBuZXcgTWF0ZXJpYWxCYXNpYyh0ZXh0dXJlc1tLVC5URVhUVVJFX0ZST05UXSwgQ29sb3IuX1dISVRFKTtcclxuXHRnZW8uYWRkVmVydGljZSgtdyAtdiwgLWggLXYsICBsLCBjYiwgaHIsIHlyKTtcclxuXHRnZW8uYWRkVmVydGljZSggdyArdiwgIGggK3YsICBsLCBjdCwgeHIsIHZyKTtcclxuXHRnZW8uYWRkVmVydGljZSggdyArdiwgLWggLXYsICBsLCBjYiwgeHIsIHlyKTtcclxuXHRnZW8uYWRkVmVydGljZSgtdyAtdiwgIGggK3YsICBsLCBjdCwgaHIsIHZyKTtcclxuXHRnZW8uYWRkRmFjZSgwLCAxLCAyKTtcclxuXHRnZW8uYWRkRmFjZSgwLCAzLCAxKTtcclxuXHRnZW8uYnVpbGQoKTtcclxuXHR0aGlzLm1lc2hlcy5wdXNoKG5ldyBNZXNoKGdlbywgbWF0KSk7XHJcblx0XHJcblx0dmFyIGdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdHZhciBtYXQgPSBuZXcgTWF0ZXJpYWxCYXNpYyh0ZXh0dXJlc1tLVC5URVhUVVJFX0JBQ0tdLCBDb2xvci5fV0hJVEUpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13IC12LCAtaCAtdiwgLWwsIGNiLCB4ciwgeXIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13IC12LCAgaCArdiwgLWwsIGN0LCB4ciwgdnIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKCB3ICt2LCAtaCAtdiwgLWwsIGNiLCBociwgeXIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKCB3ICt2LCAgaCArdiwgLWwsIGN0LCBociwgdnIpO1xyXG5cdGdlby5hZGRGYWNlKDAsIDIsIDEpO1xyXG5cdGdlby5hZGRGYWNlKDIsIDMsIDEpO1xyXG5cdGdlby5idWlsZCgpO1xyXG5cdHRoaXMubWVzaGVzLnB1c2gobmV3IE1lc2goZ2VvLCBtYXQpKTtcclxuXHRcclxuXHR2YXIgZ2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0dmFyIG1hdCA9IG5ldyBNYXRlcmlhbEJhc2ljKHRleHR1cmVzW0tULlRFWFRVUkVfUklHSFRdLCBDb2xvci5fV0hJVEUpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKCB3LCAtaCAtdiwgIGwgK3YsIGNiLCBociwgeXIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKCB3LCAgaCArdiwgLWwgLXYsIGN0LCB4ciwgdnIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKCB3LCAtaCAtdiwgLWwgLXYsIGNiLCB4ciwgeXIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKCB3LCAgaCArdiwgIGwgK3YsIGN0LCBociwgdnIpO1xyXG5cdGdlby5hZGRGYWNlKDAsIDEsIDIpO1xyXG5cdGdlby5hZGRGYWNlKDAsIDMsIDEpO1xyXG5cdGdlby5idWlsZCgpO1xyXG5cdHRoaXMubWVzaGVzLnB1c2gobmV3IE1lc2goZ2VvLCBtYXQpKTtcclxuXHRcclxuXHR2YXIgZ2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0dmFyIG1hdCA9IG5ldyBNYXRlcmlhbEJhc2ljKHRleHR1cmVzW0tULlRFWFRVUkVfTEVGVF0sIENvbG9yLl9XSElURSk7XHJcblx0Z2VvLmFkZFZlcnRpY2UoLXcsIC1oIC12LCAtbCAtdiwgY2IsIGhyLCB5cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoLXcsICBoICt2LCAtbCAtdiwgY3QsIGhyLCB2cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoLXcsIC1oIC12LCAgbCArdiwgY2IsIHhyLCB5cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoLXcsICBoICt2LCAgbCArdiwgY3QsIHhyLCB2cik7XHJcblx0Z2VvLmFkZEZhY2UoMCwgMSwgMik7XHJcblx0Z2VvLmFkZEZhY2UoMSwgMywgMik7XHJcblx0Z2VvLmJ1aWxkKCk7XHJcblx0dGhpcy5tZXNoZXMucHVzaChuZXcgTWVzaChnZW8sIG1hdCkpO1xyXG5cdFxyXG5cdHZhciBnZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHR2YXIgbWF0ID0gbmV3IE1hdGVyaWFsQmFzaWModGV4dHVyZXNbS1QuVEVYVFVSRV9VUF0sIENvbG9yLl9XSElURSk7XHJcblx0Z2VvLmFkZFZlcnRpY2UoIHcgK3YsICBoLCAtbCAtdiwgY3QsIGhyLCB5cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoLXcgLXYsICBoLCAgbCArdiwgY3QsIHhyLCB2cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoLXcgLXYsICBoLCAtbCAtdiwgY3QsIHhyLCB5cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoIHcgK3YsICBoLCAgbCArdiwgY3QsIGhyLCB2cik7XHJcblx0Z2VvLmFkZEZhY2UoMCwgMSwgMik7XHJcblx0Z2VvLmFkZEZhY2UoMCwgMywgMSk7XHJcblx0Z2VvLmJ1aWxkKCk7XHJcblx0dGhpcy5tZXNoZXMucHVzaChuZXcgTWVzaChnZW8sIG1hdCkpO1xyXG5cdFxyXG5cdHZhciBnZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHR2YXIgbWF0ID0gbmV3IE1hdGVyaWFsQmFzaWModGV4dHVyZXNbS1QuVEVYVFVSRV9ET1dOXSwgQ29sb3IuX1dISVRFKTtcclxuXHRtYXQuZHJhd0ZhY2VzID0gJ0JPVEgnO1xyXG5cdGdlby5hZGRWZXJ0aWNlKCB3ICt2LCAtaCwgLWwgLXYsIGNiLCBociwgdnIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13IC12LCAtaCwgIGwgK3YsIGNiLCB4ciwgeXIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13IC12LCAtaCwgLWwgLXYsIGNiLCB4ciwgdnIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKCB3ICt2LCAtaCwgIGwgK3YsIGNiLCBociwgeXIpO1xyXG5cdGdlby5hZGRGYWNlKDAsIDIsIDEpO1xyXG5cdGdlby5hZGRGYWNlKDAsIDEsIDMpO1xyXG5cdGdlby5jb21wdXRlRmFjZXNOb3JtYWxzKCk7XHJcblx0Z2VvLmJ1aWxkKCk7XHJcblx0dGhpcy5tZXNoZXMucHVzaChuZXcgTWVzaChnZW8sIG1hdCkpO1xyXG5cdFxyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPDY7aSsrKXtcclxuXHRcdHRoaXMubWVzaGVzW2ldLnBvc2l0aW9uID0gcG9zaXRpb247XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5U2t5Ym94OyIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxudmFyIFZlY3RvcjQgPSByZXF1aXJlKCcuL0tUVmVjdG9yNCcpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlTcGhlcmUocmFkaXVzLCBsYXRCYW5kcywgbG9uQmFuZHMsIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdHRoaXMucmVhZHkgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBzcGhHZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0XHJcblx0dGhpcy51dlJlZ2lvbiA9IChwYXJhbXMudXZSZWdpb24pPyBwYXJhbXMudXZSZWdpb24gOiBuZXcgVmVjdG9yNCgwLjAsIDAuMCwgMS4wLCAxLjApO1xyXG5cdFxyXG5cdHZhciB4ciA9IHRoaXMudXZSZWdpb24ueDtcclxuXHR2YXIgeXIgPSB0aGlzLnV2UmVnaW9uLnk7XHJcblx0dmFyIGhyID0gdGhpcy51dlJlZ2lvbi56IC0geHI7XHJcblx0dmFyIHZyID0gdGhpcy51dlJlZ2lvbi53IC0geXI7XHJcblx0dmFyIGhzID0gKHBhcmFtcy5oYWxmU3BoZXJlKT8gMS4wIDogMi4wO1xyXG5cdFxyXG5cdGZvciAodmFyIGxhdE49MDtsYXROPD1sYXRCYW5kcztsYXROKyspe1xyXG5cdFx0dmFyIHRoZXRhID0gbGF0TiAqIE1hdGguUEkgLyBsYXRCYW5kcztcclxuXHRcdHZhciBjb3NUID0gTWF0aC5jb3ModGhldGEpO1xyXG5cdFx0dmFyIHNpblQgPSBNYXRoLnNpbih0aGV0YSk7XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGxvbk49MDtsb25OPD1sb25CYW5kcztsb25OKyspe1xyXG5cdFx0XHR2YXIgcGhpID0gbG9uTiAqIGhzICogTWF0aC5QSSAvIGxvbkJhbmRzO1xyXG5cdFx0XHR2YXIgY29zUCA9IE1hdGguY29zKHBoaSk7XHJcblx0XHRcdHZhciBzaW5QID0gTWF0aC5zaW4ocGhpKTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciB4ID0gY29zUCAqIHNpblQ7XHJcblx0XHRcdHZhciB5ID0gY29zVDtcclxuXHRcdFx0dmFyIHogPSBzaW5QICogc2luVDtcclxuXHRcdFx0XHJcblx0XHRcdHZhciB0eCA9IGxvbk4gLyBsb25CYW5kcztcclxuXHRcdFx0dmFyIHR5ID0gMSAtIGxhdE4gLyBsYXRCYW5kcztcclxuXHRcdFx0XHJcblx0XHRcdHNwaEdlby5hZGROb3JtYWwoeCwgeSwgeik7XHJcblx0XHRcdHNwaEdlby5hZGRWZXJ0aWNlKHggKiByYWRpdXMsIHkgKiByYWRpdXMsIHogKiByYWRpdXMsIENvbG9yLl9XSElURSwgeHIgKyB0eCAqIGhyLCB5ciArIHR5ICogdnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBsYXROPTA7bGF0TjxsYXRCYW5kcztsYXROKyspe1xyXG5cdFx0Zm9yICh2YXIgbG9uTj0wO2xvbk48bG9uQmFuZHM7bG9uTisrKXtcclxuXHRcdFx0dmFyIGkxID0gbG9uTiArIChsYXROICogKGxvbkJhbmRzICsgMSkpO1xyXG5cdFx0XHR2YXIgaTIgPSBpMSArIGxvbkJhbmRzICsgMTtcclxuXHRcdFx0dmFyIGkzID0gaTEgKyAxO1xyXG5cdFx0XHR2YXIgaTQgPSBpMiArIDE7XHJcblx0XHRcdFxyXG5cdFx0XHRzcGhHZW8uYWRkRmFjZShpNCwgaTEsIGkzKTtcclxuXHRcdFx0c3BoR2VvLmFkZEZhY2UoaTQsIGkyLCBpMSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHNwaEdlby5idWlsZCgpO1xyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gc3BoR2VvLnZlcnRleEJ1ZmZlcjtcclxuXHR0aGlzLnRleEJ1ZmZlciA9IHNwaEdlby50ZXhCdWZmZXI7XHJcblx0dGhpcy5mYWNlc0J1ZmZlciA9IHNwaEdlby5mYWNlc0J1ZmZlcjtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IHNwaEdlby5jb2xvcnNCdWZmZXI7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gc3BoR2VvLm5vcm1hbHNCdWZmZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnlTcGhlcmU7IiwidmFyIFV0aWxzID0gcmVxdWlyZSgnLi9LVFV0aWxzJyk7XHJcbnZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBWZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxuXHJcbnZhciBJbnB1dCA9IHtcclxuXHRfa2V5czogW10sXHJcblx0X21vdXNlOiB7XHJcblx0XHRsZWZ0OiAwLFxyXG5cdFx0cmlnaHQ6IDAsXHJcblx0XHRtaWRkbGU6IDAsXHJcblx0XHR3aGVlbDogMCxcclxuXHRcdHBvc2l0aW9uOiBuZXcgVmVjdG9yMigwLjAsIDAuMClcclxuXHR9LFxyXG5cdFxyXG5cdHZLZXk6IHtcclxuXHRcdFNISUZUOiAxNixcclxuXHRcdFRBQjogOSxcclxuXHRcdENUUkw6IDE3LFxyXG5cdFx0QUxUOiAxOCxcclxuXHRcdFNQQUNFOiAzMixcclxuXHRcdEVOVEVSOiAxMyxcclxuXHRcdEJBQ0tTUEFDRTogOCxcclxuXHRcdEVTQzogMjcsXHJcblx0XHRJTlNFUlQ6IDQ1LFxyXG5cdFx0REVMOiA0NixcclxuXHRcdEVORDogMzUsXHJcblx0XHRTVEFSVDogMzYsXHJcblx0XHRQQUdFVVA6IDMzLFxyXG5cdFx0UEFHRURPV046IDM0XHJcblx0fSxcclxuXHRcclxuXHR2TW91c2U6IHtcclxuXHRcdExFRlQ6ICdsZWZ0JyxcclxuXHRcdFJJR0hUOiAncmlnaHQnLFxyXG5cdFx0TUlERExFOiAnbWlkZGxlJyxcclxuXHRcdFdIRUVMVVA6IDEsXHJcblx0XHRXSEVFTERPV046IC0xLFxyXG5cdH0sXHJcblx0XHJcblx0aXNLZXlEb3duOiBmdW5jdGlvbihrZXlDb2RlKXtcclxuXHRcdHJldHVybiAoSW5wdXQuX2tleXNba2V5Q29kZV0gPT0gMSk7XHJcblx0fSxcclxuXHRcclxuXHRpc0tleVByZXNzZWQ6IGZ1bmN0aW9uKGtleUNvZGUpe1xyXG5cdFx0aWYgKElucHV0Ll9rZXlzW2tleUNvZGVdID09IDEpe1xyXG5cdFx0XHRJbnB1dC5fa2V5c1trZXlDb2RlXSA9IDI7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRpc01vdXNlRG93bjogZnVuY3Rpb24obW91c2VCdXR0b24pe1xyXG5cdFx0cmV0dXJuIChJbnB1dC5fbW91c2VbbW91c2VCdXR0b25dID09IDEpO1xyXG5cdH0sXHJcblx0XHJcblx0aXNNb3VzZVByZXNzZWQ6IGZ1bmN0aW9uKG1vdXNlQnV0dG9uKXtcclxuXHRcdGlmIChJbnB1dC5fbW91c2VbbW91c2VCdXR0b25dID09IDEpe1xyXG5cdFx0XHRJbnB1dC5fbW91c2VbbW91c2VCdXR0b25dID0gMjtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGlzV2hlZWxNb3ZlZDogZnVuY3Rpb24od2hlZWxEaXIpe1xyXG5cdFx0aWYgKElucHV0Ll9tb3VzZS53aGVlbCA9PSB3aGVlbERpcil7XHJcblx0XHRcdElucHV0Ll9tb3VzZS53aGVlbCA9IDA7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVLZXlEb3duOiBmdW5jdGlvbihldil7XHJcblx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFxyXG5cdFx0aWYgKElucHV0Ll9rZXlzW2V2LmtleUNvZGVdID09IDIpIHJldHVybjtcclxuXHRcdElucHV0Ll9rZXlzW2V2LmtleUNvZGVdID0gMTtcclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZUtleVVwOiBmdW5jdGlvbihldil7XHJcblx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFxyXG5cdFx0SW5wdXQuX2tleXNbZXYua2V5Q29kZV0gPSAwO1xyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlTW91c2VEb3duOiBmdW5jdGlvbihldil7XHJcblx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFxyXG5cdFx0aWYgKGV2LndoaWNoID09IDEpe1xyXG5cdFx0XHRpZiAoSW5wdXQuX21vdXNlLmxlZnQgIT0gMilcclxuXHRcdFx0XHRJbnB1dC5fbW91c2UubGVmdCA9IDE7XHJcblx0XHR9ZWxzZSBpZiAoZXYud2hpY2ggPT0gMil7XHJcblx0XHRcdGlmIChJbnB1dC5fbW91c2UubWlkZGxlICE9IDIpXHJcblx0XHRcdFx0SW5wdXQuX21vdXNlLm1pZGRsZSA9IDE7XHJcblx0XHR9ZWxzZSBpZiAoZXYud2hpY2ggPT0gMyl7XHJcblx0XHRcdGlmIChJbnB1dC5fbW91c2UucmlnaHQgIT0gMilcclxuXHRcdFx0XHRJbnB1dC5fbW91c2UucmlnaHQgPSAxO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRJbnB1dC5oYW5kbGVNb3VzZU1vdmUoZXYpO1xyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZU1vdXNlVXA6IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHJcblx0XHRpZiAoZXYud2hpY2ggPT0gMSl7XHJcblx0XHRcdElucHV0Ll9tb3VzZS5sZWZ0ID0gMDtcclxuXHRcdH1lbHNlIGlmIChldi53aGljaCA9PSAyKXtcclxuXHRcdFx0SW5wdXQuX21vdXNlLm1pZGRsZSA9IDA7XHJcblx0XHR9ZWxzZSBpZiAoZXYud2hpY2ggPT0gMyl7XHJcblx0XHRcdElucHV0Ll9tb3VzZS5yaWdodCA9IDA7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdElucHV0LmhhbmRsZU1vdXNlTW92ZShldik7XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlTW91c2VXaGVlbDogZnVuY3Rpb24oZXYpe1xyXG5cdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcclxuXHRcdElucHV0Ll9tb3VzZS53aGVlbCA9IDA7XHJcblx0XHRpZiAoZXYud2hlZWxEZWx0YSA+IDApIElucHV0Ll9tb3VzZS53aGVlbCA9IDE7XHJcblx0XHRlbHNlIGlmIChldi53aGVlbERlbHRhIDwgMCkgSW5wdXQuX21vdXNlLndoZWVsID0gLTE7XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVNb3VzZU1vdmU6IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHJcblx0XHR2YXIgZWxYID0gZXYuY2xpZW50WCAtIGV2LnRhcmdldC5vZmZzZXRMZWZ0O1xyXG5cdFx0dmFyIGVsWSA9IGV2LmNsaWVudFkgLSBldi50YXJnZXQub2Zmc2V0VG9wO1xyXG5cdFx0XHJcblx0XHRJbnB1dC5fbW91c2UucG9zaXRpb24uc2V0KGVsWCwgZWxZKTtcclxuXHR9LFxyXG5cdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKGNhbnZhcyl7XHJcblx0XHRVdGlscy5hZGRFdmVudChkb2N1bWVudCwgJ2tleWRvd24nLCBJbnB1dC5oYW5kbGVLZXlEb3duKTtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGRvY3VtZW50LCAna2V5dXAnLCBJbnB1dC5oYW5kbGVLZXlVcCk7XHJcblx0XHRVdGlscy5hZGRFdmVudChjYW52YXMsICdtb3VzZWRvd24nLCBJbnB1dC5oYW5kbGVNb3VzZURvd24pO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoZG9jdW1lbnQsICdtb3VzZXVwJywgSW5wdXQuaGFuZGxlTW91c2VVcCk7XHJcblx0XHRVdGlscy5hZGRFdmVudChjYW52YXMsICdtb3VzZXdoZWVsJywgSW5wdXQuaGFuZGxlTW91c2VXaGVlbCk7XHJcblx0XHRVdGlscy5hZGRFdmVudChjYW52YXMsICdtb3VzZW1vdmUnLCBJbnB1dC5oYW5kbGVNb3VzZU1vdmUpO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoZG9jdW1lbnQsICdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGV2KXtcclxuXHRcdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoZXYudGFyZ2V0ID09PSBjYW52YXMpe1xyXG5cdFx0XHRcdGV2LmNhbmNlbEJ1YmJsZSA9IHRydWU7XHJcblx0XHRcdFx0ZXYucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuXHRcdFx0XHRpZiAoZXYucHJldmVudERlZmF1bHQpXHJcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdGlmIChldi5zdG9wUHJvcGFnYXRpb24pXHJcblx0XHRcdFx0XHRldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGk9MDtpPD05O2krKyl7XHJcblx0XHRcdElucHV0LnZLZXlbJ04nICsgaV0gPSA0OCArIGk7XHJcblx0XHRcdElucHV0LnZLZXlbJ05LJyArIGldID0gOTYgKyBpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTY1O2k8PTkwO2krKyl7XHJcblx0XHRcdElucHV0LnZLZXlbU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTE7aTw9MTI7aSsrKXtcclxuXHRcdFx0SW5wdXQudktleVsnRicgKyBpXSA9IDExMSArIGk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dDsiLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxuXHJcbmZ1bmN0aW9uIERpcmVjdGlvbmFsTGlnaHQoZGlyZWN0aW9uLCBjb2xvciwgaW50ZW5zaXR5KXtcclxuXHR0aGlzLl9fa3RkaXJMaWdodCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb24ubm9ybWFsaXplKCk7XHJcblx0dGhpcy5kaXJlY3Rpb24ubXVsdGlwbHkoLTEpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBuZXcgQ29sb3IoKGNvbG9yKT8gY29sb3I6IENvbG9yLl9XSElURSk7XHJcblx0dGhpcy5pbnRlbnNpdHkgPSAoaW50ZW5zaXR5ICE9PSB1bmRlZmluZWQpPyBpbnRlbnNpdHkgOiAxLjA7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aW9uYWxMaWdodDtcclxuXHJcbiIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG5cclxuZnVuY3Rpb24gTGlnaHRQb2ludChwb3NpdGlvbiwgaW50ZW5zaXR5LCBkaXN0YW5jZSwgY29sb3Ipe1xyXG5cdHRoaXMuX19rdHBvaW50bGlnaHQgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuXHR0aGlzLmludGVuc2l0eSA9IChpbnRlbnNpdHkpPyBpbnRlbnNpdHkgOiAxLjA7XHJcblx0dGhpcy5kaXN0YW5jZSA9IChkaXN0YW5jZSk/IGRpc3RhbmNlIDogMS4wO1xyXG5cdHRoaXMuY29sb3IgPSBuZXcgQ29sb3IoKGNvbG9yKT8gY29sb3IgOiBDb2xvci5fV0hJVEUpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExpZ2h0UG9pbnQ7IiwidmFyIFNoYWRlcnMgPSByZXF1aXJlKCcuL0tUU2hhZGVycycpO1xyXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL0tUSW5wdXQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFRFWFRVUkVfRlJPTlQ6IDAsXHJcblx0VEVYVFVSRV9CQUNLOiAxLFxyXG5cdFRFWFRVUkVfUklHSFQ6IDIsXHJcblx0VEVYVFVSRV9MRUZUOiAzLFxyXG5cdFRFWFRVUkVfVVA6IDQsXHJcblx0VEVYVFVSRV9ET1dOOiA1LFxyXG5cdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKGNhbnZhcyl7XHJcblx0XHR0aGlzLmNhbnZhcyA9IGNhbnZhcztcclxuXHRcdHRoaXMuZ2wgPSBudWxsO1xyXG5cdFx0dGhpcy5zaGFkZXJzID0ge307XHJcblx0XHR0aGlzLmltYWdlcyA9IFtdO1xyXG5cdFx0dGhpcy5tYXhBdHRyaWJMb2NhdGlvbnMgPSAwO1xyXG5cdFx0dGhpcy5sYXN0UHJvZ3JhbSA9IG51bGw7XHJcblx0XHRcclxuXHRcdHRoaXMuX19pbml0Q29udGV4dChjYW52YXMpO1xyXG5cdFx0dGhpcy5fX2luaXRQcm9wZXJ0aWVzKCk7XHJcblx0XHR0aGlzLl9faW5pdFNoYWRlcnMoKTtcclxuXHRcdFxyXG5cdFx0SW5wdXQuaW5pdChjYW52YXMpO1xyXG5cdH0sXHJcblx0XHJcblx0X19pbml0Q29udGV4dDogZnVuY3Rpb24oY2FudmFzKXtcclxuXHRcdHRoaXMuZ2wgPSBjYW52YXMuZ2V0Q29udGV4dCgnZXhwZXJpbWVudGFsLXdlYmdsJyk7XHJcblx0XHRcclxuXHRcdGlmICghdGhpcy5nbCl7XHJcblx0XHRcdGFsZXJ0KFwiWW91ciBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBXZWJHTFwiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLmdsLndpZHRoID0gY2FudmFzLndpZHRoO1xyXG5cdFx0dGhpcy5nbC5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0O1xyXG5cdH0sXHJcblx0XHJcblx0X19pbml0UHJvcGVydGllczogZnVuY3Rpb24oKXtcclxuXHRcdHZhciBnbCA9IHRoaXMuZ2w7XHJcblx0XHRcclxuXHRcdGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcclxuXHRcdGdsLmRlcHRoRnVuYyhnbC5MRVFVQUwpO1xyXG5cdFx0XHJcblx0XHRnbC5lbmFibGUoZ2wuQ1VMTF9GQUNFKTtcclxuXHRcdFxyXG5cdFx0Z2wuZGlzYWJsZSggZ2wuQkxFTkQgKTtcclxuXHRcdGdsLmJsZW5kRXF1YXRpb24oIGdsLkZVTkNfQUREICk7XHJcblx0XHRnbC5ibGVuZEZ1bmMoIGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSApO1xyXG5cdH0sXHJcblx0XHJcblx0X19pbml0U2hhZGVyczogZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuc2hhZGVycyA9IHt9O1xyXG5cdFx0dGhpcy5zaGFkZXJzLmJhc2ljID0gdGhpcy5wcm9jZXNzU2hhZGVyKFNoYWRlcnMuYmFzaWMpO1xyXG5cdFx0dGhpcy5zaGFkZXJzLmxhbWJlcnQgPSB0aGlzLnByb2Nlc3NTaGFkZXIoU2hhZGVycy5sYW1iZXJ0KTtcclxuXHRcdHRoaXMuc2hhZGVycy5waG9uZyA9IHRoaXMucHJvY2Vzc1NoYWRlcihTaGFkZXJzLnBob25nKTtcclxuXHR9LFxyXG5cdFxyXG5cdGNyZWF0ZUFycmF5QnVmZmVyOiBmdW5jdGlvbih0eXBlLCBkYXRhQXJyYXksIGl0ZW1TaXplKXtcclxuXHRcdHZhciBnbCA9IHRoaXMuZ2w7XHJcblx0XHR2YXIgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcblx0XHRnbC5iaW5kQnVmZmVyKGdsW3R5cGVdLCBidWZmZXIpO1xyXG5cdFx0Z2wuYnVmZmVyRGF0YShnbFt0eXBlXSwgZGF0YUFycmF5LCBnbC5TVEFUSUNfRFJBVyk7XHJcblx0XHRidWZmZXIubnVtSXRlbXMgPSBkYXRhQXJyYXkubGVuZ3RoO1xyXG5cdFx0YnVmZmVyLml0ZW1TaXplID0gaXRlbVNpemU7XHJcblx0XHRcclxuXHRcdHJldHVybiBidWZmZXI7XHJcblx0fSxcclxuXHRcclxuXHRnZXRTaGFkZXJBdHRyaWJ1dGVzQW5kVW5pZm9ybXM6IGZ1bmN0aW9uKHZlcnRleCwgZnJhZ21lbnQpe1xyXG5cdFx0dmFyIGF0dHJpYnV0ZXMgPSBbXTtcclxuXHRcdHZhciB1bmlmb3JtcyA9IFtdO1xyXG5cdFx0XHJcblx0XHR2YXIgc3RydWN0cyA9IFtdO1xyXG5cdFx0dmFyIHVuaWZvcm1zQXJyYXlzID0gW107XHJcblx0XHR2YXIgc3QgPSBudWxsO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dmVydGV4Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHR2YXIgbGluZSA9IHZlcnRleFtpXS50cmltKCk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAobGluZS5pbmRleE9mKFwiYXR0cmlidXRlIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtIDFdLnRyaW0oKTtcclxuXHRcdFx0XHRpZiAoYXR0cmlidXRlcy5pbmRleE9mKG5hbWUpID09IC0xKVxyXG5cdFx0XHRcdFx0YXR0cmlidXRlcy5wdXNoKHtuYW1lOiBuYW1lfSk7XHJcblx0XHRcdH1lbHNlIGlmIChsaW5lLmluZGV4T2YoXCJ1bmlmb3JtIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0aWYgKGxpbmUuaW5kZXhPZihcIltcIikgIT0gLTEpe1xyXG5cdFx0XHRcdFx0dW5pZm9ybXNBcnJheXMucHVzaChsaW5lKTtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgcCA9IGxpbmUuc3BsaXQoLyAvZyk7XHJcblx0XHRcdFx0dmFyIG5hbWUgPSBwW3AubGVuZ3RoIC0gMV0udHJpbSgpO1xyXG5cdFx0XHRcdGlmICh1bmlmb3Jtcy5pbmRleE9mKG5hbWUpID09IC0xKVxyXG5cdFx0XHRcdFx0dW5pZm9ybXMucHVzaCh7bmFtZTogbmFtZX0pO1xyXG5cdFx0XHR9ZWxzZSBpZiAobGluZS5pbmRleE9mKFwic3RydWN0XCIpID09IDApe1xyXG5cdFx0XHRcdHN0ID0geyBuYW1lOiBsaW5lLnJlcGxhY2UoXCJzdHJ1Y3QgXCIsIFwiXCIpLCBkYXRhOiBbXSB9O1xyXG5cdFx0XHRcdHN0cnVjdHMucHVzaChzdCk7XHJcblx0XHRcdH1lbHNlIGlmIChzdCAhPSBudWxsKXtcclxuXHRcdFx0XHRpZiAobGluZS50cmltKCkgPT0gXCJcIikgY29udGludWU7XHJcblx0XHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtMV0udHJpbSgpO1xyXG5cdFx0XHRcdHN0LmRhdGEucHVzaChuYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTxmcmFnbWVudC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0dmFyIGxpbmUgPSBmcmFnbWVudFtpXS50cmltKCk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAobGluZS5pbmRleE9mKFwiYXR0cmlidXRlIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtIDFdLnRyaW0oKTtcclxuXHRcdFx0XHRpZiAoYXR0cmlidXRlcy5pbmRleE9mKG5hbWUpID09IC0xKVxyXG5cdFx0XHRcdFx0YXR0cmlidXRlcy5wdXNoKHtuYW1lOiBuYW1lfSk7XHJcblx0XHRcdH1lbHNlIGlmIChsaW5lLmluZGV4T2YoXCJ1bmlmb3JtIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0aWYgKGxpbmUuaW5kZXhPZihcIltcIikgIT0gLTEpe1xyXG5cdFx0XHRcdFx0dW5pZm9ybXNBcnJheXMucHVzaChsaW5lKTtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgcCA9IGxpbmUuc3BsaXQoLyAvZyk7XHJcblx0XHRcdFx0dmFyIG5hbWUgPSBwW3AubGVuZ3RoIC0gMV0udHJpbSgpO1xyXG5cdFx0XHRcdGlmICh1bmlmb3Jtcy5pbmRleE9mKG5hbWUpID09IC0xKVxyXG5cdFx0XHRcdFx0dW5pZm9ybXMucHVzaCh7bmFtZTogbmFtZX0pO1xyXG5cdFx0XHR9ZWxzZSBpZiAobGluZS5pbmRleE9mKFwic3RydWN0XCIpICE9IC0xKXtcclxuXHRcdFx0XHRzdCA9IHsgbmFtZTogbGluZS5yZXBsYWNlKFwic3RydWN0IFwiLCBcIlwiKSwgZGF0YTogW10gfTtcclxuXHRcdFx0XHRzdHJ1Y3RzLnB1c2goc3QpO1xyXG5cdFx0XHR9ZWxzZSBpZiAoc3QgIT0gbnVsbCl7XHJcblx0XHRcdFx0aWYgKGxpbmUudHJpbSgpID09IFwiXCIpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdHZhciBwID0gbGluZS5zcGxpdCgvIC9nKTtcclxuXHRcdFx0XHR2YXIgbmFtZSA9IHBbcC5sZW5ndGggLTFdLnRyaW0oKTtcclxuXHRcdFx0XHRzdC5kYXRhLnB1c2gobmFtZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3Jtc0FycmF5cy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdFx0dmFyIGxpbmUgPSB1bmlmb3Jtc0FycmF5c1tpXTtcclxuXHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHR2YXIgdHlwZSA9IHBbcC5sZW5ndGggLSAyXS50cmltKCk7XHJcblx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtIDFdLnRyaW0oKTtcclxuXHRcdFx0dmFyIHVuaUxlbiA9IHBhcnNlSW50KG5hbWUuc3Vic3RyaW5nKG5hbWUuaW5kZXhPZihcIltcIikgKyAxLCBuYW1lLmluZGV4T2YoXCJdXCIpKSwgMTApO1xyXG5cdFx0XHR2YXIgbmFtZSA9IG5hbWUuc3Vic3RyaW5nKDAsIG5hbWUuaW5kZXhPZihcIltcIikpO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHN0ciA9IG51bGw7XHJcblx0XHRcdGZvciAodmFyIGo9MCxqbGVuPXN0cnVjdHMubGVuZ3RoO2o8amxlbjtqKyspe1xyXG5cdFx0XHRcdGlmIChzdHJ1Y3RzW2pdLm5hbWUgPT0gdHlwZSl7XHJcblx0XHRcdFx0XHRzdHIgPSBzdHJ1Y3RzW2pdO1xyXG5cdFx0XHRcdFx0aiA9IGpsZW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoc3RyKXtcclxuXHRcdFx0XHR2YXIgc3RydWN0VW5pID0gW107XHJcblx0XHRcdFx0Zm9yICh2YXIgaj0wO2o8dW5pTGVuO2orKyl7XHJcblx0XHRcdFx0XHRzdHJ1Y3RVbmlbal0gPSAoe25hbWU6IG5hbWUsIGxlbjogdW5pTGVuLCBkYXRhOiBbXX0pO1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaz0wLGtsZW49c3RyLmRhdGEubGVuZ3RoO2s8a2xlbjtrKyspe1xyXG5cdFx0XHRcdFx0XHR2YXIgcHJvcCA9IHN0ci5kYXRhW2tdO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0c3RydWN0VW5pW2pdLmRhdGEucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0bmFtZTogcHJvcCxcclxuXHRcdFx0XHRcdFx0XHRsb2NOYW1lOiBuYW1lICsgXCJbXCIgKyBqICsgXCJdLlwiICsgcHJvcFxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dW5pZm9ybXMucHVzaCh7XHJcblx0XHRcdFx0XHRtdWx0aTogdHJ1ZSxcclxuXHRcdFx0XHRcdGRhdGE6IHN0cnVjdFVuaSxcclxuXHRcdFx0XHRcdHR5cGU6IHR5cGVcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxyXG5cdFx0XHR1bmlmb3JtczogdW5pZm9ybXNcclxuXHRcdH07XHJcblx0fSxcclxuXHRcclxuXHRwcm9jZXNzU2hhZGVyOiBmdW5jdGlvbihzaGFkZXIpe1xyXG5cdFx0dmFyIGdsID0gdGhpcy5nbDtcclxuXHRcdFxyXG5cdFx0dmFyIHZDb2RlID0gc2hhZGVyLnZlcnRleFNoYWRlcjtcclxuXHRcdHZhciB2U2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLlZFUlRFWF9TSEFERVIpO1xyXG5cdFx0Z2wuc2hhZGVyU291cmNlKHZTaGFkZXIsIHZDb2RlKTtcclxuXHRcdGdsLmNvbXBpbGVTaGFkZXIodlNoYWRlcik7XHJcblx0XHRcclxuXHRcdHZhciBmQ29kZSA9IHNoYWRlci5mcmFnbWVudFNoYWRlcjtcclxuXHRcdHZhciBmU2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLkZSQUdNRU5UX1NIQURFUik7XHJcblx0XHRnbC5zaGFkZXJTb3VyY2UoZlNoYWRlciwgZkNvZGUpO1xyXG5cdFx0Z2wuY29tcGlsZVNoYWRlcihmU2hhZGVyKTtcclxuXHRcdFxyXG5cdFx0dmFyIHNoYWRlclByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XHJcblx0XHRnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgdlNoYWRlcik7XHJcblx0XHRnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgZlNoYWRlcik7XHJcblx0XHRnbC5saW5rUHJvZ3JhbShzaGFkZXJQcm9ncmFtKTtcclxuXHRcdFxyXG5cdFx0dmFyIHBhcmFtcyA9IHRoaXMuZ2V0U2hhZGVyQXR0cmlidXRlc0FuZFVuaWZvcm1zKHZDb2RlLnNwbGl0KC9bO3t9XSsvKSwgZkNvZGUuc3BsaXQoL1s7e31dKy8pKTtcclxuXHRcdFxyXG5cdFx0aWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHNoYWRlclByb2dyYW0sIGdsLkxJTktfU1RBVFVTKSl7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJFcnJvciBpbml0aWFsaXppbmcgdGhlIHNoYWRlciBwcm9ncmFtXCIpO1xyXG5cdFx0XHR0aHJvdyBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlclByb2dyYW0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgYXR0cmlidXRlcyA9IFtdO1xyXG5cdFx0dGhpcy5tYXhBdHRyaWJMb2NhdGlvbnMgPSBNYXRoLm1heCh0aGlzLm1heEF0dHJpYkxvY2F0aW9ucywgcGFyYW1zLmF0dHJpYnV0ZXMubGVuZ3RoKTtcclxuXHRcdGZvciAodmFyIGk9MCxsZW49cGFyYW1zLmF0dHJpYnV0ZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHRcdHZhciBhdHQgPSBwYXJhbXMuYXR0cmlidXRlc1tpXTtcclxuXHRcdFx0dmFyIGxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgYXR0Lm5hbWUpO1xyXG5cdFx0XHRcclxuXHRcdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkobG9jYXRpb24pO1xyXG5cdFx0XHRcclxuXHRcdFx0YXR0cmlidXRlcy5wdXNoKHtcclxuXHRcdFx0XHRuYW1lOiBhdHQubmFtZSxcclxuXHRcdFx0XHRsb2NhdGlvbjogbG9jYXRpb25cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciB1bmlmb3JtcyA9IFtdO1xyXG5cdFx0Zm9yICh2YXIgaT0wLGxlbj1wYXJhbXMudW5pZm9ybXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHRcdHZhciB1bmkgPSBwYXJhbXMudW5pZm9ybXNbaV07XHJcblx0XHRcdGlmICh1bmkubXVsdGkpe1xyXG5cdFx0XHRcdGZvciAodmFyIGo9MCxqbGVuPXVuaS5kYXRhLmxlbmd0aDtqPGpsZW47aisrKXtcclxuXHRcdFx0XHRcdHZhciB1bmlEID0gdW5pLmRhdGFbal07XHJcblx0XHRcdFx0XHRmb3IgKHZhciBrPTAsa2xlbj11bmlELmRhdGEubGVuZ3RoO2s8a2xlbjtrKyspe1xyXG5cdFx0XHRcdFx0XHR2YXIgZGF0ID0gdW5pRC5kYXRhW2tdO1xyXG5cdFx0XHRcdFx0XHRkYXQubG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgZGF0LmxvY05hbWUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHR1bmlmb3Jtcy5wdXNoKHVuaSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHZhciBsb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCB1bmkubmFtZSk7XHJcblx0XHRcdFxyXG5cdFx0XHRcdHVuaWZvcm1zLnB1c2goe1xyXG5cdFx0XHRcdFx0bmFtZTogdW5pLm5hbWUsXHJcblx0XHRcdFx0XHRsb2NhdGlvbjogbG9jYXRpb25cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRzaGFkZXJQcm9ncmFtOiBzaGFkZXJQcm9ncmFtLFxyXG5cdFx0XHRhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxyXG5cdFx0XHR1bmlmb3JtczogdW5pZm9ybXNcclxuXHRcdH07XHJcblx0fSxcclxuXHRcclxuXHRzd2l0Y2hQcm9ncmFtOiBmdW5jdGlvbihzaGFkZXIpe1xyXG5cdFx0aWYgKHRoaXMubGFzdFByb2dyYW0gPT09IHNoYWRlcikgcmV0dXJuO1xyXG5cdFx0dmFyIGdsID0gdGhpcy5nbDtcclxuXHRcdFxyXG5cdFx0dGhpcy5sYXN0UHJvZ3JhbSA9IHNoYWRlcjtcclxuXHRcdGdsLnVzZVByb2dyYW0oc2hhZGVyLnNoYWRlclByb2dyYW0pO1xyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLm1heEF0dHJpYkxvY2F0aW9ucztpKyspe1xyXG5cdFx0XHRpZiAoaSA8IHNoYWRlci5hdHRyaWJ1dGVzLmxlbmd0aCl7XHJcblx0XHRcdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoaSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheShpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Z2V0SW1hZ2U6IGZ1bmN0aW9uKHNyYyl7XHJcblx0XHRmb3IgKHZhciBpPTAsbGVuPXRoaXMuaW1hZ2VzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0XHRpZiAodGhpcy5pbWFnZXNbaV0uc3JjID09IHNyYylcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbWFnZXNbaV0uaW1nO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcbn07XHJcblxyXG5cclxuIiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcblxyXG5mdW5jdGlvbiBNYXRlcmlhbChwYXJhbWV0ZXJzKXtcclxuXHR0aGlzLl9fa3RtYXRlcmlhbCA9IHRydWU7XHJcblx0XHJcblx0aWYgKCFwYXJhbWV0ZXJzKSBwYXJhbWV0ZXJzID0ge307XHJcblx0XHJcblx0dGhpcy50ZXh0dXJlTWFwID0gKHBhcmFtZXRlcnMudGV4dHVyZU1hcCk/IHBhcmFtZXRlcnMudGV4dHVyZU1hcCA6IG51bGw7XHJcblx0dGhpcy5jb2xvciA9IG5ldyBDb2xvcigocGFyYW1ldGVycy5jb2xvcik/IHBhcmFtZXRlcnMuY29sb3IgOiBDb2xvci5fV0hJVEUpO1xyXG5cdHRoaXMub3BhY2l0eSA9IChwYXJhbWV0ZXJzLm9wYWNpdHkpPyBwYXJhbWV0ZXJzLm9wYWNpdHkgOiAxLjA7XHJcblx0dGhpcy50cmFuc3BhcmVudCA9IChwYXJhbWV0ZXJzLnRyYW5zcGFyZW50KT8gcGFyYW1ldGVycy50cmFuc3BhcmVudCA6IGZhbHNlO1xyXG5cdHRoaXMuZHJhd0ZhY2VzID0gKHBhcmFtZXRlcnMuZHJhd0ZhY2VzKT8gcGFyYW1ldGVycy5kcmF3RmFjZXMgOiAnRlJPTlQnO1xyXG5cdHRoaXMuZHJhd0FzID0gKHBhcmFtZXRlcnMuZHJhd0FzKT8gcGFyYW1ldGVycy5kcmF3QXMgOiAnVFJJQU5HTEVTJztcclxuXHR0aGlzLnNoYWRlciA9IChwYXJhbWV0ZXJzLnNoYWRlcik/IHBhcmFtZXRlcnMuc2hhZGVyIDogbnVsbDtcclxuXHR0aGlzLnNlbmRBdHRyaWJEYXRhID0gKHBhcmFtZXRlcnMuc2VuZEF0dHJpYkRhdGEpPyBwYXJhbWV0ZXJzLnNlbmRBdHRyaWJEYXRhIDogbnVsbDtcclxuXHR0aGlzLnNlbmRVbmlmb3JtRGF0YSA9IChwYXJhbWV0ZXJzLnNlbmRVbmlmb3JtRGF0YSk/IHBhcmFtZXRlcnMuc2VuZFVuaWZvcm1EYXRhIDogbnVsbDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRlcmlhbDsiLCJ2YXIgTWF0ZXJpYWwgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWwnKTtcclxudmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxuXHJcbmZ1bmN0aW9uIE1hdGVyaWFsQmFzaWModGV4dHVyZU1hcCwgY29sb3Ipe1xyXG5cdHRoaXMuX19rdG1hdGVyaWFsID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgbWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoe1xyXG5cdFx0dGV4dHVyZU1hcDogdGV4dHVyZU1hcCxcclxuXHRcdGNvbG9yOiBjb2xvcixcclxuXHRcdHNoYWRlcjogS1Quc2hhZGVycy5iYXNpY1xyXG5cdH0pO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZU1hcCA9IG1hdGVyaWFsLnRleHR1cmVNYXA7XHJcblx0dGhpcy5jb2xvciA9IG1hdGVyaWFsLmNvbG9yO1xyXG5cdHRoaXMuc2hhZGVyID0gbWF0ZXJpYWwuc2hhZGVyO1xyXG5cdHRoaXMub3BhY2l0eSA9IG1hdGVyaWFsLm9wYWNpdHk7XHJcblx0dGhpcy5kcmF3RmFjZXMgPSBtYXRlcmlhbC5kcmF3RmFjZXM7XHJcblx0dGhpcy5kcmF3QXMgPSBtYXRlcmlhbC5kcmF3QXM7XHJcblx0dGhpcy50cmFuc3BhcmVudCA9IG1hdGVyaWFsLnRyYW5zcGFyZW50O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGVyaWFsQmFzaWM7XHJcblxyXG5NYXRlcmlhbEJhc2ljLnByb3RvdHlwZS5zZW5kQXR0cmliRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG5cdGZvciAodmFyIGk9MCxsZW49YXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBhdHQgPSBhdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4UG9zaXRpb25cIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleENvbG9yXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LmNvbG9yc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFUZXh0dXJlQ29vcmRcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS50ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdGVyaWFsQmFzaWMucHJvdG90eXBlLnNlbmRVbmlmb3JtRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIHRyYW5zZm9ybWF0aW9uTWF0cml4O1xyXG5cdHZhciB1bmlmb3JtcyA9IHRoaXMuc2hhZGVyLnVuaWZvcm1zO1xyXG5cdGZvciAodmFyIGk9MCxsZW49dW5pZm9ybXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgdW5pID0gdW5pZm9ybXNbaV07XHJcblx0XHRcclxuXHRcdGlmICh1bmkubmFtZSA9PSAndU1WUE1hdHJpeCcpe1xyXG5cdFx0XHR0cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG1lc2guZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKS5tdWx0aXBseShjYW1lcmEudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG5cdFx0XHR2YXIgbXZwID0gdHJhbnNmb3JtYXRpb25NYXRyaXguY2xvbmUoKS5tdWx0aXBseShjYW1lcmEucGVyc3BlY3RpdmVNYXRyaXgpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG12cC50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1hdGVyaWFsQ29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gbWVzaC5tYXRlcmlhbC5jb2xvci5nZXRSR0JBKCk7XHJcblx0XHRcdGdsLnVuaWZvcm00ZnYodW5pLmxvY2F0aW9uLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9yKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlU2FtcGxlcicpe1xyXG5cdFx0XHRpZiAobWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwKTtcclxuXHRcdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAudGV4dHVyZSk7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUhhc1RleHR1cmUnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVSZXBlYXQnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm0yZih1bmkubG9jYXRpb24sIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5yZXBlYXQueCwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLnJlcGVhdC55KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUdlb21ldHJ5VVYnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm00Zih1bmkubG9jYXRpb24sIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueCwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi55LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLnosIG1lc2guZ2VvbWV0cnkudXZSZWdpb24udyk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlT2Zmc2V0JyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtMmYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAub2Zmc2V0LngsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5vZmZzZXQueSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4iLCJ2YXIgTWF0ZXJpYWwgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWwnKTtcclxuXHJcbmZ1bmN0aW9uIE1hdGVyaWFsTGFtYmVydCh0ZXh0dXJlTWFwLCBjb2xvciwgb3BhY2l0eSl7XHJcblx0dGhpcy5fX2t0bWF0ZXJpYWwgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBtYXRlcmlhbCA9IG5ldyBNYXRlcmlhbCh7XHJcblx0XHR0ZXh0dXJlTWFwOiB0ZXh0dXJlTWFwLFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdFx0b3BhY2l0eTogb3BhY2l0eSxcclxuXHRcdHNoYWRlcjogS1Quc2hhZGVycy5sYW1iZXJ0XHJcblx0fSk7XHJcblx0XHJcblx0dGhpcy50ZXh0dXJlTWFwID0gbWF0ZXJpYWwudGV4dHVyZU1hcDtcclxuXHR0aGlzLmNvbG9yID0gbWF0ZXJpYWwuY29sb3I7XHJcblx0dGhpcy5zaGFkZXIgPSBtYXRlcmlhbC5zaGFkZXI7XHJcblx0dGhpcy5vcGFjaXR5ID0gbWF0ZXJpYWwub3BhY2l0eTtcclxuXHR0aGlzLmRyYXdGYWNlcyA9IG1hdGVyaWFsLmRyYXdGYWNlcztcclxuXHR0aGlzLmRyYXdBcyA9IG1hdGVyaWFsLmRyYXdBcztcclxuXHR0aGlzLnRyYW5zcGFyZW50ID0gbWF0ZXJpYWwudHJhbnNwYXJlbnQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0ZXJpYWxMYW1iZXJ0O1xyXG5cclxuTWF0ZXJpYWxMYW1iZXJ0LnByb3RvdHlwZS5zZW5kQXR0cmliRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG5cdGZvciAodmFyIGk9MCxsZW49YXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBhdHQgPSBhdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4UG9zaXRpb25cIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleENvbG9yXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LmNvbG9yc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFUZXh0dXJlQ29vcmRcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS50ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleE5vcm1hbFwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5Lm5vcm1hbHNCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkubm9ybWFsc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRlcmlhbExhbWJlcnQucHJvdG90eXBlLnNlbmRMaWdodFVuaWZvcm1EYXRhID0gZnVuY3Rpb24obGlnaHQsIHVuaWZvcm0pe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdGZvciAodmFyIGk9MCxsZW49dW5pZm9ybS5kYXRhLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIGRhdCA9IHVuaWZvcm0uZGF0YVtpXTtcclxuXHRcdFxyXG5cdFx0aWYgKGRhdC5uYW1lID09ICdwb3NpdGlvbicgJiYgbGlnaHQuX19rdHBvaW50bGlnaHQpe1xyXG5cdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCBsaWdodC5wb3NpdGlvbi54LCBsaWdodC5wb3NpdGlvbi55LCBsaWdodC5wb3NpdGlvbi56KTtcclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnZGlyZWN0aW9uJyAmJiBsaWdodC5fX2t0ZGlyTGlnaHQpe1xyXG5cdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCBsaWdodC5kaXJlY3Rpb24ueCwgbGlnaHQuZGlyZWN0aW9uLnksIGxpZ2h0LmRpcmVjdGlvbi56KTtcclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnY29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gbGlnaHQuY29sb3IuZ2V0UkdCKCk7XHJcblx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0pO1xyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdpbnRlbnNpdHknKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFmKGRhdC5sb2NhdGlvbiwgbGlnaHQuaW50ZW5zaXR5KTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5NYXRlcmlhbExhbWJlcnQucHJvdG90eXBlLnNlbmRVbmlmb3JtRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIHRyYW5zZm9ybWF0aW9uTWF0cml4O1xyXG5cdHZhciB1bmlmb3JtcyA9IHRoaXMuc2hhZGVyLnVuaWZvcm1zO1xyXG5cdHZhciBtb2RlbFRyYW5zZm9ybWF0aW9uO1xyXG5cdHZhciB1c2VkTGlnaHRVbmlmb3JtID0gbnVsbDtcclxuXHR2YXIgbGlnaHRzQ291bnQgPSAwO1xyXG5cdGZvciAodmFyIGk9MCxsZW49dW5pZm9ybXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgdW5pID0gdW5pZm9ybXNbaV07XHJcblx0XHRcclxuXHRcdGlmICh1bmkubXVsdGkgJiYgdW5pLnR5cGUgPT0gJ0xpZ2h0Jyl7XHJcblx0XHRcdGlmIChsaWdodHNDb3VudCA9PSB1bmkuZGF0YS5sZW5ndGgpXHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHJcblx0XHRcdHZhciBsaWdodHMgPSBzY2VuZS5saWdodHM7XHJcblx0XHRcdGZvciAodmFyIGo9MCxqbGVuPWxpZ2h0cy5sZW5ndGg7ajxqbGVuO2orKyl7XHJcblx0XHRcdFx0dGhpcy5zZW5kTGlnaHRVbmlmb3JtRGF0YShsaWdodHNbal0sIHVuaS5kYXRhW2xpZ2h0c0NvdW50KytdKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TVZNYXRyaXgnKXtcclxuXHRcdFx0bW9kZWxUcmFuc2Zvcm1hdGlvbiA9IG1lc2guZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuXHRcdFx0dHJhbnNmb3JtYXRpb25NYXRyaXggPSBtb2RlbFRyYW5zZm9ybWF0aW9uLmNsb25lKCkubXVsdGlwbHkoY2FtZXJhLnRyYW5zZm9ybWF0aW9uTWF0cml4KTtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdih1bmkubG9jYXRpb24sIGZhbHNlLCB0cmFuc2Zvcm1hdGlvbk1hdHJpeC50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVBNYXRyaXgnKXtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdih1bmkubG9jYXRpb24sIGZhbHNlLCBjYW1lcmEucGVyc3BlY3RpdmVNYXRyaXgudG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VNYXRlcmlhbENvbG9yJyl7XHJcblx0XHRcdHZhciBjb2xvciA9IG1lc2gubWF0ZXJpYWwuY29sb3IuZ2V0UkdCQSgpO1xyXG5cdFx0XHRnbC51bmlmb3JtNGZ2KHVuaS5sb2NhdGlvbiwgbmV3IEZsb2F0MzJBcnJheShjb2xvcikpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VGV4dHVyZVNhbXBsZXInKXtcclxuXHRcdFx0aWYgKG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdFx0Z2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCk7XHJcblx0XHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLnRleHR1cmUpO1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIDApO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VIYXNUZXh0dXJlJyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIChtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApPyAxIDogMCk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VVc2VMaWdodGluZycpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAoc2NlbmUudXNlTGlnaHRpbmcpPyAxIDogMCk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VOb3JtYWxNYXRyaXgnKXtcclxuXHRcdFx0dmFyIG5vcm1hbE1hdHJpeCA9IG1vZGVsVHJhbnNmb3JtYXRpb24udG9NYXRyaXgzKCkuaW52ZXJzZSgpLnRvRmxvYXQzMkFycmF5KCk7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXgzZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgbm9ybWFsTWF0cml4KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1vZGVsTWF0cml4Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgbW9kZWxUcmFuc2Zvcm1hdGlvbi50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUFtYmllbnRMaWdodENvbG9yJyAmJiBzY2VuZS51c2VMaWdodGluZyAmJiBzY2VuZS5hbWJpZW50TGlnaHQpe1xyXG5cdFx0XHR2YXIgY29sb3IgPSBzY2VuZS5hbWJpZW50TGlnaHQuZ2V0UkdCKCk7XHJcblx0XHRcdGdsLnVuaWZvcm0zZih1bmkubG9jYXRpb24sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0pO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1T3BhY2l0eScpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLm9wYWNpdHkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VGV4dHVyZVJlcGVhdCcgJiYgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0Z2wudW5pZm9ybTJmKHVuaS5sb2NhdGlvbiwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLnJlcGVhdC54LCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAucmVwZWF0LnkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1R2VvbWV0cnlVVicgJiYgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0Z2wudW5pZm9ybTRmKHVuaS5sb2NhdGlvbiwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi54LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLnksIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueiwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi53KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVPZmZzZXQnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm0yZih1bmkubG9jYXRpb24sIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5vZmZzZXQueCwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLm9mZnNldC55KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndXNlZExpZ2h0cycpe1xyXG5cdFx0XHR1c2VkTGlnaHRVbmlmb3JtID0gdW5pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRpZiAodXNlZExpZ2h0VW5pZm9ybSl7XHJcblx0XHRnbC51bmlmb3JtMWkodXNlZExpZ2h0VW5pZm9ybS5sb2NhdGlvbiwgbGlnaHRzQ291bnQpO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTsiLCJ2YXIgTWF0ZXJpYWwgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWwnKTtcclxudmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcblxyXG5mdW5jdGlvbiBNYXRlcmlhbFBob25nKHRleHR1cmVNYXAsIGNvbG9yLCBvcGFjaXR5KXtcclxuXHR0aGlzLl9fa3RtYXRlcmlhbCA9IHRydWU7XHJcblx0XHJcblx0dmFyIG1hdGVyaWFsID0gbmV3IE1hdGVyaWFsKHtcclxuXHRcdHRleHR1cmVNYXA6IHRleHR1cmVNYXAsXHJcblx0XHRjb2xvcjogY29sb3IsXHJcblx0XHRvcGFjaXR5OiBvcGFjaXR5LFxyXG5cdFx0c2hhZGVyOiBLVC5zaGFkZXJzLnBob25nXHJcblx0fSk7XHJcblx0XHJcblx0dGhpcy50ZXh0dXJlTWFwID0gbWF0ZXJpYWwudGV4dHVyZU1hcDtcclxuXHR0aGlzLnNwZWN1bGFyTWFwID0gbnVsbDtcclxuXHRcclxuXHR0aGlzLmNvbG9yID0gbWF0ZXJpYWwuY29sb3I7XHJcblx0dGhpcy5zaGFkZXIgPSBtYXRlcmlhbC5zaGFkZXI7XHJcblx0dGhpcy5vcGFjaXR5ID0gbWF0ZXJpYWwub3BhY2l0eTtcclxuXHR0aGlzLmRyYXdGYWNlcyA9IG1hdGVyaWFsLmRyYXdGYWNlcztcclxuXHR0aGlzLmRyYXdBcyA9IG1hdGVyaWFsLmRyYXdBcztcclxuXHR0aGlzLnNwZWN1bGFyQ29sb3IgPSBuZXcgQ29sb3IoQ29sb3IuX1dISVRFKTtcclxuXHR0aGlzLnNoaW5pbmVzcyA9IDAuMDtcclxuXHR0aGlzLnRyYW5zcGFyZW50ID0gbWF0ZXJpYWwudHJhbnNwYXJlbnQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0ZXJpYWxQaG9uZztcclxuXHJcbk1hdGVyaWFsUGhvbmcucHJvdG90eXBlLnNlbmRBdHRyaWJEYXRhID0gZnVuY3Rpb24obWVzaCwgY2FtZXJhLCBzY2VuZSl7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0dmFyIGdlb21ldHJ5ID0gbWVzaC5nZW9tZXRyeTtcclxuXHR2YXIgYXR0cmlidXRlcyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcblx0Zm9yICh2YXIgaT0wLGxlbj1hdHRyaWJ1dGVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIGF0dCA9IGF0dHJpYnV0ZXNbaV07XHJcblx0XHRcclxuXHRcdGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhQb3NpdGlvblwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LnZlcnRleEJ1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9ZWxzZSBpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4Q29sb3JcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS5jb2xvcnNCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVRleHR1cmVDb29yZFwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LnRleEJ1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS50ZXhCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9ZWxzZSBpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4Tm9ybWFsXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkubm9ybWFsc0J1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS5ub3JtYWxzQnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdGVyaWFsUGhvbmcucHJvdG90eXBlLnNlbmRMaWdodFVuaWZvcm1EYXRhID0gZnVuY3Rpb24obGlnaHQsIHVuaWZvcm0pe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdGZvciAodmFyIGk9MCxsZW49dW5pZm9ybS5kYXRhLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIGRhdCA9IHVuaWZvcm0uZGF0YVtpXTtcclxuXHRcdFxyXG5cdFx0aWYgKGRhdC5uYW1lID09ICdwb3NpdGlvbicpe1xyXG5cdFx0XHRpZiAobGlnaHQuX19rdHBvaW50bGlnaHQpe1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIGxpZ2h0LnBvc2l0aW9uLngsIGxpZ2h0LnBvc2l0aW9uLnksIGxpZ2h0LnBvc2l0aW9uLnopO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCAwLjAsIDAuMCwgMC4wKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdkaXJlY3Rpb24nKXtcclxuXHRcdFx0aWYgKGxpZ2h0Ll9fa3RkaXJMaWdodCl7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgbGlnaHQuZGlyZWN0aW9uLngsIGxpZ2h0LmRpcmVjdGlvbi55LCBsaWdodC5kaXJlY3Rpb24ueik7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIDAuMCwgMC4wLCAwLjApO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ2NvbG9yJyl7XHJcblx0XHRcdHZhciBjb2xvciA9IGxpZ2h0LmNvbG9yLmdldFJHQigpO1xyXG5cdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdKTtcclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnaW50ZW5zaXR5Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIGxpZ2h0LmludGVuc2l0eSk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuTWF0ZXJpYWxQaG9uZy5wcm90b3R5cGUuc2VuZFVuaWZvcm1EYXRhID0gZnVuY3Rpb24obWVzaCwgY2FtZXJhLCBzY2VuZSl7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0dmFyIGdlb21ldHJ5ID0gbWVzaC5nZW9tZXRyeTtcclxuXHR2YXIgdHJhbnNmb3JtYXRpb25NYXRyaXg7XHJcblx0dmFyIHVuaWZvcm1zID0gdGhpcy5zaGFkZXIudW5pZm9ybXM7XHJcblx0dmFyIG1vZGVsVHJhbnNmb3JtYXRpb247XHJcblx0dmFyIGxpZ2h0c0NvdW50ID0gMDtcclxuXHRcclxuXHR2YXIgdXNlZExpZ2h0VW5pZm9ybSA9IG51bGw7XHJcblx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3Jtcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciB1bmkgPSB1bmlmb3Jtc1tpXTtcclxuXHRcdFxyXG5cdFx0aWYgKHVuaS5tdWx0aSAmJiB1bmkudHlwZSA9PSAnTGlnaHQnKXtcclxuXHRcdFx0aWYgKGxpZ2h0c0NvdW50ID09IHVuaS5kYXRhLmxlbmd0aClcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0dmFyIGxpZ2h0cyA9IHNjZW5lLmxpZ2h0cztcclxuXHRcdFx0Zm9yICh2YXIgaj0wLGpsZW49bGlnaHRzLmxlbmd0aDtqPGpsZW47aisrKXtcclxuXHRcdFx0XHR0aGlzLnNlbmRMaWdodFVuaWZvcm1EYXRhKGxpZ2h0c1tqXSwgdW5pLmRhdGFbbGlnaHRzQ291bnQrK10pO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VNVk1hdHJpeCcpe1xyXG5cdFx0XHRtb2RlbFRyYW5zZm9ybWF0aW9uID0gbWVzaC5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xyXG5cdFx0XHR0cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG1vZGVsVHJhbnNmb3JtYXRpb24uY2xvbmUoKS5tdWx0aXBseShjYW1lcmEudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIHRyYW5zZm9ybWF0aW9uTWF0cml4LnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1UE1hdHJpeCcpe1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIGNhbWVyYS5wZXJzcGVjdGl2ZU1hdHJpeC50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1hdGVyaWFsQ29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gbWVzaC5tYXRlcmlhbC5jb2xvci5nZXRSR0JBKCk7XHJcblx0XHRcdGdsLnVuaWZvcm00ZnYodW5pLmxvY2F0aW9uLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9yKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlU2FtcGxlcicpe1xyXG5cdFx0XHRpZiAobWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwKTtcclxuXHRcdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAudGV4dHVyZSk7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUhhc1RleHR1cmUnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVVzZUxpZ2h0aW5nJyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIChzY2VuZS51c2VMaWdodGluZyk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU5vcm1hbE1hdHJpeCcpe1xyXG5cdFx0XHR2YXIgbm9ybWFsTWF0cml4ID0gbW9kZWxUcmFuc2Zvcm1hdGlvbi50b01hdHJpeDMoKS5pbnZlcnNlKCkudG9GbG9hdDMyQXJyYXkoKTtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDNmdih1bmkubG9jYXRpb24sIGZhbHNlLCBub3JtYWxNYXRyaXgpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TW9kZWxNYXRyaXgnKXtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdih1bmkubG9jYXRpb24sIGZhbHNlLCBtb2RlbFRyYW5zZm9ybWF0aW9uLnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1Q2FtZXJhUG9zaXRpb24nKXtcclxuXHRcdFx0Z2wudW5pZm9ybTNmKHVuaS5sb2NhdGlvbiwgY2FtZXJhLnBvc2l0aW9uLngsIGNhbWVyYS5wb3NpdGlvbi55LCBjYW1lcmEucG9zaXRpb24ueik7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VTcGVjdWxhckNvbG9yJyl7XHJcblx0XHRcdHZhciBjb2xvciA9IHRoaXMuc3BlY3VsYXJDb2xvci5nZXRSR0IoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTNmKHVuaS5sb2NhdGlvbiwgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VTaGluaW5lc3MnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFmKHVuaS5sb2NhdGlvbiwgdGhpcy5zaGluaW5lc3MpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1QW1iaWVudExpZ2h0Q29sb3InICYmIHNjZW5lLnVzZUxpZ2h0aW5nICYmIHNjZW5lLmFtYmllbnRMaWdodCl7XHJcblx0XHRcdHZhciBjb2xvciA9IHNjZW5lLmFtYmllbnRMaWdodC5nZXRSR0IoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTNmKHVuaS5sb2NhdGlvbiwgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VPcGFjaXR5Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZih1bmkubG9jYXRpb24sIG1lc2gubWF0ZXJpYWwub3BhY2l0eSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlUmVwZWF0JyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtMmYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAucmVwZWF0LngsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5yZXBlYXQueSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VHZW9tZXRyeVVWJyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtNGYodW5pLmxvY2F0aW9uLCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLngsIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueSwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi56LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLncpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VGV4dHVyZU9mZnNldCcgJiYgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0Z2wudW5pZm9ybTJmKHVuaS5sb2NhdGlvbiwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLm9mZnNldC54LCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAub2Zmc2V0LnkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1c2VkTGlnaHRzJyl7XHJcblx0XHRcdHVzZWRMaWdodFVuaWZvcm0gPSB1bmk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VVc2VTcGVjdWxhck1hcCcpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAobWVzaC5tYXRlcmlhbC5zcGVjdWxhck1hcCk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVNwZWN1bGFyTWFwU2FtcGxlcicpe1xyXG5cdFx0XHRpZiAobWVzaC5tYXRlcmlhbC5zcGVjdWxhck1hcCl7XHJcblx0XHRcdFx0Z2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMSk7XHJcblx0XHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbWVzaC5tYXRlcmlhbC5zcGVjdWxhck1hcC50ZXh0dXJlKTtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAxKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRpZiAodXNlZExpZ2h0VW5pZm9ybSl7XHJcblx0XHRnbC51bmlmb3JtMWkodXNlZExpZ2h0VW5pZm9ybS5sb2NhdGlvbiwgbGlnaHRzQ291bnQpO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRyYWREZWdSZWw6IE1hdGguUEkgLyAxODAsXHJcblx0XHJcblx0UElfMjogTWF0aC5QSSAvIDIsXHJcblx0UEk6IE1hdGguUEksXHJcblx0UEkzXzI6IE1hdGguUEkgKiAzIC8gMixcclxuXHRQSTI6IE1hdGguUEkgKiAyLFxyXG5cdFxyXG5cdGRlZ1RvUmFkOiBmdW5jdGlvbihkZWdyZWVzKXtcclxuXHRcdHJldHVybiBkZWdyZWVzICogdGhpcy5yYWREZWdSZWw7XHJcblx0fSxcclxuXHRcclxuXHRyYWRUb0RlZzogZnVuY3Rpb24ocmFkaWFucyl7XHJcblx0XHRyZXR1cm4gcmFkaWFucyAvIHRoaXMucmFkRGVnUmVsO1xyXG5cdH0sXHJcblx0XHJcblx0Z2V0MkRBbmdsZTogZnVuY3Rpb24oeDEsIHkxLCB4MiwgeTIpe1xyXG5cdFx0dmFyIHh4ID0gTWF0aC5hYnMoeDIgLSB4MSk7XHJcblx0XHR2YXIgeXkgPSBNYXRoLmFicyh5MiAtIHkxKTtcclxuXHRcdFxyXG5cdFx0dmFyIGFuZyA9IE1hdGguYXRhbjIoeXksIHh4KTtcclxuXHRcdFxyXG5cdFx0aWYgKHgyIDw9IHgxICYmIHkyIDw9IHkxKXtcclxuXHRcdFx0YW5nID0gdGhpcy5QSSAtIGFuZztcclxuXHRcdH1lbHNlIGlmICh4MiA8PSB4MSAmJiB5MiA+IHkxKXtcclxuXHRcdFx0YW5nID0gdGhpcy5QSSArIGFuZztcclxuXHRcdH1lbHNlIGlmICh4MiA+IHgxICYmIHkyID4geTEpe1xyXG5cdFx0XHRhbmcgPSB0aGlzLlBJMiAtIGFuZztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0YW5nID0gKGFuZyArIHRoaXMuUEkyKSAlIHRoaXMuUEkyO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gYW5nO1xyXG5cdH1cclxufTtcclxuIiwiZnVuY3Rpb24gTWF0cml4Mygpe1xyXG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDkpIHRocm93IFwiTWF0cml4IDMgbXVzdCByZWNlaXZlIDkgcGFyYW1ldGVyc1wiO1xyXG5cdFxyXG5cdHZhciBjID0gMDtcclxuXHRmb3IgKHZhciBpPTA7aTw5O2krPTMpe1xyXG5cdFx0dGhpc1tjXSA9IGFyZ3VtZW50c1tpXTtcclxuXHRcdHRoaXNbYyszXSA9IGFyZ3VtZW50c1tpKzFdO1xyXG5cdFx0dGhpc1tjKzZdID0gYXJndW1lbnRzW2krMl07XHJcblx0XHRcclxuXHRcdGMgKz0gMTtcclxuXHR9XHJcblx0XHJcblx0dGhpcy5fX2t0bXQzID0gdHJ1ZTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRyaXgzO1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUuZ2V0RGV0ZXJtaW5hbnQgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHR2YXIgZGV0ID0gKFRbMF0gKiBUWzRdICogVFs4XSkgKyAoVFsxXSAqIFRbNV0gKiBUWzZdKSArIChUWzJdICogVFszXSAqIFRbN10pXHJcblx0XHRcdC0gKFRbNl0gKiBUWzRdICogVFsyXSkgLSAoVFs3XSAqIFRbNV0gKiBUWzBdKSAtIChUWzhdICogVFszXSAqIFRbMV0pO1xyXG5cdFxyXG5cdHJldHVybiBkZXQ7XHJcbn07XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS5pbnZlcnNlID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgZGV0ID0gdGhpcy5nZXREZXRlcm1pbmFudCgpO1xyXG5cdGlmIChkZXQgPT0gMCkgcmV0dXJuIG51bGw7XHJcblx0XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHZhciBpbnYgPSBuZXcgTWF0cml4MyhcclxuXHRcdFRbNF0qVFs4XS1UWzVdKlRbN10sXHRUWzVdKlRbNl0tVFszXSpUWzhdLFx0VFszXSpUWzddLVRbNF0qVFs2XSxcclxuXHRcdFRbMl0qVFs3XS1UWzFdKlRbOF0sXHRUWzBdKlRbOF0tVFsyXSpUWzZdLFx0VFsxXSpUWzZdLVRbMF0qVFs3XSxcclxuXHRcdFRbMV0qVFs1XS1UWzJdKlRbNF0sXHRUWzJdKlRbM10tVFswXSpUWzVdLFx0VFswXSpUWzRdLVRbMV0qVFszXVxyXG5cdCk7XHJcblx0XHJcblx0aW52Lm11bHRpcGx5KDEgLyBkZXQpO1xyXG5cdHRoaXMuY29weShpbnYpO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihudW1iZXIpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRmb3IgKHZhciBpPTA7aTw5O2krKyl7XHJcblx0XHRUW2ldICo9IG51bWJlcjtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24obWF0cml4Myl7XHJcblx0aWYgKCFtYXRyaXgzLl9fa3RtdDMpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIG1hdHJpeDMgaW50byBhbm90aGVyXCI7XHJcblx0XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdGZvciAodmFyIGk9MDtpPDk7aSsrKXtcclxuXHRcdFRbaV0gPSBtYXRyaXgzW2ldO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLnRyYW5zcG9zZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHZhciB2YWx1ZXMgPSBbXHJcblx0XHRUWzBdLCBUWzNdLCBUWzZdLFxyXG5cdFx0VFsxXSwgVFs0XSwgVFs3XSxcclxuXHRcdFRbMl0sIFRbNV0sIFRbOF1cclxuXHRdO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPDk7aSsrKXtcclxuXHRcdFRbaV0gPSB2YWx1ZXNbaV07XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUudG9GbG9hdDMyQXJyYXkgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbXHJcblx0XHRUWzBdLCBUWzFdLCBUWzJdLFxyXG5cdFx0VFszXSwgVFs0XSwgVFs1XSxcclxuXHRcdFRbNl0sIFRbN10sIFRbOF1cclxuXHRdKTtcclxufTtcclxuIiwidmFyIE1hdHJpeDMgPSByZXF1aXJlKCcuL0tUTWF0cml4MycpO1xyXG5cclxuZnVuY3Rpb24gTWF0cml4NCgpe1xyXG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDE2KSB0aHJvdyBcIk1hdHJpeCA0IG11c3QgcmVjZWl2ZSAxNiBwYXJhbWV0ZXJzXCI7XHJcblx0XHJcblx0dmFyIGMgPSAwO1xyXG5cdGZvciAodmFyIGk9MDtpPDE2O2krPTQpe1xyXG5cdFx0dGhpc1tjXSA9IGFyZ3VtZW50c1tpXTtcclxuXHRcdHRoaXNbYys0XSA9IGFyZ3VtZW50c1tpKzFdO1xyXG5cdFx0dGhpc1tjKzhdID0gYXJndW1lbnRzW2krMl07XHJcblx0XHR0aGlzW2MrMTJdID0gYXJndW1lbnRzW2krM107XHJcblx0XHRcclxuXHRcdGMgKz0gMTtcclxuXHR9XHJcblx0XHJcblx0dGhpcy5fX2t0bTQgPSB0cnVlO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdHJpeDQ7XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5pZGVudGl0eSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIHBhcmFtcyA9IFtcclxuXHRcdDEsIDAsIDAsIDAsXHJcblx0XHQwLCAxLCAwLCAwLFxyXG5cdFx0MCwgMCwgMSwgMCxcclxuXHRcdDAsIDAsIDAsIDFcclxuXHRdO1xyXG5cdFxyXG5cdHZhciBjID0gMDtcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKz00KXtcclxuXHRcdHRoaXNbY10gPSBwYXJhbXNbaV07XHJcblx0XHR0aGlzW2MrNF0gPSBwYXJhbXNbaSsxXTtcclxuXHRcdHRoaXNbYys4XSA9IHBhcmFtc1tpKzJdO1xyXG5cdFx0dGhpc1tjKzEyXSA9IHBhcmFtc1tpKzNdO1xyXG5cdFx0XHJcblx0XHRjICs9IDE7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUubXVsdGlwbHlTY2FsYXIgPSBmdW5jdGlvbihudW1iZXIpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKyspe1xyXG5cdFx0VFtpXSAqPSBudW1iZXI7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihtYXRyaXg0KXtcclxuXHRpZiAobWF0cml4NC5fX2t0bTQpe1xyXG5cdFx0dmFyIEExID0gW3RoaXNbMF0sICB0aGlzWzFdLCAgdGhpc1syXSwgIHRoaXNbM11dO1xyXG5cdFx0dmFyIEEyID0gW3RoaXNbNF0sICB0aGlzWzVdLCAgdGhpc1s2XSwgIHRoaXNbN11dO1xyXG5cdFx0dmFyIEEzID0gW3RoaXNbOF0sICB0aGlzWzldLCAgdGhpc1sxMF0sIHRoaXNbMTFdXTtcclxuXHRcdHZhciBBNCA9IFt0aGlzWzEyXSwgdGhpc1sxM10sIHRoaXNbMTRdLCB0aGlzWzE1XV07XHJcblx0XHRcclxuXHRcdHZhciBCMSA9IFttYXRyaXg0WzBdLCBtYXRyaXg0WzRdLCBtYXRyaXg0WzhdLCAgbWF0cml4NFsxMl1dO1xyXG5cdFx0dmFyIEIyID0gW21hdHJpeDRbMV0sIG1hdHJpeDRbNV0sIG1hdHJpeDRbOV0sICBtYXRyaXg0WzEzXV07XHJcblx0XHR2YXIgQjMgPSBbbWF0cml4NFsyXSwgbWF0cml4NFs2XSwgbWF0cml4NFsxMF0sIG1hdHJpeDRbMTRdXTtcclxuXHRcdHZhciBCNCA9IFttYXRyaXg0WzNdLCBtYXRyaXg0WzddLCBtYXRyaXg0WzExXSwgbWF0cml4NFsxNV1dO1xyXG5cdFx0XHJcblx0XHR2YXIgZG90ID0gZnVuY3Rpb24oY29sLCByb3cpe1xyXG5cdFx0XHR2YXIgc3VtID0gMDtcclxuXHRcdFx0Zm9yICh2YXIgaj0wO2o8NDtqKyspeyBzdW0gKz0gcm93W2pdICogY29sW2pdOyB9XHJcblx0XHRcdHJldHVybiBzdW07XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHR0aGlzWzBdID0gZG90KEExLCBCMSk7ICAgdGhpc1sxXSA9IGRvdChBMSwgQjIpOyAgIHRoaXNbMl0gPSBkb3QoQTEsIEIzKTsgICB0aGlzWzNdID0gZG90KEExLCBCNCk7XHJcblx0XHR0aGlzWzRdID0gZG90KEEyLCBCMSk7ICAgdGhpc1s1XSA9IGRvdChBMiwgQjIpOyAgIHRoaXNbNl0gPSBkb3QoQTIsIEIzKTsgICB0aGlzWzddID0gZG90KEEyLCBCNCk7XHJcblx0XHR0aGlzWzhdID0gZG90KEEzLCBCMSk7ICAgdGhpc1s5XSA9IGRvdChBMywgQjIpOyAgIHRoaXNbMTBdID0gZG90KEEzLCBCMyk7ICB0aGlzWzExXSA9IGRvdChBMywgQjQpO1xyXG5cdFx0dGhpc1sxMl0gPSBkb3QoQTQsIEIxKTsgIHRoaXNbMTNdID0gZG90KEE0LCBCMik7ICB0aGlzWzE0XSA9IGRvdChBNCwgQjMpOyAgdGhpc1sxNV0gPSBkb3QoQTQsIEI0KTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fWVsc2UgaWYgKG1hdHJpeDQubGVuZ3RoID09IDQpe1xyXG5cdFx0dmFyIHJldCA9IFtdO1xyXG5cdFx0dmFyIGNvbCA9IG1hdHJpeDQ7XHJcblx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTw0O2krPTEpe1xyXG5cdFx0XHR2YXIgcm93ID0gW3RoaXNbaV0sIHRoaXNbaSs0XSwgdGhpc1tpKzhdLCB0aGlzW2krMTJdXTtcclxuXHRcdFx0dmFyIHN1bSA9IDA7XHJcblx0XHRcdFxyXG5cdFx0XHRmb3IgKHZhciBqPTA7ajw0O2orKyl7XHJcblx0XHRcdFx0c3VtICs9IHJvd1tqXSAqIGNvbFtqXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0LnB1c2goc3VtKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHJldDtcclxuXHR9ZWxzZXtcclxuXHRcdHRocm93IFwiSW52YWxpZCBjb25zdHJ1Y3RvclwiO1xyXG5cdH1cclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLnRyYW5zcG9zZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHZhciB2YWx1ZXMgPSBbXHJcblx0XHRUWzBdLCBUWzRdLCBUWzhdLCAgVFsxMl0sXHJcblx0XHRUWzFdLCBUWzVdLCBUWzldLCAgVFsxM10sXHJcblx0XHRUWzJdLCBUWzZdLCBUWzEwXSwgVFsxNF0sXHJcblx0XHRUWzNdLCBUWzddLCBUWzExXSwgVFsxNV0sXHJcblx0XTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKyspe1xyXG5cdFx0dGhpc1tpXSA9IHZhbHVlc1tpXTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24obWF0cml4NCl7XHJcblx0aWYgKCFtYXRyaXg0Ll9fa3RtNCkgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgTWF0cml4NCBpbnRvIHRoaXMgbWF0cml4XCI7XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSsrKXtcclxuXHRcdHRoaXNbaV0gPSBtYXRyaXg0W2ldO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0VFswXSwgVFs0XSwgVFs4XSwgIFRbMTJdLFxyXG5cdFx0VFsxXSwgVFs1XSwgVFs5XSwgIFRbMTNdLFxyXG5cdFx0VFsyXSwgVFs2XSwgVFsxMF0sIFRbMTRdLFxyXG5cdFx0VFszXSwgVFs3XSwgVFsxMV0sIFRbMTVdXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLnRvRmxvYXQzMkFycmF5ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG5cdFx0VFswXSwgVFsxXSwgVFsyXSwgIFRbM10sXHJcblx0XHRUWzRdLCBUWzVdLCBUWzZdLCAgVFs3XSxcclxuXHRcdFRbOF0sIFRbOV0sIFRbMTBdLCBUWzExXSxcclxuXHRcdFRbMTJdLCBUWzEzXSwgVFsxNF0sIFRbMTVdXHJcblx0XSk7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS50b01hdHJpeDMgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDMoXHJcblx0XHRUWzBdLCBUWzFdLCBUWzJdLFxyXG5cdFx0VFs0XSwgVFs1XSwgVFs2XSxcclxuXHRcdFRbOF0sIFRbOV0sIFRbMTBdXHJcblx0KTsgXHJcbn07XHJcblxyXG5NYXRyaXg0LmdldElkZW50aXR5ID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQxLCAwLCAwLCAwLFxyXG5cdFx0MCwgMSwgMCwgMCxcclxuXHRcdDAsIDAsIDEsIDAsXHJcblx0XHQwLCAwLCAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0WFJvdGF0aW9uID0gZnVuY3Rpb24ocmFkaWFucyl7XHJcblx0dmFyIEMgPSBNYXRoLmNvcyhyYWRpYW5zKTtcclxuXHR2YXIgUyA9IE1hdGguc2luKHJhZGlhbnMpO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdDEsICAwLCAgMCwgMCxcclxuXHRcdDAsICBDLCAgUywgMCxcclxuXHRcdDAsIC1TLCAgQywgMCxcclxuXHRcdDAsICAwLCAgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFlSb3RhdGlvbiA9IGZ1bmN0aW9uKHJhZGlhbnMpe1xyXG5cdHZhciBDID0gTWF0aC5jb3MocmFkaWFucyk7XHJcblx0dmFyIFMgPSBNYXRoLnNpbihyYWRpYW5zKTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQgQywgIDAsICBTLCAwLFxyXG5cdFx0IDAsICAxLCAgMCwgMCxcclxuXHRcdC1TLCAgMCwgIEMsIDAsXHJcblx0XHQgMCwgIDAsICAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0WlJvdGF0aW9uID0gZnVuY3Rpb24ocmFkaWFucyl7XHJcblx0dmFyIEMgPSBNYXRoLmNvcyhyYWRpYW5zKTtcclxuXHR2YXIgUyA9IE1hdGguc2luKHJhZGlhbnMpO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdCBDLCAgUywgMCwgMCxcclxuXHRcdC1TLCAgQywgMCwgMCxcclxuXHRcdCAwLCAgMCwgMSwgMCxcclxuXHRcdCAwLCAgMCwgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFRyYW5zbGF0aW9uID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSB0cmFuc2xhdGUgdG8gYSB2ZWN0b3IgM1wiO1xyXG5cdFxyXG5cdHZhciB4ID0gdmVjdG9yMy54O1xyXG5cdHZhciB5ID0gdmVjdG9yMy55O1xyXG5cdHZhciB6ID0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdDEsIDAsIDAsIHgsXHJcblx0XHQwLCAxLCAwLCB5LFxyXG5cdFx0MCwgMCwgMSwgeixcclxuXHRcdDAsIDAsIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRTY2FsZSA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgc2NhbGUgdG8gYSB2ZWN0b3IgM1wiO1xyXG5cdFxyXG5cdHZhciBzeCA9IHZlY3RvcjMueDtcclxuXHR2YXIgc3kgPSB2ZWN0b3IzLnk7XHJcblx0dmFyIHN6ID0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdHN4LCAgMCwgIDAsIDAsXHJcblx0XHQgMCwgc3ksICAwLCAwLFxyXG5cdFx0IDAsICAwLCBzeiwgMCxcclxuXHRcdCAwLCAgMCwgIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRUcmFuc2Zvcm1hdGlvbiA9IGZ1bmN0aW9uKHBvc2l0aW9uLCByb3RhdGlvbiwgc2NhbGUpe1xyXG5cdGlmICghcG9zaXRpb24uX19rdHYzKSB0aHJvdyBcIlBvc2l0aW9uIG11c3QgYmUgYSBWZWN0b3IzXCI7XHJcblx0aWYgKCFyb3RhdGlvbi5fX2t0djMpIHRocm93IFwiUm90YXRpb24gbXVzdCBiZSBhIFZlY3RvcjNcIjtcclxuXHRpZiAoc2NhbGUgJiYgIXNjYWxlLl9fa3R2MykgdGhyb3cgXCJTY2FsZSBtdXN0IGJlIGEgVmVjdG9yM1wiO1xyXG5cdFxyXG5cdHZhciBzY2FsZSA9IChzY2FsZSk/IE1hdHJpeDQuZ2V0U2NhbGUoc2NhbGUpIDogTWF0cml4NC5nZXRJZGVudGl0eSgpO1xyXG5cdFxyXG5cdHZhciByb3RhdGlvblggPSBNYXRyaXg0LmdldFhSb3RhdGlvbihyb3RhdGlvbi54KTtcclxuXHR2YXIgcm90YXRpb25ZID0gTWF0cml4NC5nZXRZUm90YXRpb24ocm90YXRpb24ueSk7XHJcblx0dmFyIHJvdGF0aW9uWiA9IE1hdHJpeDQuZ2V0WlJvdGF0aW9uKHJvdGF0aW9uLnopO1xyXG5cdFxyXG5cdHZhciB0cmFuc2xhdGlvbiA9IE1hdHJpeDQuZ2V0VHJhbnNsYXRpb24ocG9zaXRpb24pO1xyXG5cdFxyXG5cdHZhciBtYXRyaXg7XHJcblx0bWF0cml4ID0gTWF0cml4NC5nZXRJZGVudGl0eSgpO1xyXG5cdG1hdHJpeC5tdWx0aXBseShzY2FsZSk7XHJcblx0bWF0cml4Lm11bHRpcGx5KHJvdGF0aW9uWCk7XHJcblx0bWF0cml4Lm11bHRpcGx5KHJvdGF0aW9uWSk7XHJcblx0bWF0cml4Lm11bHRpcGx5KHJvdGF0aW9uWik7XHJcblx0bWF0cml4Lm11bHRpcGx5KHRyYW5zbGF0aW9uKTtcclxuXHRcclxuXHRyZXR1cm4gbWF0cml4O1xyXG59O1xyXG4iLCJ2YXIgTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcbnZhciBWZWMzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxuXHJcbmZ1bmN0aW9uIE1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKXtcclxuXHRpZiAoIWdlb21ldHJ5Ll9fa3RnZW9tZXRyeSkgdGhyb3cgXCJHZW9tZXRyeSBtdXN0IGJlIGEgS1RHZW9tZXRyeSBpbnN0YW5jZVwiO1xyXG5cdGlmICghbWF0ZXJpYWwuX19rdG1hdGVyaWFsKSB0aHJvdyBcIk1hdGVyaWFsIG11c3QgYmUgYSBLVE1hdGVyaWFsIGluc3RhbmNlXCI7XHJcblx0XHJcblx0dGhpcy5fX2t0bWVzaCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5nZW9tZXRyeSA9IGdlb21ldHJ5O1xyXG5cdHRoaXMubWF0ZXJpYWwgPSBtYXRlcmlhbDtcclxuXHRcclxuXHR0aGlzLnBhcmVudCA9IG51bGw7XHJcblx0dGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnBvc2l0aW9uID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcblx0dGhpcy5yb3RhdGlvbiA9IG5ldyBWZWMzKDAsIDAsIDApO1xyXG5cdHRoaXMuc2NhbGUgPSBuZXcgVmVjMygxLCAxLCAxKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXNoO1xyXG5cclxuTWVzaC5wcm90b3R5cGUuZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXggPSBmdW5jdGlvbigpe1xyXG5cdHZhciBtYXRyaXggPSBNYXRyaXg0LmdldFRyYW5zZm9ybWF0aW9uKHRoaXMucG9zaXRpb24sIHRoaXMucm90YXRpb24sIHRoaXMuc2NhbGUpO1xyXG5cdFxyXG5cdGlmICh0aGlzLnBhcmVudCl7XHJcblx0XHR2YXIgbSA9IHRoaXMucGFyZW50LmdldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblx0XHRtYXRyaXgubXVsdGlwbHkobSk7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiBtYXRyaXg7XHJcbn07XHJcbiIsInZhciBWZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL0tUSW5wdXQnKTtcclxudmFyIEtUTWF0aCA9IHJlcXVpcmUoJy4vS1RNYXRoJyk7XHJcblxyXG5mdW5jdGlvbiBPcmJpdEFuZFBhbih0YXJnZXQpe1xyXG5cdHRoaXMuX19rdENhbUN0cmxzID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLmNhbWVyYSA9IG51bGw7XHJcblx0dGhpcy5sYXN0RHJhZyA9IG51bGw7XHJcblx0dGhpcy5sYXN0UGFuID0gbnVsbDtcclxuXHR0aGlzLnRhcmdldCA9ICh0YXJnZXQpPyB0YXJnZXQgOiBuZXcgVmVjdG9yMygwLjAsIDAuMCwgMC4wKTtcclxuXHR0aGlzLmFuZ2xlID0gbmV3IFZlY3RvcjIoMC4wLCAwLjApO1xyXG5cdHRoaXMuem9vbSA9IDE7XHJcblx0dGhpcy5zZW5zaXRpdml0eSA9IG5ldyBWZWN0b3IyKDAuNSwgMC41KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPcmJpdEFuZFBhbjtcclxuXHJcbk9yYml0QW5kUGFuLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpe1xyXG5cdGlmICh0aGlzLmNhbWVyYS5sb2NrZWQpIHJldHVybjtcclxuXHRcclxuXHRpZiAoSW5wdXQuaXNXaGVlbE1vdmVkKElucHV0LnZNb3VzZS5XSEVFTFVQKSl7IHRoaXMuem9vbSAtPSAwLjM7IHRoaXMuc2V0Q2FtZXJhUG9zaXRpb24oKTsgfVxyXG5cdGVsc2UgaWYgKElucHV0LmlzV2hlZWxNb3ZlZChJbnB1dC52TW91c2UuV0hFRUxET1dOKSl7IHRoaXMuem9vbSArPSAwLjM7IHRoaXMuc2V0Q2FtZXJhUG9zaXRpb24oKTsgfVxyXG5cdFxyXG5cdGlmIChJbnB1dC5pc01vdXNlRG93bihJbnB1dC52TW91c2UuTEVGVCkpe1xyXG5cdFx0aWYgKHRoaXMubGFzdERyYWcgPT0gbnVsbCkgdGhpcy5sYXN0RHJhZyA9IElucHV0Ll9tb3VzZS5wb3NpdGlvbi5jbG9uZSgpO1xyXG5cdFx0XHJcblx0XHR2YXIgZHggPSBJbnB1dC5fbW91c2UucG9zaXRpb24ueCAtIHRoaXMubGFzdERyYWcueDtcclxuXHRcdHZhciBkeSA9IElucHV0Ll9tb3VzZS5wb3NpdGlvbi55IC0gdGhpcy5sYXN0RHJhZy55O1xyXG5cdFx0XHJcblx0XHRpZiAoZHggIT0gMC4wIHx8IGR5ICE9IDAuMCl7XHJcblx0XHRcdHRoaXMuYW5nbGUueCAtPSBLVE1hdGguZGVnVG9SYWQoZHggKiB0aGlzLnNlbnNpdGl2aXR5LngpO1xyXG5cdFx0XHR0aGlzLmFuZ2xlLnkgLT0gS1RNYXRoLmRlZ1RvUmFkKGR5ICogdGhpcy5zZW5zaXRpdml0eS55KTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuc2V0Q2FtZXJhUG9zaXRpb24oKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5sYXN0RHJhZy5jb3B5KElucHV0Ll9tb3VzZS5wb3NpdGlvbik7XHJcblx0fWVsc2V7XHJcblx0XHR0aGlzLmxhc3REcmFnID0gbnVsbDtcclxuXHR9XHJcblx0XHJcblx0aWYgKElucHV0LmlzTW91c2VEb3duKElucHV0LnZNb3VzZS5SSUdIVCkpe1xyXG5cdFx0aWYgKHRoaXMubGFzdFBhbiA9PSBudWxsKSB0aGlzLmxhc3RQYW4gPSBJbnB1dC5fbW91c2UucG9zaXRpb24uY2xvbmUoKTtcclxuXHRcdFxyXG5cdFx0dmFyIGR4ID0gSW5wdXQuX21vdXNlLnBvc2l0aW9uLnggLSB0aGlzLmxhc3RQYW4ueDtcclxuXHRcdHZhciBkeSA9IElucHV0Ll9tb3VzZS5wb3NpdGlvbi55IC0gdGhpcy5sYXN0UGFuLnk7XHJcblx0XHRcclxuXHRcdGlmIChkeCAhPSAwLjAgfHwgZHkgIT0gMC4wKXtcclxuXHRcdFx0dmFyIHRoZXRhID0gLXRoaXMuYW5nbGUueTtcclxuXHRcdFx0dmFyIGFuZyA9IC10aGlzLmFuZ2xlLnggLSBLVE1hdGguUElfMjtcclxuXHRcdFx0dmFyIGNvcyA9IE1hdGguY29zKGFuZyk7XHJcblx0XHRcdHZhciBzaW4gPSBNYXRoLnNpbihhbmcpO1xyXG5cdFx0XHR2YXIgY29zVCA9IE1hdGguY29zKHRoZXRhKTtcclxuXHRcdFx0dmFyIHNpblQgPSBNYXRoLnNpbih0aGV0YSk7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnRhcmdldC54IC09IGNvcyAqIGR4ICogdGhpcy5zZW5zaXRpdml0eS54IC8gMTA7XHJcblx0XHRcdHRoaXMudGFyZ2V0LnkgKz0gY29zVCAqIGR5ICogdGhpcy5zZW5zaXRpdml0eS55IC8gMTA7XHJcblx0XHRcdHRoaXMudGFyZ2V0LnogLT0gc2luICogZHggKiB0aGlzLnNlbnNpdGl2aXR5LnggLyAxMDtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuc2V0Q2FtZXJhUG9zaXRpb24oKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5sYXN0UGFuLmNvcHkoSW5wdXQuX21vdXNlLnBvc2l0aW9uKTtcclxuXHR9ZWxzZXtcclxuXHRcdHRoaXMubGFzdFBhbiA9IG51bGw7XHJcblx0fVxyXG59O1xyXG5cclxuT3JiaXRBbmRQYW4ucHJvdG90eXBlLnNldENhbWVyYVBvc2l0aW9uID0gZnVuY3Rpb24oKXtcclxuXHR0aGlzLmFuZ2xlLnggPSAodGhpcy5hbmdsZS54ICsgS1RNYXRoLlBJMikgJSBLVE1hdGguUEkyO1xyXG5cdHRoaXMuYW5nbGUueSA9ICh0aGlzLmFuZ2xlLnkgKyBLVE1hdGguUEkyKSAlIEtUTWF0aC5QSTI7XHJcblx0XHJcblx0aWYgKHRoaXMuYW5nbGUueSA8IEtUTWF0aC5QSSAmJiB0aGlzLmFuZ2xlLnkgPj0gS1RNYXRoLlBJXzIpIHRoaXMuYW5nbGUueSA9IEtUTWF0aC5kZWdUb1JhZCg4OS45KTtcclxuXHRpZiAodGhpcy5hbmdsZS55ID4gS1RNYXRoLlBJICYmIHRoaXMuYW5nbGUueSA8PSBLVE1hdGguUEkzXzIpIHRoaXMuYW5nbGUueSA9IEtUTWF0aC5kZWdUb1JhZCgyNzAuOSk7XHJcblx0aWYgKHRoaXMuem9vbSA8PSAwLjMpIHRoaXMuem9vbSA9IDAuMztcclxuXHRcclxuXHR2YXIgY29zVCA9IE1hdGguY29zKHRoaXMuYW5nbGUueSk7XHJcblx0dmFyIHNpblQgPSBNYXRoLnNpbih0aGlzLmFuZ2xlLnkpO1xyXG5cdFxyXG5cdHZhciB4ID0gdGhpcy50YXJnZXQueCArIE1hdGguY29zKHRoaXMuYW5nbGUueCkgKiBjb3NUICogdGhpcy56b29tO1xyXG5cdHZhciB5ID0gdGhpcy50YXJnZXQueSArIHNpblQgKiB0aGlzLnpvb207XHJcblx0dmFyIHogPSB0aGlzLnRhcmdldC56IC0gTWF0aC5zaW4odGhpcy5hbmdsZS54KSAqIGNvc1QgKiB0aGlzLnpvb207XHJcblx0XHJcblx0dGhpcy5jYW1lcmEucG9zaXRpb24uc2V0KHgsIHksIHopO1xyXG5cdHRoaXMuY2FtZXJhLmxvb2tBdCh0aGlzLnRhcmdldCk7XHJcbn07XHJcbiIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG5cclxuZnVuY3Rpb24gU2NlbmUocGFyYW1zKXtcclxuXHR0aGlzLl9fa3RzY2VuZSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5tZXNoZXMgPSBbXTtcclxuXHR0aGlzLmxpZ2h0cyA9IFtdO1xyXG5cdHRoaXMuc2hhZGluZ01vZGUgPSBbJ0JBU0lDJywgJ0xBTUJFUlQnXTtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy51c2VMaWdodGluZyA9IChwYXJhbXMudXNlTGlnaHRpbmcpPyB0cnVlIDogZmFsc2U7XHJcblx0dGhpcy5hbWJpZW50TGlnaHQgPSAocGFyYW1zLmFtYmllbnRMaWdodCk/IG5ldyBDb2xvcihwYXJhbXMuYW1iaWVudExpZ2h0KSA6IG51bGw7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NlbmU7XHJcblxyXG5TY2VuZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24ob2JqZWN0KXtcclxuXHRpZiAob2JqZWN0Ll9fa3RtZXNoKXtcclxuXHRcdHRoaXMubWVzaGVzLnB1c2gob2JqZWN0KTtcclxuXHR9ZWxzZSBpZiAob2JqZWN0Ll9fa3RkaXJMaWdodCB8fCBvYmplY3QuX19rdHBvaW50bGlnaHQpe1xyXG5cdFx0dGhpcy5saWdodHMucHVzaChvYmplY3QpO1xyXG5cdH1lbHNle1xyXG5cdFx0dGhyb3cgXCJDYW4ndCBhZGQgdGhlIG9iamVjdCB0byB0aGUgc2NlbmVcIjtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5TY2VuZS5wcm90b3R5cGUuZHJhd01lc2ggPSBmdW5jdGlvbihtZXNoLCBjYW1lcmEpe1xyXG5cdGlmICghbWVzaC5nZW9tZXRyeS5yZWFkeSkgcmV0dXJuO1xyXG5cdFxyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdHZhciBtYXRlcmlhbCA9IG1lc2gubWF0ZXJpYWw7XHJcblx0dmFyIHNoYWRlciA9IG1hdGVyaWFsLnNoYWRlcjtcclxuXHRcclxuXHRLVC5zd2l0Y2hQcm9ncmFtKHNoYWRlcik7XHJcblx0dGhpcy5zZXRNYXRlcmlhbEF0dHJpYnV0ZXMobWVzaC5tYXRlcmlhbCk7XHJcblx0XHJcblx0bWF0ZXJpYWwuc2VuZEF0dHJpYkRhdGEobWVzaCwgY2FtZXJhLCB0aGlzKTtcclxuXHRtYXRlcmlhbC5zZW5kVW5pZm9ybURhdGEobWVzaCwgY2FtZXJhLCB0aGlzKTtcclxuXHRcclxuXHRnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBtZXNoLmdlb21ldHJ5LmZhY2VzQnVmZmVyKTtcclxuXHRnbC5kcmF3RWxlbWVudHMoZ2xbbWF0ZXJpYWwuZHJhd0FzXSwgbWVzaC5nZW9tZXRyeS5mYWNlc0J1ZmZlci5udW1JdGVtcywgZ2wuVU5TSUdORURfU0hPUlQsIDApO1xyXG59O1xyXG5cclxuU2NlbmUucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKXtcclxuXHRLVC5nbC5jbGVhcihLVC5nbC5DT0xPUl9CVUZGRVJfQklUIHwgS1QuZ2wuREVQVEhfQlVGRkVSX0JJVCk7XHJcbn07XHJcblxyXG5TY2VuZS5wcm90b3R5cGUucmVuZGVyVG9GcmFtZWJ1ZmZlciA9IGZ1bmN0aW9uKGNhbWVyYSwgZnJhbWVidWZmZXIpe1xyXG5cdGlmICghZnJhbWVidWZmZXIuX19rdHRleHR1cmVmcmFtZWJ1ZmZlcikgdGhyb3cgXCJmcmFtZWJ1ZmZlciBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIFRleHR1cmVGcmFtZWJ1ZmZlclwiO1xyXG5cdFxyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVidWZmZXIuZnJhbWVidWZmZXIpO1xyXG5cdHRoaXMucmVuZGVyKGNhbWVyYSk7XHJcblx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcclxufTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihjYW1lcmEpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdGdsLmRpc2FibGUoIGdsLkJMRU5EICk7IFxyXG5cdHZhciB0cmFuc3BhcmVudHMgPSBbXTtcclxuXHRcclxuXHRpZiAoY2FtZXJhLmNvbnRyb2xzKSBjYW1lcmEuY29udHJvbHMudXBkYXRlKCk7XHJcblx0XHJcblx0aWYgKGNhbWVyYS5za3lib3gpe1xyXG5cdFx0dmFyIHNreSA9IGNhbWVyYS5za3lib3gubWVzaGVzO1xyXG5cdFx0Zm9yICh2YXIgaT0wLGxlbj1za3kubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHRcdHRoaXMuZHJhd01lc2goc2t5W2ldLCBjYW1lcmEpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMubWVzaGVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIG1lc2ggPSB0aGlzLm1lc2hlc1tpXTtcclxuXHRcdGlmICghbWVzaC52aXNpYmxlKSBjb250aW51ZTtcclxuXHRcdGlmIChtZXNoLm1hdGVyaWFsLm9wYWNpdHkgPT0gMC4wKSBjb250aW51ZTtcclxuXHRcdFxyXG5cdFx0aWYgKG1lc2gubWF0ZXJpYWwub3BhY2l0eSAhPSAxLjAgfHwgbWVzaC5tYXRlcmlhbC50cmFuc3BhcmVudCl7XHJcblx0XHRcdHRyYW5zcGFyZW50cy5wdXNoKG1lc2gpO1xyXG5cdFx0XHRjb250aW51ZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5kcmF3TWVzaChtZXNoLCBjYW1lcmEpO1xyXG5cdH1cclxuXHRcclxuXHRnbC5lbmFibGUoIGdsLkJMRU5EICk7IFxyXG5cdGZvciAodmFyIGk9MCxsZW49dHJhbnNwYXJlbnRzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIG1lc2ggPSB0cmFuc3BhcmVudHNbaV07XHJcblx0XHR0aGlzLmRyYXdNZXNoKG1lc2gsIGNhbWVyYSk7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuXG5TY2VuZS5wcm90b3R5cGUuc2V0TWF0ZXJpYWxBdHRyaWJ1dGVzID0gZnVuY3Rpb24obWF0ZXJpYWwpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdHZhciBjdWxsID0gXCJCQUNLXCI7XHJcblx0aWYgKG1hdGVyaWFsLmRyYXdGYWNlcyA9PSAnQkFDSycpeyBjdWxsID0gXCJGUk9OVFwiOyB9XHJcblx0ZWxzZSBpZiAobWF0ZXJpYWwuZHJhd0ZhY2VzID09ICdCT1RIJyl7IGN1bGwgPSBcIlwiOyB9XHJcblx0XHJcblx0aWYgKGN1bGwgIT0gXCJcIil7XHJcblx0XHRnbC5lbmFibGUoZ2wuQ1VMTF9GQUNFKTtcclxuXHRcdGdsLmN1bGxGYWNlKGdsW2N1bGxdKTtcclxuXHR9ZWxzZXtcclxuXHRcdGdsLmRpc2FibGUoZ2wuQ1VMTF9GQUNFKTtcclxuXHR9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGJhc2ljOiB7XHJcblx0XHR2ZXJ0ZXhTaGFkZXI6IFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzIgYVRleHR1cmVDb29yZDsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleFBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFwiYXR0cmlidXRlIGxvd3AgdmVjNCBhVmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdU1WUE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWM0IHVNYXRlcmlhbENvbG9yOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZWZXJ0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIgKyAgXHJcblx0XHRcdFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgKyBcclxuXHRcdFx0XHRcImdsX1Bvc2l0aW9uID0gdU1WUE1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcdFwidlZlcnRleENvbG9yID0gYVZlcnRleENvbG9yICogdU1hdGVyaWFsQ29sb3I7IFwiICtcclxuXHRcdFx0XHRcInZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkOyBcIiArIFxyXG5cdFx0XHRcIn0gXCIgLFxyXG5cdFx0XHRcclxuXHRcdGZyYWdtZW50U2hhZGVyOiBcclxuXHRcdFx0XCJ1bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZVNhbXBsZXI7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdUhhc1RleHR1cmU7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMiB1VGV4dHVyZVJlcGVhdDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMyIHVUZXh0dXJlT2Zmc2V0OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzQgdUdlb21ldHJ5VVY7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICsgXHJcblx0XHRcdFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWM0IGNvbG9yID0gdlZlcnRleENvbG9yOyBcIiArIFxyXG5cdFx0XHRcdFwiaWYgKHVIYXNUZXh0dXJlKXsgXCIgKyBcclxuXHRcdFx0XHRcdFwibWVkaXVtcCBmbG9hdCB0eCA9IHVHZW9tZXRyeVVWLnggKyBtb2QodVRleHR1cmVPZmZzZXQueCArIHZUZXh0dXJlQ29vcmQucyAqIHVUZXh0dXJlUmVwZWF0LnggLSB1R2VvbWV0cnlVVi54LCB1R2VvbWV0cnlVVi56IC0gdUdlb21ldHJ5VVYueCk7XCIgK1xyXG5cdFx0XHRcdFx0XCJtZWRpdW1wIGZsb2F0IHR5ID0gdUdlb21ldHJ5VVYueSArIG1vZCh1VGV4dHVyZU9mZnNldC55ICsgdlRleHR1cmVDb29yZC50ICogdVRleHR1cmVSZXBlYXQueSAtIHVHZW9tZXRyeVVWLnksIHVHZW9tZXRyeVVWLncgLSB1R2VvbWV0cnlVVi55KTtcIiArXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFwibWVkaXVtcCB2ZWM0IHRleENvbG9yID0gdGV4dHVyZTJEKHVUZXh0dXJlU2FtcGxlciwgdmVjMih0eCwgdHkpKTsgXCIgK1xyXG5cdFx0XHRcdFx0XCJjb2xvciAqPSB0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwifSBcIiArIFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwiZ2xfRnJhZ0NvbG9yID0gY29sb3I7XCIgKyBcclxuXHRcdFx0XCJ9XCJcclxuXHR9LFxyXG5cdFxyXG5cdFxyXG5cdGxhbWJlcnQ6IHtcclxuXHRcdHZlcnRleFNoYWRlcjogXHJcblx0XHRcdFwic3RydWN0IExpZ2h0eyBcIiArXHJcblx0XHRcdCAgICBcImxvd3AgdmVjMyBwb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHQgICAgXCJsb3dwIHZlYzMgY29sb3I7IFwiICtcclxuXHRcdFx0ICAgIFwibG93cCB2ZWMzIGRpcmVjdGlvbjsgXCIgK1xyXG5cdFx0XHQgICAgXCJsb3dwIGZsb2F0IGludGVuc2l0eTsgXCIgK1xyXG5cdFx0XHRcIn07IFwiICtcclxuXHRcdFx0ICAgIFxyXG5cdFx0XHRcInVuaWZvcm0gTGlnaHQgbGlnaHRzWzhdOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBpbnQgdXNlZExpZ2h0czsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMyIGFUZXh0dXJlQ29vcmQ7IFwiICtcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBsb3dwIHZlYzQgYVZlcnRleENvbG9yOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleE5vcm1hbDsgXCIgKyBcclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVNVk1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVQTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzQgdU1hdGVyaWFsQ29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVVc2VMaWdodGluZzsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVNb2RlbE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQzIHVOb3JtYWxNYXRyaXg7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzMgdUFtYmllbnRMaWdodENvbG9yOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZWZXJ0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIgKyAgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdkxpZ2h0V2VpZ2h0OyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJtZWRpdW1wIHZlYzMgZ2V0TGlnaHRXZWlnaHQobWVkaXVtcCB2ZWMzIG5vcm1hbCwgbWVkaXVtcCB2ZWMzIGRpcmVjdGlvbiwgbG93cCB2ZWMzIGNvbG9yLCBsb3dwIGZsb2F0IGludGVuc2l0eSl7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgbGlnaHREb3QgPSBtYXgoZG90KG5vcm1hbCwgZGlyZWN0aW9uKSwgMC4wKTsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGxpZ2h0V2VpZ2h0ID0gKGNvbG9yICogbGlnaHREb3QgKiBpbnRlbnNpdHkpOyBcIiArXHJcblx0XHRcdFx0XCJyZXR1cm4gbGlnaHRXZWlnaHQ7IFwiICtcclxuXHRcdFx0XCJ9XCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICsgXHJcblx0XHRcdFx0XCJ2ZWM0IG1vZGVsVmlld1Bvc2l0aW9uID0gdU1WTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7IFwiICtcclxuXHRcdFx0XHRcImdsX1Bvc2l0aW9uID0gdVBNYXRyaXggKiBtb2RlbFZpZXdQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XHRcInZMaWdodFdlaWdodCA9IHVBbWJpZW50TGlnaHRDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwiaWYgKHVVc2VMaWdodGluZyl7IFwiICtcclxuXHRcdFx0XHRcdFwidmVjMyB2ZXJ0ZXhNb2RlbFBvc2l0aW9uID0gKHVNb2RlbE1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eXo7IFwiICtcclxuXHRcdFx0XHRcdFwiZm9yIChpbnQgaT0wO2k8ODtpKyspeyBcIiArXHJcblx0XHRcdFx0XHRcdFwiaWYgKGkgPj0gdXNlZExpZ2h0cyl7XCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwiYnJlYWs7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJ9XCIgK1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XCJMaWdodCBsID0gbGlnaHRzW2ldOyBcIiArXHJcblx0XHRcdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGxQb3MgPSBsLnBvc2l0aW9uIC0gdmVydGV4TW9kZWxQb3NpdGlvbjtcIiArXHJcblx0XHRcdFx0XHRcdFwibWVkaXVtcCBmbG9hdCBsRGlzdGFuY2UgPSBsZW5ndGgobFBvcykgLyAyLjA7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJpZiAobGVuZ3RoKGwucG9zaXRpb24pID09IDAuMCl7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcImxEaXN0YW5jZSA9IDEuMDsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwibFBvcyA9IHZlYzMoMC4wKTsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjMyBsaWdodERpcmVjdGlvbiA9IGwuZGlyZWN0aW9uICsgbm9ybWFsaXplKGxQb3MpOyBcIiArXHJcblx0XHRcdFx0XHRcdFwidkxpZ2h0V2VpZ2h0ICs9IGdldExpZ2h0V2VpZ2h0KGFWZXJ0ZXhOb3JtYWwsIGxpZ2h0RGlyZWN0aW9uLCBsLmNvbG9yLCBsLmludGVuc2l0eSkgLyBsRGlzdGFuY2U7IFwiICtcclxuXHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHQgXHJcblx0XHRcdFx0XCJ2VmVydGV4Q29sb3IgPSBhVmVydGV4Q29sb3IgKiB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwidlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7IFwiICsgIFxyXG5cdFx0XHRcIn0gXCIgLFxyXG5cdFx0XHRcclxuXHRcdGZyYWdtZW50U2hhZGVyOiBcclxuXHRcdFx0XCJ1bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZVNhbXBsZXI7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdUhhc1RleHR1cmU7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgZmxvYXQgdU9wYWNpdHk7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMiB1VGV4dHVyZVJlcGVhdDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMyIHVUZXh0dXJlT2Zmc2V0OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzQgdUdlb21ldHJ5VVY7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdkxpZ2h0V2VpZ2h0OyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjNCBjb2xvciA9IHZWZXJ0ZXhDb2xvcjsgXCIgKyBcclxuXHRcdFx0XHRcImlmICh1SGFzVGV4dHVyZSl7IFwiICsgXHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgdHggPSB1R2VvbWV0cnlVVi54ICsgbW9kKHVUZXh0dXJlT2Zmc2V0LnggKyB2VGV4dHVyZUNvb3JkLnMgKiB1VGV4dHVyZVJlcGVhdC54IC0gdUdlb21ldHJ5VVYueCwgdUdlb21ldHJ5VVYueiAtIHVHZW9tZXRyeVVWLngpO1wiICtcclxuXHRcdFx0XHRcdFwibWVkaXVtcCBmbG9hdCB0eSA9IHVHZW9tZXRyeVVWLnkgKyBtb2QodVRleHR1cmVPZmZzZXQueSArIHZUZXh0dXJlQ29vcmQudCAqIHVUZXh0dXJlUmVwZWF0LnkgLSB1R2VvbWV0cnlVVi55LCB1R2VvbWV0cnlVVi53IC0gdUdlb21ldHJ5VVYueSk7XCIgK1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjNCB0ZXhDb2xvciA9IHRleHR1cmUyRCh1VGV4dHVyZVNhbXBsZXIsIHZlYzIodHgsIHR5KSk7IFwiICtcclxuXHRcdFx0XHRcdFwiY29sb3IgKj0gdGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHRcIn0gXCIgKyBcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcImNvbG9yLnJnYiAqPSB2TGlnaHRXZWlnaHQ7IFwiICsgXHJcblx0XHRcdFx0XCJnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLnJnYiwgY29sb3IuYSAqIHVPcGFjaXR5KTsgXCIgKyBcclxuXHRcdFx0XCJ9XCJcclxuXHR9LFxyXG5cdFxyXG5cdFxyXG5cdHBob25nOiB7XHJcblx0XHR2ZXJ0ZXhTaGFkZXI6IFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzIgYVRleHR1cmVDb29yZDsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleFBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFwiYXR0cmlidXRlIGxvd3AgdmVjNCBhVmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjMyBhVmVydGV4Tm9ybWFsOyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdU1WTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdVBNYXRyaXg7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjNCB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVVzZUxpZ2h0aW5nOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdU1vZGVsTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDMgdU5vcm1hbE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMyB1QW1iaWVudExpZ2h0Q29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdlZlcnRleENvbG9yOyBcIiArXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDtcIiArICBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMyB2TGlnaHRXZWlnaHQ7IFwiICtcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMyB2Tm9ybWFsOyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMzIHZQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICsgXHJcblx0XHRcdFx0XCJ2ZWM0IG1vZGVsVmlld1Bvc2l0aW9uID0gdU1WTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7IFwiICtcclxuXHRcdFx0XHRcImdsX1Bvc2l0aW9uID0gdVBNYXRyaXggKiBtb2RlbFZpZXdQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XHRcImlmICh1VXNlTGlnaHRpbmcpeyBcIiArIFxyXG5cdFx0XHRcdFx0XCJ2Tm9ybWFsID0gdU5vcm1hbE1hdHJpeCAqIGFWZXJ0ZXhOb3JtYWw7IFwiICtcclxuXHRcdFx0XHRcdFwidkxpZ2h0V2VpZ2h0ID0gdUFtYmllbnRMaWdodENvbG9yOyBcIiArXHJcblx0XHRcdFx0XCJ9ZWxzZXsgXCIgK1xyXG5cdFx0XHRcdFx0XCJ2TGlnaHRXZWlnaHQgPSB2ZWMzKDEuMCk7IFwiICsgXHJcblx0XHRcdFx0XCJ9XCIgKyAgIFxyXG5cdFx0XHRcdCBcclxuXHRcdFx0XHRcInZQb3NpdGlvbiA9ICh1TW9kZWxNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHl6OyBcIiArXHJcblx0XHRcdFx0XCJ2VmVydGV4Q29sb3IgPSBhVmVydGV4Q29sb3IgKiB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwidlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7IFwiICsgIFxyXG5cdFx0XHRcIn0gXCIgLFxyXG5cdFx0XHRcclxuXHRcdGZyYWdtZW50U2hhZGVyOiBcclxuXHRcdFx0XCJzdHJ1Y3QgTGlnaHR7IFwiICtcclxuXHRcdFx0ICAgIFwibG93cCB2ZWMzIHBvc2l0aW9uOyBcIiArXHJcblx0XHRcdCAgICBcImxvd3AgdmVjMyBjb2xvcjsgXCIgK1xyXG5cdFx0XHQgICAgXCJsb3dwIHZlYzMgZGlyZWN0aW9uOyBcIiArXHJcblx0XHRcdCAgICBcImxvd3AgZmxvYXQgaW50ZW5zaXR5OyBcIiArXHJcblx0XHRcdFwifTsgXCIgK1xyXG5cdFx0XHQgICAgXHJcblx0XHRcdFwidW5pZm9ybSBMaWdodCBsaWdodHNbOF07IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGludCB1c2VkTGlnaHRzOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gYm9vbCB1SGFzVGV4dHVyZTsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gc2FtcGxlcjJEIHVUZXh0dXJlU2FtcGxlcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVVzZVNwZWN1bGFyTWFwOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBzYW1wbGVyMkQgdVNwZWN1bGFyTWFwU2FtcGxlcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVVzZUxpZ2h0aW5nOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIGZsb2F0IHVPcGFjaXR5OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzIgdVRleHR1cmVSZXBlYXQ7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMiB1VGV4dHVyZU9mZnNldDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCB2ZWM0IHVHZW9tZXRyeVVWOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzMgdUNhbWVyYVBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMzIHVTcGVjdWxhckNvbG9yOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIGZsb2F0IHVTaGluaW5lc3M7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdkxpZ2h0V2VpZ2h0OyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMzIHZOb3JtYWw7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdlBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcIm1lZGl1bXAgdmVjMyBnZXRMaWdodFdlaWdodChtZWRpdW1wIHZlYzMgbm9ybWFsLCBtZWRpdW1wIHZlYzMgZGlyZWN0aW9uLCBsb3dwIHZlYzMgY29sb3IsIGxvd3AgZmxvYXQgaW50ZW5zaXR5KXsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCBmbG9hdCBsaWdodERvdCA9IG1heChkb3Qobm9ybWFsLCBkaXJlY3Rpb24pLCAwLjApOyBcIiArXHJcblx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgbGlnaHRXZWlnaHQgPSAoY29sb3IgKiBsaWdodERvdCAqIGludGVuc2l0eSk7IFwiICtcclxuXHRcdFx0XHRcInJldHVybiBsaWdodFdlaWdodDsgXCIgK1xyXG5cdFx0XHRcIn1cIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWM0IGNvbG9yID0gdlZlcnRleENvbG9yOyBcIiArXHJcblx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgbm9ybWFsID0gbm9ybWFsaXplKHZOb3JtYWwpOyBcIiArXHJcblx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgY2FtZXJhRGlyZWN0aW9uID0gbm9ybWFsaXplKHVDYW1lcmFQb3NpdGlvbik7IFwiICtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgdHg7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgdHk7IFwiICtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcImlmICh1SGFzVGV4dHVyZSl7IFwiICsgXHJcblx0XHRcdFx0XHRcInR4ID0gdUdlb21ldHJ5VVYueCArIG1vZCh1VGV4dHVyZU9mZnNldC54ICsgdlRleHR1cmVDb29yZC5zICogdVRleHR1cmVSZXBlYXQueCAtIHVHZW9tZXRyeVVWLngsIHVHZW9tZXRyeVVWLnogLSB1R2VvbWV0cnlVVi54KTtcIiArXHJcblx0XHRcdFx0XHRcInR5ID0gdUdlb21ldHJ5VVYueSArIG1vZCh1VGV4dHVyZU9mZnNldC55ICsgdlRleHR1cmVDb29yZC50ICogdVRleHR1cmVSZXBlYXQueSAtIHVHZW9tZXRyeVVWLnksIHVHZW9tZXRyeVVWLncgLSB1R2VvbWV0cnlVVi55KTtcIiArXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFwibWVkaXVtcCB2ZWM0IHRleENvbG9yID0gdGV4dHVyZTJEKHVUZXh0dXJlU2FtcGxlciwgdmVjMih0eCwgdHkpKTsgXCIgK1xyXG5cdFx0XHRcdFx0XCJjb2xvciAqPSB0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwifSBcIiArIFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWMzIHBob25nTGlnaHRXZWlnaHQgPSB2ZWMzKDAuMCk7IFwiICsgXHJcblx0XHRcdFx0XCJpZiAodVVzZUxpZ2h0aW5nKXsgXCIgK1xyXG5cdFx0XHRcdFx0XCJmb3IgKGludCBpPTA7aTw4O2krKyl7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJpZiAoaSA+PSB1c2VkTGlnaHRzKXtcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJicmVhazsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcIn1cIiArXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcIkxpZ2h0IGwgPSBsaWdodHNbaV07IFwiICtcclxuXHRcdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgbFBvcyA9IGwucG9zaXRpb24gLSB2UG9zaXRpb247XCIgK1xyXG5cdFx0XHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgbERpc3RhbmNlID0gbGVuZ3RoKGxQb3MpIC8gMi4wOyBcIiArXHJcblx0XHRcdFx0XHRcdFwiaWYgKGxlbmd0aChsLnBvc2l0aW9uKSA9PSAwLjApeyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJsRGlzdGFuY2UgPSAxLjA7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcImxQb3MgPSB2ZWMzKDAuMCk7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgbGlnaHREaXJlY3Rpb24gPSBsLmRpcmVjdGlvbiArIG5vcm1hbGl6ZShsUG9zKTsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcInBob25nTGlnaHRXZWlnaHQgKz0gZ2V0TGlnaHRXZWlnaHQobm9ybWFsLCBsaWdodERpcmVjdGlvbiwgbC5jb2xvciwgbC5pbnRlbnNpdHkpIC8gbERpc3RhbmNlOyBcIiArXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XCJsb3dwIGZsb2F0IHNoaW5pbmVzcyA9IHVTaGluaW5lc3M7IFwiICsgXHJcblx0XHRcdFx0XHRcdFwiaWYgKHVVc2VTcGVjdWxhck1hcCl7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcInNoaW5pbmVzcyA9IHRleHR1cmUyRCh1U3BlY3VsYXJNYXBTYW1wbGVyLCB2ZWMyKHR4LCB0eSkpLnIgKiAyNTUuMDsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XCJpZiAoc2hpbmluZXNzID4gMC4wICYmIHNoaW5pbmVzcyA8IDI1NS4wKXsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGhhbGZBbmdsZSA9IG5vcm1hbGl6ZShjYW1lcmFEaXJlY3Rpb24gKyBsaWdodERpcmVjdGlvbik7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgc3BlY0RvdCA9IG1heChkb3QoaGFsZkFuZ2xlLCBub3JtYWwpLCAwLjApOyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJjb2xvciArPSB2ZWM0KHVTcGVjdWxhckNvbG9yLCAxLjApICogcG93KHNwZWNEb3QsIHNoaW5pbmVzcyk7IFwiICsgXHJcblx0XHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XCJjb2xvci5yZ2IgKj0gdkxpZ2h0V2VpZ2h0ICsgcGhvbmdMaWdodFdlaWdodDsgXCIgKyBcclxuXHRcdFx0XHRcImdsX0ZyYWdDb2xvciA9IHZlYzQoY29sb3IucmdiLCBjb2xvci5hICogdU9wYWNpdHkpOyBcIiArIFxyXG5cdFx0XHRcIn1cIlxyXG5cdH1cclxufTsiLCJ2YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL0tUVXRpbHMnKTtcclxudmFyIFZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG5cclxuZnVuY3Rpb24gVGV4dHVyZShzcmMsIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0dGV4dHVyZSA9IHRydWU7XHJcblx0XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cdHRoaXMubWluRmlsdGVyID0gKHBhcmFtcy5taW5GaWx0ZXIpPyBwYXJhbXMubWluRmlsdGVyIDogZ2wuTElORUFSO1xyXG5cdHRoaXMubWFnRmlsdGVyID0gKHBhcmFtcy5tYWdGaWx0ZXIpPyBwYXJhbXMubWFnRmlsdGVyIDogZ2wuTElORUFSO1xyXG5cdHRoaXMud3JhcFMgPSAocGFyYW1zLlNXcmFwcGluZyk/IHBhcmFtcy5TV3JhcHBpbmcgOiBnbC5SRVBFQVQ7XHJcblx0dGhpcy53cmFwVCA9IChwYXJhbXMuVFdyYXBwaW5nKT8gcGFyYW1zLlRXcmFwcGluZyA6IGdsLlJFUEVBVDtcclxuXHR0aGlzLnJlcGVhdCA9IChwYXJhbXMucmVwZWF0KT8gcGFyYW1zLnJlcGVhdCA6IG5ldyBWZWN0b3IyKDEuMCwgMS4wKTtcclxuXHR0aGlzLm9mZnNldCA9IChwYXJhbXMub2Zmc2V0KT8gcGFyYW1zLm9mZnNldCA6IG5ldyBWZWN0b3IyKDAuMCwgMC4wKTtcclxuXHR0aGlzLmdlbmVyYXRlTWlwbWFwID0gKHBhcmFtcy5nZW5lcmF0ZU1pcG1hcCk/IHRydWUgOiBmYWxzZTtcclxuXHRcclxuXHR0aGlzLnRleHR1cmUgPSBudWxsO1xyXG5cdFxyXG5cdHZhciBpbWcgPSBLVC5nZXRJbWFnZShzcmMpO1xyXG5cdGlmIChpbWcpe1xyXG5cdFx0dGhpcy5pbWFnZSA9IGltZztcclxuXHRcdHRoaXMucGFyc2VUZXh0dXJlKCk7XHJcblx0fWVsc2V7XHJcblx0XHR0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XHJcblx0XHR0aGlzLmltYWdlLnNyYyA9IHNyYztcclxuXHRcdHRoaXMuaW1hZ2UucmVhZHkgPSBmYWxzZTtcclxuXHRcdFxyXG5cdFx0dmFyIFQgPSB0aGlzO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQodGhpcy5pbWFnZSwgXCJsb2FkXCIsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdEtULmltYWdlcy5wdXNoKHtzcmM6IHNyYywgaW1nOiBULmltYWdlfSk7XHJcblx0XHRcdFQucGFyc2VUZXh0dXJlKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dHVyZTtcclxuXHJcblRleHR1cmUucHJvdG90eXBlLnBhcnNlVGV4dHVyZSA9IGZ1bmN0aW9uKCl7XHJcblx0aWYgKHRoaXMuaW1hZ2UucmVhZHkpIHJldHVybjtcclxuXHRcclxuXHR0aGlzLmltYWdlLnJlYWR5ID0gdHJ1ZTtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHR0aGlzLnRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcclxuXHRcclxuXHRnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCB0cnVlKTtcclxuXHRcclxuXHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIHRoaXMuaW1hZ2UpO1xyXG5cdFxyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCB0aGlzLm1hZ0ZpbHRlcik7XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIHRoaXMubWluRmlsdGVyKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCB0aGlzLndyYXBTKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCB0aGlzLndyYXBUKTtcclxuXHRcclxuXHRpZiAodGhpcy5nZW5lcmF0ZU1pcG1hcClcclxuXHRcdGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xyXG5cdFxyXG5cdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xyXG59O1xyXG5cclxuVGV4dHVyZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiBuZXcgVGV4dHVyZSh0aGlzLmltYWdlLnNyYywgdGhpcy5wYXJhbXMpO1xyXG59O1xyXG4iLCJ2YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcblxyXG5mdW5jdGlvbiBUZXh0dXJlRnJhbWVidWZmZXIod2lkdGgsIGhlaWdodCwgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3R0ZXh0dXJlZnJhbWVidWZmZXIgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHR0aGlzLm1pbkZpbHRlciA9IChwYXJhbXMubWluRmlsdGVyKT8gcGFyYW1zLm1pbkZpbHRlciA6IGdsLkxJTkVBUjtcclxuXHR0aGlzLm1hZ0ZpbHRlciA9IChwYXJhbXMubWFnRmlsdGVyKT8gcGFyYW1zLm1hZ0ZpbHRlciA6IGdsLkxJTkVBUjtcclxuXHR0aGlzLndyYXBTID0gKHBhcmFtcy5TV3JhcHBpbmcpPyBwYXJhbXMuU1dyYXBwaW5nIDogZ2wuQ0xBTVBfVE9fRURHRTtcclxuXHR0aGlzLndyYXBUID0gKHBhcmFtcy5UV3JhcHBpbmcpPyBwYXJhbXMuVFdyYXBwaW5nIDogZ2wuQ0xBTVBfVE9fRURHRTtcclxuXHR0aGlzLnJlcGVhdCA9IChwYXJhbXMucmVwZWF0KT8gcGFyYW1zLnJlcGVhdCA6IG5ldyBWZWN0b3IyKDEuMCwgMS4wKTtcclxuXHR0aGlzLm9mZnNldCA9IChwYXJhbXMub2Zmc2V0KT8gcGFyYW1zLm9mZnNldCA6IG5ldyBWZWN0b3IyKDAuMCwgMC4wKTtcclxuXHR0aGlzLmdlbmVyYXRlTWlwbWFwID0gKHBhcmFtcy5nZW5lcmF0ZU1pcG1hcCk/IHRydWUgOiBmYWxzZTtcclxuXHRcclxuXHR0aGlzLmZyYW1lYnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcclxuXHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIHRoaXMuZnJhbWVidWZmZXIpO1xyXG5cdHRoaXMuZnJhbWVidWZmZXIud2lkdGggPSB3aWR0aDtcclxuXHR0aGlzLmZyYW1lYnVmZmVyLmhlaWdodCA9IGhlaWdodDtcclxuXHRcclxuXHR0aGlzLnRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgdGhpcy5tYWdGaWx0ZXIpO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCB0aGlzLm1pbkZpbHRlcik7XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgdGhpcy53cmFwUyk7XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgdGhpcy53cmFwVCk7XHJcblx0XHJcblx0aWYgKHRoaXMuZ2VuZXJhdGVNaXBtYXApXHJcblx0XHRnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcclxuXHRcdFxyXG5cdGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgd2lkdGgsIGhlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgbnVsbCk7XHJcblx0XHJcblx0XHJcblx0dGhpcy5yZW5kZXJCdWZmZXIgPSBnbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcclxuXHRnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgdGhpcy5yZW5kZXJCdWZmZXIpO1xyXG5cdGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoZ2wuUkVOREVSQlVGRkVSLCBnbC5ERVBUSF9DT01QT05FTlQxNiwgd2lkdGgsIGhlaWdodCk7XHJcblx0XHJcblx0Z2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoZ2wuRlJBTUVCVUZGRVIsIGdsLkNPTE9SX0FUVEFDSE1FTlQwLCBnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUsIDApO1xyXG5cdGdsLmZyYW1lYnVmZmVyUmVuZGVyYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBnbC5ERVBUSF9BVFRBQ0hNRU5ULCBnbC5SRU5ERVJCVUZGRVIsIHRoaXMucmVuZGVyQnVmZmVyKTtcclxuXHRcclxuXHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xyXG5cdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xyXG5cdGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCBudWxsKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlRnJhbWVidWZmZXI7IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Z2V0OiBmdW5jdGlvbihlbGVtZW50KXtcclxuXHRcdGlmIChlbGVtZW50LmNoYXJBdCgwKSA9PSBcIiNcIil7XHJcblx0XHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50LnJlcGxhY2UoXCIjXCIsIFwiXCIpKTtcclxuXHRcdH1lbHNlIGlmIChlbGVtZW50LmNoYXJBdCgwKSA9PSBcIi5cIil7XHJcblx0XHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGVsZW1lbnQucmVwbGFjZShcIi5cIiwgXCJcIikpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShlbGVtZW50KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGFkZEV2ZW50OiBmdW5jdGlvbihlbGVtZW50LCB0eXBlLCBjYWxsYmFjayl7XHJcblx0XHRpZiAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKXtcclxuXHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBmYWxzZSk7XHJcblx0XHR9ZWxzZSBpZiAoZWxlbWVudC5hdHRhY2hFdmVudCl7XHJcblx0XHRcdGVsZW1lbnQuYXR0YWNoRXZlbnQoXCJvblwiICsgdHlwZSwgY2FsbGJhY2spO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Z2V0SHR0cDogZnVuY3Rpb24oKXtcclxuXHRcdGlmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3Qpe1xyXG5cdFx0XHRyZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHR9ZWxzZSBpZiAod2luZG93LkFjdGl2ZVhPYmplY3Qpe1xyXG5cdFx0XHRodHRwID0gbmV3IHdpbmRvdy5BY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTEhUVFBcIik7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH0sXHJcblx0XHJcblx0Z2V0RmlsZUNvbnRlbnQ6IGZ1bmN0aW9uKGZpbGVVUkwsIGNhbGxiYWNrKXtcclxuXHRcdHZhciBodHRwID0gdGhpcy5nZXRIdHRwKCk7XHJcblx0XHRodHRwLm9wZW4oJ0dFVCcsIGZpbGVVUkwsIHRydWUpO1xyXG5cdFx0aHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHQgIFx0XHRpZiAoaHR0cC5yZWFkeVN0YXRlID09IDQgJiYgaHR0cC5zdGF0dXMgPT0gMjAwKSB7XHJcblx0XHRcdFx0aWYgKGNhbGxiYWNrKXtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKGh0dHAucmVzcG9uc2VUZXh0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRodHRwLnNlbmQoKTtcclxuXHR9XHJcbn07XHJcbiIsImZ1bmN0aW9uIFZlY3RvcjIoeCwgeSl7XHJcblx0dGhpcy5fX2t0djIgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yMjtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkpO1xyXG5cdFxyXG5cdHJldHVybiBsZW5ndGg7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMueCAvPSBsZW5ndGg7XHJcblx0dGhpcy55IC89IGxlbmd0aDtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKHZlY3RvcjIpe1xyXG5cdGlmICghdmVjdG9yMi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgcGVyZm9ybSBhIGRvdCBwcm9kdWN0IHdpdGggYSB2ZWN0b3IyXCI7XHJcblx0XHJcblx0cmV0dXJuIHRoaXMueCAqIHZlY3RvcjIueCArIHRoaXMueSAqIHZlY3RvcjIueTtcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihudW1iZXIpe1xyXG5cdHRoaXMueCAqPSBudW1iZXI7XHJcblx0dGhpcy55ICo9IG51bWJlcjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHZlY3RvcjIpe1xyXG5cdGlmICghdmVjdG9yMi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgYWRkIGEgdmVjdG9yMiB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCArPSB2ZWN0b3IyLng7XHJcblx0dGhpcy55ICs9IHZlY3RvcjIueTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbih2ZWN0b3IyKXtcclxuXHRpZiAoIXZlY3RvcjIuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSB2ZWN0b3IyIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ID0gdmVjdG9yMi54O1xyXG5cdHRoaXMueSA9IHZlY3RvcjIueTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHkpe1xyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54LCB0aGlzLnkpO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24odmVjdG9yMil7XHJcblx0aWYgKCF2ZWN0b3IyLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgdmVjdG9yMiB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHJldHVybiAodGhpcy54ID09IHZlY3RvcjIueCAmJiB0aGlzLnkgPT0gdmVjdG9yMi55KTtcclxufTtcclxuXHJcblZlY3RvcjIudmVjdG9yc0RpZmZlcmVuY2UgPSBmdW5jdGlvbih2ZWN0b3IyX2EsIHZlY3RvcjJfYil7XHJcblx0aWYgKCF2ZWN0b3IyX2EuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMyXCI7XHJcblx0aWYgKCF2ZWN0b3IyX2IuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMyXCI7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IyKHZlY3RvcjJfYS54IC0gdmVjdG9yMl9iLngsIHZlY3RvcjJfYS55IC0gdmVjdG9yMl9iLnkpO1xyXG59O1xyXG5cclxuVmVjdG9yMi5mcm9tQW5nbGUgPSBmdW5jdGlvbihyYWRpYW4pe1xyXG5cdHZhciB4ID0gTWF0aC5jb3MocmFkaWFuKTtcclxuXHR2YXIgeSA9IC1NYXRoLnNpbihyYWRpYW4pO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMih4LCB5KTtcclxufTtcclxuIiwiZnVuY3Rpb24gVmVjdG9yMyh4LCB5LCB6KXtcclxuXHR0aGlzLl9fa3R2MyA9IHRydWU7XHJcblx0XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZlY3RvcjM7XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55ICsgdGhpcy56ICogdGhpcy56KTtcclxuXHRcclxuXHRyZXR1cm4gbGVuZ3RoO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGgoKTtcclxuXHRcclxuXHR0aGlzLnggLz0gbGVuZ3RoO1xyXG5cdHRoaXMueSAvPSBsZW5ndGg7XHJcblx0dGhpcy56IC89IGxlbmd0aDtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgcGVyZm9ybSBhIGRvdCBwcm9kdWN0IHdpdGggYSB2ZWN0b3IzXCI7XHJcblx0XHJcblx0cmV0dXJuIHRoaXMueCAqIHZlY3RvcjMueCArIHRoaXMueSAqIHZlY3RvcjMueSArIHRoaXMueiAqIHZlY3RvcjMuejtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBwZXJmb3JtIGEgY3Jvc3MgcHJvZHVjdCB3aXRoIGEgdmVjdG9yM1wiO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMyhcclxuXHRcdHRoaXMueSAqIHZlY3RvcjMueiAtIHRoaXMueiAqIHZlY3RvcjMueSxcclxuXHRcdHRoaXMueiAqIHZlY3RvcjMueCAtIHRoaXMueCAqIHZlY3RvcjMueixcclxuXHRcdHRoaXMueCAqIHZlY3RvcjMueSAtIHRoaXMueSAqIHZlY3RvcjMueFxyXG5cdCk7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24obnVtYmVyKXtcclxuXHR0aGlzLnggKj0gbnVtYmVyO1xyXG5cdHRoaXMueSAqPSBudW1iZXI7XHJcblx0dGhpcy56ICo9IG51bWJlcjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgYWRkIGEgVmVjdG9yMyB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCArPSB2ZWN0b3IzLng7XHJcblx0dGhpcy55ICs9IHZlY3RvcjMueTtcclxuXHR0aGlzLnogKz0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIFZlY3RvcjMgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHR0aGlzLnggPSB2ZWN0b3IzLng7XHJcblx0dGhpcy55ID0gdmVjdG9yMy55O1xyXG5cdHRoaXMueiA9IHZlY3RvcjMuejtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHksIHope1xyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxuXHR0aGlzLnogPSB6O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLngsIHRoaXMueSwgdGhpcy56KTtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIFZlY3RvcjMgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHRyZXR1cm4gKHRoaXMueCA9PSB2ZWN0b3IzLnggJiYgdGhpcy55ID09IHZlY3RvcjMueSAmJiB0aGlzLnogPT0gdmVjdG9yMy56KTtcclxufTtcclxuXHJcblZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UgPSBmdW5jdGlvbih2ZWN0b3IzX2EsIHZlY3RvcjNfYil7XHJcblx0aWYgKCF2ZWN0b3IzX2EuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMzXCI7XHJcblx0aWYgKCF2ZWN0b3IzX2IuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMzXCI7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IzKHZlY3RvcjNfYS54IC0gdmVjdG9yM19iLngsIHZlY3RvcjNfYS55IC0gdmVjdG9yM19iLnksIHZlY3RvcjNfYS56IC0gdmVjdG9yM19iLnopO1xyXG59O1xyXG5cclxuVmVjdG9yMy5mcm9tQW5nbGUgPSBmdW5jdGlvbihyYWRpYW5feHosIHJhZGlhbl95KXtcclxuXHR2YXIgeCA9IE1hdGguY29zKHJhZGlhbl94eik7XHJcblx0dmFyIHkgPSBNYXRoLnNpbihyYWRpYW5feSk7XHJcblx0dmFyIHogPSAtTWF0aC5zaW4ocmFkaWFuX3h6KTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjMoeCwgeSwgeik7XHJcbn07XHJcbiIsImZ1bmN0aW9uIFZlY3RvcjQoeCwgeSwgeiwgdyl7XHJcblx0dGhpcy5fX2t0djQgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxuXHR0aGlzLnogPSB6O1xyXG5cdHRoaXMudyA9IHc7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZlY3RvcjQ7XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55ICsgdGhpcy56ICogdGhpcy56ICsgdGhpcy53ICogdGhpcy53KTtcclxuXHRcclxuXHRyZXR1cm4gbGVuZ3RoO1xyXG59O1xyXG5cclxuVmVjdG9yNC5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGgoKTtcclxuXHRcclxuXHR0aGlzLnggLz0gbGVuZ3RoO1xyXG5cdHRoaXMueSAvPSBsZW5ndGg7XHJcblx0dGhpcy56IC89IGxlbmd0aDtcclxuXHR0aGlzLncgLz0gbGVuZ3RoO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yNC5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24odmVjdG9yNCl7XHJcblx0aWYgKCF2ZWN0b3I0Ll9fa3R2NCkgdGhyb3cgXCJDYW4gb25seSBwZXJmb3JtIGEgZG90IHByb2R1Y3Qgd2l0aCBhIHZlY3RvcjRcIjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcy54ICogdmVjdG9yNC54ICsgdGhpcy55ICogdmVjdG9yNC55ICsgdGhpcy56ICogdmVjdG9yNC56ICsgdGhpcy53ICogdmVjdG9yNC53O1xyXG59O1xyXG5cclxuVmVjdG9yNC5wcm90b3R5cGUuaW52ZXJ0ID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gdGhpcy5tdWx0aXBseSgtMSk7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uKG51bWJlcil7XHJcblx0dGhpcy54ICo9IG51bWJlcjtcclxuXHR0aGlzLnkgKj0gbnVtYmVyO1xyXG5cdHRoaXMueiAqPSBudW1iZXI7XHJcblx0dGhpcy53ICo9IG51bWJlcjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHZlY3RvcjQpe1xyXG5cdGlmICghdmVjdG9yNC5fX2t0djQpIHRocm93IFwiQ2FuIG9ubHkgYWRkIGEgdmVjdG9yNCB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCArPSB2ZWN0b3I0Lng7XHJcblx0dGhpcy55ICs9IHZlY3RvcjQueTtcclxuXHR0aGlzLnogKz0gdmVjdG9yNC56O1xyXG5cdHRoaXMudyArPSB2ZWN0b3I0Lnc7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24odmVjdG9yNCl7XHJcblx0aWYgKCF2ZWN0b3I0Ll9fa3R2NCkgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgdmVjdG9yNCB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCA9IHZlY3RvcjQueDtcclxuXHR0aGlzLnkgPSB2ZWN0b3I0Lnk7XHJcblx0dGhpcy56ID0gdmVjdG9yNC56O1xyXG5cdHRoaXMudyA9IHZlY3RvcjQudztcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHksIHosIHcpe1xyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxuXHR0aGlzLnogPSB6O1xyXG5cdHRoaXMudyA9IHc7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIG5ldyB2ZWN0b3I0KHRoaXMueCwgdGhpcy55LCB0aGlzLnosIHRoaXMudyk7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbih2ZWN0b3I0KXtcclxuXHRpZiAoIXZlY3RvcjQuX19rdHY0KSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSB2ZWN0b3I0IHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0cmV0dXJuICh0aGlzLnggPT0gdmVjdG9yNC54ICYmIHRoaXMueSA9PSB2ZWN0b3I0LnkgJiYgdGhpcy56ID09IHZlY3RvcjQueiAmJiB0aGlzLncgPT0gdmVjdG9yNC53KTtcclxufTtcclxuXHJcblZlY3RvcjQudmVjdG9yc0RpZmZlcmVuY2UgPSBmdW5jdGlvbih2ZWN0b3I0X2EsIHZlY3RvcjRfYil7XHJcblx0aWYgKCF2ZWN0b3I0X2EuX19rdHY0KSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnM0XCI7XHJcblx0aWYgKCF2ZWN0b3I0X2IuX19rdHY0KSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnM0XCI7XHJcblx0XHJcblx0cmV0dXJuIG5ldyB2ZWN0b3I0KHZlY3RvcjRfYS54IC0gdmVjdG9yNF9iLngsIHZlY3RvcjRfYS55IC0gdmVjdG9yNF9iLnksIHZlY3RvcjRfYS56IC0gdmVjdG9yNF9iLnosIHZlY3RwcjRfYS53IC0gdmVjdG9yNF9iLncpO1xyXG59OyIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbktULkNhbWVyYU9ydGhvID0gcmVxdWlyZSgnLi9LVENhbWVyYU9ydGhvJyk7XHJcbktULkNhbWVyYVBlcnNwZWN0aXZlID0gcmVxdWlyZSgnLi9LVENhbWVyYVBlcnNwZWN0aXZlJyk7XHJcbktULkNvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbktULkdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbktULkdlb21ldHJ5M0RNb2RlbCA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeTNETW9kZWwnKTtcclxuS1QuR2VvbWV0cnlCb3ggPSByZXF1aXJlKCcuL0tUR2VvbWV0cnlCb3gnKTtcclxuS1QuR2VvbWV0cnlDeWxpbmRlciA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeUN5bGluZGVyJyk7XHJcbktULkdlb21ldHJ5UGxhbmUgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnlQbGFuZScpO1xyXG5LVC5HZW9tZXRyeVNreWJveCA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeVNreWJveCcpO1xyXG5LVC5HZW9tZXRyeVNwaGVyZSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeVNwaGVyZScpO1xyXG5LVC5HVUlUZXh0dXJlID0gcmVxdWlyZSgnLi9LVEdVSVRleHR1cmUnKTtcclxuS1QuTGlnaHREaXJlY3Rpb25hbCA9IHJlcXVpcmUoJy4vS1RMaWdodERpcmVjdGlvbmFsJyk7XHJcbktULkxpZ2h0UG9pbnQgPSByZXF1aXJlKCcuL0tUTGlnaHRQb2ludCcpO1xyXG5LVC5JbnB1dCA9IHJlcXVpcmUoJy4vS1RJbnB1dCcpO1xyXG5LVC5NYXRlcmlhbCA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbCcpO1xyXG5LVC5NYXRlcmlhbEJhc2ljID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsQmFzaWMnKTtcclxuS1QuTWF0ZXJpYWxMYW1iZXJ0ID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsTGFtYmVydCcpO1xyXG5LVC5NYXRlcmlhbFBob25nID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsUGhvbmcnKTtcclxuS1QuTWF0aCA9IHJlcXVpcmUoJy4vS1RNYXRoJyk7XHJcbktULk1hdHJpeDMgPSByZXF1aXJlKCcuL0tUTWF0cml4MycpO1xyXG5LVC5NYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxuS1QuTWVzaCA9IHJlcXVpcmUoJy4vS1RNZXNoJyk7XHJcbktULk9yYml0QW5kUGFuID0gcmVxdWlyZSgnLi9LVE9yYml0QW5kUGFuJyk7XHJcbktULlRleHR1cmUgPSByZXF1aXJlKCcuL0tUVGV4dHVyZScpO1xyXG5LVC5UZXh0dXJlRnJhbWVidWZmZXIgPSByZXF1aXJlKCcuL0tUVGV4dHVyZUZyYW1lYnVmZmVyJyk7XHJcbktULlV0aWxzID0gcmVxdWlyZSgnLi9LVFV0aWxzJyk7XHJcbktULlZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG5LVC5WZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxuS1QuVmVjdG9yNCA9IHJlcXVpcmUoJy4vS1RWZWN0b3I0Jyk7XHJcbktULlNjZW5lID0gcmVxdWlyZSgnLi9LVFNjZW5lJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtUOyIsIndpbmRvdy5LVCA9IHJlcXVpcmUoJy4vS3JhbVRlY2gnKTsiXX0=
