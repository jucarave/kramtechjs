module.exports = {
	basic: {
		vertexShader: 
			"attribute mediump vec2 aTextureCoord; " +
			"attribute mediump vec3 aVertexPosition; " +
			"attribute mediump vec4 aVertexColor; " +
			
			"uniform mediump mat4 uMVPMatrix; " +
			"uniform mediump vec4 uMaterialColor; " +
			
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
			"uniform mediump vec2 uTextureRepeat; " +
			"uniform mediump vec2 uTextureOffset; " +
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
			"attribute mediump vec2 aTextureCoord; " +
			"attribute mediump vec3 aVertexPosition; " +
			"attribute mediump vec4 aVertexColor; " +
			
			"attribute mediump vec3 aVertexNormal; " + 
			
			
			"uniform mediump mat4 uMVMatrix; " +
			"uniform mediump mat4 uPMatrix; " +
			"uniform mediump vec4 uMaterialColor; " +
			
			"uniform bool uUseLighting; " +
			"uniform mediump mat4 uModelMatrix; " +
			"uniform mediump mat3 uNormalMatrix; " +
			
			"uniform mediump vec3 uAmbientLightColor; " +
			
			"uniform mediump vec3 uLightDirection; " +
			"uniform mediump vec3 uLightDirectionColor; " +
			"uniform mediump float uLightDirectionIntensity; " +  
			
			"uniform mediump vec3 uLightPointPosition; " +
			"uniform mediump vec3 uLightPointColor; " +
			"uniform mediump float uLightPointIntensity; " +
			"uniform mediump float uLightPointDistance; " + 

			
			"varying mediump vec4 vVertexColor; " +
			"varying mediump vec2 vTextureCoord;" +  
			"varying mediump vec3 vLightWeight; " + 
			
			"void main(void){ " + 
				"vec4 modelViewPosition = uMVMatrix * vec4(aVertexPosition, 1.0); " +
				"gl_Position = uPMatrix * modelViewPosition; " +
			
				"if (uUseLighting){ " + 
					"vec3 transformedNormal = uNormalMatrix * aVertexNormal; " +
					"vLightWeight = uAmbientLightColor; " +
					
					"float dirLightWeight = max(dot(transformedNormal, uLightDirection), 0.0); " +
					"vLightWeight += (uLightDirectionColor * dirLightWeight * uLightDirectionIntensity); " +
					
					"vec3 vertexModelPosition = (uModelMatrix * vec4(aVertexPosition, 1.0)).xyz; " +
					"vec3 lightDist = uLightPointPosition - vertexModelPosition;" +
					"float distance = length(lightDist); " +
					"if (distance <= uLightPointDistance){ " +
						"vec3 pointLightDirection = normalize(lightDist); " +
						"float pointLightWeight = max(dot(transformedNormal, pointLightDirection), 0.0); " +
						"vLightWeight += (uLightPointColor * pointLightWeight * uLightPointIntensity) / distance; " +
					"} " +
				"}else{ " +
					"vLightWeight = vec3(1.0); " + 
				"}" +   
				 
				"vVertexColor = aVertexColor * uMaterialColor; " +
				"vTextureCoord = aTextureCoord; " +  
			"} " ,
			
		fragmentShader: 
			"uniform sampler2D uTextureSampler; " +
			"uniform bool uHasTexture; " +
			"uniform mediump float uOpacity; " +
			"uniform mediump vec2 uTextureRepeat; " +
			"uniform mediump vec2 uTextureOffset; " +
			"uniform mediump vec4 uGeometryUV; " +
			
			"varying mediump vec2 vTextureCoord; " + 
			"varying mediump vec4 vVertexColor; " + 
			"varying mediump vec3 vLightWeight; " + 
			
			"void main(void){ " +
				"mediump vec4 color = vVertexColor; " + 
				"if (uHasTexture){ " + 
					"mediump float tx = uGeometryUV.x + mod(uTextureOffset.x + vTextureCoord.s * uTextureRepeat.x - uGeometryUV.x, uGeometryUV.z - uGeometryUV.x);" +
					"mediump float ty = uGeometryUV.y + mod(uTextureOffset.y + vTextureCoord.t * uTextureRepeat.y - uGeometryUV.y, uGeometryUV.w - uGeometryUV.y);" +
					
					"mediump vec4 texColor = texture2D(uTextureSampler, vec2(tx, ty)); " +
					"color *= texColor; " +
				"} " + 
				
				"color.rgb *= vLightWeight; " + 
				"gl_FragColor = vec4(color.rgb, color.a * uOpacity); " + 
			"}"
	},
	
	
	phong: {
		vertexShader: 
			"attribute mediump vec2 aTextureCoord; " +
			"attribute mediump vec3 aVertexPosition; " +
			"attribute mediump vec4 aVertexColor; " +
			
			"attribute mediump vec3 aVertexNormal; " + 
			
			
			"uniform mediump mat4 uMVMatrix; " +
			"uniform mediump mat4 uPMatrix; " +
			"uniform mediump vec4 uMaterialColor; " +
			
			"uniform bool uUseLighting; " +
			"uniform mediump mat4 uModelMatrix; " +
			"uniform mediump mat3 uNormalMatrix; " +
			
			"uniform mediump vec3 uAmbientLightColor; " +
			
			"varying mediump vec4 vVertexColor; " +
			"varying mediump vec2 vTextureCoord;" +  
			"varying mediump vec3 vLightWeight; " +
			"varying mediump vec3 vNormal; " + 
			"varying mediump vec3 vPosition; " +
			
			"void main(void){ " + 
				"vec4 modelViewPosition = uMVMatrix * vec4(aVertexPosition, 1.0); " +
				"gl_Position = uPMatrix * modelViewPosition; " +
			
				"if (uUseLighting){ " + 
					"vNormal = uNormalMatrix * aVertexNormal; " +
					"vLightWeight = uAmbientLightColor; " +
				"}else{ " +
					"vLightWeight = vec3(1.0); " + 
				"}" +   
				 
				"vPosition = (uModelMatrix * vec4(aVertexPosition, 1.0)).xyz; " +
				"vVertexColor = aVertexColor * uMaterialColor; " +
				"vTextureCoord = aTextureCoord; " +  
			"} " ,
			
		fragmentShader: 
			"uniform sampler2D uTextureSampler; " +
			"uniform bool uHasTexture; " +
			"uniform bool uUseLighting; " +
			"uniform mediump float uOpacity; " +
			"uniform mediump vec2 uTextureRepeat; " +
			"uniform mediump vec2 uTextureOffset; " +
			"uniform mediump vec4 uGeometryUV; " +
			"uniform mediump vec3 uCameraPosition; " +
			
			"uniform mediump vec3 uSpecularColor; " +
			"uniform mediump float uShininess; " +
			
			
			"uniform mediump vec3 uLightDirection; " +
			"uniform mediump vec3 uLightDirectionColor; " +
			"uniform mediump float uLightDirectionIntensity; " +  
			
			"uniform mediump vec3 uLightPointPosition; " +
			"uniform mediump vec3 uLightPointColor; " +
			"uniform mediump float uLightPointIntensity; " +
			"uniform mediump float uLightPointDistance; " +
			
			"varying mediump vec2 vTextureCoord; " + 
			"varying mediump vec4 vVertexColor; " + 
			"varying mediump vec3 vLightWeight; " + 
			"varying mediump vec3 vNormal; " + 
			"varying mediump vec3 vPosition; " +
			
			"void main(void){ " +
				"mediump vec4 color = vVertexColor; " +
				"mediump vec3 normal = normalize(vNormal); " +
				"mediump vec3 cameraDirection = normalize(uCameraPosition); " +
				
				"if (uHasTexture){ " + 
					"mediump float tx = uGeometryUV.x + mod(uTextureOffset.x + vTextureCoord.s * uTextureRepeat.x - uGeometryUV.x, uGeometryUV.z - uGeometryUV.x);" +
					"mediump float ty = uGeometryUV.y + mod(uTextureOffset.y + vTextureCoord.t * uTextureRepeat.y - uGeometryUV.y, uGeometryUV.w - uGeometryUV.y);" +
					
					"mediump vec4 texColor = texture2D(uTextureSampler, vec2(tx, ty)); " +
					"color *= texColor; " +
				"} " + 
				
				"mediump vec3 phongLightWeight = vec3(0.0); " + 
				"if (uUseLighting){ " +
					"mediump float dirLightWeight = max(dot(normal, uLightDirection), 0.0); " +
					"phongLightWeight += (uLightDirectionColor * dirLightWeight * uLightDirectionIntensity); " +
					
					"mediump vec3 lightDist = uLightPointPosition - vPosition; " +
					"mediump float distance = length(lightDist); " +
					"if (distance <= uLightPointDistance){ " +
						"mediump vec3 pointLightDirection = normalize(lightDist); " +
						"mediump float pointLightWeight = max(dot(normal, pointLightDirection), 0.0); " +
						"phongLightWeight += (uLightPointColor * pointLightWeight * uLightPointIntensity) / (distance / 2.0); " +
					"} " +
					
					"if (uShininess > 0.0){ " + 
						"mediump vec3 halfAngle = normalize(cameraDirection + uLightDirection); " +
						"mediump float specDot = max(dot(halfAngle, normal), 0.0); " +
						"color += vec4(uSpecularColor, 1.0) * pow(specDot, uShininess); " +
					"} " +
				"} " +
				
				"color.rgb *= vLightWeight + phongLightWeight; " + 
				"gl_FragColor = vec4(color.rgb, color.a * uOpacity); " + 
			"}"
	}
};