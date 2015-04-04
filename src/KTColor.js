function Color(hexColor){
	this.color = hexColor;
}

module.exports = Color;

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

Color.prototype.getRGB = function(){
	var str = (this.color).toString(16);
	var r = parseInt(str.substring(0, 2), 16);
	var g = parseInt(str.substring(2, 4), 16);
	var b = parseInt(str.substring(4, 6), 16);
	
	return [r, g, b];
};

Color.prototype.getR = function(){
	var str = (this.color).toString(16);
	str = str.substring(0, 2);
	
	return parseInt(str, 16);
};

Color.prototype.getG = function(){
	var str = (this.color).toString(16);
	str = str.substring(2, 4);
	
	return parseInt(str, 16);
};

Color.prototype.getB = function(){
	var str = (this.color).toString(16);
	str = str.substring(4, 6);
	
	return parseInt(str, 16);
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