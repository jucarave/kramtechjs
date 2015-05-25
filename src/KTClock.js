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
