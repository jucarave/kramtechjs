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
},{"./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js":[function(require,module,exports){
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
		
		Input.mouse.wheel = 0;
		if (ev.wheelDelta > 0) Input.mouse.wheel = 1;
		else if (ev.wheelDelta < 0) Input.mouse.wheel = -1;
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
		Utils.addEvent(canvas, 'mouseup', Input.handleMouseUp);
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
		}else if (uni.name == 'uLightDirection' && scene.useLighting && scene.dirLight){
			gl.uniform3f(uni.location, scene.dirLight.direction.x, scene.dirLight.direction.y, scene.dirLight.direction.z);
		}else if (uni.name == 'uLightDirectionColor' && scene.useLighting && scene.dirLight){
			var color = scene.dirLight.color.getRGB();
			gl.uniform3f(uni.location, color[0], color[1], color[2]);
		}else if (uni.name == 'uLightDirectionIntensity' && scene.useLighting && scene.dirLight){
			gl.uniform1f(uni.location, scene.dirLight.intensity);
		}else if (uni.name == 'uAmbientLightColor' && scene.useLighting && scene.ambientLight){
			var color = scene.ambientLight.getRGB();
			gl.uniform3f(uni.location, color[0], color[1], color[2]);
		}else if (uni.name == 'uOpacity'){
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

},{"./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTScene.js":[function(require,module,exports){
var KT = require('./KTMain');
var Color = require('./KTColor');

function Scene(params){
	this.__ktscene = true;
	
	this.meshes = [];
	this.dirLight = null;
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
	
	//camera.getTransformationMatrix();
	
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
			
			{name: 'uAmbientLightColor'},
			
			{name: 'uLightDirection'},
			{name: 'uLightDirectionColor'},
			{name: 'uLightDirectionIntensity'},
			
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
			"uniform mediump mat3 uNormalMatrix; " +
			
			"uniform mediump vec3 uAmbientLightColor; " +
			
			"uniform mediump vec3 uLightDirection; " +
			"uniform mediump vec3 uLightDirectionColor; " +
			"uniform mediump float uLightDirectionIntensity; " +  
			
			
			"varying mediump vec4 vVertexColor; " +
			"varying mediump vec2 vTextureCoord;" +  
			"varying mediump vec3 vLightWeight; " + 
			
			"void main(void){ " + 
				"gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); " +
			
				"if (uUseLighting){ " + 
					"vec3 transformedNormal = uNormalMatrix * aVertexNormal; " +
					"float dirLightWeight = max(dot(transformedNormal, uLightDirection), 0.0); " +
					"vLightWeight = uAmbientLightColor + (uLightDirectionColor * dirLightWeight * uLightDirectionIntensity); " +
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
KT.Input = require('./KTInput');
KT.Material = require('./KTMaterial');
KT.MaterialBasic = require('./KTMaterialBasic');
KT.MaterialLambert = require('./KTMaterialLambert');
KT.Math = require('./KTMath');
KT.Matrix3 = require('./KTMatrix3');
KT.Matrix4 = require('./KTMatrix4');
KT.Mesh = require('./KTMesh');
KT.Texture = require('./KTTexture');
KT.Utils = require('./KTUtils');
KT.Vector2 = require('./KTVector2');
KT.Vector3 = require('./KTVector3');
KT.Scene = require('./KTScene');

module.exports = KT;
},{"./KTCameraPerspective":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTCameraPerspective.js","./KTColor":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTColor.js","./KTGeometry":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometry.js","./KTGeometryBox":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryBox.js","./KTGeometryPlane":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometryPlane.js","./KTGeometrySphere":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTGeometrySphere.js","./KTInput":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTInput.js","./KTLightDirectional":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTLightDirectional.js","./KTMain":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMain.js","./KTMaterial":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterial.js","./KTMaterialBasic":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialBasic.js","./KTMaterialLambert":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMaterialLambert.js","./KTMath":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMath.js","./KTMatrix3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix3.js","./KTMatrix4":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMatrix4.js","./KTMesh":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTMesh.js","./KTScene":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTScene.js","./KTTexture":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTTexture.js","./KTUtils":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTUtils.js","./KTVector2":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector2.js","./KTVector3":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js":[function(require,module,exports){
window.KT = require('./KramTech');
},{"./KramTech":"c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KramTech.js"}]},{},["c:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiLi5cXHNyY1xcS1RDYW1lcmFQZXJzcGVjdGl2ZS5qcyIsIi4uXFxzcmNcXEtUQ29sb3IuanMiLCIuLlxcc3JjXFxLVEdlb21ldHJ5LmpzIiwiLi5cXHNyY1xcS1RHZW9tZXRyeUJveC5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlQbGFuZS5qcyIsIi4uXFxzcmNcXEtUR2VvbWV0cnlTcGhlcmUuanMiLCIuLlxcc3JjXFxLVElucHV0LmpzIiwiLi5cXHNyY1xcS1RMaWdodERpcmVjdGlvbmFsLmpzIiwiLi5cXHNyY1xcS1RNYWluLmpzIiwiLi5cXHNyY1xcS1RNYXRlcmlhbC5qcyIsIi4uXFxzcmNcXEtUTWF0ZXJpYWxCYXNpYy5qcyIsIi4uXFxzcmNcXEtUTWF0ZXJpYWxMYW1iZXJ0LmpzIiwiLi5cXHNyY1xcS1RNYXRoLmpzIiwiLi5cXHNyY1xcS1RNYXRyaXgzLmpzIiwiLi5cXHNyY1xcS1RNYXRyaXg0LmpzIiwiLi5cXHNyY1xcS1RNZXNoLmpzIiwiLi5cXHNyY1xcS1RTY2VuZS5qcyIsIi4uXFxzcmNcXEtUU2hhZGVycy5qcyIsIi4uXFxzcmNcXEtUVGV4dHVyZS5qcyIsIi4uXFxzcmNcXEtUVXRpbHMuanMiLCIuLlxcc3JjXFxLVFZlY3RvcjIuanMiLCIuLlxcc3JjXFxLVFZlY3RvcjMuanMiLCIuLlxcc3JjXFxLcmFtVGVjaC5qcyIsIi4uXFxzcmNcXFdpbmRvd0V4cG9ydGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcbnZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgVmVjdG9yMyA9IHJlcXVpcmUoJy4vS1RWZWN0b3IzJyk7XHJcbnZhciBLVE1hdGggPSByZXF1aXJlKCcuL0tUTWF0aCcpO1xyXG5cclxuZnVuY3Rpb24gQ2FtZXJhUGVyc3BlY3RpdmUoZm92LCByYXRpbywgem5lYXIsIHpmYXIpe1xyXG5cdHRoaXMuX19rdGNhbWVyYSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IG5ldyBWZWN0b3IzKDAuMCwgMC4wLCAwLjApO1xyXG5cdHRoaXMudXBWZWN0b3IgPSBuZXcgVmVjdG9yMygwLjAsIDEuMCwgMC4wKTtcclxuXHR0aGlzLmxvb2tBdChuZXcgVmVjdG9yMygwLjAsIDAuMCwgLTEuMCkpO1xyXG5cdFxyXG5cdHRoaXMuZm92ID0gZm92O1xyXG5cdHRoaXMucmF0aW8gPSByYXRpbztcclxuXHR0aGlzLnpuZWFyID0gem5lYXI7XHJcblx0dGhpcy56ZmFyID0gemZhcjtcclxuXHRcclxuXHR0aGlzLmJhY2tncm91bmRDb2xvciA9IG5ldyBDb2xvcihDb2xvci5fQkxBQ0spO1xyXG5cdFxyXG5cdHRoaXMuc2V0UGVyc3BlY3RpdmUoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYW1lcmFQZXJzcGVjdGl2ZTtcclxuXHJcbkNhbWVyYVBlcnNwZWN0aXZlLnByb3RvdHlwZS5zZXRQZXJzcGVjdGl2ZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIEMgPSAxIC8gTWF0aC50YW4odGhpcy5mb3YgLyAyKTtcclxuXHR2YXIgUiA9IEMgKiB0aGlzLnJhdGlvO1xyXG5cdHZhciBBID0gKHRoaXMuem5lYXIgKyB0aGlzLnpmYXIpIC8gKHRoaXMuem5lYXIgLSB0aGlzLnpmYXIpO1xyXG5cdHZhciBCID0gKDIgKiB0aGlzLnpuZWFyICogdGhpcy56ZmFyKSAvICh0aGlzLnpuZWFyIC0gdGhpcy56ZmFyKTtcclxuXHRcclxuXHR0aGlzLnBlcnNwZWN0aXZlTWF0cml4ID0gbmV3IE1hdHJpeDQoXHJcblx0XHRDLCAwLCAwLCAgMCxcclxuXHRcdDAsIFIsIDAsICAwLFxyXG5cdFx0MCwgMCwgQSwgIEIsXHJcblx0XHQwLCAwLCAtMSwgMFxyXG5cdCk7XHJcbn07XHJcblxyXG5DYW1lcmFQZXJzcGVjdGl2ZS5wcm90b3R5cGUuc2V0QmFja2dyb3VuZENvbG9yID0gZnVuY3Rpb24oY29sb3Ipe1xyXG5cdHRoaXMuYmFja2dyb3VuZENvbG9yID0gbmV3IENvbG9yKGNvbG9yKTtcclxufTtcclxuXHJcbkNhbWVyYVBlcnNwZWN0aXZlLnByb3RvdHlwZS5sb29rQXQgPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IGxvb2sgdG8gYSB2ZWN0b3IzXCI7XHJcblx0XHJcblx0dmFyIGZvcndhcmQgPSBWZWN0b3IzLnZlY3RvcnNEaWZmZXJlbmNlKHRoaXMucG9zaXRpb24sIHZlY3RvcjMpLm5vcm1hbGl6ZSgpO1xyXG5cdHZhciBsZWZ0ID0gdGhpcy51cFZlY3Rvci5jcm9zcyhmb3J3YXJkKS5ub3JtYWxpemUoKTtcclxuXHR2YXIgdXAgPSBmb3J3YXJkLmNyb3NzKGxlZnQpLm5vcm1hbGl6ZSgpO1xyXG5cdFxyXG5cdHZhciB4ID0gLWxlZnQuZG90KHRoaXMucG9zaXRpb24pO1xyXG5cdHZhciB5ID0gLXVwLmRvdCh0aGlzLnBvc2l0aW9uKTtcclxuXHR2YXIgeiA9IC1mb3J3YXJkLmRvdCh0aGlzLnBvc2l0aW9uKTtcclxuXHRcclxuXHR0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbmV3IE1hdHJpeDQoXHJcblx0XHRsZWZ0LngsIGxlZnQueSwgbGVmdC56LCB4LFxyXG5cdFx0dXAueCwgdXAueSwgdXAueiwgeSxcclxuXHRcdGZvcndhcmQueCwgZm9yd2FyZC55LCBmb3J3YXJkLnosIHosXHJcblx0XHQwLCAwLCAwLCAxXHJcblx0KTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTsiLCJmdW5jdGlvbiBDb2xvcihoZXhDb2xvcil7XHJcblx0dmFyIHN0ciA9IGhleENvbG9yLnN1YnN0cmluZygxKTtcclxuXHR2YXIgciA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMCwgMiksIDE2KTtcclxuXHR2YXIgZyA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoMiwgNCksIDE2KTtcclxuXHR2YXIgYiA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoNCwgNiksIDE2KTtcclxuXHR2YXIgYSA9IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcoNiwgOCksIDE2KTtcclxuXHRcclxuXHR0aGlzLmNvbG9yID0gW3IgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUsIGEgLyAyNTVdO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbG9yO1xyXG5cclxuQ29sb3IucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGhleENvbG9yKXtcclxuXHR2YXIgc3RyID0gaGV4Q29sb3Iuc3Vic3RyaW5nKDEpO1xyXG5cdHZhciByID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygwLCAyKSwgMTYpO1xyXG5cdHZhciBnID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZygyLCA0KSwgMTYpO1xyXG5cdHZhciBiID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg0LCA2KSwgMTYpO1xyXG5cdHZhciBhID0gcGFyc2VJbnQoc3RyLnN1YnN0cmluZyg2LCA4KSwgMTYpO1xyXG5cdFxyXG5cdHRoaXMuY29sb3IgPSBbciAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSwgYSAvIDI1NV07XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuc2V0UkdCID0gZnVuY3Rpb24ocmVkLCBncmVlbiwgYmx1ZSl7XHJcblx0dGhpcy5zZXRSR0JBKHJlZCwgZ3JlZW4sIGJsdWUsIDI1NSk7XHJcbn07XHJcblxyXG5Db2xvci5wcm90b3R5cGUuc2V0UkdCQSA9IGZ1bmN0aW9uKHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhKXtcclxuXHR0aGlzLmNvbG9yID0gW3JlZCAvIDI1NSwgZ3JlZW4gLyAyNTUsIGJsdWUgLyAyNTUsIGFscGhhXTtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5nZXRSR0IgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBjID0gdGhpcy5nZXRSR0JBKCk7XHJcblx0XHJcblx0cmV0dXJuIFtjWzBdLCBjWzFdLCBjWzJdXTtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5nZXRSR0JBID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gdGhpcy5jb2xvcjtcclxufTtcclxuXHJcbkNvbG9yLnByb3RvdHlwZS5nZXRIZXggPSBmdW5jdGlvbigpe1xyXG5cdHZhciBjID0gdGhpcy5jb2xvcjtcclxuXHRcclxuXHR2YXIgciA9IChjWzBdICogMjU1KS50b1N0cmluZygxNik7XHJcblx0dmFyIGcgPSAoY1sxXSAqIDI1NSkudG9TdHJpbmcoMTYpO1xyXG5cdHZhciBiID0gKGNbMl0gKiAyNTUpLnRvU3RyaW5nKDE2KTtcclxuXHR2YXIgYSA9IChjWzNdICogMjU1KS50b1N0cmluZygxNik7XHJcblx0XHJcblx0aWYgKHIubGVuZ3RoID09IDEpIHIgPSBcIjBcIiArIHI7XHJcblx0aWYgKGcubGVuZ3RoID09IDEpIGcgPSBcIjBcIiArIGc7XHJcblx0aWYgKGIubGVuZ3RoID09IDEpIGIgPSBcIjBcIiArIGI7XHJcblx0aWYgKGEubGVuZ3RoID09IDEpIGEgPSBcIjBcIiArIGE7XHJcblx0XHJcblx0cmV0dXJuIChcIiNcIiArIHIgKyBnICsgYiArIGEpLnRvVXBwZXJDYXNlKCk7XHJcbn07XHJcblxyXG5Db2xvci5fQkxBQ0tcdFx0PSBcIiMwMDAwMDBGRlwiO1xyXG5Db2xvci5fUkVEIFx0XHRcdD0gXCIjRkYwMDAwRkZcIjtcclxuQ29sb3IuX0dSRUVOIFx0XHQ9IFwiIzAwRkYwMEZGXCI7XHJcbkNvbG9yLl9CTFVFIFx0XHQ9IFwiIzAwMDBGRkZGXCI7XHJcbkNvbG9yLl9XSElURVx0XHQ9IFwiI0ZGRkZGRkZGXCI7XHJcbkNvbG9yLl9ZRUxMT1dcdFx0PSBcIiNGRkZGMDBGRlwiO1xyXG5Db2xvci5fTUFHRU5UQVx0XHQ9IFwiI0ZGMDBGRkZGXCI7XHJcbkNvbG9yLl9BUVVBXHRcdFx0PSBcIiMwMEZGRkZGRlwiO1xyXG5Db2xvci5fR09MRFx0XHRcdD0gXCIjRkZENzAwRkZcIjtcclxuQ29sb3IuX0dSQVlcdFx0XHQ9IFwiIzgwODA4MEZGXCI7XHJcbkNvbG9yLl9QVVJQTEVcdFx0PSBcIiM4MDAwODBGRlwiOyIsInZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcbnZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgTWF0cml4NCA9IHJlcXVpcmUoJy4vS1RNYXRyaXg0Jyk7XHJcbnZhciBWZWN0b3IyID0gcmVxdWlyZSgnLi9LVFZlY3RvcjInKTtcclxudmFyIFZlY3RvcjMgPSByZXF1aXJlKCcuL0tUVmVjdG9yMycpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnkoKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy52ZXJ0aWNlcyA9IFtdO1xyXG5cdHRoaXMudHJpYW5nbGVzID0gW107XHJcblx0dGhpcy51dkNvb3JkcyA9IFtdO1xyXG5cdHRoaXMuY29sb3JzID0gW107XHJcblx0dGhpcy5ub3JtYWxzID0gW107XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VvbWV0cnk7XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuYWRkVmVydGljZSA9IGZ1bmN0aW9uKHgsIHksIHosIGNvbG9yLCB0eCwgdHkpe1xyXG5cdGlmICghY29sb3IpIGNvbG9yID0gQ29sb3IuX1dISVRFO1xyXG5cdGlmICghdHgpIHR4ID0gMDtcclxuXHRpZiAoIXR5KSB0eSA9IDA7XHJcblx0XHJcblx0dGhpcy52ZXJ0aWNlcy5wdXNoKG5ldyBWZWN0b3IzKHgsIHksIHopKTtcclxuXHR0aGlzLmNvbG9ycy5wdXNoKG5ldyBDb2xvcihjb2xvcikpO1xyXG5cdHRoaXMudXZDb29yZHMucHVzaChuZXcgVmVjdG9yMih0eCwgdHkpKTtcclxufTtcclxuXHJcbkdlb21ldHJ5LnByb3RvdHlwZS5hZGRGYWNlID0gZnVuY3Rpb24odmVydGljZV8wLCB2ZXJ0aWNlXzEsIHZlcnRpY2VfMil7XHJcblx0aWYgKCF0aGlzLnZlcnRpY2VzW3ZlcnRpY2VfMF0pIHRocm93IFwiSW52YWxpZCB2ZXJ0ZXggaW5kZXg6IFwiICsgdmVydGljZV8wO1xyXG5cdGlmICghdGhpcy52ZXJ0aWNlc1t2ZXJ0aWNlXzFdKSB0aHJvdyBcIkludmFsaWQgdmVydGV4IGluZGV4OiBcIiArIHZlcnRpY2VfMTtcclxuXHRpZiAoIXRoaXMudmVydGljZXNbdmVydGljZV8yXSkgdGhyb3cgXCJJbnZhbGlkIHZlcnRleCBpbmRleDogXCIgKyB2ZXJ0aWNlXzI7XHJcblx0XHJcblx0dGhpcy50cmlhbmdsZXMucHVzaChuZXcgVmVjdG9yMyh2ZXJ0aWNlXzAsIHZlcnRpY2VfMSwgdmVydGljZV8yKSk7XHJcbn07XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuYWRkTm9ybWFsID0gZnVuY3Rpb24obngsIG55LCBueil7XHJcblx0dGhpcy5ub3JtYWxzLnB1c2gobmV3IFZlY3RvcjMobngsIG55LCBueikpO1xyXG59O1xyXG5cclxuR2VvbWV0cnkucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgdmVydGljZXMgPSBbXTtcclxuXHR2YXIgdXZDb29yZHMgPSBbXTtcclxuXHR2YXIgdHJpYW5nbGVzID0gW107XHJcblx0dmFyIGNvbG9ycyA9IFtdO1xyXG5cdHZhciBub3JtYWxzID0gW107XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLnZlcnRpY2VzLmxlbmd0aDtpPGxlbjtpKyspeyBcclxuXHRcdHZhciB2ID0gdGhpcy52ZXJ0aWNlc1tpXTsgXHJcblx0XHR2ZXJ0aWNlcy5wdXNoKHYueCwgdi55LCB2LnopOyBcclxuXHR9XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLnV2Q29vcmRzLmxlbmd0aDtpPGxlbjtpKyspeyBcclxuXHRcdHZhciB2ID0gdGhpcy51dkNvb3Jkc1tpXTsgXHJcblx0XHR1dkNvb3Jkcy5wdXNoKHYueCwgdi55KTsgXHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy50cmlhbmdsZXMubGVuZ3RoO2k8bGVuO2krKyl7IFxyXG5cdFx0dmFyIHQgPSB0aGlzLnRyaWFuZ2xlc1tpXTsgXHJcblx0XHR0cmlhbmdsZXMucHVzaCh0LngsIHQueSwgdC56KTsgXHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy5jb2xvcnMubGVuZ3RoO2k8bGVuO2krKyl7IFxyXG5cdFx0dmFyIGMgPSB0aGlzLmNvbG9yc1tpXS5nZXRSR0JBKCk7IFxyXG5cdFx0XHJcblx0XHRjb2xvcnMucHVzaChjWzBdLCBjWzFdLCBjWzJdLCBjWzNdKTsgXHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy5ub3JtYWxzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIG4gPSB0aGlzLm5vcm1hbHNbaV07XHJcblx0XHRub3JtYWxzLnB1c2gobi54LCBuLnksIG4ueik7XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJBUlJBWV9CVUZGRVJcIiwgbmV3IEZsb2F0MzJBcnJheSh2ZXJ0aWNlcyksIDMpO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJBUlJBWV9CVUZGRVJcIiwgbmV3IEZsb2F0MzJBcnJheSh1dkNvb3JkcyksIDIpO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBLVC5jcmVhdGVBcnJheUJ1ZmZlcihcIkVMRU1FTlRfQVJSQVlfQlVGRkVSXCIsIG5ldyBVaW50MTZBcnJheSh0cmlhbmdsZXMpLCAxKTtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IEtULmNyZWF0ZUFycmF5QnVmZmVyKFwiQVJSQVlfQlVGRkVSXCIsIG5ldyBGbG9hdDMyQXJyYXkoY29sb3JzKSwgNCk7XHJcblx0dGhpcy5ub3JtYWxzQnVmZmVyID0gS1QuY3JlYXRlQXJyYXlCdWZmZXIoXCJBUlJBWV9CVUZGRVJcIiwgbmV3IEZsb2F0MzJBcnJheShub3JtYWxzKSwgMyk7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5HZW9tZXRyeS5wcm90b3R5cGUuY29tcHV0ZUZhY2VzTm9ybWFscyA9IGZ1bmN0aW9uKCl7XHJcblx0dGhpcy5ub3JtYWxzID0gW107XHJcblx0XHJcblx0dmFyIG5vcm1hbGl6ZWRWZXJ0aWNlcyA9IFtdO1xyXG5cdGZvciAodmFyIGk9MCxsZW49dGhpcy50cmlhbmdsZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgZmFjZSA9IHRoaXMudHJpYW5nbGVzW2ldO1xyXG5cdFx0dmFyIHYwID0gdGhpcy52ZXJ0aWNlc1tmYWNlLnhdO1xyXG5cdFx0dmFyIHYxID0gdGhpcy52ZXJ0aWNlc1tmYWNlLnldO1xyXG5cdFx0dmFyIHYyID0gdGhpcy52ZXJ0aWNlc1tmYWNlLnpdO1xyXG5cdFx0XHJcblx0XHR2YXIgZGlyMSA9IFZlY3RvcjMudmVjdG9yc0RpZmZlcmVuY2UodjEsIHYwKTtcclxuXHRcdHZhciBkaXIyID0gVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSh2MiwgdjApO1xyXG5cdFx0XHJcblx0XHR2YXIgbm9ybWFsID0gZGlyMS5jcm9zcyhkaXIyKS5ub3JtYWxpemUoKTtcclxuXHRcdFxyXG5cdFx0aWYgKG5vcm1hbGl6ZWRWZXJ0aWNlcy5pbmRleE9mKGZhY2UueCkgPT0gLTEpIHRoaXMubm9ybWFscy5wdXNoKG5vcm1hbCk7XHJcblx0XHRpZiAobm9ybWFsaXplZFZlcnRpY2VzLmluZGV4T2YoZmFjZS55KSA9PSAtMSkgdGhpcy5ub3JtYWxzLnB1c2gobm9ybWFsKTtcclxuXHRcdGlmIChub3JtYWxpemVkVmVydGljZXMuaW5kZXhPZihmYWNlLnopID09IC0xKSB0aGlzLm5vcm1hbHMucHVzaChub3JtYWwpO1xyXG5cdFx0XHJcblx0XHRub3JtYWxpemVkVmVydGljZXMucHVzaChmYWNlLngsIGZhY2UueSwgZmFjZS56KTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbiIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5Qm94KHdpZHRoLCBsZW5ndGgsIGhlaWdodCwgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0XHJcblx0dmFyIGJveEdlbyA9IG5ldyBHZW9tZXRyeSgpO1xyXG5cdFxyXG5cdHZhciB3ID0gd2lkdGggLyAyO1xyXG5cdHZhciBsID0gbGVuZ3RoIC8gMjtcclxuXHR2YXIgaCA9IGhlaWdodCAvIDI7XHJcblx0XHJcblx0aWYgKCFwYXJhbXMpIHBhcmFtcyA9IHt9O1xyXG5cdHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cdFxyXG5cdHZhciBociA9IChwYXJhbXMuaG9yaXpvbnRhbFJlcGVhdHMpPyBwYXJhbXMuaG9yaXpvbnRhbFJlcGVhdHMgOiAxLjA7XHJcblx0dmFyIHZyID0gKHBhcmFtcy52ZXJ0aWNhbFJlcGVhdHMpPyBwYXJhbXMudmVydGljYWxSZXBlYXRzIDogMS4wO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgIGwsIENvbG9yLl9XSElURSwgIGhyLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgIGwsIENvbG9yLl9XSElURSwgIGhyLCAgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgLWwsIENvbG9yLl9XSElURSwgIGhyLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgLWwsIENvbG9yLl9XSElURSwgIGhyLCAgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgLWwsIENvbG9yLl9XSElURSwgIGhyLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgLWwsIENvbG9yLl9XSElURSwgIGhyLCAgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgIGwsIENvbG9yLl9XSElURSwgIGhyLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgIGwsIENvbG9yLl9XSElURSwgIGhyLCAgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgIGwsIENvbG9yLl9XSElURSwgIGhyLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAgaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAgaCwgLWwsIENvbG9yLl9XSElURSwgIGhyLCAgdnIpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgIGwsIENvbG9yLl9XSElURSwgMC4wLCAgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKC13LCAtaCwgLWwsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgIGwsIENvbG9yLl9XSElURSwgIGhyLCAgdnIpO1xyXG5cdGJveEdlby5hZGRWZXJ0aWNlKCB3LCAtaCwgLWwsIENvbG9yLl9XSElURSwgIGhyLCAwLjApO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDAsIDEsIDIpO1xyXG5cdGJveEdlby5hZGRGYWNlKDAsIDMsIDEpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDQsIDUsIDYpO1xyXG5cdGJveEdlby5hZGRGYWNlKDUsIDcsIDYpO1xyXG5cdFxyXG5cdGJveEdlby5hZGRGYWNlKDgsIDksIDEwKTtcclxuXHRib3hHZW8uYWRkRmFjZSg4LCAxMSwgOSk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMTIsIDEzLCAxNCk7XHJcblx0Ym94R2VvLmFkZEZhY2UoMTMsIDE1LCAxNCk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMTYsIDE3LCAxOCk7XHJcblx0Ym94R2VvLmFkZEZhY2UoMTYsIDE5LCAxNyk7XHJcblx0XHJcblx0Ym94R2VvLmFkZEZhY2UoMjAsIDIxLCAyMik7XHJcblx0Ym94R2VvLmFkZEZhY2UoMjEsIDIzLCAyMik7XHJcblx0XHJcblx0Ym94R2VvLmNvbXB1dGVGYWNlc05vcm1hbHMoKTtcclxuXHRib3hHZW8uYnVpbGQoKTtcclxuXHRcclxuXHR0aGlzLnZlcnRleEJ1ZmZlciA9IGJveEdlby52ZXJ0ZXhCdWZmZXI7XHJcblx0dGhpcy50ZXhCdWZmZXIgPSBib3hHZW8udGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBib3hHZW8uZmFjZXNCdWZmZXI7XHJcblx0dGhpcy5jb2xvcnNCdWZmZXIgPSBib3hHZW8uY29sb3JzQnVmZmVyO1xyXG5cdHRoaXMubm9ybWFsc0J1ZmZlciA9IGJveEdlby5ub3JtYWxzQnVmZmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5Qm94OyIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG52YXIgR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxuXHJcbmZ1bmN0aW9uIEdlb21ldHJ5UGxhbmUod2lkdGgsIGhlaWdodCwgcGFyYW1zKXtcclxuXHR0aGlzLl9fa3RnZW9tZXRyeSA9IHRydWU7XHJcblx0XHJcblx0dmFyIHBsYW5lR2VvID0gbmV3IEdlb21ldHJ5KCk7XHJcblx0XHJcblx0dmFyIHcgPSB3aWR0aCAvIDI7XHJcblx0dmFyIGggPSBoZWlnaHQgLyAyO1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuXHRcclxuXHR2YXIgaHIgPSAocGFyYW1zLmhvcml6b250YWxSZXBlYXRzKT8gcGFyYW1zLmhvcml6b250YWxSZXBlYXRzIDogMS4wO1xyXG5cdHZhciB2ciA9IChwYXJhbXMudmVydGljYWxSZXBlYXRzKT8gcGFyYW1zLnZlcnRpY2FsUmVwZWF0cyA6IDEuMDtcclxuXHRcclxuXHRwbGFuZUdlby5hZGRWZXJ0aWNlKCB3LCAwLCAgaCwgQ29sb3IuX1dISVRFLCAgaHIsICB2cik7XHJcblx0cGxhbmVHZW8uYWRkVmVydGljZSgtdywgMCwgLWgsIENvbG9yLl9XSElURSwgMC4wLCAwLjApO1xyXG5cdHBsYW5lR2VvLmFkZFZlcnRpY2UoLXcsIDAsICBoLCBDb2xvci5fV0hJVEUsIDAuMCwgIHZyKTtcclxuXHRwbGFuZUdlby5hZGRWZXJ0aWNlKCB3LCAwLCAtaCwgQ29sb3IuX1dISVRFLCAgaHIsIDAuMCk7XHJcblx0XHJcblx0cGxhbmVHZW8uYWRkRmFjZSgwLCAxLCAyKTtcclxuXHRwbGFuZUdlby5hZGRGYWNlKDAsIDMsIDEpO1xyXG5cdFxyXG5cdHBsYW5lR2VvLmNvbXB1dGVGYWNlc05vcm1hbHMoKTtcclxuXHRwbGFuZUdlby5idWlsZCgpO1xyXG5cdFxyXG5cdHRoaXMudmVydGV4QnVmZmVyID0gcGxhbmVHZW8udmVydGV4QnVmZmVyO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gcGxhbmVHZW8udGV4QnVmZmVyO1xyXG5cdHRoaXMuZmFjZXNCdWZmZXIgPSBwbGFuZUdlby5mYWNlc0J1ZmZlcjtcclxuXHR0aGlzLmNvbG9yc0J1ZmZlciA9IHBsYW5lR2VvLmNvbG9yc0J1ZmZlcjtcclxuXHR0aGlzLm5vcm1hbHNCdWZmZXIgPSBwbGFuZUdlby5ub3JtYWxzQnVmZmVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdlb21ldHJ5UGxhbmU7IiwidmFyIENvbG9yID0gcmVxdWlyZSgnLi9LVENvbG9yJyk7XHJcbnZhciBHZW9tZXRyeSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeScpO1xyXG5cclxuZnVuY3Rpb24gR2VvbWV0cnlTcGhlcmUocmFkaXVzLCBsYXRCYW5kcywgbG9uQmFuZHMsIHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0Z2VvbWV0cnkgPSB0cnVlO1xyXG5cdFxyXG5cdHZhciBzcGhHZW8gPSBuZXcgR2VvbWV0cnkoKTtcclxuXHRcclxuXHRpZiAoIXBhcmFtcykgcGFyYW1zID0ge307XHJcblx0dGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0XHJcblx0dmFyIGhyID0gKHBhcmFtcy5ob3Jpem9udGFsUmVwZWF0cyk/IHBhcmFtcy5ob3Jpem9udGFsUmVwZWF0cyA6IDEuMDtcclxuXHR2YXIgdnIgPSAocGFyYW1zLnZlcnRpY2FsUmVwZWF0cyk/IHBhcmFtcy52ZXJ0aWNhbFJlcGVhdHMgOiAxLjA7XHJcblx0dmFyIGhzID0gKHBhcmFtcy5oYWxmU3BoZXJlKT8gMS4wIDogMi4wO1xyXG5cdFxyXG5cdGZvciAodmFyIGxhdE49MDtsYXROPD1sYXRCYW5kcztsYXROKyspe1xyXG5cdFx0dmFyIHRoZXRhID0gbGF0TiAqIE1hdGguUEkgLyBsYXRCYW5kcztcclxuXHRcdHZhciBjb3NUID0gTWF0aC5jb3ModGhldGEpO1xyXG5cdFx0dmFyIHNpblQgPSBNYXRoLnNpbih0aGV0YSk7XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGxvbk49MDtsb25OPD1sb25CYW5kcztsb25OKyspe1xyXG5cdFx0XHR2YXIgcGhpID0gbG9uTiAqIGhzICogTWF0aC5QSSAvIGxvbkJhbmRzO1xyXG5cdFx0XHR2YXIgY29zUCA9IE1hdGguY29zKHBoaSk7XHJcblx0XHRcdHZhciBzaW5QID0gTWF0aC5zaW4ocGhpKTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciB4ID0gY29zUCAqIHNpblQ7XHJcblx0XHRcdHZhciB5ID0gY29zVDtcclxuXHRcdFx0dmFyIHogPSBzaW5QICogc2luVDtcclxuXHRcdFx0XHJcblx0XHRcdHZhciB0eCA9IGxvbk4gLyBsb25CYW5kcztcclxuXHRcdFx0dmFyIHR5ID0gMSAtIGxhdE4gLyBsYXRCYW5kcztcclxuXHRcdFx0XHJcblx0XHRcdHNwaEdlby5hZGROb3JtYWwoeCwgeSwgeik7XHJcblx0XHRcdHNwaEdlby5hZGRWZXJ0aWNlKHggKiByYWRpdXMsIHkgKiByYWRpdXMsIHogKiByYWRpdXMsIENvbG9yLl9XSElURSwgdHggKiBociwgdHkgKiB2cik7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGZvciAodmFyIGxhdE49MDtsYXROPGxhdEJhbmRzO2xhdE4rKyl7XHJcblx0XHRmb3IgKHZhciBsb25OPTA7bG9uTjxsb25CYW5kcztsb25OKyspe1xyXG5cdFx0XHR2YXIgaTEgPSBsb25OICsgKGxhdE4gKiAobG9uQmFuZHMgKyAxKSk7XHJcblx0XHRcdHZhciBpMiA9IGkxICsgbG9uQmFuZHMgKyAxO1xyXG5cdFx0XHR2YXIgaTMgPSBpMSArIDE7XHJcblx0XHRcdHZhciBpNCA9IGkyICsgMTtcclxuXHRcdFx0XHJcblx0XHRcdHNwaEdlby5hZGRGYWNlKGk0LCBpMSwgaTMpO1xyXG5cdFx0XHRzcGhHZW8uYWRkRmFjZShpNCwgaTIsIGkxKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0c3BoR2VvLmJ1aWxkKCk7XHJcblx0XHJcblx0dGhpcy52ZXJ0ZXhCdWZmZXIgPSBzcGhHZW8udmVydGV4QnVmZmVyO1xyXG5cdHRoaXMudGV4QnVmZmVyID0gc3BoR2VvLnRleEJ1ZmZlcjtcclxuXHR0aGlzLmZhY2VzQnVmZmVyID0gc3BoR2VvLmZhY2VzQnVmZmVyO1xyXG5cdHRoaXMuY29sb3JzQnVmZmVyID0gc3BoR2VvLmNvbG9yc0J1ZmZlcjtcclxuXHR0aGlzLm5vcm1hbHNCdWZmZXIgPSBzcGhHZW8ubm9ybWFsc0J1ZmZlcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHZW9tZXRyeVNwaGVyZTsiLCJ2YXIgVXRpbHMgPSByZXF1aXJlKCcuL0tUVXRpbHMnKTtcclxudmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxudmFyIFZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG5cclxudmFyIElucHV0ID0ge1xyXG5cdF9rZXlzOiBbXSxcclxuXHRfbW91c2U6IHtcclxuXHRcdGxlZnQ6IDAsXHJcblx0XHRyaWdodDogMCxcclxuXHRcdG1pZGRsZTogMCxcclxuXHRcdHdoZWVsOiAwLFxyXG5cdFx0cG9zaXRpb246IG5ldyBWZWN0b3IyKDAuMCwgMC4wKVxyXG5cdH0sXHJcblx0XHJcblx0dktleToge1xyXG5cdFx0U0hJRlQ6IDE2LFxyXG5cdFx0VEFCOiA5LFxyXG5cdFx0Q1RSTDogMTcsXHJcblx0XHRBTFQ6IDE4LFxyXG5cdFx0U1BBQ0U6IDMyLFxyXG5cdFx0RU5URVI6IDEzLFxyXG5cdFx0QkFDS1NQQUNFOiA4LFxyXG5cdFx0RVNDOiAyNyxcclxuXHRcdElOU0VSVDogNDUsXHJcblx0XHRERUw6IDQ2LFxyXG5cdFx0RU5EOiAzNSxcclxuXHRcdFNUQVJUOiAzNixcclxuXHRcdFBBR0VVUDogMzMsXHJcblx0XHRQQUdFRE9XTjogMzRcclxuXHR9LFxyXG5cdFxyXG5cdHZNb3VzZToge1xyXG5cdFx0TEVGVDogJ2xlZnQnLFxyXG5cdFx0UklHSFQ6ICdyaWdodCcsXHJcblx0XHRNSURETEU6ICdtaWRkbGUnLFxyXG5cdFx0V0hFRUxVUDogMSxcclxuXHRcdFdIRUVMRE9XTjogLTEsXHJcblx0fSxcclxuXHRcclxuXHRpc0tleURvd246IGZ1bmN0aW9uKGtleUNvZGUpe1xyXG5cdFx0cmV0dXJuIChJbnB1dC5fa2V5c1trZXlDb2RlXSA9PSAxKTtcclxuXHR9LFxyXG5cdFxyXG5cdGlzS2V5UHJlc3NlZDogZnVuY3Rpb24oa2V5Q29kZSl7XHJcblx0XHRpZiAoSW5wdXQuX2tleXNba2V5Q29kZV0gPT0gMSl7XHJcblx0XHRcdElucHV0Ll9rZXlzW2tleUNvZGVdID0gMjtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGlzTW91c2VEb3duOiBmdW5jdGlvbihtb3VzZUJ1dHRvbil7XHJcblx0XHRyZXR1cm4gKElucHV0Ll9tb3VzZVttb3VzZUJ1dHRvbl0gPT0gMSk7XHJcblx0fSxcclxuXHRcclxuXHRpc01vdXNlUHJlc3NlZDogZnVuY3Rpb24obW91c2VCdXR0b24pe1xyXG5cdFx0aWYgKElucHV0Ll9tb3VzZVttb3VzZUJ1dHRvbl0gPT0gMSl7XHJcblx0XHRcdElucHV0Ll9tb3VzZVttb3VzZUJ1dHRvbl0gPSAyO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0aXNXaGVlbE1vdmVkOiBmdW5jdGlvbih3aGVlbERpcil7XHJcblx0XHRpZiAoSW5wdXQuX21vdXNlLndoZWVsID09IHdoZWVsRGlyKXtcclxuXHRcdFx0SW5wdXQuX21vdXNlLndoZWVsID0gMDtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZUtleURvd246IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHJcblx0XHRpZiAoSW5wdXQuX2tleXNbZXYua2V5Q29kZV0gPT0gMikgcmV0dXJuO1xyXG5cdFx0SW5wdXQuX2tleXNbZXYua2V5Q29kZV0gPSAxO1xyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlS2V5VXA6IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHJcblx0XHRJbnB1dC5fa2V5c1tldi5rZXlDb2RlXSA9IDA7XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVNb3VzZURvd246IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGlmICh3aW5kb3cuZXZlbnQpIGV2ID0gd2luZG93LmV2ZW50O1xyXG5cdFx0XHJcblx0XHRpZiAoZXYud2hpY2ggPT0gMSl7XHJcblx0XHRcdGlmIChJbnB1dC5fbW91c2UubGVmdCAhPSAyKVxyXG5cdFx0XHRcdElucHV0Ll9tb3VzZS5sZWZ0ID0gMTtcclxuXHRcdH1lbHNlIGlmIChldi53aGljaCA9PSAyKXtcclxuXHRcdFx0aWYgKElucHV0Ll9tb3VzZS5taWRkbGUgIT0gMilcclxuXHRcdFx0XHRJbnB1dC5fbW91c2UubWlkZGxlID0gMTtcclxuXHRcdH1lbHNlIGlmIChldi53aGljaCA9PSAzKXtcclxuXHRcdFx0aWYgKElucHV0Ll9tb3VzZS5yaWdodCAhPSAyKVxyXG5cdFx0XHRcdElucHV0Ll9tb3VzZS5yaWdodCA9IDE7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdElucHV0LmhhbmRsZU1vdXNlTW92ZShldik7XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0XHJcblx0aGFuZGxlTW91c2VVcDogZnVuY3Rpb24oZXYpe1xyXG5cdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcclxuXHRcdGlmIChldi53aGljaCA9PSAxKXtcclxuXHRcdFx0SW5wdXQuX21vdXNlLmxlZnQgPSAwO1xyXG5cdFx0fWVsc2UgaWYgKGV2LndoaWNoID09IDIpe1xyXG5cdFx0XHRJbnB1dC5fbW91c2UubWlkZGxlID0gMDtcclxuXHRcdH1lbHNlIGlmIChldi53aGljaCA9PSAzKXtcclxuXHRcdFx0SW5wdXQuX21vdXNlLnJpZ2h0ID0gMDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0SW5wdXQuaGFuZGxlTW91c2VNb3ZlKGV2KTtcclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRcclxuXHRoYW5kbGVNb3VzZVdoZWVsOiBmdW5jdGlvbihldil7XHJcblx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFxyXG5cdFx0SW5wdXQubW91c2Uud2hlZWwgPSAwO1xyXG5cdFx0aWYgKGV2LndoZWVsRGVsdGEgPiAwKSBJbnB1dC5tb3VzZS53aGVlbCA9IDE7XHJcblx0XHRlbHNlIGlmIChldi53aGVlbERlbHRhIDwgMCkgSW5wdXQubW91c2Uud2hlZWwgPSAtMTtcclxuXHR9LFxyXG5cdFxyXG5cdGhhbmRsZU1vdXNlTW92ZTogZnVuY3Rpb24oZXYpe1xyXG5cdFx0aWYgKHdpbmRvdy5ldmVudCkgZXYgPSB3aW5kb3cuZXZlbnQ7XHJcblx0XHRcclxuXHRcdHZhciBlbFggPSBldi5jbGllbnRYIC0gZXYudGFyZ2V0Lm9mZnNldExlZnQ7XHJcblx0XHR2YXIgZWxZID0gZXYuY2xpZW50WSAtIGV2LnRhcmdldC5vZmZzZXRUb3A7XHJcblx0XHRcclxuXHRcdElucHV0Ll9tb3VzZS5wb3NpdGlvbi5zZXQoZWxYLCBlbFkpO1xyXG5cdH0sXHJcblx0XHJcblx0aW5pdDogZnVuY3Rpb24oY2FudmFzKXtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGRvY3VtZW50LCAna2V5ZG93bicsIElucHV0LmhhbmRsZUtleURvd24pO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoZG9jdW1lbnQsICdrZXl1cCcsIElucHV0LmhhbmRsZUtleURvd24pO1xyXG5cdFx0VXRpbHMuYWRkRXZlbnQoY2FudmFzLCAnbW91c2Vkb3duJywgSW5wdXQuaGFuZGxlTW91c2VEb3duKTtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGNhbnZhcywgJ21vdXNldXAnLCBJbnB1dC5oYW5kbGVNb3VzZVVwKTtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGNhbnZhcywgJ21vdXNld2hlZWwnLCBJbnB1dC5oYW5kbGVNb3VzZVdoZWVsKTtcclxuXHRcdFV0aWxzLmFkZEV2ZW50KGNhbnZhcywgJ21vdXNlbW92ZScsIElucHV0LmhhbmRsZU1vdXNlTW92ZSk7XHJcblx0XHRVdGlscy5hZGRFdmVudChkb2N1bWVudCwgJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZXYpe1xyXG5cdFx0XHRpZiAod2luZG93LmV2ZW50KSBldiA9IHdpbmRvdy5ldmVudDtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChldi50YXJnZXQgPT09IGNhbnZhcyl7XHJcblx0XHRcdFx0ZXYuY2FuY2VsQnViYmxlID0gdHJ1ZTtcclxuXHRcdFx0XHRldi5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmIChldi5wcmV2ZW50RGVmYXVsdClcclxuXHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0aWYgKGV2LnN0b3BQcm9wYWdhdGlvbilcclxuXHRcdFx0XHRcdGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8PTk7aSsrKXtcclxuXHRcdFx0SW5wdXQudktleVsnTicgKyBpXSA9IDQ4ICsgaTtcclxuXHRcdFx0SW5wdXQudktleVsnTksnICsgaV0gPSA5NiArIGk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGk9NjU7aTw9OTA7aSsrKXtcclxuXHRcdFx0SW5wdXQudktleVtTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGk9MTtpPD0xMjtpKyspe1xyXG5cdFx0XHRJbnB1dC52S2V5WydGJyArIGldID0gMTExICsgaTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0OyIsInZhciBDb2xvciA9IHJlcXVpcmUoJy4vS1RDb2xvcicpO1xyXG5cclxuZnVuY3Rpb24gRGlyZWN0aW9uYWxMaWdodChkaXJlY3Rpb24sIGNvbG9yLCBpbnRlbnNpdHkpe1xyXG5cdHRoaXMuX19rdGRpckxpZ2h0ID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbi5ub3JtYWxpemUoKTtcclxuXHR0aGlzLmRpcmVjdGlvbi5tdWx0aXBseSgtMSk7XHJcblx0XHJcblx0dGhpcy5jb2xvciA9IG5ldyBDb2xvcigoY29sb3IpPyBjb2xvcjogQ29sb3IuX1dISVRFKTtcclxuXHR0aGlzLmludGVuc2l0eSA9IChpbnRlbnNpdHkgIT09IHVuZGVmaW5lZCk/IGludGVuc2l0eSA6IDEuMDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3Rpb25hbExpZ2h0O1xyXG5cclxuIiwidmFyIFNoYWRlcnMgPSByZXF1aXJlKCcuL0tUU2hhZGVycycpO1xyXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL0tUSW5wdXQnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGluaXQ6IGZ1bmN0aW9uKGNhbnZhcyl7XHJcblx0XHR0aGlzLmNhbnZhcyA9IGNhbnZhcztcclxuXHRcdHRoaXMuZ2wgPSBudWxsO1xyXG5cdFx0dGhpcy5zaGFkZXJzID0ge307XHJcblx0XHR0aGlzLm1heEF0dHJpYkxvY2F0aW9ucyA9IDA7XHJcblx0XHR0aGlzLmxhc3RQcm9ncmFtID0gbnVsbDtcclxuXHRcdFxyXG5cdFx0dGhpcy5fX2luaXRDb250ZXh0KGNhbnZhcyk7XHJcblx0XHR0aGlzLl9faW5pdFByb3BlcnRpZXMoKTtcclxuXHRcdHRoaXMuX19pbml0U2hhZGVycygpO1xyXG5cdFx0XHJcblx0XHRJbnB1dC5pbml0KGNhbnZhcyk7XHJcblx0fSxcclxuXHRcclxuXHRfX2luaXRDb250ZXh0OiBmdW5jdGlvbihjYW52YXMpe1xyXG5cdFx0dGhpcy5nbCA9IGNhbnZhcy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnKTtcclxuXHRcdFxyXG5cdFx0aWYgKCF0aGlzLmdsKXtcclxuXHRcdFx0YWxlcnQoXCJZb3VyIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IFdlYkdMXCIpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuZ2wud2lkdGggPSBjYW52YXMud2lkdGg7XHJcblx0XHR0aGlzLmdsLmhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XHJcblx0fSxcclxuXHRcclxuXHRfX2luaXRQcm9wZXJ0aWVzOiBmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGdsID0gdGhpcy5nbDtcclxuXHRcdFxyXG5cdFx0Z2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xyXG5cdFx0Z2wuZGVwdGhGdW5jKGdsLkxFUVVBTCk7XHJcblx0XHRcclxuXHRcdGdsLmVuYWJsZShnbC5DVUxMX0ZBQ0UpO1xyXG5cdFx0XHJcblx0XHRnbC5kaXNhYmxlKCBnbC5CTEVORCApO1xyXG5cdFx0Z2wuYmxlbmRFcXVhdGlvbiggZ2wuRlVOQ19BREQgKTtcclxuXHRcdGdsLmJsZW5kRnVuYyggZ2wuU1JDX0FMUEhBLCBnbC5PTkUgKTtcclxuXHR9LFxyXG5cdFxyXG5cdF9faW5pdFNoYWRlcnM6IGZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLnNoYWRlcnMgPSB7fTtcclxuXHRcdHRoaXMuc2hhZGVycy5iYXNpYyA9IHRoaXMucHJvY2Vzc1NoYWRlcihTaGFkZXJzLmJhc2ljKTtcclxuXHRcdHRoaXMuc2hhZGVycy5sYW1iZXJ0ID0gdGhpcy5wcm9jZXNzU2hhZGVyKFNoYWRlcnMubGFtYmVydCk7XHJcblx0fSxcclxuXHRcclxuXHRjcmVhdGVBcnJheUJ1ZmZlcjogZnVuY3Rpb24odHlwZSwgZGF0YUFycmF5LCBpdGVtU2l6ZSl7XHJcblx0XHR2YXIgZ2wgPSB0aGlzLmdsO1xyXG5cdFx0dmFyIGJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG5cdFx0Z2wuYmluZEJ1ZmZlcihnbFt0eXBlXSwgYnVmZmVyKTtcclxuXHRcdGdsLmJ1ZmZlckRhdGEoZ2xbdHlwZV0sIGRhdGFBcnJheSwgZ2wuU1RBVElDX0RSQVcpO1xyXG5cdFx0YnVmZmVyLm51bUl0ZW1zID0gZGF0YUFycmF5Lmxlbmd0aDtcclxuXHRcdGJ1ZmZlci5pdGVtU2l6ZSA9IGl0ZW1TaXplO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gYnVmZmVyO1xyXG5cdH0sXHJcblx0XHJcblx0cHJvY2Vzc1NoYWRlcjogZnVuY3Rpb24oc2hhZGVyKXtcclxuXHRcdHZhciBnbCA9IHRoaXMuZ2w7XHJcblx0XHRcclxuXHRcdHZhciB2Q29kZSA9IHNoYWRlci52ZXJ0ZXhTaGFkZXI7XHJcblx0XHR2YXIgdlNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5WRVJURVhfU0hBREVSKTtcclxuXHRcdGdsLnNoYWRlclNvdXJjZSh2U2hhZGVyLCB2Q29kZSk7XHJcblx0XHRnbC5jb21waWxlU2hhZGVyKHZTaGFkZXIpO1xyXG5cdFx0XHJcblx0XHR2YXIgZkNvZGUgPSBzaGFkZXIuZnJhZ21lbnRTaGFkZXI7XHJcblx0XHR2YXIgZlNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5GUkFHTUVOVF9TSEFERVIpO1xyXG5cdFx0Z2wuc2hhZGVyU291cmNlKGZTaGFkZXIsIGZDb2RlKTtcclxuXHRcdGdsLmNvbXBpbGVTaGFkZXIoZlNoYWRlcik7XHJcblx0XHRcclxuXHRcdHZhciBzaGFkZXJQcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG5cdFx0Z2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIHZTaGFkZXIpO1xyXG5cdFx0Z2wuYXR0YWNoU2hhZGVyKHNoYWRlclByb2dyYW0sIGZTaGFkZXIpO1xyXG5cdFx0Z2wubGlua1Byb2dyYW0oc2hhZGVyUHJvZ3JhbSk7XHJcblx0XHRcclxuXHRcdGlmICghZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihzaGFkZXJQcm9ncmFtLCBnbC5MSU5LX1NUQVRVUykpe1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3IgaW5pdGlhbGl6aW5nIHRoZSBzaGFkZXIgcHJvZ3JhbVwiKTtcclxuXHRcdFx0dGhyb3cgZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXJQcm9ncmFtKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIGF0dHJpYnV0ZXMgPSBbXTtcclxuXHRcdHRoaXMubWF4QXR0cmliTG9jYXRpb25zID0gTWF0aC5tYXgodGhpcy5tYXhBdHRyaWJMb2NhdGlvbnMsIHNoYWRlci5hdHRyaWJ1dGVzLmxlbmd0aCk7XHJcblx0XHRmb3IgKHZhciBpPTAsbGVuPXNoYWRlci5hdHRyaWJ1dGVzLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0XHR2YXIgYXR0ID0gc2hhZGVyLmF0dHJpYnV0ZXNbaV07XHJcblx0XHRcdHZhciBsb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHNoYWRlclByb2dyYW0sIGF0dC5uYW1lKTtcclxuXHRcdFx0XHJcblx0XHRcdGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGxvY2F0aW9uKTtcclxuXHRcdFx0XHJcblx0XHRcdGF0dHJpYnV0ZXMucHVzaCh7XHJcblx0XHRcdFx0bmFtZTogYXR0Lm5hbWUsXHJcblx0XHRcdFx0dHlwZTogYXR0LnR5cGUsXHJcblx0XHRcdFx0bG9jYXRpb246IGxvY2F0aW9uXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgdW5pZm9ybXMgPSBbXTtcclxuXHRcdGZvciAodmFyIGk9MCxsZW49c2hhZGVyLnVuaWZvcm1zLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0XHR2YXIgdW5pID0gc2hhZGVyLnVuaWZvcm1zW2ldO1xyXG5cdFx0XHR2YXIgbG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgdW5pLm5hbWUpO1xyXG5cdFx0XHRcclxuXHRcdFx0dW5pZm9ybXMucHVzaCh7XHJcblx0XHRcdFx0bmFtZTogdW5pLm5hbWUsXHJcblx0XHRcdFx0dHlwZTogdW5pLnR5cGUsXHJcblx0XHRcdFx0bG9jYXRpb246IGxvY2F0aW9uXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRzaGFkZXJQcm9ncmFtOiBzaGFkZXJQcm9ncmFtLFxyXG5cdFx0XHRhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxyXG5cdFx0XHR1bmlmb3JtczogdW5pZm9ybXNcclxuXHRcdH07XHJcblx0fSxcclxuXHRcclxuXHRzd2l0Y2hQcm9ncmFtOiBmdW5jdGlvbihzaGFkZXIpe1xyXG5cdFx0aWYgKHRoaXMubGFzdFByb2dyYW0gPT09IHNoYWRlcikgcmV0dXJuO1xyXG5cdFx0dmFyIGdsID0gdGhpcy5nbDtcclxuXHRcdFxyXG5cdFx0dGhpcy5sYXN0UHJvZ3JhbSA9IHNoYWRlcjtcclxuXHRcdGdsLnVzZVByb2dyYW0oc2hhZGVyLnNoYWRlclByb2dyYW0pO1xyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLm1heEF0dHJpYkxvY2F0aW9ucztpKyspe1xyXG5cdFx0XHRpZiAoaSA8IHNoYWRlci5hdHRyaWJ1dGVzLmxlbmd0aCl7XHJcblx0XHRcdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoaSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheShpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcblxyXG4iLCJ2YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxudmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxuXHJcbmZ1bmN0aW9uIE1hdGVyaWFsKHBhcmFtZXRlcnMpe1xyXG5cdHRoaXMuX19rdG1hdGVyaWFsID0gdHJ1ZTtcclxuXHRcclxuXHRpZiAoIXBhcmFtZXRlcnMpIHBhcmFtZXRlcnMgPSB7fTtcclxuXHRcclxuXHR0aGlzLnRleHR1cmUgPSAocGFyYW1ldGVycy50ZXh0dXJlKT8gcGFyYW1ldGVycy50ZXh0dXJlIDogbnVsbDtcclxuXHR0aGlzLmNvbG9yID0gbmV3IENvbG9yKChwYXJhbWV0ZXJzLmNvbG9yKT8gcGFyYW1ldGVycy5jb2xvciA6IENvbG9yLl9XSElURSk7XHJcblx0dGhpcy5vcGFjaXR5ID0gKHBhcmFtZXRlcnMub3BhY2l0eSk/IHBhcmFtZXRlcnMub3BhY2l0eSA6IDEuMDtcclxuXHR0aGlzLmRyYXdGYWNlcyA9IChwYXJhbWV0ZXJzLmRyYXdGYWNlcyk/IHBhcmFtZXRlcnMuZHJhd0ZhY2VzIDogJ0ZST05UJztcclxuXHR0aGlzLmRyYXdBcyA9IChwYXJhbWV0ZXJzLmRyYXdBcyk/IHBhcmFtZXRlcnMuZHJhd0FzIDogJ1RSSUFOR0xFUyc7XHJcblx0dGhpcy5zaGFkZXIgPSAocGFyYW1ldGVycy5zaGFkZXIpPyBwYXJhbWV0ZXJzLnNoYWRlciA6IG51bGw7XHJcblx0dGhpcy5zZW5kQXR0cmliRGF0YSA9IChwYXJhbWV0ZXJzLnNlbmRBdHRyaWJEYXRhKT8gcGFyYW1ldGVycy5zZW5kQXR0cmliRGF0YSA6IG51bGw7XHJcblx0dGhpcy5zZW5kVW5pZm9ybURhdGEgPSAocGFyYW1ldGVycy5zZW5kVW5pZm9ybURhdGEpPyBwYXJhbWV0ZXJzLnNlbmRVbmlmb3JtRGF0YSA6IG51bGw7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0ZXJpYWw7IiwidmFyIE1hdGVyaWFsID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsJyk7XHJcbnZhciBLVCA9IHJlcXVpcmUoJy4vS1RNYWluJyk7XHJcblxyXG5mdW5jdGlvbiBNYXRlcmlhbEJhc2ljKHRleHR1cmUsIGNvbG9yKXtcclxuXHR0aGlzLl9fa3RtYXRlcmlhbCA9IHRydWU7XHJcblx0XHJcblx0dmFyIG1hdGVyaWFsID0gbmV3IE1hdGVyaWFsKHtcclxuXHRcdHRleHR1cmU6IHRleHR1cmUsXHJcblx0XHRjb2xvcjogY29sb3IsXHJcblx0XHRzaGFkZXI6IEtULnNoYWRlcnMuYmFzaWNcclxuXHR9KTtcclxuXHRcclxuXHR0aGlzLnRleHR1cmUgPSBtYXRlcmlhbC50ZXh0dXJlO1xyXG5cdHRoaXMuY29sb3IgPSBtYXRlcmlhbC5jb2xvcjtcclxuXHR0aGlzLnNoYWRlciA9IG1hdGVyaWFsLnNoYWRlcjtcclxuXHR0aGlzLm9wYWNpdHkgPSBtYXRlcmlhbC5vcGFjaXR5O1xyXG5cdHRoaXMuZHJhd0ZhY2VzID0gbWF0ZXJpYWwuZHJhd0ZhY2VzO1xyXG5cdHRoaXMuZHJhd0FzID0gbWF0ZXJpYWwuZHJhd0FzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGVyaWFsQmFzaWM7XHJcblxyXG5NYXRlcmlhbEJhc2ljLnByb3RvdHlwZS5zZW5kQXR0cmliRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnNoYWRlci5hdHRyaWJ1dGVzO1xyXG5cdGZvciAodmFyIGk9MCxsZW49YXR0cmlidXRlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBhdHQgPSBhdHRyaWJ1dGVzW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAoYXR0Lm5hbWUgPT0gXCJhVmVydGV4UG9zaXRpb25cIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS52ZXJ0ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fWVsc2UgaWYgKGF0dC5uYW1lID09IFwiYVZlcnRleENvbG9yXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkuY29sb3JzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LmNvbG9yc0J1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFUZXh0dXJlQ29vcmRcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS50ZXhCdWZmZXIpO1xyXG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dC5sb2NhdGlvbiwgZ2VvbWV0cnkudGV4QnVmZmVyLml0ZW1TaXplLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdGVyaWFsQmFzaWMucHJvdG90eXBlLnNlbmRVbmlmb3JtRGF0YSA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSwgc2NlbmUpe1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdHZhciBnZW9tZXRyeSA9IG1lc2guZ2VvbWV0cnk7XHJcblx0dmFyIHRyYW5zZm9ybWF0aW9uTWF0cml4O1xyXG5cdHZhciB1bmlmb3JtcyA9IHRoaXMuc2hhZGVyLnVuaWZvcm1zO1xyXG5cdGZvciAodmFyIGk9MCxsZW49dW5pZm9ybXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgdW5pID0gdW5pZm9ybXNbaV07XHJcblx0XHRcclxuXHRcdGlmICh1bmkubmFtZSA9PSAndU1WUE1hdHJpeCcpe1xyXG5cdFx0XHR0cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG1lc2guZ2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKS5tdWx0aXBseShjYW1lcmEudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG5cdFx0XHR2YXIgbXZwID0gdHJhbnNmb3JtYXRpb25NYXRyaXguY2xvbmUoKS5tdWx0aXBseShjYW1lcmEucGVyc3BlY3RpdmVNYXRyaXgpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIG12cC50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1hdGVyaWFsQ29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gbWVzaC5tYXRlcmlhbC5jb2xvci5nZXRSR0JBKCk7XHJcblx0XHRcdGdsLnVuaWZvcm00ZnYodW5pLmxvY2F0aW9uLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9yKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlU2FtcGxlcicpe1xyXG5cdFx0XHRpZiAobWVzaC5tYXRlcmlhbC50ZXh0dXJlKXtcclxuXHRcdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwKTtcclxuXHRcdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBtZXNoLm1hdGVyaWFsLnRleHR1cmUudGV4dHVyZSk7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUhhc1RleHR1cmUnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKG1lc2gubWF0ZXJpYWwudGV4dHVyZSk/IDEgOiAwKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcbiIsInZhciBNYXRlcmlhbCA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbCcpO1xyXG5cclxuZnVuY3Rpb24gTWF0ZXJpYWxMYW1iZXJ0KHRleHR1cmUsIGNvbG9yLCBvcGFjaXR5KXtcclxuXHR0aGlzLl9fa3RtYXRlcmlhbCA9IHRydWU7XHJcblx0XHJcblx0dmFyIG1hdGVyaWFsID0gbmV3IE1hdGVyaWFsKHtcclxuXHRcdHRleHR1cmU6IHRleHR1cmUsXHJcblx0XHRjb2xvcjogY29sb3IsXHJcblx0XHRvcGFjaXR5OiBvcGFjaXR5LFxyXG5cdFx0c2hhZGVyOiBLVC5zaGFkZXJzLmxhbWJlcnRcclxuXHR9KTtcclxuXHRcclxuXHR0aGlzLnRleHR1cmUgPSBtYXRlcmlhbC50ZXh0dXJlO1xyXG5cdHRoaXMuY29sb3IgPSBtYXRlcmlhbC5jb2xvcjtcclxuXHR0aGlzLnNoYWRlciA9IG1hdGVyaWFsLnNoYWRlcjtcclxuXHR0aGlzLm9wYWNpdHkgPSBtYXRlcmlhbC5vcGFjaXR5O1xyXG5cdHRoaXMuZHJhd0ZhY2VzID0gbWF0ZXJpYWwuZHJhd0ZhY2VzO1xyXG5cdHRoaXMuZHJhd0FzID0gbWF0ZXJpYWwuZHJhd0FzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGVyaWFsTGFtYmVydDtcclxuXHJcbk1hdGVyaWFsTGFtYmVydC5wcm90b3R5cGUuc2VuZEF0dHJpYkRhdGEgPSBmdW5jdGlvbihtZXNoLCBjYW1lcmEsIHNjZW5lKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHR2YXIgZ2VvbWV0cnkgPSBtZXNoLmdlb21ldHJ5O1xyXG5cdHZhciBhdHRyaWJ1dGVzID0gdGhpcy5zaGFkZXIuYXR0cmlidXRlcztcclxuXHRmb3IgKHZhciBpPTAsbGVuPWF0dHJpYnV0ZXMubGVuZ3RoO2k8bGVuO2krKyl7XHJcblx0XHR2YXIgYXR0ID0gYXR0cmlidXRlc1tpXTtcclxuXHRcdFxyXG5cdFx0aWYgKGF0dC5uYW1lID09IFwiYVZlcnRleFBvc2l0aW9uXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkudmVydGV4QnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LnZlcnRleEJ1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhDb2xvclwiKXtcclxuXHRcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdlb21ldHJ5LmNvbG9yc0J1ZmZlcik7XHJcblx0XHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoYXR0LmxvY2F0aW9uLCBnZW9tZXRyeS5jb2xvcnNCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9ZWxzZSBpZiAoYXR0Lm5hbWUgPT0gXCJhVGV4dHVyZUNvb3JkXCIpe1xyXG5cdFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2VvbWV0cnkudGV4QnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5LnRleEJ1ZmZlci5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHRcdH1lbHNlIGlmIChhdHQubmFtZSA9PSBcImFWZXJ0ZXhOb3JtYWxcIil7XHJcblx0XHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnZW9tZXRyeS5ub3JtYWxzQnVmZmVyKTtcclxuXHRcdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHQubG9jYXRpb24sIGdlb21ldHJ5Lm5vcm1hbHNCdWZmZXIuaXRlbVNpemUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0ZXJpYWxMYW1iZXJ0LnByb3RvdHlwZS5zZW5kVW5pZm9ybURhdGEgPSBmdW5jdGlvbihtZXNoLCBjYW1lcmEsIHNjZW5lKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHR2YXIgZ2VvbWV0cnkgPSBtZXNoLmdlb21ldHJ5O1xyXG5cdHZhciB0cmFuc2Zvcm1hdGlvbk1hdHJpeDtcclxuXHR2YXIgdW5pZm9ybXMgPSB0aGlzLnNoYWRlci51bmlmb3JtcztcclxuXHR2YXIgbW9kZWxUcmFuc2Zvcm1hdGlvbjtcclxuXHRmb3IgKHZhciBpPTAsbGVuPXVuaWZvcm1zLmxlbmd0aDtpPGxlbjtpKyspe1xyXG5cdFx0dmFyIHVuaSA9IHVuaWZvcm1zW2ldO1xyXG5cdFx0XHJcblx0XHRpZiAodW5pLm5hbWUgPT0gJ3VNVk1hdHJpeCcpe1xyXG5cdFx0XHRtb2RlbFRyYW5zZm9ybWF0aW9uID0gbWVzaC5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xyXG5cdFx0XHR0cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG1vZGVsVHJhbnNmb3JtYXRpb24uY2xvbmUoKS5tdWx0aXBseShjYW1lcmEudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIHRyYW5zZm9ybWF0aW9uTWF0cml4LnRvRmxvYXQzMkFycmF5KCkpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1UE1hdHJpeCcpe1xyXG5cdFx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KHVuaS5sb2NhdGlvbiwgZmFsc2UsIGNhbWVyYS5wZXJzcGVjdGl2ZU1hdHJpeC50b0Zsb2F0MzJBcnJheSgpKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU1hdGVyaWFsQ29sb3InKXtcclxuXHRcdFx0dmFyIGNvbG9yID0gbWVzaC5tYXRlcmlhbC5jb2xvci5nZXRSR0JBKCk7XHJcblx0XHRcdGdsLnVuaWZvcm00ZnYodW5pLmxvY2F0aW9uLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9yKSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VUZXh0dXJlU2FtcGxlcicpe1xyXG5cdFx0XHRpZiAobWVzaC5tYXRlcmlhbC50ZXh0dXJlKXtcclxuXHRcdFx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwKTtcclxuXHRcdFx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBtZXNoLm1hdGVyaWFsLnRleHR1cmUudGV4dHVyZSk7XHJcblx0XHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgMCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUhhc1RleHR1cmUnKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFpKHVuaS5sb2NhdGlvbiwgKG1lc2gubWF0ZXJpYWwudGV4dHVyZSk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndVVzZUxpZ2h0aW5nJyl7XHJcblx0XHRcdGdsLnVuaWZvcm0xaSh1bmkubG9jYXRpb24sIChzY2VuZS51c2VMaWdodGluZyk/IDEgOiAwKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU5vcm1hbE1hdHJpeCcpe1xyXG5cdFx0XHR2YXIgbm9ybWFsTWF0cml4ID0gbW9kZWxUcmFuc2Zvcm1hdGlvbi50b01hdHJpeDMoKS5pbnZlcnNlKCkudG9GbG9hdDMyQXJyYXkoKTtcclxuXHRcdFx0Z2wudW5pZm9ybU1hdHJpeDNmdih1bmkubG9jYXRpb24sIGZhbHNlLCBub3JtYWxNYXRyaXgpO1xyXG5cdFx0fWVsc2UgaWYgKHVuaS5uYW1lID09ICd1TGlnaHREaXJlY3Rpb24nICYmIHNjZW5lLnVzZUxpZ2h0aW5nICYmIHNjZW5lLmRpckxpZ2h0KXtcclxuXHRcdFx0Z2wudW5pZm9ybTNmKHVuaS5sb2NhdGlvbiwgc2NlbmUuZGlyTGlnaHQuZGlyZWN0aW9uLngsIHNjZW5lLmRpckxpZ2h0LmRpcmVjdGlvbi55LCBzY2VuZS5kaXJMaWdodC5kaXJlY3Rpb24ueik7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VMaWdodERpcmVjdGlvbkNvbG9yJyAmJiBzY2VuZS51c2VMaWdodGluZyAmJiBzY2VuZS5kaXJMaWdodCl7XHJcblx0XHRcdHZhciBjb2xvciA9IHNjZW5lLmRpckxpZ2h0LmNvbG9yLmdldFJHQigpO1xyXG5cdFx0XHRnbC51bmlmb3JtM2YodW5pLmxvY2F0aW9uLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndUxpZ2h0RGlyZWN0aW9uSW50ZW5zaXR5JyAmJiBzY2VuZS51c2VMaWdodGluZyAmJiBzY2VuZS5kaXJMaWdodCl7XHJcblx0XHRcdGdsLnVuaWZvcm0xZih1bmkubG9jYXRpb24sIHNjZW5lLmRpckxpZ2h0LmludGVuc2l0eSk7XHJcblx0XHR9ZWxzZSBpZiAodW5pLm5hbWUgPT0gJ3VBbWJpZW50TGlnaHRDb2xvcicgJiYgc2NlbmUudXNlTGlnaHRpbmcgJiYgc2NlbmUuYW1iaWVudExpZ2h0KXtcclxuXHRcdFx0dmFyIGNvbG9yID0gc2NlbmUuYW1iaWVudExpZ2h0LmdldFJHQigpO1xyXG5cdFx0XHRnbC51bmlmb3JtM2YodW5pLmxvY2F0aW9uLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdKTtcclxuXHRcdH1lbHNlIGlmICh1bmkubmFtZSA9PSAndU9wYWNpdHknKXtcclxuXHRcdFx0Z2wudW5pZm9ybTFmKHVuaS5sb2NhdGlvbiwgbWVzaC5tYXRlcmlhbC5vcGFjaXR5KTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0cmFkRGVnUmVsOiBNYXRoLlBJIC8gMTgwLFxyXG5cdFxyXG5cdFBJXzI6IE1hdGguUEkgLyAyLFxyXG5cdFBJOiBNYXRoLlBJLFxyXG5cdFBJM18yOiBNYXRoLlBJICogMyAvIDIsXHJcblx0UEkyOiBNYXRoLlBJICogMixcclxuXHRcclxuXHRkZWdUb1JhZDogZnVuY3Rpb24oZGVncmVlcyl7XHJcblx0XHRyZXR1cm4gZGVncmVlcyAqIHRoaXMucmFkRGVnUmVsO1xyXG5cdH0sXHJcblx0XHJcblx0cmFkVG9EZWc6IGZ1bmN0aW9uKHJhZGlhbnMpe1xyXG5cdFx0cmV0dXJuIHJhZGlhbnMgLyB0aGlzLnJhZERlZ1JlbDtcclxuXHR9LFxyXG5cdFxyXG5cdGdldDJEQW5nbGU6IGZ1bmN0aW9uKHgxLCB5MSwgeDIsIHkyKXtcclxuXHRcdHZhciB4eCA9IE1hdGguYWJzKHgyIC0geDEpO1xyXG5cdFx0dmFyIHl5ID0gTWF0aC5hYnMoeTIgLSB5MSk7XHJcblx0XHRcclxuXHRcdHZhciBhbmcgPSBNYXRoLmF0YW4yKHl5LCB4eCk7XHJcblx0XHRcclxuXHRcdGlmICh4MiA8PSB4MSAmJiB5MiA8PSB5MSl7XHJcblx0XHRcdGFuZyA9IHRoaXMuUEkgLSBhbmc7XHJcblx0XHR9ZWxzZSBpZiAoeDIgPD0geDEgJiYgeTIgPiB5MSl7XHJcblx0XHRcdGFuZyA9IHRoaXMuUEkgKyBhbmc7XHJcblx0XHR9ZWxzZSBpZiAoeDIgPiB4MSAmJiB5MiA+IHkxKXtcclxuXHRcdFx0YW5nID0gdGhpcy5QSTIgLSBhbmc7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGFuZyA9IChhbmcgKyB0aGlzLlBJMikgJSB0aGlzLlBJMjtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIGFuZztcclxuXHR9XHJcbn07XHJcbiIsImZ1bmN0aW9uIE1hdHJpeDMoKXtcclxuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSA5KSB0aHJvdyBcIk1hdHJpeCAzIG11c3QgcmVjZWl2ZSA5IHBhcmFtZXRlcnNcIjtcclxuXHRcclxuXHR2YXIgYyA9IDA7XHJcblx0Zm9yICh2YXIgaT0wO2k8OTtpKz0zKXtcclxuXHRcdHRoaXNbY10gPSBhcmd1bWVudHNbaV07XHJcblx0XHR0aGlzW2MrM10gPSBhcmd1bWVudHNbaSsxXTtcclxuXHRcdHRoaXNbYys2XSA9IGFyZ3VtZW50c1tpKzJdO1xyXG5cdFx0XHJcblx0XHRjICs9IDE7XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMuX19rdG10MyA9IHRydWU7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWF0cml4MztcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLmdldERldGVybWluYW50ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0dmFyIGRldCA9IChUWzBdICogVFs0XSAqIFRbOF0pICsgKFRbMV0gKiBUWzVdICogVFs2XSkgKyAoVFsyXSAqIFRbM10gKiBUWzddKVxyXG5cdFx0XHQtIChUWzZdICogVFs0XSAqIFRbMl0pIC0gKFRbN10gKiBUWzVdICogVFswXSkgLSAoVFs4XSAqIFRbM10gKiBUWzFdKTtcclxuXHRcclxuXHRyZXR1cm4gZGV0O1xyXG59O1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUuaW52ZXJzZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGRldCA9IHRoaXMuZ2V0RGV0ZXJtaW5hbnQoKTtcclxuXHRpZiAoZGV0ID09IDApIHJldHVybiBudWxsO1xyXG5cdFxyXG5cdHZhciBUID0gdGhpcztcclxuXHR2YXIgaW52ID0gbmV3IE1hdHJpeDMoXHJcblx0XHRUWzRdKlRbOF0tVFs1XSpUWzddLFx0VFs1XSpUWzZdLVRbM10qVFs4XSxcdFRbM10qVFs3XS1UWzRdKlRbNl0sXHJcblx0XHRUWzJdKlRbN10tVFsxXSpUWzhdLFx0VFswXSpUWzhdLVRbMl0qVFs2XSxcdFRbMV0qVFs2XS1UWzBdKlRbN10sXHJcblx0XHRUWzFdKlRbNV0tVFsyXSpUWzRdLFx0VFsyXSpUWzNdLVRbMF0qVFs1XSxcdFRbMF0qVFs0XS1UWzFdKlRbM11cclxuXHQpO1xyXG5cdFxyXG5cdGludi5tdWx0aXBseSgxIC8gZGV0KTtcclxuXHR0aGlzLmNvcHkoaW52KTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24obnVtYmVyKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0Zm9yICh2YXIgaT0wO2k8OTtpKyspe1xyXG5cdFx0VFtpXSAqPSBudW1iZXI7XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4My5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKG1hdHJpeDMpe1xyXG5cdGlmICghbWF0cml4My5fX2t0bXQzKSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSBtYXRyaXgzIGludG8gYW5vdGhlclwiO1xyXG5cdFxyXG5cdHZhciBUID0gdGhpcztcclxuXHRmb3IgKHZhciBpPTA7aTw5O2krKyl7XHJcblx0XHRUW2ldID0gbWF0cml4M1tpXTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXgzLnByb3RvdHlwZS50cmFuc3Bvc2UgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHR2YXIgdmFsdWVzID0gW1xyXG5cdFx0VFswXSwgVFszXSwgVFs2XSxcclxuXHRcdFRbMV0sIFRbNF0sIFRbN10sXHJcblx0XHRUWzJdLCBUWzVdLCBUWzhdXHJcblx0XTtcclxuXHRcclxuXHRmb3IgKHZhciBpPTA7aTw5O2krKyl7XHJcblx0XHRUW2ldID0gdmFsdWVzW2ldO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDMucHJvdG90eXBlLnRvRmxvYXQzMkFycmF5ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0cmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG5cdFx0VFswXSwgVFsxXSwgVFsyXSxcclxuXHRcdFRbM10sIFRbNF0sIFRbNV0sXHJcblx0XHRUWzZdLCBUWzddLCBUWzhdXHJcblx0XSk7XHJcbn07XHJcbiIsInZhciBNYXRyaXgzID0gcmVxdWlyZSgnLi9LVE1hdHJpeDMnKTtcclxuXHJcbmZ1bmN0aW9uIE1hdHJpeDQoKXtcclxuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAxNikgdGhyb3cgXCJNYXRyaXggNCBtdXN0IHJlY2VpdmUgMTYgcGFyYW1ldGVyc1wiO1xyXG5cdFxyXG5cdHZhciBjID0gMDtcclxuXHRmb3IgKHZhciBpPTA7aTwxNjtpKz00KXtcclxuXHRcdHRoaXNbY10gPSBhcmd1bWVudHNbaV07XHJcblx0XHR0aGlzW2MrNF0gPSBhcmd1bWVudHNbaSsxXTtcclxuXHRcdHRoaXNbYys4XSA9IGFyZ3VtZW50c1tpKzJdO1xyXG5cdFx0dGhpc1tjKzEyXSA9IGFyZ3VtZW50c1tpKzNdO1xyXG5cdFx0XHJcblx0XHRjICs9IDE7XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMuX19rdG00ID0gdHJ1ZTtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXRyaXg0O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUuaWRlbnRpdHkgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBwYXJhbXMgPSBbXHJcblx0XHQxLCAwLCAwLCAwLFxyXG5cdFx0MCwgMSwgMCwgMCxcclxuXHRcdDAsIDAsIDEsIDAsXHJcblx0XHQwLCAwLCAwLCAxXHJcblx0XTtcclxuXHRcclxuXHR2YXIgYyA9IDA7XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSs9NCl7XHJcblx0XHR0aGlzW2NdID0gcGFyYW1zW2ldO1xyXG5cdFx0dGhpc1tjKzRdID0gcGFyYW1zW2krMV07XHJcblx0XHR0aGlzW2MrOF0gPSBwYXJhbXNbaSsyXTtcclxuXHRcdHRoaXNbYysxMl0gPSBwYXJhbXNbaSszXTtcclxuXHRcdFxyXG5cdFx0YyArPSAxO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLm11bHRpcGx5U2NhbGFyID0gZnVuY3Rpb24obnVtYmVyKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSsrKXtcclxuXHRcdFRbaV0gKj0gbnVtYmVyO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1hdHJpeDQucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24obWF0cml4NCl7XHJcblx0aWYgKG1hdHJpeDQuX19rdG00KXtcclxuXHRcdHZhciBBMSA9IFt0aGlzWzBdLCAgdGhpc1sxXSwgIHRoaXNbMl0sICB0aGlzWzNdXTtcclxuXHRcdHZhciBBMiA9IFt0aGlzWzRdLCAgdGhpc1s1XSwgIHRoaXNbNl0sICB0aGlzWzddXTtcclxuXHRcdHZhciBBMyA9IFt0aGlzWzhdLCAgdGhpc1s5XSwgIHRoaXNbMTBdLCB0aGlzWzExXV07XHJcblx0XHR2YXIgQTQgPSBbdGhpc1sxMl0sIHRoaXNbMTNdLCB0aGlzWzE0XSwgdGhpc1sxNV1dO1xyXG5cdFx0XHJcblx0XHR2YXIgQjEgPSBbbWF0cml4NFswXSwgbWF0cml4NFs0XSwgbWF0cml4NFs4XSwgIG1hdHJpeDRbMTJdXTtcclxuXHRcdHZhciBCMiA9IFttYXRyaXg0WzFdLCBtYXRyaXg0WzVdLCBtYXRyaXg0WzldLCAgbWF0cml4NFsxM11dO1xyXG5cdFx0dmFyIEIzID0gW21hdHJpeDRbMl0sIG1hdHJpeDRbNl0sIG1hdHJpeDRbMTBdLCBtYXRyaXg0WzE0XV07XHJcblx0XHR2YXIgQjQgPSBbbWF0cml4NFszXSwgbWF0cml4NFs3XSwgbWF0cml4NFsxMV0sIG1hdHJpeDRbMTVdXTtcclxuXHRcdFxyXG5cdFx0dmFyIGRvdCA9IGZ1bmN0aW9uKGNvbCwgcm93KXtcclxuXHRcdFx0dmFyIHN1bSA9IDA7XHJcblx0XHRcdGZvciAodmFyIGo9MDtqPDQ7aisrKXsgc3VtICs9IHJvd1tqXSAqIGNvbFtqXTsgfVxyXG5cdFx0XHRyZXR1cm4gc3VtO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0dGhpc1swXSA9IGRvdChBMSwgQjEpOyAgIHRoaXNbMV0gPSBkb3QoQTEsIEIyKTsgICB0aGlzWzJdID0gZG90KEExLCBCMyk7ICAgdGhpc1szXSA9IGRvdChBMSwgQjQpO1xyXG5cdFx0dGhpc1s0XSA9IGRvdChBMiwgQjEpOyAgIHRoaXNbNV0gPSBkb3QoQTIsIEIyKTsgICB0aGlzWzZdID0gZG90KEEyLCBCMyk7ICAgdGhpc1s3XSA9IGRvdChBMiwgQjQpO1xyXG5cdFx0dGhpc1s4XSA9IGRvdChBMywgQjEpOyAgIHRoaXNbOV0gPSBkb3QoQTMsIEIyKTsgICB0aGlzWzEwXSA9IGRvdChBMywgQjMpOyAgdGhpc1sxMV0gPSBkb3QoQTMsIEI0KTtcclxuXHRcdHRoaXNbMTJdID0gZG90KEE0LCBCMSk7ICB0aGlzWzEzXSA9IGRvdChBNCwgQjIpOyAgdGhpc1sxNF0gPSBkb3QoQTQsIEIzKTsgIHRoaXNbMTVdID0gZG90KEE0LCBCNCk7XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1lbHNlIGlmIChtYXRyaXg0Lmxlbmd0aCA9PSA0KXtcclxuXHRcdHZhciByZXQgPSBbXTtcclxuXHRcdHZhciBjb2wgPSBtYXRyaXg0O1xyXG5cdFxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8MTY7aSs9NCl7XHJcblx0XHRcdHZhciByb3cgPSBbdGhpc1tpXSwgdGhpc1tpKzFdLCB0aGlzW2krMl0sIHRoaXNbaSszXV07XHJcblx0XHRcdHZhciBzdW0gPSAwO1xyXG5cdFx0XHRcclxuXHRcdFx0Zm9yICh2YXIgaj0wO2o8NDtqKyspe1xyXG5cdFx0XHRcdHN1bSArPSByb3dbal0gKiBjb2xbal07XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHJldC5wdXNoKHN1bSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiByZXQ7XHJcblx0fWVsc2V7XHJcblx0XHR0aHJvdyBcIkludmFsaWQgY29uc3RydWN0b3JcIjtcclxuXHR9XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS50cmFuc3Bvc2UgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBUID0gdGhpcztcclxuXHR2YXIgdmFsdWVzID0gW1xyXG5cdFx0VFswXSwgVFs0XSwgVFs4XSwgIFRbMTJdLFxyXG5cdFx0VFsxXSwgVFs1XSwgVFs5XSwgIFRbMTNdLFxyXG5cdFx0VFsyXSwgVFs2XSwgVFsxMF0sIFRbMTRdLFxyXG5cdFx0VFszXSwgVFs3XSwgVFsxMV0sIFRbMTVdLFxyXG5cdF07XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wO2k8MTY7aSsrKXtcclxuXHRcdHRoaXNbaV0gPSB2YWx1ZXNbaV07XHJcblx0fVxyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKG1hdHJpeDQpe1xyXG5cdGlmICghbWF0cml4NC5fX2t0bTQpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIE1hdHJpeDQgaW50byB0aGlzIG1hdHJpeFwiO1xyXG5cdFxyXG5cdGZvciAodmFyIGk9MDtpPDE2O2krKyl7XHJcblx0XHR0aGlzW2ldID0gbWF0cml4NFtpXTtcclxuXHR9XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHJldHVybiBuZXcgTWF0cml4NChcclxuXHRcdFRbMF0sIFRbNF0sIFRbOF0sICBUWzEyXSxcclxuXHRcdFRbMV0sIFRbNV0sIFRbOV0sICBUWzEzXSxcclxuXHRcdFRbMl0sIFRbNl0sIFRbMTBdLCBUWzE0XSxcclxuXHRcdFRbM10sIFRbN10sIFRbMTFdLCBUWzE1XVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LnByb3RvdHlwZS50b0Zsb2F0MzJBcnJheSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIFQgPSB0aGlzO1xyXG5cdHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFtcclxuXHRcdFRbMF0sIFRbMV0sIFRbMl0sICBUWzNdLFxyXG5cdFx0VFs0XSwgVFs1XSwgVFs2XSwgIFRbN10sXHJcblx0XHRUWzhdLCBUWzldLCBUWzEwXSwgVFsxMV0sXHJcblx0XHRUWzEyXSwgVFsxM10sIFRbMTRdLCBUWzE1XVxyXG5cdF0pO1xyXG59O1xyXG5cclxuTWF0cml4NC5wcm90b3R5cGUudG9NYXRyaXgzID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0cmV0dXJuIG5ldyBNYXRyaXgzKFxyXG5cdFx0VFswXSwgVFsxXSwgVFsyXSxcclxuXHRcdFRbNF0sIFRbNV0sIFRbNl0sXHJcblx0XHRUWzhdLCBUWzldLCBUWzEwXVxyXG5cdCk7IFxyXG59O1xyXG5cclxuTWF0cml4NC5nZXRJZGVudGl0eSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0MSwgMCwgMCwgMCxcclxuXHRcdDAsIDEsIDAsIDAsXHJcblx0XHQwLCAwLCAxLCAwLFxyXG5cdFx0MCwgMCwgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFhSb3RhdGlvbiA9IGZ1bmN0aW9uKHJhZGlhbnMpe1xyXG5cdHZhciBDID0gTWF0aC5jb3MocmFkaWFucyk7XHJcblx0dmFyIFMgPSBNYXRoLnNpbihyYWRpYW5zKTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQxLCAgMCwgIDAsIDAsXHJcblx0XHQwLCAgQywgIFMsIDAsXHJcblx0XHQwLCAtUywgIEMsIDAsXHJcblx0XHQwLCAgMCwgIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRZUm90YXRpb24gPSBmdW5jdGlvbihyYWRpYW5zKXtcclxuXHR2YXIgQyA9IE1hdGguY29zKHJhZGlhbnMpO1xyXG5cdHZhciBTID0gTWF0aC5zaW4ocmFkaWFucyk7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBNYXRyaXg0KFxyXG5cdFx0IEMsICAwLCAgUywgMCxcclxuXHRcdCAwLCAgMSwgIDAsIDAsXHJcblx0XHQtUywgIDAsICBDLCAwLFxyXG5cdFx0IDAsICAwLCAgMCwgMVxyXG5cdCk7XHJcbn07XHJcblxyXG5NYXRyaXg0LmdldFpSb3RhdGlvbiA9IGZ1bmN0aW9uKHJhZGlhbnMpe1xyXG5cdHZhciBDID0gTWF0aC5jb3MocmFkaWFucyk7XHJcblx0dmFyIFMgPSBNYXRoLnNpbihyYWRpYW5zKTtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQgQywgIFMsIDAsIDAsXHJcblx0XHQtUywgIEMsIDAsIDAsXHJcblx0XHQgMCwgIDAsIDEsIDAsXHJcblx0XHQgMCwgIDAsIDAsIDFcclxuXHQpO1xyXG59O1xyXG5cclxuTWF0cml4NC5nZXRUcmFuc2xhdGlvbiA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgdHJhbnNsYXRlIHRvIGEgdmVjdG9yIDNcIjtcclxuXHRcclxuXHR2YXIgeCA9IHZlY3RvcjMueDtcclxuXHR2YXIgeSA9IHZlY3RvcjMueTtcclxuXHR2YXIgeiA9IHZlY3RvcjMuejtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHQxLCAwLCAwLCB4LFxyXG5cdFx0MCwgMSwgMCwgeSxcclxuXHRcdDAsIDAsIDEsIHosXHJcblx0XHQwLCAwLCAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0U2NhbGUgPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IHNjYWxlIHRvIGEgdmVjdG9yIDNcIjtcclxuXHRcclxuXHR2YXIgc3ggPSB2ZWN0b3IzLng7XHJcblx0dmFyIHN5ID0gdmVjdG9yMy55O1xyXG5cdHZhciBzeiA9IHZlY3RvcjMuejtcclxuXHRcclxuXHRyZXR1cm4gbmV3IE1hdHJpeDQoXHJcblx0XHRzeCwgIDAsICAwLCAwLFxyXG5cdFx0IDAsIHN5LCAgMCwgMCxcclxuXHRcdCAwLCAgMCwgc3osIDAsXHJcblx0XHQgMCwgIDAsICAwLCAxXHJcblx0KTtcclxufTtcclxuXHJcbk1hdHJpeDQuZ2V0VHJhbnNmb3JtYXRpb24gPSBmdW5jdGlvbihwb3NpdGlvbiwgcm90YXRpb24sIHNjYWxlKXtcclxuXHRpZiAoIXBvc2l0aW9uLl9fa3R2MykgdGhyb3cgXCJQb3NpdGlvbiBtdXN0IGJlIGEgVmVjdG9yM1wiO1xyXG5cdGlmICghcm90YXRpb24uX19rdHYzKSB0aHJvdyBcIlJvdGF0aW9uIG11c3QgYmUgYSBWZWN0b3IzXCI7XHJcblx0aWYgKHNjYWxlICYmICFzY2FsZS5fX2t0djMpIHRocm93IFwiU2NhbGUgbXVzdCBiZSBhIFZlY3RvcjNcIjtcclxuXHRcclxuXHR2YXIgc2NhbGUgPSAoc2NhbGUpPyBNYXRyaXg0LmdldFNjYWxlKHNjYWxlKSA6IE1hdHJpeDQuZ2V0SWRlbnRpdHkoKTtcclxuXHRcclxuXHR2YXIgcm90YXRpb25YID0gTWF0cml4NC5nZXRYUm90YXRpb24ocm90YXRpb24ueCk7XHJcblx0dmFyIHJvdGF0aW9uWSA9IE1hdHJpeDQuZ2V0WVJvdGF0aW9uKHJvdGF0aW9uLnkpO1xyXG5cdHZhciByb3RhdGlvblogPSBNYXRyaXg0LmdldFpSb3RhdGlvbihyb3RhdGlvbi56KTtcclxuXHRcclxuXHR2YXIgdHJhbnNsYXRpb24gPSBNYXRyaXg0LmdldFRyYW5zbGF0aW9uKHBvc2l0aW9uKTtcclxuXHRcclxuXHR2YXIgbWF0cml4O1xyXG5cdG1hdHJpeCA9IE1hdHJpeDQuZ2V0SWRlbnRpdHkoKTtcclxuXHRtYXRyaXgubXVsdGlwbHkocm90YXRpb25YKTtcclxuXHRtYXRyaXgubXVsdGlwbHkocm90YXRpb25ZKTtcclxuXHRtYXRyaXgubXVsdGlwbHkocm90YXRpb25aKTtcclxuXHRtYXRyaXgubXVsdGlwbHkodHJhbnNsYXRpb24pO1xyXG5cdG1hdHJpeC5tdWx0aXBseShzY2FsZSk7XHJcblx0XHJcblx0cmV0dXJuIG1hdHJpeDtcclxufTtcclxuIiwidmFyIE1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG52YXIgVmVjMyA9IHJlcXVpcmUoJy4vS1RWZWN0b3IzJyk7XHJcblxyXG5mdW5jdGlvbiBNZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCl7XHJcblx0aWYgKCFnZW9tZXRyeS5fX2t0Z2VvbWV0cnkpIHRocm93IFwiR2VvbWV0cnkgbXVzdCBiZSBhIEtUR2VvbWV0cnkgaW5zdGFuY2VcIjtcclxuXHRpZiAoIW1hdGVyaWFsLl9fa3RtYXRlcmlhbCkgdGhyb3cgXCJNYXRlcmlhbCBtdXN0IGJlIGEgS1RNYXRlcmlhbCBpbnN0YW5jZVwiO1xyXG5cdFxyXG5cdHRoaXMuX19rdG1lc2ggPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMuZ2VvbWV0cnkgPSBnZW9tZXRyeTtcclxuXHR0aGlzLm1hdGVyaWFsID0gbWF0ZXJpYWw7XHJcblx0XHJcblx0dGhpcy5wYXJlbnQgPSBudWxsO1xyXG5cdHRoaXMudmlzaWJsZSA9IHRydWU7XHJcblx0XHJcblx0dGhpcy5wb3NpdGlvbiA9IG5ldyBWZWMzKDAsIDAsIDApO1xyXG5cdHRoaXMucm90YXRpb24gPSBuZXcgVmVjMygwLCAwLCAwKTtcclxuXHR0aGlzLnNjYWxlID0gbmV3IFZlYzMoMSwgMSwgMSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVzaDtcclxuXHJcbk1lc2gucHJvdG90eXBlLmdldFRyYW5zZm9ybWF0aW9uTWF0cml4ID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgbWF0cml4ID0gTWF0cml4NC5nZXRUcmFuc2Zvcm1hdGlvbih0aGlzLnBvc2l0aW9uLCB0aGlzLnJvdGF0aW9uLCB0aGlzLnNjYWxlKTtcclxuXHRcclxuXHRpZiAodGhpcy5wYXJlbnQpe1xyXG5cdFx0dmFyIG0gPSB0aGlzLnBhcmVudC5nZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xyXG5cdFx0bWF0cml4Lm11bHRpcGx5KG0pO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gbWF0cml4O1xyXG59O1xyXG4iLCJ2YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxuXHJcbmZ1bmN0aW9uIFNjZW5lKHBhcmFtcyl7XHJcblx0dGhpcy5fX2t0c2NlbmUgPSB0cnVlO1xyXG5cdFxyXG5cdHRoaXMubWVzaGVzID0gW107XHJcblx0dGhpcy5kaXJMaWdodCA9IG51bGw7XHJcblx0dGhpcy5zaGFkaW5nTW9kZSA9IFsnQkFTSUMnLCAnTEFNQkVSVCddO1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLnVzZUxpZ2h0aW5nID0gKHBhcmFtcy51c2VMaWdodGluZyk/IHRydWUgOiBmYWxzZTtcclxuXHR0aGlzLmFtYmllbnRMaWdodCA9IChwYXJhbXMuYW1iaWVudExpZ2h0KT8gbmV3IENvbG9yKHBhcmFtcy5hbWJpZW50TGlnaHQpIDogbnVsbDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTY2VuZTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihvYmplY3Qpe1xyXG5cdGlmIChvYmplY3QuX19rdG1lc2gpe1xyXG5cdFx0dGhpcy5tZXNoZXMucHVzaChvYmplY3QpO1xyXG5cdH1lbHNlIGlmIChvYmplY3QuX19rdGRpckxpZ2h0KXtcclxuXHRcdHRoaXMuZGlyTGlnaHQgPSBvYmplY3Q7XHJcblx0fWVsc2V7XHJcblx0XHR0aHJvdyBcIkNhbid0IGFkZCB0aGUgb2JqZWN0IHRvIHRoZSBzY2VuZVwiO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblNjZW5lLnByb3RvdHlwZS5kcmF3TWVzaCA9IGZ1bmN0aW9uKG1lc2gsIGNhbWVyYSl7XHJcblx0dmFyIGdsID0gS1QuZ2w7XHJcblx0XHJcblx0dmFyIG1hdGVyaWFsID0gbWVzaC5tYXRlcmlhbDtcclxuXHR2YXIgc2hhZGVyID0gbWF0ZXJpYWwuc2hhZGVyO1xyXG5cdFxyXG5cdEtULnN3aXRjaFByb2dyYW0oc2hhZGVyKTtcclxuXHR0aGlzLnNldE1hdGVyaWFsQXR0cmlidXRlcyhtZXNoLm1hdGVyaWFsKTtcclxuXHRcclxuXHRtYXRlcmlhbC5zZW5kQXR0cmliRGF0YShtZXNoLCBjYW1lcmEsIHRoaXMpO1xyXG5cdG1hdGVyaWFsLnNlbmRVbmlmb3JtRGF0YShtZXNoLCBjYW1lcmEsIHRoaXMpO1xyXG5cdFxyXG5cdGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG1lc2guZ2VvbWV0cnkuZmFjZXNCdWZmZXIpO1xyXG5cdGdsLmRyYXdFbGVtZW50cyhnbFttYXRlcmlhbC5kcmF3QXNdLCBtZXNoLmdlb21ldHJ5LmZhY2VzQnVmZmVyLm51bUl0ZW1zLCBnbC5VTlNJR05FRF9TSE9SVCwgMCk7XHJcbn07XHJcblxyXG5TY2VuZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oY2FtZXJhKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHR2YXIgYmMgPSBjYW1lcmEuYmFja2dyb3VuZENvbG9yLmdldFJHQkEoKTtcclxuXHRnbC5jbGVhckNvbG9yKGJjWzBdLCBiY1sxXSwgYmNbMl0sIGJjWzNdKTtcclxuXHRnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XHJcblx0XHJcblx0Z2wuZGlzYWJsZSggZ2wuQkxFTkQgKTsgXHJcblx0dmFyIHRyYW5zcGFyZW50cyA9IFtdO1xyXG5cdFxyXG5cdC8vY2FtZXJhLmdldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblx0XHJcblx0Zm9yICh2YXIgaT0wLGxlbj10aGlzLm1lc2hlcy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBtZXNoID0gdGhpcy5tZXNoZXNbaV07XHJcblx0XHRpZiAoIW1lc2gudmlzaWJsZSkgY29udGludWU7XHJcblx0XHRpZiAobWVzaC5tYXRlcmlhbC5vcGFjaXR5ID09IDAuMCkgY29udGludWU7XHJcblx0XHRcclxuXHRcdHZhciBzaGFkaW5nID0gdGhpcy5zaGFkaW5nTW9kZS5pbmRleE9mKG1lc2gubWF0ZXJpYWwuc2hhZGluZyk7XHJcblx0XHRpZiAoc2hhZGluZyA9PSAxKXtcclxuXHRcdFx0aWYgKG1lc2gubWF0ZXJpYWwub3BhY2l0eSAhPSAxLjApe1xyXG5cdFx0XHRcdHRyYW5zcGFyZW50cy5wdXNoKG1lc2gpO1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuZHJhd01lc2gobWVzaCwgY2FtZXJhKTtcclxuXHR9XHJcblx0XHJcblx0Z2wuZW5hYmxlKCBnbC5CTEVORCApOyBcclxuXHRmb3IgKHZhciBpPTAsbGVuPXRyYW5zcGFyZW50cy5sZW5ndGg7aTxsZW47aSsrKXtcclxuXHRcdHZhciBtZXNoID0gdHJhbnNwYXJlbnRzW2ldO1xyXG5cdFx0dGhpcy5kcmF3TWVzaChtZXNoLCBjYW1lcmEpO1xyXG5cdH1cclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblxuU2NlbmUucHJvdG90eXBlLnNldE1hdGVyaWFsQXR0cmlidXRlcyA9IGZ1bmN0aW9uKG1hdGVyaWFsKXtcclxuXHR2YXIgZ2wgPSBLVC5nbDtcclxuXHRcclxuXHR2YXIgY3VsbCA9IFwiQkFDS1wiO1xyXG5cdGlmIChtYXRlcmlhbC5kcmF3RmFjZXMgPT0gJ0JBQ0snKXsgY3VsbCA9IFwiRlJPTlRcIjsgfVxyXG5cdGVsc2UgaWYgKG1hdGVyaWFsLmRyYXdGYWNlcyA9PSAnQk9USCcpeyBjdWxsID0gXCJcIjsgfVxyXG5cdFxyXG5cdGlmIChjdWxsICE9IFwiXCIpe1xyXG5cdFx0Z2wuZW5hYmxlKGdsLkNVTExfRkFDRSk7XHJcblx0XHRnbC5jdWxsRmFjZShnbFtjdWxsXSk7XHJcblx0fWVsc2V7XHJcblx0XHRnbC5kaXNhYmxlKGdsLkNVTExfRkFDRSk7XHJcblx0fVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRiYXNpYzoge1xyXG5cdFx0YXR0cmlidXRlczogW1xyXG5cdFx0XHR7bmFtZTogJ2FWZXJ0ZXhQb3NpdGlvbid9LFxyXG5cdFx0XHR7bmFtZTogJ2FWZXJ0ZXhDb2xvcid9LFxyXG5cdFx0XHR7bmFtZTogJ2FUZXh0dXJlQ29vcmQnfVxyXG5cdFx0XSxcclxuXHRcdHVuaWZvcm1zOiBbXHJcblx0XHRcdHtuYW1lOiAndU1WUE1hdHJpeCd9LFxyXG5cdFx0XHR7bmFtZTogJ3VNYXRlcmlhbENvbG9yJ30sXHJcblx0XHRcdHtuYW1lOiAndVRleHR1cmVTYW1wbGVyJ30sXHJcblx0XHRcdHtuYW1lOiAndUhhc1RleHR1cmUnfVxyXG5cdFx0XSxcclxuXHRcdHZlcnRleFNoYWRlcjogXHJcblx0XHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjMiBhVGV4dHVyZUNvb3JkOyBcIiArXHJcblx0XHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjMyBhVmVydGV4UG9zaXRpb247IFwiICtcclxuXHRcdFx0XCJhdHRyaWJ1dGUgbWVkaXVtcCB2ZWM0IGFWZXJ0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgbWF0NCB1TVZQTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzQgdU1hdGVyaWFsQ29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdlZlcnRleENvbG9yOyBcIiArXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDtcIiArICBcclxuXHRcdFx0XHJcblx0XHRcdFwidm9pZCBtYWluKHZvaWQpeyBcIiArIFxyXG5cdFx0XHRcdFwiZ2xfUG9zaXRpb24gPSB1TVZQTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFx0XCJ2VmVydGV4Q29sb3IgPSBhVmVydGV4Q29sb3IgKiB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwidlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7IFwiICsgXHJcblx0XHRcdFwifSBcIiAsXHJcblx0XHRmcmFnbWVudFNoYWRlcjogXHJcblx0XHRcdFwidW5pZm9ybSBzYW1wbGVyMkQgdVRleHR1cmVTYW1wbGVyOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBib29sIHVIYXNUZXh0dXJlOyBcIiArXHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzQgdlZlcnRleENvbG9yOyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjNCBjb2xvciA9IHZWZXJ0ZXhDb2xvcjsgXCIgKyBcclxuXHRcdFx0XHRcImlmICh1SGFzVGV4dHVyZSl7IFwiICsgXHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjNCB0ZXhDb2xvciA9IHRleHR1cmUyRCh1VGV4dHVyZVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC5zLCB2VGV4dHVyZUNvb3JkLnQpKTsgXCIgK1xyXG5cdFx0XHRcdFx0XCJjb2xvciAqPSB0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwifSBcIiArIFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwiZ2xfRnJhZ0NvbG9yID0gY29sb3I7XCIgKyBcclxuXHRcdFx0XCJ9XCJcclxuXHR9LFxyXG5cdFxyXG5cdFxyXG5cdGxhbWJlcnQ6IHtcclxuXHRcdGF0dHJpYnV0ZXM6IFtcclxuXHRcdFx0e25hbWU6ICdhVmVydGV4UG9zaXRpb24nfSxcclxuXHRcdFx0e25hbWU6ICdhVmVydGV4Q29sb3InfSxcclxuXHRcdFx0e25hbWU6ICdhVGV4dHVyZUNvb3JkJ30sXHJcblx0XHRcdFxyXG5cdFx0XHR7bmFtZTogJ2FWZXJ0ZXhOb3JtYWwnfVxyXG5cdFx0XSxcclxuXHRcdHVuaWZvcm1zOiBbXHJcblx0XHRcdHtuYW1lOiAndU1WTWF0cml4J30sXHJcblx0XHRcdHtuYW1lOiAndVBNYXRyaXgnfSxcclxuXHRcdFx0e25hbWU6ICd1TWF0ZXJpYWxDb2xvcid9LFxyXG5cdFx0XHR7bmFtZTogJ3VUZXh0dXJlU2FtcGxlcid9LFxyXG5cdFx0XHR7bmFtZTogJ3VIYXNUZXh0dXJlJ30sXHJcblx0XHRcdFxyXG5cdFx0XHR7bmFtZTogJ3VVc2VMaWdodGluZyd9LFxyXG5cdFx0XHR7bmFtZTogJ3VOb3JtYWxNYXRyaXgnfSxcclxuXHRcdFx0XHJcblx0XHRcdHtuYW1lOiAndUFtYmllbnRMaWdodENvbG9yJ30sXHJcblx0XHRcdFxyXG5cdFx0XHR7bmFtZTogJ3VMaWdodERpcmVjdGlvbid9LFxyXG5cdFx0XHR7bmFtZTogJ3VMaWdodERpcmVjdGlvbkNvbG9yJ30sXHJcblx0XHRcdHtuYW1lOiAndUxpZ2h0RGlyZWN0aW9uSW50ZW5zaXR5J30sXHJcblx0XHRcdFxyXG5cdFx0XHR7bmFtZTogJ3VPcGFjaXR5J31cclxuXHRcdF0sXHJcblx0XHR2ZXJ0ZXhTaGFkZXI6IFxyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzIgYVRleHR1cmVDb29yZDsgXCIgK1xyXG5cdFx0XHRcImF0dHJpYnV0ZSBtZWRpdW1wIHZlYzMgYVZlcnRleFBvc2l0aW9uOyBcIiArXHJcblx0XHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjNCBhVmVydGV4Q29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwiYXR0cmlidXRlIG1lZGl1bXAgdmVjMyBhVmVydGV4Tm9ybWFsOyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdU1WTWF0cml4OyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDQgdVBNYXRyaXg7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgdmVjNCB1TWF0ZXJpYWxDb2xvcjsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdVVzZUxpZ2h0aW5nOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIG1hdDMgdU5vcm1hbE1hdHJpeDsgXCIgK1xyXG5cdFx0XHRcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgdmVjMyB1QW1iaWVudExpZ2h0Q29sb3I7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzMgdUxpZ2h0RGlyZWN0aW9uOyBcIiArXHJcblx0XHRcdFwidW5pZm9ybSBtZWRpdW1wIHZlYzMgdUxpZ2h0RGlyZWN0aW9uQ29sb3I7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgZmxvYXQgdUxpZ2h0RGlyZWN0aW9uSW50ZW5zaXR5OyBcIiArICBcclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWM0IHZWZXJ0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcInZhcnlpbmcgbWVkaXVtcCB2ZWMyIHZUZXh0dXJlQ29vcmQ7XCIgKyAgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdkxpZ2h0V2VpZ2h0OyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICsgXHJcblx0XHRcdFx0XCJnbF9Qb3NpdGlvbiA9IHVQTWF0cml4ICogdU1WTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFx0XCJpZiAodVVzZUxpZ2h0aW5nKXsgXCIgKyBcclxuXHRcdFx0XHRcdFwidmVjMyB0cmFuc2Zvcm1lZE5vcm1hbCA9IHVOb3JtYWxNYXRyaXggKiBhVmVydGV4Tm9ybWFsOyBcIiArXHJcblx0XHRcdFx0XHRcImZsb2F0IGRpckxpZ2h0V2VpZ2h0ID0gbWF4KGRvdCh0cmFuc2Zvcm1lZE5vcm1hbCwgdUxpZ2h0RGlyZWN0aW9uKSwgMC4wKTsgXCIgK1xyXG5cdFx0XHRcdFx0XCJ2TGlnaHRXZWlnaHQgPSB1QW1iaWVudExpZ2h0Q29sb3IgKyAodUxpZ2h0RGlyZWN0aW9uQ29sb3IgKiBkaXJMaWdodFdlaWdodCAqIHVMaWdodERpcmVjdGlvbkludGVuc2l0eSk7IFwiICtcclxuXHRcdFx0XHRcIn1lbHNleyBcIiArXHJcblx0XHRcdFx0XHRcInZMaWdodFdlaWdodCA9IHZlYzMoMS4wKTsgXCIgKyBcclxuXHRcdFx0XHRcIn1cIiArICAgXHJcblx0XHRcdFx0IFxyXG5cdFx0XHRcdFwidlZlcnRleENvbG9yID0gYVZlcnRleENvbG9yICogdU1hdGVyaWFsQ29sb3I7IFwiICtcclxuXHRcdFx0XHRcInZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkOyBcIiArICBcclxuXHRcdFx0XCJ9IFwiICxcclxuXHRcdGZyYWdtZW50U2hhZGVyOiBcclxuXHRcdFx0XCJ1bmlmb3JtIHNhbXBsZXIyRCB1VGV4dHVyZVNhbXBsZXI7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIGJvb2wgdUhhc1RleHR1cmU7IFwiICtcclxuXHRcdFx0XCJ1bmlmb3JtIG1lZGl1bXAgZmxvYXQgdU9wYWNpdHk7IFwiICtcclxuXHRcdFx0XHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzIgdlRleHR1cmVDb29yZDsgXCIgKyBcclxuXHRcdFx0XCJ2YXJ5aW5nIG1lZGl1bXAgdmVjNCB2VmVydGV4Q29sb3I7IFwiICsgXHJcblx0XHRcdFwidmFyeWluZyBtZWRpdW1wIHZlYzMgdkxpZ2h0V2VpZ2h0OyBcIiArIFxyXG5cdFx0XHRcclxuXHRcdFx0XCJ2b2lkIG1haW4odm9pZCl7IFwiICtcclxuXHRcdFx0XHRcIm1lZGl1bXAgdmVjNCBjb2xvciA9IHZWZXJ0ZXhDb2xvcjsgXCIgKyBcclxuXHRcdFx0XHRcImlmICh1SGFzVGV4dHVyZSl7IFwiICsgXHJcblx0XHRcdFx0XHRcIm1lZGl1bXAgdmVjNCB0ZXhDb2xvciA9IHRleHR1cmUyRCh1VGV4dHVyZVNhbXBsZXIsIHZlYzIodlRleHR1cmVDb29yZC5zLCB2VGV4dHVyZUNvb3JkLnQpKTsgXCIgK1xyXG5cdFx0XHRcdFx0XCJjb2xvciAqPSB0ZXhDb2xvcjsgXCIgK1xyXG5cdFx0XHRcdFwifSBcIiArIFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFwiY29sb3IucmdiICo9IHZMaWdodFdlaWdodDsgXCIgKyBcclxuXHRcdFx0XHRcImdsX0ZyYWdDb2xvciA9IHZlYzQoY29sb3IucmdiLCBjb2xvci5hICogdU9wYWNpdHkpOyBcIiArIFxyXG5cdFx0XHRcIn1cIlxyXG5cdH1cclxufTsiLCJ2YXIgS1QgPSByZXF1aXJlKCcuL0tUTWFpbicpO1xyXG52YXIgVXRpbHMgPSByZXF1aXJlKCcuL0tUVXRpbHMnKTtcclxuXHJcbmZ1bmN0aW9uIFRleHR1cmUoc3JjLCBwYXJhbXMpe1xyXG5cdHRoaXMuX19rdHRleHR1cmUgPSB0cnVlO1xyXG5cdFxyXG5cdGlmICghcGFyYW1zKSBwYXJhbXMgPSB7fTtcclxuXHR0aGlzLm1pbkZpbHRlciA9IChwYXJhbXMubWluRmlsdGVyKT8gcGFyYW1zLm1pbkZpbHRlciA6ICdMSU5FQVInO1xyXG5cdHRoaXMubWFnRmlsdGVyID0gKHBhcmFtcy5tYWdGaWx0ZXIpPyBwYXJhbXMubWFnRmlsdGVyIDogJ0xJTkVBUic7XHJcblx0dGhpcy53cmFwUyA9IChwYXJhbXMuU1dyYXBwaW5nKT8gcGFyYW1zLlNXcmFwcGluZyA6ICdSRVBFQVQnO1xyXG5cdHRoaXMud3JhcFQgPSAocGFyYW1zLlRXcmFwcGluZyk/IHBhcmFtcy5UV3JhcHBpbmcgOiAnUkVQRUFUJztcclxuXHRcclxuXHR0aGlzLnRleHR1ZSA9IG51bGw7XHJcblx0XHJcblx0dGhpcy5pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cdHRoaXMuaW1hZ2Uuc3JjID0gc3JjO1xyXG5cdHRoaXMuaW1hZ2UucmVhZHkgPSBmYWxzZTtcclxuXHRcclxuXHR2YXIgVCA9IHRoaXM7XHJcblx0VXRpbHMuYWRkRXZlbnQodGhpcy5pbWFnZSwgXCJsb2FkXCIsIGZ1bmN0aW9uKCl7XHJcblx0XHRULnBhcnNlVGV4dHVyZSgpOyBcclxuXHR9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlO1xyXG5cclxuVGV4dHVyZS5wcm90b3R5cGUucGFyc2VUZXh0dXJlID0gZnVuY3Rpb24oKXtcclxuXHRpZiAodGhpcy5pbWFnZS5yZWFkeSkgcmV0dXJuO1xyXG5cdFxyXG5cdHRoaXMuaW1hZ2UucmVhZHkgPSB0cnVlO1xyXG5cdHZhciBnbCA9IEtULmdsO1xyXG5cdFxyXG5cdHRoaXMudGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuXHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUpO1xyXG5cdFxyXG5cdGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19GTElQX1lfV0VCR0wsIHRydWUpO1xyXG5cdFxyXG5cdGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgdGhpcy5pbWFnZSk7XHJcblx0XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsW3RoaXMubWFnRmlsdGVyXSk7XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsW3RoaXMubWluRmlsdGVyXSk7XHJcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2xbdGhpcy53cmFwU10pO1xyXG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsW3RoaXMud3JhcFRdKTtcclxuXHRcclxuXHRnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcclxuXHRcclxuXHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Z2V0OiBmdW5jdGlvbihlbGVtZW50KXtcclxuXHRcdGlmIChlbGVtZW50LmNoYXJBdCgwKSA9PSBcIiNcIil7XHJcblx0XHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50LnJlcGxhY2UoXCIjXCIsIFwiXCIpKTtcclxuXHRcdH1lbHNlIGlmIChlbGVtZW50LmNoYXJBdCgwKSA9PSBcIi5cIil7XHJcblx0XHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGVsZW1lbnQucmVwbGFjZShcIi5cIiwgXCJcIikpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShlbGVtZW50KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdFxyXG5cdGFkZEV2ZW50OiBmdW5jdGlvbihlbGVtZW50LCB0eXBlLCBjYWxsYmFjayl7XHJcblx0XHRpZiAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKXtcclxuXHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBmYWxzZSk7XHJcblx0XHR9ZWxzZSBpZiAoZWxlbWVudC5hdHRhY2hFdmVudCl7XHJcblx0XHRcdGVsZW1lbnQuYXR0YWNoRXZlbnQoXCJvblwiICsgdHlwZSwgY2FsbGJhY2spO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuIiwiZnVuY3Rpb24gVmVjdG9yMih4LCB5KXtcclxuXHR0aGlzLl9fa3R2MiA9IHRydWU7XHJcblx0XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBWZWN0b3IyO1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XHJcblx0XHJcblx0cmV0dXJuIGxlbmd0aDtcclxufTtcclxuXHJcblZlY3RvcjIucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoKCk7XHJcblx0XHJcblx0dGhpcy54IC89IGxlbmd0aDtcclxuXHR0aGlzLnkgLz0gbGVuZ3RoO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24odmVjdG9yMil7XHJcblx0aWYgKCF2ZWN0b3IyLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBwZXJmb3JtIGEgZG90IHByb2R1Y3Qgd2l0aCBhIHZlY3RvcjJcIjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcy54ICogdmVjdG9yMi54ICsgdGhpcy55ICogdmVjdG9yMi55O1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuaW52ZXJ0ID0gZnVuY3Rpb24oKXtcclxuXHRyZXR1cm4gdGhpcy5tdWx0aXBseSgtMSk7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uKG51bWJlcil7XHJcblx0dGhpcy54ICo9IG51bWJlcjtcclxuXHR0aGlzLnkgKj0gbnVtYmVyO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odmVjdG9yMil7XHJcblx0aWYgKCF2ZWN0b3IyLl9fa3R2MikgdGhyb3cgXCJDYW4gb25seSBhZGQgYSB2ZWN0b3IyIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ICs9IHZlY3RvcjIueDtcclxuXHR0aGlzLnkgKz0gdmVjdG9yMi55O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKHZlY3RvcjIpe1xyXG5cdGlmICghdmVjdG9yMi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgY29weSBhIHZlY3RvcjIgdG8gdGhpcyB2ZWN0b3JcIjtcclxuXHRcclxuXHR0aGlzLnggPSB2ZWN0b3IyLng7XHJcblx0dGhpcy55ID0gdmVjdG9yMi55O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSl7XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMi5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpe1xyXG5cdHJldHVybiBuZXcgVmVjdG9yMih0aGlzLngsIHRoaXMueSk7XHJcbn07XHJcblxyXG5WZWN0b3IyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbih2ZWN0b3IyKXtcclxuXHRpZiAoIXZlY3RvcjIuX19rdHYyKSB0aHJvdyBcIkNhbiBvbmx5IGNvcHkgYSB2ZWN0b3IyIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0cmV0dXJuICh0aGlzLnggPT0gdmVjdG9yMi54ICYmIHRoaXMueSA9PSB2ZWN0b3IyLnkpO1xyXG59O1xyXG5cclxuVmVjdG9yMi52ZWN0b3JzRGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHZlY3RvcjJfYSwgdmVjdG9yMl9iKXtcclxuXHRpZiAoIXZlY3RvcjJfYS5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczJcIjtcclxuXHRpZiAoIXZlY3RvcjJfYi5fX2t0djIpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczJcIjtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjIodmVjdG9yMl9hLnggLSB2ZWN0b3IyX2IueCwgdmVjdG9yMl9hLnkgLSB2ZWN0b3IyX2IueSk7XHJcbn07XHJcblxyXG5WZWN0b3IyLmZyb21BbmdsZSA9IGZ1bmN0aW9uKHJhZGlhbil7XHJcblx0dmFyIHggPSBNYXRoLmNvcyhyYWRpYW4pO1xyXG5cdHZhciB5ID0gLU1hdGguc2luKHJhZGlhbik7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IyKHgsIHkpO1xyXG59O1xyXG4iLCJmdW5jdGlvbiBWZWN0b3IzKHgsIHksIHope1xyXG5cdHRoaXMuX19rdHYzID0gdHJ1ZTtcclxuXHRcclxuXHR0aGlzLnggPSB4O1xyXG5cdHRoaXMueSA9IHk7XHJcblx0dGhpcy56ID0gejtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yMztcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCl7XHJcblx0dmFyIGxlbmd0aCA9IE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkgKyB0aGlzLnogKiB0aGlzLnopO1xyXG5cdFxyXG5cdHJldHVybiBsZW5ndGg7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCgpO1xyXG5cdFxyXG5cdHRoaXMueCAvPSBsZW5ndGg7XHJcblx0dGhpcy55IC89IGxlbmd0aDtcclxuXHR0aGlzLnogLz0gbGVuZ3RoO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBwZXJmb3JtIGEgZG90IHByb2R1Y3Qgd2l0aCBhIHZlY3RvcjNcIjtcclxuXHRcclxuXHRyZXR1cm4gdGhpcy54ICogdmVjdG9yMy54ICsgdGhpcy55ICogdmVjdG9yMy55ICsgdGhpcy56ICogdmVjdG9yMy56O1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbih2ZWN0b3IzKXtcclxuXHRpZiAoIXZlY3RvcjMuX19rdHYzKSB0aHJvdyBcIkNhbiBvbmx5IHBlcmZvcm0gYSBjcm9zcyBwcm9kdWN0IHdpdGggYSB2ZWN0b3IzXCI7XHJcblx0XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IzKFxyXG5cdFx0dGhpcy55ICogdmVjdG9yMy56IC0gdGhpcy56ICogdmVjdG9yMy55LFxyXG5cdFx0dGhpcy56ICogdmVjdG9yMy54IC0gdGhpcy54ICogdmVjdG9yMy56LFxyXG5cdFx0dGhpcy54ICogdmVjdG9yMy55IC0gdGhpcy55ICogdmVjdG9yMy54XHJcblx0KTtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihudW1iZXIpe1xyXG5cdHRoaXMueCAqPSBudW1iZXI7XHJcblx0dGhpcy55ICo9IG51bWJlcjtcclxuXHR0aGlzLnogKj0gbnVtYmVyO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBhZGQgYSBWZWN0b3IzIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ICs9IHZlY3RvcjMueDtcclxuXHR0aGlzLnkgKz0gdmVjdG9yMy55O1xyXG5cdHRoaXMueiArPSB2ZWN0b3IzLno7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgVmVjdG9yMyB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCA9IHZlY3RvcjMueDtcclxuXHR0aGlzLnkgPSB2ZWN0b3IzLnk7XHJcblx0dGhpcy56ID0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSwgeil7XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMueCwgdGhpcy55LCB0aGlzLnopO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgVmVjdG9yMyB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHJldHVybiAodGhpcy54ID09IHZlY3RvcjMueCAmJiB0aGlzLnkgPT0gdmVjdG9yMy55ICYmIHRoaXMueiA9PSB2ZWN0b3IzLnopO1xyXG59O1xyXG5cclxuVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHZlY3RvcjNfYSwgdmVjdG9yM19iKXtcclxuXHRpZiAoIXZlY3RvcjNfYS5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczNcIjtcclxuXHRpZiAoIXZlY3RvcjNfYi5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczNcIjtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjModmVjdG9yM19hLnggLSB2ZWN0b3IzX2IueCwgdmVjdG9yM19hLnkgLSB2ZWN0b3IzX2IueSwgdmVjdG9yM19hLnogLSB2ZWN0b3IzX2Iueik7XHJcbn07XHJcblxyXG5WZWN0b3IzLmZyb21BbmdsZSA9IGZ1bmN0aW9uKHJhZGlhbl94eiwgcmFkaWFuX3kpe1xyXG5cdHZhciB4ID0gTWF0aC5jb3MocmFkaWFuX3h6KTtcclxuXHR2YXIgeSA9IE1hdGguc2luKHJhZGlhbl95KTtcclxuXHR2YXIgeiA9IC1NYXRoLnNpbihyYWRpYW5feHopO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMyh4LCB5LCB6KTtcclxufTtcclxuIiwidmFyIEtUID0gcmVxdWlyZSgnLi9LVE1haW4nKTtcclxuS1QuQ2FtZXJhUGVyc3BlY3RpdmUgPSByZXF1aXJlKCcuL0tUQ2FtZXJhUGVyc3BlY3RpdmUnKTtcclxuS1QuQ29sb3IgPSByZXF1aXJlKCcuL0tUQ29sb3InKTtcclxuS1QuR2VvbWV0cnkgPSByZXF1aXJlKCcuL0tUR2VvbWV0cnknKTtcclxuS1QuR2VvbWV0cnlCb3ggPSByZXF1aXJlKCcuL0tUR2VvbWV0cnlCb3gnKTtcclxuS1QuR2VvbWV0cnlQbGFuZSA9IHJlcXVpcmUoJy4vS1RHZW9tZXRyeVBsYW5lJyk7XHJcbktULkdlb21ldHJ5U3BoZXJlID0gcmVxdWlyZSgnLi9LVEdlb21ldHJ5U3BoZXJlJyk7XHJcbktULkxpZ2h0RGlyZWN0aW9uYWwgPSByZXF1aXJlKCcuL0tUTGlnaHREaXJlY3Rpb25hbCcpO1xyXG5LVC5JbnB1dCA9IHJlcXVpcmUoJy4vS1RJbnB1dCcpO1xyXG5LVC5NYXRlcmlhbCA9IHJlcXVpcmUoJy4vS1RNYXRlcmlhbCcpO1xyXG5LVC5NYXRlcmlhbEJhc2ljID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsQmFzaWMnKTtcclxuS1QuTWF0ZXJpYWxMYW1iZXJ0ID0gcmVxdWlyZSgnLi9LVE1hdGVyaWFsTGFtYmVydCcpO1xyXG5LVC5NYXRoID0gcmVxdWlyZSgnLi9LVE1hdGgnKTtcclxuS1QuTWF0cml4MyA9IHJlcXVpcmUoJy4vS1RNYXRyaXgzJyk7XHJcbktULk1hdHJpeDQgPSByZXF1aXJlKCcuL0tUTWF0cml4NCcpO1xyXG5LVC5NZXNoID0gcmVxdWlyZSgnLi9LVE1lc2gnKTtcclxuS1QuVGV4dHVyZSA9IHJlcXVpcmUoJy4vS1RUZXh0dXJlJyk7XHJcbktULlV0aWxzID0gcmVxdWlyZSgnLi9LVFV0aWxzJyk7XHJcbktULlZlY3RvcjIgPSByZXF1aXJlKCcuL0tUVmVjdG9yMicpO1xyXG5LVC5WZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxuS1QuU2NlbmUgPSByZXF1aXJlKCcuL0tUU2NlbmUnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS1Q7Iiwid2luZG93LktUID0gcmVxdWlyZSgnLi9LcmFtVGVjaCcpOyJdfQ==
