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
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTInput.js":[function(require,module,exports){
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
	this._ktpointlight = true;
	
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
		this.maxAttribLocations = Math.max(this.maxAttribLocations, shader.attributes.length);
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
	
	this.texture = (parameters.texture)? parameters.texture : null;
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

function MaterialBasic(texture, color){
	this.__ktmaterial = true;
	
	var material = new Material({
		texture: texture,
		color: color,
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

},{"./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialLambert.js":[function(require,module,exports){
var Material = require('./KTMaterial');

function MaterialLambert(texture, color, opacity){
	this.__ktmaterial = true;
	
	var material = new Material({
		texture: texture,
		color: color,
		opacity: opacity,
		shader: KT.shaders.lambert
	});
	
	this.texture = material.texture;
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

MaterialLambert.prototype.sendUniformData = function(mesh, camera, scene){
	var gl = KT.gl;
	var geometry = mesh.geometry;
	var transformationMatrix;
	var uniforms = this.shader.uniforms;
	var modelTransformation;
	for (var i=0,len=uniforms.length;i<len;i++){
		var uni = uniforms[i];
		
		if (uni.name == 'uMVMatrix'){
			modelTransformation = mesh.getTransformationMatrix();
			transformationMatrix = modelTransformation.clone().multiply(camera.transformationMatrix);
			gl.uniformMatrix4fv(uni.location, false, transformationMatrix.toFloat32Array());
		}else if (uni.name == 'uPMatrix'){
			gl.uniformMatrix4fv(uni.location, false, camera.perspectiveMatrix.toFloat32Array());
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
			gl.uniform1i(uni.location, (scene.useLighting)? 1 : 0);
		}else if (uni.name == 'uNormalMatrix'){
			var normalMatrix = modelTransformation.toMatrix3().inverse().toFloat32Array();
			gl.uniformMatrix3fv(uni.location, false, normalMatrix);
		}else if (uni.name == 'uModelMatrix'){
			gl.uniformMatrix4fv(uni.location, false, modelTransformation.toFloat32Array());
		}
		
		
		else if (uni.name == 'uLightDirection' && scene.useLighting && scene.dirLight){
			gl.uniform3f(uni.location, scene.dirLight.direction.x, scene.dirLight.direction.y, scene.dirLight.direction.z);
		}else if (uni.name == 'uLightDirectionColor' && scene.useLighting && scene.dirLight){
			var color = scene.dirLight.color.getRGB();
			gl.uniform3f(uni.location, color[0], color[1], color[2]);
		}else if (uni.name == 'uLightDirectionIntensity' && scene.useLighting && scene.dirLight){
			gl.uniform1f(uni.location, scene.dirLight.intensity);
		}
		
		
		else if (uni.name == 'uAmbientLightColor' && scene.useLighting && scene.ambientLight){
			var color = scene.ambientLight.getRGB();
			gl.uniform3f(uni.location, color[0], color[1], color[2]);
		}
		
		
		else if (uni.name == 'uLightPointPosition' && scene.useLighting && scene.pointsLights){
			p = scene.pointsLights.position;
			gl.uniform3f(uni.location, p.x, p.y, p.z);
		}else if (uni.name == 'uLightPointIntensity' && scene.useLighting && scene.pointsLights){
			gl.uniform1f(uni.location, scene.pointsLights.intensity);
		}else if(uni.name == 'uLightPointDistance' && scene.useLighting && scene.pointsLights){
			gl.uniform1f(uni.location, scene.pointsLights.distance);
		}else if (uni.name == 'uLightPointColor' && scene.useLighting && scene.pointsLights){
			var color = scene.pointsLights.color.getRGB();
			gl.uniform3f(uni.location, color[0], color[1], color[2]);
		}
		
		
		else if (uni.name == 'uOpacity'){
			gl.uniform1f(uni.location, mesh.material.opacity);
		}
	}
	
	return this;
};
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
			this.target.y -= cosT * dy * this.sensitivity.y / 10;
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
	this.dirLight = null;
	this.pointsLights = null;
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
	}else if (object._ktpointlight){
		this.pointsLights = object;
	}else{
		throw "Can't add the object to the scene";
	}
	
	return this;
};

Scene.prototype.drawMesh = function(mesh, camera){
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
		attributes: [
			{name: 'aVertexPosition'},
			{name: 'aVertexColor'},
			{name: 'aTextureCoord'}
		],
		uniforms: [
			{name: 'uMVPMatrix'},
			{name: 'uMaterialColor'},
			{name: 'uTextureSampler'},
			{name: 'uHasTexture'}
		],
		vertexShader: 
			"attribute mediump vec2 aTextureCoord; " +
			"attribute mediump vec3 aVertexPosition; " +
			"attribute mediump vec4 aVertexColor; " +
			
			"uniform mediump mat4 uMVPMatrix; " +
			"uniform mediump vec4 uMaterialColor; " +
			
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
			
			"varying mediump vec2 vTextureCoord; " + 
			"varying mediump vec4 vVertexColor; " + 
			
			"void main(void){ " +
				"mediump vec4 color = vVertexColor; " + 
				"if (uHasTexture){ " + 
					"mediump vec4 texColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t)); " +
					"color *= texColor; " +
				"} " + 
				
				"gl_FragColor = color;" + 
			"}"
	},
	
	
	lambert: {
		attributes: [
			{name: 'aVertexPosition'},
			{name: 'aVertexColor'},
			{name: 'aTextureCoord'},
			
			{name: 'aVertexNormal'}
		],
		uniforms: [
			{name: 'uMVMatrix'},
			{name: 'uPMatrix'},
			{name: 'uMaterialColor'},
			{name: 'uTextureSampler'},
			{name: 'uHasTexture'},
			
			{name: 'uUseLighting'},
			{name: 'uNormalMatrix'},
			{name: 'uModelMatrix'},
			
			{name: 'uAmbientLightColor'},
			
			{name: 'uLightDirection'},
			{name: 'uLightDirectionColor'},
			{name: 'uLightDirectionIntensity'},
			
			{name: 'uLightPointPosition'},
			{name: 'uLightPointIntensity'},
			{name: 'uLightPointColor'},
			{name: 'uLightPointDistance'},
			
			{name: 'uOpacity'}
		],
		vertexShader: 
			"attribute mediump vec2 aTextureCoord; " +
			"attribute mediump vec3 aVertexPosition; " +
			"attribute mediump vec4 aVertexColor; " +
			
			"attribute mediump vec3 aVertexNormal; " + 
			
			
			"uniform mediump mat4 uMVMatrix; " +
			"uniform mediump mat4 uPMatrix; " +
			"uniform mediump vec4 uMaterialColor; " +
			
			"uniform bool uUseLighting; " +
			"uniform mediump mat4 uModelMatrix; " +
			"uniform mediump mat3 uNormalMatrix; " +
			
			"uniform mediump vec3 uAmbientLightColor; " +
			
			"uniform mediump vec3 uLightDirection; " +
			"uniform mediump vec3 uLightDirectionColor; " +
			"uniform mediump float uLightDirectionIntensity; " +  
			
			"uniform mediump vec3 uLightPointPosition; " +
			"uniform mediump vec3 uLightPointColor; " +
			"uniform mediump float uLightPointIntensity; " +
			"uniform mediump float uLightPointDistance; " + 

			
			"varying mediump vec4 vVertexColor; " +
			"varying mediump vec2 vTextureCoord;" +  
			"varying mediump vec3 vLightWeight; " + 
			
			"void main(void){ " + 
				"vec4 modelViewPosition = uMVMatrix * vec4(aVertexPosition, 1.0); " +
				"gl_Position = uPMatrix * modelViewPosition; " +
			
				"if (uUseLighting){ " + 
					"vec3 transformedNormal = uNormalMatrix * aVertexNormal; " +
					"vLightWeight = uAmbientLightColor; " +
					
					"float dirLightWeight = max(dot(transformedNormal, uLightDirection), 0.0); " +
					"vLightWeight += (uLightDirectionColor * dirLightWeight * uLightDirectionIntensity); " +
					
					"vec3 vertexModelPosition = (uModelMatrix * vec4(aVertexPosition, 1.0)).xyz; " +
					"vec3 lightDist = uLightPointPosition - vertexModelPosition;" +
					"float distance = length(lightDist); " +
					"if (distance <= uLightPointDistance){ " +
						"vec3 pointLightDirection = normalize(lightDist); " +
						"float pointLightWeight = max(dot(transformedNormal, pointLightDirection), 0.0); " +
						"vLightWeight += (uLightPointColor * pointLightWeight * uLightPointIntensity) / distance; " +
					"} " +
				"}else{ " +
					"vLightWeight = vec3(1.0); " + 
				"}" +   
				 
				"vVertexColor = aVertexColor * uMaterialColor; " +
				"vTextureCoord = aTextureCoord; " +  
			"} " ,
		fragmentShader: 
			"uniform sampler2D uTextureSampler; " +
			"uniform bool uHasTexture; " +
			"uniform mediump float uOpacity; " +
			
			"varying mediump vec2 vTextureCoord; " + 
			"varying mediump vec4 vVertexColor; " + 
			"varying mediump vec3 vLightWeight; " + 
			
			"void main(void){ " +
				"mediump vec4 color = vVertexColor; " + 
				"if (uHasTexture){ " + 
					"mediump vec4 texColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t)); " +
					"color *= texColor; " +
				"} " + 
				
				"color.rgb *= vLightWeight; " + 
				"gl_FragColor = vec4(color.rgb, color.a * uOpacity); " + 
			"}"
	}
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
KT.LightPoint = require('./KTLightPoint');
KT.Input = require('./KTInput');
KT.Material = require('./KTMaterial');
KT.MaterialBasic = require('./KTMaterialBasic');
KT.MaterialLambert = require('./KTMaterialLambert');
KT.Math = require('./KTMath');
KT.Matrix3 = require('./KTMatrix3');
KT.Matrix4 = require('./KTMatrix4');
KT.Mesh = require('./KTMesh');
KT.OrbitAndPan = require('./KTOrbitAndPan');
KT.Texture = require('./KTTexture');
KT.Utils = require('./KTUtils');
KT.Vector2 = require('./KTVector2');
KT.Vector3 = require('./KTVector3');
KT.Scene = require('./KTScene');

module.exports = KT;
},{"./KTCameraPerspective":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraPerspective.js","./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTGeometryBox":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryBox.js","./KTGeometryPlane":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryPlane.js","./KTGeometrySphere":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometrySphere.js","./KTInput":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTInput.js","./KTLightDirectional":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightDirectional.js","./KTLightPoint":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightPoint.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js","./KTMaterialBasic":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialBasic.js","./KTMaterialLambert":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialLambert.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTMatrix3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix3.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTMesh":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMesh.js","./KTOrbitAndPan":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTOrbitAndPan.js","./KTScene":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTScene.js","./KTTexture":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTexture.js","./KTUtils":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js":[function(require,module,exports){
window.KT = require('./KramTech');
},{"./KramTech":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KramTech.js"}]},{},["c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiLi5cXHNyY1xcS1RDYW1lcmFQZXJzcGVjdGl2ZS5qcyIsIi4uXFxzcmNcXEtUQ29sb3IuanMiLCIuLlxcc3JjXFxLVEdlb21ldHJ5LmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeUJveC5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlQbGFuZS5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlTcGhlcmUuanMiLCIuLlxcc3JjXFxLVElucHV0LmpzIiwiLi5cXHNyY1xcS1RMaWdodERpcmVjdGlvbmFsLmpzIiwiLi5cXHNyY1xcS1RMaWdodFBvaW50LmpzIiwiLi5cXHNyY1xcS1RNYWluLmpzIiwiLi5cXHNyY1xcS1RNYXRlcmlhbC5qcyIsIi4uXFxzcmNcXEtUTWF0ZXJpYWxCYXNpYy5qcyIsIi4uXFxzcmNcXEtUTWF0ZXJpYWxMYW1iZXJ0LmpzIiwiLi5cXHNyY1xcS1RNYXRoLmpzIiwiLi5cXHNyY1xcS1RNYXRyaXgzLmpzIiwiLi5cXHNyY1xcS1RNYXRyaXg0LmpzIiwiLi5cXHNyY1xcS1RNZXNoLmpzIiwiLi5cXHNyY1xcS1RPcmJpdEFuZFBhbi5qcyIsIi4uXFxzcmNcXEtUU2NlbmUuanMiLCIuLlxcc3JjXFxLVFNoYWRlcnMuanMiLCIuLlxcc3JjXFxLVFRleHR1cmUuanMiLCIuLlxcc3JjXFxLVFV0aWxzLmpzIiwiLi5cXHNyY1xcS1RWZWN0b3IyLmpzIiwiLi5cXHNyY1xcS1RWZWN0b3IzLmpzIiwiLi5cXHNyY1xcS3JhbVRlY2guanMiLCIuLlxcc3JjXFxXaW5kb3dFeHBvcnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIE1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG52YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG52YXIgS1RNYXRoID0gcmVxdWlyZSgnLi9LVE1hdGgnKTtcclxuXHJcbmZ1bmN0aW9uIENhbWVyYVBlcnNwZWN0aXZlKGZvdiwgcmF0aW8sIHpuZWFyLCB6ZmFyKXtcclxuXHR0aGlzLl9fa3RjYW1lcmEgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMucG9zaXRpb24gPSBuZXcgVmVjdG9yMygwLjAsIDAuMCwgMC4wKTtcclxuXHR0aGlzLnVwVmVjdG9yID0gbmV3IFZlY3RvcjMoMC4wLCAxLjAsIDAuMCk7XHJcblx0dGhpcy5sb29rQXQobmV3IFZlY3RvcjMoMC4wLCAwLjAsIC0xLjApKTtcclxuXHRcclxuXHR0aGlzLmZvdiA9IGZvdjtcclxuXHR0aGlzLnJhdGlvID0gcmF0aW87XHJcblx0dGhpcy56bmVhciA9IHpuZWFyO1xyXG5cdHRoaXMuemZhciA9IHpmYXI7XHJcblx0XHJcblx0dGhpcy5jb250cm9scyA9IG51bGw7XHJcblx0XHJcblx0dGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBuZXcgQ29sb3IoQ29sb3IuX0JMQUNLKTtcclxuXHRcclxuXHR0aGlzLnNldFBlcnNwZWN0aXZlKCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FtZXJhUGVyc3BlY3RpdmU7XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUuc2V0UGVyc3BlY3RpdmUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBDID0gMSAvIE1hdGgudGFuKHRoaXMuZm92IC8gMik7XHJcblx0dmFyIFIgPSBDICogdGhpcy5yYXRpbztcclxuXHR2YXIgQSA9ICh0aGlzLnpuZWFyICsgdGhpcy56ZmFyKSAvICh0aGlzLnpuZWFyIC0gdGhpcy56ZmFyKTtcclxuXHR2YXIgQiA9ICgyICogdGhpcy56bmVhciAqIHRoaXMuemZhcikgLyAodGhpcy56bmVhciAtIHRoaXMuemZhcik7XHJcblx0XHJcblx0dGhpcy5wZXJzcGVjdGl2ZU1hdHJpeCA9IG5ldyBNYXRyaXg0KFxyXG5cdFx0QywgMCwgMCwgIDAsXHJcblx0XHQwLCBSLCAwLCAgMCxcclxuXHRcdDAsIDAsIEEsICBCLFxyXG5cdFx0MCwgMCwgLTEsIDBcclxuXHQpO1xyXG59O1xyXG5cclxuQ2FtZXJhUGVyc3BlY3RpdmUucHJvdG90eXBlLnNldEJhY2tncm91bmRDb2xvciA9IGZ1bmN0aW9uKGNvbG9yKXtcclxuXHR0aGlzLmJhY2tncm91bmRDb2xvciA9IG5ldyBDb2xvcihjb2xvcik7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUubG9va0F0ID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBsb29rIHRvIGEgdmVjdG9yM1wiO1xyXG5cdFxyXG5cdHZhciBmb3J3YXJkID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSh0aGlzLnBvc2l0aW9uLCB2ZWN0b3IzKS5ub3JtYWxpemUoKTtcclxuXHR2YXIgbGVmdCA9IHRoaXMudXBWZWN0b3IuY3Jvc3MoZm9yd2FyZCkubm9ybWFsaXplKCk7XHJcblx0dmFyIHVwID0gZm9yd2FyZC5jcm9zcyhsZWZ0KS5ub3JtYWxpemUoKTtcclxuXHRcclxuXHR2YXIgeCA9IC1sZWZ0LmRvdCh0aGlzLnBvc2l0aW9uKTtcclxuXHR2YXIgeSA9IC11cC5kb3QodGhpcy5wb3NpdGlvbik7XHJcblx0dmFyIHogPSAtZm9yd2FyZC5kb3QodGhpcy5wb3NpdGlvbik7XHJcblx0XHJcblx0dGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG5ldyBNYXRyaXg0KFxyXG5cdFx0bGVmdC54LCBsZWZ0LnksIGxlZnQueiwgeCxcclxuXHRcdHVwLngsIHVwLnksIHVwLnosIHksXHJcblx0XHRmb3J3YXJkLngsIGZvcndhcmQueSwgZm9yd2FyZC56LCB6LFxyXG5cdFx0MCwgMCwgMCwgMVxyXG5cdCk7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUuc2V0Q29udHJvbHMgPSBmdW5jdGlvbihjYW1lcmFDb250cm9scyl7XHJcblx0aWYgKCFjYW1lcmFDb250cm9scy5fX2t0Q2FtQ3RybHMpIHRocm93IFwiSXMgbm90IGEgdmFsaWQgY2FtZXJhIGNvbnRyb2xzIG9iamVjdFwiO1xyXG5cdFxyXG5cdHZhciB6b29tID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSh0aGlzLnBvc2l0aW9uLCBjYW1lcmFDb250cm9scy50YXJnZXQpLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMuY29udHJvbHMgPSBjYW1lcmFDb250cm9scztcclxuXHRcclxuXHRjYW1lcmFDb250cm9scy5jYW1lcmEgPSB0aGlzO1xyXG5cdGNhbWVyYUNvbnRyb2xzLnpvb20gPSB6b29tO1xyXG5cdGNhbWVyYUNvbnRyb2xzLmFuZ2xlLnggPSBLVE1hdGguZ2V0MkRBbmdsZShjYW1lcmFDb250cm9scy50YXJnZXQueCwgY2FtZXJhQ29udHJvbHMudGFyZ2V0LnosdGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnopO1xyXG5cdGNhbWVyYUNvbnRyb2xzLmFuZ2xlLnkgPSBLVE1hdGguZ2V0MkRBbmdsZSgwLCB0aGlzLnBvc2l0aW9uLnksIHpvb20sIGNhbWVyYUNvbnRyb2xzLnRhcmdldC55KTtcclxuXHRcclxuXHRjYW1lcmFDb250cm9scy5zZXRDYW1lcmFQb3NpdGlvbigpO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG4iLCJmdW5jdGlvbiBDb2xvcihoZXhDb2xvcil7XHJcblx0dmFyIHN0ciA9IGhleENvbG9yLnN1YnN0cmluZygxKTtcclxuXHRcclxuXHRpZiAoc3RyLmxlbmd0aCA9PSA2KSBzdHIgKz0gXCJGRlwiO1xyXG5cdHZhciByID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygwLCAyKSwgMTYpO1xyXG5cdHZhciBnID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygyLCA0KSwgMTYpO1xyXG5cdHZhciBiID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg0LCA2KSwgMTYpO1xyXG5cdHZhciBhID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg2LCA4KSwgMTYpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBbciAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSwgYSAvIDI1NV07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29sb3I7XHJcblxyXG5Db2xvci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaGV4Q29sb3Ipe1xyXG5cdHZhciBzdHIgPSBoZXhDb2xvci5zdWJzdHJpbmcoMSk7XHJcblx0dmFyIHIgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDAsIDIpLCAxNik7XHJcblx0dmFyIGcgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDIsIDQpLCAxNik7XHJcblx0dmFyIGIgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDQsIDYpLCAxNik7XHJcblx0dmFyIGEgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKDYsIDgpLCAxNik7XHJcblx0XHJcblx0dGhpcy5jb2xvciA9IFtyIC8gMjU1LCBnIC8gMjU1LCBiIC8gMjU1LCBhIC8gMjU1XTtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5zZXRSR0IgPSBmdW5jdGlvbihyZWQsIGdyZWVuLCBibHVlKXtcclxuXHR0aGlzLnNldFJHQkEocmVkLCBncmVlbiwgYmx1ZSwgMjU1KTtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5zZXRSR0JBID0gZnVuY3Rpb24ocmVkLCBncmVlbiwgYmx1ZSwgYWxwaGEpe1xyXG5cdHRoaXMuY29sb3IgPSBbcmVkIC8gMjU1LCBncmVlbiAvIDI1NSwgYmx1ZSAvIDI1NSwgYWxwaGFdO1xyXG59O1xyXG5cclxuQ29sb3IucHJvdG90eXBlLmdldFJHQiA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGMgPSB0aGlzLmdldFJHQkEoKTtcclxuXHRcclxuXHRyZXR1cm4gW2NbMF0sIGNbMV0sIGNbMl1dO1xyXG59O1xyXG5cclxuQ29sb3IucHJvdG90eXBlLmdldFJHQkEgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiB0aGlzLmNvbG9yO1xyXG59O1xyXG5cclxuQ29sb3IucHJvdG90eXBlLmdldEhleCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGMgPSB0aGlzLmNvbG9yO1xyXG5cdFxyXG5cdHZhciByID0gKGNbMF0gKiAyNTUpLnRvU3RyaW5nKDE2KTtcclxuXHR2YXIgZyA9IChjWzFdICogMjU1KS50b1N0cmluZygxNik7XHJcblx0dmFyIGIgPSAoY1syXSAqIDI1NSkudG9TdHJpbmcoMTYpO1xyXG5cdHZhciBhID0gKGNbM10gKiAyNTUpLnRvU3RyaW5nKDE2KTtcclxuXHRcclxuXHRpZiAoci5sZW5ndGggPT0gMSkgciA9IFwiMFwiICsgcjtcclxuXHRpZiAoZy5sZW5ndGggPT0gMSkgZyA9IFwiMFwiICsgZztcclxuXHRpZiAoYi5sZW5ndGggPT0gMSkgYiA9IFwiMFwiICsgYjtcclxuXHRpZiAoYS5sZW5ndGggPT0gMSkgYSA9IFwiMFwiICsgYTtcclxuXHRcclxuXHRyZXR1cm4gKFwiI1wiICsgciArIGcgKyBiICsgYSkudG9VcHBlckNhc2UoKTtcclxufTtcclxuXHJcbkNvbG9yLl9CTEFDS1x0XHQ9IFwiIzAwMDAwMEZGXCI7XHJcbkNvbG9yLl9SRUQgXHRcdFx0PSBcIiNGRjAwMDBGRlwiO1xyXG5Db2xvci5fR1JFRU4gXHRcdD0gXCIjMDBGRjAwRkZcIjtcclxuQ29sb3IuX0JMVUUgXHRcdD0gXCIjMDAwMEZGRkZcIjtcclxuQ29sb3IuX1dISVRFXHRcdD0gXCIjRkZGRkZGRkZcIjtcclxuQ29sb3IuX1lFTExPV1x0XHQ9IFwiI0ZGRkYwMEZGXCI7XHJcbkNvbG9yLl9NQUdFTlRBXHRcdD0gXCIjRkYwMEZGRkZcIjtcclxuQ29sb3IuX0FRVUFcdFx0XHQ9IFwiIzAwRkZGRkZGXCI7XHJcbkNvbG9yLl9HT0xEXHRcdFx0PSBcIiNGRkQ3MDBGRlwiO1xyXG5Db2xvci5fR1JBWVx0XHRcdD0gXCIjODA4MDgwRkZcIjtcclxuQ29sb3IuX1BVUlBMRVx0XHQ9IFwiIzgwMDA4MEZGXCI7IiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxudmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxudmFyIFZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG52YXIgVmVjdG9yMyA9IHJlcXVpcmUoJy4vS1RWZWN0b3IzJyk7XHJcblxyXG5mdW5jdGlvbiBHZW9tZXRyeSgpe1xyXG5cdHRoaXMuX19rdGdlb21ldHJ5ID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnZlcnRpY2VzID0gW107XHJcblx0dGhpcy50cmlhbmdsZXMgPSBbXTtcclxuXHR0aGlzLnV2Q29vcmRzID0gW107XHJcblx0dGhpcy5jb2xvcnMgPSBbXTtcclxuXHR0aGlzLm5vcm1hbHMgPSBbXTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeTtcclxuXHJcbkdlb21ldHJ5LnByb3RvdHlwZS5hZGRWZXJ0aWNlID0gZnVuY3Rpb24oeCwgeSwgeiwgY29sb3IsIHR4LCB0eSl7XHJcblx0aWYgKCFjb2xvcikgY29sb3IgPSBDb2xvci5fV0hJVEU7XHJcblx0aWYgKCF0eCkgdHggPSAwO1xyXG5cdGlmICghdHkpIHR5ID0gMDtcclxuXHRcclxuXHR0aGlzLnZlcnRpY2VzLnB1c2gobmV3IFZlY3RvcjMoeCwgeSwgeikpO1xyXG5cdHRoaXMuY29sb3JzLnB1c2gobmV3IENvbG9yKGNvbG9yKSk7XHJcblx0dGhpcy51dkNvb3Jkcy5wdXNoKG5ldyBWZWN0b3IyKHR4LCB0eSkpO1xyXG59O1xyXG5cclxuR2VvbWV0cnkucHJvdG90eXBlLmFkZEZhY2UgPSBmdW5jdGlvbih2ZXJ0aWNlXzAsIHZlcnRpY2VfMSwgdmVydGljZV8yKXtcclxuXHRpZiAoIXRoaXMudmVydGljZXNbdmVydGljZV8wXSkgdGhyb3cgXCJJbnZhbGlkIHZlcnRleCBpbmRleDogXCIgKyB2ZXJ0aWNlXzA7XHJcblx0aWYgKCF0aGlzLnZlcnRpY2VzW3ZlcnRpY2VfMV0pIHRocm93IFwiSW52YWxpZCB2ZXJ0ZXggaW5kZXg6IFwiICsgdmVydGljZV8xO1xyXG5cdGlmICghdGhpcy52ZXJ0aWNlc1t2ZXJ0aWNlXzJdKSB0aHJvdyBcIkludmFsaWQgdmVydGV4IGluZGV4OiBcIiArIHZlcnRpY2VfMjtcclxuXHRcclxuXHR0aGlzLnRyaWFuZ2xlcy5wdXNoKG5ldyBWZWN0b3IzKHZlcnRpY2VfMCwgdmVydGljZV8xLCB2ZXJ0aWNlXzIpKTtcclxufTtcclxuXHJcbkdlb21ldHJ5LnByb3RvdHlwZS5hZGROb3JtYWwgPSBmdW5jdGlvbihueCwgbnksIG56KXtcclxuXHR0aGlzLm5vcm1hbHMucHVzaChuZXcgVmVjdG9yMyhueCwgbnksIG56KSk7XHJcbn07XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbigpe1xyXG5cdHZhciB2ZXJ0aWNlcyA9IFtdO1xyXG5cdHZhciB1dkNvb3JkcyA9IFtdO1xyXG5cdHZhciB0cmlhbmdsZXMgPSBbXTtcclxuXHR2YXIgY29sb3JzID0gW107XHJcblx0dmFyIG5vcm1hbHMgPSBbXTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMudmVydGljZXMubGVuZ3RoO2k8bGVuO2krKyl7IFxyXG5cdFx0dmFyIHYgPSB0aGlzLnZlcnRpY2VzW2ldOyBcclxuXHRcdHZlcnRpY2VzLnB1c2godi54LCB2LnksIHYueik7IFxyXG5cdH1cclxuXHRcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRoaXMudXZDb29yZHMubGVuZ3RoO2k8bGVuO2krKyl7IFxyXG5cdFx0dmFyIHYgPSB0aGlzLnV2Q29vcmRzW2ldOyBcclxuXHRcdHV2Q29vcmRzLnB1c2godi54LCB2LnkpOyBcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLnRyaWFuZ2xlcy5sZW5ndGg7aTxsZW47aSsrKXsgXHJcblx0XHR2YXIgdCA9IHRoaXMudHJpYW5nbGVzW2ldOyBcclxuXHRcdHRyaWFuZ2xlcy5wdXNoKHQueCwgdC55LCB0LnopOyBcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLmNvbG9ycy5sZW5ndGg7aTxsZW47aSsrKXsgXHJcblx0XHR2YXIgYyA9IHRoaXMuY29sb3JzW2ldLmdldFJHQkEoKTsgXHJcblx0XHRcclxuXHRcdGNvbG9ycy5wdXNoKGNbMF0sIGNbMV0sIGNbMl0sIGNbM10pOyBcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLm5vcm1hbHMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgbiA9IHRoaXMubm9ybWFsc1tpXTtcclxuXHRcdG5vcm1hbHMucHVzaChuLngsIG4ueSwgbi56KTtcclxuXHR9XHJcblx0XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgPSBLVC5jcmVhdGVBcnJheUJ1ZmZlcihcIkFSUkFZX0JVRkZFUlwiLCBuZXcgRmxvYXQzMkFycmF5KHZlcnRpY2VzKSwgMyk7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBLVC5jcmVhdGVBcnJheUJ1ZmZlcihcIkFSUkFZX0JVRkZFUlwiLCBuZXcgRmxvYXQzMkFycmF5KHV2Q29vcmRzKSwgMik7XHJcblx0dGhpcy5mYWNlc0J1ZmZlciA9IEtULmNyZWF0ZUFycmF5QnVmZmVyKFwiRUxFTUVOVF9BUlJBWV9CVUZGRVJcIiwgbmV3IFVpbnQxNkFycmF5KHRyaWFuZ2xlcyksIDEpO1xyXG5cdHRoaXMuY29sb3JzQnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJBUlJBWV9CVUZGRVJcIiwgbmV3IEZsb2F0MzJBcnJheShjb2xvcnMpLCA0KTtcclxuXHR0aGlzLm5vcm1hbHNCdWZmZXIgPSBLVC5jcmVhdGVBcnJheUJ1ZmZlcihcIkFSUkFZX0JVRkZFUlwiLCBuZXcgRmxvYXQzMkFycmF5KG5vcm1hbHMpLCAzKTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbkdlb21ldHJ5LnByb3RvdHlwZS5jb21wdXRlRmFjZXNOb3JtYWxzID0gZnVuY3Rpb24oKXtcclxuXHR0aGlzLm5vcm1hbHMgPSBbXTtcclxuXHRcclxuXHR2YXIgbm9ybWFsaXplZFZlcnRpY2VzID0gW107XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLnRyaWFuZ2xlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBmYWNlID0gdGhpcy50cmlhbmdsZXNbaV07XHJcblx0XHR2YXIgdjAgPSB0aGlzLnZlcnRpY2VzW2ZhY2UueF07XHJcblx0XHR2YXIgdjEgPSB0aGlzLnZlcnRpY2VzW2ZhY2UueV07XHJcblx0XHR2YXIgdjIgPSB0aGlzLnZlcnRpY2VzW2ZhY2Uuel07XHJcblx0XHRcclxuXHRcdHZhciBkaXIxID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSh2MSwgdjApO1xyXG5cdFx0dmFyIGRpcjIgPSBWZWN0b3IzLnZlY3RvcnNEaWZmZXJlbmNlKHYyLCB2MCk7XHJcblx0XHRcclxuXHRcdHZhciBub3JtYWwgPSBkaXIxLmNyb3NzKGRpcjIpLm5vcm1hbGl6ZSgpO1xyXG5cdFx0XHJcblx0XHRpZiAobm9ybWFsaXplZFZlcnRpY2VzLmluZGV4T2YoZmFjZS54KSA9PSAtMSkgdGhpcy5ub3JtYWxzLnB1c2gobm9ybWFsKTtcclxuXHRcdGlmIChub3JtYWxpemVkVmVydGljZXMuaW5kZXhPZihmYWNlLnkpID09IC0xKSB0aGlzLm5vcm1hbHMucHVzaChub3JtYWwpO1xyXG5cdFx0aWYgKG5vcm1hbGl6ZWRWZXJ0aWNlcy5pbmRleE9mKGZhY2UueikgPT0gLTEpIHRoaXMubm9ybWFscy5wdXNoKG5vcm1hbCk7XHJcblx0XHRcclxuXHRcdG5vcm1hbGl6ZWRWZXJ0aWNlcy5wdXNoKGZhY2UueCwgZmFjZS55LCBmYWNlLnopO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuIiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlCb3god2lkdGgsIGxlbmd0aCwgaGVpZ2h0LCBwYXJhbXMpe1xyXG5cdHRoaXMuX19rdGdlb21ldHJ5ID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgYm94R2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0XHJcblx0dmFyIHcgPSB3aWR0aCAvIDI7XHJcblx0dmFyIGwgPSBsZW5ndGggLyAyO1xyXG5cdHZhciBoID0gaGVpZ2h0IC8gMjtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0XHJcblx0dmFyIGhyID0gKHBhcmFtcy5ob3Jpem9udGFsUmVwZWF0cyk/IHBhcmFtcy5ob3Jpem9udGFsUmVwZWF0cyA6IDEuMDtcclxuXHR2YXIgdnIgPSAocGFyYW1zLnZlcnRpY2FsUmVwZWF0cyk/IHBhcmFtcy52ZXJ0aWNhbFJlcGVhdHMgOiAxLjA7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAgbCwgQ29sb3IuX1dISVRFLCAgaHIsIDAuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAgbCwgQ29sb3IuX1dISVRFLCAwLjAsICB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAgbCwgQ29sb3IuX1dISVRFLCAwLjAsIDAuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAgbCwgQ29sb3IuX1dISVRFLCAgaHIsICB2cik7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAtbCwgQ29sb3IuX1dISVRFLCAwLjAsIDAuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAtbCwgQ29sb3IuX1dISVRFLCAwLjAsICB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAtbCwgQ29sb3IuX1dISVRFLCAgaHIsIDAuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAtbCwgQ29sb3IuX1dISVRFLCAgaHIsICB2cik7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAtbCwgQ29sb3IuX1dISVRFLCAgaHIsIDAuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAgbCwgQ29sb3IuX1dISVRFLCAwLjAsICB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAgbCwgQ29sb3IuX1dISVRFLCAwLjAsIDAuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAtbCwgQ29sb3IuX1dISVRFLCAgaHIsICB2cik7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAgbCwgQ29sb3IuX1dISVRFLCAgaHIsIDAuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAgbCwgQ29sb3IuX1dISVRFLCAgaHIsICB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAtbCwgQ29sb3IuX1dISVRFLCAwLjAsIDAuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAtbCwgQ29sb3IuX1dISVRFLCAwLjAsICB2cik7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAgbCwgQ29sb3IuX1dISVRFLCAgaHIsIDAuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAtbCwgQ29sb3IuX1dISVRFLCAwLjAsICB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsICBoLCAgbCwgQ29sb3IuX1dISVRFLCAwLjAsIDAuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsICBoLCAtbCwgQ29sb3IuX1dISVRFLCAgaHIsICB2cik7XHJcblx0XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAgbCwgQ29sb3IuX1dISVRFLCAwLjAsICB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoLXcsIC1oLCAtbCwgQ29sb3IuX1dISVRFLCAwLjAsIDAuMCk7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAgbCwgQ29sb3IuX1dISVRFLCAgaHIsICB2cik7XHJcblx0Ym94R2VvLmFkZFZlcnRpY2UoIHcsIC1oLCAtbCwgQ29sb3IuX1dISVRFLCAgaHIsIDAuMCk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMCwgMSwgMik7XHJcblx0Ym94R2VvLmFkZEZhY2UoMCwgMywgMSk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoNCwgNSwgNik7XHJcblx0Ym94R2VvLmFkZEZhY2UoNSwgNywgNik7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoOCwgOSwgMTApO1xyXG5cdGJveEdlby5hZGRGYWNlKDgsIDExLCA5KTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSgxMiwgMTMsIDE0KTtcclxuXHRib3hHZW8uYWRkRmFjZSgxMywgMTUsIDE0KTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSgxNiwgMTcsIDE4KTtcclxuXHRib3hHZW8uYWRkRmFjZSgxNiwgMTksIDE3KTtcclxuXHRcclxuXHRib3hHZW8uYWRkRmFjZSgyMCwgMjEsIDIyKTtcclxuXHRib3hHZW8uYWRkRmFjZSgyMSwgMjMsIDIyKTtcclxuXHRcclxuXHRib3hHZW8uY29tcHV0ZUZhY2VzTm9ybWFscygpO1xyXG5cdGJveEdlby5idWlsZCgpO1xyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gYm94R2VvLnZlcnRleEJ1ZmZlcjtcclxuXHR0aGlzLnRleEJ1ZmZlciA9IGJveEdlby50ZXhCdWZmZXI7XHJcblx0dGhpcy5mYWNlc0J1ZmZlciA9IGJveEdlby5mYWNlc0J1ZmZlcjtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IGJveEdlby5jb2xvcnNCdWZmZXI7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gYm94R2VvLm5vcm1hbHNCdWZmZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnlCb3g7IiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlQbGFuZSh3aWR0aCwgaGVpZ2h0LCBwYXJhbXMpe1xyXG5cdHRoaXMuX19rdGdlb21ldHJ5ID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgcGxhbmVHZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHRcclxuXHR2YXIgdyA9IHdpZHRoIC8gMjtcclxuXHR2YXIgaCA9IGhlaWdodCAvIDI7XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cdFxyXG5cdHZhciBociA9IChwYXJhbXMuaG9yaXpvbnRhbFJlcGVhdHMpPyBwYXJhbXMuaG9yaXpvbnRhbFJlcGVhdHMgOiAxLjA7XHJcblx0dmFyIHZyID0gKHBhcmFtcy52ZXJ0aWNhbFJlcGVhdHMpPyBwYXJhbXMudmVydGljYWxSZXBlYXRzIDogMS4wO1xyXG5cdFxyXG5cdHBsYW5lR2VvLmFkZFZlcnRpY2UoIHcsIDAsICBoLCBDb2xvci5fV0hJVEUsICBociwgIHZyKTtcclxuXHRwbGFuZUdlby5hZGRWZXJ0aWNlKC13LCAwLCAtaCwgQ29sb3IuX1dISVRFLCAwLjAsIDAuMCk7XHJcblx0cGxhbmVHZW8uYWRkVmVydGljZSgtdywgMCwgIGgsIENvbG9yLl9XSElURSwgMC4wLCAgdnIpO1xyXG5cdHBsYW5lR2VvLmFkZFZlcnRpY2UoIHcsIDAsIC1oLCBDb2xvci5fV0hJVEUsICBociwgMC4wKTtcclxuXHRcclxuXHRwbGFuZUdlby5hZGRGYWNlKDAsIDEsIDIpO1xyXG5cdHBsYW5lR2VvLmFkZEZhY2UoMCwgMywgMSk7XHJcblx0XHJcblx0cGxhbmVHZW8uY29tcHV0ZUZhY2VzTm9ybWFscygpO1xyXG5cdHBsYW5lR2VvLmJ1aWxkKCk7XHJcblx0XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgPSBwbGFuZUdlby52ZXJ0ZXhCdWZmZXI7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBwbGFuZUdlby50ZXhCdWZmZXI7XHJcblx0dGhpcy5mYWNlc0J1ZmZlciA9IHBsYW5lR2VvLmZhY2VzQnVmZmVyO1xyXG5cdHRoaXMuY29sb3JzQnVmZmVyID0gcGxhbmVHZW8uY29sb3JzQnVmZmVyO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IHBsYW5lR2VvLm5vcm1hbHNCdWZmZXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnlQbGFuZTsiLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcblxyXG5mdW5jdGlvbiBHZW9tZXRyeVNwaGVyZShyYWRpdXMsIGxhdEJhbmRzLCBsb25CYW5kcywgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0XHJcblx0dmFyIHNwaEdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHRcclxuXHR2YXIgaHIgPSAocGFyYW1zLmhvcml6b250YWxSZXBlYXRzKT8gcGFyYW1zLmhvcml6b250YWxSZXBlYXRzIDogMS4wO1xyXG5cdHZhciB2ciA9IChwYXJhbXMudmVydGljYWxSZXBlYXRzKT8gcGFyYW1zLnZlcnRpY2FsUmVwZWF0cyA6IDEuMDtcclxuXHR2YXIgaHMgPSAocGFyYW1zLmhhbGZTcGhlcmUpPyAxLjAgOiAyLjA7XHJcblx0XHJcblx0Zm9yICh2YXIgbGF0Tj0wO2xhdE48PWxhdEJhbmRzO2xhdE4rKyl7XHJcblx0XHR2YXIgdGhldGEgPSBsYXROICogTWF0aC5QSSAvIGxhdEJhbmRzO1xyXG5cdFx0dmFyIGNvc1QgPSBNYXRoLmNvcyh0aGV0YSk7XHJcblx0XHR2YXIgc2luVCA9IE1hdGguc2luKHRoZXRhKTtcclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgbG9uTj0wO2xvbk48PWxvbkJhbmRzO2xvbk4rKyl7XHJcblx0XHRcdHZhciBwaGkgPSBsb25OICogaHMgKiBNYXRoLlBJIC8gbG9uQmFuZHM7XHJcblx0XHRcdHZhciBjb3NQID0gTWF0aC5jb3MocGhpKTtcclxuXHRcdFx0dmFyIHNpblAgPSBNYXRoLnNpbihwaGkpO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHggPSBjb3NQICogc2luVDtcclxuXHRcdFx0dmFyIHkgPSBjb3NUO1xyXG5cdFx0XHR2YXIgeiA9IHNpblAgKiBzaW5UO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHR4ID0gbG9uTiAvIGxvbkJhbmRzO1xyXG5cdFx0XHR2YXIgdHkgPSAxIC0gbGF0TiAvIGxhdEJhbmRzO1xyXG5cdFx0XHRcclxuXHRcdFx0c3BoR2VvLmFkZE5vcm1hbCh4LCB5LCB6KTtcclxuXHRcdFx0c3BoR2VvLmFkZFZlcnRpY2UoeCAqIHJhZGl1cywgeSAqIHJhZGl1cywgeiAqIHJhZGl1cywgQ29sb3IuX1dISVRFLCB0eCAqIGhyLCB0eSAqIHZyKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgbGF0Tj0wO2xhdE48bGF0QmFuZHM7bGF0TisrKXtcclxuXHRcdGZvciAodmFyIGxvbk49MDtsb25OPGxvbkJhbmRzO2xvbk4rKyl7XHJcblx0XHRcdHZhciBpMSA9IGxvbk4gKyAobGF0TiAqIChsb25CYW5kcyArIDEpKTtcclxuXHRcdFx0dmFyIGkyID0gaTEgKyBsb25CYW5kcyArIDE7XHJcblx0XHRcdHZhciBpMyA9IGkxICsgMTtcclxuXHRcdFx0dmFyIGk0ID0gaTIgKyAxO1xyXG5cdFx0XHRcclxuXHRcdFx0c3BoR2VvLmFkZEZhY2UoaTQsIGkxLCBpMyk7XHJcblx0XHRcdHNwaEdlby5hZGRGYWNlKGk0LCBpMiwgaTEpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRzcGhHZW8uYnVpbGQoKTtcclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IHNwaEdlby52ZXJ0ZXhCdWZmZXI7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBzcGhHZW8udGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBzcGhHZW8uZmFjZXNCdWZmZXI7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBzcGhHZW8uY29sb3JzQnVmZmVyO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IHNwaEdlby5ub3JtYWxzQnVmZmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5U3BoZXJlOyIsInZhciBVdGlscyA9IHJlcXVpcmUoJy4vS1RVdGlscycpO1xyXG52YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcblxyXG52YXIgSW5wdXQgPSB7XHJcblx0X2tleXM6IFtdLFxyXG5cdF9tb3VzZToge1xyXG5cdFx0bGVmdDogMCxcclxuXHRcdHJpZ2h0OiAwLFxyXG5cdFx0bWlkZGxlOiAwLFxyXG5cdFx0d2hlZWw6IDAsXHJcblx0XHRwb3NpdGlvbjogbmV3IFZlY3RvcjIoMC4wLCAwLjApXHJcblx0fSxcclxuXHRcclxuXHR2S2V5OiB7XHJcblx0XHRTSElGVDogMTYsXHJcblx0XHRUQUI6IDksXHJcblx0XHRDVFJMOiAxNyxcclxuXHRcdEFMVDogMTgsXHJcblx0XHRTUEFDRTogMzIsXHJcblx0XHRFTlRFUjogMTMsXHJcblx0XHRCQUNLU1BBQ0U6IDgsXHJcblx0XHRFU0M6IDI3LFxyXG5cdFx0SU5TRVJUOiA0NSxcclxuXHRcdERFTDogNDYsXHJcblx0XHRFTkQ6IDM1LFxyXG5cdFx0U1RBUlQ6IDM2LFxyXG5cdFx0UEFHRVVQOiAzMyxcclxuXHRcdFBBR0VET1dOOiAzNFxyXG5cdH0sXHJcblx0XHJcblx0dk1vdXNlOiB7XHJcblx0XHRMRUZUOiAnbGVmdCcsXHJcblx0XHRSSUdIVDogJ3JpZ2h0JyxcclxuXHRcdE1JRERMRTogJ21pZGRsZScsXHJcblx0XHRXSEVFTFVQOiAxLFxyXG5cdFx0V0hFRUxET1dOOiAtMSxcclxuXHR9LFxyXG5cdFxyXG5cdGlzS2V5RG93bjogZnVuY3Rpb24oa2V5Q29kZSl7XHJcblx0XHRyZXR1cm4gKElucHV0Ll9rZXlzW2tleUNvZGVdID09IDEpO1xyXG5cdH0sXHJcblx0XHJcblx0aXNLZXlQcmVzc2VkOiBmdW5jdGlvbihrZXlDb2RlKXtcclxuXHRcdGlmIChJbnB1dC5fa2V5c1trZXlDb2RlXSA9PSAxKXtcclxuXHRcdFx0SW5wdXQuX2tleXNba2V5Q29kZV0gPSAyO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0aXNNb3VzZURvd246IGZ1bmN0aW9uKG1vdXNlQnV0dG9uKXtcclxuXHRcdHJldHVybiAoSW5wdXQuX21vdXNlW21vdXNlQnV0dG9uXSA9PSAxKTtcclxuXHR9LFxyXG5cdFxyXG5cdGlzTW91c2VQcmVzc2VkOiBmdW5jdGlvbihtb3VzZUJ1dHRvbil7XHJcblx0XHRpZiAoSW5wdXQuX21vdXNlW21vdXNlQnV0dG9uXSA9PSAxKXtcclxuXHRcdFx0SW5wdXQuX21vdXNlW21vdXNlQnV0dG9uXSA9IDI7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRpc1doZWVsTW92ZWQ6IGZ1bmN0aW9uKHdoZWVsRGlyKXtcclxuXHRcdGlmIChJbnB1dC5fbW91c2Uud2hlZWwgPT0gd2hlZWxEaXIpe1xyXG5cdFx0XHRJbnB1dC5fbW91c2Uud2hlZWwgPSAwO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlS2V5RG93bjogZnVuY3Rpb24oZXYpe1xyXG5cdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcclxuXHRcdGlmIChJbnB1dC5fa2V5c1tldi5rZXlDb2RlXSA9PSAyKSByZXR1cm47XHJcblx0XHRJbnB1dC5fa2V5c1tldi5rZXlDb2RlXSA9IDE7XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVLZXlVcDogZnVuY3Rpb24oZXYpe1xyXG5cdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcclxuXHRcdElucHV0Ll9rZXlzW2V2LmtleUNvZGVdID0gMDtcclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZU1vdXNlRG93bjogZnVuY3Rpb24oZXYpe1xyXG5cdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcclxuXHRcdGlmIChldi53aGljaCA9PSAxKXtcclxuXHRcdFx0aWYgKElucHV0Ll9tb3VzZS5sZWZ0ICE9IDIpXHJcblx0XHRcdFx0SW5wdXQuX21vdXNlLmxlZnQgPSAxO1xyXG5cdFx0fWVsc2UgaWYgKGV2LndoaWNoID09IDIpe1xyXG5cdFx0XHRpZiAoSW5wdXQuX21vdXNlLm1pZGRsZSAhPSAyKVxyXG5cdFx0XHRcdElucHV0Ll9tb3VzZS5taWRkbGUgPSAxO1xyXG5cdFx0fWVsc2UgaWYgKGV2LndoaWNoID09IDMpe1xyXG5cdFx0XHRpZiAoSW5wdXQuX21vdXNlLnJpZ2h0ICE9IDIpXHJcblx0XHRcdFx0SW5wdXQuX21vdXNlLnJpZ2h0ID0gMTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0SW5wdXQuaGFuZGxlTW91c2VNb3ZlKGV2KTtcclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVNb3VzZVVwOiBmdW5jdGlvbihldil7XHJcblx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFxyXG5cdFx0aWYgKGV2LndoaWNoID09IDEpe1xyXG5cdFx0XHRJbnB1dC5fbW91c2UubGVmdCA9IDA7XHJcblx0XHR9ZWxzZSBpZiAoZXYud2hpY2ggPT0gMil7XHJcblx0XHRcdElucHV0Ll9tb3VzZS5taWRkbGUgPSAwO1xyXG5cdFx0fWVsc2UgaWYgKGV2LndoaWNoID09IDMpe1xyXG5cdFx0XHRJbnB1dC5fbW91c2UucmlnaHQgPSAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRJbnB1dC5oYW5kbGVNb3VzZU1vdmUoZXYpO1xyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZU1vdXNlV2hlZWw6IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHJcblx0XHRJbnB1dC5fbW91c2Uud2hlZWwgPSAwO1xyXG5cdFx0aWYgKGV2LndoZWVsRGVsdGEgPiAwKSBJbnB1dC5fbW91c2Uud2hlZWwgPSAxO1xyXG5cdFx0ZWxzZSBpZiAoZXYud2hlZWxEZWx0YSA8IDApIElucHV0Ll9tb3VzZS53aGVlbCA9IC0xO1xyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlTW91c2VNb3ZlOiBmdW5jdGlvbihldil7XHJcblx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFxyXG5cdFx0dmFyIGVsWCA9IGV2LmNsaWVudFggLSBldi50YXJnZXQub2Zmc2V0TGVmdDtcclxuXHRcdHZhciBlbFkgPSBldi5jbGllbnRZIC0gZXYudGFyZ2V0Lm9mZnNldFRvcDtcclxuXHRcdFxyXG5cdFx0SW5wdXQuX21vdXNlLnBvc2l0aW9uLnNldChlbFgsIGVsWSk7XHJcblx0fSxcclxuXHRcclxuXHRpbml0OiBmdW5jdGlvbihjYW52YXMpe1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoZG9jdW1lbnQsICdrZXlkb3duJywgSW5wdXQuaGFuZGxlS2V5RG93bik7XHJcblx0XHRVdGlscy5hZGRFdmVudChkb2N1bWVudCwgJ2tleXVwJywgSW5wdXQuaGFuZGxlS2V5RG93bik7XHJcblx0XHRVdGlscy5hZGRFdmVudChjYW52YXMsICdtb3VzZWRvd24nLCBJbnB1dC5oYW5kbGVNb3VzZURvd24pO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoZG9jdW1lbnQsICdtb3VzZXVwJywgSW5wdXQuaGFuZGxlTW91c2VVcCk7XHJcblx0XHRVdGlscy5hZGRFdmVudChjYW52YXMsICdtb3VzZXdoZWVsJywgSW5wdXQuaGFuZGxlTW91c2VXaGVlbCk7XHJcblx0XHRVdGlscy5hZGRFdmVudChjYW52YXMsICdtb3VzZW1vdmUnLCBJbnB1dC5oYW5kbGVNb3VzZU1vdmUpO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoZG9jdW1lbnQsICdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGV2KXtcclxuXHRcdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoZXYudGFyZ2V0ID09PSBjYW52YXMpe1xyXG5cdFx0XHRcdGV2LmNhbmNlbEJ1YmJsZSA9IHRydWU7XHJcblx0XHRcdFx0ZXYucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuXHRcdFx0XHRpZiAoZXYucHJldmVudERlZmF1bHQpXHJcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdGlmIChldi5zdG9wUHJvcGFnYXRpb24pXHJcblx0XHRcdFx0XHRldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGk9MDtpPD05O2krKyl7XHJcblx0XHRcdElucHV0LnZLZXlbJ04nICsgaV0gPSA0OCArIGk7XHJcblx0XHRcdElucHV0LnZLZXlbJ05LJyArIGldID0gOTYgKyBpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTY1O2k8PTkwO2krKyl7XHJcblx0XHRcdElucHV0LnZLZXlbU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTE7aTw9MTI7aSsrKXtcclxuXHRcdFx0SW5wdXQudktleVsnRicgKyBpXSA9IDExMSArIGk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dDsiLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxuXHJcbmZ1bmN0aW9uIERpcmVjdGlvbmFsTGlnaHQoZGlyZWN0aW9uLCBjb2xvciwgaW50ZW5zaXR5KXtcclxuXHR0aGlzLl9fa3RkaXJMaWdodCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb24ubm9ybWFsaXplKCk7XHJcblx0dGhpcy5kaXJlY3Rpb24ubXVsdGlwbHkoLTEpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBuZXcgQ29sb3IoKGNvbG9yKT8gY29sb3I6IENvbG9yLl9XSElURSk7XHJcblx0dGhpcy5pbnRlbnNpdHkgPSAoaW50ZW5zaXR5ICE9PSB1bmRlZmluZWQpPyBpbnRlbnNpdHkgOiAxLjA7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aW9uYWxMaWdodDtcclxuXHJcbiIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG5cclxuZnVuY3Rpb24gTGlnaHRQb2ludChwb3NpdGlvbiwgaW50ZW5zaXR5LCBkaXN0YW5jZSwgY29sb3Ipe1xyXG5cdHRoaXMuX2t0cG9pbnRsaWdodCA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG5cdHRoaXMuaW50ZW5zaXR5ID0gKGludGVuc2l0eSk/IGludGVuc2l0eSA6IDEuMDtcclxuXHR0aGlzLmRpc3RhbmNlID0gKGRpc3RhbmNlKT8gZGlzdGFuY2UgOiAxLjA7XHJcblx0dGhpcy5jb2xvciA9IG5ldyBDb2xvcigoY29sb3IpPyBjb2xvciA6IENvbG9yLl9XSElURSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGlnaHRQb2ludDsiLCJ2YXIgU2hhZGVycyA9IHJlcXVpcmUoJy4vS1RTaGFkZXJzJyk7XHJcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4vS1RJbnB1dCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0aW5pdDogZnVuY3Rpb24oY2FudmFzKXtcclxuXHRcdHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG5cdFx0dGhpcy5nbCA9IG51bGw7XHJcblx0XHR0aGlzLnNoYWRlcnMgPSB7fTtcclxuXHRcdHRoaXMubWF4QXR0cmliTG9jYXRpb25zID0gMDtcclxuXHRcdHRoaXMubGFzdFByb2dyYW0gPSBudWxsO1xyXG5cdFx0XHJcblx0XHR0aGlzLl9faW5pdENvbnRleHQoY2FudmFzKTtcclxuXHRcdHRoaXMuX19pbml0UHJvcGVydGllcygpO1xyXG5cdFx0dGhpcy5fX2luaXRTaGFkZXJzKCk7XHJcblx0XHRcclxuXHRcdElucHV0LmluaXQoY2FudmFzKTtcclxuXHR9LFxyXG5cdFxyXG5cdF9faW5pdENvbnRleHQ6IGZ1bmN0aW9uKGNhbnZhcyl7XHJcblx0XHR0aGlzLmdsID0gY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xyXG5cdFx0XHJcblx0XHRpZiAoIXRoaXMuZ2wpe1xyXG5cdFx0XHRhbGVydChcIllvdXIgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgV2ViR0xcIik7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5nbC53aWR0aCA9IGNhbnZhcy53aWR0aDtcclxuXHRcdHRoaXMuZ2wuaGVpZ2h0ID0gY2FudmFzLmhlaWdodDtcclxuXHR9LFxyXG5cdFxyXG5cdF9faW5pdFByb3BlcnRpZXM6IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZ2wgPSB0aGlzLmdsO1xyXG5cdFx0XHJcblx0XHRnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7XHJcblx0XHRnbC5kZXB0aEZ1bmMoZ2wuTEVRVUFMKTtcclxuXHRcdFxyXG5cdFx0Z2wuZW5hYmxlKGdsLkNVTExfRkFDRSk7XHJcblx0XHRcclxuXHRcdGdsLmRpc2FibGUoIGdsLkJMRU5EICk7XHJcblx0XHRnbC5ibGVuZEVxdWF0aW9uKCBnbC5GVU5DX0FERCApO1xyXG5cdFx0Z2wuYmxlbmRGdW5jKCBnbC5TUkNfQUxQSEEsIGdsLk9ORSApO1xyXG5cdH0sXHJcblx0XHJcblx0X19pbml0U2hhZGVyczogZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuc2hhZGVycyA9IHt9O1xyXG5cdFx0dGhpcy5zaGFkZXJzLmJhc2ljID0gdGhpcy5wcm9jZXNzU2hhZGVyKFNoYWRlcnMuYmFzaWMpO1xyXG5cdFx0dGhpcy5zaGFkZXJzLmxhbWJlcnQgPSB0aGlzLnByb2Nlc3NTaGFkZXIoU2hhZGVycy5sYW1iZXJ0KTtcclxuXHR9LFxyXG5cdFxyXG5cdGNyZWF0ZUFycmF5QnVmZmVyOiBmdW5jdGlvbih0eXBlLCBkYXRhQXJyYXksIGl0ZW1TaXplKXtcclxuXHRcdHZhciBnbCA9IHRoaXMuZ2w7XHJcblx0XHR2YXIgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcblx0XHRnbC5iaW5kQnVmZmVyKGdsW3R5cGVdLCBidWZmZXIpO1xyXG5cdFx0Z2wuYnVmZmVyRGF0YShnbFt0eXBlXSwgZGF0YUFycmF5LCBnbC5TVEFUSUNfRFJBVyk7XHJcblx0XHRidWZmZXIubnVtSXRlbXMgPSBkYXRhQXJyYXkubGVuZ3RoO1xyXG5cdFx0YnVmZmVyLml0ZW1TaXplID0gaXRlbVNpemU7XHJcblx0XHRcclxuXHRcdHJldHVybiBidWZmZXI7XHJcblx0fSxcclxuXHRcclxuXHRwcm9jZXNzU2hhZGVyOiBmdW5jdGlvbihzaGFkZXIpe1xyXG5cdFx0dmFyIGdsID0gdGhpcy5nbDtcclxuXHRcdFxyXG5cdFx0dmFyIHZDb2RlID0gc2hhZGVyLnZlcnRleFNoYWRlcjtcclxuXHRcdHZhciB2U2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLlZFUlRFWF9TSEFERVIpO1xyXG5cdFx0Z2wuc2hhZGVyU291cmNlKHZTaGFkZXIsIHZDb2RlKTtcclxuXHRcdGdsLmNvbXBpbGVTaGFkZXIodlNoYWRlcik7XHJcblx0XHRcclxuXHRcdHZhciBmQ29kZSA9IHNoYWRlci5mcmFnbWVudFNoYWRlcjtcclxuXHRcdHZhciBmU2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLkZSQUdNRU5UX1NIQURFUik7XHJcblx0XHRnbC5zaGFkZXJTb3VyY2UoZlNoYWRlciwgZkNvZGUpO1xyXG5cdFx0Z2wuY29tcGlsZVNoYWRlcihmU2hhZGVyKTtcclxuXHRcdFxyXG5cdFx0dmFyIHNoYWRlclByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XHJcblx0XHRnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgdlNoYWRlcik7XHJcblx0XHRnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgZlNoYWRlcik7XHJcblx0XHRnbC5saW5rUHJvZ3JhbShzaGFkZXJQcm9ncmFtKTtcclxuXHRcdFxyXG5cdFx0aWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHNoYWRlclByb2dyYW0sIGdsLkxJTktfU1RBVFVTKSl7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJFcnJvciBpbml0aWFsaXppbmcgdGhlIHNoYWRlciBwcm9ncmFtXCIpO1xyXG5cdFx0XHR0aHJvdyBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlclByb2dyYW0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgYXR0cmlidXRlcyA9IFtdO1xyXG5cdFx0dGhpcy5tYXhBdHRyaWJMb2NhdGlvbnMgPSBNYXRoLm1heCh0aGlzLm1heEF0dHJpYkxvY2F0aW9ucywgc2hhZGVyLmF0dHJpYnV0ZXMubGVuZ3RoKTtcclxuXHRcdGZvciAodmFyIGk9MCxsZW49c2hhZGVyLmF0dHJpYnV0ZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHRcdHZhciBhdHQgPSBzaGFkZXIuYXR0cmlidXRlc1tpXTtcclxuXHRcdFx0dmFyIGxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgYXR0Lm5hbWUpO1xyXG5cdFx0XHRcclxuXHRcdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkobG9jYXRpb24pO1xyXG5cdFx0XHRcclxuXHRcdFx0YXR0cmlidXRlcy5wdXNoKHtcclxuXHRcdFx0XHRuYW1lOiBhdHQubmFtZSxcclxuXHRcdFx0XHR0eXBlOiBhdHQudHlwZSxcclxuXHRcdFx0XHRsb2NhdGlvbjogbG9jYXRpb25cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciB1bmlmb3JtcyA9IFtdO1xyXG5cdFx0Zm9yICh2YXIgaT0wLGxlbj1zaGFkZXIudW5pZm9ybXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHRcdHZhciB1bmkgPSBzaGFkZXIudW5pZm9ybXNbaV07XHJcblx0XHRcdHZhciBsb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihzaGFkZXJQcm9ncmFtLCB1bmkubmFtZSk7XHJcblx0XHRcdFxyXG5cdFx0XHR1bmlmb3Jtcy5wdXNoKHtcclxuXHRcdFx0XHRuYW1lOiB1bmkubmFtZSxcclxuXHRcdFx0XHR0eXBlOiB1bmkudHlwZSxcclxuXHRcdFx0XHRsb2NhdGlvbjogbG9jYXRpb25cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHNoYWRlclByb2dyYW06IHNoYWRlclByb2dyYW0sXHJcblx0XHRcdGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXHJcblx0XHRcdHVuaWZvcm1zOiB1bmlmb3Jtc1xyXG5cdFx0fTtcclxuXHR9LFxyXG5cdFxyXG5cdHN3aXRjaFByb2dyYW06IGZ1bmN0aW9uKHNoYWRlcil7XHJcblx0XHRpZiAodGhpcy5sYXN0UHJvZ3JhbSA9PT0gc2hhZGVyKSByZXR1cm47XHJcblx0XHR2YXIgZ2wgPSB0aGlzLmdsO1xyXG5cdFx0XHJcblx0XHR0aGlzLmxhc3RQcm9ncmFtID0gc2hhZGVyO1xyXG5cdFx0Z2wudXNlUHJvZ3JhbShzaGFkZXIuc2hhZGVyUHJvZ3JhbSk7XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGk9MDtpPHRoaXMubWF4QXR0cmliTG9jYXRpb25zO2krKyl7XHJcblx0XHRcdGlmIChpIDwgc2hhZGVyLmF0dHJpYnV0ZXMubGVuZ3RoKXtcclxuXHRcdFx0XHRnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShpKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Z2wuZGlzYWJsZVZlcnRleEF0dHJpYkFycmF5KGkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuXHJcbiIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG5cclxuZnVuY3Rpb24gTWF0ZXJpYWwocGFyYW1ldGVycyl7XHJcblx0dGhpcy5fX2t0bWF0ZXJpYWwgPSB0cnVlO1xyXG5cdFxyXG5cdGlmICghcGFyYW1ldGVycykgcGFyYW1ldGVycyA9IHt9O1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IChwYXJhbWV0ZXJzLnRleHR1cmUpPyBwYXJhbWV0ZXJzLnRleHR1cmUgOiBudWxsO1xyXG5cdHRoaXMuY29sb3IgPSBuZXcgQ29sb3IoKHBhcmFtZXRlcnMuY29sb3IpPyBwYXJhbWV0ZXJzLmNvbG9yIDogQ29sb3IuX1dISVRFKTtcclxuXHR0aGlzLm9wYWNpdHkgPSAocGFyYW1ldGVycy5vcGFjaXR5KT8gcGFyYW1ldGVycy5vcGFjaXR5IDogMS4wO1xyXG5cdHRoaXMuZHJhd0ZhY2VzID0gKHBhcmFtZXRlcnMuZHJhd0ZhY2VzKT8gcGFyYW1ldGVycy5kcmF3RmFjZXMgOiAnRlJPTlQnO1xyXG5cdHRoaXMuZHJhd0FzID0gKHBhcmFtZXRlcnMuZHJhd0FzKT8gcGFyYW1ldGVycy5kcmF3QXMgOiAnVFJJQU5HTEVTJztcclxuXHR0aGlzLnNoYWRlciA9IChwYXJhbWV0ZXJzLnNoYWRlcik/IHBhcmFtZXRlcnMuc2hhZGVyIDogbnVsbDtcclxuXHR0aGlzLnNlbmRBdHRyaWJEYXRhID0gKHBhcmFtZXRlcnMuc2VuZEF0dHJpYkRhdGEpPyBwYXJhbWV0ZXJzLnNlbmRBdHRyaWJEYXRhIDogbnVsbDtcclxuXHR0aGlzLnNlbmRVbmlmb3JtRGF0YSA9IChwYXJhbWV0ZXJzLnNlbmRVbmlmb3JtRGF0YSk/IHBhcmFtZXRlcnMuc2VuZFVuaWZvcm1EYXRhIDogbnVsbDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRlcmlhbDsiLCJ2YXIgTWF0ZXJpYWwgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWwnKTtcclxudmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxuXHJcbmZ1bmN0aW9uIE1hdGVyaWFsQmFzaWModGV4dHVyZSwgY29sb3Ipe1xyXG5cdHRoaXMuX19rdG1hdGVyaWFsID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgbWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoe1xyXG5cdFx0dGV4dHVyZTogdGV4dHVyZSxcclxuXHRcdGNvbG9yOiBjb2xvcixcclxuXHRcdHNoYWRlcjogS1Quc2hhZGVycy5iYXNpY1xyXG5cdH0pO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IG1hdGVyaWFsLnRleHR1cmU7XHJcblx0dGhpcy5jb2xvciA9IG1hdGVyaWFsLmNvbG9yO1xyXG5cdHRoaXMuc2hhZGVyID0gbWF0ZXJpYWwuc2hhZGVyO1xyXG5cdHRoaXMub3BhY2l0eSA9IG1hdGVyaWFsLm9wYWNpdHk7XHJcblx0dGhpcy5kcmF3RmFjZXMgPSBtYXRlcmlhbC5kcmF3RmFjZXM7XHJcblx0dGhpcy5kcmF3QXMgPSBtYXRlcmlhbC5kcmF3QXM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0ZXJpYWxCYXNpYztcclxuXHJcbk1hdGVyaWFsQmFzaWMucHJvdG90eXBlLnNlbmRBdHRyaWJEYXRhID0gZnVuY3Rpb24obWVzaCwgY2FtZXJhLCBzY2VuZSl7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0dmFyIGdlb21ldHJ5ID0gbWVzaC5nZW9tZXRyeTtcclxuXHR2YXIgYXR0cmlidXRlcyA9IHRoaXMuc2hhZGVyLmF0dHJpYnV0ZXM7XHJcblx0Zm9yICh2YXIgaT0wLGxlbj1hdHRyaWJ1dGVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIGF0dCA9IGF0dHJpYnV0ZXNbaV07XHJcblx0XHRcclxuXHRcdGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhQb3NpdGlvblwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LnZlcnRleEJ1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9ZWxzZSBpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4Q29sb3JcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS5jb2xvcnNCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVRleHR1cmVDb29yZFwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LnRleEJ1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS50ZXhCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0ZXJpYWxCYXNpYy5wcm90b3R5cGUuc2VuZFVuaWZvcm1EYXRhID0gZnVuY3Rpb24obWVzaCwgY2FtZXJhLCBzY2VuZSl7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0dmFyIGdlb21ldHJ5ID0gbWVzaC5nZW9tZXRyeTtcclxuXHR2YXIgdHJhbnNmb3JtYXRpb25NYXRyaXg7XHJcblx0dmFyIHVuaWZvcm1zID0gdGhpcy5zaGFkZXIudW5pZm9ybXM7XHJcblx0Zm9yICh2YXIgaT0wLGxlbj11bmlmb3Jtcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciB1bmkgPSB1bmlmb3Jtc1tpXTtcclxuXHRcdFxyXG5cdFx0aWYgKHVuaS5uYW1lID09ICd1TVZQTWF0cml4Jyl7XHJcblx0XHRcdHRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbWVzaC5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpLm11bHRpcGx5KGNhbWVyYS50cmFuc2Zvcm1hdGlvbk1hdHJpeCk7XHJcblx0XHRcdHZhciBtdnAgPSB0cmFuc2Zvcm1hdGlvbk1hdHJpeC5jbG9uZSgpLm11bHRpcGx5KGNhbWVyYS5wZXJzcGVjdGl2ZU1hdHJpeCk7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgbXZwLnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TWF0ZXJpYWxDb2xvcicpe1xyXG5cdFx0XHR2YXIgY29sb3IgPSBtZXNoLm1hdGVyaWFsLmNvbG9yLmdldFJHQkEoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTRmdih1bmkubG9jYXRpb24sIG5ldyBGbG9hdDMyQXJyYXkoY29sb3IpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVTYW1wbGVyJyl7XHJcblx0XHRcdGlmIChtZXNoLm1hdGVyaWFsLnRleHR1cmUpe1xyXG5cdFx0XHRcdGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTApO1xyXG5cdFx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG1lc2gubWF0ZXJpYWwudGV4dHVyZS50ZXh0dXJlKTtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1SGFzVGV4dHVyZScpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAobWVzaC5tYXRlcmlhbC50ZXh0dXJlKT8gMSA6IDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuIiwidmFyIE1hdGVyaWFsID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsJyk7XHJcblxyXG5mdW5jdGlvbiBNYXRlcmlhbExhbWJlcnQodGV4dHVyZSwgY29sb3IsIG9wYWNpdHkpe1xyXG5cdHRoaXMuX19rdG1hdGVyaWFsID0gdHJ1ZTtcclxuXHRcclxuXHR2YXIgbWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoe1xyXG5cdFx0dGV4dHVyZTogdGV4dHVyZSxcclxuXHRcdGNvbG9yOiBjb2xvcixcclxuXHRcdG9wYWNpdHk6IG9wYWNpdHksXHJcblx0XHRzaGFkZXI6IEtULnNoYWRlcnMubGFtYmVydFxyXG5cdH0pO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IG1hdGVyaWFsLnRleHR1cmU7XHJcblx0dGhpcy5jb2xvciA9IG1hdGVyaWFsLmNvbG9yO1xyXG5cdHRoaXMuc2hhZGVyID0gbWF0ZXJpYWwuc2hhZGVyO1xyXG5cdHRoaXMub3BhY2l0eSA9IG1hdGVyaWFsLm9wYWNpdHk7XHJcblx0dGhpcy5kcmF3RmFjZXMgPSBtYXRlcmlhbC5kcmF3RmFjZXM7XHJcblx0dGhpcy5kcmF3QXMgPSBtYXRlcmlhbC5kcmF3QXM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0ZXJpYWxMYW1iZXJ0O1xyXG5cclxuTWF0ZXJpYWxMYW1iZXJ0LnByb3RvdHlwZS5zZW5kQXR0cmliRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG5cdGZvciAodmFyIGk9MCxsZW49YXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBhdHQgPSBhdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4UG9zaXRpb25cIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleENvbG9yXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LmNvbG9yc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFUZXh0dXJlQ29vcmRcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS50ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleE5vcm1hbFwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5Lm5vcm1hbHNCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkubm9ybWFsc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRlcmlhbExhbWJlcnQucHJvdG90eXBlLnNlbmRVbmlmb3JtRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIHRyYW5zZm9ybWF0aW9uTWF0cml4O1xyXG5cdHZhciB1bmlmb3JtcyA9IHRoaXMuc2hhZGVyLnVuaWZvcm1zO1xyXG5cdHZhciBtb2RlbFRyYW5zZm9ybWF0aW9uO1xyXG5cdGZvciAodmFyIGk9MCxsZW49dW5pZm9ybXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgdW5pID0gdW5pZm9ybXNbaV07XHJcblx0XHRcclxuXHRcdGlmICh1bmkubmFtZSA9PSAndU1WTWF0cml4Jyl7XHJcblx0XHRcdG1vZGVsVHJhbnNmb3JtYXRpb24gPSBtZXNoLmdldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblx0XHRcdHRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbW9kZWxUcmFuc2Zvcm1hdGlvbi5jbG9uZSgpLm11bHRpcGx5KGNhbWVyYS50cmFuc2Zvcm1hdGlvbk1hdHJpeCk7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgdHJhbnNmb3JtYXRpb25NYXRyaXgudG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VQTWF0cml4Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYodW5pLmxvY2F0aW9uLCBmYWxzZSwgY2FtZXJhLnBlcnNwZWN0aXZlTWF0cml4LnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TWF0ZXJpYWxDb2xvcicpe1xyXG5cdFx0XHR2YXIgY29sb3IgPSBtZXNoLm1hdGVyaWFsLmNvbG9yLmdldFJHQkEoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTRmdih1bmkubG9jYXRpb24sIG5ldyBGbG9hdDMyQXJyYXkoY29sb3IpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVRleHR1cmVTYW1wbGVyJyl7XHJcblx0XHRcdGlmIChtZXNoLm1hdGVyaWFsLnRleHR1cmUpe1xyXG5cdFx0XHRcdGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTApO1xyXG5cdFx0XHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG1lc2gubWF0ZXJpYWwudGV4dHVyZS50ZXh0dXJlKTtcclxuXHRcdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1SGFzVGV4dHVyZScpe1xyXG5cdFx0XHRnbC51bmlmb3JtMWkodW5pLmxvY2F0aW9uLCAobWVzaC5tYXRlcmlhbC50ZXh0dXJlKT8gMSA6IDApO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1VXNlTGlnaHRpbmcnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKHNjZW5lLnVzZUxpZ2h0aW5nKT8gMSA6IDApO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1Tm9ybWFsTWF0cml4Jyl7XHJcblx0XHRcdHZhciBub3JtYWxNYXRyaXggPSBtb2RlbFRyYW5zZm9ybWF0aW9uLnRvTWF0cml4MygpLmludmVyc2UoKS50b0Zsb2F0MzJBcnJheSgpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4M2Z2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG5vcm1hbE1hdHJpeCk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VNb2RlbE1hdHJpeCcpe1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG1vZGVsVHJhbnNmb3JtYXRpb24udG9GbG9hdDMyQXJyYXkoKSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdFxyXG5cdFx0ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VMaWdodERpcmVjdGlvbicgJiYgc2NlbmUudXNlTGlnaHRpbmcgJiYgc2NlbmUuZGlyTGlnaHQpe1xyXG5cdFx0XHRnbC51bmlmb3JtM2YodW5pLmxvY2F0aW9uLCBzY2VuZS5kaXJMaWdodC5kaXJlY3Rpb24ueCwgc2NlbmUuZGlyTGlnaHQuZGlyZWN0aW9uLnksIHNjZW5lLmRpckxpZ2h0LmRpcmVjdGlvbi56KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUxpZ2h0RGlyZWN0aW9uQ29sb3InICYmIHNjZW5lLnVzZUxpZ2h0aW5nICYmIHNjZW5lLmRpckxpZ2h0KXtcclxuXHRcdFx0dmFyIGNvbG9yID0gc2NlbmUuZGlyTGlnaHQuY29sb3IuZ2V0UkdCKCk7XHJcblx0XHRcdGdsLnVuaWZvcm0zZih1bmkubG9jYXRpb24sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0pO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TGlnaHREaXJlY3Rpb25JbnRlbnNpdHknICYmIHNjZW5lLnVzZUxpZ2h0aW5nICYmIHNjZW5lLmRpckxpZ2h0KXtcclxuXHRcdFx0Z2wudW5pZm9ybTFmKHVuaS5sb2NhdGlvbiwgc2NlbmUuZGlyTGlnaHQuaW50ZW5zaXR5KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0XHJcblx0XHRlbHNlIGlmICh1bmkubmFtZSA9PSAndUFtYmllbnRMaWdodENvbG9yJyAmJiBzY2VuZS51c2VMaWdodGluZyAmJiBzY2VuZS5hbWJpZW50TGlnaHQpe1xyXG5cdFx0XHR2YXIgY29sb3IgPSBzY2VuZS5hbWJpZW50TGlnaHQuZ2V0UkdCKCk7XHJcblx0XHRcdGdsLnVuaWZvcm0zZih1bmkubG9jYXRpb24sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRcclxuXHRcdGVsc2UgaWYgKHVuaS5uYW1lID09ICd1TGlnaHRQb2ludFBvc2l0aW9uJyAmJiBzY2VuZS51c2VMaWdodGluZyAmJiBzY2VuZS5wb2ludHNMaWdodHMpe1xyXG5cdFx0XHRwID0gc2NlbmUucG9pbnRzTGlnaHRzLnBvc2l0aW9uO1xyXG5cdFx0XHRnbC51bmlmb3JtM2YodW5pLmxvY2F0aW9uLCBwLngsIHAueSwgcC56KTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUxpZ2h0UG9pbnRJbnRlbnNpdHknICYmIHNjZW5lLnVzZUxpZ2h0aW5nICYmIHNjZW5lLnBvaW50c0xpZ2h0cyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZih1bmkubG9jYXRpb24sIHNjZW5lLnBvaW50c0xpZ2h0cy5pbnRlbnNpdHkpO1xyXG5cdFx0fWVsc2UgaWYodW5pLm5hbWUgPT0gJ3VMaWdodFBvaW50RGlzdGFuY2UnICYmIHNjZW5lLnVzZUxpZ2h0aW5nICYmIHNjZW5lLnBvaW50c0xpZ2h0cyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZih1bmkubG9jYXRpb24sIHNjZW5lLnBvaW50c0xpZ2h0cy5kaXN0YW5jZSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VMaWdodFBvaW50Q29sb3InICYmIHNjZW5lLnVzZUxpZ2h0aW5nICYmIHNjZW5lLnBvaW50c0xpZ2h0cyl7XHJcblx0XHRcdHZhciBjb2xvciA9IHNjZW5lLnBvaW50c0xpZ2h0cy5jb2xvci5nZXRSR0IoKTtcclxuXHRcdFx0Z2wudW5pZm9ybTNmKHVuaS5sb2NhdGlvbiwgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdFxyXG5cdFx0ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VPcGFjaXR5Jyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZih1bmkubG9jYXRpb24sIG1lc2gubWF0ZXJpYWwub3BhY2l0eSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdHJhZERlZ1JlbDogTWF0aC5QSSAvIDE4MCxcclxuXHRcclxuXHRQSV8yOiBNYXRoLlBJIC8gMixcclxuXHRQSTogTWF0aC5QSSxcclxuXHRQSTNfMjogTWF0aC5QSSAqIDMgLyAyLFxyXG5cdFBJMjogTWF0aC5QSSAqIDIsXHJcblx0XHJcblx0ZGVnVG9SYWQ6IGZ1bmN0aW9uKGRlZ3JlZXMpe1xyXG5cdFx0cmV0dXJuIGRlZ3JlZXMgKiB0aGlzLnJhZERlZ1JlbDtcclxuXHR9LFxyXG5cdFxyXG5cdHJhZFRvRGVnOiBmdW5jdGlvbihyYWRpYW5zKXtcclxuXHRcdHJldHVybiByYWRpYW5zIC8gdGhpcy5yYWREZWdSZWw7XHJcblx0fSxcclxuXHRcclxuXHRnZXQyREFuZ2xlOiBmdW5jdGlvbih4MSwgeTEsIHgyLCB5Mil7XHJcblx0XHR2YXIgeHggPSBNYXRoLmFicyh4MiAtIHgxKTtcclxuXHRcdHZhciB5eSA9IE1hdGguYWJzKHkyIC0geTEpO1xyXG5cdFx0XHJcblx0XHR2YXIgYW5nID0gTWF0aC5hdGFuMih5eSwgeHgpO1xyXG5cdFx0XHJcblx0XHRpZiAoeDIgPD0geDEgJiYgeTIgPD0geTEpe1xyXG5cdFx0XHRhbmcgPSB0aGlzLlBJIC0gYW5nO1xyXG5cdFx0fWVsc2UgaWYgKHgyIDw9IHgxICYmIHkyID4geTEpe1xyXG5cdFx0XHRhbmcgPSB0aGlzLlBJICsgYW5nO1xyXG5cdFx0fWVsc2UgaWYgKHgyID4geDEgJiYgeTIgPiB5MSl7XHJcblx0XHRcdGFuZyA9IHRoaXMuUEkyIC0gYW5nO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRhbmcgPSAoYW5nICsgdGhpcy5QSTIpICUgdGhpcy5QSTI7XHJcblx0XHRcclxuXHRcdHJldHVybiBhbmc7XHJcblx0fVxyXG59O1xyXG4iLCJmdW5jdGlvbiBNYXRyaXgzKCl7XHJcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gOSkgdGhyb3cgXCJNYXRyaXggMyBtdXN0IHJlY2VpdmUgOSBwYXJhbWV0ZXJzXCI7XHJcblx0XHJcblx0dmFyIGMgPSAwO1xyXG5cdGZvciAodmFyIGk9MDtpPDk7aSs9Myl7XHJcblx0XHR0aGlzW2NdID0gYXJndW1lbnRzW2ldO1xyXG5cdFx0dGhpc1tjKzNdID0gYXJndW1lbnRzW2krMV07XHJcblx0XHR0aGlzW2MrNl0gPSBhcmd1bWVudHNbaSsyXTtcclxuXHRcdFxyXG5cdFx0YyArPSAxO1xyXG5cdH1cclxuXHRcclxuXHR0aGlzLl9fa3RtdDMgPSB0cnVlO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdHJpeDM7XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS5nZXREZXRlcm1pbmFudCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHZhciBkZXQgPSAoVFswXSAqIFRbNF0gKiBUWzhdKSArIChUWzFdICogVFs1XSAqIFRbNl0pICsgKFRbMl0gKiBUWzNdICogVFs3XSlcclxuXHRcdFx0LSAoVFs2XSAqIFRbNF0gKiBUWzJdKSAtIChUWzddICogVFs1XSAqIFRbMF0pIC0gKFRbOF0gKiBUWzNdICogVFsxXSk7XHJcblx0XHJcblx0cmV0dXJuIGRldDtcclxufTtcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLmludmVyc2UgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBkZXQgPSB0aGlzLmdldERldGVybWluYW50KCk7XHJcblx0aWYgKGRldCA9PSAwKSByZXR1cm4gbnVsbDtcclxuXHRcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0dmFyIGludiA9IG5ldyBNYXRyaXgzKFxyXG5cdFx0VFs0XSpUWzhdLVRbNV0qVFs3XSxcdFRbNV0qVFs2XS1UWzNdKlRbOF0sXHRUWzNdKlRbN10tVFs0XSpUWzZdLFxyXG5cdFx0VFsyXSpUWzddLVRbMV0qVFs4XSxcdFRbMF0qVFs4XS1UWzJdKlRbNl0sXHRUWzFdKlRbNl0tVFswXSpUWzddLFxyXG5cdFx0VFsxXSpUWzVdLVRbMl0qVFs0XSxcdFRbMl0qVFszXS1UWzBdKlRbNV0sXHRUWzBdKlRbNF0tVFsxXSpUWzNdXHJcblx0KTtcclxuXHRcclxuXHRpbnYubXVsdGlwbHkoMSAvIGRldCk7XHJcblx0dGhpcy5jb3B5KGludik7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uKG51bWJlcil7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdGZvciAodmFyIGk9MDtpPDk7aSsrKXtcclxuXHRcdFRbaV0gKj0gbnVtYmVyO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbihtYXRyaXgzKXtcclxuXHRpZiAoIW1hdHJpeDMuX19rdG10MykgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgbWF0cml4MyBpbnRvIGFub3RoZXJcIjtcclxuXHRcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0Zm9yICh2YXIgaT0wO2k8OTtpKyspe1xyXG5cdFx0VFtpXSA9IG1hdHJpeDNbaV07XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUudHJhbnNwb3NlID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0dmFyIHZhbHVlcyA9IFtcclxuXHRcdFRbMF0sIFRbM10sIFRbNl0sXHJcblx0XHRUWzFdLCBUWzRdLCBUWzddLFxyXG5cdFx0VFsyXSwgVFs1XSwgVFs4XVxyXG5cdF07XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8OTtpKyspe1xyXG5cdFx0VFtpXSA9IHZhbHVlc1tpXTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS50b0Zsb2F0MzJBcnJheSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFtcclxuXHRcdFRbMF0sIFRbMV0sIFRbMl0sXHJcblx0XHRUWzNdLCBUWzRdLCBUWzVdLFxyXG5cdFx0VFs2XSwgVFs3XSwgVFs4XVxyXG5cdF0pO1xyXG59O1xyXG4iLCJ2YXIgTWF0cml4MyA9IHJlcXVpcmUoJy4vS1RNYXRyaXgzJyk7XHJcblxyXG5mdW5jdGlvbiBNYXRyaXg0KCl7XHJcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMTYpIHRocm93IFwiTWF0cml4IDQgbXVzdCByZWNlaXZlIDE2IHBhcmFtZXRlcnNcIjtcclxuXHRcclxuXHR2YXIgYyA9IDA7XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSs9NCl7XHJcblx0XHR0aGlzW2NdID0gYXJndW1lbnRzW2ldO1xyXG5cdFx0dGhpc1tjKzRdID0gYXJndW1lbnRzW2krMV07XHJcblx0XHR0aGlzW2MrOF0gPSBhcmd1bWVudHNbaSsyXTtcclxuXHRcdHRoaXNbYysxMl0gPSBhcmd1bWVudHNbaSszXTtcclxuXHRcdFxyXG5cdFx0YyArPSAxO1xyXG5cdH1cclxuXHRcclxuXHR0aGlzLl9fa3RtNCA9IHRydWU7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0cml4NDtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLmlkZW50aXR5ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgcGFyYW1zID0gW1xyXG5cdFx0MSwgMCwgMCwgMCxcclxuXHRcdDAsIDEsIDAsIDAsXHJcblx0XHQwLCAwLCAxLCAwLFxyXG5cdFx0MCwgMCwgMCwgMVxyXG5cdF07XHJcblx0XHJcblx0dmFyIGMgPSAwO1xyXG5cdGZvciAodmFyIGk9MDtpPDE2O2krPTQpe1xyXG5cdFx0dGhpc1tjXSA9IHBhcmFtc1tpXTtcclxuXHRcdHRoaXNbYys0XSA9IHBhcmFtc1tpKzFdO1xyXG5cdFx0dGhpc1tjKzhdID0gcGFyYW1zW2krMl07XHJcblx0XHR0aGlzW2MrMTJdID0gcGFyYW1zW2krM107XHJcblx0XHRcclxuXHRcdGMgKz0gMTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5tdWx0aXBseVNjYWxhciA9IGZ1bmN0aW9uKG51bWJlcil7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdGZvciAodmFyIGk9MDtpPDE2O2krKyl7XHJcblx0XHRUW2ldICo9IG51bWJlcjtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uKG1hdHJpeDQpe1xyXG5cdGlmIChtYXRyaXg0Ll9fa3RtNCl7XHJcblx0XHR2YXIgQTEgPSBbdGhpc1swXSwgIHRoaXNbMV0sICB0aGlzWzJdLCAgdGhpc1szXV07XHJcblx0XHR2YXIgQTIgPSBbdGhpc1s0XSwgIHRoaXNbNV0sICB0aGlzWzZdLCAgdGhpc1s3XV07XHJcblx0XHR2YXIgQTMgPSBbdGhpc1s4XSwgIHRoaXNbOV0sICB0aGlzWzEwXSwgdGhpc1sxMV1dO1xyXG5cdFx0dmFyIEE0ID0gW3RoaXNbMTJdLCB0aGlzWzEzXSwgdGhpc1sxNF0sIHRoaXNbMTVdXTtcclxuXHRcdFxyXG5cdFx0dmFyIEIxID0gW21hdHJpeDRbMF0sIG1hdHJpeDRbNF0sIG1hdHJpeDRbOF0sICBtYXRyaXg0WzEyXV07XHJcblx0XHR2YXIgQjIgPSBbbWF0cml4NFsxXSwgbWF0cml4NFs1XSwgbWF0cml4NFs5XSwgIG1hdHJpeDRbMTNdXTtcclxuXHRcdHZhciBCMyA9IFttYXRyaXg0WzJdLCBtYXRyaXg0WzZdLCBtYXRyaXg0WzEwXSwgbWF0cml4NFsxNF1dO1xyXG5cdFx0dmFyIEI0ID0gW21hdHJpeDRbM10sIG1hdHJpeDRbN10sIG1hdHJpeDRbMTFdLCBtYXRyaXg0WzE1XV07XHJcblx0XHRcclxuXHRcdHZhciBkb3QgPSBmdW5jdGlvbihjb2wsIHJvdyl7XHJcblx0XHRcdHZhciBzdW0gPSAwO1xyXG5cdFx0XHRmb3IgKHZhciBqPTA7ajw0O2orKyl7IHN1bSArPSByb3dbal0gKiBjb2xbal07IH1cclxuXHRcdFx0cmV0dXJuIHN1bTtcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdHRoaXNbMF0gPSBkb3QoQTEsIEIxKTsgICB0aGlzWzFdID0gZG90KEExLCBCMik7ICAgdGhpc1syXSA9IGRvdChBMSwgQjMpOyAgIHRoaXNbM10gPSBkb3QoQTEsIEI0KTtcclxuXHRcdHRoaXNbNF0gPSBkb3QoQTIsIEIxKTsgICB0aGlzWzVdID0gZG90KEEyLCBCMik7ICAgdGhpc1s2XSA9IGRvdChBMiwgQjMpOyAgIHRoaXNbN10gPSBkb3QoQTIsIEI0KTtcclxuXHRcdHRoaXNbOF0gPSBkb3QoQTMsIEIxKTsgICB0aGlzWzldID0gZG90KEEzLCBCMik7ICAgdGhpc1sxMF0gPSBkb3QoQTMsIEIzKTsgIHRoaXNbMTFdID0gZG90KEEzLCBCNCk7XHJcblx0XHR0aGlzWzEyXSA9IGRvdChBNCwgQjEpOyAgdGhpc1sxM10gPSBkb3QoQTQsIEIyKTsgIHRoaXNbMTRdID0gZG90KEE0LCBCMyk7ICB0aGlzWzE1XSA9IGRvdChBNCwgQjQpO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9ZWxzZSBpZiAobWF0cml4NC5sZW5ndGggPT0gNCl7XHJcblx0XHR2YXIgcmV0ID0gW107XHJcblx0XHR2YXIgY29sID0gbWF0cml4NDtcclxuXHRcclxuXHRcdGZvciAodmFyIGk9MDtpPDQ7aSs9MSl7XHJcblx0XHRcdHZhciByb3cgPSBbdGhpc1tpXSwgdGhpc1tpKzRdLCB0aGlzW2krOF0sIHRoaXNbaSsxMl1dO1xyXG5cdFx0XHR2YXIgc3VtID0gMDtcclxuXHRcdFx0XHJcblx0XHRcdGZvciAodmFyIGo9MDtqPDQ7aisrKXtcclxuXHRcdFx0XHRzdW0gKz0gcm93W2pdICogY29sW2pdO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXQucHVzaChzdW0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gcmV0O1xyXG5cdH1lbHNle1xyXG5cdFx0dGhyb3cgXCJJbnZhbGlkIGNvbnN0cnVjdG9yXCI7XHJcblx0fVxyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUudHJhbnNwb3NlID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0dmFyIHZhbHVlcyA9IFtcclxuXHRcdFRbMF0sIFRbNF0sIFRbOF0sICBUWzEyXSxcclxuXHRcdFRbMV0sIFRbNV0sIFRbOV0sICBUWzEzXSxcclxuXHRcdFRbMl0sIFRbNl0sIFRbMTBdLCBUWzE0XSxcclxuXHRcdFRbM10sIFRbN10sIFRbMTFdLCBUWzE1XSxcclxuXHRdO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPDE2O2krKyl7XHJcblx0XHR0aGlzW2ldID0gdmFsdWVzW2ldO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbihtYXRyaXg0KXtcclxuXHRpZiAoIW1hdHJpeDQuX19rdG00KSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSBNYXRyaXg0IGludG8gdGhpcyBtYXRyaXhcIjtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKyspe1xyXG5cdFx0dGhpc1tpXSA9IG1hdHJpeDRbaV07XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHRUWzBdLCBUWzRdLCBUWzhdLCAgVFsxMl0sXHJcblx0XHRUWzFdLCBUWzVdLCBUWzldLCAgVFsxM10sXHJcblx0XHRUWzJdLCBUWzZdLCBUWzEwXSwgVFsxNF0sXHJcblx0XHRUWzNdLCBUWzddLCBUWzExXSwgVFsxNV1cclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUudG9GbG9hdDMyQXJyYXkgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHRyZXR1cm4gbmV3IEZsb2F0MzJBcnJheShbXHJcblx0XHRUWzBdLCBUWzFdLCBUWzJdLCAgVFszXSxcclxuXHRcdFRbNF0sIFRbNV0sIFRbNl0sICBUWzddLFxyXG5cdFx0VFs4XSwgVFs5XSwgVFsxMF0sIFRbMTFdLFxyXG5cdFx0VFsxMl0sIFRbMTNdLCBUWzE0XSwgVFsxNV1cclxuXHRdKTtcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLnRvTWF0cml4MyA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHJldHVybiBuZXcgTWF0cml4MyhcclxuXHRcdFRbMF0sIFRbMV0sIFRbMl0sXHJcblx0XHRUWzRdLCBUWzVdLCBUWzZdLFxyXG5cdFx0VFs4XSwgVFs5XSwgVFsxMF1cclxuXHQpOyBcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0SWRlbnRpdHkgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdDEsIDAsIDAsIDAsXHJcblx0XHQwLCAxLCAwLCAwLFxyXG5cdFx0MCwgMCwgMSwgMCxcclxuXHRcdDAsIDAsIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRYUm90YXRpb24gPSBmdW5jdGlvbihyYWRpYW5zKXtcclxuXHR2YXIgQyA9IE1hdGguY29zKHJhZGlhbnMpO1xyXG5cdHZhciBTID0gTWF0aC5zaW4ocmFkaWFucyk7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0MSwgIDAsICAwLCAwLFxyXG5cdFx0MCwgIEMsICBTLCAwLFxyXG5cdFx0MCwgLVMsICBDLCAwLFxyXG5cdFx0MCwgIDAsICAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0WVJvdGF0aW9uID0gZnVuY3Rpb24ocmFkaWFucyl7XHJcblx0dmFyIEMgPSBNYXRoLmNvcyhyYWRpYW5zKTtcclxuXHR2YXIgUyA9IE1hdGguc2luKHJhZGlhbnMpO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdCBDLCAgMCwgIFMsIDAsXHJcblx0XHQgMCwgIDEsICAwLCAwLFxyXG5cdFx0LVMsICAwLCAgQywgMCxcclxuXHRcdCAwLCAgMCwgIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRaUm90YXRpb24gPSBmdW5jdGlvbihyYWRpYW5zKXtcclxuXHR2YXIgQyA9IE1hdGguY29zKHJhZGlhbnMpO1xyXG5cdHZhciBTID0gTWF0aC5zaW4ocmFkaWFucyk7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0IEMsICBTLCAwLCAwLFxyXG5cdFx0LVMsICBDLCAwLCAwLFxyXG5cdFx0IDAsICAwLCAxLCAwLFxyXG5cdFx0IDAsICAwLCAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0VHJhbnNsYXRpb24gPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IHRyYW5zbGF0ZSB0byBhIHZlY3RvciAzXCI7XHJcblx0XHJcblx0dmFyIHggPSB2ZWN0b3IzLng7XHJcblx0dmFyIHkgPSB2ZWN0b3IzLnk7XHJcblx0dmFyIHogPSB2ZWN0b3IzLno7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0MSwgMCwgMCwgeCxcclxuXHRcdDAsIDEsIDAsIHksXHJcblx0XHQwLCAwLCAxLCB6LFxyXG5cdFx0MCwgMCwgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFNjYWxlID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBzY2FsZSB0byBhIHZlY3RvciAzXCI7XHJcblx0XHJcblx0dmFyIHN4ID0gdmVjdG9yMy54O1xyXG5cdHZhciBzeSA9IHZlY3RvcjMueTtcclxuXHR2YXIgc3ogPSB2ZWN0b3IzLno7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0c3gsICAwLCAgMCwgMCxcclxuXHRcdCAwLCBzeSwgIDAsIDAsXHJcblx0XHQgMCwgIDAsIHN6LCAwLFxyXG5cdFx0IDAsICAwLCAgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFRyYW5zZm9ybWF0aW9uID0gZnVuY3Rpb24ocG9zaXRpb24sIHJvdGF0aW9uLCBzY2FsZSl7XHJcblx0aWYgKCFwb3NpdGlvbi5fX2t0djMpIHRocm93IFwiUG9zaXRpb24gbXVzdCBiZSBhIFZlY3RvcjNcIjtcclxuXHRpZiAoIXJvdGF0aW9uLl9fa3R2MykgdGhyb3cgXCJSb3RhdGlvbiBtdXN0IGJlIGEgVmVjdG9yM1wiO1xyXG5cdGlmIChzY2FsZSAmJiAhc2NhbGUuX19rdHYzKSB0aHJvdyBcIlNjYWxlIG11c3QgYmUgYSBWZWN0b3IzXCI7XHJcblx0XHJcblx0dmFyIHNjYWxlID0gKHNjYWxlKT8gTWF0cml4NC5nZXRTY2FsZShzY2FsZSkgOiBNYXRyaXg0LmdldElkZW50aXR5KCk7XHJcblx0XHJcblx0dmFyIHJvdGF0aW9uWCA9IE1hdHJpeDQuZ2V0WFJvdGF0aW9uKHJvdGF0aW9uLngpO1xyXG5cdHZhciByb3RhdGlvblkgPSBNYXRyaXg0LmdldFlSb3RhdGlvbihyb3RhdGlvbi55KTtcclxuXHR2YXIgcm90YXRpb25aID0gTWF0cml4NC5nZXRaUm90YXRpb24ocm90YXRpb24ueik7XHJcblx0XHJcblx0dmFyIHRyYW5zbGF0aW9uID0gTWF0cml4NC5nZXRUcmFuc2xhdGlvbihwb3NpdGlvbik7XHJcblx0XHJcblx0dmFyIG1hdHJpeDtcclxuXHRtYXRyaXggPSBNYXRyaXg0LmdldElkZW50aXR5KCk7XHJcblx0bWF0cml4Lm11bHRpcGx5KHJvdGF0aW9uWCk7XHJcblx0bWF0cml4Lm11bHRpcGx5KHJvdGF0aW9uWSk7XHJcblx0bWF0cml4Lm11bHRpcGx5KHJvdGF0aW9uWik7XHJcblx0bWF0cml4Lm11bHRpcGx5KHRyYW5zbGF0aW9uKTtcclxuXHRtYXRyaXgubXVsdGlwbHkoc2NhbGUpO1xyXG5cdFxyXG5cdHJldHVybiBtYXRyaXg7XHJcbn07XHJcbiIsInZhciBNYXRyaXg0ID0gcmVxdWlyZSgnLi9LVE1hdHJpeDQnKTtcclxudmFyIFZlYzMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG5cclxuZnVuY3Rpb24gTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpe1xyXG5cdGlmICghZ2VvbWV0cnkuX19rdGdlb21ldHJ5KSB0aHJvdyBcIkdlb21ldHJ5IG11c3QgYmUgYSBLVEdlb21ldHJ5IGluc3RhbmNlXCI7XHJcblx0aWYgKCFtYXRlcmlhbC5fX2t0bWF0ZXJpYWwpIHRocm93IFwiTWF0ZXJpYWwgbXVzdCBiZSBhIEtUTWF0ZXJpYWwgaW5zdGFuY2VcIjtcclxuXHRcclxuXHR0aGlzLl9fa3RtZXNoID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLmdlb21ldHJ5ID0gZ2VvbWV0cnk7XHJcblx0dGhpcy5tYXRlcmlhbCA9IG1hdGVyaWFsO1xyXG5cdFxyXG5cdHRoaXMucGFyZW50ID0gbnVsbDtcclxuXHR0aGlzLnZpc2libGUgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMucG9zaXRpb24gPSBuZXcgVmVjMygwLCAwLCAwKTtcclxuXHR0aGlzLnJvdGF0aW9uID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcblx0dGhpcy5zY2FsZSA9IG5ldyBWZWMzKDEsIDEsIDEpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lc2g7XHJcblxyXG5NZXNoLnByb3RvdHlwZS5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIG1hdHJpeCA9IE1hdHJpeDQuZ2V0VHJhbnNmb3JtYXRpb24odGhpcy5wb3NpdGlvbiwgdGhpcy5yb3RhdGlvbiwgdGhpcy5zY2FsZSk7XHJcblx0XHJcblx0aWYgKHRoaXMucGFyZW50KXtcclxuXHRcdHZhciBtID0gdGhpcy5wYXJlbnQuZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuXHRcdG1hdHJpeC5tdWx0aXBseShtKTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIG1hdHJpeDtcclxufTtcclxuIiwidmFyIFZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG52YXIgVmVjdG9yMyA9IHJlcXVpcmUoJy4vS1RWZWN0b3IzJyk7XHJcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4vS1RJbnB1dCcpO1xyXG52YXIgS1RNYXRoID0gcmVxdWlyZSgnLi9LVE1hdGgnKTtcclxuXHJcbmZ1bmN0aW9uIE9yYml0QW5kUGFuKHRhcmdldCl7XHJcblx0dGhpcy5fX2t0Q2FtQ3RybHMgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMuY2FtZXJhID0gbnVsbDtcclxuXHR0aGlzLmxhc3REcmFnID0gbnVsbDtcclxuXHR0aGlzLmxhc3RQYW4gPSBudWxsO1xyXG5cdHRoaXMudGFyZ2V0ID0gKHRhcmdldCk/IHRhcmdldCA6IG5ldyBWZWN0b3IzKDAuMCwgMC4wLCAwLjApO1xyXG5cdHRoaXMuYW5nbGUgPSBuZXcgVmVjdG9yMigwLjAsIDAuMCk7XHJcblx0dGhpcy56b29tID0gMTtcclxuXHR0aGlzLnNlbnNpdGl2aXR5ID0gbmV3IFZlY3RvcjIoMC41LCAwLjUpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE9yYml0QW5kUGFuO1xyXG5cclxuT3JiaXRBbmRQYW4ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0aWYgKElucHV0LmlzV2hlZWxNb3ZlZChJbnB1dC52TW91c2UuV0hFRUxVUCkpeyB0aGlzLnpvb20gLT0gMC4zOyB0aGlzLnNldENhbWVyYVBvc2l0aW9uKCk7IH1cclxuXHRlbHNlIGlmIChJbnB1dC5pc1doZWVsTW92ZWQoSW5wdXQudk1vdXNlLldIRUVMRE9XTikpeyB0aGlzLnpvb20gKz0gMC4zOyB0aGlzLnNldENhbWVyYVBvc2l0aW9uKCk7IH1cclxuXHRcclxuXHRpZiAoSW5wdXQuaXNNb3VzZURvd24oSW5wdXQudk1vdXNlLkxFRlQpKXtcclxuXHRcdGlmICh0aGlzLmxhc3REcmFnID09IG51bGwpIHRoaXMubGFzdERyYWcgPSBJbnB1dC5fbW91c2UucG9zaXRpb24uY2xvbmUoKTtcclxuXHRcdFxyXG5cdFx0dmFyIGR4ID0gSW5wdXQuX21vdXNlLnBvc2l0aW9uLnggLSB0aGlzLmxhc3REcmFnLng7XHJcblx0XHR2YXIgZHkgPSBJbnB1dC5fbW91c2UucG9zaXRpb24ueSAtIHRoaXMubGFzdERyYWcueTtcclxuXHRcdFxyXG5cdFx0aWYgKGR4ICE9IDAuMCB8fCBkeSAhPSAwLjApe1xyXG5cdFx0XHR0aGlzLmFuZ2xlLnggLT0gS1RNYXRoLmRlZ1RvUmFkKGR4ICogdGhpcy5zZW5zaXRpdml0eS54KTtcclxuXHRcdFx0dGhpcy5hbmdsZS55IC09IEtUTWF0aC5kZWdUb1JhZChkeSAqIHRoaXMuc2Vuc2l0aXZpdHkueSk7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnNldENhbWVyYVBvc2l0aW9uKCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMubGFzdERyYWcuY29weShJbnB1dC5fbW91c2UucG9zaXRpb24pO1xyXG5cdH1lbHNle1xyXG5cdFx0dGhpcy5sYXN0RHJhZyA9IG51bGw7XHJcblx0fVxyXG5cdFxyXG5cdGlmIChJbnB1dC5pc01vdXNlRG93bihJbnB1dC52TW91c2UuUklHSFQpKXtcclxuXHRcdGlmICh0aGlzLmxhc3RQYW4gPT0gbnVsbCkgdGhpcy5sYXN0UGFuID0gSW5wdXQuX21vdXNlLnBvc2l0aW9uLmNsb25lKCk7XHJcblx0XHRcclxuXHRcdHZhciBkeCA9IElucHV0Ll9tb3VzZS5wb3NpdGlvbi54IC0gdGhpcy5sYXN0UGFuLng7XHJcblx0XHR2YXIgZHkgPSBJbnB1dC5fbW91c2UucG9zaXRpb24ueSAtIHRoaXMubGFzdFBhbi55O1xyXG5cdFx0XHJcblx0XHRpZiAoZHggIT0gMC4wIHx8IGR5ICE9IDAuMCl7XHJcblx0XHRcdHZhciB0aGV0YSA9IC10aGlzLmFuZ2xlLnk7XHJcblx0XHRcdHZhciBhbmcgPSAtdGhpcy5hbmdsZS54IC0gS1RNYXRoLlBJXzI7XHJcblx0XHRcdHZhciBjb3MgPSBNYXRoLmNvcyhhbmcpO1xyXG5cdFx0XHR2YXIgc2luID0gTWF0aC5zaW4oYW5nKTtcclxuXHRcdFx0dmFyIGNvc1QgPSBNYXRoLmNvcyh0aGV0YSk7XHJcblx0XHRcdHZhciBzaW5UID0gTWF0aC5zaW4odGhldGEpO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy50YXJnZXQueCAtPSBjb3MgKiBkeCAqIHRoaXMuc2Vuc2l0aXZpdHkueCAvIDEwO1xyXG5cdFx0XHR0aGlzLnRhcmdldC55IC09IGNvc1QgKiBkeSAqIHRoaXMuc2Vuc2l0aXZpdHkueSAvIDEwO1xyXG5cdFx0XHR0aGlzLnRhcmdldC56IC09IHNpbiAqIGR4ICogdGhpcy5zZW5zaXRpdml0eS54IC8gMTA7XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnNldENhbWVyYVBvc2l0aW9uKCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMubGFzdFBhbi5jb3B5KElucHV0Ll9tb3VzZS5wb3NpdGlvbik7XHJcblx0fWVsc2V7XHJcblx0XHR0aGlzLmxhc3RQYW4gPSBudWxsO1xyXG5cdH1cclxufTtcclxuXHJcbk9yYml0QW5kUGFuLnByb3RvdHlwZS5zZXRDYW1lcmFQb3NpdGlvbiA9IGZ1bmN0aW9uKCl7XHJcblx0dGhpcy5hbmdsZS54ID0gKHRoaXMuYW5nbGUueCArIEtUTWF0aC5QSTIpICUgS1RNYXRoLlBJMjtcclxuXHR0aGlzLmFuZ2xlLnkgPSAodGhpcy5hbmdsZS55ICsgS1RNYXRoLlBJMikgJSBLVE1hdGguUEkyO1xyXG5cdFxyXG5cdGlmICh0aGlzLmFuZ2xlLnkgPCBLVE1hdGguUEkgJiYgdGhpcy5hbmdsZS55ID49IEtUTWF0aC5QSV8yKSB0aGlzLmFuZ2xlLnkgPSBLVE1hdGguZGVnVG9SYWQoODkuOSk7XHJcblx0aWYgKHRoaXMuYW5nbGUueSA+IEtUTWF0aC5QSSAmJiB0aGlzLmFuZ2xlLnkgPD0gS1RNYXRoLlBJM18yKSB0aGlzLmFuZ2xlLnkgPSBLVE1hdGguZGVnVG9SYWQoMjcwLjkpO1xyXG5cdGlmICh0aGlzLnpvb20gPD0gMC4zKSB0aGlzLnpvb20gPSAwLjM7XHJcblx0XHJcblx0dmFyIGNvc1QgPSBNYXRoLmNvcyh0aGlzLmFuZ2xlLnkpO1xyXG5cdHZhciBzaW5UID0gTWF0aC5zaW4odGhpcy5hbmdsZS55KTtcclxuXHRcclxuXHR2YXIgeCA9IHRoaXMudGFyZ2V0LnggKyBNYXRoLmNvcyh0aGlzLmFuZ2xlLngpICogY29zVCAqIHRoaXMuem9vbTtcclxuXHR2YXIgeSA9IHRoaXMudGFyZ2V0LnkgKyBzaW5UICogdGhpcy56b29tO1xyXG5cdHZhciB6ID0gdGhpcy50YXJnZXQueiAtIE1hdGguc2luKHRoaXMuYW5nbGUueCkgKiBjb3NUICogdGhpcy56b29tO1xyXG5cdFxyXG5cdHRoaXMuY2FtZXJhLnBvc2l0aW9uLnNldCh4LCB5LCB6KTtcclxuXHR0aGlzLmNhbWVyYS5sb29rQXQodGhpcy50YXJnZXQpO1xyXG59O1xyXG4iLCJ2YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxuXHJcbmZ1bmN0aW9uIFNjZW5lKHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0c2NlbmUgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMubWVzaGVzID0gW107XHJcblx0dGhpcy5kaXJMaWdodCA9IG51bGw7XHJcblx0dGhpcy5wb2ludHNMaWdodHMgPSBudWxsO1xyXG5cdHRoaXMuc2hhZGluZ01vZGUgPSBbJ0JBU0lDJywgJ0xBTUJFUlQnXTtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy51c2VMaWdodGluZyA9IChwYXJhbXMudXNlTGlnaHRpbmcpPyB0cnVlIDogZmFsc2U7XHJcblx0dGhpcy5hbWJpZW50TGlnaHQgPSAocGFyYW1zLmFtYmllbnRMaWdodCk/IG5ldyBDb2xvcihwYXJhbXMuYW1iaWVudExpZ2h0KSA6IG51bGw7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2NlbmU7XHJcblxyXG5TY2VuZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24ob2JqZWN0KXtcclxuXHRpZiAob2JqZWN0Ll9fa3RtZXNoKXtcclxuXHRcdHRoaXMubWVzaGVzLnB1c2gob2JqZWN0KTtcclxuXHR9ZWxzZSBpZiAob2JqZWN0Ll9fa3RkaXJMaWdodCl7XHJcblx0XHR0aGlzLmRpckxpZ2h0ID0gb2JqZWN0O1xyXG5cdH1lbHNlIGlmIChvYmplY3QuX2t0cG9pbnRsaWdodCl7XHJcblx0XHR0aGlzLnBvaW50c0xpZ2h0cyA9IG9iamVjdDtcclxuXHR9ZWxzZXtcclxuXHRcdHRocm93IFwiQ2FuJ3QgYWRkIHRoZSBvYmplY3QgdG8gdGhlIHNjZW5lXCI7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuU2NlbmUucHJvdG90eXBlLmRyYXdNZXNoID0gZnVuY3Rpb24obWVzaCwgY2FtZXJhKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHR2YXIgbWF0ZXJpYWwgPSBtZXNoLm1hdGVyaWFsO1xyXG5cdHZhciBzaGFkZXIgPSBtYXRlcmlhbC5zaGFkZXI7XHJcblx0XHJcblx0S1Quc3dpdGNoUHJvZ3JhbShzaGFkZXIpO1xyXG5cdHRoaXMuc2V0TWF0ZXJpYWxBdHRyaWJ1dGVzKG1lc2gubWF0ZXJpYWwpO1xyXG5cdFxyXG5cdG1hdGVyaWFsLnNlbmRBdHRyaWJEYXRhKG1lc2gsIGNhbWVyYSwgdGhpcyk7XHJcblx0bWF0ZXJpYWwuc2VuZFVuaWZvcm1EYXRhKG1lc2gsIGNhbWVyYSwgdGhpcyk7XHJcblx0XHJcblx0Z2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbWVzaC5nZW9tZXRyeS5mYWNlc0J1ZmZlcik7XHJcblx0Z2wuZHJhd0VsZW1lbnRzKGdsW21hdGVyaWFsLmRyYXdBc10sIG1lc2guZ2VvbWV0cnkuZmFjZXNCdWZmZXIubnVtSXRlbXMsIGdsLlVOU0lHTkVEX1NIT1JULCAwKTtcclxufTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihjYW1lcmEpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdHZhciBiYyA9IGNhbWVyYS5iYWNrZ3JvdW5kQ29sb3IuZ2V0UkdCQSgpO1xyXG5cdGdsLmNsZWFyQ29sb3IoYmNbMF0sIGJjWzFdLCBiY1syXSwgYmNbM10pO1xyXG5cdGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcclxuXHRcclxuXHRnbC5kaXNhYmxlKCBnbC5CTEVORCApOyBcclxuXHR2YXIgdHJhbnNwYXJlbnRzID0gW107XHJcblx0XHJcblx0aWYgKGNhbWVyYS5jb250cm9scykgY2FtZXJhLmNvbnRyb2xzLnVwZGF0ZSgpO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy5tZXNoZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgbWVzaCA9IHRoaXMubWVzaGVzW2ldO1xyXG5cdFx0aWYgKCFtZXNoLnZpc2libGUpIGNvbnRpbnVlO1xyXG5cdFx0aWYgKG1lc2gubWF0ZXJpYWwub3BhY2l0eSA9PSAwLjApIGNvbnRpbnVlO1xyXG5cdFx0XHJcblx0XHR2YXIgc2hhZGluZyA9IHRoaXMuc2hhZGluZ01vZGUuaW5kZXhPZihtZXNoLm1hdGVyaWFsLnNoYWRpbmcpO1xyXG5cdFx0aWYgKHNoYWRpbmcgPT0gMSl7XHJcblx0XHRcdGlmIChtZXNoLm1hdGVyaWFsLm9wYWNpdHkgIT0gMS4wKXtcclxuXHRcdFx0XHR0cmFuc3BhcmVudHMucHVzaChtZXNoKTtcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLmRyYXdNZXNoKG1lc2gsIGNhbWVyYSk7XHJcblx0fVxyXG5cdFxyXG5cdGdsLmVuYWJsZSggZ2wuQkxFTkQgKTsgXHJcblx0Zm9yICh2YXIgaT0wLGxlbj10cmFuc3BhcmVudHMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgbWVzaCA9IHRyYW5zcGFyZW50c1tpXTtcclxuXHRcdHRoaXMuZHJhd01lc2gobWVzaCwgY2FtZXJhKTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5cblNjZW5lLnByb3RvdHlwZS5zZXRNYXRlcmlhbEF0dHJpYnV0ZXMgPSBmdW5jdGlvbihtYXRlcmlhbCl7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0XHJcblx0dmFyIGN1bGwgPSBcIkJBQ0tcIjtcclxuXHRpZiAobWF0ZXJpYWwuZHJhd0ZhY2VzID09ICdCQUNLJyl7IGN1bGwgPSBcIkZST05UXCI7IH1cclxuXHRlbHNlIGlmIChtYXRlcmlhbC5kcmF3RmFjZXMgPT0gJ0JPVEgnKXsgY3VsbCA9IFwiXCI7IH1cclxuXHRcclxuXHRpZiAoY3VsbCAhPSBcIlwiKXtcclxuXHRcdGdsLmVuYWJsZShnbC5DVUxMX0ZBQ0UpO1xyXG5cdFx0Z2wuY3VsbEZhY2UoZ2xbY3VsbF0pO1xyXG5cdH1lbHNle1xyXG5cdFx0Z2wuZGlzYWJsZShnbC5DVUxMX0ZBQ0UpO1xyXG5cdH1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0YmFzaWM6IHtcclxuXHRcdGF0dHJpYnV0ZXM6IFtcclxuXHRcdFx0e25hbWU6ICdhVmVydGV4UG9zaXRpb24nfSxcclxuXHRcdFx0e25hbWU6ICdhVmVydGV4Q29sb3InfSxcclxuXHRcdFx0e25hbWU6ICdhVGV4dHVyZUNvb3JkJ31cclxuXHRcdF0sXHJcblx0XHR1bmlmb3JtczogW1xyXG5cdFx0XHR7bmFtZTogJ3VNVlBNYXRyaXgnfSxcclxuXHRcdFx0e25hbWU6ICd1TWF0ZXJpYWxDb2xvcid9LFxyXG5cdFx0XHR7bmFtZTogJ3VUZXh0dXJlU2FtcGxlcid9LFxyXG5cdFx0XHR7bmFtZTogJ3VIYXNUZXh0dXJlJ31cclxuXHRcdF0sXHJcblx0XHR2ZXJ0ZXhTaGFkZXI6IFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzIgYVRleHR1cmVDb29yZDsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleFBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjNCBhVmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdU1WUE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCB2ZWM0IHVNYXRlcmlhbENvbG9yOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZWZXJ0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIgKyAgXHJcblx0XHRcdFxyXG5cdFx0XHRcInZvaWQgbWFpbih2b2lkKXsgXCIgKyBcclxuXHRcdFx0XHRcImdsX1Bvc2l0aW9uID0gdU1WUE1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcdFwidlZlcnRleENvbG9yID0gYVZlcnRleENvbG9yICogdU1hdGVyaWFsQ29sb3I7IFwiICtcclxuXHRcdFx0XHRcInZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkOyBcIiArIFxyXG5cdFx0XHRcIn0gXCIgLFxyXG5cdFx0ZnJhZ21lbnRTaGFkZXI6IFxyXG5cdFx0XHRcInVuaWZvcm0gc2FtcGxlcjJEIHVUZXh0dXJlU2FtcGxlcjsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gYm9vbCB1SGFzVGV4dHVyZTsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMiB2VGV4dHVyZUNvb3JkOyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZWZXJ0ZXhDb2xvcjsgXCIgKyBcclxuXHRcdFx0XHJcblx0XHRcdFwidm9pZCBtYWluKHZvaWQpeyBcIiArXHJcblx0XHRcdFx0XCJtZWRpdW1wIHZlYzQgY29sb3IgPSB2VmVydGV4Q29sb3I7IFwiICsgXHJcblx0XHRcdFx0XCJpZiAodUhhc1RleHR1cmUpeyBcIiArIFxyXG5cdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzQgdGV4Q29sb3IgPSB0ZXh0dXJlMkQodVRleHR1cmVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQucywgdlRleHR1cmVDb29yZC50KSk7IFwiICtcclxuXHRcdFx0XHRcdFwiY29sb3IgKj0gdGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHRcIn0gXCIgKyBcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcImdsX0ZyYWdDb2xvciA9IGNvbG9yO1wiICsgXHJcblx0XHRcdFwifVwiXHJcblx0fSxcclxuXHRcclxuXHRcclxuXHRsYW1iZXJ0OiB7XHJcblx0XHRhdHRyaWJ1dGVzOiBbXHJcblx0XHRcdHtuYW1lOiAnYVZlcnRleFBvc2l0aW9uJ30sXHJcblx0XHRcdHtuYW1lOiAnYVZlcnRleENvbG9yJ30sXHJcblx0XHRcdHtuYW1lOiAnYVRleHR1cmVDb29yZCd9LFxyXG5cdFx0XHRcclxuXHRcdFx0e25hbWU6ICdhVmVydGV4Tm9ybWFsJ31cclxuXHRcdF0sXHJcblx0XHR1bmlmb3JtczogW1xyXG5cdFx0XHR7bmFtZTogJ3VNVk1hdHJpeCd9LFxyXG5cdFx0XHR7bmFtZTogJ3VQTWF0cml4J30sXHJcblx0XHRcdHtuYW1lOiAndU1hdGVyaWFsQ29sb3InfSxcclxuXHRcdFx0e25hbWU6ICd1VGV4dHVyZVNhbXBsZXInfSxcclxuXHRcdFx0e25hbWU6ICd1SGFzVGV4dHVyZSd9LFxyXG5cdFx0XHRcclxuXHRcdFx0e25hbWU6ICd1VXNlTGlnaHRpbmcnfSxcclxuXHRcdFx0e25hbWU6ICd1Tm9ybWFsTWF0cml4J30sXHJcblx0XHRcdHtuYW1lOiAndU1vZGVsTWF0cml4J30sXHJcblx0XHRcdFxyXG5cdFx0XHR7bmFtZTogJ3VBbWJpZW50TGlnaHRDb2xvcid9LFxyXG5cdFx0XHRcclxuXHRcdFx0e25hbWU6ICd1TGlnaHREaXJlY3Rpb24nfSxcclxuXHRcdFx0e25hbWU6ICd1TGlnaHREaXJlY3Rpb25Db2xvcid9LFxyXG5cdFx0XHR7bmFtZTogJ3VMaWdodERpcmVjdGlvbkludGVuc2l0eSd9LFxyXG5cdFx0XHRcclxuXHRcdFx0e25hbWU6ICd1TGlnaHRQb2ludFBvc2l0aW9uJ30sXHJcblx0XHRcdHtuYW1lOiAndUxpZ2h0UG9pbnRJbnRlbnNpdHknfSxcclxuXHRcdFx0e25hbWU6ICd1TGlnaHRQb2ludENvbG9yJ30sXHJcblx0XHRcdHtuYW1lOiAndUxpZ2h0UG9pbnREaXN0YW5jZSd9LFxyXG5cdFx0XHRcclxuXHRcdFx0e25hbWU6ICd1T3BhY2l0eSd9XHJcblx0XHRdLFxyXG5cdFx0dmVydGV4U2hhZGVyOiBcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMyIGFUZXh0dXJlQ29vcmQ7IFwiICtcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzQgYVZlcnRleENvbG9yOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleE5vcm1hbDsgXCIgKyBcclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVNVk1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVQTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzQgdU1hdGVyaWFsQ29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVVc2VMaWdodGluZzsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQ0IHVNb2RlbE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCBtYXQzIHVOb3JtYWxNYXRyaXg7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzMgdUFtYmllbnRMaWdodENvbG9yOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCB2ZWMzIHVMaWdodERpcmVjdGlvbjsgXCIgK1xyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCB2ZWMzIHVMaWdodERpcmVjdGlvbkNvbG9yOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIGZsb2F0IHVMaWdodERpcmVjdGlvbkludGVuc2l0eTsgXCIgKyAgXHJcblx0XHRcdFxyXG5cdFx0XHRcInVuaWZvcm0gbWVkaXVtcCB2ZWMzIHVMaWdodFBvaW50UG9zaXRpb247IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgdmVjMyB1TGlnaHRQb2ludENvbG9yOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIGZsb2F0IHVMaWdodFBvaW50SW50ZW5zaXR5OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIGZsb2F0IHVMaWdodFBvaW50RGlzdGFuY2U7IFwiICsgXHJcblxyXG5cdFx0XHRcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjMiB2VGV4dHVyZUNvb3JkO1wiICsgIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMzIHZMaWdodFdlaWdodDsgXCIgKyBcclxuXHRcdFx0XHJcblx0XHRcdFwidm9pZCBtYWluKHZvaWQpeyBcIiArIFxyXG5cdFx0XHRcdFwidmVjNCBtb2RlbFZpZXdQb3NpdGlvbiA9IHVNVk1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApOyBcIiArXHJcblx0XHRcdFx0XCJnbF9Qb3NpdGlvbiA9IHVQTWF0cml4ICogbW9kZWxWaWV3UG9zaXRpb247IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFx0XCJpZiAodVVzZUxpZ2h0aW5nKXsgXCIgKyBcclxuXHRcdFx0XHRcdFwidmVjMyB0cmFuc2Zvcm1lZE5vcm1hbCA9IHVOb3JtYWxNYXRyaXggKiBhVmVydGV4Tm9ybWFsOyBcIiArXHJcblx0XHRcdFx0XHRcInZMaWdodFdlaWdodCA9IHVBbWJpZW50TGlnaHRDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcImZsb2F0IGRpckxpZ2h0V2VpZ2h0ID0gbWF4KGRvdCh0cmFuc2Zvcm1lZE5vcm1hbCwgdUxpZ2h0RGlyZWN0aW9uKSwgMC4wKTsgXCIgK1xyXG5cdFx0XHRcdFx0XCJ2TGlnaHRXZWlnaHQgKz0gKHVMaWdodERpcmVjdGlvbkNvbG9yICogZGlyTGlnaHRXZWlnaHQgKiB1TGlnaHREaXJlY3Rpb25JbnRlbnNpdHkpOyBcIiArXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFwidmVjMyB2ZXJ0ZXhNb2RlbFBvc2l0aW9uID0gKHVNb2RlbE1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eXo7IFwiICtcclxuXHRcdFx0XHRcdFwidmVjMyBsaWdodERpc3QgPSB1TGlnaHRQb2ludFBvc2l0aW9uIC0gdmVydGV4TW9kZWxQb3NpdGlvbjtcIiArXHJcblx0XHRcdFx0XHRcImZsb2F0IGRpc3RhbmNlID0gbGVuZ3RoKGxpZ2h0RGlzdCk7IFwiICtcclxuXHRcdFx0XHRcdFwiaWYgKGRpc3RhbmNlIDw9IHVMaWdodFBvaW50RGlzdGFuY2UpeyBcIiArXHJcblx0XHRcdFx0XHRcdFwidmVjMyBwb2ludExpZ2h0RGlyZWN0aW9uID0gbm9ybWFsaXplKGxpZ2h0RGlzdCk7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJmbG9hdCBwb2ludExpZ2h0V2VpZ2h0ID0gbWF4KGRvdCh0cmFuc2Zvcm1lZE5vcm1hbCwgcG9pbnRMaWdodERpcmVjdGlvbiksIDAuMCk7IFwiICtcclxuXHRcdFx0XHRcdFx0XCJ2TGlnaHRXZWlnaHQgKz0gKHVMaWdodFBvaW50Q29sb3IgKiBwb2ludExpZ2h0V2VpZ2h0ICogdUxpZ2h0UG9pbnRJbnRlbnNpdHkpIC8gZGlzdGFuY2U7IFwiICtcclxuXHRcdFx0XHRcdFwifSBcIiArXHJcblx0XHRcdFx0XCJ9ZWxzZXsgXCIgK1xyXG5cdFx0XHRcdFx0XCJ2TGlnaHRXZWlnaHQgPSB2ZWMzKDEuMCk7IFwiICsgXHJcblx0XHRcdFx0XCJ9XCIgKyAgIFxyXG5cdFx0XHRcdCBcclxuXHRcdFx0XHRcInZWZXJ0ZXhDb2xvciA9IGFWZXJ0ZXhDb2xvciAqIHVNYXRlcmlhbENvbG9yOyBcIiArXHJcblx0XHRcdFx0XCJ2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDsgXCIgKyAgXHJcblx0XHRcdFwifSBcIiAsXHJcblx0XHRmcmFnbWVudFNoYWRlcjogXHJcblx0XHRcdFwidW5pZm9ybSBzYW1wbGVyMkQgdVRleHR1cmVTYW1wbGVyOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVIYXNUZXh0dXJlOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIGZsb2F0IHVPcGFjaXR5OyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdlZlcnRleENvbG9yOyBcIiArIFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMzIHZMaWdodFdlaWdodDsgXCIgKyBcclxuXHRcdFx0XHJcblx0XHRcdFwidm9pZCBtYWluKHZvaWQpeyBcIiArXHJcblx0XHRcdFx0XCJtZWRpdW1wIHZlYzQgY29sb3IgPSB2VmVydGV4Q29sb3I7IFwiICsgXHJcblx0XHRcdFx0XCJpZiAodUhhc1RleHR1cmUpeyBcIiArIFxyXG5cdFx0XHRcdFx0XCJtZWRpdW1wIHZlYzQgdGV4Q29sb3IgPSB0ZXh0dXJlMkQodVRleHR1cmVTYW1wbGVyLCB2ZWMyKHZUZXh0dXJlQ29vcmQucywgdlRleHR1cmVDb29yZC50KSk7IFwiICtcclxuXHRcdFx0XHRcdFwiY29sb3IgKj0gdGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHRcIn0gXCIgKyBcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcImNvbG9yLnJnYiAqPSB2TGlnaHRXZWlnaHQ7IFwiICsgXHJcblx0XHRcdFx0XCJnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLnJnYiwgY29sb3IuYSAqIHVPcGFjaXR5KTsgXCIgKyBcclxuXHRcdFx0XCJ9XCJcclxuXHR9XHJcbn07IiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxudmFyIFV0aWxzID0gcmVxdWlyZSgnLi9LVFV0aWxzJyk7XHJcblxyXG5mdW5jdGlvbiBUZXh0dXJlKHNyYywgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3R0ZXh0dXJlID0gdHJ1ZTtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5taW5GaWx0ZXIgPSAocGFyYW1zLm1pbkZpbHRlcik/IHBhcmFtcy5taW5GaWx0ZXIgOiAnTElORUFSJztcclxuXHR0aGlzLm1hZ0ZpbHRlciA9IChwYXJhbXMubWFnRmlsdGVyKT8gcGFyYW1zLm1hZ0ZpbHRlciA6ICdMSU5FQVInO1xyXG5cdHRoaXMud3JhcFMgPSAocGFyYW1zLlNXcmFwcGluZyk/IHBhcmFtcy5TV3JhcHBpbmcgOiAnUkVQRUFUJztcclxuXHR0aGlzLndyYXBUID0gKHBhcmFtcy5UV3JhcHBpbmcpPyBwYXJhbXMuVFdyYXBwaW5nIDogJ1JFUEVBVCc7XHJcblx0XHJcblx0dGhpcy50ZXh0dWUgPSBudWxsO1xyXG5cdFxyXG5cdHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHR0aGlzLmltYWdlLnNyYyA9IHNyYztcclxuXHR0aGlzLmltYWdlLnJlYWR5ID0gZmFsc2U7XHJcblx0XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdFV0aWxzLmFkZEV2ZW50KHRoaXMuaW1hZ2UsIFwibG9hZFwiLCBmdW5jdGlvbigpe1xyXG5cdFx0VC5wYXJzZVRleHR1cmUoKTsgXHJcblx0fSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dHVyZTtcclxuXHJcblRleHR1cmUucHJvdG90eXBlLnBhcnNlVGV4dHVyZSA9IGZ1bmN0aW9uKCl7XHJcblx0aWYgKHRoaXMuaW1hZ2UucmVhZHkpIHJldHVybjtcclxuXHRcclxuXHR0aGlzLmltYWdlLnJlYWR5ID0gdHJ1ZTtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHR0aGlzLnRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcclxuXHRcclxuXHRnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCB0cnVlKTtcclxuXHRcclxuXHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIHRoaXMuaW1hZ2UpO1xyXG5cdFxyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbFt0aGlzLm1hZ0ZpbHRlcl0pO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbFt0aGlzLm1pbkZpbHRlcl0pO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsW3RoaXMud3JhcFNdKTtcclxuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbFt0aGlzLndyYXBUXSk7XHJcblx0XHJcblx0Z2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XHJcblx0XHJcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGdldDogZnVuY3Rpb24oZWxlbWVudCl7XHJcblx0XHRpZiAoZWxlbWVudC5jaGFyQXQoMCkgPT0gXCIjXCIpe1xyXG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudC5yZXBsYWNlKFwiI1wiLCBcIlwiKSk7XHJcblx0XHR9ZWxzZSBpZiAoZWxlbWVudC5jaGFyQXQoMCkgPT0gXCIuXCIpe1xyXG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShlbGVtZW50LnJlcGxhY2UoXCIuXCIsIFwiXCIpKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoZWxlbWVudCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRcclxuXHRhZGRFdmVudDogZnVuY3Rpb24oZWxlbWVudCwgdHlwZSwgY2FsbGJhY2spe1xyXG5cdFx0aWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcil7XHJcblx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgZmFsc2UpO1xyXG5cdFx0fWVsc2UgaWYgKGVsZW1lbnQuYXR0YWNoRXZlbnQpe1xyXG5cdFx0XHRlbGVtZW50LmF0dGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGNhbGxiYWNrKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcbiIsImZ1bmN0aW9uIFZlY3RvcjIoeCwgeSl7XHJcblx0dGhpcy5fX2t0djIgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yMjtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkpO1xyXG5cdFxyXG5cdHJldHVybiBsZW5ndGg7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMueCAvPSBsZW5ndGg7XHJcblx0dGhpcy55IC89IGxlbmd0aDtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKHZlY3RvcjIpe1xyXG5cdGlmICghdmVjdG9yMi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgcGVyZm9ybSBhIGRvdCBwcm9kdWN0IHdpdGggYSB2ZWN0b3IyXCI7XHJcblx0XHJcblx0cmV0dXJuIHRoaXMueCAqIHZlY3RvcjIueCArIHRoaXMueSAqIHZlY3RvcjIueTtcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihudW1iZXIpe1xyXG5cdHRoaXMueCAqPSBudW1iZXI7XHJcblx0dGhpcy55ICo9IG51bWJlcjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHZlY3RvcjIpe1xyXG5cdGlmICghdmVjdG9yMi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgYWRkIGEgdmVjdG9yMiB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCArPSB2ZWN0b3IyLng7XHJcblx0dGhpcy55ICs9IHZlY3RvcjIueTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbih2ZWN0b3IyKXtcclxuXHRpZiAoIXZlY3RvcjIuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSB2ZWN0b3IyIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ID0gdmVjdG9yMi54O1xyXG5cdHRoaXMueSA9IHZlY3RvcjIueTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHkpe1xyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54LCB0aGlzLnkpO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24odmVjdG9yMil7XHJcblx0aWYgKCF2ZWN0b3IyLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgdmVjdG9yMiB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHJldHVybiAodGhpcy54ID09IHZlY3RvcjIueCAmJiB0aGlzLnkgPT0gdmVjdG9yMi55KTtcclxufTtcclxuXHJcblZlY3RvcjIudmVjdG9yc0RpZmZlcmVuY2UgPSBmdW5jdGlvbih2ZWN0b3IyX2EsIHZlY3RvcjJfYil7XHJcblx0aWYgKCF2ZWN0b3IyX2EuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMyXCI7XHJcblx0aWYgKCF2ZWN0b3IyX2IuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMyXCI7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IyKHZlY3RvcjJfYS54IC0gdmVjdG9yMl9iLngsIHZlY3RvcjJfYS55IC0gdmVjdG9yMl9iLnkpO1xyXG59O1xyXG5cclxuVmVjdG9yMi5mcm9tQW5nbGUgPSBmdW5jdGlvbihyYWRpYW4pe1xyXG5cdHZhciB4ID0gTWF0aC5jb3MocmFkaWFuKTtcclxuXHR2YXIgeSA9IC1NYXRoLnNpbihyYWRpYW4pO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMih4LCB5KTtcclxufTtcclxuIiwiZnVuY3Rpb24gVmVjdG9yMyh4LCB5LCB6KXtcclxuXHR0aGlzLl9fa3R2MyA9IHRydWU7XHJcblx0XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZlY3RvcjM7XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55ICsgdGhpcy56ICogdGhpcy56KTtcclxuXHRcclxuXHRyZXR1cm4gbGVuZ3RoO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGgoKTtcclxuXHRcclxuXHR0aGlzLnggLz0gbGVuZ3RoO1xyXG5cdHRoaXMueSAvPSBsZW5ndGg7XHJcblx0dGhpcy56IC89IGxlbmd0aDtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgcGVyZm9ybSBhIGRvdCBwcm9kdWN0IHdpdGggYSB2ZWN0b3IzXCI7XHJcblx0XHJcblx0cmV0dXJuIHRoaXMueCAqIHZlY3RvcjMueCArIHRoaXMueSAqIHZlY3RvcjMueSArIHRoaXMueiAqIHZlY3RvcjMuejtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBwZXJmb3JtIGEgY3Jvc3MgcHJvZHVjdCB3aXRoIGEgdmVjdG9yM1wiO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMyhcclxuXHRcdHRoaXMueSAqIHZlY3RvcjMueiAtIHRoaXMueiAqIHZlY3RvcjMueSxcclxuXHRcdHRoaXMueiAqIHZlY3RvcjMueCAtIHRoaXMueCAqIHZlY3RvcjMueixcclxuXHRcdHRoaXMueCAqIHZlY3RvcjMueSAtIHRoaXMueSAqIHZlY3RvcjMueFxyXG5cdCk7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiB0aGlzLm11bHRpcGx5KC0xKTtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24obnVtYmVyKXtcclxuXHR0aGlzLnggKj0gbnVtYmVyO1xyXG5cdHRoaXMueSAqPSBudW1iZXI7XHJcblx0dGhpcy56ICo9IG51bWJlcjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgYWRkIGEgVmVjdG9yMyB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCArPSB2ZWN0b3IzLng7XHJcblx0dGhpcy55ICs9IHZlY3RvcjMueTtcclxuXHR0aGlzLnogKz0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIFZlY3RvcjMgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHR0aGlzLnggPSB2ZWN0b3IzLng7XHJcblx0dGhpcy55ID0gdmVjdG9yMy55O1xyXG5cdHRoaXMueiA9IHZlY3RvcjMuejtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHksIHope1xyXG5cdHRoaXMueCA9IHg7XHJcblx0dGhpcy55ID0geTtcclxuXHR0aGlzLnogPSB6O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLngsIHRoaXMueSwgdGhpcy56KTtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIFZlY3RvcjMgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHRyZXR1cm4gKHRoaXMueCA9PSB2ZWN0b3IzLnggJiYgdGhpcy55ID09IHZlY3RvcjMueSAmJiB0aGlzLnogPT0gdmVjdG9yMy56KTtcclxufTtcclxuXHJcblZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UgPSBmdW5jdGlvbih2ZWN0b3IzX2EsIHZlY3RvcjNfYil7XHJcblx0aWYgKCF2ZWN0b3IzX2EuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMzXCI7XHJcblx0aWYgKCF2ZWN0b3IzX2IuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IGNyZWF0ZSB0aGlzIHZlY3RvciB1c2luZyAyIHZlY3RvcnMzXCI7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IzKHZlY3RvcjNfYS54IC0gdmVjdG9yM19iLngsIHZlY3RvcjNfYS55IC0gdmVjdG9yM19iLnksIHZlY3RvcjNfYS56IC0gdmVjdG9yM19iLnopO1xyXG59O1xyXG5cclxuVmVjdG9yMy5mcm9tQW5nbGUgPSBmdW5jdGlvbihyYWRpYW5feHosIHJhZGlhbl95KXtcclxuXHR2YXIgeCA9IE1hdGguY29zKHJhZGlhbl94eik7XHJcblx0dmFyIHkgPSBNYXRoLnNpbihyYWRpYW5feSk7XHJcblx0dmFyIHogPSAtTWF0aC5zaW4ocmFkaWFuX3h6KTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjMoeCwgeSwgeik7XHJcbn07XHJcbiIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbktULkNhbWVyYVBlcnNwZWN0aXZlID0gcmVxdWlyZSgnLi9LVENhbWVyYVBlcnNwZWN0aXZlJyk7XHJcbktULkNvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbktULkdlb21ldHJ5ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Jyk7XHJcbktULkdlb21ldHJ5Qm94ID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5Qm94Jyk7XHJcbktULkdlb21ldHJ5UGxhbmUgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnlQbGFuZScpO1xyXG5LVC5HZW9tZXRyeVNwaGVyZSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeVNwaGVyZScpO1xyXG5LVC5MaWdodERpcmVjdGlvbmFsID0gcmVxdWlyZSgnLi9LVExpZ2h0RGlyZWN0aW9uYWwnKTtcclxuS1QuTGlnaHRQb2ludCA9IHJlcXVpcmUoJy4vS1RMaWdodFBvaW50Jyk7XHJcbktULklucHV0ID0gcmVxdWlyZSgnLi9LVElucHV0Jyk7XHJcbktULk1hdGVyaWFsID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsJyk7XHJcbktULk1hdGVyaWFsQmFzaWMgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWxCYXNpYycpO1xyXG5LVC5NYXRlcmlhbExhbWJlcnQgPSByZXF1aXJlKCcuL0tUTWF0ZXJpYWxMYW1iZXJ0Jyk7XHJcbktULk1hdGggPSByZXF1aXJlKCcuL0tUTWF0aCcpO1xyXG5LVC5NYXRyaXgzID0gcmVxdWlyZSgnLi9LVE1hdHJpeDMnKTtcclxuS1QuTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcbktULk1lc2ggPSByZXF1aXJlKCcuL0tUTWVzaCcpO1xyXG5LVC5PcmJpdEFuZFBhbiA9IHJlcXVpcmUoJy4vS1RPcmJpdEFuZFBhbicpO1xyXG5LVC5UZXh0dXJlID0gcmVxdWlyZSgnLi9LVFRleHR1cmUnKTtcclxuS1QuVXRpbHMgPSByZXF1aXJlKCcuL0tUVXRpbHMnKTtcclxuS1QuVmVjdG9yMiA9IHJlcXVpcmUoJy4vS1RWZWN0b3IyJyk7XHJcbktULlZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG5LVC5TY2VuZSA9IHJlcXVpcmUoJy4vS1RTY2VuZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLVDsiLCJ3aW5kb3cuS1QgPSByZXF1aXJlKCcuL0tyYW1UZWNoJyk7Il19
