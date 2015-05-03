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
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightSpot.js":[function(require,module,exports){
var KT = require('./KTMain');
var Color = require('./KTColor');
var Vector3 = require('./KTVector3');
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
}

module.exports = LightSpot;

LightSpot.prototype.setCastShadow = function(castShadow){
	this.castShadow = castShadow;
	
	if (castShadow){
		var rel = KT.canvas.width / KT.canvas.height;
		this.shadowCam = new KT.CameraPerspective(KT.Math.degToRad(90.0), rel, 0.1, this.distance);
		this.shadowCam.position = this.position;
		this.shadowCam.lookAt(this.target);
		
		this.shadowBuffer = new TextureFramebuffer(512.0, 512.0);
	}else{
		this.shadowCam = null;
		this.shadowBuffer = null;
	}
};

},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTTextureFramebuffer":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTextureFramebuffer.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js":[function(require,module,exports){
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
		this.shaders.depth = this.processShader(Shaders.depthMap);
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
			}else{
				for (var j=0;j<uniLen;j++){
					uniforms.push({name: name + "[" + j + "]"});
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
	if (!geometry.__ktgeometry) throw "Geometry must be a KTGeometry instance";
	if (!material.__ktmaterial) throw "Material must be a KTMaterial instance";
	
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

},{"./KTInput":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTInput.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTScene.js":[function(require,module,exports){
var KT = require('./KTMain');
var Color = require('./KTColor');
var Material = require('./KTMaterial');
var MaterialBasic = require('./KTMaterialBasic');

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
	this.shadowMapping = false;
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
	this.render(camera);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

Scene.prototype.render = function(camera, scene){
	var gl = KT.gl;
	
	
	if (!this.shadowMapping){
		for (var i=0,len=this.lights.length-1;i<=len;i++){
			if (this.lights[i].castShadow){
				this.shadowMapping = true;
				this.renderToFramebuffer(this.lights[i].shadowCam, this.lights[i].shadowBuffer);
			}
			
			if (i == len){
				this.shadowMapping = false;
			}
		}
		
		if (camera.controls) camera.controls.update();
	
		if (camera.skybox){
			var sky = camera.skybox.meshes;
			for (var i=0,len=sky.length;i<len;i++){
				this.drawMesh(sky[i], camera);
			}
		}
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

},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js","./KTMaterialBasic":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialBasic.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTShaders.js":[function(require,module,exports){
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
			    "lowp vec3 spotDirection; " +
			    "lowp float intensity; " +
			    "lowp float innerAngle; " +
			    "lowp float outerAngle; " +
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
						
						"lowp float spotWeight = 1.0; " +
			            "if (length(l.spotDirection) != 0.0){ " +
			                "lowp float cosAngle = dot(l.spotDirection, lightDirection); " +
			            	"spotWeight = clamp((cosAngle - l.outerAngle) / (l.innerAngle - l.outerAngle), 0.0, 1.0); " +
			                "lDistance = 1.0; " +
			            "} " +
			            
						"vLightWeight += getLightWeight(aVertexNormal, lightDirection, l.color, l.intensity) * spotWeight / lDistance; " + 
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
			    "lowp vec3 spotDirection; " +
			    "lowp float intensity; " +
			    "lowp float innerAngle; " +
			    "lowp float outerAngle; " +
			    "mediump mat4 mvProjection; " +
			"}; " +
			    
			"uniform Light lights[8]; " +
		    "uniform sampler2D shadowMaps[8]; " +
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
				
				"mediump float r = texture2D(shadowMaps[0], vec2(0.0, 0.0)).r; " +
				
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
						
						"lowp float spotWeight = 1.0; " +
			            "if (length(l.spotDirection) != 0.0){ " +
			                "lowp float cosAngle = dot(l.spotDirection, lightDirection); " +
			            	"spotWeight = clamp((cosAngle - l.outerAngle) / (l.innerAngle - l.outerAngle), 0.0, 1.0); " +
			                "lDistance = 1.0; " +
			            "} " +
			            
						"phongLightWeight += getLightWeight(normal, lightDirection, l.color, l.intensity) * spotWeight / lDistance; " + 
						
						
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
	},
	
	depthMap: {
		vertexShader: 
			"attribute mediump vec3 aVertexPosition; " +
			
			"uniform mediump mat4 uMVPMatrix; " +
			
			"void main(void){ " + 
				"gl_Position = uMVPMatrix * vec4(aVertexPosition, 1.0); " +
			"} " ,
			
		fragmentShader: 
			"void main(void){ " +
			    "lowp float depth = gl_FragCoord.z * 8.0 - 7.0; " +
			    "gl_FragColor = vec4(depth, depth, depth, 1.0); " +
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
KT.TextureFramebuffer = require('./KTTextureFramebuffer');
KT.Utils = require('./KTUtils');
KT.Vector2 = require('./KTVector2');
KT.Vector3 = require('./KTVector3');
KT.Vector4 = require('./KTVector4');
KT.Scene = require('./KTScene');

module.exports = KT;
},{"./KTCameraOrtho":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraOrtho.js","./KTCameraPerspective":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraPerspective.js","./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTGeometry3DModel":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry3DModel.js","./KTGeometryBox":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryBox.js","./KTGeometryCylinder":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryCylinder.js","./KTGeometryGUITexture":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryGUITexture.js","./KTGeometryPlane":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryPlane.js","./KTGeometrySkybox":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometrySkybox.js","./KTGeometrySphere":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometrySphere.js","./KTInput":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTInput.js","./KTLightDirectional":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightDirectional.js","./KTLightPoint":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightPoint.js","./KTLightSpot":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightSpot.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js","./KTMaterialBasic":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialBasic.js","./KTMaterialLambert":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialLambert.js","./KTMaterialPhong":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialPhong.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTMatrix3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix3.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTMesh":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMesh.js","./KTMeshSprite":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMeshSprite.js","./KTOrbitAndPan":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTOrbitAndPan.js","./KTScene":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTScene.js","./KTTexture":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTexture.js","./KTTextureFramebuffer":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTextureFramebuffer.js","./KTUtils":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js","./KTVector4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js":[function(require,module,exports){
window.KT = require('./KramTech');
},{"./KramTech":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KramTech.js"}]},{},["c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiLi5cXHNyY1xcS1RDYW1lcmFPcnRoby5qcyIsIi4uXFxzcmNcXEtUQ2FtZXJhUGVyc3BlY3RpdmUuanMiLCIuLlxcc3JjXFxLVENvbG9yLmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeS5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnkzRE1vZGVsLmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeUJveC5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlDeWxpbmRlci5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlHVUlUZXh0dXJlLmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeVBsYW5lLmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeVNreWJveC5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlTcGhlcmUuanMiLCIuLlxcc3JjXFxLVElucHV0LmpzIiwiLi5cXHNyY1xcS1RMaWdodERpcmVjdGlvbmFsLmpzIiwiLi5cXHNyY1xcS1RMaWdodFBvaW50LmpzIiwiLi5cXHNyY1xcS1RMaWdodFNwb3QuanMiLCIuLlxcc3JjXFxLVE1haW4uanMiLCIuLlxcc3JjXFxLVE1hdGVyaWFsLmpzIiwiLi5cXHNyY1xcS1RNYXRlcmlhbEJhc2ljLmpzIiwiLi5cXHNyY1xcS1RNYXRlcmlhbExhbWJlcnQuanMiLCIuLlxcc3JjXFxLVE1hdGVyaWFsUGhvbmcuanMiLCIuLlxcc3JjXFxLVE1hdGguanMiLCIuLlxcc3JjXFxLVE1hdHJpeDMuanMiLCIuLlxcc3JjXFxLVE1hdHJpeDQuanMiLCIuLlxcc3JjXFxLVE1lc2guanMiLCIuLlxcc3JjXFxLVE1lc2hTcHJpdGUuanMiLCIuLlxcc3JjXFxLVE9yYml0QW5kUGFuLmpzIiwiLi5cXHNyY1xcS1RTY2VuZS5qcyIsIi4uXFxzcmNcXEtUU2hhZGVycy5qcyIsIi4uXFxzcmNcXEtUVGV4dHVyZS5qcyIsIi4uXFxzcmNcXEtUVGV4dHVyZUZyYW1lYnVmZmVyLmpzIiwiLi5cXHNyY1xcS1RVdGlscy5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yMi5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yMy5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yNC5qcyIsIi4uXFxzcmNcXEtyYW1UZWNoLmpzIiwiLi5cXHNyY1xcV2luZG93RXhwb3J0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxudmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBWZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxudmFyIEtUTWF0aCA9IHJlcXVpcmUoJy4vS1RNYXRoJyk7XHJcblxyXG5mdW5jdGlvbiBDYW1lcmFPcnRobyh3aWR0aCwgaGVpZ2h0LCB6bmVhciwgemZhcil7XHJcblx0dGhpcy5fX2t0Y2FtZXJhID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMC4wLCAwLjAsIDAuMCk7XHJcblx0dGhpcy51cFZlY3RvciA9IG5ldyBWZWN0b3IzKDAuMCwgMS4wLCAwLjApO1xyXG5cdHRoaXMubG9va0F0KG5ldyBWZWN0b3IzKDAuMCwgMC4wLCAtMS4wKSk7XHJcblx0dGhpcy5sb2NrZWQgPSBmYWxzZTtcclxuXHRcclxuXHR0aGlzLndpZHRoID0gd2lkdGg7XHJcblx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcblx0dGhpcy56bmVhciA9IHpuZWFyO1xyXG5cdHRoaXMuemZhciA9IHpmYXI7XHJcblx0XHJcblx0dGhpcy5jb250cm9scyA9IG51bGw7XHJcblx0XHJcblx0dGhpcy5zZXRPcnRobygpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhbWVyYU9ydGhvO1xyXG5cclxuQ2FtZXJhT3J0aG8ucHJvdG90eXBlLnNldE9ydGhvID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgQyA9IDIuMCAvIHRoaXMud2lkdGg7XHJcblx0dmFyIFIgPSAyLjAgLyB0aGlzLmhlaWdodDtcclxuXHR2YXIgQSA9IC0yLjAgLyAodGhpcy56ZmFyIC0gdGhpcy56bmVhcik7XHJcblx0dmFyIEIgPSAtKHRoaXMuemZhciArIHRoaXMuem5lYXIpIC8gKHRoaXMuemZhciAtIHRoaXMuem5lYXIpO1xyXG5cdFxyXG5cdHRoaXMucGVyc3BlY3RpdmVNYXRyaXggPSBuZXcgTWF0cml4NChcclxuXHRcdEMsIDAsIDAsIDAsXHJcblx0XHQwLCBSLCAwLCAwLFxyXG5cdFx0MCwgMCwgQSwgQixcclxuXHRcdDAsIDAsIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuQ2FtZXJhT3J0aG8ucHJvdG90eXBlLmxvb2tBdCA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgbG9vayB0byBhIHZlY3RvcjNcIjtcclxuXHRcclxuXHR2YXIgZm9yd2FyZCA9IFZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UodGhpcy5wb3NpdGlvbiwgdmVjdG9yMykubm9ybWFsaXplKCk7XHJcblx0dmFyIGxlZnQgPSB0aGlzLnVwVmVjdG9yLmNyb3NzKGZvcndhcmQpLm5vcm1hbGl6ZSgpO1xyXG5cdHZhciB1cCA9IGZvcndhcmQuY3Jvc3MobGVmdCkubm9ybWFsaXplKCk7XHJcblx0XHJcblx0dmFyIHggPSAtbGVmdC5kb3QodGhpcy5wb3NpdGlvbik7XHJcblx0dmFyIHkgPSAtdXAuZG90KHRoaXMucG9zaXRpb24pO1xyXG5cdHZhciB6ID0gLWZvcndhcmQuZG90KHRoaXMucG9zaXRpb24pO1xyXG5cdFxyXG5cdHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBuZXcgTWF0cml4NChcclxuXHRcdGxlZnQueCwgbGVmdC55LCBsZWZ0LnosIHgsXHJcblx0XHR1cC54LCB1cC55LCB1cC56LCB5LFxyXG5cdFx0Zm9yd2FyZC54LCBmb3J3YXJkLnksIGZvcndhcmQueiwgeixcclxuXHRcdDAsIDAsIDAsIDFcclxuXHQpO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuQ2FtZXJhT3J0aG8ucHJvdG90eXBlLnNldENvbnRyb2xzID0gZnVuY3Rpb24oY2FtZXJhQ29udHJvbHMpe1xyXG5cdGlmICghY2FtZXJhQ29udHJvbHMuX19rdENhbUN0cmxzKSB0aHJvdyBcIklzIG5vdCBhIHZhbGlkIGNhbWVyYSBjb250cm9scyBvYmplY3RcIjtcclxuXHRcclxuXHR2YXIgem9vbSA9IFZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UodGhpcy5wb3NpdGlvbiwgY2FtZXJhQ29udHJvbHMudGFyZ2V0KS5sZW5ndGgoKTtcclxuXHRcclxuXHR0aGlzLmNvbnRyb2xzID0gY2FtZXJhQ29udHJvbHM7XHJcblx0XHJcblx0Y2FtZXJhQ29udHJvbHMuY2FtZXJhID0gdGhpcztcclxuXHRjYW1lcmFDb250cm9scy56b29tID0gem9vbTtcclxuXHRjYW1lcmFDb250cm9scy5hbmdsZS54ID0gS1RNYXRoLmdldDJEQW5nbGUoY2FtZXJhQ29udHJvbHMudGFyZ2V0LngsIGNhbWVyYUNvbnRyb2xzLnRhcmdldC56LHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi56KTtcclxuXHRjYW1lcmFDb250cm9scy5hbmdsZS55ID0gS1RNYXRoLmdldDJEQW5nbGUoMCwgdGhpcy5wb3NpdGlvbi55LCB6b29tLCBjYW1lcmFDb250cm9scy50YXJnZXQueSk7XHJcblx0XHJcblx0Y2FtZXJhQ29udHJvbHMuc2V0Q2FtZXJhUG9zaXRpb24oKTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuIiwidmFyIE1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG52YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG52YXIgS1RNYXRoID0gcmVxdWlyZSgnLi9LVE1hdGgnKTtcclxudmFyIEdlb21ldHJ5U2t5Ym94ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5U2t5Ym94Jyk7XHJcblxyXG5mdW5jdGlvbiBDYW1lcmFQZXJzcGVjdGl2ZShmb3YsIHJhdGlvLCB6bmVhciwgemZhcil7XHJcblx0dGhpcy5fX2t0Y2FtZXJhID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMC4wLCAwLjAsIDAuMCk7XHJcblx0dGhpcy51cFZlY3RvciA9IG5ldyBWZWN0b3IzKDAuMCwgMS4wLCAwLjApO1xyXG5cdHRoaXMubG9va0F0KG5ldyBWZWN0b3IzKDAuMCwgMC4wLCAtMS4wKSk7XHJcblx0dGhpcy5sb2NrZWQgPSBmYWxzZTtcclxuXHRcclxuXHR0aGlzLmZvdiA9IGZvdjtcclxuXHR0aGlzLnJhdGlvID0gcmF0aW87XHJcblx0dGhpcy56bmVhciA9IHpuZWFyO1xyXG5cdHRoaXMuemZhciA9IHpmYXI7XHJcblx0XHJcblx0dGhpcy5jb250cm9scyA9IG51bGw7XHJcblx0XHJcblx0dGhpcy5za3lib3ggPSBudWxsO1xyXG5cdFxyXG5cdHRoaXMuc2V0UGVyc3BlY3RpdmUoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYW1lcmFQZXJzcGVjdGl2ZTtcclxuXHJcbkNhbWVyYVBlcnNwZWN0aXZlLnByb3RvdHlwZS5zZXRQZXJzcGVjdGl2ZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIEMgPSAxIC8gTWF0aC50YW4odGhpcy5mb3YgLyAyKTtcclxuXHR2YXIgUiA9IEMgKiB0aGlzLnJhdGlvO1xyXG5cdHZhciBBID0gKHRoaXMuem5lYXIgKyB0aGlzLnpmYXIpIC8gKHRoaXMuem5lYXIgLSB0aGlzLnpmYXIpO1xyXG5cdHZhciBCID0gKDIgKiB0aGlzLnpuZWFyICogdGhpcy56ZmFyKSAvICh0aGlzLnpuZWFyIC0gdGhpcy56ZmFyKTtcclxuXHRcclxuXHR0aGlzLnBlcnNwZWN0aXZlTWF0cml4ID0gbmV3IE1hdHJpeDQoXHJcblx0XHRDLCAwLCAwLCAgMCxcclxuXHRcdDAsIFIsIDAsICAwLFxyXG5cdFx0MCwgMCwgQSwgIEIsXHJcblx0XHQwLCAwLCAtMSwgMFxyXG5cdCk7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUuc2V0U2t5Ym94ID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgbGVuZ3RoLCB0ZXh0dXJlcyl7XHJcblx0dGhpcy5za3lib3ggPSBuZXcgR2VvbWV0cnlTa3lib3god2lkdGgsIGhlaWdodCwgbGVuZ3RoLCB0aGlzLnBvc2l0aW9uLCB0ZXh0dXJlcyk7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUubG9va0F0ID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBsb29rIHRvIGEgdmVjdG9yM1wiO1xyXG5cdFxyXG5cdHZhciBmb3J3YXJkID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSh0aGlzLnBvc2l0aW9uLCB2ZWN0b3IzKS5ub3JtYWxpemUoKTtcclxuXHR2YXIgbGVmdCA9IHRoaXMudXBWZWN0b3IuY3Jvc3MoZm9yd2FyZCkubm9ybWFsaXplKCk7XHJcblx0dmFyIHVwID0gZm9yd2FyZC5jcm9zcyhsZWZ0KS5ub3JtYWxpemUoKTtcclxuXHRcclxuXHR2YXIgeCA9IC1sZWZ0LmRvdCh0aGlzLnBvc2l0aW9uKTtcclxuXHR2YXIgeSA9IC11cC5kb3QodGhpcy5wb3NpdGlvbik7XHJcblx0dmFyIHogPSAtZm9yd2FyZC5kb3QodGhpcy5wb3NpdGlvbik7XHJcblx0XHJcblx0dGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG5ldyBNYXRyaXg0KFxyXG5cdFx0bGVmdC54LCBsZWZ0LnksIGxlZnQueiwgeCxcclxuXHRcdHVwLngsIHVwLnksIHVwLnosIHksXHJcblx0XHRmb3J3YXJkLngsIGZvcndhcmQueSwgZm9yd2FyZC56LCB6LFxyXG5cdFx0MCwgMCwgMCwgMVxyXG5cdCk7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUuc2V0Q29udHJvbHMgPSBmdW5jdGlvbihjYW1lcmFDb250cm9scyl7XHJcblx0aWYgKCFjYW1lcmFDb250cm9scy5fX2t0Q2FtQ3RybHMpIHRocm93IFwiSXMgbm90IGEgdmFsaWQgY2FtZXJhIGNvbnRyb2xzIG9iamVjdFwiO1xyXG5cdFxyXG5cdHZhciB6b29tID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSh0aGlzLnBvc2l0aW9uLCBjYW1lcmFDb250cm9scy50YXJnZXQpLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMuY29udHJvbHMgPSBjYW1lcmFDb250cm9scztcclxuXHRcclxuXHRjYW1lcmFDb250cm9scy5jYW1lcmEgPSB0aGlzO1xyXG5cdGNhbWVyYUNvbnRyb2xzLnpvb20gPSB6b29tO1xyXG5cdGNhbWVyYUNvbnRyb2xzLmFuZ2xlLnggPSBLVE1hdGguZ2V0MkRBbmdsZShjYW1lcmFDb250cm9scy50YXJnZXQueCwgY2FtZXJhQ29udHJvbHMudGFyZ2V0LnosdGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnopO1xyXG5cdGNhbWVyYUNvbnRyb2xzLmFuZ2xlLnkgPSBLVE1hdGguZ2V0MkRBbmdsZSgwLCB0aGlzLnBvc2l0aW9uLnksIHpvb20sIGNhbWVyYUNvbnRyb2xzLnRhcmdldC55KTtcclxuXHRcclxuXHRjYW1lcmFDb250cm9scy5zZXRDYW1lcmFQb3NpdGlvbigpO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4iLCJmdW5jdGlvbiBDb2xvcihoZXhDb2xvcil7XHJcblx0dmFyIHN0ciA9IGhleENvbG9yLnN1YnN0cmluZygxKTtcclxuXHRcclxuXHRpZiAoc3RyLmxlbmd0aCA9PSA2KSBzdHIgKz0gXCJGRlwiO1xyXG5cdHZhciByID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygwLCAyKSwgMTYpO1xyXG5cdHZhciBnID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygyLCA0KSwgMTYpO1xyXG5cdHZhciBiID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg0LCA2KSwgMTYpO1xyXG5cdHZhciBhID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg2LCA4KSwgMTYpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBbciAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSwgYSAvIDI1NV07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29sb3I7XHJcblxyXG5Db2xvci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaGV4Q29sb3Ipe1xyXG5cdHZhciBzdHIgPSBoZXhDb2xvci5zdWJzdHJpbmcoMSk7XHJcblx0XHJcblx0aWYgKHN0ci5sZW5ndGggPT0gNikgc3RyICs9IFwiRkZcIjtcclxuXHR2YXIgciA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMCwgMiksIDE2KTtcclxuXHR2YXIgZyA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMiwgNCksIDE2KTtcclxuXHR2YXIgYiA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoNCwgNiksIDE2KTtcclxuXHR2YXIgYSA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoNiwgOCksIDE2KTtcclxuXHRcclxuXHR0aGlzLmNvbG9yID0gW3IgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUsIGEgLyAyNTVdO1xyXG59O1xyXG5cclxuQ29sb3IucHJvdG90eXBlLnNldFJHQiA9IGZ1bmN0aW9uKHJlZCwgZ3JlZW4sIGJsdWUpe1xyXG5cdHRoaXMuc2V0UkdCQShyZWQsIGdyZWVuLCBibHVlLCAyNTUpO1xyXG59O1xyXG5cclxuQ29sb3IucHJvdG90eXBlLnNldFJHQkEgPSBmdW5jdGlvbihyZWQsIGdyZWVuLCBibHVlLCBhbHBoYSl7XHJcblx0dGhpcy5jb2xvciA9IFtyZWQgLyAyNTUsIGdyZWVuIC8gMjU1LCBibHVlIC8gMjU1LCBhbHBoYV07XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuZ2V0UkdCID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgYyA9IHRoaXMuZ2V0UkdCQSgpO1xyXG5cdFxyXG5cdHJldHVybiBbY1swXSwgY1sxXSwgY1syXV07XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuZ2V0UkdCQSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMuY29sb3I7XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuZ2V0SGV4ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgYyA9IHRoaXMuY29sb3I7XHJcblx0XHJcblx0dmFyIHIgPSAoY1swXSAqIDI1NSkudG9TdHJpbmcoMTYpO1xyXG5cdHZhciBnID0gKGNbMV0gKiAyNTUpLnRvU3RyaW5nKDE2KTtcclxuXHR2YXIgYiA9IChjWzJdICogMjU1KS50b1N0cmluZygxNik7XHJcblx0dmFyIGEgPSAoY1szXSAqIDI1NSkudG9TdHJpbmcoMTYpO1xyXG5cdFxyXG5cdGlmIChyLmxlbmd0aCA9PSAxKSByID0gXCIwXCIgKyByO1xyXG5cdGlmIChnLmxlbmd0aCA9PSAxKSBnID0gXCIwXCIgKyBnO1xyXG5cdGlmIChiLmxlbmd0aCA9PSAxKSBiID0gXCIwXCIgKyBiO1xyXG5cdGlmIChhLmxlbmd0aCA9PSAxKSBhID0gXCIwXCIgKyBhO1xyXG5cdFxyXG5cdHJldHVybiAoXCIjXCIgKyByICsgZyArIGIgKyBhKS50b1VwcGVyQ2FzZSgpO1xyXG59O1xyXG5cclxuQ29sb3IuX0JMQUNLXHRcdD0gXCIjMDAwMDAwRkZcIjtcclxuQ29sb3IuX1JFRCBcdFx0XHQ9IFwiI0ZGMDAwMEZGXCI7XHJcbkNvbG9yLl9HUkVFTiBcdFx0PSBcIiMwMEZGMDBGRlwiO1xyXG5Db2xvci5fQkxVRSBcdFx0PSBcIiMwMDAwRkZGRlwiO1xyXG5Db2xvci5fV0hJVEVcdFx0PSBcIiNGRkZGRkZGRlwiO1xyXG5Db2xvci5fWUVMTE9XXHRcdD0gXCIjRkZGRjAwRkZcIjtcclxuQ29sb3IuX01BR0VOVEFcdFx0PSBcIiNGRjAwRkZGRlwiO1xyXG5Db2xvci5fQVFVQVx0XHRcdD0gXCIjMDBGRkZGRkZcIjtcclxuQ29sb3IuX0dPTERcdFx0XHQ9IFwiI0ZGRDcwMEZGXCI7XHJcbkNvbG9yLl9HUkFZXHRcdFx0PSBcIiM4MDgwODBGRlwiO1xyXG5Db2xvci5fUFVSUExFXHRcdD0gXCIjODAwMDgwRkZcIjsiLCJ2YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIE1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcbnZhciBWZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxudmFyIFZlY3RvcjQgPSByZXF1aXJlKCcuL0tUVmVjdG9yNCcpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnkoKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy52ZXJ0aWNlcyA9IFtdO1xyXG5cdHRoaXMudHJpYW5nbGVzID0gW107XHJcblx0dGhpcy51dkNvb3JkcyA9IFtdO1xyXG5cdHRoaXMuY29sb3JzID0gW107XHJcblx0dGhpcy5ub3JtYWxzID0gW107XHJcblx0dGhpcy51dlJlZ2lvbiA9IG5ldyBWZWN0b3I0KDAuMCwgMC4wLCAxLjAsIDEuMCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnk7XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuYWRkVmVydGljZSA9IGZ1bmN0aW9uKHgsIHksIHosIGNvbG9yLCB0eCwgdHkpe1xyXG5cdGlmICghY29sb3IpIGNvbG9yID0gQ29sb3IuX1dISVRFO1xyXG5cdGlmICghdHgpIHR4ID0gMDtcclxuXHRpZiAoIXR5KSB0eSA9IDA7XHJcblx0XHJcblx0dmFyIGluZCA9IHRoaXMudmVydGljZXMubGVuZ3RoO1xyXG5cdHRoaXMudmVydGljZXMucHVzaChuZXcgVmVjdG9yMyh4LCB5LCB6KSk7XHJcblx0dGhpcy5jb2xvcnMucHVzaChuZXcgQ29sb3IoY29sb3IpKTtcclxuXHR0aGlzLnV2Q29vcmRzLnB1c2gobmV3IFZlY3RvcjIodHgsIHR5KSk7XHJcblx0XHJcblx0cmV0dXJuIGluZDtcclxufTtcclxuXHJcbkdlb21ldHJ5LnByb3RvdHlwZS5hZGRGYWNlID0gZnVuY3Rpb24odmVydGljZV8wLCB2ZXJ0aWNlXzEsIHZlcnRpY2VfMil7XHJcblx0aWYgKCF0aGlzLnZlcnRpY2VzW3ZlcnRpY2VfMF0pIHRocm93IFwiSW52YWxpZCB2ZXJ0ZXggaW5kZXg6IFwiICsgdmVydGljZV8wO1xyXG5cdGlmICghdGhpcy52ZXJ0aWNlc1t2ZXJ0aWNlXzFdKSB0aHJvdyBcIkludmFsaWQgdmVydGV4IGluZGV4OiBcIiArIHZlcnRpY2VfMTtcclxuXHRpZiAoIXRoaXMudmVydGljZXNbdmVydGljZV8yXSkgdGhyb3cgXCJJbnZhbGlkIHZlcnRleCBpbmRleDogXCIgKyB2ZXJ0aWNlXzI7XHJcblx0XHJcblx0dGhpcy50cmlhbmdsZXMucHVzaChuZXcgVmVjdG9yMyh2ZXJ0aWNlXzAsIHZlcnRpY2VfMSwgdmVydGljZV8yKSk7XHJcbn07XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuYWRkTm9ybWFsID0gZnVuY3Rpb24obngsIG55LCBueil7XHJcblx0dGhpcy5ub3JtYWxzLnB1c2gobmV3IFZlY3RvcjMobngsIG55LCBueikpO1xyXG59O1xyXG5cclxuR2VvbWV0cnkucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgdmVydGljZXMgPSBbXTtcclxuXHR2YXIgdXZDb29yZHMgPSBbXTtcclxuXHR2YXIgdHJpYW5nbGVzID0gW107XHJcblx0dmFyIGNvbG9ycyA9IFtdO1xyXG5cdHZhciBub3JtYWxzID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLnZlcnRpY2VzLmxlbmd0aDtpPGxlbjtpKyspeyBcclxuXHRcdHZhciB2ID0gdGhpcy52ZXJ0aWNlc1tpXTsgXHJcblx0XHR2ZXJ0aWNlcy5wdXNoKHYueCwgdi55LCB2LnopOyBcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLnV2Q29vcmRzLmxlbmd0aDtpPGxlbjtpKyspeyBcclxuXHRcdHZhciB2ID0gdGhpcy51dkNvb3Jkc1tpXTsgXHJcblx0XHR1dkNvb3Jkcy5wdXNoKHYueCwgdi55KTsgXHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy50cmlhbmdsZXMubGVuZ3RoO2k8bGVuO2krKyl7IFxyXG5cdFx0dmFyIHQgPSB0aGlzLnRyaWFuZ2xlc1tpXTsgXHJcblx0XHR0cmlhbmdsZXMucHVzaCh0LngsIHQueSwgdC56KTsgXHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy5jb2xvcnMubGVuZ3RoO2k8bGVuO2krKyl7IFxyXG5cdFx0dmFyIGMgPSB0aGlzLmNvbG9yc1tpXS5nZXRSR0JBKCk7IFxyXG5cdFx0XHJcblx0XHRjb2xvcnMucHVzaChjWzBdLCBjWzFdLCBjWzJdLCBjWzNdKTsgXHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy5ub3JtYWxzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIG4gPSB0aGlzLm5vcm1hbHNbaV07XHJcblx0XHRub3JtYWxzLnB1c2gobi54LCBuLnksIG4ueik7XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJBUlJBWV9CVUZGRVJcIiwgbmV3IEZsb2F0MzJBcnJheSh2ZXJ0aWNlcyksIDMpO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJBUlJBWV9CVUZGRVJcIiwgbmV3IEZsb2F0MzJBcnJheSh1dkNvb3JkcyksIDIpO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBLVC5jcmVhdGVBcnJheUJ1ZmZlcihcIkVMRU1FTlRfQVJSQVlfQlVGRkVSXCIsIG5ldyBVaW50MTZBcnJheSh0cmlhbmdsZXMpLCAxKTtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IEtULmNyZWF0ZUFycmF5QnVmZmVyKFwiQVJSQVlfQlVGRkVSXCIsIG5ldyBGbG9hdDMyQXJyYXkoY29sb3JzKSwgNCk7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJBUlJBWV9CVUZGRVJcIiwgbmV3IEZsb2F0MzJBcnJheShub3JtYWxzKSwgMyk7XHJcblx0dGhpcy5yZWFkeSA9IHRydWU7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuY29tcHV0ZUZhY2VzTm9ybWFscyA9IGZ1bmN0aW9uKCl7XHJcblx0dGhpcy5ub3JtYWxzID0gW107XHJcblx0XHJcblx0dmFyIG5vcm1hbGl6ZWRWZXJ0aWNlcyA9IFtdO1xyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy50cmlhbmdsZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgZmFjZSA9IHRoaXMudHJpYW5nbGVzW2ldO1xyXG5cdFx0dmFyIHYwID0gdGhpcy52ZXJ0aWNlc1tmYWNlLnhdO1xyXG5cdFx0dmFyIHYxID0gdGhpcy52ZXJ0aWNlc1tmYWNlLnldO1xyXG5cdFx0dmFyIHYyID0gdGhpcy52ZXJ0aWNlc1tmYWNlLnpdO1xyXG5cdFx0XHJcblx0XHR2YXIgZGlyMSA9IFZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UodjEsIHYwKTtcclxuXHRcdHZhciBkaXIyID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSh2MiwgdjApO1xyXG5cdFx0XHJcblx0XHR2YXIgbm9ybWFsID0gZGlyMS5jcm9zcyhkaXIyKS5ub3JtYWxpemUoKTtcclxuXHRcdFxyXG5cdFx0aWYgKG5vcm1hbGl6ZWRWZXJ0aWNlcy5pbmRleE9mKGZhY2UueCkgPT0gLTEpIHRoaXMubm9ybWFscy5wdXNoKG5vcm1hbCk7XHJcblx0XHRpZiAobm9ybWFsaXplZFZlcnRpY2VzLmluZGV4T2YoZmFjZS55KSA9PSAtMSkgdGhpcy5ub3JtYWxzLnB1c2gobm9ybWFsKTtcclxuXHRcdGlmIChub3JtYWxpemVkVmVydGljZXMuaW5kZXhPZihmYWNlLnopID09IC0xKSB0aGlzLm5vcm1hbHMucHVzaChub3JtYWwpO1xyXG5cdFx0XHJcblx0XHRub3JtYWxpemVkVmVydGljZXMucHVzaChmYWNlLngsIGZhY2UueSwgZmFjZS56KTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbiIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxudmFyIFV0aWxzID0gcmVxdWlyZSgnLi9LVFV0aWxzJyk7XHJcbnZhciBWZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG52YXIgVmVjdG9yNCA9IHJlcXVpcmUoJy4vS1RWZWN0b3I0Jyk7XHJcblxyXG5mdW5jdGlvbiBHZW9tZXRyeTNETW9kZWwoZmlsZVVSTCl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMuZmlsZVVSTCA9IGZpbGVVUkw7XHJcblx0dGhpcy5yZWFkeSA9IGZhbHNlO1xyXG5cdHRoaXMudXZSZWdpb24gPSBuZXcgVmVjdG9yNCgwLjAsIDAuMCwgMS4wLCAxLjApO1xyXG5cdFxyXG5cdHZhciBUID0gdGhpcztcclxuXHRVdGlscy5nZXRGaWxlQ29udGVudChmaWxlVVJMLCBmdW5jdGlvbihmaWxlKXtcclxuXHRcdFQucmVhZHkgPSB0cnVlO1xyXG5cdFx0VC5wYXJzZUZpbGUoZmlsZSk7XHJcblx0fSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnkzRE1vZGVsO1xyXG5cclxuR2VvbWV0cnkzRE1vZGVsLnByb3RvdHlwZS5wYXJzZUZpbGUgPSBmdW5jdGlvbihmaWxlKXtcclxuXHR2YXIgbGluZXMgPSBmaWxlLnNwbGl0KCdcXHJcXG4nKTtcclxuXHR2YXIgdmVydGV4TWluID0gW107XHJcblx0dmFyIHV2Q29vcmRNaW4gPSBbXTtcclxuXHR2YXIgbm9ybWFsTWluID0gW107XHJcblx0dmFyIGluZE1pbiA9IFtdO1xyXG5cdHZhciBnZW9tZXRyeSA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49bGluZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgbCA9IGxpbmVzW2ldLnRyaW0oKTtcclxuXHRcdGwgPSBsLnJlcGxhY2UoJyAgJywgJyAnKTtcclxuXHRcdHZhciBpbmQgPSBsLmNoYXJBdCgwKTtcclxuXHRcdFxyXG5cdFx0dmFyIHAgPSBsLnNwbGl0KCcgJyk7XHJcblx0XHRwLnNwbGljZSgwLDEpO1xyXG5cdFx0XHJcblx0XHRpZiAoaW5kID09ICcjJykgY29udGludWU7XHJcblx0XHRlbHNlIGlmIChpbmQgPT0gJ2cnKSBjb250aW51ZTtcclxuXHRcdGVsc2UgaWYgKGwgPT0gJycpIGNvbnRpbnVlO1xyXG5cdFx0XHJcblx0XHRpZiAobC5pbmRleE9mKCd2ICcpID09IDApe1xyXG5cdFx0XHR2ZXJ0ZXhNaW4ucHVzaCggbmV3IFZlY3RvcjMoXHJcblx0XHRcdFx0cGFyc2VGbG9hdChwWzBdKSxcclxuXHRcdFx0XHRwYXJzZUZsb2F0KHBbMV0pLFxyXG5cdFx0XHRcdHBhcnNlRmxvYXQocFsyXSlcclxuXHRcdFx0KSk7XHJcblx0XHR9ZWxzZSBpZiAobC5pbmRleE9mKCd2biAnKSA9PSAwKXtcclxuXHRcdFx0bm9ybWFsTWluLnB1c2goIG5ldyBWZWN0b3IzKFxyXG5cdFx0XHRcdHBhcnNlRmxvYXQocFswXSksXHJcblx0XHRcdFx0cGFyc2VGbG9hdChwWzFdKSxcclxuXHRcdFx0XHRwYXJzZUZsb2F0KHBbMl0pXHJcblx0XHRcdCkpO1xyXG5cdFx0fWVsc2UgaWYgKGwuaW5kZXhPZigndnQgJykgPT0gMCl7XHJcblx0XHRcdHV2Q29vcmRNaW4ucHVzaCggbmV3IFZlY3RvcjIoXHJcblx0XHRcdFx0cGFyc2VGbG9hdChwWzBdKSxcclxuXHRcdFx0XHRwYXJzZUZsb2F0KHBbMV0pXHJcblx0XHRcdCkpO1xyXG5cdFx0fWVsc2UgaWYgKGwuaW5kZXhPZignZiAnKSA9PSAwKXtcclxuXHRcdFx0aW5kTWluLnB1c2goIG5ldyBWZWN0b3IzKFxyXG5cdFx0XHRcdHBbMF0sXHJcblx0XHRcdFx0cFsxXSxcclxuXHRcdFx0XHRwWzJdXHJcblx0XHRcdCkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPWluZE1pbi5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBpbmQgPSBpbmRNaW5baV07XHJcblx0XHR2YXIgdmVydGV4SW5mbzEgPSBpbmQueC5zcGxpdCgnLycpO1xyXG5cdFx0dmFyIHZlcnRleEluZm8yID0gaW5kLnkuc3BsaXQoJy8nKTtcclxuXHRcdHZhciB2ZXJ0ZXhJbmZvMyA9IGluZC56LnNwbGl0KCcvJyk7XHJcblx0XHRcclxuXHRcdHZhciB2MSA9IHZlcnRleE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvMVswXSkgLSAxXTtcclxuXHRcdHZhciB0MSA9IHV2Q29vcmRNaW5bcGFyc2VJbnQodmVydGV4SW5mbzFbMV0pIC0gMV07XHJcblx0XHR2YXIgbjEgPSBub3JtYWxNaW5bcGFyc2VJbnQodmVydGV4SW5mbzFbMl0pIC0gMV07XHJcblx0XHRcclxuXHRcdHZhciB2MiA9IHZlcnRleE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvMlswXSkgLSAxXTtcclxuXHRcdHZhciB0MiA9IHV2Q29vcmRNaW5bcGFyc2VJbnQodmVydGV4SW5mbzJbMV0pIC0gMV07XHJcblx0XHR2YXIgbjIgPSBub3JtYWxNaW5bcGFyc2VJbnQodmVydGV4SW5mbzJbMl0pIC0gMV07XHJcblx0XHRcclxuXHRcdHZhciB2MyA9IHZlcnRleE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvM1swXSkgLSAxXTtcclxuXHRcdHZhciB0MyA9IHV2Q29vcmRNaW5bcGFyc2VJbnQodmVydGV4SW5mbzNbMV0pIC0gMV07XHJcblx0XHR2YXIgbjMgPSBub3JtYWxNaW5bcGFyc2VJbnQodmVydGV4SW5mbzNbMl0pIC0gMV07XHJcblx0XHRcclxuXHRcdHZhciBpMSA9IGdlb21ldHJ5LmFkZFZlcnRpY2UodjEueCwgdjEueSwgdjEueiwgQ29sb3IuX1dISVRFLCB0MS54LCB0MS55KTtcclxuXHRcdHZhciBpMiA9IGdlb21ldHJ5LmFkZFZlcnRpY2UodjIueCwgdjIueSwgdjIueiwgQ29sb3IuX1dISVRFLCB0Mi54LCB0Mi55KTtcclxuXHRcdHZhciBpMyA9IGdlb21ldHJ5LmFkZFZlcnRpY2UodjMueCwgdjMueSwgdjMueiwgQ29sb3IuX1dISVRFLCB0My54LCB0My55KTtcclxuXHRcdFxyXG5cdFx0Z2VvbWV0cnkuYWRkTm9ybWFsKG4xLngsIG4xLnksIG4xLnopO1xyXG5cdFx0Z2VvbWV0cnkuYWRkTm9ybWFsKG4yLngsIG4yLnksIG4yLnopO1xyXG5cdFx0Z2VvbWV0cnkuYWRkTm9ybWFsKG4zLngsIG4zLnksIG4zLnopO1xyXG5cdFx0XHJcblx0XHRnZW9tZXRyeS5hZGRGYWNlKGkxLCBpMiwgaTMpO1xyXG5cdH1cclxuXHRcclxuXHRnZW9tZXRyeS5idWlsZCgpO1xyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gZ2VvbWV0cnkudmVydGV4QnVmZmVyO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gZ2VvbWV0cnkudGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBnZW9tZXRyeS5mYWNlc0J1ZmZlcjtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IGdlb21ldHJ5LmNvbG9yc0J1ZmZlcjtcclxuXHR0aGlzLm5vcm1hbHNCdWZmZXIgPSBnZW9tZXRyeS5ub3JtYWxzQnVmZmVyO1xyXG59O1xyXG4iLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbnZhciBWZWN0b3I0ID0gcmVxdWlyZSgnLi9LVFZlY3RvcjQnKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5Qm94KHdpZHRoLCBsZW5ndGgsIGhlaWdodCwgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0dGhpcy5yZWFkeSA9IHRydWU7XHJcblx0XHJcblx0dmFyIGJveEdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdHZhciB3ID0gd2lkdGggLyAyO1xyXG5cdHZhciBsID0gbGVuZ3RoIC8gMjtcclxuXHR2YXIgaCA9IGhlaWdodCAvIDI7XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cdFxyXG5cdHRoaXMudXZSZWdpb24gPSAocGFyYW1zLnV2UmVnaW9uKT8gcGFyYW1zLnV2UmVnaW9uIDogbmV3IFZlY3RvcjQoMC4wLCAwLjAsIDEuMCwgMS4wKTtcclxuXHR0aGlzLmNvbG9yVG9wID0gKHBhcmFtcy5jb2xvclRvcCk/IHBhcmFtcy5jb2xvclRvcCA6IENvbG9yLl9XSElURTtcclxuXHR0aGlzLmNvbG9yQm90dG9tID0gKHBhcmFtcy5jb2xvckJvdHRvbSk/IHBhcmFtcy5jb2xvckJvdHRvbSA6IENvbG9yLl9XSElURTtcclxuXHRcclxuXHR2YXIgeHIgPSB0aGlzLnV2UmVnaW9uLng7XHJcblx0dmFyIHlyID0gdGhpcy51dlJlZ2lvbi55O1xyXG5cdHZhciBociA9IHRoaXMudXZSZWdpb24uejtcclxuXHR2YXIgdnIgPSB0aGlzLnV2UmVnaW9uLnc7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAgbCwgdGhpcy5jb2xvckJvdHRvbSwgaHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgIGgsICBsLCB0aGlzLmNvbG9yVG9wLCB4ciwgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgIGwsIHRoaXMuY29sb3JCb3R0b20sIHhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAgbCwgdGhpcy5jb2xvclRvcCwgaHIsIHZyKTtcclxuXHRcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgLWgsIC1sLCB0aGlzLmNvbG9yQm90dG9tLCB4ciwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgLWwsIHRoaXMuY29sb3JUb3AsIHhyLCB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAtbCwgdGhpcy5jb2xvckJvdHRvbSwgaHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgIGgsIC1sLCB0aGlzLmNvbG9yVG9wLCBociwgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgLWwsIHRoaXMuY29sb3JCb3R0b20sIGhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAgbCwgdGhpcy5jb2xvclRvcCwgeHIsIHZyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgLWgsICBsLCB0aGlzLmNvbG9yQm90dG9tLCB4ciwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgLWwsIHRoaXMuY29sb3JUb3AsIGhyLCB2cik7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAgbCwgdGhpcy5jb2xvckJvdHRvbSwgaHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgIGgsICBsLCB0aGlzLmNvbG9yVG9wLCBociwgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgLWwsIHRoaXMuY29sb3JCb3R0b20sIHhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAtbCwgdGhpcy5jb2xvclRvcCwgeHIsIHZyKTtcclxuXHRcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgIGgsICBsLCB0aGlzLmNvbG9yVG9wLCBociwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgLWwsIHRoaXMuY29sb3JUb3AsIHhyLCB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAgbCwgdGhpcy5jb2xvclRvcCwgeHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgIGgsIC1sLCB0aGlzLmNvbG9yVG9wLCBociwgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgIGwsIHRoaXMuY29sb3JCb3R0b20sIHhyLCB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAtbCwgdGhpcy5jb2xvckJvdHRvbSwgeHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgLWgsICBsLCB0aGlzLmNvbG9yQm90dG9tLCBociwgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgLWwsIHRoaXMuY29sb3JCb3R0b20sIGhyLCB5cik7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMCwgMSwgMik7XHJcblx0Ym94R2VvLmFkZEZhY2UoMCwgMywgMSk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoNCwgNSwgNik7XHJcblx0Ym94R2VvLmFkZEZhY2UoNSwgNywgNik7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoOCwgOSwgMTApO1xyXG5cdGJveEdlby5hZGRGYWNlKDgsIDExLCA5KTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSgxMiwgMTMsIDE0KTtcclxuXHRib3hHZW8uYWRkRmFjZSgxMywgMTUsIDE0KTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSgxNiwgMTcsIDE4KTtcclxuXHRib3hHZW8uYWRkRmFjZSgxNiwgMTksIDE3KTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSgyMCwgMjEsIDIyKTtcclxuXHRib3hHZW8uYWRkRmFjZSgyMSwgMjMsIDIyKTtcclxuXHRcclxuXHRib3hHZW8uY29tcHV0ZUZhY2VzTm9ybWFscygpO1xyXG5cdGJveEdlby5idWlsZCgpO1xyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gYm94R2VvLnZlcnRleEJ1ZmZlcjtcclxuXHR0aGlzLnRleEJ1ZmZlciA9IGJveEdlby50ZXhCdWZmZXI7XHJcblx0dGhpcy5mYWNlc0J1ZmZlciA9IGJveEdlby5mYWNlc0J1ZmZlcjtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IGJveEdlby5jb2xvcnNCdWZmZXI7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gYm94R2VvLm5vcm1hbHNCdWZmZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnlCb3g7IiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG52YXIgVmVjdG9yNCA9IHJlcXVpcmUoJy4vS1RWZWN0b3I0Jyk7XHJcbnZhciBLVE1hdGggPSByZXF1aXJlKCcuL0tUTWF0aCcpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlDeWxpbmRlcihyYWRpdXNUb3AsIHJhZGl1c0JvdHRvbSwgaGVpZ2h0LCB3aWR0aFNlZ21lbnRzLCBoZWlnaHRTZWdtZW50cywgb3BlblRvcCwgb3BlbkJvdHRvbSwgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0dGhpcy5yZWFkeSA9IHRydWU7XHJcblx0XHJcblx0dmFyIGN5bEdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHRcclxuXHR0aGlzLnV2UmVnaW9uID0gKHBhcmFtcy51dlJlZ2lvbik/IHBhcmFtcy51dlJlZ2lvbiA6IG5ldyBWZWN0b3I0KDAuMCwgMC4wLCAxLjAsIDEuMCk7XHJcblx0XHJcblx0dmFyIHhyID0gdGhpcy51dlJlZ2lvbi54O1xyXG5cdHZhciB5ciA9IHRoaXMudXZSZWdpb24ueTtcclxuXHR2YXIgaHIgPSB0aGlzLnV2UmVnaW9uLnogLSB4cjtcclxuXHR2YXIgdnIgPSB0aGlzLnV2UmVnaW9uLncgLSB5cjtcclxuXHRcclxuXHR2YXIgaCA9IGhlaWdodCAvIDI7XHJcblx0XHJcblx0dmFyIGJhbmRXID0gS1RNYXRoLlBJMiAvICh3aWR0aFNlZ21lbnRzIC0gMSk7XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8d2lkdGhTZWdtZW50cztpKyspe1xyXG5cdFx0dmFyIHgxID0gTWF0aC5jb3MoYmFuZFcgKiBpKTtcclxuXHRcdHZhciB5MSA9IC1oO1xyXG5cdFx0dmFyIHoxID0gLU1hdGguc2luKGJhbmRXICogaSk7XHJcblx0XHR2YXIgeDIgPSBNYXRoLmNvcyhiYW5kVyAqIGkpO1xyXG5cdFx0dmFyIHkyID0gaDtcclxuXHRcdHZhciB6MiA9IC1NYXRoLnNpbihiYW5kVyAqIGkpO1xyXG5cdFx0XHJcblx0XHR2YXIgeHQgPSBpIC8gKHdpZHRoU2VnbWVudHMgLSAxKTtcclxuXHRcdFxyXG5cdFx0Y3lsR2VvLmFkZE5vcm1hbCh4MSwgMCwgejEpO1xyXG5cdFx0Y3lsR2VvLmFkZE5vcm1hbCh4MiwgMCwgejIpO1xyXG5cdFx0XHJcblx0XHR4MSAqPSByYWRpdXNCb3R0b207XHJcblx0XHR6MSAqPSByYWRpdXNCb3R0b207XHJcblx0XHR4MiAqPSByYWRpdXNUb3A7XHJcblx0XHR6MiAqPSByYWRpdXNUb3A7XHJcblx0XHRcclxuXHRcdGN5bEdlby5hZGRWZXJ0aWNlKCB4MSwgeTEsIHoxLCBDb2xvci5fV0hJVEUsIHhyICsgKHh0ICogaHIpLCB5cik7XHJcblx0XHRjeWxHZW8uYWRkVmVydGljZSggeDIsIHkyLCB6MiwgQ29sb3IuX1dISVRFLCB4ciArICh4dCAqIGhyKSwgeXIgKyB2cik7XHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPHdpZHRoU2VnbWVudHMqMiAtIDI7aSs9Mil7XHJcblx0XHR2YXIgaTEgPSBpO1xyXG5cdFx0dmFyIGkyID0gaSsxO1xyXG5cdFx0dmFyIGkzID0gaSsyO1xyXG5cdFx0dmFyIGk0ID0gaSszO1xyXG5cdFx0XHJcblx0XHRjeWxHZW8uYWRkRmFjZShpMywgaTIsIGkxKTtcclxuXHRcdGN5bEdlby5hZGRGYWNlKGkzLCBpNCwgaTIpO1xyXG5cdH1cclxuXHRcclxuXHRpZiAoIW9wZW5Ub3AgfHwgIW9wZW5Cb3R0b20pe1xyXG5cdFx0dmFyIGkxID0gY3lsR2VvLmFkZFZlcnRpY2UoIDAsIGgsIDAsIENvbG9yLl9XSElURSwgeHIgKyAoMC41ICogaHIpLCB5ciArICgwLjUgKiB2cikpO1xyXG5cdFx0dmFyIGkyID0gY3lsR2VvLmFkZFZlcnRpY2UoIDAsIC1oLCAwLCBDb2xvci5fV0hJVEUsIHhyICsgKDAuNSAqIGhyKSwgeXIgKyAoMC41ICogdnIpKTtcclxuXHRcdGN5bEdlby5hZGROb3JtYWwoMCwgIDEsIDApO1xyXG5cdFx0Y3lsR2VvLmFkZE5vcm1hbCgwLCAtMSwgMCk7XHJcblx0XHRmb3IgKHZhciBpPTA7aTx3aWR0aFNlZ21lbnRzKjIgLSAyO2krPTIpe1xyXG5cdFx0XHR2YXIgdjEgPSBjeWxHZW8udmVydGljZXNbaSArIDFdO1xyXG5cdFx0XHR2YXIgdjIgPSBjeWxHZW8udmVydGljZXNbaSArIDNdO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHR4MSA9IHhyICsgKHYxLnggLyAyICsgMC41KSAqIGhyO1xyXG5cdFx0XHR2YXIgdHkxID0geXIgKyAodjEueiAvIDIgKyAwLjUpICogdnI7XHJcblx0XHRcdHZhciB0eDIgPSB4ciArICh2Mi54IC8gMiArIDAuNSkgKiBocjtcclxuXHRcdFx0dmFyIHR5MiA9IHlyICsgKHYyLnogLyAyICsgMC41KSAqIHZyO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKCFvcGVuVG9wKXtcclxuXHRcdFx0XHR2YXIgaTMgPSBjeWxHZW8uYWRkVmVydGljZSggdjEueCwgaCwgdjEueiwgQ29sb3IuX1dISVRFLCB0eDEsIHR5MSk7XHJcblx0XHRcdFx0dmFyIGk0ID0gY3lsR2VvLmFkZFZlcnRpY2UoIHYyLngsIGgsIHYyLnosIENvbG9yLl9XSElURSwgdHgyLCB0eTIpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGN5bEdlby5hZGROb3JtYWwoMCwgMSwgMCk7XHJcblx0XHRcdFx0Y3lsR2VvLmFkZE5vcm1hbCgwLCAxLCAwKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRjeWxHZW8uYWRkRmFjZShpNCwgaTEsIGkzKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKCFvcGVuQm90dG9tKXtcclxuXHRcdFx0XHR2YXIgaTMgPSBjeWxHZW8uYWRkVmVydGljZSggdjEueCwgLWgsIHYxLnosIENvbG9yLl9XSElURSwgdHgxLCB0eTEpO1xyXG5cdFx0XHRcdHZhciBpNCA9IGN5bEdlby5hZGRWZXJ0aWNlKCB2Mi54LCAtaCwgdjIueiwgQ29sb3IuX1dISVRFLCB0eDIsIHR5Mik7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Y3lsR2VvLmFkZE5vcm1hbCgwLCAtMSwgMCk7XHJcblx0XHRcdFx0Y3lsR2VvLmFkZE5vcm1hbCgwLCAtMSwgMCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Y3lsR2VvLmFkZEZhY2UoaTMsIGkyLCBpNCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Y3lsR2VvLmJ1aWxkKCk7XHJcblx0XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgPSBjeWxHZW8udmVydGV4QnVmZmVyO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gY3lsR2VvLnRleEJ1ZmZlcjtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gY3lsR2VvLmZhY2VzQnVmZmVyO1xyXG5cdHRoaXMuY29sb3JzQnVmZmVyID0gY3lsR2VvLmNvbG9yc0J1ZmZlcjtcclxuXHR0aGlzLm5vcm1hbHNCdWZmZXIgPSBjeWxHZW8ubm9ybWFsc0J1ZmZlcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeUN5bGluZGVyOyIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxudmFyIFZlY3RvcjQgPSByZXF1aXJlKCcuL0tUVmVjdG9yNCcpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlHVUlUZXh0dXJlKHdpZHRoLCBoZWlnaHQsIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdHRoaXMucmVhZHkgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBndWlUZXggPSBuZXcgR2VvbWV0cnkoKTtcclxuXHRcclxuXHR2YXIgeDEgPSAwLjA7XHJcblx0dmFyIHkxID0gMC4wO1xyXG5cdHZhciB4MiA9IHdpZHRoO1xyXG5cdHZhciB5MiA9IGhlaWdodDtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0XHJcblx0dGhpcy51dlJlZ2lvbiA9IChwYXJhbXMudXZSZWdpb24pPyBwYXJhbXMudXZSZWdpb24gOiBuZXcgVmVjdG9yNCgwLjAsIDAuMCwgMS4wLCAxLjApO1xyXG5cdFxyXG5cdHZhciB4ciA9IHRoaXMudXZSZWdpb24ueDtcclxuXHR2YXIgeXIgPSB0aGlzLnV2UmVnaW9uLnk7XHJcblx0dmFyIGhyID0gdGhpcy51dlJlZ2lvbi56O1xyXG5cdHZhciB2ciA9IHRoaXMudXZSZWdpb24udztcclxuXHRcclxuXHRndWlUZXguYWRkVmVydGljZSh4MiwgeTEsIDAuMCwgQ29sb3IuX1dISVRFLCBociwgeXIpO1xyXG5cdGd1aVRleC5hZGRWZXJ0aWNlKHgxLCB5MiwgMC4wLCBDb2xvci5fV0hJVEUsIHhyLCB2cik7XHJcblx0Z3VpVGV4LmFkZFZlcnRpY2UoeDEsIHkxLCAwLjAsIENvbG9yLl9XSElURSwgeHIsIHlyKTtcclxuXHRndWlUZXguYWRkVmVydGljZSh4MiwgeTIsIDAuMCwgQ29sb3IuX1dISVRFLCBociwgdnIpO1xyXG5cdFxyXG5cdGd1aVRleC5hZGRGYWNlKDAsIDEsIDIpO1xyXG5cdGd1aVRleC5hZGRGYWNlKDAsIDMsIDEpO1xyXG5cdFxyXG5cdGd1aVRleC5jb21wdXRlRmFjZXNOb3JtYWxzKCk7XHJcblx0Z3VpVGV4LmJ1aWxkKCk7XHJcblx0XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgPSBndWlUZXgudmVydGV4QnVmZmVyO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gZ3VpVGV4LnRleEJ1ZmZlcjtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gZ3VpVGV4LmZhY2VzQnVmZmVyO1xyXG5cdHRoaXMuY29sb3JzQnVmZmVyID0gZ3VpVGV4LmNvbG9yc0J1ZmZlcjtcclxuXHR0aGlzLm5vcm1hbHNCdWZmZXIgPSBndWlUZXgubm9ybWFsc0J1ZmZlcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeUdVSVRleHR1cmU7IiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG52YXIgVmVjdG9yNCA9IHJlcXVpcmUoJy4vS1RWZWN0b3I0Jyk7XHJcblxyXG5mdW5jdGlvbiBHZW9tZXRyeVBsYW5lKHdpZHRoLCBoZWlnaHQsIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdHRoaXMucmVhZHkgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBwbGFuZUdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdHZhciB3ID0gd2lkdGggLyAyO1xyXG5cdHZhciBoID0gaGVpZ2h0IC8gMjtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0XHJcblx0dGhpcy51dlJlZ2lvbiA9IChwYXJhbXMudXZSZWdpb24pPyBwYXJhbXMudXZSZWdpb24gOiBuZXcgVmVjdG9yNCgwLjAsIDAuMCwgMS4wLCAxLjApO1xyXG5cdFxyXG5cdHZhciB4ciA9IHRoaXMudXZSZWdpb24ueDtcclxuXHR2YXIgeXIgPSB0aGlzLnV2UmVnaW9uLnk7XHJcblx0dmFyIGhyID0gdGhpcy51dlJlZ2lvbi56O1xyXG5cdHZhciB2ciA9IHRoaXMudXZSZWdpb24udztcclxuXHRcclxuXHRwbGFuZUdlby5hZGRWZXJ0aWNlKCB3LCAwLCAgaCwgQ29sb3IuX1dISVRFLCBociwgeXIpO1xyXG5cdHBsYW5lR2VvLmFkZFZlcnRpY2UoLXcsIDAsIC1oLCBDb2xvci5fV0hJVEUsIHhyLCB2cik7XHJcblx0cGxhbmVHZW8uYWRkVmVydGljZSgtdywgMCwgIGgsIENvbG9yLl9XSElURSwgeHIsIHlyKTtcclxuXHRwbGFuZUdlby5hZGRWZXJ0aWNlKCB3LCAwLCAtaCwgQ29sb3IuX1dISVRFLCBociwgdnIpO1xyXG5cdFxyXG5cdHBsYW5lR2VvLmFkZEZhY2UoMCwgMSwgMik7XHJcblx0cGxhbmVHZW8uYWRkRmFjZSgwLCAzLCAxKTtcclxuXHRcclxuXHRwbGFuZUdlby5jb21wdXRlRmFjZXNOb3JtYWxzKCk7XHJcblx0cGxhbmVHZW8uYnVpbGQoKTtcclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IHBsYW5lR2VvLnZlcnRleEJ1ZmZlcjtcclxuXHR0aGlzLnRleEJ1ZmZlciA9IHBsYW5lR2VvLnRleEJ1ZmZlcjtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gcGxhbmVHZW8uZmFjZXNCdWZmZXI7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBwbGFuZUdlby5jb2xvcnNCdWZmZXI7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gcGxhbmVHZW8ubm9ybWFsc0J1ZmZlcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeVBsYW5lOyIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxudmFyIFZlY3RvcjQgPSByZXF1aXJlKCcuL0tUVmVjdG9yNCcpO1xyXG52YXIgTWF0ZXJpYWxCYXNpYyA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbEJhc2ljJyk7XHJcbnZhciBNZXNoID0gcmVxdWlyZSgnLi9LVE1lc2gnKTtcclxudmFyIEdlb21ldHJ5UGxhbmUgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnlQbGFuZScpO1xyXG52YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlTa3lib3god2lkdGgsIGhlaWdodCwgbGVuZ3RoLCBwb3NpdGlvbiwgdGV4dHVyZXMpe1xyXG5cdHRoaXMubWVzaGVzID0gW107XHJcblx0aWYgKCF0ZXh0dXJlcykgdGV4dHVyZXMgPSBbXTtcclxuXHRcclxuXHR2YXIgdyA9IHdpZHRoIC8gMjtcclxuXHR2YXIgbCA9IGxlbmd0aCAvIDI7XHJcblx0dmFyIGggPSBoZWlnaHQgLyAyO1xyXG5cdHZhciB2ID0gMS4wO1xyXG5cdFxyXG5cdHZhciB4ciA9IDAuMDtcclxuXHR2YXIgeXIgPSAwLjA7XHJcblx0dmFyIGhyID0gMS4wO1xyXG5cdHZhciB2ciA9IDEuMDtcclxuXHRcclxuXHR2YXIgY3QgPSBDb2xvci5fV0hJVEU7XHJcblx0dmFyIGNiID0gQ29sb3IuX1dISVRFO1xyXG5cdFxyXG5cdHZhciBnZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHR2YXIgbWF0ID0gbmV3IE1hdGVyaWFsQmFzaWModGV4dHVyZXNbS1QuVEVYVFVSRV9GUk9OVF0sIENvbG9yLl9XSElURSk7XHJcblx0Z2VvLmFkZFZlcnRpY2UoLXcgLXYsIC1oIC12LCAgbCwgY2IsIGhyLCB5cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoIHcgK3YsICBoICt2LCAgbCwgY3QsIHhyLCB2cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoIHcgK3YsIC1oIC12LCAgbCwgY2IsIHhyLCB5cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoLXcgLXYsICBoICt2LCAgbCwgY3QsIGhyLCB2cik7XHJcblx0Z2VvLmFkZEZhY2UoMCwgMSwgMik7XHJcblx0Z2VvLmFkZEZhY2UoMCwgMywgMSk7XHJcblx0Z2VvLmJ1aWxkKCk7XHJcblx0dGhpcy5tZXNoZXMucHVzaChuZXcgTWVzaChnZW8sIG1hdCkpO1xyXG5cdFxyXG5cdHZhciBnZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHR2YXIgbWF0ID0gbmV3IE1hdGVyaWFsQmFzaWModGV4dHVyZXNbS1QuVEVYVFVSRV9CQUNLXSwgQ29sb3IuX1dISVRFKTtcclxuXHRnZW8uYWRkVmVydGljZSgtdyAtdiwgLWggLXYsIC1sLCBjYiwgeHIsIHlyKTtcclxuXHRnZW8uYWRkVmVydGljZSgtdyAtdiwgIGggK3YsIC1sLCBjdCwgeHIsIHZyKTtcclxuXHRnZW8uYWRkVmVydGljZSggdyArdiwgLWggLXYsIC1sLCBjYiwgaHIsIHlyKTtcclxuXHRnZW8uYWRkVmVydGljZSggdyArdiwgIGggK3YsIC1sLCBjdCwgaHIsIHZyKTtcclxuXHRnZW8uYWRkRmFjZSgwLCAyLCAxKTtcclxuXHRnZW8uYWRkRmFjZSgyLCAzLCAxKTtcclxuXHRnZW8uYnVpbGQoKTtcclxuXHR0aGlzLm1lc2hlcy5wdXNoKG5ldyBNZXNoKGdlbywgbWF0KSk7XHJcblx0XHJcblx0dmFyIGdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdHZhciBtYXQgPSBuZXcgTWF0ZXJpYWxCYXNpYyh0ZXh0dXJlc1tLVC5URVhUVVJFX1JJR0hUXSwgQ29sb3IuX1dISVRFKTtcclxuXHRnZW8uYWRkVmVydGljZSggdywgLWggLXYsICBsICt2LCBjYiwgaHIsIHlyKTtcclxuXHRnZW8uYWRkVmVydGljZSggdywgIGggK3YsIC1sIC12LCBjdCwgeHIsIHZyKTtcclxuXHRnZW8uYWRkVmVydGljZSggdywgLWggLXYsIC1sIC12LCBjYiwgeHIsIHlyKTtcclxuXHRnZW8uYWRkVmVydGljZSggdywgIGggK3YsICBsICt2LCBjdCwgaHIsIHZyKTtcclxuXHRnZW8uYWRkRmFjZSgwLCAxLCAyKTtcclxuXHRnZW8uYWRkRmFjZSgwLCAzLCAxKTtcclxuXHRnZW8uYnVpbGQoKTtcclxuXHR0aGlzLm1lc2hlcy5wdXNoKG5ldyBNZXNoKGdlbywgbWF0KSk7XHJcblx0XHJcblx0dmFyIGdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdHZhciBtYXQgPSBuZXcgTWF0ZXJpYWxCYXNpYyh0ZXh0dXJlc1tLVC5URVhUVVJFX0xFRlRdLCBDb2xvci5fV0hJVEUpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13LCAtaCAtdiwgLWwgLXYsIGNiLCBociwgeXIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13LCAgaCArdiwgLWwgLXYsIGN0LCBociwgdnIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13LCAtaCAtdiwgIGwgK3YsIGNiLCB4ciwgeXIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13LCAgaCArdiwgIGwgK3YsIGN0LCB4ciwgdnIpO1xyXG5cdGdlby5hZGRGYWNlKDAsIDEsIDIpO1xyXG5cdGdlby5hZGRGYWNlKDEsIDMsIDIpO1xyXG5cdGdlby5idWlsZCgpO1xyXG5cdHRoaXMubWVzaGVzLnB1c2gobmV3IE1lc2goZ2VvLCBtYXQpKTtcclxuXHRcclxuXHR2YXIgZ2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0dmFyIG1hdCA9IG5ldyBNYXRlcmlhbEJhc2ljKHRleHR1cmVzW0tULlRFWFRVUkVfVVBdLCBDb2xvci5fV0hJVEUpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKCB3ICt2LCAgaCwgLWwgLXYsIGN0LCBociwgeXIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13IC12LCAgaCwgIGwgK3YsIGN0LCB4ciwgdnIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13IC12LCAgaCwgLWwgLXYsIGN0LCB4ciwgeXIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKCB3ICt2LCAgaCwgIGwgK3YsIGN0LCBociwgdnIpO1xyXG5cdGdlby5hZGRGYWNlKDAsIDEsIDIpO1xyXG5cdGdlby5hZGRGYWNlKDAsIDMsIDEpO1xyXG5cdGdlby5idWlsZCgpO1xyXG5cdHRoaXMubWVzaGVzLnB1c2gobmV3IE1lc2goZ2VvLCBtYXQpKTtcclxuXHRcclxuXHR2YXIgZ2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0dmFyIG1hdCA9IG5ldyBNYXRlcmlhbEJhc2ljKHRleHR1cmVzW0tULlRFWFRVUkVfRE9XTl0sIENvbG9yLl9XSElURSk7XHJcblx0bWF0LmRyYXdGYWNlcyA9ICdCT1RIJztcclxuXHRnZW8uYWRkVmVydGljZSggdyArdiwgLWgsIC1sIC12LCBjYiwgaHIsIHZyKTtcclxuXHRnZW8uYWRkVmVydGljZSgtdyAtdiwgLWgsICBsICt2LCBjYiwgeHIsIHlyKTtcclxuXHRnZW8uYWRkVmVydGljZSgtdyAtdiwgLWgsIC1sIC12LCBjYiwgeHIsIHZyKTtcclxuXHRnZW8uYWRkVmVydGljZSggdyArdiwgLWgsICBsICt2LCBjYiwgaHIsIHlyKTtcclxuXHRnZW8uYWRkRmFjZSgwLCAyLCAxKTtcclxuXHRnZW8uYWRkRmFjZSgwLCAxLCAzKTtcclxuXHRnZW8uY29tcHV0ZUZhY2VzTm9ybWFscygpO1xyXG5cdGdlby5idWlsZCgpO1xyXG5cdHRoaXMubWVzaGVzLnB1c2gobmV3IE1lc2goZ2VvLCBtYXQpKTtcclxuXHRcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTw2O2krKyl7XHJcblx0XHR0aGlzLm1lc2hlc1tpXS5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeVNreWJveDsiLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbnZhciBWZWN0b3I0ID0gcmVxdWlyZSgnLi9LVFZlY3RvcjQnKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5U3BoZXJlKHJhZGl1cywgbGF0QmFuZHMsIGxvbkJhbmRzLCBwYXJhbXMpe1xyXG5cdHRoaXMuX19rdGdlb21ldHJ5ID0gdHJ1ZTtcclxuXHR0aGlzLnJlYWR5ID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgc3BoR2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cdFxyXG5cdHRoaXMudXZSZWdpb24gPSAocGFyYW1zLnV2UmVnaW9uKT8gcGFyYW1zLnV2UmVnaW9uIDogbmV3IFZlY3RvcjQoMC4wLCAwLjAsIDEuMCwgMS4wKTtcclxuXHRcclxuXHR2YXIgeHIgPSB0aGlzLnV2UmVnaW9uLng7XHJcblx0dmFyIHlyID0gdGhpcy51dlJlZ2lvbi55O1xyXG5cdHZhciBociA9IHRoaXMudXZSZWdpb24ueiAtIHhyO1xyXG5cdHZhciB2ciA9IHRoaXMudXZSZWdpb24udyAtIHlyO1xyXG5cdHZhciBocyA9IChwYXJhbXMuaGFsZlNwaGVyZSk/IDEuMCA6IDIuMDtcclxuXHRcclxuXHRmb3IgKHZhciBsYXROPTA7bGF0Tjw9bGF0QmFuZHM7bGF0TisrKXtcclxuXHRcdHZhciB0aGV0YSA9IGxhdE4gKiBNYXRoLlBJIC8gbGF0QmFuZHM7XHJcblx0XHR2YXIgY29zVCA9IE1hdGguY29zKHRoZXRhKTtcclxuXHRcdHZhciBzaW5UID0gTWF0aC5zaW4odGhldGEpO1xyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBsb25OPTA7bG9uTjw9bG9uQmFuZHM7bG9uTisrKXtcclxuXHRcdFx0dmFyIHBoaSA9IGxvbk4gKiBocyAqIE1hdGguUEkgLyBsb25CYW5kcztcclxuXHRcdFx0dmFyIGNvc1AgPSBNYXRoLmNvcyhwaGkpO1xyXG5cdFx0XHR2YXIgc2luUCA9IE1hdGguc2luKHBoaSk7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgeCA9IGNvc1AgKiBzaW5UO1xyXG5cdFx0XHR2YXIgeSA9IGNvc1Q7XHJcblx0XHRcdHZhciB6ID0gc2luUCAqIHNpblQ7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgdHggPSBsb25OIC8gbG9uQmFuZHM7XHJcblx0XHRcdHZhciB0eSA9IDEgLSBsYXROIC8gbGF0QmFuZHM7XHJcblx0XHRcdFxyXG5cdFx0XHRzcGhHZW8uYWRkTm9ybWFsKHgsIHksIHopO1xyXG5cdFx0XHRzcGhHZW8uYWRkVmVydGljZSh4ICogcmFkaXVzLCB5ICogcmFkaXVzLCB6ICogcmFkaXVzLCBDb2xvci5fV0hJVEUsIHhyICsgdHggKiBociwgeXIgKyB0eSAqIHZyKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgbGF0Tj0wO2xhdE48bGF0QmFuZHM7bGF0TisrKXtcclxuXHRcdGZvciAodmFyIGxvbk49MDtsb25OPGxvbkJhbmRzO2xvbk4rKyl7XHJcblx0XHRcdHZhciBpMSA9IGxvbk4gKyAobGF0TiAqIChsb25CYW5kcyArIDEpKTtcclxuXHRcdFx0dmFyIGkyID0gaTEgKyBsb25CYW5kcyArIDE7XHJcblx0XHRcdHZhciBpMyA9IGkxICsgMTtcclxuXHRcdFx0dmFyIGk0ID0gaTIgKyAxO1xyXG5cdFx0XHRcclxuXHRcdFx0c3BoR2VvLmFkZEZhY2UoaTQsIGkxLCBpMyk7XHJcblx0XHRcdHNwaEdlby5hZGRGYWNlKGk0LCBpMiwgaTEpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRzcGhHZW8uYnVpbGQoKTtcclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IHNwaEdlby52ZXJ0ZXhCdWZmZXI7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBzcGhHZW8udGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBzcGhHZW8uZmFjZXNCdWZmZXI7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBzcGhHZW8uY29sb3JzQnVmZmVyO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IHNwaEdlby5ub3JtYWxzQnVmZmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5U3BoZXJlOyIsInZhciBVdGlscyA9IHJlcXVpcmUoJy4vS1RVdGlscycpO1xyXG52YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcblxyXG52YXIgSW5wdXQgPSB7XHJcblx0X2tleXM6IFtdLFxyXG5cdF9tb3VzZToge1xyXG5cdFx0bGVmdDogMCxcclxuXHRcdHJpZ2h0OiAwLFxyXG5cdFx0bWlkZGxlOiAwLFxyXG5cdFx0d2hlZWw6IDAsXHJcblx0XHRwb3NpdGlvbjogbmV3IFZlY3RvcjIoMC4wLCAwLjApXHJcblx0fSxcclxuXHRcclxuXHR2S2V5OiB7XHJcblx0XHRTSElGVDogMTYsXHJcblx0XHRUQUI6IDksXHJcblx0XHRDVFJMOiAxNyxcclxuXHRcdEFMVDogMTgsXHJcblx0XHRTUEFDRTogMzIsXHJcblx0XHRFTlRFUjogMTMsXHJcblx0XHRCQUNLU1BBQ0U6IDgsXHJcblx0XHRFU0M6IDI3LFxyXG5cdFx0SU5TRVJUOiA0NSxcclxuXHRcdERFTDogNDYsXHJcblx0XHRFTkQ6IDM1LFxyXG5cdFx0U1RBUlQ6IDM2LFxyXG5cdFx0UEFHRVVQOiAzMyxcclxuXHRcdFBBR0VET1dOOiAzNFxyXG5cdH0sXHJcblx0XHJcblx0dk1vdXNlOiB7XHJcblx0XHRMRUZUOiAnbGVmdCcsXHJcblx0XHRSSUdIVDogJ3JpZ2h0JyxcclxuXHRcdE1JRERMRTogJ21pZGRsZScsXHJcblx0XHRXSEVFTFVQOiAxLFxyXG5cdFx0V0hFRUxET1dOOiAtMSxcclxuXHR9LFxyXG5cdFxyXG5cdGlzS2V5RG93bjogZnVuY3Rpb24oa2V5Q29kZSl7XHJcblx0XHRyZXR1cm4gKElucHV0Ll9rZXlzW2tleUNvZGVdID09IDEpO1xyXG5cdH0sXHJcblx0XHJcblx0aXNLZXlQcmVzc2VkOiBmdW5jdGlvbihrZXlDb2RlKXtcclxuXHRcdGlmIChJbnB1dC5fa2V5c1trZXlDb2RlXSA9PSAxKXtcclxuXHRcdFx0SW5wdXQuX2tleXNba2V5Q29kZV0gPSAyO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0aXNNb3VzZURvd246IGZ1bmN0aW9uKG1vdXNlQnV0dG9uKXtcclxuXHRcdHJldHVybiAoSW5wdXQuX21vdXNlW21vdXNlQnV0dG9uXSA9PSAxKTtcclxuXHR9LFxyXG5cdFxyXG5cdGlzTW91c2VQcmVzc2VkOiBmdW5jdGlvbihtb3VzZUJ1dHRvbil7XHJcblx0XHRpZiAoSW5wdXQuX21vdXNlW21vdXNlQnV0dG9uXSA9PSAxKXtcclxuXHRcdFx0SW5wdXQuX21vdXNlW21vdXNlQnV0dG9uXSA9IDI7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRpc1doZWVsTW92ZWQ6IGZ1bmN0aW9uKHdoZWVsRGlyKXtcclxuXHRcdGlmIChJbnB1dC5fbW91c2Uud2hlZWwgPT0gd2hlZWxEaXIpe1xyXG5cdFx0XHRJbnB1dC5fbW91c2Uud2hlZWwgPSAwO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlS2V5RG93bjogZnVuY3Rpb24oZXYpe1xyXG5cdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcclxuXHRcdGlmIChJbnB1dC5fa2V5c1tldi5rZXlDb2RlXSA9PSAyKSByZXR1cm47XHJcblx0XHRJbnB1dC5fa2V5c1tldi5rZXlDb2RlXSA9IDE7XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVLZXlVcDogZnVuY3Rpb24oZXYpe1xyXG5cdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcclxuXHRcdElucHV0Ll9rZXlzW2V2LmtleUNvZGVdID0gMDtcclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZU1vdXNlRG93bjogZnVuY3Rpb24oZXYpe1xyXG5cdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcclxuXHRcdGlmIChldi53aGljaCA9PSAxKXtcclxuXHRcdFx0aWYgKElucHV0Ll9tb3VzZS5sZWZ0ICE9IDIpXHJcblx0XHRcdFx0SW5wdXQuX21vdXNlLmxlZnQgPSAxO1xyXG5cdFx0fWVsc2UgaWYgKGV2LndoaWNoID09IDIpe1xyXG5cdFx0XHRpZiAoSW5wdXQuX21vdXNlLm1pZGRsZSAhPSAyKVxyXG5cdFx0XHRcdElucHV0Ll9tb3VzZS5taWRkbGUgPSAxO1xyXG5cdFx0fWVsc2UgaWYgKGV2LndoaWNoID09IDMpe1xyXG5cdFx0XHRpZiAoSW5wdXQuX21vdXNlLnJpZ2h0ICE9IDIpXHJcblx0XHRcdFx0SW5wdXQuX21vdXNlLnJpZ2h0ID0gMTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0SW5wdXQuaGFuZGxlTW91c2VNb3ZlKGV2KTtcclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVNb3VzZVVwOiBmdW5jdGlvbihldil7XHJcblx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFxyXG5cdFx0aWYgKGV2LndoaWNoID09IDEpe1xyXG5cdFx0XHRJbnB1dC5fbW91c2UubGVmdCA9IDA7XHJcblx0XHR9ZWxzZSBpZiAoZXYud2hpY2ggPT0gMil7XHJcblx0XHRcdElucHV0Ll9tb3VzZS5taWRkbGUgPSAwO1xyXG5cdFx0fWVsc2UgaWYgKGV2LndoaWNoID09IDMpe1xyXG5cdFx0XHRJbnB1dC5fbW91c2UucmlnaHQgPSAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRJbnB1dC5oYW5kbGVNb3VzZU1vdmUoZXYpO1xyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZU1vdXNlV2hlZWw6IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHJcblx0XHRJbnB1dC5fbW91c2Uud2hlZWwgPSAwO1xyXG5cdFx0aWYgKGV2LndoZWVsRGVsdGEgPiAwKSBJbnB1dC5fbW91c2Uud2hlZWwgPSAxO1xyXG5cdFx0ZWxzZSBpZiAoZXYud2hlZWxEZWx0YSA8IDApIElucHV0Ll9tb3VzZS53aGVlbCA9IC0xO1xyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlTW91c2VNb3ZlOiBmdW5jdGlvbihldil7XHJcblx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFxyXG5cdFx0dmFyIGVsWCA9IGV2LmNsaWVudFggLSBldi50YXJnZXQub2Zmc2V0TGVmdDtcclxuXHRcdHZhciBlbFkgPSBldi5jbGllbnRZIC0gZXYudGFyZ2V0Lm9mZnNldFRvcDtcclxuXHRcdFxyXG5cdFx0SW5wdXQuX21vdXNlLnBvc2l0aW9uLnNldChlbFgsIGVsWSk7XHJcblx0fSxcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihjYW52YXMpe1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoZG9jdW1lbnQsICdrZXlkb3duJywgSW5wdXQuaGFuZGxlS2V5RG93bik7XHJcblx0XHRVdGlscy5hZGRFdmVudChkb2N1bWVudCwgJ2tleXVwJywgSW5wdXQuaGFuZGxlS2V5VXApO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoY2FudmFzLCAnbW91c2Vkb3duJywgSW5wdXQuaGFuZGxlTW91c2VEb3duKTtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGRvY3VtZW50LCAnbW91c2V1cCcsIElucHV0LmhhbmRsZU1vdXNlVXApO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoY2FudmFzLCAnbW91c2V3aGVlbCcsIElucHV0LmhhbmRsZU1vdXNlV2hlZWwpO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoY2FudmFzLCAnbW91c2Vtb3ZlJywgSW5wdXQuaGFuZGxlTW91c2VNb3ZlKTtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGRvY3VtZW50LCAnY29udGV4dG1lbnUnLCBmdW5jdGlvbihldil7XHJcblx0XHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGV2LnRhcmdldCA9PT0gY2FudmFzKXtcclxuXHRcdFx0XHRldi5jYW5jZWxCdWJibGUgPSB0cnVlO1xyXG5cdFx0XHRcdGV2LnJldHVyblZhbHVlID0gZmFsc2U7XHJcblx0XHRcdFx0aWYgKGV2LnByZXZlbnREZWZhdWx0KVxyXG5cdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRpZiAoZXYuc3RvcFByb3BhZ2F0aW9uKVxyXG5cdFx0XHRcdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTw9OTtpKyspe1xyXG5cdFx0XHRJbnB1dC52S2V5WydOJyArIGldID0gNDggKyBpO1xyXG5cdFx0XHRJbnB1dC52S2V5WydOSycgKyBpXSA9IDk2ICsgaTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaT02NTtpPD05MDtpKyspe1xyXG5cdFx0XHRJbnB1dC52S2V5W1N0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaT0xO2k8PTEyO2krKyl7XHJcblx0XHRcdElucHV0LnZLZXlbJ0YnICsgaV0gPSAxMTEgKyBpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5wdXQ7IiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcblxyXG5mdW5jdGlvbiBEaXJlY3Rpb25hbExpZ2h0KGRpcmVjdGlvbiwgY29sb3IsIGludGVuc2l0eSl7XHJcblx0dGhpcy5fX2t0ZGlyTGlnaHQgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uLm5vcm1hbGl6ZSgpO1xyXG5cdHRoaXMuZGlyZWN0aW9uLm11bHRpcGx5KC0xKTtcclxuXHRcclxuXHR0aGlzLmNvbG9yID0gbmV3IENvbG9yKChjb2xvcik/IGNvbG9yOiBDb2xvci5fV0hJVEUpO1xyXG5cdHRoaXMuaW50ZW5zaXR5ID0gKGludGVuc2l0eSAhPT0gdW5kZWZpbmVkKT8gaW50ZW5zaXR5IDogMS4wO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGlvbmFsTGlnaHQ7XHJcblxyXG4iLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxuXHJcbmZ1bmN0aW9uIExpZ2h0UG9pbnQocG9zaXRpb24sIGludGVuc2l0eSwgZGlzdGFuY2UsIGNvbG9yKXtcclxuXHR0aGlzLl9fa3Rwb2ludGxpZ2h0ID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcblx0dGhpcy5pbnRlbnNpdHkgPSAoaW50ZW5zaXR5KT8gaW50ZW5zaXR5IDogMS4wO1xyXG5cdHRoaXMuZGlzdGFuY2UgPSAoZGlzdGFuY2UpPyBkaXN0YW5jZSA6IDEuMDtcclxuXHR0aGlzLmNvbG9yID0gbmV3IENvbG9yKChjb2xvcik/IGNvbG9yIDogQ29sb3IuX1dISVRFKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMaWdodFBvaW50OyIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgVmVjdG9yMyA9IHJlcXVpcmUoJy4vS1RWZWN0b3IzJyk7XHJcbnZhciBUZXh0dXJlRnJhbWVidWZmZXIgPSByZXF1aXJlKCcuL0tUVGV4dHVyZUZyYW1lYnVmZmVyJyk7XHJcblxyXG5mdW5jdGlvbiBMaWdodFNwb3QocG9zaXRpb24sIHRhcmdldCwgaW5uZXJBbmdsZSwgb3V0ZXJBbmdsZSwgaW50ZW5zaXR5LCBkaXN0YW5jZSwgY29sb3Ipe1xyXG5cdHRoaXMuX19rdHNwb3RsaWdodCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdHRoaXMuZGlyZWN0aW9uID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZShwb3NpdGlvbiwgdGFyZ2V0KS5ub3JtYWxpemUoKTtcclxuXHR0aGlzLm91dGVyQW5nbGUgPSBNYXRoLmNvcyhvdXRlckFuZ2xlKTtcclxuXHR0aGlzLmlubmVyQW5nbGUgPSBNYXRoLmNvcyhpbm5lckFuZ2xlKTtcclxuXHR0aGlzLmludGVuc2l0eSA9IChpbnRlbnNpdHkpPyBpbnRlbnNpdHkgOiAxLjA7XHJcblx0dGhpcy5kaXN0YW5jZSA9IChkaXN0YW5jZSk/IGRpc3RhbmNlIDogMS4wO1xyXG5cdHRoaXMuY29sb3IgPSBuZXcgQ29sb3IoKGNvbG9yKT8gY29sb3IgOiBDb2xvci5fV0hJVEUpO1xyXG5cdHRoaXMuY2FzdFNoYWRvdyA9IGZhbHNlO1xyXG5cdHRoaXMuc2hhZG93Q2FtID0gbnVsbDtcclxuXHR0aGlzLnNoYWRvd0J1ZmZlciA9IG51bGw7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGlnaHRTcG90O1xyXG5cclxuTGlnaHRTcG90LnByb3RvdHlwZS5zZXRDYXN0U2hhZG93ID0gZnVuY3Rpb24oY2FzdFNoYWRvdyl7XHJcblx0dGhpcy5jYXN0U2hhZG93ID0gY2FzdFNoYWRvdztcclxuXHRcclxuXHRpZiAoY2FzdFNoYWRvdyl7XHJcblx0XHR2YXIgcmVsID0gS1QuY2FudmFzLndpZHRoIC8gS1QuY2FudmFzLmhlaWdodDtcclxuXHRcdHRoaXMuc2hhZG93Q2FtID0gbmV3IEtULkNhbWVyYVBlcnNwZWN0aXZlKEtULk1hdGguZGVnVG9SYWQoOTAuMCksIHJlbCwgMC4xLCB0aGlzLmRpc3RhbmNlKTtcclxuXHRcdHRoaXMuc2hhZG93Q2FtLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbjtcclxuXHRcdHRoaXMuc2hhZG93Q2FtLmxvb2tBdCh0aGlzLnRhcmdldCk7XHJcblx0XHRcclxuXHRcdHRoaXMuc2hhZG93QnVmZmVyID0gbmV3IFRleHR1cmVGcmFtZWJ1ZmZlcig1MTIuMCwgNTEyLjApO1xyXG5cdH1lbHNle1xyXG5cdFx0dGhpcy5zaGFkb3dDYW0gPSBudWxsO1xyXG5cdFx0dGhpcy5zaGFkb3dCdWZmZXIgPSBudWxsO1xyXG5cdH1cclxufTtcclxuIiwidmFyIFNoYWRlcnMgPSByZXF1aXJlKCcuL0tUU2hhZGVycycpO1xyXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL0tUSW5wdXQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdFRFWFRVUkVfRlJPTlQ6IDAsXHJcblx0VEVYVFVSRV9CQUNLOiAxLFxyXG5cdFRFWFRVUkVfUklHSFQ6IDIsXHJcblx0VEVYVFVSRV9MRUZUOiAzLFxyXG5cdFRFWFRVUkVfVVA6IDQsXHJcblx0VEVYVFVSRV9ET1dOOiA1LFxyXG5cdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKGNhbnZhcyl7XHJcblx0XHR0aGlzLmNhbnZhcyA9IGNhbnZhcztcclxuXHRcdHRoaXMuZ2wgPSBudWxsO1xyXG5cdFx0dGhpcy5zaGFkZXJzID0ge307XHJcblx0XHR0aGlzLmltYWdlcyA9IFtdO1xyXG5cdFx0dGhpcy5tYXhBdHRyaWJMb2NhdGlvbnMgPSAwO1xyXG5cdFx0dGhpcy5sYXN0UHJvZ3JhbSA9IG51bGw7XHJcblx0XHRcclxuXHRcdHRoaXMuX19pbml0Q29udGV4dChjYW52YXMpO1xyXG5cdFx0dGhpcy5fX2luaXRQcm9wZXJ0aWVzKCk7XHJcblx0XHR0aGlzLl9faW5pdFNoYWRlcnMoKTtcclxuXHRcdFxyXG5cdFx0SW5wdXQuaW5pdChjYW52YXMpO1xyXG5cdH0sXHJcblx0XHJcblx0X19pbml0Q29udGV4dDogZnVuY3Rpb24oY2FudmFzKXtcclxuXHRcdHRoaXMuZ2wgPSBjYW52YXMuZ2V0Q29udGV4dCgnZXhwZXJpbWVudGFsLXdlYmdsJyk7XHJcblx0XHRcclxuXHRcdGlmICghdGhpcy5nbCl7XHJcblx0XHRcdGFsZXJ0KFwiWW91ciBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBXZWJHTFwiKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLmdsLndpZHRoID0gY2FudmFzLndpZHRoO1xyXG5cdFx0dGhpcy5nbC5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0O1xyXG5cdH0sXHJcblx0XHJcblx0X19pbml0UHJvcGVydGllczogZnVuY3Rpb24oKXtcclxuXHRcdHZhciBnbCA9IHRoaXMuZ2w7XHJcblx0XHRcclxuXHRcdGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcclxuXHRcdGdsLmRlcHRoRnVuYyhnbC5MRVFVQUwpO1xyXG5cdFx0XHJcblx0XHRnbC5lbmFibGUoZ2wuQ1VMTF9GQUNFKTtcclxuXHRcdFxyXG5cdFx0Z2wuZGlzYWJsZSggZ2wuQkxFTkQgKTtcclxuXHRcdGdsLmJsZW5kRXF1YXRpb24oIGdsLkZVTkNfQUREICk7XHJcblx0XHRnbC5ibGVuZEZ1bmMoIGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSApO1xyXG5cdH0sXHJcblx0XHJcblx0X19pbml0U2hhZGVyczogZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuc2hhZGVycyA9IHt9O1xyXG5cdFx0dGhpcy5zaGFkZXJzLmJhc2ljID0gdGhpcy5wcm9jZXNzU2hhZGVyKFNoYWRlcnMuYmFzaWMpO1xyXG5cdFx0dGhpcy5zaGFkZXJzLmxhbWJlcnQgPSB0aGlzLnByb2Nlc3NTaGFkZXIoU2hhZGVycy5sYW1iZXJ0KTtcclxuXHRcdHRoaXMuc2hhZGVycy5waG9uZyA9IHRoaXMucHJvY2Vzc1NoYWRlcihTaGFkZXJzLnBob25nKTtcclxuXHRcdHRoaXMuc2hhZGVycy5kZXB0aCA9IHRoaXMucHJvY2Vzc1NoYWRlcihTaGFkZXJzLmRlcHRoTWFwKTtcclxuXHR9LFxyXG5cdFxyXG5cdGNyZWF0ZUFycmF5QnVmZmVyOiBmdW5jdGlvbih0eXBlLCBkYXRhQXJyYXksIGl0ZW1TaXplKXtcclxuXHRcdHZhciBnbCA9IHRoaXMuZ2w7XHJcblx0XHR2YXIgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcblx0XHRnbC5iaW5kQnVmZmVyKGdsW3R5cGVdLCBidWZmZXIpO1xyXG5cdFx0Z2wuYnVmZmVyRGF0YShnbFt0eXBlXSwgZGF0YUFycmF5LCBnbC5TVEFUSUNfRFJBVyk7XHJcblx0XHRidWZmZXIubnVtSXRlbXMgPSBkYXRhQXJyYXkubGVuZ3RoO1xyXG5cdFx0YnVmZmVyLml0ZW1TaXplID0gaXRlbVNpemU7XHJcblx0XHRcclxuXHRcdHJldHVybiBidWZmZXI7XHJcblx0fSxcclxuXHRcclxuXHRnZXRTaGFkZXJBdHRyaWJ1dGVzQW5kVW5pZm9ybXM6IGZ1bmN0aW9uKHZlcnRleCwgZnJhZ21lbnQpe1xyXG5cdFx0dmFyIGF0dHJpYnV0ZXMgPSBbXTtcclxuXHRcdHZhciB1bmlmb3JtcyA9IFtdO1xyXG5cdFx0XHJcblx0XHR2YXIgc3RydWN0cyA9IFtdO1xyXG5cdFx0dmFyIHVuaWZvcm1zQXJyYXlzID0gW107XHJcblx0XHR2YXIgc3QgPSBudWxsO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dmVydGV4Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHR2YXIgbGluZSA9IHZlcnRleFtpXS50cmltKCk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAobGluZS5pbmRleE9mKFwiYXR0cmlidXRlIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtIDFdLnRyaW0oKTtcclxuXHRcdFx0XHRpZiAoYXR0cmlidXRlcy5pbmRleE9mKG5hbWUpID09IC0xKVxyXG5cdFx0XHRcdFx0YXR0cmlidXRlcy5wdXNoKHtuYW1lOiBuYW1lfSk7XHJcblx0XHRcdH1lbHNlIGlmIChsaW5lLmluZGV4T2YoXCJ1bmlmb3JtIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0aWYgKGxpbmUuaW5kZXhPZihcIltcIikgIT0gLTEpe1xyXG5cdFx0XHRcdFx0dW5pZm9ybXNBcnJheXMucHVzaChsaW5lKTtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgcCA9IGxpbmUuc3BsaXQoLyAvZyk7XHJcblx0XHRcdFx0dmFyIG5hbWUgPSBwW3AubGVuZ3RoIC0gMV0udHJpbSgpO1xyXG5cdFx0XHRcdGlmICh1bmlmb3Jtcy5pbmRleE9mKG5hbWUpID09IC0xKVxyXG5cdFx0XHRcdFx0dW5pZm9ybXMucHVzaCh7bmFtZTogbmFtZX0pO1xyXG5cdFx0XHR9ZWxzZSBpZiAobGluZS5pbmRleE9mKFwic3RydWN0XCIpID09IDApe1xyXG5cdFx0XHRcdHN0ID0geyBuYW1lOiBsaW5lLnJlcGxhY2UoXCJzdHJ1Y3QgXCIsIFwiXCIpLCBkYXRhOiBbXSB9O1xyXG5cdFx0XHRcdHN0cnVjdHMucHVzaChzdCk7XHJcblx0XHRcdH1lbHNlIGlmIChzdCAhPSBudWxsKXtcclxuXHRcdFx0XHRpZiAobGluZS50cmltKCkgPT0gXCJcIikgY29udGludWU7XHJcblx0XHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtMV0udHJpbSgpO1xyXG5cdFx0XHRcdHN0LmRhdGEucHVzaChuYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTxmcmFnbWVudC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0dmFyIGxpbmUgPSBmcmFnbWVudFtpXS50cmltKCk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAobGluZS5pbmRleE9mKFwiYXR0cmlidXRlIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtIDFdLnRyaW0oKTtcclxuXHRcdFx0XHRpZiAoYXR0cmlidXRlcy5pbmRleE9mKG5hbWUpID09IC0xKVxyXG5cdFx0XHRcdFx0YXR0cmlidXRlcy5wdXNoKHtuYW1lOiBuYW1lfSk7XHJcblx0XHRcdH1lbHNlIGlmIChsaW5lLmluZGV4T2YoXCJ1bmlmb3JtIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0aWYgKGxpbmUuaW5kZXhPZihcIltcIikgIT0gLTEpe1xyXG5cdFx0XHRcdFx0dW5pZm9ybXNBcnJheXMucHVzaChsaW5lKTtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgcCA9IGxpbmUuc3BsaXQoLyAvZyk7XHJcblx0XHRcdFx0dmFyIG5hbWUgPSBwW3AubGVuZ3RoIC0gMV0udHJpbSgpO1xyXG5cdFx0XHRcdGlmICh1bmlmb3Jtcy5pbmRleE9mKG5hbWUpID09IC0xKVxyXG5cdFx0XHRcdFx0dW5pZm9ybXMucHVzaCh7bmFtZTogbmFtZX0pO1xyXG5cdFx0XHR9ZWxzZSBpZiAobGluZS5pbmRleE9mKFwic3RydWN0XCIpICE9IC0xKXtcclxuXHRcdFx0XHRzdCA9IHsgbmFtZTogbGluZS5yZXBsYWNlKFwic3RydWN0IFwiLCBcIlwiKSwgZGF0YTogW10gfTtcclxuXHRcdFx0XHRzdHJ1Y3RzLnB1c2goc3QpO1xyXG5cdFx0XHR9ZWxzZSBpZiAoc3QgIT0gbnVsbCl7XHJcblx0XHRcdFx0aWYgKGxpbmUudHJpbSgpID09IFwiXCIpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdHZhciBwID0gbGluZS5zcGxpdCgvIC9nKTtcclxuXHRcdFx0XHR2YXIgbmFtZSA9IHBbcC5sZW5ndGggLTFdLnRyaW0oKTtcclxuXHRcdFx0XHRzdC5kYXRhLnB1c2gobmFtZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3Jtc0FycmF5cy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdFx0dmFyIGxpbmUgPSB1bmlmb3Jtc0FycmF5c1tpXTtcclxuXHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHR2YXIgdHlwZSA9IHBbcC5sZW5ndGggLSAyXS50cmltKCk7XHJcblx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtIDFdLnRyaW0oKTtcclxuXHRcdFx0dmFyIHVuaUxlbiA9IHBhcnNlSW50KG5hbWUuc3Vic3RyaW5nKG5hbWUuaW5kZXhPZihcIltcIikgKyAxLCBuYW1lLmluZGV4T2YoXCJdXCIpKSwgMTApO1xyXG5cdFx0XHR2YXIgbmFtZSA9IG5hbWUuc3Vic3RyaW5nKDAsIG5hbWUuaW5kZXhPZihcIltcIikpO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHN0ciA9IG51bGw7XHJcblx0XHRcdGZvciAodmFyIGo9MCxqbGVuPXN0cnVjdHMubGVuZ3RoO2o8amxlbjtqKyspe1xyXG5cdFx0XHRcdGlmIChzdHJ1Y3RzW2pdLm5hbWUgPT0gdHlwZSl7XHJcblx0XHRcdFx0XHRzdHIgPSBzdHJ1Y3RzW2pdO1xyXG5cdFx0XHRcdFx0aiA9IGpsZW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoc3RyKXtcclxuXHRcdFx0XHR2YXIgc3RydWN0VW5pID0gW107XHJcblx0XHRcdFx0Zm9yICh2YXIgaj0wO2o8dW5pTGVuO2orKyl7XHJcblx0XHRcdFx0XHRzdHJ1Y3RVbmlbal0gPSAoe25hbWU6IG5hbWUsIGxlbjogdW5pTGVuLCBkYXRhOiBbXX0pO1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaz0wLGtsZW49c3RyLmRhdGEubGVuZ3RoO2s8a2xlbjtrKyspe1xyXG5cdFx0XHRcdFx0XHR2YXIgcHJvcCA9IHN0ci5kYXRhW2tdO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0c3RydWN0VW5pW2pdLmRhdGEucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0bmFtZTogcHJvcCxcclxuXHRcdFx0XHRcdFx0XHRsb2NOYW1lOiBuYW1lICsgXCJbXCIgKyBqICsgXCJdLlwiICsgcHJvcFxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dW5pZm9ybXMucHVzaCh7XHJcblx0XHRcdFx0XHRtdWx0aTogdHJ1ZSxcclxuXHRcdFx0XHRcdGRhdGE6IHN0cnVjdFVuaSxcclxuXHRcdFx0XHRcdHR5cGU6IHR5cGVcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Zm9yICh2YXIgaj0wO2o8dW5pTGVuO2orKyl7XHJcblx0XHRcdFx0XHR1bmlmb3Jtcy5wdXNoKHtuYW1lOiBuYW1lICsgXCJbXCIgKyBqICsgXCJdXCJ9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0YXR0cmlidXRlczogYXR0cmlidXRlcyxcclxuXHRcdFx0dW5pZm9ybXM6IHVuaWZvcm1zXHJcblx0XHR9O1xyXG5cdH0sXHJcblx0XHJcblx0cHJvY2Vzc1NoYWRlcjogZnVuY3Rpb24oc2hhZGVyKXtcclxuXHRcdHZhciBnbCA9IHRoaXMuZ2w7XHJcblx0XHRcclxuXHRcdHZhciB2Q29kZSA9IHNoYWRlci52ZXJ0ZXhTaGFkZXI7XHJcblx0XHR2YXIgdlNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5WRVJURVhfU0hBREVSKTtcclxuXHRcdGdsLnNoYWRlclNvdXJjZSh2U2hhZGVyLCB2Q29kZSk7XHJcblx0XHRnbC5jb21waWxlU2hhZGVyKHZTaGFkZXIpO1xyXG5cdFx0XHJcblx0XHR2YXIgZkNvZGUgPSBzaGFkZXIuZnJhZ21lbnRTaGFkZXI7XHJcblx0XHR2YXIgZlNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5GUkFHTUVOVF9TSEFERVIpO1xyXG5cdFx0Z2wuc2hhZGVyU291cmNlKGZTaGFkZXIsIGZDb2RlKTtcclxuXHRcdGdsLmNvbXBpbGVTaGFkZXIoZlNoYWRlcik7XHJcblx0XHRcclxuXHRcdHZhciBzaGFkZXJQcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG5cdFx0Z2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIHZTaGFkZXIpO1xyXG5cdFx0Z2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIGZTaGFkZXIpO1xyXG5cdFx0Z2wubGlua1Byb2dyYW0oc2hhZGVyUHJvZ3JhbSk7XHJcblx0XHRcclxuXHRcdHZhciBwYXJhbXMgPSB0aGlzLmdldFNoYWRlckF0dHJpYnV0ZXNBbmRVbmlmb3Jtcyh2Q29kZS5zcGxpdCgvWzt7fV0rLyksIGZDb2RlLnNwbGl0KC9bO3t9XSsvKSk7XHJcblx0XHRcclxuXHRcdGlmICghZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihzaGFkZXJQcm9ncmFtLCBnbC5MSU5LX1NUQVRVUykpe1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3IgaW5pdGlhbGl6aW5nIHRoZSBzaGFkZXIgcHJvZ3JhbVwiKTtcclxuXHRcdFx0dGhyb3cgZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXJQcm9ncmFtKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIGF0dHJpYnV0ZXMgPSBbXTtcclxuXHRcdHRoaXMubWF4QXR0cmliTG9jYXRpb25zID0gTWF0aC5tYXgodGhpcy5tYXhBdHRyaWJMb2NhdGlvbnMsIHBhcmFtcy5hdHRyaWJ1dGVzLmxlbmd0aCk7XHJcblx0XHRmb3IgKHZhciBpPTAsbGVuPXBhcmFtcy5hdHRyaWJ1dGVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0XHR2YXIgYXR0ID0gcGFyYW1zLmF0dHJpYnV0ZXNbaV07XHJcblx0XHRcdHZhciBsb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHNoYWRlclByb2dyYW0sIGF0dC5uYW1lKTtcclxuXHRcdFx0XHJcblx0XHRcdGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGxvY2F0aW9uKTtcclxuXHRcdFx0XHJcblx0XHRcdGF0dHJpYnV0ZXMucHVzaCh7XHJcblx0XHRcdFx0bmFtZTogYXR0Lm5hbWUsXHJcblx0XHRcdFx0bG9jYXRpb246IGxvY2F0aW9uXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgdW5pZm9ybXMgPSBbXTtcclxuXHRcdGZvciAodmFyIGk9MCxsZW49cGFyYW1zLnVuaWZvcm1zLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0XHR2YXIgdW5pID0gcGFyYW1zLnVuaWZvcm1zW2ldO1xyXG5cdFx0XHRpZiAodW5pLm11bHRpKXtcclxuXHRcdFx0XHRmb3IgKHZhciBqPTAsamxlbj11bmkuZGF0YS5sZW5ndGg7ajxqbGVuO2orKyl7XHJcblx0XHRcdFx0XHR2YXIgdW5pRCA9IHVuaS5kYXRhW2pdO1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaz0wLGtsZW49dW5pRC5kYXRhLmxlbmd0aDtrPGtsZW47aysrKXtcclxuXHRcdFx0XHRcdFx0dmFyIGRhdCA9IHVuaUQuZGF0YVtrXTtcclxuXHRcdFx0XHRcdFx0ZGF0LmxvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHNoYWRlclByb2dyYW0sIGRhdC5sb2NOYW1lKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dW5pZm9ybXMucHVzaCh1bmkpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHR2YXIgbG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgdW5pLm5hbWUpO1xyXG5cdFx0XHRcclxuXHRcdFx0XHR1bmlmb3Jtcy5wdXNoKHtcclxuXHRcdFx0XHRcdG5hbWU6IHVuaS5uYW1lLFxyXG5cdFx0XHRcdFx0bG9jYXRpb246IGxvY2F0aW9uXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0c2hhZGVyUHJvZ3JhbTogc2hhZGVyUHJvZ3JhbSxcclxuXHRcdFx0YXR0cmlidXRlczogYXR0cmlidXRlcyxcclxuXHRcdFx0dW5pZm9ybXM6IHVuaWZvcm1zXHJcblx0XHR9O1xyXG5cdH0sXHJcblx0XHJcblx0c3dpdGNoUHJvZ3JhbTogZnVuY3Rpb24oc2hhZGVyKXtcclxuXHRcdGlmICh0aGlzLmxhc3RQcm9ncmFtID09PSBzaGFkZXIpIHJldHVybjtcclxuXHRcdHZhciBnbCA9IHRoaXMuZ2w7XHJcblx0XHRcclxuXHRcdHRoaXMubGFzdFByb2dyYW0gPSBzaGFkZXI7XHJcblx0XHRnbC51c2VQcm9ncmFtKHNoYWRlci5zaGFkZXJQcm9ncmFtKTtcclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dGhpcy5tYXhBdHRyaWJMb2NhdGlvbnM7aSsrKXtcclxuXHRcdFx0aWYgKGkgPCBzaGFkZXIuYXR0cmlidXRlcy5sZW5ndGgpe1xyXG5cdFx0XHRcdGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGkpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoaSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGdldEltYWdlOiBmdW5jdGlvbihzcmMpe1xyXG5cdFx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLmltYWdlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdFx0aWYgKHRoaXMuaW1hZ2VzW2ldLnNyYyA9PSBzcmMpXHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW1hZ2VzW2ldLmltZztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG59O1xyXG5cclxuXHJcbiIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG5cclxuZnVuY3Rpb24gTWF0ZXJpYWwocGFyYW1ldGVycyl7XHJcblx0dGhpcy5fX2t0bWF0ZXJpYWwgPSB0cnVlO1xyXG5cdFxyXG5cdGlmICghcGFyYW1ldGVycykgcGFyYW1ldGVycyA9IHt9O1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZU1hcCA9IChwYXJhbWV0ZXJzLnRleHR1cmVNYXApPyBwYXJhbWV0ZXJzLnRleHR1cmVNYXAgOiBudWxsO1xyXG5cdHRoaXMuY29sb3IgPSBuZXcgQ29sb3IoKHBhcmFtZXRlcnMuY29sb3IpPyBwYXJhbWV0ZXJzLmNvbG9yIDogQ29sb3IuX1dISVRFKTtcclxuXHR0aGlzLm9wYWNpdHkgPSAocGFyYW1ldGVycy5vcGFjaXR5KT8gcGFyYW1ldGVycy5vcGFjaXR5IDogMS4wO1xyXG5cdHRoaXMudHJhbnNwYXJlbnQgPSAocGFyYW1ldGVycy50cmFuc3BhcmVudCk/IHBhcmFtZXRlcnMudHJhbnNwYXJlbnQgOiBmYWxzZTtcclxuXHR0aGlzLmRyYXdGYWNlcyA9IChwYXJhbWV0ZXJzLmRyYXdGYWNlcyk/IHBhcmFtZXRlcnMuZHJhd0ZhY2VzIDogJ0ZST05UJztcclxuXHR0aGlzLmRyYXdBcyA9IChwYXJhbWV0ZXJzLmRyYXdBcyk/IHBhcmFtZXRlcnMuZHJhd0FzIDogJ1RSSUFOR0xFUyc7XHJcblx0dGhpcy5zaGFkZXIgPSAocGFyYW1ldGVycy5zaGFkZXIpPyBwYXJhbWV0ZXJzLnNoYWRlciA6IG51bGw7XHJcblx0dGhpcy5zZW5kQXR0cmliRGF0YSA9IChwYXJhbWV0ZXJzLnNlbmRBdHRyaWJEYXRhKT8gcGFyYW1ldGVycy5zZW5kQXR0cmliRGF0YSA6IG51bGw7XHJcblx0dGhpcy5zZW5kVW5pZm9ybURhdGEgPSAocGFyYW1ldGVycy5zZW5kVW5pZm9ybURhdGEpPyBwYXJhbWV0ZXJzLnNlbmRVbmlmb3JtRGF0YSA6IG51bGw7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0ZXJpYWw7IiwidmFyIE1hdGVyaWFsID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsJyk7XHJcbnZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcblxyXG5mdW5jdGlvbiBNYXRlcmlhbEJhc2ljKHRleHR1cmVNYXAsIGNvbG9yKXtcclxuXHR0aGlzLl9fa3RtYXRlcmlhbCA9IHRydWU7XHJcblx0XHJcblx0dmFyIG1hdGVyaWFsID0gbmV3IE1hdGVyaWFsKHtcclxuXHRcdHRleHR1cmVNYXA6IHRleHR1cmVNYXAsXHJcblx0XHRjb2xvcjogY29sb3IsXHJcblx0XHRzaGFkZXI6IEtULnNoYWRlcnMuYmFzaWNcclxuXHR9KTtcclxuXHRcclxuXHR0aGlzLnRleHR1cmVNYXAgPSBtYXRlcmlhbC50ZXh0dXJlTWFwO1xyXG5cdHRoaXMuY29sb3IgPSBtYXRlcmlhbC5jb2xvcjtcclxuXHR0aGlzLnNoYWRlciA9IG1hdGVyaWFsLnNoYWRlcjtcclxuXHR0aGlzLm9wYWNpdHkgPSBtYXRlcmlhbC5vcGFjaXR5O1xyXG5cdHRoaXMuZHJhd0ZhY2VzID0gbWF0ZXJpYWwuZHJhd0ZhY2VzO1xyXG5cdHRoaXMuZHJhd0FzID0gbWF0ZXJpYWwuZHJhd0FzO1xyXG5cdHRoaXMudHJhbnNwYXJlbnQgPSBtYXRlcmlhbC50cmFuc3BhcmVudDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRlcmlhbEJhc2ljO1xyXG5cclxuTWF0ZXJpYWxCYXNpYy5wcm90b3R5cGUuc2VuZEF0dHJpYkRhdGEgPSBmdW5jdGlvbihtZXNoLCBjYW1lcmEsIHNjZW5lKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHR2YXIgZ2VvbWV0cnkgPSBtZXNoLmdlb21ldHJ5O1xyXG5cdHZhciBhdHRyaWJ1dGVzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuXHRmb3IgKHZhciBpPTAsbGVuPWF0dHJpYnV0ZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgYXR0ID0gYXR0cmlidXRlc1tpXTtcclxuXHRcdFxyXG5cdFx0aWYgKGF0dC5uYW1lID09IFwiYVZlcnRleFBvc2l0aW9uXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LnZlcnRleEJ1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhDb2xvclwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LmNvbG9yc0J1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS5jb2xvcnNCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9ZWxzZSBpZiAoYXR0Lm5hbWUgPT0gXCJhVGV4dHVyZUNvb3JkXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkudGV4QnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LnRleEJ1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRlcmlhbEJhc2ljLnByb3RvdHlwZS5zZW5kVW5pZm9ybURhdGEgPSBmdW5jdGlvbihtZXNoLCBjYW1lcmEsIHNjZW5lKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHR2YXIgZ2VvbWV0cnkgPSBtZXNoLmdlb21ldHJ5O1xyXG5cdHZhciB0cmFuc2Zvcm1hdGlvbk1hdHJpeDtcclxuXHR2YXIgdW5pZm9ybXMgPSB0aGlzLnNoYWRlci51bmlmb3JtcztcclxuXHRmb3IgKHZhciBpPTAsbGVuPXVuaWZvcm1zLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIHVuaSA9IHVuaWZvcm1zW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAodW5pLm5hbWUgPT0gJ3VNVlBNYXRyaXgnKXtcclxuXHRcdFx0dHJhbnNmb3JtYXRpb25NYXRyaXggPSBtZXNoLmdldFRyYW5zZm9ybWF0aW9uTWF0cml4KCkubXVsdGlwbHkoY2FtZXJhLnRyYW5zZm9ybWF0aW9uTWF0cml4KTtcclxuXHRcdFx0dmFyIG12cCA9IHRyYW5zZm9ybWF0aW9uTWF0cml4LmNsb25lKCkubXVsdGlwbHkoY2FtZXJhLnBlcnNwZWN0aXZlTWF0cml4KTtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdih1bmkubG9jYXRpb24sIGZhbHNlLCBtdnAudG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VNYXRlcmlhbENvbG9yJyl7XHJcblx0XHRcdHZhciBjb2xvciA9IG1lc2gubWF0ZXJpYWwuY29sb3IuZ2V0UkdCQSgpO1xyXG5cdFx0XHRnbC51bmlmb3JtNGZ2KHVuaS5sb2NhdGlvbiwgbmV3IEZsb2F0MzJBcnJheShjb2xvcikpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VGV4dHVyZVNhbXBsZXInKXtcclxuXHRcdFx0aWYgKG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdFx0Z2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCk7XHJcblx0XHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLnRleHR1cmUpO1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIDApO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VIYXNUZXh0dXJlJyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIChtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApPyAxIDogMCk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlUmVwZWF0JyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtMmYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAucmVwZWF0LngsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5yZXBlYXQueSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VHZW9tZXRyeVVWJyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtNGYodW5pLmxvY2F0aW9uLCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLngsIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueSwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi56LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLncpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VGV4dHVyZU9mZnNldCcgJiYgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0Z2wudW5pZm9ybTJmKHVuaS5sb2NhdGlvbiwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLm9mZnNldC54LCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAub2Zmc2V0LnkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuIiwidmFyIE1hdGVyaWFsID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsJyk7XHJcblxyXG5mdW5jdGlvbiBNYXRlcmlhbExhbWJlcnQodGV4dHVyZU1hcCwgY29sb3IsIG9wYWNpdHkpe1xyXG5cdHRoaXMuX19rdG1hdGVyaWFsID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgbWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoe1xyXG5cdFx0dGV4dHVyZU1hcDogdGV4dHVyZU1hcCxcclxuXHRcdGNvbG9yOiBjb2xvcixcclxuXHRcdG9wYWNpdHk6IG9wYWNpdHksXHJcblx0XHRzaGFkZXI6IEtULnNoYWRlcnMubGFtYmVydFxyXG5cdH0pO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZU1hcCA9IG1hdGVyaWFsLnRleHR1cmVNYXA7XHJcblx0dGhpcy5jb2xvciA9IG1hdGVyaWFsLmNvbG9yO1xyXG5cdHRoaXMuc2hhZGVyID0gbWF0ZXJpYWwuc2hhZGVyO1xyXG5cdHRoaXMub3BhY2l0eSA9IG1hdGVyaWFsLm9wYWNpdHk7XHJcblx0dGhpcy5kcmF3RmFjZXMgPSBtYXRlcmlhbC5kcmF3RmFjZXM7XHJcblx0dGhpcy5kcmF3QXMgPSBtYXRlcmlhbC5kcmF3QXM7XHJcblx0dGhpcy50cmFuc3BhcmVudCA9IG1hdGVyaWFsLnRyYW5zcGFyZW50O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGVyaWFsTGFtYmVydDtcclxuXHJcbk1hdGVyaWFsTGFtYmVydC5wcm90b3R5cGUuc2VuZEF0dHJpYkRhdGEgPSBmdW5jdGlvbihtZXNoLCBjYW1lcmEsIHNjZW5lKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHR2YXIgZ2VvbWV0cnkgPSBtZXNoLmdlb21ldHJ5O1xyXG5cdHZhciBhdHRyaWJ1dGVzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuXHRmb3IgKHZhciBpPTAsbGVuPWF0dHJpYnV0ZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgYXR0ID0gYXR0cmlidXRlc1tpXTtcclxuXHRcdFxyXG5cdFx0aWYgKGF0dC5uYW1lID09IFwiYVZlcnRleFBvc2l0aW9uXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LnZlcnRleEJ1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhDb2xvclwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LmNvbG9yc0J1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS5jb2xvcnNCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9ZWxzZSBpZiAoYXR0Lm5hbWUgPT0gXCJhVGV4dHVyZUNvb3JkXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkudGV4QnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LnRleEJ1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhOb3JtYWxcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS5ub3JtYWxzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5Lm5vcm1hbHNCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0ZXJpYWxMYW1iZXJ0LnByb3RvdHlwZS5zZW5kTGlnaHRVbmlmb3JtRGF0YSA9IGZ1bmN0aW9uKGxpZ2h0LCB1bmlmb3JtKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRmb3IgKHZhciBpPTAsbGVuPXVuaWZvcm0uZGF0YS5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBkYXQgPSB1bmlmb3JtLmRhdGFbaV07XHJcblx0XHRcclxuXHRcdGlmIChkYXQubmFtZSA9PSAncG9zaXRpb24nKXtcclxuXHRcdFx0aWYgKGxpZ2h0Ll9fa3Rwb2ludGxpZ2h0IHx8IGxpZ2h0Ll9fa3RzcG90bGlnaHQpe1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIGxpZ2h0LnBvc2l0aW9uLngsIGxpZ2h0LnBvc2l0aW9uLnksIGxpZ2h0LnBvc2l0aW9uLnopO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCAwLjAsIDAuMCwgMC4wKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdkaXJlY3Rpb24nKXtcclxuXHRcdFx0aWYgKGxpZ2h0Ll9fa3RkaXJMaWdodCl7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgbGlnaHQuZGlyZWN0aW9uLngsIGxpZ2h0LmRpcmVjdGlvbi55LCBsaWdodC5kaXJlY3Rpb24ueik7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIDAuMCwgMC4wLCAwLjApO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ3Nwb3REaXJlY3Rpb24nKXtcclxuXHRcdFx0aWYgKGxpZ2h0Ll9fa3RzcG90bGlnaHQpe1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIGxpZ2h0LmRpcmVjdGlvbi54LCBsaWdodC5kaXJlY3Rpb24ueSwgbGlnaHQuZGlyZWN0aW9uLnopO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCAwLjAsIDAuMCwgMC4wKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdjb2xvcicpe1xyXG5cdFx0XHR2YXIgY29sb3IgPSBsaWdodC5jb2xvci5nZXRSR0IoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSk7XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ2ludGVuc2l0eScpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWYoZGF0LmxvY2F0aW9uLCBsaWdodC5pbnRlbnNpdHkpO1xyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdvdXRlckFuZ2xlJyl7XHJcblx0XHRcdGlmIChsaWdodC5fX2t0c3BvdGxpZ2h0KXtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWYoZGF0LmxvY2F0aW9uLCBsaWdodC5vdXRlckFuZ2xlKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFmKGRhdC5sb2NhdGlvbiwgMC4wKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdpbm5lckFuZ2xlJyl7XHJcblx0XHRcdGlmIChsaWdodC5fX2t0c3BvdGxpZ2h0KXtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWYoZGF0LmxvY2F0aW9uLCBsaWdodC5pbm5lckFuZ2xlKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFmKGRhdC5sb2NhdGlvbiwgMC4wKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbk1hdGVyaWFsTGFtYmVydC5wcm90b3R5cGUuc2VuZFVuaWZvcm1EYXRhID0gZnVuY3Rpb24obWVzaCwgY2FtZXJhLCBzY2VuZSl7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0dmFyIGdlb21ldHJ5ID0gbWVzaC5nZW9tZXRyeTtcclxuXHR2YXIgdHJhbnNmb3JtYXRpb25NYXRyaXg7XHJcblx0dmFyIHVuaWZvcm1zID0gdGhpcy5zaGFkZXIudW5pZm9ybXM7XHJcblx0dmFyIG1vZGVsVHJhbnNmb3JtYXRpb247XHJcblx0dmFyIHVzZWRMaWdodFVuaWZvcm0gPSBudWxsO1xyXG5cdHZhciBsaWdodHNDb3VudCA9IDA7XHJcblx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3Jtcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciB1bmkgPSB1bmlmb3Jtc1tpXTtcclxuXHRcdFxyXG5cdFx0aWYgKHVuaS5tdWx0aSAmJiB1bmkudHlwZSA9PSAnTGlnaHQnKXtcclxuXHRcdFx0aWYgKGxpZ2h0c0NvdW50ID09IHVuaS5kYXRhLmxlbmd0aClcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0dmFyIGxpZ2h0cyA9IHNjZW5lLmxpZ2h0cztcclxuXHRcdFx0Zm9yICh2YXIgaj0wLGpsZW49bGlnaHRzLmxlbmd0aDtqPGpsZW47aisrKXtcclxuXHRcdFx0XHR0aGlzLnNlbmRMaWdodFVuaWZvcm1EYXRhKGxpZ2h0c1tqXSwgdW5pLmRhdGFbbGlnaHRzQ291bnQrK10pO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VNVk1hdHJpeCcpe1xyXG5cdFx0XHRtb2RlbFRyYW5zZm9ybWF0aW9uID0gbWVzaC5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xyXG5cdFx0XHR0cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG1vZGVsVHJhbnNmb3JtYXRpb24uY2xvbmUoKS5tdWx0aXBseShjYW1lcmEudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIHRyYW5zZm9ybWF0aW9uTWF0cml4LnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1UE1hdHJpeCcpe1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIGNhbWVyYS5wZXJzcGVjdGl2ZU1hdHJpeC50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1hdGVyaWFsQ29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gbWVzaC5tYXRlcmlhbC5jb2xvci5nZXRSR0JBKCk7XHJcblx0XHRcdGdsLnVuaWZvcm00ZnYodW5pLmxvY2F0aW9uLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9yKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlU2FtcGxlcicpe1xyXG5cdFx0XHRpZiAobWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwKTtcclxuXHRcdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAudGV4dHVyZSk7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUhhc1RleHR1cmUnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVVzZUxpZ2h0aW5nJyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIChzY2VuZS51c2VMaWdodGluZyk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU5vcm1hbE1hdHJpeCcpe1xyXG5cdFx0XHR2YXIgbm9ybWFsTWF0cml4ID0gbW9kZWxUcmFuc2Zvcm1hdGlvbi50b01hdHJpeDMoKS5pbnZlcnNlKCkudG9GbG9hdDMyQXJyYXkoKTtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDNmdih1bmkubG9jYXRpb24sIGZhbHNlLCBub3JtYWxNYXRyaXgpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TW9kZWxNYXRyaXgnKXtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdih1bmkubG9jYXRpb24sIGZhbHNlLCBtb2RlbFRyYW5zZm9ybWF0aW9uLnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1QW1iaWVudExpZ2h0Q29sb3InICYmIHNjZW5lLnVzZUxpZ2h0aW5nICYmIHNjZW5lLmFtYmllbnRMaWdodCl7XHJcblx0XHRcdHZhciBjb2xvciA9IHNjZW5lLmFtYmllbnRMaWdodC5nZXRSR0IoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTNmKHVuaS5sb2NhdGlvbiwgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VPcGFjaXR5Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZih1bmkubG9jYXRpb24sIG1lc2gubWF0ZXJpYWwub3BhY2l0eSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlUmVwZWF0JyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtMmYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAucmVwZWF0LngsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5yZXBlYXQueSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VHZW9tZXRyeVVWJyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtNGYodW5pLmxvY2F0aW9uLCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLngsIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueSwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi56LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLncpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VGV4dHVyZU9mZnNldCcgJiYgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0Z2wudW5pZm9ybTJmKHVuaS5sb2NhdGlvbiwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLm9mZnNldC54LCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAub2Zmc2V0LnkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1c2VkTGlnaHRzJyl7XHJcblx0XHRcdHVzZWRMaWdodFVuaWZvcm0gPSB1bmk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGlmICh1c2VkTGlnaHRVbmlmb3JtKXtcclxuXHRcdGdsLnVuaWZvcm0xaSh1c2VkTGlnaHRVbmlmb3JtLmxvY2F0aW9uLCBsaWdodHNDb3VudCk7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59OyIsInZhciBNYXRlcmlhbCA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbCcpO1xyXG52YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxuXHJcbmZ1bmN0aW9uIE1hdGVyaWFsUGhvbmcodGV4dHVyZU1hcCwgY29sb3IsIG9wYWNpdHkpe1xyXG5cdHRoaXMuX19rdG1hdGVyaWFsID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgbWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoe1xyXG5cdFx0dGV4dHVyZU1hcDogdGV4dHVyZU1hcCxcclxuXHRcdGNvbG9yOiBjb2xvcixcclxuXHRcdG9wYWNpdHk6IG9wYWNpdHksXHJcblx0XHRzaGFkZXI6IEtULnNoYWRlcnMucGhvbmdcclxuXHR9KTtcclxuXHRcclxuXHR0aGlzLnRleHR1cmVNYXAgPSBtYXRlcmlhbC50ZXh0dXJlTWFwO1xyXG5cdHRoaXMuc3BlY3VsYXJNYXAgPSBudWxsO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBtYXRlcmlhbC5jb2xvcjtcclxuXHR0aGlzLnNoYWRlciA9IG1hdGVyaWFsLnNoYWRlcjtcclxuXHR0aGlzLm9wYWNpdHkgPSBtYXRlcmlhbC5vcGFjaXR5O1xyXG5cdHRoaXMuZHJhd0ZhY2VzID0gbWF0ZXJpYWwuZHJhd0ZhY2VzO1xyXG5cdHRoaXMuZHJhd0FzID0gbWF0ZXJpYWwuZHJhd0FzO1xyXG5cdHRoaXMuc3BlY3VsYXJDb2xvciA9IG5ldyBDb2xvcihDb2xvci5fV0hJVEUpO1xyXG5cdHRoaXMuc2hpbmluZXNzID0gMC4wO1xyXG5cdHRoaXMudHJhbnNwYXJlbnQgPSBtYXRlcmlhbC50cmFuc3BhcmVudDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRlcmlhbFBob25nO1xyXG5cclxuTWF0ZXJpYWxQaG9uZy5wcm90b3R5cGUuc2VuZEF0dHJpYkRhdGEgPSBmdW5jdGlvbihtZXNoLCBjYW1lcmEsIHNjZW5lKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHR2YXIgZ2VvbWV0cnkgPSBtZXNoLmdlb21ldHJ5O1xyXG5cdHZhciBhdHRyaWJ1dGVzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuXHRmb3IgKHZhciBpPTAsbGVuPWF0dHJpYnV0ZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgYXR0ID0gYXR0cmlidXRlc1tpXTtcclxuXHRcdFxyXG5cdFx0aWYgKGF0dC5uYW1lID09IFwiYVZlcnRleFBvc2l0aW9uXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LnZlcnRleEJ1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhDb2xvclwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LmNvbG9yc0J1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS5jb2xvcnNCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9ZWxzZSBpZiAoYXR0Lm5hbWUgPT0gXCJhVGV4dHVyZUNvb3JkXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkudGV4QnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LnRleEJ1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhOb3JtYWxcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS5ub3JtYWxzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5Lm5vcm1hbHNCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0ZXJpYWxQaG9uZy5wcm90b3R5cGUuc2VuZExpZ2h0VW5pZm9ybURhdGEgPSBmdW5jdGlvbihsaWdodCwgdW5pZm9ybSl7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3JtLmRhdGEubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgZGF0ID0gdW5pZm9ybS5kYXRhW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAoZGF0Lm5hbWUgPT0gJ3Bvc2l0aW9uJyl7XHJcblx0XHRcdGlmIChsaWdodC5fX2t0cG9pbnRsaWdodCB8fCBsaWdodC5fX2t0c3BvdGxpZ2h0KXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCBsaWdodC5wb3NpdGlvbi54LCBsaWdodC5wb3NpdGlvbi55LCBsaWdodC5wb3NpdGlvbi56KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgMC4wLCAwLjAsIDAuMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnZGlyZWN0aW9uJyl7XHJcblx0XHRcdGlmIChsaWdodC5fX2t0ZGlyTGlnaHQpe1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIGxpZ2h0LmRpcmVjdGlvbi54LCBsaWdodC5kaXJlY3Rpb24ueSwgbGlnaHQuZGlyZWN0aW9uLnopO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCAwLjAsIDAuMCwgMC4wKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdzcG90RGlyZWN0aW9uJyl7XHJcblx0XHRcdGlmIChsaWdodC5fX2t0c3BvdGxpZ2h0KXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCBsaWdodC5kaXJlY3Rpb24ueCwgbGlnaHQuZGlyZWN0aW9uLnksIGxpZ2h0LmRpcmVjdGlvbi56KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgMC4wLCAwLjAsIDAuMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnY29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gbGlnaHQuY29sb3IuZ2V0UkdCKCk7XHJcblx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0pO1xyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdpbnRlbnNpdHknKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFmKGRhdC5sb2NhdGlvbiwgbGlnaHQuaW50ZW5zaXR5KTtcclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnb3V0ZXJBbmdsZScpe1xyXG5cdFx0XHRpZiAobGlnaHQuX19rdHNwb3RsaWdodCl7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFmKGRhdC5sb2NhdGlvbiwgbGlnaHQub3V0ZXJBbmdsZSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIDAuMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnaW5uZXJBbmdsZScpe1xyXG5cdFx0XHRpZiAobGlnaHQuX19rdHNwb3RsaWdodCl7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFmKGRhdC5sb2NhdGlvbiwgbGlnaHQuaW5uZXJBbmdsZSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIDAuMCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5NYXRlcmlhbFBob25nLnByb3RvdHlwZS5zZW5kVW5pZm9ybURhdGEgPSBmdW5jdGlvbihtZXNoLCBjYW1lcmEsIHNjZW5lKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHR2YXIgZ2VvbWV0cnkgPSBtZXNoLmdlb21ldHJ5O1xyXG5cdHZhciB0cmFuc2Zvcm1hdGlvbk1hdHJpeDtcclxuXHR2YXIgdW5pZm9ybXMgPSB0aGlzLnNoYWRlci51bmlmb3JtcztcclxuXHR2YXIgbW9kZWxUcmFuc2Zvcm1hdGlvbjtcclxuXHR2YXIgbGlnaHRzQ291bnQgPSAwO1xyXG5cdFxyXG5cdHZhciB1c2VkTGlnaHRVbmlmb3JtID0gbnVsbDtcclxuXHRmb3IgKHZhciBpPTAsbGVuPXVuaWZvcm1zLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIHVuaSA9IHVuaWZvcm1zW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAodW5pLm11bHRpICYmIHVuaS50eXBlID09ICdMaWdodCcpe1xyXG5cdFx0XHRpZiAobGlnaHRzQ291bnQgPT0gdW5pLmRhdGEubGVuZ3RoKVxyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR2YXIgbGlnaHRzID0gc2NlbmUubGlnaHRzO1xyXG5cdFx0XHRmb3IgKHZhciBqPTAsamxlbj1saWdodHMubGVuZ3RoO2o8amxlbjtqKyspe1xyXG5cdFx0XHRcdHRoaXMuc2VuZExpZ2h0VW5pZm9ybURhdGEobGlnaHRzW2pdLCB1bmkuZGF0YVtsaWdodHNDb3VudCsrXSk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1WTWF0cml4Jyl7XHJcblx0XHRcdG1vZGVsVHJhbnNmb3JtYXRpb24gPSBtZXNoLmdldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblx0XHRcdHRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbW9kZWxUcmFuc2Zvcm1hdGlvbi5jbG9uZSgpLm11bHRpcGx5KGNhbWVyYS50cmFuc2Zvcm1hdGlvbk1hdHJpeCk7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgdHJhbnNmb3JtYXRpb25NYXRyaXgudG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VQTWF0cml4Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgY2FtZXJhLnBlcnNwZWN0aXZlTWF0cml4LnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TWF0ZXJpYWxDb2xvcicpe1xyXG5cdFx0XHR2YXIgY29sb3IgPSBtZXNoLm1hdGVyaWFsLmNvbG9yLmdldFJHQkEoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTRmdih1bmkubG9jYXRpb24sIG5ldyBGbG9hdDMyQXJyYXkoY29sb3IpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVTYW1wbGVyJyl7XHJcblx0XHRcdGlmIChtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRcdGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTApO1xyXG5cdFx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC50ZXh0dXJlKTtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1SGFzVGV4dHVyZScpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAobWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKT8gMSA6IDApO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VXNlTGlnaHRpbmcnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKHNjZW5lLnVzZUxpZ2h0aW5nKT8gMSA6IDApO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1Tm9ybWFsTWF0cml4Jyl7XHJcblx0XHRcdHZhciBub3JtYWxNYXRyaXggPSBtb2RlbFRyYW5zZm9ybWF0aW9uLnRvTWF0cml4MygpLmludmVyc2UoKS50b0Zsb2F0MzJBcnJheSgpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4M2Z2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG5vcm1hbE1hdHJpeCk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VNb2RlbE1hdHJpeCcpe1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG1vZGVsVHJhbnNmb3JtYXRpb24udG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VDYW1lcmFQb3NpdGlvbicpe1xyXG5cdFx0XHRnbC51bmlmb3JtM2YodW5pLmxvY2F0aW9uLCBjYW1lcmEucG9zaXRpb24ueCwgY2FtZXJhLnBvc2l0aW9uLnksIGNhbWVyYS5wb3NpdGlvbi56KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVNwZWN1bGFyQ29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gdGhpcy5zcGVjdWxhckNvbG9yLmdldFJHQigpO1xyXG5cdFx0XHRnbC51bmlmb3JtM2YodW5pLmxvY2F0aW9uLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVNoaW5pbmVzcycpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWYodW5pLmxvY2F0aW9uLCB0aGlzLnNoaW5pbmVzcyk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VBbWJpZW50TGlnaHRDb2xvcicgJiYgc2NlbmUudXNlTGlnaHRpbmcgJiYgc2NlbmUuYW1iaWVudExpZ2h0KXtcclxuXHRcdFx0dmFyIGNvbG9yID0gc2NlbmUuYW1iaWVudExpZ2h0LmdldFJHQigpO1xyXG5cdFx0XHRnbC51bmlmb3JtM2YodW5pLmxvY2F0aW9uLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU9wYWNpdHknKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFmKHVuaS5sb2NhdGlvbiwgbWVzaC5tYXRlcmlhbC5vcGFjaXR5KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVSZXBlYXQnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm0yZih1bmkubG9jYXRpb24sIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5yZXBlYXQueCwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLnJlcGVhdC55KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUdlb21ldHJ5VVYnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm00Zih1bmkubG9jYXRpb24sIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueCwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi55LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLnosIG1lc2guZ2VvbWV0cnkudXZSZWdpb24udyk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlT2Zmc2V0JyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtMmYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAub2Zmc2V0LngsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5vZmZzZXQueSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VzZWRMaWdodHMnKXtcclxuXHRcdFx0dXNlZExpZ2h0VW5pZm9ybSA9IHVuaTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVVzZVNwZWN1bGFyTWFwJyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIChtZXNoLm1hdGVyaWFsLnNwZWN1bGFyTWFwKT8gMSA6IDApO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1U3BlY3VsYXJNYXBTYW1wbGVyJyl7XHJcblx0XHRcdGlmIChtZXNoLm1hdGVyaWFsLnNwZWN1bGFyTWFwKXtcclxuXHRcdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUxKTtcclxuXHRcdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBtZXNoLm1hdGVyaWFsLnNwZWN1bGFyTWFwLnRleHR1cmUpO1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIDEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGlmICh1c2VkTGlnaHRVbmlmb3JtKXtcclxuXHRcdGdsLnVuaWZvcm0xaSh1c2VkTGlnaHRVbmlmb3JtLmxvY2F0aW9uLCBsaWdodHNDb3VudCk7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdHJhZERlZ1JlbDogTWF0aC5QSSAvIDE4MCxcclxuXHRcclxuXHRQSV8yOiBNYXRoLlBJIC8gMixcclxuXHRQSTogTWF0aC5QSSxcclxuXHRQSTNfMjogTWF0aC5QSSAqIDMgLyAyLFxyXG5cdFBJMjogTWF0aC5QSSAqIDIsXHJcblx0XHJcblx0ZGVnVG9SYWQ6IGZ1bmN0aW9uKGRlZ3JlZXMpe1xyXG5cdFx0cmV0dXJuIGRlZ3JlZXMgKiB0aGlzLnJhZERlZ1JlbDtcclxuXHR9LFxyXG5cdFxyXG5cdHJhZFRvRGVnOiBmdW5jdGlvbihyYWRpYW5zKXtcclxuXHRcdHJldHVybiByYWRpYW5zIC8gdGhpcy5yYWREZWdSZWw7XHJcblx0fSxcclxuXHRcclxuXHRnZXQyREFuZ2xlOiBmdW5jdGlvbih4MSwgeTEsIHgyLCB5Mil7XHJcblx0XHR2YXIgeHggPSBNYXRoLmFicyh4MiAtIHgxKTtcclxuXHRcdHZhciB5eSA9IE1hdGguYWJzKHkyIC0geTEpO1xyXG5cdFx0XHJcblx0XHR2YXIgYW5nID0gTWF0aC5hdGFuMih5eSwgeHgpO1xyXG5cdFx0XHJcblx0XHRpZiAoeDIgPD0geDEgJiYgeTIgPD0geTEpe1xyXG5cdFx0XHRhbmcgPSB0aGlzLlBJIC0gYW5nO1xyXG5cdFx0fWVsc2UgaWYgKHgyIDw9IHgxICYmIHkyID4geTEpe1xyXG5cdFx0XHRhbmcgPSB0aGlzLlBJICsgYW5nO1xyXG5cdFx0fWVsc2UgaWYgKHgyID4geDEgJiYgeTIgPiB5MSl7XHJcblx0XHRcdGFuZyA9IHRoaXMuUEkyIC0gYW5nO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRhbmcgPSAoYW5nICsgdGhpcy5QSTIpICUgdGhpcy5QSTI7XHJcblx0XHRcclxuXHRcdHJldHVybiBhbmc7XHJcblx0fVxyXG59O1xyXG4iLCJmdW5jdGlvbiBNYXRyaXgzKCl7XHJcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gOSkgdGhyb3cgXCJNYXRyaXggMyBtdXN0IHJlY2VpdmUgOSBwYXJhbWV0ZXJzXCI7XHJcblx0XHJcblx0dmFyIGMgPSAwO1xyXG5cdGZvciAodmFyIGk9MDtpPDk7aSs9Myl7XHJcblx0XHR0aGlzW2NdID0gYXJndW1lbnRzW2ldO1xyXG5cdFx0dGhpc1tjKzNdID0gYXJndW1lbnRzW2krMV07XHJcblx0XHR0aGlzW2MrNl0gPSBhcmd1bWVudHNbaSsyXTtcclxuXHRcdFxyXG5cdFx0YyArPSAxO1xyXG5cdH1cclxuXHRcclxuXHR0aGlzLl9fa3RtdDMgPSB0cnVlO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdHJpeDM7XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS5nZXREZXRlcm1pbmFudCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHZhciBkZXQgPSAoVFswXSAqIFRbNF0gKiBUWzhdKSArIChUWzFdICogVFs1XSAqIFRbNl0pICsgKFRbMl0gKiBUWzNdICogVFs3XSlcclxuXHRcdFx0LSAoVFs2XSAqIFRbNF0gKiBUWzJdKSAtIChUWzddICogVFs1XSAqIFRbMF0pIC0gKFRbOF0gKiBUWzNdICogVFsxXSk7XHJcblx0XHJcblx0cmV0dXJuIGRldDtcclxufTtcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLmludmVyc2UgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBkZXQgPSB0aGlzLmdldERldGVybWluYW50KCk7XHJcblx0aWYgKGRldCA9PSAwKSByZXR1cm4gbnVsbDtcclxuXHRcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0dmFyIGludiA9IG5ldyBNYXRyaXgzKFxyXG5cdFx0VFs0XSpUWzhdLVRbNV0qVFs3XSxcdFRbNV0qVFs2XS1UWzNdKlRbOF0sXHRUWzNdKlRbN10tVFs0XSpUWzZdLFxyXG5cdFx0VFsyXSpUWzddLVRbMV0qVFs4XSxcdFRbMF0qVFs4XS1UWzJdKlRbNl0sXHRUWzFdKlRbNl0tVFswXSpUWzddLFxyXG5cdFx0VFsxXSpUWzVdLVRbMl0qVFs0XSxcdFRbMl0qVFszXS1UWzBdKlRbNV0sXHRUWzBdKlRbNF0tVFsxXSpUWzNdXHJcblx0KTtcclxuXHRcclxuXHRpbnYubXVsdGlwbHkoMSAvIGRldCk7XHJcblx0dGhpcy5jb3B5KGludik7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uKG51bWJlcil7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdGZvciAodmFyIGk9MDtpPDk7aSsrKXtcclxuXHRcdFRbaV0gKj0gbnVtYmVyO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbihtYXRyaXgzKXtcclxuXHRpZiAoIW1hdHJpeDMuX19rdG10MykgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgbWF0cml4MyBpbnRvIGFub3RoZXJcIjtcclxuXHRcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0Zm9yICh2YXIgaT0wO2k8OTtpKyspe1xyXG5cdFx0VFtpXSA9IG1hdHJpeDNbaV07XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUudHJhbnNwb3NlID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0dmFyIHZhbHVlcyA9IFtcclxuXHRcdFRbMF0sIFRbM10sIFRbNl0sXHJcblx0XHRUWzFdLCBUWzRdLCBUWzddLFxyXG5cdFx0VFsyXSwgVFs1XSwgVFs4XVxyXG5cdF07XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8OTtpKyspe1xyXG5cdFx0VFtpXSA9IHZhbHVlc1tpXTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS50b0Zsb2F0MzJBcnJheSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFtcclxuXHRcdFRbMF0sIFRbMV0sIFRbMl0sXHJcblx0XHRUWzNdLCBUWzRdLCBUWzVdLFxyXG5cdFx0VFs2XSwgVFs3XSwgVFs4XVxyXG5cdF0pO1xyXG59O1xyXG4iLCJ2YXIgTWF0cml4MyA9IHJlcXVpcmUoJy4vS1RNYXRyaXgzJyk7XHJcblxyXG5mdW5jdGlvbiBNYXRyaXg0KCl7XHJcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMTYpIHRocm93IFwiTWF0cml4IDQgbXVzdCByZWNlaXZlIDE2IHBhcmFtZXRlcnNcIjtcclxuXHRcclxuXHR2YXIgYyA9IDA7XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSs9NCl7XHJcblx0XHR0aGlzW2NdID0gYXJndW1lbnRzW2ldO1xyXG5cdFx0dGhpc1tjKzRdID0gYXJndW1lbnRzW2krMV07XHJcblx0XHR0aGlzW2MrOF0gPSBhcmd1bWVudHNbaSsyXTtcclxuXHRcdHRoaXNbYysxMl0gPSBhcmd1bWVudHNbaSszXTtcclxuXHRcdFxyXG5cdFx0YyArPSAxO1xyXG5cdH1cclxuXHRcclxuXHR0aGlzLl9fa3RtNCA9IHRydWU7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0cml4NDtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLmlkZW50aXR5ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgcGFyYW1zID0gW1xyXG5cdFx0MSwgMCwgMCwgMCxcclxuXHRcdDAsIDEsIDAsIDAsXHJcblx0XHQwLCAwLCAxLCAwLFxyXG5cdFx0MCwgMCwgMCwgMVxyXG5cdF07XHJcblx0XHJcblx0dmFyIGMgPSAwO1xyXG5cdGZvciAodmFyIGk9MDtpPDE2O2krPTQpe1xyXG5cdFx0dGhpc1tjXSA9IHBhcmFtc1tpXTtcclxuXHRcdHRoaXNbYys0XSA9IHBhcmFtc1tpKzFdO1xyXG5cdFx0dGhpc1tjKzhdID0gcGFyYW1zW2krMl07XHJcblx0XHR0aGlzW2MrMTJdID0gcGFyYW1zW2krM107XHJcblx0XHRcclxuXHRcdGMgKz0gMTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5tdWx0aXBseVNjYWxhciA9IGZ1bmN0aW9uKG51bWJlcil7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdGZvciAodmFyIGk9MDtpPDE2O2krKyl7XHJcblx0XHRUW2ldICo9IG51bWJlcjtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uKG1hdHJpeDQpe1xyXG5cdGlmIChtYXRyaXg0Ll9fa3RtNCl7XHJcblx0XHR2YXIgQTEgPSBbdGhpc1swXSwgIHRoaXNbMV0sICB0aGlzWzJdLCAgdGhpc1szXV07XHJcblx0XHR2YXIgQTIgPSBbdGhpc1s0XSwgIHRoaXNbNV0sICB0aGlzWzZdLCAgdGhpc1s3XV07XHJcblx0XHR2YXIgQTMgPSBbdGhpc1s4XSwgIHRoaXNbOV0sICB0aGlzWzEwXSwgdGhpc1sxMV1dO1xyXG5cdFx0dmFyIEE0ID0gW3RoaXNbMTJdLCB0aGlzWzEzXSwgdGhpc1sxNF0sIHRoaXNbMTVdXTtcclxuXHRcdFxyXG5cdFx0dmFyIEIxID0gW21hdHJpeDRbMF0sIG1hdHJpeDRbNF0sIG1hdHJpeDRbOF0sICBtYXRyaXg0WzEyXV07XHJcblx0XHR2YXIgQjIgPSBbbWF0cml4NFsxXSwgbWF0cml4NFs1XSwgbWF0cml4NFs5XSwgIG1hdHJpeDRbMTNdXTtcclxuXHRcdHZhciBCMyA9IFttYXRyaXg0WzJdLCBtYXRyaXg0WzZdLCBtYXRyaXg0WzEwXSwgbWF0cml4NFsxNF1dO1xyXG5cdFx0dmFyIEI0ID0gW21hdHJpeDRbM10sIG1hdHJpeDRbN10sIG1hdHJpeDRbMTFdLCBtYXRyaXg0WzE1XV07XHJcblx0XHRcclxuXHRcdHZhciBkb3QgPSBmdW5jdGlvbihjb2wsIHJvdyl7XHJcblx0XHRcdHZhciBzdW0gPSAwO1xyXG5cdFx0XHRmb3IgKHZhciBqPTA7ajw0O2orKyl7IHN1bSArPSByb3dbal0gKiBjb2xbal07IH1cclxuXHRcdFx0cmV0dXJuIHN1bTtcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdHRoaXNbMF0gPSBkb3QoQTEsIEIxKTsgICB0aGlzWzFdID0gZG90KEExLCBCMik7ICAgdGhpc1syXSA9IGRvdChBMSwgQjMpOyAgIHRoaXNbM10gPSBkb3QoQTEsIEI0KTtcclxuXHRcdHRoaXNbNF0gPSBkb3QoQTIsIEIxKTsgICB0aGlzWzVdID0gZG90KEEyLCBCMik7ICAgdGhpc1s2XSA9IGRvdChBMiwgQjMpOyAgIHRoaXNbN10gPSBkb3QoQTIsIEI0KTtcclxuXHRcdHRoaXNbOF0gPSBkb3QoQTMsIEIxKTsgICB0aGlzWzldID0gZG90KEEzLCBCMik7ICAgdGhpc1sxMF0gPSBkb3QoQTMsIEIzKTsgIHRoaXNbMTFdID0gZG90KEEzLCBCNCk7XHJcblx0XHR0aGlzWzEyXSA9IGRvdChBNCwgQjEpOyAgdGhpc1sxM10gPSBkb3QoQTQsIEIyKTsgIHRoaXNbMTRdID0gZG90KEE0LCBCMyk7ICB0aGlzWzE1XSA9IGRvdChBNCwgQjQpO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9ZWxzZSBpZiAobWF0cml4NC5sZW5ndGggPT0gNCl7XHJcblx0XHR2YXIgcmV0ID0gW107XHJcblx0XHR2YXIgY29sID0gbWF0cml4NDtcclxuXHRcclxuXHRcdGZvciAodmFyIGk9MDtpPDQ7aSs9MSl7XHJcblx0XHRcdHZhciByb3cgPSBbdGhpc1tpXSwgdGhpc1tpKzRdLCB0aGlzW2krOF0sIHRoaXNbaSsxMl1dO1xyXG5cdFx0XHR2YXIgc3VtID0gMDtcclxuXHRcdFx0XHJcblx0XHRcdGZvciAodmFyIGo9MDtqPDQ7aisrKXtcclxuXHRcdFx0XHRzdW0gKz0gcm93W2pdICogY29sW2pdO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXQucHVzaChzdW0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gcmV0O1xyXG5cdH1lbHNle1xyXG5cdFx0dGhyb3cgXCJJbnZhbGlkIGNvbnN0cnVjdG9yXCI7XHJcblx0fVxyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUudHJhbnNwb3NlID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0dmFyIHZhbHVlcyA9IFtcclxuXHRcdFRbMF0sIFRbNF0sIFRbOF0sICBUWzEyXSxcclxuXHRcdFRbMV0sIFRbNV0sIFRbOV0sICBUWzEzXSxcclxuXHRcdFRbMl0sIFRbNl0sIFRbMTBdLCBUWzE0XSxcclxuXHRcdFRbM10sIFRbN10sIFRbMTFdLCBUWzE1XSxcclxuXHRdO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPDE2O2krKyl7XHJcblx0XHR0aGlzW2ldID0gdmFsdWVzW2ldO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbihtYXRyaXg0KXtcclxuXHRpZiAoIW1hdHJpeDQuX19rdG00KSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSBNYXRyaXg0IGludG8gdGhpcyBtYXRyaXhcIjtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKyspe1xyXG5cdFx0dGhpc1tpXSA9IG1hdHJpeDRbaV07XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHRUWzBdLCBUWzRdLCBUWzhdLCAgVFsxMl0sXHJcblx0XHRUWzFdLCBUWzVdLCBUWzldLCAgVFsxM10sXHJcblx0XHRUWzJdLCBUWzZdLCBUWzEwXSwgVFsxNF0sXHJcblx0XHRUWzNdLCBUWzddLCBUWzExXSwgVFsxNV1cclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUudG9GbG9hdDMyQXJyYXkgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbXHJcblx0XHRUWzBdLCBUWzFdLCBUWzJdLCAgVFszXSxcclxuXHRcdFRbNF0sIFRbNV0sIFRbNl0sICBUWzddLFxyXG5cdFx0VFs4XSwgVFs5XSwgVFsxMF0sIFRbMTFdLFxyXG5cdFx0VFsxMl0sIFRbMTNdLCBUWzE0XSwgVFsxNV1cclxuXHRdKTtcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLnRvTWF0cml4MyA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHJldHVybiBuZXcgTWF0cml4MyhcclxuXHRcdFRbMF0sIFRbMV0sIFRbMl0sXHJcblx0XHRUWzRdLCBUWzVdLCBUWzZdLFxyXG5cdFx0VFs4XSwgVFs5XSwgVFsxMF1cclxuXHQpOyBcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0SWRlbnRpdHkgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdDEsIDAsIDAsIDAsXHJcblx0XHQwLCAxLCAwLCAwLFxyXG5cdFx0MCwgMCwgMSwgMCxcclxuXHRcdDAsIDAsIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRYUm90YXRpb24gPSBmdW5jdGlvbihyYWRpYW5zKXtcclxuXHR2YXIgQyA9IE1hdGguY29zKHJhZGlhbnMpO1xyXG5cdHZhciBTID0gTWF0aC5zaW4ocmFkaWFucyk7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0MSwgIDAsICAwLCAwLFxyXG5cdFx0MCwgIEMsICBTLCAwLFxyXG5cdFx0MCwgLVMsICBDLCAwLFxyXG5cdFx0MCwgIDAsICAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0WVJvdGF0aW9uID0gZnVuY3Rpb24ocmFkaWFucyl7XHJcblx0dmFyIEMgPSBNYXRoLmNvcyhyYWRpYW5zKTtcclxuXHR2YXIgUyA9IE1hdGguc2luKHJhZGlhbnMpO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdCBDLCAgMCwgIFMsIDAsXHJcblx0XHQgMCwgIDEsICAwLCAwLFxyXG5cdFx0LVMsICAwLCAgQywgMCxcclxuXHRcdCAwLCAgMCwgIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRaUm90YXRpb24gPSBmdW5jdGlvbihyYWRpYW5zKXtcclxuXHR2YXIgQyA9IE1hdGguY29zKHJhZGlhbnMpO1xyXG5cdHZhciBTID0gTWF0aC5zaW4ocmFkaWFucyk7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0IEMsICBTLCAwLCAwLFxyXG5cdFx0LVMsICBDLCAwLCAwLFxyXG5cdFx0IDAsICAwLCAxLCAwLFxyXG5cdFx0IDAsICAwLCAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0VHJhbnNsYXRpb24gPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IHRyYW5zbGF0ZSB0byBhIHZlY3RvciAzXCI7XHJcblx0XHJcblx0dmFyIHggPSB2ZWN0b3IzLng7XHJcblx0dmFyIHkgPSB2ZWN0b3IzLnk7XHJcblx0dmFyIHogPSB2ZWN0b3IzLno7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0MSwgMCwgMCwgeCxcclxuXHRcdDAsIDEsIDAsIHksXHJcblx0XHQwLCAwLCAxLCB6LFxyXG5cdFx0MCwgMCwgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFNjYWxlID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBzY2FsZSB0byBhIHZlY3RvciAzXCI7XHJcblx0XHJcblx0dmFyIHN4ID0gdmVjdG9yMy54O1xyXG5cdHZhciBzeSA9IHZlY3RvcjMueTtcclxuXHR2YXIgc3ogPSB2ZWN0b3IzLno7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0c3gsICAwLCAgMCwgMCxcclxuXHRcdCAwLCBzeSwgIDAsIDAsXHJcblx0XHQgMCwgIDAsIHN6LCAwLFxyXG5cdFx0IDAsICAwLCAgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFRyYW5zZm9ybWF0aW9uID0gZnVuY3Rpb24ocG9zaXRpb24sIHJvdGF0aW9uLCBzY2FsZSwgc3RhY2spe1xyXG5cdGlmICghcG9zaXRpb24uX19rdHYzKSB0aHJvdyBcIlBvc2l0aW9uIG11c3QgYmUgYSBWZWN0b3IzXCI7XHJcblx0aWYgKCFyb3RhdGlvbi5fX2t0djMpIHRocm93IFwiUm90YXRpb24gbXVzdCBiZSBhIFZlY3RvcjNcIjtcclxuXHRpZiAoc2NhbGUgJiYgIXNjYWxlLl9fa3R2MykgdGhyb3cgXCJTY2FsZSBtdXN0IGJlIGEgVmVjdG9yM1wiO1xyXG5cdGlmICghc3RhY2spIHN0YWNrID0gJ1NSeFJ5UnpUJztcclxuXHRcclxuXHR2YXIgc3MgPSAoc3RhY2suaW5kZXhPZihcIlNcIikgIT0gLTEpO1xyXG5cdHZhciByeCA9IChzdGFjay5pbmRleE9mKFwiUnhcIikgIT0gLTEpO1xyXG5cdHZhciByeSA9IChzdGFjay5pbmRleE9mKFwiUnlcIikgIT0gLTEpO1xyXG5cdHZhciByeiA9IChzdGFjay5pbmRleE9mKFwiUnpcIikgIT0gLTEpO1xyXG5cdHZhciB0dCA9IChzdGFjay5pbmRleE9mKFwiVFwiKSAhPSAtMSk7XHJcblx0XHJcblx0dmFyIHNjYWxlID0gKHNjYWxlICYmIHNzKT8gTWF0cml4NC5nZXRTY2FsZShzY2FsZSkgOiBNYXRyaXg0LmdldElkZW50aXR5KCk7XHJcblx0XHJcblx0dmFyIHJvdGF0aW9uWCA9IE1hdHJpeDQuZ2V0WFJvdGF0aW9uKHJvdGF0aW9uLngpO1xyXG5cdHZhciByb3RhdGlvblkgPSBNYXRyaXg0LmdldFlSb3RhdGlvbihyb3RhdGlvbi55KTtcclxuXHR2YXIgcm90YXRpb25aID0gTWF0cml4NC5nZXRaUm90YXRpb24ocm90YXRpb24ueik7XHJcblx0XHJcblx0dmFyIHRyYW5zbGF0aW9uID0gTWF0cml4NC5nZXRUcmFuc2xhdGlvbihwb3NpdGlvbik7XHJcblx0XHJcblx0dmFyIG1hdHJpeDtcclxuXHRtYXRyaXggPSBzY2FsZTtcclxuXHRpZiAocngpIG1hdHJpeC5tdWx0aXBseShyb3RhdGlvblgpO1xyXG5cdGlmIChyeSkgbWF0cml4Lm11bHRpcGx5KHJvdGF0aW9uWSk7XHJcblx0aWYgKHJ6KSBtYXRyaXgubXVsdGlwbHkocm90YXRpb25aKTtcclxuXHRpZiAodHQpIG1hdHJpeC5tdWx0aXBseSh0cmFuc2xhdGlvbik7XHJcblx0XHJcblx0cmV0dXJuIG1hdHJpeDtcclxufTtcclxuIiwidmFyIE1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG52YXIgVmVjdG9yMyA9IHJlcXVpcmUoJy4vS1RWZWN0b3IzJyk7XHJcblxyXG5mdW5jdGlvbiBNZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCl7XHJcblx0aWYgKCFnZW9tZXRyeS5fX2t0Z2VvbWV0cnkpIHRocm93IFwiR2VvbWV0cnkgbXVzdCBiZSBhIEtUR2VvbWV0cnkgaW5zdGFuY2VcIjtcclxuXHRpZiAoIW1hdGVyaWFsLl9fa3RtYXRlcmlhbCkgdGhyb3cgXCJNYXRlcmlhbCBtdXN0IGJlIGEgS1RNYXRlcmlhbCBpbnN0YW5jZVwiO1xyXG5cdFxyXG5cdHRoaXMuX19rdG1lc2ggPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMuZ2VvbWV0cnkgPSBnZW9tZXRyeTtcclxuXHR0aGlzLm1hdGVyaWFsID0gbWF0ZXJpYWw7XHJcblx0XHJcblx0dGhpcy5wYXJlbnQgPSBudWxsO1xyXG5cdHRoaXMudmlzaWJsZSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5jYXN0U2hhZG93ID0gZmFsc2U7XHJcblx0dGhpcy5yZWNlaXZlU2hhZG93ID0gZmFsc2U7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IG5ldyBWZWN0b3IzKDAsIDAsIDApO1xyXG5cdHRoaXMucm90YXRpb24gPSBuZXcgVmVjdG9yMygwLCAwLCAwKTtcclxuXHR0aGlzLnNjYWxlID0gbmV3IFZlY3RvcjMoMSwgMSwgMSk7XHJcblx0XHJcblx0dGhpcy5wcmV2aW91c1Bvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5jbG9uZSgpO1xyXG5cdHRoaXMucHJldmlvdXNSb3RhdGlvbiA9IHRoaXMucm90YXRpb24uY2xvbmUoKTtcclxuXHR0aGlzLnByZXZpb3VzU2NhbGUgPSB0aGlzLnNjYWxlLmNsb25lKCk7XHJcblx0XHJcblx0dGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG51bGw7XHJcblx0dGhpcy50cmFuc2Zvcm1hdGlvblN0YWNrID0gJ1NSeFJ5UnpUJztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXNoO1xyXG5cclxuTWVzaC5wcm90b3R5cGUuZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXggPSBmdW5jdGlvbigpe1xyXG5cdGlmICghdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCB8fCAhdGhpcy5wb3NpdGlvbi5lcXVhbHModGhpcy5wcmV2aW91c1Bvc2l0aW9uKSB8fCAhdGhpcy5yb3RhdGlvbi5lcXVhbHModGhpcy5wcmV2aW91c1JvdGF0aW9uKSB8fCAhdGhpcy5zY2FsZS5lcXVhbHModGhpcy5wcmV2aW91c1NjYWxlKSl7XHJcblx0XHR0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gTWF0cml4NC5nZXRUcmFuc2Zvcm1hdGlvbih0aGlzLnBvc2l0aW9uLCB0aGlzLnJvdGF0aW9uLCB0aGlzLnNjYWxlLCB0aGlzLnRyYW5zZm9ybWF0aW9uU3RhY2spO1xyXG5cdFx0XHJcblx0XHR0aGlzLnByZXZpb3VzUG9zaXRpb24uY29weSh0aGlzLnBvc2l0aW9uKTtcclxuXHRcdHRoaXMucHJldmlvdXNSb3RhdGlvbi5jb3B5KHRoaXMucm90YXRpb24pO1xyXG5cdFx0dGhpcy5wcmV2aW91c1NjYWxlLmNvcHkodGhpcy5zY2FsZSk7XHJcblx0XHRcclxuXHRcdGlmICh0aGlzLnBhcmVudCl7XHJcblx0XHRcdHZhciBtID0gdGhpcy5wYXJlbnQuZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuXHRcdFx0dGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5tdWx0aXBseShtKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguY2xvbmUoKTtcclxufTtcclxuIiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBHZW9tZXRyeUdVSVRleHR1cmUgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnlHVUlUZXh0dXJlJyk7XHJcbnZhciBUZXh0dXJlID0gcmVxdWlyZSgnLi9LVFRleHR1cmUnKTtcclxudmFyIE1hdGVyaWFsQmFzaWMgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWxCYXNpYycpO1xyXG52YXIgVmVjdG9yMyA9IHJlcXVpcmUoJy4vS1RWZWN0b3IzJyk7XHJcbnZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxuXHJcbmZ1bmN0aW9uIE1lc2hTcHJpdGUod2lkdGgsIGhlaWdodCwgdGV4dHVyZVNyYyl7XHJcblx0dGhpcy5fX2t0bWVzaCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy50ZXh0dXJlID0gbnVsbDtcclxuXHRpZiAodGV4dHVyZVNyYyl7XHJcblx0XHRpZiAodGV4dHVyZVNyYy5fX2t0dGV4dHVyZSB8fCB0ZXh0dXJlU3JjLl9fa3R0ZXh0dXJlZnJhbWVidWZmZXIpXHJcblx0XHRcdHRoaXMudGV4dHVyZSA9IHRleHR1cmVTcmM7XHJcblx0XHRlbHNlXHJcblx0XHRcdHRoaXMudGV4dHVyZSA9IG5ldyBUZXh0dXJlKHRleHR1cmVTcmMpO1xyXG5cdH1cclxuXHRcclxuXHR0aGlzLmdlb21ldHJ5ID0gbmV3IEdlb21ldHJ5R1VJVGV4dHVyZSh3aWR0aCwgaGVpZ2h0KTtcclxuXHR0aGlzLm1hdGVyaWFsID0gbmV3IE1hdGVyaWFsQmFzaWModGhpcy50ZXh0dXJlLCBcIiNGRkZGRkZcIik7XHJcblx0dGhpcy5tYXRlcmlhbC50cmFuc3BhcmVudCA9IHRydWU7XHJcblx0XHRcclxuXHR0aGlzLnBhcmVudCA9IG51bGw7XHJcblx0dGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLmNhc3RTaGFkb3cgPSBmYWxzZTtcclxuXHR0aGlzLnJlY2VpdmVTaGFkb3cgPSBmYWxzZTtcclxuXHRcclxuXHR0aGlzLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMC4wLCAwLjAsIDAuMCk7XHJcblx0dGhpcy5yb3RhdGlvbiA9IG5ldyBWZWN0b3IzKDAuMCwgMC4wLCAwLjApO1xyXG5cdHRoaXMuc2NhbGUgPSBuZXcgVmVjdG9yMygxLjAsIDEuMCwgMS4wKTtcclxuXHRcclxuXHR0aGlzLnByZXZpb3VzUG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmNsb25lKCk7XHJcblx0dGhpcy5wcmV2aW91c1JvdGF0aW9uID0gdGhpcy5yb3RhdGlvbi5jbG9uZSgpO1xyXG5cdHRoaXMucHJldmlvdXNTY2FsZSA9IHRoaXMuc2NhbGUuY2xvbmUoKTtcclxuXHRcclxuXHR0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbnVsbDtcclxuXHR0aGlzLnRyYW5zZm9ybWF0aW9uU3RhY2sgPSAnU1J6VCc7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVzaFNwcml0ZTtcclxuXHJcbk1lc2hTcHJpdGUucHJvdG90eXBlLmdldFRyYW5zZm9ybWF0aW9uTWF0cml4ID0gZnVuY3Rpb24oKXtcclxuXHRpZiAoIXRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggfHwgIXRoaXMucG9zaXRpb24uZXF1YWxzKHRoaXMucHJldmlvdXNQb3NpdGlvbikgfHwgIXRoaXMucm90YXRpb24uZXF1YWxzKHRoaXMucHJldmlvdXNSb3RhdGlvbikgfHwgIXRoaXMuc2NhbGUuZXF1YWxzKHRoaXMucHJldmlvdXNTY2FsZSkpe1xyXG5cdFx0dGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IE1hdHJpeDQuZ2V0VHJhbnNmb3JtYXRpb24odGhpcy5wb3NpdGlvbiwgdGhpcy5yb3RhdGlvbiwgdGhpcy5zY2FsZSwgdGhpcy50cmFuc2Zvcm1hdGlvblN0YWNrKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5wcmV2aW91c1Bvc2l0aW9uLmNvcHkodGhpcy5wb3NpdGlvbik7XHJcblx0XHR0aGlzLnByZXZpb3VzUm90YXRpb24uY29weSh0aGlzLnJvdGF0aW9uKTtcclxuXHRcdHRoaXMucHJldmlvdXNTY2FsZS5jb3B5KHRoaXMuc2NhbGUpO1xyXG5cdFx0XHJcblx0XHRpZiAodGhpcy5wYXJlbnQpe1xyXG5cdFx0XHR2YXIgbSA9IHRoaXMucGFyZW50LmdldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblx0XHRcdHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgubXVsdGlwbHkobSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmNsb25lKCk7XHJcbn07IiwidmFyIFZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG52YXIgVmVjdG9yMyA9IHJlcXVpcmUoJy4vS1RWZWN0b3IzJyk7XHJcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4vS1RJbnB1dCcpO1xyXG52YXIgS1RNYXRoID0gcmVxdWlyZSgnLi9LVE1hdGgnKTtcclxuXHJcbmZ1bmN0aW9uIE9yYml0QW5kUGFuKHRhcmdldCl7XHJcblx0dGhpcy5fX2t0Q2FtQ3RybHMgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMuY2FtZXJhID0gbnVsbDtcclxuXHR0aGlzLmxhc3REcmFnID0gbnVsbDtcclxuXHR0aGlzLmxhc3RQYW4gPSBudWxsO1xyXG5cdHRoaXMudGFyZ2V0ID0gKHRhcmdldCk/IHRhcmdldCA6IG5ldyBWZWN0b3IzKDAuMCwgMC4wLCAwLjApO1xyXG5cdHRoaXMuYW5nbGUgPSBuZXcgVmVjdG9yMigwLjAsIDAuMCk7XHJcblx0dGhpcy56b29tID0gMTtcclxuXHR0aGlzLnNlbnNpdGl2aXR5ID0gbmV3IFZlY3RvcjIoMC41LCAwLjUpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE9yYml0QW5kUGFuO1xyXG5cclxuT3JiaXRBbmRQYW4ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0aWYgKHRoaXMuY2FtZXJhLmxvY2tlZCkgcmV0dXJuO1xyXG5cdFxyXG5cdGlmIChJbnB1dC5pc1doZWVsTW92ZWQoSW5wdXQudk1vdXNlLldIRUVMVVApKXsgdGhpcy56b29tIC09IDAuMzsgdGhpcy5zZXRDYW1lcmFQb3NpdGlvbigpOyB9XHJcblx0ZWxzZSBpZiAoSW5wdXQuaXNXaGVlbE1vdmVkKElucHV0LnZNb3VzZS5XSEVFTERPV04pKXsgdGhpcy56b29tICs9IDAuMzsgdGhpcy5zZXRDYW1lcmFQb3NpdGlvbigpOyB9XHJcblx0XHJcblx0aWYgKElucHV0LmlzTW91c2VEb3duKElucHV0LnZNb3VzZS5MRUZUKSl7XHJcblx0XHRpZiAodGhpcy5sYXN0RHJhZyA9PSBudWxsKSB0aGlzLmxhc3REcmFnID0gSW5wdXQuX21vdXNlLnBvc2l0aW9uLmNsb25lKCk7XHJcblx0XHRcclxuXHRcdHZhciBkeCA9IElucHV0Ll9tb3VzZS5wb3NpdGlvbi54IC0gdGhpcy5sYXN0RHJhZy54O1xyXG5cdFx0dmFyIGR5ID0gSW5wdXQuX21vdXNlLnBvc2l0aW9uLnkgLSB0aGlzLmxhc3REcmFnLnk7XHJcblx0XHRcclxuXHRcdGlmIChkeCAhPSAwLjAgfHwgZHkgIT0gMC4wKXtcclxuXHRcdFx0dGhpcy5hbmdsZS54IC09IEtUTWF0aC5kZWdUb1JhZChkeCAqIHRoaXMuc2Vuc2l0aXZpdHkueCk7XHJcblx0XHRcdHRoaXMuYW5nbGUueSAtPSBLVE1hdGguZGVnVG9SYWQoZHkgKiB0aGlzLnNlbnNpdGl2aXR5LnkpO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5zZXRDYW1lcmFQb3NpdGlvbigpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLmxhc3REcmFnLmNvcHkoSW5wdXQuX21vdXNlLnBvc2l0aW9uKTtcclxuXHR9ZWxzZXtcclxuXHRcdHRoaXMubGFzdERyYWcgPSBudWxsO1xyXG5cdH1cclxuXHRcclxuXHRpZiAoSW5wdXQuaXNNb3VzZURvd24oSW5wdXQudk1vdXNlLlJJR0hUKSl7XHJcblx0XHRpZiAodGhpcy5sYXN0UGFuID09IG51bGwpIHRoaXMubGFzdFBhbiA9IElucHV0Ll9tb3VzZS5wb3NpdGlvbi5jbG9uZSgpO1xyXG5cdFx0XHJcblx0XHR2YXIgZHggPSBJbnB1dC5fbW91c2UucG9zaXRpb24ueCAtIHRoaXMubGFzdFBhbi54O1xyXG5cdFx0dmFyIGR5ID0gSW5wdXQuX21vdXNlLnBvc2l0aW9uLnkgLSB0aGlzLmxhc3RQYW4ueTtcclxuXHRcdFxyXG5cdFx0aWYgKGR4ICE9IDAuMCB8fCBkeSAhPSAwLjApe1xyXG5cdFx0XHR2YXIgdGhldGEgPSAtdGhpcy5hbmdsZS55O1xyXG5cdFx0XHR2YXIgYW5nID0gLXRoaXMuYW5nbGUueCAtIEtUTWF0aC5QSV8yO1xyXG5cdFx0XHR2YXIgY29zID0gTWF0aC5jb3MoYW5nKTtcclxuXHRcdFx0dmFyIHNpbiA9IE1hdGguc2luKGFuZyk7XHJcblx0XHRcdHZhciBjb3NUID0gTWF0aC5jb3ModGhldGEpO1xyXG5cdFx0XHR2YXIgc2luVCA9IE1hdGguc2luKHRoZXRhKTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMudGFyZ2V0LnggLT0gY29zICogZHggKiB0aGlzLnNlbnNpdGl2aXR5LnggLyAxMDtcclxuXHRcdFx0dGhpcy50YXJnZXQueSArPSBjb3NUICogZHkgKiB0aGlzLnNlbnNpdGl2aXR5LnkgLyAxMDtcclxuXHRcdFx0dGhpcy50YXJnZXQueiAtPSBzaW4gKiBkeCAqIHRoaXMuc2Vuc2l0aXZpdHkueCAvIDEwO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5zZXRDYW1lcmFQb3NpdGlvbigpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLmxhc3RQYW4uY29weShJbnB1dC5fbW91c2UucG9zaXRpb24pO1xyXG5cdH1lbHNle1xyXG5cdFx0dGhpcy5sYXN0UGFuID0gbnVsbDtcclxuXHR9XHJcbn07XHJcblxyXG5PcmJpdEFuZFBhbi5wcm90b3R5cGUuc2V0Q2FtZXJhUG9zaXRpb24gPSBmdW5jdGlvbigpe1xyXG5cdHRoaXMuYW5nbGUueCA9ICh0aGlzLmFuZ2xlLnggKyBLVE1hdGguUEkyKSAlIEtUTWF0aC5QSTI7XHJcblx0dGhpcy5hbmdsZS55ID0gKHRoaXMuYW5nbGUueSArIEtUTWF0aC5QSTIpICUgS1RNYXRoLlBJMjtcclxuXHRcclxuXHRpZiAodGhpcy5hbmdsZS55IDwgS1RNYXRoLlBJICYmIHRoaXMuYW5nbGUueSA+PSBLVE1hdGguUElfMikgdGhpcy5hbmdsZS55ID0gS1RNYXRoLmRlZ1RvUmFkKDg5LjkpO1xyXG5cdGlmICh0aGlzLmFuZ2xlLnkgPiBLVE1hdGguUEkgJiYgdGhpcy5hbmdsZS55IDw9IEtUTWF0aC5QSTNfMikgdGhpcy5hbmdsZS55ID0gS1RNYXRoLmRlZ1RvUmFkKDI3MC45KTtcclxuXHRpZiAodGhpcy56b29tIDw9IDAuMykgdGhpcy56b29tID0gMC4zO1xyXG5cdFxyXG5cdHZhciBjb3NUID0gTWF0aC5jb3ModGhpcy5hbmdsZS55KTtcclxuXHR2YXIgc2luVCA9IE1hdGguc2luKHRoaXMuYW5nbGUueSk7XHJcblx0XHJcblx0dmFyIHggPSB0aGlzLnRhcmdldC54ICsgTWF0aC5jb3ModGhpcy5hbmdsZS54KSAqIGNvc1QgKiB0aGlzLnpvb207XHJcblx0dmFyIHkgPSB0aGlzLnRhcmdldC55ICsgc2luVCAqIHRoaXMuem9vbTtcclxuXHR2YXIgeiA9IHRoaXMudGFyZ2V0LnogLSBNYXRoLnNpbih0aGlzLmFuZ2xlLngpICogY29zVCAqIHRoaXMuem9vbTtcclxuXHRcclxuXHR0aGlzLmNhbWVyYS5wb3NpdGlvbi5zZXQoeCwgeSwgeik7XHJcblx0dGhpcy5jYW1lcmEubG9va0F0KHRoaXMudGFyZ2V0KTtcclxufTtcclxuIiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxudmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBNYXRlcmlhbCA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbCcpO1xyXG52YXIgTWF0ZXJpYWxCYXNpYyA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbEJhc2ljJyk7XHJcblxyXG5mdW5jdGlvbiBTY2VuZShwYXJhbXMpe1xyXG5cdHRoaXMuX19rdHNjZW5lID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLm1lc2hlcyA9IFtdO1xyXG5cdHRoaXMubGlnaHRzID0gW107XHJcblx0dGhpcy5zaGFkaW5nTW9kZSA9IFsnQkFTSUMnLCAnTEFNQkVSVCddO1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnVzZUxpZ2h0aW5nID0gKHBhcmFtcy51c2VMaWdodGluZyk/IHRydWUgOiBmYWxzZTtcclxuXHR0aGlzLmFtYmllbnRMaWdodCA9IChwYXJhbXMuYW1iaWVudExpZ2h0KT8gbmV3IENvbG9yKHBhcmFtcy5hbWJpZW50TGlnaHQpIDogbnVsbDtcclxuXHRcclxuXHR0aGlzLnNldFNoYWRvd01hdGVyaWFsKCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NlbmU7XHJcblxyXG5TY2VuZS5wcm90b3R5cGUuc2V0U2hhZG93TWF0ZXJpYWwgPSBmdW5jdGlvbigpe1xyXG5cdHRoaXMuc2hhZG93TWFwcGluZyA9IGZhbHNlO1xyXG5cdHRoaXMuc2hhZG93TWF0ID0gbmV3IE1hdGVyaWFsKHtcclxuXHRcdHNoYWRlcjogS1Quc2hhZGVycy5kZXB0aCxcclxuXHRcdHNlbmRBdHRyaWJEYXRhOiBmdW5jdGlvbihtZXNoLCBjYW1lcmEsIHNjZW5lKXtcclxuXHRcdFx0dmFyIGdsID0gS1QuZ2w7XHJcblx0XHRcdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuXHRcdFx0Zm9yICh2YXIgaT0wLGxlbj1hdHRyaWJ1dGVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0XHRcdHZhciBhdHQgPSBhdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhQb3NpdGlvblwiKXtcclxuXHRcdFx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIpO1xyXG5cdFx0XHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LnZlcnRleEJ1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRzZW5kVW5pZm9ybURhdGE6IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdFx0XHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcdFx0dmFyIHVuaWZvcm1zID0gdGhpcy5zaGFkZXIudW5pZm9ybXM7XHJcblx0XHRcdGZvciAodmFyIGk9MCxsZW49dW5pZm9ybXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHRcdFx0dmFyIHVuaSA9IHVuaWZvcm1zW2ldO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmICh1bmkubmFtZSA9PSAndU1WUE1hdHJpeCcpe1xyXG5cdFx0XHRcdFx0dmFyIG12cCA9IG1lc2guZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKS5tdWx0aXBseShjYW1lcmEudHJhbnNmb3JtYXRpb25NYXRyaXgpLm11bHRpcGx5KGNhbWVyYS5wZXJzcGVjdGl2ZU1hdHJpeCk7XHJcblx0XHRcdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG12cC50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxufTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihvYmplY3Qpe1xyXG5cdGlmIChvYmplY3QuX19rdG1lc2gpe1xyXG5cdFx0dGhpcy5tZXNoZXMucHVzaChvYmplY3QpO1xyXG5cdH1lbHNlIGlmIChvYmplY3QuX19rdGRpckxpZ2h0IHx8IG9iamVjdC5fX2t0cG9pbnRsaWdodCB8fCBvYmplY3QuX19rdHNwb3RsaWdodCl7XHJcblx0XHR0aGlzLmxpZ2h0cy5wdXNoKG9iamVjdCk7XHJcblx0fWVsc2V7XHJcblx0XHR0aHJvdyBcIkNhbid0IGFkZCB0aGUgb2JqZWN0IHRvIHRoZSBzY2VuZVwiO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5kcmF3TWVzaCA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSl7XHJcblx0aWYgKCFtZXNoLmdlb21ldHJ5LnJlYWR5KSByZXR1cm47XHJcblx0aWYgKHRoaXMuc2hhZG93TWFwcGluZyAmJiAhbWVzaC5jYXN0U2hhZG93KSByZXR1cm47XHJcblx0XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0XHJcblx0dmFyIG1hdGVyaWFsID0gKHRoaXMuc2hhZG93TWFwcGluZyk/IHRoaXMuc2hhZG93TWF0IDogbWVzaC5tYXRlcmlhbDtcclxuXHR2YXIgc2hhZGVyID0gbWF0ZXJpYWwuc2hhZGVyO1xyXG5cdFxyXG5cdEtULnN3aXRjaFByb2dyYW0oc2hhZGVyKTtcclxuXHR0aGlzLnNldE1hdGVyaWFsQXR0cmlidXRlcyhtZXNoLm1hdGVyaWFsKTtcclxuXHRcclxuXHRtYXRlcmlhbC5zZW5kQXR0cmliRGF0YShtZXNoLCBjYW1lcmEsIHRoaXMpO1xyXG5cdG1hdGVyaWFsLnNlbmRVbmlmb3JtRGF0YShtZXNoLCBjYW1lcmEsIHRoaXMpO1xyXG5cdFxyXG5cdGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG1lc2guZ2VvbWV0cnkuZmFjZXNCdWZmZXIpO1xyXG5cdGdsLmRyYXdFbGVtZW50cyhnbFttYXRlcmlhbC5kcmF3QXNdLCBtZXNoLmdlb21ldHJ5LmZhY2VzQnVmZmVyLm51bUl0ZW1zLCBnbC5VTlNJR05FRF9TSE9SVCwgMCk7XHJcbn07XHJcblxyXG5TY2VuZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpe1xyXG5cdEtULmdsLmNsZWFyKEtULmdsLkNPTE9SX0JVRkZFUl9CSVQgfCBLVC5nbC5ERVBUSF9CVUZGRVJfQklUKTtcclxufTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5yZW5kZXJUb0ZyYW1lYnVmZmVyID0gZnVuY3Rpb24oY2FtZXJhLCBmcmFtZWJ1ZmZlcil7XHJcblx0aWYgKCFmcmFtZWJ1ZmZlci5fX2t0dGV4dHVyZWZyYW1lYnVmZmVyKSB0aHJvdyBcImZyYW1lYnVmZmVyIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgVGV4dHVyZUZyYW1lYnVmZmVyXCI7XHJcblx0XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmcmFtZWJ1ZmZlci5mcmFtZWJ1ZmZlcik7XHJcblx0Z2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xyXG5cdHRoaXMucmVuZGVyKGNhbWVyYSk7XHJcblx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcclxufTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihjYW1lcmEsIHNjZW5lKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHRcclxuXHRpZiAoIXRoaXMuc2hhZG93TWFwcGluZyl7XHJcblx0XHRmb3IgKHZhciBpPTAsbGVuPXRoaXMubGlnaHRzLmxlbmd0aC0xO2k8PWxlbjtpKyspe1xyXG5cdFx0XHRpZiAodGhpcy5saWdodHNbaV0uY2FzdFNoYWRvdyl7XHJcblx0XHRcdFx0dGhpcy5zaGFkb3dNYXBwaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLnJlbmRlclRvRnJhbWVidWZmZXIodGhpcy5saWdodHNbaV0uc2hhZG93Q2FtLCB0aGlzLmxpZ2h0c1tpXS5zaGFkb3dCdWZmZXIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoaSA9PSBsZW4pe1xyXG5cdFx0XHRcdHRoaXMuc2hhZG93TWFwcGluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmIChjYW1lcmEuY29udHJvbHMpIGNhbWVyYS5jb250cm9scy51cGRhdGUoKTtcclxuXHRcclxuXHRcdGlmIChjYW1lcmEuc2t5Ym94KXtcclxuXHRcdFx0dmFyIHNreSA9IGNhbWVyYS5za3lib3gubWVzaGVzO1xyXG5cdFx0XHRmb3IgKHZhciBpPTAsbGVuPXNreS5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdFx0XHR0aGlzLmRyYXdNZXNoKHNreVtpXSwgY2FtZXJhKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRnbC5kaXNhYmxlKCBnbC5CTEVORCApOyBcclxuXHR2YXIgdHJhbnNwYXJlbnRzID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLm1lc2hlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBtZXNoID0gdGhpcy5tZXNoZXNbaV07XHJcblx0XHRpZiAoIW1lc2gudmlzaWJsZSkgY29udGludWU7XHJcblx0XHRpZiAobWVzaC5tYXRlcmlhbC5vcGFjaXR5ID09IDAuMCkgY29udGludWU7XHJcblx0XHRcclxuXHRcdGlmIChtZXNoLm1hdGVyaWFsLm9wYWNpdHkgIT0gMS4wIHx8IG1lc2gubWF0ZXJpYWwudHJhbnNwYXJlbnQpe1xyXG5cdFx0XHR0cmFuc3BhcmVudHMucHVzaChtZXNoKTtcclxuXHRcdFx0Y29udGludWU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuZHJhd01lc2gobWVzaCwgY2FtZXJhKTtcclxuXHR9XHJcblx0XHJcblx0Z2wuZW5hYmxlKCBnbC5CTEVORCApOyBcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRyYW5zcGFyZW50cy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBtZXNoID0gdHJhbnNwYXJlbnRzW2ldO1xyXG5cdFx0dGhpcy5kcmF3TWVzaChtZXNoLCBjYW1lcmEpO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblxuU2NlbmUucHJvdG90eXBlLnNldE1hdGVyaWFsQXR0cmlidXRlcyA9IGZ1bmN0aW9uKG1hdGVyaWFsKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHR2YXIgY3VsbCA9IFwiQkFDS1wiO1xyXG5cdGlmIChtYXRlcmlhbC5kcmF3RmFjZXMgPT0gJ0JBQ0snKXsgY3VsbCA9IFwiRlJPTlRcIjsgfVxyXG5cdGVsc2UgaWYgKG1hdGVyaWFsLmRyYXdGYWNlcyA9PSAnQk9USCcpeyBjdWxsID0gXCJcIjsgfVxyXG5cdFxyXG5cdGlmIChjdWxsICE9IFwiXCIpe1xyXG5cdFx0Z2wuZW5hYmxlKGdsLkNVTExfRkFDRSk7XHJcblx0XHRnbC5jdWxsRmFjZShnbFtjdWxsXSk7XHJcblx0fWVsc2V7XHJcblx0XHRnbC5kaXNhYmxlKGdsLkNVTExfRkFDRSk7XHJcblx0fVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRiYXNpYzoge1xyXG5cdFx0dmVydGV4U2hhZGVyOiBcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMyIGFUZXh0dXJlQ29vcmQ7IFwiICtcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBsb3dwIHZlYzQgYVZlcnRleENvbG9yOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVNVlBNYXRyaXg7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjNCB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMiB2VGV4dHVyZUNvb3JkO1wiICsgIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICsgXHJcblx0XHRcdFx0XCJnbF9Qb3NpdGlvbiA9IHVNVlBNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XHRcInZWZXJ0ZXhDb2xvciA9IGFWZXJ0ZXhDb2xvciAqIHVNYXRlcmlhbENvbG9yOyBcIiArXHJcblx0XHRcdFx0XCJ2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDsgXCIgKyBcclxuXHRcdFx0XCJ9IFwiICxcclxuXHRcdFx0XHJcblx0XHRmcmFnbWVudFNoYWRlcjogXHJcblx0XHRcdFwidW5pZm9ybSBzYW1wbGVyMkQgdVRleHR1cmVTYW1wbGVyOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVIYXNUZXh0dXJlOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzIgdVRleHR1cmVSZXBlYXQ7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMiB1VGV4dHVyZU9mZnNldDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCB2ZWM0IHVHZW9tZXRyeVVWOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdlZlcnRleENvbG9yOyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjNCBjb2xvciA9IHZWZXJ0ZXhDb2xvcjsgXCIgKyBcclxuXHRcdFx0XHRcImlmICh1SGFzVGV4dHVyZSl7IFwiICsgXHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgdHggPSB1R2VvbWV0cnlVVi54ICsgbW9kKHVUZXh0dXJlT2Zmc2V0LnggKyB2VGV4dHVyZUNvb3JkLnMgKiB1VGV4dHVyZVJlcGVhdC54IC0gdUdlb21ldHJ5VVYueCwgdUdlb21ldHJ5VVYueiAtIHVHZW9tZXRyeVVWLngpO1wiICtcclxuXHRcdFx0XHRcdFwibWVkaXVtcCBmbG9hdCB0eSA9IHVHZW9tZXRyeVVWLnkgKyBtb2QodVRleHR1cmVPZmZzZXQueSArIHZUZXh0dXJlQ29vcmQudCAqIHVUZXh0dXJlUmVwZWF0LnkgLSB1R2VvbWV0cnlVVi55LCB1R2VvbWV0cnlVVi53IC0gdUdlb21ldHJ5VVYueSk7XCIgK1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjNCB0ZXhDb2xvciA9IHRleHR1cmUyRCh1VGV4dHVyZVNhbXBsZXIsIHZlYzIodHgsIHR5KSk7IFwiICtcclxuXHRcdFx0XHRcdFwiY29sb3IgKj0gdGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHRcIn0gXCIgKyBcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcImdsX0ZyYWdDb2xvciA9IGNvbG9yO1wiICsgXHJcblx0XHRcdFwifVwiXHJcblx0fSxcclxuXHRcclxuXHRcclxuXHRsYW1iZXJ0OiB7XHJcblx0XHR2ZXJ0ZXhTaGFkZXI6IFxyXG5cdFx0XHRcInN0cnVjdCBMaWdodHsgXCIgK1xyXG5cdFx0XHQgICAgXCJsb3dwIHZlYzMgcG9zaXRpb247IFwiICtcclxuXHRcdFx0ICAgIFwibG93cCB2ZWMzIGNvbG9yOyBcIiArXHJcblx0XHRcdCAgICBcImxvd3AgdmVjMyBkaXJlY3Rpb247IFwiICtcclxuXHRcdFx0ICAgIFwibG93cCB2ZWMzIHNwb3REaXJlY3Rpb247IFwiICtcclxuXHRcdFx0ICAgIFwibG93cCBmbG9hdCBpbnRlbnNpdHk7IFwiICtcclxuXHRcdFx0ICAgIFwibG93cCBmbG9hdCBpbm5lckFuZ2xlOyBcIiArXHJcblx0XHRcdCAgICBcImxvd3AgZmxvYXQgb3V0ZXJBbmdsZTsgXCIgK1xyXG5cdFx0XHRcIn07IFwiICtcclxuXHRcdFx0ICAgIFxyXG5cdFx0XHRcInVuaWZvcm0gTGlnaHQgbGlnaHRzWzhdOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBpbnQgdXNlZExpZ2h0czsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMyIGFUZXh0dXJlQ29vcmQ7IFwiICtcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBsb3dwIHZlYzQgYVZlcnRleENvbG9yOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleE5vcm1hbDsgXCIgKyBcclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVNVk1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVQTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzQgdU1hdGVyaWFsQ29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVVc2VMaWdodGluZzsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVNb2RlbE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQzIHVOb3JtYWxNYXRyaXg7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzMgdUFtYmllbnRMaWdodENvbG9yOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZWZXJ0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIgKyAgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdkxpZ2h0V2VpZ2h0OyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJtZWRpdW1wIHZlYzMgZ2V0TGlnaHRXZWlnaHQobWVkaXVtcCB2ZWMzIG5vcm1hbCwgbWVkaXVtcCB2ZWMzIGRpcmVjdGlvbiwgbG93cCB2ZWMzIGNvbG9yLCBsb3dwIGZsb2F0IGludGVuc2l0eSl7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgbGlnaHREb3QgPSBtYXgoZG90KG5vcm1hbCwgZGlyZWN0aW9uKSwgMC4wKTsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGxpZ2h0V2VpZ2h0ID0gKGNvbG9yICogbGlnaHREb3QgKiBpbnRlbnNpdHkpOyBcIiArXHJcblx0XHRcdFx0XCJyZXR1cm4gbGlnaHRXZWlnaHQ7IFwiICtcclxuXHRcdFx0XCJ9XCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICsgXHJcblx0XHRcdFx0XCJ2ZWM0IG1vZGVsVmlld1Bvc2l0aW9uID0gdU1WTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7IFwiICtcclxuXHRcdFx0XHRcImdsX1Bvc2l0aW9uID0gdVBNYXRyaXggKiBtb2RlbFZpZXdQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XHRcInZMaWdodFdlaWdodCA9IHVBbWJpZW50TGlnaHRDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwiaWYgKHVVc2VMaWdodGluZyl7IFwiICtcclxuXHRcdFx0XHRcdFwidmVjMyB2ZXJ0ZXhNb2RlbFBvc2l0aW9uID0gKHVNb2RlbE1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eXo7IFwiICtcclxuXHRcdFx0XHRcdFwiZm9yIChpbnQgaT0wO2k8ODtpKyspeyBcIiArXHJcblx0XHRcdFx0XHRcdFwiaWYgKGkgPj0gdXNlZExpZ2h0cyl7XCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwiYnJlYWs7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJ9XCIgK1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XCJMaWdodCBsID0gbGlnaHRzW2ldOyBcIiArXHJcblx0XHRcdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGxQb3MgPSBsLnBvc2l0aW9uIC0gdmVydGV4TW9kZWxQb3NpdGlvbjtcIiArXHJcblx0XHRcdFx0XHRcdFwibWVkaXVtcCBmbG9hdCBsRGlzdGFuY2UgPSBsZW5ndGgobFBvcykgLyAyLjA7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJpZiAobGVuZ3RoKGwucG9zaXRpb24pID09IDAuMCl7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcImxEaXN0YW5jZSA9IDEuMDsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwibFBvcyA9IHZlYzMoMC4wKTsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgbGlnaHREaXJlY3Rpb24gPSBsLmRpcmVjdGlvbiArIG5vcm1hbGl6ZShsUG9zKTsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XCJsb3dwIGZsb2F0IHNwb3RXZWlnaHQgPSAxLjA7IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgXCJpZiAobGVuZ3RoKGwuc3BvdERpcmVjdGlvbikgIT0gMC4wKXsgXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgXCJsb3dwIGZsb2F0IGNvc0FuZ2xlID0gZG90KGwuc3BvdERpcmVjdGlvbiwgbGlnaHREaXJlY3Rpb24pOyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgIFx0XCJzcG90V2VpZ2h0ID0gY2xhbXAoKGNvc0FuZ2xlIC0gbC5vdXRlckFuZ2xlKSAvIChsLmlubmVyQW5nbGUgLSBsLm91dGVyQW5nbGUpLCAwLjAsIDEuMCk7IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgICAgIFwibERpc3RhbmNlID0gMS4wOyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgIFwifSBcIiArXHJcblx0XHRcdCAgICAgICAgICAgIFxyXG5cdFx0XHRcdFx0XHRcInZMaWdodFdlaWdodCArPSBnZXRMaWdodFdlaWdodChhVmVydGV4Tm9ybWFsLCBsaWdodERpcmVjdGlvbiwgbC5jb2xvciwgbC5pbnRlbnNpdHkpICogc3BvdFdlaWdodCAvIGxEaXN0YW5jZTsgXCIgKyBcclxuXHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHQgXHJcblx0XHRcdFx0XCJ2VmVydGV4Q29sb3IgPSBhVmVydGV4Q29sb3IgKiB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwidlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7IFwiICsgIFxyXG5cdFx0XHRcIn0gXCIgLFxyXG5cdFx0XHRcclxuXHRcdGZyYWdtZW50U2hhZGVyOiBcclxuXHRcdFx0XCJ1bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZVNhbXBsZXI7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdUhhc1RleHR1cmU7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgZmxvYXQgdU9wYWNpdHk7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMiB1VGV4dHVyZVJlcGVhdDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMyIHVUZXh0dXJlT2Zmc2V0OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzQgdUdlb21ldHJ5VVY7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdkxpZ2h0V2VpZ2h0OyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjNCBjb2xvciA9IHZWZXJ0ZXhDb2xvcjsgXCIgKyBcclxuXHRcdFx0XHRcImlmICh1SGFzVGV4dHVyZSl7IFwiICsgXHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgdHggPSB1R2VvbWV0cnlVVi54ICsgbW9kKHVUZXh0dXJlT2Zmc2V0LnggKyB2VGV4dHVyZUNvb3JkLnMgKiB1VGV4dHVyZVJlcGVhdC54IC0gdUdlb21ldHJ5VVYueCwgdUdlb21ldHJ5VVYueiAtIHVHZW9tZXRyeVVWLngpO1wiICtcclxuXHRcdFx0XHRcdFwibWVkaXVtcCBmbG9hdCB0eSA9IHVHZW9tZXRyeVVWLnkgKyBtb2QodVRleHR1cmVPZmZzZXQueSArIHZUZXh0dXJlQ29vcmQudCAqIHVUZXh0dXJlUmVwZWF0LnkgLSB1R2VvbWV0cnlVVi55LCB1R2VvbWV0cnlVVi53IC0gdUdlb21ldHJ5VVYueSk7XCIgK1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjNCB0ZXhDb2xvciA9IHRleHR1cmUyRCh1VGV4dHVyZVNhbXBsZXIsIHZlYzIodHgsIHR5KSk7IFwiICtcclxuXHRcdFx0XHRcdFwiY29sb3IgKj0gdGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHRcIn0gXCIgKyBcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcImNvbG9yLnJnYiAqPSB2TGlnaHRXZWlnaHQ7IFwiICsgXHJcblx0XHRcdFx0XCJnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLnJnYiwgY29sb3IuYSAqIHVPcGFjaXR5KTsgXCIgKyBcclxuXHRcdFx0XCJ9XCJcclxuXHR9LFxyXG5cdFxyXG5cdFxyXG5cdHBob25nOiB7XHJcblx0XHR2ZXJ0ZXhTaGFkZXI6IFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzIgYVRleHR1cmVDb29yZDsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleFBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFwiYXR0cmlidXRlIGxvd3AgdmVjNCBhVmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjMyBhVmVydGV4Tm9ybWFsOyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdU1WTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdVBNYXRyaXg7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjNCB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVVzZUxpZ2h0aW5nOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdU1vZGVsTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDMgdU5vcm1hbE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMyB1QW1iaWVudExpZ2h0Q29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdlZlcnRleENvbG9yOyBcIiArXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDtcIiArICBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMyB2TGlnaHRXZWlnaHQ7IFwiICtcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMyB2Tm9ybWFsOyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMzIHZQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICsgXHJcblx0XHRcdFx0XCJ2ZWM0IG1vZGVsVmlld1Bvc2l0aW9uID0gdU1WTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7IFwiICtcclxuXHRcdFx0XHRcImdsX1Bvc2l0aW9uID0gdVBNYXRyaXggKiBtb2RlbFZpZXdQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XHRcImlmICh1VXNlTGlnaHRpbmcpeyBcIiArIFxyXG5cdFx0XHRcdFx0XCJ2Tm9ybWFsID0gdU5vcm1hbE1hdHJpeCAqIGFWZXJ0ZXhOb3JtYWw7IFwiICtcclxuXHRcdFx0XHRcdFwidkxpZ2h0V2VpZ2h0ID0gdUFtYmllbnRMaWdodENvbG9yOyBcIiArXHJcblx0XHRcdFx0XCJ9ZWxzZXsgXCIgK1xyXG5cdFx0XHRcdFx0XCJ2TGlnaHRXZWlnaHQgPSB2ZWMzKDEuMCk7IFwiICsgXHJcblx0XHRcdFx0XCJ9XCIgKyAgIFxyXG5cdFx0XHRcdCBcclxuXHRcdFx0XHRcInZQb3NpdGlvbiA9ICh1TW9kZWxNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHl6OyBcIiArXHJcblx0XHRcdFx0XCJ2VmVydGV4Q29sb3IgPSBhVmVydGV4Q29sb3IgKiB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwidlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7IFwiICsgIFxyXG5cdFx0XHRcIn0gXCIgLFxyXG5cdFx0XHRcclxuXHRcdGZyYWdtZW50U2hhZGVyOiBcclxuXHRcdFx0XCJzdHJ1Y3QgTGlnaHR7IFwiICtcclxuXHRcdFx0ICAgIFwibG93cCB2ZWMzIHBvc2l0aW9uOyBcIiArXHJcblx0XHRcdCAgICBcImxvd3AgdmVjMyBjb2xvcjsgXCIgK1xyXG5cdFx0XHQgICAgXCJsb3dwIHZlYzMgZGlyZWN0aW9uOyBcIiArXHJcblx0XHRcdCAgICBcImxvd3AgdmVjMyBzcG90RGlyZWN0aW9uOyBcIiArXHJcblx0XHRcdCAgICBcImxvd3AgZmxvYXQgaW50ZW5zaXR5OyBcIiArXHJcblx0XHRcdCAgICBcImxvd3AgZmxvYXQgaW5uZXJBbmdsZTsgXCIgK1xyXG5cdFx0XHQgICAgXCJsb3dwIGZsb2F0IG91dGVyQW5nbGU7IFwiICtcclxuXHRcdFx0ICAgIFwibWVkaXVtcCBtYXQ0IG12UHJvamVjdGlvbjsgXCIgK1xyXG5cdFx0XHRcIn07IFwiICtcclxuXHRcdFx0ICAgIFxyXG5cdFx0XHRcInVuaWZvcm0gTGlnaHQgbGlnaHRzWzhdOyBcIiArXHJcblx0XHQgICAgXCJ1bmlmb3JtIHNhbXBsZXIyRCBzaGFkb3dNYXBzWzhdOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBpbnQgdXNlZExpZ2h0czsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdUhhc1RleHR1cmU7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZVNhbXBsZXI7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVVc2VTcGVjdWxhck1hcDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gc2FtcGxlcjJEIHVTcGVjdWxhck1hcFNhbXBsZXI7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVVc2VMaWdodGluZzsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCBmbG9hdCB1T3BhY2l0eTsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMyIHVUZXh0dXJlUmVwZWF0OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzIgdVRleHR1cmVPZmZzZXQ7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgdmVjNCB1R2VvbWV0cnlVVjsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCB2ZWMzIHVDYW1lcmFQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMyB1U3BlY3VsYXJDb2xvcjsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCBmbG9hdCB1U2hpbmluZXNzOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdlZlcnRleENvbG9yOyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMzIHZMaWdodFdlaWdodDsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMyB2Tm9ybWFsOyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMzIHZQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJtZWRpdW1wIHZlYzMgZ2V0TGlnaHRXZWlnaHQobWVkaXVtcCB2ZWMzIG5vcm1hbCwgbWVkaXVtcCB2ZWMzIGRpcmVjdGlvbiwgbG93cCB2ZWMzIGNvbG9yLCBsb3dwIGZsb2F0IGludGVuc2l0eSl7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgbGlnaHREb3QgPSBtYXgoZG90KG5vcm1hbCwgZGlyZWN0aW9uKSwgMC4wKTsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGxpZ2h0V2VpZ2h0ID0gKGNvbG9yICogbGlnaHREb3QgKiBpbnRlbnNpdHkpOyBcIiArXHJcblx0XHRcdFx0XCJyZXR1cm4gbGlnaHRXZWlnaHQ7IFwiICtcclxuXHRcdFx0XCJ9XCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjNCBjb2xvciA9IHZWZXJ0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWMzIG5vcm1hbCA9IG5vcm1hbGl6ZSh2Tm9ybWFsKTsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGNhbWVyYURpcmVjdGlvbiA9IG5vcm1hbGl6ZSh1Q2FtZXJhUG9zaXRpb24pOyBcIiArXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XCJtZWRpdW1wIGZsb2F0IHR4OyBcIiArXHJcblx0XHRcdFx0XCJtZWRpdW1wIGZsb2F0IHR5OyBcIiArXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XCJpZiAodUhhc1RleHR1cmUpeyBcIiArIFxyXG5cdFx0XHRcdFx0XCJ0eCA9IHVHZW9tZXRyeVVWLnggKyBtb2QodVRleHR1cmVPZmZzZXQueCArIHZUZXh0dXJlQ29vcmQucyAqIHVUZXh0dXJlUmVwZWF0LnggLSB1R2VvbWV0cnlVVi54LCB1R2VvbWV0cnlVVi56IC0gdUdlb21ldHJ5VVYueCk7XCIgK1xyXG5cdFx0XHRcdFx0XCJ0eSA9IHVHZW9tZXRyeVVWLnkgKyBtb2QodVRleHR1cmVPZmZzZXQueSArIHZUZXh0dXJlQ29vcmQudCAqIHVUZXh0dXJlUmVwZWF0LnkgLSB1R2VvbWV0cnlVVi55LCB1R2VvbWV0cnlVVi53IC0gdUdlb21ldHJ5VVYueSk7XCIgK1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjNCB0ZXhDb2xvciA9IHRleHR1cmUyRCh1VGV4dHVyZVNhbXBsZXIsIHZlYzIodHgsIHR5KSk7IFwiICtcclxuXHRcdFx0XHRcdFwiY29sb3IgKj0gdGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHRcIn0gXCIgKyBcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgciA9IHRleHR1cmUyRChzaGFkb3dNYXBzWzBdLCB2ZWMyKDAuMCwgMC4wKSkucjsgXCIgK1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWMzIHBob25nTGlnaHRXZWlnaHQgPSB2ZWMzKDAuMCk7IFwiICsgXHJcblx0XHRcdFx0XCJpZiAodVVzZUxpZ2h0aW5nKXsgXCIgK1xyXG5cdFx0XHRcdFx0XCJmb3IgKGludCBpPTA7aTw4O2krKyl7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJpZiAoaSA+PSB1c2VkTGlnaHRzKXtcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJicmVhazsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcIn1cIiArXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcIkxpZ2h0IGwgPSBsaWdodHNbaV07IFwiICtcclxuXHRcdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgbFBvcyA9IGwucG9zaXRpb24gLSB2UG9zaXRpb247XCIgK1xyXG5cdFx0XHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgbERpc3RhbmNlID0gbGVuZ3RoKGxQb3MpIC8gMi4wOyBcIiArXHJcblx0XHRcdFx0XHRcdFwiaWYgKGxlbmd0aChsLnBvc2l0aW9uKSA9PSAwLjApeyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJsRGlzdGFuY2UgPSAxLjA7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcImxQb3MgPSB2ZWMzKDAuMCk7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgbGlnaHREaXJlY3Rpb24gPSBsLmRpcmVjdGlvbiArIG5vcm1hbGl6ZShsUG9zKTsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XCJsb3dwIGZsb2F0IHNwb3RXZWlnaHQgPSAxLjA7IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgXCJpZiAobGVuZ3RoKGwuc3BvdERpcmVjdGlvbikgIT0gMC4wKXsgXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgXCJsb3dwIGZsb2F0IGNvc0FuZ2xlID0gZG90KGwuc3BvdERpcmVjdGlvbiwgbGlnaHREaXJlY3Rpb24pOyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgIFx0XCJzcG90V2VpZ2h0ID0gY2xhbXAoKGNvc0FuZ2xlIC0gbC5vdXRlckFuZ2xlKSAvIChsLmlubmVyQW5nbGUgLSBsLm91dGVyQW5nbGUpLCAwLjAsIDEuMCk7IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgICAgIFwibERpc3RhbmNlID0gMS4wOyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgIFwifSBcIiArXHJcblx0XHRcdCAgICAgICAgICAgIFxyXG5cdFx0XHRcdFx0XHRcInBob25nTGlnaHRXZWlnaHQgKz0gZ2V0TGlnaHRXZWlnaHQobm9ybWFsLCBsaWdodERpcmVjdGlvbiwgbC5jb2xvciwgbC5pbnRlbnNpdHkpICogc3BvdFdlaWdodCAvIGxEaXN0YW5jZTsgXCIgKyBcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcImxvd3AgZmxvYXQgc2hpbmluZXNzID0gdVNoaW5pbmVzczsgXCIgKyBcclxuXHRcdFx0XHRcdFx0XCJpZiAodVVzZVNwZWN1bGFyTWFwKXsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwic2hpbmluZXNzID0gdGV4dHVyZTJEKHVTcGVjdWxhck1hcFNhbXBsZXIsIHZlYzIodHgsIHR5KSkuciAqIDI1NS4wOyBcIiArXHJcblx0XHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcImlmIChzaGluaW5lc3MgPiAwLjAgJiYgc2hpbmluZXNzIDwgMjU1LjApeyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgaGFsZkFuZ2xlID0gbm9ybWFsaXplKGNhbWVyYURpcmVjdGlvbiArIGxpZ2h0RGlyZWN0aW9uKTsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwibWVkaXVtcCBmbG9hdCBzcGVjRG90ID0gbWF4KGRvdChoYWxmQW5nbGUsIG5vcm1hbCksIDAuMCk7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcImNvbG9yICs9IHZlYzQodVNwZWN1bGFyQ29sb3IsIDEuMCkgKiBwb3coc3BlY0RvdCwgc2hpbmluZXNzKTsgXCIgKyBcclxuXHRcdFx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcImNvbG9yLnJnYiAqPSB2TGlnaHRXZWlnaHQgKyBwaG9uZ0xpZ2h0V2VpZ2h0OyBcIiArIFxyXG5cdFx0XHRcdFwiZ2xfRnJhZ0NvbG9yID0gdmVjNChjb2xvci5yZ2IsIGNvbG9yLmEgKiB1T3BhY2l0eSk7IFwiICsgXHJcblx0XHRcdFwifVwiXHJcblx0fSxcclxuXHRcclxuXHRkZXB0aE1hcDoge1xyXG5cdFx0dmVydGV4U2hhZGVyOiBcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgbWF0NCB1TVZQTWF0cml4OyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgKyBcclxuXHRcdFx0XHRcImdsX1Bvc2l0aW9uID0gdU1WUE1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApOyBcIiArXHJcblx0XHRcdFwifSBcIiAsXHJcblx0XHRcdFxyXG5cdFx0ZnJhZ21lbnRTaGFkZXI6IFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgK1xyXG5cdFx0XHQgICAgXCJsb3dwIGZsb2F0IGRlcHRoID0gZ2xfRnJhZ0Nvb3JkLnogKiA4LjAgLSA3LjA7IFwiICtcclxuXHRcdFx0ICAgIFwiZ2xfRnJhZ0NvbG9yID0gdmVjNChkZXB0aCwgZGVwdGgsIGRlcHRoLCAxLjApOyBcIiArXHJcblx0XHRcdFwifVwiXHJcblx0fVxyXG59OyIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vS1RVdGlscycpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcblxyXG5mdW5jdGlvbiBUZXh0dXJlKHNyYywgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3R0ZXh0dXJlID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0dGhpcy5taW5GaWx0ZXIgPSAocGFyYW1zLm1pbkZpbHRlcik/IHBhcmFtcy5taW5GaWx0ZXIgOiBnbC5MSU5FQVI7XHJcblx0dGhpcy5tYWdGaWx0ZXIgPSAocGFyYW1zLm1hZ0ZpbHRlcik/IHBhcmFtcy5tYWdGaWx0ZXIgOiBnbC5MSU5FQVI7XHJcblx0dGhpcy53cmFwUyA9IChwYXJhbXMuU1dyYXBwaW5nKT8gcGFyYW1zLlNXcmFwcGluZyA6IGdsLlJFUEVBVDtcclxuXHR0aGlzLndyYXBUID0gKHBhcmFtcy5UV3JhcHBpbmcpPyBwYXJhbXMuVFdyYXBwaW5nIDogZ2wuUkVQRUFUO1xyXG5cdHRoaXMucmVwZWF0ID0gKHBhcmFtcy5yZXBlYXQpPyBwYXJhbXMucmVwZWF0IDogbmV3IFZlY3RvcjIoMS4wLCAxLjApO1xyXG5cdHRoaXMub2Zmc2V0ID0gKHBhcmFtcy5vZmZzZXQpPyBwYXJhbXMub2Zmc2V0IDogbmV3IFZlY3RvcjIoMC4wLCAwLjApO1xyXG5cdHRoaXMuZ2VuZXJhdGVNaXBtYXAgPSAocGFyYW1zLmdlbmVyYXRlTWlwbWFwKT8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IG51bGw7XHJcblx0XHJcblx0dmFyIGltZyA9IEtULmdldEltYWdlKHNyYyk7XHJcblx0aWYgKGltZyl7XHJcblx0XHR0aGlzLmltYWdlID0gaW1nO1xyXG5cdFx0dGhpcy5wYXJzZVRleHR1cmUoKTtcclxuXHR9ZWxzZXtcclxuXHRcdHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdHRoaXMuaW1hZ2Uuc3JjID0gc3JjO1xyXG5cdFx0dGhpcy5pbWFnZS5yZWFkeSA9IGZhbHNlO1xyXG5cdFx0XHJcblx0XHR2YXIgVCA9IHRoaXM7XHJcblx0XHRVdGlscy5hZGRFdmVudCh0aGlzLmltYWdlLCBcImxvYWRcIiwgZnVuY3Rpb24oKXtcclxuXHRcdFx0S1QuaW1hZ2VzLnB1c2goe3NyYzogc3JjLCBpbWc6IFQuaW1hZ2V9KTtcclxuXHRcdFx0VC5wYXJzZVRleHR1cmUoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlO1xyXG5cclxuVGV4dHVyZS5wcm90b3R5cGUucGFyc2VUZXh0dXJlID0gZnVuY3Rpb24oKXtcclxuXHRpZiAodGhpcy5pbWFnZS5yZWFkeSkgcmV0dXJuO1xyXG5cdFxyXG5cdHRoaXMuaW1hZ2UucmVhZHkgPSB0cnVlO1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuXHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUpO1xyXG5cdFxyXG5cdGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19GTElQX1lfV0VCR0wsIHRydWUpO1xyXG5cdFxyXG5cdGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgdGhpcy5pbWFnZSk7XHJcblx0XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIHRoaXMubWFnRmlsdGVyKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgdGhpcy5taW5GaWx0ZXIpO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIHRoaXMud3JhcFMpO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIHRoaXMud3JhcFQpO1xyXG5cdFxyXG5cdGlmICh0aGlzLmdlbmVyYXRlTWlwbWFwKVxyXG5cdFx0Z2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XHJcblx0XHJcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XHJcbn07XHJcblxyXG5UZXh0dXJlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIG5ldyBUZXh0dXJlKHRoaXMuaW1hZ2Uuc3JjLCB0aGlzLnBhcmFtcyk7XHJcbn07XHJcbiIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBWZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxuXHJcbmZ1bmN0aW9uIFRleHR1cmVGcmFtZWJ1ZmZlcih3aWR0aCwgaGVpZ2h0LCBwYXJhbXMpe1xyXG5cdHRoaXMuX19rdHRleHR1cmVmcmFtZWJ1ZmZlciA9IHRydWU7XHJcblx0XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cdHRoaXMubWluRmlsdGVyID0gKHBhcmFtcy5taW5GaWx0ZXIpPyBwYXJhbXMubWluRmlsdGVyIDogZ2wuTElORUFSO1xyXG5cdHRoaXMubWFnRmlsdGVyID0gKHBhcmFtcy5tYWdGaWx0ZXIpPyBwYXJhbXMubWFnRmlsdGVyIDogZ2wuTElORUFSO1xyXG5cdHRoaXMud3JhcFMgPSAocGFyYW1zLlNXcmFwcGluZyk/IHBhcmFtcy5TV3JhcHBpbmcgOiBnbC5DTEFNUF9UT19FREdFO1xyXG5cdHRoaXMud3JhcFQgPSAocGFyYW1zLlRXcmFwcGluZyk/IHBhcmFtcy5UV3JhcHBpbmcgOiBnbC5DTEFNUF9UT19FREdFO1xyXG5cdHRoaXMucmVwZWF0ID0gKHBhcmFtcy5yZXBlYXQpPyBwYXJhbXMucmVwZWF0IDogbmV3IFZlY3RvcjIoMS4wLCAxLjApO1xyXG5cdHRoaXMub2Zmc2V0ID0gKHBhcmFtcy5vZmZzZXQpPyBwYXJhbXMub2Zmc2V0IDogbmV3IFZlY3RvcjIoMC4wLCAwLjApO1xyXG5cdHRoaXMuZ2VuZXJhdGVNaXBtYXAgPSAocGFyYW1zLmdlbmVyYXRlTWlwbWFwKT8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFxyXG5cdHRoaXMuZnJhbWVidWZmZXIgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xyXG5cdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgdGhpcy5mcmFtZWJ1ZmZlcik7XHJcblx0dGhpcy5mcmFtZWJ1ZmZlci53aWR0aCA9IHdpZHRoO1xyXG5cdHRoaXMuZnJhbWVidWZmZXIuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuXHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUpO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCB0aGlzLm1hZ0ZpbHRlcik7XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIHRoaXMubWluRmlsdGVyKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCB0aGlzLndyYXBTKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCB0aGlzLndyYXBUKTtcclxuXHRcclxuXHRpZiAodGhpcy5nZW5lcmF0ZU1pcG1hcClcclxuXHRcdGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xyXG5cdFx0XHJcblx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCB3aWR0aCwgaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBudWxsKTtcclxuXHRcclxuXHRcclxuXHR0aGlzLnJlbmRlckJ1ZmZlciA9IGdsLmNyZWF0ZVJlbmRlcmJ1ZmZlcigpO1xyXG5cdGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCB0aGlzLnJlbmRlckJ1ZmZlcik7XHJcblx0Z2wucmVuZGVyYnVmZmVyU3RvcmFnZShnbC5SRU5ERVJCVUZGRVIsIGdsLkRFUFRIX0NPTVBPTkVOVDE2LCB3aWR0aCwgaGVpZ2h0KTtcclxuXHRcclxuXHRnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSwgMCk7XHJcblx0Z2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGdsLkRFUFRIX0FUVEFDSE1FTlQsIGdsLlJFTkRFUkJVRkZFUiwgdGhpcy5yZW5kZXJCdWZmZXIpO1xyXG5cdFxyXG5cdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XHJcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XHJcblx0Z2wuYmluZFJlbmRlcmJ1ZmZlcihnbC5SRU5ERVJCVUZGRVIsIG51bGwpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHR1cmVGcmFtZWJ1ZmZlcjsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRnZXQ6IGZ1bmN0aW9uKGVsZW1lbnQpe1xyXG5cdFx0aWYgKGVsZW1lbnQuY2hhckF0KDApID09IFwiI1wiKXtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQucmVwbGFjZShcIiNcIiwgXCJcIikpO1xyXG5cdFx0fWVsc2UgaWYgKGVsZW1lbnQuY2hhckF0KDApID09IFwiLlwiKXtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoZWxlbWVudC5yZXBsYWNlKFwiLlwiLCBcIlwiKSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKGVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0YWRkRXZlbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIHR5cGUsIGNhbGxiYWNrKXtcclxuXHRcdGlmIChlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIpe1xyXG5cdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIGZhbHNlKTtcclxuXHRcdH1lbHNlIGlmIChlbGVtZW50LmF0dGFjaEV2ZW50KXtcclxuXHRcdFx0ZWxlbWVudC5hdHRhY2hFdmVudChcIm9uXCIgKyB0eXBlLCBjYWxsYmFjayk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRnZXRIdHRwOiBmdW5jdGlvbigpe1xyXG5cdFx0aWYgKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCl7XHJcblx0XHRcdHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdH1lbHNlIGlmICh3aW5kb3cuQWN0aXZlWE9iamVjdCl7XHJcblx0XHRcdGh0dHAgPSBuZXcgd2luZG93LkFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MSFRUUFwiKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fSxcclxuXHRcclxuXHRnZXRGaWxlQ29udGVudDogZnVuY3Rpb24oZmlsZVVSTCwgY2FsbGJhY2spe1xyXG5cdFx0dmFyIGh0dHAgPSB0aGlzLmdldEh0dHAoKTtcclxuXHRcdGh0dHAub3BlbignR0VUJywgZmlsZVVSTCwgdHJ1ZSk7XHJcblx0XHRodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG5cdCAgXHRcdGlmIChodHRwLnJlYWR5U3RhdGUgPT0gNCAmJiBodHRwLnN0YXR1cyA9PSAyMDApIHtcclxuXHRcdFx0XHRpZiAoY2FsbGJhY2spe1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soaHR0cC5yZXNwb25zZVRleHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdGh0dHAuc2VuZCgpO1xyXG5cdH1cclxufTtcclxuIiwiZnVuY3Rpb24gVmVjdG9yMih4LCB5KXtcclxuXHR0aGlzLl9fa3R2MiA9IHRydWU7XHJcblx0XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBWZWN0b3IyO1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XHJcblx0XHJcblx0cmV0dXJuIGxlbmd0aDtcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoKCk7XHJcblx0XHJcblx0dGhpcy54IC89IGxlbmd0aDtcclxuXHR0aGlzLnkgLz0gbGVuZ3RoO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24odmVjdG9yMil7XHJcblx0aWYgKCF2ZWN0b3IyLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBwZXJmb3JtIGEgZG90IHByb2R1Y3Qgd2l0aCBhIHZlY3RvcjJcIjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcy54ICogdmVjdG9yMi54ICsgdGhpcy55ICogdmVjdG9yMi55O1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuaW52ZXJ0ID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gdGhpcy5tdWx0aXBseSgtMSk7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uKG51bWJlcil7XHJcblx0dGhpcy54ICo9IG51bWJlcjtcclxuXHR0aGlzLnkgKj0gbnVtYmVyO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odmVjdG9yMil7XHJcblx0aWYgKCF2ZWN0b3IyLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBhZGQgYSB2ZWN0b3IyIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ICs9IHZlY3RvcjIueDtcclxuXHR0aGlzLnkgKz0gdmVjdG9yMi55O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKHZlY3RvcjIpe1xyXG5cdGlmICghdmVjdG9yMi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIHZlY3RvcjIgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHR0aGlzLnggPSB2ZWN0b3IyLng7XHJcblx0dGhpcy55ID0gdmVjdG9yMi55O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSl7XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiBuZXcgVmVjdG9yMih0aGlzLngsIHRoaXMueSk7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbih2ZWN0b3IyKXtcclxuXHRpZiAoIXZlY3RvcjIuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSB2ZWN0b3IyIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0cmV0dXJuICh0aGlzLnggPT0gdmVjdG9yMi54ICYmIHRoaXMueSA9PSB2ZWN0b3IyLnkpO1xyXG59O1xyXG5cclxuVmVjdG9yMi52ZWN0b3JzRGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHZlY3RvcjJfYSwgdmVjdG9yMl9iKXtcclxuXHRpZiAoIXZlY3RvcjJfYS5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczJcIjtcclxuXHRpZiAoIXZlY3RvcjJfYi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczJcIjtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjIodmVjdG9yMl9hLnggLSB2ZWN0b3IyX2IueCwgdmVjdG9yMl9hLnkgLSB2ZWN0b3IyX2IueSk7XHJcbn07XHJcblxyXG5WZWN0b3IyLmZyb21BbmdsZSA9IGZ1bmN0aW9uKHJhZGlhbil7XHJcblx0dmFyIHggPSBNYXRoLmNvcyhyYWRpYW4pO1xyXG5cdHZhciB5ID0gLU1hdGguc2luKHJhZGlhbik7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IyKHgsIHkpO1xyXG59O1xyXG4iLCJmdW5jdGlvbiBWZWN0b3IzKHgsIHksIHope1xyXG5cdHRoaXMuX19rdHYzID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnggPSB4O1xyXG5cdHRoaXMueSA9IHk7XHJcblx0dGhpcy56ID0gejtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yMztcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkgKyB0aGlzLnogKiB0aGlzLnopO1xyXG5cdFxyXG5cdHJldHVybiBsZW5ndGg7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMueCAvPSBsZW5ndGg7XHJcblx0dGhpcy55IC89IGxlbmd0aDtcclxuXHR0aGlzLnogLz0gbGVuZ3RoO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBwZXJmb3JtIGEgZG90IHByb2R1Y3Qgd2l0aCBhIHZlY3RvcjNcIjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcy54ICogdmVjdG9yMy54ICsgdGhpcy55ICogdmVjdG9yMy55ICsgdGhpcy56ICogdmVjdG9yMy56O1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IHBlcmZvcm0gYSBjcm9zcyBwcm9kdWN0IHdpdGggYSB2ZWN0b3IzXCI7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IzKFxyXG5cdFx0dGhpcy55ICogdmVjdG9yMy56IC0gdGhpcy56ICogdmVjdG9yMy55LFxyXG5cdFx0dGhpcy56ICogdmVjdG9yMy54IC0gdGhpcy54ICogdmVjdG9yMy56LFxyXG5cdFx0dGhpcy54ICogdmVjdG9yMy55IC0gdGhpcy55ICogdmVjdG9yMy54XHJcblx0KTtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihudW1iZXIpe1xyXG5cdHRoaXMueCAqPSBudW1iZXI7XHJcblx0dGhpcy55ICo9IG51bWJlcjtcclxuXHR0aGlzLnogKj0gbnVtYmVyO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBhZGQgYSBWZWN0b3IzIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ICs9IHZlY3RvcjMueDtcclxuXHR0aGlzLnkgKz0gdmVjdG9yMy55O1xyXG5cdHRoaXMueiArPSB2ZWN0b3IzLno7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgVmVjdG9yMyB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCA9IHZlY3RvcjMueDtcclxuXHR0aGlzLnkgPSB2ZWN0b3IzLnk7XHJcblx0dGhpcy56ID0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSwgeil7XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMueCwgdGhpcy55LCB0aGlzLnopO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgVmVjdG9yMyB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHJldHVybiAodGhpcy54ID09IHZlY3RvcjMueCAmJiB0aGlzLnkgPT0gdmVjdG9yMy55ICYmIHRoaXMueiA9PSB2ZWN0b3IzLnopO1xyXG59O1xyXG5cclxuVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHZlY3RvcjNfYSwgdmVjdG9yM19iKXtcclxuXHRpZiAoIXZlY3RvcjNfYS5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczNcIjtcclxuXHRpZiAoIXZlY3RvcjNfYi5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczNcIjtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjModmVjdG9yM19hLnggLSB2ZWN0b3IzX2IueCwgdmVjdG9yM19hLnkgLSB2ZWN0b3IzX2IueSwgdmVjdG9yM19hLnogLSB2ZWN0b3IzX2Iueik7XHJcbn07XHJcblxyXG5WZWN0b3IzLmZyb21BbmdsZSA9IGZ1bmN0aW9uKHJhZGlhbl94eiwgcmFkaWFuX3kpe1xyXG5cdHZhciB4ID0gTWF0aC5jb3MocmFkaWFuX3h6KTtcclxuXHR2YXIgeSA9IE1hdGguc2luKHJhZGlhbl95KTtcclxuXHR2YXIgeiA9IC1NYXRoLnNpbihyYWRpYW5feHopO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMyh4LCB5LCB6KTtcclxufTtcclxuIiwiZnVuY3Rpb24gVmVjdG9yNCh4LCB5LCB6LCB3KXtcclxuXHR0aGlzLl9fa3R2NCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcblx0dGhpcy53ID0gdztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yNDtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkgKyB0aGlzLnogKiB0aGlzLnogKyB0aGlzLncgKiB0aGlzLncpO1xyXG5cdFxyXG5cdHJldHVybiBsZW5ndGg7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMueCAvPSBsZW5ndGg7XHJcblx0dGhpcy55IC89IGxlbmd0aDtcclxuXHR0aGlzLnogLz0gbGVuZ3RoO1xyXG5cdHRoaXMudyAvPSBsZW5ndGg7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbih2ZWN0b3I0KXtcclxuXHRpZiAoIXZlY3RvcjQuX19rdHY0KSB0aHJvdyBcIkNhbiBvbmx5IHBlcmZvcm0gYSBkb3QgcHJvZHVjdCB3aXRoIGEgdmVjdG9yNFwiO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzLnggKiB2ZWN0b3I0LnggKyB0aGlzLnkgKiB2ZWN0b3I0LnkgKyB0aGlzLnogKiB2ZWN0b3I0LnogKyB0aGlzLncgKiB2ZWN0b3I0Lnc7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24obnVtYmVyKXtcclxuXHR0aGlzLnggKj0gbnVtYmVyO1xyXG5cdHRoaXMueSAqPSBudW1iZXI7XHJcblx0dGhpcy56ICo9IG51bWJlcjtcclxuXHR0aGlzLncgKj0gbnVtYmVyO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yNC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odmVjdG9yNCl7XHJcblx0aWYgKCF2ZWN0b3I0Ll9fa3R2NCkgdGhyb3cgXCJDYW4gb25seSBhZGQgYSB2ZWN0b3I0IHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ICs9IHZlY3RvcjQueDtcclxuXHR0aGlzLnkgKz0gdmVjdG9yNC55O1xyXG5cdHRoaXMueiArPSB2ZWN0b3I0Lno7XHJcblx0dGhpcy53ICs9IHZlY3RvcjQudztcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbih2ZWN0b3I0KXtcclxuXHRpZiAoIXZlY3RvcjQuX19rdHY0KSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSB2ZWN0b3I0IHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ID0gdmVjdG9yNC54O1xyXG5cdHRoaXMueSA9IHZlY3RvcjQueTtcclxuXHR0aGlzLnogPSB2ZWN0b3I0Lno7XHJcblx0dGhpcy53ID0gdmVjdG9yNC53O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yNC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSwgeiwgdyl7XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcblx0dGhpcy53ID0gdztcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gbmV3IHZlY3RvcjQodGhpcy54LCB0aGlzLnksIHRoaXMueiwgdGhpcy53KTtcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKHZlY3RvcjQpe1xyXG5cdGlmICghdmVjdG9yNC5fX2t0djQpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIHZlY3RvcjQgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHRyZXR1cm4gKHRoaXMueCA9PSB2ZWN0b3I0LnggJiYgdGhpcy55ID09IHZlY3RvcjQueSAmJiB0aGlzLnogPT0gdmVjdG9yNC56ICYmIHRoaXMudyA9PSB2ZWN0b3I0LncpO1xyXG59O1xyXG5cclxuVmVjdG9yNC52ZWN0b3JzRGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHZlY3RvcjRfYSwgdmVjdG9yNF9iKXtcclxuXHRpZiAoIXZlY3RvcjRfYS5fX2t0djQpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczRcIjtcclxuXHRpZiAoIXZlY3RvcjRfYi5fX2t0djQpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczRcIjtcclxuXHRcclxuXHRyZXR1cm4gbmV3IHZlY3RvcjQodmVjdG9yNF9hLnggLSB2ZWN0b3I0X2IueCwgdmVjdG9yNF9hLnkgLSB2ZWN0b3I0X2IueSwgdmVjdG9yNF9hLnogLSB2ZWN0b3I0X2IueiwgdmVjdHByNF9hLncgLSB2ZWN0b3I0X2Iudyk7XHJcbn07IiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxuS1QuQ2FtZXJhT3J0aG8gPSByZXF1aXJlKCcuL0tUQ2FtZXJhT3J0aG8nKTtcclxuS1QuQ2FtZXJhUGVyc3BlY3RpdmUgPSByZXF1aXJlKCcuL0tUQ2FtZXJhUGVyc3BlY3RpdmUnKTtcclxuS1QuQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxuS1QuR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxuS1QuR2VvbWV0cnkzRE1vZGVsID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5M0RNb2RlbCcpO1xyXG5LVC5HZW9tZXRyeUJveCA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeUJveCcpO1xyXG5LVC5HZW9tZXRyeUN5bGluZGVyID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Q3lsaW5kZXInKTtcclxuS1QuR2VvbWV0cnlQbGFuZSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeVBsYW5lJyk7XHJcbktULkdlb21ldHJ5U2t5Ym94ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5U2t5Ym94Jyk7XHJcbktULkdlb21ldHJ5U3BoZXJlID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5U3BoZXJlJyk7XHJcbktULkdlb21ldHJ5R1VJVGV4dHVyZSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeUdVSVRleHR1cmUnKTtcclxuS1QuTGlnaHREaXJlY3Rpb25hbCA9IHJlcXVpcmUoJy4vS1RMaWdodERpcmVjdGlvbmFsJyk7XHJcbktULkxpZ2h0UG9pbnQgPSByZXF1aXJlKCcuL0tUTGlnaHRQb2ludCcpO1xyXG5LVC5MaWdodFNwb3QgPSByZXF1aXJlKCcuL0tUTGlnaHRTcG90Jyk7XHJcbktULklucHV0ID0gcmVxdWlyZSgnLi9LVElucHV0Jyk7XHJcbktULk1hdGVyaWFsID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsJyk7XHJcbktULk1hdGVyaWFsQmFzaWMgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWxCYXNpYycpO1xyXG5LVC5NYXRlcmlhbExhbWJlcnQgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWxMYW1iZXJ0Jyk7XHJcbktULk1hdGVyaWFsUGhvbmcgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWxQaG9uZycpO1xyXG5LVC5NYXRoID0gcmVxdWlyZSgnLi9LVE1hdGgnKTtcclxuS1QuTWF0cml4MyA9IHJlcXVpcmUoJy4vS1RNYXRyaXgzJyk7XHJcbktULk1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG5LVC5NZXNoID0gcmVxdWlyZSgnLi9LVE1lc2gnKTtcclxuS1QuTWVzaFNwcml0ZSA9IHJlcXVpcmUoJy4vS1RNZXNoU3ByaXRlJyk7XHJcbktULk9yYml0QW5kUGFuID0gcmVxdWlyZSgnLi9LVE9yYml0QW5kUGFuJyk7XHJcbktULlRleHR1cmUgPSByZXF1aXJlKCcuL0tUVGV4dHVyZScpO1xyXG5LVC5UZXh0dXJlRnJhbWVidWZmZXIgPSByZXF1aXJlKCcuL0tUVGV4dHVyZUZyYW1lYnVmZmVyJyk7XHJcbktULlV0aWxzID0gcmVxdWlyZSgnLi9LVFV0aWxzJyk7XHJcbktULlZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG5LVC5WZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxuS1QuVmVjdG9yNCA9IHJlcXVpcmUoJy4vS1RWZWN0b3I0Jyk7XHJcbktULlNjZW5lID0gcmVxdWlyZSgnLi9LVFNjZW5lJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtUOyIsIndpbmRvdy5LVCA9IHJlcXVpcmUoJy4vS3JhbVRlY2gnKTsiXX0=
