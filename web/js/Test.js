function Test(){
	this.canvas = document.getElementById("cnvKramTech");
	this.fps = 1000 / 30;
	
	KT.init(this.canvas);
	
	this.createSimpleScene();
	this.loopScene();
}

Test.prototype.createSimpleScene = function(){
	this.scene = new KT.Scene({
		useLighting: true,
		ambientLight: "#111111"
	});
	
	var r = KT.Math.degToRad(33);
	this.camera = new KT.CameraPerspective(new KT.Vector3(-5,5,5), new KT.Vector3(0,0,0), KT.Math.degToRad(60), this.canvas.width / this.canvas.height, 0.1, 100.0);
	this.camera.setBackgroundColor("#000000");
	this.camera.lookAt(new KT.Vector3(0,0,0));
	
	var boxGeo = new KT.GeometryBox(2.0, 2.0, 2.0);
	var texture = new KT.Texture('img/crate.jpg');
	var material = new KT.MaterialLambert(texture, KT.Color._WHITE);
	material.drawFaces = 'BOTH';
	this.box = new KT.Mesh(boxGeo, material);
	this.box.position.x = 1.2;
	this.scene.add(this.box);
	
	
	var sphGeo = new KT.GeometrySphere(1.0, 16, 16);
	var texture = new KT.Texture('img/moon.gif');
	var material = new KT.MaterialLambert(texture, KT.Color._WHITE);
	this.sphere = new KT.Mesh(sphGeo, material);
	this.sphere.position.x = -1.2;
	this.scene.add(this.sphere);
	
	
	this.scene.add(new KT.LightDirectional(new KT.Vector3(-1.0, -1.0, -1.0), "#FFFFFF", 0.6));
};

Test.prototype.loopScene = function(){
	var T = this;
	
	//this.camera.rotation.x += KT.Math.degToRad(0.25);
	
	T.box.rotation.x += KT.Math.degToRad(0.25);
	T.box.rotation.y += KT.Math.degToRad(0.25);
	
	T.sphere.rotation.x += KT.Math.degToRad(0.25);
	T.sphere.rotation.y += KT.Math.degToRad(0.25);
	
	T.scene.render(T.camera);
	
	setTimeout(function(){ T.loopScene(); }, T.fps);
};

var test;
KT.Utils.addEvent(window, "load", function(){
	test = new Test();
});
