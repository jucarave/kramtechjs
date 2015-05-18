var structs = {
	Light: "struct Light{ " +
	    "lowp vec3 position; " +
	    "lowp vec3 color; " +
	    "lowp vec3 direction; " +
	    "lowp vec3 spotDirection; " +
	    "lowp float intensity; " +
	    "lowp float innerAngle; " +
	    "lowp float outerAngle; " +
	    "lowp float shadowStrength; " +
	    "lowp float lightMult; " + 
	    "bool castShadow; " +
	    "mediump mat4 mvProjection; " +
	"}; "
};

var functions = {
	calcShadowFactor : "lowp float calcShadowFactor(sampler2D shadowMap, mediump vec4 lightSpacePos, lowp float shadowStrength, lowp float lightMult){ " +
		"if (!uReceiveShadow) " +
			"return 1.0; " +
	    "mediump vec3 projCoords = lightSpacePos.xyz / lightSpacePos.w; " +
	    "mediump vec2 UVCoords; " +
	    "UVCoords.x = projCoords.x; " +
	    "UVCoords.y = projCoords.y; " +
	    "projCoords.z *= lightMult; " +
	    
	    "bvec4 inTexture = bvec4(UVCoords.x >= 0.0, UVCoords.y >= 0.0, UVCoords.x < 1.0, UVCoords.y < 1.0); " +
	    "if (!all(inTexture)) " +
	    	"return 1.0; " +
	    
	    "mediump float z = (1.0 - projCoords.z) * 15.0; " +
	    "if (lightMult == 1.0) z = 1.0 - z; " +
	    "z = min(z, 1.0); " +
			    	
	    "mediump vec4 texCoord = texture2D(shadowMap, UVCoords);" +
	    "mediump float depth = texCoord.x; " +
	    	
	    "if (depth < (z - 0.005)) " +
	        "return shadowStrength; " + 
	    "return 1.0; " +
	"} ",
	
	setLightPosition: "void setLightPosition(int index, mediump vec4 position){ " +
		"if (index == 0){ vLightPosition[0] = position; return; }" +
		"if (index == 1){ vLightPosition[1] = position; return; }" +
		"if (index == 2){ vLightPosition[2] = position; return; }" +
		"if (index == 3){ vLightPosition[3] = position; return; }" +
	"} ",
	
	getLightPosition: "mediump vec4 getLightPosition(int index){ " +
		"if (index == 0){ return vLightPosition[0]; }" +
		"if (index == 1){ return vLightPosition[1]; }" +
		"if (index == 2){ return vLightPosition[2]; }" +
		"if (index == 3){ return vLightPosition[3]; }" +
		"return vec4(0.0); " +
	"} ",
	
	getLightWeight: "mediump vec3 getLightWeight(mediump vec3 normal, mediump vec3 direction, lowp vec3 color, lowp float intensity){ " +
		"mediump float lightDot = max(dot(normal, direction), 0.0); " +
		"mediump vec3 lightWeight = (color * lightDot * intensity); " +
		"return lightWeight; " +
	"}"
};

