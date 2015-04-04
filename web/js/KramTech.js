(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js":[function(require,module,exports){
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

Vector3.fromAngle = function(radian_xy, radian_z){
	var x = Math.cos(radian_xy);
	var y = -Math.sin(radian_xy);
	var z = Math.sin(radian_z);
	
	return new Vector3(x, y, z);
};

},{}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KramTech.js":[function(require,module,exports){
var KT = {};

KT.Vector3 = require('./KTVector3');

module.exports = KT;

},{"./KTVector3":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KTVector3.js"}],"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js":[function(require,module,exports){
window.KT = require('./KramTech');
},{"./KramTech":"C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\KramTech.js"}]},{},["C:\\Users\\Ramirez\\My Documents\\Aptana Studio 3 Workspace\\kramtechjs\\src\\WindowExporter.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiLi5cXHNyY1xcS1RWZWN0b3IzLmpzIiwiLi5cXHNyY1xcS3JhbVRlY2guanMiLCIuLlxcc3JjXFxXaW5kb3dFeHBvcnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZnVuY3Rpb24gVmVjdG9yMyh4LCB5LCB6KXtcclxuXHR0aGlzLl9fa3R2MyA9IHRydWU7XHJcblx0XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZlY3RvcjM7XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbigpe1xyXG5cdHZhciBsZW5ndGggPSBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55ICsgdGhpcy56ICogdGhpcy56KTtcclxuXHRcclxuXHRyZXR1cm4gbGVuZ3RoO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24oKXtcclxuXHR2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGgoKTtcclxuXHRcclxuXHR0aGlzLnggLz0gbGVuZ3RoO1xyXG5cdHRoaXMueSAvPSBsZW5ndGg7XHJcblx0dGhpcy56IC89IGxlbmd0aDtcclxuXHRcclxuXHRyZXR1cm4gdGhpcztcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKHZlY3RvcjMpe1xyXG5cdGlmICghdmVjdG9yMy5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgcGVyZm9ybSBhIGRvdCBwcm9kdWN0IHdpdGggYSB2ZWN0b3IzXCI7XHJcblx0XHJcblx0cmV0dXJuIHRoaXMueCAqIHZlY3RvcjMueCArIHRoaXMueSAqIHZlY3RvcjMueSArIHRoaXMueiAqIHZlY3RvcjMuejtcclxufTtcclxuXHJcblZlY3RvcjMucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRoaXMubXVsdGlwbHkoLTEpO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbihudW1iZXIpe1xyXG5cdHRoaXMueCAqPSBudW1iZXI7XHJcblx0dGhpcy55ICo9IG51bWJlcjtcclxuXHR0aGlzLnogKj0gbnVtYmVyO1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBhZGQgYSBWZWN0b3IzIHRvIHRoaXMgdmVjdG9yXCI7XHJcblx0XHJcblx0dGhpcy54ICs9IHZlY3RvcjMueDtcclxuXHR0aGlzLnkgKz0gdmVjdG9yMy55O1xyXG5cdHRoaXMueiArPSB2ZWN0b3IzLno7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgVmVjdG9yMyB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHRoaXMueCA9IHZlY3RvcjMueDtcclxuXHR0aGlzLnkgPSB2ZWN0b3IzLnk7XHJcblx0dGhpcy56ID0gdmVjdG9yMy56O1xyXG5cdFxyXG5cdHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSwgeil7XHJcblx0dGhpcy54ID0geDtcclxuXHR0aGlzLnkgPSB5O1xyXG5cdHRoaXMueiA9IHo7XHJcblx0XHJcblx0cmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5WZWN0b3IzLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMueCwgdGhpcy55LCB0aGlzLnopO1xyXG59O1xyXG5cclxuVmVjdG9yMy5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24odmVjdG9yMyl7XHJcblx0aWYgKCF2ZWN0b3IzLl9fa3R2MykgdGhyb3cgXCJDYW4gb25seSBjb3B5IGEgVmVjdG9yMyB0byB0aGlzIHZlY3RvclwiO1xyXG5cdFxyXG5cdHJldHVybiAodGhpcy54ID09IHZlY3RvcjMueCAmJiB0aGlzLnkgPT0gdmVjdG9yMy55ICYmIHRoaXMueiA9PSB2ZWN0b3IzLnopO1xyXG59O1xyXG5cclxuVmVjdG9yMy52ZWN0b3JzRGlmZmVyZW5jZSA9IGZ1bmN0aW9uKHZlY3RvcjNfYSwgdmVjdG9yM19iKXtcclxuXHRpZiAoIXZlY3RvcjNfYS5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczNcIjtcclxuXHRpZiAoIXZlY3RvcjNfYi5fX2t0djMpIHRocm93IFwiQ2FuIG9ubHkgY3JlYXRlIHRoaXMgdmVjdG9yIHVzaW5nIDIgdmVjdG9yczNcIjtcclxuXHRcclxuXHRyZXR1cm4gbmV3IFZlY3RvcjModmVjdG9yM19hLnggLSB2ZWN0b3IzX2IueCwgdmVjdG9yM19hLnkgLSB2ZWN0b3IzX2IueSwgdmVjdG9yM19hLnogLSB2ZWN0b3IzX2Iueik7XHJcbn07XHJcblxyXG5WZWN0b3IzLmZyb21BbmdsZSA9IGZ1bmN0aW9uKHJhZGlhbl94eSwgcmFkaWFuX3ope1xyXG5cdHZhciB4ID0gTWF0aC5jb3MocmFkaWFuX3h5KTtcclxuXHR2YXIgeSA9IC1NYXRoLnNpbihyYWRpYW5feHkpO1xyXG5cdHZhciB6ID0gTWF0aC5zaW4ocmFkaWFuX3opO1xyXG5cdFxyXG5cdHJldHVybiBuZXcgVmVjdG9yMyh4LCB5LCB6KTtcclxufTtcclxuIiwidmFyIEtUID0ge307XHJcblxyXG5LVC5WZWN0b3IzID0gcmVxdWlyZSgnLi9LVFZlY3RvcjMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS1Q7XHJcbiIsIndpbmRvdy5LVCA9IHJlcXVpcmUoJy4vS3JhbVRlY2gnKTsiXX0=
