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
}

module.exports = LightSpot;

LightSpot.prototype.setCastShadow = function(castShadow, resolution){
	this.castShadow = castShadow;
	
	if (castShadow){
		var rel = KT.canvas.width / KT.canvas.height;
		this.shadowCam = new KT.CameraPerspective(KT.Math.degToRad(90.0), rel, 0.1, this.distance);
		this.shadowCam.position = this.position;
		this.shadowCam.lookAt(this.target);
		
		if (!resolution) resolution = new Vector2(512.0, 512.0);
		
		var w = (resolution.x > resolution.y)? resolution.x : resolution.y;
		w = Math.ceil(w / 512.0) * 512.0;
		
		this.shadowBuffer = new TextureFramebuffer(w, w);
	}else{
		this.shadowCam = null;
		this.shadowBuffer = null;
	}
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
		
		this.lightNDCMat = new Matrix4(
			0.5, 0.0, 0.0, 0.5,
			0.0, 0.5, 0.0, 0.5,
			0.0, 0.0, 0.5, 0.5,
			0.0, 0.0, 0.0, 1.0
		);
		
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
					if (uniformsNames.indexOf(name) == -1){
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
			if (light.__ktspotlight && light.castShadow){
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
		}else if (uni.type == 'shadowMaps'){
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
	
	if (shadowMapsUniform.length > 0){
		for (var i=0;i<lightsCount;i++){
			if (!lights[i].castShadow) continue;
			
			gl.activeTexture(gl.TEXTURE10 + i);
			gl.bindTexture(gl.TEXTURE_2D, lights[i].shadowBuffer.texture);
			gl.uniform1i(uni.location, 10 + i);
		}
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
	    "mediump float z = 1.0 - (1.0 - (projCoords.z)) * 25.0; " +
	    "mediump vec4 texCoord = texture2D(shadowMap, UVCoords); " +
	    "mediump float depth = texCoord.x; " +
	    "if (depth < (z - 0.005)) " +
	        "return 0.5; " + 
	    "return 1.0; " +
	"} "
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
			structs.Light + 
			 
			"attribute mediump vec2 aTextureCoord; " +
			"attribute mediump vec3 aVertexPosition; " +
			"attribute lowp vec4 aVertexColor; " +
			
			"attribute mediump vec3 aVertexNormal; " + 
			
			
			"uniform Light lights[8]; " +
			"uniform lowp int usedLights; " +
			
			"uniform mediump mat4 uMVMatrix; " +
			"uniform mediump mat4 uPMatrix; " +
			"uniform lowp vec4 uMaterialColor; " +
			
			"uniform bool uUseLighting; " +
			"uniform bool uReceiveShadow; " +
			"uniform mediump mat4 uModelMatrix; " +
			"uniform mediump mat3 uNormalMatrix; " +
			
			"uniform lowp vec3 uAmbientLightColor; " +
			
			"varying mediump vec4 vVertexColor; " +
			"varying mediump vec2 vTextureCoord;" +  
			"varying mediump vec3 vLightWeight; " +
			"varying mediump vec3 vNormal; " + 
			"varying mediump vec3 vPosition; " +
			"varying mediump vec4 vLightPosition; " +
			
			"void main(void){ " + 
				"vec4 modelViewPosition = uMVMatrix * vec4(aVertexPosition, 1.0); " +
				"gl_Position = uPMatrix * modelViewPosition; " +
			
				"if (uUseLighting){ " + 
					"vNormal = uNormalMatrix * aVertexNormal; " +
					"vLightWeight = uAmbientLightColor; " +
					
					"for (int i=0;i<8;i++){ " +
						"if (i >= usedLights) break; " +
						
						"if (lights[i].castShadow && uReceiveShadow){ " +
							"mediump vec4 lightProj = lights[i].mvProjection * vec4(aVertexPosition, 1.0); " +
							"vLightPosition = lightProj; " +
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
			
			"uniform Light lights[8]; " +
		    "uniform sampler2D shadowMaps[4]; " +
			"uniform lowp int usedLights; " +
			
			"uniform bool uHasTexture; " +
			"uniform sampler2D uTextureSampler; " +
			
			"uniform bool uUseSpecularMap; " +
			"uniform sampler2D uSpecularMapSampler; " +
			
			"uniform bool uUseLighting; " +
			"uniform bool uReceiveShadow; " +
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
			"varying mediump vec4 vLightPosition; " +
			
			"mediump vec3 getLightWeight(mediump vec3 normal, mediump vec3 direction, lowp vec3 color, lowp float intensity){ " +
				"mediump float lightDot = max(dot(normal, direction), 0.0); " +
				"mediump vec3 lightWeight = (color * lightDot * intensity); " +
				"return lightWeight; " +
			"}" +
			
			functions.calcShadowFactor + 
			
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
			            
			            "lowp float shadowWeight = 1.0; " +
			            "if (l.castShadow)" +
			            	"shadowWeight = calcShadowFactor(shadowMaps[i], vLightPosition); " +
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiLi5cXHNyY1xcS1RDYW1lcmFPcnRoby5qcyIsIi4uXFxzcmNcXEtUQ2FtZXJhUGVyc3BlY3RpdmUuanMiLCIuLlxcc3JjXFxLVENvbG9yLmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeS5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnkzRE1vZGVsLmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeUJveC5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlDeWxpbmRlci5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlHVUlUZXh0dXJlLmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeVBsYW5lLmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeVNreWJveC5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlTcGhlcmUuanMiLCIuLlxcc3JjXFxLVElucHV0LmpzIiwiLi5cXHNyY1xcS1RMaWdodERpcmVjdGlvbmFsLmpzIiwiLi5cXHNyY1xcS1RMaWdodFBvaW50LmpzIiwiLi5cXHNyY1xcS1RMaWdodFNwb3QuanMiLCIuLlxcc3JjXFxLVE1haW4uanMiLCIuLlxcc3JjXFxLVE1hdGVyaWFsLmpzIiwiLi5cXHNyY1xcS1RNYXRlcmlhbEJhc2ljLmpzIiwiLi5cXHNyY1xcS1RNYXRlcmlhbExhbWJlcnQuanMiLCIuLlxcc3JjXFxLVE1hdGVyaWFsUGhvbmcuanMiLCIuLlxcc3JjXFxLVE1hdGguanMiLCIuLlxcc3JjXFxLVE1hdHJpeDMuanMiLCIuLlxcc3JjXFxLVE1hdHJpeDQuanMiLCIuLlxcc3JjXFxLVE1lc2guanMiLCIuLlxcc3JjXFxLVE1lc2hTcHJpdGUuanMiLCIuLlxcc3JjXFxLVE9yYml0QW5kUGFuLmpzIiwiLi5cXHNyY1xcS1RTY2VuZS5qcyIsIi4uXFxzcmNcXEtUU2hhZGVycy5qcyIsIi4uXFxzcmNcXEtUVGV4dHVyZS5qcyIsIi4uXFxzcmNcXEtUVGV4dHVyZUZyYW1lYnVmZmVyLmpzIiwiLi5cXHNyY1xcS1RVdGlscy5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yMi5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yMy5qcyIsIi4uXFxzcmNcXEtUVmVjdG9yNC5qcyIsIi4uXFxzcmNcXEtyYW1UZWNoLmpzIiwiLi5cXHNyY1xcV2luZG93RXhwb3J0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcbnZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgVmVjdG9yMyA9IHJlcXVpcmUoJy4vS1RWZWN0b3IzJyk7XHJcbnZhciBLVE1hdGggPSByZXF1aXJlKCcuL0tUTWF0aCcpO1xyXG5cclxuZnVuY3Rpb24gQ2FtZXJhT3J0aG8od2lkdGgsIGhlaWdodCwgem5lYXIsIHpmYXIpe1xyXG5cdHRoaXMuX19rdGNhbWVyYSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IG5ldyBWZWN0b3IzKDAuMCwgMC4wLCAwLjApO1xyXG5cdHRoaXMudXBWZWN0b3IgPSBuZXcgVmVjdG9yMygwLjAsIDEuMCwgMC4wKTtcclxuXHR0aGlzLmxvb2tBdChuZXcgVmVjdG9yMygwLjAsIDAuMCwgLTEuMCkpO1xyXG5cdHRoaXMubG9ja2VkID0gZmFsc2U7XHJcblx0XHJcblx0dGhpcy53aWR0aCA9IHdpZHRoO1xyXG5cdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdHRoaXMuem5lYXIgPSB6bmVhcjtcclxuXHR0aGlzLnpmYXIgPSB6ZmFyO1xyXG5cdFxyXG5cdHRoaXMuY29udHJvbHMgPSBudWxsO1xyXG5cdFxyXG5cdHRoaXMuc2V0T3J0aG8oKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYW1lcmFPcnRobztcclxuXHJcbkNhbWVyYU9ydGhvLnByb3RvdHlwZS5zZXRPcnRobyA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIEMgPSAyLjAgLyB0aGlzLndpZHRoO1xyXG5cdHZhciBSID0gMi4wIC8gdGhpcy5oZWlnaHQ7XHJcblx0dmFyIEEgPSAtMi4wIC8gKHRoaXMuemZhciAtIHRoaXMuem5lYXIpO1xyXG5cdHZhciBCID0gLSh0aGlzLnpmYXIgKyB0aGlzLnpuZWFyKSAvICh0aGlzLnpmYXIgLSB0aGlzLnpuZWFyKTtcclxuXHRcclxuXHR0aGlzLnBlcnNwZWN0aXZlTWF0cml4ID0gbmV3IE1hdHJpeDQoXHJcblx0XHRDLCAwLCAwLCAwLFxyXG5cdFx0MCwgUiwgMCwgMCxcclxuXHRcdDAsIDAsIEEsIEIsXHJcblx0XHQwLCAwLCAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbkNhbWVyYU9ydGhvLnByb3RvdHlwZS5sb29rQXQgPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IGxvb2sgdG8gYSB2ZWN0b3IzXCI7XHJcblx0XHJcblx0dmFyIGZvcndhcmQgPSBWZWN0b3IzLnZlY3RvcnNEaWZmZXJlbmNlKHRoaXMucG9zaXRpb24sIHZlY3RvcjMpLm5vcm1hbGl6ZSgpO1xyXG5cdHZhciBsZWZ0ID0gdGhpcy51cFZlY3Rvci5jcm9zcyhmb3J3YXJkKS5ub3JtYWxpemUoKTtcclxuXHR2YXIgdXAgPSBmb3J3YXJkLmNyb3NzKGxlZnQpLm5vcm1hbGl6ZSgpO1xyXG5cdFxyXG5cdHZhciB4ID0gLWxlZnQuZG90KHRoaXMucG9zaXRpb24pO1xyXG5cdHZhciB5ID0gLXVwLmRvdCh0aGlzLnBvc2l0aW9uKTtcclxuXHR2YXIgeiA9IC1mb3J3YXJkLmRvdCh0aGlzLnBvc2l0aW9uKTtcclxuXHRcclxuXHR0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbmV3IE1hdHJpeDQoXHJcblx0XHRsZWZ0LngsIGxlZnQueSwgbGVmdC56LCB4LFxyXG5cdFx0dXAueCwgdXAueSwgdXAueiwgeSxcclxuXHRcdGZvcndhcmQueCwgZm9yd2FyZC55LCBmb3J3YXJkLnosIHosXHJcblx0XHQwLCAwLCAwLCAxXHJcblx0KTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbkNhbWVyYU9ydGhvLnByb3RvdHlwZS5zZXRDb250cm9scyA9IGZ1bmN0aW9uKGNhbWVyYUNvbnRyb2xzKXtcclxuXHRpZiAoIWNhbWVyYUNvbnRyb2xzLl9fa3RDYW1DdHJscykgdGhyb3cgXCJJcyBub3QgYSB2YWxpZCBjYW1lcmEgY29udHJvbHMgb2JqZWN0XCI7XHJcblx0XHJcblx0dmFyIHpvb20gPSBWZWN0b3IzLnZlY3RvcnNEaWZmZXJlbmNlKHRoaXMucG9zaXRpb24sIGNhbWVyYUNvbnRyb2xzLnRhcmdldCkubGVuZ3RoKCk7XHJcblx0XHJcblx0dGhpcy5jb250cm9scyA9IGNhbWVyYUNvbnRyb2xzO1xyXG5cdFxyXG5cdGNhbWVyYUNvbnRyb2xzLmNhbWVyYSA9IHRoaXM7XHJcblx0Y2FtZXJhQ29udHJvbHMuem9vbSA9IHpvb207XHJcblx0Y2FtZXJhQ29udHJvbHMuYW5nbGUueCA9IEtUTWF0aC5nZXQyREFuZ2xlKGNhbWVyYUNvbnRyb2xzLnRhcmdldC54LCBjYW1lcmFDb250cm9scy50YXJnZXQueix0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueik7XHJcblx0Y2FtZXJhQ29udHJvbHMuYW5nbGUueSA9IEtUTWF0aC5nZXQyREFuZ2xlKDAsIHRoaXMucG9zaXRpb24ueSwgem9vbSwgY2FtZXJhQ29udHJvbHMudGFyZ2V0LnkpO1xyXG5cdFxyXG5cdGNhbWVyYUNvbnRyb2xzLnNldENhbWVyYVBvc2l0aW9uKCk7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbiIsInZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxudmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBWZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxudmFyIEtUTWF0aCA9IHJlcXVpcmUoJy4vS1RNYXRoJyk7XHJcbnZhciBHZW9tZXRyeVNreWJveCA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeVNreWJveCcpO1xyXG5cclxuZnVuY3Rpb24gQ2FtZXJhUGVyc3BlY3RpdmUoZm92LCByYXRpbywgem5lYXIsIHpmYXIpe1xyXG5cdHRoaXMuX19rdGNhbWVyYSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IG5ldyBWZWN0b3IzKDAuMCwgMC4wLCAwLjApO1xyXG5cdHRoaXMudXBWZWN0b3IgPSBuZXcgVmVjdG9yMygwLjAsIDEuMCwgMC4wKTtcclxuXHR0aGlzLmxvb2tBdChuZXcgVmVjdG9yMygwLjAsIDAuMCwgLTEuMCkpO1xyXG5cdHRoaXMubG9ja2VkID0gZmFsc2U7XHJcblx0XHJcblx0dGhpcy5mb3YgPSBmb3Y7XHJcblx0dGhpcy5yYXRpbyA9IHJhdGlvO1xyXG5cdHRoaXMuem5lYXIgPSB6bmVhcjtcclxuXHR0aGlzLnpmYXIgPSB6ZmFyO1xyXG5cdFxyXG5cdHRoaXMuY29udHJvbHMgPSBudWxsO1xyXG5cdFxyXG5cdHRoaXMuc2t5Ym94ID0gbnVsbDtcclxuXHRcclxuXHR0aGlzLnNldFBlcnNwZWN0aXZlKCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FtZXJhUGVyc3BlY3RpdmU7XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUuc2V0UGVyc3BlY3RpdmUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBDID0gMSAvIE1hdGgudGFuKHRoaXMuZm92IC8gMik7XHJcblx0dmFyIFIgPSBDICogdGhpcy5yYXRpbztcclxuXHR2YXIgQSA9ICh0aGlzLnpuZWFyICsgdGhpcy56ZmFyKSAvICh0aGlzLnpuZWFyIC0gdGhpcy56ZmFyKTtcclxuXHR2YXIgQiA9ICgyICogdGhpcy56bmVhciAqIHRoaXMuemZhcikgLyAodGhpcy56bmVhciAtIHRoaXMuemZhcik7XHJcblx0XHJcblx0dGhpcy5wZXJzcGVjdGl2ZU1hdHJpeCA9IG5ldyBNYXRyaXg0KFxyXG5cdFx0QywgMCwgMCwgIDAsXHJcblx0XHQwLCBSLCAwLCAgMCxcclxuXHRcdDAsIDAsIEEsICBCLFxyXG5cdFx0MCwgMCwgLTEsIDBcclxuXHQpO1xyXG59O1xyXG5cclxuQ2FtZXJhUGVyc3BlY3RpdmUucHJvdG90eXBlLnNldFNreWJveCA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIGxlbmd0aCwgdGV4dHVyZXMpe1xyXG5cdHRoaXMuc2t5Ym94ID0gbmV3IEdlb21ldHJ5U2t5Ym94KHdpZHRoLCBoZWlnaHQsIGxlbmd0aCwgdGhpcy5wb3NpdGlvbiwgdGV4dHVyZXMpO1xyXG59O1xyXG5cclxuQ2FtZXJhUGVyc3BlY3RpdmUucHJvdG90eXBlLmxvb2tBdCA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgbG9vayB0byBhIHZlY3RvcjNcIjtcclxuXHRcclxuXHR2YXIgZm9yd2FyZCA9IFZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UodGhpcy5wb3NpdGlvbiwgdmVjdG9yMykubm9ybWFsaXplKCk7XHJcblx0dmFyIGxlZnQgPSB0aGlzLnVwVmVjdG9yLmNyb3NzKGZvcndhcmQpLm5vcm1hbGl6ZSgpO1xyXG5cdHZhciB1cCA9IGZvcndhcmQuY3Jvc3MobGVmdCkubm9ybWFsaXplKCk7XHJcblx0XHJcblx0dmFyIHggPSAtbGVmdC5kb3QodGhpcy5wb3NpdGlvbik7XHJcblx0dmFyIHkgPSAtdXAuZG90KHRoaXMucG9zaXRpb24pO1xyXG5cdHZhciB6ID0gLWZvcndhcmQuZG90KHRoaXMucG9zaXRpb24pO1xyXG5cdFxyXG5cdHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBuZXcgTWF0cml4NChcclxuXHRcdGxlZnQueCwgbGVmdC55LCBsZWZ0LnosIHgsXHJcblx0XHR1cC54LCB1cC55LCB1cC56LCB5LFxyXG5cdFx0Zm9yd2FyZC54LCBmb3J3YXJkLnksIGZvcndhcmQueiwgeixcclxuXHRcdDAsIDAsIDAsIDFcclxuXHQpO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuQ2FtZXJhUGVyc3BlY3RpdmUucHJvdG90eXBlLnNldENvbnRyb2xzID0gZnVuY3Rpb24oY2FtZXJhQ29udHJvbHMpe1xyXG5cdGlmICghY2FtZXJhQ29udHJvbHMuX19rdENhbUN0cmxzKSB0aHJvdyBcIklzIG5vdCBhIHZhbGlkIGNhbWVyYSBjb250cm9scyBvYmplY3RcIjtcclxuXHRcclxuXHR2YXIgem9vbSA9IFZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UodGhpcy5wb3NpdGlvbiwgY2FtZXJhQ29udHJvbHMudGFyZ2V0KS5sZW5ndGgoKTtcclxuXHRcclxuXHR0aGlzLmNvbnRyb2xzID0gY2FtZXJhQ29udHJvbHM7XHJcblx0XHJcblx0Y2FtZXJhQ29udHJvbHMuY2FtZXJhID0gdGhpcztcclxuXHRjYW1lcmFDb250cm9scy56b29tID0gem9vbTtcclxuXHRjYW1lcmFDb250cm9scy5hbmdsZS54ID0gS1RNYXRoLmdldDJEQW5nbGUoY2FtZXJhQ29udHJvbHMudGFyZ2V0LngsIGNhbWVyYUNvbnRyb2xzLnRhcmdldC56LHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi56KTtcclxuXHRjYW1lcmFDb250cm9scy5hbmdsZS55ID0gS1RNYXRoLmdldDJEQW5nbGUoMCwgdGhpcy5wb3NpdGlvbi55LCB6b29tLCBjYW1lcmFDb250cm9scy50YXJnZXQueSk7XHJcblx0XHJcblx0Y2FtZXJhQ29udHJvbHMuc2V0Q2FtZXJhUG9zaXRpb24oKTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuIiwiZnVuY3Rpb24gQ29sb3IoaGV4Q29sb3Ipe1xyXG5cdHZhciBzdHIgPSBoZXhDb2xvci5zdWJzdHJpbmcoMSk7XHJcblx0XHJcblx0aWYgKHN0ci5sZW5ndGggPT0gNikgc3RyICs9IFwiRkZcIjtcclxuXHR2YXIgciA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMCwgMiksIDE2KTtcclxuXHR2YXIgZyA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMiwgNCksIDE2KTtcclxuXHR2YXIgYiA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoNCwgNiksIDE2KTtcclxuXHR2YXIgYSA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoNiwgOCksIDE2KTtcclxuXHRcclxuXHR0aGlzLmNvbG9yID0gW3IgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUsIGEgLyAyNTVdO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbG9yO1xyXG5cclxuQ29sb3IucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGhleENvbG9yKXtcclxuXHR2YXIgc3RyID0gaGV4Q29sb3Iuc3Vic3RyaW5nKDEpO1xyXG5cdFxyXG5cdGlmIChzdHIubGVuZ3RoID09IDYpIHN0ciArPSBcIkZGXCI7XHJcblx0dmFyIHIgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDAsIDIpLCAxNik7XHJcblx0dmFyIGcgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDIsIDQpLCAxNik7XHJcblx0dmFyIGIgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDQsIDYpLCAxNik7XHJcblx0dmFyIGEgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDYsIDgpLCAxNik7XHJcblx0XHJcblx0dGhpcy5jb2xvciA9IFtyIC8gMjU1LCBnIC8gMjU1LCBiIC8gMjU1LCBhIC8gMjU1XTtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5zZXRSR0IgPSBmdW5jdGlvbihyZWQsIGdyZWVuLCBibHVlKXtcclxuXHR0aGlzLnNldFJHQkEocmVkLCBncmVlbiwgYmx1ZSwgMjU1KTtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5zZXRSR0JBID0gZnVuY3Rpb24ocmVkLCBncmVlbiwgYmx1ZSwgYWxwaGEpe1xyXG5cdHRoaXMuY29sb3IgPSBbcmVkIC8gMjU1LCBncmVlbiAvIDI1NSwgYmx1ZSAvIDI1NSwgYWxwaGFdO1xyXG59O1xyXG5cclxuQ29sb3IucHJvdG90eXBlLmdldFJHQiA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGMgPSB0aGlzLmdldFJHQkEoKTtcclxuXHRcclxuXHRyZXR1cm4gW2NbMF0sIGNbMV0sIGNbMl1dO1xyXG59O1xyXG5cclxuQ29sb3IucHJvdG90eXBlLmdldFJHQkEgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiB0aGlzLmNvbG9yO1xyXG59O1xyXG5cclxuQ29sb3IucHJvdG90eXBlLmdldEhleCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGMgPSB0aGlzLmNvbG9yO1xyXG5cdFxyXG5cdHZhciByID0gKGNbMF0gKiAyNTUpLnRvU3RyaW5nKDE2KTtcclxuXHR2YXIgZyA9IChjWzFdICogMjU1KS50b1N0cmluZygxNik7XHJcblx0dmFyIGIgPSAoY1syXSAqIDI1NSkudG9TdHJpbmcoMTYpO1xyXG5cdHZhciBhID0gKGNbM10gKiAyNTUpLnRvU3RyaW5nKDE2KTtcclxuXHRcclxuXHRpZiAoci5sZW5ndGggPT0gMSkgciA9IFwiMFwiICsgcjtcclxuXHRpZiAoZy5sZW5ndGggPT0gMSkgZyA9IFwiMFwiICsgZztcclxuXHRpZiAoYi5sZW5ndGggPT0gMSkgYiA9IFwiMFwiICsgYjtcclxuXHRpZiAoYS5sZW5ndGggPT0gMSkgYSA9IFwiMFwiICsgYTtcclxuXHRcclxuXHRyZXR1cm4gKFwiI1wiICsgciArIGcgKyBiICsgYSkudG9VcHBlckNhc2UoKTtcclxufTtcclxuXHJcbkNvbG9yLl9CTEFDS1x0XHQ9IFwiIzAwMDAwMEZGXCI7XHJcbkNvbG9yLl9SRUQgXHRcdFx0PSBcIiNGRjAwMDBGRlwiO1xyXG5Db2xvci5fR1JFRU4gXHRcdD0gXCIjMDBGRjAwRkZcIjtcclxuQ29sb3IuX0JMVUUgXHRcdD0gXCIjMDAwMEZGRkZcIjtcclxuQ29sb3IuX1dISVRFXHRcdD0gXCIjRkZGRkZGRkZcIjtcclxuQ29sb3IuX1lFTExPV1x0XHQ9IFwiI0ZGRkYwMEZGXCI7XHJcbkNvbG9yLl9NQUdFTlRBXHRcdD0gXCIjRkYwMEZGRkZcIjtcclxuQ29sb3IuX0FRVUFcdFx0XHQ9IFwiIzAwRkZGRkZGXCI7XHJcbkNvbG9yLl9HT0xEXHRcdFx0PSBcIiNGRkQ3MDBGRlwiO1xyXG5Db2xvci5fR1JBWVx0XHRcdD0gXCIjODA4MDgwRkZcIjtcclxuQ29sb3IuX1BVUlBMRVx0XHQ9IFwiIzgwMDA4MEZGXCI7IiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxudmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxudmFyIFZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG52YXIgVmVjdG9yMyA9IHJlcXVpcmUoJy4vS1RWZWN0b3IzJyk7XHJcbnZhciBWZWN0b3I0ID0gcmVxdWlyZSgnLi9LVFZlY3RvcjQnKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5KCl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMudmVydGljZXMgPSBbXTtcclxuXHR0aGlzLnRyaWFuZ2xlcyA9IFtdO1xyXG5cdHRoaXMudXZDb29yZHMgPSBbXTtcclxuXHR0aGlzLmNvbG9ycyA9IFtdO1xyXG5cdHRoaXMubm9ybWFscyA9IFtdO1xyXG5cdHRoaXMudXZSZWdpb24gPSBuZXcgVmVjdG9yNCgwLjAsIDAuMCwgMS4wLCAxLjApO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5O1xyXG5cclxuR2VvbWV0cnkucHJvdG90eXBlLmFkZFZlcnRpY2UgPSBmdW5jdGlvbih4LCB5LCB6LCBjb2xvciwgdHgsIHR5KXtcclxuXHRpZiAoIWNvbG9yKSBjb2xvciA9IENvbG9yLl9XSElURTtcclxuXHRpZiAoIXR4KSB0eCA9IDA7XHJcblx0aWYgKCF0eSkgdHkgPSAwO1xyXG5cdFxyXG5cdHZhciBpbmQgPSB0aGlzLnZlcnRpY2VzLmxlbmd0aDtcclxuXHR0aGlzLnZlcnRpY2VzLnB1c2gobmV3IFZlY3RvcjMoeCwgeSwgeikpO1xyXG5cdHRoaXMuY29sb3JzLnB1c2gobmV3IENvbG9yKGNvbG9yKSk7XHJcblx0dGhpcy51dkNvb3Jkcy5wdXNoKG5ldyBWZWN0b3IyKHR4LCB0eSkpO1xyXG5cdFxyXG5cdHJldHVybiBpbmQ7XHJcbn07XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuYWRkRmFjZSA9IGZ1bmN0aW9uKHZlcnRpY2VfMCwgdmVydGljZV8xLCB2ZXJ0aWNlXzIpe1xyXG5cdGlmICghdGhpcy52ZXJ0aWNlc1t2ZXJ0aWNlXzBdKSB0aHJvdyBcIkludmFsaWQgdmVydGV4IGluZGV4OiBcIiArIHZlcnRpY2VfMDtcclxuXHRpZiAoIXRoaXMudmVydGljZXNbdmVydGljZV8xXSkgdGhyb3cgXCJJbnZhbGlkIHZlcnRleCBpbmRleDogXCIgKyB2ZXJ0aWNlXzE7XHJcblx0aWYgKCF0aGlzLnZlcnRpY2VzW3ZlcnRpY2VfMl0pIHRocm93IFwiSW52YWxpZCB2ZXJ0ZXggaW5kZXg6IFwiICsgdmVydGljZV8yO1xyXG5cdFxyXG5cdHRoaXMudHJpYW5nbGVzLnB1c2gobmV3IFZlY3RvcjModmVydGljZV8wLCB2ZXJ0aWNlXzEsIHZlcnRpY2VfMikpO1xyXG59O1xyXG5cclxuR2VvbWV0cnkucHJvdG90eXBlLmFkZE5vcm1hbCA9IGZ1bmN0aW9uKG54LCBueSwgbnope1xyXG5cdHRoaXMubm9ybWFscy5wdXNoKG5ldyBWZWN0b3IzKG54LCBueSwgbnopKTtcclxufTtcclxuXHJcbkdlb21ldHJ5LnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIHZlcnRpY2VzID0gW107XHJcblx0dmFyIHV2Q29vcmRzID0gW107XHJcblx0dmFyIHRyaWFuZ2xlcyA9IFtdO1xyXG5cdHZhciBjb2xvcnMgPSBbXTtcclxuXHR2YXIgbm9ybWFscyA9IFtdO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy52ZXJ0aWNlcy5sZW5ndGg7aTxsZW47aSsrKXsgXHJcblx0XHR2YXIgdiA9IHRoaXMudmVydGljZXNbaV07IFxyXG5cdFx0dmVydGljZXMucHVzaCh2LngsIHYueSwgdi56KTsgXHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy51dkNvb3Jkcy5sZW5ndGg7aTxsZW47aSsrKXsgXHJcblx0XHR2YXIgdiA9IHRoaXMudXZDb29yZHNbaV07IFxyXG5cdFx0dXZDb29yZHMucHVzaCh2LngsIHYueSk7IFxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMudHJpYW5nbGVzLmxlbmd0aDtpPGxlbjtpKyspeyBcclxuXHRcdHZhciB0ID0gdGhpcy50cmlhbmdsZXNbaV07IFxyXG5cdFx0dHJpYW5nbGVzLnB1c2godC54LCB0LnksIHQueik7IFxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMuY29sb3JzLmxlbmd0aDtpPGxlbjtpKyspeyBcclxuXHRcdHZhciBjID0gdGhpcy5jb2xvcnNbaV0uZ2V0UkdCQSgpOyBcclxuXHRcdFxyXG5cdFx0Y29sb3JzLnB1c2goY1swXSwgY1sxXSwgY1syXSwgY1szXSk7IFxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMubm9ybWFscy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBuID0gdGhpcy5ub3JtYWxzW2ldO1xyXG5cdFx0bm9ybWFscy5wdXNoKG4ueCwgbi55LCBuLnopO1xyXG5cdH1cclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IEtULmNyZWF0ZUFycmF5QnVmZmVyKFwiQVJSQVlfQlVGRkVSXCIsIG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpLCAzKTtcclxuXHR0aGlzLnRleEJ1ZmZlciA9IEtULmNyZWF0ZUFycmF5QnVmZmVyKFwiQVJSQVlfQlVGRkVSXCIsIG5ldyBGbG9hdDMyQXJyYXkodXZDb29yZHMpLCAyKTtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJFTEVNRU5UX0FSUkFZX0JVRkZFUlwiLCBuZXcgVWludDE2QXJyYXkodHJpYW5nbGVzKSwgMSk7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBLVC5jcmVhdGVBcnJheUJ1ZmZlcihcIkFSUkFZX0JVRkZFUlwiLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9ycyksIDQpO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IEtULmNyZWF0ZUFycmF5QnVmZmVyKFwiQVJSQVlfQlVGRkVSXCIsIG5ldyBGbG9hdDMyQXJyYXkobm9ybWFscyksIDMpO1xyXG5cdHRoaXMucmVhZHkgPSB0cnVlO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuR2VvbWV0cnkucHJvdG90eXBlLmNvbXB1dGVGYWNlc05vcm1hbHMgPSBmdW5jdGlvbigpe1xyXG5cdHRoaXMubm9ybWFscyA9IFtdO1xyXG5cdFxyXG5cdHZhciBub3JtYWxpemVkVmVydGljZXMgPSBbXTtcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMudHJpYW5nbGVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIGZhY2UgPSB0aGlzLnRyaWFuZ2xlc1tpXTtcclxuXHRcdHZhciB2MCA9IHRoaXMudmVydGljZXNbZmFjZS54XTtcclxuXHRcdHZhciB2MSA9IHRoaXMudmVydGljZXNbZmFjZS55XTtcclxuXHRcdHZhciB2MiA9IHRoaXMudmVydGljZXNbZmFjZS56XTtcclxuXHRcdFxyXG5cdFx0dmFyIGRpcjEgPSBWZWN0b3IzLnZlY3RvcnNEaWZmZXJlbmNlKHYxLCB2MCk7XHJcblx0XHR2YXIgZGlyMiA9IFZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UodjIsIHYwKTtcclxuXHRcdFxyXG5cdFx0dmFyIG5vcm1hbCA9IGRpcjEuY3Jvc3MoZGlyMikubm9ybWFsaXplKCk7XHJcblx0XHRcclxuXHRcdGlmIChub3JtYWxpemVkVmVydGljZXMuaW5kZXhPZihmYWNlLngpID09IC0xKSB0aGlzLm5vcm1hbHMucHVzaChub3JtYWwpO1xyXG5cdFx0aWYgKG5vcm1hbGl6ZWRWZXJ0aWNlcy5pbmRleE9mKGZhY2UueSkgPT0gLTEpIHRoaXMubm9ybWFscy5wdXNoKG5vcm1hbCk7XHJcblx0XHRpZiAobm9ybWFsaXplZFZlcnRpY2VzLmluZGV4T2YoZmFjZS56KSA9PSAtMSkgdGhpcy5ub3JtYWxzLnB1c2gobm9ybWFsKTtcclxuXHRcdFxyXG5cdFx0bm9ybWFsaXplZFZlcnRpY2VzLnB1c2goZmFjZS54LCBmYWNlLnksIGZhY2Uueik7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4iLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vS1RVdGlscycpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcbnZhciBWZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxudmFyIFZlY3RvcjQgPSByZXF1aXJlKCcuL0tUVmVjdG9yNCcpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnkzRE1vZGVsKGZpbGVVUkwpe1xyXG5cdHRoaXMuX19rdGdlb21ldHJ5ID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLmZpbGVVUkwgPSBmaWxlVVJMO1xyXG5cdHRoaXMucmVhZHkgPSBmYWxzZTtcclxuXHR0aGlzLnV2UmVnaW9uID0gbmV3IFZlY3RvcjQoMC4wLCAwLjAsIDEuMCwgMS4wKTtcclxuXHRcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0VXRpbHMuZ2V0RmlsZUNvbnRlbnQoZmlsZVVSTCwgZnVuY3Rpb24oZmlsZSl7XHJcblx0XHRULnJlYWR5ID0gdHJ1ZTtcclxuXHRcdFQucGFyc2VGaWxlKGZpbGUpO1xyXG5cdH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5M0RNb2RlbDtcclxuXHJcbkdlb21ldHJ5M0RNb2RlbC5wcm90b3R5cGUucGFyc2VGaWxlID0gZnVuY3Rpb24oZmlsZSl7XHJcblx0dmFyIGxpbmVzID0gZmlsZS5zcGxpdCgnXFxyXFxuJyk7XHJcblx0dmFyIHZlcnRleE1pbiA9IFtdO1xyXG5cdHZhciB1dkNvb3JkTWluID0gW107XHJcblx0dmFyIG5vcm1hbE1pbiA9IFtdO1xyXG5cdHZhciBpbmRNaW4gPSBbXTtcclxuXHR2YXIgZ2VvbWV0cnkgPSBuZXcgR2VvbWV0cnkoKTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPWxpbmVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIGwgPSBsaW5lc1tpXS50cmltKCk7XHJcblx0XHRsID0gbC5yZXBsYWNlKCcgICcsICcgJyk7XHJcblx0XHR2YXIgaW5kID0gbC5jaGFyQXQoMCk7XHJcblx0XHRcclxuXHRcdHZhciBwID0gbC5zcGxpdCgnICcpO1xyXG5cdFx0cC5zcGxpY2UoMCwxKTtcclxuXHRcdFxyXG5cdFx0aWYgKGluZCA9PSAnIycpIGNvbnRpbnVlO1xyXG5cdFx0ZWxzZSBpZiAoaW5kID09ICdnJykgY29udGludWU7XHJcblx0XHRlbHNlIGlmIChsID09ICcnKSBjb250aW51ZTtcclxuXHRcdFxyXG5cdFx0aWYgKGwuaW5kZXhPZigndiAnKSA9PSAwKXtcclxuXHRcdFx0dmVydGV4TWluLnB1c2goIG5ldyBWZWN0b3IzKFxyXG5cdFx0XHRcdHBhcnNlRmxvYXQocFswXSksXHJcblx0XHRcdFx0cGFyc2VGbG9hdChwWzFdKSxcclxuXHRcdFx0XHRwYXJzZUZsb2F0KHBbMl0pXHJcblx0XHRcdCkpO1xyXG5cdFx0fWVsc2UgaWYgKGwuaW5kZXhPZigndm4gJykgPT0gMCl7XHJcblx0XHRcdG5vcm1hbE1pbi5wdXNoKCBuZXcgVmVjdG9yMyhcclxuXHRcdFx0XHRwYXJzZUZsb2F0KHBbMF0pLFxyXG5cdFx0XHRcdHBhcnNlRmxvYXQocFsxXSksXHJcblx0XHRcdFx0cGFyc2VGbG9hdChwWzJdKVxyXG5cdFx0XHQpKTtcclxuXHRcdH1lbHNlIGlmIChsLmluZGV4T2YoJ3Z0ICcpID09IDApe1xyXG5cdFx0XHR1dkNvb3JkTWluLnB1c2goIG5ldyBWZWN0b3IyKFxyXG5cdFx0XHRcdHBhcnNlRmxvYXQocFswXSksXHJcblx0XHRcdFx0cGFyc2VGbG9hdChwWzFdKVxyXG5cdFx0XHQpKTtcclxuXHRcdH1lbHNlIGlmIChsLmluZGV4T2YoJ2YgJykgPT0gMCl7XHJcblx0XHRcdGluZE1pbi5wdXNoKCBuZXcgVmVjdG9yMyhcclxuXHRcdFx0XHRwWzBdLFxyXG5cdFx0XHRcdHBbMV0sXHJcblx0XHRcdFx0cFsyXVxyXG5cdFx0XHQpKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj1pbmRNaW4ubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgaW5kID0gaW5kTWluW2ldO1xyXG5cdFx0dmFyIHZlcnRleEluZm8xID0gaW5kLnguc3BsaXQoJy8nKTtcclxuXHRcdHZhciB2ZXJ0ZXhJbmZvMiA9IGluZC55LnNwbGl0KCcvJyk7XHJcblx0XHR2YXIgdmVydGV4SW5mbzMgPSBpbmQuei5zcGxpdCgnLycpO1xyXG5cdFx0XHJcblx0XHR2YXIgdjEgPSB2ZXJ0ZXhNaW5bcGFyc2VJbnQodmVydGV4SW5mbzFbMF0pIC0gMV07XHJcblx0XHR2YXIgdDEgPSB1dkNvb3JkTWluW3BhcnNlSW50KHZlcnRleEluZm8xWzFdKSAtIDFdO1xyXG5cdFx0dmFyIG4xID0gbm9ybWFsTWluW3BhcnNlSW50KHZlcnRleEluZm8xWzJdKSAtIDFdO1xyXG5cdFx0XHJcblx0XHR2YXIgdjIgPSB2ZXJ0ZXhNaW5bcGFyc2VJbnQodmVydGV4SW5mbzJbMF0pIC0gMV07XHJcblx0XHR2YXIgdDIgPSB1dkNvb3JkTWluW3BhcnNlSW50KHZlcnRleEluZm8yWzFdKSAtIDFdO1xyXG5cdFx0dmFyIG4yID0gbm9ybWFsTWluW3BhcnNlSW50KHZlcnRleEluZm8yWzJdKSAtIDFdO1xyXG5cdFx0XHJcblx0XHR2YXIgdjMgPSB2ZXJ0ZXhNaW5bcGFyc2VJbnQodmVydGV4SW5mbzNbMF0pIC0gMV07XHJcblx0XHR2YXIgdDMgPSB1dkNvb3JkTWluW3BhcnNlSW50KHZlcnRleEluZm8zWzFdKSAtIDFdO1xyXG5cdFx0dmFyIG4zID0gbm9ybWFsTWluW3BhcnNlSW50KHZlcnRleEluZm8zWzJdKSAtIDFdO1xyXG5cdFx0XHJcblx0XHR2YXIgaTEgPSBnZW9tZXRyeS5hZGRWZXJ0aWNlKHYxLngsIHYxLnksIHYxLnosIENvbG9yLl9XSElURSwgdDEueCwgdDEueSk7XHJcblx0XHR2YXIgaTIgPSBnZW9tZXRyeS5hZGRWZXJ0aWNlKHYyLngsIHYyLnksIHYyLnosIENvbG9yLl9XSElURSwgdDIueCwgdDIueSk7XHJcblx0XHR2YXIgaTMgPSBnZW9tZXRyeS5hZGRWZXJ0aWNlKHYzLngsIHYzLnksIHYzLnosIENvbG9yLl9XSElURSwgdDMueCwgdDMueSk7XHJcblx0XHRcclxuXHRcdGdlb21ldHJ5LmFkZE5vcm1hbChuMS54LCBuMS55LCBuMS56KTtcclxuXHRcdGdlb21ldHJ5LmFkZE5vcm1hbChuMi54LCBuMi55LCBuMi56KTtcclxuXHRcdGdlb21ldHJ5LmFkZE5vcm1hbChuMy54LCBuMy55LCBuMy56KTtcclxuXHRcdFxyXG5cdFx0Z2VvbWV0cnkuYWRkRmFjZShpMSwgaTIsIGkzKTtcclxuXHR9XHJcblx0XHJcblx0Z2VvbWV0cnkuYnVpbGQoKTtcclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IGdlb21ldHJ5LnZlcnRleEJ1ZmZlcjtcclxuXHR0aGlzLnRleEJ1ZmZlciA9IGdlb21ldHJ5LnRleEJ1ZmZlcjtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gZ2VvbWV0cnkuZmFjZXNCdWZmZXI7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBnZW9tZXRyeS5jb2xvcnNCdWZmZXI7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gZ2VvbWV0cnkubm9ybWFsc0J1ZmZlcjtcclxufTtcclxuIiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG52YXIgVmVjdG9yNCA9IHJlcXVpcmUoJy4vS1RWZWN0b3I0Jyk7XHJcblxyXG5mdW5jdGlvbiBHZW9tZXRyeUJveCh3aWR0aCwgbGVuZ3RoLCBoZWlnaHQsIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdHRoaXMucmVhZHkgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBib3hHZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHRcclxuXHR2YXIgdyA9IHdpZHRoIC8gMjtcclxuXHR2YXIgbCA9IGxlbmd0aCAvIDI7XHJcblx0dmFyIGggPSBoZWlnaHQgLyAyO1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHRcclxuXHR0aGlzLnV2UmVnaW9uID0gKHBhcmFtcy51dlJlZ2lvbik/IHBhcmFtcy51dlJlZ2lvbiA6IG5ldyBWZWN0b3I0KDAuMCwgMC4wLCAxLjAsIDEuMCk7XHJcblx0dGhpcy5jb2xvclRvcCA9IChwYXJhbXMuY29sb3JUb3ApPyBwYXJhbXMuY29sb3JUb3AgOiBDb2xvci5fV0hJVEU7XHJcblx0dGhpcy5jb2xvckJvdHRvbSA9IChwYXJhbXMuY29sb3JCb3R0b20pPyBwYXJhbXMuY29sb3JCb3R0b20gOiBDb2xvci5fV0hJVEU7XHJcblx0XHJcblx0dmFyIHhyID0gdGhpcy51dlJlZ2lvbi54O1xyXG5cdHZhciB5ciA9IHRoaXMudXZSZWdpb24ueTtcclxuXHR2YXIgaHIgPSB0aGlzLnV2UmVnaW9uLno7XHJcblx0dmFyIHZyID0gdGhpcy51dlJlZ2lvbi53O1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgIGwsIHRoaXMuY29sb3JCb3R0b20sIGhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAgbCwgdGhpcy5jb2xvclRvcCwgeHIsIHZyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgLWgsICBsLCB0aGlzLmNvbG9yQm90dG9tLCB4ciwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgIGwsIHRoaXMuY29sb3JUb3AsIGhyLCB2cik7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAtbCwgdGhpcy5jb2xvckJvdHRvbSwgeHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgIGgsIC1sLCB0aGlzLmNvbG9yVG9wLCB4ciwgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgLWwsIHRoaXMuY29sb3JCb3R0b20sIGhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAtbCwgdGhpcy5jb2xvclRvcCwgaHIsIHZyKTtcclxuXHRcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgLWgsIC1sLCB0aGlzLmNvbG9yQm90dG9tLCBociwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgIGwsIHRoaXMuY29sb3JUb3AsIHhyLCB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAgbCwgdGhpcy5jb2xvckJvdHRvbSwgeHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgIGgsIC1sLCB0aGlzLmNvbG9yVG9wLCBociwgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgIGwsIHRoaXMuY29sb3JCb3R0b20sIGhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAgbCwgdGhpcy5jb2xvclRvcCwgaHIsIHZyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgLWgsIC1sLCB0aGlzLmNvbG9yQm90dG9tLCB4ciwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgLWwsIHRoaXMuY29sb3JUb3AsIHhyLCB2cik7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAgbCwgdGhpcy5jb2xvclRvcCwgaHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgIGgsIC1sLCB0aGlzLmNvbG9yVG9wLCB4ciwgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgIGwsIHRoaXMuY29sb3JUb3AsIHhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAtbCwgdGhpcy5jb2xvclRvcCwgaHIsIHZyKTtcclxuXHRcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgLWgsICBsLCB0aGlzLmNvbG9yQm90dG9tLCB4ciwgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgLWwsIHRoaXMuY29sb3JCb3R0b20sIHhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAgbCwgdGhpcy5jb2xvckJvdHRvbSwgaHIsIHZyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgLWgsIC1sLCB0aGlzLmNvbG9yQm90dG9tLCBociwgeXIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDAsIDEsIDIpO1xyXG5cdGJveEdlby5hZGRGYWNlKDAsIDMsIDEpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDQsIDUsIDYpO1xyXG5cdGJveEdlby5hZGRGYWNlKDUsIDcsIDYpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDgsIDksIDEwKTtcclxuXHRib3hHZW8uYWRkRmFjZSg4LCAxMSwgOSk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMTIsIDEzLCAxNCk7XHJcblx0Ym94R2VvLmFkZEZhY2UoMTMsIDE1LCAxNCk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMTYsIDE3LCAxOCk7XHJcblx0Ym94R2VvLmFkZEZhY2UoMTYsIDE5LCAxNyk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMjAsIDIxLCAyMik7XHJcblx0Ym94R2VvLmFkZEZhY2UoMjEsIDIzLCAyMik7XHJcblx0XHJcblx0Ym94R2VvLmNvbXB1dGVGYWNlc05vcm1hbHMoKTtcclxuXHRib3hHZW8uYnVpbGQoKTtcclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IGJveEdlby52ZXJ0ZXhCdWZmZXI7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBib3hHZW8udGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBib3hHZW8uZmFjZXNCdWZmZXI7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBib3hHZW8uY29sb3JzQnVmZmVyO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IGJveEdlby5ub3JtYWxzQnVmZmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5Qm94OyIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxudmFyIFZlY3RvcjQgPSByZXF1aXJlKCcuL0tUVmVjdG9yNCcpO1xyXG52YXIgS1RNYXRoID0gcmVxdWlyZSgnLi9LVE1hdGgnKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5Q3lsaW5kZXIocmFkaXVzVG9wLCByYWRpdXNCb3R0b20sIGhlaWdodCwgd2lkdGhTZWdtZW50cywgaGVpZ2h0U2VnbWVudHMsIG9wZW5Ub3AsIG9wZW5Cb3R0b20sIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdHRoaXMucmVhZHkgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBjeWxHZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0XHJcblx0dGhpcy51dlJlZ2lvbiA9IChwYXJhbXMudXZSZWdpb24pPyBwYXJhbXMudXZSZWdpb24gOiBuZXcgVmVjdG9yNCgwLjAsIDAuMCwgMS4wLCAxLjApO1xyXG5cdFxyXG5cdHZhciB4ciA9IHRoaXMudXZSZWdpb24ueDtcclxuXHR2YXIgeXIgPSB0aGlzLnV2UmVnaW9uLnk7XHJcblx0dmFyIGhyID0gdGhpcy51dlJlZ2lvbi56IC0geHI7XHJcblx0dmFyIHZyID0gdGhpcy51dlJlZ2lvbi53IC0geXI7XHJcblx0XHJcblx0dmFyIGggPSBoZWlnaHQgLyAyO1xyXG5cdFxyXG5cdHZhciBiYW5kVyA9IEtUTWF0aC5QSTIgLyAod2lkdGhTZWdtZW50cyAtIDEpO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPHdpZHRoU2VnbWVudHM7aSsrKXtcclxuXHRcdHZhciB4MSA9IE1hdGguY29zKGJhbmRXICogaSk7XHJcblx0XHR2YXIgeTEgPSAtaDtcclxuXHRcdHZhciB6MSA9IC1NYXRoLnNpbihiYW5kVyAqIGkpO1xyXG5cdFx0dmFyIHgyID0gTWF0aC5jb3MoYmFuZFcgKiBpKTtcclxuXHRcdHZhciB5MiA9IGg7XHJcblx0XHR2YXIgejIgPSAtTWF0aC5zaW4oYmFuZFcgKiBpKTtcclxuXHRcdFxyXG5cdFx0dmFyIHh0ID0gaSAvICh3aWR0aFNlZ21lbnRzIC0gMSk7XHJcblx0XHRcclxuXHRcdGN5bEdlby5hZGROb3JtYWwoeDEsIDAsIHoxKTtcclxuXHRcdGN5bEdlby5hZGROb3JtYWwoeDIsIDAsIHoyKTtcclxuXHRcdFxyXG5cdFx0eDEgKj0gcmFkaXVzQm90dG9tO1xyXG5cdFx0ejEgKj0gcmFkaXVzQm90dG9tO1xyXG5cdFx0eDIgKj0gcmFkaXVzVG9wO1xyXG5cdFx0ejIgKj0gcmFkaXVzVG9wO1xyXG5cdFx0XHJcblx0XHRjeWxHZW8uYWRkVmVydGljZSggeDEsIHkxLCB6MSwgQ29sb3IuX1dISVRFLCB4ciArICh4dCAqIGhyKSwgeXIpO1xyXG5cdFx0Y3lsR2VvLmFkZFZlcnRpY2UoIHgyLCB5MiwgejIsIENvbG9yLl9XSElURSwgeHIgKyAoeHQgKiBociksIHlyICsgdnIpO1xyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTx3aWR0aFNlZ21lbnRzKjIgLSAyO2krPTIpe1xyXG5cdFx0dmFyIGkxID0gaTtcclxuXHRcdHZhciBpMiA9IGkrMTtcclxuXHRcdHZhciBpMyA9IGkrMjtcclxuXHRcdHZhciBpNCA9IGkrMztcclxuXHRcdFxyXG5cdFx0Y3lsR2VvLmFkZEZhY2UoaTMsIGkyLCBpMSk7XHJcblx0XHRjeWxHZW8uYWRkRmFjZShpMywgaTQsIGkyKTtcclxuXHR9XHJcblx0XHJcblx0aWYgKCFvcGVuVG9wIHx8ICFvcGVuQm90dG9tKXtcclxuXHRcdHZhciBpMSA9IGN5bEdlby5hZGRWZXJ0aWNlKCAwLCBoLCAwLCBDb2xvci5fV0hJVEUsIHhyICsgKDAuNSAqIGhyKSwgeXIgKyAoMC41ICogdnIpKTtcclxuXHRcdHZhciBpMiA9IGN5bEdlby5hZGRWZXJ0aWNlKCAwLCAtaCwgMCwgQ29sb3IuX1dISVRFLCB4ciArICgwLjUgKiBociksIHlyICsgKDAuNSAqIHZyKSk7XHJcblx0XHRjeWxHZW8uYWRkTm9ybWFsKDAsICAxLCAwKTtcclxuXHRcdGN5bEdlby5hZGROb3JtYWwoMCwgLTEsIDApO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8d2lkdGhTZWdtZW50cyoyIC0gMjtpKz0yKXtcclxuXHRcdFx0dmFyIHYxID0gY3lsR2VvLnZlcnRpY2VzW2kgKyAxXTtcclxuXHRcdFx0dmFyIHYyID0gY3lsR2VvLnZlcnRpY2VzW2kgKyAzXTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciB0eDEgPSB4ciArICh2MS54IC8gMiArIDAuNSkgKiBocjtcclxuXHRcdFx0dmFyIHR5MSA9IHlyICsgKHYxLnogLyAyICsgMC41KSAqIHZyO1xyXG5cdFx0XHR2YXIgdHgyID0geHIgKyAodjIueCAvIDIgKyAwLjUpICogaHI7XHJcblx0XHRcdHZhciB0eTIgPSB5ciArICh2Mi56IC8gMiArIDAuNSkgKiB2cjtcclxuXHRcdFx0XHJcblx0XHRcdGlmICghb3BlblRvcCl7XHJcblx0XHRcdFx0dmFyIGkzID0gY3lsR2VvLmFkZFZlcnRpY2UoIHYxLngsIGgsIHYxLnosIENvbG9yLl9XSElURSwgdHgxLCB0eTEpO1xyXG5cdFx0XHRcdHZhciBpNCA9IGN5bEdlby5hZGRWZXJ0aWNlKCB2Mi54LCBoLCB2Mi56LCBDb2xvci5fV0hJVEUsIHR4MiwgdHkyKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRjeWxHZW8uYWRkTm9ybWFsKDAsIDEsIDApO1xyXG5cdFx0XHRcdGN5bEdlby5hZGROb3JtYWwoMCwgMSwgMCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Y3lsR2VvLmFkZEZhY2UoaTQsIGkxLCBpMyk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGlmICghb3BlbkJvdHRvbSl7XHJcblx0XHRcdFx0dmFyIGkzID0gY3lsR2VvLmFkZFZlcnRpY2UoIHYxLngsIC1oLCB2MS56LCBDb2xvci5fV0hJVEUsIHR4MSwgdHkxKTtcclxuXHRcdFx0XHR2YXIgaTQgPSBjeWxHZW8uYWRkVmVydGljZSggdjIueCwgLWgsIHYyLnosIENvbG9yLl9XSElURSwgdHgyLCB0eTIpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGN5bEdlby5hZGROb3JtYWwoMCwgLTEsIDApO1xyXG5cdFx0XHRcdGN5bEdlby5hZGROb3JtYWwoMCwgLTEsIDApO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGN5bEdlby5hZGRGYWNlKGkzLCBpMiwgaTQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGN5bEdlby5idWlsZCgpO1xyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gY3lsR2VvLnZlcnRleEJ1ZmZlcjtcclxuXHR0aGlzLnRleEJ1ZmZlciA9IGN5bEdlby50ZXhCdWZmZXI7XHJcblx0dGhpcy5mYWNlc0J1ZmZlciA9IGN5bEdlby5mYWNlc0J1ZmZlcjtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IGN5bEdlby5jb2xvcnNCdWZmZXI7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gY3lsR2VvLm5vcm1hbHNCdWZmZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnlDeWxpbmRlcjsiLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbnZhciBWZWN0b3I0ID0gcmVxdWlyZSgnLi9LVFZlY3RvcjQnKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5R1VJVGV4dHVyZSh3aWR0aCwgaGVpZ2h0LCBwYXJhbXMpe1xyXG5cdHRoaXMuX19rdGdlb21ldHJ5ID0gdHJ1ZTtcclxuXHR0aGlzLnJlYWR5ID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgZ3VpVGV4ID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0XHJcblx0dmFyIHgxID0gMC4wO1xyXG5cdHZhciB5MSA9IDAuMDtcclxuXHR2YXIgeDIgPSB3aWR0aDtcclxuXHR2YXIgeTIgPSBoZWlnaHQ7XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cdFxyXG5cdHRoaXMudXZSZWdpb24gPSAocGFyYW1zLnV2UmVnaW9uKT8gcGFyYW1zLnV2UmVnaW9uIDogbmV3IFZlY3RvcjQoMC4wLCAwLjAsIDEuMCwgMS4wKTtcclxuXHRcclxuXHR2YXIgeHIgPSB0aGlzLnV2UmVnaW9uLng7XHJcblx0dmFyIHlyID0gdGhpcy51dlJlZ2lvbi55O1xyXG5cdHZhciBociA9IHRoaXMudXZSZWdpb24uejtcclxuXHR2YXIgdnIgPSB0aGlzLnV2UmVnaW9uLnc7XHJcblx0XHJcblx0Z3VpVGV4LmFkZFZlcnRpY2UoeDIsIHkxLCAwLjAsIENvbG9yLl9XSElURSwgaHIsIHlyKTtcclxuXHRndWlUZXguYWRkVmVydGljZSh4MSwgeTIsIDAuMCwgQ29sb3IuX1dISVRFLCB4ciwgdnIpO1xyXG5cdGd1aVRleC5hZGRWZXJ0aWNlKHgxLCB5MSwgMC4wLCBDb2xvci5fV0hJVEUsIHhyLCB5cik7XHJcblx0Z3VpVGV4LmFkZFZlcnRpY2UoeDIsIHkyLCAwLjAsIENvbG9yLl9XSElURSwgaHIsIHZyKTtcclxuXHRcclxuXHRndWlUZXguYWRkRmFjZSgwLCAxLCAyKTtcclxuXHRndWlUZXguYWRkRmFjZSgwLCAzLCAxKTtcclxuXHRcclxuXHRndWlUZXguY29tcHV0ZUZhY2VzTm9ybWFscygpO1xyXG5cdGd1aVRleC5idWlsZCgpO1xyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gZ3VpVGV4LnZlcnRleEJ1ZmZlcjtcclxuXHR0aGlzLnRleEJ1ZmZlciA9IGd1aVRleC50ZXhCdWZmZXI7XHJcblx0dGhpcy5mYWNlc0J1ZmZlciA9IGd1aVRleC5mYWNlc0J1ZmZlcjtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IGd1aVRleC5jb2xvcnNCdWZmZXI7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gZ3VpVGV4Lm5vcm1hbHNCdWZmZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnlHVUlUZXh0dXJlOyIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxudmFyIFZlY3RvcjQgPSByZXF1aXJlKCcuL0tUVmVjdG9yNCcpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlQbGFuZSh3aWR0aCwgaGVpZ2h0LCBwYXJhbXMpe1xyXG5cdHRoaXMuX19rdGdlb21ldHJ5ID0gdHJ1ZTtcclxuXHR0aGlzLnJlYWR5ID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgcGxhbmVHZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHRcclxuXHR2YXIgdyA9IHdpZHRoIC8gMjtcclxuXHR2YXIgaCA9IGhlaWdodCAvIDI7XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cdFxyXG5cdHRoaXMudXZSZWdpb24gPSAocGFyYW1zLnV2UmVnaW9uKT8gcGFyYW1zLnV2UmVnaW9uIDogbmV3IFZlY3RvcjQoMC4wLCAwLjAsIDEuMCwgMS4wKTtcclxuXHRcclxuXHR2YXIgeHIgPSB0aGlzLnV2UmVnaW9uLng7XHJcblx0dmFyIHlyID0gdGhpcy51dlJlZ2lvbi55O1xyXG5cdHZhciBociA9IHRoaXMudXZSZWdpb24uejtcclxuXHR2YXIgdnIgPSB0aGlzLnV2UmVnaW9uLnc7XHJcblx0XHJcblx0cGxhbmVHZW8uYWRkVmVydGljZSggdywgMCwgIGgsIENvbG9yLl9XSElURSwgaHIsIHlyKTtcclxuXHRwbGFuZUdlby5hZGRWZXJ0aWNlKC13LCAwLCAtaCwgQ29sb3IuX1dISVRFLCB4ciwgdnIpO1xyXG5cdHBsYW5lR2VvLmFkZFZlcnRpY2UoLXcsIDAsICBoLCBDb2xvci5fV0hJVEUsIHhyLCB5cik7XHJcblx0cGxhbmVHZW8uYWRkVmVydGljZSggdywgMCwgLWgsIENvbG9yLl9XSElURSwgaHIsIHZyKTtcclxuXHRcclxuXHRwbGFuZUdlby5hZGRGYWNlKDAsIDEsIDIpO1xyXG5cdHBsYW5lR2VvLmFkZEZhY2UoMCwgMywgMSk7XHJcblx0XHJcblx0cGxhbmVHZW8uY29tcHV0ZUZhY2VzTm9ybWFscygpO1xyXG5cdHBsYW5lR2VvLmJ1aWxkKCk7XHJcblx0XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgPSBwbGFuZUdlby52ZXJ0ZXhCdWZmZXI7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBwbGFuZUdlby50ZXhCdWZmZXI7XHJcblx0dGhpcy5mYWNlc0J1ZmZlciA9IHBsYW5lR2VvLmZhY2VzQnVmZmVyO1xyXG5cdHRoaXMuY29sb3JzQnVmZmVyID0gcGxhbmVHZW8uY29sb3JzQnVmZmVyO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IHBsYW5lR2VvLm5vcm1hbHNCdWZmZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnlQbGFuZTsiLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbnZhciBWZWN0b3I0ID0gcmVxdWlyZSgnLi9LVFZlY3RvcjQnKTtcclxudmFyIE1hdGVyaWFsQmFzaWMgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWxCYXNpYycpO1xyXG52YXIgTWVzaCA9IHJlcXVpcmUoJy4vS1RNZXNoJyk7XHJcbnZhciBHZW9tZXRyeVBsYW5lID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5UGxhbmUnKTtcclxudmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5U2t5Ym94KHdpZHRoLCBoZWlnaHQsIGxlbmd0aCwgcG9zaXRpb24sIHRleHR1cmVzKXtcclxuXHR0aGlzLm1lc2hlcyA9IFtdO1xyXG5cdGlmICghdGV4dHVyZXMpIHRleHR1cmVzID0gW107XHJcblx0XHJcblx0dmFyIHcgPSB3aWR0aCAvIDI7XHJcblx0dmFyIGwgPSBsZW5ndGggLyAyO1xyXG5cdHZhciBoID0gaGVpZ2h0IC8gMjtcclxuXHR2YXIgdiA9IDEuMDtcclxuXHRcclxuXHR2YXIgeHIgPSAwLjA7XHJcblx0dmFyIHlyID0gMC4wO1xyXG5cdHZhciBociA9IDEuMDtcclxuXHR2YXIgdnIgPSAxLjA7XHJcblx0XHJcblx0dmFyIGN0ID0gQ29sb3IuX1dISVRFO1xyXG5cdHZhciBjYiA9IENvbG9yLl9XSElURTtcclxuXHRcclxuXHR2YXIgZ2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0dmFyIG1hdCA9IG5ldyBNYXRlcmlhbEJhc2ljKHRleHR1cmVzW0tULlRFWFRVUkVfRlJPTlRdLCBDb2xvci5fV0hJVEUpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13IC12LCAtaCAtdiwgIGwsIGNiLCBociwgeXIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKCB3ICt2LCAgaCArdiwgIGwsIGN0LCB4ciwgdnIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKCB3ICt2LCAtaCAtdiwgIGwsIGNiLCB4ciwgeXIpO1xyXG5cdGdlby5hZGRWZXJ0aWNlKC13IC12LCAgaCArdiwgIGwsIGN0LCBociwgdnIpO1xyXG5cdGdlby5hZGRGYWNlKDAsIDEsIDIpO1xyXG5cdGdlby5hZGRGYWNlKDAsIDMsIDEpO1xyXG5cdGdlby5idWlsZCgpO1xyXG5cdHRoaXMubWVzaGVzLnB1c2gobmV3IE1lc2goZ2VvLCBtYXQpKTtcclxuXHRcclxuXHR2YXIgZ2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0dmFyIG1hdCA9IG5ldyBNYXRlcmlhbEJhc2ljKHRleHR1cmVzW0tULlRFWFRVUkVfQkFDS10sIENvbG9yLl9XSElURSk7XHJcblx0Z2VvLmFkZFZlcnRpY2UoLXcgLXYsIC1oIC12LCAtbCwgY2IsIHhyLCB5cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoLXcgLXYsICBoICt2LCAtbCwgY3QsIHhyLCB2cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoIHcgK3YsIC1oIC12LCAtbCwgY2IsIGhyLCB5cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoIHcgK3YsICBoICt2LCAtbCwgY3QsIGhyLCB2cik7XHJcblx0Z2VvLmFkZEZhY2UoMCwgMiwgMSk7XHJcblx0Z2VvLmFkZEZhY2UoMiwgMywgMSk7XHJcblx0Z2VvLmJ1aWxkKCk7XHJcblx0dGhpcy5tZXNoZXMucHVzaChuZXcgTWVzaChnZW8sIG1hdCkpO1xyXG5cdFxyXG5cdHZhciBnZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHR2YXIgbWF0ID0gbmV3IE1hdGVyaWFsQmFzaWModGV4dHVyZXNbS1QuVEVYVFVSRV9SSUdIVF0sIENvbG9yLl9XSElURSk7XHJcblx0Z2VvLmFkZFZlcnRpY2UoIHcsIC1oIC12LCAgbCArdiwgY2IsIGhyLCB5cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoIHcsICBoICt2LCAtbCAtdiwgY3QsIHhyLCB2cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoIHcsIC1oIC12LCAtbCAtdiwgY2IsIHhyLCB5cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoIHcsICBoICt2LCAgbCArdiwgY3QsIGhyLCB2cik7XHJcblx0Z2VvLmFkZEZhY2UoMCwgMSwgMik7XHJcblx0Z2VvLmFkZEZhY2UoMCwgMywgMSk7XHJcblx0Z2VvLmJ1aWxkKCk7XHJcblx0dGhpcy5tZXNoZXMucHVzaChuZXcgTWVzaChnZW8sIG1hdCkpO1xyXG5cdFxyXG5cdHZhciBnZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHR2YXIgbWF0ID0gbmV3IE1hdGVyaWFsQmFzaWModGV4dHVyZXNbS1QuVEVYVFVSRV9MRUZUXSwgQ29sb3IuX1dISVRFKTtcclxuXHRnZW8uYWRkVmVydGljZSgtdywgLWggLXYsIC1sIC12LCBjYiwgaHIsIHlyKTtcclxuXHRnZW8uYWRkVmVydGljZSgtdywgIGggK3YsIC1sIC12LCBjdCwgaHIsIHZyKTtcclxuXHRnZW8uYWRkVmVydGljZSgtdywgLWggLXYsICBsICt2LCBjYiwgeHIsIHlyKTtcclxuXHRnZW8uYWRkVmVydGljZSgtdywgIGggK3YsICBsICt2LCBjdCwgeHIsIHZyKTtcclxuXHRnZW8uYWRkRmFjZSgwLCAxLCAyKTtcclxuXHRnZW8uYWRkRmFjZSgxLCAzLCAyKTtcclxuXHRnZW8uYnVpbGQoKTtcclxuXHR0aGlzLm1lc2hlcy5wdXNoKG5ldyBNZXNoKGdlbywgbWF0KSk7XHJcblx0XHJcblx0dmFyIGdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdHZhciBtYXQgPSBuZXcgTWF0ZXJpYWxCYXNpYyh0ZXh0dXJlc1tLVC5URVhUVVJFX1VQXSwgQ29sb3IuX1dISVRFKTtcclxuXHRnZW8uYWRkVmVydGljZSggdyArdiwgIGgsIC1sIC12LCBjdCwgaHIsIHlyKTtcclxuXHRnZW8uYWRkVmVydGljZSgtdyAtdiwgIGgsICBsICt2LCBjdCwgeHIsIHZyKTtcclxuXHRnZW8uYWRkVmVydGljZSgtdyAtdiwgIGgsIC1sIC12LCBjdCwgeHIsIHlyKTtcclxuXHRnZW8uYWRkVmVydGljZSggdyArdiwgIGgsICBsICt2LCBjdCwgaHIsIHZyKTtcclxuXHRnZW8uYWRkRmFjZSgwLCAxLCAyKTtcclxuXHRnZW8uYWRkRmFjZSgwLCAzLCAxKTtcclxuXHRnZW8uYnVpbGQoKTtcclxuXHR0aGlzLm1lc2hlcy5wdXNoKG5ldyBNZXNoKGdlbywgbWF0KSk7XHJcblx0XHJcblx0dmFyIGdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdHZhciBtYXQgPSBuZXcgTWF0ZXJpYWxCYXNpYyh0ZXh0dXJlc1tLVC5URVhUVVJFX0RPV05dLCBDb2xvci5fV0hJVEUpO1xyXG5cdG1hdC5kcmF3RmFjZXMgPSAnQk9USCc7XHJcblx0Z2VvLmFkZFZlcnRpY2UoIHcgK3YsIC1oLCAtbCAtdiwgY2IsIGhyLCB2cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoLXcgLXYsIC1oLCAgbCArdiwgY2IsIHhyLCB5cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoLXcgLXYsIC1oLCAtbCAtdiwgY2IsIHhyLCB2cik7XHJcblx0Z2VvLmFkZFZlcnRpY2UoIHcgK3YsIC1oLCAgbCArdiwgY2IsIGhyLCB5cik7XHJcblx0Z2VvLmFkZEZhY2UoMCwgMiwgMSk7XHJcblx0Z2VvLmFkZEZhY2UoMCwgMSwgMyk7XHJcblx0Z2VvLmNvbXB1dGVGYWNlc05vcm1hbHMoKTtcclxuXHRnZW8uYnVpbGQoKTtcclxuXHR0aGlzLm1lc2hlcy5wdXNoKG5ldyBNZXNoKGdlbywgbWF0KSk7XHJcblx0XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8NjtpKyspe1xyXG5cdFx0dGhpcy5tZXNoZXNbaV0ucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnlTa3lib3g7IiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG52YXIgVmVjdG9yNCA9IHJlcXVpcmUoJy4vS1RWZWN0b3I0Jyk7XHJcblxyXG5mdW5jdGlvbiBHZW9tZXRyeVNwaGVyZShyYWRpdXMsIGxhdEJhbmRzLCBsb25CYW5kcywgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0dGhpcy5yZWFkeSA9IHRydWU7XHJcblx0XHJcblx0dmFyIHNwaEdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHRcclxuXHR0aGlzLnV2UmVnaW9uID0gKHBhcmFtcy51dlJlZ2lvbik/IHBhcmFtcy51dlJlZ2lvbiA6IG5ldyBWZWN0b3I0KDAuMCwgMC4wLCAxLjAsIDEuMCk7XHJcblx0XHJcblx0dmFyIHhyID0gdGhpcy51dlJlZ2lvbi54O1xyXG5cdHZhciB5ciA9IHRoaXMudXZSZWdpb24ueTtcclxuXHR2YXIgaHIgPSB0aGlzLnV2UmVnaW9uLnogLSB4cjtcclxuXHR2YXIgdnIgPSB0aGlzLnV2UmVnaW9uLncgLSB5cjtcclxuXHR2YXIgaHMgPSAocGFyYW1zLmhhbGZTcGhlcmUpPyAxLjAgOiAyLjA7XHJcblx0XHJcblx0Zm9yICh2YXIgbGF0Tj0wO2xhdE48PWxhdEJhbmRzO2xhdE4rKyl7XHJcblx0XHR2YXIgdGhldGEgPSBsYXROICogTWF0aC5QSSAvIGxhdEJhbmRzO1xyXG5cdFx0dmFyIGNvc1QgPSBNYXRoLmNvcyh0aGV0YSk7XHJcblx0XHR2YXIgc2luVCA9IE1hdGguc2luKHRoZXRhKTtcclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgbG9uTj0wO2xvbk48PWxvbkJhbmRzO2xvbk4rKyl7XHJcblx0XHRcdHZhciBwaGkgPSBsb25OICogaHMgKiBNYXRoLlBJIC8gbG9uQmFuZHM7XHJcblx0XHRcdHZhciBjb3NQID0gTWF0aC5jb3MocGhpKTtcclxuXHRcdFx0dmFyIHNpblAgPSBNYXRoLnNpbihwaGkpO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHggPSBjb3NQICogc2luVDtcclxuXHRcdFx0dmFyIHkgPSBjb3NUO1xyXG5cdFx0XHR2YXIgeiA9IHNpblAgKiBzaW5UO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHR4ID0gbG9uTiAvIGxvbkJhbmRzO1xyXG5cdFx0XHR2YXIgdHkgPSAxIC0gbGF0TiAvIGxhdEJhbmRzO1xyXG5cdFx0XHRcclxuXHRcdFx0c3BoR2VvLmFkZE5vcm1hbCh4LCB5LCB6KTtcclxuXHRcdFx0c3BoR2VvLmFkZFZlcnRpY2UoeCAqIHJhZGl1cywgeSAqIHJhZGl1cywgeiAqIHJhZGl1cywgQ29sb3IuX1dISVRFLCB4ciArIHR4ICogaHIsIHlyICsgdHkgKiB2cik7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGxhdE49MDtsYXROPGxhdEJhbmRzO2xhdE4rKyl7XHJcblx0XHRmb3IgKHZhciBsb25OPTA7bG9uTjxsb25CYW5kcztsb25OKyspe1xyXG5cdFx0XHR2YXIgaTEgPSBsb25OICsgKGxhdE4gKiAobG9uQmFuZHMgKyAxKSk7XHJcblx0XHRcdHZhciBpMiA9IGkxICsgbG9uQmFuZHMgKyAxO1xyXG5cdFx0XHR2YXIgaTMgPSBpMSArIDE7XHJcblx0XHRcdHZhciBpNCA9IGkyICsgMTtcclxuXHRcdFx0XHJcblx0XHRcdHNwaEdlby5hZGRGYWNlKGk0LCBpMSwgaTMpO1xyXG5cdFx0XHRzcGhHZW8uYWRkRmFjZShpNCwgaTIsIGkxKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0c3BoR2VvLmJ1aWxkKCk7XHJcblx0XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgPSBzcGhHZW8udmVydGV4QnVmZmVyO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gc3BoR2VvLnRleEJ1ZmZlcjtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gc3BoR2VvLmZhY2VzQnVmZmVyO1xyXG5cdHRoaXMuY29sb3JzQnVmZmVyID0gc3BoR2VvLmNvbG9yc0J1ZmZlcjtcclxuXHR0aGlzLm5vcm1hbHNCdWZmZXIgPSBzcGhHZW8ubm9ybWFsc0J1ZmZlcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeVNwaGVyZTsiLCJ2YXIgVXRpbHMgPSByZXF1aXJlKCcuL0tUVXRpbHMnKTtcclxudmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxudmFyIFZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG5cclxudmFyIElucHV0ID0ge1xyXG5cdF9rZXlzOiBbXSxcclxuXHRfbW91c2U6IHtcclxuXHRcdGxlZnQ6IDAsXHJcblx0XHRyaWdodDogMCxcclxuXHRcdG1pZGRsZTogMCxcclxuXHRcdHdoZWVsOiAwLFxyXG5cdFx0cG9zaXRpb246IG5ldyBWZWN0b3IyKDAuMCwgMC4wKVxyXG5cdH0sXHJcblx0XHJcblx0dktleToge1xyXG5cdFx0U0hJRlQ6IDE2LFxyXG5cdFx0VEFCOiA5LFxyXG5cdFx0Q1RSTDogMTcsXHJcblx0XHRBTFQ6IDE4LFxyXG5cdFx0U1BBQ0U6IDMyLFxyXG5cdFx0RU5URVI6IDEzLFxyXG5cdFx0QkFDS1NQQUNFOiA4LFxyXG5cdFx0RVNDOiAyNyxcclxuXHRcdElOU0VSVDogNDUsXHJcblx0XHRERUw6IDQ2LFxyXG5cdFx0RU5EOiAzNSxcclxuXHRcdFNUQVJUOiAzNixcclxuXHRcdFBBR0VVUDogMzMsXHJcblx0XHRQQUdFRE9XTjogMzRcclxuXHR9LFxyXG5cdFxyXG5cdHZNb3VzZToge1xyXG5cdFx0TEVGVDogJ2xlZnQnLFxyXG5cdFx0UklHSFQ6ICdyaWdodCcsXHJcblx0XHRNSURETEU6ICdtaWRkbGUnLFxyXG5cdFx0V0hFRUxVUDogMSxcclxuXHRcdFdIRUVMRE9XTjogLTEsXHJcblx0fSxcclxuXHRcclxuXHRpc0tleURvd246IGZ1bmN0aW9uKGtleUNvZGUpe1xyXG5cdFx0cmV0dXJuIChJbnB1dC5fa2V5c1trZXlDb2RlXSA9PSAxKTtcclxuXHR9LFxyXG5cdFxyXG5cdGlzS2V5UHJlc3NlZDogZnVuY3Rpb24oa2V5Q29kZSl7XHJcblx0XHRpZiAoSW5wdXQuX2tleXNba2V5Q29kZV0gPT0gMSl7XHJcblx0XHRcdElucHV0Ll9rZXlzW2tleUNvZGVdID0gMjtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGlzTW91c2VEb3duOiBmdW5jdGlvbihtb3VzZUJ1dHRvbil7XHJcblx0XHRyZXR1cm4gKElucHV0Ll9tb3VzZVttb3VzZUJ1dHRvbl0gPT0gMSk7XHJcblx0fSxcclxuXHRcclxuXHRpc01vdXNlUHJlc3NlZDogZnVuY3Rpb24obW91c2VCdXR0b24pe1xyXG5cdFx0aWYgKElucHV0Ll9tb3VzZVttb3VzZUJ1dHRvbl0gPT0gMSl7XHJcblx0XHRcdElucHV0Ll9tb3VzZVttb3VzZUJ1dHRvbl0gPSAyO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0aXNXaGVlbE1vdmVkOiBmdW5jdGlvbih3aGVlbERpcil7XHJcblx0XHRpZiAoSW5wdXQuX21vdXNlLndoZWVsID09IHdoZWVsRGlyKXtcclxuXHRcdFx0SW5wdXQuX21vdXNlLndoZWVsID0gMDtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZUtleURvd246IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHJcblx0XHRpZiAoSW5wdXQuX2tleXNbZXYua2V5Q29kZV0gPT0gMikgcmV0dXJuO1xyXG5cdFx0SW5wdXQuX2tleXNbZXYua2V5Q29kZV0gPSAxO1xyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlS2V5VXA6IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHJcblx0XHRJbnB1dC5fa2V5c1tldi5rZXlDb2RlXSA9IDA7XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVNb3VzZURvd246IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHJcblx0XHRpZiAoZXYud2hpY2ggPT0gMSl7XHJcblx0XHRcdGlmIChJbnB1dC5fbW91c2UubGVmdCAhPSAyKVxyXG5cdFx0XHRcdElucHV0Ll9tb3VzZS5sZWZ0ID0gMTtcclxuXHRcdH1lbHNlIGlmIChldi53aGljaCA9PSAyKXtcclxuXHRcdFx0aWYgKElucHV0Ll9tb3VzZS5taWRkbGUgIT0gMilcclxuXHRcdFx0XHRJbnB1dC5fbW91c2UubWlkZGxlID0gMTtcclxuXHRcdH1lbHNlIGlmIChldi53aGljaCA9PSAzKXtcclxuXHRcdFx0aWYgKElucHV0Ll9tb3VzZS5yaWdodCAhPSAyKVxyXG5cdFx0XHRcdElucHV0Ll9tb3VzZS5yaWdodCA9IDE7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdElucHV0LmhhbmRsZU1vdXNlTW92ZShldik7XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlTW91c2VVcDogZnVuY3Rpb24oZXYpe1xyXG5cdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcclxuXHRcdGlmIChldi53aGljaCA9PSAxKXtcclxuXHRcdFx0SW5wdXQuX21vdXNlLmxlZnQgPSAwO1xyXG5cdFx0fWVsc2UgaWYgKGV2LndoaWNoID09IDIpe1xyXG5cdFx0XHRJbnB1dC5fbW91c2UubWlkZGxlID0gMDtcclxuXHRcdH1lbHNlIGlmIChldi53aGljaCA9PSAzKXtcclxuXHRcdFx0SW5wdXQuX21vdXNlLnJpZ2h0ID0gMDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0SW5wdXQuaGFuZGxlTW91c2VNb3ZlKGV2KTtcclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVNb3VzZVdoZWVsOiBmdW5jdGlvbihldil7XHJcblx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFxyXG5cdFx0SW5wdXQuX21vdXNlLndoZWVsID0gMDtcclxuXHRcdGlmIChldi53aGVlbERlbHRhID4gMCkgSW5wdXQuX21vdXNlLndoZWVsID0gMTtcclxuXHRcdGVsc2UgaWYgKGV2LndoZWVsRGVsdGEgPCAwKSBJbnB1dC5fbW91c2Uud2hlZWwgPSAtMTtcclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZU1vdXNlTW92ZTogZnVuY3Rpb24oZXYpe1xyXG5cdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcclxuXHRcdHZhciBlbFggPSBldi5jbGllbnRYIC0gZXYudGFyZ2V0Lm9mZnNldExlZnQ7XHJcblx0XHR2YXIgZWxZID0gZXYuY2xpZW50WSAtIGV2LnRhcmdldC5vZmZzZXRUb3A7XHJcblx0XHRcclxuXHRcdElucHV0Ll9tb3VzZS5wb3NpdGlvbi5zZXQoZWxYLCBlbFkpO1xyXG5cdH0sXHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24oY2FudmFzKXtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGRvY3VtZW50LCAna2V5ZG93bicsIElucHV0LmhhbmRsZUtleURvd24pO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoZG9jdW1lbnQsICdrZXl1cCcsIElucHV0LmhhbmRsZUtleVVwKTtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGNhbnZhcywgJ21vdXNlZG93bicsIElucHV0LmhhbmRsZU1vdXNlRG93bik7XHJcblx0XHRVdGlscy5hZGRFdmVudChkb2N1bWVudCwgJ21vdXNldXAnLCBJbnB1dC5oYW5kbGVNb3VzZVVwKTtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGNhbnZhcywgJ21vdXNld2hlZWwnLCBJbnB1dC5oYW5kbGVNb3VzZVdoZWVsKTtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGNhbnZhcywgJ21vdXNlbW92ZScsIElucHV0LmhhbmRsZU1vdXNlTW92ZSk7XHJcblx0XHRVdGlscy5hZGRFdmVudChkb2N1bWVudCwgJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZXYpe1xyXG5cdFx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChldi50YXJnZXQgPT09IGNhbnZhcyl7XHJcblx0XHRcdFx0ZXYuY2FuY2VsQnViYmxlID0gdHJ1ZTtcclxuXHRcdFx0XHRldi5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmIChldi5wcmV2ZW50RGVmYXVsdClcclxuXHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0aWYgKGV2LnN0b3BQcm9wYWdhdGlvbilcclxuXHRcdFx0XHRcdGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8PTk7aSsrKXtcclxuXHRcdFx0SW5wdXQudktleVsnTicgKyBpXSA9IDQ4ICsgaTtcclxuXHRcdFx0SW5wdXQudktleVsnTksnICsgaV0gPSA5NiArIGk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGk9NjU7aTw9OTA7aSsrKXtcclxuXHRcdFx0SW5wdXQudktleVtTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGk9MTtpPD0xMjtpKyspe1xyXG5cdFx0XHRJbnB1dC52S2V5WydGJyArIGldID0gMTExICsgaTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0OyIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG5cclxuZnVuY3Rpb24gRGlyZWN0aW9uYWxMaWdodChkaXJlY3Rpb24sIGNvbG9yLCBpbnRlbnNpdHkpe1xyXG5cdHRoaXMuX19rdGRpckxpZ2h0ID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbi5ub3JtYWxpemUoKTtcclxuXHR0aGlzLmRpcmVjdGlvbi5tdWx0aXBseSgtMSk7XHJcblx0XHJcblx0dGhpcy5jb2xvciA9IG5ldyBDb2xvcigoY29sb3IpPyBjb2xvcjogQ29sb3IuX1dISVRFKTtcclxuXHR0aGlzLmludGVuc2l0eSA9IChpbnRlbnNpdHkgIT09IHVuZGVmaW5lZCk/IGludGVuc2l0eSA6IDEuMDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3Rpb25hbExpZ2h0O1xyXG5cclxuIiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcblxyXG5mdW5jdGlvbiBMaWdodFBvaW50KHBvc2l0aW9uLCBpbnRlbnNpdHksIGRpc3RhbmNlLCBjb2xvcil7XHJcblx0dGhpcy5fX2t0cG9pbnRsaWdodCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cdHRoaXMuaW50ZW5zaXR5ID0gKGludGVuc2l0eSk/IGludGVuc2l0eSA6IDEuMDtcclxuXHR0aGlzLmRpc3RhbmNlID0gKGRpc3RhbmNlKT8gZGlzdGFuY2UgOiAxLjA7XHJcblx0dGhpcy5jb2xvciA9IG5ldyBDb2xvcigoY29sb3IpPyBjb2xvciA6IENvbG9yLl9XSElURSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGlnaHRQb2ludDsiLCJ2YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcbnZhciBUZXh0dXJlRnJhbWVidWZmZXIgPSByZXF1aXJlKCcuL0tUVGV4dHVyZUZyYW1lYnVmZmVyJyk7XHJcblxyXG5mdW5jdGlvbiBMaWdodFNwb3QocG9zaXRpb24sIHRhcmdldCwgaW5uZXJBbmdsZSwgb3V0ZXJBbmdsZSwgaW50ZW5zaXR5LCBkaXN0YW5jZSwgY29sb3Ipe1xyXG5cdHRoaXMuX19rdHNwb3RsaWdodCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cdHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdHRoaXMuZGlyZWN0aW9uID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZShwb3NpdGlvbiwgdGFyZ2V0KS5ub3JtYWxpemUoKTtcclxuXHR0aGlzLm91dGVyQW5nbGUgPSBNYXRoLmNvcyhvdXRlckFuZ2xlKTtcclxuXHR0aGlzLmlubmVyQW5nbGUgPSBNYXRoLmNvcyhpbm5lckFuZ2xlKTtcclxuXHR0aGlzLmludGVuc2l0eSA9IChpbnRlbnNpdHkpPyBpbnRlbnNpdHkgOiAxLjA7XHJcblx0dGhpcy5kaXN0YW5jZSA9IChkaXN0YW5jZSk/IGRpc3RhbmNlIDogMS4wO1xyXG5cdHRoaXMuY29sb3IgPSBuZXcgQ29sb3IoKGNvbG9yKT8gY29sb3IgOiBDb2xvci5fV0hJVEUpO1xyXG5cdHRoaXMuY2FzdFNoYWRvdyA9IGZhbHNlO1xyXG5cdHRoaXMuc2hhZG93Q2FtID0gbnVsbDtcclxuXHR0aGlzLnNoYWRvd0J1ZmZlciA9IG51bGw7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGlnaHRTcG90O1xyXG5cclxuTGlnaHRTcG90LnByb3RvdHlwZS5zZXRDYXN0U2hhZG93ID0gZnVuY3Rpb24oY2FzdFNoYWRvdywgcmVzb2x1dGlvbil7XHJcblx0dGhpcy5jYXN0U2hhZG93ID0gY2FzdFNoYWRvdztcclxuXHRcclxuXHRpZiAoY2FzdFNoYWRvdyl7XHJcblx0XHR2YXIgcmVsID0gS1QuY2FudmFzLndpZHRoIC8gS1QuY2FudmFzLmhlaWdodDtcclxuXHRcdHRoaXMuc2hhZG93Q2FtID0gbmV3IEtULkNhbWVyYVBlcnNwZWN0aXZlKEtULk1hdGguZGVnVG9SYWQoOTAuMCksIHJlbCwgMC4xLCB0aGlzLmRpc3RhbmNlKTtcclxuXHRcdHRoaXMuc2hhZG93Q2FtLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbjtcclxuXHRcdHRoaXMuc2hhZG93Q2FtLmxvb2tBdCh0aGlzLnRhcmdldCk7XHJcblx0XHRcclxuXHRcdGlmICghcmVzb2x1dGlvbikgcmVzb2x1dGlvbiA9IG5ldyBWZWN0b3IyKDUxMi4wLCA1MTIuMCk7XHJcblx0XHRcclxuXHRcdHZhciB3ID0gKHJlc29sdXRpb24ueCA+IHJlc29sdXRpb24ueSk/IHJlc29sdXRpb24ueCA6IHJlc29sdXRpb24ueTtcclxuXHRcdHcgPSBNYXRoLmNlaWwodyAvIDUxMi4wKSAqIDUxMi4wO1xyXG5cdFx0XHJcblx0XHR0aGlzLnNoYWRvd0J1ZmZlciA9IG5ldyBUZXh0dXJlRnJhbWVidWZmZXIodywgdyk7XHJcblx0fWVsc2V7XHJcblx0XHR0aGlzLnNoYWRvd0NhbSA9IG51bGw7XHJcblx0XHR0aGlzLnNoYWRvd0J1ZmZlciA9IG51bGw7XHJcblx0fVxyXG59O1xyXG4iLCJ2YXIgU2hhZGVycyA9IHJlcXVpcmUoJy4vS1RTaGFkZXJzJyk7XHJcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4vS1RJbnB1dCcpO1xyXG52YXIgTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRURVhUVVJFX0ZST05UOiAwLFxyXG5cdFRFWFRVUkVfQkFDSzogMSxcclxuXHRURVhUVVJFX1JJR0hUOiAyLFxyXG5cdFRFWFRVUkVfTEVGVDogMyxcclxuXHRURVhUVVJFX1VQOiA0LFxyXG5cdFRFWFRVUkVfRE9XTjogNSxcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihjYW52YXMpe1xyXG5cdFx0dGhpcy5jYW52YXMgPSBjYW52YXM7XHJcblx0XHR0aGlzLmdsID0gbnVsbDtcclxuXHRcdHRoaXMuc2hhZGVycyA9IHt9O1xyXG5cdFx0dGhpcy5pbWFnZXMgPSBbXTtcclxuXHRcdHRoaXMubWF4QXR0cmliTG9jYXRpb25zID0gMDtcclxuXHRcdHRoaXMubGFzdFByb2dyYW0gPSBudWxsO1xyXG5cdFx0XHJcblx0XHR0aGlzLmxpZ2h0TkRDTWF0ID0gbmV3IE1hdHJpeDQoXHJcblx0XHRcdDAuNSwgMC4wLCAwLjAsIDAuNSxcclxuXHRcdFx0MC4wLCAwLjUsIDAuMCwgMC41LFxyXG5cdFx0XHQwLjAsIDAuMCwgMC41LCAwLjUsXHJcblx0XHRcdDAuMCwgMC4wLCAwLjAsIDEuMFxyXG5cdFx0KTtcclxuXHRcdFxyXG5cdFx0dGhpcy5fX2luaXRDb250ZXh0KGNhbnZhcyk7XHJcblx0XHR0aGlzLl9faW5pdFByb3BlcnRpZXMoKTtcclxuXHRcdHRoaXMuX19pbml0U2hhZGVycygpO1xyXG5cdFx0XHJcblx0XHRJbnB1dC5pbml0KGNhbnZhcyk7XHJcblx0fSxcclxuXHRcclxuXHRfX2luaXRDb250ZXh0OiBmdW5jdGlvbihjYW52YXMpe1xyXG5cdFx0dGhpcy5nbCA9IGNhbnZhcy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnKTtcclxuXHRcdFxyXG5cdFx0aWYgKCF0aGlzLmdsKXtcclxuXHRcdFx0YWxlcnQoXCJZb3VyIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IFdlYkdMXCIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuZ2wud2lkdGggPSBjYW52YXMud2lkdGg7XHJcblx0XHR0aGlzLmdsLmhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XHJcblx0fSxcclxuXHRcclxuXHRfX2luaXRQcm9wZXJ0aWVzOiBmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGdsID0gdGhpcy5nbDtcclxuXHRcdFxyXG5cdFx0Z2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xyXG5cdFx0Z2wuZGVwdGhGdW5jKGdsLkxFUVVBTCk7XHJcblx0XHRcclxuXHRcdGdsLmVuYWJsZShnbC5DVUxMX0ZBQ0UpO1xyXG5cdFx0XHJcblx0XHRnbC5kaXNhYmxlKCBnbC5CTEVORCApO1xyXG5cdFx0Z2wuYmxlbmRFcXVhdGlvbiggZ2wuRlVOQ19BREQgKTtcclxuXHRcdGdsLmJsZW5kRnVuYyggZ2wuU1JDX0FMUEhBLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBICk7XHJcblx0fSxcclxuXHRcclxuXHRfX2luaXRTaGFkZXJzOiBmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5zaGFkZXJzID0ge307XHJcblx0XHR0aGlzLnNoYWRlcnMuYmFzaWMgPSB0aGlzLnByb2Nlc3NTaGFkZXIoU2hhZGVycy5iYXNpYyk7XHJcblx0XHR0aGlzLnNoYWRlcnMubGFtYmVydCA9IHRoaXMucHJvY2Vzc1NoYWRlcihTaGFkZXJzLmxhbWJlcnQpO1xyXG5cdFx0dGhpcy5zaGFkZXJzLnBob25nID0gdGhpcy5wcm9jZXNzU2hhZGVyKFNoYWRlcnMucGhvbmcpO1xyXG5cdFx0dGhpcy5zaGFkZXJzLmRlcHRoID0gdGhpcy5wcm9jZXNzU2hhZGVyKFNoYWRlcnMuZGVwdGhNYXApO1xyXG5cdH0sXHJcblx0XHJcblx0Y3JlYXRlQXJyYXlCdWZmZXI6IGZ1bmN0aW9uKHR5cGUsIGRhdGFBcnJheSwgaXRlbVNpemUpe1xyXG5cdFx0dmFyIGdsID0gdGhpcy5nbDtcclxuXHRcdHZhciBidWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuXHRcdGdsLmJpbmRCdWZmZXIoZ2xbdHlwZV0sIGJ1ZmZlcik7XHJcblx0XHRnbC5idWZmZXJEYXRhKGdsW3R5cGVdLCBkYXRhQXJyYXksIGdsLlNUQVRJQ19EUkFXKTtcclxuXHRcdGJ1ZmZlci5udW1JdGVtcyA9IGRhdGFBcnJheS5sZW5ndGg7XHJcblx0XHRidWZmZXIuaXRlbVNpemUgPSBpdGVtU2l6ZTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIGJ1ZmZlcjtcclxuXHR9LFxyXG5cdFxyXG5cdGdldFNoYWRlckF0dHJpYnV0ZXNBbmRVbmlmb3JtczogZnVuY3Rpb24odmVydGV4LCBmcmFnbWVudCl7XHJcblx0XHR2YXIgYXR0cmlidXRlcyA9IFtdO1xyXG5cdFx0dmFyIHVuaWZvcm1zID0gW107XHJcblx0XHR2YXIgdW5pZm9ybXNOYW1lcyA9IFtdO1xyXG5cdFx0XHJcblx0XHR2YXIgc3RydWN0cyA9IFtdO1xyXG5cdFx0dmFyIHVuaWZvcm1zQXJyYXlzID0gW107XHJcblx0XHR2YXIgc3QgPSBudWxsO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dmVydGV4Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHR2YXIgbGluZSA9IHZlcnRleFtpXS50cmltKCk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAobGluZS5pbmRleE9mKFwiYXR0cmlidXRlIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtIDFdLnRyaW0oKTtcclxuXHRcdFx0XHRpZiAoYXR0cmlidXRlcy5pbmRleE9mKG5hbWUpID09IC0xKVxyXG5cdFx0XHRcdFx0YXR0cmlidXRlcy5wdXNoKHtuYW1lOiBuYW1lfSk7XHJcblx0XHRcdH1lbHNlIGlmIChsaW5lLmluZGV4T2YoXCJ1bmlmb3JtIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0aWYgKGxpbmUuaW5kZXhPZihcIltcIikgIT0gLTEpe1xyXG5cdFx0XHRcdFx0dW5pZm9ybXNBcnJheXMucHVzaChsaW5lKTtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgcCA9IGxpbmUuc3BsaXQoLyAvZyk7XHJcblx0XHRcdFx0dmFyIG5hbWUgPSBwW3AubGVuZ3RoIC0gMV0udHJpbSgpO1xyXG5cdFx0XHRcdGlmICh1bmlmb3Jtc05hbWVzLmluZGV4T2YobmFtZSkgPT0gLTEpe1xyXG5cdFx0XHRcdFx0dW5pZm9ybXMucHVzaCh7bmFtZTogbmFtZX0pO1xyXG5cdFx0XHRcdFx0dW5pZm9ybXNOYW1lcy5wdXNoKG5hbWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fWVsc2UgaWYgKGxpbmUuaW5kZXhPZihcInN0cnVjdFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IHsgbmFtZTogbGluZS5yZXBsYWNlKFwic3RydWN0IFwiLCBcIlwiKSwgZGF0YTogW10gfTtcclxuXHRcdFx0XHRzdHJ1Y3RzLnB1c2goc3QpO1xyXG5cdFx0XHR9ZWxzZSBpZiAoc3QgIT0gbnVsbCl7XHJcblx0XHRcdFx0aWYgKGxpbmUudHJpbSgpID09IFwiXCIpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdHZhciBwID0gbGluZS5zcGxpdCgvIC9nKTtcclxuXHRcdFx0XHR2YXIgbmFtZSA9IHBbcC5sZW5ndGggLTFdLnRyaW0oKTtcclxuXHRcdFx0XHRzdC5kYXRhLnB1c2gobmFtZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8ZnJhZ21lbnQubGVuZ3RoO2krKyl7XHJcblx0XHRcdHZhciBsaW5lID0gZnJhZ21lbnRbaV0udHJpbSgpO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGxpbmUuaW5kZXhPZihcImF0dHJpYnV0ZSBcIikgPT0gMCl7XHJcblx0XHRcdFx0c3QgPSBudWxsO1xyXG5cdFx0XHRcdHZhciBwID0gbGluZS5zcGxpdCgvIC9nKTtcclxuXHRcdFx0XHR2YXIgbmFtZSA9IHBbcC5sZW5ndGggLSAxXS50cmltKCk7XHJcblx0XHRcdFx0aWYgKGF0dHJpYnV0ZXMuaW5kZXhPZihuYW1lKSA9PSAtMSlcclxuXHRcdFx0XHRcdGF0dHJpYnV0ZXMucHVzaCh7bmFtZTogbmFtZX0pO1xyXG5cdFx0XHR9ZWxzZSBpZiAobGluZS5pbmRleE9mKFwidW5pZm9ybSBcIikgPT0gMCl7XHJcblx0XHRcdFx0c3QgPSBudWxsO1xyXG5cdFx0XHRcdGlmIChsaW5lLmluZGV4T2YoXCJbXCIpICE9IC0xKXtcclxuXHRcdFx0XHRcdHVuaWZvcm1zQXJyYXlzLnB1c2gobGluZSk7XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtIDFdLnRyaW0oKTtcclxuXHRcdFx0XHRpZiAodW5pZm9ybXNOYW1lcy5pbmRleE9mKG5hbWUpID09IC0xKXtcclxuXHRcdFx0XHRcdHVuaWZvcm1zLnB1c2goe25hbWU6IG5hbWV9KTtcclxuXHRcdFx0XHRcdHVuaWZvcm1zTmFtZXMucHVzaChuYW1lKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNlIGlmIChsaW5lLmluZGV4T2YoXCJzdHJ1Y3RcIikgIT0gLTEpe1xyXG5cdFx0XHRcdHN0ID0geyBuYW1lOiBsaW5lLnJlcGxhY2UoXCJzdHJ1Y3QgXCIsIFwiXCIpLCBkYXRhOiBbXSB9O1xyXG5cdFx0XHRcdHN0cnVjdHMucHVzaChzdCk7XHJcblx0XHRcdH1lbHNlIGlmIChzdCAhPSBudWxsKXtcclxuXHRcdFx0XHRpZiAobGluZS50cmltKCkgPT0gXCJcIikgY29udGludWU7XHJcblx0XHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtMV0udHJpbSgpO1xyXG5cdFx0XHRcdHN0LmRhdGEucHVzaChuYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTAsbGVuPXVuaWZvcm1zQXJyYXlzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0XHR2YXIgbGluZSA9IHVuaWZvcm1zQXJyYXlzW2ldO1xyXG5cdFx0XHR2YXIgcCA9IGxpbmUuc3BsaXQoLyAvZyk7XHJcblx0XHRcdHZhciB0eXBlID0gcFtwLmxlbmd0aCAtIDJdLnRyaW0oKTtcclxuXHRcdFx0dmFyIG5hbWUgPSBwW3AubGVuZ3RoIC0gMV0udHJpbSgpO1xyXG5cdFx0XHR2YXIgdW5pTGVuID0gcGFyc2VJbnQobmFtZS5zdWJzdHJpbmcobmFtZS5pbmRleE9mKFwiW1wiKSArIDEsIG5hbWUuaW5kZXhPZihcIl1cIikpLCAxMCk7XHJcblx0XHRcdHZhciBuYW1lID0gbmFtZS5zdWJzdHJpbmcoMCwgbmFtZS5pbmRleE9mKFwiW1wiKSk7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgc3RyID0gbnVsbDtcclxuXHRcdFx0Zm9yICh2YXIgaj0wLGpsZW49c3RydWN0cy5sZW5ndGg7ajxqbGVuO2orKyl7XHJcblx0XHRcdFx0aWYgKHN0cnVjdHNbal0ubmFtZSA9PSB0eXBlKXtcclxuXHRcdFx0XHRcdHN0ciA9IHN0cnVjdHNbal07XHJcblx0XHRcdFx0XHRqID0gamxlbjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGlmIChzdHIpe1xyXG5cdFx0XHRcdHZhciBzdHJ1Y3RVbmkgPSBbXTtcclxuXHRcdFx0XHRmb3IgKHZhciBqPTA7ajx1bmlMZW47aisrKXtcclxuXHRcdFx0XHRcdHN0cnVjdFVuaVtqXSA9ICh7bmFtZTogbmFtZSwgbGVuOiB1bmlMZW4sIGRhdGE6IFtdfSk7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBrPTAsa2xlbj1zdHIuZGF0YS5sZW5ndGg7azxrbGVuO2srKyl7XHJcblx0XHRcdFx0XHRcdHZhciBwcm9wID0gc3RyLmRhdGFba107XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRzdHJ1Y3RVbmlbal0uZGF0YS5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRuYW1lOiBwcm9wLFxyXG5cdFx0XHRcdFx0XHRcdGxvY05hbWU6IG5hbWUgKyBcIltcIiArIGogKyBcIl0uXCIgKyBwcm9wXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAodW5pZm9ybXNOYW1lcy5pbmRleE9mKG5hbWUpID09IC0xKXtcclxuXHRcdFx0XHRcdHVuaWZvcm1zLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRtdWx0aTogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0ZGF0YTogc3RydWN0VW5pLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiB0eXBlXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHVuaWZvcm1zTmFtZXMucHVzaChuYW1lKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGZvciAodmFyIGo9MDtqPHVuaUxlbjtqKyspe1xyXG5cdFx0XHRcdFx0aWYgKHVuaWZvcm1zTmFtZXMuaW5kZXhPZihuYW1lKSA9PSAtMSl7XHJcblx0XHRcdFx0XHRcdHVuaWZvcm1zLnB1c2goe25hbWU6IG5hbWUgKyBcIltcIiArIGogKyBcIl1cIiwgdHlwZTogbmFtZSB9KTtcclxuXHRcdFx0XHRcdFx0dW5pZm9ybXNOYW1lcy5wdXNoKG5hbWUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxyXG5cdFx0XHR1bmlmb3JtczogdW5pZm9ybXNcclxuXHRcdH07XHJcblx0fSxcclxuXHRcclxuXHRwcm9jZXNzU2hhZGVyOiBmdW5jdGlvbihzaGFkZXIpe1xyXG5cdFx0dmFyIGdsID0gdGhpcy5nbDtcclxuXHRcdFxyXG5cdFx0dmFyIHZDb2RlID0gc2hhZGVyLnZlcnRleFNoYWRlcjtcclxuXHRcdHZhciB2U2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLlZFUlRFWF9TSEFERVIpO1xyXG5cdFx0Z2wuc2hhZGVyU291cmNlKHZTaGFkZXIsIHZDb2RlKTtcclxuXHRcdGdsLmNvbXBpbGVTaGFkZXIodlNoYWRlcik7XHJcblx0XHRcclxuXHRcdHZhciBmQ29kZSA9IHNoYWRlci5mcmFnbWVudFNoYWRlcjtcclxuXHRcdHZhciBmU2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLkZSQUdNRU5UX1NIQURFUik7XHJcblx0XHRnbC5zaGFkZXJTb3VyY2UoZlNoYWRlciwgZkNvZGUpO1xyXG5cdFx0Z2wuY29tcGlsZVNoYWRlcihmU2hhZGVyKTtcclxuXHRcdFxyXG5cdFx0dmFyIHNoYWRlclByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XHJcblx0XHRnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgdlNoYWRlcik7XHJcblx0XHRnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgZlNoYWRlcik7XHJcblx0XHRnbC5saW5rUHJvZ3JhbShzaGFkZXJQcm9ncmFtKTtcclxuXHRcdFxyXG5cdFx0dmFyIHBhcmFtcyA9IHRoaXMuZ2V0U2hhZGVyQXR0cmlidXRlc0FuZFVuaWZvcm1zKHZDb2RlLnNwbGl0KC9bO3t9XSsvKSwgZkNvZGUuc3BsaXQoL1s7e31dKy8pKTtcclxuXHRcdFxyXG5cdFx0aWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIodlNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKXtcclxuXHRcdFx0Y29uc29sZS5sb2coZ2wuZ2V0U2hhZGVySW5mb0xvZyh2U2hhZGVyKSk7XHJcblx0XHRcdHRocm93IFwiRXJyb3IgY29tcGlsaW5nIHZlcnRleCBzaGFkZXJcIjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoZlNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKXtcclxuXHRcdFx0Y29uc29sZS5sb2coZ2wuZ2V0U2hhZGVySW5mb0xvZyhmU2hhZGVyKSk7XHJcblx0XHRcdHRocm93IFwiRXJyb3IgY29tcGlsaW5nIHZlcnRleCBzaGFkZXJcIjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHNoYWRlclByb2dyYW0sIGdsLkxJTktfU1RBVFVTKSl7XHJcblx0XHRcdGNvbnNvbGUubG9nKGdsLmdldFByb2dyYW1JbmZvTG9nKHNoYWRlclByb2dyYW0pKTtcclxuXHRcdFx0dGhyb3cgXCJFcnJvciBpbml0aWFsaXppbmcgdGhlIHNoYWRlciBwcm9ncmFtXCI7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciBhdHRyaWJ1dGVzID0gW107XHJcblx0XHR0aGlzLm1heEF0dHJpYkxvY2F0aW9ucyA9IE1hdGgubWF4KHRoaXMubWF4QXR0cmliTG9jYXRpb25zLCBwYXJhbXMuYXR0cmlidXRlcy5sZW5ndGgpO1xyXG5cdFx0Zm9yICh2YXIgaT0wLGxlbj1wYXJhbXMuYXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdFx0dmFyIGF0dCA9IHBhcmFtcy5hdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHR2YXIgbG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBhdHQubmFtZSk7XHJcblx0XHRcdFxyXG5cdFx0XHRnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShsb2NhdGlvbik7XHJcblx0XHRcdFxyXG5cdFx0XHRhdHRyaWJ1dGVzLnB1c2goe1xyXG5cdFx0XHRcdG5hbWU6IGF0dC5uYW1lLFxyXG5cdFx0XHRcdGxvY2F0aW9uOiBsb2NhdGlvblxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIHVuaWZvcm1zID0gW107XHJcblx0XHRmb3IgKHZhciBpPTAsbGVuPXBhcmFtcy51bmlmb3Jtcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdFx0dmFyIHVuaSA9IHBhcmFtcy51bmlmb3Jtc1tpXTtcclxuXHRcdFx0aWYgKHVuaS5tdWx0aSl7XHJcblx0XHRcdFx0Zm9yICh2YXIgaj0wLGpsZW49dW5pLmRhdGEubGVuZ3RoO2o8amxlbjtqKyspe1xyXG5cdFx0XHRcdFx0dmFyIHVuaUQgPSB1bmkuZGF0YVtqXTtcclxuXHRcdFx0XHRcdGZvciAodmFyIGs9MCxrbGVuPXVuaUQuZGF0YS5sZW5ndGg7azxrbGVuO2srKyl7XHJcblx0XHRcdFx0XHRcdHZhciBkYXQgPSB1bmlELmRhdGFba107XHJcblx0XHRcdFx0XHRcdGRhdC5sb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBkYXQubG9jTmFtZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHVuaWZvcm1zLnB1c2godW5pKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dmFyIGxvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHNoYWRlclByb2dyYW0sIHVuaS5uYW1lKTtcclxuXHRcdFx0XHJcblx0XHRcdFx0dW5pZm9ybXMucHVzaCh7XHJcblx0XHRcdFx0XHRuYW1lOiB1bmkubmFtZSxcclxuXHRcdFx0XHRcdGxvY2F0aW9uOiBsb2NhdGlvbixcclxuXHRcdFx0XHRcdHR5cGU6ICh1bmkudHlwZSk/IHVuaS50eXBlIDogdW5pLm5hbWVcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRzaGFkZXJQcm9ncmFtOiBzaGFkZXJQcm9ncmFtLFxyXG5cdFx0XHRhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxyXG5cdFx0XHR1bmlmb3JtczogdW5pZm9ybXNcclxuXHRcdH07XHJcblx0fSxcclxuXHRcclxuXHRzd2l0Y2hQcm9ncmFtOiBmdW5jdGlvbihzaGFkZXIpe1xyXG5cdFx0aWYgKHRoaXMubGFzdFByb2dyYW0gPT09IHNoYWRlcikgcmV0dXJuO1xyXG5cdFx0dmFyIGdsID0gdGhpcy5nbDtcclxuXHRcdFxyXG5cdFx0dGhpcy5sYXN0UHJvZ3JhbSA9IHNoYWRlcjtcclxuXHRcdGdsLnVzZVByb2dyYW0oc2hhZGVyLnNoYWRlclByb2dyYW0pO1xyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLm1heEF0dHJpYkxvY2F0aW9ucztpKyspe1xyXG5cdFx0XHRpZiAoaSA8IHNoYWRlci5hdHRyaWJ1dGVzLmxlbmd0aCl7XHJcblx0XHRcdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoaSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheShpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0Z2V0SW1hZ2U6IGZ1bmN0aW9uKHNyYyl7XHJcblx0XHRmb3IgKHZhciBpPTAsbGVuPXRoaXMuaW1hZ2VzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0XHRpZiAodGhpcy5pbWFnZXNbaV0uc3JjID09IHNyYylcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5pbWFnZXNbaV0uaW1nO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcbn07XHJcblxyXG5cclxuIiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcblxyXG5mdW5jdGlvbiBNYXRlcmlhbChwYXJhbWV0ZXJzKXtcclxuXHR0aGlzLl9fa3RtYXRlcmlhbCA9IHRydWU7XHJcblx0XHJcblx0aWYgKCFwYXJhbWV0ZXJzKSBwYXJhbWV0ZXJzID0ge307XHJcblx0XHJcblx0dGhpcy50ZXh0dXJlTWFwID0gKHBhcmFtZXRlcnMudGV4dHVyZU1hcCk/IHBhcmFtZXRlcnMudGV4dHVyZU1hcCA6IG51bGw7XHJcblx0dGhpcy5jb2xvciA9IG5ldyBDb2xvcigocGFyYW1ldGVycy5jb2xvcik/IHBhcmFtZXRlcnMuY29sb3IgOiBDb2xvci5fV0hJVEUpO1xyXG5cdHRoaXMub3BhY2l0eSA9IChwYXJhbWV0ZXJzLm9wYWNpdHkpPyBwYXJhbWV0ZXJzLm9wYWNpdHkgOiAxLjA7XHJcblx0dGhpcy50cmFuc3BhcmVudCA9IChwYXJhbWV0ZXJzLnRyYW5zcGFyZW50KT8gcGFyYW1ldGVycy50cmFuc3BhcmVudCA6IGZhbHNlO1xyXG5cdHRoaXMuZHJhd0ZhY2VzID0gKHBhcmFtZXRlcnMuZHJhd0ZhY2VzKT8gcGFyYW1ldGVycy5kcmF3RmFjZXMgOiAnRlJPTlQnO1xyXG5cdHRoaXMuZHJhd0FzID0gKHBhcmFtZXRlcnMuZHJhd0FzKT8gcGFyYW1ldGVycy5kcmF3QXMgOiAnVFJJQU5HTEVTJztcclxuXHR0aGlzLnNoYWRlciA9IChwYXJhbWV0ZXJzLnNoYWRlcik/IHBhcmFtZXRlcnMuc2hhZGVyIDogbnVsbDtcclxuXHR0aGlzLnNlbmRBdHRyaWJEYXRhID0gKHBhcmFtZXRlcnMuc2VuZEF0dHJpYkRhdGEpPyBwYXJhbWV0ZXJzLnNlbmRBdHRyaWJEYXRhIDogbnVsbDtcclxuXHR0aGlzLnNlbmRVbmlmb3JtRGF0YSA9IChwYXJhbWV0ZXJzLnNlbmRVbmlmb3JtRGF0YSk/IHBhcmFtZXRlcnMuc2VuZFVuaWZvcm1EYXRhIDogbnVsbDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRlcmlhbDsiLCJ2YXIgTWF0ZXJpYWwgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWwnKTtcclxudmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxuXHJcbmZ1bmN0aW9uIE1hdGVyaWFsQmFzaWModGV4dHVyZU1hcCwgY29sb3Ipe1xyXG5cdHRoaXMuX19rdG1hdGVyaWFsID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgbWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoe1xyXG5cdFx0dGV4dHVyZU1hcDogdGV4dHVyZU1hcCxcclxuXHRcdGNvbG9yOiBjb2xvcixcclxuXHRcdHNoYWRlcjogS1Quc2hhZGVycy5iYXNpY1xyXG5cdH0pO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZU1hcCA9IG1hdGVyaWFsLnRleHR1cmVNYXA7XHJcblx0dGhpcy5jb2xvciA9IG1hdGVyaWFsLmNvbG9yO1xyXG5cdHRoaXMuc2hhZGVyID0gbWF0ZXJpYWwuc2hhZGVyO1xyXG5cdHRoaXMub3BhY2l0eSA9IG1hdGVyaWFsLm9wYWNpdHk7XHJcblx0dGhpcy5kcmF3RmFjZXMgPSBtYXRlcmlhbC5kcmF3RmFjZXM7XHJcblx0dGhpcy5kcmF3QXMgPSBtYXRlcmlhbC5kcmF3QXM7XHJcblx0dGhpcy50cmFuc3BhcmVudCA9IG1hdGVyaWFsLnRyYW5zcGFyZW50O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGVyaWFsQmFzaWM7XHJcblxyXG5NYXRlcmlhbEJhc2ljLnByb3RvdHlwZS5zZW5kQXR0cmliRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG5cdGZvciAodmFyIGk9MCxsZW49YXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBhdHQgPSBhdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4UG9zaXRpb25cIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleENvbG9yXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LmNvbG9yc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFUZXh0dXJlQ29vcmRcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS50ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdGVyaWFsQmFzaWMucHJvdG90eXBlLnNlbmRVbmlmb3JtRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIHRyYW5zZm9ybWF0aW9uTWF0cml4O1xyXG5cdHZhciB1bmlmb3JtcyA9IHRoaXMuc2hhZGVyLnVuaWZvcm1zO1xyXG5cdGZvciAodmFyIGk9MCxsZW49dW5pZm9ybXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgdW5pID0gdW5pZm9ybXNbaV07XHJcblx0XHRcclxuXHRcdGlmICh1bmkubmFtZSA9PSAndU1WUE1hdHJpeCcpe1xyXG5cdFx0XHR0cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG1lc2guZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKS5tdWx0aXBseShjYW1lcmEudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG5cdFx0XHR2YXIgbXZwID0gdHJhbnNmb3JtYXRpb25NYXRyaXguY2xvbmUoKS5tdWx0aXBseShjYW1lcmEucGVyc3BlY3RpdmVNYXRyaXgpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG12cC50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1hdGVyaWFsQ29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gbWVzaC5tYXRlcmlhbC5jb2xvci5nZXRSR0JBKCk7XHJcblx0XHRcdGdsLnVuaWZvcm00ZnYodW5pLmxvY2F0aW9uLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9yKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlU2FtcGxlcicpe1xyXG5cdFx0XHRpZiAobWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwKTtcclxuXHRcdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAudGV4dHVyZSk7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUhhc1RleHR1cmUnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVSZXBlYXQnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm0yZih1bmkubG9jYXRpb24sIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5yZXBlYXQueCwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLnJlcGVhdC55KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUdlb21ldHJ5VVYnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm00Zih1bmkubG9jYXRpb24sIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueCwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi55LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLnosIG1lc2guZ2VvbWV0cnkudXZSZWdpb24udyk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlT2Zmc2V0JyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtMmYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAub2Zmc2V0LngsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5vZmZzZXQueSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4iLCJ2YXIgTWF0ZXJpYWwgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWwnKTtcclxuXHJcbmZ1bmN0aW9uIE1hdGVyaWFsTGFtYmVydCh0ZXh0dXJlTWFwLCBjb2xvciwgb3BhY2l0eSl7XHJcblx0dGhpcy5fX2t0bWF0ZXJpYWwgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBtYXRlcmlhbCA9IG5ldyBNYXRlcmlhbCh7XHJcblx0XHR0ZXh0dXJlTWFwOiB0ZXh0dXJlTWFwLFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdFx0b3BhY2l0eTogb3BhY2l0eSxcclxuXHRcdHNoYWRlcjogS1Quc2hhZGVycy5sYW1iZXJ0XHJcblx0fSk7XHJcblx0XHJcblx0dGhpcy50ZXh0dXJlTWFwID0gbWF0ZXJpYWwudGV4dHVyZU1hcDtcclxuXHR0aGlzLmNvbG9yID0gbWF0ZXJpYWwuY29sb3I7XHJcblx0dGhpcy5zaGFkZXIgPSBtYXRlcmlhbC5zaGFkZXI7XHJcblx0dGhpcy5vcGFjaXR5ID0gbWF0ZXJpYWwub3BhY2l0eTtcclxuXHR0aGlzLmRyYXdGYWNlcyA9IG1hdGVyaWFsLmRyYXdGYWNlcztcclxuXHR0aGlzLmRyYXdBcyA9IG1hdGVyaWFsLmRyYXdBcztcclxuXHR0aGlzLnRyYW5zcGFyZW50ID0gbWF0ZXJpYWwudHJhbnNwYXJlbnQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0ZXJpYWxMYW1iZXJ0O1xyXG5cclxuTWF0ZXJpYWxMYW1iZXJ0LnByb3RvdHlwZS5zZW5kQXR0cmliRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG5cdGZvciAodmFyIGk9MCxsZW49YXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBhdHQgPSBhdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4UG9zaXRpb25cIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleENvbG9yXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LmNvbG9yc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFUZXh0dXJlQ29vcmRcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS50ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleE5vcm1hbFwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5Lm5vcm1hbHNCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkubm9ybWFsc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRlcmlhbExhbWJlcnQucHJvdG90eXBlLnNlbmRMaWdodFVuaWZvcm1EYXRhID0gZnVuY3Rpb24obGlnaHQsIHVuaWZvcm0pe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdGZvciAodmFyIGk9MCxsZW49dW5pZm9ybS5kYXRhLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIGRhdCA9IHVuaWZvcm0uZGF0YVtpXTtcclxuXHRcdFxyXG5cdFx0aWYgKGRhdC5uYW1lID09ICdwb3NpdGlvbicpe1xyXG5cdFx0XHRpZiAobGlnaHQuX19rdHBvaW50bGlnaHQgfHwgbGlnaHQuX19rdHNwb3RsaWdodCl7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgbGlnaHQucG9zaXRpb24ueCwgbGlnaHQucG9zaXRpb24ueSwgbGlnaHQucG9zaXRpb24ueik7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIDAuMCwgMC4wLCAwLjApO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ2RpcmVjdGlvbicpe1xyXG5cdFx0XHRpZiAobGlnaHQuX19rdGRpckxpZ2h0KXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCBsaWdodC5kaXJlY3Rpb24ueCwgbGlnaHQuZGlyZWN0aW9uLnksIGxpZ2h0LmRpcmVjdGlvbi56KTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgMC4wLCAwLjAsIDAuMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnc3BvdERpcmVjdGlvbicpe1xyXG5cdFx0XHRpZiAobGlnaHQuX19rdHNwb3RsaWdodCl7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgbGlnaHQuZGlyZWN0aW9uLngsIGxpZ2h0LmRpcmVjdGlvbi55LCBsaWdodC5kaXJlY3Rpb24ueik7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIDAuMCwgMC4wLCAwLjApO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ2NvbG9yJyl7XHJcblx0XHRcdHZhciBjb2xvciA9IGxpZ2h0LmNvbG9yLmdldFJHQigpO1xyXG5cdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdKTtcclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnaW50ZW5zaXR5Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIGxpZ2h0LmludGVuc2l0eSk7XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ291dGVyQW5nbGUnKXtcclxuXHRcdFx0aWYgKGxpZ2h0Ll9fa3RzcG90bGlnaHQpe1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIGxpZ2h0Lm91dGVyQW5nbGUpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWYoZGF0LmxvY2F0aW9uLCAwLjApO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ2lubmVyQW5nbGUnKXtcclxuXHRcdFx0aWYgKGxpZ2h0Ll9fa3RzcG90bGlnaHQpe1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIGxpZ2h0LmlubmVyQW5nbGUpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWYoZGF0LmxvY2F0aW9uLCAwLjApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuTWF0ZXJpYWxMYW1iZXJ0LnByb3RvdHlwZS5zZW5kVW5pZm9ybURhdGEgPSBmdW5jdGlvbihtZXNoLCBjYW1lcmEsIHNjZW5lKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHR2YXIgZ2VvbWV0cnkgPSBtZXNoLmdlb21ldHJ5O1xyXG5cdHZhciB0cmFuc2Zvcm1hdGlvbk1hdHJpeDtcclxuXHR2YXIgdW5pZm9ybXMgPSB0aGlzLnNoYWRlci51bmlmb3JtcztcclxuXHR2YXIgbW9kZWxUcmFuc2Zvcm1hdGlvbjtcclxuXHR2YXIgdXNlZExpZ2h0VW5pZm9ybSA9IG51bGw7XHJcblx0dmFyIGxpZ2h0c0NvdW50ID0gMDtcclxuXHRmb3IgKHZhciBpPTAsbGVuPXVuaWZvcm1zLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIHVuaSA9IHVuaWZvcm1zW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAodW5pLm11bHRpICYmIHVuaS50eXBlID09ICdMaWdodCcpe1xyXG5cdFx0XHRpZiAobGlnaHRzQ291bnQgPT0gdW5pLmRhdGEubGVuZ3RoKVxyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR2YXIgbGlnaHRzID0gc2NlbmUubGlnaHRzO1xyXG5cdFx0XHRmb3IgKHZhciBqPTAsamxlbj1saWdodHMubGVuZ3RoO2o8amxlbjtqKyspe1xyXG5cdFx0XHRcdHRoaXMuc2VuZExpZ2h0VW5pZm9ybURhdGEobGlnaHRzW2pdLCB1bmkuZGF0YVtsaWdodHNDb3VudCsrXSk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1WTWF0cml4Jyl7XHJcblx0XHRcdG1vZGVsVHJhbnNmb3JtYXRpb24gPSBtZXNoLmdldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblx0XHRcdHRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbW9kZWxUcmFuc2Zvcm1hdGlvbi5jbG9uZSgpLm11bHRpcGx5KGNhbWVyYS50cmFuc2Zvcm1hdGlvbk1hdHJpeCk7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgdHJhbnNmb3JtYXRpb25NYXRyaXgudG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VQTWF0cml4Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgY2FtZXJhLnBlcnNwZWN0aXZlTWF0cml4LnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TWF0ZXJpYWxDb2xvcicpe1xyXG5cdFx0XHR2YXIgY29sb3IgPSBtZXNoLm1hdGVyaWFsLmNvbG9yLmdldFJHQkEoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTRmdih1bmkubG9jYXRpb24sIG5ldyBGbG9hdDMyQXJyYXkoY29sb3IpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVTYW1wbGVyJyl7XHJcblx0XHRcdGlmIChtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRcdGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTApO1xyXG5cdFx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC50ZXh0dXJlKTtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1SGFzVGV4dHVyZScpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAobWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKT8gMSA6IDApO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VXNlTGlnaHRpbmcnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKHNjZW5lLnVzZUxpZ2h0aW5nKT8gMSA6IDApO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1Tm9ybWFsTWF0cml4Jyl7XHJcblx0XHRcdHZhciBub3JtYWxNYXRyaXggPSBtb2RlbFRyYW5zZm9ybWF0aW9uLnRvTWF0cml4MygpLmludmVyc2UoKS50b0Zsb2F0MzJBcnJheSgpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4M2Z2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG5vcm1hbE1hdHJpeCk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VNb2RlbE1hdHJpeCcpe1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG1vZGVsVHJhbnNmb3JtYXRpb24udG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VBbWJpZW50TGlnaHRDb2xvcicgJiYgc2NlbmUudXNlTGlnaHRpbmcgJiYgc2NlbmUuYW1iaWVudExpZ2h0KXtcclxuXHRcdFx0dmFyIGNvbG9yID0gc2NlbmUuYW1iaWVudExpZ2h0LmdldFJHQigpO1xyXG5cdFx0XHRnbC51bmlmb3JtM2YodW5pLmxvY2F0aW9uLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU9wYWNpdHknKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFmKHVuaS5sb2NhdGlvbiwgbWVzaC5tYXRlcmlhbC5vcGFjaXR5KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVSZXBlYXQnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm0yZih1bmkubG9jYXRpb24sIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5yZXBlYXQueCwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLnJlcGVhdC55KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUdlb21ldHJ5VVYnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm00Zih1bmkubG9jYXRpb24sIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueCwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi55LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLnosIG1lc2guZ2VvbWV0cnkudXZSZWdpb24udyk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlT2Zmc2V0JyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtMmYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAub2Zmc2V0LngsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5vZmZzZXQueSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VzZWRMaWdodHMnKXtcclxuXHRcdFx0dXNlZExpZ2h0VW5pZm9ybSA9IHVuaTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0aWYgKHVzZWRMaWdodFVuaWZvcm0pe1xyXG5cdFx0Z2wudW5pZm9ybTFpKHVzZWRMaWdodFVuaWZvcm0ubG9jYXRpb24sIGxpZ2h0c0NvdW50KTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07IiwidmFyIE1hdGVyaWFsID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsJyk7XHJcbnZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG5cclxuZnVuY3Rpb24gTWF0ZXJpYWxQaG9uZyh0ZXh0dXJlTWFwLCBjb2xvciwgb3BhY2l0eSl7XHJcblx0dGhpcy5fX2t0bWF0ZXJpYWwgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBtYXRlcmlhbCA9IG5ldyBNYXRlcmlhbCh7XHJcblx0XHR0ZXh0dXJlTWFwOiB0ZXh0dXJlTWFwLFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdFx0b3BhY2l0eTogb3BhY2l0eSxcclxuXHRcdHNoYWRlcjogS1Quc2hhZGVycy5waG9uZ1xyXG5cdH0pO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZU1hcCA9IG1hdGVyaWFsLnRleHR1cmVNYXA7XHJcblx0dGhpcy5zcGVjdWxhck1hcCA9IG51bGw7XHJcblx0XHJcblx0dGhpcy5jb2xvciA9IG1hdGVyaWFsLmNvbG9yO1xyXG5cdHRoaXMuc2hhZGVyID0gbWF0ZXJpYWwuc2hhZGVyO1xyXG5cdHRoaXMub3BhY2l0eSA9IG1hdGVyaWFsLm9wYWNpdHk7XHJcblx0dGhpcy5kcmF3RmFjZXMgPSBtYXRlcmlhbC5kcmF3RmFjZXM7XHJcblx0dGhpcy5kcmF3QXMgPSBtYXRlcmlhbC5kcmF3QXM7XHJcblx0dGhpcy5zcGVjdWxhckNvbG9yID0gbmV3IENvbG9yKENvbG9yLl9XSElURSk7XHJcblx0dGhpcy5zaGluaW5lc3MgPSAwLjA7XHJcblx0dGhpcy50cmFuc3BhcmVudCA9IG1hdGVyaWFsLnRyYW5zcGFyZW50O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGVyaWFsUGhvbmc7XHJcblxyXG5NYXRlcmlhbFBob25nLnByb3RvdHlwZS5zZW5kQXR0cmliRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG5cdGZvciAodmFyIGk9MCxsZW49YXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBhdHQgPSBhdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4UG9zaXRpb25cIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleENvbG9yXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LmNvbG9yc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFUZXh0dXJlQ29vcmRcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS50ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleE5vcm1hbFwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5Lm5vcm1hbHNCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkubm9ybWFsc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRlcmlhbFBob25nLnByb3RvdHlwZS5zZW5kTGlnaHRVbmlmb3JtRGF0YSA9IGZ1bmN0aW9uKGxpZ2h0LCB1bmlmb3JtLCBtb2RlbFRyYW5zZm9ybWF0aW9uKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRmb3IgKHZhciBpPTAsbGVuPXVuaWZvcm0uZGF0YS5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBkYXQgPSB1bmlmb3JtLmRhdGFbaV07XHJcblx0XHRcclxuXHRcdGlmIChkYXQubmFtZSA9PSAncG9zaXRpb24nKXtcclxuXHRcdFx0aWYgKGxpZ2h0Ll9fa3Rwb2ludGxpZ2h0IHx8IGxpZ2h0Ll9fa3RzcG90bGlnaHQpe1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIGxpZ2h0LnBvc2l0aW9uLngsIGxpZ2h0LnBvc2l0aW9uLnksIGxpZ2h0LnBvc2l0aW9uLnopO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCAwLjAsIDAuMCwgMC4wKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdkaXJlY3Rpb24nKXtcclxuXHRcdFx0aWYgKGxpZ2h0Ll9fa3RkaXJMaWdodCl7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgbGlnaHQuZGlyZWN0aW9uLngsIGxpZ2h0LmRpcmVjdGlvbi55LCBsaWdodC5kaXJlY3Rpb24ueik7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIDAuMCwgMC4wLCAwLjApO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ3Nwb3REaXJlY3Rpb24nKXtcclxuXHRcdFx0aWYgKGxpZ2h0Ll9fa3RzcG90bGlnaHQpe1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIGxpZ2h0LmRpcmVjdGlvbi54LCBsaWdodC5kaXJlY3Rpb24ueSwgbGlnaHQuZGlyZWN0aW9uLnopO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCAwLjAsIDAuMCwgMC4wKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdjb2xvcicpe1xyXG5cdFx0XHR2YXIgY29sb3IgPSBsaWdodC5jb2xvci5nZXRSR0IoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSk7XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ2ludGVuc2l0eScpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWYoZGF0LmxvY2F0aW9uLCBsaWdodC5pbnRlbnNpdHkpO1xyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdvdXRlckFuZ2xlJyl7XHJcblx0XHRcdGlmIChsaWdodC5fX2t0c3BvdGxpZ2h0KXtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWYoZGF0LmxvY2F0aW9uLCBsaWdodC5vdXRlckFuZ2xlKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFmKGRhdC5sb2NhdGlvbiwgMC4wKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdpbm5lckFuZ2xlJyl7XHJcblx0XHRcdGlmIChsaWdodC5fX2t0c3BvdGxpZ2h0KXtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWYoZGF0LmxvY2F0aW9uLCBsaWdodC5pbm5lckFuZ2xlKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFmKGRhdC5sb2NhdGlvbiwgMC4wKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdtdlByb2plY3Rpb24nKXtcclxuXHRcdFx0aWYgKGxpZ2h0Ll9fa3RzcG90bGlnaHQgJiYgbGlnaHQuY2FzdFNoYWRvdyl7XHJcblx0XHRcdFx0dmFyIG12cCA9IG1vZGVsVHJhbnNmb3JtYXRpb24uY2xvbmUoKVxyXG5cdFx0XHRcdFx0XHRcdC5tdWx0aXBseShsaWdodC5zaGFkb3dDYW0udHJhbnNmb3JtYXRpb25NYXRyaXgpXHJcblx0XHRcdFx0XHRcdFx0Lm11bHRpcGx5KGxpZ2h0LnNoYWRvd0NhbS5wZXJzcGVjdGl2ZU1hdHJpeClcclxuXHRcdFx0XHRcdFx0XHQubXVsdGlwbHkoS1QubGlnaHRORENNYXQpO1xyXG5cdFx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYoZGF0LmxvY2F0aW9uLCBmYWxzZSwgbXZwLnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KGRhdC5sb2NhdGlvbiwgZmFsc2UsIE1hdHJpeDQuZ2V0SWRlbnRpdHkoKS50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdjYXN0U2hhZG93Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xaShkYXQubG9jYXRpb24sIChsaWdodC5jYXN0U2hhZG93KT8gMSA6IDApO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbk1hdGVyaWFsUGhvbmcucHJvdG90eXBlLnNlbmRVbmlmb3JtRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIHRyYW5zZm9ybWF0aW9uTWF0cml4O1xyXG5cdHZhciB1bmlmb3JtcyA9IHRoaXMuc2hhZGVyLnVuaWZvcm1zO1xyXG5cdHZhciBtb2RlbFRyYW5zZm9ybWF0aW9uO1xyXG5cdHZhciBsaWdodHMgPSBzY2VuZS5saWdodHM7XHJcblx0dmFyIGxpZ2h0c0NvdW50ID0gMDtcclxuXHRcclxuXHR2YXIgdXNlZExpZ2h0VW5pZm9ybSA9IG51bGw7XHJcblx0dmFyIHNoYWRvd01hcHNVbmlmb3JtID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3Jtcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciB1bmkgPSB1bmlmb3Jtc1tpXTtcclxuXHRcdFxyXG5cdFx0aWYgKHVuaS5tdWx0aSAmJiB1bmkudHlwZSA9PSAnTGlnaHQnKXtcclxuXHRcdFx0aWYgKGxpZ2h0c0NvdW50ID09IHVuaS5kYXRhLmxlbmd0aClcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0Zm9yICh2YXIgaj0wLGpsZW49bGlnaHRzLmxlbmd0aDtqPGpsZW47aisrKXtcclxuXHRcdFx0XHR0aGlzLnNlbmRMaWdodFVuaWZvcm1EYXRhKGxpZ2h0c1tqXSwgdW5pLmRhdGFbbGlnaHRzQ291bnQrK10sIG1vZGVsVHJhbnNmb3JtYXRpb24pO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAodW5pLnR5cGUgPT0gJ3NoYWRvd01hcHMnKXtcclxuXHRcdFx0c2hhZG93TWFwc1VuaWZvcm0ucHVzaCh1bmkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TVZNYXRyaXgnKXtcclxuXHRcdFx0bW9kZWxUcmFuc2Zvcm1hdGlvbiA9IG1lc2guZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuXHRcdFx0dHJhbnNmb3JtYXRpb25NYXRyaXggPSBtb2RlbFRyYW5zZm9ybWF0aW9uLmNsb25lKCkubXVsdGlwbHkoY2FtZXJhLnRyYW5zZm9ybWF0aW9uTWF0cml4KTtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdih1bmkubG9jYXRpb24sIGZhbHNlLCB0cmFuc2Zvcm1hdGlvbk1hdHJpeC50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVBNYXRyaXgnKXtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdih1bmkubG9jYXRpb24sIGZhbHNlLCBjYW1lcmEucGVyc3BlY3RpdmVNYXRyaXgudG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VNYXRlcmlhbENvbG9yJyl7XHJcblx0XHRcdHZhciBjb2xvciA9IG1lc2gubWF0ZXJpYWwuY29sb3IuZ2V0UkdCQSgpO1xyXG5cdFx0XHRnbC51bmlmb3JtNGZ2KHVuaS5sb2NhdGlvbiwgbmV3IEZsb2F0MzJBcnJheShjb2xvcikpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VGV4dHVyZVNhbXBsZXInKXtcclxuXHRcdFx0aWYgKG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdFx0Z2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCk7XHJcblx0XHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLnRleHR1cmUpO1xyXG5cdFx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIDApO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VIYXNUZXh0dXJlJyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIChtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApPyAxIDogMCk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VVc2VMaWdodGluZycpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAoc2NlbmUudXNlTGlnaHRpbmcpPyAxIDogMCk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VSZWNlaXZlU2hhZG93Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIChtZXNoLnJlY2VpdmVTaGFkb3cpPyAxIDogMCk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VOb3JtYWxNYXRyaXgnKXtcclxuXHRcdFx0dmFyIG5vcm1hbE1hdHJpeCA9IG1vZGVsVHJhbnNmb3JtYXRpb24udG9NYXRyaXgzKCkuaW52ZXJzZSgpLnRvRmxvYXQzMkFycmF5KCk7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXgzZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgbm9ybWFsTWF0cml4KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1vZGVsTWF0cml4Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgbW9kZWxUcmFuc2Zvcm1hdGlvbi50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUNhbWVyYVBvc2l0aW9uJyl7XHJcblx0XHRcdGdsLnVuaWZvcm0zZih1bmkubG9jYXRpb24sIGNhbWVyYS5wb3NpdGlvbi54LCBjYW1lcmEucG9zaXRpb24ueSwgY2FtZXJhLnBvc2l0aW9uLnopO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1U3BlY3VsYXJDb2xvcicpe1xyXG5cdFx0XHR2YXIgY29sb3IgPSB0aGlzLnNwZWN1bGFyQ29sb3IuZ2V0UkdCKCk7XHJcblx0XHRcdGdsLnVuaWZvcm0zZih1bmkubG9jYXRpb24sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0pO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1U2hpbmluZXNzJyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZih1bmkubG9jYXRpb24sIHRoaXMuc2hpbmluZXNzKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUFtYmllbnRMaWdodENvbG9yJyAmJiBzY2VuZS51c2VMaWdodGluZyAmJiBzY2VuZS5hbWJpZW50TGlnaHQpe1xyXG5cdFx0XHR2YXIgY29sb3IgPSBzY2VuZS5hbWJpZW50TGlnaHQuZ2V0UkdCKCk7XHJcblx0XHRcdGdsLnVuaWZvcm0zZih1bmkubG9jYXRpb24sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0pO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1T3BhY2l0eScpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLm9wYWNpdHkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VGV4dHVyZVJlcGVhdCcgJiYgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0Z2wudW5pZm9ybTJmKHVuaS5sb2NhdGlvbiwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLnJlcGVhdC54LCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAucmVwZWF0LnkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1R2VvbWV0cnlVVicgJiYgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0Z2wudW5pZm9ybTRmKHVuaS5sb2NhdGlvbiwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi54LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLnksIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueiwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi53KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVPZmZzZXQnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm0yZih1bmkubG9jYXRpb24sIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5vZmZzZXQueCwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLm9mZnNldC55KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndXNlZExpZ2h0cycpe1xyXG5cdFx0XHR1c2VkTGlnaHRVbmlmb3JtID0gdW5pO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VXNlU3BlY3VsYXJNYXAnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKG1lc2gubWF0ZXJpYWwuc3BlY3VsYXJNYXApPyAxIDogMCk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VTcGVjdWxhck1hcFNhbXBsZXInKXtcclxuXHRcdFx0aWYgKG1lc2gubWF0ZXJpYWwuc3BlY3VsYXJNYXApe1xyXG5cdFx0XHRcdGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTEpO1xyXG5cdFx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG1lc2gubWF0ZXJpYWwuc3BlY3VsYXJNYXAudGV4dHVyZSk7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgMSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0aWYgKHVzZWRMaWdodFVuaWZvcm0pe1xyXG5cdFx0Z2wudW5pZm9ybTFpKHVzZWRMaWdodFVuaWZvcm0ubG9jYXRpb24sIGxpZ2h0c0NvdW50KTtcclxuXHR9XHJcblx0XHJcblx0aWYgKHNoYWRvd01hcHNVbmlmb3JtLmxlbmd0aCA+IDApe1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8bGlnaHRzQ291bnQ7aSsrKXtcclxuXHRcdFx0aWYgKCFsaWdodHNbaV0uY2FzdFNoYWRvdykgY29udGludWU7XHJcblx0XHRcdFxyXG5cdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUxMCArIGkpO1xyXG5cdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBsaWdodHNbaV0uc2hhZG93QnVmZmVyLnRleHR1cmUpO1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAxMCArIGkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRyYWREZWdSZWw6IE1hdGguUEkgLyAxODAsXHJcblx0XHJcblx0UElfMjogTWF0aC5QSSAvIDIsXHJcblx0UEk6IE1hdGguUEksXHJcblx0UEkzXzI6IE1hdGguUEkgKiAzIC8gMixcclxuXHRQSTI6IE1hdGguUEkgKiAyLFxyXG5cdFxyXG5cdGRlZ1RvUmFkOiBmdW5jdGlvbihkZWdyZWVzKXtcclxuXHRcdHJldHVybiBkZWdyZWVzICogdGhpcy5yYWREZWdSZWw7XHJcblx0fSxcclxuXHRcclxuXHRyYWRUb0RlZzogZnVuY3Rpb24ocmFkaWFucyl7XHJcblx0XHRyZXR1cm4gcmFkaWFucyAvIHRoaXMucmFkRGVnUmVsO1xyXG5cdH0sXHJcblx0XHJcblx0Z2V0MkRBbmdsZTogZnVuY3Rpb24oeDEsIHkxLCB4MiwgeTIpe1xyXG5cdFx0dmFyIHh4ID0gTWF0aC5hYnMoeDIgLSB4MSk7XHJcblx0XHR2YXIgeXkgPSBNYXRoLmFicyh5MiAtIHkxKTtcclxuXHRcdFxyXG5cdFx0dmFyIGFuZyA9IE1hdGguYXRhbjIoeXksIHh4KTtcclxuXHRcdFxyXG5cdFx0aWYgKHgyIDw9IHgxICYmIHkyIDw9IHkxKXtcclxuXHRcdFx0YW5nID0gdGhpcy5QSSAtIGFuZztcclxuXHRcdH1lbHNlIGlmICh4MiA8PSB4MSAmJiB5MiA+IHkxKXtcclxuXHRcdFx0YW5nID0gdGhpcy5QSSArIGFuZztcclxuXHRcdH1lbHNlIGlmICh4MiA+IHgxICYmIHkyID4geTEpe1xyXG5cdFx0XHRhbmcgPSB0aGlzLlBJMiAtIGFuZztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0YW5nID0gKGFuZyArIHRoaXMuUEkyKSAlIHRoaXMuUEkyO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gYW5nO1xyXG5cdH1cclxufTtcclxuIiwiZnVuY3Rpb24gTWF0cml4Mygpe1xyXG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDkpIHRocm93IFwiTWF0cml4IDMgbXVzdCByZWNlaXZlIDkgcGFyYW1ldGVyc1wiO1xyXG5cdFxyXG5cdHZhciBjID0gMDtcclxuXHRmb3IgKHZhciBpPTA7aTw5O2krPTMpe1xyXG5cdFx0dGhpc1tjXSA9IGFyZ3VtZW50c1tpXTtcclxuXHRcdHRoaXNbYyszXSA9IGFyZ3VtZW50c1tpKzFdO1xyXG5cdFx0dGhpc1tjKzZdID0gYXJndW1lbnRzW2krMl07XHJcblx0XHRcclxuXHRcdGMgKz0gMTtcclxuXHR9XHJcblx0XHJcblx0dGhpcy5fX2t0bXQzID0gdHJ1ZTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRyaXgzO1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUuZ2V0RGV0ZXJtaW5hbnQgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHR2YXIgZGV0ID0gKFRbMF0gKiBUWzRdICogVFs4XSkgKyAoVFsxXSAqIFRbNV0gKiBUWzZdKSArIChUWzJdICogVFszXSAqIFRbN10pXHJcblx0XHRcdC0gKFRbNl0gKiBUWzRdICogVFsyXSkgLSAoVFs3XSAqIFRbNV0gKiBUWzBdKSAtIChUWzhdICogVFszXSAqIFRbMV0pO1xyXG5cdFxyXG5cdHJldHVybiBkZXQ7XHJcbn07XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS5pbnZlcnNlID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgZGV0ID0gdGhpcy5nZXREZXRlcm1pbmFudCgpO1xyXG5cdGlmIChkZXQgPT0gMCkgcmV0dXJuIG51bGw7XHJcblx0XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHZhciBpbnYgPSBuZXcgTWF0cml4MyhcclxuXHRcdFRbNF0qVFs4XS1UWzVdKlRbN10sXHRUWzVdKlRbNl0tVFszXSpUWzhdLFx0VFszXSpUWzddLVRbNF0qVFs2XSxcclxuXHRcdFRbMl0qVFs3XS1UWzFdKlRbOF0sXHRUWzBdKlRbOF0tVFsyXSpUWzZdLFx0VFsxXSpUWzZdLVRbMF0qVFs3XSxcclxuXHRcdFRbMV0qVFs1XS1UWzJdKlRbNF0sXHRUWzJdKlRbM10tVFswXSpUWzVdLFx0VFswXSpUWzRdLVRbMV0qVFszXVxyXG5cdCk7XHJcblx0XHJcblx0aW52Lm11bHRpcGx5KDEgLyBkZXQpO1xyXG5cdHRoaXMuY29weShpbnYpO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihudW1iZXIpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRmb3IgKHZhciBpPTA7aTw5O2krKyl7XHJcblx0XHRUW2ldICo9IG51bWJlcjtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24obWF0cml4Myl7XHJcblx0aWYgKCFtYXRyaXgzLl9fa3RtdDMpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIG1hdHJpeDMgaW50byBhbm90aGVyXCI7XHJcblx0XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdGZvciAodmFyIGk9MDtpPDk7aSsrKXtcclxuXHRcdFRbaV0gPSBtYXRyaXgzW2ldO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLnRyYW5zcG9zZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHZhciB2YWx1ZXMgPSBbXHJcblx0XHRUWzBdLCBUWzNdLCBUWzZdLFxyXG5cdFx0VFsxXSwgVFs0XSwgVFs3XSxcclxuXHRcdFRbMl0sIFRbNV0sIFRbOF1cclxuXHRdO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPDk7aSsrKXtcclxuXHRcdFRbaV0gPSB2YWx1ZXNbaV07XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUudG9GbG9hdDMyQXJyYXkgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbXHJcblx0XHRUWzBdLCBUWzFdLCBUWzJdLFxyXG5cdFx0VFszXSwgVFs0XSwgVFs1XSxcclxuXHRcdFRbNl0sIFRbN10sIFRbOF1cclxuXHRdKTtcclxufTtcclxuIiwidmFyIE1hdHJpeDMgPSByZXF1aXJlKCcuL0tUTWF0cml4MycpO1xyXG5cclxuZnVuY3Rpb24gTWF0cml4NCgpe1xyXG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDE2KSB0aHJvdyBcIk1hdHJpeCA0IG11c3QgcmVjZWl2ZSAxNiBwYXJhbWV0ZXJzXCI7XHJcblx0XHJcblx0dmFyIGMgPSAwO1xyXG5cdGZvciAodmFyIGk9MDtpPDE2O2krPTQpe1xyXG5cdFx0dGhpc1tjXSA9IGFyZ3VtZW50c1tpXTtcclxuXHRcdHRoaXNbYys0XSA9IGFyZ3VtZW50c1tpKzFdO1xyXG5cdFx0dGhpc1tjKzhdID0gYXJndW1lbnRzW2krMl07XHJcblx0XHR0aGlzW2MrMTJdID0gYXJndW1lbnRzW2krM107XHJcblx0XHRcclxuXHRcdGMgKz0gMTtcclxuXHR9XHJcblx0XHJcblx0dGhpcy5fX2t0bTQgPSB0cnVlO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdHJpeDQ7XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5pZGVudGl0eSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIHBhcmFtcyA9IFtcclxuXHRcdDEsIDAsIDAsIDAsXHJcblx0XHQwLCAxLCAwLCAwLFxyXG5cdFx0MCwgMCwgMSwgMCxcclxuXHRcdDAsIDAsIDAsIDFcclxuXHRdO1xyXG5cdFxyXG5cdHZhciBjID0gMDtcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKz00KXtcclxuXHRcdHRoaXNbY10gPSBwYXJhbXNbaV07XHJcblx0XHR0aGlzW2MrNF0gPSBwYXJhbXNbaSsxXTtcclxuXHRcdHRoaXNbYys4XSA9IHBhcmFtc1tpKzJdO1xyXG5cdFx0dGhpc1tjKzEyXSA9IHBhcmFtc1tpKzNdO1xyXG5cdFx0XHJcblx0XHRjICs9IDE7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUubXVsdGlwbHlTY2FsYXIgPSBmdW5jdGlvbihudW1iZXIpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKyspe1xyXG5cdFx0VFtpXSAqPSBudW1iZXI7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihtYXRyaXg0KXtcclxuXHRpZiAobWF0cml4NC5fX2t0bTQpe1xyXG5cdFx0dmFyIEExID0gW3RoaXNbMF0sICB0aGlzWzFdLCAgdGhpc1syXSwgIHRoaXNbM11dO1xyXG5cdFx0dmFyIEEyID0gW3RoaXNbNF0sICB0aGlzWzVdLCAgdGhpc1s2XSwgIHRoaXNbN11dO1xyXG5cdFx0dmFyIEEzID0gW3RoaXNbOF0sICB0aGlzWzldLCAgdGhpc1sxMF0sIHRoaXNbMTFdXTtcclxuXHRcdHZhciBBNCA9IFt0aGlzWzEyXSwgdGhpc1sxM10sIHRoaXNbMTRdLCB0aGlzWzE1XV07XHJcblx0XHRcclxuXHRcdHZhciBCMSA9IFttYXRyaXg0WzBdLCBtYXRyaXg0WzRdLCBtYXRyaXg0WzhdLCAgbWF0cml4NFsxMl1dO1xyXG5cdFx0dmFyIEIyID0gW21hdHJpeDRbMV0sIG1hdHJpeDRbNV0sIG1hdHJpeDRbOV0sICBtYXRyaXg0WzEzXV07XHJcblx0XHR2YXIgQjMgPSBbbWF0cml4NFsyXSwgbWF0cml4NFs2XSwgbWF0cml4NFsxMF0sIG1hdHJpeDRbMTRdXTtcclxuXHRcdHZhciBCNCA9IFttYXRyaXg0WzNdLCBtYXRyaXg0WzddLCBtYXRyaXg0WzExXSwgbWF0cml4NFsxNV1dO1xyXG5cdFx0XHJcblx0XHR2YXIgZG90ID0gZnVuY3Rpb24oY29sLCByb3cpe1xyXG5cdFx0XHR2YXIgc3VtID0gMDtcclxuXHRcdFx0Zm9yICh2YXIgaj0wO2o8NDtqKyspeyBzdW0gKz0gcm93W2pdICogY29sW2pdOyB9XHJcblx0XHRcdHJldHVybiBzdW07XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHR0aGlzWzBdID0gZG90KEExLCBCMSk7ICAgdGhpc1sxXSA9IGRvdChBMSwgQjIpOyAgIHRoaXNbMl0gPSBkb3QoQTEsIEIzKTsgICB0aGlzWzNdID0gZG90KEExLCBCNCk7XHJcblx0XHR0aGlzWzRdID0gZG90KEEyLCBCMSk7ICAgdGhpc1s1XSA9IGRvdChBMiwgQjIpOyAgIHRoaXNbNl0gPSBkb3QoQTIsIEIzKTsgICB0aGlzWzddID0gZG90KEEyLCBCNCk7XHJcblx0XHR0aGlzWzhdID0gZG90KEEzLCBCMSk7ICAgdGhpc1s5XSA9IGRvdChBMywgQjIpOyAgIHRoaXNbMTBdID0gZG90KEEzLCBCMyk7ICB0aGlzWzExXSA9IGRvdChBMywgQjQpO1xyXG5cdFx0dGhpc1sxMl0gPSBkb3QoQTQsIEIxKTsgIHRoaXNbMTNdID0gZG90KEE0LCBCMik7ICB0aGlzWzE0XSA9IGRvdChBNCwgQjMpOyAgdGhpc1sxNV0gPSBkb3QoQTQsIEI0KTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fWVsc2UgaWYgKG1hdHJpeDQubGVuZ3RoID09IDQpe1xyXG5cdFx0dmFyIHJldCA9IFtdO1xyXG5cdFx0dmFyIGNvbCA9IG1hdHJpeDQ7XHJcblx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTw0O2krPTEpe1xyXG5cdFx0XHR2YXIgcm93ID0gW3RoaXNbaV0sIHRoaXNbaSs0XSwgdGhpc1tpKzhdLCB0aGlzW2krMTJdXTtcclxuXHRcdFx0dmFyIHN1bSA9IDA7XHJcblx0XHRcdFxyXG5cdFx0XHRmb3IgKHZhciBqPTA7ajw0O2orKyl7XHJcblx0XHRcdFx0c3VtICs9IHJvd1tqXSAqIGNvbFtqXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0LnB1c2goc3VtKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHJldDtcclxuXHR9ZWxzZXtcclxuXHRcdHRocm93IFwiSW52YWxpZCBjb25zdHJ1Y3RvclwiO1xyXG5cdH1cclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLnRyYW5zcG9zZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHZhciB2YWx1ZXMgPSBbXHJcblx0XHRUWzBdLCBUWzRdLCBUWzhdLCAgVFsxMl0sXHJcblx0XHRUWzFdLCBUWzVdLCBUWzldLCAgVFsxM10sXHJcblx0XHRUWzJdLCBUWzZdLCBUWzEwXSwgVFsxNF0sXHJcblx0XHRUWzNdLCBUWzddLCBUWzExXSwgVFsxNV0sXHJcblx0XTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKyspe1xyXG5cdFx0dGhpc1tpXSA9IHZhbHVlc1tpXTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24obWF0cml4NCl7XHJcblx0aWYgKCFtYXRyaXg0Ll9fa3RtNCkgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgTWF0cml4NCBpbnRvIHRoaXMgbWF0cml4XCI7XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSsrKXtcclxuXHRcdHRoaXNbaV0gPSBtYXRyaXg0W2ldO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0VFswXSwgVFs0XSwgVFs4XSwgIFRbMTJdLFxyXG5cdFx0VFsxXSwgVFs1XSwgVFs5XSwgIFRbMTNdLFxyXG5cdFx0VFsyXSwgVFs2XSwgVFsxMF0sIFRbMTRdLFxyXG5cdFx0VFszXSwgVFs3XSwgVFsxMV0sIFRbMTVdXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLnRvRmxvYXQzMkFycmF5ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG5cdFx0VFswXSwgVFsxXSwgVFsyXSwgIFRbM10sXHJcblx0XHRUWzRdLCBUWzVdLCBUWzZdLCAgVFs3XSxcclxuXHRcdFRbOF0sIFRbOV0sIFRbMTBdLCBUWzExXSxcclxuXHRcdFRbMTJdLCBUWzEzXSwgVFsxNF0sIFRbMTVdXHJcblx0XSk7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS50b01hdHJpeDMgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDMoXHJcblx0XHRUWzBdLCBUWzFdLCBUWzJdLFxyXG5cdFx0VFs0XSwgVFs1XSwgVFs2XSxcclxuXHRcdFRbOF0sIFRbOV0sIFRbMTBdXHJcblx0KTsgXHJcbn07XHJcblxyXG5NYXRyaXg0LmdldElkZW50aXR5ID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQxLCAwLCAwLCAwLFxyXG5cdFx0MCwgMSwgMCwgMCxcclxuXHRcdDAsIDAsIDEsIDAsXHJcblx0XHQwLCAwLCAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0WFJvdGF0aW9uID0gZnVuY3Rpb24ocmFkaWFucyl7XHJcblx0dmFyIEMgPSBNYXRoLmNvcyhyYWRpYW5zKTtcclxuXHR2YXIgUyA9IE1hdGguc2luKHJhZGlhbnMpO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdDEsICAwLCAgMCwgMCxcclxuXHRcdDAsICBDLCAgUywgMCxcclxuXHRcdDAsIC1TLCAgQywgMCxcclxuXHRcdDAsICAwLCAgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFlSb3RhdGlvbiA9IGZ1bmN0aW9uKHJhZGlhbnMpe1xyXG5cdHZhciBDID0gTWF0aC5jb3MocmFkaWFucyk7XHJcblx0dmFyIFMgPSBNYXRoLnNpbihyYWRpYW5zKTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQgQywgIDAsICBTLCAwLFxyXG5cdFx0IDAsICAxLCAgMCwgMCxcclxuXHRcdC1TLCAgMCwgIEMsIDAsXHJcblx0XHQgMCwgIDAsICAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0WlJvdGF0aW9uID0gZnVuY3Rpb24ocmFkaWFucyl7XHJcblx0dmFyIEMgPSBNYXRoLmNvcyhyYWRpYW5zKTtcclxuXHR2YXIgUyA9IE1hdGguc2luKHJhZGlhbnMpO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdCBDLCAgUywgMCwgMCxcclxuXHRcdC1TLCAgQywgMCwgMCxcclxuXHRcdCAwLCAgMCwgMSwgMCxcclxuXHRcdCAwLCAgMCwgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFRyYW5zbGF0aW9uID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSB0cmFuc2xhdGUgdG8gYSB2ZWN0b3IgM1wiO1xyXG5cdFxyXG5cdHZhciB4ID0gdmVjdG9yMy54O1xyXG5cdHZhciB5ID0gdmVjdG9yMy55O1xyXG5cdHZhciB6ID0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdDEsIDAsIDAsIHgsXHJcblx0XHQwLCAxLCAwLCB5LFxyXG5cdFx0MCwgMCwgMSwgeixcclxuXHRcdDAsIDAsIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRTY2FsZSA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgc2NhbGUgdG8gYSB2ZWN0b3IgM1wiO1xyXG5cdFxyXG5cdHZhciBzeCA9IHZlY3RvcjMueDtcclxuXHR2YXIgc3kgPSB2ZWN0b3IzLnk7XHJcblx0dmFyIHN6ID0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdHN4LCAgMCwgIDAsIDAsXHJcblx0XHQgMCwgc3ksICAwLCAwLFxyXG5cdFx0IDAsICAwLCBzeiwgMCxcclxuXHRcdCAwLCAgMCwgIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRUcmFuc2Zvcm1hdGlvbiA9IGZ1bmN0aW9uKHBvc2l0aW9uLCByb3RhdGlvbiwgc2NhbGUsIHN0YWNrKXtcclxuXHRpZiAoIXBvc2l0aW9uLl9fa3R2MykgdGhyb3cgXCJQb3NpdGlvbiBtdXN0IGJlIGEgVmVjdG9yM1wiO1xyXG5cdGlmICghcm90YXRpb24uX19rdHYzKSB0aHJvdyBcIlJvdGF0aW9uIG11c3QgYmUgYSBWZWN0b3IzXCI7XHJcblx0aWYgKHNjYWxlICYmICFzY2FsZS5fX2t0djMpIHRocm93IFwiU2NhbGUgbXVzdCBiZSBhIFZlY3RvcjNcIjtcclxuXHRpZiAoIXN0YWNrKSBzdGFjayA9ICdTUnhSeVJ6VCc7XHJcblx0XHJcblx0dmFyIHNzID0gKHN0YWNrLmluZGV4T2YoXCJTXCIpICE9IC0xKTtcclxuXHR2YXIgcnggPSAoc3RhY2suaW5kZXhPZihcIlJ4XCIpICE9IC0xKTtcclxuXHR2YXIgcnkgPSAoc3RhY2suaW5kZXhPZihcIlJ5XCIpICE9IC0xKTtcclxuXHR2YXIgcnogPSAoc3RhY2suaW5kZXhPZihcIlJ6XCIpICE9IC0xKTtcclxuXHR2YXIgdHQgPSAoc3RhY2suaW5kZXhPZihcIlRcIikgIT0gLTEpO1xyXG5cdFxyXG5cdHZhciBzY2FsZSA9IChzY2FsZSAmJiBzcyk/IE1hdHJpeDQuZ2V0U2NhbGUoc2NhbGUpIDogTWF0cml4NC5nZXRJZGVudGl0eSgpO1xyXG5cdFxyXG5cdHZhciByb3RhdGlvblggPSBNYXRyaXg0LmdldFhSb3RhdGlvbihyb3RhdGlvbi54KTtcclxuXHR2YXIgcm90YXRpb25ZID0gTWF0cml4NC5nZXRZUm90YXRpb24ocm90YXRpb24ueSk7XHJcblx0dmFyIHJvdGF0aW9uWiA9IE1hdHJpeDQuZ2V0WlJvdGF0aW9uKHJvdGF0aW9uLnopO1xyXG5cdFxyXG5cdHZhciB0cmFuc2xhdGlvbiA9IE1hdHJpeDQuZ2V0VHJhbnNsYXRpb24ocG9zaXRpb24pO1xyXG5cdFxyXG5cdHZhciBtYXRyaXg7XHJcblx0bWF0cml4ID0gc2NhbGU7XHJcblx0aWYgKHJ4KSBtYXRyaXgubXVsdGlwbHkocm90YXRpb25YKTtcclxuXHRpZiAocnkpIG1hdHJpeC5tdWx0aXBseShyb3RhdGlvblkpO1xyXG5cdGlmIChyeikgbWF0cml4Lm11bHRpcGx5KHJvdGF0aW9uWik7XHJcblx0aWYgKHR0KSBtYXRyaXgubXVsdGlwbHkodHJhbnNsYXRpb24pO1xyXG5cdFxyXG5cdHJldHVybiBtYXRyaXg7XHJcbn07XHJcbiIsInZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG5cclxuZnVuY3Rpb24gTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpe1xyXG5cdGlmICghZ2VvbWV0cnkuX19rdGdlb21ldHJ5KSB0aHJvdyBcIkdlb21ldHJ5IG11c3QgYmUgYSBLVEdlb21ldHJ5IGluc3RhbmNlXCI7XHJcblx0aWYgKCFtYXRlcmlhbC5fX2t0bWF0ZXJpYWwpIHRocm93IFwiTWF0ZXJpYWwgbXVzdCBiZSBhIEtUTWF0ZXJpYWwgaW5zdGFuY2VcIjtcclxuXHRcclxuXHR0aGlzLl9fa3RtZXNoID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLmdlb21ldHJ5ID0gZ2VvbWV0cnk7XHJcblx0dGhpcy5tYXRlcmlhbCA9IG1hdGVyaWFsO1xyXG5cdFxyXG5cdHRoaXMucGFyZW50ID0gbnVsbDtcclxuXHR0aGlzLnZpc2libGUgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMuY2FzdFNoYWRvdyA9IGZhbHNlO1xyXG5cdHRoaXMucmVjZWl2ZVNoYWRvdyA9IGZhbHNlO1xyXG5cdFxyXG5cdHRoaXMucG9zaXRpb24gPSBuZXcgVmVjdG9yMygwLCAwLCAwKTtcclxuXHR0aGlzLnJvdGF0aW9uID0gbmV3IFZlY3RvcjMoMCwgMCwgMCk7XHJcblx0dGhpcy5zY2FsZSA9IG5ldyBWZWN0b3IzKDEsIDEsIDEpO1xyXG5cdFxyXG5cdHRoaXMucHJldmlvdXNQb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uY2xvbmUoKTtcclxuXHR0aGlzLnByZXZpb3VzUm90YXRpb24gPSB0aGlzLnJvdGF0aW9uLmNsb25lKCk7XHJcblx0dGhpcy5wcmV2aW91c1NjYWxlID0gdGhpcy5zY2FsZS5jbG9uZSgpO1xyXG5cdFxyXG5cdHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBudWxsO1xyXG5cdHRoaXMudHJhbnNmb3JtYXRpb25TdGFjayA9ICdTUnhSeVJ6VCc7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVzaDtcclxuXHJcbk1lc2gucHJvdG90eXBlLmdldFRyYW5zZm9ybWF0aW9uTWF0cml4ID0gZnVuY3Rpb24oKXtcclxuXHRpZiAoIXRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggfHwgIXRoaXMucG9zaXRpb24uZXF1YWxzKHRoaXMucHJldmlvdXNQb3NpdGlvbikgfHwgIXRoaXMucm90YXRpb24uZXF1YWxzKHRoaXMucHJldmlvdXNSb3RhdGlvbikgfHwgIXRoaXMuc2NhbGUuZXF1YWxzKHRoaXMucHJldmlvdXNTY2FsZSkpe1xyXG5cdFx0dGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IE1hdHJpeDQuZ2V0VHJhbnNmb3JtYXRpb24odGhpcy5wb3NpdGlvbiwgdGhpcy5yb3RhdGlvbiwgdGhpcy5zY2FsZSwgdGhpcy50cmFuc2Zvcm1hdGlvblN0YWNrKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5wcmV2aW91c1Bvc2l0aW9uLmNvcHkodGhpcy5wb3NpdGlvbik7XHJcblx0XHR0aGlzLnByZXZpb3VzUm90YXRpb24uY29weSh0aGlzLnJvdGF0aW9uKTtcclxuXHRcdHRoaXMucHJldmlvdXNTY2FsZS5jb3B5KHRoaXMuc2NhbGUpO1xyXG5cdFx0XHJcblx0XHRpZiAodGhpcy5wYXJlbnQpe1xyXG5cdFx0XHR2YXIgbSA9IHRoaXMucGFyZW50LmdldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblx0XHRcdHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgubXVsdGlwbHkobSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LmNsb25lKCk7XHJcbn07XHJcbiIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgR2VvbWV0cnlHVUlUZXh0dXJlID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5R1VJVGV4dHVyZScpO1xyXG52YXIgVGV4dHVyZSA9IHJlcXVpcmUoJy4vS1RUZXh0dXJlJyk7XHJcbnZhciBNYXRlcmlhbEJhc2ljID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsQmFzaWMnKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG52YXIgTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcblxyXG5mdW5jdGlvbiBNZXNoU3ByaXRlKHdpZHRoLCBoZWlnaHQsIHRleHR1cmVTcmMpe1xyXG5cdHRoaXMuX19rdG1lc2ggPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IG51bGw7XHJcblx0aWYgKHRleHR1cmVTcmMpe1xyXG5cdFx0aWYgKHRleHR1cmVTcmMuX19rdHRleHR1cmUgfHwgdGV4dHVyZVNyYy5fX2t0dGV4dHVyZWZyYW1lYnVmZmVyKVxyXG5cdFx0XHR0aGlzLnRleHR1cmUgPSB0ZXh0dXJlU3JjO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHR0aGlzLnRleHR1cmUgPSBuZXcgVGV4dHVyZSh0ZXh0dXJlU3JjKTtcclxuXHR9XHJcblx0XHJcblx0dGhpcy5nZW9tZXRyeSA9IG5ldyBHZW9tZXRyeUdVSVRleHR1cmUod2lkdGgsIGhlaWdodCk7XHJcblx0dGhpcy5tYXRlcmlhbCA9IG5ldyBNYXRlcmlhbEJhc2ljKHRoaXMudGV4dHVyZSwgXCIjRkZGRkZGXCIpO1xyXG5cdHRoaXMubWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xyXG5cdFx0XHJcblx0dGhpcy5wYXJlbnQgPSBudWxsO1xyXG5cdHRoaXMudmlzaWJsZSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5jYXN0U2hhZG93ID0gZmFsc2U7XHJcblx0dGhpcy5yZWNlaXZlU2hhZG93ID0gZmFsc2U7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IG5ldyBWZWN0b3IzKDAuMCwgMC4wLCAwLjApO1xyXG5cdHRoaXMucm90YXRpb24gPSBuZXcgVmVjdG9yMygwLjAsIDAuMCwgMC4wKTtcclxuXHR0aGlzLnNjYWxlID0gbmV3IFZlY3RvcjMoMS4wLCAxLjAsIDEuMCk7XHJcblx0XHJcblx0dGhpcy5wcmV2aW91c1Bvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5jbG9uZSgpO1xyXG5cdHRoaXMucHJldmlvdXNSb3RhdGlvbiA9IHRoaXMucm90YXRpb24uY2xvbmUoKTtcclxuXHR0aGlzLnByZXZpb3VzU2NhbGUgPSB0aGlzLnNjYWxlLmNsb25lKCk7XHJcblx0XHJcblx0dGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG51bGw7XHJcblx0dGhpcy50cmFuc2Zvcm1hdGlvblN0YWNrID0gJ1NSelQnO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lc2hTcHJpdGU7XHJcblxyXG5NZXNoU3ByaXRlLnByb3RvdHlwZS5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCA9IGZ1bmN0aW9uKCl7XHJcblx0aWYgKCF0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4IHx8ICF0aGlzLnBvc2l0aW9uLmVxdWFscyh0aGlzLnByZXZpb3VzUG9zaXRpb24pIHx8ICF0aGlzLnJvdGF0aW9uLmVxdWFscyh0aGlzLnByZXZpb3VzUm90YXRpb24pIHx8ICF0aGlzLnNjYWxlLmVxdWFscyh0aGlzLnByZXZpb3VzU2NhbGUpKXtcclxuXHRcdHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBNYXRyaXg0LmdldFRyYW5zZm9ybWF0aW9uKHRoaXMucG9zaXRpb24sIHRoaXMucm90YXRpb24sIHRoaXMuc2NhbGUsIHRoaXMudHJhbnNmb3JtYXRpb25TdGFjayk7XHJcblx0XHRcclxuXHRcdHRoaXMucHJldmlvdXNQb3NpdGlvbi5jb3B5KHRoaXMucG9zaXRpb24pO1xyXG5cdFx0dGhpcy5wcmV2aW91c1JvdGF0aW9uLmNvcHkodGhpcy5yb3RhdGlvbik7XHJcblx0XHR0aGlzLnByZXZpb3VzU2NhbGUuY29weSh0aGlzLnNjYWxlKTtcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMucGFyZW50KXtcclxuXHRcdFx0dmFyIG0gPSB0aGlzLnBhcmVudC5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xyXG5cdFx0XHR0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4Lm11bHRpcGx5KG0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeC5jbG9uZSgpO1xyXG59OyIsInZhciBWZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL0tUSW5wdXQnKTtcclxudmFyIEtUTWF0aCA9IHJlcXVpcmUoJy4vS1RNYXRoJyk7XHJcblxyXG5mdW5jdGlvbiBPcmJpdEFuZFBhbih0YXJnZXQpe1xyXG5cdHRoaXMuX19rdENhbUN0cmxzID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLmNhbWVyYSA9IG51bGw7XHJcblx0dGhpcy5sYXN0RHJhZyA9IG51bGw7XHJcblx0dGhpcy5sYXN0UGFuID0gbnVsbDtcclxuXHR0aGlzLnRhcmdldCA9ICh0YXJnZXQpPyB0YXJnZXQgOiBuZXcgVmVjdG9yMygwLjAsIDAuMCwgMC4wKTtcclxuXHR0aGlzLmFuZ2xlID0gbmV3IFZlY3RvcjIoMC4wLCAwLjApO1xyXG5cdHRoaXMuem9vbSA9IDE7XHJcblx0dGhpcy5zZW5zaXRpdml0eSA9IG5ldyBWZWN0b3IyKDAuNSwgMC41KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPcmJpdEFuZFBhbjtcclxuXHJcbk9yYml0QW5kUGFuLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpe1xyXG5cdGlmICh0aGlzLmNhbWVyYS5sb2NrZWQpIHJldHVybjtcclxuXHRcclxuXHRpZiAoSW5wdXQuaXNXaGVlbE1vdmVkKElucHV0LnZNb3VzZS5XSEVFTFVQKSl7IHRoaXMuem9vbSAtPSAwLjM7IHRoaXMuc2V0Q2FtZXJhUG9zaXRpb24oKTsgfVxyXG5cdGVsc2UgaWYgKElucHV0LmlzV2hlZWxNb3ZlZChJbnB1dC52TW91c2UuV0hFRUxET1dOKSl7IHRoaXMuem9vbSArPSAwLjM7IHRoaXMuc2V0Q2FtZXJhUG9zaXRpb24oKTsgfVxyXG5cdFxyXG5cdGlmIChJbnB1dC5pc01vdXNlRG93bihJbnB1dC52TW91c2UuTEVGVCkpe1xyXG5cdFx0aWYgKHRoaXMubGFzdERyYWcgPT0gbnVsbCkgdGhpcy5sYXN0RHJhZyA9IElucHV0Ll9tb3VzZS5wb3NpdGlvbi5jbG9uZSgpO1xyXG5cdFx0XHJcblx0XHR2YXIgZHggPSBJbnB1dC5fbW91c2UucG9zaXRpb24ueCAtIHRoaXMubGFzdERyYWcueDtcclxuXHRcdHZhciBkeSA9IElucHV0Ll9tb3VzZS5wb3NpdGlvbi55IC0gdGhpcy5sYXN0RHJhZy55O1xyXG5cdFx0XHJcblx0XHRpZiAoZHggIT0gMC4wIHx8IGR5ICE9IDAuMCl7XHJcblx0XHRcdHRoaXMuYW5nbGUueCAtPSBLVE1hdGguZGVnVG9SYWQoZHggKiB0aGlzLnNlbnNpdGl2aXR5LngpO1xyXG5cdFx0XHR0aGlzLmFuZ2xlLnkgLT0gS1RNYXRoLmRlZ1RvUmFkKGR5ICogdGhpcy5zZW5zaXRpdml0eS55KTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuc2V0Q2FtZXJhUG9zaXRpb24oKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5sYXN0RHJhZy5jb3B5KElucHV0Ll9tb3VzZS5wb3NpdGlvbik7XHJcblx0fWVsc2V7XHJcblx0XHR0aGlzLmxhc3REcmFnID0gbnVsbDtcclxuXHR9XHJcblx0XHJcblx0aWYgKElucHV0LmlzTW91c2VEb3duKElucHV0LnZNb3VzZS5SSUdIVCkpe1xyXG5cdFx0aWYgKHRoaXMubGFzdFBhbiA9PSBudWxsKSB0aGlzLmxhc3RQYW4gPSBJbnB1dC5fbW91c2UucG9zaXRpb24uY2xvbmUoKTtcclxuXHRcdFxyXG5cdFx0dmFyIGR4ID0gSW5wdXQuX21vdXNlLnBvc2l0aW9uLnggLSB0aGlzLmxhc3RQYW4ueDtcclxuXHRcdHZhciBkeSA9IElucHV0Ll9tb3VzZS5wb3NpdGlvbi55IC0gdGhpcy5sYXN0UGFuLnk7XHJcblx0XHRcclxuXHRcdGlmIChkeCAhPSAwLjAgfHwgZHkgIT0gMC4wKXtcclxuXHRcdFx0dmFyIHRoZXRhID0gLXRoaXMuYW5nbGUueTtcclxuXHRcdFx0dmFyIGFuZyA9IC10aGlzLmFuZ2xlLnggLSBLVE1hdGguUElfMjtcclxuXHRcdFx0dmFyIGNvcyA9IE1hdGguY29zKGFuZyk7XHJcblx0XHRcdHZhciBzaW4gPSBNYXRoLnNpbihhbmcpO1xyXG5cdFx0XHR2YXIgY29zVCA9IE1hdGguY29zKHRoZXRhKTtcclxuXHRcdFx0dmFyIHNpblQgPSBNYXRoLnNpbih0aGV0YSk7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnRhcmdldC54IC09IGNvcyAqIGR4ICogdGhpcy5zZW5zaXRpdml0eS54IC8gMTA7XHJcblx0XHRcdHRoaXMudGFyZ2V0LnkgKz0gY29zVCAqIGR5ICogdGhpcy5zZW5zaXRpdml0eS55IC8gMTA7XHJcblx0XHRcdHRoaXMudGFyZ2V0LnogLT0gc2luICogZHggKiB0aGlzLnNlbnNpdGl2aXR5LnggLyAxMDtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuc2V0Q2FtZXJhUG9zaXRpb24oKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5sYXN0UGFuLmNvcHkoSW5wdXQuX21vdXNlLnBvc2l0aW9uKTtcclxuXHR9ZWxzZXtcclxuXHRcdHRoaXMubGFzdFBhbiA9IG51bGw7XHJcblx0fVxyXG59O1xyXG5cclxuT3JiaXRBbmRQYW4ucHJvdG90eXBlLnNldENhbWVyYVBvc2l0aW9uID0gZnVuY3Rpb24oKXtcclxuXHR0aGlzLmFuZ2xlLnggPSAodGhpcy5hbmdsZS54ICsgS1RNYXRoLlBJMikgJSBLVE1hdGguUEkyO1xyXG5cdHRoaXMuYW5nbGUueSA9ICh0aGlzLmFuZ2xlLnkgKyBLVE1hdGguUEkyKSAlIEtUTWF0aC5QSTI7XHJcblx0XHJcblx0aWYgKHRoaXMuYW5nbGUueSA8IEtUTWF0aC5QSSAmJiB0aGlzLmFuZ2xlLnkgPj0gS1RNYXRoLlBJXzIpIHRoaXMuYW5nbGUueSA9IEtUTWF0aC5kZWdUb1JhZCg4OS45KTtcclxuXHRpZiAodGhpcy5hbmdsZS55ID4gS1RNYXRoLlBJICYmIHRoaXMuYW5nbGUueSA8PSBLVE1hdGguUEkzXzIpIHRoaXMuYW5nbGUueSA9IEtUTWF0aC5kZWdUb1JhZCgyNzAuOSk7XHJcblx0aWYgKHRoaXMuem9vbSA8PSAwLjMpIHRoaXMuem9vbSA9IDAuMztcclxuXHRcclxuXHR2YXIgY29zVCA9IE1hdGguY29zKHRoaXMuYW5nbGUueSk7XHJcblx0dmFyIHNpblQgPSBNYXRoLnNpbih0aGlzLmFuZ2xlLnkpO1xyXG5cdFxyXG5cdHZhciB4ID0gdGhpcy50YXJnZXQueCArIE1hdGguY29zKHRoaXMuYW5nbGUueCkgKiBjb3NUICogdGhpcy56b29tO1xyXG5cdHZhciB5ID0gdGhpcy50YXJnZXQueSArIHNpblQgKiB0aGlzLnpvb207XHJcblx0dmFyIHogPSB0aGlzLnRhcmdldC56IC0gTWF0aC5zaW4odGhpcy5hbmdsZS54KSAqIGNvc1QgKiB0aGlzLnpvb207XHJcblx0XHJcblx0dGhpcy5jYW1lcmEucG9zaXRpb24uc2V0KHgsIHksIHopO1xyXG5cdHRoaXMuY2FtZXJhLmxvb2tBdCh0aGlzLnRhcmdldCk7XHJcbn07XHJcbiIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgTWF0ZXJpYWwgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWwnKTtcclxudmFyIE1hdGVyaWFsQmFzaWMgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWxCYXNpYycpO1xyXG5cclxuZnVuY3Rpb24gU2NlbmUocGFyYW1zKXtcclxuXHR0aGlzLl9fa3RzY2VuZSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5tZXNoZXMgPSBbXTtcclxuXHR0aGlzLmxpZ2h0cyA9IFtdO1xyXG5cdHRoaXMuc2hhZGluZ01vZGUgPSBbJ0JBU0lDJywgJ0xBTUJFUlQnXTtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy51c2VMaWdodGluZyA9IChwYXJhbXMudXNlTGlnaHRpbmcpPyB0cnVlIDogZmFsc2U7XHJcblx0dGhpcy5hbWJpZW50TGlnaHQgPSAocGFyYW1zLmFtYmllbnRMaWdodCk/IG5ldyBDb2xvcihwYXJhbXMuYW1iaWVudExpZ2h0KSA6IG51bGw7XHJcblx0XHJcblx0dGhpcy5zZXRTaGFkb3dNYXRlcmlhbCgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjZW5lO1xyXG5cclxuU2NlbmUucHJvdG90eXBlLnNldFNoYWRvd01hdGVyaWFsID0gZnVuY3Rpb24oKXtcclxuXHR0aGlzLnNoYWRvd01hcHBpbmcgPSBmYWxzZTtcclxuXHR0aGlzLnNoYWRvd01hdCA9IG5ldyBNYXRlcmlhbCh7XHJcblx0XHRzaGFkZXI6IEtULnNoYWRlcnMuZGVwdGgsXHJcblx0XHRzZW5kQXR0cmliRGF0YTogZnVuY3Rpb24obWVzaCwgY2FtZXJhLCBzY2VuZSl7XHJcblx0XHRcdHZhciBnbCA9IEtULmdsO1xyXG5cdFx0XHR2YXIgZ2VvbWV0cnkgPSBtZXNoLmdlb21ldHJ5O1xyXG5cdFx0XHR2YXIgYXR0cmlidXRlcyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcblx0XHRcdGZvciAodmFyIGk9MCxsZW49YXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdFx0XHR2YXIgYXR0ID0gYXR0cmlidXRlc1tpXTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4UG9zaXRpb25cIil7XHJcblx0XHRcdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyKTtcclxuXHRcdFx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0c2VuZFVuaWZvcm1EYXRhOiBmdW5jdGlvbihtZXNoLCBjYW1lcmEsIHNjZW5lKXtcclxuXHRcdFx0dmFyIGdsID0gS1QuZ2w7XHJcblx0XHRcdHZhciB1bmlmb3JtcyA9IHRoaXMuc2hhZGVyLnVuaWZvcm1zO1xyXG5cdFx0XHRmb3IgKHZhciBpPTAsbGVuPXVuaWZvcm1zLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0XHRcdHZhciB1bmkgPSB1bmlmb3Jtc1tpXTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAodW5pLm5hbWUgPT0gJ3VNVlBNYXRyaXgnKXtcclxuXHRcdFx0XHRcdHZhciBtdnAgPSBtZXNoLmdldFRyYW5zZm9ybWF0aW9uTWF0cml4KCkubXVsdGlwbHkoY2FtZXJhLnRyYW5zZm9ybWF0aW9uTWF0cml4KS5tdWx0aXBseShjYW1lcmEucGVyc3BlY3RpdmVNYXRyaXgpO1xyXG5cdFx0XHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdih1bmkubG9jYXRpb24sIGZhbHNlLCBtdnAudG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcbn07XHJcblxyXG5TY2VuZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24ob2JqZWN0KXtcclxuXHRpZiAob2JqZWN0Ll9fa3RtZXNoKXtcclxuXHRcdHRoaXMubWVzaGVzLnB1c2gob2JqZWN0KTtcclxuXHR9ZWxzZSBpZiAob2JqZWN0Ll9fa3RkaXJMaWdodCB8fCBvYmplY3QuX19rdHBvaW50bGlnaHQgfHwgb2JqZWN0Ll9fa3RzcG90bGlnaHQpe1xyXG5cdFx0dGhpcy5saWdodHMucHVzaChvYmplY3QpO1xyXG5cdH1lbHNle1xyXG5cdFx0dGhyb3cgXCJDYW4ndCBhZGQgdGhlIG9iamVjdCB0byB0aGUgc2NlbmVcIjtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5TY2VuZS5wcm90b3R5cGUuZHJhd01lc2ggPSBmdW5jdGlvbihtZXNoLCBjYW1lcmEpe1xyXG5cdGlmICghbWVzaC5nZW9tZXRyeS5yZWFkeSkgcmV0dXJuO1xyXG5cdGlmICh0aGlzLnNoYWRvd01hcHBpbmcgJiYgIW1lc2guY2FzdFNoYWRvdykgcmV0dXJuO1xyXG5cdFxyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdHZhciBtYXRlcmlhbCA9ICh0aGlzLnNoYWRvd01hcHBpbmcpPyB0aGlzLnNoYWRvd01hdCA6IG1lc2gubWF0ZXJpYWw7XHJcblx0dmFyIHNoYWRlciA9IG1hdGVyaWFsLnNoYWRlcjtcclxuXHRcclxuXHRLVC5zd2l0Y2hQcm9ncmFtKHNoYWRlcik7XHJcblx0dGhpcy5zZXRNYXRlcmlhbEF0dHJpYnV0ZXMobWVzaC5tYXRlcmlhbCk7XHJcblx0XHJcblx0bWF0ZXJpYWwuc2VuZEF0dHJpYkRhdGEobWVzaCwgY2FtZXJhLCB0aGlzKTtcclxuXHRtYXRlcmlhbC5zZW5kVW5pZm9ybURhdGEobWVzaCwgY2FtZXJhLCB0aGlzKTtcclxuXHRcclxuXHRnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBtZXNoLmdlb21ldHJ5LmZhY2VzQnVmZmVyKTtcclxuXHRnbC5kcmF3RWxlbWVudHMoZ2xbbWF0ZXJpYWwuZHJhd0FzXSwgbWVzaC5nZW9tZXRyeS5mYWNlc0J1ZmZlci5udW1JdGVtcywgZ2wuVU5TSUdORURfU0hPUlQsIDApO1xyXG59O1xyXG5cclxuU2NlbmUucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKXtcclxuXHRLVC5nbC5jbGVhcihLVC5nbC5DT0xPUl9CVUZGRVJfQklUIHwgS1QuZ2wuREVQVEhfQlVGRkVSX0JJVCk7XHJcbn07XHJcblxyXG5TY2VuZS5wcm90b3R5cGUucmVuZGVyVG9GcmFtZWJ1ZmZlciA9IGZ1bmN0aW9uKGNhbWVyYSwgZnJhbWVidWZmZXIpe1xyXG5cdGlmICghZnJhbWVidWZmZXIuX19rdHRleHR1cmVmcmFtZWJ1ZmZlcikgdGhyb3cgXCJmcmFtZWJ1ZmZlciBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIFRleHR1cmVGcmFtZWJ1ZmZlclwiO1xyXG5cdFxyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVidWZmZXIuZnJhbWVidWZmZXIpO1xyXG5cdGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcclxuXHRnbC5jbGVhckNvbG9yKDEuMCwgMS4wLCAxLjAsIDEuMCk7XHJcblx0Z2wudmlld3BvcnQoMCwwLGZyYW1lYnVmZmVyLndpZHRoLGZyYW1lYnVmZmVyLmhlaWdodCk7XHJcblx0dGhpcy5yZW5kZXIoY2FtZXJhKTtcclxuXHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xyXG5cdGdsLnZpZXdwb3J0KDAsMCxnbC53aWR0aCxnbC5oZWlnaHQpO1xyXG59O1xyXG5cclxuU2NlbmUucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdFxyXG5cdGlmICghdGhpcy5zaGFkb3dNYXBwaW5nKXtcclxuXHRcdGZvciAodmFyIGk9MCxsZW49dGhpcy5saWdodHMubGVuZ3RoLTE7aTw9bGVuO2krKyl7XHJcblx0XHRcdGlmICh0aGlzLmxpZ2h0c1tpXS5jYXN0U2hhZG93KXtcclxuXHRcdFx0XHR0aGlzLnNoYWRvd01hcHBpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdHRoaXMucmVuZGVyVG9GcmFtZWJ1ZmZlcih0aGlzLmxpZ2h0c1tpXS5zaGFkb3dDYW0sIHRoaXMubGlnaHRzW2ldLnNoYWRvd0J1ZmZlcik7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGlmIChpID09IGxlbil7XHJcblx0XHRcdFx0dGhpcy5zaGFkb3dNYXBwaW5nID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYgKGNhbWVyYS5jb250cm9scykgY2FtZXJhLmNvbnRyb2xzLnVwZGF0ZSgpO1xyXG5cdFxyXG5cdFx0aWYgKGNhbWVyYS5za3lib3gpe1xyXG5cdFx0XHR2YXIgc2t5ID0gY2FtZXJhLnNreWJveC5tZXNoZXM7XHJcblx0XHRcdGZvciAodmFyIGk9MCxsZW49c2t5Lmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0XHRcdHRoaXMuZHJhd01lc2goc2t5W2ldLCBjYW1lcmEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGdsLmRpc2FibGUoIGdsLkJMRU5EICk7IFxyXG5cdHZhciB0cmFuc3BhcmVudHMgPSBbXTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMubWVzaGVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIG1lc2ggPSB0aGlzLm1lc2hlc1tpXTtcclxuXHRcdGlmICghbWVzaC52aXNpYmxlKSBjb250aW51ZTtcclxuXHRcdGlmIChtZXNoLm1hdGVyaWFsLm9wYWNpdHkgPT0gMC4wKSBjb250aW51ZTtcclxuXHRcdFxyXG5cdFx0aWYgKG1lc2gubWF0ZXJpYWwub3BhY2l0eSAhPSAxLjAgfHwgbWVzaC5tYXRlcmlhbC50cmFuc3BhcmVudCl7XHJcblx0XHRcdHRyYW5zcGFyZW50cy5wdXNoKG1lc2gpO1xyXG5cdFx0XHRjb250aW51ZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5kcmF3TWVzaChtZXNoLCBjYW1lcmEpO1xyXG5cdH1cclxuXHRcclxuXHRnbC5lbmFibGUoIGdsLkJMRU5EICk7IFxyXG5cdGZvciAodmFyIGk9MCxsZW49dHJhbnNwYXJlbnRzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIG1lc2ggPSB0cmFuc3BhcmVudHNbaV07XHJcblx0XHR0aGlzLmRyYXdNZXNoKG1lc2gsIGNhbWVyYSk7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuXG5TY2VuZS5wcm90b3R5cGUuc2V0TWF0ZXJpYWxBdHRyaWJ1dGVzID0gZnVuY3Rpb24obWF0ZXJpYWwpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdHZhciBjdWxsID0gXCJCQUNLXCI7XHJcblx0aWYgKG1hdGVyaWFsLmRyYXdGYWNlcyA9PSAnQkFDSycpeyBjdWxsID0gXCJGUk9OVFwiOyB9XHJcblx0ZWxzZSBpZiAobWF0ZXJpYWwuZHJhd0ZhY2VzID09ICdCT1RIJyl7IGN1bGwgPSBcIlwiOyB9XHJcblx0XHJcblx0aWYgKGN1bGwgIT0gXCJcIil7XHJcblx0XHRnbC5lbmFibGUoZ2wuQ1VMTF9GQUNFKTtcclxuXHRcdGdsLmN1bGxGYWNlKGdsW2N1bGxdKTtcclxuXHR9ZWxzZXtcclxuXHRcdGdsLmRpc2FibGUoZ2wuQ1VMTF9GQUNFKTtcclxuXHR9XHJcbn07XHJcbiIsInZhciBzdHJ1Y3RzID0ge1xyXG5cdExpZ2h0OiBcInN0cnVjdCBMaWdodHsgXCIgK1xyXG5cdCAgICBcImxvd3AgdmVjMyBwb3NpdGlvbjsgXCIgK1xyXG5cdCAgICBcImxvd3AgdmVjMyBjb2xvcjsgXCIgK1xyXG5cdCAgICBcImxvd3AgdmVjMyBkaXJlY3Rpb247IFwiICtcclxuXHQgICAgXCJsb3dwIHZlYzMgc3BvdERpcmVjdGlvbjsgXCIgK1xyXG5cdCAgICBcImxvd3AgZmxvYXQgaW50ZW5zaXR5OyBcIiArXHJcblx0ICAgIFwibG93cCBmbG9hdCBpbm5lckFuZ2xlOyBcIiArXHJcblx0ICAgIFwibG93cCBmbG9hdCBvdXRlckFuZ2xlOyBcIiArXHJcblx0ICAgIFwiYm9vbCBjYXN0U2hhZG93OyBcIiArXHJcblx0ICAgIFwibWVkaXVtcCBtYXQ0IG12UHJvamVjdGlvbjsgXCIgK1xyXG5cdFwifTsgXCJcclxufTtcclxuXHJcbnZhciBmdW5jdGlvbnMgPSB7XHJcblx0Y2FsY1NoYWRvd0ZhY3RvciA6IFwibG93cCBmbG9hdCBjYWxjU2hhZG93RmFjdG9yKHNhbXBsZXIyRCBzaGFkb3dNYXAsIG1lZGl1bXAgdmVjNCBsaWdodFNwYWNlUG9zKXsgXCIgK1xyXG5cdFx0XCJpZiAoIXVSZWNlaXZlU2hhZG93KSBcIiArXHJcblx0XHRcdFwicmV0dXJuIDEuMDsgXCIgK1xyXG5cdCAgICBcIm1lZGl1bXAgdmVjMyBwcm9qQ29vcmRzID0gbGlnaHRTcGFjZVBvcy54eXogLyBsaWdodFNwYWNlUG9zLnc7IFwiICtcclxuXHQgICAgXCJtZWRpdW1wIHZlYzIgVVZDb29yZHM7IFwiICtcclxuXHQgICAgXCJVVkNvb3Jkcy54ID0gcHJvakNvb3Jkcy54OyBcIiArXHJcblx0ICAgIFwiVVZDb29yZHMueSA9IHByb2pDb29yZHMueTsgXCIgK1xyXG5cdCAgICBcIm1lZGl1bXAgZmxvYXQgeiA9IDEuMCAtICgxLjAgLSAocHJvakNvb3Jkcy56KSkgKiAyNS4wOyBcIiArXHJcblx0ICAgIFwibWVkaXVtcCB2ZWM0IHRleENvb3JkID0gdGV4dHVyZTJEKHNoYWRvd01hcCwgVVZDb29yZHMpOyBcIiArXHJcblx0ICAgIFwibWVkaXVtcCBmbG9hdCBkZXB0aCA9IHRleENvb3JkLng7IFwiICtcclxuXHQgICAgXCJpZiAoZGVwdGggPCAoeiAtIDAuMDA1KSkgXCIgK1xyXG5cdCAgICAgICAgXCJyZXR1cm4gMC41OyBcIiArIFxyXG5cdCAgICBcInJldHVybiAxLjA7IFwiICtcclxuXHRcIn0gXCJcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGJhc2ljOiB7XHJcblx0XHR2ZXJ0ZXhTaGFkZXI6IFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzIgYVRleHR1cmVDb29yZDsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleFBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFwiYXR0cmlidXRlIGxvd3AgdmVjNCBhVmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdU1WUE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWM0IHVNYXRlcmlhbENvbG9yOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZWZXJ0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIgKyAgXHJcblx0XHRcdFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgKyBcclxuXHRcdFx0XHRcImdsX1Bvc2l0aW9uID0gdU1WUE1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcdFwidlZlcnRleENvbG9yID0gYVZlcnRleENvbG9yICogdU1hdGVyaWFsQ29sb3I7IFwiICtcclxuXHRcdFx0XHRcInZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkOyBcIiArIFxyXG5cdFx0XHRcIn0gXCIgLFxyXG5cdFx0XHRcclxuXHRcdGZyYWdtZW50U2hhZGVyOiBcclxuXHRcdFx0XCJ1bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZVNhbXBsZXI7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdUhhc1RleHR1cmU7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMiB1VGV4dHVyZVJlcGVhdDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMyIHVUZXh0dXJlT2Zmc2V0OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzQgdUdlb21ldHJ5VVY7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICsgXHJcblx0XHRcdFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWM0IGNvbG9yID0gdlZlcnRleENvbG9yOyBcIiArIFxyXG5cdFx0XHRcdFwiaWYgKHVIYXNUZXh0dXJlKXsgXCIgKyBcclxuXHRcdFx0XHRcdFwibWVkaXVtcCBmbG9hdCB0eCA9IHVHZW9tZXRyeVVWLnggKyBtb2QodVRleHR1cmVPZmZzZXQueCArIHZUZXh0dXJlQ29vcmQucyAqIHVUZXh0dXJlUmVwZWF0LnggLSB1R2VvbWV0cnlVVi54LCB1R2VvbWV0cnlVVi56IC0gdUdlb21ldHJ5VVYueCk7XCIgK1xyXG5cdFx0XHRcdFx0XCJtZWRpdW1wIGZsb2F0IHR5ID0gdUdlb21ldHJ5VVYueSArIG1vZCh1VGV4dHVyZU9mZnNldC55ICsgdlRleHR1cmVDb29yZC50ICogdVRleHR1cmVSZXBlYXQueSAtIHVHZW9tZXRyeVVWLnksIHVHZW9tZXRyeVVWLncgLSB1R2VvbWV0cnlVVi55KTtcIiArXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFwibWVkaXVtcCB2ZWM0IHRleENvbG9yID0gdGV4dHVyZTJEKHVUZXh0dXJlU2FtcGxlciwgdmVjMih0eCwgdHkpKTsgXCIgK1xyXG5cdFx0XHRcdFx0XCJjb2xvciAqPSB0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwifSBcIiArIFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwiZ2xfRnJhZ0NvbG9yID0gY29sb3I7XCIgKyBcclxuXHRcdFx0XCJ9XCJcclxuXHR9LFxyXG5cdFxyXG5cdFxyXG5cdGxhbWJlcnQ6IHtcclxuXHRcdHZlcnRleFNoYWRlcjogXHJcblx0XHRcdFwic3RydWN0IExpZ2h0eyBcIiArXHJcblx0XHRcdCAgICBcImxvd3AgdmVjMyBwb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHQgICAgXCJsb3dwIHZlYzMgY29sb3I7IFwiICtcclxuXHRcdFx0ICAgIFwibG93cCB2ZWMzIGRpcmVjdGlvbjsgXCIgK1xyXG5cdFx0XHQgICAgXCJsb3dwIHZlYzMgc3BvdERpcmVjdGlvbjsgXCIgK1xyXG5cdFx0XHQgICAgXCJsb3dwIGZsb2F0IGludGVuc2l0eTsgXCIgK1xyXG5cdFx0XHQgICAgXCJsb3dwIGZsb2F0IGlubmVyQW5nbGU7IFwiICtcclxuXHRcdFx0ICAgIFwibG93cCBmbG9hdCBvdXRlckFuZ2xlOyBcIiArXHJcblx0XHRcdFwifTsgXCIgK1xyXG5cdFx0XHQgICAgXHJcblx0XHRcdFwidW5pZm9ybSBMaWdodCBsaWdodHNbOF07IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGludCB1c2VkTGlnaHRzOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzIgYVRleHR1cmVDb29yZDsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleFBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFwiYXR0cmlidXRlIGxvd3AgdmVjNCBhVmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjMyBhVmVydGV4Tm9ybWFsOyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdU1WTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdVBNYXRyaXg7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjNCB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVVzZUxpZ2h0aW5nOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdU1vZGVsTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDMgdU5vcm1hbE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMyB1QW1iaWVudExpZ2h0Q29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdlZlcnRleENvbG9yOyBcIiArXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDtcIiArICBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMyB2TGlnaHRXZWlnaHQ7IFwiICsgXHJcblx0XHRcdFxyXG5cdFx0XHRcIm1lZGl1bXAgdmVjMyBnZXRMaWdodFdlaWdodChtZWRpdW1wIHZlYzMgbm9ybWFsLCBtZWRpdW1wIHZlYzMgZGlyZWN0aW9uLCBsb3dwIHZlYzMgY29sb3IsIGxvd3AgZmxvYXQgaW50ZW5zaXR5KXsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCBmbG9hdCBsaWdodERvdCA9IG1heChkb3Qobm9ybWFsLCBkaXJlY3Rpb24pLCAwLjApOyBcIiArXHJcblx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgbGlnaHRXZWlnaHQgPSAoY29sb3IgKiBsaWdodERvdCAqIGludGVuc2l0eSk7IFwiICtcclxuXHRcdFx0XHRcInJldHVybiBsaWdodFdlaWdodDsgXCIgK1xyXG5cdFx0XHRcIn1cIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgKyBcclxuXHRcdFx0XHRcInZlYzQgbW9kZWxWaWV3UG9zaXRpb24gPSB1TVZNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTsgXCIgK1xyXG5cdFx0XHRcdFwiZ2xfUG9zaXRpb24gPSB1UE1hdHJpeCAqIG1vZGVsVmlld1Bvc2l0aW9uOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcdFwidkxpZ2h0V2VpZ2h0ID0gdUFtYmllbnRMaWdodENvbG9yOyBcIiArXHJcblx0XHRcdFx0XCJpZiAodVVzZUxpZ2h0aW5nKXsgXCIgK1xyXG5cdFx0XHRcdFx0XCJ2ZWMzIHZlcnRleE1vZGVsUG9zaXRpb24gPSAodU1vZGVsTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5ejsgXCIgK1xyXG5cdFx0XHRcdFx0XCJmb3IgKGludCBpPTA7aTw4O2krKyl7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJpZiAoaSA+PSB1c2VkTGlnaHRzKXtcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJicmVhazsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcIn1cIiArXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcIkxpZ2h0IGwgPSBsaWdodHNbaV07IFwiICtcclxuXHRcdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgbFBvcyA9IGwucG9zaXRpb24gLSB2ZXJ0ZXhNb2RlbFBvc2l0aW9uO1wiICtcclxuXHRcdFx0XHRcdFx0XCJtZWRpdW1wIGZsb2F0IGxEaXN0YW5jZSA9IGxlbmd0aChsUG9zKSAvIDIuMDsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcImlmIChsZW5ndGgobC5wb3NpdGlvbikgPT0gMC4wKXsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwibERpc3RhbmNlID0gMS4wOyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJsUG9zID0gdmVjMygwLjApOyBcIiArXHJcblx0XHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjMyBsaWdodERpcmVjdGlvbiA9IGwuZGlyZWN0aW9uICsgbm9ybWFsaXplKGxQb3MpOyBcIiArXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcImxvd3AgZmxvYXQgc3BvdFdlaWdodCA9IDEuMDsgXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICBcImlmIChsZW5ndGgobC5zcG90RGlyZWN0aW9uKSAhPSAwLjApeyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgICAgICBcImxvd3AgZmxvYXQgY29zQW5nbGUgPSBkb3QobC5zcG90RGlyZWN0aW9uLCBsaWdodERpcmVjdGlvbik7IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgXHRcInNwb3RXZWlnaHQgPSBjbGFtcCgoY29zQW5nbGUgLSBsLm91dGVyQW5nbGUpIC8gKGwuaW5uZXJBbmdsZSAtIGwub3V0ZXJBbmdsZSksIDAuMCwgMS4wKTsgXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgXCJsRGlzdGFuY2UgPSAxLjA7IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgXCJ9IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgXHJcblx0XHRcdFx0XHRcdFwidkxpZ2h0V2VpZ2h0ICs9IGdldExpZ2h0V2VpZ2h0KGFWZXJ0ZXhOb3JtYWwsIGxpZ2h0RGlyZWN0aW9uLCBsLmNvbG9yLCBsLmludGVuc2l0eSkgKiBzcG90V2VpZ2h0IC8gbERpc3RhbmNlOyBcIiArIFxyXG5cdFx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdCBcclxuXHRcdFx0XHRcInZWZXJ0ZXhDb2xvciA9IGFWZXJ0ZXhDb2xvciAqIHVNYXRlcmlhbENvbG9yOyBcIiArXHJcblx0XHRcdFx0XCJ2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDsgXCIgKyAgXHJcblx0XHRcdFwifSBcIiAsXHJcblx0XHRcdFxyXG5cdFx0ZnJhZ21lbnRTaGFkZXI6IFxyXG5cdFx0XHRcInVuaWZvcm0gc2FtcGxlcjJEIHVUZXh0dXJlU2FtcGxlcjsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gYm9vbCB1SGFzVGV4dHVyZTsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCBmbG9hdCB1T3BhY2l0eTsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMyIHVUZXh0dXJlUmVwZWF0OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzIgdVRleHR1cmVPZmZzZXQ7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgdmVjNCB1R2VvbWV0cnlVVjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMiB2VGV4dHVyZUNvb3JkOyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZWZXJ0ZXhDb2xvcjsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMyB2TGlnaHRXZWlnaHQ7IFwiICsgXHJcblx0XHRcdFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWM0IGNvbG9yID0gdlZlcnRleENvbG9yOyBcIiArIFxyXG5cdFx0XHRcdFwiaWYgKHVIYXNUZXh0dXJlKXsgXCIgKyBcclxuXHRcdFx0XHRcdFwibWVkaXVtcCBmbG9hdCB0eCA9IHVHZW9tZXRyeVVWLnggKyBtb2QodVRleHR1cmVPZmZzZXQueCArIHZUZXh0dXJlQ29vcmQucyAqIHVUZXh0dXJlUmVwZWF0LnggLSB1R2VvbWV0cnlVVi54LCB1R2VvbWV0cnlVVi56IC0gdUdlb21ldHJ5VVYueCk7XCIgK1xyXG5cdFx0XHRcdFx0XCJtZWRpdW1wIGZsb2F0IHR5ID0gdUdlb21ldHJ5VVYueSArIG1vZCh1VGV4dHVyZU9mZnNldC55ICsgdlRleHR1cmVDb29yZC50ICogdVRleHR1cmVSZXBlYXQueSAtIHVHZW9tZXRyeVVWLnksIHVHZW9tZXRyeVVWLncgLSB1R2VvbWV0cnlVVi55KTtcIiArXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFwibWVkaXVtcCB2ZWM0IHRleENvbG9yID0gdGV4dHVyZTJEKHVUZXh0dXJlU2FtcGxlciwgdmVjMih0eCwgdHkpKTsgXCIgK1xyXG5cdFx0XHRcdFx0XCJjb2xvciAqPSB0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwifSBcIiArIFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwiY29sb3IucmdiICo9IHZMaWdodFdlaWdodDsgXCIgKyBcclxuXHRcdFx0XHRcImdsX0ZyYWdDb2xvciA9IHZlYzQoY29sb3IucmdiLCBjb2xvci5hICogdU9wYWNpdHkpOyBcIiArIFxyXG5cdFx0XHRcIn1cIlxyXG5cdH0sXHJcblx0XHJcblx0XHJcblx0cGhvbmc6IHtcclxuXHRcdHZlcnRleFNoYWRlcjpcclxuXHRcdFx0c3RydWN0cy5MaWdodCArIFxyXG5cdFx0XHQgXHJcblx0XHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjMiBhVGV4dHVyZUNvb3JkOyBcIiArXHJcblx0XHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjMyBhVmVydGV4UG9zaXRpb247IFwiICtcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbG93cCB2ZWM0IGFWZXJ0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMzIGFWZXJ0ZXhOb3JtYWw7IFwiICsgXHJcblx0XHRcdFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIExpZ2h0IGxpZ2h0c1s4XTsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCBpbnQgdXNlZExpZ2h0czsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgbWF0NCB1TVZNYXRyaXg7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgbWF0NCB1UE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWM0IHVNYXRlcmlhbENvbG9yOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gYm9vbCB1VXNlTGlnaHRpbmc7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVJlY2VpdmVTaGFkb3c7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgbWF0NCB1TW9kZWxNYXRyaXg7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgbWF0MyB1Tm9ybWFsTWF0cml4OyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMzIHVBbWJpZW50TGlnaHRDb2xvcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMiB2VGV4dHVyZUNvb3JkO1wiICsgIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMzIHZMaWdodFdlaWdodDsgXCIgK1xyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMzIHZOb3JtYWw7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdlBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdkxpZ2h0UG9zaXRpb247IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidm9pZCBtYWluKHZvaWQpeyBcIiArIFxyXG5cdFx0XHRcdFwidmVjNCBtb2RlbFZpZXdQb3NpdGlvbiA9IHVNVk1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApOyBcIiArXHJcblx0XHRcdFx0XCJnbF9Qb3NpdGlvbiA9IHVQTWF0cml4ICogbW9kZWxWaWV3UG9zaXRpb247IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFx0XCJpZiAodVVzZUxpZ2h0aW5nKXsgXCIgKyBcclxuXHRcdFx0XHRcdFwidk5vcm1hbCA9IHVOb3JtYWxNYXRyaXggKiBhVmVydGV4Tm9ybWFsOyBcIiArXHJcblx0XHRcdFx0XHRcInZMaWdodFdlaWdodCA9IHVBbWJpZW50TGlnaHRDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcImZvciAoaW50IGk9MDtpPDg7aSsrKXsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcImlmIChpID49IHVzZWRMaWdodHMpIGJyZWFrOyBcIiArXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcImlmIChsaWdodHNbaV0uY2FzdFNoYWRvdyAmJiB1UmVjZWl2ZVNoYWRvdyl7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjNCBsaWdodFByb2ogPSBsaWdodHNbaV0ubXZQcm9qZWN0aW9uICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcInZMaWdodFBvc2l0aW9uID0gbGlnaHRQcm9qOyBcIiArXHJcblx0XHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdFwifWVsc2V7IFwiICtcclxuXHRcdFx0XHRcdFwidkxpZ2h0V2VpZ2h0ID0gdmVjMygxLjApOyBcIiArIFxyXG5cdFx0XHRcdFwifVwiICsgICBcclxuXHRcdFx0XHQgXHJcblx0XHRcdFx0XCJ2UG9zaXRpb24gPSAodU1vZGVsTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5ejsgXCIgK1xyXG5cdFx0XHRcdFwidlZlcnRleENvbG9yID0gYVZlcnRleENvbG9yICogdU1hdGVyaWFsQ29sb3I7IFwiICtcclxuXHRcdFx0XHRcInZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkOyBcIiArICBcclxuXHRcdFx0XCJ9IFwiICxcclxuXHRcdFx0XHJcblx0XHRmcmFnbWVudFNoYWRlcjogXHJcblx0XHRcdHN0cnVjdHMuTGlnaHQgKyBcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBMaWdodCBsaWdodHNbOF07IFwiICtcclxuXHRcdCAgICBcInVuaWZvcm0gc2FtcGxlcjJEIHNoYWRvd01hcHNbNF07IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgaW50IHVzZWRMaWdodHM7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVIYXNUZXh0dXJlOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBzYW1wbGVyMkQgdVRleHR1cmVTYW1wbGVyOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gYm9vbCB1VXNlU3BlY3VsYXJNYXA7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIHNhbXBsZXIyRCB1U3BlY3VsYXJNYXBTYW1wbGVyOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gYm9vbCB1VXNlTGlnaHRpbmc7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVJlY2VpdmVTaGFkb3c7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgZmxvYXQgdU9wYWNpdHk7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMiB1VGV4dHVyZVJlcGVhdDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMyIHVUZXh0dXJlT2Zmc2V0OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzQgdUdlb21ldHJ5VVY7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgdmVjMyB1Q2FtZXJhUG9zaXRpb247IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzMgdVNwZWN1bGFyQ29sb3I7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgZmxvYXQgdVNoaW5pbmVzczsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMiB2VGV4dHVyZUNvb3JkOyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZWZXJ0ZXhDb2xvcjsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMyB2TGlnaHRXZWlnaHQ7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdk5vcm1hbDsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMyB2UG9zaXRpb247IFwiICtcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2TGlnaHRQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJtZWRpdW1wIHZlYzMgZ2V0TGlnaHRXZWlnaHQobWVkaXVtcCB2ZWMzIG5vcm1hbCwgbWVkaXVtcCB2ZWMzIGRpcmVjdGlvbiwgbG93cCB2ZWMzIGNvbG9yLCBsb3dwIGZsb2F0IGludGVuc2l0eSl7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgbGlnaHREb3QgPSBtYXgoZG90KG5vcm1hbCwgZGlyZWN0aW9uKSwgMC4wKTsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGxpZ2h0V2VpZ2h0ID0gKGNvbG9yICogbGlnaHREb3QgKiBpbnRlbnNpdHkpOyBcIiArXHJcblx0XHRcdFx0XCJyZXR1cm4gbGlnaHRXZWlnaHQ7IFwiICtcclxuXHRcdFx0XCJ9XCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0ZnVuY3Rpb25zLmNhbGNTaGFkb3dGYWN0b3IgKyBcclxuXHRcdFx0XHJcblx0XHRcdFwidm9pZCBtYWluKHZvaWQpeyBcIiArXHJcblx0XHRcdFx0XCJtZWRpdW1wIHZlYzQgY29sb3IgPSB2VmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjMyBub3JtYWwgPSBub3JtYWxpemUodk5vcm1hbCk7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjMyBjYW1lcmFEaXJlY3Rpb24gPSBub3JtYWxpemUodUNhbWVyYVBvc2l0aW9uKTsgXCIgK1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwibWVkaXVtcCBmbG9hdCB0eDsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCBmbG9hdCB0eTsgXCIgK1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwiaWYgKHVIYXNUZXh0dXJlKXsgXCIgKyBcclxuXHRcdFx0XHRcdFwidHggPSB1R2VvbWV0cnlVVi54ICsgbW9kKHVUZXh0dXJlT2Zmc2V0LnggKyB2VGV4dHVyZUNvb3JkLnMgKiB1VGV4dHVyZVJlcGVhdC54IC0gdUdlb21ldHJ5VVYueCwgdUdlb21ldHJ5VVYueiAtIHVHZW9tZXRyeVVWLngpO1wiICtcclxuXHRcdFx0XHRcdFwidHkgPSB1R2VvbWV0cnlVVi55ICsgbW9kKHVUZXh0dXJlT2Zmc2V0LnkgKyB2VGV4dHVyZUNvb3JkLnQgKiB1VGV4dHVyZVJlcGVhdC55IC0gdUdlb21ldHJ5VVYueSwgdUdlb21ldHJ5VVYudyAtIHVHZW9tZXRyeVVWLnkpO1wiICtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzQgdGV4Q29sb3IgPSB0ZXh0dXJlMkQodVRleHR1cmVTYW1wbGVyLCB2ZWMyKHR4LCB0eSkpOyBcIiArXHJcblx0XHRcdFx0XHRcImNvbG9yICo9IHRleENvbG9yOyBcIiArXHJcblx0XHRcdFx0XCJ9IFwiICsgXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XCJtZWRpdW1wIGZsb2F0IHIgPSB0ZXh0dXJlMkQoc2hhZG93TWFwc1swXSwgdmVjMigwLjAsIDAuMCkpLnI7IFwiICtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjMyBwaG9uZ0xpZ2h0V2VpZ2h0ID0gdmVjMygwLjApOyBcIiArIFxyXG5cdFx0XHRcdFwiaWYgKHVVc2VMaWdodGluZyl7IFwiICtcclxuXHRcdFx0XHRcdFwiZm9yIChpbnQgaT0wO2k8ODtpKyspeyBcIiArXHJcblx0XHRcdFx0XHRcdFwiaWYgKGkgPj0gdXNlZExpZ2h0cyl7XCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwiYnJlYWs7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJ9XCIgK1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XCJMaWdodCBsID0gbGlnaHRzW2ldOyBcIiArXHJcblx0XHRcdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGxQb3MgPSBsLnBvc2l0aW9uIC0gdlBvc2l0aW9uO1wiICtcclxuXHRcdFx0XHRcdFx0XCJtZWRpdW1wIGZsb2F0IGxEaXN0YW5jZSA9IGxlbmd0aChsUG9zKSAvIDIuMDsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcImlmIChsZW5ndGgobC5wb3NpdGlvbikgPT0gMC4wKXsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwibERpc3RhbmNlID0gMS4wOyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJsUG9zID0gdmVjMygwLjApOyBcIiArXHJcblx0XHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGxpZ2h0RGlyZWN0aW9uID0gbC5kaXJlY3Rpb24gKyBub3JtYWxpemUobFBvcyk7IFwiICtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFwibG93cCBmbG9hdCBzcG90V2VpZ2h0ID0gMS4wOyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgIFwiaWYgKGxlbmd0aChsLnNwb3REaXJlY3Rpb24pICE9IDAuMCl7IFwiICtcclxuXHRcdFx0ICAgICAgICAgICAgICAgIFwibG93cCBmbG9hdCBjb3NBbmdsZSA9IGRvdChsLnNwb3REaXJlY3Rpb24sIGxpZ2h0RGlyZWN0aW9uKTsgXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICBcdFwic3BvdFdlaWdodCA9IGNsYW1wKChjb3NBbmdsZSAtIGwub3V0ZXJBbmdsZSkgLyAobC5pbm5lckFuZ2xlIC0gbC5vdXRlckFuZ2xlKSwgMC4wLCAxLjApOyBcIiArXHJcblx0XHRcdCAgICAgICAgICAgICAgICBcImxEaXN0YW5jZSA9IDEuMDsgXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICBcIn0gXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICBcclxuXHRcdFx0ICAgICAgICAgICAgXCJsb3dwIGZsb2F0IHNoYWRvd1dlaWdodCA9IDEuMDsgXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICBcImlmIChsLmNhc3RTaGFkb3cpXCIgK1xyXG5cdFx0XHQgICAgICAgICAgICBcdFwic2hhZG93V2VpZ2h0ID0gY2FsY1NoYWRvd0ZhY3RvcihzaGFkb3dNYXBzW2ldLCB2TGlnaHRQb3NpdGlvbik7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJwaG9uZ0xpZ2h0V2VpZ2h0ICs9IHNoYWRvd1dlaWdodCAqIGdldExpZ2h0V2VpZ2h0KG5vcm1hbCwgbGlnaHREaXJlY3Rpb24sIGwuY29sb3IsIGwuaW50ZW5zaXR5KSAqIHNwb3RXZWlnaHQgLyBsRGlzdGFuY2U7IFwiICsgXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcImlmIChzaGFkb3dXZWlnaHQgPT0gMS4wKXsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwibG93cCBmbG9hdCBzaGluaW5lc3MgPSB1U2hpbmluZXNzOyBcIiArIFxyXG5cdFx0XHRcdFx0XHRcdFwiaWYgKHVVc2VTcGVjdWxhck1hcCl7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcdFwic2hpbmluZXNzID0gdGV4dHVyZTJEKHVTcGVjdWxhck1hcFNhbXBsZXIsIHZlYzIodHgsIHR5KSkuciAqIDI1NS4wOyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRcImlmIChzaGluaW5lc3MgPiAwLjAgJiYgc2hpbmluZXNzIDwgMjU1LjApeyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjMyBoYWxmQW5nbGUgPSBub3JtYWxpemUoY2FtZXJhRGlyZWN0aW9uICsgbGlnaHREaXJlY3Rpb24pOyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgc3BlY0RvdCA9IG1heChkb3QoaGFsZkFuZ2xlLCBub3JtYWwpLCAwLjApOyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XHRcImNvbG9yICs9IHZlYzQodVNwZWN1bGFyQ29sb3IsIDEuMCkgKiBwb3coc3BlY0RvdCwgc2hpbmluZXNzKTsgXCIgKyBcclxuXHRcdFx0XHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdFx0XHRcIn1cIiArIFxyXG5cdFx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwiY29sb3IucmdiICo9IHZMaWdodFdlaWdodCArIHBob25nTGlnaHRXZWlnaHQ7IFwiICsgXHJcblx0XHRcdFx0XCJnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLnJnYiwgY29sb3IuYSAqIHVPcGFjaXR5KTsgXCIgKyBcclxuXHRcdFx0XCJ9XCJcclxuXHR9LFxyXG5cdFxyXG5cdGRlcHRoTWFwOiB7XHJcblx0XHR2ZXJ0ZXhTaGFkZXI6IFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleFBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVNVlBNYXRyaXg7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidm9pZCBtYWluKHZvaWQpeyBcIiArIFxyXG5cdFx0XHRcdFwiZ2xfUG9zaXRpb24gPSB1TVZQTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7IFwiICtcclxuXHRcdFx0XCJ9IFwiICxcclxuXHRcdFx0XHJcblx0XHRmcmFnbWVudFNoYWRlcjogXHJcblx0XHRcdFwidm9pZCBtYWluKHZvaWQpeyBcIiArXHJcblx0XHRcdCAgICBcImxvd3AgZmxvYXQgZGVwdGggPSAxLjAgLSAoMS4wIC0gZ2xfRnJhZ0Nvb3JkLnopICogMjUuMDsgXCIgK1xyXG5cdFx0XHQgICAgXCJnbF9GcmFnQ29sb3IgPSB2ZWM0KGRlcHRoLCBkZXB0aCwgZGVwdGgsIDEuMCk7IFwiICtcclxuXHRcdFx0XCJ9XCJcclxuXHR9XHJcbn07IiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxudmFyIFV0aWxzID0gcmVxdWlyZSgnLi9LVFV0aWxzJyk7XHJcbnZhciBWZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxuXHJcbmZ1bmN0aW9uIFRleHR1cmUoc3JjLCBwYXJhbXMpe1xyXG5cdHRoaXMuX19rdHRleHR1cmUgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHR0aGlzLm1pbkZpbHRlciA9IChwYXJhbXMubWluRmlsdGVyKT8gcGFyYW1zLm1pbkZpbHRlciA6IGdsLkxJTkVBUjtcclxuXHR0aGlzLm1hZ0ZpbHRlciA9IChwYXJhbXMubWFnRmlsdGVyKT8gcGFyYW1zLm1hZ0ZpbHRlciA6IGdsLkxJTkVBUjtcclxuXHR0aGlzLndyYXBTID0gKHBhcmFtcy5TV3JhcHBpbmcpPyBwYXJhbXMuU1dyYXBwaW5nIDogZ2wuUkVQRUFUO1xyXG5cdHRoaXMud3JhcFQgPSAocGFyYW1zLlRXcmFwcGluZyk/IHBhcmFtcy5UV3JhcHBpbmcgOiBnbC5SRVBFQVQ7XHJcblx0dGhpcy5yZXBlYXQgPSAocGFyYW1zLnJlcGVhdCk/IHBhcmFtcy5yZXBlYXQgOiBuZXcgVmVjdG9yMigxLjAsIDEuMCk7XHJcblx0dGhpcy5vZmZzZXQgPSAocGFyYW1zLm9mZnNldCk/IHBhcmFtcy5vZmZzZXQgOiBuZXcgVmVjdG9yMigwLjAsIDAuMCk7XHJcblx0dGhpcy5nZW5lcmF0ZU1pcG1hcCA9IChwYXJhbXMuZ2VuZXJhdGVNaXBtYXApPyB0cnVlIDogZmFsc2U7XHJcblx0XHJcblx0dGhpcy50ZXh0dXJlID0gbnVsbDtcclxuXHRcclxuXHR2YXIgaW1nID0gS1QuZ2V0SW1hZ2Uoc3JjKTtcclxuXHRpZiAoaW1nKXtcclxuXHRcdHRoaXMuaW1hZ2UgPSBpbWc7XHJcblx0XHR0aGlzLnBhcnNlVGV4dHVyZSgpO1xyXG5cdH1lbHNle1xyXG5cdFx0dGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0dGhpcy5pbWFnZS5zcmMgPSBzcmM7XHJcblx0XHR0aGlzLmltYWdlLnJlYWR5ID0gZmFsc2U7XHJcblx0XHRcclxuXHRcdHZhciBUID0gdGhpcztcclxuXHRcdFV0aWxzLmFkZEV2ZW50KHRoaXMuaW1hZ2UsIFwibG9hZFwiLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRLVC5pbWFnZXMucHVzaCh7c3JjOiBzcmMsIGltZzogVC5pbWFnZX0pO1xyXG5cdFx0XHRULnBhcnNlVGV4dHVyZSgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHR1cmU7XHJcblxyXG5UZXh0dXJlLnByb3RvdHlwZS5wYXJzZVRleHR1cmUgPSBmdW5jdGlvbigpe1xyXG5cdGlmICh0aGlzLmltYWdlLnJlYWR5KSByZXR1cm47XHJcblx0XHJcblx0dGhpcy5pbWFnZS5yZWFkeSA9IHRydWU7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0XHJcblx0dGhpcy50ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG5cdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSk7XHJcblx0XHJcblx0Z2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX0ZMSVBfWV9XRUJHTCwgdHJ1ZSk7XHJcblx0XHJcblx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCB0aGlzLmltYWdlKTtcclxuXHRcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgdGhpcy5tYWdGaWx0ZXIpO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCB0aGlzLm1pbkZpbHRlcik7XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgdGhpcy53cmFwUyk7XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgdGhpcy53cmFwVCk7XHJcblx0XHJcblx0aWYgKHRoaXMuZ2VuZXJhdGVNaXBtYXApXHJcblx0XHRnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcclxuXHRcclxuXHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcclxufTtcclxuXHJcblRleHR1cmUucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gbmV3IFRleHR1cmUodGhpcy5pbWFnZS5zcmMsIHRoaXMucGFyYW1zKTtcclxufTtcclxuIiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxudmFyIFZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG5cclxuZnVuY3Rpb24gVGV4dHVyZUZyYW1lYnVmZmVyKHdpZHRoLCBoZWlnaHQsIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0dGV4dHVyZWZyYW1lYnVmZmVyID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHR0aGlzLndpZHRoID0gd2lkdGg7XHJcblx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cdHRoaXMubWluRmlsdGVyID0gKHBhcmFtcy5taW5GaWx0ZXIpPyBwYXJhbXMubWluRmlsdGVyIDogZ2wuTElORUFSO1xyXG5cdHRoaXMubWFnRmlsdGVyID0gKHBhcmFtcy5tYWdGaWx0ZXIpPyBwYXJhbXMubWFnRmlsdGVyIDogZ2wuTElORUFSO1xyXG5cdHRoaXMud3JhcFMgPSAocGFyYW1zLlNXcmFwcGluZyk/IHBhcmFtcy5TV3JhcHBpbmcgOiBnbC5DTEFNUF9UT19FREdFO1xyXG5cdHRoaXMud3JhcFQgPSAocGFyYW1zLlRXcmFwcGluZyk/IHBhcmFtcy5UV3JhcHBpbmcgOiBnbC5DTEFNUF9UT19FREdFO1xyXG5cdHRoaXMucmVwZWF0ID0gKHBhcmFtcy5yZXBlYXQpPyBwYXJhbXMucmVwZWF0IDogbmV3IFZlY3RvcjIoMS4wLCAxLjApO1xyXG5cdHRoaXMub2Zmc2V0ID0gKHBhcmFtcy5vZmZzZXQpPyBwYXJhbXMub2Zmc2V0IDogbmV3IFZlY3RvcjIoMC4wLCAwLjApO1xyXG5cdHRoaXMuZ2VuZXJhdGVNaXBtYXAgPSAocGFyYW1zLmdlbmVyYXRlTWlwbWFwKT8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFxyXG5cdHRoaXMuZnJhbWVidWZmZXIgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xyXG5cdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgdGhpcy5mcmFtZWJ1ZmZlcik7XHJcblx0dGhpcy5mcmFtZWJ1ZmZlci53aWR0aCA9IHdpZHRoO1xyXG5cdHRoaXMuZnJhbWVidWZmZXIuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuXHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUpO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCB0aGlzLm1hZ0ZpbHRlcik7XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIHRoaXMubWluRmlsdGVyKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCB0aGlzLndyYXBTKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCB0aGlzLndyYXBUKTtcclxuXHRcclxuXHRpZiAodGhpcy5nZW5lcmF0ZU1pcG1hcClcclxuXHRcdGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xyXG5cdFx0XHJcblx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCB3aWR0aCwgaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBudWxsKTtcclxuXHRcclxuXHRcclxuXHR0aGlzLnJlbmRlckJ1ZmZlciA9IGdsLmNyZWF0ZVJlbmRlcmJ1ZmZlcigpO1xyXG5cdGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCB0aGlzLnJlbmRlckJ1ZmZlcik7XHJcblx0Z2wucmVuZGVyYnVmZmVyU3RvcmFnZShnbC5SRU5ERVJCVUZGRVIsIGdsLkRFUFRIX0NPTVBPTkVOVDE2LCB3aWR0aCwgaGVpZ2h0KTtcclxuXHRcclxuXHRnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSwgMCk7XHJcblx0Z2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGdsLkRFUFRIX0FUVEFDSE1FTlQsIGdsLlJFTkRFUkJVRkZFUiwgdGhpcy5yZW5kZXJCdWZmZXIpO1xyXG5cdFxyXG5cdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XHJcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XHJcblx0Z2wuYmluZFJlbmRlcmJ1ZmZlcihnbC5SRU5ERVJCVUZGRVIsIG51bGwpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHR1cmVGcmFtZWJ1ZmZlcjsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRnZXQ6IGZ1bmN0aW9uKGVsZW1lbnQpe1xyXG5cdFx0aWYgKGVsZW1lbnQuY2hhckF0KDApID09IFwiI1wiKXtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQucmVwbGFjZShcIiNcIiwgXCJcIikpO1xyXG5cdFx0fWVsc2UgaWYgKGVsZW1lbnQuY2hhckF0KDApID09IFwiLlwiKXtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoZWxlbWVudC5yZXBsYWNlKFwiLlwiLCBcIlwiKSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKGVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0YWRkRXZlbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIHR5cGUsIGNhbGxiYWNrKXtcclxuXHRcdGlmIChlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIpe1xyXG5cdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIGZhbHNlKTtcclxuXHRcdH1lbHNlIGlmIChlbGVtZW50LmF0dGFjaEV2ZW50KXtcclxuXHRcdFx0ZWxlbWVudC5hdHRhY2hFdmVudChcIm9uXCIgKyB0eXBlLCBjYWxsYmFjayk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRnZXRIdHRwOiBmdW5jdGlvbigpe1xyXG5cdFx0aWYgKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCl7XHJcblx0XHRcdHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdH1lbHNlIGlmICh3aW5kb3cuQWN0aXZlWE9iamVjdCl7XHJcblx0XHRcdGh0dHAgPSBuZXcgd2luZG93LkFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MSFRUUFwiKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fSxcclxuXHRcclxuXHRnZXRGaWxlQ29udGVudDogZnVuY3Rpb24oZmlsZVVSTCwgY2FsbGJhY2spe1xyXG5cdFx0dmFyIGh0dHAgPSB0aGlzLmdldEh0dHAoKTtcclxuXHRcdGh0dHAub3BlbignR0VUJywgZmlsZVVSTCwgdHJ1ZSk7XHJcblx0XHRodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG5cdCAgXHRcdGlmIChodHRwLnJlYWR5U3RhdGUgPT0gNCAmJiBodHRwLnN0YXR1cyA9PSAyMDApIHtcclxuXHRcdFx0XHRpZiAoY2FsbGJhY2spe1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soaHR0cC5yZXNwb25zZVRleHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdGh0dHAuc2VuZCgpO1xyXG5cdH1cclxufTtcclxuIiwiZnVuY3Rpb24gVmVjdG9yMih4LCB5KXtcclxuXHR0aGlzLl9fa3R2MiA9IHRydWU7XHJcblx0XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBWZWN0b3IyO1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XHJcblx0XHJcblx0cmV0dXJuIGxlbmd0aDtcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoKCk7XHJcblx0XHJcblx0dGhpcy54IC89IGxlbmd0aDtcclxuXHR0aGlzLnkgLz0gbGVuZ3RoO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24odmVjdG9yMil7XHJcblx0aWYgKCF2ZWN0b3IyLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBwZXJmb3JtIGEgZG90IHByb2R1Y3Qgd2l0aCBhIHZlY3RvcjJcIjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcy54ICogdmVjdG9yMi54ICsgdGhpcy55ICogdmVjdG9yMi55O1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuaW52ZXJ0ID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gdGhpcy5tdWx0aXBseSgtMSk7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uKG51bWJlcil7XHJcblx0dGhpcy54ICo9IG51bWJlcjtcclxuXHR0aGlzLnkgKj0gbnVtYmVyO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odmVjdG9yMil7XHJcblx0aWYgKCF2ZWN0b3IyLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBhZGQgYSB2ZWN0b3IyIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ICs9IHZlY3RvcjIueDtcclxuXHR0aGlzLnkgKz0gdmVjdG9yMi55O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKHZlY3RvcjIpe1xyXG5cdGlmICghdmVjdG9yMi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIHZlY3RvcjIgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHR0aGlzLnggPSB2ZWN0b3IyLng7XHJcblx0dGhpcy55ID0gdmVjdG9yMi55O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSl7XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiBuZXcgVmVjdG9yMih0aGlzLngsIHRoaXMueSk7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbih2ZWN0b3IyKXtcclxuXHRpZiAoIXZlY3RvcjIuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSB2ZWN0b3IyIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0cmV0dXJuICh0aGlzLnggPT0gdmVjdG9yMi54ICYmIHRoaXMueSA9PSB2ZWN0b3IyLnkpO1xyXG59O1xyXG5cclxuVmVjdG9yMi52ZWN0b3JzRGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHZlY3RvcjJfYSwgdmVjdG9yMl9iKXtcclxuXHRpZiAoIXZlY3RvcjJfYS5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczJcIjtcclxuXHRpZiAoIXZlY3RvcjJfYi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczJcIjtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjIodmVjdG9yMl9hLnggLSB2ZWN0b3IyX2IueCwgdmVjdG9yMl9hLnkgLSB2ZWN0b3IyX2IueSk7XHJcbn07XHJcblxyXG5WZWN0b3IyLmZyb21BbmdsZSA9IGZ1bmN0aW9uKHJhZGlhbil7XHJcblx0dmFyIHggPSBNYXRoLmNvcyhyYWRpYW4pO1xyXG5cdHZhciB5ID0gLU1hdGguc2luKHJhZGlhbik7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IyKHgsIHkpO1xyXG59O1xyXG4iLCJmdW5jdGlvbiBWZWN0b3IzKHgsIHksIHope1xyXG5cdHRoaXMuX19rdHYzID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnggPSB4O1xyXG5cdHRoaXMueSA9IHk7XHJcblx0dGhpcy56ID0gejtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yMztcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkgKyB0aGlzLnogKiB0aGlzLnopO1xyXG5cdFxyXG5cdHJldHVybiBsZW5ndGg7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMueCAvPSBsZW5ndGg7XHJcblx0dGhpcy55IC89IGxlbmd0aDtcclxuXHR0aGlzLnogLz0gbGVuZ3RoO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBwZXJmb3JtIGEgZG90IHByb2R1Y3Qgd2l0aCBhIHZlY3RvcjNcIjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcy54ICogdmVjdG9yMy54ICsgdGhpcy55ICogdmVjdG9yMy55ICsgdGhpcy56ICogdmVjdG9yMy56O1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IHBlcmZvcm0gYSBjcm9zcyBwcm9kdWN0IHdpdGggYSB2ZWN0b3IzXCI7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IzKFxyXG5cdFx0dGhpcy55ICogdmVjdG9yMy56IC0gdGhpcy56ICogdmVjdG9yMy55LFxyXG5cdFx0dGhpcy56ICogdmVjdG9yMy54IC0gdGhpcy54ICogdmVjdG9yMy56LFxyXG5cdFx0dGhpcy54ICogdmVjdG9yMy55IC0gdGhpcy55ICogdmVjdG9yMy54XHJcblx0KTtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihudW1iZXIpe1xyXG5cdHRoaXMueCAqPSBudW1iZXI7XHJcblx0dGhpcy55ICo9IG51bWJlcjtcclxuXHR0aGlzLnogKj0gbnVtYmVyO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBhZGQgYSBWZWN0b3IzIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ICs9IHZlY3RvcjMueDtcclxuXHR0aGlzLnkgKz0gdmVjdG9yMy55O1xyXG5cdHRoaXMueiArPSB2ZWN0b3IzLno7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgVmVjdG9yMyB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCA9IHZlY3RvcjMueDtcclxuXHR0aGlzLnkgPSB2ZWN0b3IzLnk7XHJcblx0dGhpcy56ID0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSwgeil7XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMueCwgdGhpcy55LCB0aGlzLnopO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgVmVjdG9yMyB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHJldHVybiAodGhpcy54ID09IHZlY3RvcjMueCAmJiB0aGlzLnkgPT0gdmVjdG9yMy55ICYmIHRoaXMueiA9PSB2ZWN0b3IzLnopO1xyXG59O1xyXG5cclxuVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHZlY3RvcjNfYSwgdmVjdG9yM19iKXtcclxuXHRpZiAoIXZlY3RvcjNfYS5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczNcIjtcclxuXHRpZiAoIXZlY3RvcjNfYi5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczNcIjtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjModmVjdG9yM19hLnggLSB2ZWN0b3IzX2IueCwgdmVjdG9yM19hLnkgLSB2ZWN0b3IzX2IueSwgdmVjdG9yM19hLnogLSB2ZWN0b3IzX2Iueik7XHJcbn07XHJcblxyXG5WZWN0b3IzLmZyb21BbmdsZSA9IGZ1bmN0aW9uKHJhZGlhbl94eiwgcmFkaWFuX3kpe1xyXG5cdHZhciB4ID0gTWF0aC5jb3MocmFkaWFuX3h6KTtcclxuXHR2YXIgeSA9IE1hdGguc2luKHJhZGlhbl95KTtcclxuXHR2YXIgeiA9IC1NYXRoLnNpbihyYWRpYW5feHopO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMyh4LCB5LCB6KTtcclxufTtcclxuIiwiZnVuY3Rpb24gVmVjdG9yNCh4LCB5LCB6LCB3KXtcclxuXHR0aGlzLl9fa3R2NCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcblx0dGhpcy53ID0gdztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yNDtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkgKyB0aGlzLnogKiB0aGlzLnogKyB0aGlzLncgKiB0aGlzLncpO1xyXG5cdFxyXG5cdHJldHVybiBsZW5ndGg7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMueCAvPSBsZW5ndGg7XHJcblx0dGhpcy55IC89IGxlbmd0aDtcclxuXHR0aGlzLnogLz0gbGVuZ3RoO1xyXG5cdHRoaXMudyAvPSBsZW5ndGg7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbih2ZWN0b3I0KXtcclxuXHRpZiAoIXZlY3RvcjQuX19rdHY0KSB0aHJvdyBcIkNhbiBvbmx5IHBlcmZvcm0gYSBkb3QgcHJvZHVjdCB3aXRoIGEgdmVjdG9yNFwiO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzLnggKiB2ZWN0b3I0LnggKyB0aGlzLnkgKiB2ZWN0b3I0LnkgKyB0aGlzLnogKiB2ZWN0b3I0LnogKyB0aGlzLncgKiB2ZWN0b3I0Lnc7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24obnVtYmVyKXtcclxuXHR0aGlzLnggKj0gbnVtYmVyO1xyXG5cdHRoaXMueSAqPSBudW1iZXI7XHJcblx0dGhpcy56ICo9IG51bWJlcjtcclxuXHR0aGlzLncgKj0gbnVtYmVyO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yNC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odmVjdG9yNCl7XHJcblx0aWYgKCF2ZWN0b3I0Ll9fa3R2NCkgdGhyb3cgXCJDYW4gb25seSBhZGQgYSB2ZWN0b3I0IHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ICs9IHZlY3RvcjQueDtcclxuXHR0aGlzLnkgKz0gdmVjdG9yNC55O1xyXG5cdHRoaXMueiArPSB2ZWN0b3I0Lno7XHJcblx0dGhpcy53ICs9IHZlY3RvcjQudztcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbih2ZWN0b3I0KXtcclxuXHRpZiAoIXZlY3RvcjQuX19rdHY0KSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSB2ZWN0b3I0IHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ID0gdmVjdG9yNC54O1xyXG5cdHRoaXMueSA9IHZlY3RvcjQueTtcclxuXHR0aGlzLnogPSB2ZWN0b3I0Lno7XHJcblx0dGhpcy53ID0gdmVjdG9yNC53O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yNC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSwgeiwgdyl7XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcblx0dGhpcy53ID0gdztcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gbmV3IHZlY3RvcjQodGhpcy54LCB0aGlzLnksIHRoaXMueiwgdGhpcy53KTtcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKHZlY3RvcjQpe1xyXG5cdGlmICghdmVjdG9yNC5fX2t0djQpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIHZlY3RvcjQgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHRyZXR1cm4gKHRoaXMueCA9PSB2ZWN0b3I0LnggJiYgdGhpcy55ID09IHZlY3RvcjQueSAmJiB0aGlzLnogPT0gdmVjdG9yNC56ICYmIHRoaXMudyA9PSB2ZWN0b3I0LncpO1xyXG59O1xyXG5cclxuVmVjdG9yNC52ZWN0b3JzRGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHZlY3RvcjRfYSwgdmVjdG9yNF9iKXtcclxuXHRpZiAoIXZlY3RvcjRfYS5fX2t0djQpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczRcIjtcclxuXHRpZiAoIXZlY3RvcjRfYi5fX2t0djQpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczRcIjtcclxuXHRcclxuXHRyZXR1cm4gbmV3IHZlY3RvcjQodmVjdG9yNF9hLnggLSB2ZWN0b3I0X2IueCwgdmVjdG9yNF9hLnkgLSB2ZWN0b3I0X2IueSwgdmVjdG9yNF9hLnogLSB2ZWN0b3I0X2IueiwgdmVjdHByNF9hLncgLSB2ZWN0b3I0X2Iudyk7XHJcbn07IiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxuS1QuQ2FtZXJhT3J0aG8gPSByZXF1aXJlKCcuL0tUQ2FtZXJhT3J0aG8nKTtcclxuS1QuQ2FtZXJhUGVyc3BlY3RpdmUgPSByZXF1aXJlKCcuL0tUQ2FtZXJhUGVyc3BlY3RpdmUnKTtcclxuS1QuQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxuS1QuR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxuS1QuR2VvbWV0cnkzRE1vZGVsID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5M0RNb2RlbCcpO1xyXG5LVC5HZW9tZXRyeUJveCA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeUJveCcpO1xyXG5LVC5HZW9tZXRyeUN5bGluZGVyID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Q3lsaW5kZXInKTtcclxuS1QuR2VvbWV0cnlQbGFuZSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeVBsYW5lJyk7XHJcbktULkdlb21ldHJ5U2t5Ym94ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5U2t5Ym94Jyk7XHJcbktULkdlb21ldHJ5U3BoZXJlID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5U3BoZXJlJyk7XHJcbktULkdlb21ldHJ5R1VJVGV4dHVyZSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeUdVSVRleHR1cmUnKTtcclxuS1QuTGlnaHREaXJlY3Rpb25hbCA9IHJlcXVpcmUoJy4vS1RMaWdodERpcmVjdGlvbmFsJyk7XHJcbktULkxpZ2h0UG9pbnQgPSByZXF1aXJlKCcuL0tUTGlnaHRQb2ludCcpO1xyXG5LVC5MaWdodFNwb3QgPSByZXF1aXJlKCcuL0tUTGlnaHRTcG90Jyk7XHJcbktULklucHV0ID0gcmVxdWlyZSgnLi9LVElucHV0Jyk7XHJcbktULk1hdGVyaWFsID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsJyk7XHJcbktULk1hdGVyaWFsQmFzaWMgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWxCYXNpYycpO1xyXG5LVC5NYXRlcmlhbExhbWJlcnQgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWxMYW1iZXJ0Jyk7XHJcbktULk1hdGVyaWFsUGhvbmcgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWxQaG9uZycpO1xyXG5LVC5NYXRoID0gcmVxdWlyZSgnLi9LVE1hdGgnKTtcclxuS1QuTWF0cml4MyA9IHJlcXVpcmUoJy4vS1RNYXRyaXgzJyk7XHJcbktULk1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG5LVC5NZXNoID0gcmVxdWlyZSgnLi9LVE1lc2gnKTtcclxuS1QuTWVzaFNwcml0ZSA9IHJlcXVpcmUoJy4vS1RNZXNoU3ByaXRlJyk7XHJcbktULk9yYml0QW5kUGFuID0gcmVxdWlyZSgnLi9LVE9yYml0QW5kUGFuJyk7XHJcbktULlRleHR1cmUgPSByZXF1aXJlKCcuL0tUVGV4dHVyZScpO1xyXG5LVC5UZXh0dXJlRnJhbWVidWZmZXIgPSByZXF1aXJlKCcuL0tUVGV4dHVyZUZyYW1lYnVmZmVyJyk7XHJcbktULlV0aWxzID0gcmVxdWlyZSgnLi9LVFV0aWxzJyk7XHJcbktULlZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG5LVC5WZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxuS1QuVmVjdG9yNCA9IHJlcXVpcmUoJy4vS1RWZWN0b3I0Jyk7XHJcbktULlNjZW5lID0gcmVxdWlyZSgnLi9LVFNjZW5lJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtUOyIsIndpbmRvdy5LVCA9IHJlcXVpcmUoJy4vS3JhbVRlY2gnKTsiXX0=
