function Color(hexColor){
	var str = hexColor.substring(1);
	var r = parseInt(str.substring(0, 2), 16);
	var g = parseInt(str.substring(2, 4), 16);
	var b = parseInt(str.substring(4, 6), 16);
	var a = parseInt(str.substring(6, 8), 16);
	
	this.color = [r / 255, g / 255, b / 255, a];
}

module.exports = Color;

Color.prototype.set = function(hexColor){
	var str = hexColor.substring(1);
	var r = parseInt(str.substring(0, 2), 16);
	var g = parseInt(str.substring(2, 4), 16);
	var b = parseInt(str.substring(4, 6), 16);
	var a = parseInt(str.substring(6, 8), 16);
	
	this.color = [r / 255, g / 255, b / 255, a];
};

Color.prototype.setRGB = function(red, green, blue){
	this.setRGBA(red, green, blue, 1);
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
	var a = (c[3]).toString(16);
	
	if (r.length == 1) r = "0" + r;
	if (g.length == 1) g = "0" + g;
	if (b.length == 1) b = "0" + b;
	if (a.length == 1) a = "0" + a;
	
	return ("#" + r + g + b + a).toUpperCase();
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