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
	
	var triGeo = new KT.Geometry();
	triGeo.addVertice( 1.0, -1.0, 0.0, KT.Color._BLUE);
	triGeo.addVertice( 0.0,  1.0, 0.0, KT.Color._GREEN);
	triGeo.addVertice(-1.0, -1.0, 0.0, KT.Color._RED);
	triGeo.addFace(0, 1, 2);
	triGeo.build();
	
	var material = new KT.Material({shader: KT.shaders.basic, drawFaces: 'BOTH'});
	
	this.triangle = new KT.Mesh(triGeo, material);
	this.triangle.position.z = -5.0;
	
	this.scene.add(this.triangle);
};

Test.prototype.loopScene = function(){
	var T = this;
	
	T.triangle.rotation.y += KT.Math.degToRad(3);
	T.scene.render(T.camera);
	
	setTimeout(function(){ T.loopScene(); }, T.fps);
};
