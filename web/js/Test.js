function Test(){
	this.canvas = document.getElementById("cnvKramTech");
	this.fps = 1000 / 30;
	
	KT.init(this.canvas);
	
	this.createSimpleScene();
	this.loopScene();
}

Test.prototype.createSimpleScene = function(){
	this.scene = new KT.Scene();
	this.camera = new KT.CameraPerspective(new KT.Vector3(0,0,0), new KT.Vector3(0,0,0), KT.Math.degToRad(60), this.canvas.width / this.canvas.height, 0.1, 100.0);
	
	var boxGeo = new KT.GeometryBox(1.0, 2.0, 3.0);
	var texture = new KT.Texture('img/crate.jpg');
	var material = new KT.MaterialBasic(texture, "#CC444401");
	
	this.box = new KT.Mesh(boxGeo, material);
	this.box.position.z = -5.0;
	
	this.scene.add(this.box);
};

Test.prototype.loopScene = function(){
	var T = this;
	
	T.box.rotation.x += KT.Math.degToRad(3);
	T.box.rotation.y += KT.Math.degToRad(3);
	T.box.rotation.z += KT.Math.degToRad(3);
	T.scene.render(T.camera);
	
	setTimeout(function(){ T.loopScene(); }, T.fps);
};

var test;
KT.Utils.addEvent(window, "load", function(){
	test = new Test();
});
