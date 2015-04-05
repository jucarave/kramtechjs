function Color(hexColor){
	this.color = hexColor;
}

module.exports = Color;

Color.prototype.set = function(hexColor){
	this.color = hexColor;
};

Color.prototype.setRGB = function(red, green, blue){
	this.setRGBA(red, green, blue, 1);
};

Color.prototype.setRGBA = function(red, green, blue, alpha){
	var r = (+red).toString(16);
	var g = (+green).toString(16);
	var b = (+blue).toString(16);
	var a = (+alpha).toString(16);
	
	var c = "#" + r + g + b + a; 
	this.color = parseInt(c, 16);
};

Color.prototype.getRGB = function(){
	var c = this.getRGBA();
	c.splice(3, 1);
	
	return c;
};

Color.prototype.getRGBA = function(){
	var str = this.color.substring(1);
	var r = parseInt(str.substring(0, 2), 16);
	var g = parseInt(str.substring(2, 4), 16);
	var b = parseInt(str.substring(4, 6), 16);
	var a = parseInt(str.substring(6, 8), 16);
	
	if (!a) a = 1;
	
	return [r, g, b, a];
};

Color._BLACK		= "#00000001";
Color._RED 			= "#FF000001";
Color._GREEN 		= "#00FF0001";
Color._BLUE 		= "#0000FF01";
Color._WHITE		= "#FFFFFF01";
Color._YELLOW		= "#FFFF0001";
Color._MAGENTA		= "#FF00FF01";
Color._AQUA			= "#00FFFF01";
Color._GOLD			= "#FFD70001";
Color._GRAY			= "#80808001";
Color._PURPLE		= "#80008001";