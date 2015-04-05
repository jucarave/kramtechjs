function Test(){
	this.canvas = document.getElementById("cnvKramTech");
	KT.init(this.canvas);
	
	this.createSimpleScene();
}

Test.prototype.createSimpleScene = function(){
	var scene = new KT.Scene();
	var camera = new KT.Camera(new KT.Vector3(0,0,0), new KT.Vector3(0,0,0), KT.Math.degToRad(60), this.canvas.width / this.canvas.height, 0.5, 100.0);
	
	var triGeo = new KT.Geometry();
	triGeo.addVertice( 1.0, -1.0, 0.0, KT.Color._BLUE);
	triGeo.addVertice( 0.0,  1.0, 0.0, KT.Color._GREEN);
	triGeo.addVertice(-1.0, -1.0, 0.0, KT.Color._RED);
	triGeo.addFace(0, 1, 2);
	triGeo.build();
	
	var material = new KT.Material({shader: KT.shaders.basic});
	
	var mesh = new KT.Mesh(triGeo, material);
	mesh.position.z = -5.0;
	
	scene.add(mesh);
	
	scene.render(camera);
};
