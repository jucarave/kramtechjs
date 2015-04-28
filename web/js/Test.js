function Test(){
	this.canvas = document.getElementById("cnvKramTech");
	this.fps = 1000 / 30;
	
	KT.init(this.canvas);
	
	this.createFrameScene();
	this.createSimpleScene();
	this.loopScene();
}

Test.prototype.createSimpleScene = function(){
	var gl = KT.gl;
	this.scene = new KT.Scene({
		useLighting: true,
		ambientLight: "#333333"
	});
	
	this.camera = new KT.CameraOrtho(2.0, 2.0, 0.1, 400.0);
	this.camera.position.set(0,0,1);
	this.camera.lookAt(new KT.Vector3(0,0,0));
	
	var cameraControls = new KT.OrbitAndPan();
	this.camera.setControls(cameraControls);
	
	var plnGeo = new KT.GeometryPlane(2.0, 2.0);
	var material = new KT.MaterialBasic(this.framebuffer, "#FFFFFF");
	material.drawFaces = 'BOTH';
	var plane = new KT.Mesh(plnGeo, material);
	plane.rotation.x = KT.Math.PI_2;
	this.scene.add(plane);
};

Test.prototype.createFrameScene = function(){
	var gl = KT.gl;
	this.frameScene = new KT.Scene({
		useLighting: true,
		ambientLight: "#333333"
	});
	this.framebuffer = new KT.TextureFramebuffer(512, 512);
	
	this.skybox = [];
	var params = {SWrapping: gl.CLAMP_TO_EDGE, TWrapping: gl.CLAMP_TO_EDGE};
	this.skybox[KT.TEXTURE_FRONT] = new KT.Texture('img/skyboxes/interstellar_skybox/negz.png', params);
	this.skybox[KT.TEXTURE_BACK] = new KT.Texture('img/skyboxes/interstellar_skybox/posz.png', params);
	this.skybox[KT.TEXTURE_RIGHT] = new KT.Texture('img/skyboxes/interstellar_skybox/posx.png', params);
	this.skybox[KT.TEXTURE_LEFT] = new KT.Texture('img/skyboxes/interstellar_skybox/negx.png', params);
	this.skybox[KT.TEXTURE_UP] = new KT.Texture('img/skyboxes/interstellar_skybox/posy.png', params);
	this.skybox[KT.TEXTURE_DOWN] = new KT.Texture('img/skyboxes/interstellar_skybox/negy.png', params);
	
	this.fCamera = new KT.CameraPerspective(KT.Math.degToRad(60), this.canvas.width / this.canvas.height, 0.1, 400.0);
	this.fCamera.position.set(0,5,7);
	this.fCamera.lookAt(new KT.Vector3(0,0,0));
	this.fCamera.setSkybox(400, 400, 400, this.skybox);
	
	var cameraControls = new KT.OrbitAndPan();
	this.fCamera.setControls(cameraControls);
	
	var boxGeo = new KT.GeometryBox(2.0, 2.0, 2.0, {uvRegion: new KT.Vector4(0.0, 0.0, 0.5, 1.0)});
	var texture = new KT.Texture('img/crate.jpg');
	var material = new KT.MaterialPhong(texture, KT.Color._WHITE);
	this.box = new KT.Mesh(boxGeo, material);
	this.box.position.x = 2.0;
	this.frameScene.add(this.box);
	
	
	var sphGeo = new KT.GeometrySphere(1.0, 16, 16);
	var texture = new KT.Texture('img/earth.jpg');
	var material = new KT.MaterialPhong(texture, KT.Color._WHITE);
	material.specularMap = new KT.Texture('img/earth-specular.gif');
	material.shininess = 32.0;
	this.sphere = new KT.Mesh(sphGeo, material);
	this.sphere.position.x = -2.0;
	this.frameScene.add(this.sphere);
	
	var plnGeo = new KT.GeometryPlane(32.0, 32.0, {uvRegion: new KT.Vector4(0.5, 0.0, 1.0, 1.0)});
	var texture = new KT.Texture('img/grassTile01.jpg');
	texture.repeat.set(8.0, 8.0);
	var material = new KT.MaterialPhong(texture, "#FFFFFF");
	this.plane = new KT.Mesh(plnGeo, material);
	this.plane.position.y = -1.5;
	this.frameScene.add(this.plane);
	
	var cylGeo  = new KT.GeometryCylinder(1.0, 1.0, 2.0, 16, 16, false, false, {uvRegion: new KT.Vector4(0.0, 0.0, 0.5, 1.0)});
	var material = new KT.MaterialPhong(null, "#66FF66");
	material.shininess = 32.0;
	this.cylinder = new KT.Mesh(cylGeo, material);
	this.cylinder.position.z = -2.0;
	this.frameScene.add(this.cylinder);
	
	var teapot = new KT.Geometry3DModel('models/teapot.obj');
	var material = new KT.MaterialPhong(null, "#6666FF");
	material.shininess = 32.0;
	this.teapot = new KT.Mesh(teapot, material);
	this.teapot.position.z = 2.0;
	this.frameScene.add(this.teapot);
	
	
	this.createLights();
	
	this.lightAng = 0;
	this.texOff = 0.0;
};

