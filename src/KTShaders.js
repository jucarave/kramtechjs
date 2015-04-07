module.exports = {
	attributes: [
		{name: 'aVertexPosition', type: 'v3'},
		{name: 'aVertexColor', type: 'v4'},
		{name: 'aTextureCoord', type: 'v2'},
		
		{name: 'aVertexNormal', type: 'v3'}
	],
	uniforms: [
		{name: 'uTransformationMatrix', type: 'm4'},
		{name: 'uPerspectiveMatrix', type: 'm4'},
		{name: 'uMaterialColor', type: 'v4'},
		{name: 'uTextureSampler', type: 'tex'},
		{name: 'uHasTexture', type: 'bool'},
		
		{name: 'uUseLighting', type: 'bool'},
		{name: 'uNormalMatrix', type: 'm3'},
		{name: 'uLightDirection', type: 'v3'},
		{name: 'uLightDirectionColor', type: 'v3'},
		{name: 'uLightDirectionIntensity', type: 'f'}
	],
	vertexShader: 
		"attribute mediump vec2 aTextureCoord; " +
		"attribute mediump vec3 aVertexPosition; " +
		"attribute mediump vec4 aVertexColor; " +
		
		"attribute mediump vec3 aVertexNormal; " + 
		
		
		
		"uniform mediump mat4 uTransformationMatrix; " + 
		"uniform mediump mat4 uPerspectiveMatrix; " +
		"uniform mediump vec4 uMaterialColor; " +
		
		"uniform bool uUseLighting; " +
		"uniform mediump mat3 uNormalMatrix; " +
		"uniform mediump vec3 uLightDirection; " +
		"uniform mediump vec3 uLightDirectionColor; " +
		"uniform mediump float uLightDirectionIntensity; " +  
		
		
		
		"varying mediump vec4 vVertexColor; " +
		"varying mediump vec2 vTextureCoord;" +  
		"varying mediump vec3 vLightWeight; " + 
		
		"void basic(void){" +
			"vVertexColor = aVertexColor * uMaterialColor; " +
			"vTextureCoord = aTextureCoord; " +  
		"} "  + 
		
		"void lambert(void){ " +
			"if (uUseLighting){ " + 
				"vec3 transformedNormal = uNormalMatrix * aVertexNormal; " +
				"float dirLightWeight = max(dot(transformedNormal, uLightDirection), 0.0); " +
				"vLightWeight = uLightDirectionColor * dirLightWeight * uLightDirectionIntensity; " +
			"}else{ " +
				"vLightWeight = vec3(1.0); " + 
			"}" +   
			 
			"vVertexColor = aVertexColor * uMaterialColor; " +
			"vTextureCoord = aTextureCoord; " +  
		"} " +  
		
		"void main(void){ " + 
			"gl_Position = uPerspectiveMatrix * uTransformationMatrix * vec4(aVertexPosition, 1.0); " +
		
			"lambert();" +
		"} " ,
	fragmentShader: 
		"uniform sampler2D uTextureSampler; " +
		"uniform bool uHasTexture; " +
		
		"varying mediump vec2 vTextureCoord; " + 
		"varying mediump vec4 vVertexColor; " + 
		"varying mediump vec3 vLightWeight; " + 
		
		"void basic(mediump vec4 color){" +
			"gl_FragColor = color;" + 
		"} "  + 
		
		"void lambert(mediump vec4 color){ " +
			"color.rgb *= vLightWeight; " + 
			"gl_FragColor = color; " + 
		"} " +  
		
		"void main(void){ " +
			"mediump vec4 color = vVertexColor; " + 
			"if (uHasTexture){ " + 
				"mediump vec4 texColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t)); " +
				"color *= texColor; " +
			"} " + 
			
			"lambert(color);" + 
		"}"
};
