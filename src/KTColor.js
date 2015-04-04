function Color(hexColor){
	this.color = hexColor;
}

modules.exports = Color;

Color.prototype.setRGB = function(red, green, blue){
	var r = (+red).toString(16);
	var g = (+green).toString(16);
	var b = (+blue).toString(16);
	
	var c = "0x" + r + g + b; 
	this.color = parseInt(c, 16);
};

Color.prototype.set = function(hexColor){
	this.color = hexColor;
};

Color._BLACK		= 0x000000;
Color._RED 			= 0xFF0000;
Color._GREEN 		= 0x00FF00;
Color._BLUE 		= 0x0000FF;
Color._WHITE		= 0xFFFFFF;
Color._YELLOW		= 0xFFFF00;
Color._MAGENTA		= 0xFF00FF;
Color._CYAN			= 0x00FFFF;
Color._GOLD			= 0xFFD700;
Color._GRAY			= 0x808080;
Color._PURPLE		= 0x800080;