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
		ambientLight: "#333333"
	});
	
	this.camera = new KT.CameraPerspective(KT.Math.degToRad(60), this.canvas.width / this.canvas.height, 0.1, 100.0);
	this.camera.position.set(0,5,7);
	this.camera.lookAt(new KT.Vector3(0,0,0));
	this.camera.setBackgroundColor("#B1BDD1");
	
	var cameraControls = new KT.OrbitAndPan();
	this.camera.setControls(cameraControls);
	
	var boxGeo = new KT.GeometryBox(2.0, 2.0, 2.0);
	var texture = new KT.Texture('img/crate.jpg');
	var material = new KT.MaterialLambert(null, KT.Color._WHITE);
	material.drawFaces = 'BOTH';
	this.box = new KT.Mesh(boxGeo, material);
	this.box.position.x = 3.0;
	this.scene.add(this.box);
	
	
	var sphGeo = new KT.GeometrySphere(1.0, 16, 16);
	var texture = new KT.Texture('img/moon.gif');
	var material = new KT.MaterialLambert(null, KT.Color._WHITE);
	this.sphere = new KT.Mesh(sphGeo, material);
	this.sphere.position.x = -3.0;
	this.scene.add(this.sphere);
	
	
	var plnGeo = new KT.GeometryPlane(32.0, 32.0);
	var material = new KT.MaterialBasic(null, "#8B8B8B");
	this.plane = new KT.Mesh(plnGeo, material);
	this.plane.position.y = -1.5;
	this.scene.add(this.plane);
	
	this.lightAng = 0;
	this.pLight = new KT.LightPoint(new KT.Vector3(-2.5, -1.45, 0.0), 1.0, 6.0, KT.Color._RED);
	var sphGeo = new KT.GeometrySphere(0.1, 4, 4);
	var material = new KT.MaterialBasic(null, this.pLight.color.getHex());
	var spLight= new KT.Mesh(sphGeo, material);
	spLight.position = this.pLight.position;
	this.scene.add(spLight);
	this.scene.add(this.pLight);
	
	
	this.scene.add(new KT.LightDirectional(new KT.Vector3(-1.0, -1.0, -1.0), KT.Color._WHITE, 0.6));
};

Test.prototype.loopScene = function(){
	var T = this;
	
	this.lightAng += KT.Math.degToRad(1);
	this.pLight.position.x = Math.cos(this.lightAng) * 4.5;
	this.pLight.position.y = Math.sin(this.lightAng) * 4.5;
	if (this.pLight.position.y <= -1.45) this.pLight.position.y = -1.45;
	
	T.box.rotation.x += KT.Math.degToRad(0.25);
	T.box.rotation.y += KT.Math.degToRad(0.25);
	
	T.sphere.rotation.x += KT.Math.degToRad(0.25);
	T.sphere.rotation.y += KT.Math.degToRad(1);/**/
	
	T.scene.render(T.camera);
	
	setTimeout(function(){ T.loopScene(); }, T.fps);
};

var test;
KT.Utils.addEvent(window, "load", function(){
	test = new Test();
});
