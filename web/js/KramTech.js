(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraPerspective.js":[function(require,module,exports){
var Matrix4 = require('./KTMatrix4');
var Color = require('./KTColor');
var Vector3 = require('./KTVector3');
var KTMath = require('./KTMath');

function CameraPerspective(fov, ratio, znear, zfar){
	this.__ktcamera = true;
	
	this.position = new Vector3(0.0, 0.0, 0.0);
	this.upVector = new Vector3(0.0, 1.0, 0.0);
	this.lookAt(new Vector3(0.0, 0.0, -1.0));
	
	this.fov = fov;
	this.ratio = ratio;
	this.znear = znear;
	this.zfar = zfar;
	
	this.controls = null;
	
	this.backgroundColor = new Color(Color._BLACK);
	
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

},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js":[function(require,module,exports){
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

},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry3DModel.js":[function(require,module,exports){
var Color = require('./KTColor');
var Geometry = require('./KTGeometry');
var Utils = require('./KTUtils');
var Vector2 = require('./KTVector2');
var Vector3 = require('./KTVector3');

function Geometry3DModel(fileURL){
	this.__ktgeometry = true;
	
	this.fileURL = fileURL;
	this.ready = false;
	
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

},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTUtils":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryBox.js":[function(require,module,exports){
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
	
	var xr = this.uvRegion.x;
	var yr = this.uvRegion.y;
	var hr = this.uvRegion.z;
	var vr = this.uvRegion.w;
	
	boxGeo.addVertice( w, -h,  l, Color._WHITE, hr, yr);
	boxGeo.addVertice(-w,  h,  l, Color._WHITE, xr, vr);
	boxGeo.addVertice(-w, -h,  l, Color._WHITE, xr, yr);
	boxGeo.addVertice( w,  h,  l, Color._WHITE, hr, vr);
	
	boxGeo.addVertice(-w, -h, -l, Color._WHITE, xr, yr);
	boxGeo.addVertice(-w,  h, -l, Color._WHITE, xr, vr);
	boxGeo.addVertice( w, -h, -l, Color._WHITE, hr, yr);
	boxGeo.addVertice( w,  h, -l, Color._WHITE, hr, vr);
	
	boxGeo.addVertice( w, -h, -l, Color._WHITE, hr, yr);
	boxGeo.addVertice( w,  h,  l, Color._WHITE, xr, vr);
	boxGeo.addVertice( w, -h,  l, Color._WHITE, xr, yr);
	boxGeo.addVertice( w,  h, -l, Color._WHITE, hr, vr);
	
	boxGeo.addVertice(-w, -h,  l, Color._WHITE, hr, yr);
	boxGeo.addVertice(-w,  h,  l, Color._WHITE, hr, vr);
	boxGeo.addVertice(-w, -h, -l, Color._WHITE, xr, yr);
	boxGeo.addVertice(-w,  h, -l, Color._WHITE, xr, vr);
	
	boxGeo.addVertice( w,  h,  l, Color._WHITE, hr, yr);
	boxGeo.addVertice(-w,  h, -l, Color._WHITE, xr, vr);
	boxGeo.addVertice(-w,  h,  l, Color._WHITE, xr, yr);
	boxGeo.addVertice( w,  h, -l, Color._WHITE, hr, vr);
	
	boxGeo.addVertice(-w, -h,  l, Color._WHITE, xr, vr);
	boxGeo.addVertice(-w, -h, -l, Color._WHITE, xr, yr);
	boxGeo.addVertice( w, -h,  l, Color._WHITE, hr, vr);
	boxGeo.addVertice( w, -h, -l, Color._WHITE, hr, yr);
	
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
	
	planeGeo.addVertice( w, 0,  h, Color._WHITE, hr, vr);
	planeGeo.addVertice(-w, 0, -h, Color._WHITE, xr, yr);
	planeGeo.addVertice(-w, 0,  h, Color._WHITE, xr, vr);
	planeGeo.addVertice( w, 0, -h, Color._WHITE, hr, yr);
	
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
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTVector4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometrySphere.js":[function(require,module,exports){
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
		Utils.addEvent(document, 'keyup', Input.handleKeyDown);
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
	init: function(canvas){
		this.canvas = canvas;
		this.gl = null;
		this.shaders = {};
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
		gl.blendFunc( gl.SRC_ALPHA, gl.ONE );
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
	matrix.multiply(rotationX);
	matrix.multiply(rotationY);
	matrix.multiply(rotationZ);
	matrix.multiply(translation);
	matrix.multiply(scale);
	
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

Scene.prototype.render = function(camera){
	var gl = KT.gl;
	
	var bc = camera.backgroundColor.getRGBA();
	gl.clearColor(bc[0], bc[1], bc[2], bc[3]);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	gl.disable( gl.BLEND ); 
	var transparents = [];
	
	if (camera.controls) camera.controls.update();
	
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
	
	if (!params) params = {};
	this.minFilter = (params.minFilter)? params.minFilter : 'LINEAR';
	this.magFilter = (params.magFilter)? params.magFilter : 'LINEAR';
	this.wrapS = (params.SWrapping)? params.SWrapping : 'REPEAT';
	this.wrapT = (params.TWrapping)? params.TWrapping : 'REPEAT';
	this.repeat = (params.repeat)? params.repeat : new Vector2(1.0, 1.0);
	this.offset = (params.offset)? params.offset : new Vector2(0.0, 0.0);
	
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

},{"./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTUtils":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js":[function(require,module,exports){
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
KT.CameraPerspective = require('./KTCameraPerspective');
KT.Color = require('./KTColor');
KT.Geometry = require('./KTGeometry');
KT.Geometry3DModel = require('./KTGeometry3DModel');
KT.GeometryBox = require('./KTGeometryBox');
KT.GeometryCylinder = require('./KTGeometryCylinder');
KT.GeometryPlane = require('./KTGeometryPlane');
KT.GeometrySphere = require('./KTGeometrySphere');
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
KT.Utils = require('./KTUtils');
KT.Vector2 = require('./KTVector2');
KT.Vector3 = require('./KTVector3');
KT.Vector4 = require('./KTVector4');
KT.Scene = require('./KTScene');

module.exports = KT;
},{"./KTCameraPerspective":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraPerspective.js","./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTGeometry3DModel":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry3DModel.js","./KTGeometryBox":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryBox.js","./KTGeometryCylinder":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryCylinder.js","./KTGeometryPlane":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryPlane.js","./KTGeometrySphere":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometrySphere.js","./KTInput":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTInput.js","./KTLightDirectional":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightDirectional.js","./KTLightPoint":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightPoint.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js","./KTMaterialBasic":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialBasic.js","./KTMaterialLambert":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialLambert.js","./KTMaterialPhong":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialPhong.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTMatrix3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix3.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTMesh":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMesh.js","./KTOrbitAndPan":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTOrbitAndPan.js","./KTScene":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTScene.js","./KTTexture":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTexture.js","./KTUtils":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js","./KTVector4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector4.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js":[function(require,module,exports){
window.KT = require('./KramTech');
},{"./KramTech":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KramTech.js"}]},{},["c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiLi5cXHNyY1xcS1RDYW1lcmFQZXJzcGVjdGl2ZS5qcyIsIi4uXFxzcmNcXEtUQ29sb3IuanMiLCIuLlxcc3JjXFxLVEdlb21ldHJ5LmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeTNETW9kZWwuanMiLCIuLlxcc3JjXFxLVEdlb21ldHJ5Qm94LmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeUN5bGluZGVyLmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeVBsYW5lLmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeVNwaGVyZS5qcyIsIi4uXFxzcmNcXEtUSW5wdXQuanMiLCIuLlxcc3JjXFxLVExpZ2h0RGlyZWN0aW9uYWwuanMiLCIuLlxcc3JjXFxLVExpZ2h0UG9pbnQuanMiLCIuLlxcc3JjXFxLVE1haW4uanMiLCIuLlxcc3JjXFxLVE1hdGVyaWFsLmpzIiwiLi5cXHNyY1xcS1RNYXRlcmlhbEJhc2ljLmpzIiwiLi5cXHNyY1xcS1RNYXRlcmlhbExhbWJlcnQuanMiLCIuLlxcc3JjXFxLVE1hdGVyaWFsUGhvbmcuanMiLCIuLlxcc3JjXFxLVE1hdGguanMiLCIuLlxcc3JjXFxLVE1hdHJpeDMuanMiLCIuLlxcc3JjXFxLVE1hdHJpeDQuanMiLCIuLlxcc3JjXFxLVE1lc2guanMiLCIuLlxcc3JjXFxLVE9yYml0QW5kUGFuLmpzIiwiLi5cXHNyY1xcS1RTY2VuZS5qcyIsIi4uXFxzcmNcXEtUU2hhZGVycy5qcyIsIi4uXFxzcmNcXEtUVGV4dHVyZS5qcyIsIi4uXFxzcmNcXEtUVXRpbHMuanMiLCIuLlxcc3JjXFxLVFZlY3RvcjIuanMiLCIuLlxcc3JjXFxLVFZlY3RvcjMuanMiLCIuLlxcc3JjXFxLVFZlY3RvcjQuanMiLCIuLlxcc3JjXFxLcmFtVGVjaC5qcyIsIi4uXFxzcmNcXFdpbmRvd0V4cG9ydGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIE1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG52YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG52YXIgS1RNYXRoID0gcmVxdWlyZSgnLi9LVE1hdGgnKTtcclxuXHJcbmZ1bmN0aW9uIENhbWVyYVBlcnNwZWN0aXZlKGZvdiwgcmF0aW8sIHpuZWFyLCB6ZmFyKXtcclxuXHR0aGlzLl9fa3RjYW1lcmEgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMucG9zaXRpb24gPSBuZXcgVmVjdG9yMygwLjAsIDAuMCwgMC4wKTtcclxuXHR0aGlzLnVwVmVjdG9yID0gbmV3IFZlY3RvcjMoMC4wLCAxLjAsIDAuMCk7XHJcblx0dGhpcy5sb29rQXQobmV3IFZlY3RvcjMoMC4wLCAwLjAsIC0xLjApKTtcclxuXHRcclxuXHR0aGlzLmZvdiA9IGZvdjtcclxuXHR0aGlzLnJhdGlvID0gcmF0aW87XHJcblx0dGhpcy56bmVhciA9IHpuZWFyO1xyXG5cdHRoaXMuemZhciA9IHpmYXI7XHJcblx0XHJcblx0dGhpcy5jb250cm9scyA9IG51bGw7XHJcblx0XHJcblx0dGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBuZXcgQ29sb3IoQ29sb3IuX0JMQUNLKTtcclxuXHRcclxuXHR0aGlzLnNldFBlcnNwZWN0aXZlKCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FtZXJhUGVyc3BlY3RpdmU7XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUuc2V0UGVyc3BlY3RpdmUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBDID0gMSAvIE1hdGgudGFuKHRoaXMuZm92IC8gMik7XHJcblx0dmFyIFIgPSBDICogdGhpcy5yYXRpbztcclxuXHR2YXIgQSA9ICh0aGlzLnpuZWFyICsgdGhpcy56ZmFyKSAvICh0aGlzLnpuZWFyIC0gdGhpcy56ZmFyKTtcclxuXHR2YXIgQiA9ICgyICogdGhpcy56bmVhciAqIHRoaXMuemZhcikgLyAodGhpcy56bmVhciAtIHRoaXMuemZhcik7XHJcblx0XHJcblx0dGhpcy5wZXJzcGVjdGl2ZU1hdHJpeCA9IG5ldyBNYXRyaXg0KFxyXG5cdFx0QywgMCwgMCwgIDAsXHJcblx0XHQwLCBSLCAwLCAgMCxcclxuXHRcdDAsIDAsIEEsICBCLFxyXG5cdFx0MCwgMCwgLTEsIDBcclxuXHQpO1xyXG59O1xyXG5cclxuQ2FtZXJhUGVyc3BlY3RpdmUucHJvdG90eXBlLnNldEJhY2tncm91bmRDb2xvciA9IGZ1bmN0aW9uKGNvbG9yKXtcclxuXHR0aGlzLmJhY2tncm91bmRDb2xvciA9IG5ldyBDb2xvcihjb2xvcik7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUubG9va0F0ID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBsb29rIHRvIGEgdmVjdG9yM1wiO1xyXG5cdFxyXG5cdHZhciBmb3J3YXJkID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSh0aGlzLnBvc2l0aW9uLCB2ZWN0b3IzKS5ub3JtYWxpemUoKTtcclxuXHR2YXIgbGVmdCA9IHRoaXMudXBWZWN0b3IuY3Jvc3MoZm9yd2FyZCkubm9ybWFsaXplKCk7XHJcblx0dmFyIHVwID0gZm9yd2FyZC5jcm9zcyhsZWZ0KS5ub3JtYWxpemUoKTtcclxuXHRcclxuXHR2YXIgeCA9IC1sZWZ0LmRvdCh0aGlzLnBvc2l0aW9uKTtcclxuXHR2YXIgeSA9IC11cC5kb3QodGhpcy5wb3NpdGlvbik7XHJcblx0dmFyIHogPSAtZm9yd2FyZC5kb3QodGhpcy5wb3NpdGlvbik7XHJcblx0XHJcblx0dGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG5ldyBNYXRyaXg0KFxyXG5cdFx0bGVmdC54LCBsZWZ0LnksIGxlZnQueiwgeCxcclxuXHRcdHVwLngsIHVwLnksIHVwLnosIHksXHJcblx0XHRmb3J3YXJkLngsIGZvcndhcmQueSwgZm9yd2FyZC56LCB6LFxyXG5cdFx0MCwgMCwgMCwgMVxyXG5cdCk7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUuc2V0Q29udHJvbHMgPSBmdW5jdGlvbihjYW1lcmFDb250cm9scyl7XHJcblx0aWYgKCFjYW1lcmFDb250cm9scy5fX2t0Q2FtQ3RybHMpIHRocm93IFwiSXMgbm90IGEgdmFsaWQgY2FtZXJhIGNvbnRyb2xzIG9iamVjdFwiO1xyXG5cdFxyXG5cdHZhciB6b29tID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSh0aGlzLnBvc2l0aW9uLCBjYW1lcmFDb250cm9scy50YXJnZXQpLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMuY29udHJvbHMgPSBjYW1lcmFDb250cm9scztcclxuXHRcclxuXHRjYW1lcmFDb250cm9scy5jYW1lcmEgPSB0aGlzO1xyXG5cdGNhbWVyYUNvbnRyb2xzLnpvb20gPSB6b29tO1xyXG5cdGNhbWVyYUNvbnRyb2xzLmFuZ2xlLnggPSBLVE1hdGguZ2V0MkRBbmdsZShjYW1lcmFDb250cm9scy50YXJnZXQueCwgY2FtZXJhQ29udHJvbHMudGFyZ2V0LnosdGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnopO1xyXG5cdGNhbWVyYUNvbnRyb2xzLmFuZ2xlLnkgPSBLVE1hdGguZ2V0MkRBbmdsZSgwLCB0aGlzLnBvc2l0aW9uLnksIHpvb20sIGNhbWVyYUNvbnRyb2xzLnRhcmdldC55KTtcclxuXHRcclxuXHRjYW1lcmFDb250cm9scy5zZXRDYW1lcmFQb3NpdGlvbigpO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4iLCJmdW5jdGlvbiBDb2xvcihoZXhDb2xvcil7XHJcblx0dmFyIHN0ciA9IGhleENvbG9yLnN1YnN0cmluZygxKTtcclxuXHRcclxuXHRpZiAoc3RyLmxlbmd0aCA9PSA2KSBzdHIgKz0gXCJGRlwiO1xyXG5cdHZhciByID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygwLCAyKSwgMTYpO1xyXG5cdHZhciBnID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygyLCA0KSwgMTYpO1xyXG5cdHZhciBiID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg0LCA2KSwgMTYpO1xyXG5cdHZhciBhID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg2LCA4KSwgMTYpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBbciAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSwgYSAvIDI1NV07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29sb3I7XHJcblxyXG5Db2xvci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaGV4Q29sb3Ipe1xyXG5cdHZhciBzdHIgPSBoZXhDb2xvci5zdWJzdHJpbmcoMSk7XHJcblx0XHJcblx0aWYgKHN0ci5sZW5ndGggPT0gNikgc3RyICs9IFwiRkZcIjtcclxuXHR2YXIgciA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMCwgMiksIDE2KTtcclxuXHR2YXIgZyA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMiwgNCksIDE2KTtcclxuXHR2YXIgYiA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoNCwgNiksIDE2KTtcclxuXHR2YXIgYSA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoNiwgOCksIDE2KTtcclxuXHRcclxuXHR0aGlzLmNvbG9yID0gW3IgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUsIGEgLyAyNTVdO1xyXG59O1xyXG5cclxuQ29sb3IucHJvdG90eXBlLnNldFJHQiA9IGZ1bmN0aW9uKHJlZCwgZ3JlZW4sIGJsdWUpe1xyXG5cdHRoaXMuc2V0UkdCQShyZWQsIGdyZWVuLCBibHVlLCAyNTUpO1xyXG59O1xyXG5cclxuQ29sb3IucHJvdG90eXBlLnNldFJHQkEgPSBmdW5jdGlvbihyZWQsIGdyZWVuLCBibHVlLCBhbHBoYSl7XHJcblx0dGhpcy5jb2xvciA9IFtyZWQgLyAyNTUsIGdyZWVuIC8gMjU1LCBibHVlIC8gMjU1LCBhbHBoYV07XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuZ2V0UkdCID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgYyA9IHRoaXMuZ2V0UkdCQSgpO1xyXG5cdFxyXG5cdHJldHVybiBbY1swXSwgY1sxXSwgY1syXV07XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuZ2V0UkdCQSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMuY29sb3I7XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuZ2V0SGV4ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgYyA9IHRoaXMuY29sb3I7XHJcblx0XHJcblx0dmFyIHIgPSAoY1swXSAqIDI1NSkudG9TdHJpbmcoMTYpO1xyXG5cdHZhciBnID0gKGNbMV0gKiAyNTUpLnRvU3RyaW5nKDE2KTtcclxuXHR2YXIgYiA9IChjWzJdICogMjU1KS50b1N0cmluZygxNik7XHJcblx0dmFyIGEgPSAoY1szXSAqIDI1NSkudG9TdHJpbmcoMTYpO1xyXG5cdFxyXG5cdGlmIChyLmxlbmd0aCA9PSAxKSByID0gXCIwXCIgKyByO1xyXG5cdGlmIChnLmxlbmd0aCA9PSAxKSBnID0gXCIwXCIgKyBnO1xyXG5cdGlmIChiLmxlbmd0aCA9PSAxKSBiID0gXCIwXCIgKyBiO1xyXG5cdGlmIChhLmxlbmd0aCA9PSAxKSBhID0gXCIwXCIgKyBhO1xyXG5cdFxyXG5cdHJldHVybiAoXCIjXCIgKyByICsgZyArIGIgKyBhKS50b1VwcGVyQ2FzZSgpO1xyXG59O1xyXG5cclxuQ29sb3IuX0JMQUNLXHRcdD0gXCIjMDAwMDAwRkZcIjtcclxuQ29sb3IuX1JFRCBcdFx0XHQ9IFwiI0ZGMDAwMEZGXCI7XHJcbkNvbG9yLl9HUkVFTiBcdFx0PSBcIiMwMEZGMDBGRlwiO1xyXG5Db2xvci5fQkxVRSBcdFx0PSBcIiMwMDAwRkZGRlwiO1xyXG5Db2xvci5fV0hJVEVcdFx0PSBcIiNGRkZGRkZGRlwiO1xyXG5Db2xvci5fWUVMTE9XXHRcdD0gXCIjRkZGRjAwRkZcIjtcclxuQ29sb3IuX01BR0VOVEFcdFx0PSBcIiNGRjAwRkZGRlwiO1xyXG5Db2xvci5fQVFVQVx0XHRcdD0gXCIjMDBGRkZGRkZcIjtcclxuQ29sb3IuX0dPTERcdFx0XHQ9IFwiI0ZGRDcwMEZGXCI7XHJcbkNvbG9yLl9HUkFZXHRcdFx0PSBcIiM4MDgwODBGRlwiO1xyXG5Db2xvci5fUFVSUExFXHRcdD0gXCIjODAwMDgwRkZcIjsiLCJ2YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIE1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcbnZhciBWZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5KCl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMudmVydGljZXMgPSBbXTtcclxuXHR0aGlzLnRyaWFuZ2xlcyA9IFtdO1xyXG5cdHRoaXMudXZDb29yZHMgPSBbXTtcclxuXHR0aGlzLmNvbG9ycyA9IFtdO1xyXG5cdHRoaXMubm9ybWFscyA9IFtdO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5O1xyXG5cclxuR2VvbWV0cnkucHJvdG90eXBlLmFkZFZlcnRpY2UgPSBmdW5jdGlvbih4LCB5LCB6LCBjb2xvciwgdHgsIHR5KXtcclxuXHRpZiAoIWNvbG9yKSBjb2xvciA9IENvbG9yLl9XSElURTtcclxuXHRpZiAoIXR4KSB0eCA9IDA7XHJcblx0aWYgKCF0eSkgdHkgPSAwO1xyXG5cdFxyXG5cdHZhciBpbmQgPSB0aGlzLnZlcnRpY2VzLmxlbmd0aDtcclxuXHR0aGlzLnZlcnRpY2VzLnB1c2gobmV3IFZlY3RvcjMoeCwgeSwgeikpO1xyXG5cdHRoaXMuY29sb3JzLnB1c2gobmV3IENvbG9yKGNvbG9yKSk7XHJcblx0dGhpcy51dkNvb3Jkcy5wdXNoKG5ldyBWZWN0b3IyKHR4LCB0eSkpO1xyXG5cdFxyXG5cdHJldHVybiBpbmQ7XHJcbn07XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuYWRkRmFjZSA9IGZ1bmN0aW9uKHZlcnRpY2VfMCwgdmVydGljZV8xLCB2ZXJ0aWNlXzIpe1xyXG5cdGlmICghdGhpcy52ZXJ0aWNlc1t2ZXJ0aWNlXzBdKSB0aHJvdyBcIkludmFsaWQgdmVydGV4IGluZGV4OiBcIiArIHZlcnRpY2VfMDtcclxuXHRpZiAoIXRoaXMudmVydGljZXNbdmVydGljZV8xXSkgdGhyb3cgXCJJbnZhbGlkIHZlcnRleCBpbmRleDogXCIgKyB2ZXJ0aWNlXzE7XHJcblx0aWYgKCF0aGlzLnZlcnRpY2VzW3ZlcnRpY2VfMl0pIHRocm93IFwiSW52YWxpZCB2ZXJ0ZXggaW5kZXg6IFwiICsgdmVydGljZV8yO1xyXG5cdFxyXG5cdHRoaXMudHJpYW5nbGVzLnB1c2gobmV3IFZlY3RvcjModmVydGljZV8wLCB2ZXJ0aWNlXzEsIHZlcnRpY2VfMikpO1xyXG59O1xyXG5cclxuR2VvbWV0cnkucHJvdG90eXBlLmFkZE5vcm1hbCA9IGZ1bmN0aW9uKG54LCBueSwgbnope1xyXG5cdHRoaXMubm9ybWFscy5wdXNoKG5ldyBWZWN0b3IzKG54LCBueSwgbnopKTtcclxufTtcclxuXHJcbkdlb21ldHJ5LnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIHZlcnRpY2VzID0gW107XHJcblx0dmFyIHV2Q29vcmRzID0gW107XHJcblx0dmFyIHRyaWFuZ2xlcyA9IFtdO1xyXG5cdHZhciBjb2xvcnMgPSBbXTtcclxuXHR2YXIgbm9ybWFscyA9IFtdO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy52ZXJ0aWNlcy5sZW5ndGg7aTxsZW47aSsrKXsgXHJcblx0XHR2YXIgdiA9IHRoaXMudmVydGljZXNbaV07IFxyXG5cdFx0dmVydGljZXMucHVzaCh2LngsIHYueSwgdi56KTsgXHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy51dkNvb3Jkcy5sZW5ndGg7aTxsZW47aSsrKXsgXHJcblx0XHR2YXIgdiA9IHRoaXMudXZDb29yZHNbaV07IFxyXG5cdFx0dXZDb29yZHMucHVzaCh2LngsIHYueSk7IFxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMudHJpYW5nbGVzLmxlbmd0aDtpPGxlbjtpKyspeyBcclxuXHRcdHZhciB0ID0gdGhpcy50cmlhbmdsZXNbaV07IFxyXG5cdFx0dHJpYW5nbGVzLnB1c2godC54LCB0LnksIHQueik7IFxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMuY29sb3JzLmxlbmd0aDtpPGxlbjtpKyspeyBcclxuXHRcdHZhciBjID0gdGhpcy5jb2xvcnNbaV0uZ2V0UkdCQSgpOyBcclxuXHRcdFxyXG5cdFx0Y29sb3JzLnB1c2goY1swXSwgY1sxXSwgY1syXSwgY1szXSk7IFxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMubm9ybWFscy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBuID0gdGhpcy5ub3JtYWxzW2ldO1xyXG5cdFx0bm9ybWFscy5wdXNoKG4ueCwgbi55LCBuLnopO1xyXG5cdH1cclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IEtULmNyZWF0ZUFycmF5QnVmZmVyKFwiQVJSQVlfQlVGRkVSXCIsIG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpLCAzKTtcclxuXHR0aGlzLnRleEJ1ZmZlciA9IEtULmNyZWF0ZUFycmF5QnVmZmVyKFwiQVJSQVlfQlVGRkVSXCIsIG5ldyBGbG9hdDMyQXJyYXkodXZDb29yZHMpLCAyKTtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJFTEVNRU5UX0FSUkFZX0JVRkZFUlwiLCBuZXcgVWludDE2QXJyYXkodHJpYW5nbGVzKSwgMSk7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBLVC5jcmVhdGVBcnJheUJ1ZmZlcihcIkFSUkFZX0JVRkZFUlwiLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9ycyksIDQpO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IEtULmNyZWF0ZUFycmF5QnVmZmVyKFwiQVJSQVlfQlVGRkVSXCIsIG5ldyBGbG9hdDMyQXJyYXkobm9ybWFscyksIDMpO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuR2VvbWV0cnkucHJvdG90eXBlLmNvbXB1dGVGYWNlc05vcm1hbHMgPSBmdW5jdGlvbigpe1xyXG5cdHRoaXMubm9ybWFscyA9IFtdO1xyXG5cdFxyXG5cdHZhciBub3JtYWxpemVkVmVydGljZXMgPSBbXTtcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMudHJpYW5nbGVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIGZhY2UgPSB0aGlzLnRyaWFuZ2xlc1tpXTtcclxuXHRcdHZhciB2MCA9IHRoaXMudmVydGljZXNbZmFjZS54XTtcclxuXHRcdHZhciB2MSA9IHRoaXMudmVydGljZXNbZmFjZS55XTtcclxuXHRcdHZhciB2MiA9IHRoaXMudmVydGljZXNbZmFjZS56XTtcclxuXHRcdFxyXG5cdFx0dmFyIGRpcjEgPSBWZWN0b3IzLnZlY3RvcnNEaWZmZXJlbmNlKHYxLCB2MCk7XHJcblx0XHR2YXIgZGlyMiA9IFZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UodjIsIHYwKTtcclxuXHRcdFxyXG5cdFx0dmFyIG5vcm1hbCA9IGRpcjEuY3Jvc3MoZGlyMikubm9ybWFsaXplKCk7XHJcblx0XHRcclxuXHRcdGlmIChub3JtYWxpemVkVmVydGljZXMuaW5kZXhPZihmYWNlLngpID09IC0xKSB0aGlzLm5vcm1hbHMucHVzaChub3JtYWwpO1xyXG5cdFx0aWYgKG5vcm1hbGl6ZWRWZXJ0aWNlcy5pbmRleE9mKGZhY2UueSkgPT0gLTEpIHRoaXMubm9ybWFscy5wdXNoKG5vcm1hbCk7XHJcblx0XHRpZiAobm9ybWFsaXplZFZlcnRpY2VzLmluZGV4T2YoZmFjZS56KSA9PSAtMSkgdGhpcy5ub3JtYWxzLnB1c2gobm9ybWFsKTtcclxuXHRcdFxyXG5cdFx0bm9ybWFsaXplZFZlcnRpY2VzLnB1c2goZmFjZS54LCBmYWNlLnksIGZhY2Uueik7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4iLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vS1RVdGlscycpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcbnZhciBWZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5M0RNb2RlbChmaWxlVVJMKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5maWxlVVJMID0gZmlsZVVSTDtcclxuXHR0aGlzLnJlYWR5ID0gZmFsc2U7XHJcblx0XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdFV0aWxzLmdldEZpbGVDb250ZW50KGZpbGVVUkwsIGZ1bmN0aW9uKGZpbGUpe1xyXG5cdFx0VC5yZWFkeSA9IHRydWU7XHJcblx0XHRULnBhcnNlRmlsZShmaWxlKTtcclxuXHR9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeTNETW9kZWw7XHJcblxyXG5HZW9tZXRyeTNETW9kZWwucHJvdG90eXBlLnBhcnNlRmlsZSA9IGZ1bmN0aW9uKGZpbGUpe1xyXG5cdHZhciBsaW5lcyA9IGZpbGUuc3BsaXQoJ1xcclxcbicpO1xyXG5cdHZhciB2ZXJ0ZXhNaW4gPSBbXTtcclxuXHR2YXIgdXZDb29yZE1pbiA9IFtdO1xyXG5cdHZhciBub3JtYWxNaW4gPSBbXTtcclxuXHR2YXIgaW5kTWluID0gW107XHJcblx0dmFyIGdlb21ldHJ5ID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj1saW5lcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBsID0gbGluZXNbaV0udHJpbSgpO1xyXG5cdFx0bCA9IGwucmVwbGFjZSgnICAnLCAnICcpO1xyXG5cdFx0dmFyIGluZCA9IGwuY2hhckF0KDApO1xyXG5cdFx0XHJcblx0XHR2YXIgcCA9IGwuc3BsaXQoJyAnKTtcclxuXHRcdHAuc3BsaWNlKDAsMSk7XHJcblx0XHRcclxuXHRcdGlmIChpbmQgPT0gJyMnKSBjb250aW51ZTtcclxuXHRcdGVsc2UgaWYgKGluZCA9PSAnZycpIGNvbnRpbnVlO1xyXG5cdFx0ZWxzZSBpZiAobCA9PSAnJykgY29udGludWU7XHJcblx0XHRcclxuXHRcdGlmIChsLmluZGV4T2YoJ3YgJykgPT0gMCl7XHJcblx0XHRcdHZlcnRleE1pbi5wdXNoKCBuZXcgVmVjdG9yMyhcclxuXHRcdFx0XHRwYXJzZUZsb2F0KHBbMF0pLFxyXG5cdFx0XHRcdHBhcnNlRmxvYXQocFsxXSksXHJcblx0XHRcdFx0cGFyc2VGbG9hdChwWzJdKVxyXG5cdFx0XHQpKTtcclxuXHRcdH1lbHNlIGlmIChsLmluZGV4T2YoJ3ZuICcpID09IDApe1xyXG5cdFx0XHRub3JtYWxNaW4ucHVzaCggbmV3IFZlY3RvcjMoXHJcblx0XHRcdFx0cGFyc2VGbG9hdChwWzBdKSxcclxuXHRcdFx0XHRwYXJzZUZsb2F0KHBbMV0pLFxyXG5cdFx0XHRcdHBhcnNlRmxvYXQocFsyXSlcclxuXHRcdFx0KSk7XHJcblx0XHR9ZWxzZSBpZiAobC5pbmRleE9mKCd2dCAnKSA9PSAwKXtcclxuXHRcdFx0dXZDb29yZE1pbi5wdXNoKCBuZXcgVmVjdG9yMihcclxuXHRcdFx0XHRwYXJzZUZsb2F0KHBbMF0pLFxyXG5cdFx0XHRcdHBhcnNlRmxvYXQocFsxXSlcclxuXHRcdFx0KSk7XHJcblx0XHR9ZWxzZSBpZiAobC5pbmRleE9mKCdmICcpID09IDApe1xyXG5cdFx0XHRpbmRNaW4ucHVzaCggbmV3IFZlY3RvcjMoXHJcblx0XHRcdFx0cFswXSxcclxuXHRcdFx0XHRwWzFdLFxyXG5cdFx0XHRcdHBbMl1cclxuXHRcdFx0KSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49aW5kTWluLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIGluZCA9IGluZE1pbltpXTtcclxuXHRcdHZhciB2ZXJ0ZXhJbmZvMSA9IGluZC54LnNwbGl0KCcvJyk7XHJcblx0XHR2YXIgdmVydGV4SW5mbzIgPSBpbmQueS5zcGxpdCgnLycpO1xyXG5cdFx0dmFyIHZlcnRleEluZm8zID0gaW5kLnouc3BsaXQoJy8nKTtcclxuXHRcdFxyXG5cdFx0dmFyIHYxID0gdmVydGV4TWluW3BhcnNlSW50KHZlcnRleEluZm8xWzBdKSAtIDFdO1xyXG5cdFx0dmFyIHQxID0gdXZDb29yZE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvMVsxXSkgLSAxXTtcclxuXHRcdHZhciBuMSA9IG5vcm1hbE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvMVsyXSkgLSAxXTtcclxuXHRcdFxyXG5cdFx0dmFyIHYyID0gdmVydGV4TWluW3BhcnNlSW50KHZlcnRleEluZm8yWzBdKSAtIDFdO1xyXG5cdFx0dmFyIHQyID0gdXZDb29yZE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvMlsxXSkgLSAxXTtcclxuXHRcdHZhciBuMiA9IG5vcm1hbE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvMlsyXSkgLSAxXTtcclxuXHRcdFxyXG5cdFx0dmFyIHYzID0gdmVydGV4TWluW3BhcnNlSW50KHZlcnRleEluZm8zWzBdKSAtIDFdO1xyXG5cdFx0dmFyIHQzID0gdXZDb29yZE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvM1sxXSkgLSAxXTtcclxuXHRcdHZhciBuMyA9IG5vcm1hbE1pbltwYXJzZUludCh2ZXJ0ZXhJbmZvM1syXSkgLSAxXTtcclxuXHRcdFxyXG5cdFx0dmFyIGkxID0gZ2VvbWV0cnkuYWRkVmVydGljZSh2MS54LCB2MS55LCB2MS56LCBDb2xvci5fV0hJVEUsIHQxLngsIHQxLnkpO1xyXG5cdFx0dmFyIGkyID0gZ2VvbWV0cnkuYWRkVmVydGljZSh2Mi54LCB2Mi55LCB2Mi56LCBDb2xvci5fV0hJVEUsIHQyLngsIHQyLnkpO1xyXG5cdFx0dmFyIGkzID0gZ2VvbWV0cnkuYWRkVmVydGljZSh2My54LCB2My55LCB2My56LCBDb2xvci5fV0hJVEUsIHQzLngsIHQzLnkpO1xyXG5cdFx0XHJcblx0XHRnZW9tZXRyeS5hZGROb3JtYWwobjEueCwgbjEueSwgbjEueik7XHJcblx0XHRnZW9tZXRyeS5hZGROb3JtYWwobjIueCwgbjIueSwgbjIueik7XHJcblx0XHRnZW9tZXRyeS5hZGROb3JtYWwobjMueCwgbjMueSwgbjMueik7XHJcblx0XHRcclxuXHRcdGdlb21ldHJ5LmFkZEZhY2UoaTEsIGkyLCBpMyk7XHJcblx0fVxyXG5cdFxyXG5cdGdlb21ldHJ5LmJ1aWxkKCk7XHJcblx0XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgPSBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXI7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBnZW9tZXRyeS50ZXhCdWZmZXI7XHJcblx0dGhpcy5mYWNlc0J1ZmZlciA9IGdlb21ldHJ5LmZhY2VzQnVmZmVyO1xyXG5cdHRoaXMuY29sb3JzQnVmZmVyID0gZ2VvbWV0cnkuY29sb3JzQnVmZmVyO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IGdlb21ldHJ5Lm5vcm1hbHNCdWZmZXI7XHJcbn07XHJcbiIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxudmFyIFZlY3RvcjQgPSByZXF1aXJlKCcuL0tUVmVjdG9yNCcpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlCb3god2lkdGgsIGxlbmd0aCwgaGVpZ2h0LCBwYXJhbXMpe1xyXG5cdHRoaXMuX19rdGdlb21ldHJ5ID0gdHJ1ZTtcclxuXHR0aGlzLnJlYWR5ID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgYm94R2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0XHJcblx0dmFyIHcgPSB3aWR0aCAvIDI7XHJcblx0dmFyIGwgPSBsZW5ndGggLyAyO1xyXG5cdHZhciBoID0gaGVpZ2h0IC8gMjtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0XHJcblx0dGhpcy51dlJlZ2lvbiA9IChwYXJhbXMudXZSZWdpb24pPyBwYXJhbXMudXZSZWdpb24gOiBuZXcgVmVjdG9yNCgwLjAsIDAuMCwgMS4wLCAxLjApO1xyXG5cdFxyXG5cdHZhciB4ciA9IHRoaXMudXZSZWdpb24ueDtcclxuXHR2YXIgeXIgPSB0aGlzLnV2UmVnaW9uLnk7XHJcblx0dmFyIGhyID0gdGhpcy51dlJlZ2lvbi56O1xyXG5cdHZhciB2ciA9IHRoaXMudXZSZWdpb24udztcclxuXHRcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgLWgsICBsLCBDb2xvci5fV0hJVEUsIGhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAgbCwgQ29sb3IuX1dISVRFLCB4ciwgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgIGwsIENvbG9yLl9XSElURSwgeHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgIGgsICBsLCBDb2xvci5fV0hJVEUsIGhyLCB2cik7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAtbCwgQ29sb3IuX1dISVRFLCB4ciwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgLWwsIENvbG9yLl9XSElURSwgeHIsIHZyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgLWgsIC1sLCBDb2xvci5fV0hJVEUsIGhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAtbCwgQ29sb3IuX1dISVRFLCBociwgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgLWwsIENvbG9yLl9XSElURSwgaHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSggdywgIGgsICBsLCBDb2xvci5fV0hJVEUsIHhyLCB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAgbCwgQ29sb3IuX1dISVRFLCB4ciwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgLWwsIENvbG9yLl9XSElURSwgaHIsIHZyKTtcclxuXHRcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgLWgsICBsLCBDb2xvci5fV0hJVEUsIGhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAgbCwgQ29sb3IuX1dISVRFLCBociwgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgLWwsIENvbG9yLl9XSElURSwgeHIsIHlyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgIGgsIC1sLCBDb2xvci5fV0hJVEUsIHhyLCB2cik7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAgbCwgQ29sb3IuX1dISVRFLCBociwgeXIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgLWwsIENvbG9yLl9XSElURSwgeHIsIHZyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgIGgsICBsLCBDb2xvci5fV0hJVEUsIHhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAtbCwgQ29sb3IuX1dISVRFLCBociwgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgIGwsIENvbG9yLl9XSElURSwgeHIsIHZyKTtcclxuXHRib3hHZW8uYWRkVmVydGljZSgtdywgLWgsIC1sLCBDb2xvci5fV0hJVEUsIHhyLCB5cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAgbCwgQ29sb3IuX1dISVRFLCBociwgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgLWwsIENvbG9yLl9XSElURSwgaHIsIHlyKTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSgwLCAxLCAyKTtcclxuXHRib3hHZW8uYWRkRmFjZSgwLCAzLCAxKTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSg0LCA1LCA2KTtcclxuXHRib3hHZW8uYWRkRmFjZSg1LCA3LCA2KTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSg4LCA5LCAxMCk7XHJcblx0Ym94R2VvLmFkZEZhY2UoOCwgMTEsIDkpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDEyLCAxMywgMTQpO1xyXG5cdGJveEdlby5hZGRGYWNlKDEzLCAxNSwgMTQpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDE2LCAxNywgMTgpO1xyXG5cdGJveEdlby5hZGRGYWNlKDE2LCAxOSwgMTcpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDIwLCAyMSwgMjIpO1xyXG5cdGJveEdlby5hZGRGYWNlKDIxLCAyMywgMjIpO1xyXG5cdFxyXG5cdGJveEdlby5jb21wdXRlRmFjZXNOb3JtYWxzKCk7XHJcblx0Ym94R2VvLmJ1aWxkKCk7XHJcblx0XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgPSBib3hHZW8udmVydGV4QnVmZmVyO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gYm94R2VvLnRleEJ1ZmZlcjtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gYm94R2VvLmZhY2VzQnVmZmVyO1xyXG5cdHRoaXMuY29sb3JzQnVmZmVyID0gYm94R2VvLmNvbG9yc0J1ZmZlcjtcclxuXHR0aGlzLm5vcm1hbHNCdWZmZXIgPSBib3hHZW8ubm9ybWFsc0J1ZmZlcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeUJveDsiLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbnZhciBWZWN0b3I0ID0gcmVxdWlyZSgnLi9LVFZlY3RvcjQnKTtcclxudmFyIEtUTWF0aCA9IHJlcXVpcmUoJy4vS1RNYXRoJyk7XHJcblxyXG5mdW5jdGlvbiBHZW9tZXRyeUN5bGluZGVyKHJhZGl1c1RvcCwgcmFkaXVzQm90dG9tLCBoZWlnaHQsIHdpZHRoU2VnbWVudHMsIGhlaWdodFNlZ21lbnRzLCBvcGVuVG9wLCBvcGVuQm90dG9tLCBwYXJhbXMpe1xyXG5cdHRoaXMuX19rdGdlb21ldHJ5ID0gdHJ1ZTtcclxuXHR0aGlzLnJlYWR5ID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgY3lsR2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cdFxyXG5cdHRoaXMudXZSZWdpb24gPSAocGFyYW1zLnV2UmVnaW9uKT8gcGFyYW1zLnV2UmVnaW9uIDogbmV3IFZlY3RvcjQoMC4wLCAwLjAsIDEuMCwgMS4wKTtcclxuXHRcclxuXHR2YXIgeHIgPSB0aGlzLnV2UmVnaW9uLng7XHJcblx0dmFyIHlyID0gdGhpcy51dlJlZ2lvbi55O1xyXG5cdHZhciBociA9IHRoaXMudXZSZWdpb24ueiAtIHhyO1xyXG5cdHZhciB2ciA9IHRoaXMudXZSZWdpb24udyAtIHlyO1xyXG5cdFxyXG5cdHZhciBoID0gaGVpZ2h0IC8gMjtcclxuXHRcclxuXHR2YXIgYmFuZFcgPSBLVE1hdGguUEkyIC8gKHdpZHRoU2VnbWVudHMgLSAxKTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTx3aWR0aFNlZ21lbnRzO2krKyl7XHJcblx0XHR2YXIgeDEgPSBNYXRoLmNvcyhiYW5kVyAqIGkpO1xyXG5cdFx0dmFyIHkxID0gLWg7XHJcblx0XHR2YXIgejEgPSAtTWF0aC5zaW4oYmFuZFcgKiBpKTtcclxuXHRcdHZhciB4MiA9IE1hdGguY29zKGJhbmRXICogaSk7XHJcblx0XHR2YXIgeTIgPSBoO1xyXG5cdFx0dmFyIHoyID0gLU1hdGguc2luKGJhbmRXICogaSk7XHJcblx0XHRcclxuXHRcdHZhciB4dCA9IGkgLyAod2lkdGhTZWdtZW50cyAtIDEpO1xyXG5cdFx0XHJcblx0XHRjeWxHZW8uYWRkTm9ybWFsKHgxLCAwLCB6MSk7XHJcblx0XHRjeWxHZW8uYWRkTm9ybWFsKHgyLCAwLCB6Mik7XHJcblx0XHRcclxuXHRcdHgxICo9IHJhZGl1c0JvdHRvbTtcclxuXHRcdHoxICo9IHJhZGl1c0JvdHRvbTtcclxuXHRcdHgyICo9IHJhZGl1c1RvcDtcclxuXHRcdHoyICo9IHJhZGl1c1RvcDtcclxuXHRcdFxyXG5cdFx0Y3lsR2VvLmFkZFZlcnRpY2UoIHgxLCB5MSwgejEsIENvbG9yLl9XSElURSwgeHIgKyAoeHQgKiBociksIHlyKTtcclxuXHRcdGN5bEdlby5hZGRWZXJ0aWNlKCB4MiwgeTIsIHoyLCBDb2xvci5fV0hJVEUsIHhyICsgKHh0ICogaHIpLCB5ciArIHZyKTtcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8d2lkdGhTZWdtZW50cyoyIC0gMjtpKz0yKXtcclxuXHRcdHZhciBpMSA9IGk7XHJcblx0XHR2YXIgaTIgPSBpKzE7XHJcblx0XHR2YXIgaTMgPSBpKzI7XHJcblx0XHR2YXIgaTQgPSBpKzM7XHJcblx0XHRcclxuXHRcdGN5bEdlby5hZGRGYWNlKGkzLCBpMiwgaTEpO1xyXG5cdFx0Y3lsR2VvLmFkZEZhY2UoaTMsIGk0LCBpMik7XHJcblx0fVxyXG5cdFxyXG5cdGlmICghb3BlblRvcCB8fCAhb3BlbkJvdHRvbSl7XHJcblx0XHR2YXIgaTEgPSBjeWxHZW8uYWRkVmVydGljZSggMCwgaCwgMCwgQ29sb3IuX1dISVRFLCB4ciArICgwLjUgKiBociksIHlyICsgKDAuNSAqIHZyKSk7XHJcblx0XHR2YXIgaTIgPSBjeWxHZW8uYWRkVmVydGljZSggMCwgLWgsIDAsIENvbG9yLl9XSElURSwgeHIgKyAoMC41ICogaHIpLCB5ciArICgwLjUgKiB2cikpO1xyXG5cdFx0Y3lsR2VvLmFkZE5vcm1hbCgwLCAgMSwgMCk7XHJcblx0XHRjeWxHZW8uYWRkTm9ybWFsKDAsIC0xLCAwKTtcclxuXHRcdGZvciAodmFyIGk9MDtpPHdpZHRoU2VnbWVudHMqMiAtIDI7aSs9Mil7XHJcblx0XHRcdHZhciB2MSA9IGN5bEdlby52ZXJ0aWNlc1tpICsgMV07XHJcblx0XHRcdHZhciB2MiA9IGN5bEdlby52ZXJ0aWNlc1tpICsgM107XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgdHgxID0geHIgKyAodjEueCAvIDIgKyAwLjUpICogaHI7XHJcblx0XHRcdHZhciB0eTEgPSB5ciArICh2MS56IC8gMiArIDAuNSkgKiB2cjtcclxuXHRcdFx0dmFyIHR4MiA9IHhyICsgKHYyLnggLyAyICsgMC41KSAqIGhyO1xyXG5cdFx0XHR2YXIgdHkyID0geXIgKyAodjIueiAvIDIgKyAwLjUpICogdnI7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoIW9wZW5Ub3Ape1xyXG5cdFx0XHRcdHZhciBpMyA9IGN5bEdlby5hZGRWZXJ0aWNlKCB2MS54LCBoLCB2MS56LCBDb2xvci5fV0hJVEUsIHR4MSwgdHkxKTtcclxuXHRcdFx0XHR2YXIgaTQgPSBjeWxHZW8uYWRkVmVydGljZSggdjIueCwgaCwgdjIueiwgQ29sb3IuX1dISVRFLCB0eDIsIHR5Mik7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Y3lsR2VvLmFkZE5vcm1hbCgwLCAxLCAwKTtcclxuXHRcdFx0XHRjeWxHZW8uYWRkTm9ybWFsKDAsIDEsIDApO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGN5bEdlby5hZGRGYWNlKGk0LCBpMSwgaTMpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoIW9wZW5Cb3R0b20pe1xyXG5cdFx0XHRcdHZhciBpMyA9IGN5bEdlby5hZGRWZXJ0aWNlKCB2MS54LCAtaCwgdjEueiwgQ29sb3IuX1dISVRFLCB0eDEsIHR5MSk7XHJcblx0XHRcdFx0dmFyIGk0ID0gY3lsR2VvLmFkZFZlcnRpY2UoIHYyLngsIC1oLCB2Mi56LCBDb2xvci5fV0hJVEUsIHR4MiwgdHkyKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRjeWxHZW8uYWRkTm9ybWFsKDAsIC0xLCAwKTtcclxuXHRcdFx0XHRjeWxHZW8uYWRkTm9ybWFsKDAsIC0xLCAwKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRjeWxHZW8uYWRkRmFjZShpMywgaTIsIGk0KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRjeWxHZW8uYnVpbGQoKTtcclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IGN5bEdlby52ZXJ0ZXhCdWZmZXI7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBjeWxHZW8udGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBjeWxHZW8uZmFjZXNCdWZmZXI7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBjeWxHZW8uY29sb3JzQnVmZmVyO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IGN5bEdlby5ub3JtYWxzQnVmZmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5Q3lsaW5kZXI7IiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG52YXIgVmVjdG9yNCA9IHJlcXVpcmUoJy4vS1RWZWN0b3I0Jyk7XHJcblxyXG5mdW5jdGlvbiBHZW9tZXRyeVBsYW5lKHdpZHRoLCBoZWlnaHQsIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdHRoaXMucmVhZHkgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBwbGFuZUdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdHZhciB3ID0gd2lkdGggLyAyO1xyXG5cdHZhciBoID0gaGVpZ2h0IC8gMjtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0XHJcblx0dGhpcy51dlJlZ2lvbiA9IChwYXJhbXMudXZSZWdpb24pPyBwYXJhbXMudXZSZWdpb24gOiBuZXcgVmVjdG9yNCgwLjAsIDAuMCwgMS4wLCAxLjApO1xyXG5cdFxyXG5cdHZhciB4ciA9IHRoaXMudXZSZWdpb24ueDtcclxuXHR2YXIgeXIgPSB0aGlzLnV2UmVnaW9uLnk7XHJcblx0dmFyIGhyID0gdGhpcy51dlJlZ2lvbi56O1xyXG5cdHZhciB2ciA9IHRoaXMudXZSZWdpb24udztcclxuXHRcclxuXHRwbGFuZUdlby5hZGRWZXJ0aWNlKCB3LCAwLCAgaCwgQ29sb3IuX1dISVRFLCBociwgdnIpO1xyXG5cdHBsYW5lR2VvLmFkZFZlcnRpY2UoLXcsIDAsIC1oLCBDb2xvci5fV0hJVEUsIHhyLCB5cik7XHJcblx0cGxhbmVHZW8uYWRkVmVydGljZSgtdywgMCwgIGgsIENvbG9yLl9XSElURSwgeHIsIHZyKTtcclxuXHRwbGFuZUdlby5hZGRWZXJ0aWNlKCB3LCAwLCAtaCwgQ29sb3IuX1dISVRFLCBociwgeXIpO1xyXG5cdFxyXG5cdHBsYW5lR2VvLmFkZEZhY2UoMCwgMSwgMik7XHJcblx0cGxhbmVHZW8uYWRkRmFjZSgwLCAzLCAxKTtcclxuXHRcclxuXHRwbGFuZUdlby5jb21wdXRlRmFjZXNOb3JtYWxzKCk7XHJcblx0cGxhbmVHZW8uYnVpbGQoKTtcclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IHBsYW5lR2VvLnZlcnRleEJ1ZmZlcjtcclxuXHR0aGlzLnRleEJ1ZmZlciA9IHBsYW5lR2VvLnRleEJ1ZmZlcjtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gcGxhbmVHZW8uZmFjZXNCdWZmZXI7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBwbGFuZUdlby5jb2xvcnNCdWZmZXI7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gcGxhbmVHZW8ubm9ybWFsc0J1ZmZlcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeVBsYW5lOyIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxudmFyIFZlY3RvcjQgPSByZXF1aXJlKCcuL0tUVmVjdG9yNCcpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlTcGhlcmUocmFkaXVzLCBsYXRCYW5kcywgbG9uQmFuZHMsIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdHRoaXMucmVhZHkgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBzcGhHZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0XHJcblx0dGhpcy51dlJlZ2lvbiA9IChwYXJhbXMudXZSZWdpb24pPyBwYXJhbXMudXZSZWdpb24gOiBuZXcgVmVjdG9yNCgwLjAsIDAuMCwgMS4wLCAxLjApO1xyXG5cdFxyXG5cdHZhciB4ciA9IHRoaXMudXZSZWdpb24ueDtcclxuXHR2YXIgeXIgPSB0aGlzLnV2UmVnaW9uLnk7XHJcblx0dmFyIGhyID0gdGhpcy51dlJlZ2lvbi56IC0geHI7XHJcblx0dmFyIHZyID0gdGhpcy51dlJlZ2lvbi53IC0geXI7XHJcblx0dmFyIGhzID0gKHBhcmFtcy5oYWxmU3BoZXJlKT8gMS4wIDogMi4wO1xyXG5cdFxyXG5cdGZvciAodmFyIGxhdE49MDtsYXROPD1sYXRCYW5kcztsYXROKyspe1xyXG5cdFx0dmFyIHRoZXRhID0gbGF0TiAqIE1hdGguUEkgLyBsYXRCYW5kcztcclxuXHRcdHZhciBjb3NUID0gTWF0aC5jb3ModGhldGEpO1xyXG5cdFx0dmFyIHNpblQgPSBNYXRoLnNpbih0aGV0YSk7XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGxvbk49MDtsb25OPD1sb25CYW5kcztsb25OKyspe1xyXG5cdFx0XHR2YXIgcGhpID0gbG9uTiAqIGhzICogTWF0aC5QSSAvIGxvbkJhbmRzO1xyXG5cdFx0XHR2YXIgY29zUCA9IE1hdGguY29zKHBoaSk7XHJcblx0XHRcdHZhciBzaW5QID0gTWF0aC5zaW4ocGhpKTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciB4ID0gY29zUCAqIHNpblQ7XHJcblx0XHRcdHZhciB5ID0gY29zVDtcclxuXHRcdFx0dmFyIHogPSBzaW5QICogc2luVDtcclxuXHRcdFx0XHJcblx0XHRcdHZhciB0eCA9IGxvbk4gLyBsb25CYW5kcztcclxuXHRcdFx0dmFyIHR5ID0gMSAtIGxhdE4gLyBsYXRCYW5kcztcclxuXHRcdFx0XHJcblx0XHRcdHNwaEdlby5hZGROb3JtYWwoeCwgeSwgeik7XHJcblx0XHRcdHNwaEdlby5hZGRWZXJ0aWNlKHggKiByYWRpdXMsIHkgKiByYWRpdXMsIHogKiByYWRpdXMsIENvbG9yLl9XSElURSwgeHIgKyB0eCAqIGhyLCB5ciArIHR5ICogdnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBsYXROPTA7bGF0TjxsYXRCYW5kcztsYXROKyspe1xyXG5cdFx0Zm9yICh2YXIgbG9uTj0wO2xvbk48bG9uQmFuZHM7bG9uTisrKXtcclxuXHRcdFx0dmFyIGkxID0gbG9uTiArIChsYXROICogKGxvbkJhbmRzICsgMSkpO1xyXG5cdFx0XHR2YXIgaTIgPSBpMSArIGxvbkJhbmRzICsgMTtcclxuXHRcdFx0dmFyIGkzID0gaTEgKyAxO1xyXG5cdFx0XHR2YXIgaTQgPSBpMiArIDE7XHJcblx0XHRcdFxyXG5cdFx0XHRzcGhHZW8uYWRkRmFjZShpNCwgaTEsIGkzKTtcclxuXHRcdFx0c3BoR2VvLmFkZEZhY2UoaTQsIGkyLCBpMSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHNwaEdlby5idWlsZCgpO1xyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gc3BoR2VvLnZlcnRleEJ1ZmZlcjtcclxuXHR0aGlzLnRleEJ1ZmZlciA9IHNwaEdlby50ZXhCdWZmZXI7XHJcblx0dGhpcy5mYWNlc0J1ZmZlciA9IHNwaEdlby5mYWNlc0J1ZmZlcjtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IHNwaEdlby5jb2xvcnNCdWZmZXI7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gc3BoR2VvLm5vcm1hbHNCdWZmZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnlTcGhlcmU7IiwidmFyIFV0aWxzID0gcmVxdWlyZSgnLi9LVFV0aWxzJyk7XHJcbnZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBWZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxuXHJcbnZhciBJbnB1dCA9IHtcclxuXHRfa2V5czogW10sXHJcblx0X21vdXNlOiB7XHJcblx0XHRsZWZ0OiAwLFxyXG5cdFx0cmlnaHQ6IDAsXHJcblx0XHRtaWRkbGU6IDAsXHJcblx0XHR3aGVlbDogMCxcclxuXHRcdHBvc2l0aW9uOiBuZXcgVmVjdG9yMigwLjAsIDAuMClcclxuXHR9LFxyXG5cdFxyXG5cdHZLZXk6IHtcclxuXHRcdFNISUZUOiAxNixcclxuXHRcdFRBQjogOSxcclxuXHRcdENUUkw6IDE3LFxyXG5cdFx0QUxUOiAxOCxcclxuXHRcdFNQQUNFOiAzMixcclxuXHRcdEVOVEVSOiAxMyxcclxuXHRcdEJBQ0tTUEFDRTogOCxcclxuXHRcdEVTQzogMjcsXHJcblx0XHRJTlNFUlQ6IDQ1LFxyXG5cdFx0REVMOiA0NixcclxuXHRcdEVORDogMzUsXHJcblx0XHRTVEFSVDogMzYsXHJcblx0XHRQQUdFVVA6IDMzLFxyXG5cdFx0UEFHRURPV046IDM0XHJcblx0fSxcclxuXHRcclxuXHR2TW91c2U6IHtcclxuXHRcdExFRlQ6ICdsZWZ0JyxcclxuXHRcdFJJR0hUOiAncmlnaHQnLFxyXG5cdFx0TUlERExFOiAnbWlkZGxlJyxcclxuXHRcdFdIRUVMVVA6IDEsXHJcblx0XHRXSEVFTERPV046IC0xLFxyXG5cdH0sXHJcblx0XHJcblx0aXNLZXlEb3duOiBmdW5jdGlvbihrZXlDb2RlKXtcclxuXHRcdHJldHVybiAoSW5wdXQuX2tleXNba2V5Q29kZV0gPT0gMSk7XHJcblx0fSxcclxuXHRcclxuXHRpc0tleVByZXNzZWQ6IGZ1bmN0aW9uKGtleUNvZGUpe1xyXG5cdFx0aWYgKElucHV0Ll9rZXlzW2tleUNvZGVdID09IDEpe1xyXG5cdFx0XHRJbnB1dC5fa2V5c1trZXlDb2RlXSA9IDI7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRpc01vdXNlRG93bjogZnVuY3Rpb24obW91c2VCdXR0b24pe1xyXG5cdFx0cmV0dXJuIChJbnB1dC5fbW91c2VbbW91c2VCdXR0b25dID09IDEpO1xyXG5cdH0sXHJcblx0XHJcblx0aXNNb3VzZVByZXNzZWQ6IGZ1bmN0aW9uKG1vdXNlQnV0dG9uKXtcclxuXHRcdGlmIChJbnB1dC5fbW91c2VbbW91c2VCdXR0b25dID09IDEpe1xyXG5cdFx0XHRJbnB1dC5fbW91c2VbbW91c2VCdXR0b25dID0gMjtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGlzV2hlZWxNb3ZlZDogZnVuY3Rpb24od2hlZWxEaXIpe1xyXG5cdFx0aWYgKElucHV0Ll9tb3VzZS53aGVlbCA9PSB3aGVlbERpcil7XHJcblx0XHRcdElucHV0Ll9tb3VzZS53aGVlbCA9IDA7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVLZXlEb3duOiBmdW5jdGlvbihldil7XHJcblx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFxyXG5cdFx0aWYgKElucHV0Ll9rZXlzW2V2LmtleUNvZGVdID09IDIpIHJldHVybjtcclxuXHRcdElucHV0Ll9rZXlzW2V2LmtleUNvZGVdID0gMTtcclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZUtleVVwOiBmdW5jdGlvbihldil7XHJcblx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFxyXG5cdFx0SW5wdXQuX2tleXNbZXYua2V5Q29kZV0gPSAwO1xyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlTW91c2VEb3duOiBmdW5jdGlvbihldil7XHJcblx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFxyXG5cdFx0aWYgKGV2LndoaWNoID09IDEpe1xyXG5cdFx0XHRpZiAoSW5wdXQuX21vdXNlLmxlZnQgIT0gMilcclxuXHRcdFx0XHRJbnB1dC5fbW91c2UubGVmdCA9IDE7XHJcblx0XHR9ZWxzZSBpZiAoZXYud2hpY2ggPT0gMil7XHJcblx0XHRcdGlmIChJbnB1dC5fbW91c2UubWlkZGxlICE9IDIpXHJcblx0XHRcdFx0SW5wdXQuX21vdXNlLm1pZGRsZSA9IDE7XHJcblx0XHR9ZWxzZSBpZiAoZXYud2hpY2ggPT0gMyl7XHJcblx0XHRcdGlmIChJbnB1dC5fbW91c2UucmlnaHQgIT0gMilcclxuXHRcdFx0XHRJbnB1dC5fbW91c2UucmlnaHQgPSAxO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRJbnB1dC5oYW5kbGVNb3VzZU1vdmUoZXYpO1xyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZU1vdXNlVXA6IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHJcblx0XHRpZiAoZXYud2hpY2ggPT0gMSl7XHJcblx0XHRcdElucHV0Ll9tb3VzZS5sZWZ0ID0gMDtcclxuXHRcdH1lbHNlIGlmIChldi53aGljaCA9PSAyKXtcclxuXHRcdFx0SW5wdXQuX21vdXNlLm1pZGRsZSA9IDA7XHJcblx0XHR9ZWxzZSBpZiAoZXYud2hpY2ggPT0gMyl7XHJcblx0XHRcdElucHV0Ll9tb3VzZS5yaWdodCA9IDA7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdElucHV0LmhhbmRsZU1vdXNlTW92ZShldik7XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlTW91c2VXaGVlbDogZnVuY3Rpb24oZXYpe1xyXG5cdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcclxuXHRcdElucHV0Ll9tb3VzZS53aGVlbCA9IDA7XHJcblx0XHRpZiAoZXYud2hlZWxEZWx0YSA+IDApIElucHV0Ll9tb3VzZS53aGVlbCA9IDE7XHJcblx0XHRlbHNlIGlmIChldi53aGVlbERlbHRhIDwgMCkgSW5wdXQuX21vdXNlLndoZWVsID0gLTE7XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVNb3VzZU1vdmU6IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHJcblx0XHR2YXIgZWxYID0gZXYuY2xpZW50WCAtIGV2LnRhcmdldC5vZmZzZXRMZWZ0O1xyXG5cdFx0dmFyIGVsWSA9IGV2LmNsaWVudFkgLSBldi50YXJnZXQub2Zmc2V0VG9wO1xyXG5cdFx0XHJcblx0XHRJbnB1dC5fbW91c2UucG9zaXRpb24uc2V0KGVsWCwgZWxZKTtcclxuXHR9LFxyXG5cdFxyXG5cdGluaXQ6IGZ1bmN0aW9uKGNhbnZhcyl7XHJcblx0XHRVdGlscy5hZGRFdmVudChkb2N1bWVudCwgJ2tleWRvd24nLCBJbnB1dC5oYW5kbGVLZXlEb3duKTtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGRvY3VtZW50LCAna2V5dXAnLCBJbnB1dC5oYW5kbGVLZXlEb3duKTtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGNhbnZhcywgJ21vdXNlZG93bicsIElucHV0LmhhbmRsZU1vdXNlRG93bik7XHJcblx0XHRVdGlscy5hZGRFdmVudChkb2N1bWVudCwgJ21vdXNldXAnLCBJbnB1dC5oYW5kbGVNb3VzZVVwKTtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGNhbnZhcywgJ21vdXNld2hlZWwnLCBJbnB1dC5oYW5kbGVNb3VzZVdoZWVsKTtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGNhbnZhcywgJ21vdXNlbW92ZScsIElucHV0LmhhbmRsZU1vdXNlTW92ZSk7XHJcblx0XHRVdGlscy5hZGRFdmVudChkb2N1bWVudCwgJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZXYpe1xyXG5cdFx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChldi50YXJnZXQgPT09IGNhbnZhcyl7XHJcblx0XHRcdFx0ZXYuY2FuY2VsQnViYmxlID0gdHJ1ZTtcclxuXHRcdFx0XHRldi5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmIChldi5wcmV2ZW50RGVmYXVsdClcclxuXHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0aWYgKGV2LnN0b3BQcm9wYWdhdGlvbilcclxuXHRcdFx0XHRcdGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8PTk7aSsrKXtcclxuXHRcdFx0SW5wdXQudktleVsnTicgKyBpXSA9IDQ4ICsgaTtcclxuXHRcdFx0SW5wdXQudktleVsnTksnICsgaV0gPSA5NiArIGk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGk9NjU7aTw9OTA7aSsrKXtcclxuXHRcdFx0SW5wdXQudktleVtTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGk9MTtpPD0xMjtpKyspe1xyXG5cdFx0XHRJbnB1dC52S2V5WydGJyArIGldID0gMTExICsgaTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0OyIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG5cclxuZnVuY3Rpb24gRGlyZWN0aW9uYWxMaWdodChkaXJlY3Rpb24sIGNvbG9yLCBpbnRlbnNpdHkpe1xyXG5cdHRoaXMuX19rdGRpckxpZ2h0ID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbi5ub3JtYWxpemUoKTtcclxuXHR0aGlzLmRpcmVjdGlvbi5tdWx0aXBseSgtMSk7XHJcblx0XHJcblx0dGhpcy5jb2xvciA9IG5ldyBDb2xvcigoY29sb3IpPyBjb2xvcjogQ29sb3IuX1dISVRFKTtcclxuXHR0aGlzLmludGVuc2l0eSA9IChpbnRlbnNpdHkgIT09IHVuZGVmaW5lZCk/IGludGVuc2l0eSA6IDEuMDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3Rpb25hbExpZ2h0O1xyXG5cclxuIiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcblxyXG5mdW5jdGlvbiBMaWdodFBvaW50KHBvc2l0aW9uLCBpbnRlbnNpdHksIGRpc3RhbmNlLCBjb2xvcil7XHJcblx0dGhpcy5fX2t0cG9pbnRsaWdodCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cdHRoaXMuaW50ZW5zaXR5ID0gKGludGVuc2l0eSk/IGludGVuc2l0eSA6IDEuMDtcclxuXHR0aGlzLmRpc3RhbmNlID0gKGRpc3RhbmNlKT8gZGlzdGFuY2UgOiAxLjA7XHJcblx0dGhpcy5jb2xvciA9IG5ldyBDb2xvcigoY29sb3IpPyBjb2xvciA6IENvbG9yLl9XSElURSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGlnaHRQb2ludDsiLCJ2YXIgU2hhZGVycyA9IHJlcXVpcmUoJy4vS1RTaGFkZXJzJyk7XHJcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4vS1RJbnB1dCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0aW5pdDogZnVuY3Rpb24oY2FudmFzKXtcclxuXHRcdHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG5cdFx0dGhpcy5nbCA9IG51bGw7XHJcblx0XHR0aGlzLnNoYWRlcnMgPSB7fTtcclxuXHRcdHRoaXMubWF4QXR0cmliTG9jYXRpb25zID0gMDtcclxuXHRcdHRoaXMubGFzdFByb2dyYW0gPSBudWxsO1xyXG5cdFx0XHJcblx0XHR0aGlzLl9faW5pdENvbnRleHQoY2FudmFzKTtcclxuXHRcdHRoaXMuX19pbml0UHJvcGVydGllcygpO1xyXG5cdFx0dGhpcy5fX2luaXRTaGFkZXJzKCk7XHJcblx0XHRcclxuXHRcdElucHV0LmluaXQoY2FudmFzKTtcclxuXHR9LFxyXG5cdFxyXG5cdF9faW5pdENvbnRleHQ6IGZ1bmN0aW9uKGNhbnZhcyl7XHJcblx0XHR0aGlzLmdsID0gY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xyXG5cdFx0XHJcblx0XHRpZiAoIXRoaXMuZ2wpe1xyXG5cdFx0XHRhbGVydChcIllvdXIgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgV2ViR0xcIik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5nbC53aWR0aCA9IGNhbnZhcy53aWR0aDtcclxuXHRcdHRoaXMuZ2wuaGVpZ2h0ID0gY2FudmFzLmhlaWdodDtcclxuXHR9LFxyXG5cdFxyXG5cdF9faW5pdFByb3BlcnRpZXM6IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZ2wgPSB0aGlzLmdsO1xyXG5cdFx0XHJcblx0XHRnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7XHJcblx0XHRnbC5kZXB0aEZ1bmMoZ2wuTEVRVUFMKTtcclxuXHRcdFxyXG5cdFx0Z2wuZW5hYmxlKGdsLkNVTExfRkFDRSk7XHJcblx0XHRcclxuXHRcdGdsLmRpc2FibGUoIGdsLkJMRU5EICk7XHJcblx0XHRnbC5ibGVuZEVxdWF0aW9uKCBnbC5GVU5DX0FERCApO1xyXG5cdFx0Z2wuYmxlbmRGdW5jKCBnbC5TUkNfQUxQSEEsIGdsLk9ORSApO1xyXG5cdH0sXHJcblx0XHJcblx0X19pbml0U2hhZGVyczogZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuc2hhZGVycyA9IHt9O1xyXG5cdFx0dGhpcy5zaGFkZXJzLmJhc2ljID0gdGhpcy5wcm9jZXNzU2hhZGVyKFNoYWRlcnMuYmFzaWMpO1xyXG5cdFx0dGhpcy5zaGFkZXJzLmxhbWJlcnQgPSB0aGlzLnByb2Nlc3NTaGFkZXIoU2hhZGVycy5sYW1iZXJ0KTtcclxuXHRcdHRoaXMuc2hhZGVycy5waG9uZyA9IHRoaXMucHJvY2Vzc1NoYWRlcihTaGFkZXJzLnBob25nKTtcclxuXHR9LFxyXG5cdFxyXG5cdGNyZWF0ZUFycmF5QnVmZmVyOiBmdW5jdGlvbih0eXBlLCBkYXRhQXJyYXksIGl0ZW1TaXplKXtcclxuXHRcdHZhciBnbCA9IHRoaXMuZ2w7XHJcblx0XHR2YXIgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcblx0XHRnbC5iaW5kQnVmZmVyKGdsW3R5cGVdLCBidWZmZXIpO1xyXG5cdFx0Z2wuYnVmZmVyRGF0YShnbFt0eXBlXSwgZGF0YUFycmF5LCBnbC5TVEFUSUNfRFJBVyk7XHJcblx0XHRidWZmZXIubnVtSXRlbXMgPSBkYXRhQXJyYXkubGVuZ3RoO1xyXG5cdFx0YnVmZmVyLml0ZW1TaXplID0gaXRlbVNpemU7XHJcblx0XHRcclxuXHRcdHJldHVybiBidWZmZXI7XHJcblx0fSxcclxuXHRcclxuXHRnZXRTaGFkZXJBdHRyaWJ1dGVzQW5kVW5pZm9ybXM6IGZ1bmN0aW9uKHZlcnRleCwgZnJhZ21lbnQpe1xyXG5cdFx0dmFyIGF0dHJpYnV0ZXMgPSBbXTtcclxuXHRcdHZhciB1bmlmb3JtcyA9IFtdO1xyXG5cdFx0XHJcblx0XHR2YXIgc3RydWN0cyA9IFtdO1xyXG5cdFx0dmFyIHVuaWZvcm1zQXJyYXlzID0gW107XHJcblx0XHR2YXIgc3QgPSBudWxsO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dmVydGV4Lmxlbmd0aDtpKyspe1xyXG5cdFx0XHR2YXIgbGluZSA9IHZlcnRleFtpXS50cmltKCk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAobGluZS5pbmRleE9mKFwiYXR0cmlidXRlIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtIDFdLnRyaW0oKTtcclxuXHRcdFx0XHRpZiAoYXR0cmlidXRlcy5pbmRleE9mKG5hbWUpID09IC0xKVxyXG5cdFx0XHRcdFx0YXR0cmlidXRlcy5wdXNoKHtuYW1lOiBuYW1lfSk7XHJcblx0XHRcdH1lbHNlIGlmIChsaW5lLmluZGV4T2YoXCJ1bmlmb3JtIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0aWYgKGxpbmUuaW5kZXhPZihcIltcIikgIT0gLTEpe1xyXG5cdFx0XHRcdFx0dW5pZm9ybXNBcnJheXMucHVzaChsaW5lKTtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgcCA9IGxpbmUuc3BsaXQoLyAvZyk7XHJcblx0XHRcdFx0dmFyIG5hbWUgPSBwW3AubGVuZ3RoIC0gMV0udHJpbSgpO1xyXG5cdFx0XHRcdGlmICh1bmlmb3Jtcy5pbmRleE9mKG5hbWUpID09IC0xKVxyXG5cdFx0XHRcdFx0dW5pZm9ybXMucHVzaCh7bmFtZTogbmFtZX0pO1xyXG5cdFx0XHR9ZWxzZSBpZiAobGluZS5pbmRleE9mKFwic3RydWN0XCIpID09IDApe1xyXG5cdFx0XHRcdHN0ID0geyBuYW1lOiBsaW5lLnJlcGxhY2UoXCJzdHJ1Y3QgXCIsIFwiXCIpLCBkYXRhOiBbXSB9O1xyXG5cdFx0XHRcdHN0cnVjdHMucHVzaChzdCk7XHJcblx0XHRcdH1lbHNlIGlmIChzdCAhPSBudWxsKXtcclxuXHRcdFx0XHRpZiAobGluZS50cmltKCkgPT0gXCJcIikgY29udGludWU7XHJcblx0XHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtMV0udHJpbSgpO1xyXG5cdFx0XHRcdHN0LmRhdGEucHVzaChuYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTxmcmFnbWVudC5sZW5ndGg7aSsrKXtcclxuXHRcdFx0dmFyIGxpbmUgPSBmcmFnbWVudFtpXS50cmltKCk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAobGluZS5pbmRleE9mKFwiYXR0cmlidXRlIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtIDFdLnRyaW0oKTtcclxuXHRcdFx0XHRpZiAoYXR0cmlidXRlcy5pbmRleE9mKG5hbWUpID09IC0xKVxyXG5cdFx0XHRcdFx0YXR0cmlidXRlcy5wdXNoKHtuYW1lOiBuYW1lfSk7XHJcblx0XHRcdH1lbHNlIGlmIChsaW5lLmluZGV4T2YoXCJ1bmlmb3JtIFwiKSA9PSAwKXtcclxuXHRcdFx0XHRzdCA9IG51bGw7XHJcblx0XHRcdFx0aWYgKGxpbmUuaW5kZXhPZihcIltcIikgIT0gLTEpe1xyXG5cdFx0XHRcdFx0dW5pZm9ybXNBcnJheXMucHVzaChsaW5lKTtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgcCA9IGxpbmUuc3BsaXQoLyAvZyk7XHJcblx0XHRcdFx0dmFyIG5hbWUgPSBwW3AubGVuZ3RoIC0gMV0udHJpbSgpO1xyXG5cdFx0XHRcdGlmICh1bmlmb3Jtcy5pbmRleE9mKG5hbWUpID09IC0xKVxyXG5cdFx0XHRcdFx0dW5pZm9ybXMucHVzaCh7bmFtZTogbmFtZX0pO1xyXG5cdFx0XHR9ZWxzZSBpZiAobGluZS5pbmRleE9mKFwic3RydWN0XCIpICE9IC0xKXtcclxuXHRcdFx0XHRzdCA9IHsgbmFtZTogbGluZS5yZXBsYWNlKFwic3RydWN0IFwiLCBcIlwiKSwgZGF0YTogW10gfTtcclxuXHRcdFx0XHRzdHJ1Y3RzLnB1c2goc3QpO1xyXG5cdFx0XHR9ZWxzZSBpZiAoc3QgIT0gbnVsbCl7XHJcblx0XHRcdFx0aWYgKGxpbmUudHJpbSgpID09IFwiXCIpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdHZhciBwID0gbGluZS5zcGxpdCgvIC9nKTtcclxuXHRcdFx0XHR2YXIgbmFtZSA9IHBbcC5sZW5ndGggLTFdLnRyaW0oKTtcclxuXHRcdFx0XHRzdC5kYXRhLnB1c2gobmFtZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3Jtc0FycmF5cy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdFx0dmFyIGxpbmUgPSB1bmlmb3Jtc0FycmF5c1tpXTtcclxuXHRcdFx0dmFyIHAgPSBsaW5lLnNwbGl0KC8gL2cpO1xyXG5cdFx0XHR2YXIgdHlwZSA9IHBbcC5sZW5ndGggLSAyXS50cmltKCk7XHJcblx0XHRcdHZhciBuYW1lID0gcFtwLmxlbmd0aCAtIDFdLnRyaW0oKTtcclxuXHRcdFx0dmFyIHVuaUxlbiA9IHBhcnNlSW50KG5hbWUuc3Vic3RyaW5nKG5hbWUuaW5kZXhPZihcIltcIikgKyAxLCBuYW1lLmluZGV4T2YoXCJdXCIpKSwgMTApO1xyXG5cdFx0XHR2YXIgbmFtZSA9IG5hbWUuc3Vic3RyaW5nKDAsIG5hbWUuaW5kZXhPZihcIltcIikpO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHN0ciA9IG51bGw7XHJcblx0XHRcdGZvciAodmFyIGo9MCxqbGVuPXN0cnVjdHMubGVuZ3RoO2o8amxlbjtqKyspe1xyXG5cdFx0XHRcdGlmIChzdHJ1Y3RzW2pdLm5hbWUgPT0gdHlwZSl7XHJcblx0XHRcdFx0XHRzdHIgPSBzdHJ1Y3RzW2pdO1xyXG5cdFx0XHRcdFx0aiA9IGpsZW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoc3RyKXtcclxuXHRcdFx0XHR2YXIgc3RydWN0VW5pID0gW107XHJcblx0XHRcdFx0Zm9yICh2YXIgaj0wO2o8dW5pTGVuO2orKyl7XHJcblx0XHRcdFx0XHRzdHJ1Y3RVbmlbal0gPSAoe25hbWU6IG5hbWUsIGxlbjogdW5pTGVuLCBkYXRhOiBbXX0pO1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaz0wLGtsZW49c3RyLmRhdGEubGVuZ3RoO2s8a2xlbjtrKyspe1xyXG5cdFx0XHRcdFx0XHR2YXIgcHJvcCA9IHN0ci5kYXRhW2tdO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0c3RydWN0VW5pW2pdLmRhdGEucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0bmFtZTogcHJvcCxcclxuXHRcdFx0XHRcdFx0XHRsb2NOYW1lOiBuYW1lICsgXCJbXCIgKyBqICsgXCJdLlwiICsgcHJvcFxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dW5pZm9ybXMucHVzaCh7XHJcblx0XHRcdFx0XHRtdWx0aTogdHJ1ZSxcclxuXHRcdFx0XHRcdGRhdGE6IHN0cnVjdFVuaSxcclxuXHRcdFx0XHRcdHR5cGU6IHR5cGVcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxyXG5cdFx0XHR1bmlmb3JtczogdW5pZm9ybXNcclxuXHRcdH07XHJcblx0fSxcclxuXHRcclxuXHRwcm9jZXNzU2hhZGVyOiBmdW5jdGlvbihzaGFkZXIpe1xyXG5cdFx0dmFyIGdsID0gdGhpcy5nbDtcclxuXHRcdFxyXG5cdFx0dmFyIHZDb2RlID0gc2hhZGVyLnZlcnRleFNoYWRlcjtcclxuXHRcdHZhciB2U2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLlZFUlRFWF9TSEFERVIpO1xyXG5cdFx0Z2wuc2hhZGVyU291cmNlKHZTaGFkZXIsIHZDb2RlKTtcclxuXHRcdGdsLmNvbXBpbGVTaGFkZXIodlNoYWRlcik7XHJcblx0XHRcclxuXHRcdHZhciBmQ29kZSA9IHNoYWRlci5mcmFnbWVudFNoYWRlcjtcclxuXHRcdHZhciBmU2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLkZSQUdNRU5UX1NIQURFUik7XHJcblx0XHRnbC5zaGFkZXJTb3VyY2UoZlNoYWRlciwgZkNvZGUpO1xyXG5cdFx0Z2wuY29tcGlsZVNoYWRlcihmU2hhZGVyKTtcclxuXHRcdFxyXG5cdFx0dmFyIHNoYWRlclByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XHJcblx0XHRnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgdlNoYWRlcik7XHJcblx0XHRnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgZlNoYWRlcik7XHJcblx0XHRnbC5saW5rUHJvZ3JhbShzaGFkZXJQcm9ncmFtKTtcclxuXHRcdFxyXG5cdFx0dmFyIHBhcmFtcyA9IHRoaXMuZ2V0U2hhZGVyQXR0cmlidXRlc0FuZFVuaWZvcm1zKHZDb2RlLnNwbGl0KC9bO3t9XSsvKSwgZkNvZGUuc3BsaXQoL1s7e31dKy8pKTtcclxuXHRcdFxyXG5cdFx0aWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHNoYWRlclByb2dyYW0sIGdsLkxJTktfU1RBVFVTKSl7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJFcnJvciBpbml0aWFsaXppbmcgdGhlIHNoYWRlciBwcm9ncmFtXCIpO1xyXG5cdFx0XHR0aHJvdyBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlclByb2dyYW0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgYXR0cmlidXRlcyA9IFtdO1xyXG5cdFx0dGhpcy5tYXhBdHRyaWJMb2NhdGlvbnMgPSBNYXRoLm1heCh0aGlzLm1heEF0dHJpYkxvY2F0aW9ucywgcGFyYW1zLmF0dHJpYnV0ZXMubGVuZ3RoKTtcclxuXHRcdGZvciAodmFyIGk9MCxsZW49cGFyYW1zLmF0dHJpYnV0ZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHRcdHZhciBhdHQgPSBwYXJhbXMuYXR0cmlidXRlc1tpXTtcclxuXHRcdFx0dmFyIGxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgYXR0Lm5hbWUpO1xyXG5cdFx0XHRcclxuXHRcdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkobG9jYXRpb24pO1xyXG5cdFx0XHRcclxuXHRcdFx0YXR0cmlidXRlcy5wdXNoKHtcclxuXHRcdFx0XHRuYW1lOiBhdHQubmFtZSxcclxuXHRcdFx0XHRsb2NhdGlvbjogbG9jYXRpb25cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciB1bmlmb3JtcyA9IFtdO1xyXG5cdFx0Zm9yICh2YXIgaT0wLGxlbj1wYXJhbXMudW5pZm9ybXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHRcdHZhciB1bmkgPSBwYXJhbXMudW5pZm9ybXNbaV07XHJcblx0XHRcdGlmICh1bmkubXVsdGkpe1xyXG5cdFx0XHRcdGZvciAodmFyIGo9MCxqbGVuPXVuaS5kYXRhLmxlbmd0aDtqPGpsZW47aisrKXtcclxuXHRcdFx0XHRcdHZhciB1bmlEID0gdW5pLmRhdGFbal07XHJcblx0XHRcdFx0XHRmb3IgKHZhciBrPTAsa2xlbj11bmlELmRhdGEubGVuZ3RoO2s8a2xlbjtrKyspe1xyXG5cdFx0XHRcdFx0XHR2YXIgZGF0ID0gdW5pRC5kYXRhW2tdO1xyXG5cdFx0XHRcdFx0XHRkYXQubG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgZGF0LmxvY05hbWUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHR1bmlmb3Jtcy5wdXNoKHVuaSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHZhciBsb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCB1bmkubmFtZSk7XHJcblx0XHRcdFxyXG5cdFx0XHRcdHVuaWZvcm1zLnB1c2goe1xyXG5cdFx0XHRcdFx0bmFtZTogdW5pLm5hbWUsXHJcblx0XHRcdFx0XHRsb2NhdGlvbjogbG9jYXRpb25cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRzaGFkZXJQcm9ncmFtOiBzaGFkZXJQcm9ncmFtLFxyXG5cdFx0XHRhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxyXG5cdFx0XHR1bmlmb3JtczogdW5pZm9ybXNcclxuXHRcdH07XHJcblx0fSxcclxuXHRcclxuXHRzd2l0Y2hQcm9ncmFtOiBmdW5jdGlvbihzaGFkZXIpe1xyXG5cdFx0aWYgKHRoaXMubGFzdFByb2dyYW0gPT09IHNoYWRlcikgcmV0dXJuO1xyXG5cdFx0dmFyIGdsID0gdGhpcy5nbDtcclxuXHRcdFxyXG5cdFx0dGhpcy5sYXN0UHJvZ3JhbSA9IHNoYWRlcjtcclxuXHRcdGdsLnVzZVByb2dyYW0oc2hhZGVyLnNoYWRlclByb2dyYW0pO1xyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLm1heEF0dHJpYkxvY2F0aW9ucztpKyspe1xyXG5cdFx0XHRpZiAoaSA8IHNoYWRlci5hdHRyaWJ1dGVzLmxlbmd0aCl7XHJcblx0XHRcdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoaSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheShpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblxyXG4iLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxuXHJcbmZ1bmN0aW9uIE1hdGVyaWFsKHBhcmFtZXRlcnMpe1xyXG5cdHRoaXMuX19rdG1hdGVyaWFsID0gdHJ1ZTtcclxuXHRcclxuXHRpZiAoIXBhcmFtZXRlcnMpIHBhcmFtZXRlcnMgPSB7fTtcclxuXHRcclxuXHR0aGlzLnRleHR1cmVNYXAgPSAocGFyYW1ldGVycy50ZXh0dXJlTWFwKT8gcGFyYW1ldGVycy50ZXh0dXJlTWFwIDogbnVsbDtcclxuXHR0aGlzLmNvbG9yID0gbmV3IENvbG9yKChwYXJhbWV0ZXJzLmNvbG9yKT8gcGFyYW1ldGVycy5jb2xvciA6IENvbG9yLl9XSElURSk7XHJcblx0dGhpcy5vcGFjaXR5ID0gKHBhcmFtZXRlcnMub3BhY2l0eSk/IHBhcmFtZXRlcnMub3BhY2l0eSA6IDEuMDtcclxuXHR0aGlzLmRyYXdGYWNlcyA9IChwYXJhbWV0ZXJzLmRyYXdGYWNlcyk/IHBhcmFtZXRlcnMuZHJhd0ZhY2VzIDogJ0ZST05UJztcclxuXHR0aGlzLmRyYXdBcyA9IChwYXJhbWV0ZXJzLmRyYXdBcyk/IHBhcmFtZXRlcnMuZHJhd0FzIDogJ1RSSUFOR0xFUyc7XHJcblx0dGhpcy5zaGFkZXIgPSAocGFyYW1ldGVycy5zaGFkZXIpPyBwYXJhbWV0ZXJzLnNoYWRlciA6IG51bGw7XHJcblx0dGhpcy5zZW5kQXR0cmliRGF0YSA9IChwYXJhbWV0ZXJzLnNlbmRBdHRyaWJEYXRhKT8gcGFyYW1ldGVycy5zZW5kQXR0cmliRGF0YSA6IG51bGw7XHJcblx0dGhpcy5zZW5kVW5pZm9ybURhdGEgPSAocGFyYW1ldGVycy5zZW5kVW5pZm9ybURhdGEpPyBwYXJhbWV0ZXJzLnNlbmRVbmlmb3JtRGF0YSA6IG51bGw7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0ZXJpYWw7IiwidmFyIE1hdGVyaWFsID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsJyk7XHJcbnZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcblxyXG5mdW5jdGlvbiBNYXRlcmlhbEJhc2ljKHRleHR1cmVNYXAsIGNvbG9yKXtcclxuXHR0aGlzLl9fa3RtYXRlcmlhbCA9IHRydWU7XHJcblx0XHJcblx0dmFyIG1hdGVyaWFsID0gbmV3IE1hdGVyaWFsKHtcclxuXHRcdHRleHR1cmVNYXA6IHRleHR1cmVNYXAsXHJcblx0XHRjb2xvcjogY29sb3IsXHJcblx0XHRzaGFkZXI6IEtULnNoYWRlcnMuYmFzaWNcclxuXHR9KTtcclxuXHRcclxuXHR0aGlzLnRleHR1cmVNYXAgPSBtYXRlcmlhbC50ZXh0dXJlTWFwO1xyXG5cdHRoaXMuY29sb3IgPSBtYXRlcmlhbC5jb2xvcjtcclxuXHR0aGlzLnNoYWRlciA9IG1hdGVyaWFsLnNoYWRlcjtcclxuXHR0aGlzLm9wYWNpdHkgPSBtYXRlcmlhbC5vcGFjaXR5O1xyXG5cdHRoaXMuZHJhd0ZhY2VzID0gbWF0ZXJpYWwuZHJhd0ZhY2VzO1xyXG5cdHRoaXMuZHJhd0FzID0gbWF0ZXJpYWwuZHJhd0FzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGVyaWFsQmFzaWM7XHJcblxyXG5NYXRlcmlhbEJhc2ljLnByb3RvdHlwZS5zZW5kQXR0cmliRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG5cdGZvciAodmFyIGk9MCxsZW49YXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBhdHQgPSBhdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4UG9zaXRpb25cIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleENvbG9yXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LmNvbG9yc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFUZXh0dXJlQ29vcmRcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS50ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdGVyaWFsQmFzaWMucHJvdG90eXBlLnNlbmRVbmlmb3JtRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIHRyYW5zZm9ybWF0aW9uTWF0cml4O1xyXG5cdHZhciB1bmlmb3JtcyA9IHRoaXMuc2hhZGVyLnVuaWZvcm1zO1xyXG5cdGZvciAodmFyIGk9MCxsZW49dW5pZm9ybXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgdW5pID0gdW5pZm9ybXNbaV07XHJcblx0XHRcclxuXHRcdGlmICh1bmkubmFtZSA9PSAndU1WUE1hdHJpeCcpe1xyXG5cdFx0XHR0cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG1lc2guZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKS5tdWx0aXBseShjYW1lcmEudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG5cdFx0XHR2YXIgbXZwID0gdHJhbnNmb3JtYXRpb25NYXRyaXguY2xvbmUoKS5tdWx0aXBseShjYW1lcmEucGVyc3BlY3RpdmVNYXRyaXgpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG12cC50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1hdGVyaWFsQ29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gbWVzaC5tYXRlcmlhbC5jb2xvci5nZXRSR0JBKCk7XHJcblx0XHRcdGdsLnVuaWZvcm00ZnYodW5pLmxvY2F0aW9uLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9yKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlU2FtcGxlcicpe1xyXG5cdFx0XHRpZiAobWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwKTtcclxuXHRcdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAudGV4dHVyZSk7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUhhc1RleHR1cmUnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVSZXBlYXQnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm0yZih1bmkubG9jYXRpb24sIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5yZXBlYXQueCwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLnJlcGVhdC55KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUdlb21ldHJ5VVYnICYmIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCl7XHJcblx0XHRcdGdsLnVuaWZvcm00Zih1bmkubG9jYXRpb24sIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueCwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi55LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLnosIG1lc2guZ2VvbWV0cnkudXZSZWdpb24udyk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlT2Zmc2V0JyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtMmYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAub2Zmc2V0LngsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5vZmZzZXQueSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4iLCJ2YXIgTWF0ZXJpYWwgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWwnKTtcclxuXHJcbmZ1bmN0aW9uIE1hdGVyaWFsTGFtYmVydCh0ZXh0dXJlTWFwLCBjb2xvciwgb3BhY2l0eSl7XHJcblx0dGhpcy5fX2t0bWF0ZXJpYWwgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBtYXRlcmlhbCA9IG5ldyBNYXRlcmlhbCh7XHJcblx0XHR0ZXh0dXJlTWFwOiB0ZXh0dXJlTWFwLFxyXG5cdFx0Y29sb3I6IGNvbG9yLFxyXG5cdFx0b3BhY2l0eTogb3BhY2l0eSxcclxuXHRcdHNoYWRlcjogS1Quc2hhZGVycy5sYW1iZXJ0XHJcblx0fSk7XHJcblx0XHJcblx0dGhpcy50ZXh0dXJlTWFwID0gbWF0ZXJpYWwudGV4dHVyZU1hcDtcclxuXHR0aGlzLmNvbG9yID0gbWF0ZXJpYWwuY29sb3I7XHJcblx0dGhpcy5zaGFkZXIgPSBtYXRlcmlhbC5zaGFkZXI7XHJcblx0dGhpcy5vcGFjaXR5ID0gbWF0ZXJpYWwub3BhY2l0eTtcclxuXHR0aGlzLmRyYXdGYWNlcyA9IG1hdGVyaWFsLmRyYXdGYWNlcztcclxuXHR0aGlzLmRyYXdBcyA9IG1hdGVyaWFsLmRyYXdBcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRlcmlhbExhbWJlcnQ7XHJcblxyXG5NYXRlcmlhbExhbWJlcnQucHJvdG90eXBlLnNlbmRBdHRyaWJEYXRhID0gZnVuY3Rpb24obWVzaCwgY2FtZXJhLCBzY2VuZSl7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0dmFyIGdlb21ldHJ5ID0gbWVzaC5nZW9tZXRyeTtcclxuXHR2YXIgYXR0cmlidXRlcyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcblx0Zm9yICh2YXIgaT0wLGxlbj1hdHRyaWJ1dGVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIGF0dCA9IGF0dHJpYnV0ZXNbaV07XHJcblx0XHRcclxuXHRcdGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhQb3NpdGlvblwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LnZlcnRleEJ1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9ZWxzZSBpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4Q29sb3JcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS5jb2xvcnNCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVRleHR1cmVDb29yZFwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LnRleEJ1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS50ZXhCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9ZWxzZSBpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4Tm9ybWFsXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkubm9ybWFsc0J1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS5ub3JtYWxzQnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdGVyaWFsTGFtYmVydC5wcm90b3R5cGUuc2VuZExpZ2h0VW5pZm9ybURhdGEgPSBmdW5jdGlvbihsaWdodCwgdW5pZm9ybSl7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3JtLmRhdGEubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgZGF0ID0gdW5pZm9ybS5kYXRhW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAoZGF0Lm5hbWUgPT0gJ3Bvc2l0aW9uJyAmJiBsaWdodC5fX2t0cG9pbnRsaWdodCl7XHJcblx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIGxpZ2h0LnBvc2l0aW9uLngsIGxpZ2h0LnBvc2l0aW9uLnksIGxpZ2h0LnBvc2l0aW9uLnopO1xyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdkaXJlY3Rpb24nICYmIGxpZ2h0Ll9fa3RkaXJMaWdodCl7XHJcblx0XHRcdGdsLnVuaWZvcm0zZihkYXQubG9jYXRpb24sIGxpZ2h0LmRpcmVjdGlvbi54LCBsaWdodC5kaXJlY3Rpb24ueSwgbGlnaHQuZGlyZWN0aW9uLnopO1xyXG5cdFx0fWVsc2UgaWYgKGRhdC5uYW1lID09ICdjb2xvcicpe1xyXG5cdFx0XHR2YXIgY29sb3IgPSBsaWdodC5jb2xvci5nZXRSR0IoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSk7XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ2ludGVuc2l0eScpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWYoZGF0LmxvY2F0aW9uLCBsaWdodC5pbnRlbnNpdHkpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbk1hdGVyaWFsTGFtYmVydC5wcm90b3R5cGUuc2VuZFVuaWZvcm1EYXRhID0gZnVuY3Rpb24obWVzaCwgY2FtZXJhLCBzY2VuZSl7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0dmFyIGdlb21ldHJ5ID0gbWVzaC5nZW9tZXRyeTtcclxuXHR2YXIgdHJhbnNmb3JtYXRpb25NYXRyaXg7XHJcblx0dmFyIHVuaWZvcm1zID0gdGhpcy5zaGFkZXIudW5pZm9ybXM7XHJcblx0dmFyIG1vZGVsVHJhbnNmb3JtYXRpb247XHJcblx0dmFyIHVzZWRMaWdodFVuaWZvcm0gPSBudWxsO1xyXG5cdHZhciBsaWdodHNDb3VudCA9IDA7XHJcblx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3Jtcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciB1bmkgPSB1bmlmb3Jtc1tpXTtcclxuXHRcdFxyXG5cdFx0aWYgKHVuaS5tdWx0aSAmJiB1bmkudHlwZSA9PSAnTGlnaHQnKXtcclxuXHRcdFx0aWYgKGxpZ2h0c0NvdW50ID09IHVuaS5kYXRhLmxlbmd0aClcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0dmFyIGxpZ2h0cyA9IHNjZW5lLmxpZ2h0cztcclxuXHRcdFx0Zm9yICh2YXIgaj0wLGpsZW49bGlnaHRzLmxlbmd0aDtqPGpsZW47aisrKXtcclxuXHRcdFx0XHR0aGlzLnNlbmRMaWdodFVuaWZvcm1EYXRhKGxpZ2h0c1tqXSwgdW5pLmRhdGFbbGlnaHRzQ291bnQrK10pO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VNVk1hdHJpeCcpe1xyXG5cdFx0XHRtb2RlbFRyYW5zZm9ybWF0aW9uID0gbWVzaC5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xyXG5cdFx0XHR0cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG1vZGVsVHJhbnNmb3JtYXRpb24uY2xvbmUoKS5tdWx0aXBseShjYW1lcmEudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIHRyYW5zZm9ybWF0aW9uTWF0cml4LnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1UE1hdHJpeCcpe1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIGNhbWVyYS5wZXJzcGVjdGl2ZU1hdHJpeC50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1hdGVyaWFsQ29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gbWVzaC5tYXRlcmlhbC5jb2xvci5nZXRSR0JBKCk7XHJcblx0XHRcdGdsLnVuaWZvcm00ZnYodW5pLmxvY2F0aW9uLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9yKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlU2FtcGxlcicpe1xyXG5cdFx0XHRpZiAobWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwKTtcclxuXHRcdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAudGV4dHVyZSk7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUhhc1RleHR1cmUnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVVzZUxpZ2h0aW5nJyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIChzY2VuZS51c2VMaWdodGluZyk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU5vcm1hbE1hdHJpeCcpe1xyXG5cdFx0XHR2YXIgbm9ybWFsTWF0cml4ID0gbW9kZWxUcmFuc2Zvcm1hdGlvbi50b01hdHJpeDMoKS5pbnZlcnNlKCkudG9GbG9hdDMyQXJyYXkoKTtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDNmdih1bmkubG9jYXRpb24sIGZhbHNlLCBub3JtYWxNYXRyaXgpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TW9kZWxNYXRyaXgnKXtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdih1bmkubG9jYXRpb24sIGZhbHNlLCBtb2RlbFRyYW5zZm9ybWF0aW9uLnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1QW1iaWVudExpZ2h0Q29sb3InICYmIHNjZW5lLnVzZUxpZ2h0aW5nICYmIHNjZW5lLmFtYmllbnRMaWdodCl7XHJcblx0XHRcdHZhciBjb2xvciA9IHNjZW5lLmFtYmllbnRMaWdodC5nZXRSR0IoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTNmKHVuaS5sb2NhdGlvbiwgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VPcGFjaXR5Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZih1bmkubG9jYXRpb24sIG1lc2gubWF0ZXJpYWwub3BhY2l0eSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlUmVwZWF0JyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtMmYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAucmVwZWF0LngsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5yZXBlYXQueSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VHZW9tZXRyeVVWJyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtNGYodW5pLmxvY2F0aW9uLCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLngsIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueSwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi56LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLncpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VGV4dHVyZU9mZnNldCcgJiYgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0Z2wudW5pZm9ybTJmKHVuaS5sb2NhdGlvbiwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLm9mZnNldC54LCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAub2Zmc2V0LnkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1c2VkTGlnaHRzJyl7XHJcblx0XHRcdHVzZWRMaWdodFVuaWZvcm0gPSB1bmk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGlmICh1c2VkTGlnaHRVbmlmb3JtKXtcclxuXHRcdGdsLnVuaWZvcm0xaSh1c2VkTGlnaHRVbmlmb3JtLmxvY2F0aW9uLCBsaWdodHNDb3VudCk7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59OyIsInZhciBNYXRlcmlhbCA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbCcpO1xyXG52YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxuXHJcbmZ1bmN0aW9uIE1hdGVyaWFsUGhvbmcodGV4dHVyZU1hcCwgY29sb3IsIG9wYWNpdHkpe1xyXG5cdHRoaXMuX19rdG1hdGVyaWFsID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgbWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoe1xyXG5cdFx0dGV4dHVyZU1hcDogdGV4dHVyZU1hcCxcclxuXHRcdGNvbG9yOiBjb2xvcixcclxuXHRcdG9wYWNpdHk6IG9wYWNpdHksXHJcblx0XHRzaGFkZXI6IEtULnNoYWRlcnMucGhvbmdcclxuXHR9KTtcclxuXHRcclxuXHR0aGlzLnRleHR1cmVNYXAgPSBtYXRlcmlhbC50ZXh0dXJlTWFwO1xyXG5cdHRoaXMuc3BlY3VsYXJNYXAgPSBudWxsO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBtYXRlcmlhbC5jb2xvcjtcclxuXHR0aGlzLnNoYWRlciA9IG1hdGVyaWFsLnNoYWRlcjtcclxuXHR0aGlzLm9wYWNpdHkgPSBtYXRlcmlhbC5vcGFjaXR5O1xyXG5cdHRoaXMuZHJhd0ZhY2VzID0gbWF0ZXJpYWwuZHJhd0ZhY2VzO1xyXG5cdHRoaXMuZHJhd0FzID0gbWF0ZXJpYWwuZHJhd0FzO1xyXG5cdHRoaXMuc3BlY3VsYXJDb2xvciA9IG5ldyBDb2xvcihDb2xvci5fV0hJVEUpO1xyXG5cdHRoaXMuc2hpbmluZXNzID0gMC4wO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGVyaWFsUGhvbmc7XHJcblxyXG5NYXRlcmlhbFBob25nLnByb3RvdHlwZS5zZW5kQXR0cmliRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG5cdGZvciAodmFyIGk9MCxsZW49YXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBhdHQgPSBhdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4UG9zaXRpb25cIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleENvbG9yXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LmNvbG9yc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFUZXh0dXJlQ29vcmRcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS50ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleE5vcm1hbFwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5Lm5vcm1hbHNCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkubm9ybWFsc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRlcmlhbFBob25nLnByb3RvdHlwZS5zZW5kTGlnaHRVbmlmb3JtRGF0YSA9IGZ1bmN0aW9uKGxpZ2h0LCB1bmlmb3JtKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRmb3IgKHZhciBpPTAsbGVuPXVuaWZvcm0uZGF0YS5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBkYXQgPSB1bmlmb3JtLmRhdGFbaV07XHJcblx0XHRcclxuXHRcdGlmIChkYXQubmFtZSA9PSAncG9zaXRpb24nICYmIGxpZ2h0Ll9fa3Rwb2ludGxpZ2h0KXtcclxuXHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgbGlnaHQucG9zaXRpb24ueCwgbGlnaHQucG9zaXRpb24ueSwgbGlnaHQucG9zaXRpb24ueik7XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ2RpcmVjdGlvbicgJiYgbGlnaHQuX19rdGRpckxpZ2h0KXtcclxuXHRcdFx0Z2wudW5pZm9ybTNmKGRhdC5sb2NhdGlvbiwgbGlnaHQuZGlyZWN0aW9uLngsIGxpZ2h0LmRpcmVjdGlvbi55LCBsaWdodC5kaXJlY3Rpb24ueik7XHJcblx0XHR9ZWxzZSBpZiAoZGF0Lm5hbWUgPT0gJ2NvbG9yJyl7XHJcblx0XHRcdHZhciBjb2xvciA9IGxpZ2h0LmNvbG9yLmdldFJHQigpO1xyXG5cdFx0XHRnbC51bmlmb3JtM2YoZGF0LmxvY2F0aW9uLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdKTtcclxuXHRcdH1lbHNlIGlmIChkYXQubmFtZSA9PSAnaW50ZW5zaXR5Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZihkYXQubG9jYXRpb24sIGxpZ2h0LmludGVuc2l0eSk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuTWF0ZXJpYWxQaG9uZy5wcm90b3R5cGUuc2VuZFVuaWZvcm1EYXRhID0gZnVuY3Rpb24obWVzaCwgY2FtZXJhLCBzY2VuZSl7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0dmFyIGdlb21ldHJ5ID0gbWVzaC5nZW9tZXRyeTtcclxuXHR2YXIgdHJhbnNmb3JtYXRpb25NYXRyaXg7XHJcblx0dmFyIHVuaWZvcm1zID0gdGhpcy5zaGFkZXIudW5pZm9ybXM7XHJcblx0dmFyIG1vZGVsVHJhbnNmb3JtYXRpb247XHJcblx0dmFyIGxpZ2h0c0NvdW50ID0gMDtcclxuXHRcclxuXHR2YXIgdXNlZExpZ2h0VW5pZm9ybSA9IG51bGw7XHJcblx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3Jtcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciB1bmkgPSB1bmlmb3Jtc1tpXTtcclxuXHRcdFxyXG5cdFx0aWYgKHVuaS5tdWx0aSAmJiB1bmkudHlwZSA9PSAnTGlnaHQnKXtcclxuXHRcdFx0aWYgKGxpZ2h0c0NvdW50ID09IHVuaS5kYXRhLmxlbmd0aClcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0dmFyIGxpZ2h0cyA9IHNjZW5lLmxpZ2h0cztcclxuXHRcdFx0Zm9yICh2YXIgaj0wLGpsZW49bGlnaHRzLmxlbmd0aDtqPGpsZW47aisrKXtcclxuXHRcdFx0XHR0aGlzLnNlbmRMaWdodFVuaWZvcm1EYXRhKGxpZ2h0c1tqXSwgdW5pLmRhdGFbbGlnaHRzQ291bnQrK10pO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VNVk1hdHJpeCcpe1xyXG5cdFx0XHRtb2RlbFRyYW5zZm9ybWF0aW9uID0gbWVzaC5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xyXG5cdFx0XHR0cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG1vZGVsVHJhbnNmb3JtYXRpb24uY2xvbmUoKS5tdWx0aXBseShjYW1lcmEudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIHRyYW5zZm9ybWF0aW9uTWF0cml4LnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1UE1hdHJpeCcpe1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIGNhbWVyYS5wZXJzcGVjdGl2ZU1hdHJpeC50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1hdGVyaWFsQ29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gbWVzaC5tYXRlcmlhbC5jb2xvci5nZXRSR0JBKCk7XHJcblx0XHRcdGdsLnVuaWZvcm00ZnYodW5pLmxvY2F0aW9uLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9yKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlU2FtcGxlcicpe1xyXG5cdFx0XHRpZiAobWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwKTtcclxuXHRcdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAudGV4dHVyZSk7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUhhc1RleHR1cmUnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcCk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVVzZUxpZ2h0aW5nJyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIChzY2VuZS51c2VMaWdodGluZyk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU5vcm1hbE1hdHJpeCcpe1xyXG5cdFx0XHR2YXIgbm9ybWFsTWF0cml4ID0gbW9kZWxUcmFuc2Zvcm1hdGlvbi50b01hdHJpeDMoKS5pbnZlcnNlKCkudG9GbG9hdDMyQXJyYXkoKTtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDNmdih1bmkubG9jYXRpb24sIGZhbHNlLCBub3JtYWxNYXRyaXgpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TW9kZWxNYXRyaXgnKXtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDRmdih1bmkubG9jYXRpb24sIGZhbHNlLCBtb2RlbFRyYW5zZm9ybWF0aW9uLnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1Q2FtZXJhUG9zaXRpb24nKXtcclxuXHRcdFx0Z2wudW5pZm9ybTNmKHVuaS5sb2NhdGlvbiwgY2FtZXJhLnBvc2l0aW9uLngsIGNhbWVyYS5wb3NpdGlvbi55LCBjYW1lcmEucG9zaXRpb24ueik7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VTcGVjdWxhckNvbG9yJyl7XHJcblx0XHRcdHZhciBjb2xvciA9IHRoaXMuc3BlY3VsYXJDb2xvci5nZXRSR0IoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTNmKHVuaS5sb2NhdGlvbiwgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VTaGluaW5lc3MnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFmKHVuaS5sb2NhdGlvbiwgdGhpcy5zaGluaW5lc3MpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1QW1iaWVudExpZ2h0Q29sb3InICYmIHNjZW5lLnVzZUxpZ2h0aW5nICYmIHNjZW5lLmFtYmllbnRMaWdodCl7XHJcblx0XHRcdHZhciBjb2xvciA9IHNjZW5lLmFtYmllbnRMaWdodC5nZXRSR0IoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTNmKHVuaS5sb2NhdGlvbiwgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VPcGFjaXR5Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZih1bmkubG9jYXRpb24sIG1lc2gubWF0ZXJpYWwub3BhY2l0eSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlUmVwZWF0JyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtMmYodW5pLmxvY2F0aW9uLCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAucmVwZWF0LngsIG1lc2gubWF0ZXJpYWwudGV4dHVyZU1hcC5yZXBlYXQueSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VHZW9tZXRyeVVWJyAmJiBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXApe1xyXG5cdFx0XHRnbC51bmlmb3JtNGYodW5pLmxvY2F0aW9uLCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLngsIG1lc2guZ2VvbWV0cnkudXZSZWdpb24ueSwgbWVzaC5nZW9tZXRyeS51dlJlZ2lvbi56LCBtZXNoLmdlb21ldHJ5LnV2UmVnaW9uLncpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VGV4dHVyZU9mZnNldCcgJiYgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwKXtcclxuXHRcdFx0Z2wudW5pZm9ybTJmKHVuaS5sb2NhdGlvbiwgbWVzaC5tYXRlcmlhbC50ZXh0dXJlTWFwLm9mZnNldC54LCBtZXNoLm1hdGVyaWFsLnRleHR1cmVNYXAub2Zmc2V0LnkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1c2VkTGlnaHRzJyl7XHJcblx0XHRcdHVzZWRMaWdodFVuaWZvcm0gPSB1bmk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VVc2VTcGVjdWxhck1hcCcpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAobWVzaC5tYXRlcmlhbC5zcGVjdWxhck1hcCk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVNwZWN1bGFyTWFwU2FtcGxlcicpe1xyXG5cdFx0XHRpZiAobWVzaC5tYXRlcmlhbC5zcGVjdWxhck1hcCl7XHJcblx0XHRcdFx0Z2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMSk7XHJcblx0XHRcdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbWVzaC5tYXRlcmlhbC5zcGVjdWxhck1hcC50ZXh0dXJlKTtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAxKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRpZiAodXNlZExpZ2h0VW5pZm9ybSl7XHJcblx0XHRnbC51bmlmb3JtMWkodXNlZExpZ2h0VW5pZm9ybS5sb2NhdGlvbiwgbGlnaHRzQ291bnQpO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRyYWREZWdSZWw6IE1hdGguUEkgLyAxODAsXHJcblx0XHJcblx0UElfMjogTWF0aC5QSSAvIDIsXHJcblx0UEk6IE1hdGguUEksXHJcblx0UEkzXzI6IE1hdGguUEkgKiAzIC8gMixcclxuXHRQSTI6IE1hdGguUEkgKiAyLFxyXG5cdFxyXG5cdGRlZ1RvUmFkOiBmdW5jdGlvbihkZWdyZWVzKXtcclxuXHRcdHJldHVybiBkZWdyZWVzICogdGhpcy5yYWREZWdSZWw7XHJcblx0fSxcclxuXHRcclxuXHRyYWRUb0RlZzogZnVuY3Rpb24ocmFkaWFucyl7XHJcblx0XHRyZXR1cm4gcmFkaWFucyAvIHRoaXMucmFkRGVnUmVsO1xyXG5cdH0sXHJcblx0XHJcblx0Z2V0MkRBbmdsZTogZnVuY3Rpb24oeDEsIHkxLCB4MiwgeTIpe1xyXG5cdFx0dmFyIHh4ID0gTWF0aC5hYnMoeDIgLSB4MSk7XHJcblx0XHR2YXIgeXkgPSBNYXRoLmFicyh5MiAtIHkxKTtcclxuXHRcdFxyXG5cdFx0dmFyIGFuZyA9IE1hdGguYXRhbjIoeXksIHh4KTtcclxuXHRcdFxyXG5cdFx0aWYgKHgyIDw9IHgxICYmIHkyIDw9IHkxKXtcclxuXHRcdFx0YW5nID0gdGhpcy5QSSAtIGFuZztcclxuXHRcdH1lbHNlIGlmICh4MiA8PSB4MSAmJiB5MiA+IHkxKXtcclxuXHRcdFx0YW5nID0gdGhpcy5QSSArIGFuZztcclxuXHRcdH1lbHNlIGlmICh4MiA+IHgxICYmIHkyID4geTEpe1xyXG5cdFx0XHRhbmcgPSB0aGlzLlBJMiAtIGFuZztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0YW5nID0gKGFuZyArIHRoaXMuUEkyKSAlIHRoaXMuUEkyO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gYW5nO1xyXG5cdH1cclxufTtcclxuIiwiZnVuY3Rpb24gTWF0cml4Mygpe1xyXG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDkpIHRocm93IFwiTWF0cml4IDMgbXVzdCByZWNlaXZlIDkgcGFyYW1ldGVyc1wiO1xyXG5cdFxyXG5cdHZhciBjID0gMDtcclxuXHRmb3IgKHZhciBpPTA7aTw5O2krPTMpe1xyXG5cdFx0dGhpc1tjXSA9IGFyZ3VtZW50c1tpXTtcclxuXHRcdHRoaXNbYyszXSA9IGFyZ3VtZW50c1tpKzFdO1xyXG5cdFx0dGhpc1tjKzZdID0gYXJndW1lbnRzW2krMl07XHJcblx0XHRcclxuXHRcdGMgKz0gMTtcclxuXHR9XHJcblx0XHJcblx0dGhpcy5fX2t0bXQzID0gdHJ1ZTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRyaXgzO1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUuZ2V0RGV0ZXJtaW5hbnQgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHR2YXIgZGV0ID0gKFRbMF0gKiBUWzRdICogVFs4XSkgKyAoVFsxXSAqIFRbNV0gKiBUWzZdKSArIChUWzJdICogVFszXSAqIFRbN10pXHJcblx0XHRcdC0gKFRbNl0gKiBUWzRdICogVFsyXSkgLSAoVFs3XSAqIFRbNV0gKiBUWzBdKSAtIChUWzhdICogVFszXSAqIFRbMV0pO1xyXG5cdFxyXG5cdHJldHVybiBkZXQ7XHJcbn07XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS5pbnZlcnNlID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgZGV0ID0gdGhpcy5nZXREZXRlcm1pbmFudCgpO1xyXG5cdGlmIChkZXQgPT0gMCkgcmV0dXJuIG51bGw7XHJcblx0XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHZhciBpbnYgPSBuZXcgTWF0cml4MyhcclxuXHRcdFRbNF0qVFs4XS1UWzVdKlRbN10sXHRUWzVdKlRbNl0tVFszXSpUWzhdLFx0VFszXSpUWzddLVRbNF0qVFs2XSxcclxuXHRcdFRbMl0qVFs3XS1UWzFdKlRbOF0sXHRUWzBdKlRbOF0tVFsyXSpUWzZdLFx0VFsxXSpUWzZdLVRbMF0qVFs3XSxcclxuXHRcdFRbMV0qVFs1XS1UWzJdKlRbNF0sXHRUWzJdKlRbM10tVFswXSpUWzVdLFx0VFswXSpUWzRdLVRbMV0qVFszXVxyXG5cdCk7XHJcblx0XHJcblx0aW52Lm11bHRpcGx5KDEgLyBkZXQpO1xyXG5cdHRoaXMuY29weShpbnYpO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihudW1iZXIpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRmb3IgKHZhciBpPTA7aTw5O2krKyl7XHJcblx0XHRUW2ldICo9IG51bWJlcjtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24obWF0cml4Myl7XHJcblx0aWYgKCFtYXRyaXgzLl9fa3RtdDMpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIG1hdHJpeDMgaW50byBhbm90aGVyXCI7XHJcblx0XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdGZvciAodmFyIGk9MDtpPDk7aSsrKXtcclxuXHRcdFRbaV0gPSBtYXRyaXgzW2ldO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLnRyYW5zcG9zZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHZhciB2YWx1ZXMgPSBbXHJcblx0XHRUWzBdLCBUWzNdLCBUWzZdLFxyXG5cdFx0VFsxXSwgVFs0XSwgVFs3XSxcclxuXHRcdFRbMl0sIFRbNV0sIFRbOF1cclxuXHRdO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPDk7aSsrKXtcclxuXHRcdFRbaV0gPSB2YWx1ZXNbaV07XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUudG9GbG9hdDMyQXJyYXkgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbXHJcblx0XHRUWzBdLCBUWzFdLCBUWzJdLFxyXG5cdFx0VFszXSwgVFs0XSwgVFs1XSxcclxuXHRcdFRbNl0sIFRbN10sIFRbOF1cclxuXHRdKTtcclxufTtcclxuIiwidmFyIE1hdHJpeDMgPSByZXF1aXJlKCcuL0tUTWF0cml4MycpO1xyXG5cclxuZnVuY3Rpb24gTWF0cml4NCgpe1xyXG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDE2KSB0aHJvdyBcIk1hdHJpeCA0IG11c3QgcmVjZWl2ZSAxNiBwYXJhbWV0ZXJzXCI7XHJcblx0XHJcblx0dmFyIGMgPSAwO1xyXG5cdGZvciAodmFyIGk9MDtpPDE2O2krPTQpe1xyXG5cdFx0dGhpc1tjXSA9IGFyZ3VtZW50c1tpXTtcclxuXHRcdHRoaXNbYys0XSA9IGFyZ3VtZW50c1tpKzFdO1xyXG5cdFx0dGhpc1tjKzhdID0gYXJndW1lbnRzW2krMl07XHJcblx0XHR0aGlzW2MrMTJdID0gYXJndW1lbnRzW2krM107XHJcblx0XHRcclxuXHRcdGMgKz0gMTtcclxuXHR9XHJcblx0XHJcblx0dGhpcy5fX2t0bTQgPSB0cnVlO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdHJpeDQ7XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5pZGVudGl0eSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIHBhcmFtcyA9IFtcclxuXHRcdDEsIDAsIDAsIDAsXHJcblx0XHQwLCAxLCAwLCAwLFxyXG5cdFx0MCwgMCwgMSwgMCxcclxuXHRcdDAsIDAsIDAsIDFcclxuXHRdO1xyXG5cdFxyXG5cdHZhciBjID0gMDtcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKz00KXtcclxuXHRcdHRoaXNbY10gPSBwYXJhbXNbaV07XHJcblx0XHR0aGlzW2MrNF0gPSBwYXJhbXNbaSsxXTtcclxuXHRcdHRoaXNbYys4XSA9IHBhcmFtc1tpKzJdO1xyXG5cdFx0dGhpc1tjKzEyXSA9IHBhcmFtc1tpKzNdO1xyXG5cdFx0XHJcblx0XHRjICs9IDE7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUubXVsdGlwbHlTY2FsYXIgPSBmdW5jdGlvbihudW1iZXIpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKyspe1xyXG5cdFx0VFtpXSAqPSBudW1iZXI7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihtYXRyaXg0KXtcclxuXHRpZiAobWF0cml4NC5fX2t0bTQpe1xyXG5cdFx0dmFyIEExID0gW3RoaXNbMF0sICB0aGlzWzFdLCAgdGhpc1syXSwgIHRoaXNbM11dO1xyXG5cdFx0dmFyIEEyID0gW3RoaXNbNF0sICB0aGlzWzVdLCAgdGhpc1s2XSwgIHRoaXNbN11dO1xyXG5cdFx0dmFyIEEzID0gW3RoaXNbOF0sICB0aGlzWzldLCAgdGhpc1sxMF0sIHRoaXNbMTFdXTtcclxuXHRcdHZhciBBNCA9IFt0aGlzWzEyXSwgdGhpc1sxM10sIHRoaXNbMTRdLCB0aGlzWzE1XV07XHJcblx0XHRcclxuXHRcdHZhciBCMSA9IFttYXRyaXg0WzBdLCBtYXRyaXg0WzRdLCBtYXRyaXg0WzhdLCAgbWF0cml4NFsxMl1dO1xyXG5cdFx0dmFyIEIyID0gW21hdHJpeDRbMV0sIG1hdHJpeDRbNV0sIG1hdHJpeDRbOV0sICBtYXRyaXg0WzEzXV07XHJcblx0XHR2YXIgQjMgPSBbbWF0cml4NFsyXSwgbWF0cml4NFs2XSwgbWF0cml4NFsxMF0sIG1hdHJpeDRbMTRdXTtcclxuXHRcdHZhciBCNCA9IFttYXRyaXg0WzNdLCBtYXRyaXg0WzddLCBtYXRyaXg0WzExXSwgbWF0cml4NFsxNV1dO1xyXG5cdFx0XHJcblx0XHR2YXIgZG90ID0gZnVuY3Rpb24oY29sLCByb3cpe1xyXG5cdFx0XHR2YXIgc3VtID0gMDtcclxuXHRcdFx0Zm9yICh2YXIgaj0wO2o8NDtqKyspeyBzdW0gKz0gcm93W2pdICogY29sW2pdOyB9XHJcblx0XHRcdHJldHVybiBzdW07XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHR0aGlzWzBdID0gZG90KEExLCBCMSk7ICAgdGhpc1sxXSA9IGRvdChBMSwgQjIpOyAgIHRoaXNbMl0gPSBkb3QoQTEsIEIzKTsgICB0aGlzWzNdID0gZG90KEExLCBCNCk7XHJcblx0XHR0aGlzWzRdID0gZG90KEEyLCBCMSk7ICAgdGhpc1s1XSA9IGRvdChBMiwgQjIpOyAgIHRoaXNbNl0gPSBkb3QoQTIsIEIzKTsgICB0aGlzWzddID0gZG90KEEyLCBCNCk7XHJcblx0XHR0aGlzWzhdID0gZG90KEEzLCBCMSk7ICAgdGhpc1s5XSA9IGRvdChBMywgQjIpOyAgIHRoaXNbMTBdID0gZG90KEEzLCBCMyk7ICB0aGlzWzExXSA9IGRvdChBMywgQjQpO1xyXG5cdFx0dGhpc1sxMl0gPSBkb3QoQTQsIEIxKTsgIHRoaXNbMTNdID0gZG90KEE0LCBCMik7ICB0aGlzWzE0XSA9IGRvdChBNCwgQjMpOyAgdGhpc1sxNV0gPSBkb3QoQTQsIEI0KTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fWVsc2UgaWYgKG1hdHJpeDQubGVuZ3RoID09IDQpe1xyXG5cdFx0dmFyIHJldCA9IFtdO1xyXG5cdFx0dmFyIGNvbCA9IG1hdHJpeDQ7XHJcblx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTw0O2krPTEpe1xyXG5cdFx0XHR2YXIgcm93ID0gW3RoaXNbaV0sIHRoaXNbaSs0XSwgdGhpc1tpKzhdLCB0aGlzW2krMTJdXTtcclxuXHRcdFx0dmFyIHN1bSA9IDA7XHJcblx0XHRcdFxyXG5cdFx0XHRmb3IgKHZhciBqPTA7ajw0O2orKyl7XHJcblx0XHRcdFx0c3VtICs9IHJvd1tqXSAqIGNvbFtqXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0LnB1c2goc3VtKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHJldDtcclxuXHR9ZWxzZXtcclxuXHRcdHRocm93IFwiSW52YWxpZCBjb25zdHJ1Y3RvclwiO1xyXG5cdH1cclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLnRyYW5zcG9zZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHZhciB2YWx1ZXMgPSBbXHJcblx0XHRUWzBdLCBUWzRdLCBUWzhdLCAgVFsxMl0sXHJcblx0XHRUWzFdLCBUWzVdLCBUWzldLCAgVFsxM10sXHJcblx0XHRUWzJdLCBUWzZdLCBUWzEwXSwgVFsxNF0sXHJcblx0XHRUWzNdLCBUWzddLCBUWzExXSwgVFsxNV0sXHJcblx0XTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKyspe1xyXG5cdFx0dGhpc1tpXSA9IHZhbHVlc1tpXTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24obWF0cml4NCl7XHJcblx0aWYgKCFtYXRyaXg0Ll9fa3RtNCkgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgTWF0cml4NCBpbnRvIHRoaXMgbWF0cml4XCI7XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSsrKXtcclxuXHRcdHRoaXNbaV0gPSBtYXRyaXg0W2ldO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0VFswXSwgVFs0XSwgVFs4XSwgIFRbMTJdLFxyXG5cdFx0VFsxXSwgVFs1XSwgVFs5XSwgIFRbMTNdLFxyXG5cdFx0VFsyXSwgVFs2XSwgVFsxMF0sIFRbMTRdLFxyXG5cdFx0VFszXSwgVFs3XSwgVFsxMV0sIFRbMTVdXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLnRvRmxvYXQzMkFycmF5ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG5cdFx0VFswXSwgVFsxXSwgVFsyXSwgIFRbM10sXHJcblx0XHRUWzRdLCBUWzVdLCBUWzZdLCAgVFs3XSxcclxuXHRcdFRbOF0sIFRbOV0sIFRbMTBdLCBUWzExXSxcclxuXHRcdFRbMTJdLCBUWzEzXSwgVFsxNF0sIFRbMTVdXHJcblx0XSk7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS50b01hdHJpeDMgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDMoXHJcblx0XHRUWzBdLCBUWzFdLCBUWzJdLFxyXG5cdFx0VFs0XSwgVFs1XSwgVFs2XSxcclxuXHRcdFRbOF0sIFRbOV0sIFRbMTBdXHJcblx0KTsgXHJcbn07XHJcblxyXG5NYXRyaXg0LmdldElkZW50aXR5ID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQxLCAwLCAwLCAwLFxyXG5cdFx0MCwgMSwgMCwgMCxcclxuXHRcdDAsIDAsIDEsIDAsXHJcblx0XHQwLCAwLCAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0WFJvdGF0aW9uID0gZnVuY3Rpb24ocmFkaWFucyl7XHJcblx0dmFyIEMgPSBNYXRoLmNvcyhyYWRpYW5zKTtcclxuXHR2YXIgUyA9IE1hdGguc2luKHJhZGlhbnMpO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdDEsICAwLCAgMCwgMCxcclxuXHRcdDAsICBDLCAgUywgMCxcclxuXHRcdDAsIC1TLCAgQywgMCxcclxuXHRcdDAsICAwLCAgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFlSb3RhdGlvbiA9IGZ1bmN0aW9uKHJhZGlhbnMpe1xyXG5cdHZhciBDID0gTWF0aC5jb3MocmFkaWFucyk7XHJcblx0dmFyIFMgPSBNYXRoLnNpbihyYWRpYW5zKTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQgQywgIDAsICBTLCAwLFxyXG5cdFx0IDAsICAxLCAgMCwgMCxcclxuXHRcdC1TLCAgMCwgIEMsIDAsXHJcblx0XHQgMCwgIDAsICAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0WlJvdGF0aW9uID0gZnVuY3Rpb24ocmFkaWFucyl7XHJcblx0dmFyIEMgPSBNYXRoLmNvcyhyYWRpYW5zKTtcclxuXHR2YXIgUyA9IE1hdGguc2luKHJhZGlhbnMpO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdCBDLCAgUywgMCwgMCxcclxuXHRcdC1TLCAgQywgMCwgMCxcclxuXHRcdCAwLCAgMCwgMSwgMCxcclxuXHRcdCAwLCAgMCwgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFRyYW5zbGF0aW9uID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSB0cmFuc2xhdGUgdG8gYSB2ZWN0b3IgM1wiO1xyXG5cdFxyXG5cdHZhciB4ID0gdmVjdG9yMy54O1xyXG5cdHZhciB5ID0gdmVjdG9yMy55O1xyXG5cdHZhciB6ID0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdDEsIDAsIDAsIHgsXHJcblx0XHQwLCAxLCAwLCB5LFxyXG5cdFx0MCwgMCwgMSwgeixcclxuXHRcdDAsIDAsIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRTY2FsZSA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgc2NhbGUgdG8gYSB2ZWN0b3IgM1wiO1xyXG5cdFxyXG5cdHZhciBzeCA9IHZlY3RvcjMueDtcclxuXHR2YXIgc3kgPSB2ZWN0b3IzLnk7XHJcblx0dmFyIHN6ID0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdHN4LCAgMCwgIDAsIDAsXHJcblx0XHQgMCwgc3ksICAwLCAwLFxyXG5cdFx0IDAsICAwLCBzeiwgMCxcclxuXHRcdCAwLCAgMCwgIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRUcmFuc2Zvcm1hdGlvbiA9IGZ1bmN0aW9uKHBvc2l0aW9uLCByb3RhdGlvbiwgc2NhbGUpe1xyXG5cdGlmICghcG9zaXRpb24uX19rdHYzKSB0aHJvdyBcIlBvc2l0aW9uIG11c3QgYmUgYSBWZWN0b3IzXCI7XHJcblx0aWYgKCFyb3RhdGlvbi5fX2t0djMpIHRocm93IFwiUm90YXRpb24gbXVzdCBiZSBhIFZlY3RvcjNcIjtcclxuXHRpZiAoc2NhbGUgJiYgIXNjYWxlLl9fa3R2MykgdGhyb3cgXCJTY2FsZSBtdXN0IGJlIGEgVmVjdG9yM1wiO1xyXG5cdFxyXG5cdHZhciBzY2FsZSA9IChzY2FsZSk/IE1hdHJpeDQuZ2V0U2NhbGUoc2NhbGUpIDogTWF0cml4NC5nZXRJZGVudGl0eSgpO1xyXG5cdFxyXG5cdHZhciByb3RhdGlvblggPSBNYXRyaXg0LmdldFhSb3RhdGlvbihyb3RhdGlvbi54KTtcclxuXHR2YXIgcm90YXRpb25ZID0gTWF0cml4NC5nZXRZUm90YXRpb24ocm90YXRpb24ueSk7XHJcblx0dmFyIHJvdGF0aW9uWiA9IE1hdHJpeDQuZ2V0WlJvdGF0aW9uKHJvdGF0aW9uLnopO1xyXG5cdFxyXG5cdHZhciB0cmFuc2xhdGlvbiA9IE1hdHJpeDQuZ2V0VHJhbnNsYXRpb24ocG9zaXRpb24pO1xyXG5cdFxyXG5cdHZhciBtYXRyaXg7XHJcblx0bWF0cml4ID0gTWF0cml4NC5nZXRJZGVudGl0eSgpO1xyXG5cdG1hdHJpeC5tdWx0aXBseShyb3RhdGlvblgpO1xyXG5cdG1hdHJpeC5tdWx0aXBseShyb3RhdGlvblkpO1xyXG5cdG1hdHJpeC5tdWx0aXBseShyb3RhdGlvblopO1xyXG5cdG1hdHJpeC5tdWx0aXBseSh0cmFuc2xhdGlvbik7XHJcblx0bWF0cml4Lm11bHRpcGx5KHNjYWxlKTtcclxuXHRcclxuXHRyZXR1cm4gbWF0cml4O1xyXG59O1xyXG4iLCJ2YXIgTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcbnZhciBWZWMzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxuXHJcbmZ1bmN0aW9uIE1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKXtcclxuXHRpZiAoIWdlb21ldHJ5Ll9fa3RnZW9tZXRyeSkgdGhyb3cgXCJHZW9tZXRyeSBtdXN0IGJlIGEgS1RHZW9tZXRyeSBpbnN0YW5jZVwiO1xyXG5cdGlmICghbWF0ZXJpYWwuX19rdG1hdGVyaWFsKSB0aHJvdyBcIk1hdGVyaWFsIG11c3QgYmUgYSBLVE1hdGVyaWFsIGluc3RhbmNlXCI7XHJcblx0XHJcblx0dGhpcy5fX2t0bWVzaCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5nZW9tZXRyeSA9IGdlb21ldHJ5O1xyXG5cdHRoaXMubWF0ZXJpYWwgPSBtYXRlcmlhbDtcclxuXHRcclxuXHR0aGlzLnBhcmVudCA9IG51bGw7XHJcblx0dGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnBvc2l0aW9uID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcblx0dGhpcy5yb3RhdGlvbiA9IG5ldyBWZWMzKDAsIDAsIDApO1xyXG5cdHRoaXMuc2NhbGUgPSBuZXcgVmVjMygxLCAxLCAxKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXNoO1xyXG5cclxuTWVzaC5wcm90b3R5cGUuZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXggPSBmdW5jdGlvbigpe1xyXG5cdHZhciBtYXRyaXggPSBNYXRyaXg0LmdldFRyYW5zZm9ybWF0aW9uKHRoaXMucG9zaXRpb24sIHRoaXMucm90YXRpb24sIHRoaXMuc2NhbGUpO1xyXG5cdFxyXG5cdGlmICh0aGlzLnBhcmVudCl7XHJcblx0XHR2YXIgbSA9IHRoaXMucGFyZW50LmdldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblx0XHRtYXRyaXgubXVsdGlwbHkobSk7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiBtYXRyaXg7XHJcbn07XHJcbiIsInZhciBWZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL0tUSW5wdXQnKTtcclxudmFyIEtUTWF0aCA9IHJlcXVpcmUoJy4vS1RNYXRoJyk7XHJcblxyXG5mdW5jdGlvbiBPcmJpdEFuZFBhbih0YXJnZXQpe1xyXG5cdHRoaXMuX19rdENhbUN0cmxzID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLmNhbWVyYSA9IG51bGw7XHJcblx0dGhpcy5sYXN0RHJhZyA9IG51bGw7XHJcblx0dGhpcy5sYXN0UGFuID0gbnVsbDtcclxuXHR0aGlzLnRhcmdldCA9ICh0YXJnZXQpPyB0YXJnZXQgOiBuZXcgVmVjdG9yMygwLjAsIDAuMCwgMC4wKTtcclxuXHR0aGlzLmFuZ2xlID0gbmV3IFZlY3RvcjIoMC4wLCAwLjApO1xyXG5cdHRoaXMuem9vbSA9IDE7XHJcblx0dGhpcy5zZW5zaXRpdml0eSA9IG5ldyBWZWN0b3IyKDAuNSwgMC41KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPcmJpdEFuZFBhbjtcclxuXHJcbk9yYml0QW5kUGFuLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpe1xyXG5cdGlmIChJbnB1dC5pc1doZWVsTW92ZWQoSW5wdXQudk1vdXNlLldIRUVMVVApKXsgdGhpcy56b29tIC09IDAuMzsgdGhpcy5zZXRDYW1lcmFQb3NpdGlvbigpOyB9XHJcblx0ZWxzZSBpZiAoSW5wdXQuaXNXaGVlbE1vdmVkKElucHV0LnZNb3VzZS5XSEVFTERPV04pKXsgdGhpcy56b29tICs9IDAuMzsgdGhpcy5zZXRDYW1lcmFQb3NpdGlvbigpOyB9XHJcblx0XHJcblx0aWYgKElucHV0LmlzTW91c2VEb3duKElucHV0LnZNb3VzZS5MRUZUKSl7XHJcblx0XHRpZiAodGhpcy5sYXN0RHJhZyA9PSBudWxsKSB0aGlzLmxhc3REcmFnID0gSW5wdXQuX21vdXNlLnBvc2l0aW9uLmNsb25lKCk7XHJcblx0XHRcclxuXHRcdHZhciBkeCA9IElucHV0Ll9tb3VzZS5wb3NpdGlvbi54IC0gdGhpcy5sYXN0RHJhZy54O1xyXG5cdFx0dmFyIGR5ID0gSW5wdXQuX21vdXNlLnBvc2l0aW9uLnkgLSB0aGlzLmxhc3REcmFnLnk7XHJcblx0XHRcclxuXHRcdGlmIChkeCAhPSAwLjAgfHwgZHkgIT0gMC4wKXtcclxuXHRcdFx0dGhpcy5hbmdsZS54IC09IEtUTWF0aC5kZWdUb1JhZChkeCAqIHRoaXMuc2Vuc2l0aXZpdHkueCk7XHJcblx0XHRcdHRoaXMuYW5nbGUueSAtPSBLVE1hdGguZGVnVG9SYWQoZHkgKiB0aGlzLnNlbnNpdGl2aXR5LnkpO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5zZXRDYW1lcmFQb3NpdGlvbigpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLmxhc3REcmFnLmNvcHkoSW5wdXQuX21vdXNlLnBvc2l0aW9uKTtcclxuXHR9ZWxzZXtcclxuXHRcdHRoaXMubGFzdERyYWcgPSBudWxsO1xyXG5cdH1cclxuXHRcclxuXHRpZiAoSW5wdXQuaXNNb3VzZURvd24oSW5wdXQudk1vdXNlLlJJR0hUKSl7XHJcblx0XHRpZiAodGhpcy5sYXN0UGFuID09IG51bGwpIHRoaXMubGFzdFBhbiA9IElucHV0Ll9tb3VzZS5wb3NpdGlvbi5jbG9uZSgpO1xyXG5cdFx0XHJcblx0XHR2YXIgZHggPSBJbnB1dC5fbW91c2UucG9zaXRpb24ueCAtIHRoaXMubGFzdFBhbi54O1xyXG5cdFx0dmFyIGR5ID0gSW5wdXQuX21vdXNlLnBvc2l0aW9uLnkgLSB0aGlzLmxhc3RQYW4ueTtcclxuXHRcdFxyXG5cdFx0aWYgKGR4ICE9IDAuMCB8fCBkeSAhPSAwLjApe1xyXG5cdFx0XHR2YXIgdGhldGEgPSAtdGhpcy5hbmdsZS55O1xyXG5cdFx0XHR2YXIgYW5nID0gLXRoaXMuYW5nbGUueCAtIEtUTWF0aC5QSV8yO1xyXG5cdFx0XHR2YXIgY29zID0gTWF0aC5jb3MoYW5nKTtcclxuXHRcdFx0dmFyIHNpbiA9IE1hdGguc2luKGFuZyk7XHJcblx0XHRcdHZhciBjb3NUID0gTWF0aC5jb3ModGhldGEpO1xyXG5cdFx0XHR2YXIgc2luVCA9IE1hdGguc2luKHRoZXRhKTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMudGFyZ2V0LnggLT0gY29zICogZHggKiB0aGlzLnNlbnNpdGl2aXR5LnggLyAxMDtcclxuXHRcdFx0dGhpcy50YXJnZXQueSArPSBjb3NUICogZHkgKiB0aGlzLnNlbnNpdGl2aXR5LnkgLyAxMDtcclxuXHRcdFx0dGhpcy50YXJnZXQueiAtPSBzaW4gKiBkeCAqIHRoaXMuc2Vuc2l0aXZpdHkueCAvIDEwO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5zZXRDYW1lcmFQb3NpdGlvbigpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLmxhc3RQYW4uY29weShJbnB1dC5fbW91c2UucG9zaXRpb24pO1xyXG5cdH1lbHNle1xyXG5cdFx0dGhpcy5sYXN0UGFuID0gbnVsbDtcclxuXHR9XHJcbn07XHJcblxyXG5PcmJpdEFuZFBhbi5wcm90b3R5cGUuc2V0Q2FtZXJhUG9zaXRpb24gPSBmdW5jdGlvbigpe1xyXG5cdHRoaXMuYW5nbGUueCA9ICh0aGlzLmFuZ2xlLnggKyBLVE1hdGguUEkyKSAlIEtUTWF0aC5QSTI7XHJcblx0dGhpcy5hbmdsZS55ID0gKHRoaXMuYW5nbGUueSArIEtUTWF0aC5QSTIpICUgS1RNYXRoLlBJMjtcclxuXHRcclxuXHRpZiAodGhpcy5hbmdsZS55IDwgS1RNYXRoLlBJICYmIHRoaXMuYW5nbGUueSA+PSBLVE1hdGguUElfMikgdGhpcy5hbmdsZS55ID0gS1RNYXRoLmRlZ1RvUmFkKDg5LjkpO1xyXG5cdGlmICh0aGlzLmFuZ2xlLnkgPiBLVE1hdGguUEkgJiYgdGhpcy5hbmdsZS55IDw9IEtUTWF0aC5QSTNfMikgdGhpcy5hbmdsZS55ID0gS1RNYXRoLmRlZ1RvUmFkKDI3MC45KTtcclxuXHRpZiAodGhpcy56b29tIDw9IDAuMykgdGhpcy56b29tID0gMC4zO1xyXG5cdFxyXG5cdHZhciBjb3NUID0gTWF0aC5jb3ModGhpcy5hbmdsZS55KTtcclxuXHR2YXIgc2luVCA9IE1hdGguc2luKHRoaXMuYW5nbGUueSk7XHJcblx0XHJcblx0dmFyIHggPSB0aGlzLnRhcmdldC54ICsgTWF0aC5jb3ModGhpcy5hbmdsZS54KSAqIGNvc1QgKiB0aGlzLnpvb207XHJcblx0dmFyIHkgPSB0aGlzLnRhcmdldC55ICsgc2luVCAqIHRoaXMuem9vbTtcclxuXHR2YXIgeiA9IHRoaXMudGFyZ2V0LnogLSBNYXRoLnNpbih0aGlzLmFuZ2xlLngpICogY29zVCAqIHRoaXMuem9vbTtcclxuXHRcclxuXHR0aGlzLmNhbWVyYS5wb3NpdGlvbi5zZXQoeCwgeSwgeik7XHJcblx0dGhpcy5jYW1lcmEubG9va0F0KHRoaXMudGFyZ2V0KTtcclxufTtcclxuIiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxudmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcblxyXG5mdW5jdGlvbiBTY2VuZShwYXJhbXMpe1xyXG5cdHRoaXMuX19rdHNjZW5lID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLm1lc2hlcyA9IFtdO1xyXG5cdHRoaXMubGlnaHRzID0gW107XHJcblx0dGhpcy5zaGFkaW5nTW9kZSA9IFsnQkFTSUMnLCAnTEFNQkVSVCddO1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnVzZUxpZ2h0aW5nID0gKHBhcmFtcy51c2VMaWdodGluZyk/IHRydWUgOiBmYWxzZTtcclxuXHR0aGlzLmFtYmllbnRMaWdodCA9IChwYXJhbXMuYW1iaWVudExpZ2h0KT8gbmV3IENvbG9yKHBhcmFtcy5hbWJpZW50TGlnaHQpIDogbnVsbDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY2VuZTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihvYmplY3Qpe1xyXG5cdGlmIChvYmplY3QuX19rdG1lc2gpe1xyXG5cdFx0dGhpcy5tZXNoZXMucHVzaChvYmplY3QpO1xyXG5cdH1lbHNlIGlmIChvYmplY3QuX19rdGRpckxpZ2h0IHx8IG9iamVjdC5fX2t0cG9pbnRsaWdodCl7XHJcblx0XHR0aGlzLmxpZ2h0cy5wdXNoKG9iamVjdCk7XHJcblx0fWVsc2V7XHJcblx0XHR0aHJvdyBcIkNhbid0IGFkZCB0aGUgb2JqZWN0IHRvIHRoZSBzY2VuZVwiO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5kcmF3TWVzaCA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSl7XHJcblx0aWYgKCFtZXNoLmdlb21ldHJ5LnJlYWR5KSByZXR1cm47XHJcblx0XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0XHJcblx0dmFyIG1hdGVyaWFsID0gbWVzaC5tYXRlcmlhbDtcclxuXHR2YXIgc2hhZGVyID0gbWF0ZXJpYWwuc2hhZGVyO1xyXG5cdFxyXG5cdEtULnN3aXRjaFByb2dyYW0oc2hhZGVyKTtcclxuXHR0aGlzLnNldE1hdGVyaWFsQXR0cmlidXRlcyhtZXNoLm1hdGVyaWFsKTtcclxuXHRcclxuXHRtYXRlcmlhbC5zZW5kQXR0cmliRGF0YShtZXNoLCBjYW1lcmEsIHRoaXMpO1xyXG5cdG1hdGVyaWFsLnNlbmRVbmlmb3JtRGF0YShtZXNoLCBjYW1lcmEsIHRoaXMpO1xyXG5cdFxyXG5cdGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG1lc2guZ2VvbWV0cnkuZmFjZXNCdWZmZXIpO1xyXG5cdGdsLmRyYXdFbGVtZW50cyhnbFttYXRlcmlhbC5kcmF3QXNdLCBtZXNoLmdlb21ldHJ5LmZhY2VzQnVmZmVyLm51bUl0ZW1zLCBnbC5VTlNJR05FRF9TSE9SVCwgMCk7XHJcbn07XHJcblxyXG5TY2VuZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oY2FtZXJhKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHR2YXIgYmMgPSBjYW1lcmEuYmFja2dyb3VuZENvbG9yLmdldFJHQkEoKTtcclxuXHRnbC5jbGVhckNvbG9yKGJjWzBdLCBiY1sxXSwgYmNbMl0sIGJjWzNdKTtcclxuXHRnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XHJcblx0XHJcblx0Z2wuZGlzYWJsZSggZ2wuQkxFTkQgKTsgXHJcblx0dmFyIHRyYW5zcGFyZW50cyA9IFtdO1xyXG5cdFxyXG5cdGlmIChjYW1lcmEuY29udHJvbHMpIGNhbWVyYS5jb250cm9scy51cGRhdGUoKTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMubWVzaGVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIG1lc2ggPSB0aGlzLm1lc2hlc1tpXTtcclxuXHRcdGlmICghbWVzaC52aXNpYmxlKSBjb250aW51ZTtcclxuXHRcdGlmIChtZXNoLm1hdGVyaWFsLm9wYWNpdHkgPT0gMC4wKSBjb250aW51ZTtcclxuXHRcdFxyXG5cdFx0dmFyIHNoYWRpbmcgPSB0aGlzLnNoYWRpbmdNb2RlLmluZGV4T2YobWVzaC5tYXRlcmlhbC5zaGFkaW5nKTtcclxuXHRcdGlmIChzaGFkaW5nID09IDEpe1xyXG5cdFx0XHRpZiAobWVzaC5tYXRlcmlhbC5vcGFjaXR5ICE9IDEuMCl7XHJcblx0XHRcdFx0dHJhbnNwYXJlbnRzLnB1c2gobWVzaCk7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5kcmF3TWVzaChtZXNoLCBjYW1lcmEpO1xyXG5cdH1cclxuXHRcclxuXHRnbC5lbmFibGUoIGdsLkJMRU5EICk7IFxyXG5cdGZvciAodmFyIGk9MCxsZW49dHJhbnNwYXJlbnRzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIG1lc2ggPSB0cmFuc3BhcmVudHNbaV07XHJcblx0XHR0aGlzLmRyYXdNZXNoKG1lc2gsIGNhbWVyYSk7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuXG5TY2VuZS5wcm90b3R5cGUuc2V0TWF0ZXJpYWxBdHRyaWJ1dGVzID0gZnVuY3Rpb24obWF0ZXJpYWwpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdHZhciBjdWxsID0gXCJCQUNLXCI7XHJcblx0aWYgKG1hdGVyaWFsLmRyYXdGYWNlcyA9PSAnQkFDSycpeyBjdWxsID0gXCJGUk9OVFwiOyB9XHJcblx0ZWxzZSBpZiAobWF0ZXJpYWwuZHJhd0ZhY2VzID09ICdCT1RIJyl7IGN1bGwgPSBcIlwiOyB9XHJcblx0XHJcblx0aWYgKGN1bGwgIT0gXCJcIil7XHJcblx0XHRnbC5lbmFibGUoZ2wuQ1VMTF9GQUNFKTtcclxuXHRcdGdsLmN1bGxGYWNlKGdsW2N1bGxdKTtcclxuXHR9ZWxzZXtcclxuXHRcdGdsLmRpc2FibGUoZ2wuQ1VMTF9GQUNFKTtcclxuXHR9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGJhc2ljOiB7XHJcblx0XHR2ZXJ0ZXhTaGFkZXI6IFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzIgYVRleHR1cmVDb29yZDsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleFBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFwiYXR0cmlidXRlIGxvd3AgdmVjNCBhVmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdU1WUE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWM0IHVNYXRlcmlhbENvbG9yOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZWZXJ0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIgKyAgXHJcblx0XHRcdFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgKyBcclxuXHRcdFx0XHRcImdsX1Bvc2l0aW9uID0gdU1WUE1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcdFwidlZlcnRleENvbG9yID0gYVZlcnRleENvbG9yICogdU1hdGVyaWFsQ29sb3I7IFwiICtcclxuXHRcdFx0XHRcInZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkOyBcIiArIFxyXG5cdFx0XHRcIn0gXCIgLFxyXG5cdFx0XHRcclxuXHRcdGZyYWdtZW50U2hhZGVyOiBcclxuXHRcdFx0XCJ1bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZVNhbXBsZXI7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdUhhc1RleHR1cmU7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMiB1VGV4dHVyZVJlcGVhdDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMyIHVUZXh0dXJlT2Zmc2V0OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzQgdUdlb21ldHJ5VVY7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICsgXHJcblx0XHRcdFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWM0IGNvbG9yID0gdlZlcnRleENvbG9yOyBcIiArIFxyXG5cdFx0XHRcdFwiaWYgKHVIYXNUZXh0dXJlKXsgXCIgKyBcclxuXHRcdFx0XHRcdFwibWVkaXVtcCBmbG9hdCB0eCA9IHVHZW9tZXRyeVVWLnggKyBtb2QodVRleHR1cmVPZmZzZXQueCArIHZUZXh0dXJlQ29vcmQucyAqIHVUZXh0dXJlUmVwZWF0LnggLSB1R2VvbWV0cnlVVi54LCB1R2VvbWV0cnlVVi56IC0gdUdlb21ldHJ5VVYueCk7XCIgK1xyXG5cdFx0XHRcdFx0XCJtZWRpdW1wIGZsb2F0IHR5ID0gdUdlb21ldHJ5VVYueSArIG1vZCh1VGV4dHVyZU9mZnNldC55ICsgdlRleHR1cmVDb29yZC50ICogdVRleHR1cmVSZXBlYXQueSAtIHVHZW9tZXRyeVVWLnksIHVHZW9tZXRyeVVWLncgLSB1R2VvbWV0cnlVVi55KTtcIiArXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFwibWVkaXVtcCB2ZWM0IHRleENvbG9yID0gdGV4dHVyZTJEKHVUZXh0dXJlU2FtcGxlciwgdmVjMih0eCwgdHkpKTsgXCIgK1xyXG5cdFx0XHRcdFx0XCJjb2xvciAqPSB0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwifSBcIiArIFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwiZ2xfRnJhZ0NvbG9yID0gY29sb3I7XCIgKyBcclxuXHRcdFx0XCJ9XCJcclxuXHR9LFxyXG5cdFxyXG5cdFxyXG5cdGxhbWJlcnQ6IHtcclxuXHRcdHZlcnRleFNoYWRlcjogXHJcblx0XHRcdFwic3RydWN0IExpZ2h0eyBcIiArXHJcblx0XHRcdCAgICBcImxvd3AgdmVjMyBwb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHQgICAgXCJsb3dwIHZlYzMgY29sb3I7IFwiICtcclxuXHRcdFx0ICAgIFwibG93cCB2ZWMzIGRpcmVjdGlvbjsgXCIgK1xyXG5cdFx0XHQgICAgXCJsb3dwIGZsb2F0IGludGVuc2l0eTsgXCIgK1xyXG5cdFx0XHRcIn07IFwiICtcclxuXHRcdFx0ICAgIFxyXG5cdFx0XHRcInVuaWZvcm0gTGlnaHQgbGlnaHRzWzhdOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBpbnQgdXNlZExpZ2h0czsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMyIGFUZXh0dXJlQ29vcmQ7IFwiICtcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBsb3dwIHZlYzQgYVZlcnRleENvbG9yOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleE5vcm1hbDsgXCIgKyBcclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVNVk1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVQTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzQgdU1hdGVyaWFsQ29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVVc2VMaWdodGluZzsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVNb2RlbE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQzIHVOb3JtYWxNYXRyaXg7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzMgdUFtYmllbnRMaWdodENvbG9yOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZWZXJ0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIgKyAgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdkxpZ2h0V2VpZ2h0OyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJtZWRpdW1wIHZlYzMgZ2V0TGlnaHRXZWlnaHQobWVkaXVtcCB2ZWMzIG5vcm1hbCwgbWVkaXVtcCB2ZWMzIGRpcmVjdGlvbiwgbG93cCB2ZWMzIGNvbG9yLCBsb3dwIGZsb2F0IGludGVuc2l0eSl7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgbGlnaHREb3QgPSBtYXgoZG90KG5vcm1hbCwgZGlyZWN0aW9uKSwgMC4wKTsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGxpZ2h0V2VpZ2h0ID0gKGNvbG9yICogbGlnaHREb3QgKiBpbnRlbnNpdHkpOyBcIiArXHJcblx0XHRcdFx0XCJyZXR1cm4gbGlnaHRXZWlnaHQ7IFwiICtcclxuXHRcdFx0XCJ9XCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICsgXHJcblx0XHRcdFx0XCJ2ZWM0IG1vZGVsVmlld1Bvc2l0aW9uID0gdU1WTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7IFwiICtcclxuXHRcdFx0XHRcImdsX1Bvc2l0aW9uID0gdVBNYXRyaXggKiBtb2RlbFZpZXdQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XHRcInZMaWdodFdlaWdodCA9IHVBbWJpZW50TGlnaHRDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwiaWYgKHVVc2VMaWdodGluZyl7IFwiICtcclxuXHRcdFx0XHRcdFwidmVjMyB2ZXJ0ZXhNb2RlbFBvc2l0aW9uID0gKHVNb2RlbE1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eXo7IFwiICtcclxuXHRcdFx0XHRcdFwiZm9yIChpbnQgaT0wO2k8ODtpKyspeyBcIiArXHJcblx0XHRcdFx0XHRcdFwiaWYgKGkgPj0gdXNlZExpZ2h0cyl7XCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwiYnJlYWs7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJ9XCIgK1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XCJMaWdodCBsID0gbGlnaHRzW2ldOyBcIiArXHJcblx0XHRcdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGxQb3MgPSBsLnBvc2l0aW9uIC0gdmVydGV4TW9kZWxQb3NpdGlvbjtcIiArXHJcblx0XHRcdFx0XHRcdFwibWVkaXVtcCBmbG9hdCBsRGlzdGFuY2UgPSBsZW5ndGgobFBvcykgLyAyLjA7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJpZiAobGVuZ3RoKGwucG9zaXRpb24pID09IDAuMCl7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcImxEaXN0YW5jZSA9IDEuMDsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwibFBvcyA9IHZlYzMoMC4wKTsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjMyBsaWdodERpcmVjdGlvbiA9IGwuZGlyZWN0aW9uICsgbm9ybWFsaXplKGxQb3MpOyBcIiArXHJcblx0XHRcdFx0XHRcdFwidkxpZ2h0V2VpZ2h0ICs9IGdldExpZ2h0V2VpZ2h0KGFWZXJ0ZXhOb3JtYWwsIGxpZ2h0RGlyZWN0aW9uLCBsLmNvbG9yLCBsLmludGVuc2l0eSkgLyBsRGlzdGFuY2U7IFwiICtcclxuXHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHQgXHJcblx0XHRcdFx0XCJ2VmVydGV4Q29sb3IgPSBhVmVydGV4Q29sb3IgKiB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwidlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7IFwiICsgIFxyXG5cdFx0XHRcIn0gXCIgLFxyXG5cdFx0XHRcclxuXHRcdGZyYWdtZW50U2hhZGVyOiBcclxuXHRcdFx0XCJ1bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZVNhbXBsZXI7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdUhhc1RleHR1cmU7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgZmxvYXQgdU9wYWNpdHk7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMiB1VGV4dHVyZVJlcGVhdDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMyIHVUZXh0dXJlT2Zmc2V0OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzQgdUdlb21ldHJ5VVY7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdkxpZ2h0V2VpZ2h0OyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjNCBjb2xvciA9IHZWZXJ0ZXhDb2xvcjsgXCIgKyBcclxuXHRcdFx0XHRcImlmICh1SGFzVGV4dHVyZSl7IFwiICsgXHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgdHggPSB1R2VvbWV0cnlVVi54ICsgbW9kKHVUZXh0dXJlT2Zmc2V0LnggKyB2VGV4dHVyZUNvb3JkLnMgKiB1VGV4dHVyZVJlcGVhdC54IC0gdUdlb21ldHJ5VVYueCwgdUdlb21ldHJ5VVYueiAtIHVHZW9tZXRyeVVWLngpO1wiICtcclxuXHRcdFx0XHRcdFwibWVkaXVtcCBmbG9hdCB0eSA9IHVHZW9tZXRyeVVWLnkgKyBtb2QodVRleHR1cmVPZmZzZXQueSArIHZUZXh0dXJlQ29vcmQudCAqIHVUZXh0dXJlUmVwZWF0LnkgLSB1R2VvbWV0cnlVVi55LCB1R2VvbWV0cnlVVi53IC0gdUdlb21ldHJ5VVYueSk7XCIgK1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjNCB0ZXhDb2xvciA9IHRleHR1cmUyRCh1VGV4dHVyZVNhbXBsZXIsIHZlYzIodHgsIHR5KSk7IFwiICtcclxuXHRcdFx0XHRcdFwiY29sb3IgKj0gdGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHRcIn0gXCIgKyBcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcImNvbG9yLnJnYiAqPSB2TGlnaHRXZWlnaHQ7IFwiICsgXHJcblx0XHRcdFx0XCJnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLnJnYiwgY29sb3IuYSAqIHVPcGFjaXR5KTsgXCIgKyBcclxuXHRcdFx0XCJ9XCJcclxuXHR9LFxyXG5cdFxyXG5cdFxyXG5cdHBob25nOiB7XHJcblx0XHR2ZXJ0ZXhTaGFkZXI6IFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzIgYVRleHR1cmVDb29yZDsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleFBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFwiYXR0cmlidXRlIGxvd3AgdmVjNCBhVmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjMyBhVmVydGV4Tm9ybWFsOyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdU1WTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdVBNYXRyaXg7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjNCB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVVzZUxpZ2h0aW5nOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdU1vZGVsTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDMgdU5vcm1hbE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMyB1QW1iaWVudExpZ2h0Q29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdlZlcnRleENvbG9yOyBcIiArXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDtcIiArICBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMyB2TGlnaHRXZWlnaHQ7IFwiICtcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMyB2Tm9ybWFsOyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMzIHZQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICsgXHJcblx0XHRcdFx0XCJ2ZWM0IG1vZGVsVmlld1Bvc2l0aW9uID0gdU1WTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7IFwiICtcclxuXHRcdFx0XHRcImdsX1Bvc2l0aW9uID0gdVBNYXRyaXggKiBtb2RlbFZpZXdQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XHRcImlmICh1VXNlTGlnaHRpbmcpeyBcIiArIFxyXG5cdFx0XHRcdFx0XCJ2Tm9ybWFsID0gdU5vcm1hbE1hdHJpeCAqIGFWZXJ0ZXhOb3JtYWw7IFwiICtcclxuXHRcdFx0XHRcdFwidkxpZ2h0V2VpZ2h0ID0gdUFtYmllbnRMaWdodENvbG9yOyBcIiArXHJcblx0XHRcdFx0XCJ9ZWxzZXsgXCIgK1xyXG5cdFx0XHRcdFx0XCJ2TGlnaHRXZWlnaHQgPSB2ZWMzKDEuMCk7IFwiICsgXHJcblx0XHRcdFx0XCJ9XCIgKyAgIFxyXG5cdFx0XHRcdCBcclxuXHRcdFx0XHRcInZQb3NpdGlvbiA9ICh1TW9kZWxNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHl6OyBcIiArXHJcblx0XHRcdFx0XCJ2VmVydGV4Q29sb3IgPSBhVmVydGV4Q29sb3IgKiB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwidlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7IFwiICsgIFxyXG5cdFx0XHRcIn0gXCIgLFxyXG5cdFx0XHRcclxuXHRcdGZyYWdtZW50U2hhZGVyOiBcclxuXHRcdFx0XCJzdHJ1Y3QgTGlnaHR7IFwiICtcclxuXHRcdFx0ICAgIFwibG93cCB2ZWMzIHBvc2l0aW9uOyBcIiArXHJcblx0XHRcdCAgICBcImxvd3AgdmVjMyBjb2xvcjsgXCIgK1xyXG5cdFx0XHQgICAgXCJsb3dwIHZlYzMgZGlyZWN0aW9uOyBcIiArXHJcblx0XHRcdCAgICBcImxvd3AgZmxvYXQgaW50ZW5zaXR5OyBcIiArXHJcblx0XHRcdFwifTsgXCIgK1xyXG5cdFx0XHQgICAgXHJcblx0XHRcdFwidW5pZm9ybSBMaWdodCBsaWdodHNbOF07IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGludCB1c2VkTGlnaHRzOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gYm9vbCB1SGFzVGV4dHVyZTsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gc2FtcGxlcjJEIHVUZXh0dXJlU2FtcGxlcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVVzZVNwZWN1bGFyTWFwOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBzYW1wbGVyMkQgdVNwZWN1bGFyTWFwU2FtcGxlcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVVzZUxpZ2h0aW5nOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIGZsb2F0IHVPcGFjaXR5OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIHZlYzIgdVRleHR1cmVSZXBlYXQ7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGxvd3AgdmVjMiB1VGV4dHVyZU9mZnNldDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCB2ZWM0IHVHZW9tZXRyeVVWOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzMgdUNhbWVyYVBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbG93cCB2ZWMzIHVTcGVjdWxhckNvbG9yOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBsb3dwIGZsb2F0IHVTaGluaW5lc3M7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdkxpZ2h0V2VpZ2h0OyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMzIHZOb3JtYWw7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdlBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcIm1lZGl1bXAgdmVjMyBnZXRMaWdodFdlaWdodChtZWRpdW1wIHZlYzMgbm9ybWFsLCBtZWRpdW1wIHZlYzMgZGlyZWN0aW9uLCBsb3dwIHZlYzMgY29sb3IsIGxvd3AgZmxvYXQgaW50ZW5zaXR5KXsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCBmbG9hdCBsaWdodERvdCA9IG1heChkb3Qobm9ybWFsLCBkaXJlY3Rpb24pLCAwLjApOyBcIiArXHJcblx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgbGlnaHRXZWlnaHQgPSAoY29sb3IgKiBsaWdodERvdCAqIGludGVuc2l0eSk7IFwiICtcclxuXHRcdFx0XHRcInJldHVybiBsaWdodFdlaWdodDsgXCIgK1xyXG5cdFx0XHRcIn1cIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgK1xyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWM0IGNvbG9yID0gdlZlcnRleENvbG9yOyBcIiArXHJcblx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgbm9ybWFsID0gbm9ybWFsaXplKHZOb3JtYWwpOyBcIiArXHJcblx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgY2FtZXJhRGlyZWN0aW9uID0gbm9ybWFsaXplKHVDYW1lcmFQb3NpdGlvbik7IFwiICtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgdHg7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgdHk7IFwiICtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcImlmICh1SGFzVGV4dHVyZSl7IFwiICsgXHJcblx0XHRcdFx0XHRcInR4ID0gdUdlb21ldHJ5VVYueCArIG1vZCh1VGV4dHVyZU9mZnNldC54ICsgdlRleHR1cmVDb29yZC5zICogdVRleHR1cmVSZXBlYXQueCAtIHVHZW9tZXRyeVVWLngsIHVHZW9tZXRyeVVWLnogLSB1R2VvbWV0cnlVVi54KTtcIiArXHJcblx0XHRcdFx0XHRcInR5ID0gdUdlb21ldHJ5VVYueSArIG1vZCh1VGV4dHVyZU9mZnNldC55ICsgdlRleHR1cmVDb29yZC50ICogdVRleHR1cmVSZXBlYXQueSAtIHVHZW9tZXRyeVVWLnksIHVHZW9tZXRyeVVWLncgLSB1R2VvbWV0cnlVVi55KTtcIiArXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFwibWVkaXVtcCB2ZWM0IHRleENvbG9yID0gdGV4dHVyZTJEKHVUZXh0dXJlU2FtcGxlciwgdmVjMih0eCwgdHkpKTsgXCIgK1xyXG5cdFx0XHRcdFx0XCJjb2xvciAqPSB0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwifSBcIiArIFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwibWVkaXVtcCB2ZWMzIHBob25nTGlnaHRXZWlnaHQgPSB2ZWMzKDAuMCk7IFwiICsgXHJcblx0XHRcdFx0XCJpZiAodVVzZUxpZ2h0aW5nKXsgXCIgK1xyXG5cdFx0XHRcdFx0XCJmb3IgKGludCBpPTA7aTw4O2krKyl7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJpZiAoaSA+PSB1c2VkTGlnaHRzKXtcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJicmVhazsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcIn1cIiArXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcIkxpZ2h0IGwgPSBsaWdodHNbaV07IFwiICtcclxuXHRcdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgbFBvcyA9IGwucG9zaXRpb24gLSB2UG9zaXRpb247XCIgK1xyXG5cdFx0XHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgbERpc3RhbmNlID0gbGVuZ3RoKGxQb3MpIC8gMi4wOyBcIiArXHJcblx0XHRcdFx0XHRcdFwiaWYgKGxlbmd0aChsLnBvc2l0aW9uKSA9PSAwLjApeyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJsRGlzdGFuY2UgPSAxLjA7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcImxQb3MgPSB2ZWMzKDAuMCk7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJ9IFwiICtcclxuXHRcdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzMgbGlnaHREaXJlY3Rpb24gPSBsLmRpcmVjdGlvbiArIG5vcm1hbGl6ZShsUG9zKTsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcInBob25nTGlnaHRXZWlnaHQgKz0gZ2V0TGlnaHRXZWlnaHQobm9ybWFsLCBsaWdodERpcmVjdGlvbiwgbC5jb2xvciwgbC5pbnRlbnNpdHkpIC8gbERpc3RhbmNlOyBcIiArXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XCJsb3dwIGZsb2F0IHNoaW5pbmVzcyA9IHVTaGluaW5lc3M7IFwiICsgXHJcblx0XHRcdFx0XHRcdFwiaWYgKHVVc2VTcGVjdWxhck1hcCl7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcInNoaW5pbmVzcyA9IHRleHR1cmUyRCh1U3BlY3VsYXJNYXBTYW1wbGVyLCB2ZWMyKHR4LCB0eSkpLnIgKiAyNTUuMDsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XCJpZiAoc2hpbmluZXNzID4gMC4wICYmIHNoaW5pbmVzcyA8IDI1NS4wKXsgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwibWVkaXVtcCB2ZWMzIGhhbGZBbmdsZSA9IG5vcm1hbGl6ZShjYW1lcmFEaXJlY3Rpb24gKyBsaWdodERpcmVjdGlvbik7IFwiICtcclxuXHRcdFx0XHRcdFx0XHRcIm1lZGl1bXAgZmxvYXQgc3BlY0RvdCA9IG1heChkb3QoaGFsZkFuZ2xlLCBub3JtYWwpLCAwLjApOyBcIiArXHJcblx0XHRcdFx0XHRcdFx0XCJjb2xvciArPSB2ZWM0KHVTcGVjdWxhckNvbG9yLCAxLjApICogcG93KHNwZWNEb3QsIHNoaW5pbmVzcyk7IFwiICsgXHJcblx0XHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XHRcIn0gXCIgK1xyXG5cdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0XCJjb2xvci5yZ2IgKj0gdkxpZ2h0V2VpZ2h0ICsgcGhvbmdMaWdodFdlaWdodDsgXCIgKyBcclxuXHRcdFx0XHRcImdsX0ZyYWdDb2xvciA9IHZlYzQoY29sb3IucmdiLCBjb2xvci5hICogdU9wYWNpdHkpOyBcIiArIFxyXG5cdFx0XHRcIn1cIlxyXG5cdH1cclxufTsiLCJ2YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL0tUVXRpbHMnKTtcclxudmFyIFZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG5cclxuZnVuY3Rpb24gVGV4dHVyZShzcmMsIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0dGV4dHVyZSA9IHRydWU7XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMubWluRmlsdGVyID0gKHBhcmFtcy5taW5GaWx0ZXIpPyBwYXJhbXMubWluRmlsdGVyIDogJ0xJTkVBUic7XHJcblx0dGhpcy5tYWdGaWx0ZXIgPSAocGFyYW1zLm1hZ0ZpbHRlcik/IHBhcmFtcy5tYWdGaWx0ZXIgOiAnTElORUFSJztcclxuXHR0aGlzLndyYXBTID0gKHBhcmFtcy5TV3JhcHBpbmcpPyBwYXJhbXMuU1dyYXBwaW5nIDogJ1JFUEVBVCc7XHJcblx0dGhpcy53cmFwVCA9IChwYXJhbXMuVFdyYXBwaW5nKT8gcGFyYW1zLlRXcmFwcGluZyA6ICdSRVBFQVQnO1xyXG5cdHRoaXMucmVwZWF0ID0gKHBhcmFtcy5yZXBlYXQpPyBwYXJhbXMucmVwZWF0IDogbmV3IFZlY3RvcjIoMS4wLCAxLjApO1xyXG5cdHRoaXMub2Zmc2V0ID0gKHBhcmFtcy5vZmZzZXQpPyBwYXJhbXMub2Zmc2V0IDogbmV3IFZlY3RvcjIoMC4wLCAwLjApO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVlID0gbnVsbDtcclxuXHRcclxuXHR0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XHJcblx0dGhpcy5pbWFnZS5zcmMgPSBzcmM7XHJcblx0dGhpcy5pbWFnZS5yZWFkeSA9IGZhbHNlO1xyXG5cdFxyXG5cdHZhciBUID0gdGhpcztcclxuXHRVdGlscy5hZGRFdmVudCh0aGlzLmltYWdlLCBcImxvYWRcIiwgZnVuY3Rpb24oKXtcclxuXHRcdFQucGFyc2VUZXh0dXJlKCk7IFxyXG5cdH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHR1cmU7XHJcblxyXG5UZXh0dXJlLnByb3RvdHlwZS5wYXJzZVRleHR1cmUgPSBmdW5jdGlvbigpe1xyXG5cdGlmICh0aGlzLmltYWdlLnJlYWR5KSByZXR1cm47XHJcblx0XHJcblx0dGhpcy5pbWFnZS5yZWFkeSA9IHRydWU7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0XHJcblx0dGhpcy50ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xyXG5cdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSk7XHJcblx0XHJcblx0Z2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX0ZMSVBfWV9XRUJHTCwgdHJ1ZSk7XHJcblx0XHJcblx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCB0aGlzLmltYWdlKTtcclxuXHRcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2xbdGhpcy5tYWdGaWx0ZXJdKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2xbdGhpcy5taW5GaWx0ZXJdKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbFt0aGlzLndyYXBTXSk7XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2xbdGhpcy53cmFwVF0pO1xyXG5cdFxyXG5cdGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xyXG5cdFxyXG5cdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRnZXQ6IGZ1bmN0aW9uKGVsZW1lbnQpe1xyXG5cdFx0aWYgKGVsZW1lbnQuY2hhckF0KDApID09IFwiI1wiKXtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQucmVwbGFjZShcIiNcIiwgXCJcIikpO1xyXG5cdFx0fWVsc2UgaWYgKGVsZW1lbnQuY2hhckF0KDApID09IFwiLlwiKXtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoZWxlbWVudC5yZXBsYWNlKFwiLlwiLCBcIlwiKSk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKGVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0XHJcblx0YWRkRXZlbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIHR5cGUsIGNhbGxiYWNrKXtcclxuXHRcdGlmIChlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIpe1xyXG5cdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIGZhbHNlKTtcclxuXHRcdH1lbHNlIGlmIChlbGVtZW50LmF0dGFjaEV2ZW50KXtcclxuXHRcdFx0ZWxlbWVudC5hdHRhY2hFdmVudChcIm9uXCIgKyB0eXBlLCBjYWxsYmFjayk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRnZXRIdHRwOiBmdW5jdGlvbigpe1xyXG5cdFx0aWYgKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCl7XHJcblx0XHRcdHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdH1lbHNlIGlmICh3aW5kb3cuQWN0aXZlWE9iamVjdCl7XHJcblx0XHRcdGh0dHAgPSBuZXcgd2luZG93LkFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MSFRUUFwiKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fSxcclxuXHRcclxuXHRnZXRGaWxlQ29udGVudDogZnVuY3Rpb24oZmlsZVVSTCwgY2FsbGJhY2spe1xyXG5cdFx0dmFyIGh0dHAgPSB0aGlzLmdldEh0dHAoKTtcclxuXHRcdGh0dHAub3BlbignR0VUJywgZmlsZVVSTCwgdHJ1ZSk7XHJcblx0XHRodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG5cdCAgXHRcdGlmIChodHRwLnJlYWR5U3RhdGUgPT0gNCAmJiBodHRwLnN0YXR1cyA9PSAyMDApIHtcclxuXHRcdFx0XHRpZiAoY2FsbGJhY2spe1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soaHR0cC5yZXNwb25zZVRleHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdGh0dHAuc2VuZCgpO1xyXG5cdH1cclxufTtcclxuIiwiZnVuY3Rpb24gVmVjdG9yMih4LCB5KXtcclxuXHR0aGlzLl9fa3R2MiA9IHRydWU7XHJcblx0XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBWZWN0b3IyO1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XHJcblx0XHJcblx0cmV0dXJuIGxlbmd0aDtcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoKCk7XHJcblx0XHJcblx0dGhpcy54IC89IGxlbmd0aDtcclxuXHR0aGlzLnkgLz0gbGVuZ3RoO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24odmVjdG9yMil7XHJcblx0aWYgKCF2ZWN0b3IyLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBwZXJmb3JtIGEgZG90IHByb2R1Y3Qgd2l0aCBhIHZlY3RvcjJcIjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcy54ICogdmVjdG9yMi54ICsgdGhpcy55ICogdmVjdG9yMi55O1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuaW52ZXJ0ID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gdGhpcy5tdWx0aXBseSgtMSk7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uKG51bWJlcil7XHJcblx0dGhpcy54ICo9IG51bWJlcjtcclxuXHR0aGlzLnkgKj0gbnVtYmVyO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odmVjdG9yMil7XHJcblx0aWYgKCF2ZWN0b3IyLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBhZGQgYSB2ZWN0b3IyIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ICs9IHZlY3RvcjIueDtcclxuXHR0aGlzLnkgKz0gdmVjdG9yMi55O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKHZlY3RvcjIpe1xyXG5cdGlmICghdmVjdG9yMi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIHZlY3RvcjIgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHR0aGlzLnggPSB2ZWN0b3IyLng7XHJcblx0dGhpcy55ID0gdmVjdG9yMi55O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSl7XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiBuZXcgVmVjdG9yMih0aGlzLngsIHRoaXMueSk7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbih2ZWN0b3IyKXtcclxuXHRpZiAoIXZlY3RvcjIuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSB2ZWN0b3IyIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0cmV0dXJuICh0aGlzLnggPT0gdmVjdG9yMi54ICYmIHRoaXMueSA9PSB2ZWN0b3IyLnkpO1xyXG59O1xyXG5cclxuVmVjdG9yMi52ZWN0b3JzRGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHZlY3RvcjJfYSwgdmVjdG9yMl9iKXtcclxuXHRpZiAoIXZlY3RvcjJfYS5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczJcIjtcclxuXHRpZiAoIXZlY3RvcjJfYi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczJcIjtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjIodmVjdG9yMl9hLnggLSB2ZWN0b3IyX2IueCwgdmVjdG9yMl9hLnkgLSB2ZWN0b3IyX2IueSk7XHJcbn07XHJcblxyXG5WZWN0b3IyLmZyb21BbmdsZSA9IGZ1bmN0aW9uKHJhZGlhbil7XHJcblx0dmFyIHggPSBNYXRoLmNvcyhyYWRpYW4pO1xyXG5cdHZhciB5ID0gLU1hdGguc2luKHJhZGlhbik7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IyKHgsIHkpO1xyXG59O1xyXG4iLCJmdW5jdGlvbiBWZWN0b3IzKHgsIHksIHope1xyXG5cdHRoaXMuX19rdHYzID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnggPSB4O1xyXG5cdHRoaXMueSA9IHk7XHJcblx0dGhpcy56ID0gejtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yMztcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkgKyB0aGlzLnogKiB0aGlzLnopO1xyXG5cdFxyXG5cdHJldHVybiBsZW5ndGg7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMueCAvPSBsZW5ndGg7XHJcblx0dGhpcy55IC89IGxlbmd0aDtcclxuXHR0aGlzLnogLz0gbGVuZ3RoO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBwZXJmb3JtIGEgZG90IHByb2R1Y3Qgd2l0aCBhIHZlY3RvcjNcIjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcy54ICogdmVjdG9yMy54ICsgdGhpcy55ICogdmVjdG9yMy55ICsgdGhpcy56ICogdmVjdG9yMy56O1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IHBlcmZvcm0gYSBjcm9zcyBwcm9kdWN0IHdpdGggYSB2ZWN0b3IzXCI7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IzKFxyXG5cdFx0dGhpcy55ICogdmVjdG9yMy56IC0gdGhpcy56ICogdmVjdG9yMy55LFxyXG5cdFx0dGhpcy56ICogdmVjdG9yMy54IC0gdGhpcy54ICogdmVjdG9yMy56LFxyXG5cdFx0dGhpcy54ICogdmVjdG9yMy55IC0gdGhpcy55ICogdmVjdG9yMy54XHJcblx0KTtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihudW1iZXIpe1xyXG5cdHRoaXMueCAqPSBudW1iZXI7XHJcblx0dGhpcy55ICo9IG51bWJlcjtcclxuXHR0aGlzLnogKj0gbnVtYmVyO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBhZGQgYSBWZWN0b3IzIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ICs9IHZlY3RvcjMueDtcclxuXHR0aGlzLnkgKz0gdmVjdG9yMy55O1xyXG5cdHRoaXMueiArPSB2ZWN0b3IzLno7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgVmVjdG9yMyB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCA9IHZlY3RvcjMueDtcclxuXHR0aGlzLnkgPSB2ZWN0b3IzLnk7XHJcblx0dGhpcy56ID0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSwgeil7XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMueCwgdGhpcy55LCB0aGlzLnopO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgVmVjdG9yMyB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHJldHVybiAodGhpcy54ID09IHZlY3RvcjMueCAmJiB0aGlzLnkgPT0gdmVjdG9yMy55ICYmIHRoaXMueiA9PSB2ZWN0b3IzLnopO1xyXG59O1xyXG5cclxuVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHZlY3RvcjNfYSwgdmVjdG9yM19iKXtcclxuXHRpZiAoIXZlY3RvcjNfYS5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczNcIjtcclxuXHRpZiAoIXZlY3RvcjNfYi5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczNcIjtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjModmVjdG9yM19hLnggLSB2ZWN0b3IzX2IueCwgdmVjdG9yM19hLnkgLSB2ZWN0b3IzX2IueSwgdmVjdG9yM19hLnogLSB2ZWN0b3IzX2Iueik7XHJcbn07XHJcblxyXG5WZWN0b3IzLmZyb21BbmdsZSA9IGZ1bmN0aW9uKHJhZGlhbl94eiwgcmFkaWFuX3kpe1xyXG5cdHZhciB4ID0gTWF0aC5jb3MocmFkaWFuX3h6KTtcclxuXHR2YXIgeSA9IE1hdGguc2luKHJhZGlhbl95KTtcclxuXHR2YXIgeiA9IC1NYXRoLnNpbihyYWRpYW5feHopO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMyh4LCB5LCB6KTtcclxufTtcclxuIiwiZnVuY3Rpb24gVmVjdG9yNCh4LCB5LCB6LCB3KXtcclxuXHR0aGlzLl9fa3R2NCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcblx0dGhpcy53ID0gdztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yNDtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkgKyB0aGlzLnogKiB0aGlzLnogKyB0aGlzLncgKiB0aGlzLncpO1xyXG5cdFxyXG5cdHJldHVybiBsZW5ndGg7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMueCAvPSBsZW5ndGg7XHJcblx0dGhpcy55IC89IGxlbmd0aDtcclxuXHR0aGlzLnogLz0gbGVuZ3RoO1xyXG5cdHRoaXMudyAvPSBsZW5ndGg7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbih2ZWN0b3I0KXtcclxuXHRpZiAoIXZlY3RvcjQuX19rdHY0KSB0aHJvdyBcIkNhbiBvbmx5IHBlcmZvcm0gYSBkb3QgcHJvZHVjdCB3aXRoIGEgdmVjdG9yNFwiO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzLnggKiB2ZWN0b3I0LnggKyB0aGlzLnkgKiB2ZWN0b3I0LnkgKyB0aGlzLnogKiB2ZWN0b3I0LnogKyB0aGlzLncgKiB2ZWN0b3I0Lnc7XHJcbn07XHJcblxyXG5WZWN0b3I0LnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24obnVtYmVyKXtcclxuXHR0aGlzLnggKj0gbnVtYmVyO1xyXG5cdHRoaXMueSAqPSBudW1iZXI7XHJcblx0dGhpcy56ICo9IG51bWJlcjtcclxuXHR0aGlzLncgKj0gbnVtYmVyO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yNC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odmVjdG9yNCl7XHJcblx0aWYgKCF2ZWN0b3I0Ll9fa3R2NCkgdGhyb3cgXCJDYW4gb25seSBhZGQgYSB2ZWN0b3I0IHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ICs9IHZlY3RvcjQueDtcclxuXHR0aGlzLnkgKz0gdmVjdG9yNC55O1xyXG5cdHRoaXMueiArPSB2ZWN0b3I0Lno7XHJcblx0dGhpcy53ICs9IHZlY3RvcjQudztcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbih2ZWN0b3I0KXtcclxuXHRpZiAoIXZlY3RvcjQuX19rdHY0KSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSB2ZWN0b3I0IHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ID0gdmVjdG9yNC54O1xyXG5cdHRoaXMueSA9IHZlY3RvcjQueTtcclxuXHR0aGlzLnogPSB2ZWN0b3I0Lno7XHJcblx0dGhpcy53ID0gdmVjdG9yNC53O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yNC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSwgeiwgdyl7XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcblx0dGhpcy53ID0gdztcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gbmV3IHZlY3RvcjQodGhpcy54LCB0aGlzLnksIHRoaXMueiwgdGhpcy53KTtcclxufTtcclxuXHJcblZlY3RvcjQucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKHZlY3RvcjQpe1xyXG5cdGlmICghdmVjdG9yNC5fX2t0djQpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIHZlY3RvcjQgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHRyZXR1cm4gKHRoaXMueCA9PSB2ZWN0b3I0LnggJiYgdGhpcy55ID09IHZlY3RvcjQueSAmJiB0aGlzLnogPT0gdmVjdG9yNC56ICYmIHRoaXMudyA9PSB2ZWN0b3I0LncpO1xyXG59O1xyXG5cclxuVmVjdG9yNC52ZWN0b3JzRGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHZlY3RvcjRfYSwgdmVjdG9yNF9iKXtcclxuXHRpZiAoIXZlY3RvcjRfYS5fX2t0djQpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczRcIjtcclxuXHRpZiAoIXZlY3RvcjRfYi5fX2t0djQpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczRcIjtcclxuXHRcclxuXHRyZXR1cm4gbmV3IHZlY3RvcjQodmVjdG9yNF9hLnggLSB2ZWN0b3I0X2IueCwgdmVjdG9yNF9hLnkgLSB2ZWN0b3I0X2IueSwgdmVjdG9yNF9hLnogLSB2ZWN0b3I0X2IueiwgdmVjdHByNF9hLncgLSB2ZWN0b3I0X2Iudyk7XHJcbn07IiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxuS1QuQ2FtZXJhUGVyc3BlY3RpdmUgPSByZXF1aXJlKCcuL0tUQ2FtZXJhUGVyc3BlY3RpdmUnKTtcclxuS1QuQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxuS1QuR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxuS1QuR2VvbWV0cnkzRE1vZGVsID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5M0RNb2RlbCcpO1xyXG5LVC5HZW9tZXRyeUJveCA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeUJveCcpO1xyXG5LVC5HZW9tZXRyeUN5bGluZGVyID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Q3lsaW5kZXInKTtcclxuS1QuR2VvbWV0cnlQbGFuZSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeVBsYW5lJyk7XHJcbktULkdlb21ldHJ5U3BoZXJlID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5U3BoZXJlJyk7XHJcbktULkxpZ2h0RGlyZWN0aW9uYWwgPSByZXF1aXJlKCcuL0tUTGlnaHREaXJlY3Rpb25hbCcpO1xyXG5LVC5MaWdodFBvaW50ID0gcmVxdWlyZSgnLi9LVExpZ2h0UG9pbnQnKTtcclxuS1QuSW5wdXQgPSByZXF1aXJlKCcuL0tUSW5wdXQnKTtcclxuS1QuTWF0ZXJpYWwgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWwnKTtcclxuS1QuTWF0ZXJpYWxCYXNpYyA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbEJhc2ljJyk7XHJcbktULk1hdGVyaWFsTGFtYmVydCA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbExhbWJlcnQnKTtcclxuS1QuTWF0ZXJpYWxQaG9uZyA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbFBob25nJyk7XHJcbktULk1hdGggPSByZXF1aXJlKCcuL0tUTWF0aCcpO1xyXG5LVC5NYXRyaXgzID0gcmVxdWlyZSgnLi9LVE1hdHJpeDMnKTtcclxuS1QuTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcbktULk1lc2ggPSByZXF1aXJlKCcuL0tUTWVzaCcpO1xyXG5LVC5PcmJpdEFuZFBhbiA9IHJlcXVpcmUoJy4vS1RPcmJpdEFuZFBhbicpO1xyXG5LVC5UZXh0dXJlID0gcmVxdWlyZSgnLi9LVFRleHR1cmUnKTtcclxuS1QuVXRpbHMgPSByZXF1aXJlKCcuL0tUVXRpbHMnKTtcclxuS1QuVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcbktULlZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG5LVC5WZWN0b3I0ID0gcmVxdWlyZSgnLi9LVFZlY3RvcjQnKTtcclxuS1QuU2NlbmUgPSByZXF1aXJlKCcuL0tUU2NlbmUnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS1Q7Iiwid2luZG93LktUID0gcmVxdWlyZSgnLi9LcmFtVGVjaCcpOyJdfQ==
