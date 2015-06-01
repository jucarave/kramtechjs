function Test(){
	this.canvas = document.getElementById("cnvKramTech");
	this.fps = 1000 / 30;
	
	var params = {
		//shadowMapping: false,
		//specularLight: false,
		limitFPS: this.fps
	};
	
	KT.init(this.canvas, params);
	KT.Input.useLockPointer = true;
	
	this.font = new KT.TextureFont('img/fonts/arial_32.png', 32, 32, ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~');
	this.waitFont();
	this.fillScreen();
}

Test.prototype.waitFont = function(){
	var T = this;
	if (this.font.image.ready){
		this.createFrameScene();
		this.createSimpleScene();
		
		KT.setLoopMethod(function(){ T.loopScene(); });
	}else{
		setTimeout(function(){ T.waitFont(); }, this.fps);
	}
};

Test.prototype.fillScreen = function(){
	this.innerAspect = this.canvas.width / this.canvas.height;
	this.outerAspect = window.innerWidth / window.innerHeight;
	
	this.canvas.style.position = "absolute";
	this.canvas.style.margin = "auto";
	this.canvas.style.imageRendering = 'pixelated';
	 
	if (this.outerAspect < this.innerAspect){
		this.canvas.style.width = "100%";
		this.canvas.style.height = "auto";
		this.canvas.style.left = "";
		this.canvas.style.right = "";
	}else{
		this.canvas.style.width = "auto";
		this.canvas.style.height = "100%";
		this.canvas.style.left = "0";
		this.canvas.style.right = "0";
	}
};

Test.prototype.createSimpleScene = function(){
	var gl = KT.gl;
	this.scene = new KT.Scene();
	
	this.camera = new KT.CameraOrtho(this.canvas.width, this.canvas.height, 0.1, 0.2);
	this.camera.position.set(this.canvas.width / 2,this.canvas.height / 2,0.1);
	this.camera.lookAt(new KT.Vector3(this.canvas.width / 2,this.canvas.height / 2,0.0));
	
	var textGeo = new KT.GeometryText(this.font, 'FPS: 30', 32, KT.TEXT_ALIGN_LEFT, "#FFFFFF");
	var material = new KT.MaterialBasic(this.font, "#FFFFFF");
	material.transparent = true;
	this.fpsCounter = new KT.Mesh(textGeo, material);
	this.fpsCounter.position.set(4.0, this.canvas.height - 34.0, 0.0);
	this.scene.add(this.fpsCounter);
};

Test.prototype.createFrameScene = function(){
	var gl = KT.gl;
	this.frameScene = new KT.Scene({
		useLighting: true,
		ambientLight: "#333333"
	});
	
	var bp = 'img/skyboxes/interstellar_skybox/';
	this.skybox = new KT.TextureCube(bp + 'posx.png', bp + 'negx.png',  bp + 'posy.png',  bp + 'negy.png',  bp + 'posz.png',  bp + 'negz.png');
	
	this.fCamera = new KT.CameraPerspective(KT.Math.degToRad(60), this.canvas.width / this.canvas.height, 0.1, 400.0);
	this.fCamera.position.set(0,5,7);
	this.fCamera.lookAt(new KT.Vector3(0,0,0));
	this.fCamera.setSkybox(this.skybox);
	
	var cameraControls = new KT.CameraFly();
	this.fCamera.setControls(cameraControls);
	
	var boxGeo = new KT.GeometryBox(2.0, 2.0, 2.0, {uvRegion: new KT.Vector4(0.0, 0.0, 0.5, 1.0)});
	var texture = new KT.Texture('img/crate.jpg');
	var material = new KT.MaterialPhong(texture, KT.Color._WHITE);
	this.box = new KT.Mesh(boxGeo, material);
	this.box.position.x = 2.0;
	this.box.castShadow = true;
	this.box.receiveShadow = true;
	this.frameScene.add(this.box);
	
	var billGeo = new KT.GeometryBillboard(2.0, 2.0, {uvRegion: new KT.Vector4(0.5, 0.0, 1.0, 1.0), spherical: false});
	var texture = new KT.Texture('img/crate.jpg');
	var material = new KT.MaterialBasic(texture, KT.Color._WHITE);
	this.billboard = new KT.Mesh(billGeo, material);
	this.billboard.position.y = 2.0;
	//this.frameScene.add(this.billboard);
	
	
	var sphGeo = new KT.GeometrySphere(1.0, 16, 16);
	var texture = new KT.Texture('img/earth.jpg');
	var material = new KT.MaterialPhong(texture, KT.Color._WHITE);
	material.specularMap = new KT.Texture('img/earth-specular.gif');
	material.shininess = 32.0;
	this.sphere = new KT.Mesh(sphGeo, material);
	this.sphere.position.x = -2.0;
	this.sphere.castShadow = true;
	this.sphere.receiveShadow = true;
	this.frameScene.add(this.sphere);
	
	var plnGeo = new KT.GeometryPlane(32.0, 32.0, {uvRegion: new KT.Vector4(0.5, 0.0, 1.0, 1.0)});
	var material = new KT.MaterialPhong(null, "#FFFFFF");
	this.plane = new KT.Mesh(plnGeo, material);
	this.plane.position.y = -1.5;
	this.plane.receiveShadow = true;
	this.frameScene.add(this.plane);
	
	var cylGeo  = new KT.GeometryCylinder(1.0, 1.0, 2.0, 16, 16, false, false, {uvRegion: new KT.Vector4(0.0, 0.0, 0.5, 1.0)});
	var material = new KT.MaterialPhong(new KT.Texture({width: 1, height: 1, data: new Uint8Array([255, 0, 0, 255])}), "#FFFFFF");
	material.shininess = 32.0;
	this.cylinder = new KT.Mesh(cylGeo, material);
	this.cylinder.position.z = -2.0;
	this.cylinder.castShadow = true;
	this.cylinder.receiveShadow = true;
	this.frameScene.add(this.cylinder);
	
	var teapot = new KT.Geometry3DModel('models/teapot.obj');
	var material = new KT.MaterialPhong(null, "#6666FF");
	material.shininess = 32.0;
	material.drawFaces = 'BOTH';
	this.teapot = new KT.Mesh(teapot, material);
	this.teapot.position.z = 2.0;
	this.teapot.castShadow = true;
	this.teapot.receiveShadow = true;
	this.frameScene.add(this.teapot);
	
	var textGeo = new KT.GeometryText(this.font, 'Testing this font, it worked!', 2, KT.TEXT_ALIGN_CENTER, "#FFFFFF");
	var material = new KT.MaterialBasic(this.font, "#FFFFFF");
	material.transparent = true;
	material.drawFaces = 'BOTH';
	this.text = new KT.Mesh(textGeo, material);
	this.text.position.set(0.0, 3.0, -3.0);
	this.frameScene.add(this.text);
	
	
	this.createLights();
	
	this.lightAng = 0;
	this.texOff = 0.0;
};

Test.prototype.createLights = function(){
	this.pLight = [];

	this.pLight[0] = new KT.LightSpot(new KT.Vector3(0.0, 5.0, -4.0), new KT.Vector3(0.0, 0.0, 0.0), KT.Math.degToRad(20.0), KT.Math.degToRad(40.0), 1.0, 30.0, KT.Color._WHITE);
	this.pLight[0].setCastShadow(true);
	this.frameScene.add(this.pLight[0]);
	
	this.pLight[1] = new KT.LightDirectional(new KT.Vector3(-1.0, -1.0, -1.0), KT.Color._WHITE, 0.6);
	this.pLight[1].shadowCamWidth = 10;
	this.pLight[1].shadowCamHeight = 10;
	this.pLight[1].setCastShadow(true);
	this.frameScene.add(this.pLight[1]);
};

var count  = 0;
Test.prototype.loopScene = function(){
	var T = this;
	
	this.texOff += 0.001;
	if (this.texOff >= 1.0) this.texOff = 0.0;
	
	T.box.material.textureMap.offset.set(this.texOff, 0.0);
	T.box.rotation.x += KT.Math.degToRad(0.25);
	T.box.rotation.y += KT.Math.degToRad(0.25);
	
	T.sphere.rotation.x += KT.Math.degToRad(0.25);
	T.sphere.rotation.y += KT.Math.degToRad(0.25);
	
	T.cylinder.rotation.x += KT.Math.degToRad(0.25);
	T.cylinder.rotation.y += KT.Math.degToRad(0.25);
	
	T.teapot.rotation.y += KT.Math.degToRad(0.25);
	
	T.frameScene.clear();
	T.frameScene.render(T.fCamera);
	T.scene.render(T.camera, true);
	
	this.fpsCounter.geometry.text = 'FPS: ' + KT.clock.fps;
};

var test;
KT.Utils.addEvent(window, "load", function(){
	test = new Test();
	
	KT.Utils.addEvent(window, "resize", function(){
		test.fillScreen();
	});
});