module.exports = {
	basic: {
		vertexShader: 
			"attribute mediump vec2 aTextureCoord; " +
			"attribute mediump vec3 aVertexPosition; " +
			"attribute lowp vec4 aVertexColor; " +
			
			"uniform mediump mat4 uMVPMatrix; " +
			"uniform lowp vec4 uMaterialColor; " +
			
			"varying mediump vec4 vVertexColor; " +
			"varying mediump vec2 vTextureCoord;" +  
			
			"void main(void){ " + 
				"gl_Position = uMVPMatrix * vec4(aVertexPosition, 1.0); " +
			
				"vVertexColor = aVertexColor * uMaterialColor; " +
				"vTextureCoord = aTextureCoord; " + 
			"} " ,
			
		fragmentShader: 
			"uniform sampler2D uTextureSampler; " +
			"uniform bool uHasTexture; " +
			"uniform lowp vec2 uTextureRepeat; " +
			"uniform lowp vec2 uTextureOffset; " +
			"uniform mediump vec4 uGeometryUV; " +
			
			"varying mediump vec2 vTextureCoord; " + 
			"varying mediump vec4 vVertexColor; " + 
			
			"void main(void){ " +
				"mediump vec4 color = vVertexColor; " + 
				"if (uHasTexture){ " + 
					"mediump float tx = uGeometryUV.x + mod(uTextureOffset.x + vTextureCoord.s * uTextureRepeat.x - uGeometryUV.x, uGeometryUV.z - uGeometryUV.x);" +
					"mediump float ty = uGeometryUV.y + mod(uTextureOffset.y + vTextureCoord.t * uTextureRepeat.y - uGeometryUV.y, uGeometryUV.w - uGeometryUV.y);" +
					
					"mediump vec4 texColor = texture2D(uTextureSampler, vec2(tx, ty)); " +
					"color *= texColor; " +
				"} " + 
				
				"gl_FragColor = color;" + 
			"}"
	},
	
	
	lambert: {
		vertexShader: 
			structs.Light +
			    
			"attribute mediump vec2 aTextureCoord; " +
			"attribute mediump vec3 aVertexPosition; " +
			"attribute lowp vec4 aVertexColor; " +
			"attribute mediump vec3 aVertexNormal; " + 
			
			"uniform mediump mat4 uMVMatrix; " +
			"uniform mediump mat4 uPMatrix; " +
			"uniform lowp vec4 uMaterialColor; " +
			"uniform mediump mat4 uModelMatrix; " +
			"uniform mediump mat3 uNormalMatrix; " +
			"uniform lowp vec3 uAmbientLightColor; " +
			
			"uniform Light uLights[8]; " +
			"uniform lowp int uUsedLights; " +
			"uniform bool uReceiveShadow; " +
			"uniform bool uUseLighting; " +
			
			"varying mediump vec4 vVertexColor; " +
			"varying mediump vec2 vTextureCoord;" +  
			"varying mediump vec3 vLightWeight; " + 
			"varying mediump vec4 vLightPosition[4]; " +
			
			functions.getLightWeight + 
			
			functions.setLightPosition +
			
			"void main(void){ " + 
				"vec4 modelViewPosition = uMVMatrix * vec4(aVertexPosition, 1.0); " +
				"gl_Position = uPMatrix * modelViewPosition; " +
			
				"vLightWeight = uAmbientLightColor; " +
				"if (uUseLighting){ " +
					"vec3 vertexModelPosition = (uModelMatrix * vec4(aVertexPosition, 1.0)).xyz; " +
					"lowp int shadowIndex = 0; " +
					"for (int i=0;i<8;i++){ " +
						"if (i >= uUsedLights){" +
							"break; " +
						"}" +
						
						"Light l = uLights[i]; " +
						"mediump vec3 lPos = l.position - vertexModelPosition;" +
						"mediump float lDistance = length(lPos) / 2.0; " +
						"if (length(l.position) == 0.0){ " +
							"lDistance = 1.0; " +
							"lPos = vec3(0.0); " +
						"} " +
						
						"mediump vec3 lightDirection = l.direction + normalize(lPos); " +
						
						"lowp float spotWeight = 1.0; " +
			            "if (length(l.spotDirection) != 0.0){ " +
			                "lowp float cosAngle = dot(l.spotDirection, lightDirection); " +
			            	"spotWeight = clamp((cosAngle - l.outerAngle) / (l.innerAngle - l.outerAngle), 0.0, 1.0); " +
			                "lDistance = 1.0; " +
			            "} " +
			            
						"vLightWeight += getLightWeight(aVertexNormal, lightDirection, l.color, l.intensity) * spotWeight / lDistance; " + 
						
						"if (l.castShadow && uReceiveShadow){ " +
							"mediump vec4 lightProj = l.mvProjection * vec4(aVertexPosition, 1.0); " +
							"setLightPosition(shadowIndex++, lightProj); " +
						"} " +
					"} " +
				"} " +
				 
				"vVertexColor = aVertexColor * uMaterialColor; " +
				"vTextureCoord = aTextureCoord; " +  
			"} " ,
			
		fragmentShader:
			structs.Light +
			
			"uniform bool uUseLighting; " +
			"uniform bool uReceiveShadow; " +
			"uniform lowp int uUsedLights; " +
			"uniform Light uLights[8]; " +
		    "uniform sampler2D uShadowMaps[8]; " +
		     
			"uniform sampler2D uTextureSampler; " +
			"uniform bool uHasTexture; " +
			"uniform lowp float uOpacity; " +
			"uniform lowp vec2 uTextureRepeat; " +
			"uniform lowp vec2 uTextureOffset; " +
			"uniform mediump vec4 uGeometryUV; " +
			
			"varying mediump vec2 vTextureCoord; " + 
			"varying mediump vec4 vVertexColor; " + 
			"varying mediump vec3 vLightWeight; " + 
			"varying mediump vec4 vLightPosition[4]; " +
			
			functions.calcShadowFactor + 
			functions.getLightPosition +
			
			"void main(void){ " +
				"mediump vec4 color = vVertexColor; " + 
				"if (uHasTexture){ " + 
					"mediump float tx = uGeometryUV.x + mod(uTextureOffset.x + vTextureCoord.s * uTextureRepeat.x - uGeometryUV.x, uGeometryUV.z - uGeometryUV.x);" +
					"mediump float ty = uGeometryUV.y + mod(uTextureOffset.y + vTextureCoord.t * uTextureRepeat.y - uGeometryUV.y, uGeometryUV.w - uGeometryUV.y);" +
					
					"mediump vec4 texColor = texture2D(uTextureSampler, vec2(tx, ty)); " +
					"color *= texColor; " +
				"} " + 
				
				"mediump vec3 lightWeight = vLightWeight; " +
				"if (uUseLighting){ " +
					"lowp int shadowIndex = 0; " +
					"for (int i=0;i<8;i++){ " +
						"if (i >= uUsedLights){" +
							"break; " +
						"}" +
						
						"lowp float shadowWeight = 1.0; " +
			            "if (uLights[i].castShadow)" +
			            	"shadowWeight = calcShadowFactor(uShadowMaps[i], getLightPosition(shadowIndex++), uLights[i].shadowStrength, uLights[i].lightMult); " +
			            "lightWeight *= shadowWeight; " +
					"} " + 
				"} " +
				
				"color.rgb *= lightWeight; " + 
				"gl_FragColor = vec4(color.rgb, color.a * uOpacity); " + 
			"}"
	},
	
	
	phong: {
		vertexShader:
			structs.Light + 
			 
			"attribute mediump vec2 aTextureCoord; " +
			"attribute mediump vec3 aVertexPosition; " +
			"attribute lowp vec4 aVertexColor; " +
			"attribute mediump vec3 aVertexNormal; " + 
			
			"uniform mediump mat4 uMVMatrix; " +
			"uniform mediump mat4 uPMatrix; " +
			"uniform mediump mat4 uModelMatrix; " +
			"uniform mediump mat3 uNormalMatrix; " +
			"uniform lowp vec4 uMaterialColor; " +
			"uniform lowp vec3 uAmbientLightColor; " +
			
			"uniform bool uUseLighting; " +
			"uniform bool uReceiveShadow; " +
			"uniform lowp int uUsedLights; " +
			"uniform Light uLights[8]; " +
			
			"varying mediump vec4 vVertexColor; " +
			"varying mediump vec2 vTextureCoord;" +  
			"varying mediump vec3 vLightWeight; " +
			"varying mediump vec3 vNormal; " + 
			"varying mediump vec3 vPosition; " +
			"varying mediump vec4 vLightPosition[4]; " +
			
			functions.setLightPosition +
			
			"void main(void){ " + 
				"vec4 modelViewPosition = uMVMatrix * vec4(aVertexPosition, 1.0); " +
				"gl_Position = uPMatrix * modelViewPosition; " +
			
				"if (uUseLighting){ " + 
					"vNormal = uNormalMatrix * aVertexNormal; " +
					"vLightWeight = uAmbientLightColor; " +
					
					"int shadowIndex = 0; " +
					"for (int i=0;i<8;i++){ " +
						"if (i >= uUsedLights) break; " +
						
						"if (uLights[i].castShadow && uReceiveShadow){ " +
							"mediump vec4 lightProj = uLights[i].mvProjection * vec4(aVertexPosition, 1.0); " +
							"setLightPosition(shadowIndex++, lightProj); " +
						"} " +
					"} " +
				"}else{ " +
					"vLightWeight = vec3(1.0); " + 
				"}" +   
				 
				"vPosition = (uModelMatrix * vec4(aVertexPosition, 1.0)).xyz; " +
				"vVertexColor = aVertexColor * uMaterialColor; " +
				"vTextureCoord = aTextureCoord; " +  
			"} " ,
			
		fragmentShader: 
			structs.Light + 
			
			"uniform bool uUseLighting; " +
			"uniform bool uReceiveShadow; " +
			"uniform lowp int uUsedLights; " +
			"uniform Light uLights[8]; " +
			
			"uniform bool uHasTexture; " +
			"uniform sampler2D uTextureSampler; " +
			
			"uniform lowp float uOpacity; " +
			"uniform lowp vec2 uTextureRepeat; " +
			"uniform lowp vec2 uTextureOffset; " +
			"uniform lowp float uShininess; " +
			"uniform mediump vec4 uGeometryUV; " +
			
			"uniform mediump vec3 uCameraPosition; " +
			
			"varying mediump vec2 vTextureCoord; " + 
			"varying mediump vec4 vVertexColor; " + 
			"varying mediump vec3 vLightWeight; " + 
			"varying mediump vec3 vNormal; " + 
			"varying mediump vec3 vPosition; " +
			"varying mediump vec4 vLightPosition[4]; " +

			"#kt_require(specular_in) " +
			"#kt_require(shadowmap_in) " +			
			functions.getLightWeight + 
			
			"void main(void){ " +
				"mediump vec4 color = vVertexColor; " +
				"mediump vec3 normal = normalize(vNormal); " +
				"mediump vec3 cameraDirection = normalize(uCameraPosition); " +
				
				"mediump float tx; " +
				"mediump float ty; " +
				
				"if (uHasTexture){ " + 
					"tx = uGeometryUV.x + mod(uTextureOffset.x + vTextureCoord.s * uTextureRepeat.x - uGeometryUV.x, uGeometryUV.z - uGeometryUV.x);" +
					"ty = uGeometryUV.y + mod(uTextureOffset.y + vTextureCoord.t * uTextureRepeat.y - uGeometryUV.y, uGeometryUV.w - uGeometryUV.y);" +
					
					"mediump vec4 texColor = texture2D(uTextureSampler, vec2(tx, ty)); " +
					"color *= texColor; " +
				"} " + 
				
				"mediump vec3 phongLightWeight = vec3(0.0); " + 
				"if (uUseLighting){ " +
					"int shadowIndex = 0; " +
					"for (int i=0;i<8;i++){ " +
						"if (i >= uUsedLights) break; " +
						
						"Light l = uLights[i]; " +
						"mediump vec3 lPos = l.position - vPosition;" +
						"mediump float lDistance = length(lPos) / 2.0; " +
						"if (length(l.position) == 0.0){ " +
							"lDistance = 1.0; " +
							"lPos = vec3(0.0); " +
						"} " +
						
						"mediump vec3 lightDirection = l.direction + normalize(lPos); " +
						
						"lowp float spotWeight = 1.0; " +
			            "if (length(l.spotDirection) != 0.0){ " +
			                "lowp float cosAngle = dot(l.spotDirection, lightDirection); " +
			            	"spotWeight = clamp((cosAngle - l.outerAngle) / (l.innerAngle - l.outerAngle), 0.0, 1.0); " +
			                "lDistance = 1.0; " +
			            "} " +
			            
			            "lowp float shadowWeight = 1.0; " +
			            "mediump vec3 lWeight = getLightWeight(normal, lightDirection, l.color, l.intensity); " +
			            
			            "#kt_require(shadowmap_main) " +
			            
						"phongLightWeight += shadowWeight * lWeight * spotWeight / lDistance; " + 
						
						"if (shadowWeight == 1.0){ " +
							"#kt_require(specular_main) " +
						"}" + 
					"} " +
				"} " +
				
				"color.rgb *= vLightWeight + phongLightWeight; " + 
				"gl_FragColor = vec4(color.rgb, color.a * uOpacity); " + 
			"}"
	},
	
	depthMap: {
		vertexShader: 
			"attribute mediump vec3 aVertexPosition; " +
			
			"uniform mediump mat4 uMVPMatrix; " +
			
			"varying mediump vec4 vVertexDepth; " + 
			
			"void main(void){ " + 
				"gl_Position = uMVPMatrix * vec4(aVertexPosition, 1.0); " +
				"vVertexDepth = gl_Position; " +
			"} ",
			
		fragmentShader:
			"uniform lowp float uDepthMult; " +
			
			"varying mediump vec4 vVertexDepth; " +  
			
			"void main(void){ " +
				"lowp float depth = uDepthMult * vVertexDepth.z / vVertexDepth.w; " +
			    "depth =  (1.0 - depth) * 15.0; " +
			    
			    "if (uDepthMult == 1.0) " +
			    	"depth = 1.0 - depth; " +
			    
			    "gl_FragColor = vec4(depth, depth, depth, 1.0); " +
			"}"
	},
	
	skybox: {
		vertexShader: 
			"attribute mediump vec3 aVertexPosition; " +
			
			"uniform mediump mat4 uMVPMatrix; " +
			
			"varying mediump vec3 vTextureCoord;" +
			
			"void main(void){ " + 
				"mediump vec4 vPos = uMVPMatrix * vec4(aVertexPosition, 1.0); " +
				"gl_Position = vPos.xyww; " +
				"vTextureCoord = aVertexPosition; " +
			"} ",
			
		fragmentShader:
			"uniform samplerCube uCubemap; " +
			
			"varying mediump vec3 vTextureCoord;" +  
			
			"void main(void){ " +
			    "gl_FragColor = textureCube(uCubemap, vTextureCoord); " +
			"}"
	},
	
	modulars: {
		specular_in: 
			"uniform bool uUseSpecularMap; " +
			"uniform sampler2D uSpecularMapSampler; " +
			"uniform lowp vec3 uSpecularColor; ",
			
		specular_main: 
			"lowp float shininess = uShininess; " + 
			"if (uUseSpecularMap){ " +
				"shininess = texture2D(uSpecularMapSampler, vec2(tx, ty)).r * 255.0; " +
			"} " +
			
			"if (shininess > 0.0 && shininess < 255.0){ " +
				"mediump vec3 halfAngle = normalize(cameraDirection + lightDirection); " +
				"mediump float specDot = max(dot(halfAngle, normal), 0.0); " +
				"color += vec4(uSpecularColor, 1.0) * pow(specDot, shininess); " + 
			"} ",
			
		shadowmap_in: 
			"uniform sampler2D uShadowMaps[8]; " +
			functions.calcShadowFactor +
			functions.getLightPosition,
		
		shadowmap_main:
			"if (l.castShadow){ " +
            	"shadowWeight = calcShadowFactor(uShadowMaps[i], getLightPosition(shadowIndex++), l.shadowStrength, l.lightMult); " +
            "} " 
	}
};