Test.prototype.createLights = function(){
	this.pLight = [];
	
	this.pLight[0] = new KT.LightPoint(new KT.Vector3(0.0, 0.5, 0.0), 1.0, 30.0, KT.Color._RED);
	var sphGeo = new KT.GeometrySphere(0.1, 8, 8);
	var material = new KT.MaterialBasic(null, this.pLight[0].color.getHex());
	var spLight= new KT.Mesh(sphGeo, material);
	spLight.position = this.pLight[0].position;
	this.frameScene.add(spLight);
	this.frameScene.add(this.pLight[0]);
	
	this.pLight[1] = new KT.LightPoint(new KT.Vector3(0.0, 0.0, -1.5), 1.0, 30.0, KT.Color._GREEN);
	var material = new KT.MaterialBasic(null, this.pLight[1].color.getHex());
	var spLight= new KT.Mesh(sphGeo, material);
	spLight.position = this.pLight[1].position;
	this.frameScene.add(spLight);
	this.frameScene.add(this.pLight[1]);
	
	this.pLight[2] = new KT.LightPoint(new KT.Vector3(0.0, 1.5, -1.5), 1.0, 30.0, KT.Color._BLUE);
	var material = new KT.MaterialBasic(null, this.pLight[2].color.getHex());
	var spLight= new KT.Mesh(sphGeo, material);
	spLight.position = this.pLight[2].position;
	this.frameScene.add(spLight);
	this.frameScene.add(this.pLight[2]);
	
	this.pLight[3] = new KT.LightPoint(new KT.Vector3(0.0, 1.5, 0), 1.0, 30.0, KT.Color._PURPLE);
	var material = new KT.MaterialBasic(null, this.pLight[3].color.getHex());
	var spLight= new KT.Mesh(sphGeo, material);
	spLight.position = this.pLight[3].position;
	this.frameScene.add(spLight);
	this.frameScene.add(this.pLight[3]);
	
	this.pLight[4] = new KT.LightPoint(new KT.Vector3(0.0, 1.5, 0), 1.0, 30.0, KT.Color._GOLD);
	var material = new KT.MaterialBasic(null, this.pLight[4].color.getHex());
	var spLight= new KT.Mesh(sphGeo, material);
	spLight.position = this.pLight[4].position;
	this.frameScene.add(spLight);
	this.frameScene.add(this.pLight[4]);
	
	this.frameScene.add(new KT.LightDirectional(new KT.Vector3(-1.0, -1.0, -1.0), KT.Color._WHITE, 0.6));
};

Test.prototype.animateLights = function(){
	this.lightAng += KT.Math.degToRad(1);
	this.pLight[0].position.x = Math.cos(this.lightAng) * 3.5;
	this.pLight[0].position.y = Math.sin(this.lightAng) * 3.5;
	if (this.pLight[0].position.y <= -1.35) this.pLight[0].position.y = -1.35;
	
	this.pLight[1].position.x = Math.cos(this.lightAng) * 3.5;
	this.pLight[1].position.z = Math.sin(this.lightAng) * 3.5;
	
	this.pLight[2].position.z = Math.cos(this.lightAng) * 3.5;
	this.pLight[2].position.y = Math.sin(this.lightAng) * 3.5;
	if (this.pLight[2].position.y <= -1.35) this.pLight[2].position.y = -1.35;
	
	this.pLight[3].position.x = Math.cos(this.lightAng) * 3.5;
	this.pLight[3].position.y = Math.sin(this.lightAng) * 3.5;
	this.pLight[3].position.z = -Math.sin(this.lightAng) * 3.5;
	if (this.pLight[3].position.y <= -1.35) this.pLight[3].position.y = -1.35;
	
	this.pLight[4].position.x = -Math.cos(this.lightAng) * 3.5;
	this.pLight[4].position.y = Math.sin(this.lightAng) * 3.5;
	this.pLight[4].position.z = Math.sin(this.lightAng) * 3.5;
	if (this.pLight[4].position.y <= -1.35) this.pLight[4].position.y = -1.35;
};

Test.prototype.loopScene = function(){
	var T = this;
	
	if (KT.Input.isKeyDown(KT.Input.vKey.A)){
		this.camera.locked = true;
		this.fCamera.locked = false;
	}else{
		this.camera.locked = false;
		this.fCamera.locked = true;
	}
	
	this.animateLights();
	
	this.texOff += 0.001;
	if (this.texOff >= 1.0) this.texOff = 0.0;
	
	T.box.material.textureMap.offset.set(this.texOff, 0.0);
	T.box.rotation.x += KT.Math.degToRad(0.25);
	T.box.rotation.y += KT.Math.degToRad(0.25);
	
	T.sphere.rotation.x += KT.Math.degToRad(0.25);
	T.sphere.rotation.y += KT.Math.degToRad(0.25);
	
	T.cylinder.rotation.x += KT.Math.degToRad(0.25);
	T.cylinder.rotation.y += KT.Math.degToRad(0.25);
	
	T.frameScene.renderToFramebuffer(T.fCamera, T.framebuffer);
	T.scene.render(T.camera);
	
	setTimeout(function(){ T.loopScene(); }, T.fps);
};

var test;
KT.Utils.addEvent(window, "load", function(){
	test = new Test();
});
