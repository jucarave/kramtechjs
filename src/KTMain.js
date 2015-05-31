var Clock = require('./KTClock');
var Shaders = require('./KTShaders');
var Input = require('./KTInput');
var Matrix4 = require('./KTMatrix4');
var Utils = require('./KTUtils');

var KT = {
	TEXT_ALIGN_LEFT: 0,
	TEXT_ALIGN_CENTER: 1,
	TEXT_ALIGN_RIGHT: 2,
	
	init: function(canvas, params){
		this.canvas = canvas;
		this.gl = null;
		this.shaders = {};
		this.images = [];
		this.maxAttribLocations = 0;
		this.lastProgram = null;
		
		this.__initModules(params);
		this.__initContext(canvas);
		this.__initProperties();
		this.__initShaders();
		this.__initParams();
		
		this.clock = new Clock();
		this.looping = true;
		
		Input.init(canvas);
	},
	
	__initContext: function(canvas){
		this.gl = canvas.getContext('experimental-webgl');
		
		if (!this.gl){
			alert("Your browser doesn't support WebGL");
			return false;
		}
		
		this.gl.width = canvas.width;
		this.gl.height = canvas.height;
	},
	
	__initProperties: function(){
		var gl = this.gl;
		
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		
		gl.enable(gl.CULL_FACE);
		
		gl.disable( gl.BLEND );
		gl.blendEquation( gl.FUNC_ADD );
		gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
	},
	
	__initShaders: function(){
		this.shaders = {};
		this.shaders.basic = this.processShader(Shaders.basic);
		this.shaders.lambert = this.processShader(Shaders.lambert);
		this.shaders.phong = this.processShader(Shaders.phong);
		this.shaders.skybox = this.processShader(Shaders.skybox);
		
		if (this.modules.shadowMapping)
			this.shaders.depth = this.processShader(Shaders.depthMap);
	},
	
	__initParams: function(){
		this.lightNDCMat = new Matrix4(
			0.5, 0.0, 0.0, 0.5,
			0.0, 0.5, 0.0, 0.5,
			0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 1.0
		);
	},
	
	__initModules: function(params){
		if (!params) params = {};
		
		this.modules = {
			specularLight: (params.specularLight !== undefined)? params.specularLight : true,
			shadowMapping: (params.shadowMapping !== undefined)? params.shadowMapping : true
		};
		
		this.fps = (params.limitFPS)? params.limitFPS : 1000 / 60;
	},
	
	createArrayBuffer: function(type, dataArray, itemSize){
		var gl = this.gl;
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl[type], buffer);
		gl.bufferData(gl[type], dataArray, gl.STATIC_DRAW);
		buffer.numItems = dataArray.length;
		buffer.itemSize = itemSize;
		
		return buffer;
	},
	
	getShaderAttributesAndUniforms: function(vertex, fragment){
		var attributes = [];
		var uniforms = [];
		var uniformsNames = [];
		
		var structs = [];
		var uniformsArrays = [];
		var st = null;
		for (var i=0;i<vertex.length;i++){
			var line = vertex[i].trim();
			
			if (line.indexOf("attribute ") == 0){
				st = null;
				var p = line.split(/ /g);
				var name = p[p.length - 1].trim();
				if (attributes.indexOf(name) == -1)
					attributes.push({name: name});
			}else if (line.indexOf("uniform ") == 0){
				st = null;
				if (line.indexOf("[") != -1){
					uniformsArrays.push(line);
					continue;
				}
				
				var p = line.split(/ /g);
				var name = p[p.length - 1].trim();
				if (uniformsNames.indexOf(name) == -1){
					uniforms.push({name: name});
					uniformsNames.push(name);
				}
			}else if (line.indexOf("struct") == 0){
				st = { name: line.replace("struct ", ""), data: [] };
				structs.push(st);
			}else if (st != null){
				if (line.trim() == "") continue;
				var p = line.split(/ /g);
				var name = p[p.length -1].trim();
				st.data.push(name);
			}
		}
		
		for (var i=0;i<fragment.length;i++){
			var line = fragment[i].trim();
			
			if (line.indexOf("attribute ") == 0){
				st = null;
				var p = line.split(/ /g);
				var name = p[p.length - 1].trim();
				if (attributes.indexOf(name) == -1)
					attributes.push({name: name});
			}else if (line.indexOf("uniform ") == 0){
				st = null;
				if (line.indexOf("[") != -1){
					uniformsArrays.push(line);
					continue;
				}
				
				var p = line.split(/ /g);
				var name = p[p.length - 1].trim();
				if (uniformsNames.indexOf(name) == -1){
					uniforms.push({name: name});
					uniformsNames.push(name);
				}
			}else if (line.indexOf("struct") != -1){
				st = { name: line.replace("struct ", ""), data: [] };
				structs.push(st);
			}else if (st != null){
				if (line.trim() == "") continue;
				var p = line.split(/ /g);
				var name = p[p.length -1].trim();
				st.data.push(name);
			}
		}
		
		for (var i=0,len=uniformsArrays.length;i<len;i++){
			var line = uniformsArrays[i];
			var p = line.split(/ /g);
			var type = p[p.length - 2].trim();
			var name = p[p.length - 1].trim();
			var uniLen = parseInt(name.substring(name.indexOf("[") + 1, name.indexOf("]")), 10);
			var name = name.substring(0, name.indexOf("["));
			
			var str = null;
			for (var j=0,jlen=structs.length;j<jlen;j++){
				if (structs[j].name == type){
					str = structs[j];
					j = jlen;
				}
			}
			
			if (str){
				var structUni = [];
				for (var j=0;j<uniLen;j++){
					structUni[j] = ({name: name, len: uniLen, data: []});
					for (var k=0,klen=str.data.length;k<klen;k++){
						var prop = str.data[k];
						
						structUni[j].data.push({
							name: prop,
							locName: name + "[" + j + "]." + prop
						});
					}
				}
				
				if (uniformsNames.indexOf(name) == -1){
					uniforms.push({
						multi: true,
						data: structUni,
						type: type
					});
					uniformsNames.push(name);
				}
			}else{
				for (var j=0;j<uniLen;j++){
					if (uniformsNames.indexOf(name + "[" + j + "]") == -1){
						uniforms.push({name: name + "[" + j + "]", type: name });
						uniformsNames.push(name);
					}
				}
			}
		}
		
		return {
			attributes: attributes,
			uniforms: uniforms
		};
	},
	
	precompileShader: function(shaderCode){
		var modulars = Shaders.modulars;
		
		var ret = shaderCode;
		
		var sl = (this.modules.specularLight);
		ret = ret.replace("#kt_require(specular_in)", (sl)? modulars.specular_in : '');
		ret = ret.replace("#kt_require(specular_main)", (sl)? modulars.specular_main : '');
		
		var sm = (this.modules.shadowMapping);
		ret = ret.replace("#kt_require(shadowmap_vert_in)", (sm)? modulars.shadowmap_vert_in : '');
		ret = ret.replace("#kt_require(shadowmap_vert_main)", (sm)? modulars.shadowmap_vert_main : '');
		ret = ret.replace("#kt_require(shadowmap_frag_in)", (sm)? modulars.shadowmap_frag_in : '');
		ret = ret.replace("#kt_require(shadowmap_frag_main)", (sm)? modulars.shadowmap_frag_main : '');
		
		return ret;
	},
	
	processShader: function(shader){
		var gl = this.gl;
		
		var vCode = this.precompileShader(shader.vertexShader);
		var vShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vShader, vCode);
		gl.compileShader(vShader);
		
		var fCode = this.precompileShader(shader.fragmentShader);
		var fShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fShader, fCode);
		gl.compileShader(fShader);
		
		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vShader);
		gl.attachShader(shaderProgram, fShader);
		gl.linkProgram(shaderProgram);
		
		var params = this.getShaderAttributesAndUniforms(vCode.split(/[;{}]+/), fCode.split(/[;{}]+/));
		
		if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)){
			console.log(gl.getShaderInfoLog(vShader));
			throw "Error compiling vertex shader";
		}
		
		if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)){
			console.log(gl.getShaderInfoLog(fShader));
			throw "Error compiling fragment shader";
		}
		
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
			console.log(gl.getProgramInfoLog(shaderProgram));
			throw "Error initializing the shader program";
		}
		
		var attributes = [];
		this.maxAttribLocations = Math.max(this.maxAttribLocations, params.attributes.length);
		for (var i=0,len=params.attributes.length;i<len;i++){
			var att = params.attributes[i];
			var location = gl.getAttribLocation(shaderProgram, att.name);
			
			gl.enableVertexAttribArray(location);
			
			attributes.push({
				name: att.name,
				location: location
			});
		}
		
		var uniforms = [];
		for (var i=0,len=params.uniforms.length;i<len;i++){
			var uni = params.uniforms[i];
			if (uni.multi){
				for (var j=0,jlen=uni.data.length;j<jlen;j++){
					var uniD = uni.data[j];
					for (var k=0,klen=uniD.data.length;k<klen;k++){
						var dat = uniD.data[k];
						dat.location = gl.getUniformLocation(shaderProgram, dat.locName);
					}
				}
				
				uniforms.push(uni);
			}else{
				var location = gl.getUniformLocation(shaderProgram, uni.name);
			
				uniforms.push({
					name: uni.name,
					location: location,
					type: (uni.type)? uni.type : uni.name
				});
			}
		}
		
		return {
			shaderProgram: shaderProgram,
			attributes: attributes,
			uniforms: uniforms
		};
	},
	
	switchProgram: function(shader){
		if (this.lastProgram === shader) return;
		var gl = this.gl;
		
		this.lastProgram = shader;
		gl.useProgram(shader.shaderProgram);
		
		for (var i=0;i<this.maxAttribLocations;i++){
			if (i < shader.attributes.length){
				gl.enableVertexAttribArray(i);
			}else{
				gl.disableVertexAttribArray(i);
			}
		}
	},
	
	loadImage: function(src, onLoad){
		var img = this.getImage(src);
		if (img){
			if (img.ready){
				onLoad(img);
			}else{
				img.callers.push(onLoad);
			}
			
			return img;
		}
		
		var image = new Image();
		image.src = src;
		image.ready = false;
		image.callers = [onLoad];
		this.images.push({src: src, img: image});
		
		Utils.addEvent(image, "load", function(){
			image.ready = true;
			for (var i=0,len=image.callers.length;i<len;i++){
				image.callers[i](image);
			}
			
			image.callers = null;
		});
		
		return image;
	},
	
	getImage: function(src){
		for (var i=0,len=this.images.length;i<len;i++){
			if (this.images[i].src == src)
				return this.images[i].img;
		}
		
		return null;
	},
	
	setLoopMethod: function(callback){
		var delta = this.clock.getDelta();
		if (delta > this.fps){
			this.clock.update(this.fps);
			callback();
		}
		
		if (!this.looping){
			this.looping = true; 
			return;
		}
		
		var T  = this;
		requestAnimFrame(function(){ T.setLoopMethod(callback); });
	},
	
	stopLoopMethod: function(){
		this.looping = false;
	}
};

module.exports = KT;
var requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, KT.fps);
          };
})();