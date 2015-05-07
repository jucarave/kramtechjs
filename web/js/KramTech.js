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
}

module.exports = DirectionalLight;

DirectionalLight.prototype.setCastShadow = function(castShadow){
	this.castShadow = castShadow;
	
	if (castShadow){
		var rel = this.shadowResolution.x / this.shadowResolution.y;
		this.shadowCam = new CameraOrtho(this.shadowCamWidth, this.shadowCamHeight, this.shadowNear, this.shadowFar);
		this.shadowCam.position = this.direction.clone().multiply(100);
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
	},
	
	__initParams: function(){
		this.lightNDCMat = new Matrix4(
			0.5, 0.0, 0.0, 0.5,
			0.0, 0.5, 0.0, 0.5,
			0.0, 0.0, 0.5, 0.5,
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
			throw "Error compiling vertex shader";
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
							.multiply(light.shadowCam.perspectiveMatrix);
				
				if (!light.__ktdirLight){
					mvp.multiply(KT.lightNDCMat);
				}
				
				gl.uniformMatrix4fv(dat.location, false, mvp.toFloat32Array());
			}else{
				gl.uniformMatrix4fv(dat.location, false, Matrix4.getIdentity().toFloat32Array());
			}
		}else if (dat.name == 'castShadow'){
			gl.uniform1i(dat.location, (light.castShadow)? 1 : 0);
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
							.multiply(light.shadowCam.perspectiveMatrix);
				
				if (!light.__ktdirLight){
					mvp.multiply(KT.lightNDCMat);
				}
				
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
var structs = {
	Light: "struct Light{ " +
	    "lowp vec3 position; " +
	    "lowp vec3 color; " +
	    "lowp vec3 direction; " +
	    "lowp vec3 spotDirection; " +
	    "lowp float intensity; " +
	    "lowp float innerAngle; " +
	    "lowp float outerAngle; " +
	    "bool castShadow; " +
	    "mediump mat4 mvProjection; " +
	"}; "
};

var functions = {
	calcShadowFactor : "lowp float calcShadowFactor(sampler2D shadowMap, mediump vec4 lightSpacePos){ " +
		"if (!uReceiveShadow) " +
			"return 1.0; " +
	    "mediump vec3 projCoords = lightSpacePos.xyz / lightSpacePos.w; " +
	    "mediump vec2 UVCoords; " +
	    "UVCoords.x = projCoords.x; " +
	    "UVCoords.y = projCoords.y; " +
	    
	    "if (UVCoords.x > 1.0 || UVCoords.y > 1.0) return 1.0; " +
	    
	    "mediump float z = 1.0 - (1.0 - (projCoords.z)) * 25.0; " +
	    "mediump vec4 texCoord = texture2D(shadowMap, UVCoords); " +
	    "mediump float depth = texCoord.x; " +
	    "if (depth < (z - 0.005)) " +
	        "return 0.2; " + 
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
			            	"shadowWeight = calcShadowFactor(uShadowMaps[i], getLightPosition(shadowIndex++)); " +
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
			            "if (l.castShadow)" +
			            	"shadowWeight = calcShadowFactor(uShadowMaps[i], getLightPosition(shadowIndex++)); " +
			            	
						"phongLightWeight += shadowWeight * getLightWeight(normal, lightDirection, l.color, l.intensity) * spotWeight / lDistance; " + 
						
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
			
			"void main(void){ " + 
				"gl_Position = uMVPMatrix * vec4(aVertexPosition, 1.0); " +
			"} " ,
			
		fragmentShader: 
			"void main(void){ " +
			    "lowp float depth = 1.0 - (1.0 - gl_FragCoord.z) * 25.0; " +
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiLi5cXHNyY1xcS1RDYW1lcmFPcnRoby5qcyIsIi4uXFxzcmNcXEtUQ2FtZXJhUGVyc3BlY3RpdmUuanMiLCIuLlxcc3JjXFxLVENvbG9yLmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeS5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnkzRE1vZGVsLmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeUJveC5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlDeWxpbmRlci5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlHVUlUZXh0dXJlLmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeVBsYW5lLmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeVNreWJveC5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlTcGhlcmUuanMiLCIuLlxcc3JjXFxLVElucHV0LmpzIiwiLi5cXHNyY1xcS1RMaWdodERpcmVjdGlvbmFsLmpzIiwiLi5cXHNyY1xcS1RMaWdodFBvaW50LmpzIiwiLi5cXHNyY1xcS1RMaWdodFNwb3QuanMiLCIuLlxcc3JjXFxLVE1haW4uanMiLCIuLlxcc3JjXFxLVE1hdGVyaWFsLmpzIiwiLi5cXHNyY1xcS1RNYXRlcmlhbEJhc2ljLmpzIiwiLi5cXHNyY1xcS1RNYXRlcmlhbExhbWJlcnQuanMiLCIuLlxcc3JjXFxLVE1hdGVyaWFsUGhvbmcuanMiLCIuLlxcc3JjXFxLVE1hdGguanMiLCIuLlxcc3JjXFxLVE1hdHJpeDMuanMiLCIuLlxcc3JjXFxLVE1hdHJpeDQuanMiLCIuLlxcc3JjXFxLVE1lc2guanMiLCIuLlxcc3JjXFxLVE1lc2hTcHJpdGUuanMiLCIuLlxcc3JjXFxLVE9yYml0QW5kUGFuLmpzIiwiLi5cXHNyY1xcS1RTY2VuZS5qcyIsIi4uXFxzcmNcXEtUU2hhZGVycy5qcyIsIi4uXFxzcmNcXEtUVGV4dHVyZS5qcyIsIi4uXFxzcmNcXEtUVGV4dHVyZUZyYW1lYnVmZmVyLmpzIiwiLi5cXHNyY1xcS1RVdGlscy5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yMi5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yMy5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yNC5qcyIsIi4uXFxzcmNcXEtyYW1UZWNoLmpzIiwiLi5cXHNyY1xcV2luZG93RXhwb3J0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2haQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxudmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBWZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxudmFyIEtUTWF0aCA9IHJlcXVpcmUoJy4vS1RNYXRoJyk7XHJcblxyXG5mdW5jdGlvbiBDYW1lcmFPcnRobyh3aWR0aCwgaGVpZ2h0LCB6bmVhciwgemZhcil7XHJcblx0dGhpcy5fX2t0Y2FtZXJhID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMC4wLCAwLjAsIDAuMCk7XHJcblx0dGhpcy51cFZlY3RvciA9IG5ldyBWZWN0b3IzKDAuMCwgMS4wLCAwLjApO1xyXG5cdHRoaXMubG9va0F0KG5ldyBWZWN0b3IzKDAuMCwgMC4wLCAtMS4wKSk7XHJcblx0dGhpcy5sb2NrZWQgPSBmYWxzZTtcclxuXHRcclxuXHR0aGlzLndpZHRoID0gd2lkdGg7XHJcblx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcblx0dGhpcy56bmVhciA9IHpuZWFyO1xyXG5cdHRoaXMuemZhciA9IHpmYXI7XHJcblx0XHJcblx0dGhpcy5jb250cm9scyA9IG51bGw7XHJcblx0XHJcblx0dGhpcy5zZXRPcnRobygpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhbWVyYU9ydGhvO1xyXG5cclxuQ2FtZXJhT3J0aG8ucHJvdG90eXBlLnNldE9ydGhvID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgQyA9IDIuMCAvIHRoaXMud2lkdGg7XHJcblx0dmFyIFIgPSAyLjAgLyB0aGlzLmhlaWdodDtcclxuXHR2YXIgQSA9IC0yLjAgLyAodGhpcy56ZmFyIC0gdGhpcy56bmVhcik7XHJcblx0dmFyIEIgPSAtKHRoaXMuemZhciArIHRoaXMuem5lYXIpIC8gKHRoaXMuemZhciAtIHRoaXMuem5lYXIpO1xyXG5cdFxyXG5cdHRoaXMucGVyc3BlY3RpdmVNYXRyaXggPSBuZXcgTWF0cml4NChcclxuXHRcdEMsIDAsIDAsIDAsXHJcblx0XHQwLCBSLCAwLCAwLFxyXG5cdFx0MCwgMCwgQSwgQixcclxuXHRcdDAsIDAsIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuQ2FtZXJhT3J0aG8ucHJvdG90eXBlLmxvb2tBdCA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgbG9vayB0byBhIHZlY3RvcjNcIjtcclxuXHRcclxuXHR2YXIgZm9yd2FyZCA9IFZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UodGhpcy5wb3NpdGlvbiwgdmVjdG9yMykubm9ybWFsaXplKCk7XHJcblx0dmFyIGxlZnQgPSB0aGlzLnVwVmVjdG9yLmNyb3NzKGZvcndhcmQpLm5vcm1hbGl6ZSgpO1xyXG5cdHZhciB1cCA9IGZvcndhcmQuY3Jvc3MobGVmdCkubm9ybWFsaXplKCk7XHJcblx0XHJcblx0dmFyIHggPSAtbGVmdC5kb3QodGhpcy5wb3NpdGlvbik7XHJcblx0dmFyIHkgPSAtdXAuZG90KHRoaXMucG9zaXRpb24pO1xyXG5cdHZhciB6ID0gLWZvcndhcmQuZG90KHRoaXMucG9zaXRpb24pO1xyXG5cdFxyXG5cdHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBuZXcgTWF0cml4NChcclxuXHRcdGxlZnQueCwgbGVmdC55LCBsZWZ0LnosIHgsXHJcblx0XHR1cC54LCB1cC55LCB1cC56LCB5LFxyXG5cdFx0Zm9yd2FyZC54LCBmb3J3YXJkLnksIGZvcndhcmQueiwgeixcclxuXHRcdDAsIDAsIDAsIDFcclxuXHQpO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuQ2FtZXJhT3J0aG8ucHJvdG90eXBlLnNldENvbnRyb2xzID0gZnVuY3Rpb24oY2FtZXJhQ29udHJvbHMpe1xyXG5cdGlmICghY2FtZXJhQ29udHJvbHMuX19rdENhbUN0cmxzKSB0aHJvdyBcIklzIG5vdCBhIHZhbGlkIGNhbWVyYSBjb250cm9scyBvYmplY3RcIjtcclxuXHRcclxuXHR2YXIgem9vbSA9IFZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UodGhpcy5wb3NpdGlvbiwgY2FtZXJhQ29udHJvbHMudGFyZ2V0KS5sZW5ndGgoKTtcclxuXHRcclxuXHR0aGlzLmNvbnRyb2xzID0gY2FtZXJhQ29udHJvbHM7XHJcblx0XHJcblx0Y2FtZXJhQ29udHJvbHMuY2FtZXJhID0gdGhpcztcclxuXHRjYW1lcmFDb250cm9scy56b29tID0gem9vbTtcclxuXHRjYW1lcmFDb250cm9scy5hbmdsZS54ID0gS1RNYXRoLmdldDJEQW5nbGUoY2FtZXJhQ29udHJvbHMudGFyZ2V0LngsIGNhbWVyYUNvbnRyb2xzLnRhcmdldC56LHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi56KTtcclxuXHRjYW1lcmFDb250cm9scy5hbmdsZS55ID0gS1RNYXRoLmdldDJEQW5nbGUoMCwgdGhpcy5wb3NpdGlvbi55LCB6b29tLCBjYW1lcmFDb250cm9scy50YXJnZXQueSk7XHJcblx0XHJcblx0Y2FtZXJhQ29udHJvbHMuc2V0Q2FtZXJhUG9zaXRpb24oKTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuIiwidmFyIE1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG52YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG52YXIgS1RNYXRoID0gcmVxdWlyZSgnLi9LVE1hdGgnKTtcclxudmFyIEdlb21ldHJ5U2t5Ym94ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5U2t5Ym94Jyk7XHJcblxyXG5mdW5jdGlvbiBDYW1lcmFQZXJzcGVjdGl2ZShmb3YsIHJhdGlvLCB6bmVhciwgemZhcil7XHJcblx0dGhpcy5fX2t0Y2FtZXJhID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMC4wLCAwLjAsIDAuMCk7XHJcblx0dGhpcy51cFZlY3RvciA9IG5ldyBWZWN0b3IzKDAuMCwgMS4wLCAwLjApO1xyXG5cdHRoaXMubG9va0F0KG5ldyBWZWN0b3IzKDAuMCwgMC4wLCAtMS4wKSk7XHJcblx0dGhpcy5sb2NrZWQgPSBmYWxzZTtcclxuXHRcclxuXHR0aGlzLmZvdiA9IGZvdjtcclxuXHR0aGlzLnJhdGlvID0gcmF0aW87XHJcblx0dGhpcy56bmVhciA9IHpuZWFyO1xyXG5cdHRoaXMuemZhciA9IHpmYXI7XHJcblx0XHJcblx0dGhpcy5jb250cm9scyA9IG51bGw7XHJcblx0XHJcblx0dGhpcy5za3lib3ggPSBudWxsO1xyXG5cdFxyXG5cdHRoaXMuc2V0UGVyc3BlY3RpdmUoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYW1lcmFQZXJzcGVjdGl2ZTtcclxuXHJcbkNhbWVyYVBlcnNwZWN0aXZlLnByb3RvdHlwZS5zZXRQZXJzcGVjdGl2ZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIEMgPSAxIC8gTWF0aC50YW4odGhpcy5mb3YgLyAyKTtcclxuXHR2YXIgUiA9IEMgKiB0aGlzLnJhdGlvO1xyXG5cdHZhciBBID0gKHRoaXMuem5lYXIgKyB0aGlzLnpmYXIpIC8gKHRoaXMuem5lYXIgLSB0aGlzLnpmYXIpO1xyXG5cdHZhciBCID0gKDIgKiB0aGlzLnpuZWFyICogdGhpcy56ZmFyKSAvICh0aGlzLnpuZWFyIC0gdGhpcy56ZmFyKTtcclxuXHRcclxuXHR0aGlzLnBlcnNwZWN0aXZlTWF0cml4ID0gbmV3IE1hdHJpeDQoXHJcblx0XHRDLCAwLCAwLCAgMCxcclxuXHRcdDAsIFIsIDAsICAwLFxyXG5cdFx0MCwgMCwgQSwgIEIsXHJcblx0XHQwLCAwLCAtMSwgMFxyXG5cdCk7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUuc2V0U2t5Ym94ID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgbGVuZ3RoLCB0ZXh0dXJlcyl7XHJcblx0dGhpcy5za3lib3ggPSBuZXcgR2VvbWV0cnlTa3lib3god2lkdGgsIGhlaWdodCwgbGVuZ3RoLCB0aGlzLnBvc2l0aW9uLCB0ZXh0dXJlcyk7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUubG9va0F0ID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBsb29rIHRvIGEgdmVjdG9yM1wiO1xyXG5cdFxyXG5cdHZhciBmb3J3YXJkID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSh0aGlzLnBvc2l0aW9uLCB2ZWN0b3IzKS5ub3JtYWxpemUoKTtcclxuXHR2YXIgbGVmdCA9IHRoaXMudXBWZWN0b3IuY3Jvc3MoZm9yd2FyZCkubm9ybWFsaXplKCk7XHJcblx0dmFyIHVwID0gZm9yd2FyZC5jcm9zcyhsZWZ0KS5ub3JtYWxpemUoKTtcclxuXHRcclxuXHR2YXIgeCA9IC1sZWZ0LmRvdCh0aGlzLnBvc2l0aW9uKTtcclxuXHR2YXIgeSA9IC11cC5kb3QodGhpcy5wb3NpdGlvbik7XHJcblx0dmFyIHogPSAtZm9yd2FyZC5kb3QodGhpcy5wb3NpdGlvbik7XHJcblx0XHJcblx0dGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG5ldyBNYXRyaXg0KFxyXG5cdFx0bGVmdC54LCBsZWZ0LnksIGxlZnQueiwgeCxcclxuXHRcdHVwLngsIHVwLnksIHVwLnosIHksXHJcblx0XHRmb3J3YXJkLngsIGZvcndhcmQueSwgZm9yd2FyZC56LCB6LFxyXG5cdFx0MCwgMCwgMCwgMVxyXG5cdCk7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUuc2V0Q29udHJvbHMgPSBmdW5jdGlvbihjYW1lcmFDb250cm9scyl7XHJcblx0aWYgKCFjYW1lcmFDb250cm9scy5fX2t0Q2FtQ3RybHMpIHRocm93IFwiSXMgbm90IGEgdmFsaWQgY2FtZXJhIGNvbnRyb2xzIG9iamVjdFwiO1xyXG5cdFxyXG5cdHZhciB6b29tID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSh0aGlzLnBvc2l0aW9uLCBjYW1lcmFDb250cm9scy50YXJnZXQpLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMuY29udHJvbHMgPSBjYW1lcmFDb250cm9scztcclxuXHRcclxuXHRjYW1lcmFDb250cm9scy5jYW1lcmEgPSB0aGlzO1xyXG5cdGNhbWVyYUNvbnRyb2xzLnpvb20gPSB6b29tO1xyXG5cdGNhbWVyYUNvbnRyb2xzLmFuZ2xlLnggPSBLVE1hdGguZ2V0MkRBbmdsZShjYW1lcmFDb250cm9scy50YXJnZXQueCwgY2FtZXJhQ29udHJvbHMudGFyZ2V0LnosdGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnopO1xyXG5cdGNhbWVyYUNvbnRyb2xzLmFuZ2xlLnkgPSBLVE1hdGguZ2V0MkRBbmdsZSgwLCB0aGlzLnBvc2l0aW9uLnksIHpvb20sIGNhbWVyYUNvbnRyb2xzLnRhcmdldC55KTtcclxuXHRcclxuXHRjYW1lcmFDb250cm9scy5zZXRDYW1lcmFQb3NpdGlvbigpO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4iLCJmdW5jdGlvbiBDb2xvcihoZXhDb2xvcil7XHJcblx0dmFyIHN0ciA9IGhleENvbG9yLnN1YnN0cmluZygxKTtcclxuXHRcclxuXHRpZiAoc3RyLmxlbmd0aCA9PSA2KSBzdHIgKz0gXCJGRlwiO1xyXG5cdHZhciByID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygwLCAyKSwgMTYpO1xyXG5cdHZhciBnID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygyLCA0KSwgMTYpO1xyXG5cdHZhciBiID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg0LCA2KSwgMTYpO1xyXG5cdHZhciBhID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg2LCA4KSwgMTYpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBbciAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSwgYSAvIDI1NV07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29sb3I7XHJcblxyXG5Db2xvci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaGV4Q29sb3Ipe1xyXG5cdHZhciBzdHIgPSBoZXhDb2xvci5zdWJzdHJpbmcoMSk7XHJcblx0XHJcblx0aWYgKHN0ci5sZW5ndGggPT0gNikgc3RyICs9IFwiRkZcIjtcclxuXHR2YXIgciA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMCwgMiksIDE2KTtcclxuXHR2YXIgZyA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMiwgNCksIDE2KTtcclxuXHR2YXIgYiA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoNCwgNiksIDE2KTtcclxuXHR2YXIgYSA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoNiwgOCksIDE2KTtcclxuXHRcclxuXHR0aGlzLmNvbG9yID0gW3IgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUsIGEgLyAyNTVdO1xyXG59O1xyXG5cclxuQ29sb3IucHJvdG90eXBlLnNldFJHQiA9IGZ1bmN0aW9uKHJlZCwgZ3JlZW4sIGJsdWUpe1xyXG5cdHRoaXMuc2V0UkdCQShyZWQsIGdyZWVuLCBibHVlLCAyNTUpO1xyXG59O1xyXG5cclxuQ29sb3IucHJvdG90eXBlLnNldFJHQkEgPSBmdW5jdGlvbihyZWQsIGdyZWVuLCBibHVlLCBhbHBoYSl7XHJcblx0dGhpcy5jb2xvciA9IFtyZWQgLyAyNTUsIGdyZWVuIC8gMjU1LCBibHVlIC8gMjU1LCBhbHBoYV07XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuZ2V0UkdCID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgYyA9IHRoaXMuZ2V0UkdCQSgpO1xyXG5cdFxyXG5cdHJldHVybiBbY1swXSwgY1sxXSwgY1syXV07XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuZ2V0UkdCQSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMuY29sb3I7XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuZ2V0SGV4ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgYyA9IHRoaXMuY29sb3I7XHJcblx0XHJcblx0dmFyIHIgPSAoY1swXSAqIDI1NSkudG9TdHJpbmcoMTYpO1xyXG5cdHZhciBnID0gKGNbMV0gKiAyNTUpLnRvU3RyaW5nKDE2KTtcclxuXHR2YXIgYiA9IChjWzJdICogMjU1KS50b1N0cmluZygxNik7XHJcblx0dmFyIGEgPSAoY1szXSAqIDI1NSkudG9TdHJpbmcoMTYpO1xyXG5cdFxyXG5cdGlmIChyLmxlbmd0aCA9PSAxKSByID0gXCIwXCIgKyByO1xyXG5cdGlmIChnLmxlbmd0aCA9PSAxKSBnID0gXCIwXCIgKyBnO1xyXG5cdGlmIChiLmxlbmd0aCA9PSAxKSBiID0gXCIwXCIgKyBiO1xyXG5cdGlmIChhLmxlbmd0aCA9PSAxKSBhID0gXCIwXCIgKyBhO1xyXG5cdFxyXG5cdHJldHVybiAoXCIjXCIgKyByICsgZyArIGIgKyBhKS50b1VwcGVyQ2FzZSgpO1xyXG59O1xyXG5cclxuQ29sb3IuX0JMQUNLXHRcdD0gXCIjMDAwMDAwRkZcIjtcclxuQ29sb3IuX1JFRCBcdFx0XHQ9IFwiI0ZGMDAwMEZGXCI7XHJcbkNvbG9yLl9HUkVFTiBcdFx0PSBcIiMwMEZGMDBGRlwiO1xyXG5Db2xvci5fQkxVRSBcdFx0PSBcIiMwMDAwRkZGRlwiO1xyXG5Db2xvci5fV0hJVEVcdFx0PSBcIiNGRkZGRkZGRlwiO1xyXG5Db2xvci5fWUVMTE9XXHRcdD0gXCIjRkZGRjAwRkZcIjtcclxuQ29sb3IuX01BR0VOVEFcdFx0PSBcIiNGRjAwRkZGRlwiO1xyXG5Db2xvci5fQVFVQVx0XHRcdD0gXCIjMDBGRkZGRkZcIjtcclxuQ29sb3IuX0dPTERcdFx0XHQ9IFwiI0ZGRDcwMEZGXCI7XHJcbkNvbG9yLl9HUkFZXHRcdFx0PSBcIiM4MDgwODBGRlwiO1xyXG5Db2xvci5fUFVSUExFXHRcdD0gXCIjODAwMDgwRkZcIjsiLCJ2YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIE1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcbnZhciBWZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxudmFyIFZlY3RvcjQgPSByZXF1aXJlKCcuL0tUVmVjdG9yNCcpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnkoKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy52ZXJ0aWNlcyA9IFtdO1xyXG5cdHRoaXMudHJpYW5nbGVzID0gW107XHJcblx0dGhpcy51dkNvb3JkcyA9IFtdO1xyXG5cdHRoaXMuY29sb3JzID0gW107XHJcblx0dGhpcy5ub3JtYWxzID0gW107XHJcblx0dGhpcy51dlJlZ2lvbiA9IG5ldyBWZWN0b3I0KDAuMCwgMC4wLCAxLjAsIDEuMCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnk7XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuYWRkVmVydGljZSA9IGZ1bmN0aW9uKHgsIHksIHosIGNvbG9yLCB0eCwgdHkpe1xyXG5cdGlmICghY29sb3IpIGNvbG9yID0gQ29sb3IuX1dISVRFO1xyXG5cdGlmICghdHgpIHR4ID0gMDtcclxuXHRpZiAoIXR5KSB0eSA9IDA7XHJcblx0XHJcblx0dmFyIGluZCA9IHRoaXMudmVydGljZXMubGVuZ3RoO1xyXG5cdHRoaXMudmVydGljZXMucHVzaChuZXcgVmVjdG9yMyh4LCB5LCB6KSk7XHJcblx0dGhpcy5jb2xvcnMucHVzaChuZXcgQ29sb3IoY29sb3IpKTtcclxuXHR0aGlzLnV2Q29vcmRzLnB1c2gobmV3IFZlY3RvcjIodHgsIHR5KSk7XHJcblx0XHJcblx0cmV0dXJuIGluZDtcclxufTtcclxuXHJcbkdlb21ldHJ5LnByb3RvdHlwZS5hZGRGYWNlID0gZnVuY3Rpb24odmVydGljZV8wLCB2ZXJ0aWNlXzEsIHZlcnRpY2VfMil7XHJcblx0aWYgKCF0aGlzLnZlcnRpY2VzW3ZlcnRpY2VfMF0pIHRocm93IFwiSW52YWxpZCB2ZXJ0ZXggaW5kZXg6IFwiICsgdmVydGljZV8wO1xyXG5cdGlmICghdGhpcy52ZXJ0aWNlc1t2ZXJ0aWNlXzFdKSB0aHJvdyBcIkludmFsaWQgdmVydGV4IGluZGV4OiBcIiArIHZlcnRpY2VfMTtcclxuXHRpZiAoIXRoaXMudmVydGljZXNbdmVydGljZV8yXSkgdGhyb3cgXCJJbnZhbGlkIHZlcnRleCBpbmRleDogXCIgKyB2ZXJ0aWNlXzI7XHJcblx0XHJcblx0dGhpcy50cmlhbmdsZXMucHVzaChuZXcgVmVjdG9yMyh2ZXJ0aWNlXzAsIHZlcnRpY2VfMSwgdmVydGljZV8yKSk7XHJcbn07XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuYWRkTm9ybWFsID0gZnVuY3Rpb24obngsIG55LCBueil7XHJcblx0dGhpcy5ub3JtYWxzLnB1c2gobmV3IFZlY3RvcjMobngsIG55LCBueikpO1xyXG59O1xyXG5cclxuR2VvbWV0cnkucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgdmVydGljZXMgPSBbXTtcclxuXHR2YXIgdXZDb29yZHMgPSBbXTtcclxuXHR2YXIgdHJpYW5nbGVzID0gW107XHJcblx0dmFyIGNvbG9ycyA9IFtdO1xyXG5cdHZhciBub3JtYWxzID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLnZlcnRpY2VzLmxlbmd0aDtpPGxlbjtpKyspeyBcclxuXHRcdHZhciB2ID0gdGhpcy52ZXJ0aWNlc1tpXTsgXHJcblx0XHR2ZXJ0aWNlcy5wdXNoKHYueCwgdi55LCB2LnopOyBcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLnV2Q29vcmRzLmxlbmd0aDtpPGxlbjtpKyspeyBcclxuXHRcdHZhciB2ID0gdGhpcy51dkNvb3Jkc1tpXTsgXHJcblx0XHR1dkNvb3Jkcy5wdXNoKHYueCwgdi55KTsgXHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy50cmlhbmdsZXMubGVuZ3RoO2k8bGVuO2krKyl7IFxyXG5cdFx0dmFyIHQgPSB0aGlzLnRyaWFuZ2xlc1tpXTsgXHJcblx0XHR0cmlhbmdsZXMucHVzaCh0LngsIHQueSwgdC56KTsgXHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy5jb2xvcnMubGVuZ3RoO2k8bGVuO2krKyl7IFxyXG5cdFx0dmFyIGMgPSB0aGlzLmNvbG9yc1tpXS5nZXRSR0JBKCk7IFxyXG5cdFx0XHJcblx0XHRjb2xvcnMucHVzaChjWzBdLCBjWzFdLCBjWzJdLCBjWzNdKTsgXHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy5ub3JtYWxzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIG4gPSB0aGlzLm5vcm1hbHNbaV07XHJcblx0XHRub3JtYWxzLnB1c2gobi54LCBuLnksIG4ueik7XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJBUlJBWV9CVUZGRVJcIiwgbmV3IEZsb2F0MzJBcnJheSh2ZXJ0aWNlcyksIDMpO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJBUlJBWV9CVUZGRVJcIiwgbmV3IEZsb2F0MzJBcnJheSh1dkNvb3JkcyksIDIpO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBLVC5jcmVhdGVBcnJheUJ1ZmZlcihcIkVMRU1FTlRfQVJSQVlfQlVGRkVSXCIsIG5ldyBVaW50MTZBcnJheSh0cmlhbmdsZXMpLCAxKTtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IEtULmNyZWF0ZUFycmF5QnVmZmVyKFwiQVJSQVlfQlVGRkVSXCIsIG5ldyBGbG9hdDMyQXJyYXkoY29sb3JzKSwgNCk7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJBUlJBWV9CVUZGRVJcIiwgbmV3IEZsb2F0MzJBcnJheShub3JtYWxzKSwgMyk7XHJcblx0dGhpcy5yZWFkeSA9IHRydWU7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuY29tcHV0ZUZhY2VzTm9ybWFscyA9IGZ1bmN0aW9uKCl7XHJcblx0dGhpcy5ub3JtYWxzID0gW107XHJcblx0XHJcblx0dmFyIG5vcm1hbGl6ZWRWZXJ0aWNlcyA9IFtdO1xyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy50cmlhbmdsZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgZmFjZSA9IHRoaXMudHJpYW5nbGVzW2ldO1xyXG5cdFx0dmFyIHYwID0gdGhpcy52ZXJ0aWNlc1tmYWNlLnhdO1xyXG5cdFx0dmFyIHYxID0gdGhpcy52ZXJ0aWNlc1tmYWNlLnldO1xyXG5cdFx0dmFyIHYyID0gdGhpcy52ZXJ0aWNlc1tmYWNlLnpdO1xyXG5cdFx0XHJcblx0XHR2YXIgZGlyMSA9IFZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UodjEsIHYwKTtcclxuXHRcdHZhciBkaXIyID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSh2MiwgdjApO1xyXG5cdFx0XHJcblx0XHR2YXIgbm9ybWFsID0gZGlyMS5jcm9zcyhkaXIyKS5ub3JtYWxpemUoKTtcclxuXHRcdFxyXG5cdFx0aWYgKG5vcm1hbGl6ZWRWZXJ0aWNlcy5pbmRleE9mKGZhY2UueCkgPT0gLTEpIHRoaXMubm9ybWFscy5wdXNoKG5vcm1hbCk7XHJcblx0XHRpZiAobm9ybWFsaXplZFZlcnRpY2VzLmluZGV4T2YoZmFjZS55KSA9PSAtMSkgdGhpcy5ub3JtYWxzLnB1c2gobm9ybWFsKTtcclxuXHRcdGlmIChub3JtYWxpemVkVmVydGljZXMuaW5kZXhPZihmYWNlLnopID09IC0xKSB0aGlzLm5vcm1hbHMucHVzaChub3JtYWwpO1xyXG5cdFx0XHJcblx0XHRub3JtYWxpemVkVmVydGljZXMucHVzaChmYWNlLngsIGZhY2UueSwgZmFjZS56KTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbiIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxudmFyIFV0aWxzID0gcmVxdWlyZSgnLi9LVFV0aWxzJyk7XHJcbnZhciBWZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG52YXIgVmVjdG9yNCA9IHJlcXVpcmUoJy4vS1RWZWN0b3I0Jyk7XHJcblxyXG5mdW5jdGlvbiBHZW9tZXRyeTNETW9kZWwoZmlsZVVSTCl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMuZmlsZVVSTCA9IGZpbGVVUkw7XHJcblx0dGhpcy5yZWFkeSA9IGZhbHNlO1xyXG5cdHRoaXMudXZSZWdpb24gPSBuZXcgVmVjdG9yNCgwLjAsIDAuMCwgMS4wLCAxLjApO1xyXG5cdFxyXG5cdHZhciBUID0gdGhpcztcclxuXHRVdGlscy5nZXRGaWxlQ29udGVudChmaWxlVVJMLCBmdW5jdGlvbihmaWxlKXtcclxuXHRcdFQucmVhZHkgPSB0cnVlO1xyXG5cdFx0VC5wYXJzZUZpbGUoZmlsZSk7XHJcblx0fSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnkzRE1vZGVsO1xyXG5cclxuR2VvbWV0cnkzRE1vZGVsLnByb3RvdHlwZS5wYXJzZUZpbGUgPSBmdW5jdGlvbihmaWxlKXtcclxuXHR2YXIgbGluZXMgPSBmaWxlLnNwbGl0KCdcXHJcXG4nKTtcclxuXHR2YXIgdmVydGV4TWluID0gW107XHJcblx0dmFyIHV2Q29vcmRNaW4gPSBbXTtcclxuXHR2YXIgbm9ybWFsTWluID0gW107XHJcblx0dmFyIGluZE1pbiA9IFtdO1xyXG5cdHZhciBnZW9tZXRyeSA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49bGluZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgbCA9IGxpbmVzW2ldLnRyaW0oKTtcclxuXHRcdGwgPSBsLnJlcGxhY2UoJyAgJywgJyAnKTtcclxuXHRcdHZhciBpbmQgPSBsLmNoYXJBdCgwKTtcclxuXHRcdFxyXG5cdFx0dmFyIHAgPSBsLnNwbGl0KCcgJyk7XHJcblx0XHRwLnNwbGljZSgwLDEpO1xyXG5cdFx0XHJcblx0XHRpZiAoaW5kID09ICcjJykgY29udGludWU7XHJcblx0XHRlbHNlIGlmIChpbmQgPT0gJ2cnKSBjb250aW51ZTtcclxuXHRcdGVsc2UgaWYgKGwgPT0gJycpIGNvbnRpbnVlO1xyXG5cdFx0XHJcblx0XHRpZiAobC5pbmRleE9mKCd2ICcpID09IDApe1xyXG5cdFx0XHR2ZXJ0ZXhNaW4ucHVzaCggbmV3IFZlY3RvcjMoXHJcblx0XHRcdFx0cGFyc2VGbG9hdChwWzBdKSxcclxuXHRcdFx0XHRwYXJzZUZsb2F0KHBbMV0pLFxyXG5cdFx0XHRcdHBhcnNlRmxvYXQocFsyXSlcclxuXHRcdFx0KSk7XHJcblx0XHR9ZWxzZSBpZiAobC5pbmRleE9mKCd2biAnKSA9PSAwKXtcclxuXHRcdFx0bm9ybWFsTWluLnB1c2goIG5ldyBWZWN0b3IzKFxyXG5cdFx0XHRcdHBhcnNlRmxvYXQocFswXSksXHJcblx0XHRcdFx0cGFyc2VGbG9hdChwWzFdKSxcclxuXHRcdFx0XHRwYXJzZUZsb2F0KHBbMl0pXHJcblx0XHRcdCkpO1xyXG5cdFx0fWVsc2UgaWYgKGwuaW5kZXhPZigndnQgJykgPT0gMCl7XHJcblx0XHRcdHV2Q29vcmRNaW4ucHVzaCggbmV3IFZlY3RvcjIoXHJcblx0XHRcdFx0cGFyc2VGbG9hdChwWzBdKSxcclxuXHRcdFx0XHRwYXJzZUZsb2F0KHBbMV0pXHJcblx0XHRcdCkpO1xyXG5cdFx0fWVsc2UgaWYgKGwuaW5kZXhPZignZiAnKSA9PSAwKXtcclxuXHRcdFx0aW5kTWluLnB1c2goIG5ldyBWZWN0b3IzKFxyXG5cdFx0XHRcdHBbMF0sXHJcblx0XHRcdFx0cFsxXSxcclxuXHRcdFx0XHRwWzJdXHJcblx0XHRcdCkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPWluZE1pbi5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBpbmQgPSBpbmRNaW5baV07XHJcblx0XHR2YXIgdmVydGV4SW5mbzEgPSBpbmQueC5zcGxpdCgnLycpO1xyXG5cdFx0dmFyIHZlcnRleEluZm8yID0gaW5kLnkuc3BsaXQoJy8nKTtcclxuXHRcdHZhciB2ZXJ0ZXhJbmZvMyA9IGluZC56LnNwbGl0KCcvJyk7XHJcblx0XHRcclxuXHRcdHZhciB2MSA9IHZlcnRleE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvMVswXSkgLSAxXTtcclxuXHRcdHZhciB0MSA9IHV2Q29vcmRNaW5bcGFyc2VJbnQodmVydGV4SW5mbzFbMV0pIC0gMV07XHJcblx0XHR2YXIgbjEgPSBub3JtYWxNaW5bcGFyc2VJbnQodmVydGV4SW5mbzFbMl0pIC0gMV07XHJcblx0XHRcclxuXHRcdHZhciB2MiA9IHZlcnRleE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvMlswXSkgLSAxXTtcclxuXHRcdHZhciB0MiA9IHV2Q29vcmRNaW5bcGFyc2VJbnQodmVydGV4SW5mbzJbMV0pIC0gMV07XHJcblx0XHR2YXIgbjIgPSBub3JtYWxNaW5bcGFyc2VJbnQodmVydGV4SW5mbzJbMl0pIC0gMV07XHJcblx0XHRcclxuXHRcdHZhciB2MyA9IHZlcnRleE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvM1swXSkgLSAxXTtcclxuXHRcdHZhciB0MyA9IHV2Q29vcmRNaW5bcGFyc2VJbnQodmVydGV4SW5mbzNbMV0pIC0gMV07XHJcblx0XHR2YXIgbjMgPSBub3JtYWxNaW5bcGFyc2VJbnQodmVydGV4SW5mbzNbMl0pIC0gMV07XHJcblx0XHRcclxuXHRcdHZhciBpMSA9IGdlb21ldHJ5LmFkZFZlcnRpY2UodjEueCwgdjEueSwgdjEueiwgQ29sb3IuX1dISVRFLCB0MS54LCB0MS55KTtcclxuXHRcdHZhciBpMiA9IGdlb21ldHJ5LmFkZFZlcnRpY2UodjIueCwgdjIueSwgdjIueiwgQ29sb3IuX1dISVRFLCB0Mi54LCB0Mi55KTtcclxuXHRcdHZhciBpMyA9IGdlb21ldHJ5LmFkZFZlcnRpY2UodjMueCwgdjMueSwgdjMueiwgQ29sb3IuX1dISVRFLCB0My54LCB0My55KTtcclxuXHRcdFxyXG5cdFx0Z2VvbWV0cnkuYWRkTm9ybWFsKG4xLngsIG4xLnksIG4xLnopO1xyXG5cdFx0Z2VvbWV0cnkuYWRkTm9ybWFsKG4yLngsIG4yLnksIG4yLnopO1xyXG5cdFx0Z2VvbWV0cnkuYWRkTm9ybWFsKG4zLngsIG4zLnksIG4zLnopO1xyXG5cdFx0XHJcblx0XHRnZW9tZXRyeS5hZGRGYWNlKGkxLCBpMiwgaTMpO1xyXG5cdH1cclxuXHRcclxuXHRnZW9tZXRyeS5idWlsZCgpO1xyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gZ2VvbWV0cnkudmVydGV4QnVmZmVyO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gZ2VvbWV0cnkudGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBnZW9tZXRyeS5mYWNlc0J1ZmZlcjtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IGdlb21ldHJ5LmNvbG9yc0J1ZmZlcjtcclxuXHR0aGlzLm5vcm1hbHNCdWZmZXIgPSBnZW9tZXRyeS5ub3JtYWxzQnVmZmVyO1xyXG59O1xyXG4iLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbnZhciBWZWN0b3I0ID0gcmVxdWlyZSgnLi9LVFZlY3RvcjQnKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5Qm94KHdpZHRoLCBsZW5ndGgsIGhlaWdodCwgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0dGhpcy5yZWFkeSA9IHRydWU7XHJcblx0XHJcblx0dmFyIGJveEdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdHZhciB3ID0gd2lkdGggLyAyO1xyXG5cdHZhciBsID0gbGVuZ3RoIC8gMjtcclxuXHR2YXIgaCA9IGhlaWdodCAvIDI7XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cdFxyXG5cdHRoaXMudXZSZWdpb24gPSAocGFyYW1zLnV2UmVnaW9uKT8gcGFyYW1zLnV2UmVnaW9uIDogbmV3IFZlY3RvcjQoMC4wLCAwLjAsIDEuMCwgMS4wKTtcclxuXHR0aGlzLmNvbG9yVG9wID0gKHBhcmFtcy5jb2xvclRvcCk/IHBhcmFtcy5jb2xvclRvcCA6IENvbG9yLl9XSElURTtcclxuXHR0aGlzLmNvbG9yQm90dG9tID0gKHBhcmFtcy5jb2xvckJvdHRvbSk/IHBhcmFtcy5jb2xvckJvdHRvbSA6IENvbG9yLl9XSElURTtcclxuXHRcclxuXHR2YXIgeHIgPSB0aGlzLnV2UmVnaW9uLng7XHJcblx0dmFyIHlyID0gdGhpcy51dlJlZ2lvbi55O1xyXG5cdHZhciBociA9IHRoaXMudXZSZWdpb24uejtcclxuXHR2YXIgdnIgPSB0aGlzLnV2UmVnaW9uLnc7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAgbCwgdGhpcy5jb2xvckJvdHRvbSwgaHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgIGgsICBsLCB0aGlzLmNvbG9yVG9wLCB4ciwgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgIGwsIHRoaXMuY29sb3JCb3R0b20sIHhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAgbCwgdGhpcy5jb2xvclRvcCwgaHIsIHZyKTtcclxuXHRcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgLWgsIC1sLCB0aGlzLmNvbG9yQm90dG9tLCB4ciwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgLWwsIHRoaXMuY29sb3JUb3AsIHhyLCB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAtbCwgdGhpcy5jb2xvckJvdHRvbSwgaHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgIGgsIC1sLCB0aGlzLmNvbG9yVG9wLCBociwgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgLWwsIHRoaXMuY29sb3JCb3R0b20sIGhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAgbCwgdGhpcy5jb2xvclRvcCwgeHIsIHZyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgLWgsICBsLCB0aGlzLmNvbG9yQm90dG9tLCB4ciwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgLWwsIHRoaXMuY29sb3JUb3AsIGhyLCB2cik7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAgbCwgdGhpcy5jb2xvckJvdHRvbSwgaHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgIGgsICBsLCB0aGlzLmNvbG9yVG9wLCBociwgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgLWwsIHRoaXMuY29sb3JCb3R0b20sIHhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAtbCwgdGhpcy5jb2xvclRvcCwgeHIsIHZyKTtcclxuXHRcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgIGgsICBsLCB0aGlzLmNvbG9yVG9wLCBociwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgLWwsIHRoaXMuY29sb3JUb3AsIHhyLCB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAgbCwgdGhpcy5jb2xvclRvcCwgeHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgIGgsIC1sLCB0aGlzLmNvbG9yVG9wLCBociwgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgIGwsIHRoaXMuY29sb3JCb3R0b20sIHhyLCB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAtbCwgdGhpcy5jb2xvckJvdHRvbSwgeHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgLWgsICBsLCB0aGlzLmNvbG9yQm90dG9tLCBociwgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgLWwsIHRoaXMuY29sb3JCb3R0b20sIGhyLCB5cik7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMCwgMSwgMik7XHJcblx0Ym94R2VvLmFkZEZhY2UoMCwgMywgMSk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoNCwgNSwgNik7XHJcblx0Ym94R2VvLmFkZEZhY2UoNSwgNywgNik7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoOCwgOSwgMTApO1xyXG5cdGJveEdlby5hZGRGYWNlKDgsIDExLCA5KTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSgxMiwgMTMsIDE0KTtcclxuXHRib3hHZW8uYWRkRmFjZSgxMywgMTUsIDE0KTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSgxNiwgMTcsIDE4KTtcclxuXHRib3hHZW8uYWRkRmFjZSgxNiwgMTksIDE3KTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSgyMCwgMjEsIDIyKTtcclxuXHRib3hHZW8uYWRkRmFjZSgyMSwgMjMsIDIyKTtcclxuXHRcclxuXHRib3hHZW8uY29tcHV0ZUZhY2VzTm9ybWFscygpO1xyXG5cdGJveEdlby5idWlsZCgpO1xyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gYm94R2VvLnZlcnRleEJ1ZmZlcjtcclxuXHR0aGlzLnRleEJ1ZmZlciA9IGJveEdlby50ZXhCdWZmZXI7XHJcblx0dGhpcy5mYWNlc0J1ZmZlciA9IGJveEdlby5mYWNlc0J1ZmZlcjtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IGJveEdlby5jb2xvcnNCdWZmZXI7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gYm94R2VvLm5vcm1hbHNCdWZmZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnlCb3g7IiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG52YXIgVmVjdG9yNCA9IHJlcXVpcmUoJy4vS1RWZWN0b3I0Jyk7XHJcbnZhciBLVE1hdGggPSByZXF1aXJlKCcuL0tUTWF0aCcpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlDeWxpbmRlcihyYWRpdXNUb3AsIHJhZGl1c0JvdHRvbSwgaGVpZ2h0LCB3aWR0aFNlZ21lbnRzLCBoZWlnaHRTZWdtZW50cywgb3BlblRvcCwgb3BlbkJvdHRvbSwgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0dGhpcy5yZWFkeSA9IHRydWU7XHJcblx0XHJcblx0dmFyIGN5bEdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHRcclxuXHR0aGlzLnV2UmVnaW9uID0gKHBhcmFtcy51dlJlZ2lvbik/IHBhcmFtcy51dlJlZ2lvbiA6IG5ldyBWZWN0b3I0KDAuMCwgMC4wLCAxLjAsIDEuMCk7XHJcblx0XHJcblx0dmFyIHhyID0gdGhpcy51dlJlZ2lvbi54O1xyXG5cdHZhciB5ciA9IHRoaXMudXZSZWdpb24ueTtcclxuXHR2YXIgaHIgPSB0aGlzLnV2UmVnaW9uLnogLSB4cjtcclxuXHR2YXIgdnIgPSB0aGlzLnV2UmVnaW9uLncgLSB5cjtcclxuXHRcclxuXHR2YXIgaCA9IGhlaWdodCAvIDI7XHJcblx0XHJcblx0dmFyIGJhbmRXID0gS1RNYXRoLlBJMiAvICh3aWR0aFNlZ21lbnRzIC0gMSk7XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8d2lkdGhTZWdtZW50cztpKyspe1xyXG5cdFx0dmFyIHgxID0gTWF0aC5jb3MoYmFuZFcgKiBpKTtcclxuXHRcdHZhciB5MSA9IC1oO1xyXG5cdFx0dmFyIHoxID0gLU1hdGguc2luKGJhbmRXICogaSk7XHJcblx0XHR2YXIgeDIgPSBNYXRoLmNvcyhiYW5kVyAqIGkpO1xyXG5cdFx0dmFyIHkyID0gaDtcclxuXHRcdHZhciB6MiA9IC1NYXRoLnNpbihiYW5kVyAqIGkpO1xyXG5cdFx0XHJcblx0XHR2YXIgeHQgPSBpIC8gKHdpZHRoU2VnbWVudHMgLSAxKTtcclxuXHRcdFxyXG5cdFx0Y3lsR2VvLmFkZE5vcm1hbCh4MSwgMCwgejEpO1xyXG5cdFx0Y3lsR2VvLmFkZE5vcm1hbCh4MiwgMCwgejIpO1xyXG5cdFx0XHJcblx0XHR4MSAqPSByYWRpdXNCb3R0b207XHJcblx0XHR6MSAqPSByYWRpdXNCb3R0b207XHJcblx0XHR4MiAqPSByYWRpdXNUb3A7XHJcblx0XHR6MiAqPSByYWRpdXNUb3A7XHJcblx0XHRcclxuXHRcdGN5bEdlby5hZGRWZXJ0aWNlKCB4MSwgeTEsIHoxLCBDb2xvci5fV0hJVEUsIHhyICsgKHh0ICogaHIpLCB5cik7XHJcblx0XHRjeWxHZW8uYWRkVmVydGljZSggeDIsIHkyLCB6MiwgQ29sb3IuX1dISVRFLCB4ciArICh4dCAqIGhyKSwgeXIgKyB2cik7XHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPHdpZHRoU2VnbWVudHMqMiAtIDI7aSs9Mil7XHJcblx0XHR2YXIgaTEgPSBpO1xyXG5cdFx0dmFyIGkyID0gaSsxO1xyXG5cdFx0dmFyIGkzID0gaSsyO1xyXG5cdFx0dmFyIGk0ID0gaSszO1xyXG5cdFx0XHJcblx0XHRjeWxHZW8uYWRkRmFjZShpMywgaTIsIGkxKTtcclxuXHRcdGN5bEdlby5hZGRGYWNlKGkzLCBpNCwgaTIpO1xyXG5cdH1cclxuXHRcclxuXHRpZiAoIW9wZW5Ub3AgfHwgIW9wZW5Cb3R0b20pe1xyXG5cdFx0dmFyIGkxID0gY3lsR2VvLmFkZFZlcnRpY2UoIDAsIGgsIDAsIENvbG9yLl9XSElURSwgeHIgKyAoMC41ICogaHIpLCB5ciArICgwLjUgKiB2cikpO1xyXG5cdFx0dmFyIGkyID0gY3lsR2VvLmFkZFZlcnRpY2UoIDAsIC1oLCAwLCBDb2xvci5fV0hJVEUsIHhyICsgKDAuNSAqIGhyKSwgeXIgKyAoMC41ICogdnIpKTtcclxuXHRcdGN5bEdlby5hZGROb3JtYWwoMCwgIDEsIDApO1xyXG5cdFx0Y3lsR2VvLmFkZE5vcm1hbCgwLCAtMSwgMCk7XHJcblx0XHRmb3IgKHZhciBpPTA7aTx3aWR0aFNlZ21lbnRzKjIgLSAyO2krPTIpe1xyXG5cdFx0XHR2YXIgdjEgPSBjeWxHZW8udmVydGljZXNbaSArIDFdO1xyXG5cdFx0XHR2YXIgdjIgPSBjeWxHZW8udmVydGljZXNbaSArIDNdO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHR4MSA9IHhyICsgKHYxLnggLyAyICsgMC41KSAqIGhyO1xyXG5cdFx0XHR2YXIgdHkxID0geXIgKyAodjEueiAvIDIgKyAwLjUpICogdnI7XHJcblx0XHRcdHZhciB0eDIgPSB4ciArICh2Mi54IC8gMiArIDAuNSkgKiBocjtcclxuXHRcdFx0dmFyIHR5MiA9IHlyICsgKHYyLnogLyAyICsgMC41KSAqIHZyO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKCFvcGVuVG9wKXtcclxuXHRcdFx0XHR2YXIgaTMgPSBjeWxHZW8uYWRkVmVydGljZSggdjEueCwgaCwgdjEueiwgQ29sb3IuX1dISVRFLCB0eDEsIHR5MSk7XHJcblx0XHRcdFx0dmFyIGk0ID0gY3lsR2VvLmFkZFZlcnRpY2UoIHYyLngsIGgsIHYyLnosIENvbG9yLl9XSElURSwgdHgyLCB0eTIpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGN5bEdlby5hZGROb3JtYWwoMCwgMSwgMCk7XHJcblx0XHRcdFx0Y3lsR2VvLmFkZE5vcm1hbCgwLCAxLCAwKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRjeWxHZW8uYWRkRmFjZShpNCwgaTEsIGkzKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKCFvcGVuQm90dG9tKXtcclxuXHRcdFx0XHR2YXIgaTMgPSBjeWxHZW8uYWRkVmVydGljZSggdjEueCwgLWgsIHYxLnosIENvbG9yLl9XSElURSwgdHgxLCB0eTEpO1xyXG5cdFx0XHRcdHZhciBpNCA9IGN5bEdlby5hZGRWZXJ0aWNlKCB2Mi54LCAtaCwgdjIueiwgQ29sb3IuX1dISVRFLCB0eDIsIHR5Mik7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Y3lsR2VvLmFkZE5vcm1hbCgwLCAtMSwgMCk7XHJcblx0XHRcdFx0Y3lsR2VvLmFkZE5vcm1hbCgwLCAtMSwgMCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Y3lsR2VvLmFkZEZhY2UoaTMsIGkyLCBpNCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Y3lsR2VvLmJ1aWxkKCk7XHJcblx0XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgPSBjeWxHZW8udmVydGV4QnVmZmVyO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gY3lsR2VvLnRleEJ1ZmZlcjtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gY3lsR2VvLmZhY2VzQnVmZmVyO1xyXG5cdHRoaXMuY29sb3JzQnVmZmVyID0gY3lsR2VvLmNvbG9yc0J1ZmZlcjtcclxuXHR0aGlzLm5vcm1hbHNCdWZmZXIgPSBjeWxHZW8ubm9ybWFsc0J1ZmZlcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeUN5bGluZGVyOyIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxudmFyIFZlY3RvcjQgPSByZXF1aXJlKCcuL0tUVmVjdG9yNCcpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlHVUlUZXh0dXJlKHdpZHRoLCBoZWlnaHQsIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdHRoaXMucmVhZHkgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBndWlUZXggPSBuZXcgR2VvbWV0cnkoKTtcclxuXHRcclxuXHR2YXIgeDEgPSAwLjA7XHJcblx0dmFyIHkxID0gMC4wO1xyXG5cdHZhciB4MiA9IHdpZHRoO1xyXG5cdHZhciB5MiA9IGhlaWdodDtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0XHJcblx0dGhpcy51dlJlZ2lvbiA9IChwYXJhbXMudXZSZWdpb24pPyBwYXJhbXMudXZSZWdpb24gOiBuZXcgVmVjdG9yNCgwLjAsIDAuMCwgMS4wLCAxLjApO1xyXG5cdFxyXG5cdHZhciB4ciA9IHRoaXMudXZSZWdpb24ueDtcclxuXHR2YXIgeXIgPSB0aGlzLnV2UmVnaW9uLnk7XHJcblx0dmFyIGhyID0gdGhpcy51dlJlZ2lvbi56O1xyXG5cdHZhciB2ciA9IHRoaXMudXZSZWdpb24udztcclxuXHRcclxuXHRndWlUZXguYWRkVmVydGljZSh4MiwgeTEsIDAuMCwgQ29sb3IuX1dISVRFLCBociwgeXIpO1xyXG5cdGd1aVRleC5hZGRWZXJ0aWNlKHgxLCB5MiwgMC4wLCBDb2xvci5fV0hJVEUsIHhyLCB2cik7XHJcblx0Z3VpVGV4LmFkZFZlcnRpY2UoeDEsIHkxLCAwLjAsIENvbG9yLl9XSElURSwgeHIsIHlyKTtcclxuXHRndWlUZXguYWRkVmVydGljZSh4MiwgeTIsIDAuMCwgQ29sb3IuX1dISVRFLCBociwgdnIpO1xyXG5cdFxyXG5cdGd1aVRleC5hZGRGYWNlKDAsIDEsIDIpO1xyXG5cdGd1aVRleC5hZGRGYWNlKDAsIDMsIDEpO1xyXG5cdFxyXG5cdGd1aVRleC5jb21wdXRlRmFjZXNOb3JtYWxzKCk7XHJcblx0Z3VpVGV4LmJ1aWxkKCk7XHJcblx0XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgPSBndWlUZXgudmVydGV4QnVmZmVyO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gZ3VpVGV4LnRleEJ1ZmZlcjtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gZ3VpVGV4LmZhY2VzQnVmZmVyO1xyXG5cdHRoaXMuY29sb3JzQnVmZmVyID0gZ3VpVGV4LmNvbG9yc0J1ZmZlcjtcclxuXHR0aGlzLm5vcm1hbHNCdWZmZXIgPSBndWlUZXgubm9ybWFsc0J1ZmZlcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeUdVSVRleHR1cmU7IiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG52YXIgVmVjdG9yNCA9IHJlcXVpcmUoJy4vS1RWZWN0b3I0Jyk7XHJcblxyXG5mdW5jdGlvbiBHZW9tZXRyeVBsYW5lKHdpZHRoLCBoZWlnaHQsIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdHRoaXMucmVhZHkgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBwbGFuZUdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdHZhciB3ID0gd2lkdGggLyAyO1xyXG5cdHZhciBoID0gaGVpZ2h0IC8gMjtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0XHJcblx0dGhpcy51dlJlZ2lvbiA9IChwYXJhbXMudXZSZWdpb24pPyBwYXJhbXMudXZSZWdpb24gOiBuZXcgVmVjdG9yNCgwLjAsIDAuMCwgMS4wLCAxLjApO1xyXG5cdFxyXG5cdHZhciB4ciA9IHRoaXMudXZSZWdpb24ueDtcclxuXHR2YXIgeXIgPSB0aGlzLnV2UmVnaW9uLnk7XHJcblx0dmFyIGhyID0gdGhpcy51dlJlZ2lvbi56O1xyXG5cdHZhciB2ciA9IHRoaXMudXZSZWdpb24udztcclxuXHRcclxuXHRwbGFuZUdlby5hZGRWZXJ0aWNlKCB3LCAwLCAgaCwgQ29sb3IuX1dISVRFLCBociwgeXIpO1xyXG5cdHBsYW5lR2VvLmFkZFZlcnRpY2UoLXcsIDAsIC1oLCBDb2xvci5fV0hJVEUsIHhyLCB2cik7XHJcblx0cGxhbmVHZW8uYWRkVmVydGljZSgtdywgMCwgIGgsIENvbG9yLl9XSElURSwgeHIsIHlyKTtcclxuXHRwbGFuZUdlby5hZGRWZXJ0aWNlKCB3LCAwLCAtaCwgQ29sb3IuX1dISVRFLCBociwgdnIpO1xyXG5cdFxyXG5cdHBsYW5lR2VvLmFkZEZhY2UoMCwgMSwgMik7XHJcblx0cGxhbmVHZW8uYWRkRmFjZSgwLCAzLCAxKTtcclxuXHRcclxuXHRwbGFuZUdlby5jb21wdXRlRmFjZXNOb3JtYWxzKCk7XHJcblx0cGxhbmVHZW8uYnVpbGQoKTtcclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IHBsYW5lR2VvLnZlcnRleEJ1ZmZlcjtcclxuXHR0aGlzLnRleEJ1ZmZlciA9IHBsYW5lR2VvLnRleEJ1ZmZlcjtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gcGxhbmVHZW8uZmFjZXNCdWZmZXI7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBwbGFuZUdlby5jb2xvcnNCdWZmZXI7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gcGxhbmVHZW8ubm9ybWFsc0J1ZmZlcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeVBsYW5lOyIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxudmFyIFZlY3RvcjQgPSByZXF1aXJlKCcuL0tUVmVjdG9yNCcpO1xyXG52YXIgTWF0ZXJpYWxCYXNpYyA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbEJhc2ljJyk7XHJcbnZhciBNZXNoID0gcmVxdWlyZSgnLi9LVE1lc2gnKTtcclxudmFyIEdlb21ldHJ5UGxhbmUgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnlQbGFuZScpO1xyXG52YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlTa3lib3god2lkdGgsIGhlaWdodCwgbGVuZ3RoLCBwb3NpdGlvbiwgdGV4dHVyZXMpe1xyXG5cdHRoaXMubWVzaGVzID0gW107XHJcblx0aWYgKCF0ZXh0dXJlcykgdGV4dHVyZXMgPSBbXTtcclxuXHRcclxuXHR2YXIgdyA9IHdpZHRoIC8gMjtcclxuXHR2YXIgbCA9IGxlbmd0aCAvIDI7XHJcblx0dmFyIGggPSBoZWlnaHQgLyAyO1xyXG5cdHZhciB2ID0gMS4wO1xyXG5cdFxyXG5cdHZhciB4ciA9IDAuMDtcclxuXHR2YXIgeXIgPSAwLjA7XHJcblx0dmFyIGhyID0gMS4wO1xyXG5cdHZhciB2ciA9IDEuMDtcclxuXHRcclxuXHR2YXIgY3QgPSBDb2xvci5fV0hJVEU7XHJcblx0dmFyIGNiID0gQ29sb3IuX1dISVRFO1xyXG5cdFxyXG5cdHZhciBnZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHR2YXIgbWF0ID0gbmV3IE1hdGVyaWFsQmFzaWModGV4dHVyZXNbS1QuVEVYVFVSRV9GUk9OVF0sIENvbG9yLl9XSElURSk7XHJcblx0Z2VvLmFkZFZlcnRpY2UoLXcgLXYsIC1oIC12LCAgbCwgY2IsIGhyLCB5cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoIHcgK3YsICBoICt2LCAgbCwgY3QsIHhyLCB2cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoIHcgK3YsIC1oIC12LCAgbCwgY2IsIHhyLCB5cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoLXcgLXYsICBoICt2LCAgbCwgY3QsIGhyLCB2cik7XHJcblx0Z2VvLmFkZEZhY2UoMCwgMSwgMik7XHJcblx0Z2VvLmFkZEZhY2UoMCwgMywgMSk7XHJcblx0Z2VvLmJ1aWxkKCk7XHJcblx0dGhpcy5tZXNoZXMucHVzaChuZXcgTWVzaChnZW8sIG1hdCkpO1xyXG5cdFxyXG5cdHZhciBnZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHR2YXIgbWF0ID0gbmV3IE1hdGVyaWFsQmFzaWModGV4dHVyZXNbS1QuVEVYVFVSRV9CQUNLXSwgQ29sb3IuX1dISVRFKTtcclxuXHRnZW8uYWRkVmVydGljZSgtdyAtdiwgLWggLXYsIC1sLCBjYiwgeHIsIHlyKTtcclxuXHRnZW8uYWRkVmVydGljZSgtdyAtdiwgIGggK3YsIC1sLCBjdCwgeHIsIHZyKTtcclxuXHRnZW8uYWRkVmVydGljZSggdyArdiwgLWggLXYsIC1sLCBjYiwgaHIsIHlyKTtcclxuXHRnZW8uYWRkVmVydGljZSggdyArdiwgIGggK3YsIC1sLCBjdCwgaHIsIHZyKTtcclxuXHRnZW8uYWRkRmFjZSgwLCAyLCAxKTtcclxuXHRnZW8uYWRkRmFjZSgyLCAzLCAxKTtcclxuXHRnZW8uYnVpbGQoKTtcclxuXHR0aGlzLm1lc2hlcy5wdXNoKG5ldyBNZXNoKGdlbywgbWF0KSk7XHJcblx0XHJcblx0dmFyIGdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdHZhciBtYXQgPSBuZXcgTWF0ZXJpYWxCYXNpYyh0ZXh0dXJlc1tLVC5URVhUVVJFX1JJR0hUXSwgQ29sb3IuX1dISVRFKTtcclxuXHRnZW8uYWRkVmVydGljZSggdywgLWggLXYsICBsICt2LCBjYiwgaHIsIHlyKTtcclxuXHRnZW8uYWRkVmVydGljZSggdywgIGggK3YsIC1sIC12LCBjdCwgeHIsIHZyKTtcclxuXHRnZW8uYWRkVmVydGljZSggdywgLWggLXYsIC1sIC12LCBjYiwgeHIsIHlyKTtcclxuXHRnZW8uYWRkVmVydGljZSggdywgIGggK3YsICBsICt2LCBjdCwgaHIsIHZyKTtcclxuXHRnZW8uYWRkRmFjZSgwLCAxLCAyKTtcclxuXHRnZW8uYWRkRmFjZSgwLCAzLCAxKTtcclxuXHRnZW8uYnVpbGQoKTtcclxuXHR0aGlzLm1lc2hlcy5wdXNoKG5ldyBNZXNoKGdlbywgbWF0KSk7XHJcblx0XHJcblx0dmFyIGdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdHZhciBtYXQgPSBuZXcgTWF0ZXJpYWxCYXNpYyh0ZXh0dXJlc1tLVC5URVhUVVJFX0xFRlRdLCBDb2xvci5fV0hJVEUpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13LCAtaCAtdiwgLWwgLXYsIGNiLCBociwgeXIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13LCAgaCArdiwgLWwgLXYsIGN0LCBociwgdnIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13LCAtaCAtdiwgIGwgK3YsIGNiLCB4ciwgeXIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13LCAgaCArdiwgIGwgK3YsIGN0LCB4ciwgdnIpO1xyXG5cdGdlby5hZGRGYWNlKDAsIDEsIDIpO1xyXG5cdGdlby5hZGRGYWNlKDEsIDMsIDIpO1xyXG5cdGdlby5idWlsZCgpO1xyXG5cdHRoaXMubWVzaGVzLnB1c2gobmV3IE1lc2goZ2VvLCBtYXQpKTtcclxuXHRcclxuXHR2YXIgZ2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0dmFyIG1hdCA9IG5ldyBNYXRlcmlhbEJhc2ljKHRleHR1cmVzW0tULlRFWFRVUkVfVVBdLCBDb2xvci5fV0hJVEUpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKCB3ICt2LCAgaCwgLWwgLXYsIGN0LCBociwgeXIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13IC12LCAgaCwgIGwgK3YsIGN0LCB4ciwgdnIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13IC12LCAgaCwgLWwgLXYsIGN0LCB4ciwgeXIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKCB3ICt2LCAgaCwgIGwgK3YsIGN0LCBociwgdnIpO1xyXG5cdGdlby5hZGRGYWNlKDAsIDEsIDIpO1xyXG5cdGdlby5hZGRGYWNlKDAsIDMsIDEpO1xyXG5cdGdlby5idWlsZCgpO1xyXG5cdHRoaXMubWVzaGVzLnB1c2gobmV3IE1lc2goZ2VvLCBtYXQpKTtcclxuXHRcclxuXHR2YXIgZ2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0dmFyIG1hdCA9IG5ldyBNYXRlcmlhbEJhc2ljKHRleHR1cmVzW0tULlRFWFRVUkVfRE9XTl0sIENvbG9yLl9XSElURSk7XHJcblx0bWF0LmRyYXdGYWNlcyA9ICdCT1RIJztcclxuXHRnZW8uYWRkVmVydGljZSggdyArdiwgLWgsIC1sIC12LCBjYiwgaHIsIHZyKTtcclxuXHRnZW8uYWRkVmVydGljZSgtdyAtdiwgLWgsICBsICt2LCBjYiwgeHIsIHlyKTtcclxuXHRnZW8uYWRkVmVydGljZSgtdyAtdiwgLWgsIC1sIC12LCBjYiwgeHIsIHZyKTtcclxuXHRnZW8uYWRkVmVydGljZSggdyArdiwgLWgsICBsICt2LCBjYiwgaHIsIHlyKTtcclxuXHRnZW8uYWRkRmFjZSgwLCAyLCAxKTtcclxuXHRnZW8uYWRkRmFjZSgwLCAxLCAzKTtcclxuXHRnZW8uY29tcHV0ZUZhY2VzTm9ybWFscygpO1xyXG5cdGdlby5idWlsZCgpO1xyXG5cdHRoaXMubWVzaGVzLnB1c2gobmV3IE1lc2goZ2VvLCBtYXQpKTtcclxuXHRcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTw2O2krKyl7XHJcblx0XHR0aGlzLm1lc2hlc1tpXS5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeVNreWJveDsiLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbnZhciBWZWN0b3I0ID0gcmVxdWlyZSgnLi9LVFZlY3RvcjQnKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5U3BoZXJlKHJhZGl1cywgbGF0QmFuZHMsIGxvbkJhbmRzLCBwYXJhbXMpe1xyXG5cdHRoaXMuX19rdGdlb21ldHJ5ID0gdHJ1ZTtcclxuXHR0aGlzLnJlYWR5ID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgc3BoR2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cdFxyXG5cdHRoaXMudXZSZWdpb24gPSAocGFyYW1zLnV2UmVnaW9uKT8gcGFyYW1zLnV2UmVnaW9uIDogbmV3IFZlY3RvcjQoMC4wLCAwLjAsIDEuMCwgMS4wKTtcclxuXHRcclxuXHR2YXIgeHIgPSB0aGlzLnV2UmVnaW9uLng7XHJcblx0dmFyIHlyID0gdGhpcy51dlJlZ2lvbi55O1xyXG5cdHZhciBociA9IHRoaXMudXZSZWdpb24ueiAtIHhyO1xyXG5cdHZhciB2ciA9IHRoaXMudXZSZWdpb24udyAtIHlyO1xyXG5cdHZhciBocyA9IChwYXJhbXMuaGFsZlNwaGVyZSk/IDEuMCA6IDIuMDtcclxuXHRcclxuXHRmb3IgKHZhciBsYXROPTA7bGF0Tjw9bGF0QmFuZHM7bGF0TisrKXtcclxuXHRcdHZhciB0aGV0YSA9IGxhdE4gKiBNYXRoLlBJIC8gbGF0QmFuZHM7XHJcblx0XHR2YXIgY29zVCA9IE1hdGguY29zKHRoZXRhKTtcclxuXHRcdHZhciBzaW5UID0gTWF0aC5zaW4odGhldGEpO1xyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBsb25OPTA7bG9uTjw9bG9uQmFuZHM7bG9uTisrKXtcclxuXHRcdFx0dmFyIHBoaSA9IGxvbk4gKiBocyAqIE1hdGguUEkgLyBsb25CYW5kcztcclxuXHRcdFx0dmFyIGNvc1AgPSBNYXRoLmNvcyhwaGkpO1xyXG5cdFx0XHR2YXIgc2luUCA9IE1hdGguc2luKHBoaSk7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgeCA9IGNvc1AgKiBzaW5UO1xyXG5cdFx0XHR2YXIgeSA9IGNvc1Q7XHJcblx0XHRcdHZhciB6ID0gc2luUCAqIHNpblQ7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgdHggPSBsb25OIC8gbG9uQmFuZHM7XHJcblx0XHRcdHZhciB0eSA9IDEgLSBsYXROIC8gbGF0QmFuZHM7XHJcblx0XHRcdFxyXG5cdFx0XHRzcGhHZW8uYWRkTm9ybWFsKHgsIHksIHopO1xyXG5cdFx0XHRzcGhHZW8uYWRkVmVydGljZSh4ICogcmFkaXVzLCB5ICogcmFkaXVzLCB6ICogcmFkaXVzLCBDb2xvci5fV0hJVEUsIHhyICsgdHggKiBociwgeXIgKyB0eSAqIHZyKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgbGF0Tj0wO2xhdE48bGF0QmFuZHM7bGF0TisrKXtcclxuXHRcdGZvciAodmFyIGxvbk49MDtsb25OPGxvbkJhbmRzO2xvbk4rKyl7XHJcblx0XHRcdHZhciBpMSA9IGxvbk4gKyAobGF0TiAqIChsb25CYW5kcyArIDEpKTtcclxuXHRcdFx0dmFyIGkyID0gaTEgKyBsb25CYW5kcyArIDE7XHJcblx0XHRcdHZhciBpMyA9IGkxICsgMTtcclxuXHRcdFx0dmFyIGk0ID0gaTIgKyAxO1xyXG5cdFx0XHRcclxuXHRcdFx0c3BoR2VvLmFkZEZhY2UoaTQsIGkxLCBpMyk7XHJcblx0XHRcdHNwaEdlby5hZGRGYWNlKGk0LCBpMiwgaTEpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRzcGhHZW8uYnVpbGQoKTtcclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IHNwaEdlby52ZXJ0ZXhCdWZmZXI7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBzcGhHZW8udGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBzcGhHZW8uZmFjZXNCdWZmZXI7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBzcGhHZW8uY29sb3JzQnVmZmVyO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IHNwaEdlby5ub3JtYWxzQnVmZmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5U3BoZXJlOyIsInZhciBVdGlscyA9IHJlcXVpcmUoJy4vS1RVdGlscycpO1xyXG52YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcblxyXG52YXIgSW5wdXQgPSB7XHJcblx0X2tleXM6IFtdLFxyXG5cdF9tb3VzZToge1xyXG5cdFx0bGVmdDogMCxcclxuXHRcdHJpZ2h0OiAwLFxyXG5cdFx0bWlkZGxlOiAwLFxyXG5cdFx0d2hlZWw6IDAsXHJcblx0XHRwb3NpdGlvbjogbmV3IFZlY3RvcjIoMC4wLCAwLjApXHJcblx0fSxcclxuXHRcclxuXHR2S2V5OiB7XHJcblx0XHRTSElGVDogMTYsXHJcblx0XHRUQUI6IDksXHJcblx0XHRDVFJMOiAxNyxcclxuXHRcdEFMVDogMTgsXHJcblx0XHRTUEFDRTogMzIsXHJcblx0XHRFTlRFUjogMTMsXHJcblx0XHRCQUNLU1BBQ0U6IDgsXHJcblx0XHRFU0M6IDI3LFxyXG5cdFx0SU5TRVJUOiA0NSxcclxuXHRcdERFTDogNDYsXHJcblx0XHRFTkQ6IDM1LFxyXG5cdFx0U1RBUlQ6IDM2LFxyXG5cdFx0UEFHRVVQOiAzMyxcclxuXHRcdFBBR0VET1dOOiAzNFxyXG5cdH0sXHJcblx0XHJcblx0dk1vdXNlOiB7XHJcblx0XHRMRUZUOiAnbGVmdCcsXHJcblx0XHRSSUdIVDogJ3JpZ2h0JyxcclxuXHRcdE1JRERMRTogJ21pZGRsZScsXHJcblx0XHRXSEVFTFVQOiAxLFxyXG5cdFx0V0hFRUxET1dOOiAtMSxcclxuXHR9LFxyXG5cdFxyXG5cdGlzS2V5RG93bjogZnVuY3Rpb24oa2V5Q29kZSl7XHJcblx0XHRyZXR1cm4gKElucHV0Ll9rZXlzW2tleUNvZGVdID09IDEpO1xyXG5cdH0sXHJcblx0XHJcblx0aXNLZXlQcmVzc2VkOiBmdW5jdGlvbihrZXlDb2RlKXtcclxuXHRcdGlmIChJbnB1dC5fa2V5c1trZXlDb2RlXSA9PSAxKXtcclxuXHRcdFx0SW5wdXQuX2tleXNba2V5Q29kZV0gPSAyO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0aXNNb3VzZURvd246IGZ1bmN0aW9uKG1vdXNlQnV0dG9uKXtcclxuXHRcdHJldHVybiAoSW5wdXQuX21vdXNlW21vdXNlQnV0dG9uXSA9PSAxKTtcclxuXHR9LFxyXG5cdFxyXG5cdGlzTW91c2VQcmVzc2VkOiBmdW5jdGlvbihtb3VzZUJ1dHRvbil7XHJcblx0XHRpZiAoSW5wdXQuX21vdXNlW21vdXNlQnV0dG9uXSA9PSAxKXtcclxuXHRcdFx0SW5wdXQuX21vdXNlW21vdXNlQnV0dG9uXSA9IDI7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRpc1doZWVsTW92ZWQ6IGZ1bmN0aW9uKHdoZWVsRGlyKXtcclxuXHRcdGlmIChJbnB1dC5fbW91c2Uud2hlZWwgPT0gd2hlZWxEaXIpe1xyXG5cdFx0XHRJbnB1dC5fbW91c2Uud2hlZWwgPSAwO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlS2V5RG93bjogZnVuY3Rpb24oZXYpe1xyXG5cdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcclxuXHRcdGlmIChJbnB1dC5fa2V5c1tldi5rZXlDb2RlXSA9PSAyKSByZXR1cm47XHJcblx0XHRJbnB1dC5fa2V5c1tldi5rZXlDb2RlXSA9IDE7XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVLZXlVcDogZnVuY3Rpb24oZXYpe1xyXG5cdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcclxuXHRcdElucHV0Ll9rZXlzW2V2LmtleUNvZGVdID0gMDtcclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZU1vdXNlRG93bjogZnVuY3Rpb24oZXYpe1xyXG5cdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcclxuXHRcdGlmIChldi53aGljaCA9PSAxKXtcclxuXHRcdFx0aWYgKElucHV0Ll9tb3VzZS5sZWZ0ICE9IDIpXHJcblx0XHRcdFx0SW5wdXQuX21vdXNlLmxlZnQgPSAxO1xyXG5cdFx0fWVsc2UgaWYgKGV2LndoaWNoID09IDIpe1xyXG5cdFx0XHRpZiAoSW5wdXQuX21vdXNlLm1pZGRsZSAhPSAyKVxyXG5cdFx0XHRcdElucHV0Ll9tb3VzZS5taWRkbGUgPSAxO1xyXG5cdFx0fWVsc2UgaWYgKGV2LndoaWNoID09IDMpe1xyXG5cdFx0XHRpZiAoSW5wdXQuX21vdXNlLnJpZ2h0ICE9IDIpXHJcblx0XHRcdFx0SW5wdXQuX21vdXNlLnJpZ2h0ID0gMTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0SW5wdXQuaGFuZGxlTW91c2VNb3ZlKGV2KTtcclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVNb3VzZVVwOiBmdW5jdGlvbihldil7XHJcblx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFxyXG5cdFx0aWYgKGV2LndoaWNoID09IDEpe1xyXG5cdFx0XHRJbnB1dC5fbW91c2UubGVmdCA9IDA7XHJcblx0XHR9ZWxzZSBpZiAoZXYud2hpY2ggPT0gMil7XHJcblx0XHRcdElucHV0Ll9tb3VzZS5taWRkbGUgPSAwO1xyXG5cdFx0fWVsc2UgaWYgKGV2LndoaWNoID09IDMpe1xyXG5cdFx0XHRJbnB1dC5fbW91c2UucmlnaHQgPSAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRJbnB1dC5oYW5kbGVNb3VzZU1vdmUoZXYpO1xyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZU1vdXNlV2hlZWw6IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHJcblx0XHRJbnB1dC5fbW91c2Uud2hlZWwgPSAwO1xyXG5cdFx0aWYgKGV2LndoZWVsRGVsdGEgPiAwKSBJbnB1dC5fbW91c2Uud2hlZWwgPSAxO1xyXG5cdFx0ZWxzZSBpZiAoZXYud2hlZWxEZWx0YSA8IDApIElucHV0Ll9tb3VzZS53aGVlbCA9IC0xO1xyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlTW91c2VNb3ZlOiBmdW5jdGlvbihldil7XHJcblx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFxyXG5cdFx0dmFyIGVsWCA9IGV2LmNsaWVudFggLSBldi50YXJnZXQub2Zmc2V0TGVmdDtcclxuXHRcdHZhciBlbFkgPSBldi5jbGllbnRZIC0gZXYudGFyZ2V0Lm9mZnNldFRvcDtcclxuXHRcdFxyXG5cdFx0SW5wdXQuX21vdXNlLnBvc2l0aW9uLnNldChlbFgsIGVsWSk7XHJcblx0fSxcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihjYW52YXMpe1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoZG9jdW1lbnQsICdrZXlkb3duJywgSW5wdXQuaGFuZGxlS2V5RG93bik7XHJcblx0XHRVdGlscy5hZGRFdmVudChkb2N1bWVudCwgJ2tleXVwJywgSW5wdXQuaGFuZGxlS2V5VXApO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoY2FudmFzLCAnbW91c2Vkb3duJywgSW5wdXQuaGFuZGxlTW91c2VEb3duKTtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGRvY3VtZW50LCAnbW91c2V1cCcsIElucHV0LmhhbmRsZU1vdXNlVXApO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoY2FudmFzLCAnbW91c2V3aGVlbCcsIElucHV0LmhhbmRsZU1vdXNlV2hlZWwpO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoY2FudmFzLCAnbW91c2Vtb3ZlJywgSW5wdXQuaGFuZGxlTW91c2VNb3ZlKTtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGRvY3VtZW50LCAnY29udGV4dG1lbnUnLCBmdW5jdGlvbihldil7XHJcblx0XHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGV2LnRhcmdldCA9PT0gY2FudmFzKXtcclxuXHRcdFx0XHRldi5jYW5jZWxCdWJibGUgPSB0cnVlO1xyXG5cdFx0XHRcdGV2LnJldHVyblZhbHVlID0gZmFsc2U7XHJcblx0XHRcdFx0aWYgKGV2LnByZXZlbnREZWZhdWx0KVxyXG5cdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRpZiAoZXYuc3RvcFByb3BhZ2F0aW9uKVxyXG5cdFx0XHRcdFx0ZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTw9OTtpKyspe1xyXG5cdFx0XHRJbnB1dC52S2V5WydOJyArIGldID0gNDggKyBpO1xyXG5cdFx0XHRJbnB1dC52S2V5WydOSycgKyBpXSA9IDk2ICsgaTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaT02NTtpPD05MDtpKyspe1xyXG5cdFx0XHRJbnB1dC52S2V5W1N0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaT0xO2k8PTEyO2krKyl7XHJcblx0XHRcdElucHV0LnZLZXlbJ0YnICsgaV0gPSAxMTEgKyBpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5wdXQ7IiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBDYW1lcmFPcnRobyA9IHJlcXVpcmUoJy4vS1RDYW1lcmFPcnRobycpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcbnZhciBUZXh0dXJlRnJhbWVidWZmZXIgPSByZXF1aXJlKCcuL0tUVGV4dHVyZUZyYW1lYnVmZmVyJyk7XHJcblxyXG5mdW5jdGlvbiBEaXJlY3Rpb25hbExpZ2h0KGRpcmVjdGlvbiwgY29sb3IsIGludGVuc2l0eSl7XHJcblx0dGhpcy5fX2t0ZGlyTGlnaHQgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uLm5vcm1hbGl6ZSgpO1xyXG5cdHRoaXMuZGlyZWN0aW9uLm11bHRpcGx5KC0xKTtcclxuXHRcclxuXHR0aGlzLmNvbG9yID0gbmV3IENvbG9yKChjb2xvcik/IGNvbG9yOiBDb2xvci5fV0hJVEUpO1xyXG5cdHRoaXMuaW50ZW5zaXR5ID0gKGludGVuc2l0eSAhPT0gdW5kZWZpbmVkKT8gaW50ZW5zaXR5IDogMS4wO1xyXG5cdHRoaXMuY2FzdFNoYWRvdyA9IGZhbHNlO1xyXG5cdHRoaXMuc2hhZG93Q2FtID0gbnVsbDtcclxuXHR0aGlzLnNoYWRvd0J1ZmZlciA9IG51bGw7XHJcblx0XHJcblx0dGhpcy5zaGFkb3dDYW1XaWR0aCA9IDUwMDtcclxuXHR0aGlzLnNoYWRvd0NhbUhlaWdodCA9IDUwMDtcclxuXHR0aGlzLnNoYWRvd05lYXIgPSAwLjE7XHJcblx0dGhpcy5zaGFkb3dGYXIgPSA1MDAuMDtcclxuXHR0aGlzLnNoYWRvd1Jlc29sdXRpb24gPSBuZXcgVmVjdG9yMig1MTIsIDUxMik7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aW9uYWxMaWdodDtcclxuXHJcbkRpcmVjdGlvbmFsTGlnaHQucHJvdG90eXBlLnNldENhc3RTaGFkb3cgPSBmdW5jdGlvbihjYXN0U2hhZG93KXtcclxuXHR0aGlzLmNhc3RTaGFkb3cgPSBjYXN0U2hhZG93O1xyXG5cdFxyXG5cdGlmIChjYXN0U2hhZG93KXtcclxuXHRcdHZhciByZWwgPSB0aGlzLnNoYWRvd1Jlc29sdXRpb24ueCAvIHRoaXMuc2hhZG93UmVzb2x1dGlvbi55O1xyXG5cdFx0dGhpcy5zaGFkb3dDYW0gPSBuZXcgQ2FtZXJhT3J0aG8odGhpcy5zaGFkb3dDYW1XaWR0aCwgdGhpcy5zaGFkb3dDYW1IZWlnaHQsIHRoaXMuc2hhZG93TmVhciwgdGhpcy5zaGFkb3dGYXIpO1xyXG5cdFx0dGhpcy5zaGFkb3dDYW0ucG9zaXRpb24gPSB0aGlzLmRpcmVjdGlvbi5jbG9uZSgpLm11bHRpcGx5KDEwMCk7XHJcblx0XHR0aGlzLnNoYWRvd0NhbS5sb29rQXQodGhpcy5kaXJlY3Rpb24uY2xvbmUoKS5tdWx0aXBseSgtMSkpO1xyXG5cdFx0XHJcblx0XHR0aGlzLnNoYWRvd0J1ZmZlciA9IG5ldyBUZXh0dXJlRnJhbWVidWZmZXIodGhpcy5zaGFkb3dSZXNvbHV0aW9uLngsIHRoaXMuc2hhZG93UmVzb2x1dGlvbi55KTtcclxuXHR9ZWxzZXtcclxuXHRcdHRoaXMuc2hhZG93Q2FtID0gbnVsbDtcclxuXHRcdHRoaXMuc2hhZG93QnVmZmVyID0gbnVsbDtcclxuXHR9XHJcbn07IiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcblxyXG5mdW5jdGlvbiBMaWdodFBvaW50KHBvc2l0aW9uLCBpbnRlbnNpdHksIGRpc3RhbmNlLCBjb2xvcil7XHJcblx0dGhpcy5fX2t0cG9pbnRsaWdodCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cdHRoaXMuaW50ZW5zaXR5ID0gKGludGVuc2l0eSk/IGludGVuc2l0eSA6IDEuMDtcclxuXHR0aGlzLmRpc3RhbmNlID0gKGRpc3RhbmNlKT8gZGlzdGFuY2UgOiAxLjA7XHJcblx0dGhpcy5jb2xvciA9IG5ldyBDb2xvcigoY29sb3IpPyBjb2xvciA6IENvbG9yLl9XSElURSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGlnaHRQb2ludDsiLCJ2YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcbnZhciBUZXh0dXJlRnJhbWVidWZmZXIgPSByZXF1aXJlKCcuL0tUVGV4dHVyZUZyYW1lYnVmZmVyJyk7XHJcblxyXG5mdW5jdGlvbiBMaWdodFNwb3QocG9zaXRpb24sIHRhcmdldCwgaW5uZXJBbmdsZSwgb3V0ZXJBbmdsZSwgaW50ZW5zaXR5LCBkaXN0YW5jZSwgY29sb3Ipe1xyXG5cdHRoaXMuX19rdHNwb3RsaWdodCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdHRoaXMuZGlyZWN0aW9uID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZShwb3NpdGlvbiwgdGFyZ2V0KS5ub3JtYWxpemUoKTtcclxuXHR0aGlzLm91dGVyQW5nbGUgPSBNYXRoLmNvcyhvdXRlckFuZ2xlKTtcclxuXHR0aGlzLmlubmVyQW5nbGUgPSBNYXRoLmNvcyhpbm5lckFuZ2xlKTtcclxuXHR0aGlzLmludGVuc2l0eSA9IChpbnRlbnNpdHkpPyBpbnRlbnNpdHkgOiAxLjA7XHJcblx0dGhpcy5kaXN0YW5jZSA9IChkaXN0YW5jZSk/IGRpc3RhbmNlIDogMS4wO1xyXG5cdHRoaXMuY29sb3IgPSBuZXcgQ29sb3IoKGNvbG9yKT8gY29sb3IgOiBDb2xvci5fV0hJVEUpO1xyXG5cdHRoaXMuY2FzdFNoYWRvdyA9IGZhbHNlO1xyXG5cdHRoaXMuc2hhZG93Q2FtID0gbnVsbDtcclxuXHR0aGlzLnNoYWRvd0J1ZmZlciA9IG51bGw7XHJcblx0XHJcblx0dGhpcy5zaGFkb3dGb3YgPSBLVC5NYXRoLmRlZ1RvUmFkKDkwLjApO1xyXG5cdHRoaXMuc2hhZG93TmVhciA9IDAuMTtcclxuXHR0aGlzLnNoYWRvd0ZhciA9IDUwMC4wO1xyXG5cdHRoaXMuc2hhZG93UmVzb2x1dGlvbiA9IG5ldyBWZWN0b3IyKDUxMiwgNTEyKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMaWdodFNwb3Q7XHJcblxyXG5MaWdodFNwb3QucHJvdG90eXBlLnNldENhc3RTaGFkb3cgPSBmdW5jdGlvbihjYXN0U2hhZG93KXtcclxuXHR0aGlzLmNhc3RTaGFkb3cgPSBjYXN0U2hhZG93O1xyXG5cdFxyXG5cdGlmIChjYXN0U2hhZG93KXtcclxuXHRcdHZhciByZWwgPSB0aGlzLnNoYWRvd1Jlc29sdXRpb24ueCAvIHRoaXMuc2hhZG93UmVzb2x1dGlvbi55O1xyXG5cdFx0dGhpcy5zaGFkb3dDYW0gPSBuZXcgS1QuQ2FtZXJhUGVyc3BlY3RpdmUodGhpcy5zaGFkb3dGb3YsIHJlbCwgdGhpcy5zaGFkb3dOZWFyLCB0aGlzLnNoYWRvd0Zhcik7XHJcblx0XHR0aGlzLnNoYWRvd0NhbS5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb247XHJcblx0XHR0aGlzLnNoYWRvd0NhbS5sb29rQXQodGhpcy50YXJnZXQpO1xyXG5cdFx0XHJcblx0XHR0aGlzLnNoYWRvd0J1ZmZlciA9IG5ldyBUZXh0dXJlRnJhbWVidWZmZXIodGhpcy5zaGFkb3dSZXNvbHV0aW9uLngsIHRoaXMuc2hhZG93UmVzb2x1dGlvbi55KTtcclxuXHR9ZWxzZXtcclxuXHRcdHRoaXMuc2hhZG93Q2FtID0gbnVsbDtcclxuXHRcdHRoaXMuc2hhZG93QnVmZmVyID0gbnVsbDtcclxuXHR9XHJcbn07XHJcblxyXG5MaWdodFNwb3QucHJvdG90eXBlLnNldFNoYWRvd1Byb3BlcnRpZXMgPSBmdW5jdGlvbihmb3YsIG5lYXIsIGZhciwgcmVzb2x1dGlvbil7XHJcblx0dGhpcy5zaGFkb3dGb3YgPSBmb3Y7XHJcblx0dGhpcy5zaGFkb3dOZWFyID0gbmVhcjtcclxuXHR0aGlzLnNoYWRvd0ZhciA9IGZhcjtcclxuXHR0aGlzLnNoYWRvd1Jlc29sdXRpb24gPSByZXNvbHV0aW9uO1xyXG59O1xyXG4iLCJ2YXIgU2hhZGVycyA9IHJlcXVpcmUoJy4vS1RTaGFkZXJzJyk7XHJcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4vS1RJbnB1dCcpO1xyXG52YXIgTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRURVhUVVJFX0ZST05UOiAwLFxyXG5cdFRFWFRVUkVfQkFDSzogMSxcclxuXHRURVhUVVJFX1JJR0hUOiAyLFxyXG5cdFRFWFRVUkVfTEVGVDogMyxcclxuXHRURVhUVVJFX1VQOiA0LFxyXG5cdFRFWFRVUkVfRE9XTjogNSxcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihjYW52YXMpe1xyXG5cdFx0dGhpcy5jYW52YXMgPSBjYW52YXM7XHJcblx0XHR0aGlzLmdsID0gbnVsbDtcclxuXHRcdHRoaXMuc2hhZGVycyA9IHt9O1xyXG5cdFx0dGhpcy5pbWFnZXMgPSBbXTtcclxuXHRcdHRoaXMubWF4QXR0cmliTG9jYXRpb25zID0gMDtcclxuXHRcdHRoaXMubGFzdFByb2dyYW0gPSBudWxsO1xyXG5cdFx0XHJcblx0XHR0aGlzLl9faW5pdENvbnRleHQoY2FudmFzKTtcclxuXHRcdHRoaXMuX19pbml0UHJvcGVydGllcygpO1xyXG5cdFx0dGhpcy5fX2luaXRTaGFkZXJzKCk7XHJcblx0XHR0aGlzLl9faW5pdFBhcmFtcygpO1xyXG5cdFx0XHJcblx0XHRJbnB1dC5pbml0KGNhbnZhcyk7XHJcblx0fSxcclxuXHRcclxuXHRfX2luaXRDb250ZXh0OiBmdW5jdGlvbihjYW52YXMpe1xyXG5cdFx0dGhpcy5nbCA9IGNhbnZhcy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnKTtcclxuXHRcdFxyXG5cdFx0aWYgKCF0aGlzLmdsKXtcclxuXHRcdFx0YWxlcnQoXCJZb3VyIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IFdlYkdMXCIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuZ2wud2lkdGggPSBjYW52YXMud2lkdGg7XHJcblx0XHR0aGlzLmdsLmhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XHJcblx0fSxcclxuXHRcclxuXHRfX2luaXRQcm9wZXJ0aWVzOiBmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGdsID0gdGhpcy5nbDtcclxuXHRcdFxyXG5cdFx0Z2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xyXG5cdFx0Z2wuZGVwdGhGdW5jKGdsLkxFUVVBTCk7XHJcblx0XHRcclxuXHRcdGdsLmVuYWJsZShnbC5DVUxMX0ZBQ0UpO1xyXG5cdFx0XHJcblx0XHRnbC5kaXNhYmxlKCBnbC5CTEVORCApO1xyXG5cdFx0Z2wuYmxlbmRFcXVhdGlvbiggZ2wuRlVOQ19BREQgKTtcclxuXHRcdGdsLmJsZW5kRnVuYyggZ2wuU1JDX0FMUEhBLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBICk7XHJcblx0fSxcclxuXHRcclxuXHRfX2luaXRTaGFkZXJzOiBmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5zaGFkZXJzID0ge307XHJcblx0XHR0aGlzLnNoYWRlcnMuYmFzaWMgPSB0aGlzLnByb2Nlc3NTaGFkZXIoU2hhZGVycy5iYXNpYyk7XHJcblx0XHR0aGlzLnNoYWRlcnMubGFtYmVydCA9IHRoaXMucHJvY2Vzc1NoYWRlcihTaGFkZXJzLmxhbWJlcnQpO1xyXG5cdFx0dGhpcy5zaGFkZXJzLnBob25nID0gdGhpcy5wcm9jZXNzU2hhZGVyKFNoYWRlcnMucGhvbmcpO1xyXG5cdFx0dGhpcy5zaGFkZXJzLmRlcHRoID0gdGhpcy5wcm9jZXNzU2hhZGVyKFNoYWRlcnMuZGVwdGhNYXApO1xyXG5cdH0sXHJcblx0XHJcblx0X19pbml0UGFyYW1zOiBmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5saWdodE5EQ01hdCA9IG5ldyBNYXRyaXg0KFxyXG5cdFx0XHQwLjUsIDAuMCwgMC4wLCAwLjUsXHJcblx0XHRcdDAuMCwgMC41LCAwLjAsIDAuNSxcclxuXHRcdFx0MC4wLCAwLjAsIDAuNSwgMC41LFxyXG5cdFx0XHQwLjAsIDAuMCwgMC4wLCAxLjBcclxuXHRcdCk7XHJcblx0fSxcclxuXHRcclxuXHRjcmVhdGVBcnJheUJ1ZmZlcjogZnVuY3Rpb24odHlwZSwgZGF0YUFycmF5LCBpdGVtU2l6ZSl7XHJcblx0XHR2YXIgZ2wgPSB0aGlzLmdsO1xyXG5cdFx0dmFyIGJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG5cdFx0Z2wuYmluZEJ1ZmZlcihnbFt0eXBlXSwgYnVmZmVyKTtcclxuXHRcdGdsLmJ1ZmZlckRhdGEoZ2xbdHlwZV0sIGRhdGFBcnJheSwgZ2wuU1RBVElDX0RSQVcpO1xyXG5cdFx0YnVmZmVyLm51bUl0ZW1zID0gZGF0YUFycmF5Lmxlbmd0aDtcclxuXHRcdGJ1ZmZlci5pdGVtU2l6ZSA9IGl0ZW1TaXplO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gYnVmZmVyO1xyXG5cdH0sXHJcblx0XHJcblx0Z2V0U2hhZGVyQXR0cmlidXRlc0FuZFVuaWZvcm1zOiBmdW5jdGlvbih2ZXJ0ZXgsIGZyYWdtZW50KXtcclxuXHRcdHZhciBhdHRyaWJ1dGVzID0gW107XHJcblx0XHR2YXIgdW5pZm9ybXMgPSBbXTtcclxuXHRcdHZhciB1bmlmb3Jtc05hbWVzID0gW107XHJcblx0XHRcclxuXHRcdHZhciBzdHJ1Y3RzID0gW107XHJcblx0XHR2YXIgdW5pZm9ybXNBcnJheXMgPSBbXTtcclxuXHRcdHZhciBzdCA9IG51bGw7XHJcblx0XHRmb3IgKHZhciBpPTA7aTx2ZXJ0ZXgubGVuZ3RoO2krKyl7XHJcblx0XHRcdHZhciBsaW5lID0gdmVydGV4W2ldLnRyaW0oKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChsaW5lLmluZGV4T2YoXCJhdHRyaWJ1dGUgXCIpID09IDApe1xyXG5cdFx0XHRcdHN0ID0gbnVsbDtcclxuXHRcdFx0XHR2YXIgcCA9IGxpbmUuc3BsaXQoLyAvZyk7XHJcblx0XHRcdFx0dmFyIG5hbWUgPSBwW3AubGVuZ3RoIC0gMV0udHJpbSgpO1xyXG5cdFx0XHRcdGlmIChhdHRyaWJ1dGVzLmluZGV4T2YobmFtZSkgPT0gLTEpXHJcblx0XHRcdFx0XHRhdHRyaWJ1dGVzLnB1c2goe25hbWU6IG5hbWV9KTtcclxuXHRcdFx0fWVsc2UgaWYgKGxpbmUuaW5kZXhPZihcInVuaWZvcm0gXCIpID09IDApe1xyXG5cdFx0XHRcdHN0ID0gbnVsbDtcclxuXHRcdFx0XHRpZiAobGluZS5pbmRleE9mKFwiW1wiKSAhPSAtMSl7XHJcblx0XHRcdFx0XHR1bmlmb3Jtc0FycmF5cy5wdXNoKGxpbmUpO1xyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBwID0gbGluZS5zcGxpdCgvIC9nKTtcclxuXHRcdFx0XHR2YXIgbmFtZSA9IHBbcC5sZW5ndGggLSAxXS50cmltKCk7XHJcblx0XHRcdFx0aWYgKHVuaWZvcm1zTmFtZXMuaW5kZXhPZihuYW1lKSA9PSAtMSl7XHJcblx0XHRcdFx0XHR1bmlmb3Jtcy5wdXNoKHtuYW1lOiBuYW1lfSk7XHJcblx0XHRcdFx0XHR1bmlmb3Jtc05hbWVzLnB1c2gobmFtZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ZWxzZSBpZiAobGluZS5pbmRleE9mKFwic3RydWN0XCIpID09IDApe1xyXG5cdFx0XHRcdHN0ID0geyBuYW1lOiBsaW5lLnJlcGxhY2UoXCJzdHJ1Y3QgXCIsIFwiXCIpLCBkYXRhOiBbXSB9O1xyXG5cdFx0XHRcdHN0cnVjdHMucHVzaChzdCk7XHJcblx0XHRcdH1lbHNlIGlmIChzdCAhPSBudWxsKXtcclxuXHRcdFx0XHRpZiAobGluZS50cmltKCkgPT0gXCJcIikgY29udGludWU7XHJcblx0XHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtMV0udHJpbSgpO1xyXG5cdFx0XHRcdHN0LmRhdGEucHVzaChuYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTxmcmFnbWVudC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0dmFyIGxpbmUgPSBmcmFnbWVudFtpXS50cmltKCk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAobGluZS5pbmRleE9mKFwiYXR0cmlidXRlIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtIDFdLnRyaW0oKTtcclxuXHRcdFx0XHRpZiAoYXR0cmlidXRlcy5pbmRleE9mKG5hbWUpID09IC0xKVxyXG5cdFx0XHRcdFx0YXR0cmlidXRlcy5wdXNoKHtuYW1lOiBuYW1lfSk7XHJcblx0XHRcdH1lbHNlIGlmIChsaW5lLmluZGV4T2YoXCJ1bmlmb3JtIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0aWYgKGxpbmUuaW5kZXhPZihcIltcIikgIT0gLTEpe1xyXG5cdFx0XHRcdFx0dW5pZm9ybXNBcnJheXMucHVzaChsaW5lKTtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgcCA9IGxpbmUuc3BsaXQoLyAvZyk7XHJcblx0XHRcdFx0dmFyIG5hbWUgPSBwW3AubGVuZ3RoIC0gMV0udHJpbSgpO1xyXG5cdFx0XHRcdGlmICh1bmlmb3Jtc05hbWVzLmluZGV4T2YobmFtZSkgPT0gLTEpe1xyXG5cdFx0XHRcdFx0dW5pZm9ybXMucHVzaCh7bmFtZTogbmFtZX0pO1xyXG5cdFx0XHRcdFx0dW5pZm9ybXNOYW1lcy5wdXNoKG5hbWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2UgaWYgKGxpbmUuaW5kZXhPZihcInN0cnVjdFwiKSAhPSAtMSl7XHJcblx0XHRcdFx0c3QgPSB7IG5hbWU6IGxpbmUucmVwbGFjZShcInN0cnVjdCBcIiwgXCJcIiksIGRhdGE6IFtdIH07XHJcblx0XHRcdFx0c3RydWN0cy5wdXNoKHN0KTtcclxuXHRcdFx0fWVsc2UgaWYgKHN0ICE9IG51bGwpe1xyXG5cdFx0XHRcdGlmIChsaW5lLnRyaW0oKSA9PSBcIlwiKSBjb250aW51ZTtcclxuXHRcdFx0XHR2YXIgcCA9IGxpbmUuc3BsaXQoLyAvZyk7XHJcblx0XHRcdFx0dmFyIG5hbWUgPSBwW3AubGVuZ3RoIC0xXS50cmltKCk7XHJcblx0XHRcdFx0c3QuZGF0YS5wdXNoKG5hbWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGk9MCxsZW49dW5pZm9ybXNBcnJheXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHRcdHZhciBsaW5lID0gdW5pZm9ybXNBcnJheXNbaV07XHJcblx0XHRcdHZhciBwID0gbGluZS5zcGxpdCgvIC9nKTtcclxuXHRcdFx0dmFyIHR5cGUgPSBwW3AubGVuZ3RoIC0gMl0udHJpbSgpO1xyXG5cdFx0XHR2YXIgbmFtZSA9IHBbcC5sZW5ndGggLSAxXS50cmltKCk7XHJcblx0XHRcdHZhciB1bmlMZW4gPSBwYXJzZUludChuYW1lLnN1YnN0cmluZyhuYW1lLmluZGV4T2YoXCJbXCIpICsgMSwgbmFtZS5pbmRleE9mKFwiXVwiKSksIDEwKTtcclxuXHRcdFx0dmFyIG5hbWUgPSBuYW1lLnN1YnN0cmluZygwLCBuYW1lLmluZGV4T2YoXCJbXCIpKTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBzdHIgPSBudWxsO1xyXG5cdFx0XHRmb3IgKHZhciBqPTAsamxlbj1zdHJ1Y3RzLmxlbmd0aDtqPGpsZW47aisrKXtcclxuXHRcdFx0XHRpZiAoc3RydWN0c1tqXS5uYW1lID09IHR5cGUpe1xyXG5cdFx0XHRcdFx0c3RyID0gc3RydWN0c1tqXTtcclxuXHRcdFx0XHRcdGogPSBqbGVuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHN0cil7XHJcblx0XHRcdFx0dmFyIHN0cnVjdFVuaSA9IFtdO1xyXG5cdFx0XHRcdGZvciAodmFyIGo9MDtqPHVuaUxlbjtqKyspe1xyXG5cdFx0XHRcdFx0c3RydWN0VW5pW2pdID0gKHtuYW1lOiBuYW1lLCBsZW46IHVuaUxlbiwgZGF0YTogW119KTtcclxuXHRcdFx0XHRcdGZvciAodmFyIGs9MCxrbGVuPXN0ci5kYXRhLmxlbmd0aDtrPGtsZW47aysrKXtcclxuXHRcdFx0XHRcdFx0dmFyIHByb3AgPSBzdHIuZGF0YVtrXTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdHN0cnVjdFVuaVtqXS5kYXRhLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdG5hbWU6IHByb3AsXHJcblx0XHRcdFx0XHRcdFx0bG9jTmFtZTogbmFtZSArIFwiW1wiICsgaiArIFwiXS5cIiArIHByb3BcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmICh1bmlmb3Jtc05hbWVzLmluZGV4T2YobmFtZSkgPT0gLTEpe1xyXG5cdFx0XHRcdFx0dW5pZm9ybXMucHVzaCh7XHJcblx0XHRcdFx0XHRcdG11bHRpOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRkYXRhOiBzdHJ1Y3RVbmksXHJcblx0XHRcdFx0XHRcdHR5cGU6IHR5cGVcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0dW5pZm9ybXNOYW1lcy5wdXNoKG5hbWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Zm9yICh2YXIgaj0wO2o8dW5pTGVuO2orKyl7XHJcblx0XHRcdFx0XHRpZiAodW5pZm9ybXNOYW1lcy5pbmRleE9mKG5hbWUgKyBcIltcIiArIGogKyBcIl1cIikgPT0gLTEpe1xyXG5cdFx0XHRcdFx0XHR1bmlmb3Jtcy5wdXNoKHtuYW1lOiBuYW1lICsgXCJbXCIgKyBqICsgXCJdXCIsIHR5cGU6IG5hbWUgfSk7XHJcblx0XHRcdFx0XHRcdHVuaWZvcm1zTmFtZXMucHVzaChuYW1lKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0YXR0cmlidXRlczogYXR0cmlidXRlcyxcclxuXHRcdFx0dW5pZm9ybXM6IHVuaWZvcm1zXHJcblx0XHR9O1xyXG5cdH0sXHJcblx0XHJcblx0cHJvY2Vzc1NoYWRlcjogZnVuY3Rpb24oc2hhZGVyKXtcclxuXHRcdHZhciBnbCA9IHRoaXMuZ2w7XHJcblx0XHRcclxuXHRcdHZhciB2Q29kZSA9IHNoYWRlci52ZXJ0ZXhTaGFkZXI7XHJcblx0XHR2YXIgdlNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5WRVJURVhfU0hBREVSKTtcclxuXHRcdGdsLnNoYWRlclNvdXJjZSh2U2hhZGVyLCB2Q29kZSk7XHJcblx0XHRnbC5jb21waWxlU2hhZGVyKHZTaGFkZXIpO1xyXG5cdFx0XHJcblx0XHR2YXIgZkNvZGUgPSBzaGFkZXIuZnJhZ21lbnRTaGFkZXI7XHJcblx0XHR2YXIgZlNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5GUkFHTUVOVF9TSEFERVIpO1xyXG5cdFx0Z2wuc2hhZGVyU291cmNlKGZTaGFkZXIsIGZDb2RlKTtcclxuXHRcdGdsLmNvbXBpbGVTaGFkZXIoZlNoYWRlcik7XHJcblx0XHRcclxuXHRcdHZhciBzaGFkZXJQcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG5cdFx0Z2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIHZTaGFkZXIpO1xyXG5cdFx0Z2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIGZTaGFkZXIpO1xyXG5cdFx0Z2wubGlua1Byb2dyYW0oc2hhZGVyUHJvZ3JhbSk7XHJcblx0XHRcclxuXHRcdHZhciBwYXJhbXMgPSB0aGlzLmdldFNoYWRlckF0dHJpYnV0ZXNBbmRVbmlmb3Jtcyh2Q29kZS5zcGxpdCgvWzt7fV0rLyksIGZDb2RlLnNwbGl0KC9bO3t9XSsvKSk7XHJcblx0XHRcclxuXHRcdGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHZTaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSl7XHJcblx0XHRcdGNvbnNvbGUubG9nKGdsLmdldFNoYWRlckluZm9Mb2codlNoYWRlcikpO1xyXG5cdFx0XHR0aHJvdyBcIkVycm9yIGNvbXBpbGluZyB2ZXJ0ZXggc2hhZGVyXCI7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKGZTaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSl7XHJcblx0XHRcdGNvbnNvbGUubG9nKGdsLmdldFNoYWRlckluZm9Mb2coZlNoYWRlcikpO1xyXG5cdFx0XHR0aHJvdyBcIkVycm9yIGNvbXBpbGluZyB2ZXJ0ZXggc2hhZGVyXCI7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmICghZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihzaGFkZXJQcm9ncmFtLCBnbC5MSU5LX1NUQVRVUykpe1xyXG5cdFx0XHRjb25zb2xlLmxvZyhnbC5nZXRQcm9ncmFtSW5mb0xvZyhzaGFkZXJQcm9ncmFtKSk7XHJcblx0XHRcdHRocm93IFwiRXJyb3IgaW5pdGlhbGl6aW5nIHRoZSBzaGFkZXIgcHJvZ3JhbVwiO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgYXR0cmlidXRlcyA9IFtdO1xyXG5cdFx0dGhpcy5tYXhBdHRyaWJMb2NhdGlvbnMgPSBNYXRoLm1heCh0aGlzLm1heEF0dHJpYkxvY2F0aW9ucywgcGFyYW1zLmF0dHJpYnV0ZXMubGVuZ3RoKTtcclxuXHRcdGZvciAodmFyIGk9MCxsZW49cGFyYW1zLmF0dHJpYnV0ZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHRcdHZhciBhdHQgPSBwYXJhbXMuYXR0cmlidXRlc1tpXTtcclxuXHRcdFx0dmFyIGxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgYXR0Lm5hbWUpO1xyXG5cdFx0XHRcclxuXHRcdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkobG9jYXRpb24pO1xyXG5cdFx0XHRcclxuXHRcdFx0YXR0cmlidXRlcy5wdXNoKHtcclxuXHRcdFx0XHRuYW1lOiBhdHQubmFtZSxcclxuXHRcdFx0XHRsb2NhdGlvbjogbG9jYXRpb25cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciB1bmlmb3JtcyA9IFtdO1xyXG5cdFx0Zm9yICh2YXIgaT0wLGxlbj1wYXJhbXMudW5pZm9ybXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHRcdHZhciB1bmkgPSBwYXJhbXMudW5pZm9ybXNbaV07XHJcblx0XHRcdGlmICh1bmkubXVsdGkpe1xyXG5cdFx0XHRcdGZvciAodmFyIGo9MCxqbGVuPXVuaS5kYXRhLmxlbmd0aDtqPGpsZW47aisrKXtcclxuXHRcdFx0XHRcdHZhciB1bmlEID0gdW5pLmRhdGFbal07XHJcblx0XHRcdFx0XHRmb3IgKHZhciBrPTAsa2xlbj11bmlELmRhdGEubGVuZ3RoO2s8a2xlbjtrKyspe1xyXG5cdFx0XHRcdFx0XHR2YXIgZGF0ID0gdW5pRC5kYXRhW2tdO1xyXG5cdFx0XHRcdFx0XHRkYXQubG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgZGF0LmxvY05hbWUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHR1bmlmb3Jtcy5wdXNoKHVuaSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHZhciBsb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCB1bmkubmFtZSk7XHJcblx0XHRcdFxyXG5cdFx0XHRcdHVuaWZvcm1zLnB1c2goe1xyXG5cdFx0XHRcdFx0bmFtZTogdW5pLm5hbWUsXHJcblx0XHRcdFx0XHRsb2NhdGlvbjogbG9jYXRpb24sXHJcblx0XHRcdFx0XHR0eXBlOiAodW5pLnR5cGUpPyB1bmkudHlwZSA6IHVuaS5uYW1lXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0c2hhZGVyUHJvZ3JhbTogc2hhZGVyUHJvZ3JhbSxcclxuXHRcdFx0YXR0cmlidXRlczogYXR0cmlidXRlcyxcclxuXHRcdFx0dW5pZm9ybXM6IHVuaWZvcm1zXHJcblx0XHR9O1xyXG5cdH0sXHJcblx0XHJcblx0c3dpdGNoUHJvZ3JhbTogZnVuY3Rpb24oc2hhZGVyKXtcclxuXHRcdGlmICh0aGlzLmxhc3RQcm9ncmFtID09PSBzaGFkZXIpIHJldHVybjtcclxuXHRcdHZhciBnbCA9IHRoaXMuZ2w7XHJcblx0XHRcclxuXHRcdHRoaXMubGFzdFByb2dyYW0gPSBzaGFkZXI7XHJcblx0XHRnbC51c2VQcm9ncmFtKHNoYWRlci5zaGFkZXJQcm9ncmFtKTtcclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dGhpcy5tYXhBdHRyaWJMb2NhdGlvbnM7aSsrKXtcclxuXHRcdFx0aWYgKGkgPCBzaGFkZXIuYXR0cmlidXRlcy5sZW5ndGgpe1xyXG5cdFx0XHRcdGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGkpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoaSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGdldEltYWdlOiBmdW5jdGlvbihzcmMpe1xyXG5cdFx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLmltYWdlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdFx0aWYgKHRoaXMuaW1hZ2VzW2ldLnNyYyA9PSBzcmMpXHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuaW1hZ2VzW2ldLmltZztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG59O1xyXG5cclxuXHJcbiIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG5cclxuZnVuY3Rpb24gTWF0ZXJpYWwocGFyYW1ldGVycyl7XHJcblx0dGhpcy5fX2t0bWF0ZXJpYWwgPSB0cnVlO1xyXG5cdFxyXG5cdGlmICghcGFyYW1ldGVycykgcGFyYW1ldGVycyA9IHt9O1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZU1hcCA9IChwYXJhbWV0ZXJzLnRleHR1cmVNYXApPyBwYXJhbWV0ZXJzLnRleHR1cmVNYXAgOiBudWxsO1xyXG5cdHRoaXMuY29sb3IgPSBuZXcgQ29sb3IoKHBhcmFtZXRlcnMuY29sb3IpPyBwYXJhbWV0ZXJzLmNvbG9yIDogQ29sb3IuX1dISVRFKTtcclxuXHR0aGlzLm9wYWNpdHkgPSAocGFyYW1ldGVycy5vcGFjaXR5KT8gcGFyYW1ldGVycy5vcGFjaXR5IDogMS4wO1xyXG5cdHRoaXMudHJhbnNwYXJlbnQgPSAocGFyYW1ldGVycy50cmFuc3BhcmVudCk/IHBhcmFtZXRlcnMudHJhbnNwYXJlbnQgOiBmYWxzZTtcclxuXHR0aGlzLmRyYXdGYWNlcyA9IChwYXJhbWV0ZXJzLmRyYXdGYWNlcyk/IHBhcmFtZXRlcnMuZHJhd0ZhY2VzIDogJ0ZST05UJztcclxuXHR0aGlzLmRyYXdBcyA9IChwYXJhbWV0ZXJzLmRyYXdBcyk/IHBhcmFtZXRlcnMuZHJhd0FzIDogJ1RSSUFOR0xFUyc7XHJcblx0dGhpcy5zaGFkZXIgPSAocGFyYW1ldGVycy5zaGFkZXIpPyBwYXJhbWV0ZXJzLnNoYWRlciA6IG51bGw7XHJcblx0dGhpcy5zZW5kQXR0cmliRGF0YSA9IChwYXJhbWV0ZXJzLnNlbmRBdHRyaWJEYXRhKT8gcGFyYW1ldGVycy5zZW5kQXR0cmliRGF0YSA6IG51bGw7XHJcblx0dGhpcy5zZW5kVW5pZm9ybURhdGEgPSAocGFyYW1ldGVycy5zZW5kVW5pZm9ybURhdGEpPyBwYXJhbWV0ZXJzLnNlbmRVbmlmb3JtRGF0YSA6IG51bGw7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0ZXJpYWw7IiwidmFyIE1hdGVyaWFsID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsJyk7XHJcbnZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcblxyXG5mdW5jdGlvbiBNYXRlcmlhbEJhc2ljKHRleHR1cmVNYXAsIGNvbG9yKXtcclxuXHR0aGlzLl9fa3RtYXRlcmlhbCA9IHRydWU7XHJcblx0XHJcblx0dmFyIG1hdGVyaWFsID0gbmV3IE1hdGVyaWFsKHtcclxuXHRcdHRleHR1cmVNYXA6IHRleHR1cmVNYXAsXHJcblx0XHRjb2xvcjogY29sb3IsXHJcblx0XHRzaGFkZXI6IEtULnNoYWRlcnMuYmFzaWNcclxuXHR9KTtcclxuXHRcclxuXHR0aGlzLnRleHR1cmVNYXAgPSBtYXRlcmlhbC50ZXh0dXJlTWFwO1xyXG5cdHRoaXMuY29sb3IgPSBtYXRlcmlhbC5jb2xvcjtcclxuXHR0aGlzLnNoYWRlciA9IG1hdGVyaWFsLnNoYWRlcjtcclxuXHR0aGlzLm9wYWNpdHkgPSBtYXRlcmlhbC5vcGFjaXR5O1xyXG5cdHRoaXMuZHJhd0ZhY2VzID0gbWF0ZXJpYWwuZHJhd0ZhY2VzO1xyXG5cdHRoaXMuZHJhd0FzID0gbWF0ZXJpYWwuZHJhd0FzO1xyXG5cdHRoaXMudHJhbnNwYXJlbnQgPSBtYXRlcmlhbC50cmFuc3BhcmVudDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRlcmlhbEJhc2ljO1xyXG5cclxuTWF0ZXJpYWxCYXNpYy5wcm90b3R5cGUuc2VuZEF0dHJpYkRhdGEgPSBmdW5jdGlvbihtZXNoLCBjYW1lcmEsIHNjZW5lKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHR2YXIgZ2VvbWV0cnkgPSBtZXNoLmdlb21ldHJ5O1xyXG5cdHZhciBhdHRyaWJ1dGVzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuXHRmb3IgKHZhciBpPTAsbGVuPWF0dHJpYnV0ZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgYXR0ID0gYXR0cmlidXRlc1tpXTtcclxuXHRcdFxyXG5cdFx0aWYgKGF0dC5uYW1lID09IFwiYVZlcnRleFBvc2l0aW9uXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LnZlcnRleEJ1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhDb2xvclwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LmNvbG9yc0J1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS5jb2xvcnNCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9ZWxzZSBpZiAoYXR0Lm5hbWUgPT0gXCJhVGV4dHVyZUNvb3JkXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkudGV4QnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LnRleEJ1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5NYXRlcmlhbEJhc2ljLnByb3RvdHlwZS5zZW5kVW5pZm9ybURhdGEgPSBmdW5jdGlvbihtZXNoLCBjYW1lcmEsIHNjZW5lKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHR2YXIgZ2VvbWV0cnkgPSBtZXNoLmdlb21ldHJ5O1xyXG5cdHZhciB0cmFuc2Zvcm1hdGlvbk1hdHJpeDtcclxuXHR2YXIgdW5pZm9ybXMgPSB0aGlzLnNoYWRlci51bmlmb3JtcztcclxuXHRmb3IgKHZhciBpPTAsbGVuPXVuaWZvcm1zLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIHVuaSA9IHVuaWZvcm1zW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAodW5pLm5hbWUgPT0gJ3VNVlBNYXRyaXgnKXtcclxuXHRcdFx0dHJhbnNmb3JtYXRpb25NYXRyaXggPSBtZXNoLmdldFRyYW5zZm9ybWF0aW9uTWF0cml4KCkubXVsdGlwbHkoY2FtZXJhLnRyYW5zZm9ybWF0aW9uTWF0cml4KTtcclxuXHRcdFx0dmFyIG12cCA9IHRyYW5zZm9ybWF0aW9uTWF0cml4LmNsb25lKCkubXVsdGlwbHkoY2FtZXJhLnBlcnNwZWN0aXZlTWF0cml4KTtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdih1bmkubG9jYXRpb24sIGZhbHNlLCBtdnAudG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VNYXRlcmlhbENvbG9yJyl7XHJcblx0XHRcdHZhciBjb2xvciA9IG1lc2gubWF0ZXJpYWwuY29sb3IuZ2V0UkdCQSgpO1xyXG5cdFx0XHRnbC51bmlmb3JtNGZ2KHVuaS5sb2NhdGlvbiwgbmV3IEZsb2F0MzJBcnJheShjb2xvcikpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VGV4dHVyZVNhbXBsZXInKXtcclxuXHRcdFx0aWYgKG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdFx0Z2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCk7XHJcblx0XHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLnRleHR1cmUpO1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIDApO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VIYXNUZXh0dXJlJyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIChtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApPyAxIDogMCk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlUmVwZWF0JyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtMmYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAucmVwZWF0LngsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5yZXBlYXQueSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VHZW9tZXRyeVVWJyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtNGYodW5pLmxvY2F0aW9uLCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLngsIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueSwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi56LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLncpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VGV4dHVyZU9mZnNldCcgJiYgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0Z2wudW5pZm9ybTJmKHVuaS5sb2NhdGlvbiwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLm9mZnNldC54LCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAub2Zmc2V0LnkpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuIiwidmFyIE1hdGVyaWFsID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsJyk7XHJcbnZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxuXHJcbmZ1bmN0aW9uIE1hdGVyaWFsTGFtYmVydCh0ZXh0dXJlTWFwLCBjb2xvciwgb3BhY2l0eSl7XHJcblx0dGhpcy5fX2t0bWF0ZXJpYWwgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBtYXRlcmlhbCA9IG5ldyBNYXRlcmlhbCh7XHJcblx0XHR0ZXh0dXJlTWFwOiB0ZXh0dXJlTWFwLFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdFx0b3BhY2l0eTogb3BhY2l0eSxcclxuXHRcdHNoYWRlcjogS1Quc2hhZGVycy5sYW1iZXJ0XHJcblx0fSk7XHJcblx0XHJcblx0dGhpcy50ZXh0dXJlTWFwID0gbWF0ZXJpYWwudGV4dHVyZU1hcDtcclxuXHR0aGlzLmNvbG9yID0gbWF0ZXJpYWwuY29sb3I7XHJcblx0dGhpcy5zaGFkZXIgPSBtYXRlcmlhbC5zaGFkZXI7XHJcblx0dGhpcy5vcGFjaXR5ID0gbWF0ZXJpYWwub3BhY2l0eTtcclxuXHR0aGlzLmRyYXdGYWNlcyA9IG1hdGVyaWFsLmRyYXdGYWNlcztcclxuXHR0aGlzLmRyYXdBcyA9IG1hdGVyaWFsLmRyYXdBcztcclxuXHR0aGlzLnRyYW5zcGFyZW50ID0gbWF0ZXJpYWwudHJhbnNwYXJlbnQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0ZXJpYWxMYW1iZXJ0O1xyXG5cclxuTWF0ZXJpYWxMYW1iZXJ0LnByb3RvdHlwZS5zZW5kQXR0cmliRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG5cdGZvciAodmFyIGk9MCxsZW49YXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBhdHQgPSBhdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4UG9zaXRpb25cIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleENvbG9yXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LmNvbG9yc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFUZXh0dXJlQ29vcmRcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS50ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleE5vcm1hbFwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5Lm5vcm1hbHNCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkubm9ybWFsc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRlcmlhbExhbWJlcnQucHJvdG90eXBlLnNlbmRMaWdodFVuaWZvcm1EYXRhID0gZnVuY3Rpb24obGlnaHQsIHVuaWZvcm0sIG1vZGVsVHJhbnNmb3JtYXRpb24pe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdGZvciAodmFyIGk9MCxsZW49dW5pZm9ybS5kYXRhLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIGRhdCA9IHVuaWZvcm0uZGF0YVtpXTtcclxuXHRcdFxyXG5cdFx0aWYgKGRhdC5uYW1lID09ICdwb3NpdGlvbicpe1xyXG5cdFx0XHRpZiAobGlnaHQuX19rdHBvaW50bGlnaHQgfHwgbGlnaHQuX19rdHNwb3RsaWdodCl7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgbGlnaHQucG9zaXRpb24ueCwgbGlnaHQucG9zaXRpb24ueSwgbGlnaHQucG9zaXRpb24ueik7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIDAuMCwgMC4wLCAwLjApO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ2RpcmVjdGlvbicpe1xyXG5cdFx0XHRpZiAobGlnaHQuX19rdGRpckxpZ2h0KXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCBsaWdodC5kaXJlY3Rpb24ueCwgbGlnaHQuZGlyZWN0aW9uLnksIGxpZ2h0LmRpcmVjdGlvbi56KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgMC4wLCAwLjAsIDAuMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnc3BvdERpcmVjdGlvbicpe1xyXG5cdFx0XHRpZiAobGlnaHQuX19rdHNwb3RsaWdodCl7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgbGlnaHQuZGlyZWN0aW9uLngsIGxpZ2h0LmRpcmVjdGlvbi55LCBsaWdodC5kaXJlY3Rpb24ueik7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIDAuMCwgMC4wLCAwLjApO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ2NvbG9yJyl7XHJcblx0XHRcdHZhciBjb2xvciA9IGxpZ2h0LmNvbG9yLmdldFJHQigpO1xyXG5cdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdKTtcclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnaW50ZW5zaXR5Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIGxpZ2h0LmludGVuc2l0eSk7XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ291dGVyQW5nbGUnKXtcclxuXHRcdFx0aWYgKGxpZ2h0Ll9fa3RzcG90bGlnaHQpe1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIGxpZ2h0Lm91dGVyQW5nbGUpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWYoZGF0LmxvY2F0aW9uLCAwLjApO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ2lubmVyQW5nbGUnKXtcclxuXHRcdFx0aWYgKGxpZ2h0Ll9fa3RzcG90bGlnaHQpe1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIGxpZ2h0LmlubmVyQW5nbGUpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWYoZGF0LmxvY2F0aW9uLCAwLjApO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ212UHJvamVjdGlvbicpe1xyXG5cdFx0XHRpZiAobGlnaHQuY2FzdFNoYWRvdyl7XHJcblx0XHRcdFx0dmFyIG12cCA9IG1vZGVsVHJhbnNmb3JtYXRpb24uY2xvbmUoKVxyXG5cdFx0XHRcdFx0XHRcdC5tdWx0aXBseShsaWdodC5zaGFkb3dDYW0udHJhbnNmb3JtYXRpb25NYXRyaXgpXHJcblx0XHRcdFx0XHRcdFx0Lm11bHRpcGx5KGxpZ2h0LnNoYWRvd0NhbS5wZXJzcGVjdGl2ZU1hdHJpeCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKCFsaWdodC5fX2t0ZGlyTGlnaHQpe1xyXG5cdFx0XHRcdFx0bXZwLm11bHRpcGx5KEtULmxpZ2h0TkRDTWF0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdihkYXQubG9jYXRpb24sIGZhbHNlLCBtdnAudG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYoZGF0LmxvY2F0aW9uLCBmYWxzZSwgTWF0cml4NC5nZXRJZGVudGl0eSgpLnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ2Nhc3RTaGFkb3cnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKGRhdC5sb2NhdGlvbiwgKGxpZ2h0LmNhc3RTaGFkb3cpPyAxIDogMCk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuTWF0ZXJpYWxMYW1iZXJ0LnByb3RvdHlwZS5zZW5kVW5pZm9ybURhdGEgPSBmdW5jdGlvbihtZXNoLCBjYW1lcmEsIHNjZW5lKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHR2YXIgZ2VvbWV0cnkgPSBtZXNoLmdlb21ldHJ5O1xyXG5cdHZhciB0cmFuc2Zvcm1hdGlvbk1hdHJpeDtcclxuXHR2YXIgdW5pZm9ybXMgPSB0aGlzLnNoYWRlci51bmlmb3JtcztcclxuXHR2YXIgbW9kZWxUcmFuc2Zvcm1hdGlvbjtcclxuXHR2YXIgdXNlZExpZ2h0VW5pZm9ybSA9IG51bGw7XHJcblx0dmFyIGxpZ2h0c0NvdW50ID0gMDtcclxuXHR2YXIgc2hhZG93TWFwc1VuaWZvcm0gPSBbXTtcclxuXHRmb3IgKHZhciBpPTAsbGVuPXVuaWZvcm1zLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIHVuaSA9IHVuaWZvcm1zW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAodW5pLm11bHRpICYmIHVuaS50eXBlID09ICdMaWdodCcpe1xyXG5cdFx0XHRpZiAobGlnaHRzQ291bnQgPT0gdW5pLmRhdGEubGVuZ3RoKVxyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR2YXIgbGlnaHRzID0gc2NlbmUubGlnaHRzO1xyXG5cdFx0XHRmb3IgKHZhciBqPTAsamxlbj1saWdodHMubGVuZ3RoO2o8amxlbjtqKyspe1xyXG5cdFx0XHRcdHRoaXMuc2VuZExpZ2h0VW5pZm9ybURhdGEobGlnaHRzW2pdLCB1bmkuZGF0YVtsaWdodHNDb3VudCsrXSwgbW9kZWxUcmFuc2Zvcm1hdGlvbik7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmICh1bmkudHlwZSA9PSAndVNoYWRvd01hcHMnKXtcclxuXHRcdFx0c2hhZG93TWFwc1VuaWZvcm0ucHVzaCh1bmkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TVZNYXRyaXgnKXtcclxuXHRcdFx0bW9kZWxUcmFuc2Zvcm1hdGlvbiA9IG1lc2guZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuXHRcdFx0dHJhbnNmb3JtYXRpb25NYXRyaXggPSBtb2RlbFRyYW5zZm9ybWF0aW9uLmNsb25lKCkubXVsdGlwbHkoY2FtZXJhLnRyYW5zZm9ybWF0aW9uTWF0cml4KTtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdih1bmkubG9jYXRpb24sIGZhbHNlLCB0cmFuc2Zvcm1hdGlvbk1hdHJpeC50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVBNYXRyaXgnKXtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdih1bmkubG9jYXRpb24sIGZhbHNlLCBjYW1lcmEucGVyc3BlY3RpdmVNYXRyaXgudG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VNYXRlcmlhbENvbG9yJyl7XHJcblx0XHRcdHZhciBjb2xvciA9IG1lc2gubWF0ZXJpYWwuY29sb3IuZ2V0UkdCQSgpO1xyXG5cdFx0XHRnbC51bmlmb3JtNGZ2KHVuaS5sb2NhdGlvbiwgbmV3IEZsb2F0MzJBcnJheShjb2xvcikpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VGV4dHVyZVNhbXBsZXInKXtcclxuXHRcdFx0aWYgKG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdFx0Z2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCk7XHJcblx0XHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLnRleHR1cmUpO1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIDApO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VIYXNUZXh0dXJlJyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIChtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApPyAxIDogMCk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VVc2VMaWdodGluZycpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAoc2NlbmUudXNlTGlnaHRpbmcpPyAxIDogMCk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VOb3JtYWxNYXRyaXgnKXtcclxuXHRcdFx0dmFyIG5vcm1hbE1hdHJpeCA9IG1vZGVsVHJhbnNmb3JtYXRpb24udG9NYXRyaXgzKCkuaW52ZXJzZSgpLnRvRmxvYXQzMkFycmF5KCk7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXgzZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgbm9ybWFsTWF0cml4KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1vZGVsTWF0cml4Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgbW9kZWxUcmFuc2Zvcm1hdGlvbi50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUFtYmllbnRMaWdodENvbG9yJyAmJiBzY2VuZS51c2VMaWdodGluZyAmJiBzY2VuZS5hbWJpZW50TGlnaHQpe1xyXG5cdFx0XHR2YXIgY29sb3IgPSBzY2VuZS5hbWJpZW50TGlnaHQuZ2V0UkdCKCk7XHJcblx0XHRcdGdsLnVuaWZvcm0zZih1bmkubG9jYXRpb24sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0pO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1T3BhY2l0eScpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLm9wYWNpdHkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VGV4dHVyZVJlcGVhdCcgJiYgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0Z2wudW5pZm9ybTJmKHVuaS5sb2NhdGlvbiwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLnJlcGVhdC54LCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAucmVwZWF0LnkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1R2VvbWV0cnlVVicgJiYgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0Z2wudW5pZm9ybTRmKHVuaS5sb2NhdGlvbiwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi54LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLnksIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueiwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi53KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVPZmZzZXQnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm0yZih1bmkubG9jYXRpb24sIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5vZmZzZXQueCwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLm9mZnNldC55KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVVzZWRMaWdodHMnKXtcclxuXHRcdFx0dXNlZExpZ2h0VW5pZm9ybSA9IHVuaTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVJlY2VpdmVTaGFkb3cnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKG1lc2gucmVjZWl2ZVNoYWRvdyk/IDEgOiAwKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0aWYgKHVzZWRMaWdodFVuaWZvcm0pe1xyXG5cdFx0Z2wudW5pZm9ybTFpKHVzZWRMaWdodFVuaWZvcm0ubG9jYXRpb24sIGxpZ2h0c0NvdW50KTtcclxuXHR9XHJcblx0XHJcblx0aWYgKHNoYWRvd01hcHNVbmlmb3JtICYmIHNoYWRvd01hcHNVbmlmb3JtLmxlbmd0aCA+IDApe1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8bGlnaHRzQ291bnQ7aSsrKXtcclxuXHRcdFx0aWYgKCFsaWdodHNbaV0uY2FzdFNoYWRvdykgY29udGludWU7XHJcblx0XHRcdFxyXG5cdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUxMCArIGkpO1xyXG5cdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBsaWdodHNbaV0uc2hhZG93QnVmZmVyLnRleHR1cmUpO1xyXG5cdFx0XHRnbC51bmlmb3JtMWkoc2hhZG93TWFwc1VuaWZvcm1baV0ubG9jYXRpb24sIDEwICsgaSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59OyIsInZhciBNYXRlcmlhbCA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbCcpO1xyXG52YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIE1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG5cclxuZnVuY3Rpb24gTWF0ZXJpYWxQaG9uZyh0ZXh0dXJlTWFwLCBjb2xvciwgb3BhY2l0eSl7XHJcblx0dGhpcy5fX2t0bWF0ZXJpYWwgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBtYXRlcmlhbCA9IG5ldyBNYXRlcmlhbCh7XHJcblx0XHR0ZXh0dXJlTWFwOiB0ZXh0dXJlTWFwLFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdFx0b3BhY2l0eTogb3BhY2l0eSxcclxuXHRcdHNoYWRlcjogS1Quc2hhZGVycy5waG9uZ1xyXG5cdH0pO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZU1hcCA9IG1hdGVyaWFsLnRleHR1cmVNYXA7XHJcblx0dGhpcy5zcGVjdWxhck1hcCA9IG51bGw7XHJcblx0XHJcblx0dGhpcy5jb2xvciA9IG1hdGVyaWFsLmNvbG9yO1xyXG5cdHRoaXMuc2hhZGVyID0gbWF0ZXJpYWwuc2hhZGVyO1xyXG5cdHRoaXMub3BhY2l0eSA9IG1hdGVyaWFsLm9wYWNpdHk7XHJcblx0dGhpcy5kcmF3RmFjZXMgPSBtYXRlcmlhbC5kcmF3RmFjZXM7XHJcblx0dGhpcy5kcmF3QXMgPSBtYXRlcmlhbC5kcmF3QXM7XHJcblx0dGhpcy5zcGVjdWxhckNvbG9yID0gbmV3IENvbG9yKENvbG9yLl9XSElURSk7XHJcblx0dGhpcy5zaGluaW5lc3MgPSAwLjA7XHJcblx0dGhpcy50cmFuc3BhcmVudCA9IG1hdGVyaWFsLnRyYW5zcGFyZW50O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGVyaWFsUGhvbmc7XHJcblxyXG5NYXRlcmlhbFBob25nLnByb3RvdHlwZS5zZW5kQXR0cmliRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG5cdGZvciAodmFyIGk9MCxsZW49YXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBhdHQgPSBhdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4UG9zaXRpb25cIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleENvbG9yXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LmNvbG9yc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFUZXh0dXJlQ29vcmRcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS50ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleE5vcm1hbFwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5Lm5vcm1hbHNCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkubm9ybWFsc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5NYXRlcmlhbFBob25nLnByb3RvdHlwZS5zZW5kTGlnaHRVbmlmb3JtRGF0YSA9IGZ1bmN0aW9uKGxpZ2h0LCB1bmlmb3JtLCBtb2RlbFRyYW5zZm9ybWF0aW9uKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRmb3IgKHZhciBpPTAsbGVuPXVuaWZvcm0uZGF0YS5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBkYXQgPSB1bmlmb3JtLmRhdGFbaV07XHJcblx0XHRcclxuXHRcdGlmIChkYXQubmFtZSA9PSAncG9zaXRpb24nKXtcclxuXHRcdFx0aWYgKGxpZ2h0Ll9fa3Rwb2ludGxpZ2h0IHx8IGxpZ2h0Ll9fa3RzcG90bGlnaHQpe1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIGxpZ2h0LnBvc2l0aW9uLngsIGxpZ2h0LnBvc2l0aW9uLnksIGxpZ2h0LnBvc2l0aW9uLnopO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCAwLjAsIDAuMCwgMC4wKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdkaXJlY3Rpb24nKXtcclxuXHRcdFx0aWYgKGxpZ2h0Ll9fa3RkaXJMaWdodCl7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgbGlnaHQuZGlyZWN0aW9uLngsIGxpZ2h0LmRpcmVjdGlvbi55LCBsaWdodC5kaXJlY3Rpb24ueik7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIDAuMCwgMC4wLCAwLjApO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ3Nwb3REaXJlY3Rpb24nKXtcclxuXHRcdFx0aWYgKGxpZ2h0Ll9fa3RzcG90bGlnaHQpe1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIGxpZ2h0LmRpcmVjdGlvbi54LCBsaWdodC5kaXJlY3Rpb24ueSwgbGlnaHQuZGlyZWN0aW9uLnopO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCAwLjAsIDAuMCwgMC4wKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdjb2xvcicpe1xyXG5cdFx0XHR2YXIgY29sb3IgPSBsaWdodC5jb2xvci5nZXRSR0IoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSk7XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ2ludGVuc2l0eScpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWYoZGF0LmxvY2F0aW9uLCBsaWdodC5pbnRlbnNpdHkpO1xyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdvdXRlckFuZ2xlJyl7XHJcblx0XHRcdGlmIChsaWdodC5fX2t0c3BvdGxpZ2h0KXtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWYoZGF0LmxvY2F0aW9uLCBsaWdodC5vdXRlckFuZ2xlKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFmKGRhdC5sb2NhdGlvbiwgMC4wKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdpbm5lckFuZ2xlJyl7XHJcblx0XHRcdGlmIChsaWdodC5fX2t0c3BvdGxpZ2h0KXtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWYoZGF0LmxvY2F0aW9uLCBsaWdodC5pbm5lckFuZ2xlKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFmKGRhdC5sb2NhdGlvbiwgMC4wKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdtdlByb2plY3Rpb24nKXtcclxuXHRcdFx0aWYgKGxpZ2h0LmNhc3RTaGFkb3cpe1xyXG5cdFx0XHRcdHZhciBtdnAgPSBtb2RlbFRyYW5zZm9ybWF0aW9uLmNsb25lKClcclxuXHRcdFx0XHRcdFx0XHQubXVsdGlwbHkobGlnaHQuc2hhZG93Q2FtLnRyYW5zZm9ybWF0aW9uTWF0cml4KVxyXG5cdFx0XHRcdFx0XHRcdC5tdWx0aXBseShsaWdodC5zaGFkb3dDYW0ucGVyc3BlY3RpdmVNYXRyaXgpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmICghbGlnaHQuX19rdGRpckxpZ2h0KXtcclxuXHRcdFx0XHRcdG12cC5tdWx0aXBseShLVC5saWdodE5EQ01hdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYoZGF0LmxvY2F0aW9uLCBmYWxzZSwgbXZwLnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KGRhdC5sb2NhdGlvbiwgZmFsc2UsIE1hdHJpeDQuZ2V0SWRlbnRpdHkoKS50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdjYXN0U2hhZG93Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xaShkYXQubG9jYXRpb24sIChsaWdodC5jYXN0U2hhZG93KT8gMSA6IDApO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbk1hdGVyaWFsUGhvbmcucHJvdG90eXBlLnNlbmRVbmlmb3JtRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIHRyYW5zZm9ybWF0aW9uTWF0cml4O1xyXG5cdHZhciB1bmlmb3JtcyA9IHRoaXMuc2hhZGVyLnVuaWZvcm1zO1xyXG5cdHZhciBtb2RlbFRyYW5zZm9ybWF0aW9uO1xyXG5cdHZhciBsaWdodHMgPSBzY2VuZS5saWdodHM7XHJcblx0dmFyIGxpZ2h0c0NvdW50ID0gMDtcclxuXHRcclxuXHR2YXIgdXNlZExpZ2h0VW5pZm9ybSA9IG51bGw7XHJcblx0dmFyIHNoYWRvd01hcHNVbmlmb3JtID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3Jtcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciB1bmkgPSB1bmlmb3Jtc1tpXTtcclxuXHRcdFxyXG5cdFx0aWYgKHVuaS5tdWx0aSAmJiB1bmkudHlwZSA9PSAnTGlnaHQnKXtcclxuXHRcdFx0aWYgKGxpZ2h0c0NvdW50ID09IHVuaS5kYXRhLmxlbmd0aClcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0Zm9yICh2YXIgaj0wLGpsZW49bGlnaHRzLmxlbmd0aDtqPGpsZW47aisrKXtcclxuXHRcdFx0XHR0aGlzLnNlbmRMaWdodFVuaWZvcm1EYXRhKGxpZ2h0c1tqXSwgdW5pLmRhdGFbbGlnaHRzQ291bnQrK10sIG1vZGVsVHJhbnNmb3JtYXRpb24pO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAodW5pLnR5cGUgPT0gJ3VTaGFkb3dNYXBzJyl7XHJcblx0XHRcdHNoYWRvd01hcHNVbmlmb3JtLnB1c2godW5pKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1WTWF0cml4Jyl7XHJcblx0XHRcdG1vZGVsVHJhbnNmb3JtYXRpb24gPSBtZXNoLmdldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblx0XHRcdHRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbW9kZWxUcmFuc2Zvcm1hdGlvbi5jbG9uZSgpLm11bHRpcGx5KGNhbWVyYS50cmFuc2Zvcm1hdGlvbk1hdHJpeCk7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgdHJhbnNmb3JtYXRpb25NYXRyaXgudG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VQTWF0cml4Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgY2FtZXJhLnBlcnNwZWN0aXZlTWF0cml4LnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TWF0ZXJpYWxDb2xvcicpe1xyXG5cdFx0XHR2YXIgY29sb3IgPSBtZXNoLm1hdGVyaWFsLmNvbG9yLmdldFJHQkEoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTRmdih1bmkubG9jYXRpb24sIG5ldyBGbG9hdDMyQXJyYXkoY29sb3IpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVTYW1wbGVyJyl7XHJcblx0XHRcdGlmIChtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRcdGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTApO1xyXG5cdFx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC50ZXh0dXJlKTtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1SGFzVGV4dHVyZScpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAobWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKT8gMSA6IDApO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VXNlTGlnaHRpbmcnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKHNjZW5lLnVzZUxpZ2h0aW5nKT8gMSA6IDApO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1UmVjZWl2ZVNoYWRvdycpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAobWVzaC5yZWNlaXZlU2hhZG93KT8gMSA6IDApO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1Tm9ybWFsTWF0cml4Jyl7XHJcblx0XHRcdHZhciBub3JtYWxNYXRyaXggPSBtb2RlbFRyYW5zZm9ybWF0aW9uLnRvTWF0cml4MygpLmludmVyc2UoKS50b0Zsb2F0MzJBcnJheSgpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4M2Z2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG5vcm1hbE1hdHJpeCk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VNb2RlbE1hdHJpeCcpe1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG1vZGVsVHJhbnNmb3JtYXRpb24udG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VDYW1lcmFQb3NpdGlvbicpe1xyXG5cdFx0XHRnbC51bmlmb3JtM2YodW5pLmxvY2F0aW9uLCBjYW1lcmEucG9zaXRpb24ueCwgY2FtZXJhLnBvc2l0aW9uLnksIGNhbWVyYS5wb3NpdGlvbi56KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVNwZWN1bGFyQ29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gdGhpcy5zcGVjdWxhckNvbG9yLmdldFJHQigpO1xyXG5cdFx0XHRnbC51bmlmb3JtM2YodW5pLmxvY2F0aW9uLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVNoaW5pbmVzcycpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWYodW5pLmxvY2F0aW9uLCB0aGlzLnNoaW5pbmVzcyk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VBbWJpZW50TGlnaHRDb2xvcicgJiYgc2NlbmUudXNlTGlnaHRpbmcgJiYgc2NlbmUuYW1iaWVudExpZ2h0KXtcclxuXHRcdFx0dmFyIGNvbG9yID0gc2NlbmUuYW1iaWVudExpZ2h0LmdldFJHQigpO1xyXG5cdFx0XHRnbC51bmlmb3JtM2YodW5pLmxvY2F0aW9uLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU9wYWNpdHknKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFmKHVuaS5sb2NhdGlvbiwgbWVzaC5tYXRlcmlhbC5vcGFjaXR5KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVSZXBlYXQnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm0yZih1bmkubG9jYXRpb24sIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5yZXBlYXQueCwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLnJlcGVhdC55KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUdlb21ldHJ5VVYnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm00Zih1bmkubG9jYXRpb24sIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueCwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi55LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLnosIG1lc2guZ2VvbWV0cnkudXZSZWdpb24udyk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlT2Zmc2V0JyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtMmYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAub2Zmc2V0LngsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5vZmZzZXQueSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VVc2VkTGlnaHRzJyl7XHJcblx0XHRcdHVzZWRMaWdodFVuaWZvcm0gPSB1bmk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VVc2VTcGVjdWxhck1hcCcpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAobWVzaC5tYXRlcmlhbC5zcGVjdWxhck1hcCk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVNwZWN1bGFyTWFwU2FtcGxlcicpe1xyXG5cdFx0XHRpZiAobWVzaC5tYXRlcmlhbC5zcGVjdWxhck1hcCl7XHJcblx0XHRcdFx0Z2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMSk7XHJcblx0XHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbWVzaC5tYXRlcmlhbC5zcGVjdWxhck1hcC50ZXh0dXJlKTtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAxKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRpZiAodXNlZExpZ2h0VW5pZm9ybSl7XHJcblx0XHRnbC51bmlmb3JtMWkodXNlZExpZ2h0VW5pZm9ybS5sb2NhdGlvbiwgbGlnaHRzQ291bnQpO1xyXG5cdH1cclxuXHRcclxuXHRpZiAoc2hhZG93TWFwc1VuaWZvcm0gJiYgc2hhZG93TWFwc1VuaWZvcm0ubGVuZ3RoID4gMCl7XHJcblx0XHRmb3IgKHZhciBpPTA7aTxsaWdodHNDb3VudDtpKyspe1xyXG5cdFx0XHRpZiAoIWxpZ2h0c1tpXS5jYXN0U2hhZG93KSBjb250aW51ZTtcclxuXHRcdFx0XHJcblx0XHRcdGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTEwICsgaSk7XHJcblx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIGxpZ2h0c1tpXS5zaGFkb3dCdWZmZXIudGV4dHVyZSk7XHJcblx0XHRcdGdsLnVuaWZvcm0xaShzaGFkb3dNYXBzVW5pZm9ybVtpXS5sb2NhdGlvbiwgMTAgKyBpKTtcclxuXHRcdH1cclxuXHR9XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0cmFkRGVnUmVsOiBNYXRoLlBJIC8gMTgwLFxyXG5cdFxyXG5cdFBJXzI6IE1hdGguUEkgLyAyLFxyXG5cdFBJOiBNYXRoLlBJLFxyXG5cdFBJM18yOiBNYXRoLlBJICogMyAvIDIsXHJcblx0UEkyOiBNYXRoLlBJICogMixcclxuXHRcclxuXHRkZWdUb1JhZDogZnVuY3Rpb24oZGVncmVlcyl7XHJcblx0XHRyZXR1cm4gZGVncmVlcyAqIHRoaXMucmFkRGVnUmVsO1xyXG5cdH0sXHJcblx0XHJcblx0cmFkVG9EZWc6IGZ1bmN0aW9uKHJhZGlhbnMpe1xyXG5cdFx0cmV0dXJuIHJhZGlhbnMgLyB0aGlzLnJhZERlZ1JlbDtcclxuXHR9LFxyXG5cdFxyXG5cdGdldDJEQW5nbGU6IGZ1bmN0aW9uKHgxLCB5MSwgeDIsIHkyKXtcclxuXHRcdHZhciB4eCA9IE1hdGguYWJzKHgyIC0geDEpO1xyXG5cdFx0dmFyIHl5ID0gTWF0aC5hYnMoeTIgLSB5MSk7XHJcblx0XHRcclxuXHRcdHZhciBhbmcgPSBNYXRoLmF0YW4yKHl5LCB4eCk7XHJcblx0XHRcclxuXHRcdGlmICh4MiA8PSB4MSAmJiB5MiA8PSB5MSl7XHJcblx0XHRcdGFuZyA9IHRoaXMuUEkgLSBhbmc7XHJcblx0XHR9ZWxzZSBpZiAoeDIgPD0geDEgJiYgeTIgPiB5MSl7XHJcblx0XHRcdGFuZyA9IHRoaXMuUEkgKyBhbmc7XHJcblx0XHR9ZWxzZSBpZiAoeDIgPiB4MSAmJiB5MiA+IHkxKXtcclxuXHRcdFx0YW5nID0gdGhpcy5QSTIgLSBhbmc7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGFuZyA9IChhbmcgKyB0aGlzLlBJMikgJSB0aGlzLlBJMjtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIGFuZztcclxuXHR9XHJcbn07XHJcbiIsImZ1bmN0aW9uIE1hdHJpeDMoKXtcclxuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSA5KSB0aHJvdyBcIk1hdHJpeCAzIG11c3QgcmVjZWl2ZSA5IHBhcmFtZXRlcnNcIjtcclxuXHRcclxuXHR2YXIgYyA9IDA7XHJcblx0Zm9yICh2YXIgaT0wO2k8OTtpKz0zKXtcclxuXHRcdHRoaXNbY10gPSBhcmd1bWVudHNbaV07XHJcblx0XHR0aGlzW2MrM10gPSBhcmd1bWVudHNbaSsxXTtcclxuXHRcdHRoaXNbYys2XSA9IGFyZ3VtZW50c1tpKzJdO1xyXG5cdFx0XHJcblx0XHRjICs9IDE7XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMuX19rdG10MyA9IHRydWU7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0cml4MztcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLmdldERldGVybWluYW50ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0dmFyIGRldCA9IChUWzBdICogVFs0XSAqIFRbOF0pICsgKFRbMV0gKiBUWzVdICogVFs2XSkgKyAoVFsyXSAqIFRbM10gKiBUWzddKVxyXG5cdFx0XHQtIChUWzZdICogVFs0XSAqIFRbMl0pIC0gKFRbN10gKiBUWzVdICogVFswXSkgLSAoVFs4XSAqIFRbM10gKiBUWzFdKTtcclxuXHRcclxuXHRyZXR1cm4gZGV0O1xyXG59O1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUuaW52ZXJzZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGRldCA9IHRoaXMuZ2V0RGV0ZXJtaW5hbnQoKTtcclxuXHRpZiAoZGV0ID09IDApIHJldHVybiBudWxsO1xyXG5cdFxyXG5cdHZhciBUID0gdGhpcztcclxuXHR2YXIgaW52ID0gbmV3IE1hdHJpeDMoXHJcblx0XHRUWzRdKlRbOF0tVFs1XSpUWzddLFx0VFs1XSpUWzZdLVRbM10qVFs4XSxcdFRbM10qVFs3XS1UWzRdKlRbNl0sXHJcblx0XHRUWzJdKlRbN10tVFsxXSpUWzhdLFx0VFswXSpUWzhdLVRbMl0qVFs2XSxcdFRbMV0qVFs2XS1UWzBdKlRbN10sXHJcblx0XHRUWzFdKlRbNV0tVFsyXSpUWzRdLFx0VFsyXSpUWzNdLVRbMF0qVFs1XSxcdFRbMF0qVFs0XS1UWzFdKlRbM11cclxuXHQpO1xyXG5cdFxyXG5cdGludi5tdWx0aXBseSgxIC8gZGV0KTtcclxuXHR0aGlzLmNvcHkoaW52KTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24obnVtYmVyKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0Zm9yICh2YXIgaT0wO2k8OTtpKyspe1xyXG5cdFx0VFtpXSAqPSBudW1iZXI7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKG1hdHJpeDMpe1xyXG5cdGlmICghbWF0cml4My5fX2t0bXQzKSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSBtYXRyaXgzIGludG8gYW5vdGhlclwiO1xyXG5cdFxyXG5cdHZhciBUID0gdGhpcztcclxuXHRmb3IgKHZhciBpPTA7aTw5O2krKyl7XHJcblx0XHRUW2ldID0gbWF0cml4M1tpXTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS50cmFuc3Bvc2UgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHR2YXIgdmFsdWVzID0gW1xyXG5cdFx0VFswXSwgVFszXSwgVFs2XSxcclxuXHRcdFRbMV0sIFRbNF0sIFRbN10sXHJcblx0XHRUWzJdLCBUWzVdLCBUWzhdXHJcblx0XTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTw5O2krKyl7XHJcblx0XHRUW2ldID0gdmFsdWVzW2ldO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLnRvRmxvYXQzMkFycmF5ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG5cdFx0VFswXSwgVFsxXSwgVFsyXSxcclxuXHRcdFRbM10sIFRbNF0sIFRbNV0sXHJcblx0XHRUWzZdLCBUWzddLCBUWzhdXHJcblx0XSk7XHJcbn07XHJcbiIsInZhciBNYXRyaXgzID0gcmVxdWlyZSgnLi9LVE1hdHJpeDMnKTtcclxuXHJcbmZ1bmN0aW9uIE1hdHJpeDQoKXtcclxuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAxNikgdGhyb3cgXCJNYXRyaXggNCBtdXN0IHJlY2VpdmUgMTYgcGFyYW1ldGVyc1wiO1xyXG5cdFxyXG5cdHZhciBjID0gMDtcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKz00KXtcclxuXHRcdHRoaXNbY10gPSBhcmd1bWVudHNbaV07XHJcblx0XHR0aGlzW2MrNF0gPSBhcmd1bWVudHNbaSsxXTtcclxuXHRcdHRoaXNbYys4XSA9IGFyZ3VtZW50c1tpKzJdO1xyXG5cdFx0dGhpc1tjKzEyXSA9IGFyZ3VtZW50c1tpKzNdO1xyXG5cdFx0XHJcblx0XHRjICs9IDE7XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMuX19rdG00ID0gdHJ1ZTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRyaXg0O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUuaWRlbnRpdHkgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBwYXJhbXMgPSBbXHJcblx0XHQxLCAwLCAwLCAwLFxyXG5cdFx0MCwgMSwgMCwgMCxcclxuXHRcdDAsIDAsIDEsIDAsXHJcblx0XHQwLCAwLCAwLCAxXHJcblx0XTtcclxuXHRcclxuXHR2YXIgYyA9IDA7XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSs9NCl7XHJcblx0XHR0aGlzW2NdID0gcGFyYW1zW2ldO1xyXG5cdFx0dGhpc1tjKzRdID0gcGFyYW1zW2krMV07XHJcblx0XHR0aGlzW2MrOF0gPSBwYXJhbXNbaSsyXTtcclxuXHRcdHRoaXNbYysxMl0gPSBwYXJhbXNbaSszXTtcclxuXHRcdFxyXG5cdFx0YyArPSAxO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLm11bHRpcGx5U2NhbGFyID0gZnVuY3Rpb24obnVtYmVyKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSsrKXtcclxuXHRcdFRbaV0gKj0gbnVtYmVyO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24obWF0cml4NCl7XHJcblx0aWYgKG1hdHJpeDQuX19rdG00KXtcclxuXHRcdHZhciBBMSA9IFt0aGlzWzBdLCAgdGhpc1sxXSwgIHRoaXNbMl0sICB0aGlzWzNdXTtcclxuXHRcdHZhciBBMiA9IFt0aGlzWzRdLCAgdGhpc1s1XSwgIHRoaXNbNl0sICB0aGlzWzddXTtcclxuXHRcdHZhciBBMyA9IFt0aGlzWzhdLCAgdGhpc1s5XSwgIHRoaXNbMTBdLCB0aGlzWzExXV07XHJcblx0XHR2YXIgQTQgPSBbdGhpc1sxMl0sIHRoaXNbMTNdLCB0aGlzWzE0XSwgdGhpc1sxNV1dO1xyXG5cdFx0XHJcblx0XHR2YXIgQjEgPSBbbWF0cml4NFswXSwgbWF0cml4NFs0XSwgbWF0cml4NFs4XSwgIG1hdHJpeDRbMTJdXTtcclxuXHRcdHZhciBCMiA9IFttYXRyaXg0WzFdLCBtYXRyaXg0WzVdLCBtYXRyaXg0WzldLCAgbWF0cml4NFsxM11dO1xyXG5cdFx0dmFyIEIzID0gW21hdHJpeDRbMl0sIG1hdHJpeDRbNl0sIG1hdHJpeDRbMTBdLCBtYXRyaXg0WzE0XV07XHJcblx0XHR2YXIgQjQgPSBbbWF0cml4NFszXSwgbWF0cml4NFs3XSwgbWF0cml4NFsxMV0sIG1hdHJpeDRbMTVdXTtcclxuXHRcdFxyXG5cdFx0dmFyIGRvdCA9IGZ1bmN0aW9uKGNvbCwgcm93KXtcclxuXHRcdFx0dmFyIHN1bSA9IDA7XHJcblx0XHRcdGZvciAodmFyIGo9MDtqPDQ7aisrKXsgc3VtICs9IHJvd1tqXSAqIGNvbFtqXTsgfVxyXG5cdFx0XHRyZXR1cm4gc3VtO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0dGhpc1swXSA9IGRvdChBMSwgQjEpOyAgIHRoaXNbMV0gPSBkb3QoQTEsIEIyKTsgICB0aGlzWzJdID0gZG90KEExLCBCMyk7ICAgdGhpc1szXSA9IGRvdChBMSwgQjQpO1xyXG5cdFx0dGhpc1s0XSA9IGRvdChBMiwgQjEpOyAgIHRoaXNbNV0gPSBkb3QoQTIsIEIyKTsgICB0aGlzWzZdID0gZG90KEEyLCBCMyk7ICAgdGhpc1s3XSA9IGRvdChBMiwgQjQpO1xyXG5cdFx0dGhpc1s4XSA9IGRvdChBMywgQjEpOyAgIHRoaXNbOV0gPSBkb3QoQTMsIEIyKTsgICB0aGlzWzEwXSA9IGRvdChBMywgQjMpOyAgdGhpc1sxMV0gPSBkb3QoQTMsIEI0KTtcclxuXHRcdHRoaXNbMTJdID0gZG90KEE0LCBCMSk7ICB0aGlzWzEzXSA9IGRvdChBNCwgQjIpOyAgdGhpc1sxNF0gPSBkb3QoQTQsIEIzKTsgIHRoaXNbMTVdID0gZG90KEE0LCBCNCk7XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1lbHNlIGlmIChtYXRyaXg0Lmxlbmd0aCA9PSA0KXtcclxuXHRcdHZhciByZXQgPSBbXTtcclxuXHRcdHZhciBjb2wgPSBtYXRyaXg0O1xyXG5cdFxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8NDtpKz0xKXtcclxuXHRcdFx0dmFyIHJvdyA9IFt0aGlzW2ldLCB0aGlzW2krNF0sIHRoaXNbaSs4XSwgdGhpc1tpKzEyXV07XHJcblx0XHRcdHZhciBzdW0gPSAwO1xyXG5cdFx0XHRcclxuXHRcdFx0Zm9yICh2YXIgaj0wO2o8NDtqKyspe1xyXG5cdFx0XHRcdHN1bSArPSByb3dbal0gKiBjb2xbal07XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHJldC5wdXNoKHN1bSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiByZXQ7XHJcblx0fWVsc2V7XHJcblx0XHR0aHJvdyBcIkludmFsaWQgY29uc3RydWN0b3JcIjtcclxuXHR9XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS50cmFuc3Bvc2UgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHR2YXIgdmFsdWVzID0gW1xyXG5cdFx0VFswXSwgVFs0XSwgVFs4XSwgIFRbMTJdLFxyXG5cdFx0VFsxXSwgVFs1XSwgVFs5XSwgIFRbMTNdLFxyXG5cdFx0VFsyXSwgVFs2XSwgVFsxMF0sIFRbMTRdLFxyXG5cdFx0VFszXSwgVFs3XSwgVFsxMV0sIFRbMTVdLFxyXG5cdF07XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSsrKXtcclxuXHRcdHRoaXNbaV0gPSB2YWx1ZXNbaV07XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKG1hdHJpeDQpe1xyXG5cdGlmICghbWF0cml4NC5fX2t0bTQpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIE1hdHJpeDQgaW50byB0aGlzIG1hdHJpeFwiO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPDE2O2krKyl7XHJcblx0XHR0aGlzW2ldID0gbWF0cml4NFtpXTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdFRbMF0sIFRbNF0sIFRbOF0sICBUWzEyXSxcclxuXHRcdFRbMV0sIFRbNV0sIFRbOV0sICBUWzEzXSxcclxuXHRcdFRbMl0sIFRbNl0sIFRbMTBdLCBUWzE0XSxcclxuXHRcdFRbM10sIFRbN10sIFRbMTFdLCBUWzE1XVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS50b0Zsb2F0MzJBcnJheSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFtcclxuXHRcdFRbMF0sIFRbMV0sIFRbMl0sICBUWzNdLFxyXG5cdFx0VFs0XSwgVFs1XSwgVFs2XSwgIFRbN10sXHJcblx0XHRUWzhdLCBUWzldLCBUWzEwXSwgVFsxMV0sXHJcblx0XHRUWzEyXSwgVFsxM10sIFRbMTRdLCBUWzE1XVxyXG5cdF0pO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUudG9NYXRyaXgzID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0cmV0dXJuIG5ldyBNYXRyaXgzKFxyXG5cdFx0VFswXSwgVFsxXSwgVFsyXSxcclxuXHRcdFRbNF0sIFRbNV0sIFRbNl0sXHJcblx0XHRUWzhdLCBUWzldLCBUWzEwXVxyXG5cdCk7IFxyXG59O1xyXG5cclxuTWF0cml4NC5nZXRJZGVudGl0eSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0MSwgMCwgMCwgMCxcclxuXHRcdDAsIDEsIDAsIDAsXHJcblx0XHQwLCAwLCAxLCAwLFxyXG5cdFx0MCwgMCwgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFhSb3RhdGlvbiA9IGZ1bmN0aW9uKHJhZGlhbnMpe1xyXG5cdHZhciBDID0gTWF0aC5jb3MocmFkaWFucyk7XHJcblx0dmFyIFMgPSBNYXRoLnNpbihyYWRpYW5zKTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQxLCAgMCwgIDAsIDAsXHJcblx0XHQwLCAgQywgIFMsIDAsXHJcblx0XHQwLCAtUywgIEMsIDAsXHJcblx0XHQwLCAgMCwgIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRZUm90YXRpb24gPSBmdW5jdGlvbihyYWRpYW5zKXtcclxuXHR2YXIgQyA9IE1hdGguY29zKHJhZGlhbnMpO1xyXG5cdHZhciBTID0gTWF0aC5zaW4ocmFkaWFucyk7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0IEMsICAwLCAgUywgMCxcclxuXHRcdCAwLCAgMSwgIDAsIDAsXHJcblx0XHQtUywgIDAsICBDLCAwLFxyXG5cdFx0IDAsICAwLCAgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFpSb3RhdGlvbiA9IGZ1bmN0aW9uKHJhZGlhbnMpe1xyXG5cdHZhciBDID0gTWF0aC5jb3MocmFkaWFucyk7XHJcblx0dmFyIFMgPSBNYXRoLnNpbihyYWRpYW5zKTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQgQywgIFMsIDAsIDAsXHJcblx0XHQtUywgIEMsIDAsIDAsXHJcblx0XHQgMCwgIDAsIDEsIDAsXHJcblx0XHQgMCwgIDAsIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRUcmFuc2xhdGlvbiA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgdHJhbnNsYXRlIHRvIGEgdmVjdG9yIDNcIjtcclxuXHRcclxuXHR2YXIgeCA9IHZlY3RvcjMueDtcclxuXHR2YXIgeSA9IHZlY3RvcjMueTtcclxuXHR2YXIgeiA9IHZlY3RvcjMuejtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQxLCAwLCAwLCB4LFxyXG5cdFx0MCwgMSwgMCwgeSxcclxuXHRcdDAsIDAsIDEsIHosXHJcblx0XHQwLCAwLCAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0U2NhbGUgPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IHNjYWxlIHRvIGEgdmVjdG9yIDNcIjtcclxuXHRcclxuXHR2YXIgc3ggPSB2ZWN0b3IzLng7XHJcblx0dmFyIHN5ID0gdmVjdG9yMy55O1xyXG5cdHZhciBzeiA9IHZlY3RvcjMuejtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHRzeCwgIDAsICAwLCAwLFxyXG5cdFx0IDAsIHN5LCAgMCwgMCxcclxuXHRcdCAwLCAgMCwgc3osIDAsXHJcblx0XHQgMCwgIDAsICAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0VHJhbnNmb3JtYXRpb24gPSBmdW5jdGlvbihwb3NpdGlvbiwgcm90YXRpb24sIHNjYWxlLCBzdGFjayl7XHJcblx0aWYgKCFwb3NpdGlvbi5fX2t0djMpIHRocm93IFwiUG9zaXRpb24gbXVzdCBiZSBhIFZlY3RvcjNcIjtcclxuXHRpZiAoIXJvdGF0aW9uLl9fa3R2MykgdGhyb3cgXCJSb3RhdGlvbiBtdXN0IGJlIGEgVmVjdG9yM1wiO1xyXG5cdGlmIChzY2FsZSAmJiAhc2NhbGUuX19rdHYzKSB0aHJvdyBcIlNjYWxlIG11c3QgYmUgYSBWZWN0b3IzXCI7XHJcblx0aWYgKCFzdGFjaykgc3RhY2sgPSAnU1J4UnlSelQnO1xyXG5cdFxyXG5cdHZhciBzcyA9IChzdGFjay5pbmRleE9mKFwiU1wiKSAhPSAtMSk7XHJcblx0dmFyIHJ4ID0gKHN0YWNrLmluZGV4T2YoXCJSeFwiKSAhPSAtMSk7XHJcblx0dmFyIHJ5ID0gKHN0YWNrLmluZGV4T2YoXCJSeVwiKSAhPSAtMSk7XHJcblx0dmFyIHJ6ID0gKHN0YWNrLmluZGV4T2YoXCJSelwiKSAhPSAtMSk7XHJcblx0dmFyIHR0ID0gKHN0YWNrLmluZGV4T2YoXCJUXCIpICE9IC0xKTtcclxuXHRcclxuXHR2YXIgc2NhbGUgPSAoc2NhbGUgJiYgc3MpPyBNYXRyaXg0LmdldFNjYWxlKHNjYWxlKSA6IE1hdHJpeDQuZ2V0SWRlbnRpdHkoKTtcclxuXHRcclxuXHR2YXIgcm90YXRpb25YID0gTWF0cml4NC5nZXRYUm90YXRpb24ocm90YXRpb24ueCk7XHJcblx0dmFyIHJvdGF0aW9uWSA9IE1hdHJpeDQuZ2V0WVJvdGF0aW9uKHJvdGF0aW9uLnkpO1xyXG5cdHZhciByb3RhdGlvblogPSBNYXRyaXg0LmdldFpSb3RhdGlvbihyb3RhdGlvbi56KTtcclxuXHRcclxuXHR2YXIgdHJhbnNsYXRpb24gPSBNYXRyaXg0LmdldFRyYW5zbGF0aW9uKHBvc2l0aW9uKTtcclxuXHRcclxuXHR2YXIgbWF0cml4O1xyXG5cdG1hdHJpeCA9IHNjYWxlO1xyXG5cdGlmIChyeCkgbWF0cml4Lm11bHRpcGx5KHJvdGF0aW9uWCk7XHJcblx0aWYgKHJ5KSBtYXRyaXgubXVsdGlwbHkocm90YXRpb25ZKTtcclxuXHRpZiAocnopIG1hdHJpeC5tdWx0aXBseShyb3RhdGlvblopO1xyXG5cdGlmICh0dCkgbWF0cml4Lm11bHRpcGx5KHRyYW5zbGF0aW9uKTtcclxuXHRcclxuXHRyZXR1cm4gbWF0cml4O1xyXG59O1xyXG4iLCJ2YXIgTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcbnZhciBWZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxuXHJcbmZ1bmN0aW9uIE1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKXtcclxuXHRpZiAoIWdlb21ldHJ5Ll9fa3RnZW9tZXRyeSkgdGhyb3cgXCJHZW9tZXRyeSBtdXN0IGJlIGEgS1RHZW9tZXRyeSBpbnN0YW5jZVwiO1xyXG5cdGlmICghbWF0ZXJpYWwuX19rdG1hdGVyaWFsKSB0aHJvdyBcIk1hdGVyaWFsIG11c3QgYmUgYSBLVE1hdGVyaWFsIGluc3RhbmNlXCI7XHJcblx0XHJcblx0dGhpcy5fX2t0bWVzaCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5nZW9tZXRyeSA9IGdlb21ldHJ5O1xyXG5cdHRoaXMubWF0ZXJpYWwgPSBtYXRlcmlhbDtcclxuXHRcclxuXHR0aGlzLnBhcmVudCA9IG51bGw7XHJcblx0dGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLmNhc3RTaGFkb3cgPSBmYWxzZTtcclxuXHR0aGlzLnJlY2VpdmVTaGFkb3cgPSBmYWxzZTtcclxuXHRcclxuXHR0aGlzLnBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMCwgMCwgMCk7XHJcblx0dGhpcy5yb3RhdGlvbiA9IG5ldyBWZWN0b3IzKDAsIDAsIDApO1xyXG5cdHRoaXMuc2NhbGUgPSBuZXcgVmVjdG9yMygxLCAxLCAxKTtcclxuXHRcclxuXHR0aGlzLnByZXZpb3VzUG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmNsb25lKCk7XHJcblx0dGhpcy5wcmV2aW91c1JvdGF0aW9uID0gdGhpcy5yb3RhdGlvbi5jbG9uZSgpO1xyXG5cdHRoaXMucHJldmlvdXNTY2FsZSA9IHRoaXMuc2NhbGUuY2xvbmUoKTtcclxuXHRcclxuXHR0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbnVsbDtcclxuXHR0aGlzLnRyYW5zZm9ybWF0aW9uU3RhY2sgPSAnU1J4UnlSelQnO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lc2g7XHJcblxyXG5NZXNoLnByb3RvdHlwZS5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCA9IGZ1bmN0aW9uKCl7XHJcblx0aWYgKCF0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4IHx8ICF0aGlzLnBvc2l0aW9uLmVxdWFscyh0aGlzLnByZXZpb3VzUG9zaXRpb24pIHx8ICF0aGlzLnJvdGF0aW9uLmVxdWFscyh0aGlzLnByZXZpb3VzUm90YXRpb24pIHx8ICF0aGlzLnNjYWxlLmVxdWFscyh0aGlzLnByZXZpb3VzU2NhbGUpKXtcclxuXHRcdHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBNYXRyaXg0LmdldFRyYW5zZm9ybWF0aW9uKHRoaXMucG9zaXRpb24sIHRoaXMucm90YXRpb24sIHRoaXMuc2NhbGUsIHRoaXMudHJhbnNmb3JtYXRpb25TdGFjayk7XHJcblx0XHRcclxuXHRcdHRoaXMucHJldmlvdXNQb3NpdGlvbi5jb3B5KHRoaXMucG9zaXRpb24pO1xyXG5cdFx0dGhpcy5wcmV2aW91c1JvdGF0aW9uLmNvcHkodGhpcy5yb3RhdGlvbik7XHJcblx0XHR0aGlzLnByZXZpb3VzU2NhbGUuY29weSh0aGlzLnNjYWxlKTtcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMucGFyZW50KXtcclxuXHRcdFx0dmFyIG0gPSB0aGlzLnBhcmVudC5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xyXG5cdFx0XHR0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4Lm11bHRpcGx5KG0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5jbG9uZSgpO1xyXG59O1xyXG4iLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxudmFyIEdlb21ldHJ5R1VJVGV4dHVyZSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeUdVSVRleHR1cmUnKTtcclxudmFyIFRleHR1cmUgPSByZXF1aXJlKCcuL0tUVGV4dHVyZScpO1xyXG52YXIgTWF0ZXJpYWxCYXNpYyA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbEJhc2ljJyk7XHJcbnZhciBWZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxudmFyIE1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG5cclxuZnVuY3Rpb24gTWVzaFNwcml0ZSh3aWR0aCwgaGVpZ2h0LCB0ZXh0dXJlU3JjKXtcclxuXHR0aGlzLl9fa3RtZXNoID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnRleHR1cmUgPSBudWxsO1xyXG5cdGlmICh0ZXh0dXJlU3JjKXtcclxuXHRcdGlmICh0ZXh0dXJlU3JjLl9fa3R0ZXh0dXJlIHx8IHRleHR1cmVTcmMuX19rdHRleHR1cmVmcmFtZWJ1ZmZlcilcclxuXHRcdFx0dGhpcy50ZXh0dXJlID0gdGV4dHVyZVNyYztcclxuXHRcdGVsc2VcclxuXHRcdFx0dGhpcy50ZXh0dXJlID0gbmV3IFRleHR1cmUodGV4dHVyZVNyYyk7XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMuZ2VvbWV0cnkgPSBuZXcgR2VvbWV0cnlHVUlUZXh0dXJlKHdpZHRoLCBoZWlnaHQpO1xyXG5cdHRoaXMubWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWxCYXNpYyh0aGlzLnRleHR1cmUsIFwiI0ZGRkZGRlwiKTtcclxuXHR0aGlzLm1hdGVyaWFsLnRyYW5zcGFyZW50ID0gdHJ1ZTtcclxuXHRcdFxyXG5cdHRoaXMucGFyZW50ID0gbnVsbDtcclxuXHR0aGlzLnZpc2libGUgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMuY2FzdFNoYWRvdyA9IGZhbHNlO1xyXG5cdHRoaXMucmVjZWl2ZVNoYWRvdyA9IGZhbHNlO1xyXG5cdFxyXG5cdHRoaXMucG9zaXRpb24gPSBuZXcgVmVjdG9yMygwLjAsIDAuMCwgMC4wKTtcclxuXHR0aGlzLnJvdGF0aW9uID0gbmV3IFZlY3RvcjMoMC4wLCAwLjAsIDAuMCk7XHJcblx0dGhpcy5zY2FsZSA9IG5ldyBWZWN0b3IzKDEuMCwgMS4wLCAxLjApO1xyXG5cdFxyXG5cdHRoaXMucHJldmlvdXNQb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uY2xvbmUoKTtcclxuXHR0aGlzLnByZXZpb3VzUm90YXRpb24gPSB0aGlzLnJvdGF0aW9uLmNsb25lKCk7XHJcblx0dGhpcy5wcmV2aW91c1NjYWxlID0gdGhpcy5zY2FsZS5jbG9uZSgpO1xyXG5cdFxyXG5cdHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBudWxsO1xyXG5cdHRoaXMudHJhbnNmb3JtYXRpb25TdGFjayA9ICdTUnpUJztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXNoU3ByaXRlO1xyXG5cclxuTWVzaFNwcml0ZS5wcm90b3R5cGUuZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXggPSBmdW5jdGlvbigpe1xyXG5cdGlmICghdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCB8fCAhdGhpcy5wb3NpdGlvbi5lcXVhbHModGhpcy5wcmV2aW91c1Bvc2l0aW9uKSB8fCAhdGhpcy5yb3RhdGlvbi5lcXVhbHModGhpcy5wcmV2aW91c1JvdGF0aW9uKSB8fCAhdGhpcy5zY2FsZS5lcXVhbHModGhpcy5wcmV2aW91c1NjYWxlKSl7XHJcblx0XHR0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gTWF0cml4NC5nZXRUcmFuc2Zvcm1hdGlvbih0aGlzLnBvc2l0aW9uLCB0aGlzLnJvdGF0aW9uLCB0aGlzLnNjYWxlLCB0aGlzLnRyYW5zZm9ybWF0aW9uU3RhY2spO1xyXG5cdFx0XHJcblx0XHR0aGlzLnByZXZpb3VzUG9zaXRpb24uY29weSh0aGlzLnBvc2l0aW9uKTtcclxuXHRcdHRoaXMucHJldmlvdXNSb3RhdGlvbi5jb3B5KHRoaXMucm90YXRpb24pO1xyXG5cdFx0dGhpcy5wcmV2aW91c1NjYWxlLmNvcHkodGhpcy5zY2FsZSk7XHJcblx0XHRcclxuXHRcdGlmICh0aGlzLnBhcmVudCl7XHJcblx0XHRcdHZhciBtID0gdGhpcy5wYXJlbnQuZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuXHRcdFx0dGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5tdWx0aXBseShtKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXguY2xvbmUoKTtcclxufTsiLCJ2YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcbnZhciBWZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxudmFyIElucHV0ID0gcmVxdWlyZSgnLi9LVElucHV0Jyk7XHJcbnZhciBLVE1hdGggPSByZXF1aXJlKCcuL0tUTWF0aCcpO1xyXG5cclxuZnVuY3Rpb24gT3JiaXRBbmRQYW4odGFyZ2V0KXtcclxuXHR0aGlzLl9fa3RDYW1DdHJscyA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5jYW1lcmEgPSBudWxsO1xyXG5cdHRoaXMubGFzdERyYWcgPSBudWxsO1xyXG5cdHRoaXMubGFzdFBhbiA9IG51bGw7XHJcblx0dGhpcy50YXJnZXQgPSAodGFyZ2V0KT8gdGFyZ2V0IDogbmV3IFZlY3RvcjMoMC4wLCAwLjAsIDAuMCk7XHJcblx0dGhpcy5hbmdsZSA9IG5ldyBWZWN0b3IyKDAuMCwgMC4wKTtcclxuXHR0aGlzLnpvb20gPSAxO1xyXG5cdHRoaXMuc2Vuc2l0aXZpdHkgPSBuZXcgVmVjdG9yMigwLjUsIDAuNSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT3JiaXRBbmRQYW47XHJcblxyXG5PcmJpdEFuZFBhbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKXtcclxuXHRpZiAodGhpcy5jYW1lcmEubG9ja2VkKSByZXR1cm47XHJcblx0XHJcblx0aWYgKElucHV0LmlzV2hlZWxNb3ZlZChJbnB1dC52TW91c2UuV0hFRUxVUCkpeyB0aGlzLnpvb20gLT0gMC4zOyB0aGlzLnNldENhbWVyYVBvc2l0aW9uKCk7IH1cclxuXHRlbHNlIGlmIChJbnB1dC5pc1doZWVsTW92ZWQoSW5wdXQudk1vdXNlLldIRUVMRE9XTikpeyB0aGlzLnpvb20gKz0gMC4zOyB0aGlzLnNldENhbWVyYVBvc2l0aW9uKCk7IH1cclxuXHRcclxuXHRpZiAoSW5wdXQuaXNNb3VzZURvd24oSW5wdXQudk1vdXNlLkxFRlQpKXtcclxuXHRcdGlmICh0aGlzLmxhc3REcmFnID09IG51bGwpIHRoaXMubGFzdERyYWcgPSBJbnB1dC5fbW91c2UucG9zaXRpb24uY2xvbmUoKTtcclxuXHRcdFxyXG5cdFx0dmFyIGR4ID0gSW5wdXQuX21vdXNlLnBvc2l0aW9uLnggLSB0aGlzLmxhc3REcmFnLng7XHJcblx0XHR2YXIgZHkgPSBJbnB1dC5fbW91c2UucG9zaXRpb24ueSAtIHRoaXMubGFzdERyYWcueTtcclxuXHRcdFxyXG5cdFx0aWYgKGR4ICE9IDAuMCB8fCBkeSAhPSAwLjApe1xyXG5cdFx0XHR0aGlzLmFuZ2xlLnggLT0gS1RNYXRoLmRlZ1RvUmFkKGR4ICogdGhpcy5zZW5zaXRpdml0eS54KTtcclxuXHRcdFx0dGhpcy5hbmdsZS55IC09IEtUTWF0aC5kZWdUb1JhZChkeSAqIHRoaXMuc2Vuc2l0aXZpdHkueSk7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnNldENhbWVyYVBvc2l0aW9uKCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMubGFzdERyYWcuY29weShJbnB1dC5fbW91c2UucG9zaXRpb24pO1xyXG5cdH1lbHNle1xyXG5cdFx0dGhpcy5sYXN0RHJhZyA9IG51bGw7XHJcblx0fVxyXG5cdFxyXG5cdGlmIChJbnB1dC5pc01vdXNlRG93bihJbnB1dC52TW91c2UuUklHSFQpKXtcclxuXHRcdGlmICh0aGlzLmxhc3RQYW4gPT0gbnVsbCkgdGhpcy5sYXN0UGFuID0gSW5wdXQuX21vdXNlLnBvc2l0aW9uLmNsb25lKCk7XHJcblx0XHRcclxuXHRcdHZhciBkeCA9IElucHV0Ll9tb3VzZS5wb3NpdGlvbi54IC0gdGhpcy5sYXN0UGFuLng7XHJcblx0XHR2YXIgZHkgPSBJbnB1dC5fbW91c2UucG9zaXRpb24ueSAtIHRoaXMubGFzdFBhbi55O1xyXG5cdFx0XHJcblx0XHRpZiAoZHggIT0gMC4wIHx8IGR5ICE9IDAuMCl7XHJcblx0XHRcdHZhciB0aGV0YSA9IC10aGlzLmFuZ2xlLnk7XHJcblx0XHRcdHZhciBhbmcgPSAtdGhpcy5hbmdsZS54IC0gS1RNYXRoLlBJXzI7XHJcblx0XHRcdHZhciBjb3MgPSBNYXRoLmNvcyhhbmcpO1xyXG5cdFx0XHR2YXIgc2luID0gTWF0aC5zaW4oYW5nKTtcclxuXHRcdFx0dmFyIGNvc1QgPSBNYXRoLmNvcyh0aGV0YSk7XHJcblx0XHRcdHZhciBzaW5UID0gTWF0aC5zaW4odGhldGEpO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy50YXJnZXQueCAtPSBjb3MgKiBkeCAqIHRoaXMuc2Vuc2l0aXZpdHkueCAvIDEwO1xyXG5cdFx0XHR0aGlzLnRhcmdldC55ICs9IGNvc1QgKiBkeSAqIHRoaXMuc2Vuc2l0aXZpdHkueSAvIDEwO1xyXG5cdFx0XHR0aGlzLnRhcmdldC56IC09IHNpbiAqIGR4ICogdGhpcy5zZW5zaXRpdml0eS54IC8gMTA7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnNldENhbWVyYVBvc2l0aW9uKCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMubGFzdFBhbi5jb3B5KElucHV0Ll9tb3VzZS5wb3NpdGlvbik7XHJcblx0fWVsc2V7XHJcblx0XHR0aGlzLmxhc3RQYW4gPSBudWxsO1xyXG5cdH1cclxufTtcclxuXHJcbk9yYml0QW5kUGFuLnByb3RvdHlwZS5zZXRDYW1lcmFQb3NpdGlvbiA9IGZ1bmN0aW9uKCl7XHJcblx0dGhpcy5hbmdsZS54ID0gKHRoaXMuYW5nbGUueCArIEtUTWF0aC5QSTIpICUgS1RNYXRoLlBJMjtcclxuXHR0aGlzLmFuZ2xlLnkgPSAodGhpcy5hbmdsZS55ICsgS1RNYXRoLlBJMikgJSBLVE1hdGguUEkyO1xyXG5cdFxyXG5cdGlmICh0aGlzLmFuZ2xlLnkgPCBLVE1hdGguUEkgJiYgdGhpcy5hbmdsZS55ID49IEtUTWF0aC5QSV8yKSB0aGlzLmFuZ2xlLnkgPSBLVE1hdGguZGVnVG9SYWQoODkuOSk7XHJcblx0aWYgKHRoaXMuYW5nbGUueSA+IEtUTWF0aC5QSSAmJiB0aGlzLmFuZ2xlLnkgPD0gS1RNYXRoLlBJM18yKSB0aGlzLmFuZ2xlLnkgPSBLVE1hdGguZGVnVG9SYWQoMjcwLjkpO1xyXG5cdGlmICh0aGlzLnpvb20gPD0gMC4zKSB0aGlzLnpvb20gPSAwLjM7XHJcblx0XHJcblx0dmFyIGNvc1QgPSBNYXRoLmNvcyh0aGlzLmFuZ2xlLnkpO1xyXG5cdHZhciBzaW5UID0gTWF0aC5zaW4odGhpcy5hbmdsZS55KTtcclxuXHRcclxuXHR2YXIgeCA9IHRoaXMudGFyZ2V0LnggKyBNYXRoLmNvcyh0aGlzLmFuZ2xlLngpICogY29zVCAqIHRoaXMuem9vbTtcclxuXHR2YXIgeSA9IHRoaXMudGFyZ2V0LnkgKyBzaW5UICogdGhpcy56b29tO1xyXG5cdHZhciB6ID0gdGhpcy50YXJnZXQueiAtIE1hdGguc2luKHRoaXMuYW5nbGUueCkgKiBjb3NUICogdGhpcy56b29tO1xyXG5cdFxyXG5cdHRoaXMuY2FtZXJhLnBvc2l0aW9uLnNldCh4LCB5LCB6KTtcclxuXHR0aGlzLmNhbWVyYS5sb29rQXQodGhpcy50YXJnZXQpO1xyXG59O1xyXG4iLCJ2YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIE1hdGVyaWFsID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsJyk7XHJcbnZhciBNYXRlcmlhbEJhc2ljID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsQmFzaWMnKTtcclxuXHJcbmZ1bmN0aW9uIFNjZW5lKHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0c2NlbmUgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMubWVzaGVzID0gW107XHJcblx0dGhpcy5saWdodHMgPSBbXTtcclxuXHR0aGlzLnNoYWRpbmdNb2RlID0gWydCQVNJQycsICdMQU1CRVJUJ107XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMudXNlTGlnaHRpbmcgPSAocGFyYW1zLnVzZUxpZ2h0aW5nKT8gdHJ1ZSA6IGZhbHNlO1xyXG5cdHRoaXMuYW1iaWVudExpZ2h0ID0gKHBhcmFtcy5hbWJpZW50TGlnaHQpPyBuZXcgQ29sb3IocGFyYW1zLmFtYmllbnRMaWdodCkgOiBudWxsO1xyXG5cdFxyXG5cdHRoaXMuc2V0U2hhZG93TWF0ZXJpYWwoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY2VuZTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5zZXRTaGFkb3dNYXRlcmlhbCA9IGZ1bmN0aW9uKCl7XHJcblx0dGhpcy5zaGFkb3dNYXBwaW5nID0gZmFsc2U7XHJcblx0dGhpcy5zaGFkb3dNYXQgPSBuZXcgTWF0ZXJpYWwoe1xyXG5cdFx0c2hhZGVyOiBLVC5zaGFkZXJzLmRlcHRoLFxyXG5cdFx0c2VuZEF0dHJpYkRhdGE6IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdFx0XHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcdFx0dmFyIGdlb21ldHJ5ID0gbWVzaC5nZW9tZXRyeTtcclxuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG5cdFx0XHRmb3IgKHZhciBpPTAsbGVuPWF0dHJpYnV0ZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHRcdFx0dmFyIGF0dCA9IGF0dHJpYnV0ZXNbaV07XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKGF0dC5uYW1lID09IFwiYVZlcnRleFBvc2l0aW9uXCIpe1xyXG5cdFx0XHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LnZlcnRleEJ1ZmZlcik7XHJcblx0XHRcdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHNlbmRVbmlmb3JtRGF0YTogZnVuY3Rpb24obWVzaCwgY2FtZXJhLCBzY2VuZSl7XHJcblx0XHRcdHZhciBnbCA9IEtULmdsO1xyXG5cdFx0XHR2YXIgdW5pZm9ybXMgPSB0aGlzLnNoYWRlci51bmlmb3JtcztcclxuXHRcdFx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3Jtcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdFx0XHR2YXIgdW5pID0gdW5pZm9ybXNbaV07XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKHVuaS5uYW1lID09ICd1TVZQTWF0cml4Jyl7XHJcblx0XHRcdFx0XHR2YXIgbXZwID0gbWVzaC5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpLm11bHRpcGx5KGNhbWVyYS50cmFuc2Zvcm1hdGlvbk1hdHJpeCkubXVsdGlwbHkoY2FtZXJhLnBlcnNwZWN0aXZlTWF0cml4KTtcclxuXHRcdFx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgbXZwLnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG59O1xyXG5cclxuU2NlbmUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG9iamVjdCl7XHJcblx0aWYgKG9iamVjdC5fX2t0bWVzaCl7XHJcblx0XHR0aGlzLm1lc2hlcy5wdXNoKG9iamVjdCk7XHJcblx0fWVsc2UgaWYgKG9iamVjdC5fX2t0ZGlyTGlnaHQgfHwgb2JqZWN0Ll9fa3Rwb2ludGxpZ2h0IHx8IG9iamVjdC5fX2t0c3BvdGxpZ2h0KXtcclxuXHRcdHRoaXMubGlnaHRzLnB1c2gob2JqZWN0KTtcclxuXHR9ZWxzZXtcclxuXHRcdHRocm93IFwiQ2FuJ3QgYWRkIHRoZSBvYmplY3QgdG8gdGhlIHNjZW5lXCI7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuU2NlbmUucHJvdG90eXBlLmRyYXdNZXNoID0gZnVuY3Rpb24obWVzaCwgY2FtZXJhKXtcclxuXHRpZiAoIW1lc2guZ2VvbWV0cnkucmVhZHkpIHJldHVybjtcclxuXHRpZiAodGhpcy5zaGFkb3dNYXBwaW5nICYmICFtZXNoLmNhc3RTaGFkb3cpIHJldHVybjtcclxuXHRcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHR2YXIgbWF0ZXJpYWwgPSAodGhpcy5zaGFkb3dNYXBwaW5nKT8gdGhpcy5zaGFkb3dNYXQgOiBtZXNoLm1hdGVyaWFsO1xyXG5cdHZhciBzaGFkZXIgPSBtYXRlcmlhbC5zaGFkZXI7XHJcblx0XHJcblx0S1Quc3dpdGNoUHJvZ3JhbShzaGFkZXIpO1xyXG5cdHRoaXMuc2V0TWF0ZXJpYWxBdHRyaWJ1dGVzKG1lc2gubWF0ZXJpYWwpO1xyXG5cdFxyXG5cdG1hdGVyaWFsLnNlbmRBdHRyaWJEYXRhKG1lc2gsIGNhbWVyYSwgdGhpcyk7XHJcblx0bWF0ZXJpYWwuc2VuZFVuaWZvcm1EYXRhKG1lc2gsIGNhbWVyYSwgdGhpcyk7XHJcblx0XHJcblx0Z2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbWVzaC5nZW9tZXRyeS5mYWNlc0J1ZmZlcik7XHJcblx0Z2wuZHJhd0VsZW1lbnRzKGdsW21hdGVyaWFsLmRyYXdBc10sIG1lc2guZ2VvbWV0cnkuZmFjZXNCdWZmZXIubnVtSXRlbXMsIGdsLlVOU0lHTkVEX1NIT1JULCAwKTtcclxufTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCl7XHJcblx0S1QuZ2wuY2xlYXIoS1QuZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IEtULmdsLkRFUFRIX0JVRkZFUl9CSVQpO1xyXG59O1xyXG5cclxuU2NlbmUucHJvdG90eXBlLnJlbmRlclRvRnJhbWVidWZmZXIgPSBmdW5jdGlvbihjYW1lcmEsIGZyYW1lYnVmZmVyKXtcclxuXHRpZiAoIWZyYW1lYnVmZmVyLl9fa3R0ZXh0dXJlZnJhbWVidWZmZXIpIHRocm93IFwiZnJhbWVidWZmZXIgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiBUZXh0dXJlRnJhbWVidWZmZXJcIjtcclxuXHRcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZyYW1lYnVmZmVyLmZyYW1lYnVmZmVyKTtcclxuXHRnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XHJcblx0Z2wuY2xlYXJDb2xvcigxLjAsIDEuMCwgMS4wLCAxLjApO1xyXG5cdGdsLnZpZXdwb3J0KDAsMCxmcmFtZWJ1ZmZlci53aWR0aCxmcmFtZWJ1ZmZlci5oZWlnaHQpO1xyXG5cdHRoaXMucmVuZGVyKGNhbWVyYSk7XHJcblx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcclxuXHRnbC52aWV3cG9ydCgwLDAsZ2wud2lkdGgsZ2wuaGVpZ2h0KTtcclxufTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihjYW1lcmEsIHNjZW5lKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHRcclxuXHRpZiAoIXRoaXMuc2hhZG93TWFwcGluZyl7XHJcblx0XHRmb3IgKHZhciBpPTAsbGVuPXRoaXMubGlnaHRzLmxlbmd0aC0xO2k8PWxlbjtpKyspe1xyXG5cdFx0XHRpZiAodGhpcy5saWdodHNbaV0uY2FzdFNoYWRvdyl7XHJcblx0XHRcdFx0dGhpcy5zaGFkb3dNYXBwaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLnJlbmRlclRvRnJhbWVidWZmZXIodGhpcy5saWdodHNbaV0uc2hhZG93Q2FtLCB0aGlzLmxpZ2h0c1tpXS5zaGFkb3dCdWZmZXIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoaSA9PSBsZW4pe1xyXG5cdFx0XHRcdHRoaXMuc2hhZG93TWFwcGluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmIChjYW1lcmEuY29udHJvbHMpIGNhbWVyYS5jb250cm9scy51cGRhdGUoKTtcclxuXHRcclxuXHRcdGlmIChjYW1lcmEuc2t5Ym94KXtcclxuXHRcdFx0dmFyIHNreSA9IGNhbWVyYS5za3lib3gubWVzaGVzO1xyXG5cdFx0XHRmb3IgKHZhciBpPTAsbGVuPXNreS5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdFx0XHR0aGlzLmRyYXdNZXNoKHNreVtpXSwgY2FtZXJhKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRnbC5kaXNhYmxlKCBnbC5CTEVORCApOyBcclxuXHR2YXIgdHJhbnNwYXJlbnRzID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLm1lc2hlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBtZXNoID0gdGhpcy5tZXNoZXNbaV07XHJcblx0XHRpZiAoIW1lc2gudmlzaWJsZSkgY29udGludWU7XHJcblx0XHRpZiAobWVzaC5tYXRlcmlhbC5vcGFjaXR5ID09IDAuMCkgY29udGludWU7XHJcblx0XHRcclxuXHRcdGlmIChtZXNoLm1hdGVyaWFsLm9wYWNpdHkgIT0gMS4wIHx8IG1lc2gubWF0ZXJpYWwudHJhbnNwYXJlbnQpe1xyXG5cdFx0XHR0cmFuc3BhcmVudHMucHVzaChtZXNoKTtcclxuXHRcdFx0Y29udGludWU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuZHJhd01lc2gobWVzaCwgY2FtZXJhKTtcclxuXHR9XHJcblx0XHJcblx0Z2wuZW5hYmxlKCBnbC5CTEVORCApOyBcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRyYW5zcGFyZW50cy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBtZXNoID0gdHJhbnNwYXJlbnRzW2ldO1xyXG5cdFx0dGhpcy5kcmF3TWVzaChtZXNoLCBjYW1lcmEpO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblxuU2NlbmUucHJvdG90eXBlLnNldE1hdGVyaWFsQXR0cmlidXRlcyA9IGZ1bmN0aW9uKG1hdGVyaWFsKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHR2YXIgY3VsbCA9IFwiQkFDS1wiO1xyXG5cdGlmIChtYXRlcmlhbC5kcmF3RmFjZXMgPT0gJ0JBQ0snKXsgY3VsbCA9IFwiRlJPTlRcIjsgfVxyXG5cdGVsc2UgaWYgKG1hdGVyaWFsLmRyYXdGYWNlcyA9PSAnQk9USCcpeyBjdWxsID0gXCJcIjsgfVxyXG5cdFxyXG5cdGlmIChjdWxsICE9IFwiXCIpe1xyXG5cdFx0Z2wuZW5hYmxlKGdsLkNVTExfRkFDRSk7XHJcblx0XHRnbC5jdWxsRmFjZShnbFtjdWxsXSk7XHJcblx0fWVsc2V7XHJcblx0XHRnbC5kaXNhYmxlKGdsLkNVTExfRkFDRSk7XHJcblx0fVxyXG59O1xyXG4iLCJ2YXIgc3RydWN0cyA9IHtcclxuXHRMaWdodDogXCJzdHJ1Y3QgTGlnaHR7IFwiICtcclxuXHQgICAgXCJsb3dwIHZlYzMgcG9zaXRpb247IFwiICtcclxuXHQgICAgXCJsb3dwIHZlYzMgY29sb3I7IFwiICtcclxuXHQgICAgXCJsb3dwIHZlYzMgZGlyZWN0aW9uOyBcIiArXHJcblx0ICAgIFwibG93cCB2ZWMzIHNwb3REaXJlY3Rpb247IFwiICtcclxuXHQgICAgXCJsb3dwIGZsb2F0IGludGVuc2l0eTsgXCIgK1xyXG5cdCAgICBcImxvd3AgZmxvYXQgaW5uZXJBbmdsZTsgXCIgK1xyXG5cdCAgICBcImxvd3AgZmxvYXQgb3V0ZXJBbmdsZTsgXCIgK1xyXG5cdCAgICBcImJvb2wgY2FzdFNoYWRvdzsgXCIgK1xyXG5cdCAgICBcIm1lZGl1bXAgbWF0NCBtdlByb2plY3Rpb247IFwiICtcclxuXHRcIn07IFwiXHJcbn07XHJcblxyXG52YXIgZnVuY3Rpb25zID0ge1xyXG5cdGNhbGNTaGFkb3dGYWN0b3IgOiBcImxvd3AgZmxvYXQgY2FsY1NoYWRvd0ZhY3RvcihzYW1wbGVyMkQgc2hhZG93TWFwLCBtZWRpdW1wIHZlYzQgbGlnaHRTcGFjZVBvcyl7IFwiICtcclxuXHRcdFwiaWYgKCF1UmVjZWl2ZVNoYWRvdykgXCIgK1xyXG5cdFx0XHRcInJldHVybiAxLjA7IFwiICtcclxuXHQgICAgXCJtZWRpdW1wIHZlYzMgcHJvakNvb3JkcyA9IGxpZ2h0U3BhY2VQb3MueHl6IC8gbGlnaHRTcGFjZVBvcy53OyBcIiArXHJcblx0ICAgIFwibWVkaXVtcCB2ZWMyIFVWQ29vcmRzOyBcIiArXHJcblx0ICAgIFwiVVZDb29yZHMueCA9IHByb2pDb29yZHMueDsgXCIgK1xyXG5cdCAgICBcIlVWQ29vcmRzLnkgPSBwcm9qQ29vcmRzLnk7IFwiICtcclxuXHQgICAgXHJcblx0ICAgIFwiaWYgKFVWQ29vcmRzLnggPiAxLjAgfHwgVVZDb29yZHMueSA+IDEuMCkgcmV0dXJuIDEuMDsgXCIgK1xyXG5cdCAgICBcclxuXHQgICAgXCJtZWRpdW1wIGZsb2F0IHogPSAxLjAgLSAoMS4wIC0gKHByb2pDb29yZHMueikpICogMjUuMDsgXCIgK1xyXG5cdCAgICBcIm1lZGl1bXAgdmVjNCB0ZXhDb29yZCA9IHRleHR1cmUyRChzaGFkb3dNYXAsIFVWQ29vcmRzKTsgXCIgK1xyXG5cdCAgICBcIm1lZGl1bXAgZmxvYXQgZGVwdGggPSB0ZXhDb29yZC54OyBcIiArXHJcblx0ICAgIFwiaWYgKGRlcHRoIDwgKHogLSAwLjAwNSkpIFwiICtcclxuXHQgICAgICAgIFwicmV0dXJuIDAuMjsgXCIgKyBcclxuXHQgICAgXCJyZXR1cm4gMS4wOyBcIiArXHJcblx0XCJ9IFwiLFxyXG5cdFxyXG5cdHNldExpZ2h0UG9zaXRpb246IFwidm9pZCBzZXRMaWdodFBvc2l0aW9uKGludCBpbmRleCwgbWVkaXVtcCB2ZWM0IHBvc2l0aW9uKXsgXCIgK1xyXG5cdFx0XCJpZiAoaW5kZXggPT0gMCl7IHZMaWdodFBvc2l0aW9uWzBdID0gcG9zaXRpb247IHJldHVybjsgfVwiICtcclxuXHRcdFwiaWYgKGluZGV4ID09IDEpeyB2TGlnaHRQb3NpdGlvblsxXSA9IHBvc2l0aW9uOyByZXR1cm47IH1cIiArXHJcblx0XHRcImlmIChpbmRleCA9PSAyKXsgdkxpZ2h0UG9zaXRpb25bMl0gPSBwb3NpdGlvbjsgcmV0dXJuOyB9XCIgK1xyXG5cdFx0XCJpZiAoaW5kZXggPT0gMyl7IHZMaWdodFBvc2l0aW9uWzNdID0gcG9zaXRpb247IHJldHVybjsgfVwiICtcclxuXHRcIn0gXCIsXHJcblx0XHJcblx0Z2V0TGlnaHRQb3NpdGlvbjogXCJtZWRpdW1wIHZlYzQgZ2V0TGlnaHRQb3NpdGlvbihpbnQgaW5kZXgpeyBcIiArXHJcblx0XHRcImlmIChpbmRleCA9PSAwKXsgcmV0dXJuIHZMaWdodFBvc2l0aW9uWzBdOyB9XCIgK1xyXG5cdFx0XCJpZiAoaW5kZXggPT0gMSl7IHJldHVybiB2TGlnaHRQb3NpdGlvblsxXTsgfVwiICtcclxuXHRcdFwiaWYgKGluZGV4ID09IDIpeyByZXR1cm4gdkxpZ2h0UG9zaXRpb25bMl07IH1cIiArXHJcblx0XHRcImlmIChpbmRleCA9PSAzKXsgcmV0dXJuIHZMaWdodFBvc2l0aW9uWzNdOyB9XCIgK1xyXG5cdFx0XCJyZXR1cm4gdmVjNCgwLjApOyBcIiArXHJcblx0XCJ9IFwiLFxyXG5cdFxyXG5cdGdldExpZ2h0V2VpZ2h0OiBcIm1lZGl1bXAgdmVjMyBnZXRMaWdodFdlaWdodChtZWRpdW1wIHZlYzMgbm9ybWFsLCBtZWRpdW1wIHZlYzMgZGlyZWN0aW9uLCBsb3dwIHZlYzMgY29sb3IsIGxvd3AgZmxvYXQgaW50ZW5zaXR5KXsgXCIgK1xyXG5cdFx0XCJtZWRpdW1wIGZsb2F0IGxpZ2h0RG90ID0gbWF4KGRvdChub3JtYWwsIGRpcmVjdGlvbiksIDAuMCk7IFwiICtcclxuXHRcdFwibWVkaXVtcCB2ZWMzIGxpZ2h0V2VpZ2h0ID0gKGNvbG9yICogbGlnaHREb3QgKiBpbnRlbnNpdHkpOyBcIiArXHJcblx0XHRcInJldHVybiBsaWdodFdlaWdodDsgXCIgK1xyXG5cdFwifVwiXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRiYXNpYzoge1xyXG5cdFx0dmVydGV4U2hhZGVyOiBcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMyIGFUZXh0dXJlQ29vcmQ7IFwiICtcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBsb3dwIHZlYzQgYVZlcnRleENvbG9yOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVNVlBNYXRyaXg7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjNCB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMiB2VGV4dHVyZUNvb3JkO1wiICsgIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICsgXHJcblx0XHRcdFx0XCJnbF9Qb3NpdGlvbiA9IHVNVlBNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XHRcInZWZXJ0ZXhDb2xvciA9IGFWZXJ0ZXhDb2xvciAqIHVNYXRlcmlhbENvbG9yOyBcIiArXHJcblx0XHRcdFx0XCJ2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDsgXCIgKyBcclxuXHRcdFx0XCJ9IFwiICxcclxuXHRcdFx0XHJcblx0XHRmcmFnbWVudFNoYWRlcjogXHJcblx0XHRcdFwidW5pZm9ybSBzYW1wbGVyMkQgdVRleHR1cmVTYW1wbGVyOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVIYXNUZXh0dXJlOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzIgdVRleHR1cmVSZXBlYXQ7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMiB1VGV4dHVyZU9mZnNldDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCB2ZWM0IHVHZW9tZXRyeVVWOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdlZlcnRleENvbG9yOyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjNCBjb2xvciA9IHZWZXJ0ZXhDb2xvcjsgXCIgKyBcclxuXHRcdFx0XHRcImlmICh1SGFzVGV4dHVyZSl7IFwiICsgXHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgdHggPSB1R2VvbWV0cnlVVi54ICsgbW9kKHVUZXh0dXJlT2Zmc2V0LnggKyB2VGV4dHVyZUNvb3JkLnMgKiB1VGV4dHVyZVJlcGVhdC54IC0gdUdlb21ldHJ5VVYueCwgdUdlb21ldHJ5VVYueiAtIHVHZW9tZXRyeVVWLngpO1wiICtcclxuXHRcdFx0XHRcdFwibWVkaXVtcCBmbG9hdCB0eSA9IHVHZW9tZXRyeVVWLnkgKyBtb2QodVRleHR1cmVPZmZzZXQueSArIHZUZXh0dXJlQ29vcmQudCAqIHVUZXh0dXJlUmVwZWF0LnkgLSB1R2VvbWV0cnlVVi55LCB1R2VvbWV0cnlVVi53IC0gdUdlb21ldHJ5VVYueSk7XCIgK1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjNCB0ZXhDb2xvciA9IHRleHR1cmUyRCh1VGV4dHVyZVNhbXBsZXIsIHZlYzIodHgsIHR5KSk7IFwiICtcclxuXHRcdFx0XHRcdFwiY29sb3IgKj0gdGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHRcIn0gXCIgKyBcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcImdsX0ZyYWdDb2xvciA9IGNvbG9yO1wiICsgXHJcblx0XHRcdFwifVwiXHJcblx0fSxcclxuXHRcclxuXHRcclxuXHRsYW1iZXJ0OiB7XHJcblx0XHR2ZXJ0ZXhTaGFkZXI6IFxyXG5cdFx0XHRzdHJ1Y3RzLkxpZ2h0ICtcclxuXHRcdFx0ICAgIFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzIgYVRleHR1cmVDb29yZDsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleFBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFwiYXR0cmlidXRlIGxvd3AgdmVjNCBhVmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMzIGFWZXJ0ZXhOb3JtYWw7IFwiICsgXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVNVk1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVQTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzQgdU1hdGVyaWFsQ29sb3I7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgbWF0NCB1TW9kZWxNYXRyaXg7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgbWF0MyB1Tm9ybWFsTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzMgdUFtYmllbnRMaWdodENvbG9yOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gTGlnaHQgdUxpZ2h0c1s4XTsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCBpbnQgdVVzZWRMaWdodHM7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVJlY2VpdmVTaGFkb3c7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVVzZUxpZ2h0aW5nOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZWZXJ0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIgKyAgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdkxpZ2h0V2VpZ2h0OyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZMaWdodFBvc2l0aW9uWzRdOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRmdW5jdGlvbnMuZ2V0TGlnaHRXZWlnaHQgKyBcclxuXHRcdFx0XHJcblx0XHRcdGZ1bmN0aW9ucy5zZXRMaWdodFBvc2l0aW9uICtcclxuXHRcdFx0XHJcblx0XHRcdFwidm9pZCBtYWluKHZvaWQpeyBcIiArIFxyXG5cdFx0XHRcdFwidmVjNCBtb2RlbFZpZXdQb3NpdGlvbiA9IHVNVk1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApOyBcIiArXHJcblx0XHRcdFx0XCJnbF9Qb3NpdGlvbiA9IHVQTWF0cml4ICogbW9kZWxWaWV3UG9zaXRpb247IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFx0XCJ2TGlnaHRXZWlnaHQgPSB1QW1iaWVudExpZ2h0Q29sb3I7IFwiICtcclxuXHRcdFx0XHRcImlmICh1VXNlTGlnaHRpbmcpeyBcIiArXHJcblx0XHRcdFx0XHRcInZlYzMgdmVydGV4TW9kZWxQb3NpdGlvbiA9ICh1TW9kZWxNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHl6OyBcIiArXHJcblx0XHRcdFx0XHRcImxvd3AgaW50IHNoYWRvd0luZGV4ID0gMDsgXCIgK1xyXG5cdFx0XHRcdFx0XCJmb3IgKGludCBpPTA7aTw4O2krKyl7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJpZiAoaSA+PSB1VXNlZExpZ2h0cyl7XCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwiYnJlYWs7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJ9XCIgK1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XCJMaWdodCBsID0gdUxpZ2h0c1tpXTsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjMyBsUG9zID0gbC5wb3NpdGlvbiAtIHZlcnRleE1vZGVsUG9zaXRpb247XCIgK1xyXG5cdFx0XHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgbERpc3RhbmNlID0gbGVuZ3RoKGxQb3MpIC8gMi4wOyBcIiArXHJcblx0XHRcdFx0XHRcdFwiaWYgKGxlbmd0aChsLnBvc2l0aW9uKSA9PSAwLjApeyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJsRGlzdGFuY2UgPSAxLjA7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcImxQb3MgPSB2ZWMzKDAuMCk7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGxpZ2h0RGlyZWN0aW9uID0gbC5kaXJlY3Rpb24gKyBub3JtYWxpemUobFBvcyk7IFwiICtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFwibG93cCBmbG9hdCBzcG90V2VpZ2h0ID0gMS4wOyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgIFwiaWYgKGxlbmd0aChsLnNwb3REaXJlY3Rpb24pICE9IDAuMCl7IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgICAgIFwibG93cCBmbG9hdCBjb3NBbmdsZSA9IGRvdChsLnNwb3REaXJlY3Rpb24sIGxpZ2h0RGlyZWN0aW9uKTsgXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICBcdFwic3BvdFdlaWdodCA9IGNsYW1wKChjb3NBbmdsZSAtIGwub3V0ZXJBbmdsZSkgLyAobC5pbm5lckFuZ2xlIC0gbC5vdXRlckFuZ2xlKSwgMC4wLCAxLjApOyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgICAgICBcImxEaXN0YW5jZSA9IDEuMDsgXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICBcIn0gXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICBcclxuXHRcdFx0XHRcdFx0XCJ2TGlnaHRXZWlnaHQgKz0gZ2V0TGlnaHRXZWlnaHQoYVZlcnRleE5vcm1hbCwgbGlnaHREaXJlY3Rpb24sIGwuY29sb3IsIGwuaW50ZW5zaXR5KSAqIHNwb3RXZWlnaHQgLyBsRGlzdGFuY2U7IFwiICsgXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcImlmIChsLmNhc3RTaGFkb3cgJiYgdVJlY2VpdmVTaGFkb3cpeyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzQgbGlnaHRQcm9qID0gbC5tdlByb2plY3Rpb24gKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwic2V0TGlnaHRQb3NpdGlvbihzaGFkb3dJbmRleCsrLCBsaWdodFByb2opOyBcIiArXHJcblx0XHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0IFxyXG5cdFx0XHRcdFwidlZlcnRleENvbG9yID0gYVZlcnRleENvbG9yICogdU1hdGVyaWFsQ29sb3I7IFwiICtcclxuXHRcdFx0XHRcInZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkOyBcIiArICBcclxuXHRcdFx0XCJ9IFwiICxcclxuXHRcdFx0XHJcblx0XHRmcmFnbWVudFNoYWRlcjpcclxuXHRcdFx0c3RydWN0cy5MaWdodCArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gYm9vbCB1VXNlTGlnaHRpbmc7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVJlY2VpdmVTaGFkb3c7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgaW50IHVVc2VkTGlnaHRzOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBMaWdodCB1TGlnaHRzWzhdOyBcIiArXHJcblx0XHQgICAgXCJ1bmlmb3JtIHNhbXBsZXIyRCB1U2hhZG93TWFwc1s4XTsgXCIgK1xyXG5cdFx0ICAgICBcclxuXHRcdFx0XCJ1bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZVNhbXBsZXI7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdUhhc1RleHR1cmU7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgZmxvYXQgdU9wYWNpdHk7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMiB1VGV4dHVyZVJlcGVhdDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMyIHVUZXh0dXJlT2Zmc2V0OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzQgdUdlb21ldHJ5VVY7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdkxpZ2h0V2VpZ2h0OyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZMaWdodFBvc2l0aW9uWzRdOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRmdW5jdGlvbnMuY2FsY1NoYWRvd0ZhY3RvciArIFxyXG5cdFx0XHRmdW5jdGlvbnMuZ2V0TGlnaHRQb3NpdGlvbiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWM0IGNvbG9yID0gdlZlcnRleENvbG9yOyBcIiArIFxyXG5cdFx0XHRcdFwiaWYgKHVIYXNUZXh0dXJlKXsgXCIgKyBcclxuXHRcdFx0XHRcdFwibWVkaXVtcCBmbG9hdCB0eCA9IHVHZW9tZXRyeVVWLnggKyBtb2QodVRleHR1cmVPZmZzZXQueCArIHZUZXh0dXJlQ29vcmQucyAqIHVUZXh0dXJlUmVwZWF0LnggLSB1R2VvbWV0cnlVVi54LCB1R2VvbWV0cnlVVi56IC0gdUdlb21ldHJ5VVYueCk7XCIgK1xyXG5cdFx0XHRcdFx0XCJtZWRpdW1wIGZsb2F0IHR5ID0gdUdlb21ldHJ5VVYueSArIG1vZCh1VGV4dHVyZU9mZnNldC55ICsgdlRleHR1cmVDb29yZC50ICogdVRleHR1cmVSZXBlYXQueSAtIHVHZW9tZXRyeVVWLnksIHVHZW9tZXRyeVVWLncgLSB1R2VvbWV0cnlVVi55KTtcIiArXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFwibWVkaXVtcCB2ZWM0IHRleENvbG9yID0gdGV4dHVyZTJEKHVUZXh0dXJlU2FtcGxlciwgdmVjMih0eCwgdHkpKTsgXCIgK1xyXG5cdFx0XHRcdFx0XCJjb2xvciAqPSB0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwifSBcIiArIFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGxpZ2h0V2VpZ2h0ID0gdkxpZ2h0V2VpZ2h0OyBcIiArXHJcblx0XHRcdFx0XCJpZiAodVVzZUxpZ2h0aW5nKXsgXCIgK1xyXG5cdFx0XHRcdFx0XCJsb3dwIGludCBzaGFkb3dJbmRleCA9IDA7IFwiICtcclxuXHRcdFx0XHRcdFwiZm9yIChpbnQgaT0wO2k8ODtpKyspeyBcIiArXHJcblx0XHRcdFx0XHRcdFwiaWYgKGkgPj0gdVVzZWRMaWdodHMpe1wiICtcclxuXHRcdFx0XHRcdFx0XHRcImJyZWFrOyBcIiArXHJcblx0XHRcdFx0XHRcdFwifVwiICtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFwibG93cCBmbG9hdCBzaGFkb3dXZWlnaHQgPSAxLjA7IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgXCJpZiAodUxpZ2h0c1tpXS5jYXN0U2hhZG93KVwiICtcclxuXHRcdFx0ICAgICAgICAgICAgXHRcInNoYWRvd1dlaWdodCA9IGNhbGNTaGFkb3dGYWN0b3IodVNoYWRvd01hcHNbaV0sIGdldExpZ2h0UG9zaXRpb24oc2hhZG93SW5kZXgrKykpOyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgIFwibGlnaHRXZWlnaHQgKj0gc2hhZG93V2VpZ2h0OyBcIiArXHJcblx0XHRcdFx0XHRcIn0gXCIgKyBcclxuXHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwiY29sb3IucmdiICo9IGxpZ2h0V2VpZ2h0OyBcIiArIFxyXG5cdFx0XHRcdFwiZ2xfRnJhZ0NvbG9yID0gdmVjNChjb2xvci5yZ2IsIGNvbG9yLmEgKiB1T3BhY2l0eSk7IFwiICsgXHJcblx0XHRcdFwifVwiXHJcblx0fSxcclxuXHRcclxuXHRcclxuXHRwaG9uZzoge1xyXG5cdFx0dmVydGV4U2hhZGVyOlxyXG5cdFx0XHRzdHJ1Y3RzLkxpZ2h0ICsgXHJcblx0XHRcdCBcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMyIGFUZXh0dXJlQ29vcmQ7IFwiICtcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBsb3dwIHZlYzQgYVZlcnRleENvbG9yOyBcIiArXHJcblx0XHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjMyBhVmVydGV4Tm9ybWFsOyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgbWF0NCB1TVZNYXRyaXg7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgbWF0NCB1UE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVNb2RlbE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQzIHVOb3JtYWxNYXRyaXg7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjNCB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMzIHVBbWJpZW50TGlnaHRDb2xvcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVVzZUxpZ2h0aW5nOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVSZWNlaXZlU2hhZG93OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIGludCB1VXNlZExpZ2h0czsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gTGlnaHQgdUxpZ2h0c1s4XTsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMiB2VGV4dHVyZUNvb3JkO1wiICsgIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMzIHZMaWdodFdlaWdodDsgXCIgK1xyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMzIHZOb3JtYWw7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdlBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdkxpZ2h0UG9zaXRpb25bNF07IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdGZ1bmN0aW9ucy5zZXRMaWdodFBvc2l0aW9uICtcclxuXHRcdFx0XHJcblx0XHRcdFwidm9pZCBtYWluKHZvaWQpeyBcIiArIFxyXG5cdFx0XHRcdFwidmVjNCBtb2RlbFZpZXdQb3NpdGlvbiA9IHVNVk1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApOyBcIiArXHJcblx0XHRcdFx0XCJnbF9Qb3NpdGlvbiA9IHVQTWF0cml4ICogbW9kZWxWaWV3UG9zaXRpb247IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFx0XCJpZiAodVVzZUxpZ2h0aW5nKXsgXCIgKyBcclxuXHRcdFx0XHRcdFwidk5vcm1hbCA9IHVOb3JtYWxNYXRyaXggKiBhVmVydGV4Tm9ybWFsOyBcIiArXHJcblx0XHRcdFx0XHRcInZMaWdodFdlaWdodCA9IHVBbWJpZW50TGlnaHRDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcImludCBzaGFkb3dJbmRleCA9IDA7IFwiICtcclxuXHRcdFx0XHRcdFwiZm9yIChpbnQgaT0wO2k8ODtpKyspeyBcIiArXHJcblx0XHRcdFx0XHRcdFwiaWYgKGkgPj0gdVVzZWRMaWdodHMpIGJyZWFrOyBcIiArXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcImlmICh1TGlnaHRzW2ldLmNhc3RTaGFkb3cgJiYgdVJlY2VpdmVTaGFkb3cpeyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzQgbGlnaHRQcm9qID0gdUxpZ2h0c1tpXS5tdlByb2plY3Rpb24gKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwic2V0TGlnaHRQb3NpdGlvbihzaGFkb3dJbmRleCsrLCBsaWdodFByb2opOyBcIiArXHJcblx0XHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdFwifWVsc2V7IFwiICtcclxuXHRcdFx0XHRcdFwidkxpZ2h0V2VpZ2h0ID0gdmVjMygxLjApOyBcIiArIFxyXG5cdFx0XHRcdFwifVwiICsgICBcclxuXHRcdFx0XHQgXHJcblx0XHRcdFx0XCJ2UG9zaXRpb24gPSAodU1vZGVsTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5ejsgXCIgK1xyXG5cdFx0XHRcdFwidlZlcnRleENvbG9yID0gYVZlcnRleENvbG9yICogdU1hdGVyaWFsQ29sb3I7IFwiICtcclxuXHRcdFx0XHRcInZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkOyBcIiArICBcclxuXHRcdFx0XCJ9IFwiICxcclxuXHRcdFx0XHJcblx0XHRmcmFnbWVudFNoYWRlcjogXHJcblx0XHRcdHN0cnVjdHMuTGlnaHQgKyBcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVVc2VMaWdodGluZzsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gYm9vbCB1UmVjZWl2ZVNoYWRvdzsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCBpbnQgdVVzZWRMaWdodHM7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIExpZ2h0IHVMaWdodHNbOF07IFwiICtcclxuXHRcdCAgICBcInVuaWZvcm0gc2FtcGxlcjJEIHVTaGFkb3dNYXBzWzhdOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gYm9vbCB1SGFzVGV4dHVyZTsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gc2FtcGxlcjJEIHVUZXh0dXJlU2FtcGxlcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVVzZVNwZWN1bGFyTWFwOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBzYW1wbGVyMkQgdVNwZWN1bGFyTWFwU2FtcGxlcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgZmxvYXQgdU9wYWNpdHk7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMiB1VGV4dHVyZVJlcGVhdDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMyIHVUZXh0dXJlT2Zmc2V0OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzMgdVNwZWN1bGFyQ29sb3I7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgZmxvYXQgdVNoaW5pbmVzczsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCB2ZWM0IHVHZW9tZXRyeVVWOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCB2ZWMzIHVDYW1lcmFQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMiB2VGV4dHVyZUNvb3JkOyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZWZXJ0ZXhDb2xvcjsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMyB2TGlnaHRXZWlnaHQ7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdk5vcm1hbDsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMyB2UG9zaXRpb247IFwiICtcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2TGlnaHRQb3NpdGlvbls0XTsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0ZnVuY3Rpb25zLmdldExpZ2h0V2VpZ2h0ICsgXHJcblx0XHRcdGZ1bmN0aW9ucy5jYWxjU2hhZG93RmFjdG9yICsgXHJcblx0XHRcdGZ1bmN0aW9ucy5nZXRMaWdodFBvc2l0aW9uICtcclxuXHRcdFx0XHJcblx0XHRcdFwidm9pZCBtYWluKHZvaWQpeyBcIiArXHJcblx0XHRcdFx0XCJtZWRpdW1wIHZlYzQgY29sb3IgPSB2VmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjMyBub3JtYWwgPSBub3JtYWxpemUodk5vcm1hbCk7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjMyBjYW1lcmFEaXJlY3Rpb24gPSBub3JtYWxpemUodUNhbWVyYVBvc2l0aW9uKTsgXCIgK1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwibWVkaXVtcCBmbG9hdCB0eDsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCBmbG9hdCB0eTsgXCIgK1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwiaWYgKHVIYXNUZXh0dXJlKXsgXCIgKyBcclxuXHRcdFx0XHRcdFwidHggPSB1R2VvbWV0cnlVVi54ICsgbW9kKHVUZXh0dXJlT2Zmc2V0LnggKyB2VGV4dHVyZUNvb3JkLnMgKiB1VGV4dHVyZVJlcGVhdC54IC0gdUdlb21ldHJ5VVYueCwgdUdlb21ldHJ5VVYueiAtIHVHZW9tZXRyeVVWLngpO1wiICtcclxuXHRcdFx0XHRcdFwidHkgPSB1R2VvbWV0cnlVVi55ICsgbW9kKHVUZXh0dXJlT2Zmc2V0LnkgKyB2VGV4dHVyZUNvb3JkLnQgKiB1VGV4dHVyZVJlcGVhdC55IC0gdUdlb21ldHJ5VVYueSwgdUdlb21ldHJ5VVYudyAtIHVHZW9tZXRyeVVWLnkpO1wiICtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzQgdGV4Q29sb3IgPSB0ZXh0dXJlMkQodVRleHR1cmVTYW1wbGVyLCB2ZWMyKHR4LCB0eSkpOyBcIiArXHJcblx0XHRcdFx0XHRcImNvbG9yICo9IHRleENvbG9yOyBcIiArXHJcblx0XHRcdFx0XCJ9IFwiICsgXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgcGhvbmdMaWdodFdlaWdodCA9IHZlYzMoMC4wKTsgXCIgKyBcclxuXHRcdFx0XHRcImlmICh1VXNlTGlnaHRpbmcpeyBcIiArXHJcblx0XHRcdFx0XHRcImludCBzaGFkb3dJbmRleCA9IDA7IFwiICtcclxuXHRcdFx0XHRcdFwiZm9yIChpbnQgaT0wO2k8ODtpKyspeyBcIiArXHJcblx0XHRcdFx0XHRcdFwiaWYgKGkgPj0gdVVzZWRMaWdodHMpIGJyZWFrOyBcIiArXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcIkxpZ2h0IGwgPSB1TGlnaHRzW2ldOyBcIiArXHJcblx0XHRcdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGxQb3MgPSBsLnBvc2l0aW9uIC0gdlBvc2l0aW9uO1wiICtcclxuXHRcdFx0XHRcdFx0XCJtZWRpdW1wIGZsb2F0IGxEaXN0YW5jZSA9IGxlbmd0aChsUG9zKSAvIDIuMDsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcImlmIChsZW5ndGgobC5wb3NpdGlvbikgPT0gMC4wKXsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwibERpc3RhbmNlID0gMS4wOyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJsUG9zID0gdmVjMygwLjApOyBcIiArXHJcblx0XHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjMyBsaWdodERpcmVjdGlvbiA9IGwuZGlyZWN0aW9uICsgbm9ybWFsaXplKGxQb3MpOyBcIiArXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcImxvd3AgZmxvYXQgc3BvdFdlaWdodCA9IDEuMDsgXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICBcImlmIChsZW5ndGgobC5zcG90RGlyZWN0aW9uKSAhPSAwLjApeyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgICAgICBcImxvd3AgZmxvYXQgY29zQW5nbGUgPSBkb3QobC5zcG90RGlyZWN0aW9uLCBsaWdodERpcmVjdGlvbik7IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgXHRcInNwb3RXZWlnaHQgPSBjbGFtcCgoY29zQW5nbGUgLSBsLm91dGVyQW5nbGUpIC8gKGwuaW5uZXJBbmdsZSAtIGwub3V0ZXJBbmdsZSksIDAuMCwgMS4wKTsgXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgXCJsRGlzdGFuY2UgPSAxLjA7IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgXCJ9IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgXHJcblx0XHRcdCAgICAgICAgICAgIFwibG93cCBmbG9hdCBzaGFkb3dXZWlnaHQgPSAxLjA7IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgXCJpZiAobC5jYXN0U2hhZG93KVwiICtcclxuXHRcdFx0ICAgICAgICAgICAgXHRcInNoYWRvd1dlaWdodCA9IGNhbGNTaGFkb3dGYWN0b3IodVNoYWRvd01hcHNbaV0sIGdldExpZ2h0UG9zaXRpb24oc2hhZG93SW5kZXgrKykpOyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgIFx0XHJcblx0XHRcdFx0XHRcdFwicGhvbmdMaWdodFdlaWdodCArPSBzaGFkb3dXZWlnaHQgKiBnZXRMaWdodFdlaWdodChub3JtYWwsIGxpZ2h0RGlyZWN0aW9uLCBsLmNvbG9yLCBsLmludGVuc2l0eSkgKiBzcG90V2VpZ2h0IC8gbERpc3RhbmNlOyBcIiArIFxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XCJpZiAoc2hhZG93V2VpZ2h0ID09IDEuMCl7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcImxvd3AgZmxvYXQgc2hpbmluZXNzID0gdVNoaW5pbmVzczsgXCIgKyBcclxuXHRcdFx0XHRcdFx0XHRcImlmICh1VXNlU3BlY3VsYXJNYXApeyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XHRcInNoaW5pbmVzcyA9IHRleHR1cmUyRCh1U3BlY3VsYXJNYXBTYW1wbGVyLCB2ZWMyKHR4LCB0eSkpLnIgKiAyNTUuMDsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0XCJpZiAoc2hpbmluZXNzID4gMC4wICYmIHNoaW5pbmVzcyA8IDI1NS4wKXsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgaGFsZkFuZ2xlID0gbm9ybWFsaXplKGNhbWVyYURpcmVjdGlvbiArIGxpZ2h0RGlyZWN0aW9uKTsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFx0XCJtZWRpdW1wIGZsb2F0IHNwZWNEb3QgPSBtYXgoZG90KGhhbGZBbmdsZSwgbm9ybWFsKSwgMC4wKTsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFx0XCJjb2xvciArPSB2ZWM0KHVTcGVjdWxhckNvbG9yLCAxLjApICogcG93KHNwZWNEb3QsIHNoaW5pbmVzcyk7IFwiICsgXHJcblx0XHRcdFx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHRcdFx0XCJ9XCIgKyBcclxuXHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcImNvbG9yLnJnYiAqPSB2TGlnaHRXZWlnaHQgKyBwaG9uZ0xpZ2h0V2VpZ2h0OyBcIiArIFxyXG5cdFx0XHRcdFwiZ2xfRnJhZ0NvbG9yID0gdmVjNChjb2xvci5yZ2IsIGNvbG9yLmEgKiB1T3BhY2l0eSk7IFwiICsgXHJcblx0XHRcdFwifVwiXHJcblx0fSxcclxuXHRcclxuXHRkZXB0aE1hcDoge1xyXG5cdFx0dmVydGV4U2hhZGVyOiBcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgbWF0NCB1TVZQTWF0cml4OyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgKyBcclxuXHRcdFx0XHRcImdsX1Bvc2l0aW9uID0gdU1WUE1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApOyBcIiArXHJcblx0XHRcdFwifSBcIiAsXHJcblx0XHRcdFxyXG5cdFx0ZnJhZ21lbnRTaGFkZXI6IFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgK1xyXG5cdFx0XHQgICAgXCJsb3dwIGZsb2F0IGRlcHRoID0gMS4wIC0gKDEuMCAtIGdsX0ZyYWdDb29yZC56KSAqIDI1LjA7IFwiICtcclxuXHRcdFx0ICAgIFwiZ2xfRnJhZ0NvbG9yID0gdmVjNChkZXB0aCwgZGVwdGgsIGRlcHRoLCAxLjApOyBcIiArXHJcblx0XHRcdFwifVwiXHJcblx0fVxyXG59OyIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vS1RVdGlscycpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcblxyXG5mdW5jdGlvbiBUZXh0dXJlKHNyYywgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3R0ZXh0dXJlID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0dGhpcy5taW5GaWx0ZXIgPSAocGFyYW1zLm1pbkZpbHRlcik/IHBhcmFtcy5taW5GaWx0ZXIgOiBnbC5MSU5FQVI7XHJcblx0dGhpcy5tYWdGaWx0ZXIgPSAocGFyYW1zLm1hZ0ZpbHRlcik/IHBhcmFtcy5tYWdGaWx0ZXIgOiBnbC5MSU5FQVI7XHJcblx0dGhpcy53cmFwUyA9IChwYXJhbXMuU1dyYXBwaW5nKT8gcGFyYW1zLlNXcmFwcGluZyA6IGdsLlJFUEVBVDtcclxuXHR0aGlzLndyYXBUID0gKHBhcmFtcy5UV3JhcHBpbmcpPyBwYXJhbXMuVFdyYXBwaW5nIDogZ2wuUkVQRUFUO1xyXG5cdHRoaXMucmVwZWF0ID0gKHBhcmFtcy5yZXBlYXQpPyBwYXJhbXMucmVwZWF0IDogbmV3IFZlY3RvcjIoMS4wLCAxLjApO1xyXG5cdHRoaXMub2Zmc2V0ID0gKHBhcmFtcy5vZmZzZXQpPyBwYXJhbXMub2Zmc2V0IDogbmV3IFZlY3RvcjIoMC4wLCAwLjApO1xyXG5cdHRoaXMuZ2VuZXJhdGVNaXBtYXAgPSAocGFyYW1zLmdlbmVyYXRlTWlwbWFwKT8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IG51bGw7XHJcblx0XHJcblx0dmFyIGltZyA9IEtULmdldEltYWdlKHNyYyk7XHJcblx0aWYgKGltZyl7XHJcblx0XHR0aGlzLmltYWdlID0gaW1nO1xyXG5cdFx0dGhpcy5wYXJzZVRleHR1cmUoKTtcclxuXHR9ZWxzZXtcclxuXHRcdHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdHRoaXMuaW1hZ2Uuc3JjID0gc3JjO1xyXG5cdFx0dGhpcy5pbWFnZS5yZWFkeSA9IGZhbHNlO1xyXG5cdFx0XHJcblx0XHR2YXIgVCA9IHRoaXM7XHJcblx0XHRVdGlscy5hZGRFdmVudCh0aGlzLmltYWdlLCBcImxvYWRcIiwgZnVuY3Rpb24oKXtcclxuXHRcdFx0S1QuaW1hZ2VzLnB1c2goe3NyYzogc3JjLCBpbWc6IFQuaW1hZ2V9KTtcclxuXHRcdFx0VC5wYXJzZVRleHR1cmUoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlO1xyXG5cclxuVGV4dHVyZS5wcm90b3R5cGUucGFyc2VUZXh0dXJlID0gZnVuY3Rpb24oKXtcclxuXHRpZiAodGhpcy5pbWFnZS5yZWFkeSkgcmV0dXJuO1xyXG5cdFxyXG5cdHRoaXMuaW1hZ2UucmVhZHkgPSB0cnVlO1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuXHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUpO1xyXG5cdFxyXG5cdGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19GTElQX1lfV0VCR0wsIHRydWUpO1xyXG5cdFxyXG5cdGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgdGhpcy5pbWFnZSk7XHJcblx0XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIHRoaXMubWFnRmlsdGVyKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgdGhpcy5taW5GaWx0ZXIpO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIHRoaXMud3JhcFMpO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIHRoaXMud3JhcFQpO1xyXG5cdFxyXG5cdGlmICh0aGlzLmdlbmVyYXRlTWlwbWFwKVxyXG5cdFx0Z2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XHJcblx0XHJcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XHJcbn07XHJcblxyXG5UZXh0dXJlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIG5ldyBUZXh0dXJlKHRoaXMuaW1hZ2Uuc3JjLCB0aGlzLnBhcmFtcyk7XHJcbn07XHJcbiIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBWZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxuXHJcbmZ1bmN0aW9uIFRleHR1cmVGcmFtZWJ1ZmZlcih3aWR0aCwgaGVpZ2h0LCBwYXJhbXMpe1xyXG5cdHRoaXMuX19rdHRleHR1cmVmcmFtZWJ1ZmZlciA9IHRydWU7XHJcblx0XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0XHJcblx0dGhpcy53aWR0aCA9IHdpZHRoO1xyXG5cdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHR0aGlzLm1pbkZpbHRlciA9IChwYXJhbXMubWluRmlsdGVyKT8gcGFyYW1zLm1pbkZpbHRlciA6IGdsLkxJTkVBUjtcclxuXHR0aGlzLm1hZ0ZpbHRlciA9IChwYXJhbXMubWFnRmlsdGVyKT8gcGFyYW1zLm1hZ0ZpbHRlciA6IGdsLkxJTkVBUjtcclxuXHR0aGlzLndyYXBTID0gKHBhcmFtcy5TV3JhcHBpbmcpPyBwYXJhbXMuU1dyYXBwaW5nIDogZ2wuQ0xBTVBfVE9fRURHRTtcclxuXHR0aGlzLndyYXBUID0gKHBhcmFtcy5UV3JhcHBpbmcpPyBwYXJhbXMuVFdyYXBwaW5nIDogZ2wuQ0xBTVBfVE9fRURHRTtcclxuXHR0aGlzLnJlcGVhdCA9IChwYXJhbXMucmVwZWF0KT8gcGFyYW1zLnJlcGVhdCA6IG5ldyBWZWN0b3IyKDEuMCwgMS4wKTtcclxuXHR0aGlzLm9mZnNldCA9IChwYXJhbXMub2Zmc2V0KT8gcGFyYW1zLm9mZnNldCA6IG5ldyBWZWN0b3IyKDAuMCwgMC4wKTtcclxuXHR0aGlzLmdlbmVyYXRlTWlwbWFwID0gKHBhcmFtcy5nZW5lcmF0ZU1pcG1hcCk/IHRydWUgOiBmYWxzZTtcclxuXHRcclxuXHR0aGlzLmZyYW1lYnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcclxuXHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIHRoaXMuZnJhbWVidWZmZXIpO1xyXG5cdHRoaXMuZnJhbWVidWZmZXIud2lkdGggPSB3aWR0aDtcclxuXHR0aGlzLmZyYW1lYnVmZmVyLmhlaWdodCA9IGhlaWdodDtcclxuXHRcclxuXHR0aGlzLnRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgdGhpcy5tYWdGaWx0ZXIpO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCB0aGlzLm1pbkZpbHRlcik7XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgdGhpcy53cmFwUyk7XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgdGhpcy53cmFwVCk7XHJcblx0XHJcblx0aWYgKHRoaXMuZ2VuZXJhdGVNaXBtYXApXHJcblx0XHRnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcclxuXHRcdFxyXG5cdGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgd2lkdGgsIGhlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgbnVsbCk7XHJcblx0XHJcblx0XHJcblx0dGhpcy5yZW5kZXJCdWZmZXIgPSBnbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcclxuXHRnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgdGhpcy5yZW5kZXJCdWZmZXIpO1xyXG5cdGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoZ2wuUkVOREVSQlVGRkVSLCBnbC5ERVBUSF9DT01QT05FTlQxNiwgd2lkdGgsIGhlaWdodCk7XHJcblx0XHJcblx0Z2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoZ2wuRlJBTUVCVUZGRVIsIGdsLkNPTE9SX0FUVEFDSE1FTlQwLCBnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUsIDApO1xyXG5cdGdsLmZyYW1lYnVmZmVyUmVuZGVyYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBnbC5ERVBUSF9BVFRBQ0hNRU5ULCBnbC5SRU5ERVJCVUZGRVIsIHRoaXMucmVuZGVyQnVmZmVyKTtcclxuXHRcclxuXHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xyXG5cdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xyXG5cdGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCBudWxsKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlRnJhbWVidWZmZXI7IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Z2V0OiBmdW5jdGlvbihlbGVtZW50KXtcclxuXHRcdGlmIChlbGVtZW50LmNoYXJBdCgwKSA9PSBcIiNcIil7XHJcblx0XHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50LnJlcGxhY2UoXCIjXCIsIFwiXCIpKTtcclxuXHRcdH1lbHNlIGlmIChlbGVtZW50LmNoYXJBdCgwKSA9PSBcIi5cIil7XHJcblx0XHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGVsZW1lbnQucmVwbGFjZShcIi5cIiwgXCJcIikpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShlbGVtZW50KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGFkZEV2ZW50OiBmdW5jdGlvbihlbGVtZW50LCB0eXBlLCBjYWxsYmFjayl7XHJcblx0XHRpZiAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKXtcclxuXHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBmYWxzZSk7XHJcblx0XHR9ZWxzZSBpZiAoZWxlbWVudC5hdHRhY2hFdmVudCl7XHJcblx0XHRcdGVsZW1lbnQuYXR0YWNoRXZlbnQoXCJvblwiICsgdHlwZSwgY2FsbGJhY2spO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Z2V0SHR0cDogZnVuY3Rpb24oKXtcclxuXHRcdGlmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3Qpe1xyXG5cdFx0XHRyZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHR9ZWxzZSBpZiAod2luZG93LkFjdGl2ZVhPYmplY3Qpe1xyXG5cdFx0XHRodHRwID0gbmV3IHdpbmRvdy5BY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTEhUVFBcIik7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH0sXHJcblx0XHJcblx0Z2V0RmlsZUNvbnRlbnQ6IGZ1bmN0aW9uKGZpbGVVUkwsIGNhbGxiYWNrKXtcclxuXHRcdHZhciBodHRwID0gdGhpcy5nZXRIdHRwKCk7XHJcblx0XHRodHRwLm9wZW4oJ0dFVCcsIGZpbGVVUkwsIHRydWUpO1xyXG5cdFx0aHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHQgIFx0XHRpZiAoaHR0cC5yZWFkeVN0YXRlID09IDQgJiYgaHR0cC5zdGF0dXMgPT0gMjAwKSB7XHJcblx0XHRcdFx0aWYgKGNhbGxiYWNrKXtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKGh0dHAucmVzcG9uc2VUZXh0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRodHRwLnNlbmQoKTtcclxuXHR9XHJcbn07XHJcbiIsImZ1bmN0aW9uIFZlY3RvcjIoeCwgeSl7XHJcblx0dGhpcy5fX2t0djIgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yMjtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkpO1xyXG5cdFxyXG5cdHJldHVybiBsZW5ndGg7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMueCAvPSBsZW5ndGg7XHJcblx0dGhpcy55IC89IGxlbmd0aDtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKHZlY3RvcjIpe1xyXG5cdGlmICghdmVjdG9yMi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgcGVyZm9ybSBhIGRvdCBwcm9kdWN0IHdpdGggYSB2ZWN0b3IyXCI7XHJcblx0XHJcblx0cmV0dXJuIHRoaXMueCAqIHZlY3RvcjIueCArIHRoaXMueSAqIHZlY3RvcjIueTtcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihudW1iZXIpe1xyXG5cdHRoaXMueCAqPSBudW1iZXI7XHJcblx0dGhpcy55ICo9IG51bWJlcjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHZlY3RvcjIpe1xyXG5cdGlmICghdmVjdG9yMi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgYWRkIGEgdmVjdG9yMiB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCArPSB2ZWN0b3IyLng7XHJcblx0dGhpcy55ICs9IHZlY3RvcjIueTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbih2ZWN0b3IyKXtcclxuXHRpZiAoIXZlY3RvcjIuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSB2ZWN0b3IyIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ID0gdmVjdG9yMi54O1xyXG5cdHRoaXMueSA9IHZlY3RvcjIueTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHkpe1xyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54LCB0aGlzLnkpO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24odmVjdG9yMil7XHJcblx0aWYgKCF2ZWN0b3IyLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgdmVjdG9yMiB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHJldHVybiAodGhpcy54ID09IHZlY3RvcjIueCAmJiB0aGlzLnkgPT0gdmVjdG9yMi55KTtcclxufTtcclxuXHJcblZlY3RvcjIudmVjdG9yc0RpZmZlcmVuY2UgPSBmdW5jdGlvbih2ZWN0b3IyX2EsIHZlY3RvcjJfYil7XHJcblx0aWYgKCF2ZWN0b3IyX2EuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMyXCI7XHJcblx0aWYgKCF2ZWN0b3IyX2IuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMyXCI7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IyKHZlY3RvcjJfYS54IC0gdmVjdG9yMl9iLngsIHZlY3RvcjJfYS55IC0gdmVjdG9yMl9iLnkpO1xyXG59O1xyXG5cclxuVmVjdG9yMi5mcm9tQW5nbGUgPSBmdW5jdGlvbihyYWRpYW4pe1xyXG5cdHZhciB4ID0gTWF0aC5jb3MocmFkaWFuKTtcclxuXHR2YXIgeSA9IC1NYXRoLnNpbihyYWRpYW4pO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMih4LCB5KTtcclxufTtcclxuIiwiZnVuY3Rpb24gVmVjdG9yMyh4LCB5LCB6KXtcclxuXHR0aGlzLl9fa3R2MyA9IHRydWU7XHJcblx0XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZlY3RvcjM7XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55ICsgdGhpcy56ICogdGhpcy56KTtcclxuXHRcclxuXHRyZXR1cm4gbGVuZ3RoO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGgoKTtcclxuXHRcclxuXHR0aGlzLnggLz0gbGVuZ3RoO1xyXG5cdHRoaXMueSAvPSBsZW5ndGg7XHJcblx0dGhpcy56IC89IGxlbmd0aDtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgcGVyZm9ybSBhIGRvdCBwcm9kdWN0IHdpdGggYSB2ZWN0b3IzXCI7XHJcblx0XHJcblx0cmV0dXJuIHRoaXMueCAqIHZlY3RvcjMueCArIHRoaXMueSAqIHZlY3RvcjMueSArIHRoaXMueiAqIHZlY3RvcjMuejtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBwZXJmb3JtIGEgY3Jvc3MgcHJvZHVjdCB3aXRoIGEgdmVjdG9yM1wiO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMyhcclxuXHRcdHRoaXMueSAqIHZlY3RvcjMueiAtIHRoaXMueiAqIHZlY3RvcjMueSxcclxuXHRcdHRoaXMueiAqIHZlY3RvcjMueCAtIHRoaXMueCAqIHZlY3RvcjMueixcclxuXHRcdHRoaXMueCAqIHZlY3RvcjMueSAtIHRoaXMueSAqIHZlY3RvcjMueFxyXG5cdCk7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24obnVtYmVyKXtcclxuXHR0aGlzLnggKj0gbnVtYmVyO1xyXG5cdHRoaXMueSAqPSBudW1iZXI7XHJcblx0dGhpcy56ICo9IG51bWJlcjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgYWRkIGEgVmVjdG9yMyB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCArPSB2ZWN0b3IzLng7XHJcblx0dGhpcy55ICs9IHZlY3RvcjMueTtcclxuXHR0aGlzLnogKz0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIFZlY3RvcjMgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHR0aGlzLnggPSB2ZWN0b3IzLng7XHJcblx0dGhpcy55ID0gdmVjdG9yMy55O1xyXG5cdHRoaXMueiA9IHZlY3RvcjMuejtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHksIHope1xyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxuXHR0aGlzLnogPSB6O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLngsIHRoaXMueSwgdGhpcy56KTtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIFZlY3RvcjMgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHRyZXR1cm4gKHRoaXMueCA9PSB2ZWN0b3IzLnggJiYgdGhpcy55ID09IHZlY3RvcjMueSAmJiB0aGlzLnogPT0gdmVjdG9yMy56KTtcclxufTtcclxuXHJcblZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UgPSBmdW5jdGlvbih2ZWN0b3IzX2EsIHZlY3RvcjNfYil7XHJcblx0aWYgKCF2ZWN0b3IzX2EuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMzXCI7XHJcblx0aWYgKCF2ZWN0b3IzX2IuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMzXCI7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IzKHZlY3RvcjNfYS54IC0gdmVjdG9yM19iLngsIHZlY3RvcjNfYS55IC0gdmVjdG9yM19iLnksIHZlY3RvcjNfYS56IC0gdmVjdG9yM19iLnopO1xyXG59O1xyXG5cclxuVmVjdG9yMy5mcm9tQW5nbGUgPSBmdW5jdGlvbihyYWRpYW5feHosIHJhZGlhbl95KXtcclxuXHR2YXIgeCA9IE1hdGguY29zKHJhZGlhbl94eik7XHJcblx0dmFyIHkgPSBNYXRoLnNpbihyYWRpYW5feSk7XHJcblx0dmFyIHogPSAtTWF0aC5zaW4ocmFkaWFuX3h6KTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjMoeCwgeSwgeik7XHJcbn07XHJcbiIsImZ1bmN0aW9uIFZlY3RvcjQoeCwgeSwgeiwgdyl7XHJcblx0dGhpcy5fX2t0djQgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxuXHR0aGlzLnogPSB6O1xyXG5cdHRoaXMudyA9IHc7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZlY3RvcjQ7XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55ICsgdGhpcy56ICogdGhpcy56ICsgdGhpcy53ICogdGhpcy53KTtcclxuXHRcclxuXHRyZXR1cm4gbGVuZ3RoO1xyXG59O1xyXG5cclxuVmVjdG9yNC5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGgoKTtcclxuXHRcclxuXHR0aGlzLnggLz0gbGVuZ3RoO1xyXG5cdHRoaXMueSAvPSBsZW5ndGg7XHJcblx0dGhpcy56IC89IGxlbmd0aDtcclxuXHR0aGlzLncgLz0gbGVuZ3RoO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yNC5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24odmVjdG9yNCl7XHJcblx0aWYgKCF2ZWN0b3I0Ll9fa3R2NCkgdGhyb3cgXCJDYW4gb25seSBwZXJmb3JtIGEgZG90IHByb2R1Y3Qgd2l0aCBhIHZlY3RvcjRcIjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcy54ICogdmVjdG9yNC54ICsgdGhpcy55ICogdmVjdG9yNC55ICsgdGhpcy56ICogdmVjdG9yNC56ICsgdGhpcy53ICogdmVjdG9yNC53O1xyXG59O1xyXG5cclxuVmVjdG9yNC5wcm90b3R5cGUuaW52ZXJ0ID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gdGhpcy5tdWx0aXBseSgtMSk7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uKG51bWJlcil7XHJcblx0dGhpcy54ICo9IG51bWJlcjtcclxuXHR0aGlzLnkgKj0gbnVtYmVyO1xyXG5cdHRoaXMueiAqPSBudW1iZXI7XHJcblx0dGhpcy53ICo9IG51bWJlcjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHZlY3RvcjQpe1xyXG5cdGlmICghdmVjdG9yNC5fX2t0djQpIHRocm93IFwiQ2FuIG9ubHkgYWRkIGEgdmVjdG9yNCB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCArPSB2ZWN0b3I0Lng7XHJcblx0dGhpcy55ICs9IHZlY3RvcjQueTtcclxuXHR0aGlzLnogKz0gdmVjdG9yNC56O1xyXG5cdHRoaXMudyArPSB2ZWN0b3I0Lnc7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24odmVjdG9yNCl7XHJcblx0aWYgKCF2ZWN0b3I0Ll9fa3R2NCkgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgdmVjdG9yNCB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCA9IHZlY3RvcjQueDtcclxuXHR0aGlzLnkgPSB2ZWN0b3I0Lnk7XHJcblx0dGhpcy56ID0gdmVjdG9yNC56O1xyXG5cdHRoaXMudyA9IHZlY3RvcjQudztcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHksIHosIHcpe1xyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxuXHR0aGlzLnogPSB6O1xyXG5cdHRoaXMudyA9IHc7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIG5ldyB2ZWN0b3I0KHRoaXMueCwgdGhpcy55LCB0aGlzLnosIHRoaXMudyk7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbih2ZWN0b3I0KXtcclxuXHRpZiAoIXZlY3RvcjQuX19rdHY0KSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSB2ZWN0b3I0IHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0cmV0dXJuICh0aGlzLnggPT0gdmVjdG9yNC54ICYmIHRoaXMueSA9PSB2ZWN0b3I0LnkgJiYgdGhpcy56ID09IHZlY3RvcjQueiAmJiB0aGlzLncgPT0gdmVjdG9yNC53KTtcclxufTtcclxuXHJcblZlY3RvcjQudmVjdG9yc0RpZmZlcmVuY2UgPSBmdW5jdGlvbih2ZWN0b3I0X2EsIHZlY3RvcjRfYil7XHJcblx0aWYgKCF2ZWN0b3I0X2EuX19rdHY0KSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnM0XCI7XHJcblx0aWYgKCF2ZWN0b3I0X2IuX19rdHY0KSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnM0XCI7XHJcblx0XHJcblx0cmV0dXJuIG5ldyB2ZWN0b3I0KHZlY3RvcjRfYS54IC0gdmVjdG9yNF9iLngsIHZlY3RvcjRfYS55IC0gdmVjdG9yNF9iLnksIHZlY3RvcjRfYS56IC0gdmVjdG9yNF9iLnosIHZlY3RwcjRfYS53IC0gdmVjdG9yNF9iLncpO1xyXG59OyIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbktULkNhbWVyYU9ydGhvID0gcmVxdWlyZSgnLi9LVENhbWVyYU9ydGhvJyk7XHJcbktULkNhbWVyYVBlcnNwZWN0aXZlID0gcmVxdWlyZSgnLi9LVENhbWVyYVBlcnNwZWN0aXZlJyk7XHJcbktULkNvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbktULkdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbktULkdlb21ldHJ5M0RNb2RlbCA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeTNETW9kZWwnKTtcclxuS1QuR2VvbWV0cnlCb3ggPSByZXF1aXJlKCcuL0tUR2VvbWV0cnlCb3gnKTtcclxuS1QuR2VvbWV0cnlDeWxpbmRlciA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeUN5bGluZGVyJyk7XHJcbktULkdlb21ldHJ5UGxhbmUgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnlQbGFuZScpO1xyXG5LVC5HZW9tZXRyeVNreWJveCA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeVNreWJveCcpO1xyXG5LVC5HZW9tZXRyeVNwaGVyZSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeVNwaGVyZScpO1xyXG5LVC5HZW9tZXRyeUdVSVRleHR1cmUgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnlHVUlUZXh0dXJlJyk7XHJcbktULkxpZ2h0RGlyZWN0aW9uYWwgPSByZXF1aXJlKCcuL0tUTGlnaHREaXJlY3Rpb25hbCcpO1xyXG5LVC5MaWdodFBvaW50ID0gcmVxdWlyZSgnLi9LVExpZ2h0UG9pbnQnKTtcclxuS1QuTGlnaHRTcG90ID0gcmVxdWlyZSgnLi9LVExpZ2h0U3BvdCcpO1xyXG5LVC5JbnB1dCA9IHJlcXVpcmUoJy4vS1RJbnB1dCcpO1xyXG5LVC5NYXRlcmlhbCA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbCcpO1xyXG5LVC5NYXRlcmlhbEJhc2ljID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsQmFzaWMnKTtcclxuS1QuTWF0ZXJpYWxMYW1iZXJ0ID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsTGFtYmVydCcpO1xyXG5LVC5NYXRlcmlhbFBob25nID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsUGhvbmcnKTtcclxuS1QuTWF0aCA9IHJlcXVpcmUoJy4vS1RNYXRoJyk7XHJcbktULk1hdHJpeDMgPSByZXF1aXJlKCcuL0tUTWF0cml4MycpO1xyXG5LVC5NYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxuS1QuTWVzaCA9IHJlcXVpcmUoJy4vS1RNZXNoJyk7XHJcbktULk1lc2hTcHJpdGUgPSByZXF1aXJlKCcuL0tUTWVzaFNwcml0ZScpO1xyXG5LVC5PcmJpdEFuZFBhbiA9IHJlcXVpcmUoJy4vS1RPcmJpdEFuZFBhbicpO1xyXG5LVC5UZXh0dXJlID0gcmVxdWlyZSgnLi9LVFRleHR1cmUnKTtcclxuS1QuVGV4dHVyZUZyYW1lYnVmZmVyID0gcmVxdWlyZSgnLi9LVFRleHR1cmVGcmFtZWJ1ZmZlcicpO1xyXG5LVC5VdGlscyA9IHJlcXVpcmUoJy4vS1RVdGlscycpO1xyXG5LVC5WZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxuS1QuVmVjdG9yMyA9IHJlcXVpcmUoJy4vS1RWZWN0b3IzJyk7XHJcbktULlZlY3RvcjQgPSByZXF1aXJlKCcuL0tUVmVjdG9yNCcpO1xyXG5LVC5TY2VuZSA9IHJlcXVpcmUoJy4vS1RTY2VuZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLVDsiLCJ3aW5kb3cuS1QgPSByZXF1aXJlKCcuL0tyYW1UZWNoJyk7Il19
